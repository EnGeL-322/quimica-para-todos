export interface RengSerieXY {
  nombre: string
  puntos: Array<[number, number]>
  color: string
  punteada?: boolean
  marcador?: 'circulo' | 'cuadrado' | 'rombo' | 'triangulo'
  sinLinea?: boolean
}

export interface RengMarcaXY {
  x: number
  y: number
  etiqueta?: string
}

interface RengProps {
  series: RengSerieXY[]
  tituloX: string
  tituloY: string
  x?: [number, number]
  y?: [number, number]
  marcas?: RengMarcaXY[]
  descripcion: string
}

const RENG_W = 560
const RENG_H = 300
const RENG_M = { l: 52, r: 16, t: 16, b: 44 }

const rengNum = (rengV: number): string => (Math.abs(rengV) >= 1000 || (Math.abs(rengV) < 0.01 && rengV !== 0) ? rengV.toExponential(1) : String(Number(rengV.toPrecision(3))))

function RengPunto({ x: rengX, y: rengY, forma: rengForma, color: rengColor }: { x: number; y: number; forma: NonNullable<RengSerieXY['marcador']>; color: string }): React.JSX.Element {
  const rengR = 4.5
  const rengEstilo = { fill: rengColor, stroke: 'var(--surface)', strokeWidth: 1 }
  if (rengForma === 'cuadrado') return <rect x={rengX - rengR} y={rengY - rengR} width={rengR * 2} height={rengR * 2} style={rengEstilo} />
  if (rengForma === 'rombo') return <polygon points={`${rengX},${rengY - rengR - 1} ${rengX + rengR + 1},${rengY} ${rengX},${rengY + rengR + 1} ${rengX - rengR - 1},${rengY}`} style={rengEstilo} />
  if (rengForma === 'triangulo') return <polygon points={`${rengX},${rengY - rengR - 1} ${rengX + rengR + 1},${rengY + rengR} ${rengX - rengR - 1},${rengY + rengR}`} style={rengEstilo} />
  return <circle cx={rengX} cy={rengY} r={rengR} style={rengEstilo} />
}

export function RengGraficaXY({ series: rengSeries, tituloX: rengTituloX, tituloY: rengTituloY, x: rengX, y: rengY, marcas: rengMarcas = [], descripcion: rengDescripcion }: RengProps): React.JSX.Element {
  const rengTodos = rengSeries.flatMap((rengS) => rengS.puntos).filter(([rengA, rengB]) => Number.isFinite(rengA) && Number.isFinite(rengB))
  const [rengX0, rengX1] = rengX ?? [Math.min(...rengTodos.map((rengP) => rengP[0])), Math.max(...rengTodos.map((rengP) => rengP[0]))]
  const [rengY0, rengY1] = rengY ?? [Math.min(0, ...rengTodos.map((rengP) => rengP[1])), Math.max(...rengTodos.map((rengP) => rengP[1])) * 1.05]
  const rengSx = (rengV: number): number => RENG_M.l + ((rengV - rengX0) / (rengX1 - rengX0 || 1)) * (RENG_W - RENG_M.l - RENG_M.r)
  const rengSy = (rengV: number): number => RENG_H - RENG_M.b - ((rengV - rengY0) / (rengY1 - rengY0 || 1)) * (RENG_H - RENG_M.t - RENG_M.b)
  const rengTicks = (rengA: number, rengB: number): number[] => Array.from({ length: 5 }, (_, rengI) => rengA + ((rengB - rengA) * rengI) / 4)
  return (
    <figure className="grafica-xy">
      <svg viewBox={`0 0 ${RENG_W} ${RENG_H}`} role="img" aria-label={rengDescripcion}>
        {rengTicks(rengX0, rengX1).map((rengT) => (
          <g key={`x${rengT}`}>
            <line x1={rengSx(rengT)} x2={rengSx(rengT)} y1={RENG_M.t} y2={RENG_H - RENG_M.b} className="gxy-rejilla" />
            <text x={rengSx(rengT)} y={RENG_H - RENG_M.b + 16} textAnchor="middle" className="gxy-tick">{rengNum(rengT)}</text>
          </g>
        ))}
        {rengTicks(rengY0, rengY1).map((rengT) => (
          <g key={`y${rengT}`}>
            <line x1={RENG_M.l} x2={RENG_W - RENG_M.r} y1={rengSy(rengT)} y2={rengSy(rengT)} className="gxy-rejilla" />
            <text x={RENG_M.l - 6} y={rengSy(rengT) + 4} textAnchor="end" className="gxy-tick">{rengNum(rengT)}</text>
          </g>
        ))}
        <rect x={RENG_M.l} y={RENG_M.t} width={RENG_W - RENG_M.l - RENG_M.r} height={RENG_H - RENG_M.t - RENG_M.b} className="gxy-marco" />
        {rengSeries.map((rengS) => (
          <g key={rengS.nombre}>
            {!rengS.sinLinea && <polyline fill="none" strokeWidth="2" style={{ stroke: rengS.color }} strokeDasharray={rengS.punteada ? '5 4' : undefined} points={rengS.puntos.filter(([rengA, rengB]) => Number.isFinite(rengA) && Number.isFinite(rengB)).map(([rengA, rengB]) => `${rengSx(rengA).toFixed(1)},${rengSy(rengB).toFixed(1)}`).join(' ')} />}
            {rengS.marcador && rengS.puntos.filter(([rengA, rengB]) => Number.isFinite(rengA) && Number.isFinite(rengB)).map(([rengA, rengB], rengK) => <RengPunto key={rengK} x={rengSx(rengA)} y={rengSy(rengB)} forma={rengS.marcador!} color={rengS.color} />)}
          </g>
        ))}
        {rengMarcas.map((rengM, rengI) => (
          <g key={rengI}>
            <circle cx={rengSx(rengM.x)} cy={rengSy(rengM.y)} r="5" className="gxy-marca" />
            {rengM.etiqueta && <text x={rengSx(rengM.x) + 8} y={rengSy(rengM.y) - 8} className="gxy-etiqueta">{rengM.etiqueta}</text>}
          </g>
        ))}
        <text x={(RENG_M.l + RENG_W - RENG_M.r) / 2} y={RENG_H - 6} textAnchor="middle" className="gxy-titulo">{rengTituloX}</text>
        <text transform={`translate(14 ${(RENG_M.t + RENG_H - RENG_M.b) / 2}) rotate(-90)`} textAnchor="middle" className="gxy-titulo">{rengTituloY}</text>
      </svg>
      <figcaption className="gxy-leyenda">
        {rengSeries.map((rengS) => (
          <span key={rengS.nombre}>
            <i style={{ background: rengS.color }} /> {rengS.marcador && <b aria-hidden="true">{{ circulo: '●', cuadrado: '■', rombo: '◆', triangulo: '▲' }[rengS.marcador]}</b>} {rengS.nombre}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
