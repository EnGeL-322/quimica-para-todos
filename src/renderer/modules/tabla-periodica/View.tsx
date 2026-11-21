import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { RengDestinos, type RengDestino } from '@/shell/ui'
import { RENG_CATEGORIAS, RENG_ELEMENTOS, rengMasaMolar, type RengCategoria, type RengElemento, type RengEstado } from './data'
import { RengFichaElemento } from './FichaElemento'
import { RENG_PELIGROS, rengFormasDeElemento, rengPeligroDeForma, rengRadioactividadDe, type RengNivelPeligro } from './peligros'
import { RengSelloPeligro, RengSustancias } from './Sustancias'
import './peligros.css'
import './tabla.css'

type RengModo = 'categoria' | 'estado' | 'masa' | 'peligro'
type RengVista = 'elementos' | 'sustancias' | 'molar'

const RENG_VISTAS: ReadonlyArray<RengDestino<RengVista>> = [
  { id: 'elementos', nombre: 'Elementos' },
  { id: 'sustancias', nombre: 'Sustancias y compuestos' },
  { id: 'molar', nombre: 'Masa molar' }
]

const RENG_COLOR_ESTADO: Record<RengEstado, string> = {
  sólido: 'var(--estado-solido)',
  líquido: 'var(--estado-liquido)',
  gas: 'var(--estado-gas)',
  desconocido: 'var(--estado-desconocido)'
}

const RENG_NIVELES_PELIGRO = Object.keys(RENG_PELIGROS) as RengNivelPeligro[]
const rengNormalizar = (rengS: string): string => rengS.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function rengColorDe(rengE: RengElemento, rengModo: Exclude<RengModo, 'peligro'>): string {
  if (rengModo === 'categoria') return RENG_CATEGORIAS[rengE.categoria].color
  if (rengModo === 'estado') return RENG_COLOR_ESTADO[rengE.estado]
  const rengT = Math.min(1, rengE.masa / 300)
  return `hsl(${220 - rengT * 200}, 80%, ${58 - rengT * 8}%)`
}

function rengVecino(rengOrigen: RengElemento, rengTecla: string, rengVisibles: readonly RengElemento[]): RengElemento | undefined {
  if (rengTecla === 'Home') return rengVisibles[0]
  if (rengTecla === 'End') return rengVisibles.at(-1)
  const rengVertical = rengTecla === 'ArrowUp' || rengTecla === 'ArrowDown'
  const rengSentido = rengTecla === 'ArrowUp' || rengTecla === 'ArrowLeft' ? -1 : 1
  let rengResultado: RengElemento | undefined
  let rengMenor = Infinity
  for (const rengE of rengVisibles) {
    const rengPrincipal = rengSentido * (rengVertical ? rengE.fila - rengOrigen.fila : rengE.columna - rengOrigen.columna)
    if (rengPrincipal <= 0) continue
    const rengLateral = Math.abs(rengVertical ? rengE.columna - rengOrigen.columna : rengE.fila - rengOrigen.fila)
    const rengDistancia = rengLateral * 20 + rengPrincipal
    if (rengDistancia < rengMenor) {
      rengResultado = rengE
      rengMenor = rengDistancia
    }
  }
  return rengResultado
}

function RengTabla({ alAbrirSustancia: rengAlAbrirSustancia }: { alAbrirSustancia: (rengId: string) => void }): React.JSX.Element {
  const [rengModo, rengSetModo] = useState<RengModo>('categoria')
  const [rengQ, rengSetQ] = useState('')
  const [rengCat, rengSetCat] = useState<RengCategoria | null>(null)
  const [rengFiltroPeligro, rengSetFiltroPeligro] = useState<RengNivelPeligro | null>(null)
  const [rengSel, rengSetSel] = useState<RengElemento>(RENG_ELEMENTOS[0]!)
  const [rengFormasElegidas, rengSetFormasElegidas] = useState<Record<number, string>>({})
  const rengFicha = useRef<HTMLDivElement>(null)

  const rengDatos = useMemo(() => RENG_ELEMENTOS.map((rengE) => {
    const rengFormas = rengFormasDeElemento(rengE.z)
    const rengForma = rengFormas.find((rengF) => rengF.id === rengFormasElegidas[rengE.z]) ?? rengFormas[0]
    return { e: rengE, formas: rengFormas, forma: rengForma, nivel: rengPeligroDeForma(rengForma), radiacion: rengRadioactividadDe(rengE.z) }
  }), [rengFormasElegidas])
  const rengActual = rengDatos[rengSel.z - 1]!

  const rengNq = rengNormalizar(rengQ.trim())
  const rengVisibles = rengDatos.filter(({ e: rengE, nivel: rengNivel }) => {
    if (rengModo === 'categoria' && rengCat && rengE.categoria !== rengCat) return false
    if (rengModo === 'peligro' && rengFiltroPeligro && rengNivel !== rengFiltroPeligro) return false
    return !rengNq || rengNormalizar(rengE.nombre).includes(rengNq) || rengNormalizar(rengE.simbolo) === rengNq || String(rengE.z) === rengNq
  }).map(({ e: rengE }) => rengE)
  const rengVisiblesZ = new Set(rengVisibles.map((rengE) => rengE.z))
  const rengFocoZ = rengVisiblesZ.has(rengSel.z) ? rengSel.z : rengVisibles[0]?.z
  const rengMover = (rengEv: KeyboardEvent<HTMLButtonElement>, rengE: RengElemento): void => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(rengEv.key)) return
    rengEv.preventDefault()
    const rengSiguiente = rengVecino(rengE, rengEv.key, rengVisibles)
    if (rengSiguiente) {
      rengSetSel(rengSiguiente)
      rengEv.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-elemento="${rengSiguiente.z}"]`)?.focus()
    }
  }
  const rengVerFicha = (): void => {
    rengFicha.current?.focus({ preventScroll: true })
    rengFicha.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className="stack pt-elementos">
      <div className="row pt-controles">
        <div className="field pt-busqueda-elemento">
          <label htmlFor="pt-busqueda">Buscar elemento</label>
          <input id="pt-busqueda" className="input" type="search" placeholder="Oro, Fe, 26…" value={rengQ} onChange={(rengE) => rengSetQ(rengE.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pt-color">Colores de la tabla</label>
          <select id="pt-color" className="select" value={rengModo} onChange={(rengE) => rengSetModo(rengE.target.value as RengModo)}>
            <option value="categoria">Colorear por familia</option>
            <option value="estado">Colorear por estado a 25 °C</option>
            <option value="masa">Colorear por masa atómica</option>
            <option value="peligro">Colorear por peligro</option>
          </select>
        </div>
      </div>

      {rengModo === 'peligro' && (
        <div className="stack tight" aria-label="Leyenda de peligros">
          <div className="row pt-leyenda">
            {RENG_NIVELES_PELIGRO.map((rengNivel) => (
              <button key={rengNivel} type="button" className={`pt-leyenda-boton peligro-${rengNivel}`} aria-pressed={rengFiltroPeligro === rengNivel} onClick={() => rengSetFiltroPeligro(rengFiltroPeligro === rengNivel ? null : rengNivel)}>
                <RengSelloPeligro nivel={rengNivel} />
              </button>
            ))}
          </div>
          <p className="faint sm">El color corresponde a la forma elemental indicada en la ficha. El riesgo depende de la cantidad, la concentración y la exposición. ☢ identifica elementos sin isótopos estables según la referencia nuclear.</p>
        </div>
      )}
      {rengModo === 'categoria' && (
        <div className="row pt-leyenda" aria-label="Familias de elementos">
          {(Object.keys(RENG_CATEGORIAS) as RengCategoria[]).map((rengC) => (
            <button key={rengC} type="button" className="badge pt-familia" aria-pressed={rengCat === rengC} onClick={() => rengSetCat(rengCat === rengC ? null : rengC)}>
              <i aria-hidden="true" style={{ background: RENG_CATEGORIAS[rengC].color }} /> {RENG_CATEGORIAS[rengC].nombre}
            </button>
          ))}
        </div>
      )}
      {rengModo === 'estado' && (
        <div className="row pt-leyenda" aria-label="Estados a 25 °C">
          {(Object.keys(RENG_COLOR_ESTADO) as RengEstado[]).map((rengEstado) => (
            <span key={rengEstado} className="badge pt-familia">
              <i aria-hidden="true" style={{ background: RENG_COLOR_ESTADO[rengEstado] }} /> {rengEstado}
            </span>
          ))}
        </div>
      )}
      {rengModo === 'masa' && <span className="badge">Azul para menor masa y rojo para mayor masa (0 a 300 u)</span>}
      {rengVisibles.length !== RENG_ELEMENTOS.length && <p role="status" className="faint sm">{rengVisibles.length === 0 ? 'No se encontraron elementos con esos filtros.' : `${rengVisibles.length} de ${RENG_ELEMENTOS.length} elementos coinciden.`}</p>}

      <div className="pt-marco" role="region" aria-label="Cuadrícula de los 118 elementos">
        <div className="pt-grid">
          {rengDatos.map(({ e: rengE, forma: rengForma, nivel: rengNivel, radiacion: rengRadiacion }) => {
            const rengColorPeligro = rengModo === 'peligro'
            const rengAlcance = rengColorPeligro ? ` · ${rengForma?.nombre ?? rengE.nombre} · ${RENG_PELIGROS[rengNivel].nombre}` : ''
            const rengEtiqueta = `${rengE.nombre}, número atómico ${rengE.z}${rengAlcance}${rengRadiacion ? ' · Sin isótopos estables' : ''}`
            return (
              <button
                key={rengE.z}
                type="button"
                data-elemento={rengE.z}
                className={`pt-cell${rengVisiblesZ.has(rengE.z) ? '' : ' dim'}${rengColorPeligro ? ` peligro-${rengNivel}` : ''}`}
                style={{ gridRow: rengE.fila, gridColumn: rengE.columna, ...(rengModo === 'peligro' ? {} : { background: rengColorDe(rengE, rengModo), color: 'var(--tabla-tinta)' }) }}
                onClick={() => rengSetSel(rengE)}
                onKeyDown={(rengEv) => rengMover(rengEv, rengE)}
                title={rengEtiqueta}
                aria-label={rengEtiqueta}
                aria-pressed={rengSel.z === rengE.z}
                tabIndex={rengFocoZ === rengE.z ? 0 : -1}
              >
                <span className="pt-celda-cabecera">
                  <small>{rengE.z}</small>
                  {rengColorPeligro && <b aria-hidden="true">{RENG_PELIGROS[rengNivel].marca}</b>}
                  {rengRadiacion && <b className="pt-marca-radiacion" aria-hidden="true">☢</b>}
                </span>
                <strong>{rengE.simbolo}</strong>
                <span>{rengE.nombre}</span>
              </button>
            )
          })}
          <div className="pt-rango" style={{ gridRow: 6, gridColumn: 3 }}>57–71</div>
          <div className="pt-rango" style={{ gridRow: 7, gridColumn: 3 }}>89–103</div>
          <div className="pt-separador" aria-hidden="true" />
          <div className="card pt-resumen">
            <div className="pt-simbolo">
              <span className="faint sm">Z = {rengSel.z}</span>
              <strong>{rengSel.simbolo}</strong>
            </div>
            <div className="pt-resumen-texto">
              <h2>{rengSel.nombre}</h2>
              <span className="faint sm">{RENG_CATEGORIAS[rengSel.categoria].nombre} · {rengSel.estado}</span>
              {rengModo === 'peligro' && (
                <div className="pt-resumen-peligro">
                  <RengSelloPeligro nivel={rengActual.nivel} compacto />
                  <span className="faint sm">{rengActual.forma?.nombre ?? 'Forma sin documentar'}</span>
                </div>
              )}
            </div>
            <button type="button" className="btn sm" onClick={rengVerFicha} aria-controls="pt-ficha-elemento">Ver ficha</button>
          </div>
        </div>
      </div>

      <div id="pt-ficha-elemento" ref={rengFicha} tabIndex={-1}>
        <RengFichaElemento
          el={rengSel}
          formas={rengActual.formas}
          forma={rengActual.forma}
          alElegirForma={(rengId) => rengSetFormasElegidas((rengPrev) => ({ ...rengPrev, [rengSel.z]: rengId }))}
          alAbrirSustancia={rengAlAbrirSustancia}
        />
      </div>
      <p className="faint sm">Clasificación periódica convencional. Las propiedades de los elementos superpesados tienen una cobertura experimental limitada.</p>
    </div>
  )
}

function RengMolar(): React.JSX.Element {
  const [rengF, rengSetF] = useState('Ca(OH)2')
  const rengRes = useMemo(() => {
    try {
      return { ok: rengMasaMolar(rengF), err: '' }
    } catch (rengE) {
      return { ok: null, err: rengE instanceof Error ? rengE.message : 'Fórmula no válida.' }
    }
  }, [rengF])

  return (
    <div className="stack pt-molar">
      <div className="field">
        <label htmlFor="pt-formula">Fórmula química</label>
        <input id="pt-formula" className="input mono" value={rengF} onChange={(rengE) => rengSetF(rengE.target.value)} placeholder="H2SO4, Al2(SO4)3, CuSO4·5H2O" />
        <span className="faint sm">Admite paréntesis, corchetes e hidratos con «·» o «.».</span>
      </div>
      {rengRes.err && <div className="notice err" role="status">{rengRes.err}</div>}
      {rengRes.ok && (
        <div className="card pt-molar-resultado">
          <div className="pt-molar-total">
            {rengRes.ok.total.toFixed(3)} <span className="muted">g/mol</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Elemento</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Aporte (g/mol)</th>
                <th scope="col">% en masa</th>
              </tr>
            </thead>
            <tbody>
              {rengRes.ok.desglose.map((rengD) => (
                <tr key={rengD.simbolo}>
                  <td>{rengD.simbolo}</td>
                  <td>{rengD.cantidad}</td>
                  <td className="mono">{rengD.masa.toFixed(3)}</td>
                  <td className="mono">{((rengD.masa / (rengRes.ok?.total ?? 1)) * 100).toFixed(2)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function RengView(): React.JSX.Element {
  const [rengTab, rengSetTab] = useState<RengVista>('elementos')
  const [rengSustancia, rengSetSustancia] = useState<string | null>(null)
  const rengAbrirSustancia = (rengId: string): void => {
    rengSetSustancia(rengId)
    rengSetTab('sustancias')
    document.getElementById('tabla-periodica-tab-sustancias')?.focus()
  }

  return (
    <div className="stack pt-modulo">
      <RengDestinos etiqueta="Tabla periódica interactiva" idBase="tabla-periodica" valor={rengTab} items={RENG_VISTAS} onCambio={rengSetTab} />
      <div role="tabpanel" id="tabla-periodica-panel-elementos" aria-labelledby="tabla-periodica-tab-elementos" hidden={rengTab !== 'elementos'}>
        <RengTabla alAbrirSustancia={rengAbrirSustancia} />
      </div>
      <div role="tabpanel" id="tabla-periodica-panel-sustancias" aria-labelledby="tabla-periodica-tab-sustancias" hidden={rengTab !== 'sustancias'}>
        <RengSustancias seleccion={rengSustancia} onSeleccion={rengSetSustancia} />
      </div>
      <div role="tabpanel" id="tabla-periodica-panel-molar" aria-labelledby="tabla-periodica-tab-molar" hidden={rengTab !== 'molar'}>
        <RengMolar />
      </div>
    </div>
  )
}
