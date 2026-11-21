export type RengNivel = 'basico' | 'avanzado'
export type RengPestana = 'explorar' | 'enlaces' | 'formulacion' | 'reacciones' | 'casos' | 'simulaciones'

export interface RengCaracteristica {
  pestana: RengPestana
  descripcion: string
  basico: boolean
  avanzado: boolean
}

export const RENG_CARACTERISTICAS = {
  'casos.fuentesCompletas': { pestana: 'casos', descripcion: 'Fuente completa con fecha en cada dato y lista de fuentes', basico: false, avanzado: true },
  'casos.datos': { pestana: 'casos', descripcion: 'Tabla de datos con su fuente', basico: false, avanzado: true },
  'casos.detalles': { pestana: 'casos', descripcion: 'Más detalles de cada caso', basico: false, avanzado: true },
  'casos.limites': { pestana: 'casos', descripcion: 'Lo que la app no sabe o no verificó', basico: false, avanzado: true },
  'casos.calculadora': { pestana: 'casos', descripcion: 'Calculadora de flúor de la pasta dental', basico: false, avanzado: true },
  'casos.masas': { pestana: 'casos', descripcion: 'Masa molar de cada sustancia', basico: false, avanzado: true },
  'explorar.smiles': { pestana: 'explorar', descripcion: 'SMILES del fragmento activo', basico: false, avanzado: true },
  'explorar.fichaDetalle': { pestana: 'explorar', descripcion: 'Ficha de la sustancia: otros nombres, SMILES, existencia', basico: false, avanzado: true },
  'explorar.tablaCompleta': { pestana: 'explorar', descripcion: 'Tabla periódica completa (118 elementos) con número atómico', basico: false, avanzado: true },
  'explorar.tarjeta': { pestana: 'explorar', descripcion: 'Tarjeta «Estás construyendo» sobre la mesa con la acción principal', basico: true, avanzado: false },
  'explorar.recorrido': { pestana: 'explorar', descripcion: 'Recorrido de tres pasos la primera vez', basico: true, avanzado: false },
  'explorar.medidas': { pestana: 'explorar', descripcion: 'Masa molar, carga, distancias y ángulos medidos en la mesa', basico: false, avanzado: true },
  'explorar.exportar': { pestana: 'explorar', descripcion: 'Copiar fórmula y SMILES', basico: false, avanzado: true },
  'explorar.rotuloEnlace': { pestana: 'explorar', descripcion: 'Rótulo flotante del último enlace sobre la mesa', basico: false, avanzado: true },
  'enlaces.chips': { pestana: 'enlaces', descripcion: 'Enlaces como fichas grandes, de uno en uno', basico: true, avanzado: false },
  'enlaces.tabla': { pestana: 'enlaces', descripcion: 'Tabla de todos los enlaces con Δχ, orden y longitud aproximada', basico: false, avanzado: true },
  'enlaces.datosPaso': { pestana: 'enlaces', descripcion: 'Datos numéricos de cada paso del enlace (Δχ, longitudes)', basico: false, avanzado: true },
  'formulacion.nombresSimples': { pestana: 'formulacion', descripcion: 'Tarjeta con el nombre recomendado (en vez de las tres nomenclaturas)', basico: true, avanzado: false },
  'formulacion.subindices': { pestana: 'formulacion', descripcion: 'Botones − + para subíndices y carga', basico: false, avanzado: true },
  'formulacion.datosAvanzados': { pestana: 'formulacion', descripcion: 'Números de oxidación y datos del compuesto', basico: false, avanzado: true },
  'formulacion.composicionMasa': { pestana: 'formulacion', descripcion: 'Composición en masa', basico: false, avanzado: true },
  'formulacion.empirica': { pestana: 'formulacion', descripcion: 'Fórmula empírica y molecular', basico: false, avanzado: true },
  'reacciones.asistente': { pestana: 'reacciones', descripcion: 'Asistente «¿Qué quieres mezclar?»: dos sustancias y el resultado en una frase', basico: true, avanzado: false },
  'reacciones.editor': { pestana: 'reacciones', descripcion: 'Reactivos, coeficientes, condiciones y productos editables', basico: false, avanzado: true },
  'reacciones.metodosAjuste': { pestana: 'reacciones', descripcion: 'Elegir método de ajuste (algebraico o ion-electrón)', basico: false, avanzado: true },
  'simulaciones.guia': { pestana: 'simulaciones', descripcion: 'Explicación en lenguaje sencillo de qué muestra cada simulación', basico: true, avanzado: false },
  'simulaciones.formulas': { pestana: 'simulaciones', descripcion: 'Ecuaciones usadas, constantes con su fuente y nivel de verificación', basico: false, avanzado: true },
  'reacciones.avisoMetodos': { pestana: 'reacciones', descripcion: 'Aviso de que Avanzado añade el ajuste redox', basico: true, avanzado: false }
} as const satisfies Record<string, RengCaracteristica>

export type RengClaveNivel = keyof typeof RENG_CARACTERISTICAS

export const rengMuestra = (rengNivel: RengNivel, rengClave: RengClaveNivel): boolean => RENG_CARACTERISTICAS[rengClave][rengNivel]

export function rengTablaPorPestana(): Record<RengPestana, { basico: string[]; avanzado: string[] }> {
  const rengT: Record<RengPestana, { basico: string[]; avanzado: string[] }> = {
    explorar: { basico: [], avanzado: [] },
    enlaces: { basico: [], avanzado: [] },
    formulacion: { basico: [], avanzado: [] },
    reacciones: { basico: [], avanzado: [] },
    casos: { basico: [], avanzado: [] },
    simulaciones: { basico: [], avanzado: [] }
  }
  for (const rengC of Object.values(RENG_CARACTERISTICAS) as RengCaracteristica[]) {
    if (rengC.basico) rengT[rengC.pestana].basico.push(rengC.descripcion)
    if (rengC.avanzado) rengT[rengC.pestana].avanzado.push(rengC.descripcion)
  }
  return rengT
}
