import { useMemo, useState } from 'react'
import type { RengProyecto } from '@shared/cuaderno'
import { rengCall, rengErrMsg, type RengPickedFile } from '@/lib/api'
import { rengGuardarProyecto, rengNuevoId } from '@/lib/cuaderno/api'
import { rengAnalizarCSV, RENG_NOMBRE_DECIMAL, RENG_NOMBRE_SEPARADOR, type RengOpcionesCSV } from '@/lib/cuaderno/csv'
import { rengAnadirMedicion, rengCrearMedicion } from '@/lib/cuaderno/proyecto'
import { RengNotice } from '@/shell/ui'

const rengFmt = (rengV: number | null): string => (rengV === null ? '—' : rengV !== 0 && (Math.abs(rengV) < 1e-4 || Math.abs(rengV) >= 1e9) ? rengV.toExponential(5).replace('.', ',') : rengV.toLocaleString('es', { maximumSignificantDigits: 6 }))

export function RengImportarMedicion({ proyecto: rengProyecto, onListo: rengOnListo, onCancelar: rengOnCancelar }: { proyecto: RengProyecto; onListo: (rengP: RengProyecto, rengMensaje: string) => void; onCancelar: () => void }): React.JSX.Element {
  const [rengArchivo, rengSetArchivo] = useState<{ nombre: string; texto: string } | null>(null)
  const [rengOpciones, rengSetOpciones] = useState<RengOpcionesCSV>({ separador: 'auto', decimal: 'auto' })
  const [rengNombre, rengSetNombre] = useState('')
  const [rengProcedencia, rengSetProcedencia] = useState('')
  const [rengSintetica, rengSetSintetica] = useState(false)
  const [rengIncertidumbre, rengSetIncertidumbre] = useState('')
  const [rengError, rengSetError] = useState('')
  const [rengOcupado, rengSetOcupado] = useState(false)
  const rengR = useMemo(() => (rengArchivo ? rengAnalizarCSV(rengArchivo.texto, rengOpciones) : null), [rengArchivo, rengOpciones])

  const rengElegir = async (): Promise<void> => {
    rengSetError('')
    try {
      const [rengF] = await rengCall<RengPickedFile[]>('core', 'pickFiles', { filtro: 'csv' })
      if (!rengF) return
      const rengTexto = await rengCall<string>('core', 'readText', { ruta: rengF.path })
      rengSetArchivo({ nombre: rengF.name, texto: rengTexto })
      rengSetNombre((rengN) => rengN || rengF.name.replace(/\.[^.]+$/, ''))
    } catch (rengE) {
      rengSetError(rengErrMsg(rengE))
    }
  }

  const rengAnadir = async (): Promise<void> => {
    if (!rengR || rengR.error || !rengArchivo) return
    rengSetOcupado(true)
    try {
      const rengTransformaciones = [
        `Separador ${RENG_NOMBRE_SEPARADOR[rengR.separador]} y decimal ${RENG_NOMBRE_DECIMAL[rengR.decimal]}${rengOpciones.separador === 'auto' || rengOpciones.decimal === 'auto' ? ' (detectados)' : ''}.`,
        ...(rengR.filasOmitidas ? [`${rengR.filasOmitidas} ${rengR.filasOmitidas === 1 ? 'fila omitida' : 'filas omitidas'} por error (ver detalle en la importación).`] : []),
        ...(rengR.faltantes + rengR.nan ? [`${rengR.faltantes + rengR.nan} celdas vacías o NaN guardadas como dato faltante.`] : []),
        'Valores numéricos sin conversión de unidades.'
      ]
      const rengM = rengCrearMedicion(rengNuevoId(), {
        nombre: rengNombre,
        serie: { columnas: rengR.columnas, filas: rengR.filas },
        procedencia: rengProcedencia,
        sintetica: rengSintetica,
        incertidumbre: rengIncertidumbre,
        archivo: rengArchivo.nombre,
        formato: { separador: RENG_NOMBRE_SEPARADOR[rengR.separador], decimal: RENG_NOMBRE_DECIMAL[rengR.decimal] },
        transformaciones: rengTransformaciones,
        notas: rengR.comentarios.length ? `Comentarios del archivo:\n${rengR.comentarios.join('\n')}` : ''
      })
      const rengG = await rengGuardarProyecto(rengAnadirMedicion(rengProyecto, rengM))
      rengOnListo(rengG, `Medición «${rengM.nombre}» añadida (${rengR.filas.length} filas).`)
    } catch (rengE) {
      rengSetError(rengErrMsg(rengE))
    } finally {
      rengSetOcupado(false)
    }
  }

  return (
    <section className="card stack cuaderno-dialogo" aria-labelledby="imp-titulo">
      <h3 id="imp-titulo">Importar una medición (CSV)</h3>
      <div className="row">
        <button type="button" className="btn" onClick={() => void rengElegir()}>
          {rengArchivo ? 'Elegir otro archivo…' : 'Elegir archivo…'}
        </button>
        {rengArchivo && <span className="faint sm">{rengArchivo.nombre}</span>}
      </div>
      {rengArchivo && rengR && (
        <>
          <div className="row">
            <label className="field">
              <span className="label">Separador</span>
              <select className="input" value={rengOpciones.separador} onChange={(rengE) => rengSetOpciones((rengO) => ({ ...rengO, separador: rengE.target.value as RengOpcionesCSV['separador'] }))}>
                <option value="auto">Detectar ({RENG_NOMBRE_SEPARADOR[rengR.separador]})</option>
                <option value=",">Coma</option>
                <option value=";">Punto y coma</option>
                <option value={'\t'}>Tabulador</option>
                <option value=" ">Espacios</option>
              </select>
            </label>
            <label className="field">
              <span className="label">Decimal</span>
              <select className="input" value={rengOpciones.decimal} onChange={(rengE) => rengSetOpciones((rengO) => ({ ...rengO, decimal: rengE.target.value as RengOpcionesCSV['decimal'] }))}>
                <option value="auto">Detectar ({RENG_NOMBRE_DECIMAL[rengR.decimal]})</option>
                <option value=".">Punto (1.5)</option>
                <option value=",">Coma (1,5)</option>
              </select>
            </label>
          </div>
          {rengR.error ? (
            <RengNotice tipo="err">{rengR.error}</RengNotice>
          ) : (
            <div className="cuaderno-previa" role="region" aria-label="Vista previa de los datos">
              <table className="table tabla-datos">
                <thead>
                  <tr>
                    {rengR.columnas.map((rengC) => (
                      <th key={rengC.clave} scope="col">
                        {rengC.nombre}
                        <span className="faint"> {rengC.unidad ? `(${rengC.unidad})` : '(sin unidad)'}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rengR.filas.slice(0, 8).map((rengF, rengI) => (
                    <tr key={rengI}>
                      {rengF.map((rengV, rengJ) => (
                        <td key={rengJ} className="mono">
                          {rengFmt(rengV)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="faint sm">
                {rengR.filas.length} filas leídas{rengR.filas.length > 8 ? ' (se muestran 8)' : ''}
                {rengR.filasOmitidas ? ` · ${rengR.filasOmitidas} omitidas` : ''}.
              </p>
            </div>
          )}
          {rengR.avisos.length > 0 && (
            <ul className="sm cuaderno-diag">
              {rengR.avisos.map((rengA) => (
                <li key={rengA}>{rengA}</li>
              ))}
            </ul>
          )}
          {rengR.errores.length > 0 && (
            <details className="sm">
              <summary>Filas con error ({rengR.filasOmitidas})</summary>
              <ul className="cuaderno-diag">
                {rengR.errores.map((rengE) => (
                  <li key={rengE.linea}>
                    Línea {rengE.linea}: {rengE.mensaje}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <label className="field">
            <span className="label">Nombre de la medición</span>
            <input className="input" value={rengNombre} maxLength={160} onChange={(rengE) => rengSetNombre(rengE.target.value)} />
          </label>
          <label className="field">
            <span className="label">Procedencia (obligatoria): instrumento, referencia o quién midió y cuándo</span>
            <input className="input" value={rengProcedencia} maxLength={2000} onChange={(rengE) => rengSetProcedencia(rengE.target.value)} />
          </label>
          <label className="field">
            <span className="label">Incertidumbre declarada (opcional)</span>
            <input className="input" value={rengIncertidumbre} maxLength={500} placeholder="p. ej. ±0,5 mm en h; ±0,1 s en t" onChange={(rengE) => rengSetIncertidumbre(rengE.target.value)} />
          </label>
          <label className="row sm">
            <input type="checkbox" checked={rengSintetica} onChange={(rengE) => rengSetSintetica(rengE.target.checked)} /> Datos sintéticos (generados, no medidos): se etiquetarán como tales
          </label>
        </>
      )}
      {rengError && <RengNotice tipo="err">{rengError}</RengNotice>}
      <div className="row">
        <button type="button" className="btn primary" disabled={!rengR || !!rengR.error || rengOcupado || rengProcedencia.trim() === '' || rengNombre.trim() === ''} onClick={() => void rengAnadir()}>
          {rengOcupado ? 'Guardando…' : 'Añadir al proyecto'}
        </button>
        <button type="button" className="btn ghost" onClick={rengOnCancelar}>
          Cancelar
        </button>
      </div>
    </section>
  )
}
