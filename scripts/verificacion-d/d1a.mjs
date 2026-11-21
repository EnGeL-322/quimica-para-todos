import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { abrirApp, ESPERA, JS_AYUDAS } from './cdp.mjs'

import { fileURLToPath } from 'node:url'
const PERFIL = resolve(tmpdir(), 'reng-verificacion-d1a')
const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}

const app = await abrirApp(PERFIL)
try {
  await app.ventana(1360, 860)
  await app.ev(`localStorage.setItem('ciencia.nivel.simulador-quimica','universitario'); location.hash='#/simulador-quimica/acidobase'; location.reload()`)
  await ESPERA(2500)
  await app.ev(JS_AYUDAS)
  await app.ev('await __q.esperar(500); return 1')

  let t = await app.ev(`return __q.texto('.q-barra h2') + ' || ' + __q.texto('.q-salida')`)
  console.log('estado inicial:', t.slice(0, 200))
  ok(/Ácidos y bases/.test(t), 'abre Ácidos y bases')

  await app.ev(`__q.boton('Calcular').click(); await __q.esperar(300)`)
  t = await app.ev(`return __q.texto('.q-salida')`)
  ok(/pH de la disolución/.test(t) && /Resultado calculado/.test(t), 'Calcular muestra el resultado con etiqueta «Resultado calculado»')
  ok(/Datos aplicados: ácido: CH₃COOH/.test(t), 'muestra los datos aplicados')
  const ph0 = await app.ev(`return [...document.querySelectorAll('.sim-res')].filter(e=>e.offsetParent).find(e=>e.textContent.includes('pH de la disolución')).querySelector('b').textContent`)
  console.log('pH inicial', ph0)
  ok(ph0 === '2,881', `pH acético 0,1 mol/L = 2,881 (cuadrática independiente) (${ph0})`)

  await app.ev(`const c=__q.campo('Concentración del ácido'); c.focus(); __q.escribir(c,'0.01'); await __q.esperar(200)`)
  t = await app.ev(`return __q.texto('.q-salida')`)
  ok(/Resultado del cálculo anterior/.test(t), 'tras editar aparece el aviso de resultado anterior')
  ok(await app.ev(`return !!document.querySelector('.q-salida[data-desactualizado]')`), 'q-salida marcada como desactualizada')
  const btn = await app.ev(`return __q.boton('Actualizar') ? 'Actualizar' : 'no'`)
  ok(btn === 'Actualizar', 'el botón dice «Actualizar»')
  await app.ev(`__q.boton('Actualizar').click(); await __q.esperar(300)`)
  t = await app.ev(`return __q.texto('.q-salida')`)
  ok(!/Resultado del cálculo anterior/.test(t) && /0,01 mol\/L/.test(t), 'Actualizar quita el aviso y muestra 0,01 mol/L')

  await app.ev(`const c=__q.campo('Concentración del ácido'); c.focus(); __q.escribir(c,'abc'); await __q.esperar(100)`)
  let inv = await app.ev(`const c=__q.campo('Concentración del ácido'); return [c.value, c.getAttribute('aria-invalid')]`)
  console.log('campo tras texto inválido:', inv)
  await app.ev(`const c=__q.campo('Concentración del ácido'); c.value; __q.escribir(c,''); await __q.esperar(100)`)
  inv = await app.ev(`const c=__q.campo('Concentración del ácido'); return [c.value, c.getAttribute('aria-invalid'), document.activeElement===c]`)
  ok(inv[1] === 'true', `texto vacío marca el campo inválido (${inv})`)
  await app.ev(`const c=__q.campo('Concentración del ácido'); __q.escribir(c,'5'); await __q.esperar(100)`)
  inv = await app.ev(`const c=__q.campo('Concentración del ácido'); return [c.value, c.getAttribute('aria-invalid'), __q.texto('.q-fuera-dominio')]`)
  ok(inv[1] === 'true' && /máximo 1/.test(inv[2]), `5 mol/L está fuera de dominio y se conserva el texto (${JSON.stringify(inv)})`)
  await app.ev(`document.activeElement.blur(); await __q.esperar(100)`)
  inv = await app.ev(`const c=__q.campo('Concentración del ácido'); return [c.value, c.getAttribute('aria-invalid')]`)
  ok(inv[0] === '5' && inv[1] === 'true', `al salir del campo se conserva lo escrito (${inv})`)
  await app.ev(`__q.boton('Actualizar').click(); await __q.esperar(300)`)
  const al = await app.ev(`return [__q.texto('.q-calcular [role=alert]'), document.activeElement === __q.campo('Concentración del ácido')]`)
  ok(/No se calculó: corrige «Concentración del ácido»/.test(al[0]) && al[1] === true, `Actualizar con campo inválido no calcula, explica y enfoca el campo (${JSON.stringify(al)})`)
  t = await app.ev(`return __q.texto('.q-salida')`)
  ok(/0,01 mol\/L/.test(t), 'el resultado anterior sigue visible, marcado')

  await app.ev(`const c=__q.campo('Concentración del ácido'); __q.escribir(c,'0.01'); await __q.esperar(200)`)
  ok(await app.ev(`return !document.querySelector('.q-calcular [role=alert]')`), 'al corregir el campo desaparece el bloqueo')

  const unidades = await app.ev(`return __q.visible('select.q-unidad').length`)
  ok(unidades >= 1, `nivel universitario: hay selector de unidad (${unidades})`)
  await app.ev(`const s=[...document.querySelectorAll('select.q-unidad')].filter(e=>e.offsetParent)[0]; const set=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set; set.call(s,'mmol/L'); s.dispatchEvent(new Event('change',{bubbles:true})); await __q.esperar(200)`)
  const v = await app.ev(`return __q.campo('Concentración del ácido').value`)
  ok(v === '10', `0,01 mol/L se ve como 10 mmol/L (${v})`)
  await app.ev(`__q.escribir(__q.campo('Concentración del ácido'),'20'); await __q.esperar(100); __q.boton('Actualizar').click(); await __q.esperar(300)`)
  t = await app.ev(`return __q.texto('.q-salida [data-datos-aplicados]')`)
  ok(/0,02 mol\/L/.test(t), `20 mmol/L se aplica como 0,02 mol/L (${t.slice(0, 120)})`)

  const comp = await app.ev(`return __q.visible('[data-comparacion]').length`)
  ok(comp === 1, 'universitario: aparece «Comparar dos casos»')
  const sens = await app.ev(`return __q.visible('[data-sensibilidad]').length`)
  ok(sens === 0, 'universitario: aún no hay sensibilidad')

  await app.captura(PERFIL + '-univ.png')

  for (const [nivel, esperado] of [['quimico', true], ['cientifico', true]]) {
    await app.ev(`[...document.querySelectorAll('.q-nivel-global button')].find(b=>b.textContent.trim().toLowerCase().startsWith('${nivel === 'quimico' ? 'quím' : 'cient'}')).click(); await __q.esperar(300)`)
    const d = await app.ev(`return [__q.visible('[data-diagnosticos], .notice').length, __q.visible('[data-sensibilidad]').length, __q.texto('.q-salida').includes('Diagnóstico del modelo')]`)
    console.log(nivel, d)
    if (nivel === 'quimico') ok(d[2] || d[0] > 0, 'químico: diagnóstico del modelo visible')
    if (nivel === 'cientifico') ok(d[1] === 1, 'científico: sensibilidad e incertidumbre visibles')
  }
  t = await app.ev(`return __q.texto('[data-sensibilidad="acidobase"]')`)
  console.log('sensibilidad:', t.slice(0, 400))
  ok(/Concentración del ácido/.test(t) && /±/.test(t), 'tabla de sensibilidad con la concentración del ácido')

  console.log('consola:', app.consola.slice(0, 5))
  ok(app.consola.length === 0, 'consola sin errores')
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
