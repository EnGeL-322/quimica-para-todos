import { useMemo } from 'react'
import { rengDibujo2D } from '../nucleo/molecula'

export function RengEstructura2D({ smiles: rengSmiles, descripcion: rengDescripcion }: { smiles: string; descripcion: string }): React.JSX.Element | null {
  const rengUrl = useMemo(() => {
    try {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(rengDibujo2D(rengSmiles, 300, 180, true))))}`
    } catch {
      return null
    }
  }, [rengSmiles])
  if (!rengUrl) return null
  return (
    <figure className="q-estructura">
      <img src={rengUrl} alt={rengDescripcion} width={300} height={180} />
    </figure>
  )
}
