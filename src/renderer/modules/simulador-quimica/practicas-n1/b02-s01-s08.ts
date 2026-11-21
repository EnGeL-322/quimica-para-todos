import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_ME_U, RENG_MN_U, RENG_MP_U } from '../escenas-n1/modelos/atomo'
import { RENG_CATIONES_AT, RENG_E_AT, RENG_H_AT, RENG_IONES_AT, RENG_ME_KG_AT, RENG_MEV_U_AT, RENG_NUCLIDOS_AT, rengIonAt, rengNombreAt, rengNuclidoAt, rengPracticaAt, rengSupAt, rengZAt } from './b02-comun'
import { rengAnNo, rengDeNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const A = rengAnNo
const UNO: readonly number[] = [0]
export const RENG_MASA_ATOMICA_AT = 'Masas de los átomos neutros de los núclidos (por ejemplo, ⁴He 4,002602 u o ⁵⁶Fe 55,934937 u): valores de tablas de masas atómicas recordados, no contrastados en esta entrega.'
export const rengRadioNucleoAt = (rengA: number): number => Number((1.2 * Math.cbrt(rengA)).toFixed(2))
export const RENG_MAQUETAS_AT: ReadonlyArray<readonly [string, number]> = [['una canica', 1.5], ['una pelota de ping-pong', 4], ['una pelota de tenis', 6.7], ['una naranja', 8], ['un balón de fútbol', 22], ['una pelota de playa', 40]]
export const RENG_COMPUESTOS_DALTON_AT: ReadonlyArray<readonly [string, string, string, string]> = [
  ['agua', 'H2O', 'O', 'H'], ['dióxido de carbono', 'CO2', 'C', 'O'], ['amoníaco', 'NH3', 'N', 'H'], ['metano', 'CH4', 'C', 'H'], ['dióxido de azufre', 'SO2', 'S', 'O'],
  ['trióxido de azufre', 'SO3', 'S', 'O'], ['óxido de hierro(III)', 'Fe2O3', 'Fe', 'O'], ['óxido de aluminio', 'Al2O3', 'Al', 'O'], ['monóxido de dinitrógeno', 'N2O', 'N', 'O'],
  ['pentóxido de difósforo', 'P2O5', 'P', 'O'], ['tetracloruro de carbono', 'CCl4', 'C', 'Cl'], ['sulfuro de hidrógeno', 'H2S', 'S', 'H'], ['cloruro de calcio', 'CaCl2', 'Ca', 'Cl'], ['dióxido de nitrógeno', 'NO2', 'N', 'O']
]
export const RENG_PARES_MULTIPLES_AT: ReadonlyArray<readonly [string, string, string]> = [
  ['C', 'CO', 'CO2'], ['N', 'NO', 'NO2'], ['S', 'SO2', 'SO3'], ['Fe', 'FeO', 'Fe2O3'], ['N', 'N2O', 'NO'], ['Cu', 'Cu2O', 'CuO'], ['Mn', 'MnO', 'MnO2'], ['Pb', 'PbO', 'PbO2'],
  ['Sn', 'SnO', 'SnO2'], ['Cr', 'CrO', 'Cr2O3'], ['P', 'P2O3', 'P2O5'], ['N', 'N2O3', 'N2O5']
]
export const RENG_ESPECIES_BOHR_AT: ReadonlyArray<readonly [string, number]> = [['el átomo de hidrógeno', 1], ['el ion He⁺', 2], ['el ion Li²⁺', 3]]
export const RENG_TIPOS_CAPA_AT: ReadonlyArray<readonly [string, (rengN: number) => number]> = [['orbitales', (rengN) => rengN * rengN], ['subniveles', (rengN) => rengN], ['electrones', (rengN) => 2 * rengN * rengN]]
export const RENG_ENLACE_AT: ReadonlyArray<readonly [string, number, number]> = [
  ['He', 4, 4.002602], ['Li', 7, 7.016003], ['Be', 9, 9.012183], ['B', 11, 11.009305], ['C', 12, 12], ['N', 14, 14.003074], ['O', 16, 15.994915], ['F', 19, 18.998403], ['Ne', 20, 19.99244],
  ['Na', 23, 22.989769], ['Mg', 24, 23.985042], ['Al', 27, 26.981538], ['Si', 28, 27.976927], ['P', 31, 30.973762], ['S', 32, 31.972071], ['Cl', 35, 34.968853], ['Ca', 40, 39.962591], ['Fe', 56, 55.934937], ['Ni', 58, 57.935343]
]
const oPorX = (rengF: string, rengX: string): number => rengDeNo(rengF, 'O') / rengDeNo(rengF, rengX)
export const rengEnlaceAt = (rengZ: number, rengA: number, rengM: number, rengConE = true): number => (rengZ * (RENG_MP_U + (rengConE ? RENG_ME_U : 0)) + (rengA - rengZ) * RENG_MN_U - rengM) * RENG_MEV_U_AT

export const RENG_PRACTICAS_B02_S01: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s1-p1', titulo: 'Átomo frente a núcleo', unidad: '',
    objetivo: 'Comparar con potencias de diez el diámetro de un átomo con el de su núcleo.', seccion: '2.2', para: 'el tamaño del núcleo',
    idealizado: 'Átomo y núcleo esféricos.', metodo: 'cociente de mantisas por la potencia de diez', lista: UNO, x: [1, 3.5, 0.1], y: [2, 15, 0.5],
    respuesta: (_e, x, y) => (x / y) * 100,
    errores: (_e, x, y) => [
      ['exponente', 'Potencia de diez errónea', (x / y) * 10, 'Al dividir 10⁻¹⁰ entre 10⁻¹⁵ se obtiene 10⁵, no 10⁴: revisa la resta de exponentes.'],
      ['inverso', 'Cociente invertido', (y / x) * 1e-8, 'Dividiste el núcleo entre el átomo; el átomo es el mayor y va en el numerador.']
    ],
    enunciado: (_e, x, y) => `Un átomo mide unos ${tx(x)}·10⁻¹⁰ m de diámetro y su núcleo unos ${tx(y)}·10⁻¹⁵ m.`,
    pregunta: '¿Cuántas veces mayor es el diámetro del átomo que el del núcleo? Da el resultado en miles de veces.',
    datos: (_e, x, y) => [['Átomo', `${tx(x)}·10⁻¹⁰ m`], ['Núcleo', `${tx(y)}·10⁻¹⁵ m`]],
    pasos: (_e, x, y, rengR) => [`Cociente: (${tx(x)}/${tx(y)})·10⁵ = ${tx((x / y) * 1e5)}.`, `En miles: ${tx(rengR)}.`],
    pistas: ['Divide las mantisas por separado.', 'Resta los exponentes de diez.', 'Pasa el resultado a miles.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s1-p2', titulo: 'Volumen del átomo y del núcleo', unidad: '',
    objetivo: 'Calcular cuántas veces cabe el volumen del núcleo en el del átomo usando el cubo de la razón de diámetros.', seccion: '2.2', para: 'el átomo como espacio casi vacío',
    idealizado: 'Átomo y núcleo esféricos.', metodo: 'volúmenes de esferas por separado', lista: UNO, x: [1, 3.5, 0.1], y: [2, 15, 0.5],
    respuesta: (_e, x, y) => (x / y) ** 3 * 1000,
    errores: (_e, x, y) => [
      ['sin-cubo', 'Sin elevar al cubo', (x / y) * 1e-7, 'El volumen va con el cubo del diámetro: eleva el cociente de diámetros al cubo.'],
      ['exponente', 'Exponente del cubo', (x / y) ** 3 * 1e4, 'Al elevar 10⁵ al cubo se obtiene 10¹⁵: se multiplica el exponente por tres.']
    ],
    enunciado: (_e, x, y) => `El diámetro de un átomo es ${tx(x)}·10⁻¹⁰ m y el de su núcleo, ${tx(y)}·10⁻¹⁵ m.`,
    pregunta: '¿Cuántas veces mayor es el volumen del átomo que el del núcleo, en múltiplos de 10¹²?',
    datos: (_e, x, y) => [['Diámetro del átomo', `${tx(x)}·10⁻¹⁰ m`], ['Diámetro del núcleo', `${tx(y)}·10⁻¹⁵ m`]],
    pasos: (_e, x, y, rengR) => [`Razón de diámetros: ${tx((x / y) * 1e5)}.`, `Razón de volúmenes: (razón)³ = ${tx(rengR)}·10¹².`],
    pistas: ['Calcula la razón de diámetros.', 'Eleva esa razón al cubo.', 'Expresa el resultado en 10¹².']
  }),
  rengPracticaAt({
    id: 'n1-b2-s1-p3', titulo: 'Maqueta a escala de un átomo', unidad: 'm',
    objetivo: 'Usar la razón de tamaños entre átomo y núcleo para construir una maqueta a escala.', seccion: '2.2', para: 'el tamaño relativo del núcleo',
    idealizado: 'Proporciones de un átomo esférico.', metodo: 'regla de tres con la escala', lista: RENG_MAQUETAS_AT, x: [1, 3.5, 0.1], y: [2, 15, 0.5],
    respuesta: ([, d], x, y) => (((x / y) * 1e5) * d) / 100,
    errores: ([, d], x, y, rengR) => [
      ['exponente', 'Potencia de diez errónea', rengR / 10, 'La razón de diámetros es del orden de 10⁵ (10⁻¹⁰ entre 10⁻¹⁵), no de 10⁴.'],
      ['inverso', 'Escala invertida', (d * y) / (x * 1e5) / 100, 'Dividiste el tamaño de la maqueta entre la razón; el átomo es mucho mayor que el núcleo.']
    ],
    enunciado: ([n, d], x, y) => `En una maqueta, el núcleo es ${n} de ${tx(d)} cm. El átomo real mide ${tx(x)}·10⁻¹⁰ m y su núcleo ${tx(y)}·10⁻¹⁵ m.`,
    pregunta: '¿Qué diámetro tendría el átomo en la maqueta, en metros?',
    datos: ([, d], x, y) => [['Núcleo en la maqueta', `${tx(d)} cm`], ['Razón real', `${tx(x)}·10⁻¹⁰ m / ${tx(y)}·10⁻¹⁵ m`]],
    pasos: ([, d], x, y, rengR) => [`Razón átomo/núcleo: ${tx((x / y) * 1e5)}.`, `Diámetro: ${tx(d)} cm × razón = ${tx(rengR)} m.`],
    pistas: ['Calcula la razón átomo/núcleo.', 'Multiplica por el núcleo de la maqueta.', 'Pasa los centímetros a metros.']
  })
]

export const RENG_PRACTICAS_B02_S02: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s2-p1', titulo: 'Átomos que se combinan', unidad: '',
    objetivo: 'Aplicar la proporción atómica fija de un compuesto para relacionar números de átomos.', seccion: '2.1', para: 'la teoría atómica de Dalton',
    idealizado: 'Compuesto de proporción fija.', metodo: 'subíndices del analizador de fórmulas', sinVerificar: [], lista: RENG_COMPUESTOS_DALTON_AT, x: [1, 9, 0.5],
    respuesta: ([, f, a, b], x) => (x * rengDeNo(f, b)) / rengDeNo(f, a),
    errores: ([, f, a, b], x) => [
      ['inversa', 'Proporción invertida', (x * rengDeNo(f, a)) / rengDeNo(f, b), `Invertiste la proporción: en ${T(f)} hay ${rengDeNo(f, b)} átomos de ${b} por cada ${rengDeNo(f, a)} de ${a}.`],
      ['uno-a-uno', 'Uno a uno', x, 'Los átomos no se combinan siempre uno a uno: usa los subíndices de la fórmula.']
    ],
    enunciado: ([n, f, a], x) => `En una muestra de ${n} (${T(f)}) hay ${tx(x)}·10²³ átomos de ${a}.`, pregunta: ([, , , b]) => `¿Cuántos átomos de ${b} hay, en múltiplos de 10²³?`,
    datos: ([, f, a], x) => [['Fórmula', T(f)], [`Átomos de ${a}`, `${tx(x)}·10²³`]],
    pasos: ([, f, a, b], _x, _y, rengR) => [`Proporción ${b} : ${a} = ${rengDeNo(f, b)} : ${rengDeNo(f, a)}.`, `${b} = ${tx(rengR)}·10²³ átomos.`],
    pistas: ['Lee los subíndices de la fórmula.', 'Plantea la proporción entre átomos.', 'Multiplica por los átomos dados.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s2-p2', titulo: 'Masas en proporción fija', unidad: 'g',
    objetivo: 'Calcular la masa de un elemento que se combina con otra masa dada según la fórmula y las masas atómicas.', seccion: '2.1', para: 'la ley de las proporciones definidas', masas: true,
    idealizado: 'Compuesto puro de proporción fija.', metodo: 'masa molar del núcleo', sinVerificar: [], lista: RENG_COMPUESTOS_DALTON_AT, x: [1, 100, 0.5],
    respuesta: ([, f, a, b], x) => (x * rengDeNo(f, b) * A(b)) / (rengDeNo(f, a) * A(a)),
    errores: ([, f, a, b], x) => [
      ['sin-subindice', 'Sin subíndices', (x * A(b)) / A(a), `Faltan los subíndices: en ${T(f)} la proporción es ${rengDeNo(f, b)} de ${b} por ${rengDeNo(f, a)} de ${a}.`],
      ['inversa', 'Proporción de masas invertida', (x * rengDeNo(f, a) * A(a)) / (rengDeNo(f, b) * A(b)), 'Invertiste la razón de masas: la masa buscada va en el numerador.']
    ],
    enunciado: ([n, f, a], x) => `Se forma ${n} (${T(f)}) a partir de ${tx(x)} g de ${a}.`, pregunta: ([, , , b]) => `¿Qué masa de ${b} se combina con ella, en g?`,
    datos: ([, f, a, b], x) => [[`Masa de ${a}`, `${tx(x)} g`], ['Masas atómicas', `${a} ${tx(A(a), 4)}; ${b} ${tx(A(b), 4)}`], ['Fórmula', T(f)]],
    pasos: ([, f, a, b], _x, _y, rengR) => [`Razón de masas ${b}/${a} = ${rengDeNo(f, b)}·${tx(A(b), 4)} / (${rengDeNo(f, a)}·${tx(A(a), 4)}).`, `m(${b}) = ${tx(rengR)} g.`],
    pistas: ['Escribe la razón de átomos.', 'Multiplica por las masas atómicas.', 'Aplica la razón a la masa dada.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s2-p3', titulo: 'Proporciones múltiples', unidad: '',
    objetivo: 'Comprobar la ley de las proporciones múltiples comparando las masas de oxígeno que se combinan con una misma masa de otro elemento.', seccion: '2.1', para: 'la ley de las proporciones múltiples', masas: true,
    idealizado: 'Óxidos puros de proporción fija.', metodo: 'recuento de átomos con el analizador de fórmulas', sinVerificar: [], lista: RENG_PARES_MULTIPLES_AT, x: [1, 50, 1],
    respuesta: ([el, f1, f2]) => oPorX(f2, el) / oPorX(f1, el),
    errores: ([el, f1, f2], _x, _y, rengR) => [
      ['inversa', 'Cociente invertido', 1 / rengR, `Dividiste al revés: se pide la masa de O en ${T(f2)} entre la de ${T(f1)}.`],
      ['resta', 'Diferencia de átomos', oPorX(f2, el) - oPorX(f1, el), 'Restaste los oxígenos por átomo; la ley compara las masas mediante un cociente.']
    ],
    enunciado: ([el, f1, f2], x) => { const k = (x * A('O')) / A(el); return `Con ${tx(x)} g de ${el}, el ${T(f1)} contiene ${tx(k * oPorX(f1, el), 4)} g de O y el ${T(f2)} contiene ${tx(k * oPorX(f2, el), 4)} g de O.` },
    pregunta: ([, f1, f2]) => `¿Cuál es la razón entre la masa de O del ${T(f2)} y la del ${T(f1)}?`,
    datos: ([el, f1, f2], x) => { const k = (x * A('O')) / A(el); return [[`O en ${T(f1)}`, `${tx(k * oPorX(f1, el), 4)} g`], [`O en ${T(f2)}`, `${tx(k * oPorX(f2, el), 4)} g`]] },
    pasos: (_e, _x, _y, rengR) => ['Las masas de O corresponden a la misma masa del otro elemento.', `Razón = ${tx(rengR)}: un cociente de números enteros sencillos.`],
    pistas: ['Divide las dos masas de oxígeno.', 'Busca una fracción sencilla.', 'Compara con los subíndices.']
  })
]

export const RENG_PRACTICAS_B02_S03: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s3-p1', titulo: 'Electrones de una gota de aceite', unidad: '', tolerancia: { rel: 0.001, abs: 0.02 },
    objetivo: 'Calcular cuántos electrones de más tiene una gota cargada dividiendo su carga entre la carga elemental.', seccion: '2.2', para: 'la carga del electrón', particulas: true,
    idealizado: 'Carga medida sin error.', metodo: 'conversión con la unidad de carga del catálogo', sinVerificar: [], lista: UNO, x: [2, 40, 1],
    respuesta: (_e, x) => x,
    errores: (_e, x) => [
      ['mantisa', 'La mantisa de la carga', x * RENG_E_AT * 1e19, 'Ese número es la carga en 10⁻¹⁹ C; divídela entre la carga del electrón.'],
      ['inverso', 'Cociente invertido', 1 / x, 'Dividiste la carga del electrón entre la de la gota; debe ser al revés.']
    ],
    enunciado: (_e, x) => `En un experimento como el de Millikan, una gota de aceite tiene una carga de −${tx(x * RENG_E_AT * 1e19, 5)}·10⁻¹⁹ C.`,
    pregunta: '¿Cuántos electrones de más tiene la gota?',
    datos: (_e, x) => [['Carga de la gota', `−${tx(x * RENG_E_AT * 1e19, 5)}·10⁻¹⁹ C`], ['Carga del electrón', '−1,602·10⁻¹⁹ C']],
    pasos: (_e, x, _y, rengR) => [`n = q/e = ${tx(x * RENG_E_AT * 1e19, 5)} / 1,602.`, `n = ${tx(rengR)} electrones: la carga está cuantizada.`],
    pistas: ['Divide la carga entre e.', 'Las potencias de diez se cancelan.', 'El resultado debe ser entero.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s3-p2', titulo: 'Electrones en una carga total', unidad: '',
    objetivo: 'Calcular el número de electrones que transportan una carga dada en milicolombios.', seccion: '2.2', para: 'la carga del electrón', particulas: true,
    idealizado: 'Carga transportada solo por electrones.', metodo: 'conversión con la unidad de carga del catálogo', sinVerificar: [], lista: UNO, x: [0.5, 50, 0.5],
    respuesta: (_e, x) => (x * 1e-3) / RENG_E_AT / 1e15,
    errores: (_e, x) => [
      ['producto', 'Multiplicar por e', x * 1e-3 * RENG_E_AT * 1e15, 'Multiplicaste por la carga del electrón; hay que dividir la carga total entre e.'],
      ['milis', 'Sin pasar a culombios', x / RENG_E_AT / 1e15, 'No pasaste los milicolombios a culombios: 1 mC = 10⁻³ C.']
    ],
    enunciado: (_e, x) => `Por un tubo de rayos catódicos pasa una carga total de ${tx(x)} mC, transportada por electrones.`,
    pregunta: '¿Cuántos electrones han pasado, en múltiplos de 10¹⁵?',
    datos: (_e, x) => [['Carga total', `${tx(x)} mC`], ['Carga del electrón', '1,602·10⁻¹⁹ C']],
    pasos: (_e, x, _y, rengR) => [`Q = ${tx(x)}·10⁻³ C.`, `n = Q/e = ${tx(rengR)}·10¹⁵ electrones.`],
    pistas: ['Pasa la carga a culombios.', 'Divide entre la carga elemental.', 'Expresa el resultado en 10¹⁵.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s3-p3', titulo: 'Relación carga-masa de un ion', unidad: '',
    objetivo: 'Comparar la relación carga/masa del electrón con la de un catión, como hizo Thomson con los rayos canales.', seccion: '2.2', para: 'la relación carga-masa', particulas: true,
    idealizado: 'La masa del ion se toma como A unidades de masa atómica.', metodo: 'masas en kilogramos por separado', lista: RENG_CATIONES_AT,
    respuesta: ([, a, q]) => a / (q * RENG_ME_U) / 1000,
    errores: ([, a, q]) => [
      ['sin-carga', 'Sin la carga del ion', a / RENG_ME_U / 1000, `El ion tiene carga ${q}e: su relación carga/masa es ${q}e/m, no e/m.`],
      ['inverso', 'Cociente invertido', (q * RENG_ME_U * 1000) / a, 'Dividiste al revés: la relación del electrón es la mayor y va en el numerador.']
    ],
    enunciado: ([s, a, q]) => `El ion ${rengIonAt(s, q)} tiene una masa de unas ${a} u; el electrón, 0,00054858 u.`,
    pregunta: '¿Cuántas veces mayor es la relación carga/masa del electrón que la del ion? Da el resultado en miles.',
    datos: ([s, a, q]) => [['Ion', `${rengIonAt(s, q)}, ${a} u`], ['Electrón', '0,00054858 u, carga −1']],
    pasos: ([, a, q], _x, _y, rengR) => [`(e/mₑ) / (${q}e/m) = m / (${q}·mₑ) = ${a} / (${q} × 0,00054858).`, `= ${tx(rengR)} miles de veces.`],
    pistas: ['Escribe las dos relaciones carga/masa.', 'Divide una entre otra.', 'Incluye la carga del ion.']
  })
]

export const RENG_PRACTICAS_B02_S04: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s4-p1', titulo: 'Capas de átomos en una lámina', unidad: '',
    objetivo: 'Estimar cuántas capas de átomos atraviesa una partícula alfa en una lámina de oro.', seccion: '2.2', para: 'el experimento de Rutherford',
    idealizado: 'Átomos de oro alineados de 0,288 nm de diámetro.', metodo: 'conversión de unidades del catálogo', lista: UNO, x: [0.2, 2, 0.05],
    respuesta: (_e, x) => (x * 1e-6) / 0.288e-9 / 1000,
    errores: (_e, _x, _y, rengR) => [
      ['radio', 'Con el radio', 2 * rengR, 'Usaste el radio del átomo (0,144 nm); cada capa mide un diámetro.'],
      ['exponente', 'Paso de µm a nm', rengR / 1000, 'Revisa el paso de micrómetros a nanómetros: 1 µm = 1000 nm.']
    ],
    enunciado: (_e, x) => `La lámina de oro del experimento de Rutherford tiene un espesor de ${tx(x)} µm; cada átomo de oro mide unos 0,288 nm de diámetro.`,
    pregunta: '¿Cuántas capas de átomos tiene la lámina, en miles?',
    datos: (_e, x) => [['Espesor', `${tx(x)} µm`], ['Diámetro atómico', '0,288 nm']],
    pasos: (_e, x, _y, rengR) => [`Espesor: ${tx(x * 1000)} nm.`, `Capas = espesor / diámetro = ${tx(rengR)} miles.`],
    pistas: ['Pasa el espesor a nanómetros.', 'Divide entre el diámetro atómico.', 'Expresa el resultado en miles.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s4-p2', titulo: 'Sección eficaz del núcleo', unidad: '',
    objetivo: 'Calcular qué fracción de la sección de un átomo ocupa su núcleo, para explicar por qué casi todas las partículas pasan.', seccion: '2.2', para: 'el experimento de Rutherford',
    idealizado: 'Núcleo y átomo vistos como círculos.', metodo: 'áreas de los dos círculos por separado', lista: UNO, x: [3, 8, 0.1], y: [50, 200, 5],
    respuesta: (_e, x, y) => (x / y) ** 2 * 1000,
    errores: (_e, x, y) => [
      ['sin-cuadrado', 'Sin elevar al cuadrado', (x / y) * 1e6, 'La fracción del área va con el cuadrado del radio, no con el radio.'],
      ['cubo', 'Con el cubo', (x / y) ** 3, 'Usaste el cubo (volumen); la partícula ve la sección del núcleo, que va con el cuadrado.']
    ],
    enunciado: (_e, x, y) => `Un núcleo tiene un radio de ${tx(x)} fm y su átomo, de ${tx(y)} pm.`,
    pregunta: '¿Qué fracción del área del átomo ocupa el núcleo, en múltiplos de 10⁻⁹?',
    datos: (_e, x, y) => [['Radio del núcleo', `${tx(x)} fm = ${tx(x)}·10⁻¹⁵ m`], ['Radio del átomo', `${tx(y)} pm = ${tx(y)}·10⁻¹² m`]],
    pasos: (_e, x, y, rengR) => [`Razón de radios: ${tx(x / y)}·10⁻³.`, `Fracción de área = (razón)² = ${tx(rengR)}·10⁻⁹.`],
    pistas: ['Pasa los dos radios a metros.', 'Divide los radios.', 'Eleva la razón al cuadrado.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s4-p3', titulo: 'Densidad de un núcleo', unidad: '',
    objetivo: 'Calcular la densidad de un núcleo con su masa y su radio y compararla con la de la materia ordinaria.', seccion: '2.2', para: 'el núcleo atómico', particulas: true,
    idealizado: 'Núcleo esférico de masa A u y radio 1,2·A^(1/3) fm.', metodo: 'búsqueda por bisección de la densidad', lista: RENG_NUCLIDOS_AT,
    respuesta: ([, a]) => (a * 1.66054e-27) / ((4 / 3) * Math.PI * (rengRadioNucleoAt(a) * 1e-15) ** 3) / 1e17,
    errores: (_e, _x, _y, rengR) => [
      ['mitad', 'Radio a la mitad', rengR * 8, 'Usaste la mitad del radio: el volumen de la esfera es (4/3)·π·r³ con el radio completo.'],
      ['sin-pi', 'Sin (4/3)·π', rengR * ((4 / 3) * Math.PI), 'Falta el factor (4/3)·π del volumen de la esfera: dividiste solo entre r³.']
    ],
    enunciado: ([s, a]) => `El núcleo de ${rengNombreAt(s)}-${a} tiene una masa de unas ${a} u (1 u = 1,66054·10⁻²⁷ kg) y un radio de ${tx(rengRadioNucleoAt(a), 3)} fm.`,
    pregunta: '¿Cuál es su densidad, en múltiplos de 10¹⁷ kg/m³?',
    datos: ([s, a]) => [['Núcleo', rengNuclidoAt(s, a)], ['Radio', `${tx(rengRadioNucleoAt(a), 3)} fm`], ['Masa', `${a} u`]],
    pasos: ([, a], _x, _y, rengR) => [`m = ${a} × 1,66054·10⁻²⁷ kg; V = (4/3)·π·r³.`, `ρ = m/V = ${tx(rengR)}·10¹⁷ kg/m³: unas 10¹⁴ veces la del agua.`],
    pistas: ['Pasa la masa a kilogramos.', 'Calcula el volumen de la esfera.', 'Divide masa entre volumen.']
  })
]

export const RENG_PRACTICAS_B02_S05: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s5-p1', titulo: 'Energía de ionización desde un nivel', unidad: 'eV',
    objetivo: 'Calcular la energía necesaria para arrancar el electrón desde un nivel en especies de un solo electrón.', seccion: '6.2', para: 'el modelo de Bohr', particulas: true,
    idealizado: 'Especie de un solo electrón (modelo de Bohr).', metodo: 'escena «espectro-hidrogeno» escalada por Z²', lista: RENG_ESPECIES_BOHR_AT, x: [1, 6, 1],
    respuesta: ([, z], x) => (13.6 * z * z) / (x * x),
    errores: ([, z], x, _y, rengR) => [
      ['sin-cuadrado', 'Con 1/n', (13.6 * z * z) / x, 'La energía del nivel depende de 1/n², no de 1/n.'],
      ['negativo', 'Signo negativo', -rengR, 'La energía del nivel es negativa, pero la que hay que aportar para arrancar el electrón es positiva.']
    ],
    enunciado: ([n, z], x) => `En ${n} (Z = ${z}), los niveles valen E = −13,6·Z²/n² eV. El electrón está en el nivel n = ${x}.`,
    pregunta: '¿Qué energía hay que aportar para arrancarlo, en eV?',
    datos: ([, z], x) => [['Z', String(z)], ['Nivel', `n = ${x}`]],
    pasos: ([, z], x, _y, rengR) => [`Eₙ = −13,6 × ${z * z} / ${x * x} eV.`, `Energía de ionización = −Eₙ = ${tx(rengR)} eV.`],
    pistas: ['Calcula la energía del nivel.', 'Usa Z² y n² en la fórmula.', 'Cambia el signo al final.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s5-p2', titulo: 'Energía de un salto del hidrógeno', unidad: 'eV',
    objetivo: 'Calcular la energía del fotón emitido cuando el electrón del hidrógeno baja de nivel.', seccion: '6.2', para: 'el modelo de Bohr', particulas: true,
    idealizado: 'Hidrógeno de Bohr.', metodo: 'escena «espectro-hidrogeno»', lista: UNO, x: [2, 8, 1], y: [1, 7, 1], valida: (_e, x, y) => y < x,
    respuesta: (_e, x, y) => 13.6 * (1 / (y * y) - 1 / (x * x)),
    errores: (_e, x, y) => [
      ['suma', 'Suma de inversos', 13.6 * (1 / (y * y) + 1 / (x * x)), 'Sumaste las energías; la del fotón es la diferencia entre los dos niveles.'],
      ['sin-cuadrado', 'Con 1/n', 13.6 * (1 / y - 1 / x), 'Los niveles van con 1/n²: eleva los números de nivel al cuadrado.']
    ],
    enunciado: (_e, x, y) => `El electrón de un átomo de hidrógeno salta del nivel n = ${x} al nivel n = ${y}.`,
    pregunta: '¿Qué energía tiene el fotón emitido, en eV?',
    datos: (_e, x, y) => [['Nivel inicial', `n = ${x}`], ['Nivel final', `n = ${y}`], ['Niveles', 'Eₙ = −13,6/n² eV']],
    pasos: (_e, x, y, rengR) => [`ΔE = 13,6·(1/${y * y} − 1/${x * x}) eV.`, `ΔE = ${tx(rengR)} eV.`],
    pistas: ['Calcula las dos energías.', 'Resta la final de la inicial.', 'La energía del fotón es positiva.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s5-p3', titulo: 'Energía de un mol de fotones', unidad: 'kJ/mol',
    objetivo: 'Pasar la energía de un salto del hidrógeno a kilojulios por mol de fotones.', seccion: '6.2', para: 'el modelo de Bohr', particulas: true,
    idealizado: 'Hidrógeno de Bohr.', metodo: 'conversión de eV a J del catálogo de unidades', lista: UNO, x: [2, 8, 1], y: [1, 3, 1], valida: (_e, x, y) => y < x,
    respuesta: (_e, x, y) => (13.6 * (1 / (y * y) - 1 / (x * x)) * RENG_E_AT * 6.02214076e23) / 1000,
    errores: (_e, x, y) => [
      ['por-foton', 'Un solo fotón', 13.6 * (1 / (y * y) - 1 / (x * x)) * RENG_E_AT, 'Esa es la energía de un solo fotón en julios; multiplica por N_A y pasa a kJ.'],
      ['ev', 'En eV por átomo', 13.6 * (1 / (y * y) - 1 / (x * x)), 'Diste la energía en eV por átomo; un eV por partícula equivale a 96,49 kJ/mol.']
    ],
    enunciado: (_e, x, y) => `Un mol de átomos de hidrógeno emite un fotón cada uno al pasar del nivel ${x} al nivel ${y}.`,
    pregunta: '¿Cuánta energía se emite en total, en kJ/mol?',
    datos: (_e, x, y) => [['Salto', `${x} → ${y}`], ['Constantes', '1 eV = 1,602·10⁻¹⁹ J; N_A = 6,022·10²³ mol⁻¹']],
    pasos: (_e, x, y, rengR) => [`ΔE = ${tx(13.6 * (1 / (y * y) - 1 / (x * x)), 4)} eV por fotón.`, `× 1,602·10⁻¹⁹ J/eV × N_A / 1000 = ${tx(rengR)} kJ/mol.`],
    pistas: ['Calcula la energía del salto en eV.', 'Pasa los eV a julios.', 'Multiplica por N_A y divide entre 1000.']
  })
]

export const RENG_PRACTICAS_B02_S06: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s6-p1', titulo: 'Contenido de una capa', unidad: '', tolerancia: { rel: 0.001, abs: 0.02 },
    objetivo: 'Calcular los subniveles, orbitales o electrones máximos de una capa del modelo cuántico.', seccion: '6.3', para: 'los números cuánticos',
    idealizado: 'Capas del modelo cuántico sin restricción de energía.', metodo: 'recuento explícito de l y m_l', sinVerificar: [], lista: RENG_TIPOS_CAPA_AT, x: [1, 7, 1],
    respuesta: ([, f], x) => f(x),
    errores: ([t], x) => RENG_TIPOS_CAPA_AT.filter(([u]) => u !== t).map(([u, g]) => [u, `Contaste ${u}`, g(x), `Ese número son los ${u} de la capa; la pregunta pide los ${t}.`] as const),
    enunciado: (_e, x) => `En el modelo mecánico-cuántico, la capa n = ${x} contiene subniveles con l de 0 a n − 1.`, pregunta: ([t]) => `¿Cuántos ${t} tiene esa capa como máximo?`,
    datos: ([t], x) => [['Capa', `n = ${x}`], ['Se pide', t]],
    pasos: (_e, x, _y, rengR) => [`Subniveles: ${x}; orbitales: n² = ${x * x}; electrones: 2n² = ${2 * x * x}.`, `Respuesta: ${tx(rengR)}.`],
    pistas: ['l va de 0 a n − 1.', 'Cada subnivel tiene 2l + 1 orbitales.', 'Cada orbital admite dos electrones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s6-p2', titulo: 'Longitud de onda de un electrón', unidad: 'nm',
    objetivo: 'Calcular la longitud de onda asociada a un electrón con la relación de De Broglie.', seccion: '6.3', para: 'el comportamiento ondulatorio del electrón', particulas: true,
    idealizado: 'Electrón no relativista.', metodo: 'búsqueda por bisección de λ', lista: UNO, x: [0.5, 5, 0.1],
    respuesta: (_e, x) => (RENG_H_AT / (RENG_ME_KG_AT * x * 1e6)) * 1e9,
    errores: (_e, x) => [
      ['sin-potencia', 'Sin la potencia de la velocidad', (RENG_H_AT / (RENG_ME_KG_AT * x)) * 1e9, 'La velocidad está en 10⁶ m/s: incluye la potencia de diez en el cálculo.'],
      ['proton', 'Con la masa del protón', (RENG_H_AT / (1.67262192e-27 * x * 1e6)) * 1e9, 'Usaste la masa del protón; la partícula es un electrón, mucho más ligero.']
    ],
    enunciado: (_e, x) => `Un electrón se mueve a ${tx(x)}·10⁶ m/s. Según De Broglie, λ = h/(m·v).`,
    pregunta: '¿Cuál es su longitud de onda, en nm?',
    datos: (_e, x) => [['Velocidad', `${tx(x)}·10⁶ m/s`], ['Masa del electrón', '9,109·10⁻³¹ kg'], ['h', '6,626·10⁻³⁴ J·s']],
    pasos: (_e, x, _y, rengR) => [`λ = 6,626·10⁻³⁴ / (9,109·10⁻³¹ × ${tx(x)}·10⁶) m.`, `λ = ${tx(rengR)} nm: del tamaño de un átomo.`],
    pistas: ['Multiplica masa por velocidad.', 'Divide h entre ese producto.', 'Pasa los metros a nanómetros.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s6-p3', titulo: 'Orbitales hasta una capa', unidad: '', tolerancia: { rel: 0.001, abs: 0.02 },
    objetivo: 'Sumar los orbitales o electrones de todas las capas desde n = 1 hasta una capa dada.', seccion: '6.3', para: 'los números cuánticos',
    idealizado: 'Capas completas del modelo cuántico.', metodo: 'suma explícita capa a capa', sinVerificar: [], lista: [['orbitales', 1], ['electrones', 2]] as ReadonlyArray<readonly [string, number]>, x: [2, 7, 1],
    respuesta: ([, k], x) => (k * x * (x + 1) * (2 * x + 1)) / 6,
    errores: ([t, k], x) => [
      ['solo-ultima', 'Solo la última capa', k * x * x, `Contaste solo los ${t} de la capa n = ${x}; hay que sumar todas las capas desde n = 1.`],
      ['suma-n', 'Suma de los valores de n', (k * x * (x + 1)) / 2, 'Sumaste los valores de n; cada capa tiene n² orbitales.']
    ],
    enunciado: ([t], x) => `Un átomo tiene llenas todas las capas desde n = 1 hasta n = ${x} (contando sus ${t}).`, pregunta: ([t]) => `¿Cuántos ${t} hay en total en esas capas?`,
    datos: ([t], x) => [['Capas', `de n = 1 a n = ${x}`], ['Se cuentan', t]],
    pasos: ([t, k], x, _y, rengR) => [`Capa n: ${k === 1 ? 'n²' : '2n²'} ${t}.`, `Suma de n = 1 a ${x}: ${tx(rengR)}.`],
    pistas: ['Calcula cada capa por separado.', 'Usa n² orbitales por capa.', 'Suma todas las capas.']
  })
]

export const RENG_PRACTICAS_B02_S07: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s7-p1', titulo: 'Masa de un átomo por sus partículas', unidad: 'u',
    objetivo: 'Sumar las masas de protones, neutrones y electrones para estimar la masa de un átomo.', seccion: '2.3', para: 'las partículas del átomo', particulas: true,
    idealizado: 'Partículas libres, sin descontar la energía de enlace.', metodo: 'escena «atomo»', lista: RENG_NUCLIDOS_AT,
    respuesta: ([s, a]) => { const z = rengZAt(s); return z * (RENG_MP_U + RENG_ME_U) + (a - z) * RENG_MN_U },
    errores: ([s, a]) => { const z = rengZAt(s); return [
      ['electrones-pesados', 'Electrones como protones', 2 * z * RENG_MP_U + (a - z) * RENG_MN_U, 'Contaste los electrones con la masa del protón; el electrón es unas 1836 veces más ligero.'],
      ['sin-neutrones', 'Sin neutrones', z * (RENG_MP_U + RENG_ME_U), 'Faltan los neutrones: también forman parte del núcleo y pesan casi como un protón.']
    ] },
    enunciado: ([s, a]) => `Un átomo neutro de ${rengNombreAt(s)}-${a} (Z = ${rengZAt(s)}).`,
    pregunta: '¿Qué masa tienen sus partículas sumadas, en u?',
    datos: ([s, a]) => [['Núclido', rengNuclidoAt(s, a)], ['Masas', 'p 1,007276 u; n 1,008665 u; e 0,00054858 u']],
    pasos: ([s, a], _x, _y, rengR) => { const z = rengZAt(s); return [`${z} p, ${a - z} n y ${z} e.`, `m = ${tx(rengR, 5)} u.`] },
    pistas: ['Cuenta las tres partículas.', 'Multiplica cada una por su masa.', 'Suma las tres contribuciones.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s7-p2', titulo: 'Electrones que igualan a protones', unidad: '',
    objetivo: 'Comparar las masas del protón y del electrón para ver lo ligero que es el electrón.', seccion: '2.3', para: 'las partículas del átomo', particulas: true,
    idealizado: 'Masas de partículas libres.', metodo: 'búsqueda por bisección del número de electrones', lista: UNO, x: [1, 30, 1],
    respuesta: (_e, x) => (x * RENG_MP_U) / RENG_ME_U,
    errores: (_e, x) => [
      ['iguales', 'Masas iguales', x, 'El electrón pesa mucho menos que el protón: hacen falta unos 1836 electrones por protón.'],
      ['inverso', 'Cociente invertido', (x * RENG_ME_U) / RENG_MP_U, 'Dividiste al revés: la masa del protón va en el numerador.']
    ],
    enunciado: (_e, x) => `Se tienen ${x} protones (1,007276 u cada uno). El electrón pesa 0,00054858 u.`,
    pregunta: '¿Cuántos electrones hacen falta para igualar su masa?',
    datos: (_e, x) => [['Protones', String(x)], ['Masas', 'p 1,007276 u; e 0,00054858 u']],
    pasos: (_e, x, _y, rengR) => [`Masa de los protones: ${tx(x * RENG_MP_U, 5)} u.`, `Electrones = ${tx(rengR, 4)}.`],
    pistas: ['Calcula la masa de los protones.', 'Divide entre la masa del electrón.', 'Compara con 1836 por protón.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s7-p3', titulo: 'Energía de enlace de un núcleo', unidad: 'MeV',
    objetivo: 'Calcular el defecto de masa de un núcleo y convertirlo en energía de enlace.', seccion: '2.3', para: 'las partículas del átomo', particulas: true,
    idealizado: 'Masas atómicas de tablas y 1 u = 931,494 MeV.', metodo: 'escena «atomo» y conversión independiente', sinVerificar: [RENG_MASA_ATOMICA_AT, 'La equivalencia 1 u = 931,494 MeV es un valor recordado, no contrastado en esta entrega.'], lista: RENG_ENLACE_AT,
    respuesta: ([s, a, m]) => rengEnlaceAt(rengZAt(s), a, m),
    errores: ([s, a, m], _x, _y, rengR) => [
      ['sin-electrones', 'Sin electrones', rengEnlaceAt(rengZAt(s), a, m, false), 'La masa dada es la del átomo, que incluye los electrones: súmalos también a las partículas.'],
      ['por-nucleon', 'Por nucleón', rengR / a, 'Esa es la energía de enlace por nucleón; la pregunta pide la energía total.']
    ],
    enunciado: ([s, a, m]) => `Un átomo de ${rengNombreAt(s)}-${a} (Z = ${rengZAt(s)}) tiene una masa de ${tx(m, 8)} u.`,
    pregunta: '¿Cuál es la energía de enlace de su núcleo, en MeV?',
    datos: ([s, a, m]) => [['Núclido', `${rengNuclidoAt(s, a)}, ${tx(m, 8)} u`], ['Partículas', 'p 1,007276 u; n 1,008665 u; e 0,00054858 u'], ['Equivalencia', '1 u = 931,494 MeV']],
    pasos: ([s, a, m], _x, _y, rengR) => { const z = rengZAt(s); return [`Δm = ${z}·(mp + me) + ${a - z}·mn − ${tx(m, 8)} = ${tx(rengR / RENG_MEV_U_AT, 4)} u.`, `E = Δm × 931,494 = ${tx(rengR, 4)} MeV.`] },
    pistas: ['Suma las masas de las partículas.', 'Resta la masa del átomo.', 'Multiplica por 931,494 MeV/u.']
  })
]

export const RENG_PRACTICAS_B02_S08: readonly RengPracticaN1[] = [
  rengPracticaAt({
    id: 'n1-b2-s8-p1', titulo: 'Neutrones de un núclido', unidad: '', tolerancia: { rel: 0.001, abs: 0.02 },
    objetivo: 'Calcular los neutrones de un núclido a partir de su número másico y su número atómico.', seccion: '2.3', para: 'el símbolo nuclear',
    idealizado: 'Núclidos indicados.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_NUCLIDOS_AT,
    respuesta: ([s, a]) => a - rengZAt(s),
    errores: ([s, a]) => [
      ['masico', 'El número másico', a, 'Ese es el número másico; los neutrones son A − Z.'],
      ['protones', 'Los protones', rengZAt(s), 'Ese es el número de protones (Z); los neutrones son A − Z.']
    ],
    enunciado: ([s, a]) => `Considera el núclido ${rengNuclidoAt(s, a)} (${rengNombreAt(s)}, Z = ${rengZAt(s)}).`,
    pregunta: '¿Cuántos neutrones tiene su núcleo?',
    datos: ([s, a]) => [['A', String(a)], ['Z', String(rengZAt(s))]],
    pasos: ([s, a], _x, _y, rengR) => [`N = A − Z = ${a} − ${rengZAt(s)}.`, `N = ${tx(rengR)}.`],
    pistas: ['A es el superíndice.', 'Z sale de la tabla periódica.', 'Resta Z de A.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s8-p2', titulo: 'Electrones de un ion', unidad: '', tolerancia: { rel: 0.001, abs: 0.02 },
    objetivo: 'Calcular los electrones de un ion a partir de su número atómico y su carga.', seccion: '2.3', para: 'los iones',
    idealizado: 'Iones monoatómicos.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_IONES_AT,
    respuesta: ([s, , q]) => rengZAt(s) - q,
    errores: ([s, , q]) => [
      ['signo', 'Signo de la carga al revés', rengZAt(s) + q, 'Un catión tiene menos electrones que protones y un anión, más: revisa el signo.'],
      ['neutro', 'Como átomo neutro', rengZAt(s), 'Ese es el número de electrones del átomo neutro; el ion tiene carga.']
    ],
    enunciado: ([s, a, q]) => `Considera el ion ${rengSupAt(a)}${rengIonAt(s, q)} (Z = ${rengZAt(s)}).`,
    pregunta: '¿Cuántos electrones tiene?',
    datos: ([s, , q]) => [['Z', String(rengZAt(s))], ['Carga', q > 0 ? `+${q}` : String(q)]],
    pasos: ([s, , q], _x, _y, rengR) => [`e⁻ = Z − q = ${rengZAt(s)} − (${q}).`, `e⁻ = ${tx(rengR)}.`],
    pistas: ['Los protones son Z.', 'La carga dice si sobran o faltan.', 'Usa e⁻ = Z − q.']
  }),
  rengPracticaAt({
    id: 'n1-b2-s8-p3', titulo: 'Partículas totales de un ion', unidad: '', tolerancia: { rel: 0.001, abs: 0.02 },
    objetivo: 'Contar todas las partículas (protones, neutrones y electrones) de un ion.', seccion: '2.3', para: 'el símbolo nuclear y los iones',
    idealizado: 'Iones monoatómicos.', metodo: 'escena «atomo»', sinVerificar: [], lista: RENG_IONES_AT,
    respuesta: ([s, a, q]) => a + rengZAt(s) - q,
    errores: ([s, a, q]) => [
      ['sin-carga', 'Sin la carga', a + rengZAt(s), 'Olvidaste la carga: el ion tiene un número de electrones distinto de Z.'],
      ['signo', 'Signo al revés', a + rengZAt(s) + q, 'Signo de la carga al revés: un catión tiene menos electrones y un anión, más.']
    ],
    enunciado: ([s, a, q]) => `Un ion ${rengSupAt(a)}${rengIonAt(s, q)} de ${rengNombreAt(s)} (Z = ${rengZAt(s)}).`,
    pregunta: '¿Cuántas partículas tiene en total (protones, neutrones y electrones)?',
    datos: ([s, a, q]) => [['A', String(a)], ['Z', String(rengZAt(s))], ['Carga', q > 0 ? `+${q}` : String(q)]],
    pasos: ([s, a, q], _x, _y, rengR) => { const z = rengZAt(s); return [`p = ${z}; n = ${a - z}; e = ${z - q}.`, `Total = ${tx(rengR)}.`] },
    pistas: ['Calcula los neutrones.', 'Calcula los electrones del ion.', 'Suma las tres partículas.']
  })
]

