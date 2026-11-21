import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function rengLum(rengHex: string): number {
  const [rengR = 0, rengG = 0, rengB = 0] = [1, 3, 5].map((rengI) => parseInt(rengHex.slice(rengI, rengI + 2), 16) / 255).map((rengC) => (rengC <= 0.03928 ? rengC / 12.92 : ((rengC + 0.055) / 1.055) ** 2.4))
  return 0.2126 * rengR + 0.7152 * rengG + 0.0722 * rengB
}
const rengContraste = (rengA: string, rengB: string): number => {
  const [rengX, rengY] = [rengLum(rengA), rengLum(rengB)]
  return (Math.max(rengX, rengY) + 0.05) / (Math.min(rengX, rengY) + 0.05)
}

const rengCss = readFileSync(resolve(__dirname, '../src/renderer/styles/app.css'), 'utf-8')
function rengTokens(rengTema: 'dark' | 'light'): Record<string, string> {
  const rengOut: Record<string, string> = {}
  const rengBloques = [...rengCss.matchAll(/(:root|\[data-theme='light'\])\s*\{([^}]*)\}/g)]
  for (const [, rengSel = '', rengCuerpo = ''] of rengBloques) {
    if (rengSel !== ':root' && rengTema === 'dark') continue
    for (const rengM of rengCuerpo.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) rengOut[rengM[1] as string] = rengM[2] as string
  }
  return rengOut
}

describe.each(['dark', 'light'] as const)('contraste AA del tema %s', (rengTema) => {
  const rengT = rengTokens(rengTema) as Record<string, string>
  const rengFondos = ['bg', 'surface', 'surface-3']
  it.each(['text', 'text-2', 'text-3', 'accent', 'danger', 'warn', 'ok', 'fisica', 'quimica', 'lab'])('texto «%s» ≥ 4,5 sobre los fondos', (rengFg) => {
    for (const rengBg of rengFondos) expect(rengContraste(rengT[rengFg] as string, rengT[rengBg] as string), `${rengFg} sobre ${rengBg}`).toBeGreaterThanOrEqual(4.5)
  })
  it('el texto de los botones de acento (accent-ink) es legible sobre el acento', () => {
    expect(rengContraste(rengT['accent-ink'] as string, rengT.accent as string)).toBeGreaterThanOrEqual(4.5)
  })
})
