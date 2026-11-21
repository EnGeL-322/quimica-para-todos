import { rengNormalizarBusqueda } from '../practica/fichasTema'
import { RENG_CORRESPONDENCIAS } from './correspondencias'
import { RENG_TEMARIO_GENERADO } from './datos.generado'
import { RENG_CONTEXTO_REAL, RENG_CRITERIOS_COBERTURA, RENG_ESTADOS_COBERTURA, RENG_REGISTRO_COBERTURA, rengEstadoAgregado, rengEvaluarSubtema, type RengContextoCobertura, type RengCriteriosCobertura, type RengEstadoCobertura, type RengEvaluacionSubtema, type RengRegistroCobertura } from './estado'
import type { RengCapa } from './recursos'
import type { RengBloqueTemario, RengEstadoCorrespondencia, RengGrupoCorrespondencia, RengRecurso, RengTemario, RengTipoBloque } from './tipos'

export const RENG_TEMARIO: RengTemario = RENG_TEMARIO_GENERADO

export const RENG_NIVELES_PLEGADOS_POR_DEFECTO: readonly number[] = [4, 5, 6, 7, 8]

export interface RengSubtemaCatalogo {
  id: string
  titulo: string
  posicion: number
  correspondencia: RengEstadoCorrespondencia | null
  confirmados: readonly RengRecurso[]
  porRevisar: readonly RengRecurso[]
  evaluacion: RengEvaluacionSubtema
}

export interface RengConteoEstados {
  total: number
  porEstado: Readonly<Record<RengEstadoCobertura, number>>
  confirmados: number
  porRevisar: number
  sinRecurso: number
  porCapa: Readonly<Record<RengCapa, number>>
}

export interface RengBloqueCatalogo {
  id: string
  numero: number
  nivel: number
  titulo: string
  tipo: RengTipoBloque
  nota: string
  subtemas: readonly RengSubtemaCatalogo[]
  estado: RengEstadoCobertura
  conteo: RengConteoEstados
}

export interface RengNivelCatalogo {
  numero: number
  titulo: string
  descripcion: string
  bloques: readonly RengBloqueCatalogo[]
  estado: RengEstadoCobertura
  conteo: RengConteoEstados
}

export interface RengCatalogoTemario {
  version: number
  niveles: readonly RengNivelCatalogo[]
  cobertura: RengConteoEstados
  subtemasTotales: number
}

const rengConteoVacio = (): { total: number; porEstado: Record<RengEstadoCobertura, number>; confirmados: number; porRevisar: number; sinRecurso: number; porCapa: Record<RengCapa, number> } => ({
  total: 0,
  porEstado: Object.fromEntries(RENG_ESTADOS_COBERTURA.map((rengE) => [rengE, 0])) as Record<RengEstadoCobertura, number>,
  confirmados: 0,
  porRevisar: 0,
  sinRecurso: 0,
  porCapa: { aprender: 0, practica: 0, simulacion: 0, consulta: 0 }
})

export const rengTextoCapas = (rengP: Readonly<Record<RengCapa, number>>): string => `Aprender ${rengP.aprender} · Prácticas ${rengP.practica} · Simulaciones ${rengP.simulacion}`

function rengContar(rengSubtemas: readonly RengSubtemaCatalogo[]): RengConteoEstados {
  const rengC = rengConteoVacio()
  for (const rengS of rengSubtemas) {
    rengC.total++
    rengC.porEstado[rengS.evaluacion.estado]++
    for (const rengCapa of rengS.evaluacion.capas) rengC.porCapa[rengCapa]++
    if (rengS.correspondencia === 'confirmado') rengC.confirmados++
    else if (rengS.correspondencia === 'revisar') rengC.porRevisar++
    else rengC.sinRecurso++
  }
  return rengC
}

export function rengIndiceCorrespondencias(
  rengBloque: RengBloqueTemario,
  rengGrupos: readonly RengGrupoCorrespondencia[] = RENG_CORRESPONDENCIAS[rengBloque.numero] ?? []
): Map<number, { estado: RengEstadoCorrespondencia; recursos: readonly RengRecurso[] }> {
  const rengIndice = new Map<number, { estado: RengEstadoCorrespondencia; recursos: readonly RengRecurso[] }>()
  for (const rengG of rengGrupos) for (const rengP of rengG.posiciones) rengIndice.set(rengP, { estado: rengG.estado, recursos: rengG.recursos })
  return rengIndice
}

export function rengConstruirCatalogo(
  rengTemario: RengTemario = RENG_TEMARIO,
  rengCorrespondencias: Readonly<Record<number, readonly RengGrupoCorrespondencia[]>> = RENG_CORRESPONDENCIAS,
  rengRegistro: RengRegistroCobertura = RENG_REGISTRO_COBERTURA,
  rengCriterios: Readonly<RengCriteriosCobertura> = RENG_CRITERIOS_COBERTURA,
  rengContexto: RengContextoCobertura = RENG_CONTEXTO_REAL
): RengCatalogoTemario {
  const rengNiveles: RengNivelCatalogo[] = rengTemario.niveles.map((rengN) => {
    const rengBloques: RengBloqueCatalogo[] = rengN.bloques.map((rengB) => {
      const rengIndice = rengIndiceCorrespondencias(rengB, rengCorrespondencias[rengB.numero] ?? [])
      const rengSubtemas: RengSubtemaCatalogo[] = rengB.subtemas.map((rengS, rengI) => {
        const rengPos = rengI + 1
        const rengEntrada = rengB.tipo === 'curso' ? rengIndice.get(rengPos) : undefined
        const rengConfirmados = rengEntrada?.estado === 'confirmado' ? rengEntrada.recursos : []
        const rengPorRevisar = rengEntrada?.estado === 'revisar' ? rengEntrada.recursos : []
        return {
          id: rengS.id,
          titulo: rengS.titulo,
          posicion: rengPos,
          correspondencia: rengEntrada?.estado ?? null,
          confirmados: rengConfirmados,
          porRevisar: rengPorRevisar,
          evaluacion: rengEvaluarSubtema(rengS.id, rengConfirmados, rengRegistro, rengCriterios, rengContexto)
        }
      })
      return { id: rengB.id, numero: rengB.numero, nivel: rengN.numero, titulo: rengB.titulo, tipo: rengB.tipo, nota: rengB.nota, subtemas: rengSubtemas, estado: rengEstadoAgregado(rengSubtemas.map((rengS) => rengS.evaluacion.estado)), conteo: rengContar(rengSubtemas) }
    })
    const rengTodos = rengBloques.flatMap((rengB) => rengB.subtemas)
    return { numero: rengN.numero, titulo: rengN.titulo, descripcion: rengN.descripcion, bloques: rengBloques, estado: rengEstadoAgregado(rengTodos.map((rengS) => rengS.evaluacion.estado)), conteo: rengContar(rengTodos) }
  })
  const rengDenominador = rengNiveles.flatMap((rengN) => rengN.bloques.filter((rengB) => rengB.tipo === 'curso').flatMap((rengB) => rengB.subtemas))
  return { version: rengTemario.version, niveles: rengNiveles, cobertura: rengContar(rengDenominador), subtemasTotales: rengNiveles.reduce((rengA, rengN) => rengA + rengN.conteo.total, 0) }
}

export const rengTituloLegible = (rengTexto: string): string => {
  const rengMin = rengTexto.toLocaleLowerCase('es')
  return rengMin.charAt(0).toLocaleUpperCase('es') + rengMin.slice(1)
}

export interface RengResultadoBusqueda {
  niveles: ReadonlySet<number>
  bloques: ReadonlySet<string>
  subtemas: ReadonlySet<string>
}

export function rengBuscarEnCatalogo(rengCatalogo: RengCatalogoTemario, rengConsulta: string): RengResultadoBusqueda {
  const rengPalabras = rengNormalizarBusqueda(rengConsulta).split(/\s+/).filter((rengP) => rengP !== '')
  const rengNiveles = new Set<number>()
  const rengBloques = new Set<string>()
  const rengSubtemas = new Set<string>()
  if (rengPalabras.length === 0) return { niveles: rengNiveles, bloques: rengBloques, subtemas: rengSubtemas }
  const rengCoincide = (rengPajar: string): boolean => {
    const rengN = rengNormalizarBusqueda(rengPajar)
    return rengPalabras.every((rengP) => rengN.includes(rengP))
  }
  for (const rengN of rengCatalogo.niveles) {
    for (const rengB of rengN.bloques) {
      const rengBloqueCoincide = rengCoincide(`${rengB.titulo} ${rengB.id}`)
      for (const rengS of rengB.subtemas) {
        if (rengBloqueCoincide || rengCoincide(`${rengS.titulo} ${rengS.id} ${rengB.titulo}`)) {
          rengSubtemas.add(rengS.id)
          rengBloques.add(rengB.id)
          rengNiveles.add(rengN.numero)
        }
      }
    }
  }
  return { niveles: rengNiveles, bloques: rengBloques, subtemas: rengSubtemas }
}

let rengCacheCatalogo: RengCatalogoTemario | null = null

export function rengCatalogoReal(): RengCatalogoTemario {
  rengCacheCatalogo ??= rengConstruirCatalogo()
  return rengCacheCatalogo
}
