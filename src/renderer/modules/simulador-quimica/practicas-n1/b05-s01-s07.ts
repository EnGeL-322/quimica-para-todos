import { rengTx } from '../aprender/n1/gases/constantes'
import {
  RENG_CENTRAL_NO, RENG_ELEMENTO_NO, RENG_IONES_NO, RENG_METAL_OX_NO, RENG_OXIDOS_METAL_NO, RENG_OXIDOS_NM_NO, RENG_OXIDOS_SIS_NO, RENG_OXOACIDOS_NO, RENG_PARENTESIS_NO, RENG_SISTEMATICA_NO, RENG_STOCK_NO, RENG_TOL_NO_ENT, RENG_TRADICIONAL_NO,
  rengAnNo, rengAtomosNo, rengDatoMNo, rengDeNo, rengFBinInvNo, rengFBinNo, rengFStockNo, rengMNo, rengMRomanoSubNo, rengMSinCruzarNo, rengOxAcidoNo, rengOxCentralNo, rengOxIonNo, rengOxidoNo, rengPracticaNo, rengTotalNo, rengTxtNo
} from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const M = rengMNo
const A = rengAnNo
const T = rengTxtNo
const tx = rengTx
const sinPar = (rengF: string): number => rengTotalNo(rengF.replace(/\)[0-9]+/g, ')'))

export const RENG_PRACTICAS_B05_S01: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s1-p1', titulo: 'Átomos de una fórmula con paréntesis', dificultad: 'basica', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Contar los átomos de una fórmula aplicando el subíndice de un paréntesis a todo su contenido.', seccion: '2.4', para: 'la lectura de fórmulas', nombres: false,
    idealizado: 'Fórmulas como proporciones de átomos.', metodo: 'recuento con el analizador de fórmulas del núcleo', lista: RENG_PARENTESIS_NO,
    respuesta: ([, f]) => rengTotalNo(f),
    errores: ([, f]) => [
      ['sin-parentesis', 'Sin multiplicar el paréntesis', sinPar(f), 'El subíndice que sigue al paréntesis multiplica todos los átomos que hay dentro de él.'],
      ['tipos', 'Número de elementos', rengAtomosNo(f).size, 'Contaste cuántos elementos distintos hay; la pregunta pide el total de átomos.']
    ],
    enunciado: ([n, f]) => `El ${n} tiene la fórmula ${T(f)}.`, pregunta: '¿Cuántos átomos hay en total en una fórmula?',
    datos: ([n, f]) => [['Compuesto', n], ['Fórmula', T(f)]],
    pasos: (_e, _x, _y, rengR) => ['Multiplica cada subíndice interior por el del paréntesis.', `Suma todos los átomos: ${tx(rengR)}.`],
    pistas: ['Desarrolla el paréntesis.', 'Multiplica por el subíndice exterior.', 'Suma todos los átomos.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s1-p2', titulo: 'Masa de un elemento en una muestra', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa de un elemento contenida en una masa de compuesto usando los subíndices de la fórmula.', seccion: '2.4', para: 'la composición de las fórmulas',
    idealizado: 'Compuesto puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_ELEMENTO_NO, x: [5, 200, 0.5],
    valida: ([, f, el]) => Math.abs((rengDeNo(f, el) * A(el)) / M(f) - 0.5) > 0.05,
    respuesta: ([, f, el], x) => (x * rengDeNo(f, el) * A(el)) / M(f),
    errores: ([, f, el], x) => [
      ['sin-subindice', 'Sin el subíndice', (x * A(el)) / M(f), `Usaste un solo átomo de ${el}; la fórmula tiene ${rengDeNo(f, el)} por unidad.`],
      ['resto', 'Masa del resto', (x * (M(f) - rengDeNo(f, el) * A(el))) / M(f), `Calculaste la masa de los demás elementos, no la de ${el}.`]
    ],
    enunciado: ([n, f], x) => `Una muestra contiene ${tx(x)} g de ${n} (${T(f)}).`, pregunta: '¿Qué masa del elemento indicado contiene, en g?',
    datos: ([, f, el], x) => [['Muestra', `${tx(x)} g de ${T(f)}`], ['Elemento', el], rengDatoMNo(f)],
    pasos: ([, f, el], x, _y, rengR) => [`Fracción de ${el}: ${rengDeNo(f, el)}·M(${el})/M = ${tx((rengDeNo(f, el) * A(el)) / M(f), 4)}.`, `m = ${tx(x)} × fracción = ${tx(rengR)} g.`],
    pistas: ['Cuenta los átomos del elemento.', 'Calcula su fracción en masa.', 'Multiplica por la masa de la muestra.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s1-p3', titulo: 'Moles de átomos en un compuesto', dificultad: 'avanzada', unidad: 'mol',
    objetivo: 'Relacionar los moles de compuesto con los moles de átomos de un elemento a través del subíndice.', seccion: '2.4', para: 'los subíndices',
    idealizado: 'Compuesto puro.', metodo: 'analizador de fórmulas del núcleo', lista: RENG_ELEMENTO_NO, x: [0.1, 5, 0.05],
    respuesta: ([, f, el], x) => x * rengDeNo(f, el),
    errores: ([, f], x) => [
      ['sin-subindice', 'Sin el subíndice', x, 'Un mol de compuesto contiene tantos moles de átomos del elemento como indica su subíndice.'],
      ['total', 'Todos los átomos', x * rengTotalNo(f), 'Contaste todos los átomos de la fórmula, no solo los del elemento pedido.']
    ],
    enunciado: ([n, f], x) => `Se tienen ${tx(x)} mol de ${n} (${T(f)}).`, pregunta: '¿Cuántos moles de átomos del elemento indicado contienen?',
    datos: ([, f, el], x) => [['Compuesto', `${tx(x)} mol de ${T(f)}`], ['Elemento', el]],
    pasos: ([, f, el], x, _y, rengR) => [`Cada fórmula tiene ${rengDeNo(f, el)} átomos de ${el}.`, `n = ${tx(x)} × ${rengDeNo(f, el)} = ${tx(rengR)} mol.`],
    pistas: ['Lee el subíndice del elemento.', 'Ten en cuenta los paréntesis.', 'Multiplica por los moles.']
  })
]

export const RENG_PRACTICAS_B05_S02: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s2-p1', titulo: 'Número de oxidación del átomo central', dificultad: 'basica', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Calcular el número de oxidación del átomo central con la regla de la suma cero.', seccion: '4.2', para: 'los números de oxidación', nombres: false,
    idealizado: 'Reglas habituales de asignación.', metodo: 'regla de suma cero del núcleo', lista: RENG_CENTRAL_NO,
    respuesta: (c) => rengOxCentralNo(c),
    errores: (c) => [
      ['oxigeno-1', 'Oxígeno con −1', rengOxCentralNo(c, -1), 'El oxígeno actúa con −2 salvo en los peróxidos; aquí no hay ningún peróxido.'],
      ['signo', 'Signo cambiado', -rengOxCentralNo(c), 'El signo está cambiado: el átomo central compensa la carga negativa de los oxígenos.']
    ],
    enunciado: (c) => `En la especie ${T(c.f)}, el H y los metales alcalinos actúan con +1, los alcalinotérreos con +2 y el O con −2.`, pregunta: '¿Cuál es el número de oxidación del átomo central?',
    datos: (c) => [['Fórmula', T(c.f)], ['Átomo central', c.el]],
    pasos: (c, _x, _y, rengR) => ['Plantea la suma de números de oxidación igual a 0, multiplicando por los subíndices.', `Despeja el de ${c.el}: ${tx(rengR)}.`],
    pistas: ['La suma es cero.', 'Multiplica por los subíndices.', 'Despeja el átomo central.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s2-p2', titulo: 'Número de oxidación de un metal', dificultad: 'intermedia', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Calcular el número de oxidación de un metal repartiendo la carga negativa entre sus átomos.', seccion: '4.2', para: 'los números de oxidación', nombres: false,
    idealizado: 'Compuestos iónicos sencillos.', metodo: 'regla de suma cero del núcleo', lista: RENG_METAL_OX_NO,
    respuesta: (c) => (c.za * c.na) / rengDeNo(c.f, c.el),
    errores: (c) => [
      ['un-anion', 'Carga de un solo anión', c.za, 'Tomaste la carga de un solo anión; hay que repartir la carga de todos entre los átomos del metal.'],
      ['sin-dividir', 'Sin repartir entre los metales', c.za * c.na, 'Esa es la carga negativa total; repártela entre los átomos del metal de la fórmula.']
    ],
    enunciado: (c) => `En el compuesto ${T(c.f)}, la carga negativa total es ${c.za * c.na} (${c.na} aniones de carga ${c.za}−).`, pregunta: '¿Con qué número de oxidación actúa el metal?',
    datos: (c) => [['Fórmula', T(c.f)], ['Carga negativa total', `${c.za * c.na}−`]],
    pasos: (c, _x, _y, rengR) => [`${rengDeNo(c.f, c.el)}·x = ${c.za * c.na}.`, `x = +${tx(rengR)}.`],
    pistas: ['Calcula la carga negativa total.', 'Cuenta los átomos del metal.', 'Divide para obtener el resultado.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s2-p3', titulo: 'Número de oxidación en un ion', dificultad: 'avanzada', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Calcular el número de oxidación en un ion poliatómico, donde la suma es igual a la carga del ion.', seccion: '4.2', para: 'los números de oxidación en iones', nombres: false,
    idealizado: 'Iones poliatómicos habituales.', metodo: 'número de oxidación en el ácido neutro correspondiente, con el núcleo', lista: RENG_IONES_NO,
    respuesta: (i) => rengOxIonNo(i, i.q),
    errores: (i) => [
      ['sin-carga', 'Suma igualada a cero', rengOxIonNo(i, 0), 'En un ion la suma de números de oxidación es igual a su carga, no a cero.'],
      ['carga-signo', 'Carga con el signo cambiado', rengOxIonNo(i, -i.q), 'La carga del ion es negativa; la usaste como positiva.']
    ],
    enunciado: (i) => `Considera el ion ${i.texto}. El O actúa con −2 y el H, si lo hay, con +1.`, pregunta: (i) => `¿Cuál es el número de oxidación del ${i.el} en el ion?`,
    datos: (i) => [['Ion', i.texto], ['Carga', `${i.q}−`]],
    pasos: (i, _x, _y, rengR) => [`La suma de números de oxidación es −${i.q}.`, `${i.el}: ${tx(rengR)}.`],
    pistas: ['La suma es la carga del ion.', 'El O vale −2.', 'Despeja el elemento.']
  })
]

export const RENG_PRACTICAS_B05_S03: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s3-p1', titulo: 'Masa molecular desde un nombre sistemático', dificultad: 'basica', unidad: 'g/mol',
    objetivo: 'Pasar de un nombre sistemático con prefijos a la fórmula y a la masa molecular.', seccion: '2.7', para: 'la nomenclatura sistemática',
    idealizado: 'Compuestos binarios.', metodo: 'formulación desde el nombre con el núcleo', lista: RENG_SISTEMATICA_NO,
    respuesta: (b) => M(rengFBinNo(b)),
    errores: (b) => [
      ['invertidos', 'Prefijos intercambiados', M(rengFBinInvNo(b)), 'Cada prefijo va con el elemento que le sigue en el nombre; los intercambiaste.'],
      ['sin-prefijos', 'Sin prefijos', A(b.x) + A(b.y), 'Ignoraste los prefijos: indican cuántos átomos hay de cada elemento.']
    ],
    enunciado: (b) => `Un compuesto se llama «${b.n}».`, pregunta: '¿Cuál es su masa molecular, en g/mol?',
    datos: (b) => [['Nombre', b.n], [`M(${b.x})`, `${tx(A(b.x), 5)} g/mol`], [`M(${b.y})`, `${tx(A(b.y), 5)} g/mol`]],
    pasos: (b, _x, _y, rengR) => [`Fórmula: ${T(rengFBinNo(b))}.`, `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Traduce los prefijos.', 'Escribe la fórmula.', 'Suma las masas atómicas.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s3-p2', titulo: 'Oxígeno en una muestra de óxido', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa de oxígeno de una muestra a partir del nombre sistemático del óxido.', seccion: '2.7', para: 'la nomenclatura sistemática',
    idealizado: 'Compuesto puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_OXIDOS_SIS_NO, x: [2, 100, 0.5],
    respuesta: (b, x) => (x * b.ny * A('O')) / M(rengFBinNo(b)),
    errores: (b, x) => [
      ['invertidos', 'Prefijos intercambiados', (x * b.nx * A('O')) / M(rengFBinInvNo(b)), 'Intercambiaste los prefijos: el que precede a «óxido» indica los oxígenos.'],
      ['un-oxigeno', 'Un solo oxígeno', (x * A('O')) / M(rengFBinNo(b)), 'Contaste un solo oxígeno; el prefijo indica cuántos hay.']
    ],
    enunciado: (b, x) => `Una muestra contiene ${tx(x)} g de ${b.n}.`, pregunta: '¿Qué masa de oxígeno contiene, en g?',
    datos: (b, x) => [['Muestra', `${tx(x)} g`], ['Nombre', b.n]],
    pasos: (b, x, _y, rengR) => [`Fórmula ${T(rengFBinNo(b))}: ${b.ny} O por fórmula.`, `m(O) = ${tx(x)} × ${b.ny}·M(O)/M = ${tx(rengR)} g.`],
    pistas: ['Escribe la fórmula.', 'Calcula la fracción de O.', 'Multiplica por la muestra.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s3-p3', titulo: 'Moles a partir de un nombre sistemático', dificultad: 'avanzada', unidad: 'mol',
    objetivo: 'Calcular los moles de una masa de compuesto nombrado con prefijos.', seccion: '2.7', para: 'la nomenclatura sistemática',
    idealizado: 'Compuesto puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_SISTEMATICA_NO, x: [1, 300, 0.5],
    valida: (b) => b.nx !== b.ny,
    respuesta: (b, x) => x / M(rengFBinNo(b)),
    errores: (b, x) => [
      ['invertidos', 'Prefijos intercambiados', x / M(rengFBinInvNo(b)), 'Intercambiaste los prefijos al escribir la fórmula.'],
      ['sin-prefijos', 'Sin prefijos', x / (A(b.x) + A(b.y)), 'Usaste un átomo de cada elemento; los prefijos indican cuántos hay.']
    ],
    enunciado: (b, x) => `Se tienen ${tx(x)} g de ${b.n}.`, pregunta: '¿Cuántos moles son?',
    datos: (b, x) => [['Masa', `${tx(x)} g`], ['Nombre', b.n]],
    pasos: (b, x, _y, rengR) => [`Fórmula ${T(rengFBinNo(b))}, M = ${tx(M(rengFBinNo(b)), 5)} g/mol.`, `n = ${tx(x)}/M = ${tx(rengR)} mol.`],
    pistas: ['Escribe la fórmula.', 'Calcula la masa molar.', 'Divide la masa entre M.']
  })
]

export const RENG_PRACTICAS_B05_S04: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s4-p1', titulo: 'Masa fórmula desde un nombre de Stock', dificultad: 'basica', unidad: 'g/mol',
    objetivo: 'Formular un compuesto a partir de su nombre de Stock cruzando cargas y calcular su masa fórmula.', seccion: '2.7', para: 'la nomenclatura de Stock',
    idealizado: 'Compuestos iónicos sencillos.', metodo: 'formulación desde el nombre con el núcleo', lista: RENG_STOCK_NO,
    respuesta: (s) => M(rengFStockNo(s).f),
    errores: (s) => [
      ['romano-subindice', 'Número romano como subíndice', rengMRomanoSubNo(s), 'El número romano es la carga del metal, no su subíndice en la fórmula.'],
      ['sin-cruzar', 'Sin cruzar las cargas', rengMSinCruzarNo(s), 'Escribiste un ion de cada; hay que cruzar las cargas para que el total sea cero.']
    ],
    enunciado: (s) => `Un frasco dice «${s.n}».`, pregunta: '¿Cuál es la masa fórmula del compuesto, en g/mol?',
    datos: (s) => [['Nombre', s.n], [`M(${s.metal})`, `${tx(A(s.metal), 5)} g/mol`]],
    pasos: (s, _x, _y, rengR) => [`El metal actúa con +${s.z}; cruzando cargas: ${T(rengFStockNo(s).f)}.`, `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Lee el número romano.', 'Cruza y simplifica las cargas.', 'Suma las masas.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s4-p2', titulo: 'Metal en una muestra', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa de metal de una muestra de un compuesto nombrado con Stock.', seccion: '2.7', para: 'la nomenclatura de Stock',
    idealizado: 'Compuesto puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_STOCK_NO, x: [5, 200, 0.5],
    respuesta: (s, x) => (x * rengFStockNo(s).nc * A(s.metal)) / M(rengFStockNo(s).f),
    errores: (s, x) => [
      ['sin-cruzar', 'Fórmula 1:1', (x * A(s.metal)) / rengMSinCruzarNo(s), 'Usaste un ion de cada; la fórmula sale de cruzar las cargas.'],
      ['resto', 'Masa del anión', (x * (M(rengFStockNo(s).f) - rengFStockNo(s).nc * A(s.metal))) / M(rengFStockNo(s).f), 'Calculaste la masa de la parte aniónica, no la del metal.']
    ],
    enunciado: (s, x) => `Se tienen ${tx(x)} g de ${s.n}.`, pregunta: '¿Qué masa de metal contienen, en g?',
    datos: (s, x) => [['Muestra', `${tx(x)} g`], ['Nombre', s.n]],
    pasos: (s, x, _y, rengR) => [`Fórmula: ${T(rengFStockNo(s).f)}.`, `m = ${tx(x)} × ${rengFStockNo(s).nc}·M(${s.metal})/M = ${tx(rengR)} g.`],
    pistas: ['Formula desde el nombre.', 'Calcula la fracción del metal.', 'Multiplica por la muestra.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s4-p3', titulo: 'Compuesto que contiene una masa de metal', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular la masa de compuesto que contiene una masa dada del metal.', seccion: '2.7', para: 'la nomenclatura de Stock',
    idealizado: 'Compuesto puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_STOCK_NO, x: [1, 100, 0.5],
    respuesta: (s, x) => (x * M(rengFStockNo(s).f)) / (rengFStockNo(s).nc * A(s.metal)),
    errores: (s, x) => [
      ['sin-cruzar', 'Fórmula 1:1', (x * rengMSinCruzarNo(s)) / A(s.metal), 'Usaste un ion de cada; la fórmula sale de cruzar las cargas.'],
      ['invertida', 'Fracción invertida', (x * rengFStockNo(s).nc * A(s.metal)) / M(rengFStockNo(s).f), 'Multiplicaste por la fracción del metal en lugar de dividir: el compuesto pesa más que su metal.']
    ],
    enunciado: (s, x) => `Se necesitan ${tx(x)} g de metal en forma de ${s.n}.`, pregunta: '¿Qué masa del compuesto hay que pesar, en g?',
    datos: (s, x) => [['Metal', `${tx(x)} g de ${s.metal}`], ['Compuesto', s.n]],
    pasos: (s, x, _y, rengR) => [`Fórmula ${T(rengFStockNo(s).f)}; fracción de ${s.metal}: ${tx((rengFStockNo(s).nc * A(s.metal)) / M(rengFStockNo(s).f), 4)}.`, `m = ${tx(x)}/fracción = ${tx(rengR)} g.`],
    pistas: ['Formula desde el nombre.', 'Calcula la fracción del metal.', 'Divide la masa de metal entre ella.']
  })
]

export const RENG_PRACTICAS_B05_S05: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s5-p1', titulo: 'Valencia en un oxoácido tradicional', dificultad: 'basica', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Deducir el número de oxidación del átomo central a partir del nombre tradicional de un oxoácido.', seccion: '2.7', para: 'la nomenclatura tradicional',
    idealizado: 'Oxoácidos de un átomo central.', metodo: 'formulación desde el nombre y regla de suma cero del núcleo', lista: RENG_OXOACIDOS_NO,
    respuesta: (o) => rengOxAcidoNo(o.f, o.el),
    errores: (o) => [
      ['oxigenos', 'Número de oxígenos', rengDeNo(o.f, 'O'), 'Diste el número de oxígenos; el número de oxidación sale de la suma cero.'],
      ['sin-h', 'Sin los hidrógenos', 2 * rengDeNo(o.f, 'O'), 'Olvidaste restar la carga de los hidrógenos (+1 cada uno).']
    ],
    enunciado: (o) => `El ${o.n} tiene la fórmula ${T(o.f)}.`, pregunta: '¿Con qué número de oxidación actúa el átomo central?',
    datos: (o) => [['Nombre', o.n], ['Fórmula', T(o.f)]],
    pasos: (o, _x, _y, rengR) => [`H +1 y O −2: ${rengDeNo(o.f, 'H')}(+1) + x + ${rengDeNo(o.f, 'O')}(−2) = 0.`, `x = +${tx(rengR)}, que concuerda con el sufijo del nombre.`],
    pistas: ['La suma debe ser cero.', 'H +1 y O −2.', 'Comprueba con el sufijo.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s5-p2', titulo: 'Masa de un compuesto con -oso o -ico', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Interpretar los sufijos -oso e -ico para formular el compuesto y calcular la masa de una cantidad dada.', seccion: '2.7', para: 'la nomenclatura tradicional',
    idealizado: 'Valencias habituales.', metodo: 'formulación desde el nombre tradicional con el núcleo', lista: RENG_TRADICIONAL_NO, x: [0.05, 5, 0.05],
    respuesta: (t, x) => x * M(rengFStockNo(t).f),
    errores: (t, x) => [
      ['oso-ico', 'Valencia equivocada', x * M(rengFStockNo(t, t.otra).f), `Usaste la otra valencia del metal (${t.otra}); -oso es la menor e -ico la mayor.`],
      ['sin-cruzar', 'Sin cruzar las cargas', x * rengMSinCruzarNo(t), 'Escribiste un ion de cada; hay que cruzar las cargas para que el total sea cero.']
    ],
    enunciado: (t, x) => `Se tienen ${tx(x)} mol de ${t.n}. Su metal puede actuar con +${Math.min(t.z, t.otra)} y +${Math.max(t.z, t.otra)}.`, pregunta: '¿Qué masa de compuesto es, en g?',
    datos: (t, x) => [['Cantidad', `${tx(x)} mol`], ['Nombre', t.n], ['Valencias', `${Math.min(t.z, t.otra)} y ${Math.max(t.z, t.otra)}`]],
    pasos: (t, _x, _y, rengR) => [`El sufijo indica +${t.z}: ${T(rengFStockNo(t).f)}, M = ${tx(M(rengFStockNo(t).f), 5)} g/mol.`, `m = n·M = ${tx(rengR)} g.`],
    pistas: ['-oso es la menor.', '-ico es la mayor.', 'Cruza las cargas.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s5-p3', titulo: 'Átomo central en una muestra de ácido', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Formular un oxoácido desde su nombre tradicional y calcular la masa de su átomo central en una muestra.', seccion: '2.7', para: 'la nomenclatura tradicional',
    idealizado: 'Ácido puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_OXOACIDOS_NO, x: [2, 200, 0.5],
    respuesta: (o, x) => (x * A(o.el)) / M(o.f),
    errores: (o, x) => [
      ['oxigeno', 'Masa de oxígeno', (x * rengDeNo(o.f, 'O') * A('O')) / M(o.f), 'Calculaste la masa del oxígeno, no la del átomo central.'],
      ['sufijo', 'Ácido con un oxígeno menos', (x * A(o.el)) / M(o.menos), 'Formulaste el ácido de valencia inferior; revisa el sufijo y los prefijos.']
    ],
    enunciado: (o, x) => `Una muestra contiene ${tx(x)} g de ${o.n}.`, pregunta: '¿Qué masa del átomo central (el no metal o metal que da nombre al ácido) contiene, en g?',
    datos: (o, x) => [['Muestra', `${tx(x)} g`], ['Nombre', o.n]],
    pasos: (o, x, _y, rengR) => [`Fórmula: ${T(o.f)}.`, `m(${o.el}) = ${tx(x)} × M(${o.el})/M = ${tx(rengR)} g.`],
    pistas: ['Formula el ácido.', 'Un átomo central por fórmula.', 'Multiplica por la fracción.']
  })
]

export const RENG_PRACTICAS_B05_S06: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s6-p1', titulo: 'Oxígeno que se combina con un metal', dificultad: 'basica', unidad: 'g',
    objetivo: 'Calcular la masa de oxígeno que se combina con una masa de metal a partir de la fórmula del óxido.', seccion: '2.6', para: 'los óxidos metálicos',
    idealizado: 'Oxidación completa al óxido indicado.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_OXIDOS_METAL_NO, x: [1, 100, 0.5],
    respuesta: (m, x) => (x / A(m.metal)) * (rengOxidoNo(m).na / rengOxidoNo(m).nc) * A('O'),
    errores: (m, x) => [
      ['sin-cruzar', 'Proporción 1:1', (x / A(m.metal)) * A('O'), 'Supusiste un oxígeno por átomo de metal; la proporción sale de la fórmula del óxido.'],
      ['invertida', 'Proporción invertida', (x / A(m.metal)) * (rengOxidoNo(m).nc / rengOxidoNo(m).na) * A('O'), 'Invertiste la proporción entre oxígeno y metal.']
    ],
    enunciado: (m, x) => `Se oxidan ${tx(x)} g de ${m.metal} hasta formar ${m.n}.`, pregunta: '¿Qué masa de oxígeno se combina, en g?',
    datos: (m, x) => [['Metal', `${tx(x)} g de ${m.metal}`], ['Producto', m.n]],
    pasos: (m, x, _y, rengR) => [`Fórmula ${T(rengOxidoNo(m).f)}: ${rengOxidoNo(m).na} O por ${rengOxidoNo(m).nc} ${m.metal}.`, `m(O) = ${tx(rengR)} g.`],
    pistas: ['Formula el óxido.', 'Relaciona moles de O y de metal.', 'Pasa a gramos.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s6-p2', titulo: 'Óxido formado con una masa de metal', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa de óxido que se forma a partir de una masa de metal.', seccion: '2.6', para: 'los óxidos metálicos',
    idealizado: 'Oxidación completa.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_OXIDOS_METAL_NO, x: [1, 100, 0.5],
    respuesta: (m, x) => (x / A(m.metal) / rengOxidoNo(m).nc) * M(rengOxidoNo(m).f),
    errores: (m, x) => [
      ['sin-cruzar', 'Fórmula 1:1', (x / A(m.metal)) * (A(m.metal) + A('O')), 'Supusiste un óxido de fórmula 1:1; hay que cruzar las cargas.'],
      ['sin-dividir', 'Sin dividir entre el subíndice', (x / A(m.metal)) * M(rengOxidoNo(m).f), 'Cada fórmula de óxido contiene varios átomos de metal: divide los moles de metal entre su subíndice.']
    ],
    enunciado: (m, x) => `Se oxidan por completo ${tx(x)} g de ${m.metal} y se obtiene ${m.n}.`, pregunta: '¿Qué masa de óxido se forma, en g?',
    datos: (m, x) => [['Metal', `${tx(x)} g`], ['Óxido', m.n]],
    pasos: (m, x, _y, rengR) => [`Fórmula ${T(rengOxidoNo(m).f)}.`, `n(óxido) = n(${m.metal})/${rengOxidoNo(m).nc}; m = ${tx(rengR)} g.`],
    pistas: ['Formula el óxido.', 'Divide los moles de metal entre su subíndice.', 'Multiplica por la masa fórmula.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s6-p3', titulo: 'Iones óxido en una muestra', dificultad: 'avanzada', unidad: 'mol',
    objetivo: 'Calcular los moles de iones O²⁻ que hay en una masa de óxido metálico.', seccion: '2.6', para: 'los óxidos metálicos',
    idealizado: 'Óxido iónico puro.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_OXIDOS_METAL_NO, x: [1, 200, 0.5],
    respuesta: (m, x) => (x / M(rengOxidoNo(m).f)) * rengOxidoNo(m).na,
    errores: (m, x) => [
      ['sin-subindice', 'Sin el subíndice', x / M(rengOxidoNo(m).f), 'Esos son los moles de óxido; multiplica por los O²⁻ de cada fórmula.'],
      ['metal', 'Iones del metal', (x / M(rengOxidoNo(m).f)) * rengOxidoNo(m).nc, 'Usaste el subíndice del metal en lugar del del oxígeno.']
    ],
    enunciado: (m, x) => `Se tienen ${tx(x)} g de ${m.n}.`, pregunta: '¿Cuántos moles de iones óxido (O²⁻) contienen?',
    datos: (m, x) => [['Muestra', `${tx(x)} g`], ['Óxido', m.n]],
    pasos: (m, x, _y, rengR) => [`Fórmula ${T(rengOxidoNo(m).f)}, M = ${tx(M(rengOxidoNo(m).f), 5)} g/mol.`, `n(O²⁻) = n·${rengOxidoNo(m).na} = ${tx(rengR)} mol.`],
    pistas: ['Formula el óxido.', 'Calcula los moles de óxido.', 'Multiplica por los O de la fórmula.']
  })
]

export const RENG_PRACTICAS_B05_S07: readonly RengPracticaN1[] = [
  rengPracticaNo({
    id: 'n1-b5-s7-p1', titulo: 'Número de oxidación en un óxido no metálico', dificultad: 'basica', unidad: '', tolerancia: RENG_TOL_NO_ENT,
    objetivo: 'Calcular el número de oxidación del no metal en un óxido molecular.', seccion: '2.7', para: 'los óxidos no metálicos', nombres: false,
    idealizado: 'O con −2.', metodo: 'regla de suma cero del núcleo', lista: RENG_OXIDOS_NM_NO,
    respuesta: (o) => (2 * rengDeNo(o.f, 'O')) / rengDeNo(o.f, o.el),
    errores: (o) => [
      ['oxigeno-1', 'Oxígeno con −1', rengDeNo(o.f, 'O') / rengDeNo(o.f, o.el), 'El oxígeno actúa con −2 en los óxidos; −1 es solo en los peróxidos.'],
      ['signo', 'Signo cambiado', (-2 * rengDeNo(o.f, 'O')) / rengDeNo(o.f, o.el), 'El no metal compensa la carga negativa del oxígeno: su número es positivo.']
    ],
    enunciado: (o) => `Considera el óxido ${T(o.f)}.`, pregunta: (o) => `¿Cuál es el número de oxidación del ${o.el}?`,
    datos: (o) => [['Fórmula', T(o.f)], ['O', '−2']],
    pasos: (o, _x, _y, rengR) => [`${rengDeNo(o.f, o.el)}·x + ${rengDeNo(o.f, 'O')}(−2) = 0.`, `x = +${tx(rengR)}.`],
    pistas: ['La suma es cero.', 'El O vale −2.', 'Divide entre los átomos del no metal.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s7-p2', titulo: 'Óxido formado con un no metal', dificultad: 'intermedia', unidad: 'g',
    objetivo: 'Calcular la masa de óxido que se obtiene a partir de una masa del no metal.', seccion: '2.7', para: 'los óxidos no metálicos',
    idealizado: 'Conversión completa.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_OXIDOS_SIS_NO, x: [1, 100, 0.5],
    respuesta: (b, x) => (x / A(b.x) / b.nx) * M(rengFBinNo(b)),
    errores: (b, x) => [
      ['sin-dividir', 'Sin dividir entre el subíndice', (x / A(b.x)) * M(rengFBinNo(b)), 'Cada molécula contiene varios átomos del no metal: divide sus moles entre el subíndice.'],
      ['masa-igual', 'Misma masa', x, 'La masa del óxido incluye el oxígeno; no puede ser igual a la del no metal.']
    ],
    enunciado: (b, x) => `Todo el ${b.x} de ${tx(x)} g del elemento se convierte en ${b.n}.`, pregunta: '¿Qué masa de óxido se obtiene, en g?',
    datos: (b, x) => [['Elemento', `${tx(x)} g de ${b.x}`], ['Óxido', b.n]],
    pasos: (b, x, _y, rengR) => [`Fórmula ${T(rengFBinNo(b))}.`, `n(óxido) = n(${b.x})/${b.nx}; m = ${tx(rengR)} g.`],
    pistas: ['Formula el óxido.', 'Conserva los átomos del no metal.', 'Pasa a gramos.']
  }),
  rengPracticaNo({
    id: 'n1-b5-s7-p3', titulo: 'Oxígeno para formar un óxido', dificultad: 'avanzada', unidad: 'g',
    objetivo: 'Calcular la masa de O₂ necesaria para convertir una masa de no metal en su óxido.', seccion: '2.7', para: 'los óxidos no metálicos',
    idealizado: 'Conversión completa.', metodo: 'formulación desde el nombre y masas del núcleo', lista: RENG_OXIDOS_SIS_NO, x: [1, 100, 0.5],
    respuesta: (b, x) => (x / A(b.x)) * (b.ny / b.nx) * A('O'),
    errores: (b, x) => [
      ['molecular', 'Moles de O₂ como de O', (x / A(b.x)) * (b.ny / b.nx) * 2 * A('O'), 'Contaste un O₂ por cada átomo de O; cada molécula de O₂ aporta dos.'],
      ['sin-subindices', 'Proporción 1:1', (x / A(b.x)) * A('O'), 'La proporción de oxígeno sale de los prefijos del nombre.']
    ],
    enunciado: (b, x) => `Se quiere convertir ${tx(x)} g de ${b.x} en ${b.n}.`, pregunta: '¿Qué masa de O₂ se necesita, en g?',
    datos: (b, x) => [['Elemento', `${tx(x)} g de ${b.x}`], ['Óxido', b.n]],
    pasos: (b, x, _y, rengR) => [`${b.ny} O por cada ${b.nx} ${b.x} (${T(rengFBinNo(b))}).`, `m(O₂) = ${tx(rengR)} g.`],
    pistas: ['Formula el óxido.', 'Calcula los moles de O.', 'La masa de O₂ es la de esos átomos de O.']
  })
]
