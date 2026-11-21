import type { RengNivelPractica } from './niveles'

export type RengRama = 'general' | 'inorganica' | 'organica' | 'analitica' | 'fisicoquimica'

export const RENG_RAMAS: ReadonlyArray<{ id: RengRama; nombre: string; resumen: string }> = [
  { id: 'general', nombre: 'Química general', resumen: 'Mol, concentración, ajuste y estequiometría.' },
  { id: 'inorganica', nombre: 'Química inorgánica', resumen: 'Formulación, oxidación, enlace y redox.' },
  { id: 'organica', nombre: 'Química orgánica', resumen: 'Grupos, nomenclatura, isomería y reacciones.' },
  { id: 'analitica', nombre: 'Química analítica', resumen: 'pH, valoración, dilución y calibración.' },
  { id: 'fisicoquimica', nombre: 'Fisicoquímica', resumen: 'Cinética, equilibrio y termoquímica.' }
]

export type RengVerificacionDato = 'didactico' | 'referencia' | 'publicado'

export interface RengFuenteEjercicio {
  texto: string
  verificacion: RengVerificacionDato
  enlace?: string
}

export interface RengDatoEjercicio {
  clave: string
  etiqueta: string
  valor: number | string
  unidad: string
  texto: string
}

export interface RengOpcion {
  id: string
  texto: string
}

export interface RengMetodo {
  pregunta: string
  opciones: RengOpcion[]
  correcta: string
  explicacion: string
}

export interface RengErrorComun {
  valor: number
  mensaje: string
}

export interface RengRespuestaNumero {
  tipo: 'numero'
  valor: number
  unidad: string
  tolRel: number
  tolAbs: number
  decimales: number | null
  erroresComunes: RengErrorComun[]
}

export interface RengTerminoEcuacion {
  formula: string
  coef: number
}

export type RengRespuestaEsperada =
  | RengRespuestaNumero
  | { tipo: 'formula'; formula: string }
  | { tipo: 'nombre'; smiles: string; aceptados: string[] }
  | { tipo: 'ecuacion'; reactivos: RengTerminoEcuacion[]; productos: RengTerminoEcuacion[]; coeficientesMinimos: boolean }
  | { tipo: 'estructura'; modo: 'igual'; smiles: string; estereo: 'ignorar' | 'exigir' }
  | { tipo: 'estructura'; modo: 'isomero'; smiles: string; formula: string; grupo: string | null; estereo: 'ignorar' }
  | { tipo: 'opcion'; opciones: RengOpcion[]; correcta: string }

export interface RengTransferenciaSimulacion {
  escena: 'acidobase' | 'mezcla' | 'cinetica' | 'equilibrio' | 'termo' | 'dilucion' | 'colorimetria' | 'solubilidad' | 'electroquimica' | 'isomeros'
  entradas: Readonly<Record<string, number | string>>
  comparar?: { clave: string; transformacion?: 'log10' }
}

export type RengMarcadorGrafica = 'circulo' | 'cuadrado' | 'rombo' | 'triangulo'

export interface RengSerieGrafica {
  nombre: string
  puntos: Array<[number, number]>
  marcador: RengMarcadorGrafica
  linea: boolean
  discontinua?: boolean
}

export interface RengGraficaEjercicio {
  titulo: string
  tituloX: string
  tituloY: string
  descripcion: string
  series: RengSerieGrafica[]
  marcas?: Array<{ x: number; y: number; etiqueta: string }>
  tabla: { columnas: string[]; filas: Array<Array<string | number>> }
}

export interface RengEstructuraEjercicio {
  etiqueta: string
  smiles: string
  descripcion: string
}

export interface RengEjercicio {
  id: string
  familia: string
  rama: RengRama
  tema: string
  nivel: RengNivelPractica
  semilla: number
  titulo: string
  enunciado: string
  pregunta: string
  datos: RengDatoEjercicio[]
  respuesta: RengRespuestaEsperada
  metodo?: RengMetodo
  hipotesis?: string[]
  pistas: string[]
  pasos: string[]
  comprobacion?: string
  errorFrecuente?: string
  fuente?: RengFuenteEjercicio
  simulacion?: RengTransferenciaSimulacion
  estructura?: string
  variante?: string
  estructuras?: RengEstructuraEjercicio[]
  grafica?: RengGraficaEjercicio
  criterioCompleto?: string
  tabla?: { columnas: string[]; filas: Array<Array<string | number>> }
}

export interface RengGeneracion {
  azar: () => number
  nivel: RengNivelPractica
  semilla: number
}

export type RengBaseEjercicio = Omit<RengEjercicio, 'id' | 'familia' | 'rama' | 'tema' | 'nivel' | 'semilla'>

export interface RengFamilia {
  id: string
  rama: RengRama
  tema: string
  nombre: string
  descripcion: string
  niveles: readonly RengNivelPractica[]
  generar: (rengG: RengGeneracion) => RengBaseEjercicio | null
}

export interface RengTema {
  id: string
  rama: RengRama
  nombre: string
  resumen: string
  escena: 'acidobase' | 'mezcla' | 'cinetica' | 'equilibrio' | 'termo' | 'dilucion' | 'colorimetria' | null
  legado: 'formular-nombrar' | null
}

export type RengTipoVeredicto = 'correcto' | 'incorrecto' | 'entrada-invalida' | 'unidad-incompatible' | 'ambigua' | 'simplificable'

export interface RengVeredicto {
  tipo: RengTipoVeredicto
  motivo: string
  mensaje: string
  detalle?: string[]
  equivale?: string
  errorFrecuente?: string
}

export const rengVeredicto = (rengTipo: RengTipoVeredicto, rengMotivo: string, rengMensaje: string, rengExtra: Partial<Pick<RengVeredicto, 'detalle' | 'equivale' | 'errorFrecuente'>> = {}): RengVeredicto => ({ tipo: rengTipo, motivo: rengMotivo, mensaje: rengMensaje, ...rengExtra })
