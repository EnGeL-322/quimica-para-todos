import { useEffect, useState } from 'react'
import { rengBorrarDeHistorial, rengGuardarHistorial, rengPrepararDeshacer, rengPuedeDeshacer, type RengDeshacible, type RengEntradaHistorial } from '../nucleo/historial'
import { RengVerMas } from './PanelExplicacion'

const rengAlmacen = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

interface RengProps {
  lista: RengEntradaHistorial[]
  onLista: (rengL: RengEntradaHistorial[]) => void
  onAbrir: (rengE: RengEntradaHistorial) => void
}

export function RengHistorialPanel({ lista: rengLista, onLista: rengOnLista, onAbrir: rengOnAbrir }: RengProps): React.JSX.Element | null {
  const [rengDeshacer, rengSetDeshacer] = useState<RengDeshacible | null>(null)
  useEffect(() => {
    if (!rengDeshacer) return
    const rengT = window.setTimeout(() => rengSetDeshacer(null), Math.max(0, rengDeshacer.hasta - Date.now()))
    return () => window.clearTimeout(rengT)
  }, [rengDeshacer])

  const rengCambiar = (rengNueva: RengEntradaHistorial[], rengTexto: string): void => {
    rengSetDeshacer(rengPrepararDeshacer(rengLista, rengTexto, Date.now()))
    rengOnLista(rengNueva)
    rengGuardarHistorial(rengAlmacen(), rengNueva)
  }

  if (rengLista.length === 0 && !rengDeshacer) return null
  return (
    <RengVerMas titulo={`Historial (${rengLista.length})`}>
      {rengPuedeDeshacer(rengDeshacer, Date.now()) && (
        <div className="notice historial-deshacer" role="status">
          <span>{rengDeshacer.texto}</span>
          <button
            className="btn sm"
            onClick={() => {
              rengOnLista(rengDeshacer.anterior)
              rengGuardarHistorial(rengAlmacen(), rengDeshacer.anterior)
              rengSetDeshacer(null)
            }}
          >
            Deshacer
          </button>
        </div>
      )}
      <ul className="historial-lista">
        {rengLista.map((rengE) => (
          <li key={rengE.id} className="historial-item">
            <button className="btn ghost sm historial-abrir" onClick={() => rengOnAbrir(rengE)} title={`Abrir ${rengE.nombre} (${new Date(rengE.fecha).toLocaleString()})`}>
              <span>{rengE.nombre}</span>
              {rengE.tipo !== 'anterior' && <span className="faint sm"> · {rengE.tipo}</span>}
            </button>
            <button className="btn ghost sm" aria-label={`Borrar ${rengE.nombre} del historial`} title="Borrar del historial" onClick={() => rengCambiar(rengBorrarDeHistorial(rengLista, rengE.id), `«${rengE.nombre}» borrada del historial.`)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      {rengLista.length > 0 && (
        <button className="btn sm" onClick={() => rengCambiar([], 'Historial limpiado.')}>
          Limpiar historial
        </button>
      )}
    </RengVerMas>
  )
}
