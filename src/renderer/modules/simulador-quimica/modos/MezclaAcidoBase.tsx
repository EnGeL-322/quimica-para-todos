import { useEffect, useMemo, useState } from 'react'
import { RengGuardarEnCuaderno } from '@/lib/cuaderno/GuardarEnCuaderno'
import { rengCorridaValoracion } from '../corrida'
import {
  rengCurvaMezclaAcidoBase,
  RENG_KA_ACETICO_MEZCLA,
  RENG_LIMITES_MEZCLA_ACIDO_BASE,
  RENG_PKW_MEZCLA,
  rengResolverMezclaAcidoBase,
  RENG_TEMPERATURA_MEZCLA_C,
  type RengEntradaMezclaAcidoBase
} from '../nucleo/mezclaAcidoBase'
import { rengEntradasLegibles, rengRegionValoracion, rengVerificarBalancesMezcla } from '../practica/reglasEscena'
import { RengExportarMezclaAcidoBase } from '../vista/ExportarMezclaAcidoBase'
import { RengGraficaXY, type RengMarcaXY, type RengSerieXY } from '../vista/GraficaXY'
import { RengAviso, RengTarjeta } from '../vista/ui'
import { RengAvisoReabierta, RengBotonCalcular, RengComparaCasos, RengDiagnosticos, RengFormulario, RengNaturaleza, RengNumModelo, RengSalida, RengSensibilidadPanel, rengAdvertenciaPendiente, useRengCalculo, useRengReapertura, type RengInicialEscena } from './simulacion/comunes'

const { concentracionMax: rengConcentracionMax } = RENG_LIMITES_MEZCLA_ACIDO_BASE

const rengDecimal = new Intl.NumberFormat('es', { maximumSignificantDigits: 4 })
const rengCientifico = new Intl.NumberFormat('es', { notation: 'scientific', maximumSignificantDigits: 4 })
const rengFormatoPH = new Intl.NumberFormat('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const rengMagnitud = (rengV: number): string => (rengV !== 0 && Math.abs(rengV) < 1e-3 ? rengCientifico : rengDecimal).format(rengV)

interface RengEstadoMezcla {
  acido: RengEntradaMezclaAcidoBase['acido']
  cAcido: number
  VAcido: number
  cBase: number
  VBase: number
}

const RENG_POR_DEFECTO: RengEstadoMezcla = { acido: 'acetico', cAcido: 0.01, VAcido: 25, cBase: 0.01, VBase: 12.5 }

const rengDesde = (rengE: Readonly<Record<string, number | string>>): RengEstadoMezcla => ({
  acido: rengE['acido'] === 'hcl' ? 'hcl' : 'acetico',
  cAcido: Number(rengE['cAcido'] ?? RENG_POR_DEFECTO.cAcido),
  VAcido: Number(rengE['VAcido'] ?? RENG_POR_DEFECTO.VAcido),
  cBase: Number(rengE['cBase'] ?? RENG_POR_DEFECTO.cBase),
  VBase: Number(rengE['VBase'] ?? RENG_POR_DEFECTO.VBase)
})

const rengEntrada = (rengE: RengEstadoMezcla): RengEntradaMezclaAcidoBase => ({ acido: rengE.acido, concentracionAcido: rengE.cAcido, volumenAcidoMl: rengE.VAcido, concentracionBase: rengE.cBase, volumenBaseMl: rengE.VBase })

export function RengMezclaAcidoBase({ inicial: rengInicial }: { inicial?: RengInicialEscena | null } = {}): React.JSX.Element {
  const { borrador: rengB, aplicado: rengA, sucio: rengSucio, cambiar: rengCambiar, calcular: rengCalcular, reemplazar: rengReemplazar } = useRengCalculo<RengEstadoMezcla>(RENG_POR_DEFECTO, rengInicial, rengDesde)
  const [rengReabierta, rengOlvidar] = useRengReapertura('mezcla', (rengE) => rengReemplazar(rengDesde(rengE), true))
  useEffect(() => {
    if (rengInicial) rengOlvidar()
  }, [rengInicial?.n])

  const rengEntradasAplicadas = useMemo(() => (rengA ? { ...rengA } : null), [rengA])
  const rengCalculo = useMemo(() => {
    if (!rengA) return null
    const rengE = rengEntrada(rengA)
    try {
      return { tipo: 'ok' as const, entrada: rengE, resultado: rengResolverMezclaAcidoBase(rengE), curva: rengCurvaMezclaAcidoBase(rengE) }
    } catch (rengError) {
      if (!(rengError instanceof RangeError)) throw rengError
      return { tipo: 'error' as const, motivo: rengError.message }
    }
  }, [rengA])
  const rengResumen = rengEntradasAplicadas ? rengEntradasLegibles('mezcla', rengEntradasAplicadas) : null
  const rengAdvertencia = rengAdvertenciaPendiente(rengSucio, rengResumen)

  return (
    <div className="q-escena">
      <RengFormulario>
        <RengTarjeta titulo="Datos de entrada" nota={`Disoluciones acuosas a ${RENG_TEMPERATURA_MEZCLA_C} °C`}>
          <label className="sim-campo">
            <span>Ácido</span>
            <select className="input" value={rengB.acido} onChange={(rengE) => rengCambiar({ acido: rengE.target.value === 'hcl' ? 'hcl' : 'acetico' })}>
              <option value="acetico">Ácido acético (CH₃COOH)</option>
              <option value="hcl">Ácido clorhídrico (HCl)</option>
            </select>
          </label>
          <div className="sim-fila">
            <RengNumModelo escena="mezcla" clave="cAcido" valor={rengB.cAcido} onChange={(rengV) => rengCambiar({ cAcido: rengV })} />
            <RengNumModelo escena="mezcla" clave="VAcido" valor={rengB.VAcido} onChange={(rengV) => rengCambiar({ VAcido: rengV })} />
          </div>
          <div className="sim-fila">
            <RengNumModelo escena="mezcla" clave="cBase" valor={rengB.cBase} onChange={(rengV) => rengCambiar({ cBase: rengV })} />
            <RengNumModelo escena="mezcla" clave="VBase" etiqueta="Volumen de disolución básica añadido" valor={rengB.VBase} onChange={(rengV) => rengCambiar({ VBase: rengV })} />
          </div>
          <p className="sim-guia">Usa hasta {rengMagnitud(rengConcentracionMax)} mol/L en cada disolución inicial. Con 0 mL de base se calcula el ácido solo. NaOH a 0 mol/L equivale a añadir agua.</p>
          <RengBotonCalcular aplicado={rengA !== null} sucio={rengSucio} onCalcular={rengCalcular} />
        </RengTarjeta>
      </RengFormulario>
      <RengSalida sucio={rengSucio} resumen={rengResumen}>
        <RengAvisoReabierta reabierta={rengReabierta} />
        {!rengCalculo && <RengAviso tipo="info">Configura el ácido y las dos disoluciones y pulsa «Calcular»: verás el pH, las especies disueltas y la curva al añadir NaOH.</RengAviso>}
        {rengCalculo?.tipo === 'error' && <RengAviso tipo="aviso">Diagnóstico: {rengCalculo.motivo}</RengAviso>}
        {rengCalculo?.tipo === 'ok' && <RengResultadosMezcla entrada={rengCalculo.entrada} resultado={rengCalculo.resultado} curva={rengCalculo.curva} anterior={rengReabierta?.id ?? null} advertencia={rengAdvertencia} />}
        {rengCalculo?.tipo === 'ok' && (
          <>
            <RengDiagnosticos escena="mezcla" entradas={rengEntradasAplicadas} />
            <RengComparaCasos escena="mezcla" entradas={rengEntradasAplicadas} />
            <RengSensibilidadPanel escena="mezcla" entradas={rengEntradasAplicadas} />
          </>
        )}
        <RengTarjeta titulo="Modelo y fuentes" nota="Equilibrio ideal aproximado">
          <p className="sim-guia">El modelo suma los volúmenes y supone disociación completa de HCl y NaOH. Aproxima actividades mediante concentraciones y mantiene 25 °C, sin intercambio de CO₂. Las constantes termodinámicas se usan en escala molar bajo la aproximación de agua diluida.</p>
          <ul className="sim-formulas sim-fuentes">
            <li>
              pK<sub>w</sub> = {rengMagnitud(RENG_PKW_MEZCLA)}. IAPWS R11-24, tabla 3, agua a 25 °C y 0,1 MPa. <RengNaturaleza tipo="publicado" />
            </li>
            <li>
              K<sub>a</sub> del ácido acético = {rengMagnitud(RENG_KA_ACETICO_MEZCLA)}. Harned y Ehlers (1933), tabla II, dato a 25 °C. DOI 10.1021/ja01329a027. <RengNaturaleza tipo="publicado" />
            </li>
          </ul>
        </RengTarjeta>
      </RengSalida>
    </div>
  )
}

function RengResultadosMezcla({ entrada: rengEntrada, resultado: rengResultado, curva: rengCurva, anterior: rengAnterior, advertencia: rengAdvertencia }: {
  anterior: string | null
  advertencia: string | null
  entrada: RengEntradaMezclaAcidoBase
  resultado: ReturnType<typeof rengResolverMezclaAcidoBase>
  curva: ReturnType<typeof rengCurvaMezclaAcidoBase>
}): React.JSX.Element {
  const { pH: rengPH, volumenTotalMl: rengVolumenTotalMl, especies: rengEspecies, volumenEquivalenciaMl: rengVolumenEquivalenciaMl, molesAcido: rengMolesAcido, molesBase: rengMolesBase, fuerzaIonica: rengFuerzaIonica, residuoCarga: rengResiduoCarga, residuoAcido: rengResiduoAcido } = rengResultado
  const rengVolumenActual = rengEntrada.volumenBaseMl
  const rengPuntos: Array<[number, number]> = rengCurva.map((rengP) => [rengP.volumenBaseMl, rengP.pH])
  const rengSeries: RengSerieXY[] = [{ nombre: 'Hasta la mezcla actual', puntos: rengPuntos.filter(([rengV]) => rengV <= rengVolumenActual), color: 'var(--accent)' }]
  if (rengPuntos.at(-1)![0] > rengVolumenActual) {
    rengSeries.push({ nombre: 'Si añades más disolución', puntos: rengPuntos.filter(([rengV]) => rengV >= rengVolumenActual), color: 'var(--text-2)', punteada: true })
  }
  const rengPuntoEquivalencia = rengPuntos.find(([rengV]) => rengV === rengVolumenEquivalenciaMl)
  const rengMarcas: RengMarcaXY[] = [{ x: rengVolumenActual, y: rengPH }]
  if (rengPuntoEquivalencia && rengVolumenActual !== rengPuntoEquivalencia[0]) {
    rengMarcas.push({ x: rengPuntoEquivalencia[0], y: rengPuntoEquivalencia[1], etiqueta: 'Equivalencia' })
  }
  const rengEquivalencia = rengVolumenEquivalenciaMl === null ? 'Sin equivalencia con estas concentraciones'
    : rengPuntoEquivalencia ? `${rengMagnitud(rengPuntoEquivalencia[0])} mL · pH ≈ ${rengFormatoPH.format(rengPuntoEquivalencia[1])}`
    : 'Fuera del intervalo de volúmenes del modelo'
  const rengClorhidrico = rengEntrada.acido === 'hcl'
  const rengAnion = rengClorhidrico ? 'Cl⁻' : 'CH₃COO⁻'
  const rengRegion = rengResultado.molesAcido > 0 ? rengRegionValoracion(rengResultado.molesAcido, rengResultado.molesBase) : null
  const rengBalances = rengVerificarBalancesMezcla(rengResultado, rengEntrada.acido)

  return (
    <>
      <RengTarjeta titulo="Equilibrio de la mezcla" acento>
        <RengNaturaleza tipo="calculo" />
        <div className="sim-res" aria-live="polite"><small>pH estimado</small><b>{rengFormatoPH.format(rengPH)}</b></div>
        <div className="sim-res"><small>Volumen total</small><b>{rengMagnitud(rengVolumenTotalMl)} mL</b></div>
        <table className="table tabla-datos" aria-label="Especies disueltas en equilibrio">
          <thead><tr><th scope="col">Especie</th><th scope="col">Carga</th><th scope="col">Concentración (mol/L)</th></tr></thead>
          <tbody>{rengEspecies.map((rengE) => (
            <tr key={rengE.formula}><th scope="row">{rengE.formula}</th><td>{rengE.carga > 0 ? '+1' : rengE.carga}</td><td>{rengMagnitud(rengE.concentracion)}</td></tr>
          ))}</tbody>
        </table>
        <p className="sim-guia">{rengClorhidrico ? 'H₃O⁺ + OH⁻ → 2 H₂O' : 'CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O'}</p>
        <p className="sim-guia">
          {rengClorhidrico ? 'Ácido fuerte con base fuerte: en la equivalencia el pH es 7 (pKw/2).' : 'Ácido débil con base fuerte: en la equivalencia queda CH₃COO⁻ y el pH es mayor que 7.'}
          {rengRegion ? ` ${rengRegion.texto}` : ' Sin ácido: solo hay NaOH diluido.'}
        </p>
      </RengTarjeta>
      <RengTarjeta titulo="Curva al añadir disolución básica">
        <RengGraficaXY
          descripcion={`Curva de pH frente al volumen añadido. Punto actual en ${rengMagnitud(rengVolumenActual)} mL, pH ${rengFormatoPH.format(rengPH)}. Equivalencia. ${rengEquivalencia}.`}
          tituloX="Volumen añadido (mL)"
          tituloY="pH"
          y={[0, 14]}
          series={rengSeries}
          marcas={rengMarcas}
        />
        <div className="sim-res"><small>Punto actual</small><b>{rengMagnitud(rengVolumenActual)} mL · pH ≈ {rengFormatoPH.format(rengPH)}</b></div>
        <div className="sim-res"><small>Equivalencia</small><b>{rengEquivalencia}</b></div>
        <RengExportarMezclaAcidoBase entrada={rengEntrada} resultado={rengResultado} curva={rengCurva} />
        <RengGuardarEnCuaderno calcular={() => rengCorridaValoracion(rengEntrada)} nombreSugerido={`Valoración de ${rengEntrada.acido === 'hcl' ? 'HCl' : 'ácido acético'} con NaOH`} anterior={rengAnterior} advertencia={rengAdvertencia} />
      </RengTarjeta>
      <RengTarjeta titulo="Balances del cálculo">
        <div className="sim-res"><small>Ácido introducido</small><b>{rengMagnitud(rengMolesAcido)} mol</b></div>
        <div className="sim-res"><small>NaOH introducido</small><b>{rengMagnitud(rengMolesBase)} mol</b></div>
        <div className="sim-res"><small>Fuerza iónica estimada</small><b>{rengMagnitud(rengFuerzaIonica)} mol/L</b></div>
        <div className="sim-res"><small>Residuo del balance de carga</small><b>{rengMagnitud(rengResiduoCarga)} mol/L</b></div>
        <div className="sim-res"><small>Residuo del balance de materia del ácido</small><b>{rengMagnitud(rengResiduoAcido)} mol/L</b></div>
        <p className="sim-formulas">[H₃O⁺] + [Na⁺] = [OH⁻] + [{rengAnion}]</p>
        <p className="sim-formulas" data-balances="mezcla">
          Carga: {rengBalances.cumple ? 'cumplido' : 'NO cumplido'} (residuo relativo {rengMagnitud(rengBalances.relativoCarga)}). Materia del ácido: residuo relativo {rengMagnitud(rengBalances.relativoMateria)}
          {rengBalances.materiaPorConstruccion ? ' (con HCl se cumple por construcción: [Cl⁻] se toma igual al total de ácido, así que no es una comprobación independiente)' : ''}. Tolerancia 1 × 10⁻⁹.
        </p>
        <p className="sim-formulas">{rengClorhidrico ? '[Cl⁻]' : '[CH₃COOH] + [CH₃COO⁻]'} = moles de ácido / volumen total en litros</p>
      </RengTarjeta>
    </>
  )
}
