import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_TABLA } from './lecciones'

export const RENG_CAPITULO_TABLA = rengCapituloN1(
  {
    bloque: 3,
    introduccion: 'Este capítulo estudia la tabla periódica como herramienta para organizar y predecir. Empieza por su historia y por la ley periódica moderna, y explica qué indican los grupos, los periodos y los bloques s, p, d y f. Describe los metales, los no metales y los metaloides, y recorre las familias principales: alcalinos, alcalinotérreos, halógenos, gases nobles, metales de transición, lantánidos y actínidos. Después analiza las propiedades periódicas (radio atómico e iónico, energía de ionización, afinidad electrónica, electronegatividad, carácter metálico y estados de oxidación) y termina usándolas para predecir propiedades químicas.',
    objetivos: [
      'Explicar la ley periódica a partir de la configuración electrónica.',
      'Localizar un elemento por su grupo, su periodo y su bloque.',
      'Describir las propiedades de las familias principales de elementos.',
      'Explicar cómo varían el radio, la energía de ionización y la electronegatividad.',
      'Relacionar el grupo con los iones y los estados de oxidación habituales.',
      'Predecir fórmulas y estimar propiedades a partir de la posición en la tabla.'
    ],
    ruta: Array.from({ length: 23 }, (_rengX, rengI) => `n1-b3-s${rengI + 1}`),
    resumen: [
      'Los elementos se ordenan por número atómico y sus propiedades se repiten de forma periódica.',
      'El periodo indica las capas ocupadas y el grupo, la configuración de valencia.',
      'Los bloques s, p, d y f tienen 2, 6, 10 y 14 columnas.',
      'Los metales ceden electrones; los no metales los ganan o los comparten.',
      'En un periodo el radio disminuye y la energía de ionización y la electronegatividad aumentan.',
      'En un grupo el radio aumenta y la energía de ionización y la electronegatividad disminuyen.',
      'La posición en la tabla permite predecir iones, fórmulas y propiedades.'
    ]
  },
  RENG_LECCIONES_TABLA
)
