import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengSinVerificar } from '../procedencia'
import type { RengEscenaLeccionN1, RengExplorarN1, RengProcedenciaN1 } from '../tipos'

export const RENG_G10 = {
  arrheniusAcido: ['ácido de Arrhenius', 'Sustancia que al disolverse en agua aumenta la concentración de iones H⁺ (H₃O⁺).'],
  arrheniusBase: ['base de Arrhenius', 'Sustancia que al disolverse en agua aumenta la concentración de iones OH⁻.'],
  bronstedAcido: ['ácido de Brønsted-Lowry', 'Especie que cede un protón (H⁺) a otra en una reacción.'],
  bronstedBase: ['base de Brønsted-Lowry', 'Especie que acepta un protón (H⁺) de otra en una reacción.'],
  parConjugado: ['par ácido-base conjugado', 'Dos especies que se diferencian en un protón, como CH₃COOH y CH₃COO⁻ o NH₄⁺ y NH₃.'],
  lewisAcido: ['ácido de Lewis', 'Especie que acepta un par de electrones para formar un enlace, como H⁺ o BF₃.'],
  lewisBase: ['base de Lewis', 'Especie que cede un par de electrones no compartido para formar un enlace, como NH₃ o H₂O.'],
  acidoFuerte: ['ácido fuerte', 'Ácido que en agua cede su protón por completo: en disolución diluida no quedan moléculas sin ionizar.'],
  acidoDebil: ['ácido débil', 'Ácido que en agua solo se ioniza en parte; alcanza un equilibrio descrito por su Ka.'],
  baseFuerte: ['base fuerte', 'Base que en agua libera o produce OH⁻ por completo, como NaOH o KOH.'],
  baseDebil: ['base débil', 'Base que en agua solo reacciona en parte con el agua para producir OH⁻; se describe con su Kb.'],
  autoionizacion: ['autoionización del agua', 'Reacción en la que dos moléculas de agua intercambian un protón: 2 H₂O ⇌ H₃O⁺ + OH⁻.'],
  kw: ['producto iónico del agua', 'Constante Kw = [H₃O⁺]·[OH⁻] del equilibrio de autoionización; a 25 °C, pKw ≈ 14.'],
  ph: ['pH', 'Medida de la acidez: pH = −log₁₀ [H₃O⁺], con la concentración en mol/L (aproximación de la actividad).'],
  poh: ['pOH', 'pOH = −log₁₀ [OH⁻]; a 25 °C, pH + pOH ≈ 14.'],
  ka: ['constante de acidez', 'Ka = [H₃O⁺]·[A⁻]/[HA] para la ionización de un ácido débil HA; cuanto mayor, más fuerte es el ácido.'],
  pka: ['pKa', 'pKa = −log₁₀ Ka; un pKa menor indica un ácido más fuerte.'],
  kb: ['constante de basicidad', 'Kb = [BH⁺]·[OH⁻]/[B] para la reacción de una base débil B con el agua.'],
  ionizacion: ['grado de ionización', 'Fracción (o porcentaje) de un ácido o una base débil que está ionizada en el equilibrio.'],
  neutralizacion: ['neutralización', 'Reacción de un ácido con una base que da agua y una sal: H₃O⁺ + OH⁻ → 2 H₂O.'],
  equivalencia: ['punto de equivalencia', 'Momento de una valoración en que los moles de base añadidos igualan a los de ácido según la estequiometría.'],
  indicador: ['indicador ácido-base', 'Ácido débil cuya forma ácida y cuya forma básica tienen colores distintos; cambia de color cerca de pH = pK del indicador.'],
  viraje: ['intervalo de viraje', 'Intervalo de pH, de aproximadamente pK ± 1, en el que un indicador cambia de color.'],
  hidrolisis: ['hidrólisis de una sal', 'Reacción con el agua de los iones de una sal que son ácidos o bases conjugados débiles; cambia el pH.'],
  amortiguador: ['disolución amortiguadora', 'Mezcla de un ácido débil y su base conjugada (o una base débil y su ácido conjugado) que resiste los cambios de pH.'],
  henderson: ['ecuación de Henderson-Hasselbalch', 'pH = pKa + log₁₀([A⁻]/[HA]); aproximación para amortiguadores con concentraciones no muy bajas.'],
  ionComun: ['efecto del ion común', 'Disminución de la ionización o de la solubilidad de un compuesto al añadir uno de sus iones desde otra fuente.'],
  equilibrio: ['equilibrio químico', 'Estado en que las velocidades directa e inversa son iguales y las concentraciones ya no cambian.'],
  kc: ['constante Kc', 'Constante de equilibrio escrita con concentraciones molares elevadas a sus coeficientes.'],
  kp: ['constante Kp', 'Constante de equilibrio de una reacción de gases escrita con presiones parciales; Kp = Kc·(RT)^Δn.'],
  q: ['cociente de reacción', 'Expresión con la misma forma que K pero con las cantidades del momento; compararlo con K indica hacia dónde avanza la reacción.'],
  leChatelier: ['principio de Le Châtelier', 'Si se perturba un sistema en equilibrio, este se desplaza en el sentido que contrarresta en parte la perturbación.'],
  ksp: ['producto de solubilidad', 'Ksp = [M]^m·[X]^x de una sal poco soluble en equilibrio con su sólido.'],
  solubilidadMolar: ['solubilidad molar', 'Moles de una sal que se disuelven por litro de disolución saturada.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionAb = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S42 = '4.2 Classifying Chemical Reactions'
export const RENG_S131 = '13.1 Chemical Equilibria'
export const RENG_S132 = '13.2 Equilibrium Constants'
export const RENG_S133 = "13.3 Shifting Equilibria: Le Châtelier's Principle"
export const RENG_S134 = '13.4 Equilibrium Calculations'
export const RENG_S141 = '14.1 Brønsted-Lowry Acids and Bases'
export const RENG_S142 = '14.2 pH and pOH'
export const RENG_S143 = '14.3 Relative Strengths of Acids and Bases'
export const RENG_S144 = '14.4 Hydrolysis of Salts'
export const RENG_S146 = '14.6 Buffers'
export const RENG_S147 = '14.7 Acid-Base Titrations'
export const RENG_S151 = '15.1 Precipitation and Dissolution'
export const RENG_S152 = '15.2 Lewis Acids and Bases'

export const RENG_PKW_TEXTO = 'pKw = 14,00 a 25 °C'
export const RENG_LIMITE_AB = 'La escena resuelve el pH de un solo par ácido-base a 25 °C con concentraciones en lugar de actividades; no modela ácidos polipróticos, la temperatura ni una sustancia concreta.'
export const RENG_LIMITE_EQ = 'La escena resuelve solo la disociación A(g) ⇌ 2 B(g) de gases ideales con la Kp que eliges; no modela cómo cambia Kp con la temperatura ni el tiempo que tarda en alcanzarse el equilibrio.'

export const rengEscenaAb = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'acido-base', valores: rengValores, instruccion: rengInstruccion, limite: RENG_LIMITE_AB })
export const rengEscenaEq = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'equilibrio-gas', valores: rengValores, instruccion: rengInstruccion, limite: RENG_LIMITE_EQ })
export const rengMesaEnlaces = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'enlaces', nombre: 'Mesa · Enlaces (enlaces dativos)', instruccion: rengInstruccion, limite: 'La Mesa explica cómo se forma el enlace dativo paso a paso; no calcula fuerzas de ácidos ni bases de Lewis.' })
export const rengSolubilidadAb = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'solubilidad', nombre: 'Escena de solubilidad (Q frente a Ksp)', instruccion: rengInstruccion, limite: 'La escena usa Ksp publicados a 25 °C con concentraciones en lugar de actividades; no modela la temperatura.' })
export const rengEquilibrioExplorar = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'equilibrio', nombre: 'Escena de equilibrio (Q frente a K)', instruccion: rengInstruccion, limite: 'La escena trabaja con concentraciones y una K dada; no usa presiones parciales.' })

export const RENG_KA_ACETICO_DIDACTICO = 1.8e-5
