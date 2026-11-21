import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RengSecuencia } from '../enlaces/secuencias'
import { rengConstruirEscena } from '../escena/registro'
import { rengAlternar, rengAnterior, rengAvanzar, rengEstadoInicial, rengIrA, rengPosicion, rengSiguiente, type RengEstadoSecuencia } from '../escena/secuenciador'
import type { RengEscenaEnlace } from '../escena/util3d'
import { rengResaltarElemento } from '../molecule'
import { RENG_DIATOMICAS, rengParametrosMorse } from '../nucleo/datosEnlace'
import { rengBonita } from '../nucleo/formula'
import { useRengActivo } from './actividad'
import { RengControlesPaso } from './ControlesPaso'
import { RengCurvaEnergia } from './CurvaEnergia'
import { RengEscalaEnergias } from './EscalaEnergias'
import { RengFormula } from './Formula'
import { RengLienzo3D } from './Lienzo3D'
import { rengEsCampoDeTexto, rengMovimientoReducido, useRengMuestra } from './nivel'
import { RengPanelExplicacion, RengVerMas } from './PanelExplicacion'
import { rengLeerPaleta } from './paleta'
import { RengTresZonas } from './TresZonas'

interface RengVista {
  paso: number
  t: number
  reproduciendo: boolean
  s: number
}

export function RengEnlaceAnimado({ sec: rengSec, selector: rengSelector, atajos: rengAtajos = true }: { sec: RengSecuencia; selector: React.ReactNode; atajos?: boolean }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const rengTotal = rengSec.pasos.length
  const rengPaleta = useMemo(rengLeerPaleta, [])
  const rengEscena: RengEscenaEnlace = useMemo(() => rengConstruirEscena(rengSec, rengPaleta), [rengSec, rengPaleta])
  const rengDuraciones = useMemo(() => (rengMovimientoReducido() ? rengSec.pasos.map(() => 0) : rengSec.pasos.map((rengP) => rengP.duracion)), [rengSec])

  const rengEstado = useRef<RengEstadoSecuencia>(rengEstadoInicial())
  const [rengVista, rengSetVista] = useState<RengVista>({ paso: 0, t: 0, reproduciendo: false, s: 0 })
  const [rengResaltado, rengSetResaltado] = useState<string | null>(null)

  const rengPublicar = useCallback(
    (rengE: RengEstadoSecuencia) => {
      rengEstado.current = rengE
      const rengS = rengPosicion(rengE)
      rengEscena.aplicar(rengS)
      rengSetVista((rengV) => (rengV.paso === rengE.paso && rengV.reproduciendo === rengE.reproduciendo && Math.abs(rengV.s - rengS) < 0.004 ? rengV : { paso: rengE.paso, t: rengE.t, reproduciendo: rengE.reproduciendo, s: rengS }))
    },
    [rengEscena]
  )

  useEffect(() => {
    rengPublicar(rengIrA(rengEstadoInicial(), 0, rengTotal))
  }, [rengEscena, rengTotal, rengPublicar])

  useEffect(() => rengResaltarElemento(rengEscena.grupo, rengResaltado, rengPaleta.acento), [rengEscena, rengResaltado, rengPaleta])

  const rengOnFrame = useCallback(
    (rengDt: number) => {
      const rengE = rengEstado.current
      if (!rengE.reproduciendo) return
      rengPublicar(rengAvanzar(rengE, rengDt, rengDuraciones))
    },
    [rengDuraciones, rengPublicar]
  )

  const rengAccion = useCallback((rengF: (rengE: RengEstadoSecuencia, rengN: number) => RengEstadoSecuencia) => rengPublicar(rengF(rengEstado.current, rengTotal)), [rengPublicar, rengTotal])

  const rengActivo = useRengActivo()
  useEffect(() => {
    if (!rengAtajos || !rengActivo) return
    const rengTecla = (rengEv: KeyboardEvent): void => {
      if (rengEv.ctrlKey || rengEv.metaKey || rengEv.altKey || rengEsCampoDeTexto(rengEv.target)) return
      const rengEnBoton = (rengEv.target as HTMLElement | null)?.closest?.('button, summary, a')
      if (rengEv.key === ' ' && !rengEnBoton) rengAccion(rengAlternar)
      else if (rengEv.key === 'ArrowRight') rengAccion(rengSiguiente)
      else if (rengEv.key === 'ArrowLeft') rengAccion(rengAnterior)
      else return
      rengEv.preventDefault()
    }
    window.addEventListener('keydown', rengTecla)
    return () => window.removeEventListener('keydown', rengTecla)
  }, [rengAccion, rengAtajos, rengActivo])

  const rengPaso = rengSec.pasos[Math.min(rengVista.paso, rengTotal - 1)]!
  const rengDiatomica = rengSec.tipo === 'covalente' || rengSec.tipo === 'multiple' ? rengSec.diatomica : null
  const rengMorse = rengDiatomica ? rengParametrosMorse(RENG_DIATOMICAS[rengDiatomica]!) : null
  const rengVerCurva = rengMorse && rengEscena.curva && rengVista.paso >= rengEscena.curva.desdePaso

  return (
    <RengTresZonas
      lienzo={
        <RengLienzo3D
          modelo={rengEscena.grupo}
          distancia={rengEscena.distancia}
          onFrame={rengOnFrame}
          onHoverElemento={rengSetResaltado}
          etiqueta={`Animación del enlace en ${rengSec.formula}, paso ${rengVista.paso + 1}: ${rengPaso.titulo}`}
        />
      }
      barra={
        <>
          <div className="barra-notacion">
            <div className="row" style={{ gap: 18 }}>
              {rengPaso.notaciones.length ? (
                rengPaso.notaciones.map((rengN) => <RengFormula key={rengN} texto={rengN} tamano="media" resaltado={rengResaltado} onElemento={rengSetResaltado} />)
              ) : (
                <RengFormula texto={rengSec.formula} tamano="media" resaltado={rengResaltado} onElemento={rengSetResaltado} />
              )}
            </div>
            {rengPaso.nota && <span className="sm muted mono">{rengPaso.nota}</span>}
          </div>
          <RengControlesPaso
            paso={rengVista.paso}
            t={rengVista.t}
            titulos={rengSec.pasos.map((rengP) => rengP.titulo)}
            reproduciendo={rengVista.reproduciendo}
            onAnterior={() => rengAccion(rengAnterior)}
            onAlternar={() => rengAccion(rengAlternar)}
            onSiguiente={() => rengAccion(rengSiguiente)}
            onIr={(rengI) => rengAccion((rengE, rengN) => rengIrA(rengE, rengI, rengN))}
          />
        </>
      }
      panel={
        <>
          {rengSelector}
          <RengPanelExplicacion
            titular={`${rengVista.paso + 1}. ${rengPaso.titulo}`}
            parrafo={rengPaso.texto}
            saberMas={
              <>
                {rengSec.saberMas.map((rengT) => (
                  <p key={rengT}>{rengT}</p>
                ))}
                <p className="faint">Fuentes: {[...new Set(rengSec.fuentes)].join(' · ')}.</p>
              </>
            }
          >
            {rengVerCurva && rengMorse && (
              <RengCurvaEnergia p={rengMorse} r={rengEscena.curva!.r(rengVista.s)} titulo={`Energía de ${rengBonita(rengSec.formula)} según la distancia`} />
            )}
            {rengSec.tipo === 'intermolecular' && rengVista.paso === rengTotal - 1 && <RengEscalaEnergias />}
            {rengMuestra('enlaces.datosPaso') && rengPaso.avanzado && (
              <RengVerMas titulo="Datos del paso" abierto>
                <dl className="datos">
                  {rengPaso.avanzado.map(([rengK, rengV]) => (
                    <div key={rengK}>
                      <dt>{rengK}</dt>
                      <dd>{rengV}</dd>
                    </div>
                  ))}
                </dl>
              </RengVerMas>
            )}
          </RengPanelExplicacion>
        </>
      }
    />
  )
}
