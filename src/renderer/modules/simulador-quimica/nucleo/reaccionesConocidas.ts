import { rengAnalizarFormula } from './formula'
import { rengClaveIdentidad } from './identidad'

const RENG_GE = 'N. N. Greenwood y A. Earnshaw, Chemistry of the Elements, 2.ª ed. (1997)'
const RENG_PETRUCCI = 'R. H. Petrucci et al., Química General, 10.ª ed. (Pearson, 2011)'

export interface RengEspecie {
  formula: string
  coef: number
  entrada: string
  ident: string
}

export interface RengReaccionConocida {
  id: string
  nombre: string
  reactivos: RengEspecie[]
  productos: RengEspecie[]
  catalizador?: { acepta: string[]; texto: string }
  condiciones: string
  observable: string
  fuente: string
}

const rengE = (rengFormula: string, rengCoef: number, rengEntrada = rengFormula, rengIdent = rengFormula): RengEspecie => ({ formula: rengFormula, coef: rengCoef, entrada: rengEntrada, ident: rengIdent })

export const RENG_REACCIONES: RengReaccionConocida[] = [
  { id: 'na-agua', nombre: 'Sodio con agua', reactivos: [rengE('Na', 2), rengE('H2O', 2)], productos: [rengE('NaOH', 2, '[Na+].[OH-]', 'NaOH'), rengE('H2', 1, '[H][H]')], condiciones: 'Temperatura ambiente; muy exotérmica.', observable: 'El sodio flota, se funde y desprende burbujas de hidrógeno.', fuente: `${RENG_GE}, cap. 4 (metales alcalinos)` },
  { id: 'na-cloro', nombre: 'Síntesis del cloruro de sodio', reactivos: [rengE('Na', 2), rengE('Cl2', 1)], productos: [rengE('NaCl', 2)], condiciones: 'Al calentar el sodio en cloro; muy exotérmica.', observable: 'Llama amarilla brillante y un sólido blanco.', fuente: `${RENG_GE}, cap. 4` },
  { id: 'h2-o2', nombre: 'Formación del agua', reactivos: [rengE('H2', 2), rengE('O2', 1)], productos: [rengE('H2O', 2)], condiciones: 'Necesita una chispa o llama para empezar; explosiva en mezcla.', observable: 'Llama casi invisible y vapor de agua.', fuente: `${RENG_PETRUCCI}, cap. 4` },
  { id: 'ch4-o2', nombre: 'Combustión del metano', reactivos: [rengE('CH4', 1, 'CH4', 'CH4'), rengE('O2', 2)], productos: [rengE('CO2', 1), rengE('H2O', 2)], condiciones: 'Necesita ignición; con oxígeno suficiente.', observable: 'Llama azul; desprende calor.', fuente: `${RENG_PETRUCCI}, cap. 4` },
  { id: 'h2-cl2', nombre: 'Síntesis del cloruro de hidrógeno', reactivos: [rengE('H2', 1), rengE('Cl2', 1)], productos: [rengE('HCl', 2)], condiciones: 'Con luz o calor (reacción en cadena).', observable: 'Gas incoloro que humea en aire húmedo.', fuente: `${RENG_GE}, cap. 17 (halógenos)` },
  { id: 'n2-h2', nombre: 'Síntesis del amoniaco (Haber–Bosch)', reactivos: [rengE('N2', 1), rengE('H2', 3)], productos: [rengE('NH3', 2)], catalizador: { acepta: ['Fe', 'hierro'], texto: 'hierro (Fe)' }, condiciones: 'Catalizador de hierro, alta presión y unos 700 K.', observable: 'Gas de olor picante.', fuente: `${RENG_GE}, cap. 11 (nitrógeno)` },
  { id: 'hcl-naoh', nombre: 'Neutralización', reactivos: [rengE('HCl', 1), rengE('NaOH', 1, '[Na+].[OH-]', 'NaOH')], productos: [rengE('NaCl', 1), rengE('H2O', 1)], condiciones: 'En disolución acuosa.', observable: 'Se calienta ligeramente. El pH final depende de las cantidades: solo con cantidades equivalentes de ácido y base (a 25 °C) queda en 7; con exceso de uno de los dos, no. Para calcularlo, usa Experimentos → Mezcla ácido–base con volúmenes y concentraciones.', fuente: `${RENG_PETRUCCI}, cap. 5` },
  { id: 'acetico-naoh', nombre: 'Neutralización del ácido acético', reactivos: [rengE('C2H4O2', 1, 'CH3COOH', 'CC(=O)O'), rengE('NaOH', 1, '[Na+].[OH-]', 'NaOH')], productos: [rengE('C2H3NaO2', 1, 'CC(=O)[O-].[Na+]'), rengE('H2O', 1)], condiciones: 'En disolución acuosa.', observable: 'Sin cambio visible; se forma acetato de sodio.', fuente: `${RENG_PETRUCCI}, cap. 17` },
  { id: 'eteno-h2', nombre: 'Hidrogenación del eteno', reactivos: [rengE('C2H4', 1, 'C2H4', 'C=C'), rengE('H2', 1)], productos: [rengE('C2H6', 1, 'CC')], catalizador: { acepta: ['Pt', 'Pd', 'Ni', 'platino', 'paladio', 'níquel'], texto: 'Pt, Pd o Ni' }, condiciones: 'Catalizador metálico (Pt, Pd o Ni).', observable: 'Gas incoloro (etano).', fuente: 'J. Clayden et al., Organic Chemistry, 2.ª ed. (OUP, 2012), cap. 23' },
  { id: 'mg-o2', nombre: 'Combustión del magnesio', reactivos: [rengE('Mg', 2), rengE('O2', 1)], productos: [rengE('MgO', 2)], condiciones: 'Al encenderlo en aire.', observable: 'Luz blanca muy intensa; polvo blanco.', fuente: `${RENG_GE}, cap. 5` }
]

export function rengClaveComposicion(rengFormula: string): string {
  try {
    const rengAt = rengAnalizarFormula(rengFormula.replace(/^\[|\]$/g, '')).atomos
    return [...rengAt.entries()].sort(([rengA], [rengB]) => rengA.localeCompare(rengB)).map(([rengEl, rengN]) => `${rengEl}:${rengN}`).join(',')
  } catch {
    return rengFormula
  }
}

const RENG_IDENTIDAD_CATALOGO = new Map<string, string | null>()
export function rengIdentidadDeEspecie(rengSp: RengEspecie): string | null {
  if (!RENG_IDENTIDAD_CATALOGO.has(rengSp.ident)) RENG_IDENTIDAD_CATALOGO.set(rengSp.ident, rengClaveIdentidad(rengSp.ident))
  return RENG_IDENTIDAD_CATALOGO.get(rengSp.ident)!
}

export type RengCoincidencia =
  | { tipo: 'conocida'; r: RengReaccionConocida; faltaCatalizador: boolean }
  | { tipo: 'ninguna'; motivo: string; causa: 'sin-reactivos' | 'falta-identidad' | 'sin-datos' }

export const RENG_MOTIVO_SIN_DATOS =
  'Sin datos o modelo para predecirla: la app no tiene esta reacción en su catálogo ni una regla educativa para estos reactivos. Eso no significa que no pueda ocurrir; solo que aquí no se puede predecir.'

export function rengBuscarReaccion(rengIdentidades: ReadonlyArray<string | null>, rengCatalizador: string): RengCoincidencia {
  if (rengIdentidades.length === 0) return { tipo: 'ninguna', motivo: 'Elige al menos un reactivo.', causa: 'sin-reactivos' }
  if (rengIdentidades.some((rengI) => rengI === null)) return { tipo: 'ninguna', motivo: 'Falta identificar la estructura de algún reactivo (fórmula ambigua, fragmento incompleto o texto no válido): sin saber qué sustancia es no se puede buscar su reacción.', causa: 'falta-identidad' }
  const rengPedidas = [...new Set(rengIdentidades as string[])].sort()
  const rengR = RENG_REACCIONES.find((rengX) => {
    const rengSuyas = rengX.reactivos.map(rengIdentidadDeEspecie)
    if (rengSuyas.some((rengK) => rengK === null)) return false
    const rengUnicas = [...new Set(rengSuyas as string[])].sort()
    return rengUnicas.length === rengPedidas.length && rengUnicas.every((rengK, rengI) => rengK === rengPedidas[rengI])
  })
  if (!rengR) return { tipo: 'ninguna', motivo: RENG_MOTIVO_SIN_DATOS, causa: 'sin-datos' }
  const rengCat = rengCatalizador.trim().toLowerCase()
  const rengFaltaCatalizador = !!rengR.catalizador && !rengR.catalizador.acepta.some((rengA) => rengA.toLowerCase() === rengCat)
  return { tipo: 'conocida', r: rengR, faltaCatalizador: rengFaltaCatalizador }
}
