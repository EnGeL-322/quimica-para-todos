import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_AE_KJ, RENG_RADIO_ION_PM } from '../escenas-n1/modelos/tendencias-periodicas'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_TOL_TP, RENG_TRIADAS_TP, rengATp, rengEiTp, rengEnTp, rengFuentesTp, rengGrupoTp, rengNombreTp, rengRadioTp, rengValenciaTp } from './b03-comun'
import { RENG_IONES_RADIO_TP, rengIonTp } from './b03-s09-s16'
import { RENG_CON_AE_TP } from './b03-s17-s23'
import { rengMNo, rengTxtNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(3)
const tx = rengTx
const T = rengTxtNo
const A = rengATp
const M = rengMNo
const mcd = (rengA: number, rengB: number): number => (rengB === 0 ? rengA : mcd(rengB, rengA % rengB))
const sub = (rengN: number): string => (rengN > 1 ? String(rengN) : '')
export const RENG_BINARIOS_MAX_TP: ReadonlyArray<readonly [string, string]> = ['C', 'Si', 'P', 'S', 'Cl', 'N', 'Br', 'As', 'Se', 'I'].flatMap((x) => ['O', 'F', 'Cl', 'S'].filter((y) => y !== x && rengEnTp(x) < rengEnTp(y)).map((y) => [x, y] as const))
export const RENG_SALES_ALCALINAS_TP: ReadonlyArray<readonly [string, string]> = ['Li', 'Na', 'K', 'Rb', 'Cs'].flatMap((m) => ['F', 'Cl', 'Br', 'I'].map((x) => [m, x] as const))
export const RENG_OXIDOS_EO_TP: ReadonlyArray<readonly [string, number]> = [['Fe', 3], ['Cu', 1], ['Mn', 4], ['Cr', 3], ['Ti', 4], ['V', 5], ['Co', 3], ['Cr', 6], ['Mn', 7], ['Ag', 1], ['Sc', 3], ['V', 3], ['Mn', 3], ['V', 4], ['Ti', 3], ['Fe', 2], ['Cu', 2]]
export const rengOxidoDeEoTp = (rengM: string, rengEo: number): string => `${rengM}${sub(2 / mcd(rengEo, 2))}O${sub(rengEo / mcd(rengEo, 2))}`
export const RENG_SOCIOS_TP: readonly string[] = ['F', 'O', 'Cl']
export const RENG_TRIADAS_EN_TP = RENG_TRIADAS_TP.filter((rengT) => rengT.every((rengS) => rengEnTp(rengS) > 0))
const rIon = (rengS: string): number => RENG_RADIO_ION_PM[rengS]![1]

export const RENG_INTEGRADORES_B03: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b3-i1', subtema: RENG_GRUPO, subtemas: ['n1-b3-s3', 'n1-b3-s21'],
    titulo: 'Fórmula a partir de los grupos', dificultad: 'basica',
    objetivo: 'Usar los grupos de dos no metales para deducir sus estados de oxidación extremos y la proporción en que se combinan.', unidad: '', tolerancia: RENG_TOL_TP,
    fuentes: rengFuentesTp('18.1', 'los grupos y los estados de oxidación'), idealizado: 'Estado de oxidación máximo de un elemento y mínimo del otro.', metodo: 'escena «tendencias-periodicas» (electrones de valencia)',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_BINARIOS_MAX_TP.length) }),
    respuesta: (rengD) => { const [x, y] = RENG_BINARIOS_MAX_TP[rengD.i]!; return rengValenciaTp(x) / (8 - rengValenciaTp(y)) },
    errores: (rengD) => { const [x, y] = RENG_BINARIOS_MAX_TP[rengD.i]!; return [
      ['inverso', 'Proporción invertida', (8 - rengValenciaTp(y)) / rengValenciaTp(x), 'Invertiste la proporción: se piden los átomos del segundo elemento por cada átomo del primero.'],
      ['valencias', 'Con los electrones de valencia', rengValenciaTp(x) / rengValenciaTp(y), 'Usaste los electrones de valencia del segundo elemento; su estado de oxidación mínimo es lo que le falta para ocho.']
    ] },
    enunciado: (rengD) => { const [x, y] = RENG_BINARIOS_MAX_TP[rengD.i]!; return `El ${rengNombreTp(x)} (grupo ${rengGrupoTp(x)}) se combina con el ${rengNombreTp(y)} (grupo ${rengGrupoTp(y)}) usando su estado de oxidación máximo; el ${rengNombreTp(y)} actúa con el mínimo.` },
    pregunta: (rengD) => { const [x, y] = RENG_BINARIOS_MAX_TP[rengD.i]!; return `¿Cuántos átomos de ${rengNombreTp(y)} hay por cada átomo de ${rengNombreTp(x)} en el compuesto?` },
    datos: (rengD) => { const [x, y] = RENG_BINARIOS_MAX_TP[rengD.i]!; return [[x, `grupo ${rengGrupoTp(x)}`], [y, `grupo ${rengGrupoTp(y)}`]] },
    pasos: (rengD, rengR) => { const [x, y] = RENG_BINARIOS_MAX_TP[rengD.i]!; return [`${x}: máximo +${rengValenciaTp(x)} (subtema 3); ${y}: mínimo −${8 - rengValenciaTp(y)} (subtema 21).`, `Proporción ${y} : ${x} = ${rengValenciaTp(x)} : ${8 - rengValenciaTp(y)} = ${tx(rengR)}.`] },
    pistas: ['Halla el máximo del primero.', 'Halla el mínimo del segundo.', 'Compensa las cargas positivas y negativas.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b3-i2', subtema: RENG_GRUPO, subtemas: ['n1-b3-s15', 'n1-b3-s16'],
    titulo: 'Cambio de tamaño al formar un ion', dificultad: 'basica',
    objetivo: 'Comparar el radio atómico con el iónico para cuantificar cuánto cambia el tamaño al formarse el ion.', unidad: 'pm', tolerancia: RENG_TOL_TP,
    fuentes: rengFuentesTp('6.5', 'los radios atómico e iónico', { tendencias: true }), idealizado: 'Radios de tablas de texto.', metodo: 'tabla de datos de la escena por otra vía',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_IONES_RADIO_TP.length) }),
    respuesta: (rengD) => { const s = RENG_IONES_RADIO_TP[rengD.i]!; return Math.abs(rIon(s) - rengRadioTp(s)) },
    errores: (rengD) => { const s = RENG_IONES_RADIO_TP[rengD.i]!; return [
      ['suma', 'Sumando', rIon(s) + rengRadioTp(s), 'Sumaste los dos radios; el cambio de tamaño es su diferencia.'],
      ['media', 'La media', (rIon(s) + rengRadioTp(s)) / 2, 'Calculaste la media de los radios; se pide cuánto cambia.']
    ] },
    enunciado: (rengD) => { const s = RENG_IONES_RADIO_TP[rengD.i]!; return `El átomo de ${rengNombreTp(s)} tiene un radio de ${rengRadioTp(s)} pm y su ion ${rengIonTp(s)}, de ${rIon(s)} pm.` },
    pregunta: () => '¿Cuántos picómetros cambia el radio al formarse el ion (en valor absoluto)?',
    datos: (rengD) => { const s = RENG_IONES_RADIO_TP[rengD.i]!; return [[s, `${rengRadioTp(s)} pm`], [rengIonTp(s), `${rIon(s)} pm`]] },
    pasos: (rengD, rengR) => { const s = RENG_IONES_RADIO_TP[rengD.i]!; return [`Radio atómico (subtema 15): ${rengRadioTp(s)} pm; radio iónico (subtema 16): ${rIon(s)} pm.`, `Cambio: ${tx(rengR)} pm; ${rIon(s) < rengRadioTp(s) ? 'el catión se encoge' : 'el anión se expande'}.`] },
    pistas: ['Localiza los dos radios.', 'Resta el menor del mayor.', 'Los cationes encogen y los aniones crecen.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b3-i3', subtema: RENG_GRUPO, subtemas: ['n1-b3-s17', 'n1-b3-s18'],
    titulo: 'Media de ionización y afinidad', dificultad: 'intermedia',
    objetivo: 'Combinar la energía de ionización y la afinidad electrónica de un elemento, como en la escala de electronegatividad de Mulliken.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TP,
    fuentes: rengFuentesTp('6.5', 'la energía de ionización y la afinidad electrónica', { tendencias: true }), idealizado: 'Átomos gaseosos aislados.', metodo: 'escena «tendencias-periodicas» y tabla de datos',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_CON_AE_TP.length) }),
    respuesta: (rengD) => { const s = RENG_CON_AE_TP[rengD.i]!; return (rengEiTp(s) + RENG_AE_KJ[s]!) / 2 },
    errores: (rengD) => { const s = RENG_CON_AE_TP[rengD.i]!; return [
      ['semirresta', 'Restando', (rengEiTp(s) - RENG_AE_KJ[s]!) / 2, 'Restaste la afinidad; la media se obtiene sumando las dos energías.'],
      ['suma', 'Sin dividir', rengEiTp(s) + RENG_AE_KJ[s]!, 'Sumaste las dos energías pero no dividiste entre dos.']
    ] },
    enunciado: (rengD) => { const s = RENG_CON_AE_TP[rengD.i]!; return `El ${rengNombreTp(s)} tiene una primera energía de ionización de ${rengEiTp(s)} kJ/mol y libera ${RENG_AE_KJ[s]} kJ/mol al captar un electrón. Mulliken propuso medir la electronegatividad con la media de ambas.` },
    pregunta: () => '¿Cuánto vale esa media, en kJ/mol?',
    datos: (rengD) => { const s = RENG_CON_AE_TP[rengD.i]!; return [['Ei', `${rengEiTp(s)} kJ/mol`], ['Afinidad', `${RENG_AE_KJ[s]} kJ/mol`]] },
    pasos: (rengD, rengR) => { const s = RENG_CON_AE_TP[rengD.i]!; return [`Ei (subtema 17) + afinidad (subtema 18) = ${rengEiTp(s) + RENG_AE_KJ[s]!} kJ/mol.`, `Media = ${tx(rengR, 4)} kJ/mol.`] },
    pistas: ['Suma las dos energías.', 'Divide el resultado entre dos.', 'Un valor alto indica más electronegatividad.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b3-i4', subtema: RENG_GRUPO, subtemas: ['n1-b3-s8', 'n1-b3-s10'],
    titulo: 'Sal de un alcalino y un halógeno', dificultad: 'intermedia',
    objetivo: 'Predecir la fórmula de la sal que forman un alcalino y un halógeno y calcular cuánta se obtiene.', unidad: 'g', tolerancia: RENG_TOL_TP,
    fuentes: rengFuentesTp('18.1', 'los alcalinos y los halógenos', { masas: true }), idealizado: 'Reacción completa con el halógeno en exceso.', metodo: 'masas molares del núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_SALES_ALCALINAS_TP.length), x: rengEntreN1(rengRng, 1, 50, 0.5) }),
    respuesta: (rengD) => { const [m, h] = RENG_SALES_ALCALINAS_TP[rengD.i]!; return (rengD.x / A(m)) * M(`${m}${h}`) },
    errores: (rengD) => { const [m, h] = RENG_SALES_ALCALINAS_TP[rengD.i]!; return [
      ['dos-halogenos', 'Fórmula MX₂', (rengD.x / A(m)) * (A(m) + 2 * A(h)), 'Usaste la fórmula MX₂; un alcalino forma iones 1+ y el haluro es 1−: la fórmula es MX.'],
      ['mitad', 'Mitad de sal', ((rengD.x / A(m)) * M(`${m}${h}`)) / 2, 'Cada mol de metal da un mol de sal: 2 M + X₂ → 2 MX.']
    ] },
    enunciado: (rengD) => { const [m, h] = RENG_SALES_ALCALINAS_TP[rengD.i]!; return `Reaccionan ${tx(rengD.x)} g de ${rengNombreTp(m)} (grupo 1) con ${rengNombreTp(h)} (grupo 17) en exceso.` },
    pregunta: () => '¿Qué masa de sal se forma, en g?',
    datos: (rengD) => { const [m, h] = RENG_SALES_ALCALINAS_TP[rengD.i]!; return [['Metal', `${tx(rengD.x)} g de ${m}`], ['Masas atómicas', `${m} ${tx(A(m), 5)}; ${h} ${tx(A(h), 5)}`]] },
    pasos: (rengD, rengR) => { const [m, h] = RENG_SALES_ALCALINAS_TP[rengD.i]!; return [`Iones ${m}⁺ (subtema 8) y ${h}⁻ (subtema 10): fórmula ${m}${h}.`, `n = ${tx(rengD.x / A(m))} mol; m = ${tx(rengR)} g.`] },
    pistas: ['Deduce los iones de cada grupo.', 'Escribe la fórmula de la sal.', 'Pasa el metal a moles y a masa de sal.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b3-i5', subtema: RENG_GRUPO, subtemas: ['n1-b3-s12', 'n1-b3-s21'],
    titulo: 'Metal en un óxido de estado de oxidación dado', dificultad: 'avanzada',
    objetivo: 'Deducir la fórmula de un óxido a partir del estado de oxidación del metal y calcular el metal que contiene.', unidad: 'g', tolerancia: RENG_TOL_TP,
    fuentes: rengFuentesTp('19.1', 'los metales de transición y sus estados de oxidación', { masas: true }), idealizado: 'Óxido puro de la fórmula deducida.', metodo: 'masa molar del núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_OXIDOS_EO_TP.length), x: rengEntreN1(rengRng, 5, 200, 5) }),
    respuesta: (rengD) => { const [m, eo] = RENG_OXIDOS_EO_TP[rengD.i]!; const a = 2 / mcd(eo, 2); return (rengD.x * a * A(m)) / M(rengOxidoDeEoTp(m, eo)) },
    errores: (rengD) => { const [m, eo] = RENG_OXIDOS_EO_TP[rengD.i]!; const a = 2 / mcd(eo, 2); const b = eo / mcd(eo, 2); return [
      ['uno-a-uno', 'Fórmula MO', (rengD.x * A(m)) / (A(m) + A('O')), 'Supusiste la fórmula MO; los subíndices dependen del estado de oxidación del metal.'],
      ['invertido', 'Subíndices invertidos', (rengD.x * b * A(m)) / (b * A(m) + a * A('O')), 'Intercambiaste los subíndices del metal y del oxígeno.']
    ] },
    enunciado: (rengD) => { const [m, eo] = RENG_OXIDOS_EO_TP[rengD.i]!; return `Un óxido de ${rengNombreTp(m)} contiene el metal con estado de oxidación +${eo}. Se tienen ${tx(rengD.x)} g de ese óxido.` },
    pregunta: (rengD) => `¿Qué masa de ${rengNombreTp(RENG_OXIDOS_EO_TP[rengD.i]![0])} contiene, en g?`,
    datos: (rengD) => { const [m, eo] = RENG_OXIDOS_EO_TP[rengD.i]!; return [['Estado de oxidación', `+${eo}`], ['Masas atómicas', `${m} ${tx(A(m), 5)}; O ${tx(A('O'), 5)}`], ['Muestra', `${tx(rengD.x)} g`]] },
    pasos: (rengD, rengR) => { const [m, eo] = RENG_OXIDOS_EO_TP[rengD.i]!; return [`Con +${eo} y O²⁻ la fórmula es ${T(rengOxidoDeEoTp(m, eo))} (subtemas 12 y 21).`, `m(${m}) = ${tx(rengR)} g.`] },
    pistas: ['Compensa las cargas con el oxígeno.', 'Escribe la fórmula del óxido.', 'Calcula la fracción de metal.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b3-i6', subtema: RENG_GRUPO, subtemas: ['n1-b3-s19', 'n1-b3-s22', 'n1-b3-s23'],
    titulo: 'Polaridad predicha por interpolación', dificultad: 'avanzada',
    objetivo: 'Estimar la electronegatividad de un elemento por interpolación en su grupo y usarla para predecir la polaridad de un enlace.', unidad: '', tolerancia: RENG_TOL_TP,
    fuentes: rengFuentesTp('6.5', 'la electronegatividad y la predicción de propiedades', { pubchem: true }), idealizado: 'Interpolación lineal entre vecinos del grupo.', metodo: 'datos de PubChem guardados en la app, por otra vía',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_TRIADAS_EN_TP.length), j: rengIndice(rengRng, RENG_SOCIOS_TP.length) }),
    valida: (rengD) => !RENG_TRIADAS_EN_TP[rengD.i]!.includes(RENG_SOCIOS_TP[rengD.j]!),
    respuesta: (rengD) => { const [a, , c] = RENG_TRIADAS_EN_TP[rengD.i]!; return Math.abs(rengEnTp(RENG_SOCIOS_TP[rengD.j]!) - (rengEnTp(a) + rengEnTp(c)) / 2) },
    errores: (rengD) => { const [a, , c] = RENG_TRIADAS_EN_TP[rengD.i]!; const s = rengEnTp(RENG_SOCIOS_TP[rengD.j]!); const m = (rengEnTp(a) + rengEnTp(c)) / 2; return [
      ['suma', 'Sumando', s + m, 'Sumaste las electronegatividades; la polaridad depende de su diferencia.'],
      ['media', 'Media con el otro elemento', (s + m) / 2, 'Promediaste con el otro elemento; primero se interpola en el grupo y después se resta.']
    ] },
    enunciado: (rengD) => { const [a, b, c] = RENG_TRIADAS_EN_TP[rengD.i]!; const s = RENG_SOCIOS_TP[rengD.j]!; return `El ${rengNombreTp(b)} está entre el ${rengNombreTp(a)} (χ = ${tx(rengEnTp(a))}) y el ${rengNombreTp(c)} (χ = ${tx(rengEnTp(c))}) en su grupo. Estima su electronegatividad por interpolación y considera su enlace con el ${rengNombreTp(s)} (χ = ${tx(rengEnTp(s))}).` },
    pregunta: () => '¿Qué diferencia de electronegatividad se predice para ese enlace?',
    datos: (rengD) => { const [a, , c] = RENG_TRIADAS_EN_TP[rengD.i]!; const s = RENG_SOCIOS_TP[rengD.j]!; return [[a, tx(rengEnTp(a))], [c, tx(rengEnTp(c))], [s, tx(rengEnTp(s))]] },
    pasos: (rengD, rengR) => { const [a, b, c] = RENG_TRIADAS_EN_TP[rengD.i]!; return [`χ interpolada (subtemas 22 y 23): ${tx((rengEnTp(a) + rengEnTp(c)) / 2)}; el valor tabulado del ${rengNombreTp(b)} es ${tx(rengEnTp(b))}.`, `Δχ predicha (subtema 19) = ${tx(rengR)}.`] },
    pistas: ['Promedia los vecinos del grupo.', 'Resta del otro elemento.', 'Toma el valor absoluto.']
  })
]
