import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_HIDROXIDOS_2, RENG_KW_AB, RENG_KW_SIN_VERIFICAR, RENG_R_BAR_AB, RENG_TOL_AB, RENG_TOL_PH, rengCientifico, rengDatoMasaAb, rengFuentesAb, rengLog, rengMmAb, rengRaizCuadratica, rengTextoAb, rengValorCient } from './b10-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(10)
const KW = RENG_KW_AB
const KW_SV = [RENG_KW_SIN_VERIFICAR]
type D = Readonly<Record<string, number>>
const ka = (rengD: D): number => rengValorCient(rengD.km!, rengD.ke!)

export const RENG_INTEGRADORES_B10: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-i1', subtema: RENG_GRUPO, subtemas: ['n1-b10-s9', 'n1-b10-s11'],
    titulo: 'OH⁻ de una disolución a partir de su pH', dificultad: 'basica',
    objetivo: 'Pasar del pH a [H₃O⁺] y, con Kw, a [OH⁻].', unidad: 'nmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.2', 'pH y producto iónico'), idealizado: '25 °C, Kw = 1,0·10⁻¹⁴.', metodo: 'pOH = 14 − pH y potencia de 10 en nmol/L', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, 5, 6.9, 0.01) }),
    respuesta: (rengD) => (KW / 10 ** -rengD.h) * 1e9,
    errores: (rengD) => [
      ['h', 'Diste [H₃O⁺]', 10 ** -rengD.h * 1e9, 'Diste [H₃O⁺]; [OH⁻] es Kw dividido entre [H₃O⁺].'],
      ['poh', 'Diste el pOH', 14 - rengD.h, 'Diste el pOH; la pregunta pide la concentración de OH⁻ en nmol/L.']
    ],
    enunciado: (rengD) => `Un agua tiene pH ${rengTx(rengD.h, 3)} a 25 °C (Kw = 1,0·10⁻¹⁴; dato didáctico).`,
    pregunta: () => '¿Cuál es su [OH⁻], en nmol/L?',
    datos: (rengD) => [['pH', rengTx(rengD.h, 3)], ['Kw', '1,0·10⁻¹⁴']],
    pasos: (rengD, rengR) => [`[H₃O⁺] = 10^(−pH) = ${rengTx(10 ** -rengD.h)} mol/L (subtema 9).`, `[OH⁻] = Kw/[H₃O⁺] = ${rengTx(rengR)} nmol/L (subtema 11).`],
    pistas: ['Pasa el pH a [H₃O⁺].', 'Usa Kw = [H₃O⁺]·[OH⁻].', 'Pasa a nmol/L.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-i2', subtema: RENG_GRUPO, subtemas: ['n1-b10-s1', 'n1-b10-s10'],
    titulo: 'pOH de un hidróxido pesado', dificultad: 'basica',
    objetivo: 'Combinar la estequiometría de una base de Arrhenius con la definición de pOH.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('4.2', 'bases de Arrhenius y pOH', 'masas'), idealizado: 'Disociación completa; toda la masa se disuelve.', metodo: 'molaridad con litros del catálogo y logaritmo',
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDROXIDOS_2.length), m: rengEntreN1(rengRng, 0.01, 2, 0.01), v: rengEntreN1(rengRng, 250, 5000, 250) }),
    valida: (rengD) => { const rengOh = (2 * rengD.m) / rengMmAb(RENG_HIDROXIDOS_2[rengD.h]!) / (rengD.v / 1000); return rengOh > 1e-4 && rengOh < 0.2 },
    respuesta: (rengD) => -rengLog((2 * rengD.m) / rengMmAb(RENG_HIDROXIDOS_2[rengD.h]!) / (rengD.v / 1000)),
    errores: (rengD) => {
      const rengOh = (2 * rengD.m) / rengMmAb(RENG_HIDROXIDOS_2[rengD.h]!) / (rengD.v / 1000)
      return [
        ['sin-2', 'Sin los dos OH⁻', -rengLog(rengOh / 2), 'Olvidaste que cada fórmula libera dos OH⁻.'],
        ['ph', 'El pH', 14 + rengLog(rengOh), 'Diste el pH; la pregunta pide el pOH, −log[OH⁻].']
      ]
    },
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.m)} g de ${rengTextoAb(RENG_HIDROXIDOS_2[rengD.h]!)} hasta ${rengTx(rengD.v)} mL.`,
    pregunta: () => '¿Cuál es el pOH de la disolución?',
    datos: (rengD) => [['Base', `${rengTx(rengD.m)} g`], ['Volumen', `${rengTx(rengD.v)} mL`], rengDatoMasaAb(RENG_HIDROXIDOS_2[rengD.h]!)],
    pasos: (rengD, rengR) => [`[OH⁻] = 2 × n/V = ${rengTx(10 ** -rengR, 4)} mol/L (subtema 1).`, `pOH = −log[OH⁻] = ${rengTx(rengR, 4)} (subtema 10).`],
    pistas: ['Cada fórmula da dos OH⁻.', 'Calcula [OH⁻] en mol/L.', 'pOH = −log[OH⁻].']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-i3', subtema: RENG_GRUPO, subtemas: ['n1-b10-s14', 'n1-b10-s16'],
    titulo: 'pH en la equivalencia de una base débil', dificultad: 'intermedia',
    objetivo: 'Calcular el pH en la equivalencia al valorar una base débil con un ácido fuerte (hidrólisis del ácido conjugado).', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.7', 'valoraciones e hidrólisis'), idealizado: 'Volúmenes aditivos; 25 °C; agua despreciable.', metodo: 'balance de carga del núcleo con Ka = Kw/Kb', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ cb: rengEntreN1(rengRng, 0.02, 0.5, 0.01), vb: rengEntreN1(rengRng, 10, 50, 1), ca: rengEntreN1(rengRng, 0.05, 0.5, 0.01), km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 4, 6, 1) }),
    respuesta: (rengD) => { const rengVa = (rengD.cb * rengD.vb) / rengD.ca; const rengC = (rengD.cb * rengD.vb) / (rengD.vb + rengVa); return -rengLog(rengRaizCuadratica(KW / ka(rengD), rengC)) },
    errores: (rengD) => [
      ['siete', 'Siempre 7', 7, 'Supusiste pH 7; en la equivalencia queda BH⁺, un ácido débil, y el pH es menor que 7.'],
      ['sin-diluir', 'Sin diluir', -rengLog(rengRaizCuadratica(KW / ka(rengD), rengD.cb)), 'Usaste la concentración inicial de la base; en la equivalencia BH⁺ está en el volumen total.']
    ],
    enunciado: (rengD) => `Se valoran ${rengTx(rengD.vb)} mL de una base débil B ${rengTx(rengD.cb)} mol/L (Kb = ${rengCientifico(rengD.km, rengD.ke)}, didáctico) con HCl ${rengTx(rengD.ca)} mol/L a 25 °C.`,
    pregunta: () => '¿Cuál es el pH en el punto de equivalencia?',
    datos: (rengD) => [['Base', `${rengTx(rengD.vb)} mL, ${rengTx(rengD.cb)} mol/L`], ['Kb', rengCientifico(rengD.km, rengD.ke)], ['HCl', `${rengTx(rengD.ca)} mol/L`]],
    pasos: (rengD, rengR) => [`V(HCl) = ${rengTx((rengD.cb * rengD.vb) / rengD.ca)} mL (subtema 14).`, `BH⁺ con Ka = Kw/Kb hidroliza (subtema 16): pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Calcula el volumen de equivalencia.', 'Halla [BH⁺] en el volumen total.', 'Trata BH⁺ como ácido débil.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-i4', subtema: RENG_GRUPO, subtemas: ['n1-b10-s12', 'n1-b10-s17'],
    titulo: 'pKa a partir del pH de un amortiguador', dificultad: 'intermedia',
    objetivo: 'Deducir el pKa de un ácido débil a partir del pH medido de un amortiguador.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.6', 'amortiguadores y pKa'), idealizado: 'Henderson-Hasselbalch con concentraciones iniciales.', metodo: 'Ka = [H₃O⁺]·[A⁻]/[HA] y logaritmo',
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, 3, 10, 0.01), ca: rengEntreN1(rengRng, 0.02, 1, 0.01), cs: rengEntreN1(rengRng, 0.02, 1, 0.01) }),
    valida: (rengD) => Math.abs(rengLog(rengD.cs / rengD.ca)) > 0.15,
    respuesta: (rengD) => rengD.h - rengLog(rengD.cs / rengD.ca),
    errores: (rengD) => [
      ['suma', 'Suma del logaritmo', rengD.h + rengLog(rengD.cs / rengD.ca), 'Sumaste el logaritmo; al despejar, pKa = pH − log([A⁻]/[HA]).'],
      ['ph', 'El pH', rengD.h, 'Diste el pH; solo coincide con el pKa si [A⁻] = [HA].']
    ],
    enunciado: (rengD) => `Un amortiguador con ${rengTx(rengD.ca)} mol/L de HA y ${rengTx(rengD.cs)} mol/L de NaA tiene pH ${rengTx(rengD.h, 3)}.`,
    pregunta: () => '¿Cuál es el pKa del ácido HA?',
    datos: (rengD) => [['[HA]', `${rengTx(rengD.ca)} mol/L`], ['[A⁻]', `${rengTx(rengD.cs)} mol/L`], ['pH', rengTx(rengD.h, 3)]],
    pasos: (rengD, rengR) => ['pH = pKa + log([A⁻]/[HA]) (subtema 17).', `pKa = pH − log(${rengTx(rengD.cs / rengD.ca, 3)}) = ${rengTx(rengR, 4)} (subtema 12).`],
    pistas: ['Usa Henderson-Hasselbalch.', 'Despeja el pKa.', 'Cuida el signo del logaritmo.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-i5', subtema: RENG_GRUPO, subtemas: ['n1-b10-s19', 'n1-b10-s20'],
    titulo: 'Kp a partir de la disociación medida', dificultad: 'avanzada',
    objetivo: 'Calcular Kc de A ⇌ 2B a partir del grado de disociación medido y convertirla en Kp.', unidad: 'bar', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('13.2', 'Kc, Kp y tablas ICE', 'r'), idealizado: 'Gases ideales en un recipiente rígido.', metodo: 'presiones parciales P = n·R·T/V y Kp = P_B²/P_A',
    parametros: (rengRng) => ({ n0: rengEntreN1(rengRng, 0.2, 3, 0.05), v: rengEntreN1(rengRng, 2, 40, 1), t: rengEntreN1(rengRng, 280, 500, 5), a: rengEntreN1(rengRng, 5, 80, 0.5) }),
    valida: (rengD) => { const rengC0 = rengD.n0 / rengD.v; const rengAl = rengD.a / 100; return ((4 * rengC0 * rengAl * rengAl) / (1 - rengAl)) * RENG_R_BAR_AB * rengD.t > 0.3 },
    respuesta: (rengD) => { const rengC0 = rengD.n0 / rengD.v; const rengAl = rengD.a / 100; return ((4 * rengC0 * rengAl * rengAl) / (1 - rengAl)) * RENG_R_BAR_AB * rengD.t },
    errores: (rengD) => {
      const rengC0 = rengD.n0 / rengD.v
      const rengAl = rengD.a / 100
      return [
        ['kc', 'Diste Kc', (4 * rengC0 * rengAl * rengAl) / (1 - rengAl), 'Diste Kc; como Δn = 1, Kp = Kc·RT.'],
        ['sin-restar', 'Sin restar en A', 4 * rengC0 * rengAl * rengAl * RENG_R_BAR_AB * rengD.t, 'Usaste [A] inicial; en el equilibrio [A] = c₀(1 − α).']
      ]
    },
    enunciado: (rengD) => `Se ponen ${rengTx(rengD.n0)} mol de A en ${rengTx(rengD.v)} L a ${rengTx(rengD.t)} K; en el equilibrio A(g) ⇌ 2 B(g) se ha disociado el ${rengTx(rengD.a)} % de A (dato didáctico). R = 0,08314 L·bar/(mol·K).`,
    pregunta: () => '¿Cuánto vale Kp, en bar?',
    datos: (rengD) => [['n₀(A)', `${rengTx(rengD.n0)} mol`], ['V', `${rengTx(rengD.v)} L`], ['T', `${rengTx(rengD.t)} K`], ['α', `${rengTx(rengD.a)} %`]],
    pasos: (rengD, rengR) => [`Kc = 4c₀α²/(1 − α) = ${rengTx(rengR / (RENG_R_BAR_AB * rengD.t), 4)} mol/L (subtema 19).`, `Kp = Kc·RT = ${rengTx(rengR)} bar (subtema 20).`],
    pistas: ['Escribe la tabla ICE con α.', 'Calcula Kc.', 'Convierte con Kp = Kc·RT.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-i6', subtema: RENG_GRUPO, subtemas: ['n1-b10-s5', 'n1-b10-s14', 'n1-b10-s17'],
    titulo: 'pH antes de la equivalencia', dificultad: 'avanzada',
    objetivo: 'Calcular el pH de un ácido débil parcialmente neutralizado con NaOH (zona amortiguadora de la valoración).', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.7', 'la curva de valoración'), idealizado: 'Henderson-Hasselbalch tras la neutralización; volúmenes aditivos.', metodo: '[H₃O⁺] = Ka·n(HA)/n(A⁻) tras la neutralización',
    parametros: (rengRng) => ({ ca: rengEntreN1(rengRng, 0.05, 0.5, 0.01), va: rengEntreN1(rengRng, 10, 50, 1), cb: rengEntreN1(rengRng, 0.05, 0.5, 0.01), f: rengEntreN1(rengRng, 0.1, 0.9, 0.01), p: rengEntreN1(rengRng, 3, 6, 0.01) }),
    valida: (rengD) => Math.abs(rengD.f - 0.5) > 0.06,
    respuesta: (rengD) => rengD.p + rengLog(rengD.f / (1 - rengD.f)),
    errores: (rengD) => [
      ['sin-reaccion', 'Sin la base', -rengLog(rengRaizCuadratica(10 ** -rengD.p, rengD.ca)), 'Calculaste el pH del ácido solo; la NaOH añadida forma A⁻ y crea un amortiguador.'],
      ['invertido', 'Cociente invertido', rengD.p + rengLog((1 - rengD.f) / rengD.f), 'Invertiste el cociente: es A⁻ formado entre HA que queda.']
    ],
    enunciado: (rengD) => `A ${rengTx(rengD.va)} mL de un ácido débil HA ${rengTx(rengD.ca)} mol/L (pKa = ${rengTx(rengD.p, 3)}, didáctico) se añaden ${rengTx((rengD.f * rengD.ca * rengD.va) / rengD.cb)} mL de NaOH ${rengTx(rengD.cb)} mol/L.`,
    pregunta: () => '¿Cuál es el pH de la mezcla?',
    datos: (rengD) => [['HA', `${rengTx(rengD.va)} mL, ${rengTx(rengD.ca)} mol/L`], ['pKa', rengTx(rengD.p, 3)], ['NaOH', `${rengTx((rengD.f * rengD.ca * rengD.va) / rengD.cb)} mL, ${rengTx(rengD.cb)} mol/L`]],
    pasos: (rengD, rengR) => [`mmol: HA ${rengTx(rengD.ca * rengD.va)}, OH⁻ ${rengTx(rengD.f * rengD.ca * rengD.va)}; quedan HA y A⁻ (subtema 14).`, `pH = pKa + log(A⁻/HA) = ${rengTx(rengR, 4)} (subtema 17).`],
    pistas: ['Calcula los mmol de HA y de OH⁻.', 'El OH⁻ convierte HA en A⁻.', 'Aplica Henderson-Hasselbalch.']
  })
]
