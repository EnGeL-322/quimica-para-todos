import { rengLecturasFamilia } from '../../../escenas-n1/modelos/familia-organica'
import { rengLecturasHidrocarburo } from '../../../escenas-n1/modelos/hidrocarburo'
import { rengLecturasPolimero } from '../../../escenas-n1/modelos/polimero'
import { rengFiguraN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'

export const RENG_EBULLICION_ALCANOS_C: readonly number[] = [-161.5, -88.6, -42.1, -0.5, 36.1, 68.7, 98.4, 125.7, 150.8, 174.1]
export const RENG_ISOMEROS_ALCANOS: readonly number[] = [1, 1, 1, 2, 3, 5, 9, 18, 35, 75, 159, 355]
export const RENG_EBULLICION_FAMILIAS_C: ReadonlyArray<readonly [string, number]> = [['propano', -42.1], ['éter dimetílico', -24.8], ['etanal', 20.2], ['etanol', 78.4], ['ácido metanoico', 100.8]]
const hc = (rengC: number, rengD: number, rengT: number): Readonly<Record<string, number>> => rengLecturasHidrocarburo({ C: rengC, dobles: rengD, triples: rengT, anillos: 0 })
const carbonos = (rengDesde: number, rengHasta: number): number[] => Array.from({ length: rengHasta - rengDesde + 1 }, (_rengX, rengI) => rengDesde + rengI)

export const RENG_FIGURAS_ORGANICA: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-or-hidrogenos',
    titulo: 'Hidrógenos de alcanos, alquenos y alquinos',
    pie: 'Número de átomos de hidrógeno frente al número de carbonos para un alcano (CₙH₂ₙ₊₂), un alqueno con un enlace doble (CₙH₂ₙ) y un alquino con un enlace triple (CₙH₂ₙ₋₂): tres rectas paralelas separadas por dos hidrógenos.',
    alternativo: 'Tres rectas crecientes y paralelas de pendiente 2; la del alcano va dos hidrógenos por encima de la del alqueno, y esta, dos por encima de la del alquino.',
    x: { min: 1, max: 12, titulo: 'átomos de carbono' },
    y: { min: 0, max: 26, titulo: 'átomos de hidrógeno' },
    series: [
      { nombre: 'alcano', puntos: carbonos(1, 12).map((rengC) => [rengC, hc(rengC, 0, 0).H!] as const) },
      { nombre: 'alqueno', puntos: carbonos(2, 12).map((rengC) => [rengC, hc(rengC, 1, 0).H!] as const) },
      { nombre: 'alquino', puntos: carbonos(2, 12).map((rengC) => [rengC, hc(rengC, 0, 1).H!] as const) }
    ]
  }),
  rengFiguraN1({
    id: 'fig-or-carbono-masa',
    titulo: 'Porcentaje de carbono en los hidrocarburos',
    pie: 'Porcentaje en masa de carbono de alcanos, alquenos y alquinos según su número de carbonos: en los alquenos es constante (85,6 %), y las otras dos series se acercan a ese valor al crecer la cadena.',
    alternativo: 'Una recta horizontal en 85,6 % para los alquenos; la curva de los alcanos sube desde 74,9 % hacia ella y la de los alquinos baja desde 92,3 %.',
    x: { min: 1, max: 12, titulo: 'átomos de carbono' },
    y: { min: 70, max: 95, titulo: 'carbono en masa (%)' },
    series: [
      { nombre: 'alcano', puntos: carbonos(1, 12).map((rengC) => [rengC, hc(rengC, 0, 0).pctC!] as const) },
      { nombre: 'alqueno', puntos: carbonos(2, 12).map((rengC) => [rengC, hc(rengC, 1, 0).pctC!] as const) },
      { nombre: 'alquino', puntos: carbonos(2, 12).map((rengC) => [rengC, hc(rengC, 0, 1).pctC!] as const) }
    ]
  }),
  rengFiguraN1({
    id: 'fig-or-ebullicion-alcanos',
    titulo: 'Punto de ebullición de los alcanos lineales',
    pie: 'Punto de ebullición normal (°C) de los alcanos lineales de uno a diez carbonos, con valores de tablas recordados: crece con la longitud de la cadena porque aumentan las fuerzas de dispersión. Los cuatro primeros son gases a temperatura ambiente.',
    alternativo: 'Diez puntos crecientes, desde −161,5 °C para el metano hasta 174,1 °C para el decano; la curva sube cada vez más despacio y cruza los 0 °C entre el butano y el pentano.',
    x: { min: 0, max: 11, titulo: 'átomos de carbono' },
    y: { min: -200, max: 200, titulo: 'punto de ebullición (°C)' },
    series: [{ nombre: 'alcanos lineales', puntos: RENG_EBULLICION_ALCANOS_C.map((rengT, rengI) => [rengI + 1, rengT] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-or-isomeros',
    titulo: 'Isómeros de cadena de los alcanos',
    pie: 'Número de isómeros estructurales de los alcanos de uno a diez carbonos (1, 1, 1, 2, 3, 5, 9, 18, 35 y 75): crece muy deprisa con el tamaño de la molécula. Las pruebas de la app recalculan estos números contando los esqueletos posibles.',
    alternativo: 'Diez puntos: los tres primeros valen 1 y después la serie se dispara: 2, 3, 5, 9, 18, 35 y 75 isómeros para diez carbonos.',
    x: { min: 0, max: 11, titulo: 'átomos de carbono' },
    y: { min: 0, max: 80, titulo: 'número de isómeros' },
    series: [{ nombre: 'alcanos', puntos: RENG_ISOMEROS_ALCANOS.slice(0, 10).map((rengN, rengI) => [rengI + 1, rengN] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-or-ebullicion-familias',
    titulo: 'Punto de ebullición y grupo funcional',
    pie: 'Punto de ebullición normal (°C) de cinco compuestos de masa molar muy parecida (44–46 g/mol), con valores de tablas recordados: 1 propano, 2 éter dimetílico, 3 etanal, 4 etanol y 5 ácido metanoico. Sube con la polaridad y, sobre todo, con los enlaces de hidrógeno.',
    alternativo: 'Cinco puntos crecientes: −42,1 °C el propano, −24,8 °C el éter dimetílico, 20,2 °C el etanal, 78,4 °C el etanol y 100,8 °C el ácido metanoico.',
    x: { min: 0, max: 6, titulo: 'compuesto (1 alcano, 2 éter, 3 aldehído, 4 alcohol, 5 ácido)' },
    y: { min: -60, max: 120, titulo: 'punto de ebullición (°C)' },
    series: [{ nombre: 'masa molar 44–46 g/mol', puntos: RENG_EBULLICION_FAMILIAS_C.map(([, rengT], rengI) => [rengI + 1, rengT] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-or-series',
    titulo: 'Series homólogas: masa molar',
    pie: 'Masa molar de alcoholes, ácidos carboxílicos y aminas primarias saturados según su número de carbonos: en cada serie, un carbono más añade siempre un –CH₂–, 14,03 g/mol, y las rectas son paralelas.',
    alternativo: 'Tres rectas crecientes y paralelas de pendiente 14 g/mol por carbono; la de los ácidos va por encima, y las de alcoholes y aminas casi coinciden.',
    x: { min: 1, max: 10, titulo: 'átomos de carbono' },
    y: { min: 0, max: 180, titulo: 'masa molar (g/mol)' },
    series: [
      { nombre: 'alcoholes', puntos: carbonos(1, 10).map((rengC) => [rengC, rengLecturasFamilia({ C: rengC, familia: 1 }).masa!] as const) },
      { nombre: 'ácidos', puntos: carbonos(1, 10).map((rengC) => [rengC, rengLecturasFamilia({ C: rengC, familia: 5 }).masa!] as const) },
      { nombre: 'aminas', puntos: carbonos(1, 10).map((rengC) => [rengC, rengLecturasFamilia({ C: rengC, familia: 7 }).masa!] as const) }
    ]
  }),
  rengFiguraN1({
    id: 'fig-or-polimero',
    titulo: 'Masa molar de una cadena de glucosa',
    pie: 'Masa molar de una cadena de unidades de glucosa (180,16 g/mol) unidas por condensación, comparada con la suma de las masas de los monómeros: cada unión libera una molécula de agua y la cadena conserva cerca del 90 % de la masa.',
    alternativo: 'Dos rectas crecientes que salen del mismo punto; la de la cadena condensada queda un 10 % por debajo de la suma de monómeros.',
    x: { min: 0, max: 1000, titulo: 'unidades de glucosa' },
    y: { min: 0, max: 200000, titulo: 'masa molar (g/mol)' },
    series: [
      { nombre: 'suma de monómeros', puntos: [1, 250, 500, 750, 1000].map((rengN) => [rengN, rengLecturasPolimero({ m0: 180.16, n: rengN, agua: 0 }).masa!] as const) },
      { nombre: 'cadena condensada', puntos: [1, 250, 500, 750, 1000].map((rengN) => [rengN, rengLecturasPolimero({ m0: 180.16, n: rengN, agua: 1 }).masa!] as const) }
    ]
  })
]
