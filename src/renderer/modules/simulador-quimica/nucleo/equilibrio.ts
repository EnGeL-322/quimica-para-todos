export interface RengEspecieEq {
  nombre: string
  nu: number
  c0: number
}

export interface RengResultadoEq {
  xi: number
  c: number[]
  Q0: number
  sentido: -1 | 0 | 1
  residuo: number
  convergio: boolean
}

export type RengCodigoIndeterminado = 'entrada-no-valida' | 'sistema-vacio' | 'sin-avance'

export type RengAnalisisEq = ({ tipo: 'equilibrio' } & RengResultadoEq) | { tipo: 'indeterminado'; codigo: RengCodigoIndeterminado; motivo: string }

export class RengErrorEquilibrio extends RangeError {
  constructor(
    readonly rengCodigo: RengCodigoIndeterminado,
    rengMensaje: string
  ) {
    super(rengMensaje)
    this.name = 'ErrorEquilibrio'
  }
}

export const RENG_TOL_RESIDUO = 1e-9

export interface RengFaltaEquilibrio {
  codigo: 'vacio' | 'sin-ambos' | 'sin-reactivos' | 'sin-productos' | 'ninguna'
  ausentes: string[]
  texto: string
}

export function rengFaltaEquilibrio(rengEsp: readonly RengEspecieEq[]): RengFaltaEquilibrio {
  const rengReactivos = rengEsp.filter((rengE) => rengE.nu < 0)
  const rengProductos = rengEsp.filter((rengE) => rengE.nu > 0)
  const rengRAusentes = rengReactivos.filter((rengE) => rengE.c0 === 0).map((rengE) => rengE.nombre)
  const rengPAusentes = rengProductos.filter((rengE) => rengE.c0 === 0).map((rengE) => rengE.nombre)
  if (rengEsp.every((rengE) => rengE.c0 === 0)) return { codigo: 'vacio', ausentes: rengEsp.map((rengE) => rengE.nombre), texto: `Sistema vacío: todas las concentraciones iniciales son 0 (${rengEsp.map((rengE) => rengE.nombre).join(', ')}). El cociente Q no está definido y no hay nada que pueda transformarse. Indica la concentración inicial de al menos una especie.` }
  if (rengRAusentes.length > 0 && rengPAusentes.length > 0) return { codigo: 'sin-ambos', ausentes: [...rengRAusentes, ...rengPAusentes], texto: `Q = 0/0 no está definido: falta ${rengRAusentes.join(', ')} (reactivo) y falta ${rengPAusentes.join(', ')} (producto), así que la reacción no puede avanzar en ningún sentido. Añade ${rengRAusentes.join(', ')} para que pueda avanzar hacia los productos, o ${rengPAusentes.join(', ')} para que pueda avanzar hacia los reactivos.` }
  if (rengRAusentes.length > 0) return { codigo: 'sin-reactivos', ausentes: rengRAusentes, texto: `Falta ${rengRAusentes.join(', ')} (reactivo): Q → ∞ y el sistema solo puede evolucionar hacia los reactivos.` }
  if (rengPAusentes.length > 0) return { codigo: 'sin-productos', ausentes: rengPAusentes, texto: `Falta ${rengPAusentes.join(', ')} (producto): Q = 0 y el sistema solo puede evolucionar hacia los productos.` }
  return { codigo: 'ninguna', ausentes: [], texto: '' }
}

export function rengCociente(rengEspecies: RengEspecieEq[], rengC: number[]): number {
  let rengLnQ = 0
  for (let rengI = 0; rengI < rengEspecies.length; rengI++) {
    const rengNu = rengEspecies[rengI]!.nu
    if (rengC[rengI]! <= 0) return rengNu > 0 ? 0 : Infinity
    rengLnQ += rengNu * Math.log(rengC[rengI]!)
  }
  return Math.exp(rengLnQ)
}

function rengLnCociente(rengEspecies: RengEspecieEq[], rengC: number[]): number {
  let rengLnQ = 0
  for (let rengI = 0; rengI < rengEspecies.length; rengI++) rengLnQ += rengEspecies[rengI]!.nu * Math.log(rengC[rengI]!)
  return rengLnQ
}

function rengRangoXi(rengEsp: RengEspecieEq[]): [number, number] {
  let rengLo = -Infinity
  let rengHi = Infinity
  for (const rengE of rengEsp) {
    if (rengE.nu > 0) rengLo = Math.max(rengLo, -rengE.c0 / rengE.nu)
    else if (rengE.nu < 0) rengHi = Math.min(rengHi, rengE.c0 / -rengE.nu)
  }
  return [rengLo, rengHi]
}

export function rengAnalizarEquilibrio(rengEspecies: RengEspecieEq[], RENG_K: number): RengAnalisisEq {
  const rengNo = (rengCodigo: RengCodigoIndeterminado, rengMotivo: string): RengAnalisisEq => ({ tipo: 'indeterminado', codigo: rengCodigo, motivo: rengMotivo })
  if (!Number.isFinite(RENG_K) || !(RENG_K > 0)) return rengNo('entrada-no-valida', 'K debe ser un número finito y positivo.')
  if (rengEspecies.some((rengE) => !Number.isFinite(rengE.nu) || rengE.nu === 0)) return rengNo('entrada-no-valida', 'Cada coeficiente estequiométrico debe ser un número finito distinto de 0.')
  if (rengEspecies.some((rengE) => !Number.isFinite(rengE.c0) || rengE.c0 < 0)) return rengNo('entrada-no-valida', 'Las concentraciones iniciales deben ser números finitos y ≥ 0.')
  if (!rengEspecies.some((rengE) => rengE.nu < 0) || !rengEspecies.some((rengE) => rengE.nu > 0)) return rengNo('entrada-no-valida', 'Hacen falta reactivos y productos.')
  if (rengEspecies.every((rengE) => rengE.c0 === 0)) return rengNo('sistema-vacio', rengFaltaEquilibrio(rengEspecies).texto)
  const [rengLo0, rengHi0] = rengRangoXi(rengEspecies)
  if (!(rengHi0 > rengLo0))
    return rengNo('sin-avance', rengFaltaEquilibrio(rengEspecies).texto)
  const rengCEn = (rengXi: number): number[] => rengEspecies.map((rengE) => Math.max(0, rengE.c0 + rengE.nu * rengXi))
  const RENG_Q0 = rengCociente(rengEspecies, rengEspecies.map((rengE) => rengE.c0))
  const rengLnK = Math.log(RENG_K)
  let rengLo = rengLo0
  let rengHi = rengHi0
  for (let rengI = 0; rengI < 400 && rengHi - rengLo > 0; rengI++) {
    const rengMid = (rengLo + rengHi) / 2
    if (rengMid <= rengLo || rengMid >= rengHi) break
    const rengC = rengCEn(rengMid)
    const rengF = rengC.some((rengX) => rengX <= 0) ? (rengC.some((rengX, rengJ) => rengX <= 0 && rengEspecies[rengJ]!.nu > 0) ? -Infinity : Infinity) : rengLnCociente(rengEspecies, rengC) - rengLnK
    if (rengF < 0) rengLo = rengMid
    else rengHi = rengMid
  }
  const rengXi = (rengLo + rengHi) / 2
  const rengC = rengCEn(rengXi)
  const rengResiduo = rengC.every((rengX) => rengX > 0) ? Math.abs(rengLnCociente(rengEspecies, rengC) - rengLnK) : Infinity
  const rengSentido = Number.isFinite(Math.log(RENG_Q0 / RENG_K)) && Math.abs(Math.log(RENG_Q0 / RENG_K)) < RENG_TOL_RESIDUO ? 0 : RENG_Q0 < RENG_K ? 1 : -1
  return { tipo: 'equilibrio', xi: rengXi, c: rengC, Q0: RENG_Q0, sentido: rengSentido, residuo: rengResiduo, convergio: rengResiduo < RENG_TOL_RESIDUO }
}

export function rengResolverEquilibrio(rengEspecies: RengEspecieEq[], RENG_K: number): RengResultadoEq {
  const rengR = rengAnalizarEquilibrio(rengEspecies, RENG_K)
  if (rengR.tipo === 'indeterminado') throw new RengErrorEquilibrio(rengR.codigo, rengR.motivo)
  const { tipo: _rengTipo, ...rengRes } = rengR
  return rengRes
}

export function rengPerturbar(rengEspecies: RengEspecieEq[], RENG_K: number, rengI: number, rengDelta: number): { antes: RengResultadoEq; despues: RengResultadoEq } {
  const rengAntes = rengResolverEquilibrio(rengEspecies, RENG_K)
  const rengNuevas = rengEspecies.map((rengE, rengJ) => ({ ...rengE, c0: rengAntes.c[rengJ]! + (rengJ === rengI ? rengDelta : 0) }))
  if (rengNuevas[rengI]!.c0 < 0) throw new RangeError('no se puede quitar más sustancia de la que hay')
  return { antes: rengAntes, despues: rengResolverEquilibrio(rengNuevas, RENG_K) }
}

export const RENG_R_L_BAR = 0.08314462618
export const rengKcDeKp = (RengKp: number, RENG_T: number, rengDn: number): number => RengKp * Math.pow(RENG_R_L_BAR * RENG_T, -rengDn)

export function rengGradoDisociacionDimero(rengC0: number, RENG_K: number): number {
  return (-RENG_K + Math.sqrt(RENG_K * RENG_K + 16 * rengC0 * RENG_K)) / (8 * rengC0)
}

export function rengDescribirDesplazamiento(rengR: RengResultadoEq, RENG_K: number, rengFmt: (rengX: number) => string): { resultado: string; explicacion: string } {
  const rengPie = 'K no cambia con las concentraciones; solo con la temperatura.'
  if (rengR.sentido === 0)
    return {
      resultado: 'ninguno: ya estaba en equilibrio',
      explicacion: `Q antes de reequilibrar = ${rengFmt(rengR.Q0)} ≈ K = ${rengFmt(RENG_K)} (|ln Q − ln K| < ${RENG_TOL_RESIDUO}) ⇒ ya está en equilibrio: no hay desplazamiento. ${rengPie}`
    }
  const rengHaciaProductos = rengR.sentido > 0
  return {
    resultado: `${rengHaciaProductos ? 'hacia los productos' : 'hacia los reactivos'} (ξ = ${rengFmt(rengR.xi)})`,
    explicacion: `Q antes de reequilibrar = ${rengFmt(rengR.Q0)} ${rengHaciaProductos ? '<' : '>'} K = ${rengFmt(RENG_K)} ⇒ la reacción avanza hacia ${rengHaciaProductos ? 'los productos' : 'los reactivos'} hasta Q = K. ${rengPie}`
  }
}
