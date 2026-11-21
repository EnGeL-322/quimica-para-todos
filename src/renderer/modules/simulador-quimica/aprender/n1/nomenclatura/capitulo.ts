import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_NOMENCLATURA } from './lecciones'

export const RENG_CAPITULO_NOMENCLATURA = rengCapituloN1(
  {
    bloque: 5,
    introduccion: 'Este capítulo enseña a leer y escribir el lenguaje de la química inorgánica. Empieza por los símbolos y los números de oxidación; presenta las tres nomenclaturas (sistemática, de Stock y tradicional); recorre las familias de compuestos (óxidos, peróxidos, hidruros, hidróxidos, ácidos y sales, incluidas las ácidas, las básicas y las hidratadas) y termina con un método para formular sin errores e interpretar nombres de etiquetas y problemas.',
    objetivos: [
      'Leer fórmulas y contar átomos, incluidos paréntesis e hidratos.',
      'Calcular números de oxidación con la regla de la suma cero.',
      'Nombrar compuestos con las nomenclaturas sistemática, de Stock y tradicional.',
      'Formular óxidos, hidruros, hidróxidos, ácidos y sales a partir de su nombre.',
      'Comprobar la electroneutralidad de cualquier fórmula iónica.',
      'Calcular masas fórmula y composiciones a partir de un nombre.'
    ],
    ruta: Array.from({ length: 20 }, (_rengX, rengI) => `n1-b5-s${rengI + 1}`),
    resumen: [
      'Cada elemento tiene un símbolo; los subíndices cuentan átomos y el de un paréntesis multiplica su contenido.',
      'El número de oxidación es una carga formal; su suma es cero en un compuesto y la carga en un ion.',
      'La sistemática usa prefijos, la de Stock números romanos y la tradicional sufijos -oso e -ico.',
      'Óxidos, peróxidos, hidruros e hidróxidos se formulan cruzando cargas (salvo los moleculares).',
      'Los oxoácidos pierden sus H⁺ y dan oxoaniones: -ico → -ato y -oso → -ito.',
      'Las sales ácidas conservan H en el anión; las básicas contienen OH⁻; los hidratos incluyen agua.',
      'Formular con método y comprobar la carga cero evita casi todos los errores.'
    ]
  },
  RENG_LECCIONES_NOMENCLATURA
)
