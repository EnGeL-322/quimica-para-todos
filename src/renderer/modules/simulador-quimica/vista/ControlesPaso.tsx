interface RengProps {
  paso: number
  t: number
  titulos: string[]
  reproduciendo: boolean
  onAnterior: () => void
  onAlternar: () => void
  onSiguiente: () => void
  onIr: (rengPaso: number) => void
}

export function RengControlesPaso({ paso: rengPaso, t: rengT, titulos: rengTitulos, reproduciendo: rengReproduciendo, onAnterior: rengOnAnterior, onAlternar: rengOnAlternar, onSiguiente: rengOnSiguiente, onIr: rengOnIr }: RengProps): React.JSX.Element {
  const rengTotal = rengTitulos.length
  return (
    <div className="pasos" role="group" aria-label="Controles de la animación (Espacio, ← y →)">
      <div className="row" style={{ gap: 6 }}>
        <button className="btn sm" onClick={rengOnAnterior} disabled={rengPaso === 0} title="Paso anterior (←)">
          ◀ Anterior
        </button>
        <button className="btn sm primary pasos-play" onClick={rengOnAlternar} title="Reproducir o pausar (Espacio)" aria-pressed={rengReproduciendo}>
          {rengReproduciendo ? '❚❚ Pausa' : '▶ Reproducir'}
        </button>
        <button className="btn sm" onClick={rengOnSiguiente} disabled={rengPaso >= rengTotal - 1 && rengT >= 1} title="Paso siguiente (→)">
          Siguiente ▶
        </button>
      </div>
      <div className="pasos-barra">
        {rengTitulos.map((rengTit, rengI) => (
          <button
            key={rengI}
            className={`pasos-tramo ${rengI === rengPaso ? 'actual' : ''}`}
            onClick={() => rengOnIr(rengI)}
            title={`Paso ${rengI + 1}: ${rengTit}`}
            aria-label={`Ir al paso ${rengI + 1}: ${rengTit}`}
            aria-current={rengI === rengPaso ? 'step' : undefined}
          >
            <i style={{ width: `${rengI < rengPaso ? 100 : rengI === rengPaso ? Math.round(rengT * 100) : 0}%` }} />
          </button>
        ))}
      </div>
      <span className="sm muted pasos-texto" aria-live="polite">
        Paso {rengPaso + 1} de {rengTotal}: <b>{rengTitulos[rengPaso]}</b>
      </span>
    </div>
  )
}
