export const RENG_VERSION_ATESTACIONES = 1

export interface RengAtestacionRegistrada {
  subtema: string
  tema: string
  familia: string
  revisor: string
  fecha: string
  motivo: string
}

export interface RengArchivoAtestaciones {
  version: number
  atestaciones: readonly RengAtestacionRegistrada[]
}

export const RENG_ARCHIVO_ATESTACIONES: RengArchivoAtestaciones = {
  version: RENG_VERSION_ATESTACIONES,
  atestaciones: []
}
