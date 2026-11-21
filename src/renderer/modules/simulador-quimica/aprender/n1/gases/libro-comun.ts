import type { RengEspecLeccionN1, RengPreguntaEspecN1 } from '../constructor'
import type { RengEscenaLeccionN1 } from '../tipos'

export type RengTerminoEspec = readonly [termino: string, definicion: string]

export const RENG_G = {
  presion: ['presión', 'Fuerza perpendicular que se ejerce por unidad de área; en el SI se mide en pascales (1 Pa = 1 N/m²).'],
  densidad: ['densidad', 'Masa por unidad de volumen de una sustancia; en los gases se suele expresar en g/L.'],
  gas: ['gas', 'Estado de la materia sin forma ni volumen propios: ocupa todo el recipiente y se comprime con facilidad.'],
  compresibilidad: ['compresibilidad', 'Facilidad con la que el volumen de una sustancia disminuye al aumentar la presión; es grande en los gases y pequeña en líquidos y sólidos.'],
  pascal: ['pascal', 'Unidad de presión del SI: 1 Pa = 1 N/m². La presión atmosférica estándar vale 101 325 Pa.'],
  atmosfera: ['atmósfera estándar', 'Unidad de presión definida como 101 325 Pa, igual a 760 mmHg.'],
  manometro: ['manómetro', 'Instrumento que mide la presión de un gas, a menudo como diferencia respecto de la presión atmosférica.'],
  barometro: ['barómetro', 'Instrumento que mide la presión atmosférica; en el de mercurio, la altura de la columna indica la presión.'],
  presionAtmosferica: ['presión atmosférica', 'Presión que ejerce el aire sobre las superficies por el peso de la columna de aire que tienen encima.'],
  manometrica: ['presión manométrica', 'Presión medida por encima de la atmosférica; la presión absoluta es la manométrica más la atmosférica.'],
  isoterma: ['isoterma', 'Curva que relaciona presión y volumen de un gas a temperatura constante.'],
  inversa: ['proporcionalidad inversa', 'Relación entre dos magnitudes cuyo producto es constante: si una se duplica, la otra se reduce a la mitad.'],
  kelvin: ['temperatura absoluta', 'Temperatura medida en kelvin desde el cero absoluto: T = t + 273,15 con t en grados Celsius.'],
  ceroAbsoluto: ['cero absoluto', 'Temperatura de 0 K (−273,15 °C), límite inferior de la escala absoluta; el modelo ideal predice ahí volumen o presión nulos.'],
  isobarico: ['proceso isobárico', 'Cambio de estado de un gas a presión constante.'],
  isocorico: ['proceso isocórico', 'Cambio de estado de un gas a volumen constante, por ejemplo en un recipiente rígido.'],
  mol: ['mol', 'Cantidad de sustancia que contiene 6,02214076·10²³ entidades (número de Avogadro).'],
  volumenCombinacion: ['volúmenes de combinación', 'Proporción sencilla en que reaccionan los gases medidos en las mismas condiciones; coincide con la de los coeficientes de la ecuación.'],
  estado: ['estado de un gas', 'Conjunto de valores de presión, volumen, temperatura y cantidad que describen una muestra de gas en equilibrio.'],
  gasIdeal: ['gas ideal', 'Modelo de gas de moléculas puntuales que no se atraen ni se repelen y chocan de forma elástica; cumple P·V = n·R·T.'],
  constanteR: ['constante de los gases R', 'Constante de la ecuación de estado del gas ideal: 8,314 J/(mol·K), igual a 0,08206 L·atm/(mol·K).'],
  masaMolar: ['masa molar', 'Masa de un mol de una sustancia, en g/mol.'],
  fraccionMolar: ['fracción molar', 'Cociente entre los moles de un componente y los moles totales de la mezcla; no tiene unidades y todas suman 1.'],
  presionParcial: ['presión parcial', 'Presión que ejercería un componente de una mezcla de gases si ocupara solo todo el volumen a la misma temperatura.'],
  presionVapor: ['presión de vapor', 'Presión parcial del vapor de un líquido en equilibrio con él; depende de la temperatura.'],
  volumenMolar: ['volumen molar', 'Volumen que ocupa un mol de gas en unas condiciones dadas: V_m = V/n = R·T/P para el gas ideal.'],
  avogadroNumero: ['número de Avogadro', 'Número de entidades en un mol: N_A = 6,02214076·10²³ mol⁻¹, valor exacto en el SI.'],
  energiaCinetica: ['energía cinética de traslación', 'Energía del movimiento de las moléculas de un lugar a otro; su media en un gas ideal es (3/2)·k_B·T por molécula.'],
  boltzmann: ['constante de Boltzmann', 'Constante k_B = 1,380649·10⁻²³ J/K, valor exacto en el SI; R = N_A·k_B.'],
  urms: ['velocidad cuadrática media', 'Raíz cuadrada de la media de los cuadrados de las velocidades moleculares: u_rms = √(3·R·T/M).'],
  distribucion: ['distribución de velocidades', 'Forma en que se reparten las velocidades entre las moléculas de un gas; en el gas ideal es la distribución de Maxwell-Boltzmann.'],
  difusion: ['difusión', 'Mezcla progresiva de un gas con otro por el movimiento desordenado de sus moléculas.'],
  efusion: ['efusión', 'Paso de un gas a través de un orificio diminuto hacia el vacío, molécula a molécula.'],
  graham: ['ley de Graham', 'A igual presión y temperatura, la velocidad de efusión de un gas es inversamente proporcional a la raíz cuadrada de su masa molar.'],
  compresibilidadZ: ['factor de compresibilidad', 'Cociente Z = P·V/(n·R·T); vale 1 para el gas ideal y se aparta de 1 en un gas real.'],
  vanDerWaals: ['ecuación de van der Waals', 'Ecuación de estado aproximada que corrige el gas ideal con un término de atracción (a) y otro de volumen propio de las moléculas (b).']
} as const satisfies Record<string, RengTerminoEspec>

export const rengPreg = (rengPregunta: string, ...rengOpciones: Array<readonly [string, boolean, string]>): RengPreguntaEspecN1 => ({ pregunta: rengPregunta, opciones: rengOpciones })

export interface RengLibroGas {
  objetivosMas: readonly string[]
  porQueImporta: string
  analogia: string
  analogiaLimite: string
  correccion: string
  errores: ReadonlyArray<readonly [string, string]>
  ejemplo2: string
  figuras: readonly string[]
  resumen: readonly string[]
  glosario: readonly RengTerminoEspec[]
  comprobar: readonly RengPreguntaEspecN1[]
  anterior: string | null
  siguiente: string | null
  prerrequisitos: readonly string[]
  escena?: RengEscenaLeccionN1
}

export type RengEspecGasAntigua = Omit<RengEspecLeccionN1, 'objetivosMas' | 'porQueImporta' | 'analogia' | 'analogiaLimite' | 'errores' | 'ejemplos' | 'figuras' | 'resumen' | 'glosario' | 'comprobar' | 'anterior' | 'siguiente' | 'prerrequisitos' | 'escena'> & { error: string; ejemplo: string }

export function rengFusionarLibroGas(rengE: RengEspecGasAntigua, rengL: RengLibroGas): RengEspecLeccionN1 {
  const { error: rengError, ejemplo: rengEjemplo, ...rengResto } = rengE
  return {
    ...rengResto,
    objetivosMas: rengL.objetivosMas,
    porQueImporta: rengL.porQueImporta,
    analogia: rengL.analogia,
    analogiaLimite: rengL.analogiaLimite,
    errores: [[rengError, rengL.correccion], ...rengL.errores],
    ejemplos: [rengEjemplo, rengL.ejemplo2],
    figuras: rengL.figuras,
    resumen: rengL.resumen,
    glosario: rengL.glosario,
    comprobar: rengL.comprobar,
    anterior: rengL.anterior,
    siguiente: rengL.siguiente,
    prerrequisitos: rengL.prerrequisitos,
    ...(rengL.escena ? { escena: rengL.escena } : {})
  }
}

const RENG_LIMITE_ESCENA = 'La escena calcula un gas ideal en equilibrio: no muestra cómo se llega de un estado a otro, ni mezclas, ni el comportamiento de un gas real a presión alta o cerca de licuarse.'

export const rengEscenaGas = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'gas-ideal', valores: rengValores, instruccion: rengInstruccion, limite: RENG_LIMITE_ESCENA })
