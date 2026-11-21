import { useState } from 'react'

const RENG_CLAVE = 'quimica.recorrido.visto'
const RENG_PASOS = [
  { titulo: 'Busca o arrastra', texto: 'Escribe una sustancia abajo («agua», «H2O», «CCO») o arrastra un elemento de la tabla de la derecha (por ejemplo O) a la mesa.' },
  { titulo: 'Junta', texto: 'Acerca otro átomo (por ejemplo H): se unen solos si pueden y, si no, la app dice por qué.' },
  { titulo: 'Mira', texto: 'Aparecen el nombre, la fórmula y las medidas de lo que construyes. «Enlaces» muestra paso a paso cómo se forma el enlace.' }
]

const rengLeer = (): boolean => {
  try {
    return window.localStorage.getItem(RENG_CLAVE) === '1'
  } catch {
    return false
  }
}

const rengMarcarVisto = (): void => {
  try {
    window.localStorage.setItem(RENG_CLAVE, '1')
  } catch {
  }
}

export function RengAyudaMesa({ guiada: rengGuiada }: { guiada: boolean }): React.JSX.Element {
  const [rengAbierta] = useState(() => rengGuiada && !rengLeer())
  return (
    <details
      className="mesa-ayuda"
      open={rengAbierta}
      onToggle={(rengE) => {
        if (!(rengE.currentTarget as HTMLDetailsElement).open) rengMarcarVisto()
      }}
    >
      <summary>¿Cómo se usa la mesa?</summary>
      <ol>
        {RENG_PASOS.map((rengP) => (
          <li key={rengP.titulo}>
            <b>{rengP.titulo}.</b> {rengP.texto}
          </li>
        ))}
      </ol>
    </details>
  )
}
