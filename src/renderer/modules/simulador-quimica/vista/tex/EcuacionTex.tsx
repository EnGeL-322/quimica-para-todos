import { useLayoutEffect, useRef, useState } from 'react'
import { rengTexDeFormulaQuimica } from '@/lib/ecuaciones/formula'
import './ecuacion-tex.css'

export type RengEstadoEcuacionTex = 'cargando' | 'mathml' | 'reserva' | 'texto'

export interface RengEcuacionTexProps {
  tex: string
  texto: string
  bloque?: boolean
  modoTexto?: boolean
  numero?: string
  id?: string
}

export function RengEcuacionTex({ tex: rengTex, texto: rengTexto, bloque: rengBloque = false, modoTexto: rengModoTexto = false, numero: rengNumero, id: rengId }: RengEcuacionTexProps): React.JSX.Element {
  const rengNodo = useRef<HTMLSpanElement>(null)
  const rengCaja = useRef<HTMLElement>(null)
  const [rengEstado, rengSetEstado] = useState<RengEstadoEcuacionTex>(rengModoTexto ? 'texto' : 'cargando')
  const [rengDesborda, rengSetDesborda] = useState(false)

  useLayoutEffect(() => {
    const rengN = rengNodo.current
    if (!rengN) return
    rengN.replaceChildren()
    if (rengModoTexto) {
      rengSetEstado('texto')
      return
    }
    if (rengTex.trim() === '') {
      rengSetEstado('reserva')
      return
    }
    rengSetEstado('cargando')
    let rengVigente = true
    import('@/lib/ecuaciones/dibujar')
      .then((rengM) => {
        if (!rengVigente || !rengNodo.current) return
        rengSetEstado(rengM.rengDibujarTex(rengTex, rengNodo.current, rengBloque))
      })
      .catch(() => {
        if (rengVigente) rengSetEstado('reserva')
      })
    return () => {
      rengVigente = false
    }
  }, [rengTex, rengBloque, rengModoTexto])

  useLayoutEffect(() => {
    const rengC = rengCaja.current
    if (!rengC || !rengBloque) return
    const rengMedir = (): void => rengSetDesborda(rengC.scrollWidth > rengC.clientWidth + 1)
    rengMedir()
    const rengObs = new ResizeObserver(rengMedir)
    rengObs.observe(rengC)
    return () => rengObs.disconnect()
  }, [rengBloque, rengEstado])

  const rengVisibleTexto = rengEstado !== 'mathml'
  const rengLegible = rengTexto.trim() === '' ? rengTex : rengTexto
  const rengContenido = (
    <>
      <span ref={rengNodo} className="q-ec-math" hidden={rengVisibleTexto} />
      <span className={rengVisibleTexto ? 'q-ec-texto' : 'sr-only'} data-ecuacion-texto>
        {rengLegible}
      </span>
      {rengNumero && (
        <span className="q-ec-numero" aria-label={`ecuación ${rengNumero}`}>
          ({rengNumero})
        </span>
      )}
    </>
  )

  if (rengBloque) {
    return (
      <div
        ref={rengCaja as React.RefObject<HTMLDivElement>}
        id={rengId}
        className="q-ec q-ec--bloque"
        data-ecuacion={rengEstado}
        tabIndex={rengDesborda ? 0 : undefined}
        role={rengDesborda ? 'group' : undefined}
        aria-label={rengDesborda ? `Ecuación larga, se desplaza horizontalmente: ${rengLegible}` : undefined}
      >
        {rengContenido}
      </div>
    )
  }
  return (
    <span ref={rengCaja as React.RefObject<HTMLSpanElement>} id={rengId} className="q-ec" data-ecuacion={rengEstado}>
      {rengContenido}
    </span>
  )
}

export interface RengFormulaQuimicaProps {
  formula: string
  texto: string
  bloque?: boolean
  modoTexto?: boolean
  numero?: string
}

export function RengFormulaQuimica({ formula: rengFormula, texto: rengTexto, bloque: rengBloque, modoTexto: rengModoTexto, numero: rengNumero }: RengFormulaQuimicaProps): React.JSX.Element {
  return <RengEcuacionTex tex={rengTexDeFormulaQuimica(rengFormula) ?? ''} texto={rengTexto} bloque={rengBloque} modoTexto={rengModoTexto} numero={rengNumero} />
}
