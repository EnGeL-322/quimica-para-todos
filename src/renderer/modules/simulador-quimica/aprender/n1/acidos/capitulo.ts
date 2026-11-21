import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_ACIDOS } from './lecciones'

export const RENG_CAPITULO_ACIDOS = rengCapituloN1(
  {
    bloque: 10,
    introduccion: 'Este capítulo trata los ácidos y las bases y el equilibrio químico que los gobierna. Empieza por las tres definiciones (Arrhenius, Brønsted-Lowry y Lewis), sigue con la fuerza de ácidos y bases, el agua y la escala de pH, y llega a la neutralización, los indicadores, la hidrólisis y los amortiguadores. Termina con el equilibrio químico en general: las constantes Kc y Kp, el principio de Le Châtelier y el equilibrio de solubilidad.',
    objetivos: [
      'Reconocer ácidos y bases según Arrhenius, Brønsted-Lowry y Lewis, y sus pares conjugados.',
      'Calcular el pH y el pOH de ácidos y bases fuertes y débiles con Kw, Ka y Kb.',
      'Resolver neutralizaciones y elegir indicadores para una valoración.',
      'Predecir y calcular el pH de sales y amortiguadores, también con un ion común.',
      'Calcular constantes y composiciones de equilibrio y convertir entre Kc y Kp.',
      'Aplicar el principio de Le Châtelier y el producto de solubilidad.'
    ],
    ruta: Array.from({ length: 22 }, (_rengX, rengI) => `n1-b10-s${rengI + 1}`),
    resumen: [
      'Un ácido cede protones (o aumenta [H⁺]) y una base los acepta; Lewis amplía la idea a pares de electrones.',
      'El agua se autoioniza: Kw = [H₃O⁺][OH⁻] y pH + pOH = 14 a 25 °C.',
      'Los ácidos y bases fuertes se ionizan por completo; los débiles se describen con Ka o Kb, y Ka·Kb = Kw.',
      'En la neutralización se igualan moles de H₃O⁺ y OH⁻; el indicador debe virar en el salto de la curva.',
      'Las sales de ácidos o bases débiles hidrolizan; un ácido débil con su base conjugada forma un amortiguador.',
      'El equilibrio es dinámico; Q frente a K dice hacia dónde avanza, y Kp = Kc·(RT)^Δn.',
      'Un equilibrio contrarresta en parte las perturbaciones; Ksp gobierna la solubilidad de las sales.'
    ]
  },
  RENG_LECCIONES_ACIDOS
)
