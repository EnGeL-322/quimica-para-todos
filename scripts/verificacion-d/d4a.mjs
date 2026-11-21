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

const PERFIL = resolve(tmpdir(), 'reng-verificacion-d4a')
const CAPS = fileURLToPath(new URL('../../docs/capturas-entrega-d', import.meta.url))
mkdirSync(CAPS, { recursive: true })
const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}
const app = await abrirApp(PERFIL)
const q = (js) => app.ev(`${js}`)
const clic = (txt) => q(`const b=__q.botonCon(${JSON.stringify(txt)}); if(!b) throw new Error('sin botón: ' + ${JSON.stringify(txt)}); b.click(); await __q.esperar(350)`)
const campo = (etiqueta, valor) => q(`const c=[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.includes(${JSON.stringify(etiqueta)}))?.querySelector('input'); if(!c) throw new Error('sin campo ' + ${JSON.stringify(etiqueta)}); c.focus(); __q.escribir(c, ${JSON.stringify(valor)}); await __q.esperar(250)`)
const valorCampo = (etiqueta) => q(`return [...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.includes(${JSON.stringify(etiqueta)}))?.querySelector('input')?.value ?? null`)
const salida = () => q(`return __q.texto('.q-salida')`)
const val = (e) => q(`return [...document.querySelectorAll('.sim-res')].filter(x=>x.offsetParent).find(x=>x.textContent.includes(${JSON.stringify(e)}))?.querySelector('b')?.textContent ?? null`)
const radio = (nombre, indice) => q(`const r=[...document.querySelectorAll('input[name=${JSON.stringify(nombre)}]')].filter(e=>e.offsetParent); r[${indice}].click(); await __q.esperar(150)`)
const ir = async (hash, nivel) => {
  await q(`localStorage.setItem('ciencia.nivel.simulador-quimica','${nivel}'); location.hash='${hash}'; location.reload()`)
  await ESPERA(2400)
  await app.ev(JS_AYUDAS)
}
const botonDeshabilitado = (txt) => q(`const b=[...document.querySelectorAll('button')].filter(x=>x.offsetParent).find(x=>x.textContent.trim()===${JSON.stringify(txt)}); return b ? b.disabled : null`)
const tab = async () => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
}
const enter = async () => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await ESPERA(300)
}
const activo = () => q(`const e=document.activeElement; return e.tagName + ':' + (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 50)`)
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

  console.log('--- Estado inicial, predicción y resultado')
  await ir('#/simulador-quimica/colorimetria', 'universitario')
  ok(/Colorimetría: curva de calibración/.test(await q(`return __q.texto('.q-barra h2')`)), 'abre la escena de colorimetría')
  ok(/DIDÁCTICOS de un colorante alimentario de ejemplo: no son mediciones/.test(await q(`return __q.texto('.q-escena')`)), 'rotula los datos como didácticos de un colorante de ejemplo')
  ok((await valorCampo('Patrón 5: concentración')) === '10', 'cinco patrones de ejemplo cargados (el 5.º es 10 mg/L)')
  ok((await valorCampo('Patrón 1: absorbancia')) === '0.11', 'absorbancia del patrón 1 = 0,11')
  ok((await botonDeshabilitado('Calcular')) === true, '«Calcular» está desactivado hasta predecir')
  ok(/Elige las dos predicciones/.test(await q(`return __q.texto('.q-calcular')`)), 'dice por qué está desactivado')
  ok(!/Concentración de la muestra/.test(await salida()) || !/mg\/L/.test(await salida()), 'antes de predecir no hay resultado')
  await radio('q-col-pred-zona', 0)
  ok((await botonDeshabilitado('Calcular')) === true, 'con una sola predicción sigue desactivado')
  await radio('q-col-pred-efecto', 1)
  ok((await botonDeshabilitado('Calcular')) === false, 'con las dos predicciones se activa')
  await app.captura(`${CAPS}/d4a-prediccion-1360x860-dia.png`)
  await clic('Calcular')
  ok((await val('Concentración')) === '4,99 mg/L', `concentración = 4,99 mg/L (${await val('Concentración')})`)
  ok((await val('Incertidumbre típica')) === '0,082 mg/L', `u = 0,082 mg/L (${await val('Incertidumbre típica')})`)
  ok((await val('Pendiente m')) === '0,0495 L/mg', `pendiente 0,0495 L/mg (${await val('Pendiente m')})`)
  ok((await val('R²')) === '0,99959', `R² = 0,99959 (${await val('R²')})`)
  ok((await val('Blanco medio restado')) === '0,01', `blanco medio 0,01 (${await val('Blanco medio restado')})`)
  let t = await salida()
  ok(/Interpolada/.test(t) && /Resultado calculado/.test(t), 'rotulado como interpolada y resultado calculado')
  ok(/Absorbancia de la muestra: dijiste «dentro del intervalo de los patrones» → correcto/.test(t), 'predicción 1 evaluada: correcto')
  ok(/dijiste que la concentración «no cambia» → correcto/.test(t), 'predicción 2 evaluada: correcto (el blanco se cancela)')
  ok((await q(`return document.querySelectorAll('.q-salida table tbody tr').length`)) === 5, 'tabla de residuos con 5 patrones')
  ok(/-0,002|−0,002/.test(await q(`return __q.texto('.q-salida table')`)), 'residuo del patrón 1 = −0,002')
  ok((await q(`return __q.visible('.grafica-xy svg').length`)) >= 1, 'se dibuja la curva')
  ok(/Datos aplicados: blancos: 0,008; 0,012 · patrones \(mg\/L → A\): 2 → 0,11/.test(await salida()), 'muestra los datos aplicados')
  ok((await q(`return !!document.querySelector('[data-comparacion]')`)) === true, 'universitario: «Comparar dos casos»')
  await app.captura(`${CAPS}/d4a-resultado-1360x860-dia.png`)
  await q(`document.querySelector('.grafica-xy').scrollIntoView({ block: 'start' }); await __q.esperar(300)`)
  await app.captura(`${CAPS}/d4a-curva-1360x860-dia.png`)
  await q(`window.scrollTo(0, 0); document.querySelectorAll('*').forEach(e=>{ if (e.scrollTop) e.scrollTop = 0 }); await __q.esperar(200)`)
  ok(await q(`return [...document.querySelectorAll('select.q-unidad')].filter(e=>e.offsetParent).every(e=>e.scrollWidth <= e.clientWidth + 1 && e.getBoundingClientRect().width >= 90)`), 'los selectores de unidad no quedan recortados')

  console.log('--- Extrapolar no')
  await campo('Muestra: absorbancia', '0.55')
  ok(/Resultado del cálculo anterior/.test(await salida()), 'al editar, el resultado queda marcado como anterior')
  await clic('Actualizar')
  t = await salida()
  ok(/No se calcula la concentración/.test(t), 'por encima del patrón más concentrado: no se calcula')
  ok(!/Incertidumbre típica/.test(t), 'no hay incertidumbre inventada')
  ok(await q(`return ![...document.querySelectorAll('.sim-res')].filter(x=>x.offsetParent).some(x=>x.querySelector('small')?.textContent.trim()==='Concentración')`), 'no aparece fila «Concentración»')
  ok(/mayor que la del patrón más concentrado/.test(await q(`return __q.texto('[data-diagnosticos]')`)) && /NO se calcula la concentración/.test(await q(`return __q.texto('[data-diagnosticos]')`)), 'el diagnóstico explica por qué')
  ok(/Fuera del dominio del modelo/.test(await q(`return __q.texto('[data-diagnosticos]')`)), 'etiquetado fuera del dominio')
  await guardar('extrapolación')
  let det = await abrirCorrida('fuera de la curva')
  ok(/Fuera del dominio del modelo/.test(det) && /No entra en el comparador/.test(det), 'Cuaderno: fuera del dominio y no entra en el comparador')
  await q(`location.hash='#/simulador-quimica/colorimetria'`)
  await ESPERA(900)
  await app.ev(JS_AYUDAS)

  console.log('--- Diagnósticos de entrada')
  await campo('Muestra: absorbancia', '0.26')
  await q(`[...document.querySelectorAll('.q-nivel-global button')].find(b=>b.textContent.trim().startsWith('Quím')).click(); await __q.esperar(300)`)
  await clic('Quitar patrón 5')
  await clic('Quitar patrón 4')
  await clic('Quitar patrón 3')
  ok(/al menos 3 patrones/.test(await q(`return __q.texto('.q-entrada .notice')`)), 'con 2 patrones avisa en vivo: hacen falta al menos 3')
  await q(`[...document.querySelectorAll('label.q-opcion')].find(l=>l.textContent.includes('sin predecir')).querySelector('input').click(); await __q.esperar(150)`)
  await clic('Calcular')
  ok(/No se puede calcular/.test(await salida()) && /al menos 3 patrones/.test(await salida()), 'y al calcular dice que no se puede (sin número)')
  await clic('Añadir patrón')
  ok(!(await q(`return /al menos 3 patrones/.test(__q.texto('.q-entrada .notice'))`)), 'con 3 patrones desaparece el aviso del formulario')
  await clic('Actualizar')
  ok(/1 grado de libertad/.test(await salida()), 'con 3 patrones avisa del único grado de libertad')
  await clic('Añadir patrón')
  await clic('Actualizar')
  ok((await valorCampo('Patrón 4: concentración')) !== null, 'se añade el patrón 4 (copia del último, para editar)')
  await campo('Patrón 4: concentración', '6')
  await clic('Actualizar')
  ok(/misma concentración y la misma absorbancia/.test(await salida()), 'patrón repetido (misma concentración y absorbancia): aviso de fila copiada')
  await campo('Patrón 3: absorbancia', '1.2')
  await clic('Actualizar')
  t = await salida()
  ok(/supera A = 1/.test(t) && /Wenzel/.test(t) && /recomendación de trabajo/.test(t), 'saturación: cita la fuente consultada y su alcance real')
  await campo('Patrón 3: absorbancia', '0.31')
  await campo('Patrón 1: absorbancia', '0.004')
  await clic('Actualizar')
  ok(/absorbancia negativa/.test(await salida()), 'absorbancia negativa tras restar el blanco')
  await campo('Muestra: absorbancia', 'abc')
  const inv = await q(`return [__q.campo('Muestra: absorbancia')?.getAttribute('aria-invalid'), 1]`)
  ok(inv[0] === 'true', 'texto no numérico marca el campo inválido')
  await clic('Actualizar')
  ok(/No se calculó: corrige «Muestra: absorbancia»/.test(await q(`return __q.texto('.q-calcular [role=alert]')`)), 'y bloquea el cálculo explicando qué corregir')
  await ir('#/simulador-quimica/colorimetria', 'universitario')

  console.log('--- Unidades editables (universitario)')
  await q(`const s=[...document.querySelectorAll('select.q-unidad')].filter(e=>e.offsetParent).find(e=>/Patrón 1: concentración/.test(e.getAttribute('aria-label'))); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'g/L'); s.dispatchEvent(new Event('change',{bubbles:true})); await __q.esperar(250)`)
  ok((await valorCampo('Patrón 1: concentración')) === '0.002', `2 mg/L se ve como 0,002 g/L (${await valorCampo('Patrón 1: concentración')})`)

  console.log('--- Guardar, reabrir y repetir (caso interpolado)')
  await radio('q-col-pred-zona', 0)
  await radio('q-col-pred-efecto', 1)
  await clic('Calcular')
  await guardar('interpolado')
  det = await abrirCorrida('Colorimetría: muestra 4,99')
  ok(/Resultado calculado/.test(det) && /5 filas/.test(det) && /Wenzel/.test(det), 'detalle: calculado, 5 filas y la fuente consultada')
  await clic('Reabrir y repetir')
  await ESPERA(1600)
  await app.ev(JS_AYUDAS)
  ok(/simulador-quimica\/colorimetria/.test(await q(`return location.hash`)), 'vuelve a la escena de colorimetría')
  ok(/Reabierta desde el cuaderno/.test(await q(`return __q.texto('[data-reabierta]')`)), 'aviso de reapertura')
  ok((await valorCampo('Patrón 5: concentración')) === '10' && (await valorCampo('Muestra: absorbancia')) === '0.26', 'restaura patrones y muestra')
  ok((await val('Concentración')) === '4,99 mg/L', 'restaura el resultado')
  ok(!(await q(`return !!document.querySelector('[data-prediccion]')`)), 'no vuelve a pedir la predicción')
  await clic('Guardar en cuaderno')
  ok(/Se enlazará como repetición/.test(await q(`return __q.texto('.cuaderno-guardar')`)), 'guardar de nuevo se enlaza con la original')
  await q(`[...document.querySelectorAll('.cuaderno-guardar button')].find(b=>b.textContent.trim()==='Cancelar').click()`)

  console.log('--- Científico: sensibilidad')
  await ir('#/simulador-quimica/colorimetria', 'cientifico')
  await q(`[...document.querySelectorAll('label.q-opcion')].find(l=>l.textContent.includes('sin predecir')).querySelector('input').click(); await __q.esperar(200)`)
  await clic('Calcular')
  const sens = await q(`return __q.texto('[data-sensibilidad]')`)
  ok(/Muestra: absorbancia/.test(sens) && /±/.test(sens), 'tabla de sensibilidad con la absorbancia de la muestra')
  ok(!/Blanco 1: absorbancia/.test(sens), 'el blanco no aparece (no influye en la concentración)')
  ok(/no es una incertidumbre medida|no es una incertidumbre/.test(sens), 'rotula la incertidumbre propagada como supuesta')

  console.log('--- Teclado real')
  await ir('#/simulador-quimica/colorimetria', 'preuniversitario')
  await q(`__q.campo('Muestra: absorbancia')?.focus(); document.querySelector('input[name=q-col-pred-zona]').click(); document.querySelector('input[name=q-col-pred-efecto]').click(); await __q.esperar(150)`)
  await q(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Calcular').focus()`)
  ok(/Calcular/.test(await activo()), 'el botón se enfoca')
  await enter()
  ok((await val('Concentración')) === '4,99 mg/L', 'Intro sobre «Calcular» calcula')
  ok(!(await q(`return !!document.querySelector('[data-comparacion]')`)), 'preuniversitario: sin «Comparar dos casos»')

  console.log('--- Práctica de calibración → simular → volver al mismo intento')
  await ir('#/simulador-quimica/practicas-calibracion', 'quimico')
  const enun = () => q(`return (document.querySelector('.quimica-practicas').innerText.split(String.fromCharCode(10)).find(l=>l.startsWith('Se midió')) ?? '')`)
  const enunciado1 = await enun()
  ok(/seis patrones/.test(enunciado1), 'abre la práctica «Calibración e incertidumbre»')
  await q(`const i=[...document.querySelectorAll('.quimica-practicas input')].filter(e=>e.offsetParent && e.type!=='radio' && e.type!=='checkbox')[0]; i.focus(); __q.escribir(i,'5'); await __q.esperar(150); [...document.querySelectorAll('.quimica-practicas button')].filter(b=>b.offsetParent).find(b=>b.textContent.trim()==='Comprobar').click(); await __q.esperar(500)`)
  await q(`const r=[...document.querySelectorAll('.quimica-practicas summary')].filter(b=>b.offsetParent).find(b=>/Resolución paso a paso/.test(b.textContent)); if(r) r.click(); await __q.esperar(400)`)
  const respuestaPractica = await q(`const m=[...document.querySelector('.quimica-practicas').innerText.matchAll(/= ([0-9]+,[0-9]+) mg\\/L/g)].map(x=>x[1]); return m[m.length-1] ?? ''`)
  console.log('   x₀ de la práctica (resolución):', respuestaPractica)
  await clic('Simular este ejercicio')
  await ESPERA(1000)
  await app.ev(JS_AYUDAS)
  ok(/simulador-quimica\/colorimetria/.test(await q(`return location.hash`)), '«Simular este ejercicio» abre la colorimetría')
  ok(/Datos copiados del ejercicio/.test(await q(`return __q.texto('.q-guia')`)), 'avisa «Datos copiados del ejercicio»')
  ok((await valorCampo('Patrón 6: concentración')) === '10', 'copia los seis patrones de la tabla del ejercicio')
  const dePractica = (await val('Concentración')) ?? ''
  ok(dePractica === `${respuestaPractica} mg/L`, `la escena da la misma concentración que la resolución de la práctica (${dePractica} = ${respuestaPractica})`)
  ok(!(await q(`return !!document.querySelector('[data-prediccion]')`)), 'con datos del ejercicio no vuelve a pedir la predicción')
  ok(await q(`return !!__q.botonCon('Volver a la práctica')`), 'hay «Volver a la práctica»')
  await clic('Volver a la práctica')
  await ESPERA(1200)
  await app.ev(JS_AYUDAS)
  const vuelta = await q(`const p=document.querySelector('.quimica-practicas'); return {hash:location.hash, resp:[...p.querySelectorAll('input')].filter(e=>e.offsetParent && e.type!=='radio' && e.type!=='checkbox').map(e=>e.value), texto:p.innerText}`)
  ok(/practicas/.test(vuelta.hash) && (await enun()) === enunciado1, 'vuelve al mismo intento (mismo enunciado)')
  ok(vuelta.resp.includes('5'), `conserva la respuesta escrita (${JSON.stringify(vuelta.resp)})`)
  ok(/Pista/.test(vuelta.texto), 'conserva las pistas')

  console.log('--- Matriz visual: 3 vistas × 2 tamaños × Día/Noche con sonda de contraste y desbordes')
  const matriz = [
    [1360, 860, 'dia', 'light'],
    [1360, 860, 'noche', 'dark'],
    [1024, 680, 'dia', 'light'],
    [1024, 680, 'noche', 'dark']
  ]
  const vistas = [
    ['inicial', 'universitario', ``],
    ['resultado', 'cientifico', `[...document.querySelectorAll('label.q-opcion')].find(l=>l.textContent.includes('sin predecir')).querySelector('input').click(); await __q.esperar(150); __q.boton('Calcular').click(); await __q.esperar(500)`],
    ['fuera-de-curva', 'quimico', `__q.escribir(__q.campo('Muestra: absorbancia'),'0.55'); await __q.esperar(150); [...document.querySelectorAll('label.q-opcion')].find(l=>l.textContent.includes('sin predecir')).querySelector('input').click(); await __q.esperar(150); __q.boton('Calcular').click(); await __q.esperar(500)`]
  ]
  await q(`sessionStorage.removeItem('quimica.transferencia-activa')`)
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    for (const [vista, nivel, pasos] of vistas) {
      await ir('#/simulador-quimica/colorimetria', nivel)
      if (pasos) await app.ev(pasos)
      await app.ev(`document.documentElement.dataset.theme='${tm}'; await new Promise(r=>setTimeout(r,250)); return 1`)
      const r = await app.ev(SONDA)
      const etq = `colorimetria-${vista}-${nivel}-${ancho}x${alto}-${nombre}`
      ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.recortados.length === 0 && r.selFuera.length === 0, `${etq} [${dim[2]}×${dim[3]}] textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde} fuera=${JSON.stringify(r.fuera)} recortados=${JSON.stringify(r.recortados)} selFuera=${JSON.stringify(r.selFuera)}`)
      if (vista !== 'inicial' && ((nombre === 'dia' && ancho === 1360) || (nombre === 'noche' && ancho === 1024))) await app.captura(`${CAPS}/d4a-${etq}.png`)
    }
  }
  console.log('consola:', app.consola.slice(0, 5))
  ok(app.consola.length === 0, 'consola sin errores')
} catch (e) {
  console.log('ERROR de guion:', e.message)
  fallos.push(`guion: ${e.message}`)
  try { await app.captura(`${CAPS}/d4a-error.png`) } catch {}
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
