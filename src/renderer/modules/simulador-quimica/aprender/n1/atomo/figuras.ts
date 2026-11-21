import { rengLecturasEspectro, rengEnergiaNivel, RENG_C_LUZ, RENG_EV_J, RENG_H_PLANCK } from '../../../escenas-n1/modelos/espectro-hidrogeno'
import { rengValenciaDe } from '../../../escenas-n1/modelos/atomo'
import { RENG_ELEMENTOS } from '../../../../tabla-periodica/data'
import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1 } from '../tipos'

const RENG_NUCLIDOS: ReadonlyArray<readonly [number, number]> = [[1, 0], [2, 2], [6, 6], [7, 7], [8, 8], [10, 10], [11, 12], [12, 12], [13, 14], [14, 14], [15, 16], [16, 16], [17, 18], [18, 22], [19, 20], [20, 20], [26, 30], [29, 34], [30, 34]]

export const RENG_FIGURAS_ATOMO: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-at-niveles',
    titulo: 'Niveles de energía del hidrógeno',
    pie: 'Energía de los niveles del electrón del hidrógeno en el modelo de Bohr, E_n = −13,6 eV/n² (13,6 eV es un valor redondeado): los niveles se acercan entre sí al subir y tienden a 0 eV, la ionización.',
    alternativo: 'Puntos que suben desde −13,6 eV en n = 1 hasta casi 0 eV en n = 7, cada vez más juntos.',
    x: { min: 0, max: 8, titulo: 'nivel n' },
    y: { min: -14, max: 0, titulo: 'energía (eV)' },
    series: [{ nombre: 'E_n', puntos: Array.from({ length: 7 }, (_rengX, rengI) => [rengI + 1, rengEnergiaNivel(rengI + 1)] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-at-balmer',
    titulo: 'Líneas de la serie de Balmer',
    pie: 'Longitud de onda de los fotones que emite el hidrógeno al bajar al nivel 2 desde los niveles 3 a 8, calculada con E_n = −13,6 eV/n² y λ = hc/ΔE: la primera línea (roja) está cerca de 656 nm y las siguientes se acercan a unos 365 nm.',
    alternativo: 'Puntos que bajan desde unos 656 nm (n = 3) hasta unos 389 nm (n = 8).',
    x: { min: 2, max: 9, titulo: 'nivel de partida' },
    y: { min: 300, max: 700, titulo: 'longitud de onda (nm)' },
    series: [{ nombre: 'Balmer', puntos: Array.from({ length: 6 }, (_rengX, rengI) => [rengI + 3, rengLecturasEspectro({ nAlto: rengI + 3, nBajo: 2 }).lambda!] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-at-masas',
    titulo: 'Masa atómica frente a número atómico',
    pie: 'Masa atómica de los elementos 1 a 36 según la tabla de la app: crece aproximadamente como el doble de Z, porque los núcleos tienen tantos neutrones como protones o algo más.',
    alternativo: 'Puntos que suben casi en línea recta desde 1 u (hidrógeno) hasta unos 84 u (kriptón).',
    x: { min: 0, max: 37, titulo: 'número atómico Z' },
    y: { min: 0, max: 90, titulo: 'masa atómica (u)' },
    series: [{ nombre: 'masa', puntos: RENG_ELEMENTOS.filter((rengE) => rengE.z <= 36).map((rengE) => [rengE.z, rengE.masa] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-at-neutrones',
    titulo: 'Neutrones y protones de núclidos comunes',
    pie: 'Número de neutrones frente al de protones en núclidos estables comunes (H-1, He-4, C-12… Zn-64): los ligeros están sobre la recta N = Z y los más pesados tienen algunos neutrones de más.',
    alternativo: 'Puntos que siguen la diagonal N = Z hasta Z = 20 y luego quedan algo por encima.',
    x: { min: 0, max: 32, titulo: 'protones Z' },
    y: { min: 0, max: 36, titulo: 'neutrones N' },
    series: [{ nombre: 'núclidos', puntos: RENG_NUCLIDOS }, rengMuestrearN1('N = Z', (rengZ) => rengZ, 0, 32, 4)]
  }),
  rengFiguraN1({
    id: 'fig-at-capas',
    titulo: 'Capacidad de las capas electrónicas',
    pie: 'Número máximo de electrones por capa, 2n²: cada capa n tiene n² orbitales y en cada orbital caben dos electrones (principio de Pauli).',
    alternativo: 'Puntos que crecen cada vez más deprisa: 2, 8, 18, 32 y 50 electrones para n = 1 a 5.',
    x: { min: 0, max: 6, titulo: 'capa n' },
    y: { min: 0, max: 55, titulo: 'electrones máximos' },
    series: [{ nombre: '2n²', puntos: Array.from({ length: 5 }, (_rengX, rengI) => [rengI + 1, 2 * (rengI + 1) ** 2] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-at-valencia',
    titulo: 'Electrones de valencia de los 20 primeros elementos',
    pie: 'Electrones s y p de la capa más externa según la configuración electrónica de la tabla de la app: suben de 1 a 8 a lo largo de cada periodo y vuelven a 1 al empezar el siguiente.',
    alternativo: 'Diente de sierra: sube de 1 a 2 (H, He), de 1 a 8 (Li a Ne), de 1 a 8 (Na a Ar) y vuelve a 1 y 2 (K, Ca).',
    x: { min: 0, max: 21, titulo: 'número atómico Z' },
    y: { min: 0, max: 9, titulo: 'electrones de valencia' },
    series: [{ nombre: 'valencia', puntos: Array.from({ length: 20 }, (_rengX, rengI) => [rengI + 1, rengValenciaDe(rengI + 1)] as const) }]
  }),
  rengFiguraN1({
    id: 'fig-at-foton',
    titulo: 'Energía de un fotón según su longitud de onda',
    pie: 'Energía de un fotón E = h·c/λ en electronvoltios, con h, c y e exactos del SI: la luz violeta (400 nm) lleva unos 3,1 eV y la roja (700 nm), unos 1,8 eV.',
    alternativo: 'Una curva que baja desde unos 6,2 eV a 200 nm hasta unos 1,6 eV a 800 nm.',
    x: { min: 200, max: 800, titulo: 'longitud de onda (nm)' },
    y: { min: 0, max: 7, titulo: 'energía del fotón (eV)' },
    series: [rengMuestrearN1('E', (rengL) => (RENG_H_PLANCK * RENG_C_LUZ) / (rengL * 1e-9) / RENG_EV_J, 200, 800, 60)]
  })
]
