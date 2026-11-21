export interface RengReciente {
  id: string
  sub: string | null
  titulo: string
  contexto: string
  fecha: number
}

export const RENG_MAX_RECIENTES = 6

const RENG_ID = /^[a-z][a-z0-9-]{1,30}$/
const RENG_SUB = /^[a-z0-9][a-z0-9-]{0,40}$/

const rengEsTexto = (rengV: unknown, rengMax: number): rengV is string => typeof rengV === 'string' && rengV.length > 0 && rengV.length <= rengMax

function rengValido(rengX: unknown): rengX is RengReciente {
  if (typeof rengX !== 'object' || rengX === null) return false
  const rengR = rengX as Record<string, unknown>
  return (
    typeof rengR['id'] === 'string' &&
    RENG_ID.test(rengR['id']) &&
    (rengR['sub'] === null || (typeof rengR['sub'] === 'string' && RENG_SUB.test(rengR['sub']))) &&
    rengEsTexto(rengR['titulo'], 120) &&
    typeof rengR['contexto'] === 'string' &&
    rengR['contexto'].length <= 120 &&
    typeof rengR['fecha'] === 'number' &&
    Number.isFinite(rengR['fecha']) &&
    rengR['fecha'] > 0
  )
}

export function rengAnadirReciente(rengLista: readonly RengReciente[], rengR: RengReciente, rengMax = RENG_MAX_RECIENTES): RengReciente[] {
  if (!rengValido(rengR)) return [...rengLista]
  return [rengR, ...rengLista.filter((rengX) => !(rengX.id === rengR.id && rengX.sub === rengR.sub))].slice(0, rengMax)
}

export function rengLeerRecientes(rengTexto: string | null, rengExiste: (rengId: string) => boolean): RengReciente[] {
  if (!rengTexto || rengTexto.length > 20_000) return []
  let rengV: unknown
  try {
    rengV = JSON.parse(rengTexto)
  } catch {
    return []
  }
  if (!Array.isArray(rengV)) return []
  const rengOut: RengReciente[] = []
  for (const rengX of rengV) {
    if (!rengValido(rengX) || !rengExiste(rengX.id)) continue
    if (rengOut.some((rengO) => rengO.id === rengX.id && rengO.sub === rengX.sub)) continue
    rengOut.push({ id: rengX.id, sub: rengX.sub, titulo: rengX.titulo, contexto: rengX.contexto, fecha: rengX.fecha })
    if (rengOut.length >= RENG_MAX_RECIENTES) break
  }
  return rengOut
}

export function rengHaceCuanto(rengFecha: number, rengAhora: number): string {
  const rengS = Math.max(0, Math.round((rengAhora - rengFecha) / 1000))
  if (rengS < 60) return 'hace un momento'
  const rengMin = Math.round(rengS / 60)
  if (rengMin < 60) return `hace ${rengMin} min`
  const rengH = Math.round(rengMin / 60)
  if (rengH < 24) return `hace ${rengH} h`
  const rengD = Math.floor(rengH / 24)
  if (rengD === 1) return 'ayer'
  if (rengD < 7) return `hace ${rengD} días`
  const rengF = new Date(rengFecha)
  return `${rengF.getDate()}/${rengF.getMonth() + 1}/${rengF.getFullYear()}`
}
