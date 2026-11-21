import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_ACIDOS_SOL, RENG_BASES_SOL, RENG_DENSIDAD_ETANOL_SOL, RENG_POLIPROTICOS_SOL, RENG_REACTIVOS_LAB_SOL, RENG_SOLUTOS_SOL, RENG_TOL_SOL, RENG_TOL_SOL_PCT, rengDatoMasaSol, rengFuentesSol, rengMmSol, rengTextoSol } from './b09-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const M_AGUA = rengMmSol('H2O')
const rengSol = (rengI: number) => RENG_SOLUTOS_SOL[rengI]!
const rengMs = (rengI: number): number => rengMmSol(RENG_SOLUTOS_SOL[rengI]!.formula)
const rengLab = (rengI: number) => RENG_REACTIVOS_LAB_SOL[rengI]!

export const RENG_PRACTICAS_B09_S08: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s8-p1', subtema: 'n1-b9-s8', titulo: 'Porcentaje en masa de una disolución', dificultad: 'basica',
    objetivo: 'Calcular el porcentaje en masa de soluto a partir de las masas de soluto y disolvente.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('3.4', 'el porcentaje en masa'), idealizado: 'Disolución de dos componentes.', metodo: 'función del núcleo para el porcentaje en masa',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), ms: rengEntreN1(rengRng, 1, 100, 0.5), md: rengEntreN1(rengRng, 20, 900, 5) }),
    respuesta: (rengD) => (rengD.ms / (rengD.ms + rengD.md)) * 100,
    errores: (rengD) => [
      ['sobre-agua', 'Entre el agua', (rengD.ms / rengD.md) * 100, 'Dividiste entre la masa de agua; el porcentaje en masa usa la masa de disolución (soluto + agua).'],
      ['agua', 'Porcentaje de agua', (rengD.md / (rengD.ms + rengD.md)) * 100, 'Calculaste el porcentaje de agua; la pregunta pide el de soluto.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.ms)} g de ${rengSol(rengD.s).nombre} en ${rengTx(rengD.md)} g de agua.`,
    pregunta: () => '¿Cuál es el porcentaje en masa de soluto?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.ms)} g`], ['Agua', `${rengTx(rengD.md)} g`]],
    pasos: (rengD, rengR) => [`Masa de disolución: ${rengTx(rengD.ms + rengD.md)} g.`, `% m/m = ${rengTx(rengR)} %.`],
    pistas: ['Calcula la masa de disolución.', 'Divide el soluto entre la disolución.', 'Multiplica por 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s8-p2', subtema: 'n1-b9-s8', titulo: 'Soluto en una masa de disolución', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de soluto contenida en una masa de disolución de porcentaje conocido.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'el porcentaje en masa'), idealizado: 'Disolución homogénea.', metodo: 'búsqueda por bisección de la masa de soluto con la función del núcleo para el porcentaje en masa',
    parametros: (rengRng) => ({ mt: rengEntreN1(rengRng, 50, 2000, 10), p: rengEntreN1(rengRng, 0.5, 40, 0.5) }),
    respuesta: (rengD) => (rengD.mt * rengD.p) / 100,
    errores: (rengD) => [
      ['sin-100', 'Sin dividir entre 100', rengD.mt * rengD.p, 'Multiplicaste por el porcentaje sin dividir entre 100.'],
      ['agua', 'Masa de agua', rengD.mt * (1 - rengD.p / 100), 'Calculaste la masa de agua; la pregunta pide la de soluto.']
    ],
    enunciado: (rengD) => `Se tienen ${rengTx(rengD.mt)} g de una disolución acuosa al ${rengTx(rengD.p)} % en masa.`,
    pregunta: () => '¿Cuántos gramos de soluto contiene?',
    datos: (rengD) => [['Disolución', `${rengTx(rengD.mt)} g`], ['% m/m', `${rengTx(rengD.p)} %`]],
    pasos: (rengD, rengR) => ['m(soluto) = m(disolución) × % / 100.', `m = ${rengTx(rengD.mt)} × ${rengTx(rengD.p)}/100 = ${rengTx(rengR)} g.`],
    pistas: ['El porcentaje es de la disolución.', 'Multiplica la masa por el porcentaje.', 'Divide entre 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s8-p3', subtema: 'n1-b9-s8', titulo: 'Diluir en masa hasta otro porcentaje', dificultad: 'avanzada',
    objetivo: 'Calcular el agua que hay que añadir a una disolución para bajar su porcentaje en masa.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'el porcentaje en masa'), idealizado: 'Solo se añade agua; el soluto se conserva.', metodo: 'búsqueda por bisección del agua añadida con la función del núcleo para el porcentaje en masa',
    parametros: (rengRng) => ({ m1: rengEntreN1(rengRng, 50, 1000, 10), p1: rengEntreN1(rengRng, 5, 60, 0.5), p2: rengEntreN1(rengRng, 0.5, 50, 0.1) }),
    valida: (rengD) => rengD.p2 < 0.9 * rengD.p1 && rengD.p2 > 0.05 * rengD.p1,
    respuesta: (rengD) => (rengD.m1 * rengD.p1) / rengD.p2 - rengD.m1,
    errores: (rengD) => [
      ['masa-final', 'Masa final', (rengD.m1 * rengD.p1) / rengD.p2, 'Diste la masa final de disolución; el agua añadida es esa masa menos la inicial.'],
      ['al-reves', 'Proporción al revés', (rengD.m1 * rengD.p2) / rengD.p1, 'Usaste la proporción al revés: para bajar el porcentaje la masa de disolución debe crecer.']
    ],
    enunciado: (rengD) => `Se tienen ${rengTx(rengD.m1)} g de una disolución al ${rengTx(rengD.p1)} % en masa y se quiere llevar al ${rengTx(rengD.p2)} % añadiendo agua.`,
    pregunta: () => '¿Qué masa de agua hay que añadir, en g?',
    datos: (rengD) => [['Disolución', `${rengTx(rengD.m1)} g al ${rengTx(rengD.p1)} %`], ['Objetivo', `${rengTx(rengD.p2)} %`]],
    pasos: (rengD, rengR) => [`Soluto: ${rengTx((rengD.m1 * rengD.p1) / 100)} g; masa final: ${rengTx((rengD.m1 * rengD.p1) / rengD.p2)} g.`, `Agua añadida: ${rengTx(rengR)} g.`],
    pistas: ['El soluto no cambia al añadir agua.', 'Calcula la masa final con el nuevo porcentaje.', 'Resta la masa inicial.']
  })
]

export const RENG_PRACTICAS_B09_S09: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s9-p1', subtema: 'n1-b9-s9', titulo: 'Porcentaje en volumen', dificultad: 'basica',
    objetivo: 'Calcular el porcentaje en volumen de un soluto líquido en una disolución.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('3.4', 'el porcentaje en volumen'), idealizado: 'Volumen final medido.', metodo: 'volúmenes pasados a litros con el catálogo de unidades',
    parametros: (rengRng) => ({ vs: rengEntreN1(rengRng, 5, 300, 0.5), vt: rengEntreN1(rengRng, 100, 2000, 10) }),
    valida: (rengD) => rengD.vs < 0.6 * rengD.vt,
    respuesta: (rengD) => (rengD.vs / rengD.vt) * 100,
    errores: (rengD) => [
      ['sobre-resto', 'Entre el resto', (rengD.vs / (rengD.vt - rengD.vs)) * 100, 'Dividiste entre el volumen del resto de la disolución; el porcentaje usa el volumen total.'],
      ['invertido', 'Cociente invertido', (rengD.vt / rengD.vs) * 100, 'Invertiste el cociente: es volumen de soluto entre volumen de disolución.']
    ],
    enunciado: (rengD) => `En ${rengTx(rengD.vt)} mL de una mezcla hay ${rengTx(rengD.vs)} mL de etanol (volumen final medido).`,
    pregunta: () => '¿Cuál es el porcentaje en volumen de etanol?',
    datos: (rengD) => [['Etanol', `${rengTx(rengD.vs)} mL`], ['Mezcla', `${rengTx(rengD.vt)} mL`]],
    pasos: (rengD, rengR) => ['% v/v = V(soluto) / V(disolución) × 100.', `% v/v = ${rengTx(rengR)} %.`],
    pistas: ['Usa volúmenes, no masas.', 'El denominador es el volumen total.', 'Multiplica por 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s9-p2', subtema: 'n1-b9-s9', titulo: 'Volumen de soluto en una mezcla', dificultad: 'intermedia',
    objetivo: 'Calcular el volumen de soluto contenido en un volumen de disolución de porcentaje en volumen dado.', unidad: 'mL', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'el porcentaje en volumen'), idealizado: 'Volumen final medido.', metodo: 'volumen de mezcla en litros con el catálogo, multiplicado y devuelto a mililitros',
    parametros: (rengRng) => ({ vt: rengEntreN1(rengRng, 100, 1500, 10), p: rengEntreN1(rengRng, 2, 70, 0.5) }),
    respuesta: (rengD) => (rengD.vt * rengD.p) / 100,
    errores: (rengD) => [
      ['sin-100', 'Sin dividir entre 100', rengD.vt * rengD.p, 'Multiplicaste por el porcentaje sin dividir entre 100.'],
      ['resto', 'Volumen del resto', rengD.vt * (1 - rengD.p / 100), 'Calculaste el volumen del resto; la pregunta pide el del soluto.']
    ],
    enunciado: (rengD) => `Un desinfectante de ${rengTx(rengD.vt)} mL tiene un ${rengTx(rengD.p)} % en volumen de etanol.`,
    pregunta: () => '¿Cuántos mililitros de etanol contiene?',
    datos: (rengD) => [['Volumen', `${rengTx(rengD.vt)} mL`], ['% v/v', `${rengTx(rengD.p)} %`]],
    pasos: (rengD, rengR) => ['V(etanol) = V × % / 100.', `V = ${rengTx(rengR)} mL.`],
    pistas: ['El porcentaje es del volumen total.', 'Multiplica el volumen por el porcentaje.', 'Divide entre 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s9-p3', subtema: 'n1-b9-s9', titulo: 'Masa de etanol a partir del % v/v', dificultad: 'avanzada',
    objetivo: 'Pasar del porcentaje en volumen a la masa de soluto usando su densidad.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'el porcentaje en volumen'), idealizado: 'Densidad del etanol puro como parámetro didáctico.', metodo: 'volumen de etanol en litros por la densidad en g/L',
    sinVerificar: ['La densidad del etanol, 0,789 g/mL, es un valor de uso común no contrastado con una fuente en esta entrega.'],
    parametros: (rengRng) => ({ vt: rengEntreN1(rengRng, 100, 1500, 10), p: rengEntreN1(rengRng, 3, 60, 0.5) }),
    respuesta: (rengD) => ((rengD.vt * rengD.p) / 100) * RENG_DENSIDAD_ETANOL_SOL,
    errores: (rengD) => [
      ['sin-densidad', 'Volumen como masa', (rengD.vt * rengD.p) / 100, 'Tomaste los mililitros como gramos; para pasar a masa multiplica por la densidad del etanol.'],
      ['divide', 'Dividir entre la densidad', (rengD.vt * rengD.p) / 100 / RENG_DENSIDAD_ETANOL_SOL, 'Dividiste entre la densidad; la masa es densidad por volumen.']
    ],
    enunciado: (rengD) => `Una bebida de ${rengTx(rengD.vt)} mL tiene un ${rengTx(rengD.p)} % en volumen de etanol. Densidad del etanol: ${rengTx(RENG_DENSIDAD_ETANOL_SOL)} g/mL (parámetro didáctico).`,
    pregunta: () => '¿Cuántos gramos de etanol contiene?',
    datos: (rengD) => [['Volumen', `${rengTx(rengD.vt)} mL`], ['% v/v', `${rengTx(rengD.p)} %`], ['ρ(etanol)', `${rengTx(RENG_DENSIDAD_ETANOL_SOL)} g/mL`]],
    pasos: (rengD, rengR) => [`V(etanol) = ${rengTx((rengD.vt * rengD.p) / 100)} mL.`, `m = ρ · V = ${rengTx(rengR)} g.`],
    pistas: ['Calcula el volumen de etanol.', 'Pasa el volumen a masa con la densidad.', 'm = ρ · V, en gramos.']
  })
]

export const RENG_PRACTICAS_B09_S10: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s10-p1', subtema: 'n1-b9-s10', titulo: 'Porcentaje masa-volumen', dificultad: 'basica',
    objetivo: 'Calcular el porcentaje masa-volumen de una disolución.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('3.4', 'el porcentaje masa-volumen'), idealizado: 'Volumen final medido.', metodo: 'función del núcleo para el porcentaje masa-volumen',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), ms: rengEntreN1(rengRng, 0.5, 60, 0.1), v: rengEntreN1(rengRng, 50, 2000, 10) }),
    respuesta: (rengD) => (rengD.ms / rengD.v) * 100,
    errores: (rengD) => [
      ['sin-100', 'Sin multiplicar por 100', rengD.ms / rengD.v, 'Olvidaste multiplicar por 100: el % m/v son gramos por cada 100 mL.'],
      ['por-litro', 'Gramos por litro', (rengD.ms / rengD.v) * 1000, 'Calculaste gramos por litro; el % m/v son gramos por cada 100 mL.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.ms)} g de ${rengSol(rengD.s).nombre} y se enrasa hasta ${rengTx(rengD.v)} mL de disolución.`,
    pregunta: () => '¿Cuál es el porcentaje masa-volumen?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.ms)} g`], ['Volumen final', `${rengTx(rengD.v)} mL`]],
    pasos: (rengD, rengR) => ['% m/v = g de soluto / mL de disolución × 100.', `% m/v = ${rengTx(rengR)} %.`],
    pistas: ['Gramos de soluto y mililitros de disolución.', 'Divide la masa entre el volumen.', 'Multiplica por 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s10-p2', subtema: 'n1-b9-s10', titulo: 'Masa para preparar una disolución % m/v', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de soluto necesaria para preparar un volumen de disolución con un % m/v dado.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'el porcentaje masa-volumen'), idealizado: 'Enrase exacto al volumen final.', metodo: 'búsqueda por bisección de la masa con la función del núcleo para el porcentaje masa-volumen',
    parametros: (rengRng) => ({ v: rengEntreN1(rengRng, 50, 2000, 10), p: rengEntreN1(rengRng, 0.2, 20, 0.1) }),
    valida: (rengD) => Math.abs(rengD.v - 100) > 5,
    respuesta: (rengD) => (rengD.p * rengD.v) / 100,
    errores: (rengD) => [
      ['por-litro', 'Como gramos por litro', (rengD.p * rengD.v) / 1000, 'Interpretaste el porcentaje como gramos por litro; son gramos por cada 100 mL.'],
      ['sin-escalar', 'Sin escalar', rengD.p, 'Diste los gramos de 100 mL; escala al volumen que se quiere preparar.']
    ],
    enunciado: (rengD) => `Se quieren preparar ${rengTx(rengD.v)} mL de una disolución al ${rengTx(rengD.p)} % m/v.`,
    pregunta: () => '¿Qué masa de soluto hay que pesar, en g?',
    datos: (rengD) => [['Volumen', `${rengTx(rengD.v)} mL`], ['% m/v', `${rengTx(rengD.p)} %`]],
    pasos: (rengD, rengR) => [`${rengTx(rengD.p)} g por cada 100 mL.`, `Para ${rengTx(rengD.v)} mL: ${rengTx(rengR)} g.`],
    pistas: ['El % m/v son gramos por 100 mL.', 'Escala al volumen pedido.', 'Multiplica y divide entre 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s10-p3', subtema: 'n1-b9-s10', titulo: 'Del porcentaje masa-volumen a la molaridad', dificultad: 'avanzada',
    objetivo: 'Convertir un porcentaje masa-volumen en concentración molar.', unidad: 'mmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la conversión entre unidades de concentración', true), idealizado: 'Disolución homogénea.', metodo: 'moles en 100 mL con la función de molaridad del núcleo y conversión a mmol/L con el catálogo',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), p: rengEntreN1(rengRng, 0.5, 30, 0.1) }),
    respuesta: (rengD) => ((10 * rengD.p) / rengMs(rengD.s)) * 1000,
    errores: (rengD) => [
      ['sin-10', 'Sin pasar a un litro', (rengD.p / rengMs(rengD.s)) * 1000, 'Usaste los gramos de 100 mL como si fueran de un litro; multiplica por 10 antes.'],
      ['multiplica', 'Multiplicar por M', 10 * rengD.p * rengMs(rengD.s), 'Multiplicaste por la masa molar; para pasar de gramos a moles se divide.']
    ],
    enunciado: (rengD) => `Una disolución de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}) es ${rengTx(rengD.p)} % m/v.`,
    pregunta: () => '¿Cuál es su concentración molar, en mmol/L?',
    datos: (rengD) => [['% m/v', `${rengTx(rengD.p)} %`], rengDatoMasaSol(rengSol(rengD.s).formula)],
    pasos: (rengD, rengR) => [`${rengTx(rengD.p)} g por 100 mL = ${rengTx(10 * rengD.p)} g por litro.`, `c = ${rengTx(10 * rengD.p)} / ${rengTx(rengMs(rengD.s), 5)} mol/L = ${rengTx(rengR)} mmol/L.`],
    pistas: ['Pasa de 100 mL a 1 L.', 'Convierte los gramos a moles.', 'Expresa el resultado en mmol/L.']
  })
]

export const RENG_PRACTICAS_B09_S11: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s11-p1', subtema: 'n1-b9-s11', titulo: 'Molaridad a partir de masa y volumen', dificultad: 'basica',
    objetivo: 'Calcular la molaridad a partir de la masa de soluto y el volumen de disolución.', unidad: 'mol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la molaridad', true), idealizado: 'Enrase exacto al volumen final.', metodo: 'masa molar sumando masas atómicas y función de molaridad del núcleo con litros del catálogo',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), m: rengEntreN1(rengRng, 1, 100, 0.5), v: rengEntreN1(rengRng, 100, 2000, 50) }),
    valida: (rengD) => rengD.m / rengMs(rengD.s) / (rengD.v / 1000) >= 0.2,
    respuesta: (rengD) => rengD.m / rengMs(rengD.s) / (rengD.v / 1000),
    errores: (rengD) => [
      ['ml', 'Volumen en mL', rengD.m / rengMs(rengD.s) / rengD.v, 'Dividiste entre los mililitros; la molaridad usa el volumen en litros.'],
      ['gramos', 'Gramos por litro', rengD.m / (rengD.v / 1000), 'Dividiste los gramos entre el volumen; primero pasa la masa a moles.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.m)} g de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}) y se enrasa a ${rengTx(rengD.v)} mL.`,
    pregunta: () => '¿Cuál es la molaridad, en mol/L?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.m)} g`], ['Volumen', `${rengTx(rengD.v)} mL`], rengDatoMasaSol(rengSol(rengD.s).formula)],
    pasos: (rengD, rengR) => [`n = ${rengTx(rengD.m)} / ${rengTx(rengMs(rengD.s), 5)} = ${rengTx(rengD.m / rengMs(rengD.s), 4)} mol.`, `c = n / V = ${rengTx(rengR)} mol/L.`],
    pistas: ['Pasa los gramos a moles.', 'Pasa los mililitros a litros.', 'Divide moles entre litros.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s11-p2', subtema: 'n1-b9-s11', titulo: 'Moles en un volumen de disolución', dificultad: 'intermedia',
    objetivo: 'Calcular la cantidad de soluto contenida en un volumen de disolución de molaridad conocida.', unidad: 'mmol', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la molaridad'), idealizado: 'Volumen medido con exactitud.', metodo: 'moles en mol con litros del catálogo y conversión a mmol',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.05, 3, 0.01), v: rengEntreN1(rengRng, 5, 500, 0.5) }),
    respuesta: (rengD) => rengD.c * rengD.v,
    errores: (rengD) => [
      ['divide', 'Dividir', (rengD.c / rengD.v) * 1000, 'Dividiste en lugar de multiplicar: los moles son concentración por volumen.'],
      ['en-mol', 'En mol', (rengD.c * rengD.v) / 1000, 'Ese valor está en mol; la pregunta pide mmol, mil veces más.']
    ],
    enunciado: (rengD) => `Con una pipeta se toman ${rengTx(rengD.v)} mL de una disolución ${rengTx(rengD.c)} mol/L.`,
    pregunta: () => '¿Cuántos milimoles de soluto contiene esa porción?',
    datos: (rengD) => [['Concentración', `${rengTx(rengD.c)} mol/L`], ['Volumen', `${rengTx(rengD.v)} mL`]],
    pasos: (rengD, rengR) => [`n = c · V = ${rengTx(rengD.c)} mol/L × ${rengTx(rengD.v / 1000)} L.`, `n = ${rengTx(rengR)} mmol.`],
    pistas: ['Usa la relación n = c · V.', 'mol/L por mL da directamente mmol.', 'Comprueba las unidades del resultado.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s11-p3', subtema: 'n1-b9-s11', titulo: 'Molaridad de un reactivo de laboratorio', dificultad: 'avanzada',
    objetivo: 'Calcular la molaridad a partir del porcentaje en masa y la densidad de la disolución.', unidad: 'mol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la conversión entre porcentaje y molaridad', true), idealizado: 'Porcentaje y densidad didácticos, no de un reactivo comercial concreto.', metodo: 'relación del núcleo c = 10·%·ρ/M',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACTIVOS_LAB_SOL.length), p: rengEntreN1(rengRng, 5, 70, 0.5), rho: rengEntreN1(rengRng, 1.02, 1.85, 0.01) }),
    respuesta: (rengD) => (10 * rengD.p * rengD.rho) / rengMmSol(rengLab(rengD.r).formula),
    errores: (rengD) => [
      ['sin-densidad', 'Sin la densidad', (10 * rengD.p) / rengMmSol(rengLab(rengD.r).formula), 'Supusiste que 1 L pesa 1000 g; usa la densidad para la masa del litro.'],
      ['molalidad', 'Molalidad', rengD.p / rengMmSol(rengLab(rengD.r).formula) / ((100 - rengD.p) / 1000), 'Calculaste la molalidad; la molaridad usa el litro de disolución.']
    ],
    enunciado: (rengD) => `Una disolución de ${rengLab(rengD.r).nombre} (${rengTextoSol(rengLab(rengD.r).formula)}) tiene un ${rengTx(rengD.p)} % en masa y una densidad de ${rengTx(rengD.rho)} g/mL (datos didácticos).`,
    pregunta: () => '¿Cuál es su molaridad, en mol/L?',
    datos: (rengD) => [['% m/m', `${rengTx(rengD.p)} %`], ['Densidad', `${rengTx(rengD.rho)} g/mL`], rengDatoMasaSol(rengLab(rengD.r).formula)],
    pasos: (rengD, rengR) => [`1 L pesa ${rengTx(1000 * rengD.rho)} g y contiene ${rengTx(10 * rengD.p * rengD.rho)} g de soluto.`, `c = ${rengTx(rengR)} mol/L.`],
    pistas: ['Toma 1 L de disolución.', 'Usa la densidad para su masa.', 'Aplica el porcentaje y pasa a moles.']
  })
]

export const RENG_PRACTICAS_B09_S12: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s12-p1', subtema: 'n1-b9-s12', titulo: 'Molalidad a partir de las masas', dificultad: 'basica',
    objetivo: 'Calcular la molalidad a partir de la masa de soluto y la masa de disolvente.', unidad: 'mol/kg', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la molalidad', true), idealizado: 'Masas medidas con exactitud.', metodo: 'función del núcleo para la molalidad con la masa de agua convertida a kg por el catálogo',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), m: rengEntreN1(rengRng, 1, 100, 0.5), md: rengEntreN1(rengRng, 100, 2000, 50) }),
    valida: (rengD) => rengD.m / rengMs(rengD.s) / (rengD.md / 1000) >= 0.2,
    respuesta: (rengD) => rengD.m / rengMs(rengD.s) / (rengD.md / 1000),
    errores: (rengD) => [
      ['gramos', 'Gramos sin pasar a kg', rengD.m / rengMs(rengD.s) / rengD.md, 'Dividiste entre los gramos de agua; la molalidad usa kilogramos.'],
      ['disolucion', 'Con la masa de disolución', rengD.m / rengMs(rengD.s) / ((rengD.m + rengD.md) / 1000), 'Dividiste entre la masa de disolución; la molalidad usa solo la del disolvente.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.m)} g de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}) en ${rengTx(rengD.md)} g de agua.`,
    pregunta: () => '¿Cuál es la molalidad, en mol/kg?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.m)} g`], ['Agua', `${rengTx(rengD.md)} g`], rengDatoMasaSol(rengSol(rengD.s).formula)],
    pasos: (rengD, rengR) => [`n = ${rengTx(rengD.m / rengMs(rengD.s), 4)} mol.`, `b = n / ${rengTx(rengD.md / 1000)} kg = ${rengTx(rengR)} mol/kg.`],
    pistas: ['Pasa el soluto a moles.', 'Usa la masa de agua en kg.', 'Divide moles entre kilogramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s12-p2', subtema: 'n1-b9-s12', titulo: 'Soluto para una molalidad dada', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de soluto que hay que disolver en una masa de agua para obtener una molalidad.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la molalidad', true), idealizado: 'Masas medidas con exactitud.', metodo: 'búsqueda por bisección de la masa con la función de molalidad del núcleo',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), b: rengEntreN1(rengRng, 0.1, 3, 0.05), md: rengEntreN1(rengRng, 100, 2000, 50) }),
    respuesta: (rengD) => ((rengD.b * rengD.md) / 1000) * rengMs(rengD.s),
    errores: (rengD) => [
      ['gramos', 'Gramos sin pasar a kg', rengD.b * rengD.md * rengMs(rengD.s), 'Usaste los gramos de agua sin pasar a kilogramos.'],
      ['moles', 'Moles en lugar de gramos', (rengD.b * rengD.md) / 1000, 'Diste los moles de soluto; multiplícalos por la masa molar.']
    ],
    enunciado: (rengD) => `Se quiere una disolución ${rengTx(rengD.b)} mol/kg de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}) usando ${rengTx(rengD.md)} g de agua.`,
    pregunta: () => '¿Qué masa de soluto hay que disolver, en g?',
    datos: (rengD) => [['Molalidad', `${rengTx(rengD.b)} mol/kg`], ['Agua', `${rengTx(rengD.md)} g`], rengDatoMasaSol(rengSol(rengD.s).formula)],
    pasos: (rengD, rengR) => [`n = b · m(agua) = ${rengTx((rengD.b * rengD.md) / 1000, 4)} mol.`, `m = n · M = ${rengTx(rengR)} g.`],
    pistas: ['n = b · kg de agua.', 'Pasa los gramos de agua a kg.', 'Multiplica los moles por la masa molar.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s12-p3', subtema: 'n1-b9-s12', titulo: 'De molaridad a molalidad', dificultad: 'avanzada',
    objetivo: 'Convertir una molaridad en molalidad usando la densidad de la disolución.', unidad: 'mol/kg', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la conversión entre molaridad y molalidad', true), idealizado: 'Densidad didáctica.', metodo: 'función del núcleo que pasa de molaridad a molalidad con la densidad',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), c: rengEntreN1(rengRng, 0.2, 5, 0.05), rho: rengEntreN1(rengRng, 1, 1.4, 0.005) }),
    valida: (rengD) => rengD.rho - (rengD.c * rengMs(rengD.s)) / 1000 > 0.5,
    respuesta: (rengD) => rengD.c / (rengD.rho - (rengD.c * rengMs(rengD.s)) / 1000),
    errores: (rengD) => [
      ['igual', 'Igual que la molaridad', rengD.c, 'Supusiste que molaridad y molalidad coinciden; solo pasa en disoluciones diluidas.'],
      ['sin-restar', 'Sin restar el soluto', rengD.c / rengD.rho, 'Usaste la masa de la disolución sin restar la del soluto: la molalidad es por kg de disolvente.']
    ],
    enunciado: (rengD) => `Una disolución de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}) es ${rengTx(rengD.c)} mol/L y tiene una densidad de ${rengTx(rengD.rho, 4)} g/mL (dato didáctico).`,
    pregunta: () => '¿Cuál es su molalidad, en mol/kg?',
    datos: (rengD) => [['c', `${rengTx(rengD.c)} mol/L`], ['Densidad', `${rengTx(rengD.rho, 4)} g/mL`], rengDatoMasaSol(rengSol(rengD.s).formula)],
    pasos: (rengD, rengR) => [`En 1 L: ${rengTx(1000 * rengD.rho)} g de disolución, ${rengTx(rengD.c * rengMs(rengD.s))} g de soluto.`, `Agua: ${rengTx(1000 * rengD.rho - rengD.c * rengMs(rengD.s))} g; b = ${rengTx(rengR)} mol/kg.`],
    pistas: ['Toma 1 L de disolución.', 'Resta la masa del soluto a la de la disolución.', 'Divide los moles entre los kg de agua.']
  })
]

export const RENG_PRACTICAS_B09_S13: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s13-p1', subtema: 'n1-b9-s13', titulo: 'Porcentaje molar del soluto', dificultad: 'basica',
    objetivo: 'Calcular la fracción molar del soluto (expresada en %) a partir de las masas de soluto y agua.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('3.4', 'la fracción molar', true), idealizado: 'Mezcla de dos componentes.', metodo: 'función del núcleo para las fracciones molares',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), ms: rengEntreN1(rengRng, 5, 150, 0.5), md: rengEntreN1(rengRng, 20, 500, 5) }),
    valida: (rengD) => (rengD.ms / rengMs(rengD.s)) / (rengD.ms / rengMs(rengD.s) + rengD.md / M_AGUA) * 100 >= 0.5,
    respuesta: (rengD) => (rengD.ms / rengMs(rengD.s) / (rengD.ms / rengMs(rengD.s) + rengD.md / M_AGUA)) * 100,
    errores: (rengD) => [
      ['masas', 'Con masas', (rengD.ms / (rengD.ms + rengD.md)) * 100, 'Usaste masas en lugar de moles; la fracción molar cuenta moles.'],
      ['sobre-agua', 'Entre el agua', (rengD.ms / rengMs(rengD.s) / (rengD.md / M_AGUA)) * 100, 'Dividiste entre los moles de agua; el denominador son los moles totales.']
    ],
    enunciado: (rengD) => `Se mezclan ${rengTx(rengD.ms)} g de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}) con ${rengTx(rengD.md)} g de agua.`,
    pregunta: () => '¿Cuál es el porcentaje molar del soluto (fracción molar × 100)?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.ms)} g`], ['Agua', `${rengTx(rengD.md)} g`], rengDatoMasaSol(rengSol(rengD.s).formula), rengDatoMasaSol('H2O')],
    pasos: (rengD, rengR) => [`Moles: soluto ${rengTx(rengD.ms / rengMs(rengD.s), 4)}, agua ${rengTx(rengD.md / M_AGUA, 4)}.`, `x × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Pasa las dos masas a moles.', 'Suma los moles de los dos componentes.', 'Divide los del soluto entre el total.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s13-p2', subtema: 'n1-b9-s13', titulo: 'Agua para una fracción molar dada', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de agua necesaria para que el soluto alcance una fracción molar dada.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la fracción molar', true), idealizado: 'Mezcla de dos componentes.', metodo: 'búsqueda por bisección de la masa de agua con la función del núcleo para las fracciones molares',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), x: rengEntreN1(rengRng, 0.01, 0.3, 0.005), ms: rengEntreN1(rengRng, 5, 100, 0.5) }),
    respuesta: (rengD) => ((rengD.ms / rengMs(rengD.s)) * (1 - rengD.x)) / rengD.x * M_AGUA,
    errores: (rengD) => [
      ['masas', 'Fracción aplicada a masas', (rengD.ms * (1 - rengD.x)) / rengD.x, 'Aplicaste la fracción a las masas; hay que trabajar con moles.'],
      ['total', 'Moles totales como agua', (rengD.ms / rengMs(rengD.s) / rengD.x) * M_AGUA, 'Tomaste los moles totales como si fueran de agua; resta los del soluto.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.ms)} g de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}) y se quiere que su fracción molar sea ${rengTx(rengD.x)}.`,
    pregunta: () => '¿Qué masa de agua hay que usar, en g?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.ms)} g`], ['x(soluto)', rengTx(rengD.x)], rengDatoMasaSol(rengSol(rengD.s).formula), rengDatoMasaSol('H2O')],
    pasos: (rengD, rengR) => [`n(soluto) = ${rengTx(rengD.ms / rengMs(rengD.s), 4)} mol; n(agua) = n(soluto)·(1 − x)/x.`, `m(agua) = ${rengTx(rengR)} g.`],
    pistas: ['Pasa el soluto a moles.', 'Despeja los moles de agua de la fracción.', 'Pasa los moles de agua a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s13-p3', subtema: 'n1-b9-s13', titulo: 'De fracción molar a molalidad', dificultad: 'avanzada',
    objetivo: 'Convertir la fracción molar de un soluto en agua en molalidad.', unidad: 'mol/kg', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la conversión entre fracción molar y molalidad', true), idealizado: 'Disolución acuosa de un soluto.', metodo: 'función de molalidad del núcleo con un mol total de mezcla',
    parametros: (rengRng) => ({ x: rengEntreN1(rengRng, 0.05, 0.25, 0.001) }),
    respuesta: (rengD) => rengD.x / (((1 - rengD.x) * M_AGUA) / 1000),
    errores: (rengD) => [
      ['sin-restar', 'Todo como agua', rengD.x / (M_AGUA / 1000), 'Usaste todos los moles como si fueran de agua; los moles de agua son 1 − x.'],
      ['gramos', 'Gramos sin pasar a kg', rengD.x / ((1 - rengD.x) * M_AGUA), 'Dejaste la masa de agua en gramos; la molalidad es por kilogramo.']
    ],
    enunciado: (rengD) => `En una disolución acuosa, la fracción molar del soluto es ${rengTx(rengD.x, 3)}.`,
    pregunta: () => '¿Cuál es su molalidad, en mol/kg?',
    datos: (rengD) => [['x(soluto)', rengTx(rengD.x, 3)], rengDatoMasaSol('H2O')],
    pasos: (rengD, rengR) => [`Toma 1 mol de mezcla: ${rengTx(rengD.x, 3)} mol de soluto y ${rengTx(1 - rengD.x, 3)} mol de agua.`, `Agua: ${rengTx((1 - rengD.x) * M_AGUA, 4)} g; b = ${rengTx(rengR)} mol/kg.`],
    pistas: ['Toma 1 mol de mezcla en total.', 'Pasa los moles de agua a kilogramos.', 'Divide los moles de soluto entre esos kg.']
  })
]

export const RENG_PRACTICAS_B09_S14: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s14-p1', subtema: 'n1-b9-s14', titulo: 'Normalidad a partir de la molaridad', dificultad: 'basica',
    objetivo: 'Calcular la normalidad de un ácido o una base a partir de su molaridad y sus equivalentes por mol.', unidad: '', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la normalidad'), idealizado: 'Neutralización completa de todos los H⁺ u OH⁻.', metodo: 'función del núcleo para la normalidad',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_POLIPROTICOS_SOL.length), c: rengEntreN1(rengRng, 0.15, 3, 0.05) }),
    respuesta: (rengD) => rengD.c * RENG_POLIPROTICOS_SOL[rengD.a]!.eq,
    errores: (rengD) => [
      ['sin-eq', 'Sin los equivalentes', rengD.c, 'Diste la molaridad; multiplícala por los equivalentes por mol.'],
      ['divide', 'Dividir', rengD.c / RENG_POLIPROTICOS_SOL[rengD.a]!.eq, 'Dividiste entre los equivalentes; la normalidad es molaridad por equivalentes.']
    ],
    enunciado: (rengD) => `Una disolución de ${RENG_POLIPROTICOS_SOL[rengD.a]!.nombre} (${rengTextoSol(RENG_POLIPROTICOS_SOL[rengD.a]!.formula)}) es ${rengTx(rengD.c)} mol/L. En la reacción de neutralización completa, cada mol aporta ${RENG_POLIPROTICOS_SOL[rengD.a]!.eq} mol de ${RENG_POLIPROTICOS_SOL[rengD.a]!.unidad}.`,
    pregunta: () => '¿Cuál es su normalidad, en eq/L? (escribe solo el número)',
    datos: (rengD) => [['c', `${rengTx(rengD.c)} mol/L`], ['Equivalentes por mol', String(RENG_POLIPROTICOS_SOL[rengD.a]!.eq)]],
    pasos: (rengD, rengR) => ['N = c × equivalentes por mol.', `N = ${rengTx(rengD.c)} × ${RENG_POLIPROTICOS_SOL[rengD.a]!.eq} = ${rengTx(rengR)} eq/L.`],
    pistas: ['¿Cuántos H⁺ u OH⁻ aporta cada mol?', 'Multiplica la molaridad por ese número.', 'La normalidad se da en eq/L.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s14-p2', subtema: 'n1-b9-s14', titulo: 'Volumen de base para neutralizar', dificultad: 'intermedia',
    objetivo: 'Usar la igualdad de equivalentes para calcular el volumen de base que neutraliza un ácido.', unidad: 'mL', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'los equivalentes en una neutralización'), idealizado: 'Neutralización completa.', metodo: 'moles de H⁺ del ácido igualados a moles de OH⁻ de la base',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_ACIDOS_SOL.length), b: rengIndice(rengRng, RENG_BASES_SOL.length), va: rengEntreN1(rengRng, 5, 50, 0.5), ca: rengEntreN1(rengRng, 0.05, 1, 0.01), cb: rengEntreN1(rengRng, 0.05, 1, 0.01) }),
    valida: (rengD) => {
      if (RENG_ACIDOS_SOL[rengD.a]!.eq === RENG_BASES_SOL[rengD.b]!.eq) return false
      const rengV = (rengD.ca * RENG_ACIDOS_SOL[rengD.a]!.eq * rengD.va) / (rengD.cb * RENG_BASES_SOL[rengD.b]!.eq)
      return rengV >= 2 && rengV <= 200
    },
    respuesta: (rengD) => (rengD.ca * RENG_ACIDOS_SOL[rengD.a]!.eq * rengD.va) / (rengD.cb * RENG_BASES_SOL[rengD.b]!.eq),
    errores: (rengD) => [
      ['molaridades', 'Con molaridades', (rengD.ca * rengD.va) / rengD.cb, 'Igualaste molaridades por volumen; hay que igualar equivalentes (o usar la razón molar de la ecuación).'],
      ['invertida', 'Proporción invertida', (rengD.cb * RENG_BASES_SOL[rengD.b]!.eq * rengD.va) / (rengD.ca * RENG_ACIDOS_SOL[rengD.a]!.eq), 'Invertiste la proporción entre las normalidades.']
    ],
    enunciado: (rengD) => `Se neutralizan por completo ${rengTx(rengD.va)} mL de ${RENG_ACIDOS_SOL[rengD.a]!.nombre} (${rengTextoSol(RENG_ACIDOS_SOL[rengD.a]!.formula)}) ${rengTx(rengD.ca)} mol/L con ${RENG_BASES_SOL[rengD.b]!.nombre} (${rengTextoSol(RENG_BASES_SOL[rengD.b]!.formula)}) ${rengTx(rengD.cb)} mol/L.`,
    pregunta: () => '¿Qué volumen de base se necesita, en mL?',
    datos: (rengD) => [['Ácido', `${rengTx(rengD.va)} mL, ${rengTx(rengD.ca)} mol/L, ${RENG_ACIDOS_SOL[rengD.a]!.eq} eq/mol`], ['Base', `${rengTx(rengD.cb)} mol/L, ${RENG_BASES_SOL[rengD.b]!.eq} eq/mol`]],
    pasos: (rengD, rengR) => [`N(ácido) = ${rengTx(rengD.ca * RENG_ACIDOS_SOL[rengD.a]!.eq)} eq/L; N(base) = ${rengTx(rengD.cb * RENG_BASES_SOL[rengD.b]!.eq)} eq/L.`, `N₁·V₁ = N₂·V₂ → V = ${rengTx(rengR)} mL.`],
    pistas: ['Pasa las dos molaridades a normalidades.', 'Iguala los equivalentes de ácido y base.', 'Despeja el volumen de base.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s14-p3', subtema: 'n1-b9-s14', titulo: 'Masa para una normalidad dada', dificultad: 'avanzada',
    objetivo: 'Calcular la masa de un ácido o una base para preparar un volumen de normalidad dada.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la normalidad', true), idealizado: 'Reactivo puro; neutralización completa.', metodo: 'búsqueda por bisección de la masa con las funciones de molaridad y normalidad del núcleo',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_POLIPROTICOS_SOL.length), N: rengEntreN1(rengRng, 0.05, 2, 0.05), v: rengEntreN1(rengRng, 100, 2000, 50) }),
    respuesta: (rengD) => (rengD.N / RENG_POLIPROTICOS_SOL[rengD.a]!.eq) * (rengD.v / 1000) * rengMmSol(RENG_POLIPROTICOS_SOL[rengD.a]!.formula),
    errores: (rengD) => [
      ['como-molaridad', 'Normalidad como molaridad', rengD.N * (rengD.v / 1000) * rengMmSol(RENG_POLIPROTICOS_SOL[rengD.a]!.formula), 'Usaste la normalidad como molaridad; divide entre los equivalentes por mol.'],
      ['multiplica', 'Multiplicar por los equivalentes', rengD.N * RENG_POLIPROTICOS_SOL[rengD.a]!.eq * (rengD.v / 1000) * rengMmSol(RENG_POLIPROTICOS_SOL[rengD.a]!.formula), 'Multiplicaste por los equivalentes; para pasar de normalidad a molaridad hay que dividir.']
    ],
    enunciado: (rengD) => `Se quieren preparar ${rengTx(rengD.v)} mL de ${RENG_POLIPROTICOS_SOL[rengD.a]!.nombre} (${rengTextoSol(RENG_POLIPROTICOS_SOL[rengD.a]!.formula)}) ${rengTx(rengD.N)} eq/L para una neutralización completa (${RENG_POLIPROTICOS_SOL[rengD.a]!.eq} eq/mol).`,
    pregunta: () => '¿Qué masa de soluto puro hace falta, en g?',
    datos: (rengD) => [['Normalidad', `${rengTx(rengD.N)} eq/L`], ['Volumen', `${rengTx(rengD.v)} mL`], ['Equivalentes por mol', String(RENG_POLIPROTICOS_SOL[rengD.a]!.eq)], rengDatoMasaSol(RENG_POLIPROTICOS_SOL[rengD.a]!.formula)],
    pasos: (rengD, rengR) => [`Molaridad: ${rengTx(rengD.N)} / ${RENG_POLIPROTICOS_SOL[rengD.a]!.eq} = ${rengTx(rengD.N / RENG_POLIPROTICOS_SOL[rengD.a]!.eq, 4)} mol/L.`, `Masa: c · V · M = ${rengTx(rengR)} g.`],
    pistas: ['Pasa la normalidad a molaridad.', 'Calcula los moles en ese volumen.', 'Multiplica por la masa molar.']
  })
]
