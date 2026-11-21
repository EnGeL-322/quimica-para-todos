import { RENG_PATRON_ID_ESCENA_N1, type RengLecturaEscenaN1, type RengModeloEscenaN1, type RengValoresEscenaN1 } from './tipos'

export function rengValoresInicialesN1(rengM: RengModeloEscenaN1): RengValoresEscenaN1 {
  return Object.fromEntries(rengM.parametros.map((rengP) => [rengP.clave, rengP.inicial]))
}

export function rengAjustarValorN1(rengM: RengModeloEscenaN1, rengClave: string, rengBruto: number, rengAnterior: number): number {
  const rengP = rengM.parametros.find((rengX) => rengX.clave === rengClave)
  if (!rengP || !Number.isFinite(rengBruto)) return rengAnterior
  return Math.min(rengP.max, Math.max(rengP.min, rengBruto))
}

export function rengValoresDeCasoN1(rengM: RengModeloEscenaN1, rengBase: RengValoresEscenaN1, rengCaso: RengModeloEscenaN1['casos'][number]): RengValoresEscenaN1 {
  const rengSalida: Record<string, number> = { ...rengBase }
  for (const [rengK, rengV] of Object.entries(rengCaso.valores)) if (rengV !== undefined) rengSalida[rengK] = rengAjustarValorN1(rengM, rengK, rengV, rengBase[rengK] ?? Number.NaN)
  return rengSalida
}

export function rengTiempoSiguienteN1(rengM: RengModeloEscenaN1, rengT: number, rengSegundosReales: number): number {
  if (!rengM.tiempo) return 0
  const rengDt = Math.max(0, Math.min(rengSegundosReales, 0.25)) * rengM.tiempo.porSegundo
  return Math.min(rengM.tiempo.final, rengT + rengDt)
}

export function rengFormatoLecturaN1(rengValor: number, rengCifras: number): string {
  if (!Number.isFinite(rengValor)) return '—'
  if (rengValor === 0) return '0'
  const rengA = Math.abs(rengValor)
  const rengTexto = rengA >= 1e5 || rengA < 1e-3 ? rengValor.toExponential(Math.max(0, rengCifras - 1)).replace('e', '·10^') : String(Number(rengValor.toPrecision(rengCifras)))
  return rengTexto.replace('.', ',').replace(/^-/, '−')
}

export interface RengLecturaCompletaN1 {
  lecturas: RengLecturaEscenaN1[]
  palabras: string
  problemas: string[]
}

export function rengLeerEscenaN1(rengM: RengModeloEscenaN1, rengV: RengValoresEscenaN1, rengT: number): RengLecturaCompletaN1 {
  const rengProblemas: string[] = []
  let rengCrudas: RengValoresEscenaN1 = {}
  try {
    rengCrudas = rengM.lecturas(rengV, rengT)
  } catch (rengE) {
    rengProblemas.push(`el modelo falló al calcular: ${rengE instanceof Error ? rengE.message : 'error'}`)
  }
  const rengLecturas = rengM.magnitudes.map((rengG) => {
    const rengValor = rengCrudas[rengG.clave]
    if (rengValor === undefined) rengProblemas.push(`falta la magnitud «${rengG.etiqueta}»`)
    else if (!Number.isFinite(rengValor)) rengProblemas.push(`la magnitud «${rengG.etiqueta}» no es un número finito`)
    return { ...rengG, valor: rengValor ?? Number.NaN }
  })
  let rengPalabras = ''
  if (rengProblemas.length === 0) {
    try {
      rengPalabras = rengM.enPalabras(rengV, rengT, rengCrudas).trim()
    } catch {
      rengPalabras = ''
    }
    if (rengPalabras.length < 25) rengProblemas.push('falta la descripción «En palabras»')
    else if (/NaN|undefined|Infinity/.test(rengPalabras)) rengProblemas.push('la descripción «En palabras» contiene valores no válidos')
  }
  return { lecturas: rengLecturas, palabras: rengPalabras, problemas: rengProblemas }
}

export function rengValidarModeloEscenaN1(rengM: RengModeloEscenaN1): string[] {
  const rengP: string[] = []
  if (!RENG_PATRON_ID_ESCENA_N1.test(rengM.id)) rengP.push(`id fuera de patrón: ${rengM.id}`)
  if (rengM.subtemas.length === 0 || !rengM.subtemas.every((rengS) => /^n\d-b\d{1,2}-s\d{1,2}$/.test(rengS))) rengP.push('subtemas ausentes o fuera de patrón')
  if (rengM.parametros.length === 0) rengP.push('sin parámetros')
  const rengClaves = new Set<string>()
  for (const rengX of rengM.parametros) {
    if (rengClaves.has(rengX.clave)) rengP.push(`parámetro repetido: ${rengX.clave}`)
    rengClaves.add(rengX.clave)
    if (!(rengX.min < rengX.max) || !(rengX.paso > 0) || rengX.inicial < rengX.min || rengX.inicial > rengX.max) rengP.push(`intervalo no válido en ${rengX.clave}`)
    if (rengX.unidad.trim() === '') rengP.push(`parámetro sin unidad declarada: ${rengX.clave} (usa «sin unidad»)`)
  }
  const rengMag = new Set<string>()
  for (const rengG of rengM.magnitudes) {
    if (rengMag.has(rengG.clave)) rengP.push(`magnitud repetida: ${rengG.clave}`)
    rengMag.add(rengG.clave)
    if (rengG.unidad.trim() === '') rengP.push(`magnitud sin unidad declarada: ${rengG.clave} (usa «sin unidad»)`)
  }
  if (rengM.magnitudes.length === 0) rengP.push('sin magnitudes de lectura')
  if (rengM.tiempo && !rengM.magnitudes.some((rengG) => rengG.clave === 't')) rengP.push('una escena temporal debe leer el tiempo t')
  if (rengM.tiempo && (!(rengM.tiempo.final > 0) || !(rengM.tiempo.porSegundo > 0))) rengP.push('tiempo final o ritmo no válido')
  if (rengM.ficha.ecuaciones.length === 0) rengP.push('la ficha no declara ecuaciones')
  if (rengM.ficha.supuestos.length === 0) rengP.push('la ficha no declara supuestos')
  if (rengM.ficha.limites.length === 0) rengP.push('la ficha no declara límites del modelo')
  if (rengM.ficha.condicionesIniciales.trim().length < 15) rengP.push('la ficha no declara condiciones iniciales')
  if (rengM.ficha.procedencia.length === 0) rengP.push('la ficha no declara procedencia')
  return rengP
}

export function rengMuestrasEscenaN1(rengM: RengModeloEscenaN1, rengPorEje = 3): Array<{ valores: RengValoresEscenaN1; t: number }> {
  const rengRejillas = rengM.parametros.map((rengX) => Array.from({ length: rengPorEje }, (_rengA, rengI) => rengX.min + ((rengX.max - rengX.min) * rengI) / Math.max(1, rengPorEje - 1)).concat(rengX.inicial))
  let rengCombos: Array<Record<string, number>> = [{}]
  rengM.parametros.forEach((rengX, rengI) => {
    rengCombos = rengCombos.flatMap((rengC) => rengRejillas[rengI]!.map((rengV) => ({ ...rengC, [rengX.clave]: rengV })))
  })
  const rengTiempos = rengM.tiempo ? [0, rengM.tiempo.final * 0.1, rengM.tiempo.final * 0.5, rengM.tiempo.final] : [0]
  return rengCombos.flatMap((rengC) => rengTiempos.map((rengT) => ({ valores: rengC, t: rengT })))
}

export interface RengFalloComprobacionN1 {
  valores: RengValoresEscenaN1
  t: number
  detalle: string
}

export function rengComprobarEscenaN1(rengM: RengModeloEscenaN1, rengComprobar: (rengV: RengValoresEscenaN1, rengT: number, rengL: RengValoresEscenaN1) => string | null, rengPorEje = 3): RengFalloComprobacionN1[] {
  const rengFallos: RengFalloComprobacionN1[] = []
  for (const { valores: rengV, t: rengT } of rengMuestrasEscenaN1(rengM, rengPorEje)) {
    const rengR = rengLeerEscenaN1(rengM, rengV, rengT)
    if (rengR.problemas.length > 0) {
      rengFallos.push({ valores: rengV, t: rengT, detalle: rengR.problemas.join('; ') })
      continue
    }
    const rengDetalle = rengComprobar(rengV, rengT, Object.fromEntries(rengR.lecturas.map((rengL) => [rengL.clave, rengL.valor])))
    if (rengDetalle) rengFallos.push({ valores: rengV, t: rengT, detalle: rengDetalle })
  }
  return rengFallos
}
