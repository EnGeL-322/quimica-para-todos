import { useMemo, useState } from 'react'
import type { RengCorrida, RengMedicion, RengProyecto, RengSerie } from '@shared/cuaderno'
import { rengAptitudComparacion, rengAvisosProcedencia, rengComparar, rengExtraerXY } from '@/lib/cuaderno/comparar'
import { RengNotice } from '@/shell/ui'
import { RengGraficaComparacion } from './GraficaComparacion'

type RengEntrada = RengCorrida | RengMedicion
const rengFmt = (rengV: number): string => (Math.abs(rengV) >= 1e-3 && Math.abs(rengV) < 1e6) || rengV === 0 ? Number(rengV.toPrecision(4)).toLocaleString('es') : rengV.toExponential(3).replace('.', ',')
const rengEtiquetaEntrada = (rengE: RengEntrada): string => `${rengE.tipo === 'corrida' ? (rengE.estado === 'aproximacion' ? 'Corrida (aproximación)' : 'Corrida') : rengE.sintetica ? 'Medición SINTÉTICA' : 'Medición'} · ${rengE.nombre}`

const rengYPorDefecto = (rengS: RengSerie, rengX: string): string => rengS.columnas.find((rengC) => rengC.clave !== rengX)?.clave ?? rengX

function RengSelector({ titulo: rengTitulo, entradas: rengEntradas, valor: rengValor, onCambio: rengOnCambio, x: rengX, y: rengY, onX: rengOnX, onY: rengOnY }: { titulo: string; entradas: RengEntrada[]; valor: string; onCambio: (rengId: string) => void; x: string; y: string; onX: (rengK: string) => void; onY: (rengK: string) => void }): React.JSX.Element {
  const rengE = rengEntradas.find((rengZ) => rengZ.id === rengValor)
  return (
    <fieldset className="cuaderno-selector">
      <legend className="label">{rengTitulo}</legend>
      <select className="input" value={rengValor} onChange={(rengEv) => rengOnCambio(rengEv.target.value)} aria-label={rengTitulo}>
        {rengEntradas.map((rengZ) => (
          <option key={rengZ.id} value={rengZ.id}>
            {rengEtiquetaEntrada(rengZ)}
          </option>
        ))}
      </select>
      {rengE && (
        <div className="row">
          <label className="field">
            <span className="label">x</span>
            <select className="input" value={rengX} onChange={(rengEv) => rengOnX(rengEv.target.value)}>
              {rengE.serie.columnas.map((rengC) => (
                <option key={rengC.clave} value={rengC.clave}>
                  {rengC.nombre} {rengC.unidad ? `(${rengC.unidad})` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="label">y</span>
            <select className="input" value={rengY} onChange={(rengEv) => rengOnY(rengEv.target.value)}>
              {rengE.serie.columnas.map((rengC) => (
                <option key={rengC.clave} value={rengC.clave}>
                  {rengC.nombre} {rengC.unidad ? `(${rengC.unidad})` : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </fieldset>
  )
}

export function RengComparar({ proyecto: rengProyecto, onAnotar: rengOnAnotar }: { proyecto: RengProyecto; onAnotar: (rengTexto: string) => void }): React.JSX.Element {
  const rengTodas: RengEntrada[] = [...rengProyecto.corridas, ...rengProyecto.mediciones]
  const rengEntradas = rengTodas.filter((rengE) => rengAptitudComparacion(rengE).apta)
  const rengExcluidas = rengTodas.flatMap((rengE) => {
    const rengA = rengAptitudComparacion(rengE)
    return !rengA.apta && rengE.serie.filas.length > 0 ? [`«${rengE.nombre}» (${rengA.motivo})`] : []
  })
  const rengIni = (rengI: number): { id: string; x: string; y: string } => {
    const rengE = rengEntradas[rengI] ?? rengEntradas[0]
    const rengX = rengE?.serie.columnas[0]?.clave ?? ''
    return { id: rengE?.id ?? '', x: rengX, y: rengE ? rengYPorDefecto(rengE.serie, rengX) : '' }
  }
  const [rengA, rengSetA] = useState(() => rengIni(0))
  const [rengB, rengSetB] = useState(() => {
    const rengI = rengEntradas.findIndex((rengE) => rengE.tipo === 'medicion')
    return rengIni(rengI >= 0 && rengI !== 0 ? rengI : 1)
  })
  const rengCambiar = (rengSet: typeof rengSetA) => (rengId: string): void => {
    const rengE = rengEntradas.find((rengZ) => rengZ.id === rengId)
    if (!rengE) return
    rengSet((rengPrev) => {
      const rengTiene = (rengK: string): boolean => rengE.serie.columnas.some((rengC) => rengC.clave === rengK)
      const rengX = rengTiene(rengPrev.x) ? rengPrev.x : (rengE.serie.columnas[0]?.clave ?? '')
      return { id: rengId, x: rengX, y: rengTiene(rengPrev.y) && rengPrev.y !== rengX ? rengPrev.y : rengYPorDefecto(rengE.serie, rengX) }
    })
  }
  const rengEa = rengEntradas.find((rengE) => rengE.id === rengA.id)
  const rengEb = rengEntradas.find((rengE) => rengE.id === rengB.id)
  const rengC = useMemo(() => {
    if (!rengEa || !rengEb) return null
    const rengRa = rengExtraerXY(rengEa.nombre, rengEa.serie, rengA.x, rengA.y)
    const rengRb = rengExtraerXY(rengEb.nombre, rengEb.serie, rengB.x, rengB.y)
    if (!rengRa || !rengRb) return { ok: false as const, motivo: 'Elige columnas existentes.' }
    return rengComparar(rengRa, rengRb)
  }, [rengEa, rengEb, rengA, rengB])

  const rengTextoExcluidas = rengExcluidas.length > 0 ? `No se comparan: ${rengExcluidas.join('; ')}.` : ''
  if (rengEntradas.length < 2)
    return (
      <RengNotice>
        Para comparar hacen falta dos series con datos válidos en el proyecto: guarda otra corrida o importa una medición. {rengTextoExcluidas}
      </RengNotice>
    )

  const rengAvisos =
    rengEa && rengEb
      ? [
          ...(rengEa.id === rengEb.id ? [rengEa] : [rengEa, rengEb]).flatMap((rengE) => {
            const rengA = rengAptitudComparacion(rengE)
            return rengA.apta && rengA.aviso ? [rengA.aviso] : []
          }),
          ...rengAvisosProcedencia(rengEa, rengEb)
        ]
      : []
  const rengNota = (): string => {
    if (!rengC || !rengC.ok || !rengEa || !rengEb) return ''
    const rengSint = [rengEa, rengEb].some((rengE) => rengE.tipo === 'medicion' && rengE.sintetica) ? ' (incluye datos SINTÉTICOS)' : ''
    return `Comparación «${rengEb.nombre}» frente a «${rengEa.nombre}»${rengSint}: n = ${rengC.n}, RMSE = ${rengFmt(rengC.rmse)} ${rengC.unidad}, error absoluto medio = ${rengFmt(rengC.mae)} ${rengC.unidad}, máximo = ${rengFmt(rengC.maxAbs)} ${rengC.unidad}. ${rengC.metodo}${rengC.conversiones.length ? ` Conversiones: ${rengC.conversiones.join('; ')}.` : ''}${rengAvisos.length ? ` Avisos: ${rengAvisos.join(' ')}` : ''}`
  }

  return (
    <section className="stack" aria-label="Comparar series">
      <div className="cuaderno-comparar-sel">
        <RengSelector titulo="Referencia (modelo)" entradas={rengEntradas} valor={rengA.id} onCambio={rengCambiar(rengSetA)} x={rengA.x} y={rengA.y} onX={(rengX) => rengSetA((rengS) => ({ ...rengS, x: rengX }))} onY={(rengY) => rengSetA((rengS) => ({ ...rengS, y: rengY }))} />
        <RengSelector titulo="Comparar con" entradas={rengEntradas} valor={rengB.id} onCambio={rengCambiar(rengSetB)} x={rengB.x} y={rengB.y} onX={(rengX) => rengSetB((rengS) => ({ ...rengS, x: rengX }))} onY={(rengY) => rengSetB((rengS) => ({ ...rengS, y: rengY }))} />
      </div>
      {rengTextoExcluidas && <p className="faint sm">{rengTextoExcluidas}</p>}
      {rengAvisos.map((rengA) => (
        <RengNotice key={rengA} tipo="warn">
          {rengA}
        </RengNotice>
      ))}
      {rengC && !rengC.ok && <RengNotice tipo="warn">No se puede comparar: {rengC.motivo}</RengNotice>}
      {rengC && rengC.ok && (
        <>
          <div className="cuaderno-leyenda sm">
            <span className="ley-ref">━ {rengC.ref.nombre} (referencia)</span>
            <span className="ley-otra">● {rengC.otra.nombre}</span>
          </div>
          <RengGraficaComparacion c={rengC} />
          <dl className="kv">
            <dt>Puntos comparados</dt>
            <dd>{rengC.n}</dd>
            <dt>RMSE</dt>
            <dd>
              {rengFmt(rengC.rmse)} {rengC.unidad}
            </dd>
            <dt>Error absoluto medio</dt>
            <dd>
              {rengFmt(rengC.mae)} {rengC.unidad}
            </dd>
            <dt>Residuo máximo</dt>
            <dd>
              {rengFmt(rengC.maxAbs)} {rengC.unidad}
            </dd>
            <dt>Intervalo común</dt>
            <dd>
              [{rengFmt(rengC.intervalo[0])}, {rengFmt(rengC.intervalo[1])}] {rengC.ref.ux}
            </dd>
          </dl>
          <p className="faint sm">
            {rengC.metodo} {rengC.conversiones.length ? `Conversiones: ${rengC.conversiones.join('; ')}.` : 'Sin conversión de unidades.'}
          </p>
          {rengC.advertencias.map((rengA) => (
            <p key={rengA} className="notice warn sm" role="status">
              {rengA}
            </p>
          ))}
          {[rengEa, rengEb].map((rengE) => rengE && rengE.tipo === 'medicion' && (rengE.sintetica || rengE.incertidumbre) && (
            <p key={rengE.id} className="faint sm">
              «{rengE.nombre}»: {rengE.sintetica ? 'datos SINTÉTICOS (no medidos). ' : ''}
              {rengE.incertidumbre ? `Incertidumbre declarada: ${rengE.incertidumbre}.` : 'Sin incertidumbre declarada.'}
            </p>
          ))}
          <div>
            <button type="button" className="btn sm" onClick={() => rengOnAnotar(rengNota())}>
              Anotar el resultado en el proyecto
            </button>
          </div>
        </>
      )}
    </section>
  )
}
