import { rengFormularDesdeNombre } from './nomenclatura'
import { rengSmilesDesdeNombre } from './organica'
import { rengAnalogo, rengFueraDeLista, rengLecturasMinusculas, rengNombreElemento } from './sugerenciasFormula'

export interface RengAyuda {
  motivo: string
  sugerencias: string[]
}

const RENG_IMPOSIBLE = /no tiene número de oxidación|gas noble|imposible/
const RENG_NO_SE_NOMBRAR = /^No sé nombrar esta fórmula/

const rengEsNombre = (rengT: string): boolean => {
  for (const rengF of [rengFormularDesdeNombre, rengSmilesDesdeNombre]) {
    try {
      rengF(rengT)
      return true
    } catch {
    }
  }
  return false
}

export function rengAyudaMinusculas(rengT: string, rengReconoce: (rengF: string) => string | null): RengAyuda | null {
  if (!/^[a-z][a-z0-9]*$/.test(rengT) || rengEsNombre(rengT)) return null
  const rengLecturas = rengLecturasMinusculas(rengT)
    .map((rengF) => ({ f: rengF, nombre: rengReconoce(rengF) }))
    .filter((rengX): rengX is { f: string; nombre: string } => rengX.nombre !== null)
  if (!rengLecturas.length) return null
  const rengLista = rengLecturas.map((rengX) => `${rengX.f} (${rengX.nombre})`)
  const rengPregunta = rengLista.length === 1 ? rengLista[0]! : `${rengLista.slice(0, -1).join(', ')} o ${rengLista[rengLista.length - 1]}`
  return {
    motivo: `«${rengT}» está en minúsculas y en una fórmula los símbolos empiezan por mayúscula, así que la app no adivina. ¿Querías decir ${rengPregunta}? Elige una opción.`,
    sugerencias: rengLecturas.map((rengX) => rengX.f)
  }
}

export function rengAyudaFormula(rengT: string, rengMotivo: string, rengReconoce: (rengF: string) => string | null): RengAyuda {
  if (RENG_IMPOSIBLE.test(rengMotivo)) return { motivo: `Según las reglas de la app, esta fórmula no es posible: ${rengMotivo}`, sugerencias: [] }
  if (!RENG_NO_SE_NOMBRAR.test(rengMotivo)) return { motivo: rengMotivo, sugerencias: [] }
  const rengPartes: string[] = []
  const rengFuera = rengFueraDeLista(rengT)
  if (rengFuera) rengPartes.push(`El ${rengT} (${rengFuera.nombre}) existe (fuente: ${rengFuera.fuente}), pero no está en la lista de la app: por eso no lo nombra ni explica cómo se formula.`)
  else rengPartes.push(`El ${rengT} no está en la lista de la app: no encaja en ninguna de las funciones que conoce (óxidos, hidruros, sales, hidróxidos, oxoácidos, oxisales y sus iones). Eso no significa que no exista: la app no puede confirmarlo.`)
  const rengA = rengAnalogo(rengT, rengReconoce)
  if (rengA) rengPartes.push(`¿Buscabas el análogo con ${rengA.por} (${rengNombreElemento(rengA.por)}), del mismo grupo que el ${rengA.de} (${rengNombreElemento(rengA.de)})? ${rengA.formula} es el ${rengA.nombre}.`)
  return { motivo: rengPartes.join(' '), sugerencias: rengA ? [rengA.formula] : [] }
}
