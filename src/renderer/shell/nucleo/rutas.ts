export const RENG_RUTAS_RETIRADAS: Readonly<Record<string, string>> = {
  traductor: 'Traductor offline',
  subtitulador: 'Editor de subtítulos'
}

const RENG_ID = /^[a-z][a-z0-9-]{1,30}$/
const RENG_SUB = /^[a-z0-9][a-z0-9-]{0,40}$/

export interface RengRuta {
  id: string
  sub: string | null
}

export interface RengRutaResuelta {
  ruta: RengRuta
  retirada: string | null
  desconocida: boolean
}

const RENG_INICIO: RengRuta = { id: 'inicio', sub: null }

export function rengResolverRuta(rengHash: string, rengExiste: (rengId: string) => boolean): RengRutaResuelta {
  let rengTexto: string
  try {
    rengTexto = decodeURIComponent(rengHash.replace(/^#\/?/, ''))
  } catch {
    return { ruta: RENG_INICIO, retirada: null, desconocida: true }
  }
  const [rengId = '', rengSub = '', ...rengResto] = rengTexto.split('/')
  if (rengId === '' || rengId === 'inicio') return { ruta: RENG_INICIO, retirada: null, desconocida: false }
  const rengNombreRetirada = Object.hasOwn(RENG_RUTAS_RETIRADAS, rengId) ? RENG_RUTAS_RETIRADAS[rengId]! : null
  if (rengNombreRetirada) return { ruta: RENG_INICIO, retirada: rengNombreRetirada, desconocida: false }
  if (!RENG_ID.test(rengId) || !rengExiste(rengId) || rengResto.length > 0) return { ruta: RENG_INICIO, retirada: null, desconocida: true }
  if (rengSub === '') return { ruta: { id: rengId, sub: null }, retirada: null, desconocida: false }
  return { ruta: { id: rengId, sub: RENG_SUB.test(rengSub) ? rengSub : null }, retirada: null, desconocida: false }
}

export function rengHashDe(rengId: string, rengSub?: string | null): string {
  if (rengId === 'inicio') return '#/inicio'
  return rengSub ? `#/${rengId}/${rengSub}` : `#/${rengId}`
}
