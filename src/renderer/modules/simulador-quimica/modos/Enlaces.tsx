import { useMemo, useState } from 'react'
import { rengCambiarCarga, rengCompletarActivo, rengSeleccionarGrupo } from '../estado/acciones'
import { rengAgruparEnlaces } from '../estado/agrupar'
import { rengDerivarActivo, rengExplicarIncompleto } from '../estado/derivados'
import { RENG_SECUENCIAS, type RengSecuencia } from '../enlaces/secuencias'
import { rengComposicionConocida } from '../nucleo/analisisMesa'
import { rengSecuenciaDeEnlace } from '../nucleo/secuenciaEnlace'
import { RengVacioTrabajo } from '../vista/BarraTrabajo'
import { RengCompletarValencias } from '../vista/CompletarValencias'
import { RengEnlaceAnimado } from '../vista/EnlaceAnimado'
import { RengFormulaSimple } from '../vista/Formula'
import { useRengMuestra } from '../vista/nivel'
import { RengTablaEnlaces } from '../vista/TablaEnlaces'
import { RengSelectorEnlaces, type RengEleccion } from '../vista/SelectorEnlaces'
import { RengTresZonas } from '../vista/TresZonas'
import type { RengEstadoMesa } from '../vista/useMesa'
import { useRengAlmacen, useRengTrabajo } from '../vista/useTrabajo'
import RengConstructorEnlace from './ConstructorEnlace'

interface RengProps {
  mesa: RengEstadoMesa
  visible: boolean
  onIrAExplorar: () => void
}

export default function RengEnlaces({ mesa: rengMesa, visible: rengVisible, onIrAExplorar: rengOnIrAExplorar }: RengProps): React.JSX.Element {
  const rengT = useRengAlmacen()
  const rengMuestra = useRengMuestra()
  const rengEstado = useRengTrabajo((rengE) => rengE)
  const rengD = useMemo(() => rengDerivarActivo(rengEstado), [rengEstado])
  const [rengCatalogo, rengSetCatalogo] = useState(false)
  const [rengAviso, rengSetAviso] = useState<string | null>(null)

  const rengSel = rengEstado.seleccion.enlace
  const rengElegido = rengD && rengD.enlaces.length ? (rengD.enlaces.find((rengX) => rengSel && ((rengX.a === rengSel[0] && rengX.b === rengSel[1]) || (rengX.a === rengSel[1] && rengX.b === rengSel[0]))) ?? rengD.enlaces[0]!) : null
  const rengSd = useMemo(() => (rengElegido ? rengSecuenciaDeEnlace(rengEstado.mesa, rengElegido.a, rengElegido.b) : null), [rengElegido, rengEstado.mesa])
  const rengIncompleto = rengD ? rengExplicarIncompleto(rengD) : null
  const rengGrupos = useMemo(() => (rengD ? rengAgruparEnlaces(rengD.enlaces) : []), [rengD])

  if (rengCatalogo) return <RengCatalogo onVolver={() => rengSetCatalogo(false)} atajos={rengVisible} />
  if (!rengD) return <RengVacioTrabajo que="Aquí verás los enlaces de lo que construyas y cómo se forma cada uno, paso a paso." onIrAExplorar={rengOnIrAExplorar} />

  const rengAplicar = (rengR: ReturnType<typeof rengCompletarActivo>): void => {
    if (rengR.ok) {
      rengT.aplicar(() => rengR.estado)
      rengSetAviso(null)
    } else rengSetAviso('error' in rengR ? rengR.error : rengR.nota)
  }

  const rengPanel = (
    <div className="stack" style={{ gap: 10 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="row" style={{ gap: 8 }}>
          <RengFormulaSimple texto={rengD.formula} tamano="media" />
          {rengD.nombre && rengD.completa && <b>{rengD.nombre}</b>}
        </span>
        <button className="btn ghost sm" onClick={() => rengSetCatalogo(true)} title="Ejemplos escritos a mano (NaCl, H₂O, O₂…)">
          Catálogo de ejemplos
        </button>
      </div>
      {rengIncompleto && (
        <div className="notice warn stack" style={{ gap: 6 }} role="status">
          <span>{rengIncompleto}</span>
          <div className="row" style={{ gap: 6 }}>
            <RengCompletarValencias ids={rengD.ids} />
            {rengD.libres > 0 && !rengComposicionConocida(rengD.formula, rengD.ids.length) && (
              <button className="btn sm" onClick={() => rengAplicar(rengCompletarActivo(rengEstado))}>
                Completar con H
              </button>
            )}
            {rengD.faltan.length > 0 && (
              <button className="btn sm" onClick={() => rengAplicar(rengCambiarCarga(rengEstado, -1))} title="Pone la carga en el átomo más electronegativo con valencia libre">
                Añadir carga −
              </button>
            )}
          </div>
        </div>
      )}
      {rengAviso && <div className="notice err">{rengAviso}</div>}
      {rengD.enlaces.length === 0 ? (
        <p className="sm muted">Un átomo suelto no tiene enlaces. En Explorar, acércale otro átomo para unirlos.</p>
      ) : rengMuestra('enlaces.chips') ? (
        <div className="stack" style={{ gap: 8 }}>
          <div className="chips-enlaces" role="group" aria-label={`Enlaces de ${rengD.formula}: elige uno`}>
            {rengGrupos.map((rengG) => {
              const rengActivo = !!rengElegido && rengG.pares.some(([rengA, rengB]) => (rengA === rengElegido.a && rengB === rengElegido.b) || (rengA === rengElegido.b && rengB === rengElegido.a))
              return (
                <button key={rengG.clave} className={`chip-enlace ${rengActivo ? 'activo' : ''}`} aria-pressed={rengActivo} onClick={() => rengT.aplicar((rengE) => rengSeleccionarGrupo(rengE, rengG.pares), false)}>
                  <b className="mono">{rengG.etiqueta}</b>
                  {rengG.n > 1 && <span className="enlace-n">×{rengG.n}</span>}
                </button>
              )
            })}
          </div>
          {rengElegido && <p className="sm muted">{rengElegido.descripcion}</p>}
        </div>
      ) : (
        <ul className="lista-enlaces" aria-label={`Enlaces de ${rengD.formula}`}>
          {rengGrupos.map((rengG) => {
            const rengActivo = !!rengElegido && rengG.pares.some(([rengA, rengB]) => (rengA === rengElegido.a && rengB === rengElegido.b) || (rengA === rengElegido.b && rengB === rengElegido.a))
            return (
              <li key={rengG.clave}>
                <button
                  className={`enlace-item ${rengActivo ? 'activo' : ''}`}
                  aria-pressed={rengActivo}
                  aria-label={`${rengG.etiqueta}${rengG.n > 1 ? `, ${rengG.n} enlaces iguales` : ''}: ${rengG.descripcion}. Resalta sus átomos en la mesa.`}
                  onClick={() => rengT.aplicar((rengE) => rengSeleccionarGrupo(rengE, rengG.pares), false)}
                >
                  <b className="mono">
                    {rengG.etiqueta}
                    {rengG.n > 1 && <span className="enlace-n">×{rengG.n}</span>}
                  </b>
                  <span className="sm muted">{rengG.descripcion}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {rengMuestra('enlaces.tabla') && <RengTablaEnlaces d={rengD} />}
      {rengSd?.avisos.map((rengA) => (
        <p key={rengA} className="sm faint">
          {rengA}
        </p>
      ))}
    </div>
  )

  if (!rengElegido || !rengSd?.sec)
    return (
      <RengTresZonas
        lienzo={
          <div className="zonas-lienzo">
            <div className="lienzo-vacio">
              <span className="sm">{rengElegido ? 'No hay una secuencia paso a paso con datos para este enlace (ver el panel).' : 'Elige un fragmento con enlaces.'}</span>
            </div>
          </div>
        }
        barra={<span className="sm muted">{rengMesa.mesa.atomos.length} átomos en la mesa</span>}
        panel={rengPanel}
      />
    )
  return <RengEnlaceAnimado key={`${rengSd.sec.id}|${rengD.formula}`} sec={rengSd.sec} selector={rengPanel} atajos={rengVisible} />
}

function RengCatalogo({ onVolver: rengOnVolver, atajos: rengAtajos }: { onVolver: () => void; atajos: boolean }): React.JSX.Element {
  const [rengSecId, rengSetSecId] = useState(RENG_SECUENCIAS[0]!.id)
  const [rengEleccion, rengSetEleccion] = useState<RengEleccion>(RENG_SECUENCIAS[0]!.tipo)
  const rengSec: RengSecuencia = RENG_SECUENCIAS.find((rengX) => rengX.id === rengSecId) ?? RENG_SECUENCIAS[0]!
  const rengElegirTipo = (rengTp: RengEleccion): void => {
    rengSetEleccion(rengTp)
    if (rengTp !== 'constructor' && rengSec.tipo !== rengTp) rengSetSecId(RENG_SECUENCIAS.find((rengX) => rengX.tipo === rengTp)!.id)
  }
  const rengVerSecuencia = (rengId: string): void => {
    const rengS = RENG_SECUENCIAS.find((rengX) => rengX.id === rengId)
    if (!rengS) return
    rengSetSecId(rengId)
    rengSetEleccion(rengS.tipo)
  }
  const rengSelector = (
    <div className="stack" style={{ gap: 8 }}>
      <div className="notice">
        Catálogo de ejemplos: <b>no</b> es lo que tienes en la mesa.{' '}
        <button className="btn sm" onClick={rengOnVolver}>
          ← Volver a lo construido
        </button>
      </div>
      <RengSelectorEnlaces tipo={rengEleccion} secId={rengSec.id} onTipo={rengElegirTipo} onSecuencia={rengSetSecId} />
    </div>
  )
  if (rengEleccion === 'constructor') return <RengConstructorEnlace onVerSecuencia={rengVerSecuencia} selector={rengSelector} />
  return <RengEnlaceAnimado key={rengSec.id} sec={rengSec} selector={rengSelector} atajos={rengAtajos} />
}
