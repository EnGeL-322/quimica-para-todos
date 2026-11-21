import { useMemo, useState } from 'react'
import { RengNotice } from '../../../shell/ui'
import { rengAjustarEcuacion, rengAjustarIonElectron, type RengAjuste, type RengAjusteRedox } from '../nucleo/ajuste'
import { rengFmt, rengMolesDesdeMasa, rengReactivoLimitante, type RengResultadoLimitante } from '../nucleo/estequiometria'
import { RengEcuacion } from './Ecuacion'
import { RengFormula, RengFormulaSimple } from './Formula'
import { useRengMuestra } from './nivel'
import { RengPanelExplicacion, RengVerMas } from './PanelExplicacion'
import { RengTresZonas } from './TresZonas'

const RENG_EJEMPLOS = [
  '2H2(g) + O2(g) -> 2H2O(l)',
  'CH4(g) + O2(g) -> CO2(g) + H2O(l)',
  'N2(g) + H2(g) <=>[Fe|450 °C, 200 atm] NH3(g)',
  'Zn(s) + CuSO4(aq) -> ZnSO4(aq) + Cu(s)',
  'KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O'
]

type RengMetodo = 'algebraico' | 'acido' | 'basico'

function rengIntentar<RengT>(rengFn: () => RengT): { ok: RengT } | { error: string } {
  try {
    return { ok: rengFn() }
  } catch (rengE) {
    return { error: rengE instanceof Error ? rengE.message : String(rengE) }
  }
}

function RengEstequiometria({ ajuste: rengAjuste }: { ajuste: RengAjuste }): React.JSX.Element {
  const [rengCant, rengSetCant] = useState<Record<string, { valor: string; unidad: 'g' | 'mol' }>>({})
  const rengClave = (rengI: number): string => `${rengAjuste.texto}#${rengI}`
  const rengDatos = rengAjuste.reactivos.map((_, rengI) => rengCant[rengClave(rengI)] ?? { valor: '', unidad: 'g' as const })
  const rengR = rengIntentar<RengResultadoLimitante | null>(() => {
    const rengCs = rengDatos
      .map((rengD, rengI) => ({ d: rengD, i: rengI }))
      .filter(({ d: rengD }) => rengD.valor.trim() !== '')
      .map(({ d: rengD, i: rengI }) => {
        const rengV = Number(rengD.valor.replace(',', '.'))
        if (!(rengV >= 0)) throw new Error(`Cantidad no válida para ${rengAjuste.reactivos[rengI]!.entrada}.`)
        return { indice: rengI, moles: rengD.unidad === 'mol' ? rengV : rengMolesDesdeMasa(rengV, rengAjuste.reactivos[rengI]!.entrada) }
      })
    return rengCs.length ? rengReactivoLimitante(rengAjuste, rengCs) : null
  })
  return (
    <section className="card stack" aria-label="Cantidades">
      <h3>¿Cuánto se forma?</h3>
      <p className="sm muted">Escribe cuánto tienes de cada reactivo. Si dejas uno vacío, se supone que sobra.</p>
      {rengAjuste.reactivos.map((rengT, rengI) => (
        <div className="param-fila" key={rengClave(rengI)}>
          <span style={{ minWidth: 110 }}>
            <RengFormulaSimple texto={rengT.entrada} />
          </span>
          <input
            className="input param-campo"
            inputMode="decimal"
            placeholder="cantidad"
            value={rengDatos[rengI]!.valor}
            aria-label={`Cantidad de ${rengT.entrada}`}
            onChange={(rengE) => rengSetCant({ ...rengCant, [rengClave(rengI)]: { ...rengDatos[rengI]!, valor: rengE.target.value } })}
          />
          <select
            className="select param-unidad"
            value={rengDatos[rengI]!.unidad}
            aria-label={`Unidad de ${rengT.entrada}`}
            onChange={(rengE) => rengSetCant({ ...rengCant, [rengClave(rengI)]: { ...rengDatos[rengI]!, unidad: rengE.target.value as 'g' | 'mol' } })}
          >
            <option value="g">g</option>
            <option value="mol">mol</option>
          </select>
        </div>
      ))}
      {'error' in rengR && <RengNotice tipo="err">{rengR.error}</RengNotice>}
      {'ok' in rengR && rengR.ok && (
        <>
          <RengNotice tipo="ok">
            Se acaba primero: <RengFormulaSimple texto={rengAjuste.reactivos[rengR.ok.limitante]!.entrada} /> (reactivo limitante)
          </RengNotice>
          <table className="table tabla-datos">
            <thead>
              <tr>
                <th>Sustancia</th>
                <th>mol</th>
                <th>gramos</th>
              </tr>
            </thead>
            <tbody>
              {rengR.ok.reactivos.map((rengX) => (
                <tr key={`r-${rengX.entrada}`}>
                  <td>
                    <RengFormulaSimple texto={rengX.entrada} /> sobra
                  </td>
                  <td>{Number.isNaN(rengX.sobrante) ? 'en exceso' : rengFmt(rengX.sobrante)}</td>
                  <td>{Number.isNaN(rengX.sobrante) ? '—' : rengFmt(rengX.masaSobrante)}</td>
                </tr>
              ))}
              {rengR.ok.productos.map((rengX) => (
                <tr key={`p-${rengX.entrada}`}>
                  <td>
                    <RengFormulaSimple texto={rengX.entrada} /> se forma
                  </td>
                  <td>{rengFmt(rengX.moles)}</td>
                  <td>{rengFmt(rengX.masa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <RengVerMas titulo="Resolución paso a paso">
            <ol style={{ paddingLeft: 18 }}>
              {rengR.ok.pasos.map((rengP, rengI) => (
                <li key={rengI}>{rengP}</li>
              ))}
            </ol>
          </RengVerMas>
        </>
      )}
    </section>
  )
}

export function RengAjusteManual(): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const [rengTexto, rengSetTexto] = useState('')
  const [rengMetodo, rengSetMetodo] = useState<RengMetodo>('algebraico')
  const [rengResaltado, rengSetResaltado] = useState<string | null>(null)
  const rengMet: RengMetodo = rengMuestra('reacciones.metodosAjuste') ? rengMetodo : 'algebraico'

  const rengR = useMemo(() => rengIntentar<RengAjuste | RengAjusteRedox>(() => (rengMet === 'algebraico' ? rengAjustarEcuacion(rengTexto) : rengAjustarIonElectron(rengTexto, rengMet))), [rengTexto, rengMet])
  const rengRedox = 'ok' in rengR && 'semirreacciones' in rengR.ok ? rengR.ok : null

  return (
    <RengTresZonas
      lienzo={
        <div className="zonas-lienzo">
          <div className="centro-scroll">
            {rengRedox ? (
              <div className="stack">
                <RengFormula texto={rengRedox.texto.replace(/→/, '->')} tamano="grande" resaltado={rengResaltado} onElemento={rengSetResaltado} />
              </div>
            ) : (
              <RengEcuacion texto={rengTexto} resaltado={rengResaltado} onElemento={rengSetResaltado} />
            )}
            {'ok' in rengR && <RengEstequiometria ajuste={rengR.ok} />}
          </div>
        </div>
      }
      barra={
        <>
          <label htmlFor="ecuacion" className="sm muted">
            Ecuación
          </label>
          <input
            id="ecuacion"
            className="input mono"
            style={{ flex: 1, minWidth: 260 }}
            value={rengTexto}
            onChange={(rengE) => rengSetTexto(rengE.target.value)}
            spellCheck={false}
            list="ejemplos-ecuacion"
          />
          <datalist id="ejemplos-ecuacion">
            {RENG_EJEMPLOS.map((rengE) => (
              <option key={rengE} value={rengE} />
            ))}
          </datalist>
          {rengMuestra('reacciones.metodosAjuste') && (
            <div className="segmentado" role="group" aria-label="Método de ajuste">
              {(
                [
                  ['algebraico', 'Algebraico'],
                  ['acido', 'Redox ácido'],
                  ['basico', 'Redox básico']
                ] as const
              ).map(([rengId, rengL]) => (
                <button key={rengId} aria-pressed={rengMetodo === rengId} onClick={() => rengSetMetodo(rengId)}>
                  {rengL}
                </button>
              ))}
            </div>
          )}
        </>
      }
      panel={
        <RengPanelExplicacion
          titular={'error' in rengR ? 'Esta ecuación no se puede ajustar así' : 'Ajustar es contar átomos'}
          parrafo={
            'error' in rengR
              ? rengR.error
              : 'En una reacción los átomos no se crean ni se destruyen: solo cambian de pareja. Por eso una ecuación ajustada tiene los mismos átomos de cada elemento a los dos lados. Los números grandes delante de cada fórmula son los coeficientes; los pequeños, los subíndices, y esos no se tocan.'
          }
          saberMas={
            <>
              <p>
                La app ajusta resolviendo un sistema de ecuaciones: una por elemento (y otra para la carga). Usa fracciones exactas, así que el resultado no tiene errores de
                redondeo.
              </p>
              <p>Si una ecuación admite varias soluciones independientes (mezcla de dos reacciones), lo avisa en lugar de elegir una al azar.</p>
              <p>Escribe los estados como (s), (l), (g), (aq) y las condiciones pegadas a la flecha: -&gt;[Pt, 500 °C].</p>
            </>
          }
        >
          {rengRedox && (
            <RengVerMas titulo="Método ion-electrón, paso a paso" abierto>
              <ol style={{ paddingLeft: 18 }}>
                {rengRedox.pasos.map((rengP, rengI) => (
                  <li key={rengI} className={rengP.startsWith('  ') ? 'mono' : ''}>
                    {rengP.trim()}
                  </li>
                ))}
              </ol>
            </RengVerMas>
          )}
          {rengMuestra('reacciones.avisoMetodos') && <p className="faint sm">El modo Avanzado añade el ajuste redox por el método ion-electrón.</p>}
        </RengPanelExplicacion>
      }
    />
  )
}
