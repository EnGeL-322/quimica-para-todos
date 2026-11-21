import { describe, expect, it } from 'vitest'
import { rengCompile, rengDerivada, rengEvaluate, rengIntegral, rengRaiz } from '../src/renderer/modules/laboratorio/expr'
import { rengCuantil, rengDescriptiva, rengHistograma, rengParseNumeros, rengRegresionLineal } from '../src/renderer/modules/laboratorio/stats'
import { rengAngulo, rengDetectarEnlaces, rengDistancia, RENG_MOLECULAS } from '../src/renderer/modules/simulador-quimica/chemistry'
import { rengCapas, rengConfiguracion, RENG_ELEMENTOS, rengMasaMolar } from '../src/renderer/modules/tabla-periodica/data'

const rengCerca = (rengA: number, rengB: number, rengTol = 1e-9): void => expect(Math.abs(rengA - rengB)).toBeLessThanOrEqual(rengTol)

describe('evaluador de expresiones', () => {
  it('respeta precedencia, asociatividad y signos', () => {
    expect(rengEvaluate('2+3*4')).toBe(14)
    expect(rengEvaluate('(2+3)*4')).toBe(20)
    expect(rengEvaluate('2^3^2')).toBe(512)
    expect(rengEvaluate('-2^2')).toBe(-4)
    expect(rengEvaluate('2^-1')).toBe(0.5)
    expect(rengEvaluate('10/4')).toBe(2.5)
    expect(rengEvaluate('5!')).toBe(120)
    expect(rengEvaluate('50%')).toBe(0.5)
  })
  it('funciones y constantes', () => {
    rengCerca(rengEvaluate('sin(pi/6)'), 0.5)
    rengCerca(rengEvaluate('ln(e)'), 1)
    rengCerca(rengEvaluate('log(1000)'), 3)
    expect(rengEvaluate('sqrt(16)')).toBe(4)
    rengCerca(rengEvaluate('phi^2 - phi'), 1)
    rengCerca(rengEvaluate('sin(30)', {}, { grados: true }), 0.5)
    rengCerca(rengEvaluate('asin(0.5)', {}, { grados: true }), 30)
  })
  it('multiplicación implícita', () => {
    rengCerca(rengEvaluate('2pi'), 2 * Math.PI)
    expect(rengEvaluate('3(4+1)')).toBe(15)
    expect(rengEvaluate('x(x+1)', { x: 3 })).toBe(12)
    rengCerca(rengEvaluate('2sin(pi/2)cos(0)'), 2)
  })
  it('variables y compilación reutilizable', () => {
    const rengF = rengCompile('x^2 + 1')
    expect(rengF({ x: 3 })).toBe(10)
    expect(rengF({ x: -2 })).toBe(5)
  })
  it('errores claros, nunca ejecución arbitraria', () => {
    expect(() => rengEvaluate('2+')).toThrow()
    expect(() => rengEvaluate('(2+3')).toThrow(/paréntesis/)
    expect(() => rengEvaluate('y+1')).toThrow(/Variable desconocida/)
    expect(() => rengEvaluate('sin 3')).toThrow(/paréntesis/)
    expect(() => rengEvaluate('process.exit(1)')).toThrow()
    expect(() => rengEvaluate('constructor')).toThrow()
    expect(() => rengEvaluate('__proto__')).toThrow()
    expect(() => rengEvaluate('1'.repeat(501))).toThrow(/larga/)
    expect(() => rengEvaluate('2 $ 3')).toThrow(/no permitido/)
  })
})

describe('cálculo numérico', () => {
  it('derivada de sin en 0 es 1, de x^3 en 2 es 12', () => {
    rengCerca(rengDerivada(Math.sin, 0), 1, 1e-8)
    rengCerca(rengDerivada((rengX) => rengX ** 3, 2), 12, 1e-6)
  })
  it('integral de sin en [0, π] es 2; de e^x en [0,1] es e−1', () => {
    rengCerca(rengIntegral(Math.sin, 0, Math.PI), 2, 1e-8)
    rengCerca(rengIntegral(Math.exp, 0, 1), Math.E - 1, 1e-9)
  })
  it('raíz de x²−2 es √2; sin cambio de signo lanza error', () => {
    rengCerca(rengRaiz((rengX) => rengX * rengX - 2, 0, 2), Math.SQRT2, 1e-9)
    expect(() => rengRaiz((rengX) => rengX * rengX + 1, -1, 1)).toThrow(/mismo signo/)
  })
})

describe('estadística', () => {
  const rengD = rengDescriptiva([12, 15, 11, 18, 15, 20, 14, 15, 17, 13])
  it('coincide con valores de referencia', () => {
    expect(rengD.n).toBe(10)
    rengCerca(rengD.media, 15)
    rengCerca(rengD.mediana, 15)
    expect(rengD.moda).toEqual([15])
    rengCerca(rengD.desvMuestral, Math.sqrt(68 / 9), 1e-12)
    rengCerca(rengD.desvPoblacional, Math.sqrt(6.8), 1e-12)
  })
  it('cuantiles R-7', () => {
    rengCerca(rengCuantil([1, 2, 3, 4, 5], 0.25), 2)
    rengCerca(rengCuantil([1, 2, 3, 4], 0.5), 2.5)
  })
  it('regresión lineal exacta y con ruido', () => {
    const rengR = rengRegresionLineal([1, 2, 3, 4], [3, 5, 7, 9])
    rengCerca(rengR.pendiente, 2)
    rengCerca(rengR.intercepto, 1)
    rengCerca(rengR.r2, 1)
    expect(() => rengRegresionLineal([1, 1, 1], [1, 2, 3])).toThrow()
  })
  it('lee números según el formato decimal elegido (sin adivinar «3,5»)', () => {
    expect(rengParseNumeros('1, 2.5; 3,5\n4 5')).toEqual([1, 2.5, 3, 5, 4, 5])
    expect(rengParseNumeros('1; 2,5\n3,5 4', 'coma')).toEqual([1, 2.5, 3.5, 4])
  })
  it('histograma conserva el total', () => {
    const rengH = rengHistograma([1, 2, 2, 3, 3, 3, 10])
    expect(rengH.reduce((rengA, rengB) => rengA + rengB.cuenta, 0)).toBe(7)
  })
})

describe('moléculas', () => {
  const rengM = (rengId: string) => RENG_MOLECULAS.find((rengX) => rengX.id === rengId)!
  it('agua: O–H 0,957 Å y ángulo 104,5°', () => {
    const rengW = rengM('h2o')
    rengCerca(rengDistancia(rengW.atomos[0]!, rengW.atomos[1]!), 0.9572, 1e-3)
    rengCerca(rengAngulo(rengW.atomos[1]!, rengW.atomos[0]!, rengW.atomos[2]!), 104.52, 0.01)
  })
  it('metano: ángulo tetraédrico 109,47° y 4 enlaces', () => {
    const rengC = rengM('ch4')
    rengCerca(rengAngulo(rengC.atomos[1]!, rengC.atomos[0]!, rengC.atomos[2]!), 109.47, 0.01)
    expect(rengDetectarEnlaces(rengC.atomos)).toHaveLength(4)
  })
  it('amoníaco: H–N–H 106,7° y N–H 1,012 Å', () => {
    const rengN = rengM('nh3')
    rengCerca(rengAngulo(rengN.atomos[1]!, rengN.atomos[0]!, rengN.atomos[2]!), 106.7, 0.01)
    rengCerca(rengDistancia(rengN.atomos[0]!, rengN.atomos[1]!), 1.012, 1e-6)
  })
  it('benceno: 12 enlaces simples detectados (6 C–C + 6 C–H) y dobles marcados', () => {
    const rengB = rengM('c6h6')
    expect(rengDetectarEnlaces(rengB.atomos)).toHaveLength(12)
    expect(Object.keys(rengB.orden ?? {})).toHaveLength(3)
  })
  it('etileno: H–C–H 117,4°', () => {
    const rengE = rengM('c2h4')
    rengCerca(rengAngulo(rengE.atomos[2]!, rengE.atomos[1]!, rengE.atomos[3]!), 117.4, 0.05)
  })
  it('CO₂ es lineal y las H₂ no se enlazan entre sí', () => {
    const rengC = rengM('co2')
    rengCerca(rengAngulo(rengC.atomos[0]!, rengC.atomos[1]!, rengC.atomos[2]!), 180, 1e-9)
    expect(rengDetectarEnlaces(rengM('h2o').atomos)).toHaveLength(2)
  })
})

describe('tabla periódica', () => {
  const rengEl = (rengS: string) => RENG_ELEMENTOS.find((rengE) => rengE.simbolo === rengS)!
  it('118 elementos con números atómicos consecutivos y posiciones únicas', () => {
    expect(RENG_ELEMENTOS).toHaveLength(118)
    RENG_ELEMENTOS.forEach((rengE, rengI) => expect(rengE.z).toBe(rengI + 1))
    const rengPos = new Set(RENG_ELEMENTOS.map((rengE) => `${rengE.fila},${rengE.columna}`))
    expect(rengPos.size).toBe(118)
  })
  it('posiciones de referencia', () => {
    expect([rengEl('H').fila, rengEl('H').columna]).toEqual([1, 1])
    expect([rengEl('He').fila, rengEl('He').columna]).toEqual([1, 18])
    expect([rengEl('Fe').fila, rengEl('Fe').columna]).toEqual([4, 8])
    expect([rengEl('Og').fila, rengEl('Og').columna]).toEqual([7, 18])
    expect(rengEl('La').fila).toBe(9)
    expect(rengEl('U').fila).toBe(10)
    expect(rengEl('Cl').categoria).toBe('halogeno')
    expect(rengEl('Na').categoria).toBe('alcalino')
    expect(rengEl('Hg').estado).toBe('líquido')
  })
  it('configuraciones electrónicas (incluidas excepciones)', () => {
    expect(rengConfiguracion(8)).toBe('[He] 2s² 2p⁴')
    expect(rengConfiguracion(26)).toBe('[Ar] 3d⁶ 4s²')
    expect(rengConfiguracion(24)).toBe('[Ar] 3d⁵ 4s¹')
    expect(rengConfiguracion(29)).toBe('[Ar] 3d¹⁰ 4s¹')
    expect(rengConfiguracion(47)).toBe('[Kr] 4d¹⁰ 5s¹')
    expect(rengConfiguracion(79)).toBe('[Xe] 4f¹⁴ 5d¹⁰ 6s¹')
    expect(rengConfiguracion(92)).toBe('[Rn] 5f³ 6d¹ 7s²')
    expect(rengConfiguracion(2, false)).toBe('1s²')
  })
  it('la suma de electrones por capa siempre es Z', () => {
    for (const rengE of RENG_ELEMENTOS) expect(rengCapas(rengE.z).reduce((rengA, rengB) => rengA + rengB, 0)).toBe(rengE.z)
    expect(rengCapas(11)).toEqual([2, 8, 1])
  })
  it('masa molar', () => {
    rengCerca(rengMasaMolar('H2O').total, 18.015, 1e-3)
    rengCerca(rengMasaMolar('Ca(OH)2').total, 74.092, 2e-3)
    rengCerca(rengMasaMolar('Al2(SO4)3').total, 342.15, 0.02)
    rengCerca(rengMasaMolar('CuSO4·5H2O').total, 249.68, 0.02)
    rengCerca(rengMasaMolar('C6H12O6').total, 180.156, 5e-3)
    rengCerca(rengMasaMolar('K4[Fe(CN)6]').total, 368.35, 0.02)
  })
  it('masa molar: errores claros', () => {
    expect(() => rengMasaMolar('')).toThrow()
    expect(() => rengMasaMolar('Xx2')).toThrow(/desconocido/)
    expect(() => rengMasaMolar('Ca(OH')).toThrow(/Paréntesis/)
    expect(() => rengMasaMolar('H2O$')).toThrow(/no válido/)
    expect(() => rengMasaMolar('CL')).toThrow()
  })
})
