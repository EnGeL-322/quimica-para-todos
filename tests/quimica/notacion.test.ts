import { describe, expect, it } from 'vitest'
import { rengAjustarEcuacion } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'
import { RENG_GLOSARIO, rengMarcarTerminos } from '../../src/renderer/modules/simulador-quimica/nucleo/glosario'
import { rengAnalizarEspecie, rengAnalizarNotacion, rengElementosDe, rengTextoPlano } from '../../src/renderer/modules/simulador-quimica/nucleo/notacion'

const RENG_CASOS: Array<[string, string]> = [
  ['H2O', 'H₂O'],
  ['H2SO4', 'H₂SO₄'],
  ['Ca(OH)2', 'Ca(OH)₂'],
  ['Al2(SO4)3', 'Al₂(SO₄)₃'],
  ['CuSO4·5H2O', 'CuSO₄·5H₂O'],
  ['CuSO4*5H2O', 'CuSO₄·5H₂O'],
  ['Na2CO3·10H2O', 'Na₂CO₃·10H₂O'],
  ['K4[Fe(CN)6]', 'K₄[Fe(CN)₆]'],
  ['[Cu(NH3)4]^2+', '[Cu(NH₃)₄]²⁺'],
  ['Ca3(PO4)2', 'Ca₃(PO₄)₂'],
  ['(NH4)2SO4', '(NH₄)₂SO₄'],
  ['Mg(Al(OH)4)2', 'Mg(Al(OH)₄)₂'],
  ['C6H12O6', 'C₆H₁₂O₆'],
  ['CH3COOH', 'CH₃COOH'],
  ['Fe^3+', 'Fe³⁺'],
  ['Fe3+', 'Fe³⁺'],
  ['SO4^2-', 'SO₄²⁻'],
  ['SO4{2-}', 'SO₄²⁻'],
  ['NH4+', 'NH₄⁺'],
  ['MnO4-', 'MnO₄⁻'],
  ['Cr2O7^2-', 'Cr₂O₇²⁻'],
  ['PO4^3-', 'PO₄³⁻'],
  ['e-', 'e⁻'],
  ['NaCl(s)', 'NaCl(s)'],
  ['Na+(aq)', 'Na⁺(aq)'],
  ['SO4^2-(aq)', 'SO₄²⁻(aq)'],
  ['H₂O(l)', 'H₂O(l)'],
  ['2H2(g) + O2(g) -> 2H2O(l)', '2H₂(g) + O₂(g) → 2H₂O(l)'],
  ['H2 + 1/2 O2 -> H2O', 'H₂ + 1/2O₂ → H₂O'],
  ['N2 + 3H2 <=> 2NH3', 'N₂ + 3H₂ ⇌ 2NH₃'],
  ['N2 + 3H2 ⇌ 2NH3', 'N₂ + 3H₂ ⇌ 2NH₃'],
  ['C2H4 + H2 ->[Pt, 25 °C] C2H6', 'C₂H₄ + H₂ →[Pt, 25 °C] C₂H₆'],
  ['C2H4 + H2 -[Ni]-> C2H6', 'C₂H₄ + H₂ →[Ni] C₂H₆'],
  ['N2 + 3H2 <=>[Fe|450 °C] 2NH3', 'N₂ + 3H₂ ⇌[Fe; 450 °C] 2NH₃'],
  ['Na -> Na+ + e-', 'Na → Na⁺ + e⁻'],
  ['Cl + e- -> Cl-', 'Cl + e⁻ → Cl⁻'],
  ['Fe3+ + e- -> Fe2+', 'Fe³⁺ + e⁻ → Fe²⁺'],
  ['Ag+(aq) + Cl-(aq) -> AgCl(s)', 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)'],
  ['CaCO3(s) = CaO(s) + CO2(g)', 'CaCO₃(s) → CaO(s) + CO₂(g)'],
  ['Cu2+ + 4NH3 -> [Cu(NH3)4]^2+', 'Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺']
]

describe('notación química (40 casos)', () => {
  it('hay 40 casos', () => expect(RENG_CASOS).toHaveLength(40))
  for (const [rengEntrada, rengEsperado] of RENG_CASOS) {
    it(rengEntrada, () => expect(rengTextoPlano(rengAnalizarNotacion(rengEntrada))).toBe(rengEsperado))
  }
})

describe('estructura de la notación', () => {
  it('distingue subíndices de números de hidrato y guarda la carga', () => {
    const rengE = rengAnalizarEspecie('CuSO4·5H2O')
    expect(rengE.piezas.filter((rengP) => rengP.t === 'num').map((rengP) => ('v' in rengP ? rengP.v : ''))).toEqual(['5'])
    expect(rengE.piezas.filter((rengP) => rengP.t === 'sub').map((rengP) => ('v' in rengP ? rengP.v : ''))).toEqual(['4', '2'])
    expect(rengAnalizarEspecie('SO4^2-').carga).toBe(-2)
    expect(rengAnalizarEspecie('2H2O(l)')).toMatchObject({ coef: '2', estado: 'l', formula: 'H2O' })
  })

  it('lee flechas y condiciones arriba/abajo', () => {
    const rengN = rengAnalizarNotacion('N2 + 3H2 <=>[Fe|450 °C, 200 atm] 2NH3')
    expect(rengN.flecha).toEqual({ tipo: 'equilibrio', arriba: 'Fe', abajo: '450 °C, 200 atm' })
    expect(rengAnalizarNotacion('H2O').flecha).toBeNull()
    expect(rengElementosDe(rengN)).toEqual(['N', 'H'])
  })

  it('un complejo tras la flecha con espacio no se confunde con condiciones', () => {
    const rengN = rengAnalizarNotacion('Cu2+ + 4NH3 -> [Cu(NH3)4]^2+')
    expect(rengN.flecha?.arriba).toBeNull()
    expect(rengN.derecha[0]!.formula).toBe('[Cu(NH3)4]^2+')
  })

  it('rechaza lo mal escrito con mensajes claros', () => {
    expect(() => rengAnalizarNotacion('')).toThrow()
    expect(rengAnalizarNotacion('Na + Cl').izquierda).toHaveLength(2)
    expect(() => rengAjustarEcuacion('H2 + O2')).toThrow(/flecha/)
    expect(() => rengAnalizarNotacion('A -> B -> C')).toThrow()
    expect(() => rengAnalizarNotacion('H2 + O2 -> Xy')).toThrow(/desconocido/)
    expect(() => rengAnalizarNotacion('Ca(OH -> CaO')).toThrow(/Paréntesis/)
    expect(() => rengAnalizarNotacion('-> H2O')).toThrow(/Faltan/)
  })

  it('el ajuste acepta estados y condiciones gracias a la notación', () => {
    expect(rengAjustarEcuacion('H2(g) + O2(g) ->[chispa] H2O(l)').texto).toBe('2H₂ + O₂ → 2H₂O')
  })
})

describe('glosario', () => {
  it('cada entrada tiene definición y fuente', () => {
    for (const rengG of RENG_GLOSARIO) {
      expect(rengG.definicion.length).toBeGreaterThan(20)
      expect(rengG.fuente.trim()).not.toBe('')
    }
    expect(new Set(RENG_GLOSARIO.map((rengG) => rengG.id)).size).toBe(RENG_GLOSARIO.length)
  })

  it('marca la primera aparición de cada término y respeta los límites de palabra', () => {
    const rengS = rengMarcarTerminos('Un catión y un anión forman un enlace iónico; otro catión más.')
    expect(rengS.filter((rengX) => rengX.termino).map((rengX) => rengX.texto)).toEqual(['catión', 'anión', 'enlace iónico'])
    expect(rengS.map((rengX) => rengX.texto).join('')).toBe('Un catión y un anión forman un enlace iónico; otro catión más.')
    expect(rengMarcarTerminos('18 g/mol').some((rengX) => rengX.termino)).toBe(false)
    expect(rengMarcarTerminos('una molécula').find((rengX) => rengX.termino)?.termino).toBe('molecula')
  })
})
