import { useEffect, useRef, useState } from 'react'
import { RENG_PRODUCTO } from '@shared/producto'
import { rengCall } from '@/lib/api'
import rengAvisosTerceros from '../../../licencias/AVISOS-TERCEROS.txt?raw'
import rengCreditosDatos from '../../../licencias/CREDITOS-DATOS.txt?raw'
import { RengBrandMark } from './Marca'
import { RengTabs } from './ui'

interface RengInfoApp {
  nombre: string
  autor: string
  version: string
  electron: string
  chrome: string
  node: string
  plataforma: string
}

type RengPestana = 'acerca' | 'licencias'

const RENG_PESTANAS: Array<{ id: RengPestana; label: string }> = [
  { id: 'acerca', label: 'Acerca de' },
  { id: 'licencias', label: 'Licencias y créditos' }
]

export function RengAcercaDe({ onClose: rengOnClose, inicial: rengInicial = 'acerca' }: { onClose: () => void; inicial?: RengPestana }): React.JSX.Element {
  const [rengPestana, rengSetPestana] = useState<RengPestana>(rengInicial)
  const [rengInfo, rengSetInfo] = useState<RengInfoApp | null>(null)
  const rengCerrar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    rengCerrar.current?.focus()
    rengCall<RengInfoApp>('core', 'appInfo')
      .then(rengSetInfo)
      .catch(() => rengSetInfo(null))
  }, [])

  useEffect(() => {
    const rengTecla = (rengE: KeyboardEvent): void => {
      if (rengE.key === 'Escape') rengOnClose()
    }
    window.addEventListener('keydown', rengTecla)
    return () => window.removeEventListener('keydown', rengTecla)
  }, [rengOnClose])

  return (
    <div className="overlay" onMouseDown={rengOnClose}>
      <div className="acerca" role="dialog" aria-modal="true" aria-labelledby="acerca-titulo" onMouseDown={(rengE) => rengE.stopPropagation()}>
        <header className="acerca-cabecera">
          <RengBrandMark />
          <div className="acerca-nombre">
            <h2 id="acerca-titulo">{RENG_PRODUCTO.nombre}</h2>
            <span className="faint sm">
              Versión {rengInfo?.version ?? '—'} · por {RENG_PRODUCTO.autor}
            </span>
          </div>
          <span className="spacer" />
          <button ref={rengCerrar} type="button" className="btn ghost sm" onClick={rengOnClose} aria-label="Cerrar">
            ✕
          </button>
        </header>
        <RengTabs value={rengPestana} onChange={rengSetPestana} items={RENG_PESTANAS} />
        {rengPestana === 'acerca' ? (
          <div className="acerca-cuerpo stack">
            <p>{RENG_PRODUCTO.descripcion}</p>
            <dl className="kv">
              <dt>Autor</dt>
              <dd>{RENG_PRODUCTO.autor}</dd>
              <dt>Derechos</dt>
              <dd>
                © {RENG_PRODUCTO.anio} {RENG_PRODUCTO.autor}. Los componentes de terceros conservan sus autores, titulares y licencias (pestaña «Licencias y créditos»).
              </dd>
              <dt>Identificador</dt>
              <dd>{RENG_PRODUCTO.appId}</dd>
              <dt>Funcionamiento</dt>
              <dd>100 % sin conexión: la aplicación no se conecta a Internet y guarda tus datos solo en este equipo.</dd>
              {rengInfo && (
                <>
                  <dt>Plataforma</dt>
                  <dd>
                    Electron {rengInfo.electron} · Chromium {rengInfo.chrome} · Node.js {rengInfo.node} · {rengInfo.plataforma}
                  </dd>
                </>
              )}
            </dl>
          </div>
        ) : (
          <div className="acerca-cuerpo stack">
            <p className="sm muted">
              Estos avisos también se instalan junto a la aplicación, en la carpeta <span className="mono">licencias</span> de su directorio de instalación. Electron y Chromium añaden además sus propios archivos <span className="mono">LICENSE.electron.txt</span> y <span className="mono">LICENSES.chromium.html</span>.
            </p>
            <details open>
              <summary>
                <b>Datos, modelos, imágenes y referencias</b>
              </summary>
              <pre className="acerca-texto">{rengCreditosDatos}</pre>
            </details>
            <details>
              <summary>
                <b>Componentes de software de terceros</b>
              </summary>
              <pre className="acerca-texto">{rengAvisosTerceros}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
