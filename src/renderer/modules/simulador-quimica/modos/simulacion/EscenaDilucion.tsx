import { useEffect, useMemo, useState } from 'react'
import { RengGuardarEnCuaderno } from '@/lib/cuaderno/GuardarEnCuaderno'
import { RENG_NOMBRE_MODO_DILUCION, RENG_SOLUCIONES_DILUCION, type RengModoDilucion } from '../../nucleo/dilucion'
import { rengCorridaEscena } from '../../practica/corridaEscena'
import { rengCalcularEscena, rengEntradasPorDefecto, rengValidarEntradasSim } from '../../practica/modelosSimulacion'
import { rengEntradasLegibles } from '../../practica/reglasEscena'
import { RengAviso, RengTarjeta } from '../../vista/ui'
import { RengAvisoReabierta, RengBotonCalcular, RengComparaCasos, RengDiagnosticos, RengFormulario, RengGuardarEscena, RengNaturaleza, RengNumMagnitud, RengResultado, RengSalida, RengSensibilidadPanel, rengAdvertenciaPendiente, rengFmt, useRengCalculo, useRengReapertura, type RengInicialEscena } from './comunes'

interface RengEstadoDilucion {
  c1: number
  Va: number
  Vf: number
  modo: RengModoDilucion
  Vdisp: number
  c2obj: number
}

type RengPrediccion = '' | 'mas' | 'igual' | 'menos'

const RENG_POR_DEFECTO: RengEstadoDilucion = { ...(rengEntradasPorDefecto('dilucion') as { c1: number; Va: number; Vf: number; modo: RengModoDilucion; Vdisp: number }), c2obj: 0 }

const rengDesde = (rengE: Readonly<Record<string, number | string>>): RengEstadoDilucion => ({
  c1: Number(rengE['c1'] ?? RENG_POR_DEFECTO.c1),
  Va: Number(rengE['Va'] ?? RENG_POR_DEFECTO.Va),
  Vf: Number(rengE['Vf'] ?? RENG_POR_DEFECTO.Vf),
  modo: Number(rengE['modo'] ?? 0) === 1 ? 1 : 0,
  Vdisp: Number(rengE['Vdisp'] ?? RENG_POR_DEFECTO.Vdisp),
  c2obj: Number(rengE['c2obj'] ?? 0)
})

const rengEntradas = (rengE: RengEstadoDilucion): Record<string, number> => ({ c1: rengE.c1, Va: rengE.Va, Vf: rengE.Vf, modo: rengE.modo, Vdisp: rengE.Vdisp, ...(rengE.c2obj > 0 ? { c2obj: rengE.c2obj } : {}) })

const RENG_PASOS = ['Disolución', 'Alícuota', 'Transferir', 'Completar', 'Resultado'] as const
const RENG_TEXTO_PRED = { mas: 'aumenta', igual: 'no cambia', menos: 'disminuye', '': '' } as const

const rengSolucionDe = (rengId: string): (typeof RENG_SOLUCIONES_DILUCION)[number] => RENG_SOLUCIONES_DILUCION.find((rengS) => rengS.id === rengId) ?? RENG_SOLUCIONES_DILUCION[0]!

interface RengDibujo {
  paso: number
  transferido: boolean
  b: RengEstadoDilucion
  color: string
  c2: number | null
}

function RengMesaDibujada({ paso: rengPaso, transferido: rengTransferido, b: rengB, color: rengColor, c2: rengC2 }: RengDibujo): React.JSX.Element {
  const rengFracOrigen = Math.max(0, Math.min(1, (rengB.Vdisp - (rengTransferido ? rengB.Va : 0)) / rengB.Vdisp))
  const rengFracPipeta = Math.max(0, Math.min(1, rengB.Va / rengB.Vdisp))
  const rengTotal = rengB.modo === 0 ? rengB.Vf : rengB.Va + rengB.Vf
  const rengDesborda = rengB.modo === 1 && rengTotal > rengB.Vf
  const rengCompleto = rengPaso >= 3
  const rengNivelMatraz = rengTransferido ? (rengCompleto ? rengTotal / rengB.Vf : Math.min(1, rengB.Va / rengB.Vf)) : 0
  const rengYMarca = 82
  const rengYFondo = 212
  const rengYLiquido = rengNivelMatraz <= 1 ? rengYFondo - rengNivelMatraz * (rengYFondo - rengYMarca) : Math.max(36, rengYMarca - (rengNivelMatraz - 1) * 120)
  const rengConcMatraz = rengTransferido ? (rengCompleto && rengC2 !== null ? rengC2 : rengB.c1) : rengB.c1
  const rengOpacidad = Math.max(0.12, Math.min(0.95, 0.95 * (rengConcMatraz / rengB.c1)))
  const rengXPipeta = rengTransferido ? 380 : 75
  const rengYPipeta = rengTransferido ? -34 : 0
  const rengAlturaLiquidoOrigen = 120 * rengFracOrigen
  return (
    <svg className="q-mesa-svg" viewBox="0 0 480 240" role="img" aria-hidden="true" focusable="false">
      <title>Mesa de dilución: recipiente inicial, pipeta y matraz aforado</title>
      <path d="M30 80 L30 212 Q30 220 38 220 L112 220 Q120 220 120 212 L120 80" fill="none" stroke="var(--text-2)" strokeWidth="2.5" />
      <rect x="32" y={212 - rengAlturaLiquidoOrigen} width="86" height={rengAlturaLiquidoOrigen} fill={rengColor} fillOpacity="0.95" />
      <text x="75" y="236" textAnchor="middle" className="q-mesa-texto">
        recipiente inicial
      </text>
      <g transform={`translate(${rengXPipeta - 75} ${rengYPipeta})`} style={{ transition: 'transform var(--mov-normal, 0.2s)' }}>
        <path d="M75 20 L75 60 M75 60 L75 188 L71 196 L79 196 L75 188" fill="none" stroke="var(--text)" strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="71" y={188 - 128 * rengFracPipeta * (rengTransferido ? 0 : 1)} width="8" height={128 * rengFracPipeta * (rengTransferido ? 0 : 1)} fill={rengColor} fillOpacity="0.95" />
        <ellipse cx="75" cy="14" rx="9" ry="12" fill="none" stroke="var(--text)" strokeWidth="2.2" />
        <line x1="66" y1="96" x2="84" y2="96" stroke="var(--danger)" strokeWidth="2" />
      </g>
      <path d="M368 62 L368 118 Q326 128 326 168 Q326 218 378 218 Q430 218 430 168 Q430 128 392 118 L392 62" fill="none" stroke="var(--text-2)" strokeWidth="2.5" />
      <line x1="362" y1={rengYMarca} x2="398" y2={rengYMarca} stroke="var(--danger)" strokeWidth="2.5" />
      <text x="406" y={rengYMarca + 4} className="q-mesa-texto">
        aforo
      </text>
      {rengNivelMatraz > 0 && (
        <clipPath id="q-clip-matraz">
          <path d="M370 62 L370 118 Q328 128 328 168 Q328 216 378 216 Q428 216 428 168 Q428 128 390 118 L390 62 Z" />
        </clipPath>
      )}
      {rengNivelMatraz > 0 && <rect x="326" y={rengYLiquido} width="104" height={rengYFondo + 10 - rengYLiquido} fill={rengColor} fillOpacity={rengOpacidad} clipPath="url(#q-clip-matraz)" />}
      {rengDesborda && rengCompleto && <line x1="350" y1={rengYLiquido} x2="406" y2={rengYLiquido} stroke="var(--danger)" strokeWidth="2" strokeDasharray="4 3" />}
      <text x="378" y="236" textAnchor="middle" className="q-mesa-texto">
        matraz aforado
      </text>
    </svg>
  )
}

export default function RengEscenaDilucion({ inicial: rengInicial }: { inicial?: RengInicialEscena | null }): React.JSX.Element {
  const { borrador: rengB, aplicado: rengA, sucio: rengSucio, cambiar: rengCambiarCrudo, calcular: rengCalcular, reemplazar: rengReemplazar } = useRengCalculo<RengEstadoDilucion>(RENG_POR_DEFECTO, null, rengDesde)
  const [rengPaso, rengSetPaso] = useState(0)
  const [rengSolucion, rengSetSolucion] = useState(RENG_SOLUCIONES_DILUCION[0]!.id)
  const [rengTransferido, rengSetTransferido] = useState(false)
  const [rengEditado, rengSetEditado] = useState(false)
  const [rengPred, rengSetPred] = useState<{ moles: RengPrediccion; conc: RengPrediccion }>({ moles: '', conc: '' })
  const [rengQuierePredecir, rengSetQuierePredecir] = useState(false)
  const [rengPredHecha, rengSetPredHecha] = useState<{ moles: RengPrediccion; conc: RengPrediccion } | null>(null)
  const [rengPendiente, rengSetPendiente] = useState<RengInicialEscena | null>(null)
  const [rengAbrirGuardadoPendiente, rengSetAbrirGuardadoPendiente] = useState(0)

  const rengCambiar = (rengP: Partial<RengEstadoDilucion>): void => {
    rengSetEditado(true)
    rengCambiarCrudo(rengP)
  }
  const rengReiniciarPasos = (rengPasoNuevo: number): void => {
    rengSetPaso(rengPasoNuevo)
    rengSetTransferido(false)
    rengSetPred({ moles: '', conc: '' })
    rengSetPredHecha(null)
    rengSetEditado(false)
  }
  const rengCargarEntradas = (rengE: Readonly<Record<string, number | string>>, rengPasoNuevo: number, rengAplicar: boolean): void => {
    const rengEstado = rengDesde(rengE)
    rengReemplazar(rengEstado, rengAplicar)
    const rengCoincide = RENG_SOLUCIONES_DILUCION.find((rengS) => rengS.concentracion === rengEstado.c1)
    if (rengCoincide) rengSetSolucion(rengCoincide.id)
    rengReiniciarPasos(rengPasoNuevo)
    if (rengAplicar) rengSetTransferido(true)
  }
  const [rengReabierta, rengOlvidar] = useRengReapertura('dilucion', (rengE) => rengCargarEntradas(rengE, 4, true))

  useEffect(() => {
    if (!rengInicial) return
    if (rengEditado) rengSetPendiente(rengInicial)
    else {
      rengCargarEntradas(rengInicial.entradas, 1, false)
      rengOlvidar()
    }
  }, [rengInicial?.n])

  const rengReemplazarPendiente = (): void => {
    if (!rengPendiente) return
    rengCargarEntradas(rengPendiente.entradas, 1, false)
    rengOlvidar()
    rengSetPendiente(null)
    rengSetAbrirGuardadoPendiente(0)
  }

  const rengEntradasBorrador = useMemo(() => rengEntradas(rengB), [rengB])
  const rengValidacion = useMemo(() => rengValidarEntradasSim('dilucion', rengEntradasBorrador), [rengEntradasBorrador])
  const rengEntradasAplicadas = useMemo(() => (rengA ? rengEntradas(rengA) : null), [rengA])
  const rengResultado = useMemo(() => (rengEntradasAplicadas && rengValidarEntradasSim('dilucion', rengEntradasAplicadas).ok ? rengCalcularEscena('dilucion', rengEntradasAplicadas) : null), [rengEntradasAplicadas])
  const rengResumen = rengEntradasAplicadas ? rengEntradasLegibles('dilucion', rengEntradasAplicadas) : null
  const rengSol = rengSolucionDe(rengSolucion)
  const rengMolesAlicuota = (rengB.c1 * rengB.Va) / 1000
  const rengValido = rengValidacion.ok
  const rengTotalBorrador = rengB.modo === 0 ? rengB.Vf : rengB.Va + rengB.Vf

  const rengEvaluar = (): void => {
    rengCalcular()
    rengSetPredHecha(rengPred)
    rengSetPaso(4)
  }
  const rengVerSinPredecir = (): void => {
    rengCalcular()
    rengSetPredHecha({ moles: '', conc: '' })
    rengSetPaso(4)
  }

  const rengVerdadMoles: RengPrediccion = 'igual'
  const rengVerdadConc: RengPrediccion = rengResultado ? (rengResultado['F']! > 1 + 1e-12 ? 'menos' : rengResultado['F']! < 1 - 1e-12 ? 'mas' : 'igual') : ''

  return (
    <div className="q-dilucion">
      {rengPendiente && (
        <div className="notice warn q-dialogo" role="alertdialog" aria-labelledby="q-dil-pend-t" data-sustituir="">
          <h3 id="q-dil-pend-t">Tu montaje tiene cambios sin guardar</h3>
          <p className="sm">
            Vas a cargar otros datos en esta mesa. Montaje actual: {rengEntradasLegibles('dilucion', rengEntradasBorrador).join(' · ')}. ¿Qué hacemos con él?
          </p>
          <div className="row">
            <button type="button" className="btn primary sm" onClick={() => rengSetAbrirGuardadoPendiente((rengN) => rengN + 1)}>
              Guardar mi montaje y reemplazar
            </button>
            <button type="button" className="btn sm" onClick={rengReemplazarPendiente}>
              Descartar mi montaje y reemplazar
            </button>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => {
                rengSetPendiente(null)
                rengSetAbrirGuardadoPendiente(0)
              }}
            >
              Cancelar y conservar mi montaje
            </button>
          </div>
          {rengAbrirGuardadoPendiente > 0 && <RengGuardarEnCuaderno abrir={rengAbrirGuardadoPendiente} calcular={() => rengCorridaEscena('dilucion', rengEntradasBorrador)} nombreSugerido={`Dilución (montaje previo): ${rengSol.soluto} ${rengFmt(rengB.c1)} mol/L`} alGuardar={rengReemplazarPendiente} />}
        </div>
      )}
      <RengFormulario>
        <RengTarjeta titulo="Mesa de dilución" nota="Recipiente inicial → pipeta → matraz aforado">
          <ol className="q-dil-pasos" aria-label="Pasos de la dilución">
            {RENG_PASOS.map((rengN, rengI) => (
              <li key={rengN}>
                <button type="button" className="btn sm" aria-current={rengPaso === rengI ? 'step' : undefined} onClick={() => rengSetPaso(rengI)}>
                  {rengI + 1}. {rengN}
                </button>
              </li>
            ))}
          </ol>
          <RengMesaDibujada paso={rengPaso} transferido={rengTransferido} b={rengB} color={rengSol.color} c2={rengResultado ? rengResultado['c2']! : null} />
          <dl className="q-mesa-datos" aria-label="Qué hay en cada recipiente">
            <div>
              <dt>Recipiente inicial</dt>
              <dd>
                {rengFmt(rengB.Vdisp - (rengTransferido ? rengB.Va : 0), 4)} mL de {rengSol.soluto}(aq) {rengFmt(rengB.c1)} mol/L
              </dd>
            </div>
            <div>
              <dt>Volumen transferido (pipeta)</dt>
              <dd data-volumen="transferido">{rengPaso >= 1 ? `${rengFmt(rengB.Va, 4)} mL · ${rengFmt(rengMolesAlicuota * 1000, 4)} mmol de soluto` : 'todavía no se mide'}</dd>
            </div>
            <div>
              <dt>Volumen final (matraz aforado)</dt>
              <dd data-volumen="final">{rengPaso >= 3 ? `${rengFmt(rengTotalBorrador, 4)} mL${rengB.modo === 1 ? ` (alícuota + disolvente; supera la marca de ${rengFmt(rengB.Vf)} mL)` : ' (hasta la marca de aforo)'}` : `matraz de ${rengFmt(rengB.Vf)} mL`}</dd>
            </div>
          </dl>

          {rengPaso === 0 && (
            <fieldset className="q-paso">
              <legend>1 · Elige la disolución del recipiente inicial</legend>
              <label className="sim-campo">
                <span>Disolución</span>
                <select
                  className="input"
                  value={rengSolucion}
                  onChange={(rengE) => {
                    const rengS = rengSolucionDe(rengE.target.value)
                    rengSetSolucion(rengS.id)
                    rengCambiar({ c1: rengS.concentracion })
                  }}
                >
                  {RENG_SOLUCIONES_DILUCION.map((rengS) => (
                    <option key={rengS.id} value={rengS.id}>
                      {rengS.nombre} · {rengFmt(rengS.concentracion)} mol/L
                    </option>
                  ))}
                </select>
              </label>
              <RengNumMagnitud escena="dilucion" clave="c1" magnitud="concentracion" valor={rengB.c1} onChange={(rengV) => rengCambiar({ c1: rengV })} />
              <RengNumMagnitud escena="dilucion" clave="Vdisp" magnitud="volumen" valor={rengB.Vdisp} onChange={(rengV) => rengCambiar({ Vdisp: rengV })} />
              <p className="faint sm">Escribe valores con unidad si quieres: «0,200 M», «200 mmol/L», «0,25 L». Las unidades de otra magnitud (por ejemplo «20 g») no se aceptan.</p>
              <button type="button" className="btn primary sm" onClick={() => rengSetPaso(1)}>
                Siguiente: medir la alícuota
              </button>
            </fieldset>
          )}

          {rengPaso === 1 && (
            <fieldset className="q-paso">
              <legend>2 · Mide la alícuota con la pipeta</legend>
              <RengNumMagnitud escena="dilucion" clave="Va" magnitud="volumen" valor={rengB.Va} onChange={(rengV) => rengCambiar({ Va: rengV })} />
              <p className="sm">
                Mides <b>{rengFmt(rengB.Va, 4)} mL</b> de disolución {rengFmt(rengB.c1)} mol/L: contienen <b>{rengFmt(rengMolesAlicuota, 4)} mol</b> de soluto (n = c₁·V).
              </p>
              {!rengValido && <RengAviso tipo="aviso">{rengValidacion.diagnostico}</RengAviso>}
              <button type="button" className="btn primary sm" disabled={!rengValido} onClick={() => rengSetPaso(2)}>
                Siguiente: transferir
              </button>
            </fieldset>
          )}

          {rengPaso === 2 && (
            <fieldset className="q-paso">
              <legend>3 · Transfiere la alícuota al matraz</legend>
              {!rengValido && <RengAviso tipo="aviso">{rengValidacion.diagnostico}</RengAviso>}
              <button type="button" className="btn primary sm" disabled={!rengValido || rengTransferido} onClick={() => rengSetTransferido(true)}>
                {rengTransferido ? 'Alícuota transferida' : 'Transferir la alícuota al matraz'}
              </button>
              {rengTransferido && (
                <p className="sm" role="status">
                  Pasan <b>{rengFmt(rengB.Va, 4)} mL</b> al matraz con <b>{rengFmt(rengMolesAlicuota, 4)} mol</b> de soluto. En el recipiente inicial quedan {rengFmt(rengB.Vdisp - rengB.Va, 4)} mL.
                </p>
              )}
              <button type="button" className="btn sm" disabled={!rengTransferido} onClick={() => rengSetPaso(3)}>
                Siguiente: completar con disolvente
              </button>
            </fieldset>
          )}

          {rengPaso === 3 && (
            <fieldset className="q-paso">
              <legend>4 · Completa con disolvente</legend>
              <div role="radiogroup" aria-label="Cómo se completa el matraz" className="stack tight">
                {([0, 1] as const).map((rengM) => (
                  <label key={rengM} className="q-opcion">
                    <input type="radio" name="q-dil-modo" checked={rengB.modo === rengM} onChange={() => rengCambiar({ modo: rengM })} />
                    <span>{RENG_NOMBRE_MODO_DILUCION[rengM]}</span>
                  </label>
                ))}
              </div>
              <RengNumMagnitud escena="dilucion" clave="Vf" magnitud="volumen" etiqueta="Volumen del matraz aforado (marca de aforo)" valor={rengB.Vf} onChange={(rengV) => rengCambiar({ Vf: rengV })} />
              <label className="q-opcion">
                <input type="checkbox" checked={rengB.c2obj > 0} onChange={(rengE) => rengCambiar({ c2obj: rengE.target.checked ? Number((rengB.c1 / 4).toPrecision(3)) : 0 })} />
                <span>Quiero preparar una concentración objetivo</span>
              </label>
              {rengB.c2obj > 0 && <RengNumMagnitud escena="dilucion" clave="c2obj" magnitud="concentracion" valor={rengB.c2obj} onChange={(rengV) => rengCambiar({ c2obj: rengV })} />}
              {rengValido ? (
                <p className="sm" role="status">
                  Disolvente que añades: <b>{rengFmt(rengB.modo === 0 ? rengB.Vf - rengB.Va : rengB.Vf, 4)} mL</b> · volumen total <b>{rengFmt(rengTotalBorrador, 4)} mL</b>.
                </p>
              ) : (
                <RengAviso tipo="aviso">{rengValidacion.diagnostico}</RengAviso>
              )}
              <label className="q-opcion" data-prediccion-opcional="">
                <input type="checkbox" checked={rengQuierePredecir} onChange={(rengE) => rengSetQuierePredecir(rengE.target.checked)} />
                <span>Quiero predecir antes de ver el resultado (opcional)</span>
              </label>
              {rengQuierePredecir && (
              <fieldset className="q-prediccion" data-prediccion="">
                <legend>Antes de ver el resultado, ¿qué crees que pasa?</legend>
                {(
                  [
                    ['moles', 'Los moles de soluto en el matraz, comparados con los de la alícuota…'],
                    ['conc', 'La concentración, comparada con la de la disolución inicial…']
                  ] as const
                ).map(([rengK, rengTitulo]) => (
                  <div key={rengK} role="radiogroup" aria-label={rengTitulo} className="q-pred-fila">
                    <span>{rengTitulo}</span>
                    {(['mas', 'igual', 'menos'] as const).map((rengO) => (
                      <label key={rengO} className="q-opcion">
                        <input type="radio" name={`q-dil-pred-${rengK}`} checked={rengPred[rengK] === rengO} onChange={() => rengSetPred((rengP) => ({ ...rengP, [rengK]: rengO }))} />
                        <span>{RENG_TEXTO_PRED[rengO]}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </fieldset>
              )}
              <div className="row">
                <button type="button" className="btn primary sm" disabled={!rengValido || (rengQuierePredecir && (!rengPred.moles || !rengPred.conc))} onClick={rengQuierePredecir ? rengEvaluar : rengVerSinPredecir}>
                  Ver el resultado
                </button>
              </div>
            </fieldset>
          )}

          {rengPaso === 4 && (
            <fieldset className="q-paso">
              <legend>5 · Resultado</legend>
              <RengBotonCalcular aplicado={rengA !== null} sucio={rengSucio} onCalcular={() => { rengCalcular(); rengSetPredHecha((rengP) => rengP ?? { moles: '', conc: '' }) }} />
            </fieldset>
          )}
        </RengTarjeta>
      </RengFormulario>

      <RengSalida sucio={rengSucio} resumen={rengResumen}>
        <RengAvisoReabierta reabierta={rengReabierta} />
        {!rengA || !rengResultado ? (
          <RengAviso tipo="info">Recorre los cinco pasos de la mesa: disolución, alícuota, transferencia, aforo y predicción. El resultado aparece al pulsar «Ver el resultado».</RengAviso>
        ) : (
          <>
            <RengTarjeta titulo="Resultado de la dilución" acento>
              <RengNaturaleza tipo="calculo" />
              <RengResultado etiqueta="Moles de soluto transferidos" valor={`${rengFmt(rengResultado['n']!, 4)} mol`} />
              <RengResultado etiqueta="Moles de soluto en el matraz" valor={`${rengFmt(rengResultado['n']!, 4)} mol (se conservan)`} />
              <RengResultado etiqueta="Concentración final" valor={`${rengFmt(rengResultado['c2']!, 4)} mol/L`} />
              <RengResultado etiqueta="Factor de dilución" valor={`× ${rengFmt(rengResultado['F']!, 4)}`} />
              <RengResultado etiqueta="Disolvente añadido" valor={`${rengFmt(rengResultado['Vdis']!, 4)} mL`} />
              <RengResultado etiqueta="Volumen transferido · volumen final" valor={`${rengFmt(rengA.Va, 4)} mL · ${rengFmt(rengResultado['Vtotal']!, 4)} mL`} />
              {rengResultado['desv'] !== undefined && <RengResultado etiqueta="Desviación respecto del objetivo" valor={`${rengFmt(rengResultado['desv'], 3)} %`} />}
              {rengResultado['desv'] !== undefined && (
                <RengAviso tipo={Math.abs(rengResultado['desv']) < 1 ? 'ok' : 'info'}>
                  {Math.abs(rengResultado['desv']) < 1
                    ? `Alcanzas el objetivo de ${rengFmt(rengA.c2obj)} mol/L (desviación ${rengFmt(Math.abs(rengResultado['desv']), 2)} %).`
                    : `La concentración obtenida (${rengFmt(rengResultado['c2']!)} mol/L) se desvía ${rengFmt(Math.abs(rengResultado['desv']), 2)} % del objetivo (${rengFmt(rengA.c2obj)} mol/L). Ajusta la alícuota o el volumen final.`}
                </RengAviso>
              )}
              <p className="sim-guia">
                La cantidad de soluto no cambia al diluir (c₁V₁ = c₂V₂ en el aforo); cambia el volumen en el que está disuelta, así que la concentración baja en el mismo factor que sube el volumen.
              </p>
            </RengTarjeta>
            {rengPredHecha && (rengPredHecha.moles !== '' || rengPredHecha.conc !== '') && (
              <RengTarjeta titulo="Tu predicción" nota="Comparada con el cálculo">
                <ul className="sm" data-prediccion-resultado="">
                  <li>
                    Moles de soluto: dijiste que «{RENG_TEXTO_PRED[rengPredHecha.moles]}» → {rengPredHecha.moles === rengVerdadMoles ? 'correcto: se conservan, solo se reparten en más volumen' : 'no: los moles se conservan (no se pierde ni se gana soluto al añadir disolvente)'}.
                  </li>
                  <li>
                    Concentración: dijiste que «{RENG_TEXTO_PRED[rengPredHecha.conc]}» → {rengPredHecha.conc === rengVerdadConc ? 'correcto' : 'no'}: {rengVerdadConc === 'menos' ? 'disminuye porque el mismo soluto ocupa un volumen mayor' : rengVerdadConc === 'igual' ? 'no cambia porque el volumen final coincide con la alícuota' : 'aumenta'}.
                  </li>
                </ul>
              </RengTarjeta>
            )}
            <RengDiagnosticos escena="dilucion" entradas={rengEntradasAplicadas} />
            <RengComparaCasos escena="dilucion" entradas={rengEntradasAplicadas} />
            <RengSensibilidadPanel escena="dilucion" entradas={rengEntradasAplicadas} />
            <RengGuardarEscena escena="dilucion" entradas={rengEntradasAplicadas} nombre={`Dilución: ${rengSol.soluto} ${rengFmt(rengA.c1)} → ${rengFmt(rengResultado['c2']!)} mol/L`} anterior={rengReabierta?.id ?? null} advertencia={rengAdvertenciaPendiente(rengSucio, rengResumen)} />
          </>
        )}
      </RengSalida>
    </div>
  )
}
