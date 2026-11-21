const RENG_UNIDADES: Array<[RegExp, string, 'carbono' | 'terminal' | 'hetero' | 'h']> = [
  [/^C6H5/, 'c1ccccc1', 'carbono'],
  [/^C2H5/, 'CC', 'carbono'],
  [/^CONH2/, 'C(=O)N', 'terminal'],
  [/^COOH/, 'C(=O)O', 'terminal'],
  [/^COO/, 'C(=O)O', 'carbono'],
  [/^CHO(?!H)/, 'C=O', 'terminal'],
  [/^CN/, 'C#N', 'terminal'],
  [/^CO(?![a-z])/, 'C(=O)', 'carbono'],
  [/^CH3/, 'C', 'carbono'],
  [/^CH2/, 'C', 'carbono'],
  [/^CH/, 'C', 'carbono'],
  [/^C(?![a-z])/, 'C', 'carbono'],
  [/^OH/, 'O', 'hetero'],
  [/^O/, 'O', 'hetero'],
  [/^NH2/, 'N', 'hetero'],
  [/^NH/, 'N', 'hetero'],
  [/^N(?![a-z])/, 'N', 'hetero'],
  [/^Cl/, 'Cl', 'hetero'],
  [/^Br/, 'Br', 'hetero'],
  [/^F/, 'F', 'hetero'],
  [/^I/, 'I', 'hetero'],
  [/^H(?![a-z])/, '', 'h']
]

export function rengSemidesarrolladaASmiles(rengTexto: string): string | null {
  const rengT = rengTexto.replace(/\s+/g, '').replace(/≡/g, '#').replace(/–/g, '-')
  interface RengItem {
    s: string
    ramas: string[]
    enlaceAntes: string
  }
  const rengItems: RengItem[] = []
  const rengPendientes: string[] = []
  let rengEnlace = ''
  let rengI = 0
  while (rengI < rengT.length) {
    const rengResto = rengT.slice(rengI)
    if (rengResto[0] === '=' || rengResto[0] === '#') {
      rengEnlace = rengResto[0]
      rengI++
      continue
    }
    if (rengResto[0] === '-') {
      rengI++
      continue
    }
    if (rengResto[0] === '(') {
      let rengNivel = 0
      let rengJ = rengI
      for (; rengJ < rengT.length; rengJ++) {
        if (rengT[rengJ] === '(') rengNivel++
        else if (rengT[rengJ] === ')' && --rengNivel === 0) break
      }
      if (rengJ >= rengT.length) return null
      const rengDentro = rengSemidesarrolladaASmiles(rengT.slice(rengI + 1, rengJ))
      if (rengDentro === null) return null
      const rengMm = /^\d+/.exec(rengT.slice(rengJ + 1))
      const rengVeces = rengMm ? Number(rengMm[0]) : 1
      rengI = rengJ + 1 + (rengMm ? rengMm[0].length : 0)
      const rengRamas = Array.from({ length: rengVeces }, () => rengDentro)
      if (rengItems.length) rengItems[rengItems.length - 1]!.ramas.push(...rengRamas)
      else rengPendientes.push(...rengRamas)
      continue
    }
    const rengU = RENG_UNIDADES.find(([rengRe]) => rengRe.test(rengResto))
    if (!rengU) return null
    const rengLen = rengU[0].exec(rengResto)![0].length
    rengI += rengLen
    const rengMm = /^\d+/.exec(rengT.slice(rengI))
    const rengVeces = rengMm ? Number(rengMm[0]) : 1
    if (rengMm) rengI += rengMm[0].length
    if (rengU[2] === 'h') continue
    if (rengU[2] === 'hetero' && rengVeces > 1) {
      if (!rengItems.length) return null
      const rengUltimo = rengItems[rengItems.length - 1]!
      rengUltimo.ramas.push(...Array.from({ length: rengVeces - 1 }, () => rengU[1]))
      rengItems.push({ s: rengU[1], ramas: [], enlaceAntes: rengEnlace })
    } else {
      if (rengVeces > 1) return null
      rengItems.push({ s: rengU[1], ramas: [], enlaceAntes: rengEnlace })
    }
    rengEnlace = ''
  }
  if (!rengItems.length) return null
  if (rengPendientes.length) rengItems[0]!.ramas.unshift(...rengPendientes)
  return rengItems
    .map((rengIt, rengK) => {
      const rengRamas = rengIt.ramas.map((rengR) => `(${rengR})`).join('')
      const rengSim = rengIt.s
      const rengPrimero = /^(c1|Cl|Br|C|O|N|F|I)/.exec(rengSim)
      const rengCuerpo = rengPrimero && rengRamas ? `${rengPrimero[0]}${rengRamas}${rengSim.slice(rengPrimero[0].length)}` : rengSim
      return `${rengK > 0 ? rengIt.enlaceAntes : ''}${rengCuerpo}`
    })
    .join('')
}
