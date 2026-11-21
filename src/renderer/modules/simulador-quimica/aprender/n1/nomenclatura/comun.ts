import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengDeclarada, rengSinVerificar } from '../procedencia'
import type { RengEscenaLeccionN1, RengExplorarN1, RengProcedenciaN1 } from '../tipos'
import { rengAnalizarFormula, rengMasaMolarDe, rengSubindice } from '../../../nucleo/formula'
import { rengEstadosOxidacion } from '../../../nucleo/oxidacion'
import { rengNombrar } from '../../../nucleo/nomenclatura'

export const RENG_G5 = {
  simbolo: ['símbolo químico', 'Abreviatura de una o dos letras que representa un elemento; la primera va en mayúscula, como Fe o Cl.'],
  numeroAtomico: ['número atómico', 'Número de protones del núcleo de un átomo; identifica al elemento.'],
  valencia: ['valencia', 'Capacidad de combinación de un elemento; en nomenclatura se usa como el número de oxidación sin signo.'],
  oxidacion: ['número de oxidación', 'Carga que tendría un átomo si todos sus enlaces fueran iónicos; la suma en una especie es igual a su carga.'],
  sistematica: ['nomenclatura sistemática', 'Forma de nombrar que indica con prefijos numéricos (mono-, di-, tri-…) cuántos átomos de cada elemento hay.'],
  stock: ['nomenclatura de Stock', 'Forma de nombrar que indica el número de oxidación del elemento con un número romano entre paréntesis.'],
  tradicional: ['nomenclatura tradicional', 'Forma antigua de nombrar que usa sufijos (-oso, -ico) y prefijos (hipo-, per-) según la valencia.'],
  prefijo: ['prefijo numérico', 'Partícula que indica un número en un nombre: mono 1, di 2, tri 3, tetra 4, penta 5, hexa 6, hepta 7.'],
  oxidoBasico: ['óxido básico', 'Compuesto de un metal con oxígeno; con agua forma un hidróxido.'],
  oxidoAcido: ['óxido ácido', 'Compuesto de un no metal con oxígeno; con agua forma un oxoácido.'],
  peroxido: ['peróxido', 'Compuesto que contiene el ion O₂²⁻, en el que cada oxígeno tiene número de oxidación −1.'],
  hidruroMetalico: ['hidruro metálico', 'Compuesto de un metal con hidrógeno, en el que el hidrógeno actúa con −1.'],
  hidruroNoMetalico: ['hidruro no metálico', 'Compuesto del hidrógeno con un no metal, como NH₃ o CH₄, muchos con nombres comunes.'],
  hidroxido: ['hidróxido', 'Compuesto de un catión metálico con iones OH⁻.'],
  hidracido: ['hidrácido', 'Disolución acuosa de un compuesto de hidrógeno con un halógeno o azufre, como el ácido clorhídrico.'],
  oxoacido: ['oxoácido', 'Ácido formado por hidrógeno, un no metal (o metal de transición) y oxígeno, como el H₂SO₄.'],
  salBinaria: ['sal binaria', 'Compuesto de un metal con un no metal distinto del oxígeno y del hidrógeno, como el NaCl.'],
  oxisal: ['oxisal', 'Sal formada por un catión y un oxoanión, como el KNO₃.'],
  oxoanion: ['oxoanión', 'Anión que contiene oxígeno y otro elemento, como SO₄²⁻ o NO₃⁻.'],
  salAcida: ['sal ácida', 'Sal cuyo anión conserva algún hidrógeno del ácido, como el NaHCO₃.'],
  salBasica: ['sal básica', 'Sal que contiene iones OH⁻ además del anión del ácido, como el Mg(OH)Cl.'],
  hidrato: ['compuesto hidratado', 'Sal que incluye en su estructura un número fijo de moléculas de agua, indicado con ·nH₂O.'],
  formula: ['fórmula química', 'Expresión con símbolos y subíndices que indica qué elementos forman una sustancia y en qué proporción.'],
  subindice: ['subíndice', 'Número escrito abajo a la derecha de un símbolo o paréntesis que indica cuántas veces aparece.'],
  cation: ['catión', 'Ion con carga positiva, como Na⁺ o Fe³⁺.'],
  anion: ['anión', 'Ion con carga negativa, como Cl⁻ o SO₄²⁻.'],
  neutralidad: ['electroneutralidad', 'Condición de que la suma de cargas de los iones de un compuesto sea cero.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionNom = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S24 = '2.4 Chemical Formulas'
export const RENG_S26 = '2.6 Molecular and Ionic Compounds'
export const RENG_S27 = '2.7 Chemical Nomenclature'
export const RENG_S42N = '4.2 Classifying Chemical Reactions'

export const RENG_PROCEDENCIA_NOMBRES = rengDeclarada('Nombres y funciones de los compuestos obtenidos con el módulo de nomenclatura de la app (nucleo/nomenclatura.ts), que sigue las recomendaciones IUPAC 2005 y la nomenclatura tradicional registradas en el proyecto; la existencia de cada compuesto figura en su catálogo con fuente. No se reabrieron las fuentes.')

export const rengEscenaIonica = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'formula-ionica', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena solo combina un catión y un anión con las cargas que eliges; no decide si el compuesto existe ni sirve para compuestos moleculares.' })
export const rengMesaFormulacion = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'formulacion', nombre: 'Mesa · Formulación', instruccion: rengInstruccion, limite: 'La herramienta nombra y formula los compuestos de su catálogo; no cubre sales básicas ni compuestos de coordinación.' })
export const rengTablaExplorar = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'tabla-periodica', sub: '', nombre: 'Tabla periódica', instruccion: rengInstruccion, limite: 'La tabla muestra símbolos, números atómicos y masas; no explica el origen de cada símbolo.' })

export const rengMmNom = (rengF: string): number => rengMasaMolarDe(rengF)
export const rengTxtNom = (rengF: string): string => rengSubindice(rengF)
export const rengEstadoDe = (rengF: string, rengEl: string): number => rengEstadosOxidacion(rengAnalizarFormula(rengF))!.get(rengEl)!
export const rengNombreDe = (rengF: string, rengTipo: 'sistematica' | 'stock' | 'tradicional' | 'principal'): string => { const rengK = rengNombrar(rengF); return (rengTipo === 'principal' ? rengK.nombres.principal : rengK.nombres[rengTipo]) ?? rengK.nombres.principal }
