import { useId, useState, type ReactNode } from 'react'
import { RENG_INFO_NIVEL_PRACTICA, type RengNivelPractica } from '../practica/niveles'
import type { RengRama } from '../practica/tipos'
import { rengUrlMiniatura, rengUrlMiniaturaRama } from './miniaturasTema'

interface RengPropsMiniatura {
  nombre: string
  rama: RengRama
}

export function RengMiniatura({ nombre: rengNombre, rama: rengRama }: RengPropsMiniatura): React.JSX.Element {
  const [rengFallo, rengSetFallo] = useState(false)
  const [rengFalloRama, rengSetFalloRama] = useState(false)
  const rengPropia = rengFallo ? null : rengUrlMiniatura(rengNombre)
  const rengDeRama = rengFalloRama ? null : rengUrlMiniaturaRama(rengRama)
  const rengUrl = rengPropia ?? rengDeRama
  return (
    <span className="q-tarjeta-imagen" data-rama={rengRama} data-origen={rengPropia ? 'tema' : rengDeRama ? 'rama' : 'ninguna'}>
      {rengUrl && <img src={rengUrl} alt="" width={320} height={180} loading="lazy" decoding="async" draggable={false} onError={() => (rengPropia ? rengSetFallo(true) : rengSetFalloRama(true))} />}
    </span>
  )
}

interface RengProps {
  id: string
  nombre: string
  pregunta: string
  rama: RengRama
  miniatura: string
  niveles?: readonly RengNivelPractica[]
  nivel?: RengNivelPractica
  etiquetaAbrir?: string
  onAbrir: () => void
  children?: ReactNode
}

export function RengTarjetaTema({ id: rengId, nombre: rengNombre, pregunta: rengPregunta, rama: rengRama, miniatura: rengMiniatura, niveles: rengNiveles, nivel: rengNivel, etiquetaAbrir: rengEtiqueta, onAbrir: rengOnAbrir, children: rengChildren }: RengProps): React.JSX.Element {
  const rengUid = useId()
  return (
    <article className="q-tarjeta" data-tema={rengId}>
      <button type="button" className="q-tarjeta-abrir" data-tema-abrir={rengId} aria-labelledby={`${rengUid}-nombre`} aria-describedby={`${rengUid}-pregunta`} title={rengEtiqueta} onClick={rengOnAbrir}>
        <RengMiniatura nombre={rengMiniatura} rama={rengRama} />
        <span className="q-tarjeta-cuerpo">
          <b className="q-tarjeta-nombre" id={`${rengUid}-nombre`}>
            {rengNombre}
          </b>
          <span className="q-tarjeta-pregunta" id={`${rengUid}-pregunta`}>
            {rengPregunta}
          </span>
        </span>
      </button>
      {(rengNiveles || rengChildren) && (
        <div className="q-tarjeta-pie">
          {rengNiveles && rengNiveles.length > 0 && (
            <span className="q-tarjeta-niveles">
              <span className="sr-only">Niveles disponibles: </span>
              {rengNiveles.map((rengN, rengI) => (
                <span key={rengN}>
                  {rengI > 0 && ' · '}
                  {rengN === rengNivel ? <b>{RENG_INFO_NIVEL_PRACTICA[rengN].corto}</b> : RENG_INFO_NIVEL_PRACTICA[rengN].corto}
                </span>
              ))}
            </span>
          )}
          {rengChildren}
        </div>
      )}
    </article>
  )
}
