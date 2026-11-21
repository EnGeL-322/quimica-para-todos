import { RENG_ESTADOS_COMUNES } from '../../../nucleo/compuestosBinarios'
import { rengPorSimbolo } from '../../../../tabla-periodica/data'
import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'
import { rengEstadoDe, rengMmNom } from './comun'

const RENG_PERIODO3 = ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl']
const rengMaxEstado = (rengEl: string): number => Math.max(...(RENG_ESTADOS_COMUNES[rengEl] ?? [0]))

export const RENG_FIGURAS_NOMENCLATURA: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-no-estados-periodo',
    titulo: 'Número de oxidación máximo en el tercer periodo',
    pie: 'Mayor número de oxidación común de los elementos del tercer periodo, según la tabla de estados de la app: crece de +1 (Na) a +7 (Cl), igual que el número del grupo (en la numeración antigua).',
    alternativo: 'Puntos que suben de uno en uno: Na +1, Mg +2, Al +3, Si +4, P +5, S +6 y Cl +7.',
    x: { min: 10, max: 18, titulo: 'número atómico' },
    y: { min: 0, max: 8, titulo: 'n.º de oxidación máximo' },
    series: [{ nombre: 'máximo común', puntos: RENG_PERIODO3.map((rengEl) => [rengPorSimbolo.get(rengEl)!.z, rengMaxEstado(rengEl)] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-no-cloro',
    titulo: 'El cloro en sus oxoácidos',
    pie: 'Número de oxidación del cloro en HClO, HClO₂, HClO₃ y HClO₄ (calculado con la regla de suma cero de la app): cada oxígeno más sube dos unidades. Con la nomenclatura tradicional son los ácidos hipocloroso, cloroso, clórico y perclórico.',
    alternativo: 'Cuatro puntos en línea recta: +1, +3, +5 y +7 para 1, 2, 3 y 4 oxígenos.',
    x: { min: 0, max: 5, titulo: 'átomos de oxígeno' },
    y: { min: 0, max: 8, titulo: 'n.º de oxidación del Cl' },
    series: [{ nombre: 'Cl en HClOₙ', puntos: ['HClO', 'HClO2', 'HClO3', 'HClO4'].map((rengF, rengI) => [rengI + 1, rengEstadoDe(rengF, 'Cl')] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-no-hidrato',
    titulo: 'Masa fórmula de un hidrato',
    pie: 'Masa fórmula de CuSO₄·nH₂O según el número de moléculas de agua, con las masas atómicas de la app: cada agua suma unos 18 g/mol.',
    alternativo: 'Una recta que sube de unos 160 g/mol (sal anhidra) a unos 250 g/mol con 5 moléculas de agua.',
    x: { min: 0, max: 5, titulo: 'moléculas de agua (n)' },
    y: { min: 140, max: 260, titulo: 'masa fórmula (g/mol)' },
    series: [rengMuestrearN1('CuSO₄·nH₂O', (rengN) => rengMmNom('CuSO4') + rengN * rengMmNom('H2O'), 0, 5, 5)]
  }),
  rengFiguraN1({
    id: 'fig-no-oxidos-nitrogeno',
    titulo: 'Oxígeno en los óxidos de nitrógeno',
    pie: 'Porcentaje en masa de oxígeno en N₂O, NO, N₂O₃, NO₂ y N₂O₅ según la proporción O/N, con las masas de la app. Cada fórmula tiene un nombre sistemático distinto que indica esa proporción con prefijos.',
    alternativo: 'Cinco puntos que suben de unos 36 % (N₂O) a unos 74 % (N₂O₅).',
    x: { min: 0, max: 3, titulo: 'átomos de O por átomo de N' },
    y: { min: 0, max: 100, titulo: '% de oxígeno' },
    series: [{ nombre: '% O', puntos: [['N2O', 0.5], ['NO', 1], ['N2O3', 1.5], ['NO2', 2], ['N2O5', 2.5]].map(([rengF, rengR]) => [rengR as number, (100 * (rengMmNom(rengF as string) - rengMmNom('N') * (rengF === 'NO' || rengF === 'NO2' ? 1 : 2))) / rengMmNom(rengF as string)] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-no-subindices',
    titulo: 'Aniones por catión según su carga',
    pie: 'Número de aniones de carga 1− que necesita un catión para ser neutro, según su carga: NaCl, CaCl₂, AlCl₃ y SnCl₄ siguen la regla de la electroneutralidad.',
    alternativo: 'Una recta: 1, 2, 3 y 4 aniones para cationes de carga 1+, 2+, 3+ y 4+.',
    x: { min: 0, max: 5, titulo: 'carga del catión' },
    y: { min: 0, max: 5, titulo: 'aniones 1− por catión' },
    series: [rengMuestrearN1('aniones', (rengZ) => rengZ, 1, 4, 3)]
  }),
  rengFiguraN1({
    id: 'fig-no-azufre',
    titulo: 'Estados de oxidación del azufre',
    pie: 'Número de oxidación del azufre en H₂S, S₈, SO₂ y H₂SO₄ (y SO₃), calculado con la app: el mismo elemento puede actuar con −2, 0, +4 y +6, y el nombre debe indicarlo.',
    alternativo: 'Cuatro puntos: −2 en H₂S, 0 en el azufre elemental, +4 en SO₂ y +6 en H₂SO₄.',
    x: { min: 0, max: 5, titulo: 'especie (1 H₂S · 2 S₈ · 3 SO₂ · 4 H₂SO₄)' },
    y: { min: -3, max: 7, titulo: 'n.º de oxidación del S' },
    series: [{ nombre: 'S', puntos: [[1, rengEstadoDe('H2S', 'S')], [2, 0], [3, rengEstadoDe('SO2', 'S')], [4, rengEstadoDe('H2SO4', 'S')]] }]
  })
]
