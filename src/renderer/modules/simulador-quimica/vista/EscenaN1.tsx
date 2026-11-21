import { useEffect, useMemo, useRef, useState } from 'react'
import { rengAjustarValorN1, rengFormatoLecturaN1, rengLeerEscenaN1, rengTiempoSiguienteN1, rengValoresDeCasoN1, rengValoresInicialesN1 } from '../escenas-n1/kit'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../escenas-n1/tipos'
import { RENG_NOMBRE_VERIFICACION } from '../temario/verificacion'
import { RengEjesFigura } from './figuras/Figuras'
import { RengEcuacionTex } from './tex/EcuacionTex'
import './escena-n1.css'

interface RengProps {
  modelo: RengModeloEscenaN1
  numeroFigura?: string
  valores?: Readonly<Record<string, number>>
}

const rengUnidad = (rengU: string): string => (rengU === 'sin unidad' ? '' : ` ${rengU}`)

export function RengEscenaN1({ modelo: rengM, numeroFigura: rengNumeroFigura = '1', valores: rengPropuestos }: RengProps): React.JSX.Element {
  const rengIniciales = (): RengValoresEscenaN1 => (rengPropuestos ? rengValoresDeCasoN1(rengM, rengValoresInicialesN1(rengM), { nombre: 'propuesta', valores: rengPropuestos }) : rengValoresInicialesN1(rengM))
  const [rengValores, rengSetValores] = useState<RengValoresEscenaN1>(rengIniciales)
  const [rengT, rengSetT] = useState(0)
  const [rengCorriendo, rengSetCorriendo] = useState(false)
  const [rengCopiado, rengSetCopiado] = useState(false)
  const rengUltimo = useRef<number | null>(null)

  useEffect(() => {
    rengSetValores(rengIniciales())
    rengSetT(0)
    rengSetCorriendo(false)
  }, [rengM, rengPropuestos])

  useEffect(() => {
    if (!rengCorriendo || !rengM.tiempo) return
    let rengCuadro = 0
    rengUltimo.current = null
    const rengPaso = (rengAhora: number): void => {
      const rengDt = rengUltimo.current === null ? 0 : (rengAhora - rengUltimo.current) / 1000
      rengUltimo.current = rengAhora
      rengSetT((rengActual) => {
        const rengNuevo = rengTiempoSiguienteN1(rengM, rengActual, rengDt)
        if (rengNuevo >= rengM.tiempo!.final) rengSetCorriendo(false)
        return rengNuevo
      })
      rengCuadro = requestAnimationFrame(rengPaso)
    }
    rengCuadro = requestAnimationFrame(rengPaso)
    return () => cancelAnimationFrame(rengCuadro)
  }, [rengCorriendo, rengM])

  const rengLectura = useMemo(() => rengLeerEscenaN1(rengM, rengValores, rengT), [rengM, rengValores, rengT])
  const rengMapa = useMemo(() => Object.fromEntries(rengLectura.lecturas.map((rengL) => [rengL.clave, rengL.valor])), [rengLectura])
  const rengCasos = useMemo(() => rengM.casos.map((rengC) => ({ nombre: rengC.nombre, lectura: rengLeerEscenaN1(rengM, rengValoresDeCasoN1(rengM, rengValores, rengC), rengT) })), [rengM, rengValores, rengT])

  const rengCambiar = (rengClave: string, rengBruto: number): void => {
    rengSetValores((rengV) => ({ ...rengV, [rengClave]: rengAjustarValorN1(rengM, rengClave, rengBruto, rengV[rengClave] ?? Number.NaN) }))
  }
  const rengReiniciar = (): void => {
    rengSetCorriendo(false)
    rengSetT(0)
  }
  const rengCopiar = (): void => {
    void navigator.clipboard
      ?.writeText(rengLectura.palabras)
      .then(() => rengSetCopiado(true))
      .catch(() => rengSetCopiado(false))
  }

  let rengGrafica: React.JSX.Element | null = null
  if (rengM.grafica && rengLectura.problemas.length === 0) {
    const rengG = rengM.grafica
    const rengCurvas = [...rengG.curvas(rengValores)]
    if (rengG.cursor) rengCurvas.push({ nombre: 'Estado actual', puntos: [rengG.cursor(rengValores, rengT, rengMapa)] })
    const [rengX0, rengX1] = rengG.ejeX(rengValores)
    const [rengY0, rengY1] = rengG.ejeY(rengValores)
    rengGrafica = (
      <RengEjesFigura
        numero={rengNumeroFigura}
        titulo={`${rengM.nombre}: gráfica`}
        pie={`${rengG.tituloY} frente a ${rengG.tituloX}, calculado por el modelo con los valores actuales.`}
        alternativo={rengLectura.palabras}
        x={{ min: rengX0, max: rengX1, titulo: rengG.tituloX }}
        y={{ min: rengY0, max: rengY1, titulo: rengG.tituloY }}
        series={rengCurvas}
      />
    )
  }

  return (
    <section className="q-escena-n1" data-escena-n1={rengM.id} aria-labelledby={`escena-${rengM.id}-titulo`}>
      <header>
        <h3 id={`escena-${rengM.id}-titulo`}>{rengM.nombre}</h3>
        <p className="muted">{rengM.pregunta}</p>
        <p className="sm">Modelo idealizado: calcula lo que dice el modelo descrito abajo, no reproduce exactamente un experimento real.</p>
      </header>

      <div className="q-escena-n1-cuerpo">
        <form className="q-escena-n1-controles" onSubmit={(rengE) => rengE.preventDefault()} aria-label="Parámetros del modelo">
          {rengM.parametros.map((rengP) => {
            const rengId = `escena-${rengM.id}-${rengP.clave}`
            const rengValor = rengValores[rengP.clave] ?? rengP.inicial
            return (
              <div key={rengP.clave} className="q-escena-n1-control" data-parametro={rengP.clave}>
                <label htmlFor={rengId}>
                  {rengP.etiqueta}
                  {rengP.unidad !== 'sin unidad' && <span className="muted"> ({rengP.unidad})</span>}
                </label>
                <div className="row">
                  <input id={rengId} type="range" min={rengP.min} max={rengP.max} step={rengP.paso} value={rengValor} onChange={(rengE) => rengCambiar(rengP.clave, Number(rengE.target.value))} />
                  <input type="number" aria-label={`${rengP.etiqueta} en ${rengP.unidad}`} min={rengP.min} max={rengP.max} step={rengP.paso} value={rengValor} onChange={(rengE) => rengCambiar(rengP.clave, rengE.target.valueAsNumber)} />
                </div>
              </div>
            )
          })}
          <div className="row">
            {rengM.tiempo && (
              <button type="button" className="btn primary sm" data-accion="iniciar" onClick={() => (rengT >= rengM.tiempo!.final ? (rengSetT(0), rengSetCorriendo(true)) : rengSetCorriendo((rengC) => !rengC))}>
                {rengCorriendo ? 'Pausar' : rengT > 0 && rengT < rengM.tiempo.final ? 'Continuar' : 'Iniciar'}
              </button>
            )}
            <button type="button" className="btn sm" data-accion="reiniciar" onClick={rengReiniciar}>
              Reiniciar (t = 0)
            </button>
            <button type="button" className="btn sm" data-accion="valores-iniciales" onClick={() => rengSetValores(rengIniciales())}>
              Valores iniciales
            </button>
          </div>
        </form>

        <div className="q-escena-n1-lecturas">
          <h4>Lecturas</h4>
          {rengLectura.problemas.length > 0 && (
            <div className="notice warn" role="alert" data-escena-problema>
              El modelo no pudo dar una lectura válida: {rengLectura.problemas.join('; ')}.
            </div>
          )}
          <dl data-lecturas>
            {rengLectura.lecturas.map((rengL) => (
              <div key={rengL.clave} data-magnitud={rengL.clave}>
                <dt>{rengL.etiqueta}</dt>
                <dd>
                  {rengFormatoLecturaN1(rengL.valor, rengL.cifras)}
                  {rengUnidad(rengL.unidad)}
                </dd>
              </div>
            ))}
            <div data-magnitud="en-palabras" className="q-escena-n1-palabras">
              <dt>En palabras</dt>
              <dd>
                <output data-en-palabras aria-live="polite">
                  {rengLectura.palabras}
                </output>
                <button type="button" className="btn sm" onClick={rengCopiar} disabled={rengLectura.palabras === ''}>
                  {rengCopiado ? 'Copiado' : 'Copiar el texto'}
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {rengGrafica}

      {rengCasos.length > 0 && (
        <table className="q-n1-tabla" data-casos>
          <caption>Comparación de casos en el mismo instante</caption>
          <thead>
            <tr>
              <th scope="col">Caso</th>
              {rengM.magnitudes.map((rengG) => (
                <th key={rengG.clave} scope="col">
                  {rengG.etiqueta}
                  {rengG.unidad !== 'sin unidad' && ` (${rengG.unidad})`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rengCasos.map((rengC) => (
              <tr key={rengC.nombre}>
                <th scope="row">{rengC.nombre}</th>
                {rengC.lectura.lecturas.map((rengL) => (
                  <td key={rengL.clave}>{rengFormatoLecturaN1(rengL.valor, rengL.cifras)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <details className="q-panel q-fuentes" data-ficha-escena>
        <summary>Modelo, supuestos y límites</summary>
        <p>{rengM.ficha.descripcion}</p>
        <h4>Ecuaciones del modelo</h4>
        <ul className="q-n1-ecuaciones">
          {rengM.ficha.ecuaciones.map((rengQ) => (
            <li key={rengQ.texto}>
              <RengEcuacionTex tex={rengQ.tex} texto={rengQ.texto} bloque />
            </li>
          ))}
        </ul>
        <p>
          <strong>Condiciones iniciales.</strong> {rengM.ficha.condicionesIniciales}
        </p>
        <h4>Supuestos</h4>
        <ul>
          {rengM.ficha.supuestos.map((rengS) => (
            <li key={rengS}>{rengS}</li>
          ))}
        </ul>
        <h4>Límites del modelo</h4>
        <ul>
          {rengM.ficha.limites.map((rengS) => (
            <li key={rengS}>{rengS}</li>
          ))}
        </ul>
        <h4>Procedencia</h4>
        <ul className="q-n1-procedencia">
          {rengM.ficha.procedencia.map((rengP) => (
            <li key={rengP.detalle}>
              <span className="q-n1-etiqueta">{RENG_NOMBRE_VERIFICACION[rengP.nivel]}</span>
              {rengP.detalle}
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}
