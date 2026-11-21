import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_ANODOS_TE, RENG_DEPOSITOS_TE, RENG_E_SIN_VERIFICAR, RENG_F_TE, RENG_PARES_TE, RENG_R_TE, RENG_SACRIFICIO_TE, RENG_TOL_TE, rengFuentesTe, rengMmTe } from './b11-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const F = RENG_F_TE
const R = RENG_R_TE
const ESV = [RENG_E_SIN_VERIFICAR]
const AN = (rengI: number) => RENG_ANODOS_TE[rengI]!
const DE = (rengI: number) => RENG_DEPOSITOS_TE[rengI]!
const SA = (rengI: number) => RENG_SACRIFICIO_TE[rengI]!
const M = (rengMetal: string): number => rengMmTe(rengMetal)
const FE = RENG_PARES_TE.find((rengP) => rengP.metal === 'Fe')!

export const RENG_PRACTICAS_B11_S15: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s15-p1', subtema: 'n1-b11-s15', titulo: 'Masa que pierde el ánodo', dificultad: 'basica',
    objetivo: 'Calcular la masa que pierde un ánodo metálico cuando circula una cantidad de electrones.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.2', 'el ánodo', 'masas'), idealizado: 'Una sola reacción en el ánodo.', metodo: 'búsqueda por bisección de la masa con la carga equivalente',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_ANODOS_TE.length), n: rengEntreN1(rengRng, 0.01, 1, 0.005) }),
    respuesta: (rengD) => (rengD.n / AN(rengD.a).z) * M(AN(rengD.a).metal),
    errores: (rengD) => [
      ['sin-z', 'Un electrón por átomo', rengD.n * M(AN(rengD.a).metal), 'Supusiste un electrón por átomo; cada átomo cede tantos como su carga iónica.'],
      ['por-z', 'Multiplicar por z', rengD.n * AN(rengD.a).z * M(AN(rengD.a).metal), 'Multiplicaste por los electrones por átomo; hay que dividir.']
    ],
    enunciado: (rengD) => `En una pila, el ánodo es de ${AN(rengD.a).metal} (${AN(rengD.a).metal} → ${AN(rengD.a).ion} + ${AN(rengD.a).z} e⁻). Circulan ${rengTx(rengD.n)} mol de electrones.`,
    pregunta: () => '¿Cuánta masa pierde el ánodo, en g?',
    datos: (rengD) => [['n(e⁻)', `${rengTx(rengD.n)} mol`], ['Electrones por átomo', String(AN(rengD.a).z)], [`M(${AN(rengD.a).metal})`, `${rengTx(M(AN(rengD.a).metal), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`n(metal) = ${rengTx(rengD.n)}/${AN(rengD.a).z} mol.`, `m = ${rengTx(rengR)} g.`],
    pistas: ['¿Cuántos electrones cede cada átomo?', 'Divide los moles de e⁻ entre ese número.', 'Pasa a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s15-p2', subtema: 'n1-b11-s15', titulo: 'Masa que gana el cátodo', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de metal que se deposita en el cátodo para una carga dada.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.2', 'el cátodo', 'masas', 'f'), idealizado: 'Una sola reacción en el cátodo.', metodo: 'escena de electrólisis con la carga equivalente',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_DEPOSITOS_TE.length), q: rengEntreN1(rengRng, 500, 50000, 50) }),
    respuesta: (rengD) => (rengD.q / (DE(rengD.c).z * F)) * M(DE(rengD.c).metal),
    errores: (rengD) => [
      ['sin-z', 'Sin los electrones por átomo', (rengD.q / F) * M(DE(rengD.c).metal), 'Olvidaste dividir entre los electrones que necesita cada ion.'],
      ['sin-f', 'Sin la constante de Faraday', (rengD.q / DE(rengD.c).z) * M(DE(rengD.c).metal) / 1000, 'Pasaste la carga a moles dividiendo entre 1000; hay que dividir entre F.']
    ],
    enunciado: (rengD) => `En el cátodo de una pila se reduce ${DE(rengD.c).ion} a ${DE(rengD.c).metal}. Circula una carga de ${rengTx(rengD.q)} C. F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Qué masa de metal se deposita, en g?',
    datos: (rengD) => [['Q', `${rengTx(rengD.q)} C`], ['Electrones por ion', String(DE(rengD.c).z)], [`M(${DE(rengD.c).metal})`, `${rengTx(M(DE(rengD.c).metal), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`n(e⁻) = Q/F = ${rengTx(rengD.q / F, 4)} mol.`, `m = n(e⁻)/z × M = ${rengTx(rengR)} g.`],
    pistas: ['Pasa la carga a moles de e⁻.', 'Divide entre los electrones por ion.', 'Pasa a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s15-p3', subtema: 'n1-b11-s15', titulo: 'Masas en ánodo y cátodo', dificultad: 'avanzada',
    objetivo: 'Relacionar la masa disuelta en el ánodo con la depositada en el cátodo de la misma pila.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.2', 'ánodo y cátodo', 'masas'), idealizado: 'Una reacción en cada electrodo; misma carga.', metodo: 'misma carga en los dos electrodos con la escena de electrólisis',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_ANODOS_TE.length), c: rengIndice(rengRng, RENG_DEPOSITOS_TE.length), m: rengEntreN1(rengRng, 0.1, 20, 0.05) }),
    valida: (rengD) => AN(rengD.a).E < DE(rengD.c).E - 0.2 && AN(rengD.a).z !== DE(rengD.c).z,
    respuesta: (rengD) => (rengD.m / M(AN(rengD.a).metal)) * AN(rengD.a).z / DE(rengD.c).z * M(DE(rengD.c).metal),
    errores: (rengD) => [
      ['misma-masa', 'La misma masa', rengD.m, 'Supusiste la misma masa en los dos electrodos; lo que es igual es la carga.'],
      ['sin-z', 'Sin los electrones', (rengD.m / M(AN(rengD.a).metal)) * M(DE(rengD.c).metal), 'Igualaste moles de metal; hay que igualar moles de electrones.']
    ],
    enunciado: (rengD) => `En una pila, el ánodo de ${AN(rengD.a).metal} (${AN(rengD.a).z} e⁻ por átomo) pierde ${rengTx(rengD.m)} g y en el cátodo se deposita ${DE(rengD.c).metal} (${DE(rengD.c).z} e⁻ por ion).`,
    pregunta: () => '¿Qué masa se deposita en el cátodo, en g?',
    datos: (rengD) => [['Ánodo', `${AN(rengD.a).metal}, ${rengTx(rengD.m)} g perdidos`], ['Cátodo', DE(rengD.c).metal], [`M(${AN(rengD.a).metal})`, `${rengTx(M(AN(rengD.a).metal), 5)}`], [`M(${DE(rengD.c).metal})`, `${rengTx(M(DE(rengD.c).metal), 5)}`]],
    pasos: (rengD, rengR) => [`n(e⁻) = ${rengTx(rengD.m / M(AN(rengD.a).metal), 4)} × ${AN(rengD.a).z} mol.`, `m(cátodo) = n(e⁻)/${DE(rengD.c).z} × M = ${rengTx(rengR)} g.`],
    pistas: ['Calcula los electrones cedidos en el ánodo.', 'Son los mismos que llegan al cátodo.', 'Pasa a masa del metal del cátodo.']
  })
]

export const RENG_PRACTICAS_B11_S16: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s16-p1', subtema: 'n1-b11-s16', titulo: 'Ecuación de Nernst', dificultad: 'basica',
    objetivo: 'Calcular cuánto se aparta el potencial de una pila de su valor estándar con la ecuación de Nernst.', unidad: 'mV', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.3', 'la ecuación de Nernst', 'r', 'f'), idealizado: 'Concentraciones como actividades; 298,15 K.', metodo: 'forma decimal de la ecuación de Nernst',
    parametros: (rengRng) => ({ e: rengEntreN1(rengRng, 0.3, 2, 0.01), ca: rengEntreN1(rengRng, 0.001, 1, 0.001), cc: rengEntreN1(rengRng, 0.001, 1, 0.001) }),
    valida: (rengD) => Math.abs(Math.log10(rengD.ca / rengD.cc)) > 0.8,
    respuesta: (rengD) => -((R * 298.15) / (2 * F)) * Math.log(rengD.ca / rengD.cc) * 1000,
    errores: (rengD) => [
      ['sin-n', 'Con n = 1', -((R * 298.15) / F) * Math.log(rengD.ca / rengD.cc) * 1000, 'Usaste n = 1; en esta pila se transfieren 2 electrones.'],
      ['q-invertido', 'Q invertido', -((R * 298.15) / (2 * F)) * Math.log(rengD.cc / rengD.ca) * 1000, 'Invertiste Q: es [ion del ánodo]/[ion del cátodo].']
    ],
    enunciado: (rengD) => `Una pila M | M²⁺ ‖ N²⁺ | N tiene E° = ${rengTx(rengD.e)} V y n = 2. [M²⁺] (ánodo) = ${rengTx(rengD.ca)} y [N²⁺] (cátodo) = ${rengTx(rengD.cc)} mol/L a 298,15 K (datos didácticos).`,
    pregunta: () => '¿Cuánto vale E − E°, en mV?',
    datos: (rengD) => [['E°', `${rengTx(rengD.e)} V`], ['[M²⁺]', `${rengTx(rengD.ca)} mol/L`], ['[N²⁺]', `${rengTx(rengD.cc)} mol/L`], ['n', '2']],
    pasos: (rengD, rengR) => [`Q = [M²⁺]/[N²⁺] = ${rengTx(rengD.ca / rengD.cc)}.`, `E − E° = −(RT/2F)·ln Q = ${rengTx(rengR, 4)} mV.`],
    pistas: ['Escribe Q de la reacción de la pila.', 'Aplica Nernst con n = 2.', 'Comprueba el sentido del cambio.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s16-p2', subtema: 'n1-b11-s16', titulo: 'Pila de concentración', dificultad: 'intermedia',
    objetivo: 'Calcular el potencial de una pila de concentración con dos electrodos iguales.', unidad: 'mV', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.3', 'las pilas de concentración', 'r', 'f'), idealizado: 'Concentraciones como actividades; 298,15 K.', metodo: 'forma decimal de Nernst',
    parametros: (rengRng) => ({ n: rengEntreN1(rengRng, 1, 2, 1), cc: rengEntreN1(rengRng, 0.1, 2, 0.01), ex: rengEntreN1(rengRng, 2, 6, 1), m: rengEntreN1(rengRng, 1, 9.9, 0.1) }),
    respuesta: (rengD) => ((R * 298.15) / (rengD.n * F)) * Math.log(rengD.cc / (rengD.m * 10 ** -rengD.ex)) * 1000,
    errores: (rengD) => [
      ['log10', 'Sin el factor ln 10', ((R * 298.15) / (rengD.n * F)) * Math.log10(rengD.cc / (rengD.m * 10 ** -rengD.ex)) * 1000, 'Usaste log₁₀ con RT/nF; o usas ln, o multiplicas por ln 10 (0,0592/n).'],
      ['sin-n', 'Sin dividir entre n', ((R * 298.15) / F) * Math.log(rengD.cc / (rengD.m * 10 ** -rengD.ex)) * 1000, 'Olvidaste dividir entre n, los electrones por ion.']
    ],
    valida: (rengD) => rengD.n === 2,
    enunciado: (rengD) => `Una pila tiene dos electrodos del mismo metal (iones de carga ${rengD.n}+) en disoluciones ${rengTx(rengD.cc)} mol/L y ${rengTx(rengD.m, 2)}·10⁻${rengD.ex} mol/L, a 298,15 K.`,
    pregunta: () => '¿Cuál es su potencial, en mV?',
    datos: (rengD) => [['Concentrada', `${rengTx(rengD.cc)} mol/L`], ['Diluida', `${rengTx(rengD.m, 2)}·10⁻${rengD.ex} mol/L`], ['n', String(rengD.n)]],
    pasos: (rengD, rengR) => ['E° = 0: los electrodos son iguales.', `E = (RT/nF)·ln(c_conc/c_dil) = ${rengTx(rengR, 4)} mV.`],
    pistas: ['¿Cuánto vale E° con electrodos iguales?', 'El cociente es concentrada entre diluida.', 'Usa RT/nF con logaritmo natural.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s16-p3', subtema: 'n1-b11-s16', titulo: 'Concentración para un potencial dado', dificultad: 'avanzada',
    objetivo: 'Calcular la concentración de ion en el cátodo que da un potencial de pila dado.', unidad: 'mmol/L', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.3', 'la ecuación de Nernst', 'r', 'f'), idealizado: 'Concentraciones como actividades; 298,15 K.', metodo: 'búsqueda por bisección de la concentración con Nernst',
    parametros: (rengRng) => ({ e0: rengEntreN1(rengRng, 0.5, 1.5, 0.01), ca: rengEntreN1(rengRng, 0.01, 1, 0.01), d: rengEntreN1(rengRng, 0.02, 0.1, 0.001) }),
    respuesta: (rengD) => rengD.ca * Math.exp((-rengD.d * 2 * F) / (R * 298.15)) * 1000,
    errores: (rengD) => [
      ['signo', 'Exponente con signo cambiado', rengD.ca * Math.exp((rengD.d * 2 * F) / (R * 298.15)) * 1000, 'Cambiaste el signo del exponente: un potencial menor que E° exige menos ion en el cátodo.'],
      ['n1', 'Con n = 1', rengD.ca * Math.exp((-rengD.d * F) / (R * 298.15)) * 1000, 'Usaste n = 1; aquí se transfieren 2 electrones.']
    ],
    enunciado: (rengD) => `Una pila M | M²⁺ ‖ N²⁺ | N tiene E° = ${rengTx(rengD.e0)} V (n = 2) y [M²⁺] = ${rengTx(rengD.ca)} mol/L. Se mide E = ${rengTx(rengD.e0 - rengD.d, 4)} V a 298,15 K (datos didácticos).`,
    pregunta: () => '¿Qué [N²⁺] hay en el cátodo, en mmol/L?',
    datos: (rengD) => [['E°', `${rengTx(rengD.e0)} V`], ['E medido', `${rengTx(rengD.e0 - rengD.d, 4)} V`], ['[M²⁺]', `${rengTx(rengD.ca)} mol/L`]],
    pasos: (rengD, rengR) => [`ln Q = (E° − E)·2F/(RT) = ${rengTx((rengD.d * 2 * F) / (R * 298.15), 4)}.`, `[N²⁺] = [M²⁺]/Q = ${rengTx(rengR)} mmol/L.`],
    pistas: ['Despeja ln Q de Nernst.', 'Q = [M²⁺]/[N²⁺].', 'Pasa a mmol/L.']
  })
]

export const RENG_PRACTICAS_B11_S17: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s17-p1', subtema: 'n1-b11-s17', titulo: 'Masa depositada en una electrólisis', dificultad: 'basica',
    objetivo: 'Calcular la masa de metal depositada con una corriente constante durante un tiempo.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.7', 'la electrólisis', 'masas', 'f'), idealizado: 'Corriente constante; eficiencia del 100 %.', metodo: 'escena de electrólisis con los mismos datos',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_DEPOSITOS_TE.length), i: rengEntreN1(rengRng, 0.1, 10, 0.05), t: rengEntreN1(rengRng, 5, 300, 1) }),
    respuesta: (rengD) => ((rengD.i * rengD.t * 60) / (DE(rengD.c).z * F)) * M(DE(rengD.c).metal),
    errores: (rengD) => [
      ['minutos', 'Tiempo en minutos', ((rengD.i * rengD.t) / (DE(rengD.c).z * F)) * M(DE(rengD.c).metal), 'Usaste el tiempo en minutos; Q = I·t necesita segundos.'],
      ['por-z', 'Multiplicar por z', ((rengD.i * rengD.t * 60 * DE(rengD.c).z) / F) * M(DE(rengD.c).metal), 'Multiplicaste por los electrones por ion; hay que dividir.']
    ],
    valida: (rengD) => DE(rengD.c).z !== 1,
    enunciado: (rengD) => `Se electroliza una disolución de ${DE(rengD.c).ion} con ${rengTx(rengD.i)} A durante ${rengTx(rengD.t)} min. F = ${rengTx(F, 6)} C/mol.`,
    pregunta: (rengD) => `¿Qué masa de ${DE(rengD.c).metal} se deposita, en g?`,
    datos: (rengD) => [['I', `${rengTx(rengD.i)} A`], ['t', `${rengTx(rengD.t)} min`], ['Electrones por ion', String(DE(rengD.c).z)], [`M(${DE(rengD.c).metal})`, `${rengTx(M(DE(rengD.c).metal), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Q = I·t = ${rengTx(rengD.i * rengD.t * 60)} C.`, `m = Q·M/(z·F) = ${rengTx(rengR)} g.`],
    pistas: ['Pasa el tiempo a segundos.', 'Usa Q = I·t con t en segundos.', 'm = Q·M/(z·F).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s17-p2', subtema: 'n1-b11-s17', titulo: 'Tiempo para depositar una masa', dificultad: 'intermedia',
    objetivo: 'Calcular el tiempo necesario para depositar una masa de metal con una corriente dada.', unidad: 'min', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.7', 'la electrólisis', 'masas', 'f'), idealizado: 'Corriente constante; eficiencia del 100 %.', metodo: 'búsqueda por bisección del tiempo en la escena de electrólisis',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_DEPOSITOS_TE.length), m: rengEntreN1(rengRng, 0.5, 30, 0.1), i: rengEntreN1(rengRng, 0.5, 10, 0.05) }),
    respuesta: (rengD) => ((rengD.m / M(DE(rengD.c).metal)) * DE(rengD.c).z * F) / rengD.i / 60,
    errores: (rengD) => [
      ['segundos', 'En segundos', ((rengD.m / M(DE(rengD.c).metal)) * DE(rengD.c).z * F) / rengD.i, 'Ese valor está en segundos; la pregunta pide minutos.'],
      ['sin-z', 'Sin los electrones', ((rengD.m / M(DE(rengD.c).metal)) * F) / rengD.i / 60, 'Olvidaste multiplicar por los electrones que necesita cada ion.']
    ],
    valida: (rengD) => DE(rengD.c).z !== 1,
    enunciado: (rengD) => `Se quieren depositar ${rengTx(rengD.m)} g de ${DE(rengD.c).metal} (desde ${DE(rengD.c).ion}) con una corriente de ${rengTx(rengD.i)} A. F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Cuánto tiempo hace falta, en min?',
    datos: (rengD) => [['Masa', `${rengTx(rengD.m)} g`], ['I', `${rengTx(rengD.i)} A`], ['Electrones por ion', String(DE(rengD.c).z)]],
    pasos: (rengD, rengR) => [`Q = n(metal)·z·F = ${rengTx((rengD.m / M(DE(rengD.c).metal)) * DE(rengD.c).z * F)} C.`, `t = Q/I = ${rengTx(rengR)} min.`],
    pistas: ['Pasa la masa a moles.', 'La carga es Q = n·z·F.', 't = Q/I, en minutos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s17-p3', subtema: 'n1-b11-s17', titulo: 'Corriente para un depósito', dificultad: 'avanzada',
    objetivo: 'Calcular la corriente necesaria para depositar una masa de metal en un tiempo dado.', unidad: 'A', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.7', 'la electrólisis', 'masas', 'f'), idealizado: 'Corriente constante; eficiencia del 100 %.', metodo: 'búsqueda por bisección de la corriente en la escena de electrólisis',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_DEPOSITOS_TE.length), m: rengEntreN1(rengRng, 0.5, 30, 0.1), t: rengEntreN1(rengRng, 10, 300, 1) }),
    valida: (rengD) => DE(rengD.c).z !== 1 && ((rengD.m / M(DE(rengD.c).metal)) * DE(rengD.c).z * F) / (rengD.t * 60) > 0.3,
    respuesta: (rengD) => ((rengD.m / M(DE(rengD.c).metal)) * DE(rengD.c).z * F) / (rengD.t * 60),
    errores: (rengD) => [
      ['minutos', 'Tiempo en minutos', ((rengD.m / M(DE(rengD.c).metal)) * DE(rengD.c).z * F) / rengD.t, 'Dividiste entre minutos; la corriente en amperios necesita el tiempo en segundos.'],
      ['sin-z', 'Sin los electrones', ((rengD.m / M(DE(rengD.c).metal)) * F) / (rengD.t * 60), 'Olvidaste multiplicar por los electrones que necesita cada ion.']
    ],
    enunciado: (rengD) => `Se quieren depositar ${rengTx(rengD.m)} g de ${DE(rengD.c).metal} (desde ${DE(rengD.c).ion}) en ${rengTx(rengD.t)} min. F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Qué corriente hace falta, en A?',
    datos: (rengD) => [['Masa', `${rengTx(rengD.m)} g`], ['t', `${rengTx(rengD.t)} min`], ['Electrones por ion', String(DE(rengD.c).z)]],
    pasos: (rengD, rengR) => ['La carga es Q = n·z·F.', `I = Q/t = ${rengTx(rengR)} A.`],
    pistas: ['Calcula la carga necesaria.', 'Pasa el tiempo a segundos.', 'Despeja I = Q/t.']
  })
]

export const RENG_PRACTICAS_B11_S18: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s18-p1', subtema: 'n1-b11-s18', titulo: 'Carga para depositar una masa', dificultad: 'basica',
    objetivo: 'Calcular la carga necesaria para depositar una masa de metal con la ley de Faraday.', unidad: 'C', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.7', 'las leyes de Faraday', 'masas', 'f'), idealizado: 'Eficiencia del 100 %.', metodo: 'búsqueda por bisección del tiempo a 1 A en la escena',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_PARES_TE.length), m: rengEntreN1(rengRng, 0.1, 20, 0.05) }),
    valida: (rengD) => RENG_PARES_TE[rengD.c]!.z !== 1,
    respuesta: (rengD) => (rengD.m / M(RENG_PARES_TE[rengD.c]!.metal)) * RENG_PARES_TE[rengD.c]!.z * F,
    errores: (rengD) => [
      ['sin-z', 'Sin los electrones', (rengD.m / M(RENG_PARES_TE[rengD.c]!.metal)) * F, 'Olvidaste multiplicar por los electrones por ion.'],
      ['gramos', 'Gramos como moles', rengD.m * RENG_PARES_TE[rengD.c]!.z * F, 'Usaste los gramos como si fueran moles; divide antes entre la masa molar.']
    ],
    enunciado: (rengD) => `Se quieren obtener ${rengTx(rengD.m)} g de ${RENG_PARES_TE[rengD.c]!.metal} a partir de ${RENG_PARES_TE[rengD.c]!.ion}. F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Qué carga hace falta, en C?',
    datos: (rengD) => [['Masa', `${rengTx(rengD.m)} g`], ['Electrones por ion', String(RENG_PARES_TE[rengD.c]!.z)], [`M(${RENG_PARES_TE[rengD.c]!.metal})`, `${rengTx(M(RENG_PARES_TE[rengD.c]!.metal), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`n(e⁻) = ${rengTx((rengD.m / M(RENG_PARES_TE[rengD.c]!.metal)) * RENG_PARES_TE[rengD.c]!.z, 4)} mol.`, `Q = n(e⁻)·F = ${rengTx(rengR)} C.`],
    pistas: ['Pasa la masa a moles.', 'Multiplica por los electrones por ion.', 'Q = n(e⁻)·F.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s18-p2', subtema: 'n1-b11-s18', titulo: 'Celdas en serie', dificultad: 'intermedia',
    objetivo: 'Calcular la masa depositada en una celda a partir de la depositada en otra conectada en serie.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.7', 'las leyes de Faraday', 'masas'), idealizado: 'Misma carga en las dos celdas.', metodo: 'misma carga con la escena de electrólisis',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_DEPOSITOS_TE.length), b: rengIndice(rengRng, RENG_DEPOSITOS_TE.length), m: rengEntreN1(rengRng, 0.1, 20, 0.05) }),
    valida: (rengD) => DE(rengD.a).z !== DE(rengD.b).z,
    respuesta: (rengD) => (rengD.m / M(DE(rengD.a).metal)) * DE(rengD.a).z / DE(rengD.b).z * M(DE(rengD.b).metal),
    errores: (rengD) => [
      ['igual', 'La misma masa', rengD.m, 'En serie pasa la misma carga, no se deposita la misma masa.'],
      ['sin-z', 'Sin los electrones', (rengD.m / M(DE(rengD.a).metal)) * M(DE(rengD.b).metal), 'Igualaste moles de metal; lo que es igual son los moles de electrones.']
    ],
    enunciado: (rengD) => `Dos celdas en serie depositan ${DE(rengD.a).metal} (desde ${DE(rengD.a).ion}) y ${DE(rengD.b).metal} (desde ${DE(rengD.b).ion}). En la primera se depositan ${rengTx(rengD.m)} g.`,
    pregunta: (rengD) => `¿Qué masa de ${DE(rengD.b).metal} se deposita en la segunda, en g?`,
    datos: (rengD) => [[`${DE(rengD.a).metal} depositado`, `${rengTx(rengD.m)} g`], ['Electrones por ion', `${DE(rengD.a).z} y ${DE(rengD.b).z}`]],
    pasos: (rengD, rengR) => [`n(e⁻) = ${rengTx((rengD.m / M(DE(rengD.a).metal)) * DE(rengD.a).z, 4)} mol en las dos celdas.`, `m = ${rengTx(rengR)} g.`],
    pistas: ['La carga es la misma en serie.', 'Calcula los moles de e⁻ con la primera celda.', 'Pásalos a masa de la segunda.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s18-p3', subtema: 'n1-b11-s18', titulo: 'Eficiencia de corriente', dificultad: 'avanzada',
    objetivo: 'Calcular la eficiencia de una electrólisis comparando la masa real con la teórica de Faraday.', unidad: '%', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.7', 'las leyes de Faraday', 'masas', 'f'), idealizado: 'La carga perdida va a reacciones secundarias.', metodo: 'escena de electrólisis con eficiencia del 100 % como referencia',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_DEPOSITOS_TE.length), i: rengEntreN1(rengRng, 0.5, 10, 0.05), t: rengEntreN1(rengRng, 10, 300, 1), ef: rengEntreN1(rengRng, 55, 98, 0.5) }),
    valida: (rengD) => DE(rengD.c).z !== 1,
    respuesta: (rengD) => { const rengTeo = ((rengD.i * rengD.t * 60) / (DE(rengD.c).z * F)) * M(DE(rengD.c).metal); return (Number((rengTeo * rengD.ef / 100).toPrecision(4)) / rengTeo) * 100 },
    errores: (rengD) => {
      const rengTeo = ((rengD.i * rengD.t * 60) / (DE(rengD.c).z * F)) * M(DE(rengD.c).metal)
      const rengReal = Number((rengTeo * rengD.ef / 100).toPrecision(4))
      return [
        ['invertida', 'Cociente invertido', (rengTeo / rengReal) * 100, 'Invertiste el cociente: eficiencia = masa real / masa teórica.'],
        ['sin-z', 'Teórica sin los electrones', (rengReal / (rengTeo * DE(rengD.c).z)) * 100, 'Calculaste la masa teórica sin dividir entre los electrones por ion.']
      ]
    },
    enunciado: (rengD) => { const rengTeo = ((rengD.i * rengD.t * 60) / (DE(rengD.c).z * F)) * M(DE(rengD.c).metal); return `Con ${rengTx(rengD.i)} A durante ${rengTx(rengD.t)} min sobre ${DE(rengD.c).ion} se depositan ${rengTx(Number((rengTeo * rengD.ef / 100).toPrecision(4)), 4)} g de ${DE(rengD.c).metal}. F = ${rengTx(F, 6)} C/mol.` },
    pregunta: () => '¿Cuál es la eficiencia de la corriente, en %?',
    datos: (rengD) => [['I', `${rengTx(rengD.i)} A`], ['t', `${rengTx(rengD.t)} min`], ['Electrones por ion', String(DE(rengD.c).z)], [`M(${DE(rengD.c).metal})`, `${rengTx(M(DE(rengD.c).metal), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Masa teórica = I·t·M/(z·F) = ${rengTx(((rengD.i * rengD.t * 60) / (DE(rengD.c).z * F)) * M(DE(rengD.c).metal), 4)} g.`, `Eficiencia = real/teórica × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Calcula la masa teórica con Faraday.', 'Compárala con la real.', 'Multiplica por 100.']
  })
]

export const RENG_PRACTICAS_B11_S19: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s19-p1', subtema: 'n1-b11-s19', titulo: 'Hierro perdido por corrosión', dificultad: 'basica',
    objetivo: 'Calcular la masa de hierro que se oxida con una corriente de corrosión durante un tiempo.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.6', 'la corrosión', 'masas', 'f'), idealizado: 'Corriente de corrosión media constante; datos didácticos.', metodo: 'escena de electrólisis con mA pasados a A',
    parametros: (rengRng) => ({ i: rengEntreN1(rengRng, 0.05, 5, 0.05), d: rengEntreN1(rengRng, 10, 730, 5) }),
    respuesta: (rengD) => ((rengD.i / 1000) * rengD.d * 86400) / (FE.z * F) * M('Fe'),
    errores: (rengD) => [
      ['sin-z', 'Un electrón por átomo', ((rengD.i / 1000) * rengD.d * 86400) / F * M('Fe'), 'El hierro cede 2 electrones por átomo: divide entre 2.'],
      ['ma', 'mA como A', (rengD.i * rengD.d * 86400) / (FE.z * F) * M('Fe'), 'Usaste los miliamperios como si fueran amperios.']
    ],
    enunciado: (rengD) => `Una pieza de hierro se corroe (Fe → Fe²⁺ + 2 e⁻) con una corriente media de ${rengTx(rengD.i)} mA durante ${rengTx(rengD.d)} días (datos didácticos). F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Qué masa de hierro se pierde, en g?',
    datos: (rengD) => [['I', `${rengTx(rengD.i)} mA`], ['t', `${rengTx(rengD.d)} días`], ['M(Fe)', `${rengTx(M('Fe'), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Q = ${rengTx((rengD.i / 1000) * rengD.d * 86400)} C.`, `m = Q·M/(2F) = ${rengTx(rengR)} g.`],
    pistas: ['Pasa mA a A y días a segundos.', 'Usa Q = I·t con t en segundos.', 'Dos electrones por átomo de Fe.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s19-p2', subtema: 'n1-b11-s19', titulo: 'Ánodo de sacrificio consumido', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de un ánodo de sacrificio que se consume para proteger una estructura.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.6', 'la protección catódica', 'masas', 'f'), idealizado: 'Corriente de protección media constante; datos didácticos.', metodo: 'escena de electrólisis con mA pasados a A',
    parametros: (rengRng) => ({ s: rengIndice(rengRng, RENG_SACRIFICIO_TE.length), i: rengEntreN1(rengRng, 0.5, 50, 0.5), d: rengEntreN1(rengRng, 30, 730, 5) }),
    respuesta: (rengD) => ((rengD.i / 1000) * rengD.d * 86400) / (SA(rengD.s).z * F) * M(SA(rengD.s).metal),
    errores: (rengD) => [
      ['hierro', 'Con los datos del hierro', ((rengD.i / 1000) * rengD.d * 86400) / (FE.z * F) * M('Fe'), 'Calculaste la masa de hierro; lo que se consume es el ánodo de sacrificio.'],
      ['sin-z', 'Sin los electrones', ((rengD.i / 1000) * rengD.d * 86400) / F * M(SA(rengD.s).metal), 'Olvidaste dividir entre los electrones que cede cada átomo.']
    ],
    valida: (rengD) => Math.abs(M(SA(rengD.s).metal) / SA(rengD.s).z - M('Fe') / 2) / (M('Fe') / 2) > 0.05,
    enunciado: (rengD) => `Un bloque de ${SA(rengD.s).metal} (${SA(rengD.s).metal} → ${SA(rengD.s).ion} + ${SA(rengD.s).z} e⁻) protege una tubería de acero con una corriente media de ${rengTx(rengD.i)} mA durante ${rengTx(rengD.d)} días (datos didácticos). F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Qué masa del ánodo de sacrificio se consume, en g?',
    datos: (rengD) => [['I', `${rengTx(rengD.i)} mA`], ['t', `${rengTx(rengD.d)} días`], [`M(${SA(rengD.s).metal})`, `${rengTx(M(SA(rengD.s).metal), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Q = ${rengTx((rengD.i / 1000) * rengD.d * 86400)} C.`, `m = Q·M/(z·F) = ${rengTx(rengR)} g.`],
    pistas: ['¿Qué metal se oxida?', 'Calcula la carga en ese tiempo.', 'Aplica Faraday con su z.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s19-p3', subtema: 'n1-b11-s19', titulo: 'Corriente de corrosión a partir de la masa perdida', dificultad: 'avanzada',
    objetivo: 'Calcular la corriente media de corrosión a partir de la masa de metal perdida en un tiempo.', unidad: 'mA', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.6', 'la corrosión', 'masas', 'f'), idealizado: 'Corriente media constante; datos didácticos.', metodo: 'búsqueda por bisección de la corriente en la escena de electrólisis',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.5, 50, 0.1), d: rengEntreN1(rengRng, 30, 730, 5) }),
    respuesta: (rengD) => (((rengD.m / M('Fe')) * FE.z * F) / (rengD.d * 86400)) * 1000,
    errores: (rengD) => [
      ['sin-z', 'Sin los electrones', (((rengD.m / M('Fe')) * F) / (rengD.d * 86400)) * 1000, 'Olvidaste que cada átomo de Fe cede 2 electrones.'],
      ['amperios', 'En amperios', ((rengD.m / M('Fe')) * FE.z * F) / (rengD.d * 86400), 'Ese valor está en amperios; la pregunta pide mA.']
    ],
    valida: (rengD) => (((rengD.m / M('Fe')) * FE.z * F) / (rengD.d * 86400)) * 1000 > 0.2,
    enunciado: (rengD) => `Una pieza de hierro pierde ${rengTx(rengD.m)} g por corrosión (Fe → Fe²⁺ + 2 e⁻) en ${rengTx(rengD.d)} días (datos didácticos). F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Cuál es la corriente media de corrosión, en mA?',
    datos: (rengD) => [['Masa perdida', `${rengTx(rengD.m)} g`], ['t', `${rengTx(rengD.d)} días`], ['M(Fe)', `${rengTx(M('Fe'), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Q = (m/M)·2·F = ${rengTx((rengD.m / M('Fe')) * FE.z * F)} C.`, `I = Q/t = ${rengTx(rengR)} mA.`],
    pistas: ['Calcula la carga con Faraday.', 'Pasa los días a segundos.', 'I = Q/t, en mA.']
  })
]

export const RENG_PRACTICAS_B11_S20: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s20-p1', subtema: 'n1-b11-s20', titulo: 'Energía de una batería', dificultad: 'basica',
    objetivo: 'Calcular la energía de una batería a partir de su voltaje y su capacidad en A·h.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.5', 'las baterías'), idealizado: 'Voltaje constante durante la descarga.', metodo: 'horas a segundos y julios a kJ con el catálogo',
    parametros: (rengRng) => ({ v: rengEntreN1(rengRng, 1.2, 12, 0.1), ah: rengEntreN1(rengRng, 0.5, 100, 0.5) }),
    respuesta: (rengD) => (rengD.v * rengD.ah * 3600) / 1000,
    errores: (rengD) => [
      ['sin-3600', 'Sin pasar a culombios', (rengD.v * rengD.ah) / 1000, 'Olvidaste pasar los A·h a culombios (× 3600).'],
      ['wh', 'En W·h', rengD.v * rengD.ah, 'Ese valor son W·h; la pregunta pide kJ.']
    ],
    enunciado: (rengD) => `Una batería de ${rengTx(rengD.v)} V tiene una capacidad de ${rengTx(rengD.ah)} A·h (datos didácticos).`,
    pregunta: () => '¿Cuánta energía puede entregar, en kJ?',
    datos: (rengD) => [['Voltaje', `${rengTx(rengD.v)} V`], ['Capacidad', `${rengTx(rengD.ah)} A·h`]],
    pasos: (rengD, rengR) => [`Q = ${rengTx(rengD.ah * 3600)} C.`, `E = V·Q = ${rengTx(rengR)} kJ.`],
    pistas: ['1 A·h = 3600 C.', 'Energía = voltaje × carga.', 'Pasa J a kJ.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s20-p2', subtema: 'n1-b11-s20', titulo: 'Metal consumido en una pila', dificultad: 'intermedia',
    objetivo: 'Calcular la masa del metal del ánodo que consume una pila al entregar su capacidad.', unidad: 'g', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.5', 'las baterías', 'masas', 'f'), idealizado: 'Toda la carga sale de la oxidación del ánodo.', metodo: 'escena de Faraday con la corriente y el tiempo equivalentes',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_SACRIFICIO_TE.length + 1), ah: rengEntreN1(rengRng, 0.5, 20, 0.1) }),
    respuesta: (rengD) => { const rengP = rengD.a === RENG_SACRIFICIO_TE.length ? RENG_PARES_TE[0]! : SA(rengD.a); return ((rengD.ah * 3600) / (rengP.z * F)) * M(rengP.metal) },
    errores: (rengD) => {
      const rengP = rengD.a === RENG_SACRIFICIO_TE.length ? RENG_PARES_TE[0]! : SA(rengD.a)
      return [
        ['sin-3600', 'Sin pasar a culombios', (rengD.ah / (rengP.z * F)) * M(rengP.metal), 'Olvidaste pasar los A·h a culombios (× 3600).'],
        ['por-z', 'Multiplicar por z', ((rengD.ah * 3600 * rengP.z) / F) * M(rengP.metal), 'Multiplicaste por los electrones por átomo; hay que dividir.']
      ]
    },
    valida: (rengD) => (rengD.a === RENG_SACRIFICIO_TE.length ? RENG_PARES_TE[0]! : SA(rengD.a)).z !== 1,
    enunciado: (rengD) => { const rengP = rengD.a === RENG_SACRIFICIO_TE.length ? RENG_PARES_TE[0]! : SA(rengD.a); return `Una pila con ánodo de ${rengP.metal} (${rengP.metal} → ${rengP.ion} + ${rengP.z} e⁻) entrega ${rengTx(rengD.ah)} A·h. F = ${rengTx(F, 6)} C/mol.` },
    pregunta: () => '¿Qué masa del metal del ánodo se consume, en g?',
    datos: (rengD) => { const rengP = rengD.a === RENG_SACRIFICIO_TE.length ? RENG_PARES_TE[0]! : SA(rengD.a); return [['Capacidad', `${rengTx(rengD.ah)} A·h`], ['Electrones por átomo', String(rengP.z)], [`M(${rengP.metal})`, `${rengTx(M(rengP.metal), 5)} g/mol`]] },
    pasos: (rengD, rengR) => [`Q = ${rengTx(rengD.ah * 3600)} C.`, `m = Q·M/(z·F) = ${rengTx(rengR)} g.`],
    pistas: ['Pasa A·h a culombios.', 'Moles de e⁻ = Q/F.', 'Divide entre z y pasa a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s20-p3', subtema: 'n1-b11-s20', titulo: 'Duración de una pila', dificultad: 'avanzada',
    objetivo: 'Calcular cuántas horas dura una pila a una corriente dada a partir de la masa de metal de su ánodo.', unidad: 'h', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.5', 'las baterías', 'masas', 'f'), idealizado: 'Todo el metal del ánodo se aprovecha; corriente constante.', metodo: 'búsqueda por bisección del tiempo en la escena de electrólisis',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 1, 30, 0.1), i: rengEntreN1(rengRng, 0.05, 2, 0.01) }),
    respuesta: (rengD) => ((rengD.m / M('Zn')) * 2 * F) / rengD.i / 3600,
    errores: (rengD) => [
      ['segundos', 'En segundos', ((rengD.m / M('Zn')) * 2 * F) / rengD.i, 'Ese valor está en segundos; la pregunta pide horas.'],
      ['sin-z', 'Sin los electrones', ((rengD.m / M('Zn')) * F) / rengD.i / 3600, 'Cada átomo de Zn cede 2 electrones: multiplica por 2.']
    ],
    enunciado: (rengD) => `El ánodo de una pila tiene ${rengTx(rengD.m)} g de cinc (Zn → Zn²⁺ + 2 e⁻) y la pila entrega ${rengTx(rengD.i)} A (datos didácticos). F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Cuántas horas puede funcionar como máximo?',
    datos: (rengD) => [['Zn', `${rengTx(rengD.m)} g`], ['I', `${rengTx(rengD.i)} A`], ['M(Zn)', `${rengTx(M('Zn'), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Q = (m/M)·2·F = ${rengTx((rengD.m / M('Zn')) * 2 * F)} C.`, `t = Q/I = ${rengTx(rengR)} h.`],
    pistas: ['Calcula la carga que da todo el cinc.', 'Divide entre la corriente.', 'Pasa los segundos a horas.']
  })
]
