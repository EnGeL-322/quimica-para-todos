import { describe, expect, it } from 'vitest'
import { rengClaveIdentidad } from '../../src/renderer/modules/simulador-quimica/nucleo/identidad'
import { RENG_REACCIONES } from '../../src/renderer/modules/simulador-quimica/nucleo/reaccionesConocidas'
import { rengInterpretarSustancia, RENG_NOMBRE_TIPO, type RengSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'

const rengS = (rengT: string): RengSustancia => {
  const rengR = rengInterpretarSustancia(rengT)
  if (rengR.tipo !== 'ok') throw new Error(`${rengT}: ${JSON.stringify(rengR).slice(0, 200)}`)
  return rengR.sustancia
}

describe('componentes desconectados', () => {
  it('[Na+].[Cl-] es cloruro de sodio, compuesto iónico, con la identidad de «NaCl»', () => {
    const rengX = rengS('[Na+].[Cl-]')
    expect(rengX.tipo).toBe('ionico')
    expect(RENG_NOMBRE_TIPO[rengX.tipo]).toMatch(/iónico/)
    expect(rengX.nombre).toBe('cloruro de sodio')
    expect(rengX.formula).toBe('NaCl')
    expect(rengX.notas.join(' ')).toMatch(/unidad fórmula de un compuesto iónico/)
    expect(rengClaveIdentidad('[Na+].[Cl-]')).toBe(rengClaveIdentidad('NaCl'))
    expect(rengS('[Na+].[OH-]')).toMatchObject({ tipo: 'ionico', nombre: 'hidróxido de sodio', formula: 'NaOH' })
  })
  it('CCO.O=C=O es una mezcla de dos especies, sin nombre ni masa molar únicos', () => {
    const rengX = rengS('CCO.O=C=O')
    expect(rengX.tipo).toBe('mezcla')
    expect(rengX.nombre).toBe('Mezcla: etanol + dióxido de carbono')
    expect(rengX.formula).toBe('C2H6O + CO2')
    expect(rengX.masaMolar).toBeNaN()
    expect(rengX.notas.join(' ')).toMatch(/2 especies separadas/)
    expect(rengClaveIdentidad('CCO.O=C=O')).toMatch(/^m:1\*.+\+1\*.+$/)
    const rengPartes = (rengX: RengSustancia): string[] => rengX.nombre.replace(/^Mezcla: /, '').split(' + ').sort()
    expect(rengS('O.O=C=O').tipo).toBe('mezcla')
    expect(rengPartes(rengS('O.O=C=O'))).toEqual(['agua', 'dióxido de carbono'])
    const rengTres = rengS('CCO.CCO.O=C=O')
    expect(rengPartes(rengTres)).toEqual(['2 × etanol', 'dióxido de carbono'])
    expect(rengTres.formula.split(' + ').sort()).toEqual(['2C2H6O', 'CO2'])
  })
  it('una sal que la app no reconoce se muestra como sus iones, sin inventar nombre', () => {
    const rengX = rengS('[Na+].[O-]C(=O)C')
    expect(rengX.tipo).toBe('ionico')
    expect(rengX.nombre === 'acetato de sodio' || rengX.nombre.startsWith('iones ')).toBe(true)
  })
})

describe('nombres de compuestos de carbono', () => {
  it('inorgánicos: su nombre inorgánico, no el del nombrador orgánico', () => {
    expect(rengS('O=C=O').nombre).toBe('dióxido de carbono')
    expect(rengS('[C-]#[O+]').nombre).toBe('monóxido de carbono')
    expect(rengS('OC(=O)O').nombre).toBe('ácido carbónico')
    expect(rengS('S=C=S').nombre).toBe('disulfuro de carbono')
    for (const rengT of ['O=C=O', 'OC(=O)O']) expect(rengS(rengT).otrosNombres.join('|')).not.toMatch(/metano(na|ico)/)
  })
  it('la biblioteca curada gana cuando contradice al nombrador orgánico; si coinciden, se mantiene el IUPAC', () => {
    expect(rengS('NC(N)=O').nombre).toBe('urea')
    expect(rengS('NC(N)=O').otrosNombres).not.toContain('metanamida')
    expect(rengS('C=O').nombre).toBe('metanal')
    expect(rengS('C=O').otrosNombres).toContain('formaldehído')
    expect(rengS('CCO').nombre).toBe('etanol')
    expect(rengS('OC=O').nombre).toBe('ácido metanoico')
  })
})

describe('catálogo de reacciones', () => {
  it('la neutralización HCl + NaOH no anuncia pH 7 sin cantidades', () => {
    const rengR = RENG_REACCIONES.find((rengX) => rengX.id === 'hcl-naoh')!
    expect(rengR.observable).not.toMatch(/el pH pasa a 7/)
    expect(rengR.observable).toMatch(/depende de las cantidades/)
    expect(rengR.observable).toMatch(/Mezcla ácido–base/)
  })
})
