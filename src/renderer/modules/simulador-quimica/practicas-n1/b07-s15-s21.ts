import { RENG_R_LKPA, rengK, rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_COMBUSTIONES, RENG_OXIDOS_METAL, RENG_REACCIONES_EST, RENG_REACCIONES_GAS, RENG_TOL_EST, RENG_TOL_PCT, rengAtomosDe, rengDatoMasa, rengFuentesEst, rengMmEst, rengTexto, type RengReaccionEst } from './b07-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

type RengPar = readonly [reaccion: RengReaccionEst, a: number, b: number]
const RENG_RP: readonly RengPar[] = RENG_REACCIONES_EST.flatMap((rengR) => rengR.reactivos.flatMap((_rengX, rengI) => rengR.productos.map((_rengY, rengJ) => [rengR, rengI, rengJ] as const)))
const rengRe = (rengP: RengPar) => rengP[0].reactivos[rengP[1]]!
const rengPr = (rengP: RengPar) => rengP[0].productos[rengP[2]]!
const rengTeoricoRP = (rengP: RengPar, rengM: number): number => (rengM / rengMmEst(rengRe(rengP).formula)) * (rengPr(rengP).coef / rengRe(rengP).coef) * rengMmEst(rengPr(rengP).formula)

export const RENG_GAS_HCL = RENG_REACCIONES_GAS.filter((rengG) => rengG.reaccion.reactivos.some((rengE) => rengE.formula === 'HCl'))
const rengCoef = (rengR: RengReaccionEst, rengF: string): number => [...rengR.reactivos, ...rengR.productos].find((rengE) => rengE.formula === rengF)!.coef
const rengMolesGas = (rengG: (typeof RENG_REACCIONES_GAS)[number], rengMasaSolido: number): number => (rengMasaSolido / rengMmEst(rengG.solido)) * (rengCoef(rengG.reaccion, rengG.gas) / rengCoef(rengG.reaccion, rengG.solido))
const rengMetalEn = (rengO: (typeof RENG_OXIDOS_METAL)[number]): number => rengAtomosDe(rengO.oxido).get(rengO.metal)!
const RENG_M_CACO3 = rengMmEst('CaCO3')
const RENG_M_MGCO3 = rengMmEst('MgCO3')
const RENG_M_NAHCO3 = rengMmEst('NaHCO3')
const RENG_M_CO2 = rengMmEst('CO2')
const RENG_M_H2O = rengMmEst('H2O')
const RENG_M_CAOH2 = rengMmEst('Ca(OH)2')

export const RENG_PRACTICAS_B07_S15: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s15-p1', subtema: 'n1-b7-s15', titulo: 'Metal máximo de un óxido', dificultad: 'basica',
    objetivo: 'Calcular el rendimiento teórico de metal a partir de la masa de su óxido.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el rendimiento teórico', 'masas'), idealizado: 'Todo el metal del óxido pasa a metal.', metodo: 'moles de óxido, átomos de metal por fórmula y masa de metal',
    parametros: (rengRng) => ({ o: rengIndice(rengRng, RENG_OXIDOS_METAL.length), m: rengEntreN1(rengRng, 5, 500, 5) }),
    respuesta: (rengD) => {
      const rengO = RENG_OXIDOS_METAL[rengD.o]!
      return (rengD.m * rengMetalEn(rengO) * rengMmEst(rengO.metal)) / rengMmEst(rengO.oxido)
    },
    errores: (rengD) => {
      const rengO = RENG_OXIDOS_METAL[rengD.o]!
      return [
        ['sin-subindice', 'Un solo átomo de metal', (rengD.m * rengMmEst(rengO.metal)) / rengMmEst(rengO.oxido), `Contaste un átomo de metal por fórmula; en ${rengTexto(rengO.oxido)} hay ${rengMetalEn(rengO)}.`],
        ['masa-oxido', 'Toda la masa como metal', rengD.m, 'Diste la masa del óxido completa. Parte de esa masa es oxígeno, que no forma parte del metal.']
      ]
    },
    enunciado: (rengD) => `Se reducen por completo ${rengTx(rengD.m)} g de ${rengTexto(RENG_OXIDOS_METAL[rengD.o]!.oxido)} para obtener ${RENG_OXIDOS_METAL[rengD.o]!.metal} metálico.`,
    pregunta: () => '¿Cuál es el rendimiento teórico de metal, en g?',
    datos: (rengD) => [['Masa de óxido', `${rengTx(rengD.m)} g`], rengDatoMasa(RENG_OXIDOS_METAL[rengD.o]!.oxido), rengDatoMasa(RENG_OXIDOS_METAL[rengD.o]!.metal)],
    pasos: (rengD, rengR) => [`Fracción en masa de metal: ${rengMetalEn(RENG_OXIDOS_METAL[rengD.o]!)} × M(metal) / M(óxido).`, `Metal = ${rengTx(rengD.m)} × fracción = ${rengTx(rengR)} g.`],
    pistas: ['¿Cuántos átomos de metal tiene cada fórmula del óxido?', 'Todo el metal del óxido acaba como metal.', 'Usa la fracción en masa del metal.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s15-p2', subtema: 'n1-b7-s15', titulo: 'Gas máximo con ácido limitado', dificultad: 'intermedia',
    objetivo: 'Calcular el rendimiento teórico de gas cuando el limitante puede ser el sólido o el ácido.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el rendimiento teórico y el limitante', 'masas'), idealizado: 'Reacción completa hasta agotar el limitante.', metodo: 'función del núcleo para el reactivo limitante y masa del gas',
    parametros: (rengRng) => ({ g: rengIndice(rengRng, RENG_GAS_HCL.length), m: rengEntreN1(rengRng, 0.5, 20, 0.5), h: rengEntreN1(rengRng, 0.01, 0.6, 0.01) }),
    valida: (rengD) => {
      const rengG = RENG_GAS_HCL[rengD.g]!
      return Math.abs(rengD.m / rengMmEst(rengG.solido) / rengCoef(rengG.reaccion, rengG.solido) / (rengD.h / rengCoef(rengG.reaccion, 'HCl')) - 1) > 0.2
    },
    respuesta: (rengD) => {
      const rengG = RENG_GAS_HCL[rengD.g]!
      return Math.min(rengD.m / rengMmEst(rengG.solido) / rengCoef(rengG.reaccion, rengG.solido), rengD.h / rengCoef(rengG.reaccion, 'HCl')) * rengCoef(rengG.reaccion, rengG.gas) * rengMmEst(rengG.gas)
    },
    errores: (rengD) => {
      const rengG = RENG_GAS_HCL[rengD.g]!
      const rengXs = rengD.m / rengMmEst(rengG.solido) / rengCoef(rengG.reaccion, rengG.solido)
      const rengXh = rengD.h / rengCoef(rengG.reaccion, 'HCl')
      return [
        ['exceso', 'Calcular con el reactivo en exceso', Math.max(rengXs, rengXh) * rengCoef(rengG.reaccion, rengG.gas) * rengMmEst(rengG.gas), 'Usaste el reactivo que sobra; el rendimiento teórico lo fija el limitante.'],
        ['hcl-sin-coef', 'HCl sin su coeficiente 2', Math.min(rengXs, rengD.h) * rengCoef(rengG.reaccion, rengG.gas) * rengMmEst(rengG.gas), 'Olvidaste que la ecuación pide 2 mol de HCl: hay que dividir sus moles entre 2 al buscar el limitante.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_GAS_HCL[rengD.g]!.reaccion.texto}, se añaden ${rengTx(rengD.m)} g de ${rengTexto(RENG_GAS_HCL[rengD.g]!.solido)} a una disolución que contiene ${rengTx(rengD.h)} mol de HCl.`,
    pregunta: (rengD) => `¿Cuál es el rendimiento teórico de ${rengTexto(RENG_GAS_HCL[rengD.g]!.gas)}, en g?`,
    datos: (rengD) => [['Ecuación', RENG_GAS_HCL[rengD.g]!.reaccion.texto], rengDatoMasa(RENG_GAS_HCL[rengD.g]!.solido), ['HCl', `${rengTx(rengD.h)} mol`], rengDatoMasa(RENG_GAS_HCL[rengD.g]!.gas)],
    pasos: (_rengD, rengR) => ['Cocientes: moles de sólido / su coeficiente y moles de HCl / 2.', `Con el menor (limitante): ${rengTx(rengR)} g de gas.`],
    pistas: ['Pasa el sólido a moles.', 'Divide cada cantidad entre su coeficiente.', 'El limitante fija el gas máximo.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s15-p3', subtema: 'n1-b7-s15', titulo: 'Metal máximo de toneladas de mineral', dificultad: 'avanzada',
    objetivo: 'Calcular un rendimiento teórico en kilogramos a partir de toneladas de óxido.', unidad: 'kg', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el rendimiento teórico a escala industrial', 'masas'), idealizado: 'Óxido puro y reducción completa.', metodo: 'moles de óxido en gramos y vuelta a kilogramos de metal',
    parametros: (rengRng) => ({ o: rengIndice(rengRng, RENG_OXIDOS_METAL.length), t: rengEntreN1(rengRng, 0.5, 50, 0.5) }),
    respuesta: (rengD) => {
      const rengO = RENG_OXIDOS_METAL[rengD.o]!
      return (rengD.t * 1000 * rengMetalEn(rengO) * rengMmEst(rengO.metal)) / rengMmEst(rengO.oxido)
    },
    errores: (rengD) => {
      const rengO = RENG_OXIDOS_METAL[rengD.o]!
      return [
        ['toneladas', 'Resultado en toneladas', (rengD.t * rengMetalEn(rengO) * rengMmEst(rengO.metal)) / rengMmEst(rengO.oxido), 'Diste el resultado en toneladas. 1 t = 1000 kg.'],
        ['sin-subindice', 'Un solo átomo de metal', (rengD.t * 1000 * rengMmEst(rengO.metal)) / rengMmEst(rengO.oxido), `Contaste un átomo de metal por fórmula; en ${rengTexto(rengO.oxido)} hay ${rengMetalEn(rengO)}.`]
      ]
    },
    enunciado: (rengD) => `Una planta reduce ${rengTx(rengD.t)} t de ${rengTexto(RENG_OXIDOS_METAL[rengD.o]!.oxido)} puro.`,
    pregunta: () => '¿Cuál es el rendimiento teórico de metal, en kg?',
    datos: (rengD) => [['Óxido', `${rengTx(rengD.t)} t`], rengDatoMasa(RENG_OXIDOS_METAL[rengD.o]!.oxido), rengDatoMasa(RENG_OXIDOS_METAL[rengD.o]!.metal)],
    pasos: (rengD, rengR) => [`${rengTx(rengD.t)} t = ${rengTx(rengD.t * 1000)} kg; la fracción de metal es la misma en g o en kg.`, `Metal = ${rengTx(rengR)} kg.`],
    pistas: ['Pasa las toneladas a kilogramos.', 'Calcula la fracción en masa del metal.', 'Multiplica.']
  })
]

export const RENG_PRACTICAS_B07_S16: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s16-p1', subtema: 'n1-b7-s16', titulo: 'Del teórico al real', dificultad: 'basica',
    objetivo: 'Calcular el rendimiento real a partir del teórico y del rendimiento porcentual.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el rendimiento real'), idealizado: 'Rendimiento porcentual conocido.', metodo: 'pérdidas (teórico × (1 − R/100)) restadas del teórico',
    parametros: (rengRng) => ({ t: rengEntreN1(rengRng, 2, 500, 0.5), r: rengEntreN1(rengRng, 40, 98, 1) }),
    respuesta: (rengD) => (rengD.t * rengD.r) / 100,
    errores: (rengD) => [
      ['divide', 'Dividir entre el rendimiento', rengD.t / (rengD.r / 100), 'Dividiste entre el rendimiento; saldría más que el teórico, lo que es imposible. Hay que multiplicar.'],
      ['perdidas', 'Dar las pérdidas', (rengD.t * (100 - rengD.r)) / 100, 'Calculaste la masa que se pierde, no la que se obtiene.']
    ],
    enunciado: (rengD) => `El rendimiento teórico de una síntesis es ${rengTx(rengD.t)} g y su rendimiento porcentual, ${rengTx(rengD.r)} % (datos didácticos).`,
    pregunta: () => '¿Qué masa de producto se obtiene realmente, en g?',
    datos: (rengD) => [['Rendimiento teórico', `${rengTx(rengD.t)} g`], ['Rendimiento porcentual', `${rengTx(rengD.r)} %`]],
    pasos: (rengD, rengR) => [`Real = teórico × R/100 = ${rengTx(rengD.t)} × ${rengTx(rengD.r / 100, 3)}.`, `Real = ${rengTx(rengR)} g.`],
    pistas: ['El real es una fracción del teórico.', 'Pasa el porcentaje a fracción.', 'Multiplica el teórico por esa fracción.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s16-p2', subtema: 'n1-b7-s16', titulo: 'Producto real desde la masa de reactivo', dificultad: 'intermedia',
    objetivo: 'Encadenar estequiometría y rendimiento para obtener la masa real de producto.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el rendimiento real', 'masas'), idealizado: 'Rendimiento porcentual conocido y otros reactivos en exceso.', metodo: 'rendimiento aplicado a los moles de reactivo antes de la estequiometría',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RP.length), m: rengEntreN1(rengRng, 2, 100, 0.5), r: rengEntreN1(rengRng, 40, 98, 1) }),
    respuesta: (rengD) => (rengTeoricoRP(RENG_RP[rengD.p]!, rengD.m) * rengD.r) / 100,
    errores: (rengD) => [
      ['teorico', 'Dar el teórico', rengTeoricoRP(RENG_RP[rengD.p]!, rengD.m), 'Diste el rendimiento teórico. Aplica el rendimiento porcentual para obtener el real.'],
      ['divide', 'Dividir entre el rendimiento', rengTeoricoRP(RENG_RP[rengD.p]!, rengD.m) / (rengD.r / 100), 'Dividiste entre el rendimiento: el real no puede superar al teórico.']
    ],
    enunciado: (rengD) => `Según ${RENG_RP[rengD.p]![0].texto}, reaccionan ${rengTx(rengD.m)} g de ${rengRe(RENG_RP[rengD.p]!).texto} con un rendimiento del ${rengTx(rengD.r)} %.`,
    pregunta: (rengD) => `¿Qué masa de ${rengPr(RENG_RP[rengD.p]!).texto} se obtiene realmente, en g?`,
    datos: (rengD) => [['Ecuación', RENG_RP[rengD.p]![0].texto], rengDatoMasa(rengRe(RENG_RP[rengD.p]!).formula), rengDatoMasa(rengPr(RENG_RP[rengD.p]!).formula), ['Rendimiento', `${rengTx(rengD.r)} %`]],
    pasos: (rengD, rengR) => [`Teórico: ${rengTx(rengTeoricoRP(RENG_RP[rengD.p]!, rengD.m), 4)} g.`, `Real = teórico × ${rengTx(rengD.r / 100, 3)} = ${rengTx(rengR)} g.`],
    pistas: ['Calcula primero el rendimiento teórico.', 'Masa → moles → razón → moles → masa.', 'Multiplica por R/100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s16-p3', subtema: 'n1-b7-s16', titulo: 'Reactivo necesario contando las pérdidas', dificultad: 'avanzada',
    objetivo: 'Calcular la masa de reactivo necesaria para obtener una masa real de producto con un rendimiento dado.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el rendimiento real', 'masas'), idealizado: 'Rendimiento porcentual conocido.', metodo: 'teórico necesario y camino estequiométrico inverso con el rendimiento aplicado al final',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RP.length), m: rengEntreN1(rengRng, 2, 100, 0.5), r: rengEntreN1(rengRng, 40, 95, 1) }),
    respuesta: (rengD) => {
      const rengP = RENG_RP[rengD.p]!
      return ((rengD.m / (rengD.r / 100)) / rengMmEst(rengPr(rengP).formula)) * (rengRe(rengP).coef / rengPr(rengP).coef) * rengMmEst(rengRe(rengP).formula)
    },
    errores: (rengD) => {
      const rengP = RENG_RP[rengD.p]!
      const rengSin = (rengD.m / rengMmEst(rengPr(rengP).formula)) * (rengRe(rengP).coef / rengPr(rengP).coef) * rengMmEst(rengRe(rengP).formula)
      return [
        ['sin-rendimiento', 'Sin tener en cuenta el rendimiento', rengSin, 'Calculaste el reactivo para un rendimiento del 100 %. Con pérdidas hace falta más reactivo: divide entre R/100.'],
        ['multiplica', 'Multiplicar por el rendimiento', rengSin * (rengD.r / 100), 'Multiplicaste por el rendimiento; así saldría menos reactivo del necesario. Hay que dividir.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_RP[rengD.p]![0].texto}, se quieren obtener ${rengTx(rengD.m)} g de ${rengPr(RENG_RP[rengD.p]!).texto} con un rendimiento del ${rengTx(rengD.r)} %.`,
    pregunta: (rengD) => `¿Qué masa de ${rengRe(RENG_RP[rengD.p]!).texto} hay que usar, en g?`,
    datos: (rengD) => [['Ecuación', RENG_RP[rengD.p]![0].texto], rengDatoMasa(rengPr(RENG_RP[rengD.p]!).formula), rengDatoMasa(rengRe(RENG_RP[rengD.p]!).formula), ['Rendimiento', `${rengTx(rengD.r)} %`]],
    pasos: (rengD, rengR) => [`Teórico necesario: ${rengTx(rengD.m)} / ${rengTx(rengD.r / 100, 3)} = ${rengTx(rengD.m / (rengD.r / 100), 4)} g de producto.`, `Reactivo: ${rengTx(rengR)} g.`],
    pistas: ['¿Qué rendimiento teórico hace falta?', 'Divide la masa deseada entre R/100.', 'Después estequiometría hacia el reactivo.']
  })
]

export const RENG_PRACTICAS_B07_S17: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s17-p1', subtema: 'n1-b7-s17', titulo: 'Calcular un rendimiento porcentual', dificultad: 'basica',
    objetivo: 'Calcular el rendimiento porcentual a partir del real y del teórico.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('4.4', 'el rendimiento porcentual'), idealizado: 'Producto seco y puro.', metodo: 'cien menos el porcentaje perdido',
    parametros: (rengRng) => ({ t: rengEntreN1(rengRng, 5, 300, 0.5), f: rengEntreN1(rengRng, 0.4, 0.97, 0.01) }),
    respuesta: (rengD) => ((Math.round(rengD.t * rengD.f * 10) / 10) / rengD.t) * 100,
    errores: (rengD) => [
      ['invertida', 'Teórico entre real', (rengD.t / (Math.round(rengD.t * rengD.f * 10) / 10)) * 100, 'Dividiste el teórico entre el real. El real va en el numerador.'],
      ['perdido', 'Porcentaje perdido', 100 - ((Math.round(rengD.t * rengD.f * 10) / 10) / rengD.t) * 100, 'Calculaste el porcentaje que se pierde, no el que se obtiene.']
    ],
    enunciado: (rengD) => `En una síntesis, el rendimiento teórico es ${rengTx(rengD.t)} g y se recogen ${rengTx(Math.round(rengD.t * rengD.f * 10) / 10, 4)} g de producto seco y puro.`,
    pregunta: () => '¿Cuál es el rendimiento porcentual?',
    datos: (rengD) => [['Teórico', `${rengTx(rengD.t)} g`], ['Real', `${rengTx(Math.round(rengD.t * rengD.f * 10) / 10, 4)} g`]],
    pasos: (_rengD, rengR) => ['R = real / teórico × 100.', `R = ${rengTx(rengR)} %.`],
    pistas: ['¿Cuál es el real y cuál el teórico?', 'El real va arriba.', 'Multiplica por 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s17-p2', subtema: 'n1-b7-s17', titulo: 'Rendimiento desde el reactivo y el producto recogido', dificultad: 'intermedia',
    objetivo: 'Calcular el rendimiento porcentual calculando antes el teórico desde la masa de reactivo.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('4.4', 'el rendimiento porcentual', 'masas'), idealizado: 'Otros reactivos en exceso; producto seco.', metodo: 'cociente de moles de producto recogidos y teóricos',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RP.length), m: rengEntreN1(rengRng, 2, 100, 0.5), f: rengEntreN1(rengRng, 0.45, 0.97, 0.01) }),
    respuesta: (rengD) => {
      const rengT = rengTeoricoRP(RENG_RP[rengD.p]!, rengD.m)
      return (Number((rengT * rengD.f).toPrecision(4)) / rengT) * 100
    },
    errores: (rengD) => {
      const rengT = rengTeoricoRP(RENG_RP[rengD.p]!, rengD.m)
      const rengReal = Number((rengT * rengD.f).toPrecision(4))
      return [
        ['masa-reactivo', 'Comparar con la masa de reactivo', (rengReal / rengD.m) * 100, 'Dividiste entre la masa de reactivo. El teórico es la masa máxima de producto, que hay que calcular con la estequiometría.'],
        ['invertida', 'Teórico entre real', (rengT / rengReal) * 100, 'Dividiste el teórico entre el real; el real va arriba.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_RP[rengD.p]![0].texto}, reaccionan ${rengTx(rengD.m)} g de ${rengRe(RENG_RP[rengD.p]!).texto} y se recogen ${rengTx(Number((rengTeoricoRP(RENG_RP[rengD.p]!, rengD.m) * rengD.f).toPrecision(4)), 4)} g de ${rengPr(RENG_RP[rengD.p]!).texto}.`,
    pregunta: () => '¿Cuál es el rendimiento porcentual?',
    datos: (rengD) => [['Ecuación', RENG_RP[rengD.p]![0].texto], rengDatoMasa(rengRe(RENG_RP[rengD.p]!).formula), rengDatoMasa(rengPr(RENG_RP[rengD.p]!).formula)],
    pasos: (rengD, rengR) => [`Teórico = ${rengTx(rengTeoricoRP(RENG_RP[rengD.p]!, rengD.m), 4)} g.`, `R = real / teórico × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Calcula el rendimiento teórico.', 'Compara con lo recogido.', 'R = real / teórico × 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s17-p3', subtema: 'n1-b7-s17', titulo: 'Rendimiento medido por el gas recogido', dificultad: 'avanzada',
    objetivo: 'Calcular el rendimiento comparando los moles de gas recogido (por su volumen) con los teóricos.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('4.4', 'el rendimiento medido con gases', 'masas', 'r'), idealizado: 'Gas ideal y seco.', metodo: 'volumen teórico de gas en las mismas condiciones comparado con el recogido',
    parametros: (rengRng) => ({ g: rengIndice(rengRng, RENG_REACCIONES_GAS.length), m: rengEntreN1(rengRng, 0.5, 10, 0.1), t: rengEntreN1(rengRng, 15, 35, 1), f: rengEntreN1(rengRng, 0.5, 0.97, 0.01) }),
    respuesta: (rengD) => {
      const rengN = rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, rengD.m)
      const rengV = Number(((rengN * rengD.f * RENG_R_LKPA * rengK(rengD.t)) / 101.3).toPrecision(3))
      return ((101.3 * rengV) / (RENG_R_LKPA * rengK(rengD.t)) / rengN) * 100
    },
    errores: (rengD) => {
      const rengN = rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, rengD.m)
      const rengV = Number(((rengN * rengD.f * RENG_R_LKPA * rengK(rengD.t)) / 101.3).toPrecision(3))
      return [
        ['celsius', 'Temperatura en °C', ((101.3 * rengV) / (RENG_R_LKPA * rengD.t) / rengN) * 100, 'Usaste la temperatura en °C en P·V = n·R·T. Pásala a kelvin.'],
        ['volumen-224', 'Usar 22,4 L/mol', (rengV / 22.414 / rengN) * 100, 'Usaste 22,4 L/mol, que solo vale a 0 °C y 1 atm; calcula los moles con P·V = n·R·T.']
      ]
    },
    enunciado: (rengD) => {
      const rengN = rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, rengD.m)
      return `Según ${RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto}, reaccionan por completo ${rengTx(rengD.m)} g de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.solido)} y se recogen ${rengTx(Number(((rengN * rengD.f * RENG_R_LKPA * rengK(rengD.t)) / 101.3).toPrecision(3)))} L de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.gas)} seco a ${rengTx(rengD.t)} °C y 101,3 kPa.`
    },
    pregunta: () => '¿Qué rendimiento porcentual de gas se ha obtenido?',
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto], rengDatoMasa(RENG_REACCIONES_GAS[rengD.g]!.solido), ['Condiciones', `${rengTx(rengD.t)} °C y 101,3 kPa`]],
    pasos: (rengD, rengR) => [`Moles teóricos de gas: ${rengTx(rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, rengD.m), 4)} mol.`, 'Moles recogidos: n = P·V/(R·T).', `R = ${rengTx(rengR)} %.`],
    pistas: ['Calcula los moles teóricos de gas.', 'Pasa el volumen recogido a moles con P·V = n·R·T.', 'Divide recogidos entre teóricos.']
  })
]

export const RENG_PRACTICAS_B07_S18: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s18-p1', subtema: 'n1-b7-s18', titulo: 'Masa pura de una muestra', dificultad: 'basica',
    objetivo: 'Calcular la masa de sustancia pura de una muestra conociendo su pureza.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.5', 'la pureza de una muestra'), idealizado: 'Muestra homogénea.', metodo: 'masa de muestra menos masa de impurezas',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 5, 500, 5), p: rengEntreN1(rengRng, 55, 99, 1), s: rengIndice(rengRng, 4) }),
    respuesta: (rengD) => (rengD.m * rengD.p) / 100,
    errores: (rengD) => [
      ['impurezas', 'Masa de impurezas', (rengD.m * (100 - rengD.p)) / 100, 'Calculaste la masa de impurezas, no la de sustancia pura.'],
      ['divide', 'Dividir entre la pureza', rengD.m / (rengD.p / 100), 'Dividiste entre la pureza: la masa pura no puede superar la de la muestra.']
    ],
    enunciado: (rengD) => `Una muestra de ${rengTx(rengD.m)} g de ${['caliza (CaCO₃)', 'cinc técnico (Zn)', 'bicarbonato técnico (NaHCO₃)', 'mineral de hierro (Fe₂O₃)'][rengD.s]} tiene una pureza del ${rengTx(rengD.p)} %.`,
    pregunta: () => '¿Qué masa de sustancia pura contiene, en g?',
    datos: (rengD) => [['Masa de muestra', `${rengTx(rengD.m)} g`], ['Pureza', `${rengTx(rengD.p)} %`]],
    pasos: (rengD, rengR) => [`m_pura = ${rengTx(rengD.m)} × ${rengTx(rengD.p / 100, 3)}.`, `m_pura = ${rengTx(rengR)} g.`],
    pistas: ['La pureza es un porcentaje en masa.', 'Pásala a fracción.', 'Multiplica por la masa de la muestra.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s18-p2', subtema: 'n1-b7-s18', titulo: 'Gas desprendido por una muestra impura', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de gas que desprende una muestra impura, usando solo su parte pura.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.5', 'la pureza en los cálculos estequiométricos', 'masas'), idealizado: 'Impurezas inertes y reacción completa.', metodo: 'conservación de la masa con el resto de productos sólidos o disueltos',
    parametros: (rengRng) => ({ g: rengIndice(rengRng, RENG_REACCIONES_GAS.length), m: rengEntreN1(rengRng, 2, 100, 1), p: rengEntreN1(rengRng, 55, 98, 1) }),
    respuesta: (rengD) => rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, (rengD.m * rengD.p) / 100) * rengMmEst(RENG_REACCIONES_GAS[rengD.g]!.gas),
    errores: (rengD) => [
      ['sin-pureza', 'Sin aplicar la pureza', rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, rengD.m) * rengMmEst(RENG_REACCIONES_GAS[rengD.g]!.gas), 'Usaste la masa de muestra completa; solo reacciona la parte pura.'],
      ['pureza-al-gas', 'Pureza aplicada dos veces', rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, (rengD.m * rengD.p) / 100) * rengMmEst(RENG_REACCIONES_GAS[rengD.g]!.gas) * (rengD.p / 100), 'Aplicaste la pureza dos veces. Se aplica una sola vez, a la masa de muestra.']
    ],
    enunciado: (rengD) => `Una muestra de ${rengTx(rengD.m)} g de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.solido)} del ${rengTx(rengD.p)} % de pureza reacciona por completo: ${RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto}. Las impurezas no reaccionan.`,
    pregunta: (rengD) => `¿Qué masa de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.gas)} se desprende, en g?`,
    datos: (rengD) => [['Muestra', `${rengTx(rengD.m)} g al ${rengTx(rengD.p)} %`], rengDatoMasa(RENG_REACCIONES_GAS[rengD.g]!.solido), rengDatoMasa(RENG_REACCIONES_GAS[rengD.g]!.gas)],
    pasos: (rengD, rengR) => [`Masa pura: ${rengTx((rengD.m * rengD.p) / 100)} g.`, `Gas: ${rengTx(rengR)} g con la razón de la ecuación.`],
    pistas: ['Calcula primero la masa pura.', 'Pásala a moles y aplica la razón molar.', 'Masa de gas con su masa molar.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s18-p3', subtema: 'n1-b7-s18', titulo: 'Pureza a partir del gas medido', dificultad: 'avanzada',
    objetivo: 'Calcular la pureza de una muestra a partir de la masa de gas que desprende.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('4.5', 'el análisis de pureza', 'masas'), idealizado: 'Impurezas inertes, reacción completa y gas medido sin pérdidas.', metodo: 'búsqueda por bisección de la pureza que reproduce la masa de gas medida',
    parametros: (rengRng) => ({ g: rengIndice(rengRng, RENG_REACCIONES_GAS.length), m: rengEntreN1(rengRng, 2, 50, 1), p: rengEntreN1(rengRng, 55, 98, 1) }),
    respuesta: (rengD) => {
      const rengG = RENG_REACCIONES_GAS[rengD.g]!
      const rengGas = Number((rengMolesGas(rengG, (rengD.m * rengD.p) / 100) * rengMmEst(rengG.gas)).toPrecision(4))
      return ((rengGas / rengMmEst(rengG.gas)) * (rengCoef(rengG.reaccion, rengG.solido) / rengCoef(rengG.reaccion, rengG.gas)) * rengMmEst(rengG.solido) * 100) / rengD.m
    },
    errores: (rengD) => {
      const rengG = RENG_REACCIONES_GAS[rengD.g]!
      const rengGas = Number((rengMolesGas(rengG, (rengD.m * rengD.p) / 100) * rengMmEst(rengG.gas)).toPrecision(4))
      return [
        ['masa-gas', 'Gas entre muestra', (rengGas / rengD.m) * 100, 'Dividiste la masa de gas entre la de la muestra. Primero hay que calcular cuánta sustancia pura produjo ese gas.'],
        ['sin-coef', 'Sin la razón molar', ((rengGas / rengMmEst(rengG.gas)) * rengMmEst(rengG.solido) * 100) / rengD.m, 'Olvidaste la razón molar entre el sólido y el gas.']
      ]
    },
    enunciado: (rengD) => `Una muestra de ${rengTx(rengD.m)} g de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.solido)} impuro reacciona por completo (${RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto}) y desprende ${rengTx(Number((rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, (rengD.m * rengD.p) / 100) * rengMmEst(RENG_REACCIONES_GAS[rengD.g]!.gas)).toPrecision(4)), 4)} g de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.gas)}. Las impurezas no reaccionan.`,
    pregunta: () => '¿Qué pureza tiene la muestra, en %?',
    datos: (rengD) => [['Muestra', `${rengTx(rengD.m)} g`], rengDatoMasa(RENG_REACCIONES_GAS[rengD.g]!.solido), rengDatoMasa(RENG_REACCIONES_GAS[rengD.g]!.gas)],
    pasos: (_rengD, rengR) => ['Moles de gas → moles de sólido puro con la razón → masa pura.', `Pureza = masa pura / masa de muestra × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Pasa el gas a moles.', 'Calcula la masa de sólido puro que lo produjo.', 'Divide entre la masa de muestra.']
  })
]

export const RENG_MEZCLAS_INERTE: ReadonlyArray<{ reactivo: string; inerte: string; gas: string; razon: number; texto: string }> = [
  { reactivo: 'CaCO3', inerte: 'SiO2', gas: 'CO2', razon: 1, texto: 'CaCO₃ → CaO + CO₂' },
  { reactivo: 'NaHCO3', inerte: 'NaCl', gas: 'CO2', razon: 0.5, texto: '2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂' },
  { reactivo: 'MgCO3', inerte: 'SiO2', gas: 'CO2', razon: 1, texto: 'MgCO₃ → MgO + CO₂' }
]

export const RENG_PRACTICAS_B07_S19: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s19-p1', subtema: 'n1-b7-s19', titulo: 'Mezcla con un componente que no reacciona', dificultad: 'basica',
    objetivo: 'Calcular el porcentaje del componente que reacciona en una mezcla con otro inerte.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('4.5', 'la composición de mezclas', 'masas'), idealizado: 'Componente inerte y descomposición completa.', metodo: 'búsqueda por bisección de la fracción que reproduce el CO₂ medido',
    parametros: (rengRng) => ({ k: rengIndice(rengRng, RENG_MEZCLAS_INERTE.length), m: rengEntreN1(rengRng, 2, 40, 0.5), x: rengEntreN1(rengRng, 0.2, 0.95, 0.01) }),
    respuesta: (rengD) => {
      const rengK0 = RENG_MEZCLAS_INERTE[rengD.k]!
      const rengCO2 = Number((((rengD.m * rengD.x) / rengMmEst(rengK0.reactivo)) * rengK0.razon * RENG_M_CO2).toPrecision(4))
      return ((rengCO2 / RENG_M_CO2 / rengK0.razon) * rengMmEst(rengK0.reactivo) * 100) / rengD.m
    },
    errores: (rengD) => {
      const rengK0 = RENG_MEZCLAS_INERTE[rengD.k]!
      const rengCO2 = Number((((rengD.m * rengD.x) / rengMmEst(rengK0.reactivo)) * rengK0.razon * RENG_M_CO2).toPrecision(4))
      return [
        ['co2-entre-mezcla', 'CO₂ entre la mezcla', (rengCO2 / rengD.m) * 100, 'Dividiste la masa de CO₂ entre la de la mezcla. Calcula antes cuánto carbonato produjo ese CO₂.'],
        ['sin-razon', 'Sin la razón molar', ((rengCO2 / RENG_M_CO2) * rengMmEst(rengK0.reactivo) * 100) / rengD.m, rengK0.razon === 1 ? 'Calculaste mal la masa del componente: revisa la masa molar usada.' : 'Olvidaste que por cada mol de CO₂ se descomponen 2 mol de bicarbonato.']
      ]
    },
    enunciado: (rengD) => `Una mezcla de ${rengTx(rengD.m)} g de ${rengTexto(RENG_MEZCLAS_INERTE[rengD.k]!.reactivo)} y ${rengTexto(RENG_MEZCLAS_INERTE[rengD.k]!.inerte)} se calienta: solo el primero se descompone (${RENG_MEZCLAS_INERTE[rengD.k]!.texto}) y desprende ${rengTx(Number((((rengD.m * rengD.x) / rengMmEst(RENG_MEZCLAS_INERTE[rengD.k]!.reactivo)) * RENG_MEZCLAS_INERTE[rengD.k]!.razon * RENG_M_CO2).toPrecision(4)), 4)} g de CO₂.`,
    pregunta: (rengD) => `¿Qué porcentaje en masa de ${rengTexto(RENG_MEZCLAS_INERTE[rengD.k]!.reactivo)} tenía la mezcla?`,
    datos: (rengD) => [['Mezcla', `${rengTx(rengD.m)} g`], rengDatoMasa(RENG_MEZCLAS_INERTE[rengD.k]!.reactivo), rengDatoMasa('CO2')],
    pasos: (_rengD, rengR) => ['Moles de CO₂ → moles del componente que reacciona → su masa.', `Porcentaje = ${rengTx(rengR)} %.`],
    pistas: ['Solo un componente desprende CO₂.', 'Calcula su masa a partir del CO₂.', 'Divide entre la masa de la mezcla.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s19-p2', subtema: 'n1-b7-s19', titulo: 'Bicarbonato a partir de la pérdida de masa', dificultad: 'intermedia',
    objetivo: 'Calcular el porcentaje de NaHCO₃ en una mezcla con NaCl a partir de la masa que pierde al calentarla.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('4.5', 'la composición de mezclas', 'masas'), idealizado: 'Pérdida de masa debida solo al agua y al CO₂ del bicarbonato.', metodo: 'pérdida de masa por gramo de bicarbonato',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 2, 40, 0.5), x: rengEntreN1(rengRng, 0.2, 0.95, 0.01) }),
    respuesta: (rengD) => {
      const rengPerdida = Number((((rengD.m * rengD.x) / RENG_M_NAHCO3 / 2) * (RENG_M_H2O + RENG_M_CO2)).toPrecision(4))
      return (((2 * rengPerdida) / (RENG_M_H2O + RENG_M_CO2)) * RENG_M_NAHCO3 * 100) / rengD.m
    },
    errores: (rengD) => {
      const rengPerdida = Number((((rengD.m * rengD.x) / RENG_M_NAHCO3 / 2) * (RENG_M_H2O + RENG_M_CO2)).toPrecision(4))
      return [
        ['solo-co2', 'Solo el CO₂', (((2 * rengPerdida) / RENG_M_CO2) * RENG_M_NAHCO3 * 100) / rengD.m, 'Atribuiste toda la pérdida al CO₂. También escapa el agua: la pérdida por cada 2 mol de NaHCO₃ es M(H₂O) + M(CO₂).'],
        ['sin-dos', 'Sin el coeficiente 2', ((rengPerdida / (RENG_M_H2O + RENG_M_CO2)) * RENG_M_NAHCO3 * 100) / rengD.m, 'Olvidaste que se descomponen 2 mol de NaHCO₃ por cada mol de agua y de CO₂.']
      ]
    },
    enunciado: (rengD) => `Una mezcla de ${rengTx(rengD.m)} g de NaHCO₃ y NaCl se calienta hasta que el bicarbonato se descompone por completo (2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂; el agua y el CO₂ escapan). La masa disminuye ${rengTx(Number((((rengD.m * rengD.x) / RENG_M_NAHCO3 / 2) * (RENG_M_H2O + RENG_M_CO2)).toPrecision(4)), 4)} g.`,
    pregunta: () => '¿Qué porcentaje en masa de NaHCO₃ tenía la mezcla?',
    datos: (rengD) => [['Mezcla', `${rengTx(rengD.m)} g`], rengDatoMasa('NaHCO3'), rengDatoMasa('H2O'), rengDatoMasa('CO2')],
    pasos: (_rengD, rengR) => ['Por cada 2 mol de NaHCO₃ se pierden M(H₂O) + M(CO₂) gramos.', `Masa de NaHCO₃ y porcentaje: ${rengTx(rengR)} %.`],
    pistas: ['¿Qué sustancias escapan al calentar?', 'Relaciona la pérdida con los moles de bicarbonato.', 'Divide la masa de bicarbonato entre la de la mezcla.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s19-p3', subtema: 'n1-b7-s19', titulo: 'Dos carbonatos que desprenden CO₂', dificultad: 'avanzada',
    objetivo: 'Resolver un balance de dos componentes que reaccionan para hallar la masa de uno de ellos.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.5', 'la composición de mezclas', 'masas'), idealizado: 'Descomposición completa de los dos carbonatos.', metodo: 'bisección numérica sobre el balance de moles de CO₂',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 2, 20, 0.5), x: rengEntreN1(rengRng, 0.15, 0.85, 0.01) }),
    respuesta: (rengD) => {
      const rengCO2 = Number((((rengD.m * rengD.x) / RENG_M_CACO3 + (rengD.m * (1 - rengD.x)) / RENG_M_MGCO3) * RENG_M_CO2).toPrecision(4))
      return (rengCO2 / RENG_M_CO2 - rengD.m / RENG_M_MGCO3) / (1 / RENG_M_CACO3 - 1 / RENG_M_MGCO3)
    },
    errores: (rengD) => {
      const rengCO2 = Number((((rengD.m * rengD.x) / RENG_M_CACO3 + (rengD.m * (1 - rengD.x)) / RENG_M_MGCO3) * RENG_M_CO2).toPrecision(4))
      const rengX = (rengCO2 / RENG_M_CO2 - rengD.m / RENG_M_MGCO3) / (1 / RENG_M_CACO3 - 1 / RENG_M_MGCO3)
      return [
        ['otro-componente', 'Masa del otro carbonato', rengD.m - rengX, 'Diste la masa de MgCO₃. La pregunta pide la de CaCO₃.'],
        ['todo-caco3', 'Suponer todo CaCO₃', (rengCO2 / RENG_M_CO2) * RENG_M_CACO3, 'Supusiste que todo el CO₂ venía del CaCO₃. Los dos carbonatos desprenden CO₂: hace falta un balance.']
      ]
    },
    enunciado: (rengD) => `${rengTx(rengD.m)} g de una mezcla de CaCO₃ y MgCO₃ se descomponen por completo (cada uno da su óxido y CO₂) y desprenden ${rengTx(Number((((rengD.m * rengD.x) / RENG_M_CACO3 + (rengD.m * (1 - rengD.x)) / RENG_M_MGCO3) * RENG_M_CO2).toPrecision(4)), 4)} g de CO₂.`,
    pregunta: () => '¿Qué masa de CaCO₃ contenía la mezcla, en g?',
    datos: (rengD) => [['Mezcla', `${rengTx(rengD.m)} g`], rengDatoMasa('CaCO3'), rengDatoMasa('MgCO3'), rengDatoMasa('CO2')],
    pasos: (_rengD, rengR) => ['x/M(CaCO₃) + (m − x)/M(MgCO₃) = n(CO₂).', `x = ${rengTx(rengR)} g.`],
    pistas: ['Llama x a la masa de CaCO₃.', 'Cada carbonato da 1 mol de CO₂ por mol.', 'Iguala la suma a los moles de CO₂ y despeja.']
  })
]

export const RENG_PRACTICAS_B07_S20: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s20-p1', subtema: 'n1-b7-s20', titulo: 'Volumen de gas producido', dificultad: 'basica',
    objetivo: 'Calcular el volumen de gas que produce una masa de sólido a una presión y temperatura dadas.', unidad: 'L', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'la estequiometría con gases', 'masas', 'r'), idealizado: 'Gas ideal seco y reacción completa.', metodo: 'P·V = N·k_B·T en el SI con el número de moléculas de gas',
    parametros: (rengRng) => ({ g: rengIndice(rengRng, RENG_REACCIONES_GAS.length), m: rengEntreN1(rengRng, 0.5, 30, 0.5), t: rengEntreN1(rengRng, 5, 40, 1), p: rengEntreN1(rengRng, 95, 105, 0.5) }),
    respuesta: (rengD) => (rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, rengD.m) * RENG_R_LKPA * rengK(rengD.t)) / rengD.p,
    errores: (rengD) => [
      ['celsius', 'Temperatura en °C', (rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, rengD.m) * RENG_R_LKPA * rengD.t) / rengD.p, 'Usaste la temperatura en °C. En P·V = n·R·T va en kelvin.'],
      ['volumen-224', 'Usar 22,4 L/mol', rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, rengD.m) * 22.414, 'Usaste 22,4 L/mol, que solo vale a 0 °C y 1 atm.']
    ],
    valida: (rengD) => Math.abs(rengK(rengD.t) / 273.15 * (101.325 / rengD.p) - 1) > 0.03,
    enunciado: (rengD) => `Según ${RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto}, reaccionan por completo ${rengTx(rengD.m)} g de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.solido)}. El ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.gas)} se mide seco a ${rengTx(rengD.t)} °C y ${rengTx(rengD.p)} kPa.`,
    pregunta: (rengD) => `¿Qué volumen de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.gas)} se obtiene, en L?`,
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto], rengDatoMasa(RENG_REACCIONES_GAS[rengD.g]!.solido), ['Condiciones', `${rengTx(rengD.t)} °C y ${rengTx(rengD.p)} kPa`], ['R', '8,314 L·kPa/(mol·K)']],
    pasos: (rengD, rengR) => [`Moles de gas: ${rengTx(rengMolesGas(RENG_REACCIONES_GAS[rengD.g]!, rengD.m), 4)} mol.`, `V = n·R·T/P = ${rengTx(rengR)} L.`],
    pistas: ['Pasa el sólido a moles y aplica la razón molar.', 'Temperatura en kelvin.', 'V = n·R·T/P con R en L·kPa/(mol·K).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s20-p2', subtema: 'n1-b7-s20', titulo: 'Sólido necesario para un volumen de gas', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de sólido necesaria para obtener un volumen de gas en condiciones dadas.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'la estequiometría con gases', 'masas', 'r'), idealizado: 'Gas ideal seco y reacción completa.', metodo: 'número de moléculas de gas con P·V = N·k_B·T y estequiometría inversa',
    parametros: (rengRng) => ({ g: rengIndice(rengRng, RENG_REACCIONES_GAS.length), v: rengEntreN1(rengRng, 0.2, 10, 0.1), t: rengEntreN1(rengRng, 0, 40, 1), p: rengEntreN1(rengRng, 95, 105, 0.5) }),
    valida: (rengD) => Math.abs(rengK(rengD.t) / 273.15 * (101.325 / rengD.p) - 1) > 0.03,
    respuesta: (rengD) => {
      const rengG = RENG_REACCIONES_GAS[rengD.g]!
      return ((rengD.p * rengD.v) / (RENG_R_LKPA * rengK(rengD.t))) * (rengCoef(rengG.reaccion, rengG.solido) / rengCoef(rengG.reaccion, rengG.gas)) * rengMmEst(rengG.solido)
    },
    errores: (rengD) => {
      const rengG = RENG_REACCIONES_GAS[rengD.g]!
      const rengN = (rengD.p * rengD.v) / (RENG_R_LKPA * rengK(rengD.t))
      return [
        ['masa-gas', 'Masa de gas en lugar de sólido', rengN * rengMmEst(rengG.gas), 'Calculaste la masa del gas. La pregunta pide la del sólido que lo produce.'],
        ['volumen-224', 'Usar 22,4 L/mol', (rengD.v / 22.414) * (rengCoef(rengG.reaccion, rengG.solido) / rengCoef(rengG.reaccion, rengG.gas)) * rengMmEst(rengG.solido), 'Usaste 22,4 L/mol fuera de 0 °C y 1 atm.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto}, se quieren obtener ${rengTx(rengD.v)} L de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.gas)} seco a ${rengTx(rengD.t)} °C y ${rengTx(rengD.p)} kPa.`,
    pregunta: (rengD) => `¿Qué masa de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.solido)} hace falta, en g?`,
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto], ['Volumen de gas', `${rengTx(rengD.v)} L`], ['Condiciones', `${rengTx(rengD.t)} °C y ${rengTx(rengD.p)} kPa`], rengDatoMasa(RENG_REACCIONES_GAS[rengD.g]!.solido)],
    pasos: (rengD, rengR) => [`n(gas) = P·V/(R·T) = ${rengTx((rengD.p * rengD.v) / (RENG_R_LKPA * rengK(rengD.t)), 4)} mol.`, `Sólido: razón molar y masa molar → ${rengTx(rengR)} g.`],
    pistas: ['Pasa el volumen a moles con P·V = n·R·T.', 'Aplica la razón molar hacia el sólido.', 'Masa con la masa molar del sólido.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s20-p3', subtema: 'n1-b7-s20', titulo: 'Volumen de oxígeno para una combustión', dificultad: 'avanzada',
    objetivo: 'Calcular el volumen de O₂ en condiciones dadas para quemar una masa de combustible.', unidad: 'L', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'la estequiometría con gases', 'masas', 'r'), idealizado: 'Combustión completa; oxígeno como gas ideal.', metodo: 'número de moléculas de O₂ y P·V = N·k_B·T',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_COMBUSTIONES.length), m: rengEntreN1(rengRng, 1, 50, 0.5), t: rengEntreN1(rengRng, 0, 40, 1), p: rengEntreN1(rengRng, 95, 105, 0.5) }),
    valida: (rengD) => Math.abs(rengK(rengD.t) / 273.15 * (101.325 / rengD.p) - 1) > 0.03,
    respuesta: (rengD) => {
      const rengC = RENG_COMBUSTIONES[rengD.c]!
      return ((rengD.m / rengMmEst(rengC.reactivos[0]!.formula)) * (rengC.reactivos[1]!.coef / rengC.reactivos[0]!.coef) * RENG_R_LKPA * rengK(rengD.t)) / rengD.p
    },
    errores: (rengD) => {
      const rengC = RENG_COMBUSTIONES[rengD.c]!
      const rengN = (rengD.m / rengMmEst(rengC.reactivos[0]!.formula)) * (rengC.reactivos[1]!.coef / rengC.reactivos[0]!.coef)
      return [
        ['sin-coef', 'Sin la razón molar', (rengD.m / rengMmEst(rengC.reactivos[0]!.formula)) * RENG_R_LKPA * rengK(rengD.t) / rengD.p, 'Calculaste el volumen de los moles de combustible. Aplica antes la razón O₂ : combustible.'],
        ['volumen-224', 'Usar 22,4 L/mol', rengN * 22.414, 'Usaste 22,4 L/mol fuera de 0 °C y 1 atm.']
      ]
    },
    enunciado: (rengD) => `Se queman ${rengTx(rengD.m)} g de ${RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.texto} (${RENG_COMBUSTIONES[rengD.c]!.texto}). El oxígeno se mide a ${rengTx(rengD.t)} °C y ${rengTx(rengD.p)} kPa.`,
    pregunta: () => '¿Qué volumen de O₂ se consume, en L?',
    datos: (rengD) => [['Ecuación', RENG_COMBUSTIONES[rengD.c]!.texto], rengDatoMasa(RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.formula), ['Condiciones', `${rengTx(rengD.t)} °C y ${rengTx(rengD.p)} kPa`]],
    pasos: (rengD, rengR) => [`Moles de O₂: ${rengTx((rengD.m / rengMmEst(RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.formula)) * (RENG_COMBUSTIONES[rengD.c]!.reactivos[1]!.coef / RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.coef), 4)} mol.`, `V = n·R·T/P = ${rengTx(rengR)} L.`],
    pistas: ['Pasa el combustible a moles.', 'Razón O₂ : combustible.', 'Volumen con P·V = n·R·T.']
  })
]

export const RENG_PRACTICAS_B07_S21: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s21-p1', subtema: 'n1-b7-s21', titulo: 'Rendimiento global de varias etapas', dificultad: 'basica',
    objetivo: 'Calcular el rendimiento global de una secuencia multiplicando los rendimientos de las etapas.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('4.4', 'los rendimientos de varias etapas'), idealizado: 'Rendimientos independientes y constantes.', metodo: 'simulación etapa a etapa de 100 mol de material',
    parametros: (rengRng) => ({ k: rengEntreN1(rengRng, 2, 4, 1), a: rengEntreN1(rengRng, 60, 98, 1), b: rengEntreN1(rengRng, 60, 98, 1), c: rengEntreN1(rengRng, 60, 98, 1), d: rengEntreN1(rengRng, 60, 98, 1) }),
    respuesta: (rengD) => [rengD.a, rengD.b, rengD.c, rengD.d].slice(0, rengD.k).reduce((rengP, rengR) => rengP * (rengR / 100), 1) * 100,
    errores: (rengD) => {
      const rengL = [rengD.a, rengD.b, rengD.c, rengD.d].slice(0, rengD.k)
      return [
        ['media', 'Promediar los rendimientos', rengL.reduce((rengS, rengR) => rengS + rengR, 0) / rengL.length, 'Promediaste los rendimientos. En una secuencia, los rendimientos (en fracción) se multiplican.'],
        ['ultima', 'Solo la última etapa', rengL[rengL.length - 1]!, 'Usaste solo el rendimiento de la última etapa; hay que multiplicar los de todas.']
      ]
    },
    enunciado: (rengD) => `Una síntesis tiene ${rengD.k} etapas con rendimientos del ${[rengD.a, rengD.b, rengD.c, rengD.d].slice(0, rengD.k).map((rengR) => `${rengTx(rengR)} %`).join(', ')}.`,
    pregunta: () => '¿Cuál es el rendimiento global de la síntesis?',
    datos: (rengD) => [['Número de etapas', String(rengD.k)], ['Rendimientos', [rengD.a, rengD.b, rengD.c, rengD.d].slice(0, rengD.k).map((rengR) => `${rengTx(rengR)} %`).join(' · ')]],
    pasos: (_rengD, rengR) => ['Pasa cada rendimiento a fracción y multiplícalos.', `Global = ${rengTx(rengR)} %.`],
    pistas: ['Los rendimientos de las etapas se multiplican.', 'Pásalos a fracción antes de multiplicar.', 'Vuelve a porcentaje al final.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s21-p2', subtema: 'n1-b7-s21', titulo: 'Cal apagada a partir de caliza', dificultad: 'intermedia',
    objetivo: 'Encadenar dos reacciones con sus rendimientos para calcular la masa de producto final.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'las reacciones consecutivas', 'masas'), idealizado: 'Rendimientos constantes por etapa.', metodo: 'cálculo paso a paso con la masa intermedia de CaO',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 10, 500, 5), a: rengEntreN1(rengRng, 60, 98, 1), b: rengEntreN1(rengRng, 60, 98, 1) }),
    respuesta: (rengD) => (rengD.m / RENG_M_CACO3) * (rengD.a / 100) * (rengD.b / 100) * RENG_M_CAOH2,
    errores: (rengD) => [
      ['sin-rendimientos', 'Sin los rendimientos', (rengD.m / RENG_M_CACO3) * RENG_M_CAOH2, 'Calculaste el máximo teórico, sin aplicar los rendimientos de las dos etapas.'],
      ['solo-primero', 'Solo el primer rendimiento', (rengD.m / RENG_M_CACO3) * (rengD.a / 100) * RENG_M_CAOH2, 'Aplicaste solo el rendimiento de la primera etapa; falta el de la segunda.']
    ],
    enunciado: (rengD) => `Se calcinan ${rengTx(rengD.m)} g de CaCO₃ (CaCO₃ → CaO + CO₂, rendimiento ${rengTx(rengD.a)} %) y el CaO se hidrata (CaO + H₂O → Ca(OH)₂, rendimiento ${rengTx(rengD.b)} %).`,
    pregunta: () => '¿Qué masa de Ca(OH)₂ se obtiene, en g?',
    datos: (rengD) => [['CaCO₃', `${rengTx(rengD.m)} g`], ['Rendimientos', `${rengTx(rengD.a)} % y ${rengTx(rengD.b)} %`], rengDatoMasa('CaCO3'), rengDatoMasa('Ca(OH)2')],
    pasos: (rengD, rengR) => [`Moles de CaCO₃: ${rengTx(rengD.m / RENG_M_CACO3, 4)} mol; las razones son 1 : 1 : 1.`, `Ca(OH)₂ = moles × ${rengTx(rengD.a / 100, 3)} × ${rengTx(rengD.b / 100, 3)} × M = ${rengTx(rengR)} g.`],
    pistas: ['Las dos razones molares son 1 : 1.', 'Aplica los dos rendimientos.', 'Pasa a gramos de Ca(OH)₂.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s21-p3', subtema: 'n1-b7-s21', titulo: 'Caliza necesaria para un producto final', dificultad: 'avanzada',
    objetivo: 'Calcular la materia prima necesaria para una masa de producto final en dos etapas con pérdidas.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'las reacciones consecutivas', 'masas'), idealizado: 'Rendimientos constantes por etapa.', metodo: 'cálculo hacia atrás paso a paso con el CaO necesario',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 10, 500, 5), a: rengEntreN1(rengRng, 60, 98, 1), b: rengEntreN1(rengRng, 60, 98, 1) }),
    respuesta: (rengD) => (rengD.m / RENG_M_CAOH2 / ((rengD.a / 100) * (rengD.b / 100))) * RENG_M_CACO3,
    errores: (rengD) => [
      ['sin-rendimientos', 'Sin las pérdidas', (rengD.m / RENG_M_CAOH2) * RENG_M_CACO3, 'Calculaste para rendimientos del 100 %. Con pérdidas hace falta más caliza: divide entre el rendimiento global.'],
      ['multiplica', 'Multiplicar por los rendimientos', (rengD.m / RENG_M_CAOH2) * (rengD.a / 100) * (rengD.b / 100) * RENG_M_CACO3, 'Multiplicaste por los rendimientos; así saldría menos caliza de la necesaria.']
    ],
    enunciado: (rengD) => `Se quieren obtener ${rengTx(rengD.m)} g de Ca(OH)₂ con CaCO₃ → CaO + CO₂ (${rengTx(rengD.a)} %) y CaO + H₂O → Ca(OH)₂ (${rengTx(rengD.b)} %).`,
    pregunta: () => '¿Qué masa de CaCO₃ hay que calcinar, en g?',
    datos: (rengD) => [['Ca(OH)₂ deseado', `${rengTx(rengD.m)} g`], ['Rendimientos', `${rengTx(rengD.a)} % y ${rengTx(rengD.b)} %`], rengDatoMasa('CaCO3'), rengDatoMasa('Ca(OH)2')],
    pasos: (rengD, rengR) => [`Rendimiento global: ${rengTx((rengD.a / 100) * (rengD.b / 100), 4)}.`, `CaCO₃ = (moles deseados / global) × M = ${rengTx(rengR)} g.`],
    pistas: ['Calcula los moles de producto final.', 'Divide entre el rendimiento global.', 'Pasa a gramos de caliza.']
  })
]

