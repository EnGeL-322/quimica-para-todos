export type RengCategoria = 'gases' | 'acidos' | 'bases' | 'sales' | 'inorganicas' | 'organicas' | 'biomoleculas' | 'farmacos' | 'elementos'

export const RENG_CATEGORIAS: Record<RengCategoria, string> = {
  gases: 'Gases',
  acidos: 'Ácidos',
  bases: 'Bases',
  sales: 'Sales',
  inorganicas: 'Otras inorgánicas',
  organicas: 'Orgánicas',
  biomoleculas: 'Biomoléculas',
  farmacos: 'Fármacos comunes',
  elementos: 'Elementos'
}

export interface RengEntradaBiblioteca {
  nombre: string
  otros?: string[]
  categoria: RengCategoria
  entrada: string
  smiles: string | null
  fuente: string
}

const RENG_PUBCHEM = 'PubChem (NIH), estructura de referencia'
const RENG_CRC = 'CRC Handbook of Chemistry and Physics, «Physical Constants of Inorganic Compounds»'

const rengM = (rengNombre: string, rengCategoria: RengCategoria, rengSmiles: string, rengEntrada = rengSmiles, rengOtros?: string[]): RengEntradaBiblioteca => ({ nombre: rengNombre, otros: rengOtros, categoria: rengCategoria, entrada: rengEntrada, smiles: rengSmiles, fuente: RENG_PUBCHEM })
const rengI = (rengNombre: string, rengCategoria: RengCategoria, rengFormula: string, rengOtros?: string[]): RengEntradaBiblioteca => ({ nombre: rengNombre, otros: rengOtros, categoria: rengCategoria, entrada: rengFormula, smiles: null, fuente: RENG_CRC })

export const RENG_BIBLIOTECA: RengEntradaBiblioteca[] = [
  rengM('hidrógeno', 'gases', '[H][H]', 'H2'), rengM('oxígeno', 'gases', 'O=O', 'O2'), rengM('nitrógeno', 'gases', 'N#N', 'N2'), rengM('cloro', 'gases', 'ClCl', 'Cl2'),
  rengM('flúor', 'gases', 'FF', 'F2'), rengM('ozono', 'gases', '[O-][O+]=O', 'O3'), rengM('dióxido de carbono', 'gases', 'O=C=O', 'CO2'), rengM('monóxido de carbono', 'gases', '[C-]#[O+]', 'CO'),
  rengM('amoniaco', 'gases', 'N', 'NH3'), rengM('metano', 'gases', 'C', 'CH4'), rengM('dióxido de azufre', 'gases', 'O=S=O', 'SO2'), rengM('sulfuro de hidrógeno', 'gases', 'S', 'H2S'),
  rengM('monóxido de dinitrógeno', 'gases', '[N-]=[N+]=O', 'N2O', ['gas de la risa']), rengM('etino', 'gases', 'C#C', 'C#C', ['acetileno']), rengM('eteno', 'gases', 'C=C', 'C=C', ['etileno']),
  rengM('propano', 'gases', 'CCC'), rengM('butano', 'gases', 'CCCC'), rengM('helio', 'gases', '[He]', 'He'), rengM('neón', 'gases', '[Ne]', 'Ne'), rengM('argón', 'gases', '[Ar]', 'Ar'),
  rengM('cloruro de hidrógeno', 'acidos', 'Cl', 'HCl', ['ácido clorhídrico (en agua)']), rengM('ácido sulfúrico', 'acidos', 'OS(=O)(=O)O', 'H2SO4'), rengM('ácido nítrico', 'acidos', 'O[N+](=O)[O-]', 'HNO3'),
  rengM('ácido fosfórico', 'acidos', 'OP(=O)(O)O', 'H3PO4'), rengM('fluoruro de hidrógeno', 'acidos', 'F', 'HF'), rengM('ácido carbónico', 'acidos', 'OC(=O)O', 'H2CO3'),
  rengM('ácido acético', 'acidos', 'CC(=O)O', 'CH3COOH', ['ácido etanoico']), rengM('ácido fórmico', 'acidos', 'OC=O', 'HCOOH', ['ácido metanoico']),
  rengM('ácido cítrico', 'acidos', 'OC(=O)CC(O)(CC(=O)O)C(=O)O'), rengM('ácido láctico', 'acidos', 'CC(O)C(=O)O'), rengM('ácido benzoico', 'acidos', 'OC(=O)c1ccccc1'),
  rengM('ácido oxálico', 'acidos', 'OC(=O)C(=O)O', 'OC(=O)C(=O)O', ['ácido etanodioico']), rengM('ácido hipocloroso', 'acidos', 'OCl', 'HClO'), rengM('cianuro de hidrógeno', 'acidos', 'C#N', 'HCN'),
  rengI('hidróxido de sodio', 'bases', 'NaOH', ['sosa cáustica']), rengI('hidróxido de potasio', 'bases', 'KOH'), rengI('hidróxido de calcio', 'bases', 'Ca(OH)2', ['cal apagada']),
  rengI('hidróxido de magnesio', 'bases', 'Mg(OH)2'), rengI('hidróxido de aluminio', 'bases', 'Al(OH)3'),
  rengI('cloruro de sodio', 'sales', 'NaCl', ['sal común']), rengI('cloruro de potasio', 'sales', 'KCl'), rengI('carbonato de calcio', 'sales', 'CaCO3'), rengI('hidrogenocarbonato de sodio', 'sales', 'NaHCO3', ['bicarbonato de sodio']),
  rengI('carbonato de sodio', 'sales', 'Na2CO3'), rengI('sulfato de cobre(II) pentahidratado', 'sales', 'CuSO4·5H2O'), rengI('nitrato de plata', 'sales', 'AgNO3'), rengI('permanganato de potasio', 'sales', 'KMnO4'),
  rengI('cloruro de calcio', 'sales', 'CaCl2'), rengI('nitrato de potasio', 'sales', 'KNO3'), rengI('cloruro de amonio', 'sales', 'NH4Cl'), rengI('sulfato de bario', 'sales', 'BaSO4'),
  rengI('fluoruro de calcio', 'sales', 'CaF2'), rengI('sulfato de magnesio heptahidratado', 'sales', 'MgSO4·7H2O'), rengI('cloruro de hierro(III)', 'sales', 'FeCl3'), rengI('dicromato de potasio', 'sales', 'K2Cr2O7'),
  rengI('óxido de magnesio', 'sales', 'MgO'), rengI('dióxido de titanio', 'sales', 'TiO2', ['rutilo']), rengI('cloruro de cesio', 'sales', 'CsCl'),
  rengM('agua', 'inorganicas', 'O', 'H2O'), rengM('etano', 'organicas', 'CC'), rengM('hexano', 'organicas', 'CCCCCC'), rengM('octano', 'organicas', 'CCCCCCCC'), rengM('etanol', 'organicas', 'CCO', 'CH3CH2OH', ['alcohol etílico']),
  rengM('metanol', 'organicas', 'CO', 'CH3OH'), rengM('propan-2-ol', 'organicas', 'CC(C)O', 'CC(C)O', ['alcohol isopropílico']), rengM('acetona', 'organicas', 'CC(C)=O', 'CH3COCH3', ['propanona']),
  rengM('acetato de etilo', 'organicas', 'CCOC(C)=O', 'CH3COOCH2CH3', ['etanoato de etilo']), rengM('éter dietílico', 'organicas', 'CCOCC', 'CCOCC', ['etoxietano']), rengM('metoximetano', 'organicas', 'COC', 'COC', ['dimetiléter', 'éter dimetílico']),
  rengM('formaldehído', 'organicas', 'C=O', 'HCHO', ['metanal']), rengM('benceno', 'organicas', 'c1ccccc1'), rengM('tolueno', 'organicas', 'Cc1ccccc1', 'Cc1ccccc1', ['metilbenceno']),
  rengM('naftaleno', 'organicas', 'c1ccc2ccccc2c1'), rengM('ciclohexano', 'organicas', 'C1CCCCC1'), rengM('fenol', 'organicas', 'Oc1ccccc1'), rengM('anilina', 'organicas', 'Nc1ccccc1'),
  rengM('cloroformo', 'organicas', 'ClC(Cl)Cl', 'CHCl3', ['triclorometano']), rengM('glicerina', 'organicas', 'OCC(O)CO', 'OCC(O)CO', ['propano-1,2,3-triol']), rengM('etilenglicol', 'organicas', 'OCCO'),
  rengM('estireno', 'organicas', 'C=Cc1ccccc1', 'C=Cc1ccccc1', ['etenilbenceno']),
  rengM('glucosa', 'biomoleculas', 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O', 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O', ['D-glucopiranosa']),
  rengM('glicina', 'biomoleculas', 'NCC(=O)O'), rengM('alanina', 'biomoleculas', 'C[C@@H](C(=O)O)N', 'C[C@@H](C(=O)O)N', ['L-alanina']), rengM('serina', 'biomoleculas', 'N[C@@H](CO)C(=O)O', 'N[C@@H](CO)C(=O)O', ['L-serina']),
  rengM('urea', 'biomoleculas', 'NC(=O)N'), rengM('adenina', 'biomoleculas', 'Nc1ncnc2[nH]cnc12'), rengM('ácido palmítico', 'biomoleculas', 'CCCCCCCCCCCCCCCC(=O)O', 'CCCCCCCCCCCCCCCC(=O)O', ['ácido hexadecanoico']),
  rengM('ácido acetilsalicílico', 'farmacos', 'CC(=O)Oc1ccccc1C(=O)O', 'CC(=O)Oc1ccccc1C(=O)O', ['aspirina']), rengM('paracetamol', 'farmacos', 'CC(=O)Nc1ccc(O)cc1', 'CC(=O)Nc1ccc(O)cc1', ['acetaminofén']),
  rengM('ibuprofeno', 'farmacos', 'CC(C)Cc1ccc(cc1)C(C)C(=O)O'), rengM('cafeína', 'farmacos', 'Cn1cnc2c1c(=O)n(C)c(=O)n2C'), rengM('nicotina', 'farmacos', 'CN1CCC[C@H]1c1cccnc1'),
  rengM('ácido salicílico', 'farmacos', 'OC(=O)c1ccccc1O'), rengM('mentol', 'farmacos', 'CC(C)C1CCC(C)CC1O'),
  rengI('oro', 'elementos', 'Au'), rengI('plata', 'elementos', 'Ag'), rengI('cobre', 'elementos', 'Cu'), rengI('hierro', 'elementos', 'Fe'), rengI('sodio', 'elementos', 'Na'), rengI('aluminio', 'elementos', 'Al'),
  rengM('azufre (S₈)', 'elementos', 'S1SSSSSSS1', 'S8'), rengM('fósforo blanco (P₄)', 'elementos', 'P12P3P1P23', 'P4'), rengM('yodo', 'elementos', 'II', 'I2'), rengM('bromo', 'elementos', 'BrBr', 'Br2')
]
