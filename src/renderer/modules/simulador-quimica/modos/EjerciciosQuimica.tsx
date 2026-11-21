import { useCallback, useEffect, useRef, useState, type Dispatch } from 'react'
import { rengIntentoAbierto, type RengAccionPractica, type RengEstadoPractica } from '../practica/estado'
import type { RengNivelPractica } from '../practica/niveles'
import type { RengRama, RengTema, RengTransferenciaSimulacion } from '../practica/tipos'
import { RENG_FILTRO_VACIO, type RengFiltroTemas } from '../vista/ExploradorTemas'
import RengSelectorEjercicios from './SelectorEjercicios'
import RengVistaEjercicios from './VistaEjercicios'

interface RengProps {
  estado: RengEstadoPractica
  despachar: Dispatch<RengAccionPractica>
  nivel: RengNivelPractica
  onNivel: (rengN: RengNivelPractica) => void
  onTema: (rengRama: RengRama, rengTema: string) => void
  onSimular: (rengT: RengTransferenciaSimulacion) => void
  onAbrirEnMesa: (rengSmiles: string, rengModo: 'reemplazar' | 'anadir') => void
  mesaVacia: boolean
  activo: boolean
  aperturaDirecta: number
  onRepasarLeccion: (rengTema: string) => void
  avisos: string[]
  onCerrarAvisos: () => void
  extra?: React.ReactNode
}

type RengVista = 'selector' | 'resolver'

export default function RengEjerciciosQuimica({ estado: rengEstado, despachar: rengDespachar, nivel: rengNivel, onNivel: rengOnNivel, onTema: rengOnTema, onSimular: rengOnSimular, onAbrirEnMesa: rengOnAbrirEnMesa, mesaVacia: rengMesaVacia, activo: rengActivo, aperturaDirecta: rengAperturaDirecta, onRepasarLeccion: rengOnRepasarLeccion, avisos: rengAvisos, onCerrarAvisos: rengOnCerrarAvisos, extra: rengExtra }: RengProps): React.JSX.Element {
  const [rengVista, rengSetVista] = useState<RengVista>('selector')
  const [rengFiltro, rengSetFiltro] = useState<RengFiltroTemas>(RENG_FILTRO_VACIO)
  const [rengEnfocar, rengSetEnfocar] = useState<{ id: string; n: number } | null>(null)
  const rengUltimaApertura = useRef(rengAperturaDirecta)
  const rengContenido = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rengActivo) return
    if (rengAperturaDirecta !== rengUltimaApertura.current) {
      rengUltimaApertura.current = rengAperturaDirecta
      rengSetVista('resolver')
    } else {
      rengSetVista('selector')
      rengSetEnfocar(null)
    }
  }, [rengActivo, rengAperturaDirecta])

  useEffect(() => {
    if (rengVista === 'resolver' || !rengEnfocar) rengContenido.current?.closest('.quimica-practicas')?.scrollTo({ top: 0 })
  }, [rengVista])

  const rengAbrirTema = useCallback(
    (rengT: RengTema): void => {
      if (!(rengEstado.actual.tema === rengT.id && rengIntentoAbierto(rengEstado.actual))) rengOnTema(rengT.rama, rengT.id)
      rengSetVista('resolver')
    },
    [rengEstado.actual, rengOnTema]
  )

  const rengVolver = useCallback((): void => {
    rengSetEnfocar((rengE) => ({ id: rengEstado.actual.tema, n: (rengE?.n ?? 0) + 1 }))
    rengSetVista('selector')
  }, [rengEstado.actual.tema])

  return (
    <div className="ejq-pantalla">
      <div className="ejq-contenido stack" ref={rengContenido}>
        {rengVista === 'selector' ? (
          <RengSelectorEjercicios
            estado={rengEstado}
            nivel={rengNivel}
            onNivel={rengOnNivel}
            filtro={rengFiltro}
            onFiltro={rengSetFiltro}
            enfocar={rengEnfocar}
            onAbrirTema={rengAbrirTema}
            onContinuar={() => rengSetVista('resolver')}
            onRecuperar={(rengClave) => {
              rengDespachar({ tipo: 'recuperar', clave: rengClave })
              rengSetVista('resolver')
            }}
            onDescartar={(rengClave) => rengDespachar({ tipo: 'descartar', clave: rengClave })}
            avisos={rengAvisos}
            onCerrarAvisos={rengOnCerrarAvisos}
          />
        ) : (
          <RengVistaEjercicios estado={rengEstado} despachar={rengDespachar} nivel={rengNivel} onRepasarLeccion={rengOnRepasarLeccion} onVolver={rengVolver} onSimular={rengOnSimular} onAbrirEnMesa={rengOnAbrirEnMesa} mesaVacia={rengMesaVacia} />
        )}
        {rengVista === 'selector' && rengExtra}
      </div>
    </div>
  )
}
