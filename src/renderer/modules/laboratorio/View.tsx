import { useEffect, useMemo, useRef, useState } from 'react'
import { rengReemplazarSubruta, rengRegistrarReciente, useRengSubruta } from '@/shell/navegacion'
import { RengNotice, RengPageTitle, RengTabs } from '@/shell/ui'
import RengCuaderno from './cuaderno/Cuaderno'
import { rengFormatNumber } from './expr'
import { rengDescriptiva, rengHistograma, rengLeerNumeros, rengRegresionLineal, type RengFormatoDecimal, type RengLecturaNumeros } from './stats'

type RengTab = 'cuaderno' | 'datos'

function RengAvisoLectura({ l: rengL }: { l: RengLecturaNumeros }): React.JSX.Element | null {
  if (rengL.totalInvalidos === 0 && !rengL.recorte) return null
  return (
    <RengNotice tipo="warn">
      {rengL.totalInvalidos > 0 && (
        <>
          {rengL.totalInvalidos === 1 ? 'Un fragmento no es un número y no se usó' : `${rengL.totalInvalidos} fragmentos no son números y no se usaron`}:{' '}
          {rengL.invalidos.map((rengX) => `«${rengX.texto}» (posición ${rengX.posicion})`).join(', ')}
          {rengL.totalInvalidos > rengL.invalidos.length ? '…' : ''}. Revisa también el formato decimal.
        </>
      )}
      {rengL.recorte && <> {rengL.recorte}</>}
    </RengNotice>
  )
}

function RengDatos(): React.JSX.Element {
  const [rengTxt, rengSetTxt] = useState('12, 15, 11, 18, 15, 20, 14, 15, 17, 13')
  const [rengXy, rengSetXy] = useState('1 2.1\n2 3.9\n3 6.2\n4 7.8\n5 10.1')
  const [rengFormato, rengSetFormato] = useState<RengFormatoDecimal>('punto')
  const rengLectura = useMemo(() => rengLeerNumeros(rengTxt, rengFormato), [rengTxt, rengFormato])
  const rengNums = rengLectura.numeros
  const rengD = useMemo(() => (rengNums.length ? rengDescriptiva(rengNums) : null), [rengNums])
  const rengBins = useMemo(() => (rengNums.length ? rengHistograma(rengNums) : []), [rengNums])
  const rengReg = useMemo(() => {
    const rengLineas = rengXy.split(/\n/).filter((rengL) => rengL.trim() !== '')
    const rengMalas: number[] = []
    const rengPares: number[][] = []
    rengLineas.forEach((rengL, rengI) => {
      const rengR = rengLeerNumeros(rengL, rengFormato)
      if (rengR.totalInvalidos > 0 || rengR.numeros.length !== 2) rengMalas.push(rengI + 1)
      else rengPares.push(rengR.numeros)
    })
    const rengAviso = rengMalas.length ? `Líneas sin exactamente dos números (no se usaron): ${rengMalas.slice(0, 15).join(', ')}${rengMalas.length > 15 ? '…' : ''}.` : ''
    try {
      return { ok: rengRegresionLineal(rengPares.map((rengP) => rengP[0] as number), rengPares.map((rengP) => rengP[1] as number)), err: '', aviso: rengAviso }
    } catch (rengE) {
      return { ok: null, err: rengE instanceof Error ? rengE.message : 'Error', aviso: rengAviso }
    }
  }, [rengXy, rengFormato])
  const rengMaxC = Math.max(1, ...rengBins.map((rengB) => rengB.cuenta))
  const rengT = (rengN: number): string => rengFormatNumber(Number(rengN.toPrecision(8)))

  return (
    <div className="grid cols-2" style={{ alignItems: 'start' }}>
      <div className="stack">
        <h3>Estadística descriptiva</h3>
        <div className="segmentado" role="group" aria-label="Formato decimal de los datos">
          <button type="button" aria-pressed={rengFormato === 'punto'} onClick={() => rengSetFormato('punto')} title="1.5 es un número; la coma separa valores (1,2,3 son tres)">
            Punto decimal (1.5)
          </button>
          <button type="button" aria-pressed={rengFormato === 'coma'} onClick={() => rengSetFormato('coma')} title="1,5 es un número; separa los valores con espacios, saltos de línea o punto y coma">
            Coma decimal (1,5)
          </button>
        </div>
        <textarea className="input mono" value={rengTxt} onChange={(rengE) => rengSetTxt(rengE.target.value)} placeholder={rengFormato === 'punto' ? 'Pega tus datos separados por comas, espacios o saltos de línea' : 'Pega tus datos separados por espacios, saltos de línea o punto y coma'} />
        <RengAvisoLectura l={rengLectura} />
        {rengD && (
          <div className="card">
            <dl className="kv">
              {([['n', String(rengD.n)], ['Media', rengT(rengD.media)], ['Mediana', rengT(rengD.mediana)], ['Moda', rengD.moda.length ? rengD.moda.map(rengT).join(', ') : 'sin moda'], ['Mínimo / Máximo', `${rengT(rengD.min)} / ${rengT(rengD.max)}`], ['Rango', rengT(rengD.rango)], ['Q1 / Q3', `${rengT(rengD.q1)} / ${rengT(rengD.q3)}`], ['Desv. estándar (muestral)', rengD.indeterminadas.desvMuestral ? 'indeterminada' : rengT(rengD.desvMuestral)], ['Desv. estándar (poblacional)', rengT(rengD.desvPoblacional)], ['Varianza muestral', rengD.indeterminadas.varianzaMuestral ? 'indeterminada' : rengT(rengD.varianzaMuestral)], ['Error estándar', rengD.indeterminadas.errorEstandar ? 'indeterminado' : rengT(rengD.errorEstandar)]] as Array<[string, string]>).map(([rengK, rengV]) => (
                <div key={rengK} style={{ display: 'contents' }}><dt>{rengK}</dt><dd>{rengV}</dd></div>
              ))}
            </dl>
          </div>
        )}
        {rengD?.indeterminadas.varianzaMuestral && <p className="faint sm">Indeterminadas: {rengD.indeterminadas.varianzaMuestral}.</p>}
        {rengD && rengD.n > 1 && rengD.rango === 0 && <p className="faint sm">Serie constante: varianza y desviaciones valen 0 y el histograma tiene una sola clase.</p>}
        {rengBins.length > 0 && (
          <svg viewBox="0 0 400 140" width="100%" role="img" aria-label="Histograma">
            {rengBins.map((rengB, rengI) => {
              const rengW = 380 / rengBins.length
              const rengH = (rengB.cuenta / rengMaxC) * 100
              return (
                <g key={rengI}>
                  <rect x={10 + rengI * rengW + 1} y={115 - rengH} width={rengW - 2} height={rengH} fill="var(--accent)" opacity="0.85" rx="2" />
                  <text x={10 + rengI * rengW + rengW / 2} y={112 - rengH} fontSize="9" textAnchor="middle" fill="var(--text-2)">{rengB.cuenta}</text>
                  <text x={10 + rengI * rengW + rengW / 2} y={130} fontSize="8" textAnchor="middle" fill="var(--text-3)">{rengT(rengB.desde)}</text>
                </g>
              )
            })}
          </svg>
        )}
      </div>
      <div className="stack">
        <h3>Regresión lineal (y = a·x + b)</h3>
        <textarea className="input mono" value={rengXy} onChange={(rengE) => rengSetXy(rengE.target.value)} placeholder={'x y\n1 2.1\n2 3.9'} />
        {rengReg.aviso && <RengNotice tipo="warn">{rengReg.aviso}</RengNotice>}
        {rengReg.err && <RengNotice tipo="warn">{rengReg.err}</RengNotice>}
        {rengReg.ok && (
          <div className="card">
            <div className="mono" style={{ fontSize: 20 }}>y = {rengT(rengReg.ok.pendiente)}·x {rengReg.ok.intercepto < 0 ? '−' : '+'} {rengT(Math.abs(rengReg.ok.intercepto))}</div>
            <dl className="kv" style={{ marginTop: 10 }}>
              <dt>Puntos</dt><dd>{rengReg.ok.n}</dd>
              <dt>r (correlación)</dt><dd>{rengReg.ok.indeterminado ? 'indeterminado' : rengT(rengReg.ok.r)}</dd>
              <dt>R²</dt><dd>{rengReg.ok.indeterminado ? 'indeterminado' : rengT(rengReg.ok.r2)}</dd>
            </dl>
            {rengReg.ok.indeterminado && <p className="faint sm">{rengReg.ok.indeterminado}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

const RENG_HERRAMIENTAS: Array<{ id: RengTab; label: string }> = [
  { id: 'cuaderno', label: 'Cuaderno' },
  { id: 'datos', label: 'Datos y estadística' }
]
const rengEsTab = (rengS: string | null): rengS is RengTab => RENG_HERRAMIENTAS.some((rengH) => rengH.id === rengS)

export default function RengView(): React.JSX.Element {
  const rengRuta = useRengSubruta('laboratorio')
  const [rengTab, rengSetTab] = useState<RengTab>(() => (rengEsTab(rengRuta.sub) ? rengRuta.sub : 'cuaderno'))
  const [rengVisitadas, rengSetVisitadas] = useState<ReadonlySet<RengTab>>(() => new Set([rengTab]))
  if (!rengVisitadas.has(rengTab)) rengSetVisitadas(new Set([...rengVisitadas, rengTab]))
  const rengUltima = useRef(rengRuta.n)
  useEffect(() => {
    if (rengRuta.n === rengUltima.current) return
    rengUltima.current = rengRuta.n
    if (rengEsTab(rengRuta.sub)) rengSetTab(rengRuta.sub)
  }, [rengRuta])
  useEffect(() => {
    rengReemplazarSubruta('laboratorio', rengTab)
    rengRegistrarReciente({ id: 'laboratorio', sub: rengTab, titulo: RENG_HERRAMIENTAS.find((rengH) => rengH.id === rengTab)!.label, contexto: 'Laboratorio' })
  }, [rengTab])
  const rengPanel = (rengId: RengTab, rengC: React.JSX.Element): React.JSX.Element | null =>
    rengVisitadas.has(rengId) ? (
      <div hidden={rengTab !== rengId} role="tabpanel" aria-label={RENG_HERRAMIENTAS.find((rengH) => rengH.id === rengId)!.label}>
        {rengC}
      </div>
    ) : null
  return (
    <div className="stack" style={{ maxWidth: 1150 }}>
      <RengPageTitle title="Tu cuaderno de química" sub="Corridas guardadas, mediciones importadas y su análisis, todo en tu equipo." />
      <div className="nav-redundante">
        <RengTabs value={rengTab} onChange={rengSetTab} items={RENG_HERRAMIENTAS} />
      </div>
      {rengPanel('cuaderno', <RengCuaderno onHerramienta={rengSetTab} />)}
      {rengPanel('datos', <RengDatos />)}
    </div>
  )
}
