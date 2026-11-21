export const RENG_FUENTE_ESTADOS = 'N. N. Greenwood y A. Earnshaw, Chemistry of the Elements, 2.ª ed. (1997): estados de oxidación más comunes'
export const RENG_FUENTE_COMPUESTOS = 'CRC Handbook of Chemistry and Physics, «Physical Constants of Inorganic Compounds»'

export const RENG_ESTADOS_COMUNES: Record<string, number[]> = {
  H: [1, -1],
  Li: [1], Na: [1], K: [1], Rb: [1], Cs: [1],
  Be: [2], Mg: [2], Ca: [2], Sr: [2], Ba: [2],
  B: [3], Al: [3], Ga: [3], In: [3], Tl: [1, 3],
  C: [4, 2, -4], Si: [4, -4], Ge: [4, 2], Sn: [2, 4], Pb: [2, 4],
  N: [-3, 3, 5], P: [-3, 3, 5], As: [-3, 3, 5], Sb: [3, 5], Bi: [3],
  O: [-2], S: [-2, 4, 6], Se: [-2, 4, 6], Te: [-2, 4, 6],
  F: [-1], Cl: [-1, 1, 3, 5, 7], Br: [-1, 1, 3, 5], I: [-1, 1, 5, 7],
  Sc: [3], Ti: [4, 3], V: [5, 4, 3], Cr: [3, 6, 2], Mn: [2, 4, 7], Fe: [2, 3], Co: [2, 3], Ni: [2], Cu: [1, 2], Zn: [2],
  Zr: [4], Mo: [6], Pd: [2], Ag: [1], Cd: [2], W: [6], Pt: [2, 4], Au: [1, 3], Hg: [2],
  Kr: [2], Xe: [2, 4, 6]
}

export interface RengCompuestoConocido {
  formula: string
  nombre: string
  nota?: string
  fuente: string
}

const rengC = (rengFormula: string, rengNombre: string, rengNota?: string): RengCompuestoConocido => ({ formula: rengFormula, nombre: rengNombre, nota: rengNota, fuente: RENG_FUENTE_COMPUESTOS })

export const RENG_COMPUESTOS_BINARIOS: RengCompuestoConocido[] = [
  rengC('NaCl', 'cloruro de sodio'), rengC('KCl', 'cloruro de potasio'), rengC('LiCl', 'cloruro de litio'), rengC('LiF', 'fluoruro de litio'), rengC('NaF', 'fluoruro de sodio'),
  rengC('KBr', 'bromuro de potasio'), rengC('NaBr', 'bromuro de sodio'), rengC('NaI', 'yoduro de sodio'), rengC('KI', 'yoduro de potasio'), rengC('CsCl', 'cloruro de cesio'),
  rengC('MgCl2', 'cloruro de magnesio'), rengC('CaCl2', 'cloruro de calcio'), rengC('BaCl2', 'cloruro de bario'), rengC('MgF2', 'fluoruro de magnesio'), rengC('CaF2', 'fluoruro de calcio'),
  rengC('AlF3', 'fluoruro de aluminio'), rengC('AlCl3', 'cloruro de aluminio', 'Aunque es metal + no metal, Δχ = 1,55: en fase gaseosa forma moléculas Al₂Cl₆ con enlaces bastante covalentes.'),
  rengC('FeCl2', 'cloruro de hierro(II)'), rengC('FeCl3', 'cloruro de hierro(III)'), rengC('CuCl', 'cloruro de cobre(I)'), rengC('CuCl2', 'cloruro de cobre(II)'), rengC('ZnCl2', 'cloruro de zinc'),
  rengC('AgCl', 'cloruro de plata'), rengC('AgBr', 'bromuro de plata'), rengC('AgI', 'yoduro de plata'), rengC('HgCl2', 'cloruro de mercurio(II)'),
  rengC('Hg2Cl2', 'cloruro de mercurio(I)', 'Contiene el ion Hg₂²⁺ (dos átomos de Hg unidos): la regla de cruzar cargas no lo predice.'),
  rengC('PbCl2', 'cloruro de plomo(II)'), rengC('SnCl2', 'cloruro de estaño(II)'), rengC('SnCl4', 'cloruro de estaño(IV)'), rengC('TiCl4', 'cloruro de titanio(IV)'),
  rengC('Li2O', 'óxido de litio'), rengC('Na2O', 'óxido de sodio'), rengC('K2O', 'óxido de potasio'), rengC('BeO', 'óxido de berilio'), rengC('MgO', 'óxido de magnesio'),
  rengC('CaO', 'óxido de calcio'), rengC('SrO', 'óxido de estroncio'), rengC('BaO', 'óxido de bario'), rengC('Al2O3', 'óxido de aluminio'), rengC('Ga2O3', 'óxido de galio'),
  rengC('B2O3', 'óxido de boro'), rengC('SiO2', 'dióxido de silicio'), rengC('GeO2', 'dióxido de germanio'), rengC('SnO', 'óxido de estaño(II)'), rengC('SnO2', 'óxido de estaño(IV)'),
  rengC('PbO', 'óxido de plomo(II)'), rengC('PbO2', 'óxido de plomo(IV)'), rengC('TiO2', 'dióxido de titanio'), rengC('V2O5', 'pentaóxido de divanadio'),
  rengC('Cr2O3', 'óxido de cromo(III)'), rengC('CrO3', 'trióxido de cromo'), rengC('MnO', 'óxido de manganeso(II)'), rengC('MnO2', 'dióxido de manganeso'), rengC('Mn2O7', 'heptaóxido de dimanganeso'),
  rengC('FeO', 'óxido de hierro(II)'), rengC('Fe2O3', 'óxido de hierro(III)'), rengC('CoO', 'óxido de cobalto(II)'), rengC('NiO', 'óxido de níquel(II)'),
  rengC('Cu2O', 'óxido de cobre(I)'), rengC('CuO', 'óxido de cobre(II)'), rengC('ZnO', 'óxido de zinc'), rengC('Ag2O', 'óxido de plata'), rengC('CdO', 'óxido de cadmio'), rengC('HgO', 'óxido de mercurio(II)'),
  rengC('Bi2O3', 'óxido de bismuto(III)'), rengC('As2O3', 'óxido de arsénico(III)'), rengC('Sb2O3', 'óxido de antimonio(III)'),
  rengC('CO2', 'dióxido de carbono'),
  rengC('CO', 'monóxido de carbono', 'Aquí el carbono usa el estado +2. Se forma cuando falta oxígeno (combustión incompleta); con oxígeno suficiente se obtiene CO₂ (+4).'),
  rengC('NO', 'monóxido de nitrógeno', 'Tiene un número impar de electrones: la regla de cruzar cargas no lo predice.'),
  rengC('NO2', 'dióxido de nitrógeno', 'Nitrógeno +4: no está entre los estados «comunes» de la tabla, así que la regla no lo predice.'),
  rengC('N2O', 'monóxido de dinitrógeno'), rengC('N2O3', 'trióxido de dinitrógeno'), rengC('N2O5', 'pentaóxido de dinitrógeno'),
  rengC('P4O6', 'hexaóxido de tetrafósforo', 'La fórmula empírica es P₂O₃; la molécula real es P₄O₆.'),
  rengC('P4O10', 'decaóxido de tetrafósforo', 'La fórmula empírica es P₂O₅; la molécula real es P₄O₁₀.'),
  rengC('SO2', 'dióxido de azufre'), rengC('SO3', 'trióxido de azufre'), rengC('SeO2', 'dióxido de selenio'), rengC('TeO2', 'dióxido de teluro'),
  rengC('Cl2O', 'monóxido de dicloro'), rengC('ClO2', 'dióxido de cloro', 'Cloro +4, con un electrón desapareado: la regla no lo predice.'), rengC('Cl2O7', 'heptaóxido de dicloro'),
  rengC('OF2', 'difluoruro de oxígeno', 'El oxígeno es aquí +2, porque el flúor es aún más electronegativo.'),
  rengC('LiH', 'hidruro de litio'), rengC('NaH', 'hidruro de sodio'), rengC('KH', 'hidruro de potasio'), rengC('CaH2', 'hidruro de calcio'), rengC('MgH2', 'hidruro de magnesio'),
  rengC('B2H6', 'diborano', 'La fórmula empírica es BH₃; la molécula real es B₂H₆.'),
  rengC('CH4', 'metano'), rengC('SiH4', 'silano'), rengC('NH3', 'amoniaco'), rengC('PH3', 'fosfano (fosfina)'), rengC('AsH3', 'arsano (arsina)'),
  rengC('H2O', 'agua'), rengC('H2S', 'sulfuro de hidrógeno'), rengC('H2Se', 'seleniuro de hidrógeno'),
  rengC('HF', 'fluoruro de hidrógeno'), rengC('HCl', 'cloruro de hidrógeno'), rengC('HBr', 'bromuro de hidrógeno'), rengC('HI', 'yoduro de hidrógeno'),
  rengC('Li3N', 'nitruro de litio'), rengC('Mg3N2', 'nitruro de magnesio'), rengC('Ca3N2', 'nitruro de calcio'), rengC('AlN', 'nitruro de aluminio'), rengC('BN', 'nitruro de boro'),
  rengC('Si3N4', 'nitruro de silicio'), rengC('SiC', 'carburo de silicio'), rengC('CaC2', 'carburo de calcio', 'Contiene el ion C₂²⁻: la regla de cruzar cargas no lo predice.'),
  rengC('Na2S', 'sulfuro de sodio'), rengC('K2S', 'sulfuro de potasio'), rengC('MgS', 'sulfuro de magnesio'), rengC('CaS', 'sulfuro de calcio'), rengC('ZnS', 'sulfuro de zinc'),
  rengC('FeS', 'sulfuro de hierro(II)'), rengC('CuS', 'sulfuro de cobre(II)'), rengC('Cu2S', 'sulfuro de cobre(I)'), rengC('Ag2S', 'sulfuro de plata'), rengC('PbS', 'sulfuro de plomo(II)'),
  rengC('Al2S3', 'sulfuro de aluminio'), rengC('CS2', 'disulfuro de carbono'),
  rengC('CCl4', 'tetracloruro de carbono'), rengC('SiCl4', 'tetracloruro de silicio'), rengC('NCl3', 'tricloruro de nitrógeno'), rengC('PCl3', 'tricloruro de fósforo'), rengC('PCl5', 'pentacloruro de fósforo'),
  rengC('SCl2', 'dicloruro de azufre'), rengC('SF6', 'hexafluoruro de azufre'), rengC('BF3', 'trifluoruro de boro'), rengC('BCl3', 'tricloruro de boro'), rengC('ICl', 'monocloruro de yodo'),
  rengC('KrF2', 'difluoruro de kriptón', 'Se descompone a temperatura ambiente; se conserva a baja temperatura.'),
  rengC('XeF2', 'difluoruro de xenón', 'Los gases nobles pesados sí forman algunos compuestos, sobre todo con F y O, los elementos más electronegativos.'),
  rengC('XeF4', 'tetrafluoruro de xenón'), rengC('XeF6', 'hexafluoruro de xenón'), rengC('XeO3', 'trióxido de xenón', 'Explosivo.')
]
