import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { abrirApp, ESPERA, JS_AYUDAS } from './cdp.mjs'

const PERFIL = resolve(tmpdir(), 'reng-verificacion-d2')
const CAPS = fileURLToPath(new URL('../../docs/capturas-entrega-d', import.meta.url))
const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}
const app = await abrirApp(PERFIL)
const ir = async (hash, nivel = 'universitario') => {
  await app.ev(`localStorage.setItem('ciencia.nivel.simulador-quimica','${nivel}'); location.hash='${hash}'; location.reload()`)
  await ESPERA(2200)
  await app.ev(JS_AYUDAS)
}
const dialogo = () => app.ev(`return __q.texto('.cuaderno-guardar')`)
const guardar = async (esperado) => {
  await app.ev(`__q.boton('Guardar en cuaderno').click(); await __q.esperar(800)`)
  const d = await dialogo()
  await app.ev(`[...document.querySelectorAll('.cuaderno-guardar button')].find(b=>b.textContent.trim()==='Guardar').click(); await __q.esperar(1200)`)
  const t = await dialogo()
  ok(/guardada en/.test(t), `${esperado}: guardada (${t.slice(0, 90)})`)
  return d
}
const abrirCorrida = async (texto) => {
  await app.ev(`location.hash='#/laboratorio/cuaderno'`)
  await ESPERA(1500)
  await app.ev(JS_AYUDAS)
  await app.ev(`const el=[...document.querySelectorAll('button, li, [role=button], a')].filter(e=>e.offsetParent).reverse().find(e=>e.textContent.includes(${JSON.stringify(texto)}) && e.querySelectorAll('button').length===0 || e.textContent.includes(${JSON.stringify(texto)}) && e.tagName==='BUTTON'); el.click(); await __q.esperar(600)`)
  return app.ev(`return __q.texto('article.cuaderno-detalle')`)
}
try {
  await app.ventana(1360, 860)

  console.log('--- Cinética: guardar en pausa')
  await ir('#/simulador-quimica/cinetica')
  await app.ev(`__q.boton('Iniciar').click(); await __q.esperar(700); __q.boton('Pausar').click(); await __q.esperar(200)`)
  const tGuardado = await app.ev(`return __q.texto('.q-tiempo label span')`)
  const d1 = await guardar('cinética')
  ok(/Proyecto|Nombre de la corrida/.test(d1) || d1.length > 0, 'diálogo de guardado abre')
  let det = await abrirCorrida('Velocidad de reacción: orden 1')
  console.log('   detalle:', det.slice(0, 500))
  ok(/Resultado calculado/.test(det) && /v1|versión 1/i.test(det + ''), 'el detalle muestra estado y versión')
  ok(/121 filas/.test(det), 'serie de 121 filas')
  ok(/orden|A0|k/.test(det), 'entradas visibles')
  await app.captura(`${CAPS}/d2-cuaderno-detalle-1360x860.png`)

  console.log('--- Reabrir y repetir')
  await app.ev(`__q.boton('Reabrir y repetir').click(); await __q.esperar(1800)`)
  await app.ev(JS_AYUDAS)
  const hash = await app.ev(`return location.hash`)
  ok(/simulador-quimica\/cinetica/.test(hash), `vuelve a Velocidad (${hash})`)
  const aviso = await app.ev(`return __q.texto('[data-reabierta]')`)
  ok(/Reabierta desde el cuaderno/.test(aviso) && /en pausa/.test(aviso), `aviso de reapertura en pausa (${aviso.slice(0, 120)})`)
  const tRe = await app.ev(`return __q.texto('.q-tiempo label span')`)
  ok(tRe === tGuardado, `el instante se restaura: ${tGuardado} → ${tRe}`)
  ok(/En pausa/.test(await app.ev(`return __q.texto('.q-tiempo ~ p, .q-tiempo + p')`)), 'queda en pausa (no corre)')
  ok(!!(await app.ev(`return __q.boton('Continuar') ? 1 : 0`)), 'botón «Continuar» (no en marcha)')
  await app.ev(`await __q.esperar(500)`)
  ok(tRe === (await app.ev(`return __q.texto('.q-tiempo label span')`)), 'el reloj no avanzó solo')

  console.log('--- Repetir con otra k y guardar enlazada')
  await app.ev(`__q.escribir(__q.campo('k'), '0.4'); await __q.esperar(300)`)
  await guardar('repetición')
  const d2 = await abrirCorrida('k = 0,4')
  console.log('   detalle repetición:', d2.slice(0, 400))
  ok(/Repetición de: «Velocidad de reacción: orden 1, k = 0,2 1\/s»/.test(d2), 'la repetición muestra «Repetición de» con la corrida original')
  await app.captura(`${CAPS}/d2-cuaderno-repeticion-1360x860.png`)

  console.log('--- Guardar con cambios pendientes (Ácidos y bases)')
  await ir('#/simulador-quimica/acidobase')
  await app.ev(`__q.boton('Calcular').click(); await __q.esperar(300); __q.escribir(__q.campo('Concentración del ácido'),'0.02'); await __q.esperar(200)`)
  await app.ev(`__q.boton('Guardar en cuaderno').click(); await __q.esperar(800)`)
  const adv = await app.ev(`return __q.texto('[data-guardar-pendiente]')`)
  ok(/se guardará el cálculo aplicado/.test(adv) && /0,1 mol\/L/.test(adv) && !/0,02/.test(adv), `avisa qué se guardará: 0,1 mol/L y no 0,02 (${adv.slice(0, 140)})`)
  await app.ev(`[...document.querySelectorAll('.cuaderno-guardar button')].find(b=>b.textContent.trim()==='Guardar').click(); await __q.esperar(1200)`)
  await app.captura(`${CAPS}/d2-guardar-pendiente-1360x860.png`)
  det = await abrirCorrida('Ácidos y bases')
  ok(/0,1/.test(det) && !/0,02/.test(det), 'se guardó el cálculo aplicado (0,1 mol/L), no el borrador de 0,02')
  await app.ev(`__q.boton('Reabrir y repetir').click(); await __q.esperar(1800)`)
  await app.ev(JS_AYUDAS)
  const cc = await app.ev(`return __q.campo('Concentración del ácido').value`)
  ok(cc === '0.1', `Ácidos y bases se reabre con C = 0,1 (${cc})`)
  ok(/pH de la disolución/.test(await app.ev(`return __q.texto('.q-salida')`)), 'y muestra el resultado calculado')

  console.log('--- Corrida fuera del dominio queda fuera del comparador')
  await ir('#/simulador-quimica/acidobase')
  await app.ev(`const c=document.querySelectorAll('details.panel-seccion summary'); [...c].find(s=>s.textContent.includes('Valoración con NaOH')).click(); await __q.esperar(150); __q.escribir(__q.campo('Punto de la curva: NaOH añadido'),'40'); await __q.esperar(100); const sel=[...document.querySelectorAll('select')].filter(e=>e.offsetParent)[0]; Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(sel,'fosforico1'); sel.dispatchEvent(new Event('change',{bubbles:true})); await __q.esperar(100); __q.boton('Calcular').click(); await __q.esperar(400)`)
  const fuera = await app.ev(`return __q.texto('[data-diagnosticos]')`)
  ok(/primera equivalencia/.test(fuera), 'diagnóstico de fosfórico visible')
  await guardar('fosfórico fuera de dominio')
  det = await abrirCorrida('H₃PO₄')
  console.log('   detalle fuera:', det.slice(0, 300))
  ok(/Fuera del dominio del modelo/.test(det) && /No entra en el comparador/.test(det), 'detalle: fuera del dominio y no entra en el comparador')

  console.log('--- Archivo en disco')
  const dir = readdirSync(PERFIL, { recursive: true }).filter((f) => String(f).endsWith('.json'))
  console.log('   archivos:', dir.slice(0, 6))
  console.log('consola:', app.consola.slice(0, 5))
  ok(app.consola.length === 0, 'consola sin errores')
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
