import { useMemo, useState } from 'react'
import { RENG_CATEGORIAS, RENG_ELEMENTOS, type RengElemento } from '../../tabla-periodica/data'
import { RENG_ESTADOS_COMUNES } from '../nucleo/compuestosBinarios'
import { rengDatos3D } from '../nucleo/elementos3d'
import { rengElectronegatividad } from '../nucleo/electronegatividad'
import { rengNormalizarNombre } from '../nucleo/nomenclatura'
import { rengEsElementoBasico } from '../nucleo/tablaBasica'
import { useRengArrastre } from './arrastre'
import { rengFichaVisible } from './fichaElemento'
import { useRengMuestra } from './nivel'

const rengComa = (rengX: number, rengD = 2): string => rengX.toFixed(rengD).replace('.', ',')
const rengSigno = (rengN: number): string => (rengN > 0 ? `+${rengN}` : `−${-rengN}`)

export function rengResumenElemento(rengE: RengElemento): string {
  const rengX = rengElectronegatividad(rengE.simbolo)
  const rengEst = RENG_ESTADOS_COMUNES[rengE.simbolo]
  const rengPartes = [`${rengE.nombre} (${rengE.simbolo}) · Z = ${rengE.z}`, `masa ${rengComa(rengE.masa, rengE.masa < 100 ? 3 : 2)} u${rengE.masaAproximada ? ' (isótopo más estable)' : ''}`]
  rengPartes.push(rengX !== null ? `χ = ${rengComa(rengX)}` : 'χ sin valor aceptado')
  rengPartes.push(rengEst ? `estados habituales ${rengEst.map(rengSigno).join(', ')}` : 'estados habituales: sin datos en la app')
  if (rengDatos3D.get(rengE.simbolo)?.rc === null) rengPartes.push('sin radio covalente fiable: se puede colocar pero no unir')
  return rengPartes.join(' · ')
}

export function RengTablaCompacta({ onAnadir: rengOnAnadir }: { onAnadir: (rengEl: string) => void }): React.JSX.Element {
  const { iniciar: rengIniciar } = useRengArrastre()
  const rengMuestra = useRengMuestra()
  const [rengVerTodos, rengSetVerTodos] = useState(false)
  const rengCompleta = rengMuestra('explorar.tablaCompleta') || rengVerTodos
  const [rengFiltro, rengSetFiltro] = useState('')
  const [rengGrande, rengSetGrande] = useState(false)
  const [rengSobre, rengSetSobre] = useState<string | null>(null)
  const [rengFoco, rengSetFoco] = useState<string | null>(null)
  const rengVisible = rengFichaVisible({ sobre: rengSobre, foco: rengFoco })
  const rengElVisible = rengVisible ? RENG_ELEMENTOS.find((rengE) => rengE.simbolo === rengVisible) : undefined
  const rengCoincide = useMemo(() => {
    const rengQ = rengNormalizarNombre(rengFiltro)
    if (!rengQ) return null
    return new Set(RENG_ELEMENTOS.filter((rengE) => rengNormalizarNombre(rengE.nombre).includes(rengQ) || rengE.simbolo.toLowerCase() === rengQ || String(rengE.z) === rengQ).map((rengE) => rengE.simbolo))
  }, [rengFiltro])

  return (
    <div className="tabla-compacta-zona stack" style={{ gap: 6 }}>
      <div className="row" style={{ gap: 6 }}>
        <input
          className="input"
          style={{ flex: 1, minWidth: 0 }}
          placeholder="Filtrar: nombre o símbolo"
          aria-label="Filtrar elementos por nombre o símbolo"
          value={rengFiltro}
          onChange={(rengE) => rengSetFiltro(rengE.target.value)}
          onKeyDown={(rengE) => {
            if (rengE.key === 'Enter' && rengCoincide?.size) rengOnAnadir([...rengCoincide][0]!)
          }}
        />
        <button className="btn sm" onClick={() => rengSetGrande((rengG) => !rengG)} aria-pressed={rengGrande} title={rengGrande ? 'Contraer la tabla' : 'Ampliar la tabla'}>
          {rengGrande ? '−' : '+'}
        </button>
      </div>
      <div className={`tabla-compacta ${rengGrande ? 'grande' : ''}`} role="group" aria-label="Tabla periódica: arrastra un elemento a la mesa o pulsa Intro para añadirlo">
        {RENG_ELEMENTOS.filter((rengE) => rengCompleta || rengEsElementoBasico(rengE.z) || rengCoincide?.has(rengE.simbolo)).map((rengE) => {
          const rengAtenuado = rengCoincide !== null && !rengCoincide.has(rengE.simbolo)
          return (
            <button
              key={rengE.z}
              className={`celda-el ${rengAtenuado ? 'atenuada' : ''} ${rengCoincide?.has(rengE.simbolo) ? 'coincide' : ''}`}
              style={{ gridRow: rengE.fila, gridColumn: rengE.columna, ['--cat' as string]: RENG_CATEGORIAS[rengE.categoria].color }}
              aria-label={rengResumenElemento(rengE)}
              title={rengResumenElemento(rengE)}
              onPointerDown={(rengEv) => rengIniciar({ tipo: 'elemento', el: rengE.simbolo }, rengEv, () => rengOnAnadir(rengE.simbolo))}
              onKeyDown={(rengEv) => {
                if (rengEv.key === 'Enter' || rengEv.key === ' ') {
                  rengEv.preventDefault()
                  rengOnAnadir(rengE.simbolo)
                }
              }}
              onFocus={() => rengSetFoco(rengE.simbolo)}
              onBlur={() => rengSetFoco((rengF) => (rengF === rengE.simbolo ? null : rengF))}
              onMouseEnter={() => rengSetSobre(rengE.simbolo)}
              onMouseLeave={() => rengSetSobre((rengX) => (rengX === rengE.simbolo ? null : rengX))}
            >
              <span className="celda-z">{rengE.z}</span>
              <span className="celda-s">{rengE.simbolo}</span>
            </button>
          )
        })}
      </div>
      {!rengMuestra('explorar.tablaCompleta') && (
        <button className="btn ghost sm" onClick={() => rengSetVerTodos((rengV) => !rengV)} aria-pressed={rengVerTodos}>
          {rengVerTodos ? 'Solo los más comunes' : 'Ver los 118 elementos'}
        </button>
      )}
      <p className="faint sm tabla-compacta-info" aria-live="polite">
        {rengElVisible ? rengResumenElemento(rengElVisible) : 'Pasa el cursor por un elemento para ver su ficha. Arrástralo a la mesa (o haz clic / Intro para añadirlo al centro).'}
      </p>
    </div>
  )
}
