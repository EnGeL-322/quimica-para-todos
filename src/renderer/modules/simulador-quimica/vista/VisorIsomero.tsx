import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type * as THREE from 'three'
import { RENG_ELEMENTOS } from '../chemistry'
import { rengAlternarAtomo, rengEtiquetasSeleccion, type RengGeometriaIsomero } from '../nucleo/isomeros'
import { rengModeloDeSmiles } from '../nucleo/modeloVisor'
import { RengEstructura2D } from './Estructura2D'
import { RengLienzo3D, type RengCamaraApi } from './Lienzo3D'
import { rengColorTema } from './nivel'
import { rengConstruirEscena } from './visor/construir3D'
import './visor/visor.css'

interface RengProps {
  lado: 'A' | 'B'
  geometria: RengGeometriaIsomero
  seleccion: readonly number[]
  onCambiar: (rengSel: number[]) => void
}

const rengDistanciaPara = (rengR: number): number => (rengR + 0.9) / Math.sin((25 * Math.PI) / 180)
const rengColorElemento = (rengEl: string): string => `#${(RENG_ELEMENTOS[rengEl]?.color ?? 0xff00ff).toString(16).padStart(6, '0')}`

export function RengVisorIsomero({ lado: rengLado, geometria: rengG, seleccion: rengSel, onCambiar: rengOnCambiar }: RengProps): React.JSX.Element {
  const rengId = useId()
  const rengCamara = useRef<RengCamaraApi>(null)
  const rengPulsado = useRef<{ x: number; y: number } | null>(null)
  const rengLista = useRef<HTMLUListElement>(null)
  const [rengBajo, rengSetBajo] = useState<number | null>(null)
  const [rengAviso, rengSetAviso] = useState<string | null>(null)
  const [rengFoco, rengSetFoco] = useState(0)
  const rengAcento = useMemo(() => rengColorTema('--escena-acento', 0x38d0ff), [])
  const rengModelo = useMemo(() => {
    const rengM = rengModeloDeSmiles(rengG.smiles, rengG.nombre)
    return rengM.estado === 'modelo' ? rengM : null
  }, [rengG])
  const rengEscena = useMemo(() => (rengModelo ? rengConstruirEscena(rengModelo) : null), [rengModelo])

  useEffect(() => {
    if (!rengEscena) return
    rengEscena.grupo.traverse((rengO) => {
      const rengIdx = rengO.userData['atomo'] as number | undefined
      if (rengIdx === undefined) return
      const rengMat = (rengO as THREE.Mesh).material as THREE.MeshStandardMaterial
      const rengActivo = rengSel.includes(rengIdx)
      rengMat.emissive.setHex(rengActivo ? rengAcento : 0x000000)
      rengMat.emissiveIntensity = rengActivo ? 0.8 : 0
      rengO.scale.setScalar((rengO.userData['escala'] as number) * (rengActivo ? 1.25 : 1))
    })
  }, [rengEscena, rengSel, rengAcento])

  useEffect(() => rengSetAviso(null), [rengG])

  const rengAlternar = (rengI: number): void => {
    const rengR = rengAlternarAtomo(rengSel, rengI)
    rengSetAviso(rengR.aviso)
    if (rengR.seleccion.length !== rengSel.length || rengR.seleccion.some((rengX, rengK) => rengX !== rengSel[rengK])) rengOnCambiar(rengR.seleccion)
  }

  const rengMoverFoco = (rengNuevo: number): void => {
    const rengN = rengG.atomos.length
    const rengI = Math.max(0, Math.min(rengN - 1, rengNuevo))
    rengSetFoco(rengI)
    rengLista.current?.querySelector<HTMLElement>(`[data-i="${rengI}"]`)?.focus()
  }
  const rengTeclaLista = (rengEv: React.KeyboardEvent): void => {
    const rengMapa: Record<string, () => void> = {
      ArrowDown: () => rengMoverFoco(rengFoco + 1),
      ArrowRight: () => rengMoverFoco(rengFoco + 1),
      ArrowUp: () => rengMoverFoco(rengFoco - 1),
      ArrowLeft: () => rengMoverFoco(rengFoco - 1),
      Home: () => rengMoverFoco(0),
      End: () => rengMoverFoco(rengG.atomos.length - 1),
      Enter: () => rengAlternar(rengFoco),
      ' ': () => rengAlternar(rengFoco)
    }
    const rengF = rengMapa[rengEv.key]
    if (!rengF) return
    rengEv.preventDefault()
    rengF()
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

  const rengEtiquetas = rengEtiquetasSeleccion(rengG, rengSel)
  const rengProc = rengG.procedencia

  return (
    <section className="visor-mol q-iso-visor" aria-labelledby={`${rengId}-titulo`} data-lado={rengLado}>
      <header className="visor-cab">
        <div className="visor-titulo">
          <span className="faint sm">Isómero {rengLado}</span>
          <h3 id={`${rengId}-titulo`}>
            {rengG.nombre}
            <span className="visor-formula">{rengG.formula}</span>
          </h3>
        </div>
        <div className="visor-acciones" role="group" aria-label={`Vista 3D del isómero ${rengLado}`}>
          <button type="button" className="btn sm" onClick={() => rengCamara.current?.reiniciar()} aria-label={`Restablecer la cámara del isómero ${rengLado}`}>
            ⟲ <span className="visor-txt">Restablecer</span>
          </button>
        </div>
      </header>
      <p className="sm q-iso-procedencia" data-procedencia={rengProc.origen}>
        <b>{rengProc.texto}.</b> {rengProc.origen === 'calculada' ? 'No es una medida.' : 'Geometría medida.'}
      </p>
      <RengEstructura2D smiles={rengG.smiles} descripcion={`Estructura 2D de ${rengG.nombre}`} />
      {rengEscena ? (
        <div
          className="visor-lienzo q-iso-lienzo"
          style={{ height: 240 }}
          tabIndex={0}
          role="application"
          aria-roledescription="visor 3D"
          aria-label={`Modelo 3D de ${rengG.nombre}. Flechas: girar; Mayús y flechas: desplazar; más y menos: acercar; 0: restablecer. Para elegir átomos usa la lista de átomos de debajo.`}
          onKeyDown={rengTeclaLienzo}
          onPointerDown={(rengEv) => (rengPulsado.current = { x: rengEv.clientX, y: rengEv.clientY })}
          onPointerUp={(rengEv) => {
            const rengP = rengPulsado.current
            rengPulsado.current = null
            if (!rengP || Math.hypot(rengEv.clientX - rengP.x, rengEv.clientY - rengP.y) > 4 || rengEv.button !== 0 || rengBajo === null) return
            rengAlternar(rengBajo)
          }}
        >
          <RengLienzo3D modelo={rengEscena.grupo} distancia={rengDistanciaPara(rengModelo!.radio)} etiqueta={`Modelo 3D de ${rengG.nombre} en bolas y varillas`} onHoverAtomo={rengSetBajo} onFrame={(_, rengCam) => rengEscena.orientarRotulos(rengCam)} apiRef={rengCamara} botones={false} atajos={false}>
            <div className="visor-hud" aria-hidden="true">
              {rengBajo !== null ? (
                <span>
                  <b>{rengG.atomos[rengBajo]!.etiqueta}</b> · clic para {rengSel.includes(rengBajo) ? 'quitarlo' : 'elegirlo'}
                </span>
              ) : (
                <span>Clic en un átomo para elegirlo</span>
              )}
            </div>
          </RengLienzo3D>
        </div>
      ) : (
        <p className="sm visor-aviso" role="status">
          No hay modelo 3D de este isómero.
        </p>
      )}
      <div className="visor-lado">
        <div className="visor-lista-cab">
          <span className="sm" id={`${rengId}-lista`}>
            Átomos elegidos ({rengSel.length} de 4): <b data-seleccion={rengLado}>{rengEtiquetas.length > 0 ? rengEtiquetas.map((rengE, rengK) => `${rengK + 1}·${rengE}`).join(' → ') : 'ninguno'}</b>
          </span>
          {rengSel.length > 0 && (
            <button type="button" className="btn ghost sm" onClick={() => rengOnCambiar([])}>
              Quitar selección
            </button>
          )}
        </div>
        <ul ref={rengLista} className="visor-lista" role="listbox" aria-multiselectable="true" aria-labelledby={`${rengId}-lista`} onKeyDown={rengTeclaLista}>
          {rengG.atomos.map((rengA, rengI) => {
            const rengPos = rengSel.indexOf(rengI)
            return (
              <li
                key={rengI}
                data-i={rengI}
                role="option"
                aria-selected={rengPos >= 0}
                tabIndex={rengFoco === rengI ? 0 : -1}
                className={`visor-atomo${rengPos >= 0 ? ' activo' : ''}`}
                onClick={() => {
                  rengSetFoco(rengI)
                  rengAlternar(rengI)
                }}
                onFocus={() => rengSetFoco(rengI)}
                onMouseEnter={() => rengSetBajo(rengI)}
                onMouseLeave={() => rengSetBajo(null)}
              >
                <span className="visor-punto" style={{ background: rengColorElemento(rengA.el) }} aria-hidden="true" />
                {rengA.etiqueta}
                {rengPos >= 0 && <small> ({rengPos + 1})</small>}
              </li>
            )
          })}
        </ul>
        <p className="sm visor-aviso" role="status" aria-live="polite">
          {rengAviso ?? ''}
        </p>
      </div>
    </section>
  )
}
