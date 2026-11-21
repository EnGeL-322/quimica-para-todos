import { rengTx } from '../aprender/n1/gases/constantes'
import {
  RENG_ANIONES_NO, RENG_CATIONES_NO, RENG_HIDRATOS_NO, RENG_INTERPRETAR_NO, RENG_SALES_ACIDAS_NO, RENG_SALES_BASICAS_DIDACTICO, RENG_SALES_BASICAS_NO, RENG_TOL_NO_ENT,
  rengAnNo, rengAnionesNo, rengCruzarNo, rengDeNo, rengFHidratoNo, rengHAcidoNo, rengMNo, rengNMetalBasicaNo, rengNombreParNo, rengPracticaNo, rengTotalNo, rengTxtIonNo, rengTxtNo, type RengIonSimpleNo
} from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const M = rengMNo
const A = rengAnNo
const T = rengTxtNo
const tx = rengTx
const MW = (): number => M('H2O')
const OH = (): number => M('OH')
const r3 = (rengX: number): number => Math.round(rengX * 1000) / 1000

export interface RengParNo {
  c: RengIonSimpleNo
  a: RengIonSimpleNo
}

const RENG_TRIVALENTES = new Set(['Al', 'Cr'])
const rengParValido = (rengC: RengIonSimpleNo, rengA: RengIonSimpleNo): boolean => {
  if (rengC.s === 'NH4' && (rengA.s === 'O' || rengA.s === 'OH')) return false
  if (rengC.s === 'Sn' && rengTotalNo(rengA.s) > 1) return false
  if ((RENG_TRIVALENTES.has(rengC.s) || (rengC.s === 'Fe' && rengC.z === 3)) && rengA.s === 'CO3') return false
  return true
}

export const RENG_PARES_NO: readonly RengParNo[] = RENG_CATIONES_NO.flatMap((rengC) => RENG_ANIONES_NO.filter((rengA) => rengParValido(rengC, rengA)).map((rengA) => ({ c: rengC, a: rengA })))
export const RENG_PARES_POLI_NO: readonly RengParNo[] = RENG_PARES_NO.filter((rengP) => rengTotalNo(rengP.a.s) > 1)
export const RENG_PARES_OXO_NO: readonly RengParNo[] = RENG_PARES_POLI_NO.filter((rengP) => rengP.a.s !== 'OH')
export const rengFParNo = (rengP: RengParNo) => rengCruzarNo(rengP.c.s, rengP.c.z, rengP.a.s, rengP.a.z)
const RENG_PARES_DIDACTICO = 'Los pares de iones se combinan para practicar la electroneutralidad; no se comprobó que cada compuesto resultante exista o sea estable.'

export const RENG_BICARBONATOS_NO = RENG_SALES_ACIDAS_NO.filter((rengS) => rengS.f.includes('HCO3'))

export const RENG_PRACTICAS_B05_S15: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s15-p1', titulo: 'Masa fórmula de una sal ácida', dificultad: 'basica', unidad: 'g/mol',
    objetivo: 'Formular una sal ácida desde su nombre (hidrogeno-, dihidrogeno-) y calcular su masa fórmula.', seccion: '2.7', para: 'las sales ácidas',
    idealizado: 'Sal pura.', metodo: 'formulación desde el nombre con el núcleo', lista: RENG_SALES_ACIDAS_NO,
    respuesta: (s) => M(s.f),
    errores: (s) => [
      ['sal-neutra', 'Sal neutra', M(s.neutra), `Formulaste la sal neutra ${T(s.neutra)}; el prefijo hidrogeno- indica que el anión conserva hidrógeno.`],
      ['acido', 'Ácido de partida', M(s.acido), `Esa es la masa del ácido ${T(s.acido)}, no la de su sal.`]
    ],
    enunciado: (s) => `Un frasco contiene ${s.n}.`, pregunta: '¿Cuál es la masa fórmula de la sal, en g/mol?',
    datos: (s) => [['Nombre', s.n], ['Ácido de origen', T(s.acido)]],
    pasos: (s, _x, _y, rengR) => [`El anión conserva hidrógeno: ${T(s.f)}.`, `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Identifica el anión ácido.', 'Cada H conservado resta una carga.', 'Cruza las cargas.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s15-p2', titulo: 'Hidrógenos ácidos de una sal', dificultad: 'intermedia', unidad: 'mol',
    objetivo: 'Calcular los moles de hidrógeno ácido que contiene una masa de sal ácida.', seccion: '2.7', para: 'las sales ácidas',
    idealizado: 'Se cuentan solo los H del anión, no los del amonio.', metodo: 'formulación desde el nombre y recuento con el núcleo', lista: RENG_SALES_ACIDAS_NO, x: [1, 100, 0.5],
    respuesta: (s, x) => (x / M(s.f)) * rengHAcidoNo(s),
    errores: (s, x) => [
      ['moles-sal', 'Moles de sal', x / M(s.f), 'Esos son los moles de sal; multiplica por los H ácidos de cada fórmula.'],
      ['acido-completo', 'Todos los H del ácido', (x / M(s.f)) * rengAnionesNo(s) * s.hAcido, 'Contaste todos los hidrógenos del ácido de origen; la sal conserva solo algunos.']
    ],
    enunciado: (s, x) => `Se tienen ${tx(x)} g de ${s.n}.`, pregunta: '¿Cuántos moles de hidrógeno ácido (los del anión) contienen?',
    datos: (s, x) => [['Masa', `${tx(x)} g`], ['Nombre', s.n]],
    pasos: (s, x, _y, rengR) => [`Fórmula ${T(s.f)}: ${rengHAcidoNo(s)} H ácido(s) por fórmula.`, `n = ${tx(rengR)} mol.`],
    pistas: ['Formula la sal.', 'Cuenta los H del anión.', 'Multiplica por los moles.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s15-p3', titulo: 'Dióxido de carbono de un bicarbonato', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular el CO₂ que libera un hidrogenocarbonato al reaccionar con un ácido.', seccion: '2.7', para: 'las sales ácidas',
    idealizado: 'Reacción completa: cada HCO₃⁻ da un CO₂.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_BICARBONATOS_NO, x: [1, 100, 0.5],
    respuesta: (s, x) => (x / M(s.f)) * rengAnionesNo(s) * M('CO2'),
    errores: (s, x) => [
      ['masa-igual', 'Misma masa', x, 'La sal no se transforma entera en CO₂; solo el carbono y parte del oxígeno.'],
      ['como-carbonato', 'Como carbonato neutro', (x / M(s.neutra)) * rengDeNo(s.neutra, 'C') * M('CO2'), `Usaste la masa del carbonato neutro ${T(s.neutra)}; la sal es el hidrogenocarbonato.`]
    ],
    enunciado: (s, x) => `Se tratan ${tx(x)} g de ${s.n} con exceso de ácido clorhídrico.`, pregunta: '¿Qué masa de CO₂ se libera, en g?',
    datos: (s, x) => [['Sal', `${tx(x)} g`], ['Nombre', s.n]],
    pasos: (s, x, _y, rengR) => [`Fórmula ${T(s.f)}: ${rengAnionesNo(s)} HCO₃⁻ por fórmula.`, `m(CO₂) = ${tx(rengR)} g.`],
    pistas: ['Formula la sal.', 'Un CO₂ por HCO₃⁻.', 'Pasa a gramos.']
  })
]

export const RENG_PRACTICAS_B05_S16: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s16-p1', titulo: 'Masa fórmula de una sal básica', dificultad: 'basica', unidad: 'g/mol',
    objetivo: 'Calcular la masa fórmula de una sal básica contando los iones hidróxido y el otro anión.', seccion: '2.7', para: 'las sales básicas', nombres: false, sinVerificar: [RENG_SALES_BASICAS_DIDACTICO],
    idealizado: 'Sal básica de un solo metal.', metodo: 'masa molar del analizador de fórmulas del núcleo', lista: RENG_SALES_BASICAS_NO,
    respuesta: (s) => M(s.f),
    errores: (s) => [
      ['sin-oh', 'Sin los OH', M(s.f) - s.noh * OH(), 'Olvidaste los grupos OH: forman parte de la sal básica.'],
      ['sin-anion', 'Sin el otro anión', M(s.f) - s.nan * M(s.anion), 'Olvidaste el anión del ácido; la sal básica contiene OH⁻ y otro anión.']
    ],
    enunciado: (s) => `La sal básica «${s.n}» tiene la fórmula ${T(s.f)}.`, pregunta: '¿Cuál es su masa fórmula, en g/mol?',
    datos: (s) => [['Fórmula', T(s.f)], ['Iones', `${s.metal}, OH⁻ y ${T(s.anion)}`]],
    pasos: (s, _x, _y, rengR) => ['Suma metal, grupos OH y el otro anión.', `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Cuenta los OH.', 'Cuenta el otro anión.', 'Suma las masas.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s16-p2', titulo: 'Carga del metal en una sal básica', dificultad: 'intermedia', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Calcular la carga del metal en una sal básica con la electroneutralidad.', seccion: '2.6', para: 'la electroneutralidad', nombres: false, sinVerificar: [RENG_SALES_BASICAS_DIDACTICO],
    idealizado: 'Sal básica neutra.', metodo: 'suma de números de oxidación con el recuento del núcleo', lista: RENG_SALES_BASICAS_NO,
    respuesta: (s) => (s.noh + s.nan * s.za) / rengNMetalBasicaNo(s),
    errores: (s) => [
      ['sin-oh', 'Sin los OH', (s.nan * s.za) / rengNMetalBasicaNo(s), 'Los OH⁻ también tienen carga negativa: hay que contarlos.'],
      ['oh-doble', 'OH con carga −2', (2 * s.noh + s.nan * s.za) / rengNMetalBasicaNo(s), 'El ion hidróxido tiene carga −1, no −2.']
    ],
    enunciado: (s) => `En la sal básica ${T(s.f)} hay iones OH⁻ y ${T(s.anion)} (carga ${s.za}−).`, pregunta: '¿Con qué carga actúa el metal?',
    datos: (s) => [['Fórmula', T(s.f)], ['Aniones', `OH⁻ y ${T(s.anion)}`]],
    pasos: (s, _x, _y, rengR) => [`Carga negativa total: ${s.noh} + ${s.nan * s.za} = ${s.noh + s.nan * s.za}.`, `Por átomo de metal: +${tx(rengR)}.`],
    pistas: ['Suma las cargas negativas.', 'Cuenta los átomos de metal.', 'Divide para obtener el resultado.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s16-p3', titulo: 'Metal en una sal básica', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular la masa de metal de una muestra de sal básica.', seccion: '2.7', para: 'las sales básicas', nombres: false, sinVerificar: [RENG_SALES_BASICAS_DIDACTICO],
    idealizado: 'Sal pura.', metodo: 'masa molar del analizador de fórmulas del núcleo', lista: RENG_SALES_BASICAS_NO, x: [1, 100, 0.5],
    valida: (s) => Math.abs((rengNMetalBasicaNo(s) * A(s.metal)) / M(s.f) - 0.5) > 0.03,
    respuesta: (s, x) => (x * rengNMetalBasicaNo(s) * A(s.metal)) / M(s.f),
    errores: (s, x) => [
      ['sin-oh', 'Masa sin los OH', (x * rengNMetalBasicaNo(s) * A(s.metal)) / (M(s.f) - s.noh * OH()), 'Calculaste la masa fórmula sin los OH; forman parte de la sal.'],
      ['resto', 'Masa de los aniones', (x * (M(s.f) - rengNMetalBasicaNo(s) * A(s.metal))) / M(s.f), 'Calculaste la masa de los aniones, no la del metal.']
    ],
    enunciado: (s, x) => `Una muestra contiene ${tx(x)} g de ${T(s.f)}.`, pregunta: '¿Qué masa de metal contiene, en g?',
    datos: (s, x) => [['Muestra', `${tx(x)} g`], ['Fórmula', T(s.f)]],
    pasos: (s, x, _y, rengR) => [`Fracción de ${s.metal}: ${tx((rengNMetalBasicaNo(s) * A(s.metal)) / M(s.f), 4)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Calcula la masa fórmula completa.', 'Calcula la fracción del metal.', 'Multiplica para obtener la masa.']
  })
]

export const RENG_PRACTICAS_B05_S17: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s17-p1', titulo: 'Agua de un hidrato', dificultad: 'basica', unidad: 'g',
    objetivo: 'Calcular la masa de agua de hidratación que contiene una muestra de hidrato.', seccion: '2.7', para: 'los hidratos',
    idealizado: 'Hidrato puro.', metodo: 'formulación desde el nombre del hidrato y masas del núcleo', lista: RENG_HIDRATOS_NO, x: [1, 100, 0.5],
    respuesta: (h, x) => (x * h.agua * MW()) / M(rengFHidratoNo(h)),
    errores: (h, x) => [
      ['sin-n', 'Una sola molécula de agua', (x * MW()) / M(rengFHidratoNo(h)), `El prefijo indica ${h.agua} moléculas de agua por fórmula.`],
      ['sobre-anhidra', 'Dividir entre la sal anhidra', (x * h.agua * MW()) / M(h.sal), 'La masa fórmula del hidrato incluye el agua.']
    ],
    enunciado: (h, x) => `Se tienen ${tx(x)} g de ${h.n}.`, pregunta: '¿Qué masa de agua de hidratación contienen, en g?',
    datos: (h, x) => [['Muestra', `${tx(x)} g`], ['Nombre', h.n]],
    pasos: (h, x, _y, rengR) => [`Fórmula ${T(rengFHidratoNo(h))}, M = ${tx(M(rengFHidratoNo(h)), 5)} g/mol.`, `m(agua) = ${tx(rengR)} g.`],
    pistas: ['Lee el prefijo.', 'Calcula la masa del hidrato.', 'Calcula la fracción de agua.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s17-p2', titulo: 'Moléculas de agua de un hidrato', dificultad: 'intermedia', unidad: '',
    objetivo: 'Determinar el número de moléculas de agua de un hidrato a partir de la pérdida de masa al calentarlo.', seccion: '2.7', para: 'los hidratos',
    idealizado: 'Se pierde toda el agua sin descomponer la sal.', metodo: 'búsqueda por bisección de n que reproduce la masa del hidrato', lista: RENG_HIDRATOS_NO, x: [1, 10, 0.01],
    respuesta: (h, x) => { const rengA = r3((x * M(h.sal)) / M(rengFHidratoNo(h))); return ((x - rengA) / MW()) / (rengA / M(h.sal)) },
    errores: (h, x) => {
      const rengA = r3((x * M(h.sal)) / M(rengFHidratoNo(h)))
      return [
        ['sin-moles', 'Cociente de masas', (x - rengA) / rengA, 'Dividiste masas; n es un cociente de moles de agua y de sal.'],
        ['sobre-hidrato', 'Moles del hidrato', ((x - rengA) / MW()) / (x / M(h.sal)), 'Calculaste los moles de sal con la masa del hidrato; usa la masa anhidra.']
      ]
    },
    enunciado: (h, x) => `Al calentar ${tx(x, 4)} g de un hidrato de ${T(h.sal)} quedan ${tx(r3((x * M(h.sal)) / M(rengFHidratoNo(h))), 4)} g de sal anhidra.`, pregunta: '¿Cuántas moléculas de agua hay por fórmula de sal?',
    datos: (h, x) => [['Hidrato', `${tx(x, 4)} g`], ['Anhidra', `${tx(r3((x * M(h.sal)) / M(rengFHidratoNo(h))), 4)} g`], [`M(${T(h.sal)})`, `${tx(M(h.sal), 5)} g/mol`]],
    pasos: (_h, _x, _y, rengR) => ['Agua perdida = hidrato − anhidra; pásala a moles y la sal también.', `n = ${tx(rengR)} (redondea al entero más próximo).`],
    pistas: ['Calcula el agua perdida.', 'Pasa agua y sal a moles.', 'Divide moles de agua entre moles de sal.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s17-p3', titulo: 'Hidrato para preparar una disolución', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular la masa de hidrato que hay que pesar para preparar una disolución de concentración dada.', seccion: '2.7', para: 'los hidratos',
    idealizado: 'Disolución exacta.', metodo: 'formulación desde el nombre del hidrato y masas del núcleo', lista: RENG_HIDRATOS_NO, x: [50, 1000, 10], y: [0.01, 1, 0.01],
    respuesta: (h, x, y) => (x / 1000) * y * M(rengFHidratoNo(h)),
    errores: (h, x, y) => [
      ['anhidra', 'Masa de la sal anhidra', (x / 1000) * y * M(h.sal), 'Se pesa el hidrato: su masa fórmula incluye el agua.'],
      ['ml', 'Volumen en mL', x * y * M(rengFHidratoNo(h)), 'La concentración está en mol/L: pasa los mL a litros.']
    ],
    enunciado: (h, x, y) => `Se quieren preparar ${tx(x)} mL de disolución ${tx(y)} mol/L de ${T(h.sal)} usando ${h.n}.`, pregunta: '¿Qué masa de hidrato hay que pesar, en g?',
    datos: (h, x, y) => [['Volumen', `${tx(x)} mL`], ['Concentración', `${tx(y)} mol/L`], ['Reactivo', h.n]],
    pasos: (h, x, y, rengR) => [`n = ${tx((x / 1000) * y)} mol; M(${T(rengFHidratoNo(h))}) = ${tx(M(rengFHidratoNo(h)), 5)} g/mol.`, `m = ${tx(rengR)} g.`],
    pistas: ['Calcula los moles.', 'Usa la masa del hidrato.', 'Pasa los mL a litros.']
  })
]

export const RENG_PRACTICAS_B05_S18: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s18-p1', titulo: 'Iones por fórmula', dificultad: 'basica', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Escribir la fórmula mínima de un compuesto iónico y contar los iones de cada fórmula.', seccion: '2.6', para: 'la electroneutralidad', nombres: false, sinVerificar: [RENG_PARES_DIDACTICO],
    idealizado: 'Compuesto iónico neutro.', metodo: 'fórmula construida y analizada con el núcleo', lista: RENG_PARES_NO,
    respuesta: (p) => rengFParNo(p).nc + rengFParNo(p).na,
    errores: (p) => [
      ['solo-aniones', 'Solo los aniones', rengFParNo(p).na, 'Contaste solo los aniones; suma también los cationes.'],
      ['sin-cruzar', 'Un ion de cada', 2, 'Con cargas distintas no basta un ion de cada: hay que cruzarlas.']
    ],
    enunciado: (p) => `Se combinan el catión ${rengTxtIonNo(p.c, '+')} y el anión ${rengTxtIonNo(p.a, '−')}.`, pregunta: '¿Cuántos iones hay en una fórmula mínima del compuesto?',
    datos: (p) => [['Catión', rengTxtIonNo(p.c, '+')], ['Anión', rengTxtIonNo(p.a, '−')]],
    pasos: (p, _x, _y, rengR) => [`Cargas cruzadas y simplificadas: ${T(rengFParNo(p).f)}.`, `Iones: ${rengFParNo(p).nc} + ${rengFParNo(p).na} = ${tx(rengR)}.`],
    pistas: ['Cruza las cargas.', 'Simplifica.', 'Suma cationes y aniones.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s18-p2', titulo: 'Masa fórmula con un ion poliatómico', dificultad: 'intermedia', unidad: 'g/mol',
    objetivo: 'Escribir la fórmula con paréntesis de un compuesto con ion poliatómico y calcular su masa fórmula.', seccion: '2.6', para: 'la escritura de fórmulas', nombres: false, sinVerificar: [RENG_PARES_DIDACTICO],
    idealizado: 'Compuesto iónico neutro.', metodo: 'fórmula construida y analizada con el núcleo', lista: RENG_PARES_POLI_NO,
    respuesta: (p) => M(rengFParNo(p).f),
    errores: (p) => [
      ['un-anion', 'Un solo anión', rengFParNo(p).nc * M(p.c.s) + M(p.a.s), 'Olvidaste el subíndice del paréntesis: el ion poliatómico se repite.'],
      ['sin-cruzar', 'Un ion de cada', M(p.c.s) + M(p.a.s), 'Con cargas distintas no basta un ion de cada: cruza las cargas.']
    ],
    enunciado: (p) => `Se combinan ${rengTxtIonNo(p.c, '+')} y ${rengTxtIonNo(p.a, '−')}.`, pregunta: '¿Cuál es la masa fórmula del compuesto, en g/mol?',
    datos: (p) => [['Catión', rengTxtIonNo(p.c, '+')], ['Anión', rengTxtIonNo(p.a, '−')]],
    pasos: (p, _x, _y, rengR) => [`Fórmula ${T(rengFParNo(p).f)}.`, `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Cruza las cargas.', 'Pon paréntesis si se repite.', 'Suma las masas.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s18-p3', titulo: 'Átomos de una fórmula iónica', dificultad: 'avanzada', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Contar los átomos de una fórmula iónica con paréntesis construida desde sus iones.', seccion: '2.4', para: 'la escritura de fórmulas', nombres: false, sinVerificar: [RENG_PARES_DIDACTICO],
    idealizado: 'Compuesto iónico neutro.', metodo: 'fórmula construida y analizada con el núcleo', lista: RENG_PARES_POLI_NO,
    respuesta: (p) => rengTotalNo(rengFParNo(p).f),
    errores: (p) => [
      ['un-anion', 'Un solo anión', rengFParNo(p).nc * rengTotalNo(p.c.s) + rengTotalNo(p.a.s), 'Olvidaste que el subíndice del paréntesis repite todo el ion poliatómico.'],
      ['sin-cruzar', 'Un ion de cada', rengTotalNo(p.c.s) + rengTotalNo(p.a.s), 'Con cargas distintas no basta un ion de cada: cruza las cargas.']
    ],
    enunciado: (p) => `Se combinan ${rengTxtIonNo(p.c, '+')} y ${rengTxtIonNo(p.a, '−')} en un compuesto neutro.`, pregunta: '¿Cuántos átomos hay en una fórmula mínima?',
    datos: (p) => [['Catión', rengTxtIonNo(p.c, '+')], ['Anión', rengTxtIonNo(p.a, '−')]],
    pasos: (p, _x, _y, rengR) => [`Fórmula ${T(rengFParNo(p).f)}.`, `Átomos: ${tx(rengR)}.`],
    pistas: ['Escribe la fórmula.', 'Desarrolla el paréntesis.', 'Suma todos los átomos.']
  })
]

export const RENG_PRACTICAS_B05_S19: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s19-p1', titulo: 'Oxígenos de una sal formulada', dificultad: 'basica', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Formular una sal a partir del nombre de sus iones y contar sus oxígenos.', seccion: '2.7', para: 'la formulación', nombres: false, sinVerificar: [RENG_PARES_DIDACTICO],
    idealizado: 'Compuesto iónico neutro.', metodo: 'fórmula construida y analizada con el núcleo', lista: RENG_PARES_OXO_NO,
    respuesta: (p) => rengDeNo(rengFParNo(p).f, 'O'),
    errores: (p) => [
      ['un-anion', 'Un solo oxoanión', rengDeNo(p.a.s, 'O'), 'El oxoanión se repite tantas veces como indica su subíndice.'],
      ['subindice-cation', 'Subíndice del catión', rengFParNo(p).nc * rengDeNo(p.a.s, 'O'), 'Usaste el subíndice del catión; el que multiplica al oxoanión es el suyo propio.']
    ],
    enunciado: (p) => `Formula el compuesto «${rengNombreParNo(p.c, p.a)}».`, pregunta: '¿Cuántos átomos de oxígeno hay en una fórmula?',
    datos: (p) => [['Nombre', rengNombreParNo(p.c, p.a)], ['Iones', `${rengTxtIonNo(p.c, '+')} y ${rengTxtIonNo(p.a, '−')}`]],
    pasos: (p, _x, _y, rengR) => [`Fórmula ${T(rengFParNo(p).f)}.`, `O = ${tx(rengR)}.`],
    pistas: ['Identifica los iones.', 'Cruza las cargas.', 'Multiplica los oxígenos.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s19-p2', titulo: 'Catión en una muestra', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Formular un compuesto desde su nombre y calcular la masa del catión en una muestra.', seccion: '2.7', para: 'la formulación', nombres: false, sinVerificar: [RENG_PARES_DIDACTICO],
    idealizado: 'Compuesto puro.', metodo: 'fórmula construida y analizada con el núcleo', lista: RENG_PARES_NO, x: [1, 200, 0.5],
    valida: (p) => Math.abs((rengFParNo(p).nc * M(p.c.s)) / M(rengFParNo(p).f) - 0.5) > 0.03,
    respuesta: (p, x) => (x * rengFParNo(p).nc * M(p.c.s)) / M(rengFParNo(p).f),
    errores: (p, x) => [
      ['sin-cruzar', 'Fórmula 1:1', (x * M(p.c.s)) / (M(p.c.s) + M(p.a.s)), 'Supusiste un ion de cada; cruza las cargas.'],
      ['resto', 'Masa del anión', (x * (M(rengFParNo(p).f) - rengFParNo(p).nc * M(p.c.s))) / M(rengFParNo(p).f), 'Calculaste la masa del anión, no la del catión.']
    ],
    enunciado: (p, x) => `Se tienen ${tx(x)} g de ${rengNombreParNo(p.c, p.a)}.`, pregunta: '¿Qué masa del catión contienen, en g?',
    datos: (p, x) => [['Muestra', `${tx(x)} g`], ['Nombre', rengNombreParNo(p.c, p.a)]],
    pasos: (p, x, _y, rengR) => [`Fórmula ${T(rengFParNo(p).f)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Formula el compuesto.', 'Calcula la fracción del catión.', 'Multiplica para obtener la masa.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s19-p3', titulo: 'Compuesto que aporta un anión', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular la masa de compuesto que contiene una masa dada de su anión.', seccion: '2.7', para: 'la formulación', nombres: false, sinVerificar: [RENG_PARES_DIDACTICO],
    idealizado: 'Compuesto puro.', metodo: 'fórmula construida y analizada con el núcleo', lista: RENG_PARES_POLI_NO, x: [1, 100, 0.5],
    respuesta: (p, x) => (x * M(rengFParNo(p).f)) / (rengFParNo(p).na * M(p.a.s)),
    errores: (p, x) => [
      ['sin-dividir', 'Un solo anión', (x * M(rengFParNo(p).f)) / M(p.a.s), 'La fórmula tiene varios aniones: divide entre su subíndice.'],
      ['masa-igual', 'Misma masa', x, 'El compuesto pesa más que el anión que contiene.']
    ],
    enunciado: (p, x) => `Se necesitan ${tx(x)} g del ion ${rengTxtIonNo(p.a, '−')} aportados por ${rengNombreParNo(p.c, p.a)}.`, pregunta: '¿Qué masa del compuesto hay que pesar, en g?',
    datos: (p, x) => [['Anión', `${tx(x)} g`], ['Compuesto', rengNombreParNo(p.c, p.a)]],
    pasos: (p, x, _y, rengR) => [`Fórmula ${T(rengFParNo(p).f)}: ${rengFParNo(p).na} anión(es).`, `m = ${tx(rengR)} g.`],
    pistas: ['Formula el compuesto.', 'Calcula la fracción del anión.', 'Divide la masa entre ella.']
  })
]

export const RENG_PRACTICAS_B05_S20: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s20-p1', titulo: 'Elemento en un producto etiquetado', dificultad: 'basica', unidad: 'g',
    objetivo: 'Interpretar el nombre de un producto para calcular la masa de un elemento que contiene.', seccion: '2.7', para: 'la interpretación de nombres',
    idealizado: 'Producto puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_INTERPRETAR_NO, x: [10, 1000, 10],
    valida: (e) => Math.abs((rengDeNo(e.f, e.el) * A(e.el)) / M(e.f) - 0.5) > 0.03,
    respuesta: (e, x) => (x * rengDeNo(e.f, e.el) * A(e.el)) / M(e.f),
    errores: (e, x) => [
      ['sin-subindice', 'Sin el subíndice', (x * A(e.el)) / M(e.f), `La fórmula contiene ${rengDeNo(e.f, e.el)} átomos de ${e.el}.`],
      ['resto', 'Masa del resto', (x * (M(e.f) - rengDeNo(e.f, e.el) * A(e.el))) / M(e.f), `Calculaste la masa de lo que no es ${e.el}.`]
    ],
    enunciado: (e, x) => `Un envase contiene ${tx(x)} g de ${e.n}.`, pregunta: '¿Qué masa del elemento indicado contiene, en g?',
    datos: (e, x) => [['Producto', `${tx(x)} g de ${e.n}`], ['Elemento', e.el]],
    pasos: (e, x, _y, rengR) => [`Fórmula ${T(e.f)}.`, `m(${e.el}) = ${tx(rengR)} g.`],
    pistas: ['Escribe la fórmula del nombre.', 'Calcula la fracción del elemento.', 'Multiplica para obtener la masa.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s20-p2', titulo: 'Moles desde una etiqueta', dificultad: 'intermedia', unidad: 'mol',
    objetivo: 'Pasar del nombre de un compuesto a su masa fórmula para calcular los moles de una muestra.', seccion: '2.7', para: 'la interpretación de nombres',
    idealizado: 'Producto puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_INTERPRETAR_NO, x: [1, 500, 0.5],
    respuesta: (e, x) => x / M(e.f),
    errores: (e, x) => [
      ['atomica', 'Masa del elemento', x / A(e.el), 'Dividiste entre la masa atómica de un elemento; hay que usar la masa fórmula del compuesto.'],
      ['por-elemento', 'Moles de átomos', (x / M(e.f)) * rengDeNo(e.f, e.el), 'Esos son moles de átomos de un elemento; la pregunta pide moles de compuesto.']
    ],
    enunciado: (e, x) => `Se pesan ${tx(x)} g de ${e.n}.`, pregunta: '¿Cuántos moles de compuesto son?',
    datos: (e, x) => [['Masa', `${tx(x)} g`], ['Nombre', e.n]],
    pasos: (e, x, _y, rengR) => [`Fórmula ${T(e.f)}, M = ${tx(M(e.f), 5)} g/mol.`, `n = ${tx(rengR)} mol.`],
    pistas: ['Escribe la fórmula.', 'Calcula la masa fórmula.', 'Divide para obtener el resultado.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s20-p3', titulo: 'Producto para aportar un elemento', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular la masa de producto necesaria para aportar una masa dada de un elemento.', seccion: '2.7', para: 'la interpretación de nombres',
    idealizado: 'Producto puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_INTERPRETAR_NO, x: [1, 200, 0.5],
    respuesta: (e, x) => (x * M(e.f)) / (rengDeNo(e.f, e.el) * A(e.el)),
    errores: (e, x) => [
      ['sin-subindice', 'Sin el subíndice', (x * M(e.f)) / A(e.el), `Cada fórmula aporta ${rengDeNo(e.f, e.el)} átomos de ${e.el}.`],
      ['invertida', 'Fracción invertida', (x * rengDeNo(e.f, e.el) * A(e.el)) / M(e.f), 'Multiplicaste por la fracción del elemento; hay que dividir: el producto pesa más.']
    ],
    enunciado: (e, x) => `Se quieren aportar ${tx(x)} g de ${e.el} usando ${e.n}.`, pregunta: '¿Qué masa de producto hay que usar, en g?',
    datos: (e, x) => [['Elemento', `${tx(x)} g de ${e.el}`], ['Producto', e.n]],
    pasos: (e, x, _y, rengR) => [`Fórmula ${T(e.f)}; fracción de ${e.el}: ${tx((rengDeNo(e.f, e.el) * A(e.el)) / M(e.f), 4)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Escribe la fórmula.', 'Calcula la fracción del elemento.', 'Divide para obtener el resultado.']
  })
]
