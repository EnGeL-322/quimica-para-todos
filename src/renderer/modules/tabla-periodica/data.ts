export type RengCategoria =
  | 'alcalino'
  | 'alcalinoterreo'
  | 'transicion'
  | 'postransicion'
  | 'metaloide'
  | 'no-metal'
  | 'halogeno'
  | 'gas-noble'
  | 'lantanido'
  | 'actinido'

export type RengEstado = 'sólido' | 'líquido' | 'gas' | 'desconocido'

export const RENG_CATEGORIAS: Record<RengCategoria, { nombre: string; color: string }> = {
  alcalino: { nombre: 'Metales alcalinos', color: '#ff6b6b' },
  alcalinoterreo: { nombre: 'Alcalinotérreos', color: '#ffa94d' },
  transicion: { nombre: 'Metales de transición', color: '#ffd43b' },
  postransicion: { nombre: 'Metales postransición', color: '#69db7c' },
  metaloide: { nombre: 'Metaloides', color: '#38d9a9' },
  'no-metal': { nombre: 'No metales', color: '#4dabf7' },
  halogeno: { nombre: 'Halógenos', color: '#748ffc' },
  'gas-noble': { nombre: 'Gases nobles', color: '#da77f2' },
  lantanido: { nombre: 'Lantánidos', color: '#f783ac' },
  actinido: { nombre: 'Actínidos', color: '#e599f7' }
}

const RENG_RAW: Array<[string, string, number]> = [
  ['H', 'Hidrógeno', 1.008], ['He', 'Helio', 4.0026], ['Li', 'Litio', 6.94], ['Be', 'Berilio', 9.0122], ['B', 'Boro', 10.81],
  ['C', 'Carbono', 12.011], ['N', 'Nitrógeno', 14.007], ['O', 'Oxígeno', 15.999], ['F', 'Flúor', 18.998], ['Ne', 'Neón', 20.18],
  ['Na', 'Sodio', 22.99], ['Mg', 'Magnesio', 24.305], ['Al', 'Aluminio', 26.982], ['Si', 'Silicio', 28.085], ['P', 'Fósforo', 30.974],
  ['S', 'Azufre', 32.06], ['Cl', 'Cloro', 35.45], ['Ar', 'Argón', 39.948], ['K', 'Potasio', 39.098], ['Ca', 'Calcio', 40.078],
  ['Sc', 'Escandio', 44.956], ['Ti', 'Titanio', 47.867], ['V', 'Vanadio', 50.942], ['Cr', 'Cromo', 51.996], ['Mn', 'Manganeso', 54.938],
  ['Fe', 'Hierro', 55.845], ['Co', 'Cobalto', 58.933], ['Ni', 'Níquel', 58.693], ['Cu', 'Cobre', 63.546], ['Zn', 'Zinc', 65.38],
  ['Ga', 'Galio', 69.723], ['Ge', 'Germanio', 72.63], ['As', 'Arsénico', 74.922], ['Se', 'Selenio', 78.971], ['Br', 'Bromo', 79.904],
  ['Kr', 'Kriptón', 83.798], ['Rb', 'Rubidio', 85.468], ['Sr', 'Estroncio', 87.62], ['Y', 'Itrio', 88.906], ['Zr', 'Circonio', 91.224],
  ['Nb', 'Niobio', 92.906], ['Mo', 'Molibdeno', 95.95], ['Tc', 'Tecnecio', 98], ['Ru', 'Rutenio', 101.07], ['Rh', 'Rodio', 102.91],
  ['Pd', 'Paladio', 106.42], ['Ag', 'Plata', 107.87], ['Cd', 'Cadmio', 112.41], ['In', 'Indio', 114.82], ['Sn', 'Estaño', 118.71],
  ['Sb', 'Antimonio', 121.76], ['Te', 'Telurio', 127.6], ['I', 'Yodo', 126.9], ['Xe', 'Xenón', 131.29], ['Cs', 'Cesio', 132.91],
  ['Ba', 'Bario', 137.33], ['La', 'Lantano', 138.91], ['Ce', 'Cerio', 140.12], ['Pr', 'Praseodimio', 140.91], ['Nd', 'Neodimio', 144.24],
  ['Pm', 'Prometio', 145], ['Sm', 'Samario', 150.36], ['Eu', 'Europio', 151.96], ['Gd', 'Gadolinio', 157.25], ['Tb', 'Terbio', 158.93],
  ['Dy', 'Disprosio', 162.5], ['Ho', 'Holmio', 164.93], ['Er', 'Erbio', 167.26], ['Tm', 'Tulio', 168.93], ['Yb', 'Iterbio', 173.05],
  ['Lu', 'Lutecio', 174.97], ['Hf', 'Hafnio', 178.49], ['Ta', 'Tántalo', 180.95], ['W', 'Wolframio', 183.84], ['Re', 'Renio', 186.21],
  ['Os', 'Osmio', 190.23], ['Ir', 'Iridio', 192.22], ['Pt', 'Platino', 195.08], ['Au', 'Oro', 196.97], ['Hg', 'Mercurio', 200.59],
  ['Tl', 'Talio', 204.38], ['Pb', 'Plomo', 207.2], ['Bi', 'Bismuto', 208.98], ['Po', 'Polonio', 209], ['At', 'Astato', 210],
  ['Rn', 'Radón', 222], ['Fr', 'Francio', 223], ['Ra', 'Radio', 226], ['Ac', 'Actinio', 227], ['Th', 'Torio', 232.04],
  ['Pa', 'Protactinio', 231.04], ['U', 'Uranio', 238.03], ['Np', 'Neptunio', 237], ['Pu', 'Plutonio', 244], ['Am', 'Americio', 243],
  ['Cm', 'Curio', 247], ['Bk', 'Berkelio', 247], ['Cf', 'Californio', 251], ['Es', 'Einstenio', 252], ['Fm', 'Fermio', 257],
  ['Md', 'Mendelevio', 258], ['No', 'Nobelio', 259], ['Lr', 'Lawrencio', 266], ['Rf', 'Rutherfordio', 267], ['Db', 'Dubnio', 268],
  ['Sg', 'Seaborgio', 269], ['Bh', 'Bohrio', 270], ['Hs', 'Hasio', 277], ['Mt', 'Meitnerio', 278], ['Ds', 'Darmstatio', 281],
  ['Rg', 'Roentgenio', 282], ['Cn', 'Copernicio', 285], ['Nh', 'Nihonio', 286], ['Fl', 'Flerovio', 289], ['Mc', 'Moscovio', 290],
  ['Lv', 'Livermorio', 293], ['Ts', 'Teneso', 294], ['Og', 'Oganesón', 294]
]

export interface RengElemento {
  z: number
  simbolo: string
  nombre: string
  masa: number
  masaAproximada: boolean
  categoria: RengCategoria
  fila: number
  columna: number
  estado: RengEstado
  grupo: number | null
  periodo: number
}

const RENG_LIQUIDOS = new Set(['Br', 'Hg'])
const RENG_GASES = new Set(['H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn'])
const RENG_SIN_ESTABLE = new Set([43, 61, ...Array.from({ length: 118 - 83 }, (_, rengI) => 84 + rengI)].filter((rengZ) => rengZ !== 90 && rengZ !== 91 && rengZ !== 92))

function rengCategoriaDe(rengZ: number, rengS: string): RengCategoria {
  if (['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'].includes(rengS)) return 'alcalino'
  if (['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'].includes(rengS)) return 'alcalinoterreo'
  if (rengZ >= 57 && rengZ <= 71) return 'lantanido'
  if (rengZ >= 89 && rengZ <= 103) return 'actinido'
  if (['B', 'Si', 'Ge', 'As', 'Sb', 'Te'].includes(rengS)) return 'metaloide'
  if (['F', 'Cl', 'Br', 'I', 'At', 'Ts'].includes(rengS)) return 'halogeno'
  if (['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og'].includes(rengS)) return 'gas-noble'
  if (['H', 'C', 'N', 'O', 'P', 'S', 'Se'].includes(rengS)) return 'no-metal'
  if (['Al', 'Ga', 'In', 'Sn', 'Tl', 'Pb', 'Bi', 'Po', 'Nh', 'Fl', 'Mc', 'Lv'].includes(rengS)) return 'postransicion'
  return 'transicion'
}

function rengPosicion(rengZ: number): { fila: number; columna: number; periodo: number; grupo: number | null } {
  if (rengZ === 1) return { fila: 1, columna: 1, periodo: 1, grupo: 1 }
  if (rengZ === 2) return { fila: 1, columna: 18, periodo: 1, grupo: 18 }
  if (rengZ <= 4) return { fila: 2, columna: rengZ - 2, periodo: 2, grupo: rengZ - 2 }
  if (rengZ <= 10) return { fila: 2, columna: rengZ + 8, periodo: 2, grupo: rengZ + 8 }
  if (rengZ <= 12) return { fila: 3, columna: rengZ - 10, periodo: 3, grupo: rengZ - 10 }
  if (rengZ <= 18) return { fila: 3, columna: rengZ, periodo: 3, grupo: rengZ }
  if (rengZ <= 36) return { fila: 4, columna: rengZ - 18, periodo: 4, grupo: rengZ - 18 }
  if (rengZ <= 54) return { fila: 5, columna: rengZ - 36, periodo: 5, grupo: rengZ - 36 }
  if (rengZ <= 56) return { fila: 6, columna: rengZ - 54, periodo: 6, grupo: rengZ - 54 }
  if (rengZ <= 71) return { fila: 9, columna: rengZ - 54, periodo: 6, grupo: null }
  if (rengZ <= 86) return { fila: 6, columna: rengZ - 68, periodo: 6, grupo: rengZ - 68 }
  if (rengZ <= 88) return { fila: 7, columna: rengZ - 86, periodo: 7, grupo: rengZ - 86 }
  if (rengZ <= 103) return { fila: 10, columna: rengZ - 86, periodo: 7, grupo: null }
  return { fila: 7, columna: rengZ - 100, periodo: 7, grupo: rengZ - 100 }
}

export const RENG_ELEMENTOS: RengElemento[] = RENG_RAW.map(([rengSimbolo, rengNombre, rengMasa], rengI) => {
  const rengZ = rengI + 1
  const rengPos = rengPosicion(rengZ)
  const rengEstado: RengEstado = RENG_LIQUIDOS.has(rengSimbolo) ? 'líquido' : RENG_GASES.has(rengSimbolo) ? 'gas' : rengZ >= 100 ? 'desconocido' : 'sólido'
  return { z: rengZ, simbolo: rengSimbolo, nombre: rengNombre, masa: rengMasa, masaAproximada: RENG_SIN_ESTABLE.has(rengZ), categoria: rengCategoriaDe(rengZ, rengSimbolo), estado: rengEstado, ...rengPos }
})

export const rengPorSimbolo = new Map(RENG_ELEMENTOS.map((rengE) => [rengE.simbolo, rengE]))

const RENG_ORDEN: Array<[number, number]> = []
for (let rengS = 1; rengS <= 8; rengS++) {
  for (let rengL = 0; rengL <= Math.floor((rengS - 1) / 2); rengL++) {
    RENG_ORDEN.push([rengS - rengL, rengL])
  }
}
RENG_ORDEN.sort((rengA, rengB) => rengA[0] + rengA[1] - (rengB[0] + rengB[1]) || rengA[0] - rengB[0])

const RENG_L = ['s', 'p', 'd', 'f']
const rengCap = (rengL: number): number => 2 * (2 * rengL + 1)
const rengNombre = (rengN: number, rengL: number): string => `${rengN}${RENG_L[rengL]}`

const RENG_EXCEPCIONES: Record<number, Record<string, number>> = {
  24: { '3d': 5, '4s': 1 }, 29: { '3d': 10, '4s': 1 },
  41: { '4d': 4, '5s': 1 }, 42: { '4d': 5, '5s': 1 }, 44: { '4d': 7, '5s': 1 }, 45: { '4d': 8, '5s': 1 }, 46: { '4d': 10, '5s': 0 }, 47: { '4d': 10, '5s': 1 },
  57: { '4f': 0, '5d': 1 }, 58: { '4f': 1, '5d': 1 }, 64: { '4f': 7, '5d': 1 },
  78: { '5d': 9, '6s': 1 }, 79: { '5d': 10, '6s': 1 },
  89: { '5f': 0, '6d': 1 }, 90: { '5f': 0, '6d': 2 }, 91: { '5f': 2, '6d': 1 }, 92: { '5f': 3, '6d': 1 }, 93: { '5f': 4, '6d': 1 }, 96: { '5f': 7, '6d': 1 },
  103: { '5f': 14, '6d': 0, '7p': 1 }
}

export function rengOcupacion(rengZ: number): Map<string, number> {
  const rengOcc = new Map<string, number>()
  let rengLeft = rengZ
  for (const [rengN, rengL] of RENG_ORDEN) {
    if (rengLeft <= 0) break
    const rengPut = Math.min(rengCap(rengL), rengLeft)
    rengOcc.set(rengNombre(rengN, rengL), rengPut)
    rengLeft -= rengPut
  }
  for (const [rengK, rengV] of Object.entries(RENG_EXCEPCIONES[rengZ] ?? {})) rengOcc.set(rengK, rengV)
  return rengOcc
}

const rengSup = (rengN: number): string => String(rengN).replace(/\d/g, (rengD) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(rengD)] ?? rengD)

const RENG_NOBLES: Array<[number, string]> = [[86, 'Rn'], [54, 'Xe'], [36, 'Kr'], [18, 'Ar'], [10, 'Ne'], [2, 'He']]

function rengOrdenVisual(rengKeys: string[]): string[] {
  return [...rengKeys].sort((rengA, rengB) => Number(rengA[0]) - Number(rengB[0]) || RENG_L.indexOf(rengA[1] ?? '') - RENG_L.indexOf(rengB[1] ?? ''))
}

export function rengConfiguracion(rengZ: number, rengAbreviada = true): string {
  const rengOcc = rengOcupacion(rengZ)
  let rengPrefijo = ''
  if (rengAbreviada) {
    const rengCore = RENG_NOBLES.find(([rengZn]) => rengZn < rengZ)
    if (rengCore) {
      const rengCoreOcc = rengOcupacion(rengCore[0])
      for (const [rengK, rengV] of rengCoreOcc) rengOcc.set(rengK, (rengOcc.get(rengK) ?? 0) - rengV)
      rengPrefijo = `[${rengCore[1]}] `
    }
  }
  const rengPartes = rengOrdenVisual([...rengOcc.keys()])
    .filter((rengK) => (rengOcc.get(rengK) ?? 0) > 0)
    .map((rengK) => `${rengK}${rengSup(rengOcc.get(rengK) ?? 0)}`)
  return rengPrefijo + rengPartes.join(' ')
}

export function rengCapas(rengZ: number): number[] {
  const rengOut: number[] = []
  for (const [rengK, rengV] of rengOcupacion(rengZ)) {
    const rengN = Number(rengK[0])
    rengOut[rengN - 1] = (rengOut[rengN - 1] ?? 0) + rengV
  }
  return rengOut.map((rengV) => rengV ?? 0)
}

export interface RengMasaMolar {
  total: number
  desglose: Array<{ simbolo: string; cantidad: number; masa: number }>
}

export function rengMasaMolar(rengFormula: string): RengMasaMolar {
  const rengSrc = rengFormula.replace(/\s+/g, '').replace(/[·.*]/g, '·')
  if (!rengSrc) throw new Error('Escribe una fórmula.')
  const rengTotal = new Map<string, number>()

  const rengParseGroup = (rengS: string): Map<string, number> => {
    let rengI = 0
    const rengStack: Array<Map<string, number>> = [new Map()]
    const rengNum = (): number => {
      let rengJ = rengI
      while (rengJ < rengS.length && /\d/.test(rengS[rengJ] ?? '')) rengJ++
      const rengN = rengJ > rengI ? Number(rengS.slice(rengI, rengJ)) : 1
      rengI = rengJ
      return rengN
    }
    while (rengI < rengS.length) {
      const rengCh = rengS[rengI] as string
      if (rengCh === '(' || rengCh === '[') {
        rengStack.push(new Map())
        rengI++
      } else if (rengCh === ')' || rengCh === ']') {
        rengI++
        const rengK = rengNum()
        const rengInner = rengStack.pop()
        const rengTop = rengStack[rengStack.length - 1]
        if (!rengInner || !rengTop) throw new Error('Paréntesis desbalanceados.')
        for (const [rengEl, rengC] of rengInner) rengTop.set(rengEl, (rengTop.get(rengEl) ?? 0) + rengC * rengK)
      } else if (/[A-Z]/.test(rengCh)) {
        let rengSym = rengCh
        rengI++
        if (/[a-z]/.test(rengS[rengI] ?? '')) rengSym += rengS[rengI++]
        if (!rengPorSimbolo.has(rengSym)) throw new Error(`Elemento desconocido: «${rengSym}». Recuerda: mayúscula + minúscula (Cl, no CL).`)
        const rengK = rengNum()
        const rengTop = rengStack[rengStack.length - 1] as Map<string, number>
        rengTop.set(rengSym, (rengTop.get(rengSym) ?? 0) + rengK)
      } else {
        throw new Error(`Carácter no válido: «${rengCh}».`)
      }
    }
    if (rengStack.length !== 1) throw new Error('Paréntesis desbalanceados.')
    return rengStack[0] as Map<string, number>
  }

  for (const rengParte of rengSrc.split('·')) {
    const rengM = /^(\d+)(.*)$/.exec(rengParte)
    const rengMult = rengM ? Number(rengM[1]) : 1
    const rengBody = rengM ? (rengM[2] ?? '') : rengParte
    for (const [rengEl, rengC] of rengParseGroup(rengBody)) rengTotal.set(rengEl, (rengTotal.get(rengEl) ?? 0) + rengC * rengMult)
  }

  const rengDesglose = [...rengTotal.entries()].map(([rengSimbolo, rengCantidad]) => ({ simbolo: rengSimbolo, cantidad: rengCantidad, masa: (rengPorSimbolo.get(rengSimbolo) as RengElemento).masa * rengCantidad }))
  return { total: rengDesglose.reduce((rengA, rengD) => rengA + rengD.masa, 0), desglose: rengDesglose }
}
