import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_AE_KJ, RENG_EI_KJ, RENG_RADIO_ION_PM } from '../escenas-n1/modelos/tendencias-periodicas'
import { RENG_ELEMENTOS } from '../../tabla-periodica/data'
import {
  RENG_PARES_GRUPO_TP, RENG_PARES_PERIODO_TP, RENG_REPRESENTATIVOS_TP, RENG_TOL_TP_ENT, RENG_VM_TP, rengATp, rengGrupoTp, rengNombreTp, rengPeriodoTp, rengPracticaTp, rengRadioTp, rengValenciaTp, rengZTp
} from './b03-comun'
import { rengCargaAt, rengNuclidoAt } from './b02-comun'
import { rengDeNo, rengMNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const M = rengMNo
const A = rengATp
const E = RENG_TOL_TP_ENT
export const RENG_ALCALINOTERREOS_TP: readonly string[] = ['Be', 'Mg', 'Ca', 'Sr', 'Ba']
export const RENG_HALOGENOS_TP: readonly string[] = ['F', 'Cl', 'Br', 'I']
export const RENG_SALES_TP: ReadonlyArray<readonly [string, string]> = ['Li', 'Na', 'K', 'Mg', 'Ca'].flatMap((m) => RENG_HALOGENOS_TP.map((x) => [m, x] as const))
export const rengSalTp = (rengM: string, rengX: string): string => (rengM === 'Mg' || rengM === 'Ca' ? `${rengM}${rengX}2` : `${rengM}${rengX}`)
export const RENG_DESPLAZAMIENTOS_TP: ReadonlyArray<readonly [string, string]> = [['Cl', 'Br'], ['Cl', 'I'], ['Br', 'I']]
export const RENG_GASES_NOBLES_TP: readonly string[] = ['He', 'Ne', 'Ar', 'Kr', 'Xe']
export const RENG_COMPUESTOS_TRANSICION_TP: ReadonlyArray<readonly [string, string, string, number]> = [
  ['Fe', 'FeCl3', 'Cl', 1], ['Fe', 'Fe2O3', 'O', 2], ['Cu', 'Cu2O', 'O', 2], ['Mn', 'MnO2', 'O', 2], ['Cr', 'Cr2O3', 'O', 2], ['Cr', 'CrO3', 'O', 2], ['Ti', 'TiO2', 'O', 2], ['V', 'V2O5', 'O', 2], ['Co', 'CoCl2', 'Cl', 1],
  ['Mn', 'Mn2O7', 'O', 2], ['Cu', 'CuCl2', 'Cl', 1], ['Ti', 'TiCl4', 'Cl', 1], ['Sc', 'ScCl3', 'Cl', 1], ['V', 'VCl3', 'Cl', 1], ['Cr', 'CrCl3', 'Cl', 1], ['Mn', 'MnCl2', 'Cl', 1], ['Ni', 'NiCl2', 'Cl', 1], ['Co', 'Co2O3', 'O', 2],
  ['Cu', 'Cu2S', 'S', 2], ['Fe', 'FeCl2', 'Cl', 1]
]
export const rengEoTp = (rengMetal: string, rengF: string, rengAnion: string, rengQ: number): number => (rengDeNo(rengF, rengAnion) * rengQ) / rengDeNo(rengF, rengMetal)
export const RENG_MINERALES_TP: ReadonlyArray<readonly [string, string, string]> = [
  ['Fe', 'Fe2O3', 'hematita'], ['Fe', 'Fe3O4', 'magnetita'], ['Ti', 'TiO2', 'rutilo'], ['Mn', 'MnO2', 'pirolusita'], ['Cr', 'Cr2O3', 'óxido de cromo(III)'], ['Cu', 'Cu2O', 'cuprita'], ['Cu', 'CuO', 'tenorita'], ['Zn', 'ZnO', 'cincita'],
  ['Ni', 'NiO', 'óxido de níquel(II)'], ['Cu', 'Cu2S', 'calcosina'], ['Zn', 'ZnS', 'esfalerita'], ['Fe', 'FeS2', 'pirita'], ['Ag', 'Ag2S', 'argentita'], ['Hg', 'HgS', 'cinabrio'], ['Fe', 'FeCO3', 'siderita'], ['Mn', 'MnCO3', 'rodocrosita']
]
export const RENG_LANTANIDOS_TP: readonly string[] = RENG_ELEMENTOS.filter((rengE) => rengE.categoria === 'lantanido').map((rengE) => rengE.simbolo)
export const RENG_LANTANIDOS_OXIDO_TP: readonly string[] = ['La', 'Pr', 'Nd', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu']
export const RENG_ACTINIDOS_TP: ReadonlyArray<readonly [string, number]> = [['Th', 232], ['U', 235], ['U', 238], ['Pu', 239], ['Am', 241], ['Np', 237], ['Pa', 231], ['Cm', 244], ['Cf', 252], ['Pu', 238], ['U', 233], ['Th', 230], ['Ac', 227], ['Pu', 240], ['Am', 243]]
export const RENG_IONES_RADIO_TP: readonly string[] = Object.keys(RENG_RADIO_ION_PM)
export const rengIonTp = (rengS: string): string => `${rengS}${rengCargaAt(RENG_RADIO_ION_PM[rengS]![0])}`
const rIon = (rengS: string): number => RENG_RADIO_ION_PM[rengS]![1]
const eIon = (rengS: string): number => rengZTp(rengS) - RENG_RADIO_ION_PM[rengS]![0]
export const RENG_ISOELECTRONICOS_TP: ReadonlyArray<readonly [string, string]> = RENG_IONES_RADIO_TP.flatMap((rengA) => RENG_IONES_RADIO_TP.filter((rengB) => eIon(rengA) === eIon(rengB) && rIon(rengA) > rIon(rengB)).map((rengB) => [rengA, rengB] as const))
const fracMetal = (rengS: string, rengF: string): number => (rengDeNo(rengF, rengS) * A(rengS)) / M(rengF)

export const RENG_PRACTICAS_B03_S09: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s9-p1', titulo: 'Óxido de un alcalinotérreo', unidad: 'g',
    objetivo: 'Calcular la masa de óxido MO que forma un metal alcalinotérreo al arder.', seccion: '18.1', para: 'los metales alcalinotérreos', masas: true,
    idealizado: 'Combustión completa con oxígeno en exceso.', metodo: 'masas molares del núcleo', lista: RENG_ALCALINOTERREOS_TP, x: [1, 60, 0.5],
    respuesta: (s, x) => (x / A(s)) * M(`${s}O`),
    errores: (s, x) => [
      ['solo-oxigeno', 'Solo el oxígeno', (x / A(s)) * A('O'), 'Esa es la masa de oxígeno incorporada; el óxido incluye también el metal.'],
      ['m2o', 'Fórmula M₂O', (x / A(s) / 2) * M(`${s}2O`), 'Usaste la fórmula de un alcalino (M₂O); los alcalinotérreos forman iones 2+ y óxidos MO.']
    ],
    enunciado: (s, x) => `Arden ${tx(x)} g de ${rengNombreTp(s)} en oxígeno: 2 ${s} + O₂ → 2 ${s}O.`,
    pregunta: (s) => `¿Qué masa de ${s}O se forma, en g?`,
    datos: (s, x) => [['Metal', `${tx(x)} g de ${s}`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], [`M(${s}O)`, `${tx(M(`${s}O`), 5)} g/mol`]],
    pasos: (s, x, _y, rengR) => [`n(${s}) = ${tx(x / A(s))} mol = n(${s}O).`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa el metal a moles.', 'La proporción con el óxido es 1 : 1.', 'Multiplica por su masa molar.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s9-p2', titulo: 'Hidrógeno con un ácido', unidad: 'L',
    objetivo: 'Calcular el volumen de hidrógeno que desprende un alcalinotérreo al reaccionar con un ácido.', seccion: '18.1', para: 'los metales alcalinotérreos', masas: true,
    idealizado: 'Reacción completa; gas ideal a 0 °C y 1 atm.', metodo: 'ecuación de los gases ideales', sinVerificar: ['El volumen molar normal de 22,414 L/mol es un valor de uso común recordado.'], lista: RENG_ALCALINOTERREOS_TP, x: [1, 60, 0.5],
    respuesta: (s, x) => (x / A(s)) * RENG_VM_TP,
    errores: (s, x) => [
      ['mitad', 'Como un alcalino', (x / A(s) / 2) * RENG_VM_TP, 'Usaste la proporción de los alcalinos (2 : 1); cada átomo de alcalinotérreo cede dos electrones y da una molécula de H₂.'],
      ['doble', 'Dos H₂ por átomo', (x / A(s)) * 2 * RENG_VM_TP, 'Los dos HCl dan una sola molécula de H₂ por cada átomo de metal.']
    ],
    enunciado: (s, x) => `Reaccionan ${tx(x)} g de ${rengNombreTp(s)} con ácido clorhídrico en exceso: ${s} + 2 HCl → ${s}Cl₂ + H₂.`,
    pregunta: '¿Qué volumen de hidrógeno se desprende a 0 °C y 1 atm, en L?',
    datos: (s, x) => [['Metal', `${tx(x)} g de ${s}`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], ['Volumen molar', '22,414 L/mol']],
    pasos: (s, x, _y, rengR) => [`n(${s}) = ${tx(x / A(s))} mol = n(H₂).`, `V = n × 22,414 = ${tx(rengR)} L.`],
    pistas: ['Pasa el metal a moles.', 'La proporción con el H₂ es 1 : 1.', 'Multiplica por el volumen molar.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s9-p3', titulo: 'Carga de los iones de un alcalinotérreo', unidad: 'C',
    objetivo: 'Calcular la carga total de los iones 2+ que forma una masa de alcalinotérreo.', seccion: '18.1', para: 'los metales alcalinotérreos', masas: true, particulas: true,
    idealizado: 'Todos los átomos forman iones 2+.', metodo: 'producto e·N_A calculado aparte', lista: RENG_ALCALINOTERREOS_TP, x: [0.1, 5, 0.1],
    respuesta: (s, x) => (x / A(s)) * 2 * 96485.33,
    errores: (s, x) => [
      ['sin-carga', 'Como iones 1+', (x / A(s)) * 96485.33, 'Cada ion lleva dos cargas elementales: es un ion 2+.'],
      ['sin-faraday', 'Sin la constante de Faraday', (x / A(s)) * 2, 'Esos son los moles de carga; multiplícalos por 96 485 C/mol.']
    ],
    enunciado: (s, x) => `Se disuelven ${tx(x)} g de ${rengNombreTp(s)} formando iones ${s}²⁺. Un mol de cargas elementales equivale a 96 485 C.`,
    pregunta: '¿Qué carga positiva total tienen esos iones, en C?',
    datos: (s, x) => [['Masa', `${tx(x)} g de ${s}`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], ['Faraday', '96 485 C/mol']],
    pasos: (s, x, _y, rengR) => [`n(${s}²⁺) = ${tx(x / A(s))} mol; cada ion lleva 2 cargas.`, `Q = n × 2 × 96 485 = ${tx(rengR)} C.`],
    pistas: ['Pasa el metal a moles.', 'Cada ion lleva dos cargas.', 'Multiplica por 96 485 C/mol.']
  })
]

export const RENG_PRACTICAS_B03_S10: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s10-p1', titulo: 'Sal a partir de un halógeno', unidad: 'g',
    objetivo: 'Calcular la masa de haluro que se forma a partir de una masa de halógeno diatómico.', seccion: '18.1', para: 'los halógenos', masas: true,
    idealizado: 'Reacción completa con el metal en exceso.', metodo: 'masas molares del núcleo', lista: RENG_SALES_TP, x: [1, 80, 0.5],
    respuesta: ([m, h], x) => { const f = rengSalTp(m, h); return ((x / (2 * A(h))) * 2 * M(f)) / rengDeNo(f, h) },
    errores: (_e, _x, _y, rengR) => [
      ['atomico', 'Halógeno como átomos', rengR * 2, 'Los halógenos son moléculas diatómicas: la masa molar del halógeno es el doble de la atómica.'],
      ['mitad', 'Mitad de sal', rengR / 2, 'Cada molécula X₂ aporta dos átomos de halógeno: revisa la proporción con la sal.']
    ],
    enunciado: ([m, h], x) => `Reaccionan ${tx(x)} g de ${T(`${h}2`)} con ${rengNombreTp(m)} en exceso y se forma ${T(rengSalTp(m, h))}.`,
    pregunta: ([m, h]) => `¿Qué masa de ${T(rengSalTp(m, h))} se obtiene, en g?`,
    datos: ([m, h], x) => [['Halógeno', `${tx(x)} g de ${T(`${h}2`)}`], [`M(${T(`${h}2`)})`, `${tx(2 * A(h), 5)} g/mol`], [`M(${T(rengSalTp(m, h))})`, `${tx(M(rengSalTp(m, h)), 5)} g/mol`]],
    pasos: ([m, h], x, _y, rengR) => [`n(${T(`${h}2`)}) = ${tx(x / (2 * A(h)))} mol, con ${tx((2 * x) / (2 * A(h)))} mol de átomos de ${h}.`, `m(${T(rengSalTp(m, h))}) = ${tx(rengR)} g.`],
    pistas: ['Pasa el halógeno a moles de X₂.', 'Cuenta los átomos de halógeno.', 'Repártelos según la fórmula.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s10-p2', titulo: 'Desplazamiento entre halógenos', unidad: 'g',
    objetivo: 'Calcular el halógeno que se libera cuando otro más reactivo lo desplaza de su sal.', seccion: '18.1', para: 'la reactividad de los halógenos', masas: true,
    idealizado: 'Reacción completa con la sal en exceso.', metodo: 'masas molares del núcleo', lista: RENG_DESPLAZAMIENTOS_TP, x: [1, 80, 0.5],
    respuesta: ([a, b], x) => (x * A(b)) / A(a),
    errores: ([a, b], x, _y, rengR) => [
      ['inversa', 'Proporción invertida', (x * A(a)) / A(b), 'Invertiste las masas molares: la del halógeno liberado va en el numerador.'],
      ['doble', 'Dos moléculas', rengR * 2, 'Cada molécula del halógeno reactivo libera una sola molécula del otro.']
    ],
    enunciado: ([a, b], x) => `El ${rengNombreTp(a)} desplaza al ${rengNombreTp(b)} de sus sales: ${T(`${a}2`)} + 2 K${b} → 2 K${a} + ${T(`${b}2`)}. Reaccionan ${tx(x)} g de ${T(`${a}2`)}.`,
    pregunta: ([, b]) => `¿Qué masa de ${T(`${b}2`)} se libera, en g?`,
    datos: ([a, b], x) => [['Reactivo', `${tx(x)} g de ${T(`${a}2`)}`], ['Masas molares', `${T(`${a}2`)} ${tx(2 * A(a), 5)}; ${T(`${b}2`)} ${tx(2 * A(b), 5)} g/mol`]],
    pasos: ([a, b], x, _y, rengR) => [`n(${T(`${a}2`)}) = ${tx(x / (2 * A(a)))} mol = n(${T(`${b}2`)}).`, `m(${T(`${b}2`)}) = ${tx(rengR)} g.`],
    pistas: ['Pasa el reactivo a moles.', 'La proporción es 1 : 1.', 'Multiplica por la masa molar del producto.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s10-p3', titulo: 'Energía al formar haluros', unidad: 'kJ',
    objetivo: 'Calcular la energía que liberan los átomos de un halógeno al captar un electrón.', seccion: '6.5', para: 'la afinidad electrónica de los halógenos', masas: true, tendencias: true,
    idealizado: 'Átomos gaseosos aislados.', metodo: 'tabla de datos de la escena', lista: RENG_HALOGENOS_TP, x: [1, 80, 0.5],
    respuesta: (s, x) => (x / A(s)) * RENG_AE_KJ[s]!,
    errores: (s, x) => [
      ['sin-moles', 'Sin pasar a moles', x * RENG_AE_KJ[s]!, 'La afinidad electrónica es por mol de átomos: pasa antes los gramos a moles.'],
      ['diatomica', 'Con la masa de X₂', (x / (2 * A(s))) * RENG_AE_KJ[s]!, 'El dato se refiere a átomos sueltos: usa la masa atómica, no la de la molécula X₂.']
    ],
    enunciado: (s, x) => `Cada mol de átomos de ${rengNombreTp(s)} gaseoso libera ${RENG_AE_KJ[s]} kJ al captar un electrón. Se convierten en iones ${s}⁻ ${tx(x)} g de átomos de ${rengNombreTp(s)}.`,
    pregunta: '¿Qué energía se libera, en kJ?',
    datos: (s, x) => [['Masa', `${tx(x)} g de átomos de ${s}`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], ['Energía liberada', `${RENG_AE_KJ[s]} kJ/mol`]],
    pasos: (s, x, _y, rengR) => [`n = ${tx(x / A(s))} mol de átomos.`, `E = n × ${RENG_AE_KJ[s]} = ${tx(rengR)} kJ liberados.`],
    pistas: ['Pasa los gramos a moles de átomos.', 'La energía es por mol.', 'Multiplica moles por energía.']
  })
]

export const RENG_PRACTICAS_B03_S11: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s11-p1', titulo: 'Volumen de un gas noble', unidad: 'L',
    objetivo: 'Calcular el volumen que ocupa una masa de gas noble, recordando que es monoatómico.', seccion: '18.1', para: 'los gases nobles', masas: true,
    idealizado: 'Gas ideal a 0 °C y 1 atm.', metodo: 'ecuación de los gases ideales', sinVerificar: ['El volumen molar normal de 22,414 L/mol es un valor de uso común recordado.'], lista: RENG_GASES_NOBLES_TP, x: [1, 100, 0.5],
    respuesta: (s, x) => (x / A(s)) * RENG_VM_TP,
    errores: (s, x) => [
      ['diatomico', 'Como gas diatómico', (x / (2 * A(s))) * RENG_VM_TP, 'Los gases nobles son monoatómicos: su masa molar es la masa atómica.'],
      ['sin-moles', 'Sin pasar a moles', x * RENG_VM_TP, 'El volumen molar se multiplica por los moles, no por los gramos.']
    ],
    enunciado: (s, x) => `Un recipiente contiene ${tx(x)} g de ${rengNombreTp(s)}, un gas noble, a 0 °C y 1 atm.`,
    pregunta: '¿Qué volumen ocupa, en L?',
    datos: (s, x) => [['Masa', `${tx(x)} g de ${s}`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], ['Volumen molar', '22,414 L/mol']],
    pasos: (s, x, _y, rengR) => [`n = ${tx(x)}/${tx(A(s), 5)} = ${tx(x / A(s))} mol.`, `V = n × 22,414 = ${tx(rengR)} L.`],
    pistas: ['El gas es monoatómico.', 'Pasa los gramos a moles.', 'Multiplica por el volumen molar.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s11-p2', titulo: 'Densidad de un gas noble', unidad: 'g/L',
    objetivo: 'Calcular la densidad de un gas noble a una temperatura dada con la ecuación de los gases ideales.', seccion: '18.1', para: 'los gases nobles', masas: true,
    idealizado: 'Gas ideal a 1 atm.', metodo: 'escena «gas-ideal»', lista: RENG_GASES_NOBLES_TP, x: [5, 100, 5],
    respuesta: (s, x) => A(s) / (0.082057 * (x + 273.15)),
    errores: (s, x) => [
      ['celsius', 'Con grados Celsius', A(s) / (0.082057 * x), 'Usaste la temperatura en grados Celsius; en los gases se usa la temperatura absoluta en kelvin.'],
      ['diatomico', 'Como gas diatómico', (2 * A(s)) / (0.082057 * (x + 273.15)), 'Los gases nobles son monoatómicos: la masa molar es la masa atómica.']
    ],
    enunciado: (s, x) => `Un globo contiene ${rengNombreTp(s)} a ${x} °C y 1 atm. Dato: R = 0,082057 atm·L/(mol·K).`,
    pregunta: '¿Cuál es la densidad del gas, en g/L?',
    datos: (s, x) => [['Gas', `${s}, ${tx(A(s), 5)} g/mol`], ['Condiciones', `${x} °C y 1 atm`]],
    pasos: (s, x, _y, rengR) => [`ρ = P·M/(R·T), con T = ${tx(x + 273.15, 5)} K.`, `ρ = ${tx(rengR)} g/L.`],
    pistas: ['Pasa la temperatura a kelvin.', 'Usa ρ = P·M/(R·T).', 'La masa molar es la atómica.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s11-p3', titulo: 'Ionizar un gas noble', unidad: 'kJ',
    objetivo: 'Calcular la energía necesaria para ionizar un volumen de gas noble.', seccion: '6.5', para: 'la energía de ionización de los gases nobles', tendencias: true,
    idealizado: 'Gas ideal a 0 °C y 1 atm; átomos aislados.', metodo: 'ecuación de los gases ideales y tabla de datos', sinVerificar: ['El volumen molar normal de 22,414 L/mol es un valor de uso común recordado.'], lista: RENG_GASES_NOBLES_TP, x: [0.5, 30, 0.5],
    respuesta: (s, x) => (x / RENG_VM_TP) * RENG_EI_KJ[s]!,
    errores: (s, x) => [
      ['sin-moles', 'Sin pasar a moles', x * RENG_EI_KJ[s]!, 'La energía de ionización es por mol: pasa antes los litros a moles.'],
      ['dividir', 'Dividiendo', RENG_EI_KJ[s]! / (x / RENG_VM_TP), 'Dividiste la energía entre los moles; hay que multiplicar.']
    ],
    enunciado: (s, x) => `La primera energía de ionización del ${rengNombreTp(s)} es ${RENG_EI_KJ[s]} kJ/mol. Se tienen ${tx(x)} L de ${rengNombreTp(s)} a 0 °C y 1 atm.`,
    pregunta: '¿Qué energía haría falta para ionizar todos sus átomos, en kJ?',
    datos: (s, x) => [['Volumen', `${tx(x)} L`], ['Volumen molar', '22,414 L/mol'], ['Ei', `${RENG_EI_KJ[s]} kJ/mol`]],
    pasos: (s, x, _y, rengR) => [`n = ${tx(x)}/22,414 = ${tx(x / RENG_VM_TP)} mol.`, `E = n × ${RENG_EI_KJ[s]} = ${tx(rengR)} kJ.`],
    pistas: ['Pasa los litros a moles.', 'La Ei es energía por mol.', 'Multiplica moles por Ei.']
  })
]

export const RENG_PRACTICAS_B03_S12: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s12-p1', titulo: 'Estado de oxidación de un metal de transición', unidad: '', tolerancia: E,
    objetivo: 'Calcular el estado de oxidación de un metal de transición en un compuesto binario.', seccion: '19.1', para: 'los estados de oxidación de los metales de transición',
    idealizado: 'Compuestos binarios con Cl −1, O −2 y S −2.', metodo: 'recuento de átomos con el analizador de fórmulas del núcleo', lista: RENG_COMPUESTOS_TRANSICION_TP,
    respuesta: ([m, f, a, q]) => rengEoTp(m, f, a, q),
    errores: ([m, f, a, q]) => [
      ['anion', 'La carga del anión', q, 'Ese es el valor absoluto de la carga de un solo anión; hay que contar todos y repartir entre los átomos de metal.'],
      ['invertido', 'Subíndices invertidos', (rengDeNo(f, m) * q) / rengDeNo(f, a), 'Intercambiaste los subíndices del metal y del no metal.']
    ],
    enunciado: ([, f, a, q]) => `En el compuesto ${T(f)}, el ${rengNombreTp(a)} tiene estado de oxidación −${q}.`,
    pregunta: ([m]) => `¿Cuál es el estado de oxidación del ${rengNombreTp(m)}?`,
    datos: ([, f, a, q]) => [['Fórmula', T(f)], [`${a}`, `−${q}`], ['Regla', 'la suma es cero']],
    pasos: ([m, f, a, q], _x, _y, rengR) => [`Carga negativa total: ${rengDeNo(f, a)} × ${q} = ${rengDeNo(f, a) * q}, repartida entre ${rengDeNo(f, m)} átomos de ${m}.`, `Estado de oxidación: +${tx(rengR)}.`],
    pistas: ['Suma la carga de los aniones.', 'La suma total es cero.', 'Reparte entre los átomos de metal.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s12-p2', titulo: 'Metal en un mineral', unidad: 'kg',
    objetivo: 'Calcular la masa de metal contenida en una masa de mineral puro.', seccion: '19.1', para: 'la obtención de los metales de transición', masas: true,
    idealizado: 'Mineral puro de la fórmula indicada.', metodo: 'masa molar del núcleo', lista: RENG_MINERALES_TP, x: [1, 100, 0.5],
    respuesta: ([s, f], x) => x * fracMetal(s, f),
    errores: ([s, f], x) => [
      ['resto', 'El resto del mineral', x * (1 - fracMetal(s, f)), 'Esa es la masa de lo que no es metal; se pide la del metal.'],
      ['inversa', 'Fracción invertida', x / fracMetal(s, f), 'Dividiste entre la fracción de metal; la masa de metal es menor que la del mineral.']
    ],
    enunciado: ([, f, n], x) => `Se procesan ${tx(x)} kg de ${n} pura, de fórmula ${T(f)}.`,
    pregunta: ([s]) => `¿Qué masa de ${rengNombreTp(s)} contiene, en kg?`,
    datos: ([s, f], x) => [['Mineral', `${tx(x)} kg de ${T(f)}`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], [`M(${T(f)})`, `${tx(M(f), 5)} g/mol`]],
    pasos: ([s, f], _x, _y, rengR) => [`Fracción de ${s}: ${rengDeNo(f, s)} × ${tx(A(s), 5)} / ${tx(M(f), 5)} = ${tx(fracMetal(s, f), 4)}.`, `m(${s}) = ${tx(rengR)} kg.`],
    pistas: ['Calcula la masa molar del mineral.', 'Halla la fracción de metal.', 'Multiplica por la masa de mineral.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s12-p3', titulo: 'Electrones d del metal en un compuesto', unidad: '', tolerancia: E,
    objetivo: 'Combinar el estado de oxidación con la configuración electrónica para contar los electrones 3d del metal.', seccion: '19.1', para: 'la configuración de los cationes de transición',
    idealizado: 'Catión aislado que pierde primero los electrones 4s.', metodo: 'ocupación de la tabla de la app para el átomo neutro', lista: RENG_COMPUESTOS_TRANSICION_TP,
    respuesta: ([m, f, a, q]) => rengZTp(m) - 18 - rengEoTp(m, f, a, q),
    errores: ([m, f, a, q]) => [
      ['sin-4s', 'Quitando primero los 3d', rengZTp(m) - 20 - rengEoTp(m, f, a, q), 'Quitaste primero los electrones 3d; se pierden antes los dos 4s.'],
      ['sumar', 'Sumando la carga', rengZTp(m) - 18 + rengEoTp(m, f, a, q), 'Un catión pierde electrones: resta el estado de oxidación, no lo sumes.']
    ],
    enunciado: ([m, f]) => `En el compuesto ${T(f)}, el ${rengNombreTp(m)} (Z = ${rengZTp(m)}) está como catión.`,
    pregunta: ([m]) => `¿Cuántos electrones 3d tiene el ion de ${rengNombreTp(m)}?`,
    datos: ([m, f, a, q]) => [['Fórmula', T(f)], ['Z', String(rengZTp(m))], [`${a}`, `−${q}`]],
    pasos: ([m, f, a, q], _x, _y, rengR) => [`Estado de oxidación: +${rengEoTp(m, f, a, q)}; tras el argón quedan ${rengZTp(m) - 18} electrones.`, `Se quitan primero los 4s: 3d con ${tx(rengR)} electrones.`],
    pistas: ['Halla el estado de oxidación.', 'Quita primero los electrones 4s.', 'Cuenta los 3d que quedan.']
  })
]

export const RENG_PRACTICAS_B03_S13: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s13-p1', titulo: 'Electrones de un ion lantánido', unidad: '', tolerancia: E,
    objetivo: 'Calcular los electrones del ion 3+ habitual de un lantánido.', seccion: '2.5', para: 'los lantánidos',
    idealizado: 'Ion 3+ habitual.', metodo: 'escena «atomo»', lista: RENG_LANTANIDOS_TP,
    respuesta: (s) => rengZTp(s) - 3,
    errores: (s) => [
      ['neutro', 'Como átomo neutro', rengZTp(s), 'Esos son los electrones del átomo neutro; el ion 3+ ha perdido tres.'],
      ['signo', 'Signo al revés', rengZTp(s) + 3, 'Un catión tiene menos electrones que protones, no más.']
    ],
    enunciado: (s) => `El ${rengNombreTp(s)} (Z = ${rengZTp(s)}) es un lantánido y forma el ion ${s}³⁺.`,
    pregunta: '¿Cuántos electrones tiene ese ion?',
    datos: (s) => [['Z', String(rengZTp(s))], ['Carga', '+3']],
    pasos: (s, _x, _y, rengR) => [`e⁻ = Z − 3 = ${rengZTp(s)} − 3.`, `e⁻ = ${tx(rengR)}.`],
    pistas: ['Los protones son Z.', 'Un catión 3+ perdió tres electrones.', 'Resta la carga de Z.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s13-p2', titulo: 'Electrones 4f de un ion lantánido', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones 4f del ion 3+ de un lantánido a partir del xenón.', seccion: '6.4', para: 'el bloque f',
    idealizado: 'Ion 3+ con configuración [Xe] 4fⁿ.', metodo: 'ocupación de la tabla de la app para el átomo neutro', lista: RENG_LANTANIDOS_TP,
    respuesta: (s) => rengZTp(s) - 54 - 3,
    errores: (s) => [
      ['sin-carga', 'Sin la carga', rengZTp(s) - 54, 'Esos son los electrones del átomo neutro tras el xenón; el ion ha perdido tres.'],
      ['dos-menos', 'Quitando solo los 6s', rengZTp(s) - 56, 'Quitaste solo los dos electrones 6s; el ion 3+ pierde un electrón más.']
    ],
    enunciado: (s) => `El ion ${s}³⁺ del ${rengNombreTp(s)} (Z = ${rengZTp(s)}) tiene la configuración [Xe] 4fⁿ. El xenón tiene 54 electrones.`,
    pregunta: '¿Cuántos electrones 4f tiene el ion?',
    datos: (s) => [['Z', String(rengZTp(s))], ['Xenón', '54 electrones'], ['Carga', '+3']],
    pasos: (s, _x, _y, rengR) => [`Electrones del ion: ${rengZTp(s) - 3}; los 54 primeros forman el núcleo de xenón.`, `4f: ${tx(rengR)} electrones.`],
    pistas: ['Calcula los electrones del ion.', 'Resta los 54 del xenón.', 'Lo que queda está en el 4f.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s13-p3', titulo: 'Óxido de un lantánido', unidad: 'g',
    objetivo: 'Calcular la masa de óxido M₂O₃ que forma una masa de lantánido.', seccion: '2.5', para: 'los lantánidos', masas: true,
    idealizado: 'Oxidación completa a M₂O₃.', metodo: 'masas molares del núcleo', lista: RENG_LANTANIDOS_OXIDO_TP, x: [1, 100, 0.5],
    respuesta: (s, x) => (x / A(s) / 2) * M(`${s}2O3`),
    errores: (s, x) => [
      ['sin-mitad', 'Un mol de óxido por mol de metal', (x / A(s)) * M(`${s}2O3`), 'Cada mol de M₂O₃ contiene dos moles de metal: divide los moles de metal entre dos.'],
      ['solo-oxigeno', 'Solo el oxígeno', (x / A(s) / 2) * 3 * A('O'), 'Esa es la masa de oxígeno incorporada; el óxido incluye también el metal.']
    ],
    enunciado: (s, x) => `El ${rengNombreTp(s)} forma iones 3+ y un óxido de fórmula ${T(`${s}2O3`)}. Se oxidan ${tx(x)} g del metal.`,
    pregunta: '¿Qué masa de óxido se forma, en g?',
    datos: (s, x) => [['Metal', `${tx(x)} g de ${s}`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], [`M(${T(`${s}2O3`)})`, `${tx(M(`${s}2O3`), 5)} g/mol`]],
    pasos: (s, x, _y, rengR) => [`n(${s}) = ${tx(x / A(s))} mol; n(óxido) = ${tx(x / A(s) / 2)} mol.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa el metal a moles.', 'Dos moles de metal por mol de óxido.', 'Multiplica por la masa molar.']
  })
]

export const RENG_PRACTICAS_B03_S14: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s14-p1', titulo: 'Neutrones de un actínido', unidad: '', tolerancia: E,
    objetivo: 'Calcular los neutrones de un núclido de un actínido.', seccion: '2.5', para: 'los actínidos',
    idealizado: 'Núclidos indicados.', metodo: 'escena «atomo»', lista: RENG_ACTINIDOS_TP,
    respuesta: ([s, a]) => a - rengZTp(s),
    errores: ([s, a]) => [
      ['masico', 'El número másico', a, 'Ese es el número másico; los neutrones son A − Z.'],
      ['protones', 'Los protones', rengZTp(s), 'Ese es el número de protones; los neutrones son A − Z.']
    ],
    enunciado: ([s, a]) => `El ${rengNuclidoAt(s, a)} es un núclido del ${rengNombreTp(s)} (Z = ${rengZTp(s)}), un actínido.`,
    pregunta: '¿Cuántos neutrones tiene su núcleo?',
    datos: ([s, a]) => [['A', String(a)], ['Z', String(rengZTp(s))]],
    pasos: ([s, a], _x, _y, rengR) => [`N = A − Z = ${a} − ${rengZTp(s)}.`, `N = ${tx(rengR)}.`],
    pistas: ['A es el superíndice.', 'Z sale de la tabla periódica.', 'Resta Z de A.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s14-p2', titulo: 'Emisiones alfa sucesivas', unidad: '', tolerancia: E,
    objetivo: 'Calcular el número atómico del núcleo que queda tras varias desintegraciones alfa.', seccion: '2.5', para: 'la radiactividad de los actínidos',
    idealizado: 'Serie de desintegraciones alfa sucesivas.', metodo: 'escena «atomo» restando protones', lista: RENG_ACTINIDOS_TP, x: [1, 4, 1],
    respuesta: ([s], x) => rengZTp(s) - 2 * x,
    errores: ([s], x) => [
      ['sin-cambio', 'Sin cambio', rengZTp(s), 'Cada partícula alfa se lleva dos protones: el número atómico cambia.'],
      ['cuatro', 'Cuatro por emisión', rengZTp(s) - 4 * x, 'Restaste cuatro por emisión; cuatro es lo que baja el número másico, no el atómico.']
    ],
    enunciado: ([s, a], x) => `El ${rengNuclidoAt(s, a)} (Z = ${rengZTp(s)}) emite ${x === 1 ? 'una partícula alfa' : `${x} partículas alfa sucesivas`}.`,
    pregunta: '¿Qué número atómico tiene el núcleo resultante?',
    datos: ([s], x) => [['Z inicial', String(rengZTp(s))], ['Emisiones alfa', String(x)]],
    pasos: ([s, a], x, _y, rengR) => [`Cada emisión alfa resta 2 a Z y 4 a A.`, `Z = ${rengZTp(s)} − ${2 * x} = ${tx(rengR)} (${RENG_ELEMENTOS[rengZTp(s) - 2 * x - 1]!.nombre.toLowerCase()}); A = ${a - 4 * x}.`],
    pistas: ['Una partícula alfa tiene dos protones.', 'Multiplica por el número de emisiones.', 'Resta el resultado de Z.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s14-p3', titulo: 'Cadena de desintegraciones alfa y beta', unidad: '', tolerancia: E,
    objetivo: 'Calcular el número atómico final tras una cadena de emisiones alfa y beta negativa.', seccion: '2.5', para: 'la radiactividad de los actínidos',
    idealizado: 'Cadena hipotética; el núcleo final puede no pertenecer a una serie real.', metodo: 'recuento emisión a emisión', lista: RENG_ACTINIDOS_TP, x: [2, 8, 1], y: [2, 6, 1],
    respuesta: ([s], x, y) => rengZTp(s) - 2 * x + y,
    errores: ([s], x, y) => [
      ['sin-beta', 'Sin las emisiones beta', rengZTp(s) - 2 * x, 'Olvidaste las emisiones beta: cada una convierte un neutrón en protón y sube Z en uno.'],
      ['beta-resta', 'Beta restando', rengZTp(s) - 2 * x - y, 'La emisión beta negativa aumenta Z en una unidad, no la disminuye.']
    ],
    enunciado: ([s, a], x, y) => `El ${rengNuclidoAt(s, a)} (Z = ${rengZTp(s)}) sufre ${x} desintegraciones alfa y ${y} desintegraciones beta negativa.`,
    pregunta: '¿Qué número atómico tiene el núcleo final?',
    datos: ([s], x, y) => [['Z inicial', String(rengZTp(s))], ['Alfa', `${x} (Z − 2 cada una)`], ['Beta negativa', `${y} (Z + 1 cada una)`]],
    pasos: ([s, a], x, y, rengR) => [`Z = ${rengZTp(s)} − 2·${x} + ${y}.`, `Z = ${tx(rengR)}; A = ${a - 4 * x}.`],
    pistas: ['Cada alfa resta dos a Z.', 'Cada beta negativa suma uno a Z.', 'Aplica las dos correcciones.']
  })
]

export const RENG_PRACTICAS_B03_S15: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s15-p1', titulo: 'Radios de dos elementos de un grupo', unidad: '',
    objetivo: 'Comparar los radios atómicos de dos elementos del mismo grupo.', seccion: '6.5', para: 'la variación del radio atómico', tendencias: true,
    idealizado: 'Radios de tablas de texto.', metodo: 'escena «tendencias-periodicas»', lista: RENG_PARES_GRUPO_TP,
    respuesta: ([a, b]) => rengRadioTp(b) / rengRadioTp(a),
    errores: ([a, b]) => [
      ['inverso', 'Cociente invertido', rengRadioTp(a) / rengRadioTp(b), 'Dividiste al revés: el elemento de más abajo es el mayor y va en el numerador.'],
      ['diferencia', 'La diferencia', rengRadioTp(b) - rengRadioTp(a), 'Calculaste la diferencia en picómetros; se pide cuántas veces mayor es.']
    ],
    enunciado: ([a, b]) => `El ${rengNombreTp(a)} y el ${rengNombreTp(b)} están en el grupo ${rengGrupoTp(a)}. Sus radios atómicos son ${rengRadioTp(a)} pm y ${rengRadioTp(b)} pm.`,
    pregunta: ([a, b]) => `¿Cuántas veces mayor es el radio del ${rengNombreTp(b)} que el del ${rengNombreTp(a)}?`,
    datos: ([a, b]) => [[a, `${rengRadioTp(a)} pm, periodo ${rengPeriodoTp(a)}`], [b, `${rengRadioTp(b)} pm, periodo ${rengPeriodoTp(b)}`]],
    pasos: ([a, b], _x, _y, rengR) => [`${rengRadioTp(b)}/${rengRadioTp(a)}.`, `= ${tx(rengR)} veces: al bajar por el grupo hay más capas.`],
    pistas: ['Identifica el átomo mayor.', 'Divide su radio entre el otro.', 'El resultado es mayor que uno.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s15-p2', titulo: 'Volúmenes de dos átomos de un periodo', unidad: '',
    objetivo: 'Comparar los volúmenes de dos átomos de un mismo periodo a partir de sus radios.', seccion: '6.5', para: 'la variación del radio atómico', tendencias: true,
    idealizado: 'Átomos esféricos con radios de tablas de texto.', metodo: 'volúmenes de las dos esferas por separado', lista: RENG_PARES_PERIODO_TP,
    respuesta: ([a, b]) => (rengRadioTp(a) / rengRadioTp(b)) ** 3,
    errores: ([a, b]) => [
      ['sin-cubo', 'Sin elevar al cubo', rengRadioTp(a) / rengRadioTp(b), 'El volumen va con el cubo del radio: eleva el cociente al cubo.'],
      ['cuadrado', 'Al cuadrado', (rengRadioTp(a) / rengRadioTp(b)) ** 2, 'Elevaste al cuadrado (área); el volumen va con el cubo.']
    ],
    enunciado: ([a, b]) => `En el periodo ${rengPeriodoTp(a)}, el ${rengNombreTp(a)} tiene un radio de ${rengRadioTp(a)} pm y el ${rengNombreTp(b)}, de ${rengRadioTp(b)} pm. Considera los átomos como esferas.`,
    pregunta: ([a, b]) => `¿Cuántas veces mayor es el volumen del átomo de ${rengNombreTp(a)} que el de ${rengNombreTp(b)}?`,
    datos: ([a, b]) => [[a, `${rengRadioTp(a)} pm`], [b, `${rengRadioTp(b)} pm`]],
    pasos: ([a, b], _x, _y, rengR) => [`Cociente de radios: ${tx(rengRadioTp(a) / rengRadioTp(b))}.`, `Al cubo: ${tx(rengR)} veces.`],
    pistas: ['Divide los dos radios.', 'Eleva el cociente al cubo.', 'El de la izquierda es mayor.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s15-p3', titulo: 'Carga nuclear efectiva aproximada', unidad: '', tolerancia: E,
    objetivo: 'Estimar la carga nuclear efectiva sobre los electrones de valencia restando los electrones internos.', seccion: '6.5', para: 'la carga nuclear efectiva',
    idealizado: 'Apantallamiento total de los electrones internos y nulo de los de la misma capa.', metodo: 'escena «tendencias-periodicas» (electrones de valencia)', lista: RENG_REPRESENTATIVOS_TP,
    respuesta: (s) => rengValenciaTp(s),
    errores: (s) => [
      ['z', 'El número atómico', rengZTp(s), 'Esa es la carga total del núcleo; hay que restar el apantallamiento de los electrones internos.'],
      ['internos', 'Los electrones internos', rengZTp(s) - rengValenciaTp(s), 'Esos son los electrones internos (el apantallamiento); la carga efectiva es Z menos ese número.']
    ],
    enunciado: (s) => `El ${rengNombreTp(s)} tiene Z = ${rengZTp(s)} y ${rengZTp(s) - rengValenciaTp(s)} electrones internos (los que no son de valencia). Usa la aproximación Z_ef ≈ Z − S.`,
    pregunta: '¿Qué carga nuclear efectiva sienten sus electrones de valencia?',
    datos: (s) => [['Z', String(rengZTp(s))], ['Electrones internos (S)', String(rengZTp(s) - rengValenciaTp(s))]],
    pasos: (s, _x, _y, rengR) => [`Z_ef ≈ ${rengZTp(s)} − ${rengZTp(s) - rengValenciaTp(s)}.`, `Z_ef ≈ +${tx(rengR)}: crece a lo largo del periodo y por eso el radio disminuye.`],
    pistas: ['Cuenta los electrones internos.', 'Réstalos del número atómico.', 'Coincide con los de valencia.']
  })
]

export const RENG_PRACTICAS_B03_S16: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s16-p1', titulo: 'Tamaño de un ion frente a su átomo', unidad: '%',
    objetivo: 'Comparar el radio de un ion con el de su átomo neutro.', seccion: '6.5', para: 'la variación del radio iónico', tendencias: true,
    idealizado: 'Radios de tablas de texto.', metodo: 'cociente por otra vía con la tabla de datos', lista: RENG_IONES_RADIO_TP,
    respuesta: (s) => (rIon(s) / rengRadioTp(s)) * 100,
    errores: (s) => [
      ['inverso', 'Cociente invertido', (rengRadioTp(s) / rIon(s)) * 100, 'Dividiste al revés: el radio del ion va en el numerador.'],
      ['diferencia', 'La diferencia', Math.abs(rIon(s) - rengRadioTp(s)), 'Calculaste la diferencia en picómetros; se pide el porcentaje.']
    ],
    enunciado: (s) => `El átomo de ${rengNombreTp(s)} tiene un radio de ${rengRadioTp(s)} pm y el ion ${rengIonTp(s)}, de ${rIon(s)} pm.`,
    pregunta: '¿Qué porcentaje del radio del átomo representa el radio del ion?',
    datos: (s) => [[s, `${rengRadioTp(s)} pm`], [rengIonTp(s), `${rIon(s)} pm`]],
    pasos: (s, _x, _y, rengR) => [`${rIon(s)}/${rengRadioTp(s)} × 100.`, `= ${tx(rengR)} %: ${rIon(s) < rengRadioTp(s) ? 'el catión es menor que su átomo' : 'el anión es mayor que su átomo'}.`],
    pistas: ['Divide el radio del ion entre el del átomo.', 'Multiplica por cien.', 'Los cationes dan menos del 100 %.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s16-p2', titulo: 'Iones isoelectrónicos', unidad: '',
    objetivo: 'Comparar los radios de dos iones con el mismo número de electrones y relacionarlos con su carga nuclear.', seccion: '6.5', para: 'las series isoelectrónicas', tendencias: true,
    idealizado: 'Radios iónicos de tablas de texto.', metodo: 'cociente por otra vía con la tabla de datos', lista: RENG_ISOELECTRONICOS_TP,
    respuesta: ([a, b]) => rIon(a) / rIon(b),
    errores: ([a, b]) => [
      ['inverso', 'Cociente invertido', rIon(b) / rIon(a), 'Dividiste al revés: el ion con menos protones es el mayor y va en el numerador.'],
      ['protones', 'Cociente de protones', rengZTp(b) / rengZTp(a), 'Dividiste los números atómicos; el radio no es inversamente proporcional a Z de forma exacta.']
    ],
    enunciado: ([a, b]) => `Los iones ${rengIonTp(a)} y ${rengIonTp(b)} tienen ${eIon(a)} electrones cada uno. Sus radios son ${rIon(a)} pm y ${rIon(b)} pm.`,
    pregunta: ([a, b]) => `¿Cuántas veces mayor es el radio del ${rengIonTp(a)} que el del ${rengIonTp(b)}?`,
    datos: ([a, b]) => [[rengIonTp(a), `${rIon(a)} pm; ${rengZTp(a)} protones`], [rengIonTp(b), `${rIon(b)} pm; ${rengZTp(b)} protones`]],
    pasos: ([a, b], _x, _y, rengR) => [`Con los mismos electrones, más protones atraen más.`, `${rIon(a)}/${rIon(b)} = ${tx(rengR)} veces.`],
    pistas: ['Los dos tienen los mismos electrones.', 'Compara sus protones.', 'Divide el radio mayor entre el menor.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s16-p3', titulo: 'Volumen de un ion frente a su átomo', unidad: '%',
    objetivo: 'Comparar el volumen de un ion con el de su átomo a partir de sus radios.', seccion: '6.5', para: 'la variación del radio iónico', tendencias: true,
    idealizado: 'Iones y átomos esféricos.', metodo: 'volúmenes de las dos esferas por separado', lista: RENG_IONES_RADIO_TP,
    respuesta: (s) => (rIon(s) / rengRadioTp(s)) ** 3 * 100,
    errores: (s) => [
      ['sin-cubo', 'Sin elevar al cubo', (rIon(s) / rengRadioTp(s)) * 100, 'Ese es el porcentaje del radio; el volumen va con el cubo.'],
      ['cuadrado', 'Al cuadrado', (rIon(s) / rengRadioTp(s)) ** 2 * 100, 'Elevaste al cuadrado (área); el volumen va con el cubo.']
    ],
    enunciado: (s) => `El átomo de ${rengNombreTp(s)} mide ${rengRadioTp(s)} pm de radio y su ion ${rengIonTp(s)}, ${rIon(s)} pm. Considera ambos como esferas.`,
    pregunta: '¿Qué porcentaje del volumen del átomo representa el volumen del ion?',
    datos: (s) => [[s, `${rengRadioTp(s)} pm`], [rengIonTp(s), `${rIon(s)} pm`]],
    pasos: (s, _x, _y, rengR) => [`Cociente de radios: ${tx(rIon(s) / rengRadioTp(s))}.`, `Al cubo y por cien: ${tx(rengR)} %.`],
    pistas: ['Divide los dos radios.', 'Eleva el cociente al cubo.', 'Multiplica por cien.']
  })
]
