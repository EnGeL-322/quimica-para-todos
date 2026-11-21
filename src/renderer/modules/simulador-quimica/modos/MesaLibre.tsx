import { useEffect, useId, useMemo, useState } from 'react'
import { RENG_NOMBRE_EVIDENCIA } from '@shared/cuaderno'
import { rengBuscarSustancias, RENG_SUSTANCIAS, type RengSustanciaCatalogo } from '../../tabla-periodica/catalogoSustancias'
import '../../tabla-periodica/peligros.css'
import { RengFichaPeligros, RengFuentesPeligro, RengSelloPeligro } from '../../tabla-periodica/Sustancias'
import { rengNivelMasAltoMesa, rengPoliticaMesa, rengPonerEnMesa, rengPredecirMesa, RENG_MAX_SUSTANCIAS_MESA, RENG_ROLES_MESA, type RengDiagnosticoMesa, type RengItemMesa, type RengResultadoMesa, type RengVerificacionDato } from '../practica/mesaLibre'
import type { RengEscena } from '../practica/modelosSimulacion'
import { rengTextoNumero } from '../practica/numeros'
import { RengAviso, RengTarjeta } from '../vista/ui'

interface RengProps {
  onVolver: () => void
  onAbrirEscena: (rengEscena: RengEscena) => void
}

const RENG_ETIQUETA_VERIFICACION: Readonly<Record<RengVerificacionDato, string>> = {
  consultada: 'Fuente consultada',
  libro: 'De libro, sin consultar',
  calculo: 'Cálculo verificado',
  ejemplo: 'Valor de ejemplo',
  usuario: 'Dato que pusiste tú'
}

const RENG_MAX_RESULTADOS_BUSQUEDA = 12

const rengPuestas = RENG_SUSTANCIAS.filter((rengS) => rengPoliticaMesa(rengS.formas).puedePonerse)

function RengDiagnosticos({ lista: rengLista }: { lista: readonly RengDiagnosticoMesa[] }): React.JSX.Element | null {
  if (rengLista.length === 0) return null
  return (
    <ul className="q-ml-diagnosticos" data-diagnosticos>
      {rengLista.map((rengD) => (
        <li key={`${rengD.codigo}-${rengD.sustanciaId ?? ''}-${rengD.texto.slice(0, 24)}`} data-codigo={rengD.codigo} data-severidad={rengD.severidad}>
          <span className={`badge ${rengD.severidad === 'error' ? 'alta' : rengD.severidad === 'aviso' ? 'media' : 'baja'}`}>{rengD.severidad === 'error' ? 'No se puede' : rengD.severidad === 'aviso' ? 'Aviso' : 'Nota'}</span> {rengD.texto}
        </li>
      ))}
    </ul>
  )
}

function RengFicha({ sustancia: rengS, onCerrar: rengOnCerrar }: { sustancia: RengSustanciaCatalogo; onCerrar: () => void }): React.JSX.Element {
  const rengPolitica = rengPoliticaMesa(rengS.formas)
  return (
    <RengTarjeta titulo={`Ficha de consulta: ${rengS.nombre}`} nota={rengS.formula}>
      <div data-ficha={rengS.id} className="stack tight">
        <div className="row">
          <RengSelloPeligro nivel={rengNivelMasAltoMesa(rengS.formas)} />
          <button type="button" className="btn sm" onClick={rengOnCerrar}>
            Cerrar la ficha
          </button>
        </div>
        {rengPolitica.puedePonerse ? (
          <p className="sm muted" data-politica="permitida">
            Se puede poner en la mesa. La clasificación contrastada del catálogo solo vale para: {rengPolitica.alcances.join('; ')}. Otras presentaciones, grados o concentraciones no están clasificadas aquí.
          </p>
        ) : (
          <p className="sm" data-politica="solo-ficha">
            <strong>Solo ficha de consulta.</strong> {rengPolitica.explicacion}
          </p>
        )}
        {rengS.formas.map((rengF) => (
          <section key={rengF.id} className="stack tight" aria-label={rengF.nombre}>
            <h4 className="q-ml-forma">{rengF.nombre}</h4>
            <RengFichaPeligros forma={rengF} />
            <RengFuentesPeligro forma={rengF} />
          </section>
        ))}
      </div>
    </RengTarjeta>
  )
}

function RengResultado({ resultado: rengR, desactualizado: rengDesactualizado, onAbrirEscena: rengOnAbrirEscena }: { resultado: RengResultadoMesa; desactualizado: boolean; onAbrirEscena: (rengE: RengEscena) => void }): React.JSX.Element {
  return (
    <div className="q-salida q-ml-resultado" data-resultado={rengR.tipo} {...(rengDesactualizado ? { 'data-desactualizado': '' } : {})}>
      {rengDesactualizado && (
        <RengAviso tipo="aviso">
          <span data-aviso-anterior>Resultado de la mesa anterior: cambiaste algo. Pulsa «Mezclar y predecir» para actualizarlo.</span>
        </RengAviso>
      )}
      {rengR.tipo === 'incompleta' && <RengAviso tipo="info">{rengR.diagnosticos.map((rengD) => rengD.texto).join(' ')}</RengAviso>}
      {(rengR.tipo === 'rechazada' || rengR.tipo === 'entrada-invalida') && (
        <RengTarjeta titulo={rengR.tipo === 'rechazada' ? 'La mesa no puede hacer esta mezcla' : 'Revisa las cantidades'}>
          <RengDiagnosticos lista={rengR.diagnosticos} />
        </RengTarjeta>
      )}
      {rengR.tipo === 'sin-modelo' && (
        <RengTarjeta titulo="Sin modelo para esta mezcla">
          <p className="q-ml-sin-modelo" data-sin-modelo>
            {rengR.mensaje}
          </p>
          <p className="sm muted" data-por-que>
            {rengR.porQue}
          </p>
        </RengTarjeta>
      )}
      {rengR.tipo === 'prediccion' && (
        <>
          <RengTarjeta titulo={rengR.titulo} nota={rengR.descripcion} acento>
            <span className="badge">Resultado calculado</span>
            <table className="q-ml-tabla" data-resultados>
              <caption className="sr-only">Resultados de la predicción</caption>
              <tbody>
                {rengR.resultados.map((rengL) => (
                  <tr key={rengL.clave} data-clave={rengL.clave}>
                    <th scope="row">{rengL.etiqueta}</th>
                    <td data-valor>
                      {rengTextoNumero(rengL.valor, 4)} {rengL.unidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rengR.escena === 'solubilidad' && (
              <p className="sm" data-estado={rengR.estado}>
                {rengR.estado === 'todo-disuelto' ? 'Todo el sólido se disuelve: la disolución queda sin saturar.' : 'Se disuelve hasta la solubilidad (disolución saturada) y el resto queda como sólido.'}
              </p>
            )}
            <RengDiagnosticos lista={rengR.diagnosticos} />
          </RengTarjeta>
          <RengTarjeta titulo="Qué escena y qué datos la respaldan">
            <div className="stack tight" data-respaldo={rengR.respaldo.escena}>
              <p className="sm">
                Escena: <strong>{rengR.respaldo.nombreEscena}</strong> · <span className="badge">{RENG_NOMBRE_EVIDENCIA[rengR.respaldo.evidencia]}</span>{' '}
                <button type="button" className="btn sm" onClick={() => rengOnAbrirEscena(rengR.respaldo.escena)}>
                  Abrir la escena
                </button>
              </p>
              <p className="sm muted" data-verificacion-modelo>
                {rengR.respaldo.verificacionModelo}
              </p>
              <ul className="q-ml-datos">
                {rengR.respaldo.datos.map((rengD) => (
                  <li key={rengD.nombre} data-verificacion={rengD.verificacion} data-sin-verificar={rengD.sinVerificar ? '' : undefined}>
                    <strong>{rengD.nombre}</strong>: {rengD.valor}
                    <br />
                    <span className={`badge ${rengD.sinVerificar ? 'media' : 'ok'}`}>{RENG_ETIQUETA_VERIFICACION[rengD.verificacion]}</span>
                    {rengD.sinVerificar && <span className="badge media">Sin verificar</span>} <span className="sm muted">{rengD.fuente}</span>
                  </li>
                ))}
              </ul>
              <details>
                <summary>Límites del modelo</summary>
                <ul>
                  {rengR.respaldo.limites.map((rengL) => (
                    <li key={rengL}>{rengL}</li>
                  ))}
                </ul>
              </details>
            </div>
          </RengTarjeta>
        </>
      )}
    </div>
  )
}

export default function RengMesaLibre({ onVolver: rengOnVolver, onAbrirEscena: rengOnAbrirEscena }: RengProps): React.JSX.Element {
  const rengId = useId()
  const [rengItems, rengSetItems] = useState<RengItemMesa[]>([])
  const [rengConsulta, rengSetConsulta] = useState('')
  const [rengFichaId, rengSetFichaId] = useState<string | null>(null)
  const [rengAviso, rengSetAviso] = useState<RengDiagnosticoMesa | null>(null)
  const [rengResultado, rengSetResultado] = useState<{ clave: string; r: RengResultadoMesa } | null>(null)
  const rengClave = JSON.stringify(rengItems)
  useEffect(() => {
    if (rengResultado) document.querySelector('[data-mesa-libre] .q-ml-resultado')?.scrollIntoView({ block: 'nearest' })
  }, [rengResultado])
  useEffect(() => {
    if (rengFichaId) document.querySelector('[data-mesa-libre] [data-ficha]')?.scrollIntoView({ block: 'nearest' })
  }, [rengFichaId])
  const rengBusqueda = rengConsulta.trim()
  const rengEncontradas = useMemo(() => (rengBusqueda ? rengBuscarSustancias(rengBusqueda) : rengPuestas), [rengBusqueda])
  const rengVisibles = rengEncontradas.slice(0, RENG_MAX_RESULTADOS_BUSQUEDA)
  const rengFicha = rengFichaId ? (RENG_SUSTANCIAS.find((rengS) => rengS.id === rengFichaId) ?? null) : null
  const rengNombreDe = (rengIdS: string): RengSustanciaCatalogo | undefined => RENG_SUSTANCIAS.find((rengS) => rengS.id === rengIdS)

  const rengPoner = (rengIdS: string): void => {
    const rengR = rengPonerEnMesa(rengItems, rengIdS)
    if (rengR.ok) {
      rengSetItems(rengR.items)
      rengSetAviso(null)
    } else rengSetAviso(rengR.diagnostico)
  }
  const rengCambiar = (rengIdS: string, rengCampo: 'cantidad' | 'concentracion', rengValor: string): void => rengSetItems((rengAntes) => rengAntes.map((rengI) => (rengI.sustanciaId === rengIdS ? { ...rengI, [rengCampo]: rengValor } : rengI)))
  const rengQuitar = (rengIdS: string): void => {
    rengSetItems((rengAntes) => rengAntes.filter((rengI) => rengI.sustanciaId !== rengIdS))
    rengSetAviso(null)
  }

  return (
    <div className="q-ml" data-mesa-libre>
      <header className="q-barra">
        <button type="button" className="btn sm" onClick={rengOnVolver}>
          ← Volver a fenómenos
        </button>
        <div className="q-barra-titulo">
          <h2>Mesa libre</h2>
          <span className="faint sm">Combina sustancias; solo se predice lo que tiene una escena validada</span>
        </div>
      </header>
      <div className="q-guia">
        <p className="sm muted">
          <strong>Prueba esto:</strong> pon en la mesa una disolución (por ejemplo, cloruro de sodio) y agua, escribe los volúmenes con su unidad y pulsa «Mezclar y predecir». Cualquier otra mezcla responde «No hay datos o modelo para predecir esta mezcla». Las sustancias con clasificación de peligro, con peligros documentados o sin ficha en el catálogo solo se consultan: nunca se ponen en la mesa.
        </p>
      </div>

      <div className="q-ml-fila">
        <RengTarjeta titulo="Sustancias" nota={rengBusqueda ? `${rengEncontradas.length} encontradas` : `${rengPuestas.length} se pueden poner`}>
          <label className="sim-campo">
            <span>Buscar una sustancia</span>
            <input className="input" type="search" autoComplete="off" value={rengConsulta} onChange={(rengE) => rengSetConsulta(rengE.target.value)} placeholder="nombre, fórmula o CAS" aria-describedby={`${rengId}-ayuda`} />
          </label>
          <p id={`${rengId}-ayuda`} className="sm faint">
            {rengBusqueda ? 'Resultados de todo el catálogo: las peligrosas solo muestran su ficha.' : 'Estas son las que se pueden poner. Busca para consultar cualquier otra: solo verás su ficha.'}
          </p>
          <ul className="q-ml-lista" data-sustancias>
            {rengVisibles.map((rengS) => {
              const rengPolitica = rengPoliticaMesa(rengS.formas)
              return (
                <li key={rengS.id} data-sustancia={rengS.id} data-puede={rengPolitica.puedePonerse ? 'si' : 'no'}>
                  <span className="q-ml-nombre">
                    <b>{rengS.nombre}</b> <span className="mono faint">{rengS.formula}</span>
                  </span>
                  <RengSelloPeligro nivel={rengNivelMasAltoMesa(rengS.formas)} compacto />
                  <span className="q-ml-acciones">
                    {rengPolitica.puedePonerse && (
                      <button type="button" className="btn sm primary" aria-label={`Poner ${rengS.nombre} en la mesa`} onClick={() => rengPoner(rengS.id)}>
                        Poner en la mesa
                      </button>
                    )}
                    <button type="button" className="btn sm" aria-label={`Ver la ficha de ${rengS.nombre}`} onClick={() => rengSetFichaId(rengS.id)}>
                      {rengPolitica.puedePonerse ? 'Ficha' : 'Ver ficha'}
                    </button>
                  </span>
                </li>
              )
            })}
          </ul>
          {rengEncontradas.length > rengVisibles.length && <p className="sm faint">Se muestran {rengVisibles.length} de {rengEncontradas.length}: escribe más para acotar.</p>}
          {rengEncontradas.length === 0 && <p className="sm muted">Ninguna sustancia del catálogo coincide.</p>}
        </RengTarjeta>

        <RengTarjeta titulo="Mesa" nota={`${rengItems.length} de ${RENG_MAX_SUSTANCIAS_MESA}`} acento>
          {rengAviso && <RengAviso tipo="error">{rengAviso.texto}</RengAviso>}
          {rengItems.length === 0 && <p className="sm muted">La mesa está vacía. Pon al menos dos sustancias.</p>}
          <ul className="q-ml-mesa" data-mesa>
            {rengItems.map((rengI) => {
              const rengS = rengNombreDe(rengI.sustanciaId)
              const rengRol = RENG_ROLES_MESA[rengI.sustanciaId]
              const rengNombre = rengS?.nombre ?? rengI.sustanciaId
              return (
                <li key={rengI.sustanciaId} data-item={rengI.sustanciaId}>
                  <div className="row">
                    <b>{rengNombre}</b> <span className="mono faint">{rengS?.formula}</span>
                    <button type="button" className="btn sm" aria-label={`Quitar ${rengNombre} de la mesa`} onClick={() => rengQuitar(rengI.sustanciaId)}>
                      Quitar
                    </button>
                  </div>
                  {rengRol?.rol === 'solucion' && (
                    <>
                      <label className="sim-campo">
                        <span>{`Volumen de ${rengNombre}`}</span>
                        <input className="input" type="text" autoComplete="off" spellCheck={false} placeholder="25 mL" value={rengI.cantidad} onChange={(rengE) => rengCambiar(rengI.sustanciaId, 'cantidad', rengE.target.value)} />
                      </label>
                      <label className="sim-campo">
                        <span>{`Concentración de ${rengNombre}`}</span>
                        <input className="input" type="text" autoComplete="off" spellCheck={false} placeholder="0,2 mol/L" value={rengI.concentracion ?? ''} onChange={(rengE) => rengCambiar(rengI.sustanciaId, 'concentracion', rengE.target.value)} />
                      </label>
                    </>
                  )}
                  {rengRol?.rol === 'disolvente' && (
                    <label className="sim-campo">
                      <span>Volumen de agua</span>
                      <input className="input" type="text" autoComplete="off" spellCheck={false} placeholder="75 mL" value={rengI.cantidad} onChange={(rengE) => rengCambiar(rengI.sustanciaId, 'cantidad', rengE.target.value)} />
                    </label>
                  )}
                  {rengRol?.rol === 'sal' && (
                    <label className="sim-campo">
                      <span>{`Cantidad de ${rengNombre} (masa o moles)`}</span>
                      <input className="input" type="text" autoComplete="off" spellCheck={false} placeholder="0,10 g" value={rengI.cantidad} onChange={(rengE) => rengCambiar(rengI.sustanciaId, 'cantidad', rengE.target.value)} />
                    </label>
                  )}
                  {!rengRol && <p className="sm muted">Ninguna escena validada incluye esta sustancia: con ella la mesa solo puede responder que no hay modelo.</p>}
                </li>
              )
            })}
          </ul>
          <div className="row">
            <button type="button" className="btn primary" disabled={rengItems.length === 0} onClick={() => rengSetResultado({ clave: rengClave, r: rengPredecirMesa(rengItems) })}>
              Mezclar y predecir
            </button>
            <button
              type="button"
              className="btn"
              disabled={rengItems.length === 0}
              onClick={() => {
                rengSetItems([])
                rengSetAviso(null)
                rengSetResultado(null)
              }}
            >
              Vaciar la mesa
            </button>
          </div>
        </RengTarjeta>
      </div>

      <div aria-live="polite" data-ml-vivo>
        {rengResultado && <RengResultado resultado={rengResultado.r} desactualizado={rengResultado.clave !== rengClave} onAbrirEscena={rengOnAbrirEscena} />}
      </div>
      {rengFicha && <RengFicha sustancia={rengFicha} onCerrar={() => rengSetFichaId(null)} />}
    </div>
  )
}
