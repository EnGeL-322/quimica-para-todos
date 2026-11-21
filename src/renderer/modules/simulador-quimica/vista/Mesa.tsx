import { forwardRef, useEffect, useImperativeHandle, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { rengCreateEngine, type RengEngine } from '../../../lib/three/engine'
import { RengEscenaMesa, type RengOpcionesMesa } from '../escena/mesa'
import { rengAtomo, rengBorrarAtomos, rengFragmentoDe, rengMoverAtomos, type RengVec3 } from '../nucleo/mesa'
import { useRengActivo } from './actividad'
import { useRengArrastre } from './arrastre'
import { RENG_DEMOS, rengEjecutarDemo } from './demoMesa'
import { useRengMuestra } from './nivel'
import { rengLeerPaleta } from './paleta'
import { rengSeleccionarEnlace } from '../estado/acciones'
import { rengIdFragmento } from '../estado/trabajo'
import { useRengInteraccionMesa } from './useInteraccionMesa'
import type { RengEstadoMesa } from './useMesa'
import { useRengAlmacen, useRengTrabajo } from './useTrabajo'
import { RengIcon } from '@/shell/Icon'
import { RengLimite3D } from '@/shell/Limite3D'

export interface RengMesaApi {
  demo: (rengCual: keyof typeof RENG_DEMOS) => void
  libre: () => RengVec3
}

interface RengProps {
  estado: RengEstadoMesa
  opciones: RengOpcionesMesa
  onVerPasoAPaso?: (rengA: number, rengB: number) => void
  children?: ReactNode
}

const RengMesaInterna = forwardRef<RengMesaApi, RengProps>(function RengMesa({ estado: rengEstado, opciones: rengOpciones, onVerPasoAPaso: rengOnVerPasoAPaso, children: rengChildren }, rengApi) {
  const rengMuestra = useRengMuestra()
  const rengZona = useRef<HTMLDivElement>(null)
  const rengCanvas = useRef<HTMLCanvasElement>(null)
  const rengEngine = useRef<RengEngine | null>(null)
  const rengEscena = useRef<RengEscenaMesa | null>(null)
  const rengRotulo = useRef<HTMLDivElement>(null)
  const rengCursor = useRef<HTMLDivElement>(null)
  const rengCursorMundo = useRef<THREE.Vector3 | null>(null)
  const rengPulsado = useRef<{ x: number; y: number; enlace: string | null } | null>(null)
  const rengDemoActiva = useRef(0)
  const rengT = useRengAlmacen()
  const rengSel = useRengTrabajo((rengE) => rengE.seleccion.atomos)
  const rengSetSel = (rengF: (rengS: number[]) => number[]): void =>
    rengT.aplicar((rengE) => {
      const rengAtomos = rengF(rengE.seleccion.atomos)
      const rengUltimoId = rengAtomos[rengAtomos.length - 1]
      return { ...rengE, seleccion: { atomos: rengAtomos, enlace: null }, activo: rengUltimoId !== undefined ? rengIdFragmento(rengFragmentoDe(rengE.mesa, rengUltimoId)) : rengE.activo }
    }, false)
  const rengIt = useRengInteraccionMesa(rengEstado, rengEngine, rengEscena, rengOpciones)
  const { registrar: rengRegistrar } = useRengArrastre()
  const rengUltimo = rengEstado.ultimo && rengAtomo(rengEstado.mesa, rengEstado.ultimo.a) && rengAtomo(rengEstado.mesa, rengEstado.ultimo.b) ? rengEstado.ultimo : null

  const rengRayo = (rengX: number, rengY: number): THREE.Raycaster => {
    const rengR = rengCanvas.current!.getBoundingClientRect()
    const rengRay = new THREE.Raycaster()
    rengRay.setFromCamera(new THREE.Vector2(((rengX - rengR.left) / rengR.width) * 2 - 1, -((rengY - rengR.top) / rengR.height) * 2 + 1), rengEngine.current!.camera)
    return rengRay
  }
  const rengEnPlano = (rengRay: THREE.Raycaster, rengPlano: THREE.Plane): THREE.Vector3 => rengRay.ray.intersectPlane(rengPlano, new THREE.Vector3()) ?? rengEngine.current!.controls.target.clone()

  useEffect(() => {
    const rengC = rengCanvas.current
    if (!rengC) return
    const rengE = rengCreateEngine(rengC)
    const rengEs = new RengEscenaMesa(rengLeerPaleta())
    rengEngine.current = rengE
    rengEscena.current = rengEs
    rengE.scene.add(rengEs.grupo)
    rengE.frame([0, 0, 0], 11)
    const rengProyectar = (rengP: THREE.Vector3, rengEl: HTMLElement | null): void => {
      if (!rengEl) return
      const rengQ = rengP.clone().project(rengE.camera)
      const rengR = rengC.getBoundingClientRect()
      rengEl.style.transform = `translate(${((rengQ.x + 1) / 2) * rengR.width}px, ${((1 - rengQ.y) / 2) * rengR.height}px)`
    }
    rengE.onFrame((rengDt) => {
      rengEs.rengActualizar(rengDt, rengE.camera)
      const rengU = rengEstadoUltimo.current
      const rengPa = rengU ? rengEs.posicion(rengU.a) : null
      const rengPb = rengU ? rengEs.posicion(rengU.b) : null
      if (rengPa && rengPb) rengProyectar(rengPa.clone().add(rengPb).multiplyScalar(0.5), rengRotulo.current)
      if (rengCursorMundo.current) rengProyectar(rengCursorMundo.current, rengCursor.current)
    })
    return () => {
      rengDemoActiva.current++
      rengE.scene.remove(rengEs.grupo)
      rengEs.rengLiberar()
      rengE.dispose()
      rengEngine.current = null
      rengEscena.current = null
    }
  }, [])
  const rengEstadoUltimo = useRef(rengUltimo)
  rengEstadoUltimo.current = rengUltimo

  const rengActivo = useRengActivo()
  useEffect(() => rengEngine.current?.activar(rengActivo), [rengActivo])

  useEffect(() => {
    if (!rengIt.op.current) rengEscena.current?.rengSincronizar(rengEstado.mesa, rengOpciones, rengEstado.nuevos)
  }, [rengEstado.mesa, rengEstado.nuevos, rengOpciones, rengIt.op])
  useEffect(() => rengEscena.current?.rengSeleccionar(new Set(rengSel)), [rengSel])

  useEffect(() => {
    rengRegistrar({
      contiene: (rengX, rengY) => {
        const rengR = rengCanvas.current?.getBoundingClientRect()
        return !!rengR && rengX >= rengR.left && rengX <= rengR.right && rengY >= rengR.top && rengY <= rengR.bottom
      },
      mover: (rengItem, rengX, rengY) => {
        const rengRay = rengRayo(rengX, rengY)
        if (!rengIt.op.current) {
          const rengP = rengEnPlano(rengRay, new THREE.Plane().setFromNormalAndCoplanarPoint(rengEngine.current!.camera.getWorldDirection(new THREE.Vector3()), rengEngine.current!.controls.target))
          if (!rengIt.entrarItem(rengItem, rengP)) return
        }
        rengIt.moverA(rengEnPlano(rengRay, rengIt.op.current!.plano))
      },
      soltar: (rengItem, rengX, rengY) => {
        if (!rengIt.op.current) return
        rengIt.moverA(rengEnPlano(rengRayo(rengX, rengY), rengIt.op.current.plano))
        rengIt.terminar()
      },
      salir: () => rengIt.cancelar()
    })
    return () => rengRegistrar(null)
  })
  const rengLibre = (): RengVec3 => {
    const rengOcupado = (rengP: RengVec3): boolean => rengEstado.actual.current.atomos.some((rengA) => Math.hypot(rengA.p[0] - rengP[0], rengA.p[1] - rengP[1], rengA.p[2] - rengP[2]) < 1.8)
    for (let rengK = 0; rengK < 40; rengK++) {
      const rengP: RengVec3 = rengK === 0 ? [0, 0, 0] : [Math.cos(rengK * 2.4) * (1 + rengK * 0.35), Math.sin(rengK * 2.4) * (1 + rengK * 0.35), 0]
      if (!rengOcupado(rengP)) return rengP
    }
    return [0, 0, 0]
  }

  useImperativeHandle(rengApi, () => ({
    libre: rengLibre,
    demo: (rengCual) => {
      const rengId = ++rengDemoActiva.current
      rengEstado.limpiar()
      void rengEjecutarDemo(RENG_DEMOS[rengCual].pasos, {
        inicio: () => rengEnPlano(rengRayo(rengCanvas.current!.getBoundingClientRect().right - 30, rengCanvas.current!.getBoundingClientRect().top + 80), new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)),
        entrar: (rengItem, rengP) => rengIt.entrarItem(rengItem, rengP),
        mover: (rengP) => rengIt.moverA(rengP),
        soltar: () => rengIt.terminar(),
        cursor: (rengP) => {
          rengCursorMundo.current = rengP
          if (rengCursor.current) rengCursor.current.hidden = !rengP
        },
        reducido: rengOpciones.reducido,
        cancelada: () => rengDemoActiva.current !== rengId
      })
    }
  }))
  const rengTecla = (rengEv: React.KeyboardEvent): void => {
    const rengM = rengEstado.actual.current
    const rengPaso = 0.3
    const rengFlechas: Record<string, RengVec3> = { ArrowLeft: [-rengPaso, 0, 0], ArrowRight: [rengPaso, 0, 0], ArrowUp: [0, rengPaso, 0], ArrowDown: [0, -rengPaso, 0] }
    if (rengFlechas[rengEv.key] && rengSel.length) {
      rengEv.preventDefault()
      rengEstado.poner(rengMoverAtomos(rengM, new Set(rengSel.flatMap((rengId) => rengFragmentoDe(rengM, rengId))), rengFlechas[rengEv.key]!))
    } else if (rengEv.key.toLowerCase() === 'b' && rengSel.length === 2) {
      rengEv.stopPropagation()
      rengEstado.intentarUnir(rengM, rengSel[0]!, rengSel[1]!)
    }
    else if ((rengEv.key === 'Delete' || rengEv.key === 'Supr' || rengEv.key === 'Backspace') && rengSel.length) {
      rengEstado.poner(rengBorrarAtomos(rengM, new Set(rengSel)))
      rengSetSel(() => [])
    } else if (rengEv.key === 'Escape') rengSetSel(() => [])
  }


  return (
    <div className="zonas-lienzo mesa" ref={rengZona} tabIndex={0} onKeyDown={rengTecla} aria-label="Mesa de trabajo 3D: flechas mueven lo seleccionado, B une los dos seleccionados, Supr borra">
      <canvas
        ref={rengCanvas}
        role="img"
        aria-label={`Mesa con ${rengEstado.mesa.atomos.length} átomos`}
        onPointerDown={(rengEv) => {
          const rengRay = rengRayo(rengEv.clientX, rengEv.clientY)
          const rengId = rengEscena.current?.rengAtomoEn(rengRay) ?? null
          rengPulsado.current = { x: rengEv.clientX, y: rengEv.clientY, enlace: rengId === null ? (rengEscena.current?.rengEnlaceEn(rengRay) ?? null) : null }
          if (rengId === null) return
          const rengPos = rengEscena.current!.posicion(rengId)!.clone()
          const rengPlano = new THREE.Plane().setFromNormalAndCoplanarPoint(rengEngine.current!.camera.getWorldDirection(new THREE.Vector3()), rengPos)
          rengIt.pulsarAtomo(rengId, rengEnPlano(rengRay, rengPlano), { alt: rengEv.altKey, mayus: rengEv.shiftKey })
          rengCanvas.current!.setPointerCapture(rengEv.pointerId)
        }}
        onPointerMove={(rengEv) => {
          const rengO = rengIt.op.current
          if (rengO) rengIt.moverA(rengEnPlano(rengRayo(rengEv.clientX, rengEv.clientY), rengO.plano))
        }}
        onPointerUp={(rengEv) => {
          const rengO = rengIt.op.current
          const rengP = rengPulsado.current
          rengPulsado.current = null
          const rengQuieto = !!rengP && Math.hypot(rengEv.clientX - rengP.x, rengEv.clientY - rengP.y) < 4
          if (rengO && rengQuieto && rengO.modo !== 'enlace') {
            rengIt.cancelar()
            rengSetSel((rengS) => (rengS.includes(rengO.agarrado) ? rengS.filter((rengX) => rengX !== rengO.agarrado) : [...rengS, rengO.agarrado].slice(-2)))
            rengZona.current?.focus()
          } else if (rengO?.modo === 'enlace') rengIt.terminarEnlaceSobre(rengEscena.current?.rengAtomoEn(rengRayo(rengEv.clientX, rengEv.clientY)) ?? null)
          else if (rengO) rengIt.terminar()
          else if (rengQuieto && rengP?.enlace) {
            const [rengA, rengB] = rengP.enlace.split('-').map(Number)
            if (rengEv.shiftKey) rengEstado.intentarUnir(rengEstado.actual.current, rengA!, rengB!)
            else rengT.aplicar((rengE) => rengSeleccionarEnlace(rengE, rengA!, rengB!), false)
          }
        }}
      />
      {rengIt.pista && (
        <div className={`mesa-pista ${rengIt.pista.ok ? 'ok' : 'no'}`} role="status">
          <RengIcon name={rengIt.pista.ok ? 'check' : 'cross'} size={12} />{' '}
          {rengIt.pista.texto}
        </div>
      )}
      {rengUltimo && rengMuestra('explorar.rotuloEnlace') && (
        <div className="mesa-rotulo" ref={rengRotulo}>
          <span>{rengUltimo.r.motivo}</span>
          {rengOnVerPasoAPaso && (
            <button
              className="btn sm"
              title="Abre en Enlaces el paso a paso de ESTE enlace"
              onClick={() => {
                rengT.aplicar((rengE) => rengSeleccionarEnlace(rengE, rengUltimo.a, rengUltimo.b), false)
                rengOnVerPasoAPaso(rengUltimo.a, rengUltimo.b)
              }}
            >
              Ver paso a paso
            </button>
          )}
        </div>
      )}
      <ul className="sr-only" aria-label="Átomos de la mesa: elige dos y pulsa B para unirlos (o subir el orden del enlace)">
        {rengEstado.mesa.atomos.map((rengA) => (
          <li key={rengA.id}>
            <button aria-pressed={rengSel.includes(rengA.id)} onClick={() => rengSetSel((rengS) => (rengS.includes(rengA.id) ? rengS.filter((rengX) => rengX !== rengA.id) : [...rengS, rengA.id].slice(-2)))}>
              {`${rengA.el}${rengA.carga ? (rengA.carga > 0 ? '+' : '−') : ''} (átomo ${rengA.id})`}
            </button>
          </li>
        ))}
      </ul>
      <div className="mesa-cursor" ref={rengCursor} hidden aria-hidden="true">
        ➤
      </div>
      {rengChildren}
    </div>
  )
})

export const RengMesa = forwardRef<RengMesaApi, RengProps>(function RengMesaConLimite(rengProps, rengApi) {
  return (
    <RengLimite3D etiqueta="La mesa 3D">
      <RengMesaInterna ref={rengApi} {...rengProps} />
    </RengLimite3D>
  )
})
