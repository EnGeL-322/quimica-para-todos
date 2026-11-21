import { describe, expect, it } from 'vitest'
import { RENG_ELEMENTOS } from '../src/renderer/modules/tabla-periodica/data'
import { rengExtraDe, RENG_FUENTE_DATOS, rengTextoAnio, rengTextoDensidad, rengTextoTemperatura } from '../src/renderer/modules/tabla-periodica/datosElementos'

const rengEl = (rengZ: number) => RENG_ELEMENTOS.find((rengE) => rengE.z === rengZ)!

describe('datos de Wikidata incluidos', () => {
  it('declaran fuente, licencia CC0 y fecha de obtención', () => {
    expect(RENG_FUENTE_DATOS.licencia).toMatch(/CC0/)
    expect(RENG_FUENTE_DATOS.obtenido).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
  it('comprobaciones puntuales con valores muy conocidos', () => {
    expect(rengExtraDe(26, rengEl(26).estado).fusionK!.valores[0]).toBeCloseTo(1811, 0)
    expect(rengExtraDe(26, rengEl(26).estado).densidadKgM3!.valores[0]).toBeCloseTo(7874, 0)
    expect(rengExtraDe(80, rengEl(80).estado).fusionK!.valores[0]).toBeCloseTo(234.3, 0)
    expect(rengExtraDe(1, rengEl(1).estado).densidadKgM3!.valores[0]).toBeCloseTo(0.08987, 4)
  })
  it('todos los valores mostrados son positivos y coherentes (ebullición ≥ fusión)', () => {
    for (const rengE of RENG_ELEMENTOS) {
      const rengX = rengExtraDe(rengE.z, rengE.estado)
      for (const rengM of [rengX.fusionK, rengX.ebullicionK, rengX.densidadKgM3]) if (rengM) for (const rengV of rengM.valores) expect(rengV, `${rengE.simbolo}`).toBeGreaterThan(0)
      if (rengX.fusionK && rengX.ebullicionK) expect(rengX.ebullicionK.valores[rengX.ebullicionK.valores.length - 1]!, rengE.simbolo).toBeGreaterThanOrEqual(rengX.fusionK.valores[0]! * 0.95)
    }
  })
  it('un gas a 25 °C nunca muestra una densidad de líquido o sólido', () => {
    for (const rengE of RENG_ELEMENTOS.filter((rengX) => rengX.estado === 'gas')) {
      const rengD = rengExtraDe(rengE.z, rengE.estado).densidadKgM3
      if (rengD) for (const rengV of rengD.valores) expect(rengV, rengE.simbolo).toBeLessThanOrEqual(50)
    }
  })
  it('lo que falta se dice «sin dato»', () => {
    expect(rengTextoTemperatura(undefined)).toBe('sin dato')
    expect(rengTextoDensidad(undefined)).toBe('sin dato')
    expect(rengTextoAnio(undefined)).toBe('sin dato')
    expect(rengTextoAnio(-5000)).toMatch(/antigüedad/)
  })
  it('los 118 elementos tienen ficha (aunque falten datos), y la cobertura es la medida', () => {
    let rengConFusion = 0
    for (const rengE of RENG_ELEMENTOS) if (rengExtraDe(rengE.z, rengE.estado).fusionK) rengConFusion++
    expect(RENG_ELEMENTOS).toHaveLength(118)
    expect(rengConFusion).toBeGreaterThan(90)
  })
})

describe('datos incoherentes de la fuente', () => {
  it('el astato (At): Wikidata da una ebullición menor que la fusión; se descarta y se avisa', () => {
    const rengX = rengExtraDe(85, rengEl(85).estado)
    expect(rengX.fusionK).toBeUndefined()
    expect(rengX.ebullicionK).toBeUndefined()
    expect(rengX.avisos?.[0]).toMatch(/incoherentes/)
  })
})
