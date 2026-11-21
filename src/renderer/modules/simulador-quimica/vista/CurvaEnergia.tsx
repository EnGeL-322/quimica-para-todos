import { useMemo, useState } from 'react'
import { rengMorse, type RengParametrosMorse } from '../nucleo/datosEnlace'

interface RengProps {
  p: RengParametrosMorse
  r: number
  titulo: string
}

const RENG_W = 340
const RENG_H = 210
const RENG_M = { izq: 46, der: 12, arr: 14, aba: 34 }
const rengComa = (rengX: number, rengD: number): string => rengX.toFixed(rengD).replace('.', ',')

export function RengCurvaEnergia({ p: rengP, r: rengR, titulo: rengTitulo }: RengProps): React.JSX.Element {
  const [rengCursor, rengSetCursor] = useState<number | null>(null)
  const rengRMin = rengP.re * 0.55
  const rengRMax = rengP.re * 3.5
  const rengVMin = -rengP.De * 1.12
  const rengVMax = rengP.De * 0.7
  const rengX = (rengRr: number): number => RENG_M.izq + ((rengRr - rengRMin) / (rengRMax - rengRMin)) * (RENG_W - RENG_M.izq - RENG_M.der)
  const rengY = (rengV: number): number => RENG_M.arr + ((rengVMax - Math.min(rengVMax, rengV)) / (rengVMax - rengVMin)) * (RENG_H - RENG_M.arr - RENG_M.aba)
  const rengRDeX = (rengPx: number): number => rengRMin + ((rengPx - RENG_M.izq) / (RENG_W - RENG_M.izq - RENG_M.der)) * (rengRMax - rengRMin)

  const rengCamino = useMemo(() => {
    const rengPts: string[] = []
    for (let rengI = 0; rengI <= 160; rengI++) {
      const rengRr = rengRMin + ((rengRMax - rengRMin) * rengI) / 160
      rengPts.push(`${rengI === 0 ? 'M' : 'L'}${rengX(rengRr).toFixed(1)},${rengY(rengMorse(rengP, rengRr)).toFixed(1)}`)
    }
    return rengPts.join(' ')
  }, [rengP])

  const rengRr = Math.min(rengRMax, Math.max(rengRMin, rengR))
  const rengVAct = rengMorse(rengP, rengRr)
  const rengTicksR = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7].filter((rengT) => rengT >= rengRMin && rengT <= rengRMax)
  const rengPaso = Math.pow(10, Math.floor(Math.log10(rengP.De))) * (rengP.De / Math.pow(10, Math.floor(Math.log10(rengP.De))) > 3 ? 2 : 1)
  const rengTicksV: number[] = []
  for (let rengV = Math.ceil(rengVMin / rengPaso) * rengPaso; rengV <= rengVMax; rengV += rengPaso) rengTicksV.push(rengV)
  const rengRC = rengCursor === null ? null : rengRDeX(rengCursor)

  return (
    <figure className="curva" style={{ margin: 0 }}>
      <figcaption className="sm" style={{ fontWeight: 650, marginBottom: 4 }}>
        {rengTitulo}
      </figcaption>
      <svg
        viewBox={`0 0 ${RENG_W} ${RENG_H}`}
        width="100%"
        role="img"
        aria-label={`Curva de energía potencial. Mínimo en ${rengComa(rengP.re, 3)} Å con profundidad ${rengComa(rengP.De, 0)} kJ/mol. Punto actual: ${rengComa(rengRr, 2)} Å.`}
        onMouseMove={(rengE) => {
          const rengB = rengE.currentTarget.getBoundingClientRect()
          const rengPx = ((rengE.clientX - rengB.left) / rengB.width) * RENG_W
          rengSetCursor(rengPx >= RENG_M.izq && rengPx <= RENG_W - RENG_M.der ? rengPx : null)
        }}
        onMouseLeave={() => rengSetCursor(null)}
      >
        {rengTicksV.map((rengV) => (
          <g key={rengV}>
            <line x1={RENG_M.izq} x2={RENG_W - RENG_M.der} y1={rengY(rengV)} y2={rengY(rengV)} className="curva-rejilla" />
            <text x={RENG_M.izq - 6} y={rengY(rengV) + 4} textAnchor="end" className="curva-eje">
              {Math.round(rengV)}
            </text>
          </g>
        ))}
        {rengTicksR.map((rengT) => (
          <text key={rengT} x={rengX(rengT)} y={RENG_H - RENG_M.aba + 16} textAnchor="middle" className="curva-eje">
            {rengComa(rengT, 1)}
          </text>
        ))}
        <text x={(RENG_W + RENG_M.izq) / 2} y={RENG_H - 4} textAnchor="middle" className="curva-eje">
          distancia entre núcleos (Å)
        </text>
        <text x={12} y={(RENG_H - RENG_M.aba) / 2} textAnchor="middle" className="curva-eje" transform={`rotate(-90 12 ${(RENG_H - RENG_M.aba) / 2})`}>
          energía (kJ/mol)
        </text>
        <line x1={RENG_M.izq} x2={RENG_W - RENG_M.der} y1={rengY(0)} y2={rengY(0)} className="curva-cero" />
        <line x1={rengX(rengP.re)} x2={rengX(rengP.re)} y1={rengY(-rengP.De)} y2={RENG_H - RENG_M.aba} className="curva-marca" />
        <line x1={rengX(rengP.re)} x2={RENG_W - RENG_M.der} y1={rengY(-rengP.De)} y2={rengY(-rengP.De)} className="curva-marca" />
        <text x={rengX(rengP.re) + 4} y={RENG_H - RENG_M.aba - 4} className="curva-eje">
          rₑ
        </text>
        <text x={RENG_W - RENG_M.der - 2} y={rengY(-rengP.De / 2)} textAnchor="end" className="curva-eje">
          Dₑ = {rengComa(rengP.De, 0)}
        </text>
        <path d={rengCamino} className="curva-linea" />
        {rengRC !== null && (
          <g>
            <line x1={rengCursor!} x2={rengCursor!} y1={RENG_M.arr} y2={RENG_H - RENG_M.aba} className="curva-cursor" />
            <rect x={Math.min(rengCursor! + 6, RENG_W - 120)} y={RENG_M.arr + 2} width={112} height={34} rx={6} className="curva-tip" />
            <text x={Math.min(rengCursor! + 12, RENG_W - 114)} y={RENG_M.arr + 16} className="curva-tip-texto">
              r = {rengComa(rengRC, 2)} Å
            </text>
            <text x={Math.min(rengCursor! + 12, RENG_W - 114)} y={RENG_M.arr + 30} className="curva-tip-texto">
              E = {rengComa(rengMorse(rengP, rengRC), 0)} kJ/mol
            </text>
          </g>
        )}
        <circle cx={rengX(rengRr)} cy={rengY(rengVAct)} r={6} className="curva-punto" />
      </svg>
      <details className="sm">
        <summary>Ver valores en tabla</summary>
        <table className="table tabla-datos">
          <thead>
            <tr>
              <th>r (Å)</th>
              <th>E (kJ/mol)</th>
            </tr>
          </thead>
          <tbody>
            {[0.8, 0.9, 1, 1.2, 1.5, 2, 3].map((rengF) => (
              <tr key={rengF}>
                <td>{rengComa(rengP.re * rengF, 3)}</td>
                <td>{rengComa(rengMorse(rengP, rengP.re * rengF), 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}
