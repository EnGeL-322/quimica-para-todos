import { useEffect, useMemo, useRef, useState } from 'react'
import { rengCambiarCarga, rengCambiarSubindice, rengFormulaConCarga, rengReemplazarActivo, rengTextoCarga, type RengResultado } from '../estado/acciones'
import { rengAgruparFaltan } from '../estado/agrupar'
import type { RengDerivadoFragmento } from '../estado/derivados'
import { rengAplicable } from '../estado/formulacionActiva'
import { rengAtomo } from '../nucleo/mesa'
import { rengInterpretarSustancia } from '../nucleo/sustancia'
import { RengFormulaSimple } from './Formula'
import { useRengMuestra } from './nivel'
import { RengAviso } from './ui'
import { useRengAlmacen, useRengTrabajo } from './useTrabajo'

const rengSigno = (rengN: number): string => (rengN > 0 ? `+${rengN}` : rengN < 0 ? `−${-rengN}` : '0')

function RengCampoEditable({ etiqueta: rengEtiqueta, valor: rengValor, aplicar: rengAplicar, id: rengId, completa: rengCompleta }: { etiqueta: string; valor: string; aplicar: (rengT: string) => void; id: string; completa: boolean }): React.JSX.Element {
  const [rengTexto, rengSetTexto] = useState(rengValor)
  const [rengEditando, rengSetEditando] = useState(false)
  const rengPorIntro = useRef(false)
  useEffect(() => {
    if (!rengEditando) rengSetTexto(rengValor)
  }, [rengValor, rengEditando])
  const rengPuede = rengAplicable(rengTexto, rengValor, rengCompleta)
  const rengR = useMemo(() => (rengPuede ? rengInterpretarSustancia(rengTexto) : null), [rengTexto, rengPuede])
  const rengInformativo = !!rengR && rengR.tipo === 'error' && /no está en la lista de la app/.test(rengR.motivo)
  const rengIntro = rengTexto === rengValor ? 'Intro para sustituir la estructura incompleta de la mesa' : 'Intro para aplicar'
  const rengEstado = !rengR ? '' : rengR.tipo === 'ok' ? `→ ${rengR.sustancia.nombre} (${rengIntro})` : rengR.tipo === 'isomeros' ? 'Varias estructuras posibles: pulsa Intro para elegir.' : rengR.motivo
  const rengFin = (rengIntro: boolean): void => {
    rengSetEditando(false)
    if (rengPuede && (rengIntro || rengTexto !== rengValor)) rengAplicar(rengTexto)
  }
  return (
    <div className="field editor-campo">
      <label htmlFor={rengId}>{rengEtiqueta}</label>
      <input
        id={rengId}
        className={`input ${rengR && rengR.tipo === 'error' && !rengInformativo ? 'invalido' : ''}`}
        value={rengTexto}
        spellCheck={false}
        aria-describedby={`${rengId}-estado`}
        aria-invalid={!!rengR && rengR.tipo === 'error'}
        onFocus={() => rengSetEditando(true)}
        onChange={(rengE) => rengSetTexto(rengE.target.value)}
        onBlur={() => {
          rengFin(rengPorIntro.current)
          rengPorIntro.current = false
        }}
        onKeyDown={(rengE) => {
          if (rengE.key === 'Enter') {
            rengPorIntro.current = true
            ;(rengE.target as HTMLInputElement).blur()
          }
          if (rengE.key === 'Escape') {
            rengSetTexto(rengValor)
            rengSetEditando(false)
          }
        }}
      />
      <span id={`${rengId}-estado`} className={`sm ${rengR && rengR.tipo === 'error' ? (rengInformativo ? 'muted' : 'err-texto') : 'faint'}`} role="status">
        {rengEstado}
      </span>
      {rengR && rengR.tipo === 'error' && rengR.sugerencias.length > 0 && (
        <span className="row" style={{ gap: 6 }}>
          <span className="sm">Elige:</span>
          {rengR.sugerencias.map((rengX) => (
            <button key={rengX} className="btn sm" onMouseDown={(rengEv) => rengEv.preventDefault()} onClick={() => rengAplicar(rengX)}>
              <RengFormulaSimple texto={rengX} />
            </button>
          ))}
        </span>
      )}
    </div>
  )
}

export function RengEditorFormula({ d: rengD }: { d: RengDerivadoFragmento }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const rengT = useRengAlmacen()
  const rengMesa = useRengTrabajo((rengE) => rengE.mesa)
  const [rengAviso, rengSetAviso] = useState<{ texto: string; err: boolean } | null>(null)
  const [rengIsomeros, rengSetIsomeros] = useState<{ texto: string; opciones: Array<{ nombre: string }>; nota: string } | null>(null)

  const rengEjecutar = (rengR: RengResultado, rengTexto?: string): void => {
    if (rengR.ok) {
      rengT.aplicar(() => rengR.estado)
      rengSetIsomeros(null)
      rengSetAviso(rengR.nota ? { texto: rengR.nota, err: false } : null)
    } else if ('isomeros' in rengR) rengSetIsomeros({ texto: rengTexto ?? '', opciones: rengR.isomeros, nota: rengR.nota })
    else rengSetAviso({ texto: rengR.error, err: true })
  }
  const rengCuenta = useMemo(() => {
    const rengM = new Map<string, number>()
    for (const rengId of rengD.ids) {
      const rengEl = rengAtomo(rengMesa, rengId)?.el
      if (rengEl) rengM.set(rengEl, (rengM.get(rengEl) ?? 0) + 1)
    }
    const rengOrden = [...rengD.formula.matchAll(/[A-Z][a-z]?/g)].map((rengX) => rengX[0])
    return [...rengM.entries()].sort(([rengA], [rengB]) => rengOrden.indexOf(rengA) - rengOrden.indexOf(rengB))
  }, [rengD, rengMesa])
  const rengOxidacion = useMemo(() => {
    const rengM = new Map<string, Set<number>>()
    for (const rengX of rengD.oxidacion) rengM.set(rengX.el, new Set([...(rengM.get(rengX.el) ?? []), rengX.ox]))
    return [...rengM.entries()].map(([rengEl, rengV]) => `${rengEl} ${[...rengV].map(rengSigno).join(' / ')}`).join(' · ')
  }, [rengD])

  const rengNombreCampo = useMemo(() => {
    if (rengD.completa) return rengD.nombre ?? ''
    const rengR = rengInterpretarSustancia(rengFormulaConCarga(rengD.formula, rengD.cargaNeta))
    return rengR.tipo === 'ok' && rengR.sustancia.existe?.estado === 'confirmado' ? rengR.sustancia.nombre : ''
  }, [rengD])
  return (
    <div className="editor-formula stack" style={{ gap: 10 }}>
      <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
        <RengCampoEditable id="form-formula" etiqueta="Fórmula" completa={rengD.completa} valor={rengFormulaConCarga(rengD.formula, rengD.cargaNeta)} aplicar={(rengX) => rengEjecutar(rengReemplazarActivo(rengT.obtener(), rengX), rengX)} />
        <RengCampoEditable id="form-nombre" etiqueta="Nombre (o SMILES)" completa valor={rengNombreCampo} aplicar={(rengX) => rengEjecutar(rengReemplazarActivo(rengT.obtener(), rengX), rengX)} />
      </div>
      {rengIsomeros && (
        <div className="notice warn" role="status">
          <div>{rengIsomeros.nota}</div>
          <div className="row" style={{ marginTop: 6, gap: 6 }}>
            {rengIsomeros.opciones.map((rengO) => (
              <button key={rengO.nombre} className="btn sm" onClick={() => rengEjecutar(rengReemplazarActivo(rengT.obtener(), rengIsomeros.texto, rengO.nombre))}>
                {rengO.nombre}
              </button>
            ))}
          </div>
        </div>
      )}
      {rengAviso && <RengAviso tipo={rengAviso.err ? 'error' : 'info'}>{rengAviso.texto}</RengAviso>}
      {rengMuestra('formulacion.subindices') && (
      <div className="row editor-subindices" role="group" aria-label="Subíndices y carga">
        {rengCuenta.map(([rengEl, rengN]) => (
          <span key={rengEl} className="subindice">
            <button className="btn ghost sm" aria-label={`Quitar un ${rengEl}`} onClick={() => rengEjecutar(rengCambiarSubindice(rengT.obtener(), rengEl, -1))}>
              −
            </button>
            <RengFormulaSimple texto={`${rengEl}${rengN > 1 ? rengN : ''}`} />
            <button className="btn ghost sm" aria-label={`Añadir un ${rengEl}`} onClick={() => rengEjecutar(rengCambiarSubindice(rengT.obtener(), rengEl, 1))}>
              +
            </button>
          </span>
        ))}
        <span className="subindice">
          <button className="btn ghost sm" aria-label="Carga −1" onClick={() => rengEjecutar(rengCambiarCarga(rengT.obtener(), -1))}>
            −
          </button>
          <span className="sm">carga {rengD.cargaNeta === 0 ? '0' : rengTextoCarga(rengD.cargaNeta)}</span>
          <button className="btn ghost sm" aria-label="Carga +1" onClick={() => rengEjecutar(rengCambiarCarga(rengT.obtener(), 1))}>
            +
          </button>
        </span>
      </div>
      )}
      <dl className="datos">
        {rengMuestra('formulacion.datosAvanzados') && (
          <>
            <dt>Números de oxidación</dt>
            <dd>
              {rengOxidacion}
              {rengD.oxidacionOrigen !== 'enlaces' && (
                <span className="sm faint">
                  {' '}
                  ({rengD.oxidacionOrigen === 'formula' ? 'por la fórmula: la estructura aún está incompleta' : 'provisional: la estructura está incompleta y las reglas no bastan'})
                </span>
              )}
            </dd>
          </>
        )}
        <dt>Valencia</dt>
        <dd>{rengD.faltan.length ? rengAgruparFaltan(rengD.faltan) : 'completa'}</dd>
        {rengD.existencia && (
          <>
            <dt>Existencia</dt>
            <dd>{rengD.existencia}</dd>
          </>
        )}
      </dl>
    </div>
  )
}
