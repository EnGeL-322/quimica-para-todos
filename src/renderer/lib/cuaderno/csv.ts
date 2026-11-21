import { RENG_LIMITES_CUADERNO, type RengMagnitud, type RengSerie } from '@shared/cuaderno'
import { rengAnalizarUnidad } from '../unidades'

const rengCeldaTexto = (rengS: string): string => (/[;"\n\r]/.test(rengS) ? `"${rengS.replace(/"/g, '""')}"` : rengS)
export const rengEncabezadoColumna = (rengM: RengMagnitud): string => (rengM.unidad ? `${rengM.clave} (${rengM.unidad})` : rengM.clave)

export function rengCsvDeSerie(rengSerie: RengSerie, rengMetadatos: readonly string[] = []): string {
  const rengLineas = [
    ...rengMetadatos.map((rengM) => `# ${rengM.replace(/[\r\n]+/g, ' ')}`),
    rengSerie.columnas.map((rengC) => rengCeldaTexto(rengEncabezadoColumna(rengC))).join(';'),
    ...rengSerie.filas.map((rengF) => rengF.map((rengX) => (rengX === null || !Number.isFinite(rengX) ? '' : String(rengX))).join(';'))
  ]
  return `${rengLineas.join('\r\n')}\r\n`
}

export type RengSeparador = ',' | ';' | '\t' | ' '
export type RengDecimal = '.' | ','
export interface RengOpcionesCSV {
  separador: 'auto' | RengSeparador
  decimal: 'auto' | RengDecimal
}

export const RENG_NOMBRE_SEPARADOR: Record<RengSeparador, string> = { ',': 'coma', ';': 'punto y coma', '\t': 'tabulador', ' ': 'espacios' }
export const RENG_NOMBRE_DECIMAL: Record<RengDecimal, string> = { '.': 'punto', ',': 'coma' }

export interface RengErrorFila {
  linea: number
  mensaje: string
}

export interface RengResultadoCSV {
  error: string | null
  separador: RengSeparador
  decimal: RengDecimal
  columnas: RengMagnitud[]
  filas: Array<Array<number | null>>
  errores: RengErrorFila[]
  filasOmitidas: number
  faltantes: number
  nan: number
  avisos: string[]
  comentarios: string[]
}

export const RENG_MAX_CARACTERES_CSV = 20 * 1024 * 1024
const RENG_MAX_ERRORES = 200
const RENG_NUMERO = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/

function rengDividir(rengLinea: string, rengSep: RengSeparador): string[] {
  if (rengSep === ' ') return rengLinea.trim().split(/\s+/)
  const rengOut: string[] = []
  let rengCur = ''
  let rengComillas = false
  for (let rengI = 0; rengI < rengLinea.length; rengI++) {
    const rengCh = rengLinea[rengI]!
    if (rengComillas) {
      if (rengCh === '"' && rengLinea[rengI + 1] === '"') {
        rengCur += '"'
        rengI++
      } else if (rengCh === '"') rengComillas = false
      else rengCur += rengCh
    } else if (rengCh === '"') rengComillas = true
    else if (rengCh === rengSep) {
      rengOut.push(rengCur)
      rengCur = ''
    } else rengCur += rengCh
  }
  rengOut.push(rengCur)
  return rengOut.map((rengC) => rengC.trim())
}

function rengLeerCelda(rengC: string, rengDec: RengDecimal): number | null | 'nan' | 'invalido' {
  if (rengC === '') return null
  if (/^nan$/i.test(rengC)) return 'nan'
  let rengT = rengC.replace(/[−–]/g, '-')
  if (rengDec === ',') {
    if (rengT.includes('.')) return 'invalido'
    rengT = rengT.replace(',', '.')
  } else if (rengT.includes(',')) return 'invalido'
  if (!RENG_NUMERO.test(rengT)) return 'invalido'
  const rengN = Number(rengT)
  return Number.isFinite(rengN) ? rengN : 'invalido'
}

function rengDetectarSeparador(rengLineas: readonly string[]): RengSeparador {
  const rengMuestra = rengLineas.slice(0, 20)
  for (const rengS of [';', '\t', ','] as const) {
    if (rengMuestra[0]?.includes(rengS) && rengMuestra.filter((rengL) => rengL.includes(rengS)).length >= Math.ceil(rengMuestra.length * 0.6)) return rengS
  }
  return ' '
}

function rengDetectarDecimal(rengLineas: readonly string[], rengSep: RengSeparador): RengDecimal {
  if (rengSep === ',') return '.'
  let rengComa = 0
  let rengPunto = 0
  for (const rengL of rengLineas.slice(1, 50))
    for (const rengC of rengDividir(rengL, rengSep)) {
      if (/^[-+]?\d*,\d+([eE][-+]?\d+)?$/.test(rengC)) rengComa++
      else if (/^[-+]?\d*\.\d+([eE][-+]?\d+)?$/.test(rengC)) rengPunto++
    }
  return rengComa > rengPunto ? ',' : '.'
}

function rengEncabezado(rengCelda: string): { nombre: string; unidad: string } {
  const rengM = /^(.*?)\s*[([]\s*([^()[\]]*?)\s*[)\]]\s*$/.exec(rengCelda)
  return rengM ? { nombre: rengM[1]!.trim(), unidad: rengM[2]!.trim() } : { nombre: rengCelda.trim(), unidad: '' }
}

const rengClaveDe = (rengNombre: string, rengI: number): string => {
  const rengBase = rengNombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30)
  return /^[A-Za-z]/.test(rengBase) ? rengBase : `c${rengI + 1}${rengBase ? `_${rengBase}` : ''}`.slice(0, 30)
}

const rengVacio = (rengSep: RengSeparador, rengDec: RengDecimal, rengError: string): RengResultadoCSV => ({ error: rengError, separador: rengSep, decimal: rengDec, columnas: [], filas: [], errores: [], filasOmitidas: 0, faltantes: 0, nan: 0, avisos: [], comentarios: [] })

export function rengAnalizarCSV(rengTexto: string, rengOp: RengOpcionesCSV): RengResultadoCSV {
  if (rengTexto.length > RENG_MAX_CARACTERES_CSV) return rengVacio(',', '.', `El archivo supera ${RENG_MAX_CARACTERES_CSV / 1024 / 1024} MB.`)
  const rengTodas = rengTexto.replace(/^﻿/, '').split(/\r\n|\n|\r/)
  const rengComentarios: string[] = []
  const rengLineas: Array<{ n: number; texto: string }> = []
  rengTodas.forEach((rengT, rengI) => {
    if (rengT.trim() === '') return
    if (rengT.trimStart().startsWith('#')) {
      if (rengLineas.length === 0) rengComentarios.push(rengT.trimStart().slice(1).trim())
      return
    }
    rengLineas.push({ n: rengI + 1, texto: rengT })
  })
  const rengTextos = rengLineas.map((rengL) => rengL.texto)
  const rengSep: RengSeparador = rengOp.separador === 'auto' ? rengDetectarSeparador(rengTextos) : rengOp.separador
  const rengDec: RengDecimal = rengOp.decimal === 'auto' ? rengDetectarDecimal(rengTextos, rengSep) : rengOp.decimal
  const rengAvisos: string[] = []
  if (rengSep === ',' && rengDec === ',') return rengVacio(rengSep, rengDec, 'Con coma decimal, las columnas no pueden ir separadas por comas: elige punto y coma o tabulador como separador, o punto como decimal.')
  if (rengOp.separador === 'auto') rengAvisos.push(`Separador detectado: ${RENG_NOMBRE_SEPARADOR[rengSep]}.`)
  if (rengOp.decimal === 'auto') rengAvisos.push(`Decimal detectado: ${RENG_NOMBRE_DECIMAL[rengDec]}.`)
  if (rengLineas.length === 0) return { ...rengVacio(rengSep, rengDec, 'El archivo no tiene datos.'), comentarios: rengComentarios }

  const rengPrimera = rengDividir(rengLineas[0]!.texto, rengSep)
  if (rengPrimera.length > RENG_LIMITES_CUADERNO.columnas) return rengVacio(rengSep, rengDec, `El archivo tiene ${rengPrimera.length} columnas; el máximo es ${RENG_LIMITES_CUADERNO.columnas}.`)
  const rengConEncabezado = !rengPrimera.every((rengC) => typeof rengLeerCelda(rengC, rengDec) === 'number')
  const rengColumnas: RengMagnitud[] = []
  if (rengConEncabezado) {
    const rengUsadas = new Set<string>()
    for (const [rengI, rengCelda] of rengPrimera.entries()) {
      const { nombre: rengNombre, unidad: rengUnidad } = rengEncabezado(rengCelda)
      if (rengNombre === '') return rengVacio(rengSep, rengDec, `El encabezado de la columna ${rengI + 1} está vacío: cada columna necesita un nombre.`)
      let rengClave = rengClaveDe(rengNombre, rengI)
      if (rengUsadas.has(rengClave)) {
        rengAvisos.push(`El encabezado «${rengNombre}» está repetido: la columna ${rengI + 1} se llama «${rengClave}_${rengI + 1}».`)
        rengClave = `${rengClave}_${rengI + 1}`.slice(0, 41)
      }
      rengUsadas.add(rengClave)
      if (rengUnidad === '') rengAvisos.push(`La columna «${rengNombre}» no declara unidad: se tratará como adimensional y no se podrá convertir.`)
      else if (!rengAnalizarUnidad(rengUnidad).ok) rengAvisos.push(`No reconozco la unidad «${rengUnidad}» de la columna «${rengNombre}»: se conserva el texto, pero no se podrá convertir.`)
      rengColumnas.push({ clave: rengClave, nombre: rengNombre, unidad: rengUnidad })
    }
  } else {
    rengAvisos.push('No hay fila de encabezado: las columnas quedan sin nombre ni unidad (c1, c2…).')
    rengPrimera.forEach((_, rengI) => rengColumnas.push({ clave: `c${rengI + 1}`, nombre: `columna ${rengI + 1}`, unidad: '' }))
  }

  const rengFilas: Array<Array<number | null>> = []
  const rengErrores: RengErrorFila[] = []
  let rengFilasOmitidas = 0
  let rengFaltantes = 0
  let rengNan = 0
  const rengError = (rengLinea: number, rengMensaje: string): void => {
    rengFilasOmitidas++
    if (rengErrores.length < RENG_MAX_ERRORES) rengErrores.push({ linea: rengLinea, mensaje: rengMensaje })
  }
  for (const { n: rengN, texto: rengT } of rengLineas.slice(rengConEncabezado ? 1 : 0)) {
    if (rengFilas.length >= RENG_LIMITES_CUADERNO.filas) {
      return { error: `El archivo tiene más de ${RENG_LIMITES_CUADERNO.filas.toLocaleString('es')} filas de datos (máximo admitido).`, separador: rengSep, decimal: rengDec, columnas: rengColumnas, filas: [], errores: rengErrores, filasOmitidas: rengFilasOmitidas, faltantes: rengFaltantes, nan: rengNan, avisos: rengAvisos, comentarios: rengComentarios }
    }
    const rengCeldas = rengDividir(rengT, rengSep)
    if (rengCeldas.length !== rengColumnas.length) {
      rengError(rengN, `tiene ${rengCeldas.length} ${rengCeldas.length === 1 ? 'valor' : 'valores'} y se esperaban ${rengColumnas.length}.`)
      continue
    }
    const rengFila: Array<number | null> = []
    let rengMal: string | null = null
    for (const [rengJ, rengC] of rengCeldas.entries()) {
      const rengV = rengLeerCelda(rengC, rengDec)
      if (rengV === 'invalido') {
        rengMal = `columna «${rengColumnas[rengJ]!.nombre}»: «${rengC.slice(0, 30)}» no es un número${/[.,]/.test(rengC) ? ` con ${RENG_NOMBRE_DECIMAL[rengDec]} decimal` : ''}.`
        break
      }
      if (rengV === 'nan') {
        rengNan++
        rengFila.push(null)
      } else {
        if (rengV === null) rengFaltantes++
        rengFila.push(rengV)
      }
    }
    if (rengMal) rengError(rengN, rengMal)
    else rengFilas.push(rengFila)
  }
  if (rengFilas.length === 0) return { error: 'Ninguna fila de datos se pudo leer: revisa el separador y el decimal.', separador: rengSep, decimal: rengDec, columnas: rengColumnas, filas: rengFilas, errores: rengErrores, filasOmitidas: rengFilasOmitidas, faltantes: rengFaltantes, nan: rengNan, avisos: rengAvisos, comentarios: rengComentarios }
  if (rengFaltantes > 0) rengAvisos.push(`${rengFaltantes} ${rengFaltantes === 1 ? 'celda vacía queda' : 'celdas vacías quedan'} como dato faltante.`)
  if (rengNan > 0) rengAvisos.push(`${rengNan} ${rengNan === 1 ? 'valor NaN queda' : 'valores NaN quedan'} como dato faltante.`)
  rengColumnas.forEach((rengC, rengJ) => {
    if (rengFilas.every((rengF) => rengF[rengJ] === null)) rengAvisos.push(`La columna «${rengC.nombre}» no tiene ningún número.`)
  })
  return { error: null, separador: rengSep, decimal: rengDec, columnas: rengColumnas, filas: rengFilas, errores: rengErrores, filasOmitidas: rengFilasOmitidas, faltantes: rengFaltantes, nan: rengNan, avisos: rengAvisos, comentarios: rengComentarios }
}
