import { useEffect, useMemo, useState } from 'react'
import { rengCalibrarColorimetria, rengLeerEntradaColorimetria, RENG_LIMITES_COLORIMETRIA, type RengPatronColor } from '../../nucleo/colorimetria'
import { rengCalcularEscena, rengEntradasColorimetriaEjemplo, rengValidarEntradasSim } from '../../practica/modelosSimulacion'
import { rengEntradasLegibles } from '../../practica/reglasEscena'
import { RengGraficaXY } from '../../vista/GraficaXY'
import { RengAviso, RengTarjeta } from '../../vista/ui'
import { RengAvisoReabierta, RengBotonCalcular, RengComparaCasos, RengDiagnosticos, RengFormulario, RengGuardarEscena, RengNaturaleza, RengNumModelo, RengResultado, RengSalida, RengSensibilidadPanel, rengAdvertenciaPendiente, rengFmt, useRengCalculo, useRengReapertura, type RengInicialEscena } from './comunes'

interface RengEstadoColor {
  blancos: number[]
  patrones: RengPatronColor[]
  As: number
  rep: number
}

type RengZona = '' | 'dentro' | 'debajo' | 'encima'
type RengEfecto = '' | 'mas' | 'igual' | 'menos'

const RENG_TEXTO_ZONA = { dentro: 'dentro del intervalo de los patrones', debajo: 'por debajo del patrón más diluido', encima: 'por encima del patrón más concentrado', '': '' } as const
const RENG_TEXTO_EFECTO = { mas: 'aumenta', igual: 'no cambia', menos: 'disminuye', '': '' } as const

const rengEjemplo = (): RengEstadoColor => rengDesdeFlat(rengEntradasColorimetriaEjemplo())

function rengDesdeFlat(rengE: Readonly<Record<string, number | string>>): RengEstadoColor {
  try {
    const rengL = rengLeerEntradaColorimetria(rengE)
    return { blancos: rengL.blancos, patrones: rengL.patrones, As: rengL.muestra, rep: rengL.replicas }
  } catch {
    const rengBase = rengEntradasColorimetriaEjemplo()
    const rengL = rengLeerEntradaColorimetria(rengBase)
    return { blancos: rengL.blancos, patrones: rengL.patrones, As: rengL.muestra, rep: rengL.replicas }
  }
}

const rengPlano = (rengS: RengEstadoColor): Record<string, number> => {
  const rengE: Record<string, number> = { As: rengS.As, rep: rengS.rep }
  rengS.blancos.forEach((rengB, rengI) => (rengE[`b${rengI}`] = rengB))
  rengS.patrones.forEach((rengP, rengI) => {
    rengE[`c${rengI}`] = rengP.c
    rengE[`a${rengI}`] = rengP.a
  })
  return rengE
}

export default function RengEscenaColorimetria({ inicial: rengInicial }: { inicial?: RengInicialEscena | null }): React.JSX.Element {
  const { borrador: rengB, aplicado: rengA, sucio: rengSucio, cambiar: rengCambiar, calcular: rengCalcular, reemplazar: rengReemplazar } = useRengCalculo<RengEstadoColor>(rengEjemplo(), rengInicial, rengDesdeFlat)
  const [rengPred, rengSetPred] = useState<{ zona: RengZona; efecto: RengEfecto }>({ zona: '', efecto: '' })
  const [rengPredHecha, rengSetPredHecha] = useState<{ zona: RengZona; efecto: RengEfecto } | null>(null)
  const [rengQuierePredecir, rengSetQuierePredecir] = useState(false)
  const [rengReabierta, rengOlvidar] = useRengReapertura('colorimetria', (rengE) => {
    rengReemplazar(rengDesdeFlat(rengE), true)
    rengSetPredHecha(null)
  })
  useEffect(() => {
    if (rengInicial) {
      rengOlvidar()
      rengSetPredHecha(null)
    }
  }, [rengInicial?.n])

  const rengEntradasBorrador = useMemo(() => rengPlano(rengB), [rengB])
  const rengValidacionBorrador = useMemo(() => rengValidarEntradasSim('colorimetria', rengEntradasBorrador), [rengEntradasBorrador])
  const rengEntradasAplicadas = useMemo(() => (rengA ? rengPlano(rengA) : null), [rengA])
  const rengValidacion = useMemo(() => (rengEntradasAplicadas ? rengValidarEntradasSim('colorimetria', rengEntradasAplicadas) : null), [rengEntradasAplicadas])
  const rengCal = useMemo(() => (rengEntradasAplicadas && rengValidacion?.ok ? rengCalibrarColorimetria(rengLeerEntradaColorimetria(rengEntradasAplicadas)) : null), [rengEntradasAplicadas, rengValidacion])
  const rengSalida = useMemo(() => (rengEntradasAplicadas && rengValidacion?.ok ? rengCalcularEscena('colorimetria', rengEntradasAplicadas) : null), [rengEntradasAplicadas, rengValidacion])
  const rengResumen = rengEntradasAplicadas ? rengEntradasLegibles('colorimetria', rengEntradasAplicadas) : null
  const rengFaltaPrediccion = rengA === null && rengQuierePredecir && (rengPred.zona === '' || rengPred.efecto === '')

  const rengCambiarBlanco = (rengI: number, rengV: number): void => rengCambiar({ blancos: rengB.blancos.map((rengX, rengJ) => (rengJ === rengI ? rengV : rengX)) })
  const rengCambiarPatron = (rengI: number, rengP: Partial<RengPatronColor>): void => rengCambiar({ patrones: rengB.patrones.map((rengX, rengJ) => (rengJ === rengI ? { ...rengX, ...rengP } : rengX)) })
  const rengAnadirPatron = (): void => {
    const rengUltimo = rengB.patrones[rengB.patrones.length - 1]
    rengCambiar({ patrones: [...rengB.patrones, { c: (rengUltimo?.c ?? 0) + 2, a: rengUltimo?.a ?? 0 }] })
  }

  const rengVerdadZona: RengZona = rengSalida ? (rengSalida['Acorr']! < rengSalida['Amin']! - 1e-12 ? 'debajo' : rengSalida['Acorr']! > rengSalida['Amax']! + 1e-12 ? 'encima' : 'dentro') : ''
  const rengVerdadEfecto: RengEfecto = rengSalida && rengSalida['x0'] !== undefined && rengSalida['x0raw'] !== undefined ? (Math.abs(rengSalida['x0raw'] - rengSalida['x0']) <= 1e-9 * Math.max(1, Math.abs(rengSalida['x0'])) ? 'igual' : rengSalida['x0raw'] > rengSalida['x0'] ? 'mas' : 'menos') : ''
  const rengInterpolada = rengSalida !== null && rengSalida['interp'] === 1

  const rengGrafica = useMemo(() => {
    if (!rengCal) return null
    const rengX0 = Math.min(0, rengCal.cMin)
    const rengX1 = rengCal.cMax + 0.15 * (rengCal.cMax - rengX0 || 1)
    const rengY = (rengC: number): number => rengCal.b + rengCal.m * rengC
    const rengYs = [...rengCal.filas.map((rengF) => rengF.aCorr), rengCal.muestraCorr, rengY(rengX0), rengY(rengX1)]
    return { x: [rengX0, rengX1] as [number, number], y: [Math.min(0, ...rengYs) * 1.1, Math.max(...rengYs) * 1.1] as [number, number], yFn: rengY }
  }, [rengCal])

  return (
    <div className="q-escena">
      <RengFormulario>
        <RengTarjeta titulo="Datos de la curva de calibración" nota="Disolución acuosa de una sola especie que absorbe">
          <RengAviso tipo="aviso">
            Datos de ejemplo DIDÁCTICOS de un colorante alimentario de ejemplo: no son mediciones. Sustitúyelos por los tuyos. <RengNaturaleza tipo="ejemplo" />
          </RengAviso>
          <fieldset className="q-paso">
            <legend>Blanco (disolvente sin colorante)</legend>
            {rengB.blancos.map((rengV, rengI) => (
              <div className="sim-fila" key={`b${rengI}`}>
                <RengNumModelo escena="colorimetria" clave={`b${rengI}`} valor={rengV} onChange={(rengX) => rengCambiarBlanco(rengI, rengX)} />
                {rengB.blancos.length > 1 && (
                  <button type="button" className="btn ghost sm" onClick={() => rengCambiar({ blancos: rengB.blancos.filter((_rengX, rengJ) => rengJ !== rengI) })}>
                    Quitar blanco {rengI + 1}
                  </button>
                )}
              </div>
            ))}
            {rengB.blancos.length < RENG_LIMITES_COLORIMETRIA.blancosMax && (
              <button type="button" className="btn sm" onClick={() => rengCambiar({ blancos: [...rengB.blancos, rengB.blancos[rengB.blancos.length - 1] ?? 0] })}>
                Añadir otra lectura del blanco
              </button>
            )}
          </fieldset>
          <fieldset className="q-paso">
            <legend>Patrones (de 3 a {RENG_LIMITES_COLORIMETRIA.patronesMax})</legend>
            {rengB.patrones.map((rengP, rengI) => (
              <div className="q-patron" key={`p${rengI}`}>
                <RengNumModelo escena="colorimetria" clave={`c${rengI}`} valor={rengP.c} onChange={(rengX) => rengCambiarPatron(rengI, { c: rengX })} />
                <div className="q-patron-fila">
                  <RengNumModelo escena="colorimetria" clave={`a${rengI}`} valor={rengP.a} onChange={(rengX) => rengCambiarPatron(rengI, { a: rengX })} />
                  <button type="button" className="btn ghost sm" onClick={() => rengCambiar({ patrones: rengB.patrones.filter((_rengX, rengJ) => rengJ !== rengI) })}>
                    Quitar patrón {rengI + 1}
                  </button>
                </div>
              </div>
            ))}
            {rengB.patrones.length < RENG_LIMITES_COLORIMETRIA.patronesMax && (
              <button type="button" className="btn sm" onClick={rengAnadirPatron}>
                Añadir patrón (copia del último: edítalo)
              </button>
            )}
          </fieldset>
          <fieldset className="q-paso">
            <legend>Muestra problema</legend>
            <RengNumModelo escena="colorimetria" clave="As" valor={rengB.As} onChange={(rengX) => rengCambiar({ As: rengX })} />
            <RengNumModelo escena="colorimetria" clave="rep" valor={rengB.rep} onChange={(rengX) => rengCambiar({ rep: rengX })} />
          </fieldset>
          {!rengValidacionBorrador.ok && <RengAviso tipo="aviso">{rengValidacionBorrador.diagnostico}</RengAviso>}
          {rengA === null && (
            <>
            <label className="q-opcion" data-prediccion-opcional="">
              <input type="checkbox" checked={rengQuierePredecir} onChange={(rengE) => rengSetQuierePredecir(rengE.target.checked)} />
              <span>Quiero predecir antes de calcular (opcional)</span>
            </label>
            {rengQuierePredecir && (
              <fieldset className="q-prediccion" data-prediccion="">
                <legend>Antes de calcular, ¿qué crees que pasará?</legend>
                <div role="radiogroup" aria-label="Dónde cae la absorbancia de la muestra" className="q-pred-fila">
                  <span>La absorbancia de la muestra, ya sin el blanco, cae…</span>
                  {(['dentro', 'debajo', 'encima'] as const).map((rengO) => (
                    <label key={rengO} className="q-opcion">
                      <input type="radio" name="q-col-pred-zona" checked={rengPred.zona === rengO} onChange={() => rengSetPred((rengP) => ({ ...rengP, zona: rengO }))} />
                      <span>{RENG_TEXTO_ZONA[rengO]}</span>
                    </label>
                  ))}
                </div>
                <div role="radiogroup" aria-label="Efecto de no restar el blanco" className="q-pred-fila">
                  <span>Si no restaras el blanco (ni a los patrones ni a la muestra), la concentración de la muestra…</span>
                  {(['mas', 'igual', 'menos'] as const).map((rengO) => (
                    <label key={rengO} className="q-opcion">
                      <input type="radio" name="q-col-pred-efecto" checked={rengPred.efecto === rengO} onChange={() => rengSetPred((rengP) => ({ ...rengP, efecto: rengO }))} />
                      <span>{RENG_TEXTO_EFECTO[rengO]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            </>
          )}
          <RengBotonCalcular
            aplicado={rengA !== null}
            sucio={rengSucio}
            deshabilitado={rengFaltaPrediccion}
            motivo="Elige las dos predicciones o desmarca «Quiero predecir antes de calcular» para calcular."
            onCalcular={() => {
              if (rengA === null) rengSetPredHecha(!rengQuierePredecir ? null : rengPred)
              rengCalcular()
            }}
          />
        </RengTarjeta>
      </RengFormulario>
      <RengSalida sucio={rengSucio} resumen={rengResumen}>
        <RengAvisoReabierta reabierta={rengReabierta} />
        {!rengA ? (
          <RengAviso tipo="info">Introduce el blanco, los patrones y la muestra y pulsa «Calcular» (predecir antes es opcional): verás la recta con sus residuos y la concentración de la muestra, solo si cae dentro de la curva.</RengAviso>
        ) : rengValidacion && !rengValidacion.ok ? (
          <RengAviso tipo="aviso">
            <b>No se puede calcular.</b> {rengValidacion.diagnostico}
          </RengAviso>
        ) : rengCal && rengSalida && rengGrafica ? (
          <>
            <RengTarjeta titulo="Concentración de la muestra" acento>
              {rengInterpolada && <RengNaturaleza tipo="calculo" />}
              {rengInterpolada && rengCal.x0 !== null && rengCal.u !== null ? (
                <>
                  <RengResultado etiqueta="Concentración" valor={`${rengFmt(rengCal.x0, 4)} mg/L`} />
                  <RengResultado etiqueta="Incertidumbre típica u (k = 1)" valor={`${rengFmt(rengCal.u, 2)} mg/L`} />
                  <p className="sim-guia">
                    Interpolada: la absorbancia de la muestra y el resultado caen dentro del intervalo de los patrones ({rengFmt(rengCal.cMin)}–{rengFmt(rengCal.cMax)} mg/L). La incertidumbre recoge la regresión y las réplicas de la muestra (N = {rengA.rep}); no incluye la preparación de los patrones.
                  </p>
                </>
              ) : (
                <RengAviso tipo="aviso">
                  <b>No se calcula la concentración.</b> La muestra queda fuera de la curva: extrapolar no es fiable. El motivo exacto está en el diagnóstico de abajo; la recta y los residuos de los patrones sí son válidos.
                </RengAviso>
              )}
            </RengTarjeta>
            <RengTarjeta titulo="Curva de calibración" nota="Absorbancia sin el blanco frente a concentración">
              <RengNaturaleza tipo="ejemplo" />
              <RengGraficaXY
                descripcion={`Absorbancia sin el blanco frente a concentración: ${rengCal.n} patrones, recta de pendiente ${rengFmt(rengCal.m, 4)} litros por miligramo y ordenada ${rengFmt(rengCal.b, 3)}. ${rengInterpolada && rengCal.x0 !== null ? `Muestra interpolada en ${rengFmt(rengCal.x0, 4)} miligramos por litro.` : 'La muestra queda fuera de la curva y no se interpola.'}`}
                tituloX="concentración (mg/L)"
                tituloY="absorbancia sin el blanco"
                x={rengGrafica.x}
                y={rengGrafica.y}
                series={[
                  { nombre: 'Recta (fuera de los patrones: no usar)', puntos: [[rengGrafica.x[0], rengGrafica.yFn(rengGrafica.x[0])], [rengGrafica.x[1], rengGrafica.yFn(rengGrafica.x[1])]], color: 'var(--text-3)', punteada: true },
                  { nombre: 'Recta en el intervalo de los patrones', puntos: [[rengCal.cMin, rengGrafica.yFn(rengCal.cMin)], [rengCal.cMax, rengGrafica.yFn(rengCal.cMax)]], color: 'var(--accent)' },
                  { nombre: 'Patrones', puntos: rengCal.filas.map((rengF) => [rengF.c, rengF.aCorr] as [number, number]), color: 'var(--ok)', marcador: 'cuadrado', sinLinea: true },
                  { nombre: 'Absorbancia de la muestra', puntos: [[rengGrafica.x[0], rengCal.muestraCorr], [rengGrafica.x[1], rengCal.muestraCorr]], color: 'var(--warn)', punteada: true }
                ]}
                marcas={rengInterpolada && rengCal.x0 !== null ? [{ x: rengCal.x0, y: rengCal.muestraCorr, etiqueta: 'muestra' }] : []}
              />
              <div className="sim-res">
                <small>Intervalo válido de la curva</small>
                <b>
                  {rengFmt(rengCal.cMin)}–{rengFmt(rengCal.cMax)} mg/L · A {rengFmt(rengCal.aMin, 3)}–{rengFmt(rengCal.aMax, 3)}
                </b>
              </div>
              <RengResultado etiqueta="Pendiente m" valor={`${rengFmt(rengCal.m, 4)} L/mg`} />
              <RengResultado etiqueta="Ordenada b" valor={rengFmt(rengCal.b, 3)} />
              <RengResultado etiqueta="R²" valor={rengFmt(rengCal.r2, 5)} />
              <RengResultado etiqueta="Desviación típica de la regresión s_r" valor={rengFmt(rengCal.sr, 3)} />
              <RengResultado etiqueta="Blanco medio restado" valor={rengFmt(rengCal.blancoMedio, 4)} />
              <p className="sim-guia">
                R² y residuos se muestran para que juzgues la linealidad; no hay un criterio fuente para aceptarla o rechazarla con un número, así que la app no emite ese veredicto. Restar el blanco no cambia la concentración (se resta de todo): solo hace que la ordenada se acerque a 0.
              </p>
            </RengTarjeta>
            <RengTarjeta titulo="Residuos de los patrones" nota="Residuo = absorbancia − recta">
              <table className="table tabla-datos">
                <caption className="sr-only">Residuos de cada patrón de la curva de calibración</caption>
                <thead>
                  <tr>
                    <th scope="col">Patrón</th>
                    <th scope="col">c (mg/L)</th>
                    <th scope="col">A leída</th>
                    <th scope="col">A sin blanco</th>
                    <th scope="col">A de la recta</th>
                    <th scope="col">Residuo</th>
                  </tr>
                </thead>
                <tbody>
                  {rengCal.filas.map((rengF, rengI) => (
                    <tr key={rengI}>
                      <th scope="row">{rengI + 1}</th>
                      <td>{rengFmt(rengF.c, 4)}</td>
                      <td>{rengFmt(rengF.a, 4)}</td>
                      <td>{rengFmt(rengF.aCorr, 4)}</td>
                      <td>{rengFmt(rengF.ajustada, 4)}</td>
                      <td>{rengF.residuo > 0 ? '+' : ''}{rengFmt(rengF.residuo, 3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </RengTarjeta>
            {rengPredHecha && (
              <RengTarjeta titulo="Tu predicción" nota="Comparada con el cálculo">
                <ul className="sm" data-prediccion-resultado="">
                  <li>
                    Absorbancia de la muestra: dijiste «{RENG_TEXTO_ZONA[rengPredHecha.zona]}» → {rengPredHecha.zona === rengVerdadZona ? 'correcto' : `no: cae ${RENG_TEXTO_ZONA[rengVerdadZona]}`}.
                  </li>
                  <li>
                    Sin restar el blanco: dijiste que la concentración «{RENG_TEXTO_EFECTO[rengPredHecha.efecto]}» →{' '}
                    {rengVerdadEfecto === '' ? 'no se puede comparar: la muestra no se interpoló.' : rengPredHecha.efecto === rengVerdadEfecto ? 'correcto: el blanco se resta de los patrones y de la muestra, y se cancela.' : `no: ${RENG_TEXTO_EFECTO[rengVerdadEfecto]}; el blanco se resta de los patrones y de la muestra, y se cancela (se calculó también sin restarlo para comprobarlo).`}
                  </li>
                </ul>
              </RengTarjeta>
            )}
            <RengDiagnosticos escena="colorimetria" entradas={rengEntradasAplicadas} />
            <RengComparaCasos escena="colorimetria" entradas={rengEntradasAplicadas} />
            <RengSensibilidadPanel escena="colorimetria" entradas={rengEntradasAplicadas} />
            <RengGuardarEscena escena="colorimetria" entradas={rengEntradasAplicadas} nombre={rengInterpolada && rengCal.x0 !== null ? `Colorimetría: muestra ${rengFmt(rengCal.x0, 3)} mg/L (${rengCal.n} patrones)` : `Colorimetría: muestra fuera de la curva (${rengCal.n} patrones)`} anterior={rengReabierta?.id ?? null} advertencia={rengAdvertenciaPendiente(rengSucio, rengResumen)} />
          </>
        ) : null}
      </RengSalida>
    </div>
  )
}
