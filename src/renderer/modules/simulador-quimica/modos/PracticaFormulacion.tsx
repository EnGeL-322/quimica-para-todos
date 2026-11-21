import { useEffect, useMemo, useReducer } from 'react'
import { RengEtapa } from '@/shell/ui'
import { RENG_NIVELES, type RengNivelEjercicio } from '../nucleo/ejerciciosFormulacion'
import { RENG_NOMBRE_NOMENCLATURA } from '../nucleo/nomenclatura'
import { rengAciertosDe, RENG_EJERCICIOS_POR_TANDA, rengEjerciciosDe, rengTanda, rengTandaInicial } from '../nucleo/tandaPractica'
import { RengFormula } from '../vista/Formula'

const RENG_ETIQUETA_ERROR: Record<string, string> = {
  'sin-simplificar': 'Sin simplificar',
  'numero-oxidacion': 'Número de oxidación',
  prefijo: 'Prefijo',
  'oso-ico': '-oso / -ico',
  parentesis: 'Paréntesis',
  desconocido: 'Nombre no reconocido',
  otro: 'Incorrecto',
  vacio: 'Sin respuesta'
}

export default function RengPracticaFormulacion({ dificultadSugerida: rengSugerida }: { dificultadSugerida?: RengNivelEjercicio } = {}): React.JSX.Element {
  const [rengT, rengDespachar] = useReducer(rengTanda, undefined, rengTandaInicial)
  useEffect(() => {
    if (rengSugerida) rengDespachar({ tipo: 'dificultad', dificultad: rengSugerida })
  }, [rengSugerida])
  const { dificultad: rengDificultad, semilla: rengSemilla } = rengT
  const rengEjercicios = useMemo(() => rengEjerciciosDe({ dificultad: rengDificultad, semilla: rengSemilla }), [rengDificultad, rengSemilla])
  const rengAciertos = rengAciertosDe(rengT, rengEjercicios)
  const rengComprobados = rengEjercicios.filter((rengE) => rengT.correcciones[rengE.id]).length

  return (
    <div className="stack ejq">
      <section className="card stack tight" aria-label="Paso 1: dificultad">
        <RengEtapa n={1} titulo="Elige la dificultad" />
        <div className="row">
          <div className="segmentado" role="group" aria-label="Dificultad de los ejercicios">
            {([1, 2, 3] as const).map((rengN) => (
              <button key={rengN} type="button" aria-pressed={rengT.dificultad === rengN} onClick={() => rengDespachar({ tipo: 'dificultad', dificultad: rengN })}>
                {rengN}. {RENG_NIVELES[rengN]}
              </button>
            ))}
          </div>
          <span className="spacer" />
          <button type="button" className="btn sm" onClick={() => rengDespachar({ tipo: 'nuevos' })}>
            Nuevos ejercicios
          </button>
        </div>
        <span className="faint sm">Cada tanda tiene {RENG_EJERCICIOS_POR_TANDA} ejercicios. Cambiar la dificultad o pedir nuevos ejercicios empieza otra tanda.</span>
      </section>

      <div className="row ejq-marcador">
        <RengEtapa n={2} titulo="Lee qué se pide, escribe tu respuesta y compruébala" />
        <span className="spacer" />
        <span className="ejq-aciertos" role="status" aria-live="polite">
          Aciertos: <b>{rengAciertos}</b> / {rengEjercicios.length}
          <span className="faint sm"> · {rengComprobados} comprobados</span>
        </span>
      </div>

      {rengEjercicios.map((rengE, rengI) => {
        const rengC = rengT.correcciones[rengE.id]
        const rengIdCampo = `ejq-${rengE.id}`
        return (
          <section key={rengE.id} className={`card stack ${rengC ? (rengC.correcta ? 'ejercicio-ok' : 'ejercicio-mal') : ''}`} style={{ gap: 8 }} aria-label={`Ejercicio ${rengI + 1}`}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <label className="sm" htmlFor={rengIdCampo}>
                <b>
                  {rengI + 1}. {rengE.tipo === 'formular' ? `Formula (nombre ${rengE.nomenclatura === 'stock' ? 'de Stock' : RENG_NOMBRE_NOMENCLATURA[rengE.nomenclatura!].toLowerCase()}):` : 'Nombra:'}
                </b>
              </label>
              {rengC && !rengC.correcta && rengC.error && <span className="badge">{RENG_ETIQUETA_ERROR[rengC.error]}</span>}
            </div>
            <div className="formula media">{rengE.tipo === 'formular' ? rengE.enunciado : <RengFormula texto={rengE.enunciado} tamano="media" />}</div>
            <form
              className="row"
              onSubmit={(rengEv) => {
                rengEv.preventDefault()
                rengDespachar({ tipo: 'comprobar', ejercicio: rengE })
              }}
            >
              <input
                id={rengIdCampo}
                className="input mono"
                style={{ flex: 1, minWidth: 200 }}
                aria-label={`Respuesta del ejercicio ${rengI + 1}`}
                placeholder={rengE.tipo === 'formular' ? 'p. ej. Fe2(SO4)3' : 'p. ej. sulfato de hierro(III)'}
                value={rengT.respuestas[rengE.id] ?? ''}
                onChange={(rengEv) => rengDespachar({ tipo: 'escribir', id: rengE.id, texto: rengEv.target.value })}
                spellCheck={false}
                autoComplete="off"
              />
              <button className="btn primary" type="submit">
                Comprobar
              </button>
            </form>
            {rengC && (
              <div className={`notice ${rengC.correcta ? 'ok' : 'warn'}`} role="status">
                <div>{rengC.mensaje}</div>
                {!rengC.correcta && <div className="faint sm">Corrige tu respuesta y vuelve a comprobarla, o consulta la solución.</div>}
                {!rengC.correcta && rengC.soluciones.length > 0 && (
                  <details className="sm" style={{ marginTop: 4 }}>
                    <summary>Ver solución</summary>
                    {rengE.tipo === 'formular' ? <RengFormula texto={rengC.soluciones[0]!} tamano="media" /> : rengC.soluciones.map((rengS) => <div key={rengS}>{rengS}</div>)}
                  </details>
                )}
              </div>
            )}
          </section>
        )
      })}
      <p className="faint sm">Las respuestas correctas se calculan con las reglas de nomenclatura de la app; se aceptan sin tildes ni mayúsculas y en cualquiera de las tres nomenclaturas.</p>
    </div>
  )
}
