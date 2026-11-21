import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_KW_AB, RENG_KW_SIN_VERIFICAR, RENG_POLIPROTICOS_AB, RENG_TOL_AB, RENG_TOL_AB_PCT, RENG_TOL_PH, rengCientifico, rengFuentesAb, rengLog, rengRaizCuadratica, rengTextoAb, rengValorCient } from './b10-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const KW = RENG_KW_AB
const KW_SV = [RENG_KW_SIN_VERIFICAR]
type D = Readonly<Record<string, number>>
const ka = (rengD: D): number => rengValorCient(rengD.km!, rengD.ke!)

export const RENG_PRACTICAS_B10_S09: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s9-p1', subtema: 'n1-b10-s9', titulo: 'pH a partir de [H₃O⁺]', dificultad: 'basica',
    objetivo: 'Calcular el pH de una disolución a partir de su concentración de H₃O⁺.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.2', 'la definición de pH'), idealizado: 'Concentración como actividad.', metodo: 'logaritmo natural dividido entre ln 10',
    parametros: (rengRng) => ({ cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 1, 13, 1) }),
    respuesta: (rengD) => -rengLog(rengValorCient(rengD.cm, rengD.ce)),
    errores: (rengD) => [
      ['ln', 'Logaritmo natural', -Math.log(rengValorCient(rengD.cm, rengD.ce)), 'Usaste el logaritmo natural; el pH se define con log₁₀.'],
      ['signo', 'Sin el signo menos', rengLog(rengValorCient(rengD.cm, rengD.ce)), 'Olvidaste el signo menos de la definición: pH = −log[H₃O⁺].']
    ],
    enunciado: (rengD) => `Una disolución tiene [H₃O⁺] = ${rengCientifico(rengD.cm, rengD.ce)} mol/L.`,
    pregunta: () => '¿Cuál es su pH?',
    datos: (rengD) => [['[H₃O⁺]', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`], ['Definición', 'pH = −log₁₀ [H₃O⁺]']],
    pasos: (rengD, rengR) => ['pH = −log₁₀ [H₃O⁺].', `pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Usa la definición de pH.', 'Cuida el signo menos.', 'log(a·10⁻ⁿ) = log a − n.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s9-p2', subtema: 'n1-b10-s9', titulo: '[H₃O⁺] a partir del pH', dificultad: 'intermedia',
    objetivo: 'Calcular la concentración de H₃O⁺ a partir del pH de una disolución.', unidad: 'µmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.2', 'la definición de pH'), idealizado: 'Concentración como actividad.', metodo: 'potencia calculada con la exponencial natural y conversión a µmol/L',
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, 3.5, 7, 0.01) }),
    respuesta: (rengD) => 10 ** -rengD.h * 1e6,
    errores: (rengD) => [
      ['mmol', 'En mmol/L', 10 ** -rengD.h * 1e3, 'Ese número son mmol/L; la pregunta pide µmol/L, mil veces más.'],
      ['oh', '[OH⁻] en lugar de [H₃O⁺]', 10 ** -(14 - rengD.h) * 1e6, 'Calculaste [OH⁻] con el pOH; la pregunta pide [H₃O⁺].']
    ],
    enunciado: (rengD) => `Un agua de lluvia tiene pH ${rengTx(rengD.h, 3)} (dato didáctico) a 25 °C.`,
    pregunta: () => '¿Cuál es su [H₃O⁺], en µmol/L?',
    datos: (rengD) => [['pH', rengTx(rengD.h, 3)], ['1 µmol/L', '10⁻⁶ mol/L']],
    pasos: (rengD, rengR) => [`[H₃O⁺] = 10^(−${rengTx(rengD.h, 3)}) mol/L.`, `= ${rengTx(rengR)} µmol/L.`],
    pistas: ['[H₃O⁺] = 10^(−pH).', 'Obtienes mol/L.', 'Multiplica por 10⁶ para µmol/L.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s9-p3', subtema: 'n1-b10-s9', titulo: 'Cuántas veces más ácida', dificultad: 'avanzada',
    objetivo: 'Comparar la acidez de dos disoluciones a partir de sus pH usando la escala logarítmica.', unidad: '', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.2', 'la escala de pH'), idealizado: 'Concentraciones como actividades.', metodo: 'cociente de las concentraciones calculadas por separado',
    parametros: (rengRng) => ({ h1: rengEntreN1(rengRng, 1.5, 6, 0.1), d: rengEntreN1(rengRng, 0.5, 4, 0.1) }),
    respuesta: (rengD) => 10 ** rengD.d,
    errores: (rengD) => [
      ['diferencia', 'Diferencia de pH', rengD.d, 'Diste la diferencia de pH; cada unidad es un factor 10, así que el cociente es 10 elevado a esa diferencia.'],
      ['cociente-ph', 'Cociente de pH', (rengD.h1 + rengD.d) / rengD.h1, 'Dividiste los pH; la escala es logarítmica y hay que comparar las concentraciones.']
    ],
    enunciado: (rengD) => `Un zumo tiene pH ${rengTx(rengD.h1, 3)} y una bebida, pH ${rengTx(rengD.h1 + rengD.d, 3)} (datos didácticos).`,
    pregunta: () => '¿Cuántas veces mayor es [H₃O⁺] en el zumo que en la bebida? (escribe solo el número)',
    datos: (rengD) => [['pH del zumo', rengTx(rengD.h1, 3)], ['pH de la bebida', rengTx(rengD.h1 + rengD.d, 3)]],
    pasos: (rengD, rengR) => [`La diferencia es ${rengTx(rengD.d, 3)} unidades de pH.`, `Cociente = 10^${rengTx(rengD.d, 3)} = ${rengTx(rengR)}.`],
    pistas: ['Cada unidad de pH es un factor 10.', 'Calcula la diferencia de pH.', 'Eleva 10 a esa diferencia.']
  })
]

export const RENG_PRACTICAS_B10_S10: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s10-p1', subtema: 'n1-b10-s10', titulo: 'pOH a partir de [OH⁻]', dificultad: 'basica',
    objetivo: 'Calcular el pOH de una disolución a partir de su concentración de OH⁻.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.2', 'el pOH'), idealizado: 'Concentración como actividad.', metodo: 'mantisa y exponente del logaritmo por separado',
    parametros: (rengRng) => ({ cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 1, 13, 1) }),
    respuesta: (rengD) => -rengLog(rengValorCient(rengD.cm, rengD.ce)),
    errores: (rengD) => [
      ['ph', 'pH en lugar de pOH', 14 + rengLog(rengValorCient(rengD.cm, rengD.ce)), 'Diste el pH; la pregunta pide el pOH, que es −log[OH⁻].'],
      ['ln', 'Logaritmo natural', -Math.log(rengValorCient(rengD.cm, rengD.ce)), 'Usaste el logaritmo natural; el pOH se define con log₁₀.']
    ],
    enunciado: (rengD) => `Una disolución tiene [OH⁻] = ${rengCientifico(rengD.cm, rengD.ce)} mol/L a 25 °C.`,
    pregunta: () => '¿Cuál es su pOH?',
    datos: (rengD) => [['[OH⁻]', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`], ['Definición', 'pOH = −log₁₀ [OH⁻]']],
    pasos: (rengD, rengR) => ['pOH = −log₁₀ [OH⁻].', `pOH = ${rengTx(rengR, 4)}.`],
    pistas: ['Usa la definición de pOH.', 'Cuida el signo menos.', 'log(a·10⁻ⁿ) = log a − n.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s10-p2', subtema: 'n1-b10-s10', titulo: 'pOH a partir del pH', dificultad: 'intermedia',
    objetivo: 'Calcular el pOH a partir del pH con pH + pOH = 14 a 25 °C.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.2', 'el pOH'), idealizado: '25 °C, pKw = 14,00.', metodo: '[H₃O⁺], luego [OH⁻] = Kw/[H₃O⁺] y su logaritmo', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, 0.5, 13.5, 0.01) }),
    valida: (rengD) => Math.abs(rengD.h - 7) > 0.2,
    respuesta: (rengD) => 14 - rengD.h,
    errores: (rengD) => [
      ['igual', 'Igual que el pH', rengD.h, 'pH y pOH solo coinciden en 7; aquí pOH = 14 − pH.'],
      ['suma', 'Suma', 14 + rengD.h, 'Sumaste en lugar de restar: pOH = 14 − pH.']
    ],
    enunciado: (rengD) => `Una disolución tiene pH ${rengTx(rengD.h, 4)} a 25 °C (pKw = 14,00).`,
    pregunta: () => '¿Cuál es su pOH?',
    datos: (rengD) => [['pH', rengTx(rengD.h, 4)], ['pKw', '14,00']],
    pasos: (rengD, rengR) => ['pH + pOH = 14,00.', `pOH = 14,00 − ${rengTx(rengD.h, 4)} = ${rengTx(rengR, 4)}.`],
    pistas: ['pH + pOH = 14 a 25 °C.', 'Despeja el pOH.', 'Comprueba si es ácida o básica.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s10-p3', subtema: 'n1-b10-s10', titulo: '[OH⁻] a partir del pH', dificultad: 'avanzada',
    objetivo: 'Calcular la concentración de OH⁻ de una disolución básica a partir de su pH.', unidad: 'mmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.2', 'el pOH'), idealizado: '25 °C, pKw = 14,00.', metodo: 'Kw dividido entre [H₃O⁺] y conversión a mmol/L', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, 10.5, 13.5, 0.01) }),
    respuesta: (rengD) => 10 ** (rengD.h - 14) * 1000,
    errores: (rengD) => [
      ['h', '[H₃O⁺] en lugar de [OH⁻]', 10 ** -rengD.h * 1000, 'Calculaste [H₃O⁺]; para [OH⁻] usa el pOH = 14 − pH.'],
      ['mol', 'En mol/L', 10 ** (rengD.h - 14), 'Ese valor está en mol/L; la pregunta pide mmol/L, mil veces más.']
    ],
    enunciado: (rengD) => `Un limpiador tiene pH ${rengTx(rengD.h, 4)} a 25 °C (pKw = 14,00; dato didáctico).`,
    pregunta: () => '¿Cuál es su [OH⁻], en mmol/L?',
    datos: (rengD) => [['pH', rengTx(rengD.h, 4)], ['pKw', '14,00']],
    pasos: (rengD, rengR) => [`pOH = 14 − ${rengTx(rengD.h, 4)} = ${rengTx(14 - rengD.h, 4)}.`, `[OH⁻] = 10^(−pOH) = ${rengTx(rengR)} mmol/L.`],
    pistas: ['Calcula el pOH.', '[OH⁻] = 10^(−pOH).', 'Pasa a mmol/L.']
  })
]

export const RENG_PRACTICAS_B10_S11: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s11-p1', subtema: 'n1-b10-s11', titulo: '[OH⁻] con Kw', dificultad: 'basica',
    objetivo: 'Calcular [OH⁻] a partir de [H₃O⁺] con el producto iónico del agua.', unidad: 'nmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.2', 'el producto iónico del agua'), idealizado: '25 °C, Kw = 1,0·10⁻¹⁴.', metodo: 'pOH = 14 − pH y conversión a nmol/L', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 6, 7, 1) }),
    valida: (rengD) => rengValorCient(rengD.cm, rengD.ce) > 1.2e-7 || rengValorCient(rengD.cm, rengD.ce) < 0.8e-7,
    respuesta: (rengD) => (KW / rengValorCient(rengD.cm, rengD.ce)) * 1e9,
    errores: (rengD) => [
      ['h', 'Diste [H₃O⁺]', rengValorCient(rengD.cm, rengD.ce) * 1e9, 'Diste [H₃O⁺]; [OH⁻] es Kw dividido entre [H₃O⁺].'],
      ['umol', 'En µmol/L', (KW / rengValorCient(rengD.cm, rengD.ce)) * 1e6, 'Ese número son µmol/L; la pregunta pide nmol/L, mil veces más.']
    ],
    enunciado: (rengD) => `Una disolución tiene [H₃O⁺] = ${rengCientifico(rengD.cm, rengD.ce)} mol/L a 25 °C (Kw = 1,0·10⁻¹⁴).`,
    pregunta: () => '¿Cuál es su [OH⁻], en nmol/L?',
    datos: (rengD) => [['[H₃O⁺]', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`], ['Kw', '1,0·10⁻¹⁴']],
    pasos: (rengD, rengR) => ['[OH⁻] = Kw / [H₃O⁺].', `[OH⁻] = ${rengTx(rengR / 1e9)} mol/L = ${rengTx(rengR)} nmol/L.`],
    pistas: ['Kw = [H₃O⁺]·[OH⁻].', 'Despeja [OH⁻].', '1 nmol/L = 10⁻⁹ mol/L.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s11-p2', subtema: 'n1-b10-s11', titulo: 'pH de una base a otra temperatura', dificultad: 'intermedia',
    objetivo: 'Calcular el pH de una disolución de OH⁻ conocido cuando Kw no es el de 25 °C.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.2', 'el producto iónico del agua'), idealizado: 'Kw didáctico a otra temperatura.', metodo: 'pKw − pOH con logaritmos separados',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.1, 9.6, 0.01), cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 1, 3, 1) }),
    valida: (rengD) => Math.abs(rengLog(rengD.m)) > 0.2,
    respuesta: (rengD) => -rengLog((rengD.m * 1e-14) / rengValorCient(rengD.cm, rengD.ce)),
    errores: (rengD) => [
      ['kw-25', 'Kw de 25 °C', 14 + rengLog(rengValorCient(rengD.cm, rengD.ce)), 'Usaste Kw = 10⁻¹⁴, que solo vale a 25 °C; aquí Kw es otro.'],
      ['poh', 'pOH', -rengLog(rengValorCient(rengD.cm, rengD.ce)), 'Diste el pOH; el pH es pKw − pOH.']
    ],
    enunciado: (rengD) => `A cierta temperatura, Kw = ${rengCientifico(rengD.m, 14)} (dato didáctico). Una disolución tiene [OH⁻] = ${rengCientifico(rengD.cm, rengD.ce)} mol/L.`,
    pregunta: () => '¿Cuál es su pH a esa temperatura?',
    datos: (rengD) => [['Kw', rengCientifico(rengD.m, 14)], ['[OH⁻]', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`]],
    pasos: (rengD, rengR) => [`[H₃O⁺] = Kw/[OH⁻] = ${rengTx(10 ** -rengR)} mol/L.`, `pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Usa el Kw de esa temperatura.', '[H₃O⁺] = Kw/[OH⁻].', 'Toma −log₁₀ del resultado.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s11-p3', subtema: 'n1-b10-s11', titulo: 'pKw a partir del pH neutro', dificultad: 'avanzada',
    objetivo: 'Deducir el pKw de una temperatura a partir del pH de una disolución neutra.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.2', 'el producto iónico del agua'), idealizado: 'Disolución neutra a temperatura fija.', metodo: 'Kw = [H₃O⁺]² y logaritmo',
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, 6, 7.5, 0.01) }),
    valida: (rengD) => Math.abs(rengD.h - 7) > 0.1,
    respuesta: (rengD) => 2 * rengD.h,
    errores: (rengD) => [
      ['catorce', 'Siempre 14', 14, 'Diste 14, que es el pKw de 25 °C; aquí el neutro tiene otro pH.'],
      ['ph', 'Igual que el pH', rengD.h, 'Diste el pH; en una disolución neutra pKw = 2·pH.']
    ],
    enunciado: (rengD) => `A cierta temperatura, una disolución neutra tiene pH ${rengTx(rengD.h, 3)} (dato didáctico).`,
    pregunta: () => '¿Cuál es el pKw a esa temperatura?',
    datos: (rengD) => [['pH neutro', rengTx(rengD.h, 3)], ['Neutra', '[H₃O⁺] = [OH⁻]']],
    pasos: (rengD, rengR) => ['Neutra: [H₃O⁺] = [OH⁻], así que Kw = [H₃O⁺]².', `pKw = 2 · pH = ${rengTx(rengR, 4)}.`],
    pistas: ['¿Qué significa neutra?', 'Kw = [H₃O⁺]².', 'pKw = 2 · pH.']
  })
]

export const RENG_PRACTICAS_B10_S12: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s12-p1', subtema: 'n1-b10-s12', titulo: 'pKa a partir de Ka', dificultad: 'basica',
    objetivo: 'Calcular el pKa de un ácido débil a partir de su Ka.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las constantes de acidez'), idealizado: 'Ka didáctica.', metodo: 'logaritmo natural dividido entre ln 10',
    parametros: (rengRng) => ({ km: rengEntreN1(rengRng, 1.5, 9.9, 0.1), ke: rengEntreN1(rengRng, 2, 10, 1) }),
    respuesta: (rengD) => -rengLog(ka(rengD)),
    errores: (rengD) => [
      ['ln', 'Logaritmo natural', -Math.log(ka(rengD)), 'Usaste el logaritmo natural; el pKa se define con log₁₀.'],
      ['exponente', 'Solo el exponente', rengD.ke, 'Tomaste solo el exponente; la mantisa también cuenta: pKa = n − log a.']
    ],
    enunciado: (rengD) => `Un ácido débil tiene Ka = ${rengCientifico(rengD.km, rengD.ke)} (dato didáctico).`,
    pregunta: () => '¿Cuál es su pKa?',
    datos: (rengD) => [['Ka', rengCientifico(rengD.km, rengD.ke)], ['Definición', 'pKa = −log₁₀ Ka']],
    pasos: (rengD, rengR) => ['pKa = −log Ka.', `pKa = ${rengTx(rengR, 4)}.`],
    pistas: ['Usa la definición de pKa.', 'Cuida el signo menos.', 'log(a·10⁻ⁿ) = log a − n.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s12-p2', subtema: 'n1-b10-s12', titulo: 'pKa a partir del pH', dificultad: 'intermedia',
    objetivo: 'Calcular el pKa de un ácido débil a partir del pH de una disolución de concentración conocida.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las constantes de acidez'), idealizado: 'Ácido monoprótico; agua despreciable.', metodo: 'búsqueda por bisección de la Ka que reproduce el pH',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.01, 1, 0.01), h: rengEntreN1(rengRng, 1.5, 4.5, 0.01) }),
    valida: (rengD) => 10 ** -rengD.h < 0.3 * rengD.c && 10 ** -rengD.h > 0.003 * rengD.c,
    respuesta: (rengD) => { const rengX = 10 ** -rengD.h; return -rengLog((rengX * rengX) / (rengD.c - rengX)) },
    errores: (rengD) => {
      const rengX = 10 ** -rengD.h
      return [
        ['sin-cuadrado', 'Sin el cuadrado', -rengLog(rengX / (rengD.c - rengX)), 'Olvidaste el cuadrado: [H₃O⁺] y [A⁻] valen los dos x, así que Ka = x²/(C − x).'],
        ['ph', 'El pH', rengD.h, 'Diste el pH; el pKa sale de la Ka calculada con la tabla ICE.']
      ]
    },
    enunciado: (rengD) => `Una disolución ${rengTx(rengD.c)} mol/L de un ácido débil HA tiene pH ${rengTx(rengD.h, 3)}.`,
    pregunta: () => '¿Cuál es el pKa del ácido?',
    datos: (rengD) => [['c(HA)', `${rengTx(rengD.c)} mol/L`], ['pH', rengTx(rengD.h, 3)]],
    pasos: (rengD, rengR) => [`x = 10^(−pH) = ${rengTx(10 ** -rengD.h)} mol/L.`, `Ka = x²/(C − x); pKa = ${rengTx(rengR, 4)}.`],
    pistas: ['Pasa el pH a [H₃O⁺].', 'Ka = x²/(C − x).', 'pKa = −log Ka.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s12-p3', subtema: 'n1-b10-s12', titulo: 'pKa a partir de la ionización', dificultad: 'avanzada',
    objetivo: 'Calcular el pKa de un ácido débil a partir de su porcentaje de ionización.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las constantes de acidez'), idealizado: 'Ácido monoprótico; agua despreciable.', metodo: 'búsqueda por bisección de la Ka que da ese porcentaje',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.001, 0.2, 0.001), a: rengEntreN1(rengRng, 30, 70, 0.5) }),
    respuesta: (rengD) => { const rengX = (rengD.a / 100) * rengD.c; return -rengLog((rengX * rengX) / (rengD.c - rengX)) },
    errores: (rengD) => {
      const rengX = (rengD.a / 100) * rengD.c
      return [
        ['sin-restar', 'Sin restar x', -rengLog((rengX * rengX) / rengD.c), 'Dividiste entre C sin restar x; con tanta ionización C − x es mucho menor que C.'],
        ['alfa', 'Con la fracción', -rengLog(rengD.a / 100), 'Usaste la fracción ionizada como si fuera Ka; hay que pasar por x y la tabla ICE.']
      ]
    },
    enunciado: (rengD) => `Un ácido débil ${rengTx(rengD.c)} mol/L está ionizado un ${rengTx(rengD.a)} %.`,
    pregunta: () => '¿Cuál es su pKa?',
    datos: (rengD) => [['c(HA)', `${rengTx(rengD.c)} mol/L`], ['Ionizado', `${rengTx(rengD.a)} %`]],
    pasos: (rengD, rengR) => [`x = ${rengTx(rengD.a / 100)} × ${rengTx(rengD.c)} = ${rengTx((rengD.a / 100) * rengD.c)} mol/L.`, `Ka = x²/(C − x); pKa = ${rengTx(rengR, 4)}.`],
    pistas: ['Calcula x con el porcentaje.', 'Ka = x²/(C − x).', 'Toma −log₁₀ del resultado.']
  })
]

export const RENG_PRACTICAS_B10_S13: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s13-p1', subtema: 'n1-b10-s13', titulo: 'pKb de un conjugado a partir de Ka', dificultad: 'basica',
    objetivo: 'Calcular el pKb de la base conjugada de un ácido de Ka conocida.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las constantes de basicidad'), idealizado: '25 °C, Kw = 1,0·10⁻¹⁴.', metodo: 'Kb = Kw/Ka y logaritmo', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 3, 11, 1) }),
    valida: (rengD) => Math.abs(-rengLog(ka(rengD)) - 7) > 0.2,
    respuesta: (rengD) => 14 + rengLog(ka(rengD)),
    errores: (rengD) => [
      ['pka', 'El pKa', -rengLog(ka(rengD)), 'Diste el pKa del ácido; el pKb de su base conjugada es 14 − pKa.'],
      ['suma', 'Suma', 14 - rengLog(ka(rengD)), 'Sumaste el pKa a 14; pKb = 14 − pKa.']
    ],
    enunciado: (rengD) => `El ácido conjugado BH⁺ de una base débil B tiene Ka = ${rengCientifico(rengD.km, rengD.ke)} (dato didáctico). Kw = 1,0·10⁻¹⁴.`,
    pregunta: () => '¿Cuál es el pKb de la base B?',
    datos: (rengD) => [['Ka(BH⁺)', rengCientifico(rengD.km, rengD.ke)], ['Kw', '1,0·10⁻¹⁴']],
    pasos: (rengD, rengR) => [`pKa = ${rengTx(-rengLog(ka(rengD)), 4)}.`, `pKb = 14 − pKa = ${rengTx(rengR, 4)}.`],
    pistas: ['Ka · Kb = Kw para un par conjugado.', 'Pasa Ka a pKa.', 'pKb = 14 − pKa.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s13-p2', subtema: 'n1-b10-s13', titulo: 'pKb a partir del pH', dificultad: 'intermedia',
    objetivo: 'Calcular el pKb de una base débil a partir del pH de una disolución de concentración conocida.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las constantes de basicidad'), idealizado: '25 °C; agua despreciable.', metodo: 'búsqueda por bisección de la Kb que reproduce el pH', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.01, 1, 0.01), h: rengEntreN1(rengRng, 10, 12.5, 0.01) }),
    valida: (rengD) => 10 ** (rengD.h - 14) < 0.3 * rengD.c && 10 ** (rengD.h - 14) > 0.003 * rengD.c,
    respuesta: (rengD) => { const rengX = 10 ** (rengD.h - 14); return -rengLog((rengX * rengX) / (rengD.c - rengX)) },
    errores: (rengD) => {
      const rengX = 10 ** (rengD.h - 14)
      return [
        ['usa-h', 'Con [H₃O⁺]', -rengLog((10 ** -rengD.h) ** 2 / rengD.c), 'Usaste [H₃O⁺] en lugar de [OH⁻]; con una base, x = 10^(pH − 14).'],
        ['sin-cuadrado', 'Sin el cuadrado', -rengLog(rengX / (rengD.c - rengX)), 'Olvidaste el cuadrado: Kb = x²/(C − x).']
      ]
    },
    enunciado: (rengD) => `Una disolución ${rengTx(rengD.c)} mol/L de una base débil tiene pH ${rengTx(rengD.h, 4)} a 25 °C (pKw = 14,00).`,
    pregunta: () => '¿Cuál es el pKb de la base?',
    datos: (rengD) => [['c(B)', `${rengTx(rengD.c)} mol/L`], ['pH', rengTx(rengD.h, 4)]],
    pasos: (rengD, rengR) => [`pOH = ${rengTx(14 - rengD.h, 4)}; x = [OH⁻] = ${rengTx(10 ** (rengD.h - 14))} mol/L.`, `Kb = x²/(C − x); pKb = ${rengTx(rengR, 4)}.`],
    pistas: ['Pasa el pH a pOH.', 'Aquí x es [OH⁻].', 'Kb = x²/(C − x).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s13-p3', subtema: 'n1-b10-s13', titulo: 'pKa del ácido conjugado de una base', dificultad: 'avanzada',
    objetivo: 'Calcular el pKa del ácido conjugado de una base débil a partir del pH de la base.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'los pares conjugados'), idealizado: '25 °C; agua despreciable.', metodo: 'Kb por bisección y pKa = 14 − pKb', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.01, 1, 0.01), h: rengEntreN1(rengRng, 10, 12.5, 0.01) }),
    valida: (rengD) => 10 ** (rengD.h - 14) < 0.3 * rengD.c && 10 ** (rengD.h - 14) > 0.003 * rengD.c,
    respuesta: (rengD) => { const rengX = 10 ** (rengD.h - 14); return 14 + rengLog((rengX * rengX) / (rengD.c - rengX)) },
    errores: (rengD) => {
      const rengX = 10 ** (rengD.h - 14)
      return [
        ['pkb', 'El pKb', -rengLog((rengX * rengX) / (rengD.c - rengX)), 'Diste el pKb de la base; el pKa de su ácido conjugado es 14 − pKb.'],
        ['ph', 'El pH', rengD.h, 'Diste el pH; el pKa sale de Kb con pKa = 14 − pKb.']
      ]
    },
    enunciado: (rengD) => `Una disolución ${rengTx(rengD.c)} mol/L de una base débil B tiene pH ${rengTx(rengD.h, 4)} a 25 °C (pKw = 14,00).`,
    pregunta: () => '¿Cuál es el pKa de su ácido conjugado BH⁺?',
    datos: (rengD) => [['c(B)', `${rengTx(rengD.c)} mol/L`], ['pH', rengTx(rengD.h, 4)]],
    pasos: (rengD, rengR) => [`Kb con la tabla ICE: pKb = ${rengTx(14 - rengR, 4)}.`, `pKa(BH⁺) = 14 − pKb = ${rengTx(rengR, 4)}.`],
    pistas: ['Calcula primero Kb.', 'Ka · Kb = Kw.', 'pKa = 14 − pKb.']
  })
]

export const RENG_PRACTICAS_B10_S14: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s14-p1', subtema: 'n1-b10-s14', titulo: 'Base para neutralizar un ácido poliprótico', dificultad: 'basica',
    objetivo: 'Calcular el volumen de NaOH que neutraliza por completo un ácido con varios protones.', unidad: 'mL', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.7', 'la neutralización'), idealizado: 'Neutralización completa de todos los protones.', metodo: 'moles de H⁺ cedidos igualados a moles de OH⁻',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_POLIPROTICOS_AB.length), ca: rengEntreN1(rengRng, 0.02, 0.5, 0.01), va: rengEntreN1(rengRng, 5, 50, 0.5), cb: rengEntreN1(rengRng, 0.05, 1, 0.01) }),
    respuesta: (rengD) => (rengD.ca * rengD.va * RENG_POLIPROTICOS_AB[rengD.a]!.eq) / rengD.cb,
    errores: (rengD) => [
      ['un-proton', 'Un protón por fórmula', (rengD.ca * rengD.va) / rengD.cb, 'Contaste un solo protón por fórmula; este ácido cede varios en la neutralización completa.'],
      ['invertida', 'Proporción invertida', (rengD.cb * rengD.va) / (rengD.ca * RENG_POLIPROTICOS_AB[rengD.a]!.eq), 'Invertiste la proporción entre concentraciones.']
    ],
    enunciado: (rengD) => `Se neutralizan por completo ${rengTx(rengD.va)} mL de ${RENG_POLIPROTICOS_AB[rengD.a]!.nombre} (${rengTextoAb(RENG_POLIPROTICOS_AB[rengD.a]!.formula)}) ${rengTx(rengD.ca)} mol/L con NaOH ${rengTx(rengD.cb)} mol/L.`,
    pregunta: () => '¿Qué volumen de NaOH se necesita, en mL?',
    datos: (rengD) => [['Ácido', `${rengTx(rengD.va)} mL, ${rengTx(rengD.ca)} mol/L`], ['Protones por fórmula', String(RENG_POLIPROTICOS_AB[rengD.a]!.eq)], ['NaOH', `${rengTx(rengD.cb)} mol/L`]],
    pasos: (rengD, rengR) => [`H⁺ cedidos: ${rengTx(rengD.ca * rengD.va * RENG_POLIPROTICOS_AB[rengD.a]!.eq)} mmol.`, `V(NaOH) = ${rengTx(rengR)} mL.`],
    pistas: ['¿Cuántos protones cede cada fórmula?', 'Iguala moles de H⁺ y de OH⁻.', 'Despeja el volumen de base.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s14-p2', subtema: 'n1-b10-s14', titulo: 'pH tras mezclar ácido y base fuertes', dificultad: 'intermedia',
    objetivo: 'Calcular el pH de una mezcla de ácido y base fuertes cuando sobra uno de los dos.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.7', 'la neutralización'), idealizado: 'Volúmenes aditivos; 25 °C.', metodo: 'balance de carga del núcleo con Kw = 1,0·10⁻¹⁴', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ ca: rengEntreN1(rengRng, 0.01, 0.5, 0.01), va: rengEntreN1(rengRng, 10, 100, 1), cb: rengEntreN1(rengRng, 0.01, 0.5, 0.01), vb: rengEntreN1(rengRng, 10, 100, 1) }),
    valida: (rengD) => { const rengNa = rengD.ca * rengD.va; const rengNb = rengD.cb * rengD.vb; return Math.abs(rengNa - rengNb) > 0.05 * Math.max(rengNa, rengNb) },
    respuesta: (rengD) => {
      const rengExc = (rengD.ca * rengD.va - rengD.cb * rengD.vb) / (rengD.va + rengD.vb)
      return rengExc > 0 ? -rengLog(rengExc) : 14 + rengLog(-rengExc)
    },
    errores: (rengD) => {
      const rengDif = rengD.ca * rengD.va - rengD.cb * rengD.vb
      const rengV = rengDif > 0 ? rengD.va : rengD.vb
      return [
        ['un-volumen', 'Volumen de una disolución', rengDif > 0 ? -rengLog(rengDif / rengV) : 14 + rengLog(-rengDif / rengV), 'Dividiste el exceso entre el volumen de una sola disolución; tras mezclar, el volumen es la suma.'],
        ['neutro', 'Neutralización exacta', 7, 'Supusiste que se neutralizan por completo; sobra uno de los dos.']
      ]
    },
    enunciado: (rengD) => `Se mezclan ${rengTx(rengD.va)} mL de HCl ${rengTx(rengD.ca)} mol/L con ${rengTx(rengD.vb)} mL de NaOH ${rengTx(rengD.cb)} mol/L a 25 °C (volúmenes aditivos, pKw = 14,00).`,
    pregunta: () => '¿Cuál es el pH de la mezcla?',
    datos: (rengD) => [['HCl', `${rengTx(rengD.va)} mL, ${rengTx(rengD.ca)} mol/L`], ['NaOH', `${rengTx(rengD.vb)} mL, ${rengTx(rengD.cb)} mol/L`]],
    pasos: (rengD, rengR) => [`mmol de H₃O⁺: ${rengTx(rengD.ca * rengD.va)}; de OH⁻: ${rengTx(rengD.cb * rengD.vb)}.`, `El exceso en ${rengTx(rengD.va + rengD.vb)} mL da pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Calcula los milimoles de cada uno.', 'Resta lo que se neutraliza.', 'Divide el exceso entre el volumen total.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s14-p3', subtema: 'n1-b10-s14', titulo: 'pH en la equivalencia de un ácido débil', dificultad: 'avanzada',
    objetivo: 'Calcular el pH en el punto de equivalencia de un ácido débil valorado con NaOH.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.7', 'el punto de equivalencia'), idealizado: 'Volúmenes aditivos; 25 °C; agua despreciable.', metodo: 'balance de carga del núcleo con la sal formada y Kw = 1,0·10⁻¹⁴', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ ca: rengEntreN1(rengRng, 0.02, 0.5, 0.01), va: rengEntreN1(rengRng, 10, 50, 1), cb: rengEntreN1(rengRng, 0.05, 0.5, 0.01), p: rengEntreN1(rengRng, 3, 6, 0.01) }),
    respuesta: (rengD) => { const rengVb = (rengD.ca * rengD.va) / rengD.cb; const rengC = (rengD.ca * rengD.va) / (rengD.va + rengVb); return 14 + rengLog(rengRaizCuadratica(10 ** (rengD.p - 14), rengC)) },
    errores: (rengD) => [
      ['siete', 'Siempre 7', 7, 'Supusiste pH 7; con un ácido débil queda su base conjugada y el pH es mayor que 7.'],
      ['sin-diluir', 'Sin diluir la sal', 14 + rengLog(rengRaizCuadratica(10 ** (rengD.p - 14), rengD.ca)), 'Usaste la concentración inicial del ácido; en la equivalencia la sal está en el volumen total.']
    ],
    enunciado: (rengD) => `Se valoran ${rengTx(rengD.va)} mL de un ácido débil HA ${rengTx(rengD.ca)} mol/L (pKa = ${rengTx(rengD.p, 3)}, didáctico) con NaOH ${rengTx(rengD.cb)} mol/L a 25 °C.`,
    pregunta: () => '¿Cuál es el pH en el punto de equivalencia?',
    datos: (rengD) => [['HA', `${rengTx(rengD.va)} mL, ${rengTx(rengD.ca)} mol/L`], ['pKa', rengTx(rengD.p, 3)], ['NaOH', `${rengTx(rengD.cb)} mol/L`]],
    pasos: (rengD, rengR) => [`V(NaOH) = ${rengTx((rengD.ca * rengD.va) / rengD.cb)} mL; [A⁻] = ${rengTx((rengD.ca * rengD.va) / (rengD.va + (rengD.ca * rengD.va) / rengD.cb), 4)} mol/L.`, `A⁻ es base débil con Kb = Kw/Ka: pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Calcula el volumen de equivalencia.', 'Halla [A⁻] en el volumen total.', 'Trata A⁻ como base débil con Kb = Kw/Ka.']
  })
]

export const RENG_PRACTICAS_B10_S15: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s15-p1', subtema: 'n1-b10-s15', titulo: 'Forma básica de un indicador', dificultad: 'basica',
    objetivo: 'Calcular el porcentaje de un indicador en su forma básica a un pH dado.', unidad: '%', tolerancia: RENG_TOL_AB_PCT,
    fuentes: rengFuentesAb('14.7', 'los indicadores ácido-base'), idealizado: 'Indicador monoprótico con pK didáctico.', metodo: 'razón [In⁻]/[HIn] de Henderson-Hasselbalch',
    parametros: (rengRng) => ({ k: rengEntreN1(rengRng, 3, 10, 0.1), h: rengEntreN1(rengRng, 1.5, 11.5, 0.01) }),
    valida: (rengD) => Math.abs(rengD.h - rengD.k) > 0.2 && Math.abs(rengD.h - rengD.k) < 1.6,
    respuesta: (rengD) => 100 / (1 + 10 ** (rengD.k - rengD.h)),
    errores: (rengD) => [
      ['acida', 'Forma ácida', 100 / (1 + 10 ** (rengD.h - rengD.k)), 'Calculaste el porcentaje en forma ácida HIn; la pregunta pide la básica In⁻.'],
      ['mitad', 'La mitad', 50, 'Diste un 50 %; eso solo pasa cuando el pH es igual al pK.']
    ],
    enunciado: (rengD) => `Un indicador tiene pK = ${rengTx(rengD.k, 3)} (dato didáctico). La disolución tiene pH ${rengTx(rengD.h, 3)}.`,
    pregunta: () => '¿Qué porcentaje del indicador está en su forma básica?',
    datos: (rengD) => [['pK', rengTx(rengD.k, 3)], ['pH', rengTx(rengD.h, 3)]],
    pasos: (rengD, rengR) => [`[In⁻]/[HIn] = 10^(pH − pK) = ${rengTx(10 ** (rengD.h - rengD.k), 3)}.`, `Forma básica: ${rengTx(rengR)} %.`],
    pistas: ['Usa pH = pK + log([In⁻]/[HIn]).', 'Calcula la razón entre formas.', 'Pásala a porcentaje del total.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s15-p2', subtema: 'n1-b10-s15', titulo: 'pH con un porcentaje de viraje', dificultad: 'intermedia',
    objetivo: 'Calcular el pH al que un indicador tiene un porcentaje dado en su forma básica.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.7', 'los indicadores ácido-base'), idealizado: 'Indicador monoprótico con pK didáctico.', metodo: 'búsqueda por bisección del pH con la fracción básica',
    parametros: (rengRng) => ({ k: rengEntreN1(rengRng, 3, 10, 0.1), f: rengEntreN1(rengRng, 5, 95, 1) }),
    valida: (rengD) => Math.abs(rengD.f - 50) > 15,
    respuesta: (rengD) => rengD.k + rengLog(rengD.f / (100 - rengD.f)),
    errores: (rengD) => [
      ['invertido', 'Razón invertida', rengD.k - rengLog(rengD.f / (100 - rengD.f)), 'Invertiste la razón: es [In⁻]/[HIn], forma básica entre forma ácida.'],
      ['pk', 'El pK', rengD.k, 'Diste el pK; solo coincide con el pH cuando las dos formas son iguales.']
    ],
    enunciado: (rengD) => `Un indicador tiene pK = ${rengTx(rengD.k, 3)} (dato didáctico).`,
    pregunta: (rengD) => `¿A qué pH está el ${rengTx(rengD.f)} % en su forma básica?`,
    datos: (rengD) => [['pK', rengTx(rengD.k, 3)], ['Forma básica', `${rengTx(rengD.f)} %`]],
    pasos: (rengD, rengR) => [`[In⁻]/[HIn] = ${rengTx(rengD.f)}/${rengTx(100 - rengD.f)}.`, `pH = pK + log(razón) = ${rengTx(rengR, 4)}.`],
    pistas: ['Pasa el porcentaje a razón entre formas.', 'Usa pH = pK + log(razón).', 'Comprueba el lado del pK.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s15-p3', subtema: 'n1-b10-s15', titulo: 'Razón entre las formas de un indicador', dificultad: 'avanzada',
    objetivo: 'Calcular la razón entre la forma básica y la ácida de un indicador a un pH dado.', unidad: '', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.7', 'los indicadores ácido-base'), idealizado: 'Indicador monoprótico con pK didáctico.', metodo: 'fracción básica calculada y convertida a razón',
    parametros: (rengRng) => ({ k: rengEntreN1(rengRng, 3, 10, 0.1), d: rengEntreN1(rengRng, 0.3, 2, 0.01) }),
    respuesta: (rengD) => 10 ** rengD.d,
    errores: (rengD) => [
      ['invertida', 'Razón invertida', 10 ** -rengD.d, 'Diste la razón ácida/básica; la pregunta pide [In⁻]/[HIn].'],
      ['diferencia', 'La diferencia de pH', rengD.d, 'Diste pH − pK; la razón es 10 elevado a esa diferencia.']
    ],
    enunciado: (rengD) => `Un indicador de pK = ${rengTx(rengD.k, 3)} (didáctico) está en una disolución de pH ${rengTx(rengD.k + rengD.d, 4)}.`,
    pregunta: () => '¿Cuánto vale la razón [In⁻]/[HIn]? (escribe solo el número)',
    datos: (rengD) => [['pK', rengTx(rengD.k, 3)], ['pH', rengTx(rengD.k + rengD.d, 4)]],
    pasos: (rengD, rengR) => [`pH − pK = ${rengTx(rengD.d, 3)}.`, `[In⁻]/[HIn] = 10^${rengTx(rengD.d, 3)} = ${rengTx(rengR)}.`],
    pistas: ['Usa pH = pK + log(razón).', 'Despeja el logaritmo de la razón.', 'Eleva 10 a esa diferencia.']
  })
]
