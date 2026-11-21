import { RENG_MENU_LABORATORIO } from '../../laboratorio/menu'
import { RENG_ELEMENTOS } from '../../tabla-periodica/data'
import { RENG_FORMAS_PELIGRO } from '../../tabla-periodica/peligros'
import { rengLeccionDeTema } from '../aprender/lecciones'
import { RENG_BIBLIOTECA } from '../datos/biblioteca'
import { RENG_CASOS } from '../datos/casos'
import { RENG_NOMBRE_EXPERIMENTO, RENG_EXPERIMENTOS_QUIMICA, RENG_HERRAMIENTAS_MESA } from '../navegacion'
import { RENG_ESTRUCTURAS } from '../nucleo/cristales'
import { RENG_GLOSARIO } from '../nucleo/glosario'
import { RENG_FAMILIAS, rengFamiliasDeTema, rengTemaPorId } from '../practica/banco'
import { rengLeccionN1PorId } from '../aprender/n1/registro'
import { rengGrupoN1DeSubtema } from '../practicas-n1/registro'
import { rengValidarModeloEscenaN1 } from '../escenas-n1/kit'
import { rengEscenaN1PorId } from '../escenas-n1/registro'
import type { RengRecurso } from './tipos'

export type RengCapa = 'aprender' | 'practica' | 'simulacion' | 'consulta'

export const RENG_NOMBRE_CAPA: Readonly<Record<RengCapa, string>> = {
  aprender: 'Lección',
  practica: 'Práctica con corrección',
  simulacion: 'Simulación',
  consulta: 'Consulta o herramienta'
}

export const rengTemaTienePractica = (rengId: string): boolean => {
  const rengTema = rengTemaPorId(rengId)
  return rengTema !== undefined && (rengTema.legado !== null || rengFamiliasDeTema(rengId).length > 0)
}

export const rengClaveRecurso = (rengR: RengRecurso): string => ('id' in rengR ? `${rengR.tipo}:${rengR.id}` : rengR.tipo)

export function rengRecursoExiste(rengR: RengRecurso): boolean {
  switch (rengR.tipo) {
    case 'tema':
      return rengTemaTienePractica(rengR.id) && rengLeccionDeTema(rengR.id) !== undefined
    case 'practica':
      return RENG_FAMILIAS.some((rengF) => rengF.id === rengR.id)
    case 'escena':
      return (RENG_EXPERIMENTOS_QUIMICA as readonly string[]).includes(rengR.id)
    case 'mesa':
      return RENG_HERRAMIENTAS_MESA.some((rengH) => rengH.id === rengR.id)
    case 'tabla':
      return RENG_ELEMENTOS.length === 118
    case 'sustancia':
      return RENG_BIBLIOTECA.some((rengS) => rengS.nombre === rengR.id)
    case 'caso':
      return RENG_CASOS.some((rengC) => rengC.id === rengR.id)
    case 'laboratorio':
      return RENG_MENU_LABORATORIO.some((rengM) => rengM.sub === rengR.id)
    case 'peligros':
      return RENG_FORMAS_PELIGRO.length > 0
    case 'cristal':
      return rengR.id in RENG_ESTRUCTURAS
    case 'glosario':
      return RENG_GLOSARIO.some((rengG) => rengG.id === rengR.id)
    case 'leccion-n1':
      return rengLeccionN1PorId(rengR.id) !== undefined
    case 'practica-n1': {
      const rengG = rengGrupoN1DeSubtema(rengR.id)
      return rengG !== undefined && rengG.practicas.length >= 3
    }
    case 'escena-n1': {
      const rengE = rengEscenaN1PorId(rengR.id)
      return rengE !== undefined && rengValidarModeloEscenaN1(rengE).length === 0
    }
  }
}

export function rengCapasDeRecurso(rengR: RengRecurso): readonly RengCapa[] {
  switch (rengR.tipo) {
    case 'tema':
      return ['aprender', 'practica']
    case 'leccion-n1':
      return ['aprender']
    case 'practica':
    case 'practica-n1':
      return ['practica']
    case 'escena':
    case 'escena-n1':
      return ['simulacion']
    default:
      return ['consulta']
  }
}

export function rengEtiquetaRecurso(rengR: RengRecurso): string {
  switch (rengR.tipo) {
    case 'tema':
      return `Tema «${rengTemaPorId(rengR.id)?.nombre ?? rengR.id}»`
    case 'practica':
      return `Práctica «${RENG_FAMILIAS.find((rengF) => rengF.id === rengR.id)?.nombre ?? rengR.id}»`
    case 'escena':
      return rengR.id === 'mesalibre' ? RENG_NOMBRE_EXPERIMENTO.mesalibre : `Simulación: ${RENG_NOMBRE_EXPERIMENTO[rengR.id]}`
    case 'mesa':
      return `Mesa molecular · ${RENG_HERRAMIENTAS_MESA.find((rengH) => rengH.id === rengR.id)?.nombre ?? rengR.id}`
    case 'tabla':
      return 'Tabla periódica'
    case 'sustancia':
      return `Sustancia: ${rengR.id}`
    case 'caso':
      return `Caso real: ${RENG_CASOS.find((rengC) => rengC.id === rengR.id)?.titulo ?? rengR.id}`
    case 'laboratorio':
      return rengR.id === 'cuaderno' ? 'Laboratorio · Mi cuaderno' : 'Laboratorio · Datos y estadística'
    case 'peligros':
      return 'Catálogo de peligros'
    case 'cristal':
      return `Estructura cristalina: ${RENG_ESTRUCTURAS[rengR.id]?.nombre ?? rengR.id}`
    case 'glosario':
      return `Glosario: ${RENG_GLOSARIO.find((rengG) => rengG.id === rengR.id)?.termino ?? rengR.id}`
    case 'leccion-n1':
      return `Lección por capas «${rengLeccionN1PorId(rengR.id)?.nombre ?? rengR.id}»`
    case 'practica-n1': {
      const rengG = rengGrupoN1DeSubtema(rengR.id)
      return rengG ? `Prácticas del subtema (${rengG.practicas.length})` : `Prácticas del subtema ${rengR.id}`
    }
    case 'escena-n1':
      return `Simulación «${rengEscenaN1PorId(rengR.id)?.nombre ?? rengR.id}»`
  }
}

export interface RengAccionRecurso {
  etiqueta: string
  modulo: string
  sub: string | null
}

const RENG_QUIMICA = 'simulador-quimica'

export function rengAccionesDeRecurso(rengR: RengRecurso): readonly RengAccionRecurso[] {
  switch (rengR.tipo) {
    case 'tema': {
      const rengAcciones: RengAccionRecurso[] = [
        { etiqueta: 'Aprender', modulo: RENG_QUIMICA, sub: `aprender-${rengR.id}` },
        { etiqueta: 'Practicar', modulo: RENG_QUIMICA, sub: `practicas-${rengR.id}` }
      ]
      const rengEscena = rengTemaPorId(rengR.id)?.escena
      if (rengEscena) rengAcciones.push({ etiqueta: 'Simular', modulo: RENG_QUIMICA, sub: rengEscena })
      return rengAcciones
    }
    case 'practica': {
      const rengTema = RENG_FAMILIAS.find((rengF) => rengF.id === rengR.id)?.tema
      return rengTema ? [{ etiqueta: 'Practicar', modulo: RENG_QUIMICA, sub: `practicas-${rengTema}` }] : []
    }
    case 'escena':
      return [{ etiqueta: 'Abrir simulación', modulo: RENG_QUIMICA, sub: rengR.id }]
    case 'mesa':
      return [{ etiqueta: 'Abrir en la Mesa', modulo: RENG_QUIMICA, sub: rengR.id === 'explorar' ? 'mesa' : rengR.id }]
    case 'sustancia':
    case 'cristal':
    case 'glosario':
      return [{ etiqueta: 'Abrir la Mesa', modulo: RENG_QUIMICA, sub: 'mesa' }]
    case 'caso':
      return [{ etiqueta: 'Abrir casos reales', modulo: RENG_QUIMICA, sub: 'casos' }]
    case 'tabla':
    case 'peligros':
      return [{ etiqueta: 'Abrir la tabla periódica', modulo: 'tabla-periodica', sub: null }]
    case 'laboratorio':
      return [{ etiqueta: 'Abrir el laboratorio', modulo: 'laboratorio', sub: rengR.id }]
    case 'leccion-n1':
      return rengLeccionN1PorId(rengR.id) ? [{ etiqueta: 'Aprender', modulo: RENG_QUIMICA, sub: `aprender-${rengR.id}` }] : []
    case 'practica-n1':
      return rengGrupoN1DeSubtema(rengR.id) ? [{ etiqueta: 'Practicar', modulo: RENG_QUIMICA, sub: `practicas-${rengR.id}` }] : []
    case 'escena-n1':
      return rengEscenaN1PorId(rengR.id) ? [{ etiqueta: 'Simular', modulo: RENG_QUIMICA, sub: `aprender-escena-${rengR.id}` }] : []
  }
}
