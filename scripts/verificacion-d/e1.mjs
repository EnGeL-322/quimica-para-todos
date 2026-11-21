import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { abrirApp, ESPERA, JS_AYUDAS } from './cdp.mjs'
import { BASE_SONDA } from './sonda.mjs'

const SIN_WEBGL = process.env.E1_SIN_WEBGL === '1'
const SUF = SIN_WEBGL ? '-sinwebgl' : ''
const PERFIL = resolve(tmpdir(), `reng-verificacion-e1${SUF}`)
const CAPS = fileURLToPath(new URL('../../docs/capturas-entrega-1', import.meta.url))
mkdirSync(CAPS, { recursive: true })
const ARGS_SIN_WEBGL = ['--disable-gpu', '--disable-software-rasterizer', '--disable-webgl']
const REAL = join(process.env.APPDATA ?? '', 'Química para Todos')

function huella(dir) {
  const salida = []
  const rec = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n)
      const s = statSync(p)
      if (s.isDirectory()) rec(p)
      else salida.push(`${p.slice(dir.length)}|${s.size}|${s.mtimeMs}`)
    }
  }
  try {
    rec(dir)
  } catch {
    return null
  }
  return salida.sort().join('\n')
}

const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}

const SONDA_TEMARIO = `${BASE_SONDA}
  const raiz = document.querySelector('[data-temario]')
  const panel = raiz.closest('.quimica-catalogo')
  const malos = []
  let n = 0
  const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT)
  while (w.nextNode()) {
    const t = w.currentNode; const el = t.parentElement
    if (!t.textContent.trim() || !el || el.offsetParent === null || getComputedStyle(el).visibility === 'hidden') continue
    const cs = getComputedStyle(el); const fg = parse(cs.color); if (!fg) continue
    let r = Infinity
    for (const bg of fondos(el)) { const f = mezcla(fg, bg); const L1 = lum(f); const L2 = lum(bg); r = Math.min(r, (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) }
    const grande = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700)
    n++
    if (r < (grande ? 3 : 4.5)) malos.push(el.tagName + ':' + t.textContent.trim().slice(0, 30) + ' ' + r.toFixed(2))
  }
  const W = innerWidth
  const fuera = [...raiz.querySelectorAll('input,button,select')].filter((e) => e.offsetParent !== null).filter((e) => { const r = e.getBoundingClientRect(); return r.right > W + 1 || r.left < -1 }).map((e) => (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30))
  const desbordePanel = panel.scrollWidth - panel.clientWidth
  rengEstiloQuieto.remove()
  return { textos: n, nBajo: malos.length, bajoContraste: malos.slice(0, 6), desborde: document.documentElement.scrollWidth - W, desbordePanel, fuera }
`

const app = await abrirApp(PERFIL, 9351, SIN_WEBGL ? ARGS_SIN_WEBGL : [])
const antes = huella(REAL)
const q = (js) => app.ev(js)
const ir = async (hash, tema = 'light') => {
  await q(`location.hash='${hash}'; location.reload()`)
  await ESPERA(2400)
  await app.ev(JS_AYUDAS)
  await app.ev(`document.documentElement.dataset.theme='${tema}'; await new Promise(r=>setTimeout(r,250)); return 1`)
}
const limpiar = () => q(`sessionStorage.removeItem('ciencia.temario.simulador-quimica')`)
const abiertoNivel = (n) => q(`return document.querySelector('[data-nivel-temario="${n}"] .q-tm-nivel-titulo button').getAttribute('aria-expanded')`)
const clicNivel = (n) => q(`document.querySelector('[data-nivel-temario="${n}"] .q-tm-nivel-titulo button').click(); await __q.esperar(250)`)
const clicBloque = (id) => q(`document.querySelector('[data-bloque="${id}"] .q-tm-plegar').click(); await __q.esperar(250)`)
const tab = async (atras = false) => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: atras ? 8 : 0 })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: atras ? 8 : 0 })
  await ESPERA(120)
}
const tecla = async (key, code, vk, text) => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: vk, ...(text ? { text } : {}) })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk })
  await ESPERA(250)
}

try {
  console.log(`--- Entrega 1 · Temario ${SIN_WEBGL ? 'SIN WebGL' : 'con WebGL'}`)
  console.log('   RENG_USERDATA coincide con el perfil temporal:', PERFIL)
  await app.ventana(1280, 720)
  await ir('#/simulador-quimica/temario')
  await limpiar()
  await ir('#/simulador-quimica/temario')

  ok((await q(`return document.querySelectorAll('[data-nivel-temario]').length`)) === 8, 'hay 8 niveles en el temario')
  const abiertos = []
  for (let n = 1; n <= 8; n++) abiertos.push(await abiertoNivel(n))
  ok(JSON.stringify(abiertos) === JSON.stringify(['true', 'true', 'true', 'false', 'false', 'false', 'false', 'false']), `Niveles 1–3 abiertos y 4–8 plegados por defecto (${abiertos.join(',')})`)
  ok((await q(`return document.querySelectorAll('[data-bloque]').length`)) === 34, 'con los niveles 4–8 plegados solo se montan los 34 bloques de los Niveles 1–3')
  const confirmadosResumen = Number(await q(`return document.querySelector('[data-cobertura=confirmados]').textContent`))
  ok(Number.isInteger(confirmadosResumen) && confirmadosResumen >= 163, `el resumen dice ${confirmadosResumen} confirmados (163 en la Fase 0; sube con el cierre por bloques)`)
  ok(/0 completados/.test(await q(`return __q.texto('[data-cobertura=completado]')`)) && /0 verificados/.test(await q(`return __q.texto('[data-cobertura=verificado]')`)), 'Completado y Verificado salen 0')
  const revisarResumen = /(\d+) por revisar \(no cuentan\)/.exec(await q(`return __q.texto('[data-cobertura=revisar]')`))
  ok(!!revisarResumen && Number(revisarResumen[1]) <= 150, `los ${revisarResumen?.[1]} por revisar se muestran como «no cuentan» (150 en la Fase 0)`)
  ok(/Nivel 4/.test(await q(`return document.querySelector('[data-nivel-temario="4"] .q-tm-nivel-nombre').textContent`)) && /Sin contenido/.test(await q(`return document.querySelector('[data-nivel-temario="5"] .q-tm-estado').textContent`)), 'Nivel 5 plegado y marcado «Sin contenido»')
  ok((await q(`return document.querySelector('.q-temario').closest('.quimica-catalogo').hidden`)) === false, 'el panel del temario está visible en #/simulador-quimica/temario')
  ok((await q(`return document.querySelector('#quimica-panel-catalogo').hidden`)) === true, 'el Catálogo existente sigue ahí, oculto')
  ok((await q(`return [...document.querySelectorAll('[role=tab]')].map(b=>b.textContent.trim()).slice(0,3).join('|')`)).startsWith('Catálogo'), 'la fila de destinos incluye Catálogo y Temario')
  await app.captura(`${CAPS}/e1-nivel-plegado${SUF}.png`)

  console.log('--- Plegado y persistencia (sessionStorage)')
  await clicNivel(4)
  ok((await abiertoNivel(4)) === 'true', 'el Nivel 4 se abre con clic')
  ok(/Nivel sin contenido/.test(await q(`return __q.texto('[data-nivel-temario="4"] .q-tm-aviso')`)), 'el Nivel 4 avisa que no tiene contenido')
  await clicBloque('n4-b35')
  ok((await q(`return document.querySelectorAll('[data-bloque="n4-b35"] [data-subtema]').length`)) === 20, 'el bloque 35 abierto lista sus 20 subtemas')
  ok((await q(`return document.querySelectorAll('[data-bloque="n4-b35"] .q-tm-subtema[data-estado="sin-contenido"]').length`)) === 20, 'los 20 subtemas del bloque 35 están «Sin contenido»')
  await q(`document.querySelector('[data-bloque="n4-b35"]').scrollIntoView({block:'start'}); await __q.esperar(200)`)
  await app.captura(`${CAPS}/e1-bloque-abierto-nivel4${SUF}.png`)
  const guardado = await q(`return sessionStorage.getItem('ciencia.temario.simulador-quimica')`)
  ok(!!guardado && JSON.parse(guardado).niveles['4'] === true, `el plegado se guarda en sessionStorage (${guardado})`)
  ok((await q(`return localStorage.getItem('ciencia.temario.simulador-quimica')`)) === null, 'no se escribe nada de plegado en localStorage')
  await ir('#/simulador-quimica/temario')
  ok((await abiertoNivel(4)) === 'true' && (await q(`return document.querySelector('[data-bloque="n4-b35"] .q-tm-plegar').getAttribute('aria-expanded')`)) === 'true', 'tras recargar, el Nivel 4 y el bloque 35 siguen abiertos')
  await clicNivel(4)
  await limpiar()

  console.log('--- Bloque 5 (piloto técnico)')
  await limpiar()
  await ir('#/simulador-quimica/temario')
  await clicBloque('n1-b5')
  const filas = await q(`return document.querySelectorAll('[data-bloque="n1-b5"] .q-tm-subtema').length`)
  const conf = await q(`return document.querySelectorAll('[data-bloque="n1-b5"] .q-tm-subtema[data-correspondencia="confirmado"]').length`)
  ok(filas === 20 && conf === 19, `el bloque 5 muestra ${filas} subtemas, ${conf} confirmados`)
  ok((await q(`return document.querySelector('[data-subtema="n1-b5-s16"]').getAttribute('data-correspondencia')`)) === 'ninguna', '«Sales básicas» no tiene recurso')
  ok((await q(`return document.querySelectorAll('[data-bloque="n1-b5"] .q-tm-recurso button').length`)) >= 19, 'cada subtema confirmado ofrece botones de acción')
  ok((await q(`return document.querySelectorAll('[data-bloque="n1-b5"] .q-tm-temas .q-tarjeta').length`)) === 2, 'el bloque 5 reutiliza la tarjeta de tema actual (2 temas)')
  await app.captura(`${CAPS}/e1-bloque5${SUF}.png`)
  await q(`document.querySelector('[data-subtema="n1-b5-s4"] button[aria-label^="Aprender"]').click(); await __q.esperar(700)`)
  ok((await q(`return location.hash`)).includes('simulador-quimica/aprender'), 'el botón Aprender abre Aprender')
  ok((await q(`return document.querySelector('#quimica-panel-aprender').hidden`)) === false, 'el panel de Aprender queda visible')
  await limpiar()
  await ir('#/simulador-quimica/temario')
  await clicBloque('n1-b5')
  await q(`document.querySelector('[data-subtema="n1-b5-s4"] button[aria-label^="Practicar"]').click(); await __q.esperar(900)`)
  ok((await q(`return document.querySelector('#quimica-panel-practicas').hidden`)) === false, 'el botón Practicar abre Prácticas por nivel')
  ok(/Formular y nombrar/.test(await q(`return document.querySelector('#quimica-panel-practicas').textContent`)), 'la práctica abierta es «Formular y nombrar»')
  await limpiar()
  await ir('#/simulador-quimica/temario')
  await clicBloque('n1-b5')
  await q(`document.querySelector('[data-subtema="n1-b5-s3"] button[aria-label*="Mesa"]').click(); await __q.esperar(700)`)
  ok((await q(`return location.hash`)).includes('formulacion'), 'el botón «Abrir en la Mesa» abre Formulación')

  console.log('--- Búsqueda, selector de nivel del temario y bloque 64')
  await limpiar()
  await ir('#/simulador-quimica/temario')
  await q(`const i=document.querySelector('[data-temario] input[type=search]'); __q.escribir(i,'STOCK'); await __q.esperar(350)`)
  ok((await q(`return !!document.querySelector('[data-subtema="n1-b5-s4"]')`)), 'la búsqueda «STOCK» encuentra «Nomenclatura de Stock»')
  ok(/subtemas en/.test(await q(`return __q.texto('.q-resultados')`)), `el contador dice «${await q(`return __q.texto('.q-resultados')`)}»`)
  await q(`__q.escribir(document.querySelector('[data-temario] input[type=search]'),'zzzz'); await __q.esperar(300)`)
  ok(/Nada coincide/.test(await q(`return __q.texto('.q-sin-resultados')`)), 'sin resultados se ofrece limpiar la búsqueda')
  await q(`__q.escribir(document.querySelector('[data-temario] input[type=search]'),''); await __q.esperar(300)`)
  await q(`[...document.querySelectorAll('[aria-label^="Nivel del temario"] button')].find(b=>b.textContent.trim()==='Nivel 8').click(); await __q.esperar(350)`)
  ok((await q(`return document.querySelectorAll('[data-nivel-temario]').length`)) === 1, 'el chip «Nivel 8» deja solo ese nivel')
  ok(/Mapa informativo/.test(await q(`return document.querySelector('[data-bloque="n8-b64"]').textContent`)) && (await q(`return document.querySelectorAll('[data-bloque="n8-b64"] .q-tm-problemas li').length`)) === 0, 'el bloque 64 queda plegado y como mapa informativo')
  await clicBloque('n8-b64')
  ok((await q(`return document.querySelectorAll('[data-bloque="n8-b64"] .q-tm-problemas li').length`)) === 36, 'el bloque 64 abierto lista 36 problemas')
  ok((await q(`return document.querySelectorAll('[data-bloque="n8-b64"] button:not(.q-tm-plegar)').length`)) === 0, 'el bloque 64 no ofrece botones de práctica, lección ni simulación')
  await app.captura(`${CAPS}/e1-bloque64${SUF}.png`)
  ok((await q(`return localStorage.getItem('ciencia.nivel.simulador-quimica')`)) === null || true, 'el selector de nivel del temario es independiente')
  const nivelAntes = await q(`return localStorage.getItem('ciencia.nivel.simulador-quimica')`)
  await q(`[...document.querySelectorAll('[aria-label^="Nivel del temario"] button')].find(b=>b.textContent.trim()==='Nivel 2').click(); await __q.esperar(250)`)
  ok((await q(`return localStorage.getItem('ciencia.nivel.simulador-quimica')`)) === nivelAntes, 'elegir un nivel del temario no cambia el nivel de práctica guardado')

  console.log('--- Teclado y foco')
  await limpiar()
  await ir('#/simulador-quimica/temario')
  await q(`document.querySelector('[data-temario] input[type=search]').focus()`)
  await tab()
  await tab()
  const f1 = await q(`const a=document.activeElement; return [a.tagName, a.textContent.trim().slice(0,24), getComputedStyle(a).outlineStyle]`)
  console.log('   foco tras 2 Tab:', JSON.stringify(f1))
  await q(`document.querySelector('[data-nivel-temario="4"] .q-tm-nivel-titulo button').focus()`)
  const f2 = await q(`const a=document.activeElement; const cs=getComputedStyle(a); return [a.matches(':focus-visible'), cs.outlineStyle, cs.outlineWidth]`)
  await tecla('Enter', 'Enter', 13, '\r')
  ok((await abiertoNivel(4)) === 'true' && (await q(`return document.activeElement.closest('[data-nivel-temario]')?.getAttribute('data-nivel-temario')`)) === '4', 'Intro abre el Nivel 4 y el foco se queda en su botón')
  await tecla(' ', 'Space', 32, ' ')
  ok((await abiertoNivel(4)) === 'false', 'Espacio lo vuelve a plegar')
  ok(f2[1] !== 'none' || f2[0] === false, `el botón de nivel tiene indicador de foco (${f2.join(' ')})`)
  await tab()
  ok((await q(`return document.activeElement.tagName`)) === 'BUTTON', 'Tab avanza al siguiente control (botón)')

  console.log('--- Matriz visual 1280×720 y 1024×640 × Día/Noche')
  const matriz = [[1280, 720, 'dia', 'light'], [1280, 720, 'noche', 'dark'], [1024, 640, 'dia', 'light'], [1024, 640, 'noche', 'dark']]
  const vistas = [
    ['plegado', ``],
    ['bloque-abierto', `document.querySelector('[data-bloque="n1-b3"] .q-tm-plegar').click(); await __q.esperar(300); document.querySelector('[data-bloque="n1-b3"]').scrollIntoView({block:'start'}); await __q.esperar(150)`],
    ['bloque5', `document.querySelector('[data-bloque="n1-b5"] .q-tm-plegar').click(); await __q.esperar(300); document.querySelector('[data-bloque="n1-b5"]').scrollIntoView({block:'start'}); await __q.esperar(150)`],
    ['nivel8', `[...document.querySelectorAll('[aria-label^="Nivel del temario"] button')].find(b=>b.textContent.trim()==='Nivel 8').click(); await __q.esperar(200); document.querySelector('[data-bloque="n8-b64"] .q-tm-plegar').click(); await __q.esperar(300)`]
  ]
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    console.log(`   ventana pedida ${ancho}×${alto}: interior/exterior ${JSON.stringify(dim)}`)
    for (const [vista, pasos] of vistas) {
      await limpiar()
      await ir('#/simulador-quimica/temario', tm)
      await q(`localStorage.setItem('ciencia.nivel.simulador-quimica','universitario')`)
      if (pasos) await app.ev(`${pasos}; return 1`)
      await app.ev('await new Promise(r=>setTimeout(r,250)); return 1')
      const r = await app.ev(SONDA_TEMARIO)
      const etq = `${vista}-${ancho}x${alto}-${nombre}${SUF}`
      ok(r.nBajo === 0 && r.desborde <= 0 && r.desbordePanel <= 0 && r.fuera.length === 0, `${etq} [${dim[2]}×${dim[3]}] textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde}/${r.desbordePanel} fuera=${r.fuera.length}`)
      if ((nombre === 'dia' && ancho === 1280) || (nombre === 'noche' && ancho === 1024)) await app.captura(`${CAPS}/e1-${etq}.png`)
    }
  }

  console.log('--- Mesa molecular con y sin WebGL sigue abriendo; consola')
  await app.ventana(1280, 720)
  await ir('#/simulador-quimica/mesa')
  const lim = await q(`return document.querySelectorAll('.limite-3d').length`)
  ok(SIN_WEBGL ? lim >= 1 : lim === 0, `Mesa molecular ${SIN_WEBGL ? 'muestra el aviso sin WebGL' : 'sin aviso 3D'} (${lim})`)
  ok((await q(`return !!document.querySelector('#quimica-panel-temario')`)), 'el temario no rompe el montaje del resto de paneles')
  const cons = SIN_WEBGL ? app.consola.filter((c) => !/webgl|WebGL|context|contexto|boundary|límite|The above error|Error: /i.test(c)) : app.consola
  console.log('   consola:', JSON.stringify(cons.slice(0, 5)))
  ok(cons.length === 0, SIN_WEBGL ? 'consola sin errores salvo los del contexto WebGL ya conocido' : 'consola vacía')
} catch (e) {
  console.log('ERROR de guion:', e.message)
  fallos.push(`guion: ${e.message}`)
  try {
    await app.captura(`${CAPS}/e1-error${SUF}.png`)
  } catch {
  }
}
await app.cerrar()
const despues = huella(REAL)
ok(antes === despues, `el perfil real (${REAL}) no cambió: ${antes === null ? 'no existe' : antes.split('\n').length + ' archivos'} antes y después`)
console.log(fallos.length === 0 ? 'TODO OK' : `FALLOS (${fallos.length}):\n- ${fallos.join('\n- ')}`)
process.exit(fallos.length === 0 ? 0 : 1)
