import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RengCruce } from '../nucleo/formulacion'
import { rengMovimientoReducido } from './nivel'

const rengCargaTxt = (rengQ: number): string => `${Math.abs(rengQ) === 1 ? '' : Math.abs(rengQ)}${rengQ > 0 ? '+' : '−'}`

function RengUnidad({ u: rengU }: { u: string }): React.JSX.Element {
  const rengPartes = rengU.split(/(\d+)/).filter(Boolean)
  return (
    <>
      {rengPartes.map((rengP, rengI) => (/^\d+$/.test(rengP) ? <sub key={rengI}>{rengP}</sub> : <span key={rengI}>{rengP}</span>))}
    </>
  )
}

export function RengCruceCargas({ cruce: rengCruce, fase: rengFase }: { cruce: RengCruce; fase: 'iones' | 'cruzar' }): React.JSX.Element {
  const rengContenedor = useRef<HTMLDivElement>(null)
  const rengSupCat = useRef<HTMLElement>(null)
  const rengSupAn = useRef<HTMLElement>(null)
  const rengSubCat = useRef<HTMLElement>(null)
  const rengSubAn = useRef<HTMLElement>(null)
  const [rengSaltos, rengSetSaltos] = useState<Array<{ texto: string; x: number; y: number; dx: number; dy: number }>>([])
  const rengReducido = rengMovimientoReducido()
  const [rengTerminado, rengSetTerminado] = useState(false)
  useEffect(() => {
    rengSetTerminado(false)
    if (rengFase !== 'cruzar') return
    const rengT = window.setTimeout(() => rengSetTerminado(true), rengReducido ? 0 : 1000)
    return () => window.clearTimeout(rengT)
  }, [rengFase, rengCruce, rengReducido])
  const rengPoliAn = /[A-Z].*[A-Z]|\d/.test(rengCruce.anion)
  const rengPoliCat = /[A-Z].*[A-Z]|\d/.test(rengCruce.cation) && rengCruce.cation !== 'Hg2'

  useLayoutEffect(() => {
    if (rengFase !== 'cruzar' || rengReducido) {
      rengSetSaltos([])
      return
    }
    const rengC = rengContenedor.current?.getBoundingClientRect()
    const rengR = (rengE: HTMLElement | null): DOMRect | undefined => rengE?.getBoundingClientRect()
    const rengA = rengR(rengSupCat.current)
    const rengB = rengR(rengSubAn.current)
    const rengD = rengR(rengSupAn.current)
    const rengF = rengR(rengSubCat.current)
    if (!rengC || !rengA || !rengB || !rengD || !rengF) return
    rengSetSaltos([
      { texto: String(Math.abs(rengCruce.cargaCat)), x: rengA.left - rengC.left, y: rengA.top - rengC.top, dx: rengB.left - rengA.left, dy: rengB.top - rengA.top },
      { texto: String(Math.abs(rengCruce.cargaAn)), x: rengD.left - rengC.left, y: rengD.top - rengC.top, dx: rengF.left - rengD.left, dy: rengF.top - rengD.top }
    ])
  }, [rengFase, rengCruce, rengReducido])

  const rengCruzado = rengFase === 'cruzar'
  const rengVerSub = (rengN: number): string => (rengN === 1 ? '' : String(rengN))
  return (
    <div className="cruce" ref={rengContenedor} aria-label={rengCruzado ? 'Las cargas pasan a ser subíndices' : 'Los dos iones con sus cargas'}>
      <span className="cruce-ion">
        {rengPoliCat && rengCruzado && rengCruce.cruzadoCat > 1 && '('}
        <RengUnidad u={rengCruce.cation} />
        {rengPoliCat && rengCruzado && rengCruce.cruzadoCat > 1 && ')'}
        <sub ref={rengSubCat} className={`cruce-sub ${rengCruzado ? 'visible' : ''}`} style={{ animationDelay: rengReducido ? '0ms' : '650ms' }}>
          {rengCruzado ? rengVerSub(rengCruce.cruzadoCat) : ' '}
        </sub>
        {!rengTerminado && (
          <sup ref={rengSupCat} className={`cruce-carga ${rengCruzado ? 'se-va' : ''}`}>
            {rengCargaTxt(rengCruce.cargaCat)}
          </sup>
        )}
      </span>
      <span className="cruce-ion">
        {rengPoliAn && rengCruzado && rengCruce.cruzadoAn > 1 && '('}
        <RengUnidad u={rengCruce.anion} />
        {rengPoliAn && rengCruzado && rengCruce.cruzadoAn > 1 && ')'}
        <sub ref={rengSubAn} className={`cruce-sub ${rengCruzado ? 'visible' : ''}`} style={{ animationDelay: rengReducido ? '0ms' : '650ms' }}>
          {rengCruzado ? rengVerSub(rengCruce.cruzadoAn) : ' '}
        </sub>
        {!rengTerminado && (
          <sup ref={rengSupAn} className={`cruce-carga ${rengCruzado ? 'se-va' : ''}`}>
            {rengCargaTxt(rengCruce.cargaAn)}
          </sup>
        )}
      </span>
      {!rengTerminado && rengSaltos.map((rengS, rengI) => (
        <span
          key={`${rengI}-${rengS.texto}`}
          className="cruce-salto"
          aria-hidden="true"
          style={{ left: rengS.x, top: rengS.y, ['--dx' as string]: `${rengS.dx}px`, ['--dy' as string]: `${rengS.dy}px` } as React.CSSProperties}
        >
          {rengS.texto}
        </span>
      ))}
    </div>
  )
}
