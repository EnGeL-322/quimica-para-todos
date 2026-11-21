import { rengCorregirRespuesta } from './correccion'
import { RENG_FAMILIAS_ANALITICA } from './familias/analitica'
import { RENG_FAMILIAS_FISICOQUIMICA } from './familias/fisicoquimica'
import { RENG_FAMILIAS_GENERAL } from './familias/general'
import { RENG_FAMILIAS_INORGANICA } from './familias/inorganica'
import { RENG_FAMILIAS_ORGANICA } from './familias/organica'
import { RENG_FAMILIAS_RAZONAMIENTO_ANALITICA } from './familias/razonamientoAnalitica'
import { RENG_FAMILIAS_RAZONAMIENTO_FISICOQUIMICA } from './familias/razonamientoFisicoquimica'
import { RENG_FAMILIAS_RAZONAMIENTO_GENERAL } from './familias/razonamientoGeneral'
import { RENG_FAMILIAS_RAZONAMIENTO_INORGANICA } from './familias/razonamientoInorganica'
import { RENG_FAMILIAS_RAZONAMIENTO_ORGANICA } from './familias/razonamientoOrganica'
import { RENG_NIVELES_PRACTICA, type RengNivelPractica } from './niveles'
import { rengCrearAzar } from './numeros'
import { rengMezclar } from './familias/util'
import { RENG_RAMAS, rengVeredicto, type RengMetodo, type RengEjercicio, type RengFamilia, type RengRama, type RengTema, type RengVeredicto } from './tipos'

export const RENG_TEMAS: readonly RengTema[] = [
  { id: 'mol', rama: 'general', nombre: 'Mol y masa molar', resumen: 'Moles, partículas, composición e incertidumbre de una pesada.', escena: null, legado: null },
  { id: 'concentracion', rama: 'general', nombre: 'Concentración y dilución', resumen: 'Molaridad, diluciones y reactivos comerciales.', escena: null, legado: null },
  { id: 'ajuste', rama: 'general', nombre: 'Ajuste de ecuaciones', resumen: 'Coeficientes enteros mínimos con conservación de elementos y carga.', escena: null, legado: null },
  { id: 'estequiometria', rama: 'general', nombre: 'Estequiometría y rendimiento', resumen: 'Masa de producto, reactivo limitante y rendimiento.', escena: null, legado: null },
  { id: 'formular-nombrar', rama: 'inorganica', nombre: 'Formular y nombrar', resumen: 'Óxidos, hidróxidos, ácidos y sales en las tres nomenclaturas.', escena: null, legado: 'formular-nombrar' },
  { id: 'oxidacion', rama: 'inorganica', nombre: 'Números de oxidación', resumen: 'Estado de oxidación en compuestos, iones y casos especiales.', escena: null, legado: null },
  { id: 'enlace', rama: 'inorganica', nombre: 'Enlace iónico y covalente', resumen: 'Clasificación por electronegatividad y carácter iónico.', escena: null, legado: null },
  { id: 'redox', rama: 'inorganica', nombre: 'Redox y semirreacciones', resumen: 'Semirreacciones y ajuste ion-electrón en medio ácido o básico.', escena: null, legado: null },
  { id: 'grupos', rama: 'organica', nombre: 'Grupos funcionales', resumen: 'Reconocer el grupo funcional y el grupo principal.', escena: null, legado: null },
  { id: 'nomenclatura', rama: 'organica', nombre: 'Nomenclatura IUPAC', resumen: 'Nombrar compuestos a partir de su fórmula semidesarrollada.', escena: null, legado: null },
  { id: 'estructura', rama: 'organica', nombre: 'Escribir estructuras', resumen: 'Fórmulas condensadas y SMILES equivalentes.', escena: null, legado: null },
  { id: 'isomeria', rama: 'organica', nombre: 'Isomería constitucional', resumen: 'Contar isómeros y escribir isómeros de función.', escena: null, legado: null },
  { id: 'estereo', rama: 'organica', nombre: 'Estereoquímica R/S y E/Z', resumen: 'Descriptores CIP de centros y dobles enlaces.', escena: null, legado: null },
  { id: 'reacciones-organicas', rama: 'organica', nombre: 'Reacciones orgánicas', resumen: 'Familias de reacciones con condiciones y productos documentados.', escena: null, legado: null },
  { id: 'ph', rama: 'analitica', nombre: 'pH de ácidos y bases', resumen: 'Ácidos y bases fuertes y débiles, amortiguadores y aproximaciones.', escena: 'acidobase', legado: null },
  { id: 'valoracion', rama: 'analitica', nombre: 'Valoración ácido–base', resumen: 'Equivalencia, pH en la curva e interpretación de datos.', escena: 'mezcla', legado: null },
  { id: 'dilucion', rama: 'analitica', nombre: 'Dilución y patrones', resumen: 'Alícuotas, diluciones en serie y mezclas.', escena: 'dilucion', legado: null },
  { id: 'calibracion', rama: 'analitica', nombre: 'Calibración e incertidumbre', resumen: 'Recta de calibrado, concentración interpolada y su incertidumbre.', escena: 'colorimetria', legado: null },
  { id: 'cinetica', rama: 'fisicoquimica', nombre: 'Cinética química', resumen: 'Semivida, ley integrada, velocidades iniciales y Arrhenius.', escena: 'cinetica', legado: null },
  { id: 'equilibrio', rama: 'fisicoquimica', nombre: 'Equilibrio químico', resumen: 'Q frente a K, tabla ICE, Le Chatelier y sensibilidad.', escena: 'equilibrio', legado: null },
  { id: 'termo', rama: 'fisicoquimica', nombre: 'Termoquímica y energía libre', resumen: 'Hess, ΔG, espontaneidad y constante de equilibrio.', escena: 'termo', legado: null },
  { id: 'ajuste-cinetico', rama: 'fisicoquimica', nombre: 'Ajuste de datos cinéticos', resumen: 'Comparar modelos de orden con datos y estimar k.', escena: 'cinetica', legado: null }
]

export const RENG_FAMILIAS_ORIGINALES_BANCO: readonly RengFamilia[] = [...RENG_FAMILIAS_GENERAL, ...RENG_FAMILIAS_INORGANICA, ...RENG_FAMILIAS_ORGANICA, ...RENG_FAMILIAS_ANALITICA, ...RENG_FAMILIAS_FISICOQUIMICA]

export const RENG_FAMILIAS_RAZONAMIENTO: readonly RengFamilia[] = [...RENG_FAMILIAS_RAZONAMIENTO_GENERAL, ...RENG_FAMILIAS_RAZONAMIENTO_INORGANICA, ...RENG_FAMILIAS_RAZONAMIENTO_ORGANICA, ...RENG_FAMILIAS_RAZONAMIENTO_ANALITICA, ...RENG_FAMILIAS_RAZONAMIENTO_FISICOQUIMICA]

export const RENG_FAMILIAS: readonly RengFamilia[] = [...RENG_FAMILIAS_ORIGINALES_BANCO, ...RENG_FAMILIAS_RAZONAMIENTO]

export const rengTemaPorId = (rengId: string): RengTema | undefined => RENG_TEMAS.find((rengT) => rengT.id === rengId)
export const rengTemasDeRama = (rengRama: RengRama): RengTema[] => RENG_TEMAS.filter((rengT) => rengT.rama === rengRama)
export const rengFamiliasDeTema = (rengTema: string): RengFamilia[] => RENG_FAMILIAS.filter((rengF) => rengF.tema === rengTema)
export const rengNombreRama = (rengRama: RengRama): string => RENG_RAMAS.find((rengR) => rengR.id === rengRama)?.nombre ?? rengRama

const rengHash = (rengTexto: string): number => {
  let rengH = 2166136261
  for (let rengI = 0; rengI < rengTexto.length; rengI++) {
    rengH ^= rengTexto.charCodeAt(rengI)
    rengH = Math.imul(rengH, 16777619)
  }
  return rengH >>> 0
}

export const RENG_INTENTOS_GENERACION = 60

function rengBarajarMetodo(rengM: RengMetodo, rengAzar: () => number): RengMetodo {
  const rengNuevas = rengMezclar(rengAzar, rengM.opciones).map((rengO, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengO.texto, original: rengO.id }))
  return { ...rengM, opciones: rengNuevas.map(({ id: rengId, texto: rengTexto }) => ({ id: rengId, texto: rengTexto })), correcta: rengNuevas.find((rengO) => rengO.original === rengM.correcta)!.id }
}

export function rengGenerarDeFamilia(rengFamilia: RengFamilia, rengNivel: RengNivelPractica, rengSemilla: number): RengEjercicio | null {
  if (!rengFamilia.niveles.includes(rengNivel)) return null
  for (let rengI = 0; rengI < RENG_INTENTOS_GENERACION; rengI++) {
    const rengAzar = rengCrearAzar(rengHash(`${rengFamilia.id}|${rengNivel}|${rengSemilla}|${rengI}`))
    const rengBase = rengFamilia.generar({ azar: rengAzar, nivel: rengNivel, semilla: rengSemilla })
    if (rengBase) return { ...rengBase, ...(rengBase.metodo ? { metodo: rengBarajarMetodo(rengBase.metodo, rengCrearAzar(rengHash(`${rengFamilia.id}|${rengNivel}|${rengSemilla}|${rengI}|metodo`))) } : {}), id: `${rengFamilia.id}~${rengNivel}~${rengSemilla}`, familia: rengFamilia.id, rama: rengFamilia.rama, tema: rengFamilia.tema, nivel: rengNivel, semilla: rengSemilla }
  }
  return null
}

const rengCacheNiveles = new Map<string, RengNivelPractica[]>()

export function rengFamiliasDisponibles(rengTema: string, rengNivel: RengNivelPractica): RengFamilia[] {
  return rengFamiliasDeTema(rengTema).filter((rengF) => rengF.niveles.includes(rengNivel) && rengGenerarDeFamilia(rengF, rengNivel, 1) !== null)
}

export function rengNivelesDeTema(rengTema: string): RengNivelPractica[] {
  const rengGuardado = rengCacheNiveles.get(rengTema)
  if (rengGuardado) return rengGuardado
  const rengTemaDef = rengTemaPorId(rengTema)
  const rengNiveles = rengTemaDef?.legado ? [...RENG_NIVELES_PRACTICA].slice(0, 3) : RENG_NIVELES_PRACTICA.filter((rengN) => rengFamiliasDisponibles(rengTema, rengN).length > 0)
  rengCacheNiveles.set(rengTema, [...rengNiveles])
  return [...rengNiveles]
}

export function rengNivelParaTema(rengTema: string, rengPreferido: RengNivelPractica): RengNivelPractica | null {
  const rengDisponibles = rengNivelesDeTema(rengTema)
  if (rengDisponibles.length === 0) return null
  if (rengDisponibles.includes(rengPreferido)) return rengPreferido
  const rengIdx = RENG_NIVELES_PRACTICA.indexOf(rengPreferido)
  return [...rengDisponibles].sort((rengA, rengB) => Math.abs(RENG_NIVELES_PRACTICA.indexOf(rengA) - rengIdx) - Math.abs(RENG_NIVELES_PRACTICA.indexOf(rengB) - rengIdx))[0] ?? null
}

export function rengEjercicioDeTema(rengTema: string, rengNivel: RengNivelPractica, rengSemilla: number): RengEjercicio | null {
  const rengFamilias = rengFamiliasDisponibles(rengTema, rengNivel)
  if (rengFamilias.length === 0) return null
  const rengFamilia = rengFamilias[(rengSemilla - 1 + rengFamilias.length * 1000) % rengFamilias.length]!
  return rengGenerarDeFamilia(rengFamilia, rengNivel, rengSemilla) ?? rengGenerarDeFamilia(rengFamilia, rengNivel, rengSemilla + 1)
}

export function rengEjercicioPorId(rengId: string): RengEjercicio | null {
  const [rengFamiliaId, rengNivel, rengSemilla] = rengId.split('~')
  const rengFamilia = RENG_FAMILIAS.find((rengF) => rengF.id === rengFamiliaId)
  const rengS = Number(rengSemilla)
  if (!rengFamilia || !(RENG_NIVELES_PRACTICA as readonly string[]).includes(rengNivel ?? '') || !Number.isInteger(rengS)) return null
  return rengGenerarDeFamilia(rengFamilia, rengNivel as RengNivelPractica, rengS)
}

export function rengCorregirEjercicio(rengE: RengEjercicio, rengEntrada: string): RengVeredicto {
  return rengCorregirRespuesta(rengEntrada, rengE.respuesta)
}

export function rengCorregirMetodo(rengE: RengEjercicio, rengElegida: string | null): RengVeredicto | null {
  if (!rengE.metodo) return null
  if (!rengElegida) return rengVeredicto('entrada-invalida', 'metodo-vacio', 'Elige el método antes de comprobar.')
  return rengElegida === rengE.metodo.correcta ? rengVeredicto('correcto', 'metodo-correcto', `Método correcto. ${rengE.metodo.explicacion}`) : rengVeredicto('incorrecto', 'metodo-incorrecto', `Revisa el método. ${rengE.metodo.explicacion}`)
}

export function rengRespuestaTexto(rengE: RengEjercicio): string {
  const rengR = rengE.respuesta
  switch (rengR.tipo) {
    case 'numero':
      return `${String(Number(rengR.valor.toPrecision(10))).replace('.', ',')}${rengR.unidad ? ` ${rengR.unidad}` : ''}`
    case 'formula':
      return rengR.formula
    case 'nombre':
      return rengR.aceptados[0] ?? ''
    case 'ecuacion':
      return `${rengR.reactivos.map((rengT) => `${rengT.coef === 1 ? '' : `${rengT.coef} `}${rengT.formula}`).join(' + ')} -> ${rengR.productos.map((rengT) => `${rengT.coef === 1 ? '' : `${rengT.coef} `}${rengT.formula}`).join(' + ')}`
    case 'estructura':
      return rengR.modo === 'igual' ? rengR.smiles : (RENG_ISOMEROS_RESPUESTA[`${rengR.formula}|${rengR.grupo}|${rengR.smiles}`] ?? '')
    case 'opcion':
      return rengR.correcta
  }
}

export const RENG_ISOMEROS_RESPUESTA: Record<string, string> = {
  'C2H6O|eter|CCO': 'COC',
  'C2H6O|alcohol|COC': 'CCO',
  'C3H8O|alcohol|CCCO': 'CC(C)O',
  'C3H6O|cetona|CCC=O': 'CC(C)=O',
  'C2H4O2|ester|CC(=O)O': 'COC=O'
}

export const RENG_FAMILIAS_ORIGINALES: readonly string[] = [
  'general.mol-masa',
  'general.concentracion',
  'general.ajuste',
  'general.estequiometria',
  'inorganica.oxidacion',
  'inorganica.enlace',
  'inorganica.redox',
  'inorganica.semirreaccion',
  'organica.grupos',
  'organica.nomenclatura',
  'organica.estructura',
  'organica.isomeria',
  'organica.estereo',
  'organica.reacciones',
  'analitica.ph',
  'analitica.valoracion',
  'analitica.dilucion',
  'analitica.calibracion',
  'fisicoquimica.cinetica',
  'fisicoquimica.equilibrio',
  'fisicoquimica.termo',
  'fisicoquimica.ajuste-cinetico'
]

export function rengHuellaEjercicio(rengE: RengEjercicio): string {
  const rengTexto = JSON.stringify(rengE)
  let rengH = 2166136261
  for (let rengI = 0; rengI < rengTexto.length; rengI++) {
    rengH ^= rengTexto.charCodeAt(rengI)
    rengH = Math.imul(rengH, 16777619)
  }
  return (rengH >>> 0).toString(16).padStart(8, '0')
}

export interface RengReferenciaEjercicio {
  ejercicioId: string
  huella: string
  tema: string
  nivel: RengNivelPractica
  semilla: number
  rama: RengRama
}

export const rengReferenciaDeEjercicio = (rengE: RengEjercicio): RengReferenciaEjercicio => ({ ejercicioId: rengE.id, huella: rengHuellaEjercicio(rengE), tema: rengE.tema, nivel: rengE.nivel, semilla: rengE.semilla, rama: rengE.rama })

export function rengReferenciaPorId(rengId: string): RengReferenciaEjercicio | null {
  const rengE = rengEjercicioPorId(rengId)
  return rengE && rengE.id === rengId ? rengReferenciaDeEjercicio(rengE) : null
}

export function rengEjercicioLegado(rengTema: string, rengNivel: RengNivelPractica, rengSemilla: number): RengEjercicio | null {
  const rengFamilias = RENG_FAMILIAS.filter((rengF) => rengF.tema === rengTema && RENG_FAMILIAS_ORIGINALES.includes(rengF.id) && rengF.niveles.includes(rengNivel) && rengGenerarDeFamilia(rengF, rengNivel, 1) !== null)
  if (rengFamilias.length === 0) return null
  const rengFamilia = rengFamilias[(rengSemilla - 1 + rengFamilias.length * 1000) % rengFamilias.length]!
  return rengGenerarDeFamilia(rengFamilia, rengNivel, rengSemilla) ?? rengGenerarDeFamilia(rengFamilia, rengNivel, rengSemilla + 1)
}

export function rengReferenciaLegada(rengTema: string, rengNivel: RengNivelPractica, rengSemilla: number): RengReferenciaEjercicio | null {
  const rengE = rengEjercicioLegado(rengTema, rengNivel, rengSemilla)
  return rengE ? rengReferenciaDeEjercicio(rengE) : null
}

export function rengReferenciaNueva(rengTema: string, rengNivel: RengNivelPractica, rengSemilla: number): RengReferenciaEjercicio | null {
  const rengE = rengEjercicioDeTema(rengTema, rengNivel, rengSemilla)
  return rengE ? rengReferenciaDeEjercicio(rengE) : null
}

export function rengCorreccionCompleta(rengE: RengEjercicio, rengRespuesta: string, rengMetodo: string | null): { veredicto: RengVeredicto; metodo: RengVeredicto | null; completa: boolean } {
  const rengVeredictoRespuesta = rengCorregirEjercicio(rengE, rengRespuesta)
  const rengVeredictoMetodo = rengCorregirMetodo(rengE, rengMetodo)
  return { veredicto: rengVeredictoRespuesta, metodo: rengVeredictoMetodo, completa: rengVeredictoRespuesta.tipo === 'correcto' && (!rengE.metodo || rengVeredictoMetodo?.tipo === 'correcto') }
}

export function rengEjercicioDeIntento(rengI: { ejercicioId: string | null; tema: string; nivel: RengNivelPractica; semilla: number }): RengEjercicio | null {
  if (rengI.ejercicioId) return rengEjercicioPorId(rengI.ejercicioId)
  return rengEjercicioLegado(rengI.tema, rengI.nivel, rengI.semilla)
}

export const RENG_RESOLVEDOR_PRACTICA = {
  porId: rengReferenciaPorId,
  legado: rengReferenciaLegada,
  corregir: (rengId: string, rengRespuesta: string, rengMetodo: string | null) => {
    const rengE = rengEjercicioPorId(rengId)
    return rengE ? rengCorreccionCompleta(rengE, rengRespuesta, rengMetodo) : null
  }
}
