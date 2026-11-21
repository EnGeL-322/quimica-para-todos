import { useMemo, type ReactNode } from 'react'
import { rengGlosarioPorId, rengMarcarTerminos } from '../nucleo/glosario'

export function RengTextoGlosario({ texto: rengTexto, marcados: rengMarcados }: { texto: string; marcados?: Set<string> }): React.JSX.Element {
  const rengSegs = useMemo(() => rengMarcarTerminos(rengTexto, rengMarcados ?? new Set()), [rengTexto, rengMarcados])
  return (
    <>
      {rengSegs.map((rengS, rengI) => {
        const rengG = rengS.termino ? rengGlosarioPorId.get(rengS.termino) : undefined
        if (!rengG) return <span key={rengI}>{rengS.texto}</span>
        const rengId = `glosario-${rengG.id}-${rengI}`
        return (
          <span key={rengI} className="termino" tabIndex={0} aria-describedby={rengId}>
            {rengS.texto}
            <span className="tooltip" role="tooltip" id={rengId}>
              {rengG.definicion}
              <small>Fuente: {rengG.fuente}</small>
            </span>
          </span>
        )
      })}
    </>
  )
}

interface RengProps {
  titular: string
  parrafo: string
  saberMas?: ReactNode
  children?: ReactNode
}

export function RengPanelExplicacion({ titular: rengTitular, parrafo: rengParrafo, saberMas: rengSaberMas, children: rengChildren }: RengProps): React.JSX.Element {
  const rengMarcados = useMemo(() => new Set<string>(), [rengParrafo])
  return (
    <section className="stack" aria-label="Explicación">
      <h2 className="expl-titular">{rengTitular}</h2>
      <p className="expl-parrafo">
        <RengTextoGlosario texto={rengParrafo} marcados={rengMarcados} />
      </p>
      {rengChildren}
      {rengSaberMas && (
        <details className="panel-seccion">
          <summary>Saber más</summary>
          <div className="stack sm muted" style={{ padding: '4px 12px 12px' }}>
            {rengSaberMas}
          </div>
        </details>
      )}
    </section>
  )
}

export function RengVerMas({ titulo: rengTitulo = 'Ver más', children: rengChildren, abierto: rengAbierto }: { titulo?: string; children: ReactNode; abierto?: boolean }): React.JSX.Element {
  return (
    <details className="panel-seccion" open={rengAbierto}>
      <summary>{rengTitulo}</summary>
      <div className="stack sm" style={{ padding: '4px 12px 12px' }}>
        {rengChildren}
      </div>
    </details>
  )
}
