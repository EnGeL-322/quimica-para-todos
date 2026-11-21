import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_ELECTROLITOS_MULTI_SOL, RENG_POCO_SOLUBLES_SOL, RENG_TOL_SOL, RENG_TOL_SOL_PCT, rengDatoMasaSol, rengFuentesSol, rengIonDe, rengMmSol, rengTextoSol } from './b09-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

export const RENG_SOLUTOS_TEXTO_SOL = ['azúcar', 'sal común', 'bicarbonato de sodio', 'urea', 'sulfato de magnesio', 'cloruro de potasio'] as const
export const rengSolubilidadLineal = (rengA: number, rengB: number, rengT: number): number => rengA + rengB * rengT
export const RENG_SATURADAS_FORMULAS = ['NaCl', 'KCl', 'KNO3', 'NaBr', 'KBr', 'NH4Cl'] as const
const rengMaxSol = (rengS: number, rengMw: number): number => (rengS * rengMw) / 100
const rengIonMulti = (rengE: number, rengK: number) => rengIonDe(RENG_ELECTROLITOS_MULTI_SOL[rengE]!, rengK)

export const RENG_PRACTICAS_B09_S01: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s1-p1', subtema: 'n1-b9-s1', titulo: 'Masa de una disolución', dificultad: 'basica',
    objetivo: 'Calcular la masa de una disolución sumando las masas de soluto y disolvente.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.1', 'la conservación de la masa al disolver'), idealizado: 'Disolución sin reacción ni pérdidas.', metodo: 'masas pasadas a kilogramos con el catálogo, sumadas y devueltas a gramos',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_TEXTO_SOL.length), ms: rengEntreN1(rengRng, 2, 80, 0.5), md: rengEntreN1(rengRng, 50, 500, 5) }),
    valida: (rengD) => rengD.ms >= 0.03 * (rengD.ms + rengD.md),
    respuesta: (rengD) => rengD.ms + rengD.md,
    errores: (rengD) => [
      ['resta', 'Restar el soluto', rengD.md - rengD.ms, 'Restaste la masa del soluto: al disolver, la masa del soluto se suma a la del disolvente.'],
      ['solo-agua', 'Solo el disolvente', rengD.md, 'Diste solo la masa del agua; el soluto disuelto sigue ahí y también pesa.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.ms)} g de ${RENG_SOLUTOS_TEXTO_SOL[rengD.s]} en ${rengTx(rengD.md)} g de agua, sin pérdidas.`,
    pregunta: () => '¿Qué masa tiene la disolución, en g?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.ms)} g`], ['Agua (disolvente)', `${rengTx(rengD.md)} g`]],
    pasos: (rengD, rengR) => ['La masa se conserva al disolver.', `m = ${rengTx(rengD.ms)} + ${rengTx(rengD.md)} = ${rengTx(rengR)} g.`],
    pistas: ['¿Se pierde masa al disolver?', 'Suma la masa del soluto y la del agua.', 'El volumen no interviene aquí.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s1-p2', subtema: 'n1-b9-s1', titulo: 'Agua para una disolución de composición dada', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de disolvente que contiene una disolución de masa y fracción de soluto conocidas.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.1', 'soluto y disolvente en una disolución'), idealizado: 'Disolución de dos componentes.', metodo: 'búsqueda por bisección de la masa de agua con la función del núcleo para el porcentaje en masa',
    parametros: (rengRng) => ({ mt: rengEntreN1(rengRng, 100, 1000, 10), w: rengEntreN1(rengRng, 2, 40, 0.5) }),
    respuesta: (rengD) => rengD.mt * (1 - rengD.w / 100),
    errores: (rengD) => [
      ['soluto', 'Masa de soluto', (rengD.mt * rengD.w) / 100, 'Calculaste la masa de soluto; la pregunta pide la de agua, que es el resto de la disolución.'],
      ['total', 'Masa total', rengD.mt, 'Diste la masa total de la disolución; hay que restarle la masa del soluto.']
    ],
    enunciado: (rengD) => `Se quieren ${rengTx(rengD.mt)} g de una disolución acuosa en la que el soluto es el ${rengTx(rengD.w)} % de la masa.`,
    pregunta: () => '¿Cuántos gramos de agua contiene?',
    datos: (rengD) => [['Disolución', `${rengTx(rengD.mt)} g`], ['Soluto', `${rengTx(rengD.w)} % de la masa`]],
    pasos: (rengD, rengR) => [`Soluto: ${rengTx(rengD.mt)} × ${rengTx(rengD.w)}/100 = ${rengTx((rengD.mt * rengD.w) / 100)} g.`, `Agua: el resto, ${rengTx(rengR)} g.`],
    pistas: ['Calcula primero la masa de soluto.', 'El agua es el resto de la masa.', 'Resta el soluto de la masa total.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s1-p3', subtema: 'n1-b9-s1', titulo: 'Volumen de una disolución con su densidad', dificultad: 'avanzada',
    objetivo: 'Calcular el volumen de una disolución a partir de su masa total y su densidad, sin sumar volúmenes.', unidad: 'mL', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.1', 'la no aditividad de los volúmenes'), idealizado: 'Densidad de la disolución dada (dato didáctico).', metodo: 'masa en kilogramos dividida entre la densidad en kg/L y litros pasados a mililitros con el catálogo',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_TEXTO_SOL.length), ms: rengEntreN1(rengRng, 5, 150, 1), md: rengEntreN1(rengRng, 100, 800, 10), rho: rengEntreN1(rengRng, 1.04, 1.35, 0.005) }),
    respuesta: (rengD) => (rengD.ms + rengD.md) / rengD.rho,
    errores: (rengD) => [
      ['masa-volumen', 'Masa tomada como volumen', rengD.ms + rengD.md, 'Tomaste los gramos como mililitros: el volumen se obtiene dividiendo la masa entre la densidad de la disolución.'],
      ['solo-agua', 'Volumen del agua sola', rengD.md, 'Diste el volumen del agua sola; el volumen de la disolución sale de su masa total y su densidad.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.ms)} g de ${RENG_SOLUTOS_TEXTO_SOL[rengD.s]} en ${rengTx(rengD.md)} g de agua. La disolución tiene una densidad de ${rengTx(rengD.rho, 4)} g/mL (dato didáctico).`,
    pregunta: () => '¿Qué volumen ocupa la disolución, en mL?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.ms)} g`], ['Agua', `${rengTx(rengD.md)} g`], ['Densidad', `${rengTx(rengD.rho, 4)} g/mL`]],
    pasos: (rengD, rengR) => [`Masa total: ${rengTx(rengD.ms + rengD.md)} g.`, `V = m / ρ = ${rengTx(rengR)} mL. No se suman volúmenes.`],
    pistas: ['Calcula la masa total de la disolución.', 'Usa la densidad de la disolución.', 'V = m / ρ, sin sumar volúmenes.']
  })
]

export const RENG_PRACTICAS_B09_S02: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s2-p1', subtema: 'n1-b9-s2', titulo: 'Moles de iones de un electrolito fuerte', dificultad: 'basica',
    objetivo: 'Contar los moles de iones que libera un electrolito fuerte al disolverse por completo.', unidad: 'mol', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.2', 'la disociación de electrolitos fuertes'), idealizado: 'Disociación completa.', metodo: 'aniones deducidos de la neutralidad eléctrica a partir de las cargas de los iones',
    parametros: (rengRng) => ({ e: rengIndice(rengRng, RENG_ELECTROLITOS_MULTI_SOL.length), n: rengEntreN1(rengRng, 0.5, 5, 0.05) }),
    respuesta: (rengD) => rengD.n * (RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.nc + RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.na),
    errores: (rengD) => [
      ['una-particula', 'Una partícula por fórmula', rengD.n, 'Contaste cada fórmula como una sola partícula; un electrolito fuerte se separa en todos sus iones.'],
      ['un-tipo', 'Solo un tipo de ion', rengD.n * Math.max(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.nc, RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.na), 'Contaste solo los iones del tipo más abundante; hay que sumar los de los dos tipos.']
    ],
    enunciado: (rengD) => `Se disuelven por completo ${rengTx(rengD.n)} mol de ${rengTextoSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula)}, un electrolito fuerte, en agua.`,
    pregunta: () => '¿Cuántos moles de iones hay en la disolución?',
    datos: (rengD) => [['Sal', `${rengTx(rengD.n)} mol de ${rengTextoSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula)}`], ['Iones', `${RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.cation} y ${RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.anion}`]],
    pasos: (rengD, rengR) => [`Cada fórmula da ${RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.nc} ${RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.cation} y ${RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.na} ${RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.anion}.`, `Moles de iones: ${rengTx(rengR)} mol.`],
    pistas: ['Escribe la disociación de la sal.', 'Cuenta todos los iones de cada fórmula.', 'Multiplica por los moles de sal.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s2-p2', subtema: 'n1-b9-s2', titulo: 'Concentración de un ion', dificultad: 'intermedia',
    objetivo: 'Calcular la concentración de un ion a partir de la concentración de la sal y su subíndice.', unidad: 'mmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.2', 'la concentración de iones de un electrolito'), idealizado: 'Disociación completa.', metodo: 'concentración del ion deducida de la neutralidad eléctrica a partir del otro ion',
    parametros: (rengRng) => ({ e: rengIndice(rengRng, RENG_ELECTROLITOS_MULTI_SOL.length), k: rengIndice(rengRng, 2), c: rengEntreN1(rengRng, 20, 900, 5) }),
    valida: (rengD) => rengIonMulti(rengD.e, rengD.k).nu >= 2,
    respuesta: (rengD) => rengIonMulti(rengD.e, rengD.k).nu * rengD.c,
    errores: (rengD) => [
      ['sin-subindice', 'Sin el subíndice', rengD.c, 'Diste la concentración de la sal; cada fórmula aporta tantos iones de ese tipo como indica su subíndice.'],
      ['todos', 'Todos los iones', rengD.c * (RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.nc + RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.na), 'Sumaste todos los iones; la pregunta pide solo los de un tipo.']
    ],
    enunciado: (rengD) => `Una disolución de ${rengTextoSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula)}, electrolito fuerte, tiene una concentración de ${rengTx(rengD.c)} mmol/L.`,
    pregunta: (rengD) => `¿Cuál es la concentración de ${rengIonMulti(rengD.e, rengD.k).nombre}, en mmol/L?`,
    datos: (rengD) => [['Sal', rengTextoSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula)], ['Concentración de la sal', `${rengTx(rengD.c)} mmol/L`]],
    pasos: (rengD, rengR) => [`Cada fórmula aporta ${rengIonMulti(rengD.e, rengD.k).nu} ${rengIonMulti(rengD.e, rengD.k).nombre}.`, `[ion] = ${rengIonMulti(rengD.e, rengD.k).nu} × ${rengTx(rengD.c)} = ${rengTx(rengR)} mmol/L.`],
    pistas: ['Escribe la disociación de la sal.', 'Busca el subíndice del ion pedido.', 'Multiplica la concentración de la sal.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s2-p3', subtema: 'n1-b9-s2', titulo: 'Sal necesaria para aportar un ion', dificultad: 'avanzada',
    objetivo: 'Calcular la masa de un electrolito fuerte que aporta una cantidad dada de uno de sus iones.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.2', 'iones por fórmula de un electrolito', true), idealizado: 'Disociación completa.', metodo: 'búsqueda por bisección de la masa de sal que aporta los moles de ion pedidos',
    parametros: (rengRng) => ({ e: rengIndice(rengRng, RENG_ELECTROLITOS_MULTI_SOL.length), k: rengIndice(rengRng, 2), ni: rengEntreN1(rengRng, 0.1, 3, 0.01) }),
    valida: (rengD) => rengIonMulti(rengD.e, rengD.k).nu >= 2,
    respuesta: (rengD) => (rengD.ni / rengIonMulti(rengD.e, rengD.k).nu) * rengMmSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula),
    errores: (rengD) => [
      ['sin-dividir', 'Sin dividir entre el subíndice', rengD.ni * rengMmSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula), 'Olvidaste que cada fórmula aporta varios iones: los moles de sal son los de ion divididos entre el subíndice.'],
      ['entre-todos', 'Entre todos los iones', (rengD.ni / (RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.nc + RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.na)) * rengMmSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula), 'Dividiste entre el total de iones; solo cuenta el subíndice del ion pedido.']
    ],
    enunciado: (rengD) => `Se necesita una disolución que contenga ${rengTx(rengD.ni)} mol de ${rengIonMulti(rengD.e, rengD.k).nombre}, preparada solo con ${rengTextoSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula)}.`,
    pregunta: (rengD) => `¿Qué masa de ${rengTextoSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula)} hay que disolver, en g?`,
    datos: (rengD) => [['Ion necesario', `${rengTx(rengD.ni)} mol de ${rengIonMulti(rengD.e, rengD.k).nombre}`], rengDatoMasaSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula)],
    pasos: (rengD, rengR) => [`Moles de sal: ${rengTx(rengD.ni)} / ${rengIonMulti(rengD.e, rengD.k).nu} = ${rengTx(rengD.ni / rengIonMulti(rengD.e, rengD.k).nu)} mol.`, `Masa: ${rengTx(rengR)} g.`],
    pistas: ['¿Cuántos iones de ese tipo da cada fórmula?', 'Pasa de moles de ion a moles de sal.', 'Multiplica por la masa molar de la sal.']
  })
]

export const RENG_PRACTICAS_B09_S03: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s3-p1', subtema: 'n1-b9-s3', titulo: 'Masa máxima que se disuelve', dificultad: 'basica',
    objetivo: 'Usar la solubilidad en g por 100 g de agua para calcular la masa máxima que se disuelve.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'la solubilidad como proporción'), idealizado: 'Sal hipotética con solubilidad didáctica a temperatura fija.', metodo: 'búsqueda por bisección de la masa que da la proporción de la solubilidad',
    parametros: (rengRng) => ({ S: rengEntreN1(rengRng, 5, 90, 0.5), mw: rengEntreN1(rengRng, 20, 500, 5) }),
    respuesta: (rengD) => rengMaxSol(rengD.S, rengD.mw),
    errores: (rengD) => [
      ['invertida', 'Proporción invertida', (100 * rengD.mw) / rengD.S, 'Invertiste la proporción: la solubilidad son gramos de soluto por cada 100 g de agua.'],
      ['sin-escalar', 'Sin escalar', rengD.S, 'Diste la solubilidad tal cual; hay que escalarla a la masa de agua del problema.']
    ],
    enunciado: (rengD) => `La solubilidad de una sal hipotética es ${rengTx(rengD.S)} g por 100 g de agua a 25 °C (dato didáctico). Se dispone de ${rengTx(rengD.mw)} g de agua a 25 °C.`,
    pregunta: () => '¿Qué masa máxima de sal se puede disolver, en g?',
    datos: (rengD) => [['Solubilidad', `${rengTx(rengD.S)} g/100 g de agua`], ['Agua', `${rengTx(rengD.mw)} g`]],
    pasos: (rengD, rengR) => ['La solubilidad es una proporción soluto/agua.', `m = ${rengTx(rengD.S)} × ${rengTx(rengD.mw)}/100 = ${rengTx(rengR)} g.`],
    pistas: ['La solubilidad es una proporción.', 'Escálala a la masa de agua dada.', 'Multiplica por la masa de agua y divide entre 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s3-p2', subtema: 'n1-b9-s3', titulo: 'Solubilidad a partir del residuo seco', dificultad: 'intermedia',
    objetivo: 'Calcular la solubilidad en g por 100 g de agua evaporando una disolución saturada.', unidad: '', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'la medida de la solubilidad'), idealizado: 'Evaporación completa del agua sin pérdida de soluto.', metodo: 'porcentaje en masa del núcleo convertido en razón soluto/agua',
    parametros: (rengRng) => ({ msat: rengEntreN1(rengRng, 20, 300, 1), mr: rengEntreN1(rengRng, 2, 150, 0.1) }),
    valida: (rengD) => rengD.mr < 0.5 * rengD.msat && rengD.mr > 0.04 * rengD.msat,
    respuesta: (rengD) => (rengD.mr / (rengD.msat - rengD.mr)) * 100,
    errores: (rengD) => [
      ['sobre-disolucion', 'Entre la disolución', (rengD.mr / rengD.msat) * 100, 'Dividiste entre la masa de disolución; la solubilidad se refiere a 100 g de agua, así que divide entre el agua.'],
      ['invertida', 'Agua entre soluto', ((rengD.msat - rengD.mr) / rengD.mr) * 100, 'Invertiste el cociente: es masa de soluto entre masa de agua, por 100.']
    ],
    enunciado: (rengD) => `Se evaporan a sequedad ${rengTx(rengD.msat)} g de una disolución saturada de una sal a 25 °C y quedan ${rengTx(rengD.mr, 4)} g de sal seca.`,
    pregunta: () => '¿Cuál es la solubilidad de la sal, en g por 100 g de agua? (escribe solo el número)',
    datos: (rengD) => [['Disolución saturada', `${rengTx(rengD.msat)} g`], ['Sal seca', `${rengTx(rengD.mr, 4)} g`]],
    pasos: (rengD, rengR) => [`Agua evaporada: ${rengTx(rengD.msat)} − ${rengTx(rengD.mr, 4)} = ${rengTx(rengD.msat - rengD.mr, 4)} g.`, `S = sal / agua × 100 = ${rengTx(rengR)} g/100 g.`],
    pistas: ['¿Cuánta agua había en la disolución?', 'Divide la sal entre el agua.', 'Multiplica por 100 para tener g/100 g.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s3-p3', subtema: 'n1-b9-s3', titulo: 'Solubilidad molar de una sal poco soluble', dificultad: 'avanzada',
    objetivo: 'Convertir una solubilidad en gramos por litro en solubilidad molar.', unidad: 'mmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'la solubilidad molar', true), idealizado: 'Solubilidad didáctica en agua pura.', metodo: 'molaridad con la función del núcleo y conversión a mmol/L con el catálogo',
    sinVerificar: ['Las solubilidades en g/L son didácticas; no son los valores de tabla de estas sales.'],
    parametros: (rengRng) => ({ f: rengIndice(rengRng, RENG_POCO_SOLUBLES_SOL.length), s: rengEntreN1(rengRng, 0.05, 20, 0.01) }),
    respuesta: (rengD) => (rengD.s / rengMmSol(RENG_POCO_SOLUBLES_SOL[rengD.f]!)) * 1000,
    errores: (rengD) => [
      ['multiplica', 'Multiplicar por la masa molar', rengD.s * rengMmSol(RENG_POCO_SOLUBLES_SOL[rengD.f]!), 'Multiplicaste por la masa molar; para pasar de gramos a moles hay que dividir entre ella.'],
      ['en-mol', 'En mol/L', rengD.s / rengMmSol(RENG_POCO_SOLUBLES_SOL[rengD.f]!), 'Ese valor está en mol/L; la pregunta pide mmol/L, mil veces más.']
    ],
    enunciado: (rengD) => `En agua pura se disuelven como máximo ${rengTx(rengD.s, 4)} g/L de ${rengTextoSol(RENG_POCO_SOLUBLES_SOL[rengD.f]!)} (valor didáctico).`,
    pregunta: () => '¿Cuál es su solubilidad molar, en mmol/L?',
    datos: (rengD) => [['Solubilidad en masa', `${rengTx(rengD.s, 4)} g/L`], rengDatoMasaSol(RENG_POCO_SOLUBLES_SOL[rengD.f]!)],
    pasos: (rengD, rengR) => [`s = ${rengTx(rengD.s, 4)} / ${rengTx(rengMmSol(RENG_POCO_SOLUBLES_SOL[rengD.f]!), 5)} mol/L.`, `En mmol/L: ${rengTx(rengR)}.`],
    pistas: ['Pasa los gramos a moles.', 'El volumen es 1 litro.', 'Multiplica por 1000 para mmol/L.']
  })
]

export const RENG_PRACTICAS_B09_S04: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s4-p1', subtema: 'n1-b9-s4', titulo: 'Gas disuelto a otra presión', dificultad: 'basica',
    objetivo: 'Aplicar la ley de Henry para calcular la concentración de un gas disuelto a otra presión parcial.', unidad: 'mmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'la ley de Henry'), idealizado: 'Ley de Henry a temperatura constante con datos didácticos.', metodo: 'constante de Henry en mmol/(L·kPa) con las presiones convertidas por el catálogo',
    parametros: (rengRng) => ({ c1: rengEntreN1(rengRng, 0.5, 40, 0.1), p1: rengEntreN1(rengRng, 0.5, 2, 0.1), p2: rengEntreN1(rengRng, 0.2, 6, 0.1) }),
    respuesta: (rengD) => (rengD.c1 * rengD.p2) / rengD.p1,
    errores: (rengD) => [
      ['inversa', 'Proporción inversa', (rengD.c1 * rengD.p1) / rengD.p2, 'Usaste una proporción inversa; por la ley de Henry, más presión disuelve más gas.'],
      ['sin-cambio', 'Sin cambio', rengD.c1, 'Dejaste la misma concentración; al cambiar la presión parcial cambia el gas disuelto.']
    ],
    enunciado: (rengD) => `Un gas está disuelto en agua con una concentración de ${rengTx(rengD.c1)} mmol/L cuando su presión parcial es ${rengTx(rengD.p1)} atm (datos didácticos). La temperatura no cambia.`,
    pregunta: (rengD) => `¿Qué concentración tendrá con una presión parcial de ${rengTx(rengD.p2)} atm, en mmol/L?`,
    datos: (rengD) => [['c₁', `${rengTx(rengD.c1)} mmol/L`], ['p₁', `${rengTx(rengD.p1)} atm`], ['p₂', `${rengTx(rengD.p2)} atm`]],
    pasos: (rengD, rengR) => ['Ley de Henry: c = k·p a temperatura constante.', `c₂ = ${rengTx(rengD.c1)} × ${rengTx(rengD.p2)}/${rengTx(rengD.p1)} = ${rengTx(rengR)} mmol/L.`],
    pistas: ['¿Qué ley relaciona gas disuelto y presión?', 'La concentración es proporcional a la presión.', 'Multiplica por p₂ y divide entre p₁.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s4-p2', subtema: 'n1-b9-s4', titulo: 'Solubilidad leída en una curva lineal', dificultad: 'intermedia',
    objetivo: 'Evaluar una curva de solubilidad a una temperatura y escalarla a la masa de agua disponible.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'la solubilidad y la temperatura'), idealizado: 'Curva de solubilidad lineal didáctica.', metodo: 'interpolación lineal entre las solubilidades a 0 °C y 100 °C',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 10, 50, 1), b: rengEntreN1(rengRng, 0.2, 1.2, 0.05), T: rengEntreN1(rengRng, 10, 90, 5), mw: rengEntreN1(rengRng, 50, 400, 10) }),
    respuesta: (rengD) => rengMaxSol(rengSolubilidadLineal(rengD.a, rengD.b, rengD.T), rengD.mw),
    errores: (rengD) => [
      ['a-cero', 'Solubilidad a 0 °C', rengMaxSol(rengD.a, rengD.mw), 'Usaste la solubilidad a 0 °C; hay que evaluar la recta a la temperatura dada.'],
      ['sin-escalar', 'Sin escalar al agua', rengSolubilidadLineal(rengD.a, rengD.b, rengD.T), 'Diste la solubilidad por 100 g de agua; escálala a la masa de agua del problema.']
    ],
    enunciado: (rengD) => `La solubilidad de una sal hipotética sigue la recta S = ${rengTx(rengD.a)} + ${rengTx(rengD.b)}·t (S en g/100 g de agua, t en °C; modelo didáctico). Se tienen ${rengTx(rengD.mw)} g de agua a ${rengTx(rengD.T)} °C.`,
    pregunta: () => '¿Qué masa máxima de sal se disuelve, en g?',
    datos: (rengD) => [['Curva', `S = ${rengTx(rengD.a)} + ${rengTx(rengD.b)}·t`], ['Temperatura', `${rengTx(rengD.T)} °C`], ['Agua', `${rengTx(rengD.mw)} g`]],
    pasos: (rengD, rengR) => [`S(${rengTx(rengD.T)} °C) = ${rengTx(rengSolubilidadLineal(rengD.a, rengD.b, rengD.T))} g/100 g.`, `Con ${rengTx(rengD.mw)} g de agua: ${rengTx(rengR)} g.`],
    pistas: ['Evalúa la recta a esa temperatura.', 'Obtienes gramos por 100 g de agua.', 'Escala a la masa de agua disponible.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s4-p3', subtema: 'n1-b9-s4', titulo: 'Cristales al enfriar una disolución saturada', dificultad: 'avanzada',
    objetivo: 'Calcular la masa que cristaliza al enfriar una disolución saturada usando una curva de solubilidad.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'la cristalización por enfriamiento'), idealizado: 'Curva lineal didáctica y cristalización completa hasta la saturación.', metodo: 'balance de masas de disolución saturada a cada temperatura',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 10, 50, 1), b: rengEntreN1(rengRng, 0.2, 1.2, 0.05), T1: rengEntreN1(rengRng, 60, 95, 5), T2: rengEntreN1(rengRng, 0, 40, 5), mw: rengEntreN1(rengRng, 50, 400, 10) }),
    respuesta: (rengD) => rengMaxSol(rengD.b * (rengD.T1 - rengD.T2), rengD.mw),
    errores: (rengD) => [
      ['todo-caliente', 'Todo lo disuelto en caliente', rengMaxSol(rengSolubilidadLineal(rengD.a, rengD.b, rengD.T1), rengD.mw), 'Diste todo el soluto disuelto en caliente; solo cristaliza lo que excede la solubilidad en frío.'],
      ['sin-escalar', 'Por 100 g de agua', rengD.b * (rengD.T1 - rengD.T2), 'Diste la diferencia por 100 g de agua; escálala a la masa de agua real.']
    ],
    enunciado: (rengD) => `La solubilidad de una sal hipotética es S = ${rengTx(rengD.a)} + ${rengTx(rengD.b)}·t (g/100 g de agua, t en °C; modelo didáctico). Una disolución saturada con ${rengTx(rengD.mw)} g de agua a ${rengTx(rengD.T1)} °C se enfría hasta ${rengTx(rengD.T2)} °C.`,
    pregunta: () => '¿Qué masa de sal cristaliza, en g?',
    datos: (rengD) => [['Curva', `S = ${rengTx(rengD.a)} + ${rengTx(rengD.b)}·t`], ['Agua', `${rengTx(rengD.mw)} g`], ['Enfriamiento', `${rengTx(rengD.T1)} °C → ${rengTx(rengD.T2)} °C`]],
    pasos: (rengD, rengR) => [`S(${rengTx(rengD.T1)} °C) = ${rengTx(rengSolubilidadLineal(rengD.a, rengD.b, rengD.T1))} y S(${rengTx(rengD.T2)} °C) = ${rengTx(rengSolubilidadLineal(rengD.a, rengD.b, rengD.T2))} g/100 g.`, `Cristaliza la diferencia escalada al agua: ${rengTx(rengR)} g.`],
    pistas: ['Calcula la solubilidad a cada temperatura.', 'La diferencia es lo que sobra al enfriar.', 'Escala a la masa de agua real.']
  })
]

export const RENG_PRACTICAS_B09_S05: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s5-p1', subtema: 'n1-b9-s5', titulo: 'Masa de una disolución saturada', dificultad: 'basica',
    objetivo: 'Calcular la masa de una disolución saturada a partir de la solubilidad y la masa de agua.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'las disoluciones saturadas'), idealizado: 'Sal hipotética con solubilidad didáctica.', metodo: 'masa de agua más el soluto obtenido por bisección de la proporción de saturación',
    parametros: (rengRng) => ({ S: rengEntreN1(rengRng, 5, 120, 0.5), mw: rengEntreN1(rengRng, 20, 600, 5) }),
    respuesta: (rengD) => rengD.mw + rengMaxSol(rengD.S, rengD.mw),
    errores: (rengD) => [
      ['solo-soluto', 'Solo el soluto', rengMaxSol(rengD.S, rengD.mw), 'Diste solo la masa de soluto disuelto; la disolución incluye además el agua.'],
      ['solo-agua', 'Solo el agua', rengD.mw, 'Diste solo la masa del agua; la disolución saturada incluye además el soluto disuelto.']
    ],
    enunciado: (rengD) => `Se prepara una disolución saturada de una sal hipotética con ${rengTx(rengD.mw)} g de agua. Su solubilidad a esa temperatura es ${rengTx(rengD.S)} g/100 g de agua (dato didáctico).`,
    pregunta: () => '¿Qué masa tiene la disolución saturada, en g?',
    datos: (rengD) => [['Agua', `${rengTx(rengD.mw)} g`], ['Solubilidad', `${rengTx(rengD.S)} g/100 g`]],
    pasos: (rengD, rengR) => [`Soluto disuelto: ${rengTx(rengMaxSol(rengD.S, rengD.mw))} g.`, `Disolución: ${rengTx(rengR)} g.`],
    pistas: ['Saturada: contiene justo la solubilidad.', 'Calcula el soluto con la masa de agua.', 'Suma agua y soluto.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s5-p2', subtema: 'n1-b9-s5', titulo: 'Porcentaje en masa de una disolución saturada', dificultad: 'intermedia',
    objetivo: 'Pasar una solubilidad en g por 100 g de agua al porcentaje en masa de la disolución saturada.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('11.3', 'la composición de una disolución saturada'), idealizado: 'Solubilidad didáctica.', metodo: 'porcentaje con la función del núcleo para una disolución saturada preparada con 250 g de agua',
    parametros: (rengRng) => ({ S: rengEntreN1(rengRng, 5, 150, 0.5) }),
    respuesta: (rengD) => (rengD.S / (100 + rengD.S)) * 100,
    errores: (rengD) => [
      ['igual-s', 'Solubilidad como porcentaje', rengD.S, 'Tomaste la solubilidad como porcentaje en masa; la solubilidad es por 100 g de agua, no de disolución.'],
      ['agua', 'Porcentaje de agua', (100 / (100 + rengD.S)) * 100, 'Calculaste el porcentaje de agua; la pregunta pide el de soluto.']
    ],
    enunciado: (rengD) => `La solubilidad de una sal hipotética es ${rengTx(rengD.S)} g por 100 g de agua (dato didáctico).`,
    pregunta: () => '¿Qué porcentaje en masa de sal tiene su disolución saturada?',
    datos: (rengD) => [['Solubilidad', `${rengTx(rengD.S)} g/100 g de agua`], ['Referencia', '100 g de agua saturados']],
    pasos: (rengD, rengR) => [`100 g de agua + ${rengTx(rengD.S)} g de sal = ${rengTx(100 + rengD.S)} g de disolución.`, `% m/m = ${rengTx(rengR)} %.`],
    pistas: ['Toma 100 g de agua saturados.', 'La disolución pesa 100 g más el soluto.', 'Divide soluto entre disolución.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s5-p3', subtema: 'n1-b9-s5', titulo: 'Molalidad de una disolución saturada', dificultad: 'avanzada',
    objetivo: 'Calcular la molalidad de una disolución saturada a partir de su porcentaje en masa.', unidad: 'mol/kg', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'la concentración de saturación', true), idealizado: 'Porcentaje de saturación didáctico.', metodo: 'función del núcleo para la molalidad con la masa de agua convertida a kg por el catálogo',
    sinVerificar: ['Los porcentajes de saturación son didácticos; no son los valores de tabla de estas sales.'],
    parametros: (rengRng) => ({ f: rengIndice(rengRng, RENG_SATURADAS_FORMULAS.length), p: rengEntreN1(rengRng, 10, 40, 0.5) }),
    respuesta: (rengD) => {
      const rengM = rengMmSol(RENG_SATURADAS_FORMULAS[rengD.f]!)
      return rengD.p / rengM / ((100 - rengD.p) / 1000)
    },
    errores: (rengD) => {
      const rengM = rengMmSol(RENG_SATURADAS_FORMULAS[rengD.f]!)
      return [
        ['sobre-disolucion', 'Por kg de disolución', (10 * rengD.p) / rengM, 'Dividiste entre la masa de disolución; la molalidad usa solo los kilogramos de agua.'],
        ['gramos', 'Gramos sin pasar a kg', rengD.p / rengM / (100 - rengD.p), 'Dejaste la masa de agua en gramos; la molalidad usa kilogramos.']
      ]
    },
    enunciado: (rengD) => `Una disolución saturada de ${rengTextoSol(RENG_SATURADAS_FORMULAS[rengD.f]!)} a cierta temperatura tiene un ${rengTx(rengD.p)} % en masa de sal (valor didáctico).`,
    pregunta: () => '¿Cuál es su molalidad, en mol/kg?',
    datos: (rengD) => [['% m/m', `${rengTx(rengD.p)} %`], rengDatoMasaSol(RENG_SATURADAS_FORMULAS[rengD.f]!)],
    pasos: (rengD, rengR) => [`En 100 g: ${rengTx(rengD.p)} g de sal y ${rengTx(100 - rengD.p)} g de agua.`, `b = moles de sal / kg de agua = ${rengTx(rengR)} mol/kg.`],
    pistas: ['Toma 100 g de disolución.', 'Separa la masa de sal y la de agua.', 'Divide los moles entre los kg de agua.']
  })
]


export const RENG_PRACTICAS_B09_S06: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s6-p1', subtema: 'n1-b9-s6', titulo: 'Cuánto soluto más admite', dificultad: 'basica',
    objetivo: 'Calcular cuánto soluto más admite una disolución insaturada hasta saturarse.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'las disoluciones insaturadas'), idealizado: 'Solubilidad didáctica a temperatura fija.', metodo: 'búsqueda por bisección de la masa añadida que lleva a la saturación',
    parametros: (rengRng) => ({ S: rengEntreN1(rengRng, 10, 90, 0.5), mw: rengEntreN1(rengRng, 50, 500, 5), ms: rengEntreN1(rengRng, 1, 300, 0.5) }),
    valida: (rengD) => rengD.ms < 0.9 * rengMaxSol(rengD.S, rengD.mw) && rengD.ms > 0.1 * rengMaxSol(rengD.S, rengD.mw),
    respuesta: (rengD) => rengMaxSol(rengD.S, rengD.mw) - rengD.ms,
    errores: (rengD) => [
      ['maximo', 'El máximo total', rengMaxSol(rengD.S, rengD.mw), 'Diste el máximo total; hay que restar lo que ya está disuelto.'],
      ['suma', 'Sumar lo disuelto', rengMaxSol(rengD.S, rengD.mw) + rengD.ms, 'Sumaste lo disuelto al máximo; lo ya disuelto ocupa parte de la capacidad, así que se resta.']
    ],
    enunciado: (rengD) => `En ${rengTx(rengD.mw)} g de agua hay disueltos ${rengTx(rengD.ms)} g de una sal cuya solubilidad a esa temperatura es ${rengTx(rengD.S)} g/100 g de agua (dato didáctico).`,
    pregunta: () => '¿Cuántos gramos más de sal se pueden disolver a la misma temperatura?',
    datos: (rengD) => [['Agua', `${rengTx(rengD.mw)} g`], ['Disuelto', `${rengTx(rengD.ms)} g`], ['Solubilidad', `${rengTx(rengD.S)} g/100 g`]],
    pasos: (rengD, rengR) => [`Máximo con esa agua: ${rengTx(rengMaxSol(rengD.S, rengD.mw))} g.`, `Falta: ${rengTx(rengR)} g.`],
    pistas: ['Calcula el máximo para esa masa de agua.', 'Compara con lo ya disuelto.', 'La diferencia es lo que falta.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s6-p2', subtema: 'n1-b9-s6', titulo: 'Grado de saturación', dificultad: 'intermedia',
    objetivo: 'Calcular qué porcentaje de la saturación alcanza una disolución insaturada.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('11.3', 'las disoluciones insaturadas'), idealizado: 'Solubilidad didáctica a temperatura fija.', metodo: 'gramos disueltos por 100 g de agua comparados con la solubilidad',
    parametros: (rengRng) => ({ S: rengEntreN1(rengRng, 10, 90, 0.5), mw: rengEntreN1(rengRng, 50, 500, 5), ms: rengEntreN1(rengRng, 1, 300, 0.5) }),
    valida: (rengD) => rengD.ms < 0.95 * rengMaxSol(rengD.S, rengD.mw) && rengD.ms > 0.05 * rengMaxSol(rengD.S, rengD.mw),
    respuesta: (rengD) => (rengD.ms / rengMaxSol(rengD.S, rengD.mw)) * 100,
    errores: (rengD) => [
      ['sin-escalar', 'Sin escalar la solubilidad', (rengD.ms / rengD.S) * 100, 'Comparaste con la solubilidad por 100 g sin escalarla a la masa de agua del problema.'],
      ['porcentaje-masa', 'Porcentaje en masa', (rengD.ms / (rengD.ms + rengD.mw)) * 100, 'Calculaste el porcentaje en masa; el grado de saturación compara lo disuelto con lo máximo.']
    ],
    enunciado: (rengD) => `Una disolución contiene ${rengTx(rengD.ms)} g de una sal en ${rengTx(rengD.mw)} g de agua. La solubilidad a esa temperatura es ${rengTx(rengD.S)} g/100 g de agua (dato didáctico).`,
    pregunta: () => '¿Qué grado de saturación tiene, en % de la saturación?',
    datos: (rengD) => [['Disuelto', `${rengTx(rengD.ms)} g`], ['Agua', `${rengTx(rengD.mw)} g`], ['Solubilidad', `${rengTx(rengD.S)} g/100 g`]],
    pasos: (rengD, rengR) => [`Máximo: ${rengTx(rengMaxSol(rengD.S, rengD.mw))} g.`, `Grado = disuelto / máximo × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Calcula el máximo para esa agua.', 'Divide lo disuelto entre el máximo.', 'Multiplica por 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s6-p3', subtema: 'n1-b9-s6', titulo: 'Agua que hay que evaporar para saturar', dificultad: 'avanzada',
    objetivo: 'Calcular cuánta agua hay que evaporar para que una disolución insaturada llegue a la saturación.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'la saturación por evaporación'), idealizado: 'Evaporación sin cambio de temperatura ni pérdida de soluto.', metodo: 'búsqueda por bisección del agua evaporada que lleva la proporción a la solubilidad',
    parametros: (rengRng) => ({ S: rengEntreN1(rengRng, 10, 90, 0.5), ms: rengEntreN1(rengRng, 5, 100, 0.5), mw: rengEntreN1(rengRng, 50, 600, 5) }),
    valida: (rengD) => rengD.ms < 0.9 * rengMaxSol(rengD.S, rengD.mw),
    respuesta: (rengD) => rengD.mw - (rengD.ms * 100) / rengD.S,
    errores: (rengD) => [
      ['agua-final', 'Agua que queda', (rengD.ms * 100) / rengD.S, 'Diste el agua que debe quedar; la pregunta pide la que hay que evaporar.'],
      ['por-disolucion', 'Solubilidad por 100 g de disolución', rengD.mw - (rengD.ms * (100 - rengD.S)) / rengD.S, 'Tomaste la solubilidad por 100 g de disolución; se refiere a 100 g de agua.']
    ],
    enunciado: (rengD) => `Una disolución contiene ${rengTx(rengD.ms)} g de una sal en ${rengTx(rengD.mw)} g de agua. La solubilidad es ${rengTx(rengD.S)} g/100 g de agua (dato didáctico) y la temperatura no cambia.`,
    pregunta: () => '¿Qué masa de agua hay que evaporar para que quede saturada, en g?',
    datos: (rengD) => [['Sal', `${rengTx(rengD.ms)} g`], ['Agua', `${rengTx(rengD.mw)} g`], ['Solubilidad', `${rengTx(rengD.S)} g/100 g`]],
    pasos: (rengD, rengR) => [`Agua justa para saturar: ${rengTx(rengD.ms)} × 100 / ${rengTx(rengD.S)} = ${rengTx((rengD.ms * 100) / rengD.S)} g.`, `Hay que evaporar ${rengTx(rengR)} g.`],
    pistas: ['¿Cuánta agua basta para disolver justo esa sal?', 'Usa la solubilidad como proporción.', 'Resta del agua que hay.']
  })
]

export const RENG_PRACTICAS_B09_S07: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s7-p1', subtema: 'n1-b9-s7', titulo: 'Masa que cristaliza al sembrar un cristal', dificultad: 'basica',
    objetivo: 'Calcular cuánto soluto cristaliza cuando una disolución sobresaturada vuelve a la saturación.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.3', 'las disoluciones sobresaturadas'), idealizado: 'Cristalización completa hasta la saturación a temperatura fija.', metodo: 'balance de masas de disolución antes y después de cristalizar',
    parametros: (rengRng) => ({ S: rengEntreN1(rengRng, 10, 90, 0.5), mw: rengEntreN1(rengRng, 50, 400, 5), ms: rengEntreN1(rengRng, 1, 600, 0.5) }),
    valida: (rengD) => rengD.ms > 1.05 * rengMaxSol(rengD.S, rengD.mw) && rengD.ms < 2 * rengMaxSol(rengD.S, rengD.mw),
    respuesta: (rengD) => rengD.ms - rengMaxSol(rengD.S, rengD.mw),
    errores: (rengD) => [
      ['todo', 'Todo el soluto', rengD.ms, 'Supusiste que cristaliza todo; solo cristaliza el exceso y la disolución queda saturada.'],
      ['saturacion', 'Lo que queda disuelto', rengMaxSol(rengD.S, rengD.mw), 'Diste lo que queda disuelto; lo que cristaliza es la diferencia con lo que había.']
    ],
    enunciado: (rengD) => `Una disolución sobresaturada contiene ${rengTx(rengD.ms)} g de una sal en ${rengTx(rengD.mw)} g de agua. La solubilidad a esa temperatura es ${rengTx(rengD.S)} g/100 g de agua (dato didáctico). Se añade un pequeño cristal.`,
    pregunta: () => '¿Qué masa de sal cristaliza, en g?',
    datos: (rengD) => [['Disuelto', `${rengTx(rengD.ms)} g`], ['Agua', `${rengTx(rengD.mw)} g`], ['Solubilidad', `${rengTx(rengD.S)} g/100 g`]],
    pasos: (rengD, rengR) => [`Queda disuelto lo de saturación: ${rengTx(rengMaxSol(rengD.S, rengD.mw))} g.`, `Cristaliza el exceso: ${rengTx(rengR)} g.`],
    pistas: ['¿Cuánto cabe en esa agua?', 'El exceso sobre la saturación cristaliza.', 'Resta lo que cabe de lo que hay.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s7-p2', subtema: 'n1-b9-s7', titulo: 'Sobresaturación relativa', dificultad: 'intermedia',
    objetivo: 'Calcular en qué porcentaje supera una disolución sobresaturada a la saturación.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('11.3', 'las disoluciones sobresaturadas'), idealizado: 'Solubilidad didáctica a temperatura fija.', metodo: 'cociente disuelto/saturación menos 1',
    parametros: (rengRng) => ({ S: rengEntreN1(rengRng, 10, 90, 0.5), x: rengEntreN1(rengRng, 11, 200, 0.5) }),
    valida: (rengD) => rengD.x > 1.03 * rengD.S && rengD.x < 2.5 * rengD.S,
    respuesta: (rengD) => ((rengD.x - rengD.S) / rengD.S) * 100,
    errores: (rengD) => [
      ['sobre-disuelto', 'Entre lo disuelto', ((rengD.x - rengD.S) / rengD.x) * 100, 'Dividiste entre lo disuelto; la sobresaturación relativa se refiere a la saturación.'],
      ['cociente', 'Cociente sin restar', (rengD.x / rengD.S) * 100, 'Diste el cociente por 100 sin restar la saturación (el 100 % que ya cabe).']
    ],
    enunciado: (rengD) => `Una disolución contiene ${rengTx(rengD.x)} g de una sal por cada 100 g de agua sin cristalizar. La solubilidad a esa temperatura es ${rengTx(rengD.S)} g/100 g de agua (dato didáctico).`,
    pregunta: () => '¿En qué porcentaje supera lo disuelto a la saturación?',
    datos: (rengD) => [['Disuelto', `${rengTx(rengD.x)} g/100 g de agua`], ['Solubilidad', `${rengTx(rengD.S)} g/100 g`]],
    pasos: (rengD, rengR) => [`Exceso: ${rengTx(rengD.x - rengD.S)} g por 100 g de agua.`, `Relativo a la saturación: ${rengTx(rengR)} %.`],
    pistas: ['Calcula el exceso sobre la solubilidad.', 'Divide el exceso entre la solubilidad.', 'Multiplica por 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s7-p3', subtema: 'n1-b9-s7', titulo: 'Rendimiento de una recristalización', dificultad: 'avanzada',
    objetivo: 'Calcular qué fracción del soluto se recupera como cristales al enfriar una disolución saturada en caliente.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('11.3', 'la cristalización y la solubilidad'), idealizado: 'Curva de solubilidad lineal didáctica y cristalización completa.', metodo: 'masas de soluto con 250 g de agua a cada temperatura',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 5, 40, 1), b: rengEntreN1(rengRng, 0.3, 1.5, 0.05), T1: rengEntreN1(rengRng, 60, 95, 5), T2: rengEntreN1(rengRng, 0, 30, 5) }),
    respuesta: (rengD) => ((rengSolubilidadLineal(rengD.a, rengD.b, rengD.T1) - rengSolubilidadLineal(rengD.a, rengD.b, rengD.T2)) / rengSolubilidadLineal(rengD.a, rengD.b, rengD.T1)) * 100,
    errores: (rengD) => {
      const rengS1 = rengSolubilidadLineal(rengD.a, rengD.b, rengD.T1)
      const rengS2 = rengSolubilidadLineal(rengD.a, rengD.b, rengD.T2)
      return [
        ['sobre-frio', 'Entre la solubilidad en frío', ((rengS1 - rengS2) / rengS2) * 100, 'Dividiste entre la solubilidad en frío; el rendimiento se refiere a lo que había disuelto en caliente.'],
        ['queda', 'Fracción que queda disuelta', (rengS2 / rengS1) * 100, 'Calculaste la fracción que queda disuelta; la pregunta pide la que cristaliza.']
      ]
    },
    enunciado: (rengD) => `Para purificar una sal hipotética se satura con ella agua a ${rengTx(rengD.T1)} °C y se enfría hasta ${rengTx(rengD.T2)} °C. Su solubilidad es S = ${rengTx(rengD.a)} + ${rengTx(rengD.b)}·t (g/100 g de agua, t en °C; modelo didáctico).`,
    pregunta: () => '¿Qué porcentaje de la sal disuelta se recupera como cristales?',
    datos: (rengD) => [['Curva', `S = ${rengTx(rengD.a)} + ${rengTx(rengD.b)}·t`], ['Enfriamiento', `${rengTx(rengD.T1)} °C → ${rengTx(rengD.T2)} °C`]],
    pasos: (rengD, rengR) => [`S en caliente ${rengTx(rengSolubilidadLineal(rengD.a, rengD.b, rengD.T1))} y en frío ${rengTx(rengSolubilidadLineal(rengD.a, rengD.b, rengD.T2))} g/100 g.`, `Recuperado: (S₁ − S₂)/S₁ × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Calcula la solubilidad en caliente y en frío.', 'Cristaliza la diferencia.', 'Divide entre lo disuelto en caliente.']
  })
]
