import { rengConcentracionH, rengPH, rengVolumenEquivalencia } from './acidoBase'

export const RENG_MODELO_MEZCLA_ACIDO_BASE = 'mezcla-acido-base-ideal-v1'
export const RENG_TEMPERATURA_MEZCLA_C = 25
export const RENG_PKW_MEZCLA = 13.99
const RENG_KW = 10 ** -RENG_PKW_MEZCLA
export const RENG_KA_ACETICO_MEZCLA = 1.754e-5

export const RENG_LIMITES_MEZCLA_ACIDO_BASE = { concentracionMax: 0.01, volumenAcidoMinMl: 0.1, volumenMaxMl: 1000 } as const

export interface RengEntradaMezclaAcidoBase {
  acido: 'hcl' | 'acetico'
  concentracionAcido: number
  volumenAcidoMl: number
  concentracionBase: number
  volumenBaseMl: number
}

export interface RengEspecieMezcla {
  formula: string
  carga: number
  concentracion: number
}

export interface RengResultadoMezclaAcidoBase {
  pH: number
  volumenTotalMl: number
  volumenEquivalenciaMl: number | null
  especies: RengEspecieMezcla[]
  molesAcido: number
  molesBase: number
  residuoCarga: number
  residuoAcido: number
  fuerzaIonica: number
}

export interface RengPuntoMezclaAcidoBase {
  volumenBaseMl: number
  pH: number
}

const rengEnRango = (rengValor: number, rengMin: number, rengMax: number): boolean => Number.isFinite(rengValor) && rengValor >= rengMin && rengValor <= rengMax

function rengValidarEntrada({ acido: rengAcido, concentracionAcido: rengConcentracionAcido, concentracionBase: rengConcentracionBase, volumenAcidoMl: rengVolumenAcidoMl, volumenBaseMl: rengVolumenBaseMl }: RengEntradaMezclaAcidoBase): void {
  const { concentracionMax: rengConcentracionMax, volumenAcidoMinMl: rengVolumenAcidoMinMl, volumenMaxMl: rengVolumenMaxMl } = RENG_LIMITES_MEZCLA_ACIDO_BASE
  if (rengAcido !== 'hcl' && rengAcido !== 'acetico') throw new RangeError('El modelo admite ácido clorhídrico o ácido acético.')
  if (!rengEnRango(rengConcentracionAcido, 0, rengConcentracionMax) || !rengEnRango(rengConcentracionBase, 0, rengConcentracionMax)) {
    throw new RangeError('Introduce ambas concentraciones iniciales entre 0 y 0,01 mol/L para calcular una mezcla diluida.')
  }
  if (!rengEnRango(rengVolumenAcidoMl, rengVolumenAcidoMinMl, rengVolumenMaxMl) || !rengEnRango(rengVolumenBaseMl, 0, rengVolumenMaxMl)) {
    throw new RangeError('Introduce de 0,1 a 1000 mL de disolución ácida y de 0 a 1000 mL de disolución básica.')
  }
}

export function rengResolverMezclaAcidoBase(rengEntrada: RengEntradaMezclaAcidoBase): RengResultadoMezclaAcidoBase {
  rengValidarEntrada(rengEntrada)
  const { acido: rengAcido, concentracionAcido: rengConcentracionAcido, concentracionBase: rengConcentracionBase, volumenAcidoMl: rengVolumenAcidoMl, volumenBaseMl: rengVolumenBaseMl } = rengEntrada
  const rengVolumenTotalMl = rengVolumenAcidoMl + rengVolumenBaseMl
  const rengVolumenL = rengVolumenTotalMl / 1000
  const rengMolesAcido = rengConcentracionAcido * (rengVolumenAcidoMl / 1000)
  const rengMolesBase = rengConcentracionBase * (rengVolumenBaseMl / 1000)
  const rengTotalAcido = rengMolesAcido / rengVolumenL
  const rengSodio = rengMolesBase / rengVolumenL
  let rengH: number
  let rengAnion: RengEspecieMezcla
  const rengEspeciesNeutras: RengEspecieMezcla[] = []

  if (rengAcido === 'hcl') {
    const rengExcesoAcido = (rengMolesAcido - rengMolesBase) / rengVolumenL
    const rengRaiz = Math.hypot(rengExcesoAcido, 2 * Math.sqrt(RENG_KW))
    rengH = rengExcesoAcido >= 0 ? (rengExcesoAcido + rengRaiz) / 2 : (2 * RENG_KW) / (rengRaiz - rengExcesoAcido)
    rengAnion = { formula: 'Cl⁻', carga: -1, concentracion: rengTotalAcido }
  } else {
    rengH = rengConcentracionH(rengTotalAcido, RENG_KA_ACETICO_MEZCLA, rengSodio, RENG_KW)
    const rengSuma = RENG_KA_ACETICO_MEZCLA + rengH
    rengAnion = { formula: 'CH₃COO⁻', carga: -1, concentracion: rengTotalAcido * (RENG_KA_ACETICO_MEZCLA / rengSuma) }
    rengEspeciesNeutras.push({ formula: 'CH₃COOH', carga: 0, concentracion: rengTotalAcido * (rengH / rengSuma) })
  }

  const rengOh = RENG_KW / rengH
  const rengEspecies = [
    { formula: 'H₃O⁺', carga: 1, concentracion: rengH },
    { formula: 'OH⁻', carga: -1, concentracion: rengOh },
    { formula: 'Na⁺', carga: 1, concentracion: rengSodio },
    rengAnion,
    ...rengEspeciesNeutras
  ]
  const rengVolumenEq = rengConcentracionAcido > 0 && rengConcentracionBase > 0 ? rengVolumenEquivalencia(rengConcentracionAcido, rengVolumenAcidoMl, rengConcentracionBase) : null
  return {
    pH: rengPH(rengH),
    volumenTotalMl: rengVolumenTotalMl,
    volumenEquivalenciaMl: rengVolumenEq,
    especies: rengEspecies,
    molesAcido: rengMolesAcido,
    molesBase: rengMolesBase,
    residuoCarga: (rengH + rengSodio) - (rengOh + rengAnion.concentracion),
    residuoAcido: rengAnion.concentracion + (rengEspeciesNeutras[0]?.concentracion ?? 0) - rengTotalAcido,
    fuerzaIonica: (rengH + rengSodio + rengOh + rengAnion.concentracion) / 2
  }
}

export function rengCurvaMezclaAcidoBase(rengEntrada: RengEntradaMezclaAcidoBase): RengPuntoMezclaAcidoBase[] {
  const rengActual = rengResolverMezclaAcidoBase(rengEntrada)
  const { volumenAcidoMl: rengVolumenAcidoMl, volumenBaseMl: rengVolumenBaseMl } = rengEntrada
  const rengEquivalencia = rengActual.volumenEquivalenciaMl
  const rengMaximo = Math.min(RENG_LIMITES_MEZCLA_ACIDO_BASE.volumenMaxMl, Math.max(1, rengVolumenAcidoMl, 1.2 * rengVolumenBaseMl, 2 * (rengEquivalencia ?? 0)))
  const rengMuestras = Array.from({ length: 161 }, (_, rengI) => rengMaximo * (rengI / 160))
  const rengCercaEquivalencia = rengEquivalencia === null ? [] : [0.99, 0.999, 1, 1.001, 1.01].map((rengFactor) => rengFactor * rengEquivalencia)
  const rengVolumenes = [...new Set([...rengMuestras, rengVolumenBaseMl, ...rengCercaEquivalencia.filter((rengV) => rengV <= rengMaximo)])].sort((rengA, rengB) => rengA - rengB)
  return rengVolumenes.map((rengVolumen) => ({
    volumenBaseMl: rengVolumen,
    pH: rengVolumen === rengVolumenBaseMl ? rengActual.pH : rengResolverMezclaAcidoBase({ ...rengEntrada, volumenBaseMl: rengVolumen }).pH
  }))
}
