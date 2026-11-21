import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type * as THREE from 'three'
import { RENG_ELEMENTOS } from '../../chemistry'
import { rengDescribirAtomo, rengSimboloConCarga, type RengModeloVisor } from '../../nucleo/modeloVisor'
import { rengDibujo2D } from '../../nucleo/molecula'
import { RengFormulaSimple } from '../Formula'
import { RengLienzo3D, type RengCamaraApi } from '../Lienzo3D'
import { rengColorTema } from '../nivel'
import { rengConstruirEscena, type RengEscena3D } from './construir3D'
import './visor.css'

interface RengProps {
  modelo: RengModeloVisor
  contexto: string
  onCerrar?: () => void
  onElegirEstructura?: (rengEntrada: string) => void
  alto?: number
}

const rengSvgDe = (rengSmiles: string | null): string | null => {
  if (!rengSmiles) return null
  try {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(rengDibujo2D(rengSmiles))))}`
  } catch {
    return null
  }
}

const rengDistanciaPara = (rengR: number): number => (rengR + 0.9) / Math.sin((25 * Math.PI) / 180)

export function RengVisorMolecular({ modelo: rengModelo, contexto: rengContexto, onCerrar: rengOnCerrar, onElegirEstructura: rengOnElegirEstructura, alto: rengAlto = 300 }: RengProps): React.JSX.Element {
  const rengId = useId()
  const [rengAmpliado, rengSetAmpliado] = useState(false)
  const [rengSel, rengSetSel] = useState<number | null>(null)
  const [rengBajo, rengSetBajo] = useState<number | null>(null)
  const rengCamara = useRef<RengCamaraApi>(null)
  const rengBotonAmpliar = useRef<HTMLButtonElement>(null)
  const rengBotonReducir = useRef<HTMLButtonElement>(null)
  const rengLista = useRef<HTMLUListElement>(null)
  const rengPulsado = useRef<{ x: number; y: number } | null>(null)
  const rengAcento = useMemo(() => rengColorTema('--escena-acento', 0x38d0ff), [])
  const rengM = rengModelo.estado === 'modelo' ? rengModelo : null

  const rengEscena = useMemo<RengEscena3D | null>(() => (rengM ? rengConstruirEscena(rengM) : null), [rengM])
  useEffect(() => rengSetSel(null), [rengM])
  useEffect(() => rengEscena?.resaltar(rengSel, rengAcento), [rengEscena, rengSel, rengAcento])

  useEffect(() => {
    if (!rengAmpliado) return
    rengBotonReducir.current?.focus()
    const rengTecla = (rengEv: KeyboardEvent): void => {
      if (rengEv.key !== 'Escape') return
      rengEv.preventDefault()
      rengEv.stopPropagation()
      rengSetAmpliado(false)
      requestAnimationFrame(() => rengBotonAmpliar.current?.focus())
    }
    window.addEventListener('keydown', rengTecla, true)
    return () => window.removeEventListener('keydown', rengTecla, true)
  }, [rengAmpliado])
  useEffect(() => {
    const rengT = window.setTimeout(() => rengCamara.current?.reiniciar(), 60)
    return () => window.clearTimeout(rengT)
  }, [rengAmpliado])

  const rengOnFrame = useCallback((_: number, rengCam: THREE.PerspectiveCamera) => rengEscena?.orientarRotulos(rengCam), [rengEscena])

  const rengElegir = (rengI: number | null, rengEnfocar = false): void => {
    rengSetSel(rengI)
    if (rengI !== null && rengEnfocar) rengLista.current?.querySelector<HTMLElement>(`[data-i="${rengI}"]`)?.focus()
    if (rengI !== null) rengLista.current?.querySelector<HTMLElement>(`[data-i="${rengI}"]`)?.scrollIntoView({ block: 'nearest' })
  }
  const rengTeclaLista = (rengEv: React.KeyboardEvent): void => {
    if (!rengM) return
    const rengN = rengM.atomos.length
    const rengActual = rengSel ?? -1
    const rengSig = rengEv.key === 'ArrowDown' || rengEv.key === 'ArrowRight' ? Math.min(rengN - 1, rengActual + 1) : rengEv.key === 'ArrowUp' || rengEv.key === 'ArrowLeft' ? Math.max(0, rengActual - 1) : rengEv.key === 'Home' ? 0 : rengEv.key === 'End' ? rengN - 1 : null
    if (rengSig === null) {
      if (rengEv.key === 'Escape' && rengSel !== null) {
        rengEv.preventDefault()
        rengSetSel(null)
      }
      return
    }
    rengEv.preventDefault()
    rengElegir(rengSig, true)
  }
  const rengTeclaLienzo = (rengEv: React.KeyboardEvent): void => {
    const rengC = rengCamara.current
    if (!rengC) return
    const rengPaso = 0.15
    const rengMapa: Record<string, () => void> = rengEv.shiftKey
      ? { ArrowLeft: () => rengC.desplazar(-0.05, 0), ArrowRight: () => rengC.desplazar(0.05, 0), ArrowUp: () => rengC.desplazar(0, 0.05), ArrowDown: () => rengC.desplazar(0, -0.05) }
      : { ArrowLeft: () => rengC.girar(-rengPaso, 0), ArrowRight: () => rengC.girar(rengPaso, 0), ArrowUp: () => rengC.girar(0, -rengPaso), ArrowDown: () => rengC.girar(0, rengPaso), '+': () => rengC.acercar(0.85), '=': () => rengC.acercar(0.85), '-': () => rengC.acercar(1.18), '0': () => rengC.reiniciar() }
    const rengF = rengMapa[rengEv.key]
    if (!rengF) return
    rengEv.preventDefault()
    rengF()
  }

  const rengTitulo = rengModelo.estado === 'vacio' ? 'Modelo 3D' : rengModelo.estado === 'ambigua' ? rengModelo.formula : rengModelo.titulo
  const rengSvg = useMemo(() => rengSvgDe(rengModelo.estado === 'sin-geometria' ? rengModelo.smiles : null), [rengModelo])

  return (
    <>
      {rengAmpliado && <div className="visor-fondo" aria-hidden="true" onClick={() => rengSetAmpliado(false)} />}
      <section
        className={`visor-mol${rengAmpliado ? ' ampliado' : ''}`}
        aria-labelledby={`${rengId}-titulo`}
        role={rengAmpliado ? 'dialog' : 'region'}
        aria-modal={rengAmpliado ? true : undefined}
      >
        <header className="visor-cab">
          <div className="visor-titulo">
            <span className="faint sm">{rengContexto}</span>
            <h3 id={`${rengId}-titulo`}>
              {rengTitulo}
              {rengM && rengM.formula !== rengM.titulo && (
                <span className="visor-formula">
                  <RengFormulaSimple texto={rengM.formula} />
                </span>
              )}
            </h3>
          </div>
          <div className="visor-acciones" role="group" aria-label="Vista del modelo">
            {rengM && (
              <>
                <button type="button" className="btn sm" onClick={() => rengCamara.current?.reiniciar()} aria-label="Restablecer la cámara" title="Restablecer la cámara (0)">
                  ⟲ <span className="visor-txt">Restablecer</span>
                </button>
                <button type="button" className="btn sm" onClick={() => rengCamara.current?.acercar(0.8)} aria-label="Acercar" title="Acercar (+)">
                  ＋
                </button>
                <button type="button" className="btn sm" onClick={() => rengCamara.current?.acercar(1.25)} aria-label="Alejar" title="Alejar (−)">
                  －
                </button>
              </>
            )}
            {rengAmpliado ? (
              <button ref={rengBotonReducir} type="button" className="btn sm" onClick={() => {
                rengSetAmpliado(false)
                requestAnimationFrame(() => rengBotonAmpliar.current?.focus())
              }} aria-label="Reducir el visor" title="Volver al tamaño normal (Esc)">
                ⤡ <span className="visor-txt">Reducir</span>
              </button>
            ) : (
              rengM && (
                <button ref={rengBotonAmpliar} type="button" className="btn sm" onClick={() => rengSetAmpliado(true)} aria-label="Ampliar el visor" title="Ampliar el visor (Esc para volver)">
                  ⤢ <span className="visor-txt">Ampliar</span>
                </button>
              )
            )}
            {rengOnCerrar && !rengAmpliado && (
              <button type="button" className="btn ghost sm" onClick={rengOnCerrar} aria-label="Cerrar el modelo 3D">
                ✕
              </button>
            )}
          </div>
        </header>

        {rengM && rengEscena ? (
          <div className="visor-cuerpo">
            <div
              className="visor-lienzo"
              style={rengAmpliado ? undefined : { height: rengAlto }}
              tabIndex={0}
              role="application"
              aria-roledescription="visor 3D"
              aria-label={`Modelo 3D de ${rengM.titulo}. Flechas: girar; Mayús y flechas: desplazar; más y menos: acercar; 0: restablecer.`}
              onKeyDown={rengTeclaLienzo}
              onPointerDown={(rengEv) => (rengPulsado.current = { x: rengEv.clientX, y: rengEv.clientY })}
              onPointerUp={(rengEv) => {
                const rengP = rengPulsado.current
                rengPulsado.current = null
                if (!rengP || Math.hypot(rengEv.clientX - rengP.x, rengEv.clientY - rengP.y) > 4 || rengEv.button !== 0) return
                rengElegir(rengBajo)
              }}
            >
              <RengLienzo3D modelo={rengEscena.grupo} distancia={rengDistanciaPara(rengM.radio)} etiqueta={`Modelo 3D de ${rengM.titulo} en bolas y varillas`} onHoverAtomo={rengSetBajo} onFrame={rengOnFrame} botones={false} atajos={false} apiRef={rengCamara}>
                <div className="visor-hud" aria-live="polite">
                  {rengBajo !== null ? (
                    <span>
                      <b>{rengSimboloConCarga(rengM.atomos[rengBajo]!.el, rengM.atomos[rengBajo]!.carga)}</b> · {rengM.atomos[rengBajo]!.nombreElemento} ({rengM.atomos[rengBajo]!.etiqueta})
                    </span>
                  ) : (
                    <span>Pasa el cursor sobre un átomo · clic para seleccionarlo</span>
                  )}
                </div>
                <div className="visor-procedencia" title={rengM.procedencia.detalle}>
                  {rengM.procedencia.texto}
                </div>
              </RengLienzo3D>
            </div>

            <div className="visor-lado">
              {rengSel !== null ? <RengFichaAtomo m={rengM} i={rengSel} onElegir={(rengI) => rengElegir(rengI, true)} /> : <p className="faint sm visor-nota">Elige un átomo en el modelo o en la lista para ver su número atómico, su carga formal y sus enlaces.</p>}
              <div className="visor-lista-cab">
                <span className="sm">Átomos ({rengM.atomos.length})</span>
                {rengSel !== null && (
                  <button type="button" className="btn ghost sm" onClick={() => rengSetSel(null)}>
                    Quitar selección
                  </button>
                )}
              </div>
              <ul ref={rengLista} className="visor-lista" role="listbox" aria-label={`Átomos de ${rengM.titulo}`} aria-activedescendant={rengSel !== null ? `${rengId}-a${rengSel}` : undefined} onKeyDown={rengTeclaLista}>
                {rengM.atomos.map((rengX, rengI) => (
                  <li
                    key={rengI}
                    id={`${rengId}-a${rengI}`}
                    data-i={rengI}
                    role="option"
                    aria-selected={rengSel === rengI}
                    tabIndex={rengSel === rengI || (rengSel === null && rengI === 0) ? 0 : -1}
                    className={`visor-atomo${rengSel === rengI ? ' activo' : ''}`}
                    onClick={() => rengElegir(rengI, true)}
                    onMouseEnter={() => rengSetBajo(rengI)}
                    onMouseLeave={() => rengSetBajo(null)}
                  >
                    <span className="visor-punto" style={{ background: rengColorElemento(rengX.el) }} aria-hidden="true" />
                    {rengX.etiqueta}
                    {rengX.carga !== 0 && <small> {rengX.carga > 0 ? `+${rengX.carga}` : `−${Math.abs(rengX.carga)}`}</small>}
                  </li>
                ))}
              </ul>
              {rengM.componentes.length > 1 && (
                <div className="sm visor-componentes">
                  <b>{rengM.tipo === 'ionico' ? 'Iones' : 'Componentes'}:</b>{' '}
                  {rengM.componentes.map((rengC, rengK) => (
                    <span key={rengK}>
                      {rengK > 0 ? ' · ' : ''}
                      <RengFormulaSimple texto={rengC.formula} />
                      {rengC.carga !== 0 ? (rengC.carga > 0 ? `${rengC.carga > 1 ? rengC.carga : ''}⁺` : `${rengC.carga < -1 ? -rengC.carga : ''}⁻`) : ''}
                      {rengC.nombre ? ` (${rengC.nombre})` : ''}
                    </span>
                  ))}
                  <div className="faint">No se dibuja ningún enlace entre ellos.</div>
                </div>
              )}
              {rengM.avisos.map((rengA) => (
                <p key={rengA} className="sm visor-aviso">
                  {rengA}
                </p>
              ))}
              <details className="panel-seccion">
                <summary>Procedencia de la geometría</summary>
                <p className="sm">{rengM.procedencia.detalle}</p>
                <p className="faint sm">Colores por elemento (convenio CPK); el símbolo va sobre cada átomo. Varillas: una por enlace simple, dos por doble, tres por triple; en anillos aromáticos, una continua y otra discontinua.</p>
              </details>
            </div>
          </div>
        ) : (
          <div className="visor-estado" role="status">
            {rengModelo.estado === 'vacio' && <p className="sm">{rengModelo.motivo}</p>}
            {rengModelo.estado === 'incompleta' && (
              <p className="sm">
                <b>Estructura incompleta.</b> {rengModelo.motivo}
              </p>
            )}
            {rengModelo.estado === 'ambigua' && (
              <>
                <p className="sm">{rengModelo.motivo}</p>
                {rengOnElegirEstructura && (
                  <div className="row" role="group" aria-label="Estructuras posibles">
                    {rengModelo.opciones.map((rengO) => (
                      <button key={rengO.entrada} type="button" className="btn sm" onClick={() => rengOnElegirEstructura(rengO.entrada)}>
                        {rengO.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            {rengModelo.estado === 'sin-geometria' && (
              <>
                <p className="sm">
                  <b>Sin modelo 3D fiable.</b> {rengModelo.diagnostico}
                </p>
                {rengSvg ? (
                  <figure className="visor-2d">
                    <img src={rengSvg} alt={`Estructura 2D de ${rengModelo.titulo}`} />
                    <figcaption className="faint sm">Estructura 2D (conectividad, sin geometría 3D).</figcaption>
                  </figure>
                ) : (
                  <p className="faint sm">No hay una estructura 2D que mostrar.</p>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </>
  )
}

const rengColorElemento = (rengEl: string): string => `#${(RENG_ELEMENTOS[rengEl]?.color ?? 0xff00ff).toString(16).padStart(6, '0')}`

function RengFichaAtomo({ m: rengM, i: rengI, onElegir: rengOnElegir }: { m: Extract<RengModeloVisor, { estado: 'modelo' }>; i: number; onElegir: (rengI: number) => void }): React.JSX.Element {
  const rengD = rengDescribirAtomo(rengM, rengI)
  const rengX = rengM.atomos[rengI]!
  return (
    <div className="visor-ficha" role="status" aria-live="polite">
      <b>{rengD.titulo}</b>
      <dl className="visor-datos">
        <dt>Símbolo</dt>
        <dd>{rengX.el}</dd>
        <dt>Número atómico</dt>
        <dd>{rengD.z}</dd>
        <dt>Carga formal</dt>
        <dd>{rengD.carga}</dd>
        <dt>Enlaces</dt>
        <dd>
          {rengD.enlaces.length === 0
            ? rengM.tipo === 'ionico' || rengM.tipo === 'mezcla'
              ? 'ninguno (ion o componente separado)'
              : 'ninguno'
            : rengD.enlaces.map((rengV, rengK) => (
                <span key={rengV.i}>
                  {rengK > 0 ? ', ' : ''}
                  <button type="button" className="btn ghost sm visor-enlace" onClick={() => rengOnElegir(rengV.i)} title={`Seleccionar ${rengM.atomos[rengV.i]!.etiqueta}`}>
                    {rengV.texto}
                  </button>
                </span>
              ))}
        </dd>
      </dl>
    </div>
  )
}
