import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_C_AGUA_FU, RENG_DIDACTICO_FU, RENG_LF_FU, RENG_METALES_FU, RENG_NA_FU, RENG_R_FU, RENG_TOL_FU, rengFuentesFu } from './b01-comun'
import { rengMNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(1)
const tx = rengTx
const M = rengMNo

export const RENG_INTEGRADORES_B01: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b1-i1', subtema: RENG_GRUPO, subtemas: ['n1-b1-s5', 'n1-b1-s21'],
    titulo: 'Identificar un metal por un cubo', dificultad: 'basica',
    objetivo: 'Combinar el volumen de un cubo (propiedad general) con su masa para obtener la densidad e identificar el metal.', unidad: 'g/mL', tolerancia: RENG_TOL_FU,
    fuentes: rengFuentesFu('1.4', 'la densidad como propiedad específica'), idealizado: 'Cubo macizo de metal puro.', metodo: 'escena «densidad»', sinVerificar: [RENG_DIDACTICO_FU],
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_METALES_FU.length), a: rengEntreN1(rengRng, 1.5, 6, 0.05) }),
    respuesta: (rengD) => RENG_METALES_FU[rengD.i]!.rho,
    errores: (rengD) => { const m = RENG_METALES_FU[rengD.i]!; const rengM = m.rho * rengD.a ** 3; return [
      ['cuadrado', 'Con el área', rengM / rengD.a ** 2, 'Dividiste entre el área de una cara; el volumen del cubo es a³.'],
      ['arista', 'Con la arista', rengM / rengD.a, 'Dividiste entre la arista; hay que dividir entre el volumen.']
    ] },
    enunciado: (rengD) => { const m = RENG_METALES_FU[rengD.i]!; return `Un cubo metálico de ${tx(rengD.a)} cm de arista tiene una masa de ${tx(m.rho * rengD.a ** 3, 5)} g.` },
    pregunta: () => '¿Cuál es su densidad, en g/mL?',
    datos: (rengD) => [['Arista', `${tx(rengD.a)} cm`], ['Masa', `${tx(RENG_METALES_FU[rengD.i]!.rho * rengD.a ** 3, 5)} g`]],
    pasos: (rengD, rengR) => [`V = a³ = ${tx(rengD.a ** 3)} mL (subtema 5).`, `ρ = m/V = ${tx(rengR, 4)} g/mL: es ${RENG_METALES_FU[rengD.i]!.n} (subtema 21).`],
    pistas: ['Calcula el volumen del cubo.', 'Divide masa entre volumen.', 'Compara con una tabla.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b1-i2', subtema: RENG_GRUPO, subtemas: ['n1-b1-s16', 'n1-b1-s20'],
    titulo: 'Tiempo de un trayecto en segundos', dificultad: 'basica',
    objetivo: 'Encadenar factores de conversión para obtener un tiempo en segundos a partir de una distancia y una velocidad.', unidad: 's', tolerancia: RENG_TOL_FU,
    fuentes: rengFuentesFu('1.6', 'el análisis dimensional'), idealizado: 'Velocidad constante.', metodo: 'catálogo de unidades de la app', sinVerificar: [RENG_DIDACTICO_FU],
    parametros: (rengRng) => ({ d: rengEntreN1(rengRng, 0.5, 50, 0.5), v: rengEntreN1(rengRng, 10, 120, 1) }),
    respuesta: (rengD) => (rengD.d / rengD.v) * 3600,
    errores: (rengD) => [
      ['horas', 'En horas', rengD.d / rengD.v, 'Ese resultado está en horas; multiplica por 3600 s/h.'],
      ['minutos', 'En minutos', (rengD.d / rengD.v) * 60, 'Ese resultado está en minutos; la pregunta pide segundos.']
    ],
    enunciado: (rengD) => `Un ciclista recorre ${tx(rengD.d)} km a ${tx(rengD.v)} km/h constantes.`,
    pregunta: () => '¿Cuánto tarda, en segundos?',
    datos: (rengD) => [['Distancia', `${tx(rengD.d)} km`], ['Velocidad', `${tx(rengD.v)} km/h`]],
    pasos: (rengD, rengR) => [`t = d/v = ${tx(rengD.d / rengD.v)} h (subtema 16).`, `× 3600 s/h = ${tx(rengR)} s (subtema 20).`],
    pistas: ['Divide distancia entre velocidad.', 'Obtienes horas.', 'Pasa a segundos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b1-i3', subtema: RENG_GRUPO, subtemas: ['n1-b1-s10', 'n1-b1-s12'],
    titulo: 'Disolver una muestra impura', dificultad: 'intermedia',
    objetivo: 'Combinar la pureza de una muestra con la composición en masa de la mezcla que forma al disolverla.', unidad: '%', tolerancia: RENG_TOL_FU,
    fuentes: rengFuentesFu('1.2', 'las sustancias puras y las mezclas'), idealizado: 'Impurezas insolubles retiradas por filtración.', metodo: '100 % menos el porcentaje de agua', sinVerificar: [RENG_DIDACTICO_FU],
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 5, 100, 0.5), p: rengEntreN1(rengRng, 70, 99, 0.5), w: rengEntreN1(rengRng, 50, 500, 5) }),
    respuesta: (rengD) => (100 * ((rengD.m * rengD.p) / 100)) / ((rengD.m * rengD.p) / 100 + rengD.w),
    errores: (rengD) => [
      ['sin-pureza', 'Sin la pureza', (100 * rengD.m) / (rengD.m + rengD.w), 'Usaste la masa total de la muestra; las impurezas se quedan en el filtro.'],
      ['sobre-agua', 'Dividido entre el agua', (100 * ((rengD.m * rengD.p) / 100)) / rengD.w, 'El porcentaje se calcula sobre la masa total de la disolución.']
    ],
    enunciado: (rengD) => `Se disuelven ${tx(rengD.m)} g de una sal del ${tx(rengD.p)} % de pureza en ${tx(rengD.w)} g de agua y se filtran las impurezas insolubles.`,
    pregunta: () => '¿Qué porcentaje en masa de sal tiene la disolución?',
    datos: (rengD) => [['Muestra', `${tx(rengD.m)} g al ${tx(rengD.p)} %`], ['Agua', `${tx(rengD.w)} g`]],
    pasos: (rengD, rengR) => [`Sal pura = ${tx((rengD.m * rengD.p) / 100)} g (subtema 10).`, `% = ${tx(rengR)} % (subtema 12).`],
    pistas: ['Calcula la sal pura.', 'Suma el agua.', 'Divide y multiplica por 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b1-i4', subtema: RENG_GRUPO, subtemas: ['n1-b1-s8', 'n1-b1-s22'],
    titulo: 'Moles de gas en un recipiente', dificultad: 'intermedia',
    objetivo: 'Calcular la cantidad de gas en un recipiente a partir de su presión, volumen y temperatura en °C.', unidad: 'mol', tolerancia: RENG_TOL_FU,
    fuentes: rengFuentesFu('1.2', 'el estado gaseoso'), idealizado: 'Gas ideal.', metodo: 'escena «gas-ideal»', sinVerificar: [RENG_DIDACTICO_FU],
    parametros: (rengRng) => ({ P: rengEntreN1(rengRng, 50, 500, 5), V: rengEntreN1(rengRng, 1, 50, 0.5), t: rengEntreN1(rengRng, 10, 150, 1) }),
    respuesta: (rengD) => (rengD.P * rengD.V) / (RENG_R_FU * (rengD.t + 273.15)),
    errores: (rengD) => [
      ['celsius', 'Con °C', (rengD.P * rengD.V) / (RENG_R_FU * rengD.t), 'En PV = nRT la temperatura va en kelvin.'],
      ['pa', 'Presión en Pa', (rengD.P * 1000 * rengD.V) / (RENG_R_FU * (rengD.t + 273.15)), 'Con R = 8,314 y el volumen en L, la presión va en kPa; si la pasas a Pa, el volumen debe ir en m³.']
    ],
    enunciado: (rengD) => `Un recipiente de ${tx(rengD.V)} L contiene un gas a ${tx(rengD.P)} kPa y ${tx(rengD.t)} °C.`,
    pregunta: () => '¿Cuántos moles de gas contiene?',
    datos: (rengD) => [['P', `${tx(rengD.P)} kPa`], ['V', `${tx(rengD.V)} L`], ['t', `${tx(rengD.t)} °C`]],
    pasos: (rengD, rengR) => [`T = ${tx(rengD.t + 273.15, 5)} K (subtema 22).`, `n = PV/(RT) = ${tx(rengR)} mol (subtema 8).`],
    pistas: ['Pasa a kelvin.', 'Usa PV = nRT.', 'kPa·L/(J/(mol·K)·K) da mol.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b1-i5', subtema: RENG_GRUPO, subtemas: ['n1-b1-s4', 'n1-b1-s9'],
    titulo: 'Hielo hasta agua templada', dificultad: 'avanzada',
    objetivo: 'Sumar el calor de un cambio de estado y el de calentamiento para llevar hielo a agua templada.', unidad: 'kJ', tolerancia: RENG_TOL_FU,
    fuentes: rengFuentesFu('1.3', 'los cambios de estado y la energía'), idealizado: 'Sin pérdidas; hielo a 0 °C.', metodo: 'suma de etapas con el catálogo de unidades', sinVerificar: [RENG_DIDACTICO_FU],
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 10, 1000, 5), t: rengEntreN1(rengRng, 5, 90, 1) }),
    respuesta: (rengD) => (rengD.m * RENG_LF_FU + rengD.m * RENG_C_AGUA_FU * rengD.t) / 1000,
    errores: (rengD) => [
      ['sin-fusion', 'Sin fundir', (rengD.m * RENG_C_AGUA_FU * rengD.t) / 1000, 'Falta el calor para fundir el hielo, que no cambia la temperatura.'],
      ['sin-calentar', 'Solo fundir', (rengD.m * RENG_LF_FU) / 1000, 'Falta el calor para calentar el agua desde 0 °C.']
    ],
    enunciado: (rengD) => `Se pasan ${tx(rengD.m)} g de hielo a 0 °C a agua a ${tx(rengD.t)} °C (L_f = 334 J/g; c = 4,184 J/(g·K)).`,
    pregunta: () => '¿Cuánta energía hace falta, en kJ?',
    datos: (rengD) => [['Hielo', `${tx(rengD.m)} g a 0 °C`], ['Final', `${tx(rengD.t)} °C`]],
    pasos: (rengD, rengR) => [`Fundir: ${tx((rengD.m * RENG_LF_FU) / 1000)} kJ (subtema 9); calentar: ${tx((rengD.m * RENG_C_AGUA_FU * rengD.t) / 1000)} kJ (subtema 4).`, `Total: ${tx(rengR)} kJ.`],
    pistas: ['Calor de fusión.', 'Calor de calentamiento.', 'Suma las dos etapas.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b1-i6', subtema: RENG_GRUPO, subtemas: ['n1-b1-s18', 'n1-b1-s20'],
    titulo: 'Moléculas en un volumen de agua', dificultad: 'avanzada',
    objetivo: 'Encadenar volumen, densidad, masa molar y constante de Avogadro y expresar el resultado en notación científica.', unidad: '', tolerancia: RENG_TOL_FU,
    fuentes: rengFuentesFu('1.6', 'el análisis dimensional y la notación científica', true), idealizado: 'Agua líquida de 1,00 g/mL.', metodo: 'masa molar del núcleo',
    parametros: (rengRng) => ({ v: rengEntreN1(rengRng, 0.05, 100, 0.05) }),
    respuesta: (rengD) => ((rengD.v / M('H2O')) * RENG_NA_FU) / 1e23,
    errores: (rengD) => [
      ['atomos', 'Átomos, no moléculas', ((3 * rengD.v) / M('H2O')) * RENG_NA_FU / 1e23, 'Contaste átomos (3 por molécula); la pregunta pide moléculas.'],
      ['moles', 'Solo los moles', rengD.v / M('H2O'), 'Esos son los moles; multiplica por N_A.']
    ],
    enunciado: (rengD) => `Se toman ${tx(rengD.v)} mL de agua (1,00 g/mL); N_A = 6,022·10²³ mol⁻¹.`,
    pregunta: () => '¿Cuántas moléculas de agua hay, en múltiplos de 10²³?',
    datos: (rengD) => [['Volumen', `${tx(rengD.v)} mL`], ['M(H₂O)', `${tx(M('H2O'), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`mL → g → mol: n = ${tx(rengD.v / M('H2O'))} mol (subtema 20).`, `N = ${tx(rengR)}·10²³ moléculas (subtema 18).`],
    pistas: ['Pasa el volumen a masa.', 'Pasa a moles.', 'Multiplica por N_A.']
  })
]
