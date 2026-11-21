import type { RengValorConUnidad } from '@shared/cuaderno'
import { RENG_ACIDOS, RENG_KW_25C, rengConcentracionH, rengPH } from '../nucleo/acidoBase'
import { rengAnalizarEquilibrio, rengFaltaEquilibrio, RENG_TOL_RESIDUO } from '../nucleo/equilibrio'
import { rengParRegistrado } from '../datos/electroquimica'
import { rengSalRegistrada } from '../datos/solubilidad'
import { rengAnalizarCelda } from '../nucleo/electroquimica'
import { rengCalibrarColorimetria, rengLeerEntradaColorimetria } from '../nucleo/colorimetria'
import type { RengResultadoMezclaAcidoBase } from '../nucleo/mezclaAcidoBase'
import { rengDatoTermo } from '../nucleo/termoquimica'
import type { RengGeometriaIsomero } from '../nucleo/isomeros'
import { rengAnalizarCeldaEntradas, rengAnalizarSolubilidadEntradas, rengCompararIsomerosEntradas, rengSemiceldaCore, RENG_ESCENAS, RENG_MODELOS_ESCENA, RENG_PRESETS_EQ, RENG_REACCIONES_TERMO, rengCalcularEscena, rengEspeciesDe, rengValidarEntradasSim, type RengEntradasSim, type RengEscena } from './modelosSimulacion'

export { rengFaltaEquilibrio }

export const RENG_TOL_BALANCE = 1e-9
export const RENG_TOL_QK = RENG_TOL_RESIDUO
export const RENG_I_MAX_IDEAL = 0.01
export const RENG_INC_RELATIVA_SUPUESTA = 0.01

export type RengTipoUnidad = 'concentracion' | 'concentracionMasica' | 'volumen' | 'tiempo' | 'temperatura' | 'masa'
export interface RengUnidadAlterna {
  simbolo: string
  aBase: (rengX: number) => number
  deBase: (rengX: number) => number
}

const rengFactor = (rengSimbolo: string, rengF: number): RengUnidadAlterna => ({ simbolo: rengSimbolo, aBase: (rengX) => rengX * rengF, deBase: (rengX) => rengX / rengF })

export const RENG_UNIDADES_SIM: Record<RengTipoUnidad, { base: string; alternas: readonly RengUnidadAlterna[] }> = {
  concentracion: { base: 'mol/L', alternas: [rengFactor('mmol/L', 1e-3), rengFactor('µmol/L', 1e-6)] },
  concentracionMasica: { base: 'mg/L', alternas: [rengFactor('g/L', 1000), rengFactor('µg/L', 1e-3)] },
  volumen: { base: 'mL', alternas: [rengFactor('L', 1000), rengFactor('µL', 1e-3)] },
  tiempo: { base: 's', alternas: [rengFactor('min', 60), rengFactor('h', 3600)] },
  temperatura: { base: 'K', alternas: [{ simbolo: '°C', aBase: (rengX) => rengX + 273.15, deBase: (rengX) => rengX - 273.15 }] },
  masa: { base: 'g', alternas: [rengFactor('kg', 1000), rengFactor('mg', 1e-3)] }
}

export function rengTipoUnidadDe(rengUnidad: string): RengTipoUnidad | null {
  for (const [rengTipo, rengD] of Object.entries(RENG_UNIDADES_SIM) as Array<[RengTipoUnidad, (typeof RENG_UNIDADES_SIM)[RengTipoUnidad]]>) if (rengD.base === rengUnidad) return rengTipo
  return null
}

export function rengConvertirUnidad(rengValor: number, rengTipo: RengTipoUnidad, rengDesde: string, rengHacia: string): number {
  const rengD = RENG_UNIDADES_SIM[rengTipo]
  const rengEnBase = rengDesde === rengD.base ? rengValor : rengD.alternas.find((rengA) => rengA.simbolo === rengDesde)?.aBase(rengValor)
  if (rengEnBase === undefined) throw new RangeError(`unidad «${rengDesde}» incompatible con ${rengTipo}`)
  if (rengHacia === rengD.base) return rengEnBase
  const rengA = rengD.alternas.find((rengX) => rengX.simbolo === rengHacia)
  if (!rengA) throw new RangeError(`unidad «${rengHacia}» incompatible con ${rengTipo}`)
  return rengA.deBase(rengEnBase)
}

export interface RengRegionValoracion {
  region: 'sin-base' | 'antes' | 'equivalencia' | 'despues'
  reactivoExceso: 'acido' | 'base' | null
  excesoMol: number
  texto: string
}

const rengMolTxt = (rengX: number): string => (rengX === 0 ? '0' : Number(rengX.toPrecision(3)).toExponential(2).replace('.', ',').replace('e', ' × 10^').replace('+', ''))

export function rengRegionValoracion(rengMolAcido: number, rengMolBase: number): RengRegionValoracion {
  if (!(rengMolAcido > 0) || !Number.isFinite(rengMolAcido) || !(rengMolBase >= 0) || !Number.isFinite(rengMolBase)) throw new RangeError('los moles de ácido deben ser > 0 y los de base ≥ 0')
  if (rengMolBase === 0) return { region: 'sin-base', reactivoExceso: 'acido', excesoMol: rengMolAcido, texto: 'Sin base añadida: todo el ácido está sin neutralizar.' }
  const rengDif = rengMolBase - rengMolAcido
  if (Math.abs(rengDif) <= RENG_TOL_BALANCE * Math.max(rengMolAcido, rengMolBase)) return { region: 'equivalencia', reactivoExceso: null, excesoMol: 0, texto: 'Equivalencia: n(base) = n(ácido); no sobra ninguno de los dos reactivos.' }
  if (rengDif < 0) return { region: 'antes', reactivoExceso: 'acido', excesoMol: -rengDif, texto: `Antes de la equivalencia: sobra ácido (${rengMolTxt(-rengDif)} mol sin neutralizar).` }
  return { region: 'despues', reactivoExceso: 'base', excesoMol: rengDif, texto: `Después de la equivalencia: sobra base (${rengMolTxt(rengDif)} mol de NaOH en exceso).` }
}

export interface RengBalancesAcidoBase {
  pH: number
  H: number
  OH: number
  Na: number
  anion: number
  neutro: number
  totalAcido: number
  volumenTotalMl: number
  fuerzaIonica: number
  residuoCarga: number
  residuoMateria: number
  relativoCarga: number
  relativoMateria: number
  cumple: boolean
  region: RengRegionValoracion
}

export function rengBalancesAcidoBase(rengIdAcido: string, rengCa: number, rengVaMl: number, rengCb: number, rengVbMl: number): RengBalancesAcidoBase {
  const rengAcido = RENG_ACIDOS.find((rengA) => rengA.id === rengIdAcido)
  if (!rengAcido) throw new RangeError(`ácido desconocido: ${rengIdAcido}`)
  const rengKa = 10 ** -rengAcido.pKa
  const rengVt = rengVaMl + rengVbMl
  const rengC = (rengCa * rengVaMl) / rengVt
  const rengNa = (rengCb * rengVbMl) / rengVt
  const rengH = rengConcentracionH(rengC, rengKa, rengNa)
  const rengOh = RENG_KW_25C / rengH
  const rengAnion = (rengC * rengKa) / (rengKa + rengH)
  const rengNeutro = (rengC * rengH) / (rengKa + rengH)
  const rengResCarga = rengH + rengNa - rengOh - rengAnion
  const rengResMateria = rengAnion + rengNeutro - rengC
  const rengRelC = Math.abs(rengResCarga) / (rengH + rengNa + rengOh + rengAnion)
  const rengRelM = Math.abs(rengResMateria) / rengC
  return {
    pH: rengPH(rengH),
    H: rengH,
    OH: rengOh,
    Na: rengNa,
    anion: rengAnion,
    neutro: rengNeutro,
    totalAcido: rengC,
    volumenTotalMl: rengVt,
    fuerzaIonica: (rengH + rengNa + rengOh + rengAnion) / 2,
    residuoCarga: rengResCarga,
    residuoMateria: rengResMateria,
    relativoCarga: rengRelC,
    relativoMateria: rengRelM,
    cumple: rengRelC <= RENG_TOL_BALANCE && rengRelM <= RENG_TOL_BALANCE,
    region: rengRegionValoracion((rengCa * rengVaMl) / 1000, (rengCb * rengVbMl) / 1000)
  }
}

export type RengQK = 'equilibrio' | 'productos' | 'reactivos' | 'indeterminado'

export function rengCompararQK(rengQ: number, rengK: number): RengQK {
  if (!(rengK > 0) || !Number.isFinite(rengK) || Number.isNaN(rengQ) || rengQ < 0) return 'indeterminado'
  if (rengQ === 0) return 'productos'
  if (rengQ === Infinity) return 'reactivos'
  const rengL = Math.log(rengQ / rengK)
  if (Math.abs(rengL) < RENG_TOL_QK) return 'equilibrio'
  return rengL < 0 ? 'productos' : 'reactivos'
}

export type RengSeveridad = 'info' | 'aviso' | 'fuera'
export interface RengDiagnosticoDominio {
  codigo: string
  severidad: RengSeveridad
  texto: string
}

const rengN = (rengX: number, rengD = 3): string => (Number.isFinite(rengX) ? String(Number(rengX.toPrecision(rengD))).replace('.', ',') : '∞')
const rengE = (rengX: number): string => rengX.toExponential(2).replace('.', ',')

export function rengDiagnosticosDominio(rengEscena: RengEscena, rengCrudas: RengEntradasSim): RengDiagnosticoDominio[] {
  const rengV = rengValidarEntradasSim(rengEscena, rengCrudas)
  if (!rengV.ok) return [{ codigo: 'entrada', severidad: 'fuera', texto: rengV.diagnostico }]
  const rengEn = rengV.entradas
  const rengSal: RengDiagnosticoDominio[] = rengV.avisos.map((rengT) => ({ codigo: 'avisos-entrada', severidad: 'aviso' as const, texto: rengT }))
  if (rengEscena === 'acidobase') {
    const rengId = String(rengEn['acido'])
    const rengVb = Number(rengEn['Vb'] ?? 0)
    const rengB = rengBalancesAcidoBase(rengId, Number(rengEn['C']), Number(rengEn['Va']), Number(rengEn['Cb']), rengVb)
    if (rengB.fuerzaIonica > RENG_I_MAX_IDEAL) rengSal.push({ codigo: 'actividades', severidad: 'aviso', texto: `Fuerza iónica estimada ${rengN(rengB.fuerzaIonica)} mol/L: por encima de ${rengN(RENG_I_MAX_IDEAL)} mol/L la aproximación «actividades ≈ concentraciones» pierde fiabilidad (la escena Mezcla ácido–base no admite más de ${rengN(RENG_I_MAX_IDEAL)} mol/L). El pH es orientativo.` })
    if (rengId === 'fosforico1' && rengVb > 0 && rengB.region.region === 'despues') rengSal.push({ codigo: 'poliprotico', severidad: 'fuera', texto: 'Más allá de la primera equivalencia el modelo no aplica: el ácido fosfórico tiene más protones disociables y aquí solo se considera el primero.' })
    if (!rengB.cumple) rengSal.push({ codigo: 'balance', severidad: 'fuera', texto: `Los balances de carga o materia no se cumplen dentro de la tolerancia (${rengE(RENG_TOL_BALANCE)}): no uses este pH.` })
  }
  if (rengEscena === 'mezcla' && Number(rengEn['cBase']) === 0) rengSal.push({ codigo: 'sin-base', severidad: 'info', texto: 'Con NaOH a 0 mol/L no hay punto de equivalencia: la mezcla equivale a diluir el ácido con agua.' })
  if (rengEscena === 'cinetica') {
    const rengO = Number(rengEn['orden'])
    const rengA0 = Number(rengEn['A0'])
    const rengK = Number(rengEn['k'])
    const rengT = Number(rengEn['t'] ?? 0)
    if (rengO === 0 && rengT > rengA0 / rengK) rengSal.push({ codigo: 'agotado', severidad: 'fuera', texto: `En orden 0 el reactivo se agota en t = ${rengN(rengA0 / rengK)} s; para t = ${rengN(rengT)} s el modelo de velocidad constante ya no aplica y [A] se fija en 0.` })
  }
  if (rengEscena === 'equilibrio') {
    const rengEsp = rengEspeciesDe(rengEn)!
    const rengFalta = rengFaltaEquilibrio(rengEsp)
    if (rengFalta.codigo === 'sin-reactivos' || rengFalta.codigo === 'sin-productos') rengSal.push({ codigo: 'falta-especie', severidad: 'info', texto: rengFalta.texto })
    const rengK = Number(rengEn['K'])
    if (rengK < 1e-6 || rengK > 1e6) rengSal.push({ codigo: 'k-extrema', severidad: 'aviso', texto: `K = ${rengE(rengK)}: con una constante tan extrema la especie minoritaria es casi indetectable y la aproximación «actividades ≈ concentraciones» importa más que el cálculo.` })
    const rengA = rengAnalizarEquilibrio(rengEsp, rengK)
    if (rengA.tipo === 'equilibrio' && !rengA.convergio) rengSal.push({ codigo: 'sin-convergencia', severidad: 'fuera', texto: `El cálculo no alcanzó la tolerancia ${rengE(RENG_TOL_RESIDUO)} (residuo ${rengE(rengA.residuo)}): las concentraciones de equilibrio son aproximadas.` })
  }
  if (rengEscena === 'colorimetria') rengSal.push(...rengCalibrarColorimetria(rengLeerEntradaColorimetria(rengEn)).diagnosticos)
  if (rengEscena === 'electroquimica') {
    const rengAn = rengParRegistrado(String(rengEn['ano']))
    const rengCa = rengParRegistrado(String(rengEn['cat']))
    rengSal.push(...rengAnalizarCeldaEntradas(rengEn).diagnosticos)
    const rengEnOtra = rengAn.otrasConValor[0]!.E0
    const rengCaOtra = rengCa.otrasConValor[0]!.E0
    const rengE0Usada = rengCa.E0 - rengAn.E0
    const rengE0Otra = rengCaOtra - rengEnOtra
    rengSal.push({ codigo: 'ele-tablas-discrepan', severidad: 'info', texto: `Con los potenciales de la otra tabla abierta que consulté (${rengCa.otrasConValor[0]!.fuente.titulo.split(',')[0]}, que no declara temperatura ni convenio), E° de esta celda sería ${String(Number(rengE0Otra.toFixed(4))).replace('.', ',')} V en vez de ${String(Number(rengE0Usada.toFixed(4))).replace('.', ',')} V (una diferencia de ${String(Number((Math.abs(rengE0Otra - rengE0Usada) * 1000).toFixed(1))).replace('.', ',')} mV). La escena usa solo la tabla que declara las condiciones (${rengCa.fuente.titulo.split(',')[0]}); esa diferencia entre tablas no se propaga.` })
    if (rengAn.id === 'h2' || rengCa.id === 'h2') rengSal.push({ codigo: 'ele-h2-sin-referencia', severidad: 'info', texto: 'La fila del electrodo de hidrógeno no cita ninguna referencia en la fuente; su 0 V es la definición del electrodo estándar de hidrógeno, que la página declara como referencia de todos los potenciales.' })
  }
  if (rengEscena === 'isomeros') {
    rengSal.push(...rengCompararIsomerosEntradas(rengEn).comparacion.diagnosticos)
    rengSal.push({ codigo: 'iso-sin-energia', severidad: 'info', texto: 'Esta escena compara geometrías, no energías: no dice cuál isómero es más estable ni más abundante.' })
  }
  if (rengEscena === 'solubilidad') {
    const rengDef = rengSalRegistrada(String(rengEn['sal']))
    rengSal.push(...rengAnalizarSolubilidadEntradas(rengEn).diagnosticos)
    rengSal.push({ codigo: 'sol-hidrolisis', severidad: rengDef.hidrolisis, texto: `${rengDef.notaModelo} El Ksp de la fuente solo respalda el equilibrio de disolución a 25 °C y fuerza iónica cero.` })
    const rengValores = [rengDef.ksp, ...rengDef.otrasConValor.map((rengO) => rengO.ksp)]
    const rengFactor = Math.max(...rengValores) / Math.min(...rengValores)
    const rengExp = 1 / (rengDef.cation.nu + rengDef.anion.nu)
    rengSal.push({ codigo: 'sol-ksp-discrepa', severidad: 'info', texto: `Las tres tablas abiertas que consulté dan para ${rengDef.formula} Ksp entre ${Math.min(...rengValores).toExponential(2).replace('.', ',')} y ${Math.max(...rengValores).toExponential(2).replace('.', ',')} (un factor ${String(Number(rengFactor.toPrecision(3))).replace('.', ',')}). La escena usa solo la de «${rengDef.fuente.titulo.split(',')[0]}» (${rengDef.kspTexto}); con el valor extremo, la solubilidad en agua pura cambiaría hasta un factor ${String(Number((rengFactor ** rengExp).toPrecision(3))).replace('.', ',')}. Esa incertidumbre entre fuentes no se propaga.` })
  }
  if (rengEscena === 'dilucion') {
    const rengVa = Number(rengEn['Va'])
    const rengVf = Number(rengEn['Vf'])
    if (Number(rengEn['modo']) === 1) rengSal.push({ codigo: 'aditivos', severidad: 'aviso', texto: `Con un volumen de disolvente igual al volumen final el total es ${rengN(rengVa + rengVf)} mL (alícuota + disolvente): no cabe en un matraz aforado de ${rengN(rengVf)} mL y se calcula suponiendo volúmenes aditivos. Para llegar al aforo se añade disolvente hasta la marca (${rengN(rengVf - rengVa)} mL).` })
    const rengObj = rengEn['c2obj']
    if (rengObj !== undefined) {
      const rengS = rengCalcularEscena('dilucion', rengEn)
      const rengDesv = Math.abs(rengS['desv']!)
      rengSal.push({ codigo: 'objetivo', severidad: 'info', texto: rengDesv < 1 ? `Alcanzas el objetivo de ${rengN(Number(rengObj))} mol/L (${rengN(rengS['c2']!)} mol/L; desviación ${rengN(rengDesv, 2)} %).` : `La concentración obtenida (${rengN(rengS['c2']!)} mol/L) se desvía ${rengN(rengDesv, 2)} % del objetivo (${rengN(Number(rengObj))} mol/L).` })
    }
  }
  if (rengEscena === 'termo') {
    const rengT = Number(rengEn['T'])
    if (Math.abs(rengT - 298.15) > 100) rengSal.push({ codigo: 'extrapolacion', severidad: 'aviso', texto: `A ${rengN(rengT)} K se extrapolan ΔH° y ΔS° medidos a 298,15 K como constantes: la diferencia de temperatura (${rengN(Math.abs(rengT - 298.15))} K) es grande y las capacidades caloríficas no se incluyen.` })
    const rengR = RENG_REACCIONES_TERMO.find((rengX) => rengX.id === rengEn['reaccion'])!
    const rengFalta = [...rengR.r.reactivos, ...rengR.r.productos].filter((rengX) => rengDatoTermo(rengX.id).S === undefined)
    if (rengFalta.length > 0) rengSal.push({ codigo: 'sin-entropia', severidad: 'fuera', texto: `No hay S° para ${rengFalta.map((rengX) => rengDatoTermo(rengX.id).formula).join(', ')}: no se calcula ΔG, K ni espontaneidad (no se inventa el dato).` })
    else {
      const rengSalida = rengCalcularEscena('termo', rengEn)
      const rengLnK = (-rengSalida['dG']! * 1000) / (8.314462618 * rengT)
      if (!Number.isFinite(rengSalida['K']) || rengSalida['K'] === 0) rengSal.push({ codigo: 'k-fuera-de-rango', severidad: 'aviso', texto: `K excede el rango numérico (ln K = ${rengN(rengLnK)}): solo es fiable el signo de ΔG.` })
    }
  }
  return rengSal
}

export const RENG_SALIDA_PRINCIPAL: Record<RengEscena, (rengEn: RengEntradasSim, rengSal: Record<string, number>) => { clave: string; nombre: string; unidad: string }> = {
  acidobase: () => ({ clave: 'pH', nombre: 'pH', unidad: '' }),
  mezcla: () => ({ clave: 'pH', nombre: 'pH', unidad: '' }),
  cinetica: () => ({ clave: 't12', nombre: 'semivida t½', unidad: 's' }),
  equilibrio: (rengEn) => {
    const rengP = RENG_PRESETS_EQ.find((rengX) => rengX.id === rengEn['reaccion'])!
    const rengI = rengP.esp.findIndex((rengX) => rengX.nu > 0)
    return { clave: `c_${rengI}`, nombre: `[${rengP.esp[rengI]!.nombre}] en el equilibrio`, unidad: 'mol/L' }
  },
  dilucion: () => ({ clave: 'c2', nombre: 'concentración final', unidad: 'mol/L' }),
  colorimetria: () => ({ clave: 'x0', nombre: 'concentración de la muestra', unidad: 'mg/L' }),
  isomeros: (_rengEn, rengSal) => (rengSal['ddist'] !== undefined ? { clave: 'ddist', nombre: 'diferencia de distancia (B − A)', unidad: 'Å' } : rengSal['dA'] !== undefined ? { clave: 'dA', nombre: 'distancia primero–último en A', unidad: 'Å' } : { clave: 'nA', nombre: 'átomos elegidos en A', unidad: '' }),
  electroquimica: (_rengEn, rengSal) => (rengSal['E'] !== undefined ? { clave: 'E', nombre: 'potencial de la celda (Nernst)', unidad: 'V' } : { clave: 'E0', nombre: 'E° de la celda', unidad: 'V' }),
  solubilidad: (_rengEn, rengSal) => (rengSal['x']! > 0 ? { clave: 'x', nombre: 'cantidad que precipita', unidad: 'mol/L' } : { clave: 's', nombre: 'solubilidad molar con los iones presentes', unidad: 'mol/L' }),
  termo: (_rengEn, rengSal) => (rengSal['dG'] !== undefined ? { clave: 'dG', nombre: 'ΔG', unidad: 'kJ' } : { clave: 'q', nombre: 'calor liberado', unidad: 'kJ' })
}

export interface RengFilaSensibilidad {
  clave: string
  etiqueta: string
  unidad: string
  cambioPorCiento: number
  contribucion: number
}

export interface RengSensibilidad {
  salida: { clave: string; nombre: string; unidad: string }
  valor: number
  filas: RengFilaSensibilidad[]
  incertidumbre: number
  incRelativa: number
  omitidas: string[]
}

export function rengSensibilidadEscena(rengEscena: RengEscena, rengCrudas: RengEntradasSim, rengIncRelativa = RENG_INC_RELATIVA_SUPUESTA): RengSensibilidad {
  const rengV = rengValidarEntradasSim(rengEscena, rengCrudas)
  if (!rengV.ok) throw new RangeError(rengV.diagnostico)
  const rengBase = rengCalcularEscena(rengEscena, rengV.entradas)
  const rengSalida = RENG_SALIDA_PRINCIPAL[rengEscena](rengV.entradas, rengBase)
  const rengY0 = rengBase[rengSalida.clave]
  if (rengY0 === undefined) throw new RangeError(`No hay ${rengSalida.nombre} que analizar: el cálculo no produjo ese resultado con estos datos.`)
  const rengH = 0.01
  const rengFilas: RengFilaSensibilidad[] = []
  const rengOmitidas: string[] = []
  for (const rengC of RENG_MODELOS_ESCENA[rengEscena].campos) {
    const rengX = rengV.entradas[rengC.clave]
    if (typeof rengX !== 'number' || (rengC.unidad === '' && rengC.sensible !== true) || rengC.clave === 't' || rengC.clave === 'orden' || rengX === 0) continue
    const rengEvaluar = (rengF: number): number | null => {
      try {
        return rengCalcularEscena(rengEscena, { ...rengV.entradas, [rengC.clave]: rengX * rengF })[rengSalida.clave] ?? null
      } catch {
        return null
      }
    }
    const rengMas = rengEvaluar(1 + rengH)
    const rengMenos = rengEvaluar(1 - rengH)
    if (rengMas === null && rengMenos === null) {
      rengOmitidas.push(rengC.etiqueta)
      continue
    }
    const rengD = rengMas !== null && rengMenos !== null ? (rengMas - rengMenos) / 2 : rengMas !== null ? rengMas - rengY0 : rengY0 - rengMenos!
    const rengDelta = rengIncRelativa / rengH
    rengFilas.push({ clave: rengC.clave, etiqueta: rengC.etiqueta, unidad: rengC.unidad, cambioPorCiento: rengD, contribucion: Math.abs(rengD) * rengDelta })
  }
  const rengFiltradas = rengFilas.filter((rengF) => rengF.contribucion > 1e-12 * Math.max(1, Math.abs(rengY0)))
  return { salida: rengSalida, valor: rengY0, filas: rengFiltradas, incertidumbre: Math.sqrt(rengFiltradas.reduce((rengS, rengF) => rengS + rengF.contribucion ** 2, 0)), incRelativa: rengIncRelativa, omitidas: rengOmitidas }
}

export interface RengResumenEscena {
  ok: boolean
  resultados: RengValorConUnidad[]
  diagnosticos: RengDiagnosticoDominio[]
}

const RENG_UNIDAD_K_ORDEN = ['mol/(L·s)', '1/s', 'L/(mol·s)']

export function rengResumenEscena(rengEscena: RengEscena, rengCrudas: RengEntradasSim): RengResumenEscena {
  const rengV = rengValidarEntradasSim(rengEscena, rengCrudas)
  if (!rengV.ok) return { ok: false, resultados: [], diagnosticos: [{ codigo: 'entrada', severidad: 'fuera', texto: rengV.diagnostico }] }
  const rengS = rengCalcularEscena(rengEscena, rengV.entradas)
  const rengR: RengValorConUnidad[] = []
  const rengAnadir = (rengClave: string, rengNombre: string, rengUnidad: string, rengValor: number | undefined): void => {
    if (rengValor !== undefined && Number.isFinite(rengValor)) rengR.push({ clave: rengClave, nombre: rengNombre, valor: rengValor, unidad: rengUnidad })
  }
  if (rengEscena === 'acidobase') {
    const rengB = rengBalancesAcidoBase(String(rengV.entradas['acido']), Number(rengV.entradas['C']), Number(rengV.entradas['Va']), Number(rengV.entradas['Cb']), 0)
    rengAnadir('pH', 'pH de la disolución', '', rengS['pH'])
    rengAnadir('H', '[H⁺]', 'mol/L', rengB.H)
    rengAnadir('Veq', 'Volumen de equivalencia', 'mL', rengS['Veq'])
    rengAnadir('pHVb', 'pH en el punto de la curva', '', rengS['pHVb'])
  } else if (rengEscena === 'mezcla') {
    rengAnadir('pH', 'pH de la mezcla', '', rengS['pH'])
    rengAnadir('Veq', 'Volumen de equivalencia', 'mL', rengS['Veq'])
    rengAnadir('Vtotal', 'Volumen total', 'mL', rengS['Vtotal'])
  } else if (rengEscena === 'cinetica') {
    rengAnadir('t12', 'Semivida t½', 's', rengS['t12'])
    rengAnadir('At', '[A] en el instante t', 'mol/L', rengS['At'])
  } else if (rengEscena === 'equilibrio') {
    const rengP = RENG_PRESETS_EQ.find((rengX) => rengX.id === rengV.entradas['reaccion'])!
    rengAnadir('Q0', 'Q inicial', '', rengS['Q0'])
    rengP.esp.forEach((rengEsp, rengI) => rengAnadir(`c_${rengI}`, `[${rengEsp.nombre}] en el equilibrio`, 'mol/L', rengS[`c_${rengI}`]))
    rengAnadir('xi', 'Avance ξ', 'mol/L', rengS['xi'])
  } else if (rengEscena === 'electroquimica') {
    rengAnadir('E0', 'E° de la celda', 'V', rengS['E0'])
    rengAnadir('n', 'Electrones intercambiados', '', rengS['n'])
    rengAnadir('dG0', 'ΔG° de la reacción', 'kJ', rengS['dG0'])
    rengAnadir('lnK', 'ln K', '', rengS['lnK'])
    rengAnadir('K', 'Constante de equilibrio K', '', rengS['K'])
    rengAnadir('Q', 'Q (cociente de reacción)', '', rengS['Q'])
    rengAnadir('E', 'Potencial de la celda con concentraciones (Nernst)', 'V', rengS['E'])
    rengAnadir('dG', 'ΔG con concentraciones', 'kJ', rengS['dG'])
  } else if (rengEscena === 'isomeros') {
    rengAnadir('nA', 'Átomos elegidos en A', '', rengS['nA'])
    rengAnadir('nB', 'Átomos elegidos en B', '', rengS['nB'])
    rengAnadir('dA', 'Distancia primero–último en A', 'Å', rengS['dA'])
    rengAnadir('dB', 'Distancia primero–último en B', 'Å', rengS['dB'])
    rengAnadir('angA', 'Ángulo en el segundo átomo de A', '°', rengS['angA'])
    rengAnadir('angB', 'Ángulo en el segundo átomo de B', '°', rengS['angB'])
    rengAnadir('ang2A', 'Ángulo en el tercer átomo de A', '°', rengS['ang2A'])
    rengAnadir('ang2B', 'Ángulo en el tercer átomo de B', '°', rengS['ang2B'])
    rengAnadir('dieA', 'Diedro en A', '°', rengS['dieA'])
    rengAnadir('dieB', 'Diedro en B', '°', rengS['dieB'])
    rengAnadir('ddist', 'Diferencia de distancia (B − A)', 'Å', rengS['ddist'])
    rengAnadir('dang', 'Diferencia del primer ángulo (B − A)', '°', rengS['dang'])
    rengAnadir('dang2', 'Diferencia del segundo ángulo (B − A)', '°', rengS['dang2'])
    rengAnadir('ddie', 'Diferencia de diedro (B − A, con vuelta)', '°', rengS['ddie'])
    rengAnadir('mayor', 'Distancia mayor (−1 A, 0 iguales, 1 B)', '', rengS['mayor'])
  } else if (rengEscena === 'solubilidad') {
    rengAnadir('q', 'Q (producto iónico inicial)', '', rengS['q'])
    rengAnadir('ksp', 'Ksp de la fuente', '', rengS['ksp'])
    rengAnadir('s0', 'Solubilidad molar en agua pura', 'mol/L', rengS['s0'])
    rengAnadir('s', 'Solubilidad molar con los iones presentes', 'mol/L', rengS['s'])
    rengAnadir('x', 'Cantidad que precipita', 'mol/L', rengS['x'])
    rengAnadir('d', 'Cantidad de sólido que se disuelve', 'mol/L', rengS['d'])
    rengAnadir('cMf', 'Concentración final del catión', 'mol/L', rengS['cMf'])
    rengAnadir('cAf', 'Concentración final del anión', 'mol/L', rengS['cAf'])
    rengAnadir('I', 'Fuerza iónica estimada (solo iones del equilibrio)', 'mol/L', rengS['I'])
  } else if (rengEscena === 'colorimetria') {
    rengAnadir('x0', 'Concentración de la muestra', 'mg/L', rengS['x0'])
    rengAnadir('u', 'Incertidumbre típica de la concentración', 'mg/L', rengS['u'])
    rengAnadir('m', 'Pendiente de la recta', 'L/mg', rengS['m'])
    rengAnadir('b', 'Ordenada de la recta', '', rengS['b'])
    rengAnadir('r2', 'R²', '', rengS['r2'])
    rengAnadir('sr', 'Desviación típica de la regresión', '', rengS['sr'])
    rengAnadir('Ablanco', 'Absorbancia media del blanco', '', rengS['Ablanco'])
    rengAnadir('Cmin', 'Concentración mínima de los patrones', 'mg/L', rengS['Cmin'])
    rengAnadir('Cmax', 'Concentración máxima de los patrones', 'mg/L', rengS['Cmax'])
  } else if (rengEscena === 'dilucion') {
    rengAnadir('n', 'Moles de soluto (alícuota y matraz)', 'mol', rengS['n'])
    rengAnadir('c2', 'Concentración final', 'mol/L', rengS['c2'])
    rengAnadir('F', 'Factor de dilución', '', rengS['F'])
    rengAnadir('Vdis', 'Disolvente añadido', 'mL', rengS['Vdis'])
    rengAnadir('Vtotal', 'Volumen total', 'mL', rengS['Vtotal'])
    rengAnadir('desv', 'Desviación respecto del objetivo', '%', rengS['desv'])
  } else {
    rengAnadir('dH', 'ΔH° de la reacción', 'kJ', rengS['dH'])
    rengAnadir('q', 'Calor liberado', 'kJ', rengS['q'])
    rengAnadir('dS', 'ΔS°', 'J/K', rengS['dS'])
    rengAnadir('dG', 'ΔG a la temperatura indicada', 'kJ', rengS['dG'])
    rengAnadir('K', 'Constante de equilibrio K', '', rengS['K'])
  }
  return { ok: true, resultados: rengR, diagnosticos: rengDiagnosticosDominio(rengEscena, rengV.entradas) }
}

export const rengUnidadK = (rengOrden: number): string => RENG_UNIDAD_K_ORDEN[rengOrden] ?? ''

export function rengEscenaValida(rengId: string): rengId is RengEscena {
  return (RENG_ESCENAS as readonly string[]).includes(rengId)
}

export interface RengBalancesMezcla {
  relativoCarga: number
  relativoMateria: number
  cumple: boolean
  materiaPorConstruccion: boolean
}

export function rengVerificarBalancesMezcla(rengR: RengResultadoMezclaAcidoBase, rengAcido: 'hcl' | 'acetico'): RengBalancesMezcla {
  const rengTotalIones = rengR.especies.filter((rengX) => rengX.carga !== 0).reduce((rengS, rengX) => rengS + rengX.concentracion, 0)
  const rengTotalAcido = rengR.volumenTotalMl > 0 ? rengR.molesAcido / (rengR.volumenTotalMl / 1000) : 0
  const rengRelC = rengTotalIones > 0 ? Math.abs(rengR.residuoCarga) / rengTotalIones : 0
  const rengRelM = rengTotalAcido > 0 ? Math.abs(rengR.residuoAcido) / rengTotalAcido : 0
  return { relativoCarga: rengRelC, relativoMateria: rengRelM, cumple: rengRelC <= RENG_TOL_BALANCE && rengRelM <= RENG_TOL_BALANCE, materiaPorConstruccion: rengAcido === 'hcl' }
}

const rengCifras = (rengX: number): string => String(Number(rengX.toPrecision(6))).replace('.', ',')

export function rengEntradasLegibles(rengEscena: RengEscena, rengEntradas: RengEntradasSim): string[] {
  const rengSal: string[] = []
  if (rengEscena === 'colorimetria') {
    try {
      const rengC = rengLeerEntradaColorimetria(rengEntradas)
      return [`blancos: ${rengC.blancos.map(rengCifras).join('; ')}`, `patrones (mg/L → A): ${rengC.patrones.map((rengP) => `${rengCifras(rengP.c)} → ${rengCifras(rengP.a)}`).join('; ')}`, `muestra: A = ${rengCifras(rengC.muestra)}`, `réplicas de la muestra: ${rengC.replicas}`]
    } catch {
      return ['datos de colorimetría incompletos']
    }
  }
  if (rengEscena === 'isomeros') {
    try {
      const rengCmp = rengCompararIsomerosEntradas(rengEntradas)
      const rengEt = (rengG: RengGeometriaIsomero, rengSel: readonly number[]): string => (rengSel.length === 0 ? 'ningún átomo' : rengSel.map((rengI) => rengG.atomos[rengI]!.etiqueta).join(', '))
      return [`pareja: ${rengCmp.par.titulo}`, `átomos de A (${rengCmp.a.nombre}): ${rengEt(rengCmp.a, rengCmp.seleccion.a)}`, `átomos de B (${rengCmp.b.nombre}): ${rengEt(rengCmp.b, rengCmp.seleccion.b)}`]
    } catch {
      return ['datos de isómeros incompletos']
    }
  }
  for (const rengC of RENG_MODELOS_ESCENA[rengEscena].campos) {
    const rengV = rengEntradas[rengC.clave]
    if (rengV === undefined) continue
    if (rengEscena === 'electroquimica' && (rengC.clave === 'ano' || rengC.clave === 'cat')) {
      const rengPar = rengParRegistrado(String(rengV))
      rengSal.push(`${rengC.clave === 'ano' ? 'ánodo propuesto' : 'cátodo propuesto'}: ${rengPar.oxidante.formula}/${rengPar.reductor.formula}`)
    } else if (rengEscena === 'solubilidad' && rengC.clave === 'sal') rengSal.push(`sal: ${rengSalRegistrada(String(rengV)).formula}`)
    else if (rengC.clave === 'acido') rengSal.push(`ácido: ${RENG_ACIDOS.find((rengA) => rengA.id === rengV)?.acido ?? String(rengV)}`)
    else if (rengC.clave === 'reaccion') rengSal.push(`reacción: ${(RENG_PRESETS_EQ.find((rengP) => rengP.id === rengV)?.nombre ?? RENG_REACCIONES_TERMO.find((rengP) => rengP.id === rengV)?.nombre ?? String(rengV)).replace(/\s{2,}.*$/, '')}`)
    else if (rengEscena === 'dilucion' && rengC.clave === 'modo' && typeof rengV === 'number') rengSal.push(rengV === 1 ? 'completa con un volumen de disolvente igual al final' : 'completa con disolvente hasta el aforo')
    else if (rengEscena === 'dilucion' && rengC.clave === 'Vdisp') continue
    else if (rengEscena === 'equilibrio' && rengC.clave === 'quien' && typeof rengV === 'number') {
      const rengEsp = RENG_PRESETS_EQ.find((rengP) => rengP.id === rengEntradas['reaccion'])?.esp[rengV]
      const rengDelta = Number(rengEntradas['delta'] ?? 0)
      if (rengEsp) rengSal.push(`${rengDelta < 0 ? 'quitar' : 'añadir'} ${rengCifras(Math.abs(rengDelta))} mol/L de ${rengEsp.nombre}`)
    } else if (rengEscena === 'equilibrio' && rengC.clave === 'delta') continue
    else if (rengEscena === 'equilibrio' && /^c0_\d$/.test(rengC.clave) && typeof rengV === 'number') {
      const rengEsp = RENG_PRESETS_EQ.find((rengP) => rengP.id === rengEntradas['reaccion'])?.esp[Number(rengC.clave.slice(3))]
      if (rengEsp) rengSal.push(`[${rengEsp.nombre}] inicial: ${rengCifras(rengV)} mol/L`)
    } else if (typeof rengV === 'number') rengSal.push(`${/^\p{Lu}\p{Ll}*\p{Lu}/u.test(rengC.etiqueta) ? rengC.etiqueta : rengC.etiqueta.charAt(0).toLowerCase() + rengC.etiqueta.slice(1)}: ${rengCifras(rengV)}${rengC.unidad && rengC.unidad !== 'según el orden' ? ` ${rengC.unidad}` : ''}`)
  }
  return rengSal
}
