import { RENG_SECUENCIAS, RENG_TIPOS_ENLACE, type RengTipoEnlace } from '../enlaces/secuencias'

export type RengEleccion = RengTipoEnlace | 'constructor'

export function RengSelectorEnlaces({ tipo: rengTipo, secId: rengSecId, onTipo: rengOnTipo, onSecuencia: rengOnSecuencia }: { tipo: RengEleccion; secId: string; onTipo: (rengT: RengEleccion) => void; onSecuencia: (rengId: string) => void }): React.JSX.Element {
  const rengDeTipo = RENG_SECUENCIAS.filter((rengX) => rengX.tipo === rengTipo)
  const rengTipos = [...RENG_TIPOS_ENLACE, { tipo: 'constructor' as const, etiqueta: 'Dos elementos', icono: '?', descripcion: 'Elige dos elementos: la app razona qué enlace y qué compuesto resultan.' }]
  const rengActivo = rengTipos.find((rengT) => rengT.tipo === rengTipo)
  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="tipos-enlace" role="radiogroup" aria-label="Tipo de enlace">
        {rengTipos.map((rengT) => (
          <button
            key={rengT.tipo}
            role="radio"
            aria-checked={rengTipo === rengT.tipo}
            className={`tipo-enlace ${rengTipo === rengT.tipo ? 'activo' : ''}`}
            onClick={() => rengOnTipo(rengT.tipo)}
            title={rengT.descripcion}
          >
            <span className="tipo-icono" aria-hidden="true">
              {rengT.icono}
            </span>
            <b>{rengT.etiqueta}</b>
          </button>
        ))}
      </div>
      {rengActivo && <p className="sm muted">{rengActivo.descripcion}</p>}
      {rengTipo !== 'constructor' && rengDeTipo.length > 1 && (
        <div className="field">
          <label htmlFor="enlaces-sec">Sustancia</label>
          <select id="enlaces-sec" className="select" value={rengSecId} onChange={(rengE) => rengOnSecuencia(rengE.target.value)}>
            {rengDeTipo.map((rengX) => (
              <option key={rengX.id} value={rengX.id}>
                {rengX.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

