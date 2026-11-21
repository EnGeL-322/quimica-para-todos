import { describe, expect, it } from 'vitest'
import { rengDerivarActivo } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengMedidasFragmento } from '../../src/renderer/modules/simulador-quimica/nucleo/medidas'
import { rengEsElementoBasico } from '../../src/renderer/modules/simulador-quimica/nucleo/tablaBasica'
import { RENG_ELEMENTOS } from '../../src/renderer/modules/tabla-periodica/data'
import { rengCon } from './ayudasMesa'

describe('medidasFragmento', () => {
  it('H2O: dos distancias O–H plausibles y un ángulo H–O–H cercano a 104,5°', () => {
    const rengE = rengCon('H2O')
    const rengD = rengDerivarActivo(rengE)!
    const rengM = rengMedidasFragmento(rengE.mesa, rengD.ids)
    expect(rengM.distancias).toHaveLength(2)
    for (const rengX of rengM.distancias) {
      expect(rengX.etiqueta).toBe('O–H')
      expect(rengX.angstrom).toBeGreaterThan(0.85)
      expect(rengX.angstrom).toBeLessThan(1.15)
    }
    expect(rengM.angulos).toHaveLength(1)
    expect(rengM.angulos[0]!.etiqueta).toBe('H–O–H')
    expect(rengM.angulos[0]!.grados).toBeGreaterThan(100)
    expect(rengM.angulos[0]!.grados).toBeLessThan(110)
  })
  it('CH4: cuatro distancias y seis ángulos H–C–H de ≈109,5°', () => {
    const rengE = rengCon('CH4')
    const rengM = rengMedidasFragmento(rengE.mesa, rengDerivarActivo(rengE)!.ids)
    expect(rengM.distancias).toHaveLength(4)
    expect(rengM.angulos).toHaveLength(6)
    for (const rengA of rengM.angulos) expect(Math.abs(rengA.grados - 109.5)).toBeLessThan(3)
  })
  it('respeta el máximo de medidas', () => {
    const rengE = rengCon('CH4')
    expect(rengMedidasFragmento(rengE.mesa, rengDerivarActivo(rengE)!.ids, 3).angulos).toHaveLength(3)
  })
})

describe('tabla periódica reducida (Básico)', () => {
  it('incluye H–Kr y los comunes (Ag, Au, Hg, Pb, I) y deja fuera los raros', () => {
    for (let rengZ = 1; rengZ <= 36; rengZ++) expect(rengEsElementoBasico(rengZ), String(rengZ)).toBe(true)
    for (const rengS of ['Ag', 'Sn', 'I', 'Au', 'Hg', 'Pb', 'U']) expect(rengEsElementoBasico(RENG_ELEMENTOS.find((rengE) => rengE.simbolo === rengS)!.z), rengS).toBe(true)
    for (const rengS of ['Og', 'Lr', 'Md', 'Ho']) expect(rengEsElementoBasico(RENG_ELEMENTOS.find((rengE) => rengE.simbolo === rengS)!.z), rengS).toBe(false)
  })
  it('es una reducción real: menos de la mitad de los 118', () => {
    const rengN = RENG_ELEMENTOS.filter((rengE) => rengEsElementoBasico(rengE.z)).length
    expect(rengN).toBeGreaterThan(30)
    expect(rengN).toBeLessThan(59)
  })
})
