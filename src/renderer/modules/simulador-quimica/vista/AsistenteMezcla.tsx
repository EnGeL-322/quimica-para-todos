import { useMemo, useState } from 'react'
import { rengLlevarProductos, rengTextoCarga } from '../estado/acciones'
import { rengDerivarTodos } from '../estado/derivados'
import { rengIdentificadaDeFragmento, rengIdentificar, rengTextoEquivalente, type RengSustanciaIdentificada } from '../nucleo/identidad'
import { rengMezclar } from '../nucleo/mezclador'
import { rengInterpretarSustancia } from '../nucleo/sustancia'
import { RengEntradaSustancia } from './EntradaSustancia'
import { RengAviso } from './ui'
import { RengResultadoMezcla } from './ResultadoMezcla'
import { useRengAlmacen, useRengTrabajo } from './useTrabajo'

function rengResolverCampo(rengTexto: string, rengFijada: RengSustanciaIdentificada | null): { s: RengSustanciaIdentificada } | { motivo: string } | null {
  if (rengFijada) return { s: rengFijada }
  if (!rengTexto.trim()) return null
  const rengI = rengIdentificar(rengTexto)
  return rengI.tipo === 'ok' ? { s: rengI.s } : { motivo: rengI.motivo }
}

export function RengAsistenteMezcla(): React.JSX.Element {
  const rengT = useRengAlmacen()
  const rengEstado = useRengTrabajo((rengE) => rengE)
  const rengFrags = useMemo(() => rengDerivarTodos(rengEstado), [rengEstado])
  const [rengA, rengSetA] = useState('')
  const [rengB, rengSetB] = useState('')
  const [rengAviso, rengSetAviso] = useState<string | null>(null)
  const [rengFijaA, rengSetFijaA] = useState<RengSustanciaIdentificada | null>(null)
  const [rengFijaB, rengSetFijaB] = useState<RengSustanciaIdentificada | null>(null)
  const rengCa = useMemo(() => rengResolverCampo(rengA, rengFijaA), [rengA, rengFijaA])
  const rengCb = useMemo(() => rengResolverCampo(rengB, rengFijaB), [rengB, rengFijaB])
  const rengSa = rengCa && 's' in rengCa ? rengCa.s : null
  const rengSb = rengCb && 's' in rengCb ? rengCb.s : null
  const rengRes = useMemo(() => (rengSa && rengSb ? rengMezclar(rengSa, rengSb) : null), [rengSa, rengSb])
  const rengDeLaMesa = rengFrags.map((rengF) => ({ f: rengF, s: rengIdentificadaDeFragmento(rengF) })).filter((rengX): rengX is { f: (typeof rengFrags)[number]; s: RengSustanciaIdentificada } => rengX.s !== null).slice(0, 2)
  const rengProblema = [rengCa, rengCb].find((rengC): rengC is { motivo: string } => !!rengC && 'motivo' in rengC)

  return (
    <div className="asistente-mezcla stack" style={{ gap: 12 }}>
      <div className="stack" style={{ gap: 4 }}>
        <h2 style={{ fontSize: 'var(--t-titulo)' }}>¿Qué quieres mezclar?</h2>
        <p className="sm muted">Escribe dos sustancias (por ejemplo «ácido sulfúrico» y «hidróxido de sodio») o usa las de la mesa.</p>
      </div>
      <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 240px' }}>
          <RengEntradaSustancia id="mezcla-a" etiqueta="Primera sustancia" valor={rengA} onValor={(rengV) => (rengSetFijaA(null), rengSetA(rengV))} resultado={rengInterpretarSustancia(rengA)} onConfirmar={(rengV) => (rengSetFijaA(null), rengSetA(rengV))} />
        </div>
        <span aria-hidden="true" style={{ alignSelf: 'center', fontSize: 22 }}>
          +
        </span>
        <div style={{ flex: '1 1 240px' }}>
          <RengEntradaSustancia id="mezcla-b" etiqueta="Segunda sustancia" valor={rengB} onValor={(rengV) => (rengSetFijaB(null), rengSetB(rengV))} resultado={rengInterpretarSustancia(rengB)} onConfirmar={(rengV) => (rengSetFijaB(null), rengSetB(rengV))} />
        </div>
      </div>
      {rengDeLaMesa.length > 0 && (
        <div className="row" style={{ gap: 6 }}>
          <button
            className="btn sm"
            onClick={() => {
              const [rengPa, rengPb] = rengDeLaMesa.map((rengX) => rengX.s)
              rengSetFijaA(rengPa ?? null)
              rengSetFijaB(rengPb ?? null)
              rengSetA(rengPa ? (rengTextoEquivalente(rengPa) ?? rengPa.nombre) : '')
              rengSetB(rengPb ? (rengTextoEquivalente(rengPb) ?? rengPb.nombre) : '')
            }}
          >
            Usar lo de la mesa ({rengDeLaMesa.map((rengX) => `${rengX.f.formula}${rengTextoCarga(rengX.f.cargaNeta)}`).join(' + ')})
          </button>
        </div>
      )}
      {rengProblema && <RengAviso tipo="aviso">{rengProblema.motivo}</RengAviso>}
      {[rengSa, rengSb].map((rengX) => rengX?.identidad.nota).filter((rengN): rengN is string => !!rengN).map((rengN) => (
        <RengAviso key={rengN} tipo="aviso">{rengN}</RengAviso>
      ))}
      {!rengRes && !rengProblema && (rengA.trim() || rengB.trim()) && <RengAviso tipo="info">Elige dos sustancias que la app reconozca (el campo te sugiere mientras escribes).</RengAviso>}
      {rengRes && (
        <RengResultadoMezcla
          res={rengRes}
          onLlevar={() => {
            if (rengRes.tipo !== 'reaccion') return
            const rengR = rengLlevarProductos(rengT.obtener(), rengRes.r.productos.map((rengP) => ({ entrada: rengP.entrada, formula: rengP.formula })))
            if (rengR.ok) {
              rengT.aplicar(() => rengR.estado)
              rengSetAviso('Productos añadidos a la mesa: míralos en Explorar (Ctrl+Z los quita).')
            } else rengSetAviso('error' in rengR ? rengR.error : rengR.nota)
          }}
        />
      )}
      {rengAviso && <RengAviso tipo="info">{rengAviso}</RengAviso>}
    </div>
  )
}
