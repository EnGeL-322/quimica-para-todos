import { describe, expect, it } from 'vitest'
import { rengAjustarIonElectron } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'
import { rengElectronegatividad, rengTipoPorDiferencia } from '../../src/renderer/modules/simulador-quimica/nucleo/electronegatividad'
import { rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengDesdeSmiles, rengDescriptoresCIP } from '../../src/renderer/modules/simulador-quimica/nucleo/molecula'
import { rengGruposFuncionales, rengNombrarOrganico } from '../../src/renderer/modules/simulador-quimica/nucleo/organica'
import { rengEstadosOxidacion } from '../../src/renderer/modules/simulador-quimica/nucleo/oxidacion'
import { RENG_FAMILIAS, rengEjercicioDeTema, rengGenerarDeFamilia } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { rengCorregirEcuacion, rengCorregirEstructura, rengCorregirFormula, rengCorregirNombre, rengCorregirNumero, rengCorregirOpcion, rengLecturasAmbiguas } from '../../src/renderer/modules/simulador-quimica/practica/correccion'
import { RENG_BANCO_ESTEREO, RENG_BANCO_ORGANICO, RENG_BANCO_OXIDACION, RENG_NUMERO_ISOMEROS, RENG_REACCIONES_ORGANICAS } from '../../src/renderer/modules/simulador-quimica/practica/bancos'
import { rengIncertidumbreInterpolada, rengRegresionLineal } from '../../src/renderer/modules/simulador-quimica/practica/solucionadores'
import { rengCalcularEscena, rengValidarEntradasSim } from '../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'
import {
  RENG_CLAVE_NIVEL_ANTIGUA,
  RENG_CLAVE_NIVEL_PRACTICA,
  rengDetalleDeNivel,
  rengGuardarNivelPractica,
  rengLeerNivelPractica,
  rengMigrarNivelAntiguo,
  rengNivelDeDetalle,
  rengNivelDeTecla,
  type RengAlmacenNivel
} from '../../src/renderer/modules/simulador-quimica/practica/niveles'
import { rengLeerNumeroEs, rengNormalizarUnidad, rengSepararNumeroUnidad } from '../../src/renderer/modules/simulador-quimica/practica/numeros'
import type { RengRespuestaEsperada, RengRespuestaNumero } from '../../src/renderer/modules/simulador-quimica/practica/tipos'

const rengAlmacen = (rengInicial: Record<string, string> = {}): RengAlmacenNivel & { datos: Record<string, string> } => {
  const rengDatos = { ...rengInicial }
  return { datos: rengDatos, getItem: (rengK) => rengDatos[rengK] ?? null, setItem: (rengK, rengV) => void (rengDatos[rengK] = rengV) }
}

describe('persistencia y migración del nivel', () => {
  it('sin preferencia guardada abre en Preuniversitario', () => {
    expect(rengLeerNivelPractica(rengAlmacen())).toBe('preuniversitario')
    expect(rengLeerNivelPractica(null)).toBe('preuniversitario')
  })
  it('guarda y recupera cada uno de los cuatro niveles', () => {
    for (const rengN of ['preuniversitario', 'universitario', 'quimico', 'cientifico'] as const) {
      const rengA = rengAlmacen()
      expect(rengGuardarNivelPractica(rengA, rengN)).toBe(true)
      expect(rengLeerNivelPractica(rengA)).toBe(rengN)
    }
  })
  it('migra Básico → Preuniversitario y Avanzado → Universitario sin borrar la clave antigua', () => {
    const rengBasico = rengAlmacen({ [RENG_CLAVE_NIVEL_ANTIGUA]: 'basico' })
    expect(rengLeerNivelPractica(rengBasico)).toBe('preuniversitario')
    expect(rengBasico.datos[RENG_CLAVE_NIVEL_PRACTICA]).toBe('preuniversitario')
    expect(rengBasico.datos[RENG_CLAVE_NIVEL_ANTIGUA]).toBe('basico')
    const rengAvanzado = rengAlmacen({ [RENG_CLAVE_NIVEL_ANTIGUA]: 'avanzado' })
    expect(rengLeerNivelPractica(rengAvanzado)).toBe('universitario')
    expect(rengAvanzado.datos[RENG_CLAVE_NIVEL_ANTIGUA]).toBe('avanzado')
    expect(rengMigrarNivelAntiguo('otro')).toBeNull()
  })
  it('la preferencia nueva manda sobre la antigua y un valor corrupto no rompe nada', () => {
    expect(rengLeerNivelPractica(rengAlmacen({ [RENG_CLAVE_NIVEL_PRACTICA]: 'quimico', [RENG_CLAVE_NIVEL_ANTIGUA]: 'basico' }))).toBe('quimico')
    expect(rengLeerNivelPractica(rengAlmacen({ [RENG_CLAVE_NIVEL_PRACTICA]: 'nivel-raro' }))).toBe('preuniversitario')
    const rengRoto: RengAlmacenNivel = { getItem: () => { throw new Error('bloqueado') }, setItem: () => { throw new Error('bloqueado') } }
    expect(rengLeerNivelPractica(rengRoto)).toBe('preuniversitario')
    expect(rengGuardarNivelPractica(rengRoto, 'quimico')).toBe(false)
  })
  it('al guardar se mantiene la clave antigua coherente (Básico/Avanzado de la Mesa)', () => {
    const rengA = rengAlmacen()
    rengGuardarNivelPractica(rengA, 'cientifico')
    expect(rengA.datos[RENG_CLAVE_NIVEL_ANTIGUA]).toBe('avanzado')
    rengGuardarNivelPractica(rengA, 'preuniversitario')
    expect(rengA.datos[RENG_CLAVE_NIVEL_ANTIGUA]).toBe('basico')
  })
  it('los controles de la Mesa: Básico = Preuniversitario; Avanzado no baja un nivel ya avanzado', () => {
    expect(rengDetalleDeNivel('preuniversitario')).toBe('basico')
    expect(rengDetalleDeNivel('quimico')).toBe('avanzado')
    expect(rengNivelDeDetalle('basico', 'cientifico')).toBe('preuniversitario')
    expect(rengNivelDeDetalle('avanzado', 'preuniversitario')).toBe('universitario')
    expect(rengNivelDeDetalle('avanzado', 'cientifico')).toBe('cientifico')
    expect(rengNivelDeTecla('3')).toBe('quimico')
    expect(rengNivelDeTecla('9')).toBeNull()
  })
})

describe('lectura de números con coma o punto decimal', () => {
  it('acepta coma, punto, notación científica y fracciones cuando no hay ambigüedad', () => {
    const rengOk = (rengT: string): number => {
      const rengR = rengLeerNumeroEs(rengT)
      if (!rengR.ok) throw new Error(`${rengT}: ${rengR.motivo}`)
      return rengR.valor
    }
    expect(rengOk('0,0500')).toBeCloseTo(0.05, 12)
    expect(rengOk('0.0500')).toBeCloseTo(0.05, 12)
    expect(rengOk('5,00e-2')).toBeCloseTo(0.05, 12)
    expect(rengOk('5.00×10^-2')).toBeCloseTo(0.05, 12)
    expect(rengOk('5,00·10⁻²')).toBeCloseTo(0.05, 12)
    expect(rengOk('1.234,5')).toBeCloseTo(1234.5, 9)
    expect(rengOk('1,234.5')).toBeCloseTo(1234.5, 9)
    expect(rengOk('1.234.567')).toBe(1234567)
    expect(rengOk('−2,5')).toBe(-2.5)
    expect(rengOk('+4')).toBe(4)
    expect(rengOk('8/3')).toBeCloseTo(2.6667, 3)
  })
  it('rechaza lo ambiguo o ilegible con un motivo concreto', () => {
    expect(rengLeerNumeroEs('1.234')).toEqual({ ok: false, motivo: 'separador-ambiguo' })
    expect(rengLeerNumeroEs('')).toEqual({ ok: false, motivo: 'vacio' })
    expect(rengLeerNumeroEs('abc')).toMatchObject({ ok: false })
    expect(rengLeerNumeroEs('1,2,3')).toMatchObject({ ok: false })
    expect(rengLeerNumeroEs('1/0')).toMatchObject({ ok: false })
  })
  it('separa el número de la unidad y reconoce «M» como mol/L', () => {
    expect(rengSepararNumeroUnidad('0,0500 mol/L')).toEqual({ ok: true, valor: 0.05, unidad: 'mol/L' })
    expect(rengSepararNumeroUnidad('1.5 1/s')).toEqual({ ok: true, valor: 1.5, unidad: '1/s' })
    expect(rengSepararNumeroUnidad('0,05 M')).toEqual({ ok: true, valor: 0.05, unidad: 'mol/L' })
    expect(rengNormalizarUnidad('M')).toBe('mol/L')
  })
})

const RENG_CONCENTRACION: RengRespuestaNumero = { tipo: 'numero', valor: 0.05, unidad: 'mol/L', tolRel: 0.01, tolAbs: 0, decimales: 4, erroresComunes: [{ valor: 5, mensaje: 'Multiplicaste C₁·V₁ sin dividir entre V₂.' }] }

describe('corrección numérica con unidades y redondeo', () => {
  it('dilución de 25,0 mL de 0,200 mol/L a 100,0 mL → 0,0500 mol/L, en cualquier unidad equivalente', () => {
    const rengC1 = 0.2
    const rengResultado = (rengC1 * 25) / 100
    expect(rengResultado).toBeCloseTo(0.05, 12)
    for (const rengT of ['0,0500', '0.0500', '0,05 mol/L', '5,00e-2 mol/L', '50 mmol/L', '0,0500 M', '0,000050 mol/mL']) expect(rengCorregirNumero(rengT, RENG_CONCENTRACION).tipo, rengT).toBe('correcto')
  })
  it('distingue entrada inválida, unidad incompatible, error frecuente, redondeo y factor de unidades', () => {
    expect(rengCorregirNumero('', RENG_CONCENTRACION)).toMatchObject({ tipo: 'entrada-invalida', motivo: 'vacia' })
    expect(rengCorregirNumero('cinco', RENG_CONCENTRACION)).toMatchObject({ tipo: 'entrada-invalida', motivo: 'ilegible' })
    expect(rengCorregirNumero('1.234', RENG_CONCENTRACION)).toMatchObject({ tipo: 'entrada-invalida', motivo: 'separador-ambiguo' })
    expect(rengCorregirNumero('0,05 g', RENG_CONCENTRACION)).toMatchObject({ tipo: 'unidad-incompatible', motivo: 'dimension' })
    expect(rengCorregirNumero('0,05 zorros', RENG_CONCENTRACION)).toMatchObject({ tipo: 'unidad-incompatible', motivo: 'unidad-desconocida' })
    expect(rengCorregirNumero('5', RENG_CONCENTRACION)).toMatchObject({ tipo: 'incorrecto', motivo: 'error-frecuente', errorFrecuente: expect.stringContaining('sin dividir') })
    expect(rengCorregirNumero('0,0515', RENG_CONCENTRACION)).toMatchObject({ tipo: 'incorrecto', motivo: 'cerca' })
    expect(rengCorregirNumero('0,5', RENG_CONCENTRACION)).toMatchObject({ tipo: 'incorrecto', motivo: 'factor-potencia-10' })
    expect(rengCorregirNumero('0,02', RENG_CONCENTRACION)).toMatchObject({ tipo: 'incorrecto', motivo: 'bajo' })
    expect(rengCorregirNumero('0,09', RENG_CONCENTRACION)).toMatchObject({ tipo: 'incorrecto', motivo: 'alto' })
  })
  it('la tolerancia respeta el redondeo del ejercicio y las unidades', () => {
    const rengPh: RengRespuestaNumero = { tipo: 'numero', valor: 2.88, unidad: '', tolRel: 0, tolAbs: 0.02, decimales: 2, erroresComunes: [] }
    expect(rengCorregirNumero('2,9', rengPh).tipo).toBe('correcto')
    expect(rengCorregirNumero('2,85', rengPh).tipo).toBe('incorrecto')
    expect(rengCorregirNumero('2,88 mol', rengPh)).toMatchObject({ tipo: 'unidad-incompatible', motivo: 'sin-unidad' })
    const rengMasa: RengRespuestaNumero = { tipo: 'numero', valor: 0.0253, unidad: 'L', tolRel: 0.01, tolAbs: 0, decimales: null, erroresComunes: [] }
    expect(rengCorregirNumero('25,3 mL', rengMasa).tipo).toBe('correcto')
    expect(rengCorregirNumero('25,3', rengMasa)).toMatchObject({ tipo: 'incorrecto', motivo: 'factor-potencia-10' })
    const rengTemperatura: RengRespuestaNumero = { tipo: 'numero', valor: 298.15, unidad: 'K', tolRel: 0.001, tolAbs: 0, decimales: null, erroresComunes: [] }
    expect(rengCorregirNumero('25 °C', rengTemperatura).tipo).toBe('correcto')
  })
})

describe('corrección de fórmulas, ecuaciones y estructuras', () => {
  it('2 H₂ + O₂ → 2 H₂O: correcta; sin ajustar, no conserva; simplificable; con otras especies', () => {
    const rengEsperada = { reactivos: [{ formula: 'H2', coef: 2 }, { formula: 'O2', coef: 1 }], productos: [{ formula: 'H2O', coef: 2 }], coeficientesMinimos: true }
    for (const rengT of ['2 H₂ + O₂ → 2 H₂O', '2H2 + O2 -> 2H2O', '2 H2 + 1 O2 = 2 H2O', 'O2 + 2 H2 -> 2 H2O']) expect(rengCorregirEcuacion(rengT, rengEsperada).tipo, rengT).toBe('correcto')
    expect(rengCorregirEcuacion('H2 + O2 -> H2O', rengEsperada)).toMatchObject({ tipo: 'incorrecto', motivo: 'no-equilibrada' })
    expect(rengCorregirEcuacion('4 H2 + 2 O2 -> 4 H2O', rengEsperada)).toMatchObject({ tipo: 'simplificable', motivo: 'sin-simplificar' })
    expect(rengCorregirEcuacion('H2 + 0,5 O2 -> H2O', rengEsperada)).toMatchObject({ tipo: 'simplificable', motivo: 'fraccionarios' })
    expect(rengCorregirEcuacion('2 H2 + O2 -> 2 H2O2', rengEsperada)).toMatchObject({ tipo: 'incorrecto' })
    expect(rengCorregirEcuacion('2 H2 + O2', rengEsperada)).toMatchObject({ tipo: 'entrada-invalida', motivo: 'sin-flecha' })
    expect(rengCorregirEcuacion('', rengEsperada).tipo).toBe('entrada-invalida')
  })
  it('Fe²⁺ → Fe³⁺ + e⁻: conserva elementos y carga; con la carga mal, no', () => {
    const rengE = { reactivos: [{ formula: 'Fe2+', coef: 1 }], productos: [{ formula: 'Fe3+', coef: 1 }, { formula: 'e-', coef: 1 }], coeficientesMinimos: true }
    for (const rengT of ['Fe²⁺ → Fe³⁺ + e⁻', 'Fe2+ -> Fe3+ + e-', 'Fe^2+ = Fe^3+ + e-']) expect(rengCorregirEcuacion(rengT, rengE).tipo, rengT).toBe('correcto')
    expect(rengCorregirEcuacion('Fe2+ + e- -> Fe3+', rengE)).toMatchObject({ tipo: 'incorrecto' })
    const rengFalta = rengCorregirEcuacion('Fe2+ -> Fe3+', rengE)
    expect(rengFalta.tipo).toBe('incorrecto')
    expect(rengFalta.detalle?.join(' ')).toContain('Falta e⁻')
    expect(rengCorregirEcuacion('Fe2+ -> Fe3+ + 2 e-', rengE)).toMatchObject({ tipo: 'incorrecto', motivo: 'no-equilibrada' })
  })
  it('formulación ambigua, carga y simplificación', () => {
    expect(rengLecturasAmbiguas('co')).toEqual(expect.arrayContaining(['Co', 'CO']))
    expect(rengCorregirFormula('co', 'CO')).toMatchObject({ tipo: 'ambigua', motivo: 'mayusculas' })
    expect(rengCorregirFormula('CO', 'CO').tipo).toBe('correcto')
    expect(rengCorregirFormula('Fe2(SO4)3', 'Fe2(SO4)3').tipo).toBe('correcto')
    expect(rengCorregirFormula('SO4 2-', 'SO4^2-').tipo).toBe('correcto')
    expect(rengCorregirFormula('SO4', 'SO4^2-')).toMatchObject({ tipo: 'incorrecto', motivo: 'carga' })
    expect(rengCorregirFormula('H4O2', 'H2O')).toMatchObject({ tipo: 'simplificable' })
    expect(rengCorregirFormula('Xx2', 'H2O').tipo).toBe('entrada-invalida')
  })
  it('etanol y dimetil éter comparten C₂H₆O pero son estructuras distintas', () => {
    const rengEtanol = { tipo: 'estructura', modo: 'igual', smiles: 'CCO', estereo: 'ignorar' } as const
    for (const rengT of ['CCO', 'OCC', 'CH3CH2OH', 'C2H5OH', 'etanol']) expect(rengCorregirEstructura(rengT, rengEtanol).tipo, rengT).toBe('correcto')
    for (const rengT of ['COC', 'CH3OCH3']) expect(rengCorregirEstructura(rengT, rengEtanol), rengT).toMatchObject({ tipo: 'incorrecto', motivo: 'isomero-constitucional' })
    expect(rengCorregirEstructura('C2H6O', rengEtanol)).toMatchObject({ tipo: 'ambigua', motivo: 'formula-molecular' })
    expect(rengCorregirEstructura('CCC', rengEtanol)).toMatchObject({ tipo: 'incorrecto', motivo: 'otra-sustancia' })
    expect(rengCorregirEstructura('', rengEtanol).tipo).toBe('entrada-invalida')
    expect(rengDesdeSmiles('CCO').formula).toBe(rengDesdeSmiles('COC').formula)
    expect(rengDesdeSmiles('CCO').id).not.toBe(rengDesdeSmiles('COC').id)
    const rengIsomero = { tipo: 'estructura', modo: 'isomero', smiles: 'CCO', formula: 'C2H6O', grupo: 'eter', estereo: 'ignorar' } as const
    expect(rengCorregirEstructura('COC', rengIsomero).tipo).toBe('correcto')
    expect(rengCorregirEstructura('CCO', rengIsomero)).toMatchObject({ motivo: 'mismo-compuesto' })
    expect(rengCorregirEstructura('CC(C)O', rengIsomero)).toMatchObject({ motivo: 'formula-distinta' })
  })
  it('estereoisómeros: se ignoran o se exigen según el ejercicio', () => {
    const rengR = { tipo: 'estructura', modo: 'igual', smiles: 'C[C@H](O)CC', estereo: 'exigir' } as const
    expect(rengCorregirEstructura('CC[C@H](C)O', rengR).tipo).toBe('correcto')
    expect(rengCorregirEstructura('O[C@@H](C)CC', rengR).tipo).toBe('correcto')
    expect(rengCorregirEstructura('C[C@@H](O)CC', rengR)).toMatchObject({ tipo: 'incorrecto', motivo: 'estereoisomero' })
    expect(rengCorregirEstructura('CC[C@@H](C)O', rengR)).toMatchObject({ tipo: 'incorrecto', motivo: 'estereoisomero' })
    expect(rengCorregirEstructura('C[C@@H](O)CC', { ...rengR, estereo: 'ignorar' }).tipo).toBe('correcto')
  })
  it('nombres equivalentes y opciones', () => {
    const rengR: Extract<RengRespuestaEsperada, { tipo: 'nombre' }> = { tipo: 'nombre', smiles: 'CC(C)O', aceptados: ['propan-2-ol', 'alcohol isopropílico'] }
    for (const rengT of ['propan-2-ol', 'Propan-2-OL', 'alcohol isopropilico']) expect(rengCorregirNombre(rengT, rengR).tipo, rengT).toBe('correcto')
    expect(rengCorregirNombre('propan-1-ol', rengR)).toMatchObject({ tipo: 'incorrecto', motivo: 'isomero-constitucional' })
    expect(rengCorregirNombre('', rengR).tipo).toBe('entrada-invalida')
    expect(rengCorregirOpcion('a', { tipo: 'opcion', opciones: [{ id: 'a', texto: 'x' }], correcta: 'a' }).tipo).toBe('correcto')
    expect(rengCorregirOpcion(null, { tipo: 'opcion', opciones: [], correcta: 'a' }).tipo).toBe('entrada-invalida')
  })
})

describe('referencias independientes del motor', () => {
  it('masas molares frente a masas atómicas estándar IUPAC (abreviadas)', () => {
    const rengReferencia: Array<[string, number]> = [['H2O', 18.015], ['NaCl', 58.443], ['CaCO3', 100.086], ['H2SO4', 98.079], ['C6H12O6', 180.156], ['KMnO4', 158.034], ['Fe2O3', 159.687], ['NH3', 17.031]]
    for (const [rengF, rengM] of rengReferencia) expect(Math.abs(rengMasaMolarDe(rengF) - rengM) / rengM, rengF).toBeLessThan(0.0015)
  })
  it('pH de ácido acético 0,100 mol/L (cuadrática aparte), HCl y mezcla HCl+NaOH', () => {
    expect(rengCalcularEscena('acidobase', { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1 })['pH']).toBeCloseTo(2.8809, 2)
    expect(rengCalcularEscena('acidobase', { acido: 'hcl', C: 0.01, Va: 25, Cb: 0.1 })['pH']).toBeCloseTo(2, 2)
    expect(rengCalcularEscena('acidobase', { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1 })['Veq']).toBeCloseTo(25, 9)
    expect(rengCalcularEscena('mezcla', { acido: 'hcl', cAcido: 0.01, VAcido: 25, cBase: 0.01, VBase: 12.5 })['pH']).toBeCloseTo(2.4771, 2)
    expect(rengCalcularEscena('acidobase', { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1, Vb: 12.5 })['pHVb']).toBeCloseTo(4.7565, 2)
  })
  it('cinética, equilibrio y termoquímica frente a soluciones analíticas', () => {
    expect(rengCalcularEscena('cinetica', { orden: 1, A0: 1, k: 0.1 })['t12']).toBeCloseTo(6.9315, 3)
    expect(rengCalcularEscena('cinetica', { orden: 1, A0: 1, k: 0.1, t: 6.931471805599452 })['At']).toBeCloseTo(0.5, 9)
    const rengN2O4 = rengCalcularEscena('equilibrio', { reaccion: 'n2o4', K: 0.15, c0_0: 0.1, c0_1: 0 })
    expect(rengN2O4['c_1']).toBeCloseTo(0.0905869, 6)
    expect(rengN2O4['c_0']).toBeCloseTo(0.0547066, 6)
    const rengHi = rengCalcularEscena('equilibrio', { reaccion: 'hi', K: 50, c0_0: 1, c0_1: 1, c0_2: 0 })
    expect(rengHi['c_2']).toBeCloseTo(1.5590376, 6)
    expect(rengCalcularEscena('termo', { reaccion: 'metano', T: 298.15 })['dH']).toBeCloseTo(-890.209, 3)
    const rengVap = rengCalcularEscena('termo', { reaccion: 'vaporiza', T: 298.15 })
    expect(rengVap['dH']).toBeCloseTo(43.982, 3)
    expect(rengVap['dG']).toBeCloseTo(8.526, 3)
  })
  it('calibración lineal: pendiente, ordenada, concentración e incertidumbre frente a un cálculo aparte', () => {
    const rengCal = rengRegresionLineal([0, 2, 4, 6, 8, 10], [0.012, 0.115, 0.209, 0.318, 0.409, 0.512])
    expect(rengCal.m).toBeCloseTo(0.0498714, 6)
    expect(rengCal.b).toBeCloseTo(0.0131429, 6)
    expect(rengCal.sr).toBeCloseTo(0.0038840, 6)
    expect((0.25 - rengCal.b) / rengCal.m).toBeCloseTo(4.749355, 5)
    expect(rengIncertidumbreInterpolada(rengCal, 0.25)).toBeCloseTo(0.0841534, 6)
  })
})

describe('los bancos escritos a mano coinciden con el motor', () => {
  it('nombres IUPAC y grupos funcionales de cada compuesto', () => {
    for (const [rengNivel, rengLista] of Object.entries(RENG_BANCO_ORGANICO)) {
      for (const rengC of rengLista) {
        const rengG = rengDesdeSmiles(rengC.smiles)
        expect(rengNombrarOrganico(rengG).nombre, `${rengNivel}: ${rengC.smiles}`).toBe(rengC.nombre)
        expect(rengGruposFuncionales(rengG).map((rengX) => rengX.tipo), `${rengNivel}: ${rengC.smiles}`).toContain(rengC.grupo)
        if (rengC.principal) expect(rengGruposFuncionales(rengG).map((rengX) => rengX.tipo), rengC.smiles).toContain(rengC.principal)
      }
    }
  })
  it('descriptores CIP R/S y E/Z', () => {
    for (const rengC of RENG_BANCO_ESTEREO.ez) expect(rengDescriptoresCIP(rengC.smiles).dobles.map((rengX) => rengX.descriptor), rengC.smiles).toEqual([rengC.esperado])
    for (const rengC of RENG_BANCO_ESTEREO.rs) expect(rengDescriptoresCIP(rengC.smiles).centros.map((rengX) => rengX.descriptor), rengC.smiles).toEqual([rengC.esperado])
  })
  it('listas de isómeros: misma fórmula, estructuras distintas y recuento declarado', () => {
    for (const rengC of RENG_NUMERO_ISOMEROS) {
      const rengGrafos = rengC.lista.map((rengS) => rengDesdeSmiles(rengS))
      expect(rengGrafos.length, rengC.formula).toBe(rengC.n)
      for (const rengG of rengGrafos) expect(rengG.formula, `${rengC.formula}: ${rengG.smiles}`).toBe(rengC.formula)
      expect(new Set(rengGrafos.map((rengG) => rengG.idSinEstereo)).size, rengC.formula).toBe(rengC.n)
    }
  })
  it('números de oxidación: lista de libro frente al motor', () => {
    for (const rengLista of Object.values(RENG_BANCO_OXIDACION)) {
      for (const rengC of rengLista) {
        const rengOx = rengEstadosOxidacion(rengAnalizarFormulaLocal(rengC.f))
        if (rengOx) expect(rengOx.get(rengC.el), rengC.f).toBeCloseTo(rengC.ox, 6)
      }
    }
  })
  it('enlace: cada par del banco cae lejos de las fronteras y coincide con el criterio', () => {
    const rengEsperados: Array<[string, string, string]> = [['Na', 'Cl', 'ionico'], ['H', 'Cl', 'polar'], ['Cl', 'Cl', 'apolar'], ['C', 'H', 'apolar'], ['H', 'O', 'polar'], ['K', 'F', 'ionico']]
    for (const [rengA, rengB, rengT] of rengEsperados) expect(rengTipoPorDiferencia(Math.abs(rengElectronegatividad(rengA)! - rengElectronegatividad(rengB)!)), `${rengA}${rengB}`).toBe(rengT)
  })
  it('redox: todos los esquemas del banco se ajustan', () => {
    const rengE = [
      { r: ['MnO4-', 'Fe2+'], p: ['Mn2+', 'Fe3+'], m: 'acido' as const },
      { r: ['Cr2O7^2-', 'Fe2+'], p: ['Cr3+', 'Fe3+'], m: 'acido' as const },
      { r: ['Cu', 'NO3-'], p: ['Cu2+', 'NO2'], m: 'acido' as const },
      { r: ['MnO4-', 'I-'], p: ['Mn2+', 'I2'], m: 'acido' as const },
      { r: ['MnO4-', 'I-'], p: ['MnO2', 'I2'], m: 'basico' as const },
      { r: ['Cl2'], p: ['Cl-', 'ClO-'], m: 'basico' as const },
      { r: ['Cr(OH)3', 'ClO-'], p: ['CrO4^2-', 'Cl-'], m: 'basico' as const }
    ]
    for (const rengX of rengE) expect(() => rengAjustarIonElectron({ reactivos: rengX.r, productos: rengX.p }, rengX.m), rengX.r.join('+')).not.toThrow()
    const rengMn = rengAjustarIonElectron({ reactivos: ['MnO4-', 'Fe2+'], productos: ['Mn2+', 'Fe3+'] }, 'acido')
    expect(rengMn.texto.replace(/\s/g, '')).toContain('MnO₄⁻')
    expect(rengMn.reactivos.map((rengT) => rengT.coef)).toEqual([1, 5, 8])
  })
  it('reacciones orgánicas: reactivos con producto válido y cada familia documentada', () => {
    for (const rengR of RENG_REACCIONES_ORGANICAS) {
      expect(() => rengDesdeSmiles(rengR.producto), rengR.id).not.toThrow()
      expect(rengR.condiciones.length, rengR.id).toBeGreaterThan(5)
      expect(rengR.nota.length, rengR.id).toBeGreaterThan(10)
    }
    expect(new Set(RENG_REACCIONES_ORGANICAS.map((rengR) => rengR.familia)).size).toBeGreaterThanOrEqual(7)
  })
})

describe('simulación: dominio, datos que faltan y coincidencia con el ejercicio', () => {
  it('fuera de dominio: concentración de la mezcla por encima de 0,01 mol/L, ácido desconocido, pH sin K', () => {
    const rengFuera = rengValidarEntradasSim('mezcla', { acido: 'hcl', cAcido: 0.5, VAcido: 25, cBase: 0.01, VBase: 10 })
    expect(rengFuera.ok).toBe(false)
    if (!rengFuera.ok) expect(rengFuera.diagnostico).toContain('0,01')
    const rengAcidoRaro = rengValidarEntradasSim('acidobase', { acido: 'sulfurico', C: 0.1, Va: 25, Cb: 0.1 })
    expect(rengAcidoRaro.ok).toBe(false)
    if (!rengAcidoRaro.ok) expect(rengAcidoRaro.diagnostico).toContain('no está en el modelo')
    const rengConcentrado = rengValidarEntradasSim('acidobase', { acido: 'acetico', C: 5, Va: 25, Cb: 0.1 })
    expect(rengConcentrado.ok).toBe(false)
    if (!rengConcentrado.ok) expect(rengConcentrado.diagnostico).toContain('supera el dominio')
    expect(() => rengCalcularEscena('acidobase', { acido: 'acetico', C: 5, Va: 25, Cb: 0.1 })).toThrow(RangeError)
  })
  it('faltan datos: el diagnóstico nombra qué falta', () => {
    const rengFalta = rengValidarEntradasSim('cinetica', { orden: 1, A0: 1 })
    expect(rengFalta.ok).toBe(false)
    if (!rengFalta.ok) {
      expect(rengFalta.campos).toEqual(['k'])
      expect(rengFalta.diagnostico).toContain('constante de velocidad')
    }
  })
  it('equilibrio indeterminado y reacción sin entropías', () => {
    const rengVacio = rengValidarEntradasSim('equilibrio', { reaccion: 'hi', K: 50, c0_0: 0, c0_1: 0, c0_2: 0 })
    expect(rengVacio.ok).toBe(false)
    if (!rengVacio.ok) expect(rengVacio.diagnostico).toContain('Sistema vacío')
    const rengSinS = rengCalcularEscena('termo', { reaccion: 'etanol', T: 298.15 })
    expect('dG' in rengSinS).toBe(false)
    const rengAviso = rengValidarEntradasSim('termo', { reaccion: 'metano', T: 600 })
    expect(rengAviso.ok && rengAviso.avisos.length).toBe(1)
  })
  it('cada ejercicio con simulación copia entradas válidas y la simulación coincide con la respuesta del ejercicio', () => {
    let rengComparados = 0
    for (const rengF of RENG_FAMILIAS) {
      for (const rengN of rengF.niveles) {
        for (let rengS = 1; rengS <= 12; rengS++) {
          const rengE = rengGenerarDeFamilia(rengF, rengN, rengS)
          if (!rengE?.simulacion) continue
          const rengV = rengValidarEntradasSim(rengE.simulacion.escena, rengE.simulacion.entradas)
          expect(rengV.ok, `${rengE.id}: ${rengV.ok ? '' : rengV.diagnostico}`).toBe(true)
          const rengComp = rengE.simulacion.comparar
          if (!rengComp || rengE.respuesta.tipo !== 'numero') continue
          const rengSalida = rengCalcularEscena(rengE.simulacion.escena, rengE.simulacion.entradas)
          let rengValor = rengSalida[rengComp.clave]!
          if (rengComp.transformacion === 'log10') rengValor = Math.log10(rengValor)
          const rengTol = Math.max(rengE.respuesta.tolRel * Math.abs(rengE.respuesta.valor), rengE.respuesta.tolAbs, 1e-9)
          expect(Math.abs(rengValor - rengE.respuesta.valor), `${rengE.id}: simulación ${rengValor} frente a ejercicio ${rengE.respuesta.valor}`).toBeLessThanOrEqual(rengTol)
          rengComparados++
        }
      }
    }
    expect(rengComparados).toBeGreaterThan(40)
  })
  it('las simulaciones compatibles cubren pH/valoración, cinética, equilibrio y termoquímica', () => {
    const rengEscenas = new Set<string>()
    for (const rengT of ['ph', 'valoracion', 'cinetica', 'equilibrio', 'termo']) {
      for (const rengN of ['preuniversitario', 'universitario', 'quimico', 'cientifico'] as const) {
        const rengE = rengEjercicioDeTema(rengT, rengN, 3)
        if (rengE?.simulacion) rengEscenas.add(rengE.simulacion.escena)
      }
    }
    expect([...rengEscenas].sort()).toEqual(['acidobase', 'cinetica', 'equilibrio', 'mezcla', 'termo'])
  })
})

import { rengAnalizarFormula as rengAnalizarFormulaLocal } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
