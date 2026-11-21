import { Component, Fragment, Suspense, lazy, useCallback, useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { RENG_CATEGORIAS } from '@shared/manifest'
import { RENG_PRODUCTO } from '@shared/producto'
import { RENG_INICIO } from './inicio'
import type { RengEntradaMenu, RengModuleDefinition } from './module-api'
import { rengFindModule, RENG_MODULES } from './registry'
import { RengAcercaDe } from './shell/AcercaDe'
import { RengIcon } from './shell/Icon'
import { RengBrandMark } from './shell/Marca'
import { RengHome } from './shell/Home'
import { rengAnfitrionEnCurso, rengClaveEnCurso, rengClaveEntrada, rengEntradaActiva, rengGrupoContiene, rengNombreAcceso, rengRutaLegible } from './shell/nucleo/menu'
import { RENG_EVENTO_SUBRUTA, rengIrA, rengRegistrarReciente, rengRutaActual } from './shell/navegacion'
import { RengPalette } from './shell/Palette'
import { RengToastProvider } from './shell/ui'

const rengLazyCache = new Map<string, ComponentType>()
function rengViewOf(rengId: string): ComponentType | null {
  const rengDef = rengFindModule(rengId)
  if (!rengDef) return null
  let rengC = rengLazyCache.get(rengId)
  if (!rengC) {
    rengC = lazy(rengDef.load)
    rengLazyCache.set(rengId, rengC)
  }
  return rengC
}

class RengBoundary extends Component<{ children: ReactNode; id: string }, { error: Error | null }> {
  override state = { error: null as Error | null }
  static getDerivedStateFromError(rengError: Error): { error: Error } {
    return { error: rengError }
  }
  override componentDidUpdate(rengPrev: { id: string }): void {
    if (rengPrev.id !== this.props.id && this.state.error) this.setState({ error: null })
  }
  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="notice err" style={{ margin: 24 }}>
          <strong>Este módulo tuvo un problema.</strong>
          <p className="muted sm">{this.state.error.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}

const RENG_PRINCIPALES = RENG_MODULES.filter((rengM) => rengM.manifest.principal)
const RENG_HERRAMIENTAS = RENG_MODULES.filter((rengM) => !rengM.manifest.principal && rengM.manifest.categoria === 'herramientas')
const RENG_ENLAZADAS = new Set(RENG_PRINCIPALES.flatMap((rengM) => (rengM.menu ?? []).flatMap((rengE) => [rengE, ...(rengE.hijos ?? [])]).flatMap((rengE) => (rengE.modulo ? [rengE.modulo] : []))))
const rengGrupoDe = (rengRuta: { id: string; sub: string | null }): RengModuleDefinition | undefined => RENG_PRINCIPALES.find((rengM) => rengGrupoContiene(rengM.manifest.id, rengM.menu ?? [], rengRuta))
const RENG_PRIVACIDAD = RENG_MODULES.filter((rengM) => !rengM.manifest.principal && rengM.manifest.categoria === 'seguridad')
const RENG_ATAJOS = ['inicio', ...RENG_PRINCIPALES.map((rengM) => rengM.manifest.id)].slice(0, 9)

const RENG_CONTEXTO: Partial<Record<string, string>> = RENG_INICIO.contexto

type RengPreferenciaMenu = 'auto' | 'abierto' | 'plegado'
const RENG_CLAVE_MENU = 'ciencia.menu'
const RENG_ANCHO_PLEGADO = '(max-width: 1199px)'

function rengLeerPreferencia(): RengPreferenciaMenu {
  try {
    const rengV = localStorage.getItem(RENG_CLAVE_MENU)
    return rengV === 'abierto' || rengV === 'plegado' ? rengV : 'auto'
  } catch {
    return 'auto'
  }
}

function useRengEstrecho(): boolean {
  const [rengV, rengSetV] = useState(() => window.matchMedia(RENG_ANCHO_PLEGADO).matches)
  useEffect(() => {
    const rengMq = window.matchMedia(RENG_ANCHO_PLEGADO)
    const rengF = (): void => rengSetV(rengMq.matches)
    rengMq.addEventListener('change', rengF)
    return () => rengMq.removeEventListener('change', rengF)
  }, [])
  return rengV
}

export function RengApp(): React.JSX.Element {
  const [rengRuta, rengSetRuta] = useState(() => rengRutaActual())
  const rengActive = rengRuta.ruta.id
  const [rengAviso, rengSetAviso] = useState<string | null>(null)
  const [rengPalette, rengSetPalette] = useState(false)
  const [rengAcerca, rengSetAcerca] = useState(false)
  const [rengPreferencia, rengSetPreferencia] = useState<RengPreferenciaMenu>(rengLeerPreferencia)
  const rengEstrecho = useRengEstrecho()
  const rengPlegado = rengPreferencia === 'plegado' || (rengPreferencia === 'auto' && rengEstrecho)
  const [rengPrivacidadAbierta, rengSetPrivacidadAbierta] = useState(() => RENG_PRIVACIDAD.some((rengM) => rengM.manifest.id === rengActive))
  const [rengAbiertos, rengSetAbiertos] = useState<ReadonlySet<string>>(() => {
    const rengG = rengGrupoDe(rengRuta.ruta)
    return new Set(rengG ? [rengG.manifest.id] : [])
  })
  const [rengEnCurso, rengSetEnCurso] = useState<Readonly<Record<string, string>>>({})
  const [rengTheme, rengSetTheme] = useState<'dark' | 'light'>(() => {
    try {
      const rengG = localStorage.getItem('tema')
      if (rengG === 'light' || rengG === 'dark') return rengG
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })

  const rengOpen = useCallback((rengId: string, rengSub: string | null = null) => rengIrA(rengId, rengSub), [])

  useEffect(() => {
    const rengOnHash = (): void => {
      const rengR = rengRutaActual()
      rengSetRuta(rengR)
      if (rengR.retirada) {
        rengSetAviso(`«${rengR.retirada}» se retiró de la aplicación. Tus archivos, modelos y programas instalados no se tocaron.`)
        history.replaceState(history.state, '', '#/inicio')
      } else rengSetAviso(null)
    }
    const rengOnSubruta = (): void => rengSetRuta(rengRutaActual())
    rengOnHash()
    const rengOnKey = (rengE: KeyboardEvent): void => {
      if (!(rengE.ctrlKey || rengE.metaKey) || rengE.altKey) return
      const rengK = rengE.key.toLowerCase()
      if (rengK === 'k') {
        rengE.preventDefault()
        rengSetPalette((rengP) => !rengP)
        return
      }
      const rengN = Number(rengE.key)
      if (Number.isInteger(rengN) && rengN >= 1 && rengN <= RENG_ATAJOS.length && !rengE.shiftKey) {
        rengE.preventDefault()
        rengSetPalette(false)
        rengIrA(RENG_ATAJOS[rengN - 1]!)
      }
    }
    window.addEventListener('hashchange', rengOnHash)
    window.addEventListener(RENG_EVENTO_SUBRUTA, rengOnSubruta)
    window.addEventListener('keydown', rengOnKey)
    return () => {
      window.removeEventListener('hashchange', rengOnHash)
      window.removeEventListener(RENG_EVENTO_SUBRUTA, rengOnSubruta)
      window.removeEventListener('keydown', rengOnKey)
    }
  }, [])

  const rengIdGrupoActivo = rengGrupoDe(rengRuta.ruta)?.manifest.id ?? null
  useEffect(() => {
    if (rengIdGrupoActivo) rengSetAbiertos(new Set([rengIdGrupoActivo]))
  }, [rengIdGrupoActivo])
  useEffect(() => {
    const rengM = rengFindModule(rengRuta.ruta.id)
    const rengSub = rengRuta.ruta.sub
    if (!rengM?.menu || !rengSub || !rengAnfitrionEnCurso(rengM.menu, rengSub)) return
    rengSetEnCurso((rengE) => (rengE[rengM.manifest.id] === rengSub ? rengE : { ...rengE, [rengM.manifest.id]: rengSub }))
  }, [rengRuta])
  const rengAlternarGrupo = (rengId: string): void =>
    rengSetAbiertos((rengS) => {
      const rengN = new Set(rengS)
      if (rengN.has(rengId)) rengN.delete(rengId)
      else rengN.add(rengId)
      return rengN
    })

  useEffect(() => {
    const rengM = rengFindModule(rengActive)?.manifest
    if (rengM && !rengM.principal) rengRegistrarReciente({ id: rengM.id, sub: null, titulo: rengM.nombre, contexto: RENG_CATEGORIAS[rengM.categoria] })
  }, [rengActive])

  useEffect(() => {
    document.documentElement.dataset['theme'] = rengTheme
    try {
      localStorage.setItem('tema', rengTheme)
    } catch {
    }
  }, [rengTheme])

  const rengAlternarMenu = (): void => {
    const rengNueva: RengPreferenciaMenu = rengPlegado ? 'abierto' : 'plegado'
    rengSetPreferencia(rengNueva)
    try {
      localStorage.setItem(RENG_CLAVE_MENU, rengNueva)
    } catch {
    }
  }

  const rengDef = rengFindModule(rengActive)
  const RengView = rengViewOf(rengActive)
  const rengDisciplina = rengDef?.manifest.categoria ?? 'inicio'
  const rengTitulo = rengDef ? (rengDef.manifest.nombreCorto ?? rengDef.manifest.nombre) : 'Inicio'
  const rengContexto = rengDef
    ? ((rengDef.menu ? rengRutaLegible(rengDef.manifest.id, rengDef.menu, rengDef.accesos, rengRuta.ruta) : null) ?? RENG_CONTEXTO[rengDef.manifest.categoria] ?? RENG_CATEGORIAS[rengDef.manifest.categoria])
    : RENG_PRODUCTO.lema
  const rengNavLateral = !rengPlegado && rengIdGrupoActivo !== null && rengAbiertos.has(rengIdGrupoActivo)

  const rengBotonEntrada = (rengModuloId: string, rengE: RengEntradaMenu, rengNivel: 1 | 2): React.JSX.Element => {
    const rengK = rengClaveEntrada(rengModuloId, rengE)
    const rengActiva = rengEntradaActiva(rengModuloId, rengFindModule(rengModuloId)?.menu ?? [], rengRuta.ruta)
    const rengEsActiva = rengActiva === rengK
    const rengContiene = !rengEsActiva && !!rengActiva && ((rengE.hijos ?? []).some((rengH) => rengClaveEntrada(rengModuloId, rengH) === rengActiva) || rengActiva.startsWith(`${rengK}#`))
    return (
      <button
        key={rengK}
        type="button"
        className={`nav-item compacto nav-hijo${rengNivel === 2 ? ' nav-nieto' : ''}${rengEsActiva ? ' active' : ''}${rengContiene ? ' contiene-activo' : ''}`}
        aria-current={rengEsActiva ? 'page' : undefined}
        onClick={() => (rengE.modulo ? rengOpen(rengE.modulo) : rengOpen(rengModuloId, rengE.sub))}
      >
        <span className="nav-texto">{rengE.nombre}</span>
      </button>
    )
  }

  const rengGrupo = (rengM: RengModuleDefinition, rengAtajo: number): React.JSX.Element => {
    const rengId = rengM.manifest.id
    const rengMenu = rengM.menu ?? []
    const rengNombre = rengM.manifest.nombreCorto ?? rengM.manifest.nombre
    const rengAbierto = rengAbiertos.has(rengId)
    const rengContiene = rengGrupoContiene(rengId, rengMenu, rengRuta.ruta)
    const rengActiva = rengEntradaActiva(rengId, rengMenu, rengRuta.ruta)
    const rengSub = rengEnCurso[rengId]
    const rengAnfitrion = rengSub ? rengAnfitrionEnCurso(rengMenu, rengSub) : null
    let rengSeccionPrevia: string | undefined
    return (
      <Fragment key={rengId}>
        <button
          type="button"
          className={`nav-item nav-plegable nav-grupo-cabecera${rengContiene ? ' contiene-activo' : ''}`}
          data-disciplina={rengM.manifest.categoria}
          aria-expanded={rengAbierto}
          aria-controls={`nav-grupo-${rengId}`}
          aria-keyshortcuts={`Control+${rengAtajo}`}
          title={`Mostrar u ocultar los destinos de ${rengNombre}. Ctrl+${rengAtajo} abre ${rengNombre}.`}
          onClick={() => rengAlternarGrupo(rengId)}
        >
          <RengIcon name={rengM.manifest.icono} /> <span className="nav-texto">{rengNombre}</span>
          {rengContiene && (
            <span className="nav-punto" title="Aquí está la pantalla abierta">
              <span className="sr-only">(pantalla abierta)</span>
            </span>
          )}
          <span className="spacer nav-texto" />
          <span className="nav-flecha nav-texto" aria-hidden="true">
            {rengAbierto ? '▾' : '▸'}
          </span>
        </button>
        <div id={`nav-grupo-${rengId}`} className="nav-sub nav-grupo" role="group" aria-label={`Destinos de ${rengNombre}`} data-disciplina={rengM.manifest.categoria} hidden={!rengAbierto}>
          {rengMenu.map((rengE) => {
            const rengTitulo = rengE.seccion && rengE.seccion !== rengSeccionPrevia ? rengE.seccion : null
            rengSeccionPrevia = rengE.seccion
            const rengKCurso = rengSub && rengAnfitrion === rengE ? rengClaveEnCurso(rengId, rengE, rengSub) : null
            return (
              <Fragment key={rengClaveEntrada(rengId, rengE)}>
                {rengTitulo && (
                  <div className="nav-seccion" aria-hidden="true">
                    {rengTitulo}
                  </div>
                )}
                {rengBotonEntrada(rengId, rengE, 1)}
                {rengE.hijos?.map((rengH) => rengBotonEntrada(rengId, rengH, 2))}
                {rengKCurso && rengSub && (
                  <button
                    type="button"
                    className={`nav-item compacto nav-hijo nav-nieto nav-en-curso${rengActiva === rengKCurso ? ' active' : ''}`}
                    aria-current={rengActiva === rengKCurso ? 'page' : undefined}
                    title={`${rengNombreAcceso(rengM.accesos, rengSub) ?? rengSub}: vuelve a él tal como lo dejaste`}
                    onClick={() => rengOpen(rengId, rengSub)}
                  >
                    <span className="nav-texto">{rengNombreAcceso(rengM.accesos, rengSub) ?? rengSub}</span>
                    <span className="nav-etq nav-texto">en curso</span>
                  </button>
                )}
              </Fragment>
            )
          })}
        </div>
      </Fragment>
    )
  }

  const rengEnlace = (rengId: string, rengNombre: string, rengIcono: Parameters<typeof RengIcon>[0]['name'], rengExtra?: { atajo?: number; compacto?: boolean }): React.JSX.Element => (
    <button
      key={rengId}
      type="button"
      className={`nav-item${rengExtra?.compacto ? ' compacto' : ''}${rengActive === rengId ? ' active' : ''}`}
      aria-current={rengActive === rengId ? 'page' : undefined}
      aria-keyshortcuts={rengExtra?.atajo ? `Control+${rengExtra.atajo}` : undefined}
      title={rengPlegado ? rengNombre + (rengExtra?.atajo ? ` (Ctrl+${rengExtra.atajo})` : '') : rengExtra?.atajo ? `Ctrl+${rengExtra.atajo}` : undefined}
      aria-label={rengPlegado ? rengNombre : undefined}
      data-disciplina={rengFindModule(rengId)?.manifest.categoria ?? 'inicio'}
      onClick={() => rengOpen(rengId)}
    >
      <RengIcon name={rengIcono} /> <span className="nav-texto">{rengNombre}</span>
    </button>
  )

  return (
    <RengToastProvider>
      <a className="saltar" href="#contenido-principal" onClick={(rengE) => {
        rengE.preventDefault()
        document.getElementById('contenido-principal')?.focus()
      }}>
        Saltar al contenido
      </a>
      <div className={`app${rengPlegado ? ' menu-plegado' : ''}`} data-disciplina={rengDisciplina} data-nav-lateral={rengNavLateral ? '' : undefined}>
        <aside className="sidebar" aria-label="Navegación principal">
          <div className="brand-fila">
            <button type="button" className="brand" onClick={() => rengOpen('inicio')} aria-label={`${RENG_PRODUCTO.nombre}: ir a Inicio`}>
              <RengBrandMark />
              <span className="nav-texto">
                <b>{RENG_PRODUCTO.nombre}</b>
                <span>{RENG_PRODUCTO.subtitulo}</span>
              </span>
            </button>
          </div>
          <nav className="nav" aria-label="Destinos">
            {rengEnlace('inicio', 'Inicio', 'home', { atajo: 1 })}
            {RENG_PRINCIPALES.map((rengM, rengI) =>
              rengPlegado || !rengM.menu?.length ? rengEnlace(rengM.manifest.id, rengM.manifest.nombreCorto ?? rengM.manifest.nombre, rengM.manifest.icono, { atajo: rengI + 2 }) : rengGrupo(rengM, rengI + 2)
            )}
            <button type="button" className="nav-item" onClick={() => rengSetPalette(true)} aria-keyshortcuts="Control+K" title={rengPlegado ? 'Buscar (Ctrl+K)' : undefined} aria-label={rengPlegado ? 'Buscar' : undefined}>
              <RengIcon name="search" /> <span className="nav-texto">Buscar</span> <span className="spacer nav-texto" /> <span className="kbd nav-texto">Ctrl K</span>
            </button>

            <div className="nav-group" role="presentation">
              <span className="nav-texto">Herramientas</span>
            </div>
            {RENG_HERRAMIENTAS.filter((rengM) => rengPlegado || !RENG_ENLAZADAS.has(rengM.manifest.id)).map((rengM) => rengEnlace(rengM.manifest.id, rengM.manifest.nombre, rengM.manifest.icono, { compacto: true }))}
            {RENG_PRIVACIDAD.length > 0 && (
              <>
                <button
                  type="button"
                  className={`nav-item compacto nav-plegable${RENG_PRIVACIDAD.some((rengM) => rengM.manifest.id === rengActive) ? ' contiene-activo' : ''}`}
                  aria-expanded={rengPrivacidadAbierta || rengPlegado}
                  aria-controls="nav-privacidad"
                  onClick={() => rengSetPrivacidadAbierta((rengV) => !rengV)}
                  title={rengPlegado ? 'Privacidad y red' : undefined}
                  hidden={rengPlegado}
                >
                  <RengIcon name="shield" /> <span className="nav-texto">Privacidad y red</span>
                  <span className="spacer nav-texto" />
                  <span className="nav-flecha nav-texto" aria-hidden="true">
                    {rengPrivacidadAbierta ? '▾' : '▸'}
                  </span>
                </button>
                <div id="nav-privacidad" className="nav-sub" hidden={!(rengPrivacidadAbierta || rengPlegado)}>
                  {RENG_PRIVACIDAD.map((rengM) => rengEnlace(rengM.manifest.id, rengM.manifest.nombre, rengM.manifest.icono, { compacto: true }))}
                </div>
              </>
            )}
          </nav>
          <div className="sidebar-foot">
            <span className="nav-texto">
              <RengIcon name="dot" size={8} /> Sin conexión
            </span>
            <button type="button" className="btn ghost sm nav-texto" onClick={() => rengSetAcerca(true)}>
              Acerca de
            </button>
            <button type="button" className="btn ghost sm menu-alternar" onClick={rengAlternarMenu} aria-label={rengPlegado ? 'Mostrar el menú completo' : 'Plegar el menú'} title={rengPlegado ? 'Mostrar el menú completo' : 'Plegar el menú'} aria-expanded={!rengPlegado}>
              <RengIcon name="sidebar" />
            </button>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div className="topbar-titulo">
              <h1>{rengTitulo}</h1>
              <span className="crumb">{rengContexto}</span>
            </div>
            <span className="spacer" />
            <div className="tema-conmutador" role="group" aria-label="Modo de color">
              <button type="button" aria-pressed={rengTheme === 'light'} onClick={() => rengSetTheme('light')} title="Modo día">
                <RengIcon name="sun" size={16} /> <span className="tema-texto">Día</span>
              </button>
              <button type="button" aria-pressed={rengTheme === 'dark'} onClick={() => rengSetTheme('dark')} title="Modo noche">
                <RengIcon name="moon" size={16} /> <span className="tema-texto">Noche</span>
              </button>
            </div>
            <button type="button" className="btn sm" onClick={() => rengSetPalette(true)} aria-keyshortcuts="Control+K">
              <RengIcon name="search" /> Buscar <span className="kbd">Ctrl K</span>
            </button>
          </header>
          {rengAviso && (
            <div className="notice warn aviso-ruta" role="status">
              <span>{rengAviso}</span>
              <button type="button" className="btn ghost sm" aria-label="Cerrar aviso" onClick={() => rengSetAviso(null)}>
                ✕
              </button>
            </div>
          )}
          <div id="contenido-principal" tabIndex={-1} className={`page ${rengDef?.flush ? 'flush' : ''}`}>
            <RengBoundary id={rengActive}>
              {RengView ? (
                <Suspense fallback={<p className="muted" style={{ padding: 24 }}>Cargando módulo…</p>}>
                  <RengView />
                </Suspense>
              ) : (
                <RengHome onOpen={rengOpen} />
              )}
            </RengBoundary>
          </div>
        </main>
      </div>
      {rengPalette && <RengPalette onClose={() => rengSetPalette(false)} onOpen={rengOpen} />}
      {rengAcerca && <RengAcercaDe onClose={() => rengSetAcerca(false)} />}
    </RengToastProvider>
  )
}
