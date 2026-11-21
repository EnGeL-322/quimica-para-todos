import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_COMBUSTIONES, RENG_EMPIRICAS, RENG_HIDROCARBUROS, RENG_REACCIONES_DOS_REACTIVOS, RENG_REACCIONES_EST, RENG_REACCIONES_GAS, RENG_TOL_EST, rengDatoMasa, rengFuentesEst, rengMasaAt, rengMmEst, rengTexto, type RengReaccionEst } from './b07-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

type RengPar = readonly [reaccion: RengReaccionEst, a: number, b: number]

export const RENG_RP: readonly RengPar[] = RENG_REACCIONES_EST.flatMap((rengR) => rengR.reactivos.flatMap((_rengX, rengI) => rengR.productos.map((_rengY, rengJ) => [rengR, rengI, rengJ] as const)))
export const RENG_RR: readonly RengPar[] = RENG_REACCIONES_DOS_REACTIVOS.flatMap((rengR) => [[rengR, 0, 1] as const, [rengR, 1, 0] as const])
const RENG_GASEOSAS = RENG_REACCIONES_DOS_REACTIVOS.filter((rengR) => rengR.reactivos.every((rengE) => ['H2', 'O2', 'N2', 'CH4', 'C3H8', 'C2H6'].includes(rengE.formula)))
export const RENG_RR_GAS: readonly RengPar[] = RENG_GASEOSAS.flatMap((rengR) => [[rengR, 0, 1] as const, [rengR, 1, 0] as const])
export const RENG_COMBUSTIBLES_GAS = RENG_COMBUSTIONES.filter((rengR) => ['CH4', 'C3H8', 'C2H6'].includes(rengR.reactivos[0]!.formula))
export const RENG_NH3 = RENG_REACCIONES_EST.find((rengR) => rengR.productos[0]!.formula === 'NH3')!
export const RENG_HIDROCARBUROS_MOL = RENG_HIDROCARBUROS.filter(([rengF]) => !['CH4'].includes(rengF))

const rengR = (rengP: RengPar) => rengP[0].reactivos[rengP[1]]!
const rengP = (rengPar: RengPar) => rengPar[0].productos[rengPar[2]]!
const rengR2 = (rengPar: RengPar) => rengPar[0].reactivos[rengPar[2]]!

export const RENG_PRACTICAS_B07_S08: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s8-p1', subtema: 'n1-b7-s8', titulo: 'Factor entre fórmula empírica y molecular', dificultad: 'basica',
    objetivo: 'Calcular cuántas unidades empíricas forman la molécula dividiendo la masa molar entre la masa empírica.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.2', 'la fórmula molecular', 'masas'), idealizado: 'Masa molar medida sin error.', metodo: 'masa de la unidad empírica sumada a mano con las masas atómicas',
    parametros: (rengRng) => ({ e: rengIndice(rengRng, RENG_EMPIRICAS.length), n: rengEntreN1(rengRng, 2, 6, 1) }),
    respuesta: (rengD) => Math.round(rengD.n * rengMmEst(RENG_EMPIRICAS[rengD.e]![0]) * 10) / 10 / rengMmEst(RENG_EMPIRICAS[rengD.e]![0]),
    errores: (rengD) => {
      const rengM = Math.round(rengD.n * rengMmEst(RENG_EMPIRICAS[rengD.e]![0]) * 10) / 10
      return [
        ['inversa', 'Masa empírica entre masa molar', rengMmEst(RENG_EMPIRICAS[rengD.e]![0]) / rengM, 'Dividiste al revés. La molécula contiene varias unidades empíricas, así que el factor es mayor que 1.'],
        ['solo-carbono', 'Dividir entre la masa del carbono', rengM / rengMasaAt('C'), 'Dividiste entre la masa de un átomo de carbono, no entre la de toda la unidad empírica.']
      ]
    },
    enunciado: (rengD) => `Un compuesto tiene fórmula empírica ${rengTexto(RENG_EMPIRICAS[rengD.e]![0])} y masa molar ${rengTx(Math.round(rengD.n * rengMmEst(RENG_EMPIRICAS[rengD.e]![0]) * 10) / 10, 4)} g/mol (dato didáctico).`,
    pregunta: () => '¿Por qué número hay que multiplicar los subíndices de la fórmula empírica?',
    datos: (rengD) => [['Fórmula empírica', rengTexto(RENG_EMPIRICAS[rengD.e]![0])], rengDatoMasa(RENG_EMPIRICAS[rengD.e]![0]), ['Masa molar del compuesto', `${rengTx(Math.round(rengD.n * rengMmEst(RENG_EMPIRICAS[rengD.e]![0]) * 10) / 10, 4)} g/mol`]],
    pasos: (rengD, rengR0) => [`n = M / M_emp = ${rengTx(Math.round(rengD.n * rengMmEst(RENG_EMPIRICAS[rengD.e]![0]) * 10) / 10, 4)} / ${rengTx(rengMmEst(RENG_EMPIRICAS[rengD.e]![0]), 5)}.`, `n = ${rengTx(rengR0)} ≈ ${Math.round(rengR0)}.`],
    pistas: ['Calcula la masa de la fórmula empírica.', 'Divide la masa molar entre ella.', 'El resultado debe quedar cerca de un entero.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s8-p2', subtema: 'n1-b7-s8', titulo: 'Átomos por molécula', dificultad: 'intermedia',
    objetivo: 'Obtener el número de átomos de un elemento en la fórmula molecular a partir de la empírica y la masa molar.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.2', 'la fórmula molecular', 'masas'), idealizado: 'Masa molar medida sin error.', metodo: 'subíndice empírico por el factor redondeado, con la masa empírica sumada a mano',
    parametros: (rengRng) => ({ e: rengIndice(rengRng, RENG_EMPIRICAS.length), n: rengEntreN1(rengRng, 2, 6, 1), x: rengIndice(rengRng, 2) }),
    respuesta: (rengD) => {
      const rengE = RENG_EMPIRICAS[rengD.e]!
      return Math.round((Math.round(rengD.n * rengMmEst(rengE[0]) * 10) / 10) / rengMmEst(rengE[0])) * (rengD.x === 0 ? rengE[2] : rengE[1])
    },
    errores: (rengD) => {
      const rengE = RENG_EMPIRICAS[rengD.e]!
      return [
        ['empirica', 'Subíndice de la fórmula empírica', rengD.x === 0 ? rengE[2] : rengE[1], 'Diste el subíndice de la fórmula empírica. En la molecular hay que multiplicarlo por el factor n.'],
        ['factor', 'Solo el factor', rengD.n, 'Diste solo el factor n. Hay que multiplicarlo por el subíndice del elemento en la fórmula empírica.']
      ]
    },
    enunciado: (rengD) => `Un compuesto tiene fórmula empírica ${rengTexto(RENG_EMPIRICAS[rengD.e]![0])} y masa molar ${rengTx(Math.round(rengD.n * rengMmEst(RENG_EMPIRICAS[rengD.e]![0]) * 10) / 10, 4)} g/mol.`,
    pregunta: (rengD) => `¿Cuántos átomos de ${rengD.x === 0 ? 'H' : 'C'} tiene cada molécula?`,
    datos: (rengD) => [['Fórmula empírica', rengTexto(RENG_EMPIRICAS[rengD.e]![0])], rengDatoMasa(RENG_EMPIRICAS[rengD.e]![0]), ['Masa molar', `${rengTx(Math.round(rengD.n * rengMmEst(RENG_EMPIRICAS[rengD.e]![0]) * 10) / 10, 4)} g/mol`]],
    pasos: (rengD, rengR0) => [`Factor n = ${rengD.n}.`, `Átomos pedidos = ${rengD.n} × ${rengD.x === 0 ? RENG_EMPIRICAS[rengD.e]![2] : RENG_EMPIRICAS[rengD.e]![1]} = ${rengR0}.`],
    pistas: ['Calcula el factor n = M / M_emp.', 'Redondea n al entero más cercano.', 'Multiplica el subíndice empírico por n.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s8-p3', subtema: 'n1-b7-s8', titulo: 'Átomos de C desde la composición y la masa molar', dificultad: 'avanzada',
    objetivo: 'Calcular el número de átomos de carbono por molécula a partir del porcentaje de C y la masa molar.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.2', 'la fórmula molecular', 'masas'), idealizado: 'Análisis y masa molar exactos.', metodo: 'masa de carbono en un mol pasada a moles de átomos',
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDROCARBUROS_MOL.length), q: rengIndice(rengRng, 2) }),
    respuesta: (rengD) => {
      const [rengF] = RENG_HIDROCARBUROS_MOL[rengD.h]!
      const rengPctC = Math.round((100 * RENG_HIDROCARBUROS_MOL[rengD.h]![1] * rengMasaAt('C')) / rengMmEst(rengF) * 100) / 100
      const rengM = Math.round(rengMmEst(rengF) * 10) / 10
      return (rengM * rengPctC) / 100 / rengMasaAt('C')
    },
    errores: (rengD) => {
      const [rengF] = RENG_HIDROCARBUROS_MOL[rengD.h]!
      const rengPctC = Math.round((100 * RENG_HIDROCARBUROS_MOL[rengD.h]![1] * rengMasaAt('C')) / rengMmEst(rengF) * 100) / 100
      const rengM = Math.round(rengMmEst(rengF) * 10) / 10
      return [
        ['sin-porcentaje', 'Ignorar el porcentaje', rengM / rengMasaAt('C'), 'Dividiste toda la masa molar entre la masa del carbono, como si la molécula fuera solo carbono.'],
        ['masa-carbono', 'Masa de carbono, no átomos', (rengM * rengPctC) / 100, 'Calculaste la masa de carbono en un mol. Divídela entre la masa atómica del carbono para contar átomos.']
      ]
    },
    enunciado: (rengD) => {
      const [rengF] = RENG_HIDROCARBUROS_MOL[rengD.h]!
      return `Un hidrocarburo tiene ${rengTx(Math.round((100 * RENG_HIDROCARBUROS_MOL[rengD.h]![1] * rengMasaAt('C')) / rengMmEst(rengF) * 100) / 100, 4)} % de C en masa y masa molar ${rengTx(Math.round(rengMmEst(rengF) * 10) / 10, 4)} g/mol${rengD.q === 0 ? '' : ' (medida por espectrometría de masas)'}.`
    },
    pregunta: () => '¿Cuántos átomos de carbono tiene cada molécula?',
    datos: (rengD) => [['% C', `${rengTx(Math.round((100 * RENG_HIDROCARBUROS_MOL[rengD.h]![1] * rengMasaAt('C')) / rengMmEst(RENG_HIDROCARBUROS_MOL[rengD.h]![0]) * 100) / 100, 4)} %`], ['Masa molar', `${rengTx(Math.round(rengMmEst(RENG_HIDROCARBUROS_MOL[rengD.h]![0]) * 10) / 10, 4)} g/mol`], ['Masa atómica del C', `${rengTx(rengMasaAt('C'), 5)} g/mol`]],
    pasos: (_rengD, rengR0) => ['Masa de C en un mol = M × %C / 100.', `Átomos de C = esa masa / A(C) = ${rengTx(rengR0)} ≈ ${Math.round(rengR0)}.`],
    pistas: ['¿Cuántos gramos de carbono hay en un mol?', 'Multiplica la masa molar por la fracción de carbono.', 'Divide entre la masa atómica del carbono.']
  })
]

export const RENG_PRACTICAS_B07_S09: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s9-p1', subtema: 'n1-b7-s9', titulo: 'Moles de producto', dificultad: 'basica',
    objetivo: 'Usar la razón molar de una ecuación ajustada para pasar de moles de reactivo a moles de producto.', unidad: 'mol', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'las razones molares'), idealizado: 'Reacción completa, con los demás reactivos en exceso.', metodo: 'avance de reacción con la función del núcleo para el reactivo limitante',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RP.length), n: rengEntreN1(rengRng, 0.2, 8, 0.1) }),
    valida: (rengD) => rengP(RENG_RP[rengD.p]!).coef !== rengR(RENG_RP[rengD.p]!).coef,
    respuesta: (rengD) => (rengD.n * rengP(RENG_RP[rengD.p]!).coef) / rengR(RENG_RP[rengD.p]!).coef,
    errores: (rengD) => [
      ['uno-a-uno', 'Razón 1 : 1', rengD.n, 'Supusiste que se forma un mol de producto por cada mol de reactivo. Usa los coeficientes de la ecuación.'],
      ['invertida', 'Razón invertida', (rengD.n * rengR(RENG_RP[rengD.p]!).coef) / rengP(RENG_RP[rengD.p]!).coef, 'Pusiste la razón molar al revés: el coeficiente de la sustancia buscada va en el numerador.']
    ],
    enunciado: (rengD) => `Según ${RENG_RP[rengD.p]![0].texto}, reaccionan ${rengTx(rengD.n)} mol de ${rengR(RENG_RP[rengD.p]!).texto} con los demás reactivos en exceso.`,
    pregunta: (rengD) => `¿Cuántos moles de ${rengP(RENG_RP[rengD.p]!).texto} se forman?`,
    datos: (rengD) => [['Ecuación', RENG_RP[rengD.p]![0].texto], [rengR(RENG_RP[rengD.p]!).texto, `${rengTx(rengD.n)} mol`]],
    pasos: (rengD, rengR0) => [`Razón molar: ${rengP(RENG_RP[rengD.p]!).coef} ${rengP(RENG_RP[rengD.p]!).texto} : ${rengR(RENG_RP[rengD.p]!).coef} ${rengR(RENG_RP[rengD.p]!).texto}.`, `n = ${rengTx(rengD.n)} × ${rengP(RENG_RP[rengD.p]!).coef}/${rengR(RENG_RP[rengD.p]!).coef} = ${rengTx(rengR0)} mol.`],
    pistas: ['Lee los coeficientes de la ecuación ajustada.', 'Escribe la razón con la sustancia buscada arriba.', 'Multiplica los moles dados por esa razón.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s9-p2', subtema: 'n1-b7-s9', titulo: 'Moles de otro reactivo necesarios', dificultad: 'intermedia',
    objetivo: 'Calcular cuántos moles de un reactivo se necesitan para reaccionar con unos moles de otro.', unidad: 'mol', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'las razones molares'), idealizado: 'Reacción completa.', metodo: 'avance de reacción con la función del núcleo',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RR.length), n: rengEntreN1(rengRng, 0.2, 8, 0.1) }),
    valida: (rengD) => rengR2(RENG_RR[rengD.p]!).coef !== rengR(RENG_RR[rengD.p]!).coef,
    respuesta: (rengD) => (rengD.n * rengR2(RENG_RR[rengD.p]!).coef) / rengR(RENG_RR[rengD.p]!).coef,
    errores: (rengD) => [
      ['uno-a-uno', 'Razón 1 : 1', rengD.n, 'Supusiste que reaccionan los mismos moles de los dos reactivos. Usa los coeficientes.'],
      ['invertida', 'Razón invertida', (rengD.n * rengR(RENG_RR[rengD.p]!).coef) / rengR2(RENG_RR[rengD.p]!).coef, 'Invertiste la razón molar: el coeficiente del reactivo buscado va arriba.']
    ],
    enunciado: (rengD) => `Según ${RENG_RR[rengD.p]![0].texto}, se quieren hacer reaccionar por completo ${rengTx(rengD.n)} mol de ${rengR(RENG_RR[rengD.p]!).texto}.`,
    pregunta: (rengD) => `¿Cuántos moles de ${rengR2(RENG_RR[rengD.p]!).texto} hacen falta?`,
    datos: (rengD) => [['Ecuación', RENG_RR[rengD.p]![0].texto], [rengR(RENG_RR[rengD.p]!).texto, `${rengTx(rengD.n)} mol`]],
    pasos: (rengD, rengR0) => [`Razón: ${rengR2(RENG_RR[rengD.p]!).coef} : ${rengR(RENG_RR[rengD.p]!).coef}.`, `n = ${rengTx(rengD.n)} × ${rengR2(RENG_RR[rengD.p]!).coef}/${rengR(RENG_RR[rengD.p]!).coef} = ${rengTx(rengR0)} mol.`],
    pistas: ['Busca los coeficientes de los dos reactivos.', 'Pon arriba el del reactivo que buscas.', 'Multiplica por los moles dados.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s9-p3', subtema: 'n1-b7-s9', titulo: 'Reactivo necesario para un producto', dificultad: 'avanzada',
    objetivo: 'Calcular los moles de reactivo necesarios para obtener unos moles dados de producto.', unidad: 'mol', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'las razones molares'), idealizado: 'Reacción completa sin pérdidas.', metodo: 'búsqueda por bisección del reactivo que, con la función del núcleo, da los moles de producto pedidos',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RP.length), n: rengEntreN1(rengRng, 0.2, 8, 0.1) }),
    valida: (rengD) => rengP(RENG_RP[rengD.p]!).coef !== rengR(RENG_RP[rengD.p]!).coef,
    respuesta: (rengD) => (rengD.n * rengR(RENG_RP[rengD.p]!).coef) / rengP(RENG_RP[rengD.p]!).coef,
    errores: (rengD) => [
      ['uno-a-uno', 'Razón 1 : 1', rengD.n, 'Supusiste que hace falta un mol de reactivo por cada mol de producto. Usa los coeficientes.'],
      ['invertida', 'Razón invertida', (rengD.n * rengP(RENG_RP[rengD.p]!).coef) / rengR(RENG_RP[rengD.p]!).coef, 'Invertiste la razón: ahora buscas el reactivo, así que su coeficiente va arriba.']
    ],
    enunciado: (rengD) => `Según ${RENG_RP[rengD.p]![0].texto}, se quieren obtener ${rengTx(rengD.n)} mol de ${rengP(RENG_RP[rengD.p]!).texto}.`,
    pregunta: (rengD) => `¿Cuántos moles de ${rengR(RENG_RP[rengD.p]!).texto} deben reaccionar?`,
    datos: (rengD) => [['Ecuación', RENG_RP[rengD.p]![0].texto], [rengP(RENG_RP[rengD.p]!).texto, `${rengTx(rengD.n)} mol`]],
    pasos: (rengD, rengR0) => [`Razón: ${rengR(RENG_RP[rengD.p]!).coef} ${rengR(RENG_RP[rengD.p]!).texto} : ${rengP(RENG_RP[rengD.p]!).coef} ${rengP(RENG_RP[rengD.p]!).texto}.`, `n = ${rengTx(rengD.n)} × ${rengR(RENG_RP[rengD.p]!).coef}/${rengP(RENG_RP[rengD.p]!).coef} = ${rengTx(rengR0)} mol.`],
    pistas: ['El dato es del producto y buscas un reactivo.', 'El coeficiente del reactivo va arriba.', 'Multiplica los moles de producto por esa razón.']
  })
]

export const RENG_PRACTICAS_B07_S10: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s10-p1', subtema: 'n1-b7-s10', titulo: 'Masa de producto', dificultad: 'basica',
    objetivo: 'Calcular la masa de producto a partir de la masa de un reactivo pasando por moles.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'los cálculos masa-masa', 'masas'), idealizado: 'Reacción completa con los demás reactivos en exceso.', metodo: 'función del núcleo para el reactivo limitante y masa del producto',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RP.length), m: rengEntreN1(rengRng, 1, 100, 0.5) }),
    respuesta: (rengD) => (rengD.m / rengMmEst(rengR(RENG_RP[rengD.p]!).formula)) * (rengP(RENG_RP[rengD.p]!).coef / rengR(RENG_RP[rengD.p]!).coef) * rengMmEst(rengP(RENG_RP[rengD.p]!).formula),
    errores: (rengD) => [
      ['gramos-coef', 'Coeficientes sobre gramos', (rengD.m * rengP(RENG_RP[rengD.p]!).coef) / rengR(RENG_RP[rengD.p]!).coef, 'Aplicaste la razón de coeficientes directamente a los gramos. Hay que pasar antes a moles.'],
      ['sin-coef', 'Sin la razón molar', (rengD.m / rengMmEst(rengR(RENG_RP[rengD.p]!).formula)) * rengMmEst(rengP(RENG_RP[rengD.p]!).formula), 'Pasaste a moles y volviste a gramos, pero olvidaste la razón de coeficientes de la ecuación.']
    ],
    enunciado: (rengD) => `Según ${RENG_RP[rengD.p]![0].texto}, reaccionan ${rengTx(rengD.m)} g de ${rengR(RENG_RP[rengD.p]!).texto} con los demás reactivos en exceso.`,
    pregunta: (rengD) => `¿Qué masa de ${rengP(RENG_RP[rengD.p]!).texto} se forma, en g?`,
    datos: (rengD) => [['Ecuación', RENG_RP[rengD.p]![0].texto], rengDatoMasa(rengR(RENG_RP[rengD.p]!).formula), rengDatoMasa(rengP(RENG_RP[rengD.p]!).formula)],
    pasos: (rengD, rengR0) => [`n = ${rengTx(rengD.m)} / ${rengTx(rengMmEst(rengR(RENG_RP[rengD.p]!).formula), 5)} mol.`, `Razón ${rengP(RENG_RP[rengD.p]!).coef}/${rengR(RENG_RP[rengD.p]!).coef} y masa molar del producto: ${rengTx(rengR0)} g.`],
    pistas: ['Pasa la masa del reactivo a moles.', 'Aplica la razón molar.', 'Vuelve a gramos con la masa molar del producto.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s10-p2', subtema: 'n1-b7-s10', titulo: 'Masa de reactivo necesaria', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de reactivo necesaria para obtener una masa dada de producto.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'los cálculos masa-masa', 'masas'), idealizado: 'Reacción completa sin pérdidas.', metodo: 'conservación de la masa del elemento común o camino inverso con el núcleo',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RP.length), m: rengEntreN1(rengRng, 1, 100, 0.5) }),
    respuesta: (rengD) => (rengD.m / rengMmEst(rengP(RENG_RP[rengD.p]!).formula)) * (rengR(RENG_RP[rengD.p]!).coef / rengP(RENG_RP[rengD.p]!).coef) * rengMmEst(rengR(RENG_RP[rengD.p]!).formula),
    errores: (rengD) => [
      ['gramos-coef', 'Coeficientes sobre gramos', (rengD.m * rengR(RENG_RP[rengD.p]!).coef) / rengP(RENG_RP[rengD.p]!).coef, 'Aplicaste los coeficientes a los gramos. Pasa la masa de producto a moles antes de usar la razón.'],
      ['invertida', 'Razón molar invertida', (rengD.m / rengMmEst(rengP(RENG_RP[rengD.p]!).formula)) * (rengP(RENG_RP[rengD.p]!).coef / rengR(RENG_RP[rengD.p]!).coef) * rengMmEst(rengR(RENG_RP[rengD.p]!).formula), 'Invertiste la razón molar: para pasar de producto a reactivo, el coeficiente del reactivo va arriba.']
    ],
    enunciado: (rengD) => `Según ${RENG_RP[rengD.p]![0].texto}, se quieren obtener ${rengTx(rengD.m)} g de ${rengP(RENG_RP[rengD.p]!).texto}.`,
    pregunta: (rengD) => `¿Qué masa de ${rengR(RENG_RP[rengD.p]!).texto} debe reaccionar, en g?`,
    datos: (rengD) => [['Ecuación', RENG_RP[rengD.p]![0].texto], rengDatoMasa(rengP(RENG_RP[rengD.p]!).formula), rengDatoMasa(rengR(RENG_RP[rengD.p]!).formula)],
    pasos: (rengD, rengR0) => [`n(producto) = ${rengTx(rengD.m)} / ${rengTx(rengMmEst(rengP(RENG_RP[rengD.p]!).formula), 5)} mol.`, `n(reactivo) con la razón ${rengR(RENG_RP[rengD.p]!).coef}/${rengP(RENG_RP[rengD.p]!).coef}; masa = ${rengTx(rengR0)} g.`],
    pistas: ['Pasa la masa de producto a moles.', 'Razón molar con el reactivo arriba.', 'Masa molar del reactivo al final.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s10-p3', subtema: 'n1-b7-s10', titulo: 'Oxígeno que consume una combustión', dificultad: 'avanzada',
    objetivo: 'Calcular la masa de oxígeno consumida al quemar una masa de combustible.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'la estequiometría de la combustión', 'masas'), idealizado: 'Combustión completa.', metodo: 'conservación de la masa: productos menos combustible',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_COMBUSTIONES.length), m: rengEntreN1(rengRng, 1, 200, 1) }),
    respuesta: (rengD) => {
      const rengC = RENG_COMBUSTIONES[rengD.c]!
      return (rengD.m / rengMmEst(rengC.reactivos[0]!.formula)) * (rengC.reactivos[1]!.coef / rengC.reactivos[0]!.coef) * rengMmEst('O2')
    },
    errores: (rengD) => {
      const rengC = RENG_COMBUSTIONES[rengD.c]!
      return [
        ['sin-coef', 'Sin la razón molar', (rengD.m / rengMmEst(rengC.reactivos[0]!.formula)) * rengMmEst('O2'), 'Olvidaste la razón molar entre el oxígeno y el combustible.'],
        ['gramos-coef', 'Coeficientes sobre gramos', (rengD.m * rengC.reactivos[1]!.coef) / rengC.reactivos[0]!.coef, 'Aplicaste los coeficientes a los gramos sin pasar por moles.']
      ]
    },
    enunciado: (rengD) => `Se queman ${rengTx(rengD.m)} g de ${RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.texto}: ${RENG_COMBUSTIONES[rengD.c]!.texto}.`,
    pregunta: () => '¿Qué masa de O₂ se consume, en g?',
    datos: (rengD) => [['Ecuación', RENG_COMBUSTIONES[rengD.c]!.texto], rengDatoMasa(RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.formula), rengDatoMasa('O2')],
    pasos: (rengD, rengR0) => [`Moles de combustible: ${rengTx(rengD.m / rengMmEst(RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.formula), 4)} mol.`, `O₂: × ${RENG_COMBUSTIONES[rengD.c]!.reactivos[1]!.coef}/${RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.coef} y × M(O₂) = ${rengTx(rengR0)} g.`],
    pistas: ['Pasa el combustible a moles.', 'Usa la razón O₂ : combustible.', 'Vuelve a gramos con M(O₂).']
  })
]

export const RENG_PRACTICAS_B07_S11: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s11-p1', subtema: 'n1-b7-s11', titulo: 'Moles de producto desde una masa', dificultad: 'basica',
    objetivo: 'Calcular los moles de un producto a partir de la masa de un reactivo.', unidad: 'mol', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'los cálculos masa-mol', 'masas'), idealizado: 'Reacción completa con los demás reactivos en exceso.', metodo: 'función del núcleo para el reactivo limitante',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RP.length), m: rengEntreN1(rengRng, 1, 100, 0.5) }),
    respuesta: (rengD) => (rengD.m / rengMmEst(rengR(RENG_RP[rengD.p]!).formula)) * (rengP(RENG_RP[rengD.p]!).coef / rengR(RENG_RP[rengD.p]!).coef),
    errores: (rengD) => [
      ['sin-coef', 'Sin la razón molar', rengD.m / rengMmEst(rengR(RENG_RP[rengD.p]!).formula), 'Diste los moles del reactivo. Aplica la razón molar para obtener los del producto.'],
      ['masa-producto', 'Masa molar del producto', (rengD.m / rengMmEst(rengP(RENG_RP[rengD.p]!).formula)) * (rengP(RENG_RP[rengD.p]!).coef / rengR(RENG_RP[rengD.p]!).coef), 'Dividiste la masa del reactivo entre la masa molar del producto. La masa dada es del reactivo.']
    ],
    enunciado: (rengD) => `Según ${RENG_RP[rengD.p]![0].texto}, reaccionan ${rengTx(rengD.m)} g de ${rengR(RENG_RP[rengD.p]!).texto}.`,
    pregunta: (rengD) => `¿Cuántos moles de ${rengP(RENG_RP[rengD.p]!).texto} se forman?`,
    datos: (rengD) => [['Ecuación', RENG_RP[rengD.p]![0].texto], rengDatoMasa(rengR(RENG_RP[rengD.p]!).formula)],
    pasos: (rengD, rengR0) => [`n(reactivo) = ${rengTx(rengD.m)} / ${rengTx(rengMmEst(rengR(RENG_RP[rengD.p]!).formula), 5)}.`, `n(producto) = n(reactivo) × ${rengP(RENG_RP[rengD.p]!).coef}/${rengR(RENG_RP[rengD.p]!).coef} = ${rengTx(rengR0)} mol.`],
    pistas: ['Pasa la masa del reactivo a moles.', 'Aplica la razón molar.', 'No hace falta la masa molar del producto.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s11-p2', subtema: 'n1-b7-s11', titulo: 'Gramos de reactivo para unos moles de producto', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de reactivo necesaria para obtener unos moles dados de producto.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'los cálculos masa-mol', 'masas'), idealizado: 'Reacción completa sin pérdidas.', metodo: 'número de fórmulas unidad de reactivo por la masa de cada una',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RP.length), n: rengEntreN1(rengRng, 0.05, 5, 0.05) }),
    respuesta: (rengD) => rengD.n * (rengR(RENG_RP[rengD.p]!).coef / rengP(RENG_RP[rengD.p]!).coef) * rengMmEst(rengR(RENG_RP[rengD.p]!).formula),
    errores: (rengD) => [
      ['sin-coef', 'Sin la razón molar', rengD.n * rengMmEst(rengR(RENG_RP[rengD.p]!).formula), 'Usaste los moles de producto como si fueran de reactivo. Aplica antes la razón molar.'],
      ['invertida', 'Razón invertida', rengD.n * (rengP(RENG_RP[rengD.p]!).coef / rengR(RENG_RP[rengD.p]!).coef) * rengMmEst(rengR(RENG_RP[rengD.p]!).formula), 'Invertiste la razón molar: para pasar de producto a reactivo, el coeficiente del reactivo va arriba.']
    ],
    enunciado: (rengD) => `Según ${RENG_RP[rengD.p]![0].texto}, se quieren obtener ${rengTx(rengD.n)} mol de ${rengP(RENG_RP[rengD.p]!).texto}.`,
    pregunta: (rengD) => `¿Qué masa de ${rengR(RENG_RP[rengD.p]!).texto} hace falta, en g?`,
    datos: (rengD) => [['Ecuación', RENG_RP[rengD.p]![0].texto], [rengP(RENG_RP[rengD.p]!).texto, `${rengTx(rengD.n)} mol`], rengDatoMasa(rengR(RENG_RP[rengD.p]!).formula)],
    pasos: (rengD, rengR0) => [`n(reactivo) = ${rengTx(rengD.n)} × ${rengR(RENG_RP[rengD.p]!).coef}/${rengP(RENG_RP[rengD.p]!).coef}.`, `m = n · M = ${rengTx(rengR0)} g.`],
    pistas: ['Pasa de moles de producto a moles de reactivo.', 'El coeficiente del reactivo va arriba.', 'Multiplica por la masa molar del reactivo.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s11-p3', subtema: 'n1-b7-s11', titulo: 'Moles de gas desprendido', dificultad: 'avanzada',
    objetivo: 'Calcular los moles de gas que desprende una masa de sólido según su ecuación.', unidad: 'mol', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'los cálculos masa-mol', 'masas'), idealizado: 'Reacción completa del sólido.', metodo: 'función del núcleo para el reactivo limitante con el otro reactivo en exceso',
    parametros: (rengRng) => ({ g: rengIndice(rengRng, RENG_REACCIONES_GAS.length), m: rengEntreN1(rengRng, 0.5, 50, 0.5) }),
    respuesta: (rengD) => {
      const rengG = RENG_REACCIONES_GAS[rengD.g]!
      const rengCs = rengG.reaccion.reactivos.find((rengE) => rengE.formula === rengG.solido)!.coef
      const rengCg = rengG.reaccion.productos.find((rengE) => rengE.formula === rengG.gas)!.coef
      return (rengD.m / rengMmEst(rengG.solido)) * (rengCg / rengCs)
    },
    errores: (rengD) => {
      const rengG = RENG_REACCIONES_GAS[rengD.g]!
      const rengCs = rengG.reaccion.reactivos.find((rengE) => rengE.formula === rengG.solido)!.coef
      const rengCg = rengG.reaccion.productos.find((rengE) => rengE.formula === rengG.gas)!.coef
      return [
        ['masa-gas', 'Masa molar del gas', (rengD.m / rengMmEst(rengG.gas)) * (rengCg / rengCs), 'Dividiste la masa del sólido entre la masa molar del gas. La masa dada es del sólido.'],
        ['masa-gas-formado', 'Masa de gas en lugar de moles', (rengD.m / rengMmEst(rengG.solido)) * (rengCg / rengCs) * rengMmEst(rengG.gas), 'Calculaste la masa de gas que se desprende. La pregunta pide moles: no multipliques por la masa molar del gas.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto}, reaccionan por completo ${rengTx(rengD.m)} g de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.solido)}.`,
    pregunta: (rengD) => `¿Cuántos moles de ${rengTexto(RENG_REACCIONES_GAS[rengD.g]!.gas)} se desprenden?`,
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_GAS[rengD.g]!.reaccion.texto], rengDatoMasa(RENG_REACCIONES_GAS[rengD.g]!.solido)],
    pasos: (rengD, rengR0) => [`n(sólido) = ${rengTx(rengD.m)} / ${rengTx(rengMmEst(RENG_REACCIONES_GAS[rengD.g]!.solido), 5)} mol.`, `n(gas) = ${rengTx(rengR0)} mol con la razón de la ecuación.`],
    pistas: ['Pasa la masa del sólido a moles.', 'Busca la razón entre el gas y el sólido.', 'Multiplica por esa razón.']
  })
]

export const RENG_PRACTICAS_B07_S12: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s12-p1', subtema: 'n1-b7-s12', titulo: 'Volumen de otro gas', dificultad: 'basica',
    objetivo: 'Calcular el volumen de un gas que reacciona con otro, medidos a la misma P y T.', unidad: 'L', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'las relaciones de volumen entre gases', 'r'), idealizado: 'Gases ideales en las mismas condiciones.', metodo: 'moles con P·V = n·R·T a 25 °C y 1 atm, razón molar y vuelta a volumen',
    parametros: (rengRng) => ({ p: rengIndice(rengRng, RENG_RR_GAS.length), v: rengEntreN1(rengRng, 0.5, 50, 0.5) }),
    valida: (rengD) => rengR2(RENG_RR_GAS[rengD.p]!).coef !== rengR(RENG_RR_GAS[rengD.p]!).coef,
    respuesta: (rengD) => (rengD.v * rengR2(RENG_RR_GAS[rengD.p]!).coef) / rengR(RENG_RR_GAS[rengD.p]!).coef,
    errores: (rengD) => [
      ['uno-a-uno', 'Mismo volumen', rengD.v, 'Supusiste volúmenes iguales. A igual P y T, los volúmenes siguen a los coeficientes.'],
      ['invertida', 'Razón invertida', (rengD.v * rengR(RENG_RR_GAS[rengD.p]!).coef) / rengR2(RENG_RR_GAS[rengD.p]!).coef, 'Invertiste la razón de coeficientes.']
    ],
    enunciado: (rengD) => `Según ${RENG_RR_GAS[rengD.p]![0].texto}, reaccionan ${rengTx(rengD.v)} L de ${rengR(RENG_RR_GAS[rengD.p]!).texto}; todos los gases se miden a la misma presión y temperatura.`,
    pregunta: (rengD) => `¿Qué volumen de ${rengR2(RENG_RR_GAS[rengD.p]!).texto} reacciona, en L?`,
    datos: (rengD) => [['Ecuación', RENG_RR_GAS[rengD.p]![0].texto], [rengR(RENG_RR_GAS[rengD.p]!).texto, `${rengTx(rengD.v)} L`]],
    pasos: (rengD, rengR0) => ['A igual P y T, volumen ∝ moles.', `V = ${rengTx(rengD.v)} × ${rengR2(RENG_RR_GAS[rengD.p]!).coef}/${rengR(RENG_RR_GAS[rengD.p]!).coef} = ${rengTx(rengR0)} L.`],
    pistas: ['Trata los volúmenes como si fueran moles.', 'Usa la razón de coeficientes.', 'No hace falta ninguna masa molar.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s12-p2', subtema: 'n1-b7-s12', titulo: 'Aire necesario para una combustión', dificultad: 'intermedia',
    objetivo: 'Calcular el volumen de aire necesario para quemar un gas, sabiendo que el aire tiene un 21 % de O₂ en volumen.', unidad: 'L', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'la combustión con aire', 'r'), idealizado: 'Gases ideales en las mismas condiciones; aire con 21 % de O₂ en volumen (caso real del proyecto, bibliográfico declarado).', metodo: 'moles de oxígeno con la función del núcleo y volumen de aire que los contiene',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_COMBUSTIBLES_GAS.length), v: rengEntreN1(rengRng, 0.5, 20, 0.5) }),
    respuesta: (rengD) => {
      const rengC = RENG_COMBUSTIBLES_GAS[rengD.c]!
      return (rengD.v * rengC.reactivos[1]!.coef) / rengC.reactivos[0]!.coef / 0.21
    },
    errores: (rengD) => {
      const rengC = RENG_COMBUSTIBLES_GAS[rengD.c]!
      const rengO2 = (rengD.v * rengC.reactivos[1]!.coef) / rengC.reactivos[0]!.coef
      return [
        ['solo-oxigeno', 'Volumen de O₂, no de aire', rengO2, 'Calculaste el volumen de oxígeno. El aire solo tiene un 21 % de O₂: hace falta más volumen de aire.'],
        ['multiplica', 'Multiplicar por 0,21', rengO2 * 0.21, 'Multiplicaste por 0,21. Como el oxígeno es una parte del aire, hay que dividir entre 0,21.']
      ]
    },
    enunciado: (rengD) => `Se queman ${rengTx(rengD.v)} L de ${RENG_COMBUSTIBLES_GAS[rengD.c]!.reactivos[0]!.texto} (${RENG_COMBUSTIBLES_GAS[rengD.c]!.texto}). El aire tiene un 21 % de O₂ en volumen y todo se mide a la misma P y T.`,
    pregunta: () => '¿Qué volumen de aire hace falta como mínimo, en L?',
    datos: (rengD) => [['Ecuación', RENG_COMBUSTIBLES_GAS[rengD.c]!.texto], ['Combustible', `${rengTx(rengD.v)} L`], ['O₂ en el aire', '21 % en volumen']],
    pasos: (rengD, rengR0) => [`V(O₂) = ${rengTx(rengD.v)} × ${RENG_COMBUSTIBLES_GAS[rengD.c]!.reactivos[1]!.coef}/${RENG_COMBUSTIBLES_GAS[rengD.c]!.reactivos[0]!.coef} = ${rengTx(rengR0 * 0.21)} L.`, `V(aire) = V(O₂) / 0,21 = ${rengTx(rengR0)} L.`],
    pistas: ['Calcula primero el volumen de oxígeno.', 'El oxígeno es el 21 % del aire.', 'Divide el volumen de O₂ entre 0,21.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s12-p3', subtema: 'n1-b7-s12', titulo: 'Amoníaco de una mezcla de volúmenes', dificultad: 'avanzada',
    objetivo: 'Calcular el volumen de NH₃ que forma una mezcla de N₂ y H₂, identificando el reactivo limitante en volumen.', unidad: 'L', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'volúmenes y reactivo limitante', 'r'), idealizado: 'Reacción completa de gases ideales medidos igual.', metodo: 'función del núcleo para el reactivo limitante con los volúmenes como moles',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 2, 20, 0.5), b: rengEntreN1(rengRng, 3, 60, 0.5) }),
    valida: (rengD) => Math.abs(rengD.b / (3 * rengD.a) - 1) > 0.1,
    respuesta: (rengD) => (2 * Math.min(rengD.a / RENG_NH3.reactivos[0]!.coef, rengD.b / RENG_NH3.reactivos[1]!.coef) * RENG_NH3.productos[0]!.coef) / 2,
    errores: (rengD) => [
      ['exceso', 'Calcular con el reactivo en exceso', 2 * Math.max(rengD.a, rengD.b / 3), 'Calculaste con el gas que sobra. Compara volumen/coeficiente de los dos reactivos y usa el menor.'],
      ['sin-coef', 'Sin el coeficiente del NH₃', Math.min(rengD.a, rengD.b / 3), 'Olvidaste que se forman 2 volúmenes de NH₃ por cada avance de reacción.']
    ],
    enunciado: (rengD) => `Se mezclan ${rengTx(rengD.a)} L de N₂ y ${rengTx(rengD.b)} L de H₂ (misma P y T) y reaccionan por completo según ${RENG_NH3.texto}.`,
    pregunta: () => '¿Qué volumen de NH₃ se forma, medido igual, en L?',
    datos: (rengD) => [['N₂', `${rengTx(rengD.a)} L`], ['H₂', `${rengTx(rengD.b)} L`], ['Ecuación', RENG_NH3.texto]],
    pasos: (rengD, rengR0) => [`Cocientes: N₂ ${rengTx(rengD.a)}/1, H₂ ${rengTx(rengD.b)}/3 = ${rengTx(rengD.b / 3)}.`, `El menor marca el limitante; V(NH₃) = 2 × ${rengTx(Math.min(rengD.a, rengD.b / 3))} = ${rengTx(rengR0)} L.`],
    pistas: ['Trata los volúmenes como moles.', 'Divide cada volumen entre su coeficiente.', 'El menor cociente decide el producto.']
  })
]

export const RENG_PRACTICAS_B07_S13: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s13-p1', subtema: 'n1-b7-s13', titulo: 'Producto con dos cantidades en moles', dificultad: 'basica',
    objetivo: 'Identificar el limitante comparando moles/coeficiente y calcular los moles de producto.', unidad: 'mol', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el reactivo limitante'), idealizado: 'Reacción completa hasta agotar el limitante.', metodo: 'función del núcleo para el reactivo limitante',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_DOS_REACTIVOS.length), a: rengEntreN1(rengRng, 0.5, 10, 0.1), b: rengEntreN1(rengRng, 0.5, 10, 0.1) }),
    valida: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      return Math.abs(rengD.a / rengR0.reactivos[0]!.coef / (rengD.b / rengR0.reactivos[1]!.coef) - 1) > 0.15
    },
    respuesta: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      return Math.min(rengD.a / rengR0.reactivos[0]!.coef, rengD.b / rengR0.reactivos[1]!.coef) * rengR0.productos[0]!.coef
    },
    errores: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      const rengXa = rengD.a / rengR0.reactivos[0]!.coef
      const rengXb = rengD.b / rengR0.reactivos[1]!.coef
      return [
        ['exceso', 'Calcular con el reactivo en exceso', Math.max(rengXa, rengXb) * rengR0.productos[0]!.coef, 'Calculaste con el reactivo que sobra. El producto lo fija el limitante: el menor cociente moles/coeficiente.'],
        ['sin-dividir', 'Comparar moles sin coeficientes', Math.min(rengD.a, rengD.b) * rengR0.productos[0]!.coef, 'Comparaste los moles sin dividir entre los coeficientes de la ecuación.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto}, se mezclan ${rengTx(rengD.a)} mol de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.texto} y ${rengTx(rengD.b)} mol de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.texto}.`,
    pregunta: (rengD) => `¿Cuántos moles de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.productos[0]!.texto} se forman como máximo?`,
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto], [RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.texto, `${rengTx(rengD.a)} mol`], [RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.texto, `${rengTx(rengD.b)} mol`]],
    pasos: (rengD, rengR0) => [`Cocientes: ${rengTx(rengD.a / RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.coef)} y ${rengTx(rengD.b / RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.coef)}.`, `El menor es ξ; producto = ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.productos[0]!.coef} · ξ = ${rengTx(rengR0)} mol.`],
    pistas: ['Divide los moles de cada reactivo entre su coeficiente.', 'El menor cociente marca el limitante.', 'Multiplica ese cociente por el coeficiente del producto.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s13-p2', subtema: 'n1-b7-s13', titulo: 'Producto con dos masas', dificultad: 'intermedia',
    objetivo: 'Calcular la masa máxima de producto a partir de las masas de dos reactivos.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el reactivo limitante', 'masas'), idealizado: 'Reacción completa hasta agotar el limitante.', metodo: 'función del núcleo para el reactivo limitante y masa del producto',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_DOS_REACTIVOS.length), a: rengEntreN1(rengRng, 2, 80, 0.5), b: rengEntreN1(rengRng, 2, 80, 0.5) }),
    valida: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      return Math.abs(rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef / (rengD.b / rengMmEst(rengR0.reactivos[1]!.formula) / rengR0.reactivos[1]!.coef) - 1) > 0.15
    },
    respuesta: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      return Math.min(rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef, rengD.b / rengMmEst(rengR0.reactivos[1]!.formula) / rengR0.reactivos[1]!.coef) * rengR0.productos[0]!.coef * rengMmEst(rengR0.productos[0]!.formula)
    },
    errores: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      const rengXa = rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef
      const rengXb = rengD.b / rengMmEst(rengR0.reactivos[1]!.formula) / rengR0.reactivos[1]!.coef
      const rengMp = rengR0.productos[0]!.coef * rengMmEst(rengR0.productos[0]!.formula)
      return [
        ['exceso', 'Calcular con el reactivo en exceso', Math.max(rengXa, rengXb) * rengMp, 'Calculaste con el reactivo que sobra. El producto lo fija el limitante.'],
        ['sin-dividir', 'Comparar moles sin coeficientes', Math.min(rengD.a / rengMmEst(rengR0.reactivos[0]!.formula), rengD.b / rengMmEst(rengR0.reactivos[1]!.formula)) * rengMp, 'Comparaste los moles de los reactivos sin dividir entre sus coeficientes.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto}, se mezclan ${rengTx(rengD.a)} g de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.texto} y ${rengTx(rengD.b)} g de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.texto}.`,
    pregunta: (rengD) => `¿Qué masa de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.productos[0]!.texto} se forma como máximo, en g?`,
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto], rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.formula), rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.formula), rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.productos[0]!.formula)],
    pasos: (_rengD, rengR0) => ['Pasa las dos masas a moles y divide entre los coeficientes.', `Con el menor cociente: ${rengTx(rengR0)} g de producto.`],
    pistas: ['Pasa cada masa a moles.', 'Compara moles/coeficiente.', 'El limitante fija el producto.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s13-p3', subtema: 'n1-b7-s13', titulo: 'Segundo producto de una combustión con oxígeno limitado', dificultad: 'avanzada',
    objetivo: 'Calcular la masa de agua formada en una combustión cuando el limitante puede ser el combustible o el oxígeno.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el reactivo limitante', 'masas'), idealizado: 'Combustión completa (sin CO) hasta agotar el limitante.', metodo: 'función del núcleo para el reactivo limitante y masa del agua',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_COMBUSTIONES.length), a: rengEntreN1(rengRng, 2, 50, 0.5), b: rengEntreN1(rengRng, 5, 200, 1) }),
    valida: (rengD) => {
      const rengR0 = RENG_COMBUSTIONES[rengD.c]!
      return Math.abs(rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef / (rengD.b / rengMmEst('O2') / rengR0.reactivos[1]!.coef) - 1) > 0.15
    },
    respuesta: (rengD) => {
      const rengR0 = RENG_COMBUSTIONES[rengD.c]!
      const rengXi = Math.min(rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef, rengD.b / rengMmEst('O2') / rengR0.reactivos[1]!.coef)
      return rengXi * rengR0.productos.find((rengE) => rengE.formula === 'H2O')!.coef * rengMmEst('H2O')
    },
    errores: (rengD) => {
      const rengR0 = RENG_COMBUSTIONES[rengD.c]!
      const rengXa = rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef
      const rengXb = rengD.b / rengMmEst('O2') / rengR0.reactivos[1]!.coef
      const rengW = rengR0.productos.find((rengE) => rengE.formula === 'H2O')!.coef * rengMmEst('H2O')
      return [
        ['exceso', 'Calcular con el reactivo en exceso', Math.max(rengXa, rengXb) * rengW, 'Calculaste con el reactivo que sobra; el agua la fija el limitante.'],
        ['sin-coef-agua', 'Sin el coeficiente del agua', Math.min(rengXa, rengXb) * rengMmEst('H2O'), 'Usaste el avance de reacción sin multiplicar por el coeficiente del agua.']
      ]
    },
    enunciado: (rengD) => `Se queman ${rengTx(rengD.a)} g de ${RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.texto} con ${rengTx(rengD.b)} g de O₂: ${RENG_COMBUSTIONES[rengD.c]!.texto}.`,
    pregunta: () => '¿Qué masa de agua se forma como máximo, en g?',
    datos: (rengD) => [['Ecuación', RENG_COMBUSTIONES[rengD.c]!.texto], rengDatoMasa(RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.formula), rengDatoMasa('O2'), rengDatoMasa('H2O')],
    pasos: (_rengD, rengR0) => ['Calcula ξ = mín(n_combustible/ν, n_O₂/ν).', `Agua = ν(H₂O) · ξ · M(H₂O) = ${rengTx(rengR0)} g.`],
    pistas: ['Pasa las dos masas a moles.', 'Busca el limitante con los coeficientes.', 'Calcula el agua con el coeficiente del agua.']
  })
]

export const RENG_PRACTICAS_B07_S14: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s14-p1', subtema: 'n1-b7-s14', titulo: 'Moles que sobran', dificultad: 'basica',
    objetivo: 'Calcular los moles que quedan del reactivo en exceso.', unidad: 'mol', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el reactivo en exceso'), idealizado: 'Reacción completa hasta agotar el limitante.', metodo: 'función del núcleo para el reactivo limitante (sobrante)',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_DOS_REACTIVOS.length), a: rengEntreN1(rengRng, 0.5, 10, 0.1), b: rengEntreN1(rengRng, 0.5, 10, 0.1) }),
    valida: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      return Math.abs(rengD.a / rengR0.reactivos[0]!.coef / (rengD.b / rengR0.reactivos[1]!.coef) - 1) > 0.25
    },
    respuesta: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      const rengXi = Math.min(rengD.a / rengR0.reactivos[0]!.coef, rengD.b / rengR0.reactivos[1]!.coef)
      return Math.max(rengD.a - rengR0.reactivos[0]!.coef * rengXi, rengD.b - rengR0.reactivos[1]!.coef * rengXi)
    },
    errores: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      return [
        ['resta-directa', 'Restar los moles iniciales', Math.abs(rengD.a - rengD.b), 'Restaste los moles iniciales de los dos reactivos. Lo que sobra es lo inicial del exceso menos lo que consume el limitante según la razón molar.'],
        ['consumido', 'Dar lo consumido', (() => { const rengXi = Math.min(rengD.a / rengR0.reactivos[0]!.coef, rengD.b / rengR0.reactivos[1]!.coef); return rengD.a / rengR0.reactivos[0]!.coef > rengD.b / rengR0.reactivos[1]!.coef ? rengR0.reactivos[0]!.coef * rengXi : rengR0.reactivos[1]!.coef * rengXi })(), 'Diste la cantidad del exceso que reacciona; la pregunta pide la que sobra.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto}, se mezclan ${rengTx(rengD.a)} mol de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.texto} y ${rengTx(rengD.b)} mol de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.texto}.`,
    pregunta: () => '¿Cuántos moles del reactivo en exceso quedan sin reaccionar?',
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto], [RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.texto, `${rengTx(rengD.a)} mol`], [RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.texto, `${rengTx(rengD.b)} mol`]],
    pasos: (_rengD, rengR0) => ['Busca el limitante y el avance ξ.', `Sobra: inicial del exceso − ν · ξ = ${rengTx(rengR0)} mol.`],
    pistas: ['Primero identifica el limitante.', 'Calcula cuánto del exceso consume.', 'Resta de lo inicial.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s14-p2', subtema: 'n1-b7-s14', titulo: 'Gramos que sobran', dificultad: 'intermedia',
    objetivo: 'Calcular la masa que sobra del reactivo en exceso a partir de dos masas.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el reactivo en exceso', 'masas'), idealizado: 'Reacción completa hasta agotar el limitante.', metodo: 'conservación de la masa: inicial total menos productos formados',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_DOS_REACTIVOS.length), a: rengEntreN1(rengRng, 2, 80, 0.5), b: rengEntreN1(rengRng, 2, 80, 0.5) }),
    valida: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      return Math.abs(rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef / (rengD.b / rengMmEst(rengR0.reactivos[1]!.formula) / rengR0.reactivos[1]!.coef) - 1) > 0.25
    },
    respuesta: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      const [rengA, rengB] = rengR0.reactivos
      const rengXi = Math.min(rengD.a / rengMmEst(rengA!.formula) / rengA!.coef, rengD.b / rengMmEst(rengB!.formula) / rengB!.coef)
      return Math.max(rengD.a - rengXi * rengA!.coef * rengMmEst(rengA!.formula), rengD.b - rengXi * rengB!.coef * rengMmEst(rengB!.formula))
    },
    errores: (rengD) => [
      ['resta-directa', 'Restar las masas iniciales', Math.abs(rengD.a - rengD.b), 'Restaste las dos masas iniciales. Hay que calcular cuánto del exceso consume el limitante pasando por moles.'],
      ['en-moles', 'Dar el resultado en moles', (() => {
        const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
        const [rengA, rengB] = rengR0.reactivos
        const rengXi = Math.min(rengD.a / rengMmEst(rengA!.formula) / rengA!.coef, rengD.b / rengMmEst(rengB!.formula) / rengB!.coef)
        return Math.max(rengD.a / rengMmEst(rengA!.formula) - rengXi * rengA!.coef, rengD.b / rengMmEst(rengB!.formula) - rengXi * rengB!.coef)
      })(), 'Diste los moles que sobran. La pregunta pide gramos: multiplica por la masa molar del reactivo en exceso.']
    ],
    enunciado: (rengD) => `Según ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto}, se mezclan ${rengTx(rengD.a)} g de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.texto} y ${rengTx(rengD.b)} g de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.texto}.`,
    pregunta: () => '¿Qué masa del reactivo en exceso queda sin reaccionar, en g?',
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto], rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.formula), rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.formula)],
    pasos: (_rengD, rengR0) => ['Pasa a moles y busca el limitante.', `Masa que sobra del exceso = ${rengTx(rengR0)} g.`],
    pistas: ['Pasa las dos masas a moles.', 'Identifica el limitante y el avance.', 'Lo que sobra, vuelve a pasarlo a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s14-p3', subtema: 'n1-b7-s14', titulo: 'Cuánto limitante añadir para no desperdiciar', dificultad: 'avanzada',
    objetivo: 'Calcular la masa adicional del reactivo limitante necesaria para consumir todo el exceso.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'el reactivo en exceso', 'masas'), idealizado: 'Reacción completa.', metodo: 'masa del limitante necesaria para todo el exceso menos la que ya hay',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_DOS_REACTIVOS.length), a: rengEntreN1(rengRng, 2, 80, 0.5), b: rengEntreN1(rengRng, 2, 80, 0.5) }),
    valida: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      return Math.abs(rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef / (rengD.b / rengMmEst(rengR0.reactivos[1]!.formula) / rengR0.reactivos[1]!.coef) - 1) > 0.25
    },
    respuesta: (rengD) => {
      const [rengA, rengB] = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos
      const rengXa = rengD.a / rengMmEst(rengA!.formula) / rengA!.coef
      const rengXb = rengD.b / rengMmEst(rengB!.formula) / rengB!.coef
      return rengXa < rengXb ? (rengXb - rengXa) * rengA!.coef * rengMmEst(rengA!.formula) : (rengXa - rengXb) * rengB!.coef * rengMmEst(rengB!.formula)
    },
    errores: (rengD) => {
      const [rengA, rengB] = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos
      const rengXa = rengD.a / rengMmEst(rengA!.formula) / rengA!.coef
      const rengXb = rengD.b / rengMmEst(rengB!.formula) / rengB!.coef
      return [
        ['total', 'Masa total necesaria, no la adicional', rengXa < rengXb ? rengXb * rengA!.coef * rengMmEst(rengA!.formula) : rengXa * rengB!.coef * rengMmEst(rengB!.formula), 'Calculaste la masa total de limitante necesaria. Hay que restar la que ya se tiene para obtener la adicional.'],
        ['sobrante', 'Masa del exceso que sobra', rengXa < rengXb ? (rengXb - rengXa) * rengB!.coef * rengMmEst(rengB!.formula) : (rengXa - rengXb) * rengA!.coef * rengMmEst(rengA!.formula), 'Calculaste cuánto sobra del reactivo en exceso. La pregunta pide cuánto hay que añadir del limitante.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto}, se mezclan ${rengTx(rengD.a)} g de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.texto} y ${rengTx(rengD.b)} g de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.texto}.`,
    pregunta: () => '¿Qué masa adicional del reactivo limitante habría que añadir para que no sobre nada, en g?',
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto], rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.formula), rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.formula)],
    pasos: (_rengD, rengR0) => ['Identifica el limitante y cuánto exceso queda sin pareja.', `Limitante adicional para ese exceso: ${rengTx(rengR0)} g.`],
    pistas: ['Calcula los cocientes moles/coeficiente.', 'La diferencia de avances es lo que falta del limitante.', 'Pásalo a gramos del limitante.']
  })
]
