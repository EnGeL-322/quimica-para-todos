import '../aprender/n1/n1.css'
import { RENG_CAPITULOS_N1, RENG_LECCIONES_N1 } from '../aprender/n1/registro'
import { RENG_GRUPOS_INTEGRADORES_N1, RENG_GRUPOS_PRACTICAS_N1 } from '../practicas-n1/registro'
import { RENG_TEMARIO_GENERADO } from '../temario/datos.generado'

interface RengProps {
  modo: 'aprender' | 'practicas'
  onAbrir: (rengId: string) => void
}

const rengTituloBloque = (rengNumero: number): string => RENG_TEMARIO_GENERADO.niveles.flatMap((rengN) => rengN.bloques).find((rengB) => rengB.numero === rengNumero)?.titulo ?? `Bloque ${rengNumero}`

export function RengIndiceN1({ modo: rengModo, onAbrir: rengOnAbrir }: RengProps): React.JSX.Element | null {
  const rengEntradas =
    rengModo === 'aprender'
      ? [
          ...RENG_CAPITULOS_N1.map((rengC) => ({ id: rengC.id, bloque: rengC.bloque, posicion: 0, texto: 'Portada y cierre del capítulo', ayuda: `Abrir la portada y el cierre del capítulo «${rengC.titulo}»` })),
          ...RENG_LECCIONES_N1.map((rengL) => ({ id: rengL.id, bloque: rengL.bloque, posicion: rengL.posicion, texto: `${rengL.posicion}. ${rengL.nombre}`, ayuda: `Abrir la lección por capas «${rengL.nombre}»` }))
        ]
      : [
          ...RENG_GRUPOS_PRACTICAS_N1.map((rengG) => ({ id: rengG.subtema, bloque: rengG.bloque, posicion: rengG.posicion, texto: `${rengG.posicion}. ${rengG.titulo} · ${rengG.practicas.length} prácticas`, ayuda: `Abrir las prácticas de «${rengG.titulo}»` })),
          ...RENG_GRUPOS_INTEGRADORES_N1.map((rengG) => ({ id: rengG.subtema, bloque: rengG.bloque, posicion: 99, texto: `Problemas integradores del capítulo · ${rengG.practicas.length}`, ayuda: 'Abrir los problemas que combinan varios subtemas del capítulo' }))
        ]
  if (rengEntradas.length === 0) return null
  const rengBloques = [...new Set(rengEntradas.map((rengE) => rengE.bloque))].sort((rengA, rengB) => rengA - rengB)
  return (
    <section className="q-n1-indice" aria-labelledby={`q-n1-indice-${rengModo}`} data-indice-n1={rengModo}>
      <h3 id={`q-n1-indice-${rengModo}`}>{rengModo === 'aprender' ? 'Nivel 1 del temario · lecciones por subtema' : 'Prácticas de Nivel 1 · por subtema'}</h3>
      <p className="muted sm">
        {rengModo === 'aprender'
          ? 'Cada capítulo tiene portada y cierre; cada lección explica por qué importa, desarrolla el tema con ecuaciones y figuras, resuelve dos ejemplos, propone preguntas para comprobar y, si hay un recurso real, una simulación para explorar.'
          : 'Tres prácticas por subtema (básica, intermedia y avanzada) y problemas integradores por capítulo, con datos que cambian en cada variante y corrección de errores típicos y de unidades.'}
      </p>
      {rengBloques.map((rengB) => (
        <div key={rengB} className="stack tight" data-bloque-n1={rengB}>
          <h4>
            Bloque {rengB} · {rengTituloBloque(rengB)}
          </h4>
          <ol>
            {rengEntradas
              .filter((rengE) => rengE.bloque === rengB)
              .sort((rengX, rengY) => rengX.posicion - rengY.posicion)
              .map((rengE) => (
                <li key={rengE.id}>
                  <button type="button" className="btn sm" title={rengE.ayuda} data-abrir-n1={rengE.id} onClick={() => rengOnAbrir(rengE.id)}>
                    {rengE.texto}
                  </button>
                </li>
              ))}
          </ol>
        </div>
      ))}
    </section>
  )
}
