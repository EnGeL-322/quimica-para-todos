import { RENG_ESTANTERIA } from '../datos/estanteria'
import { useRengArrastre } from './arrastre'

export function RengEstanteria({ onAnadir: rengOnAnadir }: { onAnadir: (rengNombre: string, rengEntrada: string) => void }): React.JSX.Element {
  const { iniciar: rengIniciar } = useRengArrastre()
  return (
    <div className="stack" style={{ gap: 6 }}>
      <span className="sm muted">Sustancias</span>
      <div className="estanteria" role="group" aria-label="Estantería de sustancias: arrastra una a la mesa">
        {RENG_ESTANTERIA.map((rengF) => (
          <button
            key={rengF.nombre}
            className="ficha-sustancia"
            title={`${rengF.nombre} (${rengF.nombreCategoria}): arrástrala a la mesa`}
            onPointerDown={(rengEv) => rengIniciar({ tipo: 'sustancia', nombre: rengF.nombre, entrada: rengF.entrada }, rengEv, () => rengOnAnadir(rengF.nombre, rengF.entrada))}
            onKeyDown={(rengEv) => {
              if (rengEv.key === 'Enter' || rengEv.key === ' ') {
                rengEv.preventDefault()
                rengOnAnadir(rengF.nombre, rengF.entrada)
              }
            }}
          >
            <span>{rengF.nombre}</span>
            <span className="chip-categoria">{rengF.nombreCategoria}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
