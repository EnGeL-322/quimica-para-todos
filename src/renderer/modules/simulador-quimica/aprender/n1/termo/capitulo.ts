import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_TERMO } from './lecciones'

export const RENG_CAPITULO_TERMO = rengCapituloN1(
  {
    bloque: 11,
    introduccion: 'Este capítulo trata la energía en las reacciones químicas. Empieza por el calor, la temperatura y la calorimetría; sigue con la entalpía, la ley de Hess, las entalpías de formación y las energías de enlace; pasa por la energía de activación y la espontaneidad (entropía y energía libre), y termina con la electroquímica: celdas galvánicas, potenciales, electrólisis, leyes de Faraday, corrosión y baterías.',
    objetivos: [
      'Calcular calores con q = m·c·ΔT y medir entalpías en un calorímetro.',
      'Calcular ΔH de reacciones con entalpías de formación, la ley de Hess y energías de enlace.',
      'Relacionar la energía de activación con la velocidad mediante Arrhenius.',
      'Predecir la espontaneidad con ΔG = ΔH − T·ΔS y relacionar ΔG° con K.',
      'Calcular potenciales de celda, incluida la ecuación de Nernst.',
      'Aplicar las leyes de Faraday a electrólisis, corrosión y baterías.'
    ],
    ruta: Array.from({ length: 20 }, (_rengX, rengI) => `n1-b11-s${rengI + 1}`),
    resumen: [
      'El calor pasa del cuerpo caliente al frío; q = m·c·ΔT y la suma de calores en un calorímetro es cero.',
      'ΔH es el calor a presión constante; se calcula con entalpías de formación o combinando reacciones (Hess).',
      'Las energías de enlace dan estimaciones de ΔH: romper cuesta, formar libera.',
      'La energía de activación es la barrera cinética; un catalizador la baja sin cambiar ΔH.',
      'ΔG = ΔH − T·ΔS decide la espontaneidad, y ΔG° = −RT·ln K la conecta con el equilibrio.',
      'En una celda galvánica E° = E°cátodo − E°ánodo y ΔG° = −nFE°; Nernst corrige por las concentraciones.',
      'En la electrólisis, la masa transformada es m = Q·M/(z·F); lo mismo vale para corrosión y baterías.'
    ]
  },
  RENG_LECCIONES_TERMO
)
