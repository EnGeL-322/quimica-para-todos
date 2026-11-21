import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { rengDibujo2D } from '../simulador-quimica/nucleo/molecula'
import { rengBuscarSustancias, rengCoberturaSustancias, RENG_SUSTANCIAS, type RengSustanciaCatalogo } from './catalogoSustancias'
import { RENG_PELIGROS, rengPeligroDeForma, RENG_TIPO_PELIGRO, type RengFormaPeligro, type RengNivelPeligro, type RengTipoPeligro } from './peligros'
import rengGhs01 from './pictogramas/GHS01.png'
import rengGhs02 from './pictogramas/GHS02.png'
import rengGhs03 from './pictogramas/GHS03.png'
import rengGhs04 from './pictogramas/GHS04.png'
import rengGhs05 from './pictogramas/GHS05.png'
import rengGhs06 from './pictogramas/GHS06.png'
import rengGhs07 from './pictogramas/GHS07.png'
import rengGhs08 from './pictogramas/GHS08.png'
import rengGhs09 from './pictogramas/GHS09.png'
import './sustancias.css'

const RENG_GRUPOS = [
  ['fisicos', 'Peligros físicos'],
  ['salud', 'Peligros para la salud'],
  ['ambiente', 'Peligros para el ambiente']
] as const

const RENG_ORIGEN = {
  icsc: 'Ficha internacional de seguridad química (ICSC)',
  armonizada: 'Clasificación armonizada de la UE',
  notificada: 'Clasificación notificada por la industria',
  fds: 'Ficha de datos de seguridad del producto (FDS)'
}

const RENG_OSHA = 'https://www.osha.gov/hazcom/pictograms'
const RENG_PICTOGRAMAS: Readonly<Record<string, readonly [url: string, nombre: string]>> = {
  GHS01: [rengGhs01, 'Bomba explotando'],
  GHS02: [rengGhs02, 'Llama'],
  GHS03: [rengGhs03, 'Llama sobre un círculo'],
  GHS04: [rengGhs04, 'Botella de gas'],
  GHS05: [rengGhs05, 'Corrosión'],
  GHS06: [rengGhs06, 'Calavera y tibias cruzadas'],
  GHS07: [rengGhs07, 'Signo de exclamación'],
  GHS08: [rengGhs08, 'Peligro grave para la salud'],
  GHS09: [rengGhs09, 'Medio ambiente']
}

const rengFormatoMasa = new Intl.NumberFormat('es', { maximumFractionDigits: 3 })

export function RengSelloPeligro({ nivel: rengNivel, compacto: rengCompacto = false }: { nivel: RengNivelPeligro; compacto?: boolean }): React.JSX.Element {
  const { nombre: rengNombre, corto: rengCorto, marca: rengMarca } = RENG_PELIGROS[rengNivel]
  return (
    <span className={`badge pt-sello pt-sello-peligro peligro-${rengNivel}`} title={rengNombre}>
      <span aria-hidden="true">{rengMarca}</span>
      {rengCompacto ? <><span aria-hidden="true">{rengCorto}</span><span className="sr-only">{rengNombre}</span></> : rengNombre}
    </span>
  )
}

export function RengFuenteEnlazable({ url: rengUrl, nombre: rengNombre }: { url: string; nombre: string }): React.JSX.Element {
  const [rengEstado, rengSetEstado] = useState('')

  const rengCopiar = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(rengUrl)
      rengSetEstado('Enlace copiado.')
    } catch {
      rengSetEstado('Selecciona la dirección para copiarla manualmente.')
    }
  }

  return (
    <div className="pt-enlace-fuente">
      <span className="mono pt-url">{rengUrl}</span>
      <button type="button" className="btn sm" onClick={() => void rengCopiar()} aria-label={`Copiar enlace de ${rengNombre}`}>
        Copiar enlace
      </button>
      {rengEstado && <span className="faint sm" role="status">{rengEstado}</span>}
    </div>
  )
}

export function RengFichaPeligros({ forma: rengForma }: { forma?: RengFormaPeligro | null }): React.JSX.Element {
  if (!rengForma) return <p className="muted">Selecciona una forma de la sustancia para consultar sus peligros.</p>
  if (rengForma.registros.length === 0) {
    return <p className="muted">Falta una ficha verificable para esta forma. Su clasificación queda pendiente.</p>
  }

  return (
    <div className="stack pt-peligros-registros">
      {rengForma.registros.length > 1 && (
        <p className="sm muted">La primera fuente determina el color. Los registros se muestran por separado con las condiciones de cada fuente.</p>
      )}
      {rengForma.registros.map(({ fuente: rengFuente, nivel: rengNivel, indicaciones: rengIndicaciones, pictogramas: rengPictogramas }, rengI) => (
        <section className="pt-peligros-registro stack tight" key={`${rengFuente.url}-${rengFuente.alcance}`} aria-label={`${rengFuente.organismo}, ${rengFuente.alcance}`}>
          <div className="row">
            <RengSelloPeligro nivel={rengNivel} />
            <span className="sm muted">{rengFuente.organismo}{rengForma.registros.length > 1 && rengI === 0 ? ' · fuente del color' : ''}</span>
          </div>
          <p className="sm muted">{rengFuente.alcance}</p>
          {!!rengPictogramas?.length && (
            <ul className="pt-pictogramas" aria-label="Pictogramas documentados">
              {rengPictogramas.map((rengCodigo) => {
                const rengIcono = RENG_PICTOGRAMAS[rengCodigo]
                return (
                  <li key={rengCodigo}>
                    {rengIcono && <img src={rengIcono[0]} alt="" width="42" height="42" loading="lazy" />}
                    <span>{rengIcono?.[1] ?? rengCodigo}</span>
                    {rengIcono && <span className="faint mono">{rengCodigo}</span>}
                  </li>
                )
              })}
            </ul>
          )}
          {RENG_GRUPOS.map(([rengGrupo, rengTitulo]) => {
            const rengItems = rengIndicaciones.filter((rengD) => RENG_TIPO_PELIGRO[rengD.tipo].grupo === rengGrupo)
            if (rengItems.length === 0) return null
            return (
              <div key={rengGrupo}>
                <h4 className="pt-peligro-subtitulo">{rengTitulo}</h4>
                <ul className="pt-indicaciones">
                  {rengItems.map((rengD) => (
                    <li key={`${rengD.tipo}-${rengD.codigo ?? rengD.descripcion}`}>
                      {rengD.codigo && <span className="badge mono">{rengD.codigo}</span>} {rengD.descripcion}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </section>
      ))}
    </div>
  )
}

export function RengFuentesPeligro({ forma: rengForma }: { forma?: RengFormaPeligro | null }): React.JSX.Element {
  if (!rengForma?.registros.length) return <p className="muted">Las fuentes de peligro aparecen cuando se selecciona una forma documentada.</p>
  return (
    <div className="stack pt-fuentes">
      {rengForma.registros.map(({ fuente: rengFuente }) => (
        <section key={`${rengFuente.url}-${rengFuente.alcance}`} className="pt-fuente stack tight">
          <h4 className="pt-peligro-subtitulo">{rengFuente.organismo}</h4>
          <p className="sm muted">{RENG_ORIGEN[rengFuente.tipo]}</p>
          <dl className="kv pt-ficha-kv">
            <dt>Forma evaluada</dt><dd>{rengFuente.alcance}</dd>
            <dt>Revisión de la fuente</dt><dd>{rengFuente.revision || 'No indicada'}</dd>
            <dt>Consulta</dt><dd>{rengFuente.consulta}</dd>
          </dl>
          <RengFuenteEnlazable url={rengFuente.url} nombre={rengFuente.organismo} />
        </section>
      ))}
      {rengForma.registros.some((rengR) => rengR.pictogramas?.length) && (
        <section className="pt-fuente stack tight">
          <h4 className="pt-peligro-subtitulo">Imágenes de pictogramas · OSHA</h4>
          <p className="sm muted">Dominio público. Cada pictograma se muestra cuando consta en la ficha de la sustancia.</p>
          <RengFuenteEnlazable url={RENG_OSHA} nombre="los pictogramas de OSHA" />
        </section>
      )}
    </div>
  )
}

function RengEstructura({ smiles: rengSmiles, nombre: rengNombre }: { smiles: string; nombre: string }): React.JSX.Element | null {
  const rengSrc = useMemo(() => {
    try {
      return `data:image/svg+xml,${encodeURIComponent(rengDibujo2D(rengSmiles, 260, 160))}`
    } catch {
      return null
    }
  }, [rengSmiles])

  if (!rengSrc) return null
  return (
    <figure className="pt-estructura">
      <img src={rengSrc} alt={`Estructura 2D de ${rengNombre}`} width="260" height="160" loading="lazy" />
      <figcaption className="faint sm">Representación calculada a partir de la estructura del catálogo.</figcaption>
    </figure>
  )
}

function RengSustanciaDetalle({ sustancia: rengSustancia, formaElegida: rengFormaElegida, onForma: rengOnForma, onCerrar: rengOnCerrar, titulo: rengTitulo }: { sustancia: RengSustanciaCatalogo; formaElegida?: string; onForma: (rengId: string) => void; onCerrar: () => void; titulo: React.RefObject<HTMLHeadingElement | null> }): React.JSX.Element {
  const rengForma = rengSustancia.formas.length === 1 ? rengSustancia.formas[0] : rengSustancia.formas.find((rengF) => rengF.id === rengFormaElegida)
  const rengId = useId()
  return (
    <article className="card stack pt-sustancia-ficha" aria-labelledby={rengId}>
      <header className="stack tight">
        <div className="row pt-sustancia-titulo">
          <h3 id={rengId} ref={rengTitulo} tabIndex={-1}>{rengSustancia.nombre}</h3>
          <button type="button" className="btn ghost sm" onClick={rengOnCerrar}>Volver a resultados</button>
        </div>
        <p className="muted sm"><span className="mono">{rengSustancia.formula}</span> · {rengSustancia.categoria}</p>
        {rengSustancia.formas.length > 1 && (
          <label className="field">
            <span className="label">Forma o concentración</span>
            <select className="select" value={rengForma?.id ?? ''} onChange={(rengEv) => rengOnForma(rengEv.target.value)}>
              <option value="">Elige la forma que corresponde</option>
              {rengSustancia.formas.map((rengF) => <option key={rengF.id} value={rengF.id}>{rengF.nombre}{rengF.condicion ? ` · ${rengF.condicion}` : ''}</option>)}
            </select>
          </label>
        )}
        {rengForma && (
          <div className="row">
            <RengSelloPeligro nivel={rengPeligroDeForma(rengForma)} />
            <span className="sm muted">{rengForma.nombre}{rengForma.condicion ? ` · ${rengForma.condicion}` : ''}</span>
          </div>
        )}
      </header>
      <details className="pt-sustancia-seccion" open>
        <summary>Peligros</summary>
        <RengFichaPeligros forma={rengForma} />
      </details>
      <details className="pt-sustancia-seccion">
        <summary>Identidad y propiedades</summary>
        <dl className="kv pt-ficha-kv">
          <dt>Fórmula</dt><dd className="mono">{rengSustancia.formula}</dd>
          {rengSustancia.masaMolar !== undefined && <><dt>Masa molar calculada</dt><dd>{rengFormatoMasa.format(rengSustancia.masaMolar)} g/mol</dd></>}
          {rengSustancia.sinonimos.length > 0 && <><dt>Sinónimos</dt><dd>{rengSustancia.sinonimos.join(', ')}</dd></>}
          {rengSustancia.elementos.length > 0 && <><dt>Elementos</dt><dd>{rengSustancia.elementos.join(', ')}</dd></>}
          {rengForma?.cas && <><dt>Número CAS</dt><dd className="mono">{rengForma.cas}</dd></>}
        </dl>
        {rengSustancia.smiles && <RengEstructura smiles={rengSustancia.smiles} nombre={rengSustancia.nombre} />}
      </details>
      <details className="pt-sustancia-seccion">
        <summary>Fuentes</summary>
        {rengSustancia.fuenteIdentidad && <p className="sm muted">Identidad del catálogo · {rengSustancia.fuenteIdentidad}</p>}
        <RengFuentesPeligro forma={rengForma} />
      </details>
    </article>
  )
}

interface RengPropsSustancias {
  seleccion: string | null
  onSeleccion: (rengId: string | null) => void
}

export function RengSustancias({ seleccion: rengSeleccion, onSeleccion: rengOnSeleccion }: RengPropsSustancias): React.JSX.Element {
  const [rengConsulta, rengSetConsulta] = useState('')
  const [rengTipo, rengSetTipo] = useState<RengTipoPeligro | ''>('')
  const [rengFormas, rengSetFormas] = useState<Partial<Record<string, string>>>({})
  const rengCampo = useRef<HTMLInputElement>(null)
  const rengTitulo = useRef<HTMLHeadingElement>(null)
  const rengSeleccionada = RENG_SUSTANCIAS.find((rengS) => rengS.id === rengSeleccion)
  const rengResultados = useMemo(() => rengBuscarSustancias(rengConsulta, rengTipo || undefined), [rengConsulta, rengTipo])
  const rengCobertura = useMemo(rengCoberturaSustancias, [])

  const rengBuscar = (rengTexto: string): void => {
    rengSetConsulta(rengTexto)
    if (rengSeleccion) rengOnSeleccion(null)
  }

  const rengFiltrar = (rengPeligro: RengTipoPeligro | ''): void => {
    rengSetTipo(rengPeligro)
    if (rengSeleccion) rengOnSeleccion(null)
  }

  useEffect(() => {
    if (rengSeleccionada) rengTitulo.current?.focus()
  }, [rengSeleccionada])

  return (
    <section className="pt-sustancias stack" aria-label="Catálogo de sustancias y compuestos">
      <header className="stack tight">
        <h2>Sustancias y compuestos</h2>
        <p className="muted">Busca una sustancia y consulta los peligros de la forma o concentración que te interesa.</p>
      </header>
      <div className="pt-sustancias-controles">
        <label className="field">
          <span className="label">Buscar sustancia</span>
          <input ref={rengCampo} className="input" type="search" value={rengConsulta} onChange={(rengEv) => rengBuscar(rengEv.target.value)} placeholder="Nombre, sinónimo, fórmula o número CAS" />
        </label>
        <label className="field">
          <span className="label">Tipo de peligro</span>
          <select className="select" value={rengTipo} onChange={(rengEv) => rengFiltrar(rengEv.target.value as RengTipoPeligro | '')}>
            <option value="">Todos los tipos</option>
            {RENG_GRUPOS.map(([rengGrupo, rengNombre]) => (
              <optgroup key={rengGrupo} label={rengNombre}>
                {(Object.keys(RENG_TIPO_PELIGRO) as RengTipoPeligro[]).filter((rengT) => RENG_TIPO_PELIGRO[rengT].grupo === rengGrupo).map((rengT) => <option key={rengT} value={rengT}>{RENG_TIPO_PELIGRO[rengT].nombre}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
      </div>
      <p className="sm muted">Cobertura · {rengCobertura.total} en el catálogo · {rengCobertura.verificadas} con ficha verificada · {rengCobertura.parciales} con información parcial · {rengCobertura.pendientes} pendientes.</p>
      <div className="pt-sustancias-layout">
        <div className="stack tight pt-resultados">
          <p role="status" className="faint sm">{rengResultados.length === 1 ? '1 resultado' : `${rengResultados.length} resultados`}{rengConsulta.trim() && rengResultados.length > 1 ? ' · selecciona la sustancia que corresponde' : ''}</p>
          {rengResultados.length === 0 && <p className="notice">No hay coincidencias. Prueba otro nombre, fórmula o tipo de peligro.</p>}
          {rengResultados.length > 0 && (
            <ul className="pt-resultados-lista" aria-label="Resultados de sustancias">
              {rengResultados.map((rengS) => {
                const rengForma = rengS.formas.length === 1 ? rengS.formas[0] : rengS.formas.find((rengF) => rengF.id === rengFormas[rengS.id])
                const rengCoincideOtraForma = rengTipo && rengForma && !rengForma.registros.some((rengR) => rengR.indicaciones.some((rengD) => rengD.tipo === rengTipo))
                return (
                  <li key={rengS.id}>
                    <button type="button" className="pt-sustancia-resultado" aria-current={rengS.id === rengSeleccionada?.id ? 'true' : undefined} onClick={() => rengOnSeleccion(rengS.id)}>
                      <strong>{rengS.nombre}</strong>
                      <span className="mono">{rengS.formula}</span>
                      {rengCoincideOtraForma ? <span className="badge">El filtro coincide en otra forma</span> : rengForma ? (
                        <><span className="faint sm">{rengForma.nombre}{rengForma.condicion ? ` · ${rengForma.condicion}` : ''}</span><RengSelloPeligro nivel={rengPeligroDeForma(rengForma)} compacto /></>
                      ) : rengS.formas.length > 1 ? <span className="badge">Varias formas · elige una</span> : <RengSelloPeligro nivel="insuficiente" compacto />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        {rengSeleccionada ? (
          <RengSustanciaDetalle
            key={rengSeleccionada.id}
            sustancia={rengSeleccionada}
            formaElegida={rengFormas[rengSeleccionada.id]}
            onForma={(rengId) => rengSetFormas((rengActual) => ({ ...rengActual, [rengSeleccionada.id]: rengId }))}
            onCerrar={() => { rengOnSeleccion(null); rengCampo.current?.focus() }}
            titulo={rengTitulo}
          />
        ) : (
          <div className="card stack tight pt-sustancia-vacia">
            <h3>Selecciona una sustancia</h3>
            <p className="muted">Aquí verás su ficha y las condiciones que respaldan la clasificación. El riesgo depende de la cantidad, concentración, vía de exposición y duración.</p>
          </div>
        )}
      </div>
    </section>
  )
}
