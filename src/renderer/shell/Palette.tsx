import { useEffect, useMemo, useRef, useState } from 'react'
import { RENG_CATEGORIAS } from '@shared/manifest'
import { RENG_MODULES } from '@/registry'
import { RengIcon } from './Icon'
import { rengBuscar, type RengEntrada } from './nucleo/busqueda'

interface RengDestino {
  id: string
  sub: string | null
  nombre: string
  descripcion: string
  icono: (typeof RENG_MODULES)[number]['manifest']['icono']
}

function rengEntradas(): Array<RengEntrada<RengDestino>> {
  const rengOut: Array<RengEntrada<RengDestino>> = []
  for (const rengM of RENG_MODULES) {
    const rengMan = rengM.manifest
    const rengGrupoModulo = rengMan.principal ? 'Destinos' : RENG_CATEGORIAS[rengMan.categoria]
    rengOut.push({
      id: rengMan.id,
      valor: { id: rengMan.id, sub: null, nombre: rengMan.nombre, descripcion: rengMan.descripcion, icono: rengMan.icono },
      grupo: rengGrupoModulo,
      nombres: [rengMan.nombre, ...(rengMan.nombreCorto ? [rengMan.nombreCorto] : [])],
      alias: rengMan.etiquetas,
      descripcion: [rengMan.descripcion]
    })
    for (const rengA of rengM.accesos ?? []) {
      rengOut.push({
        id: `${rengMan.id}/${rengA.sub}`,
        valor: { id: rengMan.id, sub: rengA.sub, nombre: rengA.nombre, descripcion: rengA.descripcion ?? '', icono: rengMan.icono },
        grupo: rengA.grupo ?? rengMan.nombre,
        nombres: [rengA.nombre],
        alias: rengA.etiquetas ?? [],
        descripcion: rengA.descripcion ? [rengA.descripcion] : []
      })
    }
  }
  return rengOut
}

export function RengPalette({ onClose: rengOnClose, onOpen: rengOnOpen }: { onClose: () => void; onOpen: (rengId: string, rengSub: string | null) => void }): React.JSX.Element {
  const [rengQ, rengSetQ] = useState('')
  const [rengSel, rengSetSel] = useState(0)
  const rengRef = useRef<HTMLInputElement>(null)
  const rengLista = useRef<HTMLUListElement>(null)
  useEffect(() => rengRef.current?.focus(), [])
  const rengTodas = useMemo(rengEntradas, [])

  const rengItems = useMemo(() => {
    const rengTexto = rengQ.trim()
    if (!rengTexto) return rengTodas.filter((rengE) => rengE.valor.sub === null)
    return rengBuscar(rengTodas, rengTexto, 40).map((rengR) => rengR.entrada)
  }, [rengQ, rengTodas])

  useEffect(() => {
    rengLista.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [rengSel])

  const rengGo = (rengI: number): void => {
    const rengE = rengItems[rengI]
    if (rengE) {
      rengOnOpen(rengE.valor.id, rengE.valor.sub)
      rengOnClose()
    }
  }

  return (
    <div className="overlay" onMouseDown={rengOnClose}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Buscar en la aplicación" onMouseDown={(rengE) => rengE.stopPropagation()}>
        <input
          ref={rengRef}
          value={rengQ}
          role="combobox"
          aria-expanded="true"
          aria-controls="paleta-lista"
          aria-activedescendant={rengItems[rengSel] ? `paleta-${rengSel}` : undefined}
          aria-label="Buscar experimento, herramienta o vista"
          placeholder="Busca un experimento o herramienta: «órbita», «pH», «tabla periódica»…"
          onChange={(rengE) => {
            rengSetQ(rengE.target.value)
            rengSetSel(0)
          }}
          onKeyDown={(rengE) => {
            if (rengE.key === 'Escape') rengOnClose()
            else if (rengE.key === 'ArrowDown') {
              rengE.preventDefault()
              rengSetSel((rengS) => Math.min(rengItems.length - 1, rengS + 1))
            } else if (rengE.key === 'ArrowUp') {
              rengE.preventDefault()
              rengSetSel((rengS) => Math.max(0, rengS - 1))
            } else if (rengE.key === 'Enter') rengGo(rengSel)
          }}
        />
        <ul id="paleta-lista" role="listbox" ref={rengLista} aria-label="Resultados">
          {rengItems.length === 0 && <li className="faint">Sin resultados para «{rengQ.trim()}».</li>}
          {rengItems.map((rengE, rengI) => (
            <li key={rengE.id} id={`paleta-${rengI}`} role="option" aria-selected={rengI === rengSel} className={rengI === rengSel ? 'sel' : ''} onMouseEnter={() => rengSetSel(rengI)} onClick={() => rengGo(rengI)}>
              <RengIcon name={rengE.valor.icono} />
              <div className="paleta-texto">
                <div>{rengE.valor.nombre}</div>
                {rengE.valor.descripcion && <div className="faint sm">{rengE.valor.descripcion}</div>}
              </div>
              <span className="paleta-grupo faint sm">{rengE.grupo}</span>
            </li>
          ))}
        </ul>
        <div className="paleta-pie faint sm">
          <span>
            <span className="kbd">↑</span> <span className="kbd">↓</span> elegir · <span className="kbd">Enter</span> abrir · <span className="kbd">Esc</span> cerrar
          </span>
        </div>
      </div>
    </div>
  )
}
