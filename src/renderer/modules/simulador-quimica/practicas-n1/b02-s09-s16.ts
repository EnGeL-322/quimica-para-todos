import { rengTx } from '../aprender/n1/gases/constantes'
import {
  RENG_BETA_AT, RENG_IONES_AT, RENG_ISOBAROS_AT, RENG_NA_AT, RENG_NUCLIDOS_AT, RENG_PARES_ISO_AT, RENG_TOL_AT_ENT, RENG_U_G_AT, rengIonAt, rengMediaIsoAt, rengNombreAt, rengNuclidoAt, rengPracticaAt,
  rengSimboloDeZAt, rengSupAt, rengZAt
} from './b02-comun'
import { rengAnNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const A = rengAnNo
const E = RENG_TOL_AT_ENT
const qTx = (rengQ: number): string => (rengQ > 0 ? `+${rengQ}` : String(rengQ))
const pct = (rengX: number): string => tx(rengX * 100, 5)
export const RENG_IONES_GAS_AT: ReadonlyArray<readonly [string, number]> = [
  ['Li', 1], ['Be', 2], ['N', -3], ['O', -2], ['F', -1], ['Na', 1], ['Mg', 2], ['Al', 3], ['P', -3], ['S', -2], ['Cl', -1], ['K', 1], ['Ca', 2], ['Se', -2], ['Br', -1], ['Rb', 1], ['Sr', 2], ['I', -1]
]
export const RENG_ELEMENTOS_UMA_AT: readonly string[] = ['H', 'C', 'N', 'O', 'Na', 'Mg', 'Al', 'S', 'Cl', 'K', 'Ca', 'Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Pb', 'U']
export const RENG_PARES_LIGEROS_AT = RENG_PARES_ISO_AT.filter((rengP) => ['Li', 'B', 'N', 'Cl'].includes(rengP.s))
export const rengGasDeIonAt = (rengS: string, rengQ: number): number => rengZAt(rengS) - rengQ
export const rengOtroGasAt = (rengS: string, rengQ: number): number => { const g = rengGasDeIonAt(rengS, rengQ); const lista = [2, 10, 18, 36, 54]; const i = lista.indexOf(g); return rengQ > 0 ? lista[i + 1]! : lista[Math.max(0, i - 1)]! }

export const RENG_PRACTICAS_B02_S09: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s9-p1', titulo: 'Número atómico de un ion', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número atómico de un ion a partir de sus electrones y su carga.', seccion: '2.3', para: 'el número atómico',
    idealizado: 'Iones monoatómicos.', metodo: 'escena «atomo» (búsqueda de Z)', sinVerificar: [], lista: RENG_IONES_AT,
    respuesta: ([s]) => rengZAt(s),
    errores: ([s, , q]) => [
      ['signo', 'Signo de la carga al revés', rengZAt(s) - 2 * q, 'Un catión ha perdido electrones: Z = electrones + carga, no electrones − carga.'],
      ['electrones', 'Los electrones', rengZAt(s) - q, 'Ese es el número de electrones; los protones no cambian al formar un ion.']
    ],
    enunciado: ([s, , q]) => `Un ion monoatómico de carga ${qTx(q)} tiene ${rengZAt(s) - q} electrones.`,
    pregunta: '¿Cuál es su número atómico?',
    datos: ([s, , q]) => [['Electrones', String(rengZAt(s) - q)], ['Carga', qTx(q)]],
    pasos: ([s, , q], _x, _y, rengR) => [`Z = e⁻ + q = ${rengZAt(s) - q} + (${q}).`, `Z = ${tx(rengR)}: es el ${rengNombreAt(s)}.`],
    pistas: ['Los protones no cambian.', 'Un catión perdió electrones.', 'Suma la carga a los electrones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s9-p2', titulo: 'Número atómico desde A y N', unidad: '', tolerancia: E,
    objetivo: 'Calcular el número atómico de un núclido a partir de su número másico y sus neutrones.', seccion: '2.3', para: 'el número atómico',
    idealizado: 'Núclidos indicados.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_NUCLIDOS_AT,
    respuesta: ([s]) => rengZAt(s),
    errores: ([s, a]) => [
      ['suma', 'Suma de A y N', 2 * a - rengZAt(s), 'Sumaste A y N; los protones son la diferencia A − N.'],
      ['neutrones', 'Los neutrones', a - rengZAt(s), 'Ese es el número de neutrones; Z es el de protones.']
    ],
    enunciado: ([s, a]) => `El núcleo de un átomo tiene ${a} nucleones, de los cuales ${a - rengZAt(s)} son neutrones.`,
    pregunta: '¿Cuál es su número atómico?',
    datos: ([s, a]) => [['A', String(a)], ['N', String(a - rengZAt(s))]],
    pasos: ([s, a], _x, _y, rengR) => [`Z = A − N = ${a} − ${a - rengZAt(s)}.`, `Z = ${tx(rengR)}: es el ${rengNombreAt(s)}.`],
    pistas: ['A es protones más neutrones.', 'Despeja el número de protones.', 'Busca el elemento por Z.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s9-p3', titulo: 'Número atómico desde el total de partículas', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número atómico de un átomo neutro conociendo el total de partículas y los neutrones.', seccion: '2.3', para: 'el número atómico',
    idealizado: 'Átomo neutro.', metodo: 'escena «atomo» (búsqueda de Z)', sinVerificar: [], lista: RENG_NUCLIDOS_AT,
    respuesta: ([s]) => rengZAt(s),
    errores: ([s, a]) => [
      ['sin-dividir', 'Sin dividir entre dos', a + rengZAt(s) - (a - rengZAt(s)), 'Al restar los neutrones quedan protones y electrones juntos: divide entre dos.'],
      ['mitad', 'Mitad del total', (a + rengZAt(s)) / 2, 'Dividiste el total entre dos sin restar antes los neutrones.']
    ],
    enunciado: ([s, a]) => `Un átomo neutro tiene en total ${a + rengZAt(s)} partículas (protones, neutrones y electrones), de las cuales ${a - rengZAt(s)} son neutrones.`,
    pregunta: '¿Cuál es su número atómico?',
    datos: ([s, a]) => [['Partículas', String(a + rengZAt(s))], ['Neutrones', String(a - rengZAt(s))]],
    pasos: ([s, a], _x, _y, rengR) => [`p + e = ${a + rengZAt(s)} − ${a - rengZAt(s)} = ${2 * rengZAt(s)}; en un átomo neutro p = e.`, `Z = ${tx(rengR)}.`],
    pistas: ['Resta los neutrones del total.', 'Quedan protones y electrones.', 'En un átomo neutro son iguales.']
  })
]

export const RENG_PRACTICAS_B02_S10: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s10-p1', titulo: 'Número másico de un núclido', unidad: '', tolerancia: E,
    objetivo: 'Calcular el número másico sumando protones y neutrones.', seccion: '2.3', para: 'el número másico',
    idealizado: 'Núclidos indicados.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_NUCLIDOS_AT,
    respuesta: ([, a]) => a,
    errores: ([s, a]) => [
      ['protones', 'Los protones', rengZAt(s), 'Ese es el número atómico; el másico suma protones y neutrones.'],
      ['neutrones', 'Los neutrones', a - rengZAt(s), 'Esos son solo los neutrones; súmales los protones.']
    ],
    enunciado: ([s, a]) => `Un átomo de ${rengNombreAt(s)} (Z = ${rengZAt(s)}) tiene ${a - rengZAt(s)} neutrones.`,
    pregunta: '¿Cuál es su número másico?',
    datos: ([s, a]) => [['Z', String(rengZAt(s))], ['N', String(a - rengZAt(s))]],
    pasos: ([s, a], _x, _y, rengR) => [`A = Z + N = ${rengZAt(s)} + ${a - rengZAt(s)}.`, `A = ${tx(rengR)}: es el ${rengNuclidoAt(s, a)}.`],
    pistas: ['Los protones son Z.', 'Suma los neutrones.', 'Los electrones no cuentan.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s10-p2', titulo: 'Número másico de un ion', unidad: '', tolerancia: E,
    objetivo: 'Calcular el número másico de un ion a partir de sus partículas, sin contar los electrones.', seccion: '2.3', para: 'el número másico',
    idealizado: 'Iones monoatómicos.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_IONES_AT,
    respuesta: ([, a]) => a,
    errores: ([s, a, q]) => [
      ['con-electrones', 'Con los electrones', a + rengZAt(s) - q, 'Sumaste también los electrones; el número másico solo cuenta los nucleones.'],
      ['electrones-por-protones', 'Electrones en lugar de protones', a - q, 'Usaste los electrones en lugar de los protones: en un ion no coinciden.']
    ],
    enunciado: ([s, a, q]) => `Un ion tiene ${rengZAt(s)} protones, ${a - rengZAt(s)} neutrones y ${rengZAt(s) - q} electrones.`,
    pregunta: '¿Cuál es su número másico?',
    datos: ([s, a, q]) => [['Protones', String(rengZAt(s))], ['Neutrones', String(a - rengZAt(s))], ['Electrones', String(rengZAt(s) - q)]],
    pasos: ([s, a, q], _x, _y, rengR) => [`A = p + n = ${rengZAt(s)} + ${a - rengZAt(s)}.`, `A = ${tx(rengR)}: es el ${rengIonAt(s, q)}.`],
    pistas: ['Cuenta solo el núcleo.', 'Suma protones y neutrones.', 'Ignora los electrones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s10-p3', titulo: 'Masa de unos átomos', unidad: 'mg',
    objetivo: 'Estimar la masa de un número de átomos tomando su masa como A unidades de masa atómica.', seccion: '2.3', para: 'el número másico', particulas: true,
    idealizado: 'Masa del átomo ≈ A u.', metodo: 'conversión con la unidad «u» del catálogo', lista: RENG_NUCLIDOS_AT, x: [1, 9, 1],
    respuesta: ([, a], x) => x * 1e20 * a * RENG_U_G_AT * 1000,
    errores: ([s, a], x) => [
      ['con-z', 'Con Z', x * 1e20 * rengZAt(s) * RENG_U_G_AT * 1000, 'Usaste Z; la masa del átomo depende de todos sus nucleones (A).'],
      ['gramos', 'En gramos', x * 1e20 * a * RENG_U_G_AT, 'Ese resultado está en gramos; la pregunta pide miligramos.']
    ],
    enunciado: ([s, a], x) => `Se tienen ${x}·10²⁰ átomos de ${rengNombreAt(s)}-${a}. Toma 1 u = 1,66054·10⁻²⁴ g.`,
    pregunta: '¿Qué masa tienen, en mg?',
    datos: ([s, a], x) => [['Núclido', rengNuclidoAt(s, a)], ['Átomos', `${x}·10²⁰`]],
    pasos: ([, a], x, _y, rengR) => [`Masa de un átomo ≈ ${a} u = ${tx(a * 0.166054, 4)}·10⁻²³ g.`, `m = ${x}·10²⁰ × masa = ${tx(rengR)} mg.`],
    pistas: ['La masa del átomo es unos A u.', 'Pasa las u a gramos.', 'Multiplica por los átomos.']
  })
]

export const RENG_PRACTICAS_B02_S11: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s11-p1', titulo: 'Neutrones de dos isótopos', unidad: '', tolerancia: E,
    objetivo: 'Calcular los neutrones del isótopo más pesado de un elemento.', seccion: '2.3', para: 'los isótopos', isotopos: true,
    idealizado: 'Isótopos indicados.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_PARES_ISO_AT,
    respuesta: (p) => p.a2 - rengZAt(p.s),
    errores: (p) => [
      ['ligero', 'El isótopo ligero', p.a1 - rengZAt(p.s), 'Esos son los neutrones del isótopo ligero; se pide el pesado.'],
      ['masico', 'El número másico', p.a2, 'Ese es el número másico; resta el número atómico.']
    ],
    enunciado: (p) => `El ${rengNombreAt(p.s)} natural tiene dos isótopos estables: ${rengNuclidoAt(p.s, p.a1)} y ${rengNuclidoAt(p.s, p.a2)}.`,
    pregunta: '¿Cuántos neutrones tiene el isótopo más pesado?',
    datos: (p) => [['Isótopos', `${rengNuclidoAt(p.s, p.a1)} y ${rengNuclidoAt(p.s, p.a2)}`], ['Z', String(rengZAt(p.s))]],
    pasos: (p, _x, _y, rengR) => [`Los dos tienen Z = ${rengZAt(p.s)}.`, `N = ${p.a2} − ${rengZAt(p.s)} = ${tx(rengR)}.`],
    pistas: ['Los isótopos comparten Z.', 'Elige el de mayor A.', 'Resta Z de su número másico.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s11-p2', titulo: 'Masa media de una mezcla de isótopos', unidad: 'u',
    objetivo: 'Calcular la masa media de una mezcla de dos isótopos ponderando por la fracción de átomos.', seccion: '2.3', para: 'los isótopos', isotopos: true,
    idealizado: 'Mezcla preparada de dos isótopos puros.', metodo: 'masa del isótopo ligero más el exceso ponderado', lista: RENG_PARES_ISO_AT, x: [5, 95, 1],
    respuesta: (p, x) => p.m1 * (x / 100) + p.m2 * (1 - x / 100),
    errores: (p, x) => [
      ['media-simple', 'Media simple', (p.m1 + p.m2) / 2, 'Hiciste la media simple; cada masa debe pesar según su fracción de átomos.'],
      ['intercambio', 'Fracciones intercambiadas', p.m1 * (1 - x / 100) + p.m2 * (x / 100), 'Asignaste la fracción del isótopo ligero al pesado y al revés.']
    ],
    enunciado: (p, x) => `Una mezcla contiene un ${x} % de átomos de ${rengNuclidoAt(p.s, p.a1)} (${tx(p.m1, 6)} u) y el resto de ${rengNuclidoAt(p.s, p.a2)} (${tx(p.m2, 6)} u).`,
    pregunta: '¿Cuál es la masa media de sus átomos, en u?',
    datos: (p, x) => [[rengNuclidoAt(p.s, p.a1), `${tx(p.m1, 6)} u; ${x} %`], [rengNuclidoAt(p.s, p.a2), `${tx(p.m2, 6)} u; ${100 - x} %`]],
    pasos: (p, x, _y, rengR) => [`M = ${tx(p.m1, 6)}·${tx(x / 100)} + ${tx(p.m2, 6)}·${tx(1 - x / 100)}.`, `M = ${tx(rengR, 5)} u.`],
    pistas: ['Pasa los porcentajes a fracciones.', 'Multiplica cada masa por su fracción.', 'Suma las dos contribuciones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s11-p3', titulo: 'Abundancia de un isótopo', unidad: '%',
    objetivo: 'Calcular la abundancia natural de un isótopo a partir de la masa atómica media y las masas isotópicas.', seccion: '2.3', para: 'los isótopos', isotopos: true,
    idealizado: 'Elemento con dos isótopos estables.', metodo: 'búsqueda por bisección de la abundancia', lista: RENG_PARES_ISO_AT,
    respuesta: (p) => p.x1 * 100,
    errores: (p) => [
      ['complemento', 'El otro isótopo', 100 - p.x1 * 100, `Esa es la abundancia del ${rengNuclidoAt(p.s, p.a2)}; se pide la del ${rengNuclidoAt(p.s, p.a1)}.`],
      ['numeros-masicos', 'Con los números másicos', ((p.a2 - rengMediaIsoAt(p)) / (p.a2 - p.a1)) * 100, 'Usaste los números másicos en lugar de las masas isotópicas: no son iguales.']
    ],
    enunciado: (p) => `La masa atómica del ${rengNombreAt(p.s)} es ${tx(rengMediaIsoAt(p), 7)} u. Sus isótopos son ${rengNuclidoAt(p.s, p.a1)} (${tx(p.m1, 7)} u) y ${rengNuclidoAt(p.s, p.a2)} (${tx(p.m2, 7)} u).`,
    pregunta: (p) => `¿Qué porcentaje de los átomos es ${rengNuclidoAt(p.s, p.a1)}?`,
    datos: (p) => [['Masa media', `${tx(rengMediaIsoAt(p), 7)} u`], ['Isótopos', `${tx(p.m1, 7)} u y ${tx(p.m2, 7)} u`]],
    pasos: (p, _x, _y, rengR) => [`M = m₁·x + m₂·(1 − x) → x = (m₂ − M)/(m₂ − m₁).`, `x = ${tx(rengR, 4)} %.`],
    pistas: ['Plantea la media ponderada.', 'Llama x a la fracción buscada.', 'Despeja x y pásala a %.']
  })
]

export const RENG_PRACTICAS_B02_S12: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s12-p1', titulo: 'Neutrones de un isóbaro', unidad: '', tolerancia: E,
    objetivo: 'Calcular los neutrones de un isóbaro de un núclido dado.', seccion: '2.3', para: 'los núclidos',
    idealizado: 'Núclidos indicados.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_ISOBAROS_AT,
    respuesta: ([, a, s2]) => a - rengZAt(s2),
    errores: ([s1, a]) => [
      ['n-original', 'Neutrones del primero', a - rengZAt(s1), 'Esos son los neutrones del primer núclido; el isóbaro tiene otro Z.'],
      ['masico', 'El número másico', a, 'Ese es el número másico común; resta el número atómico del isóbaro.']
    ],
    enunciado: ([s1, a, s2]) => `El ${rengNuclidoAt(s1, a)} y un núclido de ${rengNombreAt(s2)} (Z = ${rengZAt(s2)}) son isóbaros.`,
    pregunta: ([, , s2]) => `¿Cuántos neutrones tiene el núclido de ${rengNombreAt(s2)}?`,
    datos: ([s1, a, s2]) => [['Núclido', `${rengNuclidoAt(s1, a)} (Z = ${rengZAt(s1)})`], ['Isóbaro', `Z = ${rengZAt(s2)}`]],
    pasos: ([, a, s2], _x, _y, rengR) => [`Los isóbaros tienen el mismo A = ${a}.`, `N = ${a} − ${rengZAt(s2)} = ${tx(rengR)}.`],
    pistas: ['Los isóbaros comparten A.', 'Usa el Z del segundo.', 'Resta Z de A.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s12-p2', titulo: 'Producto de una desintegración beta', unidad: '', tolerancia: E,
    objetivo: 'Calcular los neutrones del isóbaro que se forma en una desintegración beta negativa.', seccion: '2.3', para: 'los núclidos',
    idealizado: 'Desintegración beta negativa: un neutrón se convierte en protón.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_BETA_AT,
    respuesta: ([s, a]) => a - rengZAt(s) - 1,
    errores: ([s, a]) => [
      ['sin-cambio', 'Sin cambio', a - rengZAt(s), 'Esos son los neutrones del núclido inicial; en la desintegración uno se convierte en protón.'],
      ['beta-mas', 'Neutrón ganado', a - rengZAt(s) + 1, 'En la beta negativa un neutrón se convierte en protón: los neutrones disminuyen.']
    ],
    enunciado: ([s, a]) => `El ${rengNuclidoAt(s, a)} (${rengNombreAt(s)}, Z = ${rengZAt(s)}) sufre una desintegración beta negativa y forma su isóbaro de Z = ${rengZAt(s) + 1}.`,
    pregunta: '¿Cuántos neutrones tiene el núcleo formado?',
    datos: ([s, a]) => [['Inicial', `${rengNuclidoAt(s, a)}, Z = ${rengZAt(s)}`], ['Producto', `Z = ${rengZAt(s) + 1}, mismo A`]],
    pasos: ([s, a], _x, _y, rengR) => [`El producto es ${rengNuclidoAt(rengSimboloDeZAt(rengZAt(s) + 1), a)} (mismo A).`, `N = ${a} − ${rengZAt(s) + 1} = ${tx(rengR)}.`],
    pistas: ['El número másico no cambia.', 'El Z aumenta en una unidad.', 'Calcula N = A − Z.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s12-p3', titulo: 'Protones de un isóbaro', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número atómico de un isóbaro a partir de sus neutrones.', seccion: '2.3', para: 'los núclidos',
    idealizado: 'Núclidos indicados.', metodo: 'escena «atomo» (búsqueda de Z)', sinVerificar: [], lista: RENG_ISOBAROS_AT,
    respuesta: ([, , s2]) => rengZAt(s2),
    errores: ([s1, a, s2]) => [
      ['al-reves', 'Diferencia al revés', 2 * rengZAt(s1) - rengZAt(s2), 'Aplicaste la diferencia de neutrones en el sentido contrario.'],
      ['masico', 'El número másico', a, 'Ese es el número másico común; resta los neutrones para obtener Z.']
    ],
    enunciado: ([s1, a, s2]) => `El ${rengNuclidoAt(s1, a)} (Z = ${rengZAt(s1)}) tiene un isóbaro con ${a - rengZAt(s2)} neutrones.`,
    pregunta: '¿Cuántos protones tiene ese isóbaro?',
    datos: ([s1, a, s2]) => [['Núclido', `${rengNuclidoAt(s1, a)}, Z = ${rengZAt(s1)}`], ['Neutrones del isóbaro', String(a - rengZAt(s2))]],
    pasos: ([, a, s2], _x, _y, rengR) => [`Mismo A = ${a}.`, `Z = ${a} − ${a - rengZAt(s2)} = ${tx(rengR)}: es el ${rengNombreAt(s2)}.`],
    pistas: ['Los isóbaros comparten A.', 'Resta los neutrones de A.', 'Identifica el elemento.']
  })
]

export const RENG_PRACTICAS_B02_S13: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s13-p1', titulo: 'Número másico de un isótono', unidad: '', tolerancia: E,
    objetivo: 'Calcular el número másico de un isótono de un núclido dado.', seccion: '2.3', para: 'los núclidos',
    idealizado: 'El isótono puede no ser estable.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_NUCLIDOS_AT, x: [1, 3, 1],
    respuesta: ([, a], x) => a + x,
    errores: ([, a], x) => [
      ['mismo-a', 'Mismo A', a, 'Mantuviste A; en los isótonos lo que se mantiene es N.'],
      ['resta', 'Restando', a - x, 'El isótono tiene más protones: su A aumenta, no disminuye.']
    ],
    enunciado: ([s, a], x) => `Un isótono del ${rengNuclidoAt(s, a)} (Z = ${rengZAt(s)}) tiene Z = ${rengZAt(s) + x} (${rengNombreAt(rengSimboloDeZAt(rengZAt(s) + x))}).`,
    pregunta: '¿Cuál es el número másico del isótono?',
    datos: ([s, a], x) => [['Núclido', `${rengNuclidoAt(s, a)}, Z = ${rengZAt(s)}`], ['Isótono', `Z = ${rengZAt(s) + x}`]],
    pasos: ([s, a], x, _y, rengR) => [`N = ${a} − ${rengZAt(s)} = ${a - rengZAt(s)} (se mantiene).`, `A = ${rengZAt(s) + x} + ${a - rengZAt(s)} = ${tx(rengR)}.`],
    pistas: ['Calcula los neutrones.', 'Los isótonos comparten N.', 'Suma el nuevo Z.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s13-p2', titulo: 'Protones de un isótono', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número atómico de un isótono conocido su número másico.', seccion: '2.3', para: 'los núclidos',
    idealizado: 'El isótono puede no ser estable.', metodo: 'escena «atomo» (búsqueda de Z)', sinVerificar: [], lista: RENG_NUCLIDOS_AT, x: [1, 3, 1],
    respuesta: ([s], x) => rengZAt(s) + x,
    errores: ([s, a], x) => [
      ['con-z', 'Con el Z original', a + x - rengZAt(s), 'Restaste el Z del primer núclido; resta los neutrones, que son los compartidos.'],
      ['neutrones', 'Los neutrones', a - rengZAt(s), 'Esos son los neutrones comunes; se piden los protones del isótono.']
    ],
    enunciado: ([s, a], x) => `El ${rengNuclidoAt(s, a)} (Z = ${rengZAt(s)}) tiene un isótono de número másico ${a + x}.`,
    pregunta: '¿Cuántos protones tiene el isótono?',
    datos: ([s, a], x) => [['Núclido', `${rengNuclidoAt(s, a)}, Z = ${rengZAt(s)}`], ['A del isótono', String(a + x)]],
    pasos: ([s, a], x, _y, rengR) => [`N común = ${a - rengZAt(s)}.`, `Z = ${a + x} − ${a - rengZAt(s)} = ${tx(rengR)}.`],
    pistas: ['Calcula N del primer núclido.', 'El isótono tiene el mismo N.', 'Resta N de su número másico.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s13-p3', titulo: 'Isótono e isóbaro a la vez', unidad: '', tolerancia: E,
    objetivo: 'Combinar las definiciones de isótono e isóbaro para identificar un núclido.', seccion: '2.3', para: 'los núclidos',
    idealizado: 'El núclido buscado puede no ser estable.', metodo: 'escena «atomo» (búsqueda de Z)', sinVerificar: [], lista: RENG_NUCLIDOS_AT, x: [1, 3, 1],
    respuesta: ([s], x) => rengZAt(s) + x,
    errores: ([s], x) => [
      ['isotopo', 'Como isótopo', rengZAt(s), 'Ese es el Z del primer núclido; el buscado es isótono, no isótopo.'],
      ['isobaro', 'Como isóbaro del primero', rengZAt(s) - x, 'El núclido buscado tiene más nucleones con los mismos neutrones: su Z aumenta.']
    ],
    enunciado: ([s, a], x) => `Un núclido Y es isótono del ${rengNuclidoAt(s, a)} (Z = ${rengZAt(s)}) e isóbaro de un núclido con A = ${a + x}.`,
    pregunta: '¿Cuál es el número atómico de Y?',
    datos: ([s, a], x) => [['Isótono de', `${rengNuclidoAt(s, a)}, Z = ${rengZAt(s)}`], ['Isóbaro de', `A = ${a + x}`]],
    pasos: ([s, a], x, _y, rengR) => [`Y tiene N = ${a - rengZAt(s)} y A = ${a + x}.`, `Z = ${a + x} − ${a - rengZAt(s)} = ${tx(rengR)}.`],
    pistas: ['Isótono: mismo N.', 'Isóbaro: mismo A.', 'Calcula Z = A − N.']
  })
]

export const RENG_PRACTICAS_B02_S14: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s14-p1', titulo: 'Carga de un ion', unidad: '', tolerancia: E,
    objetivo: 'Calcular la carga de un ion a partir de sus protones y electrones.', seccion: '2.3', para: 'los iones',
    idealizado: 'Iones monoatómicos.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_IONES_AT,
    respuesta: ([, , q]) => q,
    errores: ([s, , q]) => [
      ['signo', 'Signo al revés', -q, 'Signo al revés: si hay menos electrones que protones la carga es positiva.'],
      ['electrones', 'Los electrones', rengZAt(s) - q, 'Ese es el número de electrones; la carga es protones menos electrones.']
    ],
    enunciado: ([s, , q]) => `Un ion de ${rengNombreAt(s)} tiene ${rengZAt(s)} protones y ${rengZAt(s) - q} electrones.`,
    pregunta: '¿Cuál es su carga (con signo)?',
    datos: ([s, , q]) => [['Protones', String(rengZAt(s))], ['Electrones', String(rengZAt(s) - q)]],
    pasos: ([s, , q], _x, _y, rengR) => [`q = p − e = ${rengZAt(s)} − ${rengZAt(s) - q}.`, `q = ${qTx(rengR)}: ${rengIonAt(s, q)}.`],
    pistas: ['Cada protón aporta +1.', 'Cada electrón aporta −1.', 'Suma las cargas.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s14-p2', titulo: 'Ion con configuración de gas noble', unidad: '', tolerancia: E,
    objetivo: 'Predecir la carga del ion que forma un elemento representativo para igualar los electrones del gas noble más cercano.', seccion: '2.3', para: 'los iones',
    idealizado: 'Ion monoatómico más común del elemento.', metodo: 'configuración de la tabla de la app', sinVerificar: [], lista: RENG_IONES_GAS_AT,
    respuesta: ([, q]) => q,
    errores: ([s, q]) => [
      ['signo', 'Signo al revés', -q, q > 0 ? 'Los metales pierden electrones y quedan con carga positiva.' : 'Los no metales ganan electrones y quedan con carga negativa.'],
      ['otro-gas', 'Otro gas noble', rengZAt(s) - rengOtroGasAt(s, q), 'Ese ion tendría los electrones de un gas noble más lejano: cuesta demasiada energía.']
    ],
    enunciado: ([s]) => `El ${rengNombreAt(s)} (Z = ${rengZAt(s)}) forma un ion monoatómico con los mismos electrones que el gas noble más cercano.`,
    pregunta: '¿Qué carga tiene ese ion (con signo)?',
    datos: ([s]) => [['Elemento', `${s}, Z = ${rengZAt(s)}`], ['Gases nobles', 'He 2, Ne 10, Ar 18, Kr 36, Xe 54']],
    pasos: ([s, q], _x, _y, rengR) => [`Gas noble más cercano: ${rengGasDeIonAt(s, q)} electrones.`, `q = ${rengZAt(s)} − ${rengGasDeIonAt(s, q)} = ${qTx(rengR)}.`],
    pistas: ['Busca el gas noble más cercano.', 'Calcula los electrones que sobran o faltan.', 'La carga es Z − electrones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s14-p3', titulo: 'Carga de una cantidad de iones', unidad: 'C',
    objetivo: 'Calcular la carga eléctrica total de una cantidad de iones en milimoles.', seccion: '2.3', para: 'los iones', particulas: true,
    idealizado: 'Iones aislados (sin contraiones).', metodo: 'producto e·N_A calculado aparte', lista: RENG_IONES_AT, x: [0.5, 20, 0.5],
    respuesta: ([, , q], x) => x * 1e-3 * RENG_NA_AT * q * 1.602176634e-19,
    errores: ([, , q], x) => [
      ['sin-carga', 'Sin la carga del ion', Math.sign(q) * x * 1e-3 * RENG_NA_AT * 1.602176634e-19, 'Cada ion lleva una carga de varias veces e: multiplica por la carga del ion.'],
      ['sin-na', 'Sin N_A', x * 1e-3 * q * 1.602176634e-19, 'Multiplicaste los moles por e sin pasar a número de iones con N_A.']
    ],
    enunciado: ([s, a, q], x) => `Se tienen ${tx(x)} mmol de iones ${rengSupAt(a)}${rengIonAt(s, q)}.`,
    pregunta: '¿Qué carga eléctrica total llevan, en C (con signo)?',
    datos: ([s, , q], x) => [['Cantidad', `${tx(x)} mmol de ${rengIonAt(s, q)}`], ['Constantes', 'e = 1,602·10⁻¹⁹ C; N_A = 6,022·10²³ mol⁻¹']],
    pasos: ([, , q], x, _y, rengR) => [`Iones: ${tx(x)}·10⁻³ × N_A; carga de cada uno: ${q}e.`, `Q = ${tx(rengR)} C.`],
    pistas: ['Pasa los mmol a iones con N_A.', 'Multiplica por la carga de cada ion.', 'Conserva el signo de la carga.']
  })
]

export const RENG_PRACTICAS_B02_S15: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s15-p1', titulo: 'Masa atómica de dos isótopos', unidad: 'u',
    objetivo: 'Calcular la masa atómica de un elemento como media ponderada de sus dos isótopos naturales.', seccion: '2.3', para: 'las masas atómicas', isotopos: true,
    idealizado: 'Abundancias naturales típicas.', metodo: 'masa del isótopo ligero más el exceso ponderado', lista: RENG_PARES_ISO_AT,
    respuesta: (p) => rengMediaIsoAt(p),
    errores: (p) => [
      ['suma', 'Suma de masas', p.m1 + p.m2, 'Sumaste las masas sin ponderar; la masa atómica es una media ponderada.'],
      ['olvido', 'Una masa sin ponderar', p.m1 * p.x1 + p.m2, 'Olvidaste multiplicar la masa del segundo isótopo por su abundancia.']
    ],
    enunciado: (p) => `El ${rengNombreAt(p.s)} natural tiene un ${pct(p.x1)} % de ${rengNuclidoAt(p.s, p.a1)} (${tx(p.m1, 7)} u) y un ${pct(1 - p.x1)} % de ${rengNuclidoAt(p.s, p.a2)} (${tx(p.m2, 7)} u).`,
    pregunta: '¿Cuál es su masa atómica, en u?',
    datos: (p) => [[rengNuclidoAt(p.s, p.a1), `${tx(p.m1, 7)} u; ${pct(p.x1)} %`], [rengNuclidoAt(p.s, p.a2), `${tx(p.m2, 7)} u; ${pct(1 - p.x1)} %`]],
    pasos: (p, _x, _y, rengR) => [`M = ${tx(p.m1, 7)}·${tx(p.x1, 5)} + ${tx(p.m2, 7)}·${tx(1 - p.x1, 5)}.`, `M = ${tx(rengR, 6)} u.`],
    pistas: ['Pasa los porcentajes a fracciones.', 'Multiplica masa por abundancia.', 'Suma las contribuciones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s15-p2', titulo: 'Masa de un isótopo desconocido', unidad: 'u',
    objetivo: 'Despejar la masa de un isótopo a partir de la masa atómica media y los datos del otro isótopo.', seccion: '2.3', para: 'las masas atómicas', isotopos: true,
    idealizado: 'Abundancias naturales típicas.', metodo: 'búsqueda por bisección de la masa', lista: RENG_PARES_ISO_AT,
    respuesta: (p) => p.m2,
    errores: (p) => [
      ['sin-dividir', 'Sin dividir por la abundancia', rengMediaIsoAt(p) - p.m1 * p.x1, 'Falta dividir entre la abundancia del isótopo pesado.'],
      ['sin-restar', 'Sin restar el otro isótopo', rengMediaIsoAt(p) / (1 - p.x1), 'Olvidaste restar la contribución del isótopo conocido antes de dividir.']
    ],
    enunciado: (p) => `La masa atómica del ${rengNombreAt(p.s)} es ${tx(rengMediaIsoAt(p), 7)} u. Un ${pct(p.x1)} % de sus átomos es ${rengNuclidoAt(p.s, p.a1)} (${tx(p.m1, 7)} u) y el resto, ${rengNuclidoAt(p.s, p.a2)}.`,
    pregunta: (p) => `¿Qué masa tiene el ${rengNuclidoAt(p.s, p.a2)}, en u?`,
    datos: (p) => [['Masa media', `${tx(rengMediaIsoAt(p), 7)} u`], [rengNuclidoAt(p.s, p.a1), `${tx(p.m1, 7)} u; ${pct(p.x1)} %`]],
    pasos: (p, _x, _y, rengR) => [`m₂ = (M − m₁·x₁)/(1 − x₁).`, `m₂ = ${tx(rengR, 6)} u.`],
    pistas: ['Plantea la media ponderada.', 'Despeja la masa desconocida.', 'Comprueba que se acerca a A.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s15-p3', titulo: 'Masa de una muestra enriquecida', unidad: 'g',
    objetivo: 'Calcular la masa de una cantidad de un elemento cuya composición isotópica difiere de la natural.', seccion: '2.3', para: 'las masas atómicas', isotopos: true, masas: true,
    idealizado: 'Muestra preparada con dos isótopos puros.', metodo: 'masa media por otra vía multiplicada por los moles', lista: RENG_PARES_LIGEROS_AT, x: [5, 95, 1], y: [0.5, 5, 0.5],
    respuesta: (p, x, y) => y * (p.m1 * (x / 100) + p.m2 * (1 - x / 100)),
    errores: (p, _x, y) => [
      ['natural', 'Con la masa natural', y * A(p.s), 'Usaste la masa atómica natural; esta muestra tiene otra composición isotópica.'],
      ['media-simple', 'Media simple', (y * (p.m1 + p.m2)) / 2, 'Hiciste la media simple de las masas; pondera por la fracción de cada isótopo.']
    ],
    enunciado: (p, x, y) => `Una muestra de ${rengNombreAt(p.s)} enriquecida tiene un ${x} % de átomos de ${rengNuclidoAt(p.s, p.a1)} (${tx(p.m1, 6)} u) y el resto de ${rengNuclidoAt(p.s, p.a2)} (${tx(p.m2, 6)} u).`,
    pregunta: (_p, _x, y) => `¿Qué masa tienen ${tx(y)} mol de esa muestra, en g?`,
    datos: (p, x, y) => [['Composición', `${x} % de ${rengNuclidoAt(p.s, p.a1)}`], ['Cantidad', `${tx(y)} mol`]],
    pasos: (p, x, _y, rengR) => [`M = ${tx(p.m1 * (x / 100) + p.m2 * (1 - x / 100), 5)} g/mol.`, `m = n·M = ${tx(rengR)} g.`],
    pistas: ['Calcula la masa media de la muestra.', 'Exprésala en g/mol.', 'Multiplica por los moles.']
  })
]

export const RENG_PRACTICAS_B02_S16: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s16-p1', titulo: 'Masa de un átomo en gramos', unidad: '',
    objetivo: 'Pasar la masa atómica en u a gramos con el valor de la unidad de masa atómica.', seccion: '2.3', para: 'la unidad de masa atómica', particulas: true, masas: true,
    idealizado: 'Átomo de masa igual a la masa atómica media.', metodo: 'conversión con la unidad «u» del catálogo', lista: RENG_ELEMENTOS_UMA_AT,
    respuesta: (s) => A(s) * 0.166054,
    errores: (s) => [
      ['con-z', 'Con Z', rengZAt(s) * 0.166054, 'Usaste el número atómico; la masa del átomo es su masa atómica en u.'],
      ['dividir', 'Dividiendo', A(s) / 1.66054, 'Dividiste entre 1 u; hay que multiplicar la masa en u por 1,66054·10⁻²⁴ g.']
    ],
    enunciado: (s) => `La masa atómica del ${rengNombreAt(s)} es ${tx(A(s), 5)} u. Dato: 1 u = 1,66054·10⁻²⁴ g.`,
    pregunta: '¿Cuánto pesa un átomo, en múltiplos de 10⁻²³ g?',
    datos: (s) => [['Masa atómica', `${tx(A(s), 5)} u`], ['1 u', '1,66054·10⁻²⁴ g']],
    pasos: (s, _x, _y, rengR) => [`m = ${tx(A(s), 5)} × 1,66054·10⁻²⁴ g.`, `m = ${tx(rengR)}·10⁻²³ g.`],
    pistas: ['Multiplica la masa por 1 u.', 'Ajusta la potencia de diez.', 'Expresa el resultado en 10⁻²³ g.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s16-p2', titulo: 'Átomos en unos miligramos', unidad: '',
    objetivo: 'Calcular cuántos átomos hay en una masa pequeña de un elemento.', seccion: '2.3', para: 'la unidad de masa atómica', particulas: true, masas: true,
    idealizado: 'Elemento puro.', metodo: 'moles por N_A', lista: RENG_ELEMENTOS_UMA_AT, x: [1, 100, 1],
    respuesta: (s, x) => (x * 1e-3) / (A(s) * RENG_U_G_AT) / 1e19,
    errores: (s, x, _y, rengR) => [
      ['multiplicar', 'Multiplicando', x * 1e-3 * A(s) * RENG_U_G_AT, 'Multiplicaste la masa por la del átomo; hay que dividir la masa total entre la de un átomo.'],
      ['gramos', 'Sin pasar a gramos', rengR * 1000, 'No pasaste los miligramos a gramos: 1 mg = 10⁻³ g.']
    ],
    enunciado: (s, x) => `Se tienen ${x} mg de ${rengNombreAt(s)} (masa atómica ${tx(A(s), 5)} u; 1 u = 1,66054·10⁻²⁴ g).`,
    pregunta: '¿Cuántos átomos hay, en múltiplos de 10¹⁹?',
    datos: (s, x) => [['Masa', `${x} mg`], ['Masa atómica', `${tx(A(s), 5)} u`]],
    pasos: (s, x, _y, rengR) => [`Masa de un átomo: ${tx(A(s) * 0.166054, 4)}·10⁻²³ g.`, `N = ${x}·10⁻³ g / masa = ${tx(rengR)}·10¹⁹.`],
    pistas: ['Pasa los mg a g.', 'Calcula la masa de un átomo.', 'Divide la masa total entre ella.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s16-p3', titulo: 'Masa molar desde un átomo', unidad: 'g/mol',
    objetivo: 'Obtener la masa molar multiplicando la masa de un átomo por la constante de Avogadro.', seccion: '2.3', para: 'la unidad de masa atómica', particulas: true, masas: true,
    idealizado: 'Átomo de masa igual a la masa atómica media.', metodo: 'masa atómica de la tabla de la app', lista: RENG_ELEMENTOS_UMA_AT,
    respuesta: (s) => A(s) * RENG_U_G_AT * RENG_NA_AT,
    errores: (s, _x, _y, rengR) => [
      ['dividir', 'Dividiendo por N_A', (A(s) * RENG_U_G_AT) / RENG_NA_AT, 'Dividiste entre N_A; un mol contiene N_A átomos, así que hay que multiplicar.'],
      ['exponente', 'Exponente erróneo', rengR * 10, 'Revisa los exponentes: 10⁻²³ × 10²³ = 10⁰ = 1.']
    ],
    enunciado: (s) => `Un átomo de ${rengNombreAt(s)} pesa ${tx(A(s) * 0.166054, 6)}·10⁻²³ g.`,
    pregunta: '¿Cuál es la masa de un mol de esos átomos, en g/mol?',
    datos: (s) => [['Masa de un átomo', `${tx(A(s) * 0.166054, 6)}·10⁻²³ g`], ['N_A', '6,02214·10²³ mol⁻¹']],
    pasos: (s, _x, _y, rengR) => [`M = ${tx(A(s) * 0.166054, 6)}·10⁻²³ g × 6,02214·10²³ mol⁻¹.`, `M = ${tx(rengR, 5)} g/mol: coincide con la masa atómica en u.`],
    pistas: ['Un mol tiene N_A átomos.', 'Multiplica la masa por N_A.', 'Cancela las potencias de diez.']
  })
]

