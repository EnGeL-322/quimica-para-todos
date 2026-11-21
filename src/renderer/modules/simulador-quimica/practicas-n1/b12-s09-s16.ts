import { rengTx } from '../aprender/n1/gases/constantes'
import { rengAnNo, rengMNo, rengTxtNo } from './b05-comun'
import {
  RENG_ACIDOS_OR, RENG_ALCOHOLES_OR, RENG_ALDEHIDOS_OR, RENG_ALQUINOS_OR, RENG_AROMATICOS_OR, RENG_CETONAS_OR, RENG_DESHIDRATABLES_OR, RENG_ETERES_OR, RENG_ETERES_SIMETRICOS_OR, RENG_ISOMEROS_OR, RENG_MONOCLORADOS_OR, RENG_PARES_ISOMEROS_OR,
  RENG_TOL_OR_ENT, rengCOr, rengGiOr, rengHOr, rengMAguaOr, rengMCh2Or, rengMCo2Or, rengMH2Or, rengO2Or, rengOOr, rengPracticaOr, rengTotalOr
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
export const rengMAlquinoOr = (rengN: number): number => rengN * A('C') + (2 * rengN - 2) * A('H')
export const rengMCetonaOr = (rengN: number): number => rengN * rengMCh2Or() + A('O')
export const RENG_PREGUNTAS_ISOMEROS: ReadonlyArray<readonly [string, number]> = [['¿Cuántos isómeros estructurales tiene en total?', 0], ['¿Cuántos isómeros ramificados tiene, sin contar el de cadena lineal?', -1]]

export const RENG_PRACTICAS_B12_S09: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s9-p1', titulo: 'Hidrógenos de un alquino', unidad: '', tolerancia: E,
    objetivo: 'Obtener el número de hidrógenos de un alquino a partir de su nombre.', seccion: '20.1', para: 'los alquinos', estructuras: true, nombres: true,
    idealizado: 'Alquino de cadena abierta.', metodo: 'lectura del nombre con el analizador de nomenclatura del núcleo y recuento sobre la molécula', lista: RENG_ALQUINOS_OR,
    respuesta: ([, f]) => H(f),
    errores: ([, f, , t]) => [
      ['alcano', 'Como un alcano', 2 * C(f) + 2, 'Esa es la fórmula del alcano: cada enlace triple quita cuatro hidrógenos.'],
      ['como-doble', 'Dos por enlace triple', 2 * C(f) + 2 - 2 * t, 'Restaste dos hidrógenos por enlace triple; eso corresponde a un enlace doble.']
    ],
    enunciado: ([n, , , t]) => `El ${n} es un hidrocarburo de cadena abierta con ${t} ${t === 1 ? 'enlace triple' : 'enlaces triples'}.`,
    pregunta: '¿Cuántos hidrógenos tiene?',
    datos: ([, f, , t]) => [['Carbonos', String(C(f))], ['Enlaces triples', String(t)]],
    pasos: ([, f, , t], _x, _y, rengR) => [`El alcano tendría 2 × ${C(f)} + 2 = ${2 * C(f) + 2} hidrógenos.`, `Se restan 4 × ${t}: H = ${tx(rengR)}; la fórmula es ${T(f)}.`],
    pistas: ['Cuenta los carbonos del nombre.', 'Parte de 2n + 2 hidrógenos.', 'Cada enlace triple quita cuatro.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s9-p2', titulo: 'Hidrógeno para saturar un alquino', unidad: 'g',
    objetivo: 'Calcular la masa de hidrógeno que adiciona un alquino hasta convertirse en alcano.', seccion: '20.1', para: 'la adición a los alquinos', estructuras: true, nombres: true, masas: true,
    idealizado: 'Hidrogenación completa: dos H₂ por enlace triple.', metodo: 'recuento de enlaces triples de la molécula construida con el motor de estructuras', lista: RENG_ALQUINOS_OR, x: [50, 1000, 50], valida: ([, f, , t]) => C(f) !== 2 * t,
    respuesta: ([, f, , t], x) => (x / M(f)) * 2 * t * rengMH2Or(),
    errores: ([, f, , t], x) => [
      ['como-doble', 'Un H₂ por enlace triple', (x / M(f)) * t * rengMH2Or(), 'Un enlace triple tiene dos enlaces π y adiciona dos moléculas de H₂, no una.'],
      ['por-carbono', 'Un H₂ por carbono', (x / M(f)) * C(f) * rengMH2Or(), 'Solo los enlaces triples adicionan hidrógeno: dos H₂ por cada uno, no uno por carbono.']
    ],
    enunciado: ([n, f, , t], x) => `Se hidrogenan por completo, hasta el alcano, ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), que tiene ${t} ${t === 1 ? 'enlace triple' : 'enlaces triples'}. La masa molar del H₂ es ${tx(rengMH2Or(), 4)} g/mol.`,
    pregunta: '¿Qué masa de H₂ se consume, en gramos?',
    datos: ([, f, , t], x) => [['Masa de alquino', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['H₂ por molécula', String(2 * t)]],
    pasos: ([, f, , t], x, _y, rengR) => [`n(alquino) = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol; n(H₂) = ${tx((x / M(f)) * 2 * t)} mol.`, `m(H₂) = ${tx((x / M(f)) * 2 * t)} × ${tx(rengMH2Or(), 4)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de alquino a moles.', 'Cada enlace triple adiciona dos H₂.', 'Pasa los moles de H₂ a gramos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s9-p3', titulo: 'Identificar un alquino por su masa molar', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número de carbonos de un alquino con un enlace triple a partir de su masa molar.', seccion: '20.1', para: 'los alquinos', estructuras: true, masas: true,
    idealizado: 'Alquino de cadena abierta con un solo enlace triple.', metodo: 'búsqueda entre los alquinos construidos con el motor de estructuras', lista: UNO, x: [2, 18, 1],
    respuesta: (_e, x) => x,
    errores: (_e, x) => [
      ['como-alcano', 'Como un alcano', (rengMAlquinoOr(x) - rengMH2Or()) / rengMCh2Or(), 'Usaste la fórmula del alcano, CₙH₂ₙ₊₂; en un alquino es CₙH₂ₙ₋₂ y hay que sumar, no restar.'],
      ['entre-doce', 'Dividiendo entre 12', rengMAlquinoOr(x) / A('C'), 'Dividiste entre la masa del carbono; cada carbono va acompañado de hidrógenos.']
    ],
    enunciado: (_e, x) => `Un alquino de cadena abierta con un enlace triple, de fórmula CₙH₂ₙ₋₂, tiene una masa molar de ${tx(rengMAlquinoOr(x), 5)} g/mol. Para esta familia, M = ${tx(rengMCh2Or(), 5)}·n − ${tx(rengMH2Or(), 4)}.`,
    pregunta: '¿Cuántos carbonos tiene?',
    datos: (_e, x) => [['Masa molar', `${tx(rengMAlquinoOr(x), 5)} g/mol`], ['CH₂', `${tx(rengMCh2Or(), 5)} g/mol`], ['Dos H', `${tx(rengMH2Or(), 4)} g/mol`]],
    pasos: (_e, x, _y, rengR) => [`${tx(rengMAlquinoOr(x), 5)} + ${tx(rengMH2Or(), 4)} = ${tx(x * rengMCh2Or(), 5)}.`, `n = ${tx(x * rengMCh2Or(), 5)}/${tx(rengMCh2Or(), 5)} = ${tx(rengR)}.`],
    pistas: ['Suma los dos H que faltan.', 'Lo que queda son grupos CH₂.', 'Divide entre la masa de un CH₂.']
  })
]

export const RENG_PRACTICAS_B12_S10: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s10-p1', titulo: 'Grado de insaturación de un aromático', unidad: '', tolerancia: E,
    objetivo: 'Calcular el grado de insaturación de un hidrocarburo aromático.', seccion: '20.1', para: 'los hidrocarburos aromáticos', estructuras: true,
    idealizado: 'Estructura de Kekulé.', metodo: 'enlaces π más anillos de la molécula construida con el motor de estructuras', lista: RENG_AROMATICOS_OR,
    respuesta: ([, f]) => rengGiOr(f),
    errores: ([, f, , r]) => [
      ['sin-dividir', 'Sin dividir entre dos', 2 * rengGiOr(f), 'Esos son los hidrógenos que faltan; cada grado de insaturación equivale a dos.'],
      ['solo-dobles', 'Solo los enlaces dobles', rengGiOr(f) - r, 'Contaste solo los enlaces dobles; cada anillo también es un grado de insaturación.']
    ],
    enunciado: ([n, f, , r]) => `El ${n} es un hidrocarburo aromático de fórmula ${T(f)}, con ${r} ${r === 1 ? 'anillo' : 'anillos'}.`,
    pregunta: '¿Cuál es su grado de insaturación?',
    datos: ([, f]) => [['C', String(C(f))], ['H', String(H(f))], ['Regla', 'GI = (2C + 2 − H)/2']],
    pasos: ([, f, , r], _x, _y, rengR) => [`GI = (2 × ${C(f)} + 2 − ${H(f)})/2 = ${tx(rengR)}.`, `De ellos, ${r} ${r === 1 ? 'es un anillo' : 'son anillos'} y ${rengGiOr(f) - r}, enlaces dobles.`],
    pistas: ['Calcula los H del alcano: 2C + 2.', 'Resta los hidrógenos reales.', 'Divide la diferencia entre dos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s10-p2', titulo: 'Carbono en un hidrocarburo aromático', unidad: '%',
    objetivo: 'Calcular el porcentaje en masa de carbono de un hidrocarburo aromático.', seccion: '20.1', para: 'los hidrocarburos aromáticos', estructuras: true, masas: true,
    idealizado: 'Compuesto puro.', metodo: 'masas de los átomos de la molécula construida con el motor de estructuras', lista: RENG_AROMATICOS_OR,
    respuesta: ([, f]) => (100 * C(f) * A('C')) / M(f),
    errores: ([, f]) => [
      ['atomos', 'Porcentaje en átomos', (100 * C(f)) / rengTotalOr(f), 'Calculaste el porcentaje de átomos que son carbono; se pide el porcentaje en masa.'],
      ['hidrogeno', 'El hidrógeno', (100 * H(f) * A('H')) / M(f), 'Ese es el porcentaje de hidrógeno; se pide el de carbono.']
    ],
    enunciado: ([n, f]) => `El ${n} tiene fórmula ${T(f)} y masa molar ${tx(M(f), 5)} g/mol. La masa atómica del carbono es ${tx(A('C'), 5)}.`,
    pregunta: '¿Qué porcentaje de su masa es carbono?',
    datos: ([, f]) => [['Carbonos', String(C(f))], ['Masa molar', `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f], _x, _y, rengR) => [`Masa de carbono por mol: ${C(f)} × ${tx(A('C'), 5)} = ${tx(C(f) * A('C'), 5)} g.`, `% C = 100 × ${tx(C(f) * A('C'), 5)}/${tx(M(f), 5)} = ${tx(rengR)} %.`],
    pistas: ['Halla la masa de todos los carbonos.', 'Divídela entre la masa molar.', 'Multiplica el cociente por cien.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s10-p3', titulo: 'Electrones π de un aromático', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones π de un hidrocarburo aromático a partir de su fórmula y su número de anillos.', seccion: '20.1', para: 'los hidrocarburos aromáticos', estructuras: true,
    idealizado: 'Todos los enlaces dobles están en los anillos aromáticos.', metodo: 'doble de los enlaces dobles de la estructura construida con el motor de estructuras', lista: RENG_AROMATICOS_OR,
    respuesta: ([, f, , r]) => 2 * (rengGiOr(f) - r),
    errores: ([, f, , r]) => [
      ['dobles', 'Los enlaces dobles', rengGiOr(f) - r, 'Ese es el número de enlaces dobles; cada uno aporta dos electrones π.'],
      ['con-anillos', 'Contando los anillos', 2 * rengGiOr(f), 'Usaste todo el grado de insaturación; los anillos no aportan electrones π.']
    ],
    enunciado: ([n, f, , r]) => `El ${n}, ${T(f)}, es un hidrocarburo aromático con ${r} ${r === 1 ? 'anillo' : 'anillos'}. Todos sus enlaces dobles están en los anillos, y cada uno aporta dos electrones π.`,
    pregunta: '¿Cuántos electrones π tiene?',
    datos: ([, f, , r]) => [['Grado de insaturación', String(rengGiOr(f))], ['Anillos', String(r)]],
    pasos: ([, f, , r], _x, _y, rengR) => [`Enlaces dobles = GI − anillos = ${rengGiOr(f)} − ${r} = ${rengGiOr(f) - r}.`, `Electrones π = 2 × ${rengGiOr(f) - r} = ${tx(rengR)}.`],
    pistas: ['Calcula el grado de insaturación.', 'Resta los anillos: quedan los dobles.', 'Cada doble aporta dos electrones π.']
  })
]

export const RENG_PRACTICAS_B12_S11: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s11-p1', titulo: 'Isómeros de un alcano', unidad: '', tolerancia: E,
    objetivo: 'Usar la serie de isómeros de los alcanos para saber cuántos esqueletos distintos corresponden a una fórmula.', seccion: '20.1', para: 'la isomería de cadena', tablas: true,
    idealizado: 'Solo isómeros estructurales, sin estereoisómeros.', metodo: 'recuento de los esqueletos posibles con un algoritmo de árboles con centro', lista: RENG_PREGUNTAS_ISOMEROS, x: [3, 12, 1], valida: ([, d], x) => RENG_ISOMEROS_OR[x - 1]! + d > 0,
    respuesta: ([, d], x) => RENG_ISOMEROS_OR[x - 1]! + d,
    errores: ([, d], x) => [
      ['carbonos', 'Los carbonos', x, 'Diste el número de carbonos; los isómeros hay que contarlos dibujando los esqueletos distintos.'],
      ['siguiente', 'Los del alcano siguiente', RENG_ISOMEROS_OR[x]! + d, 'Ese valor corresponde al alcano con un carbono más.']
    ],
    enunciado: (_e, x) => `Un alcano tiene ${x} carbonos, es decir, fórmula C${x}H${2 * x + 2}. Los alcanos de 1 a 12 carbonos tienen 1, 1, 1, 2, 3, 5, 9, 18, 35, 75, 159 y 355 isómeros estructurales.`,
    pregunta: ([p]) => p,
    datos: (_e, x) => [['Carbonos', String(x)], ['Serie de isómeros', '1, 1, 1, 2, 3, 5, 9, 18, 35, 75, 159, 355']],
    pasos: ([, d], x, _y, rengR) => [`Al alcano de ${x} carbonos le corresponden ${RENG_ISOMEROS_OR[x - 1]} isómeros en total.`, d === 0 ? `Respuesta: ${tx(rengR, 4)}.` : `Uno de ellos es el lineal: quedan ${tx(rengR, 4)} ramificados.`],
    pistas: ['Localiza el alcano en la serie.', 'El lineal también es un isómero.', 'Lee bien qué isómeros se piden.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s11-p2', titulo: 'Masa molar de un isómero', unidad: 'g/mol',
    objetivo: 'Aplicar que los isómeros comparten fórmula molecular para hallar la masa molar de uno de ellos.', seccion: '20.1', para: 'la isomería estructural', estructuras: true, nombres: true, masas: true,
    idealizado: 'Isómeros estructurales.', metodo: 'masa molar del segundo isómero construido con el motor de estructuras', lista: RENG_PARES_ISOMEROS_OR,
    respuesta: ([, f]) => M(f),
    errores: ([, f]) => [
      ['mas-ch2', 'Con un CH₂ más', M(f) + rengMCh2Or(), 'Sumaste un CH₂: eso sería el siguiente miembro de la serie, no un isómero.'],
      ['doble', 'El doble', 2 * M(f), 'Sumaste las masas de los dos compuestos; cada isómero tiene la misma masa molar.']
    ],
    enunciado: ([a, f, , b, , tipo]) => `El compuesto ${a}, de fórmula ${T(f)}, y el compuesto ${b} son isómeros de ${tipo}.`,
    pregunta: ([, , , b]) => `¿Cuál es la masa molar del compuesto ${b}, en g/mol?`,
    datos: ([a, f]) => [[`Fórmula de ${a}`, T(f)], ['Isómeros', 'misma fórmula molecular']],
    pasos: ([, f, , b], _x, _y, rengR) => [`Por ser isómeros, ${b} tiene la misma fórmula: ${T(f)}.`, `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Los isómeros comparten fórmula.', 'Usa la fórmula del primer compuesto.', 'Suma las masas atómicas.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s11-p3', titulo: 'Isómeros de posición de un cloroalcano', unidad: '', tolerancia: E,
    objetivo: 'Contar los isómeros de posición que resultan al sustituir un hidrógeno de un alcano por un cloro.', seccion: '20.1', para: 'la isomería de posición', estructuras: true, nombres: true,
    idealizado: 'Solo isómeros estructurales: las posiciones equivalentes por simetría cuentan una vez.', metodo: 'sustitución carbono a carbono y recuento de estructuras distintas con el identificador canónico del motor de estructuras', lista: RENG_MONOCLORADOS_OR,
    valida: ([, f, , d]) => d !== C(f),
    respuesta: ([, , , d]) => d,
    errores: ([, f]) => [
      ['carbonos', 'Uno por carbono', C(f), 'Contaste una posición por carbono; los carbonos equivalentes por simetría dan el mismo compuesto.'],
      ['hidrogenos', 'Uno por hidrógeno', H(f), 'Contaste una posición por hidrógeno; muchos hidrógenos son equivalentes entre sí.']
    ],
    enunciado: ([n, f]) => `En el ${n}, ${T(f)}, se sustituye un solo hidrógeno por un átomo de cloro.`,
    pregunta: '¿Cuántos compuestos distintos (isómeros de posición) pueden formarse?',
    datos: ([, f]) => [['Carbonos', String(C(f))], ['Hidrógenos', String(H(f))]],
    pasos: ([n], _x, _y, rengR) => [`Se buscan los carbonos con hidrógeno del ${n} que no son equivalentes por simetría.`, `Hay ${tx(rengR)} ${rengR === 1 ? 'posición distinta' : 'posiciones distintas'}.`],
    pistas: ['Dibuja el esqueleto del alcano.', 'Marca los carbonos equivalentes.', 'Cuenta solo las posiciones distintas.']
  })
]

export const RENG_PRACTICAS_B12_S12: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s12-p1', titulo: 'Cantidad de un alcohol', unidad: 'mol',
    objetivo: 'Calcular los moles de un alcohol contenidos en una masa dada.', seccion: '20.2', para: 'los alcoholes', estructuras: true, nombres: true, masas: true,
    idealizado: 'Alcohol puro.', metodo: 'masa molar de la molécula construida con el motor de estructuras', lista: RENG_ALCOHOLES_OR, x: [20, 500, 10],
    respuesta: ([, f], x) => x / M(f),
    errores: ([, f], x) => [
      ['inverso', 'Cociente invertido', M(f) / x, 'Dividiste al revés: los moles son la masa entre la masa molar.'],
      ['producto', 'Multiplicando', x * M(f), 'Multiplicaste la masa por la masa molar; hay que dividir.']
    ],
    enunciado: ([n, f], x) => `Una muestra contiene ${tx(x)} g de ${n}, ${T(f)}, de masa molar ${tx(M(f), 5)} g/mol.`,
    pregunta: '¿Cuántos moles de alcohol hay?',
    datos: ([, f], x) => [['Masa', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f], x, _y, rengR) => ['n = m/M.', `n = ${tx(x)}/${tx(M(f), 5)} = ${tx(rengR)} mol.`],
    pistas: ['Usa la relación n = m/M.', 'La masa va en el numerador.', 'Divide entre la masa molar.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s12-p2', titulo: 'Combustión de un alcohol', unidad: 'mol',
    objetivo: 'Calcular el oxígeno que consume la combustión completa de un alcohol, teniendo en cuenta su propio oxígeno.', seccion: '20.2', para: 'las reacciones de los alcoholes', estructuras: true, nombres: true,
    idealizado: 'Combustión completa a CO₂ y H₂O.', metodo: 'balance de átomos de oxígeno con el recuento de la molécula construida con el motor de estructuras', lista: RENG_ALCOHOLES_OR, x: [1.5, 10, 0.5],
    respuesta: ([, f], x) => x * rengO2Or(f),
    errores: ([, f], x) => [
      ['sin-oxigeno-propio', 'Sin el oxígeno del alcohol', x * (C(f) + H(f) / 4), 'No descontaste el oxígeno que ya trae el alcohol: resta z/2 por mol.'],
      ['sin-agua', 'Solo para el CO₂', x * C(f), 'Contaste solo el oxígeno del CO₂; el agua también lo necesita.']
    ],
    enunciado: ([n, f], x) => `Se queman por completo ${tx(x)} mol de ${n}, ${T(f)}. Un mol de CₓHᵧO_z consume x + y/4 − z/2 moles de O₂.`,
    pregunta: '¿Cuántos moles de O₂ se consumen?',
    datos: ([, f], x) => [['Alcohol', `${tx(x)} mol`], ['x, y, z', `${C(f)}, ${H(f)}, ${rengOOr(f)}`]],
    pasos: ([, f], x, _y, rengR) => [`Por mol: ${C(f)} + ${H(f)}/4 − ${rengOOr(f)}/2 = ${tx(rengO2Or(f))} mol de O₂.`, `n(O₂) = ${tx(x)} × ${tx(rengO2Or(f))} = ${tx(rengR)} mol.`],
    pistas: ['Cada carbono necesita un O₂.', 'Cada cuatro hidrógenos, otro O₂.', 'Resta medio O₂ por oxígeno propio.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s12-p3', titulo: 'Deshidratación de un alcohol', unidad: 'g',
    objetivo: 'Calcular la masa de alqueno que se obtiene al deshidratar un alcohol.', seccion: '20.2', para: 'las reacciones de los alcoholes', estructuras: true, nombres: true, masas: true,
    idealizado: 'Eliminación completa de una molécula de agua por molécula de alcohol.', metodo: 'conservación de la masa con las masas molares del núcleo', lista: RENG_DESHIDRATABLES_OR, x: [10, 300, 10],
    respuesta: ([, f], x) => (x / M(f)) * (M(f) - rengMAguaOr()),
    errores: ([, f], x) => [
      ['agua', 'La masa de agua', (x / M(f)) * rengMAguaOr(), 'Esa es la masa de agua eliminada; se pide la masa del alqueno.'],
      ['sin-moles', 'Restando 18 a los gramos', x - rengMAguaOr(), 'Restaste la masa molar del agua a los gramos: antes hay que pasar a moles.']
    ],
    enunciado: ([n, f], x) => `Al calentar ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), con un ácido, cada molécula pierde una de agua (${tx(rengMAguaOr(), 5)} g/mol) y forma un alqueno.`,
    pregunta: '¿Qué masa de alqueno se obtiene, en gramos?',
    datos: ([, f], x) => [['Masa de alcohol', `${tx(x)} g`], ['Masa molar del alcohol', `${tx(M(f), 5)} g/mol`], ['Masa molar del alqueno', `${tx(M(f) - rengMAguaOr(), 5)} g/mol`]],
    pasos: ([, f], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol de alcohol y de alqueno.`, `m = ${tx(x / M(f))} × ${tx(M(f) - rengMAguaOr(), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de alcohol a moles.', 'El alqueno pesa 18,015 g/mol menos.', 'Multiplica moles por masa molar.']
  })
]

export const RENG_PRACTICAS_B12_S13: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s13-p1', titulo: 'Oxígeno en una muestra de éter', unidad: 'g',
    objetivo: 'Calcular la masa de oxígeno contenida en una muestra de un éter.', seccion: '20.2', para: 'los éteres', estructuras: true, nombres: true, masas: true,
    idealizado: 'Éter puro.', metodo: 'átomos de oxígeno y masa molar de la molécula construida con el motor de estructuras', lista: RENG_ETERES_OR, x: [10, 300, 10],
    respuesta: ([, f], x) => (x * A('O')) / M(f),
    errores: ([, f], x) => [
      ['porcentaje', 'El porcentaje', (100 * A('O')) / M(f), 'Ese es el porcentaje de oxígeno; falta aplicarlo a la masa de la muestra.'],
      ['carbono', 'La masa de carbono', (x * C(f) * A('C')) / M(f), 'Calculaste la masa de carbono; se pide la de oxígeno.']
    ],
    enunciado: ([n, f], x) => `Una muestra contiene ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol). La masa atómica del oxígeno es ${tx(A('O'), 5)}.`,
    pregunta: '¿Qué masa de oxígeno contiene, en gramos?',
    datos: ([, f], x) => [['Masa de la muestra', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['Oxígenos por molécula', '1']],
    pasos: ([, f], x, _y, rengR) => [`Fracción de oxígeno: ${tx(A('O'), 5)}/${tx(M(f), 5)} = ${tx(A('O') / M(f))}.`, `m(O) = ${tx(x)} × ${tx(A('O') / M(f))} = ${tx(rengR)} g.`],
    pistas: ['Un éter tiene un solo oxígeno.', 'Calcula su fracción en masa.', 'Multiplica por la masa de la muestra.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s13-p2', titulo: 'Agua liberada al formar un éter', unidad: 'g',
    objetivo: 'Calcular el agua que se libera al formar un éter simétrico a partir de su alcohol.', seccion: '20.2', para: 'la formación de éteres', estructuras: true, nombres: true, masas: true,
    idealizado: 'Dos moléculas de alcohol dan una de éter y una de agua.', metodo: 'conservación de la masa con las masas molares del núcleo', lista: RENG_ETERES_SIMETRICOS_OR, x: [10, 300, 10],
    respuesta: ([, f], x) => (x / M(f)) * rengMAguaOr(),
    errores: ([, f], x) => [
      ['dos-aguas', 'Dos aguas por éter', (2 * x * rengMAguaOr()) / M(f), 'Se libera una sola molécula de agua por cada molécula de éter formada.'],
      ['masa-eter', 'La masa de éter', x, 'Diste la masa del éter; se pide la del agua que se libera al formarlo.']
    ],
    enunciado: ([e, f, a, fa], x) => `Dos moléculas de ${a}, ${T(fa)}, se unen y forman una de ${e}, ${T(f)} (${tx(M(f), 5)} g/mol), y una de agua (${tx(rengMAguaOr(), 5)} g/mol). Se obtienen ${tx(x)} g de éter.`,
    pregunta: '¿Qué masa de agua se ha liberado, en gramos?',
    datos: ([, f], x) => [['Masa de éter', `${tx(x)} g`], ['Masa molar del éter', `${tx(M(f), 5)} g/mol`], ['Agua por éter', '1']],
    pasos: ([, f], x, _y, rengR) => [`n(éter) = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol, y los mismos moles de agua.`, `m(H₂O) = ${tx(x / M(f))} × ${tx(rengMAguaOr(), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de éter a moles.', 'Se libera un agua por cada éter.', 'Pasa los moles de agua a gramos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s13-p3', titulo: 'Alcohol necesario para un éter', unidad: 'g',
    objetivo: 'Calcular la masa de alcohol necesaria para obtener una masa dada de éter simétrico.', seccion: '20.2', para: 'la formación de éteres', estructuras: true, nombres: true, masas: true,
    idealizado: 'Reacción completa: 2 R–OH → R–O–R + H₂O.', metodo: 'conservación de la masa: éter más agua liberada', lista: RENG_ETERES_SIMETRICOS_OR, x: [10, 300, 10],
    respuesta: ([, f, , fa], x) => (2 * x * M(fa)) / M(f),
    errores: ([, f, , fa], x) => [
      ['uno', 'Un alcohol por éter', (x * M(fa)) / M(f), 'Cada molécula de éter necesita dos de alcohol, no una.'],
      ['sin-moles', 'El doble de los gramos', 2 * x, 'Doblaste los gramos sin pasar por los moles: las masas molares son distintas.']
    ],
    enunciado: ([e, f, a, fa], x) => `Se quieren obtener ${tx(x)} g de ${e}, ${T(f)} (${tx(M(f), 5)} g/mol), a partir de ${a}, ${T(fa)} (${tx(M(fa), 5)} g/mol): 2 R–OH → R–O–R + H₂O.`,
    pregunta: '¿Qué masa de alcohol hace falta, en gramos?',
    datos: ([, f, , fa], x) => [['Masa de éter', `${tx(x)} g`], ['Masa molar del éter', `${tx(M(f), 5)} g/mol`], ['Masa molar del alcohol', `${tx(M(fa), 5)} g/mol`]],
    pasos: ([, f, , fa], x, _y, rengR) => [`n(éter) = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol; n(alcohol) = ${tx((2 * x) / M(f))} mol.`, `m = ${tx((2 * x) / M(f))} × ${tx(M(fa), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de éter a moles.', 'Hacen falta dos alcoholes por éter.', 'Pasa los moles de alcohol a gramos.']
  })
]

export const RENG_PRACTICAS_B12_S14: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s14-p1', titulo: 'Hidrógenos de un aldehído', unidad: '', tolerancia: E,
    objetivo: 'Aplicar la fórmula general de los aldehídos para hallar sus hidrógenos.', seccion: '20.3', para: 'los aldehídos', estructuras: true,
    idealizado: 'Aldehído saturado de cadena abierta.', metodo: 'recuento de hidrógenos del aldehído construido con el motor de estructuras', lista: UNO, x: [1, 14, 1],
    respuesta: (_e, x) => 2 * x,
    errores: (_e, x) => [
      ['alcohol', 'Como un alcohol', 2 * x + 2, 'Esa es la fórmula de un alcohol: el enlace doble C=O del aldehído quita dos hidrógenos.'],
      ['carbonos', 'Los carbonos', x, 'Ese es el número de carbonos; se piden los hidrógenos.']
    ],
    enunciado: (_e, x) => `Un aldehído saturado de cadena abierta tiene ${x} ${x === 1 ? 'carbono' : 'carbonos'}, contando el del grupo –CHO.`,
    pregunta: '¿Cuántos hidrógenos tiene?',
    datos: (_e, x) => [['Carbonos', String(x)], ['Fórmula general', 'CₙH₂ₙO']],
    pasos: (_e, x, _y, rengR) => [`Un alcohol de ${x} carbonos tendría ${2 * x + 2} hidrógenos; el C=O quita dos.`, `H = 2 × ${x} = ${tx(rengR)}.`],
    pistas: ['Recuerda la fórmula CₙH₂ₙO.', 'El C=O quita dos hidrógenos.', 'Multiplica los carbonos por dos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s14-p2', titulo: 'Oxidación de un aldehído', unidad: 'g',
    objetivo: 'Calcular la masa de ácido carboxílico que se obtiene al oxidar un aldehído.', seccion: '20.3', para: 'la oxidación de los aldehídos', estructuras: true, nombres: true, masas: true,
    idealizado: 'Oxidación completa: el aldehído gana un átomo de oxígeno.', metodo: 'masa molar del ácido de igual número de carbonos construido con el motor de estructuras', lista: RENG_ALDEHIDOS_OR, x: [10, 300, 10],
    respuesta: ([, f], x) => (x / M(f)) * (M(f) + A('O')),
    errores: ([, f], x) => [
      ['dos-oxigenos', 'Dos oxígenos', (x / M(f)) * (M(f) + 2 * A('O')), 'Al pasar de –CHO a –COOH se gana un solo átomo de oxígeno.'],
      ['sin-moles', 'Sumando 16 a los gramos', x + A('O'), 'Sumaste la masa del oxígeno a los gramos: antes hay que pasar a moles.']
    ],
    enunciado: ([n, f], x) => `Se oxidan ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), hasta el ácido carboxílico con los mismos carbonos. La masa atómica del oxígeno es ${tx(A('O'), 5)}.`,
    pregunta: '¿Qué masa de ácido se obtiene, en gramos?',
    datos: ([, f], x) => [['Masa de aldehído', `${tx(x)} g`], ['Masa molar del aldehído', `${tx(M(f), 5)} g/mol`], ['Masa molar del ácido', `${tx(M(f) + A('O'), 5)} g/mol`]],
    pasos: ([, f], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol de aldehído y de ácido.`, `m = ${tx(x / M(f))} × ${tx(M(f) + A('O'), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de aldehído a moles.', 'El ácido tiene un oxígeno más.', 'Multiplica moles por masa molar.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s14-p3', titulo: 'Reducción de un aldehído', unidad: 'g',
    objetivo: 'Calcular el hidrógeno necesario para reducir un aldehído a su alcohol primario.', seccion: '20.3', para: 'la reducción de los aldehídos', estructuras: true, nombres: true, masas: true,
    idealizado: 'Reducción completa: R–CHO + H₂ → R–CH₂OH.', metodo: 'diferencia de masa entre el alcohol y el aldehído construidos con el motor de estructuras', lista: RENG_ALDEHIDOS_OR, x: [50, 1000, 50],
    respuesta: ([, f], x) => (x / M(f)) * rengMH2Or(),
    errores: ([, f], x) => [
      ['moles', 'Los moles de H₂', x / M(f), 'Esos son los moles de H₂; se pide la masa: multiplica por su masa molar.'],
      ['dos-h2', 'Dos H₂ por aldehído', (2 * x * rengMH2Or()) / M(f), 'El grupo C=O adiciona una sola molécula de H₂.']
    ],
    enunciado: ([n, f], x) => `Se reducen ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), con hidrógeno (${tx(rengMH2Or(), 4)} g/mol) hasta el alcohol primario: R–CHO + H₂ → R–CH₂OH.`,
    pregunta: '¿Qué masa de H₂ se consume, en gramos?',
    datos: ([, f], x) => [['Masa de aldehído', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['H₂ por molécula', '1']],
    pasos: ([, f], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol de aldehído y de H₂.`, `m(H₂) = ${tx(x / M(f))} × ${tx(rengMH2Or(), 4)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de aldehído a moles.', 'Cada C=O adiciona un H₂.', 'Pasa los moles de H₂ a gramos.']
  })
]

export const RENG_PRACTICAS_B12_S15: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s15-p1', titulo: 'Identificar una cetona por su masa molar', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número de carbonos de una cetona saturada a partir de su masa molar.', seccion: '20.3', para: 'las cetonas', estructuras: true, masas: true,
    idealizado: 'Cetona saturada de cadena abierta, CₙH₂ₙO.', metodo: 'búsqueda entre las cetonas construidas con el motor de estructuras', lista: UNO, x: [3, 18, 1],
    respuesta: (_e, x) => x,
    errores: (_e, x) => [
      ['sin-oxigeno', 'Sin restar el oxígeno', rengMCetonaOr(x) / rengMCh2Or(), 'Olvidaste restar la masa del oxígeno antes de dividir.'],
      ['entre-doce', 'Dividiendo entre 12', (rengMCetonaOr(x) - A('O')) / A('C'), 'Dividiste entre la masa del carbono; cada carbono de la fórmula lleva dos hidrógenos.']
    ],
    enunciado: (_e, x) => `Una cetona saturada de cadena abierta, de fórmula CₙH₂ₙO, tiene una masa molar de ${tx(rengMCetonaOr(x), 5)} g/mol. Masas: CH₂ ${tx(rengMCh2Or(), 5)} y O ${tx(A('O'), 5)}.`,
    pregunta: '¿Cuántos carbonos tiene?',
    datos: (_e, x) => [['Masa molar', `${tx(rengMCetonaOr(x), 5)} g/mol`], ['CH₂', `${tx(rengMCh2Or(), 5)} g/mol`], ['O', `${tx(A('O'), 5)} g/mol`]],
    pasos: (_e, x, _y, rengR) => [`${tx(rengMCetonaOr(x), 5)} − ${tx(A('O'), 5)} = ${tx(x * rengMCh2Or(), 5)}.`, `n = ${tx(x * rengMCh2Or(), 5)}/${tx(rengMCh2Or(), 5)} = ${tx(rengR)}.`],
    pistas: ['Resta la masa del oxígeno.', 'Lo que queda son grupos CH₂.', 'Divide entre la masa de un CH₂.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s15-p2', titulo: 'Cetona a partir de un alcohol secundario', unidad: 'g',
    objetivo: 'Calcular la masa de cetona que se obtiene al oxidar un alcohol secundario.', seccion: '20.3', para: 'la obtención de cetonas', estructuras: true, nombres: true, masas: true,
    idealizado: 'Oxidación completa: el alcohol pierde dos hidrógenos.', metodo: 'masas molares del alcohol y de la cetona construidos con el motor de estructuras', lista: RENG_CETONAS_OR, x: [10, 300, 10],
    respuesta: ([, f, , , fa], x) => (x / M(fa)) * M(f),
    errores: ([, f, , , fa], x) => [
      ['inverso', 'Cociente invertido', (x * M(fa)) / M(f), 'Invertiste las masas molares: divide entre la del alcohol y multiplica por la de la cetona.'],
      ['sin-moles', 'Restando 2 a los gramos', x - rengMH2Or(), 'Restaste la masa de dos hidrógenos a los gramos: antes hay que pasar a moles.']
    ],
    enunciado: ([n, f, , a, fa], x) => `Se oxidan ${tx(x)} g de ${a}, ${T(fa)} (${tx(M(fa), 5)} g/mol), un alcohol secundario, y se obtiene ${n}, ${T(f)} (${tx(M(f), 5)} g/mol).`,
    pregunta: '¿Qué masa de cetona se obtiene, en gramos?',
    datos: ([, f, , , fa], x) => [['Masa de alcohol', `${tx(x)} g`], ['Masa molar del alcohol', `${tx(M(fa), 5)} g/mol`], ['Masa molar de la cetona', `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f, , , fa], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(fa), 5)} = ${tx(x / M(fa))} mol de alcohol y de cetona.`, `m = ${tx(x / M(fa))} × ${tx(M(f), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de alcohol a moles.', 'La oxidación es mol a mol.', 'Multiplica por la masa de la cetona.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s15-p3', titulo: 'Combustión de una cetona', unidad: 'g',
    objetivo: 'Calcular la masa de CO₂ que produce la combustión completa de una cetona.', seccion: '20.3', para: 'las cetonas', estructuras: true, nombres: true, masas: true,
    idealizado: 'Combustión completa.', metodo: 'moles de carbono de la molécula construida con el motor de estructuras', lista: RENG_CETONAS_OR, x: [5, 200, 5],
    respuesta: ([, f], x) => (x / M(f)) * C(f) * rengMCo2Or(),
    errores: ([, f], x) => [
      ['uno-a-uno', 'Un CO₂ por molécula', (x / M(f)) * rengMCo2Or(), 'Cada carbono da un CO₂: multiplica por el número de carbonos.'],
      ['masa-carbono', 'La masa de carbono', (x * C(f) * A('C')) / M(f), 'Esa es la masa de carbono de la muestra; el CO₂ incorpora además oxígeno.']
    ],
    enunciado: ([n, f], x) => `Se queman por completo ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol). La masa molar del CO₂ es ${tx(rengMCo2Or(), 5)} g/mol.`,
    pregunta: '¿Qué masa de CO₂ se produce, en gramos?',
    datos: ([, f], x) => [['Masa', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['CO₂ por molécula', String(C(f))]],
    pasos: ([, f], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol, que dan ${tx((x / M(f)) * C(f))} mol de CO₂.`, `m(CO₂) = ${tx((x / M(f)) * C(f))} × ${tx(rengMCo2Or(), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos a moles.', 'Cada carbono da un CO₂.', 'Pasa los moles de CO₂ a gramos.']
  })
]

export const RENG_PRACTICAS_B12_S16: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s16-p1', titulo: 'Base para neutralizar un ácido carboxílico', unidad: 'g',
    objetivo: 'Calcular la masa de hidróxido de sodio que neutraliza una masa de ácido carboxílico.', seccion: '20.3', para: 'la acidez de los ácidos carboxílicos', estructuras: true, nombres: true, masas: true,
    idealizado: 'Neutralización completa: un NaOH por cada grupo –COOH.', metodo: 'recuento de grupos carboxilo de la molécula con el detector de grupos funcionales del núcleo', lista: RENG_ACIDOS_OR, x: [10, 300, 10],
    respuesta: ([, f, , k], x) => (x / M(f)) * k * M('NaOH'),
    errores: ([, f, , k], x) => [
      ['moles', 'Los moles de NaOH', (x / M(f)) * k, 'Esos son los moles de NaOH; se pide la masa: multiplica por su masa molar.'],
      ['agua', 'La masa de agua', (x / M(f)) * k * rengMAguaOr(), 'Esa es la masa de agua que se forma; se pide la de hidróxido de sodio.']
    ],
    enunciado: ([n, f, , k], x) => `Se neutralizan ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), que tiene ${k} ${k === 1 ? 'grupo –COOH' : 'grupos –COOH'}, con NaOH (${tx(M('NaOH'), 5)} g/mol).`,
    pregunta: '¿Qué masa de NaOH hace falta, en gramos?',
    datos: ([, f, , k], x) => [['Masa de ácido', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['Grupos –COOH', String(k)]],
    pasos: ([, f, , k], x, _y, rengR) => [`n(ácido) = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol; n(NaOH) = ${tx((x / M(f)) * k)} mol.`, `m(NaOH) = ${tx((x / M(f)) * k)} × ${tx(M('NaOH'), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de ácido a moles.', 'Un NaOH por cada grupo –COOH.', 'Pasa los moles de NaOH a gramos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s16-p2', titulo: 'Sal de un ácido carboxílico', unidad: 'g',
    objetivo: 'Calcular la masa de sal sódica que se forma al neutralizar un ácido carboxílico.', seccion: '20.3', para: 'las sales de los ácidos carboxílicos', estructuras: true, nombres: true, masas: true,
    idealizado: 'Neutralización completa de todos los grupos –COOH.', metodo: 'conservación de la masa: ácido más NaOH menos el agua formada', lista: RENG_ACIDOS_OR, x: [10, 300, 10],
    respuesta: ([, f, , k], x) => (x / M(f)) * (M(f) + k * (A('Na') - A('H'))),
    errores: ([, f, , k], x) => [
      ['con-naoh', 'Sin quitar el agua', (x / M(f)) * (M(f) + k * M('NaOH')), 'Sumaste todo el NaOH: hay que restar el agua que se forma en la neutralización.'],
      ['solo-acido', 'La masa de ácido', x, 'Diste la masa de ácido; la sal pesa más porque cada H se cambia por un Na.']
    ],
    enunciado: ([n, f, , k], x) => `Se neutralizan por completo ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), con NaOH. En cada uno de sus ${k === 1 ? 'un grupo' : `${k} grupos`} –COOH, el H (${tx(A('H'), 4)}) se cambia por Na (${tx(A('Na'), 5)}).`,
    pregunta: '¿Qué masa de sal sódica se forma, en gramos?',
    datos: ([, f, , k], x) => [['Masa de ácido', `${tx(x)} g`], ['Masa molar del ácido', `${tx(M(f), 5)} g/mol`], ['Masa molar de la sal', `${tx(M(f) + k * (A('Na') - A('H')), 5)} g/mol`]],
    pasos: ([, f, , k], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol de ácido y de sal.`, `m = ${tx(x / M(f))} × ${tx(M(f) + k * (A('Na') - A('H')), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de ácido a moles.', 'En la sal, cada H ácido es un Na.', 'Multiplica por la masa molar de la sal.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s16-p3', titulo: 'Valoración de un ácido carboxílico', unidad: 'mL',
    objetivo: 'Calcular el volumen de disolución de NaOH que neutraliza una masa de ácido carboxílico.', seccion: '20.3', para: 'la valoración de los ácidos carboxílicos', estructuras: true, nombres: true, masas: true,
    idealizado: 'Neutralización completa hasta el punto de equivalencia.', metodo: 'moles de grupos carboxilo de la molécula construida con el motor de estructuras', lista: RENG_ACIDOS_OR, x: [1, 20, 0.5], y: [0.1, 0.9, 0.1],
    respuesta: ([, f, , k], x, y) => ((x / M(f)) * k * 1000) / y,
    errores: ([, f, , k], x, y) => [
      ['litros', 'En litros', ((x / M(f)) * k) / y, 'Ese resultado está en litros; se pide en mililitros.'],
      ['multiplicar', 'Multiplicando por la concentración', (x / M(f)) * k * 1000 * y, 'Multiplicaste por la concentración; el volumen es moles entre concentración.']
    ],
    enunciado: ([n, f, , k], x, y) => `Se valoran ${tx(x)} g de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), con ${k} ${k === 1 ? 'grupo –COOH' : 'grupos –COOH'}, con una disolución de NaOH ${tx(y)} mol/L.`,
    pregunta: '¿Qué volumen de NaOH se gasta hasta la neutralización completa, en mL?',
    datos: ([, f, , k], x, y) => [['Masa de ácido', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['Grupos –COOH', String(k)], ['NaOH', `${tx(y)} mol/L`]],
    pasos: ([, f, , k], x, y, rengR) => [`n(NaOH) = ${tx(x)}/${tx(M(f), 5)} × ${k} = ${tx((x / M(f)) * k)} mol.`, `V = ${tx((x / M(f)) * k)}/${tx(y)} = ${tx(((x / M(f)) * k) / y)} L = ${tx(rengR)} mL.`],
    pistas: ['Halla los moles de grupos –COOH.', 'Esos son los moles de NaOH.', 'Divide entre la concentración.']
  })
]
