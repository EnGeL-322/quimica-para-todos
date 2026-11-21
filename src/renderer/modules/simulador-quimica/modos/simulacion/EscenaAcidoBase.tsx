import { useEffect, useMemo } from 'react'
import { RENG_ACIDOS, rengConcentracionH, rengCurvaValoracion, rengFracciones, rengPH } from '../../nucleo/acidoBase'
import { rengCalcularEscena, rengValidarEntradasSim } from '../../practica/modelosSimulacion'
import { rengBalancesAcidoBase, rengEntradasLegibles } from '../../practica/reglasEscena'
import { RengGraficaXY } from '../../vista/GraficaXY'
import { useRengMuestra } from '../../vista/nivel'
import { RengAviso, RengEtiqueta, RengTarjeta } from '../../vista/ui'
import { RengAvisoReabierta, RengBotonCalcular, RengComparaCasos, RengDiagnosticos, RengFormulario, RengGuardarEscena, RengNaturaleza, RengNumModelo, RengResultado, RengSalida, RengSensibilidadPanel, rengAdvertenciaPendiente, rengFmt, useRengCalculo, useRengReapertura, type RengInicialEscena } from './comunes'

interface RengEstadoAcidoBase {
  acido: string
  C: number
  Va: number
  Cb: number
  Vb: number
}

const rengPh = (rengX: number): string => (Number.isFinite(rengX) ? rengX.toFixed(3).replace('.', ',') : '—')

const RENG_POR_DEFECTO: RengEstadoAcidoBase = { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1, Vb: 0 }

const rengDesde = (rengE: Readonly<Record<string, number | string>>): RengEstadoAcidoBase => ({
  acido: String(rengE['acido'] ?? RENG_POR_DEFECTO.acido),
  C: Number(rengE['C'] ?? RENG_POR_DEFECTO.C),
  Va: Number(rengE['Va'] ?? RENG_POR_DEFECTO.Va),
  Cb: Number(rengE['Cb'] ?? RENG_POR_DEFECTO.Cb),
  Vb: Number(rengE['Vb'] ?? 0)
})

export default function RengEscenaAcidoBase({ inicial: rengInicial }: { inicial?: RengInicialEscena | null }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const { borrador: rengB, aplicado: rengA, sucio: rengSucio, cambiar: rengCambiar, calcular: rengCalcular, reemplazar: rengReemplazar } = useRengCalculo<RengEstadoAcidoBase>(RENG_POR_DEFECTO, rengInicial, rengDesde)
  const [rengReabierta, rengOlvidar] = useRengReapertura('acidobase', (rengE) => rengReemplazar(rengDesde(rengE), true))
  useEffect(() => {
    if (rengInicial) rengOlvidar()
  }, [rengInicial?.n])
  const rengEntradasAplicadas = useMemo(() => (rengA ? { acido: rengA.acido, C: rengA.C, Va: rengA.Va, Cb: rengA.Cb, Vb: rengA.Vb } : null), [rengA])
  const rengValidacion = useMemo(() => (rengEntradasAplicadas ? rengValidarEntradasSim('acidobase', rengEntradasAplicadas) : null), [rengEntradasAplicadas])
  const rengAc = RENG_ACIDOS.find((rengX) => rengX.id === (rengA ?? rengB).acido) ?? RENG_ACIDOS[1]!
  const rengAcBorrador = RENG_ACIDOS.find((rengX) => rengX.id === rengB.acido) ?? RENG_ACIDOS[1]!
  const rengSalida = useMemo(() => (rengEntradasAplicadas && rengValidacion?.ok ? rengCalcularEscena('acidobase', rengEntradasAplicadas) : null), [rengEntradasAplicadas, rengValidacion])
  const rengBalances = useMemo(() => (rengA && rengValidacion?.ok ? rengBalancesAcidoBase(rengA.acido, rengA.C, rengA.Va, rengA.Cb, rengA.Vb) : null), [rengA, rengValidacion])
  const rengDisolucion = useMemo(() => (rengA && rengValidacion?.ok ? rengBalancesAcidoBase(rengA.acido, rengA.C, rengA.Va, rengA.Cb, 0) : null), [rengA, rengValidacion])
  const rengVeq = rengSalida?.['Veq'] ?? NaN
  const rengPoliprotico = rengAc.id === 'fosforico1'
  const rengFueraPoliprotico = rengPoliprotico && rengA !== null && rengA.Vb > rengVeq
  const rengVmaxCurva = rengA ? (rengPoliprotico ? rengVeq : Math.max(2 * rengVeq, 2 * rengA.Vb, 1)) : 1
  const rengCurva = useMemo(() => (rengA && rengValidacion?.ok ? rengCurvaValoracion(rengA.C, rengA.Va, rengAc.pKa, rengA.Cb, rengVmaxCurva, 160) : []), [rengA, rengValidacion, rengAc.pKa, rengVmaxCurva])
  const rengPHEq = rengA && rengValidacion?.ok ? rengBalancesAcidoBase(rengA.acido, rengA.C, rengA.Va, rengA.Cb, rengVeq).pH : NaN
  const rengAlfa = useMemo(() => Array.from({ length: 57 }, (_, rengI) => rengI / 4).map((rengP) => [rengP, rengFracciones(rengP, rengAcBorrador.pKa)] as const), [rengAcBorrador.pKa])
  const rengPuntoCurva = rengSalida && rengA && rengA.Vb > 0 && !rengFueraPoliprotico ? rengSalida['pHVb'] : undefined
  const rengResumen = rengEntradasAplicadas ? rengEntradasLegibles('acidobase', rengEntradasAplicadas) : null
  const rengValor = rengDisolucion?.pH ?? NaN
  const rengH = rengDisolucion?.H ?? NaN
  const rengIoniz = rengDisolucion ? (100 * rengDisolucion.anion) / rengDisolucion.totalAcido : NaN
  const rengFuerte = rengAc.fuerte === true

  return (
    <div className="q-escena">
      <RengFormulario>
        <RengTarjeta titulo="Datos de entrada" nota="25 °C, agua, actividades ≈ concentraciones">
          <label className="sim-campo">
            <span>Ácido</span>
            <select className="input" value={rengB.acido} onChange={(rengE) => rengCambiar({ acido: rengE.target.value })}>
              {RENG_ACIDOS.map((rengX) => (
                <option key={rengX.id} value={rengX.id}>
                  {rengX.nombre}
                </option>
              ))}
            </select>
          </label>
          <RengNumModelo escena="acidobase" clave="C" etiqueta="Concentración del ácido" valor={Number(rengB.C.toPrecision(4))} onChange={(rengV) => rengCambiar({ C: rengV })} />
          <label className="sim-campo">
            <span>Escala logarítmica: {rengFmt(rengB.C)} mol/L</span>
            <input type="range" min={-6} max={0} step={0.05} value={Math.max(-6, Math.min(0, Math.log10(rengB.C)))} onChange={(rengE) => rengCambiar({ C: Number((10 ** Number(rengE.target.value)).toPrecision(3)) })} aria-label="Concentración (escala logarítmica)" />
          </label>
          <details className="panel-seccion" open={rengInicial !== null && rengInicial !== undefined ? true : undefined}>
            <summary>Valoración con NaOH</summary>
            <div className="sim-fila">
              <RengNumModelo escena="acidobase" clave="Va" etiqueta="Volumen de ácido" valor={rengB.Va} onChange={(rengV) => rengCambiar({ Va: rengV })} />
              <RengNumModelo escena="acidobase" clave="Cb" valor={rengB.Cb} onChange={(rengV) => rengCambiar({ Cb: rengV })} />
            </div>
            <RengNumModelo escena="acidobase" clave="Vb" etiqueta="Punto de la curva: NaOH añadido" valor={rengB.Vb} onChange={(rengV) => rengCambiar({ Vb: rengV })} />
          </details>
          <RengBotonCalcular aplicado={rengA !== null} sucio={rengSucio} onCalcular={rengCalcular} />
        </RengTarjeta>
      </RengFormulario>
      <RengSalida sucio={rengSucio} resumen={rengResumen}>
        <RengAvisoReabierta reabierta={rengReabierta} />
        {!rengA ? (
          <RengAviso tipo="info">Elige el ácido y su concentración y pulsa «Calcular»: aquí aparecerán el pH, la curva de valoración y su interpretación.</RengAviso>
        ) : rengValidacion && !rengValidacion.ok ? (
          <RengAviso tipo="aviso">Diagnóstico: {rengValidacion.diagnostico}</RengAviso>
        ) : (
          <>
            <RengTarjeta titulo="Resultado" acento>
              <RengNaturaleza tipo="calculo" />
              <RengResultado etiqueta="Tipo de ácido" valor={rengFuerte ? 'fuerte (disociación completa)' : `débil (pKa = ${String(rengAc.pKa).replace('.', ',')})`} />
              <RengResultado etiqueta="pH de la disolución" valor={rengPh(rengValor)} />
              <RengResultado etiqueta="[H⁺]" valor={`${rengFmt(rengH)} mol/L`} />
              {!rengFuerte && <RengResultado etiqueta="Ionización" valor={`${rengFmt(rengIoniz, 3)} %`} />}
              <RengResultado etiqueta="Volumen de equivalencia" valor={`${rengFmt(rengVeq)} mL`} />
              <RengResultado etiqueta="pH en la equivalencia" valor={rengPh(rengPHEq)} />
              {rengPuntoCurva !== undefined && <RengResultado etiqueta={`pH tras añadir ${rengFmt(rengA.Vb)} mL de NaOH`} valor={rengPh(rengPuntoCurva)} />}
              {rengFueraPoliprotico && <RengAviso tipo="aviso">No se muestra el pH tras añadir {rengFmt(rengA.Vb)} mL: supera la primera equivalencia y el modelo del ácido fosfórico solo incluye su primer protón.</RengAviso>}
              {rengA.Vb > 0 && rengBalances && <p className="sim-guia">{rengBalances.region.texto}</p>}
              <p className="sim-guia">
                {rengValor < 6.9 ? 'Disolución ácida.' : rengValor > 7.1 ? 'Disolución básica.' : 'Prácticamente neutra: el agua pesa tanto como el ácido.'}
                {!rengFuerte ? ` Un ácido débil solo se ioniza en parte. A mitad de camino de la valoración el pH vale el pKa (${String(rengAc.pKa).replace('.', ',')}): ahí hay tanto ácido como su base conjugada. En la equivalencia el pH es mayor que 7 porque queda su base conjugada.` : ' Un ácido fuerte está totalmente disociado: en la equivalencia con una base fuerte el pH es 7.'}
              </p>
              {rengMuestra('simulaciones.formulas') && (
                <p className="sim-formulas">
                  Balance de carga: [H⁺] = Kw/[H⁺] + C·Ka/(Ka+[H⁺]); pKa = {rengAc.pKa}. <RengEtiqueta tono={rengAc.verificacion === 'consultada' ? 'ok' : 'aviso'} title={rengAc.fuente}>{rengAc.verificacion === 'consultada' ? 'Fuente consultada' : 'Libro, sin consultar'}</RengEtiqueta> {rengAc.fuente}
                </p>
              )}
              {rengMuestra('simulaciones.formulas') && rengBalances && (
                <p className="sim-formulas" data-balances="acidobase">
                  Balances en el punto calculado: carga {rengBalances.cumple ? 'cumplido' : 'NO cumplido'} (residuo relativo {rengFmt(rengBalances.relativoCarga, 2)}), materia del ácido (residuo relativo {rengFmt(rengBalances.relativoMateria, 2)}); tolerancia {rengFmt(1e-9, 1)}.
                </p>
              )}
            </RengTarjeta>
            <RengTarjeta titulo="Curva de valoración con NaOH" nota={rengPoliprotico ? 'Hasta la primera equivalencia' : 'Cada punto resuelve el equilibrio con la dilución real'}>
              <RengNaturaleza tipo="calculo" />
              <RengGraficaXY
                descripcion="Curva de valoración: pH frente al volumen de base añadido"
                tituloX="Volumen de NaOH (mL)"
                tituloY="pH"
                y={[0, 14]}
                series={[{ nombre: 'pH', puntos: rengCurva.map((rengP) => [rengP.V, rengP.pH]), color: 'var(--accent)' }]}
                marcas={[{ x: rengVeq, y: rengPHEq, etiqueta: 'equivalencia' }, ...(rengPuntoCurva !== undefined ? [{ x: rengA.Vb, y: rengPuntoCurva, etiqueta: 'punto' }] : [])]}
              />
            </RengTarjeta>
            {rengMuestra('simulaciones.formulas') && (
              <RengTarjeta titulo="Fracciones de HA y A⁻ según el pH">
                <RengGraficaXY descripcion="Fracción de ácido y base conjugada frente al pH" tituloX="pH" tituloY="fracción" x={[0, 14]} y={[0, 1]} series={[{ nombre: 'HA', puntos: rengAlfa.map(([rengP, rengF]) => [rengP, rengF.HA]), color: 'var(--danger)' }, { nombre: 'A⁻', puntos: rengAlfa.map(([rengP, rengF]) => [rengP, rengF.A]), color: 'var(--ok)' }]} marcas={[{ x: rengAcBorrador.pKa, y: 0.5, etiqueta: 'pH = pKa' }]} />
              </RengTarjeta>
            )}
            <RengDiagnosticos escena="acidobase" entradas={rengEntradasAplicadas} />
            <RengComparaCasos escena="acidobase" entradas={rengEntradasAplicadas} />
            <RengSensibilidadPanel escena="acidobase" entradas={rengEntradasAplicadas} />
            <RengGuardarEscena escena="acidobase" entradas={rengEntradasAplicadas} nombre={`Ácidos y bases: ${rengAc.acido} ${rengFmt(rengA.C)} mol/L`} anterior={rengReabierta?.id ?? null} advertencia={rengAdvertenciaPendiente(rengSucio, rengResumen)} />
          </>
        )}
      </RengSalida>
    </div>
  )
}
