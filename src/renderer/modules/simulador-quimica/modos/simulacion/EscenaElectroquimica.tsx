import { useEffect, useMemo, useState } from 'react'
import { RENG_FARADAY, RENG_PARES_ELECTRO, RENG_R_GASES, rengParRegistrado } from '../../datos/electroquimica'
import { rengSerieNernst } from '../../nucleo/electroquimica'
import { rengAnalizarCeldaEntradas, rengSemiceldaCore, rengValidarEntradasSim } from '../../practica/modelosSimulacion'
import { rengEntradasLegibles } from '../../practica/reglasEscena'
import { RengGraficaXY } from '../../vista/GraficaXY'
import { RengAviso, RengTarjeta } from '../../vista/ui'
import { RengAvisoReabierta, RengBotonCalcular, RengComparaCasos, RengDiagnosticos, RengFormulario, RengGuardarEscena, RengNaturaleza, RengNumModelo, RengResultado, RengSalida, RengSensibilidadPanel, rengAdvertenciaPendiente, rengFmt, useRengCalculo, useRengReapertura, type RengInicialEscena } from './comunes'

interface RengEstadoCelda {
  ano: string
  cat: string
  cA: number
  cC: number
}

type RengPrediccionEsp = '' | 'si' | 'no'
type RengPrediccionEl = '' | 'hacia-cat' | 'hacia-ano' | 'ninguno'

const RENG_POR_DEFECTO: RengEstadoCelda = { ano: 'zn', cat: 'cu', cA: 1, cC: 1 }
const RENG_TEXTO_ESP = { si: 'sí, es espontánea', no: 'no es espontánea', '': '' } as const
const RENG_TEXTO_EL = { 'hacia-cat': 'del ánodo propuesto al cátodo propuesto', 'hacia-ano': 'del cátodo propuesto al ánodo propuesto', ninguno: 'no hay corriente (equilibrio)', '': '' } as const

const rengDesde = (rengE: Readonly<Record<string, number | string>>): RengEstadoCelda => ({
  ano: RENG_PARES_ELECTRO.some((rengP) => rengP.id === rengE['ano']) ? String(rengE['ano']) : RENG_POR_DEFECTO.ano,
  cat: RENG_PARES_ELECTRO.some((rengP) => rengP.id === rengE['cat']) ? String(rengE['cat']) : RENG_POR_DEFECTO.cat,
  cA: Number(rengE['cA'] ?? RENG_POR_DEFECTO.cA),
  cC: Number(rengE['cC'] ?? RENG_POR_DEFECTO.cC)
})

const rengPlano = (rengS: RengEstadoCelda): Record<string, number | string> => ({ ano: rengS.ano, cat: rengS.cat, cA: rengS.cA, cC: rengS.cC })
const rengVolt = (rengV: number): string => `${rengV < 0 ? '−' : ''}${rengFmt(Math.abs(rengV), 5)} V`

function RengEsquemaCelda({ anodo: rengAnodo, catodo: rengCatodo, equilibrio: rengEquilibrio }: { anodo: string; catodo: string; equilibrio: boolean }): React.JSX.Element {
  return (
    <svg className="q-celda-svg" viewBox="0 0 480 230" aria-hidden="true" focusable="false">
      <title>Esquema de la celda galvánica</title>
      <path d="M40 90 L40 200 Q40 208 48 208 L172 208 Q180 208 180 200 L180 90" fill="none" stroke="var(--text-2)" strokeWidth="2.5" />
      <path d="M300 90 L300 200 Q300 208 308 208 L432 208 Q440 208 440 200 L440 90" fill="none" stroke="var(--text-2)" strokeWidth="2.5" />
      <rect x="42" y="130" width="136" height="76" fill="var(--accent)" fillOpacity="0.18" />
      <rect x="302" y="130" width="136" height="76" fill="var(--accent)" fillOpacity="0.18" />
      <rect x="100" y="40" width="16" height="140" fill="var(--text-3)" />
      <rect x="364" y="40" width="16" height="140" fill="var(--text-3)" />
      <path d="M108 40 L108 22 L372 22 L372 40" fill="none" stroke="var(--text)" strokeWidth="2.2" />
      {!rengEquilibrio && (
        <>
          <polygon points="236,14 250,22 236,30" fill="var(--text)" />
          <text x="226" y="12" textAnchor="middle" className="q-mesa-texto">e⁻</text>
        </>
      )}
      <path d="M150 90 L150 58 Q150 52 156 52 L324 52 Q330 52 330 58 L330 90" fill="none" stroke="var(--text-2)" strokeWidth="9" strokeLinecap="round" opacity="0.35" />
      <text x="240" y="44" textAnchor="middle" className="q-mesa-texto">puente salino (no modelado)</text>
      <text x="110" y="226" textAnchor="middle" className="q-mesa-texto">ánodo (−) · oxidación: {rengAnodo}</text>
      <text x="370" y="226" textAnchor="middle" className="q-mesa-texto">cátodo (+) · reducción: {rengCatodo}</text>
      {!rengEquilibrio && (
        <>
          <text x="234" y="78" textAnchor="end" className="q-mesa-texto">← aniones</text>
          <text x="246" y="78" className="q-mesa-texto">cationes →</text>
        </>
      )}
    </svg>
  )
}

export default function RengEscenaElectroquimica({ inicial: rengInicial }: { inicial?: RengInicialEscena | null }): React.JSX.Element {
  const { borrador: rengB, aplicado: rengA, sucio: rengSucio, cambiar: rengCambiar, calcular: rengCalcular, reemplazar: rengReemplazar } = useRengCalculo<RengEstadoCelda>(RENG_POR_DEFECTO, rengInicial, rengDesde)
  const [rengPred, rengSetPred] = useState<{ esp: RengPrediccionEsp; el: RengPrediccionEl }>({ esp: '', el: '' })
  const [rengPredHecha, rengSetPredHecha] = useState<{ esp: RengPrediccionEsp; el: RengPrediccionEl } | null>(null)
  const [rengQuierePredecir, rengSetQuierePredecir] = useState(false)
  const [rengReabierta, rengOlvidar] = useRengReapertura('electroquimica', (rengE) => {
    rengReemplazar(rengDesde(rengE), true)
    rengSetPredHecha(null)
  })
  useEffect(() => {
    if (rengInicial) {
      rengOlvidar()
      rengSetPredHecha(null)
    }
  }, [rengInicial?.n])

  const rengAnoB = rengParRegistrado(rengB.ano)
  const rengCatB = rengParRegistrado(rengB.cat)
  const rengEntradasBorrador = useMemo(() => rengPlano(rengB), [rengB])
  const rengValidacionBorrador = useMemo(() => rengValidarEntradasSim('electroquimica', rengEntradasBorrador), [rengEntradasBorrador])
  const rengEntradasAplicadas = useMemo(() => (rengA ? rengPlano(rengA) : null), [rengA])
  const rengValidacion = useMemo(() => (rengEntradasAplicadas ? rengValidarEntradasSim('electroquimica', rengEntradasAplicadas) : null), [rengEntradasAplicadas])
  const rengR = useMemo(() => (rengEntradasAplicadas && rengValidacion?.ok ? rengAnalizarCeldaEntradas(rengEntradasAplicadas) : null), [rengEntradasAplicadas, rengValidacion])
  const rengAnoA = rengA ? rengParRegistrado(rengA.ano) : null
  const rengCatA = rengA ? rengParRegistrado(rengA.cat) : null
  const rengSerie = useMemo(() => (rengR && rengAnoA && rengCatA && rengA ? rengSerieNernst({ anodo: rengSemiceldaCore(rengAnoA), catodo: rengSemiceldaCore(rengCatA), cA: rengA.cA, cC: rengA.cC, F: RENG_FARADAY.valor, R: RENG_R_GASES.valor }) : null), [rengR, rengAnoA, rengCatA, rengA])
  const rengResumen = rengEntradasAplicadas ? rengEntradasLegibles('electroquimica', rengEntradasAplicadas) : null
  const rengFaltaPrediccion = rengA === null && rengQuierePredecir && (rengPred.esp === '' || rengPred.el === '')
  const rengInvertida = rengR !== null && rengR.catodoReal === 'invertido'
  const rengAnodoReal = rengInvertida ? rengCatA : rengAnoA
  const rengCatodoReal = rengInvertida ? rengAnoA : rengCatA
  const rengVerdadEsp: RengPrediccionEsp = rengR ? (rengR.espontanea ? 'si' : 'no') : ''
  const rengVerdadEl: RengPrediccionEl = rengR ? (rengR.enEquilibrio ? 'ninguno' : rengInvertida ? 'hacia-ano' : 'hacia-cat') : ''

  return (
    <div className="q-escena">
      <RengFormulario>
        <RengTarjeta titulo="Celda galvánica ideal" nota="298,15 K · referencia SHE · modelo ideal">
          <RengAviso tipo="info">
            Potenciales estándar de reducción de la fuente consultada (Wikipedia, página de datos; 298,15 K, SHE, actividad 1). <RengNaturaleza tipo="publicado" /> Solo hay pares con fuente de potencial abierta: otros no se ofrecen.
          </RengAviso>
          <label className="sim-campo">
            <span>Semicelda del ánodo (propuesta)</span>
            <select className="input" value={rengB.ano} onChange={(rengE) => rengCambiar({ ano: rengE.target.value })}>
              {RENG_PARES_ELECTRO.map((rengP) => (
                <option key={rengP.id} value={rengP.id}>
                  {rengP.nombre} ({rengP.oxidante.formula}/{rengP.reductor.formula})
                </option>
              ))}
            </select>
          </label>
          <p className="sm" data-e0="ano">
            E° = {rengVolt(rengAnoB.E0)} (dato publicado)
          </p>
          <label className="sim-campo">
            <span>Semicelda del cátodo (propuesta)</span>
            <select className="input" value={rengB.cat} onChange={(rengE) => rengCambiar({ cat: rengE.target.value })}>
              {RENG_PARES_ELECTRO.map((rengP) => (
                <option key={rengP.id} value={rengP.id}>
                  {rengP.nombre} ({rengP.oxidante.formula}/{rengP.reductor.formula})
                </option>
              ))}
            </select>
          </label>
          <p className="sm" data-e0="cat">
            E° = {rengVolt(rengCatB.E0)} (dato publicado)
          </p>
          <RengNumModelo escena="electroquimica" clave="cA" etiqueta={`Concentración de ${rengAnoB.oxidante.formula} en el ánodo`} valor={rengB.cA} onChange={(rengV) => rengCambiar({ cA: rengV })} />
          <RengNumModelo escena="electroquimica" clave="cC" etiqueta={`Concentración de ${rengCatB.oxidante.formula} en el cátodo`} valor={rengB.cC} onChange={(rengV) => rengCambiar({ cC: rengV })} />
          <p className="faint sm">Con 1 mol/L en ambos lados son las condiciones estándar de la fuente (actividad 1). El metal (o el gas H₂) de cada semicelda está a actividad 1. «Ánodo» y «cátodo» son tu propuesta: si el potencial sale negativo, la celda real funcionaría al revés.</p>
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
                <div role="radiogroup" aria-label="Espontaneidad" className="q-pred-fila">
                  <span>Tal como la planteas (ánodo y cátodo propuestos), la reacción…</span>
                  {(['si', 'no'] as const).map((rengO) => (
                    <label key={rengO} className="q-opcion">
                      <input type="radio" name="q-ele-pred-esp" checked={rengPred.esp === rengO} onChange={() => rengSetPred((rengP) => ({ ...rengP, esp: rengO }))} />
                      <span>{RENG_TEXTO_ESP[rengO]}</span>
                    </label>
                  ))}
                </div>
                <div role="radiogroup" aria-label="Sentido de los electrones" className="q-pred-fila">
                  <span>Por el circuito externo, los electrones van…</span>
                  {(['hacia-cat', 'hacia-ano', 'ninguno'] as const).map((rengO) => (
                    <label key={rengO} className="q-opcion">
                      <input type="radio" name="q-ele-pred-el" checked={rengPred.el === rengO} onChange={() => rengSetPred((rengP) => ({ ...rengP, el: rengO }))} />
                      <span>{RENG_TEXTO_EL[rengO]}</span>
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
          <RengAviso tipo="info">Elige dos semiceldas y las concentraciones de sus iones y pulsa «Calcular» (predecir antes es opcional): verás el ánodo y el cátodo reales, la polaridad, el sentido de los electrones y de los iones, E°, ΔG°, K y el potencial por Nernst.</RengAviso>
        ) : rengValidacion && !rengValidacion.ok ? (
          <RengAviso tipo="aviso">
            <b>No se puede calcular.</b> {rengValidacion.diagnostico}
          </RengAviso>
        ) : rengR && rengAnoA && rengCatA && rengAnodoReal && rengCatodoReal && rengSerie ? (
          <>
            <RengTarjeta titulo="Quién es el ánodo y quién el cátodo" acento>
              <RengNaturaleza tipo="calculo" />
              <RengEsquemaCelda anodo={`${rengAnodoReal.reductor.formula} → ${rengAnodoReal.oxidante.formula}`} catodo={`${rengCatodoReal.oxidante.formula} → ${rengCatodoReal.reductor.formula}`} equilibrio={rengR.enEquilibrio} />
              <dl className="q-mesa-datos" aria-label="Qué ocurre en cada electrodo" data-celda="">
                <div>
                  <dt>Ánodo (oxidación, polo negativo)</dt>
                  <dd>
                    {rengAnodoReal.reductor.formula} → {rengAnodoReal.oxidante.formula} + {rengAnodoReal.n} e⁻
                  </dd>
                </div>
                <div>
                  <dt>Cátodo (reducción, polo positivo)</dt>
                  <dd>
                    {rengCatodoReal.oxidante.formula} + {rengCatodoReal.n} e⁻ → {rengCatodoReal.reductor.formula}
                  </dd>
                </div>
                <div>
                  <dt>Electrones por el circuito externo</dt>
                  <dd data-electrones="">{rengR.enEquilibrio ? 'no circulan (equilibrio)' : `del ánodo (${rengAnodoReal.reductor.formula}) al cátodo (${rengCatodoReal.reductor.formula})`}</dd>
                </div>
                <div>
                  <dt>Iones por el puente salino (idealizado)</dt>
                  <dd data-iones="">{rengR.enEquilibrio ? 'sin movimiento neto' : 'los aniones hacia el ánodo y los cationes hacia el cátodo'}</dd>
                </div>
                <div>
                  <dt>Tu propuesta</dt>
                  <dd data-propuesta="">{rengInvertida ? `invertida: lo que propusiste como cátodo (${rengAnoA.reductor.formula}) es en realidad el ánodo` : rengR.enEquilibrio ? 'sin diferencia de potencial' : 'acertaste: el ánodo y el cátodo propuestos son los reales'}</dd>
                </div>
              </dl>
            </RengTarjeta>
            <RengTarjeta titulo="Potencial, energía libre y equilibrio" nota="Dato publicado + cálculo">
              <RengNaturaleza tipo="calculo" />
              <RengResultado etiqueta={`E°celda = E°cátodo − E°ánodo = ${rengVolt(rengCatA.E0)} − (${rengVolt(rengAnoA.E0)})`} valor={rengVolt(rengR.E0Celda)} />
              <RengResultado etiqueta="Reacción global (tal como la planteas)" valor={rengR.ecuacion} />
              <RengResultado etiqueta="Electrones intercambiados n" valor={String(rengR.nCelda)} />
              <RengResultado etiqueta="ΔG° = −nFE°" valor={`${rengFmt(rengR.deltaG0 / 1000, 5)} kJ/mol`} />
              <RengResultado etiqueta="ln K = nFE°/(RT)" valor={rengFmt(rengR.lnK, 5)} />
              <RengResultado etiqueta="Constante de equilibrio K" valor={rengR.K !== null ? rengFmt(rengR.K, 3) : 'fuera del rango numérico (usa ln K)'} />
              {rengR.E !== null && rengR.Q !== null && rengR.deltaG !== null ? (
                <>
                  <RengResultado
                    etiqueta={`Q = [${rengAnoA.oxidante.formula}]^${rengAnoA.oxidante.nu * rengR.factorAnodo} / [${rengCatA.oxidante.formula}]^${rengCatA.oxidante.nu * rengR.factorCatodo}`}
                    valor={rengFmt(rengR.Q, 3)}
                  />
                  <RengResultado etiqueta="E = E° − (RT/nF)·ln Q (Nernst)" valor={rengVolt(rengR.E)} />
                  <RengResultado etiqueta="ΔG = −nFE" valor={`${rengFmt(rengR.deltaG / 1000, 5)} kJ/mol`} />
                </>
              ) : (
                <RengAviso tipo="aviso">No se calcula el potencial con concentraciones: falta una especie (0 mol/L) y Q no está definido. El potencial estándar sí.</RengAviso>
              )}
              <p className="sim-guia">
                Espontánea si E &gt; 0 (con concentraciones) o E° &gt; 0 (estándar). Esto dice que la reacción puede ocurrir, no lo rápido que ocurre. Es una celda ideal en circuito abierto: no hay resistencia interna, sobrepotencial ni puente salino real, así que E es el máximo teórico. F = {String(RENG_FARADAY.valor).replace('.', ',')} C/mol y R = {String(RENG_R_GASES.valor).replace('.', ',')} J/(mol·K) (CODATA, exactas).
              </p>
            </RengTarjeta>
            {rengSerie.filas.length > 0 && (
              <RengTarjeta titulo="El potencial frente a la concentración" nota="Nernst: E sube 0,0592/n V por década">
                <RengNaturaleza tipo="calculo" />
                <RengGraficaXY
                  descripcion={`Potencial de la celda frente al logaritmo decimal de la concentración de ${rengCatA.oxidante.formula} en el cátodo, con la del ánodo fija en ${rengFmt(rengA.cA, 3)} mol por litro. Sube con la concentración.`}
                  tituloX={`log₁₀ de [${rengCatA.oxidante.formula}] en el cátodo`}
                  tituloY="potencial de la celda (V)"
                  x={[-6, 0]}
                  series={[{ nombre: 'Potencial de Nernst', puntos: rengSerie.filas, color: 'var(--accent)' }]}
                  marcas={rengA.cC > 0 && rengR.E !== null ? [{ x: Math.log10(rengA.cC), y: rengR.E, etiqueta: 'ahora' }] : []}
                />
                <p className="sim-guia">Cada punto aplica la ecuación de Nernst con la concentración del ánodo fija. Es un modelo ideal: por debajo de 10⁻⁶ mol/L y por encima de 0,01 mol/L no es fiable.</p>
              </RengTarjeta>
            )}
            {rengPredHecha && (
              <RengTarjeta titulo="Tu predicción" nota="Comparada con el cálculo">
                <ul className="sm" data-prediccion-resultado="">
                  <li>
                    Espontaneidad: dijiste «{RENG_TEXTO_ESP[rengPredHecha.esp]}» → {rengPredHecha.esp === rengVerdadEsp ? 'correcto' : `no: ${RENG_TEXTO_ESP[rengVerdadEsp as Exclude<RengPrediccionEsp, ''>]}`} ({rengR.E === null ? 'E°' : 'E'} = {rengVolt(rengR.E ?? rengR.E0Celda)}).
                  </li>
                  <li>
                    Electrones: dijiste «{RENG_TEXTO_EL[rengPredHecha.el]}» → {rengPredHecha.el === rengVerdadEl ? 'correcto' : `no: van ${RENG_TEXTO_EL[rengVerdadEl as Exclude<RengPrediccionEl, ''>]}`}
                    {rengVerdadEl === 'hacia-cat' ? ': el ánodo cede electrones (se oxida) y el cátodo los recibe (se reduce).' : '.'}
                  </li>
                </ul>
              </RengTarjeta>
            )}
            <RengDiagnosticos escena="electroquimica" entradas={rengEntradasAplicadas} />
            <RengComparaCasos escena="electroquimica" entradas={rengEntradasAplicadas} />
            <RengSensibilidadPanel escena="electroquimica" entradas={rengEntradasAplicadas} />
            <RengGuardarEscena escena="electroquimica" entradas={rengEntradasAplicadas} nombre={`Celda ${rengAnodoReal.reductor.formula}|${rengCatodoReal.reductor.formula}: E° = ${rengFmt(Math.abs(rengR.E0Celda), 4)} V`} anterior={rengReabierta?.id ?? null} advertencia={rengAdvertenciaPendiente(rengSucio, rengResumen)} />
          </>
        ) : null}
      </RengSalida>
    </div>
  )
}
