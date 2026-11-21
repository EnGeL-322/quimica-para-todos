import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RengProgress } from '@/shell/ui'
import { RENG_LECCIONES, RENG_RUTA_INICIACION, rengLeccionDeTema } from '../aprender/lecciones'
import { RENG_CLAVE_PROGRESO_LECCIONES, rengEstadoLeccion, rengLeerProgresoLecciones, rengProgresoDe, rengRegistrarComprobacion, rengSiguienteDeRuta, rengVerPaso, type RengEstadoLeccion, type RengProgresoLecciones } from '../aprender/progreso'
import { RENG_PASOS_LECCION, type RengLeccion } from '../aprender/tipos'
import { rengNivelParaTema, rengNivelesDeTema, rengNombreRama, rengTemaPorId } from '../practica/banco'
import { rengFichaDeTema, rengPreguntaDeTema } from '../practica/fichasTema'
import { RENG_MODELOS_ESCENA, type RengEscena } from '../practica/modelosSimulacion'
import { RENG_INFO_NIVEL_PRACTICA, RENG_NIVELES_PRACTICA, type RengNivelPractica } from '../practica/niveles'
import { RengEstructura2D } from '../vista/Estructura2D'
import { RengExploradorTemas, RENG_FILTRO_VACIO, type RengFiltroTemas } from '../vista/ExploradorTemas'
import { RengMiniatura } from '../vista/TarjetaTema'
import { rengEsCampoDeTexto } from '../vista/nivel'

interface RengProps {
  nivel: RengNivelPractica
  activo: boolean
  temaDirecto: { id: string; n: number } | null
  onPracticar: (rengTema: string) => void
  onSimular: (rengEscena: RengEscena) => void
  onAbrirEnMesa: (rengSmiles: string, rengModo: 'reemplazar' | 'anadir') => void
  mesaVacia: boolean
  volverAPractica?: () => void
  extra?: React.ReactNode
}

const RENG_IDS_TEMAS = new Set(RENG_LECCIONES.map((rengL) => rengL.tema))

const rengAlmacenLocal = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

const RENG_TEXTO_ESTADO: Record<RengEstadoLeccion, string> = { 'sin-empezar': 'Sin empezar', 'en-curso': 'En curso', comprobada: 'Comprobada' }

function rengLeerProgreso(): RengProgresoLecciones {
  try {
    return rengLeerProgresoLecciones(rengAlmacenLocal()?.getItem(RENG_CLAVE_PROGRESO_LECCIONES), RENG_IDS_TEMAS, RENG_PASOS_LECCION.length - 1)
  } catch {
    return rengLeerProgresoLecciones(null, RENG_IDS_TEMAS, RENG_PASOS_LECCION.length - 1)
  }
}

function RengPasoEntender({ leccion: rengL, nivel: rengNivel }: { leccion: RengLeccion; nivel: RengNivelPractica }): React.JSX.Element {
  const rengTema = rengTemaPorId(rengL.tema)!
  const rengEfectivo = rengNivelParaTema(rengL.tema, rengNivel) ?? rengNivel
  const rengFicha = rengFichaDeTema(rengL.tema)
  return (
    <div className="stack q-leccion-cuerpo">
      <p className="q-objetivo">
        <strong>Objetivo.</strong> {rengL.objetivo}
      </p>
      {rengFicha && (
        <figure className="q-esquema">
          <RengMiniatura nombre={rengFicha.miniatura} rama={rengTema.rama} />
          <figcaption className="faint sm">Esquema didáctico del tema: sus proporciones y valores son ilustrativos, no mediciones.</figcaption>
        </figure>
      )}
      {rengL.conceptos.map((rengC) => (
        <p key={rengC}>{rengC}</p>
      ))}
      <div className="notice" role="note">
        <strong>En tu nivel ({RENG_INFO_NIVEL_PRACTICA[rengEfectivo].nombre}):</strong> {rengL.porNivel[rengEfectivo]}
        {rengEfectivo !== rengNivel && <span className="faint sm"> (Tu nivel preferido, {RENG_INFO_NIVEL_PRACTICA[rengNivel].nombre}, no tiene práctica en este tema.)</span>}
      </div>
      <details className="q-panel">
        <summary>Qué cambia en cada nivel</summary>
        <ul>
          {RENG_NIVELES_PRACTICA.filter((rengN) => rengL.porNivel[rengN]).map((rengN) => (
            <li key={rengN}>
              <strong>{RENG_INFO_NIVEL_PRACTICA[rengN].nombre}.</strong> {rengL.porNivel[rengN]}
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}

function RengEstructuras({ estructuras: rengE }: { estructuras: NonNullable<RengLeccion['ejemplo']['estructuras']> }): React.JSX.Element {
  return (
    <div className="q-estructuras">
      {rengE.map((rengX) => (
        <div key={rengX.smiles} className="q-estructura-bloque">
          <RengEstructura2D smiles={rengX.smiles} descripcion={rengX.descripcion} />
          <p className="faint sm">{rengX.descripcion}</p>
          {rengX.numeracion && <p className="sm">Numeración: {rengX.numeracion}</p>}
        </div>
      ))}
    </div>
  )
}

function RengPasoEjemplo({ leccion: rengL, onVerResolucion: rengOnVer }: { leccion: RengLeccion; onVerResolucion: () => void }): React.JSX.Element {
  const rengE = rengL.ejemplo
  return (
    <div className="stack q-leccion-cuerpo">
      <h3>{rengE.titulo}</h3>
      <p>{rengE.enunciado}</p>
      <dl className="q-datos">
        {rengE.datos.map((rengD) => (
          <div key={rengD.etiqueta}>
            <dt>{rengD.etiqueta}</dt>
            <dd>{rengD.valor}</dd>
          </div>
        ))}
      </dl>
      {rengE.estructuras && <RengEstructuras estructuras={rengE.estructuras} />}
      <p className="muted sm">Antes de ver la resolución, piensa qué dato usarías primero y qué ecuación o regla eliges. Este ejemplo es distinto de los de la práctica.</p>
      <div className="row">
        <button type="button" className="btn primary" onClick={rengOnVer}>
          Resolverlo paso a paso
        </button>
      </div>
    </div>
  )
}

function RengPasoResolver({ leccion: rengL, reveladas: rengReveladas, onRevelar: rengOnRevelar }: { leccion: RengLeccion; reveladas: number; onRevelar: (rengN: number) => void }): React.JSX.Element {
  const rengE = rengL.ejemplo
  const rengTotal = rengE.pasos.length
  const rengCompleto = rengReveladas >= rengTotal
  return (
    <div className="stack q-leccion-cuerpo">
      <p className="sm muted">{rengE.enunciado}</p>
      <ol className="q-pasos">
        {rengE.pasos.slice(0, rengReveladas).map((rengP, rengI) => (
          <li key={rengP.accion}>
            <p>
              <strong>Paso {rengI + 1}.</strong> {rengP.accion}
            </p>
            <ul className="sm">
              <li>
                <em>Dato que se usa:</em> {rengP.dato}
              </li>
              <li>
                <em>Por qué se elige:</em> {rengP.porQue}
              </li>
              <li>
                <em>Cómo interpretarlo:</em> {rengP.interpretar}
              </li>
            </ul>
          </li>
        ))}
      </ol>
      {!rengCompleto && (
        <div className="row">
          <button type="button" className="btn primary" onClick={() => rengOnRevelar(rengReveladas + 1)}>
            Mostrar el paso {rengReveladas + 1} de {rengTotal}
          </button>
          <button type="button" className="btn" onClick={() => rengOnRevelar(rengTotal)}>
            Mostrar todos
          </button>
        </div>
      )}
      {rengCompleto && (
        <div className="stack" role="status">
          <div className="notice ok">
            <strong>Resultado.</strong> {rengE.resultado.texto}
          </div>
          <p>
            <strong>Error típico.</strong> {rengE.errorTipico}
          </p>
          <p>
            <strong>Cómo revisar la respuesta.</strong> {rengE.revision}
          </p>
        </div>
      )}
    </div>
  )
}

function RengPasoComprobar({ leccion: rengL, estado: rengEstado, onResponder: rengOnResponder }: { leccion: RengLeccion; estado: RengProgresoLecciones; onResponder: (rengCorrecta: boolean) => void }): React.JSX.Element {
  const [rengElegida, rengSetElegida] = useState<string | null>(null)
  const [rengComprobada, rengSetComprobada] = useState<boolean | null>(null)
  const rengC = rengL.comprobacion
  const rengYa = rengProgresoDe(rengEstado, rengL.tema)
  return (
    <form
      className="stack q-leccion-cuerpo"
      onSubmit={(rengEv) => {
        rengEv.preventDefault()
        if (!rengElegida) return
        const rengOk = rengElegida === rengC.correcta
        rengSetComprobada(rengOk)
        rengOnResponder(rengOk)
      }}
    >
      <fieldset className="q-opciones">
        <legend>{rengC.pregunta}</legend>
        {rengC.opciones.map((rengO) => (
          <label key={rengO.id} className="q-opcion">
            <input type="radio" name="q-comprobacion" value={rengO.id} checked={rengElegida === rengO.id} onChange={() => { rengSetElegida(rengO.id); rengSetComprobada(null) }} />
            <span>{rengO.texto}</span>
          </label>
        ))}
      </fieldset>
      <div className="row">
        <button type="submit" className="btn primary" disabled={!rengElegida}>
          Comprobar
        </button>
        {rengYa.comprobacion === 'correcta' && rengComprobada === null && <span className="faint sm">Ya la acertaste antes.</span>}
      </div>
      <div role="status" aria-live="polite">
        {rengComprobada === true && (
          <div className="notice ok">
            <strong>Correcto.</strong> {rengC.explicacion}
          </div>
        )}
        {rengComprobada === false && (
          <div className="notice warn">
            <strong>Todavía no.</strong> Revisa el concepto y vuelve a intentarlo.
            <div className="sm">{rengC.explicacion}</div>
          </div>
        )}
      </div>
    </form>
  )
}

export default function RengAprender({ nivel: rengNivel, activo: rengActivo, temaDirecto: rengTemaDirecto, onPracticar: rengOnPracticar, onSimular: rengOnSimular, onAbrirEnMesa: rengOnAbrirEnMesa, mesaVacia: rengMesaVacia, volverAPractica: rengVolverAPractica, extra: rengExtra }: RengProps): React.JSX.Element {
  const [rengFiltro, rengSetFiltro] = useState<RengFiltroTemas>(RENG_FILTRO_VACIO)
  const [rengAbierto, rengSetAbierto] = useState<string | null>(null)
  const [rengPaso, rengSetPaso] = useState(0)
  const [rengReveladas, rengSetReveladas] = useState(1)
  const [rengConfirmaMesa, rengSetConfirmaMesa] = useState<string | null>(null)
  const [rengEnfocar, rengSetEnfocar] = useState<{ id: string; n: number } | null>(null)
  const [rengProgreso, rengSetProgreso] = useState<RengProgresoLecciones>(rengLeerProgreso)
  const rengProgresoRef = useRef(rengProgreso)
  rengProgresoRef.current = rengProgreso
  const rengUltimaDirecta = useRef(rengTemaDirecto?.n ?? 0)
  const rengTitulo = useRef<HTMLHeadingElement>(null)
  const rengRaiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      rengAlmacenLocal()?.setItem(RENG_CLAVE_PROGRESO_LECCIONES, JSON.stringify(rengProgreso))
    } catch {
    }
  }, [rengProgreso])

  const rengAbrir = useCallback((rengTema: string): void => {
    const rengP = rengProgresoDe(rengProgresoRef.current, rengTema)
    rengSetPaso(Math.min(rengP.paso, RENG_PASOS_LECCION.length - 1))
    rengSetReveladas(1)
    rengSetConfirmaMesa(null)
    rengSetAbierto(rengTema)
  }, [])

  const rengAbiertoRef = useRef<string | null>(null)
  rengAbiertoRef.current = rengAbierto

  useEffect(() => {
    if (!rengActivo) return
    if (rengTemaDirecto && rengTemaDirecto.n !== rengUltimaDirecta.current) {
      rengUltimaDirecta.current = rengTemaDirecto.n
      if (rengLeccionDeTema(rengTemaDirecto.id)) rengAbrir(rengTemaDirecto.id)
      return
    }
    const rengPrevio = rengAbiertoRef.current
    if (rengPrevio) rengSetEnfocar((rengE) => ({ id: rengPrevio, n: (rengE?.n ?? 0) + 1 }))
    rengSetAbierto(null)
  }, [rengActivo, rengTemaDirecto, rengAbrir])

  useEffect(() => {
    if (rengAbierto) rengTitulo.current?.focus({ preventScroll: true })
    rengRaiz.current?.closest('.quimica-aprender')?.scrollTo({ top: 0 })
  }, [rengAbierto])

  useEffect(() => {
    if (rengAbierto) rengSetProgreso((rengP) => rengVerPaso(rengP, rengAbierto, rengPaso))
  }, [rengAbierto, rengPaso])

  const rengVolver = useCallback((): void => {
    rengSetEnfocar((rengE) => (rengAbierto ? { id: rengAbierto, n: (rengE?.n ?? 0) + 1 } : rengE))
    rengSetAbierto(null)
  }, [rengAbierto])

  useEffect(() => {
    if (!rengActivo || !rengAbierto) return
    const rengTecla = (rengEv: KeyboardEvent): void => {
      if (rengEv.key !== 'Escape' || rengEv.defaultPrevented || rengEsCampoDeTexto(rengEv.target)) return
      rengEv.preventDefault()
      rengVolver()
    }
    window.addEventListener('keydown', rengTecla)
    return () => window.removeEventListener('keydown', rengTecla)
  }, [rengActivo, rengAbierto, rengVolver])

  const rengSiguienteRuta = useMemo(() => rengSiguienteDeRuta(rengProgreso, RENG_RUTA_INICIACION), [rengProgreso])
  const rengComprobadasRuta = RENG_RUTA_INICIACION.filter((rengId) => rengEstadoLeccion(rengProgreso, rengId) === 'comprobada').length

  const rengLeccion = rengAbierto ? rengLeccionDeTema(rengAbierto) : undefined
  const rengTema = rengAbierto ? rengTemaPorId(rengAbierto) : undefined

  if (rengLeccion && rengTema) {
    const rengEscena = rengTema.escena ? RENG_MODELOS_ESCENA[rengTema.escena] : null
    const rengNiveles = rengNivelesDeTema(rengTema.id)
    const rengPendientes = rengLeccion.prerrequisitos.filter((rengP) => rengEstadoLeccion(rengProgreso, rengP) !== 'comprobada')
    const rengUltimoPaso = RENG_PASOS_LECCION.length - 1
    return (
      <div className="q-aprender" ref={rengRaiz}>
        <header className="q-barra">
          {rengVolverAPractica && (
            <button type="button" className="btn primary sm" onClick={rengVolverAPractica} title="Vuelve al mismo ejercicio, con tu respuesta y tus pistas">
              ← Volver a la práctica
            </button>
          )}
          <button type="button" className="btn sm" onClick={rengVolver}>
            ← Volver a temas
          </button>
          <div className="q-barra-titulo">
            <h2 ref={rengTitulo} tabIndex={-1}>
              {rengTema.nombre}
            </h2>
            <span className="faint sm">
              {rengNombreRama(rengTema.rama)} · {RENG_TEXTO_ESTADO[rengEstadoLeccion(rengProgreso, rengTema.id)]}
            </span>
          </div>
        </header>

        {rengPendientes.length > 0 && (
          <div className="notice" role="note">
            <span>Conviene saber antes:</span>
            <span className="row q-prerreq">
              {rengPendientes.map((rengP) => (
                <button key={rengP} type="button" className="btn sm" onClick={() => rengAbrir(rengP)}>
                  {rengTemaPorId(rengP)?.nombre ?? rengP}
                </button>
              ))}
            </span>
          </div>
        )}

        <nav className="q-secuencia" aria-label="Pasos de la lección">
          <ol>
            {RENG_PASOS_LECCION.map((rengNombre, rengI) => (
              <li key={rengNombre}>
                <button type="button" className="q-secuencia-paso" aria-current={rengI === rengPaso ? 'step' : undefined} onClick={() => rengSetPaso(rengI)}>
                  <span className="q-secuencia-n" aria-hidden="true">
                    {rengI + 1}
                  </span>
                  <span>{rengNombre}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <section className="q-leccion" aria-label={`Paso ${rengPaso + 1}: ${RENG_PASOS_LECCION[rengPaso]}`}>
          <h3 className="q-paso-titulo">
            {rengPaso + 1}. {RENG_PASOS_LECCION[rengPaso]}
          </h3>
          {rengPaso === 0 && <RengPasoEntender leccion={rengLeccion} nivel={rengNivel} />}
          {rengPaso === 1 && <RengPasoEjemplo leccion={rengLeccion} onVerResolucion={() => rengSetPaso(2)} />}
          {rengPaso === 2 && <RengPasoResolver leccion={rengLeccion} reveladas={rengReveladas} onRevelar={rengSetReveladas} />}
          {rengPaso === 3 && <RengPasoComprobar key={rengLeccion.tema} leccion={rengLeccion} estado={rengProgreso} onResponder={(rengOk) => rengSetProgreso((rengP) => rengRegistrarComprobacion(rengP, rengLeccion.tema, rengOk))} />}
          {rengPaso === 4 && (
            <div className="stack q-leccion-cuerpo">
              <p>{rengPreguntaDeTema(rengTema)}</p>
              <p className="sm muted">Práctica disponible en: {rengNiveles.map((rengN) => RENG_INFO_NIVEL_PRACTICA[rengN].nombre).join(', ')}. Se abre en tu nivel preferido ({RENG_INFO_NIVEL_PRACTICA[rengNivel].nombre}) o en el más cercano que tenga ejercicios.</p>
              <div className="row">
                <button type="button" className="btn primary" onClick={() => rengOnPracticar(rengTema.id)}>
                  Practicar este tema
                </button>
              </div>
            </div>
          )}
          {rengPaso === 5 && (
            <div className="stack q-leccion-cuerpo">
              {rengLeccion.observar ? <p>{rengLeccion.observar.texto}</p> : <p>Este tema no tiene una simulación propia: sigue con la práctica.</p>}
              <div className="row">
                {rengEscena && (
                  <button type="button" className="btn primary" onClick={() => rengOnSimular(rengEscena.id)}>
                    Simular: {rengEscena.nombre}
                  </button>
                )}
                {rengLeccion.observar?.mesaSmiles && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      const rengSmiles = rengLeccion.observar!.mesaSmiles!
                      if (rengMesaVacia) rengOnAbrirEnMesa(rengSmiles, 'reemplazar')
                      else rengSetConfirmaMesa(rengSmiles)
                    }}
                  >
                    Abrir en Mesa molecular
                  </button>
                )}
              </div>
              {rengConfirmaMesa && (
                <div className="notice q-confirma" role="group" aria-label="Cómo incorporar la estructura a la Mesa">
                  <p className="sm">La Mesa ya tiene una construcción. ¿Cómo quieres incorporar esta estructura?</p>
                  <div className="row">
                    <button type="button" className="btn sm" onClick={() => { rengOnAbrirEnMesa(rengConfirmaMesa, 'anadir'); rengSetConfirmaMesa(null) }}>
                      Añadir junto a lo que hay
                    </button>
                    <button type="button" className="btn sm" onClick={() => { rengOnAbrirEnMesa(rengConfirmaMesa, 'reemplazar'); rengSetConfirmaMesa(null) }}>
                      Reemplazar la construcción
                    </button>
                    <button type="button" className="btn ghost sm" onClick={() => rengSetConfirmaMesa(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <footer className="q-leccion-pie">
          <button type="button" className="btn" disabled={rengPaso === 0} onClick={() => rengSetPaso(rengPaso - 1)}>
            ← Anterior
          </button>
          {rengPaso < rengUltimoPaso ? (
            <button type="button" className="btn primary" onClick={() => rengSetPaso(rengPaso + 1)}>
              Siguiente: {RENG_PASOS_LECCION[rengPaso + 1]} →
            </button>
          ) : (
            <button type="button" className="btn primary" onClick={rengVolver}>
              Terminar y volver a temas
            </button>
          )}
        </footer>

        <details className="q-panel q-fuentes">
          <summary>Fuentes y supuestos de la lección</summary>
          <ul>
            {rengLeccion.fuentes.map((rengF) => (
              <li key={rengF.texto}>
                {rengF.texto}
                {rengF.enlace && <span className="faint sm"> · {rengF.enlace}</span>}
                <div className="faint sm">
                  Consultada el {rengF.consultada}. {rengF.alcance}
                </div>
              </li>
            ))}
          </ul>
          <p className="faint sm">Los datos numéricos del ejemplo son didácticos, salvo que se indique otra cosa; no son mediciones publicadas.</p>
        </details>
      </div>
    )
  }

  return (
    <div className="q-aprender" ref={rengRaiz}>
      <header className="q-cabecera">
        <h2>Aprender química</h2>
        <p className="muted sm">Cada lección va del concepto a un ejemplo resuelto, una comprobación, la práctica y, si existe, la simulación.</p>
      </header>

      <section className="q-ruta" aria-labelledby="q-ruta-titulo">
        <div className="q-ruta-cab">
          <h3 id="q-ruta-titulo">Ruta de iniciación</h3>
          <span className="faint sm" role="status">
            {rengComprobadasRuta} de {RENG_RUTA_INICIACION.length} lecciones comprobadas
          </span>
        </div>
        <RengProgress pct={(100 * rengComprobadasRuta) / RENG_RUTA_INICIACION.length} />
        <ol className="q-ruta-lista">
          {RENG_RUTA_INICIACION.map((rengId) => (
            <li key={rengId}>
              <button type="button" className="q-chip" onClick={() => rengAbrir(rengId)} title={RENG_TEXTO_ESTADO[rengEstadoLeccion(rengProgreso, rengId)]}>
                {rengTemaPorId(rengId)?.nombre}
                <span className="sr-only"> ({RENG_TEXTO_ESTADO[rengEstadoLeccion(rengProgreso, rengId)]})</span>
                {rengEstadoLeccion(rengProgreso, rengId) === 'comprobada' && <span aria-hidden="true"> ✓</span>}
              </button>
            </li>
          ))}
        </ol>
        <div className="row">
          {rengSiguienteRuta ? (
            <button type="button" className="btn primary" onClick={() => rengAbrir(rengSiguienteRuta)}>
              {rengComprobadasRuta === 0 && rengEstadoLeccion(rengProgreso, rengSiguienteRuta) === 'sin-empezar' ? 'Empezar la ruta' : 'Continuar la ruta'}: {rengTemaPorId(rengSiguienteRuta)?.nombre}
            </button>
          ) : (
            <span className="notice ok">Completaste la ruta de iniciación.</span>
          )}
        </div>
      </section>

      <RengExploradorTemas
        idBase="q-apr"
        filtro={rengFiltro}
        onFiltro={rengSetFiltro}
        nivel={rengNivel}
        enfocar={rengEnfocar}
        onAbrir={(rengT) => rengAbrir(rengT.id)}
        etiquetaAbrir={(rengT) => `Abrir la lección de ${rengT.nombre}`}
        accionesDe={(rengT) => <span className="q-tarjeta-meta">{RENG_TEXTO_ESTADO[rengEstadoLeccion(rengProgreso, rengT.id)]}</span>}
      />
      {rengExtra}
    </div>
  )
}
