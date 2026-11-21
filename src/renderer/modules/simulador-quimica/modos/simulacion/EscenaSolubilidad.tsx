import { useEffect, useMemo, useState } from 'react'
import { RENG_SALES_SOLUBILIDAD, rengSalRegistrada } from '../../datos/solubilidad'
import { rengSerieIonComun } from '../../nucleo/solubilidad'
import { rengAnalizarSolubilidadEntradas, rengValidarEntradasSim } from '../../practica/modelosSimulacion'
import { rengEntradasLegibles } from '../../practica/reglasEscena'
import { RengGraficaXY } from '../../vista/GraficaXY'
import { RengAviso, RengTarjeta } from '../../vista/ui'
import { RengAvisoReabierta, RengBotonCalcular, RengComparaCasos, RengDiagnosticos, RengFormulario, RengGuardarEscena, RengNaturaleza, RengNumModelo, RengResultado, RengSalida, RengSensibilidadPanel, rengAdvertenciaPendiente, rengFmt, useRengCalculo, useRengReapertura, type RengInicialEscena } from './comunes'

interface RengEstadoSol {
  sal: string
  cM: number
  cA: number
  sol0: number
}

type RengPrediccionQ = '' | 'disuelve' | 'equilibrio' | 'precipita'
type RengPrediccionS = '' | 'mayor' | 'igual' | 'menor'

const RENG_POR_DEFECTO: RengEstadoSol = { sal: 'mgoh2', cM: 1e-4, cA: 1e-3, sol0: 0 }
const RENG_TEXTO_Q = { disuelve: 'Q < Ksp: no precipita (si hay sólido, se disuelve)', equilibrio: 'Q = Ksp: equilibrio, no hay evolución', precipita: 'Q > Ksp: precipita', '': '' } as const
const RENG_TEXTO_S = { mayor: 'mayor', igual: 'igual', menor: 'menor', '': '' } as const

const rengDesde = (rengE: Readonly<Record<string, number | string>>): RengEstadoSol => ({
  sal: RENG_SALES_SOLUBILIDAD.some((rengS) => rengS.id === rengE['sal']) ? String(rengE['sal']) : RENG_POR_DEFECTO.sal,
  cM: Number(rengE['cM'] ?? RENG_POR_DEFECTO.cM),
  cA: Number(rengE['cA'] ?? RENG_POR_DEFECTO.cA),
  sol0: Number(rengE['sol0'] ?? 0)
})

const rengPlano = (rengS: RengEstadoSol): Record<string, number | string> => ({ sal: rengS.sal, cM: rengS.cM, cA: rengS.cA, sol0: rengS.sol0 })

export default function RengEscenaSolubilidad({ inicial: rengInicial }: { inicial?: RengInicialEscena | null }): React.JSX.Element {
  const { borrador: rengB, aplicado: rengA, sucio: rengSucio, cambiar: rengCambiar, calcular: rengCalcular, reemplazar: rengReemplazar } = useRengCalculo<RengEstadoSol>(RENG_POR_DEFECTO, rengInicial, rengDesde)
  const [rengPred, rengSetPred] = useState<{ q: RengPrediccionQ; s: RengPrediccionS }>({ q: '', s: '' })
  const [rengPredHecha, rengSetPredHecha] = useState<{ q: RengPrediccionQ; s: RengPrediccionS } | null>(null)
  const [rengQuierePredecir, rengSetQuierePredecir] = useState(false)
  const [rengReabierta, rengOlvidar] = useRengReapertura('solubilidad', (rengE) => {
    rengReemplazar(rengDesde(rengE), true)
    rengSetPredHecha(null)
  })
  useEffect(() => {
    if (rengInicial) {
      rengOlvidar()
      rengSetPredHecha(null)
    }
  }, [rengInicial?.n])

  const rengSalB = rengSalRegistrada(rengB.sal)
  const rengEntradasBorrador = useMemo(() => rengPlano(rengB), [rengB])
  const rengValidacionBorrador = useMemo(() => rengValidarEntradasSim('solubilidad', rengEntradasBorrador), [rengEntradasBorrador])
  const rengEntradasAplicadas = useMemo(() => (rengA ? rengPlano(rengA) : null), [rengA])
  const rengValidacion = useMemo(() => (rengEntradasAplicadas ? rengValidarEntradasSim('solubilidad', rengEntradasAplicadas) : null), [rengEntradasAplicadas])
  const rengR = useMemo(() => (rengEntradasAplicadas && rengValidacion?.ok ? rengAnalizarSolubilidadEntradas(rengEntradasAplicadas) : null), [rengEntradasAplicadas, rengValidacion])
  const rengSalA = rengA ? rengSalRegistrada(rengA.sal) : null
  const rengCurva = useMemo(() => (rengR && rengSalA && rengA ? rengSerieIonComun(rengSalA.ksp, rengSalA.cation.nu, rengSalA.anion.nu, rengA.cM, rengA.cA) : null), [rengR, rengSalA, rengA])
  const rengResumen = rengEntradasAplicadas ? rengEntradasLegibles('solubilidad', rengEntradasAplicadas) : null
  const rengFaltaPrediccion = rengA === null && rengQuierePredecir && (rengPred.q === '' || rengPred.s === '')
  const rengVerdadS: RengPrediccionS = rengR ? (rengR.s < rengR.s0 * (1 - 1e-9) ? 'menor' : rengR.s > rengR.s0 * (1 + 1e-9) ? 'mayor' : 'igual') : ''
  const rengFormulaM = rengSalB.cation.formula
  const rengFormulaA = rengSalB.anion.formula

  return (
    <div className="q-escena">
      <RengFormulario>
        <RengTarjeta titulo="Sal e iones en disolución" nota="Agua a 25 °C, modelo ideal">
          <RengAviso tipo="info">
            Ksp de la fuente consultada (Harvey, LibreTexts 16.10; Martell y Smith, 1976; 25 °C, fuerza iónica cero). <RengNaturaleza tipo="publicado" /> Solo hay sales con fuente de Ksp abierta: otras no se ofrecen.
          </RengAviso>
          <label className="sim-campo">
            <span>Sal</span>
            <select className="input" value={rengB.sal} onChange={(rengE) => rengCambiar({ sal: rengE.target.value })}>
              {RENG_SALES_SOLUBILIDAD.map((rengS) => (
                <option key={rengS.id} value={rengS.id}>
                  {rengS.nombre} ({rengS.formula})
                </option>
              ))}
            </select>
          </label>
          <p className="sm" data-ksp="">
            Ksp = {rengSalB.kspTexto}
            {rengSalB.pKspFuente === null ? '' : ` (pKsp ${String(rengSalB.pKspFuente).replace('.', ',')})`} · dato publicado a 25 °C
          </p>
          <p className="faint sm" data-ecuacion="">
            {rengSalB.solido} ⇌ {rengSalB.cation.nu === 1 ? '' : rengSalB.cation.nu} {rengFormulaM} + {rengSalB.anion.nu === 1 ? '' : rengSalB.anion.nu} {rengFormulaA} · Ksp = [{rengFormulaM}]{rengSalB.cation.nu === 1 ? '' : <sup>{rengSalB.cation.nu}</sup>}[{rengFormulaA}]{rengSalB.anion.nu === 1 ? '' : <sup>{rengSalB.anion.nu}</sup>}
          </p>
          <RengNumModelo escena="solubilidad" clave="cM" etiqueta={`Concentración de ${rengFormulaM} en disolución`} valor={rengB.cM} onChange={(rengV) => rengCambiar({ cM: rengV })} />
          <RengNumModelo escena="solubilidad" clave="cA" etiqueta={`Concentración de ${rengFormulaA} en disolución`} valor={rengB.cA} onChange={(rengV) => rengCambiar({ cA: rengV })} />
          <RengNumModelo escena="solubilidad" clave="sol0" etiqueta="Sólido presente (mol por litro de disolución)" valor={rengB.sol0} onChange={(rengV) => rengCambiar({ sol0: rengV })} />
          <p className="faint sm">Las concentraciones son las de los iones que ya hay (por ejemplo, tras mezclar disoluciones o por un ion común aportado por otra sal soluble). Con 0 mol/L de uno de ellos y sólido presente, se ve la solubilidad en agua o con un solo ion común.</p>
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
                <div role="radiogroup" aria-label="Q frente a Ksp" className="q-pred-fila">
                  <span>Con estas concentraciones, comparando Q con el Ksp…</span>
                  {(['disuelve', 'equilibrio', 'precipita'] as const).map((rengO) => (
                    <label key={rengO} className="q-opcion">
                      <input type="radio" name="q-sol-pred-q" checked={rengPred.q === rengO} onChange={() => rengSetPred((rengP) => ({ ...rengP, q: rengO }))} />
                      <span>{RENG_TEXTO_Q[rengO]}</span>
                    </label>
                  ))}
                </div>
                <div role="radiogroup" aria-label="Solubilidad con los iones presentes" className="q-pred-fila">
                  <span>La solubilidad de la sal con estos iones presentes, comparada con la del agua pura, es…</span>
                  {(['mayor', 'igual', 'menor'] as const).map((rengO) => (
                    <label key={rengO} className="q-opcion">
                      <input type="radio" name="q-sol-pred-s" checked={rengPred.s === rengO} onChange={() => rengSetPred((rengP) => ({ ...rengP, s: rengO }))} />
                      <span>{RENG_TEXTO_S[rengO]}</span>
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
          <RengAviso tipo="info">Elige la sal y las concentraciones de sus iones y pulsa «Calcular» (predecir antes es opcional): verás si Q supera al Ksp, cuánto precipita o se disuelve y cuánto baja la solubilidad por el ion común.</RengAviso>
        ) : rengValidacion && !rengValidacion.ok ? (
          <RengAviso tipo="aviso">
            <b>No se puede calcular.</b> {rengValidacion.diagnostico}
          </RengAviso>
        ) : rengR && rengSalA && rengCurva ? (
          <>
            <RengTarjeta titulo="Q frente a Ksp" acento>
              <RengNaturaleza tipo="calculo" />
              <RengResultado etiqueta={`Q = [${rengSalA.cation.formula}]${rengSalA.cation.nu === 1 ? '' : '²'}·[${rengSalA.anion.formula}]${rengSalA.anion.nu === 1 ? '' : '²'}`} valor={rengFmt(rengR.q, 3)} />
              <RengResultado etiqueta={`Ksp de ${rengSalA.formula} (dato publicado)`} valor={rengSalA.kspTexto} />
              <RengResultado etiqueta="Veredicto" valor={rengR.veredicto === 'precipita' ? 'Q > Ksp: precipita' : rengR.veredicto === 'equilibrio' ? 'Q = Ksp: equilibrio' : 'Q < Ksp: disuelve / no precipita'} />
              {rengR.veredicto === 'precipita' && (
                <>
                  <RengResultado etiqueta="Precipita" valor={`${rengFmt(rengR.precipitado, 3)} mol/L de ${rengSalA.formula}`} />
                  <RengResultado etiqueta={`[${rengSalA.cation.formula}] y [${rengSalA.anion.formula}] finales`} valor={`${rengFmt(rengR.cMFinal, 3)} · ${rengFmt(rengR.cAFinal, 3)} mol/L`} />
                  <RengResultado etiqueta="Q final (= Ksp)" valor={rengFmt(rengR.qFinal, 3)} />
                </>
              )}
              {rengR.veredicto === 'disuelve' && (
                <>
                  <RengResultado etiqueta="Se disuelve" valor={`${rengFmt(rengR.disuelto, 3)} mol/L de ${rengSalA.formula}`} />
                  <RengResultado etiqueta="Sólido que queda" valor={`${rengFmt(rengR.solidoFinal, 3)} mol/L`} />
                  <RengResultado etiqueta="Todavía admite disolver" valor={`${rengFmt(Math.max(0, rengR.s - rengR.disuelto), 3)} mol/L`} />
                </>
              )}
              <p className="sim-guia">Q se calcula con las concentraciones iniciales de los iones; si supera al Ksp la disolución está sobresaturada y la sal precipita hasta que Q = Ksp. El Ksp es un dato publicado a 25 °C con fuerza iónica cero; aquí se usa con concentraciones.</p>
            </RengTarjeta>
            <RengTarjeta titulo="Solubilidad molar y efecto de ion común" nota="Cuánta sal se disolvería en agua pura y con estos iones">
              <RengNaturaleza tipo="calculo" />
              <RengResultado etiqueta="En agua pura (s₀)" valor={`${rengFmt(rengR.s0, 3)} mol/L`} />
              <RengResultado etiqueta="Con los iones presentes (s)" valor={`${rengFmt(rengR.s, 3)} mol/L`} />
              <RengResultado etiqueta="s / s₀" valor={`${rengFmt(rengR.razon * 100, 3)} %`} />
              <RengGraficaXY
                descripcion={`Solubilidad molar de ${rengSalA.formula} frente a la concentración del ${rengCurva.ion === 'anion' ? 'anión' : 'catión'} común: baja desde ${rengFmt(rengR.s0, 3)} mol por litro en agua pura. Punto actual: ${rengFmt(rengR.s, 3)} mol por litro.`}
                tituloX={`concentración de ${rengCurva.ion === 'anion' ? rengSalA.anion.formula : rengSalA.cation.formula} (mol/L)`}
                tituloY="solubilidad molar (mol/L)"
                x={[0, rengCurva.max]}
                y={[0, rengR.s0 * 1.08]}
                series={[
                  { nombre: 'Solubilidad con el ion común', puntos: rengCurva.filas, color: 'var(--accent)' },
                  { nombre: 'Agua pura (s₀)', puntos: [[0, rengR.s0], [rengCurva.max, rengR.s0]], color: 'var(--text-3)', punteada: true }
                ]}
                marcas={[{ x: rengCurva.ion === 'anion' ? rengA.cA : rengA.cM, y: rengR.s, etiqueta: 'ahora' }]}
              />
              <p className="sim-guia">El ion común desplaza el equilibrio de disolución hacia el sólido: la sal se disuelve menos que en agua pura. La curva varía la concentración del {rengCurva.ion === 'anion' ? 'anión' : 'catión'} y mantiene fija la del otro ion.</p>
            </RengTarjeta>
            {rengPredHecha && (
              <RengTarjeta titulo="Tu predicción" nota="Comparada con el cálculo">
                <ul className="sm" data-prediccion-resultado="">
                  <li>
                    Q frente a Ksp: dijiste «{RENG_TEXTO_Q[rengPredHecha.q]}» → {rengPredHecha.q === rengR.veredicto ? 'correcto' : `no: ${RENG_TEXTO_Q[rengR.veredicto]}`} (Q = {rengFmt(rengR.q, 3)}, Ksp = {rengSalA.kspTexto}).
                  </li>
                  <li>
                    Solubilidad frente al agua pura: dijiste «{RENG_TEXTO_S[rengPredHecha.s]}» → {rengPredHecha.s === rengVerdadS ? 'correcto' : `no: es ${RENG_TEXTO_S[rengVerdadS as Exclude<RengPrediccionS, ''>]}`}
                    {rengVerdadS === 'menor' ? ': los iones presentes reducen la solubilidad (efecto de ion común).' : rengVerdadS === 'igual' ? ': sin iones previos no hay efecto de ion común.' : '.'}
                  </li>
                </ul>
              </RengTarjeta>
            )}
            <RengDiagnosticos escena="solubilidad" entradas={rengEntradasAplicadas} />
            <RengComparaCasos escena="solubilidad" entradas={rengEntradasAplicadas} />
            <RengSensibilidadPanel escena="solubilidad" entradas={rengEntradasAplicadas} />
            <RengGuardarEscena escena="solubilidad" entradas={rengEntradasAplicadas} nombre={`Solubilidad de ${rengSalA.formula}: ${rengR.veredicto === 'precipita' ? 'precipita' : rengR.veredicto === 'equilibrio' ? 'equilibrio' : 'no precipita'} (Q = ${rengFmt(rengR.q, 2)})`} anterior={rengReabierta?.id ?? null} advertencia={rengAdvertenciaPendiente(rengSucio, rengResumen)} />
          </>
        ) : null}
      </RengSalida>
    </div>
  )
}
