import { describe, expect, it } from 'vitest'
import { rengCoordinacion, RENG_ESTRUCTURAS, rengUnidadesFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/cristales'
import { rengBanco, rengCorregir, rengGenerarEjercicios, type RengEjercicio } from '../../src/renderer/modules/simulador-quimica/nucleo/ejerciciosFormulacion'
import { rengPasosFormulacion } from '../../src/renderer/modules/simulador-quimica/nucleo/formulacion'
import { rengAnalizarFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengAnalizarNotacion } from '../../src/renderer/modules/simulador-quimica/nucleo/notacion'
import { RENG_ANIONES, RENG_CATIONES_POLIATOMICOS, RENG_OXOANIONES } from '../../src/renderer/modules/simulador-quimica/nucleo/iones'
import { rengEstadosDe, rengFormularDesdeNombre, rengInterpretar, rengNombrar, type RengFuncion } from '../../src/renderer/modules/simulador-quimica/nucleo/nomenclatura'

const RENG_PARES: Array<[string, string | null, string | null, string | null]> = [
  ['Na2O', 'óxido de disodio', 'óxido de sodio', 'óxido sódico'],
  ['K2O', 'óxido de dipotasio', 'óxido de potasio', 'óxido potásico'],
  ['CaO', 'óxido de calcio', 'óxido de calcio', 'óxido cálcico'],
  ['MgO', 'óxido de magnesio', 'óxido de magnesio', 'óxido magnésico'],
  ['Al2O3', 'trióxido de dialuminio', 'óxido de aluminio', 'óxido alumínico'],
  ['FeO', 'monóxido de hierro', 'óxido de hierro(II)', 'óxido ferroso'],
  ['Fe2O3', 'trióxido de dihierro', 'óxido de hierro(III)', 'óxido férrico'],
  ['Cu2O', 'monóxido de dicobre', 'óxido de cobre(I)', 'óxido cuproso'],
  ['CuO', 'monóxido de cobre', 'óxido de cobre(II)', 'óxido cúprico'],
  ['ZnO', 'óxido de zinc', 'óxido de zinc', 'óxido cíncico'],
  ['PbO2', 'dióxido de plomo', 'óxido de plomo(IV)', 'óxido plúmbico'],
  ['PbO', 'monóxido de plomo', 'óxido de plomo(II)', 'óxido plumboso'],
  ['SnO2', 'dióxido de estaño', 'óxido de estaño(IV)', 'óxido estánnico'],
  ['Ag2O', 'óxido de diplata', 'óxido de plata', 'óxido argéntico'],
  ['NiO', 'monóxido de níquel', 'óxido de níquel(II)', 'óxido niqueloso'],
  ['BaO', 'óxido de bario', 'óxido de bario', 'óxido bárico'],
  ['Li2O', 'óxido de dilitio', 'óxido de litio', 'óxido lítico'],
  ['HgO', 'monóxido de mercurio', 'óxido de mercurio(II)', 'óxido mercúrico'],
  ['Cr2O3', 'trióxido de dicromo', 'óxido de cromo(III)', 'óxido crómico'],
  ['MnO2', 'dióxido de manganeso', 'óxido de manganeso(IV)', null],
  ['CO2', 'dióxido de carbono', 'óxido de carbono(IV)', 'anhídrido carbónico'],
  ['CO', 'monóxido de carbono', 'óxido de carbono(II)', null],
  ['SO2', 'dióxido de azufre', 'óxido de azufre(IV)', 'anhídrido sulfuroso'],
  ['SO3', 'trióxido de azufre', 'óxido de azufre(VI)', 'anhídrido sulfúrico'],
  ['N2O3', 'trióxido de dinitrógeno', 'óxido de nitrógeno(III)', 'anhídrido nitroso'],
  ['N2O5', 'pentaóxido de dinitrógeno', 'óxido de nitrógeno(V)', 'anhídrido nítrico'],
  ['Cl2O', 'monóxido de dicloro', 'óxido de cloro(I)', 'anhídrido hipocloroso'],
  ['Cl2O7', 'heptaóxido de dicloro', 'óxido de cloro(VII)', 'anhídrido perclórico'],
  ['P2O5', 'pentaóxido de difósforo', 'óxido de fósforo(V)', 'anhídrido fosfórico'],
  ['SiO2', 'dióxido de silicio', 'óxido de silicio', 'anhídrido silícico'],
  ['CrO3', 'trióxido de cromo', 'óxido de cromo(VI)', 'anhídrido crómico'],
  ['Mn2O7', 'heptaóxido de dimanganeso', 'óxido de manganeso(VII)', 'anhídrido permangánico'],
  ['B2O3', 'trióxido de diboro', 'óxido de boro', 'anhídrido bórico'],
  ['SeO2', 'dióxido de selenio', 'óxido de selenio(IV)', 'anhídrido selenioso'],
  ['Na2O2', 'dióxido de disodio', 'peróxido de sodio', 'peróxido sódico'],
  ['H2O2', 'dióxido de dihidrógeno', 'peróxido de hidrógeno', null],
  ['BaO2', 'dióxido de bario', 'peróxido de bario', 'peróxido bárico'],
  ['K2O2', 'dióxido de dipotasio', 'peróxido de potasio', 'peróxido potásico'],
  ['NaH', 'hidruro de sodio', 'hidruro de sodio', 'hidruro sódico'],
  ['CaH2', 'dihidruro de calcio', 'hidruro de calcio', 'hidruro cálcico'],
  ['AlH3', 'trihidruro de aluminio', 'hidruro de aluminio', 'hidruro alumínico'],
  ['LiH', 'hidruro de litio', 'hidruro de litio', 'hidruro lítico'],
  ['MgH2', 'dihidruro de magnesio', 'hidruro de magnesio', 'hidruro magnésico'],
  ['NH3', 'trihidruro de nitrógeno', null, null],
  ['CH4', 'tetrahidruro de carbono', null, null],
  ['PH3', 'trihidruro de fósforo', null, null],
  ['SiH4', 'tetrahidruro de silicio', null, null],
  ['H2O', 'óxido de dihidrógeno', null, null],
  ['HF', 'fluoruro de hidrógeno', 'fluoruro de hidrógeno', 'ácido fluorhídrico'],
  ['HCl', 'cloruro de hidrógeno', 'cloruro de hidrógeno', 'ácido clorhídrico'],
  ['HBr', 'bromuro de hidrógeno', 'bromuro de hidrógeno', 'ácido bromhídrico'],
  ['HI', 'yoduro de hidrógeno', 'yoduro de hidrógeno', 'ácido yodhídrico'],
  ['H2S', 'sulfuro de dihidrógeno', 'sulfuro de hidrógeno', 'ácido sulfhídrico'],
  ['NaCl', 'cloruro de sodio', 'cloruro de sodio', 'cloruro sódico'],
  ['KBr', 'bromuro de potasio', 'bromuro de potasio', 'bromuro potásico'],
  ['CaF2', 'difluoruro de calcio', 'fluoruro de calcio', 'fluoruro cálcico'],
  ['FeCl2', 'dicloruro de hierro', 'cloruro de hierro(II)', 'cloruro ferroso'],
  ['FeCl3', 'tricloruro de hierro', 'cloruro de hierro(III)', 'cloruro férrico'],
  ['CuCl', 'monocloruro de cobre', 'cloruro de cobre(I)', 'cloruro cuproso'],
  ['CuCl2', 'dicloruro de cobre', 'cloruro de cobre(II)', 'cloruro cúprico'],
  ['Al2S3', 'trisulfuro de dialuminio', 'sulfuro de aluminio', 'sulfuro alumínico'],
  ['FeS', 'monosulfuro de hierro', 'sulfuro de hierro(II)', 'sulfuro ferroso'],
  ['Fe2S3', 'trisulfuro de dihierro', 'sulfuro de hierro(III)', 'sulfuro férrico'],
  ['AgI', 'yoduro de plata', 'yoduro de plata', 'yoduro argéntico'],
  ['Hg2Cl2', 'dicloruro de dimercurio', 'cloruro de mercurio(I)', 'cloruro mercurioso'],
  ['HgCl2', 'dicloruro de mercurio', 'cloruro de mercurio(II)', 'cloruro mercúrico'],
  ['Mg3N2', 'dinitruro de trimagnesio', 'nitruro de magnesio', 'nitruro magnésico'],
  ['NH4Cl', 'cloruro de amonio', 'cloruro de amonio', 'cloruro amónico'],
  ['PbI2', 'diyoduro de plomo', 'yoduro de plomo(II)', 'yoduro plumboso'],
  ['SnCl4', 'tetracloruro de estaño', 'cloruro de estaño(IV)', 'cloruro estánnico'],
  ['CCl4', 'tetracloruro de carbono', 'cloruro de carbono(IV)', null],
  ['PCl5', 'pentacloruro de fósforo', 'cloruro de fósforo(V)', null],
  ['PCl3', 'tricloruro de fósforo', 'cloruro de fósforo(III)', null],
  ['SF6', 'hexafluoruro de azufre', 'fluoruro de azufre(VI)', null],
  ['XeF2', 'difluoruro de xenón', 'fluoruro de xenón(II)', null],
  ['CS2', 'disulfuro de carbono', 'sulfuro de carbono(IV)', null],
  ['NCl3', 'tricloruro de nitrógeno', 'cloruro de nitrógeno(III)', null],
  ['NaOH', 'hidróxido de sodio', 'hidróxido de sodio', 'hidróxido sódico'],
  ['Ca(OH)2', 'dihidróxido de calcio', 'hidróxido de calcio', 'hidróxido cálcico'],
  ['Fe(OH)3', 'trihidróxido de hierro', 'hidróxido de hierro(III)', 'hidróxido férrico'],
  ['Fe(OH)2', 'dihidróxido de hierro', 'hidróxido de hierro(II)', 'hidróxido ferroso'],
  ['Al(OH)3', 'trihidróxido de aluminio', 'hidróxido de aluminio', 'hidróxido alumínico'],
  ['Cu(OH)2', 'dihidróxido de cobre', 'hidróxido de cobre(II)', 'hidróxido cúprico'],
  ['KOH', 'hidróxido de potasio', 'hidróxido de potasio', 'hidróxido potásico'],
  ['Pb(OH)4', 'tetrahidróxido de plomo', 'hidróxido de plomo(IV)', 'hidróxido plúmbico'],
  ['HClO', 'hidrogeno(oxidoclorato)', null, 'ácido hipocloroso'],
  ['HClO2', 'hidrogeno(dioxidoclorato)', null, 'ácido cloroso'],
  ['HClO3', 'hidrogeno(trioxidoclorato)', null, 'ácido clórico'],
  ['HClO4', 'hidrogeno(tetraoxidoclorato)', null, 'ácido perclórico'],
  ['HNO2', 'hidrogeno(dioxidonitrato)', null, 'ácido nitroso'],
  ['HNO3', 'hidrogeno(trioxidonitrato)', null, 'ácido nítrico'],
  ['H2SO3', 'dihidrogeno(trioxidosulfato)', null, 'ácido sulfuroso'],
  ['H2SO4', 'dihidrogeno(tetraoxidosulfato)', null, 'ácido sulfúrico'],
  ['H3PO4', 'trihidrogeno(tetraoxidofosfato)', null, 'ácido fosfórico'],
  ['H2CO3', 'dihidrogeno(trioxidocarbonato)', null, 'ácido carbónico'],
  ['HMnO4', 'hidrogeno(tetraoxidomanganato)', null, 'ácido permangánico'],
  ['H2CrO4', 'dihidrogeno(tetraoxidocromato)', null, 'ácido crómico'],
  ['H2Cr2O7', null, null, 'ácido dicrómico'],
  ['HIO4', 'hidrogeno(tetraoxidoyodato)', null, 'ácido peryódico'],
  ['H4SiO4', 'tetrahidrogeno(tetraoxidosilicato)', null, 'ácido silícico'],
  ['Fe2(SO4)3', 'tris(tetraoxidosulfato) de dihierro', 'sulfato de hierro(III)', 'sulfato férrico'],
  ['FeSO4', 'tetraoxidosulfato de hierro', 'sulfato de hierro(II)', 'sulfato ferroso'],
  ['CuSO4', 'tetraoxidosulfato de cobre', 'sulfato de cobre(II)', 'sulfato cúprico'],
  ['Na2SO4', 'tetraoxidosulfato de disodio', 'sulfato de sodio', 'sulfato sódico'],
  ['KMnO4', 'tetraoxidomanganato de potasio', 'permanganato de potasio', 'permanganato potásico'],
  ['K2Cr2O7', null, 'dicromato de potasio', 'dicromato potásico'],
  ['NaClO', 'oxidoclorato de sodio', 'hipoclorito de sodio', 'hipoclorito sódico'],
  ['KClO3', 'trioxidoclorato de potasio', 'clorato de potasio', 'clorato potásico'],
  ['CaCO3', 'trioxidocarbonato de calcio', 'carbonato de calcio', 'carbonato cálcico'],
  ['AgNO3', 'trioxidonitrato de plata', 'nitrato de plata', 'nitrato argéntico'],
  ['Ca3(PO4)2', 'bis(tetraoxidofosfato) de tricalcio', 'fosfato de calcio', 'fosfato cálcico'],
  ['Al2(SO4)3', 'tris(tetraoxidosulfato) de dialuminio', 'sulfato de aluminio', 'sulfato alumínico'],
  ['NH4NO3', 'trioxidonitrato de amonio', 'nitrato de amonio', 'nitrato amónico'],
  ['(NH4)2SO4', 'tetraoxidosulfato de diamonio', 'sulfato de amonio', 'sulfato amónico'],
  ['Na2S2O3', null, 'tiosulfato de sodio', 'tiosulfato sódico'],
  ['K2CrO4', 'tetraoxidocromato de dipotasio', 'cromato de potasio', 'cromato potásico'],
  ['Pb(NO3)2', 'bis(trioxidonitrato) de plomo', 'nitrato de plomo(II)', 'nitrato plumboso'],
  ['Hg2(NO3)2', 'bis(trioxidonitrato) de dimercurio', 'nitrato de mercurio(I)', 'nitrato mercurioso'],
  ['NaHCO3', 'hidrogeno(trioxidocarbonato) de sodio', 'hidrogenocarbonato de sodio', 'bicarbonato sódico'],
  ['KHSO4', 'hidrogeno(tetraoxidosulfato) de potasio', 'hidrogenosulfato de potasio', 'bisulfato potásico'],
  ['Ca(HCO3)2', 'bis[hidrogeno(trioxidocarbonato)] de calcio', 'hidrogenocarbonato de calcio', 'bicarbonato cálcico'],
  ['NaH2PO4', 'dihidrogeno(tetraoxidofosfato) de sodio', 'dihidrogenofosfato de sodio', null],
  ['Na2HPO4', 'hidrogeno(tetraoxidofosfato) de disodio', 'hidrogenofosfato de sodio', null],
  ['CuSO4·5H2O', 'tetraoxidosulfato de cobre pentahidratado', 'sulfato de cobre(II) pentahidratado', 'sulfato cúprico pentahidratado'],
  ['MgSO4·7H2O', 'tetraoxidosulfato de magnesio heptahidratado', 'sulfato de magnesio heptahidratado', 'sulfato magnésico heptahidratado'],
  ['CaSO4·2H2O', 'tetraoxidosulfato de calcio dihidratado', 'sulfato de calcio dihidratado', 'sulfato cálcico dihidratado']
]

const rengComp = (rengF: string): string => JSON.stringify([...rengAnalizarFormula(rengF).atomos].sort())

describe('fórmula ↔ nombre en tres nomenclaturas (ida y vuelta)', () => {
  it('hay al menos 100 pares', () => expect(RENG_PARES.length).toBeGreaterThanOrEqual(100))
  for (const [rengF, rengSist, rengStock, rengTrad] of RENG_PARES) {
    it(rengF, () => {
      const rengK = rengNombrar(rengF)
      expect(rengK.nombres.sistematica).toBe(rengSist)
      expect(rengK.nombres.stock).toBe(rengStock)
      expect(rengK.nombres.tradicional).toBe(rengTrad)
      expect(rengComp(rengK.formula)).toBe(rengComp(rengF))
      for (const rengN of [rengSist, rengStock, rengTrad].filter((rengX): rengX is string => rengX !== null)) {
        expect(rengFormularDesdeNombre(rengN).formula).toBe(rengK.formula)
        expect(rengFormularDesdeNombre(rengN.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()).formula).toBe(rengK.formula)
      }
    })
  }
  it('el ejemplo del enunciado: tres nombres de Fe₂(SO₄)₃', () => {
    for (const rengN of ['sulfato de hierro(III)', 'sulfato férrico', 'tris(tetraoxidosulfato) de dihierro', 'SULFATO FERRICO', 'sulfato de hierro (III)']) expect(rengFormularDesdeNombre(rengN).formula).toBe('Fe2(SO4)3')
  })
  it('nombres comunes aparte y recomendaciones IUPAC 2005', () => {
    expect(rengNombrar('H2O').nombres.comunes).toContain('agua')
    expect(rengNombrar('NH3').nombres).toMatchObject({ principal: 'amoniaco', comunes: ['amoniaco', 'azano'] })
    expect(rengNombrar('CH4').nombres.principal).toBe('metano')
    expect(rengFormularDesdeNombre('amoniaco').formula).toBe('NH3')
    expect(rengFormularDesdeNombre('agua oxigenada').formula).toBe('H2O2')
    expect(rengNombrar('H2SO4').nombres).toMatchObject({ principal: 'ácido sulfúrico', recomendadas: ['tradicional', 'sistematica'] })
    expect(rengNombrar('Fe2(SO4)3').nombres).toMatchObject({ principal: 'sulfato de hierro(III)', recomendadas: ['stock', 'sistematica'] })
    expect(rengNombrar('CO2').nombres.principal).toBe('dióxido de carbono')
  })
})

describe('excepciones', () => {
  it('Hg₂Cl₂ es mercurio(I) como Hg₂²⁺, no HgCl', () => {
    const rengK = rengNombrar('Hg2Cl2')
    expect(rengK.cation?.unidad).toBe('Hg2')
    expect(rengEstadosDe(rengK)).toContainEqual({ el: 'Hg', ox: 1 })
    expect(() => rengNombrar('HgCl')).toThrow()
  })
  it('peróxidos: O −1 y sin simplificar', () => {
    for (const rengF of ['H2O2', 'Na2O2']) {
      const rengK = rengNombrar(rengF)
      expect(rengK.funcion).toBe('peroxido')
      expect(rengEstadosDe(rengK)).toContainEqual({ el: 'O', ox: -1 })
      expect(rengK.formula).toBe(rengF)
    }
    const rengSimp = rengPasosFormulacion(rengNombrar('H2O2')).find((rengP) => rengP.id === 'simplificar')!
    expect(rengSimp.texto).toMatch(/no se simplifica el O₂/)
  })
  it('Fe₃O₄ es un óxido mixto: se dice y no se fuerza un nombre de Stock', () => {
    const rengK = rengInterpretar('Fe3O4').compuesto
    expect(rengK.funcion).toBe('oxido-mixto')
    expect(rengK.nombres.stock).toBeNull()
    expect(rengK.nombres.tradicional).toBeNull()
    expect(rengK.nombres.sistematica).toBe('tetraóxido de trihierro')
    expect(rengK.nombres.notas.join(' ')).toMatch(/Óxido mixto/)
  })
  it('KMnO₄, K₂Cr₂O₇, NaHCO₃ y CuSO₄·5H₂O', () => {
    expect(rengEstadosDe(rengNombrar('KMnO4'))).toContainEqual({ el: 'Mn', ox: 7 })
    expect(rengEstadosDe(rengNombrar('K2Cr2O7'))).toContainEqual({ el: 'Cr', ox: 6 })
    expect(rengNombrar('NaHCO3').funcion).toBe('sal-acida')
    expect(rengNombrar('CuSO4·5H2O')).toMatchObject({ funcion: 'sal-hidratada', agua: 5 })
  })
})

describe('imposibles y desconocidos: explicación, nunca una fórmula inventada', () => {
  it.each([
    ['óxido de sodio(III)', /sodio no tiene número de oxidación \+3/],
    ['óxido de neón', /neón es un gas noble/],
    ['cloruro de hierro', /Falta el número de oxidación/],
    ['sulfato de calcio(II)(II)', /./],
    ['pentacloruro de sodio', /No reconozco/],
    ['permanganato de unobtanio', /No reconozco/]
  ])('nombre «%s»', (rengN, rengRe) => expect(() => rengFormularDesdeNombre(rengN)).toThrow(rengRe))
  it.each([
    ['NaCl3', /sodio no tiene número de oxidación \+3/],
    ['NeO', /neón es un gas noble/],
    ['Na2O3', /sodio no tiene número de oxidación \+3/],
    ['CaCl', /calcio no tiene número de oxidación \+1/],
    ['C6H12O6', /No sé nombrar/]
  ])('fórmula %s', (rengF, rengRe) => expect(() => rengInterpretar(rengF)).toThrow(rengRe))
})

describe('clasificación de la función (40 fórmulas)', () => {
  const RENG_CASOS: Array<[string, RengFuncion]> = [
    ['Na2O', 'oxido-basico'], ['Fe2O3', 'oxido-basico'], ['CuO', 'oxido-basico'], ['CaO', 'oxido-basico'],
    ['CO2', 'oxido-acido'], ['SO3', 'oxido-acido'], ['Cl2O7', 'oxido-acido'], ['Mn2O7', 'oxido-acido'], ['CrO3', 'oxido-acido'],
    ['Fe3O4', 'oxido-mixto'], ['Na2O2', 'peroxido'], ['H2O2', 'peroxido'], ['BaO2', 'peroxido'],
    ['NaH', 'hidruro-metalico'], ['CaH2', 'hidruro-metalico'], ['NH3', 'hidruro-no-metalico'], ['CH4', 'hidruro-no-metalico'], ['H2O', 'hidruro-no-metalico'],
    ['HCl', 'hidracido'], ['H2S', 'hidracido'], ['NaCl', 'sal-binaria'], ['FeCl3', 'sal-binaria'], ['Hg2Cl2', 'sal-binaria'], ['NH4Cl', 'sal-binaria'],
    ['PCl5', 'binario-no-metalico'], ['SF6', 'binario-no-metalico'],
    ['NaOH', 'hidroxido'], ['Fe(OH)3', 'hidroxido'], ['H2SO4', 'oxoacido'], ['HNO3', 'oxoacido'], ['HClO', 'oxoacido'],
    ['KMnO4', 'oxisal'], ['Fe2(SO4)3', 'oxisal'], ['NaHCO3', 'sal-acida'], ['KHSO4', 'sal-acida'], ['CuSO4·5H2O', 'sal-hidratada'],
    ['Fe^3+', 'cation'], ['NH4+', 'cation'], ['Cl-', 'anion'], ['SO4^2-', 'oxoanion']
  ]
  it('hay 40 casos', () => expect(RENG_CASOS).toHaveLength(40))
  for (const [rengF, rengFn] of RENG_CASOS) it(`${rengF} → ${rengFn}`, () => expect(rengInterpretar(rengF).compuesto.funcion).toBe(rengFn))
})

describe('iones (tabla con fuente)', () => {
  it('la tabla de oxoaniones incluye los pedidos y todo lleva fuente', () => {
    const rengPedidos = ['ClO', 'ClO2', 'ClO3', 'ClO4', 'BrO3', 'IO3', 'IO4', 'NO2', 'NO3', 'SO3', 'SO4', 'S2O3', 'PO4', 'HPO4', 'H2PO4', 'CO3', 'HCO3', 'SiO4', 'CrO4', 'Cr2O7', 'MnO4']
    for (const rengU of rengPedidos) expect(RENG_ANIONES.some((rengA) => rengA.unidad === rengU), rengU).toBe(true)
    expect(RENG_OXOANIONES.filter((rengA) => rengA.unidad === 'MnO4').map((rengA) => rengA.carga).sort((rengX, rengY) => rengX - rengY)).toEqual([-2, -1])
    for (const rengA of RENG_ANIONES) expect(rengA.fuente.trim()).not.toBe('')
    for (const rengC of RENG_CATIONES_POLIATOMICOS) expect(rengC.fuente.trim()).not.toBe('')
    expect(RENG_CATIONES_POLIATOMICOS.map((rengC) => rengC.unidad)).toEqual(['NH4', 'H3O', 'Hg2'])
  })
  it('nombres de iones', () => {
    expect(rengInterpretar('Fe^3+').compuesto.nombres).toMatchObject({ stock: 'ion hierro(III)', tradicional: 'ion férrico', sistematica: 'hierro(3+)' })
    expect(rengInterpretar('MnO4^-').compuesto.nombres).toMatchObject({ tradicional: 'ion permanganato', sistematica: 'tetraoxidomanganato(1−)' })
    expect(rengInterpretar('MnO4^2-').compuesto.nombres.tradicional).toBe('ion manganato')
    expect(rengInterpretar('H3O+').compuesto.nombres.stock).toBe('ion oxonio')
    expect(rengFormularDesdeNombre('ion amonio').formula).toBe('NH4^+')
  })
})

describe('«¿Cómo se formula?» como datos', () => {
  it('Fe₂(SO₄)₃: oxoácido → oxoanión → iones → cruzar → simplificar → comprobar', () => {
    const rengP = rengPasosFormulacion(rengNombrar('Fe2(SO4)3'))
    expect(rengP.map((rengX) => rengX.id)).toEqual(['oxoanion', 'identificar', 'iones', 'cruzar', 'simplificar', 'comprobar'])
    expect(rengP.find((rengX) => rengX.id === 'cruzar')!.cruce).toMatchObject({ cation: 'Fe', anion: 'SO4', cruzadoCat: 2, cruzadoAn: 3, finalCat: 2, finalAn: 3 })
    expect(rengP.find((rengX) => rengX.id === 'comprobar')!.texto).toMatch(/= 0/)
  })
  it('MgO: se cruza Mg₂O₂ y se simplifica entre 2', () => {
    const rengP = rengPasosFormulacion(rengNombrar('MgO'))
    expect(rengP.find((rengX) => rengX.id === 'cruzar')!.notacion).toBe('Mg2O2')
    expect(rengP.find((rengX) => rengX.id === 'simplificar')!.texto).toMatch(/entre 2/)
  })
  it('oxoácido: óxido ácido + agua con la ecuación ajustada', () => {
    expect(rengPasosFormulacion(rengNombrar('H2SO4')).find((rengX) => rengX.id === 'oxido-agua')!.notacion).toBe('SO₃ + H₂O -> H₂SO₄')
    expect(rengPasosFormulacion(rengNombrar('HClO4')).find((rengX) => rengX.id === 'oxido-agua')!.notacion).toBe('Cl₂O₇ + H₂O -> 2HClO₄')
    expect(rengPasosFormulacion(rengNombrar('H3PO4')).find((rengX) => rengX.id === 'oxido-agua')!.notacion).toBe('P₂O₅ + 3H₂O -> 2H₃PO₄')
  })
  it('todas las notaciones de los pasos se pueden leer', () => {
    for (const rengF of RENG_PARES.map((rengP) => rengP[0])) for (const rengP of rengPasosFormulacion(rengNombrar(rengF))) expect(() => rengAnalizarNotacion(rengP.notacion), rengP.notacion).not.toThrow()
  })
})

describe('redes: rutilo y CsCl', () => {
  it('rutilo TiO₂ 6:3 con 2 unidades por celda; CsCl 8:8', () => {
    const rengR = RENG_ESTRUCTURAS.TiO2!
    expect(rengCoordinacion(rengR, 'Ti4+').nc).toBe(6)
    expect(rengCoordinacion(rengR, 'O2-').nc).toBe(3)
    expect(rengUnidadesFormula(rengR)).toBe(2)
    expect(rengCoordinacion(rengR, 'Ti4+').distancia).toBeGreaterThan(1.9)
    expect(rengCoordinacion(rengR, 'Ti4+').distancia).toBeLessThan(2.0)
    expect(rengCoordinacion(RENG_ESTRUCTURAS.CsCl!, 'Cs+').nc).toBe(8)
    expect(rengCoordinacion(RENG_ESTRUCTURAS.CsCl!, 'Cl-').nc).toBe(8)
    expect(rengR.fuente.trim()).not.toBe('')
  })
})

describe('práctica: generación y detección de errores típicos', () => {
  it('banco por niveles y ejercicios reproducibles con respuestas calculadas', () => {
    const rengB = rengBanco()
    expect(rengB[1].length).toBeGreaterThan(20)
    expect(rengB[2].length).toBeGreaterThan(20)
    expect(rengB[3].length).toBeGreaterThan(20)
    expect(rengGenerarEjercicios(2, 5, 42)).toEqual(rengGenerarEjercicios(2, 5, 42))
    for (const rengN of [1, 2, 3] as const) {
      for (const rengE of rengGenerarEjercicios(rengN, 5, 7)) {
        const rengResp = rengE.tipo === 'formular' ? rengE.compuesto.formula : rengE.compuesto.nombres.principal
        expect(rengCorregir(rengE, rengResp).correcta, `${rengE.enunciado} → ${rengResp}`).toBe(true)
      }
    }
  })
  const rengFormular = (rengF: string): RengEjercicio => ({ id: 'x', tipo: 'formular', nivel: 1, enunciado: '', compuesto: rengNombrar(rengF) })
  const rengNombrarEj = (rengF: string): RengEjercicio => ({ id: 'x', tipo: 'nombrar', nivel: 1, enunciado: rengF, compuesto: rengNombrar(rengF) })
  it('no simplificar', () => expect(rengCorregir(rengFormular('MgO'), 'Mg2O2').error).toBe('sin-simplificar'))
  it('número de oxidación equivocado (fórmula)', () => expect(rengCorregir(rengFormular('FeCl3'), 'FeCl2').error).toBe('numero-oxidacion'))
  it('número de oxidación equivocado (nombre)', () => expect(rengCorregir(rengNombrarEj('FeCl3'), 'cloruro de hierro(II)').error).toBe('numero-oxidacion'))
  it('prefijo mal puesto', () => expect(rengCorregir(rengNombrarEj('Fe2O3'), 'dióxido de dihierro').error).toBe('prefijo'))
  it('-oso/-ico al revés', () => expect(rengCorregir(rengNombrarEj('FeCl3'), 'cloruro ferroso').error).toBe('oso-ico'))
  it('paréntesis olvidado en (OH)₂ y (SO₄)₃', () => {
    expect(rengCorregir(rengFormular('Ca(OH)2'), 'CaOH2').error).toBe('parentesis')
    expect(rengCorregir(rengFormular('Fe2(SO4)3'), 'Fe2SO43').error).toBe('parentesis')
  })
  it('acepta sin tildes ni mayúsculas, pero solo nombres correctos', () => {
    expect(rengCorregir(rengNombrarEj('Fe2(SO4)3'), 'SULFATO FERRICO').correcta).toBe(true)
    expect(rengCorregir(rengNombrarEj('Fe2(SO4)3'), 'tris(tetraoxidosulfato) de dihierro').correcta).toBe(true)
    expect(rengCorregir(rengNombrarEj('Fe2(SO4)3'), 'sulfato de hierro').correcta).toBe(false)
    expect(rengCorregir(rengFormular('Ca(OH)2'), 'Ca(OH)2').correcta).toBe(true)
  })
})
