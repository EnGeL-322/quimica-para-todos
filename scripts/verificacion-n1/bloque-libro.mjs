import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { abrirApp, ESPERA, JS_AYUDAS } from '../verificacion-d/cdp.mjs'
import { BASE_SONDA } from '../verificacion-d/sonda.mjs'

const SIN_WEBGL = process.env.N1_SIN_WEBGL === '1'
const BLOQUE = Number(process.argv[process.argv.indexOf('--bloque') + 1])
const CONF = {
  8: { leccion: 'gas-ley-boyle', figura: /^Figura 8\.4\.1\./, escena: 'gas-ideal', subtemas: 20, simular: 12, matriz: ['gas-ley-boyle', 'gas-velocidad-molecular', 'gas-desviaciones'] },
  7: { leccion: 'est-limitante', figura: /^Figura 7\.13\.1\./, escena: 'reactivo-limitante', subtemas: 21, simular: 10, matriz: ['est-limitante', 'est-formula-empirica', 'est-gases'] },
  9: { leccion: 'sol-molaridad', figura: /^Figura 9\.11\.1\./, escena: 'concentraciones', subtemas: 20, simular: 12, matriz: ['sol-molaridad', 'sol-sobresaturada', 'sol-coligativas'] },
  10: { leccion: 'ab-acidos-debiles', figura: /^Figura 10\.5\.1\./, escena: 'acido-base', subtemas: 22, simular: 32, matriz: ['ab-acidos-debiles', 'ab-lewis', 'eq-le-chatelier'] },
  11: { leccion: 'te-calor', figura: /^Figura 11\.1\.1\./, escena: 'calorimetria', subtemas: 20, simular: 15, matriz: ['te-calor', 'te-hess', 'te-faraday'] },
  5: { leccion: 'no-oxisales', figura: /^Figura 5\.14\.1\./, escena: 'formula-ionica', subtemas: 20, simular: 6, matriz: ['no-oxisales', 'no-simbolos', 'no-sales-basicas'] },
  6: { leccion: 'rq-combustion', figura: /^Figura 6\.14\.1\./, escena: 'combustion', subtemas: 20, simular: 8, matriz: ['rq-combustion', 'rq-concepto', 'rq-reductores'] },
  1: { leccion: 'fu-densidad', figura: /^Figura 1\.21\.1\./, escena: 'densidad', subtemas: 23, simular: 16, matriz: ['fu-densidad', 'fu-quimica', 'fu-seguridad'] },
  2: { leccion: 'at-iones', figura: /^Figura 2\.14\.1\./, escena: 'atomo', subtemas: 25, simular: 22, matriz: ['at-iones', 'at-dalton', 'at-configuracion'] },
  3: { leccion: 'tp-radio-atomico', figura: /^Figura 3\.15\.1\./, escena: 'tendencias-periodicas', subtemas: 23, simular: 19, matriz: ['tp-radio-atomico', 'tp-historia', 'tp-prediccion'] },
  4: { leccion: 'en-carga-formal', figura: /^Figura 4\.4\.1\./, escena: 'carga-formal', subtemas: 22, simular: 20, matriz: ['en-carga-formal', 'en-resonancia', 'en-om'] },
  12: { leccion: 'or-alcanos', figura: /^Figura 12\.7\.1\./, escena: 'hidrocarburo', subtemas: 22, simular: 22, matriz: ['or-alcanos', 'or-grupos', 'or-polimeros'] }
}[BLOQUE]
if (!CONF) throw new Error('Indica --bloque N con un bloque configurado')
const DOS = String(BLOQUE).padStart(2, '0')
const SUF = SIN_WEBGL ? '-sinwebgl' : ''
const PERFIL = resolve(tmpdir(), `reng-verificacion-n1-libro-b${BLOQUE}${SUF}`)
const CAPS = fileURLToPath(new URL(`../../docs/capturas-n1-b${DOS}-libro`, import.meta.url))
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
  console.log(`--- Nivel 1 · bloque ${BLOQUE} versión «libro» ${SIN_WEBGL ? 'SIN WebGL' : 'con WebGL'} (perfil ${PERFIL})`)
  await app.ventana(1280, 720)

  console.log(`--- Lección completa (${CONF.leccion})`)
  await ir(`#/simulador-quimica/aprender-${CONF.leccion}`)
  const secciones = await q(`return [...document.querySelectorAll('[data-leccion-n1] [data-seccion], [data-leccion-n1] [data-capa]')].map((e) => e.dataset.seccion || e.dataset.capa)`)
  ok(['por-que-importa', 'comprender', 'formalizar', 'aplicar', 'explorar', 'comprobar', 'resumen', 'conexiones'].every((x) => secciones.includes(x)), `la lección tiene todas las secciones (${secciones.join(', ')})`)
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] .q-n1-objetivos li').length`)) >= 2, 'muestra al menos 2 objetivos')
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] [data-ejemplo]').length`)) === 2, 'muestra dos ejemplos resueltos (directo e integrador)')
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] .q-n1-errores li').length`)) >= 2, 'muestra al menos dos errores frecuentes con su corrección')
  ok((await q(`return document.querySelectorAll('[data-leccion-n1] .q-n1-glosario dt').length`)) >= 2, 'muestra el glosario')
  const fig = await q(`const f=document.querySelector('[data-leccion-n1] [data-capa="formalizar"] figure'); if(!f) return null; const s=f.querySelector('svg'); return { pie: f.querySelector('figcaption').textContent, rol: s.getAttribute('role'), titulo: s.querySelector('title')?.textContent, alt: s.querySelector('desc')?.textContent, w: Math.round(s.getBoundingClientRect().width) }`)
  ok(fig && CONF.figura.test(fig.pie) && fig.rol === 'img' && fig.titulo && fig.alt.length > 40 && fig.w > 200, `la figura tiene pie numerado, role=img, título y texto alternativo (${fig ? fig.pie.slice(0, 40) : 'sin figura'})`)

  console.log('--- Ejemplo integrador')
  await q(`const a=document.querySelectorAll('[data-leccion-n1] [data-ejemplo]')[1]; [...a.querySelectorAll('button')].find((b)=>b.textContent.includes('toda la resolución')).click(); await __q.esperar(200); return 1`)
  const res2 = await q(`return document.querySelectorAll('[data-leccion-n1] [data-ejemplo]')[1].querySelector('[data-resultado-ejemplo]')?.textContent ?? ''`)
  ok(/Resultado/.test(res2) && /otro camino/.test(res2) && !/NaN/.test(res2), `el ejemplo integrador muestra su resultado y declara su segundo método (${res2.slice(0, 60)})`)

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

  console.log('--- Escena dentro de la lección')
  ok(await q(`return !!document.querySelector('[data-leccion-n1] [data-escena-n1="${CONF.escena}"]')`), `la capa Explorar contiene la escena «${CONF.escena}»`)
  if (CONF.escena === 'gas-ideal') {
    const p0 = numero(await lectura('P'))
    ok(/^8,314/.test(await lectura('R')), 'P·V/(n·T) muestra R')
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="V"] input[type=number]'); __q.escribir(i, String(Number(i.value)/2)); await __q.esperar(250); return 1`)
    ok(Math.abs(numero(await lectura('P')) / p0 - 2) < 0.01, 'al reducir V a la mitad la presión se duplica')
  } else if (CONF.escena === 'concentraciones') {
    const b0 = numero(await lectura('molal'))
    ok(/^0,400/.test(await lectura('molal')), `con 5,85 g de soluto en 250 g de agua la molalidad es 0,400 mol/kg (${await lectura('molal')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="md"] input[type=number]'); __q.escribir(i, String(Number(i.value)*2)); await __q.esperar(250); return 1`)
    ok(Math.abs(numero(await lectura('molal')) / b0 - 0.5) < 0.01, 'al duplicar el agua la molalidad se reduce a la mitad')
  } else if (CONF.escena === 'calorimetria') {
    const t0 = numero(await lectura('Tf'))
    ok(/^23,8/.test(await lectura('Tf')), `con 100 g de metal a 95 °C en 200 g de agua a 20 °C la temperatura final es 23,8 °C (${await lectura('Tf')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="m2"] input[type=number]'); __q.escribir(i, String(Number(i.value)*2)); await __q.esperar(250); return 1`)
    ok(numero(await lectura('Tf')) < t0, `con el doble de agua la temperatura final baja (${await lectura('Tf')})`)
  } else if (CONF.escena === 'formula-ionica') {
    ok(/^342,1/.test(await lectura('masa')), `con Al³⁺ y SO₄²⁻ la masa fórmula de Al₂(SO₄)₃ es 342,1 g/mol (${await lectura('masa')})`)
    ok((await lectura('nc')).startsWith('2') && (await lectura('na')).startsWith('3'), 'los subíndices cruzados son 2 y 3')
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="za"] input[type=number]'); __q.escribir(i, '1'); await __q.esperar(250); return 1`)
    ok((await lectura('nc')).startsWith('1') && (await lectura('na')).startsWith('3'), `con un anión 1− la fórmula pasa a 1:3 (${await lectura('nc')} : ${await lectura('na')})`)
  } else if (CONF.escena === 'combustion') {
    ok(/^44,0/.test(await lectura('mco2')), `al quemar 1 mol de metano se forman 44,0 g de CO₂ (${await lectura('mco2')})`)
    ok((await lectura('b')).startsWith('2') && /^(0|−?0,0+)( |$)/.test(await lectura('balance')), `el metano necesita 2 O₂ y la masa se conserva (${await lectura('b')}; ${await lectura('balance')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="x"] input[type=number]'); __q.escribir(i, '3'); const j=document.querySelector('[data-escena-n1] [data-parametro="y"] input[type=number]'); __q.escribir(j, '8'); await __q.esperar(250); return 1`)
    ok((await lectura('b')).startsWith('5') && (await lectura('c')).startsWith('3'), `con propano los coeficientes pasan a 5 O₂ y 3 CO₂ (${await lectura('b')}, ${await lectura('c')})`)
  } else if (CONF.escena === 'atomo') {
    ok((await lectura('e')).startsWith('18') && (await lectura('A')).startsWith('35'), `el ion cloruro ³⁵Cl⁻ tiene 18 electrones y A = 35 (${await lectura('e')}; ${await lectura('A')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="q"] input[type=number]'); __q.escribir(i, '1'); await __q.esperar(250); return 1`)
    ok((await lectura('e')).startsWith('16') && (await lectura('p')).startsWith('17'), `con carga +1 quedan 16 electrones y los protones no cambian (${await lectura('e')}; ${await lectura('p')})`)
  } else if (CONF.escena === 'hidrocarburo') {
    ok((await lectura('H')).startsWith('4') && (await lectura('masa')).startsWith('16'), `el metano tiene 4 hidrógenos y 16 g/mol (${await lectura('H')}; ${await lectura('masa')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="C"] input[type=number]'); __q.escribir(i, '3'); await __q.esperar(250); return 1`)
    ok((await lectura('H')).startsWith('8') && (await lectura('masa')).startsWith('44'), `con tres carbonos es propano: 8 hidrógenos y 44 g/mol (${await lectura('H')}; ${await lectura('masa')})`)
  } else if (CONF.escena === 'carga-formal') {
    ok((await lectura('alrededor')).startsWith('8') && /^\+?1/.test(await lectura('cf')), `el nitrógeno del amonio tiene 8 electrones alrededor y carga formal +1 (${await lectura('alrededor')}; ${await lectura('cf')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="B"] input[type=number]'); __q.escribir(i, '3'); await __q.esperar(250); return 1`)
    ok((await lectura('alrededor')).startsWith('6') && /^\+?2/.test(await lectura('cf')), `con tres enlaces quedan 6 electrones alrededor y carga formal +2 (${await lectura('alrededor')}; ${await lectura('cf')})`)
  } else if (CONF.escena === 'tendencias-periodicas') {
    ok((await lectura('radio')).startsWith('152') && (await lectura('Z')).startsWith('3'), `el litio (periodo 2, grupo 1) tiene Z = 3 y un radio de 152 pm (${await lectura('Z')}; ${await lectura('radio')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="columna"] input[type=number]'); __q.escribir(i, '7'); await __q.esperar(250); return 1`)
    ok((await lectura('radio')).startsWith('72') && (await lectura('grupo')).startsWith('17'), `con siete electrones de valencia se pasa al flúor, de 72 pm y grupo 17 (${await lectura('radio')}; ${await lectura('grupo')})`)
  } else if (CONF.escena === 'densidad') {
    ok(/^0,75/.test(await lectura('rho')) && /^75/.test(await lectura('sumergido')), `un bloque de 300 g y 400 mL tiene 0,75 g/mL y flota con el 75 % sumergido (${await lectura('rho')}; ${await lectura('sumergido')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="m"] input[type=number]'); __q.escribir(i, '500'); await __q.esperar(250); return 1`)
    ok((await lectura('flota')).startsWith('0'), `con 500 g el bloque es más denso que el agua y se hunde (${await lectura('flota')})`)
  } else if (CONF.escena === 'acido-base') {
    ok(/^2,88/.test(await lectura('pH')), `con HA 0,1 mol/L y pKa 4,76 el pH es 2,88 (${await lectura('pH')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="Cb"] input[type=number]'); __q.escribir(i, '0.1'); await __q.esperar(250); return 1`)
    ok(numero(await lectura('pH')) > 8, `con tanta NaOH como ácido el pH pasa a básico (${await lectura('pH')})`)
  } else {
    ok((await lectura('limitante')).startsWith('2'), `con los valores propuestos el limitante es el reactivo 2 (${await lectura('limitante')})`)
    ok(/^(0|−?0,0+)( |$)/.test(await lectura('balance')), `la masa consumida es igual a la formada (${await lectura('balance')})`)
    await q(`const i=document.querySelector('[data-escena-n1] [data-parametro="n2"] input[type=number]'); __q.escribir(i, '9'); await __q.esperar(250); return 1`)
    ok((await lectura('limitante')).startsWith('1'), `con 9 mol del segundo reactivo el limitante pasa a ser el 1 (${await lectura('limitante')})`)
  }
  const palabras = await q(`return document.querySelector('[data-escena-n1] [data-en-palabras]').textContent`)
  ok(palabras.length > 80 && !/NaN|undefined/.test(palabras), `«En palabras» describe el estado (${palabras.slice(0, 70)})`)
  await q(`document.querySelector('[data-escena-n1] [data-accion="valores-iniciales"]').click(); await __q.esperar(200); return 1`)
  ok(!(await q(`return !!document.querySelector('[data-escena-problema]')`)), 'la escena no muestra avisos de problema del modelo')
  await app.captura(`${CAPS}/b${DOS}-libro-leccion-s4${SUF}.png`)

  console.log('--- Escena suelta y botón «Simular» del temario')
  await ir('#/simulador-quimica/temario')
  await q(`const b=document.querySelector('[data-bloque="n1-b${BLOQUE}"] .q-tm-plegar'); if (b.getAttribute('aria-expanded') !== 'true') b.click(); await __q.esperar(400); return 1`)
  const simular = await q(`return [...document.querySelectorAll('[data-bloque="n1-b${BLOQUE}"] .q-tm-recurso button')].filter((b)=>b.textContent.trim()==='Simular').length`)
  ok(simular === CONF.simular, `${CONF.simular} botones «Simular» en el bloque ${BLOQUE} (${simular})`)
  await q(`[...document.querySelectorAll('[data-bloque="n1-b${BLOQUE}"] .q-tm-recurso button')].find((b)=>b.textContent.trim()==='Simular').click(); await __q.esperar(900); return 1`)
  ok(!!(await q(`return document.querySelector('[data-escena-suelta]')?.getAttribute('data-escena-suelta')`)), 'Simular abre una escena suelta')
  ok((await q(`return document.querySelectorAll('[data-escena-suelta] [data-ir-subtema]').length`)) >= 1, 'la escena suelta enlaza las lecciones que la usan')

  console.log('--- Capítulo: portada, cierre e integradores')
  await ir(`#/simulador-quimica/aprender-capitulo-b${BLOQUE}`)
  ok((await q(`return document.querySelectorAll('[data-capitulo-n1="capitulo-b${BLOQUE}"] [data-mapa-capitulo] tbody tr').length`)) === CONF.subtemas, `la portada muestra el mapa de los ${CONF.subtemas} subtemas`)
  ok((await q(`return document.querySelectorAll('[data-capitulo-n1] .q-n1-glosario dt').length`)) >= 10, 'el cierre muestra el glosario del capítulo')
  ok(/recomendación/.test(await q(`return document.querySelector('[data-capitulo-n1]').textContent`)), 'la ruta sugerida se presenta como recomendación, no como bloqueo')
  await q(`document.querySelector('[data-capitulo-n1] [data-ir-subtema="n1-b${BLOQUE}-s9"]').click(); await __q.esperar(500); return 1`)
  ok((await q(`return document.querySelector('[data-leccion-n1]')?.getAttribute('data-subtema')`)) === `n1-b${BLOQUE}-s9`, 'desde el mapa se abre cualquier subtema (el 9)')
  await ir(`#/simulador-quimica/aprender-capitulo-b${BLOQUE}`)
  await q(`document.querySelector('[data-integradores]').click(); await __q.esperar(800); return 1`)
  ok((await q(`return document.querySelector('[data-practicas-n1]')?.getAttribute('data-practicas-n1')`)) === `n1-b${BLOQUE}-int`, 'el botón abre los problemas integradores')
  ok((await q(`return document.querySelectorAll('[data-practicas-n1] [data-practica]').length`)) === 6, 'hay 6 problemas integradores')
  ok(/Combina los subtemas/.test(await q(`return __q.texto('[data-combina]')`)), 'cada integrador dice qué subtemas combina')
  await q(`__q.botonCon('Ver la resolución').click(); await __q.esperar(300); return 1`)
  const resp = await q(`return document.querySelector('[data-resolucion-n1] .notice').textContent.replace('Respuesta:','').trim().split(' ')[0]`)
  await q(`const i=document.querySelector('[data-respuesta-n1]'); i.focus(); __q.escribir(i, ${JSON.stringify(resp)}); await __q.esperar(100); document.querySelector('[data-practicas-n1] form button[type=submit]').click(); await __q.esperar(250); return 1`)
  ok((await q(`return document.querySelector('[data-veredicto-n1]').getAttribute('data-veredicto-n1')`)) === 'correcto', `la respuesta de la resolución del integrador se acepta (${resp})`)
  await app.captura(`${CAPS}/b${DOS}-libro-integradores${SUF}.png`)

  console.log('--- Matriz visual 1280×720 y 1024×640 × Día/Noche')
  const matriz = [[1280, 720, 'dia', 'light'], [1280, 720, 'noche', 'dark'], [1024, 640, 'dia', 'light'], [1024, 640, 'noche', 'dark']]
  const vistas = [
    ...CONF.matriz.map((id) => [id, `#/simulador-quimica/aprender-${id}`, '[data-leccion-n1]']),
    ['capitulo', `#/simulador-quimica/aprender-capitulo-b${BLOQUE}`, '[data-capitulo-n1]'],
    ['escena', `#/simulador-quimica/aprender-escena-${CONF.escena}`, '[data-escena-suelta]'],
    ['integradores', `#/simulador-quimica/practicas-n1-b${BLOQUE}-int`, '[data-practicas-n1]']
  ]
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    console.log(`   ventana pedida ${ancho}×${alto}: interior/exterior ${JSON.stringify(dim)}`)
    for (const [etq, hash, raiz] of vistas) {
      await ir(hash, tm)
      await q(`for (const d of document.querySelectorAll('${raiz} details')) d.open = true; for (const b of [...document.querySelectorAll('${raiz} button')].filter((x)=>x.textContent.includes('toda la resolución'))) b.click(); await __q.esperar(300); return 1`)
      await vista(raiz, `${etq}-${ancho}x${alto}-${nombre}${SUF}`)
      if ((nombre === 'dia' && ancho === 1280) || (nombre === 'noche' && ancho === 1024)) await app.captura(`${CAPS}/b${DOS}-libro-${etq}-${ancho}x${alto}-${nombre}${SUF}.png`)
    }
  }
  const cons = SIN_WEBGL ? app.consola.filter((c) => !/webgl|WebGL|context|contexto|boundary|límite|The above error|Error: /i.test(c)) : app.consola
  console.log('   consola:', JSON.stringify(cons.slice(0, 5)))
  ok(cons.length === 0, 'consola sin errores ni avisos')
} catch (e) {
  console.log('ERROR de guion:', e.message)
  fallos.push(`guion: ${e.message}`)
  try {
    await app.captura(`${CAPS}/b${DOS}-libro-error${SUF}.png`)
  } catch {
  }
}
await app.cerrar()
const despues = huella(REAL)
ok(antes === despues, `el perfil real (${REAL}) no cambió: ${antes === null ? 'no existe' : antes.split('\n').length + ' archivos'} antes y después`)
console.log(fallos.length === 0 ? 'TODO OK' : `FALLOS (${fallos.length}):\n- ${fallos.join('\n- ')}`)
process.exit(fallos.length === 0 ? 0 : 1)
