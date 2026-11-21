import { RENG_MINIMOS_LECCION_N1, rengProblemasConexiones, rengProblemasErrores, rengProblemasGlosario, rengProblemasPreguntas } from './calidad'
import { RENG_PROCEDENCIA_TEXTO, rengIdealizado, rengProcedenciaCalculo } from './procedencia'
import type { RengEscenaLeccionN1, RengExplorarN1, RengLeccionN1, RengPreguntaN1, RengProcedenciaN1 } from './tipos'

export type RengOpcionEspecN1 = readonly [texto: string, correcta: boolean, retro: string]

export interface RengPreguntaEspecN1 {
  pregunta: string
  opciones: readonly RengOpcionEspecN1[]
}

export interface RengEspecLeccionN1 {
  id: string
  subtema: string
  nombre: string
  pregunta: string
  objetivo: string
  objetivosMas: readonly string[]
  porQueImporta: string
  idea: string
  imagen: string
  analogia: string
  analogiaLimite: string
  errores: ReadonlyArray<readonly [error: string, correccion: string]>
  ecs: ReadonlyArray<readonly [nombre: string, texto: string, lectura: string, tex?: string]>
  vars: ReadonlyArray<readonly [simbolo: string, nombre: string, unidad: string]>
  supuestos: readonly string[]
  limites: string
  ejemplos: readonly string[]
  figuras: readonly string[]
  resumen: readonly string[]
  glosario: ReadonlyArray<readonly [termino: string, definicion: string]>
  comprobar: readonly RengPreguntaEspecN1[]
  anterior: string | null
  siguiente: string | null
  prerrequisitos: readonly string[]
  explorar?: RengExplorarN1
  escena?: RengEscenaLeccionN1
  fuentes: readonly RengProcedenciaN1[]
  idealizado: string
  metodo: string
}

const RENG_SUBTEMA = /^n(\d)-b(\d{1,2})-s(\d{1,2})$/

export function rengProblemasLeccionN1(rengE: RengEspecLeccionN1): string[] {
  const rengM = RENG_MINIMOS_LECCION_N1
  const rengP: string[] = []
  const rengObjetivos = [rengE.objetivo, ...rengE.objetivosMas]
  if (rengObjetivos.length < rengM.objetivosMin || rengObjetivos.length > rengM.objetivosMax) rengP.push(`debe tener de ${rengM.objetivosMin} a ${rengM.objetivosMax} objetivos (tiene ${rengObjetivos.length})`)
  if (rengObjetivos.some((rengO) => rengO.trim().length < 30)) rengP.push('hay un objetivo demasiado corto para ser verificable')
  if (rengE.porQueImporta.trim().length < rengM.porQueImporta) rengP.push('falta «Por qué importa» o es demasiado corto')
  if (rengE.analogia.trim().length < rengM.analogia) rengP.push('falta la analogía')
  if (rengE.analogiaLimite.trim().length < rengM.analogiaLimite) rengP.push('falta el límite de la analogía (dónde falla)')
  if (rengE.ejemplos.length < rengM.ejemplos) rengP.push(`hay ${rengE.ejemplos.length} ejemplos y se exigen al menos ${rengM.ejemplos} (uno directo y uno integrador)`)
  if (new Set(rengE.ejemplos).size !== rengE.ejemplos.length) rengP.push('ejemplos repetidos')
  if (rengE.figuras.length < rengM.figuras) rengP.push('la lección no tiene ninguna figura')
  rengP.push(...rengProblemasErrores(rengE.errores.map(([rengA, rengB]) => ({ error: rengA, correccion: rengB }))))
  if (rengE.resumen.length < rengM.resumenMin || rengE.resumen.length > rengM.resumenMax) rengP.push(`el resumen tiene ${rengE.resumen.length} líneas y debe tener de ${rengM.resumenMin} a ${rengM.resumenMax}`)
  if (rengE.resumen.some((rengL) => rengL.trim().length < rengM.lineaResumen)) rengP.push('hay una línea del resumen demasiado corta')
  if (rengE.glosario.length < rengM.glosario) rengP.push(`el glosario tiene ${rengE.glosario.length} términos y se exigen al menos ${rengM.glosario}`)
  rengP.push(...rengProblemasGlosario(rengE.glosario.map(([rengT, rengD]) => ({ termino: rengT, definicion: rengD }))))
  rengP.push(...rengProblemasPreguntas(rengConvertirPreguntas(rengE.comprobar)))
  rengP.push(...rengProblemasConexiones(rengE.subtema, { anterior: rengE.anterior, siguiente: rengE.siguiente, prerrequisitos: rengE.prerrequisitos }))
  if (rengE.escena && (rengE.escena.instruccion.trim().length < 30 || rengE.escena.limite.trim().length < 30)) rengP.push('la escena de la lección necesita instrucción y límite declarados')
  return rengP
}

const rengConvertirPreguntas = (rengPs: readonly RengPreguntaEspecN1[]): RengPreguntaN1[] => rengPs.map((rengQ) => ({ pregunta: rengQ.pregunta, opciones: rengQ.opciones.map(([rengT, rengC, rengR]) => ({ texto: rengT, correcta: rengC, retro: rengR })) }))

export function rengLeccionN1(rengE: RengEspecLeccionN1): RengLeccionN1 {
  const rengM = RENG_SUBTEMA.exec(rengE.subtema)
  if (!rengM) throw new Error(`Id de subtema fuera de patrón: ${rengE.subtema}`)
  const rengProblemas = rengProblemasLeccionN1(rengE)
  if (rengProblemas.length > 0) throw new Error(`Lección ${rengE.id} incompleta: ${rengProblemas.join('; ')}`)
  return {
    id: rengE.id,
    subtema: rengE.subtema,
    bloque: Number(rengM[2]),
    posicion: Number(rengM[3]),
    nombre: rengE.nombre,
    pregunta: rengE.pregunta,
    objetivo: rengE.objetivo,
    objetivos: [rengE.objetivo, ...rengE.objetivosMas],
    porQueImporta: rengE.porQueImporta,
    comprender: { idea: rengE.idea, imagen: rengE.imagen, errorFrecuente: rengE.errores[0]![0], analogia: rengE.analogia, analogiaLimite: rengE.analogiaLimite },
    formalizar: {
      ecuaciones: rengE.ecs.map(([rengNombre, rengTexto, rengLectura, rengTex]) => ({ nombre: rengNombre, texto: rengTexto, lectura: rengLectura, tex: rengTex ?? null })),
      variables: rengE.vars.map(([rengSimbolo, rengNombre, rengUnidad]) => ({ simbolo: rengSimbolo, nombre: rengNombre, unidad: rengUnidad })),
      supuestos: [...rengE.supuestos],
      limites: rengE.limites
    },
    ejemplo: rengE.ejemplos[0]!,
    ejemplos: [...rengE.ejemplos],
    figuras: [...rengE.figuras],
    errores: rengE.errores.map(([rengA, rengB]) => ({ error: rengA, correccion: rengB })),
    resumen: [...rengE.resumen],
    glosario: rengE.glosario.map(([rengT, rengD]) => ({ termino: rengT, definicion: rengD })),
    comprobar: rengConvertirPreguntas(rengE.comprobar),
    conexiones: { anterior: rengE.anterior, siguiente: rengE.siguiente, prerrequisitos: [...rengE.prerrequisitos] },
    explorar: rengE.explorar ?? null,
    escena: rengE.escena ?? null,
    procedencia: [...rengE.fuentes, RENG_PROCEDENCIA_TEXTO, rengIdealizado(rengE.idealizado), rengProcedenciaCalculo(rengE.metodo)]
  }
}
