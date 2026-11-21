import { useEffect, useMemo } from 'react'
import { RENG_DATOS_TERMO, RENG_R, rengAumentoTemperaturaAgua, rengCalorLiberado, rengConstanteDeG, rengDatoTermo, rengEnergiaLibre, rengEntalpiaReaccion, rengEntropiaReaccion } from '../../nucleo/termoquimica'
import { RENG_REACCIONES_TERMO, rengValidarEntradasSim } from '../../practica/modelosSimulacion'
import { rengEntradasLegibles } from '../../practica/reglasEscena'
import { RengGraficaXY } from '../../vista/GraficaXY'
import { useRengMuestra } from '../../vista/nivel'
import { RengAviso, RengEtiqueta, RengTarjeta } from '../../vista/ui'
import { RengAvisoReabierta, RengBotonCalcular, RengComparaCasos, RengDiagnosticos, RengFormulario, RengGuardarEscena, RengNaturaleza, RengNumModelo, RengResultado, RengSalida, RengSensibilidadPanel, rengAdvertenciaPendiente, rengFmt, useRengCalculo, useRengReapertura, type RengInicialEscena } from './comunes'

interface RengEstadoEnergia {
  reaccion: string
  T: number
  mol: number
  masaAgua: number
}

const RENG_POR_DEFECTO: RengEstadoEnergia = { reaccion: 'metano', T: 298.15, mol: 1, masaAgua: 1000 }

const rengDesde = (rengE: Readonly<Record<string, number | string>>): RengEstadoEnergia => ({
  reaccion: String(rengE['reaccion'] ?? RENG_POR_DEFECTO.reaccion),
  T: Number(rengE['T'] ?? RENG_POR_DEFECTO.T),
  mol: Number(rengE['mol'] ?? RENG_POR_DEFECTO.mol),
  masaAgua: Number(rengE['masaAgua'] ?? RENG_POR_DEFECTO.masaAgua)
})

export default function RengEscenaEnergia({ inicial: rengInicial }: { inicial?: RengInicialEscena | null }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const { borrador: rengB, aplicado: rengA, sucio: rengSucio, cambiar: rengCambiar, calcular: rengCalcular, reemplazar: rengReemplazar } = useRengCalculo<RengEstadoEnergia>(RENG_POR_DEFECTO, rengInicial, rengDesde)
  const [rengReabierta, rengOlvidar] = useRengReapertura('termo', (rengE) => rengReemplazar(rengDesde(rengE), true))
  useEffect(() => {
    if (rengInicial) rengOlvidar()
  }, [rengInicial?.n])
  const rengEntradasAplicadas = useMemo(() => (rengA ? { ...rengA } : null), [rengA])
  const rengValidacion = useMemo(() => (rengEntradasAplicadas ? rengValidarEntradasSim('termo', rengEntradasAplicadas) : null), [rengEntradasAplicadas])
  const rengDef = RENG_REACCIONES_TERMO.find((rengX) => rengX.id === (rengA ?? rengB).reaccion) ?? RENG_REACCIONES_TERMO[0]!
  const rengR = rengDef.r
  const rengDH = rengEntalpiaReaccion(rengR)
  const rengDS = rengEntropiaReaccion(rengR)
  const rengT = rengA?.T ?? 298.15
  const rengDG = rengDS === null ? null : rengEnergiaLibre(rengDH, rengDS, rengT)
  const rengLnK = rengDG === null ? null : (-rengDG * 1000) / (RENG_R * rengT)
  const rengK = rengDG === null ? null : rengConstanteDeG(rengDG, rengT)
  const rengQ = rengA ? rengCalorLiberado(rengDH, rengR.reactivos[0]!.nu, rengA.mol) : 0
  const rengCurvaG = useMemo(() => (rengDS === null ? [] : Array.from({ length: 61 }, (_, rengI) => 200 + rengI * 20).map((rengTt) => [rengTt, rengEnergiaLibre(rengDH, rengDS, rengTt)] as [number, number])), [rengDH, rengDS])
  const rengUsados = [...rengR.reactivos, ...rengR.productos].map((rengD) => rengDatoTermo(rengD.id))
  const rengResumen = rengEntradasAplicadas ? rengEntradasLegibles('termo', rengEntradasAplicadas) : null

  return (
    <div className="q-escena">
      <RengFormulario>
        <RengTarjeta titulo="Datos de entrada" nota="Entalpías de formación estándar a 298,15 K, ley de Hess">
          <label className="sim-campo">
            <span>Reacción</span>
            <select className="input" value={rengB.reaccion} onChange={(rengE) => rengCambiar({ reaccion: rengE.target.value })}>
              {RENG_REACCIONES_TERMO.map((rengX) => (
                <option key={rengX.id} value={rengX.id}>
                  {rengX.nombre}
                </option>
              ))}
            </select>
          </label>
          <RengNumModelo escena="termo" clave="T" valor={rengB.T} onChange={(rengV) => rengCambiar({ T: rengV })} />
          <div className="sim-fila">
            <RengNumModelo escena="termo" clave="mol" valor={rengB.mol} onChange={(rengV) => rengCambiar({ mol: rengV })} />
            <RengNumModelo escena="termo" clave="masaAgua" valor={rengB.masaAgua} onChange={(rengV) => rengCambiar({ masaAgua: rengV })} />
          </div>
          <RengBotonCalcular aplicado={rengA !== null} sucio={rengSucio} onCalcular={rengCalcular} />
        </RengTarjeta>
      </RengFormulario>
      <RengSalida sucio={rengSucio} resumen={rengResumen}>
        <RengAvisoReabierta reabierta={rengReabierta} />
        {!rengA ? (
          <RengAviso tipo="info">Elige la reacción, la temperatura y las cantidades y pulsa «Calcular»: verás el calor liberado o absorbido y si ocurre espontáneamente.</RengAviso>
        ) : rengValidacion && !rengValidacion.ok ? (
          <RengAviso tipo="aviso">Diagnóstico: {rengValidacion.diagnostico}</RengAviso>
        ) : (
          <>
            <RengTarjeta titulo="Calor de reacción: ΔH°" nota="Condición: 298,15 K, 1 bar" acento>
              <RengNaturaleza tipo="calculo" />
              <RengResultado etiqueta="ΔH° de la reacción" valor={`${rengFmt(rengDH, 5)} kJ`} />
              <RengEtiqueta tono={rengDH < 0 ? 'ok' : 'aviso'}>{rengDH < 0 ? 'Exotérmica: libera calor' : 'Endotérmica: absorbe calor'}</RengEtiqueta>
              <RengResultado etiqueta={rengQ >= 0 ? 'Calor liberado' : 'Calor absorbido'} valor={`${rengFmt(Math.abs(rengQ), 4)} kJ`} />
              {rengQ > 0 && <RengResultado etiqueta="Si todo calentara el agua (sin pérdidas)" valor={`+ ${rengFmt(rengAumentoTemperaturaAgua(rengQ, rengA.masaAgua), 4)} K`} />}
              {rengQ > 0 && rengAumentoTemperaturaAgua(rengQ, rengA.masaAgua) > 75 && <RengAviso tipo="aviso">El agua herviría antes: este cálculo ideal solo vale mientras siga líquida (c = 4,184 J/(g·K)).</RengAviso>}
              <p className="sim-guia">El calor se calcula con ΔH° a 298,15 K aunque pidas otra temperatura: aquí la temperatura solo cambia ΔG y K.</p>
            </RengTarjeta>
            <RengTarjeta titulo="¿Ocurre sola? ΔG a la temperatura indicada" nota="ΔG = ΔH − T·ΔS">
              <RengNaturaleza tipo="calculo" />
              {rengDG === null || rengDS === null || rengLnK === null ? (
                <RengAviso tipo="info">Falta la entropía estándar de alguna sustancia: no se calcula ΔG (no se inventa el dato).</RengAviso>
              ) : (
                <>
                  <RengResultado etiqueta="ΔS°" valor={`${rengFmt(rengDS, 4)} J/K`} />
                  <RengResultado etiqueta={`ΔG a ${rengFmt(rengT)} K`} valor={`${rengFmt(rengDG, 4)} kJ`} />
                  <RengResultado etiqueta="ln K = −ΔG/(RT)" valor={rengFmt(rengLnK, 4)} />
                  <RengResultado etiqueta="Constante de equilibrio K" valor={rengK !== null && Number.isFinite(rengK) && rengK > 0 ? rengFmt(rengK, 3) : 'fuera del rango numérico (usa ln K)'} />
                  <RengGraficaXY descripcion="Energía libre de la reacción frente a la temperatura" tituloX="temperatura (K)" tituloY="ΔG (kJ)" series={[{ nombre: 'ΔG(T)', puntos: rengCurvaG, color: 'var(--accent)' }, { nombre: 'ΔG = 0', puntos: [[200, 0], [1400, 0]], color: 'var(--text-3)', punteada: true }]} y={[Math.min(...rengCurvaG.map((rengP) => rengP[1]), 0), Math.max(...rengCurvaG.map((rengP) => rengP[1]), 0)]} marcas={[{ x: Math.max(200, Math.min(1400, rengT)), y: rengDG }]} />
                  <p className="sim-guia">
                    {rengDG < 0 ? 'ΔG < 0: la reacción es termodinámicamente favorable a esta temperatura.' : 'ΔG > 0: no es favorable a esta temperatura.'}
                    {Math.abs(rengDS) > 1e-9 && ` Si ΔH° y ΔS° fueran constantes, ΔG cambiaría de signo a ${rengFmt((rengDH * 1000) / rengDS)} K (extrapolación: a esa temperatura las fases y los valores ya serían otros).`}
                  </p>
                </>
              )}
              <RengAviso tipo="info">Favorable no significa rápida: ΔG dice si la reacción puede ocurrir, no cuánto tarda. La velocidad depende de la barrera de activación y se estudia en «Velocidad de reacción».</RengAviso>
              {rengMuestra('simulaciones.formulas') && (
                <ul className="sim-formulas sim-fuentes">
                  {rengUsados.map((rengD, rengI) => (
                    <li key={rengI}>
                      {rengD.formula} ({rengD.fase}): ΔfH° = {rengD.dHf} kJ/mol · {rengD.fuenteH} <RengNaturaleza tipo="publicado" />
                      {rengD.S !== undefined && (
                        <>
                          {' '}
                          · S° = {rengD.S} J/(mol·K) <RengNaturaleza tipo="libro" />
                        </>
                      )}
                    </li>
                  ))}
                  <li>Supone ΔH° y ΔS° constantes con la temperatura. R = 8,314462618 J/(mol·K) (CODATA 2018).</li>
                </ul>
              )}
              <p className="sim-pie">{RENG_DATOS_TERMO.length} sustancias con datos termodinámicos · cada valor lleva su fuente y si fue consultado o es de libro de texto.</p>
            </RengTarjeta>
            <RengDiagnosticos escena="termo" entradas={rengEntradasAplicadas} />
            <RengComparaCasos escena="termo" entradas={rengEntradasAplicadas} />
            <RengSensibilidadPanel escena="termo" entradas={rengEntradasAplicadas} />
            <RengGuardarEscena escena="termo" entradas={rengEntradasAplicadas} nombre={`Energía: ${rengDef.nombre.replace(/\s{2,}.*$/, '')}`} anterior={rengReabierta?.id ?? null} advertencia={rengAdvertenciaPendiente(rengSucio, rengResumen)} />
          </>
        )}
      </RengSalida>
    </div>
  )
}
