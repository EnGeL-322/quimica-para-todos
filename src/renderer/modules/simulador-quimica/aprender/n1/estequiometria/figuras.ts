import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'
import { rengMasaAtomica, rengMm } from './datos'

const M_CACO3 = rengMm('CaCO3')
const M_MGCO3 = rengMm('MgCO3')
const M_CO2 = rengMm('CO2')
const rengPorcentajeC = (rengN: number): number => (100 * rengN * rengMasaAtomica('C')) / (rengN * rengMasaAtomica('C') + (2 * rengN + 2) * rengMasaAtomica('H'))

export const RENG_FIGURAS_ESTEQUIOMETRIA: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-est-masa-moles',
    titulo: 'Masa y cantidad de sustancia',
    pie: 'Masa de agua, de dióxido de carbono y de carbonato de calcio según la cantidad en moles. Cada recta pasa por el origen y su pendiente es la masa molar (masas de la tabla de la app).',
    alternativo: 'Tres rectas que salen del origen con pendientes distintas: a 2 mol, el agua pesa unos 36 g, el CO₂ unos 88 g y el CaCO₃ unos 200 g.',
    x: { min: 0, max: 2, titulo: 'n (mol)' },
    y: { min: 0, max: 210, titulo: 'm (g)' },
    series: [rengMuestrearN1('H₂O', (rengN) => rengN * rengMm('H2O'), 0, 2, 8), rengMuestrearN1('CO₂', (rengN) => rengN * M_CO2, 0, 2, 8), rengMuestrearN1('CaCO₃', (rengN) => rengN * M_CACO3, 0, 2, 8)]
  }),
  rengFiguraN1({
    id: 'fig-est-composicion-alcanos',
    titulo: 'Porcentaje de carbono en los alcanos',
    pie: 'Porcentaje en masa de carbono en los alcanos CₙH₂ₙ₊₂ según el número de átomos de carbono, calculado con las masas de la tabla de la app. Se acerca al de la unidad CH₂ (fórmula empírica de las cadenas largas).',
    alternativo: 'Una serie de puntos que sube deprisa al principio (75 % en el metano) y se aplana cerca del 85,6 %.',
    x: { min: 0, max: 13, titulo: 'átomos de C' },
    y: { min: 70, max: 90, titulo: '% C en masa' },
    series: [{ nombre: 'CₙH₂ₙ₊₂', puntos: Array.from({ length: 12 }, (_rengX, rengI) => [rengI + 1, rengPorcentajeC(rengI + 1)] as const) }, { nombre: 'unidad CH₂', puntos: [[0, (100 * rengMasaAtomica('C')) / rengMm('CH2')], [13, (100 * rengMasaAtomica('C')) / rengMm('CH2')]] }]
  }),
  rengFiguraN1({
    id: 'fig-est-proporcion',
    titulo: 'Razones molares en la síntesis del amoníaco',
    pie: 'En N₂ + 3 H₂ → 2 NH₃, moles de hidrógeno consumidos y de amoníaco formados según los moles de nitrógeno que reaccionan. Las pendientes (3 y 2) son las razones molares de la ecuación.',
    alternativo: 'Dos rectas desde el origen: la del hidrógeno consumido llega a 9 mol con 3 mol de N₂ y la del amoníaco a 6 mol.',
    x: { min: 0, max: 3, titulo: 'n(N₂) que reacciona (mol)' },
    y: { min: 0, max: 10, titulo: 'n (mol)' },
    series: [rengMuestrearN1('H₂ consumido', (rengN) => 3 * rengN, 0, 3, 6), rengMuestrearN1('NH₃ formado', (rengN) => 2 * rengN, 0, 3, 6)]
  }),
  rengFiguraN1({
    id: 'fig-est-limitante',
    titulo: 'Producto según el reactivo añadido',
    pie: 'Moles de NH₃ que se forman con 2,00 mol de N₂ al añadir cantidades crecientes de H₂. Hasta 6 mol de H₂ el limitante es el hidrógeno; a partir de ahí el nitrógeno limita y el producto ya no aumenta.',
    alternativo: 'Una recta que sube desde el origen hasta 4 mol de NH₃ con 6 mol de H₂ y después sigue horizontal.',
    x: { min: 0, max: 10, titulo: 'n(H₂) añadido (mol)' },
    y: { min: 0, max: 5, titulo: 'n(NH₃) (mol)' },
    series: [rengMuestrearN1('con 2,00 mol de N₂', (rengX) => 2 * Math.min(2, rengX / 3), 0, 10, 40)]
  }),
  rengFiguraN1({
    id: 'fig-est-rendimiento',
    titulo: 'Rendimiento real frente al teórico',
    pie: 'Masa realmente obtenida según el rendimiento teórico para tres rendimientos porcentuales. La recta del 100 % es el límite: ninguna síntesis real la supera.',
    alternativo: 'Tres rectas que salen del origen; la del 100 % es la más alta, la del 80 % queda por debajo y la del 60 % aún más abajo.',
    x: { min: 0, max: 50, titulo: 'rendimiento teórico (g)' },
    y: { min: 0, max: 55, titulo: 'masa obtenida (g)' },
    series: [rengMuestrearN1('100 %', (rengX) => rengX, 0, 50, 5), rengMuestrearN1('80 %', (rengX) => 0.8 * rengX, 0, 50, 5), rengMuestrearN1('60 %', (rengX) => 0.6 * rengX, 0, 50, 5)]
  }),
  rengFiguraN1({
    id: 'fig-est-pureza',
    titulo: 'CO₂ de una caliza según su pureza',
    pie: 'Masa de CO₂ que desprende una caliza al descomponerse por completo, según la masa de muestra, para tres purezas en CaCO₃ (las impurezas no desprenden gas).',
    alternativo: 'Tres rectas desde el origen; con 50 g de muestra, la caliza pura da unos 22 g de CO₂ y la del 75 % unos 16 g.',
    x: { min: 0, max: 50, titulo: 'masa de muestra (g)' },
    y: { min: 0, max: 25, titulo: 'CO₂ (g)' },
    series: [rengMuestrearN1('100 %', (rengX) => (rengX / M_CACO3) * M_CO2, 0, 50, 5), rengMuestrearN1('90 %', (rengX) => ((0.9 * rengX) / M_CACO3) * M_CO2, 0, 50, 5), rengMuestrearN1('75 %', (rengX) => ((0.75 * rengX) / M_CACO3) * M_CO2, 0, 50, 5)]
  }),
  rengFiguraN1({
    id: 'fig-est-mezcla',
    titulo: 'CO₂ de una mezcla de carbonatos',
    pie: 'Masa de CO₂ que dan 5,00 g de una mezcla de CaCO₃ y MgCO₃ según la masa de CaCO₃ que contiene. Como el MgCO₃ tiene menor masa molar, cuanto más MgCO₃ hay, más CO₂ se desprende.',
    alternativo: 'Una recta que baja: con 0 g de CaCO₃ (todo MgCO₃) se obtienen unos 2,6 g de CO₂ y con 5 g de CaCO₃ unos 2,2 g.',
    x: { min: 0, max: 5, titulo: 'masa de CaCO₃ en la mezcla (g)' },
    y: { min: 2, max: 2.8, titulo: 'CO₂ (g)' },
    series: [rengMuestrearN1('mezcla de 5,00 g', (rengX) => (rengX / M_CACO3 + (5 - rengX) / M_MGCO3) * M_CO2, 0, 5, 10)]
  }),
  rengFiguraN1({
    id: 'fig-est-consecutivas',
    titulo: 'Rendimiento global de varias etapas',
    pie: 'Rendimiento global de una secuencia de reacciones según el número de etapas, si cada etapa tiene el mismo rendimiento. Los rendimientos se multiplican, así que el global cae deprisa.',
    alternativo: 'Tres series de puntos que bajan: con etapas del 95 % el global sigue por encima del 70 % a las 6 etapas; con etapas del 70 % cae por debajo del 12 %.',
    x: { min: 0, max: 7, titulo: 'número de etapas' },
    y: { min: 0, max: 100, titulo: 'rendimiento global (%)' },
    series: [95, 85, 70].map((rengR) => ({ nombre: `etapas al ${rengR} %`, puntos: Array.from({ length: 6 }, (_rengX, rengI) => [rengI + 1, 100 * (rengR / 100) ** (rengI + 1)] as const) }))
  })
]
