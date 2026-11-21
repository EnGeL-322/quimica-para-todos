export type RengCategoria = 'fisica' | 'quimica' | 'laboratorio' | 'herramientas' | 'seguridad'

export type RengNivel = 'inicial' | 'intermedio' | 'avanzado' | 'todos'

export type RengIconName =
  | 'atom'
  | 'flask'
  | 'table'
  | 'calculator'
  | 'image'
  | 'eye'
  | 'shield'
  | 'cube'
  | 'home'
  | 'search'
  | 'settings'
  | 'check'
  | 'alert'
  | 'cross'
  | 'dot'
  | 'sun'
  | 'moon'
  | 'notebook'
  | 'play'
  | 'clock'
  | 'sidebar'
  | 'sigma'

export interface RengModuleManifest {
  id: string
  nombre: string
  descripcion: string
  icono: RengIconName
  categoria: RengCategoria
  nivel: RengNivel
  etiquetas: string[]
  orden: number
  principal?: boolean
  nombreCorto?: string
}

export const RENG_CATEGORIAS: Record<RengCategoria, string> = {
  fisica: 'Física',
  quimica: 'Química',
  laboratorio: 'Laboratorio',
  herramientas: 'Herramientas',
  seguridad: 'Privacidad y red'
}
