import { rengCovalente, RENG_SECUENCIAS, type RengSecuencia } from '../enlaces/secuencias'
import { rengFormulaConvencional } from './analisisMesa'
import { RENG_DIATOMICAS } from './datosEnlace'
import { RENG_FUENTES_3D } from './elementos3d'
import { rengAtomo, rengEnlaceEntre, rengFragmentoDe, type RengMesa } from './mesa'
import { rengLongitudEnlace } from './relajar'

export interface RengSecuenciaDeEnlace {
  sec: RengSecuencia | null
  avisos: string[]
}

const rengComa = (rengX: number, rengD = 3): string => rengX.toFixed(rengD).replace('.', ',')

export function rengSecuenciaDeEnlace(rengM: RengMesa, rengA: number, rengB: number): RengSecuenciaDeEnlace {
  const RENG_A = rengAtomo(rengM, rengA)
  const RENG_B = rengAtomo(rengM, rengB)
  const rengE = rengEnlaceEntre(rengM, rengA, rengB)
  if (!RENG_A || !RENG_B || !rengE) return { sec: null, avisos: ['Ese enlace ya no está en la mesa.'] }
  const rengIds = rengFragmentoDe(rengM, rengA)
  const rengFormula = rengFormulaConvencional(rengIds.map((rengId) => rengAtomo(rengM, rengId)!.el))
  const rengEscrita = RENG_SECUENCIAS.find((rengS) => rengS.formula === rengFormula && rengS.tipo !== 'intermolecular' && rengS.tipo !== 'dativo')
  if (rengE.tipo === 'ionico' || rengE.tipo === 'metalico' || rengE.orden > 1) {
    const rengMisma = rengE.tipo === 'metalico' ? RENG_SECUENCIAS.find((rengS) => rengS.tipo === 'metalico' && rengS.formula === RENG_A.el) : rengEscrita
    if (rengMisma) return { sec: rengMisma, avisos: [] }
    const rengQue = rengE.tipo === 'ionico' ? 'este par iónico (faltan radios iónicos de Shannon o la estructura con datos)' : rengE.tipo === 'metalico' ? `el metal ${RENG_A.el}` : `un enlace ${rengE.orden === 2 ? 'doble' : 'triple'} en ${rengFormula}`
    return { sec: null, avisos: [`Todavía no hay una secuencia paso a paso con datos para ${rengQue}. No se muestra otra en su lugar.`] }
  }
  const rengClave = `${RENG_A.el}${RENG_B.el}` in RENG_DIATOMICAS ? `${RENG_A.el}${RENG_B.el}` : `${RENG_B.el}${RENG_A.el}` in RENG_DIATOMICAS ? `${RENG_B.el}${RENG_A.el}` : RENG_A.el === RENG_B.el && `${RENG_A.el}2` in RENG_DIATOMICAS ? `${RENG_A.el}2` : null
  const rengDiatomica = rengIds.length === 2 && rengClave && RENG_DIATOMICAS[rengClave] ? rengClave : null
  const rengMedida = rengDiatomica ? RENG_DIATOMICAS[rengDiatomica]!.re : rengFormula === 'H2O' ? 0.9572 : null
  const rengLongitud = rengMedida ?? rengLongitudEnlace(RENG_A.el, RENG_B.el)
  const rengAvisos: string[] = []
  if (rengMedida === null) rengAvisos.push(`La longitud (${rengComa(rengLongitud)} Å) es aproximada: suma de radios covalentes de Cordero 2008; la app no tiene un valor medido para ${rengFormula}.`)
  const rengSec = rengCovalente(`mesa-${rengA}-${rengB}`, rengFormula, RENG_A.el, [{ el: RENG_B.el, dir: [1, 0, 0], longitud: rengLongitud }], rengDiatomica, {
    fuenteGeometria: rengMedida !== null ? (rengFormula === 'H2O' ? 'Geometría experimental del H₂O: r(O–H) = 0,9572 Å (NIST CCCBDB)' : undefined) : `Longitud aproximada (${RENG_FUENTES_3D.rc})`
  })
  return { sec: rengSec, avisos: rengAvisos }
}
