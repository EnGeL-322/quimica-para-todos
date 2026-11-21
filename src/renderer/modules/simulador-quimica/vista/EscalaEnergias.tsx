import { RENG_ENERGIAS_INTERACCION } from '../nucleo/datosEnlace'

const rengComa = (rengX: number, rengD: number): string => rengX.toFixed(rengD).replace('.', ',')

export function RengEscalaEnergias(): React.JSX.Element {
  const rengFilas = Object.values(RENG_ENERGIAS_INTERACCION)
  const rengMax = Math.max(...rengFilas.map((rengF) => rengF.valor ?? 0))
  const rengAncho = (rengV: number): number => (70 * rengV) / rengMax
  return (
    <figure style={{ margin: 0 }} className="stack" aria-label="Comparación de energías de enlace e interacciones">
      <figcaption className="sm" style={{ fontWeight: 650 }}>
        ¿Cuánta energía hay que dar para separarlas? (kJ/mol)
      </figcaption>
      {rengFilas.map((rengF) => (
        <div key={rengF.nombre} className="stack" style={{ gap: 3 }}>
          <span className="sm">{rengF.nombre}</span>
          {rengF.valor === null ? (
            <span className="sm faint">Sin valor verificado: {rengF.nota}</span>
          ) : (
            <div className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
              <div className="escala-barra" style={{ width: `${rengAncho(rengF.valor)}%` }} />
              <b className="sm">{rengComa(rengF.valor, rengF.valor < 10 ? 2 : 1)}</b>
              {rengF.valor < rengMax && <span className="sm faint">≈ {Math.round(rengMax / rengF.valor)} veces más débil</span>}
            </div>
          )}
        </div>
      ))}
      <details className="sm">
        <summary>Fuentes</summary>
        <ul style={{ paddingLeft: 18 }}>
          {rengFilas.map((rengF) => (
            <li key={rengF.nombre} className="faint">
              {rengF.nombre}: {rengF.fuente}
            </li>
          ))}
        </ul>
      </details>
    </figure>
  )
}
