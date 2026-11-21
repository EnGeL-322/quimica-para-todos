import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_C_AGUA_SIN_VERIFICAR, RENG_C_AGUA_TE, RENG_DHF_CO2, RENG_DHF_H2O, RENG_E_SIN_VERIFICAR, RENG_F_TE, RENG_HIDROCARBUROS_TE, RENG_PARES_TE, RENG_REACCIONES_TE, RENG_R_TE, RENG_TOL_TE, RENG_TOL_TE_T, rengDhTe, rengFuentesTe, rengMmTe, rengNuCombustible } from './b11-comun'
import { rengParCelda } from './b11-s08-s14'
import { rengSubindice } from '../nucleo/formula'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(11)
const C = RENG_C_AGUA_TE
const F = RENG_F_TE
const R = RENG_R_TE
const hc = (rengI: number) => RENG_HIDROCARBUROS_TE[rengI]!
const MC = (rengI: number): number => 12.011 * hc(rengI).x + 1.008 * hc(rengI).y

export const RENG_INTEGRADORES_B11: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-i1', subtema: RENG_GRUPO, subtemas: ['n1-b11-s1', 'n1-b11-s5'],
    titulo: 'Calentar agua con una combustión', dificultad: 'basica',
    objetivo: 'Combinar el calor de una combustión con q = m·c·ΔT para calcular cuánto sube la temperatura del agua.', unidad: 'K', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'entalpía y calor sensible', 'masas', 'dhf'), idealizado: 'Todo el calor va al agua.', metodo: 'calor con la función del núcleo para el calor liberado y ΔT = q/(m·c)', sinVerificar: [RENG_C_AGUA_SIN_VERIFICAR],
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_TE.length), m: rengEntreN1(rengRng, 0.1, 5, 0.05), mw: rengEntreN1(rengRng, 500, 5000, 50) }),
    valida: (rengD) => { const rengQ = ((rengD.m / rengMmTe(RENG_REACCIONES_TE[rengD.r]!.combustible)) / rengNuCombustible(rengD.r)) * -rengDhTe(rengD.r) * 1000; const rengDt = rengQ / (rengD.mw * C); return rengDt > 1 && rengDt < 75 },
    respuesta: (rengD) => (((rengD.m / rengMmTe(RENG_REACCIONES_TE[rengD.r]!.combustible)) / rengNuCombustible(rengD.r)) * -rengDhTe(rengD.r) * 1000) / (rengD.mw * C),
    errores: (rengD) => {
      const rengQ = ((rengD.m / rengMmTe(RENG_REACCIONES_TE[rengD.r]!.combustible)) / rengNuCombustible(rengD.r)) * -rengDhTe(rengD.r) * 1000
      return [
        ['kj', 'Calor en kJ', rengQ / 1000 / (rengD.mw * C), 'Dejaste el calor en kJ con c en J/(g·K); pásalo a julios.'],
        ['sin-c', 'Sin el calor específico', rengQ / rengD.mw, 'Olvidaste dividir entre el calor específico del agua.']
      ]
    },
    enunciado: (rengD) => `Se queman ${rengTx(rengD.m)} g de ${rengSubindice(RENG_REACCIONES_TE[rengD.r]!.combustible)} (${RENG_REACCIONES_TE[rengD.r]!.texto}, ΔH = ${rengTx(rengDhTe(rengD.r), 5)} kJ, tabla de la app) y todo el calor va a ${rengTx(rengD.mw)} g de agua (c = 4,184 J/(g·K)).`,
    pregunta: () => '¿Cuánto sube la temperatura del agua, en K?',
    datos: (rengD) => [['Combustible', `${rengTx(rengD.m)} g`], ['ΔH', `${rengTx(rengDhTe(rengD.r), 5)} kJ`], ['Agua', `${rengTx(rengD.mw)} g`]],
    pasos: (rengD, rengR) => ['Calor liberado (subtema 5) = calor recibido por el agua.', `ΔT = q/(m·c) = ${rengTx(rengR)} K (subtema 1).`],
    pistas: ['Calcula el calor de la combustión.', 'Pasa a julios.', 'ΔT = q/(m·c).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-i2', subtema: RENG_GRUPO, subtemas: ['n1-b11-s3', 'n1-b11-s4'],
    titulo: 'Temperatura final con un metal caliente', dificultad: 'basica',
    objetivo: 'Calcular la temperatura final de un calorímetro con agua al introducir un metal caliente.', unidad: '°C', tolerancia: RENG_TOL_TE_T,
    fuentes: rengFuentesTe('5.2', 'calor específico y calorimetría'), idealizado: 'Calorímetro de capacidad conocida, sin pérdidas.', metodo: 'escena del calorímetro con los mismos datos', sinVerificar: [RENG_C_AGUA_SIN_VERIFICAR],
    parametros: (rengRng) => ({ m1: rengEntreN1(rengRng, 20, 500, 5), c1: rengEntreN1(rengRng, 0.12, 0.9, 0.01), t1: rengEntreN1(rengRng, 60, 100, 0.5), m2: rengEntreN1(rengRng, 50, 500, 5), t2: rengEntreN1(rengRng, 10, 25, 0.5), k: rengEntreN1(rengRng, 0, 200, 5) }),
    valida: (rengD) => rengD.k > 20,
    respuesta: (rengD) => (rengD.m1 * rengD.c1 * rengD.t1 + (rengD.m2 * C + rengD.k) * rengD.t2) / (rengD.m1 * rengD.c1 + rengD.m2 * C + rengD.k),
    errores: (rengD) => [
      ['sin-cal', 'Sin el calorímetro', (rengD.m1 * rengD.c1 * rengD.t1 + rengD.m2 * C * rengD.t2) / (rengD.m1 * rengD.c1 + rengD.m2 * C), 'Olvidaste que el calorímetro también recibe calor.'],
      ['media', 'Media simple', (rengD.t1 + rengD.t2) / 2, 'Hiciste la media de las temperaturas; cada cuerpo pesa según su capacidad calorífica.']
    ],
    enunciado: (rengD) => `Un metal de ${rengTx(rengD.m1)} g (c = ${rengTx(rengD.c1)} J/(g·K), didáctico) a ${rengTx(rengD.t1)} °C se introduce en un calorímetro de ${rengTx(rengD.k)} J/K con ${rengTx(rengD.m2)} g de agua a ${rengTx(rengD.t2)} °C.`,
    pregunta: () => '¿Cuál es la temperatura final, en °C?',
    datos: (rengD) => [['Metal', `${rengTx(rengD.m1)} g, ${rengTx(rengD.c1)} J/(g·K), ${rengTx(rengD.t1)} °C`], ['Agua', `${rengTx(rengD.m2)} g a ${rengTx(rengD.t2)} °C`], ['C(cal)', `${rengTx(rengD.k)} J/K`]],
    pasos: (rengD, rengR) => ['Suma de calores = 0 (subtema 4), con C = m·c de cada cuerpo (subtema 3).', `T_f = ${rengTx(rengR, 4)} °C.`],
    pistas: ['Calcula la capacidad de cada parte.', 'Plantea suma de calores = 0.', 'Despeja T_f.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-i3', subtema: RENG_GRUPO, subtemas: ['n1-b11-s5', 'n1-b11-s8'],
    titulo: 'Calor de una masa de hidrocarburo', dificultad: 'intermedia',
    objetivo: 'Calcular el calor liberado al quemar una masa de hidrocarburo con su ΔH obtenido de entalpías de formación.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'formación y combustión', 'dhf'), idealizado: 'Combustión completa con agua líquida; ΔHf del hidrocarburo didáctico.', metodo: 'suma término a término y moles con masas atómicas redondeadas declaradas',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_HIDROCARBUROS_TE.length), hf: rengEntreN1(rengRng, -150, 60, 0.5), m: rengEntreN1(rengRng, 1, 100, 0.5) }),
    respuesta: (rengD) => (rengD.m / MC(rengD.i)) * -(hc(rengD.i).x * RENG_DHF_CO2 + (hc(rengD.i).y / 2) * RENG_DHF_H2O - rengD.hf),
    errores: (rengD) => [
      ['sin-moles', 'Gramos como moles', rengD.m * -(hc(rengD.i).x * RENG_DHF_CO2 + (hc(rengD.i).y / 2) * RENG_DHF_H2O - rengD.hf), 'Multiplicaste los gramos por ΔH; pasa antes a moles.'],
      ['sin-combustible', 'Sin el ΔHf del combustible', (rengD.m / MC(rengD.i)) * -(hc(rengD.i).x * RENG_DHF_CO2 + (hc(rengD.i).y / 2) * RENG_DHF_H2O), 'Olvidaste restar la entalpía de formación del combustible.']
    ],
    valida: (rengD) => Math.abs(rengD.hf) > 30,
    enunciado: (rengD) => `Se queman ${rengTx(rengD.m)} g de ${hc(rengD.i).formula} (masa molar ${rengTx(MC(rengD.i), 5)} g/mol con C = 12,011 y H = 1,008). ΔHf(${hc(rengD.i).formula}) = ${rengTx(rengD.hf, 4)} kJ/mol (didáctico); ΔHf(CO₂) = −393,509 y ΔHf(H₂O, l) = −285,8 kJ/mol.`,
    pregunta: () => '¿Cuánto calor se libera, en kJ?',
    datos: (rengD) => [['Masa', `${rengTx(rengD.m)} g`], ['ΔHf(combustible)', `${rengTx(rengD.hf, 4)} kJ/mol`], ['M', `${rengTx(MC(rengD.i), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`ΔHc = ${rengTx(hc(rengD.i).x * RENG_DHF_CO2 + (hc(rengD.i).y / 2) * RENG_DHF_H2O - rengD.hf, 5)} kJ/mol (subtema 8).`, `q = n·|ΔHc| = ${rengTx(rengR)} kJ (subtema 5).`],
    pistas: ['Calcula ΔHc con las entalpías de formación.', 'Pasa la masa a moles.', 'Multiplica por |ΔHc|.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-i4', subtema: RENG_GRUPO, subtemas: ['n1-b11-s14', 'n1-b11-s16'],
    titulo: 'Potencial de una pila fuera del estándar', dificultad: 'intermedia',
    objetivo: 'Calcular E° de una pila con una tabla de potenciales y corregirlo con Nernst.', unidad: 'mV', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.3', 'potenciales y Nernst', 'r', 'f'), idealizado: 'Concentraciones como actividades; 298,15 K.', metodo: 'forma decimal de Nernst', sinVerificar: [RENG_E_SIN_VERIFICAR],
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_PARES_TE.length), b: rengIndice(rengRng, RENG_PARES_TE.length), ca: rengEntreN1(rengRng, 0.001, 1, 0.001), cc: rengEntreN1(rengRng, 0.001, 1, 0.001) }),
    valida: (rengD) => { const rengP = rengParCelda(rengD.a, rengD.b); const rengCorr = ((R * 298.15) / (2 * F)) * Math.abs(Math.log(rengD.ca / rengD.cc)); return rengP.cat.z === 2 && rengP.an.z === 2 && rengP.cat.E - rengP.an.E > 0.2 && rengCorr > 0.035 * (rengP.cat.E - rengP.an.E) },
    respuesta: (rengD) => { const rengP = rengParCelda(rengD.a, rengD.b); return (rengP.cat.E - rengP.an.E - ((R * 298.15) / (2 * F)) * Math.log(rengD.ca / rengD.cc)) * 1000 },
    errores: (rengD) => {
      const rengP = rengParCelda(rengD.a, rengD.b)
      return [
        ['estandar', 'Solo E°', (rengP.cat.E - rengP.an.E) * 1000, 'Diste E°; con estas concentraciones hay que aplicar Nernst.'],
        ['q-invertido', 'Q invertido', (rengP.cat.E - rengP.an.E - ((R * 298.15) / (2 * F)) * Math.log(rengD.cc / rengD.ca)) * 1000, 'Invertiste Q: es [ion del ánodo]/[ion del cátodo].']
      ]
    },
    enunciado: (rengD) => { const rengP = rengParCelda(rengD.a, rengD.b); return `Una pila ${rengP.an.metal} | ${rengP.an.ion} (${rengTx(rengD.ca)} mol/L) ‖ ${rengP.cat.ion} (${rengTx(rengD.cc)} mol/L) | ${rengP.cat.metal} a 298,15 K. E°(${rengP.an.ion}/${rengP.an.metal}) = ${rengTx(rengP.an.E)} V y E°(${rengP.cat.ion}/${rengP.cat.metal}) = ${rengTx(rengP.cat.E)} V.` },
    pregunta: () => '¿Cuál es el potencial de la pila, en mV?',
    datos: (rengD) => { const rengP = rengParCelda(rengD.a, rengD.b); return [['Ánodo', `${rengP.an.metal}, ${rengTx(rengD.ca)} mol/L`], ['Cátodo', `${rengP.cat.metal}, ${rengTx(rengD.cc)} mol/L`], ['n', '2']] },
    pasos: (rengD, rengR) => { const rengP = rengParCelda(rengD.a, rengD.b); return [`E° = ${rengTx(rengP.cat.E - rengP.an.E)} V (subtema 14).`, `E = E° − (RT/2F)·ln Q = ${rengTx(rengR, 4)} mV (subtema 16).`] },
    pistas: ['Calcula E° de la pila.', 'Escribe Q = [ánodo]/[cátodo].', 'Aplica Nernst con n = 2.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-i5', subtema: RENG_GRUPO, subtemas: ['n1-b11-s11', 'n1-b11-s13'],
    titulo: 'Equilibrio a una temperatura dada', dificultad: 'avanzada',
    objetivo: 'Calcular la temperatura a la que la constante de equilibrio vale un valor dado, a partir de ΔH y ΔS.', unidad: 'K', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.4', 'espontaneidad y equilibrio', 'r'), idealizado: 'ΔH y ΔS constantes; datos didácticos.', metodo: 'búsqueda por bisección de T con la función K = exp(−ΔG/RT) del núcleo',
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, 20, 150, 0.5), s: rengEntreN1(rengRng, 60, 300, 0.5), lk: rengEntreN1(rengRng, -2, 2, 0.1) }),
    valida: (rengD) => { const rengT = (rengD.h * 1000) / (rengD.s - R * Math.LN10 * rengD.lk); return rengT > 200 && rengT < 3000 && Math.abs(rengD.lk) > 0.3 },
    respuesta: (rengD) => (rengD.h * 1000) / (rengD.s - R * Math.LN10 * rengD.lk),
    errores: (rengD) => [
      ['k1', 'Como si K = 1', (rengD.h * 1000) / rengD.s, 'Calculaste la temperatura con ΔG = 0 (K = 1); aquí K tiene otro valor.'],
      ['ln', 'log tomado como ln', (rengD.h * 1000) / (rengD.s - R * rengD.lk), 'Usaste log₁₀ K como si fuera ln K; multiplícalo por ln 10.']
    ],
    enunciado: (rengD) => `Una reacción tiene ΔH = +${rengTx(rengD.h, 4)} kJ y ΔS = +${rengTx(rengD.s, 4)} J/K (didácticos, constantes). R = 8,314 J/(mol·K).`,
    pregunta: (rengD) => `¿A qué temperatura vale log₁₀ K = ${rengTx(rengD.lk, 2)}, en K?`,
    datos: (rengD) => [['ΔH', `${rengTx(rengD.h, 4)} kJ`], ['ΔS', `${rengTx(rengD.s, 4)} J/K`], ['log₁₀ K', rengTx(rengD.lk, 2)]],
    pasos: (rengD, rengR) => ['ΔH − T·ΔS = −RT·ln K (subtemas 11 y 13).', `T = ΔH/(ΔS − R·ln K) = ${rengTx(rengR, 4)} K.`],
    pistas: ['Iguala ΔG = ΔH − TΔS con −RT ln K.', 'Pasa log₁₀ K a ln K.', 'Despeja la temperatura T.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-i6', subtema: RENG_GRUPO, subtemas: ['n1-b11-s17', 'n1-b11-s20'],
    titulo: 'Energía para recargar con una electrólisis', dificultad: 'avanzada',
    objetivo: 'Calcular la energía eléctrica que consume una electrólisis que deposita una masa de metal a un voltaje dado.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.7', 'electrólisis y energía', 'masas', 'f'), idealizado: 'Voltaje constante; eficiencia del 100 %.', metodo: 'carga de la escena de electrólisis por el voltaje',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.5, 50, 0.1), v: rengEntreN1(rengRng, 1.5, 6, 0.1) }),
    respuesta: (rengD) => ((rengD.m / rengMmTe('Cu')) * 2 * F * rengD.v) / 1000,
    errores: (rengD) => [
      ['sin-z', 'Sin los electrones', ((rengD.m / rengMmTe('Cu')) * F * rengD.v) / 1000, 'Cada Cu²⁺ necesita 2 electrones: la carga es el doble.'],
      ['carga', 'La carga en lugar de la energía', ((rengD.m / rengMmTe('Cu')) * 2 * F) / 1000, 'Diste la carga (en kC); la energía es carga × voltaje.']
    ],
    enunciado: (rengD) => `Se depositan ${rengTx(rengD.m)} g de cobre (Cu²⁺ + 2 e⁻ → Cu) aplicando ${rengTx(rengD.v)} V (datos didácticos). F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Cuánta energía eléctrica se consume, en kJ?',
    datos: (rengD) => [['Cu', `${rengTx(rengD.m)} g`], ['Voltaje', `${rengTx(rengD.v)} V`], ['M(Cu)', `${rengTx(rengMmTe('Cu'), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Q = (m/M)·2·F = ${rengTx((rengD.m / rengMmTe('Cu')) * 2 * F)} C (subtema 17).`, `E = V·Q = ${rengTx(rengR)} kJ (subtema 20).`],
    pistas: ['Calcula la carga con Faraday.', 'Energía = voltaje × carga.', 'Pasa J a kJ.']
  })
]
