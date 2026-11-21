import { useCallback, useEffect, useState } from 'react'
import { RENG_NOMBRE_ESTADO, RENG_NOMBRE_EVIDENCIA, type RengCorrida, type RengMedicion, type RengProyecto, type RengResumenProyecto } from '@shared/cuaderno'
import { rengCall, rengErrMsg, type RengPickedFile } from '@/lib/api'
import { rengAbrirProyecto, rengCrearProyecto, RENG_EVENTO_CUADERNO, rengGuardarProyecto, rengImportarProyecto, rengListarProyectos, rengPedirReapertura, rengRecordarUltimo, rengUltimoProyecto } from '@/lib/cuaderno/api'
import { rengCsvDeSerie } from '@/lib/cuaderno/csv'
import { rengCompatibilidad, rengTextoCompatibilidad } from '@/lib/cuaderno/modelos'
import { rengEditarEntrada, rengHistorialDe, rengProyectoJSON, rengQuitarEntrada, rengRenombrarProyecto } from '@/lib/cuaderno/proyecto'
import { RengIcon } from '@/shell/Icon'
import { rengIrA } from '@/shell/navegacion'
import { RengNotice } from '@/shell/ui'
import { RengComparar } from './Comparar'
import { RengImportarMedicion } from './ImportarMedicion'

type RengEntrada = RengCorrida | RengMedicion
type RengVista = 'entradas' | 'comparar' | 'importar'
const rengFecha = (rengIso: string): string => new Date(rengIso).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })
const rengValor = (rengV: number, rengU: string): string => `${Math.abs(rengV) >= 1e-3 && Math.abs(rengV) < 1e6 ? Number(rengV.toPrecision(6)).toLocaleString('es') : rengV.toExponential(4).replace('.', ',')}${rengU ? ` ${rengU}` : ''}`
const rengPlural = (rengN: number, rengUno: string, rengVarios: string): string => `${rengN} ${rengN === 1 ? rengUno : rengVarios}`
const rengArchivoSeguro = (rengS: string): string => rengS.replace(/[^\p{L}\p{N} _.-]+/gu, '').trim().slice(0, 60) || 'cuaderno'

function rengMetadatos(rengE: RengEntrada, rengP: RengProyecto): string[] {
  if (rengE.tipo === 'medicion')
    return [`Química para Todos · medición «${rengE.nombre}» (proyecto «${rengP.nombre}»)`, `Procedencia: ${rengE.procedencia}`, ...(rengE.sintetica ? ['DATOS SINTÉTICOS (generados, no medidos)'] : []), ...(rengE.incertidumbre ? [`Incertidumbre: ${rengE.incertidumbre}`] : []), `Archivo de origen: ${rengE.archivo}`, ...rengE.transformaciones.map((rengT) => `Transformación: ${rengT}`)]
  return [
    `Química para Todos · corrida «${rengE.nombre}» (proyecto «${rengP.nombre}»)`,
    `Modelo: ${rengE.modelo.nombre} (id ${rengE.modelo.id}, versión ${rengE.modelo.version})`,
    `Método: ${rengE.modelo.metodo}`,
    `Evidencia: ${RENG_NOMBRE_EVIDENCIA[rengE.modelo.evidencia]}. ${rengE.modelo.verificacion}`,
    `Estado: ${RENG_NOMBRE_ESTADO[rengE.estado]}`,
    `Parámetros: ${rengE.parametros.map((rengX) => `${rengX.clave} = ${rengX.valor}${rengX.unidad ? ` ${rengX.unidad}` : ''}`).join('; ')}`,
    `Muestreo: ${rengE.muestreo}`,
    ...rengE.resultados.map((rengR) => `Resultado: ${rengR.nombre} = ${rengR.valor}${rengR.unidad ? ` ${rengR.unidad}` : ''}`),
    ...(rengE.ajuste ? [rengTextoProcedencia(rengE)] : []),
    ...rengE.diagnosticos.map((rengD) => `Diagnóstico: ${rengD}`),
    ...rengE.fuentes.map((rengF) => `Fuente: ${rengF}`)
  ]
}

function rengTextoProcedencia(rengE: RengCorrida): string {
  const rengA = rengE.ajuste
  if (!rengA) return ''
  const rengV = `${rengA.parametro} = ${rengValor(rengA.valor, '')}${Number.isFinite(rengA.errorEstandar) ? ` ± ${rengValor(rengA.errorEstandar, '')}` : ''}`
  const rengCond = rengA.condiciones.map((rengX) => `${rengX.nombre} ${rengValor(rengX.valor, rengX.unidad)}`).join(', ')
  const rengMed = `la medición${rengA.sintetica ? ' SINTÉTICA' : ''} «${rengA.medicionNombre}» (id ${rengA.medicion})`
  return rengA.tipo === 'ajuste'
    ? `Ajuste: ${rengV} estimado con ${rengMed}, con ${rengCond}. Esta corrida es el ajuste: compararla con esa misma medición no la valida.`
    : `Reutiliza ${rengV}, estimado con ${rengMed} con ${rengCond}. Cambió: ${rengA.cambios.join('; ')}. Es una predicción: valídala con una medición hecha en estas condiciones.`
}

function RengDetalle({ e: rengE, p: rengP, onCambio: rengOnCambio, onMensaje: rengOnMensaje }: { e: RengEntrada; p: RengProyecto; onCambio: (rengP: RengProyecto) => void; onMensaje: (rengM: string, rengErr?: boolean) => void }): React.JSX.Element {
  const [rengNotas, rengSetNotas] = useState(rengE.notas)
  useEffect(() => rengSetNotas(rengE.notas), [rengE])
  const rengGuardarNotas = async (): Promise<void> => {
    try {
      rengOnCambio(await rengGuardarProyecto(rengEditarEntrada(rengP, rengE.id, { notas: rengNotas })))
      rengOnMensaje('Notas guardadas.')
    } catch (rengX) {
      rengOnMensaje(rengErrMsg(rengX), true)
    }
  }
  const rengExportar = async (): Promise<void> => {
    try {
      const rengRuta = await rengCall<string | null>('core', 'saveText', { nombreSugerido: `${rengArchivoSeguro(rengE.nombre)}.csv`, contenido: rengCsvDeSerie(rengE.serie, rengMetadatos(rengE, rengP)), extension: 'csv' })
      if (rengRuta) rengOnMensaje(`CSV guardado en ${rengRuta}`)
    } catch (rengX) {
      rengOnMensaje(rengErrMsg(rengX), true)
    }
  }
  const rengQuitar = async (): Promise<void> => {
    try {
      rengOnCambio(await rengGuardarProyecto(rengQuitarEntrada(rengP, rengE.id)))
      rengOnMensaje(`«${rengE.nombre}» se quitó del proyecto.`)
    } catch (rengX) {
      rengOnMensaje(rengErrMsg(rengX), true)
    }
  }
  const rengCompat = rengE.tipo === 'corrida' ? rengCompatibilidad(rengE.modelo.id, rengE.modelo.version) : null
  const rengReabrir = (): void => {
    if (rengE.tipo !== 'corrida') return
    rengRecordarUltimo(rengP.id)
    rengPedirReapertura({ proyecto: rengP.id, corrida: rengE.id, nombre: rengE.nombre, modulo: rengE.origen.modulo, sub: rengE.origen.sub, entradas: rengE.origen.entradas, version: rengE.modelo.version, ajuste: rengE.ajuste })
    rengIrA(rengE.origen.modulo, rengE.origen.sub)
  }
  const rengCadena = rengE.tipo === 'corrida' ? rengHistorialDe(rengP, rengE.id) : []
  const rengAnteriorPerdida = rengE.tipo === 'corrida' && rengE.anterior !== null && !rengP.corridas.some((rengC) => rengC.id === rengE.anterior)

  return (
    <article className="card stack cuaderno-detalle" aria-label={`Detalle de ${rengE.nombre}`}>
      <header className="stack tight">
        <h3>{rengE.nombre}</h3>
        <span className="faint sm">
          {rengE.tipo === 'corrida' ? `Corrida de ${rengE.disciplina === 'fisica' ? 'Física' : 'Química'}` : 'Medición'} · {rengFecha(rengE.fecha)}
        </span>
      </header>
      {rengE.tipo === 'corrida' ? (
        <>
          <p className="sm">
            <span className={`badge ${rengE.estado === 'calculado' ? 'ok' : 'media'}`}>{RENG_NOMBRE_ESTADO[rengE.estado]}</span> <span className="badge">{RENG_NOMBRE_EVIDENCIA[rengE.modelo.evidencia]}</span>
            {rengE.etiquetas.map((rengT) => (
              <span key={rengT} className="badge media">
                {rengT}
              </span>
            ))}
          </p>
          {rengE.objetivo && (
            <p className="sm">
              <b>Objetivo:</b> {rengE.objetivo}
            </p>
          )}
          {rengE.ajuste && (
            <RengNotice tipo={rengE.ajuste.tipo === 'ajuste' ? 'info' : 'warn'}>
              {rengTextoProcedencia(rengE)}
              {!rengP.mediciones.some((rengM) => rengM.id === rengE.ajuste?.medicion) && ' (La medición ya no está en este proyecto.)'}
            </RengNotice>
          )}
          <p className="sm">
            <b>Modelo:</b> {rengE.modelo.nombre} · versión {rengE.modelo.version}
          </p>
          {rengCompat && <RengNotice tipo={rengCompat.tipo === 'actual' ? 'info' : 'warn'}>{rengTextoCompatibilidad(rengCompat, rengE.modelo.version)}</RengNotice>}
          <p className="faint sm">{rengE.modelo.metodo}</p>
          <p className="faint sm">
            <b>Verificación:</b> {rengE.modelo.verificacion}
          </p>
          {rengCadena.length > 1 && <p className="faint sm">Repetición de: {rengCadena.slice(0, -1).map((rengC) => `«${rengC.nombre}» (${rengFecha(rengC.fecha)})`).join(' → ')}</p>}
          {rengAnteriorPerdida && <p className="faint sm">Es una repetición de una corrida que ya no está en este proyecto.</p>}
          <table className="table tabla-datos">
            <caption className="sm">Entradas</caption>
            <tbody>
              {rengE.parametros.map((rengX) => (
                <tr key={rengX.clave}>
                  <th scope="row">{rengX.nombre}</th>
                  <td className="mono">{rengValor(rengX.valor, rengX.unidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rengE.resultados.length > 0 && (
            <table className="table tabla-datos">
              <caption className="sm">Resultados</caption>
              <tbody>
                {rengE.resultados.map((rengX) => (
                  <tr key={rengX.clave}>
                    <th scope="row">{rengX.nombre}</th>
                    <td className="mono">{rengValor(rengX.valor, rengX.unidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="faint sm">
            <b>Muestreo:</b> {rengE.muestreo}
          </p>
          {rengE.diagnosticos.length > 0 && (
            <ul className="sm cuaderno-diag">
              {rengE.diagnosticos.map((rengD) => (
                <li key={rengD}>{rengD}</li>
              ))}
            </ul>
          )}
          <details className="sm">
            <summary>Fuentes ({rengE.fuentes.length})</summary>
            <ul>
              {rengE.fuentes.map((rengF) => (
                <li key={rengF}>{rengF}</li>
              ))}
            </ul>
          </details>
        </>
      ) : (
        <>
          {rengE.sintetica && <RengNotice tipo="warn">Datos SINTÉTICOS: generados, no medidos.</RengNotice>}
          <p className="sm">
            <b>Procedencia:</b> {rengE.procedencia}
          </p>
          <p className="sm">
            <b>Incertidumbre:</b> {rengE.incertidumbre || 'no declarada'}
          </p>
          <p className="faint sm">
            Archivo: {rengE.archivo} · separador {rengE.formato.separador}, decimal {rengE.formato.decimal} · columnas: {rengE.serie.columnas.map((rengC) => `${rengC.nombre}${rengC.unidad ? ` (${rengC.unidad})` : ''}`).join(', ')}
          </p>
          <ul className="sm cuaderno-diag">
            {rengE.transformaciones.map((rengT) => (
              <li key={rengT}>{rengT}</li>
            ))}
          </ul>
        </>
      )}
      <p className="faint sm">{rengE.serie.filas.length} filas · columnas: {rengE.serie.columnas.map((rengC) => `${rengC.clave}${rengC.unidad ? ` (${rengC.unidad})` : ''}`).join(', ')}</p>
      <label className="field">
        <span className="label">Notas</span>
        <textarea className="input" rows={3} value={rengNotas} maxLength={20000} onChange={(rengEv) => rengSetNotas(rengEv.target.value)} />
      </label>
      <div className="row">
        <button type="button" className="btn sm" disabled={rengNotas === rengE.notas} onClick={() => void rengGuardarNotas()}>
          Guardar notas
        </button>
        {rengE.tipo === 'corrida' && rengCompat?.tipo !== 'no-disponible' && (
          <button type="button" className="btn sm primary" onClick={rengReabrir} title="Abre el experimento con estas entradas; guardar de nuevo crea una corrida enlazada">
            Reabrir y repetir
          </button>
        )}
        <button type="button" className="btn sm" onClick={() => void rengExportar()} disabled={rengE.serie.filas.length === 0}>
          Exportar CSV
        </button>
        <button type="button" className="btn ghost sm" onClick={() => void rengQuitar()}>
          Quitar del proyecto
        </button>
      </div>
    </article>
  )
}

export default function RengCuaderno({ onHerramienta: rengOnHerramienta }: { onHerramienta: (rengId: 'datos') => void }): React.JSX.Element {
  const [rengLista, rengSetLista] = useState<RengResumenProyecto[] | null>(null)
  const [rengProblemas, rengSetProblemas] = useState<string[]>([])
  const [rengP, rengSetP] = useState<RengProyecto | null>(null)
  const [rengSel, rengSetSel] = useState<string | null>(null)
  const [rengVista, rengSetVista] = useState<RengVista>('entradas')
  const [rengNombreNuevo, rengSetNombreNuevo] = useState('')
  const [rengRenombrando, rengSetRenombrando] = useState<string | null>(null)
  const [rengNotasP, rengSetNotasP] = useState('')
  const [rengMsg, rengSetMsg] = useState<{ texto: string; err: boolean } | null>(null)
  const rengAviso = (rengTexto: string, rengErr = false): void => rengSetMsg({ texto: rengTexto, err: rengErr })

  const rengAbrir = useCallback(async (rengId: string): Promise<void> => {
    try {
      const rengX = await rengAbrirProyecto(rengId)
      rengSetP(rengX)
      rengSetNotasP(rengX.notas)
      rengRecordarUltimo(rengX.id)
    } catch (rengE) {
      rengAviso(rengErrMsg(rengE), true)
    }
  }, [])

  const rengRefrescar = useCallback(async (rengAbrirId?: string | null): Promise<void> => {
    try {
      const rengR = await rengListarProyectos()
      rengSetLista(rengR.proyectos)
      rengSetProblemas(rengR.problemas)
      const rengId = rengAbrirId ?? rengUltimoProyecto()
      const rengElegido = rengR.proyectos.find((rengX) => rengX.id === rengId) ?? rengR.proyectos[0]
      if (rengElegido) await rengAbrir(rengElegido.id)
      else rengSetP(null)
    } catch (rengE) {
      rengSetLista([])
      rengAviso(rengErrMsg(rengE), true)
    }
  }, [rengAbrir])

  useEffect(() => {
    void rengRefrescar()
    const rengF = (rengEv: Event): void => void rengRefrescar((rengEv as CustomEvent<string>).detail ?? null)
    window.addEventListener(RENG_EVENTO_CUADERNO, rengF)
    return () => window.removeEventListener(RENG_EVENTO_CUADERNO, rengF)
  }, [rengRefrescar])

  const rengCambio = (rengX: RengProyecto): void => {
    rengSetP(rengX)
    rengSetLista((rengL) => (rengL ?? []).map((rengR) => (rengR.id === rengX.id ? { id: rengX.id, nombre: rengX.nombre, modificado: rengX.modificado, corridas: rengX.corridas.length, mediciones: rengX.mediciones.length } : rengR)))
  }

  const rengCrear = async (): Promise<void> => {
    try {
      const rengX = await rengCrearProyecto(rengNombreNuevo || 'Mi cuaderno')
      rengSetNombreNuevo('')
      await rengRefrescar(rengX.id)
      rengAviso(`Proyecto «${rengX.nombre}» creado.`)
    } catch (rengE) {
      rengAviso(rengErrMsg(rengE), true)
    }
  }
  const rengRenombrar = async (): Promise<void> => {
    if (!rengP || rengRenombrando === null) return
    try {
      rengCambio(await rengGuardarProyecto(rengRenombrarProyecto(rengP, rengRenombrando)))
      rengSetRenombrando(null)
    } catch (rengE) {
      rengAviso(rengErrMsg(rengE), true)
    }
  }
  const rengExportarProyecto = async (): Promise<void> => {
    if (!rengP) return
    try {
      const rengRuta = await rengCall<string | null>('core', 'saveText', { nombreSugerido: `${rengArchivoSeguro(rengP.nombre)}.cuaderno.json`, contenido: rengProyectoJSON(rengP), extension: 'json' })
      if (rengRuta) rengAviso(`Proyecto exportado en ${rengRuta}`)
    } catch (rengE) {
      rengAviso(rengErrMsg(rengE), true)
    }
  }
  const rengImportarProyectoJSON = async (): Promise<void> => {
    try {
      const [rengF] = await rengCall<RengPickedFile[]>('core', 'pickFiles', { filtro: 'json' })
      if (!rengF) return
      const rengX = await rengImportarProyecto(await rengCall<string>('core', 'readText', { ruta: rengF.path }))
      await rengRefrescar(rengX.id)
      rengAviso(`Proyecto «${rengX.nombre}» importado (${rengPlural(rengX.corridas.length, 'corrida', 'corridas')}, ${rengPlural(rengX.mediciones.length, 'medición', 'mediciones')}).`)
    } catch (rengE) {
      rengAviso(`No se pudo importar: ${rengErrMsg(rengE)}`, true)
    }
  }
  const rengAnotar = async (rengTexto: string): Promise<void> => {
    if (!rengP || !rengTexto) return
    const rengNotas = `${rengP.notas ? `${rengP.notas}\n\n` : ''}${new Date().toLocaleDateString('es')} · ${rengTexto}`
    try {
      const rengX = await rengGuardarProyecto({ ...rengP, notas: rengNotas })
      rengCambio(rengX)
      rengSetNotasP(rengX.notas)
      rengAviso('Resultado anotado en las notas del proyecto.')
    } catch (rengE) {
      rengAviso(rengErrMsg(rengE), true)
    }
  }
  const rengGuardarNotasP = async (): Promise<void> => {
    if (!rengP) return
    try {
      rengCambio(await rengGuardarProyecto({ ...rengP, notas: rengNotasP }))
      rengAviso('Notas del proyecto guardadas.')
    } catch (rengE) {
      rengAviso(rengErrMsg(rengE), true)
    }
  }

  const rengEntradas: RengEntrada[] = rengP ? [...rengP.corridas, ...rengP.mediciones] : []
  const rengElegida = rengEntradas.find((rengE) => rengE.id === rengSel) ?? null

  return (
    <div className="stack cuaderno">
      {rengMsg && (
        <div className={`notice ${rengMsg.err ? 'err' : 'ok'}`} role="status">
          {rengMsg.texto}{' '}
          <button type="button" className="btn ghost sm" aria-label="Cerrar mensaje" onClick={() => rengSetMsg(null)}>
            ✕
          </button>
        </div>
      )}
      {rengProblemas.length > 0 && <RengNotice tipo="warn">Algunos archivos del cuaderno no se pudieron abrir: {rengProblemas.join(' · ')}</RengNotice>}

      <section className="card cuaderno-barra" aria-label="Proyecto">
        <RengIcon name="notebook" />
        {rengLista && rengLista.length > 0 && rengP ? (
          rengRenombrando !== null ? (
            <>
              <input className="input" value={rengRenombrando} maxLength={160} aria-label="Nuevo nombre del proyecto" onChange={(rengE) => rengSetRenombrando(rengE.target.value)} onKeyDown={(rengE) => rengE.key === 'Enter' && void rengRenombrar()} />
              <button type="button" className="btn sm primary" onClick={() => void rengRenombrar()}>
                Guardar nombre
              </button>
              <button type="button" className="btn ghost sm" onClick={() => rengSetRenombrando(null)}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <select className="input cuaderno-proyecto" value={rengP.id} aria-label="Proyecto abierto" onChange={(rengE) => void rengAbrir(rengE.target.value)}>
                {rengLista.map((rengR) => (
                  <option key={rengR.id} value={rengR.id}>
                    {rengR.nombre} — {rengPlural(rengR.corridas, 'corrida', 'corridas')}, {rengPlural(rengR.mediciones, 'medición', 'mediciones')}
                  </option>
                ))}
              </select>
              <button type="button" className="btn ghost sm" onClick={() => rengSetRenombrando(rengP.nombre)}>
                Renombrar
              </button>
            </>
          )
        ) : null}
        <span className="spacer" />
        <input className="input cuaderno-nuevo" value={rengNombreNuevo} placeholder="Nombre del proyecto nuevo" maxLength={160} aria-label="Nombre del proyecto nuevo" onChange={(rengE) => rengSetNombreNuevo(rengE.target.value)} />
        <button type="button" className="btn sm" onClick={() => void rengCrear()}>
          Nuevo proyecto
        </button>
        <button type="button" className="btn ghost sm" onClick={() => void rengImportarProyectoJSON()}>
          Importar proyecto…
        </button>
        {rengP && (
          <button type="button" className="btn ghost sm" onClick={() => void rengExportarProyecto()}>
            Exportar proyecto (JSON)
          </button>
        )}
      </section>

      {rengLista === null ? (
        <p className="faint sm">Cargando el cuaderno…</p>
      ) : !rengP ? (
        <section className="card stack cuaderno-vacio">
          <h3>Todavía no hay proyectos</h3>
          <p className="muted">
            Un proyecto reúne tus corridas y mediciones: qué pregunta probaste, con qué modelo, parámetros y unidades, qué datos salieron y de dónde vienen. Crea uno arriba o guarda una corrida directamente desde un experimento.
          </p>
          <ul className="cuaderno-pasos">
            <li>
              <div>
                <b>Química</b>
                <span className="muted sm">Experimentos → Mezcla ácido–base → «Guardar en cuaderno» (la curva de valoración).</span>
              </div>
              <button type="button" className="btn sm" onClick={() => rengIrA('simulador-quimica', 'mezcla')}>
                Preparar una mezcla
              </button>
            </li>
            <li>
              <div>
                <b>Tus mediciones</b>
                <span className="muted sm">Con un proyecto abierto, «Importar medición» lee un CSV; «Datos y estadística» analiza una serie que pegues.</span>
              </div>
              <button type="button" className="btn sm" onClick={() => rengOnHerramienta('datos')}>
                Analizar datos
              </button>
            </li>
          </ul>
        </section>
      ) : (
        <>
          <div className="segmentado" role="group" aria-label="Qué hacer con el proyecto">
            <button type="button" aria-pressed={rengVista === 'entradas'} onClick={() => rengSetVista('entradas')}>
              Corridas y mediciones ({rengEntradas.length})
            </button>
            <button type="button" aria-pressed={rengVista === 'importar'} onClick={() => rengSetVista('importar')}>
              Importar medición
            </button>
            <button type="button" aria-pressed={rengVista === 'comparar'} onClick={() => rengSetVista('comparar')}>
              Comparar
            </button>
          </div>

          {rengVista === 'importar' && (
            <RengImportarMedicion
              proyecto={rengP}
              onCancelar={() => rengSetVista('entradas')}
              onListo={(rengX, rengM) => {
                rengCambio(rengX)
                rengAviso(rengM)
                rengSetVista('entradas')
                rengSetSel(rengX.mediciones[rengX.mediciones.length - 1]?.id ?? null)
              }}
            />
          )}
          {rengVista === 'comparar' && <RengComparar proyecto={rengP} onAnotar={(rengT) => void rengAnotar(rengT)} />}
          {rengVista === 'entradas' && (
            <div className="cuaderno-cuerpo">
              <nav className="cuaderno-lista" aria-label="Corridas y mediciones del proyecto">
                {rengEntradas.length === 0 && <p className="faint sm">Proyecto vacío: guarda una corrida desde Física o Química, o importa una medición.</p>}
                {rengEntradas.map((rengE) => (
                  <button key={rengE.id} type="button" className={`cuaderno-item${rengSel === rengE.id ? ' activo' : ''}`} aria-pressed={rengSel === rengE.id} onClick={() => rengSetSel(rengE.id)} data-disciplina={rengE.tipo === 'corrida' ? rengE.disciplina : 'laboratorio'}>
                    <b>{rengE.nombre}</b>
                    <span className="faint sm">
                      {rengE.tipo === 'corrida' ? `${rengE.modelo.nombre.split(':')[0]} · v${rengE.modelo.version} · ${RENG_NOMBRE_ESTADO[rengE.estado]}` : `Medición${rengE.sintetica ? ' sintética' : ''} · ${rengE.serie.filas.length} filas`}
                    </span>
                    <span className="faint sm">{rengFecha(rengE.fecha)}</span>
                  </button>
                ))}
              </nav>
              {rengElegida ? <RengDetalle e={rengElegida} p={rengP} onCambio={rengCambio} onMensaje={rengAviso} /> : <p className="faint sm cuaderno-detalle-vacio">Elige una corrida o medición para ver sus entradas, resultados y procedencia.</p>}
            </div>
          )}

          <section className="card stack" aria-labelledby="notas-proyecto">
            <h3 id="notas-proyecto">Notas del proyecto</h3>
            <textarea className="input" rows={4} value={rengNotasP} maxLength={20000} onChange={(rengE) => rengSetNotasP(rengE.target.value)} placeholder="Conclusiones, dudas, qué repetir…" />
            <div>
              <button type="button" className="btn sm" disabled={rengNotasP === rengP.notas} onClick={() => void rengGuardarNotasP()}>
                Guardar notas
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
