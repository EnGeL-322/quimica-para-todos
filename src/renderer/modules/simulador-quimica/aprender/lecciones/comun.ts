import type { RengFuenteLeccion } from '../tipos'

export const RENG_FECHA_CONSULTA = '2026-11-15'

export const rengFuenteOpenStax = (rengSecciones: string): RengFuenteLeccion => ({
  texto: `OpenStax, Chemistry 2e (Flowers, Theopold, Langley y Robinson, 2019), ${rengSecciones}`,
  enlace: 'https://openstax.org/books/chemistry-2e',
  consultada: RENG_FECHA_CONSULTA,
  alcance: 'Se consultó el índice del capítulo para ubicar el tema. La lección y sus datos son propios: la obra es CC BY-NC-SA y no se copia texto ni figuras.'
})

export const rengFuenteMasasAtomicas: RengFuenteLeccion = {
  texto: 'CIAAW, Standard Atomic Weights 2024',
  enlace: 'https://ciaaw.org/atomic-weights.htm',
  consultada: RENG_FECHA_CONSULTA,
  alcance: 'Las masas atómicas usadas (H 1,008; C 12,011; N 14,007; O 15,999; Na 22,990; Mg 24,305; S 32,06; Cl 35,45) son valores abreviados dentro de los intervalos o valores convencionales de esa tabla.'
}

export const rengFuenteGoldBookCip: RengFuenteLeccion = {
  texto: 'IUPAC Gold Book: «CIP priority» (C01082) y «R, S» (R05423)',
  enlace: 'https://goldbook.iupac.org/terms/view/R05423',
  consultada: RENG_FECHA_CONSULTA,
  alcance: 'Las definiciones se leyeron en los resultados del buscador de la propia web (una consulta directa a otra entrada devolvió 403). No se leyeron las reglas de secuencia completas: la lección aplica solo la regla del número atómico.'
}
