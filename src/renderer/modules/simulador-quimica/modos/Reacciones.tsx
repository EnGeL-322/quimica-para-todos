import { useMemo, useState } from 'react'
import { rengDerivarTodos } from '../estado/derivados'
import { RengAjusteManual } from '../vista/AjusteManual'
import { RengAsistenteMezcla } from '../vista/AsistenteMezcla'
import { useRengMuestra } from '../vista/nivel'
import { RengVacioTrabajo } from '../vista/BarraTrabajo'
import { RengPanelExplicacion } from '../vista/PanelExplicacion'
import { RengReaccionMesa } from '../vista/ReaccionMesa'
import { RengTresZonas } from '../vista/TresZonas'
import type { RengEstadoMesa } from '../vista/useMesa'
import { useRengTrabajo } from '../vista/useTrabajo'

interface RengProps {
  mesa: RengEstadoMesa
  onIrAExplorar: () => void
}

export default function RengReacciones({ onIrAExplorar: rengOnIrAExplorar }: RengProps): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const rengEstado = useRengTrabajo((rengE) => rengE)
  const rengHay = useMemo(() => rengDerivarTodos(rengEstado).length > 0, [rengEstado])
  const [rengManual, rengSetManual] = useState(false)

  if (rengManual)
    return (
      <div className="stack" style={{ height: '100%', gap: 0 }}>
        <div className="row" style={{ padding: '6px 16px' }}>
          <button className="btn sm" onClick={() => rengSetManual(false)}>
            ← Volver a la reacción de la mesa
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <RengAjusteManual />
        </div>
      </div>
    )

  if (rengMuestra('reacciones.asistente'))
    return (
      <div className="centro-scroll" style={{ alignItems: 'stretch', padding: 'var(--s-5)', height: '100%', overflow: 'auto' }}>
        <div style={{ maxWidth: 760, width: '100%', margin: '0 auto' }}>
          <RengAsistenteMezcla />
          <div style={{ marginTop: 'var(--s-4)' }}>
            <button className="btn ghost sm" onClick={() => rengSetManual(true)}>
              Ajustar una ecuación escrita a mano
            </button>
          </div>
        </div>
      </div>
    )

  if (!rengHay)
    return (
      <div className="stack" style={{ height: '100%' }}>
        <RengVacioTrabajo que="Aquí verás qué reacción forman tus sustancias, con coeficientes, condiciones y productos." onIrAExplorar={rengOnIrAExplorar} />
        <div style={{ alignSelf: 'center' }}>
          <button className="btn sm" onClick={() => rengSetManual(true)}>
            O ajusta una ecuación escrita a mano
          </button>
        </div>
      </div>
    )

  return (
    <RengTresZonas
      lienzo={
        <div className="zonas-lienzo">
          <div className="centro-scroll" style={{ alignItems: 'stretch' }}>
            <RengReaccionMesa />
          </div>
        </div>
      }
      barra={
        <button className="btn sm" onClick={() => rengSetManual(true)}>
          Ajustar una ecuación escrita a mano
        </button>
      }
      panel={
        <RengPanelExplicacion
          titular="Reacción con lo construido"
          parrafo="Marca qué fragmentos de la mesa reaccionan. Si coinciden con una reacción del catálogo de la app (identificada por su estructura, no por la fórmula), verás la ecuación, sus condiciones y podrás llevar los productos a la mesa. Lo que añadas aquí aparece también en Explorar."
          saberMas={<p>Solo se muestran reacciones de libro de texto con su fuente. Si no hay coincidencia, la app lo dice: no inventa productos.</p>}
        />
      }
    />
  )
}
