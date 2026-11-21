import { RENG_ELEMENTOS as RENG_TABLA } from '../../tabla-periodica/data'

export interface RengDatos3D {
  simbolo: string
  color: number
  rc: number | null
  rv: number | null
  fuenteRv: 'Bondi 1964' | 'Mantina 2009' | null
  colorGenerico: boolean
}

export const RENG_FUENTES_3D = {
  color: 'Jmol, esquema de colores CPK (jmol.sourceforge.net/jscolors)',
  rc: 'Cordero et al., Dalton Trans. 2008, 2832–2838',
  rvBondi: 'Bondi, J. Phys. Chem. 1964, 68, 441–451',
  rvMantina: 'Mantina et al., J. Phys. Chem. A 2009, 113, 5806–5812'
} as const

const RENG_COLOR: number[] = [
  0xffffff, 0xd9ffff, 0xcc80ff, 0xc2ff00, 0xffb5b5, 0x909090, 0x3050f8, 0xff0d0d, 0x90e050, 0xb3e3f5,
  0xab5cf2, 0x8aff00, 0xbfa6a6, 0xf0c8a0, 0xff8000, 0xffff30, 0x1ff01f, 0x80d1e3, 0x8f40d4, 0x3dff00,
  0xe6e6e6, 0xbfc2c7, 0xa6a6ab, 0x8a99c7, 0x9c7ac7, 0xe06633, 0xf090a0, 0x50d050, 0xc88033, 0x7d80b0,
  0xc28f8f, 0x668f8f, 0xbd80e3, 0xffa100, 0xa62929, 0x5cb8d1, 0x702eb0, 0x00ff00, 0x94ffff, 0x94e0e0,
  0x73c2c9, 0x54b5b5, 0x3b9e9e, 0x248f8f, 0x0a7d8c, 0x006985, 0xc0c0c0, 0xffd98f, 0xa67573, 0x668080,
  0x9e63b5, 0xd47a00, 0x940094, 0x429eb0, 0x57178f, 0x00c900, 0x70d4ff, 0xffffc7, 0xd9ffc7, 0xc7ffc7,
  0xa3ffc7, 0x8fffc7, 0x61ffc7, 0x45ffc7, 0x30ffc7, 0x1fffc7, 0x00ff9c, 0x00e675, 0x00d452, 0x00bf38,
  0x00ab24, 0x4dc2ff, 0x4da6ff, 0x2194d6, 0x267dab, 0x266696, 0x175487, 0xd0d0e0, 0xffd123, 0xb8b8d0,
  0xa6544d, 0x575961, 0x9e4fb5, 0xab5c00, 0x754f45, 0x428296, 0x420066, 0x007d00, 0x70abfa, 0x00baff,
  0x00a1ff, 0x008fff, 0x0080ff, 0x006bff, 0x545cf2, 0x785ce3, 0x8a4fe3, 0xa136d4, 0xb31fd4, 0xb31fba,
  0xb30da6, 0xbd0d87, 0xc70066, 0xcc0059, 0xd1004f, 0xd90045, 0xe00038, 0xe6002e, 0xeb0026
]

const RENG_RC: number[] = [
  0.31, 0.28, 1.28, 0.96, 0.84, 0.76, 0.71, 0.66, 0.57, 0.58,
  1.66, 1.41, 1.21, 1.11, 1.07, 1.05, 1.02, 1.06, 2.03, 1.76,
  1.7, 1.6, 1.53, 1.39, 1.39, 1.32, 1.26, 1.24, 1.32, 1.22,
  1.22, 1.2, 1.19, 1.2, 1.2, 1.16, 2.2, 1.95, 1.9, 1.75,
  1.64, 1.54, 1.47, 1.46, 1.42, 1.39, 1.45, 1.44, 1.42, 1.39,
  1.39, 1.38, 1.39, 1.4, 2.44, 2.15, 2.07, 2.04, 2.03, 2.01,
  1.99, 1.98, 1.98, 1.96, 1.94, 1.92, 1.92, 1.89, 1.9, 1.87,
  1.87, 1.75, 1.7, 1.62, 1.51, 1.44, 1.41, 1.36, 1.36, 1.32,
  1.45, 1.46, 1.48, 1.4, 1.5, 1.5, 2.6, 2.21, 2.15, 2.06,
  2.0, 1.96, 1.9, 1.87, 1.8, 1.69
]

const RENG_BONDI: Record<string, number> = {
  H: 1.2, He: 1.4, Li: 1.82, C: 1.7, N: 1.55, O: 1.52, F: 1.47, Ne: 1.54, Na: 2.27, Mg: 1.73,
  Si: 2.1, P: 1.8, S: 1.8, Cl: 1.75, Ar: 1.88, K: 2.75, Ni: 1.63, Cu: 1.4, Zn: 1.39, Ga: 1.87,
  As: 1.85, Se: 1.9, Br: 1.85, Kr: 2.02, Pd: 1.63, Ag: 1.72, Cd: 1.58, In: 1.93, Sn: 2.17, Te: 2.06,
  I: 1.98, Xe: 2.16, Pt: 1.75, Au: 1.66, Hg: 1.55, Tl: 1.96, Pb: 2.02, U: 1.86
}

const RENG_MANTINA: Record<string, number> = {
  Be: 1.53, B: 1.92, Al: 1.84, Ca: 2.31, Ge: 2.11, Rb: 3.03, Sr: 2.49, Sb: 2.06, Cs: 3.43, Ba: 2.68,
  Bi: 2.07, Po: 1.97, At: 2.02, Rn: 2.2, Fr: 3.48, Ra: 2.83
}

const RENG_GRIS_GENERICO = 0x9aa3b5

export const RENG_DATOS_3D: RengDatos3D[] = RENG_TABLA.map((rengE) => {
  const rengRvB = RENG_BONDI[rengE.simbolo]
  const rengRvM = RENG_MANTINA[rengE.simbolo]
  return {
    simbolo: rengE.simbolo,
    color: RENG_COLOR[rengE.z - 1] ?? RENG_GRIS_GENERICO,
    colorGenerico: RENG_COLOR[rengE.z - 1] === undefined,
    rc: RENG_RC[rengE.z - 1] ?? null,
    rv: rengRvB ?? rengRvM ?? null,
    fuenteRv: rengRvB !== undefined ? 'Bondi 1964' : rengRvM !== undefined ? 'Mantina 2009' : null
  }
})

export const rengDatos3D = new Map(RENG_DATOS_3D.map((rengD) => [rengD.simbolo, rengD]))

export function rengRadiosDibujo(rengSimbolo: string): { color: number; rc: number; rv: number; aproximado: boolean } {
  const rengD = rengDatos3D.get(rengSimbolo)
  if (!rengD) return { color: RENG_GRIS_GENERICO, rc: 1.5, rv: 2.3, aproximado: true }
  const rengRc = rengD.rc ?? 1.5
  return { color: rengD.color, rc: rengRc, rv: rengD.rv ?? rengRc + 0.8, aproximado: rengD.rc === null || rengD.rv === null }
}
