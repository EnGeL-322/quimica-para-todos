import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_DIATOMICAS, RENG_ENERGIAS_INTERACCION } from '../nucleo/datosEnlace'
import {
  RENG_COMBUSTIBLES_EN, RENG_EV_EN, RENG_NA_EN, RENG_OM_EN, RENG_PARES_OM_EN, RENG_TOL_EN_ENT, rengAtomosTotalesEn, rengElectronesEn, rengPracticaEn, rengSumaEnlacesEn, rengTextoBalanceEn, rengValenciaTotalEn
} from './b04-comun'
import { rengCoulombEn } from './b04-s01-s08'
import { rengAtomosNo, rengMNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const M = rengMNo
const E = RENG_TOL_EN_ENT
const UNO: readonly number[] = [0]
const K = 273.15
const EH = RENG_ENERGIAS_INTERACCION.puenteH!.valor!
const EOH = RENG_ENERGIAS_INTERACCION.covalenteOH!.valor!
const EAR = RENG_ENERGIAS_INTERACCION.londonAr!.valor!
const D = (rengF: string): number => RENG_DIATOMICAS[rengF]!.D0 * RENG_EV_EN
export const RENG_TABLAS_INTER_NOTA_EN = 'Puntos de ebullición y de fusión, entalpías de vaporización y profundidades de pozo que no proceden del núcleo de la app: valores de tablas de libros de texto recordados, no contrastados en esta entrega.'
export const RENG_APOLARES_EN: readonly string[] = ['F2', 'Cl2', 'Br2', 'I2', 'N2', 'O2', 'CH4', 'C2H6', 'C3H8', 'C4H10', 'CO2', 'CCl4', 'SiH4', 'Ne', 'Ar', 'Kr', 'Xe', 'H2', 'CF4', 'SF6', 'C6H6', 'CS2', 'C5H12', 'C6H14']
export const RENG_POZOS_EN: ReadonlyArray<readonly [string, number]> = [['neón', 0.3], ['argón', EAR], ['kriptón', 1.42], ['xenón', 1.84], ['nitrógeno', 0.79], ['oxígeno', 0.98], ['metano', 1.23]]
export type RengParTemperaturaEn = readonly [a: string, ta: number, b: string, tb: number]
export const RENG_SERIES_EBULLICION_EN: readonly RengParTemperaturaEn[] = [
  ['F₂', -188.1, 'Cl₂', -34], ['Cl₂', -34, 'Br₂', 58.8], ['Br₂', 58.8, 'I₂', 184.3], ['F₂', -188.1, 'Br₂', 58.8], ['He', -268.9, 'Ne', -246], ['Ne', -246, 'Ar', -185.85], ['Ar', -185.85, 'Kr', -153.4], ['Kr', -153.4, 'Xe', -108.1],
  ['CH₄', -161.5, 'C₂H₆', -88.6], ['C₂H₆', -88.6, 'C₃H₈', -42.1], ['C₃H₈', -42.1, 'C₄H₁₀', -0.5], ['C₄H₁₀', -0.5, 'C₅H₁₂', 36.1], ['C₅H₁₂', 36.1, 'C₆H₁₄', 68.7], ['CH₄', -161.5, 'C₄H₁₀', -0.5], ['Ne', -246, 'Xe', -108.1]
]
export const RENG_POLAR_APOLAR_EN: readonly RengParTemperaturaEn[] = [
  ['Ar', -185.85, 'HCl', -85.05], ['butano', -0.5, 'acetona', 56.1], ['propano', -42.1, 'clorometano', -24.2], ['propano', -42.1, 'etanal', 20.2], ['propano', -42.1, 'acetonitrilo', 81.6], ['propano', -42.1, 'éter dimetílico', -24.8],
  ['etano', -88.6, 'fluorometano', -78.4], ['N₂', -195.8, 'CO', -191.5], ['SiH₄', -112, 'PH₃', -87.7], ['Br₂', 58.8, 'ICl', 97.4], ['O₂', -183, 'NO', -151.8], ['Kr', -153.4, 'HBr', -66.4], ['Xe', -108.1, 'HI', -35.4], ['Ar', -185.85, 'H₂S', -59.55],
  ['Cl₂', -34, 'SO₂', -10], ['N₂', -195.8, 'HCN', 25.6], ['etano', -88.6, 'metanal', -19], ['butano', -0.5, 'nitrometano', 101.2]
]
export const RENG_VAPORIZACION_POLARES_EN: ReadonlyArray<readonly [string, string, number]> = [
  ['cloruro de hidrógeno', 'HCl', 16.2], ['sulfuro de hidrógeno', 'H2S', 18.7], ['dióxido de azufre', 'SO2', 24.9], ['acetona', 'C3H6O', 29.1], ['clorometano', 'CH3Cl', 21.4], ['cloroformo', 'CHCl3', 29.2], ['bromuro de hidrógeno', 'HBr', 17.6],
  ['fosfina', 'PH3', 14.6], ['etanal', 'C2H4O', 25.8], ['éter dimetílico', 'C2H6O', 21.5], ['diclorometano', 'CH2Cl2', 28.1], ['yoduro de hidrógeno', 'HI', 19.8]
]
export const RENG_PUENTES_EN: ReadonlyArray<readonly [string, string, number, number]> = [
  ['agua', 'H2O', 2, 2], ['amoníaco', 'NH3', 3, 1], ['fluoruro de hidrógeno', 'HF', 1, 3], ['metanol', 'CH4O', 1, 2], ['etanol', 'C2H6O', 1, 2], ['peróxido de hidrógeno', 'H2O2', 2, 4], ['hidracina', 'N2H4', 4, 2], ['metilamina', 'CH5N', 2, 1],
  ['ácido fórmico', 'CH2O2', 1, 4], ['ácido acético', 'C2H4O2', 1, 4], ['etilenglicol', 'C2H6O2', 2, 4], ['glicerol', 'C3H8O3', 3, 6], ['dimetilamina', 'C2H7N', 1, 1], ['acetona', 'C3H6O', 0, 2], ['éter dimetílico', 'C2H6O', 0, 2], ['metanal', 'CH2O', 0, 2],
  ['trimetilamina', 'C3H9N', 0, 1], ['fenol', 'C6H6O', 1, 2], ['etanal', 'C2H4O', 0, 2]
]
export const RENG_VAPORIZACION_EN: ReadonlyArray<readonly [string, string, number, number]> = [
  ['agua', 'H2O', 40.7, 100], ['etanol', 'C2H6O', 38.6, 78.4], ['amoníaco', 'NH3', 23.3, -33.3], ['metano', 'CH4', 8.2, -161.5], ['argón', 'Ar', 6.4, -185.85], ['nitrógeno', 'N2', 5.6, -195.8], ['benceno', 'C6H6', 30.7, 80.1], ['hexano', 'C6H14', 28.9, 68.7],
  ['metanol', 'CH4O', 35.2, 64.7], ['acetona', 'C3H6O', 29.1, 56.1], ['oxígeno', 'O2', 6.8, -183], ['propano', 'C3H8', 19, -42.1], ['tetracloruro de carbono', 'CCl4', 29.8, 76.7], ['éter dietílico', 'C4H10O', 26.5, 34.6], ['butano', 'C4H10', 22.4, -0.5]
]
export const RENG_COCIENTES_VAP_EN: ReadonlyArray<readonly [number, number]> = [[0, 3], [1, 11], [0, 2], [8, 3], [2, 3], [0, 4], [14, 11], [7, 14], [9, 14], [1, 13], [8, 11], [10, 5], [12, 3], [2, 4], [0, 11], [6, 3]]
export const RENG_FUERTES_EN: ReadonlyArray<readonly [string, number]> = [
  ['el enlace covalente O–H del agua', EOH], ['el enlace H–H', D('H2')], ['el enlace triple del N₂', D('N2')], ['el enlace doble del O₂', D('O2')], ['el enlace Cl–Cl', D('Cl2')], ['el enlace H–Cl', D('HCl')],
  ['un par de iones Na⁺ y Cl⁻ en contacto', rengCoulombEn('Na', 'Cl')], ['un par de iones Mg²⁺ y O²⁻ en contacto', rengCoulombEn('Mg', 'O')]
]
export const RENG_DEBILES_EN: ReadonlyArray<readonly [string, number]> = [['la atracción entre dos átomos de argón', EAR], ['el puente de hidrógeno del dímero de agua', EH]]
export const RENG_COMPARACIONES_EN: ReadonlyArray<readonly [number, number]> = RENG_FUERTES_EN.flatMap((_f, i) => RENG_DEBILES_EN.map((_d, j) => [i, j] as const))
export const RENG_FUSIONES_EN: ReadonlyArray<readonly [string, string, number, string, string, number]> = [
  ['cloruro de sodio', 'iónico', 801, 'hielo', 'molecular', 0], ['óxido de magnesio', 'iónico', 2852, 'cloruro de sodio', 'iónico', 801], ['cobre', 'metálico', 1085, 'yodo', 'molecular', 113.7], ['hierro', 'metálico', 1538, 'sodio', 'metálico', 97.8],
  ['cuarzo', 'covalente reticular', 1710, 'naftaleno', 'molecular', 80.3], ['fluoruro de sodio', 'iónico', 993, 'bromuro de potasio', 'iónico', 734], ['wolframio', 'metálico', 3422, 'aluminio', 'metálico', 660.3],
  ['óxido de calcio', 'iónico', 2572, 'cloruro de potasio', 'iónico', 770], ['cloruro de sodio', 'iónico', 801, 'yodo', 'molecular', 113.7], ['oro', 'metálico', 1064, 'sodio', 'metálico', 97.8], ['óxido de aluminio', 'iónico', 2072, 'hielo', 'molecular', 0],
  ['plata', 'metálico', 962, 'naftaleno', 'molecular', 80.3], ['fluoruro de litio', 'iónico', 845, 'hielo', 'molecular', 0], ['óxido de magnesio', 'iónico', 2852, 'cobre', 'metálico', 1085], ['hierro', 'metálico', 1538, 'cloruro de sodio', 'iónico', 801],
  ['cuarzo', 'covalente reticular', 1710, 'cloruro de sodio', 'iónico', 801]
]
export const rengCombustionEn = (rengI: number): number => rengSumaEnlacesEn(RENG_COMBUSTIBLES_EN[rengI]![2]) - rengSumaEnlacesEn(RENG_COMBUSTIBLES_EN[rengI]![3])
const nH = (rengF: string): number => rengAtomosNo(rengF).get('H') ?? 0
const orden = (rengB: number, rengA: number): number => (rengB - rengA) / 2
const vap = (rengI: number): readonly [string, string, number, number] => RENG_VAPORIZACION_EN[rengI]!

export const RENG_PRACTICAS_B04_S17: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s17-p1', titulo: 'Electrones de una molécula apolar', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones de una molécula apolar para comparar la intensidad de sus fuerzas de dispersión.', seccion: '10.1', para: 'las fuerzas de dispersión',
    idealizado: 'La dispersión crece con el número de electrones.', metodo: 'suma de números atómicos con el analizador de fórmulas del núcleo', lista: RENG_APOLARES_EN,
    respuesta: (f) => rengElectronesEn(f),
    errores: (f) => [
      ['valencia', 'Solo los de valencia', rengValenciaTotalEn(f), 'Contaste solo los electrones de valencia; para la dispersión cuentan todos.'],
      ['atomos', 'Los átomos', rengAtomosTotalesEn(f), 'Contaste los átomos; cada átomo neutro aporta tantos electrones como su número atómico.']
    ],
    enunciado: (f) => `Las fuerzas de London de una sustancia apolar crecen con el número de electrones de sus moléculas. Considera ${T(f)}.`,
    pregunta: '¿Cuántos electrones tiene en total una de sus moléculas (o átomos)?',
    datos: (f) => [['Fórmula', T(f)], ['Regla', 'cada átomo neutro tiene Z electrones']],
    pasos: (f, _x, _y, rengR) => ['Se suma el número atómico de cada átomo multiplicado por su subíndice.', `Total: ${tx(rengR)} electrones.`],
    pistas: ['Busca el Z de cada elemento.', 'Multiplica por los subíndices.', 'Suma todas las contribuciones.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s17-p2', titulo: 'Energía para separar pares de moléculas', unidad: 'kJ',
    objetivo: 'Calcular la energía necesaria para separar pares de partículas unidas solo por fuerzas de dispersión.', seccion: '10.1', para: 'las fuerzas de dispersión', nucleo: true, tablas: true,
    idealizado: 'Pares aislados en fase gas.', metodo: 'escena «interaccion-molecular» en la distancia de equilibrio', sinVerificar: [RENG_TABLAS_INTER_NOTA_EN], lista: RENG_POZOS_EN, x: [0.1, 5, 0.1],
    respuesta: ([, e], x) => e * x,
    errores: ([, e], x) => [
      ['dividir', 'Dividiendo', e / x, 'Dividiste la energía entre los moles; hay que multiplicar.'],
      ['doble', 'Contando cada par dos veces', 2 * e * x, 'Contaste cada par dos veces: el pozo ya es la energía de un par.']
    ],
    enunciado: ([n, e], x) => `El pozo de interacción entre dos partículas de ${n} es de ${tx(e)} kJ por mol de pares. Se separan ${tx(x)} mol de pares.`,
    pregunta: '¿Qué energía hace falta, en kJ?',
    datos: ([, e], x) => [['Profundidad del pozo', `${tx(e)} kJ/mol`], ['Cantidad', `${tx(x)} mol de pares`]],
    pasos: ([, e], x, _y, rengR) => [`E = n × ε = ${tx(x)} × ${tx(e)}.`, `E = ${tx(rengR)} kJ: mucho menos que para romper enlaces covalentes.`],
    pistas: ['El pozo es energía por mol de pares.', 'Multiplica por los moles.', 'Compara con un enlace covalente.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s17-p3', titulo: 'Ebullición en una serie de sustancias apolares', unidad: '',
    objetivo: 'Cuantificar cómo sube el punto de ebullición al aumentar el número de electrones en una serie apolar.', seccion: '10.1', para: 'las fuerzas de dispersión', tablas: true,
    idealizado: 'Sustancias apolares de la misma serie.', metodo: 'resta en la escala kelvin', sinVerificar: [RENG_TABLAS_INTER_NOTA_EN], lista: RENG_SERIES_EBULLICION_EN,
    respuesta: ([, ta, , tb]) => tb - ta,
    errores: ([, ta, , tb]) => [
      ['suma', 'Sumando', ta + tb, 'Sumaste las dos temperaturas; se pide la diferencia.'],
      ['al-reves', 'Resta al revés', ta - tb, 'Restaste al revés: la sustancia con más electrones hierve a mayor temperatura.']
    ],
    enunciado: ([a, ta, b, tb]) => `El ${a} hierve a ${tx(ta, 5)} °C y el ${b}, de la misma serie pero con más electrones, a ${tx(tb, 5)} °C.`,
    pregunta: ([a, , b]) => `¿Cuántos grados más alto hierve el ${b} que el ${a}?`,
    datos: ([a, ta, b, tb]) => [[a, `${tx(ta, 5)} °C`], [b, `${tx(tb, 5)} °C`]],
    pasos: ([, ta, , tb], _x, _y, rengR) => [`${tx(tb, 5)} − (${tx(ta, 5)}).`, `= ${tx(rengR, 4)} grados: más electrones, más dispersión.`],
    pistas: ['Resta las dos temperaturas.', 'Cuida los signos negativos.', 'Más electrones, mayor ebullición.']
  })
]

export const RENG_PRACTICAS_B04_S18: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s18-p1', titulo: 'Efecto de la polaridad en la ebullición', unidad: '',
    objetivo: 'Comparar el punto de ebullición de una sustancia polar con el de una apolar de masa parecida.', seccion: '10.1', para: 'las atracciones dipolo-dipolo', nucleo: true, tablas: true,
    idealizado: 'Sustancias de masa molar parecida.', metodo: 'resta en la escala kelvin', sinVerificar: [RENG_TABLAS_INTER_NOTA_EN], lista: RENG_POLAR_APOLAR_EN,
    respuesta: ([, ta, , tb]) => tb - ta,
    errores: ([, ta, , tb]) => [
      ['suma', 'Sumando', ta + tb, 'Sumaste las dos temperaturas; se pide la diferencia.'],
      ['al-reves', 'Resta al revés', ta - tb, 'Restaste al revés: la sustancia polar hierve a mayor temperatura.']
    ],
    enunciado: ([a, ta, b, tb]) => `El ${a} (apolar) hierve a ${tx(ta, 5)} °C y el ${b} (polar, de masa molar parecida), a ${tx(tb, 5)} °C.`,
    pregunta: '¿Cuántos grados más alto hierve la sustancia polar?',
    datos: ([a, ta, b, tb]) => [[a, `${tx(ta, 5)} °C`], [b, `${tx(tb, 5)} °C`]],
    pasos: ([, ta, , tb], _x, _y, rengR) => [`${tx(tb, 5)} − (${tx(ta, 5)}).`, `= ${tx(rengR, 4)} grados: las atracciones entre dipolos se suman a la dispersión.`],
    pistas: ['Resta las dos temperaturas.', 'Cuida los signos negativos.', 'La polar hierve más alto.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s18-p2', titulo: 'Temperaturas absolutas de ebullición', unidad: '',
    objetivo: 'Comparar en la escala absoluta los puntos de ebullición de una sustancia polar y una apolar.', seccion: '10.1', para: 'las atracciones dipolo-dipolo', nucleo: true, tablas: true,
    idealizado: 'Sustancias de masa molar parecida.', metodo: 'conversión a kelvin con el catálogo de unidades', sinVerificar: [RENG_TABLAS_INTER_NOTA_EN], lista: RENG_POLAR_APOLAR_EN,
    respuesta: ([, ta, , tb]) => (tb + K) / (ta + K),
    errores: ([, ta, , tb]) => [
      ['celsius', 'Con grados Celsius', tb / ta, 'Dividiste temperaturas en grados Celsius; los cocientes solo tienen sentido en kelvin.'],
      ['diferencia', 'La diferencia', tb - ta, 'Calculaste la diferencia de temperaturas; se pide el cociente de las temperaturas absolutas.']
    ],
    enunciado: ([a, ta, b, tb]) => `El ${a} (apolar) hierve a ${tx(ta, 5)} °C y el ${b} (polar), a ${tx(tb, 5)} °C.`,
    pregunta: '¿Cuántas veces mayor es la temperatura absoluta de ebullición de la sustancia polar?',
    datos: ([a, ta, b, tb]) => [[a, `${tx(ta, 5)} °C = ${tx(ta + K, 5)} K`], [b, `${tx(tb, 5)} °C = ${tx(tb + K, 5)} K`]],
    pasos: ([, ta, , tb], _x, _y, rengR) => [`T = t + 273,15: ${tx(tb + K, 5)} K y ${tx(ta + K, 5)} K.`, `Cociente = ${tx(rengR)}.`],
    pistas: ['Pasa las dos temperaturas a kelvin.', 'Divide la mayor entre la menor.', 'No dividas grados Celsius.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s18-p3', titulo: 'Vaporizar una sustancia polar', unidad: 'kJ',
    objetivo: 'Calcular la energía necesaria para vaporizar una masa de una sustancia polar.', seccion: '10.1', para: 'las atracciones dipolo-dipolo', tablas: true, masas: true,
    idealizado: 'Vaporización a la temperatura de ebullición normal.', metodo: 'masa molar del núcleo de la app', sinVerificar: [RENG_TABLAS_INTER_NOTA_EN], lista: RENG_VAPORIZACION_POLARES_EN, x: [5, 200, 5],
    respuesta: ([, f, h], x) => (x / M(f)) * h,
    errores: ([, f, h], x) => [
      ['sin-moles', 'Sin pasar a moles', x * h, 'La entalpía de vaporización es por mol: pasa antes los gramos a moles.'],
      ['dividir', 'Dividiendo', h / (x / M(f)), 'Dividiste la entalpía entre los moles; hay que multiplicar.']
    ],
    enunciado: ([n, f, h], x) => `La entalpía de vaporización del ${n}, ${T(f)}, es ${tx(h)} kJ/mol. Se vaporizan ${tx(x)} g.`,
    pregunta: '¿Qué energía hace falta, en kJ?',
    datos: ([, f, h], x) => [['Masa', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['ΔH de vaporización', `${tx(h)} kJ/mol`]],
    pasos: ([, f, h], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol.`, `E = n × ${tx(h)} = ${tx(rengR)} kJ.`],
    pistas: ['Pasa los gramos a moles.', 'Multiplica por la entalpía molar.', 'Solo se separan moléculas.']
  })
]

export const RENG_PRACTICAS_B04_S19: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s19-p1', titulo: 'Enlaces de hidrógeno posibles', unidad: '', tolerancia: E,
    objetivo: 'Contar los enlaces de hidrógeno que puede formar una molécula como dadora y como aceptora.', seccion: '10.1', para: 'los enlaces de hidrógeno', lewis: true,
    idealizado: 'Máximo teórico: un enlace por cada H dador y por cada par libre de N, O o F.', metodo: 'recuento separado de dadores y aceptores', lista: RENG_PUENTES_EN,
    respuesta: ([, , d, a]) => d + a,
    errores: ([, f, d, a]) => [
      ['solo-dadores', 'Solo como dadora', d, 'Contaste solo los hidrógenos dadores; faltan los pares libres aceptores.'],
      ['todos-los-h', 'Todos los hidrógenos', nH(f) + a, 'Contaste todos los hidrógenos; solo cuentan los unidos a N, O o F.']
    ],
    enunciado: ([n, f, d, a]) => `Una molécula de ${n}, ${T(f)}, tiene ${d} ${d === 1 ? 'hidrógeno unido' : 'hidrógenos unidos'} a N, O o F y ${a} ${a === 1 ? 'par libre' : 'pares libres'} sobre átomos de N, O o F.`,
    pregunta: '¿Cuántos enlaces de hidrógeno puede formar como máximo?',
    datos: ([, , d, a]) => [['Hidrógenos dadores', String(d)], ['Pares libres aceptores', String(a)]],
    pasos: ([, , d, a], _x, _y, rengR) => [`Como dadora: ${d}; como aceptora: ${a}.`, `Máximo: ${tx(rengR)} enlaces de hidrógeno.`],
    pistas: ['Cuenta los H unidos a N, O o F.', 'Cuenta los pares libres de N, O o F.', 'Suma dadores y aceptores.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s19-p2', titulo: 'Energía de los enlaces de hidrógeno', unidad: 'kJ',
    objetivo: 'Calcular la energía necesaria para separar enlaces de hidrógeno y compararla con la de un enlace covalente.', seccion: '10.1', para: 'los enlaces de hidrógeno', nucleo: true,
    idealizado: 'Dímeros de agua en fase gas.', metodo: 'escena «interaccion-molecular» en la distancia de equilibrio', lista: UNO, x: [0.1, 5, 0.1],
    respuesta: (_e, x) => x * EH,
    errores: (_e, x) => [
      ['covalente', 'Con el enlace covalente', x * EOH, 'Usaste la energía del enlace covalente O–H; al separar el dímero solo se rompe el enlace de hidrógeno.'],
      ['dividir', 'Dividiendo', EH / x, 'Dividiste la energía entre los moles; hay que multiplicar.']
    ],
    enunciado: (_e, x) => `Separar las dos moléculas de un dímero de agua cuesta ${tx(EH)} kJ/mol; romper un enlace covalente O–H, ${tx(EOH, 4)} kJ/mol. Se separan ${tx(x)} mol de dímeros.`,
    pregunta: '¿Qué energía hace falta para separar los dímeros, en kJ?',
    datos: (_e, x) => [['Enlace de hidrógeno', `${tx(EH)} kJ/mol`], ['Cantidad', `${tx(x)} mol`]],
    pasos: (_e, x, _y, rengR) => [`E = n × ${tx(EH)} = ${tx(x)} × ${tx(EH)}.`, `E = ${tx(rengR)} kJ.`],
    pistas: ['Solo se rompe el enlace de hidrógeno.', 'La energía es por mol de dímeros.', 'Multiplica por los moles.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s19-p3', titulo: 'Enlaces de hidrógeno en el hielo', unidad: '',
    objetivo: 'Contar los enlaces de hidrógeno de una cantidad de hielo, donde cada molécula participa en cuatro.', seccion: '10.1', para: 'los enlaces de hidrógeno',
    idealizado: 'Hielo perfecto: cada molécula forma cuatro enlaces, compartidos con sus vecinas.', metodo: 'recuento con dos enlaces propios por molécula', lista: UNO, x: [0.1, 5, 0.1],
    respuesta: (_e, x) => (2 * x * RENG_NA_EN) / 1e23,
    errores: (_e, x) => [
      ['cuatro', 'Cuatro por molécula', (4 * x * RENG_NA_EN) / 1e23, 'Contaste cada enlace dos veces: cada enlace de hidrógeno une dos moléculas.'],
      ['uno', 'Uno por molécula', (x * RENG_NA_EN) / 1e23, 'Cada molécula participa en cuatro enlaces, que se comparten: tocan a dos por molécula.']
    ],
    enunciado: (_e, x) => `En el hielo, cada molécula de agua participa en cuatro enlaces de hidrógeno, y cada enlace une dos moléculas. Se tienen ${tx(x)} mol de hielo.`,
    pregunta: '¿Cuántos enlaces de hidrógeno hay, en múltiplos de 10²³?',
    datos: (_e, x) => [['Cantidad', `${tx(x)} mol`], ['Enlaces por molécula', '4, compartidos entre dos']],
    pasos: (_e, x, _y, rengR) => [`Enlaces por molécula: 4/2 = 2.`, `N = 2 × ${tx(x)} × 6,022·10²³ = ${tx(rengR)}·10²³.`],
    pistas: ['Cada enlace une dos moléculas.', 'A cada molécula le tocan dos.', 'Multiplica por N_A.']
  })
]

export const RENG_PRACTICAS_B04_S20: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s20-p1', titulo: 'Energía para vaporizar una sustancia', unidad: 'kJ',
    objetivo: 'Calcular la energía necesaria para vaporizar una masa de sustancia venciendo sus fuerzas intermoleculares.', seccion: '10.1', para: 'las fuerzas intermoleculares', tablas: true, masas: true,
    idealizado: 'Vaporización a la temperatura de ebullición normal.', metodo: 'masa molar del núcleo de la app', sinVerificar: [RENG_TABLAS_INTER_NOTA_EN], lista: RENG_VAPORIZACION_EN, x: [5, 200, 5],
    respuesta: ([, f, h], x) => (x / M(f)) * h,
    errores: ([, f, h], x) => [
      ['sin-moles', 'Sin pasar a moles', x * h, 'La entalpía de vaporización es por mol: pasa antes los gramos a moles.'],
      ['dividir', 'Dividiendo', h / (x / M(f)), 'Dividiste la entalpía entre los moles; hay que multiplicar.']
    ],
    enunciado: ([n, f, h], x) => `Vaporizar un mol de ${n}, ${T(f)}, requiere ${tx(h)} kJ. Se vaporizan ${tx(x)} g.`,
    pregunta: '¿Qué energía hace falta, en kJ?',
    datos: ([, f, h], x) => [['Masa', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['ΔH de vaporización', `${tx(h)} kJ/mol`]],
    pasos: ([, f, h], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol.`, `E = n × ${tx(h)} = ${tx(rengR)} kJ.`],
    pistas: ['Pasa los gramos a moles.', 'Multiplica por la entalpía molar.', 'No se rompen las moléculas.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s20-p2', titulo: 'Comparar fuerzas intermoleculares', unidad: '',
    objetivo: 'Comparar la intensidad de las fuerzas intermoleculares de dos sustancias con sus entalpías de vaporización.', seccion: '10.1', para: 'las fuerzas intermoleculares', tablas: true,
    idealizado: 'La entalpía de vaporización mide las fuerzas entre moléculas.', metodo: 'cociente calculado por la inversa', sinVerificar: [RENG_TABLAS_INTER_NOTA_EN], lista: RENG_COCIENTES_VAP_EN,
    respuesta: ([i, j]) => vap(i)[2] / vap(j)[2],
    errores: ([i, j]) => [
      ['inverso', 'Cociente invertido', vap(j)[2] / vap(i)[2], 'Dividiste al revés: la primera sustancia va en el numerador.'],
      ['diferencia', 'La diferencia', vap(i)[2] - vap(j)[2], 'Calculaste la diferencia en kJ/mol; se pide cuántas veces mayor es.']
    ],
    enunciado: ([i, j]) => `La entalpía de vaporización del ${vap(i)[0]} es ${tx(vap(i)[2])} kJ/mol y la del ${vap(j)[0]}, ${tx(vap(j)[2])} kJ/mol.`,
    pregunta: ([i, j]) => `¿Cuántas veces mayor es la del ${vap(i)[0]} que la del ${vap(j)[0]}?`,
    datos: ([i, j]) => [[vap(i)[0], `${tx(vap(i)[2])} kJ/mol`], [vap(j)[0], `${tx(vap(j)[2])} kJ/mol`]],
    pasos: ([i, j], _x, _y, rengR) => [`${tx(vap(i)[2])}/${tx(vap(j)[2])}.`, `= ${tx(rengR)}: sus moléculas se atraen con más fuerza.`],
    pistas: ['Divide las dos entalpías.', 'La primera va en el numerador.', 'Más entalpía, fuerzas más intensas.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s20-p3', titulo: 'Entropía de vaporización', unidad: 'J/(mol·K)',
    objetivo: 'Calcular la entropía de vaporización de una sustancia como cociente entre su entalpía de vaporización y su temperatura de ebullición.', seccion: '10.1', para: 'las fuerzas intermoleculares', tablas: true,
    idealizado: 'Vaporización reversible a la temperatura de ebullición normal.', metodo: 'conversión de unidades con el catálogo de la app', sinVerificar: [RENG_TABLAS_INTER_NOTA_EN], lista: RENG_VAPORIZACION_EN,
    respuesta: ([, , h, t]) => (h * 1000) / (t + K),
    errores: ([, , h, t]) => [
      ['celsius', 'Con grados Celsius', (h * 1000) / t, 'Dividiste entre la temperatura en grados Celsius; hay que usar kelvin.'],
      ['sin-mil', 'Sin pasar a julios', h / (t + K), 'Ese resultado está en kJ/(mol·K); multiplícalo por 1000 para pasarlo a J/(mol·K).']
    ],
    enunciado: ([n, , h, t]) => `El ${n} hierve a ${tx(t, 5)} °C y su entalpía de vaporización es ${tx(h)} kJ/mol. La entropía de vaporización es ΔS = ΔH/T, con T en kelvin.`,
    pregunta: '¿Cuánto vale su entropía de vaporización, en J/(mol·K)?',
    datos: ([, , h, t]) => [['ΔH de vaporización', `${tx(h)} kJ/mol`], ['Temperatura de ebullición', `${tx(t, 5)} °C = ${tx(t + K, 5)} K`]],
    pasos: ([, , h, t], _x, _y, rengR) => [`ΔS = ${tx(h * 1000, 4)} J/mol / ${tx(t + K, 5)} K.`, `ΔS = ${tx(rengR)} J/(mol·K); muchos líquidos sin enlaces de hidrógeno dan valores cercanos a 88.`],
    pistas: ['Pasa la temperatura a kelvin.', 'Pasa la entalpía a julios.', 'Divide la entalpía entre la temperatura.']
  })
]

export const RENG_PRACTICAS_B04_S21: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s21-p1', titulo: 'Enlaces frente a fuerzas intermoleculares', unidad: '',
    objetivo: 'Comparar la energía de un enlace con la de una interacción entre moléculas.', seccion: '10.5', para: 'la relación entre enlace y propiedades', nucleo: true,
    idealizado: 'Datos de moléculas y pares aislados.', metodo: 'datos y funciones del núcleo de la app', sinVerificar: ['Los radios iónicos usados para los pares de iones son valores de tablas de texto recordados.'], lista: RENG_COMPARACIONES_EN,
    respuesta: ([i, j]) => RENG_FUERTES_EN[i]![1] / RENG_DEBILES_EN[j]![1],
    errores: ([i, j]) => [
      ['inverso', 'Cociente invertido', RENG_DEBILES_EN[j]![1] / RENG_FUERTES_EN[i]![1], 'Dividiste al revés: la energía del enlace va en el numerador.'],
      ['diferencia', 'La diferencia', RENG_FUERTES_EN[i]![1] - RENG_DEBILES_EN[j]![1], 'Calculaste la diferencia en kJ/mol; se pide cuántas veces mayor es.']
    ],
    enunciado: ([i, j]) => `Romper ${RENG_FUERTES_EN[i]![0]} cuesta ${tx(RENG_FUERTES_EN[i]![1], 4)} kJ/mol; vencer ${RENG_DEBILES_EN[j]![0]} cuesta ${tx(RENG_DEBILES_EN[j]![1])} kJ/mol.`,
    pregunta: '¿Cuántas veces mayor es la primera energía que la segunda?',
    datos: ([i, j]) => [['Enlace', `${tx(RENG_FUERTES_EN[i]![1], 4)} kJ/mol`], ['Interacción', `${tx(RENG_DEBILES_EN[j]![1])} kJ/mol`]],
    pasos: ([i, j], _x, _y, rengR) => [`${tx(RENG_FUERTES_EN[i]![1], 4)}/${tx(RENG_DEBILES_EN[j]![1])}.`, `= ${tx(rengR)} veces: por eso fundir o hervir una sustancia molecular cuesta poco.`],
    pistas: ['Divide la energía mayor entre la menor.', 'Los enlaces son mucho más fuertes.', 'Relaciónalo con los puntos de fusión.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s21-p2', titulo: 'Energía de un combustible', unidad: 'kJ',
    objetivo: 'Estimar la energía que libera la combustión de una masa de combustible a partir de sus energías de enlace.', seccion: '7.5', para: 'la relación entre enlace y energía', tablas: true, masas: true,
    idealizado: 'Combustión completa a CO₂ y H₂O en fase gas, con energías medias de enlace.', metodo: 'masa molar del núcleo y balance enlace a enlace', sinVerificar: ['Energías medias de enlace (kJ/mol) de tablas de texto recordadas: son promedios y dan solo una estimación.'], lista: RENG_COMBUSTIBLES_EN.map((_c, i) => i), x: [1, 100, 1],
    respuesta: (i, x) => (x / M(RENG_COMBUSTIBLES_EN[i]![1])) * -rengCombustionEn(i),
    errores: (i, x) => [
      ['por-mol', 'Energía de un mol', -rengCombustionEn(i), 'Esa es la energía por mol de combustible; aquí hay otra cantidad.'],
      ['sin-moles', 'Sin pasar a moles', x * -rengCombustionEn(i), 'Multiplicaste por los gramos; pasa antes la masa a moles.']
    ],
    enunciado: (i, x) => `Al quemar un mol de ${RENG_COMBUSTIBLES_EN[i]![0]}, ${T(RENG_COMBUSTIBLES_EN[i]![1])}, se rompen ${rengTextoBalanceEn(RENG_COMBUSTIBLES_EN[i]![2])} y se forman ${rengTextoBalanceEn(RENG_COMBUSTIBLES_EN[i]![3])}; el balance es de ${tx(rengCombustionEn(i), 4)} kJ/mol. Se queman ${x} g.`,
    pregunta: '¿Qué energía se libera, en kJ?',
    datos: (i, x) => [['Balance', `${tx(rengCombustionEn(i), 4)} kJ/mol`], ['Masa molar', `${tx(M(RENG_COMBUSTIBLES_EN[i]![1]), 5)} g/mol`], ['Masa', `${x} g`]],
    pasos: (i, x, _y, rengR) => [`n = ${x}/${tx(M(RENG_COMBUSTIBLES_EN[i]![1]), 5)} = ${tx(x / M(RENG_COMBUSTIBLES_EN[i]![1]))} mol.`, `E = n × ${tx(-rengCombustionEn(i), 4)} = ${tx(rengR)} kJ liberados.`],
    pistas: ['Pasa los gramos a moles.', 'Usa el balance por mol.', 'Multiplica moles por energía.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s21-p3', titulo: 'Puntos de fusión y tipo de sólido', unidad: '',
    objetivo: 'Comparar en la escala absoluta los puntos de fusión de dos sólidos de distinto tipo de enlace.', seccion: '10.5', para: 'los tipos de sólidos', tablas: true,
    idealizado: 'Sustancias puras a presión normal.', metodo: 'conversión a kelvin con el catálogo de unidades', sinVerificar: [RENG_TABLAS_INTER_NOTA_EN], lista: RENG_FUSIONES_EN,
    respuesta: ([, , ta, , , tb]) => (ta + K) / (tb + K),
    errores: ([, , ta, , , tb]) => [
      ['inverso', 'Cociente invertido', (tb + K) / (ta + K), 'Dividiste al revés: la temperatura mayor va en el numerador.'],
      ['diferencia', 'La diferencia', ta - tb, 'Calculaste la diferencia de temperaturas; se pide el cociente en kelvin.']
    ],
    enunciado: ([a, tipoA, ta, b, tipoB, tb]) => `El ${a} (sólido ${tipoA}) funde a ${tx(ta, 5)} °C y el ${b} (sólido ${tipoB}), a ${tx(tb, 5)} °C.`,
    pregunta: '¿Cuántas veces mayor es la temperatura absoluta de fusión del primero?',
    datos: ([a, , ta, b, , tb]) => [[a, `${tx(ta, 5)} °C = ${tx(ta + K, 5)} K`], [b, `${tx(tb, 5)} °C = ${tx(tb + K, 5)} K`]],
    pasos: ([, , ta, , , tb], _x, _y, rengR) => [`${tx(ta + K, 5)} K / ${tx(tb + K, 5)} K.`, `= ${tx(rengR)}: cuanto más fuerte es lo que hay que vencer, mayor es el punto de fusión.`],
    pistas: ['Pasa las temperaturas a kelvin.', 'Divide la mayor entre la menor.', 'Relaciónalo con el tipo de enlace.']
  })
]

export const RENG_PRACTICAS_B04_S22: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s22-p1', titulo: 'Orden de enlace de una especie diatómica', unidad: '',
    objetivo: 'Calcular el orden de enlace de una especie diatómica con sus electrones enlazantes y antienlazantes.', seccion: '8.4', para: 'la teoría de orbitales moleculares', lewis: true,
    idealizado: 'Orbitales moleculares de valencia.', metodo: 'escena «orden-enlace»', lista: RENG_OM_EN,
    respuesta: ([, b, a]) => orden(b, a),
    errores: ([, b, a]) => [
      ['sin-dividir', 'Sin dividir entre dos', b - a, 'Falta dividir entre dos: cada enlace es un par de electrones.'],
      ['suma', 'Sumando', (b + a) / 2, 'Sumaste los electrones; los antienlazantes restan.']
    ],
    enunciado: ([t, b, a]) => `La especie ${t} tiene ${b} electrones de valencia en orbitales enlazantes y ${a} en orbitales antienlazantes.`,
    pregunta: '¿Cuál es su orden de enlace?',
    datos: ([, b, a]) => [['Enlazantes', String(b)], ['Antienlazantes', String(a)]],
    pasos: ([, b, a], _x, _y, rengR) => [`OE = (${b} − ${a})/2.`, `OE = ${tx(rengR)}.`],
    pistas: ['Resta los antienlazantes.', 'Divide el resultado entre dos.', 'Un orden mayor es un enlace más fuerte.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s22-p2', titulo: 'Efecto de ionizar una molécula', unidad: '',
    objetivo: 'Calcular cómo cambia el orden de enlace cuando una molécula diatómica gana o pierde electrones.', seccion: '8.4', para: 'la teoría de orbitales moleculares', lewis: true,
    idealizado: 'Orbitales moleculares de valencia.', metodo: 'escena «orden-enlace» para las dos especies', lista: RENG_PARES_OM_EN,
    respuesta: ([, b0, a0, , b1, a1]) => orden(b1, a1) - orden(b0, a0),
    errores: ([, b0, a0, , b1, a1]) => [
      ['signo', 'Signo al revés', orden(b0, a0) - orden(b1, a1), 'Restaste al revés: se pide el orden del ion menos el de la especie de partida.'],
      ['sin-dividir', 'Sin dividir entre dos', b1 - a1 - (b0 - a0), 'Falta dividir entre dos: un electrón cambia el orden en media unidad.']
    ],
    enunciado: ([n, b0, a0, ion, b1, a1]) => `La especie ${n} tiene ${b0} electrones enlazantes y ${a0} antienlazantes; la especie ${ion}, ${b1} enlazantes y ${a1} antienlazantes.`,
    pregunta: ([n, , , ion]) => `¿Cuánto cambia el orden de enlace al pasar de ${n} a ${ion} (con signo)?`,
    datos: ([n, b0, a0, ion, b1, a1]) => [[n, `${b0} y ${a0}`], [ion, `${b1} y ${a1}`]],
    pasos: ([, b0, a0, , b1, a1], _x, _y, rengR) => [`Órdenes: ${tx(orden(b0, a0))} y ${tx(orden(b1, a1))}.`, `Cambio: ${rengR > 0 ? '+' : ''}${tx(rengR)}; ${rengR > 0 ? 'el enlace se refuerza' : 'el enlace se debilita'}.`],
    pistas: ['Calcula el orden de cada especie.', 'Resta el inicial del final.', 'Quitar un antienlazante refuerza.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s22-p3', titulo: 'Electrones enlazantes de una especie', unidad: '', tolerancia: E,
    objetivo: 'Deducir los electrones enlazantes de una especie diatómica a partir de sus electrones de valencia y su orden de enlace.', seccion: '8.4', para: 'la teoría de orbitales moleculares', lewis: true,
    idealizado: 'Orbitales moleculares de valencia.', metodo: 'escena «orden-enlace» (búsqueda de la ocupación)', lista: RENG_OM_EN,
    respuesta: ([, b]) => b,
    errores: ([, b, a]) => [
      ['antienlazantes', 'Los antienlazantes', a, 'Esos son los electrones antienlazantes; los enlazantes son los demás.'],
      ['mitad', 'La mitad de todos', (b + a) / 2, 'Repartiste los electrones a partes iguales; con ese reparto el orden de enlace sería cero.']
    ],
    enunciado: ([t, b, a]) => `La especie ${t} tiene ${b + a} electrones de valencia repartidos en orbitales moleculares y un orden de enlace de ${tx(orden(b, a))}.`,
    pregunta: '¿Cuántos de esos electrones están en orbitales enlazantes?',
    datos: ([, b, a]) => [['Electrones de valencia', String(b + a)], ['Orden de enlace', tx(orden(b, a))]],
    pasos: ([, b, a], _x, _y, rengR) => [`n_b + n_a = ${b + a} y n_b − n_a = ${b - a}.`, `n_b = ${tx(rengR)}.`],
    pistas: ['Plantea la suma y la diferencia.', 'La diferencia es el doble del orden.', 'Resuelve el sistema.']
  })
]
