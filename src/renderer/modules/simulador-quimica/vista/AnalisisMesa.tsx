import { rengExplicarIncompleto } from '../estado/derivados'
import { rengIdFragmento } from '../estado/trabajo'
import { rengComposicionConocida } from '../nucleo/analisisMesa'
import { RENG_NOTA_VALENCIAS } from '../nucleo/enlazar'
import { RengCompletarValencias } from './CompletarValencias'
import { rengAtomo, rengVecinosDe, type RengMesa } from '../nucleo/mesa'
import { rengAngulo } from '../nucleo/relajar'
import { RENG_FUENTE_MMFF } from '../nucleo/molecula'
import { RengFormulaSimple } from './Formula'
import { useRengMuestra } from './nivel'
import { rengOrigenGeometria } from './procedencia'
import type { RengEstadoMesa } from './useMesa'

function rengAnguloDe(rengM: RengMesa, rengIds: number[]): string | null {
  for (const rengV of rengIds) {
    const rengN = rengVecinosDe(rengM, rengV)
    if (rengN.length < 2) continue
    const [rengA, rengB] = [rengAtomo(rengM, rengN[0]!)!, rengAtomo(rengM, rengN[1]!)!]
    const rengC = rengAtomo(rengM, rengV)!
    return `${rengA.el}–${rengC.el}–${rengB.el}: ${rengAngulo([rengA.p, rengC.p, rengB.p], 0, 1, 2).toFixed(1).replace('.', ',')}°`
  }
  return null
}

const RENG_ORIGEN: Record<'experimental' | 'calculada', string> = { experimental: 'Geometría experimental (NIST CCCBDB)', calculada: 'Geometría calculada (MMFF94)' }

export function RengAnalisisMesa({ estado: rengEstado, onVerRed: rengOnVerRed, onVer3D: rengOnVer3D, activo: rengActivo }: { estado: RengEstadoMesa; onVerRed?: (rengIdRed: string) => void; onVer3D?: (rengIds: number[]) => void; activo?: string | null }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const { analisis: rengAnalisis } = rengEstado
  if (rengAnalisis.length === 0)
    return <p className="sm muted">La mesa está vacía. Arrastra elementos desde la pestaña Elementos o escribe una sustancia abajo.</p>
  return (
    <div className="stack" style={{ gap: 10 }}>
      <span className="sm muted">Estás construyendo</span>
      {rengAnalisis.map((rengA) => {
        const rengOrigen = rengOrigenGeometria(rengEstado.procedencias, rengEstado.mesa, rengA.ids)
        const rengRed = rengA.sustancia?.idRed
        return (
          <div key={rengA.ids.join(',')} className={`card fragmento-card stack${rengActivo === rengIdFragmento(rengA.ids) ? ' seleccionado' : ''}`} style={{ gap: 6 }}>
            <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
              <RengFormulaSimple texto={rengA.formula} tamano="media" />
              {rengA.nombre && <b>{rengA.nombre}</b>}
            </div>
            <span className={`sm ${rengA.completa ? 'ok-texto' : 'muted'}`}>{rengA.completa ? rengA.estado : (rengExplicarIncompleto(rengA) ?? rengA.estado)}</span>
            {rengA.existencia && <span className="sm">{rengA.existencia}</span>}
            {rengA.ionico && rengA.completa && <span className="sm muted">En el sólido no hay moléculas: forma una red de iones.</span>}
            {rengMuestra('explorar.smiles') && rengA.smiles && (
              <span className="sm mono" title="SMILES con todos los átomos explícitos">
                SMILES: {rengA.sustancia?.smiles ?? rengA.smiles}
              </span>
            )}
            {rengA.completa && !rengA.ionico && rengAnguloDe(rengEstado.mesa, rengA.ids) && <span className="sm">Ángulo {rengAnguloDe(rengEstado.mesa, rengA.ids)}</span>}
            {rengOrigen && rengA.completa && (
              <span className="faint sm" title={rengOrigen === 'calculada' ? RENG_FUENTE_MMFF : undefined}>
                {RENG_ORIGEN[rengOrigen]}
              </span>
            )}
            <div className="row" style={{ gap: 6 }}>
              {rengOnVer3D && (rengA.completa || rengA.ids.length === 1) && (
                <button className="btn sm primary" onClick={() => rengOnVer3D(rengA.ids)} title="Abre el modelo 3D de bolas y varillas de este fragmento">
                  Ver en 3D
                </button>
              )}
              {!rengA.completa && !rengA.ionico && <RengCompletarValencias ids={rengA.ids} formaReal={rengEstado.formaReal} />}
              {rengA.libres > 0 && !rengA.ionico && !rengComposicionConocida(rengA.formula, rengA.ids.length) && (
                <button className="btn sm" onClick={() => rengEstado.completarH(rengA.ids)}>
                  Completar con H
                </button>
              )}
              {rengA.ids.length > 1 && !rengA.ionico && !rengA.metalico && (
                <button className="btn sm" onClick={() => rengEstado.optimizar(rengA.ids)} title="Relaja la forma y, si está completa, pasa a su geometría real">
                  Optimizar geometría
                </button>
              )}
              {rengRed && rengOnVerRed && (
                <button className="btn sm" onClick={() => rengOnVerRed(rengRed)}>
                  Ver red cristalina
                </button>
              )}
            </div>
          </div>
        )
      })}
      <p className="faint sm">{RENG_NOTA_VALENCIAS}</p>
    </div>
  )
}
