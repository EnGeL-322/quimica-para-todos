import { useEffect, useMemo, useRef, type ReactNode, type Ref } from 'react'
import { rengNivelesDeTema, RENG_TEMAS } from '../practica/banco'
import { rengFichaDeTema, rengFiltrarTemas, rengPreguntaDeTema } from '../practica/fichasTema'
import { RENG_INFO_NIVEL_PRACTICA, RENG_NIVELES_PRACTICA, type RengNivelPractica } from '../practica/niveles'
import { RENG_RAMAS, type RengRama, type RengTema } from '../practica/tipos'
import { RengTarjetaTema } from './TarjetaTema'

export interface RengFiltroTemas {
  texto: string
  rama: RengRama | null
  nivel: RengNivelPractica | null
}

export const RENG_FILTRO_VACIO: RengFiltroTemas = { texto: '', rama: null, nivel: null }

export const rengRamaCorta = (rengNombre: string): string => {
  const rengT = rengNombre.replace('Química ', '')
  return rengT.charAt(0).toUpperCase() + rengT.slice(1)
}

interface RengProps {
  idBase: string
  filtro: RengFiltroTemas
  onFiltro: (rengF: RengFiltroTemas) => void
  nivel: RengNivelPractica
  onAbrir: (rengT: RengTema) => void
  accionesDe?: (rengT: RengTema) => ReactNode
  enfocar?: { id: string; n: number } | null
  etiquetaAbrir?: (rengT: RengTema) => string
  marcador?: string
  buscarRef?: Ref<HTMLInputElement>
  filtroNivel?: boolean
}

export function RengExploradorTemas({ idBase: rengIdBase, filtro: rengFiltro, onFiltro: rengOnFiltro, nivel: rengNivel, onAbrir: rengOnAbrir, accionesDe: rengAccionesDe, enfocar: rengEnfocar, etiquetaAbrir: rengEtiquetaAbrir, marcador: rengMarcador = 'Buscar un tema: «ácidos», «isomería», «redox»…', buscarRef: rengBuscarRef, filtroNivel: rengFiltroNivel = true }: RengProps): React.JSX.Element {
  const rengRaiz = useRef<HTMLDivElement>(null)
  const rengVisibles = useMemo(() => rengFiltrarTemas(rengFiltro.texto, rengFiltro.rama).filter((rengT) => !rengFiltroNivel || rengFiltro.nivel === null || rengNivelesDeTema(rengT.id).includes(rengFiltro.nivel)), [rengFiltro.texto, rengFiltro.rama, rengFiltro.nivel, rengFiltroNivel])
  const rengGrupos = useMemo(() => RENG_RAMAS.map((rengR) => ({ rama: rengR, temas: rengVisibles.filter((rengT) => rengT.rama === rengR.id) })).filter((rengG) => rengG.temas.length > 0), [rengVisibles])
  const rengFiltrado = rengFiltro.texto.trim() !== '' || rengFiltro.rama !== null || (rengFiltroNivel && rengFiltro.nivel !== null)

  useEffect(() => {
    if (!rengEnfocar) return
    const rengBoton = [...(rengRaiz.current?.querySelectorAll<HTMLElement>('[data-tema-abrir]') ?? [])].find((rengB) => rengB.dataset.temaAbrir === rengEnfocar.id)
    rengBoton?.focus({ preventScroll: true })
    rengBoton?.scrollIntoView({ block: 'nearest' })
  }, [rengEnfocar])

  return (
    <div className="q-explorador" ref={rengRaiz}>
      <div className="q-filtros">
        <input ref={rengBuscarRef} id={`${rengIdBase}-buscar`} className="input" type="search" placeholder={rengMarcador} aria-label="Buscar un tema" value={rengFiltro.texto} onChange={(rengE) => rengOnFiltro({ ...rengFiltro, texto: rengE.target.value })} />
        <div className="q-chips" role="group" aria-label="Filtrar por rama">
          <button type="button" className="q-chip" aria-pressed={rengFiltro.rama === null} onClick={() => rengOnFiltro({ ...rengFiltro, rama: null })}>
            Todas
          </button>
          {RENG_RAMAS.map((rengR) => (
            <button key={rengR.id} type="button" className="q-chip" aria-pressed={rengFiltro.rama === rengR.id} title={rengR.resumen} onClick={() => rengOnFiltro({ ...rengFiltro, rama: rengFiltro.rama === rengR.id ? null : rengR.id })}>
              {rengRamaCorta(rengR.nombre)}
            </button>
          ))}
        </div>
        {rengFiltroNivel && (
          <div className="q-chips" role="group" aria-label="Filtrar por nivel">
            <button type="button" className="q-chip" aria-pressed={rengFiltro.nivel === null} onClick={() => rengOnFiltro({ ...rengFiltro, nivel: null })}>
              Todos los niveles
            </button>
            {RENG_NIVELES_PRACTICA.map((rengN) => (
              <button key={rengN} type="button" className="q-chip" aria-pressed={rengFiltro.nivel === rengN} title={RENG_INFO_NIVEL_PRACTICA[rengN].descripcion} onClick={() => rengOnFiltro({ ...rengFiltro, nivel: rengFiltro.nivel === rengN ? null : rengN })}>
                {RENG_INFO_NIVEL_PRACTICA[rengN].corto}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="q-resultados faint sm" role="status">
        {rengVisibles.length === 0 ? 'Sin resultados' : rengFiltrado ? `${rengVisibles.length} de ${RENG_TEMAS.length} temas` : `${RENG_TEMAS.length} temas en ${RENG_RAMAS.length} ramas`}
      </p>

      {rengVisibles.length === 0 && (
        <div className="notice q-sin-resultados" role="status">
          <span>Ningún tema coincide con los filtros{rengFiltro.texto.trim() ? ` («${rengFiltro.texto.trim()}»)` : ''}{rengFiltro.rama ? ` en ${rengRamaCorta(RENG_RAMAS.find((rengR) => rengR.id === rengFiltro.rama)?.nombre ?? '')}` : ''}{rengFiltroNivel && rengFiltro.nivel ? ` con práctica de nivel ${RENG_INFO_NIVEL_PRACTICA[rengFiltro.nivel].nombre}` : ''}.</span>
          <button type="button" className="btn sm" onClick={() => rengOnFiltro(RENG_FILTRO_VACIO)}>
            Limpiar filtros
          </button>
        </div>
      )}

      {rengGrupos.map((rengG) => (
        <section key={rengG.rama.id} className="q-rama" aria-labelledby={`${rengIdBase}-rama-${rengG.rama.id}`}>
          <h3 id={`${rengIdBase}-rama-${rengG.rama.id}`}>
            {rengG.rama.nombre} <span className="faint sm">({rengG.temas.length})</span>
          </h3>
          <ul className="q-rejilla">
            {rengG.temas.map((rengT) => (
              <li key={rengT.id}>
                <RengTarjetaTema
                  id={rengT.id}
                  nombre={rengT.nombre}
                  pregunta={rengPreguntaDeTema(rengT)}
                  rama={rengT.rama}
                  miniatura={rengFichaDeTema(rengT.id)?.miniatura ?? ''}
                  niveles={rengNivelesDeTema(rengT.id)}
                  nivel={rengNivel}
                  etiquetaAbrir={rengEtiquetaAbrir?.(rengT)}
                  onAbrir={() => rengOnAbrir(rengT)}
                >
                  {rengAccionesDe?.(rengT)}
                </RengTarjetaTema>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
