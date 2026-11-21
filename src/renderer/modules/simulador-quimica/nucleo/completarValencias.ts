import { rengLibresDe } from './analisisMesa'
import { rengElectronegatividad } from './electronegatividad'
import { rengValencia } from './enlazar'
import { rengAtomo, rengEnlacesDe, type RengMesa } from './mesa'
import { rengPorSimbolo } from '../../tabla-periodica/data'

export interface RengPropuestaValencia {
  id: 'multiples' | 'cargas'
  titulo: string
  nota: string
  mesa: RengMesa
}

const RENG_HIPER_CON = new Set(['F', 'O', 'Cl'])
const rengCovalente = (rengT: string): boolean => rengT !== 'ionico' && rengT !== 'metalico'
const rengSumaOrdenes = (rengM: RengMesa, rengId: number): number => rengEnlacesDe(rengM, rengId).filter((rengE) => rengCovalente(rengE.tipo)).reduce((rengS, rengE) => rengS + rengE.orden, 0)
const rengPeriodo = (rengEl: string): number => rengPorSimbolo.get(rengEl)?.periodo ?? 0
const rengGrupo = (rengEl: string): number => rengPorSimbolo.get(rengEl)?.grupo ?? 0

function rengSubirOrden(rengM: RengMesa, rengA: number, rengB: number): RengMesa {
  return { ...rengM, enlaces: rengM.enlaces.map((rengE) => ((rengE.a === rengA && rengE.b === rengB) || (rengE.a === rengB && rengE.b === rengA) ? { ...rengE, orden: rengE.orden + 1 } : rengE)) }
}

function rengAdmiteExpandido(rengM: RengMesa, rengB: number, rengA: number): boolean {
  const RENG_B = rengAtomo(rengM, rengB)!
  const rengV = rengValencia(RENG_B.el, RENG_B.carga)
  return !!rengV && rengPeriodo(RENG_B.el) >= 3 && RENG_HIPER_CON.has(rengAtomo(rengM, rengA)!.el) && rengSumaOrdenes(rengM, rengB) + 1 <= rengV.max
}

function rengCerrarConMultiples(rengM0: RengMesa, rengIds: readonly number[], rengExpandir: boolean): { mesa: RengMesa; expandido: boolean } {
  let rengM = rengM0
  let rengExpandido = false
  for (let rengVuelta = 0; rengVuelta < 24; rengVuelta++) {
    const rengPendientes = rengIds.filter((rengId) => rengLibresDe(rengM, rengId) > 0)
    if (!rengPendientes.length) break
    let rengHecho = false
    for (const rengA of rengPendientes) {
      const rengE = rengEnlacesDe(rengM, rengA).find((rengX) => rengCovalente(rengX.tipo) && rengX.orden < 3 && rengLibresDe(rengM, rengX.a === rengA ? rengX.b : rengX.a) > 0)
      if (rengE) {
        rengM = rengSubirOrden(rengM, rengE.a, rengE.b)
        rengHecho = true
        break
      }
    }
    if (!rengHecho && rengExpandir) {
      for (const rengA of rengPendientes) {
        const rengE = rengEnlacesDe(rengM, rengA).find((rengX) => rengCovalente(rengX.tipo) && rengX.orden < 3 && rengAdmiteExpandido(rengM, rengX.a === rengA ? rengX.b : rengX.a, rengA))
        if (rengE) {
          rengM = rengSubirOrden(rengM, rengE.a, rengE.b)
          rengExpandido = true
          rengHecho = true
          break
        }
      }
    }
    if (!rengHecho) break
  }
  return { mesa: rengM, expandido: rengExpandido }
}

function rengPonerCargas(rengM0: RengMesa, rengIds: readonly number[]): RengMesa {
  let rengM = rengM0
  for (const rengA of rengIds) {
    const RENG_A = rengAtomo(rengM, rengA)!
    if (rengLibresDe(rengM, rengA) !== 1 || ![16, 17].includes(rengGrupo(RENG_A.el))) continue
    const rengVecinos = rengEnlacesDe(rengM, rengA).filter((rengE) => rengCovalente(rengE.tipo))
    if (rengVecinos.length !== 1) continue
    const rengB = rengVecinos[0]!.a === rengA ? rengVecinos[0]!.b : rengVecinos[0]!.a
    const RENG_B = rengAtomo(rengM, rengB)!
    if (RENG_B.el === 'H' || (rengElectronegatividad(RENG_B.el) ?? 9) >= (rengElectronegatividad(RENG_A.el) ?? 0)) continue
    const rengV = rengValencia(RENG_B.el, RENG_B.carga + 1)
    if (!rengV || rengSumaOrdenes(rengM, rengB) > rengV.max || (rengPeriodo(RENG_B.el) === 2 && RENG_B.carga >= 1)) continue
    rengM = { ...rengM, atomos: rengM.atomos.map((rengX) => (rengX.id === rengA ? { ...rengX, carga: rengX.carga - 1 } : rengX.id === rengB ? { ...rengX, carga: rengX.carga + 1 } : rengX)) }
  }
  return rengM
}

const rengCompleto = (rengM: RengMesa, rengIds: readonly number[]): boolean => rengIds.every((rengId) => rengLibresDe(rengM, rengId) === 0)
const rengFirma = (rengM: RengMesa): string => JSON.stringify([rengM.atomos.map((rengA) => [rengA.id, rengA.carga]), rengM.enlaces.map((rengE) => [rengE.a, rengE.b, rengE.orden])])

function rengResumen(rengAntes: RengMesa, rengDespues: RengMesa): string {
  const rengCambios = new Map<string, number>()
  for (const rengE of rengDespues.enlaces) {
    const rengO = rengAntes.enlaces.find((rengX) => rengX.a === rengE.a && rengX.b === rengE.b)
    if (rengO && rengO.orden !== rengE.orden) {
      const [RENG_A, RENG_B] = [rengAtomo(rengDespues, rengE.a)!.el, rengAtomo(rengDespues, rengE.b)!.el].sort((rengX, rengY) => (rengElectronegatividad(rengX) ?? 0) - (rengElectronegatividad(rengY) ?? 0))
      const rengK = `${RENG_A}${rengE.orden === 2 ? '=' : '≡'}${RENG_B}`
      rengCambios.set(rengK, (rengCambios.get(rengK) ?? 0) + 1)
    }
  }
  return [...rengCambios].map(([rengK, rengN]) => `${rengN > 1 ? `${rengN} ` : ''}${rengK}`).join(', ')
}

export function rengPropuestasValencia(rengM: RengMesa, rengIds: readonly number[]): RengPropuestaValencia[] {
  if (rengIds.length < 2 || rengCompleto(rengM, rengIds)) return []
  const rengOut: RengPropuestaValencia[] = []
  const rengA = rengCerrarConMultiples(rengM, rengIds, true)
  if (rengCompleto(rengA.mesa, rengIds)) {
    const rengR = rengResumen(rengM, rengA.mesa)
    rengOut.push({
      id: 'multiples',
      titulo: `Enlaces múltiples (${rengR})`,
      nota: rengA.expandido
        ? `Sube el orden de algunos enlaces: ${rengR}. El átomo central supera los 4 pares (octeto expandido o hipervalencia), la forma habitual de dibujarlo en los libros de texto. Es un modelo de Lewis, no una medida.`
        : `Sube el orden de algunos enlaces: ${rengR}. Cada átomo queda con su valencia habitual. Es un modelo de Lewis, no una medida.`,
      mesa: rengA.mesa
    })
  }
  const rengConCargas = rengCerrarConMultiples(rengPonerCargas(rengM, rengIds), rengIds, false).mesa
  if (rengCompleto(rengConCargas, rengIds) && rengFirma(rengConCargas) !== rengFirma(rengA.mesa) && rengConCargas.atomos.some((rengX, rengI) => rengX.carga !== rengM.atomos[rengI]!.carga)) {
    const rengCargados = rengConCargas.atomos.filter((rengX, rengI) => rengIds.includes(rengX.id) && rengX.carga !== rengM.atomos[rengI]!.carga)
    const rengTexto = [...new Set(rengCargados.map((rengX) => `${rengX.el}${rengX.carga > 0 ? '+' : '−'}${Math.abs(rengX.carga) > 1 ? Math.abs(rengX.carga) : ''}`))].join(', ')
    const rengR = rengResumen(rengM, rengConCargas)
    rengOut.push({
      id: 'cargas',
      titulo: 'Octeto con cargas formales',
      nota: `Todos los átomos con el octeto; aparecen cargas formales (${rengTexto})${rengR ? ` y ${rengR}` : ''}. La carga total no cambia. Es otra estructura de Lewis válida del mismo compuesto, no una medida.`,
      mesa: rengConCargas
    })
  }
  return rengOut
}
