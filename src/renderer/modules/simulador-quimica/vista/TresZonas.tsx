import { useState, type ReactNode } from 'react'

interface RengProps {
  lienzo: ReactNode
  barra: ReactNode
  panel: ReactNode
}

export function RengTresZonas({ lienzo: rengLienzo, barra: rengBarra, panel: rengPanel }: RengProps): React.JSX.Element {
  const [rengPlegado, rengSetPlegado] = useState(false)
  return (
    <div className="zonas">
      <div className="zonas-centro">
        {rengLienzo}
        <div className="zonas-barra">{rengBarra}</div>
      </div>
      <aside className={`zonas-panel ${rengPlegado ? 'plegado' : ''}`} aria-label="Panel de explicación">
        <button
          className="btn ghost sm zonas-plegar"
          onClick={() => rengSetPlegado(!rengPlegado)}
          aria-expanded={!rengPlegado}
          aria-label={rengPlegado ? 'Mostrar explicación' : 'Ocultar explicación'}
          title={rengPlegado ? 'Mostrar explicación' : 'Ocultar explicación'}
        >
          {rengPlegado ? '‹' : 'Ocultar ›'}
        </button>
        {!rengPlegado && rengPanel}
      </aside>
    </div>
  )
}
