import { rengAtomo, rengDistancia, rengEnlacesDe, rengVecinosDe, type RengMesa } from './mesa'
import { rengAngulo } from './relajar'

export interface RengMedidasFragmento {
  distancias: Array<{ etiqueta: string; angstrom: number }>
  angulos: Array<{ etiqueta: string; grados: number }>
}

const RENG_MAX = 12

export function rengMedidasFragmento(rengM: RengMesa, rengIds: readonly number[], rengMax = RENG_MAX): RengMedidasFragmento {
  const rengDentro = new Set(rengIds)
  const rengDistancias: RengMedidasFragmento['distancias'] = []
  const rengVistos = new Set<string>()
  for (const rengId of rengIds) {
    for (const rengE of rengEnlacesDe(rengM, rengId)) {
      const rengK = `${Math.min(rengE.a, rengE.b)}-${Math.max(rengE.a, rengE.b)}`
      if (rengVistos.has(rengK) || !rengDentro.has(rengE.a) || !rengDentro.has(rengE.b)) continue
      rengVistos.add(rengK)
      const rengA = rengAtomo(rengM, rengE.a)!
      const rengB = rengAtomo(rengM, rengE.b)!
      if (rengDistancias.length < rengMax) rengDistancias.push({ etiqueta: `${rengA.el}–${rengB.el}`, angstrom: rengDistancia(rengA.p, rengB.p) })
    }
  }
  const rengAngulos: RengMedidasFragmento['angulos'] = []
  for (const rengV of rengIds) {
    const rengN = rengVecinosDe(rengM, rengV).filter((rengX) => rengDentro.has(rengX))
    const rengC = rengAtomo(rengM, rengV)!
    for (let rengI = 0; rengI < rengN.length; rengI++)
      for (let rengJ = rengI + 1; rengJ < rengN.length; rengJ++) {
        if (rengAngulos.length >= rengMax) break
        const rengA = rengAtomo(rengM, rengN[rengI]!)!
        const rengB = rengAtomo(rengM, rengN[rengJ]!)!
        rengAngulos.push({ etiqueta: `${rengA.el}–${rengC.el}–${rengB.el}`, grados: rengAngulo([rengA.p, rengC.p, rengB.p], 0, 1, 2) })
      }
  }
  return { distancias: rengDistancias, angulos: rengAngulos }
}
