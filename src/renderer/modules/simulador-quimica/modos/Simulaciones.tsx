import { useMemo, useRef, useState } from 'react'
import { RENG_MINIATURA_ESCENA } from '../practica/fichasTema'
import { RENG_MODELOS_ESCENA, rengValidarEntradasSim, type RengEntradasSim, type RengEscena } from '../practica/modelosSimulacion'
import { RENG_EXPERIMENTOS_QUIMICA, type RengSubExperimento } from '../navegacion'
import { RengTarjetaTema } from '../vista/TarjetaTema'
import { RengAviso } from '../vista/ui'
import { RengMezclaAcidoBase } from './MezclaAcidoBase'
import RengMesaLibre from './MesaLibre'
import RengEscenaAcidoBase from './simulacion/EscenaAcidoBase'
import RengEscenaCinetica from './simulacion/EscenaCinetica'
import RengEscenaColorimetria from './simulacion/EscenaColorimetria'
import RengEscenaDilucion from './simulacion/EscenaDilucion'
import RengEscenaEnergia from './simulacion/EscenaEnergia'
import { RengPanelModelo } from './simulacion/comunes'
import RengEscenaElectroquimica from './simulacion/EscenaElectroquimica'
import RengEscenaEquilibrio from './simulacion/EscenaEquilibrio'
import RengEscenaIsomeros from './simulacion/EscenaIsomeros'
import RengEscenaSolubilidad from './simulacion/EscenaSolubilidad'
import './simulaciones.css'

type RengSub = RengSubExperimento

const RENG_MESA_LIBRE = { nombre: 'Mesa libre', pregunta: '¿Qué pasa si combino estas sustancias? Solo se predice lo que ya tiene un modelo validado.' } as const

export const RENG_SUBS_EXPERIMENTOS: ReadonlyArray<{ id: RengEscena; nombre: string; sub: string; guia: string }> = [
  { id: 'acidobase', nombre: 'Ácidos y bases', sub: 'pH y valoración', guia: 'Elige un ácido y su concentración. Pulsa «Calcular» para ver el pH de la disolución y cómo cambia la curva de valoración con NaOH.' },
  { id: 'mezcla', nombre: 'Mezcla ácido–base', sub: 'pH y especies al mezclar', guia: 'Elige un ácido y los volúmenes de ácido y base. Pulsa «Calcular» para consultar el pH y las especies disueltas en «Equilibrio de la mezcla».' },
  { id: 'cinetica', nombre: 'Velocidad', sub: 'Cinética y temperatura', guia: 'Cambia el orden de reacción o la constante k y pulsa «Iniciar»: compara la curva de concentración y el tiempo que tarda en caer a la mitad.' },
  { id: 'equilibrio', nombre: 'Equilibrio', sub: 'Le Chatelier', guia: 'Elige una reacción y una sustancia que añadir o quitar. Pulsa «Calcular» y compara las barras del equilibrio inicial y del nuevo.' },
  { id: 'termo', nombre: 'Energía', sub: 'Calor y espontaneidad', guia: 'Elige una reacción y los moles que reaccionan. Pulsa «Calcular» para ver cuánto calor libera o absorbe y si ocurre sola a esa temperatura.' },
  { id: 'dilucion', nombre: 'Dilución', sub: 'Alícuota y matraz aforado', guia: 'Elige la disolución, mide una alícuota, transfiérela y completa hasta el aforo. Si quieres, antes de ver el resultado predice qué pasa con los moles de soluto y con la concentración.' },
  { id: 'colorimetria', nombre: 'Colorimetría', sub: 'Curva de calibración', guia: 'Introduce el blanco, los patrones y la absorbancia de la muestra. Pulsa «Calcular» (si quieres, antes predice dónde cae la muestra): la concentración solo se obtiene si la muestra cae dentro de la curva (interpolar, nunca extrapolar).' },
  { id: 'solubilidad', nombre: 'Solubilidad', sub: 'Q frente a Ksp', guia: 'Elige una sal poco soluble y las concentraciones de sus iones. Pulsa «Calcular» (si quieres, antes predice si precipita): verás Q frente a Ksp, cuánto precipita o se disuelve y el efecto de un ion común. Solo hay sales con fuente de Ksp abierta.' },
  { id: 'electroquimica', nombre: 'Electroquímica', sub: 'Celda galvánica', guia: 'Elige dos semiceldas y las concentraciones de sus iones. Pulsa «Calcular» (si quieres, antes predice si la reacción es espontánea y hacia dónde van los electrones): verás el ánodo y el cátodo reales, E°, ΔG°, K y el potencial por Nernst. Solo hay pares con fuente de potencial abierta.' },
  { id: 'isomeros', nombre: 'Isómeros', sub: 'Comparación geométrica', guia: 'Elige una pareja de isómeros y, en cada uno, de 2 a 4 átomos (en el modelo 3D o en la lista). Pulsa «Calcular» (si quieres, antes predice qué isómero tiene la distancia mayor): verás distancia, ángulos y diedro de cada uno, con la procedencia de su geometría. Las geometrías son calculadas, no medidas.' }
]

export interface RengTransferenciaActiva {
  n: number
  escena: RengEscena
  entradas: RengEntradasSim
}

interface RengProps {
  escena: RengSub | null
  onEscena: (rengE: RengSub | null) => void
  transferencia: RengTransferenciaActiva | null
}

const RENG_ORDEN = RENG_EXPERIMENTOS_QUIMICA

export default function RengSimulaciones({ escena: rengEscena, onEscena: rengOnEscena, transferencia: rengTransferencia }: RengProps): React.JSX.Element {
  const rengPanelModelo = useRef<HTMLDivElement>(null)
  const [rengVisitados, rengSetVisitados] = useState<ReadonlySet<RengSub>>(new Set())
  if (rengEscena && !rengVisitados.has(rengEscena)) rengSetVisitados(new Set([...rengVisitados, rengEscena]))
  const rengEscenaMarco: RengEscena | null = rengEscena === 'mesalibre' ? null : rengEscena
  const rengValidacion = useMemo(() => (rengTransferencia ? { n: rengTransferencia.n, escena: rengTransferencia.escena, v: rengValidarEntradasSim(rengTransferencia.escena, rengTransferencia.entradas) } : null), [rengTransferencia])
  const rengInicialDe = (rengId: RengEscena): { n: number; entradas: RengEntradasSim } | null => (rengValidacion && rengTransferencia && rengValidacion.escena === rengId && rengValidacion.v.ok ? { n: rengValidacion.n, entradas: rengValidacion.v.entradas } : null)
  const rengAvisosTransferencia = rengValidacion && rengValidacion.v.ok && rengEscenaMarco === rengValidacion.escena ? rengValidacion.v.avisos : []
  const rengInfo = rengEscenaMarco ? RENG_SUBS_EXPERIMENTOS.find((rengS) => rengS.id === rengEscenaMarco) : null
  const rengModelo = rengEscenaMarco ? RENG_MODELOS_ESCENA[rengEscenaMarco] : null

  const rengPanel = (rengId: RengEscena, rengContenido: React.JSX.Element): React.JSX.Element => (
    <div id={`experimento-panel-${rengId}`} hidden={rengEscena !== rengId} role="region" aria-label={RENG_MODELOS_ESCENA[rengId].nombre}>
      {rengVisitados.has(rengId) || rengEscena === rengId ? rengContenido : null}
    </div>
  )


  const rengAbrirModelo = (): void => {
    const rengDetalle = rengPanelModelo.current?.querySelector('details')
    if (!rengDetalle) return
    rengDetalle.open = true
    rengDetalle.scrollIntoView({ block: 'nearest' })
    rengDetalle.querySelector('summary')?.focus()
  }

  return (
    <div className="sim-fq">
      {rengEscena === null && (
        <div className="q-sim-catalogo">
          <header className="q-cabecera">
            <h2>Elige un fenómeno</h2>
            <p className="muted sm">Los que evolucionan en el tiempo se abren en pausa, en t = 0; los de estado final se calculan con «Calcular».</p>
          </header>
          <ul className="q-rejilla">
            {RENG_ORDEN.map((rengId) => {
              if (rengId === 'mesalibre')
                return (
                  <li key={rengId}>
                    <RengTarjetaTema id={rengId} nombre={RENG_MESA_LIBRE.nombre} pregunta={RENG_MESA_LIBRE.pregunta} rama="analitica" miniatura="dilucion" etiquetaAbrir={`Abrir ${RENG_MESA_LIBRE.nombre}`} onAbrir={() => rengOnEscena(rengId)}>
                      <span className="q-tarjeta-meta">Solo lo que tiene modelo</span>
                    </RengTarjetaTema>
                  </li>
                )
              const rengM = RENG_MODELOS_ESCENA[rengId]
              return (
                <li key={rengId}>
                  <RengTarjetaTema id={rengId} nombre={rengM.nombre} pregunta={rengM.pregunta} rama={RENG_MINIATURA_ESCENA[rengId].rama} miniatura={RENG_MINIATURA_ESCENA[rengId].miniatura} etiquetaAbrir={`Abrir ${rengM.nombre}`} onAbrir={() => rengOnEscena(rengId)}>
                    <span className="q-tarjeta-meta">{rengM.tipo === 'evolucion-temporal' ? 'Evoluciona en el tiempo' : 'Resultado final'}</span>
                  </RengTarjetaTema>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {rengEscenaMarco !== null && rengInfo && rengModelo && (
        <>
          <header className="q-barra">
            <button type="button" className="btn sm" onClick={() => rengOnEscena(null)}>
              ← Volver a fenómenos
            </button>
            <div className="q-barra-titulo">
              <h2>{rengModelo.nombre}</h2>
              <span className="faint sm">{rengModelo.fenomeno}</span>
            </div>
            <div className="row q-barra-acciones">
              <button type="button" className="btn sm" onClick={rengAbrirModelo}>
                Modelo y supuestos
              </button>
            </div>
          </header>
          <div className="q-guia">
            <p className="sm muted">
              <strong>Prueba esto:</strong> {rengInfo.guia}
            </p>
            {rengAvisosTransferencia.map((rengA) => (
              <RengAviso key={rengA} tipo="aviso">
                {rengA}
              </RengAviso>
            ))}
          </div>
        </>
      )}
      {rengPanel('acidobase', <RengEscenaAcidoBase inicial={rengInicialDe('acidobase')} />)}
      {rengPanel('mezcla', <RengMezclaAcidoBase inicial={rengInicialDe('mezcla')} />)}
      {rengPanel('cinetica', <RengEscenaCinetica inicial={rengInicialDe('cinetica')} />)}
      {rengPanel('equilibrio', <RengEscenaEquilibrio inicial={rengInicialDe('equilibrio')} />)}
      {rengPanel('termo', <RengEscenaEnergia inicial={rengInicialDe('termo')} />)}
      {rengPanel('dilucion', <RengEscenaDilucion inicial={rengInicialDe('dilucion')} />)}
      {rengPanel('colorimetria', <RengEscenaColorimetria inicial={rengInicialDe('colorimetria')} />)}
      {rengPanel('solubilidad', <RengEscenaSolubilidad inicial={rengInicialDe('solubilidad')} />)}
      {rengPanel('electroquimica', <RengEscenaElectroquimica inicial={rengInicialDe('electroquimica')} />)}
      {rengPanel('isomeros', <RengEscenaIsomeros inicial={rengInicialDe('isomeros')} />)}
      <div id="experimento-panel-mesalibre" hidden={rengEscena !== 'mesalibre'} role="region" aria-label={RENG_MESA_LIBRE.nombre}>
        {rengVisitados.has('mesalibre') || rengEscena === 'mesalibre' ? <RengMesaLibre onVolver={() => rengOnEscena(null)} onAbrirEscena={(rengE) => rengOnEscena(rengE)} /> : null}
      </div>
      <div ref={rengPanelModelo} className="q-modelo-panel">
        {rengEscenaMarco !== null && <RengPanelModelo escena={rengEscenaMarco} />}
      </div>
    </div>
  )
}
