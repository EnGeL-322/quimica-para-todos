import { RENG_KW_25C, rengConcentracionH, rengCurvaValoracion, rengPH } from '../../../nucleo/acidoBase'
import { rengLecturasEquilibrioGas } from '../../../escenas-n1/modelos/equilibrio-gas'
import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'
import { RENG_KA_ACETICO_DIDACTICO } from './comun'

const rengPhAcido = (rengC: number, rengKa: number): number => rengPH(rengConcentracionH(rengC, rengKa, 0, RENG_KW_25C))
const rengCurva = (rengPKa: number) => rengCurvaValoracion(0.1, 25, rengPKa, 0.1, 50, 50).map((rengP) => [rengP.V, rengP.pH] as const)

export const RENG_FIGURAS_ACIDOS: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-ab-escala-ph',
    titulo: 'pH y pOH según la concentración de H₃O⁺',
    pie: 'pH y pOH de disoluciones acuosas a 25 °C según el logaritmo de [H₃O⁺]. Cada unidad de pH es un factor 10 en la concentración, y en todo momento pH + pOH ≈ 14.',
    alternativo: 'Dos rectas que se cruzan en pH 7: el pH baja de 14 a 0 al pasar log[H₃O⁺] de −14 a 0, y el pOH sube de 0 a 14.',
    x: { min: -14, max: 0, titulo: 'log₁₀ [H₃O⁺]' },
    y: { min: 0, max: 14, titulo: 'pH o pOH' },
    series: [rengMuestrearN1('pH', (rengX) => -rengX, -14, 0, 14), rengMuestrearN1('pOH', (rengX) => 14 + rengX, -14, 0, 14)]
  }),
  rengFiguraN1({
    id: 'fig-ab-fuerte-debil',
    titulo: 'pH de un ácido fuerte y de uno débil',
    pie: 'pH a 25 °C de un ácido fuerte y de un ácido débil de Ka = 1,8·10⁻⁵ (valor didáctico, del orden del ácido acético) según su concentración, calculado con el balance de carga del núcleo.',
    alternativo: 'Dos curvas que bajan al aumentar la concentración; la del ácido débil queda siempre más arriba: a 0,1 mol/L el fuerte da pH 1 y el débil cerca de 2,9.',
    x: { min: -5, max: 0, titulo: 'log₁₀ C (mol/L)' },
    y: { min: 0, max: 7.5, titulo: 'pH' },
    series: [rengMuestrearN1('ácido fuerte', (rengX) => rengPhAcido(10 ** rengX, 1e6), -5, 0, 20), rengMuestrearN1('ácido débil', (rengX) => rengPhAcido(10 ** rengX, RENG_KA_ACETICO_DIDACTICO), -5, 0, 20)]
  }),
  rengFiguraN1({
    id: 'fig-ab-ionizacion',
    titulo: 'Grado de ionización de un ácido débil',
    pie: 'Porcentaje ionizado de un ácido débil de Ka = 1,8·10⁻⁵ (didáctico) según su concentración: cuanto más diluido, más se ioniza.',
    alternativo: 'Una curva que baja: a 10⁻⁵ mol/L está ionizado cerca del 70 %, y a 1 mol/L solo un 0,4 %.',
    x: { min: -5, max: 0, titulo: 'log₁₀ C (mol/L)' },
    y: { min: 0, max: 100, titulo: 'ionizado (%)' },
    series: [rengMuestrearN1('% ionizado', (rengX) => { const rengH = rengConcentracionH(10 ** rengX, RENG_KA_ACETICO_DIDACTICO, 0, RENG_KW_25C); return (100 * RENG_KA_ACETICO_DIDACTICO) / (RENG_KA_ACETICO_DIDACTICO + rengH) }, -5, 0, 20)]
  }),
  rengFiguraN1({
    id: 'fig-ab-distribucion',
    titulo: 'Forma ácida y forma básica según el pH',
    pie: 'Fracción de un par HA/A⁻ de pKa 4,76 (didáctico) en cada forma según el pH. Las curvas se cruzan en pH = pKa, donde hay tanto HA como A⁻: es el centro de la zona amortiguadora.',
    alternativo: 'Una curva de HA que baja de 100 % a 0 % y otra de A⁻ que sube de 0 % a 100 %, cruzándose al 50 % en pH 4,76.',
    x: { min: 0, max: 10, titulo: 'pH' },
    y: { min: 0, max: 100, titulo: 'fracción (%)' },
    series: [rengMuestrearN1('HA', (rengP) => 100 / (1 + 10 ** (rengP - 4.76)), 0, 10, 40), rengMuestrearN1('A⁻', (rengP) => 100 / (1 + 10 ** (4.76 - rengP)), 0, 10, 40)]
  }),
  rengFiguraN1({
    id: 'fig-ab-valoracion',
    titulo: 'Curvas de valoración',
    pie: 'pH al añadir NaOH 0,1 mol/L a 25 mL de un ácido 0,1 mol/L: fuerte y débil de pKa 4,76 (didáctico), calculado con la función de valoración del núcleo. El punto de equivalencia está en 25 mL en los dos casos.',
    alternativo: 'Dos curvas en S que suben bruscamente cerca de 25 mL; la del ácido débil empieza más arriba, tiene un tramo plano amortiguador y su salto queda por encima de pH 7.',
    x: { min: 0, max: 50, titulo: 'NaOH añadido (mL)' },
    y: { min: 0, max: 14, titulo: 'pH' },
    series: [{ nombre: 'ácido fuerte', puntos: rengCurva(-6) }, { nombre: 'ácido débil (pKa 4,76)', puntos: rengCurva(4.76) }]
  }),
  rengFiguraN1({
    id: 'fig-ab-indicador',
    titulo: 'Viraje de dos indicadores',
    pie: 'Porcentaje de un indicador en su forma básica según el pH, para indicadores de pK 5,0 y 9,4 (didácticos). Cada uno cambia de color en un intervalo de unas dos unidades de pH alrededor de su pK.',
    alternativo: 'Dos curvas en S que suben de 0 % a 100 %, una centrada en pH 5 y otra en pH 9,4.',
    x: { min: 0, max: 14, titulo: 'pH' },
    y: { min: 0, max: 100, titulo: 'forma básica (%)' },
    series: [rengMuestrearN1('pK 5,0', (rengP) => 100 / (1 + 10 ** (5 - rengP)), 0, 14, 56), rengMuestrearN1('pK 9,4', (rengP) => 100 / (1 + 10 ** (9.4 - rengP)), 0, 14, 56)]
  }),
  rengFiguraN1({
    id: 'fig-ab-amortiguador',
    titulo: 'Un amortiguador frente al agua',
    pie: 'pH al añadir NaOH a agua pura y a un amortiguador 0,1 mol/L de HA y 0,1 mol/L de NaA (pKa 4,76, didáctico), calculado con el núcleo. El amortiguador apenas cambia hasta agotar su ácido.',
    alternativo: 'La curva del agua sube enseguida por encima de pH 11; la del amortiguador sube despacio desde 4,76 y solo se dispara cerca de 0,1 mol/L de NaOH.',
    x: { min: 0, max: 0.12, titulo: 'NaOH añadida (mol/L)' },
    y: { min: 0, max: 14, titulo: 'pH' },
    series: [rengMuestrearN1('agua pura', (rengX) => rengPH(rengConcentracionH(0, 1e-5, rengX, RENG_KW_25C)), 0, 0.12, 24), rengMuestrearN1('amortiguador', (rengX) => rengPH(rengConcentracionH(0.2, 10 ** -4.76, 0.1 + rengX, RENG_KW_25C)), 0, 0.12, 24)]
  }),
  rengFiguraN1({
    id: 'fig-eq-volumen',
    titulo: 'Disociación A ⇌ 2B según el volumen',
    pie: 'Grado de disociación de 1 mol de A en A(g) ⇌ 2 B(g) a 298 K con Kp = 0,15 bar (didáctico) según el volumen del recipiente, calculado con la escena «equilibrio en fase gaseosa». Al aumentar el volumen (menos presión), el equilibrio se desplaza hacia más moles de gas.',
    alternativo: 'Una curva que sube y se aplana: el grado de disociación pasa de cerca del 4 % en 1 L al 12 % en 10 L y al 24 % en 50 L.',
    x: { min: 1, max: 50, titulo: 'V (L)' },
    y: { min: 0, max: 30, titulo: 'α (%)' },
    series: [rengMuestrearN1('α', (rengV) => rengLecturasEquilibrioGas({ Kp: 0.15, T: 298, n0: 1, V: rengV }).alfa!, 1, 50, 49)]
  }),
  rengFiguraN1({
    id: 'fig-eq-ksp',
    titulo: 'Solubilidad y ion común',
    pie: 'Solubilidad molar de una sal MX de Ksp = 1,0·10⁻⁸ (didáctico) según la concentración de un ion común X⁻ añadido: s = (−c + √(c² + 4·Ksp))/2. Con más ion común, la sal se disuelve menos.',
    alternativo: 'Una curva que baja: sin ion común la solubilidad es 10⁻⁴ mol/L; con 10⁻² mol/L de ion común baja a 10⁻⁶ mol/L.',
    x: { min: -6, max: -1, titulo: 'log₁₀ c(ion común)' },
    y: { min: -7.2, max: -3.8, titulo: 'log₁₀ s' },
    series: [rengMuestrearN1('log s', (rengX) => { const rengC = 10 ** rengX; return Math.log10((-rengC + Math.sqrt(rengC * rengC + 4e-8)) / 2) }, -6, -1, 20)]
  })
]
