import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengDeclarada, rengSinVerificar } from '../procedencia'
import type { RengEscenaLeccionN1, RengExplorarN1, RengProcedenciaN1 } from '../tipos'
import { RENG_SIN_VERIFICAR_TENDENCIAS } from '../../../escenas-n1/modelos/tendencias-periodicas'

export const RENG_G3 = {
  tabla: ['tabla periódica', 'Ordenación de los elementos por número atómico creciente en filas (periodos) y columnas (grupos) que agrupa los de propiedades parecidas.'],
  leyPeriodica: ['ley periódica', 'Las propiedades de los elementos se repiten de forma periódica cuando se ordenan por su número atómico.'],
  grupo: ['grupo', 'Columna de la tabla periódica; sus elementos tienen la misma configuración de valencia y propiedades parecidas.'],
  periodo: ['periodo', 'Fila de la tabla periódica; sus elementos tienen el mismo número de capas electrónicas ocupadas.'],
  bloque: ['bloque', 'Zona de la tabla definida por el subnivel (s, p, d o f) que recibe el último electrón.'],
  metal: ['metal', 'Elemento que conduce bien el calor y la electricidad, tiene brillo y tiende a perder electrones formando cationes.'],
  noMetal: ['no metal', 'Elemento que conduce mal la electricidad y tiende a ganar o compartir electrones.'],
  metaloide: ['metaloide', 'Elemento de propiedades intermedias entre metales y no metales; muchos son semiconductores.'],
  alcalino: ['metal alcalino', 'Elemento del grupo 1 (salvo el hidrógeno): metal blando y muy reactivo con un electrón de valencia.'],
  alcalinoterreo: ['metal alcalinotérreo', 'Elemento del grupo 2: metal reactivo con dos electrones de valencia que forma iones 2+.'],
  halogeno: ['halógeno', 'Elemento del grupo 17: no metal muy reactivo con siete electrones de valencia que forma iones 1−.'],
  gasNoble: ['gas noble', 'Elemento del grupo 18: gas monoatómico muy poco reactivo con la capa de valencia completa.'],
  transicion: ['metal de transición', 'Elemento del bloque d (grupos 3 a 12): metal con varios estados de oxidación y compuestos coloreados.'],
  lantanido: ['lantánido', 'Elemento de la primera fila del bloque f (del lantano al lutecio), en el que se llena el subnivel 4f.'],
  actinido: ['actínido', 'Elemento de la segunda fila del bloque f (del actinio al lawrencio); todos son radiactivos.'],
  radioAtomico: ['radio atómico', 'Medida del tamaño de un átomo; suele tomarse como la mitad de la distancia entre dos núcleos vecinos iguales.'],
  radioIonico: ['radio iónico', 'Tamaño asignado a un ion en un cristal; los cationes son menores que su átomo y los aniones, mayores.'],
  ionizacion: ['energía de ionización', 'Energía mínima necesaria para arrancar un electrón de un átomo aislado en fase gas.'],
  afinidad: ['afinidad electrónica', 'Energía que se intercambia cuando un átomo aislado en fase gas capta un electrón.'],
  electronegatividad: ['electronegatividad', 'Tendencia de un átomo a atraer hacia sí los electrones de un enlace; la escala más usada es la de Pauling.'],
  caracterMetalico: ['carácter metálico', 'Facilidad de un elemento para perder electrones y comportarse como un metal.'],
  oxidacion: ['estado de oxidación', 'Carga que tendría un átomo si los electrones de sus enlaces se asignaran al átomo más electronegativo.'],
  cargaEfectiva: ['carga nuclear efectiva', 'Carga positiva neta que siente un electrón externo: la del núcleo menos el apantallamiento de los electrones internos.'],
  isoelectronico: ['especies isoelectrónicas', 'Átomos o iones distintos que tienen el mismo número de electrones.'],
  apantallamiento: ['apantallamiento', 'Reducción de la atracción del núcleo sobre un electrón externo causada por los electrones internos.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionTp = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S25T = '2.5 The Periodic Table'
export const RENG_S64T = '6.4 Electronic Structure of Atoms (Electron Configurations)'
export const RENG_S65T = '6.5 Periodic Variations in Element Properties'
export const RENG_S181T = '18.1 Periodicity'
export const RENG_S191T = '19.1 Occurrence, Preparation, and Properties of Transition Metals and Their Compounds'

export const RENG_PROCEDENCIA_TENDENCIAS = rengSinVerificar(RENG_SIN_VERIFICAR_TENDENCIAS)
export const RENG_PROCEDENCIA_PUBCHEM = rengDeclarada('Electronegatividades de Pauling y estados de oxidación tabulados: datos de PubChem guardados en la tabla periódica de la app, no abiertos de nuevo en esta entrega.')
export const RENG_PROCEDENCIA_HISTORIA = rengSinVerificar('Fechas y datos históricos (Döbereiner 1829, Newlands 1864, Mendeléiev 1869, Moseley 1913; 63 elementos conocidos en 1869 y 118 hoy; propiedades predichas del eka-silicio): datos de uso común recordados, no contrastados en esta entrega.')

export const rengEscenaTendencias = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'tendencias-periodicas', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena solo incluye los elementos representativos de los periodos 2 a 5 y sus tendencias tienen excepciones.' })
export const rengEscenaConfigTp = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'config-electronica', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena muestra átomos neutros en el estado fundamental hasta Z = 36; no muestra iones ni estados excitados.' })
export const rengEscenaAtomoTp = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'atomo', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena cuenta partículas; no calcula radios ni decide qué iones son estables.' })
export const rengTablaTp = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'tabla-periodica', sub: '', nombre: 'Tabla periódica', instruccion: rengInstruccion, limite: 'La tabla muestra categoría, configuración, electronegatividad y estados de oxidación; no muestra radios ni energías de ionización.' })
