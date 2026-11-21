import { useMemo } from 'react'
import { RengIcon } from '@/shell/Icon'
import { rengSustanciasRelacionadas } from './catalogoSustancias'
import { RENG_CATEGORIAS, rengCapas, rengConfiguracion, type RengElemento } from './data'
import { rengExtraDe, RENG_FUENTE_DATOS, rengTextoAnio, rengTextoDensidad, rengTextoTemperatura, rengVerificacionDe, type RengMagnitud } from './datosElementos'
import { RENG_FUENTE_RADIOACTIVIDAD, rengPeligroDeForma, rengRadioactividadDe, type RengFormaPeligro } from './peligros'
import { RENG_CONSULTA_PROPIEDADES, rengPropiedadesAdicionales } from './propiedadesReferencia'
import { RengFichaPeligros, RengFuenteEnlazable, RengFuentesPeligro, RengSelloPeligro } from './Sustancias'

const rengComa = (rengX: number, rengDecimales = 2): string => rengX.toFixed(rengDecimales).replace('.', ',')

function RengSello({ magnitud: rengMagnitud }: { magnitud?: RengMagnitud }): React.JSX.Element | null {
  if (!rengMagnitud) return null
  const rengConReferencia = rengVerificacionDe(rengMagnitud) === 'wikidata-con-referencia'
  return <span className="badge media">{rengConReferencia ? 'Algún valor tiene cita en Wikidata' : 'Wikidata · sin referencia'}</span>
}

function RengBohr({ z: rengZ }: { z: number }): React.JSX.Element {
  const rengOcupacion = rengCapas(rengZ)
  const rengPaso = Math.min(18, 86 / Math.max(rengOcupacion.length, 1))
  return (
    <svg className="pt-bohr" viewBox="-110 -110 220 220" width="100%" role="img" aria-label={`Modelo de Bohr. Electrones por capa: ${rengOcupacion.join(', ')}`}>
      <circle r="12" fill="var(--danger)" />
      <text y="4" textAnchor="middle" fontSize="10" fill="var(--accent-ink)" fontWeight="700">{rengZ}p</text>
      {rengOcupacion.map((rengN, rengI) => {
        const rengRadio = 26 + rengI * rengPaso
        return (
          <g key={rengI}>
            <circle r={rengRadio} fill="none" stroke="var(--border-strong)" strokeDasharray="2 3" />
            <g className="orbit" style={{ animationDuration: `${6 + rengI * 3}s`, animationDirection: rengI % 2 ? 'reverse' : 'normal' }}>
              {Array.from({ length: rengN }, (_, rengK) => {
                const rengAngulo = (2 * Math.PI * rengK) / rengN
                return <circle key={rengK} cx={rengRadio * Math.cos(rengAngulo)} cy={rengRadio * Math.sin(rengAngulo)} r="3.3" fill="var(--accent)" />
              })}
            </g>
          </g>
        )
      })}
    </svg>
  )
}

interface RengProps {
  el: RengElemento
  formas: readonly RengFormaPeligro[]
  forma?: RengFormaPeligro
  alElegirForma: (rengId: string) => void
  alAbrirSustancia: (rengId: string) => void
}

export function RengFichaElemento({ el: rengEl, formas: rengFormas, forma: rengForma, alElegirForma: rengAlElegirForma, alAbrirSustancia: rengAlAbrirSustancia }: RengProps): React.JSX.Element {
  const rengDatos = rengExtraDe(rengEl.z, rengEl.estado)
  const rengPropiedades = rengPropiedadesAdicionales(rengEl.z)
  const rengRadiacion = rengRadioactividadDe(rengEl.z)
  const rengRelacionadas = useMemo(() => rengSustanciasRelacionadas(rengEl.simbolo), [rengEl.simbolo])
  const rengTextoMasa = rengEl.masaAproximada ? `[${rengEl.masa}]` : `${rengComa(rengEl.masa, rengEl.masa < 100 ? 3 : 2)} u`
  const rengValoresWikidata = [
    { nombre: 'Fusión', magnitud: rengDatos.fusionK, unidad: 'K' },
    { nombre: 'Ebullición', magnitud: rengDatos.ebullicionK, unidad: 'K' },
    { nombre: 'Densidad', magnitud: rengDatos.densidadKgM3, unidad: 'kg/m³' }
  ].filter(({ magnitud: rengMagnitud }) => rengMagnitud)

  return (
    <section className="card stack pt-ficha" aria-labelledby="pt-ficha-titulo">
      <header className="row pt-ficha-cabecera">
        <div>
          <p className="faint sm">Ficha del elemento</p>
          <h3 id="pt-ficha-titulo">{rengEl.nombre} <span className="faint">({rengEl.simbolo})</span></h3>
          <p className="faint sm">Z = {rengEl.z} · {RENG_CATEGORIAS[rengEl.categoria].nombre} · {rengEl.masaAproximada ? 'Número de masa' : 'Masa atómica'} {rengTextoMasa}</p>
        </div>
        <RengSelloPeligro nivel={rengPeligroDeForma(rengForma)} />
      </header>

      <details className="panel-seccion">
        <summary>Identidad y propiedades</summary>
        <div className="pt-identidad">
          <dl className="kv pt-identidad-lista">
            <dt>Número atómico</dt>
            <dd>{rengEl.z}</dd>
            <dt>Familia</dt>
            <dd>{RENG_CATEGORIAS[rengEl.categoria].nombre}</dd>
            <dt>Período y grupo</dt>
            <dd>{rengEl.periodo} · {rengEl.grupo ?? 'bloque f'}</dd>
            <dt>Estado a 25 °C</dt>
            <dd>{rengEl.estado}</dd>
            <dt>{rengEl.masaAproximada ? 'Número de masa representativo' : 'Masa atómica tabulada'}</dt>
            <dd>{rengTextoMasa}</dd>
            <dt>Configuración electrónica</dt>
            <dd>{rengConfiguracion(rengEl.z)} <span className="badge media">Calculada</span></dd>
            <dt>Electrones por capa</dt>
            <dd>{rengCapas(rengEl.z).join(' · ')}</dd>
            {rengPropiedades.electronegatividad !== undefined && (
              <><dt>Electronegatividad (Pauling)</dt><dd>{rengPropiedades.electronegatividad.toLocaleString('es')}</dd></>
            )}
            {rengPropiedades.oxidacion && <><dt>Estados de oxidación tabulados</dt><dd>{rengPropiedades.oxidacion}</dd></>}
            <dt>Fusión</dt>
            <dd>{rengTextoTemperatura(rengDatos.fusionK)} <RengSello magnitud={rengDatos.fusionK} /></dd>
            <dt>Ebullición</dt>
            <dd>{rengTextoTemperatura(rengDatos.ebullicionK)} <RengSello magnitud={rengDatos.ebullicionK} /></dd>
            <dt>Densidad</dt>
            <dd>{rengTextoDensidad(rengDatos.densidadKgM3)} <RengSello magnitud={rengDatos.densidadKgM3} /></dd>
            <dt>Descubrimiento</dt>
            <dd>{rengTextoAnio(rengDatos.anioDescubrimiento)}{rengDatos.descubridores ? ` · ${rengDatos.descubridores}` : ''}</dd>
            {rengPropiedades.usos && <><dt>Usos documentados</dt><dd>{rengPropiedades.usos}</dd></>}
          </dl>
          <figure className="pt-bohr-figura">
            <RengBohr z={rengEl.z} />
            <figcaption className="faint sm">Modelo de Bohr · esquema de capas</figcaption>
          </figure>
        </div>
      </details>

      <details className="panel-seccion" open>
        <summary>Peligros de la forma seleccionada</summary>
        <div className="stack tight pt-detalle-contenido">
          {rengFormas.length > 1 ? (
            <div className="field pt-forma">
              <label htmlFor="pt-forma-elemento">Forma elemental</label>
              <select id="pt-forma-elemento" className="select" value={rengForma?.id ?? ''} onChange={(rengEv) => rengAlElegirForma(rengEv.target.value)}>
                {rengFormas.map((rengF, rengI) => <option key={rengF.id} value={rengF.id}>{rengF.nombre}{rengI === 0 ? ' · referencia de la tabla' : ''}</option>)}
              </select>
            </div>
          ) : <p className="sm"><b>Forma de referencia</b> · {rengForma?.nombre ?? 'Sin especificar'}</p>}
          {rengForma?.condicion && <p className="faint sm">{rengForma.condicion}</p>}
          <RengFichaPeligros forma={rengForma} />
          {rengRadiacion && (
            <p className="notice pt-aviso-radiacion sm">
              <span aria-hidden="true">☢</span> <b>Propiedad nuclear.</b> {rengRadiacion}
            </p>
          )}
        </div>
      </details>

      <details className="panel-seccion">
        <summary>Fuentes y alcance</summary>
        <div className="stack tight pt-detalle-contenido">
          <RengFuentesPeligro forma={rengForma} />
          {rengRadiacion && <RengFuenteEnlazable nombre="IUPAC · Tabla periódica de los isótopos" url={RENG_FUENTE_RADIOACTIVIDAD} />}
          {rengPropiedades.fuente && (
            <div className="stack tight">
              <RengFuenteEnlazable nombre="PubChem · Propiedades tabuladas del elemento" url={rengPropiedades.fuente} />
              <p className="faint sm">Consultado el {RENG_CONSULTA_PROPIEDADES}.{rengEl.z >= 104 ? ' Los valores tabulados de los elementos superpesados pueden ser predichos.' : ''}</p>
            </div>
          )}
          <p className="faint sm">{RENG_FUENTE_DATOS.fuente} · {RENG_FUENTE_DATOS.licencia} · obtenido el {RENG_FUENTE_DATOS.obtenido}. {RENG_FUENTE_DATOS.nota}</p>
          {rengValoresWikidata.length > 0 && (
            <ul className="sm pt-fuentes-valores">
              {rengValoresWikidata.map(({ nombre: rengNombre, magnitud: rengMagnitud, unidad: rengUnidad }) => (
                <li key={rengNombre}><b>{rengNombre}</b> · {rengMagnitud?.valores.map((rengV) => rengV.toLocaleString('es', { maximumSignificantDigits: 8 })).join(' · ')} {rengUnidad} <RengSello magnitud={rengMagnitud} /></li>
              ))}
            </ul>
          )}
          <p className="faint sm">La app conserva sus valores de masa tabulados sin cita individual. Los corchetes indican un número de masa, que es un conteo de nucleones sin unidad.</p>
          <p className="faint sm">La configuración electrónica se calcula con el principio de Aufbau y excepciones conocidas. Las propiedades de los elementos superpesados tienen cobertura experimental limitada.</p>
          {rengDatos.avisos?.map((rengAviso) => <p key={rengAviso} className="sm"><RengIcon name="alert" size={14} /> {rengAviso}</p>)}
          {rengDatos.densidadKgM3?.nota && <p className="faint sm">{rengDatos.densidadKgM3.nota}</p>}
        </div>
      </details>

      {rengRelacionadas.length > 0 && (
        <details className="panel-seccion">
          <summary>Sustancias y compuestos relacionados ({rengRelacionadas.length})</summary>
          <div className="row pt-relacionadas">
            {rengRelacionadas.map(({ id: rengId, nombre: rengNombre, formula: rengFormula }) => (
              <button key={rengId} type="button" className="btn sm" onClick={() => rengAlAbrirSustancia(rengId)}>
                {rengNombre} <span className="faint">{rengFormula}</span>
              </button>
            ))}
          </div>
        </details>
      )}
    </section>
  )
}
