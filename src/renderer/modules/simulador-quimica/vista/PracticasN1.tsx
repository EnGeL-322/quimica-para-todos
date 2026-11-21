import { useEffect, useId, useMemo, useRef, useState } from 'react'
import '../aprender/n1/n1.css'
import { rengTx } from '../aprender/n1/gases/constantes'
import { rengCorregirN1, type RengVeredictoN1 } from '../practicas-n1/correccion'
import { rengActualizarAvanceN1, rengAvanceN1, rengGuardarProgresoN1, rengLeerProgresoN1, rengMarcarRevisadaN1, rengOtraSemillaN1, rengRegistrarIntentoN1, rengResumenN1, type RengAvanceN1, type RengProgresoN1 } from '../practicas-n1/progreso'
import { rengEsPracticaN1, rengGrupoN1PorId } from '../practicas-n1/registro'
import { RENG_ETIQUETA_DIFICULTAD_N1, type RengInstanciaN1 } from '../practicas-n1/tipos'
import { RENG_TEMARIO_GENERADO } from '../temario/datos.generado'
import { RENG_NOMBRE_VERIFICACION } from '../temario/verificacion'
import { rengEsCampoDeTexto } from './nivel'

interface RengProps {
  subtema: string
  activo: boolean
  onVolver: () => void
  onLeccion: (rengLeccion: string) => void
}

const rengAlmacenLocal = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

const rengTituloBloque = (rengNumero: number): string => RENG_TEMARIO_GENERADO.niveles.flatMap((rengN) => rengN.bloques).find((rengB) => rengB.numero === rengNumero)?.titulo ?? `Bloque ${rengNumero}`

const RENG_CLASE_VEREDICTO: Readonly<Record<RengVeredictoN1['tipo'], string>> = {
  correcto: 'notice ok',
  'error-tipico': 'notice warn',
  unidades: 'notice warn',
  cerca: 'notice warn',
  alto: 'notice err',
  bajo: 'notice err',
  'unidad-incompatible': 'notice warn',
  ilegible: 'notice warn'
}

export default function RengPracticasN1({ subtema: rengSubtema, activo: rengActivo, onVolver: rengOnVolver, onLeccion: rengOnLeccion }: RengProps): React.JSX.Element {
  const rengGrupo = rengGrupoN1PorId(rengSubtema)
  const [rengProgreso, rengSetProgreso] = useState<RengProgresoN1>(() => rengLeerProgresoN1(rengAlmacenLocal(), rengEsPracticaN1))
  const [rengElegida, rengSetElegida] = useState<string | null>(null)
  const [rengTexto, rengSetTexto] = useState('')
  const [rengVeredicto, rengSetVeredicto] = useState<RengVeredictoN1 | null>(null)
  const [rengPistas, rengSetPistas] = useState(0)
  const [rengResolucion, rengSetResolucion] = useState(false)
  const rengTitulo = useRef<HTMLHeadingElement>(null)
  const rengIdCampo = useId()

  const rengPractica = rengGrupo ? (rengGrupo.practicas.find((rengP) => rengP.id === rengElegida) ?? rengGrupo.practicas.find((rengP) => rengP.id === rengProgreso.ultima) ?? rengGrupo.practicas[0]) : undefined
  const rengAvance = rengPractica ? rengAvanceN1(rengProgreso, rengPractica.id) : null

  const rengInstancia = useMemo((): { ok: true; i: RengInstanciaN1 } | { ok: false; mensaje: string } | null => {
    if (!rengPractica || !rengAvance) return null
    try {
      return { ok: true, i: rengPractica.generar(rengAvance.semilla) }
    } catch (rengE) {
      return { ok: false, mensaje: rengE instanceof Error ? rengE.message : 'No se pudo generar esta variante.' }
    }
  }, [rengPractica, rengAvance?.semilla])

  useEffect(() => {
    rengGuardarProgresoN1(rengAlmacenLocal(), rengProgreso)
  }, [rengProgreso])

  useEffect(() => {
    rengSetElegida(null)
    rengTitulo.current?.focus({ preventScroll: true })
    rengTitulo.current?.closest('.quimica-practicas')?.scrollTo({ top: 0 })
  }, [rengSubtema])

  useEffect(() => {
    rengSetTexto('')
    rengSetVeredicto(null)
    rengSetPistas(0)
    rengSetResolucion(false)
  }, [rengPractica?.id, rengAvance?.semilla])

  useEffect(() => {
    if (!rengActivo) return
    const rengTecla = (rengEv: KeyboardEvent): void => {
      if (rengEv.key !== 'Escape' || rengEv.defaultPrevented || rengEsCampoDeTexto(rengEv.target)) return
      rengEv.preventDefault()
      rengOnVolver()
    }
    window.addEventListener('keydown', rengTecla)
    return () => window.removeEventListener('keydown', rengTecla)
  }, [rengActivo, rengOnVolver])

  if (!rengGrupo || !rengPractica || !rengAvance) {
    return (
      <div className="q-n1" data-practicas-n1="ausente">
        <div className="notice warn" role="status">
          No hay prácticas registradas para el subtema «{rengSubtema}».
        </div>
        <div className="row">
          <button type="button" className="btn" onClick={rengOnVolver}>
            ← Volver a Prácticas
          </button>
        </div>
      </div>
    )
  }

  const rengActualizar = (rengNuevo: RengAvanceN1): void => rengSetProgreso((rengP) => rengActualizarAvanceN1(rengP, rengPractica.id, rengNuevo))
  const rengUnidadTexto = rengPractica.unidad === '' ? 'sin unidad' : rengPractica.unidad

  const rengComprobar = (rengEv: React.FormEvent): void => {
    rengEv.preventDefault()
    if (!rengInstancia?.ok) return
    const rengV = rengCorregirN1(rengTexto, rengPractica, rengInstancia.i)
    rengSetVeredicto(rengV)
    if (rengV.tipo !== 'ilegible' && rengV.tipo !== 'unidad-incompatible') rengActualizar(rengRegistrarIntentoN1(rengAvance, rengV.tipo === 'correcto'))
  }

  return (
    <div className="q-n1" data-practicas-n1={rengGrupo.subtema}>
      <header className="q-n1-cabecera">
        <div className="row">
          <button type="button" className="btn sm" onClick={rengOnVolver}>
            ← Volver a Prácticas
          </button>
          <button type="button" className="btn sm" onClick={() => rengOnLeccion(rengGrupo.leccion)}>
            {rengGrupo.posicion === 0 ? 'Ver el capítulo' : 'Ver la lección'}
          </button>
        </div>
        <span className="q-n1-ruta" data-encabezado-bloque={rengGrupo.bloque}>
          Prácticas de Nivel 1 · Bloque {rengGrupo.bloque} · {rengTituloBloque(rengGrupo.bloque)}
        </span>
        <h2 ref={rengTitulo} tabIndex={-1}>
          {rengGrupo.posicion === 0 ? rengGrupo.titulo : `${rengGrupo.posicion}. ${rengGrupo.titulo}`}
        </h2>
      </header>

      <div className="q-n1-selector" role="group" aria-label="Prácticas del subtema">
        {rengGrupo.practicas.map((rengP) => {
          const rengR = rengResumenN1(rengProgreso.practicas[rengP.id])
          return (
            <button key={rengP.id} type="button" aria-pressed={rengP.id === rengPractica.id} data-practica={rengP.id} onClick={() => rengSetElegida(rengP.id)}>
              <strong>{RENG_ETIQUETA_DIFICULTAD_N1[rengP.dificultad]}</strong> · {rengP.titulo}
              {rengR.resuelta && <span> · ✓ {rengR.resueltas} resuelta{rengR.resueltas === 1 ? '' : 's'}</span>}
            </button>
          )
        })}
      </div>

      <section className="q-n1-capa" aria-label={`Práctica: ${rengPractica.titulo}`} data-practica-activa={rengPractica.id}>
        <h3>
          {RENG_ETIQUETA_DIFICULTAD_N1[rengPractica.dificultad]} · {rengPractica.titulo}
        </h3>
        <p className="muted sm">{rengPractica.objetivo}</p>
        {rengPractica.subtemas && <p className="sm" data-combina>Combina los subtemas {rengPractica.subtemas.map((rengS) => rengS.split('-s')[1]).join(', ')} del bloque {rengGrupo.bloque}.</p>}
        {rengInstancia && !rengInstancia.ok && (
          <div className="notice warn" role="status">
            {rengInstancia.mensaje}. Pide otra variante.
          </div>
        )}
        {rengInstancia?.ok && (
          <>
            <p data-enunciado>{rengInstancia.i.enunciado}</p>
            <dl className="q-datos">
              {rengInstancia.i.datos.map(([rengK, rengV]) => (
                <div key={rengK}>
                  <dt>{rengK}</dt>
                  <dd>{rengV}</dd>
                </div>
              ))}
            </dl>
            <p>
              <strong>{rengInstancia.i.pregunta}</strong>
            </p>
            <form className="q-n1-respuesta" onSubmit={rengComprobar}>
              <label htmlFor={rengIdCampo}>Tu respuesta ({rengUnidadTexto}):</label>
              <input id={rengIdCampo} className="input" type="text" inputMode="decimal" autoComplete="off" value={rengTexto} onChange={(rengEv) => rengSetTexto(rengEv.target.value)} data-respuesta-n1 />
              <button type="submit" className="btn primary" disabled={rengTexto.trim() === ''}>
                Comprobar
              </button>
            </form>
            <div role="status" aria-live="polite" data-veredicto-n1={rengVeredicto?.tipo ?? ''}>
              {rengVeredicto && (
                <div className={RENG_CLASE_VEREDICTO[rengVeredicto.tipo]}>
                  {rengVeredicto.mensaje}
                  {rengVeredicto.equivale && <div className="sm">{rengVeredicto.equivale}</div>}
                </div>
              )}
            </div>
            {rengPistas > 0 && (
              <ol className="sm" aria-label="Pistas">
                {rengInstancia.i.pistas.slice(0, rengPistas).map((rengP) => (
                  <li key={rengP}>{rengP}</li>
                ))}
              </ol>
            )}
            {rengResolucion && (
              <div className="stack tight" data-resolucion-n1>
                <ol className="q-pasos" aria-label="Resolución">
                  {rengInstancia.i.pasos.map((rengP) => (
                    <li key={rengP}>{rengP}</li>
                  ))}
                </ol>
                <div className="notice ok">
                  <strong>Respuesta:</strong> {rengTx(rengInstancia.i.respuesta, Math.max(3, rengPractica.cifras))}
                  {rengPractica.unidad === '' ? '' : ` ${rengPractica.unidad}`}
                </div>
              </div>
            )}
            <div className="row">
              {rengPistas < 3 && (
                <button type="button" className="btn sm" onClick={() => rengSetPistas((rengN) => Math.min(3, rengN + 1))}>
                  Ver una pista ({rengPistas + 1} de 3)
                </button>
              )}
              {!rengResolucion && (
                <button
                  type="button"
                  className="btn sm"
                  onClick={() => {
                    rengSetResolucion(true)
                    rengActualizar(rengMarcarRevisadaN1(rengAvance))
                  }}
                >
                  Ver la resolución
                </button>
              )}
              <button type="button" className="btn sm" onClick={() => rengActualizar(rengOtraSemillaN1(rengAvance))}>
                Otra variante
              </button>
            </div>
          </>
        )}
        {rengInstancia && !rengInstancia.ok && (
          <div className="row">
            <button type="button" className="btn sm" onClick={() => rengActualizar(rengOtraSemillaN1(rengAvance))}>
              Otra variante
            </button>
          </div>
        )}
        <p className="faint sm">
          Variante {rengAvance.semilla} · {rengResumenN1(rengAvance).resueltas} resueltas · {rengAvance.intentos} intentos
        </p>
      </section>

      <details className="q-panel q-fuentes">
        <summary>Procedencia de los datos de esta práctica</summary>
        <ul className="q-n1-procedencia">
          {rengPractica.procedencia.map((rengP) => (
            <li key={rengP.detalle}>
              <span className="q-n1-etiqueta">{RENG_NOMBRE_VERIFICACION[rengP.nivel]}</span>
              {rengP.detalle}
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
