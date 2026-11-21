import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_ELECTROLITOS_MULTI_SOL, RENG_KF_SOL, RENG_SOLUTOS_ELECTROLITOS_SOL, RENG_SOLUTOS_SOL, RENG_TOL_SOL, RENG_TOL_SOL_PCT, rengDatoMasaSol, rengFuentesSol, rengIonDe, rengMmSol, rengTextoSol } from './b09-comun'
import { rengSolubilidadLineal } from './b09-s01-s07'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(9)
const M_AGUA = rengMmSol('H2O')
const rengIonI = (rengE: number, rengK: number) => rengIonDe(RENG_ELECTROLITOS_MULTI_SOL[rengE]!, rengK)
const rengElec = (rengI: number) => RENG_SOLUTOS_ELECTROLITOS_SOL[rengI]!

export const RENG_INTEGRADORES_B09: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-i1', subtema: RENG_GRUPO, subtemas: ['n1-b9-s2', 'n1-b9-s11'],
    titulo: 'Concentración de un ion a partir de la masa de sal', dificultad: 'basica',
    objetivo: 'Combinar la molaridad de una sal con el número de iones que libera por fórmula.', unidad: 'mmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'molaridad e iones en disolución', true), idealizado: 'Disociación completa y enrase exacto.', metodo: 'ion deducido por neutralidad eléctrica y molaridad con la función del núcleo',
    parametros: (rengRng) => ({ e: rengIndice(rengRng, RENG_ELECTROLITOS_MULTI_SOL.length), k: rengIndice(rengRng, 2), m: rengEntreN1(rengRng, 0.5, 30, 0.1), v: rengEntreN1(rengRng, 100, 2000, 50) }),
    valida: (rengD) => rengIonI(rengD.e, rengD.k).nu >= 2,
    respuesta: (rengD) => rengIonI(rengD.e, rengD.k).nu * (rengD.m / rengMmSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula) / (rengD.v / 1000)) * 1000,
    errores: (rengD) => [
      ['sin-subindice', 'Concentración de la sal', (rengD.m / rengMmSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula) / (rengD.v / 1000)) * 1000, 'Diste la concentración de la sal; multiplica por el número de esos iones en cada fórmula.'],
      ['todos', 'Todos los iones', (RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.nc + RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.na) * (rengD.m / rengMmSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula) / (rengD.v / 1000)) * 1000, 'Contaste todos los iones de la fórmula; la pregunta pide solo uno de ellos.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.m)} g de ${rengTextoSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula)}, electrolito fuerte, y se enrasa a ${rengTx(rengD.v)} mL.`,
    pregunta: (rengD) => `¿Cuál es la concentración de ${rengIonI(rengD.e, rengD.k).nombre}, en mmol/L?`,
    datos: (rengD) => [['Sal', `${rengTx(rengD.m)} g`], ['Volumen', `${rengTx(rengD.v)} mL`], rengDatoMasaSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula)],
    pasos: (rengD, rengR) => [`Molaridad de la sal (subtema 11): ${rengTx((rengD.m / rengMmSol(RENG_ELECTROLITOS_MULTI_SOL[rengD.e]!.formula) / (rengD.v / 1000)) * 1000)} mmol/L.`, `Cada fórmula da ${rengIonI(rengD.e, rengD.k).nu} ${rengIonI(rengD.e, rengD.k).nombre} (subtema 2): ${rengTx(rengR)} mmol/L.`],
    pistas: ['Calcula la molaridad de la sal.', 'Busca el subíndice del ion pedido.', 'Multiplica y expresa en mmol/L.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-i2', subtema: RENG_GRUPO, subtemas: ['n1-b9-s10', 'n1-b9-s15'],
    titulo: 'Del porcentaje masa-volumen a ppm', dificultad: 'basica',
    objetivo: 'Pasar una concentración muy pequeña en % m/v a ppm en una disolución acuosa diluida.', unidad: 'mg/kg', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'porcentajes y partes por millón'), idealizado: 'Agua diluida: 1 L ≈ 1 kg.', metodo: 'gramos por 100 mL pasados a mg por litro con el catálogo de unidades',
    parametros: (rengRng) => ({ p: rengEntreN1(rengRng, 0.0002, 0.05, 0.0001) }),
    respuesta: (rengD) => rengD.p * 1e4,
    errores: (rengD) => [
      ['por-100', 'Por 100', rengD.p * 100, 'Multiplicaste por 100; un 1 % m/v son 10 g/L, es decir, 10 000 mg/L ≈ 10 000 ppm.'],
      ['por-millon', 'Por un millón', rengD.p * 1e6, 'Multiplicaste por un millón; recuerda que el porcentaje ya está referido a 100 mL.']
    ],
    enunciado: (rengD) => `Un agua tratada contiene un ${rengTx(rengD.p)} % m/v de cloro libre (dato didáctico). En agua diluida, 1 L ≈ 1 kg.`,
    pregunta: () => '¿Cuántas ppm (mg/kg) son?',
    datos: (rengD) => [['% m/v', `${rengTx(rengD.p)} %`], ['Aproximación', '1 L de agua ≈ 1 kg']],
    pasos: (rengD, rengR) => [`${rengTx(rengD.p)} g por 100 mL = ${rengTx(rengD.p * 10)} g por litro (subtema 10).`, `= ${rengTx(rengR)} mg/L ≈ ${rengTx(rengR)} ppm (subtema 15).`],
    pistas: ['Pasa de 100 mL a 1 L.', 'Pasa los gramos a miligramos.', 'En agua diluida, mg/L ≈ ppm.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-i3', subtema: RENG_GRUPO, subtemas: ['n1-b9-s11', 'n1-b9-s17', 'n1-b9-s19'],
    titulo: 'De una pesada a una dilución', dificultad: 'intermedia',
    objetivo: 'Preparar una disolución madre por pesada y calcular la alícuota para diluirla a otra concentración.', unidad: 'mL', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'preparación y dilución', true), idealizado: 'Reactivo puro, enrases exactos.', metodo: 'molaridad de la madre con la función del núcleo y función de dilución del núcleo',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), m: rengEntreN1(rengRng, 2, 60, 0.5), v0: rengEntreN1(rengRng, 100, 500, 50), c2: rengEntreN1(rengRng, 0.005, 0.2, 0.005), v2: rengEntreN1(rengRng, 50, 1000, 50) }),
    valida: (rengD) => {
      const rengC1 = rengD.m / rengMmSol(RENG_SOLUTOS_SOL[rengD.s]!.formula) / (rengD.v0 / 1000)
      return rengD.c2 < rengC1 / 2 && (rengD.c2 * rengD.v2) / rengC1 >= 1
    },
    respuesta: (rengD) => (rengD.c2 * rengD.v2) / (rengD.m / rengMmSol(RENG_SOLUTOS_SOL[rengD.s]!.formula) / (rengD.v0 / 1000)),
    errores: (rengD) => {
      const rengC1 = rengD.m / rengMmSol(RENG_SOLUTOS_SOL[rengD.s]!.formula) / (rengD.v0 / 1000)
      return [
        ['invertida', 'Concentraciones invertidas', (rengC1 * rengD.v2) / rengD.c2, 'Invertiste las concentraciones al despejar; la alícuota de la madre concentrada es pequeña.'],
        ['sin-masa-molar', 'Madre en g/L', (rengD.c2 * rengD.v2) / (rengD.m / (rengD.v0 / 1000)), 'Usaste la concentración de la madre en g/L; pásala a mol/L con la masa molar.']
      ]
    },
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.m)} g de ${RENG_SOLUTOS_SOL[rengD.s]!.nombre} (${rengTextoSol(RENG_SOLUTOS_SOL[rengD.s]!.formula)}) y se enrasa a ${rengTx(rengD.v0)} mL. Con esa disolución madre se quieren preparar ${rengTx(rengD.v2)} mL de disolución ${rengTx(rengD.c2)} mol/L.`,
    pregunta: () => '¿Qué volumen de disolución madre hay que tomar, en mL?',
    datos: (rengD) => [['Pesada', `${rengTx(rengD.m)} g en ${rengTx(rengD.v0)} mL`], ['Deseada', `${rengTx(rengD.v2)} mL de ${rengTx(rengD.c2)} mol/L`], rengDatoMasaSol(RENG_SOLUTOS_SOL[rengD.s]!.formula)],
    pasos: (rengD, rengR) => [`Madre (subtemas 11 y 19): ${rengTx(rengD.m / rengMmSol(RENG_SOLUTOS_SOL[rengD.s]!.formula) / (rengD.v0 / 1000), 4)} mol/L.`, `Alícuota (subtema 17): V₁ = c₂·V₂/c₁ = ${rengTx(rengR)} mL.`],
    pistas: ['Calcula la molaridad de la madre.', 'Usa c₁·V₁ = c₂·V₂.', 'Despeja el volumen de madre.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-i4', subtema: RENG_GRUPO, subtemas: ['n1-b9-s12', 'n1-b9-s20'],
    titulo: 'Descenso crioscópico a partir de la molaridad', dificultad: 'intermedia',
    objetivo: 'Convertir molaridad en molalidad con la densidad y aplicar ΔT_f = K_f·b·i.', unidad: 'K', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.4', 'molalidad y descenso crioscópico', true), idealizado: 'Disolución diluida ideal, disociación completa, K_f y densidad didácticas.', metodo: 'función del núcleo de molaridad a molalidad y ΔT_f = K_f·b·i',
    sinVerificar: ['K_f = 1,86 K·kg/mol para el agua es un valor de uso común no contrastado con una fuente en esta entrega.'],
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_ELECTROLITOS_SOL.length), c: rengEntreN1(rengRng, 0.1, 2, 0.05), rho: rengEntreN1(rengRng, 1, 1.15, 0.005) }),
    valida: (rengD) => rengD.rho - (rengD.c * rengMmSol(rengElec(rengD.s).formula)) / 1000 > 0.8,
    respuesta: (rengD) => RENG_KF_SOL * (rengD.c / (rengD.rho - (rengD.c * rengMmSol(rengElec(rengD.s).formula)) / 1000)) * rengElec(rengD.s).i,
    errores: (rengD) => {
      const rengB = rengD.c / (rengD.rho - (rengD.c * rengMmSol(rengElec(rengD.s).formula)) / 1000)
      return [
        ['molaridad', 'Con la molaridad', RENG_KF_SOL * rengD.c * rengElec(rengD.s).i, 'Usaste la molaridad; la fórmula del descenso usa molalidad, que hay que calcular con la densidad.'],
        ['sin-i', 'Sin el factor i', RENG_KF_SOL * rengB, 'Olvidaste el factor i: un electrolito fuerte aporta varias partículas por fórmula.']
      ]
    },
    enunciado: (rengD) => `Una disolución de ${rengElec(rengD.s).nombre} (${rengTextoSol(rengElec(rengD.s).formula)}, electrolito fuerte) es ${rengTx(rengD.c)} mol/L con densidad ${rengTx(rengD.rho, 4)} g/mL (dato didáctico). K_f = ${rengTx(RENG_KF_SOL)} K·kg/mol (didáctica).`,
    pregunta: () => '¿Cuánto desciende el punto de congelación, en K?',
    datos: (rengD) => [['c', `${rengTx(rengD.c)} mol/L`], ['Densidad', `${rengTx(rengD.rho, 4)} g/mL`], rengDatoMasaSol(rengElec(rengD.s).formula), ['i', String(rengElec(rengD.s).i)]],
    pasos: (rengD, rengR) => [`Molalidad (subtema 12): ${rengTx(rengD.c / (rengD.rho - (rengD.c * rengMmSol(rengElec(rengD.s).formula)) / 1000), 4)} mol/kg.`, `ΔT_f = K_f·b·i (subtema 20) = ${rengTx(rengR)} K.`],
    pistas: ['Pasa la molaridad a molalidad con la densidad.', 'Busca el factor i del electrolito.', 'Aplica ΔT_f = K_f · b · i.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-i5', subtema: RENG_GRUPO, subtemas: ['n1-b9-s4', 'n1-b9-s7', 'n1-b9-s8'],
    titulo: 'Composición de las aguas madres tras cristalizar', dificultad: 'avanzada',
    objetivo: 'Calcular el porcentaje en masa de la disolución que queda tras enfriar y cristalizar una disolución saturada.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('11.3', 'cristalización y composición'), idealizado: 'Curva de solubilidad lineal didáctica; cristalización completa.', metodo: 'función del núcleo para el porcentaje en masa con 250 g de agua a la temperatura final',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 5, 40, 1), b: rengEntreN1(rengRng, 0.3, 1.5, 0.05), T1: rengEntreN1(rengRng, 60, 95, 5), T2: rengEntreN1(rengRng, 0, 30, 5) }),
    respuesta: (rengD) => {
      const rengS2 = rengSolubilidadLineal(rengD.a, rengD.b, rengD.T2)
      return (rengS2 / (100 + rengS2)) * 100
    },
    errores: (rengD) => {
      const rengS1 = rengSolubilidadLineal(rengD.a, rengD.b, rengD.T1)
      const rengS2 = rengSolubilidadLineal(rengD.a, rengD.b, rengD.T2)
      return [
        ['antes', 'Antes de enfriar', (rengS1 / (100 + rengS1)) * 100, 'Calculaste el porcentaje antes de enfriar; tras cristalizar, la disolución queda saturada a la temperatura baja.'],
        ['solubilidad', 'Solubilidad como porcentaje', rengS2, 'Tomaste la solubilidad en frío como porcentaje en masa; se refiere a 100 g de agua, no de disolución.']
      ]
    },
    enunciado: (rengD) => `Una disolución saturada de una sal hipotética a ${rengTx(rengD.T1)} °C se enfría a ${rengTx(rengD.T2)} °C y cristaliza el exceso. Solubilidad: S = ${rengTx(rengD.a)} + ${rengTx(rengD.b)}·t (g/100 g de agua, t en °C; modelo didáctico).`,
    pregunta: () => '¿Qué porcentaje en masa de sal tiene la disolución que queda (aguas madres)?',
    datos: (rengD) => [['Curva', `S = ${rengTx(rengD.a)} + ${rengTx(rengD.b)}·t`], ['Enfriamiento', `${rengTx(rengD.T1)} °C → ${rengTx(rengD.T2)} °C`]],
    pasos: (rengD, rengR) => [`Tras cristalizar queda saturada a ${rengTx(rengD.T2)} °C (subtemas 4 y 7): S = ${rengTx(rengSolubilidadLineal(rengD.a, rengD.b, rengD.T2))} g/100 g.`, `% m/m = S/(100 + S) × 100 = ${rengTx(rengR)} % (subtema 8).`],
    pistas: ['¿Cómo queda la disolución tras cristalizar?', 'Usa la solubilidad a la temperatura final.', 'Pásala a porcentaje en masa.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-i6', subtema: RENG_GRUPO, subtemas: ['n1-b9-s8', 'n1-b9-s13'],
    titulo: 'Del porcentaje en masa al porcentaje molar', dificultad: 'avanzada',
    objetivo: 'Convertir el porcentaje en masa de una disolución en la fracción molar del soluto expresada en %.', unidad: '%', tolerancia: RENG_TOL_SOL_PCT,
    fuentes: rengFuentesSol('3.4', 'conversión entre unidades de concentración', true), idealizado: 'Disolución acuosa de dos componentes.', metodo: 'función del núcleo para las fracciones molares con una muestra de 250 g',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), p: rengEntreN1(rengRng, 5, 60, 0.5) }),
    respuesta: (rengD) => {
      const rengNs = rengD.p / rengMmSol(RENG_SOLUTOS_SOL[rengD.s]!.formula)
      return (rengNs / (rengNs + (100 - rengD.p) / M_AGUA)) * 100
    },
    errores: (rengD) => {
      const rengNs = rengD.p / rengMmSol(RENG_SOLUTOS_SOL[rengD.s]!.formula)
      return [
        ['masas', 'Porcentaje en masa', rengD.p, 'Tomaste el porcentaje en masa como porcentaje molar; hay que pasar cada masa a moles.'],
        ['sobre-agua', 'Entre los moles de agua', (rengNs / ((100 - rengD.p) / M_AGUA)) * 100, 'Dividiste entre los moles de agua; el denominador son los moles totales.']
      ]
    },
    enunciado: (rengD) => `Una disolución acuosa de ${RENG_SOLUTOS_SOL[rengD.s]!.nombre} (${rengTextoSol(RENG_SOLUTOS_SOL[rengD.s]!.formula)}) tiene un ${rengTx(rengD.p)} % en masa.`,
    pregunta: () => '¿Cuál es el porcentaje molar del soluto (fracción molar × 100)?',
    datos: (rengD) => [['% m/m', `${rengTx(rengD.p)} %`], rengDatoMasaSol(RENG_SOLUTOS_SOL[rengD.s]!.formula), rengDatoMasaSol('H2O')],
    pasos: (rengD, rengR) => [`En 100 g: ${rengTx(rengD.p)} g de soluto y ${rengTx(100 - rengD.p)} g de agua (subtema 8).`, `x × 100 = ${rengTx(rengR)} % (subtema 13).`],
    pistas: ['Toma 100 g de disolución.', 'Pasa cada masa a moles.', 'Divide los del soluto entre el total.']
  })
]
