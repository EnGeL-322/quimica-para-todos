import { rengTx } from '../aprender/n1/gases/constantes'
import {
  RENG_C_AT, RENG_ELEMENTOS_AUFBAU_AT, RENG_HC_EVNM_AT, RENG_NA_AT, RENG_REPRESENTATIVOS_AT, RENG_TOL_AT_ENT, rengCapacidadAt, rengCapaMaxAt, rengConfigAt, rengDesapareadosAt, rengDesapSubAt, rengEnCapaAt, rengEnSubAt,
  rengGasAnteriorAt, rengIonAt, rengLlenarAt, rengNombreAt, rengOrbitalesLlenosAt, rengOrbitalesOcupadosAt, rengPracticaAt, rengSimboloDeZAt, rengUltimoSubAt, rengValenciaAt, rengZAt
} from './b02-comun'
import { RENG_IONES_GAS_AT } from './b02-s09-s16'
import { rengAtomosNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const E = RENG_TOL_AT_ENT
const UNO: readonly number[] = [0]
const qTx = (rengQ: number): string => (rengQ > 0 ? `+${rengQ}` : String(rengQ))
const dE = (rengA: number, rengB: number): number => 13.6 * (1 / (rengB * rengB) - 1 / (rengA * rengA))
const el = (rengZ: number): string => `${rengNombreAt(rengSimboloDeZAt(rengZ))} (Z = ${rengZ})`
export const RENG_SUBNIVELES_AT: readonly string[] = ['2s', '2p', '3s', '3p', '3d', '4s', '4p', '4d', '4f', '5s', '5p', '5d', '5f', '6s', '6p', '6d', '7s', '7p']
export const RENG_TIPOS_SUB_AT: ReadonlyArray<readonly [string, number]> = [['p', 6], ['d', 10], ['f', 14]]
export const RENG_IONES_TRANSICION_AT: ReadonlyArray<readonly [string, number]> = [
  ['Ti', 2], ['Ti', 3], ['V', 2], ['V', 3], ['V', 4], ['Cr', 3], ['Mn', 2], ['Mn', 3], ['Mn', 4], ['Fe', 2], ['Fe', 3], ['Co', 2], ['Co', 3], ['Ni', 2], ['Cu', 2], ['Zn', 2], ['Sc', 3]
]
export const rengDIonAt = (rengS: string, rengQ: number): number => rengZAt(rengS) - 18 - rengQ
export const RENG_SUB_CONFIG_AT: ReadonlyArray<readonly [number, string]> = [
  [26, '3d'], [17, '3p'], [35, '4p'], [20, '4s'], [33, '4p'], [25, '3d'], [15, '3p'], [28, '3d'], [12, '3s'], [8, '2p'], [38, '5s'], [30, '3d'], [14, '3p'], [32, '4p'], [22, '3d'], [27, '3d'], [9, '2p'], [34, '4p'], [23, '3d'], [16, '3p']
]
export const RENG_MOLECULAS_VALENCIA_AT: readonly string[] = ['H2O', 'CO2', 'NH3', 'CH4', 'SO2', 'HCN', 'CCl4', 'PCl3', 'H2S', 'SO3', 'C2H6', 'C2H4', 'OF2', 'BF3', 'CS2', 'N2', 'O2', 'HCl', 'CH2O', 'C2H2']
const pElectrones = (rengZ: number): number => rengLlenarAt(rengZ).filter(([rengS]) => rengS[1] === 'p').reduce((rengA, [, rengK]) => rengA + rengK, 0)
const ultimoP = (rengZ: number): number => rengLlenarAt(rengZ).filter(([rengS]) => rengS[1] === 'p').at(-1)?.[1] ?? 0
const aparearPrimero = (rengZ: number): number => rengLlenarAt(rengZ).reduce((rengA, [, rengK]) => rengA + (rengK % 2), 0)
const valMol = (rengF: string, rengPeso: (rengZ: number) => number, rengSub = true): number => [...rengAtomosNo(rengF).entries()].reduce((rengA, [rengS, rengN]) => rengA + rengPeso(rengZAt(rengS)) * (rengSub ? rengN : 1), 0)

export const RENG_PRACTICAS_B02_S17: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s17-p1', titulo: 'Frecuencia de una radiación', unidad: 'THz',
    objetivo: 'Calcular la frecuencia de una radiación a partir de su longitud de onda con c = λ·ν.', seccion: '6.1', para: 'la radiación electromagnética',
    idealizado: 'Propagación en el vacío.', metodo: 'búsqueda por bisección de la frecuencia', sinVerificar: [], lista: UNO, x: [200, 1000, 5],
    respuesta: (_e, x) => RENG_C_AT / (x * 1e-9) / 1e12,
    errores: (_e, x, _y, rengR) => [
      ['exponente', 'Paso de nm a m', rengR / 10, 'Revisa el paso de nanómetros a metros: 1 nm = 10⁻⁹ m.'],
      ['producto', 'Producto en lugar de cociente', (RENG_C_AT * x * 1e-9) / 1e12, 'Multiplicaste c por λ; la frecuencia es c dividida entre λ.']
    ],
    enunciado: (_e, x) => `Una radiación electromagnética tiene una longitud de onda de ${tx(x)} nm en el vacío.`,
    pregunta: '¿Cuál es su frecuencia, en THz?',
    datos: (_e, x) => [['λ', `${tx(x)} nm`], ['c', '2,998·10⁸ m/s']],
    pasos: (_e, x, _y, rengR) => [`ν = c/λ = 2,998·10⁸ / (${tx(x)}·10⁻⁹) Hz.`, `ν = ${tx(rengR)} THz (1 THz = 10¹² Hz).`],
    pistas: ['Pasa λ a metros.', 'Divide c entre λ.', 'Pasa los hercios a terahercios.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s17-p2', titulo: 'Energía de un fotón', unidad: 'eV',
    objetivo: 'Calcular la energía de un fotón en electronvoltios a partir de su longitud de onda.', seccion: '6.1', para: 'la energía de los fotones',
    idealizado: 'Fotón en el vacío.', metodo: 'conversión de J a eV del catálogo de unidades', sinVerificar: [], lista: UNO, x: [200, 1000, 5],
    respuesta: (_e, x) => RENG_HC_EVNM_AT / x,
    errores: (_e, x, _y, rengR) => [
      ['julios', 'En julios', rengR * 1.602176634e-19, 'Ese valor está en julios; la pregunta pide la energía en electronvoltios.'],
      ['invertida', 'Cociente invertido', x / RENG_HC_EVNM_AT, 'Invertiste la fórmula: E = hc/λ, con λ en el denominador.']
    ],
    enunciado: (_e, x) => `Un fotón tiene una longitud de onda de ${tx(x)} nm.`,
    pregunta: '¿Qué energía tiene, en eV?',
    datos: (_e, x) => [['λ', `${tx(x)} nm`], ['h·c', '1239,84 eV·nm']],
    pasos: (_e, x, _y, rengR) => [`E = h·c/λ = 1239,84 eV·nm / ${tx(x)} nm.`, `E = ${tx(rengR)} eV.`],
    pistas: ['Usa h·c = 1239,84 eV·nm.', 'Divide entre la longitud de onda.', 'A menor λ, más energía.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s17-p3', titulo: 'Energía de un mol de fotones', unidad: 'kJ/mol',
    objetivo: 'Calcular la energía de un mol de fotones de una longitud de onda dada.', seccion: '6.1', para: 'la energía de los fotones',
    idealizado: 'Fotones en el vacío.', metodo: 'conversión de eV a J del catálogo de unidades', sinVerificar: [], lista: UNO, x: [200, 1000, 5],
    respuesta: (_e, x) => ((6.62607015e-34 * RENG_C_AT) / (x * 1e-9)) * RENG_NA_AT / 1000,
    errores: (_e, x, _y, rengR) => [
      ['por-foton', 'Un solo fotón', (6.62607015e-34 * RENG_C_AT) / (x * 1e-9), 'Esa es la energía de un solo fotón; multiplica por N_A para un mol.'],
      ['sin-1000', 'En J/mol', rengR * 1000, 'Ese resultado está en J/mol; divide entre 1000 para pasar a kJ/mol.']
    ],
    enunciado: (_e, x) => `Una lámpara emite fotones de ${tx(x)} nm.`,
    pregunta: '¿Qué energía tiene un mol de esos fotones, en kJ/mol?',
    datos: (_e, x) => [['λ', `${tx(x)} nm`], ['Constantes', 'h = 6,626·10⁻³⁴ J·s; c = 2,998·10⁸ m/s; N_A = 6,022·10²³ mol⁻¹']],
    pasos: (_e, x, _y, rengR) => [`E (un fotón) = h·c/λ = ${tx((6.62607015e-34 * RENG_C_AT) / (x * 1e-9) * 1e19, 4)}·10⁻¹⁹ J.`, `× N_A / 1000 = ${tx(rengR)} kJ/mol.`],
    pistas: ['Calcula la energía de un fotón.', 'Multiplica por N_A.', 'Pasa los J a kJ.']
  })
]

export const RENG_PRACTICAS_B02_S18: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s18-p1', titulo: 'Longitud de onda de una línea del hidrógeno', unidad: 'nm',
    objetivo: 'Calcular la longitud de onda de una línea del espectro del hidrógeno a partir de los niveles del salto.', seccion: '6.2', para: 'los espectros de líneas', particulas: true,
    idealizado: 'Hidrógeno de Bohr.', metodo: 'escena «espectro-hidrogeno»', lista: UNO, x: [2, 8, 1], y: [1, 3, 1], valida: (_e, x, y) => y < x,
    respuesta: (_e, x, y) => RENG_HC_EVNM_AT / dE(x, y),
    errores: (_e, x, y) => [
      ['suma', 'Suma de inversos', RENG_HC_EVNM_AT / (13.6 * (1 / (y * y) + 1 / (x * x))), 'Sumaste los términos de los dos niveles; la energía del salto es su diferencia.'],
      ['energia', 'La energía', dE(x, y), 'Ese valor es la energía del salto en eV; falta pasarla a longitud de onda con λ = hc/ΔE.']
    ],
    enunciado: (_e, x, y) => `En el espectro del hidrógeno se observa la línea del salto n = ${x} → n = ${y}.`,
    pregunta: '¿Cuál es su longitud de onda, en nm?',
    datos: (_e, x, y) => [['Salto', `${x} → ${y}`], ['Datos', 'Eₙ = −13,6/n² eV; h·c = 1239,84 eV·nm']],
    pasos: (_e, x, y, rengR) => [`ΔE = 13,6·(1/${y * y} − 1/${x * x}) = ${tx(dE(x, y), 4)} eV.`, `λ = 1239,84/ΔE = ${tx(rengR, 4)} nm.`],
    pistas: ['Calcula la energía del salto.', 'Usa λ = hc/ΔE.', 'Comprueba si es visible.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s18-p2', titulo: 'Líneas posibles entre niveles', unidad: '', tolerancia: E,
    objetivo: 'Contar las líneas distintas que pueden aparecer cuando los electrones bajan entre varios niveles.', seccion: '6.2', para: 'los espectros de líneas',
    idealizado: 'Todas las transiciones hacia abajo son posibles.', metodo: 'recuento explícito de pares de niveles', sinVerificar: [], lista: UNO, x: [3, 10, 1], y: [1, 8, 1], valida: (_e, x, y) => x - y >= 2,
    respuesta: (_e, x, y) => ((x - y + 1) * (x - y)) / 2,
    errores: (_e, x, y) => [
      ['k-1', 'Solo saltos consecutivos', x - y, 'Contaste solo los saltos entre niveles vecinos; también hay saltos que se saltan niveles.'],
      ['k2', 'Pares con orden y repetidos', (x - y + 1) ** 2, 'Contaste pares repetidos o de un nivel consigo mismo; cada línea une dos niveles distintos una sola vez.']
    ],
    enunciado: (_e, x, y) => `En una muestra de hidrógeno, los electrones pueden estar en cualquier nivel entre n = ${y} y n = ${x}, y bajar de uno a otro.`,
    pregunta: '¿Cuántas líneas distintas pueden emitirse con saltos entre esos niveles?',
    datos: (_e, x, y) => [['Nivel más bajo', `n = ${y}`], ['Nivel más alto', `n = ${x}`]],
    pasos: (_e, x, y, rengR) => [`Hay k = ${x - y + 1} niveles; cada par da una línea.`, `Líneas = k(k − 1)/2 = ${tx(rengR)}.`],
    pistas: ['Cuenta los niveles disponibles.', 'Cada par de niveles da una línea.', 'Usa k(k − 1)/2.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s18-p3', titulo: 'Nivel de partida de una línea', unidad: '', tolerancia: E,
    objetivo: 'Identificar el nivel de partida de una línea del hidrógeno a partir de su longitud de onda.', seccion: '6.2', para: 'los espectros de líneas', particulas: true,
    idealizado: 'Hidrógeno de Bohr.', metodo: 'escena «espectro-hidrogeno» recorriendo niveles', lista: UNO, x: [2, 8, 1], y: [1, 3, 1], valida: (_e, x, y) => y < x,
    respuesta: (_e, x) => x,
    errores: (_e, x, y) => [
      ['nivel-bajo', 'El nivel de llegada', y, 'Ese es el nivel de llegada; se pide el nivel desde el que baja el electrón.'],
      ['uno-mas', 'Un nivel de más', x + 1, 'Con ese nivel la línea tendría menor longitud de onda; revisa el cálculo de ΔE.']
    ],
    enunciado: (_e, x, y) => `Una línea del espectro del hidrógeno tiene λ = ${tx(RENG_HC_EVNM_AT / dE(x, y), 5)} nm y corresponde a un salto que termina en n = ${y}.`,
    pregunta: '¿Desde qué nivel baja el electrón?',
    datos: (_e, x, y) => [['λ', `${tx(RENG_HC_EVNM_AT / dE(x, y), 5)} nm`], ['Nivel final', `n = ${y}`]],
    pasos: (_e, x, y, rengR) => [`ΔE = 1239,84/λ = ${tx(dE(x, y), 4)} eV; 1/n² = 1/${y * y} − ΔE/13,6.`, `n = ${tx(rengR)}.`],
    pistas: ['Calcula ΔE con hc/λ.', 'Despeja 1/n² del nivel alto.', 'El resultado debe ser entero.']
  })
]

export const RENG_PRACTICAS_B02_S19: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s19-p1', titulo: 'Electrones con n y l dados', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones que pueden tener a la vez unos valores dados de n y l.', seccion: '6.3', para: 'los números cuánticos',
    idealizado: 'Átomo con electrones independientes.', metodo: 'recuento explícito de m_l y m_s', sinVerificar: [], lista: UNO, x: [2, 7, 1], y: [0, 3, 1], valida: (_e, x, y) => y < x,
    respuesta: (_e, _x, y) => 2 * (2 * y + 1),
    errores: (_e, x, y) => [
      ['sin-espin', 'Sin el espín', 2 * y + 1, 'Contaste orbitales; cada orbital admite dos electrones de espín opuesto.'],
      ['capa', 'Toda la capa', 2 * x * x, 'Contaste toda la capa; l fija un solo subnivel.']
    ],
    enunciado: (_e, x, y) => `En un átomo se buscan los electrones con n = ${x} y l = ${y}.`,
    pregunta: '¿Cuántos electrones como máximo pueden tener esos dos números cuánticos?',
    datos: (_e, x, y) => [['n', String(x)], ['l', String(y)]],
    pasos: (_e, _x, y, rengR) => [`m_l va de −${y} a +${y}: ${2 * y + 1} orbitales.`, `Electrones = 2 × ${2 * y + 1} = ${tx(rengR)}.`],
    pistas: ['Cuenta los valores de m_l.', 'Cada uno es un orbital.', 'Multiplica por dos espines.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s19-p2', titulo: 'Electrones con n y m_l dados', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones de una capa que comparten el número cuántico magnético.', seccion: '6.3', para: 'los números cuánticos',
    idealizado: 'Átomo con electrones independientes.', metodo: 'recuento explícito de l y m_s', sinVerificar: [], lista: UNO, x: [1, 7, 1], y: [-3, 3, 1], valida: (_e, x, y) => Math.abs(y) < x,
    respuesta: (_e, x, y) => 2 * (x - Math.abs(y)),
    errores: (_e, x, y) => [
      ['sin-espin', 'Sin el espín', x - Math.abs(y), 'Contaste orbitales; cada uno admite dos electrones.'],
      ['uno', 'Un solo orbital', 2, 'Varios subniveles de la capa tienen ese m_l: cuenta todos los l con l ≥ |m_l|.']
    ],
    enunciado: (_e, x, y) => `En la capa n = ${x} se buscan los electrones con m_l = ${y}.`,
    pregunta: '¿Cuántos electrones como máximo cumplen esas condiciones?',
    datos: (_e, x, y) => [['n', String(x)], ['m_l', String(y)]],
    pasos: (_e, x, y, rengR) => [`l puede valer de ${Math.abs(y)} a ${x - 1}: ${x - Math.abs(y)} orbitales.`, `Electrones = ${tx(rengR)}.`],
    pistas: ['m_l exige l ≥ |m_l|.', 'Cuenta los l permitidos.', 'Multiplica por dos espines.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s19-p3', titulo: 'Electrones con un l en varias capas', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones con un valor de l en un átomo con varias capas completas.', seccion: '6.3', para: 'los números cuánticos',
    idealizado: 'Capas completas con todos sus subniveles.', metodo: 'recuento capa a capa', sinVerificar: [], lista: UNO, x: [2, 8, 1], y: [0, 3, 1], valida: (_e, x, y) => y < x,
    respuesta: (_e, x, y) => 2 * (2 * y + 1) * (x - y),
    errores: (_e, x, y) => [
      ['una-capa', 'Una sola capa', 2 * (2 * y + 1), 'Contaste solo una capa; el subnivel existe en todas las capas con n > l.'],
      ['sin-espin', 'Sin el espín', (2 * y + 1) * (x - y), 'Contaste orbitales; multiplica por dos electrones por orbital.']
    ],
    enunciado: (_e, x, y) => `Un átomo hipotético tiene completas todas las capas de n = 1 a n = ${x}, con todos sus subniveles.`,
    pregunta: (_e, _x, y) => `¿Cuántos electrones tienen l = ${y}?`,
    datos: (_e, x, y) => [['Capas completas', `n = 1 a ${x}`], ['l', String(y)]],
    pasos: (_e, x, y, rengR) => [`l = ${y} aparece en las capas n = ${y + 1} … ${x}: ${x - y} capas.`, `Electrones = ${2 * (2 * y + 1)} × ${x - y} = ${tx(rengR)}.`],
    pistas: ['l existe si n > l.', 'Cuenta las capas que lo tienen.', 'Multiplica por 2(2l + 1).']
  })
]

export const RENG_PRACTICAS_B02_S20: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s20-p1', titulo: 'Orbitales de un subnivel', unidad: '', tolerancia: E,
    objetivo: 'Calcular cuántos orbitales tiene un subnivel a partir de su letra.', seccion: '6.3', para: 'los orbitales atómicos',
    idealizado: 'Subniveles del átomo de hidrógeno.', metodo: 'recuento de m_l', sinVerificar: [], lista: RENG_SUBNIVELES_AT,
    respuesta: (s) => rengCapacidadAt(s) / 2,
    errores: (s) => [
      ['electrones', 'Los electrones', rengCapacidadAt(s), 'Ese número son los electrones que admite; cada orbital aloja dos.'],
      ['n', 'El número de la capa', Number(s[0]), 'El número de orbitales depende de la letra (l), no del número de la capa.']
    ],
    enunciado: (s) => `Considera el subnivel ${s} de un átomo.`,
    pregunta: '¿Cuántos orbitales tiene?',
    datos: (s) => [['Subnivel', s], ['Letras', 's: l = 0; p: 1; d: 2; f: 3']],
    pasos: (s, _x, _y, rengR) => [`${s[1]} corresponde a l = ${(rengCapacidadAt(s) / 2 - 1) / 2}.`, `Orbitales = 2l + 1 = ${tx(rengR)}.`],
    pistas: ['Pasa la letra a l.', 'Calcula 2l + 1.', 'No depende de n.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s20-p2', titulo: 'Orbitales ocupados de un átomo', unidad: '', tolerancia: E,
    objetivo: 'Contar los orbitales con al menos un electrón en el estado fundamental de un átomo.', seccion: '6.4', para: 'los orbitales y la configuración',
    idealizado: 'Estado fundamental según Aufbau, Pauli y Hund.', metodo: 'ocupación de la tabla de la app y reparto de Hund', sinVerificar: [], lista: RENG_ELEMENTOS_AUFBAU_AT,
    respuesta: (z) => rengOrbitalesOcupadosAt(z),
    errores: (z) => [
      ['mitad', 'Mitad de los electrones', z / 2, 'Supusiste todos los orbitales llenos; con Hund algunos tienen un solo electrón.'],
      ['subniveles', 'Los subniveles', rengLlenarAt(z).length, 'Contaste subniveles; un subnivel p tiene tres orbitales y uno d, cinco.']
    ],
    enunciado: (z) => `Considera el átomo de ${el(z)} en su estado fundamental.`,
    pregunta: '¿Cuántos orbitales tienen al menos un electrón?',
    datos: (z) => [['Z', String(z)], ['Orden', '1s 2s 2p 3s 3p 4s 3d 4p 5s']],
    pasos: (z, _x, _y, rengR) => [`Configuración: ${rengConfigAt(z)}.`, `Orbitales ocupados = ${tx(rengR)}.`],
    pistas: ['Escribe la configuración.', 'Reparte con la regla de Hund.', 'Cuenta orbitales con electrones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s20-p3', titulo: 'Electrones en orbitales p', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones de un átomo que ocupan orbitales p.', seccion: '6.4', para: 'los orbitales y la configuración',
    idealizado: 'Estado fundamental según Aufbau.', metodo: 'ocupación de la tabla de la app', sinVerificar: [], lista: RENG_ELEMENTOS_AUFBAU_AT,
    respuesta: (z) => pElectrones(z),
    errores: (z) => [
      ['ultimo-p', 'Solo el último p', ultimoP(z), 'Contaste solo el último subnivel p; también hay electrones en los p interiores.'],
      ['todos', 'Todos los electrones', z, 'Contaste todos los electrones; solo se piden los de orbitales p.']
    ],
    enunciado: (z) => `Escribe la configuración electrónica del ${el(z)}.`,
    pregunta: '¿Cuántos de sus electrones están en orbitales p?',
    datos: (z) => [['Z', String(z)], ['Orden', '1s 2s 2p 3s 3p 4s 3d 4p 5s']],
    pasos: (z, _x, _y, rengR) => [`Configuración: ${rengConfigAt(z)}.`, `Electrones p = ${tx(rengR)}.`],
    pistas: ['Escribe la configuración.', 'Localiza todos los subniveles p.', 'Suma sus electrones.']
  })
]

export const RENG_PRACTICAS_B02_S21: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s21-p1', titulo: 'Electrones del último subnivel', unidad: '', tolerancia: E,
    objetivo: 'Aplicar el orden de llenado para saber cuántos electrones tiene el último subnivel ocupado.', seccion: '6.4', para: 'el principio de Aufbau',
    idealizado: 'Estado fundamental según Aufbau.', metodo: 'ocupación de la tabla de la app', sinVerificar: [], lista: RENG_ELEMENTOS_AUFBAU_AT,
    respuesta: (z) => rengLlenarAt(z).at(-1)![1],
    errores: (z) => [
      ['capacidad', 'Subnivel lleno', rengCapacidadAt(rengUltimoSubAt(z)), 'Supusiste el subnivel lleno; reparte los electrones uno a uno siguiendo el orden.'],
      ['capa', 'Toda la capa', rengEnCapaAt(z, Number(rengUltimoSubAt(z)[0])), 'Contaste toda la capa; se pide solo el último subnivel que se llena.']
    ],
    enunciado: (z) => `Reparte los electrones del ${el(z)} siguiendo el orden de Aufbau.`,
    pregunta: '¿Cuántos electrones tiene el último subnivel ocupado?',
    datos: (z) => [['Z', String(z)], ['Orden', '1s 2s 2p 3s 3p 4s 3d 4p 5s']],
    pasos: (z, _x, _y, rengR) => [`Configuración: ${rengConfigAt(z)}.`, `Último subnivel: ${rengUltimoSubAt(z)} con ${tx(rengR)} electrones.`],
    pistas: ['Sigue el orden de llenado.', 'Llena cada subnivel antes del siguiente.', 'Mira el último que recibe electrones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s21-p2', titulo: 'Electrones de la tercera capa', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones de la capa n = 3 teniendo en cuenta que el 3d se llena después del 4s.', seccion: '6.4', para: 'el principio de Aufbau',
    idealizado: 'Estado fundamental según Aufbau.', metodo: 'ocupación de la tabla de la app', sinVerificar: [], lista: [21, 22, 23, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38],
    respuesta: (z) => rengEnCapaAt(z, 3),
    errores: (z) => [
      ['sin-d', 'Sin el 3d', 8, 'Olvidaste el subnivel 3d: forma parte de la tercera capa aunque se llene después del 4s.'],
      ['capa-4', 'La cuarta capa', rengEnCapaAt(z, 4), 'Esos son los electrones de la cuarta capa; se pide la tercera.']
    ],
    enunciado: (z) => `Escribe la configuración del ${el(z)}.`,
    pregunta: '¿Cuántos electrones tiene en la capa n = 3?',
    datos: (z) => [['Z', String(z)], ['Capa', 'n = 3 (3s, 3p y 3d)']],
    pasos: (z, _x, _y, rengR) => [`Configuración: ${rengConfigAt(z)}.`, `3s + 3p + 3d = ${tx(rengR)}.`],
    pistas: ['El 4s se llena antes que el 3d.', 'La capa 3 incluye 3s, 3p y 3d.', 'Suma sus electrones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s21-p3', titulo: 'Subniveles ocupados', unidad: '', tolerancia: E,
    objetivo: 'Contar los subniveles ocupados en el estado fundamental de un átomo.', seccion: '6.4', para: 'el principio de Aufbau',
    idealizado: 'Estado fundamental según Aufbau.', metodo: 'ocupación de la tabla de la app', sinVerificar: [], lista: RENG_ELEMENTOS_AUFBAU_AT,
    respuesta: (z) => rengLlenarAt(z).length,
    errores: (z) => [
      ['capas', 'Las capas', rengCapaMaxAt(z), 'Contaste capas; cada capa puede tener varios subniveles ocupados.'],
      ['orbitales', 'Los orbitales', rengOrbitalesOcupadosAt(z), 'Contaste orbitales; un subnivel p o d agrupa varios orbitales.']
    ],
    enunciado: (z) => `Considera el ${el(z)} en su estado fundamental.`,
    pregunta: '¿Cuántos subniveles (1s, 2s, 2p…) tienen electrones?',
    datos: (z) => [['Z', String(z)], ['Orden', '1s 2s 2p 3s 3p 4s 3d 4p 5s']],
    pasos: (z, _x, _y, rengR) => [`Configuración: ${rengConfigAt(z)}.`, `Subniveles ocupados = ${tx(rengR)}.`],
    pistas: ['Escribe la configuración.', 'Cada término es un subnivel.', 'Cuenta los términos.']
  })
]

export const RENG_PRACTICAS_B02_S22: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s22-p1', titulo: 'Capacidad de varias capas', unidad: '', tolerancia: E,
    objetivo: 'Aplicar el principio de exclusión para sumar la capacidad de varias capas.', seccion: '6.4', para: 'el principio de exclusión',
    idealizado: 'Capas con todos sus subniveles permitidos.', metodo: 'recuento de combinaciones de números cuánticos', sinVerificar: [], lista: UNO, x: [1, 5, 1], y: [2, 7, 1], valida: (_e, x, y) => y > x,
    respuesta: (_e, x, y) => { let s = 0; for (let k = x; k <= y; k++) s += 2 * k * k; return s },
    errores: (_e, x, y) => { let s = 0; for (let k = x; k <= y; k++) s += k * k; return [
      ['solo-ultima', 'Solo la última capa', 2 * y * y, 'Contaste solo la última capa; suma todas las capas del intervalo.'],
      ['sin-2', 'Sin el espín', s, 'Contaste orbitales (n²); cada orbital admite dos electrones.']
    ] },
    enunciado: (_e, x, y) => `Se quieren llenar por completo las capas desde n = ${x} hasta n = ${y}.`,
    pregunta: '¿Cuántos electrones caben en total en esas capas?',
    datos: (_e, x, y) => [['Desde', `n = ${x}`], ['Hasta', `n = ${y}`]],
    pasos: (_e, x, y, rengR) => [`Cada capa admite 2n² electrones (Pauli).`, `Suma de n = ${x} a ${y}: ${tx(rengR)}.`],
    pistas: ['Calcula 2n² en cada capa.', 'Incluye las dos capas extremas.', 'Suma todas.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s22-p2', titulo: 'Orbitales llenos de un átomo', unidad: '', tolerancia: E,
    objetivo: 'Contar los orbitales que tienen dos electrones de espín opuesto en un átomo.', seccion: '6.4', para: 'el principio de exclusión',
    idealizado: 'Estado fundamental según Aufbau, Pauli y Hund.', metodo: 'ocupación de la tabla de la app y reparto de Hund', sinVerificar: [], lista: RENG_ELEMENTOS_AUFBAU_AT,
    respuesta: (z) => rengOrbitalesLlenosAt(z),
    errores: (z) => [
      ['mitad', 'Mitad de los electrones', Math.floor(z / 2), 'Supusiste todos los electrones apareados; con Hund algunos quedan solos.'],
      ['ocupados', 'Orbitales ocupados', rengOrbitalesOcupadosAt(z), 'Contaste también los orbitales con un solo electrón.']
    ],
    enunciado: (z) => `Considera el ${el(z)} en su estado fundamental.`,
    pregunta: '¿Cuántos orbitales tienen dos electrones (con espines opuestos)?',
    datos: (z) => [['Z', String(z)], ['Regla', 'Pauli: máximo dos electrones por orbital']],
    pasos: (z, _x, _y, rengR) => [`Configuración: ${rengConfigAt(z)}.`, `Orbitales llenos = ${tx(rengR)}.`],
    pistas: ['Escribe la configuración.', 'Reparte con la regla de Hund.', 'Cuenta orbitales con dos electrones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s22-p3', titulo: 'Huecos del último subnivel', unidad: '', tolerancia: E,
    objetivo: 'Calcular cuántos electrones faltan para completar el último subnivel ocupado.', seccion: '6.4', para: 'el principio de exclusión',
    idealizado: 'Estado fundamental según Aufbau.', metodo: 'ocupación de la tabla de la app', sinVerificar: [], lista: RENG_ELEMENTOS_AUFBAU_AT,
    respuesta: (z) => rengCapacidadAt(rengUltimoSubAt(z)) - rengLlenarAt(z).at(-1)![1],
    errores: (z) => [
      ['electrones', 'Los electrones del subnivel', rengLlenarAt(z).at(-1)![1], 'Esos son los electrones que ya tiene; se piden los que faltan.'],
      ['capacidad', 'La capacidad del subnivel', rengCapacidadAt(rengUltimoSubAt(z)), 'Esa es la capacidad total del subnivel; resta los electrones que ya tiene.']
    ],
    enunciado: (z) => `El ${el(z)} tiene su último subnivel ocupado sin completar.`,
    pregunta: '¿Cuántos electrones le faltan para completarlo?',
    datos: (z) => [['Z', String(z)], ['Capacidades', 's 2, p 6, d 10, f 14']],
    pasos: (z, _x, _y, rengR) => [`Último subnivel: ${rengUltimoSubAt(z)} con ${rengLlenarAt(z).at(-1)![1]} electrones.`, `Faltan ${tx(rengR)}.`],
    pistas: ['Escribe la configuración.', 'Mira el último subnivel.', 'Resta de su capacidad.']
  })
]

export const RENG_PRACTICAS_B02_S23: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s23-p1', titulo: 'Electrones desapareados de un átomo', unidad: '', tolerancia: E,
    objetivo: 'Aplicar la regla de Hund para contar los electrones desapareados de un átomo.', seccion: '6.4', para: 'la regla de Hund',
    idealizado: 'Estado fundamental según Aufbau y Hund.', metodo: 'ocupación de la tabla de la app y reparto de Hund', sinVerificar: [], lista: RENG_ELEMENTOS_AUFBAU_AT,
    respuesta: (z) => rengDesapareadosAt(z),
    errores: (z) => [
      ['aparear', 'Apareando primero', aparearPrimero(z), 'Apareaste los electrones antes de repartirlos; Hund pide uno en cada orbital primero.'],
      ['valencia', 'Los de valencia', rengValenciaAt(z), 'Esos son los electrones de valencia; no todos están desapareados.']
    ],
    enunciado: (z) => `Considera el ${el(z)} en su estado fundamental.`,
    pregunta: '¿Cuántos electrones desapareados tiene?',
    datos: (z) => [['Z', String(z)], ['Regla', 'Hund: uno en cada orbital antes de aparear']],
    pasos: (z, _x, _y, rengR) => [`Configuración: ${rengConfigAt(z)}.`, `Desapareados = ${tx(rengR)}.`],
    pistas: ['Escribe la configuración.', 'Mira los subniveles incompletos.', 'Reparte con la regla de Hund.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s23-p2', titulo: 'Desapareados de un subnivel', unidad: '', tolerancia: E,
    objetivo: 'Calcular los electrones desapareados de un subnivel con un número dado de electrones.', seccion: '6.4', para: 'la regla de Hund',
    idealizado: 'Subnivel aislado de orbitales de igual energía.', metodo: 'reparto explícito orbital a orbital', sinVerificar: [], lista: RENG_TIPOS_SUB_AT, x: [2, 13, 1], valida: ([, c], x) => x < c,
    respuesta: ([, c], x) => rengDesapSubAt(x, c),
    errores: ([, c], x) => [
      ['aparear', 'Apareando primero', x % 2, 'Apareaste los electrones antes de llenar todos los orbitales; Hund lo prohíbe.'],
      ['orbitales', 'Los orbitales', c / 2, 'Ese es el número de orbitales del subnivel, no el de electrones desapareados.']
    ],
    enunciado: ([t], x) => `Un subnivel ${t} contiene ${x} electrones.`,
    pregunta: '¿Cuántos electrones desapareados hay en él?',
    datos: ([t, c], x) => [['Subnivel', `${t} (${c / 2} orbitales)`], ['Electrones', String(x)]],
    pasos: ([, c], x, _y, rengR) => [`Primero uno en cada uno de los ${c / 2} orbitales; luego se aparean.`, `Desapareados = ${tx(rengR)}.`],
    pistas: ['Cuenta los orbitales.', 'Pon un electrón en cada uno.', 'Aparea los que sobren.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s23-p3', titulo: 'Magnetismo de un ion', unidad: '',
    objetivo: 'Estimar el momento magnético de un ion de transición a partir de sus electrones desapareados.', seccion: '6.4', para: 'la regla de Hund',
    idealizado: 'Ion libre de alto espín; fórmula de solo espín.', metodo: 'ocupación de la tabla de la app para el átomo neutro', lista: RENG_IONES_TRANSICION_AT,
    respuesta: ([s, q]) => { const d = rengDIonAt(s, q); const n = Math.min(d, 10 - d); return Math.sqrt(n * (n + 2)) },
    errores: ([s, q]) => { const d = rengDIonAt(s, q); const n = Math.min(d, 10 - d); return [
      ['sin-raiz', 'Sin la raíz', n * (n + 2), 'Falta la raíz cuadrada: μ = √(n(n + 2)).'],
      ['n', 'Los desapareados', n, 'Ese es el número de electrones desapareados; aplica μ = √(n(n + 2)).']
    ] },
    enunciado: ([s, q]) => `El ion ${rengIonAt(s, q)} (Z = ${rengZAt(s)}) pierde primero los electrones 4s. Su momento magnético de solo espín es μ = √(n(n + 2)), con n los electrones desapareados.`,
    pregunta: '¿Cuánto vale μ, en magnetones de Bohr?',
    datos: ([s, q]) => [['Ion', `${rengIonAt(s, q)}, Z = ${rengZAt(s)}`], ['Fórmula', 'μ = √(n(n + 2))']],
    pasos: ([s, q], _x, _y, rengR) => { const d = rengDIonAt(s, q); return [`Configuración: [Ar] 3d${d}; desapareados n = ${Math.min(d, 10 - d)}.`, `μ = ${tx(rengR)} magnetones de Bohr.`] },
    pistas: ['Quita primero los electrones 4s.', 'Reparte los 3d con Hund.', 'Aplica la fórmula de solo espín.']
  })
]

export const RENG_PRACTICAS_B02_S24: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s24-p1', titulo: 'Electrones de un subnivel', unidad: '', tolerancia: E,
    objetivo: 'Leer en la configuración electrónica cuántos electrones hay en un subnivel concreto.', seccion: '6.4', para: 'la configuración electrónica',
    idealizado: 'Estado fundamental según Aufbau.', metodo: 'ocupación de la tabla de la app', sinVerificar: [], lista: RENG_SUB_CONFIG_AT,
    respuesta: ([z, s]) => rengEnSubAt(z, s),
    errores: ([z, s]) => [
      ['capacidad', 'Capacidad del subnivel', rengCapacidadAt(s), 'Esa es la capacidad máxima del subnivel; no siempre está lleno.'],
      ['capa', 'Toda la capa', rengEnCapaAt(z, Number(s[0])), 'Contaste toda la capa; se pide solo el subnivel indicado.']
    ],
    enunciado: ([z, s]) => `Escribe la configuración electrónica del ${el(z)} y fíjate en el subnivel ${s}.`,
    pregunta: ([, s]) => `¿Cuántos electrones tiene el subnivel ${s}?`,
    datos: ([z, s]) => [['Z', String(z)], ['Subnivel', s]],
    pasos: ([z, s], _x, _y, rengR) => [`Configuración: ${rengConfigAt(z)}.`, `${s}: ${tx(rengR)} electrones.`],
    pistas: ['Sigue el orden de llenado.', 'Localiza el subnivel pedido.', 'Lee su superíndice.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s24-p2', titulo: 'Electrones tras el gas noble', unidad: '', tolerancia: E,
    objetivo: 'Calcular cuántos electrones se escriben después del gas noble en la configuración abreviada.', seccion: '6.4', para: 'la configuración electrónica',
    idealizado: 'Estado fundamental según Aufbau.', metodo: 'configuración abreviada de la tabla de la app', sinVerificar: [], lista: RENG_ELEMENTOS_AUFBAU_AT,
    respuesta: (z) => z - rengGasAnteriorAt(z),
    errores: (z) => [
      ['z', 'Todos los electrones', z, 'Esos son todos los electrones; en la forma abreviada el gas noble resume los internos.'],
      ['gas', 'Los del gas noble', rengGasAnteriorAt(z), 'Esos son los electrones que resume el gas noble; se piden los que van detrás.']
    ],
    enunciado: (z) => `Escribe la configuración abreviada del ${el(z)} con el gas noble anterior entre corchetes.`,
    pregunta: '¿Cuántos electrones se escriben después del gas noble?',
    datos: (z) => [['Z', String(z)], ['Gases nobles', 'He 2, Ne 10, Ar 18, Kr 36']],
    pasos: (z, _x, _y, rengR) => [`Gas noble anterior: Z = ${rengGasAnteriorAt(z)}.`, `Electrones tras el corchete: ${tx(rengR)}.`],
    pistas: ['Busca el gas noble anterior.', 'Resta sus electrones.', 'Comprueba con los superíndices.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s24-p3', titulo: 'Electrones 3d de un catión', unidad: '', tolerancia: E,
    objetivo: 'Escribir la configuración de un catión de transición quitando primero los electrones 4s.', seccion: '6.4', para: 'la configuración electrónica',
    idealizado: 'Cationes de transición aislados.', metodo: 'ocupación de la tabla de la app para el átomo neutro', sinVerificar: [], lista: RENG_IONES_TRANSICION_AT,
    respuesta: ([s, q]) => rengDIonAt(s, q),
    errores: ([s, q]) => [
      ['quitar-3d', 'Quitando primero los 3d', rengZAt(s) - 20 - q, 'Quitaste primero los electrones 3d; los 4s son los más externos y se pierden antes.'],
      ['sumar', 'Sumando la carga', rengZAt(s) - 18 + q, 'Un catión pierde electrones: resta la carga, no la sumes.']
    ],
    enunciado: ([s, q]) => `Escribe la configuración del ion ${rengIonAt(s, q)} (Z = ${rengZAt(s)}).`,
    pregunta: '¿Cuántos electrones 3d tiene?',
    datos: ([s, q]) => [['Z', String(rengZAt(s))], ['Carga', qTx(q)]],
    pasos: ([s, q], _x, _y, rengR) => [`${s}: [Ar] 4s 3d con ${rengZAt(s) - 18} electrones tras el argón; se quitan ${q}, primero los 4s.`, `${rengIonAt(s, q)}: [Ar] 3d con ${tx(rengR)} electrones.`],
    pistas: ['Escribe el átomo neutro.', 'Quita primero los electrones 4s.', 'Cuenta los 3d que quedan.']
  })
]

export const RENG_PRACTICAS_B02_S25: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s25-p1', titulo: 'Electrones de valencia de un elemento', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones de la capa más externa de un elemento representativo.', seccion: '6.4', para: 'los electrones de valencia',
    idealizado: 'Elementos representativos en el estado fundamental.', metodo: 'escena «atomo» (lectura de valencia)', sinVerificar: [], lista: RENG_REPRESENTATIVOS_AT,
    respuesta: (z) => rengValenciaAt(z),
    errores: (z) => [
      ['total', 'Todos los electrones', z, 'Esos son todos los electrones; solo cuentan los de la capa más externa.'],
      ['faltan', 'Los que faltan', 8 - rengValenciaAt(z), 'Esos son los electrones que le faltan para el octeto, no los que tiene.']
    ],
    enunciado: (z) => `Escribe la configuración del ${el(z)}.`,
    pregunta: '¿Cuántos electrones de valencia tiene?',
    datos: (z) => [['Z', String(z)], ['Capa externa', 'la de mayor n']],
    pasos: (z, _x, _y, rengR) => [`Configuración: ${rengConfigAt(z)}.`, `Capa n = ${rengCapaMaxAt(z)}: ${tx(rengR)} electrones de valencia.`],
    pistas: ['Escribe la configuración.', 'Busca la capa de mayor n.', 'Suma sus electrones s y p.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s25-p2', titulo: 'Ion de un elemento representativo', unidad: '', tolerancia: E,
    objetivo: 'Predecir la carga del ion de un elemento a partir de sus electrones de valencia y la regla del octeto.', seccion: '6.4', para: 'los electrones de valencia',
    idealizado: 'Regla del octeto (dueto para Li y Be).', metodo: 'escena «atomo» (valencia del ion)', sinVerificar: [], lista: RENG_IONES_GAS_AT,
    respuesta: ([, q]) => q,
    errores: ([s, q]) => { const v = rengValenciaAt(rengZAt(s)); return [
      ['signo', 'Signo al revés', -q, 'Signo al revés: perder electrones da carga positiva y ganarlos, negativa.'],
      ['al-reves', 'Octeto por el camino largo', q > 0 ? -(8 - v) : v, 'Ese camino exige mover demasiados electrones; el átomo elige el más corto hacia el octeto.']
    ] },
    enunciado: ([s]) => `El ${rengNombreAt(s)} (periodo ${rengCapaMaxAt(rengZAt(s))}) tiene ${rengValenciaAt(rengZAt(s))} electrones de valencia.`,
    pregunta: '¿Qué carga tiene su ion más habitual (con signo)?',
    datos: ([s]) => [['Electrones de valencia', String(rengValenciaAt(rengZAt(s)))], ['Regla', 'octeto (8) o dueto (2) en la capa externa']],
    pasos: ([s], _x, _y, rengR) => { const v = rengValenciaAt(rengZAt(s)); return [v <= 3 ? `Le resulta más fácil perder ${v} electrones.` : `Le resulta más fácil ganar ${8 - v} electrones.`, `Carga: ${qTx(rengR)}.`] },
    pistas: ['Cuenta los electrones de valencia.', 'Elige el camino más corto al octeto.', 'Perder da carga positiva.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s25-p3', titulo: 'Electrones de valencia de una molécula', unidad: '', tolerancia: E,
    objetivo: 'Sumar los electrones de valencia de todos los átomos de una molécula, paso previo a su estructura de Lewis.', seccion: '6.4', para: 'los electrones de valencia',
    idealizado: 'Moléculas neutras de elementos representativos.', metodo: 'analizador de fórmulas del núcleo y escena «atomo»', sinVerificar: [], lista: RENG_MOLECULAS_VALENCIA_AT,
    respuesta: (f) => valMol(f, rengValenciaAt),
    errores: (f) => [
      ['total', 'Todos los electrones', valMol(f, (z) => z), 'Sumaste todos los electrones de los átomos; solo cuentan los de valencia.'],
      ['sin-subindice', 'Sin los subíndices', valMol(f, rengValenciaAt, false), 'Contaste cada elemento una sola vez; multiplica por los subíndices de la fórmula.']
    ],
    enunciado: (f) => `Para dibujar la estructura de Lewis del ${rengTxtNo(f)} hay que contar sus electrones de valencia.`,
    pregunta: '¿Cuántos electrones de valencia tiene en total la molécula?',
    datos: (f) => [['Fórmula', rengTxtNo(f)], ['Valencias', [...rengAtomosNo(f).keys()].map((s) => `${s} ${rengValenciaAt(rengZAt(s))}`).join('; ')]],
    pasos: (f, _x, _y, rengR) => [[...rengAtomosNo(f).entries()].map(([s, n]) => `${n}·${rengValenciaAt(rengZAt(s))}`).join(' + ') + '.', `Total = ${tx(rengR)} electrones de valencia.`],
    pistas: ['Busca la valencia de cada elemento.', 'Multiplica por los subíndices.', 'Suma todas las contribuciones.']
  })
]
