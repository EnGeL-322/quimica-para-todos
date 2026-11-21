import type { RengDatosCorrida, RengMagnitud, RengModeloCorrida, RengValorConUnidad } from '@shared/cuaderno'
import { rengCurvaMezclaAcidoBase, RENG_KA_ACETICO_MEZCLA, RENG_MODELO_MEZCLA_ACIDO_BASE, RENG_PKW_MEZCLA, rengResolverMezclaAcidoBase, RENG_TEMPERATURA_MEZCLA_C, type RengEntradaMezclaAcidoBase } from './nucleo/mezclaAcidoBase'

export const RENG_MODELO_VALORACION: RengModeloCorrida = {
  id: 'mezcla-acido-base',
  version: '1',
  nombre: 'Valoración ácido–base con NaOH (disolución acuosa diluida ideal, 25 °C)',
  metodo: `Equilibrio de la mezcla con balances de materia y carga, Kw (pKw = ${RENG_PKW_MEZCLA.toLocaleString('es')}) y, para el ácido acético, Ka = ${RENG_KA_ACETICO_MEZCLA.toExponential(3).replace('.', ',').replace(/e-(\d+)/, (_, rengN: string) => ` × 10⁻${[...rengN].map((rengD) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(rengD)]).join('')}`)}; HCl y NaOH totalmente disociados; volúmenes aditivos; actividades ≈ concentraciones; sin CO₂. Modelo interno ${RENG_MODELO_MEZCLA_ACIDO_BASE}.`,
  evidencia: 'calculo-verificado',
  verificacion: 'Contrastado con expresiones analíticas (HCl antes y después de la equivalencia, ácido acético inicial, en semiequivalencia y en equivalencia) y con la conservación de materia y carga (tests/quimica/mezcla-acido-base.test.ts). No comparado con mediciones.'
}

export const RENG_FUENTES_VALORACION = [
  'IAPWS R11-24, tabla 3 (pKw a 25 °C y 0,1 MPa): https://iapws.org/technical-guidance/release/Ionization.download',
  'H. S. Harned y R. W. Ehlers (1933), tabla II (Ka del ácido acético a 25 °C): https://doi.org/10.1021/ja01329a027'
]

export const RENG_COLUMNAS_VALORACION: RengMagnitud[] = [
  { clave: 'V_NaOH', nombre: 'volumen de NaOH añadido', unidad: 'mL' },
  { clave: 'pH', nombre: 'pH', unidad: '' }
]

const RENG_NOMBRE_ACIDO = { hcl: 'ácido clorhídrico (HCl)', acetico: 'ácido acético (CH₃COOH)' } as const

export function rengCorridaValoracion(rengE: RengEntradaMezclaAcidoBase): RengDatosCorrida {
  const rengParametros: RengValorConUnidad[] = [
    { clave: 'acido', nombre: `Ácido: ${RENG_NOMBRE_ACIDO[rengE.acido] ?? '?'} (0 = HCl, 1 = acético)`, valor: rengE.acido === 'acetico' ? 1 : 0, unidad: '' },
    { clave: 'cAcido', nombre: 'Concentración inicial del ácido', valor: rengE.concentracionAcido, unidad: 'mol/L' },
    { clave: 'VAcido', nombre: 'Volumen de disolución ácida', valor: rengE.volumenAcidoMl, unidad: 'mL' },
    { clave: 'cBase', nombre: 'Concentración inicial de NaOH', valor: rengE.concentracionBase, unidad: 'mol/L' },
    { clave: 'VBase', nombre: 'Volumen de NaOH añadido (punto actual)', valor: rengE.volumenBaseMl, unidad: 'mL' },
    { clave: 'T', nombre: 'Temperatura', valor: RENG_TEMPERATURA_MEZCLA_C, unidad: '°C' }
  ].filter((rengP) => Number.isFinite(rengP.valor))
  const rengBase = {
    disciplina: 'quimica' as const,
    modelo: { ...RENG_MODELO_VALORACION, nombre: `${RENG_MODELO_VALORACION.nombre}: ${RENG_NOMBRE_ACIDO[rengE.acido] ?? 'ácido no admitido'}` },
    parametros: rengParametros,
    fuentes: RENG_FUENTES_VALORACION,
    origen: { modulo: 'simulador-quimica', sub: 'mezcla', entradas: Object.fromEntries(rengParametros.map((rengP) => [rengP.clave, rengP.valor])) }
  }
  let rengR: ReturnType<typeof rengResolverMezclaAcidoBase>
  let rengCurva: ReturnType<typeof rengCurvaMezclaAcidoBase>
  try {
    rengR = rengResolverMezclaAcidoBase(rengE)
    rengCurva = rengCurvaMezclaAcidoBase(rengE)
  } catch (rengErr) {
    if (!(rengErr instanceof RangeError)) throw rengErr
    return { ...rengBase, muestreo: 'No se calculó: hay entradas fuera del dominio del modelo.', serie: { columnas: RENG_COLUMNAS_VALORACION, filas: [] }, resultados: [], diagnosticos: [rengErr.message], estado: 'entrada-invalida' }
  }
  const rengResultados: RengValorConUnidad[] = [
    { clave: 'pH', nombre: 'pH en el punto actual', valor: rengR.pH, unidad: '' },
    ...(rengR.volumenEquivalenciaMl === null ? [] : [{ clave: 'Veq', nombre: 'Volumen de equivalencia', valor: rengR.volumenEquivalenciaMl, unidad: 'mL' }]),
    { clave: 'nAcido', nombre: 'Ácido introducido', valor: rengR.molesAcido, unidad: 'mol' },
    { clave: 'nBase', nombre: 'NaOH introducido', valor: rengR.molesBase, unidad: 'mol' },
    { clave: 'I', nombre: 'Fuerza iónica estimada', valor: rengR.fuerzaIonica, unidad: 'mol/L' },
    { clave: 'resCarga', nombre: 'Residuo del balance de carga', valor: rengR.residuoCarga, unidad: 'mol/L' },
    { clave: 'resMateria', nombre: 'Residuo del balance de materia del ácido', valor: rengR.residuoAcido, unidad: 'mol/L' }
  ]
  const rengDiagnosticos: string[] = []
  if (rengR.volumenEquivalenciaMl === null) rengDiagnosticos.push('Sin NaOH (concentración 0) no hay punto de equivalencia: la curva es la dilución del ácido con agua.')
  return {
    ...rengBase,
    muestreo: `${rengCurva.length} volúmenes de NaOH: 161 iguales entre 0 y ${Number(rengCurva[rengCurva.length - 1]!.volumenBaseMl.toPrecision(5))} mL, más el punto actual y los cercanos a la equivalencia. Cada pH es un equilibrio independiente (no hay paso de tiempo).`,
    serie: { columnas: RENG_COLUMNAS_VALORACION, filas: rengCurva.map((rengP) => [rengP.volumenBaseMl, rengP.pH]) },
    resultados: rengResultados,
    diagnosticos: rengDiagnosticos,
    estado: 'calculado'
  }
}
