import { useEffect, useMemo, useRef, useState, type Dispatch } from 'react'
import { rengCorreccionCompleta, rengEjercicioDeIntento, rengNivelesDeTema, rengNivelParaTema, rengNombreRama, rengReferenciaNueva, rengTemaPorId, RENG_TEMAS } from '../practica/banco'
import { rengEstadoEjercicio, type RengAccionPractica, type RengEstadoPractica } from '../practica/estado'
import { rengLeccionDeTema } from '../aprender/lecciones'
import { RengGraficaXY } from '../vista/GraficaXY'
import { rengSimulacionDeEjercicio, rengTransferirEjercicio } from '../practica/modelosSimulacion'
import { RENG_INFO_NIVEL_PRACTICA, type RengNivelPractica } from '../practica/niveles'
import type { RengEjercicio, RengTransferenciaSimulacion, RengVeredicto } from '../practica/tipos'
import { RengEstructura2D } from '../vista/Estructura2D'
import { rengRamaCorta } from '../vista/ExploradorTemas'
import RengPracticaFormulacion from './PracticaFormulacion'

interface RengProps {
  estado: RengEstadoPractica
  despachar: Dispatch<RengAccionPractica>
  nivel: RengNivelPractica
  onRepasarLeccion: (rengTema: string) => void
  onVolver: () => void
  onSimular: (rengT: RengTransferenciaSimulacion) => void
  onAbrirEnMesa: (rengSmiles: string, rengModo: 'reemplazar' | 'anadir') => void
  mesaVacia: boolean
}

const RENG_ETIQUETA_VEREDICTO: Record<RengVeredicto['tipo'], { texto: string; clase: string }> = {
  correcto: { texto: 'Correcto', clase: 'ok' },
  incorrecto: { texto: 'Incorrecto', clase: 'warn' },
  'entrada-invalida': { texto: 'Entrada no válida', clase: 'err' },
  'unidad-incompatible': { texto: 'Unidad incompatible', clase: 'err' },
  ambigua: { texto: 'Formulación ambigua', clase: 'warn' },
  simplificable: { texto: 'Equilibrada, pero simplificable', clase: 'warn' }
}

const rengPlaceholder = (rengE: RengEjercicio): string => {
  const rengR = rengE.respuesta
  switch (rengR.tipo) {
    case 'numero':
      return rengR.unidad ? `Número y unidad, p. ej. 0,0500 ${rengR.unidad}` : 'Solo el número, p. ej. 2,88'
    case 'formula':
      return 'p. ej. Fe2(SO4)3'
    case 'ecuacion':
      return 'p. ej. 2 H2 + O2 -> 2 H2O'
    case 'estructura':
      return 'Fórmula semidesarrollada (CH3CH2OH) o SMILES (CCO)'
    case 'nombre':
      return 'p. ej. butan-2-ol'
    case 'opcion':
      return ''
  }
}

function RengVeredictoCaja({ v: rengV, extra: rengExtra }: { v: RengVeredicto; extra?: RengVeredicto | null }): React.JSX.Element {
  const rengEt = RENG_ETIQUETA_VEREDICTO[rengV.tipo]
  return (
    <div className={`notice ${rengEt.clase} q-veredicto`} role="status" data-veredicto={rengV.tipo} data-motivo={rengV.motivo}>
      <div>
        <strong>{rengEt.texto}.</strong> {rengV.mensaje}
      </div>
      {rengV.detalle && rengV.detalle.length > 0 && (
        <ul className="sm">
          {rengV.detalle.map((rengD) => (
            <li key={rengD}>{rengD}</li>
          ))}
        </ul>
      )}
      {rengV.equivale && <div className="sm">{rengV.equivale}</div>}
      {rengV.errorFrecuente && (
        <div className="sm">
          <strong>Error frecuente:</strong> {rengV.errorFrecuente}
        </div>
      )}
      {rengExtra && (
        <div className="sm" data-veredicto-metodo={rengExtra.tipo}>
          <strong>Método:</strong> {rengExtra.mensaje}
        </div>
      )}
    </div>
  )
}

const rengFormatoValor = (rengV: string | number): string => (typeof rengV === 'number' ? String(rengV).replace('.', ',') : rengV)

export default function RengVistaEjercicios({ estado: rengEstado, despachar: rengDespachar, nivel: rengNivel, onRepasarLeccion: rengOnRepasarLeccion, onVolver: rengOnVolver, onSimular: rengOnSimular, onAbrirEnMesa: rengOnAbrirEnMesa, mesaVacia: rengMesaVacia }: RengProps): React.JSX.Element {
  const rengActual = rengEstado.actual
  const rengTema = rengTemaPorId(rengActual.tema) ?? RENG_TEMAS[0]!
  const rengNiveles = useMemo(() => rengNivelesDeTema(rengTema.id), [rengTema.id])
  const rengNivelPreferidoTema = rengNivelParaTema(rengTema.id, rengNivel)
  const rengNivelEfectivo = rengActual.nivel
  const rengEjercicio = useMemo(() => (rengTema.legado ? null : rengEjercicioDeIntento(rengActual)), [rengTema.legado, rengActual.ejercicioId, rengActual.tema, rengActual.nivel, rengActual.semilla])
  const rengLogro = rengActual.ejercicioId ? rengEstado.logros[rengActual.ejercicioId] : undefined
  const rengEstadoProgreso = rengEstadoEjercicio(rengEstado.logros, rengActual.ejercicioId)
  const rengLeccion = rengLeccionDeTema(rengTema.id)
  const rengTransfer = useMemo(() => {
    const rengSim = rengEjercicio ? rengSimulacionDeEjercicio(rengEjercicio) : undefined
    return rengSim ? rengTransferirEjercicio(rengSim) : null
  }, [rengEjercicio])
  const [rengConfirmaMesa, rengSetConfirmaMesa] = useState<string | null>(null)
  const [rengLegadoVisto, rengSetLegadoVisto] = useState(false)
  const rengCampo = useRef<HTMLInputElement>(null)
  const rengTitulo = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (rengTema.legado) rengSetLegadoVisto(true)
  }, [rengTema.legado])

  useEffect(() => {
    ;(rengCampo.current ?? rengTitulo.current)?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    rengSetConfirmaMesa(null)
  }, [rengActual.ejercicioId, rengActual.tema, rengActual.nivel, rengActual.semilla])

  const rengComprobar = (): void => {
    if (!rengEjercicio) return
    const rengCorreccion = rengCorreccionCompleta(rengEjercicio, rengActual.respuesta, rengActual.metodo)
    rengDespachar({ tipo: 'veredicto', veredicto: rengCorreccion.veredicto, metodo: rengCorreccion.metodo, completa: rengCorreccion.completa })
  }

  const rengAbrirVariante = (rengNivelDestino: RengNivelPractica, rengSemilla: number): void => {
    const rengRef = rengReferenciaNueva(rengTema.id, rengNivelDestino, rengSemilla)
    rengDespachar({ tipo: 'elegir', tema: rengTema.id, nivel: rengNivelDestino, semilla: rengRef?.semilla ?? rengSemilla, ejercicioId: rengRef?.ejercicioId ?? null, huella: rengRef?.huella ?? null })
  }
  const rengOtraVariante = (): void => rengAbrirVariante(rengActual.nivel, rengActual.semilla + 1)
  const rengNivelTemporal = rengActual.nivel !== rengNivel
  const rengDificultadFormular: 1 | 2 | 3 = rengNivelEfectivo === 'preuniversitario' ? 1 : rengNivelEfectivo === 'universitario' ? 2 : 3
  const rengRevisado = rengActual.veredicto !== null || rengActual.resolucion
  const rengPistasMax = rengEjercicio?.pistas.length ?? 0

  return (
    <div className="q-resolver">
      <header className="q-barra">
        <button type="button" className="btn sm" onClick={rengOnVolver}>
          ← Volver a temas
        </button>
        <div className="q-barra-titulo">
          <h2 ref={rengTitulo} tabIndex={-1}>
            {rengTema.nombre}
          </h2>
          <span className="faint sm">{rengRamaCorta(rengNombreRama(rengTema.rama))}</span>
        </div>
        <div className="q-barra-nivel">
          <div className="segmentado q-niveles" role="group" aria-label="Nivel de este ejercicio (temporal, no cambia tu nivel preferido)">
            {rengNiveles.map((rengN) => (
              <button key={rengN} type="button" aria-pressed={rengNivelEfectivo === rengN} title={RENG_INFO_NIVEL_PRACTICA[rengN].descripcion} onClick={() => rengAbrirVariante(rengN, 1)}>
                {RENG_INFO_NIVEL_PRACTICA[rengN].nombre}
              </button>
            ))}
          </div>
          {rengNivelTemporal && (
            <span className="q-aviso-nivel sm" role="status" data-nivel-temporal={rengNivelEfectivo}>
              <strong>Nivel temporal: {RENG_INFO_NIVEL_PRACTICA[rengNivelEfectivo].nombre}.</strong>{' '}
              {rengNivelPreferidoTema === rengNivelEfectivo ? `Tu preferencia (${RENG_INFO_NIVEL_PRACTICA[rengNivel].nombre}) no tiene práctica en este tema; no cambia.` : `Solo para este ejercicio; tu nivel preferido sigue siendo ${RENG_INFO_NIVEL_PRACTICA[rengNivel].nombre}.`}
            </span>
          )}
        </div>
      </header>

      {rengTema.legado === 'formular-nombrar' || rengLegadoVisto ? (
        <div hidden={!rengTema.legado} className="q-legado">
          <RengPracticaFormulacion dificultadSugerida={rengDificultadFormular} />
        </div>
      ) : null}

      {!rengTema.legado && !rengEjercicio && <div className="notice warn">No hay ejercicios válidos para este tema y nivel.</div>}

      {!rengTema.legado && rengEjercicio && (
        <>
          <section className="card stack tight q-problema" aria-label="Enunciado y datos">
            <div className="q-problema-cab">
              <h3 className="q-titulo-ejercicio">{rengEjercicio.titulo}</h3>
              <div className="row q-variante">
                <span className="faint sm">Variante {rengActual.semilla}</span>
                <button type="button" className="btn sm" onClick={rengOtraVariante}>
                  Otra variante
                </button>
              </div>
            </div>
            <div className="q-progreso" role="status" data-estado={rengEstadoProgreso}>
              <span className="q-estado-ejercicio">
                <span aria-hidden="true">{rengEstadoProgreso === 'resuelta' ? '✓' : rengEstadoProgreso === 'revisada' ? '◐' : '○'}</span>{' '}
                <strong>{rengEstadoProgreso === 'resuelta' ? 'Resuelta' : rengEstadoProgreso === 'revisada' ? 'Revisada' : 'Pendiente'}</strong>
              </span>
              {rengLogro && rengLogro.estado === 'resuelta' && (
                <span className="faint sm">
                  {rengLogro.aciertos} {rengLogro.aciertos === 1 ? 'acierto' : 'aciertos'} · {rengLogro.repeticiones} {rengLogro.repeticiones === 1 ? 'repetición' : 'repeticiones'}
                  {rengLogro.conResolucion ? ' · con la resolución a la vista' : ''}
                </span>
              )}
              {rengEstadoProgreso === 'revisada' && <span className="faint sm">Abriste la resolución: no cuenta como resuelta hasta que aciertes.</span>}
            </div>
            <p className="q-enunciado">{rengEjercicio.enunciado}</p>
            <p className="q-pregunta">
              <strong>Se pide:</strong> {rengEjercicio.pregunta}
            </p>
            {rengEjercicio.estructura && <RengEstructura2D smiles={rengEjercicio.estructura} descripcion="Estructura 2D del compuesto del enunciado" />}
            {rengEjercicio.estructuras && (
              <div className="q-estructuras">
                {rengEjercicio.estructuras.map((rengX) => (
                  <div key={rengX.etiqueta} className="q-estructura-bloque">
                    <RengEstructura2D smiles={rengX.smiles} descripcion={rengX.descripcion} />
                    <p className="sm">
                      <strong>{rengX.etiqueta}</strong> · <span className="mono">{rengX.smiles}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
            {rengEjercicio.grafica && (
              <figure className="q-grafica-ejercicio">
                <figcaption className="sm">
                  <strong>{rengEjercicio.grafica.titulo}</strong>
                </figcaption>
                <RengGraficaXY
                  series={rengEjercicio.grafica.series.map((rengS, rengI) => ({ nombre: rengS.nombre, puntos: rengS.puntos, color: ['var(--accent)', 'var(--text)', 'var(--text-2)'][rengI % 3]!, punteada: rengS.discontinua, marcador: rengS.marcador, sinLinea: !rengS.linea }))}
                  tituloX={rengEjercicio.grafica.tituloX}
                  tituloY={rengEjercicio.grafica.tituloY}
                  marcas={rengEjercicio.grafica.marcas}
                  descripcion={rengEjercicio.grafica.descripcion}
                />
                <table className="table tabla-datos q-tabla" aria-label={`Tabla equivalente de la gráfica: ${rengEjercicio.grafica.titulo}`}>
                  <caption className="sr-only">Tabla equivalente de la gráfica: los mismos valores en texto</caption>
                  <thead>
                    <tr>
                      {rengEjercicio.grafica.tabla.columnas.map((rengC) => (
                        <th key={rengC} scope="col">
                          {rengC}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rengEjercicio.grafica.tabla.filas.map((rengF, rengI) => (
                      <tr key={rengI}>
                        {rengF.map((rengV, rengJ) => (
                          <td key={rengJ}>{rengFormatoValor(rengV)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            )}
            {rengEjercicio.tabla && (
              <table className="table tabla-datos q-tabla" aria-label="Datos del ejercicio">
                <thead>
                  <tr>
                    {rengEjercicio.tabla.columnas.map((rengC) => (
                      <th key={rengC} scope="col">
                        {rengC}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rengEjercicio.tabla.filas.map((rengF, rengI) => (
                    <tr key={rengI}>
                      {rengF.map((rengV, rengJ) => (
                        <td key={rengJ}>{rengFormatoValor(rengV)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {rengEjercicio.datos.length > 0 && (
              <dl className="q-datos" aria-label="Datos con sus unidades">
                {rengEjercicio.datos.map((rengD) => (
                  <div key={rengD.clave}>
                    <dt>{rengD.etiqueta}</dt>
                    <dd>{rengD.texto}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          <section className="card stack tight q-respuesta-panel" aria-label="Respuesta y corrección">
            <div className={`q-respuesta-grid${rengActual.veredicto ? ' con-correccion' : ''}`}>
              <div className="stack tight q-respuesta-col">
                {rengEjercicio.metodo && (
                  <fieldset className="q-metodo">
                    <legend>{rengEjercicio.metodo.pregunta}</legend>
                    {rengEjercicio.metodo.opciones.map((rengO) => (
                      <label key={rengO.id} className="q-opcion">
                        <input type="radio" name="q-metodo" value={rengO.id} checked={rengActual.metodo === rengO.id} onChange={() => rengDespachar({ tipo: 'metodo', id: rengO.id })} />
                        <span>{rengO.texto}</span>
                      </label>
                    ))}
                    {rengEjercicio.criterioCompleto && <p className="faint sm q-criterio">{rengEjercicio.criterioCompleto}</p>}
                  </fieldset>
                )}
                <form
                  className="stack tight"
                  onSubmit={(rengEv) => {
                    rengEv.preventDefault()
                    rengComprobar()
                  }}
                >
                  {rengEjercicio.respuesta.tipo === 'opcion' ? (
                    <fieldset className="q-metodo">
                      <legend>Elige una opción</legend>
                      {rengEjercicio.respuesta.opciones.map((rengO) => (
                        <label key={rengO.id} className="q-opcion">
                          <input type="radio" name="q-respuesta" value={rengO.id} checked={rengActual.respuesta === rengO.id} onChange={() => rengDespachar({ tipo: 'escribir', texto: rengO.id })} />
                          <span>{rengO.texto}</span>
                        </label>
                      ))}
                    </fieldset>
                  ) : (
                    <div className="row q-respuesta-fila">
                      <input
                        ref={rengCampo}
                        className="input mono q-respuesta"
                        aria-label={`Tu respuesta: ${rengEjercicio.pregunta}`}
                        placeholder={rengPlaceholder(rengEjercicio)}
                        value={rengActual.respuesta}
                        onChange={(rengEv) => rengDespachar({ tipo: 'escribir', texto: rengEv.target.value })}
                        spellCheck={false}
                        autoComplete="off"
                        inputMode={rengEjercicio.respuesta.tipo === 'numero' ? 'decimal' : 'text'}
                      />
                      {rengEjercicio.respuesta.tipo === 'numero' && <span className="param-u-chip sm mono">{rengEjercicio.respuesta.unidad ? `en ${rengEjercicio.respuesta.unidad}` : 'sin unidad'}</span>}
                    </div>
                  )}
                  {rengEjercicio.respuesta.tipo === 'numero' && <span className="faint sm">Coma o punto decimal, notación científica (5,00e-2) y otra unidad compatible (50 mmol/L). Sin unidad se toma {rengEjercicio.respuesta.unidad || 'la magnitud adimensional'}.</span>}
                  <div className="row">
                    <button type="submit" className="btn primary">
                      Comprobar
                    </button>
                    <button type="button" className="btn" onClick={() => rengDespachar({ tipo: 'pista', maximo: rengPistasMax })} disabled={rengActual.pistas >= rengPistasMax}>
                      {rengActual.pistas >= rengPistasMax ? 'Sin más pistas' : `Pista (${rengActual.pistas + 1}/${rengPistasMax})`}
                    </button>
                    {rengActual.comprobaciones > 0 && <span className="faint sm">Comprobaciones: {rengActual.comprobaciones}</span>}
                    {rengActual.acertado && (
                      <button type="button" className="btn" onClick={() => rengDespachar({ tipo: 'repetir' })} title="Empieza esta variante de nuevo con la respuesta en blanco; cuenta como una repetición">
                        Rehacer esta variante
                      </button>
                    )}
                  </div>
                </form>
                {rengEjercicio.pistas.slice(0, rengActual.pistas).map((rengP, rengI) => (
                  <p key={rengP} className="muted sm q-pista">
                    Pista {rengI + 1}: {rengP}
                  </p>
                ))}
              </div>

              <div className="stack tight q-correccion-col">
                {rengActual.veredicto ? (
                  <>
                    <RengVeredictoCaja v={rengActual.veredicto} extra={rengActual.veredictoMetodo} />
                    {rengActual.veredicto.tipo === 'correcto' && rengEjercicio.metodo && !rengActual.resuelto && (
                      <div className="notice warn sm" role="status" data-completa="no">
                        El resultado es correcto, pero la respuesta aún no está completa: falta acertar también el método. No cuenta como resuelta.
                      </div>
                    )}
                    {rengActual.resuelto && rengEjercicio.metodo && (
                      <div className="notice ok sm" role="status" data-completa="si">
                        Respuesta completa: resultado y método correctos.
                      </div>
                    )}
                    {rengActual.veredicto.tipo === 'correcto' && rengEjercicio.comprobacion && (
                      <p className="sm muted">
                        <strong>Comprueba:</strong> {rengEjercicio.comprobacion}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="q-correccion-vacia faint sm">La corrección aparece aquí al comprobar.</p>
                )}
                {rengRevisado && (rengTransfer || rengEjercicio.estructura || rengLeccion) && (
                  <div className="row q-siguientes">
                    {rengLeccion && (
                      <button type="button" className="btn" onClick={() => rengOnRepasarLeccion(rengTema.id)} title="Abre la lección de este tema; desde ahí vuelves a esta práctica con tu respuesta y tus pistas">
                        Repasar la lección
                      </button>
                    )}
                    {rengTransfer?.ok && (
                      <button type="button" className="btn" onClick={() => rengOnSimular({ escena: rengTransfer.escena, entradas: rengTransfer.entradas })} title="Abre la simulación en el laboratorio con estos valores como punto de partida; es una ayuda opcional y tu práctica no cambia">
                        Probarlo en el laboratorio
                      </button>
                    )}
                    {rengEjercicio.estructura && (
                      <button type="button" className="btn" onClick={() => (rengMesaVacia ? rengOnAbrirEnMesa(rengEjercicio.estructura!, 'reemplazar') : rengSetConfirmaMesa(rengEjercicio.estructura!))}>
                        Abrir en Mesa molecular
                      </button>
                    )}
                    {rengTransfer && !rengTransfer.ok && <span className="faint sm">No se puede simular este ejercicio: {rengTransfer.diagnostico}</span>}
                  </div>
                )}
                {rengConfirmaMesa && (
                  <div className="notice q-confirma" role="group" aria-label="Cómo incorporar la estructura a la Mesa">
                    <p className="sm">La Mesa ya tiene una construcción. ¿Cómo quieres incorporar esta estructura?</p>
                    <div className="row">
                      <button
                        type="button"
                        className="btn sm"
                        onClick={() => {
                          rengOnAbrirEnMesa(rengConfirmaMesa, 'anadir')
                          rengSetConfirmaMesa(null)
                        }}
                      >
                        Añadir junto a lo que hay
                      </button>
                      <button
                        type="button"
                        className="btn sm"
                        onClick={() => {
                          rengOnAbrirEnMesa(rengConfirmaMesa, 'reemplazar')
                          rengSetConfirmaMesa(null)
                        }}
                      >
                        Reemplazar la construcción
                      </button>
                      <button type="button" className="btn ghost sm" onClick={() => rengSetConfirmaMesa(null)}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="q-paneles" key={rengEjercicio.id}>
            {rengEjercicio.hipotesis && rengEjercicio.hipotesis.length > 0 && (
              <details className="panel-seccion q-panel" open={rengEjercicio.nivel === 'quimico' || rengEjercicio.nivel === 'cientifico'}>
                <summary>Hipótesis y supuestos</summary>
                <ul className="sm">
                  {rengEjercicio.hipotesis.map((rengH) => (
                    <li key={rengH}>{rengH}</li>
                  ))}
                </ul>
              </details>
            )}
            <details
              className="panel-seccion q-panel"
              open={rengActual.resolucion}
              onToggle={(rengEv) => {
                if (rengEv.currentTarget.open && !rengActual.resolucion) rengDespachar({ tipo: 'resolucion' })
              }}
            >
              <summary>Resolución paso a paso</summary>
              <ol className="sm">
                {rengEjercicio.pasos.map((rengP) => (
                  <li key={rengP}>{rengP}</li>
                ))}
              </ol>
              {rengEjercicio.errorFrecuente && (
                <p className="sm">
                  <strong>Error frecuente:</strong> {rengEjercicio.errorFrecuente}
                </p>
              )}
              {rengEjercicio.comprobacion && (
                <p className="sm">
                  <strong>Comprueba:</strong> {rengEjercicio.comprobacion}
                </p>
              )}
            </details>
            {rengEjercicio.fuente && (
              <details className="panel-seccion q-panel">
                <summary>Fuente y condiciones de los datos</summary>
                <p className="sm muted">
                  {rengEjercicio.fuente.texto} <span className="badge">{rengEjercicio.fuente.verificacion === 'publicado' ? 'Medición publicada' : rengEjercicio.fuente.verificacion === 'referencia' ? 'Referencia consultada' : 'Dato didáctico'}</span>
                  {rengEjercicio.fuente.enlace && <span className="faint sm"> · {rengEjercicio.fuente.enlace}</span>}
                </p>
              </details>
            )}
          </div>
        </>
      )}
    </div>
  )
}
