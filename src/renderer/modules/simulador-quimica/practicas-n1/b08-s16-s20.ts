import { RENG_R_LATM, RENG_R_SI, rengGasPorFormula, rengK, rengRedondear, rengTx } from '../aprender/n1/gases/constantes'
import { rengDidactico } from '../aprender/n1/procedencia'
import { rengEntreN1 } from './aleatorio'
import { RENG_TOL_GAS, RENG_TOL_KELVIN, RENG_TOL_PORCENTAJE, rengDatoMasaMolar, rengFuentesGas, rengGas, rengIndiceGas, rengNombreGas } from './b08-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_O2_M = rengGasPorFormula('O2').M
const RENG_TOL_Z = { rel: 0.01, abs: 0.005 }

export const rengPresionVdW = (rengN: number, rengV: number, rengT: number, rengA: number, rengB: number): number => (rengN * RENG_R_LATM * rengT) / (rengV - rengN * rengB) - (rengA * rengN * rengN) / (rengV * rengV)

const RENG_FUENTE_VDW = rengDidactico('Los parámetros a y b son didácticos, de un gas hipotético; no son los de ninguna sustancia real.')

export const RENG_PRACTICAS_B08_S16: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s16-p1',
    subtema: 'n1-b8-s16',
    titulo: 'Velocidad cuadrática media',
    dificultad: 'basica',
    objetivo: 'Calcular u_rms = √(3RT/M) con la masa molar en kg/mol.',
    unidad: 'm/s',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g95', 'velocidades moleculares', 'R', 'K', 'M'),
    idealizado: 'Gas ideal.',
    metodo: 'igualar (1/2)·m·u² = (3/2)·k_B·T para una molécula de masa M/N_A',
    parametros: (rengRng) => ({ g: rengIndiceGas(rengRng), t: rengEntreN1(rengRng, 5, 500, 5) }),
    respuesta: (rengD) => Math.sqrt((3 * RENG_R_SI * rengK(rengD.t)) / (rengGas(rengD.g).M / 1000)),
    errores: (rengD) => [
      ['g-mol', 'Masa molar en g/mol', Math.sqrt((3 * RENG_R_SI * rengK(rengD.t)) / rengGas(rengD.g).M), 'Usaste la masa molar en g/mol. Con R en J/(mol·K) hace falta en kg/mol para que salgan m/s.'],
      ['celsius', 'Temperatura en °C', Math.sqrt((3 * RENG_R_SI * rengD.t) / (rengGas(rengD.g).M / 1000)), 'Usaste la temperatura en °C: la fórmula exige kelvin.']
    ],
    enunciado: (rengD) => `Se considera ${rengNombreGas(rengGas(rengD.g))} como gas ideal a ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuál es la velocidad cuadrática media de sus moléculas, en m/s?',
    datos: (rengD) => [rengDatoMasaMolar(rengGas(rengD.g)), ['t', `${rengTx(rengD.t)} °C`], ['R', '8,314 J/(mol·K)']],
    pasos: (rengD, rengR) => [`M = ${rengTx(rengGas(rengD.g).M / 1000, 4)} kg/mol; T = ${rengTx(rengK(rengD.t), 5)} K.`, `u_rms = √(3 × 8,314 × ${rengTx(rengK(rengD.t), 5)} / ${rengTx(rengGas(rengD.g).M / 1000, 4)}) = ${rengTx(rengR)} m/s.`],
    pistas: ['u_rms = √(3RT/M).', 'M en kg/mol: divide la masa molar entre 1000.', 'T en kelvin.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s16-p2',
    subtema: 'n1-b8-s16',
    titulo: 'Velocidad media',
    dificultad: 'intermedia',
    objetivo: 'Calcular la velocidad media ū = √(8RT/(πM)) y distinguirla de u_rms.',
    unidad: 'm/s',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g95', 'velocidades moleculares', 'R', 'K', 'M'),
    idealizado: 'Gas ideal con la distribución de velocidades de Maxwell-Boltzmann.',
    metodo: 'ū = √(8·k_B·T/(π·m)) con la masa de una molécula en SI',
    parametros: (rengRng) => ({ g: rengIndiceGas(rengRng), t: rengEntreN1(rengRng, 5, 400, 5) }),
    respuesta: (rengD) => Math.sqrt((8 * RENG_R_SI * rengK(rengD.t)) / (Math.PI * (rengGas(rengD.g).M / 1000))),
    errores: (rengD) => [
      ['rms', 'Velocidad cuadrática media', Math.sqrt((3 * RENG_R_SI * rengK(rengD.t)) / (rengGas(rengD.g).M / 1000)), 'Esa es la velocidad cuadrática media (3RT/M). La velocidad media lleva 8/π en lugar de 3.'],
      ['mas-probable', 'Velocidad más probable', Math.sqrt((2 * RENG_R_SI * rengK(rengD.t)) / (rengGas(rengD.g).M / 1000)), 'Esa es la velocidad más probable (2RT/M). La velocidad media lleva 8/π.']
    ],
    enunciado: (rengD) => `Se considera ${rengNombreGas(rengGas(rengD.g))} como gas ideal a ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuál es la velocidad media de sus moléculas, en m/s?',
    datos: (rengD) => [rengDatoMasaMolar(rengGas(rengD.g)), ['t', `${rengTx(rengD.t)} °C`], ['R', '8,314 J/(mol·K)']],
    pasos: (rengD, rengR) => [`T = ${rengTx(rengK(rengD.t), 5)} K; M = ${rengTx(rengGas(rengD.g).M / 1000, 4)} kg/mol.`, `ū = √(8RT/(πM)) = ${rengTx(rengR)} m/s.`],
    pistas: ['Hay tres velocidades típicas: media, cuadrática media y más probable.', 'La media es √(8RT/(πM)).', 'M en kg/mol y T en kelvin.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s16-p3',
    subtema: 'n1-b8-s16',
    titulo: 'Temperatura para una velocidad dada',
    dificultad: 'avanzada',
    objetivo: 'Despejar la temperatura a la que un gas alcanza una velocidad cuadrática media dada.',
    unidad: 'K',
    tolerancia: RENG_TOL_KELVIN,
    fuentes: rengFuentesGas('g95', 'velocidades moleculares', 'R', 'M'),
    idealizado: 'Gas ideal.',
    metodo: 'simulación directa: búsqueda por bisección de la T cuya u_rms en SI (con k_B) iguala la pedida',
    parametros: (rengRng) => ({ g: rengIndiceGas(rengRng), v: rengEntreN1(rengRng, 200, 2000, 10) }),
    valida: (rengD) => {
      const rengT = (rengD.v * rengD.v * (rengGas(rengD.g).M / 1000)) / (3 * RENG_R_SI)
      return rengT >= 100 && rengT <= 2000
    },
    respuesta: (rengD) => (rengD.v * rengD.v * (rengGas(rengD.g).M / 1000)) / (3 * RENG_R_SI),
    errores: (rengD, rengR) => [
      ['g-mol', 'Masa molar en g/mol', rengR * 1000, 'Usaste la masa molar en g/mol: en esta fórmula va en kg/mol.'],
      ['sin-cuadrado', 'Velocidad sin elevar al cuadrado', (rengD.v * (rengGas(rengD.g).M / 1000)) / (3 * RENG_R_SI), 'Olvidaste elevar la velocidad al cuadrado al despejar T = u²·M/(3R).']
    ],
    enunciado: (rengD) => `Se quiere que las moléculas de ${rengNombreGas(rengGas(rengD.g))} tengan una velocidad cuadrática media de ${rengTx(rengD.v)} m/s.`,
    pregunta: () => '¿A qué temperatura hay que llevar el gas, en K?',
    datos: (rengD) => [rengDatoMasaMolar(rengGas(rengD.g)), ['u_rms', `${rengTx(rengD.v)} m/s`], ['R', '8,314 J/(mol·K)']],
    pasos: (rengD, rengR) => ['De u_rms = √(3RT/M): T = u_rms²·M/(3R).', `T = ${rengTx(rengD.v)}² × ${rengTx(rengGas(rengD.g).M / 1000, 4)} / (3 × 8,314) = ${rengTx(rengR)} K.`],
    pistas: ['Eleva al cuadrado los dos lados de u_rms = √(3RT/M).', 'M en kg/mol.', 'T = u²·M / (3R).']
  })
]

export const RENG_PRACTICAS_B08_S17: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s17-p1',
    subtema: 'n1-b8-s17',
    titulo: 'Cuál se difunde antes',
    dificultad: 'basica',
    objetivo: 'Comparar, en el modelo idealizado, la rapidez de difusión de dos gases.',
    unidad: '',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'difusión de gases', 'M'),
    idealizado: 'Rapidez de difusión proporcional a 1/√M (modelo idealizado).',
    metodo: 'cociente de velocidades medias moleculares en SI a una temperatura auxiliar',
    parametros: (rengRng) => ({ a: rengIndiceGas(rengRng), b: rengIndiceGas(rengRng) }),
    valida: (rengD) => rengGas(rengD.b).M / rengGas(rengD.a).M >= 1.4,
    respuesta: (rengD) => Math.sqrt(rengGas(rengD.b).M / rengGas(rengD.a).M),
    errores: (rengD) => [
      ['sin-raiz', 'Sin raíz cuadrada', rengGas(rengD.b).M / rengGas(rengD.a).M, 'Usaste la razón de masas molares sin raíz cuadrada.'],
      ['invertida', 'Cociente al revés', Math.sqrt(rengGas(rengD.a).M / rengGas(rengD.b).M), 'Cociente al revés: el gas más ligero es el más rápido, así que el resultado debe ser mayor que 1.']
    ],
    enunciado: (rengD) => `Se liberan a la vez ${rengNombreGas(rengGas(rengD.a))} y ${rengNombreGas(rengGas(rengD.b))} en una habitación sin corrientes, a la misma presión y temperatura.`,
    pregunta: (rengD) => `En el modelo idealizado, ¿cuántas veces más rápido se difunde el ${rengGas(rengD.a).nombre}?`,
    datos: (rengD) => [rengDatoMasaMolar(rengGas(rengD.a)), rengDatoMasaMolar(rengGas(rengD.b))],
    pasos: (rengD, rengR) => ['v_A/v_B = √(M_B/M_A).', `√(${rengTx(rengGas(rengD.b).M, 4)} / ${rengTx(rengGas(rengD.a).M, 4)}) = ${rengTx(rengR)}.`],
    pistas: ['¿Cuál de los dos es más ligero?', 'La rapidez va como 1/√M.', 'Pon la masa del gas lento en el numerador.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s17-p2',
    subtema: 'n1-b8-s17',
    titulo: 'Punto de encuentro en un tubo',
    dificultad: 'intermedia',
    objetivo: 'Calcular dónde se encuentran dos gases liberados en los extremos de un tubo.',
    unidad: 'cm',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'difusión de gases', 'M'),
    idealizado: 'Frentes de difusión a rapidez constante proporcional a 1/√M.',
    metodo: 'simulación directa del avance de los dos frentes hasta que se tocan',
    parametros: (rengRng) => ({ a: rengIndiceGas(rengRng), b: rengIndiceGas(rengRng), L: rengEntreN1(rengRng, 50, 200, 5) }),
    valida: (rengD) => rengD.a !== rengD.b && Math.abs(rengGas(rengD.a).M - rengGas(rengD.b).M) / Math.max(rengGas(rengD.a).M, rengGas(rengD.b).M) >= 0.2,
    respuesta: (rengD) => rengD.L / (1 + Math.sqrt(rengGas(rengD.a).M / rengGas(rengD.b).M)),
    errores: (rengD) => [
      ['mitad', 'En el centro', rengD.L / 2, 'Los gases no se encuentran en el centro: el más ligero avanza más.'],
      ['sin-raiz', 'Sin raíz cuadrada', rengD.L / (1 + rengGas(rengD.a).M / rengGas(rengD.b).M), 'Repartiste el tubo con la razón de masas molares sin raíz cuadrada.']
    ],
    enunciado: (rengD) => `En los extremos de un tubo de ${rengTx(rengD.L)} cm se liberan a la vez ${rengNombreGas(rengGas(rengD.a))} (extremo A) y ${rengNombreGas(rengGas(rengD.b))} (extremo B). En el modelo idealizado cada frente avanza con una rapidez proporcional a 1/√M.`,
    pregunta: () => '¿A qué distancia del extremo A se encuentran los frentes, en cm?',
    datos: (rengD) => [['Longitud', `${rengTx(rengD.L)} cm`], rengDatoMasaMolar(rengGas(rengD.a)), rengDatoMasaMolar(rengGas(rengD.b))],
    pasos: (rengD, rengR) => ['En el mismo tiempo: d_A/d_B = √(M_B/M_A) y d_A + d_B = L.', `d_A = L / (1 + √(M_A/M_B)) = ${rengTx(rengR)} cm.`],
    pistas: ['Las distancias están en la misma razón que las rapideces.', 'd_A + d_B = L.', 'd_A = L / (1 + √(M_A/M_B)).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s17-p3',
    subtema: 'n1-b8-s17',
    titulo: 'Tiempo de difusión de otro gas',
    dificultad: 'avanzada',
    objetivo: 'Combinar distancias y masas molares para estimar un tiempo de difusión en el modelo idealizado.',
    unidad: 's',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'difusión de gases', 'M'),
    idealizado: 'Frentes de difusión a rapidez constante proporcional a 1/√M.',
    metodo: 'rapidez del primer gas, rapidez del segundo por Graham y tiempo = distancia / rapidez',
    parametros: (rengRng) => ({ a: rengIndiceGas(rengRng), b: rengIndiceGas(rengRng), tA: rengEntreN1(rengRng, 10, 120, 1), d1: rengEntreN1(rengRng, 10, 50, 1), d2: rengEntreN1(rengRng, 10, 50, 1) }),
    valida: (rengD) => rengD.a !== rengD.b && Math.abs(rengD.d2 / rengD.d1 - 1) >= 0.2 && Math.abs(Math.sqrt(rengGas(rengD.b).M / rengGas(rengD.a).M) - 1) >= 0.1,
    respuesta: (rengD) => rengD.tA * (rengD.d2 / rengD.d1) * Math.sqrt(rengGas(rengD.b).M / rengGas(rengD.a).M),
    errores: (rengD) => [
      ['sin-raiz', 'Sin raíz cuadrada', rengD.tA * (rengD.d2 / rengD.d1) * (rengGas(rengD.b).M / rengGas(rengD.a).M), 'Usaste la razón de masas molares sin raíz cuadrada.'],
      ['sin-distancia', 'Sin cambiar la distancia', rengD.tA * Math.sqrt(rengGas(rengD.b).M / rengGas(rengD.a).M), 'Olvidaste que el segundo gas recorre otra distancia: multiplica también por d₂/d₁.']
    ],
    enunciado: (rengD) => `En el modelo idealizado, el frente de ${rengNombreGas(rengGas(rengD.a))} tarda ${rengTx(rengD.tA)} s en recorrer ${rengTx(rengD.d1)} cm de un tubo. En las mismas condiciones se libera ${rengNombreGas(rengGas(rengD.b))}.`,
    pregunta: (rengD) => `¿Cuánto tarda el frente de ${rengGas(rengD.b).nombre} en recorrer ${rengTx(rengD.d2)} cm, en s?`,
    datos: (rengD) => [['t_A', `${rengTx(rengD.tA)} s`], ['d₁', `${rengTx(rengD.d1)} cm`], ['d₂', `${rengTx(rengD.d2)} cm`], rengDatoMasaMolar(rengGas(rengD.a)), rengDatoMasaMolar(rengGas(rengD.b))],
    pasos: (rengD, rengR) => [`v_A = ${rengTx(rengD.d1)} / ${rengTx(rengD.tA)} = ${rengTx(rengD.d1 / rengD.tA)} cm/s.`, `v_B = v_A · √(M_A/M_B) = ${rengTx((rengD.d1 / rengD.tA) * Math.sqrt(rengGas(rengD.a).M / rengGas(rengD.b).M))} cm/s.`, `t_B = ${rengTx(rengD.d2)} / v_B = ${rengTx(rengR)} s.`],
    pistas: ['Calcula la rapidez del primer gas.', 'La del segundo sale de la razón √(M_A/M_B).', 'Tiempo = distancia / rapidez.']
  })
]

export const RENG_PRACTICAS_B08_S18: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s18-p1',
    subtema: 'n1-b8-s18',
    titulo: 'Tiempo de efusión de otro gas',
    dificultad: 'basica',
    objetivo: 'Calcular el tiempo de efusión de la misma cantidad de otro gas con t ∝ √M.',
    unidad: 's',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'efusión', 'M'),
    idealizado: 'Efusión molecular ideal a la misma P y T.',
    metodo: 'cociente de velocidades medias moleculares en SI a una temperatura auxiliar',
    parametros: (rengRng) => ({ a: rengIndiceGas(rengRng), b: rengIndiceGas(rengRng), tA: rengEntreN1(rengRng, 10, 200, 1) }),
    valida: (rengD) => {
      const rengQ = rengGas(rengD.b).M / rengGas(rengD.a).M
      return rengQ >= 1.3 || rengQ <= 1 / 1.3
    },
    respuesta: (rengD) => rengD.tA * Math.sqrt(rengGas(rengD.b).M / rengGas(rengD.a).M),
    errores: (rengD) => [
      ['sin-raiz', 'Sin raíz cuadrada', rengD.tA * (rengGas(rengD.b).M / rengGas(rengD.a).M), 'Usaste la razón de masas molares sin raíz cuadrada.'],
      ['invertida', 'Razón al revés', rengD.tA * Math.sqrt(rengGas(rengD.a).M / rengGas(rengD.b).M), 'Razón al revés: el gas más pesado escapa más despacio y tarda más.']
    ],
    enunciado: (rengD) => `Por un orificio diminuto escapa cierta cantidad de ${rengNombreGas(rengGas(rengD.a))} en ${rengTx(rengD.tA)} s. En las mismas condiciones se mide la misma cantidad de ${rengNombreGas(rengGas(rengD.b))}.`,
    pregunta: () => '¿Cuánto tarda el segundo gas, en s?',
    datos: (rengD) => [['t_A', `${rengTx(rengD.tA)} s`], rengDatoMasaMolar(rengGas(rengD.a)), rengDatoMasaMolar(rengGas(rengD.b))],
    pasos: (rengD, rengR) => ['Para la misma cantidad: t_B/t_A = √(M_B/M_A).', `t_B = ${rengTx(rengD.tA)} × √(${rengTx(rengGas(rengD.b).M, 4)} / ${rengTx(rengGas(rengD.a).M, 4)}) = ${rengTx(rengR)} s.`],
    pistas: ['El gas ligero escapa antes.', 'El tiempo es proporcional a √M.', 't_B = t_A · √(M_B/M_A).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s18-p2',
    subtema: 'n1-b8-s18',
    titulo: 'Cantidad que escapa en el mismo tiempo',
    dificultad: 'intermedia',
    objetivo: 'Calcular la cantidad de un gas que efunde en el mismo tiempo que otro.',
    unidad: 'mmol',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'efusión', 'M'),
    idealizado: 'Efusión molecular ideal a la misma P y T.',
    metodo: 'velocidades medias moleculares en SI: la cantidad efundida es proporcional a la velocidad media',
    parametros: (rengRng) => ({ a: rengIndiceGas(rengRng), b: rengIndiceGas(rengRng), nA: rengEntreN1(rengRng, 1, 50, 0.1) }),
    valida: (rengD) => {
      const rengQ = rengGas(rengD.b).M / rengGas(rengD.a).M
      return rengQ >= 1.3 || rengQ <= 1 / 1.3
    },
    respuesta: (rengD) => rengD.nA * Math.sqrt(rengGas(rengD.a).M / rengGas(rengD.b).M),
    errores: (rengD) => [
      ['invertida', 'Razón al revés', rengD.nA * Math.sqrt(rengGas(rengD.b).M / rengGas(rengD.a).M), 'Razón al revés: en el mismo tiempo escapa más cantidad del gas ligero.'],
      ['sin-raiz', 'Sin raíz cuadrada', rengD.nA * (rengGas(rengD.a).M / rengGas(rengD.b).M), 'Usaste la razón de masas molares sin raíz cuadrada.']
    ],
    enunciado: (rengD) => `En cierto tiempo escapan ${rengTx(rengD.nA)} mmol de ${rengNombreGas(rengGas(rengD.a))} por un orificio diminuto. En las mismas condiciones y durante el mismo tiempo se deja escapar ${rengNombreGas(rengGas(rengD.b))}.`,
    pregunta: () => '¿Cuántos milimoles del segundo gas escapan?',
    datos: (rengD) => [['n_A', `${rengTx(rengD.nA)} mmol`], rengDatoMasaMolar(rengGas(rengD.a)), rengDatoMasaMolar(rengGas(rengD.b))],
    pasos: (rengD, rengR) => ['n_B/n_A = r_B/r_A = √(M_A/M_B).', `n_B = ${rengTx(rengD.nA)} × √(${rengTx(rengGas(rengD.a).M, 4)} / ${rengTx(rengGas(rengD.b).M, 4)}) = ${rengTx(rengR)} mmol.`],
    pistas: ['En el mismo tiempo, la cantidad es proporcional a la velocidad de efusión.', 'Velocidad ∝ 1/√M.', 'n_B = n_A · √(M_A/M_B).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s18-p3',
    subtema: 'n1-b8-s18',
    titulo: 'Enriquecimiento por etapas',
    dificultad: 'avanzada',
    objetivo: 'Calcular cómo cambia la proporción de dos gases tras varias etapas de efusión ideales.',
    unidad: '',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'efusión y separación de gases', 'M'),
    idealizado: 'Etapas de efusión idénticas e ideales; en cada una el cociente n_ligero/n_pesado se multiplica por √(M_pesado/M_ligero).',
    metodo: 'simulación etapa por etapa con el cociente de velocidades medias moleculares en SI',
    parametros: (rengRng) => ({ a: rengIndiceGas(rengRng), b: rengIndiceGas(rengRng), x0: rengEntreN1(rengRng, 0.5, 2, 0.01), k: rengEntreN1(rengRng, 2, 5, 1) }),
    valida: (rengD) => rengGas(rengD.b).M / rengGas(rengD.a).M >= 1.2,
    respuesta: (rengD) => rengD.x0 * Math.pow(rengGas(rengD.b).M / rengGas(rengD.a).M, rengD.k / 2),
    errores: (rengD) => [
      ['una-etapa', 'Solo una etapa', rengD.x0 * Math.sqrt(rengGas(rengD.b).M / rengGas(rengD.a).M), `Aplicaste una sola etapa; son ${rengD.k}: el factor se aplica ${rengD.k} veces.`],
      ['sin-raiz', 'Sin raíz cuadrada', rengD.x0 * Math.pow(rengGas(rengD.b).M / rengGas(rengD.a).M, rengD.k), 'Usaste la razón de masas molares sin raíz cuadrada en cada etapa.']
    ],
    enunciado: (rengD) => `Una mezcla de ${rengNombreGas(rengGas(rengD.a))} y ${rengNombreGas(rengGas(rengD.b))} tiene un cociente de cantidades n(${rengGas(rengD.a).texto})/n(${rengGas(rengD.b).texto}) = ${rengTx(rengD.x0)}. Se hace pasar por ${rengD.k} etapas de efusión ideales e idénticas.`,
    pregunta: () => '¿Cuál es el cociente de cantidades después de las etapas?',
    datos: (rengD) => [['Cociente inicial', rengTx(rengD.x0)], ['Etapas', String(rengD.k)], rengDatoMasaMolar(rengGas(rengD.a)), rengDatoMasaMolar(rengGas(rengD.b))],
    pasos: (rengD, rengR) => [`Factor por etapa: √(${rengTx(rengGas(rengD.b).M, 4)} / ${rengTx(rengGas(rengD.a).M, 4)}) = ${rengTx(Math.sqrt(rengGas(rengD.b).M / rengGas(rengD.a).M))}.`, `Tras ${rengD.k} etapas: ${rengTx(rengD.x0)} × factor^${rengD.k} = ${rengTx(rengR)}.`],
    pistas: ['En cada etapa escapa proporcionalmente más gas ligero.', 'El cociente se multiplica en cada etapa por √(M_pesado/M_ligero).', 'Con k etapas, el factor se eleva a k.']
  })
]

export const RENG_PRACTICAS_B08_S19: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s19-p1',
    subtema: 'n1-b8-s19',
    titulo: 'Masa molar por comparación de velocidades',
    dificultad: 'basica',
    objetivo: 'Despejar la masa molar desconocida de la ley de Graham a partir de un cociente de velocidades.',
    unidad: 'g/mol',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'ley de Graham', 'M'),
    idealizado: 'Efusión ideal a la misma P y T.',
    metodo: 'simulación directa: bisección de la M cuya velocidad media en SI da el cociente pedido',
    parametros: (rengRng) => ({ ref: rengIndiceGas(rengRng), k: rengEntreN1(rengRng, 0.3, 3, 0.01) }),
    valida: (rengD) => Math.abs(rengD.k - 1) >= 0.15 && rengGas(rengD.ref).M / (rengD.k * rengD.k) >= 2 && rengGas(rengD.ref).M / (rengD.k * rengD.k) <= 200,
    respuesta: (rengD) => rengGas(rengD.ref).M / (rengD.k * rengD.k),
    errores: (rengD) => [
      ['sin-cuadrado', 'Sin elevar al cuadrado', rengGas(rengD.ref).M / rengD.k, 'Olvidaste elevar al cuadrado: de v_X/v_ref = √(M_ref/M_X) sale M_X = M_ref/(v_X/v_ref)².'],
      ['invertida', 'Cociente al revés', rengGas(rengD.ref).M * rengD.k * rengD.k, 'Cociente al revés: si el gas X es más rápido que el de referencia, su masa molar es menor.']
    ],
    enunciado: (rengD) => `Un gas desconocido X efunde ${rengTx(rengD.k)} veces tan rápido como ${rengNombreGas(rengGas(rengD.ref))}, en las mismas condiciones.`,
    pregunta: () => '¿Cuál es la masa molar del gas X, en g/mol?',
    datos: (rengD) => [['v_X / v_ref', rengTx(rengD.k)], rengDatoMasaMolar(rengGas(rengD.ref))],
    pasos: (rengD, rengR) => ['v_X/v_ref = √(M_ref/M_X).', `M_X = M_ref / (v_X/v_ref)² = ${rengTx(rengGas(rengD.ref).M, 4)} / ${rengTx(rengD.k)}² = ${rengTx(rengR)} g/mol.`],
    pistas: ['Escribe la ley de Graham con el gas X y el de referencia.', 'Eleva al cuadrado para quitar la raíz.', 'M_X = M_ref / k².']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s19-p2',
    subtema: 'n1-b8-s19',
    titulo: 'Masa molar por tiempos de efusión',
    dificultad: 'intermedia',
    objetivo: 'Calcular una masa molar desconocida a partir de tiempos de efusión de la misma cantidad.',
    unidad: 'g/mol',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'ley de Graham', 'M'),
    idealizado: 'Efusión ideal a la misma P y T y la misma cantidad de cada gas.',
    metodo: 'simulación directa: bisección de la M con la que el tiempo, inverso de la velocidad media en SI, reproduce el medido',
    parametros: (rengRng) => ({ ref: rengIndiceGas(rengRng), tref: rengEntreN1(rengRng, 20, 100, 1), tX: rengEntreN1(rengRng, 20, 200, 1) }),
    valida: (rengD) => {
      const rengM = rengGas(rengD.ref).M * (rengD.tX / rengD.tref) ** 2
      return Math.abs(rengD.tX / rengD.tref - 1) >= 0.15 && rengM >= 2 && rengM <= 200
    },
    respuesta: (rengD) => rengGas(rengD.ref).M * (rengD.tX / rengD.tref) ** 2,
    errores: (rengD) => [
      ['sin-cuadrado', 'Sin elevar al cuadrado', rengGas(rengD.ref).M * (rengD.tX / rengD.tref), 'Olvidaste elevar al cuadrado el cociente de tiempos.'],
      ['invertida', 'Cociente de tiempos al revés', rengGas(rengD.ref).M * (rengD.tref / rengD.tX) ** 2, 'Cociente al revés: si el gas X tarda más, su masa molar es mayor.']
    ],
    enunciado: (rengD) => `La misma cantidad de ${rengNombreGas(rengGas(rengD.ref))} tarda ${rengTx(rengD.tref)} s en efundir y la de un gas desconocido X tarda ${rengTx(rengD.tX)} s, en las mismas condiciones.`,
    pregunta: () => '¿Cuál es la masa molar del gas X, en g/mol?',
    datos: (rengD) => [['t_ref', `${rengTx(rengD.tref)} s`], ['t_X', `${rengTx(rengD.tX)} s`], rengDatoMasaMolar(rengGas(rengD.ref))],
    pasos: (rengD, rengR) => ['t_X/t_ref = √(M_X/M_ref).', `M_X = M_ref · (t_X/t_ref)² = ${rengTx(rengGas(rengD.ref).M, 4)} × (${rengTx(rengD.tX)}/${rengTx(rengD.tref)})² = ${rengTx(rengR)} g/mol.`],
    pistas: ['El tiempo es proporcional a √M.', 'Eleva al cuadrado el cociente de tiempos.', 'M_X = M_ref · (t_X/t_ref)².']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s19-p3',
    subtema: 'n1-b8-s19',
    titulo: 'Graham con un dato de densidad',
    dificultad: 'avanzada',
    objetivo: 'Encadenar densidad relativa y ley de Graham para obtener una masa molar.',
    unidad: 'g/mol',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'ley de Graham', 'M'),
    idealizado: 'Gases ideales y efusión ideal a la misma P y T.',
    metodo: 'M_Y desde el cociente de densidades calculadas en SI y M_X por bisección con velocidades medias en SI',
    parametros: (rengRng) => ({ d: rengEntreN1(rengRng, 0.5, 4, 0.01), k: rengEntreN1(rengRng, 1.2, 4, 0.01) }),
    valida: (rengD) => {
      const rengM = (rengD.d * RENG_O2_M) / (rengD.k * rengD.k)
      return rengM >= 2 && rengM <= 200
    },
    respuesta: (rengD) => (rengD.d * RENG_O2_M) / (rengD.k * rengD.k),
    errores: (rengD) => [
      ['sin-cuadrado', 'Sin elevar al cuadrado', (rengD.d * RENG_O2_M) / rengD.k, 'Olvidaste elevar al cuadrado el cociente de velocidades.'],
      ['sin-densidad', 'Sin la densidad relativa', RENG_O2_M / (rengD.k * rengD.k), 'Usaste la masa molar del O₂ como si fuera la de Y. Primero M_Y = d · M(O₂).']
    ],
    enunciado: (rengD) => `Un gas Y es ${rengTx(rengD.d)} veces tan denso como el oxígeno (O₂) a la misma presión y temperatura. Un gas X efunde ${rengTx(rengD.k)} veces tan rápido como Y en las mismas condiciones.`,
    pregunta: () => '¿Cuál es la masa molar del gas X, en g/mol?',
    datos: (rengD) => [['ρ_Y / ρ(O₂)', rengTx(rengD.d)], ['v_X / v_Y', rengTx(rengD.k)], ['M(O₂)', `${rengTx(RENG_O2_M, 4)} g/mol`]],
    pasos: (rengD, rengR) => [`A igual P y T, la densidad es proporcional a M: M_Y = ${rengTx(rengD.d)} × ${rengTx(RENG_O2_M, 4)} = ${rengTx(rengD.d * RENG_O2_M)} g/mol.`, `M_X = M_Y / (v_X/v_Y)² = ${rengTx(rengR)} g/mol.`],
    pistas: ['Empieza por la masa molar de Y.', 'Densidad relativa = razón de masas molares.', 'Luego aplica Graham: M_X = M_Y / k².']
  })
]

export const RENG_PRACTICAS_B08_S20: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s20-p1',
    subtema: 'n1-b8-s20',
    titulo: 'Factor de compresibilidad',
    dificultad: 'basica',
    objetivo: 'Calcular Z = PV/(nRT) e interpretar si el gas se aparta del ideal.',
    unidad: '',
    tolerancia: RENG_TOL_Z,
    fuentes: [...rengFuentesGas('g96', 'factor de compresibilidad', 'R', 'K'), rengDidactico('Las presiones «medidas» son didácticas; no son mediciones de un gas real.')],
    idealizado: 'Ensayo didáctico de un gas real hipotético.',
    metodo: 'el mismo cociente en unidades SI con R = N_A·k_B, Pa y m³',
    parametros: (rengRng) => {
      const rengN = rengEntreN1(rengRng, 0.5, 3, 0.01)
      const rengV = rengEntreN1(rengRng, 0.2, 2, 0.01)
      const rengT = rengEntreN1(rengRng, -20, 150, 1)
      const rengZ = rengRng() < 0.5 ? rengEntreN1(rengRng, 0.55, 0.85, 0.01) : rengEntreN1(rengRng, 1.15, 1.45, 0.01)
      return { n: rengN, V: rengV, t: rengT, P: rengRedondear((rengZ * rengN * RENG_R_LATM * rengK(rengT)) / rengV) }
    },
    valida: (rengD) => rengD.P >= 5 && rengD.P <= 300,
    respuesta: (rengD) => (rengD.P * rengD.V) / (rengD.n * RENG_R_LATM * rengK(rengD.t)),
    errores: (rengD, rengR) => [
      ['inversa', 'Cociente al revés', 1 / rengR, 'Calculaste el cociente al revés: Z = PV/(nRT) = P_medida / P_ideal.'],
      ['celsius', 'Temperatura en °C', (rengD.P * rengD.V) / (rengD.n * RENG_R_LATM * rengD.t), 'Usaste la temperatura en °C: pásala a kelvin.']
    ],
    enunciado: (rengD) => `En un ensayo didáctico, ${rengTx(rengD.n)} mol de un gas en ${rengTx(rengD.V)} L a ${rengTx(rengD.t)} °C ejercen ${rengTx(rengD.P)} atm.`,
    pregunta: () => '¿Cuál es el factor de compresibilidad Z?',
    datos: (rengD) => [['n', `${rengTx(rengD.n)} mol`], ['V', `${rengTx(rengD.V)} L`], ['t', `${rengTx(rengD.t)} °C`], ['P medida (didáctica)', `${rengTx(rengD.P)} atm`]],
    pasos: (rengD, rengR) => [`P_ideal = nRT/V = ${rengTx((rengD.n * RENG_R_LATM * rengK(rengD.t)) / rengD.V)} atm.`, `Z = P/P_ideal = ${rengTx(rengR)}.`, rengR < 1 ? 'Z < 1: dominan las atracciones.' : 'Z > 1: domina el volumen propio de las moléculas.'],
    pistas: ['Calcula la presión que tendría un gas ideal.', 'Z = PV/(nRT).', 'T en kelvin.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s20-p2',
    subtema: 'n1-b8-s20',
    titulo: 'Presión de van der Waals',
    dificultad: 'intermedia',
    objetivo: 'Calcular la presión con la ecuación de van der Waals con parámetros didácticos.',
    unidad: 'atm',
    tolerancia: RENG_TOL_GAS,
    fuentes: [...rengFuentesGas('g96', 'ecuación de van der Waals', 'R'), RENG_FUENTE_VDW],
    idealizado: 'Gas de van der Waals hipotético.',
    metodo: 'la misma ecuación en unidades SI (Pa, m³, a y b convertidos) y vuelta a atm',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 1, 6, 0.1), b: rengEntreN1(rengRng, 0.02, 0.06, 0.001), n: rengEntreN1(rengRng, 1, 3, 0.05), V: rengEntreN1(rengRng, 1, 5, 0.05), T: rengEntreN1(rengRng, 250, 400, 5) }),
    valida: (rengD) => rengD.V > 3 * rengD.n * rengD.b && rengPresionVdW(rengD.n, rengD.V, rengD.T, rengD.a, rengD.b) > 1,
    respuesta: (rengD) => rengPresionVdW(rengD.n, rengD.V, rengD.T, rengD.a, rengD.b),
    errores: (rengD) => [
      ['ideal', 'Presión ideal', (rengD.n * RENG_R_LATM * rengD.T) / rengD.V, 'Esa es la presión del gas ideal. Aplica las dos correcciones de van der Waals.'],
      ['signo', 'Atracción con el signo cambiado', (rengD.n * RENG_R_LATM * rengD.T) / (rengD.V - rengD.n * rengD.b) + (rengD.a * rengD.n * rengD.n) / (rengD.V * rengD.V), 'Sumaste el término de atracción: las atracciones reducen la presión, así que se resta a·n²/V².']
    ],
    enunciado: (rengD) => `Un gas hipotético tiene a = ${rengTx(rengD.a)} L²·atm/mol² y b = ${rengTx(rengD.b)} L/mol. Hay ${rengTx(rengD.n)} mol en ${rengTx(rengD.V)} L a ${rengTx(rengD.T)} K.`,
    pregunta: () => 'Según la ecuación de van der Waals, ¿qué presión ejerce, en atm?',
    datos: (rengD) => [['a (didáctico)', `${rengTx(rengD.a)} L²·atm/mol²`], ['b (didáctico)', `${rengTx(rengD.b)} L/mol`], ['n', `${rengTx(rengD.n)} mol`], ['V', `${rengTx(rengD.V)} L`], ['T', `${rengTx(rengD.T)} K`]],
    pasos: (rengD, rengR) => [`Término de volumen: nRT/(V − nb) = ${rengTx((rengD.n * RENG_R_LATM * rengD.T) / (rengD.V - rengD.n * rengD.b))} atm.`, `Término de atracción: a·n²/V² = ${rengTx((rengD.a * rengD.n * rengD.n) / (rengD.V * rengD.V))} atm.`, `P = ${rengTx(rengR)} atm.`],
    pistas: ['Resta al volumen el volumen propio de las moléculas, n·b.', 'Resta a la presión el efecto de las atracciones, a·n²/V².', 'R = 0,08206 L·atm/(mol·K).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s20-p3',
    subtema: 'n1-b8-s20',
    titulo: 'Cuánto se equivoca el modelo ideal',
    dificultad: 'avanzada',
    objetivo: 'Comparar la presión ideal con la de van der Waals mediante una desviación relativa con signo.',
    unidad: '%',
    tolerancia: RENG_TOL_PORCENTAJE,
    fuentes: [...rengFuentesGas('g96', 'comportamiento no ideal', 'R'), RENG_FUENTE_VDW],
    idealizado: 'Gas de van der Waals hipotético.',
    metodo: 'las dos presiones recalculadas en unidades SI y la desviación relativa a partir de ellas',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 1, 6, 0.1), b: rengEntreN1(rengRng, 0.02, 0.06, 0.001), n: rengEntreN1(rengRng, 1, 3, 0.05), V: rengEntreN1(rengRng, 1, 5, 0.05), T: rengEntreN1(rengRng, 250, 400, 5) }),
    valida: (rengD) => {
      const rengPv = rengPresionVdW(rengD.n, rengD.V, rengD.T, rengD.a, rengD.b)
      const rengPi = (rengD.n * RENG_R_LATM * rengD.T) / rengD.V
      return rengD.V > 3 * rengD.n * rengD.b && rengPv > 1 && Math.abs((rengPi - rengPv) / rengPv) * 100 >= 3
    },
    respuesta: (rengD) => {
      const rengPv = rengPresionVdW(rengD.n, rengD.V, rengD.T, rengD.a, rengD.b)
      return (((rengD.n * RENG_R_LATM * rengD.T) / rengD.V - rengPv) / rengPv) * 100
    },
    errores: (rengD, rengR) => {
      const rengPv = rengPresionVdW(rengD.n, rengD.V, rengD.T, rengD.a, rengD.b)
      const rengPi = (rengD.n * RENG_R_LATM * rengD.T) / rengD.V
      return [
        ['denominador-ideal', 'Dividido entre la presión ideal', ((rengPi - rengPv) / rengPi) * 100, 'Dividiste entre la presión ideal. La desviación se mide respecto de la presión de van der Waals.'],
        ['signo', 'Signo cambiado', -rengR, 'Cambiaste el signo: δ es positiva si el modelo ideal da más presión que van der Waals.']
      ]
    },
    enunciado: (rengD) => `Para un gas hipotético con a = ${rengTx(rengD.a)} L²·atm/mol² y b = ${rengTx(rengD.b)} L/mol, hay ${rengTx(rengD.n)} mol en ${rengTx(rengD.V)} L a ${rengTx(rengD.T)} K.`,
    pregunta: () => '¿Cuál es la desviación δ = (P_ideal − P_vdW)/P_vdW, en %?',
    datos: (rengD) => [['a (didáctico)', `${rengTx(rengD.a)} L²·atm/mol²`], ['b (didáctico)', `${rengTx(rengD.b)} L/mol`], ['n', `${rengTx(rengD.n)} mol`], ['V', `${rengTx(rengD.V)} L`], ['T', `${rengTx(rengD.T)} K`]],
    pasos: (rengD, rengR) => [`P_ideal = ${rengTx((rengD.n * RENG_R_LATM * rengD.T) / rengD.V)} atm.`, `P_vdW = ${rengTx(rengPresionVdW(rengD.n, rengD.V, rengD.T, rengD.a, rengD.b))} atm.`, `δ = ${rengTx(rengR)} %.`],
    pistas: ['Calcula las dos presiones.', 'La referencia (denominador) es la presión de van der Waals.', 'Conserva el signo de la diferencia.']
  })
]
