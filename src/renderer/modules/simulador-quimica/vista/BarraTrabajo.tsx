import { useMemo } from 'react'
import { rengTextoCarga } from '../estado/acciones'
import { rengDerivarTodos } from '../estado/derivados'
import { RengFormulaSimple } from './Formula'
import { useRengAlmacen, useRengTrabajo } from './useTrabajo'

export function RengBarraTrabajo({ onAnadir: rengOnAnadir, children: rengChildren }: { onAnadir: () => void; children?: React.ReactNode }): React.JSX.Element {
  const rengT = useRengAlmacen()
  const rengEstado = useRengTrabajo((rengE) => rengE)
  const rengFrags = useMemo(() => rengDerivarTodos(rengEstado), [rengEstado])
  return (
    <div className="barra-trabajo">
      {rengChildren}
      <div className="barra-trabajo-fragmentos" role="toolbar" aria-label="Trabajando con: fragmentos de la mesa">
        <span className="sm muted">Trabajando con</span>
        {rengFrags.length === 0 && <span className="sm faint">nada todavía</span>}
        {rengFrags.map((rengF) => (
          <button
            key={rengF.id}
            className={`chip-fragmento ${rengF.id === rengEstado.activo ? 'activo' : ''}`}
            aria-pressed={rengF.id === rengEstado.activo}
            title={`${rengF.nombre ?? rengF.formula}${rengF.completa ? '' : ' (incompleto)'}`}
            onClick={() => rengT.aplicar((rengE) => ({ ...rengE, activo: rengF.id }), false)}
          >
            <RengFormulaSimple texto={rengF.formula} />
            {rengF.cargaNeta !== 0 && <span>{rengTextoCarga(rengF.cargaNeta)}</span>}
            {!rengF.completa && rengF.ids.length > 1 && <span aria-label="incompleto"> ·</span>}
          </button>
        ))}
        <button className="btn ghost sm" onClick={rengOnAnadir} title="Ir a Construir para añadir elementos o sustancias" aria-label="Añadir elementos o sustancias">
          +
        </button>
      </div>
    </div>
  )
}

export function RengVacioTrabajo({ que: rengQue, onIrAExplorar: rengOnIrAExplorar, children: rengChildren }: { que: string; onIrAExplorar: () => void; children?: React.ReactNode }): React.JSX.Element {
  return (
    <div className="vacio-trabajo">
      <p>
        <b>Añade una sustancia a la mesa.</b> {rengQue}
      </p>
      <button className="btn primary" onClick={rengOnIrAExplorar}>
        Ir a Construir
      </button>
      {rengChildren}
    </div>
  )
}
