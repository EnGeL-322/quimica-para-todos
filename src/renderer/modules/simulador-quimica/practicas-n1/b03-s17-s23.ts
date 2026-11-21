import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_AE_KJ, rengCaracterDe } from '../escenas-n1/modelos/tendencias-periodicas'
import { RENG_ELEMENTOS } from '../../tabla-periodica/data'
import {
  RENG_BLOQUE_P_TP, RENG_CON_EN_TP, RENG_EV_KJMOL_TP, RENG_HC_EVNM_TP, RENG_PARES_GRUPO_TP, RENG_PARES_PERIODO_TP, RENG_REPRESENTATIVOS_TP, RENG_TOL_TP_ENT, RENG_TRIADAS_18_TP, rengATp, rengEiTp, rengEnTp, rengGrupoTp,
  rengNombreTp, rengPeriodoTp, rengPracticaTp, rengRadioTp, rengValenciaTp
} from './b03-comun'
import type { RengTriadaTp } from './b03-comun'
import { rengCargaAt } from './b02-comun'
import { rengDeNo, rengMNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const M = rengMNo
const A = rengATp
const E = RENG_TOL_TP_ENT
const UNO: readonly number[] = [0]
const AE = (rengS: string): number => RENG_AE_KJ[rengS]!
const EV = RENG_EV_KJMOL_TP
const NA = 6.02214076e23
const SV = ['La equivalencia 1 eV por átomo = 96,485 kJ/mol y h·c = 1239,84 eV·nm son valores de uso común recordados.']
export const RENG_CON_EI_TP: readonly string[] = ['H', 'He', ...RENG_REPRESENTATIVOS_TP]
export const RENG_CON_AE_TP: readonly string[] = Object.keys(RENG_AE_KJ)
export const RENG_TRANSFERENCIAS_TP: ReadonlyArray<readonly [string, string]> = ['Li', 'Na', 'K', 'Rb'].flatMap((m) => ['F', 'Cl', 'Br', 'I'].map((x) => [m, x] as const))
export const RENG_ENLACES_TP: ReadonlyArray<readonly [string, string]> = [
  ['H', 'Cl'], ['H', 'F'], ['H', 'O'], ['C', 'H'], ['C', 'O'], ['C', 'Cl'], ['N', 'H'], ['Na', 'Cl'], ['K', 'Br'], ['Mg', 'O'], ['Li', 'F'], ['C', 'N'], ['S', 'O'], ['P', 'Cl'], ['Si', 'O'], ['H', 'Br'], ['H', 'I'], ['C', 'F'],
  ['Ca', 'O'], ['Al', 'Cl'], ['K', 'F'], ['Na', 'F'], ['N', 'O'], ['B', 'F'], ['Be', 'Cl']
]
const dChi = ([a, b]: readonly [string, string]): number => Math.abs(rengEnTp(a) - rengEnTp(b))
export const RENG_MENOS_QUE_CLORO_TP: readonly string[] = ['H', ...RENG_CON_EN_TP].filter((rengS) => rengEnTp(rengS) < 3.1)
export const RENG_OXIDOS_BASICOS_TP: ReadonlyArray<readonly [string, string, number]> = [['Na2O', 'NaOH', 2], ['K2O', 'KOH', 2], ['Li2O', 'LiOH', 2], ['CaO', 'Ca(OH)2', 1], ['BaO', 'Ba(OH)2', 1], ['MgO', 'Mg(OH)2', 1], ['SrO', 'Sr(OH)2', 1]]
export const RENG_EO_MAXIMO_TP: readonly string[] = RENG_BLOQUE_P_TP.filter((rengS) => rengGrupoTp(rengS) <= 17 && rengS !== 'O' && rengS !== 'F')
export const RENG_OXOACIDOS_TP: ReadonlyArray<readonly [string, string]> = [
  ['H2SO4', 'S'], ['HNO3', 'N'], ['H3PO4', 'P'], ['HClO4', 'Cl'], ['HClO', 'Cl'], ['H2SO3', 'S'], ['HNO2', 'N'], ['HClO3', 'Cl'], ['H2CO3', 'C'], ['HClO2', 'Cl'], ['H3PO3', 'P'], ['HBrO3', 'Br'], ['HIO3', 'I'], ['H3BO3', 'B'],
  ['H4SiO4', 'Si'], ['H2SeO4', 'Se'], ['H3AsO4', 'As'], ['HBrO', 'Br']
]
export const RENG_IONES_POLI_TP: ReadonlyArray<readonly [string, string, number]> = [
  ['SO4', 'S', -2], ['NO3', 'N', -1], ['PO4', 'P', -3], ['CO3', 'C', -2], ['ClO3', 'Cl', -1], ['ClO4', 'Cl', -1], ['MnO4', 'Mn', -1], ['Cr2O7', 'Cr', -2], ['CrO4', 'Cr', -2], ['NH4', 'N', 1], ['SO3', 'S', -2], ['NO2', 'N', -1],
  ['ClO', 'Cl', -1], ['IO3', 'I', -1], ['BrO3', 'Br', -1], ['S2O3', 'S', -2], ['C2O4', 'C', -2], ['AsO4', 'As', -3], ['SiO3', 'Si', -2]
]
export const rengEoCentralTp = (rengF: string, rengX: string, rengQ = 0): number => (rengQ + 2 * rengDeNo(rengF, 'O') - rengDeNo(rengF, 'H')) / rengDeNo(rengF, rengX)
export type RengPropTp = 'radio' | 'ei'
export const RENG_INTERPOLACIONES_TP: ReadonlyArray<readonly [RengTriadaTp, RengPropTp]> = RENG_TRIADAS_18_TP.flatMap((rengT) => [[rengT, 'radio'] as const, [rengT, 'ei'] as const])
export const rengPropTp = (rengS: string, rengP: RengPropTp): number => (rengP === 'radio' ? rengRadioTp(rengS) : rengEiTp(rengS))
const nombreProp = (rengP: RengPropTp): string => (rengP === 'radio' ? 'radio atómico' : 'primera energía de ionización')
const unidadProp = (rengP: RengPropTp): string => (rengP === 'radio' ? 'pm' : 'kJ/mol')
const mcd = (rengA: number, rengB: number): number => (rengB === 0 ? rengA : mcd(rengB, rengA % rengB))
export const RENG_METALES_ANALOGOS_TP: ReadonlyArray<readonly [string, number]> = [['Li', 1], ['Na', 1], ['K', 1], ['Rb', 1], ['Mg', 2], ['Ca', 2], ['Sr', 2], ['Ba', 2], ['Al', 3], ['Ga', 3]]
export const RENG_NO_METALES_ANALOGOS_TP: ReadonlyArray<readonly [string, number]> = [['F', 1], ['Cl', 1], ['Br', 1], ['I', 1], ['O', 2], ['S', 2], ['Se', 2], ['N', 3]]
export const RENG_ANALOGOS_TP: ReadonlyArray<readonly [string, number, string, number]> = RENG_METALES_ANALOGOS_TP.flatMap(([m, qm]) => RENG_NO_METALES_ANALOGOS_TP.map(([x, qx]) => [m, qm, x, qx] as const))
export const rengSubindicesTp = (rengQm: number, rengQx: number): readonly [number, number] => [rengQx / mcd(rengQm, rengQx), rengQm / mcd(rengQm, rengQx)]
const formulaIonica = (rengM: string, rengQm: number, rengX: string, rengQx: number): string => { const [a, b] = rengSubindicesTp(rengQm, rengQx); return `${rengM}${a > 1 ? a : ''}${rengX}${b > 1 ? b : ''}` }
const metalesEntre = (rengA: number, rengB: number): number => RENG_ELEMENTOS.filter((rengE) => rengE.z >= rengA && rengE.z <= rengB && rengCaracterDe(rengE) === 1).length

export const RENG_PRACTICAS_B03_S17: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s17-p1', titulo: 'Energía para ionizar una cantidad', unidad: 'kJ',
    objetivo: 'Calcular la energía necesaria para ionizar una cantidad de átomos gaseosos.', seccion: '6.5', para: 'la energía de ionización', tendencias: true, masas: true,
    idealizado: 'Átomos gaseosos aislados.', metodo: 'escena «tendencias-periodicas» y tabla de datos', lista: RENG_CON_EI_TP, x: [0.1, 5, 0.1],
    respuesta: (s, x) => x * rengEiTp(s),
    errores: (s, x) => [
      ['dividir', 'Dividiendo', rengEiTp(s) / x, 'Dividiste la energía entre los moles; hay que multiplicar.'],
      ['gramos', 'Como si fueran gramos', (x / A(s)) * rengEiTp(s), 'La cantidad ya está en moles: no hay que dividirla entre la masa atómica.']
    ],
    enunciado: (s, x) => `La primera energía de ionización del ${rengNombreTp(s)} es ${rengEiTp(s)} kJ/mol. Se quieren ionizar ${tx(x)} mol de átomos gaseosos.`,
    pregunta: '¿Qué energía hay que aportar, en kJ?',
    datos: (s, x) => [['Ei', `${rengEiTp(s)} kJ/mol`], ['Cantidad', `${tx(x)} mol`]],
    pasos: (s, x, _y, rengR) => [`E = n × Ei = ${tx(x)} × ${rengEiTp(s)}.`, `E = ${tx(rengR)} kJ.`],
    pistas: ['La Ei es energía por mol.', 'Multiplica por los moles.', 'El proceso absorbe energía.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s17-p2', titulo: 'Energía de ionización por átomo', unidad: 'eV',
    objetivo: 'Pasar una energía de ionización molar a electronvoltios por átomo.', seccion: '6.5', para: 'la energía de ionización', tendencias: true,
    idealizado: 'Átomos gaseosos aislados.', metodo: 'conversión de J a eV del catálogo de unidades', sinVerificar: SV, lista: RENG_CON_EI_TP,
    respuesta: (s) => rengEiTp(s) / EV,
    errores: (s) => [
      ['julios', 'En julios', (rengEiTp(s) * 1000) / NA, 'Ese valor está en julios por átomo; la pregunta pide electronvoltios.'],
      ['multiplicar', 'Multiplicando', rengEiTp(s) * EV, 'Multiplicaste por 96,485; para pasar de kJ/mol a eV por átomo hay que dividir.']
    ],
    enunciado: (s) => `La primera energía de ionización del ${rengNombreTp(s)} es ${rengEiTp(s)} kJ/mol. Un electronvoltio por átomo equivale a 96,485 kJ/mol.`,
    pregunta: '¿Cuánta energía hace falta para ionizar un solo átomo, en eV?',
    datos: (s) => [['Ei', `${rengEiTp(s)} kJ/mol`], ['Equivalencia', '1 eV por átomo = 96,485 kJ/mol']],
    pasos: (s, _x, _y, rengR) => [`E = ${rengEiTp(s)} / 96,485.`, `E = ${tx(rengR)} eV por átomo.`],
    pistas: ['Usa la equivalencia dada.', 'Divide la energía molar.', 'Compara con 13,6 eV del hidrógeno.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s17-p3', titulo: 'Luz capaz de ionizar un átomo', unidad: 'nm',
    objetivo: 'Calcular la longitud de onda máxima de un fotón capaz de ionizar un átomo.', seccion: '6.5', para: 'la energía de ionización', tendencias: true,
    idealizado: 'Un fotón ioniza un átomo aislado.', metodo: 'conversión de unidades del catálogo y c = λ·ν', sinVerificar: SV, lista: RENG_CON_EI_TP,
    respuesta: (s) => RENG_HC_EVNM_TP / (rengEiTp(s) / EV),
    errores: (s) => [
      ['ev', 'La energía en eV', rengEiTp(s) / EV, 'Ese valor es la energía del fotón en eV; falta pasarla a longitud de onda con λ = hc/E.'],
      ['invertida', 'Cociente invertido', rengEiTp(s) / EV / RENG_HC_EVNM_TP, 'Invertiste la fórmula: λ = h·c/E, con la energía en el denominador.']
    ],
    enunciado: (s) => `Para ionizar un átomo de ${rengNombreTp(s)} hacen falta ${tx(rengEiTp(s) / EV, 4)} eV (${rengEiTp(s)} kJ/mol). Dato: h·c = 1239,84 eV·nm.`,
    pregunta: '¿Cuál es la longitud de onda máxima de un fotón capaz de ionizarlo, en nm?',
    datos: (s) => [['Energía', `${tx(rengEiTp(s) / EV, 4)} eV`], ['h·c', '1239,84 eV·nm']],
    pasos: (s, _x, _y, rengR) => [`λ = h·c/E = 1239,84 / ${tx(rengEiTp(s) / EV, 4)}.`, `λ = ${tx(rengR)} nm: radiación ultravioleta.`],
    pistas: ['Usa λ = h·c/E.', 'La energía va en eV.', 'A más energía, menor longitud de onda.']
  })
]

export const RENG_PRACTICAS_B03_S18: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s18-p1', titulo: 'Energía al captar electrones', unidad: 'kJ',
    objetivo: 'Calcular la energía que libera una cantidad de átomos al captar un electrón cada uno.', seccion: '6.5', para: 'la afinidad electrónica', tendencias: true, masas: true,
    idealizado: 'Átomos gaseosos aislados.', metodo: 'tabla de datos de la escena', lista: RENG_CON_AE_TP, x: [0.1, 5, 0.1],
    respuesta: (s, x) => x * AE(s),
    errores: (s, x) => [
      ['dividir', 'Dividiendo', AE(s) / x, 'Dividiste la energía entre los moles; hay que multiplicar.'],
      ['gramos', 'Como si fueran gramos', (x / A(s)) * AE(s), 'La cantidad ya está en moles: no hay que dividirla entre la masa atómica.']
    ],
    enunciado: (s, x) => `Cada mol de átomos de ${rengNombreTp(s)} gaseoso libera ${AE(s)} kJ al captar un electrón. Captan un electrón ${tx(x)} mol de átomos.`,
    pregunta: '¿Qué energía se libera, en kJ?',
    datos: (s, x) => [['Energía liberada', `${AE(s)} kJ/mol`], ['Cantidad', `${tx(x)} mol`]],
    pasos: (s, x, _y, rengR) => [`E = n × ${AE(s)} = ${tx(x)} × ${AE(s)}.`, `E = ${tx(rengR)} kJ liberados.`],
    pistas: ['La afinidad es energía por mol.', 'Multiplica por los moles.', 'El proceso libera energía.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s18-p2', titulo: 'Transferir un electrón entre átomos', unidad: 'kJ/mol',
    objetivo: 'Combinar la energía de ionización de un metal y la afinidad electrónica de un halógeno en un balance.', seccion: '6.5', para: 'la afinidad electrónica y la ionización', tendencias: true,
    idealizado: 'Átomos e iones gaseosos aislados.', metodo: 'escena «tendencias-periodicas» y tabla de datos', lista: RENG_TRANSFERENCIAS_TP,
    respuesta: ([m, x]) => rengEiTp(m) - AE(x),
    errores: ([m, x]) => [
      ['suma', 'Sumando', rengEiTp(m) + AE(x), 'Sumaste las dos energías; una se absorbe y la otra se libera, así que se restan.'],
      ['al-reves', 'Resta al revés', AE(x) - rengEiTp(m), 'Restaste al revés: la ionización del metal cuesta más de lo que libera el halógeno.']
    ],
    enunciado: ([m, x]) => `Ionizar el ${rengNombreTp(m)} gaseoso cuesta ${rengEiTp(m)} kJ/mol y el ${rengNombreTp(x)} gaseoso libera ${AE(x)} kJ/mol al captar un electrón.`,
    pregunta: ([m, x]) => `¿Qué energía neta hay que aportar para formar ${m}⁺(g) y ${x}⁻(g) a partir de los átomos, en kJ/mol?`,
    datos: ([m, x]) => [[`Ei(${m})`, `${rengEiTp(m)} kJ/mol`], [`Afinidad de ${x}`, `${AE(x)} kJ/mol liberados`]],
    pasos: ([m, x], _x, _y, rengR) => [`ΔE = Ei(${m}) − AE(${x}) = ${rengEiTp(m)} − ${AE(x)}.`, `ΔE = ${tx(rengR)} kJ/mol: hace falta energía, que aporta la atracción entre los iones.`],
    pistas: ['La ionización absorbe energía.', 'La captura del electrón la libera.', 'Resta la segunda de la primera.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s18-p3', titulo: 'Afinidad electrónica por átomo', unidad: 'eV',
    objetivo: 'Pasar la energía liberada al captar un electrón de kJ/mol a electronvoltios por átomo.', seccion: '6.5', para: 'la afinidad electrónica', tendencias: true,
    idealizado: 'Átomos gaseosos aislados.', metodo: 'conversión de J a eV del catálogo de unidades', sinVerificar: SV, lista: RENG_CON_AE_TP,
    respuesta: (s) => AE(s) / EV,
    errores: (s) => [
      ['julios', 'En julios', (AE(s) * 1000) / NA, 'Ese valor está en julios por átomo; la pregunta pide electronvoltios.'],
      ['multiplicar', 'Multiplicando', AE(s) * EV, 'Multiplicaste por 96,485; para pasar de kJ/mol a eV por átomo hay que dividir.']
    ],
    enunciado: (s) => `Un mol de átomos de ${rengNombreTp(s)} gaseoso libera ${AE(s)} kJ al captar un electrón. Un electronvoltio por átomo equivale a 96,485 kJ/mol.`,
    pregunta: '¿Cuánta energía libera un solo átomo, en eV?',
    datos: (s) => [['Energía liberada', `${AE(s)} kJ/mol`], ['Equivalencia', '1 eV por átomo = 96,485 kJ/mol']],
    pasos: (s, _x, _y, rengR) => [`E = ${AE(s)} / 96,485.`, `E = ${tx(rengR)} eV por átomo.`],
    pistas: ['Usa la equivalencia dada.', 'Divide la energía molar.', 'Los halógenos dan los valores mayores.']
  })
]

export const RENG_PRACTICAS_B03_S19: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s19-p1', titulo: 'Diferencia de electronegatividad', unidad: '',
    objetivo: 'Calcular la diferencia de electronegatividad entre los dos átomos de un enlace.', seccion: '6.5', para: 'la electronegatividad', pubchem: true,
    idealizado: 'Escala de Pauling.', metodo: 'datos de PubChem guardados en la app, leídos por otra vía', lista: RENG_ENLACES_TP,
    respuesta: (e) => dChi(e),
    errores: ([a, b]) => [
      ['suma', 'Sumando', rengEnTp(a) + rengEnTp(b), 'Sumaste las electronegatividades; se pide su diferencia.'],
      ['media', 'La media', (rengEnTp(a) + rengEnTp(b)) / 2, 'Calculaste la media; la polaridad del enlace depende de la diferencia.']
    ],
    enunciado: ([a, b]) => `En la escala de Pauling, el ${rengNombreTp(a)} vale ${tx(rengEnTp(a))} y el ${rengNombreTp(b)}, ${tx(rengEnTp(b))}.`,
    pregunta: ([a, b]) => `¿Cuál es la diferencia de electronegatividad del enlace ${a}–${b}?`,
    datos: ([a, b]) => [[a, tx(rengEnTp(a))], [b, tx(rengEnTp(b))]],
    pasos: ([a, b], _x, _y, rengR) => [`Δχ = |${tx(rengEnTp(a))} − ${tx(rengEnTp(b))}|.`, `Δχ = ${tx(rengR)}: ${rengR > 1.7 ? 'enlace predominantemente iónico' : rengR > 0.4 ? 'enlace covalente polar' : 'enlace covalente poco polar'}.`],
    pistas: ['Identifica el valor mayor.', 'Resta el menor del mayor.', 'Una diferencia grande indica enlace iónico.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s19-p2', titulo: 'Carácter iónico de un enlace', unidad: '%',
    objetivo: 'Estimar el porcentaje de carácter iónico de un enlace con la relación de Pauling.', seccion: '6.5', para: 'la electronegatividad', pubchem: true,
    idealizado: 'Relación empírica de Pauling.', metodo: 'cálculo con potencias en lugar de la exponencial directa', sinVerificar: ['La relación de Pauling % iónico = 100·(1 − e^(−Δχ²/4)) es una fórmula empírica recordada, no contrastada en esta entrega.'], lista: RENG_ENLACES_TP,
    respuesta: (e) => 100 * (1 - Math.exp(-(dChi(e) ** 2) / 4)),
    errores: (e) => [
      ['sin-cuadrado', 'Sin elevar al cuadrado', 100 * (1 - Math.exp(-dChi(e) / 4)), 'Falta elevar la diferencia al cuadrado dentro de la exponencial.'],
      ['covalente', 'El carácter covalente', 100 * Math.exp(-(dChi(e) ** 2) / 4), 'Ese es el porcentaje de carácter covalente; el iónico es lo que falta hasta cien.']
    ],
    enunciado: ([a, b]) => `Pauling propuso estimar el carácter iónico de un enlace con % = 100·(1 − e^(−Δχ²/4)). En el enlace ${a}–${b}, las electronegatividades son ${tx(rengEnTp(a))} y ${tx(rengEnTp(b))}.`,
    pregunta: '¿Qué porcentaje de carácter iónico tiene el enlace?',
    datos: ([a, b]) => [[a, tx(rengEnTp(a))], [b, tx(rengEnTp(b))], ['Fórmula', '% = 100·(1 − e^(−Δχ²/4))']],
    pasos: (e, _x, _y, rengR) => [`Δχ = ${tx(dChi(e))}; Δχ²/4 = ${tx(dChi(e) ** 2 / 4)}.`, `% iónico = ${tx(rengR)} %.`],
    pistas: ['Calcula la diferencia Δχ.', 'Elévala al cuadrado y divide entre 4.', 'Aplica la exponencial y resta de uno.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s19-p3', titulo: 'Electronegatividad de un elemento desconocido', unidad: '',
    objetivo: 'Deducir la electronegatividad de un elemento a partir de la diferencia con el cloro.', seccion: '6.5', para: 'la electronegatividad', pubchem: true,
    idealizado: 'Escala de Pauling.', metodo: 'búsqueda por bisección de la electronegatividad', lista: RENG_MENOS_QUE_CLORO_TP,
    respuesta: (s) => rengEnTp(s),
    errores: (s) => [
      ['suma', 'Sumando', 2 * rengEnTp('Cl') - rengEnTp(s), 'Sumaste la diferencia al cloro; el elemento es menos electronegativo, así que hay que restarla.'],
      ['delta', 'La diferencia', rengEnTp('Cl') - rengEnTp(s), 'Ese valor es la diferencia; se pide la electronegatividad del elemento.']
    ],
    enunciado: (s) => `El enlace entre un elemento X y el cloro tiene una diferencia de electronegatividad de ${tx(rengEnTp('Cl') - rengEnTp(s))}. El cloro vale ${tx(rengEnTp('Cl'))} y X es menos electronegativo.`,
    pregunta: '¿Cuál es la electronegatividad de X?',
    datos: (s) => [['Δχ', tx(rengEnTp('Cl') - rengEnTp(s))], ['Cl', tx(rengEnTp('Cl'))]],
    pasos: (s, _x, _y, rengR) => [`χ(X) = ${tx(rengEnTp('Cl'))} − ${tx(rengEnTp('Cl') - rengEnTp(s))}.`, `χ(X) = ${tx(rengR)}: corresponde al ${rengNombreTp(s)}.`],
    pistas: ['X es menos electronegativo.', 'Resta la diferencia del valor del cloro.', 'Busca el elemento en la tabla.']
  })
]

export const RENG_PRACTICAS_B03_S20: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s20-p1', titulo: 'Carácter metálico en un grupo', unidad: '',
    objetivo: 'Comparar el carácter metálico de dos elementos de un grupo mediante sus energías de ionización.', seccion: '18.1', para: 'el carácter metálico', tendencias: true,
    idealizado: 'Energías de ionización de tablas de texto.', metodo: 'escena «tendencias-periodicas»', lista: RENG_PARES_GRUPO_TP,
    respuesta: ([a, b]) => rengEiTp(a) / rengEiTp(b),
    errores: ([a, b]) => [
      ['inverso', 'Cociente invertido', rengEiTp(b) / rengEiTp(a), 'Dividiste al revés: el elemento de más arriba tiene mayor energía de ionización.'],
      ['diferencia', 'La diferencia', rengEiTp(a) - rengEiTp(b), 'Calculaste la diferencia en kJ/mol; se pide cuántas veces mayor es.']
    ],
    enunciado: ([a, b]) => `En el grupo ${rengGrupoTp(a)}, la primera energía de ionización es ${rengEiTp(a)} kJ/mol en el ${rengNombreTp(a)} y ${rengEiTp(b)} kJ/mol en el ${rengNombreTp(b)}.`,
    pregunta: ([a, b]) => `¿Cuántas veces mayor es la del ${rengNombreTp(a)} que la del ${rengNombreTp(b)}?`,
    datos: ([a, b]) => [[a, `${rengEiTp(a)} kJ/mol`], [b, `${rengEiTp(b)} kJ/mol`]],
    pasos: ([a, b], _x, _y, rengR) => [`${rengEiTp(a)}/${rengEiTp(b)}.`, `= ${tx(rengR)}: el ${rengNombreTp(b)} pierde electrones con más facilidad y es más metálico.`],
    pistas: ['Divide la energía mayor entre la menor.', 'Menor Ei, más carácter metálico.', 'Al bajar aumenta el carácter metálico.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s20-p2', titulo: 'Metales en un tramo de la tabla', unidad: '', tolerancia: E,
    objetivo: 'Contar los metales que hay entre dos números atómicos usando la clasificación de la tabla.', seccion: '18.1', para: 'el carácter metálico',
    idealizado: 'Clasificación de la tabla de la app.', metodo: 'resta de los no metales y metaloides del total', lista: UNO, x: [1, 30, 1], y: [5, 25, 1],
    respuesta: (_e, x, y) => metalesEntre(x, x + y),
    errores: (_e, x, y) => [
      ['no-metales', 'Los que no son metales', y + 1 - metalesEntre(x, x + y), 'Contaste los no metales y metaloides; se piden los metales.'],
      ['total', 'Todos los elementos', y + 1, 'Contaste todos los elementos del tramo, sin separar los metales.']
    ],
    enunciado: (_e, x, y) => `Considera los elementos de Z = ${x} a Z = ${x + y}, ambos incluidos: ${RENG_ELEMENTOS.filter((e) => e.z >= x && e.z <= x + y).map((e) => e.simbolo).join(', ')}.`,
    pregunta: '¿Cuántos de ellos son metales?',
    datos: (_e, x, y) => [['Tramo', `Z = ${x} a ${x + y}`], ['No son metales', 'H, C, N, O, P, S, Se, los halógenos, los gases nobles y los metaloides (B, Si, Ge, As, Sb, Te)']],
    pasos: (_e, x, y, rengR) => [`En el tramo hay ${y + 1} elementos; ${y + 1 - metalesEntre(x, x + y)} no son metales.`, `Metales: ${tx(rengR)}.`],
    pistas: ['Cuenta todos los elementos.', 'Descarta no metales y metaloides.', 'Lo que queda son metales.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s20-p3', titulo: 'Hidróxido a partir de un óxido básico', unidad: 'g',
    objetivo: 'Calcular el hidróxido que forma el óxido de un metal muy metálico al reaccionar con el agua.', seccion: '18.1', para: 'el carácter metálico y los óxidos básicos', masas: true,
    idealizado: 'Reacción completa con agua en exceso.', metodo: 'masas molares del núcleo', lista: RENG_OXIDOS_BASICOS_TP, x: [1, 100, 0.5],
    respuesta: ([o, h, k], x) => (x / M(o)) * k * M(h),
    errores: ([o, h, k], x) => [
      ['solo-agua', 'El agua añadida', (x / M(o)) * M('H2O'), 'Esa es la masa de agua que reacciona; el hidróxido incluye también el óxido.'],
      ['inversa', 'Proporción invertida', (x * M(o)) / (k * M(h)), 'Invertiste las masas molares: el hidróxido formado pesa más que el óxido.']
    ],
    enunciado: ([o, h], x) => `Los óxidos de los elementos más metálicos son básicos. Reaccionan ${tx(x)} g de ${T(o)} con agua y se forma ${T(h)}.`,
    pregunta: ([, h]) => `¿Qué masa de ${T(h)} se obtiene, en g?`,
    datos: ([o, h, k], x) => [['Óxido', `${tx(x)} g de ${T(o)}, ${tx(M(o), 5)} g/mol`], ['Hidróxido', `${T(h)}, ${tx(M(h), 5)} g/mol`], ['Proporción', `1 mol de óxido : ${k} mol de hidróxido`]],
    pasos: ([o, h, k], x, _y, rengR) => [`n(${T(o)}) = ${tx(x / M(o))} mol; n(${T(h)}) = ${tx((x / M(o)) * k)} mol.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa el óxido a moles.', 'Usa la proporción con el hidróxido.', 'Multiplica por su masa molar.']
  })
]

export const RENG_PRACTICAS_B03_S21: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s21-p1', titulo: 'Estado de oxidación máximo', unidad: '', tolerancia: E,
    objetivo: 'Relacionar el estado de oxidación máximo de un elemento del bloque p con su grupo.', seccion: '18.1', para: 'los estados de oxidación', pubchem: true,
    idealizado: 'Máximo teórico del grupo.', metodo: 'escena «tendencias-periodicas» (electrones de valencia)', lista: RENG_EO_MAXIMO_TP,
    respuesta: (s) => rengValenciaTp(s),
    errores: (s) => [
      ['grupo', 'El número de grupo', rengGrupoTp(s), 'El máximo es el número de electrones de valencia: en el bloque p, el grupo menos diez.'],
      ['minimo', 'El mínimo', rengValenciaTp(s) - 8, 'Ese es el estado de oxidación mínimo (electrones que le faltan, con signo negativo).']
    ],
    enunciado: (s) => `El ${rengNombreTp(s)} está en el grupo ${rengGrupoTp(s)} de la tabla periódica.`,
    pregunta: '¿Cuál es su estado de oxidación máximo?',
    datos: (s) => [['Grupo', String(rengGrupoTp(s))], ['Periodo', String(rengPeriodoTp(s))]],
    pasos: (s, _x, _y, rengR) => [`Electrones de valencia: ${rengGrupoTp(s)} − 10 = ${rengValenciaTp(s)}.`, `Máximo: +${tx(rengR)}, cuando los cede o comparte todos.`],
    pistas: ['Halla los electrones de valencia.', 'En el bloque p resta diez al grupo.', 'El máximo es positivo.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s21-p2', titulo: 'Estado de oxidación en un oxoácido', unidad: '', tolerancia: E,
    objetivo: 'Calcular el estado de oxidación del átomo central de un oxoácido.', seccion: '18.1', para: 'los estados de oxidación',
    idealizado: 'Reglas habituales: H +1 y O −2.', metodo: 'estados de oxidación del núcleo de la app', lista: RENG_OXOACIDOS_TP,
    respuesta: ([f, x]) => rengEoCentralTp(f, x),
    errores: ([f, x]) => [
      ['sin-hidrogeno', 'Sin los hidrógenos', (2 * rengDeNo(f, 'O')) / rengDeNo(f, x), 'Olvidaste los hidrógenos: cada uno aporta +1 a la suma.'],
      ['signo', 'Signo al revés', -rengEoCentralTp(f, x), 'Signo al revés: el átomo central compensa la carga negativa de los oxígenos.']
    ],
    enunciado: ([f]) => `Considera el ácido ${T(f)}, con el hidrógeno en +1 y el oxígeno en −2.`,
    pregunta: ([, x]) => `¿Cuál es el estado de oxidación del ${rengNombreTp(x)}?`,
    datos: ([f]) => [['Fórmula', T(f)], ['Reglas', 'H +1; O −2; suma 0']],
    pasos: ([f, x], _x, _y, rengR) => [`${rengDeNo(f, 'H')}(+1) + x + ${rengDeNo(f, 'O')}(−2) = 0.`, `x = +${tx(rengR)} para el ${rengNombreTp(x)}.`],
    pistas: ['Escribe la suma igual a cero.', 'Sustituye H y O.', 'Despeja el átomo central.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s21-p3', titulo: 'Estado de oxidación en un ion poliatómico', unidad: '', tolerancia: E,
    objetivo: 'Calcular el estado de oxidación del átomo central de un ion poliatómico teniendo en cuenta su carga.', seccion: '18.1', para: 'los estados de oxidación',
    idealizado: 'Reglas habituales: H +1 y O −2; valor medio si hay varios átomos centrales.', metodo: 'recuento de átomos con el analizador de fórmulas del núcleo', lista: RENG_IONES_POLI_TP,
    respuesta: ([f, x, q]) => rengEoCentralTp(f, x, q),
    errores: ([f, x, q]) => [
      ['sin-carga', 'Como si fuera neutro', rengEoCentralTp(f, x, 0), 'Olvidaste la carga del ion: la suma de los estados de oxidación es igual a la carga, no a cero.'],
      ['carga-al-reves', 'Carga con el signo cambiado', rengEoCentralTp(f, x, -q), 'Usaste la carga del ion con el signo cambiado.']
    ],
    enunciado: ([f, , q]) => `Considera el ion ${T(f)}${rengCargaAt(q)}, con el oxígeno en −2 y el hidrógeno en +1.`,
    pregunta: ([, x]) => `¿Cuál es el estado de oxidación del ${rengNombreTp(x)}?`,
    datos: ([f, , q]) => [['Ion', `${T(f)}${rengCargaAt(q)}`], ['Regla', `la suma es igual a la carga (${q > 0 ? `+${q}` : q})`]],
    pasos: ([f, x, q], _x, _y, rengR) => [`${rengDeNo(f, x)}·x + ${rengDeNo(f, 'O')}(−2) + ${rengDeNo(f, 'H')}(+1) = ${q}.`, `x = ${rengR > 0 ? '+' : ''}${tx(rengR)}.`],
    pistas: ['La suma es igual a la carga del ion.', 'Sustituye O y H.', 'Despeja y reparte entre los átomos.']
  })
]

export const RENG_PRACTICAS_B03_S22: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s22-p1', titulo: 'Contracción a lo largo de un periodo', unidad: 'pm',
    objetivo: 'Cuantificar la disminución del radio atómico entre dos elementos de un periodo.', seccion: '6.5', para: 'las tendencias periódicas', tendencias: true,
    idealizado: 'Radios de tablas de texto.', metodo: 'escena «tendencias-periodicas»', lista: RENG_PARES_PERIODO_TP,
    respuesta: ([a, b]) => rengRadioTp(a) - rengRadioTp(b),
    errores: ([a, b]) => [
      ['suma', 'Sumando', rengRadioTp(a) + rengRadioTp(b), 'Sumaste los radios; se pide cuánto disminuye, es decir, la diferencia.'],
      ['media', 'La media', (rengRadioTp(a) + rengRadioTp(b)) / 2, 'Calculaste la media de los radios; se pide la diferencia.']
    ],
    enunciado: ([a, b]) => `En el periodo ${rengPeriodoTp(a)}, el radio atómico del ${rengNombreTp(a)} (grupo ${rengGrupoTp(a)}) es ${rengRadioTp(a)} pm y el del ${rengNombreTp(b)} (grupo ${rengGrupoTp(b)}), ${rengRadioTp(b)} pm.`,
    pregunta: '¿Cuántos picómetros disminuye el radio del primero al segundo?',
    datos: ([a, b]) => [[a, `${rengRadioTp(a)} pm`], [b, `${rengRadioTp(b)} pm`]],
    pasos: ([a, b], _x, _y, rengR) => [`${rengRadioTp(a)} − ${rengRadioTp(b)}.`, `= ${tx(rengR)} pm: la carga nuclear efectiva crece a lo largo del periodo.`],
    pistas: ['Resta el radio menor del mayor.', 'El radio baja hacia la derecha.', 'La unidad es el picómetro.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s22-p2', titulo: 'Aumento de la energía de ionización', unidad: '%',
    objetivo: 'Calcular el aumento relativo de la energía de ionización entre dos elementos de un periodo.', seccion: '6.5', para: 'las tendencias periódicas', tendencias: true,
    idealizado: 'Energías de tablas de texto.', metodo: 'escena «tendencias-periodicas»', lista: RENG_PARES_PERIODO_TP,
    respuesta: ([a, b]) => ((rengEiTp(b) - rengEiTp(a)) / rengEiTp(a)) * 100,
    errores: ([a, b]) => [
      ['sobre-final', 'Sobre el valor final', ((rengEiTp(b) - rengEiTp(a)) / rengEiTp(b)) * 100, 'Dividiste entre el valor final; el aumento relativo se refiere al valor inicial.'],
      ['cociente', 'El cociente', (rengEiTp(b) / rengEiTp(a)) * 100, 'Ese es el cociente en porcentaje; falta restar el 100 % inicial.']
    ],
    enunciado: ([a, b]) => `En el periodo ${rengPeriodoTp(a)}, la primera energía de ionización pasa de ${rengEiTp(a)} kJ/mol en el ${rengNombreTp(a)} a ${rengEiTp(b)} kJ/mol en el ${rengNombreTp(b)}.`,
    pregunta: '¿Qué porcentaje aumenta respecto al primer valor?',
    datos: ([a, b]) => [[a, `${rengEiTp(a)} kJ/mol`], [b, `${rengEiTp(b)} kJ/mol`]],
    pasos: ([a, b], _x, _y, rengR) => [`(${rengEiTp(b)} − ${rengEiTp(a)})/${rengEiTp(a)} × 100.`, `= ${tx(rengR)} %.`],
    pistas: ['Resta los dos valores.', 'Divide entre el valor inicial.', 'Multiplica por cien.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s22-p3', titulo: 'Ritmo medio de la contracción', unidad: 'pm',
    objetivo: 'Calcular cuánto disminuye el radio, en promedio, por cada electrón de valencia añadido en un periodo.', seccion: '6.5', para: 'las tendencias periódicas', tendencias: true,
    idealizado: 'Variación media entre dos elementos.', metodo: 'escena «tendencias-periodicas»', lista: RENG_PARES_PERIODO_TP,
    respuesta: ([a, b]) => (rengRadioTp(a) - rengRadioTp(b)) / (rengValenciaTp(b) - rengValenciaTp(a)),
    errores: ([a, b]) => [
      ['sin-dividir', 'Sin dividir', rengRadioTp(a) - rengRadioTp(b), 'Esa es la disminución total; divídela entre el número de pasos.'],
      ['dividir-n', 'Entre el número de elementos', (rengRadioTp(a) - rengRadioTp(b)) / (rengValenciaTp(b) - rengValenciaTp(a) + 1), 'Dividiste entre el número de elementos; los pasos son uno menos.']
    ],
    enunciado: ([a, b]) => `En el periodo ${rengPeriodoTp(a)}, el ${rengNombreTp(a)} tiene ${rengValenciaTp(a)} electrones de valencia y un radio de ${rengRadioTp(a)} pm; el ${rengNombreTp(b)} tiene ${rengValenciaTp(b)} y un radio de ${rengRadioTp(b)} pm.`,
    pregunta: '¿Cuánto disminuye el radio, en promedio, por cada electrón de valencia añadido, en pm?',
    datos: ([a, b]) => [[a, `${rengValenciaTp(a)} e⁻ de valencia; ${rengRadioTp(a)} pm`], [b, `${rengValenciaTp(b)} e⁻ de valencia; ${rengRadioTp(b)} pm`]],
    pasos: ([a, b], _x, _y, rengR) => [`Disminución: ${rengRadioTp(a) - rengRadioTp(b)} pm en ${rengValenciaTp(b) - rengValenciaTp(a)} pasos.`, `Promedio: ${tx(rengR)} pm por electrón.`],
    pistas: ['Calcula la disminución total.', 'Cuenta los electrones añadidos.', 'Divide la primera entre la segunda.']
  })
]

export const RENG_PRACTICAS_B03_S23: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s23-p1', titulo: 'Predecir una propiedad por interpolación', unidad: '',
    objetivo: 'Estimar una propiedad de un elemento como media de las de sus vecinos del grupo.', seccion: '18.1', para: 'la predicción de propiedades', tendencias: true,
    idealizado: 'Interpolación lineal entre vecinos del grupo.', metodo: 'escena «tendencias-periodicas»', lista: RENG_INTERPOLACIONES_TP,
    respuesta: ([[a, , c], p]) => (rengPropTp(a, p) + rengPropTp(c, p)) / 2,
    errores: ([[a, , c], p]) => [
      ['suma', 'Suma sin dividir', rengPropTp(a, p) + rengPropTp(c, p), 'Sumaste los dos valores pero no dividiste entre dos.'],
      ['semidiferencia', 'Mitad de la diferencia', Math.abs(rengPropTp(c, p) - rengPropTp(a, p)) / 2, 'Restaste los valores en lugar de sumarlos antes de dividir.']
    ],
    enunciado: ([[a, b, c], p]) => `El ${rengNombreTp(b)} está entre el ${rengNombreTp(a)} y el ${rengNombreTp(c)} en el grupo ${rengGrupoTp(b)}. El valor de ${nombreProp(p)} es ${rengPropTp(a, p)} ${unidadProp(p)} para el ${rengNombreTp(a)} y ${rengPropTp(c, p)} ${unidadProp(p)} para el ${rengNombreTp(c)}.`,
    pregunta: ([[, b], p]) => `¿Qué valor se predice para el ${rengNombreTp(b)} por interpolación, en ${unidadProp(p)}?`,
    datos: ([[a, , c], p]) => [[a, `${rengPropTp(a, p)} ${unidadProp(p)}`], [c, `${rengPropTp(c, p)} ${unidadProp(p)}`]],
    pasos: ([[a, b, c], p], _x, _y, rengR) => [`Media: (${rengPropTp(a, p)} + ${rengPropTp(c, p)})/2.`, `= ${tx(rengR, 4)} ${unidadProp(p)}; el valor tabulado del ${rengNombreTp(b)} es ${rengPropTp(b, p)}.`],
    pistas: ['Suma los valores de los vecinos.', 'Divide el resultado entre dos.', 'Compara con el valor tabulado.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s23-p2', titulo: 'Error de una predicción', unidad: '%',
    objetivo: 'Evaluar el error relativo de una predicción por interpolación frente al valor tabulado.', seccion: '18.1', para: 'la predicción de propiedades', tendencias: true,
    idealizado: 'Interpolación lineal entre vecinos del grupo.', metodo: 'escena «tendencias-periodicas» y cociente menos uno', lista: RENG_INTERPOLACIONES_TP,
    respuesta: ([[a, b, c], p]) => (Math.abs((rengPropTp(a, p) + rengPropTp(c, p)) / 2 - rengPropTp(b, p)) / rengPropTp(b, p)) * 100,
    errores: ([[a, b, c], p], _x, _y, rengR) => [
      ['fraccion', 'En tanto por uno', rengR / 100, 'Ese valor es el error en tanto por uno; multiplícalo por cien.'],
      ['cociente', 'El cociente', (((rengPropTp(a, p) + rengPropTp(c, p)) / 2) / rengPropTp(b, p)) * 100, 'Ese es el cociente en porcentaje; el error es su diferencia respecto al 100 %.']
    ],
    enunciado: ([[a, b, c], p]) => `Para el ${rengNombreTp(b)} se predice un valor de ${nombreProp(p)} de ${tx((rengPropTp(a, p) + rengPropTp(c, p)) / 2, 4)} ${unidadProp(p)} (media de ${rengNombreTp(a)} y ${rengNombreTp(c)}). El valor tabulado es ${rengPropTp(b, p)} ${unidadProp(p)}.`,
    pregunta: '¿Qué error relativo tiene la predicción, en % (en valor absoluto)?',
    datos: ([[a, b, c], p]) => [['Predicho', `${tx((rengPropTp(a, p) + rengPropTp(c, p)) / 2, 4)} ${unidadProp(p)}`], ['Tabulado', `${rengPropTp(b, p)} ${unidadProp(p)}`]],
    pasos: ([[a, b, c], p], _x, _y, rengR) => [`Diferencia: ${tx(Math.abs((rengPropTp(a, p) + rengPropTp(c, p)) / 2 - rengPropTp(b, p)), 4)} ${unidadProp(p)}.`, `Error = diferencia/tabulado × 100 = ${tx(rengR)} %.`],
    pistas: ['Resta el valor tabulado del predicho.', 'Divide entre el valor tabulado.', 'Multiplica por cien.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s23-p3', titulo: 'Masa molar de un compuesto predicho', unidad: 'g/mol',
    objetivo: 'Predecir la fórmula del compuesto iónico de dos elementos a partir de sus grupos y calcular su masa molar.', seccion: '18.1', para: 'la predicción de fórmulas', masas: true,
    idealizado: 'Compuesto iónico neutro con los iones habituales.', metodo: 'masa molar del núcleo con la fórmula cruzada', lista: RENG_ANALOGOS_TP,
    respuesta: ([m, qm, x, qx]) => { const [a, b] = rengSubindicesTp(qm, qx); return a * A(m) + b * A(x) },
    errores: ([m, qm, x, qx]) => { const [a, b] = rengSubindicesTp(qm, qx); return [
      ['uno-a-uno', 'Proporción 1 : 1', A(m) + A(x), 'Supusiste un átomo de cada; las cargas de los iones no se compensan así.'],
      ['invertido', 'Subíndices invertidos', b * A(m) + a * A(x), 'Intercambiaste los subíndices: cada uno procede de la carga del otro ion.']
    ] },
    enunciado: ([m, qm, x, qx]) => `El ${rengNombreTp(m)} (grupo ${rengGrupoTp(m)}) forma iones ${m}${rengCargaAt(qm)} y el ${rengNombreTp(x)} (grupo ${rengGrupoTp(x)}), iones ${x}${rengCargaAt(-qx)}.`,
    pregunta: '¿Cuál es la masa molar del compuesto iónico neutro que forman, en g/mol?',
    datos: ([m, qm, x, qx]) => [[m, `${rengCargaAt(qm)}; ${tx(A(m), 5)} g/mol`], [x, `${rengCargaAt(-qx)}; ${tx(A(x), 5)} g/mol`]],
    pasos: ([m, qm, x, qx], _x, _y, rengR) => [`Fórmula neutra: ${T(formulaIonica(m, qm, x, qx))}.`, `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Deduce las cargas de los iones.', 'Cruza las cargas para la fórmula.', 'Suma las masas atómicas.']
  })
]
