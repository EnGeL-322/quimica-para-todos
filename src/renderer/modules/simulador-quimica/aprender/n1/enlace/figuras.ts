import { RENG_ANGULO_VSEPR } from '../../../escenas-n1/modelos/geometria-vsepr'
import { rengLennardJones } from '../../../escenas-n1/modelos/interaccion-molecular'
import { rengLecturasOrden } from '../../../escenas-n1/modelos/orden-enlace'
import { RENG_DIATOMICAS, RENG_DISTANCIAS_INTER, RENG_EBULLICION_C, RENG_ENERGIAS_INTERACCION, RENG_GEOMETRIAS, RENG_KJMOL_POR_EV, rengEnergiaCoulombPar } from '../../../nucleo/datosEnlace'
import { rengCaracterIonico } from '../../../nucleo/electronegatividad'
import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'

export const RENG_ORDEN_DIATOMICAS: Readonly<Record<string, number>> = { H2: 1, HCl: 1, Cl2: 1, O2: 2, N2: 3 }
export const RENG_OM_PERIODO2: ReadonlyArray<readonly [string, number, number]> = [['B₂', 4, 2], ['C₂', 6, 2], ['N₂', 8, 2], ['O₂', 8, 4], ['F₂', 8, 6], ['Ne₂', 8, 8]]
export const RENG_EBULLICION_GRUPO16: ReadonlyArray<readonly [number, number]> = [[2, RENG_EBULLICION_C.H2O!.valor], [3, RENG_EBULLICION_C.H2S!.valor], [4, -41.3], [5, -2]]
const RENG_AR = { eps: RENG_ENERGIAS_INTERACCION.londonAr!.valor!, rmin: RENG_DISTANCIAS_INTER['Ar···Ar (mínimo)']!.valor }

export const RENG_FIGURAS_ENLACE: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-en-caracter-ionico',
    titulo: 'Carácter iónico frente a diferencia de electronegatividad',
    pie: 'Porcentaje de carácter iónico de un enlace según la relación empírica de Pauling, 100·(1 − e^(−Δχ²/4)): crece de forma continua con la diferencia de electronegatividad; los límites 0,4 y 1,7 que separan los tipos de enlace son orientativos.',
    alternativo: 'Curva en forma de S tendida que sube desde 0 % en Δχ = 0 hasta cerca del 93 % en Δχ = 3,3; pasa por el 51 % hacia Δχ = 1,7.',
    x: { min: 0, max: 3.4, titulo: 'diferencia de electronegatividad' },
    y: { min: 0, max: 100, titulo: 'carácter iónico (%)' },
    series: [rengMuestrearN1('Pauling', (rengD) => rengCaracterIonico(rengD), 0, 3.3, 33)]
  }),
  rengFiguraN1({
    id: 'fig-en-coulomb',
    titulo: 'Energía de un par de iones',
    pie: 'Energía electrostática (kJ/mol) de un par de iones de cargas +1 y −1, y de cargas +2 y −2, en función de su distancia, calculada con la ley de Coulomb del núcleo de la app: es más negativa cuanto más cerca están y cuanto mayores son las cargas.',
    alternativo: 'Dos curvas negativas que suben hacia cero al aumentar la distancia; la de cargas dobles es cuatro veces más profunda que la de cargas simples.',
    x: { min: 1, max: 6.5, titulo: 'distancia entre iones (Å)' },
    y: { min: -4000, max: 0, titulo: 'energía (kJ/mol)' },
    series: [rengMuestrearN1('cargas ±1', (rengR) => rengEnergiaCoulombPar(1, -1, rengR), 1.5, 6, 30), rengMuestrearN1('cargas ±2', (rengR) => rengEnergiaCoulombPar(2, -2, rengR), 1.5, 6, 30)]
  }),
  rengFiguraN1({
    id: 'fig-en-energia-orden',
    titulo: 'Energía de enlace y orden de enlace',
    pie: 'Energía de disociación (kJ/mol) de Cl₂, H₂, O₂ y N₂ frente a su orden de enlace, con los datos de Huber y Herzberg guardados en la app: el enlace triple del nitrógeno es mucho más fuerte que los sencillos.',
    alternativo: 'Cuatro puntos: dos en orden 1 (unos 239 y 432 kJ/mol), uno en orden 2 (unos 494 kJ/mol) y uno en orden 3 (unos 942 kJ/mol).',
    x: { min: 0, max: 4, titulo: 'orden de enlace' },
    y: { min: 0, max: 1000, titulo: 'energía de enlace (kJ/mol)' },
    series: [{ nombre: 'diatómicas', puntos: ['Cl2', 'H2', 'O2', 'N2'].map((rengF) => [RENG_ORDEN_DIATOMICAS[rengF]!, RENG_DIATOMICAS[rengF]!.D0 * RENG_KJMOL_POR_EV] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-en-longitud-orden',
    titulo: 'Longitud de enlace y orden de enlace',
    pie: 'Distancia de equilibrio (Å) de O₂ y N₂, y de Cl₂ como referencia de enlace sencillo entre átomos del tercer periodo, con los datos de Huber y Herzberg guardados en la app: a mayor orden, enlace más corto.',
    alternativo: 'Tres puntos descendentes: cerca de 1,99 Å en orden 1 (Cl₂), 1,21 Å en orden 2 (O₂) y 1,10 Å en orden 3 (N₂).',
    x: { min: 0, max: 4, titulo: 'orden de enlace' },
    y: { min: 0, max: 2.2, titulo: 'longitud de enlace (Å)' },
    series: [{ nombre: 'diatómicas', puntos: ['Cl2', 'O2', 'N2'].map((rengF) => [RENG_ORDEN_DIATOMICAS[rengF]!, RENG_DIATOMICAS[rengF]!.re] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-en-angulos',
    titulo: 'Ángulos ideales y ángulos medidos',
    pie: 'Ángulo ideal entre dominios electrónicos según la teoría VSEPR (180°, 120°, 109,5° y 90°) y ángulos medidos del agua y del amoníaco (datos de NIST CCCBDB guardados en la app): los pares libres cierran el ángulo respecto al ideal de cuatro dominios.',
    alternativo: 'Línea descendente de 180° con dos dominios a 90° con seis; a la altura de cuatro dominios, dos puntos algo por debajo de 109,5°: 106,7° y 104,5°.',
    x: { min: 1, max: 7, titulo: 'dominios electrónicos' },
    y: { min: 80, max: 190, titulo: 'ángulo (°)' },
    series: [
      { nombre: 'ideal', puntos: [2, 3, 4, 5, 6].map((rengN) => [rengN, RENG_ANGULO_VSEPR[rengN]!] as const) },
      { nombre: 'medido (NH₃ y H₂O)', puntos: [[4, RENG_GEOMETRIAS.NH3!.valor.angulos!['H–N–H']!], [4, RENG_GEOMETRIAS.H2O!.valor.angulos!['H–O–H']!]] }
    ]
  }),
  rengFiguraN1({
    id: 'fig-en-lennard-jones',
    titulo: 'Energía de dos átomos de argón',
    pie: 'Energía de interacción de dos átomos de argón en función de su distancia, con un potencial de Lennard-Jones ajustado al pozo de 1,19 kJ/mol a 3,757 Å (datos de Aziz guardados en la app): atracción débil a distancias medias y repulsión fuerte a distancias cortas.',
    alternativo: 'Curva que baja bruscamente desde valores positivos, alcanza un mínimo de −1,19 kJ/mol cerca de 3,76 Å y sube lentamente hacia cero.',
    x: { min: 3, max: 8, titulo: 'distancia (Å)' },
    y: { min: -1.5, max: 1.5, titulo: 'energía (kJ/mol)' },
    series: [rengMuestrearN1('Ar···Ar', (rengR) => Math.min(1.5, rengLennardJones(RENG_AR.eps, RENG_AR.rmin, rengR)), 3.2, 8, 48)]
  }),
  rengFiguraN1({
    id: 'fig-en-ebullicion',
    titulo: 'Punto de ebullición de los hidruros del grupo 16',
    pie: 'Punto de ebullición (°C) de H₂O, H₂S, H₂Se y H₂Te frente al periodo del átomo central (H₂O y H₂S: datos del CRC guardados en la app; H₂Se y H₂Te: valores recordados, sin verificar): el agua rompe la tendencia por sus enlaces de hidrógeno.',
    alternativo: 'Cuatro puntos: el agua muy arriba (100 °C), una caída hasta unos −60 °C en el H₂S y una subida suave hasta unos −41 °C y −2 °C.',
    x: { min: 1, max: 6, titulo: 'periodo del átomo central' },
    y: { min: -80, max: 120, titulo: 'punto de ebullición (°C)' },
    series: [{ nombre: 'hidruros del grupo 16', puntos: RENG_EBULLICION_GRUPO16 }]
  }),
  rengFiguraN1({
    id: 'fig-en-orden-om',
    titulo: 'Orden de enlace en las diatómicas del segundo periodo',
    pie: 'Orden de enlace de B₂, C₂, N₂, O₂, F₂ y Ne₂ calculado como (enlazantes − antienlazantes)/2 con las ocupaciones habituales de los orbitales moleculares de valencia (recordadas, sin verificar): máximo en el nitrógeno y cero en el neón, que no forma molécula.',
    alternativo: 'Puntos que suben de 1 (B₂) a 2 (C₂) y 3 (N₂) y bajan a 2 (O₂), 1 (F₂) y 0 (Ne₂).',
    x: { min: 5, max: 17, titulo: 'electrones de valencia de la molécula' },
    y: { min: 0, max: 3.5, titulo: 'orden de enlace' },
    series: [{ nombre: 'orden', puntos: RENG_OM_PERIODO2.map(([, rengB, rengA]) => [rengB + rengA, rengLecturasOrden({ nb: rengB, na: rengA }).orden!] as const) }]
  })
]
