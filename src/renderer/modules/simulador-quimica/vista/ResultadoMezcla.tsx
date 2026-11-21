import { rengEcuacionTexto, type RengResultadoMezcla as RengResultado } from '../nucleo/mezclador'
import { RengFormula } from './Formula'
import { RengAviso, RengEtiqueta, RengTarjeta } from './ui'

export function RengResultadoMezcla({ res: rengRes, onLlevar: rengOnLlevar }: { res: RengResultado; onLlevar?: () => void }): React.JSX.Element {
  if (rengRes.tipo === 'ninguna') {
    const rengFaltaInfo = rengRes.causa === 'estructura-ambigua' || rengRes.causa === 'no-valida'
    return <RengAviso tipo={rengFaltaInfo ? 'aviso' : 'info'}>{rengRes.motivo}</RengAviso>
  }
  const rengR = rengRes.r
  return (
    <RengTarjeta titulo={rengR.nombre} acento nota={rengR.origen === 'catalogo' ? 'Catálogo de la app' : 'Regla educativa'}>
      <RengFormula texto={rengEcuacionTexto(rengR)} tamano="media" />
      <p className="sm">
        {rengR.condiciones} {rengR.observable ?? ''}
      </p>
      <RengEtiqueta tono="aviso">{rengR.origen === 'catalogo' ? 'Referencia anotada, sin consultar' : 'Sin verificar'}</RengEtiqueta>
      {rengR.catalizador && <RengAviso tipo="aviso">Necesita un catalizador ({rengR.catalizador.texto}): en Avanzado puedes indicarlo.</RengAviso>}
      <span className="faint sm">Fuente: {rengR.fuente}</span>
      {rengOnLlevar && !rengR.catalizador && (
        <div className="row">
          <button className="btn primary sm" onClick={rengOnLlevar}>
            Llevar productos a la mesa
          </button>
        </div>
      )}
    </RengTarjeta>
  )
}
