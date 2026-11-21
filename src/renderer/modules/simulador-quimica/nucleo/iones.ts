export const RENG_FUENTE_IUPAC = 'IUPAC, Nomenclatura de Química Inorgánica, Recomendaciones de 2005 («Libro Rojo», ed. española 2007)'
export const RENG_FUENTE_TRADICIONAL = 'W. R. Peterson, Formulación y nomenclatura química inorgánica (Edunsa): nomenclatura tradicional'

export type RengTipoAnion = 'monoatomico' | 'peroxido' | 'hidroxido' | 'oxoanion' | 'hidrogenoanion'

export interface RengAnion {
  unidad: string
  carga: number
  tipo: RengTipoAnion
  central: string
  ox: number
  sal: string
  salTradicional?: string | null
  sistematica: string | null
  acido?: string
  fuente: string
}

const RENG_I = RENG_FUENTE_IUPAC

export const RENG_ANIONES_SIMPLES: RengAnion[] = [
  { unidad: 'F', carga: -1, tipo: 'monoatomico', central: 'F', ox: -1, sal: 'fluoruro', sistematica: 'fluoruro', acido: 'ácido fluorhídrico', fuente: RENG_I },
  { unidad: 'Cl', carga: -1, tipo: 'monoatomico', central: 'Cl', ox: -1, sal: 'cloruro', sistematica: 'cloruro', acido: 'ácido clorhídrico', fuente: RENG_I },
  { unidad: 'Br', carga: -1, tipo: 'monoatomico', central: 'Br', ox: -1, sal: 'bromuro', sistematica: 'bromuro', acido: 'ácido bromhídrico', fuente: RENG_I },
  { unidad: 'I', carga: -1, tipo: 'monoatomico', central: 'I', ox: -1, sal: 'yoduro', sistematica: 'yoduro', acido: 'ácido yodhídrico', fuente: RENG_I },
  { unidad: 'S', carga: -2, tipo: 'monoatomico', central: 'S', ox: -2, sal: 'sulfuro', sistematica: 'sulfuro', acido: 'ácido sulfhídrico', fuente: RENG_I },
  { unidad: 'Se', carga: -2, tipo: 'monoatomico', central: 'Se', ox: -2, sal: 'seleniuro', sistematica: 'seleniuro', acido: 'ácido selenhídrico', fuente: RENG_I },
  { unidad: 'Te', carga: -2, tipo: 'monoatomico', central: 'Te', ox: -2, sal: 'telururo', sistematica: 'telururo', acido: 'ácido telurhídrico', fuente: RENG_I },
  { unidad: 'N', carga: -3, tipo: 'monoatomico', central: 'N', ox: -3, sal: 'nitruro', sistematica: 'nitruro', fuente: RENG_I },
  { unidad: 'P', carga: -3, tipo: 'monoatomico', central: 'P', ox: -3, sal: 'fosfuro', sistematica: 'fosfuro', fuente: RENG_I },
  { unidad: 'H', carga: -1, tipo: 'monoatomico', central: 'H', ox: -1, sal: 'hidruro', sistematica: 'hidruro', fuente: RENG_I },
  { unidad: 'O', carga: -2, tipo: 'monoatomico', central: 'O', ox: -2, sal: 'óxido', sistematica: 'óxido', fuente: RENG_I },
  { unidad: 'O2', carga: -2, tipo: 'peroxido', central: 'O', ox: -1, sal: 'peróxido', sistematica: 'óxido', fuente: RENG_I },
  { unidad: 'OH', carga: -1, tipo: 'hidroxido', central: 'O', ox: -2, sal: 'hidróxido', sistematica: 'hidróxido', fuente: RENG_I }
]

export const RENG_OXOANIONES: RengAnion[] = [
  { unidad: 'ClO', carga: -1, tipo: 'oxoanion', central: 'Cl', ox: 1, sal: 'hipoclorito', sistematica: 'oxidoclorato', acido: 'ácido hipocloroso', fuente: RENG_I },
  { unidad: 'ClO2', carga: -1, tipo: 'oxoanion', central: 'Cl', ox: 3, sal: 'clorito', sistematica: 'dioxidoclorato', acido: 'ácido cloroso', fuente: RENG_I },
  { unidad: 'ClO3', carga: -1, tipo: 'oxoanion', central: 'Cl', ox: 5, sal: 'clorato', sistematica: 'trioxidoclorato', acido: 'ácido clórico', fuente: RENG_I },
  { unidad: 'ClO4', carga: -1, tipo: 'oxoanion', central: 'Cl', ox: 7, sal: 'perclorato', sistematica: 'tetraoxidoclorato', acido: 'ácido perclórico', fuente: RENG_I },
  { unidad: 'BrO3', carga: -1, tipo: 'oxoanion', central: 'Br', ox: 5, sal: 'bromato', sistematica: 'trioxidobromato', acido: 'ácido brómico', fuente: RENG_I },
  { unidad: 'IO3', carga: -1, tipo: 'oxoanion', central: 'I', ox: 5, sal: 'yodato', sistematica: 'trioxidoyodato', acido: 'ácido yódico', fuente: RENG_I },
  { unidad: 'IO4', carga: -1, tipo: 'oxoanion', central: 'I', ox: 7, sal: 'peryodato', sistematica: 'tetraoxidoyodato', acido: 'ácido peryódico', fuente: RENG_I },
  { unidad: 'NO2', carga: -1, tipo: 'oxoanion', central: 'N', ox: 3, sal: 'nitrito', sistematica: 'dioxidonitrato', acido: 'ácido nitroso', fuente: RENG_I },
  { unidad: 'NO3', carga: -1, tipo: 'oxoanion', central: 'N', ox: 5, sal: 'nitrato', sistematica: 'trioxidonitrato', acido: 'ácido nítrico', fuente: RENG_I },
  { unidad: 'SO3', carga: -2, tipo: 'oxoanion', central: 'S', ox: 4, sal: 'sulfito', sistematica: 'trioxidosulfato', acido: 'ácido sulfuroso', fuente: RENG_I },
  { unidad: 'SO4', carga: -2, tipo: 'oxoanion', central: 'S', ox: 6, sal: 'sulfato', sistematica: 'tetraoxidosulfato', acido: 'ácido sulfúrico', fuente: RENG_I },
  { unidad: 'S2O3', carga: -2, tipo: 'oxoanion', central: 'S', ox: 2, sal: 'tiosulfato', sistematica: null, acido: 'ácido tiosulfúrico', fuente: RENG_I },
  { unidad: 'PO4', carga: -3, tipo: 'oxoanion', central: 'P', ox: 5, sal: 'fosfato', sistematica: 'tetraoxidofosfato', acido: 'ácido fosfórico', fuente: RENG_I },
  { unidad: 'CO3', carga: -2, tipo: 'oxoanion', central: 'C', ox: 4, sal: 'carbonato', sistematica: 'trioxidocarbonato', acido: 'ácido carbónico', fuente: RENG_I },
  { unidad: 'SiO4', carga: -4, tipo: 'oxoanion', central: 'Si', ox: 4, sal: 'silicato', sistematica: 'tetraoxidosilicato', acido: 'ácido silícico', fuente: RENG_I },
  { unidad: 'CrO4', carga: -2, tipo: 'oxoanion', central: 'Cr', ox: 6, sal: 'cromato', sistematica: 'tetraoxidocromato', acido: 'ácido crómico', fuente: RENG_I },
  { unidad: 'Cr2O7', carga: -2, tipo: 'oxoanion', central: 'Cr', ox: 6, sal: 'dicromato', sistematica: null, acido: 'ácido dicrómico', fuente: RENG_I },
  { unidad: 'MnO4', carga: -1, tipo: 'oxoanion', central: 'Mn', ox: 7, sal: 'permanganato', sistematica: 'tetraoxidomanganato', acido: 'ácido permangánico', fuente: RENG_I },
  { unidad: 'MnO4', carga: -2, tipo: 'oxoanion', central: 'Mn', ox: 6, sal: 'manganato', sistematica: 'tetraoxidomanganato', acido: 'ácido mangánico', fuente: RENG_I },
  { unidad: 'HCO3', carga: -1, tipo: 'hidrogenoanion', central: 'C', ox: 4, sal: 'hidrogenocarbonato', salTradicional: 'bicarbonato', sistematica: 'hidrogeno(trioxidocarbonato)', fuente: RENG_I },
  { unidad: 'HSO4', carga: -1, tipo: 'hidrogenoanion', central: 'S', ox: 6, sal: 'hidrogenosulfato', salTradicional: 'bisulfato', sistematica: 'hidrogeno(tetraoxidosulfato)', fuente: RENG_I },
  { unidad: 'HPO4', carga: -2, tipo: 'hidrogenoanion', central: 'P', ox: 5, sal: 'hidrogenofosfato', salTradicional: null, sistematica: 'hidrogeno(tetraoxidofosfato)', fuente: RENG_I },
  { unidad: 'H2PO4', carga: -1, tipo: 'hidrogenoanion', central: 'P', ox: 5, sal: 'dihidrogenofosfato', salTradicional: null, sistematica: 'dihidrogeno(tetraoxidofosfato)', fuente: RENG_I }
]

export const RENG_ANIONES: RengAnion[] = [...RENG_ANIONES_SIMPLES, ...RENG_OXOANIONES]

export interface RengCationPoliatomico {
  unidad: string
  carga: number
  el: string
  ox: number
  stock: string
  tradicional: string | null
  adjetivo: string | null
  sistematica: string
  enComposicion: string
  fuente: string
}

export const RENG_CATIONES_POLIATOMICOS: RengCationPoliatomico[] = [
  { unidad: 'NH4', carga: 1, el: 'N', ox: -3, stock: 'amonio', tradicional: 'amonio', adjetivo: 'amónico', sistematica: 'azanio', enComposicion: 'amonio', fuente: RENG_I },
  { unidad: 'H3O', carga: 1, el: 'O', ox: -2, stock: 'oxonio', tradicional: 'hidronio', adjetivo: null, sistematica: 'oxidanio', enComposicion: 'oxonio', fuente: RENG_I },
  { unidad: 'Hg2', carga: 2, el: 'Hg', ox: 1, stock: 'mercurio(I)', tradicional: 'mercurioso', adjetivo: 'mercurioso', sistematica: 'dimercurio(2+)', enComposicion: 'dimercurio', fuente: RENG_I }
]

export const RENG_ADJETIVO_METAL: Record<string, Record<number, string>> = {
  Li: { 1: 'lítico' }, Na: { 1: 'sódico' }, K: { 1: 'potásico' }, Rb: { 1: 'rubídico' }, Cs: { 1: 'césico' },
  Be: { 2: 'berílico' }, Mg: { 2: 'magnésico' }, Ca: { 2: 'cálcico' }, Sr: { 2: 'estróncico' }, Ba: { 2: 'bárico' },
  Al: { 3: 'alumínico' }, Zn: { 2: 'cíncico' }, Cd: { 2: 'cádmico' }, Ag: { 1: 'argéntico' },
  Fe: { 2: 'ferroso', 3: 'férrico' }, Co: { 2: 'cobaltoso', 3: 'cobáltico' }, Ni: { 2: 'niqueloso', 3: 'niquélico' },
  Cu: { 1: 'cuproso', 2: 'cúprico' }, Au: { 1: 'auroso', 3: 'áurico' }, Hg: { 1: 'mercurioso', 2: 'mercúrico' },
  Sn: { 2: 'estannoso', 4: 'estánnico' }, Pb: { 2: 'plumboso', 4: 'plúmbico' }, Pt: { 2: 'platinoso', 4: 'platínico' },
  Cr: { 2: 'cromoso', 3: 'crómico' }, Mn: { 2: 'manganoso', 3: 'mangánico' }, Tl: { 1: 'talioso', 3: 'tálico' }
}

export const RENG_ADJETIVO_ACIDO: Record<string, Record<number, string>> = {
  Cl: { 1: 'hipocloroso', 3: 'cloroso', 5: 'clórico', 7: 'perclórico' },
  Br: { 1: 'hipobromoso', 3: 'bromoso', 5: 'brómico', 7: 'perbrómico' },
  I: { 1: 'hipoyodoso', 3: 'yodoso', 5: 'yódico', 7: 'peryódico' },
  S: { 4: 'sulfuroso', 6: 'sulfúrico' }, Se: { 4: 'selenioso', 6: 'selénico' }, Te: { 4: 'teluroso', 6: 'telúrico' },
  N: { 3: 'nitroso', 5: 'nítrico' }, P: { 3: 'fosforoso', 5: 'fosfórico' }, As: { 3: 'arsenioso', 5: 'arsénico' },
  C: { 4: 'carbónico' }, Si: { 4: 'silícico' }, B: { 3: 'bórico' },
  Cr: { 6: 'crómico' }, Mn: { 6: 'mangánico', 7: 'permangánico' }
}

export const RENG_HIDRUROS_NO_METALICOS: Array<{ formula: string; el: string; n: number; progenitor: string; comun: string | null }> = [
  { formula: 'NH3', el: 'N', n: 3, progenitor: 'azano', comun: 'amoniaco' },
  { formula: 'PH3', el: 'P', n: 3, progenitor: 'fosfano', comun: null },
  { formula: 'AsH3', el: 'As', n: 3, progenitor: 'arsano', comun: null },
  { formula: 'CH4', el: 'C', n: 4, progenitor: 'metano', comun: null },
  { formula: 'SiH4', el: 'Si', n: 4, progenitor: 'silano', comun: null }
]
