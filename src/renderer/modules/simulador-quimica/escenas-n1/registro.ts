import { RENG_ESCENA_ACIDO_BASE } from './modelos/acido-base'
import { RENG_ESCENA_ATOMO } from './modelos/atomo'
import { RENG_ESCENA_CONFIG } from './modelos/config-electronica'
import { RENG_ESCENA_TENDENCIAS } from './modelos/tendencias-periodicas'
import { RENG_ESCENA_CARGA_FORMAL } from './modelos/carga-formal'
import { RENG_ESCENA_POLARIDAD } from './modelos/polaridad-enlace'
import { RENG_ESCENA_VSEPR } from './modelos/geometria-vsepr'
import { RENG_ESCENA_INTERACCION } from './modelos/interaccion-molecular'
import { RENG_ESCENA_FAMILIA_ORGANICA } from './modelos/familia-organica'
import { RENG_ESCENA_HIDROCARBURO } from './modelos/hidrocarburo'
import { RENG_ESCENA_ORDEN } from './modelos/orden-enlace'
import { RENG_ESCENA_POLIMERO } from './modelos/polimero'
import { RENG_ESCENA_CALORIMETRIA } from './modelos/calorimetria'
import { RENG_ESCENA_COMBUSTION } from './modelos/combustion'
import { RENG_ESCENA_DENSIDAD } from './modelos/densidad'
import { RENG_ESCENA_CONCENTRACIONES } from './modelos/concentraciones'
import { RENG_ESCENA_ELECTROLISIS } from './modelos/electrolisis'
import { RENG_ESCENA_ESPECTRO } from './modelos/espectro-hidrogeno'
import { RENG_ESCENA_FORMULA_IONICA } from './modelos/formula-ionica'
import { RENG_ESCENA_EQUILIBRIO_GAS } from './modelos/equilibrio-gas'
import { RENG_ESCENA_GAS_IDEAL } from './modelos/gas-ideal'
import { RENG_ESCENA_LIMITANTE } from './modelos/reactivo-limitante'
import type { RengModeloEscenaN1 } from './tipos'

export const RENG_ESCENAS_N1: readonly RengModeloEscenaN1[] = [
  RENG_ESCENA_GAS_IDEAL,
  RENG_ESCENA_LIMITANTE,
  RENG_ESCENA_CONCENTRACIONES,
  RENG_ESCENA_ACIDO_BASE,
  RENG_ESCENA_EQUILIBRIO_GAS,
  RENG_ESCENA_CALORIMETRIA,
  RENG_ESCENA_ELECTROLISIS,
  RENG_ESCENA_FORMULA_IONICA,
  RENG_ESCENA_COMBUSTION,
  RENG_ESCENA_DENSIDAD,
  RENG_ESCENA_ATOMO,
  RENG_ESCENA_ESPECTRO,
  RENG_ESCENA_CONFIG,
  RENG_ESCENA_TENDENCIAS,
  RENG_ESCENA_CARGA_FORMAL,
  RENG_ESCENA_POLARIDAD,
  RENG_ESCENA_VSEPR,
  RENG_ESCENA_INTERACCION,
  RENG_ESCENA_ORDEN,
  RENG_ESCENA_HIDROCARBURO,
  RENG_ESCENA_FAMILIA_ORGANICA,
  RENG_ESCENA_POLIMERO
]

export const rengEscenaN1PorId = (rengId: string | null | undefined): RengModeloEscenaN1 | undefined => RENG_ESCENAS_N1.find((rengE) => rengE.id === rengId)
