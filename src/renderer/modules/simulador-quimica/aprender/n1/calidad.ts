import { RENG_TEMARIO_GENERADO } from '../../temario/datos.generado'
import type { RengConexionesN1, RengErrorFrecuenteN1, RengPreguntaN1, RengTerminoN1 } from './tipos'

export const RENG_MINIMOS_LECCION_N1 = Object.freeze({
  objetivosMin: 2,
  objetivosMax: 4,
  porQueImporta: 120,
  analogia: 40,
  analogiaLimite: 40,
  ejemplos: 2,
  figuras: 1,
  errores: 2,
  textoError: 30,
  resumenMin: 4,
  resumenMax: 6,
  lineaResumen: 20,
  glosario: 2,
  definicion: 25,
  preguntas: 3,
  opcionesMin: 3,
  opcionesMax: 4,
  retro: 26,
  pista: 11,
  mensaje: 26
})

export const RENG_PATRON_SUBTEMA_N1 = /^n1-b\d{1,2}-s\d{1,2}$/

const RENG_SUBTEMAS_TEMARIO: ReadonlySet<string> = new Set(RENG_TEMARIO_GENERADO.niveles.flatMap((rengN) => rengN.bloques.flatMap((rengB) => rengB.subtemas.map((rengS) => rengS.id))))

export const rengSubtemaExiste = (rengId: string): boolean => RENG_SUBTEMAS_TEMARIO.has(rengId)

export const rengNormalizarTermino = (rengT: string): string => rengT.normalize('NFC').trim().toLocaleLowerCase('es')

export function rengProblemasPreguntas(rengPreguntas: readonly RengPreguntaN1[]): string[] {
  const rengM = RENG_MINIMOS_LECCION_N1
  const rengP: string[] = []
  if (rengPreguntas.length !== rengM.preguntas) rengP.push(`hay ${rengPreguntas.length} preguntas para comprobar y deben ser exactamente ${rengM.preguntas}`)
  rengPreguntas.forEach((rengQ, rengI) => {
    const rengEt = `pregunta ${rengI + 1}`
    if (rengQ.pregunta.trim().length < 20) rengP.push(`${rengEt}: enunciado demasiado corto`)
    if (rengQ.opciones.length < rengM.opcionesMin || rengQ.opciones.length > rengM.opcionesMax) rengP.push(`${rengEt}: debe tener de ${rengM.opcionesMin} a ${rengM.opcionesMax} opciones`)
    if (rengQ.opciones.filter((rengO) => rengO.correcta).length !== 1) rengP.push(`${rengEt}: debe tener exactamente una opción correcta`)
    if (new Set(rengQ.opciones.map((rengO) => rengO.texto.trim())).size !== rengQ.opciones.length) rengP.push(`${rengEt}: opciones repetidas`)
    for (const rengO of rengQ.opciones) {
      if (rengO.texto.trim() === '') rengP.push(`${rengEt}: opción vacía`)
      if (rengO.retro.trim().length < rengM.retro) rengP.push(`${rengEt}: la retroalimentación de «${rengO.texto}» tiene menos de ${rengM.retro} caracteres`)
    }
    if (new Set(rengQ.opciones.map((rengO) => rengO.retro.trim())).size !== rengQ.opciones.length) rengP.push(`${rengEt}: cada opción necesita su propia retroalimentación`)
  })
  return rengP
}

export function rengProblemasGlosario(rengGlosario: readonly RengTerminoN1[], rengEt = 'glosario'): string[] {
  const rengP: string[] = []
  const rengVistos = new Map<string, string>()
  for (const rengT of rengGlosario) {
    const rengK = rengNormalizarTermino(rengT.termino)
    if (rengK === '') rengP.push(`${rengEt}: término vacío`)
    if (rengT.definicion.trim().length < RENG_MINIMOS_LECCION_N1.definicion) rengP.push(`${rengEt}: la definición de «${rengT.termino}» es demasiado corta`)
    const rengPrevia = rengVistos.get(rengK)
    if (rengPrevia !== undefined && rengPrevia !== rengT.definicion.trim()) rengP.push(`${rengEt}: «${rengT.termino}» tiene dos definiciones distintas`)
    rengVistos.set(rengK, rengT.definicion.trim())
  }
  return rengP
}

export function rengProblemasErrores(rengErrores: readonly RengErrorFrecuenteN1[]): string[] {
  const rengM = RENG_MINIMOS_LECCION_N1
  const rengP: string[] = []
  if (rengErrores.length < rengM.errores) rengP.push(`hay ${rengErrores.length} errores frecuentes y se exigen al menos ${rengM.errores}`)
  for (const rengE of rengErrores) if (rengE.error.trim().length < rengM.textoError || rengE.correccion.trim().length < rengM.textoError) rengP.push(`error frecuente sin descripción o sin corrección suficiente: «${rengE.error.slice(0, 40)}»`)
  return rengP
}

export function rengProblemasConexiones(rengSubtema: string, rengC: RengConexionesN1): string[] {
  const rengP: string[] = []
  for (const [rengNombre, rengId] of [['anterior', rengC.anterior], ['siguiente', rengC.siguiente]] as const) {
    if (rengId === null) continue
    if (!RENG_PATRON_SUBTEMA_N1.test(rengId) || !rengSubtemaExiste(rengId)) rengP.push(`el subtema ${rengNombre} «${rengId}» no existe en el temario`)
    if (rengId === rengSubtema) rengP.push(`el subtema ${rengNombre} no puede ser el propio subtema`)
  }
  if (rengC.anterior === null && rengC.siguiente === null) rengP.push('la lección no se conecta con ningún subtema anterior ni siguiente')
  for (const rengId of rengC.prerrequisitos) {
    if (!rengSubtemaExiste(rengId)) rengP.push(`el prerrequisito «${rengId}» no existe en el temario`)
    if (rengId === rengSubtema) rengP.push('un subtema no puede ser prerrequisito de sí mismo')
  }
  if (new Set(rengC.prerrequisitos).size !== rengC.prerrequisitos.length) rengP.push('prerrequisitos repetidos')
  return rengP
}

export function rengCiclosPrerrequisitos(rengAristas: ReadonlyMap<string, readonly string[]>): string[][] {
  const rengCiclos: string[][] = []
  const rengEstado = new Map<string, 'visitando' | 'hecho'>()
  const rengPila: string[] = []
  const rengVisitar = (rengN: string): void => {
    rengEstado.set(rengN, 'visitando')
    rengPila.push(rengN)
    for (const rengM of rengAristas.get(rengN) ?? []) {
      const rengE = rengEstado.get(rengM)
      if (rengE === 'visitando') rengCiclos.push([...rengPila.slice(rengPila.indexOf(rengM)), rengM])
      else if (rengE === undefined) rengVisitar(rengM)
    }
    rengPila.pop()
    rengEstado.set(rengN, 'hecho')
  }
  for (const rengN of rengAristas.keys()) if (!rengEstado.has(rengN)) rengVisitar(rengN)
  return rengCiclos
}

const rengPalabras = (rengT: string): string[] =>
  rengT
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9ñ]+/)
    .filter((rengW) => rengW.length > 0)

export function rengTejasTexto(rengT: string, rengN = 4): Set<string> {
  const rengW = rengPalabras(rengT)
  const rengS = new Set<string>()
  for (let rengI = 0; rengI + rengN <= rengW.length; rengI++) rengS.add(rengW.slice(rengI, rengI + rengN).join(' '))
  return rengS
}

export function rengSimilitudTextos(rengA: string, rengB: string, rengN = 4): number {
  const rengX = rengTejasTexto(rengA, rengN)
  const rengY = rengTejasTexto(rengB, rengN)
  if (rengX.size === 0 || rengY.size === 0) return 0
  let rengComun = 0
  for (const rengT of rengX) if (rengY.has(rengT)) rengComun++
  return rengComun / (rengX.size + rengY.size - rengComun)
}

export const RENG_UMBRAL_SIMILITUD_N1 = 0.3
