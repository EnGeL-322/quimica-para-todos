import { rengTx } from '../aprender/n1/gases/constantes'
import { rengAnNo, rengMNo, rengTxtNo } from './b05-comun'
import {
  RENG_ALCANOS_OR, RENG_ALQUENOS_OR, RENG_ENTORNOS_OR, RENG_ESQUELETOS_OR, RENG_FAMILIAS_OR, RENG_HIDROCARBUROS_OR, RENG_INSATURADOS_OR, RENG_MOLECULAS_OR, RENG_SEMI_OR, RENG_TOL_OR_ENT, rengBaseFamiliaOr, rengCOr, rengEnlacesOr,
  rengFormulaFamiliaOr, rengGiOr, rengHFamiliaOr, rengHOr, rengLetrasHOr, rengMCh2Or, rengMCo2Or, rengMFamiliaOr, rengMH2Or, rengNOr, rengPracticaOr, rengSemiTextoOr, rengTotalOr, rengXOr
} from './b12-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const M = rengMNo
const A = rengAnNo
const E = RENG_TOL_OR_ENT
const C = rengCOr
const H = rengHOr
const UNO: readonly number[] = [0]
export const RENG_TIPOS_CADENA_OR: ReadonlyArray<readonly [string, number]> = [['abierta, sin anillos', 0], ['cerrada en un solo anillo', 1]]
const TIPOS_CADENA = RENG_TIPOS_CADENA_OR
export const RENG_NO_GI1_OR = RENG_MOLECULAS_OR.filter(([, rengF]) => rengGiOr(rengF) !== 1)
export const RENG_CON_GI_OR = RENG_MOLECULAS_OR.filter(([, rengF]) => rengGiOr(rengF) >= 1)
const hEsq = (rengC: number, rengD: number, rengT: number, rengR: number): number => 2 * rengC + 2 - 2 * (rengD + rengR) - 4 * rengT
const mAlcano = (rengN: number): number => rengN * A('C') + (2 * rengN + 2) * A('H')

export const RENG_PRACTICAS_B12_S01: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s1-p1', titulo: 'Enlaces de una molécula orgánica', unidad: '', tolerancia: E,
    objetivo: 'Contar los enlaces covalentes de una molécula orgánica a partir de su fórmula y de la valencia de cada átomo.', seccion: '20.1', para: 'los enlaces del carbono', estructuras: true,
    idealizado: 'Valencias habituales: C 4, N 3, O 2, H y halógenos 1.', metodo: 'suma de los órdenes de enlace de la molécula construida con el motor de estructuras de la app', lista: RENG_NO_GI1_OR,
    respuesta: ([, f]) => rengEnlacesOr(f),
    errores: ([, f]) => [
      ['sin-dividir', 'Sin dividir entre dos', 2 * rengEnlacesOr(f), 'Sumaste las valencias, pero cada enlace une dos átomos: divide entre dos.'],
      ['atomos', 'Los átomos', rengTotalOr(f), 'Contaste los átomos de la molécula; se piden los enlaces.']
    ],
    enunciado: ([n, f]) => `En el compuesto ${n}, ${T(f)}, cada carbono forma 4 enlaces; cada nitrógeno, 3; cada oxígeno, 2, y cada hidrógeno o halógeno, 1. Un enlace doble cuenta como dos.`,
    pregunta: '¿Cuántos enlaces covalentes hay en la molécula (contando cada enlace doble como dos y cada triple como tres)?',
    datos: ([, f]) => [['Fórmula', T(f)], ['Suma de valencias', String(2 * rengEnlacesOr(f))]],
    pasos: ([, f], _x, _y, rengR) => [`Suma de valencias: ${2 * rengEnlacesOr(f)}.`, `Cada enlace usa dos valencias: ${2 * rengEnlacesOr(f)}/2 = ${tx(rengR)}.`],
    pistas: ['Multiplica cada átomo por su valencia.', 'Suma todas las valencias.', 'Divide la suma entre dos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s1-p2', titulo: 'Porcentaje de carbono', unidad: '%',
    objetivo: 'Calcular el porcentaje en masa de carbono de un compuesto orgánico.', seccion: '20.1', para: 'la composición de los compuestos del carbono', estructuras: true, masas: true,
    idealizado: 'Compuesto puro.', metodo: 'masas de los átomos de la molécula construida con el motor de estructuras de la app', lista: RENG_MOLECULAS_OR, valida: ([, f]) => C(f) > 1,
    respuesta: ([, f]) => (100 * C(f) * A('C')) / M(f),
    errores: ([, f]) => [
      ['atomos', 'Porcentaje en átomos', (100 * C(f)) / rengTotalOr(f), 'Calculaste el porcentaje de átomos que son carbono; se pide el porcentaje en masa.'],
      ['un-carbono', 'Un solo carbono', (100 * A('C')) / M(f), 'Contaste un solo átomo de carbono: multiplica por el subíndice.']
    ],
    enunciado: ([n, f]) => `El compuesto ${n} tiene fórmula ${T(f)} y masa molar ${tx(M(f), 5)} g/mol. La masa atómica del carbono es ${tx(A('C'), 5)}.`,
    pregunta: '¿Qué porcentaje de su masa es carbono?',
    datos: ([, f]) => [['Carbonos', String(C(f))], ['Masa molar', `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f], _x, _y, rengR) => [`Masa de carbono por mol: ${C(f)} × ${tx(A('C'), 5)} = ${tx(C(f) * A('C'), 5)} g.`, `% C = 100 × ${tx(C(f) * A('C'), 5)}/${tx(M(f), 5)} = ${tx(rengR)} %.`],
    pistas: ['Halla la masa de todos los carbonos.', 'Divídela entre la masa molar.', 'Multiplica el cociente por cien.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s1-p3', titulo: 'Masa de carbono en una muestra', unidad: 'g',
    objetivo: 'Calcular la masa de carbono contenida en una muestra de un compuesto orgánico.', seccion: '20.1', para: 'la composición de los compuestos del carbono', estructuras: true, masas: true,
    idealizado: 'Muestra pura.', metodo: 'moles de compuesto por átomos de carbono de la molécula construida con el motor de estructuras', lista: RENG_MOLECULAS_OR, x: [5, 200, 5], valida: ([, f]) => C(f) > 1,
    respuesta: ([, f], x) => (x * C(f) * A('C')) / M(f),
    errores: ([, f], x) => [
      ['un-carbono', 'Un solo carbono', (x * A('C')) / M(f), 'Contaste un solo átomo de carbono por molécula: multiplica por el subíndice.'],
      ['porcentaje', 'El porcentaje', (100 * C(f) * A('C')) / M(f), 'Ese es el porcentaje de carbono; falta aplicarlo a la masa de la muestra.']
    ],
    enunciado: ([n, f], x) => `Una muestra contiene ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol).`,
    pregunta: '¿Qué masa de carbono contiene, en gramos?',
    datos: ([, f], x) => [['Masa de la muestra', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['Carbonos por molécula', String(C(f))]],
    pasos: ([, f], x, _y, rengR) => [`Fracción de carbono: ${C(f)} × ${tx(A('C'), 5)}/${tx(M(f), 5)} = ${tx((C(f) * A('C')) / M(f))}.`, `m(C) = ${tx(x)} × ${tx((C(f) * A('C')) / M(f))} = ${tx(rengR)} g.`],
    pistas: ['Calcula la fracción en masa de carbono.', 'Usa todos los carbonos de la fórmula.', 'Multiplica por la masa de la muestra.']
  })
]

export const RENG_PRACTICAS_B12_S02: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s2-p1', titulo: 'Hidrógenos de un carbono', unidad: '', tolerancia: E,
    objetivo: 'Deducir con la tetravalencia cuántos hidrógenos lleva un carbono según sus demás enlaces.', seccion: '20.1', para: 'la tetravalencia del carbono', estructuras: true,
    idealizado: 'Carbono neutro con cuatro enlaces.', metodo: 'búsqueda en la escena «carga-formal» de los enlaces que dejan el carbono sin carga', lista: RENG_ENTORNOS_OR,
    respuesta: ([, o]) => 4 - o,
    errores: ([, o]) => [
      ['sin-restar', 'Los cuatro enlaces', 4, 'Cuatro es el total de enlaces del carbono: resta los que ya usa con otros átomos.'],
      ['octeto', 'Restando de ocho', 8 - o, 'Restaste de ocho, que son los electrones del octeto; los enlaces del carbono son cuatro.']
    ],
    enunciado: ([t]) => `En una molécula orgánica, un carbono está unido ${t}. El resto de sus enlaces son con hidrógeno.`,
    pregunta: '¿Cuántos hidrógenos lleva ese carbono?',
    datos: ([, o]) => [['Enlaces del carbono', '4'], ['Ya usados (doble = 2, triple = 3)', String(o)]],
    pasos: ([, o], _x, _y, rengR) => [`Enlaces ya usados: ${o}.`, `H = 4 − ${o} = ${tx(rengR)}.`],
    pistas: ['El carbono forma cuatro enlaces.', 'Un doble cuenta dos y un triple, tres.', 'Resta los enlaces ya usados.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s2-p2', titulo: 'Enlaces entre carbonos de un hidrocarburo', unidad: '', tolerancia: E,
    objetivo: 'Calcular la suma de los órdenes de enlace entre carbonos de un hidrocarburo a partir de su fórmula.', seccion: '20.1', para: 'la tetravalencia del carbono', estructuras: true,
    idealizado: 'Cada carbono forma cuatro enlaces y cada hidrógeno, uno.', metodo: 'suma de los órdenes de los enlaces C–C de la molécula construida con el motor de estructuras', lista: RENG_HIDROCARBUROS_OR, valida: ([, f]) => C(f) > 1,
    respuesta: ([, f]) => (4 * C(f) - H(f)) / 2,
    errores: ([, f]) => [
      ['sin-dividir', 'Sin dividir entre dos', 4 * C(f) - H(f), 'Esas son las valencias que los carbonos usan entre sí; cada enlace C–C ocupa dos.'],
      ['con-h', 'Con los enlaces C–H', (4 * C(f) + H(f)) / 2, 'Contaste también los enlaces con hidrógeno; se piden solo los enlaces entre carbonos.']
    ],
    enunciado: ([n, f]) => `El hidrocarburo ${n} tiene fórmula ${T(f)}. Cada hidrógeno ocupa una de las cuatro valencias de un carbono.`,
    pregunta: '¿Cuánto suman los órdenes de enlace entre carbonos (sencillo 1, doble 2, triple 3)?',
    datos: ([, f]) => [['Valencias de los carbonos', `4 × ${C(f)} = ${4 * C(f)}`], ['Usadas con hidrógeno', String(H(f))]],
    pasos: ([, f], _x, _y, rengR) => [`Valencias libres para enlaces C–C: ${4 * C(f)} − ${H(f)} = ${4 * C(f) - H(f)}.`, `Cada enlace usa dos: ${4 * C(f) - H(f)}/2 = ${tx(rengR)}.`],
    pistas: ['Calcula las valencias de los carbonos.', 'Resta las usadas con hidrógeno.', 'Cada enlace C–C usa dos valencias.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s2-p3', titulo: 'Carbonos de un alcano a partir de sus enlaces', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número de carbonos de un alcano de cadena abierta conociendo su número total de enlaces.', seccion: '20.1', para: 'la tetravalencia del carbono', estructuras: true,
    idealizado: 'Alcano acíclico: n − 1 enlaces C–C y 2n + 2 enlaces C–H.', metodo: 'búsqueda entre los alcanos lineales construidos con el motor de estructuras', lista: UNO, x: [2, 20, 1],
    respuesta: (_e, x) => x,
    errores: (_e, x) => [
      ['sin-restar', 'Sin restar uno', (3 * x + 1) / 3, 'Olvidaste restar uno antes de dividir: los enlaces son 3n + 1.'],
      ['hidrogenos', 'Los hidrógenos', 2 * x + 2, 'Ese es el número de hidrógenos del alcano; se piden los carbonos.']
    ],
    enunciado: (_e, x) => `Un alcano de cadena abierta tiene ${3 * x + 1} enlaces en total (C–C y C–H). Un alcano de n carbonos tiene n − 1 enlaces C–C y 2n + 2 enlaces C–H.`,
    pregunta: '¿Cuántos carbonos tiene?',
    datos: (_e, x) => [['Enlaces totales', String(3 * x + 1)], ['Relación', 'enlaces = 3n + 1']],
    pasos: (_e, x, _y, rengR) => [`(n − 1) + (2n + 2) = 3n + 1 = ${3 * x + 1}.`, `n = (${3 * x + 1} − 1)/3 = ${tx(rengR)}.`],
    pistas: ['Suma enlaces C–C y C–H en función de n.', 'Iguala 3n + 1 al dato.', 'Despeja el número de carbonos.']
  })
]

export const RENG_PRACTICAS_B12_S03: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s3-p1', titulo: 'Enlaces C–C de una cadena', unidad: '', tolerancia: E,
    objetivo: 'Contar los enlaces entre carbonos de una cadena saturada abierta o cerrada.', seccion: '20.1', para: 'las cadenas carbonadas', estructuras: true,
    idealizado: 'Cadena saturada, sin ramificaciones que cierren más anillos.', metodo: 'recuento de los enlaces C–C de la molécula construida con el motor de estructuras', lista: TIPOS_CADENA, x: [3, 14, 1],
    respuesta: ([, r], x) => x - 1 + r,
    errores: ([, r], x) => [
      ['otro-tipo', 'Como el otro tipo de cadena', x - 1 + (1 - r), 'Usaste la cuenta del otro tipo de cadena: una abierta de n carbonos tiene n − 1 enlaces C–C y un anillo, n.'],
      ['hidrogenos', 'Los hidrógenos', 2 * x + 2 - 2 * r, 'Contaste los hidrógenos de la cadena; se piden los enlaces entre carbonos.']
    ],
    enunciado: ([t], x) => `Una cadena saturada de ${x} carbonos es ${t}.`,
    pregunta: '¿Cuántos enlaces C–C tiene?',
    datos: ([t], x) => [['Carbonos', String(x)], ['Tipo de cadena', t]],
    pasos: ([, r], x, _y, rengR) => [`Una cadena abierta de n carbonos tiene n − 1 enlaces C–C${r === 1 ? '; cerrar el anillo añade uno más' : ''}.`, `Enlaces C–C = ${tx(rengR)}.`],
    pistas: ['Dibuja la cadena de carbonos.', 'Cuenta las uniones entre vecinos.', 'Cerrar un anillo añade un enlace.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s3-p2', titulo: 'Hidrógenos de un esqueleto', unidad: '', tolerancia: E,
    objetivo: 'Calcular los hidrógenos de un hidrocarburo a partir de sus carbonos, enlaces múltiples y anillos.', seccion: '20.1', para: 'las cadenas carbonadas', estructuras: true,
    idealizado: 'Todos los carbonos cumplen la tetravalencia.', metodo: 'recuento de hidrógenos de la molécula construida con el motor de estructuras', lista: RENG_ESQUELETOS_OR,
    respuesta: ([, , c, d, t, r]) => hEsq(c, d, t, r),
    errores: ([, , c, d, t, r]) => [
      ['alcano', 'Como un alcano', 2 * c + 2, 'Esa es la fórmula de la cadena abierta saturada: descuenta los enlaces múltiples y los anillos.'],
      ['la-mitad', 'Un hidrógeno por insaturación', 2 * c + 2 - (d + r) - 2 * t, 'Cada enlace doble o anillo quita dos hidrógenos, no uno, y cada triple, cuatro.']
    ],
    enunciado: ([texto]) => `El esqueleto de un hidrocarburo es ${texto}.`,
    pregunta: '¿Cuántos hidrógenos tiene la molécula?',
    datos: ([, , c, d, t, r]) => [['Carbonos', String(c)], ['Dobles, triples y anillos', `${d}, ${t} y ${r}`]],
    pasos: ([, , c, d, t, r], _x, _y, rengR) => [`Cadena abierta saturada: 2 × ${c} + 2 = ${2 * c + 2} hidrógenos.`, `Se restan 2 × ${d + r} + 4 × ${t}: H = ${tx(rengR)}.`],
    pistas: ['Parte de 2n + 2 hidrógenos.', 'Cada doble o anillo quita dos.', 'Cada enlace triple quita cuatro.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s3-p3', titulo: 'Carbonos primarios de un alcano', unidad: '', tolerancia: E,
    objetivo: 'Relacionar los carbonos primarios de un alcano acíclico con sus carbonos terciarios y cuaternarios.', seccion: '20.1', para: 'los tipos de carbono', estructuras: true,
    idealizado: 'Alcano de cadena abierta.', metodo: 'recuento de carbonos unidos a un solo carbono en un alcano construido con el motor de estructuras', lista: UNO, x: [0, 5, 1], y: [1, 3, 1],
    respuesta: (_e, x, y) => 2 + x + 2 * y,
    errores: (_e, x, y) => [
      ['sin-extremos', 'Sin los dos extremos', x + 2 * y, 'Olvidaste los dos extremos que tiene cualquier cadena aunque no esté ramificada.'],
      ['cuaternario-triple', 'Tres ramas por cuaternario', 2 + x + 3 * y, 'Un carbono cuaternario añade dos extremos a la cadena, no tres.']
    ],
    enunciado: (_e, x, y) => `Un alcano de cadena abierta tiene ${x} ${x === 1 ? 'carbono terciario' : 'carbonos terciarios'} y ${y} ${y === 1 ? 'carbono cuaternario' : 'carbonos cuaternarios'}.`,
    pregunta: '¿Cuántos carbonos primarios (grupos CH₃) tiene?',
    datos: (_e, x, y) => [['Terciarios', String(x)], ['Cuaternarios', String(y)], ['Regla', 'primarios = 2 + terciarios + 2 × cuaternarios']],
    pasos: (_e, x, y, rengR) => ['Una cadena sin ramas tiene dos extremos; cada terciario añade uno y cada cuaternario, dos.', `Primarios = 2 + ${x} + 2 × ${y} = ${tx(rengR)}.`],
    pistas: ['Una cadena lineal tiene dos extremos.', 'Un terciario añade una rama.', 'Un cuaternario añade dos ramas.']
  })
]

export const RENG_PRACTICAS_B12_S04: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s4-p1', titulo: 'Hidrógenos de una fórmula semidesarrollada', unidad: '', tolerancia: E,
    objetivo: 'Contar los hidrógenos de una molécula a partir de su fórmula semidesarrollada.', seccion: '20.1', para: 'las fórmulas estructurales', estructuras: true,
    idealizado: 'Fórmula semidesarrollada completa.', metodo: 'lectura de la fórmula semidesarrollada con el analizador del núcleo y recuento sobre la molécula', lista: RENG_SEMI_OR,
    respuesta: ([, f]) => H(f),
    errores: ([t, f]) => [
      ['sin-subindices', 'Sin los subíndices', rengLetrasHOr(t), 'Contaste una H por grupo: multiplica cada una por su subíndice.'],
      ['atomos', 'Todos los átomos', rengTotalOr(f), 'Contaste todos los átomos de la molécula; se piden solo los hidrógenos.']
    ],
    enunciado: ([t]) => `La fórmula semidesarrollada de un compuesto es ${rengSemiTextoOr(t)}.`,
    pregunta: '¿Cuántos átomos de hidrógeno tiene la molécula?',
    datos: ([t]) => [['Fórmula semidesarrollada', rengSemiTextoOr(t)], ['Paréntesis', 'indican una rama o un grupo repetido']],
    pasos: ([, f], _x, _y, rengR) => ['Se suman los hidrógenos de cada grupo, con su subíndice.', `Total: ${tx(rengR)}; la fórmula molecular es ${T(f)}.`],
    pistas: ['Lee la fórmula grupo a grupo.', 'Aplica el subíndice de cada H.', 'No olvides los H de O y de N.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s4-p2', titulo: 'Masa molar desde la fórmula semidesarrollada', unidad: 'g/mol',
    objetivo: 'Obtener la fórmula molecular y la masa molar de un compuesto a partir de su fórmula semidesarrollada.', seccion: '20.1', para: 'las fórmulas estructurales', estructuras: true, masas: true,
    idealizado: 'Fórmula semidesarrollada completa.', metodo: 'lectura de la fórmula semidesarrollada con el analizador del núcleo y masa molar de la molécula', lista: RENG_SEMI_OR,
    respuesta: ([, f]) => M(f),
    errores: ([, f]) => [
      ['sin-h', 'Sin los hidrógenos', M(f) - H(f) * A('H'), 'Olvidaste sumar la masa de los hidrógenos.'],
      ['h-doble', 'Hidrógenos dos veces', M(f) + H(f) * A('H'), 'Contaste los hidrógenos dos veces: revisa el recuento de cada grupo.']
    ],
    enunciado: ([t]) => `La fórmula semidesarrollada de un compuesto es ${rengSemiTextoOr(t)}. Masas atómicas: C ${tx(A('C'), 5)}; H ${tx(A('H'), 4)}; N ${tx(A('N'), 5)}; O ${tx(A('O'), 5)}; Cl ${tx(A('Cl'), 4)}.`,
    pregunta: '¿Cuál es su masa molar, en g/mol?',
    datos: ([t, f]) => [['Fórmula semidesarrollada', rengSemiTextoOr(t)], ['Fórmula molecular', T(f)]],
    pasos: ([, f], _x, _y, rengR) => [`Al contar los átomos se obtiene ${T(f)}.`, `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Cuenta los átomos de cada elemento.', 'Escribe la fórmula molecular.', 'Suma las masas atómicas.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s4-p3', titulo: 'Enlaces σ de una molécula', unidad: '', tolerancia: E,
    objetivo: 'Contar los enlaces σ de una molécula de cadena abierta a partir de su fórmula semidesarrollada.', seccion: '20.1', para: 'las fórmulas estructurales', estructuras: true,
    idealizado: 'Molécula acíclica: cada pareja de átomos unidos comparte un enlace σ.', metodo: 'número de parejas de átomos enlazados en la molécula construida con el motor de estructuras', lista: RENG_SEMI_OR,
    respuesta: ([, f]) => rengTotalOr(f) - 1,
    errores: ([, f]) => [
      ['atomos', 'Los átomos', rengTotalOr(f), 'Ese es el número de átomos: en una cadena abierta hay un enlace σ menos que átomos.'],
      ['solo-cc', 'Solo entre carbonos', C(f) - 1, 'Contaste solo las uniones entre carbonos; los enlaces con hidrógeno y otros átomos también son σ.']
    ],
    enunciado: ([t]) => `La fórmula semidesarrollada de un compuesto de cadena abierta es ${rengSemiTextoOr(t)}. Cada pareja de átomos unidos comparte un enlace σ, sea el enlace sencillo, doble o triple.`,
    pregunta: '¿Cuántos enlaces σ tiene la molécula?',
    datos: ([, f]) => [['Fórmula molecular', T(f)], ['Átomos', String(rengTotalOr(f))]],
    pasos: ([, f], _x, _y, rengR) => [`La molécula tiene ${rengTotalOr(f)} átomos y ningún anillo.`, `σ = ${rengTotalOr(f)} − 1 = ${tx(rengR)}.`],
    pistas: ['Cuenta todos los átomos.', 'Sin anillos: un σ menos que átomos.', 'Un doble tiene un solo σ.']
  })
]

export const RENG_PRACTICAS_B12_S05: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s5-p1', titulo: 'Grado de insaturación', unidad: '',
    objetivo: 'Calcular el grado de insaturación de un compuesto orgánico a partir de su fórmula molecular.', seccion: '20.1', para: 'los grupos funcionales', estructuras: true,
    idealizado: 'Valencias habituales.', metodo: 'enlaces π más anillos de la molécula construida con el motor de estructuras', lista: RENG_CON_GI_OR,
    respuesta: ([, f]) => rengGiOr(f),
    errores: ([, f]) => [
      ['sin-dividir', 'Sin dividir entre dos', 2 * rengGiOr(f), 'Esos son los hidrógenos que faltan; cada grado de insaturación equivale a dos.'],
      ['sin-dos', 'Sin el «+ 2»', rengGiOr(f) - 1, 'Olvidaste los dos hidrógenos de los extremos: la cadena saturada tiene 2C + 2.']
    ],
    enunciado: ([n, f]) => `El compuesto ${n} tiene fórmula molecular ${T(f)}. El grado de insaturación es GI = (2C + 2 + N − H − X)/2; el oxígeno no interviene.`,
    pregunta: '¿Cuál es su grado de insaturación?',
    datos: ([, f]) => [['C', String(C(f))], ['H', String(H(f))], ['N y halógenos', `${rengNOr(f)} y ${rengXOr(f)}`]],
    pasos: ([, f], _x, _y, rengR) => [`GI = (2 × ${C(f)} + 2 + ${rengNOr(f)} − ${H(f)} − ${rengXOr(f)})/2.`, `GI = ${tx(rengR)}: enlaces π más anillos.`],
    pistas: ['Calcula 2C + 2.', 'Suma los N y resta H y halógenos.', 'Divide el resultado entre dos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s5-p2', titulo: 'Hidrógenos de un miembro de una familia', unidad: '', tolerancia: E,
    objetivo: 'Aplicar la fórmula general de una familia de compuestos para hallar los hidrógenos de uno de sus miembros.', seccion: '20.1', para: 'las series homólogas', estructuras: true,
    idealizado: 'Compuesto saturado de cadena abierta con un solo grupo funcional.', metodo: 'recuento de hidrógenos de la molécula de esa familia construida con el motor de estructuras', lista: RENG_FAMILIAS_OR, x: [1, 10, 1], valida: (fa, x) => x >= fa.minC,
    respuesta: (fa, x) => rengHFamiliaOr(fa, x),
    errores: (fa, x) => [
      fa.gi === 1 ? ['sin-carbonilo', 'Sin descontar el C=O', rengHFamiliaOr(fa, x) + 2, 'No descontaste los dos hidrógenos que quita el enlace doble C=O.'] : ['con-doble', 'Descontando un doble enlace', rengHFamiliaOr(fa, x) - 2, 'Descontaste dos hidrógenos como si hubiera un enlace doble; esta familia es saturada.'],
      ['carbonos', 'Los carbonos', x, 'Ese es el número de carbonos; se piden los hidrógenos.']
    ],
    enunciado: (fa, x) => `Un compuesto es ${fa.nombre} de cadena abierta y saturada con ${x} ${x === 1 ? 'carbono' : 'carbonos'}. La fórmula general de ${fa.plural} es ${rengFormulaFamiliaOr(fa)}.`,
    pregunta: '¿Cuántos hidrógenos tiene?',
    datos: (fa, x) => [['Carbonos', String(x)], ['Fórmula general', rengFormulaFamiliaOr(fa)]],
    pasos: (fa, x, _y, rengR) => [`Con n = ${x}: H = 2 × ${x}${fa.hExtra > 0 ? ` + ${fa.hExtra}` : ''}.`, `H = ${tx(rengR)}.`],
    pistas: ['Identifica la fórmula general.', 'Sustituye n por los carbonos.', 'Calcula el subíndice del hidrógeno.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s5-p3', titulo: 'Carbonos a partir de la masa molar', unidad: '', tolerancia: E,
    objetivo: 'Identificar un miembro de una serie homóloga a partir de su masa molar.', seccion: '20.1', para: 'las series homólogas', estructuras: true, masas: true,
    idealizado: 'Compuesto saturado de cadena abierta con un solo grupo funcional.', metodo: 'búsqueda de la molécula de esa familia, construida con el motor de estructuras, que tiene esa masa molar', lista: RENG_FAMILIAS_OR, x: [1, 10, 1], valida: (fa, x) => x >= fa.minC,
    respuesta: (_fa, x) => x,
    errores: (fa, x) => [
      ['sin-grupo', 'Como un alcano', (rengMFamiliaOr(fa, x) - rengMH2Or()) / rengMCh2Or(), 'Trataste el compuesto como un alcano: antes hay que restar la masa del grupo funcional.'],
      ['entre-doce', 'Dividiendo entre 12', rengMFamiliaOr(fa, x) / A('C'), 'Dividiste toda la masa entre la del carbono; cada carbono de la serie aporta un CH₂.']
    ],
    enunciado: (fa, x) => `Un compuesto es ${fa.nombre} de cadena abierta y saturada, de fórmula general ${rengFormulaFamiliaOr(fa)}, y su masa molar es ${tx(rengMFamiliaOr(fa, x), 5)} g/mol. Cada CH₂ aporta ${tx(rengMCh2Or(), 5)} g/mol y el resto de la fórmula, ${tx(rengBaseFamiliaOr(fa), 5)} g/mol.`,
    pregunta: '¿Cuántos carbonos tiene?',
    datos: (fa, x) => [['Masa molar', `${tx(rengMFamiliaOr(fa, x), 5)} g/mol`], ['Resto de la fórmula', `${tx(rengBaseFamiliaOr(fa), 5)} g/mol`], ['CH₂', `${tx(rengMCh2Or(), 5)} g/mol`]],
    pasos: (fa, x, _y, rengR) => [`Masa de los CH₂: ${tx(rengMFamiliaOr(fa, x), 5)} − ${tx(rengBaseFamiliaOr(fa), 5)} = ${tx(x * rengMCh2Or(), 5)} g/mol.`, `n = ${tx(x * rengMCh2Or(), 5)}/${tx(rengMCh2Or(), 5)} = ${tx(rengR)}.`],
    pistas: ['Resta la parte fija de la fórmula.', 'Lo que queda son grupos CH₂.', 'Divide entre la masa de un CH₂.']
  })
]

export const RENG_PRACTICAS_B12_S06: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s6-p1', titulo: 'Hidrógenos que faltan para saturar', unidad: '', tolerancia: E,
    objetivo: 'Comparar un hidrocarburo insaturado con el alcano de igual número de carbonos.', seccion: '20.1', para: 'la clasificación de los hidrocarburos', estructuras: true, nombres: true,
    idealizado: 'Alcano de referencia de cadena abierta.', metodo: 'doble de los enlaces π más anillos de la molécula construida con el motor de estructuras', lista: RENG_INSATURADOS_OR,
    respuesta: ([, f]) => 2 * C(f) + 2 - H(f),
    errores: ([, f]) => [
      ['mitad', 'El grado de insaturación', rengGiOr(f), 'Ese es el grado de insaturación; cada grado equivale a dos hidrógenos.'],
      ['sin-dos', 'Sin el «+ 2»', 2 * C(f) - H(f), 'El alcano tiene 2n + 2 hidrógenos, no 2n: faltan los de los extremos.']
    ],
    enunciado: ([n, f]) => `El hidrocarburo ${n} tiene fórmula ${T(f)}.`,
    pregunta: '¿Cuántos hidrógenos menos tiene que el alcano de cadena abierta con los mismos carbonos?',
    datos: ([, f]) => [['Carbonos', String(C(f))], ['Hidrógenos', String(H(f))]],
    pasos: ([, f], _x, _y, rengR) => [`El alcano tendría 2 × ${C(f)} + 2 = ${2 * C(f) + 2} hidrógenos.`, `Faltan ${2 * C(f) + 2} − ${H(f)} = ${tx(rengR)}.`],
    pistas: ['Calcula los H del alcano: 2n + 2.', 'Resta los hidrógenos reales.', 'Cada doble o anillo quita dos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s6-p2', titulo: 'Oxígeno para quemar un hidrocarburo', unidad: 'mol',
    objetivo: 'Calcular el oxígeno que consume la combustión completa de un hidrocarburo.', seccion: '20.1', para: 'la combustión de los hidrocarburos', estructuras: true, nombres: true,
    idealizado: 'Combustión completa a CO₂ y H₂O.', metodo: 'balance de átomos de oxígeno con el recuento de la molécula construida con el motor de estructuras', lista: RENG_HIDROCARBUROS_OR, x: [1.5, 10, 0.5],
    respuesta: ([, f], x) => x * (C(f) + H(f) / 4),
    errores: ([, f], x) => [
      ['sin-agua', 'Solo para el CO₂', x * C(f), 'Contaste solo el oxígeno del CO₂; el agua también lo necesita: y/4 por mol.'],
      ['por-mol', 'Para un solo mol', C(f) + H(f) / 4, 'Ese es el oxígeno para un mol de hidrocarburo; aquí se quema otra cantidad.']
    ],
    enunciado: ([n, f], x) => `Se queman por completo ${tx(x)} mol de ${n}, ${T(f)}. Los productos son CO₂ y H₂O.`,
    pregunta: '¿Cuántos moles de O₂ se consumen?',
    datos: ([, f], x) => [['Hidrocarburo', `${tx(x)} mol`], ['O₂ por mol de CₓHᵧ', `x + y/4 = ${tx(C(f) + H(f) / 4)}`]],
    pasos: ([, f], x, _y, rengR) => [`Por mol: ${C(f)} + ${H(f)}/4 = ${tx(C(f) + H(f) / 4)} mol de O₂.`, `n(O₂) = ${tx(x)} × ${tx(C(f) + H(f) / 4)} = ${tx(rengR)} mol.`],
    pistas: ['Cada carbono necesita un O₂.', 'Cada cuatro hidrógenos, otro O₂.', 'Multiplica por los moles quemados.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s6-p3', titulo: 'Dióxido de carbono de una combustión', unidad: 'g',
    objetivo: 'Calcular la masa de CO₂ que produce la combustión completa de una masa de hidrocarburo.', seccion: '20.1', para: 'la combustión de los hidrocarburos', estructuras: true, nombres: true, masas: true,
    idealizado: 'Combustión completa.', metodo: 'moles de carbono de la molécula construida con el motor de estructuras', lista: RENG_HIDROCARBUROS_OR, x: [5, 200, 5], valida: ([, f]) => C(f) > 1,
    respuesta: ([, f], x) => (x / M(f)) * C(f) * rengMCo2Or(),
    errores: ([, f], x) => [
      ['uno-a-uno', 'Un CO₂ por molécula', (x / M(f)) * rengMCo2Or(), 'Cada carbono da un CO₂: multiplica por el número de carbonos.'],
      ['masa-carbono', 'La masa de carbono', (x * C(f) * A('C')) / M(f), 'Esa es la masa de carbono de la muestra; el CO₂ pesa más porque incorpora oxígeno.']
    ],
    enunciado: ([n, f], x) => `Se queman por completo ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol). La masa molar del CO₂ es ${tx(rengMCo2Or(), 5)} g/mol.`,
    pregunta: '¿Qué masa de CO₂ se produce, en gramos?',
    datos: ([, f], x) => [['Masa', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['CO₂ por molécula', String(C(f))]],
    pasos: ([, f], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol, que dan ${tx((x / M(f)) * C(f))} mol de CO₂.`, `m(CO₂) = ${tx((x / M(f)) * C(f))} × ${tx(rengMCo2Or(), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos a moles.', 'Cada carbono da un CO₂.', 'Pasa los moles de CO₂ a gramos.']
  })
]

export const RENG_PRACTICAS_B12_S07: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s7-p1', titulo: 'Hidrógenos de un alcano', unidad: '', tolerancia: E,
    objetivo: 'Obtener el número de hidrógenos de un alcano a partir de su nombre.', seccion: '20.1', para: 'los alcanos', estructuras: true, nombres: true,
    idealizado: 'Alcano de cadena abierta.', metodo: 'lectura del nombre con el analizador de nomenclatura del núcleo y recuento sobre la molécula', lista: RENG_ALCANOS_OR,
    respuesta: ([, f]) => 2 * C(f) + 2,
    errores: ([, f]) => [
      ['alqueno', 'Con la fórmula CₙH₂ₙ', 2 * C(f), 'CₙH₂ₙ es la fórmula de los alquenos; los alcanos tienen dos hidrógenos más.'],
      ['carbonos', 'Los carbonos', C(f), 'Ese es el número de carbonos; se piden los hidrógenos.']
    ],
    enunciado: ([n]) => `El ${n} es un alcano. Recuerda los prefijos met-, et-, prop-, but-, pent-, hex-, hept-, oct-, non- y dec-, y que metil, etil… son ramas de uno, dos… carbonos.`,
    pregunta: '¿Cuántos hidrógenos tiene?',
    datos: ([, f]) => [['Carbonos en total', String(C(f))], ['Fórmula general', 'CₙH₂ₙ₊₂']],
    pasos: ([, f], _x, _y, rengR) => [`El nombre indica ${C(f)} carbonos en total.`, `H = 2 × ${C(f)} + 2 = ${tx(rengR)}: ${T(f)}.`],
    pistas: ['Cuenta los carbonos del nombre.', 'Suma cadena principal y ramas.', 'Aplica la fórmula CₙH₂ₙ₊₂.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s7-p2', titulo: 'Masa molar de un alcano', unidad: 'g/mol',
    objetivo: 'Calcular la masa molar de un alcano conociendo su número de carbonos.', seccion: '20.1', para: 'los alcanos', estructuras: true, masas: true,
    idealizado: 'Alcano de cadena abierta.', metodo: 'masa molar del alcano lineal construido con el motor de estructuras', lista: UNO, x: [1, 20, 1], valida: (_e, x) => x !== 2,
    respuesta: (_e, x) => mAlcano(x),
    errores: (_e, x) => [
      ['sin-h', 'Sin los hidrógenos', x * A('C'), 'Sumaste solo la masa de los carbonos: faltan los 2n + 2 hidrógenos.'],
      ['ch3', 'Tres hidrógenos por carbono', x * (A('C') + 3 * A('H')), 'Pusiste tres hidrógenos en cada carbono; solo los extremos son CH₃.']
    ],
    enunciado: (_e, x) => `Un alcano de cadena abierta tiene ${x} ${x === 1 ? 'carbono' : 'carbonos'}. Masas atómicas: C ${tx(A('C'), 5)} y H ${tx(A('H'), 4)}.`,
    pregunta: '¿Cuál es su masa molar, en g/mol?',
    datos: (_e, x) => [['Carbonos', String(x)], ['Hidrógenos', String(2 * x + 2)]],
    pasos: (_e, x, _y, rengR) => [`Fórmula: C${x}H${2 * x + 2}.`, `M = ${x} × ${tx(A('C'), 5)} + ${2 * x + 2} × ${tx(A('H'), 4)} = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Escribe la fórmula CₙH₂ₙ₊₂.', 'Multiplica cada masa por su subíndice.', 'Suma las dos contribuciones.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s7-p3', titulo: 'Identificar un alcano por su masa molar', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número de carbonos de un alcano a partir de su masa molar.', seccion: '20.1', para: 'los alcanos', estructuras: true, masas: true,
    idealizado: 'Alcano de cadena abierta.', metodo: 'búsqueda entre los alcanos lineales construidos con el motor de estructuras', lista: UNO, x: [1, 20, 1],
    respuesta: (_e, x) => x,
    errores: (_e, x) => [
      ['entre-doce', 'Dividiendo entre 12', mAlcano(x) / A('C'), 'Dividiste entre la masa del carbono; cada carbono va acompañado de hidrógenos.'],
      ['hidrogenos', 'Los hidrógenos', 2 * x + 2, 'Ese es el número de hidrógenos del alcano; se piden los carbonos.']
    ],
    enunciado: (_e, x) => `Un alcano tiene una masa molar de ${tx(mAlcano(x), 5)} g/mol. Para un alcano, M = ${tx(rengMCh2Or(), 5)}·n + ${tx(rengMH2Or(), 4)}.`,
    pregunta: '¿Cuántos carbonos tiene?',
    datos: (_e, x) => [['Masa molar', `${tx(mAlcano(x), 5)} g/mol`], ['CH₂', `${tx(rengMCh2Or(), 5)} g/mol`], ['Dos H de los extremos', `${tx(rengMH2Or(), 4)} g/mol`]],
    pasos: (_e, x, _y, rengR) => [`${tx(mAlcano(x), 5)} − ${tx(rengMH2Or(), 4)} = ${tx(x * rengMCh2Or(), 5)}.`, `n = ${tx(x * rengMCh2Or(), 5)}/${tx(rengMCh2Or(), 5)} = ${tx(rengR)}.`],
    pistas: ['Resta los dos H de los extremos.', 'Lo que queda son grupos CH₂.', 'Divide entre la masa de un CH₂.']
  })
]

export const RENG_PRACTICAS_B12_S08: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s8-p1', titulo: 'Hidrógenos de un alqueno', unidad: '', tolerancia: E,
    objetivo: 'Obtener el número de hidrógenos de un alqueno a partir de su nombre.', seccion: '20.1', para: 'los alquenos', estructuras: true, nombres: true,
    idealizado: 'Alqueno de cadena abierta.', metodo: 'lectura del nombre con el analizador de nomenclatura del núcleo y recuento sobre la molécula', lista: RENG_ALQUENOS_OR,
    respuesta: ([, f]) => H(f),
    errores: ([, f, , d]) => [
      ['alcano', 'Como un alcano', 2 * C(f) + 2, 'Esa es la fórmula del alcano: cada enlace doble quita dos hidrógenos.'],
      ['como-triple', 'Cuatro por enlace doble', 2 * C(f) + 2 - 4 * d, 'Restaste cuatro hidrógenos por enlace doble; eso corresponde a un enlace triple.']
    ],
    enunciado: ([n, , , d]) => `El ${n} es un hidrocarburo de cadena abierta con ${d} ${d === 1 ? 'enlace doble' : 'enlaces dobles'}.`,
    pregunta: '¿Cuántos hidrógenos tiene?',
    datos: ([, f, , d]) => [['Carbonos', String(C(f))], ['Enlaces dobles', String(d)]],
    pasos: ([, f, , d], _x, _y, rengR) => [`El alcano tendría 2 × ${C(f)} + 2 = ${2 * C(f) + 2} hidrógenos.`, `Se restan 2 × ${d}: H = ${tx(rengR)}; la fórmula es ${T(f)}.`],
    pistas: ['Cuenta los carbonos del nombre.', 'Parte de 2n + 2 hidrógenos.', 'Cada enlace doble quita dos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s8-p2', titulo: 'Hidrógeno para saturar un alqueno', unidad: 'g',
    objetivo: 'Calcular la masa de hidrógeno que adiciona un alqueno hasta convertirse en alcano.', seccion: '20.1', para: 'la adición a los alquenos', estructuras: true, nombres: true, masas: true,
    idealizado: 'Hidrogenación completa de todos los enlaces dobles.', metodo: 'recuento de enlaces dobles C=C de la molécula construida con el motor de estructuras', lista: RENG_ALQUENOS_OR, x: [50, 1000, 50],
    respuesta: ([, f, , d], x) => (x / M(f)) * d * rengMH2Or(),
    errores: ([, f, , d], x) => [
      ['moles', 'Los moles de H₂', (x / M(f)) * d, 'Esos son los moles de H₂; se pide la masa: multiplica por su masa molar.'],
      ['por-carbono', 'Un H₂ por carbono', (x / M(f)) * C(f) * rengMH2Or(), 'Solo los enlaces dobles adicionan hidrógeno: uno por cada C=C, no uno por carbono.']
    ],
    enunciado: ([n, f, , d], x) => `Se hidrogenan por completo ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), que tiene ${d} ${d === 1 ? 'enlace doble' : 'enlaces dobles'}. La masa molar del H₂ es ${tx(rengMH2Or(), 4)} g/mol.`,
    pregunta: '¿Qué masa de H₂ se consume, en gramos?',
    datos: ([, f, , d], x) => [['Masa de alqueno', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['H₂ por molécula', String(d)]],
    pasos: ([, f, , d], x, _y, rengR) => [`n(alqueno) = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol; n(H₂) = ${tx((x / M(f)) * d)} mol.`, `m(H₂) = ${tx((x / M(f)) * d)} × ${tx(rengMH2Or(), 4)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de alqueno a moles.', 'Cada enlace doble adiciona un H₂.', 'Pasa los moles de H₂ a gramos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s8-p3', titulo: 'Producto de la adición de bromo', unidad: 'g',
    objetivo: 'Calcular la masa del producto que se forma al adicionar bromo a los enlaces dobles de un alqueno.', seccion: '20.1', para: 'la adición a los alquenos', estructuras: true, nombres: true, masas: true,
    idealizado: 'Adición completa de Br₂ a todos los enlaces dobles.', metodo: 'conservación de la masa con los enlaces dobles de la molécula construida con el motor de estructuras', lista: RENG_ALQUENOS_OR, x: [10, 200, 10],
    respuesta: ([, f, , d], x) => (x / M(f)) * (M(f) + d * M('Br2')),
    errores: ([, f, , d], x) => [
      ['un-bromo', 'Un átomo de bromo', (x / M(f)) * (M(f) + d * A('Br')), 'Cada enlace doble adiciona una molécula de Br₂, es decir, dos átomos de bromo.'],
      ['solo-bromo', 'Solo el bromo', (x / M(f)) * d * M('Br2'), 'Esa es la masa de bromo consumida; el producto incluye también el alqueno.']
    ],
    enunciado: ([n, f, , d], x) => `A ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), con ${d} ${d === 1 ? 'enlace doble' : 'enlaces dobles'}, se les adiciona bromo, Br₂ (${tx(M('Br2'), 5)} g/mol), hasta saturarlos.`,
    pregunta: '¿Qué masa de producto bromado se obtiene, en gramos?',
    datos: ([, f, , d], x) => [['Masa de alqueno', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['Br₂ por molécula', String(d)]],
    pasos: ([, f, , d], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol; el producto pesa ${tx(M(f), 5)} + ${d} × ${tx(M('Br2'), 5)} = ${tx(M(f) + d * M('Br2'), 5)} g/mol.`, `m = ${tx(x / M(f))} × ${tx(M(f) + d * M('Br2'), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de alqueno a moles.', 'En una adición no se pierden átomos.', 'Suma el alqueno y el bromo adicionado.']
  })
]
