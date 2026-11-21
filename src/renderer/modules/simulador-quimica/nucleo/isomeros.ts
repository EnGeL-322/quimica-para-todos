export type RengVec = readonly [number, number, number]

export const RENG_MAX_SELECCION_ISO = 4
export const RENG_UMBRAL_DISTANCIA_IGUAL = 0.05
export const RENG_EPS_COLINEAL = 1e-9

export type RengOrigenIso = 'experimental' | 'calculada'

export interface RengProcedenciaIso {
  origen: RengOrigenIso
  metodo: string
  texto: string
  detalle: string
}

export interface RengAtomoIso {
  el: string
  etiqueta: string
  p: RengVec
}

export interface RengEnlaceIso {
  a: number
  b: number
  orden: number
  aromatico: boolean
}

export interface RengGeometriaIsomero {
  nombre: string
  smiles: string
  formula: string
  atomos: readonly RengAtomoIso[]
  enlaces: readonly RengEnlaceIso[]
  procedencia: RengProcedenciaIso
}

export type RengSeveridadIso = 'info' | 'aviso' | 'fuera'

export interface RengDiagnosticoIso {
  codigo: string
  severidad: RengSeveridadIso
  texto: string
}

export interface RengMedidasIso {
  n: number
  distancia: number | null
  angulo1: number | null
  angulo2: number | null
  diedro: number | null
  encadenados: boolean[]
  diedroRotable: boolean | null
  distanciaConformacional: boolean
}

export interface RengComparacionIso {
  a: RengMedidasIso
  b: RengMedidasIso
  comparables: { distancia: boolean; angulo1: boolean; angulo2: boolean; diedro: boolean }
  mayorDistancia: 'a' | 'b' | 'igual' | null
  diferencias: { distancia: number | null; angulo1: number | null; angulo2: number | null; diedro: number | null }
  diagnosticos: RengDiagnosticoIso[]
}

const rengResta = (rengA: RengVec, rengB: RengVec): RengVec => [rengA[0] - rengB[0], rengA[1] - rengB[1], rengA[2] - rengB[2]]
const rengPunto = (rengA: RengVec, rengB: RengVec): number => rengA[0] * rengB[0] + rengA[1] * rengB[1] + rengA[2] * rengB[2]
const rengCruz = (rengA: RengVec, rengB: RengVec): RengVec => [rengA[1] * rengB[2] - rengA[2] * rengB[1], rengA[2] * rengB[0] - rengA[0] * rengB[2], rengA[0] * rengB[1] - rengA[1] * rengB[0]]
const rengNorma = (rengA: RengVec): number => Math.hypot(rengA[0], rengA[1], rengA[2])
const rengAGrados = (rengRad: number): number => (rengRad * 180) / Math.PI

export function rengDistancia3(rengA: RengVec, rengB: RengVec): number {
  return rengNorma(rengResta(rengA, rengB))
}

export function rengAnguloEn(rengA: RengVec, rengVertice: RengVec, rengB: RengVec): number | null {
  const rengU = rengResta(rengA, rengVertice)
  const rengW = rengResta(rengB, rengVertice)
  const rengLu = rengNorma(rengU)
  const rengLw = rengNorma(rengW)
  if (rengLu < RENG_EPS_COLINEAL || rengLw < RENG_EPS_COLINEAL) return null
  return rengAGrados(Math.acos(Math.max(-1, Math.min(1, rengPunto(rengU, rengW) / (rengLu * rengLw)))))
}

export function rengDiedro(rengP1: RengVec, rengP2: RengVec, rengP3: RengVec, rengP4: RengVec): number | null {
  const rengB1 = rengResta(rengP2, rengP1)
  const rengB2 = rengResta(rengP3, rengP2)
  const rengB3 = rengResta(rengP4, rengP3)
  const rengN1 = rengCruz(rengB1, rengB2)
  const rengN2 = rengCruz(rengB2, rengB3)
  if (rengNorma(rengN1) < RENG_EPS_COLINEAL || rengNorma(rengN2) < RENG_EPS_COLINEAL) return null
  const rengRad = Math.atan2(rengNorma(rengB2) * rengPunto(rengB1, rengN2), rengPunto(rengN1, rengN2))
  const rengGrados = rengAGrados(rengRad)
  return rengGrados <= -180 + 1e-9 ? 180 : rengGrados
}

export const rengDiferenciaAngular = (rengA: number, rengB: number): number => {
  let rengD = (rengB - rengA) % 360
  if (rengD > 180) rengD -= 360
  if (rengD <= -180) rengD += 360
  return rengD
}

export function rengVerificarProcedenciaIso(rengG: Partial<RengGeometriaIsomero> | null | undefined): asserts rengG is RengGeometriaIsomero {
  const rengP = rengG?.procedencia
  const rengValida = rengP !== undefined && rengP !== null && (rengP.origen === 'experimental' || rengP.origen === 'calculada') && typeof rengP.metodo === 'string' && rengP.metodo.trim() !== '' && typeof rengP.detalle === 'string' && rengP.detalle.trim() !== ''
  if (!rengValida) throw new RangeError('iso-sin-procedencia: la geometría no declara de dónde sale (experimental o calculada, con su método); sin procedencia no se mide ni se compara.')
  if (!Array.isArray(rengG?.atomos) || rengG.atomos.length === 0 || !Array.isArray(rengG.enlaces)) throw new RangeError('iso-geometria-incompleta: la geometría no trae átomos o enlaces.')
}

function rengVecinos(rengG: RengGeometriaIsomero): number[][] {
  const rengV = rengG.atomos.map(() => [] as number[])
  for (const rengE of rengG.enlaces) {
    rengV[rengE.a]!.push(rengE.b)
    rengV[rengE.b]!.push(rengE.a)
  }
  return rengV
}

export function rengEnlaceDe(rengG: RengGeometriaIsomero, rengA: number, rengB: number): RengEnlaceIso | null {
  return rengG.enlaces.find((rengE) => (rengE.a === rengA && rengE.b === rengB) || (rengE.a === rengB && rengE.b === rengA)) ?? null
}

export function rengEnAnillo(rengG: RengGeometriaIsomero, rengA: number, rengB: number): boolean {
  const rengVec = rengVecinos(rengG)
  const rengVisto = new Set<number>([rengA])
  const rengPila = [rengA]
  while (rengPila.length > 0) {
    const rengX = rengPila.pop()!
    for (const rengY of rengVec[rengX]!) {
      if ((rengX === rengA && rengY === rengB) || rengVisto.has(rengY)) continue
      if (rengY === rengB) return true
      rengVisto.add(rengY)
      rengPila.push(rengY)
    }
  }
  return false
}

export function rengCaminoMasCorto(rengG: RengGeometriaIsomero, rengDesde: number, rengHasta: number): number[] | null {
  const rengVec = rengVecinos(rengG)
  const rengPadre = new Map<number, number>([[rengDesde, -1]])
  const rengCola = [rengDesde]
  for (let rengK = 0; rengK < rengCola.length; rengK++) {
    const rengX = rengCola[rengK]!
    if (rengX === rengHasta) break
    for (const rengY of rengVec[rengX]!) {
      if (rengPadre.has(rengY)) continue
      rengPadre.set(rengY, rengX)
      rengCola.push(rengY)
    }
  }
  if (!rengPadre.has(rengHasta)) return null
  const rengCamino: number[] = []
  for (let rengX = rengHasta; rengX !== -1; rengX = rengPadre.get(rengX)!) rengCamino.unshift(rengX)
  return rengCamino
}

export function rengDistanciaDependeDeConformacion(rengG: RengGeometriaIsomero, rengA: number, rengB: number): boolean {
  const rengCamino = rengCaminoMasCorto(rengG, rengA, rengB)
  if (!rengCamino || rengCamino.length < 4) return false
  for (let rengK = 1; rengK < rengCamino.length - 2; rengK++) {
    const rengE = rengEnlaceDe(rengG, rengCamino[rengK]!, rengCamino[rengK + 1]!)
    if (rengE && rengE.orden === 1 && !rengE.aromatico && !rengEnAnillo(rengG, rengCamino[rengK]!, rengCamino[rengK + 1]!)) return true
  }
  return false
}

export function rengValidarSeleccion(rengG: RengGeometriaIsomero, rengSel: readonly number[]): void {
  if (rengSel.length > RENG_MAX_SELECCION_ISO) throw new RangeError(`iso-seleccion-larga: se pueden elegir como mucho ${RENG_MAX_SELECCION_ISO} átomos.`)
  const rengVistos = new Set<number>()
  for (const rengI of rengSel) {
    if (!Number.isInteger(rengI) || rengI < 0 || rengI >= rengG.atomos.length) throw new RangeError(`iso-atomo-inexistente: el átomo ${String(rengI)} no existe en ${rengG.nombre} (tiene ${rengG.atomos.length}).`)
    if (rengVistos.has(rengI)) throw new RangeError(`iso-atomo-repetido: el átomo ${rengG.atomos[rengI]!.etiqueta} de ${rengG.nombre} está elegido dos veces.`)
    rengVistos.add(rengI)
  }
}

export function rengMedirSeleccion(rengG: RengGeometriaIsomero, rengSel: readonly number[]): RengMedidasIso {
  rengVerificarProcedenciaIso(rengG)
  rengValidarSeleccion(rengG, rengSel)
  const rengCuenta = rengSel.length
  const rengPos = rengSel.map((rengI) => rengG.atomos[rengI]!.p)
  const rengEncadenados = rengSel.slice(1).map((rengI, rengK) => rengEnlaceDe(rengG, rengSel[rengK]!, rengI) !== null)
  const rengSal: RengMedidasIso = { n: rengCuenta, distancia: null, angulo1: null, angulo2: null, diedro: null, encadenados: rengEncadenados, diedroRotable: null, distanciaConformacional: false }
  if (rengCuenta >= 2) {
    rengSal.distancia = rengDistancia3(rengPos[0]!, rengPos[rengCuenta - 1]!)
    rengSal.distanciaConformacional = rengDistanciaDependeDeConformacion(rengG, rengSel[0]!, rengSel[rengCuenta - 1]!)
  }
  if (rengCuenta >= 3) rengSal.angulo1 = rengAnguloEn(rengPos[0]!, rengPos[1]!, rengPos[2]!)
  if (rengCuenta === 4) {
    rengSal.angulo2 = rengAnguloEn(rengPos[1]!, rengPos[2]!, rengPos[3]!)
    rengSal.diedro = rengDiedro(rengPos[0]!, rengPos[1]!, rengPos[2]!, rengPos[3]!)
    const rengCentral = rengEnlaceDe(rengG, rengSel[1]!, rengSel[2]!)
    rengSal.diedroRotable = rengCentral === null ? null : rengCentral.orden === 1 && !rengCentral.aromatico && !rengEnAnillo(rengG, rengSel[1]!, rengSel[2]!)
  }
  return rengSal
}

const rengNombreMedida = { distancia: 'la distancia entre el primer y el último átomo', angulo1: 'el ángulo en el segundo átomo', angulo2: 'el ángulo en el tercer átomo', diedro: 'el diedro de los cuatro átomos' } as const

export function rengCompararIsomeros(rengGa: RengGeometriaIsomero, rengGb: RengGeometriaIsomero, rengSelA: readonly number[], rengSelB: readonly number[]): RengComparacionIso {
  rengVerificarProcedenciaIso(rengGa)
  rengVerificarProcedenciaIso(rengGb)
  const rengMa = rengMedirSeleccion(rengGa, rengSelA)
  const rengMb = rengMedirSeleccion(rengGb, rengSelB)
  const rengDiag: RengDiagnosticoIso[] = []
  const rengNinguna = { distancia: false, angulo1: false, angulo2: false, diedro: false }
  const rengSinDif = { distancia: null, angulo1: null, angulo2: null, diedro: null }
  const rengPares: Array<[string, RengGeometriaIsomero, RengMedidasIso, readonly number[]]> = [
    ['A', rengGa, rengMa, rengSelA],
    ['B', rengGb, rengMb, rengSelB]
  ]

  if (rengGa.formula !== rengGb.formula) {
    rengDiag.push({ codigo: 'iso-formula-distinta', severidad: 'fuera', texto: `${rengGa.nombre} (${rengGa.formula}) y ${rengGb.nombre} (${rengGb.formula}) tienen fórmula molecular distinta: no son isómeros y no se comparan.` })
    return { a: rengMa, b: rengMb, comparables: rengNinguna, mayorDistancia: null, diferencias: rengSinDif, diagnosticos: rengDiag }
  }
  if (rengMa.n < 2 || rengMb.n < 2) {
    const rengFalta = rengPares.filter(([, , rengM]) => rengM.n < 2).map(([rengL, rengG]) => `${rengL} (${rengG.nombre})`)
    rengDiag.push({ codigo: 'iso-seleccion-insuficiente', severidad: 'fuera', texto: `Elige al menos 2 átomos en cada isómero para medir: faltan átomos en ${rengFalta.join(' y ')}.` })
    return { a: rengMa, b: rengMb, comparables: rengNinguna, mayorDistancia: null, diferencias: rengSinDif, diagnosticos: rengDiag }
  }

  const rengPa = rengGa.procedencia
  const rengPb = rengGb.procedencia
  let rengCompatibles = true
  if (rengPa.origen !== rengPb.origen) {
    rengCompatibles = false
    rengDiag.push({ codigo: 'iso-calculada-vs-experimental', severidad: 'aviso', texto: `Una geometría es ${rengPa.origen} (${rengGa.nombre}: ${rengPa.metodo}) y la otra ${rengPb.origen} (${rengGb.nombre}: ${rengPb.metodo}). Una conformación calculada no es una medida: se muestran las medidas de cada una, pero no se resta ni se declara cuál es mayor.` })
  } else if (rengPa.metodo !== rengPb.metodo) {
    rengCompatibles = false
    rengDiag.push({ codigo: 'iso-metodos-distintos', severidad: 'aviso', texto: `Las dos geometrías son ${rengPa.origen}s pero por métodos distintos (${rengPa.metodo} frente a ${rengPb.metodo}): las diferencias podrían venir del método y no de los isómeros, así que no se restan.` })
  } else {
    rengDiag.push({
      codigo: 'iso-misma-procedencia',
      severidad: 'info',
      texto: rengPa.origen === 'calculada' ? `Las dos geometrías son calculadas con el mismo método (${rengPa.metodo}): son una conformación de energía baja de cada isómero, no una medida ni el promedio de todas sus conformaciones.` : `Las dos geometrías son experimentales con la misma fuente (${rengPa.metodo}).`
    })
  }
  if (rengMa.n !== rengMb.n) rengDiag.push({ codigo: 'iso-seleccion-desigual', severidad: 'aviso', texto: `Elegiste ${rengMa.n} átomos en A y ${rengMb.n} en B: solo se comparan las medidas que se definen igual en los dos (la distancia entre el primero y el último átomo exige el mismo número de átomos).` })

  for (const [rengL, rengG, rengM, rengSel] of rengPares) {
    if (rengM.n >= 3 && rengM.encadenados.some((rengX) => !rengX)) {
      const rengCortes = rengM.encadenados.map((rengX, rengK) => (rengX ? null : `${rengG.atomos[rengSel[rengK]!]!.etiqueta}–${rengG.atomos[rengSel[rengK + 1]!]!.etiqueta}`)).filter((rengX): rengX is string => rengX !== null)
      rengDiag.push({ codigo: 'iso-sin-enlace', severidad: 'aviso', texto: `En ${rengL} (${rengG.nombre}) no están enlazados ${rengCortes.join(' ni ')}: los ángulos y el diedro se miden igualmente, pero no son ángulos ni diedros de enlace.` })
    }
    if (rengM.n === 4 && rengM.diedro === null) rengDiag.push({ codigo: 'iso-diedro-indefinido', severidad: 'aviso', texto: `En ${rengL} (${rengG.nombre}) tres de los átomos elegidos están alineados: el diedro no está definido.` })
    if (rengM.distanciaConformacional) rengDiag.push({ codigo: 'iso-distancia-conformacional', severidad: 'aviso', texto: `En ${rengL} (${rengG.nombre}) la distancia entre el primer y el último átomo depende de giros de enlaces simples: vale solo para la conformación calculada y cambiaría con otra.` })
    if (rengM.diedroRotable === true) rengDiag.push({ codigo: 'iso-diedro-conformacional', severidad: 'aviso', texto: `En ${rengL} (${rengG.nombre}) el enlace central del diedro es simple y puede girar: el valor corresponde solo a la conformación calculada y cambiaría con otra conformación. No distingue al isómero.` })
  }

  const rengComp = rengCompatibles
    ? {
        distancia: rengMa.n === rengMb.n && rengMa.distancia !== null && rengMb.distancia !== null,
        angulo1: rengMa.angulo1 !== null && rengMb.angulo1 !== null,
        angulo2: rengMa.angulo2 !== null && rengMb.angulo2 !== null,
        diedro: rengMa.diedro !== null && rengMb.diedro !== null
      }
    : rengNinguna
  const rengDif = {
    distancia: rengComp.distancia ? rengMb.distancia! - rengMa.distancia! : null,
    angulo1: rengComp.angulo1 ? rengMb.angulo1! - rengMa.angulo1! : null,
    angulo2: rengComp.angulo2 ? rengMb.angulo2! - rengMa.angulo2! : null,
    diedro: rengComp.diedro ? rengDiferenciaAngular(rengMa.diedro!, rengMb.diedro!) : null
  }
  const rengMayor = rengDif.distancia === null ? null : Math.abs(rengDif.distancia) <= RENG_UMBRAL_DISTANCIA_IGUAL ? 'igual' : rengDif.distancia > 0 ? 'b' : 'a'
  if (rengMayor === 'igual') rengDiag.push({ codigo: 'iso-distancias-iguales', severidad: 'info', texto: `Las distancias difieren menos de ${String(RENG_UMBRAL_DISTANCIA_IGUAL).replace('.', ',')} Å: se consideran iguales (umbral convencional de este proyecto, no una incertidumbre).` })
  return { a: rengMa, b: rengMb, comparables: rengComp, mayorDistancia: rengMayor, diferencias: rengDif, diagnosticos: rengDiag }
}

export const rengNombresMedidaIso = rengNombreMedida

export function rengAlternarAtomo(rengSel: readonly number[], rengI: number, rengMax: number = RENG_MAX_SELECCION_ISO): { seleccion: number[]; aviso: string | null } {
  if (rengSel.includes(rengI)) return { seleccion: rengSel.filter((rengX) => rengX !== rengI), aviso: null }
  if (rengSel.length >= rengMax) return { seleccion: [...rengSel], aviso: `Ya hay ${rengMax} átomos elegidos: quita uno para añadir otro.` }
  return { seleccion: [...rengSel, rengI], aviso: null }
}

export const rengEtiquetasSeleccion = (rengG: RengGeometriaIsomero, rengSel: readonly number[]): string[] => rengSel.map((rengI) => rengG.atomos[rengI]?.etiqueta ?? `#${rengI}`)
