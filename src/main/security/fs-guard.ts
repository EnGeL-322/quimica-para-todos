import { promises as fs } from 'node:fs'
import { basename, extname, resolve, sep } from 'node:path'
import { RengAppError } from '@shared/ipc'

const rengGranted = new Set<string>()

const rengNorm = (rengP: string): string => {
  const rengR = resolve(rengP)
  return process.platform === 'win32' ? rengR.toLowerCase() : rengR
}

const RENG_PROTECTED_FRAGMENTS_WIN = ['\\windows\\system32', '\\windows\\syswow64', '\\$recycle.bin', '\\appdata\\local\\microsoft\\credentials']
const RENG_PROTECTED_PREFIXES_NIX = ['/etc/', '/proc/', '/sys/', '/dev/', '/boot/']

export function rengIsProtectedPath(rengP: string): boolean {
  const rengN = rengNorm(rengP)
  if (process.platform === 'win32') return RENG_PROTECTED_FRAGMENTS_WIN.some((rengF) => rengN.includes(rengF))
  return RENG_PROTECTED_PREFIXES_NIX.some((rengF) => (rengN + sep).startsWith(rengF))
}

export interface RengFileInfo {
  path: string
  name: string
  size: number
  ext: string
}

export async function rengGrantFile(rengPath: string, rengOpts: { maxBytes?: number; exts?: readonly string[] } = {}): Promise<RengFileInfo> {
  const rengAbs = resolve(rengPath)
  if (rengIsProtectedPath(rengAbs)) throw new RengAppError('PROTECTED_PATH', 'Esa ubicación del sistema está protegida.')
  const rengSt = await fs.stat(rengAbs).catch(() => null)
  if (!rengSt) throw new RengAppError('NOT_FOUND', `No se encontró el archivo: ${basename(rengAbs)}`)
  if (!rengSt.isFile()) throw new RengAppError('NOT_FILE', 'Solo se aceptan archivos, no carpetas.')
  const { maxBytes: rengMaxBytes = 4 * 1024 ** 3, exts: rengExts } = rengOpts
  if (rengSt.size > rengMaxBytes) throw new RengAppError('TOO_BIG', 'El archivo supera el tamaño máximo permitido.')
  const rengExt = extname(rengAbs).toLowerCase()
  if (rengExts && !rengExts.includes(rengExt)) throw new RengAppError('BAD_EXT', `Tipo de archivo no admitido (${rengExt || 'sin extensión'}).`)
  rengGranted.add(rengNorm(rengAbs))
  return { path: rengAbs, name: basename(rengAbs), size: rengSt.size, ext: rengExt }
}

export function rengGrantOutput(rengPath: string): string {
  const rengAbs = resolve(rengPath)
  if (rengIsProtectedPath(rengAbs)) throw new RengAppError('PROTECTED_PATH', 'Esa ubicación del sistema está protegida.')
  rengGranted.add(rengNorm(rengAbs))
  return rengAbs
}

export function rengIsGranted(rengPath: string): boolean {
  return rengGranted.has(rengNorm(rengPath))
}

export function rengAssertGranted(rengPath: string): string {
  if (typeof rengPath !== 'string' || rengPath.length === 0 || rengPath.length > 4096) {
    throw new RengAppError('BAD_PATH', 'Ruta inválida.')
  }
  if (!rengIsGranted(rengPath)) {
    throw new RengAppError('NOT_GRANTED', 'Primero debes elegir el archivo con el selector de la aplicación.')
  }
  return resolve(rengPath)
}
