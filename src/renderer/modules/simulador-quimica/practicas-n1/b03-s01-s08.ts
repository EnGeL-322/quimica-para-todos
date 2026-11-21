import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_ELEMENTOS } from '../../tabla-periodica/data'
import {
  RENG_BLOQUE_P_TP, RENG_LONGITUD_PERIODO_TP, RENG_REPRESENTATIVOS_TP, RENG_TOL_TP_ENT, RENG_TRIADAS_TP, RENG_VM_TP, rengAnioTp, rengATp, rengEiTp, rengGasPeriodoTp, rengGasPrevioTp, rengGrupoTp, rengNombreTp,
  rengPeriodoTp, rengPracticaTp, rengValenciaTp, rengVecinoGrupoTp, rengZTp
} from './b03-comun'
import { rengSupAt } from './b02-comun'
import { rengDeNo, rengMNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const M = rengMNo
const A = rengATp
const E = RENG_TOL_TP_ENT
const UNO: readonly number[] = [0]
const sim = (rengZ: number): string => RENG_ELEMENTOS[rengZ - 1]!.simbolo
export const RENG_POSTERIORES_TP: readonly string[] = ['Ga', 'Sc', 'Ge', 'Ar', 'Ne', 'Kr', 'Xe', 'Po', 'Ra', 'Rn', 'Lu', 'Hf', 'Re', 'Tc', 'Fr', 'At', 'Np', 'Pu']
export const RENG_INTERIORES_TP: readonly string[] = ['Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ca', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Sr', 'In', 'Sn', 'Sb']
export const rengVecinosTp = (rengS: string): readonly string[] => [rengVecinoGrupoTp(rengS, -1), rengVecinoGrupoTp(rengS, 1), sim(rengZTp(rengS) - 1), sim(rengZTp(rengS) + 1)]
const sumaVecinos = (rengS: string): number => rengVecinosTp(rengS).reduce((rengX, rengV) => rengX + A(rengV), 0)
export const RENG_HASTA_P4_TP: readonly string[] = RENG_REPRESENTATIVOS_TP.filter((rengS) => rengPeriodoTp(rengS) <= 4)
export const RENG_SIN_GASES_TP: readonly string[] = RENG_REPRESENTATIVOS_TP.filter((rengS) => rengGrupoTp(rengS) !== 18)
export const RENG_P_DESDE_3_TP: readonly string[] = RENG_BLOQUE_P_TP.filter((rengS) => rengPeriodoTp(rengS) >= 3)
const salto = (rengS: string): number => rengZTp(rengVecinoGrupoTp(rengS, 1)) - rengZTp(rengS)
const config = (rengS: string): string => { const n = rengPeriodoTp(rengS); return `[${sim(rengGasPrevioTp(rengZTp(rengS)))}] ${n}s²${n >= 4 ? ` ${n - 1}d¹⁰` : ''} ${n}p${rengSupAt(rengValenciaTp(rengS) - 2)}` }
const sumaPeriodos = (rengA: number, rengB: number): number => RENG_LONGITUD_PERIODO_TP.slice(rengA - 1, rengB).reduce((rengX, rengY) => rengX + rengY, 0)
const CAP: Readonly<Record<string, number>> = { s: 2, p: 6, d: 10, f: 14 }
const INICIO: Readonly<Record<string, number>> = { s: 1, p: 2, d: 4, f: 6 }
export const RENG_BLOQUE_PERIODO_TP: ReadonlyArray<readonly [string, number]> = [...[1, 2, 3, 4, 5, 6, 7].map((n) => ['s', n] as const), ...[2, 3, 4, 5, 6, 7].map((n) => ['p', n] as const), ...[4, 5, 6, 7].map((n) => ['d', n] as const), ...[6, 7].map((n) => ['f', n] as const)]
export const RENG_BLOQUE_COLUMNA_TP: ReadonlyArray<readonly [string, number, number]> = [...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => ['d', 4, k] as const), ...[1, 2, 3, 4, 5, 6].map((k) => ['p', 3, k] as const), ...[1, 2, 3, 4, 5, 6].map((k) => ['p', 4, k] as const)]
export const rengZDeColumnaTp = (rengB: string, rengN: number, rengK: number): number => [0, 2, 10, 18, 36, 54, 86][rengN - 1]! + (rengB === 's' ? 0 : rengB === 'd' || rengN <= 3 ? 2 : 12) + rengK
export const RENG_METALES_ION_TP: ReadonlyArray<readonly [string, number]> = [['Na', 1], ['K', 1], ['Mg', 2], ['Ca', 2], ['Al', 3], ['Li', 1], ['Ba', 2], ['Sr', 2], ['Rb', 1], ['Be', 2], ['Ga', 3], ['Zn', 2], ['Ag', 1], ['Cs', 1]]
export const RENG_OXIDOS_METAL_TP: ReadonlyArray<readonly [string, string]> = [['Na', 'Na2O'], ['K', 'K2O'], ['Mg', 'MgO'], ['Ca', 'CaO'], ['Al', 'Al2O3'], ['Li', 'Li2O'], ['Ba', 'BaO'], ['Zn', 'ZnO'], ['Fe', 'Fe2O3'], ['Cu', 'CuO']]
export const RENG_NO_METALES_TP: readonly string[] = ['N', 'O', 'F', 'P', 'S', 'Cl', 'Se', 'Br', 'I', 'C', 'Si', 'As']
export const RENG_OXIDOS_NO_METAL_TP: ReadonlyArray<readonly [string, string]> = [['C', 'CO2'], ['N', 'N2O5'], ['P', 'P2O5'], ['S', 'SO3'], ['Cl', 'Cl2O7'], ['Si', 'SiO2'], ['Se', 'SeO3'], ['As', 'As2O5']]
export const RENG_COMPUESTOS_METALOIDE_TP: ReadonlyArray<readonly [string, string]> = [
  ['Si', 'SiO2'], ['B', 'B2O3'], ['Ge', 'GeO2'], ['As', 'As2O3'], ['Sb', 'Sb2O3'], ['Te', 'TeO2'], ['Si', 'SiC'], ['B', 'H3BO3'], ['Si', 'SiH4'], ['Ge', 'GeCl4'], ['As', 'AsH3'], ['Si', 'SiCl4'], ['B', 'BF3'], ['Sb', 'Sb2S3'], ['B', 'B2H6']
]
export const RENG_ALCALINOS_TP: readonly string[] = ['Li', 'Na', 'K', 'Rb', 'Cs']
export const RENG_ALCALINOS_EI_TP: readonly string[] = ['Li', 'Na', 'K', 'Rb']
const frac = (rengEl: string, rengF: string): number => (rengDeNo(rengF, rengEl) * A(rengEl)) / M(rengF)
const oxido = (rengEl: string, rengF: string, rengX: number): number => (rengX * M(rengF)) / (rengDeNo(rengF, rengEl) * A(rengEl))

export const RENG_PRACTICAS_B03_S01: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s1-p1', titulo: 'Masa central de una tríada', unidad: 'u',
    objetivo: 'Aplicar la regla de las tríadas de Döbereiner para estimar la masa atómica del elemento central.', seccion: '2.5', para: 'la historia de la tabla periódica', masas: true, historia: true,
    idealizado: 'Regla aproximada de las tríadas.', metodo: 'masa del primero más la mitad de la diferencia', lista: RENG_TRIADAS_TP,
    respuesta: ([a, , c]) => (A(a) + A(c)) / 2,
    errores: ([a, , c]) => [
      ['suma', 'Suma sin dividir', A(a) + A(c), 'Sumaste las dos masas pero no dividiste entre dos: la regla usa la media.'],
      ['semidiferencia', 'Mitad de la diferencia', (A(c) - A(a)) / 2, 'Restaste las masas en lugar de sumarlas antes de dividir entre dos.']
    ],
    enunciado: ([a, b, c]) => `El ${rengNombreTp(a)}, el ${rengNombreTp(b)} y el ${rengNombreTp(c)} son elementos consecutivos de un mismo grupo. Las masas atómicas del ${rengNombreTp(a)} y del ${rengNombreTp(c)} son ${tx(A(a), 5)} u y ${tx(A(c), 5)} u.`,
    pregunta: ([, b]) => `Según la regla de las tríadas, ¿qué masa atómica se espera para el ${rengNombreTp(b)}, en u?`,
    datos: ([a, , c]) => [[a, `${tx(A(a), 5)} u`], [c, `${tx(A(c), 5)} u`]],
    pasos: ([a, b, c], _x, _y, rengR) => [`Media: (${tx(A(a), 5)} + ${tx(A(c), 5)})/2.`, `= ${tx(rengR, 4)} u; la masa tabulada del ${rengNombreTp(b)} es ${tx(A(b), 4)} u.`],
    pistas: ['Suma las dos masas extremas.', 'Divide el resultado entre dos.', 'Compara con la masa tabulada.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s1-p2', titulo: 'Elementos descubiertos tras Mendeléiev', unidad: '', tolerancia: E,
    objetivo: 'Situar en el tiempo el descubrimiento de un elemento respecto a la tabla de Mendeléiev de 1869.', seccion: '2.5', para: 'la historia de la tabla periódica', historia: true, wikidata: true,
    idealizado: 'Año de descubrimiento guardado en la app.', metodo: 'resta por otra vía con los datos de la tabla de la app', lista: RENG_POSTERIORES_TP,
    respuesta: (s) => rengAnioTp(s) - 1869,
    errores: (s) => [
      ['anio', 'El año', rengAnioTp(s), 'Ese es el año del descubrimiento; se piden los años transcurridos desde 1869.'],
      ['siglo', 'Desde 1800', rengAnioTp(s) - 1800, 'Restaste 1800; la tabla de Mendeléiev se publicó en 1869.']
    ],
    enunciado: (s) => `Mendeléiev publicó su tabla en 1869. El ${rengNombreTp(s)} (Z = ${rengZTp(s)}) se descubrió en ${rengAnioTp(s)}, según los datos de la tabla de la app.`,
    pregunta: '¿Cuántos años después de la tabla de Mendeléiev se descubrió?',
    datos: (s) => [['Tabla de Mendeléiev', '1869'], ['Descubrimiento', String(rengAnioTp(s))]],
    pasos: (s, _x, _y, rengR) => [`${rengAnioTp(s)} − 1869.`, `= ${tx(rengR)} años: su casilla estaba vacía en la tabla original.`],
    pistas: ['Localiza los dos años.', 'Resta 1869 del descubrimiento.', 'El resultado es positivo.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s1-p3', titulo: 'Predecir una masa con los cuatro vecinos', unidad: 'u',
    objetivo: 'Estimar la masa atómica de un elemento como media de sus cuatro vecinos, como hacía Mendeléiev.', seccion: '2.5', para: 'las predicciones de Mendeléiev', masas: true, historia: true,
    idealizado: 'Media simple de los cuatro vecinos de la tabla.', metodo: 'media de las dos medias (vertical y horizontal)', lista: RENG_INTERIORES_TP,
    respuesta: (s) => sumaVecinos(s) / 4,
    errores: (s) => [
      ['mitad', 'Dividir entre dos', sumaVecinos(s) / 2, 'Dividiste entre dos; hay cuatro vecinos, así que la media se obtiene dividiendo entre cuatro.'],
      ['suma', 'Suma sin dividir', sumaVecinos(s), 'Sumaste las cuatro masas pero no calculaste la media.']
    ],
    enunciado: (s) => { const v = rengVecinosTp(s); return `Los vecinos del ${rengNombreTp(s)} en la tabla son ${v[0]} (arriba, ${tx(A(v[0]!), 5)} u), ${v[1]} (abajo, ${tx(A(v[1]!), 5)} u), ${v[2]} (izquierda, ${tx(A(v[2]!), 5)} u) y ${v[3]} (derecha, ${tx(A(v[3]!), 5)} u).` },
    pregunta: (s) => `¿Qué masa atómica se predice para el ${rengNombreTp(s)} como media de los cuatro, en u?`,
    datos: (s) => rengVecinosTp(s).map((v) => [v, `${tx(A(v), 5)} u`] as const),
    pasos: (s, _x, _y, rengR) => [`Suma de los cuatro vecinos: ${tx(sumaVecinos(s), 5)} u.`, `Media = ${tx(rengR, 4)} u; la masa tabulada es ${tx(A(s), 4)} u.`],
    pistas: ['Suma las cuatro masas.', 'Divide la suma entre cuatro.', 'Compara con la masa tabulada.']
  })
]

export const RENG_PRACTICAS_B03_S02: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s2-p1', titulo: 'Siguiente elemento de la familia', unidad: '', tolerancia: E,
    objetivo: 'Usar la periodicidad para hallar el número atómico del siguiente elemento del mismo grupo.', seccion: '2.5', para: 'la ley periódica',
    idealizado: 'Elementos representativos.', metodo: 'búsqueda en la tabla de la app', lista: RENG_HASTA_P4_TP,
    respuesta: (s) => rengZTp(s) + salto(s),
    errores: (s) => [
      ['otro-salto', 'Otro tamaño de periodo', rengZTp(s) + (salto(s) === 8 ? 18 : 8), 'Ese salto no corresponde: cuenta los subniveles que se llenan hasta volver al mismo grupo (el d aparece desde el periodo 4).'],
      ['mismo-periodo', 'Elemento siguiente', rengZTp(s) + 1, 'Ese es el elemento siguiente del mismo periodo, no el siguiente del mismo grupo.']
    ],
    enunciado: (s) => `El ${rengNombreTp(s)} (Z = ${rengZTp(s)}) está en el periodo ${rengPeriodoTp(s)} y el grupo ${rengGrupoTp(s)}.`,
    pregunta: '¿Qué número atómico tiene el elemento situado justo debajo, en el mismo grupo?',
    datos: (s) => [['Z', String(rengZTp(s))], ['Periodos', '2, 8, 8, 18, 18, 32 y 32 elementos']],
    pasos: (s, _x, _y, rengR) => [`Hasta volver al mismo grupo hay ${salto(s)} elementos.`, `Z = ${rengZTp(s)} + ${salto(s)} = ${tx(rengR)}: ${rengNombreTp(rengVecinoGrupoTp(s, 1))}.`],
    pistas: ['Cuenta los elementos hasta el mismo grupo.', 'Depende de los subniveles que se llenan.', 'Suma ese número a Z.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s2-p2', titulo: 'Hasta completar el periodo', unidad: '', tolerancia: E,
    objetivo: 'Contar los elementos que hay desde uno dado hasta el gas noble que cierra su periodo.', seccion: '2.5', para: 'la ley periódica',
    idealizado: 'Elementos representativos.', metodo: 'recuento en la tabla de la app', lista: RENG_SIN_GASES_TP,
    respuesta: (s) => rengGasPeriodoTp(rengZTp(s)) - rengZTp(s) + 1,
    errores: (s) => [
      ['sin-incluir', 'Sin contar el primero', rengGasPeriodoTp(rengZTp(s)) - rengZTp(s), 'Al restar los números atómicos falta contar uno de los dos extremos.'],
      ['desde-el-inicio', 'Desde el inicio del periodo', rengZTp(s) - rengGasPrevioTp(rengZTp(s)), 'Contaste desde el inicio del periodo hasta el elemento, no desde el elemento hasta el final.']
    ],
    enunciado: (s) => `El ${rengNombreTp(s)} tiene Z = ${rengZTp(s)}. El gas noble que cierra su periodo tiene Z = ${rengGasPeriodoTp(rengZTp(s))}.`,
    pregunta: '¿Cuántos elementos hay desde él hasta ese gas noble, contando ambos?',
    datos: (s) => [['Elemento', `Z = ${rengZTp(s)}`], ['Gas noble', `Z = ${rengGasPeriodoTp(rengZTp(s))}`]],
    pasos: (s, _x, _y, rengR) => [`${rengGasPeriodoTp(rengZTp(s))} − ${rengZTp(s)} + 1.`, `= ${tx(rengR)} elementos.`],
    pistas: ['Resta los dos números atómicos.', 'Suma uno para incluir ambos.', 'El periodo acaba en un gas noble.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s2-p3', titulo: 'Número atómico desde la posición', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número atómico de un elemento del bloque p a partir de su periodo y su grupo.', seccion: '6.4', para: 'la tabla periódica y la configuración electrónica',
    idealizado: 'Orden de llenado ideal.', metodo: 'búsqueda en la tabla de la app', lista: RENG_P_DESDE_3_TP,
    respuesta: (s) => rengZTp(s),
    errores: (s) => [
      ['bloque-d', 'Diez electrones d de más o de menos', rengZTp(s) + (rengPeriodoTp(s) <= 3 ? 10 : -10), 'Revisa si en ese periodo se llena un subnivel d antes del p: solo ocurre a partir del periodo 4.'],
      ['arriba', 'Elemento del periodo anterior', rengZTp(rengVecinoGrupoTp(s, -1)), 'Ese es el elemento del mismo grupo en el periodo anterior.']
    ],
    enunciado: (s) => `Un elemento está en el periodo ${rengPeriodoTp(s)} y el grupo ${rengGrupoTp(s)}. El gas noble anterior tiene Z = ${rengGasPrevioTp(rengZTp(s))}.`,
    pregunta: '¿Cuál es su número atómico?',
    datos: (s) => [['Posición', `periodo ${rengPeriodoTp(s)}, grupo ${rengGrupoTp(s)}`], ['Gas noble anterior', `Z = ${rengGasPrevioTp(rengZTp(s))}`]],
    pasos: (s, _x, _y, rengR) => [`Configuración: ${config(s)}.`, `Z = ${tx(rengR)}: es el ${rengNombreTp(s)}.`],
    pistas: ['Parte del gas noble anterior.', 'Añade los electrones s, d y p.', 'El d solo cuenta desde el periodo 4.']
  })
]

export const RENG_PRACTICAS_B03_S03: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s3-p1', titulo: 'Grupo desde la configuración', unidad: '', tolerancia: E,
    objetivo: 'Deducir el grupo de un elemento del bloque p a partir de su configuración electrónica.', seccion: '6.4', para: 'los grupos y la configuración de valencia',
    idealizado: 'Configuraciones del estado fundamental.', metodo: 'posición en la tabla de la app', lista: RENG_BLOQUE_P_TP,
    respuesta: (s) => rengGrupoTp(s),
    errores: (s) => [
      ['valencia', 'Los electrones de valencia', rengValenciaTp(s), 'Esos son los electrones de valencia; en el bloque p el grupo es ese número más diez.'],
      ['periodo', 'El periodo', rengPeriodoTp(s), 'Ese es el periodo (la capa más externa), no el grupo.']
    ],
    enunciado: (s) => `Un elemento tiene la configuración ${config(s)}.`,
    pregunta: '¿En qué grupo de la tabla periódica está?',
    datos: (s) => [['Configuración', config(s)], ['Regla', 'bloque p: grupo = 10 + electrones de valencia']],
    pasos: (s, _x, _y, rengR) => [`Electrones de valencia (s y p externos): ${rengValenciaTp(s)}.`, `Grupo = 10 + ${rengValenciaTp(s)} = ${tx(rengR)}: es el ${rengNombreTp(s)}.`],
    pistas: ['Cuenta los electrones s y p externos.', 'En el bloque p suma diez.', 'No confundas grupo y periodo.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s3-p2', titulo: 'Electrones de valencia desde el grupo', unidad: '', tolerancia: E,
    objetivo: 'Obtener los electrones de valencia de un elemento del bloque p a partir de su grupo.', seccion: '2.5', para: 'los grupos y los periodos',
    idealizado: 'Elementos representativos.', metodo: 'escena «tendencias-periodicas»', lista: RENG_BLOQUE_P_TP,
    respuesta: (s) => rengValenciaTp(s),
    errores: (s) => [
      ['grupo', 'El número de grupo', rengGrupoTp(s), 'En los grupos 13 a 18 hay que restar diez al número de grupo.'],
      ['faltan', 'Los que faltan', 18 - rengGrupoTp(s), 'Esos son los electrones que le faltan para el octeto, no los que tiene.']
    ],
    enunciado: (s) => `El ${rengNombreTp(s)} está en el grupo ${rengGrupoTp(s)} y el periodo ${rengPeriodoTp(s)} de la tabla periódica.`,
    pregunta: '¿Cuántos electrones de valencia tiene?',
    datos: (s) => [['Grupo', String(rengGrupoTp(s))], ['Periodo', String(rengPeriodoTp(s))]],
    pasos: (s, _x, _y, rengR) => [`Grupo ${rengGrupoTp(s)} − 10.`, `= ${tx(rengR)} electrones de valencia en la capa ${rengPeriodoTp(s)}.`],
    pistas: ['Mira el número de grupo.', 'Resta diez en el bloque p.', 'El periodo indica la capa.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s3-p3', titulo: 'Elementos de varios periodos', unidad: '', tolerancia: E,
    objetivo: 'Sumar los elementos de varios periodos consecutivos conociendo la longitud de cada uno.', seccion: '2.5', para: 'los periodos',
    idealizado: 'Tabla de siete periodos completos.', metodo: 'recuento en la tabla de la app', lista: UNO, x: [1, 5, 1], y: [3, 7, 1], valida: (_e, x, y) => y - x >= 2,
    respuesta: (_e, x, y) => sumaPeriodos(x, y),
    errores: (_e, x, y) => [
      ['solo-ultimo', 'Solo el último periodo', RENG_LONGITUD_PERIODO_TP[y - 1]!, 'Contaste solo el último periodo; hay que sumar todos los del intervalo.'],
      ['sin-primero', 'Sin el primer periodo', sumaPeriodos(x + 1, y), 'Olvidaste el primer periodo del intervalo: se incluyen los dos extremos.']
    ],
    enunciado: (_e, x, y) => `Los periodos de la tabla tienen 2, 8, 8, 18, 18, 32 y 32 elementos. Considera los periodos del ${x} al ${y}, ambos incluidos.`,
    pregunta: '¿Cuántos elementos hay en total en esos periodos?',
    datos: (_e, x, y) => [['Periodos', `del ${x} al ${y}`], ['Longitudes', '2, 8, 8, 18, 18, 32, 32']],
    pasos: (_e, x, y, rengR) => [`Se suman las longitudes de los periodos ${x} a ${y}.`, `Total = ${tx(rengR)} elementos.`],
    pistas: ['Localiza cada periodo en la lista.', 'Incluye los dos extremos.', 'Suma todas las longitudes.']
  })
]

export const RENG_PRACTICAS_B03_S04: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s4-p1', titulo: 'Elementos de un bloque en un periodo', unidad: '', tolerancia: E,
    objetivo: 'Relacionar la anchura de cada bloque con la capacidad del subnivel que se llena.', seccion: '6.4', para: 'los bloques de la tabla periódica',
    idealizado: 'Orden de llenado ideal.', metodo: 'recuento de m_l con dos espines', lista: RENG_BLOQUE_PERIODO_TP,
    respuesta: ([b]) => CAP[b]!,
    errores: ([b, n]) => [
      ['orbitales', 'Los orbitales', CAP[b]! / 2, 'Ese es el número de orbitales; cada orbital aloja dos electrones y da dos elementos.'],
      ['periodo-completo', 'Todo el periodo', RENG_LONGITUD_PERIODO_TP[n - 1]!, 'Contaste todos los elementos del periodo; se piden solo los de ese bloque.']
    ],
    enunciado: ([b, n]) => `En el periodo ${n} de la tabla periódica hay elementos del bloque ${b}.`,
    pregunta: ([b, n]) => `¿Cuántos elementos del bloque ${b} tiene el periodo ${n}?`,
    datos: ([b, n]) => [['Bloque', b], ['Periodo', String(n)]],
    pasos: ([b], _x, _y, rengR) => [`Un subnivel ${b} tiene ${CAP[b]! / 2} orbitales.`, `Elementos = 2 × ${CAP[b]! / 2} = ${tx(rengR)}.`],
    pistas: ['Pasa la letra del bloque a l.', 'Calcula 2(2l + 1).', 'Cada electrón es un elemento.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s4-p2', titulo: 'Número atómico desde el bloque', unidad: '', tolerancia: E,
    objetivo: 'Hallar el número atómico de un elemento conociendo su bloque, su periodo y su columna dentro del bloque.', seccion: '6.4', para: 'los bloques de la tabla periódica',
    idealizado: 'Orden de llenado ideal.', metodo: 'posición en la tabla de la app', lista: RENG_BLOQUE_COLUMNA_TP,
    respuesta: ([b, n, k]) => rengZDeColumnaTp(b, n, k),
    errores: ([b, n, k]) => [
      ['sin-s', 'Sin los electrones s', rengZDeColumnaTp(b, n, k) - 2, 'Olvidaste los dos electrones del subnivel s, que se llena antes.'],
      ['columna', 'La columna', k, 'Esa es la posición dentro del bloque; hay que sumar los electrones anteriores.']
    ],
    enunciado: ([b, n, k]) => `Un elemento ocupa la columna ${k} del bloque ${b} en el periodo ${n}. El gas noble anterior tiene Z = ${[0, 2, 10, 18, 36, 54, 86][n - 1]}.`,
    pregunta: '¿Cuál es su número atómico?',
    datos: ([b, n, k]) => [['Posición', `bloque ${b}, periodo ${n}, columna ${k}`], ['Gas noble anterior', `Z = ${[0, 2, 10, 18, 36, 54, 86][n - 1]}`]],
    pasos: ([b, n, k], _x, _y, rengR) => [`Tras el gas noble: 2 electrones s${b === 'p' && n >= 4 ? ', 10 electrones d' : ''} y ${k} electrones ${b}.`, `Z = ${tx(rengR)}: ${RENG_ELEMENTOS[rengZDeColumnaTp(b, n, k) - 1]!.nombre.toLowerCase()}.`],
    pistas: ['Parte del gas noble anterior.', 'Suma los subniveles ya llenos.', 'Añade la columna del bloque.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s4-p3', titulo: 'Elementos de un bloque hasta un periodo', unidad: '', tolerancia: E,
    objetivo: 'Contar los elementos de un bloque acumulados hasta un periodo, sabiendo en qué periodo empieza cada bloque.', seccion: '6.4', para: 'los bloques de la tabla periódica',
    idealizado: 'Tabla con periodos completos.', metodo: 'recuento periodo a periodo', lista: RENG_BLOQUE_PERIODO_TP,
    respuesta: ([b, n]) => CAP[b]! * (n - INICIO[b]! + 1),
    errores: ([b], _x, _y, rengR) => [
      ['un-periodo', 'Un solo periodo', CAP[b]!, 'Contaste los elementos de un solo periodo; hay que sumar todos los periodos en los que aparece el bloque.'],
      ['uno-de-mas', 'Un periodo de más', rengR + CAP[b]!, 'Contaste un periodo de más: el bloque no aparece antes de su primer periodo.']
    ],
    enunciado: ([b, n]) => `El bloque ${b} aparece por primera vez en el periodo ${INICIO[b]}. Considera la tabla hasta el periodo ${n}, incluido.`,
    pregunta: ([b]) => `¿Cuántos elementos del bloque ${b} hay en total?`,
    datos: ([b, n]) => [['Bloque', `${b}, desde el periodo ${INICIO[b]}`], ['Hasta', `periodo ${n}`]],
    pasos: ([b, n], _x, _y, rengR) => [`Periodos con bloque ${b}: ${n - INICIO[b]! + 1}; elementos por periodo: ${CAP[b]}.`, `Total = ${tx(rengR)}.`],
    pistas: ['Cuenta los periodos con ese bloque.', 'Multiplica por su anchura.', 'El bloque d empieza en el periodo 4.']
  })
]

export const RENG_PRACTICAS_B03_S05: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s5-p1', titulo: 'Electrones que cede un metal', unidad: '',
    objetivo: 'Calcular los electrones que ceden los átomos de un metal al formar su ion habitual.', seccion: '18.1', para: 'los metales',
    idealizado: 'Todos los átomos forman el ion habitual.', metodo: 'escena «atomo» (diferencia de electrones)', lista: RENG_METALES_ION_TP, x: [1, 9, 0.5],
    respuesta: ([, q], x) => x * q,
    errores: ([, q], x) => [
      ['sin-carga', 'Un electrón por átomo', x, 'Cada átomo cede tantos electrones como indica la carga de su ion.'],
      ['octeto', 'Los que le faltarían', x * (8 - q), 'Los metales pierden sus electrones de valencia; no ganan los que faltan para el octeto.']
    ],
    enunciado: ([s, q], x) => `Una muestra contiene ${tx(x)}·10²² átomos de ${rengNombreTp(s)}, que forman iones ${s}${q > 1 ? rengSupAt(q) : ''}⁺.`,
    pregunta: '¿Cuántos electrones ceden en total, en múltiplos de 10²²?',
    datos: ([s, q], x) => [['Átomos', `${tx(x)}·10²² de ${s}`], ['Carga del ion', `+${q}`]],
    pasos: ([, q], x, _y, rengR) => [`Cada átomo cede ${q} electrones.`, `Total = ${tx(x)} × ${q} = ${tx(rengR)}·10²² electrones.`],
    pistas: ['Mira la carga del ion.', 'Es el número de electrones cedidos.', 'Multiplica por los átomos.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s5-p2', titulo: 'Óxido de un metal', unidad: 'g',
    objetivo: 'Calcular la masa de óxido básico que forma una masa dada de metal.', seccion: '18.1', para: 'los metales', masas: true,
    idealizado: 'Oxidación completa del metal.', metodo: 'masas molares del núcleo', lista: RENG_OXIDOS_METAL_TP, x: [1, 100, 0.5],
    respuesta: ([s, f], x) => oxido(s, f, x),
    errores: ([s, f], x) => [
      ['solo-oxigeno', 'Solo el oxígeno', oxido(s, f, x) - x, 'Esa es la masa de oxígeno que se incorpora; el óxido incluye también el metal.'],
      ['inversa', 'Proporción invertida', (x * rengDeNo(f, s) * A(s)) / M(f), 'Invertiste la proporción: el óxido pesa más que el metal de partida.']
    ],
    enunciado: ([s, f], x) => `Se oxidan por completo ${tx(x)} g de ${rengNombreTp(s)} y se obtiene ${T(f)}.`,
    pregunta: '¿Qué masa de óxido se forma, en g?',
    datos: ([s, f], x) => [['Metal', `${tx(x)} g de ${s}`], ['Óxido', `${T(f)}, ${tx(M(f), 5)} g/mol`], [`A(${s})`, `${tx(A(s), 5)} g/mol`]],
    pasos: ([s, f], x, _y, rengR) => [`n(${s}) = ${tx(x)}/${tx(A(s), 5)}; cada mol de óxido contiene ${rengDeNo(f, s)} mol de ${s}.`, `m(${T(f)}) = ${tx(rengR)} g.`],
    pistas: ['Pasa el metal a moles.', 'Usa los subíndices del óxido.', 'Multiplica por su masa molar.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s5-p3', titulo: 'Moles de electrones de un metal', unidad: 'mol',
    objetivo: 'Calcular los moles de electrones que cede una masa de metal al formar su ion.', seccion: '18.1', para: 'los metales', masas: true,
    idealizado: 'Todos los átomos forman el ion habitual.', metodo: 'masa molar del núcleo', lista: RENG_METALES_ION_TP, x: [10, 200, 5],
    respuesta: ([s, q], x) => (x * q) / A(s),
    errores: ([s, q], x) => [
      ['sin-carga', 'Sin la carga', x / A(s), 'Esos son los moles de metal; cada átomo cede varios electrones.'],
      ['dividir', 'Dividir entre la carga', x / (A(s) * q), 'Dividiste entre la carga; hay que multiplicar los moles de metal por ella.']
    ],
    enunciado: ([s, q], x) => `Se oxidan ${tx(x)} g de ${rengNombreTp(s)} a iones ${s}${q > 1 ? rengSupAt(q) : ''}⁺.`,
    pregunta: '¿Cuántos moles de electrones cede el metal?',
    datos: ([s, q], x) => [['Masa', `${tx(x)} g`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], ['Carga del ion', `+${q}`]],
    pasos: ([s, q], x, _y, rengR) => [`n(${s}) = ${tx(x / A(s))} mol.`, `n(e⁻) = ${q} × n = ${tx(rengR)} mol.`],
    pistas: ['Pasa el metal a moles.', 'Mira la carga del ion.', 'Multiplica moles por carga.']
  })
]

export const RENG_PRACTICAS_B03_S06: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s6-p1', titulo: 'Electrones que gana un no metal', unidad: '',
    objetivo: 'Calcular los electrones que ganan los átomos de un no metal para completar su octeto.', seccion: '18.1', para: 'los no metales',
    idealizado: 'Regla del octeto.', metodo: 'diferencia con el gas noble siguiente', lista: RENG_NO_METALES_TP, x: [1, 9, 0.5],
    respuesta: (s, x) => x * (8 - rengValenciaTp(s)),
    errores: (s, x) => [
      ['valencia', 'Los de valencia', x * rengValenciaTp(s), 'Esos son los electrones que ya tiene; gana los que le faltan hasta ocho.'],
      ['uno', 'Uno por átomo', x, 'Cada átomo gana tantos electrones como le faltan para el octeto.']
    ],
    enunciado: (s, x) => `Una muestra contiene ${tx(x)}·10²² átomos de ${rengNombreTp(s)} (grupo ${rengGrupoTp(s)}), que completan su octeto ganando electrones.`,
    pregunta: '¿Cuántos electrones ganan en total, en múltiplos de 10²²?',
    datos: (s, x) => [['Átomos', `${tx(x)}·10²² de ${s}`], ['Electrones de valencia', String(rengValenciaTp(s))]],
    pasos: (s, x, _y, rengR) => [`A cada átomo le faltan 8 − ${rengValenciaTp(s)} = ${8 - rengValenciaTp(s)} electrones.`, `Total = ${tx(rengR)}·10²² electrones.`],
    pistas: ['Halla los electrones de valencia.', 'Resta ese número de ocho.', 'Multiplica por los átomos.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s6-p2', titulo: 'Hidrógeno en un hidruro', unidad: 'g',
    objetivo: 'Calcular el hidrógeno que se combina con un no metal usando su valencia frente al hidrógeno.', seccion: '18.1', para: 'los no metales', masas: true,
    idealizado: 'Hidruro de fórmula XHₙ con n = 8 − electrones de valencia.', metodo: 'masa molar del núcleo', lista: RENG_NO_METALES_TP, x: [5, 100, 0.5],
    respuesta: (s, x) => (x * (8 - rengValenciaTp(s)) * A('H')) / A(s),
    errores: (s, x) => [
      ['un-h', 'Un solo hidrógeno', (x * A('H')) / A(s), 'Cada átomo se une a tantos hidrógenos como electrones le faltan para el octeto.'],
      ['valencia', 'Con los electrones de valencia', (x * rengValenciaTp(s) * A('H')) / A(s), 'Usaste los electrones de valencia; los hidrógenos son los que faltan hasta ocho.']
    ],
    enunciado: (s, x) => `El ${rengNombreTp(s)} (grupo ${rengGrupoTp(s)}) forma con el hidrógeno un compuesto en el que comparte los electrones que le faltan para el octeto. Reaccionan ${tx(x)} g de ${rengNombreTp(s)}.`,
    pregunta: '¿Qué masa de hidrógeno se combina con él, en g?',
    datos: (s, x) => [['Masa', `${tx(x)} g de ${s}`], ['Masas atómicas', `${s} ${tx(A(s), 5)}; H ${tx(A('H'), 4)}`]],
    pasos: (s, x, _y, rengR) => [`Fórmula: ${s}H${8 - rengValenciaTp(s) > 1 ? String(8 - rengValenciaTp(s)).replace(/\d/, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]!) : ''}; n(${s}) = ${tx(x / A(s))} mol.`, `m(H) = ${tx(rengR)} g.`],
    pistas: ['Deduce la fórmula del hidruro.', 'Pasa el no metal a moles.', 'Multiplica por los hidrógenos.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s6-p3', titulo: 'Óxido de un no metal', unidad: 'g',
    objetivo: 'Calcular la masa del óxido ácido que forma un no metal en su estado de oxidación más alto.', seccion: '18.1', para: 'los no metales', masas: true,
    idealizado: 'Oxidación completa hasta el óxido indicado.', metodo: 'masas molares del núcleo', lista: RENG_OXIDOS_NO_METAL_TP, x: [1, 100, 0.5],
    respuesta: ([s, f], x) => oxido(s, f, x),
    errores: ([s, f], x) => [
      ['solo-oxigeno', 'Solo el oxígeno', oxido(s, f, x) - x, 'Esa es la masa de oxígeno incorporada; el óxido incluye también el no metal.'],
      ['inversa', 'Proporción invertida', (x * rengDeNo(f, s) * A(s)) / M(f), 'Invertiste la proporción: el óxido pesa más que el elemento de partida.']
    ],
    enunciado: ([s, f], x) => `Se oxidan ${tx(x)} g de ${rengNombreTp(s)} hasta ${T(f)}, un óxido ácido.`,
    pregunta: '¿Qué masa de óxido se forma, en g?',
    datos: ([s, f], x) => [['Elemento', `${tx(x)} g de ${s}`], ['Óxido', `${T(f)}, ${tx(M(f), 5)} g/mol`], [`A(${s})`, `${tx(A(s), 5)} g/mol`]],
    pasos: ([s, f], x, _y, rengR) => [`n(${s}) = ${tx(x)}/${tx(A(s), 5)}; cada mol de óxido contiene ${rengDeNo(f, s)} mol de ${s}.`, `m(${T(f)}) = ${tx(rengR)} g.`],
    pistas: ['Pasa el elemento a moles.', 'Usa los subíndices del óxido.', 'Multiplica por su masa molar.']
  })
]

export const RENG_PRACTICAS_B03_S07: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s7-p1', titulo: 'Metaloide en un compuesto', unidad: '%',
    objetivo: 'Calcular el porcentaje en masa de un metaloide en uno de sus compuestos.', seccion: '18.1', para: 'los metaloides', masas: true,
    idealizado: 'Compuesto puro.', metodo: 'masa molar del núcleo', lista: RENG_COMPUESTOS_METALOIDE_TP,
    respuesta: ([s, f]) => 100 * frac(s, f),
    errores: ([s, f]) => [
      ['resto', 'El resto', 100 - 100 * frac(s, f), `Ese es el porcentaje de los demás elementos, no el del ${rengNombreTp(s)}.`],
      ['fraccion', 'En tanto por uno', frac(s, f), 'Ese valor es la fracción en masa; multiplícala por cien.']
    ],
    enunciado: ([s, f]) => `El ${rengNombreTp(s)} es un metaloide. Uno de sus compuestos es ${T(f)}.`,
    pregunta: ([s]) => `¿Qué porcentaje en masa de ${rengNombreTp(s)} contiene?`,
    datos: ([s, f]) => [['Fórmula', T(f)], [`A(${s})`, `${tx(A(s), 5)} g/mol`], [`M(${T(f)})`, `${tx(M(f), 5)} g/mol`]],
    pasos: ([s, f], _x, _y, rengR) => [`${s} aporta ${rengDeNo(f, s)} × ${tx(A(s), 5)} de ${tx(M(f), 5)} g/mol.`, `% = ${tx(rengR)} %.`],
    pistas: ['Calcula la masa molar.', 'Halla lo que aporta el metaloide.', 'Divide y multiplica por cien.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s7-p2', titulo: 'Dopado de un semiconductor', unidad: '',
    objetivo: 'Calcular los átomos de dopante necesarios para un cristal de silicio con una proporción dada.', seccion: '18.1', para: 'los metaloides como semiconductores',
    idealizado: 'Dopado uniforme del cristal.', metodo: 'cociente con los números completos', lista: UNO, x: [1, 9, 0.5], y: [1, 50, 1],
    respuesta: (_e, x, y) => x / y,
    errores: (_e, x, y) => [
      ['producto', 'Multiplicando', x * y, 'Multiplicaste; hay un átomo de dopante por cada grupo de átomos de silicio, así que hay que dividir.'],
      ['inverso', 'Cociente invertido', y / x, 'Dividiste al revés: el silicio va en el numerador.']
    ],
    enunciado: (_e, x, y) => `Un cristal de silicio tiene ${tx(x)}·10²² átomos. Se dopa con un átomo de boro por cada ${y} millones de átomos de silicio.`,
    pregunta: '¿Cuántos átomos de boro hacen falta, en múltiplos de 10¹⁶?',
    datos: (_e, x, y) => [['Silicio', `${tx(x)}·10²² átomos`], ['Proporción', `1 por cada ${y}·10⁶`]],
    pasos: (_e, x, y, rengR) => [`N = ${tx(x)}·10²² / (${y}·10⁶).`, `N = ${tx(rengR)}·10¹⁶ átomos de boro.`],
    pistas: ['Divide los átomos entre la proporción.', 'Resta los exponentes de diez.', 'Expresa el resultado en 10¹⁶.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s7-p3', titulo: 'Metaloide obtenido de su compuesto', unidad: 'kg',
    objetivo: 'Calcular la masa de metaloide que se obtiene de un compuesto con un rendimiento dado.', seccion: '18.1', para: 'los metaloides', masas: true,
    idealizado: 'Compuesto puro; el rendimiento resume las pérdidas.', metodo: 'masa molar del núcleo', lista: RENG_COMPUESTOS_METALOIDE_TP, x: [1, 50, 0.5], y: [60, 95, 5],
    respuesta: ([s, f], x, y) => (x * frac(s, f) * y) / 100,
    errores: ([s, f], x, y) => [
      ['sin-rendimiento', 'Sin el rendimiento', x * frac(s, f), 'Esa es la masa teórica; multiplícala por el rendimiento.'],
      ['rendimiento-inverso', 'Rendimiento al revés', (x * frac(s, f) * 100) / y, 'Dividiste entre el rendimiento; se obtiene menos que la masa teórica, no más.']
    ],
    enunciado: ([s, f], x, y) => `De ${tx(x)} kg de ${T(f)} se extrae el ${rengNombreTp(s)} con un rendimiento del ${y} %.`,
    pregunta: ([s]) => `¿Qué masa de ${rengNombreTp(s)} se obtiene, en kg?`,
    datos: ([s, f], x, y) => [['Compuesto', `${tx(x)} kg de ${T(f)}`], ['Fracción en masa', `${tx(100 * frac(s, f), 4)} % de ${s}`], ['Rendimiento', `${y} %`]],
    pasos: ([s, f], x, _y, rengR) => [`Masa teórica: ${tx(x * frac(s, f))} kg de ${s}.`, `Con el rendimiento: ${tx(rengR)} kg.`],
    pistas: ['Calcula la fracción en masa.', 'Halla la masa teórica.', 'Aplica el rendimiento.']
  })
]

export const RENG_PRACTICAS_B03_S08: readonly RengPracticaN1[] = [
  rengPracticaTp({
    id: 'n1-b3-s8-p1', titulo: 'Hidrógeno que desprende un alcalino', unidad: 'L',
    objetivo: 'Calcular el volumen de hidrógeno que desprende un metal alcalino al reaccionar con el agua.', seccion: '18.1', para: 'los metales alcalinos', masas: true,
    idealizado: 'Reacción completa; gas ideal a 0 °C y 1 atm.', metodo: 'ecuación de los gases ideales', sinVerificar: ['El volumen molar normal de 22,414 L/mol es un valor de uso común recordado.'], lista: RENG_ALCALINOS_TP, x: [1, 50, 0.5],
    respuesta: (s, x) => (x / A(s) / 2) * RENG_VM_TP,
    errores: (s, x) => [
      ['sin-mitad', 'Sin la proporción 2 : 1', (x / A(s)) * RENG_VM_TP, 'Dos moles de metal dan un solo mol de H₂: divide los moles de metal entre dos.'],
      ['masa', 'La masa de hidrógeno', (x / A(s) / 2) * 2.016, 'Ese valor es la masa de hidrógeno en gramos; se pide el volumen en litros.']
    ],
    enunciado: (s, x) => `Reaccionan ${tx(x)} g de ${rengNombreTp(s)} con agua en exceso: 2 ${s} + 2 H₂O → 2 ${s}OH + H₂.`,
    pregunta: '¿Qué volumen de hidrógeno se desprende a 0 °C y 1 atm, en L?',
    datos: (s, x) => [['Metal', `${tx(x)} g de ${s}`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], ['Volumen molar', '22,414 L/mol']],
    pasos: (s, x, _y, rengR) => [`n(${s}) = ${tx(x / A(s))} mol; n(H₂) = ${tx(x / A(s) / 2)} mol.`, `V = n × 22,414 = ${tx(rengR)} L.`],
    pistas: ['Pasa el metal a moles.', 'Usa la proporción 2 : 1.', 'Multiplica por el volumen molar.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s8-p2', titulo: 'Hidróxido que forma un alcalino', unidad: 'g',
    objetivo: 'Calcular la masa de hidróxido que se forma cuando un alcalino reacciona con el agua.', seccion: '18.1', para: 'los metales alcalinos', masas: true,
    idealizado: 'Reacción completa con agua en exceso.', metodo: 'masas molares del núcleo', lista: RENG_ALCALINOS_TP, x: [1, 50, 0.5],
    respuesta: (s, x) => (x / A(s)) * M(`${s}OH`),
    errores: (s, x) => [
      ['oxido', 'Como óxido', (x / A(s) / 2) * M(`${s}2O`), 'Calculaste el óxido; con agua se forma el hidróxido, un mol por cada mol de metal.'],
      ['solo-oh', 'Solo el grupo OH', (x / A(s)) * M('OH'), 'Esa es solo la masa del grupo OH; el hidróxido incluye también el metal.']
    ],
    enunciado: (s, x) => `Se dejan caer ${tx(x)} g de ${rengNombreTp(s)} en agua: 2 ${s} + 2 H₂O → 2 ${s}OH + H₂.`,
    pregunta: (s) => `¿Qué masa de ${s}OH se forma, en g?`,
    datos: (s, x) => [['Metal', `${tx(x)} g de ${s}`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], [`M(${s}OH)`, `${tx(M(`${s}OH`), 5)} g/mol`]],
    pasos: (s, x, _y, rengR) => [`n(${s}) = ${tx(x / A(s))} mol = n(${s}OH).`, `m = n × ${tx(M(`${s}OH`), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa el metal a moles.', 'La proporción con el hidróxido es 1 : 1.', 'Multiplica por su masa molar.']
  }),
  rengPracticaTp({
    id: 'n1-b3-s8-p3', titulo: 'Energía para ionizar un alcalino', unidad: 'kJ',
    objetivo: 'Calcular la energía necesaria para ionizar una masa de átomos gaseosos de un alcalino.', seccion: '6.5', para: 'la energía de ionización de los alcalinos', masas: true, tendencias: true,
    idealizado: 'Átomos gaseosos aislados.', metodo: 'escena «tendencias-periodicas»', lista: RENG_ALCALINOS_EI_TP, x: [1, 50, 0.5],
    respuesta: (s, x) => (x / A(s)) * rengEiTp(s),
    errores: (s, x) => [
      ['sin-moles', 'Sin pasar a moles', x * rengEiTp(s), 'La energía de ionización es por mol: pasa antes los gramos a moles.'],
      ['dividir', 'Dividiendo', rengEiTp(s) / (x / A(s)), 'Dividiste la energía entre los moles; hay que multiplicar.']
    ],
    enunciado: (s, x) => `La primera energía de ionización del ${rengNombreTp(s)} es ${rengEiTp(s)} kJ/mol. Se ionizan ${tx(x)} g de átomos gaseosos de ${rengNombreTp(s)}.`,
    pregunta: '¿Qué energía hace falta, en kJ?',
    datos: (s, x) => [['Masa', `${tx(x)} g`], [`A(${s})`, `${tx(A(s), 5)} g/mol`], ['Ei', `${rengEiTp(s)} kJ/mol`]],
    pasos: (s, x, _y, rengR) => [`n = ${tx(x)}/${tx(A(s), 5)} = ${tx(x / A(s))} mol.`, `E = n × Ei = ${tx(rengR)} kJ.`],
    pistas: ['Pasa los gramos a moles.', 'La Ei es energía por mol.', 'Multiplica moles por Ei.']
  })
]
