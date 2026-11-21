import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'
import { abrirApp, ESPERA, JS_AYUDAS } from './cdp.mjs'

const PERFIL = resolve(tmpdir(), 'reng-verificacion-d1c')
const CAPS = fileURLToPath(new URL('../../docs/capturas-entrega-d', import.meta.url))
mkdirSync(CAPS, { recursive: true })
const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}
import { SONDA } from './sonda.mjs'
const app = await abrirApp(PERFIL)
const preparar = async (sub, nivel, pasos) => {
  await app.ev(`localStorage.setItem('ciencia.nivel.simulador-quimica','${nivel}'); location.hash='#/simulador-quimica/${sub}'; location.reload()`)
  await ESPERA(2200)
  await app.ev(JS_AYUDAS)
  if (pasos) await app.ev(pasos)
}
const tema = (t) => app.ev(`document.documentElement.dataset.theme='${t}'; await new Promise(r=>setTimeout(r,250)); return document.documentElement.dataset.theme`)
const matriz = [
  [1360, 860, 'dia', 'light'],
  [1360, 860, 'noche', 'dark'],
  [1024, 680, 'dia', 'light'],
  [1024, 680, 'noche', 'dark']
]
const escenas = [
  ['acidobase', 'cientifico', `__q.boton('Calcular').click(); await __q.esperar(300); __q.escribir(__q.campo('NaOH añadido (punto de la curva)') ?? document.querySelectorAll('input')[0], '0'); return 1`],
  ['mezcla', 'cientifico', `__q.boton('Calcular').click(); await __q.esperar(400); __q.escribir(__q.campo('Volumen de disolución básica añadido'),'30'); await __q.esperar(200); return 1`],
  ['cinetica', 'cientifico', `await __q.esperar(300); return 1`],
  ['equilibrio', 'cientifico', `__q.boton('Calcular').click(); await __q.esperar(300); return 1`],
  ['termo', 'cientifico', `__q.boton('Calcular').click(); await __q.esperar(300); return 1`],
  ['acidobase', 'preuniversitario', `__q.boton('Calcular').click(); await __q.esperar(300); return 1`]
]
try {
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    for (const [sub, nivel, pasos] of escenas) {
      await preparar(sub, nivel, pasos)
      await tema(tm)
      const r = await app.ev(SONDA)
      const etq = `${sub}-${nivel}-${ancho}x${alto}-${nombre}`
      ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.recortados.length === 0 && r.selFuera.length === 0, `${etq} [ventana ${dim[2]}×${dim[3]}] textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde} fuera=${JSON.stringify(r.fuera)} camposRecortados=${JSON.stringify(r.recortados)} selectFueraDeTarjeta=${JSON.stringify(r.selFuera)}`)
      if (['acidobase-cientifico', 'mezcla-cientifico', 'equilibrio-cientifico', 'cinetica-cientifico', 'termo-cientifico'].includes(`${sub}-${nivel}`) && (nombre === 'dia' ? ancho === 1360 : ancho === 1024)) await app.captura(`${CAPS}/d1-${etq}.png`)
    }
  }
  console.log('consola:', app.consola.slice(0, 5))
  ok(app.consola.length === 0, 'consola sin errores')
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
