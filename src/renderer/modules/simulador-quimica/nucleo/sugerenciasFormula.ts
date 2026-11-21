import { rengPorSimbolo } from '../../tabla-periodica/data'
import { rengAnalizarFormula, rengFormulaHill } from './formula'

export const RENG_FUERA_DE_LISTA: ReadonlyArray<{ formula: string; nombre: string; fuente: string }> = [
  { formula: 'H2SeO4', nombre: 'ácido selénico', fuente: 'PubChem, CID 1089, consultado el 4-11-2026' },
  { formula: 'H2SeO3', nombre: 'ácido selenioso', fuente: 'PubChem, CID 1091, consultado el 4-11-2026' }
]

const rengClave = (rengF: string): string | null => {
  try {
    return rengFormulaHill(rengAnalizarFormula(rengF).atomos)
  } catch {
    return null
  }
}

export function rengFueraDeLista(rengFormula: string): (typeof RENG_FUERA_DE_LISTA)[number] | null {
  const rengK = rengClave(rengFormula)
  return rengK ? (RENG_FUERA_DE_LISTA.find((rengX) => rengClave(rengX.formula) === rengK) ?? null) : null
}

export function rengLecturasMinusculas(rengTexto: string, rengMax = 12): string[] {
  const rengT = rengTexto.trim()
  if (!/^[a-z][a-z0-9]*$/.test(rengT) || /(^|[^0-9])1(?![0-9])/.test(rengT) || rengT.length > 16) return []
  const rengOut: string[] = []
  const rengIr = (rengI: number, rengAcc: string): void => {
    if (rengOut.length >= rengMax) return
    if (rengI === rengT.length) {
      rengOut.push(rengAcc)
      return
    }
    for (const rengLen of [1, 2]) {
      const rengS = rengT.slice(rengI, rengI + rengLen)
      if (rengS.length !== rengLen || /\d/.test(rengS)) continue
      const rengSim = rengS.charAt(0).toUpperCase() + rengS.slice(1)
      if (!rengPorSimbolo.has(rengSim)) continue
      const rengDig = /^\d*/.exec(rengT.slice(rengI + rengLen))![0]
      if (rengDig.startsWith('0')) continue
      rengIr(rengI + rengLen + rengDig.length, rengAcc + rengSim + rengDig)
    }
  }
  rengIr(0, '')
  return [...new Set(rengOut)]
}

function rengVecinosDeGrupo(rengEl: string): string[] {
  const rengE = rengPorSimbolo.get(rengEl)
  if (!rengE?.grupo || rengE.grupo === 18) return []
  return [...rengPorSimbolo.values()]
    .filter((rengX) => rengX.grupo === rengE.grupo && rengX.simbolo !== rengEl)
    .sort((rengA, rengB) => Math.abs(rengA.periodo - rengE.periodo) - Math.abs(rengB.periodo - rengE.periodo) || rengA.periodo - rengB.periodo)
    .map((rengX) => rengX.simbolo)
}

export interface RengAnalogo {
  formula: string
  nombre: string
  de: string
  por: string
}

export function rengAnalogo(rengFormula: string, rengReconoce: (rengF: string) => string | null): RengAnalogo | null {
  let rengSimbolos: string[]
  try {
    rengSimbolos = [...rengAnalizarFormula(rengFormula).atomos.keys()]
  } catch {
    return null
  }
  for (const rengDe of rengSimbolos.filter((rengS) => rengS !== 'H' && rengS !== 'O')) {
    for (const rengPor of rengVecinosDeGrupo(rengDe)) {
      if (rengSimbolos.includes(rengPor)) continue
      const rengF = rengFormula.replace(new RegExp(`${rengDe}(?![a-z])`, 'g'), rengPor)
      const rengNombre = rengReconoce(rengF)
      if (rengNombre) return { formula: rengF, nombre: rengNombre, de: rengDe, por: rengPor }
    }
  }
  return null
}

export const rengNombreElemento = (rengS: string): string => (rengPorSimbolo.get(rengS)?.nombre ?? rengS).toLowerCase()
