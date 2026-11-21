import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengDeclarada, rengSinVerificar } from '../procedencia'
import type { RengEscenaLeccionN1, RengProcedenciaN1 } from '../tipos'

export const RENG_G12 = {
  organica: ['química orgánica', 'Parte de la química que estudia los compuestos del carbono, salvo unos pocos como los carbonatos y los óxidos de carbono.'],
  tetravalencia: ['tetravalencia', 'Capacidad del átomo de carbono de formar cuatro enlaces covalentes.'],
  catenacion: ['concatenación', 'Capacidad de los átomos de carbono de unirse entre sí formando cadenas y anillos estables.'],
  cadena: ['cadena carbonada', 'Secuencia de átomos de carbono enlazados que forma el esqueleto de una molécula orgánica.'],
  ramificacion: ['ramificación', 'Grupo de carbonos unido a la cadena principal de una molécula.'],
  carbonoPrimario: ['carbono primario', 'Carbono unido a un solo carbono más; los secundarios, terciarios y cuaternarios están unidos a dos, tres y cuatro.'],
  semidesarrollada: ['fórmula semidesarrollada', 'Fórmula que muestra los enlaces entre carbonos y agrupa junto a cada carbono sus hidrógenos, como CH₃–CH₂–OH.'],
  molecular: ['fórmula molecular', 'Fórmula que indica cuántos átomos de cada elemento tiene una molécula, como C₂H₆O.'],
  esqueleto: ['fórmula de líneas', 'Representación en zigzag en la que cada vértice y cada extremo es un carbono y los hidrógenos unidos a carbono no se dibujan.'],
  grupoFuncional: ['grupo funcional', 'Átomo o grupo de átomos que da a una molécula orgánica sus propiedades químicas características.'],
  serieHomologa: ['serie homóloga', 'Familia de compuestos con el mismo grupo funcional en la que cada miembro tiene un –CH₂– más que el anterior.'],
  hidrocarburo: ['hidrocarburo', 'Compuesto formado solo por carbono e hidrógeno.'],
  saturado: ['compuesto saturado', 'Compuesto cuyos carbonos están unidos solo por enlaces sencillos, con el máximo de hidrógenos posible.'],
  insaturacion: ['grado de insaturación', 'Número de enlaces π más anillos de una molécula; se calcula como (2C + 2 + N − H − X)/2.'],
  alcano: ['alcano', 'Hidrocarburo saturado de cadena abierta, de fórmula general CₙH₂ₙ₊₂.'],
  alqueno: ['alqueno', 'Hidrocarburo con al menos un enlace doble C=C; con uno solo, su fórmula general es CₙH₂ₙ.'],
  alquino: ['alquino', 'Hidrocarburo con al menos un enlace triple C≡C; con uno solo, su fórmula general es CₙH₂ₙ₋₂.'],
  aromatico: ['hidrocarburo aromático', 'Hidrocarburo con un anillo plano de electrones π deslocalizados, como el benceno, especialmente estable.'],
  isomero: ['isómeros', 'Compuestos distintos que tienen la misma fórmula molecular.'],
  isomeroEstructural: ['isómeros estructurales', 'Isómeros que se diferencian en el orden en que están unidos sus átomos; pueden ser de cadena, de posición o de función.'],
  alcohol: ['alcohol', 'Compuesto con un grupo hidroxilo, –OH, unido a un carbono saturado.'],
  eter: ['éter', 'Compuesto con un oxígeno unido a dos carbonos, C–O–C.'],
  carbonilo: ['grupo carbonilo', 'Grupo C=O; está en un extremo de la cadena en los aldehídos y entre dos carbonos en las cetonas.'],
  aldehido: ['aldehído', 'Compuesto con el grupo –CHO en un extremo de la cadena.'],
  cetona: ['cetona', 'Compuesto con un grupo carbonilo unido a dos carbonos.'],
  acido: ['ácido carboxílico', 'Compuesto con el grupo carboxilo, –COOH; es un ácido débil.'],
  ester: ['éster', 'Compuesto con el grupo –COO– unido a dos carbonos; se forma a partir de un ácido carboxílico y un alcohol.'],
  esterificacion: ['esterificación', 'Reacción de un ácido carboxílico con un alcohol que da un éster y agua.'],
  amina: ['amina', 'Compuesto derivado del amoníaco en el que uno o más hidrógenos se sustituyen por grupos de carbono; es una base débil.'],
  amida: ['amida', 'Compuesto con un grupo carbonilo unido a un nitrógeno, –CO–N; el enlace entre aminoácidos es de este tipo.'],
  localizador: ['localizador', 'Número que indica en qué carbono de la cadena principal está un enlace múltiple, un sustituyente o un grupo funcional.'],
  cadenaPrincipal: ['cadena principal', 'Cadena de carbonos que da el nombre base de un compuesto: la más larga que contiene el grupo funcional principal.'],
  adicion: ['reacción de adición', 'Reacción en la que una molécula se une a un enlace múltiple, que pasa a ser sencillo, sin que se pierdan átomos.'],
  sustitucion: ['reacción de sustitución', 'Reacción en la que un átomo o grupo de una molécula se cambia por otro.'],
  eliminacion: ['reacción de eliminación', 'Reacción en la que una molécula pierde átomos de carbonos vecinos y forma un enlace múltiple.'],
  combustion: ['combustión completa', 'Reacción con oxígeno suficiente en la que un compuesto orgánico da dióxido de carbono y agua.'],
  polimero: ['polímero', 'Molécula muy grande formada por la unión de muchas unidades pequeñas iguales o parecidas.'],
  monomero: ['monómero', 'Molécula pequeña que se une a otras para formar un polímero.'],
  condensacion: ['polimerización por condensación', 'Unión de monómeros en la que cada enlace nuevo libera una molécula pequeña, casi siempre agua.'],
  biomolecula: ['biomolécula', 'Molécula orgánica propia de los seres vivos: glúcidos, lípidos, proteínas y ácidos nucleicos.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionOr = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S201 = '20.1 Hydrocarbons'
export const RENG_S202 = '20.2 Alcohols and Ethers'
export const RENG_S203 = '20.3 Aldehydes, Ketones, Carboxylic Acids, and Esters'
export const RENG_S204 = '20.4 Amines and Amides'

export const RENG_PROCEDENCIA_OR_NOMBRES = rengDeclarada('Nombres sistemáticos según las recomendaciones de la IUPAC de 2013 (Favre y Powell, Nomenclature of Organic Chemistry, RSC 2014), que es la referencia registrada en el núcleo de la app para nombrar compuestos orgánicos; no se abrió de nuevo en esta entrega.')
export const RENG_PROCEDENCIA_OR_ESTRUCTURAS = rengSinVerificar('Estructuras, fórmulas y nombres de los compuestos citados: resultados habituales de los libros de texto, recordados. Las pruebas comparan cada fórmula con la de la molécula construida con el motor de estructuras de la app, pero ninguna fuente se abrió en esta entrega.')
export const RENG_PROCEDENCIA_OR_TABLAS = rengSinVerificar('Puntos de ebullición, número de isómeros y datos de uso de los compuestos citados: valores de tablas de libros de texto recordados, no contrastados en esta entrega.')

export const rengEscenaHidrocarburo = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'hidrocarburo', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena da la fórmula molecular, no la estructura: una misma fórmula puede corresponder a varios isómeros.' })
export const rengEscenaFamilia = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'familia-organica', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena solo describe compuestos saturados de cadena abierta con un único grupo funcional.' })
export const rengEscenaPolimero = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'polimero', valores: rengValores, instruccion: rengInstruccion, limite: 'Todas las cadenas de la escena tienen la misma longitud; un polímero real es una mezcla de cadenas distintas.' })
