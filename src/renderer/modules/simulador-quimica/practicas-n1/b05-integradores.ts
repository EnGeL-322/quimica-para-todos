import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_BICARBONATOS_NO } from './b05-s15-s20'
import {
  RENG_HIDRATOS_NO, RENG_OXIDO_A_HIDROXIDO_NO, RENG_PEROXIDOS_NO, RENG_TOL_NO, RENG_TOL_NO_ENT, RENG_TRADICIONAL_NO,
  rengAnNo, rengAnionesNo, rengCruzarNo, rengDeNo, rengFHidratoNo, rengFOxidoMetalNo, rengFPeroxidoNo, rengFStockNo, rengFuentesNo, rengMNo, rengTxtNo
} from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(5)
const M = rengMNo
const A = rengAnNo
const T = rengTxtNo
const tx = rengTx

export interface RengCadenaNo {
  el: string
  oxido: string
  nx: number
  acido: string
  sal: string
  salNombre: string
}

export const RENG_CADENAS_NO: readonly RengCadenaNo[] = [
  { el: 'S', oxido: 'SO3', nx: 1, acido: 'H2SO4', sal: 'Na2SO4', salNombre: 'sulfato de sodio' },
  { el: 'C', oxido: 'CO2', nx: 1, acido: 'H2CO3', sal: 'Na2CO3', salNombre: 'carbonato de sodio' },
  { el: 'N', oxido: 'N2O5', nx: 2, acido: 'HNO3', sal: 'KNO3', salNombre: 'nitrato de potasio' },
  { el: 'P', oxido: 'P2O5', nx: 2, acido: 'H3PO4', sal: 'Na3PO4', salNombre: 'fosfato de sodio' },
  { el: 'Cl', oxido: 'Cl2O7', nx: 2, acido: 'HClO4', sal: 'Mg(ClO4)2', salNombre: 'perclorato de magnesio' }
]

export const rengSalCadenaPorElNo = (rengC: RengCadenaNo): number => rengDeNo(rengC.sal, rengC.el)
export const RENG_BICARB_CLORURO_NO: ReadonlyArray<{ i: number; cloruro: string }> = RENG_BICARBONATOS_NO.map((rengS, rengI) => ({ i: rengI, cloruro: rengS.f.startsWith('Ca') ? 'CaCl2' : rengS.f.startsWith('Mg') ? 'MgCl2' : rengS.f.startsWith('NH4') ? 'NH4Cl' : `${rengS.f.replace('HCO3', '')}Cl` }))

export const RENG_TRAD_I5_NO = RENG_TRADICIONAL_NO.filter((rengT) => rengT.metal !== 'Hg')

export const RENG_INTEGRADORES_B05: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b5-i1', subtema: RENG_GRUPO, subtemas: ['n1-b5-s6', 'n1-b5-s10'],
    titulo: 'Del metal al hidróxido', dificultad: 'intermedia',
    objetivo: 'Encadenar la formulación de un óxido y de un hidróxido para calcular la masa final a partir del metal.', unidad: 'g', tolerancia: RENG_TOL_NO,
    fuentes: rengFuentesNo('2.7', 'los óxidos y los hidróxidos'), idealizado: 'Reacciones completas.', metodo: 'formulación desde los nombres y masas del núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_OXIDO_A_HIDROXIDO_NO.length), m: rengEntreN1(rengRng, 1, 100, 0.5) }),
    respuesta: (rengD) => { const o = RENG_OXIDO_A_HIDROXIDO_NO[rengD.i]!; return (rengD.m / A(o.metal)) * M(rengCruzarNo(o.metal, o.z, 'OH', 1).f) },
    errores: (rengD) => {
      const o = RENG_OXIDO_A_HIDROXIDO_NO[rengD.i]!
      const rengOx = rengCruzarNo(o.metal, o.z, 'O', 2)
      return [
        ['oxido', 'Masa del óxido', (rengD.m / A(o.metal) / rengOx.nc) * M(rengOx.f), 'Te quedaste en el óxido; la pregunta pide el hidróxido que se forma después con agua.'],
        ['masa-igual', 'Misma masa', rengD.m, 'El producto incorpora oxígeno e hidrógeno: pesa más que el metal.']
      ]
    },
    enunciado: (rengD) => { const o = RENG_OXIDO_A_HIDROXIDO_NO[rengD.i]!; return `Se oxidan ${tx(rengD.m)} g de ${o.metal} a ${o.oxido} y el óxido se trata con agua hasta formar ${o.hidroxido}.` },
    pregunta: () => '¿Qué masa de hidróxido se obtiene, en g?',
    datos: (rengD) => { const o = RENG_OXIDO_A_HIDROXIDO_NO[rengD.i]!; return [['Metal', `${tx(rengD.m)} g de ${o.metal}`], ['Óxido', o.oxido], ['Hidróxido', o.hidroxido]] },
    pasos: (rengD, rengR) => { const o = RENG_OXIDO_A_HIDROXIDO_NO[rengD.i]!; return [`Se conservan los átomos de metal: ${T(rengCruzarNo(o.metal, o.z, 'O', 2).f)} → ${T(rengCruzarNo(o.metal, o.z, 'OH', 1).f)} (subtemas 6 y 10).`, `n(hidróxido) = n(${o.metal}); m = ${tx(rengR)} g.`] },
    pistas: ['Formula el óxido y el hidróxido.', 'Cada átomo de metal acaba en un hidróxido.', 'Pasa a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b5-i2', subtema: RENG_GRUPO, subtemas: ['n1-b5-s7', 'n1-b5-s12', 'n1-b5-s14'],
    titulo: 'Del no metal a la oxisal', dificultad: 'avanzada',
    objetivo: 'Seguir un no metal a través de su óxido ácido, su oxoácido y su oxisal para calcular la masa de sal.', unidad: 'g', tolerancia: RENG_TOL_NO,
    fuentes: rengFuentesNo('2.7', 'óxidos ácidos, oxoácidos y oxisales'), idealizado: 'Todas las etapas completas.', metodo: 'formulación desde el nombre de la sal y masas del núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_CADENAS_NO.length), m: rengEntreN1(rengRng, 0.5, 50, 0.5) }),
    respuesta: (rengD) => { const c = RENG_CADENAS_NO[rengD.i]!; return (rengD.m / A(c.el) / rengSalCadenaPorElNo(c)) * M(c.sal) },
    errores: (rengD) => {
      const c = RENG_CADENAS_NO[rengD.i]!
      return [
        ['acido', 'Masa del ácido', (rengD.m / A(c.el)) * (M(c.acido) / rengDeNo(c.acido, c.el)), 'Te quedaste en el oxoácido; la pregunta pide la sal.'],
        ['oxido', 'Masa del óxido', (rengD.m / A(c.el) / c.nx) * M(c.oxido), 'Te quedaste en el óxido; sigue la cadena hasta la sal.']
      ]
    },
    enunciado: (rengD) => { const c = RENG_CADENAS_NO[rengD.i]!; return `Todo el ${c.el} de ${tx(rengD.m)} g del elemento pasa a ${T(c.oxido)}, luego a ${T(c.acido)} y, por último, a ${c.salNombre}.` },
    pregunta: () => '¿Qué masa de sal se obtiene, en g?',
    datos: (rengD) => { const c = RENG_CADENAS_NO[rengD.i]!; return [['Elemento', `${tx(rengD.m)} g de ${c.el}`], ['Sal', c.salNombre]] },
    pasos: (rengD, rengR) => { const c = RENG_CADENAS_NO[rengD.i]!; return [`Se conserva el ${c.el}: ${T(c.oxido)} → ${T(c.acido)} → ${T(c.sal)} (subtemas 7, 12 y 14).`, `m(sal) = ${tx(rengR)} g.`] },
    pistas: ['Formula la sal final.', 'Conserva los átomos del no metal.', 'Pasa a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b5-i3', subtema: RENG_GRUPO, subtemas: ['n1-b5-s17', 'n1-b5-s20'],
    titulo: 'Metal en un hidrato', dificultad: 'basica',
    objetivo: 'Interpretar el nombre de un hidrato y calcular la masa del metal que contiene una muestra.', unidad: 'g', tolerancia: RENG_TOL_NO,
    fuentes: rengFuentesNo('2.7', 'los hidratos'), idealizado: 'Hidrato puro.', metodo: 'formulación desde el nombre del hidrato y masas del núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_HIDRATOS_NO.length), m: rengEntreN1(rengRng, 1, 200, 0.5) }),
    respuesta: (rengD) => { const h = RENG_HIDRATOS_NO[rengD.i]!; const el = [...h.sal.matchAll(/[A-Z][a-z]?/g)][0]![0]; return (rengD.m * rengDeNo(h.sal, el) * A(el)) / M(rengFHidratoNo(h)) },
    errores: (rengD) => {
      const h = RENG_HIDRATOS_NO[rengD.i]!
      const el = [...h.sal.matchAll(/[A-Z][a-z]?/g)][0]![0]
      return [
        ['anhidra', 'Masa de la sal anhidra', (rengD.m * rengDeNo(h.sal, el) * A(el)) / M(h.sal), 'Usaste la masa de la sal anhidra; la muestra es del hidrato, que incluye el agua.'],
        ['sin-n', 'Una sola agua', (rengD.m * rengDeNo(h.sal, el) * A(el)) / (M(h.sal) + M('H2O')), `El prefijo indica ${h.agua} moléculas de agua, no una.`]
      ]
    },
    enunciado: (rengD) => `Un frasco contiene ${tx(rengD.m)} g de ${RENG_HIDRATOS_NO[rengD.i]!.n}.`,
    pregunta: () => '¿Qué masa del metal (el primer elemento de la fórmula) contiene, en g?',
    datos: (rengD) => [['Muestra', `${tx(rengD.m)} g`], ['Nombre', RENG_HIDRATOS_NO[rengD.i]!.n]],
    pasos: (rengD, rengR) => [`Fórmula ${T(rengFHidratoNo(RENG_HIDRATOS_NO[rengD.i]!))} (subtemas 17 y 20).`, `m = ${tx(rengR)} g.`],
    pistas: ['Escribe la fórmula del hidrato.', 'Incluye el agua en la masa fórmula.', 'Calcula la fracción del metal.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b5-i4', subtema: RENG_GRUPO, subtemas: ['n1-b5-s11', 'n1-b5-s15'],
    titulo: 'Bicarbonato y ácido clorhídrico', dificultad: 'basica',
    objetivo: 'Formular la sal ácida y el cloruro que se forma al tratarla con ácido clorhídrico, y calcular su masa.', unidad: 'g', tolerancia: RENG_TOL_NO,
    fuentes: rengFuentesNo('2.7', 'las sales ácidas y los hidrácidos'), idealizado: 'Reacción completa: HCO₃⁻ + H⁺ → H₂O + CO₂.', metodo: 'formulación desde los nombres y masas del núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_BICARB_CLORURO_NO.length), m: rengEntreN1(rengRng, 1, 100, 0.5) }),
    respuesta: (rengD) => { const s = RENG_BICARBONATOS_NO[rengD.i]!; return (rengD.m / M(s.f)) * M(RENG_BICARB_CLORURO_NO[rengD.i]!.cloruro) },
    errores: (rengD) => {
      const s = RENG_BICARBONATOS_NO[rengD.i]!
      return [
        ['masa-igual', 'Misma masa', rengD.m, 'El cloruro no pesa lo mismo que el hidrogenocarbonato: el anión cambia.'],
        ['co2', 'Masa de CO₂', (rengD.m / M(s.f)) * rengAnionesNo(s) * M('CO2'), 'Calculaste el CO₂ que se desprende; la pregunta pide la sal que queda.']
      ]
    },
    enunciado: (rengD) => `Se tratan ${tx(rengD.m)} g de ${RENG_BICARBONATOS_NO[rengD.i]!.n} con exceso de ácido clorhídrico. Se desprende CO₂ y queda el cloruro del catión.`,
    pregunta: () => '¿Qué masa de cloruro se forma, en g?',
    datos: (rengD) => [['Sal ácida', `${tx(rengD.m)} g de ${T(RENG_BICARBONATOS_NO[rengD.i]!.f)}`], ['Cloruro', T(RENG_BICARB_CLORURO_NO[rengD.i]!.cloruro)]],
    pasos: (rengD, rengR) => [`${T(RENG_BICARBONATOS_NO[rengD.i]!.f)} → ${T(RENG_BICARB_CLORURO_NO[rengD.i]!.cloruro)}: se conserva el catión (subtemas 11 y 15).`, `m = ${tx(rengR)} g.`],
    pistas: ['Formula el cloruro del mismo catión.', 'Se conservan los moles de catión.', 'Pasa a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b5-i5', subtema: RENG_GRUPO, subtemas: ['n1-b5-s4', 'n1-b5-s5'],
    titulo: 'Proporciones múltiples con -oso e -ico', dificultad: 'avanzada',
    objetivo: 'Comparar dos compuestos del mismo metal con distinta valencia: cuánto anión se combina con la misma masa de metal.', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    fuentes: rengFuentesNo('2.7', 'las nomenclaturas de Stock y tradicional'), idealizado: 'Compuestos de fórmula exacta.', metodo: 'formulación desde los nombres y recuento con el núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_TRAD_I5_NO.length) }),
    respuesta: (rengD) => { const t = RENG_TRAD_I5_NO[rengD.i]!; return t.z / t.otra },
    errores: (rengD) => {
      const t = RENG_TRAD_I5_NO[rengD.i]!
      return [
        ['invertida', 'Cociente invertido', t.otra / t.z, 'Invertiste el cociente: el compuesto del enunciado va en el numerador.'],
        ['iguales', 'La misma cantidad', 1, 'Con distinta valencia, la misma masa de metal se combina con distinta cantidad de anión.']
      ]
    },
    enunciado: (rengD) => { const t = RENG_TRAD_I5_NO[rengD.i]!; return `El metal del «${t.n}» (${T(rengFStockNo(t).f)}) también forma ${T(rengFStockNo(t, t.otra).f)}, con valencia ${t.otra}.` },
    pregunta: () => 'Para la misma masa de metal, ¿cuántas veces más anión contiene el compuesto del nombre que el otro?',
    datos: (rengD) => { const t = RENG_TRAD_I5_NO[rengD.i]!; return [['Compuesto', `${t.n}, ${T(rengFStockNo(t).f)}`], ['Otro', T(rengFStockNo(t, t.otra).f)]] },
    pasos: (rengD, rengR) => { const t = RENG_TRAD_I5_NO[rengD.i]!; return [`Por átomo de metal hay ${t.z}/${t.za} aniones en uno y ${t.otra}/${t.za} en el otro (subtemas 4 y 5).`, `Cociente = ${tx(rengR, 4)}.`] },
    pistas: ['Escribe las dos fórmulas.', 'Cuenta aniones por átomo de metal.', 'Divide los dos cocientes.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b5-i6', subtema: RENG_GRUPO, subtemas: ['n1-b5-s8', 'n1-b5-s10'],
    titulo: 'Hidróxido desde un peróxido', dificultad: 'intermedia',
    objetivo: 'Formular un peróxido y el hidróxido que forma con agua para calcular la masa de hidróxido.', unidad: 'g', tolerancia: RENG_TOL_NO,
    fuentes: rengFuentesNo('2.7', 'los peróxidos y los hidróxidos'), idealizado: 'Reacción completa con agua; se conservan los átomos de metal.', metodo: 'formulación desde los nombres y masas del núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_PEROXIDOS_NO.length), m: rengEntreN1(rengRng, 1, 100, 0.5) }),
    respuesta: (rengD) => { const p = RENG_PEROXIDOS_NO[rengD.i]!; return (rengD.m / M(rengFPeroxidoNo(p))) * rengDeNo(rengFPeroxidoNo(p), p.metal) * M(rengCruzarNo(p.metal, p.z, 'OH', 1).f) },
    errores: (rengD) => {
      const p = RENG_PEROXIDOS_NO[rengD.i]!
      const rengH = M(rengCruzarNo(p.metal, p.z, 'OH', 1).f)
      return [
        ['como-oxido', 'Fórmula del óxido', (rengD.m / M(rengFOxidoMetalNo(p))) * rengDeNo(rengFPeroxidoNo(p), p.metal) * rengH, 'Usaste la masa del óxido; el peróxido tiene el grupo O₂²⁻.'],
        ['masa-igual', 'Misma masa', rengD.m, 'El hidróxido no pesa lo mismo que el peróxido.']
      ]
    },
    enunciado: (rengD) => `Se tratan ${tx(rengD.m)} g de ${RENG_PEROXIDOS_NO[rengD.i]!.n} con agua; todo el metal acaba como hidróxido y se desprende O₂.`,
    pregunta: () => '¿Qué masa de hidróxido se forma, en g?',
    datos: (rengD) => [['Peróxido', `${tx(rengD.m)} g`], ['Nombre', RENG_PEROXIDOS_NO[rengD.i]!.n]],
    pasos: (rengD, rengR) => { const p = RENG_PEROXIDOS_NO[rengD.i]!; return [`${T(rengFPeroxidoNo(p))} → ${T(rengCruzarNo(p.metal, p.z, 'OH', 1).f)}; se conserva el metal (subtemas 8 y 10).`, `m = ${tx(rengR)} g.`] },
    pistas: ['Formula el peróxido sin simplificar.', 'Formula el hidróxido.', 'Conserva el metal.']
  })
]
