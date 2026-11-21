import { useMemo, useState } from 'react'
import { RengNotice } from '../../../shell/ui'
import { rengAjustarEcuacion, type RengAjuste } from '../nucleo/ajuste'
import { rengAnalizarNotacion, type RengEspecieNotada, type RengNotacion } from '../nucleo/notacion'
import { RengFormula, type RengPropsResaltado } from './Formula'
import { rengEstiloCpk } from './nivel'
import { RengIcon } from '@/shell/Icon'

interface RengProps extends RengPropsResaltado {
  texto: string
  onEspecie?: (rengE: RengEspecieNotada) => void
  activa?: string | null
  conTabla?: boolean
  tamano?: 'normal' | 'media' | 'grande'
}

type RengResultado = { n: RengNotacion; aj: RengAjuste; corregida: boolean } | { n: RengNotacion | null; error: string }

const rengComoCoef = (rengC: number): string | null => (rengC === 1 ? null : String(rengC))

export function RengEcuacion({ texto: rengTexto, onEspecie: rengOnEspecie, activa: rengActiva, conTabla: rengConTabla = true, tamano: rengTamano = 'grande', resaltado: rengResaltado, onElemento: rengOnElemento }: RengProps): React.JSX.Element {
  const rengR = useMemo((): RengResultado => {
    let rengN: RengNotacion | null = null
    try {
      rengN = rengAnalizarNotacion(rengTexto)
      const rengAj = rengAjustarEcuacion(rengTexto)
      const rengEscritos = [...rengN.izquierda, ...rengN.derecha].map((rengE) => rengE.coef)
      const rengAjustados = [...rengAj.reactivos, ...rengAj.productos].map((rengT) => rengT.coef)
      const rengValor = (rengC: string | null): number => {
        const rengS = (rengC ?? '1').replace(',', '.')
        const [rengA, rengB] = rengS.split('/')
        return rengB ? Number(rengA) / Number(rengB) : Number(rengS)
      }
      const rengK = rengValor(rengEscritos[0] ?? null) / (rengAjustados[0] as number)
      const rengCorregida = rengEscritos.some((rengC) => rengC !== null) && rengEscritos.some((rengC, rengI) => Math.abs(rengValor(rengC) - rengK * (rengAjustados[rengI] as number)) > 1e-9)
      return { n: rengN, aj: rengAj, corregida: rengCorregida }
    } catch (rengE) {
      return { n: rengN, error: rengE instanceof Error ? rengE.message : String(rengE) }
    }
  }, [rengTexto])
  const [rengComprobada, rengSetComprobada] = useState<string | null>(null)
  const rengHecho = rengComprobada === rengTexto

  if ('error' in rengR) {
    return (
      <div className="stack">
        {rengR.n && <RengFormula notacion={rengR.n} tamano={rengTamano} resaltado={rengResaltado} onElemento={rengOnElemento} />}
        <RengNotice tipo="err">{rengR.error}</RengNotice>
      </div>
    )
  }
  const rengCoeficientes = { izquierda: rengR.aj.reactivos.map((rengT) => rengComoCoef(rengT.coef)), derecha: rengR.aj.productos.map((rengT) => rengComoCoef(rengT.coef)) }
  const rengFilas = rengR.aj.comprobacion
  return (
    <div className="stack">
      <div>
        <RengFormula
          notacion={rengR.n}
          coeficientes={rengCoeficientes}
          tamano={rengTamano}
          resaltado={rengResaltado}
          onElemento={rengOnElemento}
          activa={rengActiva}
          onEspecie={rengOnEspecie ? (rengE) => rengOnEspecie(rengE) : undefined}
        />
      </div>
      {rengR.corregida && <RengNotice tipo="warn">Los coeficientes que escribiste no estaban ajustados; se muestran los correctos (en color).</RengNotice>}
      {rengConTabla && (
        <div className="stack" style={{ gap: 8 }}>
          <table className="table tabla-datos conservacion" aria-label="Conservación de átomos y carga">
            <thead>
              <tr>
                <th scope="col">Elemento</th>
                <th scope="col">Reactivos</th>
                <th scope="col">Productos</th>
                <th scope="col">¿Igual?</th>
              </tr>
            </thead>
            <tbody>
              {rengFilas.map((rengF, rengI) => (
                <tr
                  key={rengF.que}
                  className={rengResaltado === rengF.que ? 'fila-resaltada' : ''}
                  onMouseEnter={rengOnElemento && rengF.que !== 'carga' ? () => rengOnElemento(rengF.que) : undefined}
                  onMouseLeave={rengOnElemento ? () => rengOnElemento(null) : undefined}
                >
                  <td>
                    {rengF.que === 'carga' ? (
                      'Carga total'
                    ) : (
                      <>
                        <span className="punto-cpk" style={rengEstiloCpk(rengF.que)} aria-hidden="true" />
                        {rengF.que}
                      </>
                    )}
                  </td>
                  <td>{rengHecho ? rengF.izquierda : '?'}</td>
                  <td>{rengHecho ? rengF.derecha : '?'}</td>
                  <td aria-live="polite">
                    {rengHecho &&
                      (rengF.izquierda === rengF.derecha ? (
                        <span className="marca-ok" style={{ animationDelay: `${rengI * 120}ms` }} aria-label="sí">
                          <RengIcon name="check" size={14} />
                        </span>
                      ) : (
                        <span className="marca-no" aria-label="no">
                          ✗
                        </span>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row">
            <button className="btn" onClick={() => rengSetComprobada(rengHecho ? null : rengTexto)}>
              {rengHecho ? 'Ocultar recuento' : 'Comprobar ajuste'}
            </button>
            {rengHecho && <span className="sm muted">Cada elemento tiene los mismos átomos a los dos lados: la masa se conserva.</span>}
          </div>
        </div>
      )}
    </div>
  )
}
