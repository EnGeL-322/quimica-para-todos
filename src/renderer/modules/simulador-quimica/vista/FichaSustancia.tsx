import { useMemo } from 'react'
import { RENG_MOLECULAS } from '../chemistry'
import { RENG_TEXTO_EXISTENCIA } from '../nucleo/compuestosConocidos'
import { RENG_FUENTE_MMFF } from '../nucleo/molecula'
import { RENG_FUENTE_IUPAC_ORGANICA, rengGruposFuncionales, RENG_NOMBRE_GRUPO } from '../nucleo/organica'
import { RENG_NOMBRE_TIPO, type RengSustancia } from '../nucleo/sustancia'
import { RengFormulaSimple } from './Formula'
import { useRengMuestra } from './nivel'
import { RengPanelExplicacion, RengVerMas } from './PanelExplicacion'

const rengComa = (rengX: number, rengD: number): string => rengX.toFixed(rengD).replace('.', ',')
const rengFormaCorta = (rengG: string): string => rengG.replace(/\s*\(.*\)\s*$/, '').toLowerCase()

export function RengFichaSustancia({ s: rengS, onVer3D: rengOnVer3D }: { s: RengSustancia; onVer3D?: () => void }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const rengGrupos = useMemo(() => (rengS.grafo ? rengGruposFuncionales(rengS.grafo) : []), [rengS])
  const rengExpMol = rengS.idExperimental ? RENG_MOLECULAS.find((rengM) => rengM.id === rengS.idExperimental) : null
  const rengParrafo = rengExpMol
    ? rengExpMol.nota
    : rengS.tipo === 'elemento' && rengS.notas[0]
      ? rengS.notas[0]
      : `${RENG_NOMBRE_TIPO[rengS.tipo]}${rengGrupos.length ? ` con ${rengGrupos.map((rengG) => RENG_NOMBRE_GRUPO[rengG.tipo].toLowerCase().replace(/ \(.*\)/, '')).filter((rengX, rengI, rengA) => rengA.indexOf(rengX) === rengI).join(', ')}` : ''}.`
  return (
    <RengPanelExplicacion
      titular={rengS.nombre}
      parrafo={rengParrafo}
      saberMas={
        <>
          {rengS.smiles && !rengExpMol && <p>Si su geometría se calcula, es con un campo de fuerzas (MMFF94): una buena aproximación, no una medida. {RENG_FUENTE_MMFF}.</p>}
          {rengExpMol && <p>Las posiciones de los átomos salen de longitudes y ángulos de enlace medidos experimentalmente (NIST CCCBDB).</p>}
          {rengS.notas.slice(!rengExpMol && rengS.tipo === 'elemento' ? 1 : 0).map((rengN) => (
            <p key={rengN}>{rengN}</p>
          ))}
          {rengS.organico && <p className="faint">Nomenclatura orgánica: {RENG_FUENTE_IUPAC_ORGANICA}.</p>}
        </>
      }
    >
      <dl className="datos">
        <dt>Fórmula</dt>
        <dd>
          <RengFormulaSimple texto={rengS.grafo && !rengS.inorganico ? rengS.grafo.formula : rengS.formula} />
        </dd>
        <dt>Masa molar</dt>
        <dd>{Number.isFinite(rengS.masaMolar) ? `${rengComa(rengS.masaMolar, 2)} g/mol` : '— (mezcla: cada componente tiene la suya)'}</dd>
        <dt>Tipo</dt>
        <dd>{RENG_NOMBRE_TIPO[rengS.tipo]}</dd>
        {rengS.carga !== 0 && (
          <>
            <dt>Carga</dt>
            <dd>{rengS.carga > 0 ? `+${rengS.carga}` : `−${Math.abs(rengS.carga)}`}</dd>
          </>
        )}
      </dl>
      {rengOnVer3D && rengS.smiles && (
        <button type="button" className="btn sm" onClick={rengOnVer3D} title="Modelo 3D de bolas y varillas de esta sustancia">
          Ver en 3D
        </button>
      )}
      {rengGrupos.length > 0 && (
        <div className="row" style={{ gap: 6 }} aria-label="Grupos funcionales">
          {rengGrupos.map((rengG, rengI) => (
            <span key={rengI} className="badge grupo-chip">
              {RENG_NOMBRE_GRUPO[rengG.tipo]}
            </span>
          ))}
        </div>
      )}
      {rengMuestra('explorar.fichaDetalle') && (rengS.otrosNombres.length > 0 || rengS.smiles || rengS.existe || rengExpMol) && (
        <RengVerMas titulo="Más datos" abierto>
          <dl className="datos">
            {rengS.otrosNombres.length > 0 && (
              <>
                <dt>Otros nombres</dt>
                <dd>{rengS.otrosNombres.join(' · ')}</dd>
              </>
            )}
            {rengS.smiles && (
              <>
                <dt>SMILES</dt>
                <dd className="mono">{rengS.smiles}</dd>
              </>
            )}
            {rengS.existe && (
              <>
                <dt>Existencia</dt>
                <dd>{RENG_TEXTO_EXISTENCIA[rengS.existe.estado]}</dd>
              </>
            )}
            {rengExpMol && (
              <>
                <dt>Forma</dt>
                <dd>
                  {rengFormaCorta(rengExpMol.geometria)} {rengExpMol.angulo ? `(${rengExpMol.angulo})` : ''}
                </dd>
              </>
            )}
          </dl>
        </RengVerMas>
      )}
    </RengPanelExplicacion>
  )
}
