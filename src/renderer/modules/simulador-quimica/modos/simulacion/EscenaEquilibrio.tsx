import { useEffect, useMemo } from 'react'
import { rengCociente, rengDescribirDesplazamiento, rengFaltaEquilibrio, rengResolverEquilibrio } from '../../nucleo/equilibrio'
import { RENG_PRESETS_EQ, rengDesplazamientoEquilibrio, rengEspeciesDe, rengValidarEntradasSim } from '../../practica/modelosSimulacion'
import { rengCompararQK, rengEntradasLegibles } from '../../practica/reglasEscena'
import { useRengMuestra } from '../../vista/nivel'
import { RengAviso, RengTarjeta } from '../../vista/ui'
import { RengAvisoReabierta, RengBotonCalcular, RengComparaCasos, RengDiagnosticos, RengFormulario, RengGuardarEscena, RengNaturaleza, RengNum, RengNumModelo, RengResultado, RengSalida, RengSensibilidadPanel, rengAdvertenciaPendiente, rengFmt, rengFmtDistinguible, useRengCalculo, useRengReapertura, type RengInicialEscena } from './comunes'

interface RengEstadoEq {
  reaccion: string
  K: number
  c0: number[]
  quien: number
  delta: number
}

const rengPreset = (rengId: string) => RENG_PRESETS_EQ.find((rengP) => rengP.id === rengId) ?? RENG_PRESETS_EQ[0]!
const rengPorDefecto = (rengId: string): RengEstadoEq => ({ reaccion: rengId, K: rengPreset(rengId).K, c0: rengPreset(rengId).esp.map((rengE) => rengE.c0), quien: 0, delta: 0.5 })

const rengDesde = (rengE: Readonly<Record<string, number | string>>): RengEstadoEq => {
  const rengP = rengPreset(String(rengE['reaccion'] ?? 'hi'))
  return { reaccion: rengP.id, K: Number(rengE['K'] ?? rengP.K), c0: rengP.esp.map((rengS, rengI) => Number(rengE[`c0_${rengI}`] ?? rengS.c0)), quien: Number(rengE['quien'] ?? 0), delta: Number(rengE['delta'] ?? 0.5) }
}

const rengEntradas = (rengE: RengEstadoEq): Record<string, number | string> => ({ reaccion: rengE.reaccion, K: rengE.K, ...Object.fromEntries(rengE.c0.map((rengC, rengI) => [`c0_${rengI}`, rengC])), quien: rengE.quien, delta: rengE.delta })

const RENG_TEXTO_SENTIDO = { equilibrio: 'ya está en equilibrio', productos: 'hacia los productos (Q < K)', reactivos: 'hacia los reactivos (Q > K)', indeterminado: 'no se puede concluir' } as const

export default function RengEscenaEquilibrio({ inicial: rengInicial }: { inicial?: RengInicialEscena | null }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const { borrador: rengB, aplicado: rengA, sucio: rengSucio, cambiar: rengCambiar, calcular: rengCalcular, reemplazar: rengReemplazar } = useRengCalculo<RengEstadoEq>(rengPorDefecto('hi'), rengInicial, rengDesde)
  const [rengReabierta, rengOlvidar] = useRengReapertura('equilibrio', (rengE) => rengReemplazar(rengDesde(rengE), true))
  useEffect(() => {
    if (rengInicial) rengOlvidar()
  }, [rengInicial?.n])
  const rengPresetB = rengPreset(rengB.reaccion)
  const rengEntradasAplicadas = useMemo(() => (rengA ? rengEntradas(rengA) : null), [rengA])
  const rengValidacion = useMemo(() => (rengEntradasAplicadas ? rengValidarEntradasSim('equilibrio', rengEntradasAplicadas) : null), [rengEntradasAplicadas])
  const rengCalculo = useMemo(() => {
    if (!rengA || !rengValidacion || !rengValidacion.ok) return null
    const rengEsp = rengEspeciesDe(rengValidacion.entradas)!
    const rengQ0 = rengCociente(rengEsp, rengEsp.map((rengS) => rengS.c0))
    const rengInicialEq = rengResolverEquilibrio(rengEsp, rengA.K)
    const rengFalta = rengFaltaEquilibrio(rengEsp)
    const rengMaxQuitar = rengInicialEq.c[rengA.quien]!
    if (rengA.delta < 0 && -rengA.delta > rengMaxQuitar) return { esp: rengEsp, Q0: rengQ0, inicial: rengInicialEq, falta: rengFalta, perturbacion: null, errorPerturbacion: `No se puede quitar ${rengFmt(-rengA.delta)} mol/L de ${rengEsp[rengA.quien]!.nombre}: en el equilibrio inicial solo hay ${rengFmt(rengMaxQuitar)} mol/L. Quita como máximo esa cantidad.` }
    try {
      return { esp: rengEsp, Q0: rengQ0, inicial: rengInicialEq, falta: rengFalta, perturbacion: rengDesplazamientoEquilibrio(rengValidacion.entradas, rengA.quien, rengA.delta), errorPerturbacion: null }
    } catch (rengE) {
      return { esp: rengEsp, Q0: rengQ0, inicial: rengInicialEq, falta: rengFalta, perturbacion: null, errorPerturbacion: (rengE as Error).message }
    }
  }, [rengA, rengValidacion])
  const rengBarras = (rengC: number[]): string => rengC.map((rengX) => rengFmt(rengX)).join(' · ')
  const rengResumen = rengEntradasAplicadas ? rengEntradasLegibles('equilibrio', rengEntradasAplicadas) : null
  const rengVeredicto = rengCalculo ? rengCompararQK(rengCalculo.Q0, rengA!.K) : null
  const [rengQTxt, rengKTxt] = rengCalculo ? rengFmtDistinguible(rengCalculo.Q0, rengA!.K) : ['', '']

  return (
    <div className="q-escena">
      <RengFormulario>
        <RengTarjeta titulo="Datos de entrada" nota="Todo en una fase, volumen constante">
          <label className="sim-campo">
            <span>Reacción</span>
            <select className="input" value={rengB.reaccion} onChange={(rengE) => rengReemplazar(rengPorDefecto(rengE.target.value), false)}>
              {RENG_PRESETS_EQ.map((rengP) => (
                <option key={rengP.id} value={rengP.id}>
                  {rengP.nombre}
                </option>
              ))}
            </select>
          </label>
          <RengNumModelo escena="equilibrio" clave="K" valor={rengB.K} onChange={(rengV) => rengCambiar({ K: rengV })} />
          <div className="sim-fila">
            {rengPresetB.esp.map((rengE, rengI) => (
              <RengNumModelo key={rengE.nombre} escena="equilibrio" clave={`c0_${rengI}`} etiqueta={`${rengE.nombre} inicial`} valor={rengB.c0[rengI]!} onChange={(rengV) => rengCambiar({ c0: rengB.c0.map((rengX, rengJ) => (rengJ === rengI ? rengV : rengX)) })} />
            ))}
          </div>
          <details className="panel-seccion">
            <summary>Perturbación (Le Chatelier)</summary>
            <div className="sim-fila">
              <label className="sim-campo">
                <span>Añadir (o quitar) de</span>
                <select className="input" value={rengB.quien} onChange={(rengE) => rengCambiar({ quien: Number(rengE.target.value) })}>
                  {rengPresetB.esp.map((rengE, rengI) => (
                    <option key={rengE.nombre} value={rengI}>
                      {rengE.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <RengNum etiqueta="Cantidad (negativa = quitar)" valor={rengB.delta} onChange={(rengV) => rengCambiar({ delta: rengV })} unidad="mol/L" />
            </div>
          </details>
          <RengAviso tipo="aviso">
            {rengPresetB.nota} <RengNaturaleza tipo="ejemplo" />
          </RengAviso>
          <RengBotonCalcular aplicado={rengA !== null} sucio={rengSucio} onCalcular={rengCalcular} />
        </RengTarjeta>
      </RengFormulario>
      <RengSalida sucio={rengSucio} resumen={rengResumen}>
        <RengAvisoReabierta reabierta={rengReabierta} />
        {!rengA ? (
          <RengAviso tipo="info">Elige la reacción, la K y las concentraciones iniciales y pulsa «Calcular»: verás hacia dónde evoluciona (Q frente a K) y cómo responde a una perturbación.</RengAviso>
        ) : rengValidacion && !rengValidacion.ok ? (
          <RengAviso tipo="aviso">
            <b>No se puede concluir.</b> {rengValidacion.diagnostico}
          </RengAviso>
        ) : rengCalculo ? (
          <>
            <RengTarjeta titulo="Estado inicial: Q frente a K" acento>
              <RengNaturaleza tipo="calculo" />
              <RengResultado etiqueta="Q inicial" valor={rengQTxt} />
              <RengResultado etiqueta="K" valor={rengKTxt} />
              <RengResultado etiqueta="Evolución hacia el equilibrio" valor={RENG_TEXTO_SENTIDO[rengVeredicto!]} />
              <RengResultado etiqueta="Concentraciones de equilibrio" valor={rengBarras(rengCalculo.inicial.c)} />
              {rengCalculo.falta.codigo !== 'ninguna' && <RengAviso tipo="info">{rengCalculo.falta.texto}</RengAviso>}
            </RengTarjeta>
            <RengTarjeta titulo="Perturba el equilibrio" nota="Principio de Le Chatelier, calculado con Q = K">
              {rengCalculo.errorPerturbacion !== null || rengCalculo.perturbacion === null ? (
                <RengAviso tipo="aviso">
                  <b>No se calculó la perturbación.</b> {rengCalculo.errorPerturbacion} Las concentraciones de arriba siguen siendo válidas; cambia la cantidad en «Perturbación (Le Chatelier)» y pulsa «Actualizar».
                </RengAviso>
              ) : (
                <>
                  <div className="sim-barras" role="img" aria-label={`Concentraciones antes: ${rengBarras(rengCalculo.perturbacion.antes)}; después: ${rengBarras(rengCalculo.perturbacion.despues)}`}>
                    {rengPreset(rengA.reaccion).esp.map((rengE, rengI) => {
                      const rengMax = Math.max(...rengCalculo.perturbacion!.antes, ...rengCalculo.perturbacion!.despues, 1e-12) * 1.1 + Math.max(0, rengA.delta)
                      return (
                        <div key={rengE.nombre} className="sim-barra-grupo">
                          <div className="sim-barra-par">
                            <i className="antes" style={{ height: `${(100 * rengCalculo.perturbacion!.antes[rengI]!) / rengMax}%` }} title={`antes ${rengFmt(rengCalculo.perturbacion!.antes[rengI]!)}`} />
                            <i className="despues" style={{ height: `${(100 * rengCalculo.perturbacion!.despues[rengI]!) / rengMax}%` }} title={`después ${rengFmt(rengCalculo.perturbacion!.despues[rengI]!)}`} />
                          </div>
                          <small>{rengE.nombre}</small>
                        </div>
                      )
                    })}
                  </div>
                  <p className="sim-leyenda">
                    <i className="antes" /> equilibrio inicial <i className="despues" /> nuevo equilibrio · barras de valores calculados, no un esquema de partículas
                  </p>
                  <RengResultado etiqueta="Desplazamiento" valor={rengDescribirDesplazamiento(rengCalculo.perturbacion.completo.despues, rengA.K, rengFmt).resultado} />
                  {rengMuestra('simulaciones.formulas') && <p className="sim-formulas">K no cambia con las concentraciones; solo con la temperatura. Nuevo equilibrio: {rengBarras(rengCalculo.perturbacion.despues)}.</p>}
                </>
              )}
            </RengTarjeta>
            <RengDiagnosticos escena="equilibrio" entradas={rengEntradasAplicadas} />
            <RengComparaCasos escena="equilibrio" entradas={rengEntradasAplicadas} />
            <RengSensibilidadPanel escena="equilibrio" entradas={rengEntradasAplicadas} />
            <RengGuardarEscena escena="equilibrio" entradas={rengEntradasAplicadas} nombre={`Equilibrio: ${rengPreset(rengA.reaccion).nombre}`} anterior={rengReabierta?.id ?? null} advertencia={rengAdvertenciaPendiente(rengSucio, rengResumen)} />
          </>
        ) : null}
      </RengSalida>
    </div>
  )
}
