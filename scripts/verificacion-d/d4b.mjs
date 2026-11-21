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

const PERFIL = resolve(tmpdir(), 'reng-verificacion-d4b')
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
const elegirSal = (id) => q(`const s=[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.trim()==='Sal').querySelector('select'); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,${JSON.stringify(id)}); s.dispatchEvent(new Event('change',{bubbles:true})); await __q.esperar(250)`)
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

  if (!process.env.D4B_SOLO_MATRIZ) {
    console.log('--- Escena, sales ofrecidas y predicción')
    await ir('#/simulador-quimica/solubilidad', 'universitario')
    ok(/Solubilidad: Q frente a Ksp/.test(await q(`return __q.texto('.q-barra h2')`)), 'abre la escena de solubilidad')
    const opciones = await q(`return [...[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.trim()==='Sal').querySelectorAll('option')].map(o=>o.value + '|' + o.textContent)`)
    console.log('   sales:', opciones.join(' || '))
    ok(opciones.length === 3 && opciones.map((o) => o.split('|')[0]).join() === 'caf2,mgoh2,caco3', 'ofrece exactamente las 3 sales con fuente (CaF₂, Mg(OH)₂, CaCO₃)')
    ok(!opciones.some((o) => /CaSO|BaSO|Ag|Pb|Hg|Cd/.test(o)), 'no ofrece CaSO₄ ni sales tóxicas')
    ok(/Harvey/.test(await q(`return __q.texto('.q-escena')`)) && /fuerza iónica cero/.test(await q(`return __q.texto('.q-escena')`)), 'muestra la fuente del Ksp, 25 °C y fuerza iónica cero')
    ok(/Dato publicado/.test(await q(`return __q.texto('.q-escena')`)), 'rotula el Ksp como dato publicado')
    ok(/Ksp = \[Mg²⁺\]/.test(await q(`return __q.texto('[data-ecuacion]')`)), 'muestra la ecuación de Ksp de la sal')
    const botonOff = () => q(`const b=[...document.querySelectorAll('button')].filter(x=>x.offsetParent).find(x=>x.textContent.trim()==='Calcular'); return b ? b.disabled : null`)
    ok((await botonOff()) === true, '«Calcular» desactivado hasta predecir')
    await radio('q-sol-pred-q', 2)
    ok((await botonOff()) === true, 'con una sola predicción sigue desactivado')
    await radio('q-sol-pred-s', 2)
    ok((await botonOff()) === false, 'con las dos predicciones se activa')
    await app.captura(`${CAPS}/d4b-prediccion-1360x860-dia.png`)
    await clic('Calcular')
    ok(/Q > Ksp: precipita/.test(await salida()), 'Mg(OH)₂ con Mg²⁺ 1e-4 y OH⁻ 1e-3: precipita')
    ok((await val('Q = ')) === '1,00e-10', `Q = 1,00e-10 (${await val('Q = ')})`)
    ok((await val('Ksp de Mg(OH)₂')) === '7,1 × 10⁻¹²', `Ksp = 7,1 × 10⁻¹² (${await val('Ksp de Mg(OH)₂')})`)
    ok((await val('En agua pura')) === '1,21e-4 mol/L', `s₀ = 1,21e-4 mol/L (${await val('En agua pura')})`)
    ok(/^8,9\de-5 mol\/L de Mg\(OH\)₂$/.test((await val('Precipita')) ?? ''), `precipita ≈ 8,95e-5 mol/L (${await val('Precipita')})`)
    ok((await val('Con los iones presentes')) === '0 mol/L', 'con Q > Ksp no queda capacidad de disolver más (s = 0)')
    const t = await salida()
    ok(/Q frente a Ksp: dijiste «Q > Ksp: precipita» → correcto/.test(t) && /dijiste «menor» → correcto/.test(t), 'predicciones evaluadas (correctas)')
    ok((await q(`return __q.visible('.grafica-xy svg').length`)) >= 1, 'se dibuja la curva del ion común')
    await app.captura(`${CAPS}/d4b-resultado-1360x860-dia.png`)

    console.log('--- Ion común y estados')
    await elegirSal('caf2')
    await campo('Concentración de Ca²⁺', '0')
    await campo('Concentración de F⁻', '0.01')
    await campo('Sólido presente', '0.001')
    await clic('Actualizar')
    ok(/Q < Ksp/.test(await val('Veredicto') ?? ''), 'CaF₂ con F⁻ 0,01 y sin Ca²⁺: Q = 0 < Ksp')
    ok((await val('Con los iones presentes')) === '3,90e-7 mol/L', `s = 3,90e-7 mol/L (${await val('Con los iones presentes')}) ≈ Ksp/[F⁻]²`)
    ok((await val('En agua pura')) === '2,14e-4 mol/L', `s₀(CaF₂) = 2,14e-4 mol/L (${await val('En agua pura')})`)
    ok((await val('s / s₀')) === '0,183 %', `s/s₀ = 0,183 % (${await val('s / s₀')})`)
    ok(/^3,90e-7 mol\/L de CaF₂$/.test((await val('Se disuelve')) ?? ''), 'se disuelve 3,90e-7 mol/L y queda sólido')
    await nivel('Quím')
    const diag = await q(`return __q.texto('[data-diagnosticos]')`)
    ok(/hidrólisis/.test(diag) && /ninguna fuente consultada lo cuantifica/.test(diag), 'químico: avisa de que no se modela la hidrólisis del anión')
    ok(/Las tres tablas abiertas que consulté dan para CaF₂ Ksp entre 3,45e-11 y 4,00e-11/.test(diag), 'químico: registra la discrepancia entre tablas')
    ok(/Falta Ca²⁺/.test(diag), 'químico: avisa de la especie que falta (Ca²⁺ = 0)')
    await campo('Concentración de F⁻', '0.5')
    await campo('Concentración de Ca²⁺', '0.05')
    await clic('Actualizar')
    ok(/Fuerza iónica estimada/.test(await q(`return __q.texto('[data-diagnosticos]')`)) && /criterio convencional de este proyecto/.test(await q(`return __q.texto('[data-diagnosticos]')`)), 'concentrado: avisa de la fuerza iónica y rotula el umbral como convención')
    await campo('Concentración de F⁻', '2')
    ok((await q(`return __q.campo ? 1 : 1`)) === 1 && /máximo 1/.test(await q(`return __q.texto('.q-fuera-dominio')`)), '2 mol/L: fuera de dominio (máximo 1), se conserva lo escrito')
    await clic('Actualizar')
    ok(/No se calculó: corrige/.test(await q(`return __q.texto('.q-calcular [role=alert]')`)), 'y bloquea el cálculo explicando qué corregir')
    await campo('Concentración de F⁻', '0.01')

    console.log('--- Panel «Modelo y supuestos»: fuentes consultadas')
    await clic('Modelo y supuestos')
    await ESPERA(300)
    const ficha = await q(`return __q.texto('.q-modelo')`)
    ok(/https:\/\/chem\.libretexts\.org\/Bookshelves\/Analytical_Chemistry/.test(ficha), 'la ficha cita el enlace de la fuente')
    ok(/consultada 2026-11-15/.test(ficha) && /No leí la página entera/.test(ficha), 'la ficha dice cuándo se consultó y que solo se leyó un fragmento')
    ok(/25 °C; fuerza iónica: cero/.test(ficha) && /CC BY-NC-SA 4\.0/.test(ficha), 'la ficha da temperatura, fuerza iónica y licencia')
    ok(/Otras tablas abiertas dan valores distintos \(no se usan\)/.test(ficha), 'la ficha registra los valores distintos de otras tablas')
    ok(/CaSO₄ quedó fuera/.test(ficha), 'la ficha explica por qué CaSO₄ no está')
    ok(/Libro, sin consultar|Dato de libro, sin consultar/.test(ficha) && /Criterio convencional de este proyecto/.test(ficha), 'el umbral de fuerza iónica se rotula como convención sin fuente')

    console.log('--- Guardar, reabrir y repetir')
    await ir('#/simulador-quimica/solubilidad', 'universitario')
    await elegirSal('caco3')
    await campo('Concentración de Ca²⁺', '1e-4')
    await campo('Concentración de CO₃²⁻', '1e-4')
    await radio('q-sol-pred-q', 2)
    await radio('q-sol-pred-s', 2)
    await clic('Calcular')
    ok(/^3,29e-5 mol\/L de CaCO₃$/.test((await val('Precipita')) ?? ''), `CaCO₃ 1e-4 + 1e-4: precipita 3,29e-5 mol/L (${await val('Precipita')}) como a mano`)
    ok((await val('En agua pura')) === '6,71e-5 mol/L', 'calcita: s₀ = √Ksp = 6,71e-5 mol/L')
    await guardar('CaCO₃')
    const det = await abrirCorrida('Solubilidad de CaCO₃')
    ok(/Aproximación en el límite del modelo/.test(det) && /41 filas/.test(det) && /Harvey/.test(det), 'detalle: aproximación (hidrólisis), 41 filas y la fuente')
    await q(`[...document.querySelectorAll('button')].find(b=>b.offsetParent&&b.textContent.trim()==='Reabrir y repetir').click(); await __q.esperar(1700)`)
    await app.ev(JS_AYUDAS)
    ok(/simulador-quimica\/solubilidad/.test(await q(`return location.hash`)), 'reabrir vuelve a la escena')
    ok(/Reabierta desde el cuaderno/.test(await q(`return __q.texto('[data-reabierta]')`)), 'aviso de reapertura')
    ok((await valorCampo('Concentración de Ca²⁺')) === '0.0001' && /Q > Ksp: precipita/.test(await salida()), 'restaura la sal, las concentraciones y el resultado')
    ok(!(await q(`return !!document.querySelector('[data-prediccion]')`)), 'no vuelve a pedir la predicción')
    await clic('Guardar en cuaderno')
    ok(/Se enlazará como repetición/.test(await q(`return __q.texto('.cuaderno-guardar')`)), 'guardar de nuevo se enlaza con la original')
    await q(`[...document.querySelectorAll('.cuaderno-guardar button')].find(b=>b.textContent.trim()==='Cancelar').click()`)

    console.log('--- Científico: sensibilidad')
    await ir('#/simulador-quimica/solubilidad', 'cientifico')
    await sinPredecir()
    await clic('Calcular')
    const sens = await q(`return __q.texto('[data-sensibilidad]')`)
    ok(/Concentración del catión en disolución/.test(sens) && /±/.test(sens), 'tabla de sensibilidad con las concentraciones de los iones')
    ok(/no es una incertidumbre medida|no es una incertidumbre/.test(sens), 'rotula la incertidumbre propagada como supuesta')

    console.log('--- Teclado real y nivel preuniversitario')
    await ir('#/simulador-quimica/solubilidad', 'preuniversitario')
    await q(`document.querySelector('input[name=q-sol-pred-q]').click(); document.querySelector('input[name=q-sol-pred-s]').click(); await __q.esperar(150)`)
    await q(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Calcular').focus()`)
    ok(/Calcular/.test(await activo()), 'el botón se enfoca')
    await enter()
    ok(/Q > Ksp: precipita|Q < Ksp|Q = Ksp/.test(await salida()), 'Intro sobre «Calcular» calcula')
    ok(!(await q(`return !!document.querySelector('[data-comparacion]')`)), 'preuniversitario: sin «Comparar dos casos»')


  }

  console.log('--- Matriz visual: 3 vistas × 2 tamaños × Día/Noche con sonda de contraste y desbordes (instancia nueva de la app)')
  consolas.push(...app.consola)
  await app.cerrar()
  app = await abrirApp(resolve(tmpdir(), 'reng-verificacion-d4b-matriz'), 9342)
  const matriz = [
    [1360, 860, 'dia', 'light'],
    [1360, 860, 'noche', 'dark'],
    [1024, 680, 'dia', 'light'],
    [1024, 680, 'noche', 'dark']
  ]
  const clicSin = `[...document.querySelectorAll('label.q-opcion')].find(l=>l.textContent.includes('sin predecir')).querySelector('input').click(); await __q.esperar(150);`
  const vistas = [
    ['inicial', 'universitario', ``],
    ['precipita', 'cientifico', `${clicSin} __q.boton('Calcular').click(); await __q.esperar(500)`],
    ['ion-comun-quimico', 'quimico', `${clicSin} const s=[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.trim()==='Sal').querySelector('select'); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'caf2'); s.dispatchEvent(new Event('change',{bubbles:true})); await __q.esperar(200); const c=(t,v)=>{const i=[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.includes(t)).querySelector('input'); __q.escribir(i,v)}; c('Concentración de Ca²⁺','0'); c('Concentración de F⁻','0.01'); c('Sólido presente','0.001'); await __q.esperar(200); __q.boton('Calcular').click(); await __q.esperar(500)`]
  ]
  await q(`sessionStorage.removeItem('quimica.transferencia-activa')`)
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    console.log(`   ventana pedida ${ancho}×${alto}:`, JSON.stringify(await app.ev('return [innerWidth, innerHeight, outerWidth, outerHeight, document.visibilityState, document.hasFocus()]')))
    for (const [vista, niv, pasos] of vistas) {
      await ir('#/simulador-quimica/solubilidad', niv)
      if (pasos) await app.ev(pasos)
      await app.ev(`document.documentElement.dataset.theme='${tm}'; await new Promise(r=>setTimeout(r,250)); return 1`)
      const r = await app.ev(SONDA)
      const etq = `solubilidad-${vista}-${niv}-${ancho}x${alto}-${nombre}`
      ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.recortados.length === 0 && r.selFuera.length === 0, `${etq} [${dim[2]}×${dim[3]}] textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde} fuera=${JSON.stringify(r.fuera)} recortados=${JSON.stringify(r.recortados)} selFuera=${JSON.stringify(r.selFuera)}`)
      if (vista !== 'inicial' && ((nombre === 'dia' && ancho === 1360) || (nombre === 'noche' && ancho === 1024))) await app.captura(`${CAPS}/d4b-${etq}.png`)
    }
  }
  consolas.push(...app.consola)
  console.log('consola:', consolas.slice(0, 5))
  ok(consolas.length === 0, 'consola sin errores')
} catch (e) {
  console.log('ERROR de guion:', e.message)
  fallos.push(`guion: ${e.message}`)
  try { await app.captura(`${CAPS}/d4b-error.png`) } catch {}
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
