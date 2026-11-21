import { describe, expect, it } from 'vitest'
import { RENG_CODIGOS_PARES, RENG_FARADAY, RENG_FUENTES_E, RENG_PARES_DESCARTADOS, RENG_PARES_ELECTRO, RENG_R_GASES, RENG_TOLERANCIA_CONTRASTE_E, rengConstruirConstante, rengConstruirPar, rengLeerEFilaContraste, rengLeerEFilaWikipedia, rengLeerValorCodata, rengParRegistrado, rengValidarFuenteE, type RengDefinicionPar, type RengFuenteE, type RengParElectroquimico } from '../../src/renderer/modules/simulador-quimica/datos/electroquimica'
import { rengAnalizarCelda, rengEcuacionCelda, rengMcm, rengPotencialSemicelda, rengSerieNernst, type RengParametrosCelda, type RengSemiceldaCore } from '../../src/renderer/modules/simulador-quimica/nucleo/electroquimica'
import { RENG_R } from '../../src/renderer/modules/simulador-quimica/nucleo/termoquimica'

const F = 96485.33212
const R = 8.314462618
const T = 298.15
const rengRel = (rengA: number, rengB: number): number => Math.abs(rengA - rengB) / Math.abs(rengB)

const rengCore = (rengP: RengParElectroquimico): RengSemiceldaCore => ({ id: rengP.id, oxidante: rengP.oxidante.formula, reductor: rengP.reductor.formula, nu: rengP.oxidante.nu, carga: rengP.oxidante.carga, n: rengP.n, E0: rengP.E0, gas: rengP.reductor.estado === 'g' })
const rengCelda = (rengAn: string, rengCa: string, rengCA = 1, rengCC = 1): RengParametrosCelda => ({ anodo: rengCore(rengParRegistrado(rengAn)), catodo: rengCore(rengParRegistrado(rengCa)), cA: rengCA, cC: rengCC, F: RENG_FARADAY.valor, R: RENG_R_GASES.valor })

describe('D4.3 · registro: solo entra lo respaldado por una fuente abierta', () => {
  it('el catálogo es exactamente Zn, Cu, Fe, Mg, Al y el electrodo de hidrógeno, con el valor parseado de la fila literal', () => {
    expect(RENG_PARES_ELECTRO.map((rengP) => rengP.id)).toEqual(['zn', 'cu', 'fe', 'mg', 'al', 'h2'])
    expect([...RENG_CODIGOS_PARES]).toEqual(RENG_PARES_ELECTRO.map((rengP) => rengP.id))
    expect(RENG_PARES_ELECTRO.map((rengP) => rengP.E0)).toEqual([-0.7618, 0.337, -0.44, -2.372, -1.662, 0])
    expect(RENG_PARES_ELECTRO.map((rengP) => rengP.n)).toEqual([2, 2, 2, 2, 3, 2])
    for (const rengP of RENG_PARES_ELECTRO) {
      expect(rengP.E0, rengP.id).toBe(rengLeerEFilaWikipedia(rengP.registro.filaLiteral).E0)
      expect(rengP.oxidante.nu * rengP.oxidante.carga, rengP.id).toBe(rengP.n)
    }
  })

  it('la fuente elegida declara condiciones (T, convenio SHE, actividad, presión), alcance de la lectura y licencia', () => {
    for (const rengP of RENG_PARES_ELECTRO) {
      const rengF = rengP.fuente
      expect(rengF.id).toBe('wikipedia-datos-e')
      expect(rengF.url).toBe('https://en.wikipedia.org/wiki/Standard_electrode_potential_(data_page)')
      expect(rengF.consultada).toBe('2026-11-15')
      expect(rengF.temperatura).toMatch(/298,15 K \(25,00 °C\)/)
      expect(rengF.convenio).toMatch(/SHE/)
      expect(rengF.actividad).toMatch(/actividad 1/)
      expect(rengF.presion).toMatch(/101,325 kPa/)
      expect(rengF.alcanceLectura).toMatch(/No leí la página entera/)
      expect(rengF.licencia).toMatch(/CC BY-SA 4\.0/)
      expect(rengF.condicionReutilizacion).toMatch(/términos adicionales/)
    }
  })

  it('cada fila cita su referencia (el H₂ no: se dice)', () => {
    expect(rengParRegistrado('zn').registro.referenciaFila).toMatch(/Vanýsek/)
    expect(rengParRegistrado('cu').registro.referenciaFila).toMatch(/Bard/)
    expect(rengParRegistrado('fe').registro.referenciaFila).toMatch(/Atkins/)
    expect(rengParRegistrado('al').registro.referenciaFila).toMatch(/Lide/)
    expect(rengParRegistrado('h2').registro.referenciaFila).toMatch(/no cita referencia/)
  })

  it('las otras tablas abiertas discrepan y se registran sin usarse (Harvey, sin condiciones declaradas)', () => {
    const rengHarvey = Object.fromEntries(RENG_PARES_ELECTRO.map((rengP) => [rengP.id, rengP.otrasConValor[0]!.E0]))
    expect(rengHarvey).toEqual({ zn: -0.7618, cu: 0.3419, fe: -0.44, mg: -2.356, al: -1.676, h2: 0 })
    for (const rengP of RENG_PARES_ELECTRO) {
      expect(rengP.otrasConValor[0]!.fuente.id).toBe('harvey-16-13')
      expect(rengP.otrasConValor[0]!.fuente.temperatura).toMatch(/no declarado/)
      expect(Math.abs(rengP.otrasConValor[0]!.E0 - rengP.E0), rengP.id).toBeLessThanOrEqual(RENG_TOLERANCIA_CONTRASTE_E)
    }
    expect(Math.abs(rengParRegistrado('cu').otrasConValor[0]!.E0 - rengParRegistrado('cu').E0)).toBeCloseTo(0.0049, 6)
    expect(RENG_FUENTES_E.find((rengF) => rengF.id === 'harvey-16-13')!.condicionReutilizacion).toMatch(/no declara las condiciones/)
  })

  it('el catálogo no incluye sustancias tóxicas ni reactivas, y los descartados tienen su motivo', () => {
    const rengTexto = RENG_PARES_ELECTRO.map((rengP) => `${rengP.nombre} ${rengP.oxidante.formula} ${rengP.reductor.formula}`).join(' ')
    expect(rengTexto).not.toMatch(/Ag|Pb|Hg|Cd|Cr|Ni|Sn|Na⁺|Li|Cl|Br|F₂/)
    expect(RENG_PARES_DESCARTADOS.map((rengD) => rengD.par).join(' | ')).toMatch(/Ni.*Sn.*\| Fe³⁺\/Fe²⁺ \| Ag.*Pb.*Hg.*Cd.*cromo\(VI\)\) \| Na.*Li.*K.*Ca \| Cl₂/)
    for (const rengD of RENG_PARES_DESCARTADOS) expect(rengD.motivo.length).toBeGreaterThan(20)
  })

  it('un par fuera del catálogo o sin fuente registrada NO puede cargarse', () => {
    for (const rengId of ['ni', 'sn', 'ag', 'pb', 'hg', 'cd', 'na', 'cl2', '', 'ZN']) expect(() => rengParRegistrado(rengId), rengId).toThrow(/no tiene fuente de potencial registrada/)
    const rengBase = RENG_PARES_ELECTRO[0]!
    const rengDef = (rengX: Partial<RengDefinicionPar>): RengDefinicionPar => ({ id: rengBase.id, nombre: rengBase.nombre, oxidante: rengBase.oxidante, reductor: rengBase.reductor, n: rengBase.n, registro: rengBase.registro, otrasFuentes: rengBase.otrasFuentes, nota: '', ...rengX })
    expect(() => rengConstruirPar(rengDef({}))).not.toThrow()
    expect(() => rengConstruirPar(rengDef({ registro: undefined as never }))).toThrow(/no tiene fuente de potencial registrada/)
    expect(() => rengConstruirPar(rengDef({ registro: { ...rengBase.registro, fuenteId: '' } }))).toThrow(/no tiene fuente de potencial registrada/)
    expect(() => rengConstruirPar(rengDef({ registro: { ...rengBase.registro, fuenteId: 'inventada' } }))).toThrow(/no está registrada/)
    for (const rengCampo of ['titulo', 'url', 'alcanceLectura', 'origenDato', 'temperatura', 'convenio', 'actividad', 'presion', 'fuerzaIonica', 'licencia', 'condicionReutilizacion', 'consultada'] as const) {
      const rengFuentes: RengFuenteE[] = [{ ...RENG_FUENTES_E.find((rengF) => rengF.id === 'wikipedia-datos-e')!, [rengCampo]: '' }, ...RENG_FUENTES_E.filter((rengF) => rengF.id !== 'wikipedia-datos-e')]
      expect(() => rengConstruirPar(rengDef({}), rengFuentes), rengCampo).toThrow(/no puede respaldar|no tiene/)
    }
    expect(() => rengValidarFuenteE({ ...RENG_FUENTES_E[0]!, url: 'http://sin-cifrado.example' })).toThrow(/https/)
    expect(() => rengValidarFuenteE({ ...RENG_FUENTES_E[0]!, consultada: 'ayer' })).toThrow(/fecha/)
  })

  it('un valor no respaldado por su fila (electrones incoherentes, transcripción errónea frente a la otra tabla, fila ilegible) tampoco carga', () => {
    const rengBase = RENG_PARES_ELECTRO[1]!
    const rengDef = (rengX: Partial<RengDefinicionPar>): RengDefinicionPar => ({ id: 'x', nombre: 'x', oxidante: rengBase.oxidante, reductor: rengBase.reductor, n: rengBase.n, registro: rengBase.registro, otrasFuentes: rengBase.otrasFuentes, nota: '', ...rengX })
    expect(() => rengConstruirPar(rengDef({ registro: { ...rengBase.registro, filaLiteral: 'Cu | Cu2+ + 2 e– ⇌ [Cu(s)] | 0.737 | 2 | [13]' } }))).toThrow(/difiere más de 0,05|difiere más de 0\.05/)
    expect(() => rengConstruirPar(rengDef({ registro: { ...rengBase.registro, filaLiteral: 'Cu | Cu2+ + 2 e– ⇌ [Cu(s)] | 0.337 | 3 | [13]' } }))).toThrow(/no coincide con el de la semirreacción/)
    expect(() => rengConstruirPar(rengDef({ n: 3 }))).toThrow(/incoherente/)
    expect(() => rengConstruirPar(rengDef({ registro: { ...rengBase.registro, filaLiteral: 'Cu sin valor' } }))).toThrow(/no tiene las columnas/)
    expect(() => rengConstruirPar(rengDef({ registro: { ...rengBase.registro, filaLiteral: 'Cu | Cu2+ ⇌ [Cu(s)] | 0.337 | 2 | [13]' } }))).toThrow(/no muestra electrones/)
  })

  it('lectura de las filas de las dos tablas (signo menos tipográfico, raya, notación LaTeX)', () => {
    expect(rengLeerEFilaWikipedia('Zn | Zn2+ + 2 e– ⇌ [Zn(s)] | −0.7618 | 2 | [10]')).toEqual({ E0: -0.7618, n: 2, nReaccion: 2 })
    expect(rengLeerEFilaWikipedia('H | 2 H+ + 2 e– ⇌ H2(g) | 0 | 2')).toEqual({ E0: 0, n: 2, nReaccion: 2 })
    expect(rengLeerEFilaContraste('| \\(\\text{Zn}^{2+} + 2e^- \\rightleftharpoons \\text{Zn}(s)\\) | –0.7618 |  |')).toBe(-0.7618)
    expect(rengLeerEFilaContraste('| \\(2\\text{H}^+ + 2e^- \\rightleftharpoons \\text{H}\\_2 (g)\\) | 0.00000 |  |')).toBe(0)
    expect(() => rengLeerEFilaContraste('sin número')).toThrow(/No se pudo leer/)
  })
})

describe('D4.3 · constantes CODATA: F y R desde la fila literal de NIST (2018 y 2022 abiertas)', () => {
  it('F = 96 485.332 12 C/mol y R = 8.314 462 618 J/(mol·K), exactas, con los dígitos que muestra el listado', () => {
    expect(RENG_FARADAY.valor).toBe(96485.33212)
    expect(RENG_R_GASES.valor).toBe(8.314462618)
    expect(RENG_R_GASES.valor).toBe(RENG_R)
    expect(RENG_FARADAY.fuente.id).toBe('nist-codata-2018')
    expect(RENG_FARADAY.contraste.fuente.id).toBe('nist-codata-2022')
    expect(RENG_FARADAY.contraste.valor).toBe(RENG_FARADAY.valor)
    expect(RENG_FARADAY.fuente.titulo).toMatch(/CODATA 2018/)
    expect(RENG_FARADAY.contraste.fuente.titulo).toMatch(/CODATA 2022/)
    expect(RENG_FARADAY.fuente.convenio).toMatch(/\(exact\)/)
    expect(RENG_FARADAY.fuente.licencia).toMatch(/no declarada/)
  })

  it('F coincide con N_A·e a partir de los valores exactos del propio listado (comprobación independiente)', () => {
    expect(rengRel(6.02214076e23 * 1.602176634e-19, RENG_FARADAY.valor)).toBeLessThan(1e-10)
  })

  it('una fila no exacta o ilegible no se acepta', () => {
    expect(() => rengLeerValorCodata('electron mass                                              9.109 383 7139 e-31      0.000 000 0028 e-31      kg')).toThrow(/no está marcada como exacta/)
    expect(() => rengLeerValorCodata('molar gas constant     (exact)  J')).toThrow(/No se pudo leer/)
    expect(rengLeerValorCodata('Faraday constant                                            96 485.332 12...         (exact)                  C mol^-1')).toBe(96485.33212)
    const rengSinFuente = RENG_FUENTES_E.filter((rengF) => rengF.id !== 'nist-codata-2022')
    expect(() => rengConstruirConstante('F', rengSinFuente)).toThrow(/no está registrada/)
  })
})

describe('D4.3 · E° de la celda, ΔG° y K contra cifras resueltas a mano', () => {
  it('Zn (ánodo) | Cu (cátodo): E° = 0,337 − (−0,7618) = 1,0988 V; n = 2; ΔG° = −212,04 kJ/mol; ln K = 85,53; log K = 37,147', () => {
    const rengR = rengAnalizarCelda(rengCelda('zn', 'cu'))
    expect(rengR.E0Celda).toBeCloseTo(1.0988, 12)
    expect(rengR.nCelda).toBe(2)
    expect(rengR.deltaG0 / 1000).toBeCloseTo(-212.04, 2)
    expect(rengR.lnK).toBeCloseTo(85.534, 2)
    expect(rengR.lnK / Math.LN10).toBeCloseTo(37.147, 2)
    expect(rengR.K).toBeGreaterThan(1.4e37)
    expect(rengR.K).toBeLessThan(1.41e37)
    expect(rengR.ecuacion).toBe('Zn + Cu²⁺ → Zn²⁺ + Cu')
    expect(rengR.espontaneaEstandar).toBe(true)
    expect(rengR.catodoReal).toBe('propuesto')
  })

  it('Mg | Al (n = 6): E° = −1,662 − (−2,372) = 0,710 V; 3 Mg + 2 Al³⁺ → 3 Mg²⁺ + 2 Al; ΔG° = −411,03 kJ/mol', () => {
    const rengR = rengAnalizarCelda(rengCelda('mg', 'al'))
    expect(rengR.E0Celda).toBeCloseTo(0.71, 12)
    expect(rengR.nCelda).toBe(6)
    expect([rengR.factorAnodo, rengR.factorCatodo]).toEqual([3, 2])
    expect(rengR.ecuacion).toBe('3 Mg + 2 Al³⁺ → 3 Mg²⁺ + 2 Al')
    expect(rengR.deltaG0 / 1000).toBeCloseTo(-411.03, 2)
  })

  it('H₂ | Cu: E° = 0,337 V; H₂ + Cu²⁺ → 2 H⁺ + Cu; el electrodo de hidrógeno es la referencia (E° = 0)', () => {
    const rengR = rengAnalizarCelda(rengCelda('h2', 'cu'))
    expect(rengR.E0Celda).toBeCloseTo(0.337, 12)
    expect(rengR.ecuacion).toBe('H₂ + Cu²⁺ → 2 H⁺ + Cu')
    const rengInversa = rengAnalizarCelda(rengCelda('cu', 'h2'))
    expect(rengInversa.ecuacion).toBe('Cu + 2 H⁺ → Cu²⁺ + H₂')
    expect(rengInversa.E0Celda).toBeCloseTo(-0.337, 12)
  })

  it('segunda vía independiente (36 combinaciones): cadena a través del SHE y aditividad de ΔG de las semirreacciones', () => {
    const rengE = (rengId: string): number => rengParRegistrado(rengId).E0
    for (const rengAn of RENG_CODIGOS_PARES) {
      for (const rengCa of RENG_CODIGOS_PARES) {
        const rengR = rengAnalizarCelda(rengCelda(rengAn, rengCa))
        const rengViaSHE = rengE(rengCa) - rengE('h2') - (rengE(rengAn) - rengE('h2'))
        expect(rengR.E0Celda, `${rengAn}|${rengCa} SHE`).toBeCloseTo(rengViaSHE, 12)
        const rengNa = rengParRegistrado(rengAn).n
        const rengNc = rengParRegistrado(rengCa).n
        const rengG = rengR.factorCatodo * (-rengNc * F * rengE(rengCa)) - rengR.factorAnodo * (-rengNa * F * rengE(rengAn))
        expect(rengR.deltaG0, `${rengAn}|${rengCa} ΔG`).toBeCloseTo(rengG, 6)
        expect(rengR.nCelda, `${rengAn}|${rengCa} n`).toBe(rengR.factorAnodo * rengNa)
        expect(rengR.nCelda).toBe(rengR.factorCatodo * rengNc)
        expect(rengRel(rengR.lnK, -rengG / (R * T)) < 1e-12 || Math.abs(rengR.lnK + rengG / (R * T)) < 1e-9, `${rengAn}|${rengCa} lnK`).toBe(true)
        const rengInv = rengAnalizarCelda(rengCelda(rengCa, rengAn))
        expect(rengR.E0Celda + rengInv.E0Celda, 'antisimetría').toBeCloseTo(0, 12)
        expect(rengR.lnK + rengInv.lnK, 'K·K⁻¹ = 1').toBeCloseTo(0, 9)
      }
    }
  })

  it('selección ánodo/cátodo: el cátodo real es el de mayor E° y «propuesto» ⇔ E° ≥ 0 (36 combinaciones)', () => {
    for (const rengAn of RENG_CODIGOS_PARES) {
      for (const rengCa of RENG_CODIGOS_PARES) {
        const rengR = rengAnalizarCelda(rengCelda(rengAn, rengCa))
        const rengMayor = rengParRegistrado(rengCa).E0 >= rengParRegistrado(rengAn).E0
        expect(rengR.catodoReal === 'propuesto', `${rengAn}|${rengCa}`).toBe(rengMayor)
        expect(rengR.espontaneaEstandar, `${rengAn}|${rengCa}`).toBe(rengParRegistrado(rengCa).E0 > rengParRegistrado(rengAn).E0)
      }
    }
    const rengAlReves = rengAnalizarCelda(rengCelda('cu', 'zn'))
    expect(rengAlReves.espontanea).toBe(false)
    expect(rengAlReves.catodoReal).toBe('invertido')
    expect(rengAlReves.diagnosticos.find((rengD) => rengD.codigo === 'ele-no-espontanea')!.texto).toMatch(/funcionaría al revés, con Zn como ánodo y Cu como cátodo/)
  })

  it('el mínimo común múltiplo de electrones y la ecuación global', () => {
    expect([rengMcm(2, 2), rengMcm(2, 3), rengMcm(3, 3), rengMcm(1, 1), rengMcm(4, 6)]).toEqual([2, 6, 3, 1, 12])
    for (const rengMal of [[0, 1], [1.5, 2], [-1, 2], [Number.NaN, 1]] as const) expect(() => rengMcm(rengMal[0], rengMal[1]), String(rengMal)).toThrow(/enteros positivos/)
    const rengAn = rengCore(rengParRegistrado('zn'))
    const rengCa = rengCore(rengParRegistrado('al'))
    expect(rengEcuacionCelda(rengAn, rengCa, 3, 2)).toBe('3 Zn + 2 Al³⁺ → 3 Zn²⁺ + 2 Al')
  })

  it('K fuera del rango numérico no se presenta como número (ln K sí)', () => {
    const rengSemi = (rengE0: number): RengSemiceldaCore => ({ id: 'x', oxidante: 'X²⁺', reductor: 'X', nu: 1, carga: 2, n: 2, E0: rengE0, gas: false })
    const rengR = rengAnalizarCelda({ anodo: rengSemi(0), catodo: rengSemi(50), cA: 1, cC: 1, F, R })
    expect(Number.isFinite(rengR.lnK)).toBe(true)
    expect(rengR.lnK).toBeGreaterThan(709)
    expect(rengR.K).toBeNull()
  })
})

describe('D4.3 · ecuación de Nernst (modelo ideal a 25 °C) contra cifras a mano', () => {
  it('Zn 0,1 mol/L | Cu 1 mol/L: E = 1,0988 − (RT/2F)·ln 0,1 = 1,12838 V', () => {
    const rengR = rengAnalizarCelda(rengCelda('zn', 'cu', 0.1, 1))
    expect(rengR.coeficienteNernst).toBeCloseTo(0.0128463, 7)
    expect(rengR.Q).toBeCloseTo(0.1, 15)
    expect(rengR.E).toBeCloseTo(1.12838, 5)
    expect(rengR.E).toBeCloseTo(1.0988 + (0.05916 / 2) * 1, 3)
  })

  it('Mg 0,1 | Al 0,5 (n = 6): Q = [Mg²⁺]³/[Al³⁺]² = 0,004; E = 0,710 − (RT/6F)·ln 0,004 = 0,73364 V', () => {
    const rengR = rengAnalizarCelda(rengCelda('mg', 'al', 0.1, 0.5))
    expect(rengR.Q).toBeCloseTo(0.004, 12)
    expect(rengR.E).toBeCloseTo(0.73364, 5)
  })

  it('H₂ | Cu con [H⁺] = 10⁻³ (pH 3): Q = [H⁺]²/[Cu²⁺] = 10⁻⁶; E = 0,337 + 0,0128463·13,8155 = 0,51448 V', () => {
    const rengR = rengAnalizarCelda(rengCelda('h2', 'cu', 1e-3, 1))
    expect(rengR.Q).toBeCloseTo(1e-6, 18)
    expect(rengR.E).toBeCloseTo(0.51448, 5)
    expect(rengPotencialSemicelda(rengCore(rengParRegistrado('h2')), 1e-3, F, R)).toBeCloseTo(-0.17748, 4)
  })

  it('el electrodo de hidrógeno respeta E(H⁺ 1 mol/L) = 0 y a pH 7 da −0,414 V (por semicelda, con el factor 2 de [H⁺]²)', () => {
    expect(rengPotencialSemicelda(rengCore(rengParRegistrado('h2')), 1, F, R)).toBe(0)
    expect(rengPotencialSemicelda(rengCore(rengParRegistrado('h2')), 1e-7, F, R)).toBeCloseTo(-0.41412, 4)
  })

  it('con concentraciones 1 mol/L, Q = 1 y E = E° en las 36 combinaciones', () => {
    for (const rengAn of RENG_CODIGOS_PARES) for (const rengCa of RENG_CODIGOS_PARES) {
      const rengR = rengAnalizarCelda(rengCelda(rengAn, rengCa))
      expect(rengR.Q).toBe(1)
      expect(rengR.E).toBeCloseTo(rengR.E0Celda, 12)
    }
  })

  it('segunda vía: E de la celda = E(cátodo) − E(ánodo) con la ecuación de Nernst de cada semicelda (barrido de 300 casos)', () => {
    let rengSemilla = 9
    const rengAzar = (): number => ((rengSemilla = (rengSemilla * 1664525 + 1013904223) % 4294967296) / 4294967296)
    for (let rengI = 0; rengI < 300; rengI++) {
      const rengAn = RENG_CODIGOS_PARES[Math.floor(rengAzar() * 6)]!
      const rengCa = RENG_CODIGOS_PARES[Math.floor(rengAzar() * 6)]!
      const rengCA = 10 ** (-6 + rengAzar() * 6)
      const rengCC = 10 ** (-6 + rengAzar() * 6)
      const rengR = rengAnalizarCelda(rengCelda(rengAn, rengCa, rengCA, rengCC))
      const rengPorSemiceldas = rengPotencialSemicelda(rengCore(rengParRegistrado(rengCa)), rengCC, F, R) - rengPotencialSemicelda(rengCore(rengParRegistrado(rengAn)), rengCA, F, R)
      expect(rengR.E!, JSON.stringify([rengAn, rengCa, rengCA, rengCC])).toBeCloseTo(rengPorSemiceldas, 9)
      expect(rengR.deltaG!).toBeCloseTo(-rengR.nCelda * F * rengR.E!, 6)
    }
  })

  it('en el equilibrio (E = 0) Q = K: E = 0 ⇔ ln Q = ln K', () => {
    const rengBase = rengAnalizarCelda(rengCelda('zn', 'cu'))
    const rengCC = 1
    const rengCA = Math.exp(rengBase.lnK) <= 1 ? 1 : 1
    expect(rengCA).toBe(1)
    const rengQEq = Math.exp(rengBase.lnK)
    const rengZnEq = Math.sqrt(rengQEq * 1)
    expect(Number.isFinite(rengZnEq)).toBe(true)
    const rengE = rengBase.E0Celda - rengBase.coeficienteNernst * Math.log(rengQEq)
    expect(rengE).toBeCloseTo(0, 9)
    expect(rengCC).toBe(1)
  })

  it('la serie E frente a log₁₀ de la concentración del cátodo es lineal con pendiente (RT/nF)·ln 10 por década', () => {
    const rengS = rengSerieNernst(rengCelda('zn', 'cu', 1, 1))
    expect(rengS.filas).toHaveLength(41)
    const rengPendiente = (rengS.filas[40]![1] - rengS.filas[0]![1]) / (rengS.filas[40]![0] - rengS.filas[0]![0])
    expect(rengPendiente).toBeCloseTo(0.05916 / 2, 4)
    for (let rengI = 1; rengI < rengS.filas.length; rengI++) expect(rengS.filas[rengI]![1]).toBeGreaterThan(rengS.filas[rengI - 1]![1])
    expect(rengS.filas[40]![1]).toBeCloseTo(1.0988, 9)
    expect(rengSerieNernst(rengCelda('zn', 'cu', 0, 1)).filas).toEqual([])
  })
})

describe('D4.3 · diagnósticos (códigos propios «ele-»)', () => {
  const rengCodigos = (rengP: RengParametrosCelda): string[] => rengAnalizarCelda(rengP).diagnosticos.map((rengD) => rengD.codigo)

  it('dos semiceldas iguales: E° = 0, K = 1; con distinta concentración es una pila de concentración y el cátodo real es la más concentrada', () => {
    const rengIgual = rengAnalizarCelda(rengCelda('zn', 'zn'))
    expect(rengIgual.E0Celda).toBe(0)
    expect(rengIgual.lnK).toBeCloseTo(0, 12)
    expect(rengIgual.K).toBeCloseTo(1, 12)
    expect(rengIgual.deltaG0).toBeCloseTo(0, 6)
    expect(rengIgual.enEquilibrio).toBe(true)
    expect(rengIgual.diagnosticos.find((rengD) => rengD.codigo === 'ele-misma-pareja')!.texto).toMatch(/pila de concentración/)
    const rengConc = rengAnalizarCelda(rengCelda('zn', 'zn', 1, 0.1))
    expect(rengConc.Q).toBeCloseTo(10, 12)
    expect(rengConc.E).toBeCloseTo(-0.0128463 * Math.LN10, 6)
    expect(rengConc.catodoReal).toBe('invertido')
    expect(rengAnalizarCelda(rengCelda('zn', 'zn', 0.1, 1)).E).toBeCloseTo(0.0128463 * Math.LN10, 6)
    expect(rengAnalizarCelda(rengCelda('zn', 'zn', 0.1, 1)).catodoReal).toBe('propuesto')
  })

  it('falta una especie (0 mol/L): no hay Nernst, pero sí E°; se dice cuál falta', () => {
    const rengR = rengAnalizarCelda(rengCelda('zn', 'cu', 0, 1))
    expect(rengR.E).toBeNull()
    expect(rengR.Q).toBeNull()
    expect(rengR.deltaG).toBeNull()
    expect(rengR.E0Celda).toBeCloseTo(1.0988, 12)
    expect(rengR.diagnosticos.find((rengD) => rengD.codigo === 'ele-falta-ion')!.texto).toMatch(/Falta Zn²⁺ del ánodo/)
    expect(rengAnalizarCelda(rengCelda('zn', 'cu', 0, 0)).diagnosticos.find((rengD) => rengD.codigo === 'ele-falta-ion')!.texto).toMatch(/Zn²⁺ del ánodo y Cu²⁺ del cátodo/)
  })

  it('concentraciones: muy diluida, por encima del umbral ideal, estándar y fuera del dominio', () => {
    expect(rengCodigos(rengCelda('zn', 'cu', 1e-7, 1))).toContain('ele-muy-diluida')
    expect(rengCodigos(rengCelda('zn', 'cu', 0.5, 1))).toContain('ele-actividades')
    expect(rengCodigos(rengCelda('zn', 'cu', 0.01, 0.01))).not.toContain('ele-actividades')
    const rengEstandar = rengAnalizarCelda(rengCelda('zn', 'cu', 1, 1))
    expect(rengEstandar.diagnosticos.find((rengD) => rengD.codigo === 'ele-condiciones-estandar')!.texto).toMatch(/E = E°/)
    expect(rengCodigos(rengCelda('zn', 'cu', 1, 1))).not.toContain('ele-actividades')
    for (const rengMala of [{ cA: 2 }, { cC: 1.5 }, { cA: -1 }, { cC: Number.NaN }, { F: 0 }, { R: -1 }] as Array<Partial<RengParametrosCelda>>) expect(() => rengAnalizarCelda({ ...rengCelda('zn', 'cu'), ...rengMala }), JSON.stringify(rengMala)).toThrow(RangeError)
  })

  it('las pérdidas omitidas se declaran siempre; el gas y la presión solo con el hidrógeno', () => {
    const rengD = rengAnalizarCelda(rengCelda('zn', 'cu')).diagnosticos
    expect(rengD.find((rengX) => rengX.codigo === 'ele-perdidas')!.texto).toMatch(/resistencia interna.*sobrepotencial.*polarización.*potencial de unión líquida.*puente salino/)
    expect(rengD.some((rengX) => rengX.codigo === 'ele-gas-presion')).toBe(false)
    expect(rengAnalizarCelda(rengCelda('h2', 'cu')).diagnosticos.find((rengX) => rengX.codigo === 'ele-gas-presion')!.texto).toMatch(/101,325 kPa/)
  })

  it('los códigos propios no chocan con los de otras escenas', () => {
    const rengOtros = new Set(['entrada', 'avisos-entrada', 'actividades', 'poliprotico', 'balance', 'sin-base', 'agotado', 'falta-especie', 'k-extrema', 'sin-convergencia', 'extrapolacion', 'sin-entropia', 'k-fuera-de-rango', 'aditivos', 'objetivo', 'extrapolacion-curva', 'negativa-patron', 'negativa-muestra', 'repetidos', 'pendiente-negativa', 'tres-patrones', 'saturacion', 'rango-recomendado', 'sol-sin-iones', 'sol-falta-ion', 'sol-sin-solido', 'sol-solido-agotado', 'sol-solido-sobra', 'sol-fuerza-ionica', 'sol-espectadores', 'sol-hidrolisis', 'sol-ksp-discrepa'])
    const rengVistos = new Set<string>()
    for (const [rengAn, rengCa, rengCA, rengCC] of [['zn', 'zn', 1, 1], ['zn', 'cu', 0, 1], ['zn', 'cu', 1e-7, 0.5], ['cu', 'zn', 1, 1], ['h2', 'cu', 1, 1], ['zn', 'cu', 0.01, 0.01]] as const) for (const rengC of rengCodigos(rengCelda(rengAn, rengCa, rengCA, rengCC))) rengVistos.add(rengC)
    expect([...rengVistos].length).toBeGreaterThan(6)
    for (const rengC of rengVistos) {
      expect(rengC.startsWith('ele-'), rengC).toBe(true)
      expect(rengOtros.has(rengC), rengC).toBe(false)
    }
  })

  it('semiceldas mal definidas: electrones o coeficientes no enteros y potencial no finito se rechazan', () => {
    const rengBase = rengCelda('zn', 'cu')
    for (const rengMal of [{ n: 0 }, { n: 1.5 }, { nu: 0 }, { E0: Number.NaN }, { E0: Number.POSITIVE_INFINITY }]) expect(() => rengAnalizarCelda({ ...rengBase, catodo: { ...rengBase.catodo, ...rengMal } }), JSON.stringify(rengMal)).toThrow(RangeError)
  })
})

describe('D4.3 · integración en el marco de escenas', async () => {
  const { rengProyectoNuevo, rengValidarProyecto } = await import('../../src/shared/cuaderno')
  const { rengAnadirCorrida, rengCrearCorrida } = await import('../../src/renderer/lib/cuaderno/proyecto')
  const { rengCompatibilidad } = await import('../../src/renderer/lib/cuaderno/modelos')
  const { rengAptitudComparacion } = await import('../../src/renderer/lib/cuaderno/comparar')
  const { rengCorridaEscena, rengEntradasDeCorrida, RENG_CODIGOS_V1 } = await import('../../src/renderer/modules/simulador-quimica/practica/corridaEscena')
  const { rengCalcularEscena, rengEntradasPorDefecto, rengValidarEntradasSim, RENG_MODELOS_ESCENA } = await import('../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion')
  const { rengDiagnosticosDominio, rengEntradasLegibles, rengResumenEscena, rengSensibilidadEscena } = await import('../../src/renderer/modules/simulador-quimica/practica/reglasEscena')
  const rengEj = { ano: 'zn', cat: 'cu', cA: 1, cC: 1 }

  it('el caso por defecto es Zn | Cu en condiciones estándar: E = E° = 1,0988 V y espontánea', () => {
    expect(rengEntradasPorDefecto('electroquimica')).toEqual(rengEj)
    const rengS = rengCalcularEscena('electroquimica', rengEj)
    expect(rengS['E0']).toBeCloseTo(1.0988, 12)
    expect(rengS['E']).toBeCloseTo(1.0988, 12)
    expect(rengS['Q']).toBe(1)
    expect(rengS['esp']).toBe(1)
    expect(rengS['inv']).toBe(0)
    expect(rengS['n']).toBe(2)
    expect(rengS['dG0']).toBeCloseTo(-212.04, 2)
    expect(rengS['K']! / 1.4033e37).toBeCloseTo(1, 3)
  })

  it('el marco da las cifras de la mano (Mg 0,1 | Al 0,5 → 0,73364 V; H₂ pH 3 | Cu → 0,51448 V; Cu | Zn no espontánea)', () => {
    expect(rengCalcularEscena('electroquimica', { ano: 'mg', cat: 'al', cA: 0.1, cC: 0.5 })['E']).toBeCloseTo(0.73364, 5)
    expect(rengCalcularEscena('electroquimica', { ano: 'h2', cat: 'cu', cA: 1e-3, cC: 1 })['E']).toBeCloseTo(0.51448, 5)
    const rengAlReves = rengCalcularEscena('electroquimica', { ano: 'cu', cat: 'zn', cA: 1, cC: 1 })
    expect(rengAlReves['esp']).toBe(-1)
    expect(rengAlReves['inv']).toBe(1)
    expect(rengAlReves['E0']).toBeCloseTo(-1.0988, 12)
  })

  it('un par fuera del catálogo, una concentración fuera de dominio o un campo ausente se rechazan con su explicación y sin cifras', () => {
    const rengVal = (rengE: Record<string, number | string>): { ok: boolean; texto: string } => {
      const rengV = rengValidarEntradasSim('electroquimica', rengE)
      return { ok: rengV.ok, texto: rengV.ok ? '' : rengV.diagnostico }
    }
    expect(rengVal({ ...rengEj, ano: 'ni' }).texto).toMatch(/no tiene fuente de potencial registrada/)
    expect(rengVal({ ...rengEj, cat: 'ag' }).ok).toBe(false)
    expect(rengVal({ ...rengEj, cA: 2 }).ok).toBe(false)
    expect(rengVal({ ...rengEj, cC: -1 }).ok).toBe(false)
    expect(rengVal({ ano: 'zn', cat: 'cu', cA: 1 } as Record<string, number | string>).ok).toBe(false)
    const rengR = rengResumenEscena('electroquimica', { ...rengEj, ano: 'ni' })
    expect(rengR.ok).toBe(false)
    expect(rengR.resultados).toEqual([])
    expect(rengCorridaEscena('electroquimica', { ...rengEj, ano: 'ni' }).estado).toBe('entrada-invalida')
    expect(rengCorridaEscena('electroquimica', { ...rengEj, ano: 'ni' }).resultados).toEqual([])
  })

  it('la ficha declara versión, evidencia, condiciones y, por semirreacción, fuente, fila literal, referencia, licencia; y las constantes CODATA', () => {
    const rengF = RENG_MODELOS_ESCENA.electroquimica
    expect(rengF.version).toBe('1')
    expect(rengF.evidencia).toBe('calculo-verificado')
    expect(rengF.condiciones.join(' ')).toMatch(/298,15 K/)
    expect(rengF.condiciones.join(' ')).toMatch(/SHE/)
    for (const rengPar of ['Zn²⁺/Zn', 'Cu²⁺/Cu', 'Fe²⁺/Fe', 'Mg²⁺/Mg', 'Al³⁺/Al', 'H⁺/H₂']) {
      const rengP = rengF.parametros.find((rengX) => rengX.nombre === `E° de ${rengPar}`)!
      expect(rengP.verificacion, rengPar).toBe('consultada')
      expect(rengP.fuente).toMatch(/https:\/\/en\.wikipedia\.org\/wiki\/Standard_electrode_potential_\(data_page\)/)
      expect(rengP.fuente).toMatch(/consultada 2026-11-15/)
      expect(rengP.fuente).toMatch(/No leí la página entera/)
      expect(rengP.fuente).toMatch(/fila literal: «/)
      expect(rengP.fuente).toMatch(/referencia de la fila: /)
      expect(rengP.fuente).toMatch(/298,15 K/)
      expect(rengP.fuente).toMatch(/CC BY-SA 4\.0/)
      expect(rengP.fuente).toMatch(/Otra tabla abierta \(no se usa; sin condiciones declaradas\)/)
    }
    const rengFaraday = rengF.parametros.find((rengP) => rengP.nombre === 'Constante de Faraday F')!
    expect(rengFaraday.verificacion).toBe('consultada')
    expect(rengFaraday.valor).toBe('96485,33212 C/mol (exacta)')
    expect(rengFaraday.fuente).toMatch(/CODATA 2018/)
    expect(rengFaraday.fuente).toMatch(/CODATA 2022/)
    expect(rengFaraday.fuente).toMatch(/puntos suspensivos/)
    expect(rengF.parametros.find((rengP) => rengP.nombre === 'Constante molar de los gases R')!.fuente).toMatch(/coincide con la R que ya usa el proyecto/)
    expect(rengF.parametros.find((rengP) => /Umbrales/.test(rengP.nombre))!.verificacion).toBe('libro')
    expect(rengF.supuestos.join(' ')).toMatch(/Pérdidas omitidas: resistencia interna, sobrepotencial, polarización, potencial de unión líquida/)
    expect(rengF.limites.join(' ')).toMatch(/catálogo pequeño a propósito/)
  })

  it('diagnósticos del marco: discrepancia entre tablas con su diferencia en mV, H₂ sin referencia, y los estados de la corrida', () => {
    const rengDiag = (rengE: Record<string, number | string>): ReturnType<typeof rengDiagnosticosDominio> => rengDiagnosticosDominio('electroquimica', rengE)
    const rengDisc = rengDiag(rengEj).find((rengD) => rengD.codigo === 'ele-tablas-discrepan')!
    expect(rengDisc.severidad).toBe('info')
    expect(rengDisc.texto).toMatch(/E° de esta celda sería 1,1037 V en vez de 1,0988 V/)
    expect(rengDisc.texto).toMatch(/4,9 mV/)
    expect(rengDisc.texto).toMatch(/no declara temperatura ni convenio/)
    expect(rengDisc.texto).toMatch(/no se propaga/)
    expect(rengDiag({ ...rengEj, ano: 'h2' }).some((rengD) => rengD.codigo === 'ele-h2-sin-referencia')).toBe(true)
    expect(rengDiag(rengEj).some((rengD) => rengD.codigo === 'ele-h2-sin-referencia')).toBe(false)
    expect(rengCorridaEscena('electroquimica', rengEj).estado).toBe('calculado')
    expect(rengCorridaEscena('electroquimica', { ...rengEj, cA: 0.5 }).estado).toBe('aproximacion')
    expect(rengCorridaEscena('electroquimica', { ...rengEj, cat: 'zn' }).estado).toBe('aproximacion')
    expect(rengCorridaEscena('electroquimica', { ...rengEj, cA: 0 }).estado).toBe('datos-insuficientes')
  })

  it('la corrida pasa la validación del cuaderno, se reabre idéntica, guarda ánodo/cátodo, el veredicto y la serie de Nernst', () => {
    for (const [rengAn, rengCa] of [['zn', 'cu'], ['mg', 'al'], ['h2', 'cu'], ['cu', 'zn'], ['fe', 'fe']] as const) {
      const rengE = { ano: rengAn, cat: rengCa, cA: 0.1, cC: 0.5 }
      const rengC = rengCrearCorrida('corrida-0001', rengCorridaEscena('electroquimica', rengE), { nombre: 'celda' }, new Date('2026-11-15T12:00:00Z'))
      const rengP = rengAnadirCorrida(rengProyectoNuevo('proyecto-prueba-1', 'P', new Date('2026-11-15T12:00:00Z')), rengC)
      expect(rengValidarProyecto(JSON.parse(JSON.stringify(rengP))), `${rengAn}|${rengCa}`).toEqual(rengP)
      expect(rengC.modelo.id).toBe('sim-electroquimica')
      expect(rengC.parametros.find((rengX) => rengX.clave === 'ano')!.valor).toBe(RENG_CODIGOS_V1.par.indexOf(rengAn as 'zn'))
      expect(rengC.parametros.find((rengX) => rengX.clave === 'cat')!.valor).toBe(RENG_CODIGOS_V1.par.indexOf(rengCa as 'zn'))
      expect(rengC.parametros.find((rengX) => rengX.clave === 'Tcelda')).toEqual({ clave: 'Tcelda', nombre: 'Temperatura del modelo (fija)', valor: 298.15, unidad: 'K' })
      expect(rengC.resultados.some((rengX) => rengX.clave === 'esp')).toBe(true)
      expect(rengC.serie.columnas.map((rengX) => rengX.clave)).toEqual(['log10_cC', 'E'])
      expect(rengC.serie.filas).toHaveLength(41)
      expect(rengC.fuentes.join(' ')).toMatch(/Wikipedia/)
      const { entradas, avisos } = rengEntradasDeCorrida('electroquimica', rengC.origen.entradas)
      expect(avisos).toEqual([])
      expect(entradas['ano']).toBe(rengAn)
      expect(entradas['cat']).toBe(rengCa)
      expect(rengCorridaEscena('electroquimica', entradas)).toEqual(rengCorridaEscena('electroquimica', rengE))
      expect(rengCompatibilidad('sim-electroquimica', '1').tipo).toBe('actual')
    }
    const rengSinIon = rengCorridaEscena('electroquimica', { ...rengEj, cA: 0 })
    expect(rengSinIon.serie.filas).toEqual([])
    expect(rengAptitudComparacion(rengCrearCorrida('corrida-0001', rengSinIon, { nombre: 'x' })).apta).toBe(false)
  })

  it('una semicelda desconocida al reabrir una corrida antigua se avisa y no inventa un potencial', () => {
    const rengR = rengEntradasDeCorrida('electroquimica', { ano: 99, cat: 1, cA: 1, cC: 1 })
    expect(rengR.entradas['ano']).toBe('zn')
    expect(rengR.avisos.some((rengA) => /Semicelda del ánodo/.test(rengA) && /valor por defecto/.test(rengA))).toBe(true)
    expect(rengR.entradas['cat']).toBe('cu')
  })

  it('datos aplicados legibles y sensibilidad: ∂E por +1 % (diferencia centrada ±1 %) de la concentración del cátodo = (RT/nF)·(ln 1,01 − ln 0,99)/2', () => {
    expect(rengEntradasLegibles('electroquimica', rengEj)).toEqual(['ánodo propuesto: Zn²⁺/Zn', 'cátodo propuesto: Cu²⁺/Cu', 'concentración del ion en el ánodo: 1 mol/L', 'concentración del ion en el cátodo: 1 mol/L'])
    const rengS = rengSensibilidadEscena('electroquimica', { ...rengEj, cA: 0.1, cC: 0.1 })
    expect(rengS.salida.clave).toBe('E')
    const rengPaso = (Math.log(1.01) - Math.log(0.99)) / 2
    expect(rengS.filas.find((rengF) => rengF.clave === 'cC')!.cambioPorCiento).toBeCloseTo(0.0128463 * rengPaso, 8)
    expect(rengS.filas.find((rengF) => rengF.clave === 'cA')!.cambioPorCiento).toBeCloseTo(-0.0128463 * rengPaso, 8)
    const rengBorde = rengSensibilidadEscena('electroquimica', rengEj)
    expect(rengBorde.filas.find((rengF) => rengF.clave === 'cC')!.cambioPorCiento).toBeCloseTo(0.0128463 * -Math.log(0.99), 8)
    expect(rengS.filas.some((rengF) => rengF.clave === 'ano')).toBe(false)
    expect(() => rengSensibilidadEscena('electroquimica', { ...rengEj, ano: 'ni' })).toThrow(/no tiene fuente/)
  })

  it('no hay práctica de potenciales o celdas: no se añade «Simular este ejercicio» y la identidad de las prácticas no se toca', async () => {
    const { RENG_TEMAS, RENG_FAMILIAS } = await import('../../src/renderer/modules/simulador-quimica/practica/banco')
    expect(RENG_TEMAS.some((rengT) => (rengT.escena as string | null) === 'electroquimica')).toBe(false)
    const { rengSimulacionDeEjercicio } = await import('../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion')
    const { rengEjercicioPorId } = await import('../../src/renderer/modules/simulador-quimica/practica/banco')
    for (const rengFam of RENG_FAMILIAS.filter((rengF) => /redox|oxidacion/.test(rengF.id))) {
      const rengE = rengEjercicioPorId(`${rengFam.id}~${rengFam.niveles[0]}~1`)
      if (rengE) expect(rengSimulacionDeEjercicio(rengE)?.escena).not.toBe('electroquimica')
    }
  })
})
