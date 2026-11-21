import { rengReemplazarActivo } from '../../src/renderer/modules/simulador-quimica/estado/acciones'
import { rengEstadoInicial, rengNormalizar, type RengEstadoTrabajo } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengAnadirAtomo, rengUnir, type RengMesa, type RengVec3 } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'

export function rengOxoacidoSencillo(rengCentral: string, rengNO: number, rengNH: number): RengEstadoTrabajo {
  let rengM: RengMesa = rengEstadoInicial().mesa
  const rengAdd = (rengEl: string, rengP: RengVec3): number => {
    const rengR = rengAnadirAtomo(rengM, rengEl, rengP)
    rengM = rengR.mesa
    return rengR.id
  }
  const rengX = rengAdd(rengCentral, [0, 0, 0])
  const rengDirs: RengVec3[] = [[1.5, 0, 0], [-1.5, 0, 0], [0, 1.5, 0], [0, -1.5, 0]]
  const rengOs = rengDirs.slice(0, rengNO).map((rengP) => rengAdd('O', rengP))
  for (const rengO of rengOs) rengM = rengUnir(rengM, rengX, rengO).mesa
  rengOs.slice(0, rengNH).forEach((rengO, rengI) => {
    const rengH = rengAdd('H', [rengDirs[rengI]![0] * 1.8, rengDirs[rengI]![1] * 1.8, 0])
    rengM = rengUnir(rengM, rengO, rengH).mesa
  })
  return rengNormalizar({ ...rengEstadoInicial(), mesa: rengM })
}

export const rengCon = (rengTexto: string): RengEstadoTrabajo => {
  const rengR = rengReemplazarActivo(rengEstadoInicial(), rengTexto)
  if (!rengR.ok) throw new Error(`${rengTexto}: ${JSON.stringify(rengR)}`)
  return rengR.estado
}
