import { RengAppError } from './ipc'

export const RENG_ESQUEMA_CUADERNO = 'ciencia-sin-limites/cuaderno'
export const RENG_VERSION_CUADERNO = 1

export const RENG_LIMITES_CUADERNO = {
  corridas: 500,
  mediciones: 200,
  columnas: 32,
  filas: 100_000,
  celdas: 4_000_000,
  texto: 20_000,
  nombre: 160,
  etiquetas: 20,
  lista: 100
} as const

export type RengDisciplina = 'fisica' | 'quimica'
export const RENG_DISCIPLINAS: readonly RengDisciplina[] = ['fisica', 'quimica']

export type RengEstadoResultado = 'calculado' | 'aproximacion' | 'entrada-invalida' | 'fuera-de-dominio' | 'datos-insuficientes' | 'sin-convergencia'
export const RENG_ESTADOS_RESULTADO: readonly RengEstadoResultado[] = ['calculado', 'aproximacion', 'entrada-invalida', 'fuera-de-dominio', 'datos-insuficientes', 'sin-convergencia']
export const RENG_NOMBRE_ESTADO: Record<RengEstadoResultado, string> = {
  calculado: 'Resultado calculado',
  aproximacion: 'Aproximación en el límite del modelo',
  'entrada-invalida': 'Entrada inválida',
  'fuera-de-dominio': 'Fuera del dominio del modelo',
  'datos-insuficientes': 'Modelo o datos insuficientes',
  'sin-convergencia': 'Sin convergencia'
}

export type RengNivelEvidencia = 'modelo-calculado' | 'calculo-verificado' | 'comparado-con-mediciones'
export const RENG_NIVELES_EVIDENCIA: readonly RengNivelEvidencia[] = ['modelo-calculado', 'calculo-verificado', 'comparado-con-mediciones']
export const RENG_NOMBRE_EVIDENCIA: Record<RengNivelEvidencia, string> = {
  'modelo-calculado': 'Modelo calculado',
  'calculo-verificado': 'Cálculo verificado',
  'comparado-con-mediciones': 'Comparado con mediciones'
}

export interface RengMagnitud {
  clave: string
  nombre: string
  unidad: string
}

export interface RengSerie {
  columnas: RengMagnitud[]
  filas: Array<Array<number | null>>
}

export interface RengValorConUnidad {
  clave: string
  nombre: string
  valor: number
  unidad: string
}

export interface RengProcedenciaAjuste {
  tipo: 'ajuste' | 'reutiliza'
  parametro: string
  valor: number
  errorEstandar: number
  proyecto: string
  medicion: string
  medicionNombre: string
  sintetica: boolean
  condiciones: RengValorConUnidad[]
  cambios: string[]
}

export interface RengModeloCorrida {
  id: string
  version: string
  nombre: string
  metodo: string
  evidencia: RengNivelEvidencia
  verificacion: string
}

export interface RengCorrida {
  tipo: 'corrida'
  id: string
  nombre: string
  objetivo: string
  disciplina: RengDisciplina
  fecha: string
  etiquetas: string[]
  notas: string
  modelo: RengModeloCorrida
  parametros: RengValorConUnidad[]
  muestreo: string
  serie: RengSerie
  resultados: RengValorConUnidad[]
  diagnosticos: string[]
  fuentes: string[]
  estado: RengEstadoResultado
  anterior: string | null
  ajuste: RengProcedenciaAjuste | null
  origen: { modulo: string; sub: string; entradas: Record<string, number> }
}

export type RengDatosCorrida = Omit<RengCorrida, 'tipo' | 'id' | 'nombre' | 'objetivo' | 'fecha' | 'etiquetas' | 'notas' | 'anterior' | 'ajuste'>

export interface RengMedicion {
  tipo: 'medicion'
  id: string
  nombre: string
  fecha: string
  notas: string
  serie: RengSerie
  procedencia: string
  sintetica: boolean
  incertidumbre: string
  archivo: string
  formato: { separador: string; decimal: string }
  transformaciones: string[]
}

export interface RengProyecto {
  esquema: typeof RENG_ESQUEMA_CUADERNO
  version: typeof RENG_VERSION_CUADERNO
  id: string
  nombre: string
  creado: string
  modificado: string
  notas: string
  corridas: RengCorrida[]
  mediciones: RengMedicion[]
}

export interface RengResumenProyecto {
  id: string
  nombre: string
  modificado: string
  corridas: number
  mediciones: number
}

export const RENG_ID_CUADERNO_RE = /^[a-z0-9][a-z0-9-]{7,63}$/
const RENG_CLAVE_RE = /^[A-Za-z][A-Za-z0-9_]{0,40}$/

const rengMal = (rengCampo: string, rengPor: string): never => {
  throw new RengAppError('VALIDATION', `Proyecto no válido: «${rengCampo}» ${rengPor}.`)
}
const rengObj = (rengV: unknown, rengC: string): Record<string, unknown> => (typeof rengV === 'object' && rengV !== null && !Array.isArray(rengV) ? (rengV as Record<string, unknown>) : rengMal(rengC, 'debe ser un objeto'))
const rengTxt = (rengV: unknown, rengC: string, rengMax: number = RENG_LIMITES_CUADERNO.texto, rengMin = 0): string => (typeof rengV === 'string' && rengV.length >= rengMin && rengV.length <= rengMax ? rengV : rengMal(rengC, typeof rengV === 'string' ? `debe tener entre ${rengMin} y ${rengMax} caracteres` : 'debe ser texto'))
const rengNum = (rengV: unknown, rengC: string): number => (typeof rengV === 'number' && Number.isFinite(rengV) ? rengV : rengMal(rengC, 'debe ser un número finito'))
const rengArr = (rengV: unknown, rengC: string, rengMax: number): unknown[] => (Array.isArray(rengV) ? (rengV.length <= rengMax ? rengV : rengMal(rengC, `tiene más de ${rengMax} elementos`)) : rengMal(rengC, 'debe ser una lista'))
const rengId = (rengV: unknown, rengC: string): string => {
  const rengS = rengTxt(rengV, rengC, 64, 8)
  return RENG_ID_CUADERNO_RE.test(rengS) ? rengS : rengMal(rengC, 'no es un identificador válido')
}
const rengFecha = (rengV: unknown, rengC: string): string => {
  const rengS = rengTxt(rengV, rengC, 40, 10)
  return Number.isFinite(Date.parse(rengS)) ? rengS : rengMal(rengC, 'no es una fecha válida')
}
const rengTextos = (rengV: unknown, rengC: string, rengMax: number = RENG_LIMITES_CUADERNO.lista): string[] => rengArr(rengV, rengC, rengMax).map((rengX, rengI) => rengTxt(rengX, `${rengC}[${rengI}]`, 2000))
const rengDe = <RengT extends string>(rengV: unknown, rengC: string, rengValidos: readonly RengT[]): RengT => (rengValidos.includes(rengV as RengT) ? (rengV as RengT) : rengMal(rengC, `debe ser uno de: ${rengValidos.join(', ')}`))

function rengMagnitud(rengV: unknown, rengC: string): RengMagnitud {
  const rengO = rengObj(rengV, rengC)
  const rengClave = rengTxt(rengO['clave'], `${rengC}.clave`, 41, 1)
  if (!RENG_CLAVE_RE.test(rengClave)) rengMal(`${rengC}.clave`, 'solo admite letras, cifras y _ (empezando por letra)')
  return { clave: rengClave, nombre: rengTxt(rengO['nombre'], `${rengC}.nombre`, RENG_LIMITES_CUADERNO.nombre), unidad: rengTxt(rengO['unidad'], `${rengC}.unidad`, 40) }
}

function rengSerie(rengV: unknown, rengC: string, rengCuenta: { celdas: number }): RengSerie {
  const rengO = rengObj(rengV, rengC)
  const rengColumnas = rengArr(rengO['columnas'], `${rengC}.columnas`, RENG_LIMITES_CUADERNO.columnas).map((rengX, rengI) => rengMagnitud(rengX, `${rengC}.columnas[${rengI}]`))
  if (new Set(rengColumnas.map((rengK) => rengK.clave)).size !== rengColumnas.length) rengMal(`${rengC}.columnas`, 'tiene claves repetidas')
  const rengFilas = rengArr(rengO['filas'], `${rengC}.filas`, RENG_LIMITES_CUADERNO.filas).map((rengF, rengI) => {
    const rengFila = rengArr(rengF, `${rengC}.filas[${rengI}]`, rengColumnas.length)
    if (rengFila.length !== rengColumnas.length) rengMal(`${rengC}.filas[${rengI}]`, `debe tener ${rengColumnas.length} valores`)
    return rengFila.map((rengX, rengJ) => (rengX === null ? null : rengNum(rengX, `${rengC}.filas[${rengI}][${rengJ}]`)))
  })
  rengCuenta.celdas += rengFilas.length * rengColumnas.length
  if (rengCuenta.celdas > RENG_LIMITES_CUADERNO.celdas) rengMal(rengC, `supera el tope de ${RENG_LIMITES_CUADERNO.celdas.toLocaleString('es')} celdas por proyecto`)
  return { columnas: rengColumnas, filas: rengFilas }
}

function rengValores(rengV: unknown, rengC: string): RengValorConUnidad[] {
  return rengArr(rengV, rengC, RENG_LIMITES_CUADERNO.lista).map((rengX, rengI) => {
    const rengM = rengMagnitud(rengX, `${rengC}[${rengI}]`)
    return { ...rengM, valor: rengNum(rengObj(rengX, `${rengC}[${rengI}]`)['valor'], `${rengC}[${rengI}].valor`) }
  })
}

function rengEntradas(rengV: unknown, rengC: string): Record<string, number> {
  const rengO = rengObj(rengV, rengC)
  const rengClaves = Object.keys(rengO)
  if (rengClaves.length > RENG_LIMITES_CUADERNO.lista) rengMal(rengC, 'tiene demasiadas claves')
  const rengOut: Record<string, number> = {}
  for (const rengK of rengClaves) {
    if (!RENG_CLAVE_RE.test(rengK)) rengMal(rengC, `tiene una clave inválida («${rengK.slice(0, 40)}»)`)
    rengOut[rengK] = rengNum(rengO[rengK], `${rengC}.${rengK}`)
  }
  return rengOut
}

export const rengValidarProcedencia = (rengV: unknown): RengProcedenciaAjuste | null => rengProcedencia(rengV, 'ajuste')

function rengProcedencia(rengV: unknown, rengC: string): RengProcedenciaAjuste | null {
  if (rengV === null || rengV === undefined) return null
  const rengO = rengObj(rengV, rengC)
  const rengParametro = rengTxt(rengO['parametro'], `${rengC}.parametro`, 41, 1)
  if (!RENG_CLAVE_RE.test(rengParametro)) rengMal(`${rengC}.parametro`, 'no es una clave válida')
  return {
    tipo: rengDe(rengO['tipo'], `${rengC}.tipo`, ['ajuste', 'reutiliza'] as const),
    parametro: rengParametro,
    valor: rengNum(rengO['valor'], `${rengC}.valor`),
    errorEstandar: rengO['errorEstandar'] === null || Number.isNaN(rengO['errorEstandar']) ? NaN : rengNum(rengO['errorEstandar'], `${rengC}.errorEstandar`),
    proyecto: rengId(rengO['proyecto'], `${rengC}.proyecto`),
    medicion: rengId(rengO['medicion'], `${rengC}.medicion`),
    medicionNombre: rengTxt(rengO['medicionNombre'], `${rengC}.medicionNombre`, RENG_LIMITES_CUADERNO.nombre),
    sintetica: typeof rengO['sintetica'] === 'boolean' ? rengO['sintetica'] : rengMal(`${rengC}.sintetica`, 'debe ser verdadero o falso'),
    condiciones: rengValores(rengO['condiciones'], `${rengC}.condiciones`),
    cambios: rengTextos(rengO['cambios'], `${rengC}.cambios`)
  }
}

function rengCorrida(rengV: unknown, rengC: string, rengCuenta: { celdas: number }): RengCorrida {
  const rengO = rengObj(rengV, rengC)
  if (rengO['tipo'] !== 'corrida') rengMal(`${rengC}.tipo`, 'debe ser «corrida»')
  const rengM = rengObj(rengO['modelo'], `${rengC}.modelo`)
  const rengOrg = rengObj(rengO['origen'], `${rengC}.origen`)
  const rengModulo = rengTxt(rengOrg['modulo'], `${rengC}.origen.modulo`, 40, 1)
  const rengSub = rengTxt(rengOrg['sub'], `${rengC}.origen.sub`, 41)
  if (!/^[a-z][a-z0-9-]{1,30}$/.test(rengModulo)) rengMal(`${rengC}.origen.modulo`, 'no es un módulo válido')
  if (rengSub !== '' && !/^[a-z0-9][a-z0-9-]{0,40}$/.test(rengSub)) rengMal(`${rengC}.origen.sub`, 'no es una subruta válida')
  return {
    tipo: 'corrida',
    id: rengId(rengO['id'], `${rengC}.id`),
    nombre: rengTxt(rengO['nombre'], `${rengC}.nombre`, RENG_LIMITES_CUADERNO.nombre, 1),
    objetivo: rengTxt(rengO['objetivo'], `${rengC}.objetivo`),
    disciplina: rengDe(rengO['disciplina'], `${rengC}.disciplina`, RENG_DISCIPLINAS),
    fecha: rengFecha(rengO['fecha'], `${rengC}.fecha`),
    etiquetas: rengTextos(rengO['etiquetas'], `${rengC}.etiquetas`, RENG_LIMITES_CUADERNO.etiquetas),
    notas: rengTxt(rengO['notas'], `${rengC}.notas`),
    modelo: {
      id: rengTxt(rengM['id'], `${rengC}.modelo.id`, 60, 1),
      version: rengTxt(rengM['version'], `${rengC}.modelo.version`, 20, 1),
      nombre: rengTxt(rengM['nombre'], `${rengC}.modelo.nombre`, RENG_LIMITES_CUADERNO.nombre, 1),
      metodo: rengTxt(rengM['metodo'], `${rengC}.modelo.metodo`),
      evidencia: rengDe(rengM['evidencia'], `${rengC}.modelo.evidencia`, RENG_NIVELES_EVIDENCIA),
      verificacion: rengTxt(rengM['verificacion'], `${rengC}.modelo.verificacion`)
    },
    parametros: rengValores(rengO['parametros'], `${rengC}.parametros`),
    muestreo: rengTxt(rengO['muestreo'], `${rengC}.muestreo`),
    serie: rengSerie(rengO['serie'], `${rengC}.serie`, rengCuenta),
    resultados: rengValores(rengO['resultados'], `${rengC}.resultados`),
    diagnosticos: rengTextos(rengO['diagnosticos'], `${rengC}.diagnosticos`),
    fuentes: rengTextos(rengO['fuentes'], `${rengC}.fuentes`),
    estado: rengDe(rengO['estado'], `${rengC}.estado`, RENG_ESTADOS_RESULTADO),
    anterior: rengO['anterior'] === null || rengO['anterior'] === undefined ? null : rengId(rengO['anterior'], `${rengC}.anterior`),
    ajuste: rengProcedencia(rengO['ajuste'], `${rengC}.ajuste`),
    origen: { modulo: rengModulo, sub: rengSub, entradas: rengEntradas(rengOrg['entradas'], `${rengC}.origen.entradas`) }
  }
}

function rengMedicion(rengV: unknown, rengC: string, rengCuenta: { celdas: number }): RengMedicion {
  const rengO = rengObj(rengV, rengC)
  if (rengO['tipo'] !== 'medicion') rengMal(`${rengC}.tipo`, 'debe ser «medicion»')
  const rengF = rengObj(rengO['formato'], `${rengC}.formato`)
  if (typeof rengO['sintetica'] !== 'boolean') rengMal(`${rengC}.sintetica`, 'debe ser verdadero o falso')
  return {
    tipo: 'medicion',
    id: rengId(rengO['id'], `${rengC}.id`),
    nombre: rengTxt(rengO['nombre'], `${rengC}.nombre`, RENG_LIMITES_CUADERNO.nombre, 1),
    fecha: rengFecha(rengO['fecha'], `${rengC}.fecha`),
    notas: rengTxt(rengO['notas'], `${rengC}.notas`),
    serie: rengSerie(rengO['serie'], `${rengC}.serie`, rengCuenta),
    procedencia: rengTxt(rengO['procedencia'], `${rengC}.procedencia`),
    sintetica: rengO['sintetica'] as boolean,
    incertidumbre: rengTxt(rengO['incertidumbre'], `${rengC}.incertidumbre`, 2000),
    archivo: rengTxt(rengO['archivo'], `${rengC}.archivo`, 260),
    formato: { separador: rengTxt(rengF['separador'], `${rengC}.formato.separador`, 40), decimal: rengTxt(rengF['decimal'], `${rengC}.formato.decimal`, 40) },
    transformaciones: rengTextos(rengO['transformaciones'], `${rengC}.transformaciones`)
  }
}

export function rengValidarProyecto(rengV: unknown): RengProyecto {
  const rengO = rengObj(rengV, 'proyecto')
  if (rengO['esquema'] !== RENG_ESQUEMA_CUADERNO) throw new RengAppError('VALIDATION', 'El archivo no es un proyecto del cuaderno.')
  if (typeof rengO['version'] !== 'number' || !Number.isInteger(rengO['version'])) rengMal('version', 'debe ser un entero')
  if ((rengO['version'] as number) > RENG_VERSION_CUADERNO) throw new RengAppError('VERSION', `El proyecto usa la versión ${rengO['version'] as number} del cuaderno y esta app solo entiende hasta la ${RENG_VERSION_CUADERNO}. Actualiza la app para abrirlo.`)
  if (rengO['version'] !== RENG_VERSION_CUADERNO) rengMal('version', `no es compatible (se esperaba ${RENG_VERSION_CUADERNO})`)
  const rengCuenta = { celdas: 0 }
  const rengCorridas = rengArr(rengO['corridas'], 'corridas', RENG_LIMITES_CUADERNO.corridas).map((rengX, rengI) => rengCorrida(rengX, `corridas[${rengI}]`, rengCuenta))
  const rengMediciones = rengArr(rengO['mediciones'], 'mediciones', RENG_LIMITES_CUADERNO.mediciones).map((rengX, rengI) => rengMedicion(rengX, `mediciones[${rengI}]`, rengCuenta))
  const rengIds = [...rengCorridas.map((rengX) => rengX.id), ...rengMediciones.map((rengX) => rengX.id)]
  if (new Set(rengIds).size !== rengIds.length) rengMal('corridas/mediciones', 'tienen identificadores repetidos')
  return {
    esquema: RENG_ESQUEMA_CUADERNO,
    version: RENG_VERSION_CUADERNO,
    id: rengId(rengO['id'], 'id'),
    nombre: rengTxt(rengO['nombre'], 'nombre', RENG_LIMITES_CUADERNO.nombre, 1),
    creado: rengFecha(rengO['creado'], 'creado'),
    modificado: rengFecha(rengO['modificado'], 'modificado'),
    notas: rengTxt(rengO['notas'], 'notas'),
    corridas: rengCorridas,
    mediciones: rengMediciones
  }
}

export const rengResumenProyecto = (rengP: RengProyecto): RengResumenProyecto => ({ id: rengP.id, nombre: rengP.nombre, modificado: rengP.modificado, corridas: rengP.corridas.length, mediciones: rengP.mediciones.length })

export function rengProyectoNuevo(rengId: string, rengNombre: string, rengAhora = new Date()): RengProyecto {
  const rengF = rengAhora.toISOString()
  return { esquema: RENG_ESQUEMA_CUADERNO, version: RENG_VERSION_CUADERNO, id: rengId, nombre: rengNombre.trim().slice(0, RENG_LIMITES_CUADERNO.nombre) || 'Proyecto sin nombre', creado: rengF, modificado: rengF, notas: '', corridas: [], mediciones: [] }
}
