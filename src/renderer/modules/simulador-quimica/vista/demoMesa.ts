import * as THREE from 'three'
import type { RengItemArrastre } from './arrastre'

export interface RengPasoDemo {
  el: string
  a: [number, number, number]
}

export const RENG_DEMOS: Record<'agua' | 'sal' | 'metano', { titulo: string; pasos: RengPasoDemo[] }> = {
  agua: { titulo: 'Formar agua', pasos: [{ el: 'O', a: [0, 0, 0] }, { el: 'H', a: [0.95, 0.5, 0] }, { el: 'H', a: [-0.95, 0.5, 0] }] },
  sal: { titulo: 'Formar sal', pasos: [{ el: 'Na', a: [-1.3, 0, 0] }, { el: 'Cl', a: [1.3, 0, 0] }] },
  metano: {
    titulo: 'Formar metano',
    pasos: [
      { el: 'C', a: [0, 0, 0] },
      { el: 'H', a: [1.05, 0.1, 0] },
      { el: 'H', a: [-0.4, 1.0, 0] },
      { el: 'H', a: [-0.45, -0.55, 0.9] },
      { el: 'H', a: [-0.45, -0.55, -0.9] }
    ]
  }
}

export interface RengContextoDemo {
  inicio: () => THREE.Vector3
  entrar: (rengItem: RengItemArrastre, rengP: THREE.Vector3) => boolean
  mover: (rengP: THREE.Vector3) => void
  soltar: () => void
  cursor: (rengP: THREE.Vector3 | null) => void
  reducido: boolean
  cancelada: () => boolean
}

const rengEsperar = (rengMs: number): Promise<void> => new Promise((rengR) => window.setTimeout(rengR, rengMs))

export async function rengEjecutarDemo(rengPasos: readonly RengPasoDemo[], rengC: RengContextoDemo): Promise<void> {
  for (const rengPaso of rengPasos) {
    if (rengC.cancelada()) break
    const rengDesde = rengC.inicio()
    const rengHasta = new THREE.Vector3(...rengPaso.a)
    if (!rengC.entrar({ tipo: 'elemento', el: rengPaso.el }, rengDesde)) break
    const rengDur = rengC.reducido ? 0 : 700
    const rengT0 = performance.now()
    for (;;) {
      if (rengC.cancelada()) break
      const rengU = rengDur === 0 ? 1 : Math.min(1, (performance.now() - rengT0) / rengDur)
      const rengS = rengU * rengU * (3 - 2 * rengU)
      const rengP = rengDesde.clone().lerp(rengHasta, rengS)
      rengC.mover(rengP)
      rengC.cursor(rengP)
      if (rengU >= 1) break
      await new Promise((rengR) => requestAnimationFrame(rengR))
    }
    rengC.soltar()
    rengC.cursor(null)
    await rengEsperar(rengC.reducido ? 50 : 750)
  }
  rengC.cursor(null)
}
