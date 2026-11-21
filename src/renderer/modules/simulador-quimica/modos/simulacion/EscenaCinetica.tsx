import { useEffect, useMemo, useRef, useState } from 'react'
import { rengArrhenius, rengConcentracion, rengConsecutivaAnalitica, rengEnergiaActivacion, rengTiempoMaximoB, rengVidaMedia, type RengOrden } from '../../nucleo/cinetica'
import { RengGraficaXY } from '../../vista/GraficaXY'
import { rengMovimientoReducido, useRengMuestra } from '../../vista/nivel'
import { RengAviso, RengTarjeta } from '../../vista/ui'
import { rengUnidadK } from '../../practica/reglasEscena'
import { RengAvisoReabierta, RengComparaCasos, RengDiagnosticos, RengFormulario, RengGuardarEscena, RengNaturaleza, RengNum, RengNumModelo, RengResultado, RengSensibilidadPanel, rengFmt, useRengReapertura, type RengInicialEscena } from './comunes'

const RENG_DURACION_S = 12

export default function RengEscenaCinetica({ inicial: rengInicial }: { inicial?: RengInicialEscena | null }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const [rengOrden, rengSetOrden] = useState<RengOrden>(1)
  const [RENG_A0, rengSetA0] = useState(1)
  const [rengK, rengSetK] = useState(0.2)
  const [rengT, rengSetT] = useState(0)
  const [rengCorre, rengSetCorre] = useState(false)
  const [RengEa, rengSetEa] = useState(50)
  const [RENG_T1, rengSetT1] = useState(298.15)
  const [RENG_T2, rengSetT2] = useState(308.15)
  const [rengK1, rengSetK1] = useState(0.8)
  const [rengK2, rengSetK2] = useState(0.2)
  const rengTh = rengVidaMedia(rengOrden, RENG_A0, rengK)
  const rengTInicial = Number(rengInicial?.entradas['t'] ?? 0)
  const rengTAgotamiento = rengOrden === 0 ? RENG_A0 / rengK : Infinity
  const rengTmax = Math.max(rengOrden === 0 ? rengTAgotamiento * 1.1 : rengTh * 5, rengTInicial * 1.02)
  const rengTRef = useRef(rengT)
  rengTRef.current = rengT

  const rengAplicarEntradas = (rengE: Readonly<Record<string, number | string>>): void => {
    rengSetOrden(Number(rengE['orden'] ?? 1) as RengOrden)
    rengSetA0(Number(rengE['A0'] ?? 1))
    rengSetK(Number(rengE['k'] ?? 0.2))
    rengSetT(Number(rengE['t'] ?? 0))
    rengSetCorre(false)
  }
  const [rengReabierta, rengOlvidar] = useRengReapertura('cinetica', rengAplicarEntradas)
  useEffect(() => {
    if (!rengInicial) return
    rengAplicarEntradas(rengInicial.entradas)
    rengOlvidar()
  }, [rengInicial?.n])

  useEffect(() => {
    if (!rengCorre) return
    let rengId = 0
    let rengPrevio = performance.now()
    const rengPaso = (rengAhora: number): void => {
      const rengDt = Math.max(0, rengAhora - rengPrevio) / 1000
      rengPrevio = rengAhora
      const rengSig = Math.max(0, Math.min(rengTmax, rengTRef.current + (rengDt * rengTmax) / RENG_DURACION_S))
      rengSetT(rengSig)
      if (rengSig >= rengTmax) rengSetCorre(false)
      else rengId = requestAnimationFrame(rengPaso)
    }
    rengId = requestAnimationFrame(rengPaso)
    return () => cancelAnimationFrame(rengId)
  }, [rengCorre, rengTmax])

  const rengCambiarParametro = (rengF: () => void): void => {
    rengF()
    rengSetT(0)
    rengSetCorre(false)
  }
  const rengPuntos = useMemo(() => Array.from({ length: 121 }, (_, rengI) => (rengTmax * rengI) / 120).map((rengX) => [rengX, rengConcentracion(rengOrden, RENG_A0, rengK, rengX)] as [number, number]), [rengOrden, RENG_A0, rengK, rengTmax])
  const rengTPlano = Math.min(rengT, rengTmax)
  const rengRecorrido = rengPuntos.filter(([rengX]) => rengX <= rengTPlano)
  const rengAt = rengConcentracion(rengOrden, RENG_A0, rengK, rengTPlano)
  const rengKT = useMemo(() => {
    const rengKb = rengArrhenius(1, RengEa, RENG_T1)
    const rengBase = rengK / rengKb
    return (RENG_T: number): number => rengBase * rengArrhenius(1, RengEa, RENG_T)
  }, [RengEa, RENG_T1, rengK])
  const rengTt = 12 / Math.max(Math.min(rengK1, rengK2), 1e-6) / 4
  const rengAbc = useMemo(() => Array.from({ length: 121 }, (_, rengI) => (rengTt * rengI) / 120).map((rengX) => [rengX, rengConsecutivaAnalitica(1, rengK1, rengK2, rengX)] as const), [rengK1, rengK2, rengTt])
  const rengTmB = rengTiempoMaximoB(rengK1, rengK2)
  const rengMovReducido = rengMovimientoReducido()
  const rengEntradasVivas = useMemo(() => ({ orden: rengOrden, A0: RENG_A0, k: rengK, t: Number(rengTPlano.toPrecision(6)) }), [rengOrden, RENG_A0, rengK, rengTPlano])

  return (
    <div className="q-escena">
      <RengFormulario>
        <RengTarjeta titulo="Datos de entrada" nota="A → productos, temperatura constante">
          <label className="sim-campo">
            <span>Orden de reacción</span>
            <select className="input" value={rengOrden} onChange={(rengE) => rengCambiarParametro(() => rengSetOrden(Number(rengE.target.value) as RengOrden))}>
              <option value={0}>Orden 0 (velocidad constante)</option>
              <option value={1}>Orden 1 (decaimiento exponencial)</option>
              <option value={2}>Orden 2</option>
            </select>
          </label>
          <div className="sim-fila">
            <RengNumModelo escena="cinetica" clave="A0" etiqueta="[A]₀" valor={RENG_A0} onChange={(rengV) => rengCambiarParametro(() => rengSetA0(rengV))} />
            <RengNumModelo escena="cinetica" clave="k" etiqueta="k" valor={rengK} onChange={(rengV) => rengCambiarParametro(() => rengSetK(rengV))} unidad={rengUnidadK(rengOrden)} />
          </div>
          <div className="q-tiempo" role="group" aria-label="Tiempo de la simulación">
            <button type="button" className="btn primary" onClick={() => { if (rengMovReducido) rengSetT(rengTmax); else { if (rengT >= rengTmax) rengSetT(0); rengSetCorre(!rengCorre) } }}>
              {rengCorre ? 'Pausar' : rengT >= rengTmax ? 'Repetir' : rengT > 0 ? 'Continuar' : 'Iniciar'}
            </button>
            <button type="button" className="btn" onClick={() => { rengSetCorre(false); rengSetT(0) }}>
              Reiniciar
            </button>
            <label className="sim-campo">
              <span>Tiempo: {rengFmt(rengTPlano)} s</span>
              <input type="range" min={0} max={rengTmax} step={rengTmax / 240} value={rengTPlano} onChange={(rengE) => { rengSetCorre(false); rengSetT(Number(rengE.target.value)) }} aria-label="Tiempo transcurrido" />
            </label>
          </div>
          <p className="faint sm" role="status">{rengCorre ? 'En marcha…' : rengT === 0 ? 'En pausa en t = 0: pulsa «Iniciar».' : rengT >= rengTmax ? (rengOrden === 0 ? 'Fin del intervalo: [A] agotado.' : 'Fin del intervalo (5 semividas).') : 'En pausa.'}</p>
        </RengTarjeta>
      </RengFormulario>
      <div className="q-salida">
        <RengAvisoReabierta reabierta={rengReabierta} />
        <RengTarjeta titulo="Cómo cae la concentración" nota="Concentración de A frente al tiempo" acento>
          <RengNaturaleza tipo="calculo" />
          <RengGraficaXY
            descripcion="Concentración de A frente al tiempo, con el instante actual marcado"
            tituloX="tiempo (s)"
            tituloY="[A] (mol/L)"
            y={[0, RENG_A0 * 1.05]}
            series={[{ nombre: 'curva completa', puntos: rengPuntos, color: 'var(--text-3)', punteada: true }, { nombre: 'recorrido', puntos: rengRecorrido.length > 1 ? rengRecorrido : [[0, RENG_A0], [0, RENG_A0]], color: 'var(--accent)' }]}
            marcas={[{ x: rengTPlano, y: rengAt, etiqueta: 'ahora' }, { x: rengTh, y: rengOrden === 0 ? RENG_A0 / 2 : RENG_A0 / 2, etiqueta: 't½' }]}
          />
          <RengResultado etiqueta="[A] en este instante" valor={`${rengFmt(rengAt)} mol/L`} />
          <RengResultado etiqueta="Reaccionado" valor={`${rengFmt((100 * (RENG_A0 - rengAt)) / RENG_A0)} %`} />
          <RengResultado etiqueta="Vida media t½" valor={`${rengFmt(rengTh)} s`} />
          <p className="sim-guia">{rengOrden === 1 ? 'En orden 1 la vida media no depende de cuánto A haya: siempre tarda lo mismo en caer a la mitad.' : rengOrden === 2 ? 'En orden 2 cada mitad tarda el doble que la anterior.' : 'En orden 0 la reacción avanza a ritmo fijo hasta agotarse.'}</p>
          {rengMuestra('simulaciones.formulas') && <p className="sim-formulas">{rengOrden === 0 ? '[A] = [A]₀ − kt; t½ = [A]₀/2k' : rengOrden === 1 ? '[A] = [A]₀·e^(−kt); t½ = ln2/k' : '1/[A] = 1/[A]₀ + kt; t½ = 1/(k[A]₀)'}. Fórmulas de libro de texto (Atkins).</p>}
        </RengTarjeta>
        <RengDiagnosticos escena="cinetica" entradas={rengEntradasVivas} />
        <RengComparaCasos escena="cinetica" entradas={rengEntradasVivas} />
        <RengSensibilidadPanel escena="cinetica" entradas={rengEntradasVivas} />
        <RengGuardarEscena escena="cinetica" entradas={rengEntradasVivas} nombre={`Velocidad de reacción: orden ${rengOrden}, k = ${rengFmt(rengK)} ${rengUnidadK(rengOrden)}`} anterior={rengReabierta?.id ?? null} advertencia={null} />
        <details className="panel-seccion">
          <summary>Temperatura (Arrhenius)</summary>
          <RengTarjeta titulo="Temperatura (Arrhenius)" nota="k = A·e^(−Ea/RT); la k de arriba se toma como k(T₁)">
            <div className="sim-fila">
              <RengNum etiqueta="Energía de activación" valor={RengEa} min={1} onChange={rengSetEa} unidad="kJ/mol" />
              <RengNum etiqueta="T₁" valor={RENG_T1} min={1} onChange={rengSetT1} unidad="K" />
              <RengNum etiqueta="T₂" valor={RENG_T2} min={1} onChange={rengSetT2} unidad="K" />
            </div>
            <RengResultado etiqueta={`k a ${rengFmt(RENG_T1)} K`} valor={rengFmt(rengKT(RENG_T1))} />
            <RengResultado etiqueta={`k a ${rengFmt(RENG_T2)} K`} valor={rengFmt(rengKT(RENG_T2))} />
            <RengResultado etiqueta="Cociente k(T₂)/k(T₁)" valor={`× ${rengFmt(rengKT(RENG_T2) / rengKT(RENG_T1))}`} />
            <p className="sim-guia">Subir la temperatura acelera la reacción porque más moléculas superan la barrera Ea. {rengMuestra('simulaciones.formulas') && `Comprobación: Ea recuperada de ambas k = ${rengFmt(rengEnergiaActivacion(rengKT(RENG_T1), RENG_T1, rengKT(RENG_T2), RENG_T2))} kJ/mol.`}</p>
          </RengTarjeta>
        </details>
        <details className="panel-seccion">
          <summary>Reacción en dos pasos A → B → C</summary>
          <RengTarjeta titulo="Reacción en dos pasos" nota="A → B → C: el intermedio B sube y baja">
            <div className="sim-fila">
              <RengNum etiqueta="k₁ (A→B)" valor={rengK1} min={1e-4} onChange={rengSetK1} unidad="1/s" />
              <RengNum etiqueta="k₂ (B→C)" valor={rengK2} min={1e-4} onChange={rengSetK2} unidad="1/s" />
            </div>
            <RengGraficaXY descripcion="Concentraciones de A, B y C frente al tiempo" tituloX="tiempo (s)" tituloY="concentración (relativa a [A]₀)" y={[0, 1]} series={[{ nombre: 'A', puntos: rengAbc.map(([rengX, rengS]) => [rengX, rengS.A]), color: 'var(--danger)' }, { nombre: 'B (intermedio)', puntos: rengAbc.map(([rengX, rengS]) => [rengX, rengS.B]), color: 'var(--warn)' }, { nombre: 'C', puntos: rengAbc.map(([rengX, rengS]) => [rengX, rengS.C]), color: 'var(--ok)' }]} marcas={[{ x: rengTmB, y: rengConsecutivaAnalitica(1, rengK1, rengK2, rengTmB).B, etiqueta: 'B máximo' }]} />
          </RengTarjeta>
        </details>
        {rengInicial && Number(rengInicial.entradas['t'] ?? 0) > 0 && <RengAviso tipo="info">Se cargaron valores iniciales; el reloj queda en pausa en t = {rengFmt(Number(rengInicial.entradas['t']))} s.</RengAviso>}
      </div>
    </div>
  )
}
