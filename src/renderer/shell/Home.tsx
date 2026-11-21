import { useMemo } from 'react'
import { RENG_PRODUCTO } from '@shared/producto'
import { RENG_MODULES } from '@/registry'
import { RENG_INICIO } from '@/inicio'
import { RengIcon } from './Icon'
import { RengMarcaGrande } from './Marca'
import { rengDatoDelDia } from './facts'
import { rengBorrarTrabajoReciente, useRengTrabajoReciente } from './navegacion'
import { rengHaceCuanto } from './nucleo/recientes'

export function RengHome({ onOpen: rengOnOpen }: { onOpen: (rengId: string, rengSub?: string | null) => void }): React.JSX.Element {
  const rengDato = rengDatoDelDia()
  const rengRecientes = useRengTrabajoReciente()
  const rengAhora = Date.now()
  const rengSecundarias = useMemo(() => RENG_MODULES.filter((rengM) => !rengM.manifest.principal), [])
  const rengNumExperimentos = useMemo(() => RENG_MODULES.find((rengM) => rengM.manifest.id === 'simulador-fisica')?.accesos?.filter((rengA) => rengA.sub !== 'ejercicios').length ?? 0, [])

  return (
    <div className="inicio">
      <section className="hero" aria-labelledby="inicio-titulo">
        <RengMarcaGrande />
        <span className="badge ok">
          <RengIcon name="dot" size={8} /> 100 % sin conexión
        </span>
        <h2 id="inicio-titulo">{RENG_PRODUCTO.nombre}</h2>
        <p>
          <em>{RENG_PRODUCTO.lema}.</em> {RENG_INICIO.intro}
        </p>

        <h3 className="inicio-subtitulo" id="inicio-empezar">
          {RENG_INICIO.titulo}
        </h3>
        <div className="inicio-disciplinas" role="group" aria-labelledby="inicio-empezar">
          {RENG_INICIO.tarjetas.map((rengT) => (
            <div key={`${rengT.modulo}/${rengT.sub ?? ''}`} className="disciplina-tarjeta" data-disciplina={rengT.disciplina}>
              <button type="button" className="disciplina-principal" onClick={() => rengOnOpen(rengT.modulo, rengT.sub)}>
                <span className="disciplina-ico" aria-hidden="true">
                  <RengIcon name={rengT.icono} size={22} />
                </span>
                <span className="disciplina-texto">
                  <b>
                    {rengT.titulo}
                    {rengT.contarExperimentos && rengNumExperimentos > 0 && <span className="faint sm"> · {rengNumExperimentos} experimentos</span>}
                  </b>
                  <span className="muted sm">{rengT.texto}</span>
                </span>
                <span className="disciplina-ir" aria-hidden="true">
                  →
                </span>
              </button>
              <div className="disciplina-atajos" role="group" aria-label={`Empezar directamente en ${rengT.titulo}`}>
                {rengT.atajos.map((rengX) => (
                  <button key={`${rengX.modulo}/${rengX.sub ?? ''}`} type="button" className="chip-inicio" onClick={() => rengOnOpen(rengX.modulo, rengX.sub)}>
                    {rengX.nombre}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="row inicio-acciones">
          {RENG_INICIO.cuaderno && (
            <button type="button" className="btn" onClick={() => RENG_INICIO.cuaderno && rengOnOpen(RENG_INICIO.cuaderno.modulo, RENG_INICIO.cuaderno.sub)}>
              <RengIcon name="notebook" /> {RENG_INICIO.cuaderno.nombre}
            </button>
          )}
          <span className="faint sm">
            <span className="kbd">Ctrl</span> + <span className="kbd">K</span> busca cualquier experimento o herramienta
          </span>
        </div>
      </section>

      <div className="inicio-columnas">
        <section className="card inicio-reanudar" aria-labelledby="inicio-reanudar">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3 id="inicio-reanudar">
              <RengIcon name="clock" /> Reanudar
            </h3>
            {rengRecientes.length > 0 && (
              <button type="button" className="btn ghost sm" onClick={rengBorrarTrabajoReciente}>
                Vaciar lista
              </button>
            )}
          </div>
          {rengRecientes.length === 0 ? (
            <p className="muted sm">{RENG_INICIO.vacioReanudar}</p>
          ) : (
            <ul className="lista-recientes">
              {rengRecientes.map((rengR) => (
                <li key={`${rengR.id}/${rengR.sub ?? ''}`}>
                  <button type="button" className="reciente" onClick={() => rengOnOpen(rengR.id, rengR.sub)} data-disciplina={RENG_MODULES.find((rengM) => rengM.manifest.id === rengR.id)?.manifest.categoria}>
                    <span className="reciente-titulo">{rengR.titulo}</span>
                    <span className="faint sm">
                      {rengR.contexto} · {rengHaceCuanto(rengR.fecha, rengAhora)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {rengSecundarias.length > 0 && (
          <section className="card inicio-herramientas" aria-labelledby="inicio-herramientas">
            <h3 id="inicio-herramientas">Herramientas</h3>
            <ul className="lista-herramientas">
              {rengSecundarias.map((rengM) => (
                <li key={rengM.manifest.id}>
                  <button type="button" className="herramienta" onClick={() => rengOnOpen(rengM.manifest.id)}>
                    <RengIcon name={rengM.manifest.icono} />
                    <span>
                      <b>{rengM.manifest.nombre}</b>
                      <span className="faint sm">{rengM.manifest.descripcion}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <section className="card fact" aria-label="Dato científico del día">
        <span className="badge">{rengDato.area}</span> <strong>Dato del día.</strong> <span className="muted">{rengDato.texto}</span>
      </section>
    </div>
  )
}
