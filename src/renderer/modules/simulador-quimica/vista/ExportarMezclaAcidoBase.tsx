import { useState } from 'react'
import { rengCall, rengErrMsg } from '@/lib/api'
import {
  RENG_KA_ACETICO_MEZCLA,
  RENG_MODELO_MEZCLA_ACIDO_BASE,
  RENG_PKW_MEZCLA,
  RENG_TEMPERATURA_MEZCLA_C,
  type RengEntradaMezclaAcidoBase,
  type RengPuntoMezclaAcidoBase,
  type RengResultadoMezclaAcidoBase
} from '../nucleo/mezclaAcidoBase'

interface RengProps {
  entrada: RengEntradaMezclaAcidoBase
  resultado: RengResultadoMezclaAcidoBase
  curva: readonly RengPuntoMezclaAcidoBase[]
}

export function RengExportarMezclaAcidoBase({ entrada: rengEntrada, resultado: rengResultado, curva: rengCurva }: RengProps): React.JSX.Element {
  const [rengGuardando, rengSetGuardando] = useState(false)
  const [rengMensaje, rengSetMensaje] = useState('')

  const rengExportar = async (): Promise<void> => {
    rengSetGuardando(true)
    rengSetMensaje('')
    const rengCondiciones = [
      RENG_MODELO_MEZCLA_ACIDO_BASE,
      RENG_TEMPERATURA_MEZCLA_C,
      RENG_PKW_MEZCLA,
      rengEntrada.acido === 'acetico' ? RENG_KA_ACETICO_MEZCLA : '',
      rengEntrada.acido,
      rengEntrada.concentracionAcido,
      rengEntrada.volumenAcidoMl,
      rengEntrada.concentracionBase
    ]
    const rengFilas = [
      'punto,modelo,temperatura_C,pKw,Ka_acido_acetico,acido,concentracion_acido_mol_L,volumen_acido_mL,concentracion_NaOH_mol_L,volumen_NaOH_mL,pH',
      ['actual', ...rengCondiciones, rengEntrada.volumenBaseMl, rengResultado.pH].join(','),
      ...rengCurva.map((rengPunto) => ['curva', ...rengCondiciones, rengPunto.volumenBaseMl, rengPunto.pH].join(','))
    ]
    try {
      const rengRuta = await rengCall<string | null>('core', 'saveText', {
        nombreSugerido: 'mezcla-acido-base.csv',
        contenido: `${rengFilas.join('\r\n')}\r\n`,
        extension: 'csv'
      })
      if (rengRuta) rengSetMensaje(`CSV guardado en ${rengRuta}`)
    } catch (rengError) {
      rengSetMensaje(rengErrMsg(rengError))
    } finally {
      rengSetGuardando(false)
    }
  }

  return (
    <div className="stack tight">
      <button type="button" className="btn sm" disabled={rengGuardando} onClick={() => void rengExportar()}>
        Exportar curva de pH (CSV)
      </button>
      {rengMensaje && <span className="sm muted" role="status">{rengMensaje}</span>}
    </div>
  )
}
