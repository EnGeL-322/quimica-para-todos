import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { abrirApp, ESPERA, JS_AYUDAS } from './cdp.mjs'

const PERFIL = resolve(tmpdir(), 'reng-verificacion-d1d')
const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}
const app = await abrirApp(PERFIL)
const enter = async () => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
}
const tab = async (shift = false) => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: shift ? 8 : 0 })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: shift ? 8 : 0 })
}
const escribirTeclas = async (texto) => {
  await app.ev(`document.activeElement.select?.()`)
  await app.cmd('Input.insertText', { text: texto })
}
const activo = () => app.ev(`const e=document.activeElement; return e.tagName + ':' + (e.getAttribute('aria-label') || e.closest('label')?.querySelector('span')?.textContent || e.textContent || '').trim().slice(0, 40)`)
try {
  await app.ventana(1024, 680)
  await app.ev(`localStorage.setItem('ciencia.nivel.simulador-quimica','quimico'); location.hash='#/simulador-quimica/termo'; location.reload()`)
  await ESPERA(2200)
  await app.ev(JS_AYUDAS)
  await app.ev(`__q.campo('Temperatura').focus()`)
  console.log('foco inicial:', await activo())
  await escribirTeclas('abc')
  const v = await app.ev(`return [__q.campo('Temperatura').value, __q.campo('Temperatura').getAttribute('aria-invalid')]`)
  console.log('   tras teclear «abc» en un campo numérico:', v)
  await escribirTeclas('350')
  ok((await app.ev(`return __q.campo('Temperatura').value`)) === '350', 'se escribe 350 con el teclado en el campo numérico')
  let pasos = 0
  while (pasos++ < 12 && !/Calcular/.test(await activo())) await tab()
  ok(/BUTTON:Calcular/.test(await activo()), `con Tab se llega al botón «Calcular» (${pasos - 1} pulsaciones)`)
  await enter()
  await ESPERA(400)
  ok(/Calor de reacción/.test(await app.ev(`return __q.texto('.q-salida')`)), 'Intro sobre «Calcular» calcula')
  ok((await app.ev(`return __q.texto('[data-datos-aplicados]')`)).includes('350 K'), 'los datos aplicados muestran 350 K')

  await app.ev(`__q.campo('Temperatura').focus()`)
  await escribirTeclas('999999')
  ok((await app.ev(`return __q.campo('Temperatura').getAttribute('aria-invalid')`)) === 'true', '999999 K marca el campo inválido (máximo 5000)')
  pasos = 0
  while (pasos++ < 12 && !/Actualizar/.test(await activo())) await tab()
  await enter()
  await ESPERA(300)
  ok(/Temperatura/.test(await activo()), `Intro sobre «Actualizar» con campo inválido devuelve el foco al campo (${await activo()})`)
  ok(/No se calculó: corrige «Temperatura»/.test(await app.ev(`return __q.texto('.q-calcular [role=alert]')`)), 'anuncia el error con role=alert')

  await escribirTeclas('400')
  await tab(true)
  await tab()
  pasos = 0
  while (pasos++ < 12 && !/Actualizar/.test(await activo())) await tab()
  await enter()
  await ESPERA(300)
  ok((await app.ev(`return __q.texto('[data-datos-aplicados]')`)).includes('400 K'), 'corregido el valor, Actualizar calcula con 400 K')

  console.log('consola:', app.consola.slice(0, 5))
  ok(app.consola.length === 0, 'consola sin errores')
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
