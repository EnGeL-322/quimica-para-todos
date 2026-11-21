import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengDeclarada, rengSinVerificar } from '../procedencia'
import type { RengEscenaLeccionN1, RengExplorarN1, RengProcedenciaN1 } from '../tipos'

export const RENG_G11 = {
  calor: ['calor', 'Energía que pasa de un cuerpo a otro por diferencia de temperatura; se mide en julios (J).'],
  temperatura: ['temperatura', 'Medida de la energía cinética media de las partículas; decide hacia dónde fluye el calor.'],
  equilibrioTermico: ['equilibrio térmico', 'Estado en que dos cuerpos en contacto tienen la misma temperatura y ya no intercambian calor neto.'],
  capacidad: ['capacidad calorífica', 'Calor necesario para subir 1 K la temperatura de un objeto concreto: C = q/ΔT, en J/K.'],
  especifico: ['calor específico', 'Calor necesario para subir 1 K la temperatura de 1 g de una sustancia: c, en J/(g·K).'],
  calorimetro: ['calorímetro', 'Recipiente aislado en el que se mide el calor de un proceso a partir del cambio de temperatura de una masa conocida.'],
  entalpia: ['entalpía', 'Función de estado H; su variación ΔH es el calor intercambiado a presión constante.'],
  exotermica: ['reacción exotérmica', 'Reacción que libera calor al entorno: ΔH < 0.'],
  endotermica: ['reacción endotérmica', 'Reacción que absorbe calor del entorno: ΔH > 0.'],
  entalpiaReaccion: ['entalpía de reacción', 'ΔH de una reacción tal como está escrita, en kJ por mol de reacción.'],
  hess: ['ley de Hess', 'Si una reacción es la suma de otras, su ΔH es la suma de los ΔH de esas reacciones.'],
  formacion: ['entalpía de formación estándar', 'ΔH de formar 1 mol de un compuesto a partir de sus elementos en estado estándar; vale 0 para los elementos.'],
  estandar: ['estado estándar', 'Forma más estable de una sustancia a 1 bar (y, en tablas, normalmente a 25 °C).'],
  energiaEnlace: ['energía de enlace', 'Energía media necesaria para romper 1 mol de un enlace en fase gaseosa; siempre positiva.'],
  activacion: ['energía de activación', 'Energía mínima que necesitan las moléculas que chocan para reaccionar; Ea.'],
  catalizador: ['catalizador', 'Sustancia que acelera una reacción al ofrecer un camino de menor energía de activación sin consumirse.'],
  espontanea: ['proceso espontáneo', 'Proceso que, una vez iniciado, avanza por sí solo en unas condiciones dadas, sin aporte continuo de energía.'],
  entropia: ['entropía', 'Función de estado S relacionada con el número de formas de repartir la energía de un sistema; en J/(mol·K).'],
  gibbs: ['energía libre de Gibbs', 'ΔG = ΔH − T·ΔS; a T y P constantes, un proceso es espontáneo si ΔG < 0.'],
  galvanica: ['celda galvánica', 'Celda que obtiene energía eléctrica de una reacción redox espontánea, con las semirreacciones separadas.'],
  anodo: ['ánodo', 'Electrodo donde ocurre la oxidación.'],
  catodo: ['cátodo', 'Electrodo donde ocurre la reducción.'],
  puente: ['puente salino', 'Conexión iónica entre las dos semiceldas que cierra el circuito y mantiene la neutralidad eléctrica.'],
  potencial: ['potencial estándar de reducción', 'Tendencia de una semirreacción a reducirse frente al electrodo de hidrógeno, en voltios, en condiciones estándar.'],
  fem: ['potencial de celda', 'Diferencia de potencial entre cátodo y ánodo: E°celda = E°cátodo − E°ánodo.'],
  electrolisis: ['electrólisis', 'Uso de una corriente eléctrica para provocar una reacción redox no espontánea.'],
  faraday: ['constante de Faraday', 'Carga de un mol de electrones: F ≈ 96 485 C/mol.'],
  corrosion: ['corrosión', 'Oxidación espontánea de un metal por su entorno, como la formación de herrumbre en el hierro.'],
  bateria: ['batería', 'Una o varias celdas galvánicas conectadas que almacenan energía química y la entregan como electricidad.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionTermo = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S51 = '5.1 Energy Basics'
export const RENG_S52 = '5.2 Calorimetry'
export const RENG_S53 = '5.3 Enthalpy'
export const RENG_S75 = '7.5 Strengths of Ionic and Covalent Bonds'
export const RENG_S125 = '12.5 Collision Theory'
export const RENG_S161 = '16.1 Spontaneity'
export const RENG_S162 = '16.2 Entropy'
export const RENG_S164 = '16.4 Free Energy'
export const RENG_S172 = '17.2 Galvanic Cells'
export const RENG_S173 = '17.3 Electrode and Cell Potentials'
export const RENG_S175 = '17.5 Batteries and Fuel Cells'
export const RENG_S176 = '17.6 Corrosion'
export const RENG_S177 = '17.7 Electrolysis'

export const RENG_PROCEDENCIA_DHF = rengDeclarada('Entalpías de formación y entropías tomadas de la tabla del núcleo de la app (nucleo/termoquimica.ts), que cita la página de Wikipedia «Standard enthalpy of formation» consultada en una sesión anterior. No se reabrió la fuente en esta entrega.')
export const RENG_PROCEDENCIA_F = rengDeclarada('F = 96 485,33212 C/mol, constante registrada en el proyecto (datos/electroquimica.ts, filas CODATA contrastadas). No se reabrió la fuente.')
export const RENG_C_AGUA_TEXTO = 'c(agua) = 4,184 J/(g·K)'

export const RENG_LIMITE_CAL = 'La escena supone un calorímetro perfectamente aislado, calores específicos constantes y ningún cambio de estado.'
export const RENG_LIMITE_ELEC = 'La escena relaciona carga y masa con las leyes de Faraday; no calcula voltajes, energía consumida ni reacciones secundarias, salvo con la eficiencia que eliges.'

export const rengEscenaCal = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'calorimetria', valores: rengValores, instruccion: rengInstruccion, limite: RENG_LIMITE_CAL })
export const rengEscenaElec = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'electrolisis', valores: rengValores, instruccion: rengInstruccion, limite: RENG_LIMITE_ELEC })
export const rengTermoExplorar = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'termo', nombre: 'Escena de termoquímica (ΔH, ΔS, ΔG y K)', instruccion: rengInstruccion, limite: 'La escena usa entalpías y entropías tabuladas de un conjunto fijo de reacciones y supone ΔH y ΔS constantes con la temperatura.' })
export const rengCineticaExplorar = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'cinetica', nombre: 'Escena de cinética (Arrhenius)', instruccion: rengInstruccion, limite: 'La escena usa leyes de velocidad sencillas y la ecuación de Arrhenius con parámetros dados; no modela mecanismos complejos.' })
export const rengElectroquimicaExplorar = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'electroquimica', nombre: 'Escena de celdas galvánicas (Nernst)', instruccion: rengInstruccion, limite: 'Celda ideal en circuito abierto: sin resistencia interna, sobrepotencial ni puente salino real; E es el máximo teórico.' })
export const rengMesaEnlacesTermo = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'enlaces', nombre: 'Mesa · Enlaces (energías de enlace)', instruccion: rengInstruccion, limite: 'La Mesa muestra la energía de disociación de algunos enlaces concretos; las energías medias de las tablas de enlace son otro dato.' })
