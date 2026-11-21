import { useMemo } from 'react'
import { rengDerivarActivo, rengExplicarIncompleto } from '../estado/derivados'
import { RENG_NOMBRE_TIPO } from '../nucleo/sustancia'
import { RengCompletarValencias } from './CompletarValencias'
import { RengFormulaSimple } from './Formula'
import { RengEtiqueta } from './ui'
import { useRengAlmacen, useRengTrabajo } from './useTrabajo'

export function RengTarjetaConstruyendo({ onVerPasoAPaso: rengOnVerPasoAPaso, onVer3D: rengOnVer3D }: { onVerPasoAPaso?: () => void; onVer3D?: () => void }): React.JSX.Element | null {
  const rengEstado = useRengTrabajo((rengE) => rengE)
  const rengT = useRengAlmacen()
  const rengD = useMemo(() => rengDerivarActivo(rengEstado), [rengEstado])
  if (!rengD) return null
  const rengFalta = rengExplicarIncompleto(rengD)
  const rengTipo = rengD.sustancia ? RENG_NOMBRE_TIPO[rengD.sustancia.tipo].toLowerCase() : null
  return (
    <aside className="mesa-tarjeta ui-tarjeta acento" aria-label="Lo que estás construyendo">
      <span className="sm muted">Estás construyendo</span>
      <div className="row" style={{ gap: 8 }}>
        <RengFormulaSimple texto={rengD.formula} tamano="media" />
        {rengD.completa && rengD.nombre && <b>{rengD.nombre}</b>}
        {rengD.completa && rengTipo && <RengEtiqueta tono="ok">{rengTipo}</RengEtiqueta>}
      </div>
      {!rengD.completa && <p className="sm">{rengFalta ?? rengD.estado}</p>}
      {rengD.completa && rengD.existencia && <p className="sm muted">{rengD.existencia}</p>}
      <div className="row" style={{ gap: 6 }}>
        {!rengD.completa && !rengD.ionico && <RengCompletarValencias ids={rengD.ids} />}
        {rengOnVer3D && rengD.completa && (
          <button className="btn sm" onClick={rengOnVer3D} title="Modelo 3D de bolas y varillas, con la ficha de cada átomo">
            Ver en 3D
          </button>
        )}
        {rengD.enlaces.length > 0 && rengOnVerPasoAPaso && (
          <button className="btn sm primary" onClick={() => rengOnVerPasoAPaso()} title="Abre Enlaces con el paso a paso del enlace elegido">
            Ver cómo se forma el enlace
          </button>
        )}
        <button className="btn ghost sm" onClick={() => rengT.deshacer()} disabled={!rengT.puedeDeshacer()} aria-label="Deshacer">
          ↶ Deshacer
        </button>
      </div>
    </aside>
  )
}
