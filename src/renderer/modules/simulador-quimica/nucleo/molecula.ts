import { ConformerGenerator, ForceFieldMMFF94, Molecule, Resources } from 'openchemlib'
import recursos from 'openchemlib-recursos'
import { rengFormulaHill, rengMasaMolarDe } from './formula'

export const RENG_FUENTE_MMFF = 'Campo de fuerzas MMFF94s (Halgren, J. Comput. Chem. 1996, 17, 490 y 1999, 20, 720), implementado en openchemlib 9.25.2'

export interface RengAtomoMol {
  el: string
  carga: number
  aromatico: boolean
  x: number
  y: number
  z: number
}

export interface RengEnlaceMol {
  a: number
  b: number
  orden: number
  aromatico: boolean
}

export interface RengMoleculaGrafo {
  atomos: RengAtomoMol[]
  enlaces: RengEnlaceMol[]
  carga: number
  formula: string
  smiles: string
  id: string
  masaMolar: number
  estereo: RengEstadoEstereo
  idSinEstereo: string
  componentes: string[]
  tiene3D: boolean
  optimizacion: RengEstadoOptimizacion | null
}

export type RengEstadoEstereo = 'definida' | 'parcial' | 'indefinida' | 'no-aplica'

export interface RengEstadoOptimizacion {
  metodo: 'MMFF94s'
  codigo: number
  convergio: boolean
  maxIts: number
  gradTol: number
}

export const RENG_OPCIONES_MMFF = { maxIts: 4000, gradTol: 1e-4 } as const

let rengRegistrado = false
function rengAsegurarRecursos(): void {
  if (rengRegistrado) return
  Resources.register(recursos)
  rengRegistrado = true
}

const rengNombreElemento = (rengS: string): string => rengS

function rengTraducirError(rengE: unknown, rengEntrada: string): string {
  const rengM = rengE instanceof Error ? rengE.message : String(rengE)
  const rengPos = /Position:\s*(\d+)/.exec(rengM)
  const rengDonde = rengPos ? ` (posición ${Number(rengPos[1]) + 1}, «${rengEntrada.charAt(Number(rengPos[1]))}»)` : ''
  if (/unknown element label/i.test(rengM)) return `SMILES no válido: hay un símbolo que no es un elemento${rengDonde}. En SMILES los elementos van en mayúscula (C, N, O) o en minúscula si son aromáticos (c, n, o).`
  if (/closing bracket|bracket|parenthes/i.test(rengM)) return `SMILES no válido: algún paréntesis o corchete no está cerrado${rengDonde}.`
  if (/ring closure|ring/i.test(rengM)) return `SMILES no válido: un número de cierre de anillo no tiene pareja${rengDonde}.`
  if (/aromatic/i.test(rengM)) return `SMILES no válido: un anillo aromático no se puede escribir con enlaces alternos${rengDonde}. Revisa las letras minúsculas.`
  return `SMILES no válido${rengDonde}: ${rengM.replace(/^.*?:\s*/, '')}`
}

const RENG_VALENCIA_MAX: Record<string, number> = { H: 1, C: 4, N: 3, O: 2, F: 1, Cl: 1, Br: 1, I: 1 }

function rengLeerSmiles(rengSmiles: string): Molecule {
  rengAsegurarRecursos()
  const rengT = rengSmiles.trim()
  if (!rengT) throw new Error('Escribe un SMILES.')
  for (const [rengAbre, rengCierra, rengNombre] of [
    ['(', ')', 'paréntesis'],
    ['[', ']', 'corchete']
  ] as const) {
    let rengNivel = 0
    for (let rengI = 0; rengI < rengT.length; rengI++) {
      if (rengT[rengI] === rengAbre) rengNivel++
      else if (rengT[rengI] === rengCierra && --rengNivel < 0) throw new Error(`SMILES no válido: hay un ${rengNombre} «${rengCierra}» sin abrir (posición ${rengI + 1}).`)
    }
    if (rengNivel > 0) throw new Error(`SMILES no válido: falta cerrar ${rengNivel === 1 ? 'un' : rengNivel} ${rengNombre}${rengNivel === 1 ? '' : 's'} «${rengAbre}».`)
  }
  let rengMol: Molecule
  try {
    rengMol = Molecule.fromSmiles(rengT)
  } catch (rengE) {
    throw new Error(rengTraducirError(rengE, rengT))
  }
  if (rengMol.getAllAtoms() === 0) throw new Error('El SMILES no contiene átomos.')
  for (let rengI = 0; rengI < rengMol.getAllAtoms(); rengI++) {
    if (rengMol.getFreeValence(rengI) < 0) {
      const rengEl = rengMol.getAtomLabel(rengI)
      const rengMax = RENG_VALENCIA_MAX[rengEl]
      throw new Error(
        `Valencia imposible: un átomo de ${rengNombreElemento(rengEl)} tendría más enlaces de los que admite${rengMax ? ` (máximo ${rengMax} con carga 0)` : ''}. Revisa los enlaces o indica una carga entre corchetes, p. ej. [N+].`
      )
    }
  }
  rengMol.addImplicitHydrogens()
  return rengMol
}

function rengAGrafo(rengMol: Molecule, rengTiene3D: boolean, rengOptimizacion: RengEstadoOptimizacion | null = null): RengMoleculaGrafo {
  const rengAtomos: RengAtomoMol[] = []
  let rengCarga = 0
  for (let rengI = 0; rengI < rengMol.getAllAtoms(); rengI++) {
    const rengQ = rengMol.getAtomCharge(rengI)
    rengCarga += rengQ
    rengAtomos.push({ el: rengMol.getAtomLabel(rengI), carga: rengQ, aromatico: rengMol.isAromaticAtom(rengI), x: rengTiene3D ? rengMol.getAtomX(rengI) : 0, y: rengTiene3D ? rengMol.getAtomY(rengI) : 0, z: rengTiene3D ? rengMol.getAtomZ(rengI) : 0 })
  }
  const rengEnlaces: RengEnlaceMol[] = []
  for (let rengB = 0; rengB < rengMol.getAllBonds(); rengB++) {
    rengEnlaces.push({ a: rengMol.getBondAtom(0, rengB), b: rengMol.getBondAtom(1, rengB), orden: rengMol.getBondOrder(rengB), aromatico: rengMol.isAromaticBond(rengB) })
  }
  const rengCuenta = new Map<string, number>()
  for (const rengA of rengAtomos) rengCuenta.set(rengA.el, (rengCuenta.get(rengA.el) ?? 0) + 1)
  const rengFormula = rengFormulaHill(rengCuenta).replace(/[₀-₉]/g, (rengC) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(rengC)))
  const rengSinEstereo = rengMol.getCompactCopy()
  rengSinEstereo.stripStereoInformation()
  return {
    atomos: rengAtomos,
    enlaces: rengEnlaces,
    carga: rengCarga,
    formula: rengFormula,
    smiles: rengMol.toIsomericSmiles(),
    id: rengMol.getIDCode(),
    estereo: rengEstereoDe(rengMol),
    idSinEstereo: rengSinEstereo.getIDCode(),
    componentes: rengMol.getFragments().map((rengF) => rengF.getIDCode()).sort(),
    masaMolar: rengMasaMolarDe(rengFormula),
    tiene3D: rengTiene3D,
    optimizacion: rengOptimizacion
  }
}

function rengEstereoDe(rengMol: Molecule): RengEstadoEstereo {
  rengMol.ensureHelperArrays(Molecule.cHelperCIP)
  let rengDefinidos = 0
  let rengSinDefinir = 0
  for (let rengI = 0; rengI < rengMol.getAllAtoms(); rengI++) {
    const rengP = rengMol.getAtomParity(rengI)
    if (rengP === Molecule.cAtomParityUnknown) rengSinDefinir++
    else if (rengP !== Molecule.cAtomParityNone) rengDefinidos++
  }
  for (let rengB = 0; rengB < rengMol.getAllBonds(); rengB++) {
    const rengP = rengMol.getBondParity(rengB)
    if (rengP === Molecule.cBondParityUnknown) rengSinDefinir++
    else if (rengP !== Molecule.cBondParityNone) rengDefinidos++
  }
  if (rengDefinidos === 0) return rengSinDefinir > 0 ? 'indefinida' : 'no-aplica'
  return rengSinDefinir > 0 ? 'parcial' : 'definida'
}

export const RENG_LIMITES_CACHE_LECTURA = { entradas: 256, caracteres: 200, atomos: 200 } as const

const rengCacheLectura = new Map<string, RengMoleculaGrafo>()
let rengAciertos = 0
let rengFallos = 0

function rengCopiaGrafo(rengG: RengMoleculaGrafo): RengMoleculaGrafo {
  return {
    ...rengG,
    atomos: rengG.atomos.map((rengA) => ({ ...rengA })),
    enlaces: rengG.enlaces.map((rengE) => ({ ...rengE })),
    componentes: [...rengG.componentes],
    optimizacion: rengG.optimizacion ? { ...rengG.optimizacion } : null
  }
}

export function rengEstadoCacheLectura(): { entradas: number; aciertos: number; fallos: number } {
  return { entradas: rengCacheLectura.size, aciertos: rengAciertos, fallos: rengFallos }
}

export function rengVaciarCacheLectura(): void {
  rengCacheLectura.clear()
  rengAciertos = 0
  rengFallos = 0
}

export function rengDesdeSmiles(rengSmiles: string): RengMoleculaGrafo {
  const rengClave = rengSmiles.trim()
  const rengGuardado = rengCacheLectura.get(rengClave)
  if (rengGuardado) {
    rengAciertos++
    rengCacheLectura.delete(rengClave)
    rengCacheLectura.set(rengClave, rengGuardado)
    return rengCopiaGrafo(rengGuardado)
  }
  rengFallos++
  const rengG = rengAGrafo(rengLeerSmiles(rengSmiles), false)
  if (rengClave.length > RENG_LIMITES_CACHE_LECTURA.caracteres || rengG.atomos.length > RENG_LIMITES_CACHE_LECTURA.atomos) return rengG
  rengCacheLectura.set(rengClave, rengG)
  if (rengCacheLectura.size > RENG_LIMITES_CACHE_LECTURA.entradas) rengCacheLectura.delete(rengCacheLectura.keys().next().value!)
  return rengCopiaGrafo(rengG)
}

export function rengDibujo2D(rengSmiles: string, rengAncho = 340, rengAlto = 240, rengOcultarCip = false): string {
  rengAsegurarRecursos()
  let rengMol: Molecule
  try {
    rengMol = Molecule.fromSmiles(rengSmiles.trim())
  } catch (rengE) {
    throw new Error(rengTraducirError(rengE, rengSmiles.trim()))
  }
  return rengMol.toSVG(rengAncho, rengAlto, undefined, { autoCrop: true, autoCropMargin: 14, ...(rengOcultarCip ? { suppressCIPParity: true } : {}) })
}

export function rengIdCanonico(rengSmiles: string): string {
  return rengLeerSmiles(rengSmiles).getIDCode()
}

export interface RengDescriptoresCIP {
  centros: Array<{ atomo: number; descriptor: 'R' | 'S' }>
  dobles: Array<{ enlace: number; descriptor: 'E' | 'Z' }>
}

export function rengDescriptoresCIP(rengSmiles: string): RengDescriptoresCIP {
  const rengMol = rengLeerSmiles(rengSmiles)
  rengMol.ensureHelperArrays(Molecule.cHelperCIP)
  const rengCentros: RengDescriptoresCIP['centros'] = []
  const rengDobles: RengDescriptoresCIP['dobles'] = []
  for (let rengI = 0; rengI < rengMol.getAllAtoms(); rengI++) {
    const rengP = rengMol.getAtomCIPParity(rengI)
    if (rengP === Molecule.cAtomCIPParityRorM) rengCentros.push({ atomo: rengI, descriptor: 'R' })
    else if (rengP === Molecule.cAtomCIPParitySorP) rengCentros.push({ atomo: rengI, descriptor: 'S' })
  }
  for (let rengB = 0; rengB < rengMol.getAllBonds(); rengB++) {
    const rengP = rengMol.getBondCIPParity(rengB)
    if (rengP === Molecule.cBondCIPParityEorP) rengDobles.push({ enlace: rengB, descriptor: 'E' })
    else if (rengP === Molecule.cBondCIPParityZorM) rengDobles.push({ enlace: rengB, descriptor: 'Z' })
  }
  return { centros: rengCentros, dobles: rengDobles }
}

export function rengDesdeMolfile(rengMolfile: string): RengMoleculaGrafo {
  rengAsegurarRecursos()
  let rengMol: Molecule
  try {
    rengMol = Molecule.fromMolfile(rengMolfile)
  } catch (rengE) {
    throw new Error(`Molfile no válido: ${rengE instanceof Error ? rengE.message : String(rengE)}`)
  }
  rengMol.addImplicitHydrogens()
  return rengAGrafo(rengMol, false)
}

export function rengGeometria3D(rengSmiles: string, rengSemilla = 42, rengOpciones: { maxIts: number; gradTol: number } = RENG_OPCIONES_MMFF): RengMoleculaGrafo {
  const rengMol = rengLeerSmiles(rengSmiles)
  const rengConf = new ConformerGenerator(rengSemilla).getOneConformerAsMolecule(rengMol)
  if (!rengConf) throw new Error('No se pudo generar una conformación 3D para esta molécula.')
  let rengCodigo: number
  try {
    const rengFf = new ForceFieldMMFF94(rengConf, ForceFieldMMFF94.MMFF94S, {})
    rengCodigo = rengFf.minimise({ maxIts: rengOpciones.maxIts, gradTol: rengOpciones.gradTol })
  } catch {
    throw new Error('El campo de fuerzas MMFF94 no tiene parámetros para algún átomo de esta molécula (pasa con metales y gases nobles).')
  }
  const rengOptimizacion: RengEstadoOptimizacion = { metodo: 'MMFF94s', codigo: rengCodigo, convergio: rengCodigo === 0, maxIts: rengOpciones.maxIts, gradTol: rengOpciones.gradTol }
  return rengAGrafo(rengConf, true, rengOptimizacion)
}

export function rengDescribirOptimizacion(rengO: RengEstadoOptimizacion | null): string {
  if (!rengO) return 'Coordenadas sin minimizar (colocación aproximada).'
  return rengO.convergio
    ? `Mínimo local de MMFF94s (gradiente < ${rengO.gradTol}); geometría calculada, no experimental.`
    : `MMFF94s NO convergió (código ${rengO.codigo}; ${rengO.maxIts} iteraciones): coordenadas aproximadas, no optimizadas.`
}

const rengVec = (rengM: RengMoleculaGrafo, rengI: number): [number, number, number] => [rengM.atomos[rengI]!.x, rengM.atomos[rengI]!.y, rengM.atomos[rengI]!.z]

export function rengDistanciaAtomos(rengM: RengMoleculaGrafo, rengA: number, rengB: number): number {
  const [rengP, rengQ] = [rengVec(rengM, rengA), rengVec(rengM, rengB)]
  return Math.hypot(rengP[0] - rengQ[0], rengP[1] - rengQ[1], rengP[2] - rengQ[2])
}

export function rengAnguloAtomos(rengM: RengMoleculaGrafo, rengA: number, rengV: number, rengB: number): number {
  const [RENG_A, RENG_V, RENG_B] = [rengVec(rengM, rengA), rengVec(rengM, rengV), rengVec(rengM, rengB)]
  const rengU = RENG_A.map((rengX, rengI) => rengX - RENG_V[rengI]!)
  const rengW = RENG_B.map((rengX, rengI) => rengX - RENG_V[rengI]!)
  const rengD = rengU[0]! * rengW[0]! + rengU[1]! * rengW[1]! + rengU[2]! * rengW[2]!
  return (Math.acos(Math.max(-1, Math.min(1, rengD / (Math.hypot(...rengU) * Math.hypot(...rengW))))) * 180) / Math.PI
}

export function rengDesviacionPlano(rengM: RengMoleculaGrafo, rengIndices: number[]): number {
  const [rengA, rengB, rengC] = rengIndices.slice(0, 3).map((rengI) => rengVec(rengM, rengI)) as unknown as [number[], number[], number[]]
  const rengU = rengB.map((rengX, rengI) => rengX - rengA[rengI]!)
  const rengV = rengC.map((rengX, rengI) => rengX - rengA[rengI]!)
  const rengN = [rengU[1]! * rengV[2]! - rengU[2]! * rengV[1]!, rengU[2]! * rengV[0]! - rengU[0]! * rengV[2]!, rengU[0]! * rengV[1]! - rengU[1]! * rengV[0]!]
  const rengNn = Math.hypot(...rengN)
  return Math.max(...rengIndices.map((rengI) => Math.abs(rengVec(rengM, rengI).reduce((rengS, rengX, rengK) => rengS + (rengX - rengA[rengK]!) * rengN[rengK]!, 0) / rengNn)))
}

export function rengVecinos(rengM: RengMoleculaGrafo, rengI: number): number[] {
  return rengM.enlaces.filter((rengE) => rengE.a === rengI || rengE.b === rengI).map((rengE) => (rengE.a === rengI ? rengE.b : rengE.a))
}
