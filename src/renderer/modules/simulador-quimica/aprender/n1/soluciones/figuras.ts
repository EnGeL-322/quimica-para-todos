import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'
import { RENG_KF_DIDACTICO, RENG_SOLUBILIDAD_A, RENG_SOLUBILIDAD_B } from './comun'

export const RENG_FIGURAS_SOLUCIONES: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-sol-masa-disolucion',
    titulo: 'Masa de disolución y fracción de soluto',
    pie: 'Al disolver cantidades crecientes de soluto en 100 g de agua, la masa de disolución crece gramo a gramo, mientras que el porcentaje en masa crece cada vez más despacio (valores de ejemplo).',
    alternativo: 'Una recta que sube desde 100 g (masa de disolución) y una curva que sube y se aplana (porcentaje en masa), que con 100 g de soluto llega al 50 %.',
    x: { min: 0, max: 100, titulo: 'soluto añadido (g)' },
    y: { min: 0, max: 210, titulo: 'g o %' },
    series: [rengMuestrearN1('masa de disolución (g)', (rengX) => 100 + rengX, 0, 100, 20), rengMuestrearN1('% en masa', (rengX) => (100 * rengX) / (100 + rengX), 0, 100, 20)]
  }),
  rengFiguraN1({
    id: 'fig-sol-particulas',
    titulo: 'Partículas en disolución por fórmula disuelta',
    pie: 'Número de partículas que aporta cada fórmula de soluto en el modelo ideal: 1 para un no electrolito (glucosa) y el número de iones para electrolitos fuertes (NaCl, CaCl₂, Na₃PO₄, Al₂(SO₄)₃).',
    alternativo: 'Cinco puntos: glucosa 1, NaCl 2, CaCl₂ 3, Na₃PO₄ 4 y Al₂(SO₄)₃ 5 partículas por fórmula.',
    x: { min: 0, max: 6, titulo: 'soluto (1 glucosa · 2 NaCl · 3 CaCl₂ · 4 Na₃PO₄ · 5 Al₂(SO₄)₃)' },
    y: { min: 0, max: 6, titulo: 'partículas por fórmula' },
    series: [{ nombre: 'modelo ideal', puntos: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]] }]
  }),
  rengFiguraN1({
    id: 'fig-sol-solubilidad',
    titulo: 'Curvas de solubilidad de dos sales hipotéticas',
    pie: 'Solubilidad en agua de dos sales hipotéticas según la temperatura (curvas didácticas, no de sustancias reales). Un punto por debajo de la curva es una disolución insaturada; sobre la curva, saturada; por encima, sobresaturada.',
    alternativo: 'Dos curvas que suben con la temperatura: la sal A crece despacio, de 30 a 70 g por 100 g de agua; la sal B empieza más abajo y crece más deprisa, hasta unos 162 g a 100 °C.',
    x: { min: 0, max: 100, titulo: 't (°C)' },
    y: { min: 0, max: 170, titulo: 'g de soluto / 100 g de agua' },
    series: [rengMuestrearN1('sal A', RENG_SOLUBILIDAD_A, 0, 100, 20), rengMuestrearN1('sal B', RENG_SOLUBILIDAD_B, 0, 100, 20)]
  }),
  rengFiguraN1({
    id: 'fig-sol-henry',
    titulo: 'Gas disuelto y presión parcial',
    pie: 'Concentración de un gas disuelto según su presión parcial sobre el líquido, a dos temperaturas, con constantes de Henry didácticas. Más presión disuelve más gas; más temperatura, menos.',
    alternativo: 'Dos rectas que salen del origen; la de la temperatura baja tiene más pendiente que la de la temperatura alta.',
    x: { min: 0, max: 3, titulo: 'presión parcial del gas (atm)' },
    y: { min: 0, max: 0.12, titulo: 'gas disuelto (mol/L)' },
    series: [rengMuestrearN1('10 °C (k didáctica 0,035)', (rengP) => 0.035 * rengP, 0, 3, 6), rengMuestrearN1('40 °C (k didáctica 0,018)', (rengP) => 0.018 * rengP, 0, 3, 6)]
  }),
  rengFiguraN1({
    id: 'fig-sol-molaridad',
    titulo: 'Molaridad y molalidad al añadir soluto',
    pie: 'Molaridad y molalidad de una disolución de un soluto de 58,44 g/mol en 1 kg de agua, con una densidad que crece levemente con la concentración (modelo didáctico ρ = 1,000 + 0,0007·g de soluto). La molalidad crece en proporción; la molaridad, algo menos.',
    alternativo: 'Dos curvas que salen del origen: la de molalidad es una recta que llega a 1,71 mol/kg con 100 g de soluto; la de molaridad queda por debajo.',
    x: { min: 0, max: 100, titulo: 'soluto en 1 kg de agua (g)' },
    y: { min: 0, max: 1.9, titulo: 'mol/kg o mol/L' },
    series: [
      rengMuestrearN1('molalidad', (rengG) => rengG / 58.44, 0, 100, 20),
      rengMuestrearN1('molaridad', (rengG) => rengG / 58.44 / ((1000 + rengG) / (1.0 + 0.0007 * rengG) / 1000), 0, 100, 20)
    ]
  }),
  rengFiguraN1({
    id: 'fig-sol-ppm',
    titulo: 'ppm y ppb de un contaminante en agua',
    pie: 'Concentración de un contaminante en agua, en ppm y en ppb, según los miligramos que hay en 1 kg de disolución. 1 ppm = 1 mg/kg y 1 ppb = 1 µg/kg, así que el mismo valor en ppb es mil veces mayor.',
    alternativo: 'Una recta que sube de 0 a 2 ppm cuando hay de 0 a 2 mg por kilogramo; en la escala de ppb, la misma muestra vale de 0 a 2000 ppb.',
    x: { min: 0, max: 2, titulo: 'mg de contaminante por kg' },
    y: { min: 0, max: 2.2, titulo: 'ppm (× 1000 = ppb)' },
    series: [rengMuestrearN1('ppm', (rengX) => rengX, 0, 2, 4)]
  }),
  rengFiguraN1({
    id: 'fig-sol-dilucion',
    titulo: 'Concentración al diluir',
    pie: 'Concentración final al llevar 10,0 mL de una disolución de 1,00 mol/L y otra de 0,500 mol/L a distintos volúmenes finales. Como c₁·V₁ = c₂·V₂, la concentración es inversa al volumen final.',
    alternativo: 'Dos curvas que bajan y se aplanan: con 20 mL finales la de 1 mol/L queda en 0,5 mol/L y la de 0,5 mol/L en 0,25 mol/L.',
    x: { min: 0, max: 200, titulo: 'volumen final (mL)' },
    y: { min: 0, max: 1.05, titulo: 'c final (mol/L)' },
    series: [rengMuestrearN1('desde 1,00 mol/L', (rengV) => 10 / rengV, 10, 200, 38), rengMuestrearN1('desde 0,500 mol/L', (rengV) => 5 / rengV, 10, 200, 38)]
  }),
  rengFiguraN1({
    id: 'fig-sol-crioscopia',
    titulo: 'Descenso del punto de congelación',
    pie: `Descenso del punto de congelación del agua según la molalidad, para i = 1, 2 y 3, con la K_f didáctica de ${String(RENG_KF_DIDACTICO).replace('.', ',')} K·kg/mol y el modelo de disolución diluida ideal.`,
    alternativo: 'Tres rectas que salen del origen; con 1 mol/kg descienden 1,86 K (i = 1), 3,72 K (i = 2) y 5,58 K (i = 3).',
    x: { min: 0, max: 1.2, titulo: 'b (mol/kg)' },
    y: { min: 0, max: 7, titulo: 'ΔT_f (K)' },
    series: [1, 2, 3].map((rengI) => rengMuestrearN1(`i = ${rengI}`, (rengB) => RENG_KF_DIDACTICO * rengB * rengI, 0, 1.2, 6))
  })
]
