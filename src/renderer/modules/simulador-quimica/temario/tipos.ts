export interface RengSubtemaTemario {
  id: string
  titulo: string
}

export type RengTipoBloque = 'curso' | 'problemas'

export interface RengBloqueTemario {
  id: string
  numero: number
  titulo: string
  tipo: RengTipoBloque
  nota: string
  subtemas: RengSubtemaTemario[]
}

export interface RengNivelTemario {
  numero: number
  titulo: string
  descripcion: string
  bloques: RengBloqueTemario[]
}

export interface RengTemario {
  version: number
  niveles: RengNivelTemario[]
}

export type RengEscenaRecurso = 'acidobase' | 'mezcla' | 'cinetica' | 'equilibrio' | 'termo' | 'dilucion' | 'colorimetria' | 'solubilidad' | 'electroquimica' | 'isomeros' | 'mesalibre'
export type RengHerramientaRecurso = 'explorar' | 'enlaces' | 'formulacion' | 'reacciones'

export type RengRecurso =
  | { tipo: 'tema'; id: string }
  | { tipo: 'practica'; id: string }
  | { tipo: 'escena'; id: RengEscenaRecurso }
  | { tipo: 'mesa'; id: RengHerramientaRecurso }
  | { tipo: 'tabla' }
  | { tipo: 'sustancia'; id: string }
  | { tipo: 'caso'; id: string }
  | { tipo: 'laboratorio'; id: 'cuaderno' | 'datos' }
  | { tipo: 'peligros' }
  | { tipo: 'cristal'; id: string }
  | { tipo: 'glosario'; id: string }
  | { tipo: 'leccion-n1'; id: string }
  | { tipo: 'practica-n1'; id: string }
  | { tipo: 'escena-n1'; id: string }

export type RengEstadoCorrespondencia = 'confirmado' | 'revisar'

export interface RengGrupoCorrespondencia {
  estado: RengEstadoCorrespondencia
  posiciones: readonly number[]
  recursos: readonly RengRecurso[]
}
