import { useEffect, useId, useState } from 'react'
import { RENG_NOMBRE_ESTADO, type RengDatosCorrida, type RengProcedenciaAjuste, type RengResumenProyecto } from '@shared/cuaderno'
import { rengIrA } from '@/shell/navegacion'
import { rengErrMsg } from '../api'
import { rengAbrirProyecto, rengCrearProyecto, rengGuardarProyecto, rengListarProyectos, rengNuevoId, rengUltimoProyecto } from './api'
import { rengAnadirCorrida, rengCrearCorrida } from './proyecto'

const RENG_NUEVO = '__nuevo__'

export function RengGuardarEnCuaderno({
  calcular: rengCalcular,
  nombreSugerido: rengNombreSugerido,
  anterior: rengAnterior = null,
  etiqueta: rengEtiqueta = 'Guardar en cuaderno',
  objetivoInicial: rengObjetivoInicial = '',
  etiquetas: rengEtiquetas = [],
  ajuste: rengAjuste = null,
  abrir: rengAbrir = 0,
  advertencia: rengAdvertencia = null,
  alGuardar: rengAlGuardar
}: {
  calcular: () => RengDatosCorrida | null
  nombreSugerido: string
  anterior?: string | null
  etiqueta?: string
  objetivoInicial?: string
  etiquetas?: string[]
  ajuste?: RengProcedenciaAjuste | null
  abrir?: number
  advertencia?: string | null
  alGuardar?: () => void
}): React.JSX.Element {
  const [rengAbierto, rengSetAbierto] = useState(false)
  const [rengDatos, rengSetDatos] = useState<RengDatosCorrida | null>(null)
  const [rengProyectos, rengSetProyectos] = useState<RengResumenProyecto[] | null>(null)
  const [rengDestino, rengSetDestino] = useState<string>(RENG_NUEVO)
  const [rengNombreProyecto, rengSetNombreProyecto] = useState('Mi cuaderno')
  const [rengNombre, rengSetNombre] = useState(rengNombreSugerido)
  const [rengObjetivo, rengSetObjetivo] = useState('')
  const [rengEstado, rengSetEstado] = useState<{ tipo: 'ok' | 'err'; texto: string; proyecto?: string } | null>(null)
  const [rengOcupado, rengSetOcupado] = useState(false)
  const [rengFijo, rengSetFijo] = useState<{ etiquetas: string[]; ajuste: RengProcedenciaAjuste | null }>({ etiquetas: rengEtiquetas, ajuste: rengAjuste })
  const rengId = useId()
  useEffect(() => {
    if (rengAbrir > 0) rengSetAbierto(true)
  }, [rengAbrir])

  useEffect(() => {
    if (!rengAbierto) return
    let rengVivo = true
    rengSetEstado(null)
    rengSetNombre(rengNombreSugerido)
    rengSetObjetivo(rengObjetivoInicial)
    rengSetFijo({ etiquetas: rengEtiquetas, ajuste: rengAjuste })
    try {
      rengSetDatos(rengCalcular())
    } catch (rengE) {
      rengSetDatos(null)
      rengSetEstado({ tipo: 'err', texto: `No se pudo calcular la corrida: ${rengErrMsg(rengE)}` })
    }
    rengListarProyectos()
      .then((rengR) => {
        if (!rengVivo) return
        rengSetProyectos(rengR.proyectos)
        const rengU = rengUltimoProyecto()
        rengSetDestino(rengR.proyectos.some((rengP) => rengP.id === rengU) ? rengU! : (rengR.proyectos[0]?.id ?? RENG_NUEVO))
      })
      .catch((rengE: unknown) => rengVivo && (rengSetProyectos([]), rengSetEstado({ tipo: 'err', texto: rengErrMsg(rengE) })))
    return () => {
      rengVivo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rengAbierto, rengAbrir])

  const rengGuardar = async (): Promise<void> => {
    if (!rengDatos) return
    rengSetOcupado(true)
    try {
      const rengP = rengDestino === RENG_NUEVO ? await rengCrearProyecto(rengNombreProyecto) : await rengAbrirProyecto(rengDestino)
      const rengC = rengCrearCorrida(rengNuevoId(), rengDatos, { nombre: rengNombre, objetivo: rengObjetivo, anterior: rengAnterior, etiquetas: rengFijo.etiquetas, ajuste: rengFijo.ajuste })
      const rengG = await rengGuardarProyecto(rengAnadirCorrida(rengP, rengC))
      rengSetEstado({ tipo: 'ok', texto: `Corrida «${rengC.nombre}» guardada en «${rengG.nombre}».`, proyecto: rengG.id })
      rengAlGuardar?.()
    } catch (rengE) {
      rengSetEstado({ tipo: 'err', texto: rengErrMsg(rengE) })
    } finally {
      rengSetOcupado(false)
    }
  }

  if (!rengAbierto)
    return (
      <button type="button" className="btn sm" onClick={() => rengSetAbierto(true)}>
        {rengEtiqueta}
      </button>
    )

  return (
    <section className="cuaderno-guardar card stack tight" aria-labelledby={`${rengId}-t`}>
      <h4 id={`${rengId}-t`}>Guardar corrida en el cuaderno</h4>
      {rengAdvertencia && (
        <div className="notice warn" role="status" data-guardar-pendiente="">
          {rengAdvertencia}
        </div>
      )}
      {rengDatos ? (
        <>
          <p className="sm">
            <span className={`badge ${rengDatos.estado === 'calculado' ? 'ok' : 'media'}`}>{RENG_NOMBRE_ESTADO[rengDatos.estado]}</span> {rengDatos.modelo.nombre} · versión {rengDatos.modelo.version} · {rengDatos.serie.filas.length} filas
          </p>
          {rengDatos.diagnosticos.length > 0 && (
            <ul className="sm cuaderno-diag">
              {rengDatos.diagnosticos.map((rengD) => (
                <li key={rengD}>{rengD}</li>
              ))}
            </ul>
          )}
          <label className="field">
            <span className="label">Proyecto</span>
            <select className="input" value={rengDestino} onChange={(rengE) => rengSetDestino(rengE.target.value)} disabled={rengProyectos === null}>
              {(rengProyectos ?? []).map((rengP) => (
                <option key={rengP.id} value={rengP.id}>
                  {rengP.nombre} ({rengP.corridas} {rengP.corridas === 1 ? 'corrida' : 'corridas'})
                </option>
              ))}
              <option value={RENG_NUEVO}>Nuevo proyecto…</option>
            </select>
          </label>
          {rengDestino === RENG_NUEVO && (
            <label className="field">
              <span className="label">Nombre del proyecto nuevo</span>
              <input className="input" value={rengNombreProyecto} maxLength={160} onChange={(rengE) => rengSetNombreProyecto(rengE.target.value)} />
            </label>
          )}
          <label className="field">
            <span className="label">Nombre de la corrida</span>
            <input className="input" value={rengNombre} maxLength={160} onChange={(rengE) => rengSetNombre(rengE.target.value)} />
          </label>
          <label className="field">
            <span className="label">Objetivo o hipótesis (opcional)</span>
            <input className="input" value={rengObjetivo} maxLength={500} placeholder="p. ej. comprobar que el tiempo de vaciado crece con √h₀" onChange={(rengE) => rengSetObjetivo(rengE.target.value)} />
          </label>
          {rengAnterior && <p className="faint sm">Se enlazará como repetición de la corrida reabierta.</p>}
          {rengFijo.etiquetas.length > 0 && <p className="faint sm">Etiquetas: {rengFijo.etiquetas.join(', ')}.</p>}
          {rengFijo.ajuste && (
            <p className="faint sm">
              {rengFijo.ajuste.tipo === 'ajuste' ? `Corrida de AJUSTE: usa el ${rengFijo.ajuste.parametro} estimado con «${rengFijo.ajuste.medicionNombre}» en sus mismas condiciones.` : `REUTILIZA el ${rengFijo.ajuste.parametro} estimado con «${rengFijo.ajuste.medicionNombre}» en otras condiciones (${rengFijo.ajuste.cambios.join('; ')}).`} La procedencia queda guardada con la corrida.
            </p>
          )}
        </>
      ) : (
        !rengEstado && <p className="faint sm">Este experimento todavía no tiene una corrida reproducible para el cuaderno.</p>
      )}
      {rengEstado && (
        <div className={`notice ${rengEstado.tipo}`} role="status">
          {rengEstado.texto}{' '}
          {rengEstado.proyecto && (
            <button type="button" className="btn ghost sm" onClick={() => rengIrA('laboratorio', 'cuaderno')}>
              Abrir el cuaderno
            </button>
          )}
        </div>
      )}
      <div className="row">
        {rengDatos && !rengEstado?.proyecto && (
          <button type="button" className="btn primary sm" disabled={rengOcupado || rengProyectos === null || rengNombre.trim() === ''} onClick={() => void rengGuardar()}>
            {rengOcupado ? 'Guardando…' : 'Guardar'}
          </button>
        )}
        <button type="button" className="btn ghost sm" onClick={() => rengSetAbierto(false)}>
          {rengEstado?.proyecto ? 'Cerrar' : 'Cancelar'}
        </button>
      </div>
    </section>
  )
}
