export type RengClaseCotidiana = 'sustancia' | 'disolucion' | 'mezcla'

export interface RengCotidiano {
  nombre: string
  otros: string[]
  entrada: string
  clase: RengClaseCotidiana
  nota: string
  fuente: string
}

const RENG_CRC = 'CRC Handbook of Chemistry and Physics, «Physical Constants of Inorganic Compounds» (nombres comunes)'
const RENG_GE = 'N. N. Greenwood y A. Earnshaw, Chemistry of the Elements, 2.ª ed. (1997)'

export const RENG_COTIDIANOS: RengCotidiano[] = [
  {
    nombre: 'vinagre',
    otros: [],
    entrada: 'CH3COOH',
    clase: 'disolucion',
    nota: 'es una disolución acuosa de ácido acético (se muestra el ácido acético). En EE. UU. debe contener al menos 4 g de ácido acético por 100 mL.',
    fuente: 'U.S. FDA, Compliance Policy Guide Sec. 525.825 «Vinegar, Definitions»; PubChem CID 176 (ácido acético)'
  },
  {
    nombre: 'azúcar',
    otros: ['azúcar de mesa', 'sacarosa'],
    entrada: 'OCC1OC(OC2(CO)OC(CO)C(O)C2O)C(O)C(O)C1O',
    clase: 'sustancia',
    nota: 'el azúcar de mesa es sacarosa, C₁₂H₂₂O₁₁. El modelo 3D no representa su estereoquímica.',
    fuente: 'PubChem CID 5988 (sucrose; sinónimos «table sugar», «saccharose»)'
  },
  {
    nombre: 'lejía',
    otros: ['lavandina'],
    entrada: 'NaClO',
    clase: 'disolucion',
    nota: 'es una disolución acuosa de hipoclorito de sodio (se muestra el NaClO). La concentración depende del producto: consulta la etiqueta.',
    fuente: 'PubChem, sodium hypochlorite (sinónimo «bleach»)'
  },
  {
    nombre: 'sal de mesa',
    otros: ['sal común', 'sal de cocina'],
    entrada: 'NaCl',
    clase: 'sustancia',
    nota: 'es cloruro de sodio casi puro: la norma Codex exige al menos un 97 % de NaCl sobre materia seca; puede llevar yodo o antiaglomerantes añadidos.',
    fuente: 'Codex Alimentarius, CXS 150-1985 «Norma para la sal de calidad alimentaria»; PubChem CID 5234'
  },
  { nombre: 'cal viva', otros: [], entrada: 'CaO', clase: 'sustancia', nota: 'es óxido de calcio.', fuente: `${RENG_CRC}: calcium oxide («lime», «quicklime»)` },
  { nombre: 'cal apagada', otros: ['cal hidratada'], entrada: 'Ca(OH)2', clase: 'sustancia', nota: 'es hidróxido de calcio.', fuente: `${RENG_CRC}: calcium hydroxide («slaked lime»)` },
  {
    nombre: 'agua oxigenada',
    otros: [],
    entrada: 'H2O2',
    clase: 'disolucion',
    nota: 'es una disolución acuosa de peróxido de hidrógeno (se muestra el H₂O₂). La de uso antiséptico contiene entre un 2,5 % y un 3,5 % (p/v).',
    fuente: 'USP–NF, monografía «Hydrogen Peroxide Topical Solution»; PubChem, hydrogen peroxide'
  },
  { nombre: 'sosa cáustica', otros: ['soda cáustica'], entrada: 'NaOH', clase: 'sustancia', nota: 'es hidróxido de sodio.', fuente: `${RENG_CRC}: sodium hydroxide («caustic soda»)` },
  {
    nombre: 'yeso',
    otros: [],
    entrada: 'CaSO4·2H2O',
    clase: 'sustancia',
    nota: 'el mineral yeso es sulfato de calcio dihidratado. El yeso de obra en polvo se obtiene calentándolo y es sobre todo el hemihidrato (CaSO₄·½H₂O).',
    fuente: `${RENG_GE}, cap. 5 (calcio); ${RENG_CRC}: calcium sulfate dihydrate («gypsum»)`
  },
  {
    nombre: 'arena',
    otros: [],
    entrada: 'SiO2',
    clase: 'mezcla',
    nota: 'es una mezcla de granos minerales de composición variable; en muchas arenas predomina el cuarzo (SiO₂), que es lo que se muestra.',
    fuente: 'USGS, Mineral Commodity Summaries, «Sand and Gravel (Industrial)»: la arena industrial es de alto contenido en cuarzo'
  },
  {
    nombre: 'alcohol',
    otros: ['alcohol etílico'],
    entrada: 'CH3CH2OH',
    clase: 'sustancia',
    nota: 'en el uso cotidiano «alcohol» es el etanol. El alcohol de farmacia es una disolución de etanol en agua: consulta su etiqueta.',
    fuente: 'PubChem CID 702 (ethanol; sinónimo «alcohol»)'
  },
  {
    nombre: 'herrumbre',
    otros: ['orín'],
    entrada: 'Fe2O3',
    clase: 'mezcla',
    nota: 'es una mezcla de óxidos e hidróxidos de hierro(III) hidratados (Fe₂O₃·nH₂O, FeO(OH)); se muestra el Fe₂O₃.',
    fuente: `${RENG_GE}, cap. 25 (hierro)`
  },
  { nombre: 'bicarbonato', otros: ['bicarbonato de sodio', 'bicarbonato sódico'], entrada: 'NaHCO3', clase: 'sustancia', nota: 'es hidrogenocarbonato de sodio.', fuente: `${RENG_CRC}: sodium hydrogen carbonate («baking soda»)` }
]
