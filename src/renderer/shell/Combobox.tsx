import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import './combobox.css'
import { rengAgrupar, rengBuscar, rengResaltar, type RengEntrada, type RengResultado } from './nucleo/busqueda'

export interface RengOpcionCombobox<RengT> extends RengEntrada<RengT> {
  texto: string
  detalle?: string
}

export interface RengComboboxProps<RengT> {
  etiqueta: string
  etiquetaOculta?: boolean
  opciones: readonly RengOpcionCombobox<RengT>[]
  seleccion: string | null
  onElegir: (rengO: RengOpcionCombobox<RengT>) => void
  placeholder?: string
  iniciales?: readonly RengOpcionCombobox<RengT>[]
  claveRecientes?: string
  sinResultados?: (rengConsulta: string) => ReactNode
  max?: number
  className?: string
  deshabilitado?: boolean
  mostrarDetalle?: boolean
  pie?: ReactNode
  filtrar?: (rengConsulta: string) => RengResultado<RengT>[]
  libre?: { valor: string; onValor: (rengT: string) => void; onIntro?: (rengT: string, rengMods: { mayus: boolean }) => void }
  renderOpcion?: (rengO: RengOpcionCombobox<RengT>, rengConsulta: string) => ReactNode
  idEntrada?: string
  describedBy?: string
}

const rengAlmacen = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}
const rengLeerRecientes = (rengClave: string): string[] => {
  try {
    const rengV: unknown = JSON.parse(rengAlmacen()?.getItem(`ciencia.recientes.${rengClave}`) ?? '[]')
    return Array.isArray(rengV) ? rengV.filter((rengX): rengX is string => typeof rengX === 'string').slice(0, 5) : []
  } catch {
    return []
  }
}
const rengGuardarReciente = (rengClave: string, rengId: string): void => {
  try {
    rengAlmacen()?.setItem(`ciencia.recientes.${rengClave}`, JSON.stringify([rengId, ...rengLeerRecientes(rengClave).filter((rengX) => rengX !== rengId)].slice(0, 5)))
  } catch {
  }
}

export function RengResaltado({ texto: rengTexto, consulta: rengConsulta }: { texto: string; consulta: string }): React.JSX.Element {
  if (!rengConsulta.trim()) return <>{rengTexto}</>
  return (
    <>
      {rengResaltar(rengTexto, rengConsulta).map((rengP, rengI) =>
        rengP.m ? (
          <mark key={rengI} className="cbx-marca">
            {rengP.t}
          </mark>
        ) : (
          <span key={rengI}>{rengP.t}</span>
        )
      )}
    </>
  )
}

export default function RengCombobox<RengT>(rengP: RengComboboxProps<RengT>): React.JSX.Element {
  const rengId = useId()
  const rengLista = `${rengId}-lista`
  const rengIdEntrada = rengP.idEntrada ?? `${rengId}-entrada`
  const [rengAbierto, rengSetAbierto] = useState(false)
  const [rengConsultaPropia, rengSetConsulta] = useState('')
  const rengConsulta = rengP.libre ? rengP.libre.valor : rengConsultaPropia
  const rengLibre = rengP.libre !== undefined
  const [rengActivo, rengSetActivo] = useState(0)
  const [rengNavegado, rengSetNavegado] = useState(false)
  const [rengArriba, rengSetArriba] = useState(false)
  const rengAbrir = (): void => {
    const rengR = rengEntrada.current?.getBoundingClientRect()
    if (rengR) rengSetArriba(window.innerHeight - rengR.bottom < 330 && rengR.top > window.innerHeight - rengR.bottom)
    rengSetAbierto(true)
  }
  const [rengRecientes, rengSetRecientes] = useState<string[]>(() => (rengP.claveRecientes ? rengLeerRecientes(rengP.claveRecientes) : []))
  const rengEntrada = useRef<HTMLInputElement>(null)
  const rengElegida = rengP.opciones.find((rengO) => rengO.id === rengP.seleccion) ?? null

  const rengGrupos = useMemo((): Array<{ grupo: string; resultados: RengResultado<RengT>[] }> => {
    if (rengConsulta.trim()) return rengAgrupar(rengP.filtrar ? rengP.filtrar(rengConsulta) : rengBuscar(rengP.opciones, rengConsulta, rengP.max ?? 40))
    if (rengLibre && !rengP.iniciales) return []
    const rengBase = (rengP.iniciales ?? rengP.opciones).map((rengEntrada, rengIndice) => ({ entrada: rengEntrada, puntos: 1, indice: rengIndice }))
    const rengRec = rengRecientes
      .map((rengR) => rengP.opciones.find((rengO) => rengO.id === rengR))
      .filter((rengO): rengO is RengOpcionCombobox<RengT> => !!rengO)
      .map((rengEntrada, rengIndice) => ({ entrada: { ...rengEntrada, grupo: 'Recientes' }, puntos: 1, indice: rengIndice }))
    return [...(rengRec.length ? [{ grupo: 'Recientes', resultados: rengRec }] : []), ...rengAgrupar(rengBase)]
  }, [rengConsulta, rengP.opciones, rengP.iniciales, rengP.max, rengRecientes, rengP.filtrar, rengLibre])
  const rengPlanos = rengGrupos.flatMap((rengG) => rengG.resultados)
  const rengN = rengPlanos.length

  useEffect(() => {
    rengSetActivo(0)
    rengSetNavegado(false)
  }, [rengConsulta])
  const rengVerLista = rengAbierto && (rengN > 0 || !rengLibre || (rengConsulta.trim() !== '' && rengP.sinResultados !== undefined))
  useEffect(() => {
    if (!rengAbierto) return
    document.getElementById(`${rengId}-op-${rengActivo}`)?.scrollIntoView({ block: 'nearest' })
  }, [rengActivo, rengAbierto, rengId])

  const rengElegir = (rengO: RengEntrada<RengT>): void => {
    const rengOp = rengP.opciones.find((rengX) => rengX.id === rengO.id)
    if (!rengOp) return
    rengP.onElegir(rengOp)
    if (rengP.claveRecientes) {
      rengGuardarReciente(rengP.claveRecientes, rengOp.id)
      rengSetRecientes(rengLeerRecientes(rengP.claveRecientes))
    }
    rengSetAbierto(false)
    rengSetConsulta('')
  }

  const rengTecla = (rengE: React.KeyboardEvent<HTMLInputElement>): void => {
    if (rengE.key === 'ArrowDown') {
      rengE.preventDefault()
      if (!rengAbierto) rengAbrir()
      else {
        rengSetActivo((rengA) => (rengN ? (rengLibre && !rengNavegado ? rengA : (rengA + 1) % rengN) : 0))
        rengSetNavegado(true)
      }
    } else if (rengE.key === 'ArrowUp') {
      rengE.preventDefault()
      if (!rengAbierto) rengAbrir()
      else {
        rengSetActivo((rengA) => (rengN ? (rengA - 1 + rengN) % rengN : 0))
        rengSetNavegado(true)
      }
    } else if (rengE.key === 'Enter') {
      const rengR = rengPlanos[rengActivo]
      if (rengAbierto && rengR && (!rengLibre || rengNavegado)) {
        rengE.preventDefault()
        rengElegir(rengR.entrada)
      } else if (rengP.libre) {
        rengSetAbierto(false)
        rengP.libre.onIntro?.(rengP.libre.valor, { mayus: rengE.shiftKey })
      }
    } else if (rengE.key === 'Tab') {
      const rengR = rengPlanos[rengActivo]
      if (rengAbierto && rengR && rengConsulta.trim() && (!rengLibre || rengNavegado)) rengElegir(rengR.entrada)
      else rengSetAbierto(false)
    } else if (rengE.key === 'Escape') {
      if (rengAbierto) {
        rengE.preventDefault()
        rengE.stopPropagation()
      }
      rengSetAbierto(false)
      if (!rengLibre) rengSetConsulta('')
    }
  }

  let rengK = -1
  return (
    <div className={`cbx ${rengP.className ?? ''}`}>
      <label htmlFor={rengIdEntrada} className={rengP.etiquetaOculta ? 'sr-only' : 'label'}>
        {rengP.etiqueta}
      </label>
      <input
        id={rengIdEntrada}
        ref={rengEntrada}
        className="input cbx-entrada"
        role="combobox"
        aria-expanded={rengVerLista}
        aria-controls={rengLista}
        aria-autocomplete="list"
        aria-activedescendant={rengVerLista && rengN ? `${rengId}-op-${rengActivo}` : undefined}
        aria-describedby={rengP.describedBy}
        disabled={rengP.deshabilitado}
        value={rengP.libre ? rengP.libre.valor : rengAbierto ? rengConsulta : (rengElegida?.texto ?? '')}
        placeholder={rengP.libre ? rengP.placeholder : rengAbierto ? (rengElegida?.texto ?? rengP.placeholder) : rengP.placeholder}
        onChange={(rengE) => {
          if (rengP.libre) rengP.libre.onValor(rengE.target.value)
          else rengSetConsulta(rengE.target.value)
          rengAbrir()
        }}
        onFocus={rengAbrir}
        onClick={rengAbrir}
        onBlur={() => {
          rengSetAbierto(false)
          if (!rengLibre) rengSetConsulta('')
        }}
        onKeyDown={rengTecla}
        spellCheck={false}
        autoComplete="off"
      />
      {rengElegida?.detalle && !rengAbierto && rengP.mostrarDetalle !== false && <span className="cbx-detalle-elegida faint sm">{rengElegida.detalle}</span>}
      <span className="sr-only" aria-live="polite">
        {rengVerLista ? (rengN === 1 ? '1 resultado' : `${rengN} resultados`) : ''}
      </span>
      {rengVerLista && (
        <div className={`cbx-lista${rengArriba ? ' arriba' : ''}`} id={rengLista} role="listbox" aria-label={rengP.etiqueta}>
          {rengN === 0 && <div className="cbx-vacio sm">{rengP.sinResultados ? rengP.sinResultados(rengConsulta) : `Sin resultados para «${rengConsulta}».`}</div>}
          {rengGrupos.map((rengG, rengGi) => (
            <div key={rengG.grupo} role="group" aria-labelledby={`${rengId}-g-${rengGi}`}>
              {rengG.grupo && (
                <div className="cbx-grupo" id={`${rengId}-g-${rengGi}`} role="presentation">
                  {rengG.grupo}
                </div>
              )}
              {rengG.resultados.map((rengR) => {
                rengK++
                const rengI = rengK
                const rengO = rengP.opciones.find((rengX) => rengX.id === rengR.entrada.id)
                return (
                  <div
                    key={`${rengG.grupo}-${rengR.entrada.id}`}
                    id={`${rengId}-op-${rengI}`}
                    role="option"
                    aria-selected={rengI === rengActivo}
                    className={`cbx-op${rengI === rengActivo ? ' activa' : ''}${rengR.entrada.id === rengP.seleccion ? ' elegida' : ''}`}
                    onMouseDown={(rengE) => rengE.preventDefault()}
                    onPointerEnter={() => rengSetActivo(rengI)}
                    onClick={() => rengElegir(rengR.entrada)}
                  >
                    {rengO && rengP.renderOpcion ? (
                      rengP.renderOpcion(rengO, rengConsulta)
                    ) : (
                      <>
                        <span className="cbx-texto">
                          <RengResaltado texto={rengO?.texto ?? rengR.entrada.id} consulta={rengConsulta} />
                        </span>
                        {rengO?.detalle && (
                          <span className="cbx-sec">
                            <RengResaltado texto={rengO.detalle} consulta={rengConsulta} />
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
          {rengP.pie}
        </div>
      )}
    </div>
  )
}
