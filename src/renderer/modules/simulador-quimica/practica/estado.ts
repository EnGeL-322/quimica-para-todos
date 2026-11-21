import type { RengNivelPractica } from './niveles'
import type { RengRama, RengVeredicto } from './tipos'

export interface RengIntento {
  ejercicioId: string | null
  huella: string | null
  tema: string
  nivel: RengNivelPractica
  semilla: number
  respuesta: string
  metodo: string | null
  pistas: number
  resolucion: boolean
  veredicto: RengVeredicto | null
  veredictoMetodo: RengVeredicto | null
  comprobada: { respuesta: string; metodo: string | null } | null
  comprobaciones: number
  resuelto: boolean
  acertado: boolean
}

export type RengEstadoEjercicio = 'pendiente' | 'revisada' | 'resuelta'

export interface RengLogro {
  tema: string
  nivel: RengNivelPractica
  estado: 'revisada' | 'resuelta'
  aciertos: number
  repeticiones: number
  conResolucion: boolean
  comprobaciones: number
}

export interface RengEstadoPractica {
  rama: RengRama
  actual: RengIntento
  pendientes: RengIntento[]
  logros: Readonly<Record<string, RengLogro>>
}

export const RENG_MAX_PENDIENTES = 5

export const rengClaveIntento = (rengI: Pick<RengIntento, 'ejercicioId' | 'tema' | 'nivel' | 'semilla'>): string => rengI.ejercicioId ?? `${rengI.tema}~${rengI.nivel}~${rengI.semilla}`

export interface RengReferenciaIntento {
  ejercicioId: string | null
  huella: string | null
}

export const rengIntentoNuevo = (rengTema: string, rengNivel: RengNivelPractica, rengSemilla: number, rengRef: RengReferenciaIntento = { ejercicioId: null, huella: null }): RengIntento => ({
  ejercicioId: rengRef.ejercicioId,
  huella: rengRef.huella,
  tema: rengTema,
  nivel: rengNivel,
  semilla: rengSemilla,
  respuesta: '',
  metodo: null,
  pistas: 0,
  resolucion: false,
  veredicto: null,
  veredictoMetodo: null,
  comprobada: null,
  comprobaciones: 0,
  resuelto: false,
  acertado: false
})

export const rengIntentoAbierto = (rengI: RengIntento): boolean => !rengI.acertado && (rengI.respuesta.trim() !== '' || rengI.metodo !== null || rengI.pistas > 0 || rengI.resolucion || rengI.comprobaciones > 0)

export const rengEstadoEjercicio = (rengLogros: Readonly<Record<string, RengLogro>>, rengId: string | null): RengEstadoEjercicio => (rengId ? (rengLogros[rengId]?.estado ?? 'pendiente') : 'pendiente')

export type RengAccionPractica =
  | { tipo: 'rama'; rama: RengRama; tema: string; nivel: RengNivelPractica; semilla: number; ejercicioId?: string | null; huella?: string | null }
  | { tipo: 'elegir'; tema: string; nivel: RengNivelPractica; semilla: number; ejercicioId?: string | null; huella?: string | null }
  | { tipo: 'escribir'; texto: string }
  | { tipo: 'metodo'; id: string | null }
  | { tipo: 'pista'; maximo: number }
  | { tipo: 'resolucion' }
  | { tipo: 'veredicto'; veredicto: RengVeredicto; metodo: RengVeredicto | null; completa?: boolean }
  | { tipo: 'repetir' }
  | { tipo: 'recuperar'; clave: string }
  | { tipo: 'descartar'; clave: string }
  | { tipo: 'cargar'; estado: RengEstadoPractica }

const rengGuardar = (rengPendientes: RengIntento[], rengI: RengIntento): RengIntento[] => {
  if (!rengIntentoAbierto(rengI)) return rengPendientes
  const rengClave = rengClaveIntento(rengI)
  return [rengI, ...rengPendientes.filter((rengX) => rengClaveIntento(rengX) !== rengClave)].slice(0, RENG_MAX_PENDIENTES)
}

export function rengEstadoPracticaInicial(rengRama: RengRama, rengTema: string, rengNivel: RengNivelPractica, rengRef?: RengReferenciaIntento): RengEstadoPractica {
  return { rama: rengRama, actual: rengIntentoNuevo(rengTema, rengNivel, 1, rengRef), pendientes: [], logros: {} }
}

const rengConLogro = (rengE: RengEstadoPractica, rengCambio: (rengPrevio: RengLogro | undefined) => RengLogro | null): RengEstadoPractica => {
  const rengClave = rengE.actual.ejercicioId
  if (!rengClave) return rengE
  const rengNuevo = rengCambio(rengE.logros[rengClave])
  if (!rengNuevo) return rengE
  return { ...rengE, logros: { ...rengE.logros, [rengClave]: rengNuevo } }
}

const rengLogroBase = (rengI: RengIntento, rengPrevio: RengLogro | undefined): RengLogro => rengPrevio ?? { tema: rengI.tema, nivel: rengI.nivel, estado: 'revisada', aciertos: 0, repeticiones: 0, conResolucion: false, comprobaciones: 0 }

export function rengPractica(rengE: RengEstadoPractica, rengA: RengAccionPractica): RengEstadoPractica {
  switch (rengA.tipo) {
    case 'cargar':
      return rengA.estado
    case 'rama':
    case 'elegir': {
      const rengNuevo = rengIntentoNuevo(rengA.tema, rengA.nivel, rengA.semilla, { ejercicioId: rengA.ejercicioId ?? null, huella: rengA.huella ?? null })
      const rengRama = rengA.tipo === 'rama' ? rengA.rama : rengE.rama
      if (rengClaveIntento(rengNuevo) === rengClaveIntento(rengE.actual)) return { ...rengE, rama: rengRama }
      const rengPendientes = rengGuardar(rengE.pendientes, rengE.actual).filter((rengX) => rengClaveIntento(rengX) !== rengClaveIntento(rengNuevo))
      const rengRecuperado = rengE.pendientes.find((rengX) => rengClaveIntento(rengX) === rengClaveIntento(rengNuevo))
      return { ...rengE, rama: rengRama, actual: rengRecuperado ?? rengNuevo, pendientes: rengPendientes }
    }
    case 'escribir':
      return { ...rengE, actual: { ...rengE.actual, respuesta: rengA.texto, resuelto: rengE.actual.resuelto && rengA.texto === rengE.actual.respuesta } }
    case 'metodo':
      return { ...rengE, actual: { ...rengE.actual, metodo: rengA.id, resuelto: rengE.actual.resuelto && rengA.id === rengE.actual.metodo } }
    case 'pista':
      return { ...rengE, actual: { ...rengE.actual, pistas: Math.min(rengA.maximo, rengE.actual.pistas + 1) } }
    case 'resolucion': {
      if (rengE.actual.resolucion) return rengE
      const rengConResolucion = { ...rengE, actual: { ...rengE.actual, resolucion: true } }
      return rengConLogro(rengConResolucion, (rengPrevio) => {
        const rengBase = rengLogroBase(rengConResolucion.actual, rengPrevio)
        return { ...rengBase, conResolucion: rengBase.estado === 'resuelta' ? rengBase.conResolucion : true }
      })
    }
    case 'veredicto': {
      const rengCompleta = rengA.completa ?? rengA.veredicto.tipo === 'correcto'
      const rengPrimerAcierto = rengCompleta && !rengE.actual.acertado
      const rengActual: RengIntento = {
        ...rengE.actual,
        veredicto: rengA.veredicto,
        veredictoMetodo: rengA.metodo,
        comprobada: { respuesta: rengE.actual.respuesta, metodo: rengE.actual.metodo },
        comprobaciones: rengE.actual.comprobaciones + 1,
        resuelto: rengCompleta,
        acertado: rengE.actual.acertado || rengCompleta
      }
      const rengSiguiente = { ...rengE, actual: rengActual }
      return rengConLogro(rengSiguiente, (rengPrevio) => {
        if (!rengPrevio && !rengPrimerAcierto) return null
        const rengBase = rengLogroBase(rengActual, rengPrevio)
        return {
          ...rengBase,
          estado: rengPrimerAcierto ? 'resuelta' : rengBase.estado,
          aciertos: rengBase.aciertos + (rengPrimerAcierto ? 1 : 0),
          conResolucion: rengPrimerAcierto ? rengBase.conResolucion || rengE.actual.resolucion : rengBase.conResolucion,
          comprobaciones: rengBase.comprobaciones + 1
        }
      })
    }
    case 'repetir': {
      const rengId = rengE.actual.ejercicioId
      const rengLogro = rengId ? rengE.logros[rengId] : undefined
      if (!rengId || !rengLogro || rengLogro.estado !== 'resuelta') return rengE
      const rengLimpio = rengIntentoNuevo(rengE.actual.tema, rengE.actual.nivel, rengE.actual.semilla, { ejercicioId: rengId, huella: rengE.actual.huella })
      return { ...rengE, actual: rengLimpio, logros: { ...rengE.logros, [rengId]: { ...rengLogro, repeticiones: rengLogro.repeticiones + 1, conResolucion: false } } }
    }
    case 'recuperar': {
      const rengDestino = rengE.pendientes.find((rengX) => rengClaveIntento(rengX) === rengA.clave)
      if (!rengDestino) return rengE
      const rengRestantes = rengE.pendientes.filter((rengX) => rengClaveIntento(rengX) !== rengA.clave)
      return { ...rengE, actual: rengDestino, pendientes: rengGuardar(rengRestantes, rengE.actual) }
    }
    case 'descartar':
      return { ...rengE, pendientes: rengE.pendientes.filter((rengX) => rengClaveIntento(rengX) !== rengA.clave) }
  }
}
