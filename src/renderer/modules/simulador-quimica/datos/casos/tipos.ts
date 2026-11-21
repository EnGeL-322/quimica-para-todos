export type RengCategoria = 'naturaleza' | 'espacio' | 'hogar' | 'tesla'

export const RENG_CATEGORIAS_CASOS: Record<RengCategoria, { nombre: string; descripcion: string }> = {
  naturaleza: { nombre: 'Naturaleza', descripcion: 'Por fuera: aire, mar y rayos' },
  espacio: { nombre: 'Espacio', descripcion: 'Planetas, lunas y nubes de gas' },
  hogar: { nombre: 'Hogar', descripcion: 'La química de lo cotidiano' },
  tesla: { nombre: 'Nikola Tesla', descripcion: 'Electricidad, magnetismo y ozono' }
}

export interface RengFuente {
  id: string
  corta: string
  texto: string
  url: string
  consultada: string
  acceso: 'abierta' | 'resumen'
}

export interface RengAfirmacion {
  texto: string
  fuente: string | null
}

export interface RengComponente {
  nombre: string
  formula: string
  entrada: string | null
  rol: string
}

export interface RengEcuacion {
  nombre: string
  reactivos: Array<{ coef: number; formula: string }>
  productos: Array<{ coef: number; formula: string }>
  nota?: string
  fuente: string | null
}

export interface RengSimulacionCaso {
  id: string
  nombre: string
  porque: string
}

export interface RengCaso {
  id: string
  categoria: RengCategoria
  titulo: string
  gancho: string
  portada: string
  ideas: RengAfirmacion[]
  componentes: RengComponente[]
  ecuaciones: RengEcuacion[]
  simulaciones?: RengSimulacionCaso[]
  cronologia?: Array<{ cuando: string; hecho: string; fuente: string | null }>
  datos?: Array<{ magnitud: string; valor: string; fuente: string | null }>
  detalles: RengAfirmacion[]
  limites: string[]
}
