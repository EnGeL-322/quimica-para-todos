import { useEffect, useRef, useState } from 'react'
import '../aprender/n1/n1.css'
import { rengCapituloN1PorId, rengEjemploN1PorId, rengFiguraN1PorId, rengLeccionN1DeSubtema, rengLeccionN1PorId, rengNumeroFiguraN1 } from '../aprender/n1/registro'
import type { RengCapituloN1, RengLeccionN1 } from '../aprender/n1/tipos'
import { rengEscenaN1PorId } from '../escenas-n1/registro'
import { rengGrupoN1DeSubtema, rengGrupoN1PorId } from '../practicas-n1/registro'
import { RENG_TEMARIO_GENERADO } from '../temario/datos.generado'
import { RENG_NOMBRE_VERIFICACION } from '../temario/verificacion'
import { RengEscenaN1 } from './EscenaN1'
import { RengComprobarN1, RengEjemploResueltoN1, RengFiguraLeccionN1, RengGlosarioN1 } from './LeccionN1Partes'
import { rengEsCampoDeTexto } from './nivel'
import { RengEcuacionTex } from './tex/EcuacionTex'

interface RengProps {
  id: string
  activo: boolean
  onVolver: () => void
  onPracticar: (rengSubtema: string) => void
  onIr: (rengModulo: string, rengSub: string) => void
  onAbrir?: (rengId: string) => void
}

const RENG_PREFIJO_ESCENA = 'escena-'

const rengTituloBloque = (rengNumero: number): string => RENG_TEMARIO_GENERADO.niveles.flatMap((rengN) => rengN.bloques).find((rengB) => rengB.numero === rengNumero)?.titulo ?? `Bloque ${rengNumero}`
const rengTituloSubtema = (rengId: string): string => RENG_TEMARIO_GENERADO.niveles.flatMap((rengN) => rengN.bloques.flatMap((rengB) => rengB.subtemas)).find((rengS) => rengS.id === rengId)?.titulo ?? rengId
const rengPartesSubtema = (rengId: string): { bloque: string; posicion: string } => {
  const rengM = /^n\d-b(\d{1,2})-s(\d{1,2})$/.exec(rengId)
  return { bloque: rengM?.[1] ?? '?', posicion: rengM?.[2] ?? '?' }
}

export const rengVistaN1Existe = (rengId: string | null | undefined): boolean =>
  rengLeccionN1PorId(rengId) !== undefined || rengCapituloN1PorId(rengId) !== undefined || (typeof rengId === 'string' && rengId.startsWith(RENG_PREFIJO_ESCENA) && rengEscenaN1PorId(rengId.slice(RENG_PREFIJO_ESCENA.length)) !== undefined)

function RengEnlaceSubtema({ subtema: rengS, onAbrir: rengOnAbrir }: { subtema: string; onAbrir?: (rengId: string) => void }): React.JSX.Element {
  const rengL = rengLeccionN1DeSubtema(rengS)
  const rengP = rengPartesSubtema(rengS)
  const rengTexto = `Bloque ${rengP.bloque}, subtema ${rengP.posicion}: ${rengTituloSubtema(rengS)}`
  if (rengL && rengOnAbrir) {
    return (
      <button type="button" className="btn sm" data-ir-subtema={rengS} onClick={() => rengOnAbrir(rengL.id)}>
        {rengTexto}
      </button>
    )
  }
  return <span data-ir-subtema={rengS}>{rengTexto} (todavía sin lección por capas)</span>
}

function useRengEscape(rengActivo: boolean, rengOnVolver: () => void): void {
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
}

export default function RengLeccionN1({ id: rengId, activo: rengActivo, onVolver: rengOnVolver, onPracticar: rengOnPracticar, onIr: rengOnIr, onAbrir: rengOnAbrir }: RengProps): React.JSX.Element {
  const rengTitulo = useRef<HTMLHeadingElement>(null)
  useRengEscape(rengActivo, rengOnVolver)
  useEffect(() => {
    rengTitulo.current?.focus({ preventScroll: true })
    rengTitulo.current?.closest('.quimica-aprender')?.scrollTo({ top: 0 })
  }, [rengId])

  const rengL = rengLeccionN1PorId(rengId)
  if (rengL) return <RengLeccion key={rengL.id} leccion={rengL} titulo={rengTitulo} onVolver={rengOnVolver} onPracticar={rengOnPracticar} onIr={rengOnIr} onAbrir={rengOnAbrir} />
  const rengC = rengCapituloN1PorId(rengId)
  if (rengC) return <RengCapitulo capitulo={rengC} titulo={rengTitulo} onVolver={rengOnVolver} onPracticar={rengOnPracticar} onAbrir={rengOnAbrir} />
  const rengEsc = rengId.startsWith(RENG_PREFIJO_ESCENA) ? rengEscenaN1PorId(rengId.slice(RENG_PREFIJO_ESCENA.length)) : undefined
  if (rengEsc) {
    return (
      <div className="q-n1" data-escena-suelta={rengEsc.id}>
        <header className="q-n1-cabecera">
          <div className="row">
            <button type="button" className="btn sm" onClick={rengOnVolver}>
              ← Volver a Aprender
            </button>
          </div>
          <span className="q-n1-ruta">Simulación del Nivel 1 · usada en {rengEsc.subtemas.length} subtemas</span>
          <h2 ref={rengTitulo} tabIndex={-1}>
            {rengEsc.nombre}
          </h2>
        </header>
        <RengEscenaN1 modelo={rengEsc} />
        {rengOnAbrir && (
          <section className="q-n1-capa" aria-label="Lecciones que usan esta simulación">
            <h3>Lecciones que usan esta simulación</h3>
            <ul className="q-n1-lista-enlaces">
              {rengEsc.subtemas.map((rengS) => (
                <li key={rengS}>
                  <RengEnlaceSubtema subtema={rengS} onAbrir={rengOnAbrir} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    )
  }
  return (
    <div className="q-n1" data-leccion-n1="ausente">
      <div className="notice warn" role="status">
        No se encontró la lección «{rengId}».
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={rengOnVolver}>
          ← Volver a Aprender
        </button>
      </div>
    </div>
  )
}

interface RengPropsLeccion {
  leccion: RengLeccionN1
  titulo: React.RefObject<HTMLHeadingElement | null>
  onVolver: () => void
  onPracticar: (rengSubtema: string) => void
  onIr: (rengModulo: string, rengSub: string) => void
  onAbrir?: (rengId: string) => void
}

function RengLeccion({ leccion: rengL, titulo: rengTitulo, onVolver: rengOnVolver, onPracticar: rengOnPracticar, onIr: rengOnIr, onAbrir: rengOnAbrir }: RengPropsLeccion): React.JSX.Element {
  const [rengEcTexto, rengSetEcTexto] = useState(false)
  const rengGrupo = rengGrupoN1DeSubtema(rengL.subtema)
  const rengEscena = rengL.escena ? rengEscenaN1PorId(rengL.escena.id) : undefined
  const rengEjemplos = rengL.ejemplos.map((rengX) => rengEjemploN1PorId(rengX)).filter((rengX) => rengX !== undefined)
  const rengFiguras = rengL.figuras.map((rengX) => rengFiguraN1PorId(rengX)).filter((rengX) => rengX !== undefined)
  const rengCap = `capitulo-b${rengL.bloque}`
  const rengHayExplorar = rengL.explorar !== null || rengEscena !== undefined
  const rengNumExplorar = 4
  const rengNumComprobar = rengHayExplorar ? 5 : 4

  return (
    <div className="q-n1" data-leccion-n1={rengL.id} data-subtema={rengL.subtema}>
      <header className="q-n1-cabecera">
        <div className="row">
          <button type="button" className="btn sm" onClick={rengOnVolver}>
            ← Volver a Aprender
          </button>
          {rengGrupo && (
            <button type="button" className="btn sm" onClick={() => rengOnPracticar(rengL.subtema)}>
              Practicar este subtema
            </button>
          )}
          {rengOnAbrir && rengCapituloN1PorId(rengCap) && (
            <button type="button" className="btn sm" onClick={() => rengOnAbrir(rengCap)}>
              Portada del capítulo
            </button>
          )}
        </div>
        <span className="q-n1-ruta">
          Nivel 1 · Bloque {rengL.bloque} · {rengTituloBloque(rengL.bloque)} · Subtema {rengL.posicion}
        </span>
        <h2 ref={rengTitulo} tabIndex={-1}>
          {rengL.nombre}
        </h2>
        <p className="muted">{rengL.pregunta}</p>
        <div>
          <strong>Objetivos.</strong> Al terminar podrás:
          <ol className="q-n1-objetivos">
            {rengL.objetivos.map((rengO) => (
              <li key={rengO}>{rengO}</li>
            ))}
          </ol>
        </div>
        {rengL.conexiones.prerrequisitos.length > 0 && (
          <div className="q-n1-prerrequisitos">
            <strong>Conviene haber visto antes:</strong>
            <ul className="q-n1-lista-enlaces">
              {rengL.conexiones.prerrequisitos.map((rengS) => (
                <li key={rengS}>
                  <RengEnlaceSubtema subtema={rengS} onAbrir={rengOnAbrir} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <section className="q-n1-capa" aria-labelledby={`${rengL.id}-importa`} data-seccion="por-que-importa">
        <h3 id={`${rengL.id}-importa`}>Por qué importa</h3>
        <p>{rengL.porQueImporta}</p>
      </section>

      <section className="q-n1-capa" aria-labelledby={`${rengL.id}-comprender`} data-capa="comprender">
        <h3 id={`${rengL.id}-comprender`}>1. Comprender</h3>
        <p>{rengL.comprender.idea}</p>
        <p>
          <strong>Para imaginarlo.</strong> {rengL.comprender.imagen}
        </p>
        <div className="q-n1-analogia">
          <p>
            <strong>Una analogía.</strong> {rengL.comprender.analogia}
          </p>
          <p>
            <strong>Dónde falla la analogía.</strong> {rengL.comprender.analogiaLimite}
          </p>
        </div>
      </section>

      <section className="q-n1-capa" aria-labelledby={`${rengL.id}-formalizar`} data-capa="formalizar">
        <h3 id={`${rengL.id}-formalizar`}>2. Formalizar</h3>
        <div className="row">
          <button type="button" className="btn sm" aria-pressed={rengEcTexto} data-ecuaciones-texto onClick={() => rengSetEcTexto((rengV) => !rengV)}>
            {rengEcTexto ? 'Ver ecuaciones con notación matemática' : 'Ver ecuaciones como texto'}
          </button>
        </div>
        <ul className="q-n1-ecuaciones">
          {rengL.formalizar.ecuaciones.map((rengQ, rengI) => {
            const rengNumero = `${rengL.bloque}.${rengL.posicion}.${rengI + 1}`
            return (
              <li key={rengQ.nombre}>
                <h4>{rengQ.nombre}</h4>
                {rengQ.tex ? (
                  <RengEcuacionTex tex={rengQ.tex} texto={rengQ.texto} bloque modoTexto={rengEcTexto} numero={rengNumero} id={`ec-${rengNumero.replaceAll('.', '-')}`} />
                ) : (
                  <p className="q-n1-ecuacion" id={`ec-${rengNumero.replaceAll('.', '-')}`}>
                    {rengQ.texto} <span className="q-ec-numero">({rengNumero})</span>
                  </p>
                )}
                <p className="muted">{rengQ.lectura}</p>
              </li>
            )
          })}
        </ul>
        <table className="q-n1-tabla">
          <caption className="sr-only">Magnitudes y unidades</caption>
          <thead>
            <tr>
              <th scope="col">Símbolo</th>
              <th scope="col">Magnitud</th>
              <th scope="col">Unidad</th>
            </tr>
          </thead>
          <tbody>
            {rengL.formalizar.variables.map((rengV) => (
              <tr key={`${rengV.simbolo}-${rengV.nombre}`}>
                <td>{rengV.simbolo}</td>
                <td>{rengV.nombre}</td>
                <td>{rengV.unidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4>Supuestos</h4>
        <ul>
          {rengL.formalizar.supuestos.map((rengS) => (
            <li key={rengS}>{rengS}</li>
          ))}
        </ul>
        <p>
          <strong>Límites del modelo.</strong> {rengL.formalizar.limites}
        </p>
        {rengFiguras.map((rengF, rengI) => (
          <RengFiguraLeccionN1 key={rengF.id} figura={rengF} numero={rengNumeroFiguraN1(rengL, rengI)} />
        ))}
      </section>

      <section className="q-n1-capa" aria-labelledby={`${rengL.id}-aplicar`} data-capa="aplicar">
        <h3 id={`${rengL.id}-aplicar`}>3. Aplicar</h3>
        {rengEjemplos.map((rengE, rengI) => (
          <RengEjemploResueltoN1 key={rengE.id} ejemplo={rengE} numero={`${rengL.bloque}.${rengL.posicion}.${rengI + 1}`} tipo={rengI === 0 ? 'directo' : 'integrador'} />
        ))}
        <h4>Errores frecuentes y cómo corregirlos</h4>
        <ul className="q-n1-errores">
          {rengL.errores.map((rengE) => (
            <li key={rengE.error}>
              <p>
                <strong>Error.</strong> {rengE.error}
              </p>
              <p>
                <strong>Corrección.</strong> {rengE.correccion}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {rengHayExplorar && (
        <section className="q-n1-capa" aria-labelledby={`${rengL.id}-explorar`} data-capa="explorar">
          <h3 id={`${rengL.id}-explorar`}>{rengNumExplorar}. Explorar</h3>
          {rengEscena && rengL.escena && (
            <>
              <p>{rengL.escena.instruccion}</p>
              <p className="muted">
                <strong>Qué no muestra.</strong> {rengL.escena.limite}
              </p>
              <RengEscenaN1 modelo={rengEscena} valores={rengL.escena.valores} numeroFigura={`${rengL.bloque}.${rengL.posicion}.${rengFiguras.length + 1}`} />
            </>
          )}
          {rengL.explorar && (
            <>
              <p>{rengL.explorar.instruccion}</p>
              <p className="muted">
                <strong>Qué no muestra.</strong> {rengL.explorar.limite}
              </p>
              <div className="row">
                <button type="button" className="btn" onClick={() => rengOnIr(rengL.explorar!.modulo, rengL.explorar!.sub)}>
                  Abrir: {rengL.explorar.nombre}
                </button>
              </div>
            </>
          )}
        </section>
      )}

      <section className="q-n1-capa" aria-labelledby={`${rengL.id}-comprobar`} data-seccion="comprobar">
        <h3 id={`${rengL.id}-comprobar`}>{rengNumComprobar}. Para comprobar</h3>
        <p className="muted sm">Elige una opción y pulsa «Comprobar la respuesta»: verás por qué es correcta o qué confusión hay detrás. Las respuestas no se guardan.</p>
        <RengComprobarN1 preguntas={rengL.comprobar} prefijo={rengL.id} />
      </section>

      <section className="q-n1-capa" aria-labelledby={`${rengL.id}-resumen`} data-seccion="resumen">
        <h3 id={`${rengL.id}-resumen`}>Resumen</h3>
        <ul>
          {rengL.resumen.map((rengR) => (
            <li key={rengR}>{rengR}</li>
          ))}
        </ul>
        <h4>Glosario</h4>
        <RengGlosarioN1 terminos={rengL.glosario} />
      </section>

      <nav className="q-n1-capa" aria-label="Conexiones con otros subtemas" data-seccion="conexiones">
        <h3>Antes y después</h3>
        <ul className="q-n1-lista-enlaces">
          {rengL.conexiones.anterior && (
            <li>
              Anterior: <RengEnlaceSubtema subtema={rengL.conexiones.anterior} onAbrir={rengOnAbrir} />
            </li>
          )}
          {rengL.conexiones.siguiente && (
            <li>
              Siguiente: <RengEnlaceSubtema subtema={rengL.conexiones.siguiente} onAbrir={rengOnAbrir} />
            </li>
          )}
        </ul>
      </nav>

      <details className="q-panel q-fuentes">
        <summary>Procedencia de los datos y fuentes</summary>
        <ul className="q-n1-procedencia">
          {rengL.procedencia.map((rengP) => (
            <li key={rengP.detalle}>
              <span className="q-n1-etiqueta">{RENG_NOMBRE_VERIFICACION[rengP.nivel]}</span>
              {rengP.detalle}
            </li>
          ))}
        </ul>
      </details>

      <footer className="row">
        {rengGrupo && (
          <button type="button" className="btn primary" onClick={() => rengOnPracticar(rengL.subtema)}>
            Practicar este subtema ({rengGrupo.practicas.length} prácticas)
          </button>
        )}
        <button type="button" className="btn" onClick={rengOnVolver}>
          Terminar y volver a Aprender
        </button>
      </footer>
    </div>
  )
}

interface RengPropsCapitulo {
  capitulo: RengCapituloN1
  titulo: React.RefObject<HTMLHeadingElement | null>
  onVolver: () => void
  onPracticar: (rengSubtema: string) => void
  onAbrir?: (rengId: string) => void
}

function RengCapitulo({ capitulo: rengC, titulo: rengTitulo, onVolver: rengOnVolver, onPracticar: rengOnPracticar, onAbrir: rengOnAbrir }: RengPropsCapitulo): React.JSX.Element {
  const rengIntegradores = rengGrupoN1PorId(rengC.integradores)
  return (
    <div className="q-n1" data-capitulo-n1={rengC.id}>
      <header className="q-n1-cabecera">
        <div className="row">
          <button type="button" className="btn sm" onClick={rengOnVolver}>
            ← Volver a Aprender
          </button>
        </div>
        <span className="q-n1-ruta">Nivel 1 · Capítulo del bloque {rengC.bloque}</span>
        <h2 ref={rengTitulo} tabIndex={-1}>
          {rengC.titulo}
        </h2>
        <p>{rengC.introduccion}</p>
      </header>

      <section className="q-n1-capa" aria-labelledby={`${rengC.id}-objetivos`} data-seccion="portada">
        <h3 id={`${rengC.id}-objetivos`}>Portada: qué aprenderás</h3>
        <ol className="q-n1-objetivos">
          {rengC.objetivos.map((rengO) => (
            <li key={rengO}>{rengO}</li>
          ))}
        </ol>
        <h4>Mapa de subtemas y ruta sugerida</h4>
        <p className="muted sm">La ruta es una recomendación: puedes abrir cualquier subtema en cualquier orden.</p>
        <table className="q-n1-tabla" data-mapa-capitulo>
          <caption className="sr-only">Subtemas del capítulo con sus prerrequisitos</caption>
          <thead>
            <tr>
              <th scope="col">Orden sugerido</th>
              <th scope="col">Subtema</th>
              <th scope="col">Conviene antes</th>
            </tr>
          </thead>
          <tbody>
            {rengC.ruta.map((rengS, rengI) => {
              const rengL = rengLeccionN1DeSubtema(rengS)
              return (
                <tr key={rengS}>
                  <td>{rengI + 1}</td>
                  <td>
                    <RengEnlaceSubtema subtema={rengS} onAbrir={rengOnAbrir} />
                  </td>
                  <td>{rengL && rengL.conexiones.prerrequisitos.length > 0 ? rengL.conexiones.prerrequisitos.map((rengP) => `subtema ${rengPartesSubtema(rengP).posicion}`).join(', ') : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section className="q-n1-capa" aria-labelledby={`${rengC.id}-cierre`} data-seccion="cierre">
        <h3 id={`${rengC.id}-cierre`}>Cierre del capítulo</h3>
        <h4>Resumen</h4>
        <ul>
          {rengC.resumen.map((rengR) => (
            <li key={rengR}>{rengR}</li>
          ))}
        </ul>
        <h4>Glosario del capítulo</h4>
        <RengGlosarioN1 terminos={rengC.glosario} />
        {rengIntegradores && (
          <div className="row">
            <button type="button" className="btn primary" data-integradores={rengIntegradores.subtema} onClick={() => rengOnPracticar(rengIntegradores.subtema)}>
              Problemas integradores del capítulo ({rengIntegradores.practicas.length})
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
