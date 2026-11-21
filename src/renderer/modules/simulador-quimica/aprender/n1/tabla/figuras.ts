import { rengValenciaDe } from '../../../escenas-n1/modelos/atomo'
import { RENG_AE_KJ, RENG_EI_KJ, RENG_RADIO_ION_PM, RENG_RADIO_PM, rengElectronegatividadDe } from '../../../escenas-n1/modelos/tendencias-periodicas'
import { RENG_ELEMENTOS } from '../../../../tabla-periodica/data'
import { rengFiguraN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'

const RENG_P2 = ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne']
const RENG_P3 = ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar']
const RENG_G1 = ['Li', 'Na', 'K', 'Rb']
const RENG_G17 = ['F', 'Cl', 'Br', 'I']
const RENG_G16 = ['O', 'S', 'Se', 'Te']
const rengSerie = (rengLista: readonly string[], rengF: (rengS: string) => number, rengX0 = 1): ReadonlyArray<readonly [number, number]> => rengLista.map((rengS, rengI) => [rengI + rengX0, rengF(rengS)] as const)

export const RENG_FIGURAS_TABLA: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-tp-periodicidad',
    titulo: 'Periodicidad de los electrones de valencia',
    pie: 'Electrones de la capa más externa de los elementos 1 a 36 según la configuración de la tabla de la app: el patrón se repite en cada periodo, y esa repetición es la base de la ley periódica.',
    alternativo: 'Diente de sierra que sube de 1 a 8 en cada periodo y vuelve a 1 al empezar el siguiente; en los metales de transición se mantiene en 1 o 2.',
    x: { min: 0, max: 37, titulo: 'número atómico Z' },
    y: { min: 0, max: 9, titulo: 'electrones de valencia (s y p)' },
    series: [{ nombre: 'valencia', puntos: RENG_ELEMENTOS.filter((rengE) => rengE.z <= 36).map((rengE) => [rengE.z, rengValenciaDe(rengE.z)] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-tp-radio-periodo',
    titulo: 'Radio atómico a lo largo de un periodo',
    pie: 'Radio atómico (pm) de los elementos representativos de los periodos 2 y 3, según valores de tablas de texto recordados (sin verificar): disminuye de izquierda a derecha porque crece la carga nuclear efectiva.',
    alternativo: 'Dos líneas descendentes: de 152 pm (Li) a 70 pm (Ne) y de 186 pm (Na) a 98 pm (Ar); la del periodo 3 queda siempre por encima.',
    x: { min: 0, max: 9, titulo: 'electrones de valencia' },
    y: { min: 0, max: 200, titulo: 'radio atómico (pm)' },
    series: [{ nombre: 'periodo 2', puntos: rengSerie(RENG_P2, (rengS) => RENG_RADIO_PM[rengS]!) }, { nombre: 'periodo 3', puntos: rengSerie(RENG_P3, (rengS) => RENG_RADIO_PM[rengS]!) }]
  }),
  rengFiguraN1({
    id: 'fig-tp-radio-grupo',
    titulo: 'Radio atómico al bajar por un grupo',
    pie: 'Radio atómico (pm) de los alcalinos (Li a Rb) y de los halógenos (F a I), según valores de tablas de texto recordados (sin verificar): aumenta al bajar porque cada elemento tiene una capa más.',
    alternativo: 'Dos líneas ascendentes: los alcalinos suben de 152 a 248 pm y los halógenos de 72 a 133 pm, siempre por debajo.',
    x: { min: 1, max: 6, titulo: 'periodo' },
    y: { min: 0, max: 260, titulo: 'radio atómico (pm)' },
    series: [{ nombre: 'grupo 1', puntos: rengSerie(RENG_G1, (rengS) => RENG_RADIO_PM[rengS]!, 2) }, { nombre: 'grupo 17', puntos: rengSerie(RENG_G17, (rengS) => RENG_RADIO_PM[rengS]!, 2) }]
  }),
  rengFiguraN1({
    id: 'fig-tp-ionizacion',
    titulo: 'Primera energía de ionización de los 20 primeros elementos',
    pie: 'Primera energía de ionización (kJ/mol) frente al número atómico, según valores de tablas de texto recordados (sin verificar): sube a lo largo de cada periodo, con máximos en los gases nobles, y cae al empezar el siguiente.',
    alternativo: 'Diente de sierra con picos en el helio (2372), el neón (2081) y el argón (1521) y valles en el litio (520), el sodio (496) y el potasio (419).',
    x: { min: 0, max: 21, titulo: 'número atómico Z' },
    y: { min: 0, max: 2500, titulo: 'energía de ionización (kJ/mol)' },
    series: [{ nombre: 'Ei', puntos: RENG_ELEMENTOS.filter((rengE) => rengE.z <= 20).map((rengE) => [rengE.z, RENG_EI_KJ[rengE.simbolo]!] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-tp-electronegatividad',
    titulo: 'Electronegatividad en los periodos 2 y 3',
    pie: 'Electronegatividad de Pauling de los elementos de los grupos 1 a 17 de los periodos 2 y 3, según los datos de PubChem guardados en la app: aumenta de izquierda a derecha y es mayor en el periodo 2.',
    alternativo: 'Dos líneas ascendentes: de 0,98 (Li) a 3,98 (F) y de 0,93 (Na) a 3,16 (Cl); la del periodo 2 queda por encima.',
    x: { min: 0, max: 8, titulo: 'electrones de valencia' },
    y: { min: 0, max: 4.5, titulo: 'electronegatividad (Pauling)' },
    series: [
      { nombre: 'periodo 2', puntos: rengSerie(RENG_P2.slice(0, 7), (rengS) => rengElectronegatividadDe(RENG_ELEMENTOS.find((rengE) => rengE.simbolo === rengS)!.z)) },
      { nombre: 'periodo 3', puntos: rengSerie(RENG_P3.slice(0, 7), (rengS) => rengElectronegatividadDe(RENG_ELEMENTOS.find((rengE) => rengE.simbolo === rengS)!.z)) }
    ]
  }),
  rengFiguraN1({
    id: 'fig-tp-iones',
    titulo: 'Radio de un átomo y de su ion',
    pie: 'Radio atómico y radio iónico (pm) de los alcalinos (catión 1+) y de los halógenos (anión 1−), según valores de tablas de texto recordados (sin verificar): el catión es menor que su átomo y el anión, mayor.',
    alternativo: 'Cuatro líneas ascendentes; de abajo arriba: átomos de halógeno, cationes alcalinos, aniones haluro y átomos alcalinos.',
    x: { min: 1, max: 6, titulo: 'periodo' },
    y: { min: 0, max: 260, titulo: 'radio (pm)' },
    series: [
      { nombre: 'átomo alcalino', puntos: rengSerie(RENG_G1, (rengS) => RENG_RADIO_PM[rengS]!, 2) },
      { nombre: 'catión 1+', puntos: rengSerie(RENG_G1, (rengS) => RENG_RADIO_ION_PM[rengS]![1], 2) },
      { nombre: 'átomo de halógeno', puntos: rengSerie(RENG_G17, (rengS) => RENG_RADIO_PM[rengS]!, 2) },
      { nombre: 'anión 1−', puntos: rengSerie(RENG_G17, (rengS) => RENG_RADIO_ION_PM[rengS]![1], 2) }
    ]
  }),
  rengFiguraN1({
    id: 'fig-tp-afinidad',
    titulo: 'Afinidad electrónica de halógenos y anfígenos',
    pie: 'Energía liberada (kJ/mol) al captar un electrón los elementos de los grupos 16 y 17, según valores de tablas de texto recordados (sin verificar): los halógenos liberan más energía, y el cloro más que el flúor.',
    alternativo: 'Dos líneas casi planas: la de los halógenos entre 295 y 349 kJ/mol con máximo en el cloro, y la del grupo 16 entre 141 y 200 kJ/mol con máximo en el azufre.',
    x: { min: 1, max: 6, titulo: 'periodo' },
    y: { min: 0, max: 400, titulo: 'energía liberada (kJ/mol)' },
    series: [{ nombre: 'grupo 17', puntos: rengSerie(RENG_G17, (rengS) => RENG_AE_KJ[rengS]!, 2) }, { nombre: 'grupo 16', puntos: rengSerie(RENG_G16, (rengS) => RENG_AE_KJ[rengS]!, 2) }]
  })
]
