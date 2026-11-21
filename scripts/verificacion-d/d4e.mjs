import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'
import { abrirApp, ESPERA, JS_AYUDAS } from './cdp.mjs'
import { SONDA, SONDA_LIMITE3D } from './sonda.mjs'

const SIN_WEBGL = process.env.D4E_SIN_WEBGL === '1'
const SUF = SIN_WEBGL ? '-sinwebgl' : ''
const PERFIL = resolve(tmpdir(), `reng-verificacion-d4e${SUF}`)
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
const clic = (txt) => q(`const b=__q.botonCon(${JSON.stringify(txt)}); if(!b) throw new Error('sin botón: ' + ${JSON.stringify(txt)}); b.click(); await __q.esperar(350)`)
const ir = async (hash, niv = 'universitario') => {
  await q(`localStorage.setItem('ciencia.nivel.simulador-quimica','${niv}'); location.hash='${hash}'; location.reload()`)
  await ESPERA(2600)
  await app.ev(JS_AYUDAS)
}
const buscar = (texto) => q(`const i=document.querySelector('[data-mesa-libre] input[type=search]'); __q.escribir(i, ${JSON.stringify(texto)}); await __q.esperar(300)`)
const poner = (nombre) => q(`const b=[...document.querySelectorAll('[data-mesa-libre] button')].find(x=>x.getAttribute('aria-label')===${JSON.stringify(`Poner ${nombre} en la mesa`)}); if(!b) throw new Error('no hay botón para poner ${nombre}'); b.click(); await __q.esperar(250)`)
const hayBotonPoner = (nombre) => q(`return !![...document.querySelectorAll('[data-mesa-libre] button')].find(x=>x.getAttribute('aria-label')===${JSON.stringify(`Poner ${nombre} en la mesa`)})`)
const ficha = (nombre) => q(`const b=[...document.querySelectorAll('[data-mesa-libre] button')].find(x=>x.getAttribute('aria-label')===${JSON.stringify(`Ver la ficha de ${nombre}`)}); if(!b) throw new Error('no hay ficha de ${nombre}'); b.click(); await __q.esperar(350)`)
const escribir = (etiqueta, valor) => q(`const i=[...document.querySelectorAll('[data-mesa-libre] .sim-campo')].find(l=>l.querySelector('span')?.textContent.trim()===${JSON.stringify(etiqueta)})?.querySelector('input'); if(!i) throw new Error('sin campo ${etiqueta}'); __q.escribir(i, ${JSON.stringify(valor)}); await __q.esperar(200)`)
const valorCampo = (etiqueta) => q(`return [...document.querySelectorAll('[data-mesa-libre] .sim-campo')].find(l=>l.querySelector('span')?.textContent.trim()===${JSON.stringify(etiqueta)})?.querySelector('input')?.value ?? null`)
const mezclar = () => clic('Mezclar y predecir')
const resultado = () => q(`return __q.texto('.q-ml-resultado')`)
const tipoResultado = () => q(`return document.querySelector('.q-ml-resultado')?.getAttribute('data-resultado') ?? null`)
const items = () => q(`return [...document.querySelectorAll('[data-mesa] > li')].map(l=>l.getAttribute('data-item')).join(',')`)
const celda = (clave) => q(`return __q.texto('[data-resultados] [data-clave="${clave}"] [data-valor]')`)
const enter = async () => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await ESPERA(350)
}
const tab = async (atras = false) => {
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: atras ? 8 : 0 })
  await app.cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: atras ? 8 : 0 })
  await ESPERA(120)
}
const SIN_MODELO = 'No hay datos o modelo para predecir esta mezcla'
const consolaLimpia = () => (SIN_WEBGL ? app.consola.every((c) => /WebGL/.test(c)) : app.consola.length === 0)
const textoConsola = () => (SIN_WEBGL ? `${app.consola.length} mensajes, todos del contexto WebGL de la Mesa molecular (montada oculta en toda ruta de Química); ninguno de la Mesa libre` : `${app.consola.length} mensajes`)

try {
  await app.ventana(1360, 860)

  if (!process.env.D4E_SOLO_MATRIZ) {
    console.log(`--- Mesa libre ${SIN_WEBGL ? 'SIN WebGL' : 'con WebGL'}: entrada desde el menú y el catálogo de simulación`)
    await ir('#/simulador-quimica/simulacion')
    ok((await q(`return __q.visible('.q-tarjeta').length`)) === 11, 'el catálogo de simulación tiene 11 tarjetas')
    ok(/Mesa libre/.test(await q(`return __q.texto('.q-tarjeta[data-tema="mesalibre"]')`)), 'hay una tarjeta «Mesa libre»')
    const menu = await q(`return [...document.querySelectorAll('nav a, nav button')].filter(e=>e.offsetParent).map(e=>e.textContent.trim()).filter(Boolean).join(' | ')`)
    ok(/Isómeros: comparación geométrica \| Mesa libre: combinar sustancias \| Casos reales \| Mesa molecular/.test(menu), 'el menú la lista después de Isómeros y antes de Casos reales y de la Mesa molecular')
    await q(`document.querySelector('.q-tarjeta[data-tema="mesalibre"] button').click(); await __q.esperar(500)`)
    ok(/mesalibre/.test(await q(`return location.hash`)) && /Mesa libre/.test(await q(`return __q.texto('.q-barra h2')`)), 'la tarjeta abre la Mesa libre')

    console.log('--- Sustancias: solo se ofrecen las que se pueden poner; las demás, solo ficha')
    const ids = await q(`return [...document.querySelectorAll('[data-sustancias] > li')].map(l=>l.getAttribute('data-sustancia')).sort().join(',')`)
    ok(ids === 'agua,carbonato-de-calcio,cloruro-de-sodio,glicerina,glucosa,hidrogenocarbonato-de-sodio,oxido-de-magnesio,sulfato-de-magnesio-heptahidratado', `sin buscar solo aparecen las 8 que se pueden poner (${ids})`)
    ok((await q(`return [...document.querySelectorAll('[data-sustancias] > li')].every(l=>l.getAttribute('data-puede')==='si')`)) === true, 'todas con «puede = sí»')
    for (const [consulta, id, etq] of [['cobre', 'cobre', 'cobre'], ['butano', 'butano', 'butano'], ['hierro', 'hierro', 'hierro'], ['carbonato de sodio', 'carbonato-de-sodio', 'carbonato de sodio'], ['fluoruro de calcio', 'fluoruro-de-calcio', 'fluoruro de calcio']]) {
      await buscar(consulta)
      ok((await q(`return document.querySelector('[data-sustancia="${id}"]')?.getAttribute('data-puede') ?? 'ausente'`)) === 'no', `«${consulta}» aparece solo como ficha (data-puede = no)`)
      ok(!(await hayBotonPoner(etq)), `«${consulta}»: no existe el botón «Poner en la mesa»`)
    }
    await buscar('cobre')
    await ficha('cobre')
    const fc = await q(`return __q.texto('[data-ficha="cobre"]')`)
    ok(/Solo ficha de consulta/.test(fc) && /Peligro/.test(fc), `ficha del cobre: «Solo ficha de consulta» y nivel Peligro`)
    ok(/chemicalsafety\.ilo\.org\/dyn\/icsc\/showcard\.display\?p_card_id=0240/.test(fc), 'la ficha cita su fuente (ICSC 0240) con el enlace')
    ok((await items()) === '', 'la mesa sigue vacía tras consultar una peligrosa')
    await app.captura(`${CAPS}/d4e-ficha-cobre-1360x860-dia${SUF}.png`)
    await buscar('hierro')
    await ficha('hierro')
    ok(/ninguna ficha contrastada/.test(await q(`return __q.texto('[data-ficha="hierro"]')`)), 'ficha del hierro: dice que no hay ficha contrastada, sin afirmar que sea inocuo')
    await buscar('')

    console.log('--- Dilución: 25 mL de NaCl 0,2 mol/L + 75 mL de agua')
    await poner('cloruro de sodio')
    await poner('agua')
    ok((await items()) === 'cloruro-de-sodio,agua', 'la mesa tiene NaCl y agua')
    ok((await valorCampo('Concentración de cloruro de sodio')) === '0,2 mol/L', 'la concentración de ejemplo viene escrita con su unidad')
    await escribir('Volumen de cloruro de sodio', '25 mL')
    await escribir('Volumen de agua', '75 mL')
    await mezclar()
    ok((await tipoResultado()) === 'prediccion', 'predice')
    ok((await celda('c2')) === '0,05000 mol/L', `concentración final 0,05000 mol/L (${await celda('c2')})`)
    ok((await celda('n')) === '0,005000 mol', `soluto 0,005000 mol (${await celda('n')})`)
    ok((await celda('Vtotal')) === '100,0 mL', `volumen total 100,0 mL (${await celda('Vtotal')})`)
    ok((await celda('F')) === '4,000', `factor 4,000 (${await celda('F')})`)
    const resp = await q(`return __q.texto('[data-respaldo]')`)
    ok(/Dilución con material de vidrio/.test(resp) && /Cálculo verificado/.test(resp), 'dice la escena (Dilución) y su nivel (Cálculo verificado)')
    ok(/Valor de ejemplo/.test(resp) && /Sin verificar/.test(resp) && /no es un dato publicado/.test(resp), 'dice que la concentración es un valor de ejemplo, sin verificar y no publicado')
    ok(!(await q(`return !!document.querySelector('.cuaderno-guardar') || [...document.querySelectorAll('button')].some(b=>/Guardar en cuaderno/.test(b.textContent))`)), 'la Mesa libre no ofrece guardar en el Cuaderno (no se cambia su esquema)')
    await app.captura(`${CAPS}/d4e-resultado-dilucion-1360x860-dia${SUF}.png`)

    console.log('--- Resultado desactualizado al editar')
    await escribir('Volumen de agua', '25 mL')
    ok((await q(`return !!document.querySelector('.q-ml-resultado[data-desactualizado]')`)) === true && /Resultado de la mesa anterior/.test(await resultado()), 'cambiar un dato marca el resultado como de la mesa anterior')
    await mezclar()
    ok((await celda('c2')) === '0,1000 mol/L', `con 25 mL de agua: 0,1000 mol/L (${await celda('c2')})`)
    ok((await q(`return !document.querySelector('.q-ml-resultado[data-desactualizado]')`)) === true, 'al mezclar de nuevo se actualiza')

    console.log('--- Unidades incompatibles, sin unidad, fuera de dominio')
    await escribir('Volumen de cloruro de sodio', '20 g')
    await mezclar()
    ok((await tipoResultado()) === 'entrada-invalida' && /«20 g» no es un volumen/.test(await resultado()), `«20 g» como volumen se rechaza con explicación`)
    ok(!/mol\/L$/.test(await q(`return __q.texto('[data-resultados]') || ''`)), 'no se muestra ninguna cifra de resultado')
    await escribir('Volumen de cloruro de sodio', '25 mL')
    await escribir('Concentración de cloruro de sodio', '25 mL')
    await mezclar()
    ok(/«25 mL» no es una concentración molar/.test(await resultado()), '«25 mL» como concentración se rechaza')
    await escribir('Concentración de cloruro de sodio', '0,2 mol/L')
    await escribir('Volumen de agua', '75')
    await mezclar()
    ok(/no tiene unidad/.test(await resultado()), 'un valor sin unidad se rechaza y pide la unidad')
    await escribir('Volumen de agua', '0,5 mL')
    await mezclar()
    ok(/volumen de agua debe estar entre 1 y 5000 mL/.test(await resultado()), 'fuera del dominio de la escena: dice el rango')
    await escribir('Volumen de agua', '75000 µL')
    await mezclar()
    ok((await celda('c2')) === '0,05000 mol/L', 'con unidades equivalentes (75000 µL) da lo mismo')

    console.log('--- Repetida')
    await buscar('cloruro de sodio')
    await poner('cloruro de sodio')
    ok(/ya está en la mesa/.test(await q(`return __q.texto('[data-mesa-libre] [role=alert]')`)), 'poner NaCl otra vez: avisa que ya está en la mesa')
    ok((await items()) === 'cloruro-de-sodio,agua', 'la mesa no cambia')

    console.log('--- Sin modelo: texto literal y ninguna cifra')
    await buscar('glucosa')
    await poner('glucosa')
    await escribir('Volumen de glucosa', '10 mL')
    await mezclar()
    ok((await tipoResultado()) === 'sin-modelo', 'dos solutos: sin modelo')
    ok((await q(`return __q.texto('[data-sin-modelo]')`)) === SIN_MODELO, `el texto es literalmente «${SIN_MODELO}»`)
    ok(!/\d/.test(await q(`return __q.texto('.q-ml-resultado')`)) && (await q(`return !document.querySelector('.q-ml-resultado [data-resultados]')`)), 'sin ninguna cifra ni tabla de resultados')
    await app.captura(`${CAPS}/d4e-sin-modelo-1360x860-dia${SUF}.png`)
    await clic('Vaciar la mesa')
    await buscar('')
    await buscar('magnesio')
    await poner('óxido de magnesio')
    await buscar('')
    await poner('agua')
    await escribir('Volumen de agua', '100 mL')
    await mezclar()
    ok((await q(`return __q.texto('[data-sin-modelo]')`)) === SIN_MODELO && /óxido de magnesio/.test(await q(`return __q.texto('[data-por-que]')`)), 'una sustancia sin escena (óxido de magnesio) + agua: sin modelo, y dice cuál no tiene escena')

    console.log('--- Solubilidad: 0,10 g de CaCO₃ en 1000 mL de agua')
    await clic('Vaciar la mesa')
    await poner('carbonato de calcio')
    await poner('agua')
    await escribir('Cantidad de carbonato de calcio (masa o moles)', '0,10 g')
    await escribir('Volumen de agua', '1000 mL')
    await mezclar()
    ok((await tipoResultado()) === 'prediccion', 'predice')
    ok((await celda('s0')) === '6,708·10⁻⁵ mol/L', `s₀ = 6,708·10⁻⁵ mol/L = √(4,5·10⁻⁹) (${await celda('s0')})`)
    ok((await celda('masaDisuelta')) === '6,714 mg', `masa disuelta 6,714 mg (${await celda('masaDisuelta')})`)
    const r2 = await resultado()
    ok(/disolución saturada/.test(r2), 'dice que queda saturada con sólido')
    const resp2 = await q(`return __q.texto('[data-respaldo]')`)
    ok(/Solubilidad: Q frente a Ksp/.test(resp2) && /Cálculo verificado/.test(resp2), 'dice la escena (Solubilidad) y su nivel')
    ok(/Fuente consultada/.test(resp2) && /https:\/\/chem\.libretexts\.org/.test(resp2) && /consultada 2026-11-15/.test(resp2) && /CC BY-NC-SA 4\.0/.test(resp2), 'el Ksp cita su fuente, fecha y licencia')
    ok(/Masa molar/.test(resp2) && /De libro, sin consultar/.test(resp2) && /Sin verificar/.test(resp2), 'la masa molar se declara de libro y sin verificar')
    ok(/hidrólisis/.test(r2) && /factor 2,6/.test(r2), 'avisa de la hidrólisis no modelada y de que las tablas discrepan hasta un factor 2,6')
    await app.captura(`${CAPS}/d4e-resultado-solubilidad-1360x860-dia${SUF}.png`)
    await clic('Abrir la escena')
    ok(/solubilidad/.test(await q(`return location.hash`)) && /Solubilidad: Q frente a Ksp/.test(await q(`return __q.texto('.q-barra h2')`)), '«Abrir la escena» lleva a Solubilidad')

    console.log('--- Teclado real: Tab hasta «Poner en la mesa» e Intro')
    await ir('#/simulador-quimica/mesalibre')
    await q(`document.querySelector('[data-mesa-libre] input[type=search]').focus()`)
    await tab()
    const foco1 = await q(`return document.activeElement.getAttribute('aria-label') ?? document.activeElement.textContent.trim()`)
    ok(/^Poner agua en la mesa$/.test(foco1) || /Poner/.test(foco1), `Tab desde la búsqueda llega a un botón de poner (${foco1})`)
    await enter()
    ok((await items()) !== '', `Intro lo pone en la mesa (${await items()})`)

    ok(consolaLimpia(), `Mesa libre${SIN_WEBGL ? ' (sin WebGL)' : ''}: consola ${SIN_WEBGL ? 'sin más mensajes que el WebGL ya conocido' : 'vacía'} en todo el recorrido (${textoConsola()})`)
    console.log('--- La Mesa molecular sigue donde estaba')
    await ir('#/simulador-quimica/mesa')
    const orden = await q(`const t=[...document.querySelectorAll('nav *')].filter(e=>e.offsetParent&&e.children.length===0).map(e=>e.textContent.trim()); return [t.indexOf('Mesa molecular'), t.indexOf('Casos reales'), t.indexOf('Simulación')]`)
    ok(orden[0] > orden[1] && orden[1] > orden[2], `la Mesa molecular sigue después de Casos reales y de Simulación (${orden.join(',')})`)
  }

  console.log(`--- Aviso de Limite3D en la Mesa molecular ${SIN_WEBGL ? '(sin WebGL)' : '(con WebGL: no debe aparecer)'}`)
  for (const [tm, minimo] of [['light', 4.5], ['dark', 4.5]]) {
    await ir('#/simulador-quimica/mesa')
    await app.ev(`document.documentElement.dataset.theme='${tm}'; await new Promise(r=>setTimeout(r,300)); return 1`)
    const lect = await app.ev(SONDA_LIMITE3D)
    if (SIN_WEBGL) {
      ok(lect.length >= 1 && lect.every((l) => l.contraste >= minimo), `Mesa molecular, tema ${tm}: aviso sin WebGL con contraste ${lect.map((l) => l.contraste).join(', ')} (mínimo ${minimo})`)
      await app.captura(`${CAPS}/d4e-limite3d-mesa-1360x860-${tm === 'light' ? 'dia' : 'noche'}-sinwebgl.png`)
    } else ok(lect.length === 0, `Mesa molecular, tema ${tm}: con WebGL no hay aviso 3D`)
  }

  console.log('--- Matriz visual: 4 vistas de la Mesa libre + Mesa molecular × 2 tamaños × Día/Noche con sonda de contraste y desbordes (instancia nueva)')
  consolas.push(...app.consola)
  await app.cerrar()
  app = await abrirApp(resolve(tmpdir(), `reng-verificacion-d4e-matriz${SUF}`), 9342, SIN_WEBGL ? ARGS_SIN_WEBGL : [])
  const matriz = [
    [1360, 860, 'dia', 'light'],
    [1360, 860, 'noche', 'dark'],
    [1024, 680, 'dia', 'light'],
    [1024, 680, 'noche', 'dark']
  ]
  const poner2 = (n) => `{const b=[...document.querySelectorAll('[data-mesa-libre] button')].find(x=>x.getAttribute('aria-label')==='Poner ${n} en la mesa'); b.click(); await __q.esperar(200)}`
  const buscar2 = (t) => `{const i=document.querySelector('[data-mesa-libre] input[type=search]'); __q.escribir(i, ${JSON.stringify(t)}); await __q.esperar(250)}`
  const campo2 = (e, v) => `{const i=[...document.querySelectorAll('[data-mesa-libre] .sim-campo')].find(l=>l.querySelector('span')?.textContent.trim()===${JSON.stringify(e)}).querySelector('input'); __q.escribir(i, ${JSON.stringify(v)}); await __q.esperar(120)}`
  const mezclar2 = `{[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Mezclar y predecir').click(); await __q.esperar(500)}`
  const vistas = [
    ['inicial', 'universitario', ``],
    ['dilucion', 'universitario', `${poner2('cloruro de sodio')} ${poner2('agua')} ${campo2('Volumen de cloruro de sodio', '25 mL')} ${campo2('Volumen de agua', '75 mL')} ${mezclar2}`],
    ['solubilidad', 'cientifico', `${poner2('carbonato de calcio')} ${poner2('agua')} ${campo2('Cantidad de carbonato de calcio (masa o moles)', '0,10 g')} ${campo2('Volumen de agua', '1000 mL')} ${mezclar2}`],
    ['sin-modelo-y-errores', 'preuniversitario', `${poner2('cloruro de sodio')} ${poner2('glucosa')} ${campo2('Volumen de cloruro de sodio', '20 g')} ${mezclar2}`],
    ['ficha-cobre', 'quimico', `${buscar2('cobre')} {const b=[...document.querySelectorAll('[data-mesa-libre] button')].find(x=>x.getAttribute('aria-label')==='Ver la ficha de cobre'); b.click(); await __q.esperar(400)}`]
  ]
  await q(`sessionStorage.removeItem('quimica.transferencia-activa')`)
  for (const [ancho, alto, nombre, tm] of matriz) {
    const dim = await app.ventana(ancho, alto)
    console.log(`   ventana pedida ${ancho}×${alto}:`, JSON.stringify(await app.ev('return [innerWidth, innerHeight, outerWidth, outerHeight, document.visibilityState, document.hasFocus()]')))
    for (const [vista, niv, pasos] of vistas) {
      await ir('#/simulador-quimica/mesalibre', niv)
      if (pasos) await app.ev(pasos)
      await app.ev(`document.documentElement.dataset.theme='${tm}'; await new Promise(r=>setTimeout(r,300)); return 1`)
      const r = await app.ev(SONDA)
      const etq = `mesalibre-${vista}-${niv}-${ancho}x${alto}-${nombre}${SUF}`
      ok(r.nBajo === 0 && r.desborde <= 0 && r.fuera.length === 0 && r.recortados.length === 0 && r.selFuera.length === 0, `${etq} [${dim[2]}×${dim[3]}] textos=${r.textos} contraste<umbral=${r.nBajo}${r.nBajo ? ' ' + JSON.stringify(r.bajoContraste) : ''} desborde=${r.desborde}px fuera=${r.fuera.length}${r.fuera.length ? ' ' + JSON.stringify(r.fuera) : ''} recortados=${r.recortados.length}${r.recortados.length ? ' ' + JSON.stringify(r.recortados) : ''} selFuera=${r.selFuera.length}`)
      if ((nombre === 'dia' && ancho === 1360) || (nombre === 'noche' && ancho === 1024)) await app.captura(`${CAPS}/d4e-${etq}.png`)
    }
    if (ancho === 1360 && nombre === 'dia') ok(consolaLimpia(), `Mesa libre${SIN_WEBGL ? ' (sin WebGL)' : ''}: consola ${SIN_WEBGL ? 'sin más mensajes que el WebGL ya conocido' : 'vacía'} en las cinco vistas (${textoConsola()})`)
    await ir('#/simulador-quimica/mesa')
    await app.ev(`document.documentElement.dataset.theme='${tm}'; await new Promise(r=>setTimeout(r,300)); return 1`)
    const lect = await app.ev(SONDA_LIMITE3D)
    const etqMesa = `mesa-molecular-${ancho}x${alto}-${nombre}${SUF}`
    if (SIN_WEBGL) ok(lect.length >= 1 && lect.every((l) => l.contraste >= 4.5), `${etqMesa}: aviso sin WebGL con contraste ${lect.map((l) => l.contraste).join(', ')}`)
    else ok(lect.length === 0, `${etqMesa}: sin aviso 3D con WebGL`)
    if (nombre === 'dia' && ancho === 1024) await app.captura(`${CAPS}/d4e-${etqMesa}.png`)
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
  try {
    await app.captura(`${CAPS}/d4e-error${SUF}.png`)
  } catch {}
} finally {
  await app.cerrar()
}
console.log(fallos.length ? `\n${fallos.length} FALLOS:\n- ${fallos.join('\n- ')}` : '\nTodo en orden')
