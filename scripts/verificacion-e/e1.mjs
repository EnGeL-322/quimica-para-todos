import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { abrirApp, ESPERA, JS_AYUDAS } from '../verificacion-d/cdp.mjs'
import { SONDA } from '../verificacion-d/sonda.mjs'

const SIN_WEBGL = process.env.E1_SIN_WEBGL === '1'
const ARGS_SIN_WEBGL = ['--disable-gpu', '--disable-software-rasterizer', '--disable-webgl']
const PERFIL = resolve(tmpdir(), SIN_WEBGL ? 'reng-verificacion-e1-sinwebgl' : 'reng-verificacion-e1')
const PERFIL_REAL = join(process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming'), 'Química para Todos')
const ESCENAS = ['acidobase', 'mezcla', 'cinetica', 'equilibrio', 'termo', 'dilucion', 'colorimetria', 'solubilidad', 'electroquimica', 'isomeros', 'mesalibre']
const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}

function huella(dir) {
  let archivos = 0
  let reciente = 0
  const recorrer = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const ruta = join(d, e.name)
      try {
        if (e.isDirectory()) recorrer(ruta)
        else {
          archivos++
          reciente = Math.max(reciente, statSync(ruta).mtimeMs)
        }
      } catch {
      }
    }
  }
  try {
    recorrer(dir)
  } catch {
    return { archivos: -1, reciente: 0 }
  }
  return { archivos, reciente }
}

const realAntes = huella(PERFIL_REAL)
console.log(`perfil real ANTES: ${realAntes.archivos} archivos, mtime máx ${realAntes.reciente}`)
mkdirSync(PERFIL, { recursive: true })
const app = await abrirApp(PERFIL, 9341, SIN_WEBGL ? ARGS_SIN_WEBGL : [])
ok(!/Química para Todos/.test(PERFIL), `perfil de prueba temporal verificado por RENG_USERDATA antes de escribir: ${PERFIL}`)
const q = (js) => app.ev(js)
const ir = async (hash, nivel) => {
  await q(`localStorage.setItem('ciencia.nivel.simulador-quimica','${nivel}'); location.hash='${hash}'; location.reload()`)
  await ESPERA(2300)
  await app.ev(JS_AYUDAS)
}
const irSinRecargar = async (hash) => {
  await q(`location.hash='${hash}'`)
  await ESPERA(1200)
  await app.ev(JS_AYUDAS)
}
const tema = (t) => q(`document.documentElement.dataset.theme='${t}'; await new Promise(r=>setTimeout(r,250)); return 1`)

const RENG_CALCULAR = {
  dilucion: `__q.boton('Siguiente: medir la alícuota').click(); await __q.esperar(200); __q.botonCon('Siguiente: transferir').click(); await __q.esperar(200); __q.botonCon('Transferir la alícuota').click(); await __q.esperar(200); __q.botonCon('Siguiente: completar').click(); await __q.esperar(200); const b=__q.boton('Ver el resultado'); if(!b || b.disabled) return 'bloqueado'; b.click(); await __q.esperar(500); return 'ok'`,
  cinetica: `const b=__q.boton('Iniciar'); if(!b || b.disabled) return 'bloqueado'; b.click(); await __q.esperar(700); (__q.boton('Pausar')||{click(){}}).click(); await __q.esperar(200); return 'ok'`,
  mesalibre: `return __q.texto('#experimento-panel-mesalibre').length > 40 ? 'ok' : 'vacio'`,
  _generico: `const b=__q.boton('Calcular'); if(!b || b.disabled) return 'bloqueado'; b.click(); await __q.esperar(600); return __q.boton('Actualizar') ? 'ok' : 'no-aplico'`
}

const firma = () => q(`
  const raiz = document.querySelector('#quimica-panel-simulacion')
  const vis = (e) => e.offsetParent !== null
  const etiquetas = [...raiz.querySelectorAll('input,select,textarea')].filter(vis).map((e) => (e.closest('label')?.textContent ?? e.getAttribute('aria-label') ?? e.name ?? '').trim().replace(/\\s+/g, ' ').replace(/[0-9][0-9.,]*/g, '#').slice(0, 60) + '|' + e.tagName + (e.type ?? ''))
  const botones = [...raiz.querySelectorAll('button')].filter(vis).map((e) => e.textContent.trim().replace(/\\s+/g, ' ').slice(0, 50))
  const resumenes = [...raiz.querySelectorAll('summary')].filter(vis).map((e) => e.textContent.trim().replace(/\\s+/g, ' ').slice(0, 60))
  const paneles = [...raiz.querySelectorAll('[data-sensibilidad],[data-diagnosticos],[data-prediccion],[data-prediccion-opcional]')].filter(vis).map((e) => Object.keys(e.dataset).join(','))
  return { etiquetas, botones, resumenes, paneles }
`)

try {
  await app.ventana(1360, 860)

  console.log('=== A. Cada escena se abre desde su destino, sin ejercicio, con el nivel MÁS BAJO, y se calcula sin predecir')
  for (const id of ESCENAS) {
    await ir(`#/simulador-quimica/${id}`, 'preuniversitario')
    const hash = await q('return location.hash')
    ok(hash.endsWith(`/${id}`), `${id}: abre directamente desde su destino (${hash})`)
    const base = await q(`
      const p = document.querySelector('#quimica-panel-simulacion')
      return { selector: !!__q.visible('.q-nivel-global').length, volver: !!__q.botonCon('Volver a la práctica'), texto: p.innerText, transf: sessionStorage.getItem('quimica.transferencia-activa') }
    `)
    ok(!base.selector, `${id}: no muestra el selector de nivel de práctica`)
    ok(!base.volver, `${id}: no ofrece «Volver a la práctica»`)
    ok(!/viene de un ejercicio|Datos copiados del ejercicio|datos de un ejercicio|ejercicio de práctica/i.test(base.texto), `${id}: sin avisos de ejercicio`)
    ok(base.transf === null, `${id}: sin transferencia guardada en la sesión`)
    const r = await q(RENG_CALCULAR[id] ?? RENG_CALCULAR._generico)
    ok(r === 'ok', `${id}: se calcula sin predecir ni resolver nada (${r})`)
    const despues = await q(`return { predic: __q.visible('[data-prediccion]').length, opcional: __q.visible('[data-prediccion-opcional]').length, marcada: [...document.querySelectorAll('[data-prediccion-opcional] input')].some((e) => e.checked) }`)
    if (['colorimetria', 'solubilidad', 'electroquimica', 'isomeros', 'dilucion'].includes(id)) console.log(`   ${id}: predicción tras calcular → bloques ${despues.predic}`)
  }

  console.log('=== B. La predicción es opcional y está apagada por defecto; si se activa, se exige')
  for (const id of ['colorimetria', 'solubilidad', 'electroquimica', 'isomeros']) {
    await ir(`#/simulador-quimica/${id}`, 'preuniversitario')
    const e = await q(`
      const chk = document.querySelector('[data-prediccion-opcional] input')
      const calc = __q.boton('Calcular')
      return { hayToggle: !!chk, activado: chk ? chk.checked : null, camposPred: __q.visible('[data-prediccion]').length, calculaHabilitado: calc ? !calc.disabled : null }
    `)
    ok(e.hayToggle && e.activado === false && e.camposPred === 0 && e.calculaHabilitado === true, `${id}: opción apagada por defecto, sin campos de predicción y «Calcular» habilitado (${JSON.stringify(e)})`)
    await q(`document.querySelector('[data-prediccion-opcional] input').click(); await __q.esperar(250)`)
    const on = await q(`const calc = __q.boton('Calcular'); return { camposPred: __q.visible('[data-prediccion]').length, bloqueado: calc ? calc.disabled : null }`)
    ok(on.camposPred === 1 && on.bloqueado === true, `${id}: al activarla aparece la predicción y «Calcular» la exige (${JSON.stringify(on)})`)
    await q(`document.querySelector('[data-prediccion-opcional] input').click(); await __q.esperar(250)`)
    const off = await q(`const calc = __q.boton('Calcular'); return { camposPred: __q.visible('[data-prediccion]').length, bloqueado: calc ? calc.disabled : null }`)
    ok(off.camposPred === 0 && off.bloqueado === false, `${id}: al desactivarla vuelve a calcularse sin predecir`)
  }
  await ir('#/simulador-quimica/dilucion', 'preuniversitario')
  await q(`__q.boton('Siguiente: medir la alícuota').click(); await __q.esperar(200); __q.botonCon('Siguiente: transferir').click(); await __q.esperar(200); __q.botonCon('Transferir la alícuota').click(); await __q.esperar(200); __q.botonCon('Siguiente: completar').click(); await __q.esperar(250)`)
  const dil = await q(`const b=__q.boton('Ver el resultado'); return { activado: document.querySelector('[data-prediccion-opcional] input')?.checked, campos: __q.visible('[data-prediccion]').length, habilitado: b ? !b.disabled : null }`)
  ok(dil.activado === false && dil.campos === 0 && dil.habilitado === true, `dilucion: predicción apagada por defecto y «Ver el resultado» habilitado (${JSON.stringify(dil)})`)

  console.log('=== C. Independencia del nivel: los controles y paneles de cada escena son los mismos con Preuniversitario y con Científico')
  for (const id of ESCENAS) {
    const sigs = []
    for (const nivel of ['preuniversitario', 'cientifico']) {
      await ir(`#/simulador-quimica/${id}`, nivel)
      await q(RENG_CALCULAR[id] ?? RENG_CALCULAR._generico)
      sigs.push(await firma())
    }
    const a = JSON.stringify(sigs[0])
    const b = JSON.stringify(sigs[1])
    ok(a === b, `${id}: misma firma de controles con ambos niveles (${sigs[0].etiquetas.length} campos, ${sigs[0].botones.length} botones, ${sigs[0].resumenes.length} paneles plegables)`)
    if (a !== b) console.log('   diferencia:', a.slice(0, 300), '≠', b.slice(0, 300))
  }
  await ir('#/simulador-quimica/solubilidad', 'preuniversitario')
  await q(RENG_CALCULAR._generico)
  const rigor = await q(`return { modelo: __q.visible('details.q-modelo').length, sens: __q.visible('[data-sensibilidad]').length, resumenes: __q.texto('#quimica-panel-simulacion summary') }`)
  ok(rigor.modelo >= 1 && rigor.sens >= 1, `con Preuniversitario siguen visibles la ficha del modelo y la sensibilidad (${JSON.stringify({ modelo: rigor.modelo, sens: rigor.sens })})`)
  console.log('   resúmenes:', rigor.resumenes.slice(0, 200))

  console.log('=== D. Ejercicio → «Probarlo en el laboratorio» → volver')
  await ir('#/simulador-quimica/practicas-dilucion', 'preuniversitario')
  await q(`const i=[...document.querySelectorAll('.quimica-practicas input')].filter(e=>e.offsetParent && e.type!=='radio' && e.type!=='checkbox')[0]; i.focus(); __q.escribir(i,'2'); await __q.esperar(200)`)
  await q(`const b=[...document.querySelectorAll('.quimica-practicas button')].filter(x=>x.offsetParent).find(x=>/Comprobar/.test(x.textContent)); if(b) b.click(); await __q.esperar(500)`)
  const antes = await q(`const p=document.querySelector('.quimica-practicas'); return { resp: [...p.querySelectorAll('input')].filter(e=>e.offsetParent && e.type!=='radio' && e.type!=='checkbox').map(e=>e.value), btn: !!__q.botonCon('Probarlo en el laboratorio'), viejo: !!__q.botonCon('Simular este ejercicio') }`)
  if (!antes.btn) await q(`const r=[...document.querySelectorAll('.quimica-practicas summary')].filter(b=>b.offsetParent).find(b=>/Resolución paso a paso/.test(b.textContent)); if(r) r.click(); await __q.esperar(400)`)
  const btn = await q(`return !!__q.botonCon('Probarlo en el laboratorio')`)
  ok(btn && !antes.viejo, 'el ejercicio ofrece «Probarlo en el laboratorio» (y ya no «Simular este ejercicio»)')
  await q(`__q.botonCon('Probarlo en el laboratorio').click(); await __q.esperar(1000)`)
  await app.ev(JS_AYUDAS)
  ok(/simulador-quimica\/dilucion/.test(await q('return location.hash')), 'abre la escena de dilución en su destino')
  const lab = await q(`const p=document.querySelector('#quimica-panel-simulacion'); return { volver: !!__q.botonCon('Volver a la práctica'), texto: p.innerText, sel: __q.visible('.q-nivel-global').length, transf: sessionStorage.getItem('quimica.transferencia-activa'), campos: [...p.querySelectorAll('input')].filter(e=>e.offsetParent&&e.type==='text').map(e=>e.value).join('|') }`)
  ok(!lab.volver && !/viene de un ejercicio|Datos copiados|ejercicio/i.test(lab.texto) && lab.sel === 0, 'la escena no muestra «Volver», ni avisos de ejercicio, ni selector de nivel')
  ok(lab.transf === null, 'nada de la práctica queda guardado en la sesión')
  ok(/2/.test(lab.campos), `los valores del ejercicio llegan como valores iniciales editables (${lab.campos.slice(0, 80)})`)
  await q(`const c=[...document.querySelectorAll('#quimica-panel-simulacion input')].filter(e=>e.offsetParent&&e.type==='text')[0]; c.focus(); __q.escribir(c,'5'); await __q.esperar(200)`)
  const editable = await q(`return [...document.querySelectorAll('#quimica-panel-simulacion input')].filter(e=>e.offsetParent&&e.type==='text')[0].value`)
  ok(editable === '5', 'los parámetros son editables (se cambió el primero a 5)')
  await q(`[...document.querySelectorAll('[role=tab]')].find(t=>/Prácticas por nivel/.test(t.textContent)).click(); await __q.esperar(700)`)
  const lista = await q(`const p=document.querySelector('.quimica-practicas'); return { visible: !!p.offsetParent, curso: /Práctica en curso/.test(p.innerText) && /«2»/.test(p.innerText), continuar: !!__q.botonCon('Continuar práctica') }`)
  ok(lista.visible && lista.curso && lista.continuar,'al volver por el destino «Prácticas por nivel» el intento sigue guardado: «Práctica en curso … «2»» con «Continuar práctica»')
  await q(`__q.botonCon('Continuar práctica').click(); await __q.esperar(700)`)
  const vuelta = await q(`const p=document.querySelector('.quimica-practicas'); return { resp: [...p.querySelectorAll('input')].filter(e=>e.offsetParent && e.type!=='radio' && e.type!=='checkbox').map(e=>e.value), btn: !!__q.botonCon('Probarlo en el laboratorio') }`)
  ok(vuelta.resp.includes('2') && vuelta.btn, `«Continuar práctica» reabre el mismo ejercicio con tu respuesta (${JSON.stringify(vuelta.resp)}) y el botón disponible`)

  console.log('=== E. Corrida guardada: «Reabrir y repetir» funciona, sin nada de ejercicio')
  await ir('#/simulador-quimica/cinetica', 'preuniversitario')
  await q(`__q.boton('Iniciar').click(); await __q.esperar(700); __q.boton('Pausar').click(); await __q.esperar(200)`)
  const tGuardado = await q(`return __q.texto('.q-tiempo label span')`)
  await q(`__q.boton('Guardar en cuaderno').click(); await __q.esperar(800)`)
  await q(`[...document.querySelectorAll('.cuaderno-guardar button')].find(b=>b.textContent.trim()==='Guardar').click(); await __q.esperar(1200)`)
  ok(/guardada en/.test(await q(`return __q.texto('.cuaderno-guardar')`)), 'la corrida se guarda en el cuaderno temporal')
  await q(`location.reload()`)
  await ESPERA(2300)
  await app.ev(JS_AYUDAS)
  await irSinRecargar('#/laboratorio/cuaderno')
  await q(`const el=[...document.querySelectorAll('button, li, [role=button], a')].filter(e=>e.offsetParent).reverse().find(e=>e.textContent.includes('Velocidad de reacción') && e.querySelectorAll('button').length===0); if(el) el.click(); await __q.esperar(800)`)
  const abre = await q(`const b=__q.boton('Reabrir y repetir'); if(!b) return false; b.click(); await __q.esperar(1800); return true`)
  await app.ev(JS_AYUDAS)
  ok(abre && /simulador-quimica\/cinetica/.test(await q('return location.hash')), 'tras recargar la aplicación, «Reabrir y repetir» vuelve a la escena')
  const re = await q(`return { aviso: __q.texto('[data-reabierta]'), t: __q.texto('.q-tiempo label span'), volver: !!__q.botonCon('Volver a la práctica'), texto: document.querySelector('#quimica-panel-simulacion').innerText }`)
  ok(/Reabierta desde el cuaderno/.test(re.aviso) && re.t === tGuardado, `reabre en pausa en el instante guardado (${tGuardado} → ${re.t})`)
  ok(!re.volver && !/viene de un ejercicio|ejercicio de práctica/i.test(re.texto), 'la reapertura no muestra nada de ejercicios')

  console.log('=== F. Matriz visual: Día/Noche × 2 tamaños con sonda de contraste y desbordes (nivel Preuniversitario)')
  const matriz = [[1360, 860, 'dia', 'light'], [1360, 860, 'noche', 'dark'], [1024, 680, 'dia', 'light'], [1024, 680, 'noche', 'dark']]
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    for (const id of ESCENAS) {
      await ir(`#/simulador-quimica/${id}`, 'preuniversitario')
      await q(RENG_CALCULAR[id] ?? RENG_CALCULAR._generico)
      await tema(tm)
      const r = await q(SONDA)
      const etq = `${id}-${ancho}x${alto}-${nombre}`
      ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.recortados.length === 0 && r.selFuera.length === 0, `${etq} [${dim[2]}×${dim[3]}] textos=${r.textos} bajoContraste=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde} fuera=${r.fuera.length} recortados=${r.recortados.length}`)
    }
  }
  const tamanosOk = await q('return [innerWidth, innerHeight]')
  ok(tamanosOk[0] > 200 && tamanosOk[1] > 200, `la ventana no quedó en 0×0 (${tamanosOk})`)
  const ajenas = app.consola.filter((c) => !/WebGL/.test(c))
  console.log(`consola: ${app.consola.length} mensajes, ${app.consola.length - ajenas.length} del contexto WebGL de la Mesa molecular (montada oculta en toda ruta de Química)`, ajenas.slice(0, 6))
  ok(SIN_WEBGL ? ajenas.length === 0 : app.consola.length === 0, SIN_WEBGL ? 'consola: ningún mensaje que no sea el WebGL ya conocido de la Mesa' : 'consola sin errores ni avisos')
} catch (e) {
  console.log('ERROR de guion:', e.message)
  fallos.push(`guion: ${e.message}`)
}
await app.cerrar()
const realDespues = huella(PERFIL_REAL)
ok(realDespues.archivos === realAntes.archivos && realDespues.reciente === realAntes.reciente, `el perfil real no cambió (${realAntes.archivos}→${realDespues.archivos} archivos; mtime ${realAntes.reciente}→${realDespues.reciente})`)
console.log(fallos.length ? `\nFALLOS (${fallos.length}):\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
process.exit(fallos.length ? 1 : 0)
