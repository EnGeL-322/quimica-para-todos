import { randomBytes } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { RENG_ID_CUADERNO_RE, rengResumenProyecto, rengValidarProyecto, type RengProyecto, type RengResumenProyecto } from '@shared/cuaderno'
import { RengAppError } from '@shared/ipc'

export const RENG_MAX_BYTES_PROYECTO = 60 * 1024 * 1024

export const rengCarpetaCuaderno = (rengUserData: string): string => join(rengUserData, 'cuaderno')
const rengArchivoDe = (rengDir: string, rengId: string): string => {
  if (!RENG_ID_CUADERNO_RE.test(rengId)) throw new RengAppError('VALIDATION', 'Identificador de proyecto no válido.')
  return join(rengDir, `${rengId}.json`)
}

function rengErrorDeDisco(rengE: unknown, rengAccion: 'leer' | 'guardar'): RengAppError {
  const rengCode = (rengE as NodeJS.ErrnoException | null)?.code
  if (rengCode === 'EBUSY' || rengCode === 'EPERM' || rengCode === 'EACCES') return new RengAppError('BUSY', `No se pudo ${rengAccion} el proyecto: el archivo está ocupado o sin permiso. Ciérralo en otros programas y vuelve a intentarlo.`)
  if (rengCode === 'ENOSPC') return new RengAppError('WRITE', 'No se pudo guardar el proyecto: no queda espacio en el disco.')
  if (rengCode === 'ENOENT') return new RengAppError('NOT_FOUND', 'El proyecto no existe o se borró.')
  return new RengAppError(rengAccion === 'leer' ? 'READ' : 'WRITE', `No se pudo ${rengAccion} el proyecto (${rengCode ?? 'error desconocido'}).`)
}

export async function rengEscribirAtomico(rengRuta: string, rengContenido: string): Promise<void> {
  const rengTmp = `${rengRuta}.${randomBytes(6).toString('hex')}.tmp`
  try {
    await fs.writeFile(rengTmp, rengContenido, { encoding: 'utf8', flag: 'wx' })
    await fs.rename(rengTmp, rengRuta)
  } catch (rengE) {
    await fs.rm(rengTmp, { force: true }).catch(() => undefined)
    throw rengErrorDeDisco(rengE, 'guardar')
  }
}

export async function rengListarProyectos(rengDir: string): Promise<{ proyectos: RengResumenProyecto[]; problemas: string[] }> {
  const rengNombres = await fs.readdir(rengDir).catch((rengE: NodeJS.ErrnoException) => (rengE.code === 'ENOENT' ? [] : Promise.reject(rengErrorDeDisco(rengE, 'leer'))))
  const rengProyectos: RengResumenProyecto[] = []
  const rengProblemas: string[] = []
  for (const rengN of rengNombres) {
    if (!rengN.endsWith('.json') || !RENG_ID_CUADERNO_RE.test(rengN.slice(0, -5))) continue
    try {
      rengProyectos.push(rengResumenProyecto(await rengLeerProyecto(rengDir, rengN.slice(0, -5))))
    } catch (rengE) {
      rengProblemas.push(`${rengN}: ${rengE instanceof Error ? rengE.message : String(rengE)}`)
    }
  }
  rengProyectos.sort((rengA, rengB) => rengB.modificado.localeCompare(rengA.modificado))
  return { proyectos: rengProyectos, problemas: rengProblemas }
}

export async function rengLeerProyecto(rengDir: string, rengId: string): Promise<RengProyecto> {
  const rengRuta = rengArchivoDe(rengDir, rengId)
  let rengTexto: string
  try {
    const rengSt = await fs.stat(rengRuta)
    if (rengSt.size > RENG_MAX_BYTES_PROYECTO) throw new RengAppError('TOO_BIG', 'El proyecto supera el tamaño máximo admitido.')
    rengTexto = await fs.readFile(rengRuta, 'utf8')
  } catch (rengE) {
    throw rengE instanceof RengAppError ? rengE : rengErrorDeDisco(rengE, 'leer')
  }
  let rengDatos: unknown
  try {
    rengDatos = JSON.parse(rengTexto)
  } catch {
    throw new RengAppError('VALIDATION', 'El archivo del proyecto está dañado (no es JSON válido).')
  }
  const rengP = rengValidarProyecto(rengDatos)
  if (rengP.id !== rengId) throw new RengAppError('VALIDATION', 'El identificador del proyecto no coincide con su archivo.')
  return rengP
}

export async function rengGuardarProyecto(rengDir: string, rengDatos: unknown, rengAhora = new Date()): Promise<RengProyecto> {
  const rengP = { ...rengValidarProyecto(rengDatos), modificado: rengAhora.toISOString() }
  const rengContenido = JSON.stringify(rengP)
  if (rengContenido.length > RENG_MAX_BYTES_PROYECTO) throw new RengAppError('TOO_BIG', 'El proyecto supera el tamaño máximo admitido: exporta o separa algunas series.')
  try {
    await fs.mkdir(rengDir, { recursive: true })
  } catch (rengE) {
    throw rengErrorDeDisco(rengE, 'guardar')
  }
  await rengEscribirAtomico(rengArchivoDe(rengDir, rengP.id), rengContenido)
  return rengP
}

export async function rengImportarProyecto(rengDir: string, rengTexto: string, rengIdNuevo: string, rengAhora = new Date()): Promise<RengProyecto> {
  if (rengTexto.length > RENG_MAX_BYTES_PROYECTO) throw new RengAppError('TOO_BIG', 'El archivo supera el tamaño máximo admitido.')
  let rengDatos: unknown
  try {
    rengDatos = JSON.parse(rengTexto)
  } catch {
    throw new RengAppError('VALIDATION', 'El archivo no es JSON válido.')
  }
  const rengP = rengValidarProyecto(rengDatos)
  const rengExiste = await fs
    .stat(rengArchivoDe(rengDir, rengP.id))
    .then(() => true)
    .catch(() => false)
  if (rengExiste && !RENG_ID_CUADERNO_RE.test(rengIdNuevo)) throw new RengAppError('VALIDATION', 'Identificador de proyecto no válido.')
  const rengFinal = rengExiste ? { ...rengP, id: rengIdNuevo, nombre: `${rengP.nombre} (importado)`.slice(0, 160) } : rengP
  return rengGuardarProyecto(rengDir, rengFinal, rengAhora)
}
