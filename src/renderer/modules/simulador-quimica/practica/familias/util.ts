import { rengCrearAzar, rengTextoDecimales, rengTextoNumero } from '../numeros'
import type { RengNivelPractica } from '../niveles'
import type { RengDatoEjercicio, RengErrorComun, RengFuenteEjercicio, RengRespuestaNumero } from '../tipos'

export const rengDatoD = (rengClave: string, rengEtiqueta: string, rengValor: number, rengUnidad: string, rengDecimales: number): RengDatoEjercicio => ({
  clave: rengClave,
  etiqueta: rengEtiqueta,
  valor: rengValor,
  unidad: rengUnidad,
  texto: `${rengTextoDecimales(rengValor, rengDecimales)}${rengUnidad ? ` ${rengUnidad}` : ''}`
})

export const rengDatoC = (rengClave: string, rengEtiqueta: string, rengValor: number, rengUnidad: string, rengCifras = 3): RengDatoEjercicio => ({
  clave: rengClave,
  etiqueta: rengEtiqueta,
  valor: rengValor,
  unidad: rengUnidad,
  texto: `${rengTextoNumero(rengValor, rengCifras)}${rengUnidad ? ` ${rengUnidad}` : ''}`
})

export const rengDatoT = (rengClave: string, rengEtiqueta: string, rengValor: string): RengDatoEjercicio => ({ clave: rengClave, etiqueta: rengEtiqueta, valor: rengValor, unidad: '', texto: rengValor })

export const rengMapaDatos = (rengDatos: RengDatoEjercicio[]): Record<string, number> => Object.fromEntries(rengDatos.filter((rengD) => typeof rengD.valor === 'number').map((rengD) => [rengD.clave, rengD.valor as number]))

export const rengTexto = (rengDatos: RengDatoEjercicio[], rengClave: string): string => {
  const rengD = rengDatos.find((rengX) => rengX.clave === rengClave)
  if (!rengD) throw new Error(`falta el dato ${rengClave}`)
  return rengD.texto
}

export function rengNumero(rengValor: number, rengUnidad: string, rengOpc: { tolRel?: number; tolAbs?: number; decimales?: number | null; errores?: RengErrorComun[] } = {}): RengRespuestaNumero {
  return { tipo: 'numero', valor: rengValor, unidad: rengUnidad, tolRel: rengOpc.tolRel ?? 0.01, tolAbs: rengOpc.tolAbs ?? 0, decimales: rengOpc.decimales ?? null, erroresComunes: rengOpc.errores ?? [] }
}

export const RENG_FUENTE_MASAS: RengFuenteEjercicio = {
  texto: 'Masas atómicas: las de la tabla periódica de la app (su origen aún no está verificado; docs/DATOS.md). Tolerancia del 1 %.',
  verificacion: 'didactico'
}

export const RENG_FUENTE_DIDACTICA: RengFuenteEjercicio = {
  texto: 'Datos del enunciado generados por la app con fines didácticos; no son mediciones publicadas.',
  verificacion: 'didactico'
}

export const rengMezclar = <RengT,>(rengAzar: () => number, rengLista: readonly RengT[]): RengT[] => {
  const rengCopia = [...rengLista]
  for (let rengI = rengCopia.length - 1; rengI > 0; rengI--) {
    const rengJ = Math.floor(rengAzar() * (rengI + 1))
    ;[rengCopia[rengI], rengCopia[rengJ]] = [rengCopia[rengJ]!, rengCopia[rengI]!]
  }
  return rengCopia
}

export const rengOpciones = (rengAzar: () => number, rengCorrecta: string, rengOtras: readonly string[], rengN = 4): { opciones: Array<{ id: string; texto: string }>; correcta: string } => {
  const rengDistractores = rengMezclar(rengAzar, rengOtras.filter((rengX) => rengX !== rengCorrecta)).slice(0, rengN - 1)
  const rengTodas = rengMezclar(rengAzar, [rengCorrecta, ...rengDistractores])
  const rengOpc = rengTodas.map((rengTexto, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengTexto }))
  return { opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrecta)!.id }
}

export interface RengVariante {
  id: string
  nivel: RengNivelPractica
}

export const rengVariantesDeNivel = <RengV extends RengVariante>(rengVariantes: readonly RengV[], rengNivel: RengNivelPractica): RengV[] => rengVariantes.filter((rengV) => rengV.nivel === rengNivel)

export const rengVarianteDeSemilla = <RengV extends RengVariante>(rengVariantes: readonly RengV[], rengNivel: RengNivelPractica, rengSemilla: number): RengV | null => {
  const rengLista = rengVariantesDeNivel(rengVariantes, rengNivel)
  if (rengLista.length === 0) return null
  return rengLista[Math.floor(rengCrearAzar(Math.imul(rengSemilla, 7919) + 104729)() * rengLista.length)]!
}
