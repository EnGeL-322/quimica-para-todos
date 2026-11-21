import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { rengIrA, rengReemplazarSubruta, rengRegistrarReciente, useRengSubruta } from '@/shell/navegacion'
import { rengPestanaPorTecla } from '@/shell/nucleo/pestanas'
import { RengDestinos } from '@/shell/ui'
import './quimica.css'
import './practica.css'
import { rengCrearTrabajo } from './estado/trabajo'
import RengAprender from './modos/Aprender'
import RengCasos from './modos/Casos'
import RengCatalogo from './modos/Catalogo'
import RengTemario from './modos/Temario'
import RengEjerciciosQuimica from './modos/EjerciciosQuimica'
import RengEnlaces from './modos/Enlaces'
import RengExplorar from './modos/Explorar'
import RengFormulacion from './modos/Formulacion'
import RengReacciones from './modos/Reacciones'
import RengSimulaciones, { type RengTransferenciaActiva } from './modos/Simulaciones'
import { rengDescripcionNav, RENG_DESTINOS_QUIMICA, RENG_HERRAMIENTAS_MESA, RENG_NAV_INICIAL, rengNavDeSubruta, rengSubrutaDeNav, type RengDestinoQuimica, type RengHerramientaMesa, type RengNavQuimica, type RengSubExperimento } from './navegacion'
import { rengArrancarPractica, rengGuardarPractica } from './practica/arranque'
import { rengNivelParaTema, rengReferenciaNueva, rengTemaPorId } from './practica/banco'
import { rengClaveIntento, rengPractica, type RengAccionPractica } from './practica/estado'
import { RENG_INFO_NIVEL_PRACTICA, RENG_NIVELES_PRACTICA, rengDetalleDeNivel, rengGuardarNivelPractica, rengLeerNivelPractica, rengNivelDeDetalle, rengNivelDeTecla, type RengDetalleMesa, type RengNivelPractica } from './practica/niveles'
import type { RengTransferenciaSimulacion } from './practica/tipos'
import { rengGrupoN1PorId } from './practicas-n1/registro'
import { RengActividadContext } from './vista/actividad'
import { RengIndiceN1 } from './vista/IndiceN1'
import RengLeccionN1, { rengVistaN1Existe } from './vista/LeccionN1'
import RengPracticasN1 from './vista/PracticasN1'
import { RengBarraTrabajo } from './vista/BarraTrabajo'
import { rengEsCampoDeTexto, RengNivelContext, RengNivelPracticaContext } from './vista/nivel'
import { useRengMesa } from './vista/useMesa'
import { RengTrabajoContext } from './vista/useTrabajo'

const RENG_ID_MODULO = 'simulador-quimica'
const RENG_NIVEL_SIMULACION: RengNivelPractica = 'cientifico'

const rengAlmacenLocal = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export default function RengView(): React.JSX.Element {
  const rengAlmacen = useRef(rengCrearTrabajo()).current
  const rengMesa = useRengMesa(rengAlmacen)
  const rengRuta = useRengSubruta(RENG_ID_MODULO)
  const [rengNav, rengSetNav] = useState<RengNavQuimica>(() => rengNavDeSubruta(RENG_NAV_INICIAL, rengRuta.sub))
  const [rengNivel, rengSetNivelEstado] = useState<RengNivelPractica>(() => rengLeerNivelPractica(rengAlmacenLocal()))
  const [rengArranque] = useState(() => rengArrancarPractica(rengAlmacenLocal(), rengLeerNivelPractica(rengAlmacenLocal())))
  const [rengPract, rengDespachar] = useReducer(rengPractica, rengArranque.estado)
  const [rengAvisosPractica, rengSetAvisosPractica] = useState<string[]>(rengArranque.avisos)
  const [rengMesaDesdePractica, rengSetMesaDesdePractica] = useState(false)
  const [rengRepasoDesdePractica, rengSetRepasoDesdePractica] = useState(false)
  const [rengTransferencia, rengSetTransferencia] = useState<RengTransferenciaActiva | null>(null)
  const [rengAperturaEjercicio, rengSetAperturaEjercicio] = useState(0)
  const [rengTemaAprender, rengSetTemaAprender] = useState<{ id: string; n: number } | null>(null)
  const [rengN1, rengSetN1] = useState<{ tipo: 'leccion' | 'practicas'; id: string } | null>(null)
  const { destino: rengDestino, herramienta: rengHerramienta, experimento: rengExperimento } = rengNav
  const rengDetalle: RengDetalleMesa = rengDetalleDeNivel(rengNivel)
  const rengBotonesHerramienta = useRef(new Map<RengHerramientaMesa, HTMLButtonElement>())

  const rengAjustarPractica = useCallback(
    (rengN: RengNivelPractica): void => {
      const rengEfectivo = rengNivelParaTema(rengPract.actual.tema, rengN)
      if (rengEfectivo && rengEfectivo !== rengPract.actual.nivel) {
        const rengRef = rengReferenciaNueva(rengPract.actual.tema, rengEfectivo, rengPract.actual.semilla)
        rengDespachar({ tipo: 'elegir', tema: rengPract.actual.tema, nivel: rengEfectivo, semilla: rengRef?.semilla ?? rengPract.actual.semilla, ejercicioId: rengRef?.ejercicioId ?? null, huella: rengRef?.huella ?? null })
      }
    },
    [rengPract.actual.tema, rengPract.actual.nivel, rengPract.actual.semilla]
  )

  const rengDespacharPractica = useCallback(
    (rengA: RengAccionPractica): void => {
      if (rengA.tipo === 'recuperar') {
        const rengP = rengPract.pendientes.find((rengX) => rengClaveIntento(rengX) === rengA.clave)
        if (rengP) {
          rengSetNivelEstado(rengP.nivel)
          rengGuardarNivelPractica(rengAlmacenLocal(), rengP.nivel)
        }
      }
      rengDespachar(rengA)
    },
    [rengPract.pendientes]
  )

  const rengSetNivel = useCallback(
    (rengN: RengNivelPractica): void => {
      rengSetNivelEstado(rengN)
      rengGuardarNivelPractica(rengAlmacenLocal(), rengN)
      rengAjustarPractica(rengN)
    },
    [rengAjustarPractica]
  )

  useEffect(() => {
    rengGuardarPractica(rengAlmacenLocal(), rengPract)
  }, [rengPract])

  useEffect(() => {
    if (rengNav.destino !== 'mesa') rengSetMesaDesdePractica(false)
    if (rengNav.destino !== 'aprender') rengSetRepasoDesdePractica(false)
    rengSetN1((rengX) => (rengX && ((rengX.tipo === 'leccion' && rengNav.destino !== 'aprender') || (rengX.tipo === 'practicas' && rengNav.destino !== 'practicas')) ? null : rengX))
  }, [rengNav.destino])

  const rengUltima = useRef(rengRuta.n)
  useEffect(() => {
    if (rengRuta.n === rengUltima.current) return
    rengUltima.current = rengRuta.n
    rengSetNav((rengN) => rengNavDeSubruta(rengN, rengRuta.sub))
  }, [rengRuta])

  useEffect(() => {
    rengReemplazarSubruta(RENG_ID_MODULO, rengSubrutaDeNav(rengNav))
    rengRegistrarReciente({ id: RENG_ID_MODULO, sub: rengSubrutaDeNav(rengNav), ...rengDescripcionNav(rengNav) })
  }, [rengNav])

  const rengAtajos = useRef({ mesa: rengMesa, setNivel: rengSetNivel, destino: rengDestino, nivel: rengNivel })
  rengAtajos.current = { mesa: rengMesa, setNivel: rengSetNivel, destino: rengDestino, nivel: rengNivel }
  useEffect(() => {
    const rengTecla = (rengEv: KeyboardEvent): void => {
      const rengA = rengAtajos.current
      if (rengEv.defaultPrevented || rengEsCampoDeTexto(rengEv.target)) return
      const rengK = rengEv.key.toLowerCase()
      if ((rengEv.ctrlKey || rengEv.metaKey) && rengK === 'z' && !rengEv.shiftKey) {
        if (rengA.destino !== 'mesa') return
        rengEv.preventDefault()
        rengA.mesa.deshacer()
      } else if ((rengEv.ctrlKey || rengEv.metaKey) && (rengK === 'y' || (rengK === 'z' && rengEv.shiftKey))) {
        if (rengA.destino !== 'mesa') return
        rengEv.preventDefault()
        rengA.mesa.rehacer()
      } else if (rengEv.ctrlKey || rengEv.metaKey || rengEv.altKey) return
      else if (rengNivelDeTecla(rengK)) rengA.setNivel(rengNivelDeTecla(rengK)!)
      else if (rengK === 'b') rengA.setNivel(rengNivelDeDetalle('basico', rengA.nivel))
      else if (rengK === 'a') rengA.setNivel(rengNivelDeDetalle('avanzado', rengA.nivel))
    }
    window.addEventListener('keydown', rengTecla)
    return () => window.removeEventListener('keydown', rengTecla)
  }, [])

  const rengSetDestino = useCallback((rengD: RengDestinoQuimica): void => rengSetNav((rengN) => ({ ...rengN, destino: rengD })), [])
  const rengAbrirLeccionN1 = useCallback(
    (rengId: string): void => {
      rengSetN1({ tipo: 'leccion', id: rengId })
      rengSetDestino('aprender')
    },
    [rengSetDestino]
  )
  const rengAbrirPracticasN1 = useCallback(
    (rengSubtema: string): void => {
      rengSetN1({ tipo: 'practicas', id: rengSubtema })
      rengSetDestino('practicas')
    },
    [rengSetDestino]
  )
  const rengCerrarN1 = useCallback((): void => rengSetN1(null), [])
  const rengIrAHerramienta = useCallback((rengH: RengHerramientaMesa): void => rengSetNav((rengN) => ({ ...rengN, destino: 'mesa', herramienta: rengH })), [])
  const rengIrAExplorar = useCallback((): void => rengIrAHerramienta('explorar'), [rengIrAHerramienta])
  const rengActiva = (rengH: RengHerramientaMesa): boolean => rengDestino === 'mesa' && rengHerramienta === rengH

  const rengElegirTema = useCallback(
    (rengRama: import('./practica/tipos').RengRama, rengTema: string): void => {
      const rengNivelTema = rengNivelParaTema(rengTema, rengNivel) ?? rengNivel
      const rengRef = rengReferenciaNueva(rengTema, rengNivelTema, 1)
      rengDespachar({ tipo: 'rama', rama: rengRama, tema: rengTema, nivel: rengNivelTema, semilla: rengRef?.semilla ?? 1, ejercicioId: rengRef?.ejercicioId ?? null, huella: rengRef?.huella ?? null })
    },
    [rengNivel]
  )

  const rengPracticarTema = useCallback(
    (rengTema: string): void => {
      const rengDef = rengTemaPorId(rengTema)
      if (!rengDef) return
      rengSetN1(null)
      rengElegirTema(rengDef.rama, rengTema)
      rengSetAperturaEjercicio((rengN) => rengN + 1)
      rengSetDestino('practicas')
    },
    [rengElegirTema, rengSetDestino]
  )

  const rengVolverAlEjercicio = useCallback((): void => {
    rengSetN1(null)
    rengSetAperturaEjercicio((rengN) => rengN + 1)
    rengSetDestino('practicas')
  }, [rengSetDestino])

  useEffect(() => {
    if (!rengNav.tema) return
    const rengTema = rengTemaPorId(rengNav.tema)
    const rengIdN1 = rengNav.tema
    rengSetNav((rengN) => ({ ...rengN, tema: null }))
    if (!rengTema) {
      if (rengNav.destino === 'aprender' && rengVistaN1Existe(rengIdN1)) rengSetN1({ tipo: 'leccion', id: rengIdN1 })
      else if (rengNav.destino === 'practicas' && rengGrupoN1PorId(rengIdN1)) rengSetN1({ tipo: 'practicas', id: rengIdN1 })
      return
    }
    rengSetN1(null)
    if (rengNav.destino === 'aprender') rengSetTemaAprender((rengP) => ({ id: rengTema.id, n: (rengP?.n ?? 0) + 1 }))
    else rengPracticarTema(rengTema.id)
  }, [rengNav.tema, rengNav.destino, rengPracticarTema])

  const rengAbrirEscena = useCallback((rengE: RengSubExperimento | null): void => rengSetNav((rengN) => ({ ...rengN, destino: 'simulacion', experimento: rengE })), [])

  const rengProbarEnLaboratorio = useCallback((rengT: RengTransferenciaSimulacion): void => {
    rengSetTransferencia((rengP) => ({ n: (rengP?.n ?? 0) + 1, escena: rengT.escena, entradas: rengT.entradas }))
    rengSetNav((rengN) => ({ ...rengN, destino: 'simulacion', experimento: rengT.escena }))
  }, [])

  const rengAbrirEnMesa = useCallback(
    (rengSmiles: string, rengModo: 'reemplazar' | 'anadir', rengDesdePractica = false): void => {
      const rengIds = rengMesa.anadirSustancia(rengSmiles, [0, 0, 0], rengModo === 'reemplazar')
      if (rengIds) {
        rengSetNav((rengN) => ({ ...rengN, destino: 'mesa', herramienta: 'explorar' }))
        rengSetMesaDesdePractica(rengDesdePractica)
      }
    },
    [rengMesa]
  )

  const rengRepasarLeccion = useCallback((rengTema: string): void => {
    rengSetN1(null)
    rengSetRepasoDesdePractica(true)
    rengSetTemaAprender((rengP) => ({ id: rengTema, n: (rengP?.n ?? 0) + 1 }))
    rengSetDestino('aprender')
  }, [rengSetDestino])

  const rengTeclaHerramienta = (rengEv: React.KeyboardEvent): void => {
    const rengSig = rengPestanaPorTecla(RENG_HERRAMIENTAS_MESA.map((rengH) => rengH.id), rengHerramienta, rengEv.key)
    if (!rengSig) return
    rengEv.preventDefault()
    rengIrAHerramienta(rengSig)
    rengBotonesHerramienta.current.get(rengSig)?.focus()
  }

  return (
    <RengTrabajoContext.Provider value={rengAlmacen}>
      <RengNivelContext.Provider value={rengDetalle}>
        <RengNivelPracticaContext.Provider value={rengNivel}>
          <div className="quimica-modulo" data-disciplina="quimica" data-nivel-practica={rengNivel}>
            <RengDestinos etiqueta="Química" idBase="quimica" valor={rengDestino} items={RENG_DESTINOS_QUIMICA} onCambio={rengSetDestino} redundante>
              <div className="destinos-extra">
                {rengDestino === 'casos' && (
                  <div className="segmentado q-nivel-global" role="group" aria-label="Nivel (atajos 1 a 4)">
                    {RENG_NIVELES_PRACTICA.map((rengN) => (
                      <button key={rengN} type="button" aria-pressed={rengNivel === rengN} onClick={() => rengSetNivel(rengN)} title={`${RENG_INFO_NIVEL_PRACTICA[rengN].descripcion} (${RENG_INFO_NIVEL_PRACTICA[rengN].tecla})`}>
                        {RENG_INFO_NIVEL_PRACTICA[rengN].corto}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </RengDestinos>

            <div className="quimica-catalogo" id="quimica-panel-catalogo" role="tabpanel" aria-labelledby="quimica-tab-catalogo" hidden={rengDestino !== 'catalogo'}>
              <RengCatalogo nivel={rengNivel} onPracticar={rengPracticarTema} onSimular={(rengE) => rengAbrirEscena(rengE)} />
            </div>

            <div className="quimica-catalogo quimica-temario" id="quimica-panel-temario" role="tabpanel" aria-labelledby="quimica-tab-temario" hidden={rengDestino !== 'temario'}>
              <RengTemario nivel={rengNivel} onIr={(rengA) => rengIrA(rengA.modulo, rengA.sub)} />
            </div>

            <div className="quimica-aprender" id="quimica-panel-aprender" role="tabpanel" aria-labelledby="quimica-tab-aprender" hidden={rengDestino !== 'aprender'}>
              {rengN1?.tipo === 'leccion' && <RengLeccionN1 id={rengN1.id} activo={rengDestino === 'aprender'} onVolver={rengCerrarN1} onPracticar={rengAbrirPracticasN1} onIr={(rengM, rengS) => rengIrA(rengM, rengS)} onAbrir={rengAbrirLeccionN1} />}
              <div hidden={rengN1?.tipo === 'leccion'}>
                <RengAprender nivel={rengNivel} activo={rengDestino === 'aprender' && rengN1?.tipo !== 'leccion'} temaDirecto={rengTemaAprender} onPracticar={rengPracticarTema} onSimular={(rengE) => rengAbrirEscena(rengE)} onAbrirEnMesa={rengAbrirEnMesa} mesaVacia={rengMesa.mesa.atomos.length === 0} volverAPractica={rengRepasoDesdePractica ? rengVolverAlEjercicio : undefined} extra={<RengIndiceN1 modo="aprender" onAbrir={rengAbrirLeccionN1} />} />
              </div>
            </div>

            <div className="quimica-practicas" id="quimica-panel-practicas" role="tabpanel" aria-labelledby="quimica-tab-practicas" hidden={rengDestino !== 'practicas'}>
              {rengN1?.tipo === 'practicas' && <RengPracticasN1 subtema={rengN1.id} activo={rengDestino === 'practicas'} onVolver={rengCerrarN1} onLeccion={rengAbrirLeccionN1} />}
              <div hidden={rengN1?.tipo === 'practicas'}>
                <RengEjerciciosQuimica estado={rengPract} despachar={rengDespacharPractica} nivel={rengNivel} onNivel={rengSetNivel} onTema={rengElegirTema} onSimular={rengProbarEnLaboratorio} onAbrirEnMesa={(rengS, rengM) => rengAbrirEnMesa(rengS, rengM, true)} mesaVacia={rengMesa.mesa.atomos.length === 0} activo={rengDestino === 'practicas' && rengN1?.tipo !== 'practicas'} aperturaDirecta={rengAperturaEjercicio} onRepasarLeccion={rengRepasarLeccion} avisos={rengAvisosPractica} onCerrarAvisos={() => rengSetAvisosPractica([])} extra={<RengIndiceN1 modo="practicas" onAbrir={rengAbrirPracticasN1} />} />
              </div>
            </div>

            <div className="lab quimica-experimentos" data-nivel={rengDetalle} id="quimica-panel-simulacion" role="tabpanel" aria-labelledby="quimica-tab-simulacion" hidden={rengDestino !== 'simulacion'}>
              <RengActividadContext.Provider value={rengDestino === 'simulacion'}>
                <RengNivelPracticaContext.Provider value={RENG_NIVEL_SIMULACION}>
                  <RengSimulaciones escena={rengExperimento} onEscena={rengAbrirEscena} transferencia={rengTransferencia} />
                </RengNivelPracticaContext.Provider>
              </RengActividadContext.Provider>
            </div>

            <div className="lab" data-nivel={rengDetalle} id="quimica-panel-casos" role="tabpanel" aria-labelledby="quimica-tab-casos" hidden={rengDestino !== 'casos'}>
              <div className="lab-panel quimica-scroll" id="panel-casos">
                <RengActividadContext.Provider value={rengDestino === 'casos'}>
                  <RengCasos mesa={rengMesa} onIrAExplorar={rengIrAExplorar} />
                </RengActividadContext.Provider>
              </div>
            </div>

            <div className="lab" data-nivel={rengDetalle} id="quimica-panel-mesa" role="tabpanel" aria-labelledby="quimica-tab-mesa" hidden={rengDestino !== 'mesa'}>
              <div className="lab-cuerpo">
                <RengBarraTrabajo onAnadir={rengIrAExplorar}>
                  <div className="segmentado herramientas-mesa" role="tablist" aria-label="Herramienta de la mesa" onKeyDown={rengTeclaHerramienta}>
                    {RENG_HERRAMIENTAS_MESA.map((rengH) => (
                      <button
                        key={rengH.id}
                        ref={(rengB) => {
                          if (rengB) rengBotonesHerramienta.current.set(rengH.id, rengB)
                          else rengBotonesHerramienta.current.delete(rengH.id)
                        }}
                        type="button"
                        role="tab"
                        id={`quimica-herr-${rengH.id}`}
                        aria-selected={rengHerramienta === rengH.id}
                        aria-controls={`panel-${rengH.id}`}
                        tabIndex={rengHerramienta === rengH.id ? 0 : -1}
                        title={rengH.ayuda}
                        onClick={() => rengIrAHerramienta(rengH.id)}
                      >
                        {rengH.nombre}
                      </button>
                    ))}
                  </div>
                  <div className="segmentado mesa-detalle" role="group" aria-label="Detalle de la mesa (atajos B y A)">
                    <button type="button" aria-pressed={rengDetalle === 'basico'} onClick={() => rengSetNivel(rengNivelDeDetalle('basico', rengNivel))} title="Solo lo esencial (B). Equivale al nivel Preuniversitario">
                      Básico
                    </button>
                    <button type="button" aria-pressed={rengDetalle === 'avanzado'} onClick={() => rengSetNivel(rengNivelDeDetalle('avanzado', rengNivel))} title="Más datos y métodos (A). Desde el nivel Universitario">
                      Avanzado
                    </button>
                  </div>
                  {rengMesaDesdePractica && (
                    <button type="button" className="btn sm" onClick={rengVolverAlEjercicio} title="Vuelve al mismo ejercicio, con tu respuesta y tus pistas">
                      Volver a la práctica
                    </button>
                  )}
                </RengBarraTrabajo>
                <div className="lab-panel" id="panel-explorar" role="tabpanel" aria-labelledby="quimica-herr-explorar" hidden={rengHerramienta !== 'explorar'}>
                  <RengActividadContext.Provider value={rengActiva('explorar')}>
                    <RengExplorar mesa={rengMesa} onVerPasoAPaso={() => rengIrAHerramienta('enlaces')} />
                  </RengActividadContext.Provider>
                </div>
                <div className="lab-panel" id="panel-enlaces" role="tabpanel" aria-labelledby="quimica-herr-enlaces" hidden={rengHerramienta !== 'enlaces'}>
                  <RengActividadContext.Provider value={rengActiva('enlaces')}>
                    <RengEnlaces mesa={rengMesa} visible={rengActiva('enlaces')} onIrAExplorar={rengIrAExplorar} />
                  </RengActividadContext.Provider>
                </div>
                <div className="lab-panel" id="panel-formulacion" role="tabpanel" aria-labelledby="quimica-herr-formulacion" hidden={rengHerramienta !== 'formulacion'}>
                  <RengActividadContext.Provider value={rengActiva('formulacion')}>
                    <RengFormulacion mesa={rengMesa} onIrAExplorar={rengIrAExplorar} onPracticar={() => rengPracticarTema('formular-nombrar')} />
                  </RengActividadContext.Provider>
                </div>
                <div className="lab-panel" id="panel-reacciones" role="tabpanel" aria-labelledby="quimica-herr-reacciones" hidden={rengHerramienta !== 'reacciones'}>
                  <RengActividadContext.Provider value={rengActiva('reacciones')}>
                    <RengReacciones mesa={rengMesa} onIrAExplorar={rengIrAExplorar} />
                  </RengActividadContext.Provider>
                </div>
              </div>
            </div>
          </div>
        </RengNivelPracticaContext.Provider>
      </RengNivelContext.Provider>
    </RengTrabajoContext.Provider>
  )
}
