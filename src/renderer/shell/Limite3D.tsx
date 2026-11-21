import { Component, type ReactNode } from 'react'

interface RengProps {
  children: ReactNode
  etiqueta?: string
}

export class RengLimite3D extends Component<RengProps, { error: Error | null }> {
  override state = { error: null as Error | null }
  static getDerivedStateFromError(rengError: Error): { error: Error } {
    return { error: rengError }
  }
  override render(): ReactNode {
    const rengE = this.state.error
    if (!rengE) return this.props.children
    return (
      <div className="zonas-lienzo limite-3d" role="status">
        <div className="notice warn sm">
          <b>{this.props.etiqueta ?? 'La vista 3D'} no está disponible en este equipo.</b>{' '}
          {/webgl/i.test(rengE.message) ? 'No se pudo crear el contexto WebGL (gráficos 3D).' : rengE.message} El resto de la herramienta sigue funcionando.
        </div>
      </div>
    )
  }
}
