import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_CARACTERISTICAS, rengMuestra, rengTablaPorPestana, type RengPestana } from '../../src/renderer/modules/simulador-quimica/nucleo/niveles'

const RENG_PESTANAS: RengPestana[] = ['explorar', 'enlaces', 'formulacion', 'reacciones', 'casos', 'simulaciones']
const RENG_RAIZ = join(__dirname, '../../src/renderer/modules/simulador-quimica')

describe('registro de niveles', () => {
  it('cada característica se ve en al menos un nivel y su clave empieza por su pestaña', () => {
    for (const [rengClave, rengC] of Object.entries(RENG_CARACTERISTICAS)) {
      expect(rengC.basico || rengC.avanzado, rengClave).toBe(true)
      expect(rengClave.startsWith(`${rengC.pestana}.`), rengClave).toBe(true)
      expect(rengC.descripcion.length, rengClave).toBeGreaterThan(10)
    }
  })
  it('las cuatro pestañas cambian de verdad entre Básico y Avanzado', () => {
    const rengT = rengTablaPorPestana()
    for (const rengP of RENG_PESTANAS) {
      const rengDistintas = Object.values(RENG_CARACTERISTICAS).filter((rengC) => rengC.pestana === rengP && rengC.basico !== rengC.avanzado)
      expect(rengDistintas.length, `la pestaña ${rengP} no cambia entre niveles`).toBeGreaterThan(0)
      expect(rengT[rengP].avanzado.length, rengP).toBeGreaterThan(0)
    }
  })
  it('muestra() sigue el registro', () => {
    expect(rengMuestra('avanzado', 'explorar.smiles')).toBe(true)
    expect(rengMuestra('basico', 'explorar.smiles')).toBe(false)
    expect(rengMuestra('basico', 'formulacion.nombresSimples')).toBe(true)
    expect(rengMuestra('avanzado', 'formulacion.nombresSimples')).toBe(false)
  })
})

describe('las vistas no deciden el nivel por su cuenta', () => {
  const rengArchivos = (rengD: string): string[] => readdirSync(join(RENG_RAIZ, rengD)).filter((rengF) => rengF.endsWith('.tsx')).map((rengF) => join(RENG_RAIZ, rengD, rengF))
  const rengPermitidos = ['PracticaFormulacion.tsx']
  it("ningún componente compara nivel === 'basico'/'avanzado'", () => {
    for (const rengF of [...rengArchivos('vista'), ...rengArchivos('modos')]) {
      if (rengPermitidos.some((rengP) => rengF.endsWith(rengP))) continue
      const rengT = readFileSync(rengF, 'utf8')
      expect(/nivel\s*===?\s*'(basico|avanzado)'/.test(rengT), rengF).toBe(false)
    }
  })
})
