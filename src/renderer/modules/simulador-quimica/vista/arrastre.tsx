import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

export type RengItemArrastre = { tipo: 'elemento'; el: string } | { tipo: 'sustancia'; nombre: string; entrada: string }

export interface RengDestinoArrastre {
  contiene: (rengX: number, rengY: number) => boolean
  mover: (rengItem: RengItemArrastre, rengX: number, rengY: number) => void
  soltar: (rengItem: RengItemArrastre, rengX: number, rengY: number) => void
  salir: () => void
}

interface RengCtx {
  iniciar: (rengItem: RengItemArrastre, rengEv: React.PointerEvent, rengAlHacerClic?: () => void) => void
  registrar: (rengD: RengDestinoArrastre | null) => void
}

const RengArrastreCtx = createContext<RengCtx>({ iniciar: () => undefined, registrar: () => undefined })
export const useRengArrastre = (): RengCtx => useContext(RengArrastreCtx)

const rengEtiquetaItem = (rengI: RengItemArrastre): string => (rengI.tipo === 'elemento' ? rengI.el : rengI.nombre)

export function RengProveedorArrastre({ children: rengChildren }: { children: ReactNode }): React.JSX.Element {
  const rengDestino = useRef<RengDestinoArrastre | null>(null)
  const [rengFantasma, rengSetFantasma] = useState<{ item: RengItemArrastre; x: number; y: number; sobre: boolean } | null>(null)
  const rengLimpiar = useRef<(() => void) | null>(null)
  useEffect(() => () => rengLimpiar.current?.(), [])

  const rengIniciar = useCallback((rengItem: RengItemArrastre, rengEv: React.PointerEvent, rengAlHacerClic?: () => void): void => {
    if (rengEv.button !== 0) return
    const rengX0 = rengEv.clientX
    const rengY0 = rengEv.clientY
    let rengActivo = false
    let rengSobre = false
    const rengMover = (rengE: PointerEvent): void => {
      if (!rengActivo && Math.hypot(rengE.clientX - rengX0, rengE.clientY - rengY0) < 4) return
      rengActivo = true
      rengE.preventDefault()
      const rengD = rengDestino.current
      const rengAhora = !!rengD?.contiene(rengE.clientX, rengE.clientY)
      if (rengSobre && !rengAhora) rengD?.salir()
      rengSobre = rengAhora
      if (rengAhora) rengD!.mover(rengItem, rengE.clientX, rengE.clientY)
      rengSetFantasma({ item: rengItem, x: rengE.clientX, y: rengE.clientY, sobre: rengAhora })
    }
    const rengFin = (rengE: PointerEvent): void => {
      rengQuitar()
      rengSetFantasma(null)
      if (!rengActivo) {
        rengAlHacerClic?.()
        return
      }
      const rengD = rengDestino.current
      if (rengD?.contiene(rengE.clientX, rengE.clientY)) rengD.soltar(rengItem, rengE.clientX, rengE.clientY)
      else if (rengSobre) rengD?.salir()
    }
    const rengCancelar = (): void => {
      rengQuitar()
      rengSetFantasma(null)
      if (rengSobre) rengDestino.current?.salir()
    }
    const rengQuitar = (): void => {
      window.removeEventListener('pointermove', rengMover)
      window.removeEventListener('pointerup', rengFin)
      window.removeEventListener('pointercancel', rengCancelar)
      rengLimpiar.current = null
    }
    rengLimpiar.current?.()
    window.addEventListener('pointermove', rengMover)
    window.addEventListener('pointerup', rengFin)
    window.addEventListener('pointercancel', rengCancelar)
    rengLimpiar.current = rengQuitar
  }, [])

  const rengRegistrar = useCallback((rengD: RengDestinoArrastre | null): void => {
    rengDestino.current = rengD
  }, [])

  return (
    <RengArrastreCtx.Provider value={{ iniciar: rengIniciar, registrar: rengRegistrar }}>
      {rengChildren}
      {rengFantasma && !rengFantasma.sobre && (
        <div className="arrastre-fantasma" style={{ left: rengFantasma.x, top: rengFantasma.y }} aria-hidden="true">
          {rengEtiquetaItem(rengFantasma.item)}
        </div>
      )}
    </RengArrastreCtx.Provider>
  )
}
