import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_ORGANICA } from './lecciones'

export const RENG_CAPITULO_ORGANICA = rengCapituloN1(
  {
    bloque: 12,
    introduccion: 'Este capítulo es una primera visita a la química del carbono. Empieza por las propiedades que hacen único a este elemento: su tetravalencia y su capacidad de formar cadenas. Enseña a leer y escribir fórmulas estructurales y a reconocer los grupos funcionales. Recorre los hidrocarburos (alcanos, alquenos, alquinos y aromáticos) y la isomería estructural, y después las familias con oxígeno y nitrógeno: alcoholes, éteres, aldehídos, cetonas, ácidos carboxílicos, ésteres, aminas y amidas. Termina con las reglas básicas de nomenclatura, los tipos elementales de reacción y una introducción a los polímeros y a las biomoléculas.',
    objetivos: [
      'Aplicar la tetravalencia del carbono para leer y escribir fórmulas estructurales.',
      'Obtener la fórmula molecular, la masa molar y el grado de insaturación de un compuesto orgánico.',
      'Reconocer los grupos funcionales principales y la familia a la que pertenece un compuesto.',
      'Nombrar y formular hidrocarburos y compuestos con un grupo funcional sencillo.',
      'Identificar isómeros estructurales de cadena, de posición y de función.',
      'Clasificar reacciones orgánicas elementales y hacer cálculos estequiométricos con ellas.'
    ],
    ruta: Array.from({ length: 22 }, (_rengX, rengI) => `n1-b12-s${rengI + 1}`),
    resumen: [
      'El carbono forma cuatro enlaces y se une consigo mismo en cadenas y anillos.',
      'Una cadena abierta saturada tiene 2n + 2 hidrógenos; cada enlace doble o anillo quita dos y cada triple, cuatro.',
      'El grupo funcional decide las propiedades; en una serie homóloga cada miembro añade un CH₂.',
      'Los alcanos son CₙH₂ₙ₊₂, los alquenos CₙH₂ₙ y los alquinos CₙH₂ₙ₋₂; el benceno, C₆H₆, es aromático.',
      'Los isómeros estructurales comparten fórmula molecular y difieren en el orden de unión de sus átomos.',
      'Ácido más alcohol da éster y agua; ácido más amina da amida y agua.',
      'Los polímeros son cadenas de monómeros unidos por adición o por condensación.'
    ]
  },
  RENG_LECCIONES_ORGANICA
)
