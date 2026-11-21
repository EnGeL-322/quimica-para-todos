import { RENG_PARAMETRO_RED } from './datosEnlace'

export interface RengSitio {
  ion: string
  elemento: string
  f: [number, number, number]
}

export interface RengEstructura {
  id: string
  nombre: string
  formula: string
  a: number
  c?: number
  base: RengSitio[]
  fuente: string
}

const RENG_FCC: Array<[number, number, number]> = [
  [0, 0, 0],
  [0.5, 0.5, 0],
  [0.5, 0, 0.5],
  [0, 0.5, 0.5]
]
const RENG_BCC: Array<[number, number, number]> = [
  [0, 0, 0],
  [0.5, 0.5, 0.5]
]
const rengDesplazar = (rengV: [number, number, number], rengD: [number, number, number]): [number, number, number] =>
  rengV.map((rengX, rengI) => (((rengX + (rengD[rengI] as number)) % 1) + 1) % 1) as [number, number, number]

const RENG_U_RUTILO = 0.30479

const RENG_WEST = 'A. R. West, Solid State Chemistry and its Applications, 2.ª ed. (Wiley, 2014), cap. 1'

export const RENG_ESTRUCTURAS: Record<string, RengEstructura> = {
  NaCl: {
    id: 'NaCl',
    nombre: 'Sal gema (NaCl)',
    formula: 'NaCl',
    a: RENG_PARAMETRO_RED.NaCl!.valor,
    base: [...RENG_FCC.map((rengP) => ({ ion: 'Na+', elemento: 'Na', f: rengP })), ...RENG_FCC.map((rengP) => ({ ion: 'Cl-', elemento: 'Cl', f: rengDesplazar(rengP, [0.5, 0, 0]) }))],
    fuente: RENG_WEST
  },
  MgO: {
    id: 'MgO',
    nombre: 'Óxido de magnesio (tipo sal gema)',
    formula: 'MgO',
    a: RENG_PARAMETRO_RED.MgO!.valor,
    base: [...RENG_FCC.map((rengP) => ({ ion: 'Mg2+', elemento: 'Mg', f: rengP })), ...RENG_FCC.map((rengP) => ({ ion: 'O2-', elemento: 'O', f: rengDesplazar(rengP, [0.5, 0, 0]) }))],
    fuente: RENG_WEST
  },
  CsCl: {
    id: 'CsCl',
    nombre: 'Cloruro de cesio',
    formula: 'CsCl',
    a: RENG_PARAMETRO_RED.CsCl!.valor,
    base: [
      { ion: 'Cs+', elemento: 'Cs', f: [0, 0, 0] },
      { ion: 'Cl-', elemento: 'Cl', f: [0.5, 0.5, 0.5] }
    ],
    fuente: RENG_WEST
  },
  Na: {
    id: 'Na',
    nombre: 'Sodio (cúbica centrada en el cuerpo, bcc)',
    formula: 'Na',
    a: RENG_PARAMETRO_RED.Na!.valor,
    base: RENG_BCC.map((rengP) => ({ ion: 'Na', elemento: 'Na', f: rengP })),
    fuente: RENG_WEST
  },
  Fe: {
    id: 'Fe',
    nombre: 'Hierro α (bcc)',
    formula: 'Fe',
    a: RENG_PARAMETRO_RED.Fe!.valor,
    base: RENG_BCC.map((rengP) => ({ ion: 'Fe', elemento: 'Fe', f: rengP })),
    fuente: RENG_WEST
  },
  Cu: {
    id: 'Cu',
    nombre: 'Cobre (cúbica centrada en las caras, fcc)',
    formula: 'Cu',
    a: RENG_PARAMETRO_RED.Cu!.valor,
    base: RENG_FCC.map((rengP) => ({ ion: 'Cu', elemento: 'Cu', f: rengP })),
    fuente: RENG_WEST
  },
  Au: {
    id: 'Au',
    nombre: 'Oro (fcc)',
    formula: 'Au',
    a: RENG_PARAMETRO_RED.Au!.valor,
    base: RENG_FCC.map((rengP) => ({ ion: 'Au', elemento: 'Au', f: rengP })),
    fuente: RENG_WEST
  },
  Ag: {
    id: 'Ag',
    nombre: 'Plata (fcc)',
    formula: 'Ag',
    a: RENG_PARAMETRO_RED.Ag!.valor,
    base: RENG_FCC.map((rengP) => ({ ion: 'Ag', elemento: 'Ag', f: rengP })),
    fuente: RENG_WEST
  },
  Al: {
    id: 'Al',
    nombre: 'Aluminio (fcc)',
    formula: 'Al',
    a: RENG_PARAMETRO_RED.Al!.valor,
    base: RENG_FCC.map((rengP) => ({ ion: 'Al', elemento: 'Al', f: rengP })),
    fuente: RENG_WEST
  },
  TiO2: {
    id: 'TiO2',
    nombre: 'Rutilo (TiO₂, tetragonal)',
    formula: 'TiO2',
    a: RENG_PARAMETRO_RED.TiO2!.valor,
    c: RENG_PARAMETRO_RED.TiO2c!.valor,
    base: [
      { ion: 'Ti4+', elemento: 'Ti', f: [0, 0, 0] },
      { ion: 'Ti4+', elemento: 'Ti', f: [0.5, 0.5, 0.5] },
      ...(
        [
          [RENG_U_RUTILO, RENG_U_RUTILO, 0],
          [1 - RENG_U_RUTILO, 1 - RENG_U_RUTILO, 0],
          [0.5 + RENG_U_RUTILO, 0.5 - RENG_U_RUTILO, 0.5],
          [0.5 - RENG_U_RUTILO, 0.5 + RENG_U_RUTILO, 0.5]
        ] as Array<[number, number, number]>
      ).map((rengF) => ({ ion: 'O2-', elemento: 'O', f: rengF }))
    ],
    fuente: `${RENG_WEST}; parámetro interno u del O: S. C. Abrahams y J. L. Bernstein, J. Chem. Phys. 1971, 55, 3206`
  },
  CaF2: {
    id: 'CaF2',
    nombre: 'Fluorita (CaF₂)',
    formula: 'CaF2',
    a: RENG_PARAMETRO_RED.CaF2!.valor,
    base: [
      ...RENG_FCC.map((rengP) => ({ ion: 'Ca2+', elemento: 'Ca', f: rengP })),
      ...[0.25, 0.75].flatMap((rengX) => [0.25, 0.75].flatMap((rengY) => [0.25, 0.75].map((rengZ) => ({ ion: 'F-', elemento: 'F', f: [rengX, rengY, rengZ] as [number, number, number] }))))
    ],
    fuente: RENG_WEST
  }
}

export const rengEjes = (rengE: RengEstructura): [number, number, number] => [rengE.a, rengE.a, rengE.c ?? rengE.a]

export interface RengAtomoRed {
  ion: string
  elemento: string
  p: [number, number, number]
  peso: number
}

const RENG_EPS = 1e-9

export function rengGenerarRed(rengE: RengEstructura, rengN = 1): RengAtomoRed[] {
  const rengOut: RengAtomoRed[] = []
  const rengVistos = new Set<string>()
  for (let rengI = 0; rengI <= rengN; rengI++)
    for (let rengJ = 0; rengJ <= rengN; rengJ++)
      for (let rengK = 0; rengK <= rengN; rengK++)
        for (const rengS of rengE.base) {
          const rengFr = [rengS.f[0] + rengI, rengS.f[1] + rengJ, rengS.f[2] + rengK]
          if (rengFr.some((rengX) => rengX > rengN + RENG_EPS)) continue
          const rengClave = `${rengS.ion}:${rengFr.map((rengX) => rengX.toFixed(4)).join(',')}`
          if (rengVistos.has(rengClave)) continue
          rengVistos.add(rengClave)
          const rengEnBorde = rengFr.filter((rengX) => Math.abs(rengX) < RENG_EPS || Math.abs(rengX - rengN) < RENG_EPS).length
          const RENG_L = rengEjes(rengE)
          rengOut.push({ ion: rengS.ion, elemento: rengS.elemento, p: rengFr.map((rengX, rengK) => rengX * RENG_L[rengK]!) as [number, number, number], peso: 1 / 2 ** rengEnBorde })
        }
  return rengOut
}

export function rengIonesPorCelda(rengE: RengEstructura): Map<string, number> {
  const rengM = new Map<string, number>()
  for (const rengA of rengGenerarRed(rengE, 1)) rengM.set(rengA.ion, (rengM.get(rengA.ion) ?? 0) + rengA.peso)
  return rengM
}

export const rengAtomosPorCelda = (rengE: RengEstructura): number => [...rengIonesPorCelda(rengE).values()].reduce((rengA, rengB) => rengA + rengB, 0)

export function rengUnidadesFormula(rengE: RengEstructura): number {
  const rengCuentas = [...rengIonesPorCelda(rengE).values()].map((rengX) => Math.round(rengX))
  const rengMcd = (rengA: number, rengB: number): number => (rengB === 0 ? rengA : rengMcd(rengB, rengA % rengB))
  return rengCuentas.reduce(rengMcd)
}

export function rengCoordinacion(rengE: RengEstructura, rengIon: string): { nc: number; distancia: number } {
  const rengRed = rengGenerarRed(rengE, 3)
  const rengCentro = rengE.base.find((rengS) => rengS.ion === rengIon)
  if (!rengCentro) throw new Error(`La estructura ${rengE.id} no tiene el ion ${rengIon}.`)
  const RENG_L = rengEjes(rengE)
  const rengP0 = rengCentro.f.map((rengX, rengK) => (rengX + 1) * RENG_L[rengK]!)
  const rengEsIon = /[+-]$/.test(rengIon)
  const rengSigno = rengIon.endsWith('+')
  const rengOpuestos = rengEsIon
    ? rengRed.filter((rengA) => rengA.ion.endsWith('+') !== rengSigno)
    : rengRed.filter((rengA) => Math.hypot(rengA.p[0] - rengP0[0]!, rengA.p[1] - rengP0[1]!, rengA.p[2] - rengP0[2]!) > 1e-6)
  const rengD = rengOpuestos.map((rengA) => Math.hypot(rengA.p[0] - rengP0[0]!, rengA.p[1] - rengP0[1]!, rengA.p[2] - rengP0[2]!))
  const rengMin = Math.min(...rengD)
  return { nc: rengD.filter((rengX) => rengX <= rengMin * 1.1).length, distancia: rengMin }
}
