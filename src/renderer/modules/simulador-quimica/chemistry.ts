import { RENG_DATOS_3D, rengRadiosDibujo } from './nucleo/elementos3d'

export interface RengAtomo {
  el: string
  p: [number, number, number]
}

export interface RengMolecula {
  id: string
  nombre: string
  formula: string
  atomos: RengAtomo[]
  geometria: string
  angulo?: string
  polar: boolean
  nota: string
  orden?: Record<string, number>
  enlaces?: Array<{ a: number; b: number; orden: number }>
}

const RENG_TONOS_APP: Record<string, number> = { H: 0xf5f5f5, C: 0x555a63, N: 0x3b5bff, O: 0xff3b30, Cl: 0x3bd16f, S: 0xffd23b }

export const RENG_ELEMENTOS: Record<string, { color: number; rc: number; rv: number; aproximado: boolean }> = Object.fromEntries(
  RENG_DATOS_3D.map((rengD) => {
    const rengR = rengRadiosDibujo(rengD.simbolo)
    return [rengD.simbolo, { ...rengR, color: RENG_TONOS_APP[rengD.simbolo] ?? rengR.color }]
  })
)

const rengRad = (rengD: number): number => (rengD * Math.PI) / 180

function rengRing(rengN: number, rengR: number, rengZ = 0, rengPhase = 0): Array<[number, number, number]> {
  return Array.from({ length: rengN }, (_, rengK) => [rengR * Math.cos(rengPhase + (2 * Math.PI * rengK) / rengN), rengR * Math.sin(rengPhase + (2 * Math.PI * rengK) / rengN), rengZ] as [number, number, number])
}

function rengPyramidal(rengCentral: string, RENG_L: number, rengHxhDeg: number): RengAtomo[] {
  const rengCosA = Math.cos(rengRad(rengHxhDeg))
  const rengSin2 = (1 - rengCosA) / 1.5
  const rengPhi = Math.asin(Math.sqrt(rengSin2))
  return [
    { el: rengCentral, p: [0, 0, 0] },
    ...rengRing(3, RENG_L * Math.sin(rengPhi), -RENG_L * Math.cos(rengPhi)).map((rengP): RengAtomo => ({ el: 'H', p: rengP }))
  ]
}

function rengWater(): RengAtomo[] {
  const RENG_L = 0.9572
  const rengHalf = rengRad(104.52 / 2)
  return [
    { el: 'O', p: [0, 0, 0] },
    { el: 'H', p: [RENG_L * Math.sin(rengHalf), RENG_L * Math.cos(rengHalf), 0] },
    { el: 'H', p: [-RENG_L * Math.sin(rengHalf), RENG_L * Math.cos(rengHalf), 0] }
  ]
}

function rengEthylene(): RengAtomo[] {
  const rengCc = 1.339
  const rengCh = 1.087
  const rengOut = rengRad(180 - (360 - 117.4) / 2)
  const rengHx = rengCc / 2 + rengCh * Math.cos(rengOut)
  const rengHy = rengCh * Math.sin(rengOut)
  return [
    { el: 'C', p: [-rengCc / 2, 0, 0] },
    { el: 'C', p: [rengCc / 2, 0, 0] },
    { el: 'H', p: [rengHx, rengHy, 0] },
    { el: 'H', p: [rengHx, -rengHy, 0] },
    { el: 'H', p: [-rengHx, rengHy, 0] },
    { el: 'H', p: [-rengHx, -rengHy, 0] }
  ]
}

function rengBenzene(): RengAtomo[] {
  return [...rengRing(6, 1.397).map((rengP): RengAtomo => ({ el: 'C', p: rengP })), ...rengRing(6, 1.397 + 1.084).map((rengP): RengAtomo => ({ el: 'H', p: rengP }))]
}

function rengMethane(): RengAtomo[] {
  const rengD = 1.087 / Math.sqrt(3)
  return [
    { el: 'C', p: [0, 0, 0] },
    { el: 'H', p: [rengD, rengD, rengD] },
    { el: 'H', p: [rengD, -rengD, -rengD] },
    { el: 'H', p: [-rengD, rengD, -rengD] },
    { el: 'H', p: [-rengD, -rengD, rengD] }
  ]
}

const rengDiatomic = (rengA: string, rengB: string, RENG_L: number): RengAtomo[] => [
  { el: rengA, p: [-RENG_L / 2, 0, 0] },
  { el: rengB, p: [RENG_L / 2, 0, 0] }
]

export const RENG_MOLECULAS: RengMolecula[] = [
  { id: 'h2o', nombre: 'Agua', formula: 'H₂O', atomos: rengWater(), geometria: 'Angular (AX₂E₂)', angulo: '104,5°', polar: true, nota: 'Los dos pares libres del oxígeno comprimen el ángulo por debajo de los 109,5° del tetraedro. Su polaridad explica la tensión superficial y su poder disolvente.' },
  { id: 'co2', nombre: 'Dióxido de carbono', formula: 'CO₂', atomos: [{ el: 'O', p: [-1.16, 0, 0] }, { el: 'C', p: [0, 0, 0] }, { el: 'O', p: [1.16, 0, 0] }], geometria: 'Lineal (AX₂)', angulo: '180°', polar: false, nota: 'Cada enlace C=O es polar, pero al ser lineal los momentos dipolares se cancelan: la molécula es apolar.', orden: { '0-1': 2, '1-2': 2 } },
  { id: 'ch4', nombre: 'Metano', formula: 'CH₄', atomos: rengMethane(), geometria: 'Tetraédrica (AX₄)', angulo: '109,5°', polar: false, nota: 'Cuatro enlaces equivalentes con la máxima separación posible. Es el hidrocarburo más simple.' },
  { id: 'nh3', nombre: 'Amoníaco', formula: 'NH₃', atomos: rengPyramidal('N', 1.012, 106.7), geometria: 'Piramidal trigonal (AX₃E)', angulo: '106,7°', polar: true, nota: 'Un par libre en el nitrógeno distorsiona el tetraedro. Es base débil y forma puentes de hidrógeno.' },
  { id: 'c2h4', nombre: 'Etileno', formula: 'C₂H₄', atomos: rengEthylene(), geometria: 'Plana trigonal (sp²)', angulo: '117,4°', polar: false, nota: 'Doble enlace C=C: rígido e impide la rotación, base de la química de los polímeros (polietileno).', orden: { '0-1': 2 } },
  { id: 'c2h2', nombre: 'Acetileno', formula: 'C₂H₂', atomos: [{ el: 'H', p: [-1.6645, 0, 0] }, { el: 'C', p: [-0.6015, 0, 0] }, { el: 'C', p: [0.6015, 0, 0] }, { el: 'H', p: [1.6645, 0, 0] }], geometria: 'Lineal (sp)', angulo: '180°', polar: false, nota: 'Triple enlace C≡C, el más corto y fuerte entre dos carbonos.', orden: { '1-2': 3 } },
  { id: 'c6h6', nombre: 'Benceno', formula: 'C₆H₆', atomos: rengBenzene(), geometria: 'Hexágono plano (aromático)', angulo: '120°', polar: false, nota: 'Seis electrones π deslocalizados sobre el anillo le dan una estabilidad especial (aromaticidad).', orden: { '0-1': 2, '2-3': 2, '4-5': 2 } },
  { id: 'hcl', nombre: 'Cloruro de hidrógeno', formula: 'HCl', atomos: rengDiatomic('H', 'Cl', 1.274), geometria: 'Lineal (diatómica)', polar: true, nota: 'La diferencia de electronegatividad entre Cl y H genera un dipolo marcado; en agua forma ácido clorhídrico.' },
  { id: 'o2', nombre: 'Oxígeno', formula: 'O₂', atomos: rengDiatomic('O', 'O', 1.208), geometria: 'Lineal (diatómica)', polar: false, nota: 'Doble enlace. Curiosamente es paramagnético: tiene dos electrones desapareados.', orden: { '0-1': 2 } },
  { id: 'n2', nombre: 'Nitrógeno', formula: 'N₂', atomos: rengDiatomic('N', 'N', 1.098), geometria: 'Lineal (diatómica)', polar: false, nota: 'Triple enlace de energía enorme (≈ 945 kJ/mol): por eso el N₂ del aire es tan poco reactivo.', orden: { '0-1': 3 } }
]

export interface RengEnlace {
  a: number
  b: number
}

export function rengDetectarEnlaces(rengAtomos: RengAtomo[]): RengEnlace[] {
  const rengOut: RengEnlace[] = []
  for (let rengI = 0; rengI < rengAtomos.length; rengI++) {
    for (let rengJ = rengI + 1; rengJ < rengAtomos.length; rengJ++) {
      const RENG_A = rengAtomos[rengI] as RengAtomo
      const RENG_B = rengAtomos[rengJ] as RengAtomo
      const rengD = Math.hypot(RENG_A.p[0] - RENG_B.p[0], RENG_A.p[1] - RENG_B.p[1], RENG_A.p[2] - RENG_B.p[2])
      const rengLim = 1.25 * ((RENG_ELEMENTOS[RENG_A.el]?.rc ?? 0.8) + (RENG_ELEMENTOS[RENG_B.el]?.rc ?? 0.8))
      if (rengD < rengLim) rengOut.push({ a: rengI, b: rengJ })
    }
  }
  return rengOut
}

export function rengDistancia(rengA: RengAtomo, rengB: RengAtomo): number {
  return Math.hypot(rengA.p[0] - rengB.p[0], rengA.p[1] - rengB.p[1], rengA.p[2] - rengB.p[2])
}

export function rengAngulo(rengA: RengAtomo, rengV: RengAtomo, rengB: RengAtomo): number {
  const rengU = [rengA.p[0] - rengV.p[0], rengA.p[1] - rengV.p[1], rengA.p[2] - rengV.p[2]]
  const rengW = [rengB.p[0] - rengV.p[0], rengB.p[1] - rengV.p[1], rengB.p[2] - rengV.p[2]]
  const rengDot = rengU[0]! * rengW[0]! + rengU[1]! * rengW[1]! + rengU[2]! * rengW[2]!
  return (Math.acos(rengDot / (Math.hypot(...rengU) * Math.hypot(...rengW))) * 180) / Math.PI
}
