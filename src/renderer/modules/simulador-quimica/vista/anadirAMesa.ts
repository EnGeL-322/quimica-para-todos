import { rengFragmentoDe as rengFragmentoDeSustancia, RENG_MAX_ATOMOS_MESA, type RengFragmento } from '../nucleo/fragmentoSustancia'
import { rengAnadirFragmento, rengMesaVacia, type RengMesa, type RengVec3 } from '../nucleo/mesa'
import { rengInterpretarSustancia } from '../nucleo/sustancia'

export interface RengMensajeMesa {
  texto: string
  tipo: 'ok' | 'err' | 'info'
  forzar?: () => void
  red?: string
}

export function rengMensajeDeFragmento(rengF: RengFragmento): RengMensajeMesa | null {
  return rengF.nota ? { texto: rengF.nota, tipo: 'info' } : null
}

export type RengResultadoAnadir =
  | { ok: true; mesa: RengMesa; ids: number[]; mensaje: RengMensajeMesa | null; origen: { formula: string; origen: 'experimental' | 'calculada' } | null }
  | { ok: false; mensaje: RengMensajeMesa }

export function rengAnadirSustanciaAMesa(rengBase: RengMesa, rengEntrada: string, rengCentro: RengVec3 = [0, 0, 0], rengReemplazar = false): RengResultadoAnadir {
  const rengR = rengInterpretarSustancia(rengEntrada)
  if (rengR.tipo !== 'ok') return { ok: false, mensaje: { texto: rengR.tipo === 'error' ? rengR.motivo : rengR.nota, tipo: 'err' } }
  const rengF = rengFragmentoDeSustancia(rengR.sustancia)
  if (!rengF.ok) return { ok: false, mensaje: { texto: rengF.motivo, tipo: 'info' } }
  const rengMesa = rengReemplazar ? rengMesaVacia() : rengBase
  if (rengMesa.atomos.length + rengF.f.atomos.length > RENG_MAX_ATOMOS_MESA) return { ok: false, mensaje: { texto: `No cabe: la mesa admite hasta ${RENG_MAX_ATOMOS_MESA} átomos.`, tipo: 'err' } }
  const rengRes = rengAnadirFragmento(rengMesa, rengF.f.atomos, rengF.f.enlaces, rengCentro, rengF.f.estereo)
  return {
    ok: true,
    mesa: rengRes.mesa,
    ids: rengRes.ids,
    mensaje: rengMensajeDeFragmento(rengF.f),
    origen: rengF.f.origen === 'aproximada' ? null : { formula: rengR.sustancia.formula, origen: rengF.f.origen }
  }
}
