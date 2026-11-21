import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { abrirApp, ESPERA, JS_AYUDAS, PROYECTO } from '../verificacion-d/cdp.mjs'
import { BASE_SONDA } from '../verificacion-d/sonda.mjs'

const SIN_WEBGL = process.env.E0_SIN_WEBGL === '1'
const SABOTAJE = process.argv.includes('--sabotaje')
const SUF = (SIN_WEBGL ? '-sinwebgl' : '') + (SABOTAJE ? '-sabotaje' : '')
const CAPS = fileURLToPath(new URL('../../docs/capturas-entrega-0', import.meta.url))
mkdirSync(CAPS, { recursive: true })
const ARGS_SIN_WEBGL = ['--disable-gpu', '--disable-software-rasterizer', '--disable-webgl']
const REAL = join(process.env.APPDATA ?? '', 'Química para Todos')
const ECUACIONES_B08 = 48

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

const sonda = (raizSel) => `${BASE_SONDA}
  const raiz = document.querySelector('${raizSel}')
  if (!raiz) { rengEstiloQuieto.remove(); return { falta: true } }
  const caja = raiz.getBoundingClientRect()
  const malos = []
  let n = 0
  const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT)
  while (w.nextNode()) {
    const t = w.currentNode; const el = t.parentElement
    if (!t.textContent.trim() || !el || el.closest('title, desc') || el.closest('[hidden]') || el.closest('.sr-only') || getComputedStyle(el).visibility === 'hidden' || getComputedStyle(el).display === 'none') continue
    const enSvg = !!el.closest('svg')
    if (!enSvg && el.offsetParent === null && !el.closest('math')) continue
    const cs = getComputedStyle(el); const fg = parse(enSvg ? cs.fill : cs.color); if (!fg) continue
    let r = Infinity
    for (const bg of fondos(el)) { const f = mezcla(fg, bg); const L1 = lum(f); const L2 = lum(bg); r = Math.min(r, (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) }
    const grande = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700)
    n++
    if (r < (grande ? 3 : 4.5)) malos.push(el.tagName + ':' + t.textContent.trim().slice(0, 30) + ' ' + r.toFixed(2))
  }
  const W = innerWidth
  const fuera = [...raiz.querySelectorAll('input,button,select')].filter((e) => e.offsetParent !== null).filter((e) => { const r = e.getBoundingClientRect(); return r.right > W + 1 || r.left < -1 || r.width === 0 || r.height === 0 }).map((e) => (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30))
  const ecDesbordan = [...raiz.querySelectorAll('.q-ec--bloque')].filter((e) => e.scrollWidth > e.clientWidth + 1 && e.getAttribute('tabindex') !== '0').length
  rengEstiloQuieto.remove()
  return { ancho: caja.width, alto: caja.height, texto: raiz.textContent.trim().length, textos: n, nBajo: malos.length, bajoContraste: malos.slice(0, 6), desborde: document.documentElement.scrollWidth - W, fuera, ecDesbordan }
`

const ESTADO_ECUACIONES = (raizSel) => `
  const ecs = [...document.querySelectorAll('${raizSel} .q-ec')]
  return ecs.map((e) => {
    const m = e.querySelector('math'); const r = m ? m.getBoundingClientRect() : null
    const tx = e.querySelector('[data-ecuacion-texto]')
    return { estado: e.dataset.ecuacion, ancho: r ? Math.round(r.width) : 0, alto: r ? Math.round(r.height) : 0, error: !!e.querySelector('merror, .temml-error'), texto: tx ? tx.textContent : '', claseTexto: tx ? tx.className : '', textoVisible: tx ? tx.getBoundingClientRect().width > 1 : false, numero: (e.querySelector('.q-ec-numero')?.textContent ?? ''), oculto: m ? m.getAttribute('aria-hidden') : null, fuente: m ? getComputedStyle(m).fontFamily : '' }
  })
`

async function esperarSinCarga(app, raizSel) {
  for (let i = 0; i < 40; i++) {
    const n = await app.ev(`return document.querySelectorAll('${raizSel} .q-ec[data-ecuacion="cargando"]').length`)
    if (n === 0) return true
    await ESPERA(150)
  }
  return false
}

const PERFIL_A = resolve(tmpdir(), `reng-verificacion-entrega0-app${SUF}`)
const PERFIL_B = resolve(tmpdir(), `reng-verificacion-entrega0-kit${SUF}`)
const antes = huella(REAL)

async function parteApp() {
  const app = await abrirApp(PERFIL_A, 9371, SIN_WEBGL ? ARGS_SIN_WEBGL : [])
  const q = (js) => app.ev(js)
  const ir = async (hash, tema = 'light') => {
    await q(`location.hash='${hash}'; location.reload()`)
    await ESPERA(2200)
    await app.ev(JS_AYUDAS)
    await app.ev(`document.documentElement.dataset.theme='${tema}'; await new Promise(r=>setTimeout(r,250)); return 1`)
  }
  try {
    console.log(`--- A. App real: ecuaciones del bloque 8 ${SIN_WEBGL ? 'SIN WebGL' : 'con WebGL'} (perfil ${PERFIL_A})`)
    await app.ventana(1280, 720)
    await ir('#/simulador-quimica/aprender')
    const ids = await q(`return [...document.querySelectorAll('[data-indice-n1="aprender"] [data-abrir-n1]')].map((b) => b.getAttribute('data-abrir-n1')).filter((x) => x.startsWith('gas-'))`)
    ok(ids.length === 20, `el índice de Aprender ofrece las 20 lecciones del bloque 8 (${ids.length})`)
    let total = 0
    const malas = []
    let fuentes = new Set()
    for (const id of ids) {
      await ir(`#/simulador-quimica/aprender-${id}`)
      const cargado = await esperarSinCarga(app, '[data-leccion-n1]')
      const ecs = await q(ESTADO_ECUACIONES('[data-leccion-n1] [data-capa="formalizar"]'))
      total += ecs.length
      if (!cargado) malas.push(`${id}: alguna ecuación sigue «cargando»`)
      ecs.forEach((e, i) => {
        fuentes.add(e.fuente.split(',')[0])
        if (e.estado !== 'mathml' || e.ancho <= 0 || e.alto <= 0 || e.error) malas.push(`${id}#${i + 1}: ${e.estado} ${e.ancho}×${e.alto}${e.error ? ' con error' : ''}`)
        if (e.texto.trim().length < 3 || e.claseTexto !== 'sr-only' || e.oculto !== 'true') malas.push(`${id}#${i + 1}: texto legible ausente o MathML no oculto al lector (${e.claseTexto}, ${e.oculto})`)
        if (!/^\(8\.\d{1,2}\.\d\)$/.test(e.numero)) malas.push(`${id}#${i + 1}: numeración «${e.numero}»`)
      })
    }
    ok(total === ECUACIONES_B08, `las 20 lecciones muestran ${total} ecuaciones (esperadas ${ECUACIONES_B08})`)
    ok(malas.length === 0, `todas se dibujan como MathML con tamaño, sin marca de error, numeradas y con su texto legible para el lector${malas.length ? ': ' + malas.slice(0, 6).join(' | ') : ''}`)
    console.log('   fuente de <math>:', [...fuentes].join(', '))

    console.log('--- A. Modo texto con teclado')
    await ir('#/simulador-quimica/aprender-gas-ley-boyle')
    await esperarSinCarga(app, '[data-leccion-n1]')
    await q(`document.querySelector('[data-ecuaciones-texto]').focus(); return 1`)
    const foco = await q(`const a=document.activeElement; const cs=getComputedStyle(a); return [a.hasAttribute('data-ecuaciones-texto'), a.matches(':focus-visible'), cs.outlineStyle]`)
    ok(foco[0] === true, 'el botón «Ver ecuaciones como texto» recibe el foco')
    await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
    await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
    await ESPERA(300)
    const enTexto = await q(ESTADO_ECUACIONES('[data-leccion-n1] [data-capa="formalizar"]'))
    ok(enTexto.length > 0 && enTexto.every((e) => e.estado === 'texto' && e.textoVisible && e.ancho === 0), `Intro cambia todas las ecuaciones a texto visible y copiable (${enTexto.map((e) => e.estado).join(',')})`)
    ok((await q(`return document.querySelector('[data-ecuaciones-texto]').getAttribute('aria-pressed')`)) === 'true', 'el botón anuncia su estado (aria-pressed=true)')
    const textoPlano = await q(`return [...document.querySelectorAll('[data-leccion-n1] [data-ecuacion-texto]')].map((e) => e.textContent).join(' | ')`)
    ok(/P₁ · V₁ = P₂ · V₂/.test(textoPlano), `el texto legible es el de la lección (${textoPlano.slice(0, 60)})`)
    await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
    await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
    await ESPERA(200)
    await esperarSinCarga(app, '[data-leccion-n1]')
    const deVuelta = await q(ESTADO_ECUACIONES('[data-leccion-n1] [data-capa="formalizar"]'))
    ok(deVuelta.every((e) => e.estado === 'mathml' && e.ancho > 0), 'Intro de nuevo vuelve a la notación matemática')
    const focoTras = await q(`const a=document.activeElement; const cs=getComputedStyle(a); return [a.hasAttribute('data-ecuaciones-texto'), a.matches(':focus-visible'), cs.outlineStyle, cs.outlineWidth]`)
    ok(focoTras[0] && focoTras[1] && focoTras[2] !== 'none', `el foco sigue en el botón y es visible (${focoTras.join(' ')})`)
    await app.captura(`${CAPS}/e0-leccion-boyle${SUF}.png`)

    console.log('--- A. Matriz visual 1280×720 y 1024×640 × Día/Noche')
    const matriz = [[1280, 720, 'dia', 'light'], [1280, 720, 'noche', 'dark'], [1024, 640, 'dia', 'light'], [1024, 640, 'noche', 'dark']]
    const lecciones = ['gas-ideal', 'gas-desviaciones', 'gas-efusion']
    for (const [ancho, alto, nombre, tema] of matriz) {
      const dim = await app.ventana(ancho, alto)
      console.log(`   ventana pedida ${ancho}×${alto}: interior/exterior ${JSON.stringify(dim)}`)
      for (const id of lecciones) {
        await ir(`#/simulador-quimica/aprender-${id}`, tema)
        if (!(await q(`return !!document.querySelector('[data-leccion-n1="${id}"]')`))) {
          ok(false, `${id}: la lección existe`)
          continue
        }
        await esperarSinCarga(app, '[data-leccion-n1]')
        await q(`document.querySelector('[data-capa="formalizar"]').scrollIntoView({block:'start'}); await __q.esperar(150); return 1`)
        const r = await q(sonda('[data-leccion-n1] [data-capa="formalizar"]'))
        const etq = `${id}-${ancho}x${alto}-${nombre}${SUF}`
        ok(!r.falta && r.ancho > 200 && r.alto > 100, `${etq}: Formalizar visible (${Math.round(r.ancho ?? 0)}×${Math.round(r.alto ?? 0)})`)
        ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.ecDesbordan === 0, `${etq}: textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde} fuera=${JSON.stringify(r.fuera)} ecuaciones desbordadas sin desplazamiento=${r.ecDesbordan}`)
        if (id === 'gas-ideal' && ((nombre === 'dia' && ancho === 1280) || (nombre === 'noche' && ancho === 1024))) await app.captura(`${CAPS}/e0-${etq}.png`)
      }
    }
    const cons = SIN_WEBGL ? app.consola.filter((c) => !/webgl|WebGL|context|contexto|boundary|límite|The above error|Error: /i.test(c)) : app.consola
    console.log('   consola:', JSON.stringify(cons.slice(0, 5)))
    ok(cons.length === 0, 'consola sin errores ni avisos en la app real')
  } catch (e) {
    console.log('ERROR de guion (A):', e.message)
    fallos.push(`guion A: ${e.message}`)
  }
  await app.cerrar()
}

function compilarPruebas() {
  const dir = mkdtempSync(join(tmpdir(), 'qpt-kit-'))
  const bin = join(PROYECTO, 'node_modules', 'electron-vite', 'bin', 'electron-vite.js')
  if (!existsSync(bin)) throw new Error('No se encontró electron-vite')
  const r = spawnSync(process.execPath, [bin, 'build', '--mode', 'pruebas', '--outDir', join(dir, 'out')], { cwd: PROYECTO, encoding: 'utf8' })
  if (r.status !== 0) throw new Error('La compilación de pruebas falló: ' + (r.stderr || r.stdout).slice(0, 400))
  copyFileSync(join(PROYECTO, 'package.json'), join(dir, 'package.json'))
  return dir
}

async function comprobarEscena(q, etq) {
  const lee = () => q(`return { a: __q.texto('[data-escena-n1] [data-magnitud="a"] dd'), t: __q.texto('[data-escena-n1] [data-magnitud="t"] dd'), vm: __q.texto('[data-escena-n1] [data-magnitud="mediaVida"] dd'), palabras: (document.querySelector('[data-en-palabras]')?.textContent ?? '').trim(), problema: !!document.querySelector('[data-escena-problema]'), dds: [...document.querySelectorAll('[data-escena-n1] [data-lecturas] dd')].map((d) => d.textContent) }`)
  const problemas = []
  const r0 = await lee()
  if (r0.problema) problemas.push('la escena muestra un aviso de problema del modelo')
  if (r0.dds.some((d) => /NaN|undefined|—/.test(d))) problemas.push(`lecturas no válidas: ${JSON.stringify(r0.dds)}`)
  for (const [k, u] of [['a', 'mol/L'], ['t', 's'], ['vm', 's']]) if (!r0[k].includes(u)) problemas.push(`la lectura ${k} no tiene unidad ${u} (${r0[k]})`)
  if (r0.palabras.length < 25) problemas.push('falta la lectura «En palabras»')
  if (r0.t !== '0 s') problemas.push(`la escena no empieza en t = 0 (${r0.t})`)
  await q(`document.querySelector('[data-escena-n1] [data-accion="iniciar"]').click(); await __q.esperar(1500); return 1`)
  const r1 = await lee()
  const tNum = parseFloat(r1.t.replace(',', '.'))
  const aNum = parseFloat(r1.a.replace(',', '.'))
  if (!(tNum > 0)) problemas.push(`al iniciar, el tiempo no avanza (${r1.t})`)
  if (!(aNum < 1)) problemas.push(`al iniciar, [A] no baja (${r1.a})`)
  if (r1.palabras === r0.palabras) problemas.push('«En palabras» no cambia al avanzar')
  await q(`document.querySelector('[data-escena-n1] [data-accion="iniciar"]').click(); await __q.esperar(200); document.querySelector('[data-escena-n1] [data-accion="reiniciar"]').click(); await __q.esperar(300); return 1`)
  const r2 = await lee()
  if (r2.t !== '0 s' || !r2.a.startsWith('1 ')) problemas.push(`Reiniciar no vuelve a t = 0 (${r2.t}, ${r2.a})`)
  await q(`const i=document.querySelector('[data-parametro="k"] input[type=number]'); __q.escribir(i, '0.2'); await __q.esperar(300); return 1`)
  const r3 = await lee()
  if (!/^3,4[67] s$/.test(r3.vm)) problemas.push(`al cambiar k a 0,2 1/s la vida media no es ln 2/0,2 ≈ 3,47 s (${r3.vm})`)
  const grafica = await q(`const f=document.querySelector('[data-escena-n1] figure svg'); return f ? [Math.round(f.getBoundingClientRect().width), f.querySelectorAll('path').length] : [0,0]`)
  if (!(grafica[0] > 100 && grafica[1] >= 2)) problemas.push(`la gráfica no se dibuja (${grafica})`)
  console.log(`   ${etq}: t=${r1.t} a=${r1.a} vm(k=0,2)=${r3.vm} gráfica=${grafica}`)
  return problemas
}

async function parteKit() {
  let dir = null
  try {
    console.log('--- B. Compilación de pruebas (fuera del repositorio)')
    dir = compilarPruebas()
    console.log('   carpeta temporal:', dir)
    const app = await abrirApp(PERFIL_B, 9373, SIN_WEBGL ? ARGS_SIN_WEBGL : [], dir)
    const q = (js) => app.ev(js)
    const ir = async (hash, tema = 'light') => {
      await q(`location.hash='${hash}'; location.reload()`)
      await ESPERA(2200)
      await app.ev(JS_AYUDAS)
      await app.ev(`document.documentElement.dataset.theme='${tema}'; await new Promise(r=>setTimeout(r,250)); return 1`)
    }
    try {
      await app.ventana(1280, 720)
      if (SABOTAJE) {
        console.log('--- B. SABOTAJE: escena con modelo deliberadamente roto')
        await ir('#/prueba-kit-sabotaje')
        const problemas = await comprobarEscena(q, 'sabotaje')
        console.log('   problemas detectados:', JSON.stringify(problemas.slice(0, 4)))
        ok(problemas.length > 0, `el guion detecta la escena rota (${problemas.length} problemas)`)
        ok(await q(`return !!document.querySelector('[data-escena-problema]')`), 'la vista avisa del problema en lugar de mostrar NaN')
      } else {
        await ir('#/prueba-kit')
        await esperarSinCarga(app, '#prueba-kit')
        ok(await q(`return !!document.getElementById('prueba-kit')`), 'la página interna del kit se abre en la compilación de pruebas')
        console.log('--- B. Ecuaciones y fórmulas químicas')
        const estado = await q(`return Object.fromEntries([...document.querySelectorAll('[data-prueba]')].map((a) => { const e = a.querySelector('.q-ec'); const m = e && e.querySelector('math'); const t = e && e.querySelector('[data-ecuacion-texto]'); return [a.dataset.prueba, { estado: e ? e.dataset.ecuacion : null, ancho: m ? Math.round(m.getBoundingClientRect().width) : 0, texto: t ? t.textContent : '', visible: t ? t.getBoundingClientRect().width > 1 : false, mathTexto: m ? m.textContent : '', tab: e ? e.getAttribute('tabindex') : null, role: e ? e.getAttribute('role') : null, aria: e ? e.getAttribute('aria-label') : null }] }))`)
        for (const id of ['gas-ideal', 'urms', 'reaccion', 'en-linea']) ok(estado[id]?.estado === 'mathml' && estado[id].ancho > 0, `${id}: se dibuja como MathML (${estado[id]?.estado}, ${estado[id]?.ancho} px)`)
        ok(/NH/.test(estado.reaccion?.mathTexto ?? '') && /[⇌⇄]/.test(estado.reaccion?.mathTexto ?? ''), `la reacción con \\ce muestra NH₃ y flechas de equilibrio (${(estado.reaccion?.mathTexto ?? '').replace(/\s+/g, '').slice(0, 40)})`)
        ok(estado.rota?.estado === 'reserva' && estado.rota.visible && /falta el denominador/.test(estado.rota.texto), 'un TeX roto muestra su texto legible, no un hueco')
        ok(estado['formula-rechazada']?.estado === 'reserva' && estado['formula-rechazada'].visible && estado['formula-rechazada'].texto === 'H₂O', 'una fórmula con órdenes no admitidas se rechaza y se ve su texto legible')
        ok(estado['modo-texto']?.estado === 'texto' && estado['modo-texto'].visible, 'el modo texto muestra el texto')
        ok(estado.larga?.tab === '0' && estado.larga.role === 'group' && /se desplaza/.test(estado.larga.aria ?? ''), `la ecuación larga se vuelve enfocable y desplazable (${estado.larga?.tab}, ${estado.larga?.role})`)
        await q(`document.querySelector('[data-prueba="larga"] .q-ec').focus(); return 1`)
        for (let i = 0; i < 8; i++) {
          await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
          await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
        }
        await ESPERA(300)
        ok((await q(`return document.querySelector('[data-prueba="larga"] .q-ec').scrollLeft`)) > 0, 'las flechas del teclado desplazan la ecuación larga')
        console.log('--- B. Figuras')
        const figs = await q(`return [...document.querySelectorAll('[data-prueba-seccion="figuras"] figure')].map((f) => { const s = f.querySelector('svg'); const r = s.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), role: s.getAttribute('role'), titulo: s.querySelector('title')?.textContent ?? '', desc: s.querySelector('desc')?.textContent ?? '', pie: f.querySelector('figcaption')?.textContent ?? '', trazos: s.querySelectorAll('path, line').length } })`)
        ok(figs.length === 2 && figs.every((f) => f.w > 200 && f.h > 100 && f.role === 'img' && f.titulo && f.desc.length > 10 && /^Figura /.test(f.pie) && f.trazos > 3), `dos figuras con tamaño, role=img, título, texto alternativo y pie numerado (${JSON.stringify(figs.map((f) => [f.w, f.h, f.trazos]))})`)
        const flechas = await q(`return [...document.querySelectorAll('[data-flecha]')].map((s) => [s.dataset.flecha, s.getAttribute('aria-label'), Math.round(s.getBoundingClientRect().width)])`)
        ok(flechas.length === 3 && flechas.every((f) => f[1] && f[2] > 20), `tres flechas de reacción con nombre accesible (${flechas.map((f) => f[0]).join(', ')})`)
        console.log('--- B. Escena del kit (modelo de demostración)')
        const problemas = await comprobarEscena(q, 'demo')
        ok(problemas.length === 0, `la escena inicia, avanza, reinicia a t = 0, responde a los controles y lee con unidades${problemas.length ? ': ' + problemas.join(' | ') : ''}`)
        const casos = await q(`return document.querySelectorAll('[data-escena-n1] [data-casos] tbody tr').length`)
        ok(casos === 2, `la comparación de casos muestra 2 filas (${casos})`)
        await q(`document.querySelector('[data-escena-n1] [data-accion="valores-iniciales"]').focus(); return 1`)
        const focoEsc = await q(`const a=document.activeElement; return [a.matches(':focus-visible'), getComputedStyle(a).outlineStyle]`)
        console.log('   foco en «Valores iniciales» (programático):', JSON.stringify(focoEsc))
        await app.captura(`${CAPS}/e0-kit${SUF}.png`)
        console.log('--- B. Matriz visual del kit')
        const matriz = [[1280, 720, 'dia', 'light'], [1280, 720, 'noche', 'dark'], [1024, 640, 'dia', 'light'], [1024, 640, 'noche', 'dark']]
        for (const [ancho, alto, nombre, tema] of matriz) {
          const dim = await app.ventana(ancho, alto)
          console.log(`   ventana pedida ${ancho}×${alto}: interior/exterior ${JSON.stringify(dim)}`)
          await ir('#/prueba-kit', tema)
          await esperarSinCarga(app, '#prueba-kit')
          for (const sec of ['ecuaciones', 'figuras', 'escena']) {
            const r = await q(sonda(`[data-prueba-seccion="${sec}"]`))
            const etq = `kit-${sec}-${ancho}x${alto}-${nombre}${SUF}`
            ok(!r.falta && r.ancho > 200 && r.alto > 80, `${etq}: visible (${Math.round(r.ancho ?? 0)}×${Math.round(r.alto ?? 0)})`)
            ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.ecDesbordan === 0, `${etq}: textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde} fuera=${JSON.stringify(r.fuera)} ecDesbordan=${r.ecDesbordan}`)
          }
          if ((nombre === 'dia' && ancho === 1280) || (nombre === 'noche' && ancho === 1024)) {
            await q(`document.querySelector('[data-prueba-seccion="escena"]').scrollIntoView({block:'start'}); return 1`)
            await app.captura(`${CAPS}/e0-kit-escena-${ancho}x${alto}-${nombre}${SUF}.png`)
          }
        }
        const cons = SIN_WEBGL ? app.consola.filter((c) => !/webgl|WebGL|context|contexto|boundary|límite|The above error|Error: /i.test(c)) : app.consola
        console.log('   consola:', JSON.stringify(cons.slice(0, 5)))
        ok(cons.length === 0, 'consola sin errores ni avisos en la página del kit')
      }
    } catch (e) {
      console.log('ERROR de guion (B):', e.message)
      fallos.push(`guion B: ${e.message}`)
    }
    await app.cerrar()
  } catch (e) {
    console.log('ERROR de guion (B, arranque):', e.message)
    fallos.push(`guion B arranque: ${e.message}`)
  }
  if (dir) rmSync(dir, { recursive: true, force: true })
}

if (!SABOTAJE) await parteApp()
await parteKit()
const despues = huella(REAL)
ok(antes === despues, `el perfil real (${REAL}) no cambió: ${antes === null ? 'no existe' : antes.split('\n').length + ' archivos'} antes y después`)
console.log(fallos.length === 0 ? 'TODO OK' : `FALLOS (${fallos.length}):\n- ${fallos.join('\n- ')}`)
process.exit(fallos.length === 0 ? 0 : 1)
