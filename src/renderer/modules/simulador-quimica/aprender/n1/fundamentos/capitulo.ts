import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_FUNDAMENTOS } from './lecciones'

export const RENG_CAPITULO_FUNDAMENTOS = rengCapituloN1(
  {
    bloque: 1,
    introduccion: 'Este capítulo abre el estudio de la química: qué estudia, cómo nació como ciencia y cómo trabaja con el método científico. Describe la materia y la energía, las propiedades de la materia (generales y específicas, físicas y químicas, intensivas y extensivas), los estados de agregación y los cambios; clasifica la materia en sustancias puras y mezclas y presenta los métodos de separación. Termina con las herramientas de medida (magnitudes, Sistema Internacional, notación científica, cifras significativas y análisis dimensional), la densidad, la temperatura y la presión, y la seguridad química elemental.',
    objetivos: [
      'Describir qué estudia la química y cómo contrasta sus ideas el método científico.',
      'Clasificar propiedades, cambios y tipos de materia.',
      'Calcular composiciones, purezas y porcentajes en masa.',
      'Convertir unidades con factores de conversión y el Sistema Internacional.',
      'Operar con notación científica y cifras significativas.',
      'Aplicar la densidad, la temperatura y la presión, y las normas básicas de seguridad.'
    ],
    ruta: Array.from({ length: 23 }, (_rengX, rengI) => `n1-b1-s${rengI + 1}`),
    resumen: [
      'La química estudia la materia, sus propiedades y sus transformaciones, con medidas cuidadosas.',
      'Las propiedades específicas, como la densidad, identifican las sustancias; las intensivas no dependen de la cantidad.',
      'En los cambios físicos la sustancia se conserva; en los químicos se forman sustancias nuevas, pero la masa se conserva.',
      'Las sustancias puras tienen composición fija; las mezclas, variable, y se separan por métodos físicos.',
      'Toda medida lleva número y unidad; se convierte con factores iguales a 1 y se expresa con sus cifras significativas.',
      'T(K) = t(°C) + 273,15 y 1 atm = 101,325 kPa; en los gases se usa la temperatura absoluta.',
      'Leer la etiqueta, protegerse y añadir el ácido sobre el agua son normas básicas de seguridad.'
    ]
  },
  RENG_LECCIONES_FUNDAMENTOS
)
