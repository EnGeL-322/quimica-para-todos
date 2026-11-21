import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_FACTORES_DILUCION_SOL, RENG_HIDRATOS_SOL, RENG_IONES_AGUA_SOL, RENG_KF_SOL, RENG_REACTIVOS_LAB_SOL, RENG_SOLUTOS_SOL, RENG_TOL_SOL, RENG_VOLUMENES_MATRAZ_SOL, rengDatoMasaSol, rengFuentesSol, rengMasaHidratoSol, rengMmSol, rengTextoHidratoSol, rengTextoSol } from './b09-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const rengSol = (rengI: number) => RENG_SOLUTOS_SOL[rengI]!
const rengMs = (rengI: number): number => rengMmSol(RENG_SOLUTOS_SOL[rengI]!.formula)
const rengIon = (rengI: number) => RENG_IONES_AGUA_SOL[rengI]!
export const RENG_SALES_CLORURO_SOL: ReadonlyArray<{ formula: string; nu: number }> = [{ formula: 'CaCl2', nu: 2 }, { formula: 'MgCl2', nu: 2 }, { formula: 'AlCl3', nu: 3 }, { formula: 'FeCl3', nu: 3 }]

export const RENG_PRACTICAS_B09_S15: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s15-p1', subtema: 'n1-b9-s15', titulo: 'Concentración en partes por millón', dificultad: 'basica',
    objetivo: 'Calcular la concentración en ppm a partir de los miligramos de soluto y los kilogramos de disolución.', unidad: 'mg/kg', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'las partes por millón'), idealizado: 'Datos didácticos de una muestra de agua.', metodo: 'función del núcleo para ppm con las masas pasadas a gramos por el catálogo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_IONES_AGUA_SOL.length), mg: rengEntreN1(rengRng, 0.05, 50, 0.05), kg: rengEntreN1(rengRng, 0.5, 20, 0.5) }),
    respuesta: (rengD) => rengD.mg / rengD.kg,
    errores: (rengD) => [
      ['multiplica', 'Multiplicar', rengD.mg * rengD.kg, 'Multiplicaste en lugar de dividir: ppm son miligramos de soluto por kilogramo de disolución.'],
      ['por-mil', 'Factor de mil', (rengD.mg / rengD.kg) * 1000, 'Aplicaste un factor 1000 de más: mg/kg ya son ppm.']
    ],
    enunciado: (rengD) => `Una muestra de ${rengTx(rengD.kg)} kg de agua contiene ${rengTx(rengD.mg)} mg de ${rengIon(rengD.i).nombre} (datos didácticos).`,
    pregunta: () => '¿Cuál es su concentración en ppm (mg/kg)?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.mg)} mg`], ['Agua', `${rengTx(rengD.kg)} kg`]],
    pasos: (rengD, rengR) => ['1 ppm = 1 mg de soluto por kg de disolución.', `ppm = ${rengTx(rengD.mg)} / ${rengTx(rengD.kg)} = ${rengTx(rengR)}.`],
    pistas: ['Recuerda: 1 ppm = 1 mg/kg.', 'Divide miligramos entre kilogramos.', 'No hace falta ningún factor más.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s15-p2', subtema: 'n1-b9-s15', titulo: 'Masa de soluto a partir de las ppm', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de soluto que contiene un volumen de agua diluida de concentración conocida en ppm.', unidad: 'mg', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'las partes por millón'), idealizado: 'Agua diluida: 1 L ≈ 1 kg.', metodo: 'ppm convertidas a fracción en masa por el catálogo y multiplicadas por la masa de agua en mg',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_IONES_AGUA_SOL.length), c: rengEntreN1(rengRng, 0.1, 20, 0.1), v: rengEntreN1(rengRng, 0.5, 500, 0.5) }),
    respuesta: (rengD) => rengD.c * rengD.v,
    errores: (rengD) => [
      ['divide', 'Dividir', rengD.c / rengD.v, 'Dividiste entre el volumen; la masa es la concentración por los kilogramos de agua.'],
      ['gramos', 'Resultado en gramos', (rengD.c * rengD.v) / 1000, 'Ese número son gramos; la pregunta pide miligramos (1 ppm = 1 mg/kg).']
    ],
    enunciado: (rengD) => `Un agua contiene ${rengTx(rengD.c)} ppm de ${rengIon(rengD.i).nombre} (dato didáctico). Se toman ${rengTx(rengD.v)} L; en agua diluida, 1 L ≈ 1 kg.`,
    pregunta: (rengD) => `¿Cuántos miligramos de ${rengIon(rengD.i).nombre} contienen?`,
    datos: (rengD) => [['Concentración', `${rengTx(rengD.c)} ppm`], ['Volumen', `${rengTx(rengD.v)} L ≈ ${rengTx(rengD.v)} kg`]],
    pasos: (rengD, rengR) => [`${rengTx(rengD.c)} ppm = ${rengTx(rengD.c)} mg por kg.`, `m = ${rengTx(rengD.c)} × ${rengTx(rengD.v)} = ${rengTx(rengR)} mg.`],
    pistas: ['1 ppm = 1 mg/kg.', 'En agua diluida, 1 L ≈ 1 kg.', 'Multiplica la concentración por la masa.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s15-p3', subtema: 'n1-b9-s15', titulo: 'De ppm a concentración molar', dificultad: 'avanzada',
    objetivo: 'Convertir una concentración en ppm de un ion en agua diluida a µmol/L.', unidad: 'µmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'la conversión de ppm a molaridad', true), idealizado: 'Agua diluida: 1 L ≈ 1 kg.', metodo: 'miligramos por litro pasados a gramos con el catálogo, molaridad del núcleo y conversión a µmol/L',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_IONES_AGUA_SOL.length), c: rengEntreN1(rengRng, 0.1, 20, 0.1) }),
    respuesta: (rengD) => (rengD.c / rengMmSol(rengIon(rengD.i).formula)) * 1000,
    errores: (rengD) => [
      ['multiplica', 'Multiplicar por M', rengD.c * rengMmSol(rengIon(rengD.i).formula), 'Multiplicaste por la masa molar; para pasar de masa a moles se divide.'],
      ['mmol', 'En mmol/L', rengD.c / rengMmSol(rengIon(rengD.i).formula), 'Ese valor está en mmol/L; la pregunta pide µmol/L, mil veces más.']
    ],
    enunciado: (rengD) => `Un agua contiene ${rengTx(rengD.c)} ppm de ${rengIon(rengD.i).nombre} (dato didáctico). En agua diluida, 1 L ≈ 1 kg.`,
    pregunta: () => '¿Cuál es la concentración de ese ion, en µmol/L?',
    datos: (rengD) => [['Concentración', `${rengTx(rengD.c)} ppm ≈ ${rengTx(rengD.c)} mg/L`], rengDatoMasaSol(rengIon(rengD.i).formula)],
    pasos: (rengD, rengR) => [`${rengTx(rengD.c)} mg/L / ${rengTx(rengMmSol(rengIon(rengD.i).formula), 5)} g/mol = ${rengTx(rengD.c / rengMmSol(rengIon(rengD.i).formula), 4)} mmol/L.`, `En µmol/L: ${rengTx(rengR)}.`],
    pistas: ['1 ppm ≈ 1 mg/L en agua diluida.', 'Divide los mg entre la masa molar.', 'mmol/L por 1000 son µmol/L.']
  })
]

export const RENG_PRACTICAS_B09_S16: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s16-p1', subtema: 'n1-b9-s16', titulo: 'De ppm a ppb', dificultad: 'basica',
    objetivo: 'Convertir una concentración de partes por millón a partes por mil millones.', unidad: 'µg/kg', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'las partes por mil millones'), idealizado: 'Concentraciones en masa.', metodo: 'conversión de mg/kg a µg/kg con el catálogo de unidades',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.001, 0.9, 0.001) }),
    respuesta: (rengD) => rengD.c * 1000,
    errores: (rengD) => [
      ['divide', 'Dividir entre 1000', rengD.c / 1000, 'Dividiste entre 1000; para pasar de ppm a ppb hay que multiplicar.'],
      ['millon', 'Por un millón', rengD.c * 1e6, 'Multiplicaste por un millón; 1 ppm son 1000 ppb.']
    ],
    enunciado: (rengD) => `Un análisis da ${rengTx(rengD.c)} ppm de un contaminante en agua (dato didáctico).`,
    pregunta: () => '¿Cuántas ppb (µg/kg) son?',
    datos: (rengD) => [['Concentración', `${rengTx(rengD.c)} ppm`], ['Equivalencia', '1 ppm = 1000 ppb']],
    pasos: (rengD, rengR) => ['1 ppm = 1 mg/kg = 1000 µg/kg = 1000 ppb.', `${rengTx(rengD.c)} × 1000 = ${rengTx(rengR)} ppb.`],
    pistas: ['¿Cuántas ppb hay en 1 ppm?', 'Pasar a una unidad menor da un número mayor.', 'Multiplica por 1000.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s16-p2', subtema: 'n1-b9-s16', titulo: 'Concentración en partes por mil millones', dificultad: 'intermedia',
    objetivo: 'Calcular la concentración en ppb a partir de los microgramos de soluto y los kilogramos de muestra.', unidad: 'µg/kg', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'las partes por mil millones'), idealizado: 'Datos didácticos de una muestra.', metodo: 'ppm con la función del núcleo (masas en gramos por el catálogo) multiplicadas por 1000',
    parametros: (rengRng) => ({ ug: rengEntreN1(rengRng, 0.5, 500, 0.5), kg: rengEntreN1(rengRng, 0.5, 50, 0.5) }),
    respuesta: (rengD) => rengD.ug / rengD.kg,
    errores: (rengD) => [
      ['multiplica', 'Multiplicar', rengD.ug * rengD.kg, 'Multiplicaste en lugar de dividir: ppb son microgramos por kilogramo.'],
      ['ppm', 'En ppm', rengD.ug / rengD.kg / 1000, 'Ese valor está en ppm; en ppb es mil veces mayor (1 ppm = 1000 ppb).']
    ],
    enunciado: (rengD) => `Una muestra de ${rengTx(rengD.kg)} kg de agua contiene ${rengTx(rengD.ug)} µg de un metal (datos didácticos).`,
    pregunta: () => '¿Cuál es su concentración en ppb (µg/kg)?',
    datos: (rengD) => [['Metal', `${rengTx(rengD.ug)} µg`], ['Agua', `${rengTx(rengD.kg)} kg`]],
    pasos: (rengD, rengR) => ['1 ppb = 1 µg por kg.', `ppb = ${rengTx(rengD.ug)} / ${rengTx(rengD.kg)} = ${rengTx(rengR)}.`],
    pistas: ['1 ppb = 1 µg/kg.', 'Divide microgramos entre kilogramos.', 'No hace falta ningún factor más.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s16-p3', subtema: 'n1-b9-s16', titulo: 'Contaminante en un depósito', dificultad: 'avanzada',
    objetivo: 'Calcular la masa total de un contaminante en un gran volumen de agua a partir de su concentración en ppb.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.4', 'las partes por mil millones'), idealizado: 'Agua diluida: 1 m³ ≈ 1000 kg.', metodo: 'microgramos totales pasados a gramos con el catálogo de unidades',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 1, 50, 0.5), v: rengEntreN1(rengRng, 1000, 50000, 500) }),
    respuesta: (rengD) => (rengD.c * rengD.v * 1000) / 1e6,
    errores: (rengD) => [
      ['m3-como-kg', 'Metros cúbicos como kilogramos', (rengD.c * rengD.v) / 1e6, 'Tomaste los metros cúbicos como kilogramos; 1 m³ de agua son unos 1000 kg.'],
      ['microgramos', 'En microgramos', rengD.c * rengD.v * 1000, 'Ese número son microgramos; pásalo a gramos dividiendo entre un millón.']
    ],
    enunciado: (rengD) => `Un depósito contiene ${rengTx(rengD.v)} m³ de agua con ${rengTx(rengD.c)} ppb de un contaminante (datos didácticos). En agua diluida, 1 m³ ≈ 1000 kg.`,
    pregunta: () => '¿Qué masa total de contaminante hay, en g?',
    datos: (rengD) => [['Agua', `${rengTx(rengD.v)} m³`], ['Concentración', `${rengTx(rengD.c)} ppb`]],
    pasos: (rengD, rengR) => [`Masa de agua: ${rengTx(rengD.v * 1000)} kg.`, `Contaminante: ${rengTx(rengD.c)} µg/kg × ${rengTx(rengD.v * 1000)} kg = ${rengTx(rengR)} g.`],
    pistas: ['Pasa los m³ a kilogramos.', '1 ppb = 1 µg por kg.', 'Pasa los µg a gramos.']
  })
]

export const RENG_PRACTICAS_B09_S17: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s17-p1', subtema: 'n1-b9-s17', titulo: 'Concentración tras una dilución', dificultad: 'basica',
    objetivo: 'Calcular la concentración final de una dilución con c₁·V₁ = c₂·V₂.', unidad: 'mmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la dilución de disoluciones'), idealizado: 'Enrase exacto al volumen final.', metodo: 'función de dilución del núcleo',
    parametros: (rengRng) => ({ c1: rengEntreN1(rengRng, 50, 2000, 10), v1: rengEntreN1(rengRng, 5, 50, 0.5), f: rengIndice(rengRng, RENG_FACTORES_DILUCION_SOL.length) }),
    respuesta: (rengD) => rengD.c1 / RENG_FACTORES_DILUCION_SOL[rengD.f]!,
    errores: (rengD) => {
      const rengV2 = rengD.v1 * RENG_FACTORES_DILUCION_SOL[rengD.f]!
      return [
        ['agua', 'Con el agua añadida', (rengD.c1 * rengD.v1) / (rengV2 - rengD.v1), 'Usaste el volumen de agua añadida; V₂ es el volumen final de la disolución.'],
        ['invertida', 'Proporción invertida', (rengD.c1 * rengV2) / rengD.v1, 'Invertiste la proporción: al diluir la concentración baja.']
      ]
    },
    enunciado: (rengD) => `Se toman ${rengTx(rengD.v1)} mL de una disolución ${rengTx(rengD.c1)} mmol/L y se enrasan con agua hasta ${rengTx(rengD.v1 * RENG_FACTORES_DILUCION_SOL[rengD.f]!)} mL.`,
    pregunta: () => '¿Cuál es la concentración final, en mmol/L?',
    datos: (rengD) => [['c₁', `${rengTx(rengD.c1)} mmol/L`], ['V₁', `${rengTx(rengD.v1)} mL`], ['V₂ (final)', `${rengTx(rengD.v1 * RENG_FACTORES_DILUCION_SOL[rengD.f]!)} mL`]],
    pasos: (rengD, rengR) => ['La cantidad de soluto no cambia: c₁·V₁ = c₂·V₂.', `c₂ = ${rengTx(rengR)} mmol/L.`],
    pistas: ['¿Cambia la cantidad de soluto al añadir agua?', 'c₁·V₁ = c₂·V₂.', 'V₂ es el volumen final.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s17-p2', subtema: 'n1-b9-s17', titulo: 'Alícuota para una dilución', dificultad: 'intermedia',
    objetivo: 'Calcular el volumen de disolución madre que hay que diluir para obtener una concentración y un volumen dados.', unidad: 'mL', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la dilución de disoluciones'), idealizado: 'Enrase exacto al volumen final.', metodo: 'función de dilución del núcleo despejando V₁',
    parametros: (rengRng) => ({ c1: rengEntreN1(rengRng, 0.5, 12, 0.1), c2: rengEntreN1(rengRng, 0.01, 2, 0.01), v2: rengEntreN1(rengRng, 50, 1000, 50) }),
    valida: (rengD) => rengD.c2 <= rengD.c1 / 2,
    respuesta: (rengD) => (rengD.c2 * rengD.v2) / rengD.c1,
    errores: (rengD) => [
      ['invertida', 'Concentraciones invertidas', (rengD.c1 * rengD.v2) / rengD.c2, 'Invertiste las concentraciones: la alícuota de la disolución concentrada es pequeña.'],
      ['agua', 'Agua a añadir', rengD.v2 - (rengD.c2 * rengD.v2) / rengD.c1, 'Calculaste el agua que se añade; la pregunta pide el volumen de disolución madre.']
    ],
    enunciado: (rengD) => `Se quieren ${rengTx(rengD.v2)} mL de disolución ${rengTx(rengD.c2)} mol/L a partir de una disolución madre ${rengTx(rengD.c1)} mol/L.`,
    pregunta: () => '¿Qué volumen de disolución madre hay que tomar, en mL?',
    datos: (rengD) => [['Madre', `${rengTx(rengD.c1)} mol/L`], ['Deseada', `${rengTx(rengD.v2)} mL de ${rengTx(rengD.c2)} mol/L`]],
    pasos: (rengD, rengR) => ['c₁·V₁ = c₂·V₂ → V₁ = c₂·V₂ / c₁.', `V₁ = ${rengTx(rengR)} mL; se enrasa hasta ${rengTx(rengD.v2)} mL.`],
    pistas: ['Los moles de la alícuota son los finales.', 'Despeja V₁ de c₁·V₁ = c₂·V₂.', 'V₁ debe ser menor que V₂.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s17-p3', subtema: 'n1-b9-s17', titulo: 'Diluciones en serie', dificultad: 'avanzada',
    objetivo: 'Calcular la concentración final de dos diluciones seguidas multiplicando sus factores.', unidad: 'mmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'las diluciones en serie'), idealizado: 'Enrases exactos.', metodo: 'función de dilución del núcleo aplicada dos veces',
    parametros: (rengRng) => ({ c0: rengEntreN1(rengRng, 0.1, 5, 0.05), a: rengEntreN1(rengRng, 1, 25, 1), f1: rengIndice(rengRng, RENG_FACTORES_DILUCION_SOL.length), b: rengEntreN1(rengRng, 1, 25, 1), f2: rengIndice(rengRng, RENG_FACTORES_DILUCION_SOL.length) }),
    respuesta: (rengD) => (rengD.c0 / (RENG_FACTORES_DILUCION_SOL[rengD.f1]! * RENG_FACTORES_DILUCION_SOL[rengD.f2]!)) * 1000,
    errores: (rengD) => [
      ['suma', 'Factores sumados', (rengD.c0 / (RENG_FACTORES_DILUCION_SOL[rengD.f1]! + RENG_FACTORES_DILUCION_SOL[rengD.f2]!)) * 1000, 'Sumaste los factores de dilución; en una serie se multiplican.'],
      ['un-paso', 'Solo un paso', (rengD.c0 / RENG_FACTORES_DILUCION_SOL[rengD.f1]!) * 1000, 'Aplicaste solo la primera dilución; la segunda vuelve a dividir la concentración.']
    ],
    enunciado: (rengD) => `Una disolución ${rengTx(rengD.c0)} mol/L se diluye: ${rengTx(rengD.a)} mL se llevan a ${rengTx(rengD.a * RENG_FACTORES_DILUCION_SOL[rengD.f1]!)} mL. De esta, ${rengTx(rengD.b)} mL se llevan a ${rengTx(rengD.b * RENG_FACTORES_DILUCION_SOL[rengD.f2]!)} mL.`,
    pregunta: () => '¿Cuál es la concentración final, en mmol/L?',
    datos: (rengD) => [['c inicial', `${rengTx(rengD.c0)} mol/L`], ['Paso 1', `${rengTx(rengD.a)} → ${rengTx(rengD.a * RENG_FACTORES_DILUCION_SOL[rengD.f1]!)} mL`], ['Paso 2', `${rengTx(rengD.b)} → ${rengTx(rengD.b * RENG_FACTORES_DILUCION_SOL[rengD.f2]!)} mL`]],
    pasos: (rengD, rengR) => [`Factores: ${RENG_FACTORES_DILUCION_SOL[rengD.f1]} y ${RENG_FACTORES_DILUCION_SOL[rengD.f2]}; total ${RENG_FACTORES_DILUCION_SOL[rengD.f1]! * RENG_FACTORES_DILUCION_SOL[rengD.f2]!}.`, `c = ${rengTx(rengR)} mmol/L.`],
    pistas: ['Calcula el factor de cada paso.', 'Los factores de una serie se multiplican.', 'Pasa el resultado a mmol/L.']
  })
]

export const RENG_PRACTICAS_B09_S18: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s18-p1', subtema: 'n1-b9-s18', titulo: 'Concentración de una mezcla', dificultad: 'basica',
    objetivo: 'Calcular la concentración al mezclar dos disoluciones del mismo soluto con volúmenes aditivos.', unidad: 'mmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la mezcla de disoluciones'), idealizado: 'Mismo soluto, sin reacción y volúmenes aditivos.', metodo: 'cada disolución diluida al volumen total con la función del núcleo y suma de las concentraciones',
    parametros: (rengRng) => ({ c1: rengEntreN1(rengRng, 50, 2000, 10), v1: rengEntreN1(rengRng, 20, 500, 10), c2: rengEntreN1(rengRng, 50, 2000, 10), v2: rengEntreN1(rengRng, 20, 500, 10) }),
    respuesta: (rengD) => (rengD.c1 * rengD.v1 + rengD.c2 * rengD.v2) / (rengD.v1 + rengD.v2),
    errores: (rengD) => [
      ['media', 'Media simple', (rengD.c1 + rengD.c2) / 2, 'Hiciste la media simple; cada disolución pesa según su volumen.'],
      ['suma', 'Suma de concentraciones', rengD.c1 + rengD.c2, 'Sumaste las concentraciones; hay que sumar los moles y dividir entre el volumen total.']
    ],
    enunciado: (rengD) => `Se mezclan ${rengTx(rengD.v1)} mL de una disolución de KCl ${rengTx(rengD.c1)} mmol/L con ${rengTx(rengD.v2)} mL de otra de KCl ${rengTx(rengD.c2)} mmol/L. Los volúmenes se suponen aditivos.`,
    pregunta: () => '¿Cuál es la concentración de KCl en la mezcla, en mmol/L?',
    datos: (rengD) => [['Disolución 1', `${rengTx(rengD.v1)} mL, ${rengTx(rengD.c1)} mmol/L`], ['Disolución 2', `${rengTx(rengD.v2)} mL, ${rengTx(rengD.c2)} mmol/L`]],
    pasos: (rengD, rengR) => [`Milimoles totales: ${rengTx((rengD.c1 * rengD.v1 + rengD.c2 * rengD.v2) / 1000)} mmol en ${rengTx(rengD.v1 + rengD.v2)} mL.`, `c = ${rengTx(rengR)} mmol/L.`],
    pistas: ['Calcula los moles de cada disolución.', 'Suma los moles y los volúmenes.', 'Divide moles totales entre volumen total.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s18-p2', subtema: 'n1-b9-s18', titulo: 'Cloruro en una mezcla de dos sales', dificultad: 'intermedia',
    objetivo: 'Calcular la concentración de un ion común al mezclar dos electrolitos que lo aportan con distinto subíndice.', unidad: 'mmol/L', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la mezcla de disoluciones'), idealizado: 'Disociación completa y volúmenes aditivos.', metodo: 'milimoles de cloruro de cada disolución sumados y divididos por el volumen total en litros del catálogo',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SALES_CLORURO_SOL.length), c1: rengEntreN1(rengRng, 50, 1000, 10), v1: rengEntreN1(rengRng, 20, 500, 10), c2: rengEntreN1(rengRng, 50, 1000, 10), v2: rengEntreN1(rengRng, 20, 500, 10) }),
    respuesta: (rengD) => (rengD.c1 * rengD.v1 + RENG_SALES_CLORURO_SOL[rengD.s]!.nu * rengD.c2 * rengD.v2) / (rengD.v1 + rengD.v2),
    errores: (rengD) => [
      ['sin-subindice', 'Sin el subíndice', (rengD.c1 * rengD.v1 + rengD.c2 * rengD.v2) / (rengD.v1 + rengD.v2), `Olvidaste que cada fórmula de ${rengTextoSol(RENG_SALES_CLORURO_SOL[rengD.s]!.formula)} aporta ${RENG_SALES_CLORURO_SOL[rengD.s]!.nu} cloruros.`],
      ['media', 'Media simple', (rengD.c1 + RENG_SALES_CLORURO_SOL[rengD.s]!.nu * rengD.c2) / 2, 'Hiciste la media simple de las concentraciones de cloruro; cada disolución pesa según su volumen.']
    ],
    enunciado: (rengD) => `Se mezclan ${rengTx(rengD.v1)} mL de NaCl ${rengTx(rengD.c1)} mmol/L con ${rengTx(rengD.v2)} mL de ${rengTextoSol(RENG_SALES_CLORURO_SOL[rengD.s]!.formula)} ${rengTx(rengD.c2)} mmol/L, ambas sales electrolitos fuertes. Volúmenes aditivos.`,
    pregunta: () => '¿Cuál es la concentración de Cl⁻ en la mezcla, en mmol/L?',
    datos: (rengD) => [['NaCl', `${rengTx(rengD.v1)} mL, ${rengTx(rengD.c1)} mmol/L`], [rengTextoSol(RENG_SALES_CLORURO_SOL[rengD.s]!.formula), `${rengTx(rengD.v2)} mL, ${rengTx(rengD.c2)} mmol/L`]],
    pasos: (rengD, rengR) => [`Cloruro: ${rengTx(rengD.c1 * rengD.v1 / 1000)} mmol del NaCl y ${rengTx(RENG_SALES_CLORURO_SOL[rengD.s]!.nu * rengD.c2 * rengD.v2 / 1000)} mmol de la otra sal.`, `[Cl⁻] = ${rengTx(rengR)} mmol/L.`],
    pistas: ['¿Cuántos Cl⁻ aporta cada fórmula de cada sal?', 'Suma los moles de cloruro.', 'Divide entre el volumen total.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s18-p3', subtema: 'n1-b9-s18', titulo: 'Volumen para una mezcla de concentración dada', dificultad: 'avanzada',
    objetivo: 'Calcular el volumen de una segunda disolución que hay que añadir para obtener una concentración intermedia.', unidad: 'mL', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la mezcla de disoluciones'), idealizado: 'Mismo soluto y volúmenes aditivos.', metodo: 'búsqueda por bisección del volumen que da la concentración pedida',
    parametros: (rengRng) => ({ c1: rengEntreN1(rengRng, 0.5, 3, 0.05), v1: rengEntreN1(rengRng, 50, 500, 10), c2: rengEntreN1(rengRng, 0.05, 0.4, 0.01), c: rengEntreN1(rengRng, 0.1, 2.5, 0.01) }),
    valida: (rengD) => rengD.c > rengD.c2 + 0.15 * (rengD.c1 - rengD.c2) && rengD.c < rengD.c1 - 0.15 * (rengD.c1 - rengD.c2),
    respuesta: (rengD) => (rengD.v1 * (rengD.c1 - rengD.c)) / (rengD.c - rengD.c2),
    errores: (rengD) => [
      ['invertida', 'Diferencias invertidas', (rengD.v1 * (rengD.c - rengD.c2)) / (rengD.c1 - rengD.c), 'Invertiste las diferencias de concentración; plantea los moles totales igual a c por el volumen total.'],
      ['sin-v1', 'Sin el volumen inicial', (rengD.c1 - rengD.c) / (rengD.c - rengD.c2), 'Olvidaste multiplicar por el volumen de la primera disolución.']
    ],
    enunciado: (rengD) => `Se tienen ${rengTx(rengD.v1)} mL de una disolución ${rengTx(rengD.c1)} mol/L y otra del mismo soluto ${rengTx(rengD.c2)} mol/L. Se quiere una mezcla ${rengTx(rengD.c)} mol/L (volúmenes aditivos).`,
    pregunta: (rengD) => `¿Qué volumen de la disolución ${rengTx(rengD.c2)} mol/L hay que añadir, en mL?`,
    datos: (rengD) => [['Disolución 1', `${rengTx(rengD.v1)} mL, ${rengTx(rengD.c1)} mol/L`], ['Disolución 2', `${rengTx(rengD.c2)} mol/L`], ['Objetivo', `${rengTx(rengD.c)} mol/L`]],
    pasos: (rengD, rengR) => [`${rengTx(rengD.c1)}·${rengTx(rengD.v1)} + ${rengTx(rengD.c2)}·V = ${rengTx(rengD.c)}·(${rengTx(rengD.v1)} + V).`, `V = ${rengTx(rengR)} mL.`],
    pistas: ['Escribe los moles de cada disolución.', 'Iguala a la concentración de la mezcla.', 'Despeja el volumen desconocido.']
  })
]

export const RENG_PRACTICAS_B09_S19: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s19-p1', subtema: 'n1-b9-s19', titulo: 'Masa que hay que pesar', dificultad: 'basica',
    objetivo: 'Calcular la masa de soluto que hay que pesar para preparar un volumen de disolución de molaridad dada.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la preparación de disoluciones', true), idealizado: 'Reactivo puro y enrase exacto.', metodo: 'búsqueda por bisección de la masa con la función de molaridad del núcleo',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), c: rengEntreN1(rengRng, 0.05, 2, 0.01), v: rengIndice(rengRng, RENG_VOLUMENES_MATRAZ_SOL.length) }),
    respuesta: (rengD) => rengD.c * (RENG_VOLUMENES_MATRAZ_SOL[rengD.v]! / 1000) * rengMs(rengD.s),
    errores: (rengD) => [
      ['ml', 'Volumen en mL', rengD.c * RENG_VOLUMENES_MATRAZ_SOL[rengD.v]! * rengMs(rengD.s), 'Usaste el volumen en mL sin pasar a litros.'],
      ['moles', 'Moles en lugar de gramos', rengD.c * (RENG_VOLUMENES_MATRAZ_SOL[rengD.v]! / 1000), 'Diste los moles; multiplícalos por la masa molar para saber qué pesar.']
    ],
    enunciado: (rengD) => `Se quieren preparar ${RENG_VOLUMENES_MATRAZ_SOL[rengD.v]} mL de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}) ${rengTx(rengD.c)} mol/L en un matraz aforado.`,
    pregunta: () => '¿Qué masa de soluto hay que pesar, en g?',
    datos: (rengD) => [['Volumen', `${RENG_VOLUMENES_MATRAZ_SOL[rengD.v]} mL`], ['c', `${rengTx(rengD.c)} mol/L`], rengDatoMasaSol(rengSol(rengD.s).formula)],
    pasos: (rengD, rengR) => [`n = c·V = ${rengTx(rengD.c * (RENG_VOLUMENES_MATRAZ_SOL[rengD.v]! / 1000), 4)} mol.`, `m = n·M = ${rengTx(rengR)} g; se disuelve y se enrasa.`],
    pistas: ['Calcula los moles necesarios.', 'Pasa los moles a gramos.', 'El volumen es el final del matraz.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s19-p2', subtema: 'n1-b9-s19', titulo: 'Preparar una disolución con un hidrato', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de un hidrato que hay que pesar para preparar una disolución de su sal anhidra.', unidad: 'g', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la preparación de disoluciones con hidratos', true), idealizado: 'Hidrato puro con su agua estequiométrica.', metodo: 'búsqueda por bisección de la masa de hidrato con la función de molaridad del núcleo',
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDRATOS_SOL.length), c: rengEntreN1(rengRng, 0.02, 1, 0.01), v: rengIndice(rengRng, RENG_VOLUMENES_MATRAZ_SOL.length) }),
    respuesta: (rengD) => rengD.c * (RENG_VOLUMENES_MATRAZ_SOL[rengD.v]! / 1000) * rengMasaHidratoSol(RENG_HIDRATOS_SOL[rengD.h]!),
    errores: (rengD) => [
      ['anhidro', 'Masa molar del anhidro', rengD.c * (RENG_VOLUMENES_MATRAZ_SOL[rengD.v]! / 1000) * rengMmSol(RENG_HIDRATOS_SOL[rengD.h]![0]), 'Usaste la masa molar de la sal anhidra; lo que se pesa es el hidrato, con su agua.'],
      ['ml', 'Volumen en mL', rengD.c * RENG_VOLUMENES_MATRAZ_SOL[rengD.v]! * rengMasaHidratoSol(RENG_HIDRATOS_SOL[rengD.h]!), 'Usaste el volumen en mililitros; pásalo a litros antes de multiplicar.']
    ],
    enunciado: (rengD) => `Se quieren ${RENG_VOLUMENES_MATRAZ_SOL[rengD.v]} mL de ${rengTextoSol(RENG_HIDRATOS_SOL[rengD.h]![0])} ${rengTx(rengD.c)} mol/L usando el hidrato ${rengTextoHidratoSol(RENG_HIDRATOS_SOL[rengD.h]!)}.`,
    pregunta: () => '¿Qué masa de hidrato hay que pesar, en g?',
    datos: (rengD) => [['Volumen', `${RENG_VOLUMENES_MATRAZ_SOL[rengD.v]} mL`], ['c', `${rengTx(rengD.c)} mol/L`], [`Masa fórmula de ${rengTextoHidratoSol(RENG_HIDRATOS_SOL[rengD.h]!)}`, `${rengTx(rengMasaHidratoSol(RENG_HIDRATOS_SOL[rengD.h]!), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`n = ${rengTx(rengD.c * (RENG_VOLUMENES_MATRAZ_SOL[rengD.v]! / 1000), 4)} mol; cada mol de hidrato aporta un mol de sal.`, `m = n × masa fórmula del hidrato = ${rengTx(rengR)} g.`],
    pistas: ['Calcula los moles de sal necesarios.', 'Cada fórmula de hidrato aporta una de sal.', 'Usa la masa fórmula del hidrato.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s19-p3', subtema: 'n1-b9-s19', titulo: 'Preparar una disolución desde un reactivo concentrado', dificultad: 'avanzada',
    objetivo: 'Calcular el volumen de reactivo concentrado (dado en % y densidad) para preparar una disolución diluida.', unidad: 'mL', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('3.3', 'la preparación por dilución de un reactivo', true), idealizado: 'Porcentaje y densidad didácticos; enrase exacto.', metodo: 'relación del núcleo c = 10·%·ρ/M y función de dilución del núcleo',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACTIVOS_LAB_SOL.length), p: rengEntreN1(rengRng, 10, 70, 0.5), rho: rengEntreN1(rengRng, 1.05, 1.85, 0.01), c2: rengEntreN1(rengRng, 0.05, 2, 0.01), v: rengIndice(rengRng, RENG_VOLUMENES_MATRAZ_SOL.length) }),
    valida: (rengD) => {
      const rengC1 = (10 * rengD.p * rengD.rho) / rengMmSol(RENG_REACTIVOS_LAB_SOL[rengD.r]!.formula)
      return rengD.c2 < rengC1 / 3
    },
    respuesta: (rengD) => (rengD.c2 * RENG_VOLUMENES_MATRAZ_SOL[rengD.v]!) / ((10 * rengD.p * rengD.rho) / rengMmSol(RENG_REACTIVOS_LAB_SOL[rengD.r]!.formula)),
    errores: (rengD) => [
      ['sin-densidad', 'Sin la densidad', (rengD.c2 * RENG_VOLUMENES_MATRAZ_SOL[rengD.v]!) / ((10 * rengD.p) / rengMmSol(RENG_REACTIVOS_LAB_SOL[rengD.r]!.formula)), 'Calculaste la concentración del reactivo sin su densidad; 1 mL no pesa 1 g.'],
      ['sin-porcentaje', 'Reactivo como soluto puro', ((rengD.c2 * RENG_VOLUMENES_MATRAZ_SOL[rengD.v]!) / 1000) * rengMmSol(RENG_REACTIVOS_LAB_SOL[rengD.r]!.formula) / rengD.rho, 'Supusiste que el reactivo es soluto puro; solo una parte de su masa, el porcentaje, es soluto.']
    ],
    enunciado: (rengD) => `Se quieren ${RENG_VOLUMENES_MATRAZ_SOL[rengD.v]} mL de ${RENG_REACTIVOS_LAB_SOL[rengD.r]!.nombre} ${rengTx(rengD.c2)} mol/L a partir de un reactivo al ${rengTx(rengD.p)} % en masa y densidad ${rengTx(rengD.rho)} g/mL (datos didácticos).`,
    pregunta: () => '¿Qué volumen de reactivo concentrado hay que medir, en mL?',
    datos: (rengD) => [['Deseada', `${RENG_VOLUMENES_MATRAZ_SOL[rengD.v]} mL de ${rengTx(rengD.c2)} mol/L`], ['Reactivo', `${rengTx(rengD.p)} %, ${rengTx(rengD.rho)} g/mL`], rengDatoMasaSol(RENG_REACTIVOS_LAB_SOL[rengD.r]!.formula)],
    pasos: (rengD, rengR) => [`Concentración del reactivo: ${rengTx((10 * rengD.p * rengD.rho) / rengMmSol(RENG_REACTIVOS_LAB_SOL[rengD.r]!.formula), 4)} mol/L.`, `V₁ = c₂·V₂ / c₁ = ${rengTx(rengR)} mL.`],
    pistas: ['Calcula la molaridad del reactivo concentrado.', 'Usa c₁·V₁ = c₂·V₂.', 'Despeja el volumen de reactivo.']
  })
]

export const RENG_PRACTICAS_B09_S20: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b9-s20-p1', subtema: 'n1-b9-s20', titulo: 'Descenso del punto de congelación', dificultad: 'basica',
    objetivo: 'Calcular el descenso del punto de congelación con ΔT_f = K_f·b·i.', unidad: 'K', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.4', 'el descenso del punto de congelación'), idealizado: 'Disolución diluida ideal; disociación completa; K_f didáctica.', metodo: 'punto de congelación en °C con el catálogo y diferencia con 0 °C',
    sinVerificar: ['K_f = 1,86 K·kg/mol para el agua es un valor de uso común no contrastado con una fuente en esta entrega.'],
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), b: rengEntreN1(rengRng, 0.05, 3, 0.05) }),
    respuesta: (rengD) => RENG_KF_SOL * rengD.b * rengSol(rengD.s).i,
    errores: (rengD) => [
      ['sin-kf', 'Sin K_f', rengD.b * rengSol(rengD.s).i, 'Olvidaste multiplicar por K_f, la constante crioscópica del agua.'],
      ['divide', 'Dividir entre la molalidad', (RENG_KF_SOL * rengSol(rengD.s).i) / rengD.b, 'Dividiste entre la molalidad; el descenso es proporcional a ella.']
    ],
    enunciado: (rengD) => `Una disolución acuosa de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}${rengSol(rengD.s).i > 1 ? ', electrolito fuerte con disociación completa' : ', no electrolito'}) tiene una molalidad de ${rengTx(rengD.b)} mol/kg. K_f(agua) = ${rengTx(RENG_KF_SOL)} K·kg/mol (parámetro didáctico).`,
    pregunta: () => '¿Cuánto desciende el punto de congelación, en K?',
    datos: (rengD) => [['Soluto', rengTextoSol(rengSol(rengD.s).formula)], ['b', `${rengTx(rengD.b)} mol/kg`], ['K_f', `${rengTx(RENG_KF_SOL)} K·kg/mol`]],
    pasos: (rengD, rengR) => [`Partículas por fórmula: i = ${rengSol(rengD.s).i}.`, `ΔT_f = ${rengTx(RENG_KF_SOL)} × ${rengTx(rengD.b)} × ${rengSol(rengD.s).i} = ${rengTx(rengR)} K.`],
    pistas: ['¿Cuántas partículas da cada fórmula?', 'ΔT_f = K_f · b · i.', 'La molalidad ya está dada.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s20-p2', subtema: 'n1-b9-s20', titulo: 'Descenso crioscópico a partir de las masas', dificultad: 'intermedia',
    objetivo: 'Calcular la molalidad a partir de las masas y con ella el descenso del punto de congelación.', unidad: 'K', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.4', 'el descenso del punto de congelación', true), idealizado: 'Disolución diluida ideal; disociación completa; K_f didáctica.', metodo: 'molalidad con la función del núcleo y ΔT_f = K_f·b·i',
    sinVerificar: ['K_f = 1,86 K·kg/mol para el agua es un valor de uso común no contrastado con una fuente en esta entrega.'],
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SOLUTOS_SOL.length), m: rengEntreN1(rengRng, 2, 100, 0.5), md: rengEntreN1(rengRng, 100, 2000, 50) }),
    respuesta: (rengD) => RENG_KF_SOL * (rengD.m / rengMs(rengD.s) / (rengD.md / 1000)) * rengSol(rengD.s).i,
    errores: (rengD) => [
      ['gramos', 'Agua en gramos', (RENG_KF_SOL * (rengD.m / rengMs(rengD.s) / rengD.md)) * rengSol(rengD.s).i, 'Dejaste la masa de agua en gramos; la molalidad usa kilogramos.'],
      ['disolucion', 'Con la masa de disolución', RENG_KF_SOL * (rengD.m / rengMs(rengD.s) / ((rengD.m + rengD.md) / 1000)) * rengSol(rengD.s).i, 'Usaste la masa de disolución; la molalidad es por kilogramo de disolvente.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.m)} g de ${rengSol(rengD.s).nombre} (${rengTextoSol(rengSol(rengD.s).formula)}${rengSol(rengD.s).i > 1 ? ', electrolito fuerte' : ', no electrolito'}) en ${rengTx(rengD.md)} g de agua. K_f = ${rengTx(RENG_KF_SOL)} K·kg/mol (didáctica).`,
    pregunta: () => '¿Cuánto desciende el punto de congelación, en K?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.m)} g`], ['Agua', `${rengTx(rengD.md)} g`], rengDatoMasaSol(rengSol(rengD.s).formula), ['i', String(rengSol(rengD.s).i)]],
    pasos: (rengD, rengR) => [`b = ${rengTx(rengD.m / rengMs(rengD.s) / (rengD.md / 1000), 4)} mol/kg.`, `ΔT_f = K_f · b · i = ${rengTx(rengR)} K.`],
    pistas: ['Calcula la molalidad.', 'Usa el factor i del soluto.', 'ΔT_f = K_f · b · i.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b9-s20-p3', subtema: 'n1-b9-s20', titulo: 'Masa molar por crioscopia', dificultad: 'avanzada',
    objetivo: 'Calcular la masa molar de un no electrolito a partir del descenso de su punto de congelación.', unidad: 'g/mol', tolerancia: RENG_TOL_SOL,
    fuentes: rengFuentesSol('11.4', 'la determinación de masas molares'), idealizado: 'Disolución diluida ideal de un no electrolito; K_f didáctica.', metodo: 'búsqueda por bisección de la masa molar que reproduce el descenso medido',
    sinVerificar: ['K_f = 1,86 K·kg/mol para el agua es un valor de uso común no contrastado con una fuente en esta entrega.'],
    parametros: (rengRng) => ({ ms: rengEntreN1(rengRng, 1, 50, 0.5), md: rengEntreN1(rengRng, 50, 1000, 10), dT: rengEntreN1(rengRng, 0.1, 5, 0.01) }),
    valida: (rengD) => {
      const rengM = (rengD.ms * RENG_KF_SOL) / (rengD.dT * (rengD.md / 1000))
      return rengM >= 40 && rengM <= 600
    },
    respuesta: (rengD) => (rengD.ms * RENG_KF_SOL) / (rengD.dT * (rengD.md / 1000)),
    errores: (rengD) => [
      ['sin-kf', 'Sin K_f', rengD.ms / (rengD.dT * (rengD.md / 1000)), 'Olvidaste K_f: la molalidad es ΔT_f / K_f.'],
      ['gramos', 'Agua en gramos', (rengD.ms * RENG_KF_SOL) / (rengD.dT * rengD.md), 'Usaste la masa de agua en gramos; pásala a kilogramos.']
    ],
    enunciado: (rengD) => `Al disolver ${rengTx(rengD.ms)} g de un no electrolito en ${rengTx(rengD.md)} g de agua, el punto de congelación baja ${rengTx(rengD.dT)} K (datos didácticos). K_f = ${rengTx(RENG_KF_SOL)} K·kg/mol.`,
    pregunta: () => '¿Cuál es la masa molar del soluto, en g/mol?',
    datos: (rengD) => [['Soluto', `${rengTx(rengD.ms)} g`], ['Agua', `${rengTx(rengD.md)} g`], ['ΔT_f', `${rengTx(rengD.dT)} K`]],
    pasos: (rengD, rengR) => [`b = ΔT_f / K_f = ${rengTx(rengD.dT / RENG_KF_SOL, 4)} mol/kg; n = b · ${rengTx(rengD.md / 1000)} kg.`, `M = masa / n = ${rengTx(rengR)} g/mol.`],
    pistas: ['Despeja la molalidad de ΔT_f = K_f·b.', 'Calcula los moles con la masa de agua.', 'Masa molar = masa / moles.']
  })
]

