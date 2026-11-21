export const RENG_PKW_25C = 13.9965
export const RENG_KW_25C = 10 ** -RENG_PKW_25C

export interface RengParAcidoBase {
  id: string
  nombre: string
  acido: string
  pKa: number
  fuerte?: boolean
  fuente: string
  verificacion: 'consultada' | 'libro'
}

export const RENG_ACIDOS: readonly RengParAcidoBase[] = [
  { id: 'hcl', nombre: 'Ácido clorhídrico (fuerte)', acido: 'HCl', pKa: -6.3, fuerte: true, fuente: 'Ácido fuerte: disociación completa en agua', verificacion: 'libro' },
  { id: 'acetico', nombre: 'Ácido acético', acido: 'CH₃COOH', pKa: 4.756, fuente: 'Wikipedia «Acid dissociation constant», tabla en agua (4,756)', verificacion: 'consultada' },
  { id: 'fosforico1', nombre: 'Ácido fosfórico (1.ª disociación)', acido: 'H₃PO₄', pKa: 2.14, fuente: 'Wikipedia «Acid dissociation constant», ácidos polipróticos (2,14)', verificacion: 'consultada' },
  { id: 'fluorhidrico', nombre: 'Ácido fluorhídrico', acido: 'HF', pKa: 3.17, fuente: 'Valor de libro de texto (≈3,17); no consultado en esta sesión', verificacion: 'libro' },
  { id: 'formico', nombre: 'Ácido fórmico', acido: 'HCOOH', pKa: 3.75, fuente: 'Valor de libro de texto (≈3,75); no consultado en esta sesión', verificacion: 'libro' },
  { id: 'amonio', nombre: 'Ion amonio (ácido conjugado del amoníaco)', acido: 'NH₄⁺', pKa: 9.25, fuente: 'Valor de libro de texto (≈9,25); no consultado en esta sesión', verificacion: 'libro' }
]

export function rengConcentracionH(RENG_C: number, RengKa: number, rengCat = 0, RengKw = RENG_KW_25C): number {
  if (!(RENG_C >= 0) || !(RengKa > 0) || !(rengCat >= 0)) throw new RangeError('C ≥ 0, Ka > 0, cat ≥ 0')
  const rengF = (rengH: number): number => rengH + rengCat - RengKw / rengH - (RENG_C * RengKa) / (RengKa + rengH)
  let rengLo = -20
  let rengHi = 2 + Math.log10(Math.max(1, RENG_C + rengCat))
  for (let rengI = 0; rengI < 200; rengI++) {
    const rengMid = (rengLo + rengHi) / 2
    if (rengF(10 ** rengMid) > 0) rengHi = rengMid
    else rengLo = rengMid
  }
  return 10 ** ((rengLo + rengHi) / 2)
}

export const rengPH = (rengH: number): number => -Math.log10(rengH)

export const rengPHAcido = (RENG_C: number, rengPKa: number): number => rengPH(rengConcentracionH(RENG_C, 10 ** -rengPKa))

export function rengPHBase(RENG_C: number, rengPKaConjugado: number): number {
  const RengKa = 10 ** -rengPKaConjugado
  const rengF = (rengH: number): number => rengH + (RENG_C * rengH) / (RengKa + rengH) - RENG_KW_25C / rengH
  let rengLo = -20
  let rengHi = 2
  for (let rengI = 0; rengI < 200; rengI++) {
    const rengMid = (rengLo + rengHi) / 2
    if (rengF(10 ** rengMid) > 0) rengHi = rengMid
    else rengLo = rengMid
  }
  return rengPH(10 ** ((rengLo + rengHi) / 2))
}

export interface RengPuntoValoracion {
  V: number
  pH: number
}

export function rengCurvaValoracion(RengCa: number, RengVaMl: number, rengPKa: number, RengCb: number, RengVmaxMl: number, rengN = 200): RengPuntoValoracion[] {
  if (!(RengCa > 0) || !(RengVaMl > 0) || !(RengCb > 0) || !(RengVmaxMl > 0)) throw new RangeError('Ca, Va, Cb y Vmax deben ser > 0')
  const RengKa = 10 ** -rengPKa
  const rengOut: RengPuntoValoracion[] = []
  for (let rengI = 0; rengI <= rengN; rengI++) {
    const RengVb = (RengVmaxMl * rengI) / rengN
    const RengVt = RengVaMl + RengVb
    const RENG_C = (RengCa * RengVaMl) / RengVt
    const RengNa = (RengCb * RengVb) / RengVt
    rengOut.push({ V: RengVb, pH: rengPH(rengConcentracionH(RENG_C, RengKa, RengNa)) })
  }
  return rengOut
}

export const rengVolumenEquivalencia = (RengCa: number, RengVaMl: number, RengCb: number): number => (RengCa * RengVaMl) / RengCb

export const rengPHAmortiguador = (RengCa: number, RengCs: number, rengPKa: number): number => rengPH(rengConcentracionH(RengCa + RengCs, 10 ** -rengPKa, RengCs))

export const rengHendersonHasselbalch = (RengCa: number, RengCs: number, rengPKa: number): number => rengPKa + Math.log10(RengCs / RengCa)

export function rengFracciones(rengPHval: number, rengPKa: number): { HA: number; A: number } {
  const rengR = 10 ** (rengPHval - rengPKa)
  return { HA: 1 / (1 + rengR), A: rengR / (1 + rengR) }
}
