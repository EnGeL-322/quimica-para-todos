import { Fragment, useMemo } from 'react'
import { rengAnalizarEspecie, rengAnalizarNotacion, RENG_NOMBRE_ESTADO, rengTextoEspecie, rengTextoPlano, type RengEspecieNotada, type RengFlecha, type RengNotacion } from '../nucleo/notacion'
import { rengEstiloCpk } from './nivel'

export interface RengPropsResaltado {
  resaltado?: string | null
  onElemento?: (rengSimbolo: string | null) => void
}

export function RengEspecieVista({ e: rengE, resaltado: rengResaltado, onElemento: rengOnElemento, coef: rengCoef }: RengPropsResaltado & { e: RengEspecieNotada; coef?: string | null }): React.JSX.Element {
  return (
    <span aria-hidden="true">
      {rengCoef && <span className="f-coef">{rengCoef}</span>}
      {rengE.piezas.map((rengP, rengI) => {
        switch (rengP.t) {
          case 'elemento':
            return (
              <span
                key={rengI}
                className={`f-el ${rengResaltado === rengP.v ? 'resaltado' : ''}`}
                style={rengEstiloCpk(rengP.v)}
                onMouseEnter={rengOnElemento ? () => rengOnElemento(rengP.v) : undefined}
                onMouseLeave={rengOnElemento ? () => rengOnElemento(null) : undefined}
              >
                {rengP.v}
              </span>
            )
          case 'sub':
            return <sub key={rengI}>{rengP.v}</sub>
          case 'sup':
            return <sup key={rengI}>{rengP.v}</sup>
          case 'electron':
            return (
              <span key={rengI} className="f-el" style={rengEstiloCpk('')}>
                e
              </span>
            )
          default:
            return <span key={rengI}>{rengP.v}</span>
        }
      })}
      {rengE.estado && (
        <span className="f-estado" title={RENG_NOMBRE_ESTADO[rengE.estado]}>
          ({rengE.estado})
        </span>
      )}
    </span>
  )
}

export function RengFlechaVista({ f: rengF }: { f: RengFlecha }): React.JSX.Element {
  return (
    <span className="f-flecha" aria-hidden="true">
      <span className="f-flecha-cond">{rengF.arriba ?? ' '}</span>
      <span className="f-flecha-signo">{rengF.tipo === 'equilibrio' ? '⇌' : '⟶'}</span>
      <span className="f-flecha-cond">{rengF.abajo ?? ' '}</span>
    </span>
  )
}

interface RengPropsFormula extends RengPropsResaltado {
  texto?: string
  notacion?: RengNotacion
  tamano?: 'normal' | 'media' | 'grande'
  onEspecie?: (rengE: RengEspecieNotada, rengLado: 'izquierda' | 'derecha', rengIndice: number) => void
  coeficientes?: { izquierda: Array<string | null>; derecha: Array<string | null> }
  activa?: string | null
}

export function RengFormula({ texto: rengTexto, notacion: rengNotacion, tamano: rengTamano = 'normal', resaltado: rengResaltado, onElemento: rengOnElemento, onEspecie: rengOnEspecie, coeficientes: rengCoeficientes, activa: rengActiva }: RengPropsFormula): React.JSX.Element {
  const rengR = useMemo((): { n: RengNotacion } | { error: string } => {
    if (rengNotacion) return { n: rengNotacion }
    try {
      return { n: rengAnalizarNotacion(rengTexto ?? '') }
    } catch (rengE) {
      return { error: rengE instanceof Error ? rengE.message : String(rengE) }
    }
  }, [rengTexto, rengNotacion])

  if ('error' in rengR) {
    return (
      <span className={`formula ${rengTamano} f-error`} title={rengR.error}>
        {rengTexto}
      </span>
    )
  }
  const rengN = rengR.n
  const rengLado = (rengEsp: RengEspecieNotada[], rengNombre: 'izquierda' | 'derecha'): React.JSX.Element[] =>
    rengEsp.map((rengE, rengI) => {
      const rengCoef = rengCoeficientes ? (rengCoeficientes[rengNombre][rengI] ?? null) : rengE.coef
      const rengCuerpo = <RengEspecieVista e={rengE} coef={rengCoef} resaltado={rengResaltado} onElemento={rengOnElemento} />
      return (
        <Fragment key={`${rengNombre}-${rengI}`}>
          {rengI > 0 && (
            <span className="f-mas" aria-hidden="true">
              +
            </span>
          )}
          {rengOnEspecie ? (
            <button
              type="button"
              className={`f-especie ${rengActiva === rengE.formula ? 'activa' : ''}`}
              onClick={() => rengOnEspecie(rengE, rengNombre, rengI)}
              aria-label={`Ver ${rengTextoEspecie({ ...rengE, coef: rengCoef })} en 3D`}
            >
              {rengCuerpo}
            </button>
          ) : (
            rengCuerpo
          )}
        </Fragment>
      )
    })
  return (
    <span className={`formula ${rengTamano}`}>
      <span className="sr-only">{rengTextoPlano(rengN)}</span>
      {rengLado(rengN.izquierda, 'izquierda')}
      {rengN.flecha && <RengFlechaVista f={rengN.flecha} />}
      {rengLado(rengN.derecha, 'derecha')}
    </span>
  )
}

export function RengFormulaSimple({ texto: rengTexto, ...rengResto }: RengPropsResaltado & { texto: string; tamano?: RengPropsFormula['tamano'] }): React.JSX.Element {
  const rengN = useMemo((): RengNotacion | null => {
    try {
      return { izquierda: [rengAnalizarEspecie(rengTexto)], derecha: [], flecha: null }
    } catch {
      return null
    }
  }, [rengTexto])
  return rengN ? <RengFormula notacion={rengN} {...rengResto} /> : <RengFormula texto={rengTexto} {...rengResto} />
}
