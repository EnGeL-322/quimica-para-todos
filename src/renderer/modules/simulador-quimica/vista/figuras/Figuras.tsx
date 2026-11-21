import { useId } from 'react'
import { RENG_NOMBRE_FLECHA, rengDisponerNiveles, rengEscalaLineal, rengFormatoEje, rengGeometriaFlecha, rengMarcasEje, rengRutaSerie, type RengNivelEntrada, type RengSerieFigura, type RengTipoFlecha } from '../../aprender/figuras/geometria'
import './figuras.css'

export interface RengFiguraProps {
  numero: string
  titulo: string
  pie: string
  alternativo: string
  ancho: number
  alto: number
  children: React.ReactNode
}

export function RengFigura({ numero: rengNumero, titulo: rengTitulo, pie: rengPie, alternativo: rengAlternativo, ancho: rengAncho, alto: rengAlto, children: rengChildren }: RengFiguraProps): React.JSX.Element {
  const rengId = useId()
  return (
    <figure className="q-fig" data-figura={rengNumero}>
      <svg viewBox={`0 0 ${rengAncho} ${rengAlto}`} role="img" aria-labelledby={`${rengId}-t ${rengId}-d`} className="q-fig-svg">
        <title id={`${rengId}-t`}>{rengTitulo}</title>
        <desc id={`${rengId}-d`}>{rengAlternativo}</desc>
        {rengChildren}
      </svg>
      <figcaption>
        <strong>Figura {rengNumero}.</strong> {rengPie}
      </figcaption>
    </figure>
  )
}

const RENG_TRAZOS = ['', '7 4', '2 4', '10 3 2 3'] as const
const RENG_MARCADORES = ['circulo', 'cuadrado', 'triangulo', 'rombo'] as const
const RENG_COLORES = ['var(--accent)', 'var(--accent-2)', 'var(--text-2)', 'var(--text)'] as const

function RengMarcador({ forma: rengForma, x: rengX, y: rengY }: { forma: (typeof RENG_MARCADORES)[number]; x: number; y: number }): React.JSX.Element {
  const rengR = 4
  if (rengForma === 'cuadrado') return <rect x={rengX - rengR} y={rengY - rengR} width={rengR * 2} height={rengR * 2} />
  if (rengForma === 'triangulo') return <polygon points={`${rengX},${rengY - rengR - 1} ${rengX + rengR + 1},${rengY + rengR} ${rengX - rengR - 1},${rengY + rengR}`} />
  if (rengForma === 'rombo') return <polygon points={`${rengX},${rengY - rengR - 1} ${rengX + rengR + 1},${rengY} ${rengX},${rengY + rengR + 1} ${rengX - rengR - 1},${rengY}`} />
  return <circle cx={rengX} cy={rengY} r={rengR} />
}

export interface RengEjeFigura {
  min: number
  max: number
  titulo: string
}

export interface RengEjesFiguraProps extends Omit<RengFiguraProps, 'children' | 'ancho' | 'alto'> {
  x: RengEjeFigura
  y: RengEjeFigura
  series: readonly RengSerieFigura[]
  ancho?: number
  alto?: number
}

export function RengEjesFigura({ x: rengEx, y: rengEy, series: rengSeries, ancho: rengAncho = 520, alto: rengAlto = 300, ...rengResto }: RengEjesFiguraProps): React.JSX.Element {
  const rengM = { l: 62, r: 18, t: 16, b: 50 }
  const rengX = rengEscalaLineal(rengEx.min, rengEx.max, rengM.l, rengAncho - rengM.r)
  const rengY = rengEscalaLineal(rengEy.min, rengEy.max, rengAlto - rengM.b, rengM.t)
  const rengMx = rengMarcasEje(rengEx.min, rengEx.max)
  const rengMy = rengMarcasEje(rengEy.min, rengEy.max)
  return (
    <RengFigura ancho={rengAncho} alto={rengAlto + (rengSeries.length > 1 ? 22 : 0)} {...rengResto}>
      <g className="q-fig-ejes">
        <line x1={rengM.l} y1={rengAlto - rengM.b} x2={rengAncho - rengM.r} y2={rengAlto - rengM.b} />
        <line x1={rengM.l} y1={rengM.t} x2={rengM.l} y2={rengAlto - rengM.b} />
        {rengMx.map((rengV) => (
          <g key={`x${rengV}`}>
            <line x1={rengX(rengV)} y1={rengAlto - rengM.b} x2={rengX(rengV)} y2={rengAlto - rengM.b + 5} />
            <text x={rengX(rengV)} y={rengAlto - rengM.b + 18} textAnchor="middle" className="q-fig-texto">
              {rengFormatoEje(rengV)}
            </text>
          </g>
        ))}
        {rengMy.map((rengV) => (
          <g key={`y${rengV}`}>
            <line x1={rengM.l - 5} y1={rengY(rengV)} x2={rengM.l} y2={rengY(rengV)} />
            <text x={rengM.l - 8} y={rengY(rengV) + 4} textAnchor="end" className="q-fig-texto">
              {rengFormatoEje(rengV)}
            </text>
          </g>
        ))}
        <text x={(rengM.l + rengAncho - rengM.r) / 2} y={rengAlto - 10} textAnchor="middle" className="q-fig-texto q-fig-titulo-eje">
          {rengEx.titulo}
        </text>
        <text x={14} y={(rengM.t + rengAlto - rengM.b) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(rengM.t + rengAlto - rengM.b) / 2})`} className="q-fig-texto q-fig-titulo-eje">
          {rengEy.titulo}
        </text>
      </g>
      {rengSeries.map((rengS, rengI) => {
        const rengForma = RENG_MARCADORES[rengI % RENG_MARCADORES.length]!
        const rengColor = RENG_COLORES[rengI % RENG_COLORES.length]!
        return (
          <g key={rengS.nombre} className="q-fig-serie" style={{ color: rengColor }} data-serie={rengS.nombre}>
            <path d={rengRutaSerie(rengS, rengX, rengY)} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray={RENG_TRAZOS[rengI % RENG_TRAZOS.length] || undefined} />
            {rengS.puntos.length <= 24 && rengS.puntos.map(([rengA, rengB]) => <RengMarcador key={`${rengA}-${rengB}`} forma={rengForma} x={rengX(rengA)} y={rengY(rengB)} />)}
          </g>
        )
      })}
      {rengSeries.length > 1 && (
        <g className="q-fig-leyenda" transform={`translate(${rengM.l} ${rengAlto + 6})`}>
          {rengSeries.map((rengS, rengI) => (
            <g key={rengS.nombre} transform={`translate(${rengI * 150} 0)`} style={{ color: RENG_COLORES[rengI % RENG_COLORES.length] }}>
              <line x1={0} y1={8} x2={26} y2={8} stroke="currentColor" strokeWidth={2} strokeDasharray={RENG_TRAZOS[rengI % RENG_TRAZOS.length] || undefined} />
              <g className="q-fig-serie">
                <RengMarcador forma={RENG_MARCADORES[rengI % RENG_MARCADORES.length]!} x={13} y={8} />
              </g>
              <text x={32} y={12} className="q-fig-texto">
                {rengS.nombre}
              </text>
            </g>
          ))}
        </g>
      )}
    </RengFigura>
  )
}

export interface RengTransicionNiveles {
  desde: string
  hasta: string
  etiqueta: string
}

export interface RengDiagramaNivelesProps extends Omit<RengFiguraProps, 'children' | 'ancho' | 'alto'> {
  niveles: readonly RengNivelEntrada[]
  tituloEje: string
  transiciones?: readonly RengTransicionNiveles[]
  ancho?: number
  alto?: number
}

export function RengDiagramaNiveles({ niveles: rengNiveles, tituloEje: rengTituloEje, transiciones: rengTransiciones = [], ancho: rengAncho = 420, alto: rengAlto = 280, ...rengResto }: RengDiagramaNivelesProps): React.JSX.Element {
  const rengDispuestos = rengDisponerNiveles(rengNiveles, 22, rengAlto - 22, 18)
  const rengPorId = new Map(rengDispuestos.map((rengN) => [rengN.id, rengN]))
  const rengX0 = 70
  const rengX1 = rengX0 + 120
  return (
    <RengFigura ancho={rengAncho} alto={rengAlto} {...rengResto}>
      <g className="q-fig-ejes">
        <line x1={40} y1={rengAlto - 10} x2={40} y2={12} />
        <polygon points={`40,6 35,16 45,16`} className="q-fig-punta" />
        <text x={18} y={rengAlto / 2} textAnchor="middle" transform={`rotate(-90 18 ${rengAlto / 2})`} className="q-fig-texto q-fig-titulo-eje">
          {rengTituloEje}
        </text>
      </g>
      {rengDispuestos.map((rengN) => (
        <g key={rengN.id} data-nivel={rengN.id}>
          <line x1={rengX0} y1={rengN.y} x2={rengX1} y2={rengN.y} className="q-fig-nivel" />
          {Math.abs(rengN.yEtiqueta - rengN.y) > 1 && <line x1={rengX1} y1={rengN.y} x2={rengX1 + 14} y2={rengN.yEtiqueta - 4} className="q-fig-guia" />}
          <text x={rengX1 + 18} y={rengN.yEtiqueta} className="q-fig-texto">
            {rengN.etiqueta}
          </text>
        </g>
      ))}
      {rengTransiciones.map((rengT, rengI) => {
        const rengA = rengPorId.get(rengT.desde)
        const rengB = rengPorId.get(rengT.hasta)
        if (!rengA || !rengB) throw new Error(`Transición con nivel inexistente: ${rengT.desde} → ${rengT.hasta}`)
        const rengXt = rengX0 + 24 + rengI * 30
        const rengSube = rengB.y < rengA.y
        const rengPuntaY = rengB.y + (rengSube ? 1 : -1)
        return (
          <g key={`${rengT.desde}-${rengT.hasta}`} data-transicion={`${rengT.desde}-${rengT.hasta}`}>
            <line x1={rengXt} y1={rengA.y} x2={rengXt} y2={rengB.y + (rengSube ? 8 : -8)} className="q-fig-transicion" />
            <polygon points={`${rengXt},${rengPuntaY} ${rengXt - 4},${rengPuntaY + (rengSube ? 9 : -9)} ${rengXt + 4},${rengPuntaY + (rengSube ? 9 : -9)}`} className="q-fig-punta" />
            <text x={rengXt + 6} y={(rengA.y + rengB.y) / 2} className="q-fig-texto q-fig-pequeno">
              {rengT.etiqueta}
            </text>
          </g>
        )
      })}
    </RengFigura>
  )
}

export interface RengFlechaReaccionProps {
  tipo: RengTipoFlecha
  arriba?: string
  abajo?: string
}

export function RengFlechaReaccion({ tipo: rengTipo, arriba: rengArriba, abajo: rengAbajo }: RengFlechaReaccionProps): React.JSX.Element {
  const rengAncho = Math.max(56, 8 * Math.max(rengArriba?.length ?? 0, rengAbajo?.length ?? 0) + 16)
  const rengG = rengGeometriaFlecha(rengTipo, 4, rengAncho - 4, 22)
  const rengNombre = [RENG_NOMBRE_FLECHA[rengTipo], rengArriba ? `encima: ${rengArriba}` : '', rengAbajo ? `debajo: ${rengAbajo}` : ''].filter(Boolean).join('; ')
  return (
    <svg className="q-fig-flecha" viewBox={`0 0 ${rengAncho} 44`} width={rengAncho} height={44} role="img" aria-label={rengNombre} data-flecha={rengTipo}>
      {rengArriba && (
        <text x={rengAncho / 2} y={11} textAnchor="middle" className="q-fig-texto q-fig-pequeno">
          {rengArriba}
        </text>
      )}
      {rengG.trazos.map((rengD) => (
        <path key={rengD} d={rengD} className="q-fig-trazo" />
      ))}
      {rengG.puntas.map((rengP) => (
        <polygon key={rengP} points={rengP} className="q-fig-punta" />
      ))}
      {rengAbajo && (
        <text x={rengAncho / 2} y={41} textAnchor="middle" className="q-fig-texto q-fig-pequeno">
          {rengAbajo}
        </text>
      )}
    </svg>
  )
}
