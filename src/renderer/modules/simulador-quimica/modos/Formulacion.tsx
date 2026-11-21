import { useMemo, useState } from 'react'
import { rengDerivarActivo } from '../estado/derivados'
import { rengCompuestoDeFragmento } from '../estado/formulacionActiva'
import { rengPasosFormulacion } from '../nucleo/formulacion'
import { RENG_NOMBRE_FUNCION } from '../nucleo/nomenclatura'
import { RengVacioTrabajo } from '../vista/BarraTrabajo'
import { RengCompletarValencias } from '../vista/CompletarValencias'
import { RengControlesPaso } from '../vista/ControlesPaso'
import { RengCruceCargas } from '../vista/CruceCargas'
import { RengEditorFormula } from '../vista/EditorFormula'
import { RengEstadoVacio } from '../vista/EstadoVacio'
import { RengFormula } from '../vista/Formula'
import { RengEstructura, RengNombres } from '../vista/FormulacionPartes'
import { RengPanelExplicacion, RengTextoGlosario } from '../vista/PanelExplicacion'
import { RengPanelFormulacion } from '../vista/PanelFormulacion'
import { RengTresZonas } from '../vista/TresZonas'
import type { RengEstadoMesa } from '../vista/useMesa'
import { useRengSecuencia } from '../vista/useSecuencia'
import { useRengTrabajo } from '../vista/useTrabajo'

type RengVista = 'como' | 'estructura'

interface RengProps {
  mesa: RengEstadoMesa
  onIrAExplorar: () => void
  onPracticar: () => void
}

export default function RengFormulacion({ onIrAExplorar: rengOnIrAExplorar, onPracticar: rengOnPracticar }: RengProps): React.JSX.Element {
  const rengEstado = useRengTrabajo((rengE) => rengE)
  const rengD = useMemo(() => rengDerivarActivo(rengEstado), [rengEstado])
  const [rengVista, rengSetVista] = useState<RengVista>('como')
  const [rengResaltado, rengSetResaltado] = useState<string | null>(null)
  const rengFa = useMemo(() => (rengD ? rengCompuestoDeFragmento(rengD) : null), [rengD])
  const rengK = rengFa?.k ?? null
  const rengPasos = useMemo(() => (rengK ? rengPasosFormulacion(rengK) : []), [rengK])
  const rengSec = useRengSecuencia(
    rengPasos.map((rengP) => rengP.duracion),
    `${rengK?.formula ?? ''}|${rengVista}`,
    rengVista === 'como'
  )
  const rengPaso = rengPasos[rengSec.estado.paso]

  const rengPestanas = (
    <div className="row form-pestanas">
      <div className="tabs" role="tablist" aria-label="Vistas de formulación">
        {(
          [
            ['como', '¿Cómo se formula?'],
            ['estructura', 'Estructura 3D']
          ] as const
        ).map(([rengId, rengL]) => (
          <button key={rengId} role="tab" aria-selected={rengVista === rengId} className={`tab ${rengVista === rengId ? 'active' : ''}`} onClick={() => rengSetVista(rengId)}>
            {rengL}
          </button>
        ))}
      </div>
      <span className="spacer" />
      <button className="btn ghost sm" onClick={rengOnPracticar}>
        Practicar formular y nombrar
      </button>
    </div>
  )

  if (!rengD)
    return (
      <RengVacioTrabajo que="Aquí podrás editar su fórmula, su nombre, los subíndices y la carga, y ver cómo se formula." onIrAExplorar={rengOnIrAExplorar}>
        <button className="btn sm" onClick={rengOnPracticar}>
          O practica formular y nombrar en «Prácticas por nivel»
        </button>
      </RengVacioTrabajo>
    )

  return (
    <RengTresZonas
      lienzo={
        <div className="form-centro">
          <div className="form-cabecera">
            {rengD && (
              <>
                <RengEditorFormula d={rengD} />
                {rengFa?.origen === 'formula' && (
                  <div className="notice warn stack" style={{ gap: 6 }} role="status">
                    <span>{rengFa.motivo}</span>
                    <div className="row">
                      <RengCompletarValencias ids={rengD.ids} />
                    </div>
                  </div>
                )}
                {!rengK && rengFa?.motivo && !rengD.completa && (
                  <div className="row">
                    <RengCompletarValencias ids={rengD.ids} />
                  </div>
                )}
                {rengK && (
                  <>
                    <div className="row form-grande">
                      <RengFormula texto={rengK.formula} tamano="grande" resaltado={rengResaltado} onElemento={rengSetResaltado} />
                      <span className="badge">{RENG_NOMBRE_FUNCION[rengK.funcion]}</span>
                    </div>
                    <RengNombres k={rengK} />
                  </>
                )}
              </>
            )}
            {rengPestanas}
          </div>
          <div className="form-cuerpo">
            {rengVista === 'estructura' && rengK && <RengEstructura k={rengK} />}
            {!rengK && (
              <RengEstadoVacio titulo={rengD?.completa ? 'Sin nomenclatura inorgánica' : 'Todavía no se puede formular'} texto={rengFa?.motivo ?? 'Construye o escribe una sustancia.'}>
                <button className="btn sm" onClick={rengOnPracticar}>
                  Practicar formular y nombrar en «Prácticas por nivel»
                </button>
              </RengEstadoVacio>
            )}
            {rengVista === 'como' && rengK && rengPaso && (
              <div className="centro-scroll" style={{ justifyContent: 'center' }}>
                <div className="paso-formulacion stack" key={rengSec.estado.paso}>
                  <span className="sm muted">
                    Paso {rengSec.estado.paso + 1} de {rengPasos.length}
                  </span>
                  <h3>{rengPaso.titulo}</h3>
                  <div className="paso-notacion">
                    {rengPaso.cruce && (rengPaso.id === 'iones' || rengPaso.id === 'cruzar') ? (
                      <RengCruceCargas cruce={rengPaso.cruce} fase={rengPaso.id === 'cruzar' ? 'cruzar' : 'iones'} />
                    ) : (
                      <RengFormula texto={rengPaso.notacion} tamano="grande" resaltado={rengResaltado} onElemento={rengSetResaltado} />
                    )}
                  </div>
                  <p className="expl-parrafo">
                    <RengTextoGlosario texto={rengPaso.texto} />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      barra={
        rengVista === 'como' && rengPasos.length > 0 ? (
          <RengControlesPaso
            paso={rengSec.estado.paso}
            t={rengSec.estado.t}
            titulos={rengPasos.map((rengP) => rengP.titulo)}
            reproduciendo={rengSec.estado.reproduciendo}
            onAnterior={rengSec.anterior}
            onAlternar={rengSec.alternar}
            onSiguiente={rengSec.siguiente}
            onIr={rengSec.ir}
          />
        ) : (
          <span className="sm muted">Edita la fórmula o el nombre: la mesa cambia (Ctrl+Z deshace).</span>
        )
      }
      panel={
        rengK ? (
          <RengPanelFormulacion k={rengK} />
        ) : (
          <RengPanelExplicacion titular={rengD?.nombre ?? rengD?.formula ?? 'Formulación'} parrafo={rengFa?.motivo ?? 'Construye o escribe una sustancia para formularla.'} />
        )
      }
    />
  )
}
