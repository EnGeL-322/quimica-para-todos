import { useMemo, useState } from 'react'
import { rengDerivarActivo } from '../estado/derivados'
import { rengMasaMolarDe } from '../nucleo/formula'
import { rengMedidasFragmento } from '../nucleo/medidas'
import { useRengMuestra } from './nivel'
import { useRengTrabajo } from './useTrabajo'

const rengComa = (rengX: number, rengD: number): string => rengX.toFixed(rengD).replace('.', ',')

export function RengMedidasAvanzado(): React.JSX.Element | null {
  const rengMuestra = useRengMuestra()
  const rengEstado = useRengTrabajo((rengE) => rengE)
  const rengD = useMemo(() => rengDerivarActivo(rengEstado), [rengEstado])
  const rengM = useMemo(() => (rengD ? rengMedidasFragmento(rengEstado.mesa, rengD.ids) : null), [rengD, rengEstado.mesa])
  const [rengCopiado, rengSetCopiado] = useState<string | null>(null)
  if (!rengD || !rengM) return null
  const rengCopiar = async (rengTexto: string, rengQue: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(rengTexto)
      rengSetCopiado(`${rengQue} copiado`)
    } catch {
      rengSetCopiado('No se pudo copiar (permiso del sistema)')
    }
  }
  const rengMasa = rengD.cargaNeta === 0 ? rengMasaMolarDe(rengD.formula) : NaN
  return (
    <div className="card stack" style={{ gap: 8 }} aria-label="Medidas del fragmento activo">
      <b>Medidas</b>
      <dl className="datos">
        <dt>Carga neta</dt>
        <dd>{rengD.cargaNeta === 0 ? '0' : rengD.cargaNeta > 0 ? `+${rengD.cargaNeta}` : `−${-rengD.cargaNeta}`}</dd>
        {Number.isFinite(rengMasa) && (
          <>
            <dt>Masa molar</dt>
            <dd>{rengComa(rengMasa, 3)} g/mol</dd>
          </>
        )}
        {rengM.distancias.length > 0 && (
          <>
            <dt>Distancias</dt>
            <dd>{rengM.distancias.map((rengX) => `${rengX.etiqueta} ${rengComa(rengX.angstrom, 3)} Å`).join(' · ')}</dd>
          </>
        )}
        {rengM.angulos.length > 0 && (
          <>
            <dt>Ángulos</dt>
            <dd>{rengM.angulos.map((rengX) => `${rengX.etiqueta} ${rengComa(rengX.grados, 1)}°`).join(' · ')}</dd>
          </>
        )}
      </dl>
      <p className="faint sm">Medidas del modelo que ves en la mesa (experimental, MMFF94 o aproximado), no valores de laboratorio.</p>
      {rengMuestra('explorar.exportar') && (
        <div className="row" style={{ gap: 6 }}>
          <button className="btn sm" onClick={() => rengCopiar(rengD.formula, 'Fórmula')}>
            Copiar fórmula
          </button>
          {rengD.smiles && (
            <button className="btn sm" onClick={() => rengCopiar(rengD.sustancia?.smiles ?? rengD.smiles!, 'SMILES')}>
              Copiar SMILES
            </button>
          )}
          {rengCopiado && (
            <span className="sm muted" role="status">
              {rengCopiado}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
