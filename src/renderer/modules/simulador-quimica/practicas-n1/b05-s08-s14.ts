import { rengTx } from '../aprender/n1/gases/constantes'
import {
  RENG_ANHIDRIDOS_NO, RENG_HIDRACIDOS_NO, RENG_HIDROXIDOS_NO, RENG_HIDRUROS_NM_NO, RENG_HIDRUROS_NO, RENG_OXIDO_A_HIDROXIDO_NO, RENG_OXISALES_NO, RENG_OXOACIDOS_NO, RENG_PEROXIDOS_NO, RENG_SALES_BINARIAS_NO, RENG_TOL_NO_ENT,
  rengAnNo, rengCruzarNo, rengDatoMNo, rengDeNo, rengFHidroxidoNo, rengFHidruroNo, rengFOxidoMetalNo, rengFPeroxidoNo, rengFSalNo, rengMNo, rengOxAcidoNo, rengPracticaNo, rengTxtNo
} from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const M = rengMNo
const A = rengAnNo
const T = rengTxtNo
const tx = rengTx
const O2 = (): number => M('O2')
const H2 = (): number => M('H2')
const OH = (): number => M('OH')
const ox = (rengS: { cat: string; z: number; an: string; za: number }) => rengCruzarNo(rengS.cat, rengS.z, rengS.an, rengS.za)

export const RENG_PRACTICAS_B05_S08: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s8-p1', titulo: 'Oxígeno del agua oxigenada', dificultad: 'basica', unidad: 'g',
    objetivo: 'Calcular el O₂ que libera la descomposición del peróxido de hidrógeno.', seccion: '2.7', para: 'los peróxidos',
    idealizado: 'Descomposición completa: 2 H₂O₂ → 2 H₂O + O₂.', metodo: 'conservación de la masa: peróxido menos agua formada', lista: [0], x: [1, 200, 0.5],
    respuesta: (_e, x) => (x / M('H2O2') / 2) * O2(),
    errores: (_e, x) => [
      ['sin-coef', 'Sin los coeficientes', (x / M('H2O2')) * O2(), 'Dos moléculas de H₂O₂ dan una de O₂: divide los moles entre dos.'],
      ['agua', 'Masa de agua formada', (x / M('H2O2')) * M('H2O'), 'Calculaste la masa de agua que se forma, no la del oxígeno liberado.']
    ],
    enunciado: (_e, x) => `Se descomponen ${tx(x)} g de peróxido de hidrógeno: 2 H₂O₂ → 2 H₂O + O₂.`, pregunta: '¿Qué masa de O₂ se libera, en g?',
    datos: (_e, x) => [['H₂O₂', `${tx(x)} g`], rengDatoMNo('H2O2')],
    pasos: (_e, x, _y, rengR) => [`n(H₂O₂) = ${tx(x / M('H2O2'))} mol.`, `n(O₂) = n/2; m = ${tx(rengR)} g.`],
    pistas: ['Pasa a moles.', 'Dos H₂O₂ dan un O₂.', 'Pasa a gramos.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s8-p2', titulo: 'Oxígeno de un peróxido metálico', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Formular un peróxido metálico sin simplificar el O₂²⁻ y calcular el O₂ que libera con agua.', seccion: '2.7', para: 'los peróxidos',
    idealizado: 'Reacción completa con agua; se libera medio O₂ por fórmula.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_PEROXIDOS_NO, x: [1, 100, 0.5],
    respuesta: (p, x) => (x / M(rengFPeroxidoNo(p)) / 2) * O2(),
    errores: (p, x) => [
      ['sin-coef', 'Un O₂ por fórmula', (x / M(rengFPeroxidoNo(p))) * O2(), 'Cada dos fórmulas de peróxido liberan un O₂, no uno por fórmula.'],
      ['como-oxido', 'Fórmula del óxido', (x / M(rengFOxidoMetalNo(p)) / 2) * O2(), 'Usaste la fórmula del óxido; el peróxido tiene el grupo O₂²⁻ sin simplificar.']
    ],
    enunciado: (p, x) => `Se tratan ${tx(x)} g de ${p.n} con agua; cada dos fórmulas de peróxido liberan una molécula de O₂.`, pregunta: '¿Qué masa de O₂ se libera, en g?',
    datos: (p, x) => [['Peróxido', `${tx(x)} g`], ['Nombre', p.n]],
    pasos: (p, x, _y, rengR) => [`Fórmula ${T(rengFPeroxidoNo(p))}, M = ${tx(M(rengFPeroxidoNo(p)), 5)} g/mol.`, `m(O₂) = n/2·M(O₂) = ${tx(rengR)} g.`],
    pistas: ['Escribe el peróxido con O₂²⁻.', 'Calcula sus moles.', 'Dos fórmulas dan un O₂.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s8-p3', titulo: 'Peróxido para obtener oxígeno', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular la masa de peróxido metálico necesaria para obtener una masa de O₂.', seccion: '2.7', para: 'los peróxidos',
    idealizado: 'Reacción completa con agua.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_PEROXIDOS_NO, x: [0.5, 50, 0.5],
    respuesta: (p, x) => (x / O2()) * 2 * M(rengFPeroxidoNo(p)),
    errores: (p, x) => [
      ['sin-coef', 'Un peróxido por O₂', (x / O2()) * M(rengFPeroxidoNo(p)), 'Hacen falta dos fórmulas de peróxido por cada O₂.'],
      ['como-oxido', 'Fórmula del óxido', (x / O2()) * 2 * M(rengFOxidoMetalNo(p)), 'Usaste la masa del óxido; el peróxido tiene un oxígeno más.']
    ],
    enunciado: (p, x) => `Se quieren obtener ${tx(x)} g de O₂ con ${p.n} y agua (dos fórmulas de peróxido por cada O₂).`, pregunta: '¿Qué masa de peróxido hace falta, en g?',
    datos: (p, x) => [['O₂', `${tx(x)} g`], ['Peróxido', p.n]],
    pasos: (p, x, _y, rengR) => [`n(O₂) = ${tx(x / O2())} mol; n(peróxido) = 2·n(O₂).`, `m = n·M(${T(rengFPeroxidoNo(p))}) = ${tx(rengR)} g.`],
    pistas: ['Pasa el O₂ a moles.', 'Multiplica por dos.', 'Usa la masa del peróxido.']
  })
]

export const RENG_PRACTICAS_B05_S09: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s9-p1', titulo: 'Hidrógeno de un hidruro metálico', dificultad: 'basica', unidad: 'g',
    objetivo: 'Calcular el H₂ que libera un hidruro metálico al reaccionar con agua.', seccion: '2.7', para: 'los hidruros',
    idealizado: 'Reacción completa: MHₓ + x H₂O → M(OH)ₓ + x H₂.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_HIDRUROS_NO, x: [0.5, 50, 0.5],
    respuesta: (h, x) => (x / M(rengFHidruroNo(h))) * h.z * H2(),
    errores: (h, x) => [
      ['un-h2', 'Un H₂ por fórmula', (x / M(rengFHidruroNo(h))) * H2(), `Cada fórmula de hidruro libera ${h.z} H₂, uno por cada H⁻.`],
      ['atomos', 'Átomos de H en lugar de H₂', (x / M(rengFHidruroNo(h))) * h.z * A('H'), 'Calculaste la masa del hidrógeno del hidruro; el agua aporta otro tanto al formar H₂.']
    ],
    enunciado: (h, x) => `Se tratan ${tx(x)} g de ${h.n} con exceso de agua.`, pregunta: '¿Qué masa de H₂ se obtiene, en g?',
    datos: (h, x) => [['Hidruro', `${tx(x)} g`], ['Nombre', h.n]],
    pasos: (h, x, _y, rengR) => [`Fórmula ${T(rengFHidruroNo(h))}: libera ${h.z} H₂ por fórmula.`, `m(H₂) = ${tx(rengR)} g.`],
    pistas: ['Formula el hidruro.', 'Cada H⁻ da un H₂.', 'Pasa a gramos.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s9-p2', titulo: 'Hidrógeno contenido en un hidruro', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa de hidrógeno contenida en una muestra de hidruro metálico.', seccion: '2.7', para: 'los hidruros',
    idealizado: 'Hidruro puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_HIDRUROS_NO, x: [1, 100, 0.5],
    respuesta: (h, x) => (x * h.z * A('H')) / M(rengFHidruroNo(h)),
    errores: (h, x) => [
      ['sin-subindice', 'Un solo H', (x * A('H')) / M(rengFHidruroNo(h)), `El metal tiene carga ${h.z}+ y necesita ${h.z} iones H⁻.`],
      ['como-h2', 'Masa de H₂', (x * h.z * H2()) / M(rengFHidruroNo(h)), 'Contaste moléculas de H₂; en el hidruro hay iones H⁻, un átomo cada uno.']
    ],
    enunciado: (h, x) => `Una muestra contiene ${tx(x)} g de ${h.n}.`, pregunta: '¿Qué masa de hidrógeno contiene, en g?',
    datos: (h, x) => [['Muestra', `${tx(x)} g`], ['Nombre', h.n]],
    pasos: (h, x, _y, rengR) => [`Fórmula ${T(rengFHidruroNo(h))}.`, `m(H) = ${tx(x)} × ${h.z}·M(H)/M = ${tx(rengR)} g.`],
    pistas: ['Formula el hidruro.', 'Cuenta los H.', 'Calcula la fracción en masa.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s9-p3', titulo: 'Valencia en un hidruro no metálico', dificultad: 'avanzada', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Deducir la valencia del no metal en un hidruro no metálico a partir de su fórmula.', seccion: '2.7', para: 'los hidruros no metálicos', nombres: false,
    idealizado: 'H con +1.', metodo: 'regla de suma cero del núcleo (valor absoluto)', lista: RENG_HIDRUROS_NM_NO,
    respuesta: (h) => rengDeNo(h.f, 'H') / rengDeNo(h.f, h.el),
    errores: (h) => [
      ['total', 'Átomos totales', rengDeNo(h.f, 'H') + rengDeNo(h.f, h.el), 'Contaste todos los átomos; la valencia es la carga que compensa a los hidrógenos.'],
      ['doble', 'Doble', (2 * rengDeNo(h.f, 'H')) / rengDeNo(h.f, h.el), 'Cada hidrógeno aporta +1, no +2.']
    ],
    enunciado: (h) => `En el hidruro ${T(h.f)}, cada hidrógeno actúa con +1.`, pregunta: (h) => `¿Cuál es la valencia (número de oxidación sin signo) del ${h.el}?`,
    datos: (h) => [['Fórmula', T(h.f)], ['H', '+1']],
    pasos: (h, _x, _y, rengR) => [`${rengDeNo(h.f, h.el)}·x + ${rengDeNo(h.f, 'H')}(+1) = 0.`, `Valencia = ${tx(rengR)}.`],
    pistas: ['El H vale +1.', 'La suma es cero.', 'Toma el valor sin signo.']
  })
]

export const RENG_PRACTICAS_B05_S10: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s10-p1', titulo: 'Hidróxido que precipita', dificultad: 'basica', unidad: 'g',
    objetivo: 'Calcular la masa de hidróxido que se forma con una cantidad de catión metálico.', seccion: '2.7', para: 'los hidróxidos',
    idealizado: 'Precipitación completa.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_HIDROXIDOS_NO, x: [0.01, 2, 0.01],
    respuesta: (h, x) => x * M(rengFHidroxidoNo(h)),
    errores: (h, x) => [
      ['sin-parentesis', 'Sin paréntesis', x * (A(h.metal) + A('O') + h.z * A('H')), 'Sin paréntesis el subíndice solo afecta al H; hay que repetir el grupo OH completo.'],
      ['un-oh', 'Un solo OH', x * (A(h.metal) + OH()), `El catión tiene carga ${h.z}+ y necesita ${h.z} iones OH⁻.`]
    ],
    enunciado: (h, x) => `Se precipitan ${tx(x)} mol del catión metálico como ${h.n}.`, pregunta: '¿Qué masa de hidróxido se forma, en g?',
    datos: (h, x) => [['Catión', `${tx(x)} mol`], ['Producto', h.n]],
    pasos: (h, x, _y, rengR) => [`Fórmula ${T(rengFHidroxidoNo(h))}, M = ${tx(M(rengFHidroxidoNo(h)), 5)} g/mol.`, `m = ${tx(x)} × M = ${tx(rengR)} g.`],
    pistas: ['Un OH⁻ por carga.', 'Usa paréntesis.', 'Multiplica moles por M.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s10-p2', titulo: 'Del óxido al hidróxido', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa de hidróxido que se obtiene al añadir agua a una masa de óxido metálico.', seccion: '2.7', para: 'los hidróxidos',
    idealizado: 'Reacción completa con agua.', metodo: 'formulación desde los nombres y masas del núcleo', lista: RENG_OXIDO_A_HIDROXIDO_NO, x: [1, 100, 0.5],
    respuesta: (o, x) => { const rengO = rengCruzarNo(o.metal, o.z, 'O', 2); return (x / M(rengO.f)) * rengO.nc * M(rengCruzarNo(o.metal, o.z, 'OH', 1).f) },
    errores: (o, x) => {
      const rengO = rengCruzarNo(o.metal, o.z, 'O', 2)
      return [
        ['sin-coef', 'Un hidróxido por óxido', (x / M(rengO.f)) * M(rengCruzarNo(o.metal, o.z, 'OH', 1).f), `Cada fórmula de óxido tiene ${rengO.nc} átomos de metal y da ${rengO.nc} fórmulas de hidróxido.`],
        ['masa-igual', 'Misma masa', x, 'El hidróxido incorpora agua: su masa es mayor que la del óxido.']
      ]
    },
    enunciado: (o, x) => `Se añaden ${tx(x)} g de ${o.oxido} a exceso de agua y se forma ${o.hidroxido}.`, pregunta: '¿Qué masa de hidróxido se obtiene, en g?',
    datos: (o, x) => [['Óxido', `${tx(x)} g`], ['Producto', o.hidroxido]],
    pasos: (o, x, _y, rengR) => [`${T(rengCruzarNo(o.metal, o.z, 'O', 2).f)} → ${T(rengCruzarNo(o.metal, o.z, 'OH', 1).f)}; se conservan los átomos de metal.`, `m = ${tx(rengR)} g.`],
    pistas: ['Formula óxido e hidróxido.', 'Conserva el metal.', 'Pasa a gramos.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s10-p3', titulo: 'Iones hidróxido de una base', dificultad: 'avanzada', unidad: 'mol',
    objetivo: 'Calcular los moles de OH⁻ que aporta una masa de hidróxido.', seccion: '2.7', para: 'los hidróxidos',
    idealizado: 'Disociación completa.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_HIDROXIDOS_NO, x: [0.5, 100, 0.5],
    respuesta: (h, x) => (x / M(rengFHidroxidoNo(h))) * h.z,
    errores: (h, x) => [
      ['sin-z', 'Sin multiplicar por los OH', x / M(rengFHidroxidoNo(h)), `Cada fórmula aporta ${h.z} OH⁻.`],
      ['como-oh', 'Dividir entre la masa del OH', x / OH(), 'Dividiste la masa entre la del ion OH⁻; la muestra es del hidróxido completo.']
    ],
    enunciado: (h, x) => `Se disuelven ${tx(x)} g de ${h.n}.`, pregunta: '¿Cuántos moles de OH⁻ aporta?',
    datos: (h, x) => [['Masa', `${tx(x)} g`], ['Nombre', h.n]],
    pasos: (h, x, _y, rengR) => [`Fórmula ${T(rengFHidroxidoNo(h))}.`, `n(OH⁻) = ${h.z} × ${tx(x)}/M = ${tx(rengR)} mol.`],
    pistas: ['Formula el hidróxido.', 'Calcula sus moles.', 'Multiplica por los OH.']
  })
]

export const RENG_PRACTICAS_B05_S11: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s11-p1', titulo: 'Hidrácido en una disolución', dificultad: 'basica', unidad: 'g',
    objetivo: 'Formular un hidrácido desde su nombre y calcular la masa que contiene una disolución.', seccion: '2.7', para: 'los hidrácidos',
    idealizado: 'Disolución exacta.', metodo: 'formulación desde el nombre del compuesto gaseoso y masas del núcleo', lista: RENG_HIDRACIDOS_NO, x: [50, 1000, 10], y: [0.05, 2, 0.05],
    respuesta: (h, x, y) => (x / 1000) * y * M(h.f),
    errores: (h, x, y) => [
      ['ml', 'Volumen en mL', x * y * M(h.f), 'La concentración está en mol/L: pasa los mL a litros.'],
      ['h-mal', 'Hidrógenos equivocados', (x / 1000) * y * M(h.mal), `El ${h.x} actúa con su valencia negativa: la fórmula es ${T(h.f)}.`]
    ],
    enunciado: (h, x, y) => `Se preparan ${tx(x)} mL de ${h.acido} de concentración ${tx(y)} mol/L.`, pregunta: '¿Qué masa del compuesto disuelto contiene, en g?',
    datos: (h, x, y) => [['Volumen', `${tx(x)} mL`], ['Concentración', `${tx(y)} mol/L`], ['Nombre', h.acido]],
    pasos: (h, x, y, rengR) => [`${h.acido} = ${T(h.f)} en agua.`, `n = ${tx(y)} × ${tx(x / 1000)} L; m = ${tx(rengR)} g.`],
    pistas: ['Formula el hidrácido.', 'n = c·V en litros.', 'Pasa a gramos.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s11-p2', titulo: 'No metal en un hidrácido', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa del no metal contenida en una masa de hidrácido.', seccion: '2.7', para: 'los hidrácidos',
    idealizado: 'Compuesto puro.', metodo: 'formulación desde el nombre del compuesto gaseoso y masas del núcleo', lista: RENG_HIDRACIDOS_NO, x: [1, 100, 0.5],
    respuesta: (h, x) => (x * A(h.x)) / M(h.f),
    errores: (h, x) => [
      ['hidrogeno', 'Masa de hidrógeno', (x * rengDeNo(h.f, 'H') * A('H')) / M(h.f), 'Calculaste la masa del hidrógeno, no la del no metal.'],
      ['todo', 'Toda la masa', x, 'Una parte de la masa es hidrógeno; no todo es no metal.']
    ],
    enunciado: (h, x) => `Se tienen ${tx(x)} g de ${h.gas}.`, pregunta: '¿Qué masa del no metal contiene, en g?',
    datos: (h, x) => [['Masa', `${tx(x)} g`], ['Nombre', h.gas]],
    pasos: (h, x, _y, rengR) => [`Fórmula ${T(h.f)}.`, `m(${h.x}) = ${tx(x)} × M(${h.x})/M = ${tx(rengR)} g.`],
    pistas: ['Formula el compuesto.', 'Calcula la fracción del no metal.', 'Multiplica para obtener la masa.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s11-p3', titulo: 'Sal sódica de un hidrácido', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Formular la sal que forma un hidrácido con hidróxido de sodio y calcular su masa.', seccion: '2.7', para: 'los hidrácidos y sus sales',
    idealizado: 'Neutralización completa.', metodo: 'formulación desde los nombres y masas del núcleo', lista: RENG_HIDRACIDOS_NO, x: [1, 100, 0.5],
    respuesta: (h, x) => (x / M(h.f)) * M(h.sal),
    errores: (h, x) => [
      ['masa-igual', 'Misma masa', x, 'La sal no pesa lo mismo que el ácido: el sodio sustituye al hidrógeno.'],
      ['sal-mal', 'Sal mal formulada', (x / M(h.f)) * M(h.salMal), `La sal tiene un Na⁺ por cada H del ácido: ${T(h.sal)}.`]
    ],
    enunciado: (h, x) => `Se neutralizan ${tx(x)} g de ${h.gas} con hidróxido de sodio.`, pregunta: '¿Qué masa de sal de sodio se forma, en g?',
    datos: (h, x) => [['Ácido', `${tx(x)} g de ${T(h.f)}`], ['Base', 'NaOH']],
    pasos: (h, x, _y, rengR) => [`Sal: ${T(h.sal)}; un mol de sal por mol de ácido.`, `m = ${tx(rengR)} g.`],
    pistas: ['Formula la sal.', 'Un Na por cada H.', 'Relaciona moles.']
  })
]

export const RENG_PRACTICAS_B05_S12: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s12-p1', titulo: 'Átomo central de un oxoácido', dificultad: 'basica', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Calcular el número de oxidación del átomo central de un oxoácido a partir de su fórmula.', seccion: '2.7', para: 'los oxoácidos', nombres: false,
    idealizado: 'H +1 y O −2.', metodo: 'regla de suma cero del núcleo', lista: RENG_OXOACIDOS_NO,
    respuesta: (o) => rengOxAcidoNo(o.f, o.el),
    errores: (o) => [
      ['sin-h', 'Sin los hidrógenos', 2 * rengDeNo(o.f, 'O'), 'Olvidaste los hidrógenos: cada uno aporta +1.'],
      ['oxigeno-1', 'Oxígeno con −1', rengDeNo(o.f, 'O') - rengDeNo(o.f, 'H'), 'El oxígeno actúa con −2 en los oxoácidos.']
    ],
    enunciado: (o) => `Considera el oxoácido ${T(o.f)}.`, pregunta: (o) => `¿Cuál es el número de oxidación del ${o.el}?`,
    datos: (o) => [['Fórmula', T(o.f)], ['H y O', '+1 y −2']],
    pasos: (o, _x, _y, rengR) => [`${rengDeNo(o.f, 'H')}(+1) + x + ${rengDeNo(o.f, 'O')}(−2) = 0.`, `x = +${tx(rengR)}.`],
    pistas: ['La suma debe ser cero.', 'H +1 y O −2.', 'Despeja la incógnita.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s12-p2', titulo: 'Oxoácido desde su óxido', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa de oxoácido que se obtiene al combinar un óxido ácido con agua.', seccion: '2.7', para: 'los oxoácidos',
    idealizado: 'Reacción completa con agua.', metodo: 'formulación desde los nombres y masas del núcleo', lista: RENG_ANHIDRIDOS_NO, x: [1, 100, 0.5],
    respuesta: (a, x) => (x / M(a.fo)) * a.k * M(a.fa),
    errores: (a, x) => [
      ['sin-coef', 'Un ácido por óxido', (x / M(a.fo)) * M(a.fa), `Cada fórmula de ${T(a.fo)} da ${a.k} de ácido: se conservan los átomos del no metal.`],
      ['masa-igual', 'Misma masa', x, 'El ácido incorpora agua: su masa total es mayor que la del óxido.']
    ],
    enunciado: (a, x) => `Se disuelven ${tx(x)} g de ${a.oxido} en agua y se forma ${a.acido}.`, pregunta: '¿Qué masa de ácido se forma, en g?',
    datos: (a, x) => [['Óxido', `${tx(x)} g de ${T(a.fo)}`], ['Ácido', a.acido]],
    pasos: (a, x, _y, rengR) => [`${T(a.fo)} → ${a.k} ${T(a.fa)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Formula el ácido.', 'Conserva el no metal.', 'Pasa a gramos.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s12-p3', titulo: 'Oxígeno en una muestra de ácido', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular la masa de oxígeno de una muestra de oxoácido a partir de su nombre.', seccion: '2.7', para: 'los oxoácidos',
    idealizado: 'Ácido puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_OXOACIDOS_NO, x: [1, 200, 0.5],
    valida: (o) => Math.abs((rengDeNo(o.f, 'O') * A('O')) / M(o.f) - 0.5) > 0.03,
    respuesta: (o, x) => (x * rengDeNo(o.f, 'O') * A('O')) / M(o.f),
    errores: (o, x) => [
      ['sin-subindice', 'Un solo oxígeno', (x * A('O')) / M(o.f), 'Contaste un oxígeno; la fórmula tiene varios.'],
      ['resto', 'Masa del resto', (x * (M(o.f) - rengDeNo(o.f, 'O') * A('O'))) / M(o.f), 'Calculaste la masa del hidrógeno y del átomo central, no la del oxígeno.']
    ],
    enunciado: (o, x) => `Una muestra contiene ${tx(x)} g de ${o.n}.`, pregunta: '¿Qué masa de oxígeno contiene, en g?',
    datos: (o, x) => [['Muestra', `${tx(x)} g`], ['Nombre', o.n]],
    pasos: (o, x, _y, rengR) => [`Fórmula ${T(o.f)}: ${rengDeNo(o.f, 'O')} O.`, `m(O) = ${tx(rengR)} g.`],
    pistas: ['Formula el ácido.', 'Cuenta los oxígenos.', 'Calcula la fracción en masa.']
  })
]

export const RENG_PRACTICAS_B05_S13: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s13-p1', titulo: 'Masa fórmula de una sal binaria', dificultad: 'basica', unidad: 'g/mol',
    objetivo: 'Formular una sal binaria cruzando cargas y calcular su masa fórmula.', seccion: '2.6', para: 'las sales binarias',
    idealizado: 'Sal iónica.', metodo: 'formulación desde el nombre con el núcleo', lista: RENG_SALES_BINARIAS_NO,
    respuesta: (s) => M(rengFSalNo(s).f),
    errores: (s) => [
      ['sin-cruzar', 'Un ion de cada', A(s.cat) + A(s.an), 'Escribiste un ion de cada; hay que cruzar las cargas para que la sal sea neutra.'],
      ['invertida', 'Subíndices intercambiados', rengFSalNo(s).na * A(s.cat) + rengFSalNo(s).nc * A(s.an), 'Intercambiaste los subíndices: cada ion lleva como subíndice la carga del otro.']
    ],
    enunciado: (s) => `Un frasco contiene ${s.n}.`, pregunta: '¿Cuál es la masa fórmula de la sal, en g/mol?',
    datos: (s) => [['Nombre', s.n], ['Cargas', `${s.cat} ${s.z}+, ${s.an} ${s.za}−`]],
    pasos: (s, _x, _y, rengR) => [`Cargas cruzadas: ${T(rengFSalNo(s).f)}.`, `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Cruza las cargas.', 'Simplifica.', 'Suma las masas.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s13-p2', titulo: 'No metal en una sal', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa del no metal en una muestra de sal binaria.', seccion: '2.6', para: 'las sales binarias',
    idealizado: 'Sal pura.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_SALES_BINARIAS_NO, x: [1, 200, 0.5],
    respuesta: (s, x) => (x * rengFSalNo(s).na * A(s.an)) / M(rengFSalNo(s).f),
    errores: (s, x) => [
      ['sin-cruzar', 'Fórmula 1:1', (x * A(s.an)) / (A(s.cat) + A(s.an)), 'Supusiste un ion de cada; cruza las cargas.'],
      ['metal', 'Masa del metal', (x * rengFSalNo(s).nc * A(s.cat)) / M(rengFSalNo(s).f), 'Calculaste la masa del metal, no la del no metal.']
    ],
    enunciado: (s, x) => `Se tienen ${tx(x)} g de ${s.n}.`, pregunta: '¿Qué masa del no metal contienen, en g?',
    datos: (s, x) => [['Muestra', `${tx(x)} g`], ['Nombre', s.n]],
    pasos: (s, x, _y, rengR) => [`Fórmula ${T(rengFSalNo(s).f)}.`, `m(${s.an}) = ${tx(rengR)} g.`],
    pistas: ['Formula la sal.', 'Cuenta los átomos del no metal.', 'Calcula la fracción.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s13-p3', titulo: 'Sal formada con un metal', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular la masa de sal binaria que se forma a partir de una masa de metal.', seccion: '2.6', para: 'las sales binarias',
    idealizado: 'Reacción completa.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_SALES_BINARIAS_NO, x: [1, 100, 0.5],
    respuesta: (s, x) => (x / A(s.cat) / rengFSalNo(s).nc) * M(rengFSalNo(s).f),
    errores: (s, x) => [
      ['sin-dividir', 'Sin dividir entre el subíndice', (x / A(s.cat)) * M(rengFSalNo(s).f), 'Cada fórmula de sal tiene varios átomos del metal: divide sus moles entre el subíndice.'],
      ['sin-cruzar', 'Fórmula 1:1', (x / A(s.cat)) * (A(s.cat) + A(s.an)), 'Supusiste un ion de cada; cruza las cargas.']
    ],
    enunciado: (s, x) => `Todo el metal de ${tx(x)} g de ${s.cat} se transforma en ${s.n}.`, pregunta: '¿Qué masa de sal se forma, en g?',
    datos: (s, x) => [['Metal', `${tx(x)} g de ${s.cat}`], ['Sal', s.n]],
    pasos: (s, x, _y, rengR) => [`Fórmula ${T(rengFSalNo(s).f)}.`, `n(sal) = n(${s.cat})/${rengFSalNo(s).nc}; m = ${tx(rengR)} g.`],
    pistas: ['Formula la sal.', 'Conserva el metal.', 'Pasa a gramos.']
  })
]

export const RENG_PRACTICAS_B05_S14: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s14-p1', titulo: 'Masa de una cantidad de oxisal', dificultad: 'basica', unidad: 'g',
    objetivo: 'Formular una oxisal con paréntesis y calcular la masa de una cantidad dada.', seccion: '2.7', para: 'las oxisales',
    idealizado: 'Sal iónica.', metodo: 'formulación desde el nombre con el núcleo', lista: RENG_OXISALES_NO, x: [0.05, 5, 0.05],
    respuesta: (s, x) => x * M(ox(s).f),
    errores: (s, x) => [
      ['un-anion', 'Un solo oxoanión', x * (ox(s).nc * M(s.cat) + M(s.an)), 'Olvidaste el subíndice del paréntesis: el oxoanión se repite tantas veces como indica.'],
      ['ato-ito', 'Oxoanión -ito', x * M(rengCruzarNo(s.cat, s.z, s.ito, s.za).f), `Usaste el anión ${T(s.ito)} (-ito); el sufijo -ato indica ${T(s.an)}.`]
    ],
    enunciado: (s, x) => `Se necesitan ${tx(x)} mol de ${s.n}.`, pregunta: '¿Qué masa de sal hay que pesar, en g?',
    datos: (s, x) => [['Cantidad', `${tx(x)} mol`], ['Nombre', s.n], ['Oxoanión', `${T(s.an)}, carga ${s.za}−`]],
    pasos: (s, _x, _y, rengR) => [`Fórmula ${T(ox(s).f)}, M = ${tx(M(ox(s).f), 5)} g/mol.`, `m = n·M = ${tx(rengR)} g.`],
    pistas: ['Identifica el oxoanión.', 'Cruza las cargas.', 'Usa paréntesis y multiplica por n.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s14-p2', titulo: 'Elemento central en una oxisal', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa del elemento central del oxoanión en una muestra de oxisal.', seccion: '2.7', para: 'las oxisales',
    idealizado: 'Sal pura.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_OXISALES_NO, x: [1, 200, 0.5],
    respuesta: (s, x) => (x * ox(s).na * A(s.el)) / M(ox(s).f),
    errores: (s, x) => [
      ['un-anion', 'Un solo oxoanión', (x * A(s.el)) / M(ox(s).f), 'La fórmula tiene varios oxoaniones: multiplica por su subíndice.'],
      ['ato-ito', 'Oxoanión -ito', (x * ox(s).na * A(s.el)) / M(rengCruzarNo(s.cat, s.z, s.ito, s.za).f), 'Usaste la sal con un oxígeno menos (-ito); revisa el sufijo.']
    ],
    enunciado: (s, x) => `Se tienen ${tx(x)} g de ${s.n}.`, pregunta: (s) => `¿Qué masa de ${s.el} contienen, en g?`,
    datos: (s, x) => [['Muestra', `${tx(x)} g`], ['Nombre', s.n]],
    pasos: (s, x, _y, rengR) => [`Fórmula ${T(ox(s).f)}: ${ox(s).na} átomo(s) de ${s.el}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Formula la sal.', 'Cuenta los oxoaniones.', 'Calcula la fracción.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s14-p3', titulo: 'Número de oxidación en una oxisal', dificultad: 'avanzada', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Calcular el número de oxidación del elemento central de una oxisal a partir de la carga de su oxoanión.', seccion: '4.2', para: 'las oxisales y los números de oxidación', nombres: false,
    idealizado: 'O con −2.', metodo: 'regla de suma cero del núcleo sobre la sal completa', lista: RENG_OXISALES_NO,
    respuesta: (s) => 2 * rengDeNo(s.an, 'O') - s.za,
    errores: (s) => [
      ['sin-carga', 'Sin la carga del anión', 2 * rengDeNo(s.an, 'O'), 'El oxoanión tiene carga: la suma de sus números de oxidación no es cero.'],
      ['oxigeno-1', 'Oxígeno con −1', rengDeNo(s.an, 'O') - s.za, 'El oxígeno actúa con −2 en las oxisales.']
    ],
    enunciado: (s) => `El ${s.n} contiene el oxoanión ${T(s.an)} de carga ${s.za}−.`, pregunta: (s) => `¿Cuál es el número de oxidación del ${s.el}?`,
    datos: (s) => [['Sal', T(ox(s).f)], ['Oxoanión', `${T(s.an)}, ${s.za}−`]],
    pasos: (s, _x, _y, rengR) => [`x + ${rengDeNo(s.an, 'O')}(−2) = −${s.za}.`, `x = +${tx(rengR)}.`],
    pistas: ['Trabaja con el oxoanión.', 'La suma es su carga.', 'Despeja la incógnita.']
  })
]
