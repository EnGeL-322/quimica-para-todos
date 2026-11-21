import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { rengFichaDeTema, rengPreguntaDeTema } from '../practica/fichasTema'
import { rengNivelesDeTema, rengTemaPorId } from '../practica/banco'
import type { RengNivelPractica } from '../practica/niveles'
import { RENG_DEFINICION_ESTADO_COBERTURA, RENG_ESTADOS_COBERTURA, RENG_NOMBRE_ESTADO_COBERTURA, type RengEstadoCobertura } from '../temario/estado'
import { RENG_NIVELES_PLEGADOS_POR_DEFECTO, rengBuscarEnCatalogo, rengCatalogoReal, rengTextoCapas, rengTituloLegible, type RengBloqueCatalogo, type RengNivelCatalogo, type RengSubtemaCatalogo } from '../temario/catalogo'
import { rengAlternarBloque, rengAlternarNivel, rengBloqueAbierto, rengElegirRuta, rengGuardarPlegado, rengLeerPlegado, rengNivelAbierto, type RengPlegadoTemario } from '../temario/plegado'
import { rengAccionesDeRecurso, rengClaveRecurso, rengEtiquetaRecurso, type RengAccionRecurso } from '../temario/recursos'
import type { RengRecurso } from '../temario/tipos'
import { RENG_NOMBRE_VERIFICACION } from '../temario/verificacion'
import { RengTarjetaTema } from '../vista/TarjetaTema'
import '../temario/temario.css'

interface RengProps {
  nivel: RengNivelPractica
  onIr: (rengAccion: RengAccionRecurso) => void
}

const rengAlmacenSesion = (): Storage | null => {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

const RENG_SIMBOLO_ESTADO: Readonly<Record<RengEstadoCobertura, string>> = {
  'sin-contenido': '○',
  'en-desarrollo': '◔',
  parcial: '◐',
  completado: '●',
  verificado: '✓'
}

function RengInsigniaEstado({ estado: rengEstado }: { estado: RengEstadoCobertura }): React.JSX.Element {
  return (
    <span className="q-tm-estado" data-estado={rengEstado} title={RENG_DEFINICION_ESTADO_COBERTURA[rengEstado]}>
      <span aria-hidden="true">{RENG_SIMBOLO_ESTADO[rengEstado]}</span> {RENG_NOMBRE_ESTADO_COBERTURA[rengEstado]}
    </span>
  )
}

function RengBotonesRecurso({ recurso: rengR, onIr: rengOnIr, tenue: rengTenue }: { recurso: RengRecurso; onIr: (rengA: RengAccionRecurso) => void; tenue: boolean }): React.JSX.Element {
  const rengAcciones = rengAccionesDeRecurso(rengR)
  return (
    <li className="q-tm-recurso" data-recurso={rengClaveRecurso(rengR)} data-tenue={rengTenue ? 'si' : 'no'}>
      <span className="q-tm-recurso-nombre">{rengEtiquetaRecurso(rengR)}</span>
      {rengAcciones.map((rengA) => (
        <button key={`${rengA.modulo}-${rengA.sub}-${rengA.etiqueta}`} type="button" className="btn sm" aria-label={`${rengA.etiqueta}: ${rengEtiquetaRecurso(rengR)}`} onClick={() => rengOnIr(rengA)}>
          {rengA.etiqueta}
        </button>
      ))}
    </li>
  )
}

function RengFilaSubtema({ subtema: rengS, onIr: rengOnIr }: { subtema: RengSubtemaCatalogo; onIr: (rengA: RengAccionRecurso) => void }): React.JSX.Element {
  const rengCorrespondencia = rengS.correspondencia === 'confirmado' ? 'Confirmado' : rengS.correspondencia === 'revisar' ? 'Por revisar' : 'Sin recurso'
  const rengRecursos = rengS.correspondencia === 'confirmado' ? rengS.confirmados : rengS.porRevisar
  return (
    <li className="q-tm-subtema" data-subtema={rengS.id} data-correspondencia={rengS.correspondencia ?? 'ninguna'} data-estado={rengS.evaluacion.estado}>
      <div className="q-tm-subtema-cabecera">
        <span className="q-tm-subtema-n">{rengS.posicion}</span>
        <span className="q-tm-subtema-titulo">{rengS.titulo}</span>
        <RengInsigniaEstado estado={rengS.evaluacion.estado} />
        <span className="q-tm-correspondencia" data-correspondencia={rengS.correspondencia ?? 'ninguna'}>
          {rengCorrespondencia}
        </span>
        {rengS.evaluacion.verificacion && (
          <span className="q-tm-verificacion" title="Nivel de verificación del recurso más débil. Es independiente de la cobertura.">
            Datos: {RENG_NOMBRE_VERIFICACION[rengS.evaluacion.verificacion.nivel].toLowerCase()}
          </span>
        )}
      </div>
      {rengRecursos.length > 0 && (
        <>
          <p className="q-tm-nota faint sm">{rengS.correspondencia === 'revisar' ? 'Relación por revisar (no cuenta como cobertura):' : 'Recursos confirmados:'}</p>
          <ul className="q-tm-recursos" aria-label={`Recursos de ${rengS.titulo}`}>
            {rengRecursos.map((rengR) => (
              <RengBotonesRecurso key={rengClaveRecurso(rengR)} recurso={rengR} onIr={rengOnIr} tenue={rengS.correspondencia === 'revisar'} />
            ))}
          </ul>
        </>
      )}
    </li>
  )
}

function rengTemasDelBloque(rengB: RengBloqueCatalogo): string[] {
  const rengIds = new Set<string>()
  for (const rengS of rengB.subtemas) for (const rengR of rengS.confirmados) if (rengR.tipo === 'tema') rengIds.add(rengR.id)
  return [...rengIds]
}

interface RengPropsBloque {
  bloque: RengBloqueCatalogo
  abierto: boolean
  visibles: ReadonlySet<string> | null
  nivelPractica: RengNivelPractica
  onAlternar: () => void
  onIr: (rengA: RengAccionRecurso) => void
}

function RengBloque({ bloque: rengB, abierto: rengAbierto, visibles: rengVisibles, nivelPractica: rengNivelPractica, onAlternar: rengOnAlternar, onIr: rengOnIr }: RengPropsBloque): React.JSX.Element {
  const rengId = useId()
  const rengSubtemas = rengVisibles ? rengB.subtemas.filter((rengS) => rengVisibles.has(rengS.id)) : rengB.subtemas
  const rengTemas = useMemo(() => rengTemasDelBloque(rengB), [rengB])
  const rengEsMapa = rengB.tipo === 'problemas'
  return (
    <article className="q-tm-bloque" data-bloque={rengB.id} data-abierto={rengAbierto ? 'si' : 'no'} data-tipo={rengB.tipo}>
      <h4 className="q-tm-bloque-titulo">
        <button type="button" className="q-tm-plegar" aria-expanded={rengAbierto} aria-controls={`${rengId}-cuerpo`} onClick={rengOnAlternar}>
          <span className="q-tm-flecha" aria-hidden="true">
            {rengAbierto ? '▾' : '▸'}
          </span>
          <span className="q-tm-bloque-nombre">
            {rengB.numero}. {rengB.titulo}
          </span>
          {rengEsMapa ? <span className="q-tm-mapa">Mapa informativo</span> : <RengInsigniaEstado estado={rengB.estado} />}
          <span className="q-tm-cuenta faint sm">
            {rengEsMapa ? `${rengB.conteo.total} problemas` : `${rengB.conteo.confirmados} de ${rengB.conteo.total} confirmados${rengB.conteo.porRevisar > 0 ? ` · ${rengB.conteo.porRevisar} por revisar` : ''} · ${rengTextoCapas(rengB.conteo.porCapa)}`}
          </span>
        </button>
      </h4>
      <div id={`${rengId}-cuerpo`} className="q-tm-bloque-cuerpo" hidden={!rengAbierto}>
        {rengAbierto && (
          <>
            {rengEsMapa && (
              <p className="notice q-tm-aviso" role="note">
                Mapa informativo de problemas abiertos. No es un curso: no tiene lecciones, ejercicios ni simulaciones y no cuenta en la cobertura.
              </p>
            )}
            {rengB.nota !== '' && <p className="q-tm-nota-bloque faint sm">{rengB.nota}</p>}
            {rengTemas.length > 0 && (
              <section className="q-tm-temas" aria-label={`Temas de práctica relacionados con el bloque ${rengB.numero}`}>
                <h5>Temas de práctica de este bloque</h5>
                <ul className="q-rejilla">
                  {rengTemas.map((rengT) => {
                    const rengTema = rengTemaPorId(rengT)
                    if (!rengTema) return null
                    return (
                      <li key={rengT}>
                        <RengTarjetaTema
                          id={rengTema.id}
                          nombre={rengTema.nombre}
                          pregunta={rengPreguntaDeTema(rengTema)}
                          rama={rengTema.rama}
                          miniatura={rengFichaDeTema(rengTema.id)?.miniatura ?? ''}
                          niveles={rengNivelesDeTema(rengTema.id)}
                          nivel={rengNivelPractica}
                          etiquetaAbrir={`Practicar ${rengTema.nombre}`}
                          onAbrir={() => rengOnIr({ etiqueta: 'Practicar', modulo: 'simulador-quimica', sub: `practicas-${rengTema.id}` })}
                        >
                          <button type="button" className="btn sm" onClick={() => rengOnIr({ etiqueta: 'Aprender', modulo: 'simulador-quimica', sub: `aprender-${rengTema.id}` })}>
                            Aprender
                          </button>
                        </RengTarjetaTema>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}
            {rengSubtemas.length === 0 ? (
              <p className="faint sm">Ningún subtema de este bloque coincide con la búsqueda.</p>
            ) : rengEsMapa ? (
              <ol className="q-tm-problemas">
                {rengSubtemas.map((rengS) => (
                  <li key={rengS.id} data-subtema={rengS.id} value={rengS.posicion}>
                    {rengS.titulo}
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="q-tm-subtemas" aria-label={`Subtemas del bloque ${rengB.numero}`}>
                {rengSubtemas.map((rengS) => (
                  <RengFilaSubtema key={rengS.id} subtema={rengS} onIr={rengOnIr} />
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </article>
  )
}

interface RengPropsNivel {
  nivel: RengNivelCatalogo
  abierto: boolean
  forzado: boolean
  plegado: RengPlegadoTemario
  bloquesVisibles: ReadonlySet<string> | null
  subtemasVisibles: ReadonlySet<string> | null
  nivelPractica: RengNivelPractica
  onAlternarNivel: () => void
  onAlternarBloque: (rengId: string) => void
  onIr: (rengA: RengAccionRecurso) => void
}

function RengNivelSeccion({ nivel: rengN, abierto: rengAbierto, forzado: rengForzado, plegado: rengPlegado, bloquesVisibles: rengBloquesVisibles, subtemasVisibles: rengSubtemasVisibles, nivelPractica: rengNivelPractica, onAlternarNivel: rengOnNivel, onAlternarBloque: rengOnBloque, onIr: rengOnIr }: RengPropsNivel): React.JSX.Element {
  const rengId = useId()
  const rengBloques = rengBloquesVisibles ? rengN.bloques.filter((rengB) => rengBloquesVisibles.has(rengB.id)) : rengN.bloques
  const rengSubtemas = rengN.conteo.total
  return (
    <section className="q-tm-nivel" data-nivel-temario={rengN.numero} data-abierto={rengAbierto ? 'si' : 'no'} aria-labelledby={`${rengId}-titulo`}>
      <h3 className="q-tm-nivel-titulo" id={`${rengId}-titulo`}>
        <button type="button" className="q-tm-plegar" aria-expanded={rengAbierto} aria-controls={`${rengId}-cuerpo`} aria-disabled={rengForzado} onClick={rengForzado ? undefined : rengOnNivel} title={rengForzado ? 'Abierto por la búsqueda o por el nivel elegido' : undefined}>
          <span className="q-tm-flecha" aria-hidden="true">
            {rengAbierto ? '▾' : '▸'}
          </span>
          <span className="q-tm-nivel-nombre">
            Nivel {rengN.numero} · {rengTituloLegible(rengN.titulo)}
          </span>
          {rengN.numero === 8 ? <span className="q-tm-mapa">Mapa informativo</span> : <RengInsigniaEstado estado={rengN.estado} />}
          <span className="q-tm-cuenta faint sm">
            {rengN.bloques.length} {rengN.bloques.length === 1 ? 'bloque' : 'bloques'} · {rengSubtemas} subtemas{rengN.numero === 8 ? '' : ` · ${rengN.conteo.confirmados} confirmados · ${rengTextoCapas(rengN.conteo.porCapa)}`}
          </span>
        </button>
      </h3>
      <div id={`${rengId}-cuerpo`} className="q-tm-nivel-cuerpo" hidden={!rengAbierto}>
        {rengAbierto && (
          <>
            <p className="faint sm q-tm-descripcion">{rengN.descripcion}</p>
            {RENG_NIVELES_PLEGADOS_POR_DEFECTO.includes(rengN.numero) && rengN.conteo.confirmados === 0 && rengN.numero !== 8 && (
              <p className="notice q-tm-aviso" role="note">
                Nivel sin contenido: no hay lecciones, ejercicios ni simulaciones con fuente para estos bloques. Los títulos son los del temario y no afirman nada científico.
              </p>
            )}
            <div className="q-tm-bloques">
              {rengBloques.map((rengB) => (
                <RengBloque key={rengB.id} bloque={rengB} abierto={rengForzado ? rengSubtemasVisibles !== null || rengBloqueAbierto(rengPlegado, rengB.id) : rengBloqueAbierto(rengPlegado, rengB.id)} visibles={rengSubtemasVisibles} nivelPractica={rengNivelPractica} onAlternar={() => rengOnBloque(rengB.id)} onIr={rengOnIr} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default function RengTemario({ nivel: rengNivelPractica, onIr: rengOnIr }: RengProps): React.JSX.Element {
  const rengCatalogo = useMemo(() => rengCatalogoReal(), [])
  const [rengPlegado, rengSetPlegado] = useState<RengPlegadoTemario>(() => rengLeerPlegado(rengAlmacenSesion()))
  const [rengTexto, rengSetTexto] = useState('')
  const rengBusquedaId = useId()

  useEffect(() => {
    rengGuardarPlegado(rengAlmacenSesion(), rengPlegado)
  }, [rengPlegado])

  const rengBusqueda = useMemo(() => (rengTexto.trim() === '' ? null : rengBuscarEnCatalogo(rengCatalogo, rengTexto)), [rengCatalogo, rengTexto])
  const rengRuta = rengPlegado.ruta
  const rengNiveles = rengCatalogo.niveles.filter((rengN) => (rengRuta === null || rengN.numero === rengRuta) && (rengBusqueda === null || rengBusqueda.niveles.has(rengN.numero)))
  const rengAlternarN = useCallback((rengN: number): void => rengSetPlegado((rengP) => rengAlternarNivel(rengP, rengN)), [])
  const rengAlternarB = useCallback((rengId: string): void => rengSetPlegado((rengP) => rengAlternarBloque(rengP, rengId)), [])
  const rengCob = rengCatalogo.cobertura

  return (
    <div className="q-catalogo q-temario" data-temario>
      <header className="q-cabecera">
        <h2>Temario de Química</h2>
        <p className="muted sm">
          Ocho niveles del temario, 64 bloques y {rengCatalogo.subtemasTotales.toLocaleString('es')} subtemas. Aquí se ve qué hay de cada subtema y se abre. Los 4 niveles de práctica (Preuniv.–Científico) son otra cosa y se eligen en Prácticas.
        </p>
      </header>

      <div className="q-tm-resumen" role="group" aria-label="Cobertura del temario">
        <p className="q-tm-resumen-linea">
          <b data-cobertura="confirmados">{rengCob.confirmados}</b> de <b>{rengCob.total.toLocaleString('es')}</b> subtemas tienen algún recurso confirmado (estado Parcial) ·{' '}
          <span data-cobertura="completado">{rengCob.porEstado.completado} completados</span> · <span data-cobertura="verificado">{rengCob.porEstado.verificado} verificados</span> · <span data-cobertura="revisar">{rengCob.porRevisar} por revisar (no cuentan)</span> · {rengCob.sinRecurso.toLocaleString('es')} sin recurso.{' '}
          <span data-cobertura="capas">Por tipo de recurso: {rengTextoCapas(rengCob.porCapa)}.</span>
        </p>
        <p className="faint sm">El bloque 64 (problemas abiertos, 36 elementos) es un mapa informativo y queda fuera de este total.</p>
        <details className="q-tm-leyenda">
          <summary>¿Qué significa cada estado?</summary>
          <dl>
            {RENG_ESTADOS_COBERTURA.map((rengE) => (
              <div key={rengE}>
                <dt>
                  <RengInsigniaEstado estado={rengE} />
                </dt>
                <dd>{RENG_DEFINICION_ESTADO_COBERTURA[rengE]}</dd>
              </div>
            ))}
          </dl>
          <p className="faint sm">El estado es de cobertura (qué existe) y sale del código. «Datos: …» indica por separado el nivel de verificación del recurso más débil.</p>
        </details>
      </div>

      <div className="q-filtros">
        <input id={rengBusquedaId} className="input" type="search" placeholder="Buscar un subtema, un bloque o un id (por ejemplo, Stock o n1-b5-s4)" aria-label="Buscar en el temario" value={rengTexto} onChange={(rengE) => rengSetTexto(rengE.target.value)} />
        <div className="q-chips" role="group" aria-label="Nivel del temario (distinto del nivel de práctica)">
          <button type="button" className="q-chip" aria-pressed={rengRuta === null} onClick={() => rengSetPlegado((rengP) => rengElegirRuta(rengP, null))}>
            Todos los niveles
          </button>
          {rengCatalogo.niveles.map((rengN) => (
            <button key={rengN.numero} type="button" className="q-chip" aria-pressed={rengRuta === rengN.numero} title={`Nivel ${rengN.numero}: ${rengTituloLegible(rengN.titulo)}`} onClick={() => rengSetPlegado((rengP) => rengElegirRuta(rengP, rengP.ruta === rengN.numero ? null : rengN.numero))}>
              Nivel {rengN.numero}
            </button>
          ))}
        </div>
      </div>

      <p className="q-resultados faint sm" role="status">
        {rengBusqueda ? `${rengBusqueda.subtemas.size} subtemas en ${rengBusqueda.bloques.size} bloques` : rengRuta ? `Nivel ${rengRuta}` : 'Todos los niveles'}
      </p>

      {rengNiveles.length === 0 && (
        <div className="notice q-sin-resultados" role="status">
          <span>Nada coincide con «{rengTexto.trim()}»{rengRuta ? ` en el Nivel ${rengRuta}` : ''}.</span>
          <button type="button" className="btn sm" onClick={() => rengSetTexto('')}>
            Limpiar búsqueda
          </button>
        </div>
      )}

      <div className="q-tm-niveles">
        {rengNiveles.map((rengN) => {
          const rengForzado = rengBusqueda !== null || rengRuta !== null
          return (
            <RengNivelSeccion
              key={rengN.numero}
              nivel={rengN}
              abierto={rengForzado || rengNivelAbierto(rengPlegado, rengN.numero)}
              forzado={rengForzado}
              plegado={rengPlegado}
              bloquesVisibles={rengBusqueda ? rengBusqueda.bloques : null}
              subtemasVisibles={rengBusqueda ? rengBusqueda.subtemas : null}
              nivelPractica={rengNivelPractica}
              onAlternarNivel={() => rengAlternarN(rengN.numero)}
              onAlternarBloque={rengAlternarB}
              onIr={rengOnIr}
            />
          )
        })}
      </div>
    </div>
  )
}
