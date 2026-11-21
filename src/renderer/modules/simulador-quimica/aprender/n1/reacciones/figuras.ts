import { rengCoeficientesCombustion } from '../../../escenas-n1/modelos/combustion'
import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'
import { rengMmRq, rengOxRq } from './comun'

const rengPhFuerte = (rengV: number): number => {
  const rengNa = 0.1 * 25
  const rengNb = 0.1 * rengV
  const rengVt = 25 + rengV
  if (Math.abs(rengNa - rengNb) < 1e-12) return 7
  return rengNa > rengNb ? -Math.log10((rengNa - rengNb) / rengVt) : 14 + Math.log10((rengNb - rengNa) / rengVt)
}

export const RENG_FIGURAS_REACCIONES: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-rq-conservacion',
    titulo: 'La masa se conserva al quemar propano',
    pie: 'Masa de los reactivos consumidos (C₃H₈ + O₂) y de los productos formados (CO₂ + H₂O) según los moles de propano quemados, con las masas de la app: las dos rectas coinciden.',
    alternativo: 'Dos rectas superpuestas que suben desde 0 hasta unos 1100 g para 5 mol de propano.',
    x: { min: 0, max: 5, titulo: 'propano quemado (mol)' },
    y: { min: 0, max: 1200, titulo: 'masa (g)' },
    series: [
      rengMuestrearN1('reactivos', (rengN) => rengN * (rengMmRq('C3H8') + 5 * rengMmRq('O2')), 0, 5, 10),
      rengMuestrearN1('productos', (rengN) => rengN * (3 * rengMmRq('CO2') + 4 * rengMmRq('H2O')), 0, 5, 10)
    ]
  }),
  rengFiguraN1({
    id: 'fig-rq-oxigeno-alcanos',
    titulo: 'Oxígeno necesario para quemar alcanos',
    pie: 'Moles de O₂ por mol de alcano CₙH₂ₙ₊₂ en la combustión completa, con los coeficientes ajustados: crecen 1,5 por cada carbono más (b = 1,5n + 0,5).',
    alternativo: 'Puntos en línea recta desde 2 (metano) hasta 12,5 (octano).',
    x: { min: 0, max: 9, titulo: 'átomos de carbono (n)' },
    y: { min: 0, max: 14, titulo: 'mol de O₂ por mol de alcano' },
    series: [{ nombre: 'O₂', puntos: Array.from({ length: 8 }, (_rengX, rengI) => { const rengC = rengCoeficientesCombustion(rengI + 1, 2 * rengI + 4, 0); return [rengI + 1, rengC.b / rengC.a] as const }) }]
  }),
  rengFiguraN1({
    id: 'fig-rq-precipitado',
    titulo: 'Precipitado de cloruro de plata',
    pie: 'Masa de AgCl que precipita al añadir NaCl 0,100 mol/L a 50,0 mL de AgNO₃ 0,100 mol/L: crece hasta que se agota la plata (50 mL) y después se mantiene.',
    alternativo: 'Una recta que sube hasta unos 0,72 g a los 50 mL y luego queda horizontal.',
    x: { min: 0, max: 100, titulo: 'NaCl añadido (mL)' },
    y: { min: 0, max: 0.9, titulo: 'AgCl precipitado (g)' },
    series: [rengMuestrearN1('AgCl', (rengV) => Math.min(0.1 * rengV, 0.1 * 50) / 1000 * rengMmRq('AgCl'), 0, 100, 40)]
  }),
  rengFiguraN1({
    id: 'fig-rq-neutralizacion',
    titulo: 'Neutralización de un ácido fuerte',
    pie: 'pH de 25,0 mL de HCl 0,100 mol/L al añadir NaOH 0,100 mol/L (cálculo con Kw = 10⁻¹⁴): salto brusco en el punto de equivalencia, a 25 mL.',
    alternativo: 'Curva que sube despacio desde pH 1, salta de 3 a 11 cerca de 25 mL y se aplana por encima de 12.',
    x: { min: 0, max: 50, titulo: 'NaOH añadido (mL)' },
    y: { min: 0, max: 14, titulo: 'pH' },
    series: [rengMuestrearN1('pH', rengPhFuerte, 0, 50, 100)]
  }),
  rengFiguraN1({
    id: 'fig-rq-calor-metano',
    titulo: 'Calor liberado al quemar metano',
    pie: 'Calor desprendido según los moles de metano quemados, con ΔH = −890 kJ/mol (valor redondeado de uso común, sin verificar): reacción exotérmica.',
    alternativo: 'Una recta que sube desde 0 hasta 4450 kJ para 5 mol.',
    x: { min: 0, max: 5, titulo: 'metano quemado (mol)' },
    y: { min: 0, max: 5000, titulo: 'calor liberado (kJ)' },
    series: [rengMuestrearN1('q', (rengN) => 890 * rengN, 0, 5, 5)]
  }),
  rengFiguraN1({
    id: 'fig-rq-manganeso',
    titulo: 'El manganeso cambia de número de oxidación',
    pie: 'Número de oxidación del manganeso en KMnO₄, MnO₂ y MnCl₂, calculado con la regla de suma cero de la app: al reducirse el permanganato, el número baja.',
    alternativo: 'Tres puntos que bajan: +7 en el permanganato, +4 en el dióxido y +2 en el cloruro.',
    x: { min: 0, max: 4, titulo: 'especie (1 KMnO₄ · 2 MnO₂ · 3 MnCl₂)' },
    y: { min: 0, max: 8, titulo: 'n.º de oxidación del Mn' },
    series: [{ nombre: 'Mn', puntos: [[1, rengOxRq('KMnO4', 'Mn')], [2, rengOxRq('MnO2', 'Mn')], [3, rengOxRq('MnCl2', 'Mn')]] }]
  }),
  rengFiguraN1({
    id: 'fig-rq-reversible',
    titulo: 'Una reacción reversible llega al equilibrio',
    pie: 'Concentraciones de A y B en A ⇌ B con constantes de velocidad didácticas k₁ = 0,3 s⁻¹ y k₂ = 0,1 s⁻¹ y [A]₀ = 1 mol/L: ambas tienden a valores constantes ([A] = 0,25 y [B] = 0,75 mol/L), no a cero.',
    alternativo: 'La curva de A baja de 1 a 0,25 y la de B sube de 0 a 0,75; las dos se aplanan.',
    x: { min: 0, max: 15, titulo: 'tiempo (s)' },
    y: { min: 0, max: 1, titulo: 'concentración (mol/L)' },
    series: [
      rengMuestrearN1('[A]', (rengT) => 0.25 + 0.75 * Math.exp(-0.4 * rengT), 0, 15, 60),
      rengMuestrearN1('[B]', (rengT) => 0.75 - 0.75 * Math.exp(-0.4 * rengT), 0, 15, 60)
    ]
  }),
  rengFiguraN1({
    id: 'fig-rq-caliza',
    titulo: 'Descomposición de la caliza',
    pie: 'Masa de CaO y de CO₂ que se obtienen al descomponer CaCO₃ por completo, con las masas de la app: la suma es igual a la masa de partida.',
    alternativo: 'Dos rectas que salen del origen: la del CaO sube hasta unos 56 g y la del CO₂ hasta unos 44 g para 100 g de caliza.',
    x: { min: 0, max: 100, titulo: 'CaCO₃ (g)' },
    y: { min: 0, max: 60, titulo: 'masa de producto (g)' },
    series: [
      rengMuestrearN1('CaO', (rengM) => (rengM / rengMmRq('CaCO3')) * rengMmRq('CaO'), 0, 100, 10),
      rengMuestrearN1('CO₂', (rengM) => (rengM / rengMmRq('CaCO3')) * rengMmRq('CO2'), 0, 100, 10)
    ]
  })
]
