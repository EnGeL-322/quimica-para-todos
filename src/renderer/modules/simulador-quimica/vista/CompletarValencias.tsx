import { useMemo, useState } from 'react'
import { rengPropuestasValencia } from '../nucleo/completarValencias'
import { rengFragmentoDe, type RengMesa } from '../nucleo/mesa'
import { rengProgramarFormaReal } from './formaReal'
import { rengRelajarFragmento } from './useMesa'
import { useRengAlmacen, useRengTrabajo } from './useTrabajo'

export function RengCompletarValencias({ ids: rengIds, formaReal: rengFormaReal }: { ids: number[]; formaReal?: (rengM: RengMesa, rengId: number) => void }): React.JSX.Element | null {
  const rengT = useRengAlmacen()
  const rengMesa = useRengTrabajo((rengE) => rengE.mesa)
  const rengPropuestas = useMemo(() => rengPropuestasValencia(rengMesa, rengIds), [rengMesa, rengIds])
  const [rengAbierto, rengSetAbierto] = useState(false)
  if (!rengPropuestas.length) return null
  const rengAplicar = (rengI: number): void => {
    const rengP = rengPropuestas[rengI]!
    const rengRelajada = rengRelajarFragmento(rengP.mesa, rengFragmentoDe(rengP.mesa, rengIds[0]!))
    rengT.aplicar((rengE) => ({ ...rengE, mesa: rengRelajada }))
    if (rengFormaReal) rengFormaReal(rengRelajada, rengIds[0]!)
    else rengProgramarFormaReal(rengT, rengRelajada, rengIds[0]!)
    rengSetAbierto(false)
  }
  if (!rengAbierto)
    return (
      <button className="btn sm primary" onClick={() => rengSetAbierto(true)} title="Cierra las valencias libres subiendo el orden de enlaces o con cargas formales, sin añadir átomos">
        Completar valencias…
      </button>
    )
  return (
    <div className="completar-valencias stack" role="group" aria-label="Formas de completar las valencias">
      {rengPropuestas.map((rengP, rengI) => (
        <div key={rengP.id} className="completar-opcion stack">
          <button className="btn sm primary" onClick={() => rengAplicar(rengI)}>
            {rengPropuestas.length > 1 ? `Opción ${rengI + 1}: ` : ''}
            {rengP.titulo}
          </button>
          <span className="sm muted">{rengP.nota}</span>
        </div>
      ))}
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="sm faint">Se puede deshacer (Ctrl+Z).</span>
        <button className="btn ghost sm" onClick={() => rengSetAbierto(false)}>
          Cancelar
        </button>
      </div>
    </div>
  )
}
