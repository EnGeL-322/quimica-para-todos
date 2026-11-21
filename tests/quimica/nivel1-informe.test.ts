import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_CORRESPONDENCIAS } from '../../src/renderer/modules/simulador-quimica/temario/correspondencias'
import { rengCatalogoReal, rengConstruirCatalogo } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { RENG_MARCA_FIN_INFORME, RENG_MARCA_INICIO_INFORME, rengInformeNivel1, rengSustituirInforme } from '../../src/renderer/modules/simulador-quimica/temario/informeNivel1'

const RENG_DOC = join(import.meta.dirname, '../../docs/NIVEL-1-ESTADO.md')
const RENG_ESCRIBIR = process.env['RENG_INFORME_ESCRIBIR'] === '1'

describe('Nivel 1 · informe de cobertura derivado de los recursos reales', () => {
  const rengInforme = rengInformeNivel1(rengCatalogoReal())

  it(RENG_ESCRIBIR ? 'regenera la sección de cobertura de docs/NIVEL-1-ESTADO.md' : 'docs/NIVEL-1-ESTADO.md coincide con los recursos reales (si falla: node scripts/informe-nivel1.mjs)', () => {
    const rengTexto = readFileSync(RENG_DOC, 'utf8').replace(/\r\n/g, '\n')
    const rengNuevo = rengSustituirInforme(rengTexto, rengInforme)
    if (RENG_ESCRIBIR) writeFileSync(RENG_DOC, rengNuevo)
    else expect(rengTexto).toBe(rengNuevo)
  })

  it('el informe nombra los 12 bloques del Nivel 1 y el bloque 8 con sus 20 lecciones y 60 prácticas', () => {
    expect(rengInforme.match(/^### Bloque \d+ · /gm)).toHaveLength(12)
    expect(rengInforme).toContain('### Bloque 8 · Gases')
    expect(rengInforme).toContain('Lecciones por capas 20/20 · Prácticas nuevas 20/20 (60)')
  })

  it('SABOTAJE: quitar una lección de los recursos cambia el informe (no hay contadores escritos a mano)', () => {
    const rengSin = { ...RENG_CORRESPONDENCIAS, 8: (RENG_CORRESPONDENCIAS[8] ?? []).slice(1) }
    expect(rengInformeNivel1(rengConstruirCatalogo(undefined, rengSin))).not.toBe(rengInforme)
  })

  it('SABOTAJE: un número retocado a mano en el documento se detecta', () => {
    const rengTexto = rengSustituirInforme(`a\n${RENG_MARCA_INICIO_INFORME}\n${RENG_MARCA_FIN_INFORME}\n`, rengInforme)
    const rengRetocado = rengTexto.replace('20/20', '19/20')
    expect(rengRetocado).not.toBe(rengSustituirInforme(rengRetocado, rengInforme))
    expect(() => rengSustituirInforme('sin marcas', rengInforme)).toThrow(/marcas/)
  })
})
