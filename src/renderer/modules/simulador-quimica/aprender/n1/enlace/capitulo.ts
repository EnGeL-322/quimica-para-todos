import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_ENLACE } from './lecciones'

export const RENG_CAPITULO_ENLACE = rengCapituloN1(
  {
    bloque: 4,
    introduccion: 'Este capítulo explica cómo y por qué se unen los átomos. Empieza por los electrones de valencia, la regla del octeto y las estructuras de Lewis, con la carga formal y la resonancia como herramientas para elegirlas. Describe los enlaces iónico, covalente, covalente coordinado y metálico, la polaridad de los enlaces y el momento dipolar. Después predice la forma de las moléculas con la teoría VSEPR y la relaciona con la hibridación y con los enlaces sigma y pi. Estudia las fuerzas entre moléculas (dispersión de London, dipolo-dipolo y enlaces de hidrógeno), relaciona el tipo de enlace con las propiedades de las sustancias y termina con una introducción a los orbitales moleculares.',
    objetivos: [
      'Contar electrones de valencia y dibujar estructuras de Lewis sencillas.',
      'Calcular cargas formales y órdenes de enlace medios en estructuras resonantes.',
      'Distinguir los enlaces iónico, covalente, coordinado y metálico.',
      'Clasificar la polaridad de un enlace y de una molécula.',
      'Predecir la geometría de una molécula con la teoría VSEPR y relacionarla con la hibridación.',
      'Relacionar las fuerzas intermoleculares y el tipo de enlace con las propiedades.'
    ],
    ruta: Array.from({ length: 22 }, (_rengX, rengI) => `n1-b4-s${rengI + 1}`),
    resumen: [
      'Los enlaces se forman con los electrones de valencia; los átomos tienden a completar su octeto.',
      'La carga formal es valencia menos no enlazantes menos enlaces, y las cargas formales suman la carga total.',
      'El enlace iónico transfiere electrones, el covalente los comparte y el metálico los deslocaliza.',
      'La diferencia de electronegatividad orienta sobre la polaridad; la geometría decide si la molécula es polar.',
      'Los dominios electrónicos se repelen: 2, 3 y 4 dominios dan 180°, 120° y 109,5° e hibridaciones sp, sp² y sp³.',
      'Un enlace sencillo es σ; cada enlace adicional es π. El orden de enlace es (enlazantes − antienlazantes)/2.',
      'Las fuerzas intermoleculares, mucho más débiles que los enlaces, deciden los puntos de fusión y ebullición.'
    ]
  },
  RENG_LECCIONES_ENLACE
)
