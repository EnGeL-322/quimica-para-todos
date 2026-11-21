import { describe, expect, it } from 'vitest'
import { rengAnalizarFragmento } from '../../src/renderer/modules/simulador-quimica/nucleo/analisisMesa'
import { rengAnadirAtomo, rengFragmentos, rengMesaVacia, rengUnir, type RengMesa } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengSecuenciaDeEnlace } from '../../src/renderer/modules/simulador-quimica/nucleo/secuenciaEnlace'

function rengOh(): { m: RengMesa; o: number; h: number } {
  let rengM = rengMesaVacia()
  const rengO = rengAnadirAtomo(rengM, 'O', [0, 0, 0])
  rengM = rengO.mesa
  const rengH = rengAnadirAtomo(rengM, 'H', [1, 0, 0])
  rengM = rengUnir(rengH.mesa, rengO.id, rengH.id).mesa
  return { m: rengM, o: rengO.id, h: rengH.id }
}

describe('regresión: OH no es agua', () => {
  it('el paso a paso del enlace O–H de un OH es de ese enlace, no de H₂O', () => {
    const { m: rengM, o: rengO, h: rengH } = rengOh()
    const rengS = rengSecuenciaDeEnlace(rengM, rengO, rengH)
    expect(rengS.sec).not.toBeNull()
    expect(rengS.sec!.id).not.toBe('h2o')
    expect(rengS.sec!.formula).toBe('OH')
    expect(JSON.stringify(rengS.sec)).not.toContain('H2O')
    expect(rengS.avisos.join(' ')).toMatch(/aproximada/)
  })
  it('construir OH nunca produce H₂O', () => {
    const { m: rengM } = rengOh()
    const rengA = rengAnalizarFragmento(rengM, rengFragmentos(rengM)[0]!)
    expect(rengA.formula).toBe('OH')
    expect(rengA.nombre).not.toBe('agua')
    expect(rengA.completa).toBe(false)
  })
  it('un enlace doble sin secuencia escrita no muestra otra en su lugar', () => {
    let rengM = rengMesaVacia()
    const rengC = rengAnadirAtomo(rengM, 'C', [0, 0, 0])
    const rengO = rengAnadirAtomo(rengC.mesa, 'O', [1, 0, 0])
    rengM = rengUnir(rengUnir(rengO.mesa, rengC.id, rengO.id).mesa, rengC.id, rengO.id).mesa
    const rengS = rengSecuenciaDeEnlace(rengM, rengC.id, rengO.id)
    expect(rengS.sec).toBeNull()
    expect(rengS.avisos[0]).toMatch(/No se muestra otra/)
  })
})
