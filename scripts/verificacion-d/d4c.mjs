import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'
import { abrirApp, ESPERA, JS_AYUDAS } from './cdp.mjs'
import { SONDA } from './sonda.mjs'

if (!process.env.REPETIR_OBSOLETO) {
  console.error('OBSOLETO desde la Entrega E: asume la predicción obligatoria, el selector de nivel dentro de la simulación o la transferencia retirada. Lo sustituye scripts/verificacion-e/e1.mjs. Para repetirlo a propósito: REPETIR_OBSOLETO=1.')
  process.exit(2)
}

const PERFIL = resolve(tmpdir(), 'reng-verificacion-d4c')
const CAPS = fileURLToPath(new URL('../../docs/capturas-entrega-d', import.meta.url))
mkdirSync(CAPS, { recursive: true })
const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}
let app = await abrirApp(PERFIL)
const consolas = []
const q = (js) => app.ev(`${js}`)
const clic = (txt) => q(`const b=__q.botonCon(${JSON.stringify(txt)}); if(!b) throw new Error('sin botón: ' + ${JSON.stringify(txt)}); b.click(); await __q.esperar(350)`)
const campo = (etiqueta, valor) => q(`const c=[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.includes(${JSON.stringify(etiqueta)}))?.querySelector('input'); if(!c) throw new Error('sin campo ' + ${JSON.stringify(etiqueta)}); c.focus(); __q.escribir(c, ${JSON.stringify(valor)}); await __q.esperar(250)`)
const valorCampo = (etiqueta) => q(`return [...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.includes(${JSON.stringify(etiqueta)}))?.querySelector('input')?.value ?? null`)
const salida = () => q(`return __q.texto('.q-salida')`)
const val = (e) => q(`return [...document.querySelectorAll('.sim-res')].filter(x=>x.offsetParent).find(x=>x.textContent.includes(${JSON.stringify(e)}))?.querySelector('b')?.textContent ?? null`)
const radio = (nombre, indice) => q(`const r=[...document.querySelectorAll('input[name=${JSON.stringify(nombre)}]')].filter(e=>e.offsetParent); r[${indice}].click(); await __q.esperar(150)`)
const sinPredecir = () => q(`[...document.querySelectorAll('label.q-opcion')].find(l=>l.textContent.includes('sin predecir')).querySelector('input').click(); await __q.esperar(150)`)
const elegir = (etiqueta, id) => q(`const s=[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.trim()===${JSON.stringify(etiqueta)}).querySelector('select'); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,${JSON.stringify(id)}); s.dispatchEvent(new Event('change',{bubbles:true})); await __q.esperar(250)`)
const ano = (id) => elegir('Semicelda del ánodo (propuesta)', id)
const cat = (id) => elegir('Semicelda del cátodo (propuesta)', id)
const nivel = (txt) => q(`[...document.querySelectorAll('.q-nivel-global button')].find(b=>b.textContent.trim().startsWith(${JSON.stringify(txt)})).click(); await __q.esperar(300)`)
const ir = async (hash, niv) => {
  await q(`localStorage.setItem('ciencia.nivel.simulador-quimica','${niv}'); location.hash='${hash}'; location.reload()`)
  await ESPERA(2400)
  await app.ev(JS_AYUDAS)
}
const enter = async () => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await ESPERA(300)
}
const activo = () => q(`const e=document.activeElement; return e.tagName + ':' + (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 50)`)
const celda = (marca) => q(`return __q.texto('[data-${marca}]')`)
const guardar = async (etq) => {
  await clic('Guardar en cuaderno')
  await q(`[...document.querySelectorAll('.cuaderno-guardar button')].find(b=>b.textContent.trim()==='Guardar').click(); await __q.esperar(1300)`)
  ok(/guardada en/.test(await q(`return __q.texto('.cuaderno-guardar')`)), `${etq}: corrida guardada`)
}
const abrirCorrida = async (texto) => {
  await q(`location.hash='#/laboratorio/cuaderno'`)
  await ESPERA(1500)
  await app.ev(JS_AYUDAS)
  await q(`const el=[...document.querySelectorAll('button, li, [role=button]')].filter(e=>e.offsetParent).reverse().find(e=>e.textContent.includes(${JSON.stringify(texto)})); el.click(); await __q.esperar(600)`)
  return q(`return __q.texto('article.cuaderno-detalle')`)
}

try {
  await app.ventana(1360, 860)

  if (!process.env.D4C_SOLO_MATRIZ) {
    console.log('--- Escena, catálogo ofrecido y predicción')
    await ir('#/simulador-quimica/electroquimica', 'universitario')
    ok(/Electroquímica: celda galvánica/.test(await q(`return __q.texto('.q-barra h2')`)), 'abre la escena de electroquímica')
    const opciones = await q(`return [...[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.trim()==='Semicelda del ánodo (propuesta)').querySelectorAll('option')].map(o=>o.value + '|' + o.textContent)`)
    console.log('   catálogo:', opciones.join(' || '))
    ok(opciones.map((o) => o.split('|')[0]).join() === 'zn,cu,fe,mg,al,h2', 'ofrece exactamente los 6 pares con fuente (Zn, Cu, Fe, Mg, Al, H₂)')
    ok(!opciones.some((o) => /Níquel|Plata|Plomo|Mercurio|Cadmio|Cromo|Sodio|Cloro|Estaño/.test(o)), 'no ofrece pares tóxicos ni reactivos')
    const intro = await q(`return __q.texto('.q-escena')`)
    ok(/Wikipedia/.test(intro) && /298,15 K/.test(intro) && /SHE/.test(intro) && /Dato publicado/.test(intro), 'muestra la fuente, 298,15 K, SHE y «Dato publicado»')
    ok((await celda('e0="ano"')) === 'E° = −0,7618 V (dato publicado)' && (await celda('e0="cat"')) === 'E° = 0,337 V (dato publicado)', 'muestra el E° de cada semicelda (Zn −0,7618 V; Cu 0,337 V)')
    const botonOff = () => q(`const b=[...document.querySelectorAll('button')].filter(x=>x.offsetParent).find(x=>x.textContent.trim()==='Calcular'); return b ? b.disabled : null`)
    ok((await botonOff()) === true, '«Calcular» desactivado hasta predecir')
    await radio('q-ele-pred-esp', 0)
    ok((await botonOff()) === true, 'con una sola predicción sigue desactivado')
    await radio('q-ele-pred-el', 0)
    ok((await botonOff()) === false, 'con las dos predicciones se activa')
    await app.captura(`${CAPS}/d4c-prediccion-1360x860-dia.png`)
    await clic('Calcular')
    ok(/Resultado calculado/.test(await salida()), 'rotulado como resultado calculado')
    ok((await val('E°celda')) === '1,0988 V', `E°celda = 1,0988 V (${await val('E°celda')})`)
    ok((await val('Reacción global')) === 'Zn + Cu²⁺ → Zn²⁺ + Cu', 'reacción global Zn + Cu²⁺ → Zn²⁺ + Cu')
    ok((await val('Electrones intercambiados')) === '2', 'n = 2')
    ok((await val('ΔG° =')) === '-212,04 kJ/mol', `ΔG° = −212,04 kJ/mol (${await val('ΔG° =')}) como a mano`)
    ok((await val('ln K')) === '85,534', `ln K = 85,534 (${await val('ln K')})`)
    ok(/^1,40e\+37$/.test((await val('Constante de equilibrio K')) ?? ''), `K ≈ 1,40e+37 (${await val('Constante de equilibrio K')})`)
    ok((await val('E = E°')) === '1,0988 V' && (await val('Q = ')) === '1', 'con 1 mol/L: Nernst da E = E° y Q = 1')
    ok(/Zn → Zn²⁺ \+ 2 e⁻/.test(await celda('celda')) && /Cu²⁺ \+ 2 e⁻ → Cu/.test(await celda('celda')), 'ánodo (oxidación) y cátodo (reducción) con sus semirreacciones')
    ok(/del ánodo \(Zn\) al cátodo \(Cu\)/.test(await celda('electrones')), 'sentido de los electrones: del Zn al Cu')
    ok(/los aniones hacia el ánodo y los cationes hacia el cátodo/.test(await celda('iones')), 'sentido de los iones (puente salino idealizado)')
    ok(/acertaste/.test(await celda('propuesta')), 'tu propuesta de ánodo/cátodo es la real')
    ok(/Espontaneidad: dijiste «sí, es espontánea» → correcto/.test(await salida()) && /Electrones: dijiste «del ánodo propuesto al cátodo propuesto» → correcto/.test(await salida()), 'predicciones evaluadas (correctas)')
    ok((await q(`return __q.visible('.grafica-xy svg').length`)) >= 1, 'se dibuja la curva de Nernst')
    ok((await q(`return __q.visible('.q-celda-svg').length`)) === 1, 'se dibuja el esquema de la celda')
    await app.captura(`${CAPS}/d4c-resultado-1360x860-dia.png`)

    console.log('--- Selección ánodo/cátodo invertida, pares y Nernst')
    await ano('cu')
    await cat('zn')
    await clic('Actualizar')
    ok((await val('E°celda')) === '−1,0988 V', `Cu como ánodo y Zn como cátodo: E° = −1,0988 V (${await val('E°celda')})`)
    ok(/invertida: lo que propusiste como cátodo \(Cu\) es en realidad el ánodo/.test(await celda('propuesta')), 'dice que la propuesta está invertida')
    ok(/Zn → Zn²⁺ \+ 2 e⁻/.test(await celda('celda')) && /del ánodo \(Zn\) al cátodo \(Cu\)/.test(await celda('electrones')), 'el ánodo real sigue siendo el Zn y los electrones van del Zn al Cu')
    ok(/^[0-9]+,[0-9]+ kJ\/mol$/.test((await val('ΔG° =')) ?? ''), 'ΔG° positivo (no espontánea)')
    await ano('mg')
    await cat('al')
    await campo('Concentración de Mg²⁺ en el ánodo', '0.1')
    await campo('Concentración de Al³⁺ en el cátodo', '0.5')
    await clic('Actualizar')
    ok((await val('Reacción global')) === '3 Mg + 2 Al³⁺ → 3 Mg²⁺ + 2 Al' && (await val('Electrones intercambiados')) === '6', 'Mg | Al: n = 6 y 3 Mg + 2 Al³⁺ → 3 Mg²⁺ + 2 Al')
    ok((await val('ΔG° =')) === '-411,03 kJ/mol', `ΔG° = −411,03 kJ/mol (${await val('ΔG° =')})`)
    ok((await val('E = E°')) === '0,73364 V', `Nernst con 0,1 y 0,5 mol/L: E = 0,73364 V (${await val('E = E°')}) como a mano`)
    ok((await val('Q = ')) === '0,004', 'Q = [Mg²⁺]³/[Al³⁺]² = 0,004')
    await ano('h2')
    await cat('cu')
    await campo('Concentración de H⁺ en el ánodo', '0.001')
    await campo('Concentración de Cu²⁺ en el cátodo', '1')
    await clic('Actualizar')
    ok((await val('Reacción global')) === 'H₂ + Cu²⁺ → 2 H⁺ + Cu', 'H₂ | Cu: H₂ + Cu²⁺ → 2 H⁺ + Cu')
    ok((await val('E = E°')) === '0,51448 V', `pH 3: E = 0,51448 V (${await val('E = E°')})`)
    await ano('zn')
    await cat('zn')
    await campo('Concentración de Zn²⁺ en el ánodo', '1')
    await campo('Concentración de Zn²⁺ en el cátodo', '1')
    await clic('Actualizar')
    ok((await val('E°celda')) === '0 V' && /no circulan/.test(await celda('electrones')), 'dos semiceldas iguales a 1 mol/L: E° = 0 y no circulan electrones')
    ok(/Las dos semiceldas son el mismo par/.test(await q(`return __q.texto('[data-diagnosticos]')`)), 'avisa de que son el mismo par')
    await campo('Concentración de Zn²⁺ en el cátodo', '0.1')
    await clic('Actualizar')
    ok((await val('E = E°')) === '−0,02958 V' && /invertida/.test(await celda('propuesta')), 'pila de concentración: E = −0,02958 V; el cátodo real es el lado más concentrado')

    console.log('--- Diagnósticos y dominio')
    await ano('zn')
    await cat('cu')
    await campo('Concentración de Zn²⁺ en el ánodo', '0')
    await campo('Concentración de Cu²⁺ en el cátodo', '1')
    await clic('Actualizar')
    ok(/No se calcula el potencial con concentraciones/.test(await salida()) && /Falta Zn²⁺ del ánodo/.test(await q(`return __q.texto('[data-diagnosticos]')`)), 'falta una especie: no hay Nernst y dice cuál falta')
    ok((await val('E°celda')) === '1,0988 V', 'pero el E° estándar sí se calcula')
    await campo('Concentración de Zn²⁺ en el ánodo', '2')
    ok(/máximo 1/.test(await q(`return __q.texto('.q-fuera-dominio')`)), '2 mol/L: fuera de dominio (máximo 1), se conserva lo escrito')
    await clic('Actualizar')
    ok(/No se calculó: corrige/.test(await q(`return __q.texto('.q-calcular [role=alert]')`)), 'y bloquea el cálculo explicando qué corregir')
    await campo('Concentración de Zn²⁺ en el ánodo', '0.5')
    await clic('Actualizar')
    await nivel('Quím')
    const diag = await q(`return __q.texto('[data-diagnosticos]')`)
    ok(/supera 0,01 mol\/L/.test(diag) && /criterio convencional de este proyecto/.test(diag), 'concentrado: avisa de las actividades y rotula el umbral como convención')
    ok(/resistencia interna.*sobrepotencial.*polarización.*potencial de unión líquida.*puente salino/.test(diag), 'químico: declara las pérdidas omitidas')
    ok(/E° de esta celda sería 1,1037 V en vez de 1,0988 V/.test(diag) && /4,9 mV/.test(diag), 'químico: registra la discrepancia entre tablas (1,1037 V frente a 1,0988 V; 4,9 mV)')
    await ano('h2')
    await clic('Actualizar')
    const diagH = await q(`return __q.texto('[data-diagnosticos]')`)
    ok(/101,325 kPa/.test(diagH) && /no cita ninguna referencia/.test(diagH), 'H₂: avisa de la presión de la fuente y de que su fila no cita referencia')

    console.log('--- Panel «Modelo y supuestos»: fuentes consultadas')
    await clic('Modelo y supuestos')
    await ESPERA(300)
    await nivel('Cient')
    await clic('Modelo y supuestos')
    await ESPERA(300)
    const ficha = await q(`return __q.texto('.q-modelo')`)
    ok(/https:\/\/en\.wikipedia\.org\/wiki\/Standard_electrode_potential_\(data_page\)/.test(ficha), 'la ficha cita el enlace de la fuente de los potenciales')
    ok(/consultada 2026-11-15/.test(ficha) && /No leí la página entera/.test(ficha), 'la ficha dice cuándo se consultó y que solo se leyó un fragmento')
    ok(/fila literal: «Zn \| Zn2\+ \+ 2 e– ⇌ \[Zn\(s\)\] \| −0\.7618 \| 2 \| \[10\]»/.test(ficha), 'la ficha incluye la fila literal de la que se parsea el valor')
    ok(/referencia de la fila: \[10\] Vanýsek/.test(ficha) && /298,15 K \(25,00 °C\)/.test(ficha) && /SHE/.test(ficha), 'la ficha da la referencia de la fila, la temperatura y el convenio')
    ok(/CC BY-SA 4\.0/.test(ficha), 'la ficha da la licencia')
    ok(/Otra tabla abierta \(no se usa; sin condiciones declaradas\)/.test(ficha), 'la ficha registra los valores distintos de la otra tabla')
    ok(/CODATA 2018/.test(ficha) && /CODATA 2022/.test(ficha) && /puntos suspensivos/.test(ficha), 'la ficha cita CODATA 2018 y 2022 y que se usan los dígitos mostrados')
    ok(/Pérdidas omitidas: resistencia interna, sobrepotencial, polarización/.test(ficha), 'la ficha declara las pérdidas omitidas')

    console.log('--- Guardar, reabrir y repetir')
    await ir('#/simulador-quimica/electroquimica', 'universitario')
    await ano('mg')
    await cat('al')
    await campo('Concentración de Mg²⁺ en el ánodo', '0.1')
    await campo('Concentración de Al³⁺ en el cátodo', '0.5')
    await radio('q-ele-pred-esp', 0)
    await radio('q-ele-pred-el', 0)
    await clic('Calcular')
    await guardar('Mg | Al')
    const det = await abrirCorrida('Celda Mg|Al')
    ok(/Aproximación en el límite del modelo/.test(det) && /41 filas/.test(det) && /Wikipedia/.test(det), 'detalle: aproximación (concentraciones > 0,01), 41 filas y la fuente')
    await q(`[...document.querySelectorAll('button')].find(b=>b.offsetParent&&b.textContent.trim()==='Reabrir y repetir').click(); await __q.esperar(1700)`)
    await app.ev(JS_AYUDAS)
    ok(/simulador-quimica\/electroquimica/.test(await q(`return location.hash`)), 'reabrir vuelve a la escena')
    ok(/Reabierta desde el cuaderno/.test(await q(`return __q.texto('[data-reabierta]')`)), 'aviso de reapertura')
    ok((await val('Reacción global')) === '3 Mg + 2 Al³⁺ → 3 Mg²⁺ + 2 Al' && (await valorCampo('Concentración de Mg²⁺ en el ánodo')) === '0.1', 'restaura los electrodos, las concentraciones y el resultado')
    ok(!(await q(`return !!document.querySelector('[data-prediccion]')`)), 'no vuelve a pedir la predicción')
    await clic('Guardar en cuaderno')
    ok(/Se enlazará como repetición/.test(await q(`return __q.texto('.cuaderno-guardar')`)), 'guardar de nuevo se enlaza con la original')
    await q(`[...document.querySelectorAll('.cuaderno-guardar button')].find(b=>b.textContent.trim()==='Cancelar').click()`)

    console.log('--- Científico: sensibilidad')
    await ir('#/simulador-quimica/electroquimica', 'cientifico')
    await sinPredecir()
    await clic('Calcular')
    await campo('Concentración de Zn²⁺ en el ánodo', '0.1')
    await campo('Concentración de Cu²⁺ en el cátodo', '0.1')
    await clic('Actualizar')
    const sens = await q(`return __q.texto('[data-sensibilidad]')`)
    ok(/Concentración del ion en el ánodo/.test(sens) && /Concentración del ion en el cátodo/.test(sens) && /±/.test(sens), 'tabla de sensibilidad con las dos concentraciones')
    ok(/no es una incertidumbre medida|no es una incertidumbre/.test(sens), 'rotula la incertidumbre propagada como supuesta')

    console.log('--- Teclado real y nivel preuniversitario')
    await ir('#/simulador-quimica/electroquimica', 'preuniversitario')
    await q(`document.querySelector('input[name=q-ele-pred-esp]').click(); document.querySelector('input[name=q-ele-pred-el]').click(); await __q.esperar(150)`)
    await q(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Calcular').focus()`)
    ok(/Calcular/.test(await activo()), 'el botón se enfoca')
    await enter()
    ok((await val('E°celda')) === '1,0988 V', 'Intro sobre «Calcular» calcula')
    ok(!(await q(`return !!document.querySelector('[data-comparacion]')`)), 'preuniversitario: sin «Comparar dos casos»')
  }

  console.log('--- Matriz visual: 3 vistas × 2 tamaños × Día/Noche con sonda de contraste y desbordes (instancia nueva de la app)')
  consolas.push(...app.consola)
  await app.cerrar()
  app = await abrirApp(resolve(tmpdir(), 'reng-verificacion-d4c-matriz'), 9342)
  const matriz = [
    [1360, 860, 'dia', 'light'],
    [1360, 860, 'noche', 'dark'],
    [1024, 680, 'dia', 'light'],
    [1024, 680, 'noche', 'dark']
  ]
  const sinP = `[...document.querySelectorAll('label.q-opcion')].find(l=>l.textContent.includes('sin predecir')).querySelector('input').click(); await __q.esperar(150);`
  const sel = (et, id) => `{const s=[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.trim()==='${et}').querySelector('select'); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'${id}'); s.dispatchEvent(new Event('change',{bubbles:true})); await __q.esperar(200)}`
  const vistas = [
    ['inicial', 'universitario', ``],
    ['resultado', 'cientifico', `${sinP} __q.boton('Calcular').click(); await __q.esperar(500)`],
    ['invertida-quimico', 'quimico', `${sinP} ${sel('Semicelda del ánodo (propuesta)', 'cu')} ${sel('Semicelda del cátodo (propuesta)', 'mg')} __q.boton('Calcular').click(); await __q.esperar(500)`]
  ]
  await q(`sessionStorage.removeItem('quimica.transferencia-activa')`)
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    console.log(`   ventana pedida ${ancho}×${alto}:`, JSON.stringify(await app.ev('return [innerWidth, innerHeight, outerWidth, outerHeight, document.visibilityState, document.hasFocus()]')))
    for (const [vista, niv, pasos] of vistas) {
      await ir('#/simulador-quimica/electroquimica', niv)
      if (pasos) await app.ev(pasos)
      await app.ev(`document.documentElement.dataset.theme='${tm}'; await new Promise(r=>setTimeout(r,250)); return 1`)
      const r = await app.ev(SONDA)
      const etq = `electroquimica-${vista}-${niv}-${ancho}x${alto}-${nombre}`
      ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.recortados.length === 0 && r.selFuera.length === 0, `${etq} [${dim[2]}×${dim[3]}] textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde} fuera=${JSON.stringify(r.fuera)} recortados=${JSON.stringify(r.recortados)} selFuera=${JSON.stringify(r.selFuera)}`)
      if (vista !== 'inicial' && ((nombre === 'dia' && ancho === 1360) || (nombre === 'noche' && ancho === 1024))) await app.captura(`${CAPS}/d4c-${etq}.png`)
    }
  }
  consolas.push(...app.consola)
  console.log('consola:', consolas.slice(0, 5))
  ok(consolas.length === 0, 'consola sin errores')
} catch (e) {
  console.log('ERROR de guion:', e.message)
  fallos.push(`guion: ${e.message}`)
  try { await app.captura(`${CAPS}/d4c-error.png`) } catch {}
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
