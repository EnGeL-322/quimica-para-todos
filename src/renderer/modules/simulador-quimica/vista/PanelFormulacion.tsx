import { useMemo, useState } from 'react'
import { RengNotice } from '../../../shell/ui'
import { rengAnalizarFormula, rengComposicionCentesimal, rengElementosSinMasaEstandar, rengMasaMolarDe } from '../nucleo/formula'
import { rengEstadosDe, RENG_FUENTES_NOMENCLATURA, RENG_NOMBRE_FUNCION, type RengCompuesto } from '../nucleo/nomenclatura'
import { rengComa, RengEmpirica, RENG_EXPLICACION, rengSigno } from './FormulacionPartes'
import { RengFormulaSimple } from './Formula'
import { rengEstiloCpk, useRengMuestra } from './nivel'
import { RengPanelExplicacion, RengVerMas } from './PanelExplicacion'

export function RengPanelFormulacion({ k: rengK }: { k: RengCompuesto }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const [rengResaltado, rengSetResaltado] = useState<string | null>(null)
  const rengDatosMasa = useMemo(() => {
    try {
      const rengF = rengAnalizarFormula(rengK.formula)
      return { M: rengMasaMolarDe(rengF), comp: rengComposicionCentesimal(rengF), aprox: rengElementosSinMasaEstandar(rengF) }
    } catch {
      return null
    }
  }, [rengK])
  return (
  <RengPanelExplicacion
    titular={rengK.nombres.principal}
    parrafo={RENG_EXPLICACION[rengK.funcion]}
    saberMas={
      <>
        {rengK.nombres.notas.map((rengN) => (
          <p key={rengN}>{rengN}</p>
        ))}
        <p className="faint">Fuentes: {RENG_FUENTES_NOMENCLATURA.join(' · ')}.</p>
      </>
    }
  >
    <dl className="datos">
      <dt>Fórmula</dt>
      <dd>
        <RengFormulaSimple texto={rengK.formula} />
      </dd>
      <dt>Nombre recomendado</dt>
      <dd>{rengK.nombres.principal}</dd>
      <dt>Tipo de compuesto</dt>
      <dd>{RENG_NOMBRE_FUNCION[rengK.funcion]}</dd>
    </dl>
    {rengMuestra('formulacion.datosAvanzados') && (
      <RengVerMas titulo="Datos avanzados" abierto>
        <dl className="datos">
          <dt>Números de oxidación</dt>
          <dd>{rengEstadosDe(rengK).map((rengE) => `${rengE.el} ${rengSigno(rengE.ox)}`).join(', ') || '—'}</dd>
          <dt>Función química</dt>
          <dd>{RENG_NOMBRE_FUNCION[rengK.funcion]}</dd>
          {rengDatosMasa && (
            <>
              <dt>Masa molar</dt>
              <dd>{rengComa(rengDatosMasa.M, 3)} g/mol</dd>
            </>
          )}
        </dl>
        {rengDatosMasa && rengDatosMasa.aprox.length > 0 && <RengNotice tipo="warn">{rengDatosMasa.aprox.join(', ')} no tiene masa atómica estándar: la masa molar es aproximada.</RengNotice>}
      </RengVerMas>
    )}
    {rengMuestra('formulacion.composicionMasa') && rengDatosMasa && (
      <RengVerMas titulo="Composición en masa">
        {rengDatosMasa.comp.map((rengP) => (
          <div
            key={rengP.simbolo}
            className={rengResaltado === rengP.simbolo ? 'fila-resaltada' : ''}
            style={{ padding: '2px 6px' }}
            onMouseEnter={() => rengSetResaltado(rengP.simbolo)}
            onMouseLeave={() => rengSetResaltado(null)}
          >
            <div className="row sm" style={{ justifyContent: 'space-between' }}>
              <span>
                <span className="punto-cpk" style={rengEstiloCpk(rengP.simbolo)} aria-hidden="true" />
                <b>{rengP.simbolo}</b> · {rengP.cantidad}
              </span>
              <span>{rengComa(rengP.porcentaje, 2)} %</span>
            </div>
            <div className="progress" aria-hidden="true">
              <i style={{ ...rengEstiloCpk(rengP.simbolo), width: `${rengP.porcentaje}%`, background: 'var(--cpk)' }} />
            </div>
          </div>
        ))}
      </RengVerMas>
    )}
    {rengMuestra('formulacion.empirica') && <RengEmpirica />}
  </RengPanelExplicacion>
  )
}
