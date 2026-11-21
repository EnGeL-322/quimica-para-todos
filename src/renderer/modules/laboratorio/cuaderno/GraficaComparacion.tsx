import type { RengComparacion } from '@/lib/cuaderno/comparar'

const RENG_MAX_DIBUJO = 1500
function rengDiezmar<RengT>(rengXs: readonly RengT[]): readonly RengT[] {
  if (rengXs.length <= RENG_MAX_DIBUJO) return rengXs
  const rengPaso = rengXs.length / RENG_MAX_DIBUJO
  return Array.from({ length: RENG_MAX_DIBUJO }, (_, rengI) => rengXs[Math.floor(rengI * rengPaso)]!).concat(rengXs[rengXs.length - 1]!)
}

function rengMarcas(rengMin: number, rengMax: number, rengN = 5): number[] {
  if (!(rengMax > rengMin)) return [rengMin]
  const rengCrudo = (rengMax - rengMin) / rengN
  const rengP = 10 ** Math.floor(Math.log10(rengCrudo))
  const rengM = rengCrudo / rengP
  const rengPaso = (rengM < 1.5 ? 1 : rengM < 3.5 ? 2 : rengM < 7.5 ? 5 : 10) * rengP
  const rengOut: number[] = []
  for (let rengV = Math.ceil(rengMin / rengPaso) * rengPaso; rengV <= rengMax + rengPaso * 1e-9; rengV += rengPaso) rengOut.push(Number(rengV.toPrecision(12)))
  return rengOut
}
const rengFmt = (rengV: number): string => (Math.abs(rengV) >= 1e-3 && Math.abs(rengV) < 1e5) || rengV === 0 ? Number(rengV.toPrecision(4)).toLocaleString('es') : rengV.toExponential(1).replace('.', ',')
const rengU = (rengS: string): string => (rengS ? ` (${rengS})` : '')

export function RengGraficaComparacion({ c: rengC }: { c: Extract<RengComparacion, { ok: true }> }): React.JSX.Element {
  const RENG_W = 640
  const RENG_H1 = 230
  const RENG_H2 = 110
  const rengIzq = 62
  const rengDer = 14
  const rengArr = 12
  const [rengX0, rengX1] = [Math.min(rengC.ref.x[0]!, rengC.otra.x[0]!), Math.max(rengC.ref.x[rengC.ref.x.length - 1]!, rengC.otra.x[rengC.otra.x.length - 1]!)]
  let rengY0 = Infinity
  let rengY1 = -Infinity
  for (const rengV of [...rengC.ref.y, ...rengC.otra.y]) {
    if (rengV < rengY0) rengY0 = rengV
    if (rengV > rengY1) rengY1 = rengV
  }
  if (rengY1 === rengY0) [rengY0, rengY1] = [rengY0 - 1, rengY1 + 1]
  let rengR = 0
  for (const rengP of rengC.puntos) rengR = Math.max(rengR, Math.abs(rengP.residuo))
  if (rengR === 0) rengR = 1
  const rengSx = (rengX: number): number => rengIzq + ((rengX - rengX0) / (rengX1 - rengX0 || 1)) * (RENG_W - rengIzq - rengDer)
  const rengSy = (rengY: number): number => rengArr + (1 - (rengY - rengY0) / (rengY1 - rengY0)) * (RENG_H1 - rengArr - 28)
  const rengSr = (rengV: number): number => RENG_H1 + 8 + (1 - (rengV + rengR) / (2 * rengR)) * (RENG_H2 - 30)
  const rengLinea = (rengXs: readonly number[], rengYs: readonly number[]): string => rengDiezmar(rengXs.map((rengX, rengI) => [rengX, rengYs[rengI]!] as const)).map(([rengX, rengY]) => `${rengSx(rengX).toFixed(1)},${rengSy(rengY).toFixed(1)}`).join(' ')
  const rengPuntosOtra = rengDiezmar(rengC.otra.x.map((rengX, rengI) => [rengX, rengC.otra.y[rengI]!] as const))
  const rengRes = rengDiezmar(rengC.puntos)
  return (
    <svg className="grafica-comparacion" viewBox={`0 0 ${RENG_W} ${RENG_H1 + RENG_H2}`} width="100%" role="img" aria-label={`Comparación de «${rengC.ref.nombre}» y «${rengC.otra.nombre}», con residuos. RMSE ${rengFmt(rengC.rmse)} ${rengC.unidad}.`}>
      {rengMarcas(rengX0, rengX1).map((rengT) => (
        <g key={`x${rengT}`}>
          <line x1={rengSx(rengT)} x2={rengSx(rengT)} y1={rengArr} y2={RENG_H1 + RENG_H2 - 22} className="gc-rejilla" />
          <text x={rengSx(rengT)} y={RENG_H1 + RENG_H2 - 8} textAnchor="middle" className="gc-texto">
            {rengFmt(rengT)}
          </text>
        </g>
      ))}
      {rengMarcas(rengY0, rengY1, 4).map((rengT) => (
        <g key={`y${rengT}`}>
          <line x1={rengIzq} x2={RENG_W - rengDer} y1={rengSy(rengT)} y2={rengSy(rengT)} className="gc-rejilla" />
          <text x={rengIzq - 6} y={rengSy(rengT) + 4} textAnchor="end" className="gc-texto">
            {rengFmt(rengT)}
          </text>
        </g>
      ))}
      <polyline points={rengLinea(rengC.ref.x, rengC.ref.y)} className="gc-ref" fill="none" />
      {rengPuntosOtra.length > 1 && rengC.otra.x.length < 400 ? (
        rengPuntosOtra.map(([rengX, rengY], rengI) => <circle key={rengI} cx={rengSx(rengX)} cy={rengSy(rengY)} r={2.6} className="gc-otra-punto" />)
      ) : (
        <polyline points={rengLinea(rengC.otra.x, rengC.otra.y)} className="gc-otra" fill="none" />
      )}
      <text x={rengIzq} y={RENG_H1 - 8} className="gc-texto">
        {`x${rengU(rengC.ref.ux)} · y${rengU(rengC.unidad)}`}
      </text>
      <line x1={rengIzq} x2={RENG_W - rengDer} y1={rengSr(0)} y2={rengSr(0)} className="gc-cero" />
      {rengRes.map((rengP, rengI) => (
        <line key={rengI} x1={rengSx(rengP.x)} x2={rengSx(rengP.x)} y1={rengSr(0)} y2={rengSr(rengP.residuo)} className="gc-residuo" />
      ))}
      <text x={rengIzq - 6} y={rengSr(rengR) + 4} textAnchor="end" className="gc-texto">
        {rengFmt(rengR)}
      </text>
      <text x={rengIzq - 6} y={rengSr(-rengR) + 4} textAnchor="end" className="gc-texto">
        {rengFmt(-rengR)}
      </text>
      <text x={RENG_W - rengDer} y={RENG_H1 + 18} textAnchor="end" className="gc-texto">
        residuo = otra − referencia{rengU(rengC.unidad)}
      </text>
    </svg>
  )
}
