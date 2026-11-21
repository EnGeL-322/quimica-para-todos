import { RENG_NA_GAS, rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_COMPUESTOS_IONICOS, RENG_COMPUESTOS_MASA, RENG_COMPUESTOS_MOLECULARES, RENG_EMPIRICAS, RENG_HIDRATOS, RENG_HIDROCARBUROS, RENG_TOL_EST, RENG_TOL_PCT, rengAtomosDe, rengDatoMasa, rengFuentesEst, rengMasaAt, rengMasaConZ, rengMasaSinSubindices, rengMmEst, rengTexto, rengTextoHidrato, rengTextoMasasAt } from './b07-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const NA = RENG_NA_GAS
export const RENG_ATOMO_EN: ReadonlyArray<readonly [formula: string, elemento: string]> = [['CH4', 'H'], ['H2O', 'H'], ['C6H12O6', 'O'], ['NH3', 'H'], ['CO2', 'O'], ['C3H8', 'H'], ['C2H5OH', 'C'], ['H2SO4', 'O'], ['C12H22O11', 'C'], ['NH4Cl', 'H']]
const rengSubindiceDe = (rengF: string, rengEl: string): number => rengAtomosDe(rengF).get(rengEl) ?? 0
const rengTotalAtomos = (rengF: string): number => [...rengAtomosDe(rengF).values()].reduce((rengA, rengB) => rengA + rengB, 0)
const rengPct = (rengF: string, rengEl: string): number => (100 * rengSubindiceDe(rengF, rengEl) * rengMasaAt(rengEl)) / rengMmEst(rengF)
export const RENG_PARES_COMPOSICION: ReadonlyArray<readonly [string, string]> = RENG_COMPUESTOS_MASA.flatMap((rengF) => [...rengAtomosDe(rengF).keys()].map((rengEl) => [rengF, rengEl] as const))
export const rengPctEmp = (rengE: readonly [string, number, number, number]): readonly [number, number, number] => {
  const rengM = rengMmEst(rengE[0])
  const rengR = (rengX: number): number => Math.round(rengX * 100) / 100
  return [rengR((100 * rengE[1] * rengMasaAt('C')) / rengM), rengR((100 * rengE[2] * rengMasaAt('H')) / rengM), rengR((100 * rengE[3] * rengMasaAt('O')) / rengM)]
}
export const rengPctHc = (rengH: readonly [string, number, number]): readonly [number, number] => {
  const rengM = rengMmEst(rengH[0])
  const rengR = (rengX: number): number => Math.round(rengX * 100) / 100
  return [rengR((100 * rengH[1] * rengMasaAt('C')) / rengM), rengR((100 * rengH[2] * rengMasaAt('H')) / rengM)]
}

export const RENG_PRACTICAS_B07_S01: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s1-p1', subtema: 'n1-b7-s1', titulo: 'De moléculas a moles', dificultad: 'basica',
    objetivo: 'Pasar un número de moléculas a moles dividiendo entre la constante de Avogadro.', unidad: 'mol', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'el concepto de mol', 'na'), idealizado: 'Muestra pura de moléculas iguales.', metodo: 'masa de la muestra calculada molécula a molécula y dividida entre la masa molar',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 1.1, 9.9, 0.1), e: rengEntreN1(rengRng, 22, 25, 1), f: rengIndice(rengRng, RENG_COMPUESTOS_MOLECULARES.length) }),
    respuesta: (rengD) => (rengD.a * 10 ** rengD.e) / NA,
    errores: (rengD) => [
      ['multiplica', 'Multiplicar por N_A', rengD.a * 10 ** rengD.e * NA, 'Multiplicaste por N_A. Para pasar de número de moléculas a moles hay que dividir: n = N / N_A.'],
      ['inversa', 'N_A entre N', NA / (rengD.a * 10 ** rengD.e), 'Dividiste N_A entre el número de moléculas. Es al revés: n = N / N_A.']
    ],
    enunciado: (rengD) => `Una muestra de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)} contiene ${rengTx(rengD.a * 10 ** rengD.e, 2)} moléculas.`,
    pregunta: () => '¿Cuántos moles son?',
    datos: (rengD) => [['Número de moléculas', `${rengTx(rengD.a * 10 ** rengD.e, 2)}`], ['N_A', '6,02214076·10²³ mol⁻¹']],
    pasos: (rengD, rengR) => [`n = N / N_A = ${rengTx(rengD.a * 10 ** rengD.e, 2)} / 6,022·10²³.`, `n = ${rengTx(rengR)} mol.`],
    pistas: ['Un mol contiene N_A entidades.', 'Divide el número de moléculas entre N_A.', 'Resta los exponentes al dividir potencias de diez.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s1-p2', subtema: 'n1-b7-s1', titulo: 'Átomos de un elemento en unos moles de compuesto', dificultad: 'intermedia',
    objetivo: 'Calcular el número de átomos de un elemento a partir de los moles de un compuesto y de su fórmula.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'moles de átomos y de moléculas', 'na'), idealizado: 'Compuesto puro.', metodo: 'moles de átomos del elemento (n·subíndice) multiplicados por N_A',
    parametros: (rengRng) => ({ n: rengEntreN1(rengRng, 0.05, 3, 0.05), k: rengIndice(rengRng, RENG_ATOMO_EN.length) }),
    respuesta: (rengD) => rengD.n * rengSubindiceDe(...RENG_ATOMO_EN[rengD.k]!) * NA,
    errores: (rengD) => [
      ['sin-subindice', 'Olvidar el subíndice', rengD.n * NA, 'Calculaste moléculas, no átomos. Cada molécula contiene varios átomos de ese elemento: multiplica por su subíndice.'],
      ['todos-los-atomos', 'Contar todos los átomos', rengD.n * rengTotalAtomos(RENG_ATOMO_EN[rengD.k]![0]) * NA, 'Contaste todos los átomos de la molécula. La pregunta pide solo los del elemento indicado.']
    ],
    enunciado: (rengD) => `Se tienen ${rengTx(rengD.n)} mol de ${rengTexto(RENG_ATOMO_EN[rengD.k]![0])}.`,
    pregunta: (rengD) => `¿Cuántos átomos de ${RENG_ATOMO_EN[rengD.k]![1]} contienen?`,
    datos: (rengD) => [['Cantidad', `${rengTx(rengD.n)} mol`], ['Fórmula', rengTexto(RENG_ATOMO_EN[rengD.k]![0])], ['N_A', '6,02214076·10²³ mol⁻¹']],
    pasos: (rengD, rengR) => [`Cada molécula tiene ${rengSubindiceDe(...RENG_ATOMO_EN[rengD.k]!)} átomos de ${RENG_ATOMO_EN[rengD.k]![1]}.`, `Átomos = ${rengTx(rengD.n)} × ${rengSubindiceDe(...RENG_ATOMO_EN[rengD.k]!)} × 6,022·10²³ = ${rengTx(rengR)}.`],
    pistas: ['Lee el subíndice del elemento en la fórmula.', 'Moles de átomos = moles de compuesto × subíndice.', 'Multiplica por N_A para contar átomos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s1-p3', subtema: 'n1-b7-s1', titulo: 'Átomos de un elemento en una masa de compuesto', dificultad: 'avanzada',
    objetivo: 'Encadenar masa → moles → moléculas → átomos de un elemento.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'masa, moles y número de entidades', 'na', 'masas'), idealizado: 'Compuesto puro.', metodo: 'masa del elemento en la muestra dividida entre la masa de un átomo (A/N_A)',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.5, 50, 0.5), k: rengIndice(rengRng, RENG_ATOMO_EN.length) }),
    respuesta: (rengD) => (rengD.m / rengMmEst(RENG_ATOMO_EN[rengD.k]![0])) * rengSubindiceDe(...RENG_ATOMO_EN[rengD.k]!) * NA,
    errores: (rengD) => [
      ['sin-subindice', 'Olvidar el subíndice', (rengD.m / rengMmEst(RENG_ATOMO_EN[rengD.k]![0])) * NA, 'Calculaste el número de moléculas. Multiplica por el número de átomos del elemento que hay en cada molécula.'],
      ['masa-elemento', 'Masa atómica en lugar de masa molar', (rengD.m / rengMasaAt(RENG_ATOMO_EN[rengD.k]![1])) * NA, 'Dividiste la masa de la muestra entre la masa atómica del elemento, como si toda la muestra fuera ese elemento.']
    ],
    enunciado: (rengD) => `Se pesan ${rengTx(rengD.m)} g de ${rengTexto(RENG_ATOMO_EN[rengD.k]![0])}. Masa molar (tabla de la app): ${rengTx(rengMmEst(RENG_ATOMO_EN[rengD.k]![0]), 5)} g/mol.`,
    pregunta: (rengD) => `¿Cuántos átomos de ${RENG_ATOMO_EN[rengD.k]![1]} hay en la muestra?`,
    datos: (rengD) => [['Masa', `${rengTx(rengD.m)} g`], rengDatoMasa(RENG_ATOMO_EN[rengD.k]![0]), ['N_A', '6,02214076·10²³ mol⁻¹']],
    pasos: (rengD, rengR) => [`n = ${rengTx(rengD.m)} / ${rengTx(rengMmEst(RENG_ATOMO_EN[rengD.k]![0]), 5)} = ${rengTx(rengD.m / rengMmEst(RENG_ATOMO_EN[rengD.k]![0]), 4)} mol.`, `Átomos = n × ${rengSubindiceDe(...RENG_ATOMO_EN[rengD.k]!)} × N_A = ${rengTx(rengR)}.`],
    pistas: ['Primero pasa la masa a moles con la masa molar del compuesto.', 'Después cuenta los átomos del elemento por molécula.', 'Al final multiplica por N_A.']
  })
]

export const RENG_PRACTICAS_B07_S02: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s2-p1', subtema: 'n1-b7-s2', titulo: 'Moléculas que caben en un gramo', dificultad: 'basica',
    objetivo: 'Usar N_A y la masa molar para contar las moléculas de un gramo (el inverso de la masa de una molécula).', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'la constante de Avogadro', 'na', 'masas'), idealizado: 'Moléculas iguales con la masa media.', metodo: 'inverso de la masa de una molécula (M/N_A)',
    parametros: (rengRng) => ({ f: rengIndice(rengRng, RENG_COMPUESTOS_MOLECULARES.length) }),
    respuesta: (rengD) => NA / rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!),
    errores: (rengD) => [
      ['masa-molecula', 'Masa de una molécula', rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!) / NA, 'Calculaste la masa de una molécula (M/N_A). El número de moléculas por gramo es su inverso: N_A/M.'],
      ['multiplica', 'Multiplicar por M', rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!) * NA, 'Multiplicaste N_A por la masa molar. En un gramo hay 1/M moles: N = N_A/M.']
    ],
    enunciado: (rengD) => `La masa molar de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)} es ${rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), 5)} g/mol (tabla de la app).`,
    pregunta: () => '¿Cuántas moléculas hay en 1 g de esa sustancia?',
    datos: (rengD) => [rengDatoMasa(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), ['N_A', '6,02214076·10²³ mol⁻¹']],
    pasos: (rengD, rengR) => [`Masa de una molécula: M / N_A = ${rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!) / NA)} g.`, `Moléculas por gramo: N_A / M = 6,022·10²³ / ${rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), 5)} = ${rengTx(rengR)}.`],
    pistas: ['Un mol de moléculas pesa M gramos.', 'Un gramo contiene 1/M moles.', 'Multiplica esos moles por N_A.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s2-p2', subtema: 'n1-b7-s2', titulo: 'Moléculas en una masa', dificultad: 'intermedia',
    objetivo: 'Calcular el número de moléculas de una muestra a partir de su masa.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'masa y número de moléculas', 'na', 'masas'), idealizado: 'Muestra pura.', metodo: 'masa de la muestra dividida entre la masa de una molécula',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.1, 100, 0.1), f: rengIndice(rengRng, RENG_COMPUESTOS_MOLECULARES.length) }),
    respuesta: (rengD) => (rengD.m / rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)) * NA,
    errores: (rengD) => [
      ['sin-masa-molar', 'Sin la masa molar', rengD.m * NA, 'Multiplicaste los gramos por N_A sin pasarlos antes a moles. Divide primero entre la masa molar.'],
      ['por-masa-molar', 'Multiplicar por M', rengD.m * rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!) * NA, 'Multiplicaste por la masa molar. Para pasar de gramos a moles hay que dividir: n = m / M.']
    ],
    enunciado: (rengD) => `Se tienen ${rengTx(rengD.m)} g de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)}.`,
    pregunta: () => '¿Cuántas moléculas hay?',
    datos: (rengD) => [['Masa', `${rengTx(rengD.m)} g`], rengDatoMasa(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), ['N_A', '6,02214076·10²³ mol⁻¹']],
    pasos: (rengD, rengR) => [`n = ${rengTx(rengD.m)} / ${rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), 5)} = ${rengTx(rengD.m / rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), 4)} mol.`, `N = n · N_A = ${rengTx(rengR)} moléculas.`],
    pistas: ['Pasa la masa a moles.', 'Después multiplica por N_A.', 'N = (m / M) · N_A.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s2-p3', subtema: 'n1-b7-s2', titulo: 'Comparar moléculas en masas iguales', dificultad: 'avanzada',
    objetivo: 'Razonar que, a igual masa, el número de moléculas es inverso a la masa molar.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'número de moléculas y masa molar', 'masas'), idealizado: 'Muestras puras de igual masa.', metodo: 'número de moléculas de cada muestra calculado por separado',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_COMPUESTOS_MOLECULARES.length), b: rengIndice(rengRng, RENG_COMPUESTOS_MOLECULARES.length), m: rengEntreN1(rengRng, 1, 20, 1) }),
    valida: (rengD) => rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!) > 1.2 * rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!),
    respuesta: (rengD) => rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!) / rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!),
    errores: (rengD) => [
      ['invertida', 'Razón invertida', rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!) / rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!), 'Pusiste la razón al revés. La sustancia más ligera tiene más moléculas por gramo, así que el cociente es mayor que 1.'],
      ['diferencia', 'Restar masas molares', rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!) - rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!), 'Restaste las masas molares. Lo que compara el número de moléculas es el cociente, no la diferencia.']
    ],
    enunciado: (rengD) => `Se pesan ${rengTx(rengD.m)} g de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.a]!)} y ${rengTx(rengD.m)} g de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.b]!)}.`,
    pregunta: (rengD) => `¿Cuántas veces más moléculas hay en la muestra de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.a]!)}?`,
    datos: (rengD) => [rengDatoMasa(RENG_COMPUESTOS_MOLECULARES[rengD.a]!), rengDatoMasa(RENG_COMPUESTOS_MOLECULARES[rengD.b]!), ['Masa de cada muestra', `${rengTx(rengD.m)} g`]],
    pasos: (rengD, rengR) => ['A igual masa, N ∝ 1/M.', `N_A/N_B = M_B/M_A = ${rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!), 5)} / ${rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!), 5)} = ${rengTx(rengR)}.`],
    pistas: ['Escribe N = (m/M)·N_A para cada muestra.', 'Divide una entre otra: se cancelan m y N_A.', 'Queda el cociente de masas molares, invertido.']
  })
]

export const RENG_PRACTICAS_B07_S03: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s3-p1', subtema: 'n1-b7-s3', titulo: 'Calcular una masa molar', dificultad: 'basica',
    objetivo: 'Sumar las masas atómicas de una fórmula multiplicadas por sus subíndices.', unidad: 'g/mol', cifras: 4, tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'la masa molar', 'masas'), idealizado: 'Composición isotópica natural media.', metodo: 'analizador de fórmulas de la aplicación sobre la cadena de la fórmula',
    parametros: (rengRng) => ({ f: rengIndice(rengRng, RENG_COMPUESTOS_MASA.length) }),
    respuesta: (rengD) => [...rengAtomosDe(RENG_COMPUESTOS_MASA[rengD.f]!).entries()].reduce((rengS, [rengEl, rengN]) => rengS + rengMasaAt(rengEl) * rengN, 0),
    errores: (rengD) => [
      ['sin-subindices', 'Ignorar los subíndices', rengMasaSinSubindices(RENG_COMPUESTOS_MASA[rengD.f]!), 'Sumaste una sola vez cada elemento. Cada masa atómica se multiplica por el número de átomos de ese elemento.'],
      ['numero-atomico', 'Usar el número atómico', rengMasaConZ(RENG_COMPUESTOS_MASA[rengD.f]!), 'Usaste los números atómicos (protones), no las masas atómicas de la tabla.']
    ],
    enunciado: (rengD) => `Fórmula: ${rengTexto(RENG_COMPUESTOS_MASA[rengD.f]!)}. Masas atómicas de la tabla de la app: ${rengTextoMasasAt(RENG_COMPUESTOS_MASA[rengD.f]!)} g/mol.`,
    pregunta: () => '¿Cuál es su masa molar, en g/mol?',
    datos: (rengD) => [['Fórmula', rengTexto(RENG_COMPUESTOS_MASA[rengD.f]!)], ['Masas atómicas', rengTextoMasasAt(RENG_COMPUESTOS_MASA[rengD.f]!)]],
    pasos: (rengD, rengR) => [`Átomos: ${[...rengAtomosDe(RENG_COMPUESTOS_MASA[rengD.f]!).entries()].map(([rengEl, rengN]) => `${rengN} ${rengEl}`).join(', ')}.`, `M = ${rengTx(rengR, 5)} g/mol.`],
    pistas: ['Cuenta los átomos de cada elemento.', 'Los paréntesis multiplican todo el grupo.', 'Suma masa atómica × número de átomos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s3-p2', subtema: 'n1-b7-s3', titulo: 'Gramos de unos moles', dificultad: 'intermedia',
    objetivo: 'Convertir una cantidad en moles a masa con m = n·M.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'conversión moles-masa', 'masas'), idealizado: 'Sustancia pura.', metodo: 'número de fórmulas unidad por la masa de cada una (M/N_A)',
    parametros: (rengRng) => ({ n: rengEntreN1(rengRng, 0.02, 5, 0.01), f: rengIndice(rengRng, RENG_COMPUESTOS_MASA.length) }),
    respuesta: (rengD) => rengD.n * rengMmEst(RENG_COMPUESTOS_MASA[rengD.f]!),
    errores: (rengD) => [
      ['divide', 'Dividir entre M', rengD.n / rengMmEst(RENG_COMPUESTOS_MASA[rengD.f]!), 'Dividiste los moles entre la masa molar. Para pasar de moles a gramos se multiplica: m = n · M.'],
      ['inversa', 'M entre n', rengMmEst(RENG_COMPUESTOS_MASA[rengD.f]!) / rengD.n, 'Dividiste la masa molar entre los moles. Las unidades no salen en gramos: m = n · M.']
    ],
    enunciado: (rengD) => `Hay que pesar ${rengTx(rengD.n)} mol de ${rengTexto(RENG_COMPUESTOS_MASA[rengD.f]!)}.`,
    pregunta: () => '¿Cuántos gramos son?',
    datos: (rengD) => [['Cantidad', `${rengTx(rengD.n)} mol`], rengDatoMasa(RENG_COMPUESTOS_MASA[rengD.f]!)],
    pasos: (rengD, rengR) => [`m = n · M = ${rengTx(rengD.n)} × ${rengTx(rengMmEst(RENG_COMPUESTOS_MASA[rengD.f]!), 5)}.`, `m = ${rengTx(rengR)} g.`],
    pistas: ['¿Qué magnitud convierte moles en gramos?', 'Masa = moles × masa molar.', 'Comprueba que se cancelan los moles.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s3-p3', subtema: 'n1-b7-s3', titulo: 'Moles de una masa', dificultad: 'avanzada',
    objetivo: 'Convertir una masa en kilogramos o gramos a moles con n = m/M.', unidad: 'mol', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'conversión masa-moles', 'masas'), idealizado: 'Sustancia pura.', metodo: 'número de fórmulas unidad (m·N_A/M) dividido entre N_A',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.05, 2.5, 0.05), f: rengIndice(rengRng, RENG_COMPUESTOS_MASA.length) }),
    respuesta: (rengD) => (rengD.m * 1000) / rengMmEst(RENG_COMPUESTOS_MASA[rengD.f]!),
    errores: (rengD) => [
      ['kilogramos', 'Masa en kg sin convertir', rengD.m / rengMmEst(RENG_COMPUESTOS_MASA[rengD.f]!), 'Usaste la masa en kilogramos. La masa molar está en g/mol: pasa antes los kilogramos a gramos.'],
      ['multiplica', 'Multiplicar por M', rengD.m * 1000 * rengMmEst(RENG_COMPUESTOS_MASA[rengD.f]!), 'Multiplicaste por la masa molar. De gramos a moles se divide: n = m / M.']
    ],
    enunciado: (rengD) => `Un saco contiene ${rengTx(rengD.m)} kg de ${rengTexto(RENG_COMPUESTOS_MASA[rengD.f]!)} puro.`,
    pregunta: () => '¿Cuántos moles contiene?',
    datos: (rengD) => [['Masa', `${rengTx(rengD.m)} kg`], rengDatoMasa(RENG_COMPUESTOS_MASA[rengD.f]!)],
    pasos: (rengD, rengR) => [`m = ${rengTx(rengD.m)} kg = ${rengTx(rengD.m * 1000)} g.`, `n = ${rengTx(rengD.m * 1000)} / ${rengTx(rengMmEst(RENG_COMPUESTOS_MASA[rengD.f]!), 5)} = ${rengTx(rengR)} mol.`],
    pistas: ['Pasa los kilogramos a gramos.', 'Divide entre la masa molar.', 'n = m / M con m en gramos.']
  })
]

export const RENG_PRACTICAS_B07_S04: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s4-p1', subtema: 'n1-b7-s4', titulo: 'Masa molecular relativa', dificultad: 'basica',
    objetivo: 'Calcular la masa molecular relativa (sin unidades) de una molécula.', unidad: '', cifras: 4, tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'la masa molecular', 'masas'), idealizado: 'Molécula con masas atómicas medias.', metodo: 'analizador de fórmulas de la aplicación',
    parametros: (rengRng) => ({ f: rengIndice(rengRng, RENG_COMPUESTOS_MOLECULARES.length), q: rengIndice(rengRng, 2) }),
    respuesta: (rengD) => [...rengAtomosDe(RENG_COMPUESTOS_MOLECULARES[rengD.f]!).entries()].reduce((rengS, [rengEl, rengN]) => rengS + rengMasaAt(rengEl) * rengN, 0),
    errores: (rengD) => [
      ['sin-subindices', 'Ignorar los subíndices', rengMasaSinSubindices(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), 'Sumaste una sola vez cada elemento. Multiplica cada masa atómica por su número de átomos en la molécula.'],
      ['numero-atomico', 'Usar el número atómico', rengMasaConZ(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), 'Usaste los números atómicos en lugar de las masas atómicas relativas.']
    ],
    enunciado: (rengD) => `${rengD.q === 0 ? 'Molécula' : 'Sustancia molecular'}: ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)}. Masas atómicas relativas de la tabla de la app: ${rengTextoMasasAt(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)}.`,
    pregunta: (rengD) => (rengD.q === 0 ? '¿Cuál es su masa molecular relativa?' : '¿Cuánto vale M_r (sin unidades)?'),
    datos: (rengD) => [['Fórmula', rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)], ['Masas atómicas relativas', rengTextoMasasAt(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)]],
    pasos: (rengD, rengR) => [`Átomos: ${[...rengAtomosDe(RENG_COMPUESTOS_MOLECULARES[rengD.f]!).entries()].map(([rengEl, rengN]) => `${rengN} ${rengEl}`).join(', ')}.`, `M_r = ${rengTx(rengR, 5)}.`],
    pistas: ['Cuenta los átomos de cada elemento.', 'Multiplica por su masa atómica relativa.', 'El resultado no lleva unidades.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s4-p2', subtema: 'n1-b7-s4', titulo: 'Cuántas moléculas ligeras pesan como una pesada', dificultad: 'intermedia',
    objetivo: 'Comparar masas de moléculas con el cociente de masas moleculares relativas.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'comparación de masas moleculares', 'masas'), idealizado: 'Moléculas con masas medias.', metodo: 'masa de cada molécula en gramos (M/N_A) y cociente',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_COMPUESTOS_MOLECULARES.length), b: rengIndice(rengRng, RENG_COMPUESTOS_MOLECULARES.length) }),
    valida: (rengD) => rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!) > 1.3 * rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!),
    respuesta: (rengD) => rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!) / rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!),
    errores: (rengD) => [
      ['invertida', 'Cociente invertido', rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!) / rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!), 'Pusiste el cociente al revés: hacen falta varias moléculas ligeras para igualar una pesada, así que el resultado es mayor que 1.'],
      ['sin-subindices', 'Masas sin subíndices', rengMasaSinSubindices(RENG_COMPUESTOS_MOLECULARES[rengD.a]!) / rengMasaSinSubindices(RENG_COMPUESTOS_MOLECULARES[rengD.b]!), 'Calculaste las masas moleculares sin multiplicar por los subíndices.']
    ],
    enunciado: (rengD) => `Se compara una molécula de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.a]!)} con moléculas de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.b]!)}. Masas atómicas de la tabla de la app.`,
    pregunta: (rengD) => `¿Cuántas moléculas de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.b]!)} tienen, juntas, la masa de una de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.a]!)}?`,
    datos: (rengD) => [[`M_r de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.a]!)}`, rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!), 5)], [`M_r de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.b]!)}`, rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!), 5)]],
    pasos: (rengD, rengR) => ['Las masas moleculares relativas comparan masas de moléculas.', `Cociente = ${rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.a]!), 5)} / ${rengTx(rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.b]!), 5)} = ${rengTx(rengR)}.`],
    pistas: ['Calcula las dos masas moleculares.', 'Divide la mayor entre la menor.', 'El resultado no tiene unidades.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s4-p3', subtema: 'n1-b7-s4', titulo: 'Masa de un número de moléculas', dificultad: 'avanzada',
    objetivo: 'Calcular la masa en gramos de un número dado de moléculas.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'masa molecular y masa de las moléculas', 'na', 'masas'), idealizado: 'Moléculas con masa media.', metodo: 'moles (N/N_A) por la masa molar',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 1.1, 9.9, 0.1), e: rengEntreN1(rengRng, 20, 24, 1), f: rengIndice(rengRng, RENG_COMPUESTOS_MOLECULARES.length) }),
    respuesta: (rengD) => rengD.a * 10 ** rengD.e * (rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!) / NA),
    errores: (rengD) => [
      ['sin-avogadro', 'Sin dividir entre N_A', rengD.a * 10 ** rengD.e * rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), 'Multiplicaste el número de moléculas por la masa molar: hay que dividir antes entre N_A para pasar a moles.'],
      ['inversa', 'N_A/M en lugar de M/N_A', rengD.a * 10 ** rengD.e * (NA / rengMmEst(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)), 'Usaste N_A/M, que es el número de moléculas por gramo. La masa de una molécula es M/N_A.']
    ],
    enunciado: (rengD) => `Una muestra contiene ${rengTx(rengD.a * 10 ** rengD.e, 2)} moléculas de ${rengTexto(RENG_COMPUESTOS_MOLECULARES[rengD.f]!)}.`,
    pregunta: () => '¿Cuál es su masa, en g?',
    datos: (rengD) => [['Moléculas', `${rengTx(rengD.a * 10 ** rengD.e, 2)}`], rengDatoMasa(RENG_COMPUESTOS_MOLECULARES[rengD.f]!), ['N_A', '6,02214076·10²³ mol⁻¹']],
    pasos: (rengD, rengR) => [`n = N / N_A = ${rengTx((rengD.a * 10 ** rengD.e) / NA, 4)} mol.`, `m = n · M = ${rengTx(rengR)} g.`],
    pistas: ['Pasa el número de moléculas a moles.', 'Después multiplica por la masa molar.', 'm = (N / N_A) · M.']
  })
]

export const RENG_PRACTICAS_B07_S05: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s5-p1', subtema: 'n1-b7-s5', titulo: 'Masa fórmula de un compuesto iónico', dificultad: 'basica',
    objetivo: 'Calcular la masa fórmula de un compuesto iónico a partir de su fórmula unidad.', unidad: '', cifras: 4, tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'la masa fórmula', 'masas'), idealizado: 'Compuesto con estequiometría exacta.', metodo: 'analizador de fórmulas de la aplicación',
    parametros: (rengRng) => ({ f: rengIndice(rengRng, RENG_COMPUESTOS_IONICOS.length), q: rengIndice(rengRng, 2) }),
    respuesta: (rengD) => [...rengAtomosDe(RENG_COMPUESTOS_IONICOS[rengD.f]!).entries()].reduce((rengS, [rengEl, rengN]) => rengS + rengMasaAt(rengEl) * rengN, 0),
    errores: (rengD) => [
      ['sin-subindices', 'Ignorar los subíndices', rengMasaSinSubindices(RENG_COMPUESTOS_IONICOS[rengD.f]!), 'Sumaste una sola vez cada elemento. En la fórmula unidad hay que contar todos los átomos, incluidos los de los paréntesis.'],
      ['numero-atomico', 'Usar el número atómico', rengMasaConZ(RENG_COMPUESTOS_IONICOS[rengD.f]!), 'Usaste los números atómicos en lugar de las masas atómicas.']
    ],
    enunciado: (rengD) => `${rengD.q === 0 ? 'El compuesto iónico' : 'La sal'} ${rengTexto(RENG_COMPUESTOS_IONICOS[rengD.f]!)} no forma moléculas. Masas atómicas de la tabla de la app: ${rengTextoMasasAt(RENG_COMPUESTOS_IONICOS[rengD.f]!)}.`,
    pregunta: () => '¿Cuál es su masa fórmula relativa?',
    datos: (rengD) => [['Fórmula unidad', rengTexto(RENG_COMPUESTOS_IONICOS[rengD.f]!)], ['Masas atómicas', rengTextoMasasAt(RENG_COMPUESTOS_IONICOS[rengD.f]!)]],
    pasos: (rengD, rengR) => [`Átomos por fórmula unidad: ${[...rengAtomosDe(RENG_COMPUESTOS_IONICOS[rengD.f]!).entries()].map(([rengEl, rengN]) => `${rengN} ${rengEl}`).join(', ')}.`, `Masa fórmula = ${rengTx(rengR, 5)}.`],
    pistas: ['Usa la fórmula unidad.', 'Los paréntesis multiplican todo el grupo.', 'Suma masa atómica × número de átomos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s5-p2', subtema: 'n1-b7-s5', titulo: 'Composición de un hidrato', dificultad: 'intermedia',
    objetivo: 'Calcular el porcentaje en masa de agua o de sal anhidra en un hidrato.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('3.1', 'los hidratos', 'masas'), idealizado: 'Hidrato con el número exacto de moléculas de agua.', metodo: 'masa fórmula sumada átomo a átomo',
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDRATOS.length), q: rengIndice(rengRng, 2) }),
    respuesta: (rengD) => {
      const [rengS, rengK] = RENG_HIDRATOS[rengD.h]!
      const rengAgua = rengK * rengMmEst('H2O')
      const rengPctAgua = (100 * rengAgua) / (rengMmEst(rengS) + rengAgua)
      return rengD.q === 0 ? rengPctAgua : 100 - rengPctAgua
    },
    errores: (rengD) => {
      const [rengS, rengK] = RENG_HIDRATOS[rengD.h]!
      const rengUno = (100 * rengMmEst('H2O')) / (rengMmEst(rengS) + rengMmEst('H2O'))
      const rengSobreAnhidro = (100 * rengK * rengMmEst('H2O')) / rengMmEst(rengS)
      return [
        ['una-molecula', 'Una sola molécula de agua', rengD.q === 0 ? rengUno : 100 - rengUno, `Contaste una sola molécula de agua. El hidrato tiene ${rengK} por fórmula unidad.`],
        ['sobre-anhidro', 'Dividir entre la sal anhidra', rengD.q === 0 ? rengSobreAnhidro : 100 - rengSobreAnhidro, 'Dividiste entre la masa de la sal anhidra. El porcentaje se calcula sobre la masa total del hidrato.']
      ]
    },
    enunciado: (rengD) => `Se considera el hidrato ${rengTextoHidrato(RENG_HIDRATOS[rengD.h]!)}. Masas de la tabla de la app: ${rengTexto(RENG_HIDRATOS[rengD.h]![0])} ${rengTx(rengMmEst(RENG_HIDRATOS[rengD.h]![0]), 5)} y H₂O ${rengTx(rengMmEst('H2O'), 5)} g/mol.`,
    pregunta: (rengD) => (rengD.q === 0 ? '¿Qué porcentaje de su masa es agua?' : '¿Qué porcentaje de su masa es sal anhidra?'),
    datos: (rengD) => [['Hidrato', rengTextoHidrato(RENG_HIDRATOS[rengD.h]!)], rengDatoMasa(RENG_HIDRATOS[rengD.h]![0]), rengDatoMasa('H2O')],
    pasos: (rengD, rengR) => [`Masa fórmula: ${rengTx(rengMmEst(RENG_HIDRATOS[rengD.h]![0]), 5)} + ${RENG_HIDRATOS[rengD.h]![1]} × ${rengTx(rengMmEst('H2O'), 5)} = ${rengTx(rengMmEst(RENG_HIDRATOS[rengD.h]![0]) + RENG_HIDRATOS[rengD.h]![1] * rengMmEst('H2O'), 5)}.`, `Porcentaje pedido: ${rengTx(rengR)} %.`],
    pistas: ['Suma el agua indicada tras el punto.', 'Calcula la masa fórmula completa del hidrato.', 'Divide la parte pedida entre el total.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s5-p3', subtema: 'n1-b7-s5', titulo: 'Masa perdida al deshidratar', dificultad: 'avanzada',
    objetivo: 'Calcular la masa que pierde un hidrato al calentarlo hasta la sal anhidra.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.1', 'los hidratos', 'masas'), idealizado: 'Deshidratación completa sin descomponer la sal.', metodo: 'moles de hidrato y masa del agua que contienen',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 1, 25, 0.5), h: rengIndice(rengRng, RENG_HIDRATOS.length) }),
    respuesta: (rengD) => {
      const [rengS, rengK] = RENG_HIDRATOS[rengD.h]!
      return (rengD.m * rengK * rengMmEst('H2O')) / (rengMmEst(rengS) + rengK * rengMmEst('H2O'))
    },
    errores: (rengD) => {
      const [rengS, rengK] = RENG_HIDRATOS[rengD.h]!
      const rengTotal = rengMmEst(rengS) + rengK * rengMmEst('H2O')
      return [
        ['masa-anhidra', 'Masa de sal anhidra', (rengD.m * rengMmEst(rengS)) / rengTotal, 'Calculaste la masa de sal que queda, no la masa de agua que se pierde.'],
        ['una-molecula', 'Una sola molécula de agua', (rengD.m * rengMmEst('H2O')) / rengTotal, `Contaste una sola molécula de agua por fórmula unidad; hay ${rengK}.`]
      ]
    },
    enunciado: (rengD) => `Se calientan ${rengTx(rengD.m)} g de ${rengTextoHidrato(RENG_HIDRATOS[rengD.h]!)} hasta eliminar toda el agua.`,
    pregunta: () => '¿Cuántos gramos de masa se pierden?',
    datos: (rengD) => [['Masa de hidrato', `${rengTx(rengD.m)} g`], rengDatoMasa(RENG_HIDRATOS[rengD.h]![0]), rengDatoMasa('H2O')],
    pasos: (rengD, rengR) => [`Fracción de agua = ${RENG_HIDRATOS[rengD.h]![1]} × M(H₂O) / M(hidrato).`, `Masa perdida = ${rengTx(rengD.m)} × fracción = ${rengTx(rengR)} g.`],
    pistas: ['Lo que se pierde es el agua.', 'Calcula la fracción en masa de agua del hidrato.', 'Multiplícala por la masa de hidrato.']
  })
]

export const RENG_PRACTICAS_B07_S06: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s6-p1', subtema: 'n1-b7-s6', titulo: 'Porcentaje de un elemento', dificultad: 'basica',
    objetivo: 'Calcular el porcentaje en masa de un elemento en un compuesto.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('3.2', 'la composición porcentual', 'masas'), idealizado: 'Compuesto puro.', metodo: 'cien menos los porcentajes de los demás elementos',
    parametros: (rengRng) => ({ k: rengIndice(rengRng, RENG_PARES_COMPOSICION.length) }),
    valida: (rengD) => rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) > 3 && rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) < 97,
    respuesta: (rengD) => rengPct(...RENG_PARES_COMPOSICION[rengD.k]!),
    errores: (rengD) => {
      const [rengF, rengEl] = RENG_PARES_COMPOSICION[rengD.k]!
      return [
        ['sin-subindice', 'Un solo átomo del elemento', (100 * rengMasaAt(rengEl)) / rengMmEst(rengF), 'Contaste un solo átomo del elemento. Multiplica su masa atómica por el subíndice que tiene en la fórmula.'],
        ['por-atomos', 'Porcentaje de átomos', (100 * rengSubindiceDe(rengF, rengEl)) / rengTotalAtomos(rengF), 'Calculaste el porcentaje de átomos, no de masa. Cada átomo pesa distinto: usa las masas atómicas.']
      ]
    },
    enunciado: (rengD) => `Se analiza el compuesto ${rengTexto(RENG_PARES_COMPOSICION[rengD.k]![0])}. Masas atómicas de la tabla de la app: ${rengTextoMasasAt(RENG_PARES_COMPOSICION[rengD.k]![0])} g/mol.`,
    pregunta: (rengD) => `¿Qué porcentaje en masa de ${RENG_PARES_COMPOSICION[rengD.k]![1]} tiene?`,
    datos: (rengD) => [['Fórmula', rengTexto(RENG_PARES_COMPOSICION[rengD.k]![0])], rengDatoMasa(RENG_PARES_COMPOSICION[rengD.k]![0])],
    pasos: (rengD, rengR) => [`Masa de ${RENG_PARES_COMPOSICION[rengD.k]![1]} por mol: ${rengSubindiceDe(...RENG_PARES_COMPOSICION[rengD.k]!)} × ${rengTx(rengMasaAt(RENG_PARES_COMPOSICION[rengD.k]![1]), 5)} g.`, `% = ${rengTx(rengR)} %.`],
    pistas: ['Cuenta los átomos del elemento en la fórmula.', 'Calcula la masa molar completa.', '% = masa del elemento / masa molar × 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s6-p2', subtema: 'n1-b7-s6', titulo: 'Masa de un elemento en una muestra', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de un elemento contenida en una masa de compuesto.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.2', 'la composición porcentual', 'masas'), idealizado: 'Compuesto puro.', metodo: 'moles de compuesto, moles de átomos del elemento y su masa',
    parametros: (rengRng) => ({ k: rengIndice(rengRng, RENG_PARES_COMPOSICION.length), m: rengEntreN1(rengRng, 5, 500, 5) }),
    valida: (rengD) => rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) > 3 && rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) < 97,
    respuesta: (rengD) => (rengD.m * rengPct(...RENG_PARES_COMPOSICION[rengD.k]!)) / 100,
    errores: (rengD) => {
      const [rengF, rengEl] = RENG_PARES_COMPOSICION[rengD.k]!
      return [
        ['sin-subindice', 'Un solo átomo del elemento', (rengD.m * rengMasaAt(rengEl)) / rengMmEst(rengF), 'Usaste un solo átomo del elemento por fórmula. Multiplica por su subíndice.'],
        ['resto', 'Masa del resto', rengD.m - (rengD.m * rengPct(rengF, rengEl)) / 100, 'Calculaste la masa de los demás elementos, no la del elemento pedido.']
      ]
    },
    enunciado: (rengD) => `Una muestra de ${rengTx(rengD.m)} g de ${rengTexto(RENG_PARES_COMPOSICION[rengD.k]![0])} puro.`,
    pregunta: (rengD) => `¿Cuántos gramos de ${RENG_PARES_COMPOSICION[rengD.k]![1]} contiene?`,
    datos: (rengD) => [['Masa de muestra', `${rengTx(rengD.m)} g`], rengDatoMasa(RENG_PARES_COMPOSICION[rengD.k]![0]), [`Masa atómica de ${RENG_PARES_COMPOSICION[rengD.k]![1]}`, `${rengTx(rengMasaAt(RENG_PARES_COMPOSICION[rengD.k]![1]), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Fracción en masa de ${RENG_PARES_COMPOSICION[rengD.k]![1]}: ${rengTx(rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) / 100, 4)}.`, `Masa = ${rengTx(rengD.m)} × ${rengTx(rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) / 100, 4)} = ${rengTx(rengR)} g.`],
    pistas: ['Calcula la fracción en masa del elemento.', 'Multiplícala por la masa de la muestra.', 'Cuenta todos sus átomos en la fórmula.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s6-p3', subtema: 'n1-b7-s6', titulo: 'Compuesto necesario para aportar un elemento', dificultad: 'avanzada',
    objetivo: 'Calcular la masa de compuesto que contiene una masa dada de un elemento.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.2', 'la composición porcentual', 'masas'), idealizado: 'Compuesto puro.', metodo: 'moles de átomos del elemento y moles de compuesto que los contienen',
    parametros: (rengRng) => ({ k: rengIndice(rengRng, RENG_PARES_COMPOSICION.length), m: rengEntreN1(rengRng, 1, 100, 1) }),
    valida: (rengD) => rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) > 3 && rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) < 97,
    respuesta: (rengD) => (rengD.m * 100) / rengPct(...RENG_PARES_COMPOSICION[rengD.k]!),
    errores: (rengD) => [
      ['multiplica', 'Multiplicar por la fracción', (rengD.m * rengPct(...RENG_PARES_COMPOSICION[rengD.k]!)) / 100, 'Multiplicaste por la fracción del elemento. Si el elemento es solo una parte del compuesto, hace falta más compuesto: hay que dividir.'],
      ['sin-subindice', 'Un solo átomo del elemento', (rengD.m * rengMmEst(RENG_PARES_COMPOSICION[rengD.k]![0])) / rengMasaAt(RENG_PARES_COMPOSICION[rengD.k]![1]), 'Contaste un solo átomo del elemento por fórmula; multiplica su masa por el subíndice.']
    ],
    enunciado: (rengD) => `Se necesita aportar ${rengTx(rengD.m)} g de ${RENG_PARES_COMPOSICION[rengD.k]![1]} usando ${rengTexto(RENG_PARES_COMPOSICION[rengD.k]![0])} puro.`,
    pregunta: () => '¿Qué masa de compuesto hay que usar, en g?',
    datos: (rengD) => [[`Masa de ${RENG_PARES_COMPOSICION[rengD.k]![1]} necesaria`, `${rengTx(rengD.m)} g`], rengDatoMasa(RENG_PARES_COMPOSICION[rengD.k]![0])],
    pasos: (rengD, rengR) => [`Fracción en masa del elemento: ${rengTx(rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) / 100, 4)}.`, `Masa de compuesto = ${rengTx(rengD.m)} / ${rengTx(rengPct(...RENG_PARES_COMPOSICION[rengD.k]!) / 100, 4)} = ${rengTx(rengR)} g.`],
    pistas: ['¿Qué fracción del compuesto es el elemento?', 'La masa de compuesto es mayor que la del elemento.', 'Divide la masa del elemento entre su fracción.']
  })
]

export const RENG_PRACTICAS_B07_S07: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-s7-p1', subtema: 'n1-b7-s7', titulo: 'Hidrocarburo a partir de su composición', dificultad: 'basica',
    objetivo: 'Obtener la razón H/C de un hidrocarburo a partir de sus porcentajes en masa.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.2', 'la fórmula empírica', 'masas'), idealizado: 'Análisis exacto (porcentajes con dos decimales).', metodo: 'cociente de porcentajes corregido por el cociente de masas atómicas',
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDROCARBUROS.length), q: rengIndice(rengRng, 2) }),
    respuesta: (rengD) => {
      const [rengC, rengH] = rengPctHc(RENG_HIDROCARBUROS[rengD.h]!)
      return rengD.q === 0 ? rengH / rengMasaAt('H') / (rengC / rengMasaAt('C')) : rengC / rengMasaAt('C') / (rengH / rengMasaAt('H'))
    },
    errores: (rengD) => {
      const [rengC, rengH] = rengPctHc(RENG_HIDROCARBUROS[rengD.h]!)
      return [
        ['porcentajes', 'Cociente de porcentajes', rengD.q === 0 ? rengH / rengC : rengC / rengH, 'Dividiste los porcentajes directamente. Primero hay que pasar cada masa a moles con su masa atómica.'],
        ['invertida', 'Razón invertida', rengD.q === 0 ? rengC / rengMasaAt('C') / (rengH / rengMasaAt('H')) : rengH / rengMasaAt('H') / (rengC / rengMasaAt('C')), 'Calculaste la razón al revés. Fíjate en qué átomo va en el numerador según la pregunta.']
      ]
    },
    enunciado: (rengD) => `Un hidrocarburo tiene ${rengTx(rengPctHc(RENG_HIDROCARBUROS[rengD.h]!)[0], 4)} % de C y ${rengTx(rengPctHc(RENG_HIDROCARBUROS[rengD.h]!)[1], 4)} % de H en masa.`,
    pregunta: (rengD) => (rengD.q === 0 ? '¿Cuántos átomos de H hay por cada átomo de C?' : '¿Cuántos átomos de C hay por cada átomo de H?'),
    datos: (rengD) => [['Carbono', `${rengTx(rengPctHc(RENG_HIDROCARBUROS[rengD.h]!)[0], 4)} %`], ['Hidrógeno', `${rengTx(rengPctHc(RENG_HIDROCARBUROS[rengD.h]!)[1], 4)} %`], ['Masas atómicas', `C ${rengTx(rengMasaAt('C'), 5)} · H ${rengTx(rengMasaAt('H'), 4)} g/mol`]],
    pasos: (rengD, rengR) => [`En 100 g: n(C) = ${rengTx(rengPctHc(RENG_HIDROCARBUROS[rengD.h]!)[0] / rengMasaAt('C'), 4)} mol; n(H) = ${rengTx(rengPctHc(RENG_HIDROCARBUROS[rengD.h]!)[1] / rengMasaAt('H'), 4)} mol.`, `Razón pedida = ${rengTx(rengR)}.`],
    pistas: ['Toma 100 g de compuesto.', 'Pasa cada masa a moles de átomos.', 'Divide los moles en el orden que pide la pregunta.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s7-p2', subtema: 'n1-b7-s7', titulo: 'Fórmula empírica de un compuesto con oxígeno', dificultad: 'intermedia',
    objetivo: 'Calcular la razón de átomos respecto del oxígeno en un compuesto de C, H y O.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.2', 'la fórmula empírica', 'masas'), idealizado: 'Análisis exacto (porcentajes con dos decimales).', metodo: 'cociente de porcentajes corregido por el cociente de masas atómicas',
    parametros: (rengRng) => ({ e: rengIndice(rengRng, RENG_EMPIRICAS.length), q: rengIndice(rengRng, 2) }),
    respuesta: (rengD) => {
      const [rengC, rengH, rengO] = rengPctEmp(RENG_EMPIRICAS[rengD.e]!)
      return (rengD.q === 0 ? rengC / rengMasaAt('C') : rengH / rengMasaAt('H')) / (rengO / rengMasaAt('O'))
    },
    errores: (rengD) => {
      const [rengC, rengH, rengO] = rengPctEmp(RENG_EMPIRICAS[rengD.e]!)
      return [
        ['porcentajes', 'Cociente de porcentajes', (rengD.q === 0 ? rengC : rengH) / rengO, 'Dividiste porcentajes en masa. Hay que comparar moles de átomos: divide cada porcentaje entre su masa atómica.'],
        ['invertida', 'Razón invertida', rengO / rengMasaAt('O') / (rengD.q === 0 ? rengC / rengMasaAt('C') : rengH / rengMasaAt('H')), 'Pusiste el oxígeno en el numerador. La pregunta pide átomos del otro elemento por cada átomo de oxígeno.']
      ]
    },
    enunciado: (rengD) => `Un compuesto tiene ${rengTx(rengPctEmp(RENG_EMPIRICAS[rengD.e]!)[0], 4)} % de C, ${rengTx(rengPctEmp(RENG_EMPIRICAS[rengD.e]!)[1], 4)} % de H y ${rengTx(rengPctEmp(RENG_EMPIRICAS[rengD.e]!)[2], 4)} % de O en masa.`,
    pregunta: (rengD) => `¿Cuántos átomos de ${rengD.q === 0 ? 'C' : 'H'} hay por cada átomo de O en la fórmula empírica?`,
    datos: (rengD) => [['C', `${rengTx(rengPctEmp(RENG_EMPIRICAS[rengD.e]!)[0], 4)} %`], ['H', `${rengTx(rengPctEmp(RENG_EMPIRICAS[rengD.e]!)[1], 4)} %`], ['O', `${rengTx(rengPctEmp(RENG_EMPIRICAS[rengD.e]!)[2], 4)} %`]],
    pasos: (rengD, rengR) => [`En 100 g: n(C) = ${rengTx(rengPctEmp(RENG_EMPIRICAS[rengD.e]!)[0] / rengMasaAt('C'), 4)}, n(H) = ${rengTx(rengPctEmp(RENG_EMPIRICAS[rengD.e]!)[1] / rengMasaAt('H'), 4)}, n(O) = ${rengTx(rengPctEmp(RENG_EMPIRICAS[rengD.e]!)[2] / rengMasaAt('O'), 4)} mol.`, `Razón pedida = ${rengTx(rengR)}.`],
    pistas: ['Toma 100 g de compuesto.', 'Pasa los tres porcentajes a moles.', 'Divide entre los moles de oxígeno.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-s7-p3', subtema: 'n1-b7-s7', titulo: 'Análisis por combustión', dificultad: 'avanzada',
    objetivo: 'Deducir la razón H/C de un compuesto a partir de las masas de CO₂ y H₂O de su combustión.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.2', 'el análisis por combustión', 'masas'), idealizado: 'Combustión completa; todo el C pasa a CO₂ y todo el H a agua.', metodo: 'masas de C y H contenidas en el CO₂ y en el agua, pasadas a moles',
    parametros: (rengRng) => ({ e: rengIndice(rengRng, RENG_EMPIRICAS.length), m: rengEntreN1(rengRng, 0.1, 0.9, 0.01) }),
    respuesta: (rengD) => {
      const rengE = RENG_EMPIRICAS[rengD.e]!
      const rengN = rengD.m / rengMmEst(rengE[0])
      const rengCO2 = Math.round(rengN * rengE[1] * rengMmEst('CO2') * 1000) / 1000
      const rengH2O = Math.round(((rengN * rengE[2]) / 2) * rengMmEst('H2O') * 1000) / 1000
      return ((2 * rengH2O) / rengMmEst('H2O')) / (rengCO2 / rengMmEst('CO2'))
    },
    errores: (rengD) => {
      const rengE = RENG_EMPIRICAS[rengD.e]!
      const rengN = rengD.m / rengMmEst(rengE[0])
      const rengCO2 = Math.round(rengN * rengE[1] * rengMmEst('CO2') * 1000) / 1000
      const rengH2O = Math.round(((rengN * rengE[2]) / 2) * rengMmEst('H2O') * 1000) / 1000
      return [
        ['sin-dos', 'Olvidar los dos H del agua', rengH2O / rengMmEst('H2O') / (rengCO2 / rengMmEst('CO2')), 'Cada molécula de agua contiene dos átomos de hidrógeno: los moles de H son el doble de los de agua.'],
        ['masas', 'Comparar masas', rengH2O / rengCO2, 'Dividiste las masas de agua y de CO₂. Hay que pasar a moles de átomos de H y de C.']
      ]
    },
    enunciado: (rengD) => {
      const rengE = RENG_EMPIRICAS[rengD.e]!
      const rengN = rengD.m / rengMmEst(rengE[0])
      return `Al quemar ${rengTx(rengD.m)} g de un compuesto de C, H y O se obtienen ${rengTx(Math.round(rengN * rengE[1] * rengMmEst('CO2') * 1000) / 1000, 4)} g de CO₂ y ${rengTx(Math.round(((rengN * rengE[2]) / 2) * rengMmEst('H2O') * 1000) / 1000, 4)} g de H₂O.`
    },
    pregunta: () => '¿Cuántos átomos de H hay por cada átomo de C?',
    datos: (rengD) => [['Masa de muestra', `${rengTx(rengD.m)} g`], rengDatoMasa('CO2'), rengDatoMasa('H2O')],
    pasos: (rengD, rengR) => ['n(C) = masa de CO₂ / M(CO₂).', 'n(H) = 2 × masa de agua / M(H₂O).', `H/C = ${rengTx(rengR)}.`],
    pistas: ['Todo el C del compuesto acaba en el CO₂.', 'Todo el H acaba en el agua, con dos H por molécula.', 'Compara moles de átomos.']
  })
]
