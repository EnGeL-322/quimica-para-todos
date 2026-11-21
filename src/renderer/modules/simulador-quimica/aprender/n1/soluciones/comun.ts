import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengSinVerificar } from '../procedencia'
import type { RengProcedenciaN1 } from '../tipos'

export const RENG_G9 = {
  disolucion: ['disolución', 'Mezcla homogénea de dos o más sustancias; en ella no se distinguen las partes ni a simple vista ni al microscopio.'],
  soluto: ['soluto', 'Componente de una disolución que se considera disuelto; suele ser el que está en menor cantidad.'],
  disolvente: ['disolvente', 'Componente de una disolución en el que se disuelve el soluto; suele ser el que está en mayor cantidad y fija su estado físico.'],
  electrolito: ['electrolito', 'Sustancia que al disolverse produce iones y hace que la disolución conduzca la corriente eléctrica.'],
  noElectrolito: ['no electrolito', 'Sustancia que se disuelve como moléculas sin formar iones; su disolución no conduce la corriente.'],
  solubilidad: ['solubilidad', 'Máxima cantidad de soluto que se disuelve en una cantidad dada de disolvente a una temperatura dada; aquí, en g por 100 g de agua o en mol/L.'],
  henry: ['ley de Henry', 'A temperatura constante, la concentración de un gas disuelto es proporcional a su presión parcial sobre el líquido: c = k·p.'],
  saturada: ['disolución saturada', 'Disolución que contiene la máxima cantidad de soluto disuelto a esa temperatura; en contacto con el sólido, está en equilibrio.'],
  insaturada: ['disolución insaturada', 'Disolución que contiene menos soluto del que podría disolver a esa temperatura.'],
  sobresaturada: ['disolución sobresaturada', 'Disolución inestable que contiene más soluto disuelto que el de saturación; cristaliza al añadir un cristal o al agitarla.'],
  cristalizacion: ['cristalización', 'Formación de un sólido cristalino a partir de una disolución cuando el soluto supera su solubilidad.'],
  pmm: ['porcentaje en masa', 'Masa de soluto por cada 100 g de disolución: % m/m = m_soluto / m_disolución × 100.'],
  pvv: ['porcentaje en volumen', 'Volumen de soluto por cada 100 mL de disolución: % v/v = V_soluto / V_disolución × 100.'],
  pmv: ['porcentaje masa-volumen', 'Gramos de soluto por cada 100 mL de disolución: % m/v = m_soluto (g) / V_disolución (mL) × 100.'],
  molaridad: ['molaridad', 'Moles de soluto por litro de disolución: c = n / V, en mol/L.'],
  molalidad: ['molalidad', 'Moles de soluto por kilogramo de disolvente: b = n / m_disolvente, en mol/kg; no depende de la temperatura.'],
  fraccionMolar: ['fracción molar', 'Cociente entre los moles de un componente y los moles totales de la mezcla; no tiene unidades y todas suman 1.'],
  equivalente: ['equivalente', 'Cantidad de una sustancia que aporta o acepta un mol de unidades reactivas (por ejemplo, de H⁺ o de OH⁻) en una reacción concreta.'],
  normalidad: ['normalidad', 'Equivalentes de soluto por litro de disolución: N = c · (equivalentes por mol).'],
  ppm: ['partes por millón', 'Masa de soluto por cada millón de partes de masa de disolución: 1 ppm = 1 mg/kg.'],
  ppb: ['partes por mil millones', 'Masa de soluto por cada mil millones de partes de masa de disolución: 1 ppb = 1 µg/kg.'],
  dilucion: ['dilución', 'Proceso de añadir disolvente a una disolución: la cantidad de soluto no cambia y la concentración baja: c₁·V₁ = c₂·V₂.'],
  alicuota: ['alícuota', 'Volumen medido con exactitud que se toma de una disolución para usarlo o diluirlo.'],
  factorDilucion: ['factor de dilución', 'Cociente entre el volumen final y el inicial de una dilución; la concentración se divide por ese factor.'],
  disolucionMadre: ['disolución madre', 'Disolución concentrada de concentración conocida a partir de la cual se preparan otras por dilución.'],
  aforo: ['enrasar', 'Completar con disolvente un matraz aforado hasta la marca, de modo que el volumen final es el nominal del matraz.'],
  coligativa: ['propiedad coligativa', 'Propiedad de una disolución que depende del número de partículas de soluto y no de su naturaleza, como el descenso del punto de congelación.'],
  vantHoff: ['factor de van \'t Hoff', 'Número de partículas que produce en disolución cada fórmula de soluto; en el modelo ideal, 1 para no electrolitos y el número de iones para electrolitos fuertes.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionSol = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S33 = '3.3 Molarity'
export const RENG_S34 = '3.4 Other Units for Solution Concentrations'
export const RENG_S111 = '11.1 The Dissolution Process'
export const RENG_S112 = '11.2 Electrolytes'
export const RENG_S113 = '11.3 Solubility'
export const RENG_S114 = '11.4 Colligative Properties'

export const RENG_SOLUBILIDAD_A = (rengT: number): number => 30 + 0.4 * rengT
export const RENG_SOLUBILIDAD_B = (rengT: number): number => 12 + 0.9 * rengT + 0.006 * rengT * rengT
export const RENG_KF_DIDACTICO = 1.86
