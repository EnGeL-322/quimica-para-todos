import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { abrirApp, ESPERA, JS_AYUDAS } from '../verificacion-d/cdp.mjs'
import { BASE_SONDA } from '../verificacion-d/sonda.mjs'

const SIN_WEBGL = process.env.N1_SIN_WEBGL === '1'
const SUF = SIN_WEBGL ? '-sinwebgl' : ''
const PERFIL = resolve(tmpdir(), `reng-verificacion-n1-b08${SUF}`)
const CAPS = fileURLToPath(new URL('../../docs/capturas-n1-b08', import.meta.url))
mkdirSync(CAPS, { recursive: true })
const ARGS_SIN_WEBGL = ['--disable-gpu', '--disable-software-rasterizer', '--disable-webgl']
const REAL = join(process.env.APPDATA ?? '', 'Química para Todos')
const CLAVE_N1 = 'ciencia.practicas-n1.simulador-quimica'
const CLAVES_ANTIGUAS = ['ciencia.practica.simulador-quimica', 'ciencia.aprender.simulador-quimica', 'ciencia.nivel.simulador-quimica', 'quimica.nivel']

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
  const panel = raiz.closest('[role=tabpanel]') ?? document.documentElement
  const malos = []
  let n = 0
  const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT)
  while (w.nextNode()) {
    const t = w.currentNode; const el = t.parentElement
    if (!t.textContent.trim() || !el || el.closest('title, desc') || el.offsetParent === null || getComputedStyle(el).visibility === 'hidden') continue
    const cs = getComputedStyle(el); const fg = parse(el.closest('svg') ? cs.fill : cs.color); if (!fg) continue
    let r = Infinity
    for (const bg of fondos(el)) { const f = mezcla(fg, bg); const L1 = lum(f); const L2 = lum(bg); r = Math.min(r, (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) }
    const grande = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700)
    n++
    if (r < (grande ? 3 : 4.5)) malos.push(el.tagName + ':' + t.textContent.trim().slice(0, 30) + ' ' + r.toFixed(2))
  }
  const W = innerWidth
  const fuera = [...raiz.querySelectorAll('input,button,select')].filter((e) => e.offsetParent !== null).filter((e) => { const r = e.getBoundingClientRect(); return r.right > W + 1 || r.left < -1 || r.width === 0 || r.height === 0 }).map((e) => (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30))
  const desbordePanel = panel.scrollWidth - panel.clientWidth
  rengEstiloQuieto.remove()
  return { ancho: caja.width, alto: caja.height, texto: raiz.textContent.trim().length, textos: n, nBajo: malos.length, bajoContraste: malos.slice(0, 6), desborde: document.documentElement.scrollWidth - W, desbordePanel, fuera }
`

const app = await abrirApp(PERFIL, 9361, SIN_WEBGL ? ARGS_SIN_WEBGL : [])
const antes = huella(REAL)
const q = (js) => app.ev(js)
const ir = async (hash, tema = 'light') => {
  await q(`location.hash='${hash}'; location.reload()`)
  await ESPERA(2400)
  await app.ev(JS_AYUDAS)
  await app.ev(`document.documentElement.dataset.theme='${tema}'; await new Promise(r=>setTimeout(r,250)); return 1`)
}
const tecla = async (key, code, vk, text) => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: vk, ...(text ? { text } : {}) })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk })
  await ESPERA(300)
}
const tab = () => tecla('Tab', 'Tab', 9)
const vista = async (sel, etq) => {
  const r = await app.ev(sonda(sel))
  ok(!r.falta, `${etq}: la vista ${sel} existe`)
  if (r.falta) return
  ok(r.ancho > 200 && r.alto > 100 && r.texto > 100, `${etq}: la vista no está vacía ni es 0×0 (${Math.round(r.ancho)}×${Math.round(r.alto)}, ${r.texto} caracteres)`)
  ok(r.nBajo === 0 && r.desborde <= 0 && r.desbordePanel <= 0 && r.fuera.length === 0, `${etq}: textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde}/${r.desbordePanel} fuera=${JSON.stringify(r.fuera)}`)
}

try {
  console.log(`--- Nivel 1 · bloque 8 (Gases) ${SIN_WEBGL ? 'SIN WebGL' : 'con WebGL'}`)
  console.log('   RENG_USERDATA coincide con el perfil temporal:', PERFIL)
  await app.ventana(1280, 720)
  await ir('#/simulador-quimica/temario')
  await q(`sessionStorage.removeItem('ciencia.temario.simulador-quimica'); localStorage.removeItem('${CLAVE_N1}')`)
  await ir('#/simulador-quimica/temario')
  const antiguasAntes = await q(`return ${JSON.stringify(CLAVES_ANTIGUAS)}.map((k) => localStorage.getItem(k))`)

  console.log('--- Temario → bloque 8')
  await q(`document.querySelector('[data-bloque="n1-b8"] .q-tm-plegar').click(); await __q.esperar(400)`)
  const filas = await q(`return document.querySelectorAll('[data-bloque="n1-b8"] .q-tm-subtema').length`)
  const conf = await q(`return document.querySelectorAll('[data-bloque="n1-b8"] .q-tm-subtema[data-correspondencia="confirmado"]').length`)
  const parciales = await q(`return document.querySelectorAll('[data-bloque="n1-b8"] .q-tm-subtema[data-estado="parcial"]').length`)
  ok(filas === 20 && conf === 20 && parciales === 20, `el bloque 8 muestra 20 subtemas confirmados y en Parcial (${filas}/${conf}/${parciales})`)
  const botones = await q(`return [...document.querySelectorAll('[data-bloque="n1-b8"] .q-tm-recurso button')].map((b) => b.textContent.trim())`)
  ok(botones.filter((b) => b === 'Aprender').length === 20 && botones.filter((b) => b === 'Practicar').length === 20, `cada subtema ofrece Aprender y Practicar (${botones.length} botones)`)
  ok(botones.every((b) => ['Aprender', 'Practicar', 'Abrir casos reales', 'Simular'].includes(b)), 'no hay botones sin destino en el bloque 8')
  ok(botones.filter((b) => b === 'Simular').length === 12, `12 subtemas ofrecen «Simular» con la escena del gas ideal (${botones.filter((b) => b === 'Simular').length})`)
  await app.captura(`${CAPS}/b08-temario${SUF}.png`)

  console.log('--- Aprender: lección por capas (subtema 4, Ley de Boyle)')
  await q(`document.querySelector('[data-subtema="n1-b8-s4"] button[aria-label^="Aprender"]').click(); await __q.esperar(800)`)
  ok((await q(`return location.hash`)).includes('simulador-quimica/aprender'), 'el botón Aprender abre Aprender')
  ok((await q(`return document.querySelector('#quimica-panel-aprender').hidden`)) === false, 'el panel de Aprender está visible')
  ok((await q(`return document.querySelector('[data-leccion-n1]')?.getAttribute('data-leccion-n1')`)) === 'gas-ley-boyle', 'se abre la lección «gas-ley-boyle»')
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] [data-capa]').length`)) === 4 && (await q(`return !!document.querySelector('[data-leccion-n1] [data-capa="explorar"] [data-escena-n1="gas-ideal"]')`)), 'la lección muestra Comprender, Formalizar, Aplicar y Explorar con la escena del gas ideal')
  ok((await q(`return document.activeElement?.tagName`)) === 'H2', 'el foco pasa al título de la lección')
  await q(`__q.botonCon('Mostrar el paso 1').click(); await __q.esperar(200)`)
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] .q-pasos li').length`)) === 1, 'el primer paso se revela solo al pedirlo')
  await q(`__q.botonCon('Mostrar toda la resolución').click(); await __q.esperar(200)`)
  ok(/3,1/.test(await q(`return __q.texto('[data-resultado-ejemplo]')`)), `el resultado del ejemplo aparece al final (${await q(`return __q.texto('[data-resultado-ejemplo]')`)})`)
  await vista('[data-leccion-n1]', 'leccion-s4')
  await app.captura(`${CAPS}/b08-leccion-s4${SUF}.png`)

  console.log('--- Practicar desde la lección')
  await q(`__q.botonCon('Practicar este subtema').click(); await __q.esperar(800)`)
  ok((await q(`return document.querySelector('#quimica-panel-practicas').hidden`)) === false, 'Practicar abre el panel de Prácticas')
  ok((await q(`return document.querySelector('[data-practicas-n1]')?.getAttribute('data-practicas-n1')`)) === 'n1-b8-s4', 'se abre la lista de prácticas del subtema 4')
  ok(/Bloque 8 · Gases/.test(await q(`return __q.texto('[data-encabezado-bloque]')`)), 'la lista tiene encabezado por bloque')
  ok((await q(`return document.querySelectorAll('[data-practicas-n1] [data-practica]').length`)) === 3, 'hay tres prácticas en el subtema')
  const enunciado1 = await q(`return __q.texto('[data-enunciado]')`)
  await q(`__q.botonCon('Ver la resolución').click(); await __q.esperar(300)`)
  const respuesta = await q(`return document.querySelector('[data-resolucion-n1] .notice').textContent.replace('Respuesta:','').trim().split(' ')[0]`)
  ok(/^-?\d/.test(respuesta), `la resolución muestra la respuesta (${respuesta})`)
  await q(`const i=document.querySelector('[data-respuesta-n1]'); i.focus(); __q.escribir(i, ${JSON.stringify(respuesta)}); await __q.esperar(150)`)
  await tecla('Enter', 'Enter', 13, '\r')
  ok((await q(`return document.querySelector('[data-veredicto-n1]').getAttribute('data-veredicto-n1')`)) === 'correcto', 'Intro en el campo comprueba y la respuesta de la resolución es correcta')
  await q(`const i=document.querySelector('[data-respuesta-n1]'); __q.escribir(i, '5 kg'); await __q.esperar(100); document.querySelector('[data-practicas-n1] form button[type=submit]').click(); await __q.esperar(250)`)
  ok((await q(`return document.querySelector('[data-veredicto-n1]').getAttribute('data-veredicto-n1')`)) === 'unidad-incompatible', 'una unidad que no corresponde se señala como error de unidades')
  await q(`const i=document.querySelector('[data-respuesta-n1]'); __q.escribir(i, 'mucho'); await __q.esperar(100); document.querySelector('[data-practicas-n1] form button[type=submit]').click(); await __q.esperar(250)`)
  ok((await q(`return document.querySelector('[data-veredicto-n1]').getAttribute('data-veredicto-n1')`)) === 'ilegible', 'un texto que no es un número no se acepta')
  await q(`__q.botonCon('Ver una pista').click(); await __q.esperar(150)`)
  ok((await q(`return document.querySelectorAll('[data-practicas-n1] ol[aria-label="Pistas"] li').length`)) === 1, 'las pistas se revelan de una en una')
  await q(`__q.botonCon('Otra variante').click(); await __q.esperar(300)`)
  ok((await q(`return __q.texto('[data-enunciado]')`)) !== enunciado1, 'otra variante cambia el enunciado')
  ok((await q(`return document.querySelector('[data-veredicto-n1]').getAttribute('data-veredicto-n1')`)) === '', 'la nueva variante empieza sin veredicto')
  const guardado = await q(`return localStorage.getItem('${CLAVE_N1}')`)
  ok(!!guardado && JSON.parse(guardado).version === 1 && !!JSON.parse(guardado).practicas['n1-b8-s4-p1'], `el progreso se guarda en la clave nueva (${(guardado ?? '').slice(0, 80)})`)
  const antiguasDespues = await q(`return ${JSON.stringify(CLAVES_ANTIGUAS)}.map((k) => localStorage.getItem(k))`)
  ok(JSON.stringify(antiguasDespues) === JSON.stringify(antiguasAntes), `las claves antiguas (prácticas, Aprender, nivel) no cambian al usar lecciones y prácticas N1 (${JSON.stringify(antiguasDespues).slice(0, 120)})`)
  await vista('[data-practicas-n1]', 'practicas-s4')
  await app.captura(`${CAPS}/b08-practicas-s4${SUF}.png`)

  console.log('--- Teclado: selector de prácticas, foco visible y Escape')
  await q(`document.querySelector('[data-practicas-n1] [data-practica="n1-b8-s4-p1"]').focus()`)
  await tab()
  ok((await q(`return document.activeElement.getAttribute('data-practica')`)) === 'n1-b8-s4-p2', 'Tab pasa a la segunda práctica')
  const foco = await q(`const a=document.activeElement; const cs=getComputedStyle(a); return [a.matches(':focus-visible'), cs.outlineStyle, cs.outlineWidth]`)
  ok(foco[0] === true && foco[1] !== 'none', `el foco es visible (${foco.join(' ')})`)
  await tecla('Enter', 'Enter', 13, '\r')
  ok((await q(`return document.querySelector('[data-practica="n1-b8-s4-p2"]').getAttribute('aria-pressed')`)) === 'true', 'Intro elige la práctica intermedia')
  await q(`document.querySelector('[data-practicas-n1] h2').focus()`)
  await tecla('Escape', 'Escape', 27)
  ok((await q(`return !!document.querySelector('[data-practicas-n1]')`)) === false && (await q(`return !!document.querySelector('[data-indice-n1="practicas"]')`)), 'Escape vuelve a la lista de Prácticas, que ofrece el índice del Nivel 1')

  console.log('--- Índices y lo existente sigue accesible')
  ok((await q(`return document.querySelectorAll('[data-indice-n1="practicas"] [data-abrir-n1^="n1-b8-s"]').length`)) === 20 && (await q(`return document.querySelectorAll('[data-indice-n1="practicas"] [data-abrir-n1="n1-b8-int"]').length`)) === 1, 'el índice de Prácticas lista los 20 subtemas del bloque 8 y los integradores del capítulo')
  ok((await q(`return document.querySelectorAll('.ejq-pantalla .q-tarjeta, .ejq-pantalla [data-tema]').length`)) > 0, 'el selector de prácticas por tema sigue presente')
  await q(`document.querySelector('[data-indice-n1="practicas"] [data-abrir-n1="n1-b8-s9"]').click(); await __q.esperar(500)`)
  ok((await q(`return document.querySelector('[data-practicas-n1]')?.getAttribute('data-practicas-n1')`)) === 'n1-b8-s9', 'el índice abre las prácticas del subtema 9')
  await ir('#/simulador-quimica/aprender')
  ok((await q(`return document.querySelectorAll('[data-indice-n1="aprender"] [data-abrir-n1^="gas-"]').length`)) === 20 && (await q(`return document.querySelectorAll('[data-indice-n1="aprender"] [data-abrir-n1="capitulo-b8"]').length`)) === 1, 'el índice de Aprender lista las 20 lecciones del bloque 8 y la portada del capítulo')
  ok((await q(`return !!document.querySelector('.q-ruta')`)), 'la ruta de iniciación de Aprender sigue presente')
  await q(`document.querySelector('[data-indice-n1="aprender"] [data-abrir-n1="gas-presiones-parciales"]').click(); await __q.esperar(500)`)
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] [data-capa]').length`)) === 4, 'la lección del subtema 12 tiene capa Explorar (caso real)')
  await q(`document.querySelector('[data-leccion-n1] h2').focus()`)
  await tecla('Escape', 'Escape', 27)
  ok((await q(`return !!document.querySelector('[data-leccion-n1]')`)) === false, 'Escape cierra la lección y vuelve a Aprender')
  await q(`document.querySelector('[data-indice-n1="aprender"] [data-abrir-n1="gas-presiones-parciales"]').click(); await __q.esperar(500)`)
  await q(`__q.botonCon('Abrir: Caso real').click(); await __q.esperar(700)`)
  ok((await q(`return location.hash`)).includes('casos'), 'Explorar abre Casos reales')
  ok((await q(`return document.querySelector('#quimica-panel-casos').hidden`)) === false, 'el panel de Casos reales queda visible')
  ok(/aire que respiras/i.test(await q(`return document.querySelector('#quimica-panel-casos').textContent`)), 'el caso «El aire que respiras» está en la lista')

  console.log('--- Matriz visual 1280×720 y 1024×640 × Día/Noche')
  const matriz = [[1280, 720, 'dia', 'light'], [1280, 720, 'noche', 'dark'], [1024, 640, 'dia', 'light'], [1024, 640, 'noche', 'dark']]
  const vistas = [
    ['leccion-s12', '#/simulador-quimica/aprender-gas-presiones-parciales', `__q.botonCon('Mostrar toda la resolución').click(); await __q.esperar(200); document.querySelector('[data-leccion-n1] details').open = true; await __q.esperar(150)`, '[data-leccion-n1]'],
    ['leccion-s20', '#/simulador-quimica/aprender-gas-desviaciones', `__q.botonCon('Mostrar toda la resolución').click(); await __q.esperar(200)`, '[data-leccion-n1]'],
    ['practicas-s16', '#/simulador-quimica/practicas-n1-b8-s16', `__q.botonCon('Ver la resolución').click(); await __q.esperar(200); __q.botonCon('Ver una pista').click(); await __q.esperar(150)`, '[data-practicas-n1]'],
    ['indice-aprender', '#/simulador-quimica/aprender', `document.querySelector('[data-indice-n1="aprender"]').scrollIntoView({block:'start'}); await __q.esperar(150)`, '[data-indice-n1="aprender"]'],
    ['indice-practicas', '#/simulador-quimica/practicas', `document.querySelector('[data-indice-n1="practicas"]').scrollIntoView({block:'start'}); await __q.esperar(150)`, '[data-indice-n1="practicas"]'],
    ['temario-b8', '#/simulador-quimica/temario', `const b=document.querySelector('[data-bloque="n1-b8"] .q-tm-plegar'); if (b.getAttribute('aria-expanded') !== 'true') b.click(); await __q.esperar(300); document.querySelector('[data-bloque="n1-b8"]').scrollIntoView({block:'start'}); await __q.esperar(150)`, '[data-bloque="n1-b8"]']
  ]
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    console.log(`   ventana pedida ${ancho}×${alto}: interior/exterior ${JSON.stringify(dim)}`)
    for (const [etq, hash, pasos, raiz] of vistas) {
      await ir(hash, tm)
      if (pasos) await app.ev(`${pasos}; return 1`)
      await app.ev('await new Promise(r=>setTimeout(r,250)); return 1')
      await vista(raiz, `${etq}-${ancho}x${alto}-${nombre}${SUF}`)
      if ((nombre === 'dia' && ancho === 1280) || (nombre === 'noche' && ancho === 1024)) await app.captura(`${CAPS}/b08-${etq}-${ancho}x${alto}-${nombre}${SUF}.png`)
    }
  }

  console.log('--- Claves antiguas, Mesa y consola')
  await app.ventana(1280, 720)
  await ir('#/simulador-quimica/mesa')
  const lim = await q(`return document.querySelectorAll('.limite-3d').length`)
  ok(SIN_WEBGL ? lim >= 1 : lim === 0, `Mesa molecular ${SIN_WEBGL ? 'muestra el aviso sin WebGL' : 'sin aviso 3D'} (${lim})`)
  const cons = SIN_WEBGL ? app.consola.filter((c) => !/webgl|WebGL|context|contexto|boundary|límite|The above error|Error: /i.test(c)) : app.consola
  console.log('   consola:', JSON.stringify(cons.slice(0, 5)))
  ok(cons.length === 0, SIN_WEBGL ? 'consola sin errores salvo los del contexto WebGL ya conocido' : 'consola vacía')
} catch (e) {
  console.log('ERROR de guion:', e.message)
  fallos.push(`guion: ${e.message}`)
  try {
    await app.captura(`${CAPS}/b08-error${SUF}.png`)
  } catch {
  }
}
await app.cerrar()
const despues = huella(REAL)
ok(antes === despues, `el perfil real (${REAL}) no cambió: ${antes === null ? 'no existe' : antes.split('\n').length + ' archivos'} antes y después`)
console.log(fallos.length === 0 ? 'TODO OK' : `FALLOS (${fallos.length}):\n- ${fallos.join('\n- ')}`)
process.exit(fallos.length === 0 ? 0 : 1)
