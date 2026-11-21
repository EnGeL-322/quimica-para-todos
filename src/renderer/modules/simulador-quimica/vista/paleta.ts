import type { RengPaleta } from '../escena/util3d'
import { rengColorTema } from './nivel'

export function rengLeerPaleta(): RengPaleta {
  return {
    texto: rengColorTema('--text', 0xe8ecf8),
    fondo: rengColorTema('--surface', 0x121a30),
    acento: rengColorTema('--accent', 0x38d0ff),
    electron: rengColorTema('--warn', 0xffb547),
    positivo: rengColorTema('--accent-2', 0x8b7bff),
    negativo: rengColorTema('--danger', 0xff5d73)
  }
}
