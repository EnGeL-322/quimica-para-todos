import { RENG_MAX_PENDIENTES, rengIntentoNuevo, type RengIntento, type RengLogro } from './estado'
import { rengEsNivelPractica, type RengNivelPractica } from './niveles'
import { RENG_RAMAS, type RengRama, type RengVeredicto } from './tipos'

export const RENG_CLAVE_PRACTICA = 'ciencia.practica.simulador-quimica'
export const RENG_VERSION_PRACTICA = 2

export interface RengReferenciaResuelta {
  ejercicioId: string
  huella: string
  tema: string
  nivel: RengNivelPractica
  semilla: number
  rama: RengRama
}

export interface RengCorreccionResuelta {
  veredicto: RengVeredicto
  metodo: RengVeredicto | null
  completa: boolean
}

export interface RengResolvedorPractica {
  porId: (rengId: string) => RengReferenciaResuelta | null
  legado: (rengTema: string, rengNivel: RengNivelPractica, rengSemilla: number) => RengReferenciaResuelta | null
  corregir: (rengId: string, rengRespuesta: string, rengMetodo: string | null) => RengCorreccionResuelta | null
}

export interface RengPracticaLeida {
  rama: RengRama | null
  actual: RengIntento | null
  pendientes: RengIntento[]
  logros: Record<string, RengLogro>
}

export interface RengResultadoLectura {
  practica: RengPracticaLeida | null
  avisos: string[]
  formato: 'vacio' | 'v1' | 'v2' | 'ilegible'
}

const RENG_MAX_TEXTO = 2000
const RENG_MAX_LOGROS = 2000

const rengEsRegistro = (rengX: unknown): rengX is Record<string, unknown> => typeof rengX === 'object' && rengX !== null && !Array.isArray(rengX)
const rengEntero = (rengX: unknown, rengMax: number): number | null => (typeof rengX === 'number' && Number.isInteger(rengX) && rengX >= 0 && rengX <= rengMax ? rengX : null)
const rengTextoCorto = (rengX: unknown, rengMax: number): string | null => (typeof rengX === 'string' && rengX.length <= rengMax ? rengX : null)

interface RengBorradorLeido {
  respuesta: string
  metodo: string | null
  pistas: number
  resolucion: boolean
  comprobaciones: number
  comprobada: { respuesta: string; metodo: string | null } | null
  resuelto: boolean
  acertado: boolean
}

function rengLeerBorrador(rengB: unknown): RengBorradorLeido | null {
  if (!rengEsRegistro(rengB)) return null
  const rengRespuesta = rengTextoCorto(rengB['respuesta'], RENG_MAX_TEXTO)
  const rengMetodo = rengB['metodo'] === null ? null : rengTextoCorto(rengB['metodo'], 40)
  const rengPistas = rengEntero(rengB['pistas'], 20)
  const rengComprobaciones = rengEntero(rengB['comprobaciones'], 100000)
  if (rengRespuesta === null || (rengB['metodo'] !== null && rengMetodo === null) || rengPistas === null || rengComprobaciones === null) return null
  if (typeof rengB['resolucion'] !== 'boolean' || typeof rengB['resuelto'] !== 'boolean') return null
  let rengComprobada: RengBorradorLeido['comprobada'] = null
  if (rengB['comprobada'] !== null && rengB['comprobada'] !== undefined) {
    if (!rengEsRegistro(rengB['comprobada'])) return null
    const rengR = rengTextoCorto(rengB['comprobada']['respuesta'], RENG_MAX_TEXTO)
    const rengM = rengB['comprobada']['metodo'] === null ? null : rengTextoCorto(rengB['comprobada']['metodo'], 40)
    if (rengR === null || (rengB['comprobada']['metodo'] !== null && rengM === null)) return null
    rengComprobada = { respuesta: rengR, metodo: rengM }
  }
  const rengAcertado = typeof rengB['acertado'] === 'boolean' ? rengB['acertado'] : rengB['resuelto']
  return { respuesta: rengRespuesta, metodo: rengMetodo, pistas: rengPistas, resolucion: rengB['resolucion'], comprobaciones: rengComprobaciones, comprobada: rengComprobada, resuelto: rengB['resuelto'], acertado: rengAcertado }
}

function rengLeerLogro(rengL: unknown, rengRef: RengReferenciaResuelta): RengLogro | null {
  if (!rengEsRegistro(rengL)) return null
  const rengEstado = rengL['estado']
  const rengAciertos = rengEntero(rengL['aciertos'], 100000)
  const rengRepeticiones = rengEntero(rengL['repeticiones'], 100000)
  const rengComprobaciones = rengEntero(rengL['comprobaciones'], 1000000)
  if ((rengEstado !== 'revisada' && rengEstado !== 'resuelta') || rengAciertos === null || rengRepeticiones === null || rengComprobaciones === null || typeof rengL['conResolucion'] !== 'boolean') return null
  if (rengEstado === 'resuelta' && rengAciertos < 1) return null
  return { tema: rengRef.tema, nivel: rengRef.nivel, estado: rengEstado, aciertos: rengAciertos, repeticiones: rengRepeticiones, conResolucion: rengL['conResolucion'], comprobaciones: rengComprobaciones }
}

function rengConstruirIntento(rengRef: RengReferenciaResuelta, rengB: RengBorradorLeido, rengResolvedor: RengResolvedorPractica): RengIntento {
  const rengBase = rengIntentoNuevo(rengRef.tema, rengRef.nivel, rengRef.semilla, { ejercicioId: rengRef.ejercicioId, huella: rengRef.huella })
  const rengCorreccion = rengB.comprobada ? rengResolvedor.corregir(rengRef.ejercicioId, rengB.comprobada.respuesta, rengB.comprobada.metodo) : null
  return {
    ...rengBase,
    respuesta: rengB.respuesta,
    metodo: rengB.metodo,
    pistas: rengB.pistas,
    resolucion: rengB.resolucion,
    comprobada: rengCorreccion ? rengB.comprobada : null,
    veredicto: rengCorreccion?.veredicto ?? null,
    veredictoMetodo: rengCorreccion?.metodo ?? null,
    comprobaciones: rengB.comprobaciones,
    resuelto: rengB.resuelto && rengCorreccion !== null && rengCorreccion.completa && rengB.respuesta === rengB.comprobada?.respuesta && rengB.metodo === rengB.comprobada?.metodo,
    acertado: rengB.acertado
  }
}

const rengDescribir = (rengTema: unknown, rengNivel: unknown, rengDetalle: string): string => `${typeof rengTema === 'string' ? rengTema : 'tema desconocido'}${typeof rengNivel === 'string' ? ` (${rengNivel})` : ''}${rengDetalle ? ` ${rengDetalle}` : ''}`

export function rengSerializarPractica(rengP: { rama: RengRama; actual: RengIntento; pendientes: RengIntento[]; logros: Readonly<Record<string, RengLogro>> }, rengIntentoAbierto: (rengI: RengIntento) => boolean): string {
  const rengBorrador = (rengI: RengIntento): Record<string, unknown> | null =>
    rengI.ejercicioId && rengI.huella
      ? { id: rengI.ejercicioId, huella: rengI.huella, respuesta: rengI.respuesta, metodo: rengI.metodo, pistas: rengI.pistas, resolucion: rengI.resolucion, comprobaciones: rengI.comprobaciones, comprobada: rengI.comprobada, resuelto: rengI.resuelto, acertado: rengI.acertado }
      : null
  const rengLogros = Object.fromEntries(Object.entries(rengP.logros).map(([rengId, rengL]) => [rengId, { estado: rengL.estado, aciertos: rengL.aciertos, repeticiones: rengL.repeticiones, conResolucion: rengL.conResolucion, comprobaciones: rengL.comprobaciones }]))
  const rengActual = rengIntentoAbierto(rengP.actual) || rengP.actual.acertado ? rengBorrador(rengP.actual) : null
  return JSON.stringify({ v: RENG_VERSION_PRACTICA, rama: rengP.rama, actual: rengActual, pendientes: rengP.pendientes.map(rengBorrador).filter((rengX) => rengX !== null), logros: rengLogros })
}

export function rengLeerPractica(rengTexto: string | null | undefined, rengResolvedor: RengResolvedorPractica): RengResultadoLectura {
  if (!rengTexto) return { practica: null, avisos: [], formato: 'vacio' }
  let rengDatos: unknown
  try {
    rengDatos = JSON.parse(rengTexto)
  } catch {
    return { practica: null, avisos: ['Tu progreso de prácticas guardado está dañado y no se pudo leer. Empiezas sin borradores.'], formato: 'ilegible' }
  }
  if (!rengEsRegistro(rengDatos) || (rengDatos['v'] !== 1 && rengDatos['v'] !== RENG_VERSION_PRACTICA)) {
    return { practica: null, avisos: ['Tu progreso de prácticas guardado tiene un formato desconocido: no se usó.'], formato: 'ilegible' }
  }
  const rengAvisos: string[] = []
  const rengRama = RENG_RAMAS.some((rengR) => rengR.id === rengDatos['rama']) ? (rengDatos['rama'] as RengRama) : null
  const rengLeerLista = (rengLista: unknown): unknown[] => (Array.isArray(rengLista) ? rengLista.slice(0, RENG_MAX_PENDIENTES + 1) : [])

  if (rengDatos['v'] === 1) {
    const rengConvertir = (rengX: unknown): RengIntento | null => {
      if (!rengEsRegistro(rengX)) return null
      const rengTema = rengTextoCorto(rengX['tema'], 60)
      const rengSemilla = rengEntero(rengX['semilla'], 1_000_000)
      if (!rengTema || !rengEsNivelPractica(rengX['nivel']) || rengSemilla === null || rengSemilla < 1) {
        rengAvisos.push(`No se pudo leer un intento antiguo (${rengDescribir(rengX['tema'], rengX['nivel'], '')}): se descartó.`)
        return null
      }
      const rengRef = rengResolvedor.legado(rengTema, rengX['nivel'], rengSemilla)
      const rengB = rengLeerBorrador({ ...rengX, resuelto: rengX['resuelto'] === true, resolucion: rengX['resolucion'] === true, comprobada: null })
      if (!rengRef || !rengB) {
        rengAvisos.push(`El intento antiguo de «${rengTema}», nivel ${rengX['nivel']}, variante ${rengSemilla}, no se pudo asociar con certeza a un ejercicio: no se conservó su respuesta.`)
        return null
      }
      return rengConstruirIntento(rengRef, { ...rengB, comprobada: null, resuelto: false }, rengResolvedor)
    }
    const rengActual = rengConvertir(rengDatos['actual'])
    const rengPendientes = rengLeerLista(rengDatos['pendientes']).map(rengConvertir).filter((rengX): rengX is RengIntento => rengX !== null)
    return { practica: { rama: rengRama, actual: rengActual, pendientes: rengPendientes.slice(0, RENG_MAX_PENDIENTES), logros: {} }, avisos: rengAvisos, formato: 'v1' }
  }

  const rengConvertir = (rengX: unknown): RengIntento | null => {
    if (!rengEsRegistro(rengX)) {
      rengAvisos.push('Se descartó un borrador con formato inválido.')
      return null
    }
    const rengId = rengTextoCorto(rengX['id'], 120)
    const rengHuella = rengTextoCorto(rengX['huella'], 40)
    const rengB = rengLeerBorrador(rengX)
    if (!rengId || !rengHuella || !rengB) {
      rengAvisos.push('Se descartó un borrador con datos inválidos.')
      return null
    }
    const rengRef = rengResolvedor.porId(rengId)
    if (!rengRef) {
      rengAvisos.push(`Un borrador guardado (${rengId}) ya no corresponde a ningún ejercicio de esta versión: no se asoció su respuesta a otro.`)
      return null
    }
    if (rengRef.huella !== rengHuella) {
      rengAvisos.push(`El ejercicio ${rengId} cambió desde que guardaste tu borrador: no se asoció tu respuesta al problema nuevo.`)
      return null
    }
    return rengConstruirIntento(rengRef, rengB, rengResolvedor)
  }
  const rengActual = rengDatos['actual'] === null || rengDatos['actual'] === undefined ? null : rengConvertir(rengDatos['actual'])
  const rengPendientes = rengLeerLista(rengDatos['pendientes']).map(rengConvertir).filter((rengX): rengX is RengIntento => rengX !== null)
  const rengLogros: Record<string, RengLogro> = {}
  if (rengEsRegistro(rengDatos['logros'])) {
    for (const [rengId, rengL] of Object.entries(rengDatos['logros']).slice(0, RENG_MAX_LOGROS)) {
      const rengRef = rengResolvedor.porId(rengId)
      const rengLogro = rengRef ? rengLeerLogro(rengL, rengRef) : null
      if (!rengRef || !rengLogro) {
        rengAvisos.push(`Se descartó el logro guardado de ${rengId}: no corresponde a un ejercicio válido de esta versión.`)
        continue
      }
      rengLogros[rengId] = rengLogro
    }
  }
  return { practica: { rama: rengRama, actual: rengActual, pendientes: rengPendientes.slice(0, RENG_MAX_PENDIENTES), logros: rengLogros }, avisos: rengAvisos, formato: 'v2' }
}
