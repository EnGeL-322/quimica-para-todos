import { useMemo, useState } from 'react'
import { RENG_CATEGORIAS, RENG_ELEMENTOS } from '../../tabla-periodica/data'
import { RENG_FUENTE_COMPUESTOS } from '../nucleo/compuestosBinarios'
import { rengCombinar, RENG_FUENTES_CONSTRUCTOR, type RengResultadoConstructor } from '../nucleo/constructor'
import { RENG_FUENTE_EN } from '../nucleo/electronegatividad'
import { rengBonita } from '../nucleo/formula'
import { RengFormula } from '../vista/Formula'
import { RengPanelExplicacion } from '../vista/PanelExplicacion'
import { RengTresZonas } from '../vista/TresZonas'
import { RengIcon } from '@/shell/Icon'

const RENG_EJEMPLOS: Array<[string, string]> = [
  ['Na', 'Cl'],
  ['Al', 'O'],
  ['Mg', 'N'],
  ['Fe', 'O'],
  ['C', 'O'],
  ['H', 'O'],
  ['Xe', 'F'],
  ['He', 'Ne'],
  ['Na', 'K']
]

function rengResumen(rengR: RengResultadoConstructor): string {
  const rengConocidos = rengR.propuestas.filter((rengP) => rengP.conocido).map((rengP) => rengBonita(rengP.formula))
  const rengPredichos = rengR.propuestas.filter((rengP) => !rengP.conocido).map((rengP) => rengBonita(rengP.formula))
  if (rengConocidos.length) {
    const rengExtra = rengPredichos.length ? ` La regla también predice ${rengPredichos.join(', ')}, que no está verificado.` : ''
    return `Forman ${rengConocidos.length === 1 ? 'un compuesto conocido' : `${rengConocidos.length} compuestos conocidos`}: ${rengConocidos.join(' y ')}.${rengExtra}`
  }
  if (rengPredichos.length) return `La regla predice ${rengPredichos.join(', ')}, pero no está en la lista de compuestos verificados: tómalo como una hipótesis.`
  return rengR.razonamiento[rengR.razonamiento.length - 1] ?? ''
}

const rengSigno = (rengN: number): string => (rengN > 0 ? `+${rengN}` : rengN < 0 ? `−${Math.abs(rengN)}` : '0')

export default function RengConstructorEnlace({ onVerSecuencia: rengOnVerSecuencia, selector: rengSelector }: { onVerSecuencia: (rengId: string) => void; selector: React.ReactNode }): React.JSX.Element {
  const [rengSel, rengSetSel] = useState<[string | null, string | null]>(['Na', 'Cl'])
  const rengElegir = (rengS: string): void => rengSetSel(([rengA, rengB]) => (rengA === null ? [rengS, rengB] : rengB === null ? [rengA, rengS] : [rengS, null]))
  const rengR = useMemo((): RengResultadoConstructor | { error: string } | null => {
    if (!rengSel[0] || !rengSel[1]) return null
    try {
      return rengCombinar(rengSel[0], rengSel[1])
    } catch (rengE) {
      return { error: rengE instanceof Error ? rengE.message : String(rengE) }
    }
  }, [rengSel])

  return (
    <RengTresZonas
      lienzo={
        <div className="zonas-lienzo">
          <div className="centro-scroll">
            <p className="sm muted" style={{ textAlign: 'center' }}>
              Pulsa dos elementos de la tabla (o el mismo dos veces). El tercer clic empieza una pareja nueva.
            </p>
            <div className="tp-mini" role="group" aria-label="Tabla periódica: elige dos elementos">
              {RENG_ELEMENTOS.map((rengE) => {
                const rengElegido = rengSel.includes(rengE.simbolo)
                return (
                  <button
                    key={rengE.z}
                    className={`tp-mini-celda ${rengElegido ? 'elegido' : ''}`}
                    style={{ gridRow: rengE.fila, gridColumn: rengE.columna, ['--cat' as string]: RENG_CATEGORIAS[rengE.categoria].color } as React.CSSProperties}
                    onClick={() => rengElegir(rengE.simbolo)}
                    title={`${rengE.nombre} (${RENG_CATEGORIAS[rengE.categoria].nombre})`}
                    aria-pressed={rengElegido}
                    aria-label={rengE.nombre}
                  >
                    {rengE.simbolo}
                  </button>
                )
              })}
            </div>
            <div className="row" style={{ justifyContent: 'center' }}>
              {RENG_EJEMPLOS.map(([rengA, rengB]) => (
                <button key={rengA + rengB} className="btn sm" onClick={() => rengSetSel([rengA, rengB])}>
                  {rengA} + {rengB}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      barra={
        <div className="row" style={{ gap: 14 }}>
          <span className="sm muted">Elementos:</span>
          <b className="formula media">{rengSel[0] ?? '?'}</b>
          <span className="f-mas">+</span>
          <b className="formula media">{rengSel[1] ?? '?'}</b>
          {rengR && 'propuestas' in rengR && rengR.propuestas.length > 0 && (
            <>
              <span className="f-flecha-signo">⟶</span>
              {rengR.propuestas.map((rengP) => (
                <RengFormula key={rengP.formula} texto={rengP.formula} tamano="media" />
              ))}
            </>
          )}
        </div>
      }
      panel={
        <>
          {rengSelector}
          {!rengR ? (
            <RengPanelExplicacion titular="Elige dos elementos" parrafo="La app razonará qué tipo de enlace se forma y qué compuesto resulta, y te dirá si ese compuesto está verificado." />
          ) : 'error' in rengR ? (
            <RengPanelExplicacion titular="No se puede combinar" parrafo={rengR.error} />
          ) : (
            <RengPanelExplicacion
              titular={rengR.titulo}
              parrafo={rengResumen(rengR)}
              saberMas={
                <>
                  {rengR.avisos.map((rengA) => (
                    <p key={rengA}>{rengA}</p>
                  ))}
                  <p className="faint">Fuentes: {[RENG_FUENTE_EN, ...RENG_FUENTES_CONSTRUCTOR, RENG_FUENTE_COMPUESTOS].join(' · ')}.</p>
                </>
              }
            >
              <ol className="sm" style={{ paddingLeft: 18 }} aria-label="Razonamiento paso a paso">
                {rengR.razonamiento.map((rengT) => (
                  <li key={rengT}>{rengT}</li>
                ))}
              </ol>
              {rengR.propuestas.map((rengP) => (
                <div key={rengP.formula} className={`notice ${rengP.conocido ? 'ok' : 'warn'}`}>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <RengFormula texto={rengP.formula} tamano="media" />
                    <span className="sm">{rengP.conocido ? <><RengIcon name="check" size={12} /> Compuesto conocido</> : <><RengIcon name="alert" size={12} /> Predicha por las reglas, no verificada</>}</span>
                  </div>
                  {rengP.nombre && <div className="sm">{rengP.nombre}</div>}
                  {rengP.estados.length > 0 && <div className="sm muted">Estados de oxidación: {rengP.estados.map((rengE) => `${rengE.el} ${rengSigno(rengE.ox)}`).join(', ')}</div>}
                  {rengP.nota && <div className="sm muted">{rengP.nota}</div>}
                </div>
              ))}
              {rengR.otrosConocidos.length > 0 && (
                <div className="stack" style={{ gap: 4 }}>
                  <span className="sm">Otros compuestos conocidos de estos elementos que la regla sencilla no predice:</span>
                  {rengR.otrosConocidos.map((rengC) => (
                    <div key={rengC.formula} className="sm">
                      <RengFormula texto={rengC.formula} /> — {rengC.nombre}
                      {rengC.nota ? `. ${rengC.nota}` : ''}
                    </div>
                  ))}
                </div>
              )}
              {rengR.secuencia && (
                <button className="btn primary" onClick={() => rengOnVerSecuencia(rengR.secuencia!)}>
                  Ver cómo se forma ▶
                </button>
              )}
            </RengPanelExplicacion>
          )}
        </>
      }
    />
  )
}
