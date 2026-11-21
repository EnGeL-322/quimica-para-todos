import { rengTx } from '../aprender/n1/gases/constantes'
import { rengLecturasCombustion } from '../escenas-n1/modelos/combustion'
import {
  RENG_C_AGUA_FU, RENG_GASES_FU, RENG_LF_FU, RENG_LIQUIDOS_FU, RENG_LV_FU, RENG_METALES_FU, RENG_OXIDOS_FU, RENG_PARES_OXIDOS_FU, RENG_R_FU, RENG_SUSTANCIAS_FU,
  rengPracticaFu
} from './b01-comun'
import { rengAnNo, rengDeNo, rengMNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const M = rengMNo
const A = rengAnNo
const oxPorX = (rengF: string, rengX: string): number => rengDeNo(rengF, 'O') / rengDeNo(rengF, rengX)
const mOxido = (rengI: number, rengX: number): number => { const o = RENG_OXIDOS_FU[rengI]!; return (rengX / A(o.metal) / o.nm) * M(o.oxido) }
export const RENG_COMBUSTIBLES_FU: ReadonlyArray<{ n: string; x: number; y: number; z: number; f: string }> = [
  { n: 'metano', x: 1, y: 4, z: 0, f: 'CH4' }, { n: 'etano', x: 2, y: 6, z: 0, f: 'C2H6' }, { n: 'propano', x: 3, y: 8, z: 0, f: 'C3H8' }, { n: 'butano', x: 4, y: 10, z: 0, f: 'C4H10' },
  { n: 'octano', x: 8, y: 18, z: 0, f: 'C8H18' }, { n: 'etanol', x: 2, y: 6, z: 1, f: 'C2H6O' }, { n: 'metanol', x: 1, y: 4, z: 1, f: 'CH4O' }, { n: 'glucosa', x: 6, y: 12, z: 6, f: 'C6H12O6' },
  { n: 'eteno', x: 2, y: 4, z: 0, f: 'C2H4' }, { n: 'acetona', x: 3, y: 6, z: 1, f: 'C3H6O' }, { n: 'benceno', x: 6, y: 6, z: 0, f: 'C6H6' }, { n: 'hexano', x: 6, y: 14, z: 0, f: 'C6H14' }
]
const comb = (rengI: number, rengX: number) => { const c = RENG_COMBUSTIBLES_FU[rengI]!; return rengLecturasCombustion({ x: c.x, y: c.y, z: c.z, n: rengX / M(c.f) }) }

export const RENG_PRACTICAS_B01_S01: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s1-p1', titulo: 'Composición de una sustancia', unidad: '%',
    objetivo: 'Calcular el porcentaje en masa de un elemento a partir de la fórmula de una sustancia.', seccion: '1.1', para: 'la composición de la materia', masas: true,
    idealizado: 'Sustancia pura.', metodo: 'masa molar del núcleo', sinVerificar: [], lista: RENG_SUSTANCIAS_FU,
    valida: ([, f, el]) => Math.abs((100 * rengDeNo(f, el) * A(el)) / M(f) - 50) > 3,
    respuesta: ([, f, el]) => (100 * rengDeNo(f, el) * A(el)) / M(f),
    errores: ([, f, el]) => [
      ['sin-subindice', 'Un solo átomo', (100 * A(el)) / M(f), `La fórmula tiene ${rengDeNo(f, el)} átomos de ${el}: multiplica por el subíndice.`],
      ['resto', 'El resto de elementos', 100 - (100 * rengDeNo(f, el) * A(el)) / M(f), `Calculaste el porcentaje de los demás elementos, no el de ${el}.`]
    ],
    enunciado: ([n, f]) => `La química estudia la composición de la materia. Considera el ${n}, ${T(f)}.`, pregunta: ([, , el]) => `¿Qué porcentaje de su masa es ${el}?`,
    datos: ([, f, el]) => [['Fórmula', T(f)], ['Elemento', el]],
    pasos: ([, f, el], _x, _y, rengR) => [`M = ${tx(M(f), 5)} g/mol; ${el} aporta ${rengDeNo(f, el)} × ${tx(A(el), 5)}.`, `%${el} = ${tx(rengR)} %.`],
    pistas: ['Calcula la masa molar.', 'Cuenta los átomos del elemento.', 'Divide y multiplica por 100.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s1-p2', titulo: 'Elemento en una muestra', unidad: 'g',
    objetivo: 'Calcular la masa de un elemento contenida en una masa de sustancia.', seccion: '1.1', para: 'la composición de la materia', masas: true,
    idealizado: 'Sustancia pura.', metodo: 'masa molar del núcleo', sinVerificar: [], lista: RENG_SUSTANCIAS_FU, x: [1, 200, 0.5],
    valida: ([, f, el]) => Math.abs((rengDeNo(f, el) * A(el)) / M(f) - 0.5) > 0.03,
    respuesta: ([, f, el], x) => (x * rengDeNo(f, el) * A(el)) / M(f),
    errores: ([, f, el], x) => [
      ['sin-subindice', 'Un solo átomo', (x * A(el)) / M(f), `Hay ${rengDeNo(f, el)} átomos de ${el} por fórmula.`],
      ['resto', 'Masa del resto', (x * (M(f) - rengDeNo(f, el) * A(el))) / M(f), `Calculaste la masa de lo que no es ${el}.`]
    ],
    enunciado: ([n, f], x) => `Una muestra contiene ${tx(x)} g de ${n} (${T(f)}).`, pregunta: ([, , el]) => `¿Qué masa de ${el} contiene, en g?`,
    datos: ([, f], x) => [['Muestra', `${tx(x)} g de ${T(f)}`], [`M(${T(f)})`, `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f, el], x, _y, rengR) => [`Fracción de ${el}: ${tx((rengDeNo(f, el) * A(el)) / M(f), 4)}.`, `m = ${tx(x)} × fracción = ${tx(rengR)} g.`],
    pistas: ['Calcula la fracción en masa.', 'Multiplica por la muestra.', 'Comprueba que sea menor que la muestra.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s1-p3', titulo: 'Sustancia que contiene un elemento', unidad: 'g',
    objetivo: 'Calcular la masa de sustancia que contiene una masa dada de uno de sus elementos.', seccion: '1.1', para: 'la composición de la materia', masas: true,
    idealizado: 'Sustancia pura.', metodo: 'masa molar del núcleo', sinVerificar: [], lista: RENG_SUSTANCIAS_FU, x: [1, 100, 0.5],
    valida: ([, f, el]) => rengDeNo(f, el) > 1,
    respuesta: ([, f, el], x) => (x * M(f)) / (rengDeNo(f, el) * A(el)),
    errores: ([, f, el], x) => [
      ['sin-subindice', 'Un solo átomo', (x * M(f)) / A(el), `Cada fórmula aporta ${rengDeNo(f, el)} átomos de ${el}.`],
      ['invertida', 'Fracción invertida', (x * rengDeNo(f, el) * A(el)) / M(f), 'Multiplicaste por la fracción del elemento; hay que dividir entre ella.']
    ],
    enunciado: ([n, f, el], x) => `Se necesitan ${tx(x)} g de ${el} en forma de ${n} (${T(f)}).`, pregunta: ([n]) => `¿Qué masa de ${n} hace falta, en g?`,
    datos: ([, f, el], x) => [['Elemento', `${tx(x)} g de ${el}`], ['Sustancia', T(f)]],
    pasos: ([, f, el], x, _y, rengR) => [`Fracción de ${el}: ${tx((rengDeNo(f, el) * A(el)) / M(f), 4)}.`, `m = ${tx(x)}/fracción = ${tx(rengR)} g.`],
    pistas: ['Calcula la fracción del elemento.', 'Divide la masa del elemento entre ella.', 'Comprueba que sea mayor.']
  })
]

export const RENG_PRACTICAS_B01_S02: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s2-p1', titulo: 'Oxígeno según Lavoisier', unidad: 'g',
    objetivo: 'Aplicar la conservación de la masa de Lavoisier para calcular el oxígeno que gana un metal al oxidarse.', seccion: '2.1', para: 'la ley de conservación de la masa', masas: true,
    idealizado: 'Recipiente cerrado; oxidación completa.', metodo: 'proporción estequiométrica con masas del núcleo', sinVerificar: [], lista: RENG_OXIDOS_FU, x: [1, 100, 0.5],
    respuesta: (o, x) => mOxido(RENG_OXIDOS_FU.indexOf(o), x) - x,
    errores: (o, x) => [
      ['suma', 'Suma de masas', mOxido(RENG_OXIDOS_FU.indexOf(o), x) + x, 'Sumaste; el oxígeno es la diferencia entre la masa del óxido y la del metal.'],
      ['oxido', 'Masa del óxido', mOxido(RENG_OXIDOS_FU.indexOf(o), x), 'Esa es la masa del óxido; falta restar la del metal.']
    ],
    enunciado: (o, x) => `En un recipiente cerrado, ${tx(x)} g de ${o.metal} se oxidan por completo y se forman ${tx(mOxido(RENG_OXIDOS_FU.indexOf(o), x), 5)} g de ${T(o.oxido)}.`, pregunta: '¿Qué masa de oxígeno se ha combinado, en g?',
    datos: (o, x) => [['Metal', `${tx(x)} g`], ['Óxido', `${tx(mOxido(RENG_OXIDOS_FU.indexOf(o), x), 5)} g`]],
    pasos: (_o, _x, _y, rengR) => ['La masa se conserva (Lavoisier): m(O) = m(óxido) − m(metal).', `m(O) = ${tx(rengR)} g.`],
    pistas: ['La masa total no cambia.', 'Resta la masa del metal.', 'El resultado es el oxígeno.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s2-p2', titulo: 'Proporciones definidas de Proust', unidad: 'g',
    objetivo: 'Usar la ley de las proporciones definidas para predecir la masa de un elemento en otra muestra del mismo compuesto.', seccion: '2.1', para: 'la ley de las proporciones definidas', masas: true,
    idealizado: 'Compuesto puro de composición fija.', metodo: 'fracción en masa con el núcleo', sinVerificar: [], lista: RENG_SUSTANCIAS_FU, x: [5, 100, 0.5], y: [5, 300, 0.5],
    valida: (_s, x, y) => Math.abs(x - y) > 0.1 * Math.max(x, y),
    respuesta: ([, f, el], _x, y) => (y * rengDeNo(f, el) * A(el)) / M(f),
    errores: ([, f, el], x, y) => [
      ['misma', 'La misma masa que la primera', (x * rengDeNo(f, el) * A(el)) / M(f), 'Esa es la masa del elemento en la primera muestra; la segunda es de otro tamaño.'],
      ['regla-invertida', 'Regla de tres al revés', (x * ((x * rengDeNo(f, el) * A(el)) / M(f))) / y, 'Planteaste la regla de tres al revés: la masa del elemento crece con la de la muestra.']
    ],
    enunciado: ([n, f, el], x) => `Una muestra de ${tx(x)} g de ${n} (${T(f)}) contiene ${tx((x * rengDeNo(f, el) * A(el)) / M(f), 5)} g de ${el}.`, pregunta: ([n, , el]) => `¿Cuánto ${el} contendrá otra muestra de ${n} del tamaño indicado, en g?`,
    datos: ([, f, el], x, y) => [['Muestra 1', `${tx(x)} g con ${tx((x * rengDeNo(f, el) * A(el)) / M(f), 5)} g de ${el}`], ['Muestra 2', `${tx(y)} g de ${T(f)}`]],
    pasos: ([, f, el], _x, y, rengR) => [`La proporción ${el}/compuesto es fija: ${tx((rengDeNo(f, el) * A(el)) / M(f), 4)}.`, `m = ${tx(y)} × proporción = ${tx(rengR)} g.`],
    pistas: ['Calcula la proporción con la primera muestra.', 'Es la misma en la segunda.', 'Multiplica por la masa de la segunda.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s2-p3', titulo: 'Proporciones múltiples de Dalton', unidad: '',
    objetivo: 'Comparar dos compuestos de los mismos elementos y obtener la relación de números sencillos de Dalton.', seccion: '2.1', para: 'la ley de las proporciones múltiples', masas: true,
    idealizado: 'Compuestos de fórmula exacta.', metodo: 'masas de oxígeno por gramo del otro elemento con el núcleo', sinVerificar: [], lista: RENG_PARES_OXIDOS_FU,
    respuesta: (p) => oxPorX(p.b, p.x) / oxPorX(p.a, p.x),
    errores: (p) => [
      ['invertida', 'Cociente invertido', oxPorX(p.a, p.x) / oxPorX(p.b, p.x), 'Invertiste el cociente: el segundo óxido va en el numerador.'],
      ['masas-molares', 'Cociente de masas molares', M(p.b) / M(p.a), 'Comparaste las masas molares de los óxidos; hay que comparar el oxígeno por gramo del otro elemento.']
    ],
    enunciado: (p) => `El ${p.x} forma los óxidos ${T(p.a)} y ${T(p.b)}.`, pregunta: (p) => `Para la misma masa de ${p.x}, ¿cuántas veces más oxígeno tiene el ${T(p.b)} que el ${T(p.a)}?`,
    datos: (p) => [['Óxido 1', T(p.a)], ['Óxido 2', T(p.b)]],
    pasos: (p, _x, _y, rengR) => [`O por ${p.x}: ${tx(oxPorX(p.a, p.x))} en el primero y ${tx(oxPorX(p.b, p.x))} en el segundo.`, `Relación = ${tx(rengR, 4)}, un cociente de números sencillos.`],
    pistas: ['Fija la cantidad del otro elemento.', 'Cuenta el oxígeno en cada óxido.', 'Divide los dos valores.']
  })
]

export const RENG_PRACTICAS_B01_S03: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s3-p1', titulo: 'Media de cuatro medidas', unidad: 'g',
    objetivo: 'Calcular el valor medio de varias medidas repetidas.', seccion: '1.5', para: 'el análisis de medidas',
    idealizado: 'Errores aleatorios.', metodo: 'media calculada con las medidas reordenadas', lista: [0], x: [1, 100, 0.01], y: [0.02, 1, 0.01],
    respuesta: (_e, x) => x,
    errores: (_e, x, y) => [
      ['maximo', 'Valor máximo', x + y, 'Tomaste la medida más alta; la media combina todas.'],
      ['suma', 'Suma sin dividir', 4 * x, 'Falta dividir la suma entre el número de medidas.']
    ],
    enunciado: (_e, x, y) => `Cuatro medidas de una masa dan ${tx(x - y, 4)} g, ${tx(x + y, 4)} g, ${tx(x - y / 2, 4)} g y ${tx(x + y / 2, 4)} g.`, pregunta: '¿Cuál es el valor medio, en g?',
    datos: (_e, x, y) => [['Medidas', `${tx(x - y, 4)}; ${tx(x + y, 4)}; ${tx(x - y / 2, 4)}; ${tx(x + y / 2, 4)} g`], ['Número', '4']],
    pasos: (_e, _x, _y, rengR) => ['Suma las cuatro medidas.', `Divide entre 4: ${tx(rengR, 4)} g.`],
    pistas: ['Suma todas las medidas.', 'Divide entre cuatro.', 'La media está entre la menor y la mayor.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s3-p2', titulo: 'Error relativo', unidad: '%',
    objetivo: 'Calcular el error relativo de una medida respecto a un valor de referencia.', seccion: '1.5', para: 'la exactitud de las medidas',
    idealizado: 'Valor de referencia exacto.', metodo: 'complemento del cociente medida/referencia', lista: RENG_METALES_FU, x: [3, 20, 0.1], y: [0, 1, 1],
    respuesta: (_m, x) => x,
    errores: (m, x, y) => { const rengMed = m.rho * (1 + (y === 1 ? 1 : -1) * x / 100); return [
      ['absoluto', 'Error absoluto', Math.abs(rengMed - m.rho), 'Ese es el error absoluto, en g/mL; el relativo se divide entre la referencia.'],
      ['sobre-medida', 'Dividido entre la medida', (100 * Math.abs(rengMed - m.rho)) / rengMed, 'Dividiste entre la medida; el error relativo se calcula sobre el valor de referencia.']
    ] },
    enunciado: (m, x, y) => `Un alumno mide la densidad del ${m.n} y obtiene ${tx(m.rho * (1 + (y === 1 ? 1 : -1) * x / 100), 5)} g/mL; el valor de referencia es ${tx(m.rho, 4)} g/mL.`, pregunta: '¿Cuál es el error relativo, en %?',
    datos: (m, x, y) => [['Medida', `${tx(m.rho * (1 + (y === 1 ? 1 : -1) * x / 100), 5)} g/mL`], ['Referencia', `${tx(m.rho, 4)} g/mL`]],
    pasos: (_m, _x, _y, rengR) => ['ε = |medida − referencia|/referencia × 100.', `ε = ${tx(rengR)} %.`],
    pistas: ['Resta medida y referencia.', 'Divide entre la referencia.', 'Multiplica por 100.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s3-p3', titulo: 'Densidad a partir de dos medidas', unidad: 'g/mL',
    objetivo: 'Obtener una densidad como pendiente de la recta masa–volumen cuando la balanza incluye el recipiente.', seccion: '1.5', para: 'el tratamiento de datos',
    idealizado: 'Medidas sin error.', metodo: 'escena «densidad» con la masa neta', lista: RENG_LIQUIDOS_FU, x: [10, 40, 1], y: [30, 120, 1],
    respuesta: (l) => l.rho,
    errores: (l, x) => [
      ['un-punto', 'Con un solo punto', (l.rho * (x + 50) + 25) / (x + 50), 'Dividiste la masa bruta entre el volumen: incluye el recipiente. Usa la pendiente entre los dos puntos.'],
      ['invertida', 'Pendiente invertida', 1 / l.rho, 'Dividiste volumen entre masa: la densidad es masa entre volumen.']
    ],
    valida: (l) => Math.abs(1 / l.rho - l.rho) > 0.2,
    enunciado: (l, x) => `En una probeta de 25,0 g se añaden ${tx(x)} mL de ${l.n} y la balanza marca ${tx(l.rho * x + 25, 5)} g; con ${tx(x + 50)} mL marca ${tx(l.rho * (x + 50) + 25, 5)} g.`, pregunta: '¿Cuál es la densidad del líquido, en g/mL?',
    datos: (l, x) => [['Punto 1', `${tx(x)} mL; ${tx(l.rho * x + 25, 5)} g`], ['Punto 2', `${tx(x + 50)} mL; ${tx(l.rho * (x + 50) + 25, 5)} g`]],
    pasos: (_l, _x, _y, rengR) => ['La pendiente Δm/ΔV elimina la masa del recipiente.', `ρ = ${tx(rengR, 4)} g/mL.`],
    pistas: ['Resta las dos masas.', 'Resta los dos volúmenes.', 'Divide masa entre volumen.']
  })
]

export const RENG_PRACTICAS_B01_S04: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s4-p1', titulo: 'Energía para calentar agua', unidad: 'kJ',
    objetivo: 'Calcular la energía que absorbe una masa de agua al calentarse con q = m·c·ΔT.', seccion: '1.1', para: 'la materia y la energía',
    idealizado: 'Sin pérdidas ni cambios de estado.', metodo: 'catálogo de unidades de la app', lista: [0], x: [50, 2000, 10], y: [5, 70, 0.5],
    respuesta: (_e, x, y) => (x * RENG_C_AGUA_FU * y) / 1000,
    errores: (_e, x, y) => [
      ['julios', 'En julios', x * RENG_C_AGUA_FU * y, 'Ese resultado está en julios; la pregunta pide kJ.'],
      ['kelvin', 'Sumar 273 al cambio', (x * RENG_C_AGUA_FU * (y + 273.15)) / 1000, 'Un cambio de 1 °C es un cambio de 1 K: no sumes 273,15 al incremento.']
    ],
    enunciado: (_e, x, y) => `Se calientan ${tx(x)} g de agua y su temperatura sube ${tx(y)} °C; c = 4,184 J/(g·K).`, pregunta: '¿Cuánta energía absorbe, en kJ?',
    datos: (_e, x, y) => [['Agua', `${tx(x)} g`], ['ΔT', `${tx(y)} °C`]],
    pasos: (_e, x, y, rengR) => [`q = ${tx(x)} × 4,184 × ${tx(y)} J.`, `q = ${tx(rengR)} kJ.`],
    pistas: ['Usa q = m·c·ΔT.', 'ΔT en °C y en K es igual.', 'Pasa el resultado a kJ.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s4-p2', titulo: 'Mezcla de agua caliente y fría', unidad: '°C',
    objetivo: 'Calcular la temperatura final al mezclar dos masas de agua a distinta temperatura.', seccion: '1.1', para: 'el intercambio de energía', tolerancia: { rel: 0.005, abs: 0.05 },
    idealizado: 'Recipiente aislado.', metodo: 'escena «calorimetria»', lista: [0], x: [50, 900, 10], y: [50, 900, 10],
    valida: (_e, x, y) => Math.abs(x - y) > 0.15 * Math.max(x, y),
    respuesta: (_e, x, y) => (x * 80 + y * 15) / (x + y),
    errores: (_e, x, y) => [
      ['media', 'Media simple', (80 + 15) / 2, 'Hiciste la media simple; cada agua pesa según su masa.'],
      ['cruzada', 'Masas cruzadas', (y * 80 + x * 15) / (x + y), 'Cruzaste las masas: cada temperatura va con su propia masa.']
    ],
    enunciado: (_e, x, y) => `Se mezclan ${tx(x)} g de agua a 80,0 °C con ${tx(y)} g de agua a 15,0 °C sin pérdidas.`, pregunta: '¿Cuál es la temperatura final, en °C?',
    datos: (_e, x, y) => [['Agua caliente', `${tx(x)} g a 80,0 °C`], ['Agua fría', `${tx(y)} g a 15,0 °C`]],
    pasos: (_e, _x, _y, rengR) => ['Calor cedido = calor ganado; el c del agua se cancela.', `T_f = ${tx(rengR, 4)} °C.`],
    pistas: ['Calor cedido igual a ganado.', 'Es una media ponderada.', 'Las masas son los pesos.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s4-p3', titulo: 'Agua que calienta una energía', unidad: 'g',
    objetivo: 'Calcular la masa de agua que una energía dada calienta un número de grados.', seccion: '1.1', para: 'la materia y la energía',
    idealizado: 'Sin pérdidas.', metodo: 'bisección del balance de calor', lista: [0], x: [5, 500, 1], y: [5, 60, 0.5],
    respuesta: (_e, x, y) => (x * 1000) / (RENG_C_AGUA_FU * y),
    errores: (_e, x, y) => [
      ['kj', 'Energía en kJ', x / (RENG_C_AGUA_FU * y), 'Usaste kJ con c en J/(g·K): pasa la energía a julios.'],
      ['sin-c', 'Sin el calor específico', (x * 1000) / y, 'Falta dividir entre el calor específico del agua.']
    ],
    enunciado: (_e, x, y) => `Con ${tx(x)} kJ se quiere calentar agua ${tx(y)} °C (c = 4,184 J/(g·K)).`, pregunta: '¿Qué masa de agua se puede calentar, en g?',
    datos: (_e, x, y) => [['Energía', `${tx(x)} kJ`], ['ΔT', `${tx(y)} °C`]],
    pasos: (_e, x, y, rengR) => [`m = q/(c·ΔT) = ${tx(x * 1000)} J / (4,184 × ${tx(y)}).`, `m = ${tx(rengR)} g.`],
    pistas: ['Despeja m de q = m·c·ΔT.', 'Pasa los kJ a J.', 'Divide los dos valores.']
  })
]

export const RENG_PRACTICAS_B01_S05: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s5-p1', titulo: 'Volumen de un cubo', unidad: 'mL',
    objetivo: 'Calcular el volumen de un cubo, una propiedad general, a partir de su arista.', seccion: '1.4', para: 'las propiedades generales',
    idealizado: 'Cubo perfecto.', metodo: 'escena «densidad» (volumen que da la densidad del material)', lista: [0], x: [0.5, 10, 0.05],
    respuesta: (_e, x) => x ** 3,
    errores: (_e, x) => [
      ['cuadrado', 'Área de una cara', x ** 2, 'Calculaste el área de una cara; el volumen es la arista al cubo.'],
      ['triple', 'Tres veces la arista', 3 * x, 'Multiplicaste la arista por 3; hay que elevarla al cubo.']
    ],
    enunciado: (_e, x) => `Un cubo tiene ${tx(x)} cm de arista (1 cm³ = 1 mL).`, pregunta: '¿Cuál es su volumen, en mL?',
    datos: (_e, x) => [['Arista', `${tx(x)} cm`], ['Equivalencia', '1 cm³ = 1 mL']],
    pasos: (_e, x, _y, rengR) => [`V = a³ = ${tx(x)}³.`, `V = ${tx(rengR)} mL.`],
    pistas: ['Eleva la arista al cubo.', '1 cm³ es 1 mL.', 'Es una propiedad general.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s5-p2', titulo: 'Identificar un metal', unidad: 'g/mL',
    objetivo: 'Calcular la densidad, una propiedad específica, para identificar un metal.', seccion: '1.3', para: 'las propiedades específicas',
    idealizado: 'Metal puro y macizo.', metodo: 'escena «densidad»', lista: RENG_METALES_FU, x: [2, 50, 0.5],
    respuesta: (m) => m.rho,
    errores: (m, x) => [
      ['invertida', 'Volumen entre masa', 1 / m.rho, 'Dividiste el volumen entre la masa; la densidad es masa entre volumen.'],
      ['producto', 'Masa por volumen', m.rho * x * x, 'Multiplicaste masa por volumen; hay que dividir.']
    ],
    valida: (m) => Math.abs(1 / m.rho - m.rho) > 0.2,
    enunciado: (m, x) => `Un objeto metálico de ${tx(m.rho * x, 5)} g desplaza ${tx(x)} mL de agua.`, pregunta: '¿Cuál es su densidad, en g/mL?',
    datos: (m, x) => [['Masa', `${tx(m.rho * x, 5)} g`], ['Volumen', `${tx(x)} mL`]],
    pasos: (m, _x, _y, rengR) => ['ρ = m/V, propiedad característica.', `ρ = ${tx(rengR, 4)} g/mL: coincide con el ${m.n}.`],
    pistas: ['Divide masa entre volumen.', 'Compara con una tabla.', 'La densidad identifica el metal.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s5-p3', titulo: 'Masa de un cubo metálico', unidad: 'g',
    objetivo: 'Combinar una propiedad general (volumen) con una específica (densidad) para calcular una masa.', seccion: '1.3', para: 'las propiedades de la materia',
    idealizado: 'Cubo macizo.', metodo: 'escena «densidad»', lista: RENG_METALES_FU, x: [0.5, 6, 0.05],
    valida: (_m, x) => x > 1.3,
    respuesta: (m, x) => m.rho * x ** 3,
    errores: (m, x) => [
      ['cuadrado', 'Con el área', m.rho * x ** 2, 'Usaste el área de una cara; el volumen es a³.'],
      ['sin-densidad', 'Solo el volumen', x ** 3, 'Ese es el volumen en mL; multiplica por la densidad.']
    ],
    enunciado: (m, x) => `Un cubo de ${m.n} (${tx(m.rho, 4)} g/mL) tiene ${tx(x)} cm de arista.`, pregunta: '¿Qué masa tiene, en g?',
    datos: (m, x) => [['Arista', `${tx(x)} cm`], ['Densidad', `${tx(m.rho, 4)} g/mL`]],
    pasos: (_m, x, _y, rengR) => [`V = ${tx(x ** 3)} mL.`, `m = ρ·V = ${tx(rengR)} g.`],
    pistas: ['Calcula el volumen.', 'Multiplica por la densidad.', 'Comprueba las unidades.']
  })
]

export const RENG_PRACTICAS_B01_S06: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s6-p1', titulo: 'Calor para fundir hielo', unidad: 'kJ',
    objetivo: 'Calcular el calor de un cambio de estado, una propiedad física, con el calor latente de fusión.', seccion: '1.3', para: 'las propiedades físicas',
    idealizado: 'Hielo a 0 °C.', metodo: 'catálogo de unidades de la app', lista: [0], x: [5, 2000, 5],
    respuesta: (_e, x) => (x * RENG_LF_FU) / 1000,
    errores: (_e, x) => [
      ['julios', 'En julios', x * RENG_LF_FU, 'Ese resultado está en julios; la pregunta pide kJ.'],
      ['vaporizacion', 'Calor de vaporización', (x * RENG_LV_FU) / 1000, 'Usaste el calor de vaporización; para fundir se usa el de fusión.']
    ],
    enunciado: (_e, x) => `Se funden ${tx(x)} g de hielo a 0 °C (L_f = 334 J/g).`, pregunta: '¿Cuánto calor hace falta, en kJ?',
    datos: (_e, x) => [['Hielo', `${tx(x)} g`], ['L_f', '334 J/g']],
    pasos: (_e, x, _y, rengR) => [`q = ${tx(x)} × 334 J.`, `q = ${tx(rengR)} kJ.`],
    pistas: ['Multiplica masa por L_f.', 'Pasa el resultado a kJ.', 'La temperatura no cambia.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s6-p2', titulo: 'Calor para hervir agua', unidad: 'kJ',
    objetivo: 'Calcular el calor necesario para evaporar una masa de agua a 100 °C.', seccion: '1.3', para: 'las propiedades físicas',
    idealizado: 'Agua a 100 °C.', metodo: 'catálogo de unidades de la app', lista: [0], x: [5, 2000, 5],
    respuesta: (_e, x) => (x * RENG_LV_FU) / 1000,
    errores: (_e, x) => [
      ['julios', 'En julios', x * RENG_LV_FU, 'Ese resultado está en julios; la pregunta pide kJ.'],
      ['fusion', 'Calor de fusión', (x * RENG_LF_FU) / 1000, 'Usaste el calor de fusión; para hervir se usa el de vaporización.']
    ],
    enunciado: (_e, x) => `Se evaporan ${tx(x)} g de agua a 100 °C (L_v = 2260 J/g).`, pregunta: '¿Cuánto calor hace falta, en kJ?',
    datos: (_e, x) => [['Agua', `${tx(x)} g`], ['L_v', '2260 J/g']],
    pasos: (_e, x, _y, rengR) => [`q = ${tx(x)} × 2260 J.`, `q = ${tx(rengR)} kJ.`],
    pistas: ['Multiplica masa por L_v.', 'Pasa el resultado a kJ.', 'Es una propiedad física.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s6-p3', titulo: 'Oxígeno que consume una combustión', unidad: 'g',
    objetivo: 'Cuantificar una propiedad química, la combustibilidad: oxígeno consumido al quemar una masa de combustible.', seccion: '1.3', para: 'las propiedades químicas', masas: true,
    idealizado: 'Combustión completa.', metodo: 'escena «combustion»', sinVerificar: [], lista: RENG_COMBUSTIBLES_FU, x: [1, 100, 0.5],
    respuesta: (_c, x) => comb(RENG_COMBUSTIBLES_FU.indexOf(_c), x).mo2!,
    errores: (c, x) => [
      ['masa-igual', 'Misma masa', x, 'El oxígeno consumido no es igual a la masa del combustible.'],
      ['co2', 'Masa de CO₂', comb(RENG_COMBUSTIBLES_FU.indexOf(c), x).mco2!, 'Calculaste el CO₂ formado, no el oxígeno consumido.']
    ],
    enunciado: (c, x) => `Se queman por completo ${tx(x)} g de ${c.n} (${T(c.f)}).`, pregunta: '¿Qué masa de O₂ consume, en g?',
    datos: (c, x) => [['Combustible', `${tx(x)} g de ${T(c.f)}`], [`M(${T(c.f)})`, `${tx(M(c.f), 5)} g/mol`]],
    pasos: (c, _x, _y, rengR) => [`O₂ por mol de combustible: ${tx(c.x + c.y / 4 - c.z / 2)}.`, `m(O₂) = ${tx(rengR)} g.`],
    pistas: ['Ajusta la combustión.', 'Pasa a moles.', 'Pasa el O₂ a gramos.']
  })
]

export const RENG_PRACTICAS_B01_S07: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s7-p1', titulo: 'Juntar dos muestras', unidad: 'g',
    objetivo: 'Reconocer que la masa es extensiva y se suma al juntar muestras.', seccion: '1.3', para: 'las propiedades extensivas',
    idealizado: 'Sin pérdidas.', metodo: 'búsqueda por bisección de la masa total', lista: [0], x: [5, 500, 0.5], y: [5, 500, 0.5],
    valida: (_e, x, y) => Math.abs(x - y) > 0.2 * Math.max(x, y),
    respuesta: (_e, x, y) => x + y,
    errores: (_e, x, y) => [
      ['media', 'Media', (x + y) / 2, 'La masa es extensiva: se suma, no se promedia.'],
      ['diferencia', 'Diferencia', Math.abs(x - y), 'Restaste; al juntar las muestras las masas se suman.']
    ],
    enunciado: (_e, x, y) => `Se juntan dos muestras de agua de ${tx(x)} g y ${tx(y)} g, ambas a 20 °C.`, pregunta: '¿Cuál es la masa total, en g?',
    datos: (_e, x, y) => [['Muestra 1', `${tx(x)} g`], ['Muestra 2', `${tx(y)} g`]],
    pasos: (_e, _x, _y, rengR) => ['La masa es extensiva.', `m = ${tx(rengR)} g; la temperatura sigue siendo 20 °C (intensiva).`],
    pistas: ['¿Se suma la masa?', 'Suma las dos.', 'La temperatura no cambia.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s7-p2', titulo: 'Densidad de un trozo mayor', unidad: 'g/mL',
    objetivo: 'Reconocer que la densidad es intensiva y no cambia con el tamaño de la muestra.', seccion: '1.3', para: 'las propiedades intensivas',
    idealizado: 'Material homogéneo.', metodo: 'escena «densidad» con el trozo pequeño', lista: RENG_METALES_FU, x: [2, 10, 1], y: [1, 20, 0.5],
    respuesta: (m) => m.rho,
    errores: (m, x) => [
      ['escalada', 'Multiplicada por el factor', m.rho * x, 'Multiplicaste la densidad por el factor de tamaño; la densidad no depende del tamaño.'],
      ['dividida', 'Dividida por el factor', m.rho / x, 'Dividiste la densidad; al aumentar masa y volumen a la vez, su cociente no cambia.']
    ],
    enunciado: (m, x, y) => `Un trozo de ${m.n} de ${tx(y)} mL tiene ${tx(m.rho * y, 5)} g. Otro trozo del mismo material es ${x} veces más grande.`, pregunta: '¿Cuál es la densidad del trozo grande, en g/mL?',
    datos: (m, _x, y) => [['Trozo pequeño', `${tx(m.rho * y, 5)} g; ${tx(y)} mL`], ['Material', m.n]],
    pasos: (_m, _x, _y, rengR) => ['Masa y volumen crecen en la misma proporción.', `ρ = ${tx(rengR, 4)} g/mL, la misma.`],
    pistas: ['Calcula la densidad del pequeño.', '¿Depende del tamaño?', 'Es intensiva.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s7-p3', titulo: 'Densidad de una mezcla de líquidos', unidad: 'kg/m³',
    objetivo: 'Calcular la densidad de una mezcla a partir de masas y volúmenes (extensivos), sin sumar densidades (intensivas).', seccion: '1.3', para: 'las propiedades intensivas y extensivas',
    idealizado: 'Volúmenes aditivos, sin contracción.', metodo: 'escena «densidad» con los totales', lista: RENG_LIQUIDOS_FU.filter((rengL) => ['etanol', 'glicerina', 'acetona', 'ácido acético'].includes(rengL.n)), x: [20, 500, 5], y: [20, 500, 5],
    valida: (_l, x, y) => Math.abs(x - y) > 0.2 * Math.max(x, y),
    respuesta: (l, x, y) => (1000 * (x * 1 + y * l.rho)) / (x + y),
    errores: (l) => [
      ['media-simple', 'Media simple', (1000 * (1 + l.rho)) / 2, 'Promediaste las densidades sin tener en cuenta los volúmenes.'],
      ['suma', 'Suma de densidades', 1000 * (1 + l.rho), 'Las densidades no se suman: calcula masa total entre volumen total.']
    ],
    enunciado: (l, x, y) => `Se mezclan ${tx(x)} mL de agua (1,00 g/mL) con ${tx(y)} mL de ${l.n} (${tx(l.rho, 4)} g/mL), suponiendo volúmenes aditivos.`, pregunta: '¿Cuál es la densidad de la mezcla, en kg/m³?',
    datos: (l, x, y) => [['Agua', `${tx(x)} mL`], [l.n, `${tx(y)} mL; ${tx(l.rho, 4)} g/mL`]],
    pasos: (l, x, y, rengR) => [`m total = ${tx(x + y * l.rho)} g; V total = ${tx(x + y)} mL.`, `ρ = ${tx(rengR, 4)} g/mL.`],
    pistas: ['Calcula cada masa.', 'Suma masas y volúmenes.', 'Divide los dos valores.']
  })
]

export const RENG_PRACTICAS_B01_S08: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s8-p1', titulo: 'Volumen de un gas', unidad: 'L',
    objetivo: 'Calcular el volumen que ocupa un gas con PV = nRT, usando la temperatura absoluta.', seccion: '1.2', para: 'el estado gaseoso',
    idealizado: 'Gas ideal.', metodo: 'escena «gas-ideal»', lista: [0], x: [10, 200, 1], y: [50, 300, 1],
    respuesta: (_e, x, y) => (1 * RENG_R_FU * (x + 273.15)) / y,
    errores: (_e, x, y) => [
      ['celsius', 'Con °C', (RENG_R_FU * x) / y, 'Hay que usar la temperatura en kelvin, no en °C.'],
      ['invertida', 'P y T invertidas', (RENG_R_FU * y) / (x + 273.15), 'Pusiste la presión arriba y la temperatura abajo.']
    ],
    enunciado: (_e, x, y) => `Se tiene 1,00 mol de gas ideal a ${tx(x)} °C y ${tx(y)} kPa.`, pregunta: '¿Qué volumen ocupa, en L?',
    datos: (_e, x, y) => [['n', '1,00 mol'], ['t', `${tx(x)} °C`], ['P', `${tx(y)} kPa`]],
    pasos: (_e, x, _y, rengR) => [`T = ${tx(x + 273.15, 5)} K.`, `V = nRT/P = ${tx(rengR)} L.`],
    pistas: ['Pasa a kelvin.', 'Usa PV = nRT.', 'Con kPa sale en L.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s8-p2', titulo: 'Densidad de un gas', unidad: 'g/L',
    objetivo: 'Calcular la densidad de un gas a partir de su masa molar, la presión y la temperatura.', seccion: '1.2', para: 'el estado gaseoso', masas: true,
    idealizado: 'Gas ideal.', metodo: 'escena «gas-ideal» (lectura de densidad)', sinVerificar: [], lista: RENG_GASES_FU, x: [300, 500, 1], y: [50, 300, 1],
    respuesta: (g, x, y) => (y * M(g.f)) / (RENG_R_FU * x),
    errores: (g, x, y) => [
      ['sin-M', 'Sin la masa molar', y / (RENG_R_FU * x), 'Ese resultado es la concentración en mol/L; multiplica por la masa molar.'],
      ['celsius', 'Con la temperatura en °C', (y * M(g.f)) / (RENG_R_FU * (x - 273.15)), 'La temperatura dada ya está en kelvin: no restes 273,15.']
    ],
    enunciado: (g, x, y) => `Se tiene ${g.n} (${T(g.f)}) a ${tx(x)} K y ${tx(y)} kPa.`, pregunta: '¿Cuál es su densidad, en g/L?',
    datos: (g, x, y) => [['Gas', T(g.f)], ['T', `${tx(x)} K`], ['P', `${tx(y)} kPa`]],
    pasos: (g, _x, _y, rengR) => [`ρ = P·M/(R·T) con M = ${tx(M(g.f), 5)} g/mol.`, `ρ = ${tx(rengR)} g/L.`],
    pistas: ['Usa PV = nRT.', 'Usa n = m/M.', 'Despeja m/V.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s8-p3', titulo: 'Expansión del agua al hervir', unidad: '',
    objetivo: 'Comparar el volumen de una masa de agua como líquido y como vapor a 100 °C.', seccion: '1.2', para: 'los estados de agregación', masas: true,
    idealizado: 'Vapor como gas ideal a 373,15 K y 101,325 kPa; agua líquida de 1,00 g/mL.', metodo: 'escena «gas-ideal»', sinVerificar: [], lista: [0], x: [1, 500, 1],
    respuesta: (_e, x) => (((x / M('H2O')) * RENG_R_FU * 373.15) / 101.325) * 1000 / x,
    errores: (_e, x) => [
      ['sin-mil', 'Litros frente a mililitros', (((x / M('H2O')) * RENG_R_FU * 373.15) / 101.325) / x, 'Comparaste litros con mililitros: pasa los dos volúmenes a la misma unidad.'],
      ['celsius', 'Con 100 en lugar de 373,15', (((x / M('H2O')) * RENG_R_FU * 100) / 101.325) * 1000 / x, 'En PV = nRT la temperatura va en kelvin.']
    ],
    enunciado: (_e, x) => `${tx(x)} g de agua líquida (1,00 g/mL) se convierten en vapor a 100 °C y 101,325 kPa.`, pregunta: '¿Cuántas veces mayor es el volumen del vapor que el del líquido?',
    datos: (_e, x) => [['Agua', `${tx(x)} g`], ['Condiciones', '373,15 K y 101,325 kPa']],
    pasos: (_e, x, _y, rengR) => [`V(líquido) = ${tx(x)} mL; V(vapor) = nRT/P en L.`, `Cociente = ${tx(rengR, 4)} (el vapor ocupa unas 1700 veces más).`],
    pistas: ['Calcula los moles de agua.', 'Volumen del vapor con PV = nRT.', 'Pasa todo a mL y divide.']
  })
]
