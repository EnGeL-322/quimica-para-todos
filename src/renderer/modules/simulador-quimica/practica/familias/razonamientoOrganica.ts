import { rengDescriptoresCIP, rengDesdeSmiles, rengIdCanonico } from '../../nucleo/molecula'
import { rengElegir } from '../numeros'
import type { RengBaseEjercicio, RengFamilia } from '../tipos'
import { rengMezclar, RENG_FUENTE_DIDACTICA, rengVarianteDeSemilla, type RengVariante } from './util'

export type RengRelacionPar = 'identica' | 'constitucional' | 'enantiomeros' | 'diastereomeros' | 'formula-distinta'

const rengSinEstereo = (rengS: string): string => rengS.replace(/[@/\\]/g, '')

const rengInvertirEstereo = (rengS: string): string => rengS.replace(/@@/g, '#').replace(/@/g, '@@').replace(/#/g, '@')

export function rengClasificarPar(rengA: string, rengB: string): RengRelacionPar {
  const rengGA = rengDesdeSmiles(rengA)
  const rengGB = rengDesdeSmiles(rengB)
  if (rengGA.formula !== rengGB.formula) return 'formula-distinta'
  if (rengIdCanonico(rengA) === rengIdCanonico(rengB)) return 'identica'
  if (rengIdCanonico(rengSinEstereo(rengA)) !== rengIdCanonico(rengSinEstereo(rengB))) return 'constitucional'
  if (rengIdCanonico(rengInvertirEstereo(rengA)) === rengIdCanonico(rengB)) return rengIdCanonico(rengInvertirEstereo(rengA)) === rengIdCanonico(rengA) ? 'diastereomeros' : 'enantiomeros'
  return 'diastereomeros'
}

export interface RengParEstructuras {
  a: string
  b: string
  relacion: RengRelacionPar
}

export const RENG_PARES_ESTRUCTURAS: readonly RengParEstructuras[] = [
  { a: 'CCO', b: 'OCC', relacion: 'identica' },
  { a: 'CC(C)O', b: 'OC(C)C', relacion: 'identica' },
  { a: 'CC(=O)O', b: 'OC(C)=O', relacion: 'identica' },
  { a: 'CCO', b: 'COC', relacion: 'constitucional' },
  { a: 'CC(C)O', b: 'CCCO', relacion: 'constitucional' },
  { a: 'CCC=O', b: 'CC(C)=O', relacion: 'constitucional' },
  { a: 'CCO', b: 'CCCO', relacion: 'formula-distinta' },
  { a: 'CC(=O)O', b: 'CC=O', relacion: 'formula-distinta' },
  { a: 'CCC', b: 'CC=C', relacion: 'formula-distinta' },
  { a: 'C/C=C/C', b: 'C/C=C\\C', relacion: 'diastereomeros' },
  { a: 'C/C=C/CC', b: 'C/C=C\\CC', relacion: 'diastereomeros' },
  { a: 'O=C(O)/C=C/C(=O)O', b: 'O=C(O)/C=C\\C(=O)O', relacion: 'diastereomeros' },
  { a: 'C[C@H](O)C(=O)O', b: 'C[C@@H](O)C(=O)O', relacion: 'enantiomeros' },
  { a: 'C[C@H](N)C(=O)O', b: 'C[C@@H](N)C(=O)O', relacion: 'enantiomeros' },
  { a: 'CC[C@H](C)O', b: 'CC[C@@H](C)O', relacion: 'enantiomeros' }
]

const RENG_TEXTO_RELACION: Record<RengRelacionPar, string> = {
  identica: 'Son la misma sustancia (solo cambia cómo se escribió)',
  constitucional: 'Son isómeros constitucionales (misma fórmula, distinta conectividad)',
  enantiomeros: 'Son enantiómeros (imágenes especulares no superponibles)',
  diastereomeros: 'Son diastereoisómeros (estereoisómeros que no son imágenes especulares)',
  'formula-distinta': 'Son sustancias con distinta fórmula molecular'
}

const RENG_RAZON_RELACION: Record<RengRelacionPar, string> = {
  identica: 'Tienen la misma fórmula y el mismo grafo con la misma estereoquímica: es la misma estructura escrita en otro orden.',
  constitucional: 'Comparten fórmula molecular, pero los átomos se unen en otro orden.',
  enantiomeros: 'Misma conectividad y configuración opuesta en todos los centros estereogénicos: una es la imagen especular de la otra.',
  diastereomeros: 'Misma conectividad y distinta configuración, pero no son imágenes especulares (por ejemplo, un doble enlace E y Z).',
  'formula-distinta': 'Al contar los átomos de cada elemento, las fórmulas moleculares no coinciden: no son isómeros.'
}

export const RENG_VARIANTES_COMPARAR: readonly (RengVariante & { relaciones: readonly RengRelacionPar[]; opciones: readonly RengRelacionPar[] })[] = [
  { id: 'comparar.identidad-o-isomero', nivel: 'preuniversitario', relaciones: ['identica', 'constitucional', 'formula-distinta'], opciones: ['identica', 'constitucional', 'formula-distinta'] },
  { id: 'comparar.constitucional-o-estereo', nivel: 'universitario', relaciones: ['identica', 'constitucional', 'diastereomeros', 'enantiomeros'], opciones: ['identica', 'constitucional', 'diastereomeros', 'enantiomeros'] },
  { id: 'comparar.estereoisomeros', nivel: 'quimico', relaciones: ['enantiomeros', 'diastereomeros', 'constitucional', 'identica'], opciones: ['identica', 'constitucional', 'diastereomeros', 'enantiomeros'] },
  { id: 'comparar.formula-y-conectividad', nivel: 'preuniversitario', relaciones: ['constitucional', 'formula-distinta'], opciones: ['identica', 'constitucional', 'formula-distinta'] }
]

export const RENG_FAMILIA_COMPARAR_ESTRUCTURAS: RengFamilia = {
  id: 'organica.comparar-estructuras',
  rama: 'organica',
  tema: 'isomeria',
  nombre: 'Comparar dos estructuras',
  descripcion: 'Decidir si dos estructuras son la misma sustancia, isómeros constitucionales, estereoisómeros o sustancias distintas.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = RENG_VARIANTES_COMPARAR.find((rengV) => rengV.id === rengVarianteDeSemilla(RENG_VARIANTES_COMPARAR, nivel, semilla)?.id)
    if (!rengVar) return null
    const rengPar = rengElegir(azar, RENG_PARES_ESTRUCTURAS.filter((rengP) => rengVar.relaciones.includes(rengP.relacion)))
    if (rengClasificarPar(rengPar.a, rengPar.b) !== rengPar.relacion) return null
    const rengInvertir = azar() < 0.5
    const [rengA, rengB] = rengInvertir ? [rengPar.b, rengPar.a] : [rengPar.a, rengPar.b]
    const rengTextos = rengVar.opciones.map((rengR) => RENG_TEXTO_RELACION[rengR])
    const rengOrden = rengMezclar(azar, rengTextos)
    const rengOpc = rengOrden.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
    const rengCorrecta = rengOpc.find((rengO) => rengO.texto === RENG_TEXTO_RELACION[rengPar.relacion])!.id
    const rengFormulaA = rengDesdeSmiles(rengA).formula
    const rengFormulaB = rengDesdeSmiles(rengB).formula
    const rengEstructuras = [
      { etiqueta: 'A', smiles: rengA, descripcion: `Estructura A, SMILES ${rengA}, fórmula ${rengFormulaA}` },
      { etiqueta: 'B', smiles: rengB, descripcion: `Estructura B, SMILES ${rengB}, fórmula ${rengFormulaB}` }
    ]
    return {
      variante: rengVar.id,
      titulo: 'Comparar las estructuras A y B',
      enunciado: `Se dibujan dos estructuras. A: ${rengA} (fórmula molecular ${rengFormulaA}). B: ${rengB} (fórmula molecular ${rengFormulaB}). La notación SMILES no depende del orden en que se escribe la molécula; las barras y @ indican estereoquímica.`,
      pregunta: '¿Qué relación hay entre A y B?',
      datos: [],
      estructuras: rengEstructuras,
      respuesta: { tipo: 'opcion', opciones: rengOpc, correcta: rengCorrecta },
      hipotesis: nivel === 'quimico' ? ['Las estructuras se comparan como especies aisladas, sin considerar conformaciones.', 'Se tiene en cuenta toda la estereoquímica escrita.'] : undefined,
      pistas: ['Compara primero las fórmulas moleculares: si son distintas, no son isómeros.', 'Si las fórmulas coinciden, compara cómo se conectan los átomos (ignora la estereoquímica).', 'Si la conectividad coincide, mira la estereoquímica: ¿son idénticas, imágenes especulares o ninguna de las dos?'],
      pasos: [`Fórmulas: A ${rengFormulaA}; B ${rengFormulaB}.`, rengPar.relacion === 'formula-distinta' ? 'Las fórmulas son distintas: no son isómeros.' : `Conectividad ${rengPar.relacion === 'constitucional' ? 'distinta' : 'igual'}.`, `${RENG_TEXTO_RELACION[rengPar.relacion]}. ${RENG_RAZON_RELACION[rengPar.relacion]}`],
      comprobacion: 'Escribe las dos estructuras con una misma orientación y comprueba que tu conclusión se mantiene.',
      errorFrecuente: 'Llamar «isómeros» a dos moléculas con distinta fórmula, o «distintas» a una misma estructura escrita en otro orden.',
      fuente: RENG_FUENTE_DIDACTICA
    }
  }
}

export type RengSuficienciaEstereo = 'definida-rs' | 'definida-ez' | 'sin-marca' | 'sin-centro' | 'parcial'

interface RengCasoEstereo {
  smiles: string
  tipo: 'centro' | 'doble'
}

export interface RengVarianteEstereo extends RengVariante {
  casos: readonly RengCasoEstereo[]
}

export const RENG_VARIANTES_ESTEREO_SUFICIENCIA: readonly RengVarianteEstereo[] = [
  { id: 'suficiencia.centro-sin-marca', nivel: 'universitario', casos: [{ smiles: 'CCC(C)O', tipo: 'centro' }, { smiles: 'CC(O)C(=O)O', tipo: 'centro' }, { smiles: 'CC(N)C(=O)O', tipo: 'centro' }] },
  { id: 'suficiencia.centro-definido', nivel: 'universitario', casos: [{ smiles: 'C[C@H](O)C(=O)O', tipo: 'centro' }, { smiles: 'C[C@@H](O)C(=O)O', tipo: 'centro' }, { smiles: 'C[C@H](N)C(=O)O', tipo: 'centro' }, { smiles: 'C[C@@H](N)C(=O)O', tipo: 'centro' }] },
  { id: 'suficiencia.sin-centro', nivel: 'universitario', casos: [{ smiles: 'CC(C)O', tipo: 'centro' }, { smiles: 'CCC(C)(C)O', tipo: 'centro' }, { smiles: 'CC(=O)O', tipo: 'centro' }] },
  { id: 'suficiencia.doble-enlace', nivel: 'quimico', casos: [{ smiles: 'CC=CC', tipo: 'doble' }, { smiles: 'C/C=C/C', tipo: 'doble' }, { smiles: 'C/C=C\\C', tipo: 'doble' }, { smiles: 'CC=CCC', tipo: 'doble' }] },
  { id: 'suficiencia.parcial', nivel: 'quimico', casos: [{ smiles: 'C[C@H](Br)C(Br)C', tipo: 'centro' }, { smiles: 'C[C@H](O)C(O)CC', tipo: 'centro' }, { smiles: 'CC(Br)[C@H](Br)C', tipo: 'centro' }] }
]

export interface RengDiagnosticoEstereo {
  clase: RengSuficienciaEstereo
  descriptor: string | null
  etiqueta: string
}

export function rengDiagnosticoEstereo(rengSmiles: string): RengDiagnosticoEstereo {
  const rengG = rengDesdeSmiles(rengSmiles)
  const rengCip = rengDescriptoresCIP(rengSmiles)
  if (rengG.estereo === 'no-aplica') return { clase: 'sin-centro', descriptor: null, etiqueta: 'No hay ningún elemento estereogénico: no hay nada que asignar' }
  if (rengG.estereo === 'indefinida') return { clase: 'sin-marca', descriptor: null, etiqueta: 'No basta: el SMILES no define la configuración' }
  if (rengG.estereo === 'parcial') return { clase: 'parcial', descriptor: null, etiqueta: 'No basta: solo está definida una parte de los elementos estereogénicos' }
  if (rengCip.dobles.length > 0) return { clase: 'definida-ez', descriptor: rengCip.dobles[0]!.descriptor, etiqueta: `Sí: el doble enlace es ${rengCip.dobles[0]!.descriptor}` }
  return { clase: 'definida-rs', descriptor: rengCip.centros[0]?.descriptor ?? null, etiqueta: `Sí: el centro es (${rengCip.centros[0]?.descriptor ?? '?'})` }
}

const RENG_OPCIONES_ESTEREO_CENTRO = ['Sí: el centro es (R)', 'Sí: el centro es (S)', 'No basta: el SMILES no define la configuración', 'No hay ningún elemento estereogénico: no hay nada que asignar']
const RENG_OPCIONES_ESTEREO_DOBLE = ['Sí: el doble enlace es E', 'Sí: el doble enlace es Z', 'No basta: el SMILES no define la configuración', 'No hay ningún elemento estereogénico: no hay nada que asignar']
const RENG_OPCIONES_ESTEREO_PARCIAL = ['Sí: todos los centros están definidos', 'No basta: solo está definida una parte de los elementos estereogénicos', 'No hay ningún elemento estereogénico: no hay nada que asignar', 'No basta: el SMILES no define la configuración']

export const RENG_FAMILIA_ESTEREO_SUFICIENCIA: RengFamilia = {
  id: 'organica.estereo-suficiencia',
  rama: 'organica',
  tema: 'estereo',
  nombre: '¿Basta la información para asignar R/S o E/Z?',
  descripcion: 'Decidir si una estructura define su configuración antes de asignar el descriptor.',
  niveles: ['universitario', 'quimico'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = RENG_VARIANTES_ESTEREO_SUFICIENCIA.find((rengV) => rengV.id === rengVarianteDeSemilla(RENG_VARIANTES_ESTEREO_SUFICIENCIA, nivel, semilla)?.id)
    if (!rengVar) return null
    const rengCaso = rengElegir(azar, rengVar.casos)
    const rengDiag = rengDiagnosticoEstereo(rengCaso.smiles)
    const rengTextosPosibles = rengVar.id === 'suficiencia.parcial' ? RENG_OPCIONES_ESTEREO_PARCIAL : rengCaso.tipo === 'doble' ? RENG_OPCIONES_ESTEREO_DOBLE : RENG_OPCIONES_ESTEREO_CENTRO
    const rengCorrectaTexto = rengVar.id === 'suficiencia.parcial' ? RENG_OPCIONES_ESTEREO_PARCIAL[1]! : rengDiag.etiqueta.startsWith('Sí') ? rengDiag.etiqueta.replace(/\(([RS])\)/, '($1)') : rengDiag.etiqueta
    if (!rengTextosPosibles.includes(rengCorrectaTexto)) return null
    const rengOrden = rengMezclar(azar, rengTextosPosibles)
    const rengOpc = rengOrden.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
    const rengG = rengDesdeSmiles(rengCaso.smiles)
    return {
      variante: rengVar.id,
      titulo: 'Suficiencia de la información estereoquímica',
      enunciado: `Se da la estructura ${rengCaso.smiles} (fórmula molecular ${rengG.formula}). En SMILES, @ y @@ definen la configuración de un centro, y las barras / y \\ la de un doble enlace; sin ellas, la estereoquímica no está especificada.`,
      pregunta: `¿Basta esta información para asignar ${rengCaso.tipo === 'doble' ? 'E/Z' : 'R/S'}? Elige la conclusión correcta.`,
      datos: [],
      estructuras: [{ etiqueta: 'A', smiles: rengCaso.smiles, descripcion: `Estructura ${rengCaso.smiles}, fórmula ${rengG.formula}` }],
      respuesta: { tipo: 'opcion', opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrectaTexto)!.id },
      hipotesis: nivel === 'quimico' ? ['Solo cuentan los centros y dobles enlaces estereogénicos de la estructura dada.', 'Una estructura sin marcas no se interpreta como una mezcla ni como un enantiómero concreto.'] : undefined,
      pistas: ['Busca los centros con cuatro sustituyentes distintos y los dobles enlaces con dos sustituyentes distintos en cada carbono.', 'Para cada uno, mira si la estructura trae la marca (@, @@, / o \\) que define su configuración.', 'Si todos están marcados, puedes asignar el descriptor con las reglas CIP; si falta alguna marca, no basta.'],
      pasos: [`Elementos estereogénicos en ${rengCaso.smiles}: ${rengDiag.clase === 'sin-centro' ? 'ninguno' : 'al menos uno'}.`, `Estado de la información: ${rengG.estereo === 'definida' ? 'definida' : rengG.estereo === 'parcial' ? 'parcial' : rengG.estereo === 'indefinida' ? 'sin definir' : 'no aplica'}.`, rengCorrectaTexto + '.'],
      comprobacion: 'Si dices que basta, comprueba que cada elemento estereogénico trae su marca; si dices que no basta, localiza la marca que falta.',
      errorFrecuente: 'Asignar R o S a un centro dibujado sin marca de configuración (la estructura no distingue los dos enantiómeros).',
      fuente: RENG_FUENTE_DIDACTICA
    }
  }
}

export const RENG_FAMILIAS_RAZONAMIENTO_ORGANICA: readonly RengFamilia[] = [RENG_FAMILIA_COMPARAR_ESTRUCTURAS, RENG_FAMILIA_ESTEREO_SUFICIENCIA]
