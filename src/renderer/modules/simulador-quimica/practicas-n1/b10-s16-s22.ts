import { rengTx } from '../aprender/n1/gases/constantes'
import { rengGradoDisociacionDimero } from '../nucleo/equilibrio'
import { rengBiseccion } from '../aprender/n1/numericos'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_KW_AB, RENG_KW_SIN_VERIFICAR, RENG_R_BAR_AB, RENG_REACCIONES_KP_AB, RENG_SALES_AMORTIGUADOR_AB, RENG_SALES_MX2_AB, RENG_TOL_AB, RENG_TOL_AB_PCT, RENG_TOL_PH, rengCientifico, rengDatoMasaAb, rengFuentesAb, rengLog, rengMmAb, rengRaizCuadratica, rengTextoAb, rengValorCient } from './b10-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const KW = RENG_KW_AB
const KW_SV = [RENG_KW_SIN_VERIFICAR]
type D = Readonly<Record<string, number>>
const ka = (rengD: D): number => rengValorCient(rengD.km!, rengD.ke!)
export const rengSolubilidadMx2ConIon = (rengKsp: number, rengC: number): number => rengBiseccion((rengS) => (rengC + rengS) * (2 * rengS) ** 2 - rengKsp, 0, 1)
export const rengAlfaGas = (rengKp: number, rengT: number, rengN0: number, rengV: number): number => rengGradoDisociacionDimero(rengN0 / rengV, rengKp / (RENG_R_BAR_AB * rengT))

export const RENG_PRACTICAS_B10_S16: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s16-p1', subtema: 'n1-b10-s16', titulo: 'pH de una sal de ácido débil', dificultad: 'basica',
    objetivo: 'Calcular el pH de una disolución de la sal sódica de un ácido débil.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.4', 'la hidrólisis de sales'), idealizado: 'Solo hidroliza el anión; 25 °C; agua despreciable.', metodo: 'balance de carga del núcleo con el Na⁺ de la sal y Kw = 1,0·10⁻¹⁴', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.01, 1, 0.01), km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 3, 6, 1) }),
    respuesta: (rengD) => 14 + rengLog(rengRaizCuadratica(KW / ka(rengD), rengD.c)),
    errores: (rengD) => [
      ['neutro', 'Neutra', 7, 'Supusiste que la sal es neutra; el anión de un ácido débil es una base débil.'],
      ['usa-ka', 'Como ácido', -rengLog(rengRaizCuadratica(ka(rengD), rengD.c)), 'Trataste el anión como un ácido con la Ka; es una base con Kb = Kw/Ka.']
    ],
    enunciado: (rengD) => `Se disuelve NaA hasta ${rengTx(rengD.c)} mol/L. El ácido HA tiene Ka = ${rengCientifico(rengD.km, rengD.ke)} (dato didáctico). Kw = 1,0·10⁻¹⁴.`,
    pregunta: () => '¿Cuál es el pH de la disolución?',
    datos: (rengD) => [['c(NaA)', `${rengTx(rengD.c)} mol/L`], ['Ka(HA)', rengCientifico(rengD.km, rengD.ke)]],
    pasos: (rengD, rengR) => [`Kb(A⁻) = Kw/Ka = ${rengTx(KW / ka(rengD))}.`, `[OH⁻] de la tabla ICE; pH = ${rengTx(rengR, 4)}.`],
    pistas: ['¿Qué ion de la sal hidroliza?', 'Kb = Kw / Ka.', 'Calcula [OH⁻] y pasa a pH.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s16-p2', subtema: 'n1-b10-s16', titulo: 'pH de una sal de base débil', dificultad: 'intermedia',
    objetivo: 'Calcular el pH de una disolución del cloruro de una base débil.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.4', 'la hidrólisis de sales'), idealizado: 'Solo hidroliza el catión; 25 °C; agua despreciable.', metodo: 'balance de carga del núcleo con Ka = Kw/Kb', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.01, 1, 0.01), km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 4, 6, 1) }),
    respuesta: (rengD) => -rengLog(rengRaizCuadratica(KW / ka(rengD), rengD.c)),
    errores: (rengD) => [
      ['neutro', 'Neutra', 7, 'Supusiste que la sal es neutra; el catión de una base débil es un ácido débil.'],
      ['usa-kb', 'Como base', 14 + rengLog(rengRaizCuadratica(ka(rengD), rengD.c)), 'Trataste el catión como una base con la Kb; es un ácido con Ka = Kw/Kb.']
    ],
    enunciado: (rengD) => `Se disuelve BHCl hasta ${rengTx(rengD.c)} mol/L. La base B tiene Kb = ${rengCientifico(rengD.km, rengD.ke)} (dato didáctico). Kw = 1,0·10⁻¹⁴.`,
    pregunta: () => '¿Cuál es el pH de la disolución?',
    datos: (rengD) => [['c(BHCl)', `${rengTx(rengD.c)} mol/L`], ['Kb(B)', rengCientifico(rengD.km, rengD.ke)]],
    pasos: (rengD, rengR) => [`Ka(BH⁺) = Kw/Kb = ${rengTx(KW / ka(rengD))}.`, `[H₃O⁺] de la tabla ICE; pH = ${rengTx(rengR, 4)}.`],
    pistas: ['¿Qué ion de la sal hidroliza?', 'Ka = Kw / Kb.', 'Trátalo como un ácido débil.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s16-p3', subtema: 'n1-b10-s16', titulo: 'pKa a partir del pH de una sal', dificultad: 'avanzada',
    objetivo: 'Deducir el pKa de un ácido débil a partir del pH de una disolución de su sal sódica.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.4', 'la hidrólisis de sales'), idealizado: 'Solo hidroliza el anión; 25 °C; agua despreciable.', metodo: 'búsqueda por bisección del pKa que reproduce el pH', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.01, 1, 0.01), h: rengEntreN1(rengRng, 8, 10.5, 0.01) }),
    valida: (rengD) => 10 ** (rengD.h - 14) < 0.2 * rengD.c && 10 ** (rengD.h - 14) > 1e-6,
    respuesta: (rengD) => { const rengX = 10 ** (rengD.h - 14); return 14 + rengLog((rengX * rengX) / (rengD.c - rengX)) },
    errores: (rengD) => {
      const rengX = 10 ** (rengD.h - 14)
      return [
        ['pkb', 'El pKb del anión', -rengLog((rengX * rengX) / (rengD.c - rengX)), 'Diste el pKb del anión; el pKa del ácido es 14 − pKb.'],
        ['ph', 'El pH', rengD.h, 'Diste el pH; el pKa sale de Kb con pKa = 14 − pKb.']
      ]
    },
    enunciado: (rengD) => `Una disolución ${rengTx(rengD.c)} mol/L de la sal NaA tiene pH ${rengTx(rengD.h, 4)} a 25 °C (pKw = 14,00).`,
    pregunta: () => '¿Cuál es el pKa del ácido HA?',
    datos: (rengD) => [['c(NaA)', `${rengTx(rengD.c)} mol/L`], ['pH', rengTx(rengD.h, 4)]],
    pasos: (rengD, rengR) => [`[OH⁻] = 10^(pH − 14); Kb = x²/(C − x) → pKb = ${rengTx(14 - rengR, 4)}.`, `pKa = 14 − pKb = ${rengTx(rengR, 4)}.`],
    pistas: ['El anión hidroliza como base.', 'Calcula Kb con [OH⁻].', 'pKa = 14 − pKb.']
  })
]

export const RENG_PRACTICAS_B10_S17: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s17-p1', subtema: 'n1-b10-s17', titulo: 'pH de un amortiguador', dificultad: 'basica',
    objetivo: 'Calcular el pH de un amortiguador con la ecuación de Henderson-Hasselbalch.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.6', 'las disoluciones amortiguadoras'), idealizado: 'Henderson-Hasselbalch con concentraciones iniciales.', metodo: '[H₃O⁺] = Ka·[HA]/[A⁻] despejada de Ka',
    parametros: (rengRng) => ({ p: rengEntreN1(rengRng, 3, 10, 0.01), ca: rengEntreN1(rengRng, 0.02, 1, 0.01), cs: rengEntreN1(rengRng, 0.02, 1, 0.01) }),
    valida: (rengD) => Math.abs(rengLog(rengD.cs / rengD.ca)) > 0.15,
    respuesta: (rengD) => rengD.p + rengLog(rengD.cs / rengD.ca),
    errores: (rengD) => [
      ['invertido', 'Cociente invertido', rengD.p + rengLog(rengD.ca / rengD.cs), 'Invertiste el cociente: es base conjugada entre ácido, [A⁻]/[HA].'],
      ['pka', 'El pKa', rengD.p, 'Diste el pKa; solo coincide con el pH si [A⁻] = [HA].']
    ],
    enunciado: (rengD) => `Un amortiguador contiene ${rengTx(rengD.ca)} mol/L de HA y ${rengTx(rengD.cs)} mol/L de NaA; pKa = ${rengTx(rengD.p, 3)} (didáctico).`,
    pregunta: () => '¿Cuál es su pH?',
    datos: (rengD) => [['[HA]', `${rengTx(rengD.ca)} mol/L`], ['[A⁻]', `${rengTx(rengD.cs)} mol/L`], ['pKa', rengTx(rengD.p, 3)]],
    pasos: (rengD, rengR) => ['pH = pKa + log([A⁻]/[HA]).', `pH = ${rengTx(rengD.p, 3)} + log(${rengTx(rengD.cs / rengD.ca, 3)}) = ${rengTx(rengR, 4)}.`],
    pistas: ['Identifica el ácido y su base conjugada.', 'Usa Henderson-Hasselbalch.', 'El cociente es [A⁻]/[HA].']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s17-p2', subtema: 'n1-b10-s17', titulo: 'Amortiguador tras añadir NaOH', dificultad: 'intermedia',
    objetivo: 'Calcular el pH de un amortiguador después de añadirle una cantidad de base fuerte.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.6', 'la capacidad de un amortiguador'), idealizado: 'Henderson-Hasselbalch; sin cambio de volumen.', metodo: '[H₃O⁺] = Ka·n(HA)/n(A⁻) tras la neutralización',
    parametros: (rengRng) => ({ p: rengEntreN1(rengRng, 3, 10, 0.01), na: rengEntreN1(rengRng, 0.05, 0.5, 0.005), ns: rengEntreN1(rengRng, 0.05, 0.5, 0.005), n: rengEntreN1(rengRng, 0.005, 0.1, 0.001) }),
    valida: (rengD) => rengD.n < 0.6 * rengD.na,
    respuesta: (rengD) => rengD.p + rengLog((rengD.ns + rengD.n) / (rengD.na - rengD.n)),
    errores: (rengD) => [
      ['sin-reaccion', 'Sin la reacción', rengD.p + rengLog(rengD.ns / rengD.na), 'Usaste las cantidades iniciales; el NaOH convierte HA en A⁻ antes de aplicar la ecuación.'],
      ['al-reves', 'Reacción al revés', rengD.p + rengLog((rengD.ns - rengD.n) / (rengD.na + rengD.n)), 'Hiciste la reacción al revés: el OH⁻ consume HA y forma A⁻.']
    ],
    enunciado: (rengD) => `Un litro de amortiguador contiene ${rengTx(rengD.na)} mol de HA y ${rengTx(rengD.ns)} mol de NaA (pKa = ${rengTx(rengD.p, 3)}, didáctico). Se añaden ${rengTx(rengD.n)} mol de NaOH sin cambio de volumen.`,
    pregunta: () => '¿Cuál es el nuevo pH?',
    datos: (rengD) => [['HA', `${rengTx(rengD.na)} mol`], ['A⁻', `${rengTx(rengD.ns)} mol`], ['NaOH', `${rengTx(rengD.n)} mol`], ['pKa', rengTx(rengD.p, 3)]],
    pasos: (rengD, rengR) => [`HA: ${rengTx(rengD.na - rengD.n)} mol; A⁻: ${rengTx(rengD.ns + rengD.n)} mol.`, `pH = pKa + log(A⁻/HA) = ${rengTx(rengR, 4)}.`],
    pistas: ['¿Con qué reacciona el OH⁻?', 'Recalcula HA y A⁻.', 'Aplica Henderson-Hasselbalch.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s17-p3', subtema: 'n1-b10-s17', titulo: 'Sal para preparar un amortiguador', dificultad: 'avanzada',
    objetivo: 'Calcular la masa de la sal sódica que hay que añadir a un ácido débil para obtener un pH dado.', unidad: 'g', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.6', 'la preparación de amortiguadores', 'masas'), idealizado: 'Henderson-Hasselbalch; sin cambio de volumen; pKa didáctico.', metodo: 'búsqueda por bisección de la masa con la ecuación de Henderson-Hasselbalch',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SALES_AMORTIGUADOR_AB.length), c: rengEntreN1(rengRng, 0.05, 1, 0.01), v: rengEntreN1(rengRng, 0.1, 2, 0.05), d: rengEntreN1(rengRng, -0.9, 0.9, 0.01) }),
    valida: (rengD) => Math.abs(rengD.d) > 0.1,
    respuesta: (rengD) => { const rengS = RENG_SALES_AMORTIGUADOR_AB[rengD.s]!; return rengD.c * rengD.v * 10 ** rengD.d * rengMmAb(rengS.formula) },
    errores: (rengD) => {
      const rengS = RENG_SALES_AMORTIGUADOR_AB[rengD.s]!
      return [
        ['invertido', 'Razón invertida', rengD.c * rengD.v * 10 ** -rengD.d * rengMmAb(rengS.formula), 'Invertiste la razón: [A⁻]/[HA] = 10^(pH − pKa).'],
        ['moles', 'Moles en lugar de gramos', rengD.c * rengD.v * 10 ** rengD.d, 'Diste los moles de sal; multiplícalos por su masa molar.']
      ]
    },
    enunciado: (rengD) => { const rengS = RENG_SALES_AMORTIGUADOR_AB[rengD.s]!; return `Se tienen ${rengTx(rengD.v)} L de ${rengTextoAb(rengS.acido)} ${rengTx(rengD.c)} mol/L (pKa = ${rengTx(rengS.pKa, 3)}, valor didáctico). Se quiere un amortiguador de pH ${rengTx(rengS.pKa + rengD.d, 3)} añadiendo ${rengTextoAb(rengS.formula)} sin cambiar el volumen.` },
    pregunta: (rengD) => `¿Qué masa de ${rengTextoAb(RENG_SALES_AMORTIGUADOR_AB[rengD.s]!.formula)} hay que añadir, en g?`,
    datos: (rengD) => [['Ácido', `${rengTx(rengD.v)} L, ${rengTx(rengD.c)} mol/L`], ['pH deseado', rengTx(RENG_SALES_AMORTIGUADOR_AB[rengD.s]!.pKa + rengD.d, 3)], rengDatoMasaAb(RENG_SALES_AMORTIGUADOR_AB[rengD.s]!.formula)],
    pasos: (rengD, rengR) => [`[A⁻]/[HA] = 10^(pH − pKa) = ${rengTx(10 ** rengD.d, 3)}.`, `n(sal) = ${rengTx(rengD.c * rengD.v * 10 ** rengD.d, 4)} mol; m = ${rengTx(rengR)} g.`],
    pistas: ['Despeja la razón de Henderson-Hasselbalch.', 'Calcula los moles de sal.', 'Pasa a gramos con la masa molar.']
  })
]

export const RENG_PRACTICAS_B10_S18: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s18-p1', subtema: 'n1-b10-s18', titulo: 'H₃O⁺ de un ácido con ion común', dificultad: 'basica',
    objetivo: 'Calcular [H₃O⁺] de un ácido débil en presencia de su base conjugada (ion común).', unidad: 'µmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.6', 'el efecto del ion común'), idealizado: 'Agua despreciable; constantes didácticas.', metodo: 'búsqueda por bisección de x en la expresión de Ka con el ion común',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.05, 1, 0.01), cs: rengEntreN1(rengRng, 0.05, 1, 0.01), km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 4, 6, 1) }),
    respuesta: (rengD) => { const rengK = ka(rengD); const rengB = rengD.cs + rengK; return ((-rengB + Math.sqrt(rengB * rengB + 4 * rengK * rengD.c)) / 2) * 1e6 },
    errores: (rengD) => [
      ['sin-ion', 'Sin el ion común', rengRaizCuadratica(ka(rengD), rengD.c) * 1e6, 'Ignoraste el ion común; el A⁻ añadido frena la ionización del HA.'],
      ['invertido', 'Concentraciones invertidas', ((ka(rengD) * rengD.cs) / rengD.c) * 1e6, 'Invertiste las concentraciones: x ≈ Ka·[HA]/[A⁻].']
    ],
    enunciado: (rengD) => `Una disolución contiene ${rengTx(rengD.c)} mol/L de HA (Ka = ${rengCientifico(rengD.km, rengD.ke)}, didáctico) y ${rengTx(rengD.cs)} mol/L de NaA.`,
    pregunta: () => '¿Cuál es [H₃O⁺], en µmol/L?',
    datos: (rengD) => [['[HA]₀', `${rengTx(rengD.c)} mol/L`], ['[A⁻]₀', `${rengTx(rengD.cs)} mol/L`], ['Ka', rengCientifico(rengD.km, rengD.ke)]],
    pasos: (rengD, rengR) => ['Ka = x(C_s + x)/(C_a − x), con el A⁻ de la sal en la tabla.', `x = ${rengTx(rengR / 1e6)} mol/L = ${rengTx(rengR)} µmol/L.`],
    pistas: ['Incluye el A⁻ de la sal en la tabla ICE.', 'x ≈ Ka·[HA]/[A⁻].', 'Pasa a µmol/L.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s18-p2', subtema: 'n1-b10-s18', titulo: 'Solubilidad con ion común', dificultad: 'intermedia',
    objetivo: 'Calcular la solubilidad molar de una sal MX en una disolución que ya contiene X⁻.', unidad: 'µmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('15.1', 'el efecto del ion común en la solubilidad'), idealizado: 'Concentraciones como actividades; Ksp didáctico.', metodo: 'búsqueda por bisección de s en s·(c + s) = Ksp',
    parametros: (rengRng) => ({ km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 6, 10, 1), cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 1, 3, 1) }),
    valida: (rengD) => { const rengS = (-rengValorCient(rengD.cm, rengD.ce) + Math.sqrt(rengValorCient(rengD.cm, rengD.ce) ** 2 + 4 * ka(rengD))) / 2; return rengS * 1e6 > 0.5 },
    respuesta: (rengD) => { const rengC = rengValorCient(rengD.cm, rengD.ce); return ((-rengC + Math.sqrt(rengC * rengC + 4 * ka(rengD))) / 2) * 1e6 },
    errores: (rengD) => [
      ['agua-pura', 'Como en agua pura', Math.sqrt(ka(rengD)) * 1e6, 'Calculaste la solubilidad en agua pura; el X⁻ presente la reduce.'],
      ['multiplica', 'Multiplicar', ka(rengD) * rengValorCient(rengD.cm, rengD.ce) * 1e6 * 1e6, 'Multiplicaste Ksp por el ion común; hay que dividir: s ≈ Ksp/c.']
    ],
    enunciado: (rengD) => `Una sal MX tiene Ksp = ${rengCientifico(rengD.km, rengD.ke)} (didáctico). Se disuelve en NaX ${rengCientifico(rengD.cm, rengD.ce)} mol/L.`,
    pregunta: () => '¿Cuál es su solubilidad molar, en µmol/L?',
    datos: (rengD) => [['Ksp', rengCientifico(rengD.km, rengD.ke)], ['[X⁻] inicial', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`]],
    pasos: (rengD, rengR) => ['Ksp = s·(c + s).', `s = ${rengTx(rengR / 1e6)} mol/L = ${rengTx(rengR)} µmol/L.`],
    pistas: ['Incluye el X⁻ de la sal en la tabla.', 'Ksp = [M⁺]·[X⁻].', 's ≈ Ksp/c si s es pequeño.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s18-p3', subtema: 'n1-b10-s18', titulo: 'Solubilidad de MX₂ con catión común', dificultad: 'avanzada',
    objetivo: 'Calcular la solubilidad de una sal MX₂ en una disolución que ya contiene el catión M²⁺.', unidad: 'µmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('15.1', 'el efecto del ion común en la solubilidad'), idealizado: 'Concentraciones como actividades; Ksp didáctico.', metodo: 'método de Newton sobre (c + s)·(2s)² = Ksp',
    parametros: (rengRng) => ({ km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 9, 12, 1), cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 1, 3, 1) }),
    valida: (rengD) => rengSolubilidadMx2ConIon(ka(rengD), rengValorCient(rengD.cm, rengD.ce)) * 1e6 > 0.5,
    respuesta: (rengD) => rengSolubilidadMx2ConIon(ka(rengD), rengValorCient(rengD.cm, rengD.ce)) * 1e6,
    errores: (rengD) => [
      ['agua-pura', 'Como en agua pura', Math.cbrt(ka(rengD) / 4) * 1e6, 'Calculaste la solubilidad en agua pura; el M²⁺ presente la reduce.'],
      ['sin-2', 'Sin el 2 del anión', Math.sqrt(ka(rengD) / rengValorCient(rengD.cm, rengD.ce)) * 1e6, 'Olvidaste que [X⁻] = 2s; Ksp = (c + s)·(2s)².']
    ],
    enunciado: (rengD) => `Una sal MX₂ tiene Ksp = ${rengCientifico(rengD.km, rengD.ke)} (didáctico). Se disuelve en una disolución con ${rengCientifico(rengD.cm, rengD.ce)} mol/L de M²⁺.`,
    pregunta: () => '¿Cuál es su solubilidad molar, en µmol/L?',
    datos: (rengD) => [['Ksp', rengCientifico(rengD.km, rengD.ke)], ['[M²⁺] inicial', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`]],
    pasos: (rengD, rengR) => ['Ksp = (c + s)·(2s)²; si s ≪ c, s ≈ √(Ksp/(4c)).', `s = ${rengTx(rengR)} µmol/L.`],
    pistas: ['[M²⁺] = c + s y [X⁻] = 2s.', 'Plantea Ksp con esas concentraciones.', 's es pequeño frente a c.']
  })
]

export const RENG_PRACTICAS_B10_S19: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s19-p1', subtema: 'n1-b10-s19', titulo: 'Kc a partir del equilibrio', dificultad: 'basica',
    objetivo: 'Calcular Kc de A + B ⇌ C a partir de las concentraciones de equilibrio.', unidad: 'L/mol', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('13.2', 'la constante de equilibrio'), idealizado: 'Datos de equilibrio didácticos.', metodo: 'logaritmos: log Kc = log[C] − log[A] − log[B]',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 0.05, 2, 0.01), b: rengEntreN1(rengRng, 0.05, 2, 0.01), c: rengEntreN1(rengRng, 0.05, 2, 0.01) }),
    valida: (rengD) => rengD.c / (rengD.a * rengD.b) > 0.3,
    respuesta: (rengD) => rengD.c / (rengD.a * rengD.b),
    errores: (rengD) => [
      ['invertida', 'Expresión invertida', (rengD.a * rengD.b) / rengD.c, 'Pusiste los reactivos en el numerador; Kc = productos / reactivos.'],
      ['suma', 'Suma de reactivos', rengD.c / (rengD.a + rengD.b), 'Sumaste las concentraciones de los reactivos; se multiplican.']
    ],
    enunciado: (rengD) => `Para A(g) + B(g) ⇌ C(g), en el equilibrio [A] = ${rengTx(rengD.a)}, [B] = ${rengTx(rengD.b)} y [C] = ${rengTx(rengD.c)} mol/L (datos didácticos).`,
    pregunta: () => '¿Cuánto vale Kc, en L/mol?',
    datos: (rengD) => [['[A]', `${rengTx(rengD.a)} mol/L`], ['[B]', `${rengTx(rengD.b)} mol/L`], ['[C]', `${rengTx(rengD.c)} mol/L`]],
    pasos: (rengD, rengR) => ['Kc = [C]/([A]·[B]).', `Kc = ${rengTx(rengR)} L/mol.`],
    pistas: ['Productos en el numerador.', 'Cada concentración elevada a su coeficiente.', 'Los reactivos se multiplican.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s19-p2', subtema: 'n1-b10-s19', titulo: 'Kc con una tabla ICE', dificultad: 'intermedia',
    objetivo: 'Calcular Kc de A ⇌ 2B a partir de la concentración inicial de A y de [B] en el equilibrio.', unidad: 'mol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('13.2', 'los cálculos de equilibrio'), idealizado: 'Datos didácticos.', metodo: 'búsqueda por bisección de la K que da ese [B] con la solución exacta del núcleo',
    parametros: (rengRng) => ({ c0: rengEntreN1(rengRng, 0.5, 5, 0.05), f: rengEntreN1(rengRng, 0.15, 1.6, 0.01) }),
    respuesta: (rengD) => { const rengB = rengD.f * rengD.c0; return (rengB * rengB) / (rengD.c0 - rengB / 2) },
    valida: (rengD) => { const rengB = rengD.f * rengD.c0; return (rengB * rengB) / (rengD.c0 - rengB / 2) > 0.3 },
    errores: (rengD) => {
      const rengB = rengD.f * rengD.c0
      return [
        ['sin-cuadrado', 'Sin el cuadrado', rengB / (rengD.c0 - rengB / 2), 'Olvidaste el exponente 2 de [B] en la expresión de Kc.'],
        ['sin-restar', 'Sin restar lo que reacciona', (rengB * rengB) / rengD.c0, 'Usaste [A] inicial; en el equilibrio [A] = c₀ − [B]/2.']
      ]
    },
    enunciado: (rengD) => `En A(g) ⇌ 2 B(g) se parte de [A] = ${rengTx(rengD.c0)} mol/L sin B. En el equilibrio, [B] = ${rengTx(rengD.f * rengD.c0, 4)} mol/L.`,
    pregunta: () => '¿Cuánto vale Kc, en mol/L?',
    datos: (rengD) => [['[A]₀', `${rengTx(rengD.c0)} mol/L`], ['[B]eq', `${rengTx(rengD.f * rengD.c0, 4)} mol/L`]],
    pasos: (rengD, rengR) => [`[A]eq = c₀ − [B]/2 = ${rengTx(rengD.c0 - (rengD.f * rengD.c0) / 2, 4)} mol/L.`, `Kc = [B]²/[A] = ${rengTx(rengR)} mol/L.`],
    pistas: ['Escribe la tabla ICE.', 'Por cada A que reacciona salen 2 B.', 'Kc = [B]²/[A].']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s19-p3', subtema: 'n1-b10-s19', titulo: 'Composición de equilibrio', dificultad: 'avanzada',
    objetivo: 'Calcular [B] en el equilibrio de A ⇌ 2B a partir de c₀ y Kc resolviendo la cuadrática.', unidad: 'mmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('13.2', 'los cálculos de equilibrio'), idealizado: 'Datos didácticos.', metodo: 'búsqueda por bisección de x en Kc = 4x²/(c₀ − x)',
    parametros: (rengRng) => ({ c0: rengEntreN1(rengRng, 0.05, 2, 0.01), k: rengEntreN1(rengRng, 0.001, 1, 0.001) }),
    respuesta: (rengD) => 2 * rengD.c0 * rengGradoDisociacionDimero(rengD.c0, rengD.k) * 1000,
    errores: (rengD) => [
      ['x', 'El avance x', rengD.c0 * rengGradoDisociacionDimero(rengD.c0, rengD.k) * 1000, 'Diste el avance x; [B] = 2x porque se forman dos B por cada A.'],
      ['aprox', 'Sin restar en A', Math.sqrt(rengD.k * rengD.c0) * 1000, 'Supusiste [A] ≈ c₀; aquí A se consume de forma apreciable y hay que resolver la cuadrática.']
    ],
    enunciado: (rengD) => `Para A(g) ⇌ 2 B(g), Kc = ${rengTx(rengD.k)} mol/L (didáctico). Se parte de [A] = ${rengTx(rengD.c0)} mol/L sin B.`,
    pregunta: () => '¿Cuál es [B] en el equilibrio, en mmol/L?',
    datos: (rengD) => [['[A]₀', `${rengTx(rengD.c0)} mol/L`], ['Kc', `${rengTx(rengD.k)} mol/L`]],
    pasos: (rengD, rengR) => ['Kc = (2x)²/(c₀ − x) → 4x² + Kc·x − Kc·c₀ = 0.', `[B] = 2x = ${rengTx(rengR)} mmol/L.`],
    pistas: ['Escribe la tabla ICE.', 'Plantea la cuadrática en x.', 'Recuerda que [B] = 2x.']
  })
]

export const RENG_PRACTICAS_B10_S20: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s20-p1', subtema: 'n1-b10-s20', titulo: 'Kp a partir de Kc', dificultad: 'basica',
    objetivo: 'Calcular Kp de A(g) ⇌ 2 B(g) a partir de Kc y la temperatura.', unidad: 'bar', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('13.2', 'la relación entre Kp y Kc', 'r'), idealizado: 'Gases ideales.', metodo: 'búsqueda por bisección de la Kp que da esa Kc con la conversión del núcleo',
    parametros: (rengRng) => ({ k: rengEntreN1(rengRng, 0.001, 0.5, 0.001), t: rengEntreN1(rengRng, 250, 800, 5) }),
    valida: (rengD) => rengD.k * RENG_R_BAR_AB * rengD.t > 0.3,
    respuesta: (rengD) => rengD.k * RENG_R_BAR_AB * rengD.t,
    errores: (rengD) => [
      ['divide', 'Dividir entre RT', rengD.k / (RENG_R_BAR_AB * rengD.t), 'Dividiste entre RT; con Δn = 1, Kp = Kc·RT.'],
      ['r-julios', 'R en J/(mol·K)', rengD.k * 8.314462618 * rengD.t, 'Usaste R = 8,314 J/(mol·K); con bar y mol/L va R = 0,08314 L·bar/(mol·K).']
    ],
    enunciado: (rengD) => `Para A(g) ⇌ 2 B(g) a ${rengTx(rengD.t)} K, Kc = ${rengTx(rengD.k)} mol/L (didáctico). R = 0,08314 L·bar/(mol·K).`,
    pregunta: () => '¿Cuánto vale Kp, en bar?',
    datos: (rengD) => [['Kc', `${rengTx(rengD.k)} mol/L`], ['T', `${rengTx(rengD.t)} K`], ['Δn', '1']],
    pasos: (rengD, rengR) => ['Kp = Kc·(RT)^Δn con Δn = 1.', `Kp = ${rengTx(rengD.k)} × 0,08314 × ${rengTx(rengD.t)} = ${rengTx(rengR)} bar.`],
    pistas: ['Calcula Δn de gases.', 'Kp = Kc·(RT)^Δn.', 'Usa R en L·bar/(mol·K).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s20-p2', subtema: 'n1-b10-s20', titulo: 'Conversión con Δn de cualquier signo', dificultad: 'intermedia',
    objetivo: 'Calcular Kp a partir de Kc para reacciones con Δn positivo o negativo.', unidad: '', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('13.2', 'la relación entre Kp y Kc', 'r'), idealizado: 'Gases ideales.', metodo: 'conversión del núcleo resuelta al revés por bisección',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_KP_AB.length), k: rengEntreN1(rengRng, 0.01, 50, 0.01), t: rengEntreN1(rengRng, 300, 800, 10) }),
    valida: (rengD) => { const rengKp = rengD.k * (RENG_R_BAR_AB * rengD.t) ** RENG_REACCIONES_KP_AB[rengD.r]!.dn; return rengKp > 0.3 && rengKp < 1e4 },
    respuesta: (rengD) => rengD.k * (RENG_R_BAR_AB * rengD.t) ** RENG_REACCIONES_KP_AB[rengD.r]!.dn,
    errores: (rengD) => [
      ['signo', 'Signo de Δn cambiado', rengD.k * (RENG_R_BAR_AB * rengD.t) ** -RENG_REACCIONES_KP_AB[rengD.r]!.dn, 'Cambiaste el signo de Δn: es moles de gas de productos menos los de reactivos.'],
      ['sin-convertir', 'Sin convertir', rengD.k, 'Diste Kc; como Δn ≠ 0, Kp y Kc son distintas.']
    ],
    enunciado: (rengD) => `Para ${RENG_REACCIONES_KP_AB[rengD.r]!.texto} a ${rengTx(rengD.t)} K, Kc = ${rengTx(rengD.k)} (con concentraciones en mol/L; didáctico). R = 0,08314 L·bar/(mol·K).`,
    pregunta: () => '¿Cuánto vale Kp (con presiones en bar)? (escribe solo el número)',
    datos: (rengD) => [['Reacción', RENG_REACCIONES_KP_AB[rengD.r]!.texto], ['Kc', rengTx(rengD.k)], ['T', `${rengTx(rengD.t)} K`]],
    pasos: (rengD, rengR) => [`Δn = ${RENG_REACCIONES_KP_AB[rengD.r]!.dn}.`, `Kp = Kc·(RT)^Δn = ${rengTx(rengR)}.`],
    pistas: ['Cuenta los moles de gas de cada lado.', 'Δn = productos − reactivos.', 'Kp = Kc·(RT)^Δn.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s20-p3', subtema: 'n1-b10-s20', titulo: 'Disociación con Kp', dificultad: 'avanzada',
    objetivo: 'Calcular el grado de disociación de A(g) ⇌ 2 B(g) a partir de Kp, T, la cantidad inicial y el volumen.', unidad: '%', tolerancia: RENG_TOL_AB_PCT,
    fuentes: rengFuentesAb('13.2', 'la relación entre Kp y Kc', 'r'), idealizado: 'Gases ideales en un recipiente rígido.', metodo: 'búsqueda por bisección de α con presiones parciales y Qp = Kp',
    parametros: (rengRng) => ({ kp: rengEntreN1(rengRng, 0.05, 10, 0.05), t: rengEntreN1(rengRng, 280, 500, 5), n0: rengEntreN1(rengRng, 0.2, 3, 0.05), v: rengEntreN1(rengRng, 2, 40, 1) }),
    valida: (rengD) => { const rengA = rengAlfaGas(rengD.kp, rengD.t, rengD.n0, rengD.v); return rengA > 0.03 && rengA < 0.9 },
    respuesta: (rengD) => 100 * rengAlfaGas(rengD.kp, rengD.t, rengD.n0, rengD.v),
    errores: (rengD) => [
      ['kp-como-kc', 'Kp como Kc', 100 * rengGradoDisociacionDimero(rengD.n0 / rengD.v, rengD.kp), 'Usaste Kp como si fuera Kc; primero hay que convertirla: Kc = Kp/(RT).'],
      ['aprox', 'Sin restar en A', 100 * Math.sqrt((rengD.kp / (RENG_R_BAR_AB * rengD.t)) / (4 * (rengD.n0 / rengD.v))), 'Supusiste que A apenas se disocia (1 − α ≈ 1); aquí hay que resolver la cuadrática.']
    ],
    enunciado: (rengD) => `En un recipiente de ${rengTx(rengD.v)} L se ponen ${rengTx(rengD.n0)} mol de A, que se disocia según A(g) ⇌ 2 B(g) a ${rengTx(rengD.t)} K con Kp = ${rengTx(rengD.kp)} bar (didáctico).`,
    pregunta: () => '¿Qué porcentaje de A se disocia?',
    datos: (rengD) => [['n₀(A)', `${rengTx(rengD.n0)} mol`], ['V', `${rengTx(rengD.v)} L`], ['T', `${rengTx(rengD.t)} K`], ['Kp', `${rengTx(rengD.kp)} bar`]],
    pasos: (rengD, rengR) => [`Kc = Kp/(RT) = ${rengTx(rengD.kp / (RENG_R_BAR_AB * rengD.t), 4)} mol/L; c₀ = ${rengTx(rengD.n0 / rengD.v, 4)} mol/L.`, `Kc = 4c₀α²/(1 − α) → α = ${rengTx(rengR)} %.`],
    pistas: ['Convierte Kp en Kc.', 'Plantea la tabla ICE con α.', 'Resuelve la cuadrática.']
  })
]

export const RENG_PRACTICAS_B10_S21: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s21-p1', subtema: 'n1-b10-s21', titulo: 'Disociación al cambiar el volumen', dificultad: 'basica',
    objetivo: 'Calcular el nuevo grado de disociación de A ⇌ 2B al cambiar el volumen del recipiente.', unidad: '%', tolerancia: RENG_TOL_AB_PCT,
    fuentes: rengFuentesAb('13.3', 'el principio de Le Châtelier', 'r'), idealizado: 'Gases ideales a temperatura constante.', metodo: 'búsqueda por bisección de α con Qp = Kp',
    parametros: (rengRng) => ({ kp: rengEntreN1(rengRng, 0.05, 5, 0.05), n0: rengEntreN1(rengRng, 0.5, 3, 0.1), v1: rengEntreN1(rengRng, 5, 30, 1), f: rengIndice(rengRng, 4) }),
    valida: (rengD) => { const rengA = rengAlfaGas(rengD.kp, 298, rengD.n0, rengD.v1 * [0.25, 0.5, 2, 4][rengD.f]!); return rengA > 0.03 && rengA < 0.9 },
    respuesta: (rengD) => 100 * rengAlfaGas(rengD.kp, 298, rengD.n0, rengD.v1 * [0.25, 0.5, 2, 4][rengD.f]!),
    errores: (rengD) => [
      ['igual', 'Sin desplazamiento', 100 * rengAlfaGas(rengD.kp, 298, rengD.n0, rengD.v1), 'Supusiste que el equilibrio no cambia; al cambiar el volumen se desplaza.'],
      ['proporcional', 'Proporcional al volumen', 100 * rengAlfaGas(rengD.kp, 298, rengD.n0, rengD.v1) * [0.25, 0.5, 2, 4][rengD.f]!, 'Escalaste α con el volumen; el nuevo α sale de resolver otra vez el equilibrio.']
    ],
    enunciado: (rengD) => `Hay ${rengTx(rengD.n0)} mol de A en equilibrio A(g) ⇌ 2 B(g) a 298 K con Kp = ${rengTx(rengD.kp)} bar (didáctico), en ${rengTx(rengD.v1)} L. El volumen pasa a ${rengTx(rengD.v1 * [0.25, 0.5, 2, 4][rengD.f]!)} L a la misma temperatura.`,
    pregunta: () => '¿Cuál es el nuevo grado de disociación, en %?',
    datos: (rengD) => [['n₀(A)', `${rengTx(rengD.n0)} mol`], ['Volumen', `${rengTx(rengD.v1)} L → ${rengTx(rengD.v1 * [0.25, 0.5, 2, 4][rengD.f]!)} L`], ['Kp', `${rengTx(rengD.kp)} bar`]],
    pasos: (rengD, rengR) => ['Kp no cambia a T constante; cambia c₀ = n₀/V.', `Con el nuevo volumen, α = ${rengTx(rengR)} %.`],
    pistas: ['¿Cambia Kp al cambiar el volumen?', 'Recalcula c₀ con el nuevo volumen.', 'Resuelve otra vez la tabla ICE.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s21-p2', subtema: 'n1-b10-s21', titulo: 'Añadir producto a un equilibrio', dificultad: 'intermedia',
    objetivo: 'Calcular la nueva concentración de equilibrio de B tras añadir B a un equilibrio A ⇌ 2B.', unidad: 'mmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('13.3', 'el principio de Le Châtelier'), idealizado: 'Volumen y temperatura constantes; datos didácticos.', metodo: 'búsqueda por bisección del avance y de la Kc con la solución exacta del núcleo',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 0.1, 2, 0.01), b: rengEntreN1(rengRng, 0.1, 2, 0.01), d: rengEntreN1(rengRng, 0.05, 2, 0.01) }),
    respuesta: (rengD) => { const rengK = (rengD.b * rengD.b) / rengD.a; const rengC0 = rengD.a + (rengD.b + rengD.d) / 2; return 2 * rengC0 * rengGradoDisociacionDimero(rengC0, rengK) * 1000 },
    errores: (rengD) => [
      ['sin-reajuste', 'Sin reajuste', (rengD.b + rengD.d) * 1000, 'Supusiste que todo lo añadido se queda; el sistema consume parte de B.'],
      ['inicial', 'Vuelve al inicial', rengD.b * 1000, 'Supusiste que [B] vuelve a su valor inicial; el sistema solo contrarresta en parte.']
    ],
    enunciado: (rengD) => `Un equilibrio A(g) ⇌ 2 B(g) tiene [A] = ${rengTx(rengD.a)} y [B] = ${rengTx(rengD.b)} mol/L. Se añade B hasta aumentar su concentración en ${rengTx(rengD.d)} mol/L, sin cambiar el volumen ni la temperatura.`,
    pregunta: () => '¿Cuál es [B] cuando se restablece el equilibrio, en mmol/L?',
    datos: (rengD) => [['[A]', `${rengTx(rengD.a)} mol/L`], ['[B]', `${rengTx(rengD.b)} mol/L`], ['B añadido', `${rengTx(rengD.d)} mol/L`]],
    pasos: (rengD, rengR) => [`Kc = [B]²/[A] = ${rengTx((rengD.b * rengD.b) / rengD.a, 4)} mol/L; Q > Kc tras añadir B.`, `Nuevo equilibrio: [B] = ${rengTx(rengR)} mmol/L.`],
    pistas: ['Calcula Kc con el equilibrio inicial.', 'Compara Q con Kc tras añadir B.', 'Resuelve la nueva tabla ICE.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s21-p3', subtema: 'n1-b10-s21', titulo: 'Cociente justo después de ampliar el volumen', dificultad: 'avanzada',
    objetivo: 'Calcular el cociente de reacción justo después de duplicar el volumen de un equilibrio A ⇌ 2B.', unidad: 'mol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('13.3', 'el principio de Le Châtelier'), idealizado: 'Cambio instantáneo de volumen antes del reajuste.', metodo: 'concentraciones diluidas con la relación c·V constante',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 0.1, 2, 0.01), b: rengEntreN1(rengRng, 0.3, 4, 0.01), f: rengIndice(rengRng, 3) }),
    valida: (rengD) => (rengD.b * rengD.b) / rengD.a / [2, 3, 4][rengD.f]! > 0.3,
    respuesta: (rengD) => (rengD.b * rengD.b) / rengD.a / [2, 3, 4][rengD.f]!,
    errores: (rengD) => [
      ['kc', 'La Kc', (rengD.b * rengD.b) / rengD.a, 'Diste Kc; justo después de cambiar el volumen el sistema aún no está en equilibrio.'],
      ['al-cuadrado', 'Factor al cuadrado', (rengD.b * rengD.b) / rengD.a / [2, 3, 4][rengD.f]! ** 2, 'Dividiste entre el factor al cuadrado; [B]² baja con f² y [A] con f, así que Q baja con f.']
    ],
    enunciado: (rengD) => `Un equilibrio A(g) ⇌ 2 B(g) tiene [A] = ${rengTx(rengD.a)} y [B] = ${rengTx(rengD.b)} mol/L. De golpe, el volumen se multiplica por ${[2, 3, 4][rengD.f]}.`,
    pregunta: () => '¿Cuánto vale Qc justo después del cambio, en mol/L?',
    datos: (rengD) => [['[A]', `${rengTx(rengD.a)} mol/L`], ['[B]', `${rengTx(rengD.b)} mol/L`], ['Factor de volumen', String([2, 3, 4][rengD.f])]],
    pasos: (rengD, rengR) => [`Las concentraciones se dividen entre ${[2, 3, 4][rengD.f]}.`, `Qc = [B]²/[A] = ${rengTx(rengR)} mol/L < Kc: el sistema avanza hacia B.`],
    pistas: ['Divide las concentraciones entre el factor.', 'Calcula Qc con ellas.', 'Compara con Kc.']
  })
]

export const RENG_PRACTICAS_B10_S22: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s22-p1', subtema: 'n1-b10-s22', titulo: 'Solubilidad de una sal MX', dificultad: 'basica',
    objetivo: 'Calcular la solubilidad molar de una sal MX a partir de su Ksp.', unidad: 'µmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('15.1', 'el producto de solubilidad'), idealizado: 'Concentraciones como actividades; Ksp didáctico.', metodo: 'búsqueda por bisección de s en s² = Ksp',
    parametros: (rengRng) => ({ km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 6, 12, 1) }),
    respuesta: (rengD) => Math.sqrt(ka(rengD)) * 1e6,
    errores: (rengD) => [
      ['sin-raiz', 'Sin la raíz', ka(rengD) * 1e6 * 1e6, 'Olvidaste la raíz: para MX, Ksp = s², así que s = √Ksp.'],
      ['mx2', 'Fórmula de MX₂', Math.cbrt(ka(rengD) / 4) * 1e6, 'Usaste la relación de una sal MX₂; para MX, Ksp = s².']
    ],
    enunciado: (rengD) => `Una sal MX tiene Ksp = ${rengCientifico(rengD.km, rengD.ke)} (didáctico).`,
    pregunta: () => '¿Cuál es su solubilidad molar en agua pura, en µmol/L?',
    datos: (rengD) => [['Ksp', rengCientifico(rengD.km, rengD.ke)], ['Disolución', 'MX ⇌ M⁺ + X⁻']],
    pasos: (rengD, rengR) => ['[M⁺] = [X⁻] = s; Ksp = s².', `s = √Ksp = ${rengTx(rengR)} µmol/L.`],
    pistas: ['Escribe la disolución de la sal.', 'Ksp = s² para MX.', 'Pasa de mol/L a µmol/L.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s22-p2', subtema: 'n1-b10-s22', titulo: 'Solubilidad de una sal MX₂', dificultad: 'intermedia',
    objetivo: 'Calcular la solubilidad molar de una sal MX₂ a partir de su Ksp.', unidad: 'µmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('15.1', 'el producto de solubilidad'), idealizado: 'Concentraciones como actividades; Ksp didáctico.', metodo: 'búsqueda por bisección de s en s·(2s)² = Ksp',
    parametros: (rengRng) => ({ km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 6, 14, 1) }),
    respuesta: (rengD) => Math.cbrt(ka(rengD) / 4) * 1e6,
    errores: (rengD) => [
      ['como-mx', 'Como MX', Math.sqrt(ka(rengD)) * 1e6, 'Usaste la relación de una sal MX; para MX₂, Ksp = 4s³.'],
      ['sin-4', 'Sin el 4', Math.cbrt(ka(rengD)) * 1e6, 'Olvidaste el 4: [X⁻] = 2s y (2s)² = 4s².']
    ],
    enunciado: (rengD) => `Una sal MX₂ tiene Ksp = ${rengCientifico(rengD.km, rengD.ke)} (didáctico).`,
    pregunta: () => '¿Cuál es su solubilidad molar en agua pura, en µmol/L?',
    datos: (rengD) => [['Ksp', rengCientifico(rengD.km, rengD.ke)], ['Disolución', 'MX₂ ⇌ M²⁺ + 2 X⁻']],
    pasos: (rengD, rengR) => ['Ksp = s·(2s)² = 4s³.', `s = (Ksp/4)^(1/3) = ${rengTx(rengR)} µmol/L.`],
    pistas: ['[X⁻] es el doble de s.', 'Para MX₂, Ksp = 4s³.', 'Usa la raíz cúbica.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s22-p3', subtema: 'n1-b10-s22', titulo: 'pKsp a partir de la solubilidad en masa', dificultad: 'avanzada',
    objetivo: 'Calcular el pKsp de una sal MX₂ a partir de su solubilidad en gramos por litro.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('15.1', 'el producto de solubilidad', 'masas'), idealizado: 'Solubilidad didáctica; concentraciones como actividades.', metodo: 'molaridad del núcleo y logaritmo de 4s³',
    sinVerificar: ['Las solubilidades en g/L son didácticas; no son los valores de tabla de estas sales.'],
    parametros: (rengRng) => ({ f: rengIndice(rengRng, RENG_SALES_MX2_AB.length), g: rengEntreN1(rengRng, 0.001, 2, 0.001) }),
    respuesta: (rengD) => { const rengS = rengD.g / rengMmAb(RENG_SALES_MX2_AB[rengD.f]!); return -rengLog(4 * rengS ** 3) },
    errores: (rengD) => {
      const rengS = rengD.g / rengMmAb(RENG_SALES_MX2_AB[rengD.f]!)
      return [
        ['como-mx', 'Como MX', -rengLog(rengS * rengS), 'Usaste Ksp = s², que es de una sal MX; para MX₂, Ksp = 4s³.'],
        ['sin-4', 'Sin el 4', -rengLog(rengS ** 3), 'Olvidaste el 4: [X⁻] = 2s.']
      ]
    },
    enunciado: (rengD) => `En agua pura se disuelven como máximo ${rengTx(rengD.g, 4)} g/L de ${rengTextoAb(RENG_SALES_MX2_AB[rengD.f]!)} (valor didáctico).`,
    pregunta: () => '¿Cuál es su pKsp (−log Ksp)?',
    datos: (rengD) => [['Solubilidad', `${rengTx(rengD.g, 4)} g/L`], rengDatoMasaAb(RENG_SALES_MX2_AB[rengD.f]!)],
    pasos: (rengD, rengR) => [`s = ${rengTx(rengD.g / rengMmAb(RENG_SALES_MX2_AB[rengD.f]!))} mol/L.`, `Ksp = 4s³; pKsp = ${rengTx(rengR, 4)}.`],
    pistas: ['Pasa la solubilidad a mol/L.', 'Para MX₂, Ksp = 4s³.', 'Toma −log₁₀ del resultado.']
  })
]
