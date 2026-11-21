import type { RengFormula } from './formula'

const RENG_ALCALINOS = new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'])
const RENG_ALCALINOTERREOS = new Set(['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'])

const RENG_PRIORIDAD: Array<[(rengS: string) => boolean, number]> = [
  [(rengS) => rengS === 'F', -1],
  [(rengS) => RENG_ALCALINOS.has(rengS), 1],
  [(rengS) => RENG_ALCALINOTERREOS.has(rengS), 2],
  [(rengS) => rengS === 'Al', 3],
  [(rengS) => rengS === 'H', 1],
  [(rengS) => rengS === 'O', -2],
  [(rengS) => rengS === 'Cl', -1],
  [(rengS) => rengS === 'Br', -1],
  [(rengS) => rengS === 'I', -1]
]

export function rengEstadosOxidacion(rengF: RengFormula): Map<string, number> | null {
  if (rengF.electron) return new Map()
  const rengElementos = [...rengF.atomos.keys()]
  if (rengElementos.length === 1) {
    const rengEl = rengElementos[0] as string
    return new Map([[rengEl, rengF.carga / (rengF.atomos.get(rengEl) as number)]])
  }
  const rengRes = new Map<string, number>()
  const rengPendientes = new Set(rengElementos)
  for (const [rengRegla, rengValor] of RENG_PRIORIDAD) {
    for (const rengEl of rengElementos) {
      if (rengPendientes.size <= 1) break
      if (rengPendientes.has(rengEl) && rengRegla(rengEl)) {
        rengRes.set(rengEl, rengValor)
        rengPendientes.delete(rengEl)
      }
    }
  }
  if (rengPendientes.size !== 1) return null
  const rengUltimo = [...rengPendientes][0] as string
  let rengSuma = 0
  for (const [rengEl, rengV] of rengRes) rengSuma += rengV * (rengF.atomos.get(rengEl) as number)
  rengRes.set(rengUltimo, (rengF.carga - rengSuma) / (rengF.atomos.get(rengUltimo) as number))
  return rengRes
}

export function rengTextoEstado(rengV: number): string {
  const rengSigno = rengV > 0 ? '+' : rengV < 0 ? '−' : ''
  const rengA = Math.abs(rengV)
  if (Number.isInteger(rengA)) return `${rengSigno}${rengA}`
  for (let rengD = 2; rengD <= 12; rengD++) if (Math.abs(rengA * rengD - Math.round(rengA * rengD)) < 1e-9) return `${rengSigno}${Math.round(rengA * rengD)}/${rengD}`
  return `${rengSigno}${rengA.toFixed(2)}`
}
