import { rengFragmentos, rengMesaVacia, type RengMesa } from '../nucleo/mesa'

export interface RengSeleccion {
  atomos: number[]
  enlace: [number, number] | null
}

export interface RengCondiciones {
  temperatura: number
  acuoso: boolean
  catalizador: string
}

export interface RengEstadoTrabajo {
  mesa: RengMesa
  activo: string | null
  seleccion: RengSeleccion
  excluidos: string[]
  coeficientes: Record<string, number>
  condiciones: RengCondiciones
  productos: string[]
}

export const RENG_SIN_SELECCION: RengSeleccion = { atomos: [], enlace: null }

export const rengEstadoInicial = (): RengEstadoTrabajo => ({
  mesa: rengMesaVacia(),
  activo: null,
  seleccion: RENG_SIN_SELECCION,
  excluidos: [],
  coeficientes: {},
  condiciones: { temperatura: 298.15, acuoso: false, catalizador: '' },
  productos: []
})

export const rengIdFragmento = (rengIds: readonly number[]): string => `f${Math.min(...rengIds)}`

export function rengFragmentosConId(rengM: RengMesa): Array<{ id: string; ids: number[] }> {
  return rengFragmentos(rengM).map((rengIds) => ({ id: rengIdFragmento(rengIds), ids: rengIds }))
}

export function rengNormalizar(rengE: RengEstadoTrabajo): RengEstadoTrabajo {
  const rengFr = rengFragmentosConId(rengE.mesa)
  const rengIds = new Set(rengFr.map((rengF) => rengF.id))
  const rengActivo = rengE.activo && rengIds.has(rengE.activo) ? rengE.activo : (rengFr[rengFr.length - 1]?.id ?? null)
  const rengExiste = (rengId: number): boolean => rengE.mesa.atomos.some((rengA) => rengA.id === rengId)
  const rengEnlace = rengE.seleccion.enlace && rengE.seleccion.enlace.every(rengExiste) ? rengE.seleccion.enlace : null
  const rengAtomos = rengE.seleccion.atomos.filter(rengExiste)
  const rengCoeficientes = Object.fromEntries(Object.entries(rengE.coeficientes).filter(([rengK]) => rengIds.has(rengK)))
  return { ...rengE, activo: rengActivo, seleccion: { atomos: rengAtomos, enlace: rengEnlace }, excluidos: rengE.excluidos.filter((rengX) => rengIds.has(rengX)), coeficientes: rengCoeficientes }
}

export interface RengTrabajo {
  obtener: () => RengEstadoTrabajo
  suscribir: (rengFn: () => void) => () => void
  aplicar: (rengF: (rengE: RengEstadoTrabajo) => RengEstadoTrabajo, rengRegistrar?: boolean) => void
  deshacer: () => void
  rehacer: () => void
  puedeDeshacer: () => boolean
  puedeRehacer: () => boolean
}

export function rengCrearTrabajo(rengInicial: RengEstadoTrabajo = rengEstadoInicial(), rengMaxHistorial = 100): RengTrabajo {
  let rengEstado = rengNormalizar(rengInicial)
  let rengPasado: RengEstadoTrabajo[] = []
  let rengFuturo: RengEstadoTrabajo[] = []
  const rengOyentes = new Set<() => void>()
  const rengAvisar = (): void => rengOyentes.forEach((rengF) => rengF())
  return {
    obtener: () => rengEstado,
    suscribir: (rengFn) => {
      rengOyentes.add(rengFn)
      return () => rengOyentes.delete(rengFn)
    },
    aplicar: (rengF, rengRegistrar = true) => {
      const rengNuevo = rengNormalizar(rengF(rengEstado))
      if (rengNuevo === rengEstado) return
      if (rengRegistrar) {
        rengPasado = [...rengPasado.slice(-(rengMaxHistorial - 1)), rengEstado]
        rengFuturo = []
      }
      rengEstado = rengNuevo
      rengAvisar()
    },
    deshacer: () => {
      const rengP = rengPasado.pop()
      if (!rengP) return
      rengFuturo.push(rengEstado)
      rengEstado = rengP
      rengAvisar()
    },
    rehacer: () => {
      const rengF = rengFuturo.pop()
      if (!rengF) return
      rengPasado.push(rengEstado)
      rengEstado = rengF
      rengAvisar()
    },
    puedeDeshacer: () => rengPasado.length > 0,
    puedeRehacer: () => rengFuturo.length > 0
  }
}
