import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_ATOMO } from './lecciones'

export const RENG_CAPITULO_ATOMO = rengCapituloN1(
  {
    bloque: 2,
    introduccion: 'Este capítulo recorre la estructura del átomo. Empieza por la historia de las teorías atómicas, de Dalton al modelo mecánico-cuántico, pasando por Thomson, Rutherford y Bohr. Presenta las partículas subatómicas y los números que identifican a cada núclido (número atómico y número másico), los isótopos, isóbaros e isótonos, los iones, la masa atómica y la unidad de masa atómica. Después estudia la radiación electromagnética y los espectros atómicos, y termina con los números cuánticos, los orbitales, las reglas de llenado (Aufbau, Pauli y Hund), la configuración electrónica y los electrones de valencia.',
    objetivos: [
      'Describir la evolución de los modelos atómicos y los experimentos que los cambiaron.',
      'Contar protones, neutrones y electrones de átomos e iones.',
      'Distinguir isótopos, isóbaros e isótonos y calcular masas atómicas medias.',
      'Relacionar longitud de onda, frecuencia y energía de la radiación y de los saltos del hidrógeno.',
      'Aplicar los números cuánticos y las reglas de llenado para escribir configuraciones.',
      'Identificar los electrones de valencia y los iones que forman los elementos representativos.'
    ],
    ruta: Array.from({ length: 25 }, (_rengX, rengI) => `n1-b2-s${rengI + 1}`),
    resumen: [
      'Cada modelo atómico se sustituyó cuando un experimento nuevo no encajaba con él.',
      'El átomo tiene un núcleo diminuto con protones y neutrones y una corteza con electrones.',
      'Z identifica al elemento, A = Z + N y los electrones de un ion son Z − q.',
      'La masa atómica es la media ponderada de los isótopos; 1 u ≈ 1,66054·10⁻²⁴ g.',
      'c = λ·ν y E = h·c/λ; en el hidrógeno, E_n = −13,6 eV/n² y cada línea es un salto.',
      'Los electrones llenan los orbitales por orden de energía, dos por orbital y repartidos según Hund.',
      'Los electrones de valencia deciden los iones y los enlaces que forma un átomo.'
    ]
  },
  RENG_LECCIONES_ATOMO
)
