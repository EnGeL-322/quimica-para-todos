import { useEffect, useMemo, useState } from 'react'
import { RENG_PAREJAS_ISO, rengCargarPareja, rengParejaRegistrada } from '../../datos/isomeros'
import { RENG_MAX_SELECCION_ISO, RENG_UMBRAL_DISTANCIA_IGUAL, rengEtiquetasSeleccion, type RengGeometriaIsomero } from '../../nucleo/isomeros'
import { rengCompararIsomerosEntradas, rengEntradasIsoPorDefecto, rengLeerSeleccionIso, rengValidarEntradasSim } from '../../practica/modelosSimulacion'
import { rengNivelPermite } from '../../practica/niveles'
import { rengEntradasLegibles } from '../../practica/reglasEscena'
import { useRengNivelPractica } from '../../vista/nivel'
import { RengAviso, RengTarjeta } from '../../vista/ui'
import { RengVisorIsomero } from '../../vista/VisorIsomero'
import { RengAvisoReabierta, RengBotonCalcular, RengDiagnosticos, RengFormulario, RengGuardarEscena, RengNaturaleza, RengSalida, rengAdvertenciaPendiente, useRengCalculo, useRengReapertura, type RengInicialEscena } from './comunes'

interface RengEstadoIso {
  pareja: string
  selA: number[]
  selB: number[]
}

type RengPrediccionIso = '' | 'a' | 'b' | 'igual'

const RENG_POR_DEFECTO_ISO = (): RengEstadoIso => {
  const rengE = rengEntradasIsoPorDefecto('buteno')
  const rengS = rengLeerSeleccionIso(rengE)
  return { pareja: 'buteno', selA: rengS.a, selB: rengS.b }
}

const rengDesde = (rengE: Readonly<Record<string, number | string>>): RengEstadoIso => {
  const rengPareja = RENG_PAREJAS_ISO.some((rengP) => rengP.id === rengE['pareja']) ? String(rengE['pareja']) : 'buteno'
  try {
    const rengS = rengLeerSeleccionIso(rengE)
    return { pareja: rengPareja, selA: rengS.a, selB: rengS.b }
  } catch {
    const rengS = rengLeerSeleccionIso(rengEntradasIsoPorDefecto(rengPareja))
    return { pareja: rengPareja, selA: rengS.a, selB: rengS.b }
  }
}

const rengPlano = (rengS: RengEstadoIso): Record<string, number | string> => {
  const rengSal: Record<string, number | string> = { pareja: rengS.pareja }
  rengS.selA.forEach((rengI, rengK) => (rengSal[`atA${rengK + 1}`] = rengI))
  rengS.selB.forEach((rengI, rengK) => (rengSal[`atB${rengK + 1}`] = rengI))
  return rengSal
}

const rengDec = (rengV: number, rengD: number): string => {
  const rengT = rengV.toFixed(rengD)
  return (Number(rengT) === 0 ? (0).toFixed(rengD) : rengT).replace('.', ',').replace('-', '−')
}

const rengGrados = (rengV: number, rengD: number): string => (Math.abs(Math.abs(rengV) - 180) < 0.5 * 10 ** -rengD ? (180).toFixed(rengD).replace('.', ',') : rengDec(rengV, rengD))

const rengCoord = (rengG: RengGeometriaIsomero, rengI: number): string => {
  const [rengX, rengY, rengZ] = rengG.atomos[rengI]!.p
  return `(${rengDec(rengX, 3)}; ${rengDec(rengY, 3)}; ${rengDec(rengZ, 3)})`
}

export default function RengEscenaIsomeros({ inicial: rengInicial }: { inicial?: RengInicialEscena | null }): React.JSX.Element {
  const rengNivel = useRengNivelPractica()
  const rengUniversitario = rengNivelPermite(rengNivel, 'universitario')
  const rengQuimico = rengNivelPermite(rengNivel, 'quimico')
  const rengCientifico = rengNivelPermite(rengNivel, 'cientifico')
  const { borrador: rengB, aplicado: rengA, sucio: rengSucio, cambiar: rengCambiar, calcular: rengCalcular, reemplazar: rengReemplazar } = useRengCalculo<RengEstadoIso>(RENG_POR_DEFECTO_ISO(), rengInicial, rengDesde)
  const [rengPred, rengSetPred] = useState<RengPrediccionIso>('')
  const [rengPredHecha, rengSetPredHecha] = useState<{ pred: RengPrediccionIso; clave: string } | null>(null)
  const [rengQuierePredecir, rengSetQuierePredecir] = useState(false)
  const [rengReabierta, rengOlvidar] = useRengReapertura('isomeros', (rengE) => {
    rengReemplazar(rengDesde(rengE), true)
    rengSetPredHecha(null)
  })
  useEffect(() => {
    if (rengInicial) {
      rengOlvidar()
      rengSetPredHecha(null)
    }
  }, [rengInicial?.n])

  const rengCarga = useMemo(() => rengCargarPareja(rengB.pareja), [rengB.pareja])
  const rengPar = rengParejaRegistrada(rengB.pareja)
  const rengEntradasAplicadas = useMemo(() => (rengA ? rengPlano(rengA) : null), [rengA])
  const rengValidacion = useMemo(() => (rengEntradasAplicadas ? rengValidarEntradasSim('isomeros', rengEntradasAplicadas) : null), [rengEntradasAplicadas])
  const rengCmp = useMemo(() => (rengEntradasAplicadas && rengValidacion?.ok ? rengCompararIsomerosEntradas(rengEntradasAplicadas) : null), [rengEntradasAplicadas, rengValidacion])
  const rengResumen = rengEntradasAplicadas ? rengEntradasLegibles('isomeros', rengEntradasAplicadas) : null
  const rengPuedePredecir = rengB.selA.length >= 2 && rengB.selA.length === rengB.selB.length
  const rengFaltaPrediccion = rengA === null && rengPuedePredecir && rengQuierePredecir && rengPred === ''
  const rengMedidasBorrador = rengB.selA.length
  const rengSeleccionLista = rengB.selA.length >= 2 && rengB.selB.length >= 2

  const rengFilas = rengCmp
    ? [
        { clave: 'distancia', nombre: 'Distancia entre el primer y el último átomo', unidad: 'Å', dec: 3, a: rengCmp.comparacion.a.distancia, b: rengCmp.comparacion.b.distancia, dif: rengCmp.comparacion.diferencias.distancia },
        { clave: 'angulo1', nombre: 'Ángulo en el segundo átomo', unidad: '°', dec: 1, a: rengCmp.comparacion.a.angulo1, b: rengCmp.comparacion.b.angulo1, dif: rengCmp.comparacion.diferencias.angulo1 },
        { clave: 'angulo2', nombre: 'Ángulo en el tercer átomo', unidad: '°', dec: 1, a: rengCmp.comparacion.a.angulo2, b: rengCmp.comparacion.b.angulo2, dif: rengCmp.comparacion.diferencias.angulo2 },
        { clave: 'diedro', nombre: 'Diedro de los cuatro átomos', unidad: '°', dec: 1, a: rengCmp.comparacion.a.diedro, b: rengCmp.comparacion.b.diedro, dif: rengCmp.comparacion.diferencias.diedro }
      ].filter((rengF) => (rengF.a !== null || rengF.b !== null) && rengCmp.comparacion.a.n >= 2 && rengCmp.comparacion.b.n >= 2)
    : []
  const rengMayor = rengCmp?.comparacion.mayorDistancia ?? null
  const rengPredVigente = rengPredHecha !== null && rengPredHecha.pred !== '' && rengPredHecha.clave === JSON.stringify(rengEntradasAplicadas) ? rengPredHecha.pred : null
  const rengTextoMayor = (rengM: 'a' | 'b' | 'igual'): string => (rengM === 'a' ? `el isómero A (${rengPar.a.nombre})` : rengM === 'b' ? `el isómero B (${rengPar.b.nombre})` : `ninguno: casi la misma (menos de ${String(RENG_UMBRAL_DISTANCIA_IGUAL).replace('.', ',')} Å)`)

  return (
    <div className="q-escena">
      <RengFormulario>
        <RengTarjeta titulo="Dos isómeros" nota="Misma fórmula, distinta estructura">
          <RengAviso tipo="info">
            Las geometrías son <b>calculadas</b> (MMFF94s), no medidas. <RengNaturaleza tipo="calculo" /> Solo hay pares de isómeros inocuos que salen de los bancos de la app.
          </RengAviso>
          <label className="sim-campo">
            <span>Pareja de isómeros</span>
            <select
              className="input"
              value={rengB.pareja}
              onChange={(rengEv) => {
                const rengS = rengLeerSeleccionIso(rengEntradasIsoPorDefecto(rengEv.target.value))
                rengCambiar({ pareja: rengEv.target.value, selA: rengS.a, selB: rengS.b })
                rengSetPred('')
              }}
            >
              {RENG_PAREJAS_ISO.map((rengP) => (
                <option key={rengP.id} value={rengP.id}>
                  {rengP.titulo} ({rengP.formula})
                </option>
              ))}
            </select>
          </label>
          <p className="sm" data-pista="">
            <b>Isomería {rengPar.tipo}.</b> {rengPar.pista}
          </p>
          <p className="faint sm">
            Elige de 2 a {RENG_MAX_SELECCION_ISO} átomos en cada isómero, en orden, en el modelo 3D o en su lista. Con 2 se mide una distancia; con 3, además un ángulo; con 4, un segundo ángulo y un diedro. Una distancia solo se compara si eliges el mismo número de átomos en los dos.
          </p>
          {!rengSeleccionLista && <RengAviso tipo="aviso">Elige al menos 2 átomos en cada isómero para poder medir.</RengAviso>}
          {rengA === null && rengPuedePredecir && (
            <>
            <label className="q-opcion" data-prediccion-opcional="">
              <input type="checkbox" checked={rengQuierePredecir} onChange={(rengEv) => rengSetQuierePredecir(rengEv.target.checked)} />
              <span>Quiero predecir antes de calcular (opcional)</span>
            </label>
            {rengQuierePredecir && (
              <fieldset className="q-prediccion" data-prediccion="">
                <legend>Antes de calcular, ¿qué crees que pasará?</legend>
                <div role="radiogroup" aria-label="Distancia mayor" className="q-pred-fila">
                  <span>
                    ¿Qué isómero tiene la distancia mayor entre el primer y el último átomo que elegiste ({rengMedidasBorrador} átomos en cada uno)?
                  </span>
                  {(['a', 'b', 'igual'] as const).map((rengO) => (
                    <label key={rengO} className="q-opcion">
                      <input type="radio" name="q-iso-pred" checked={rengPred === rengO} onChange={() => rengSetPred(rengO)} />
                      <span>{rengO === 'a' ? `A · ${rengPar.a.nombre}` : rengO === 'b' ? `B · ${rengPar.b.nombre}` : 'Casi la misma'}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            </>
          )}
          {rengA === null && !rengPuedePredecir && rengSeleccionLista && <p className="faint sm">Con un número distinto de átomos en A y en B no se compara la distancia: no hay predicción que hacer.</p>}
          <RengBotonCalcular
            aplicado={rengA !== null}
            sucio={rengSucio}
            deshabilitado={rengFaltaPrediccion || !rengCarga.ok}
            motivo={!rengCarga.ok ? 'No se pudo cargar la geometría de este par.' : 'Elige una predicción o desmarca «Quiero predecir antes de calcular» para calcular.'}
            onCalcular={() => {
              if (rengA === null) rengSetPredHecha(!rengQuierePredecir || !rengPuedePredecir ? null : { pred: rengPred, clave: JSON.stringify(rengPlano(rengB)) })
              rengCalcular()
            }}
          />
        </RengTarjeta>
      </RengFormulario>
      <RengSalida sucio={rengSucio} resumen={rengResumen}>
        <RengAvisoReabierta reabierta={rengReabierta} />
        {!rengCarga.ok ? (
          <RengAviso tipo="aviso">
            <b>No se puede mostrar este par.</b> {rengCarga.motivo}
          </RengAviso>
        ) : (
          <RengTarjeta titulo="Los dos isómeros" nota="Elige los átomos a medir">
            <div className="q-iso-visores" data-visores="">
              <RengVisorIsomero lado="A" geometria={rengCarga.a} seleccion={rengB.selA} onCambiar={(rengSel) => rengCambiar({ selA: rengSel })} />
              <RengVisorIsomero lado="B" geometria={rengCarga.b} seleccion={rengB.selB} onCambiar={(rengSel) => rengCambiar({ selB: rengSel })} />
            </div>
          </RengTarjeta>
        )}
        {!rengA ? (
          <RengAviso tipo="info">Elige los átomos a medir en cada isómero y pulsa «Calcular» (predecir antes es opcional): verás la distancia, los ángulos y el diedro de cada uno con la procedencia de su geometría.</RengAviso>
        ) : rengValidacion && !rengValidacion.ok ? (
          <RengAviso tipo="aviso">
            <b>No se puede calcular.</b> {rengValidacion.diagnostico}
          </RengAviso>
        ) : rengCmp ? (
          <>
            <RengTarjeta titulo="Medidas sobre los átomos elegidos" acento>
              <RengNaturaleza tipo="calculo" />
              {rengFilas.length === 0 ? (
                <RengAviso tipo="aviso">No hay nada que medir con esta selección: elige al menos 2 átomos en cada isómero.</RengAviso>
              ) : (
                <div className="q-iso-tabla-envoltura">
                  <table className="q-iso-tabla" data-medidas="">
                    <caption className="faint sm">Átomos de A: {rengEtiquetasSeleccion(rengCmp.a, rengCmp.seleccion.a).join(', ') || 'ninguno'} · átomos de B: {rengEtiquetasSeleccion(rengCmp.b, rengCmp.seleccion.b).join(', ') || 'ninguno'}</caption>
                    <thead>
                      <tr>
                        <th scope="col">Medida</th>
                        <th scope="col">A · {rengPar.a.nombre}</th>
                        <th scope="col">B · {rengPar.b.nombre}</th>
                        <th scope="col">B − A</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rengFilas.map((rengF) => (
                        <tr key={rengF.clave} data-medida={rengF.clave}>
                          <th scope="row">{rengF.nombre}</th>
                          <td data-valor="a">{rengF.a === null ? '—' : `${rengF.unidad === '°' ? rengGrados(rengF.a, rengF.dec) : rengDec(rengF.a, rengF.dec)} ${rengF.unidad}`}</td>
                          <td data-valor="b">{rengF.b === null ? '—' : `${rengF.unidad === '°' ? rengGrados(rengF.b, rengF.dec) : rengDec(rengF.b, rengF.dec)} ${rengF.unidad}`}</td>
                          <td data-valor="dif">{rengF.dif === null ? 'no se compara' : `${rengF.dif > 0 && !(rengF.unidad === '°' && Math.abs(rengF.dif) > 179.5) ? '+' : ''}${rengF.unidad === '°' ? rengGrados(rengF.dif, rengF.dec) : rengDec(rengF.dif, rengF.dec)} ${rengF.unidad}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {rengMayor !== null && (
                <p className="sm" data-veredicto="">
                  <b>Distancia mayor:</b> {rengTextoMayor(rengMayor)}.
                </p>
              )}
              <p className="sim-guia">
                Son valores de una conformación calculada con un campo de fuerzas, no mediciones: las diferencias de unas décimas de ångström o de pocos grados no deben leerse como datos experimentales. Esta escena no compara energías ni dice cuál isómero es más estable.
              </p>
            </RengTarjeta>
            {rengPredVigente !== null && rengMayor !== null && (
              <RengTarjeta titulo="Tu predicción" nota="Comparada con el cálculo">
                <p className="sm" data-prediccion-resultado="">
                  Dijiste que la distancia es mayor en {rengTextoMayor(rengPredVigente)} → {rengPredVigente === rengMayor ? 'correcto' : `no: es mayor en ${rengTextoMayor(rengMayor)}`}.
                </p>
              </RengTarjeta>
            )}
            <RengDiagnosticos escena="isomeros" entradas={rengEntradasAplicadas} />
            {rengUniversitario && (
              <details className="panel-seccion" data-formulas="">
                <summary>Cómo se miden la distancia, el ángulo y el diedro</summary>
                <ul className="sm">
                  <li>Distancia: d = |r₁ − rₙ|, entre el primer y el último átomo elegido.</li>
                  <li>Ángulo en el segundo átomo: θ = arccos[(r₁ − r₂)·(r₃ − r₂) / (|r₁ − r₂|·|r₃ − r₂|)]; con 4 átomos también en el tercero.</li>
                  <li>Diedro: φ = atan2(|b₂|·b₁·(b₂×b₃), (b₁×b₂)·(b₂×b₃)) con b₁ = r₂ − r₁, b₂ = r₃ − r₂, b₃ = r₄ − r₃. Positivo si, mirando de r₂ a r₃, el enlace r₃→r₄ queda a la derecha del r₂→r₁ (sentido horario). 0° es cis (eclipsado) y 180° trans.</li>
                </ul>
              </details>
            )}
            {rengQuimico && (
              <details className="panel-seccion" data-procedencia-detalle="">
                <summary>Procedencia de cada geometría</summary>
                <ul className="sm">
                  {[rengCmp.a, rengCmp.b].map((rengG, rengK) => (
                    <li key={rengK}>
                      <b>
                        {rengK === 0 ? 'A' : 'B'} · {rengG.nombre}
                      </b>
                      : {rengG.procedencia.origen}, {rengG.procedencia.metodo}. {rengG.procedencia.detalle} Estructura: <code>{rengG.smiles}</code>.
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {rengCientifico && (
              <details className="panel-seccion" open data-coordenadas="">
                <summary>Coordenadas de los átomos elegidos (Å, centradas en el modelo)</summary>
                <ul className="sm">
                  {[
                    { l: 'A', g: rengCmp.a, s: rengCmp.seleccion.a },
                    { l: 'B', g: rengCmp.b, s: rengCmp.seleccion.b }
                  ].map((rengX) => (
                    <li key={rengX.l}>
                      <b>
                        {rengX.l} · {rengX.g.nombre}
                      </b>
                      : {rengX.s.length === 0 ? 'ningún átomo' : rengX.s.map((rengI) => `${rengX.g.atomos[rengI]!.etiqueta} ${rengCoord(rengX.g, rengI)}`).join(' · ')}
                    </li>
                  ))}
                </ul>
                <p className="faint sm">Con estas coordenadas puedes repetir a mano cualquier medida de la tabla. Se recalculan al abrir la escena (semilla fija): no se guardan en el cuaderno.</p>
              </details>
            )}
            <RengGuardarEscena escena="isomeros" entradas={rengEntradasAplicadas} nombre={`Isómeros: ${rengPar.titulo}`} anterior={rengReabierta?.id ?? null} advertencia={rengAdvertenciaPendiente(rengSucio, rengResumen)} />
          </>
        ) : null}
      </RengSalida>
    </div>
  )
}
