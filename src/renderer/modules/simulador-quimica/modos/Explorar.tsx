import { useEffect, useMemo, useRef, useState } from 'react'
import { rengDerivarActivo } from '../estado/derivados'
import { rengIdFragmento } from '../estado/trabajo'
import { rengCrearRed } from '../escena/red'
import type { RengOpcionesMesa } from '../escena/mesa'
import { RENG_ESTRUCTURAS } from '../nucleo/cristales'
import { rengAnadirHistorial, rengGuardarHistorial, rengLeerHistorial, type RengEntradaHistorial } from '../nucleo/historial'
import { rengModeloDeEntrada, rengModeloDeFragmento } from '../nucleo/modeloVisor'
import { rengInterpretarSustancia, RENG_NOMBRE_TIPO } from '../nucleo/sustancia'
import { RengAnalisisMesa } from '../vista/AnalisisMesa'
import { RengProveedorArrastre } from '../vista/arrastre'
import { RengEntradaSustancia } from '../vista/EntradaSustancia'
import { RengEstanteria } from '../vista/Estanteria'
import { RengFichaSustancia } from '../vista/FichaSustancia'
import { RengHistorialPanel } from '../vista/HistorialPanel'
import { RengLienzo3D } from '../vista/Lienzo3D'
import { RengMesa, type RengMesaApi } from '../vista/Mesa'
import { RengMedidasAvanzado } from '../vista/MedidasAvanzado'
import { rengColorTema, rengMovimientoReducido, useRengMuestra } from '../vista/nivel'
import { RengAyudaMesa } from '../vista/Recorrido'
import { RengTarjetaConstruyendo } from '../vista/TarjetaConstruyendo'
import { RengTablaCompacta } from '../vista/TablaCompacta'
import { RengTresZonas } from '../vista/TresZonas'
import type { RengEstadoMesa } from '../vista/useMesa'
import { useRengAlmacen, useRengTrabajo } from '../vista/useTrabajo'
import { RengVisorMolecular } from '../vista/visor/VisorMolecular'

const RENG_ID_ENTRADA = 'mesa-sustancia'

const rengAlmacen = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

interface RengProps {
  mesa: RengEstadoMesa
  onVerPasoAPaso?: () => void
}

export default function RengExplorar({ mesa: rengMesa, onVerPasoAPaso: rengOnVerPasoAPaso }: RengProps): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const [rengTexto, rengSetTexto] = useState('')
  const [rengPestana, rengSetPestana] = useState<'elementos' | 'informacion'>('elementos')
  const [rengEstilo, rengSetEstilo] = useState<RengOpcionesMesa['estilo']>('bolas')
  const [rengEtiquetas, rengSetEtiquetas] = useState(true)
  const [rengParciales, rengSetParciales] = useState(true)
  const [rengVerRed, rengSetVerRed] = useState<string | null>(null)
  const [rengHistorial, rengSetHistorial] = useState<RengEntradaHistorial[]>(() => rengLeerHistorial(rengAlmacen()))
  const rengApi = useRef<RengMesaApi>(null)
  const rengAcento = useMemo(() => rengColorTema('--accent', 0x38d0ff), [])
  const rengOpciones = useMemo<RengOpcionesMesa>(() => ({ estilo: rengEstilo, etiquetas: rengEtiquetas, parciales: rengParciales, reducido: rengMovimientoReducido() }), [rengEstilo, rengEtiquetas, rengParciales])
  const rengResultado = useMemo(() => rengInterpretarSustancia(rengTexto), [rengTexto])
  const rengS = rengResultado.tipo === 'ok' ? rengResultado.sustancia : null
  const rengRed = useMemo(() => (rengVerRed && RENG_ESTRUCTURAS[rengVerRed] ? rengCrearRed(RENG_ESTRUCTURAS[rengVerRed]!, rengAcento, { n: 2, tamano: 6 }).grupo : null), [rengVerRed, rengAcento])
  const [rengVisor, rengSetVisor] = useState<'mesa' | 'texto' | null>(null)
  const rengT = useRengAlmacen()
  const rengEstadoTrabajo = useRengTrabajo((rengE) => rengE)
  const rengActivoMesa = useMemo(() => rengDerivarActivo(rengEstadoTrabajo), [rengEstadoTrabajo])
  const rengModeloMesa = useMemo(() => rengModeloDeFragmento(rengT.obtener().mesa, rengActivoMesa?.ids ?? [], rengActivoMesa ?? undefined), [rengActivoMesa, rengT])
  const rengModeloTexto = useMemo(() => (rengTexto.trim() ? rengModeloDeEntrada(rengResultado) : null), [rengTexto, rengResultado])
  const rengZonaVisor = useRef<HTMLDivElement>(null)
  const rengAbrirVisor = (rengFuente: 'mesa' | 'texto', rengIds?: readonly number[]): void => {
    if (rengIds?.length) {
      const rengId = rengIdFragmento(rengIds)
      if (rengT.obtener().activo !== rengId) rengT.aplicar((rengE) => ({ ...rengE, activo: rengId }), false)
    }
    rengSetPestana('informacion')
    rengSetVisor(rengFuente)
    requestAnimationFrame(() => rengZonaVisor.current?.querySelector<HTMLElement>('.visor-lienzo, .visor-estado')?.focus?.())
  }

  const rengRecordar = (rengEntrada: string, rengNombre: string, rengTipo: string): void => {
    rengSetHistorial((rengH) => {
      const rengN = rengAnadirHistorial(rengH, { entrada: rengEntrada, nombre: rengNombre, tipo: rengTipo })
      rengGuardarHistorial(rengAlmacen(), rengN)
      return rengN
    })
  }

  const rengConfirmar = (rengV: string, rengAnadir = false): void => {
    const rengR = rengInterpretarSustancia(rengV)
    if (rengR.tipo !== 'ok') return
    rengMesa.anadirSustancia(rengV, rengAnadir ? (rengApi.current?.libre() ?? [0, 0, 0]) : [0, 0, 0], !rengAnadir)
    rengRecordar(rengV, rengR.sustancia.nombre, RENG_NOMBRE_TIPO[rengR.sustancia.tipo].toLowerCase())
    rengSetVerRed(null)
  }

  useEffect(() => {
    for (const rengA of rengMesa.analisis) if (rengA.completa && rengA.nombre && rengA.ids.length > 1) rengRecordar(rengA.sustancia?.smiles ?? rengA.formula, rengA.nombre, rengA.ionico ? 'construido (iónico)' : 'construido')
  }, [rengMesa.analisis])

  const rengVacia = rengMesa.mesa.atomos.length === 0

  const rengLienzo = rengRed ? (
    <RengLienzo3D modelo={rengRed} distancia={12} etiqueta="Red cristalina">
      <div className="hud">
        <b>Red cristalina (parámetros del CRC)</b>
      </div>
      <button className="btn sm mesa-volver" onClick={() => rengSetVerRed(null)}>
        ← Volver a la mesa
      </button>
    </RengLienzo3D>
  ) : (
    <RengMesa ref={rengApi} estado={rengMesa} opciones={rengOpciones} onVerPasoAPaso={rengOnVerPasoAPaso}>
      <details className="mesa-vista">
        <summary>Vista</summary>
        <div className="mesa-vista-cuerpo">
          <div className="segmentado" role="group" aria-label="Estilo del modelo">
            <button type="button" aria-pressed={rengEstilo === 'bolas'} onClick={() => rengSetEstilo('bolas')}>
              Bolas y barras
            </button>
            <button type="button" aria-pressed={rengEstilo === 'espacio'} onClick={() => rengSetEstilo('espacio')}>
              Espacio lleno
            </button>
          </div>
          <label className="check">
            <input type="checkbox" checked={rengEtiquetas} onChange={(rengE) => rengSetEtiquetas(rengE.target.checked)} />
            <span>Etiquetas</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={rengParciales} onChange={(rengE) => rengSetParciales(rengE.target.checked)} />
            <span>Cargas parciales</span>
          </label>
        </div>
      </details>
      {rengMuestra('explorar.tarjeta') && !rengVacia && <RengTarjetaConstruyendo onVerPasoAPaso={rengOnVerPasoAPaso} onVer3D={() => rengAbrirVisor('mesa')} />}
      {rengVacia && (
        <section className="mesa-vacia" aria-label="Mesa vacía">
          <p>
            <b>La mesa está vacía.</b> Busca una sustancia por su nombre o fórmula, o arrastra elementos desde la tabla de la derecha <span aria-hidden="true">→</span> y acércalos para unirlos.
          </p>
          <button type="button" className="btn primary" onClick={() => document.getElementById(RENG_ID_ENTRADA)?.focus()}>
            Buscar o añadir una sustancia
          </button>
          <div className="row" style={{ gap: 8, justifyContent: 'center' }} role="group" aria-label="Ejemplos para empezar">
            <span className="faint sm">o prueba:</span>
            <button type="button" className="btn sm" onClick={() => rengApi.current?.demo('agua')}>
              Formar agua
            </button>
            <button type="button" className="btn sm" onClick={() => rengApi.current?.demo('sal')}>
              Formar sal
            </button>
            <button type="button" className="btn sm" onClick={() => rengApi.current?.demo('metano')}>
              Formar metano
            </button>
          </div>
          <RengAyudaMesa guiada={rengMuestra('explorar.recorrido')} />
        </section>
      )}
      {rengMesa.mensaje && (
        <div className={`notice mesa-mensaje ${rengMesa.mensaje.tipo === 'err' ? 'err' : rengMesa.mensaje.tipo === 'ok' ? 'ok' : ''}`} role="status">
          <span>{rengMesa.mensaje.texto}</span>
          {rengMesa.mensaje.red && (
            <button className="btn sm" onClick={() => rengSetVerRed(rengMesa.mensaje!.red!)}>
              Ver red cristalina
            </button>
          )}
          {rengMesa.mensaje.forzar && (
            <button className="btn sm" onClick={rengMesa.mensaje.forzar} title="Se marcará como «no confirmado que exista»">
              Unir igualmente
            </button>
          )}
          <button className="btn ghost sm" aria-label="Cerrar mensaje" onClick={() => rengMesa.setMensaje(null)}>
            ✕
          </button>
        </div>
      )}
    </RengMesa>
  )

  return (
    <RengProveedorArrastre>
      <RengTresZonas
        lienzo={rengLienzo}
        barra={
          <>
            <div className="mesa-grupo mesa-grupo-entrada" role="group" aria-label="Añadir una sustancia">
              <div className="mesa-grupo-controles">
                <div style={{ flex: '1 1 320px', minWidth: 260 }}>
                  <RengEntradaSustancia id={RENG_ID_ENTRADA} valor={rengTexto} onValor={rengSetTexto} resultado={rengResultado} onConfirmar={rengConfirmar} />
                </div>
                <button className="btn sm" onClick={() => rengConfirmar(rengTexto, true)} disabled={!rengS} title="Añadir a la mesa como un fragmento más (Mayús+Intro)" aria-label="Añadir a la mesa">
                  +
                </button>
              </div>
            </div>
            <div className="mesa-grupo" role="group" aria-labelledby="mesa-grupo-editar">
              <span className="mesa-grupo-titulo" id="mesa-grupo-editar">
                Editar
              </span>
              <div className="mesa-grupo-controles">
                <button className="btn sm" onClick={rengMesa.deshacer} disabled={!rengMesa.puedeDeshacer} title="Deshacer" aria-label="Deshacer">
                  ↶
                </button>
                <button className="btn sm" onClick={rengMesa.rehacer} disabled={!rengMesa.puedeRehacer} title="Rehacer" aria-label="Rehacer">
                  ↷
                </button>
                <button className="btn sm" onClick={rengMesa.limpiar} disabled={rengVacia} title="Vacía la mesa (se puede deshacer; no borra el historial)">
                  Limpiar mesa
                </button>
                <button className="btn sm" onClick={() => rengMesa.analisis.filter((rengA) => rengA.ids.length > 1).forEach((rengA) => rengMesa.optimizar(rengA.ids))} disabled={rengVacia}>
                  Optimizar
                </button>
              </div>
            </div>
          </>
        }
        panel={
          <>
            <div className="tabs" role="tablist" aria-label="Panel derecho">
              {(
                [
                  ['elementos', 'Elementos'],
                  ['informacion', 'Información']
                ] as const
              ).map(([rengId, rengNombre]) => (
                <button key={rengId} role="tab" aria-selected={rengPestana === rengId} className={`tab ${rengPestana === rengId ? 'active' : ''}`} onClick={() => rengSetPestana(rengId)}>
                  {rengNombre}
                </button>
              ))}
            </div>
            {rengPestana === 'elementos' ? (
              <>
                <RengTablaCompacta onAnadir={(rengEl) => rengMesa.anadirElemento(rengEl, rengApi.current?.libre() ?? [0, 0, 0])} />
                <RengEstanteria onAnadir={(_, rengEntrada) => rengMesa.anadirSustancia(rengEntrada, rengApi.current?.libre() ?? [0, 0, 0])} />
              </>
            ) : (
              <>
                {rengVisor && (
                  <div ref={rengZonaVisor}>
                    {rengVisor === 'mesa' ? (
                      <RengVisorMolecular modelo={rengModeloMesa} contexto="Seleccionado en la mesa" onCerrar={() => rengSetVisor(null)} />
                    ) : (
                      <RengVisorMolecular
                        modelo={rengModeloTexto ?? { estado: 'vacio', motivo: 'Escribe una sustancia abajo para ver su modelo 3D.' }}
                        contexto="Sustancia escrita"
                        onCerrar={() => rengSetVisor(null)}
                        onElegirEstructura={(rengEntrada) => rengSetTexto(rengEntrada)}
                      />
                    )}
                  </div>
                )}
                <RengAnalisisMesa estado={rengMesa} onVerRed={rengSetVerRed} onVer3D={(rengIds) => rengAbrirVisor('mesa', rengIds)} activo={rengEstadoTrabajo.activo} />
                {rengMuestra('explorar.medidas') && <RengMedidasAvanzado />}
                {rengS && <RengFichaSustancia s={rengS} onVer3D={() => rengAbrirVisor('texto')} />}
                <RengHistorialPanel
                  lista={rengHistorial}
                  onLista={rengSetHistorial}
                  onAbrir={(rengE) => {
                    rengSetTexto(rengE.entrada)
                    rengConfirmar(rengE.entrada)
                  }}
                />
              </>
            )}
          </>
        }
      />
    </RengProveedorArrastre>
  )
}
