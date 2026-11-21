import type { RengSecuencia, RengTipoEnlace } from '../enlaces/secuencias'
import { rengEscenaCovalente } from './covalente'
import { rengEscenaDativa } from './dativo'
import { rengEscenaIntermolecular } from './intermolecular'
import { rengEscenaIonica } from './ionica'
import { rengEscenaMetalica } from './metalico'
import { rengEscenaMultiple } from './multiple'
import type { RengEscenaEnlace, RengPaleta } from './util3d'

type RengConstructores = { [RengK in RengTipoEnlace]: (rengSec: Extract<RengSecuencia, { tipo: RengK }>, rengPaleta: RengPaleta) => RengEscenaEnlace }

export const RENG_ESCENAS: RengConstructores = {
  ionico: rengEscenaIonica,
  covalente: rengEscenaCovalente,
  multiple: rengEscenaMultiple,
  dativo: rengEscenaDativa,
  metalico: rengEscenaMetalica,
  intermolecular: rengEscenaIntermolecular
}

export function rengConstruirEscena(rengSec: RengSecuencia, rengPaleta: RengPaleta): RengEscenaEnlace {
  const rengCrear = RENG_ESCENAS[rengSec.tipo] as (rengS: RengSecuencia, rengP: RengPaleta) => RengEscenaEnlace
  return rengCrear(rengSec, rengPaleta)
}
