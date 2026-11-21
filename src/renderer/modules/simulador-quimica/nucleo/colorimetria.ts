import { rengIncertidumbreInterpolada, rengRegresionLineal } from '../practica/solucionadores'

export const RENG_LIMITES_COLORIMETRIA = { patronesMax: 6, blancosMax: 3, replicasMax: 10, cMin: 0, cMax: 10000, aMin: -0.5, aMax: 5 } as const

export const RENG_ABSORBANCIA_RECOMENDADA = { min: 0.1, max: 0.8, noSuperar: 1 } as const

export type RengSeveridadColor = 'info' | 'aviso' | 'fuera'

export interface RengDiagnosticoColor {
  codigo: string
  severidad: RengSeveridadColor
  texto: string
}

export interface RengPatronColor {
  c: number
  a: number
}

export interface RengEntradaColorimetria {
  blancos: number[]
  patrones: RengPatronColor[]
  muestra: number
  replicas: number
}

export type RengEstadoCurva = 'interpolada' | 'fuera-por-debajo' | 'fuera-por-encima' | 'fuera-de-intervalo-c'

export interface RengFilaCurva {
  c: number
  a: number
  aCorr: number
  ajustada: number
  residuo: number
}

export interface RengResultadoColorimetria {
  blancoMedio: number
  filas: RengFilaCurva[]
  m: number
  b: number
  r2: number
  sr: number
  n: number
  cMin: number
  cMax: number
  aMin: number
  aMax: number
  muestraCorr: number
  estado: RengEstadoCurva
  x0: number | null
  u: number | null
  x0SinBlanco: number | null
  diagnosticos: RengDiagnosticoColor[]
}

const rengN = (rengX: number, rengD = 3): string => (Number.isFinite(rengX) ? String(Number(rengX.toPrecision(rengD))).replace('.', ',') : '—')

export function rengLeerEntradaColorimetria(rengE: Readonly<Record<string, number | string>>): RengEntradaColorimetria {
  const rengNum = (rengK: string): number | undefined => {
    const rengV = rengE[rengK]
    if (rengV === undefined) return undefined
    if (typeof rengV !== 'number' || !Number.isFinite(rengV)) throw new RangeError(`«${rengK}» debe ser un número finito.`)
    return rengV
  }
  const rengBlancos: number[] = []
  for (let rengI = 0; rengI < RENG_LIMITES_COLORIMETRIA.blancosMax; rengI++) {
    const rengB = rengNum(`b${rengI}`)
    if (rengB !== undefined) rengBlancos.push(rengB)
  }
  const rengPatrones: RengPatronColor[] = []
  for (let rengI = 0; rengI < RENG_LIMITES_COLORIMETRIA.patronesMax; rengI++) {
    const rengC = rengNum(`c${rengI}`)
    const rengA = rengNum(`a${rengI}`)
    if (rengC === undefined && rengA === undefined) continue
    if (rengC === undefined || rengA === undefined) throw new RangeError(`El patrón ${rengI + 1} está incompleto: falta su ${rengC === undefined ? 'concentración' : 'absorbancia'}.`)
    rengPatrones.push({ c: rengC, a: rengA })
  }
  const rengMuestra = rengNum('As')
  if (rengMuestra === undefined) throw new RangeError('Falta la absorbancia de la muestra.')
  const rengRep = rengNum('rep') ?? 1
  if (!Number.isInteger(rengRep) || rengRep < 1 || rengRep > RENG_LIMITES_COLORIMETRIA.replicasMax) throw new RangeError(`Las réplicas de la muestra deben ser un entero de 1 a ${RENG_LIMITES_COLORIMETRIA.replicasMax}.`)
  return { blancos: rengBlancos, patrones: rengPatrones, muestra: rengMuestra, replicas: rengRep }
}

export function rengCalibrarColorimetria(rengEntrada: RengEntradaColorimetria): RengResultadoColorimetria {
  if (rengEntrada.blancos.length < 1) throw new RangeError('Hace falta al menos una lectura del blanco.')
  if (rengEntrada.patrones.length < 3) throw new RangeError(`Hacen falta al menos 3 patrones para ajustar una recta y poder juzgar el ajuste (hay ${rengEntrada.patrones.length}): con 2 patrones la recta pasa exactamente por ambos y no queda ningún residuo.`)
  const rengBlanco = rengEntrada.blancos.reduce((rengS, rengX) => rengS + rengX, 0) / rengEntrada.blancos.length
  const rengCs = rengEntrada.patrones.map((rengP) => rengP.c)
  if (new Set(rengCs).size < 2) throw new RangeError('Todos los patrones tienen la misma concentración: la recta no está definida (pendiente indeterminada). Usa patrones de concentraciones distintas.')
  const rengAcorr = rengEntrada.patrones.map((rengP) => rengP.a - rengBlanco)
  const rengCal = rengRegresionLineal(rengCs, rengAcorr)
  if (!(Math.abs(rengCal.m) > 1e-9)) throw new RangeError('La pendiente de la recta es nula: la absorbancia no cambia con la concentración y no se puede obtener la concentración de la muestra.')
  const rengFilas: RengFilaCurva[] = rengEntrada.patrones.map((rengP, rengI) => {
    const rengAj = rengCal.b + rengCal.m * rengP.c
    return { c: rengP.c, a: rengP.a, aCorr: rengAcorr[rengI]!, ajustada: rengAj, residuo: rengAcorr[rengI]! - rengAj }
  })
  const rengSsr = rengFilas.reduce((rengS, rengF) => rengS + rengF.residuo ** 2, 0)
  const rengSst = rengAcorr.reduce((rengS, rengY) => rengS + (rengY - rengCal.ym) ** 2, 0)
  const rengR2 = 1 - rengSsr / rengSst
  const rengCMin = Math.min(...rengCs)
  const rengCMax = Math.max(...rengCs)
  const rengAMin = Math.min(...rengAcorr)
  const rengAMax = Math.max(...rengAcorr)
  const rengYc = rengEntrada.muestra - rengBlanco
  const rengEpsA = 1e-12
  const rengEpsC = 1e-9 * Math.max(1, Math.abs(rengCMax))
  let rengEstado: RengEstadoCurva
  let rengX0: number | null = null
  let rengU: number | null = null
  let rengX0Raw: number | null = null
  if (rengYc < rengAMin - rengEpsA) rengEstado = 'fuera-por-debajo'
  else if (rengYc > rengAMax + rengEpsA) rengEstado = 'fuera-por-encima'
  else {
    const rengX = (rengYc - rengCal.b) / rengCal.m
    if (rengX < rengCMin - rengEpsC || rengX > rengCMax + rengEpsC) rengEstado = 'fuera-de-intervalo-c'
    else {
      rengEstado = 'interpolada'
      rengX0 = rengX
      rengU = rengIncertidumbreInterpolada(rengCal, rengYc, rengEntrada.replicas)
      const rengCalRaw = rengRegresionLineal(rengCs, rengEntrada.patrones.map((rengP) => rengP.a))
      rengX0Raw = (rengEntrada.muestra - rengCalRaw.b) / rengCalRaw.m
    }
  }

  const rengDiag: RengDiagnosticoColor[] = []
  const rengTramo = `[${rengN(rengCMin)}; ${rengN(rengCMax)}] mg/L`
  if (rengEstado === 'fuera-por-debajo') rengDiag.push({ codigo: 'extrapolacion-curva', severidad: 'fuera', texto: `La absorbancia de la muestra sin el blanco (${rengN(rengYc)}) es menor que la del patrón más diluido (${rengN(rengAMin)}): quedaría por debajo de la curva. Extrapolar la recta más allá de los patrones no es fiable (allí no se comprobó la linealidad), así que NO se calcula la concentración. Añade un patrón más diluido que cubra la muestra.` })
  if (rengEstado === 'fuera-por-encima') rengDiag.push({ codigo: 'extrapolacion-curva', severidad: 'fuera', texto: `La absorbancia de la muestra sin el blanco (${rengN(rengYc)}) es mayor que la del patrón más concentrado (${rengN(rengAMax)}): quedaría por encima de la curva. Extrapolar no es fiable, así que NO se calcula la concentración. Diluye la muestra y repite la lectura (y aplica después el factor de dilución), o añade un patrón más concentrado.` })
  if (rengEstado === 'fuera-de-intervalo-c') rengDiag.push({ codigo: 'extrapolacion-curva', severidad: 'fuera', texto: `La absorbancia de la muestra cae entre las de los patrones, pero la recta ajustada la sitúa fuera del intervalo de concentraciones de los patrones ${rengTramo} (ocurre cuando los puntos extremos se alejan de la recta). Sería extrapolar, así que NO se informa la concentración.` })
  const rengNegativos = rengFilas.map((rengF, rengI) => ({ rengF, rengI })).filter(({ rengF }) => rengF.aCorr < 0)
  if (rengNegativos.length > 0) rengDiag.push({ codigo: 'negativa-patron', severidad: 'aviso', texto: `Tras restar el blanco (${rengN(rengBlanco)}) los patrones ${rengNegativos.map(({ rengI }) => rengI + 1).join(', ')} quedan con absorbancia negativa: absorben menos que el blanco. Puede ser ruido, pero revisa el blanco y la lectura de esos patrones.` })
  if (rengYc < 0) rengDiag.push({ codigo: 'negativa-muestra', severidad: rengEstado === 'interpolada' ? 'aviso' : 'fuera', texto: `Tras restar el blanco la absorbancia de la muestra es negativa (${rengN(rengYc)}): la muestra absorbe menos que el blanco y no se distingue de él con esta curva.` })
  const rengPorC = new Map<number, RengPatronColor[]>()
  for (const rengP of rengEntrada.patrones) rengPorC.set(rengP.c, [...(rengPorC.get(rengP.c) ?? []), rengP])
  const rengIdenticos = [...rengPorC.values()].filter((rengL) => rengL.length > 1 && rengL.some((rengP, rengI) => rengL.findIndex((rengQ) => rengQ.a === rengP.a) !== rengI))
  const rengRepetidos = [...rengPorC.entries()].filter(([, rengL]) => rengL.length > 1)
  if (rengIdenticos.length > 0) rengDiag.push({ codigo: 'repetidos', severidad: 'aviso', texto: `Hay patrones con la misma concentración y la misma absorbancia (${rengIdenticos.map((rengL) => `${rengN(rengL[0]!.c)} mg/L`).join(', ')}): parece una fila copiada y cuenta doble en la regresión. Si son réplicas reales, mide de nuevo.` })
  else if (rengRepetidos.length > 0) rengDiag.push({ codigo: 'repetidos', severidad: 'info', texto: `Hay concentraciones repetidas (${rengRepetidos.map(([rengC]) => `${rengN(rengC)} mg/L`).join(', ')}) con absorbancias distintas: se tratan como réplicas, cada una es un punto independiente de la regresión.` })
  if (rengCal.m < 0) rengDiag.push({ codigo: 'pendiente-negativa', severidad: 'aviso', texto: `La pendiente es negativa (${rengN(rengCal.m)} L/mg): la absorbancia baja al subir la concentración, lo contrario de lo que espera la ley de Beer–Lambert. Revisa los datos.` })
  if (rengEntrada.patrones.length === 3) rengDiag.push({ codigo: 'tres-patrones', severidad: 'info', texto: 'Con 3 patrones solo queda 1 grado de libertad en el ajuste (n − 2): la desviación típica de la regresión y la incertidumbre de la muestra se estiman con muy poca información.' })
  const rengLecturas = [...rengEntrada.blancos.map((rengA, rengI) => ({ n: `el blanco ${rengI + 1}`, a: rengA })), ...rengEntrada.patrones.map((rengP, rengI) => ({ n: `el patrón ${rengI + 1}`, a: rengP.a })), { n: 'la muestra', a: rengEntrada.muestra }]
  const rengAltas = rengLecturas.filter((rengL) => rengL.a > RENG_ABSORBANCIA_RECOMENDADA.noSuperar)
  if (rengAltas.length > 0) rengDiag.push({ codigo: 'saturacion', severidad: 'aviso', texto: `La lectura de ${rengAltas.map((rengL) => `${rengL.n} (A = ${rengN(rengL.a)})`).join(', ')} supera A = ${rengN(RENG_ABSORBANCIA_RECOMENDADA.noSuperar)}. Wenzel (LibreTexts, «1.2 Beers Law») considera generalmente indeseable registrar absorbancias por encima de 1 (solo pasa el 10 % de la luz) y recomienda diluir la muestra hasta la zona lineal. La fuente no da un valor exacto en el que falle la linealidad: es una recomendación de trabajo, no un límite medido.` })
  if (rengEntrada.muestra <= RENG_ABSORBANCIA_RECOMENDADA.noSuperar && (rengEntrada.muestra < RENG_ABSORBANCIA_RECOMENDADA.min || rengEntrada.muestra > RENG_ABSORBANCIA_RECOMENDADA.max)) rengDiag.push({ codigo: 'rango-recomendado', severidad: 'info', texto: `La lectura de la muestra (A = ${rengN(rengEntrada.muestra)}) está fuera del intervalo ${rengN(RENG_ABSORBANCIA_RECOMENDADA.min)}–${rengN(RENG_ABSORBANCIA_RECOMENDADA.max)} que Wenzel (LibreTexts, «1.2 Beers Law») recomienda para medir la absorbancia.` })

  return { blancoMedio: rengBlanco, filas: rengFilas, m: rengCal.m, b: rengCal.b, r2: rengR2, sr: rengCal.sr, n: rengFilas.length, cMin: rengCMin, cMax: rengCMax, aMin: rengAMin, aMax: rengAMax, muestraCorr: rengYc, estado: rengEstado, x0: rengX0, u: rengU, x0SinBlanco: rengX0Raw, diagnosticos: rengDiag }
}

export const RENG_DATOS_COLOR_EJEMPLO = {
  blancos: [0.008, 0.012],
  patrones: [
    { c: 2, a: 0.11 },
    { c: 4, a: 0.215 },
    { c: 6, a: 0.31 },
    { c: 8, a: 0.405 },
    { c: 10, a: 0.51 }
  ],
  muestra: 0.26
} as const
