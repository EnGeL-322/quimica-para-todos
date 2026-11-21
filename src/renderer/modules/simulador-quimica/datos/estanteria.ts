import { RENG_BIBLIOTECA, RENG_CATEGORIAS, type RengCategoria } from './biblioteca'

export interface RengFichaEstanteria {
  nombre: string
  categoria: RengCategoria
  nombreCategoria: string
  entrada: string
}

const RENG_SELECCION: ReadonlyArray<{ nombre: string; entrada?: string }> = [
  { nombre: 'agua' },
  { nombre: 'dióxido de carbono' },
  { nombre: 'amoniaco' },
  { nombre: 'metano' },
  { nombre: 'oxígeno' },
  { nombre: 'nitrógeno' },
  { nombre: 'cloruro de sodio' },
  { nombre: 'cloruro de hidrógeno' },
  { nombre: 'hidróxido de sodio', entrada: '[Na+].[OH-]' },
  { nombre: 'eteno' },
  { nombre: 'etanol' },
  { nombre: 'ácido acético' },
  { nombre: 'glucosa' }
]

export const RENG_ESTANTERIA: RengFichaEstanteria[] = RENG_SELECCION.flatMap((rengS) => {
  const rengB = RENG_BIBLIOTECA.find((rengX) => rengX.nombre === rengS.nombre)
  return rengB ? [{ nombre: rengB.nombre, categoria: rengB.categoria, nombreCategoria: RENG_CATEGORIAS[rengB.categoria], entrada: rengS.entrada ?? rengB.entrada }] : []
})
