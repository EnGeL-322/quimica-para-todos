import { useState } from 'react'
import { RENG_MODELOS_ESCENA, type RengEscena } from '../practica/modelosSimulacion'
import type { RengNivelPractica } from '../practica/niveles'
import { RengExploradorTemas, RENG_FILTRO_VACIO, type RengFiltroTemas } from '../vista/ExploradorTemas'

interface RengProps {
  nivel: RengNivelPractica
  onPracticar: (rengTema: string) => void
  onSimular: (rengEscena: RengEscena) => void
}

export default function RengCatalogo({ nivel: rengNivel, onPracticar: rengOnPracticar, onSimular: rengOnSimular }: RengProps): React.JSX.Element {
  const [rengFiltro, rengSetFiltro] = useState<RengFiltroTemas>(RENG_FILTRO_VACIO)
  return (
    <div className="q-catalogo">
      <header className="q-cabecera">
        <h2>Elige un tema</h2>
        <p className="muted sm">Toda la tarjeta abre la práctica con corrección. Los temas con un fenómeno asociado también se pueden simular.</p>
      </header>
      <RengExploradorTemas
        idBase="q-cat"
        filtro={rengFiltro}
        onFiltro={rengSetFiltro}
        nivel={rengNivel}
        onAbrir={(rengT) => rengOnPracticar(rengT.id)}
        etiquetaAbrir={(rengT) => `Practicar ${rengT.nombre}`}
        accionesDe={(rengT) => {
          const rengEscena = rengT.escena ? RENG_MODELOS_ESCENA[rengT.escena] : null
          return rengEscena ? (
            <button type="button" className="btn sm" onClick={() => rengOnSimular(rengEscena.id)} title={`Abre «${rengEscena.nombre}»`}>
              Simular
            </button>
          ) : null
        }}
      />
    </div>
  )
}
