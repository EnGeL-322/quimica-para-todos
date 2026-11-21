import type { RengMedio } from '../nucleo/ajuste'
import type { RengTipoGrupo } from '../nucleo/organica'

export const RENG_COMPUESTOS: ReadonlyArray<{ f: string; n: string }> = [
  { f: 'NaCl', n: 'cloruro de sodio' },
  { f: 'CaCO3', n: 'carbonato de calcio' },
  { f: 'H2SO4', n: 'ácido sulfúrico' },
  { f: 'NaOH', n: 'hidróxido de sodio' },
  { f: 'C6H12O6', n: 'glucosa' },
  { f: 'CO2', n: 'dióxido de carbono' },
  { f: 'KMnO4', n: 'permanganato de potasio' },
  { f: 'Fe2O3', n: 'óxido de hierro(III)' },
  { f: 'NH3', n: 'amoníaco' },
  { f: 'H2O', n: 'agua' }
]

export interface RengEcuacionBanco {
  reactivos: string[]
  productos: string[]
}

export const RENG_BANCO_AJUSTE_BASICO: readonly RengEcuacionBanco[] = [
  { reactivos: ['H2', 'O2'], productos: ['H2O'] },
  { reactivos: ['N2', 'H2'], productos: ['NH3'] },
  { reactivos: ['Mg', 'O2'], productos: ['MgO'] },
  { reactivos: ['CH4', 'O2'], productos: ['CO2', 'H2O'] },
  { reactivos: ['Na', 'Cl2'], productos: ['NaCl'] },
  { reactivos: ['Fe', 'O2'], productos: ['Fe2O3'] },
  { reactivos: ['KClO3'], productos: ['KCl', 'O2'] },
  { reactivos: ['Al', 'O2'], productos: ['Al2O3'] },
  { reactivos: ['C3H8', 'O2'], productos: ['CO2', 'H2O'] },
  { reactivos: ['Zn', 'HCl'], productos: ['ZnCl2', 'H2'] }
]

export const RENG_BANCO_AJUSTE_UNIVERSITARIO: readonly RengEcuacionBanco[] = [
  { reactivos: ['Al', 'H+'], productos: ['Al3+', 'H2'] },
  { reactivos: ['Cu', 'Ag+'], productos: ['Cu2+', 'Ag'] },
  { reactivos: ['Fe3+', 'Sn2+'], productos: ['Fe2+', 'Sn4+'] },
  { reactivos: ['Ca(OH)2', 'H3PO4'], productos: ['Ca3(PO4)2', 'H2O'] },
  { reactivos: ['Al2(SO4)3', 'BaCl2'], productos: ['AlCl3', 'BaSO4'] },
  { reactivos: ['C6H12O6', 'O2'], productos: ['CO2', 'H2O'] },
  { reactivos: ['NH3', 'O2'], productos: ['NO', 'H2O'] },
  { reactivos: ['Fe2O3', 'CO'], productos: ['Fe', 'CO2'] },
  { reactivos: ['Na2CO3', 'HCl'], productos: ['NaCl', 'H2O', 'CO2'] },
  { reactivos: ['Zn', 'Cu2+'], productos: ['Zn2+', 'Cu'] }
]

export const RENG_REACCIONES_ESTEQ: ReadonlyArray<{ reactivos: string[]; productos: string[] }> = [
  { reactivos: ['N2', 'H2'], productos: ['NH3'] },
  { reactivos: ['H2', 'O2'], productos: ['H2O'] },
  { reactivos: ['CaCO3', 'HCl'], productos: ['CaCl2', 'H2O', 'CO2'] },
  { reactivos: ['Fe2O3', 'CO'], productos: ['Fe', 'CO2'] },
  { reactivos: ['Mg', 'O2'], productos: ['MgO'] },
  { reactivos: ['CH4', 'O2'], productos: ['CO2', 'H2O'] },
  { reactivos: ['NaOH', 'H2SO4'], productos: ['Na2SO4', 'H2O'] }
]

export interface RengCasoOxidacion {
  f: string
  el: string
  ox: number
  regla: string
}

export const RENG_BANCO_OXIDACION: Record<'preuniversitario' | 'universitario' | 'quimico', readonly RengCasoOxidacion[]> = {
  preuniversitario: [
    { f: 'NaCl', el: 'Cl', ox: -1, regla: 'el sodio (grupo 1) es +1 y el compuesto es neutro' },
    { f: 'H2O', el: 'O', ox: -2, regla: 'el hidrógeno es +1 y el compuesto es neutro' },
    { f: 'CO2', el: 'C', ox: 4, regla: 'el oxígeno es −2: 2·(−2) + x = 0' },
    { f: 'SO3', el: 'S', ox: 6, regla: 'el oxígeno es −2: 3·(−2) + x = 0' },
    { f: 'MgO', el: 'Mg', ox: 2, regla: 'el oxígeno es −2 y el compuesto es neutro' },
    { f: 'NH3', el: 'N', ox: -3, regla: 'el hidrógeno es +1: 3·(+1) + x = 0' },
    { f: 'Al2O3', el: 'Al', ox: 3, regla: 'el oxígeno es −2: 2x + 3·(−2) = 0' },
    { f: 'NO2', el: 'N', ox: 4, regla: 'el oxígeno es −2: x + 2·(−2) = 0' },
    { f: 'CaH2', el: 'H', ox: -1, regla: 'el calcio (grupo 2) es +2 y el hidrógeno de un hidruro metálico es −1' }
  ],
  universitario: [
    { f: 'H2SO4', el: 'S', ox: 6, regla: '2·(+1) + x + 4·(−2) = 0' },
    { f: 'KMnO4', el: 'Mn', ox: 7, regla: '(+1) + x + 4·(−2) = 0' },
    { f: 'K2Cr2O7', el: 'Cr', ox: 6, regla: '2·(+1) + 2x + 7·(−2) = 0' },
    { f: 'HNO3', el: 'N', ox: 5, regla: '(+1) + x + 3·(−2) = 0' },
    { f: 'NaClO', el: 'Cl', ox: 1, regla: '(+1) + x + (−2) = 0' },
    { f: 'Cr2O7^2-', el: 'Cr', ox: 6, regla: '2x + 7·(−2) = −2 (la suma es la carga del ion)' },
    { f: 'SO4^2-', el: 'S', ox: 6, regla: 'x + 4·(−2) = −2' },
    { f: 'NH4+', el: 'N', ox: -3, regla: 'x + 4·(+1) = +1' },
    { f: 'ClO3-', el: 'Cl', ox: 5, regla: 'x + 3·(−2) = −1' }
  ],
  quimico: [
    { f: 'H2O2', el: 'O', ox: -1, regla: 'peróxido: O–O, cada oxígeno es −1' },
    { f: 'Fe3O4', el: 'Fe', ox: 8 / 3, regla: '3x + 4·(−2) = 0 da un valor promedio (Fe²⁺ y Fe³⁺ mezclados)' },
    { f: 'OF2', el: 'O', ox: 2, regla: 'el flúor es siempre −1 y es más electronegativo que el oxígeno' },
    { f: 'NaH', el: 'H', ox: -1, regla: 'hidruro metálico: el hidrógeno es −1' },
    { f: 'KO2', el: 'O', ox: -0.5, regla: 'superóxido: 2x + (+1) = 0 en O₂⁻, promedio −1/2 por oxígeno' }
  ]
}

export const RENG_PARES_ENLACE: ReadonlyArray<[string, string, string]> = [
  ['Na', 'Cl', 'NaCl'],
  ['K', 'F', 'KF'],
  ['Mg', 'O', 'MgO'],
  ['Ca', 'O', 'CaO'],
  ['Cs', 'Cl', 'CsCl'],
  ['H', 'Cl', 'HCl'],
  ['H', 'O', 'H₂O'],
  ['H', 'N', 'NH₃'],
  ['C', 'O', 'CO₂'],
  ['C', 'H', 'CH₄'],
  ['Cl', 'Cl', 'Cl₂'],
  ['N', 'N', 'N₂'],
  ['O', 'O', 'O₂'],
  ['C', 'C', 'diamante'],
  ['S', 'O', 'SO₂']
]

export const RENG_NOMBRE_ENLACE = { apolar: 'Covalente apolar', polar: 'Covalente polar', ionico: 'Iónico' } as const

export const RENG_BANCO_REDOX: Record<RengMedio, ReadonlyArray<{ reactivos: string[]; productos: string[] }>> = {
  acido: [
    { reactivos: ['MnO4-', 'Fe2+'], productos: ['Mn2+', 'Fe3+'] },
    { reactivos: ['Cr2O7^2-', 'Fe2+'], productos: ['Cr3+', 'Fe3+'] },
    { reactivos: ['Cu', 'NO3-'], productos: ['Cu2+', 'NO2'] },
    { reactivos: ['MnO4-', 'I-'], productos: ['Mn2+', 'I2'] }
  ],
  basico: [
    { reactivos: ['MnO4-', 'I-'], productos: ['MnO2', 'I2'] },
    { reactivos: ['Cl2'], productos: ['Cl-', 'ClO-'] },
    { reactivos: ['Cr(OH)3', 'ClO-'], productos: ['CrO4^2-', 'Cl-'] }
  ]
}

export const RENG_SEMIRREACCIONES: ReadonlyArray<{ de: string; a: string; e: number; tipo: 'oxidación' | 'reducción' }> = [
  { de: 'Fe2+', a: 'Fe3+', e: 1, tipo: 'oxidación' },
  { de: 'Cu2+', a: 'Cu', e: 2, tipo: 'reducción' },
  { de: 'Zn', a: 'Zn2+', e: 2, tipo: 'oxidación' },
  { de: 'Ag+', a: 'Ag', e: 1, tipo: 'reducción' },
  { de: 'Sn2+', a: 'Sn4+', e: 2, tipo: 'oxidación' },
  { de: 'Cl2', a: 'Cl-', e: 2, tipo: 'reducción' },
  { de: 'Al', a: 'Al3+', e: 3, tipo: 'oxidación' }
]

export interface RengCompuestoOrganico {
  smiles: string
  nombre: string
  cond: string
  grupo: RengTipoGrupo
  principal?: RengTipoGrupo
}

export const rengC = (smiles: string, nombre: string, cond: string, grupo: RengTipoGrupo, principal?: RengTipoGrupo): RengCompuestoOrganico => ({ smiles, nombre, cond, grupo, principal })

export const RENG_BANCO_ORGANICO: Record<'preuniversitario' | 'universitario' | 'quimico', readonly RengCompuestoOrganico[]> = {
  preuniversitario: [
    rengC('CCCC', 'butano', 'CH3CH2CH2CH3', 'alcano'),
    rengC('CC(C)C', '2-metilpropano', 'CH3CH(CH3)CH3', 'alcano'),
    rengC('CCCCC', 'pentano', 'CH3CH2CH2CH2CH3', 'alcano'),
    rengC('CCO', 'etanol', 'CH3CH2OH', 'alcohol'),
    rengC('CCCO', 'propan-1-ol', 'CH3CH2CH2OH', 'alcohol'),
    rengC('CC(C)O', 'propan-2-ol', 'CH3CH(OH)CH3', 'alcohol'),
    rengC('CC=O', 'etanal', 'CH3CHO', 'aldehido'),
    rengC('CC(C)=O', 'propanona', 'CH3COCH3', 'cetona'),
    rengC('CC(=O)O', 'ácido etanoico', 'CH3COOH', 'acido-carboxilico'),
    rengC('C=CC', 'propeno', 'CH2=CHCH3', 'alqueno'),
    rengC('CC#C', 'propino', 'CH3C≡CH', 'alquino'),
    rengC('CCCl', 'cloroetano', 'CH3CH2Cl', 'haluro'),
    rengC('CCN', 'etanamina', 'CH3CH2NH2', 'amina'),
    rengC('COC', 'metoximetano', 'CH3OCH3', 'eter'),
    rengC('CC(=O)OC', 'etanoato de metilo', 'CH3COOCH3', 'ester'),
    rengC('CC#N', 'etanonitrilo', 'CH3CN', 'nitrilo'),
    rengC('CC(N)=O', 'etanamida', 'CH3CONH2', 'amida')
  ],
  universitario: [
    rengC('CC(C)CC', '2-metilbutano', 'CH3CH(CH3)CH2CH3', 'alcano'),
    rengC('CC(C)(C)C', '2,2-dimetilpropano', 'C(CH3)4', 'alcano'),
    rengC('CCC(C)O', 'butan-2-ol', 'CH3CH2CH(OH)CH3', 'alcohol'),
    rengC('CCC(=O)CC', 'pentan-3-ona', 'CH3CH2COCH2CH3', 'cetona'),
    rengC('CC(=O)OCC', 'etanoato de etilo', 'CH3COOCH2CH3', 'ester'),
    rengC('CC(C)Cl', '2-cloropropano', 'CH3CHClCH3', 'haluro'),
    rengC('CCCC(=O)O', 'ácido butanoico', 'CH3CH2CH2COOH', 'acido-carboxilico'),
    rengC('CC=CC', 'but-2-eno', 'CH3CH=CHCH3', 'alqueno'),
    rengC('CCOCC', 'etoxietano', 'CH3CH2OCH2CH3', 'eter'),
    rengC('CC(O)C(=O)O', 'ácido 2-hidroxipropanoico', 'CH3CH(OH)COOH', 'alcohol', 'acido-carboxilico'),
    rengC('NCC(=O)O', 'ácido 2-aminoetanoico', 'NH2CH2COOH', 'amina', 'acido-carboxilico'),
    rengC('OCC=O', '2-hidroxietanal', 'HOCH2CHO', 'alcohol', 'aldehido'),
    rengC('CC(=O)CO', '1-hidroxipropan-2-ona', 'CH3COCH2OH', 'alcohol', 'cetona')
  ],
  quimico: [
    rengC('OC(=O)CC(=O)O', 'ácido propanodioico', 'HOOCCH2COOH', 'acido-carboxilico'),
    rengC('CC(O)C(=O)O', 'ácido 2-hidroxipropanoico', 'CH3CH(OH)COOH', 'alcohol', 'acido-carboxilico'),
    rengC('CC(Cl)C(=O)O', 'ácido 2-cloropropanoico', 'CH3CHClCOOH', 'haluro', 'acido-carboxilico'),
    rengC('CCC(O)CC', 'pentan-3-ol', 'CH3CH2CH(OH)CH2CH3', 'alcohol'),
    rengC('CC(C)CCO', '3-metilbutan-1-ol', 'CH3CH(CH3)CH2CH2OH', 'alcohol'),
    rengC('CC(C)C(=O)C', '3-metilbutan-2-ona', 'CH3COCH(CH3)CH3', 'cetona'),
    rengC('CCCC(C)=O', 'pentan-2-ona', 'CH3CH2CH2COCH3', 'cetona'),
    rengC('CC(C)CC(=O)O', 'ácido 3-metilbutanoico', 'CH3CH(CH3)CH2COOH', 'acido-carboxilico')
  ]
}

export const RENG_GRUPOS_PRINCIPALES: RengTipoGrupo[] = ['acido-carboxilico', 'ester', 'amida', 'nitrilo', 'aldehido', 'cetona', 'alcohol', 'amina']

export interface RengCasoIsomeria {
  formula: string
  ref: string
  refNombre: string
  pide: RengTipoGrupo
  respuesta: string
  respuestaNombre: string
}

export const RENG_ISOMERIA: readonly RengCasoIsomeria[] = [
  { formula: 'C2H6O', ref: 'CCO', refNombre: 'etanol', pide: 'eter', respuesta: 'COC', respuestaNombre: 'metoximetano (dimetil éter)' },
  { formula: 'C2H6O', ref: 'COC', refNombre: 'metoximetano (dimetil éter)', pide: 'alcohol', respuesta: 'CCO', respuestaNombre: 'etanol' },
  { formula: 'C3H8O', ref: 'CCCO', refNombre: 'propan-1-ol', pide: 'alcohol', respuesta: 'CC(C)O', respuestaNombre: 'propan-2-ol' },
  { formula: 'C3H6O', ref: 'CCC=O', refNombre: 'propanal', pide: 'cetona', respuesta: 'CC(C)=O', respuestaNombre: 'propanona' },
  { formula: 'C2H4O2', ref: 'CC(=O)O', refNombre: 'ácido etanoico', pide: 'ester', respuesta: 'COC=O', respuestaNombre: 'metanoato de metilo' }
]

export const RENG_NUMERO_ISOMEROS: ReadonlyArray<{ formula: string; n: number; nivel: 'preuniversitario' | 'universitario'; lista: string[] }> = [
  { formula: 'C2H6O', n: 2, nivel: 'preuniversitario', lista: ['CCO', 'COC'] },
  { formula: 'C4H10', n: 2, nivel: 'preuniversitario', lista: ['CCCC', 'CC(C)C'] },
  { formula: 'C3H8O', n: 3, nivel: 'preuniversitario', lista: ['CCCO', 'CC(C)O', 'CCOC'] },
  { formula: 'C5H12', n: 3, nivel: 'universitario', lista: ['CCCCC', 'CC(C)CC', 'CC(C)(C)C'] },
  { formula: 'C6H14', n: 5, nivel: 'universitario', lista: ['CCCCCC', 'CC(C)CCC', 'CCC(C)CC', 'CC(C)(C)CC', 'CC(C)C(C)C'] },
  { formula: 'C4H10O', n: 7, nivel: 'universitario', lista: ['CCCCO', 'CCC(C)O', 'CC(C)CO', 'CC(C)(C)O', 'CCCOC', 'CC(C)OC', 'CCOCC'] }
]

export interface RengCasoEstereo {
  smiles: string
  nombre: string
  esperado: 'R' | 'S' | 'E' | 'Z'
}

export const RENG_BANCO_ESTEREO: { ez: readonly RengCasoEstereo[]; rs: readonly RengCasoEstereo[] } = {
  ez: [
    { smiles: 'C/C=C/C', nombre: 'but-2-eno', esperado: 'E' },
    { smiles: 'C/C=C\\C', nombre: 'but-2-eno', esperado: 'Z' },
    { smiles: 'Cl/C=C/Cl', nombre: '1,2-dicloroeteno', esperado: 'E' },
    { smiles: 'Cl/C=C\\Cl', nombre: '1,2-dicloroeteno', esperado: 'Z' },
    { smiles: 'CC/C=C/C', nombre: 'pent-2-eno', esperado: 'E' },
    { smiles: 'CC/C=C\\C', nombre: 'pent-2-eno', esperado: 'Z' }
  ],
  rs: [
    { smiles: 'C[C@H](O)CC', nombre: 'butan-2-ol', esperado: 'S' },
    { smiles: 'C[C@@H](O)CC', nombre: 'butan-2-ol', esperado: 'R' },
    { smiles: 'C[C@H](O)C(=O)O', nombre: 'ácido 2-hidroxipropanoico (láctico)', esperado: 'S' },
    { smiles: 'C[C@@H](O)C(=O)O', nombre: 'ácido 2-hidroxipropanoico (láctico)', esperado: 'R' },
    { smiles: 'C[C@H](N)C(=O)O', nombre: 'alanina', esperado: 'S' },
    { smiles: 'C[C@@H](N)C(=O)O', nombre: 'alanina', esperado: 'R' }
  ]
}

export interface RengReaccionOrganica {
  id: string
  familia: string
  tipo: string
  reactivos: string
  condiciones: string
  producto: string
  productoNombre: string
  nota: string
  pregunta: string
  nivel: 'preuniversitario' | 'universitario' | 'quimico'
}

export const RENG_REACCIONES_ORGANICAS: readonly RengReaccionOrganica[] = [
  { id: 'hidrogenacion-eteno', familia: 'Hidrogenación catalítica', tipo: 'Adición', reactivos: 'CH2=CH2 + H2', condiciones: 'catalizador metálico (Ni, Pd o Pt), calor y presión', producto: 'CC', productoNombre: 'etano', nota: 'El doble enlace se convierte en enlace sencillo.', pregunta: '¿Qué producto orgánico se forma?', nivel: 'preuniversitario' },
  { id: 'adicion-hbr-propeno', familia: 'Adición de HX (regla de Markovnikov)', tipo: 'Adición', reactivos: 'CH3CH=CH2 + HBr', condiciones: 'sin peróxidos, a temperatura ambiente', producto: 'CC(C)Br', productoNombre: '2-bromopropano', nota: 'El hidrógeno se une al carbono del doble enlace que ya tiene más hidrógenos (regla de Markovnikov); el 1-bromopropano es el producto minoritario.', pregunta: '¿Cuál es el producto mayoritario?', nivel: 'quimico' },
  { id: 'oxidacion-etanol', familia: 'Oxidación de alcoholes', tipo: 'Oxidación', reactivos: 'CH3CH2OH + [O]', condiciones: 'K2Cr2O7 en H2SO4 diluido, exceso de oxidante, calentamiento a reflujo', producto: 'CC(=O)O', productoNombre: 'ácido etanoico', nota: 'Con exceso de oxidante y reflujo, un alcohol primario llega al ácido carboxílico (si se destila el aldehído a medida que se forma, se obtiene etanal).', pregunta: '¿Qué producto orgánico se forma?', nivel: 'quimico' },
  { id: 'oxidacion-propan2ol', familia: 'Oxidación de alcoholes', tipo: 'Oxidación', reactivos: 'CH3CH(OH)CH3 + [O]', condiciones: 'K2Cr2O7 en H2SO4 diluido, calor', producto: 'CC(C)=O', productoNombre: 'propanona', nota: 'Un alcohol secundario se oxida a cetona y ahí se detiene.', pregunta: '¿Qué producto orgánico se forma?', nivel: 'universitario' },
  { id: 'esterificacion', familia: 'Esterificación de Fischer', tipo: 'Condensación (esterificación)', reactivos: 'CH3COOH + CH3CH2OH', condiciones: 'H2SO4 concentrado como catalizador, calor; equilibrio', producto: 'CC(=O)OCC', productoNombre: 'etanoato de etilo', nota: 'Se forma también agua; la reacción es reversible.', pregunta: '¿Qué éster se forma?', nivel: 'universitario' },
  { id: 'saponificacion', familia: 'Hidrólisis básica de ésteres (saponificación)', tipo: 'Hidrólisis', reactivos: 'CH3COOCH2CH3 + NaOH(aq)', condiciones: 'calentamiento a reflujo', producto: 'CCO', productoNombre: 'etanol', nota: 'Además se forma la sal del ácido (etanoato de sodio). Aquí se pregunta por el alcohol.', pregunta: '¿Qué alcohol se libera?', nivel: 'universitario' },
  { id: 'halogenacion-metano', familia: 'Halogenación radicalaria de alcanos', tipo: 'Sustitución radicalaria', reactivos: 'CH4 + Cl2', condiciones: 'luz ultravioleta', producto: 'CCl', productoNombre: 'clorometano', nota: 'Se forma también HCl; con exceso de cloro continúa hasta di-, tri- y tetraclorometano.', pregunta: '¿Cuál es el primer producto orgánico de sustitución?', nivel: 'preuniversitario' },
  { id: 'sustitucion-bromoetano', familia: 'Sustitución nucleófila', tipo: 'Sustitución nucleófila', reactivos: 'CH3CH2Br + NaOH(aq)', condiciones: 'calentamiento en agua', producto: 'CCO', productoNombre: 'etanol', nota: 'El grupo OH⁻ sustituye al bromo; se forma NaBr.', pregunta: '¿Qué producto orgánico se forma?', nivel: 'universitario' },
  { id: 'eliminacion-2-bromopropano', familia: 'Eliminación (deshidrohalogenación)', tipo: 'Eliminación', reactivos: 'CH3CHBrCH3 + KOH', condiciones: 'disolución alcohólica (etanol), calor', producto: 'C=CC', productoNombre: 'propeno', nota: 'En medio alcohólico y con calor predomina la eliminación de HBr frente a la sustitución.', pregunta: '¿Qué producto orgánico se forma?', nivel: 'quimico' }
]

export const RENG_TIPOS_REACCION = ['Adición', 'Oxidación', 'Condensación (esterificación)', 'Hidrólisis', 'Sustitución radicalaria', 'Sustitución nucleófila', 'Eliminación']
