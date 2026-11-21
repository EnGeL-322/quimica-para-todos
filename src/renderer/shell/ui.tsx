import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { rengCall, rengErrMsg, rengFmtBytes, type RengPickedFile } from '@/lib/api'
import { rengPestanaPorTecla } from './nucleo/pestanas'

type RengToastKind = 'info' | 'ok' | 'err'
interface RengToastItem {
  id: number
  texto: string
  tipo: RengToastKind
}
const RengToastCtx = createContext<(rengTexto: string, rengTipo?: RengToastKind) => void>(() => undefined)
export const useRengToast = (): ((rengTexto: string, rengTipo?: RengToastKind) => void) => useContext(RengToastCtx)

export function RengToastProvider({ children: rengChildren }: { children: ReactNode }): React.JSX.Element {
  const [rengItems, rengSetItems] = useState<RengToastItem[]>([])
  const rengPush = useCallback((rengTexto: string, rengTipo: RengToastKind = 'info') => {
    const rengId = Date.now() + Math.random()
    rengSetItems((rengL) => [...rengL, { id: rengId, texto: rengTexto, tipo: rengTipo }])
    setTimeout(() => rengSetItems((rengL) => rengL.filter((rengX) => rengX.id !== rengId)), rengTipo === 'err' ? 7000 : 3800)
  }, [])
  return (
    <RengToastCtx.Provider value={rengPush}>
      {rengChildren}
      <div className="toasts" role="status" aria-live="polite">
        {rengItems.map((rengT) => (
          <div key={rengT.id} className={`toast ${rengT.tipo}`}>
            {rengT.texto}
          </div>
        ))}
      </div>
    </RengToastCtx.Provider>
  )
}

export function RengField({ label: rengLabel, children: rengChildren, hint: rengHint }: { label: string; children: ReactNode; hint?: string }): React.JSX.Element {
  return (
    <div className="field">
      <label>{rengLabel}</label>
      {rengChildren}
      {rengHint && <span className="faint sm">{rengHint}</span>}
    </div>
  )
}

export function RengTabs<RengT extends string>({ value: rengValue, onChange: rengOnChange, items: rengItems }: { value: RengT; onChange: (rengV: RengT) => void; items: Array<{ id: RengT; label: string }> }): React.JSX.Element {
  return (
    <div className="tabs" role="tablist">
      {rengItems.map((rengIt) => (
        <button key={rengIt.id} role="tab" aria-selected={rengValue === rengIt.id} className={`tab ${rengValue === rengIt.id ? 'active' : ''}`} onClick={() => rengOnChange(rengIt.id)}>
          {rengIt.label}
        </button>
      ))}
    </div>
  )
}

export interface RengDestino<RengT extends string> {
  id: RengT
  nombre: string
  sub?: string
}

export function RengDestinos<RengT extends string>({ etiqueta: rengEtiqueta, idBase: rengIdBase, valor: rengValor, items: rengItems, onCambio: rengOnCambio, children: rengChildren, redundante: rengRedundante = false }: { etiqueta: string; idBase: string; valor: RengT; items: ReadonlyArray<RengDestino<RengT>>; onCambio: (rengV: RengT) => void; children?: ReactNode; redundante?: boolean }): React.JSX.Element {
  const rengBotones = useRef(new Map<RengT, HTMLButtonElement>())
  const rengTecla = (rengEv: React.KeyboardEvent): void => {
    const rengSig = rengPestanaPorTecla(rengItems.map((rengI) => rengI.id), rengValor, rengEv.key)
    if (rengSig === null) return
    rengEv.preventDefault()
    rengOnCambio(rengSig)
    rengBotones.current.get(rengSig)?.focus()
  }
  return (
    <div className="destinos">
      <div className={`tabs destinos-lista${rengRedundante ? ' nav-redundante' : ''}`} role="tablist" aria-label={rengEtiqueta} onKeyDown={rengTecla}>
        {rengItems.map((rengIt) => (
          <button
            key={rengIt.id}
            ref={(rengB) => {
              if (rengB) rengBotones.current.set(rengIt.id, rengB)
              else rengBotones.current.delete(rengIt.id)
            }}
            type="button"
            role="tab"
            id={`${rengIdBase}-tab-${rengIt.id}`}
            aria-controls={`${rengIdBase}-panel-${rengIt.id}`}
            aria-selected={rengValor === rengIt.id}
            tabIndex={rengValor === rengIt.id ? 0 : -1}
            className={`tab destino${rengValor === rengIt.id ? ' active' : ''}`}
            onClick={() => rengOnCambio(rengIt.id)}
          >
            <span>{rengIt.nombre}</span>
            {rengIt.sub && <small>{rengIt.sub}</small>}
          </button>
        ))}
      </div>
      {rengChildren}
    </div>
  )
}

export const RengEtapa = ({ n: rengN, titulo: rengTitulo, children: rengChildren }: { n: number; titulo: string; children?: ReactNode }): React.JSX.Element => (
  <h3 className="etapa">
    <span className="etapa-num" aria-hidden="true">
      {rengN}
    </span>
    <span>
      <span className="sr-only">Paso {rengN}: </span>
      {rengTitulo}
    </span>
    {rengChildren}
  </h3>
)

export const RengProgress = ({ pct: rengPct }: { pct: number }): React.JSX.Element => (
  <div className="progress" role="progressbar" aria-valuenow={Math.round(rengPct)} aria-valuemin={0} aria-valuemax={100}>
    <i style={{ width: `${Math.max(0, Math.min(100, rengPct))}%` }} />
  </div>
)

export const RengNotice = ({ tipo: rengTipo = 'info', children: rengChildren }: { tipo?: 'info' | 'warn' | 'err' | 'ok'; children: ReactNode }): React.JSX.Element => (
  <div className={`notice ${rengTipo === 'info' ? '' : rengTipo}`}>{rengChildren}</div>
)

export const RengPageTitle = ({ title: rengTitle, sub: rengSub }: { title: string; sub?: string }): React.JSX.Element => (
  <div className="stack tight" style={{ marginBottom: 4 }}>
    <h2 style={{ fontSize: 22 }}>{rengTitle}</h2>
    {rengSub && <p className="muted">{rengSub}</p>}
  </div>
)

interface RengDropProps {
  filtro: 'imagenes' | 'cualquiera'
  multiple?: boolean
  titulo: string
  ayuda?: string
  onFiles: (rengFiles: RengPickedFile[]) => void
}

export function RengDropzone({ filtro: rengFiltro, multiple: rengMultiple, titulo: rengTitulo, ayuda: rengAyuda, onFiles: rengOnFiles }: RengDropProps): React.JSX.Element {
  const [rengOver, rengSetOver] = useState(false)
  const rengToast = useRengToast()

  const rengPick = async (): Promise<void> => {
    try {
      const rengFiles = await rengCall<RengPickedFile[]>('core', 'pickFiles', { filtro: rengFiltro, multiple: !!rengMultiple })
      if (rengFiles.length) rengOnFiles(rengFiles)
    } catch (rengE) {
      rengToast(rengErrMsg(rengE), 'err')
    }
  }

  const rengOnDrop = async (rengEv: React.DragEvent): Promise<void> => {
    rengEv.preventDefault()
    rengSetOver(false)
    const rengRutas = Array.from(rengEv.dataTransfer.files).map((rengF) => window.ciencia?.pathForFile(rengF)).filter(Boolean)
    if (!rengRutas.length) return
    try {
      const rengFiles = await rengCall<RengPickedFile[]>('core', 'grantDropped', { rutas: rengMultiple ? rengRutas : rengRutas.slice(0, 1), filtro: rengFiltro })
      rengOnFiles(rengFiles)
    } catch (rengE) {
      rengToast(rengErrMsg(rengE), 'err')
    }
  }

  return (
    <div
      className={`dropzone ${rengOver ? 'over' : ''}`}
      onClick={() => void rengPick()}
      onKeyDown={(rengE) => (rengE.key === 'Enter' || rengE.key === ' ') && void rengPick()}
      onDragOver={(rengE) => {
        rengE.preventDefault()
        rengSetOver(true)
      }}
      onDragLeave={() => rengSetOver(false)}
      onDrop={(rengE) => void rengOnDrop(rengE)}
      role="button"
      tabIndex={0}
    >
      <strong>{rengTitulo}</strong>
      <span>{rengAyuda ?? 'Arrastra aquí o haz clic para elegir'}</span>
    </div>
  )
}

export const RengFileChip = ({ f: rengF }: { f: RengPickedFile }): React.JSX.Element => (
  <span className="badge" title={rengF.path}>
    {rengF.name} · {rengFmtBytes(rengF.size)}
  </span>
)

export function useRengAsync(): { busy: boolean; run: <RengT>(rengFn: () => Promise<RengT>) => Promise<RengT | undefined> } {
  const [rengBusy, rengSetBusy] = useState(false)
  const rengToast = useRengToast()
  const rengRun = useMemo(
    () =>
      async <RengT,>(rengFn: () => Promise<RengT>): Promise<RengT | undefined> => {
        rengSetBusy(true)
        try {
          return await rengFn()
        } catch (rengE) {
          rengToast(rengErrMsg(rengE), 'err')
          return undefined
        } finally {
          rengSetBusy(false)
        }
      },
    [rengToast]
  )
  return { busy: rengBusy, run: rengRun }
}
