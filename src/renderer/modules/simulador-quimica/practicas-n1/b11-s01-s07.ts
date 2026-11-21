import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_C_AGUA_SIN_VERIFICAR, RENG_C_AGUA_TE, RENG_REACCIONES_TE, RENG_SALES_DISOLUCION_TE, RENG_TOL_TE, RENG_TOL_TE_T, rengDhTe, rengFuentesTe, rengMmTe, rengNuCombustible } from './b11-comun'
import { rengSubindice } from '../nucleo/formula'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const C = RENG_C_AGUA_TE
const CSV = [RENG_C_AGUA_SIN_VERIFICAR]
const rengTf = (rengM1: number, rengC1: number, rengT1: number, rengM2: number, rengC2: number, rengT2: number): number => (rengM1 * rengC1 * rengT1 + rengM2 * rengC2 * rengT2) / (rengM1 * rengC1 + rengM2 * rengC2)
const rengR2 = (rengX: number): number => Math.round(rengX * 100) / 100
const rx = (rengI: number) => RENG_REACCIONES_TE[rengI]!

export const RENG_PRACTICAS_B11_S01: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s1-p1', subtema: 'n1-b11-s1', titulo: 'Calor para calentar agua', dificultad: 'basica',
    objetivo: 'Calcular el calor que absorbe una masa de agua al cambiar su temperatura con q = m·c·ΔT.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.1', 'calor y temperatura'), idealizado: 'Sin pérdidas ni cambios de estado.', metodo: 'temperaturas pasadas a kelvin y julios a kJ con el catálogo', sinVerificar: CSV,
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 50, 2000, 10), t1: rengEntreN1(rengRng, 5, 40, 0.5), d: rengEntreN1(rengRng, 5, 55, 0.5) }),
    respuesta: (rengD) => (rengD.m * C * rengD.d) / 1000,
    errores: (rengD) => [
      ['kelvin', 'Sumar 273,15 al cambio', (rengD.m * C * (rengD.d + 273.15)) / 1000, 'Sumaste 273,15 al cambio de temperatura; un cambio de 1 °C es un cambio de 1 K.'],
      ['julios', 'Resultado en julios', rengD.m * C * rengD.d, 'Ese valor está en julios; la pregunta pide kJ.']
    ],
    enunciado: (rengD) => `Se calientan ${rengTx(rengD.m)} g de agua de ${rengTx(rengD.t1)} °C a ${rengTx(rengD.t1 + rengD.d)} °C. c(agua) = 4,184 J/(g·K).`,
    pregunta: () => '¿Cuánto calor absorbe el agua, en kJ?',
    datos: (rengD) => [['Agua', `${rengTx(rengD.m)} g`], ['Temperaturas', `${rengTx(rengD.t1)} → ${rengTx(rengD.t1 + rengD.d)} °C`]],
    pasos: (rengD, rengR) => [`ΔT = ${rengTx(rengD.d)} K.`, `q = m·c·ΔT = ${rengTx(rengR)} kJ.`],
    pistas: ['Usa q = m·c·ΔT.', 'ΔT en °C y en K es igual.', 'Pasa los julios a kJ.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s1-p2', subtema: 'n1-b11-s1', titulo: 'Mezcla de agua caliente y fría', dificultad: 'intermedia',
    objetivo: 'Calcular la temperatura final al mezclar dos masas de agua a distinta temperatura.', unidad: '°C', tolerancia: RENG_TOL_TE_T,
    fuentes: rengFuentesTe('5.1', 'el equilibrio térmico'), idealizado: 'Recipiente aislado sin pérdidas.', metodo: 'balance de calor con la escena del calorímetro',
    parametros: (rengRng) => ({ m1: rengEntreN1(rengRng, 50, 1000, 10), t1: rengEntreN1(rengRng, 40, 95, 0.5), m2: rengEntreN1(rengRng, 50, 1000, 10), t2: rengEntreN1(rengRng, 2, 30, 0.5) }),
    valida: (rengD) => Math.abs(rengD.m1 - rengD.m2) > 0.15 * Math.max(rengD.m1, rengD.m2),
    respuesta: (rengD) => (rengD.m1 * rengD.t1 + rengD.m2 * rengD.t2) / (rengD.m1 + rengD.m2),
    errores: (rengD) => [
      ['media', 'Media simple', (rengD.t1 + rengD.t2) / 2, 'Hiciste la media simple de las temperaturas; cada agua pesa según su masa.'],
      ['cruzada', 'Masas cruzadas', (rengD.m2 * rengD.t1 + rengD.m1 * rengD.t2) / (rengD.m1 + rengD.m2), 'Cruzaste las masas: cada temperatura va con la masa de su propia agua.']
    ],
    enunciado: (rengD) => `Se mezclan ${rengTx(rengD.m1)} g de agua a ${rengTx(rengD.t1)} °C con ${rengTx(rengD.m2)} g de agua a ${rengTx(rengD.t2)} °C en un recipiente aislado.`,
    pregunta: () => '¿Cuál es la temperatura final, en °C?',
    datos: (rengD) => [['Agua caliente', `${rengTx(rengD.m1)} g a ${rengTx(rengD.t1)} °C`], ['Agua fría', `${rengTx(rengD.m2)} g a ${rengTx(rengD.t2)} °C`]],
    pasos: (rengD, rengR) => ['El calor que cede el agua caliente lo recibe la fría; el c se cancela.', `T_f = (m₁T₁ + m₂T₂)/(m₁ + m₂) = ${rengTx(rengR, 4)} °C.`],
    pistas: ['Calor cedido = calor recibido.', 'El calor específico es el mismo.', 'Es una media ponderada por las masas.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s1-p3', subtema: 'n1-b11-s1', titulo: 'Agua caliente para una temperatura dada', dificultad: 'avanzada',
    objetivo: 'Calcular la masa de agua caliente que hay que añadir para que una mezcla llegue a una temperatura dada.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.1', 'el equilibrio térmico'), idealizado: 'Sin pérdidas.', metodo: 'búsqueda por bisección de la masa con la escena del calorímetro',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 100, 2000, 10), tc: rengEntreN1(rengRng, 5, 25, 0.5), th: rengEntreN1(rengRng, 60, 95, 0.5), tf: rengEntreN1(rengRng, 28, 55, 0.5) }),
    respuesta: (rengD) => (rengD.m * (rengD.tf - rengD.tc)) / (rengD.th - rengD.tf),
    errores: (rengD) => [
      ['invertida', 'Proporción invertida', (rengD.m * (rengD.th - rengD.tf)) / (rengD.tf - rengD.tc), 'Invertiste las diferencias de temperatura; el agua caliente cede (T_c − T_f) por gramo.'],
      ['sin-diferencias', 'Con temperaturas, no diferencias', (rengD.m * rengD.tf) / rengD.th, 'Usaste temperaturas en lugar de diferencias; el balance se hace con lo que cambia cada agua.']
    ],
    enunciado: (rengD) => `Hay ${rengTx(rengD.m)} g de agua a ${rengTx(rengD.tc)} °C. Se quiere añadir agua a ${rengTx(rengD.th)} °C para que la mezcla quede a ${rengTx(rengD.tf)} °C (sin pérdidas).`,
    pregunta: () => '¿Qué masa de agua caliente hay que añadir, en g?',
    datos: (rengD) => [['Agua fría', `${rengTx(rengD.m)} g a ${rengTx(rengD.tc)} °C`], ['Agua caliente', `${rengTx(rengD.th)} °C`], ['Objetivo', `${rengTx(rengD.tf)} °C`]],
    pasos: (rengD, rengR) => ['m_c·(T_c − T_f) = m·(T_f − T_frío).', `m_c = ${rengTx(rengR)} g.`],
    pistas: ['Plantea calor cedido = calor recibido.', 'Usa las diferencias de temperatura de cada agua.', 'Despeja la masa caliente.']
  })
]

export const RENG_PRACTICAS_B11_S02: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s2-p1', subtema: 'n1-b11-s2', titulo: 'Capacidad calorífica de un objeto', dificultad: 'basica',
    objetivo: 'Calcular la capacidad calorífica de un objeto a partir del calor recibido y su cambio de temperatura.', unidad: 'J/K', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.2', 'la capacidad calorífica'), idealizado: 'Capacidad constante.', metodo: 'búsqueda por bisección de C en q = C·ΔT con kJ pasados a J',
    parametros: (rengRng) => ({ q: rengEntreN1(rengRng, 0.5, 50, 0.1), d: rengEntreN1(rengRng, 1, 60, 0.5) }),
    respuesta: (rengD) => (rengD.q * 1000) / rengD.d,
    errores: (rengD) => [
      ['multiplica', 'Multiplicar', rengD.q * 1000 * rengD.d, 'Multiplicaste por ΔT; la capacidad es el calor dividido entre ΔT.'],
      ['kj', 'Calor en kJ', rengD.q / rengD.d, 'Dejaste el calor en kJ; la capacidad se pide en J/K.']
    ],
    enunciado: (rengD) => `Un objeto recibe ${rengTx(rengD.q)} kJ y su temperatura sube ${rengTx(rengD.d)} K.`,
    pregunta: () => '¿Cuál es su capacidad calorífica, en J/K?',
    datos: (rengD) => [['q', `${rengTx(rengD.q)} kJ`], ['ΔT', `${rengTx(rengD.d)} K`]],
    pasos: (rengD, rengR) => ['C = q/ΔT.', `C = ${rengTx(rengD.q * 1000)} J / ${rengTx(rengD.d)} K = ${rengTx(rengR)} J/K.`],
    pistas: ['C = q / ΔT.', 'Pasa el calor a julios.', 'Divide entre el cambio de temperatura.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s2-p2', subtema: 'n1-b11-s2', titulo: 'Capacidad de un recipiente', dificultad: 'intermedia',
    objetivo: 'Calcular la capacidad calorífica de un objeto a partir de su masa y del calor específico de su material.', unidad: 'J/K', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.2', 'la capacidad calorífica'), idealizado: 'Material homogéneo con c didáctico.', metodo: 'calor para 1 K calculado con q = m·c·ΔT',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 10, 2000, 10), c: rengEntreN1(rengRng, 0.12, 2.5, 0.01) }),
    valida: (rengD) => rengD.m * rengD.c > 1,
    respuesta: (rengD) => rengD.m * rengD.c,
    errores: (rengD) => [
      ['divide', 'Dividir', rengD.m / rengD.c, 'Dividiste la masa entre c; la capacidad es m·c.'],
      ['solo-c', 'Solo el calor específico', rengD.c, 'Diste el calor específico, que es por gramo; el objeto entero tiene C = m·c.']
    ],
    enunciado: (rengD) => `Un recipiente de ${rengTx(rengD.m)} g está hecho de un material con c = ${rengTx(rengD.c)} J/(g·K) (dato didáctico).`,
    pregunta: () => '¿Cuál es su capacidad calorífica, en J/K?',
    datos: (rengD) => [['Masa', `${rengTx(rengD.m)} g`], ['c', `${rengTx(rengD.c)} J/(g·K)`]],
    pasos: (rengD, rengR) => ['C = m·c.', `C = ${rengTx(rengR)} J/K.`],
    pistas: ['C es del objeto entero.', 'c es por gramo.', 'Multiplica masa por c.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s2-p3', subtema: 'n1-b11-s2', titulo: 'Constante de un calorímetro', dificultad: 'avanzada',
    objetivo: 'Calcular la capacidad calorífica de un calorímetro a partir de una mezcla de agua caliente y fría.', unidad: 'J/K', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.2', 'la calibración de un calorímetro'), idealizado: 'Calorímetro sin pérdidas al exterior.', metodo: 'búsqueda por bisección de la capacidad que reproduce T_f', sinVerificar: CSV,
    parametros: (rengRng) => ({ mc: rengEntreN1(rengRng, 50, 200, 5), tc: rengEntreN1(rengRng, 15, 25, 0.5), mh: rengEntreN1(rengRng, 50, 200, 5), th: rengEntreN1(rengRng, 50, 80, 0.5), k: rengEntreN1(rengRng, 30, 300, 1) }),
    valida: (rengD) => { const rengT = rengR2((rengD.mh * C * rengD.th + (rengD.mc * C + rengD.k) * rengD.tc) / (rengD.mh * C + rengD.mc * C + rengD.k)); return (rengD.mh * C * (rengD.th - rengT) - rengD.mc * C * (rengT - rengD.tc)) / (rengT - rengD.tc) > 10 },
    respuesta: (rengD) => { const rengT = rengR2((rengD.mh * C * rengD.th + (rengD.mc * C + rengD.k) * rengD.tc) / (rengD.mh * C + rengD.mc * C + rengD.k)); return (rengD.mh * C * (rengD.th - rengT) - rengD.mc * C * (rengT - rengD.tc)) / (rengT - rengD.tc) },
    errores: (rengD) => {
      const rengT = rengR2((rengD.mh * C * rengD.th + (rengD.mc * C + rengD.k) * rengD.tc) / (rengD.mh * C + rengD.mc * C + rengD.k))
      return [
        ['sin-agua-fria', 'Sin restar el agua fría', (rengD.mh * C * (rengD.th - rengT)) / (rengT - rengD.tc), 'Atribuiste todo el calor cedido al calorímetro; parte la recibe el agua fría.'],
        ['sin-dividir', 'Sin dividir entre ΔT', rengD.mh * C * (rengD.th - rengT) - rengD.mc * C * (rengT - rengD.tc), 'Diste el calor que recibe el calorímetro; su capacidad es ese calor entre su ΔT.']
      ]
    },
    enunciado: (rengD) => { const rengT = rengR2((rengD.mh * C * rengD.th + (rengD.mc * C + rengD.k) * rengD.tc) / (rengD.mh * C + rengD.mc * C + rengD.k)); return `En un calorímetro con ${rengTx(rengD.mc)} g de agua a ${rengTx(rengD.tc)} °C se añaden ${rengTx(rengD.mh)} g de agua a ${rengTx(rengD.th)} °C. La temperatura final es ${rengTx(rengT, 4)} °C. c(agua) = 4,184 J/(g·K).` },
    pregunta: () => '¿Cuál es la capacidad calorífica del calorímetro, en J/K?',
    datos: (rengD) => [['Agua fría', `${rengTx(rengD.mc)} g a ${rengTx(rengD.tc)} °C`], ['Agua caliente', `${rengTx(rengD.mh)} g a ${rengTx(rengD.th)} °C`]],
    pasos: (rengD, rengR) => ['Calor cedido por el agua caliente − calor recibido por la fría = calor del calorímetro.', `C(cal) = ese calor / ΔT del calorímetro = ${rengTx(rengR)} J/K.`],
    pistas: ['Calcula el calor que cede el agua caliente.', 'Resta el que recibe el agua fría.', 'Divide entre el ΔT del calorímetro.']
  })
]

export const RENG_PRACTICAS_B11_S03: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s3-p1', subtema: 'n1-b11-s3', titulo: 'Calor específico de un material', dificultad: 'basica',
    objetivo: 'Calcular el calor específico a partir del calor, la masa y el cambio de temperatura.', unidad: 'J/(g·K)', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.2', 'el calor específico'), idealizado: 'c constante.', metodo: 'búsqueda por bisección de c en q = m·c·ΔT',
    parametros: (rengRng) => ({ q: rengEntreN1(rengRng, 200, 20000, 10), m: rengEntreN1(rengRng, 10, 500, 5), d: rengEntreN1(rengRng, 2, 80, 0.5) }),
    valida: (rengD) => { const rengC = rengD.q / (rengD.m * rengD.d); return rengC > 0.1 && rengC < 5 },
    respuesta: (rengD) => rengD.q / (rengD.m * rengD.d),
    errores: (rengD) => [
      ['sin-masa', 'Sin la masa', rengD.q / rengD.d, 'Olvidaste dividir entre la masa: el calor específico es por gramo.'],
      ['sin-dt', 'Sin ΔT', rengD.q / rengD.m, 'Olvidaste dividir entre el cambio de temperatura.']
    ],
    enunciado: (rengD) => `Una muestra de ${rengTx(rengD.m)} g absorbe ${rengTx(rengD.q)} J y su temperatura sube ${rengTx(rengD.d)} K.`,
    pregunta: () => '¿Cuál es su calor específico, en J/(g·K)?',
    datos: (rengD) => [['q', `${rengTx(rengD.q)} J`], ['m', `${rengTx(rengD.m)} g`], ['ΔT', `${rengTx(rengD.d)} K`]],
    pasos: (rengD, rengR) => ['c = q/(m·ΔT).', `c = ${rengTx(rengR)} J/(g·K).`],
    pistas: ['Despeja c de q = m·c·ΔT.', 'Divide entre masa y ΔT.', 'Unidades: J/(g·K).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s3-p2', subtema: 'n1-b11-s3', titulo: 'Calor para calentar un metal', dificultad: 'intermedia',
    objetivo: 'Calcular el calor necesario para calentar una pieza de metal de calor específico conocido.', unidad: 'J', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.2', 'el calor específico'), idealizado: 'c del metal didáctico y constante.', metodo: 'calor por gramo y por kelvin multiplicado',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 10, 1000, 5), c: rengEntreN1(rengRng, 0.12, 0.9, 0.01), d: rengEntreN1(rengRng, 5, 100, 0.5) }),
    respuesta: (rengD) => rengD.m * rengD.c * rengD.d,
    errores: (rengD) => [
      ['agua', 'Con el c del agua', rengD.m * C * rengD.d, 'Usaste el calor específico del agua; cada material tiene el suyo.'],
      ['kj', 'En kJ', (rengD.m * rengD.c * rengD.d) / 1000, 'Ese valor está en kJ; la pregunta pide julios.']
    ],
    enunciado: (rengD) => `Se calienta una pieza de ${rengTx(rengD.m)} g de un metal con c = ${rengTx(rengD.c)} J/(g·K) (didáctico) hasta subir ${rengTx(rengD.d)} K.`,
    pregunta: () => '¿Cuánto calor absorbe, en J?',
    datos: (rengD) => [['m', `${rengTx(rengD.m)} g`], ['c', `${rengTx(rengD.c)} J/(g·K)`], ['ΔT', `${rengTx(rengD.d)} K`]],
    pasos: (rengD, rengR) => ['q = m·c·ΔT.', `q = ${rengTx(rengR)} J.`],
    pistas: ['Usa el calor específico del metal.', 'Multiplica masa, c y ΔT.', 'El resultado sale en julios.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s3-p3', subtema: 'n1-b11-s3', titulo: 'Calor específico por el método de mezclas', dificultad: 'avanzada',
    objetivo: 'Calcular el calor específico de un metal a partir de la temperatura final al sumergirlo en agua.', unidad: 'J/(g·K)', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.2', 'el método de mezclas'), idealizado: 'Calorímetro de capacidad despreciable, sin pérdidas.', metodo: 'búsqueda por bisección del c que reproduce T_f en la escena', sinVerificar: CSV,
    parametros: (rengRng) => ({ m1: rengEntreN1(rengRng, 50, 300, 5), c: rengEntreN1(rengRng, 0.12, 0.9, 0.01), t1: rengEntreN1(rengRng, 80, 100, 0.5), m2: rengEntreN1(rengRng, 50, 300, 5), t2: rengEntreN1(rengRng, 15, 25, 0.5) }),
    valida: (rengD) => rengR2(rengTf(rengD.m1, rengD.c, rengD.t1, rengD.m2, C, rengD.t2)) - rengD.t2 > 1,
    respuesta: (rengD) => { const rengT = rengR2(rengTf(rengD.m1, rengD.c, rengD.t1, rengD.m2, C, rengD.t2)); return (rengD.m2 * C * (rengT - rengD.t2)) / (rengD.m1 * (rengD.t1 - rengT)) },
    errores: (rengD) => {
      const rengT = rengR2(rengTf(rengD.m1, rengD.c, rengD.t1, rengD.m2, C, rengD.t2))
      return [
        ['mismo-dt', 'ΔT del agua para el metal', (rengD.m2 * C) / rengD.m1, 'Usaste el ΔT del agua también para el metal; el metal pasa de su temperatura inicial a la final.'],
        ['invertida', 'Cociente invertido', (rengD.m1 * (rengD.t1 - rengT)) / (rengD.m2 * C * (rengT - rengD.t2)), 'Invertiste el cociente: c(metal) = calor del agua / (m·ΔT del metal).']
      ]
    },
    enunciado: (rengD) => `Un metal de ${rengTx(rengD.m1)} g a ${rengTx(rengD.t1)} °C se sumerge en ${rengTx(rengD.m2)} g de agua a ${rengTx(rengD.t2)} °C. La temperatura final es ${rengTx(rengR2(rengTf(rengD.m1, rengD.c, rengD.t1, rengD.m2, C, rengD.t2)), 4)} °C. c(agua) = 4,184 J/(g·K).`,
    pregunta: () => '¿Cuál es el calor específico del metal, en J/(g·K)?',
    datos: (rengD) => [['Metal', `${rengTx(rengD.m1)} g a ${rengTx(rengD.t1)} °C`], ['Agua', `${rengTx(rengD.m2)} g a ${rengTx(rengD.t2)} °C`]],
    pasos: (rengD, rengR) => ['Calor recibido por el agua = calor cedido por el metal.', `c(metal) = ${rengTx(rengR)} J/(g·K).`],
    pistas: ['Calcula el calor del agua.', 'El metal cede ese calor.', 'Despeja c con el ΔT del metal.']
  })
]

export const RENG_PRACTICAS_B11_S04: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s4-p1', subtema: 'n1-b11-s4', titulo: 'Entalpía de neutralización', dificultad: 'basica',
    objetivo: 'Calcular la entalpía de neutralización a partir del calentamiento medido en un calorímetro.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.2', 'la calorimetría de disoluciones'), idealizado: 'Disolución tratada como agua (1 g/mL); calorímetro despreciable.', metodo: 'calor en kJ y moles con litros del catálogo', sinVerificar: CSV,
    parametros: (rengRng) => ({ v: rengEntreN1(rengRng, 25, 100, 5), c: rengEntreN1(rengRng, 0.5, 2, 0.1), d: rengEntreN1(rengRng, 2, 13, 0.01) }),
    respuesta: (rengD) => -((2 * rengD.v * C * rengD.d) / 1000) / ((rengD.c * rengD.v) / 1000),
    errores: (rengD) => [
      ['signo', 'Signo positivo', ((2 * rengD.v * C * rengD.d) / 1000) / ((rengD.c * rengD.v) / 1000), 'La reacción cede calor al agua: ΔH es negativo.'],
      ['sin-moles', 'Sin dividir entre los moles', -(2 * rengD.v * C * rengD.d) / 1000, 'Diste el calor total; ΔH en kJ/mol se divide entre los moles que reaccionan.']
    ],
    enunciado: (rengD) => `Se mezclan ${rengTx(rengD.v)} mL de HCl ${rengTx(rengD.c)} mol/L con ${rengTx(rengD.v)} mL de NaOH ${rengTx(rengD.c)} mol/L y la temperatura sube ${rengTx(rengD.d, 4)} K. Se toma la disolución como agua (1,00 g/mL, c = 4,184 J/(g·K)).`,
    pregunta: () => '¿Cuál es ΔH de neutralización, en kJ/mol?',
    datos: (rengD) => [['Volúmenes', `${rengTx(rengD.v)} + ${rengTx(rengD.v)} mL`], ['c', `${rengTx(rengD.c)} mol/L`], ['ΔT', `${rengTx(rengD.d, 4)} K`]],
    pasos: (rengD, rengR) => [`q(agua) = ${rengTx(2 * rengD.v * C * rengD.d)} J; n = ${rengTx((rengD.c * rengD.v) / 1000, 4)} mol.`, `ΔH = −q/n = ${rengTx(rengR)} kJ/mol.`],
    pistas: ['Calcula la masa total de disolución.', 'q = m·c·ΔT.', 'Divide −q entre los moles de agua formada.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s4-p2', subtema: 'n1-b11-s4', titulo: 'Poder calorífico en una bomba', dificultad: 'intermedia',
    objetivo: 'Calcular el calor de combustión por gramo con una bomba calorimétrica de capacidad conocida.', unidad: 'kJ/g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.2', 'la bomba calorimétrica'), idealizado: 'Bomba sin pérdidas.', metodo: 'calores del agua y de la bomba por separado en kJ', sinVerificar: CSV,
    parametros: (rengRng) => ({ mw: rengEntreN1(rengRng, 1000, 3000, 50), k: rengEntreN1(rengRng, 500, 2000, 10), d: rengEntreN1(rengRng, 0.5, 5, 0.01), ms: rengEntreN1(rengRng, 0.2, 1.5, 0.01) }),
    respuesta: (rengD) => ((rengD.mw * C + rengD.k) * rengD.d) / 1000 / rengD.ms,
    errores: (rengD) => [
      ['sin-bomba', 'Sin la bomba', (rengD.mw * C * rengD.d) / 1000 / rengD.ms, 'Olvidaste el calor que recibe la propia bomba.'],
      ['sin-masa', 'Sin dividir entre la masa', ((rengD.mw * C + rengD.k) * rengD.d) / 1000, 'Diste el calor total; la pregunta pide kJ por gramo de muestra.']
    ],
    enunciado: (rengD) => `Al quemar ${rengTx(rengD.ms)} g de una muestra en una bomba con ${rengTx(rengD.mw)} g de agua y capacidad propia ${rengTx(rengD.k)} J/K, la temperatura sube ${rengTx(rengD.d, 4)} K.`,
    pregunta: () => '¿Cuánto calor libera la muestra por gramo, en kJ/g?',
    datos: (rengD) => [['Agua', `${rengTx(rengD.mw)} g`], ['C(bomba)', `${rengTx(rengD.k)} J/K`], ['ΔT', `${rengTx(rengD.d, 4)} K`], ['Muestra', `${rengTx(rengD.ms)} g`]],
    pasos: (rengD, rengR) => [`q = (m·c + C)·ΔT = ${rengTx((rengD.mw * C + rengD.k) * rengD.d)} J.`, `Por gramo: ${rengTx(rengR)} kJ/g.`],
    pistas: ['Suma las capacidades del agua y de la bomba.', 'Multiplica por ΔT.', 'Divide entre la masa de la muestra.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s4-p3', subtema: 'n1-b11-s4', titulo: 'Entalpía de disolución de una sal', dificultad: 'avanzada',
    objetivo: 'Calcular la entalpía molar de disolución de una sal a partir del cambio de temperatura del agua.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.2', 'la calorimetría de disoluciones', 'masas'), idealizado: 'Disolución con c del agua; calorímetro despreciable; datos didácticos.', metodo: 'calor de la disolución y moles de sal por separado', sinVerificar: CSV,
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SALES_DISOLUCION_TE.length), ms: rengEntreN1(rengRng, 2, 20, 0.5), mw: rengEntreN1(rengRng, 50, 200, 5), d: rengEntreN1(rengRng, 1, 10, 0.01) }),
    respuesta: (rengD) => { const rengS = RENG_SALES_DISOLUCION_TE[rengD.s]!; return (-rengS.signo * ((rengD.mw + rengD.ms) * C * rengD.d)) / 1000 / (rengD.ms / rengMmTe(rengS.formula)) },
    errores: (rengD) => {
      const rengS = RENG_SALES_DISOLUCION_TE[rengD.s]!
      const rengN = rengD.ms / rengMmTe(rengS.formula)
      return [
        ['signo', 'Signo cambiado', (rengS.signo * ((rengD.mw + rengD.ms) * C * rengD.d)) / 1000 / rengN, 'Revisa el signo: si el agua se enfría, la disolución absorbe calor (ΔH > 0); si se calienta, lo cede.'],
        ['por-gramo', 'Por gramo en lugar de por mol', (-rengS.signo * ((rengD.mw + rengD.ms) * C * rengD.d)) / 1000 / rengD.ms, 'Dividiste entre los gramos; ΔH molar se divide entre los moles de sal.']
      ]
    },
    enunciado: (rengD) => { const rengS = RENG_SALES_DISOLUCION_TE[rengD.s]!; return `Al disolver ${rengTx(rengD.ms)} g de ${rengSubindice(rengS.formula)} en ${rengTx(rengD.mw)} g de agua, la temperatura ${rengS.signo < 0 ? 'baja' : 'sube'} ${rengTx(rengD.d, 4)} K (datos didácticos). Se toma c = 4,184 J/(g·K) para toda la disolución.` },
    pregunta: () => '¿Cuál es ΔH de disolución, en kJ/mol?',
    datos: (rengD) => [['Sal', `${rengTx(rengD.ms)} g de ${rengSubindice(RENG_SALES_DISOLUCION_TE[rengD.s]!.formula)}`], ['Agua', `${rengTx(rengD.mw)} g`], ['|ΔT|', `${rengTx(rengD.d, 4)} K`], ['M(sal)', `${rengTx(rengMmTe(RENG_SALES_DISOLUCION_TE[rengD.s]!.formula), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`q(disolución) = ${rengTx((rengD.mw + rengD.ms) * C * rengD.d)} J con la masa total.`, `ΔH = ${rengTx(rengR)} kJ/mol (signo según el agua se enfríe o se caliente).`],
    pistas: ['Usa la masa total de la disolución.', 'Decide el signo por el cambio de temperatura.', 'Divide entre los moles de sal.']
  })
]

export const RENG_PRACTICAS_B11_S05: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s5-p1', subtema: 'n1-b11-s5', titulo: 'Calor de una combustión', dificultad: 'basica',
    objetivo: 'Calcular el calor liberado al quemar una masa de combustible con su ΔH de combustión.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'la entalpía', 'masas', 'dhf'), idealizado: 'Combustión completa a presión constante.', metodo: 'función del núcleo para el calor liberado',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_TE.length), m: rengEntreN1(rengRng, 0.5, 100, 0.5) }),
    respuesta: (rengD) => ((rengD.m / rengMmTe(rx(rengD.r).combustible)) / rengNuCombustible(rengD.r)) * -rengDhTe(rengD.r),
    errores: (rengD) => [
      ['sin-moles', 'Sin pasar a moles', rengD.m * -rengDhTe(rengD.r) / rengNuCombustible(rengD.r), 'Multiplicaste los gramos por ΔH; ΔH es por mol: pasa antes a moles.'],
      ['divide', 'Dividir entre los moles', -rengDhTe(rengD.r) / (rengD.m / rengMmTe(rx(rengD.r).combustible)), 'Dividiste ΔH entre los moles; el calor es moles por |ΔH|.']
    ],
    enunciado: (rengD) => `Para ${rx(rengD.r).texto}, ΔH = ${rengTx(rengDhTe(rengD.r), 5)} kJ (tabla de la app). Se queman ${rengTx(rengD.m)} g de ${rengSubindice(rx(rengD.r).combustible)}.`,
    pregunta: () => '¿Cuánto calor se libera, en kJ?',
    datos: (rengD) => [['Reacción', rx(rengD.r).texto], ['ΔH', `${rengTx(rengDhTe(rengD.r), 5)} kJ`], ['Masa', `${rengTx(rengD.m)} g`], ['M', `${rengTx(rengMmTe(rx(rengD.r).combustible), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`n = ${rengTx(rengD.m / rengMmTe(rx(rengD.r).combustible), 4)} mol; ΔH es por ${rengNuCombustible(rengD.r)} mol de combustible.`, `q = ${rengTx(rengR)} kJ liberados.`],
    pistas: ['Pasa la masa a moles.', 'Fíjate en el coeficiente del combustible.', 'Multiplica por |ΔH|.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s5-p2', subtema: 'n1-b11-s5', titulo: 'Combustible para un calor dado', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de combustible que libera una cantidad de calor dada.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'la entalpía', 'masas', 'dhf'), idealizado: 'Combustión completa sin pérdidas.', metodo: 'búsqueda por bisección de la masa con la función del núcleo',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_TE.length), q: rengEntreN1(rengRng, 100, 5000, 10) }),
    respuesta: (rengD) => (rengD.q / -rengDhTe(rengD.r)) * rengNuCombustible(rengD.r) * rengMmTe(rx(rengD.r).combustible),
    errores: (rengD) => [
      ['moles', 'Moles en lugar de gramos', (rengD.q / -rengDhTe(rengD.r)) * rengNuCombustible(rengD.r), 'Diste los moles; multiplícalos por la masa molar.'],
      ['invertida', 'Cociente invertido', (-rengDhTe(rengD.r) / rengD.q) * rengMmTe(rx(rengD.r).combustible), 'Invertiste el cociente: moles = calor / |ΔH|.']
    ],
    enunciado: (rengD) => `Para ${rx(rengD.r).texto}, ΔH = ${rengTx(rengDhTe(rengD.r), 5)} kJ (tabla de la app). Se necesitan ${rengTx(rengD.q)} kJ de calor.`,
    pregunta: (rengD) => `¿Qué masa de ${rengSubindice(rx(rengD.r).combustible)} hay que quemar, en g?`,
    datos: (rengD) => [['ΔH', `${rengTx(rengDhTe(rengD.r), 5)} kJ`], ['Calor', `${rengTx(rengD.q)} kJ`], ['M', `${rengTx(rengMmTe(rx(rengD.r).combustible), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`n = q/|ΔH| × coeficiente = ${rengTx((rengD.q / -rengDhTe(rengD.r)) * rengNuCombustible(rengD.r), 4)} mol.`, `m = ${rengTx(rengR)} g.`],
    pistas: ['Divide el calor entre |ΔH|.', 'Ajusta por el coeficiente.', 'Pasa a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s5-p3', subtema: 'n1-b11-s5', titulo: 'Combustible para calentar agua', dificultad: 'avanzada',
    objetivo: 'Calcular la masa de combustible necesaria para calentar una masa de agua, sin pérdidas.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'la entalpía', 'masas', 'dhf'), idealizado: 'Todo el calor va al agua.', metodo: 'búsqueda por bisección de la masa de combustible', sinVerificar: CSV,
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_TE.length), mw: rengEntreN1(rengRng, 0.5, 20, 0.1), d: rengEntreN1(rengRng, 10, 80, 0.5) }),
    respuesta: (rengD) => ((rengD.mw * 1000 * C * rengD.d) / 1000 / -rengDhTe(rengD.r)) * rengNuCombustible(rengD.r) * rengMmTe(rx(rengD.r).combustible),
    errores: (rengD) => [
      ['kg-como-g', 'Kilos como gramos', ((rengD.mw * C * rengD.d) / 1000 / -rengDhTe(rengD.r)) * rengNuCombustible(rengD.r) * rengMmTe(rx(rengD.r).combustible), 'Usaste los kilogramos de agua como si fueran gramos.'],
      ['moles', 'Moles en lugar de gramos', ((rengD.mw * 1000 * C * rengD.d) / 1000 / -rengDhTe(rengD.r)) * rengNuCombustible(rengD.r), 'Diste los moles de combustible; multiplícalos por la masa molar.']
    ],
    enunciado: (rengD) => `Se quieren calentar ${rengTx(rengD.mw)} kg de agua ${rengTx(rengD.d)} K quemando ${rengSubindice(rx(rengD.r).combustible)}: ${rx(rengD.r).texto}, ΔH = ${rengTx(rengDhTe(rengD.r), 5)} kJ (tabla de la app). c(agua) = 4,184 J/(g·K); sin pérdidas.`,
    pregunta: () => '¿Qué masa de combustible hace falta, en g?',
    datos: (rengD) => [['Agua', `${rengTx(rengD.mw)} kg`], ['ΔT', `${rengTx(rengD.d)} K`], ['ΔH', `${rengTx(rengDhTe(rengD.r), 5)} kJ`]],
    pasos: (rengD, rengR) => [`q = ${rengTx(rengD.mw * 1000 * C * rengD.d)} J.`, `m(combustible) = ${rengTx(rengR)} g.`],
    pistas: ['Calcula el calor del agua.', 'Divide entre |ΔH| para los moles.', 'Pasa a gramos.']
  })
]

export const RENG_PRACTICAS_B11_S06: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s6-p1', subtema: 'n1-b11-s6', titulo: 'ΔH de una ecuación escalada o invertida', dificultad: 'basica',
    objetivo: 'Obtener ΔH de una ecuación multiplicada por un factor o invertida a partir de la original.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'las ecuaciones termoquímicas'), idealizado: 'Datos didácticos.', metodo: 'suma repetida de la reacción y cambio de signo explícito',
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, -900, 400, 0.5), k: rengIndice(rengRng, 4), inv: rengIndice(rengRng, 2) }),
    valida: (rengD) => Math.abs(rengD.h) > 5,
    respuesta: (rengD) => [0.5, 2, 3, 1 / 3][rengD.k]! * rengD.h * (rengD.inv === 1 ? -1 : 1),
    errores: (rengD) => [
      ['sin-escalar', 'Sin escalar', rengD.h * (rengD.inv === 1 ? -1 : 1), 'Olvidaste multiplicar ΔH por el mismo factor que la ecuación.'],
      ['signo', 'Signo equivocado', -[0.5, 2, 3, 1 / 3][rengD.k]! * rengD.h * (rengD.inv === 1 ? -1 : 1), 'Te equivocaste con el signo: solo cambia al invertir la ecuación.']
    ],
    enunciado: (rengD) => `La reacción A → B tiene ΔH = ${rengTx(rengD.h, 4)} kJ (dato didáctico).`,
    pregunta: (rengD) => `¿Cuál es ΔH de ${rengD.inv === 1 ? `${['½', '2', '3', '⅓'][rengD.k]} B → ${['½', '2', '3', '⅓'][rengD.k]} A` : `${['½', '2', '3', '⅓'][rengD.k]} A → ${['½', '2', '3', '⅓'][rengD.k]} B`}, en kJ?`,
    datos: (rengD) => [['ΔH(A → B)', `${rengTx(rengD.h, 4)} kJ`], ['Factor', ['½', '2', '3', '⅓'][rengD.k]!]],
    pasos: (rengD, rengR) => ['Escalar la ecuación escala ΔH; invertirla cambia el signo.', `ΔH = ${rengTx(rengR, 4)} kJ.`],
    pistas: ['¿Se ha invertido la ecuación?', '¿Por qué factor se ha multiplicado?', 'Aplica las dos reglas.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s6-p2', subtema: 'n1-b11-s6', titulo: 'Calor al formar una masa de producto', dificultad: 'intermedia',
    objetivo: 'Calcular el calor de reacción asociado a la formación de una masa dada de producto.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'la entalpía de reacción', 'masas', 'dhf'), idealizado: 'Reacción completa a presión constante.', metodo: 'función del núcleo escalada a los moles de producto',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_TE.length), m: rengEntreN1(rengRng, 1, 200, 0.5) }),
    respuesta: (rengD) => ((rengD.m / rengMmTe(rx(rengD.r).producto)) / rx(rengD.r).nuProducto) * rengDhTe(rengD.r),
    errores: (rengD) => [
      ['sin-coef', 'Sin el coeficiente', (rengD.m / rengMmTe(rx(rengD.r).producto)) * rengDhTe(rengD.r), 'Olvidaste que ΔH es para los moles de producto de la ecuación; divide entre su coeficiente.'],
      ['gramos', 'Gramos como moles', (rengD.m / rx(rengD.r).nuProducto) * rengDhTe(rengD.r), 'Usaste los gramos como si fueran moles.']
    ],
    enunciado: (rengD) => `Para ${rx(rengD.r).texto}, ΔH = ${rengTx(rengDhTe(rengD.r), 5)} kJ (tabla de la app). Se forman ${rengTx(rengD.m)} g de ${rengSubindice(rx(rengD.r).producto)}.`,
    pregunta: () => '¿Cuál es ΔH del proceso, en kJ?',
    datos: (rengD) => [['Reacción', rx(rengD.r).texto], ['ΔH', `${rengTx(rengDhTe(rengD.r), 5)} kJ`], ['Producto', `${rengTx(rengD.m)} g`]],
    pasos: (rengD, rengR) => [`n(producto) = ${rengTx(rengD.m / rengMmTe(rx(rengD.r).producto), 4)} mol; la ecuación forma ${rx(rengD.r).nuProducto}.`, `ΔH = ${rengTx(rengR)} kJ.`],
    pistas: ['Pasa el producto a moles.', 'Compara con el coeficiente de la ecuación.', 'Escala ΔH a esos moles.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s6-p3', subtema: 'n1-b11-s6', titulo: 'ΔH con entalpías de formación', dificultad: 'avanzada',
    objetivo: 'Calcular ΔH de una reacción a partir de las entalpías de formación y los coeficientes.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'la entalpía de reacción'), idealizado: 'Entalpías de formación didácticas.', metodo: 'suma término a término con listas de productos y reactivos',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 1, 3, 1), b: rengEntreN1(rengRng, 1, 3, 1), c: rengEntreN1(rengRng, 1, 3, 1), d: rengEntreN1(rengRng, 1, 3, 1), ha: rengEntreN1(rengRng, -300, 100, 0.5), hc: rengEntreN1(rengRng, -500, 50, 0.5), hd: rengEntreN1(rengRng, -400, 0, 0.5) }),
    valida: (rengD) => Math.abs(rengD.c * rengD.hc + rengD.d * rengD.hd - rengD.a * rengD.ha) > 10 && !(rengD.a === 1 && rengD.c === 1 && rengD.d === 1),
    respuesta: (rengD) => rengD.c * rengD.hc + rengD.d * rengD.hd - rengD.a * rengD.ha,
    errores: (rengD) => [
      ['sin-coef', 'Sin coeficientes', rengD.hc + rengD.hd - rengD.ha, 'Olvidaste multiplicar cada ΔHf por su coeficiente.'],
      ['invertido', 'Reactivos menos productos', rengD.a * rengD.ha - rengD.c * rengD.hc - rengD.d * rengD.hd, 'Restaste al revés: es productos menos reactivos.']
    ],
    enunciado: (rengD) => `Para ${rengD.a} A + ${rengD.b} B₂ → ${rengD.c} C + ${rengD.d} D, con ΔHf(A) = ${rengTx(rengD.ha, 4)}, ΔHf(B₂) = 0, ΔHf(C) = ${rengTx(rengD.hc, 4)} y ΔHf(D) = ${rengTx(rengD.hd, 4)} kJ/mol (datos didácticos).`,
    pregunta: () => '¿Cuál es ΔH de la reacción, en kJ?',
    datos: (rengD) => [['ΔHf(A)', `${rengTx(rengD.ha, 4)} kJ/mol`], ['ΔHf(C)', `${rengTx(rengD.hc, 4)} kJ/mol`], ['ΔHf(D)', `${rengTx(rengD.hd, 4)} kJ/mol`]],
    pasos: (rengD, rengR) => ['ΔH = Σν·ΔHf(productos) − Σν·ΔHf(reactivos); B₂ es un elemento.', `ΔH = ${rengTx(rengR, 4)} kJ.`],
    pistas: ['El elemento B₂ vale 0.', 'Multiplica por los coeficientes.', 'Productos menos reactivos.']
  })
]

export const RENG_PRACTICAS_B11_S07: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s7-p1', subtema: 'n1-b11-s7', titulo: 'Hess con una etapa invertida', dificultad: 'basica',
    objetivo: 'Combinar dos reacciones, una de ellas invertida, para obtener ΔH de otra.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'la ley de Hess'), idealizado: 'Datos didácticos.', metodo: 'suma explícita de las etapas',
    parametros: (rengRng) => ({ h1: rengEntreN1(rengRng, -600, -100, 0.5), h2: rengEntreN1(rengRng, -500, -50, 0.5) }),
    valida: (rengD) => Math.abs(rengD.h1 - rengD.h2) > 10,
    respuesta: (rengD) => rengD.h1 - rengD.h2,
    errores: (rengD) => [
      ['suma', 'Sin invertir', rengD.h1 + rengD.h2, 'Sumaste la segunda etapa sin invertirla; al invertirla, su ΔH cambia de signo.'],
      ['invertido', 'Etapa equivocada invertida', rengD.h2 - rengD.h1, 'Invertiste la etapa equivocada: la que lleva el producto deseado se usa tal cual.']
    ],
    enunciado: (rengD) => `(1) X + O₂ → XO₂, ΔH₁ = ${rengTx(rengD.h1, 4)} kJ. (2) XO + ½ O₂ → XO₂, ΔH₂ = ${rengTx(rengD.h2, 4)} kJ (datos didácticos).`,
    pregunta: () => '¿Cuál es ΔH de X + ½ O₂ → XO, en kJ?',
    datos: (rengD) => [['ΔH₁', `${rengTx(rengD.h1, 4)} kJ`], ['ΔH₂', `${rengTx(rengD.h2, 4)} kJ`]],
    pasos: (rengD, rengR) => ['Se usa (1) tal cual y (2) invertida.', `ΔH = ΔH₁ − ΔH₂ = ${rengTx(rengR, 4)} kJ.`],
    pistas: ['¿Qué etapa produce XO al invertirla?', 'Invertir cambia el signo.', 'Suma las dos etapas.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s7-p2', subtema: 'n1-b11-s7', titulo: 'Hess con etapas escaladas', dificultad: 'intermedia',
    objetivo: 'Combinar reacciones multiplicadas e invertidas para obtener ΔH de una reacción objetivo.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'la ley de Hess'), idealizado: 'Datos didácticos.', metodo: 'suma de las etapas repetidas una a una',
    parametros: (rengRng) => ({ h1: rengEntreN1(rengRng, -400, 200, 0.5), h2: rengEntreN1(rengRng, -400, 200, 0.5), a: rengEntreN1(rengRng, 2, 3, 1), b: rengEntreN1(rengRng, 1, 2, 1) }),
    valida: (rengD) => Math.abs(rengD.h1) > 20 && Math.abs(rengD.h2) > 20 && Math.abs(rengD.a * rengD.h1 - rengD.b * rengD.h2) > 10,
    respuesta: (rengD) => rengD.a * rengD.h1 - rengD.b * rengD.h2,
    errores: (rengD) => [
      ['sin-escalar', 'Sin escalar', rengD.h1 - rengD.h2, 'Olvidaste multiplicar ΔH por el factor de cada etapa.'],
      ['sin-invertir', 'Sin invertir la segunda', rengD.a * rengD.h1 + rengD.b * rengD.h2, 'La segunda etapa va invertida: su ΔH cambia de signo.']
    ],
    enunciado: (rengD) => `Etapa (1): ΔH₁ = ${rengTx(rengD.h1, 4)} kJ. Etapa (2): ΔH₂ = ${rengTx(rengD.h2, 4)} kJ (didácticos). La reacción objetivo es ${rengD.a}·(1) menos ${rengD.b}·(2), es decir, ${rengD.a} veces la etapa 1 más ${rengD.b} veces la etapa 2 invertida.`,
    pregunta: () => '¿Cuál es ΔH de la reacción objetivo, en kJ?',
    datos: (rengD) => [['ΔH₁', `${rengTx(rengD.h1, 4)} kJ`], ['ΔH₂', `${rengTx(rengD.h2, 4)} kJ`], ['Combinación', `${rengD.a}·(1) − ${rengD.b}·(2)`]],
    pasos: (rengD, rengR) => [`ΔH = ${rengD.a}·ΔH₁ + ${rengD.b}·(−ΔH₂).`, `ΔH = ${rengTx(rengR, 4)} kJ.`],
    pistas: ['Multiplica cada etapa por su factor.', 'La etapa invertida cambia de signo.', 'Suma todas las etapas.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s7-p3', subtema: 'n1-b11-s7', titulo: 'Hess con tres etapas', dificultad: 'avanzada',
    objetivo: 'Combinar tres reacciones (una duplicada y otra invertida) para obtener ΔH de una reacción global.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'la ley de Hess'), idealizado: 'Datos didácticos.', metodo: 'suma de la lista explícita de etapas',
    parametros: (rengRng) => ({ h1: rengEntreN1(rengRng, -400, 200, 0.5), h2: rengEntreN1(rengRng, -400, 200, 0.5), h3: rengEntreN1(rengRng, -400, 200, 0.5) }),
    valida: (rengD) => Math.abs(rengD.h2) > 20 && Math.abs(rengD.h3) > 20 && Math.abs(rengD.h1 + 2 * rengD.h2 - rengD.h3) > 10,
    respuesta: (rengD) => rengD.h1 + 2 * rengD.h2 - rengD.h3,
    errores: (rengD) => [
      ['sin-2', 'Sin duplicar la etapa 2', rengD.h1 + rengD.h2 - rengD.h3, 'La etapa 2 aparece dos veces: su ΔH se multiplica por 2.'],
      ['sin-invertir', 'Sin invertir la etapa 3', rengD.h1 + 2 * rengD.h2 + rengD.h3, 'La etapa 3 va invertida: su ΔH cambia de signo.']
    ],
    enunciado: (rengD) => `ΔH₁ = ${rengTx(rengD.h1, 4)}, ΔH₂ = ${rengTx(rengD.h2, 4)} y ΔH₃ = ${rengTx(rengD.h3, 4)} kJ (didácticos). La reacción global es (1) + 2·(2) − (3).`,
    pregunta: () => '¿Cuál es ΔH de la reacción global, en kJ?',
    datos: (rengD) => [['ΔH₁', `${rengTx(rengD.h1, 4)} kJ`], ['ΔH₂', `${rengTx(rengD.h2, 4)} kJ`], ['ΔH₃', `${rengTx(rengD.h3, 4)} kJ`]],
    pasos: (rengD, rengR) => ['ΔH = ΔH₁ + 2·ΔH₂ − ΔH₃.', `ΔH = ${rengTx(rengR, 4)} kJ.`],
    pistas: ['Escribe cada etapa con su factor.', 'Invierte la etapa 3.', 'Suma los ΔH resultantes.']
  })
]
