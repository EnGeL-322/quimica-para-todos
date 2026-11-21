import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'
import { abrirApp, ESPERA, JS_AYUDAS } from './cdp.mjs'
import { SONDA } from './sonda.mjs'

const PERFIL = resolve(tmpdir(), 'reng-verificacion-d3c')
const CAPS = fileURLToPath(new URL('../../docs/capturas-entrega-d', import.meta.url))
mkdirSync(CAPS, { recursive: true })
const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}
const app = await abrirApp(PERFIL)
const matriz = [
  [1360, 860, 'dia', 'light'],
  [1360, 860, 'noche', 'dark'],
  [1024, 680, 'dia', 'light'],
  [1024, 680, 'noche', 'dark']
]
const vistas = [
  ['paso1', 'universitario', ``],
  ['paso4-prediccion', 'quimico', `__q.boton('Siguiente: medir la alícuota').click(); await __q.esperar(200); __q.botonCon('Siguiente: transferir').click(); await __q.esperar(200); __q.botonCon('Transferir la alícuota').click(); await __q.esperar(200); __q.botonCon('Siguiente: completar').click(); await __q.esperar(300)`],
  ['resultado', 'cientifico', `__q.boton('Siguiente: medir la alícuota').click(); await __q.esperar(200); __q.botonCon('Siguiente: transferir').click(); await __q.esperar(200); __q.botonCon('Transferir la alícuota').click(); await __q.esperar(200); __q.botonCon('Siguiente: completar').click(); await __q.esperar(300); __q.botonCon('Ver el resultado sin predecir').click(); await __q.esperar(400)`]
]
try {
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    for (const [vista, nivel, pasos] of vistas) {
      await app.ev(`localStorage.setItem('ciencia.nivel.simulador-quimica','${nivel}'); location.hash='#/simulador-quimica/dilucion'; location.reload()`)
      await ESPERA(2200)
      await app.ev(JS_AYUDAS)
      if (pasos) await app.ev(pasos)
      await app.ev(`document.documentElement.dataset.theme='${tm}'; await new Promise(r=>setTimeout(r,250)); return 1`)
      const r = await app.ev(SONDA)
      const etq = `dilucion-${vista}-${nivel}-${ancho}x${alto}-${nombre}`
      ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.recortados.length === 0 && r.selFuera.length === 0, `${etq} [${dim[2]}×${dim[3]}] textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde} fuera=${JSON.stringify(r.fuera)} recortados=${JSON.stringify(r.recortados)} selFuera=${JSON.stringify(r.selFuera)}`)
      if (vista !== 'paso1' && ((nombre === 'dia' && ancho === 1360) || (nombre === 'noche' && ancho === 1024))) await app.captura(`${CAPS}/d3-${etq}.png`)
    }
  }
  ok(app.consola.length === 0, `consola sin errores ${JSON.stringify(app.consola.slice(0, 3))}`)
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
