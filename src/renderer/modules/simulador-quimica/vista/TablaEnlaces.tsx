import { rengAgruparEnlaces } from '../estado/agrupar'
import type { RengDerivadoFragmento } from '../estado/derivados'
import { rengLongitudEnlace } from '../nucleo/relajar'

const rengComa = (rengX: number, rengD: number): string => rengX.toFixed(rengD).replace('.', ',')

export function RengTablaEnlaces({ d: rengD }: { d: RengDerivadoFragmento }): React.JSX.Element | null {
  const rengGrupos = rengAgruparEnlaces(rengD.enlaces)
  if (!rengGrupos.length) return null
  return (
    <table className="tabla-enlaces" aria-label={`Enlaces de ${rengD.formula}`}>
      <thead>
        <tr>
          <th scope="col">Enlace</th>
          <th scope="col">Tipo</th>
          <th scope="col">Orden</th>
          <th scope="col">Δχ</th>
          <th scope="col">Longitud aprox.</th>
        </tr>
      </thead>
      <tbody>
        {rengGrupos.map((rengG) => {
          const rengE = rengD.enlaces.find((rengX) => rengX.a === rengG.pares[0]![0] && rengX.b === rengG.pares[0]![1])!
          return (
            <tr key={rengG.clave}>
              <th scope="row" className="mono">
                {rengG.etiqueta}
                {rengG.n > 1 ? ` ×${rengG.n}` : ''}
              </th>
              <td>{rengE.tipo.replace(/-/g, ' ')}</td>
              <td>{rengE.orden}</td>
              <td>{rengE.delta === null ? '—' : rengComa(rengE.delta, 2)}</td>
              <td>{rengE.orden === 1 ? `${rengComa(rengLongitudEnlace(rengE.elA, rengE.elB), 2)} Å` : '—'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
