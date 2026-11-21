import type { ReactNode } from 'react'

export function RengEstadoVacio({ titulo: rengTitulo, texto: rengTexto, children: rengChildren }: { titulo: string; texto: string; children?: ReactNode }): React.JSX.Element {
  return (
    <div className="estado-vacio stack" role="status">
      <h3>{rengTitulo}</h3>
      <p className="sm">{rengTexto}</p>
      {rengChildren}
    </div>
  )
}
