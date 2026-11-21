import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'
import { rengMmFu } from './comun'

const RENG_M = 100
const rengCalentamiento = (rengQ: number): number => {
  const rengQ1 = RENG_M * 2.09 * 20
  const rengQ2 = rengQ1 + RENG_M * 334
  const rengQ3 = rengQ2 + RENG_M * 4.184 * 100
  const rengQ4 = rengQ3 + RENG_M * 2260
  const rengJ = rengQ * 1000
  if (rengJ <= rengQ1) return -20 + rengJ / (RENG_M * 2.09)
  if (rengJ <= rengQ2) return 0
  if (rengJ <= rengQ3) return (rengJ - rengQ2) / (RENG_M * 4.184)
  if (rengJ <= rengQ4) return 100
  return 100 + (rengJ - rengQ4) / (RENG_M * 2.01)
}

export const RENG_FIGURAS_FUNDAMENTOS: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-fu-densidad',
    titulo: 'Masa y volumen de tres materiales',
    pie: 'Masa frente a volumen para hielo (0,917 g/mL), agua (1,00 g/mL) y aluminio (2,70 g/mL), valores redondeados de uso común: cada material es una recta cuya pendiente es su densidad.',
    alternativo: 'Tres rectas que salen del origen; la del aluminio es la más inclinada y la del hielo la menos.',
    x: { min: 0, max: 100, titulo: 'volumen (mL)' },
    y: { min: 0, max: 280, titulo: 'masa (g)' },
    series: [rengMuestrearN1('hielo', (rengV) => 0.917 * rengV, 0, 100, 10), rengMuestrearN1('agua', (rengV) => 1.0 * rengV, 0, 100, 10), rengMuestrearN1('aluminio', (rengV) => 2.7 * rengV, 0, 100, 10)]
  }),
  rengFiguraN1({
    id: 'fig-fu-calentamiento',
    titulo: 'Curva de calentamiento del agua',
    pie: 'Temperatura de 100 g de agua al aportar calor desde −20 °C, con calores específicos y latentes redondeados de uso común (hielo 2,09, agua 4,184 y vapor 2,01 J/(g·K); fusión 334 J/g y vaporización 2260 J/g): los tramos horizontales son los cambios de estado.',
    alternativo: 'Una línea que sube, se queda plana a 0 °C, sube hasta 100 °C, se queda plana mucho tiempo y vuelve a subir.',
    x: { min: 0, max: 320, titulo: 'calor aportado (kJ)' },
    y: { min: -30, max: 130, titulo: 'temperatura (°C)' },
    series: [rengMuestrearN1('agua', rengCalentamiento, 0, 310, 200)]
  }),
  rengFiguraN1({
    id: 'fig-fu-escalas',
    titulo: 'Escalas de temperatura',
    pie: 'Temperatura en kelvin y en grados Fahrenheit frente a la temperatura en grados Celsius: T(K) = t(°C) + 273,15 y t(°F) = 1,8·t(°C) + 32.',
    alternativo: 'Dos rectas: la de kelvin, paralela a la diagonal y desplazada 273,15; la de Fahrenheit, más inclinada; en el intervalo dibujado no se cruzan.',
    x: { min: -50, max: 150, titulo: 't (°C)' },
    y: { min: -100, max: 450, titulo: 'temperatura en la otra escala' },
    series: [rengMuestrearN1('K', (rengT) => rengT + 273.15, -50, 150, 10), rengMuestrearN1('°F', (rengT) => 1.8 * rengT + 32, -50, 150, 10)]
  }),
  rengFiguraN1({
    id: 'fig-fu-proporciones',
    titulo: 'Proporciones definidas en el óxido de magnesio',
    pie: 'Masa de oxígeno combinada con distintas masas de magnesio al formar MgO, con las masas atómicas de la app: los puntos están en una recta, porque la proporción en masa es fija (ley de Proust).',
    alternativo: 'Una recta que sube desde el origen hasta unos 6,6 g de oxígeno para 10 g de magnesio.',
    x: { min: 0, max: 10, titulo: 'magnesio (g)' },
    y: { min: 0, max: 8, titulo: 'oxígeno combinado (g)' },
    series: [rengMuestrearN1('O', (rengM) => (rengM / rengMmFu('Mg')) * rengMmFu('O'), 0, 10, 10)]
  }),
  rengFiguraN1({
    id: 'fig-fu-medidas',
    titulo: 'Medidas y recta de ajuste',
    pie: 'Medidas didácticas de masa y volumen de seis muestras de un mismo metal (puntos) y la recta m = 7,87·V que mejor las describe: la pendiente es la densidad y la dispersión refleja la incertidumbre de las medidas.',
    alternativo: 'Seis puntos casi alineados y una recta que pasa entre ellos, con pendiente de unos 7,9 g/mL.',
    x: { min: 0, max: 12, titulo: 'volumen (mL)' },
    y: { min: 0, max: 100, titulo: 'masa (g)' },
    series: [
      { nombre: 'medidas', puntos: [[2, 15.9], [4, 31.2], [5, 39.6], [7, 55.3], [9, 70.5], [10, 79.0]] },
      rengMuestrearN1('ajuste', (rengV) => 7.87 * rengV, 0, 12, 12)
    ]
  }),
  rengFiguraN1({
    id: 'fig-fu-presion',
    titulo: 'Presión de un gas al calentarlo',
    pie: 'Presión de 1 mol de gas ideal en 22,4 L según la temperatura (P = nRT/V): crece en línea recta con la temperatura absoluta y se anularía en 0 K.',
    alternativo: 'Una recta que sube desde 0 kPa en 0 K hasta unos 185 kPa en 500 K.',
    x: { min: 0, max: 500, titulo: 'temperatura (K)' },
    y: { min: 0, max: 200, titulo: 'presión (kPa)' },
    series: [rengMuestrearN1('P', (rengT) => (1 * 8.314462618 * rengT) / 22.4, 0, 500, 10)]
  }),
  rengFiguraN1({
    id: 'fig-fu-mezcla',
    titulo: 'Composición de una mezcla de sal y agua',
    pie: 'Porcentaje en masa de sal en una mezcla de 100 g de agua con distintas masas de sal: la composición de una mezcla es variable, a diferencia de la de un compuesto.',
    alternativo: 'Una curva que sube rápido al principio y cada vez más despacio, hasta unos 26 % con 36 g de sal.',
    x: { min: 0, max: 36, titulo: 'sal añadida (g)' },
    y: { min: 0, max: 30, titulo: '% en masa de sal' },
    series: [rengMuestrearN1('% sal', (rengM) => (100 * rengM) / (rengM + 100), 0, 36, 36)]
  })
]
