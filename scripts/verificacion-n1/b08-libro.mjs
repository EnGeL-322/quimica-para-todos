import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { abrirApp, ESPERA, JS_AYUDAS } from '../verificacion-d/cdp.mjs'
import { BASE_SONDA } from '../verificacion-d/sonda.mjs'

const SIN_WEBGL = process.env.N1_SIN_WEBGL === '1'
const SUF = SIN_WEBGL ? '-sinwebgl' : ''
const PERFIL = resolve(tmpdir(), `reng-verificacion-n1-b08-libro${SUF}`)
const CAPS = fileURLToPath(new URL('../../docs/capturas-n1-b08-libro', import.meta.url))
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
  const figuras = [...raiz.querySelectorAll('figure svg')].map((s) => { const r = s.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)] })
  const trazosBajos = []
  for (const p of raiz.querySelectorAll('figure .q-fig-serie path, figure .q-fig-serie circle, figure .q-fig-serie rect, figure .q-fig-serie polygon')) { const cs = getComputedStyle(p); const col = parse(p.tagName === 'path' ? cs.stroke : cs.fill); if (!col) continue; const bg = fondos(p)[0]; const L1 = lum(col); const L2 = lum(bg); const rr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); if (rr < 3) trazosBajos.push(p.tagName + ' ' + rr.toFixed(2)) }
  rengEstiloQuieto.remove()
  return { ancho: caja.width, alto: caja.height, texto: raiz.textContent.trim().length, textos: n, nBajo: malos.length, bajoContraste: malos.slice(0, 6), desborde: document.documentElement.scrollWidth - W, fuera, figuras, trazosBajos: [...new Set(trazosBajos)].slice(0, 4), nan: /NaN|undefined|Infinity/.test(raiz.textContent) }
`

const app = await abrirApp(PERFIL, 9381, SIN_WEBGL ? ARGS_SIN_WEBGL : [])
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
  await ESPERA(250)
}
const vista = async (sel, etq) => {
  const r = await app.ev(sonda(sel))
  ok(!r.falta, `${etq}: la vista ${sel} existe`)
  if (r.falta) return
  ok(r.ancho > 200 && r.alto > 100 && r.texto > 100 && !r.nan, `${etq}: la vista no está vacía, no es 0×0 y no muestra NaN (${Math.round(r.ancho)}×${Math.round(r.alto)}, ${r.texto} caracteres)`)
  ok(r.figuras.every(([w, h]) => w > 100 && h > 60), `${etq}: figuras con tamaño ${JSON.stringify(r.figuras)}`)
  ok(r.trazosBajos.length === 0, `${etq}: trazos y marcadores de las series con contraste ≥ 3:1 (${JSON.stringify(r.trazosBajos)})`)
  ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0, `${etq}: textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde} fuera=${JSON.stringify(r.fuera)}`)
}
const lectura = (clave) => q(`return (document.querySelector('[data-escena-n1] [data-magnitud="${clave}"] dd')?.textContent ?? '').trim()`)
const numero = (t) => parseFloat(String(t).replace(/\s.*$/, '').replace('−', '-').replace(',', '.'))

try {
  console.log(`--- Nivel 1 · bloque 8 versión «libro» ${SIN_WEBGL ? 'SIN WebGL' : 'con WebGL'} (perfil ${PERFIL})`)
  await app.ventana(1280, 720)

  console.log('--- Lección completa (subtema 4, Ley de Boyle)')
  await ir('#/simulador-quimica/aprender-gas-ley-boyle')
  const secciones = await q(`return [...document.querySelectorAll('[data-leccion-n1] [data-seccion], [data-leccion-n1] [data-capa]')].map((e) => e.dataset.seccion || e.dataset.capa)`)
  ok(['por-que-importa', 'comprender', 'formalizar', 'aplicar', 'explorar', 'comprobar', 'resumen', 'conexiones'].every((x) => secciones.includes(x)), `la lección tiene todas las secciones (${secciones.join(', ')})`)
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] .q-n1-objetivos li').length`)) >= 2, 'muestra al menos 2 objetivos')
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] [data-ejemplo]').length`)) === 2, 'muestra dos ejemplos resueltos (directo e integrador)')
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] .q-n1-errores li').length`)) >= 2, 'muestra al menos dos errores frecuentes con su corrección')
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] .q-n1-glosario dt').length`)) >= 2, 'muestra el glosario')
  const fig = await q(`const f=document.querySelector('[data-leccion-n1] [data-capa="formalizar"] figure'); if(!f) return null; const s=f.querySelector('svg'); return { pie: f.querySelector('figcaption').textContent, rol: s.getAttribute('role'), titulo: s.querySelector('title')?.textContent, alt: s.querySelector('desc')?.textContent, w: Math.round(s.getBoundingClientRect().width) }`)
  ok(fig && /^Figura 8\.4\.1\./.test(fig.pie) && fig.rol === 'img' && fig.titulo && fig.alt.length > 40 && fig.w > 200, `la figura tiene pie numerado, role=img, título y texto alternativo (${fig ? fig.pie.slice(0, 40) : 'sin figura'})`)

  console.log('--- Ejemplo integrador')
  await q(`const a=document.querySelectorAll('[data-leccion-n1] [data-ejemplo]')[1]; [...a.querySelectorAll('button')].find((b)=>b.textContent.includes('toda la resolución')).click(); await __q.esperar(200); return 1`)
  const res2 = await q(`return document.querySelectorAll('[data-leccion-n1] [data-ejemplo]')[1].querySelector('[data-resultado-ejemplo]')?.textContent ?? ''`)
  ok(/3,9\d/.test(res2) && /RK4/.test(res2), `el ejemplo integrador (burbuja) da ≈ 3,94 mL y declara su segundo método (${res2.slice(0, 60)})`)

  console.log('--- Para comprobar, con teclado')
  await q(`document.querySelector('[data-leccion-n1] [data-pregunta="0"] input[type=radio]').focus(); return 1`)
  await tecla(' ', 'Space', 32, ' ')
  ok((await q(`return document.querySelector('[data-leccion-n1] [data-pregunta="0"] input[type=radio]').checked`)) === true, 'Espacio marca la primera opción')
  await tecla('ArrowDown', 'ArrowDown', 40)
  const marcada = await q(`return [...document.querySelectorAll('[data-leccion-n1] [data-pregunta="0"] input[type=radio]')].findIndex((i)=>i.checked)`)
  ok(marcada === 1, `las flechas cambian de opción dentro de la pregunta (${marcada})`)
  await q(`[...document.querySelectorAll('[data-leccion-n1] [data-pregunta="0"] button')].find((b)=>b.textContent.includes('Comprobar')).focus(); return 1`)
  await tecla('Enter', 'Enter', 13, '\r')
  const retroMala = await q(`const r=document.querySelector('[data-leccion-n1] [data-pregunta="0"] [data-retro]'); return [r.dataset.retro, r.textContent]`)
  ok(retroMala[0] === 'incorrecta' && retroMala[1].length > 40, `una opción incorrecta muestra su retroalimentación propia (${retroMala[1].slice(0, 60)})`)
  await q(`document.querySelector('[data-leccion-n1] [data-pregunta="0"] input[type=radio]').click(); await __q.esperar(100); [...document.querySelectorAll('[data-leccion-n1] [data-pregunta="0"] button')].find((b)=>b.textContent.includes('Comprobar')).click(); await __q.esperar(150); return 1`)
  const retroBuena = await q(`const r=document.querySelector('[data-leccion-n1] [data-pregunta="0"] [data-retro]'); return [r.dataset.retro, r.textContent]`)
  ok(retroBuena[0] === 'correcta' && retroBuena[1] !== retroMala[1], 'la opción correcta muestra otra retroalimentación')

  console.log('--- Escena del gas ideal dentro de la lección')
  ok(await q(`return !!document.querySelector('[data-leccion-n1] [data-escena-n1="gas-ideal"]')`), 'la capa Explorar contiene la escena del gas ideal')
  const p0 = numero(await lectura('P'))
  const r0 = await lectura('R')
  ok(/^8,314/.test(r0), `P·V/(n·T) muestra R (${r0})`)
  await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="V"] input[type=number]'); __q.escribir(i, String(Number(i.value)/2)); await __q.esperar(250); return 1`)
  const p1 = numero(await lectura('P'))
  ok(Math.abs(p1 / p0 - 2) < 0.01, `al reducir V a la mitad la presión se duplica (${p0} → ${p1} kPa)`)
  const palabras = await q(`return document.querySelector('[data-escena-n1] [data-en-palabras]').textContent`)
  ok(palabras.length > 80 && !/NaN|undefined/.test(palabras), `«En palabras» describe el estado (${palabras.slice(0, 70)})`)
  await q(`document.querySelector('[data-escena-n1] [data-accion="valores-iniciales"]').click(); await __q.esperar(200); return 1`)
  ok(Math.abs(numero(await lectura('P')) - p0) < 0.01, 'Valores iniciales recupera el estado propuesto por la lección')
  await app.captura(`${CAPS}/b08-libro-leccion-s4${SUF}.png`)

  console.log('--- Escena suelta y botón «Simular» del temario')
  await ir('#/simulador-quimica/temario')
  await q(`const b=document.querySelector('[data-bloque="n1-b8"] .q-tm-plegar'); if (b.getAttribute('aria-expanded') !== 'true') b.click(); await __q.esperar(400); return 1`)
  const simular = await q(`return [...document.querySelectorAll('[data-bloque="n1-b8"] .q-tm-recurso button')].filter((b)=>b.textContent.trim()==='Simular').length`)
  ok(simular === 12, `12 botones «Simular» en el bloque 8 (${simular})`)
  await q(`[...document.querySelectorAll('[data-bloque="n1-b8"] .q-tm-recurso button')].find((b)=>b.textContent.trim()==='Simular').click(); await __q.esperar(900); return 1`)
  ok((await q(`return document.querySelector('[data-escena-suelta]')?.getAttribute('data-escena-suelta')`)) === 'gas-ideal', 'Simular abre la escena del gas ideal')
  ok((await q(`return document.querySelectorAll('[data-escena-suelta] [data-ir-subtema]').length`)) === 12, 'la escena suelta enlaza las 12 lecciones que la usan')

  console.log('--- Capítulo: portada, cierre e integradores')
  await ir('#/simulador-quimica/aprender-capitulo-b8')
  ok((await q(`return document.querySelectorAll('[data-capitulo-n1="capitulo-b8"] [data-mapa-capitulo] tbody tr').length`)) === 20, 'la portada muestra el mapa de los 20 subtemas')
  ok((await q(`return document.querySelectorAll('[data-capitulo-n1] .q-n1-glosario dt').length`)) >= 10, 'el cierre muestra el glosario del capítulo')
  ok(/recomendación/.test(await q(`return document.querySelector('[data-capitulo-n1]').textContent`)), 'la ruta sugerida se presenta como recomendación, no como bloqueo')
  await q(`document.querySelector('[data-capitulo-n1] [data-ir-subtema="n1-b8-s9"]').click(); await __q.esperar(500); return 1`)
  ok((await q(`return document.querySelector('[data-leccion-n1]')?.getAttribute('data-leccion-n1')`)) === 'gas-ideal', 'desde el mapa se abre cualquier subtema (el 9)')
  await ir('#/simulador-quimica/aprender-capitulo-b8')
  await q(`document.querySelector('[data-integradores]').click(); await __q.esperar(800); return 1`)
  ok((await q(`return document.querySelector('[data-practicas-n1]')?.getAttribute('data-practicas-n1')`)) === 'n1-b8-int', 'el botón abre los problemas integradores')
  ok((await q(`return document.querySelectorAll('[data-practicas-n1] [data-practica]').length`)) === 6, 'hay 6 problemas integradores')
  ok(/Combina los subtemas/.test(await q(`return __q.texto('[data-combina]')`)), 'cada integrador dice qué subtemas combina')
  await q(`__q.botonCon('Ver la resolución').click(); await __q.esperar(300); return 1`)
  const resp = await q(`return document.querySelector('[data-resolucion-n1] .notice').textContent.replace('Respuesta:','').trim().split(' ')[0]`)
  await q(`const i=document.querySelector('[data-respuesta-n1]'); i.focus(); __q.escribir(i, ${JSON.stringify(resp)}); await __q.esperar(100); document.querySelector('[data-practicas-n1] form button[type=submit]').click(); await __q.esperar(250); return 1`)
  ok((await q(`return document.querySelector('[data-veredicto-n1]').getAttribute('data-veredicto-n1')`)) === 'correcto', `la respuesta de la resolución del integrador se acepta (${resp})`)
  await app.captura(`${CAPS}/b08-libro-integradores${SUF}.png`)

  console.log('--- Matriz visual 1280×720 y 1024×640 × Día/Noche')
  const matriz = [[1280, 720, 'dia', 'light'], [1280, 720, 'noche', 'dark'], [1024, 640, 'dia', 'light'], [1024, 640, 'noche', 'dark']]
  const vistas = [
    ['leccion-s4', '#/simulador-quimica/aprender-gas-ley-boyle', '[data-leccion-n1]'],
    ['leccion-s16', '#/simulador-quimica/aprender-gas-velocidad-molecular', '[data-leccion-n1]'],
    ['leccion-s20', '#/simulador-quimica/aprender-gas-desviaciones', '[data-leccion-n1]'],
    ['capitulo', '#/simulador-quimica/aprender-capitulo-b8', '[data-capitulo-n1]'],
    ['escena', '#/simulador-quimica/aprender-escena-gas-ideal', '[data-escena-suelta]'],
    ['integradores', '#/simulador-quimica/practicas-n1-b8-int', '[data-practicas-n1]']
  ]
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    console.log(`   ventana pedida ${ancho}×${alto}: interior/exterior ${JSON.stringify(dim)}`)
    for (const [etq, hash, raiz] of vistas) {
      await ir(hash, tm)
      await q(`for (const d of document.querySelectorAll('${raiz} details')) d.open = true; for (const b of [...document.querySelectorAll('${raiz} button')].filter((x)=>x.textContent.includes('toda la resolución'))) b.click(); await __q.esperar(300); return 1`)
      await vista(raiz, `${etq}-${ancho}x${alto}-${nombre}${SUF}`)
      if ((nombre === 'dia' && ancho === 1280) || (nombre === 'noche' && ancho === 1024)) await app.captura(`${CAPS}/b08-libro-${etq}-${ancho}x${alto}-${nombre}${SUF}.png`)
    }
  }
  const cons = SIN_WEBGL ? app.consola.filter((c) => !/webgl|WebGL|context|contexto|boundary|límite|The above error|Error: /i.test(c)) : app.consola
  console.log('   consola:', JSON.stringify(cons.slice(0, 5)))
  ok(cons.length === 0, 'consola sin errores ni avisos')
} catch (e) {
  console.log('ERROR de guion:', e.message)
  fallos.push(`guion: ${e.message}`)
  try {
    await app.captura(`${CAPS}/b08-libro-error${SUF}.png`)
  } catch {
  }
}
await app.cerrar()
const despues = huella(REAL)
ok(antes === despues, `el perfil real (${REAL}) no cambió: ${antes === null ? 'no existe' : antes.split('\n').length + ' archivos'} antes y después`)
console.log(fallos.length === 0 ? 'TODO OK' : `FALLOS (${fallos.length}):\n- ${fallos.join('\n- ')}`)
process.exit(fallos.length === 0 ? 0 : 1)
