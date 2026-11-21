import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PROYECTO = 'D:\\appescritorio\\quimica-para-todos'
export const ESPERA = (ms) => new Promise((r) => setTimeout(r, ms))

export async function abrirApp(perfil, puerto = 9341, argsExtra = [], carpetaApp = PROYECTO) {
  rmSync(perfil, { recursive: true, force: true })
  mkdirSync(perfil, { recursive: true })
  const proc = spawn(resolve(PROYECTO, 'node_modules/electron/dist/electron.exe'), ['.', `--remote-debugging-port=${puerto}`, ...argsExtra], { cwd: carpetaApp, env: { ...process.env, RENG_PERFIL_PRUEBA: perfil }, stdio: ['ignore', 'pipe', 'pipe'] })
  let salida = ''
  proc.stdout.on('data', (d) => (salida += d.toString()))
  proc.stderr.on('data', (d) => (salida += d.toString()))
  let userdata = null
  for (let i = 0; i < 100 && !userdata; i++) {
    await ESPERA(150)
    const m = /RENG_USERDATA (.+)/.exec(salida)
    if (m) userdata = m[1].trim()
  }
  if (userdata !== perfil) throw new Error(`RENG_USERDATA no coincide: ${userdata} != ${perfil}`)
  let pagina = null
  for (let i = 0; i < 100 && !pagina; i++) {
    try {
      const lista = await (await fetch(`http://127.0.0.1:${puerto}/json`)).json()
      pagina = lista.find((p) => p.type === 'page' && p.webSocketDebuggerUrl)
    } catch {
    }
    if (!pagina) await ESPERA(200)
  }
  if (!pagina) throw new Error('sin página CDP')
  const ws = new WebSocket(pagina.webSocketDebuggerUrl)
  await new Promise((ok, ko) => {
    ws.onopen = ok
    ws.onerror = ko
  })
  let id = 0
  const pend = new Map()
  const consola = []
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data)
    if (m.id && pend.has(m.id)) {
      const { ok, ko } = pend.get(m.id)
      pend.delete(m.id)
      m.error ? ko(new Error(JSON.stringify(m.error))) : ok(m.result)
    } else if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) consola.push(`${m.params.type}: ${m.params.args.map((a) => a.value ?? a.description).join(' ')}`)
    else if (m.method === 'Runtime.exceptionThrown') consola.push(`excepción: ${m.params.exceptionDetails.text} ${m.params.exceptionDetails.exception?.description ?? ''}`)
  }
  const cmd = (method, params = {}) => new Promise((ok, ko) => {
    const n = ++id
    pend.set(n, { ok, ko })
    ws.send(JSON.stringify({ id: n, method, params }))
  })
  await cmd('Runtime.enable')
  await cmd('Page.enable')
  const ev = async (expr) => {
    const r = await cmd('Runtime.evaluate', { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true })
    if (r.exceptionDetails) throw new Error(`evaluate: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`)
    return r.result.value
  }
  const version = await (await fetch(`http://127.0.0.1:${puerto}/json/version`)).json()
  const wsb = new WebSocket(version.webSocketDebuggerUrl)
  await new Promise((ok, ko) => {
    wsb.onopen = ok
    wsb.onerror = ko
  })
  let idb = 0
  const pendb = new Map()
  wsb.onmessage = (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pendb.has(m.id)) {
      const { ok, ko } = pendb.get(m.id)
      pendb.delete(m.id)
      m.error ? ko(new Error(JSON.stringify(m.error))) : ok(m.result)
    }
  }
  const cmdb = (method, params = {}) => new Promise((ok, ko) => {
    const n = ++idb
    pendb.set(n, { ok, ko })
    wsb.send(JSON.stringify({ id: n, method, params }))
  })
  const ventana = async (ancho, alto) => {
    let medida = [0, 0, 0, 0]
    for (let intento = 0; intento < 4 && (medida[2] < 200 || medida[3] < 200); intento++) {
      await ev(`window.moveTo(0, 0); window.resizeTo(${ancho}, ${alto}); return 1`)
      await ESPERA(700)
      medida = await ev('return [innerWidth, innerHeight, outerWidth, outerHeight]')
    }
    return medida
  }
  const captura = async (ruta) => {
    const r = await cmd('Page.captureScreenshot', { format: 'png' })
    writeFileSync(ruta, Buffer.from(r.data, 'base64'))
  }
  const tecla = async (key, code, extra = {}) => {
    await cmd('Input.dispatchKeyEvent', { type: 'keyDown', key, code, ...extra })
    await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key, code, ...extra })
  }
  const cerrar = async () => {
    try {
      ws.close()
    } catch {
    }
    proc.kill()
    await ESPERA(300)
  }
  return { cmd, ev, ventana, captura, tecla, cerrar, consola, salida: () => salida }
}

export const JS_AYUDAS = `
  window.__q = {
    esperar: (ms) => new Promise((r) => setTimeout(r, ms)),
    boton: (txt) => [...document.querySelectorAll('button')].find((b) => b.offsetParent !== null && b.textContent.trim() === txt),
    botonCon: (txt) => [...document.querySelectorAll('button')].find((b) => b.offsetParent !== null && b.textContent.includes(txt)),
    campo: (etiqueta) => [...document.querySelectorAll('.sim-campo')].filter((c) => c.offsetParent !== null).find((c) => c.querySelector('span')?.textContent.trim() === etiqueta)?.querySelector('input'),
    escribir: (el, v) => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })) },
    visible: (sel) => [...document.querySelectorAll(sel)].filter((e) => e.offsetParent !== null),
    texto: (sel) => [...document.querySelectorAll(sel)].filter((e) => e.offsetParent !== null).map((e) => e.textContent.trim().replace(/\\s+/g, ' ')).join(' | '),
  }
`
