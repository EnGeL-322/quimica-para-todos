import type { ComponentType } from 'react'
import type { RengModuleManifest } from '@shared/manifest'

export interface RengAcceso {
  sub: string
  nombre: string
  descripcion?: string
  grupo?: string
  etiquetas?: readonly string[]
}

export interface RengEntradaMenu {
  sub: string | null
  nombre: string
  seccion?: string
  tambien?: ReadonlyArray<string | null>
  enCurso?: readonly string[]
  modulo?: string
  hijos?: readonly RengEntradaMenu[]
}

export interface RengModuleDefinition {
  manifest: RengModuleManifest
  load: () => Promise<{ default: ComponentType }>
  flush?: boolean
  accesos?: readonly RengAcceso[]
  menu?: readonly RengEntradaMenu[]
}

export const rengDefineModule = (rengD: RengModuleDefinition): RengModuleDefinition => rengD
