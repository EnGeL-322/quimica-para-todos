import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengSinVerificar } from '../procedencia'
import type { RengEscenaLeccionN1, RengExplorarN1, RengProcedenciaN1 } from '../tipos'

export const RENG_G2 = {
  atomo: ['átomo', 'Partícula más pequeña de un elemento que conserva su identidad química; tiene un núcleo y electrones.'],
  modelo: ['modelo atómico', 'Representación simplificada del átomo que explica los datos experimentales de su época.'],
  dalton: ['teoría atómica de Dalton', 'Propuesta de que la materia está formada por átomos indivisibles, iguales para cada elemento, que se combinan en proporciones sencillas.'],
  thomson: ['modelo de Thomson', 'Modelo en el que el átomo es una esfera de carga positiva con electrones incrustados, propuesto tras descubrirse el electrón.'],
  rutherford: ['modelo de Rutherford', 'Modelo en el que casi toda la masa y la carga positiva están en un núcleo diminuto rodeado de electrones.'],
  bohr: ['modelo de Bohr', 'Modelo en el que el electrón gira en órbitas de energía fija y emite o absorbe luz al saltar entre ellas.'],
  cuantico: ['modelo mecánico-cuántico', 'Modelo actual que describe los electrones mediante orbitales: regiones con alta probabilidad de encontrarlos.'],
  proton: ['protón', 'Partícula del núcleo con carga +1 y masa de unos 1,0073 u.'],
  neutron: ['neutrón', 'Partícula del núcleo sin carga y con masa de unos 1,0087 u.'],
  electron: ['electrón', 'Partícula con carga −1 y masa unas 1836 veces menor que la del protón, que ocupa la corteza del átomo.'],
  numeroAtomico: ['número atómico (Z)', 'Número de protones del núcleo; identifica al elemento.'],
  numeroMasico: ['número másico (A)', 'Suma de protones y neutrones del núcleo: A = Z + N.'],
  isotopo: ['isótopos', 'Átomos del mismo elemento (igual Z) con distinto número de neutrones y, por tanto, distinto A.'],
  isobaro: ['isóbaros', 'Átomos de elementos distintos con el mismo número másico A.'],
  isotono: ['isótonos', 'Átomos de elementos distintos con el mismo número de neutrones N.'],
  ion: ['ion', 'Átomo o grupo de átomos con carga eléctrica por haber ganado (anión) o perdido (catión) electrones.'],
  masaAtomica: ['masa atómica', 'Masa media de los átomos de un elemento, ponderada por la abundancia de sus isótopos.'],
  uma: ['unidad de masa atómica (u)', 'Doceava parte de la masa de un átomo de carbono-12; vale unos 1,6605·10⁻²⁴ g.'],
  radiacion: ['radiación electromagnética', 'Energía que se propaga como onda de campos eléctrico y magnético; incluye la luz visible.'],
  longitudOnda: ['longitud de onda', 'Distancia entre dos máximos consecutivos de una onda; para la luz visible, entre unos 380 y 750 nm.'],
  frecuencia: ['frecuencia', 'Número de oscilaciones por segundo de una onda; se mide en hercios (Hz).'],
  foton: ['fotón', 'Cuanto de luz: partícula de energía E = h·ν.'],
  espectro: ['espectro atómico', 'Conjunto de longitudes de onda que emite o absorbe un elemento; es como su huella dactilar.'],
  numerosCuanticos: ['números cuánticos', 'Cuatro números (n, l, m_l, m_s) que describen el estado de cada electrón en un átomo.'],
  orbital: ['orbital', 'Región del espacio donde es muy probable encontrar un electrón; caben como máximo dos.'],
  aufbau: ['principio de Aufbau', 'Regla de llenado: los electrones ocupan primero los orbitales de menor energía (1s, 2s, 2p, 3s…).'],
  pauli: ['principio de exclusión de Pauli', 'En un átomo no puede haber dos electrones con los cuatro números cuánticos iguales: dos por orbital, con espines opuestos.'],
  hund: ['regla de Hund', 'En orbitales de igual energía, los electrones se reparten primero de uno en uno con el mismo espín.'],
  configuracion: ['configuración electrónica', 'Distribución de los electrones de un átomo en sus orbitales, como 1s² 2s² 2p⁶.'],
  valencia: ['electrones de valencia', 'Electrones de la capa más externa, que intervienen en los enlaces.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionAt = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S21A = '2.1 Early Ideas in Atomic Theory'
export const RENG_S22A = '2.2 Evolution of Atomic Theory'
export const RENG_S23A = '2.3 Atomic Structure and Symbolism'
export const RENG_S61 = '6.1 Electromagnetic Energy'
export const RENG_S62 = '6.2 The Bohr Model'
export const RENG_S63 = '6.3 Development of Quantum Theory'
export const RENG_S64 = '6.4 Electronic Structure of Atoms (Electron Configurations)'

export const RENG_PROCEDENCIA_PARTICULAS = rengSinVerificar('Masas del protón (1,007276 u), del neutrón (1,008665 u) y del electrón (0,00054858 u), 1 u = 1,66054·10⁻²⁴ g y 13,6 eV para el hidrógeno: valores de uso común recordados, no contrastados en esta entrega. h, c, e y N_A son valores exactos del SI (2019).')
export const RENG_PROCEDENCIA_ISOTOPOS = rengSinVerificar('Masas y abundancias de isótopos de los ejemplos y prácticas: valores de referencia recordados (tablas IUPAC), no contrastados en esta entrega; los cálculos usan los datos que da el enunciado.')

export const rengEscenaAtomo = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'atomo', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena cuenta partículas y suma sus masas; no decide si el núclido existe ni descuenta la energía de enlace del núcleo.' })
export const rengEscenaEspectro = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'espectro-hidrogeno', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena usa el modelo de Bohr, válido solo para el hidrógeno y los iones de un electrón.' })
export const rengEscenaConfig = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'config-electronica', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena muestra átomos neutros en el estado fundamental hasta Z = 36; no muestra iones ni estados excitados.' })
export const rengTablaAt = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'tabla-periodica', sub: '', nombre: 'Tabla periódica', instruccion: rengInstruccion, limite: 'La tabla muestra masas atómicas y configuraciones electrónicas; no muestra los isótopos de cada elemento.' })
