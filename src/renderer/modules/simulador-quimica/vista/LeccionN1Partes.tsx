import { useId, useState } from 'react'
import { rengTx } from '../aprender/n1/gases/constantes'
import type { RengEjemploN1, RengFiguraN1, RengPreguntaN1, RengTerminoN1 } from '../aprender/n1/tipos'
import { RengEjesFigura } from './figuras/Figuras'

export function RengEjemploResueltoN1({ ejemplo: rengE, numero: rengNumero, tipo: rengTipo }: { ejemplo: RengEjemploN1; numero: string; tipo: string }): React.JSX.Element {
  const [rengPasos, rengSetPasos] = useState(0)
  const [rengPistas, rengSetPistas] = useState(0)
  const rengResultado = rengE.analitico()
  const rengLista = rengE.pasos(rengResultado)
  const rengCompleto = rengPasos >= rengLista.length
  const rengUnidad = rengE.unidad === '' ? '' : ` ${rengE.unidad}`
  const rengId = useId()
  return (
    <article className="q-n1-ejemplo" aria-labelledby={rengId} data-ejemplo={rengE.id}>
      <h4 id={rengId}>
        Ejemplo {rengNumero} ({rengTipo}): {rengE.titulo}
      </h4>
      <p>{rengE.enunciado}</p>
      <dl className="q-datos">
        {rengE.datos.map(([rengK, rengV]) => (
          <div key={rengK}>
            <dt>{rengK}</dt>
            <dd>{rengV}</dd>
          </div>
        ))}
      </dl>
      <p>
        <strong>{rengE.pregunta}</strong>
      </p>
      {rengPistas > 0 && (
        <ol className="sm" aria-label="Pistas">
          {rengE.pistas.slice(0, rengPistas).map((rengP) => (
            <li key={rengP}>{rengP}</li>
          ))}
        </ol>
      )}
      {rengPasos > 0 && (
        <ol className="q-pasos" aria-label="Resolución paso a paso">
          {rengLista.slice(0, rengPasos).map((rengP) => (
            <li key={rengP}>{rengP}</li>
          ))}
        </ol>
      )}
      <div className="row">
        {rengPistas < 3 && !rengCompleto && (
          <button type="button" className="btn sm" onClick={() => rengSetPistas((rengN) => Math.min(3, rengN + 1))}>
            Ver una pista ({rengPistas + 1} de 3)
          </button>
        )}
        {!rengCompleto && (
          <>
            <button type="button" className="btn primary sm" onClick={() => rengSetPasos((rengN) => rengN + 1)}>
              Mostrar el paso {rengPasos + 1} de {rengLista.length}
            </button>
            <button type="button" className="btn sm" onClick={() => rengSetPasos(rengLista.length)}>
              Mostrar toda la resolución
            </button>
          </>
        )}
      </div>
      {rengCompleto && (
        <div className="notice ok" role="status" data-resultado-ejemplo>
          <strong>Resultado.</strong> {rengTx(rengResultado, rengE.cifras)}
          {rengUnidad}. <span className="sm">Las pruebas del proyecto lo comprueban por otro camino: {rengE.metodoSegundo}.</span>
        </div>
      )}
    </article>
  )
}

export function RengComprobarN1({ preguntas: rengPreguntas, prefijo: rengPrefijo }: { preguntas: readonly RengPreguntaN1[]; prefijo: string }): React.JSX.Element {
  const [rengElegidas, rengSetElegidas] = useState<Record<number, number>>({})
  const [rengCorregidas, rengSetCorregidas] = useState<Record<number, boolean>>({})
  return (
    <ol className="q-n1-comprobar">
      {rengPreguntas.map((rengQ, rengI) => {
        const rengNombre = `${rengPrefijo}-p${rengI}`
        const rengElegida = rengElegidas[rengI]
        const rengOpcion = rengElegida === undefined ? undefined : rengQ.opciones[rengElegida]
        const rengVista = rengCorregidas[rengI] === true && rengOpcion !== undefined
        return (
          <li key={rengQ.pregunta} data-pregunta={rengI}>
            <fieldset>
              <legend>{rengQ.pregunta}</legend>
              {rengQ.opciones.map((rengO, rengJ) => (
                <label key={rengO.texto} className="q-n1-opcion">
                  <input
                    type="radio"
                    name={rengNombre}
                    checked={rengElegida === rengJ}
                    onChange={() => {
                      rengSetElegidas((rengA) => ({ ...rengA, [rengI]: rengJ }))
                      rengSetCorregidas((rengA) => ({ ...rengA, [rengI]: false }))
                    }}
                  />
                  <span>{rengO.texto}</span>
                </label>
              ))}
              <div className="row">
                <button type="button" className="btn sm" disabled={rengElegida === undefined} onClick={() => rengSetCorregidas((rengA) => ({ ...rengA, [rengI]: true }))}>
                  Comprobar la respuesta
                </button>
              </div>
              <div aria-live="polite" data-retro={rengVista ? (rengOpcion!.correcta ? 'correcta' : 'incorrecta') : ''}>
                {rengVista && (
                  <p className={rengOpcion!.correcta ? 'notice ok' : 'notice warn'}>
                    <strong>{rengOpcion!.correcta ? 'Correcto.' : 'No es correcta.'}</strong> {rengOpcion!.retro}
                  </p>
                )}
              </div>
            </fieldset>
          </li>
        )
      })}
    </ol>
  )
}

export function RengFiguraLeccionN1({ figura: rengF, numero: rengNumero }: { figura: RengFiguraN1; numero: string }): React.JSX.Element {
  return <RengEjesFigura numero={rengNumero} titulo={rengF.titulo} pie={rengF.pie} alternativo={rengF.alternativo} x={rengF.x} y={rengF.y} series={rengF.series} />
}

export function RengGlosarioN1({ terminos: rengT }: { terminos: readonly RengTerminoN1[] }): React.JSX.Element {
  return (
    <dl className="q-n1-glosario">
      {rengT.map((rengX) => (
        <div key={rengX.termino}>
          <dt>{rengX.termino}</dt>
          <dd>{rengX.definicion}</dd>
        </div>
      ))}
    </dl>
  )
}
