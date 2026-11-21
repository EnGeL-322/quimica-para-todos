import { RENG_CAPITULO_ACIDOS } from './acidos/capitulo'
import { RENG_EJEMPLOS_ACIDOS } from './acidos/ejemplos'
import { RENG_EJEMPLOS_ACIDOS_INTEGRADORES } from './acidos/ejemplos-integradores'
import { RENG_FIGURAS_ACIDOS } from './acidos/figuras'
import { RENG_LECCIONES_ACIDOS } from './acidos/lecciones'
import { RENG_CAPITULO_ESTEQUIOMETRIA } from './estequiometria/capitulo'
import { RENG_EJEMPLOS_ESTEQUIOMETRIA } from './estequiometria/ejemplos'
import { RENG_EJEMPLOS_ESTEQUIOMETRIA_INTEGRADORES } from './estequiometria/ejemplos-integradores'
import { RENG_FIGURAS_ESTEQUIOMETRIA } from './estequiometria/figuras'
import { RENG_LECCIONES_ESTEQUIOMETRIA } from './estequiometria/lecciones'
import { RENG_CAPITULO_GASES } from './gases/capitulo'
import { RENG_EJEMPLOS_GASES } from './gases/ejemplos'
import { RENG_EJEMPLOS_GASES_INTEGRADORES } from './gases/ejemplos-integradores'
import { RENG_FIGURAS_GASES } from './gases/figuras'
import { RENG_LECCIONES_GASES } from './gases/lecciones'
import { RENG_CAPITULO_NOMENCLATURA } from './nomenclatura/capitulo'
import { RENG_EJEMPLOS_NOMENCLATURA } from './nomenclatura/ejemplos'
import { RENG_EJEMPLOS_NOMENCLATURA_INTEGRADORES } from './nomenclatura/ejemplos-integradores'
import { RENG_FIGURAS_NOMENCLATURA } from './nomenclatura/figuras'
import { RENG_LECCIONES_NOMENCLATURA } from './nomenclatura/lecciones'
import { RENG_CAPITULO_REACCIONES } from './reacciones/capitulo'
import { RENG_EJEMPLOS_REACCIONES } from './reacciones/ejemplos'
import { RENG_EJEMPLOS_REACCIONES_INTEGRADORES } from './reacciones/ejemplos-integradores'
import { RENG_FIGURAS_REACCIONES } from './reacciones/figuras'
import { RENG_LECCIONES_REACCIONES } from './reacciones/lecciones'
import { RENG_CAPITULO_FUNDAMENTOS } from './fundamentos/capitulo'
import { RENG_EJEMPLOS_FUNDAMENTOS } from './fundamentos/ejemplos'
import { RENG_EJEMPLOS_FUNDAMENTOS_INTEGRADORES } from './fundamentos/ejemplos-integradores'
import { RENG_FIGURAS_FUNDAMENTOS } from './fundamentos/figuras'
import { RENG_LECCIONES_FUNDAMENTOS } from './fundamentos/lecciones'
import { RENG_CAPITULO_ATOMO } from './atomo/capitulo'
import { RENG_EJEMPLOS_ATOMO } from './atomo/ejemplos'
import { RENG_EJEMPLOS_ATOMO_INTEGRADORES } from './atomo/ejemplos-integradores'
import { RENG_FIGURAS_ATOMO } from './atomo/figuras'
import { RENG_LECCIONES_ATOMO } from './atomo/lecciones'
import { RENG_CAPITULO_TABLA } from './tabla/capitulo'
import { RENG_EJEMPLOS_TABLA } from './tabla/ejemplos'
import { RENG_EJEMPLOS_TABLA_INTEGRADORES } from './tabla/ejemplos-integradores'
import { RENG_FIGURAS_TABLA } from './tabla/figuras'
import { RENG_LECCIONES_TABLA } from './tabla/lecciones'
import { RENG_CAPITULO_ENLACE } from './enlace/capitulo'
import { RENG_EJEMPLOS_ENLACE } from './enlace/ejemplos'
import { RENG_EJEMPLOS_ENLACE_INTEGRADORES } from './enlace/ejemplos-integradores'
import { RENG_FIGURAS_ENLACE } from './enlace/figuras'
import { RENG_LECCIONES_ENLACE } from './enlace/lecciones'
import { RENG_CAPITULO_ORGANICA } from './organica/capitulo'
import { RENG_EJEMPLOS_ORGANICA } from './organica/ejemplos'
import { RENG_EJEMPLOS_ORGANICA_B } from './organica/ejemplos-b'
import { RENG_FIGURAS_ORGANICA } from './organica/figuras'
import { RENG_LECCIONES_ORGANICA } from './organica/lecciones'
import { RENG_CAPITULO_SOLUCIONES } from './soluciones/capitulo'
import { RENG_EJEMPLOS_SOLUCIONES } from './soluciones/ejemplos'
import { RENG_EJEMPLOS_SOLUCIONES_INTEGRADORES } from './soluciones/ejemplos-integradores'
import { RENG_FIGURAS_SOLUCIONES } from './soluciones/figuras'
import { RENG_LECCIONES_SOLUCIONES } from './soluciones/lecciones'
import { RENG_CAPITULO_TERMO } from './termo/capitulo'
import { RENG_EJEMPLOS_TERMO } from './termo/ejemplos'
import { RENG_EJEMPLOS_TERMO_INTEGRADORES } from './termo/ejemplos-integradores'
import { RENG_FIGURAS_TERMO } from './termo/figuras'
import { RENG_LECCIONES_TERMO } from './termo/lecciones'
import type { RengCapituloN1, RengEjemploN1, RengFiguraN1, RengLeccionN1 } from './tipos'

export const RENG_LECCIONES_N1: readonly RengLeccionN1[] = [
  ...RENG_LECCIONES_GASES,
  ...RENG_LECCIONES_ESTEQUIOMETRIA,
  ...RENG_LECCIONES_SOLUCIONES,
  ...RENG_LECCIONES_ACIDOS,
  ...RENG_LECCIONES_TERMO,
  ...RENG_LECCIONES_NOMENCLATURA,
  ...RENG_LECCIONES_REACCIONES,
  ...RENG_LECCIONES_FUNDAMENTOS,
  ...RENG_LECCIONES_ATOMO,
  ...RENG_LECCIONES_TABLA,
  ...RENG_LECCIONES_ENLACE,
  ...RENG_LECCIONES_ORGANICA
]

export const RENG_EJEMPLOS_N1: readonly RengEjemploN1[] = [
  ...RENG_EJEMPLOS_GASES,
  ...RENG_EJEMPLOS_GASES_INTEGRADORES,
  ...RENG_EJEMPLOS_ESTEQUIOMETRIA,
  ...RENG_EJEMPLOS_ESTEQUIOMETRIA_INTEGRADORES,
  ...RENG_EJEMPLOS_SOLUCIONES,
  ...RENG_EJEMPLOS_SOLUCIONES_INTEGRADORES,
  ...RENG_EJEMPLOS_ACIDOS,
  ...RENG_EJEMPLOS_ACIDOS_INTEGRADORES,
  ...RENG_EJEMPLOS_TERMO,
  ...RENG_EJEMPLOS_TERMO_INTEGRADORES,
  ...RENG_EJEMPLOS_NOMENCLATURA,
  ...RENG_EJEMPLOS_NOMENCLATURA_INTEGRADORES,
  ...RENG_EJEMPLOS_REACCIONES,
  ...RENG_EJEMPLOS_REACCIONES_INTEGRADORES,
  ...RENG_EJEMPLOS_FUNDAMENTOS,
  ...RENG_EJEMPLOS_FUNDAMENTOS_INTEGRADORES,
  ...RENG_EJEMPLOS_ATOMO,
  ...RENG_EJEMPLOS_ATOMO_INTEGRADORES,
  ...RENG_EJEMPLOS_TABLA,
  ...RENG_EJEMPLOS_TABLA_INTEGRADORES,
  ...RENG_EJEMPLOS_ENLACE,
  ...RENG_EJEMPLOS_ENLACE_INTEGRADORES,
  ...RENG_EJEMPLOS_ORGANICA,
  ...RENG_EJEMPLOS_ORGANICA_B
]

export const RENG_FIGURAS_N1: readonly RengFiguraN1[] = [
  ...RENG_FIGURAS_GASES,
  ...RENG_FIGURAS_ESTEQUIOMETRIA,
  ...RENG_FIGURAS_SOLUCIONES,
  ...RENG_FIGURAS_ACIDOS,
  ...RENG_FIGURAS_TERMO,
  ...RENG_FIGURAS_NOMENCLATURA,
  ...RENG_FIGURAS_REACCIONES,
  ...RENG_FIGURAS_FUNDAMENTOS,
  ...RENG_FIGURAS_ATOMO,
  ...RENG_FIGURAS_TABLA,
  ...RENG_FIGURAS_ENLACE,
  ...RENG_FIGURAS_ORGANICA
]

export const RENG_CAPITULOS_N1: readonly RengCapituloN1[] = [
  RENG_CAPITULO_GASES,
  RENG_CAPITULO_ESTEQUIOMETRIA,
  RENG_CAPITULO_SOLUCIONES,
  RENG_CAPITULO_ACIDOS,
  RENG_CAPITULO_TERMO,
  RENG_CAPITULO_NOMENCLATURA,
  RENG_CAPITULO_REACCIONES,
  RENG_CAPITULO_FUNDAMENTOS,
  RENG_CAPITULO_ATOMO,
  RENG_CAPITULO_TABLA,
  RENG_CAPITULO_ENLACE,
  RENG_CAPITULO_ORGANICA
]

export const rengLeccionN1PorId = (rengId: string | null | undefined): RengLeccionN1 | undefined => RENG_LECCIONES_N1.find((rengL) => rengL.id === rengId)

export const rengLeccionN1DeSubtema = (rengSubtema: string | null | undefined): RengLeccionN1 | undefined => RENG_LECCIONES_N1.find((rengL) => rengL.subtema === rengSubtema)

export const rengEjemploN1PorId = (rengId: string): RengEjemploN1 | undefined => RENG_EJEMPLOS_N1.find((rengE) => rengE.id === rengId)

export const rengFiguraN1PorId = (rengId: string): RengFiguraN1 | undefined => RENG_FIGURAS_N1.find((rengF) => rengF.id === rengId)

export const rengCapituloN1PorId = (rengId: string | null | undefined): RengCapituloN1 | undefined => RENG_CAPITULOS_N1.find((rengC) => rengC.id === rengId)

export const rengCapituloN1DeBloque = (rengBloque: number): RengCapituloN1 | undefined => RENG_CAPITULOS_N1.find((rengC) => rengC.bloque === rengBloque)

export const rengBloquesConLeccionesN1 = (): number[] => [...new Set(RENG_LECCIONES_N1.map((rengL) => rengL.bloque))].sort((rengA, rengB) => rengA - rengB)

export const rengNumeroFiguraN1 = (rengLeccion: RengLeccionN1, rengIndice: number): string => `${rengLeccion.bloque}.${rengLeccion.posicion}.${rengIndice + 1}`
