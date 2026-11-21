import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengDeclarada, rengSinVerificar } from '../procedencia'
import type { RengEscenaLeccionN1, RengExplorarN1, RengProcedenciaN1 } from '../tipos'
import { RENG_FUENTE_EN } from '../../../nucleo/electronegatividad'

export const RENG_G4 = {
  valencia: ['electrones de valencia', 'Electrones de la capa más externa de un átomo, que son los que participan en los enlaces.'],
  octeto: ['regla del octeto', 'Tendencia de los átomos a rodearse de ocho electrones de valencia al enlazarse, como un gas noble.'],
  lewis: ['estructura de Lewis', 'Representación de una molécula con sus electrones de valencia como puntos (pares libres) y rayas (pares compartidos).'],
  parLibre: ['par libre', 'Par de electrones de valencia que pertenece a un solo átomo y no forma enlace.'],
  cargaFormal: ['carga formal', 'Carga asignada a un átomo en una estructura de Lewis repartiendo a medias los electrones de cada enlace.'],
  resonancia: ['resonancia', 'Descripción de una molécula mediante varias estructuras de Lewis equivalentes cuya mezcla representa la estructura real.'],
  ionico: ['enlace iónico', 'Atracción electrostática entre iones de carga opuesta formados por transferencia de electrones.'],
  covalente: ['enlace covalente', 'Unión entre dos átomos que comparten uno o más pares de electrones.'],
  coordinado: ['enlace covalente coordinado', 'Enlace covalente en el que los dos electrones compartidos proceden del mismo átomo; también se llama dativo.'],
  metalico: ['enlace metálico', 'Unión de los metales: cationes ordenados en una red y electrones de valencia deslocalizados que se mueven entre ellos.'],
  polaridad: ['enlace polar', 'Enlace covalente en el que los electrones están desplazados hacia el átomo más electronegativo.'],
  dipolo: ['momento dipolar', 'Medida de la separación de cargas en un enlace o en una molécula; se expresa en debyes (D).'],
  geometria: ['geometría molecular', 'Disposición en el espacio de los átomos de una molécula.'],
  vsepr: ['teoría VSEPR', 'Modelo que predice la forma de una molécula suponiendo que los pares de electrones del átomo central se repelen y se alejan al máximo.'],
  dominio: ['dominio electrónico', 'Región de electrones alrededor del átomo central: un par libre o un enlace, sea sencillo, doble o triple.'],
  hibridacion: ['hibridación', 'Modelo en el que los orbitales de un átomo se combinan para formar orbitales nuevos, equivalentes y orientados.'],
  sigma: ['enlace σ', 'Enlace covalente formado por solapamiento frontal de orbitales, con la densidad electrónica sobre el eje que une los núcleos.'],
  pi: ['enlace π', 'Enlace covalente formado por solapamiento lateral de dos orbitales p, con la densidad por encima y por debajo del eje.'],
  london: ['fuerzas de dispersión de London', 'Atracciones débiles entre todas las moléculas, debidas a dipolos instantáneos de sus nubes electrónicas.'],
  dipoloDipolo: ['interacción dipolo-dipolo', 'Atracción entre los extremos de carga opuesta de moléculas polares vecinas.'],
  puenteH: ['enlace de hidrógeno', 'Atracción entre un hidrógeno unido a N, O o F y un par libre de otro átomo de N, O o F.'],
  intermolecular: ['fuerzas intermoleculares', 'Atracciones entre moléculas, mucho más débiles que los enlaces que unen los átomos dentro de ellas.'],
  energiaEnlace: ['energía de enlace', 'Energía necesaria para romper un mol de enlaces de un tipo en fase gas.'],
  longitudEnlace: ['longitud de enlace', 'Distancia entre los núcleos de dos átomos enlazados.'],
  ordenEnlace: ['orden de enlace', 'Número de pares de electrones que unen dos átomos: 1 en un enlace sencillo, 2 en uno doble y 3 en uno triple.'],
  orbitalMolecular: ['orbital molecular', 'Orbital que se extiende por toda la molécula y resulta de combinar orbitales atómicos.'],
  antienlazante: ['orbital antienlazante', 'Orbital molecular de mayor energía que los orbitales atómicos de partida; sus electrones debilitan el enlace.'],
  energiaRed: ['energía de red', 'Energía que se libera al formarse un mol de sólido iónico a partir de sus iones gaseosos.'],
  electronegatividad: ['electronegatividad', 'Tendencia de un átomo a atraer hacia sí los electrones de un enlace.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionEn = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S71E = '7.1 Ionic Bonding'
export const RENG_S72E = '7.2 Covalent Bonding'
export const RENG_S73E = '7.3 Lewis Symbols and Structures'
export const RENG_S74E = '7.4 Formal Charges and Resonance'
export const RENG_S75E = '7.5 Strengths of Ionic and Covalent Bonds'
export const RENG_S76E = '7.6 Molecular Structure and Polarity'
export const RENG_S81E = '8.1 Valence Bond Theory'
export const RENG_S82E = '8.2 Hybrid Atomic Orbitals'
export const RENG_S83E = '8.3 Multiple Bonds'
export const RENG_S84E = '8.4 Molecular Orbital Theory'
export const RENG_S101E = '10.1 Intermolecular Forces'
export const RENG_S105E = '10.5 The Solid State of Matter'

export const RENG_PROCEDENCIA_EN_NUCLEO = rengDeclarada(`Electronegatividades: ${RENG_FUENTE_EN} (datos del núcleo de la app, no abiertos de nuevo en esta entrega).`)
export const RENG_PROCEDENCIA_ENLACE_NUCLEO = rengDeclarada('Longitudes y energías de moléculas diatómicas (Huber y Herzberg, vía NIST), geometrías (NIST CCCBDB), energías de interacción, puntos de ebullición y parámetros de red (CRC Handbook y artículos citados en el núcleo): datos guardados en la app con su fuente, no abiertos de nuevo en esta entrega.')
export const RENG_PROCEDENCIA_LEWIS = rengSinVerificar('Estructuras de Lewis, formas VSEPR, recuentos de enlaces σ y π y ocupaciones de orbitales moleculares de las especies citadas: resultados habituales de los libros de texto, recordados y no contrastados en esta entrega.')
export const RENG_PROCEDENCIA_TABLAS_ENLACE = rengSinVerificar('Energías medias de enlace, momentos dipolares, puntos de ebullición y entalpías de vaporización que no proceden del núcleo: valores de tablas de libros de texto recordados, no contrastados en esta entrega.')

export const rengEscenaCargaFormal = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'carga-formal', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena hace la contabilidad de un solo átomo; no comprueba que la estructura completa sea posible.' })
export const rengEscenaPolaridad = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'polaridad-enlace', valores: rengValores, instruccion: rengInstruccion, limite: 'Los límites entre tipos de enlace y el momento dipolar estimado son aproximaciones orientativas.' })
export const rengEscenaVsepr = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'geometria-vsepr', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena da ángulos ideales; los pares libres cierran algo los ángulos reales.' })
export const rengEscenaInteraccion = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'interaccion-molecular', valores: rengValores, instruccion: rengInstruccion, limite: 'El modelo trata dos partículas esféricas; no tiene en cuenta la orientación de las moléculas.' })
export const rengEscenaOrden = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'orden-enlace', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena no construye el diagrama de orbitales: los electrones de cada tipo los eliges tú.' })
export const rengMesaEn = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'enlaces', nombre: 'Mesa molecular · Enlaces', instruccion: rengInstruccion, limite: 'Las secuencias de la Mesa muestran casos concretos ya preparados; no admiten cualquier molécula.' })
