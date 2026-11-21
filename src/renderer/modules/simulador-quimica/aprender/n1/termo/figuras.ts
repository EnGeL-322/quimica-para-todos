import { RENG_C_AGUA } from '../../../nucleo/termoquimica'
import { rengLecturasCalorimetria } from '../../../escenas-n1/modelos/calorimetria'
import { rengLecturasElectrolisis } from '../../../escenas-n1/modelos/electrolisis'
import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'

export const RENG_FIGURAS_TERMO: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-te-calentar',
    titulo: 'Calentar materiales distintos',
    pie: 'Temperatura de 100 g de agua y de 100 g de un metal de c = 0,45 J/(g·K) (didáctico, del orden del hierro) al recibir calor desde 20 °C. Con el mismo calor, el metal se calienta unas nueve veces más.',
    alternativo: 'Dos rectas que salen de 20 °C: la del metal sube muy deprisa y llega a 100 °C con unos 3,6 kJ; la del agua apenas pasa de 28 °C con ese mismo calor.',
    x: { min: 0, max: 10, titulo: 'calor recibido (kJ)' },
    y: { min: 0, max: 120, titulo: 'T (°C)' },
    series: [rengMuestrearN1('agua', (rengQ) => 20 + (rengQ * 1000) / (100 * RENG_C_AGUA), 0, 10, 10), rengMuestrearN1('metal', (rengQ) => 20 + (rengQ * 1000) / (100 * 0.45), 0, 3.6, 9)]
  }),
  rengFiguraN1({
    id: 'fig-te-mezcla',
    titulo: 'Temperatura final de una mezcla',
    pie: 'Temperatura final al meter 100 g de metal (c = 0,45 J/(g·K), didáctico) a 95 °C en agua a 20 °C, según la masa de agua, calculada con la escena del calorímetro. Más agua, temperatura final más cercana a 20 °C.',
    alternativo: 'Una curva que baja desde unos 59 °C con 10 g de agua y se acerca a 21 °C con 1 kg.',
    x: { min: 10, max: 1000, titulo: 'masa de agua (g)' },
    y: { min: 0, max: 100, titulo: 'T final (°C)' },
    series: [rengMuestrearN1('T final', (rengM) => rengLecturasCalorimetria({ m1: 100, c1: 0.45, T1: 95, m2: rengM, T2: 20, Ccal: 0 }).Tf!, 10, 1000, 33)]
  }),
  rengFiguraN1({
    id: 'fig-te-niveles',
    titulo: 'Diagramas de entalpía',
    pie: 'Entalpía de reactivos y productos en una reacción exotérmica (combustión del metano, ΔH ≈ −890 kJ/mol con agua líquida, calculada con la tabla del núcleo) y en una endotérmica didáctica de +180 kJ/mol. La flecha baja cuando se libera calor.',
    alternativo: 'Dos pares de puntos: en la exotérmica los productos quedan unos 890 kJ por debajo de los reactivos; en la endotérmica, 180 kJ por encima.',
    x: { min: 0, max: 5, titulo: 'reacción (1 exotérmica · 4 endotérmica)' },
    y: { min: -1000, max: 300, titulo: 'H relativa (kJ)' },
    series: [{ nombre: 'exotérmica', puntos: [[0.5, 0], [1.5, -890.2]] }, { nombre: 'endotérmica', puntos: [[3.5, 0], [4.5, 180]] }]
  }),
  rengFiguraN1({
    id: 'fig-te-activacion',
    titulo: 'Perfil de energía con y sin catalizador',
    pie: 'Perfil de energía didáctico de una reacción exotérmica: la barrera (energía de activación) es de 120 kJ/mol sin catalizador y de 70 kJ/mol con él; ΔH (−40 kJ/mol) no cambia.',
    alternativo: 'Dos curvas en forma de joroba que empiezan en 0 y acaban en −40 kJ/mol; la del catalizador tiene una joroba más baja, de 70 en lugar de 120.',
    x: { min: 0, max: 10, titulo: 'avance de la reacción' },
    y: { min: -60, max: 140, titulo: 'energía (kJ/mol)' },
    series: [rengMuestrearN1('sin catalizador', (rengX) => -40 * (rengX / 10) + 140 * Math.exp(-((rengX - 5) ** 2) / 3), 0, 10, 40), rengMuestrearN1('con catalizador', (rengX) => -40 * (rengX / 10) + 90 * Math.exp(-((rengX - 5) ** 2) / 3), 0, 10, 40)]
  }),
  rengFiguraN1({
    id: 'fig-te-gibbs',
    titulo: 'ΔG frente a la temperatura',
    pie: 'ΔG = ΔH − T·ΔS para dos reacciones didácticas: una con ΔH = +40 kJ/mol y ΔS = +120 J/(mol·K) (espontánea por encima de unos 333 K) y otra con ΔH = −90 kJ/mol y ΔS = −200 J/(mol·K) (espontánea por debajo de 450 K).',
    alternativo: 'Dos rectas: una baja y cruza el cero hacia 333 K; la otra sube y cruza el cero en 450 K.',
    x: { min: 200, max: 700, titulo: 'T (K)' },
    y: { min: -60, max: 60, titulo: 'ΔG (kJ/mol)' },
    series: [rengMuestrearN1('ΔH > 0, ΔS > 0', (rengT) => 40 - (rengT * 120) / 1000, 200, 700, 10), rengMuestrearN1('ΔH < 0, ΔS < 0', (rengT) => -90 + (rengT * 200) / 1000, 200, 700, 10)]
  }),
  rengFiguraN1({
    id: 'fig-te-faraday',
    titulo: 'Masa depositada en una electrólisis',
    pie: 'Masa de cobre (2 electrones por átomo, 63,55 g/mol) y de plata (1 electrón, 107,87 g/mol) depositada con 2 A según el tiempo, calculada con la escena de electrólisis. Con la misma carga se deposita más plata porque necesita la mitad de electrones por átomo.',
    alternativo: 'Dos rectas que salen del origen; con 2 A durante 60 min se depositan unos 2,4 g de cobre y unos 8,0 g de plata.',
    x: { min: 0, max: 120, titulo: 't (min)' },
    y: { min: 0, max: 17, titulo: 'masa (g)' },
    series: [rengMuestrearN1('cobre', (rengT) => (rengT === 0 ? 0 : rengLecturasElectrolisis({ I: 2, t: rengT, z: 2, M: 63.55, ef: 100 }).m!), 0, 120, 12), rengMuestrearN1('plata', (rengT) => (rengT === 0 ? 0 : rengLecturasElectrolisis({ I: 2, t: rengT, z: 1, M: 107.87, ef: 100 }).m!), 0, 120, 12)]
  }),
  rengFiguraN1({
    id: 'fig-te-potenciales',
    titulo: 'Escala de potenciales de reducción',
    pie: 'Potenciales estándar de reducción didácticos de uso común (no contrastados en esta entrega): Li⁺/Li −3,04, Zn²⁺/Zn −0,76, Fe²⁺/Fe −0,44, H⁺/H₂ 0, Cu²⁺/Cu +0,34, Ag⁺/Ag +0,80 V. Cuanto más arriba, más tendencia a reducirse.',
    alternativo: 'Seis puntos ordenados de −3,04 V (litio) a +0,80 V (plata), con el hidrógeno en 0.',
    x: { min: 0, max: 7, titulo: 'par (1 Li · 2 Zn · 3 Fe · 4 H · 5 Cu · 6 Ag)' },
    y: { min: -3.5, max: 1.2, titulo: 'E° (V)' },
    series: [{ nombre: 'E° de reducción', puntos: [[1, -3.04], [2, -0.76], [3, -0.44], [4, 0], [5, 0.34], [6, 0.8]] }]
  })
]
