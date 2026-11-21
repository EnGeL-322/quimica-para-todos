import { useRef, useState } from 'react'
import { rengTemaPorId } from '../practica/banco'
import { rengClaveIntento, rengEstadoEjercicio, rengIntentoAbierto, type RengEstadoPractica } from '../practica/estado'
import { RENG_INFO_NIVEL_PRACTICA, RENG_NIVELES_PRACTICA, type RengNivelPractica } from '../practica/niveles'
import type { RengTema } from '../practica/tipos'
import { RengExploradorTemas, type RengFiltroTemas } from '../vista/ExploradorTemas'

interface RengProps {
  estado: RengEstadoPractica
  nivel: RengNivelPractica
  onNivel: (rengN: RengNivelPractica) => void
  filtro: RengFiltroTemas
  onFiltro: (rengF: RengFiltroTemas) => void
  enfocar: { id: string; n: number } | null
  onAbrirTema: (rengT: RengTema) => void
  onContinuar: () => void
  onRecuperar: (rengClave: string) => void
  onDescartar: (rengClave: string) => void
  avisos: string[]
  onCerrarAvisos: () => void
}

const rengTextoEstado = { pendiente: 'Pendiente', revisada: 'Revisada', resuelta: 'Resuelta' } as const

const rengResumenIntento = (rengI: RengEstadoPractica['actual'], rengLogros: RengEstadoPractica['logros']): string => {
  const rengPartes = [rengTemaPorId(rengI.tema)?.nombre ?? rengI.tema, RENG_INFO_NIVEL_PRACTICA[rengI.nivel].nombre, `variante ${rengI.semilla}`, rengTextoEstado[rengEstadoEjercicio(rengLogros, rengI.ejercicioId)]]
  if (rengI.respuesta.trim()) rengPartes.push(`«${rengI.respuesta.trim().slice(0, 24)}»`)
  if (rengI.pistas > 0) rengPartes.push(rengI.pistas === 1 ? '1 pista' : `${rengI.pistas} pistas`)
  return rengPartes.join(' · ')
}

function rengProgresoTema(rengEstado: RengEstadoPractica, rengTema: string): React.JSX.Element | null {
  const rengLogros = Object.values(rengEstado.logros).filter((rengL) => rengL.tema === rengTema)
  const rengResueltas = rengLogros.filter((rengL) => rengL.estado === 'resuelta').length
  const rengRevisadas = rengLogros.filter((rengL) => rengL.estado === 'revisada').length
  if (rengResueltas + rengRevisadas === 0) return null
  return (
    <span className="q-tarjeta-meta" data-progreso-tema={rengTema}>
      {rengResueltas > 0 && `Resueltas: ${rengResueltas}`}
      {rengResueltas > 0 && rengRevisadas > 0 && ' · '}
      {rengRevisadas > 0 && `Revisadas: ${rengRevisadas}`}
    </span>
  )
}

export default function RengSelectorEjercicios({ estado: rengEstado, nivel: rengNivel, onNivel: rengOnNivel, filtro: rengFiltro, onFiltro: rengOnFiltro, enfocar: rengEnfocar, onAbrirTema: rengOnAbrirTema, onContinuar: rengOnContinuar, onRecuperar: rengOnRecuperar, onDescartar: rengOnDescartar, avisos: rengAvisos, onCerrarAvisos: rengOnCerrarAvisos }: RengProps): React.JSX.Element {
  const [rengOmitido, rengSetOmitido] = useState(false)
  const rengBuscar = useRef<HTMLInputElement>(null)
  const rengEnCurso = rengIntentoAbierto(rengEstado.actual) && !rengOmitido
  const rengPendientes = rengEstado.pendientes.filter((rengP) => rengClaveIntento(rengP) !== rengClaveIntento(rengEstado.actual))
  return (
    <div className="q-selector">
      <header className="q-cabecera q-cabecera-fila">
        <div className="stack tight">
          <h2>Elige un tema para practicar</h2>
          <p className="muted sm">Cada tema tiene práctica con corrección, pistas y resolución paso a paso.</p>
        </div>
        <div className="q-nivel-pref">
          <span className="q-etiqueta" id="q-nivel-pref-etq">
            Nivel preferido
          </span>
          <div className="segmentado q-niveles" role="group" aria-labelledby="q-nivel-pref-etq">
            {RENG_NIVELES_PRACTICA.map((rengN) => (
              <button key={rengN} type="button" aria-pressed={rengNivel === rengN} title={RENG_INFO_NIVEL_PRACTICA[rengN].descripcion} onClick={() => rengOnNivel(rengN)}>
                {RENG_INFO_NIVEL_PRACTICA[rengN].nombre}
              </button>
            ))}
          </div>
        </div>
      </header>

      {rengAvisos.length > 0 && (
        <section className="notice warn q-avisos" role="alert" aria-label="Avisos sobre tu progreso guardado">
          <ul className="sm">
            {rengAvisos.map((rengA) => (
              <li key={rengA}>{rengA}</li>
            ))}
          </ul>
          <button type="button" className="btn sm" onClick={rengOnCerrarAvisos}>
            Entendido
          </button>
        </section>
      )}

      {rengEnCurso && (
        <section className="notice q-continuar" aria-label="Práctica en curso">
          <div>
            <strong>Práctica en curso</strong>
            <div className="sm" data-resumen-intento>
              {rengResumenIntento(rengEstado.actual, rengEstado.logros)}
            </div>
          </div>
          <div className="row">
            <button type="button" className="btn primary sm" onClick={rengOnContinuar}>
              Continuar práctica
            </button>
            <button
              type="button"
              className="btn sm"
              onClick={() => {
                rengSetOmitido(true)
                rengBuscar.current?.focus()
              }}
            >
              Elegir tema
            </button>
          </div>
        </section>
      )}

      {rengPendientes.length > 0 && (
        <section className="q-guardados" aria-label="Intentos guardados">
          <h3>Intentos guardados ({rengPendientes.length})</h3>
          <ul>
            {rengPendientes.map((rengP) => (
              <li key={rengClaveIntento(rengP)}>
                <span className="sm">{rengResumenIntento(rengP, rengEstado.logros)}</span>
                <button type="button" className="btn sm" onClick={() => rengOnRecuperar(rengClaveIntento(rengP))}>
                  Recuperar
                </button>
                <button type="button" className="btn ghost sm" onClick={() => rengOnDescartar(rengClaveIntento(rengP))}>
                  Descartar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RengExploradorTemas idBase="q-ej" filtro={rengFiltro} onFiltro={rengOnFiltro} nivel={rengNivel} enfocar={rengEnfocar} onAbrir={rengOnAbrirTema} buscarRef={rengBuscar} filtroNivel={false} etiquetaAbrir={(rengT) => `Practicar ${rengT.nombre}`} accionesDe={(rengT) => rengProgresoTema(rengEstado, rengT.id)} />
    </div>
  )
}
