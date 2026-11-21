import type { ReactNode } from 'react'
import { RengIcon } from '@/shell/Icon'
import type { RengIconName } from '@shared/manifest'

export function RengTarjeta({ titulo: rengTitulo, nota: rengNota, acento: rengAcento, children: rengChildren }: { titulo: string; nota?: string; acento?: boolean; children: ReactNode }): React.JSX.Element {
  return (
    <section className={`ui-tarjeta ${rengAcento ? 'acento' : ''}`} aria-label={rengTitulo}>
      <header>
        <h3>{rengTitulo}</h3>
        {rengNota && <small>{rengNota}</small>}
      </header>
      {rengChildren}
    </section>
  )
}

export type RengTonoUi = 'neutro' | 'ok' | 'aviso' | 'error'

export function RengEtiqueta({ tono: rengTono = 'neutro', title: rengTitle, children: rengChildren }: { tono?: RengTonoUi; title?: string; children: ReactNode }): React.JSX.Element {
  return (
    <span className={`ui-etiqueta ${rengTono === 'neutro' ? '' : rengTono}`} title={rengTitle}>
      {rengChildren}
    </span>
  )
}

const RENG_ICONO: Record<'info' | 'aviso' | 'error' | 'ok', RengIconName> = { info: 'search', aviso: 'alert', error: 'cross', ok: 'check' }

export function RengAviso({ tipo: rengTipo = 'info', children: rengChildren }: { tipo?: 'info' | 'aviso' | 'error' | 'ok'; children: ReactNode }): React.JSX.Element {
  const rengClase = rengTipo === 'aviso' ? 'warn' : rengTipo === 'error' ? 'err' : rengTipo === 'ok' ? 'ok' : ''
  return (
    <div className={`notice ui-aviso ${rengClase}`} role={rengTipo === 'error' ? 'alert' : 'status'}>
      <span className="ui-aviso-icono" aria-hidden="true">
        <RengIcon name={RENG_ICONO[rengTipo]} size={14} />
      </span>
      <div>{rengChildren}</div>
    </div>
  )
}
