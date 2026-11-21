import { useMemo, useState } from 'react'
import { rengAnadirSustancia, rengLlevarProductos, rengReemplazarActivo, type RengResultado } from '../estado/acciones'
import { rengDerivarTodos } from '../estado/derivados'
import { rengAjustarEcuacion } from '../nucleo/ajuste'
import { rengMezclar } from '../nucleo/mezclador'
import { rengBorrarAtomos } from '../nucleo/mesa'
import { rengIdentidadDeFragmento, rengIdentificadaDeFragmento } from '../nucleo/identidad'
import { rengBuscarReaccion, rengIdentidadDeEspecie } from '../nucleo/reaccionesConocidas'
import { rengInterpretarSustancia } from '../nucleo/sustancia'
import { RengEntradaSustancia } from './EntradaSustancia'
import { RengFormula, RengFormulaSimple } from './Formula'
import { RengResultadoMezcla } from './ResultadoMezcla'
import { useRengAlmacen, useRengTrabajo } from './useTrabajo'
import { RengIcon } from '@/shell/Icon'

function rengIncluidosAvisos(rengFs: Parameters<typeof rengIdentidadDeFragmento>[0][]): string[] {
  const rengNotas = rengFs.map((rengF) => rengIdentidadDeFragmento(rengF)).flatMap((rengR) => ('identidad' in rengR && rengR.identidad.nota ? [rengR.identidad.nota] : []))
  return [...new Set(rengNotas)]
}

export function RengReaccionMesa(): React.JSX.Element {
  const rengT = useRengAlmacen()
  const rengEstado = useRengTrabajo((rengE) => rengE)
  const rengFrags = useMemo(() => rengDerivarTodos(rengEstado), [rengEstado])
  const [rengTexto, rengSetTexto] = useState('')
  const [rengAviso, rengSetAviso] = useState<{ texto: string; err: boolean } | null>(null)
  const rengIncluidos = rengFrags.filter((rengF) => !rengEstado.excluidos.includes(rengF.id))
  const rengIdentidadDe = (rengF: (typeof rengFrags)[number]): string | null => {
    const rengR = rengIdentidadDeFragmento(rengF)
    return 'motivo' in rengR ? null : rengR.identidad.clave
  }
  const rengAvisosIdentidad = rengIncluidosAvisos(rengFrags.filter((rengF) => !rengEstado.excluidos.includes(rengF.id)))
  const rengCoincidencia = useMemo(() => rengBuscarReaccion(rengIncluidos.map(rengIdentidadDe), rengEstado.condiciones.catalizador), [rengIncluidos, rengEstado.condiciones.catalizador])
  const rengR = rengCoincidencia.tipo === 'conocida' ? rengCoincidencia.r : null
  const rengSustancias = rengIncluidos.map(rengIdentificadaDeFragmento)
  const rengMezcla = rengCoincidencia.tipo === 'ninguna' && rengCoincidencia.causa === 'sin-datos' && rengSustancias.length === 2 && rengSustancias[0] && rengSustancias[1] ? rengMezclar(rengSustancias[0], rengSustancias[1]) : null
  const rengFragDeEspecie = (rengS: { ident: string }): (typeof rengIncluidos)[number] | undefined => rengIncluidos.find((rengX) => rengIdentidadDe(rengX) !== null && rengIdentidadDe(rengX) === rengIdentidadDeEspecie({ ...rengS, formula: '', coef: 1, entrada: '' }))
  const rengCoefDe = (rengS: { ident: string }): number => {
    const rengF = rengFragDeEspecie(rengS)
    return (rengF && rengEstado.coeficientes[rengF.id]) || 1
  }
  const rengEcuacion = rengR ? `${rengR.reactivos.map((rengS) => `${rengCoefDe(rengS) === 1 ? '' : rengCoefDe(rengS)}${rengS.formula}`).join(' + ')} -> ${rengR.productos.map((rengS) => `${rengS.coef === 1 ? '' : rengS.coef}${rengS.formula}`).join(' + ')}` : null
  const rengAjustada = rengR ? rengR.reactivos.every((rengS) => rengCoefDe(rengS) === rengS.coef) : false

  const rengEjecutar = (rengRes: RengResultado): void => {
    if (rengRes.ok) {
      rengT.aplicar(() => rengRes.estado)
      rengSetAviso(rengRes.nota ? { texto: rengRes.nota, err: false } : null)
    } else rengSetAviso({ texto: 'error' in rengRes ? rengRes.error : `${rengRes.nota} Escribe el nombre exacto.`, err: true })
  }
  const rengEquilibrar = (): void => {
    if (!rengR) return
    const rengAj = rengAjustarEcuacion(`${rengR.reactivos.map((rengS) => rengS.formula).join(' + ')} -> ${rengR.productos.map((rengS) => rengS.formula).join(' + ')}`)
    rengT.aplicar((rengE) => {
      const rengCoef = { ...rengE.coeficientes }
      rengAj.reactivos.forEach((rengTerm, rengI) => {
        const rengF = rengFragDeEspecie(rengR.reactivos[rengI]!)
        if (rengF) rengCoef[rengF.id] = rengTerm.coef
      })
      return { ...rengE, coeficientes: rengCoef }
    })
  }

  return (
    <div className="stack reaccion-mesa" style={{ gap: 12 }}>
      <fieldset className="stack" style={{ gap: 6 }}>
        <legend className="sm muted">Reactivos (los fragmentos de la mesa)</legend>
        {rengFrags.map((rengF) => (
          <div key={rengF.id} className="row reactivo-fila">
            <label className="check">
              <input type="checkbox" checked={!rengEstado.excluidos.includes(rengF.id)} onChange={(rengEv) => rengT.aplicar((rengE) => ({ ...rengE, excluidos: rengEv.target.checked ? rengE.excluidos.filter((rengX) => rengX !== rengF.id) : [...rengE.excluidos, rengF.id] }))} />
              <RengFormulaSimple texto={rengF.formula} />
              <span className="sm muted">{rengF.completa || rengF.ids.length === 1 ? (rengF.nombre ?? '') : 'incompleto'}</span>
            </label>
            <input
              className="input coef"
              type="number"
              min={1}
              max={20}
              aria-label={`Coeficiente de ${rengF.formula}`}
              value={rengEstado.coeficientes[rengF.id] ?? 1}
              onChange={(rengEv) => {
                const rengN = Math.max(1, Math.min(20, Math.round(Number(rengEv.target.value) || 1)))
                rengT.aplicar((rengE) => ({ ...rengE, coeficientes: { ...rengE.coeficientes, [rengF.id]: rengN } }))
              }}
            />
            <button className="btn ghost sm" aria-label={`Quitar ${rengF.formula} de la mesa`} title="Quitar de la mesa (Ctrl+Z lo devuelve)" onClick={() => rengT.aplicar((rengE) => ({ ...rengE, mesa: rengBorrarAtomos(rengE.mesa, new Set(rengF.ids)) }))}>
              ✕
            </button>
          </div>
        ))}
      </fieldset>
      <div className="row" style={{ gap: 6, alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <RengEntradaSustancia id="reaccion-entrada" etiqueta="Añadir o reemplazar reactivo" valor={rengTexto} onValor={rengSetTexto} resultado={rengInterpretarSustancia(rengTexto)} onConfirmar={(rengV) => rengEjecutar(rengAnadirSustancia(rengT.obtener(), rengV))} />
        </div>
        <button className="btn sm" disabled={!rengTexto.trim()} onClick={() => rengEjecutar(rengAnadirSustancia(rengT.obtener(), rengTexto))}>
          Añadir
        </button>
        <button className="btn sm" disabled={!rengTexto.trim()} onClick={() => rengEjecutar(rengReemplazarActivo(rengT.obtener(), rengTexto))} title="Sustituye el fragmento activo">
          Reemplazar el activo
        </button>
      </div>
      <fieldset className="row" style={{ gap: 12 }}>
        <legend className="sm muted">Condiciones</legend>
        <label className="field">
          <span className="sm">Temperatura (K)</span>
          <input className="input coef" style={{ width: 96 }} type="number" value={rengEstado.condiciones.temperatura} onChange={(rengEv) => rengT.aplicar((rengE) => ({ ...rengE, condiciones: { ...rengE.condiciones, temperatura: Number(rengEv.target.value) || 0 } }))} />
        </label>
        <label className="check">
          <input type="checkbox" checked={rengEstado.condiciones.acuoso} onChange={(rengEv) => rengT.aplicar((rengE) => ({ ...rengE, condiciones: { ...rengE.condiciones, acuoso: rengEv.target.checked } }))} />
          <span>En agua (acuoso)</span>
        </label>
        <label className="field">
          <span className="sm">Catalizador</span>
          <input className="input" style={{ width: 110 }} placeholder="p. ej. Fe, Pt" value={rengEstado.condiciones.catalizador} onChange={(rengEv) => rengT.aplicar((rengE) => ({ ...rengE, condiciones: { ...rengE.condiciones, catalizador: rengEv.target.value } }), false)} />
        </label>
      </fieldset>
      {rengAviso && <div className={`notice ${rengAviso.err ? 'err' : ''}`} role="status">{rengAviso.texto}</div>}
      {rengAvisosIdentidad.map((rengT) => (
        <div key={rengT} className="notice warn" role="status">{rengT}</div>
      ))}
      {rengCoincidencia.tipo === 'ninguna' ? (
        rengMezcla ? (
          <RengResultadoMezcla
            res={rengMezcla}
            onLlevar={() => rengMezcla.tipo === 'reaccion' && rengEjecutar(rengLlevarProductos(rengT.obtener(), rengMezcla.r.productos.map((rengP) => ({ entrada: rengP.entrada, formula: rengP.formula }))))}
          />
        ) : (
          <div className="notice" role="status">
            {rengCoincidencia.motivo}
          </div>
        )
      ) : (
        rengR && (
          <div className="stack" style={{ gap: 6 }}>
            <b>{rengR.nombre}</b>
            {rengEcuacion && <RengFormula texto={rengEcuacion} tamano="media" />}
            <span className={`sm ${rengAjustada ? 'ok-texto' : 'err-texto'}`}>{rengAjustada ? <><RengIcon name="check" size={12} /> Ajustada</> : 'Sin ajustar: los átomos no coinciden a cada lado.'}</span>
            <span className="sm">{rengR.condiciones} {rengR.observable}</span>
            {rengCoincidencia.faltaCatalizador && <div className="notice warn">Sin catalizador ({rengR.catalizador!.texto}) la reacción no es apreciable: no se llevan productos.</div>}
            <div className="row" style={{ gap: 6 }}>
              <button className="btn sm" onClick={rengEquilibrar} disabled={rengAjustada}>
                Equilibrar
              </button>
              <button className="btn primary sm" disabled={rengCoincidencia.faltaCatalizador} onClick={() => rengEjecutar(rengLlevarProductos(rengT.obtener(), rengR.productos))}>
                Llevar productos a la mesa
              </button>
            </div>
            <span className="faint sm">Fuente: {rengR.fuente}.</span>
          </div>
        )
      )}
    </div>
  )
}
