import { useMemo, useState } from 'react'
import { RENG_CASOS, RENG_CATEGORIAS_CASOS, RENG_FUENTES, rengFuentePorId, type RengAfirmacion, type RengCaso, type RengCategoria } from '../datos/casos'
import { rengDerivarTodos } from '../estado/derivados'
import { rengFraccionFluor, rengPorcentajeParaPpm } from '../nucleo/casos'
import { rengMasaMolarDe } from '../nucleo/formula'
import { RengFormula, RengFormulaSimple } from '../vista/Formula'
import { useRengMuestra } from '../vista/nivel'
import { RengAviso, RengEtiqueta } from '../vista/ui'
import type { RengEstadoMesa } from '../vista/useMesa'
import { useRengTrabajo } from '../vista/useTrabajo'

interface RengProps {
  mesa: RengEstadoMesa
  onIrAExplorar: () => void
}

const rengLado = (rengXs: Array<{ coef: number; formula: string }>): string => rengXs.map((rengX) => `${rengX.coef === 1 ? '' : rengX.coef}${rengX.formula}`).join(' + ')

function RengOrigen({ a: rengA, completa: rengCompleta }: { a: RengAfirmacion; completa: boolean }): React.JSX.Element {
  const rengF = rengA.fuente ? rengFuentePorId(rengA.fuente) : null
  if (!rengF) return <RengEtiqueta title="Química de libro de texto; no se contrastó con una fuente concreta">Conocimiento general</RengEtiqueta>
  const rengResumen = rengF.acceso === 'resumen'
  return (
    <RengEtiqueta tono={rengResumen ? 'aviso' : 'ok'} title={`${rengF.texto} · consultada el ${rengF.consultada}${rengResumen ? ' (solo un resumen de búsqueda: menos fiable)' : ''}`}>
      {rengCompleta ? `${rengResumen ? 'Resumen de' : 'Fuente:'} ${rengF.corta} · ${rengF.consultada}` : rengResumen ? 'Fuente (solo resumen)' : 'Fuente consultada'}
    </RengEtiqueta>
  )
}

export default function RengCasos({ mesa: rengMesa, onIrAExplorar: rengOnIrAExplorar }: RengProps): React.JSX.Element {
  const [rengCat, rengSetCat] = useState<RengCategoria | 'todos'>('todos')
  const [rengQ, rengSetQ] = useState('')
  const [rengAbierto, rengSetAbierto] = useState<string | null>(null)
  const rengLista = useMemo(() => {
    const rengN = rengQ.trim().toLowerCase()
    return RENG_CASOS.filter((rengC) => (rengCat === 'todos' || rengC.categoria === rengCat) && (!rengN || `${rengC.titulo} ${rengC.gancho} ${rengC.componentes.map((rengK) => `${rengK.nombre} ${rengK.formula}`).join(' ')}`.toLowerCase().includes(rengN)))
  }, [rengCat, rengQ])
  const rengCaso = rengAbierto ? RENG_CASOS.find((rengC) => rengC.id === rengAbierto) : null
  if (rengCaso) return <RengDetalle caso={rengCaso} mesa={rengMesa} onVolver={() => rengSetAbierto(null)} onIrAExplorar={rengOnIrAExplorar} />
  return (
    <div className="casos stack" style={{ gap: 'var(--s-4)' }}>
      <header className="q-cabecera">
        <h2>Elige un caso</h2>
        <p className="muted sm">La química de tu casa, la naturaleza y el espacio. Cada dato dice de dónde sale.</p>
      </header>
      <div className="q-filtros">
        <input className="input" type="search" placeholder="Buscar: flúor, ozono, Tesla…" aria-label="Buscar casos" value={rengQ} onChange={(rengE) => rengSetQ(rengE.target.value)} />
        <div className="q-chips" role="group" aria-label="Filtrar por tema">
          {(['todos', ...(Object.keys(RENG_CATEGORIAS_CASOS) as RengCategoria[])] as const).map((rengC) => (
            <button key={rengC} type="button" className="q-chip" aria-pressed={rengCat === rengC} onClick={() => rengSetCat(rengC)}>
              {rengC === 'todos' ? 'Todos' : RENG_CATEGORIAS_CASOS[rengC].nombre}
            </button>
          ))}
        </div>
      </div>
      <p className="q-resultados faint sm" role="status">
        {rengLista.length === 0 ? 'Sin resultados' : `${rengLista.length} casos`}
      </p>
      {rengLista.length === 0 && (
        <div className="notice q-sin-resultados" role="status">
          <span>Ningún caso coincide con «{rengQ.trim()}».</span>
          <button
            type="button"
            className="btn sm"
            onClick={() => {
              rengSetQ('')
              rengSetCat('todos')
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
      <div className="casos-grid">
        {rengLista.map((rengC) => (
          <button key={rengC.id} className={`caso-card cat-${rengC.categoria}`} onClick={() => rengSetAbierto(rengC.id)} aria-label={`${rengC.titulo}. ${rengC.gancho}`}>
            <span className="caso-portada" aria-hidden="true">
              <RengFormulaSimple texto={rengC.portada} />
            </span>
            <span className="caso-cuerpo">
              <span className="q-tarjeta-meta">{RENG_CATEGORIAS_CASOS[rengC.categoria].nombre}</span>
              <b>{rengC.titulo}</b>
              <span className="sm muted">{rengC.gancho}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RengDetalle({ caso: rengCaso, mesa: rengMesa, onVolver: rengOnVolver, onIrAExplorar: rengOnIrAExplorar }: { caso: RengCaso; mesa: RengEstadoMesa; onVolver: () => void; onIrAExplorar: () => void }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const rengFrags = useRengTrabajo((rengE) => rengDerivarTodos(rengE).length)
  const [rengAviso, rengSetAviso] = useState<string | null>(null)
  const rengArmar = (rengEntrada: string): void => {
    const rengIds = rengMesa.anadirSustancia(rengEntrada, [rengFrags * 5, 0, 0], false)
    if (rengIds) rengOnIrAExplorar()
    else rengSetAviso('No se pudo poner en la mesa (mira el mensaje en Explorar).')
  }
  return (
    <div className="casos stack" style={{ gap: 'var(--s-4)' }}>
      <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={rengOnVolver}>
        ← Todos los casos
      </button>
      <section className={`caso-hero cat-${rengCaso.categoria}`}>
        <span className="caso-portada grande" aria-hidden="true">
          <RengFormulaSimple texto={rengCaso.portada} />
        </span>
        <div className="stack" style={{ gap: 'var(--s-2)' }}>
          <span className="q-tarjeta-meta">{RENG_CATEGORIAS_CASOS[rengCaso.categoria].nombre}</span>
          <h2 style={{ fontSize: 'var(--t-display)' }}>{rengCaso.titulo}</h2>
          <p>{rengCaso.gancho}</p>
        </div>
      </section>

      <section className="stack" aria-label="Ideas clave">
        <h3>Lo esencial</h3>
        <ol className="ideas">
          {rengCaso.ideas.map((rengA, rengI) => (
            <li key={rengI} className="ui-tarjeta">
              <span className="idea-n" aria-hidden="true">
                {rengI + 1}
              </span>
              <p>{rengA.texto}</p>
              <RengOrigen a={rengA} completa={rengMuestra('casos.fuentesCompletas')} />
            </li>
          ))}
        </ol>
      </section>

      {rengCaso.componentes.length > 0 && (
      <section className="stack" aria-label="Sustancias">
        <h3>Las sustancias</h3>
        <div className="componentes">
          {rengCaso.componentes.map((rengK) => (
            <div key={rengK.nombre} className="ui-tarjeta">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <b>{rengK.nombre}</b>
                <RengFormulaSimple texto={rengK.formula} />
              </div>
              <p className="sm muted">{rengK.rol}</p>
              {rengMuestra('casos.masas') && Number.isFinite(rengMasaDe(rengK.formula)) && <span className="sm mono">{rengMasaDe(rengK.formula).toFixed(3).replace('.', ',')} g/mol</span>}
              {rengK.entrada ? (
                <button className="btn sm" onClick={() => rengArmar(rengK.entrada!)}>
                  Armar en la mesa
                </button>
              ) : (
                <span className="faint sm">Sin modelo 3D en la app</span>
              )}
            </div>
          ))}
        </div>
        {rengAviso && <RengAviso tipo="aviso">{rengAviso}</RengAviso>}
      </section>
      )}

      {rengCaso.simulaciones && rengCaso.simulaciones.length > 0 && (
        <section className="stack" aria-label="Simulaciones">
          <h3>Pruébalo en Física para Todos</h3>
          <div className="componentes">
            {rengCaso.simulaciones.map((rengS) => (
              <div key={rengS.id} className="ui-tarjeta">
                <b>{rengS.nombre}</b>
                <p className="sm muted">{rengS.porque}</p>
                <span className="faint sm">Experimento «{rengS.nombre}» de la app Física para Todos.</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {rengCaso.cronologia && rengCaso.cronologia.length > 0 && (
        <section className="stack" aria-label="Cronología">
          <h3>Cronología</h3>
          <ol className="cronologia">
            {rengCaso.cronologia.map((rengC) => (
              <li key={rengC.cuando + rengC.hecho}>
                <b className="mono">{rengC.cuando}</b>
                <span>{rengC.hecho}</span>
                <RengOrigen a={{ texto: '', fuente: rengC.fuente }} completa={rengMuestra('casos.fuentesCompletas')} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {rengMuestra('casos.datos') && rengCaso.datos && rengCaso.datos.length > 0 && (
        <section className="stack" aria-label="Datos">
          <h3>Datos con su fuente</h3>
          <table className="tabla-enlaces">
            <thead>
              <tr>
                <th scope="col">Magnitud</th>
                <th scope="col">Valor</th>
                <th scope="col">Fuente</th>
              </tr>
            </thead>
            <tbody>
              {rengCaso.datos.map((rengD) => (
                <tr key={rengD.magnitud}>
                  <th scope="row">{rengD.magnitud}</th>
                  <td>{rengD.valor}</td>
                  <td>
                    <RengOrigen a={{ texto: '', fuente: rengD.fuente }} completa={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {rengCaso.ecuaciones.length > 0 && (
        <section className="stack" aria-label="Reacciones">
          <h3>La reacción</h3>
          {rengCaso.ecuaciones.map((rengE) => (
            <div key={rengE.nombre} className="ui-tarjeta acento">
              <b>{rengE.nombre}</b>
              <RengFormula texto={`${rengLado(rengE.reactivos)} -> ${rengLado(rengE.productos)}`} tamano="media" />
              {rengE.nota && <p className="sm muted">{rengE.nota}</p>}
              <RengOrigen a={{ texto: '', fuente: rengE.fuente }} completa={rengMuestra('casos.fuentesCompletas')} />
            </div>
          ))}
        </section>
      )}

      {rengMuestra('casos.calculadora') && rengCaso.id === 'pasta-dental' && <RengCalculadoraFluor />}

      {rengMuestra('casos.detalles') && rengCaso.detalles.length > 0 && (
        <section className="stack" aria-label="Más detalles">
          <h3>Más detalles</h3>
          <ul className="stack" style={{ gap: 'var(--s-2)', paddingLeft: 0, listStyle: 'none' }}>
            {rengCaso.detalles.map((rengA, rengI) => (
              <li key={rengI} className="ui-tarjeta">
                <p>{rengA.texto}</p>
                <RengOrigen a={rengA} completa />
              </li>
            ))}
          </ul>
        </section>
      )}

      {rengMuestra('casos.limites') && (
        <section className="stack" aria-label="Lo que no sabemos">
          <h3>Lo que la app no sabe</h3>
          <RengAviso tipo="info">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {rengCaso.limites.map((rengL) => (
                <li key={rengL}>{rengL}</li>
              ))}
            </ul>
          </RengAviso>
        </section>
      )}

      {rengMuestra('casos.fuentesCompletas') && (
        <section className="stack" aria-label="Fuentes">
          <h3>Fuentes</h3>
          <ul className="sm" style={{ margin: 0, paddingLeft: 18 }}>
            {RENG_FUENTES.filter((rengF) => rengIdsDeFuentes(rengCaso).has(rengF.id)).map((rengF) => (
              <li key={rengF.id}>
                {rengF.texto} — <span className="mono">{rengF.url}</span> (consultada el {rengF.consultada}; {rengF.acceso === 'abierta' ? 'página abierta' : 'solo resumen de búsqueda'})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function rengIdsDeFuentes(rengC: RengCaso): Set<string> {
  const rengIds = new Set<string>()
  const rengPoner = (rengId: string | null | undefined): void => {
    if (rengId) rengIds.add(rengId)
  }
  for (const rengA of [...rengC.ideas, ...rengC.detalles]) rengPoner(rengA.fuente)
  for (const rengE of rengC.ecuaciones) rengPoner(rengE.fuente)
  for (const rengX of rengC.cronologia ?? []) rengPoner(rengX.fuente)
  for (const rengD of rengC.datos ?? []) rengPoner(rengD.fuente)
  return rengIds
}

const rengMasaDe = (rengFormula: string): number => {
  try {
    return rengMasaMolarDe(rengFormula)
  } catch {
    return NaN
  }
}

function RengCalculadoraFluor(): React.JSX.Element {
  const [rengPpm, rengSetPpm] = useState(1000)
  const rengFilas = [
    { f: 'NaF', n: 'Fluoruro de sodio' },
    { f: 'SnF2', n: 'Fluoruro estannoso' },
    { f: 'Na2PO3F', n: 'Monofluorofosfato de sodio' }
  ]
  return (
    <section className="stack" aria-label="Calculadora de flúor">
      <h3>Calculadora: ¿cuánto compuesto da {rengPpm} ppm de flúor?</h3>
      <div className="ui-tarjeta">
        <label className="field">
          <span className="sm">Flúor en la pasta (ppm)</span>
          <input type="range" min={500} max={1500} step={50} value={rengPpm} onChange={(rengE) => rengSetPpm(Number(rengE.target.value))} aria-valuetext={`${rengPpm} ppm`} />
        </label>
        <table className="tabla-enlaces">
          <thead>
            <tr>
              <th scope="col">Compuesto</th>
              <th scope="col">% de F en el compuesto</th>
              <th scope="col">% del compuesto en la pasta</th>
            </tr>
          </thead>
          <tbody>
            {rengFilas.map((rengR) => {
              const rengP = rengPorcentajeParaPpm(rengR.f, rengPpm)
              const rengFr = rengFraccionFluor(rengR.f)
              return (
                <tr key={rengR.f}>
                  <th scope="row">
                    {rengR.n} (<RengFormulaSimple texto={rengR.f} />)
                  </th>
                  <td>{rengFr ? (rengFr * 100).toFixed(1).replace('.', ',') : '—'} %</td>
                  <td>{rengP ? rengP.toFixed(3).replace('.', ',') : '—'} %</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="faint sm">Calculado por la app con las masas molares de PubChem, suponiendo que todo el flúor está disponible; en una pasta real parte puede no estarlo.</p>
      </div>
    </section>
  )
}
