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

const SIN_WEBGL = process.env.D4D_SIN_WEBGL === '1'
const PERFIL = resolve(tmpdir(), SIN_WEBGL ? 'reng-verificacion-d4d-sinwebgl' : 'reng-verificacion-d4d')
const CAPS = fileURLToPath(new URL('../../docs/capturas-entrega-d', import.meta.url))
mkdirSync(CAPS, { recursive: true })
const fallos = []
const ok = (c, m) => {
  console.log(`${c ? 'OK ' : 'FALLO'} ${m}`)
  if (!c) fallos.push(m)
}
const ARGS_SIN_WEBGL = ['--disable-gpu', '--disable-software-rasterizer', '--disable-webgl']
let app = await abrirApp(PERFIL, 9341, SIN_WEBGL ? ARGS_SIN_WEBGL : [])
const consolas = []
const q = (js) => app.ev(`${js}`)
const clic = (txt) => q(`const b=__q.botonCon(${JSON.stringify(txt)}); if(!b) throw new Error('sin botón: ' + ${JSON.stringify(txt)}); b.click(); await __q.esperar(450)`)
const salida = () => q(`return __q.texto('.q-salida')`)
const radio = (nombre, indice) => q(`const r=[...document.querySelectorAll('input[name=${JSON.stringify(nombre)}]')].filter(e=>e.offsetParent); r[${indice}].click(); await __q.esperar(150)`)
const sinPredecir = () => q(`[...document.querySelectorAll('label.q-opcion')].find(l=>l.textContent.includes('sin predecir')).querySelector('input').click(); await __q.esperar(150)`)
const nivel = (txt) => q(`[...document.querySelectorAll('.q-nivel-global button')].find(b=>b.textContent.trim().startsWith(${JSON.stringify(txt)})).click(); await __q.esperar(300)`)
const pareja = (id) => q(`const s=[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.trim()==='Pareja de isómeros').querySelector('select'); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s, ${JSON.stringify(id)}); s.dispatchEvent(new Event('change', { bubbles: true })); await __q.esperar(700)`)
const ir = async (hash, niv) => {
  await q(`localStorage.setItem('ciencia.nivel.simulador-quimica','${niv}'); location.hash='${hash}'; location.reload()`)
  await ESPERA(2600)
  await app.ev(JS_AYUDAS)
}
const lista = (lado) => `.q-iso-visor[data-lado="${lado}"]`
const atomo = (lado, etq) => q(`const li=[...document.querySelectorAll('${lista(lado)} li.visor-atomo')].find(e=>new RegExp('^'+${JSON.stringify(etq)}+'(\\\\s|$)').test(e.textContent.trim())); if(!li) throw new Error('sin átomo ${lado} ${etq}'); li.click(); await __q.esperar(250)`)
const quitar = (lado) => q(`const b=[...document.querySelectorAll('${lista(lado)} button')].find(e=>e.textContent.trim()==='Quitar selección'); if (b) b.click(); await __q.esperar(250)`)
const seleccion = (lado) => q(`return __q.texto('${lista(lado)} [data-seleccion]')`)
const tabla = (medida, col) => q(`return __q.texto('[data-medida="${medida}"] [data-valor="${col}"]')`)
const diag = () => q(`return __q.texto('[data-diagnosticos]')`)
const botonCalcularDeshabilitado = () => q(`const b=[...document.querySelectorAll('button')].filter(x=>x.offsetParent).find(x=>x.textContent.trim()==='Calcular'); return b ? b.disabled : null`)
const tecla = async (key, code, vk) => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: vk })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk })
  await ESPERA(200)
}
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

  if (!process.env.D4D_SOLO_MATRIZ) {
    console.log(SIN_WEBGL ? '--- SIN WebGL: la escena degrada y sigue midiendo' : '--- Escena, catálogo, procedencia y predicción')
    await ir('#/simulador-quimica/isomeros', 'universitario')
    ok(/Isómeros: comparación geométrica/.test(await q(`return __q.texto('.q-barra h2')`)), 'abre la escena de isómeros')
    const opciones = await q(`return [...[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.trim()==='Pareja de isómeros').querySelectorAll('option')].map(o=>o.value+'|'+o.textContent.trim())`)
    console.log('   catálogo:', opciones.join(' || '))
    ok(opciones.map((o) => o.split('|')[0]).join() === 'buteno,etanol-eter,butano,propanol', 'ofrece exactamente los 4 pares del catálogo')
    ok(!opciones.some((o) => /Cloro|cloro|Hg|Pb|Ag|Cd|nitro|cianuro|ácido/i.test(o)), 'sin sustancias peligrosas ni halogenadas')
    ok((await q(`return __q.visible('.q-iso-visor').length`)) === 2, 'se muestran los dos isómeros lado a lado')
    ok((await q(`return __q.visible('.q-iso-visor .q-estructura img').length`)) === 2, 'cada isómero tiene su estructura 2D')
    ok((await q(`return __q.visible('.q-iso-visor li.visor-atomo').length`)) === 24, 'cada isómero lista sus 12 átomos (C4H8)')
    const proc = await q(`return __q.texto('[data-procedencia]')`)
    ok(/Geometría calculada \(MMFF94s\)\. No es una medida\./.test(proc) && (proc.match(/Geometría calculada/g) ?? []).length === 2, 'la procedencia de cada geometría está visible: calculada, MMFF94s, no es una medida')
    ok((await seleccion('A')) === '1·C1 → 2·C2 → 3·C3 → 4·C4' && (await seleccion('B')) === '1·C1 → 2·C2 → 3·C3 → 4·C4', 'selección inicial: los cuatro carbonos en cada isómero')
    if (SIN_WEBGL) {
      ok((await q(`return __q.visible('.limite-3d').length`)) === 2, 'sin WebGL: aparece el aviso de la vista 3D no disponible en los dos visores')
      ok(/La vista 3D no está disponible en este equipo/.test(await q(`return __q.texto('.limite-3d')`)) && /El resto de la herramienta sigue funcionando/.test(await q(`return __q.texto('.limite-3d')`)), 'el aviso es el de la Mesa (Limite3D) y dice que el resto sigue funcionando')
      ok((await q(`return __q.visible('.q-iso-visor li.visor-atomo').length`)) === 24, 'sin WebGL la lista de átomos sigue disponible')
    } else {
      ok((await q(`return __q.visible('.q-iso-visor canvas').length`)) === 2, 'con WebGL: un lienzo 3D por isómero')
      ok((await q(`return __q.visible('.limite-3d').length`)) === 0, 'sin aviso de 3D no disponible')
    }
    ok((await botonCalcularDeshabilitado()) === true, '«Calcular» desactivado hasta predecir')
    ok(/¿Qué isómero tiene la distancia mayor/.test(await q(`return __q.texto('[data-prediccion]')`)), 'pregunta de predicción: qué isómero tiene la distancia mayor')
    ok(!/Distancia entre el primer y el último átomo/.test(await salida()), 'antes de calcular no se muestra ninguna medida')
    await radio('q-iso-pred', 0)
    ok((await botonCalcularDeshabilitado()) === false, 'con una predicción se activa')
    await app.captura(`${CAPS}/d4d-prediccion-1360x860-dia${SIN_WEBGL ? '-sinwebgl' : ''}.png`)
    await clic('Calcular')
    ok(/Resultado calculado/.test(await salida()), 'rotulado como resultado calculado')
    ok((await tabla('distancia', 'a')) === '3,178 Å' && (await tabla('distancia', 'b')) === '3,900 Å', `distancia C1···C4: cis 3,178 Å y trans 3,900 Å como en las pruebas (${await tabla('distancia', 'a')} / ${await tabla('distancia', 'b')})`)
    ok((await tabla('diedro', 'a')) === '0,0 °' && (await tabla('diedro', 'b')) === '180,0 °', `diedro: cis 0,0° y trans 180,0° (${await tabla('diedro', 'a')} / ${await tabla('diedro', 'b')})`)
    ok((await tabla('angulo1', 'a')) === '127,9 °' && (await tabla('angulo1', 'b')) === '124,0 °', `ángulo C1–C2–C3: 127,9° y 124,0° (${await tabla('angulo1', 'a')} / ${await tabla('angulo1', 'b')})`)
    ok((await tabla('diedro', 'dif')) === '180,0 °', `diferencia de diedro con vuelta: 180,0° (${await tabla('diedro', 'dif')})`)
    ok(/Distancia mayor: el isómero B/.test(await q(`return __q.texto('[data-veredicto]')`)), 'dice que la distancia es mayor en el trans (B)')
    ok(/dijiste que la distancia es mayor en el isómero A.*no: es mayor en el isómero B/i.test(await q(`return __q.texto('[data-prediccion-resultado]')`)), 'evalúa la predicción (A) contra el cálculo (B)')
    ok(/Esta escena no compara energías ni dice cuál isómero es más estable/.test(await salida()), 'dice que no compara energías')
    ok(!/Una conformación calculada con el mismo método/.test(await diag()), 'universitario: las notas informativas no estorban')
    await app.captura(`${CAPS}/d4d-resultado-1360x860-dia${SIN_WEBGL ? '-sinwebgl' : ''}.png`)

    console.log('--- Selección con teclado y con ratón')
    await quitar('A')
    ok((await seleccion('A')) === 'ninguno', 'quitar la selección del isómero A')
    ok(/Resultado del cálculo anterior/.test(await salida()), 'cambiar la selección deja el resultado marcado como anterior')
    await q(`document.querySelector('${lista('A')} li.visor-atomo').focus()`)
    await tecla('ArrowRight', 'ArrowRight', 39)
    await tecla('ArrowRight', 'ArrowRight', 39)
    const enfocado = await q(`return document.activeElement.textContent.trim()`)
    ok(/^C3/.test(enfocado), `flechas mueven el foco por la lista (${enfocado})`)
    await tecla('Enter', 'Enter', 13)
    ok((await seleccion('A')) === '1·C3', `Intro elige el átomo enfocado (${await seleccion('A')})`)
    await tecla(' ', 'Space', 32)
    ok((await seleccion('A')) === 'ninguno', 'Espacio lo quita')
    await atomo('A', 'C1')
    await atomo('A', 'C2')
    await atomo('A', 'C3')
    await atomo('A', 'C4')
    await atomo('A', 'H1')
    ok(/Ya hay 4 átomos elegidos/.test(await q(`return __q.texto('${lista('A')} .visor-aviso')`)), 'con 4 elegidos avisa de que no caben más')
    ok((await seleccion('A')) === '1·C1 → 2·C2 → 3·C3 → 4·C4', 'y no añade el quinto')
    await atomo('A', 'C2')
    ok((await seleccion('A')) === '1·C1 → 2·C3 → 3·C4', `quitar uno intermedio conserva el orden de los demás (${await seleccion('A')})`)
    await atomo('A', 'C2')
    ok((await seleccion('A')) === '1·C1 → 2·C3 → 3·C4 → 4·C2', 'volver a añadirlo lo pone al final')
    await quitar('A')
    for (const e of ['C1', 'C2', 'C3', 'C4']) await atomo('A', e)
    ok((await seleccion('A')) === '1·C1 → 2·C2 → 3·C3 → 4·C4', 'selección restaurada')

    if (!SIN_WEBGL) {
      console.log('--- Selección clicando el átomo en el modelo 3D (puntero real)')
      await quitar('B')
      const caja = await q(`const r=document.querySelector('${lista('B')} .q-iso-lienzo canvas').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]`)
      let hallado = null
      for (let fy = 0.15; fy <= 0.9 && !hallado; fy += 0.07) {
        for (let fx = 0.1; fx <= 0.92 && !hallado; fx += 0.04) {
          const x = caja[0] + caja[2] * fx
          const y = caja[1] + caja[3] * fy
          await app.cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
          await ESPERA(30)
          const hud = await q(`return __q.texto('${lista('B')} .visor-hud')`)
          if (/clic para elegirlo/.test(hud)) hallado = { x, y, hud }
        }
      }
      ok(hallado !== null, `el puntero encuentra un átomo en el modelo 3D (${hallado?.hud ?? 'ninguno'})`)
      if (hallado) {
        await app.cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x: hallado.x, y: hallado.y, button: 'left', clickCount: 1 })
        await app.cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x: hallado.x, y: hallado.y, button: 'left', clickCount: 1 })
        await ESPERA(300)
        const eleg = await seleccion('B')
        const etqHud = /^(\S+)/.exec(hallado.hud)?.[1]
        ok(/^1·/.test(eleg) && eleg.includes(etqHud ?? '#'), `el clic en el 3D elige ese átomo (${eleg}; HUD «${hallado.hud}»)`)
        await app.captura(`${CAPS}/d4d-seleccion-3d-1360x860-dia.png`)
      }
      for (const e of ['C1', 'C2', 'C3', 'C4']) await atomo('B', e)
    }

    console.log('--- Otro par, selección desigual e insuficiente')
    await pareja('etanol-eter')
    ok((await seleccion('A')) === '1·C1 → 2·C2 → 3·O1' && (await seleccion('B')) === '1·C1 → 2·O1 → 3·C2', `cambiar de par pone su selección inicial (${await seleccion('A')} / ${await seleccion('B')})`)
    ok(/Isomería de función/.test(await q(`return __q.texto('[data-pista]')`)), 'dice el tipo de isomería')
    await clic('Actualizar')
    ok(!/Dijiste que la distancia/.test(await salida()), 'la predicción hecha para otro par no se evalúa contra el par nuevo')
    ok((await tabla('angulo1', 'a')) === '109,0 °' && (await tabla('angulo1', 'b')) === '111,5 °', `etanol C–C–O 109,0° y éter C–O–C 111,5° (${await tabla('angulo1', 'a')} / ${await tabla('angulo1', 'b')})`)
    ok(/Distancia mayor: ninguno: casi la misma/.test(await q(`return __q.texto('[data-veredicto]')`)), 'las distancias difieren menos de 0,05 Å: «casi la misma»')
    await atomo('A', 'O1')
    await clic('Actualizar')
    ok(/Elegiste 2 átomos en A y 3 en B/.test(await diag()), 'selección desigual: avisa')
    ok((await tabla('distancia', 'dif')) === 'no se compara' && /^[0-9]/.test(await tabla('angulo1', 'b')) && (await tabla('angulo1', 'dif')) === 'no se compara', 'la distancia no se compara, y sin ángulo en A tampoco se resta')
    await quitar('A')
    await atomo('A', 'C1')
    ok(/Elige al menos 2 átomos en cada isómero para poder medir/.test(await q(`return __q.texto('.q-escena')`)), 'con 1 átomo avisa antes de calcular')
    await clic('Actualizar')
    ok(/Elige al menos 2 átomos en cada isómero para medir: faltan átomos en A/.test(await diag()), 'insuficiente: diagnóstico iso-seleccion-insuficiente')
    ok(/No hay nada que medir/.test(await salida()), 'y no inventa medidas')
    await guardar('selección insuficiente')
    const detIns = await abrirCorrida('Isómeros: Etanol y éter dimetílico')
    ok(/Datos insuficientes/i.test(detIns), `estado «datos insuficientes» en el cuaderno (${detIns.slice(0, 120)})`)

    console.log('--- Butano: giros de enlaces simples y átomos sin enlace')
    await ir('#/simulador-quimica/isomeros', 'quimico')
    await pareja('butano')
    await sinPredecir()
    await quitar('A')
    for (const e of ['C1', 'C2', 'C3', 'C4']) await atomo('A', e)
    await quitar('B')
    for (const e of ['C1', 'C2', 'C3', 'C4']) await atomo('B', e)
    await clic('Calcular')
    const dBut = await diag()
    ok(/distancia entre el primer y el último átomo depende de giros de enlaces simples/.test(dBut), 'butano 4 átomos: la distancia depende de la conformación')
    ok(/el enlace central del diedro es simple y puede girar/.test(dBut), 'butano: el diedro depende de la conformación')
    ok(/En B \(2-metilpropano \(isobutano\)\) no están enlazados C3–C4/.test(dBut), 'isobutano: C3–C4 no están enlazados (no es un diedro de enlace)')
    ok(/mismo método \(MMFF94s sobre una conformación inicial de openchemlib \(semilla fija 42\)\)/.test(dBut), 'químico: nota de que las dos geometrías son del mismo método')
    ok(/No distingue al isómero/.test(dBut), 'dice que ese valor no distingue al isómero')
    await app.captura(`${CAPS}/d4d-butano-quimico-1360x860-dia${SIN_WEBGL ? '-sinwebgl' : ''}.png`)
    ok(/Procedencia de cada geometría/.test(await salida()) && /CCCC/.test(await salida()), 'químico: detalle de procedencia con la estructura de cada uno')

    console.log('--- Panel «Modelo y supuestos»')
    await clic('Modelo y supuestos')
    await nivel('Cient')
    await clic('Modelo y supuestos')
    await ESPERA(300)
    const ficha = await q(`return __q.texto('.q-modelo')`)
    ok(/openchemlib 9\.25\.2/.test(ficha) && /BSD-3-Clause/.test(ficha) && /MMFF94s/.test(ficha), 'la ficha cita la biblioteca, su licencia y el método')
    ok(/Ninguna geometría de este catálogo es experimental/.test(ficha), 'la ficha dice que ninguna geometría es experimental')
    ok(/Una sola conformación por isómero/.test(ficha) && /Sin energías/.test(ficha) && /no se validó contra datos experimentales/.test(ficha), 'la ficha declara los límites (una conformación, sin energías, sin validar con datos experimentales)')
    ok(/Modelo calculado/.test(ficha), 'nivel de evidencia: modelo calculado')
    ok(/0,05 Å/.test(ficha) && /no procede de ninguna fuente/.test(ficha), 'el umbral de 0,05 Å está rotulado como convención')
    ok((await q(`return __q.visible('[data-coordenadas]').length`)) === 1, 'científico: coordenadas de los átomos elegidos para repetir a mano')

    console.log('--- Guardar, reabrir y repetir')
    await ir('#/simulador-quimica/isomeros', 'universitario')
    await pareja('etanol-eter')
    await radio('q-iso-pred', 0)
    await clic('Calcular')
    const dA = await tabla('distancia', 'a')
    await guardar('etanol y éter')
    const det = await abrirCorrida('Isómeros: Etanol y éter dimetílico')
    ok(/Sin serie/.test(det) && /0 = C1, 1 = C2, 2 = O1/.test(det) && /MMFF94s/.test(det), 'detalle: sin serie, índices con su etiqueta y el método')
    ok(/Las coordenadas no se guardan/.test(det), 'dice que las coordenadas no se guardan')
    ok(!/\(\d+[,.]\d{3}; /.test(det), 'el cuaderno no contiene coordenadas')
    await q(`[...document.querySelectorAll('button')].find(b=>b.offsetParent&&b.textContent.trim()==='Reabrir y repetir').click(); await __q.esperar(2200)`)
    await app.ev(JS_AYUDAS)
    ok(/simulador-quimica\/isomeros/.test(await q(`return location.hash`)), 'reabrir vuelve a la escena')
    ok(/Reabierta desde el cuaderno/.test(await q(`return __q.texto('[data-reabierta]')`)), 'aviso de reapertura')
    ok((await tabla('distancia', 'a')) === dA && (await seleccion('A')) === '1·C1 → 2·C2 → 3·O1', `restaura la pareja, los átomos y el resultado (${await seleccion('A')}; ${await tabla('distancia', 'a')})`)
    ok(!(await q(`return !!document.querySelector('[data-prediccion]')`)), 'no vuelve a pedir la predicción')
    await clic('Guardar en cuaderno')
    ok(/Se enlazará como repetición/.test(await q(`return __q.texto('.cuaderno-guardar')`)), 'guardar de nuevo se enlaza con la original')
    await q(`[...document.querySelectorAll('.cuaderno-guardar button')].find(b=>b.textContent.trim()==='Cancelar').click()`)

    console.log('--- Preuniversitario y Mesa molecular intacta')
    await ir('#/simulador-quimica/isomeros', 'preuniversitario')
    ok(!(await q(`return !!document.querySelector('[data-formulas]')`)), 'preuniversitario: sin fórmulas de medida')
    await radio('q-iso-pred', 1)
    await clic('Calcular')
    ok((await tabla('distancia', 'a')) === '3,178 Å', 'preuniversitario calcula lo mismo')
    ok(!(await q(`return !!document.querySelector('[data-coordenadas]')`)) && !(await q(`return !!document.querySelector('[data-procedencia-detalle]')`)), 'preuniversitario: sin coordenadas ni detalle de procedencia')
    await ir('#/simulador-quimica/mesa', 'universitario')
    const menu = await q(`return [...document.querySelectorAll('nav a, nav button')].filter(e=>e.offsetParent).map(e=>e.textContent.trim()).filter(Boolean).join(' | ')`)
    console.log('   menú:', menu.slice(0, 400))
    ok(/Electroquímica: celda galvánica \| Isómeros: comparación geométrica \| (Mesa libre: combinar sustancias \| )?Casos reales \| Mesa molecular/.test(menu), 'el menú lista la escena después de Electroquímica y antes de Casos reales y de la Mesa molecular')
    const ordenQuimica = await q(`const t=[...document.querySelectorAll('nav *')].filter(e=>e.offsetParent&&e.children.length===0).map(e=>e.textContent.trim()); return [t.indexOf('Mesa molecular'), t.indexOf('Casos reales'), t.indexOf('Simulación')]`)
    ok(ordenQuimica[0] > ordenQuimica[1] && ordenQuimica[1] > ordenQuimica[2], `la Mesa molecular sigue después de Casos reales y de Simulación (${ordenQuimica.join(',')})`)
  }

  console.log('--- Matriz visual: 3 vistas × 2 tamaños × Día/Noche con sonda de contraste y desbordes (instancia nueva de la app)')
  consolas.push(...app.consola)
  await app.cerrar()
  app = await abrirApp(resolve(tmpdir(), SIN_WEBGL ? 'reng-verificacion-d4d-matriz-sinwebgl' : 'reng-verificacion-d4d-matriz'), 9342, SIN_WEBGL ? ARGS_SIN_WEBGL : [])
  const matriz = [
    [1360, 860, 'dia', 'light'],
    [1360, 860, 'noche', 'dark'],
    [1024, 680, 'dia', 'light'],
    [1024, 680, 'noche', 'dark']
  ]
  const sinP = `[...document.querySelectorAll('label.q-opcion')].find(l=>l.textContent.includes('sin predecir')).querySelector('input').click(); await __q.esperar(150);`
  const selPareja = (id) => `{const s=[...document.querySelectorAll('.sim-campo')].filter(e=>e.offsetParent).find(e=>e.querySelector('span')?.textContent.trim()==='Pareja de isómeros').querySelector('select'); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'${id}'); s.dispatchEvent(new Event('change',{bubbles:true})); await __q.esperar(700)}`
  const vistas = [
    ['inicial', 'universitario', ``],
    ['resultado', 'cientifico', `${sinP} __q.boton('Calcular').click(); await __q.esperar(700)`],
    ['butano-quimico', 'quimico', `${selPareja('butano')} ${sinP} ${[0, 1, 2, 3].map((k) => `{const li=[...document.querySelectorAll('.q-iso-visor[data-lado="A"] li.visor-atomo')][${k}]; if(!/\\(/.test(li.textContent)) li.click(); await __q.esperar(120)}`).join(' ')} {const li=[...document.querySelectorAll('.q-iso-visor[data-lado="B"] li.visor-atomo')][3]; if(!/\\(/.test(li.textContent)) li.click(); await __q.esperar(120)} __q.boton('Calcular').click(); await __q.esperar(700)`]
  ]
  await q(`sessionStorage.removeItem('quimica.transferencia-activa')`)
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    console.log(`   ventana pedida ${ancho}×${alto}:`, JSON.stringify(await app.ev('return [innerWidth, innerHeight, outerWidth, outerHeight, document.visibilityState, document.hasFocus()]')))
    for (const [vista, niv, pasos] of vistas) {
      await ir('#/simulador-quimica/isomeros', niv)
      if (pasos) await app.ev(pasos)
      await app.ev(`document.documentElement.dataset.theme='${tm}'; await new Promise(r=>setTimeout(r,300)); return 1`)
      const r = await app.ev(SONDA)
      const etq = `isomeros-${vista}-${niv}-${ancho}x${alto}-${nombre}${SIN_WEBGL ? '-sinwebgl' : ''}`
      ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.recortados.length === 0 && r.selFuera.length === 0, `${etq} [${dim[2]}×${dim[3]}] textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde}px fuera=${r.fuera.length}${r.fuera.length ? ' ' + JSON.stringify(r.fuera) : ''} recortados=${r.recortados.length}${r.recortados.length ? ' ' + JSON.stringify(r.recortados) : ''} selFuera=${r.selFuera.length}`)
      if ((nombre === 'dia' && ancho === 1360) || (nombre === 'noche' && ancho === 1024)) await app.captura(`${CAPS}/d4d-${etq}.png`)
    }
  }
  consolas.push(...app.consola)
  if (SIN_WEBGL) {
    const otras = consolas.filter((c) => !/webgl|WebGL|context|contexto|boundary|límite|The above error|Error: /i.test(c))
    console.log(`consola sin WebGL: ${consolas.length} mensajes (${consolas.length - otras.length} relacionados con WebGL/Limite3D)`, otras.slice(0, 5))
    ok(otras.length === 0, 'sin WebGL: ningún error de consola que no sea el del contexto 3D (capturado por Limite3D)')
  } else {
    console.log('consola:', consolas.slice(0, 5))
    ok(consolas.length === 0, 'consola sin errores')
  }
} catch (e) {
  console.log('ERROR de guion:', e.message)
  fallos.push(`guion: ${e.message}`)
  try { await app.captura(`${CAPS}/d4d-error${SIN_WEBGL ? '-sinwebgl' : ''}.png`) } catch {}
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
