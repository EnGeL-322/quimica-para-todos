import { useCallback, useId, useMemo, useRef, useState } from 'react'
import RengCombobox, { RengResaltado, type RengOpcionCombobox } from '../../../shell/Combobox'
import type { RengResultado } from '../../../shell/nucleo/busqueda'
import { rengBuscarSustancias, rengContarSustancias, rengFormulaVisible, rengIndiceSustancias, RENG_NOMBRE_TIPO_INDICE, type RengEntradaIndice } from '../nucleo/indiceSustancias'
import { rengInterpretarSustancia, RENG_NOMBRE_TIPO, RENG_NOMBRE_VIA, type RengResultadoEntrada } from '../nucleo/sustancia'
import { RengFormulaSimple } from './Formula'
import '../quimica.css'

interface RengProps {
  valor: string
  onValor: (rengV: string) => void
  resultado: RengResultadoEntrada
  onConfirmar?: (rengV: string, rengAnadir?: boolean) => void
  etiqueta?: string
  ejemplos?: string[]
  id?: string
}

const RENG_MAX = 10

const rengTextoAlElegir = (rengE: RengEntradaIndice): string => (rengE.tipo !== 'comun' && rengInterpretarSustancia(rengE.nombre).tipo === 'ok' ? rengE.nombre : rengE.entrada)

export function RengEntradaSustancia({ valor: rengValor, onValor: rengOnValor, resultado: rengResultado, onConfirmar: rengOnConfirmar, etiqueta: rengEtiqueta = 'Sustancia', id: rengIdDado }: RengProps): React.JSX.Element {
  const rengIdAuto = useId()
  const rengId = rengIdDado ?? rengIdAuto
  const rengOpciones = useMemo(
    (): Array<RengOpcionCombobox<RengEntradaIndice>> => rengIndiceSustancias().map((rengE) => ({ id: rengE.id, valor: rengE, grupo: '', texto: rengE.nombre, detalle: RENG_NOMBRE_TIPO_INDICE[rengE.tipo] })),
    []
  )
  const rengPorId = useMemo(() => new Map(rengOpciones.map((rengO) => [rengO.id, rengO])), [rengOpciones])
  const rengCoincidencias = useRef(new Map<string, string>())
  const rengFiltrar = useCallback(
    (rengQ: string): Array<RengResultado<RengEntradaIndice>> => {
      const rengRs = rengBuscarSustancias(rengQ, RENG_MAX)
      rengCoincidencias.current = new Map(rengRs.map((rengR) => [rengR.e.id, rengR.coincide]))
      return rengRs.map((rengR, rengIndice) => ({ entrada: rengPorId.get(rengR.e.id)!, puntos: rengR.nivel, indice: rengIndice }))
    },
    [rengPorId]
  )
  const rengTotal = rengValor.trim() ? rengContarSustancias(rengValor) : 0
  const [rengComun, rengSetComun] = useState<{ nombre: string; nota: string; entrada: string } | null>(null)
  const rengElegir = (rengV: string): void => {
    rengOnValor(rengV)
    rengOnConfirmar?.(rengV)
  }

  return (
    <div className="entrada-sustancia stack" style={{ gap: 6 }}>
      <div className="row" style={{ gap: 10, alignItems: 'flex-end' }}>
        <RengCombobox<RengEntradaIndice>
          className="entrada-sustancia-cbx"
          etiqueta={rengEtiqueta}
          idEntrada={rengId}
          describedBy={`${rengId}-estado`}
          opciones={rengOpciones}
          seleccion={null}
          filtrar={rengFiltrar}
          placeholder="agua, H2O, ácido acético, CC(=O)O, Au…"
          libre={{ valor: rengValor, onValor: rengOnValor, onIntro: (rengT, rengM) => rengOnConfirmar?.(rengT, rengM.mayus) }}
          onElegir={(rengO) => {
            const rengT = rengTextoAlElegir(rengO.valor)
            rengSetComun(rengO.valor.tipo === 'comun' && rengO.valor.nota ? { nombre: rengO.valor.nombre, nota: rengO.valor.nota, entrada: rengT } : null)
            rengElegir(rengT)
          }}
          pie={rengTotal > RENG_MAX ? <div className="cbx-vacio sm">y {rengTotal - RENG_MAX} más: sigue escribiendo para afinar.</div> : null}
          renderOpcion={(rengO, rengQ) => {
            const rengC = rengCoincidencias.current.get(rengO.id)
            const rengOtro = rengC && rengC !== rengO.valor.nombre ? rengC : null
            return (
              <span className="sugerencia-sustancia">
                <span className="sugerencia-nombre">
                  <RengResaltado texto={rengO.valor.nombre} consulta={rengQ} />
                  {rengOtro && (
                    <span className="faint sm">
                      {' '}
                      (<RengResaltado texto={rengOtro} consulta={rengQ} />)
                    </span>
                  )}
                </span>
                {rengFormulaVisible(rengO.valor) && <RengFormulaSimple texto={rengFormulaVisible(rengO.valor)!} />}
                <span className="badge sugerencia-tipo">{RENG_NOMBRE_TIPO_INDICE[rengO.valor.tipo]}</span>
              </span>
            )
          }}
        />
        {rengResultado.tipo === 'ok' && (
          <span className="badge" id={`${rengId}-estado`}>
            {RENG_NOMBRE_VIA[rengResultado.sustancia.via] === RENG_NOMBRE_TIPO[rengResultado.sustancia.tipo]
              ? RENG_NOMBRE_TIPO[rengResultado.sustancia.tipo]
              : `${RENG_NOMBRE_VIA[rengResultado.sustancia.via]} → ${RENG_NOMBRE_TIPO[rengResultado.sustancia.tipo]}`}
          </span>
        )}
      </div>
      {rengComun && rengComun.entrada === rengValor && (
        <div className="notice" role="status">
          <b>{rengComun.nombre}</b>: {rengComun.nota}
        </div>
      )}
      {rengResultado.tipo === 'isomeros' && (
        <div className="notice warn" id={`${rengId}-estado`} role="status">
          <div>{rengResultado.nota}</div>
          <div className="row" style={{ marginTop: 6 }}>
            {rengResultado.opciones.map((rengO) => (
              <button key={rengO.nombre} className="btn sm" onClick={() => rengElegir(rengO.nombre)}>
                {rengO.nombre}
              </button>
            ))}
          </div>
        </div>
      )}
      {rengResultado.tipo === 'error' && rengValor.trim() !== '' && rengTotal === 0 && (
        <div className="notice err" id={`${rengId}-estado`} role="status">
          <div>{rengResultado.motivo}</div>
          {rengResultado.sugerencias.length > 0 && (
            <div className="row" style={{ marginTop: 6 }}>
              <span className="sm">¿Quisiste decir…?</span>
              {rengResultado.sugerencias.map((rengS) => (
                <button key={rengS} className="btn sm" onClick={() => rengElegir(rengS)}>
                  {rengS}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
