import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengDeclarada, rengSinVerificar } from '../procedencia'
import type { RengEscenaLeccionN1, RengExplorarN1, RengProcedenciaN1 } from '../tipos'
import { rengAjustarEcuacion, rengAjustarIonElectron } from '../../../nucleo/ajuste'
import { rengMasaMolarDe, rengSubindice } from '../../../nucleo/formula'
import { rengEstadosOxidacion } from '../../../nucleo/oxidacion'
import { rengAnalizarFormula } from '../../../nucleo/formula'

export const RENG_G6 = {
  reaccion: ['reacción química', 'Proceso en el que unas sustancias (reactivos) se transforman en otras (productos) por reorganización de sus átomos.'],
  reactivo: ['reactivo', 'Sustancia que se consume en una reacción química; se escribe a la izquierda de la flecha.'],
  producto: ['producto', 'Sustancia que se forma en una reacción química; se escribe a la derecha de la flecha.'],
  ecuacion: ['ecuación química', 'Representación de una reacción con fórmulas, coeficientes, una flecha y, a menudo, los estados físicos.'],
  coeficiente: ['coeficiente estequiométrico', 'Número delante de una fórmula en una ecuación ajustada que indica la proporción en moles.'],
  conservacion: ['ley de conservación de la masa', 'En una reacción en sistema cerrado, la masa total de los reactivos es igual a la de los productos.'],
  ajuste: ['ajuste de una ecuación', 'Búsqueda de los coeficientes enteros mínimos que igualan el número de átomos de cada elemento y la carga.'],
  tanteo: ['ajuste por tanteo', 'Método de ajuste que prueba coeficientes elemento a elemento hasta igualar todos los átomos.'],
  algebraico: ['ajuste algebraico', 'Método de ajuste que plantea una ecuación por elemento con los coeficientes como incógnitas y la resuelve.'],
  ionElectron: ['método del ion-electrón', 'Ajuste redox que separa la oxidación y la reducción en semirreacciones e iguala los electrones.'],
  sintesis: ['reacción de síntesis', 'Reacción en la que dos o más sustancias se combinan para formar una sola: A + B → AB.'],
  descomposicion: ['reacción de descomposición', 'Reacción en la que una sustancia se divide en dos o más más sencillas: AB → A + B.'],
  desplazamiento: ['desplazamiento simple', 'Reacción en la que un elemento sustituye a otro en un compuesto: A + BC → AC + B.'],
  dobleDesplazamiento: ['doble desplazamiento', 'Reacción en la que dos compuestos intercambian sus iones: AB + CD → AD + CB.'],
  precipitado: ['precipitado', 'Sólido poco soluble que se forma al mezclar dos disoluciones de iones.'],
  neutralizacion: ['neutralización', 'Reacción entre un ácido y una base que forma una sal y, normalmente, agua.'],
  combustion: ['combustión', 'Reacción rápida de una sustancia con oxígeno que libera calor; la de los compuestos de C e H da CO₂ y H₂O.'],
  reversible: ['reacción reversible', 'Reacción que puede ocurrir en los dos sentidos y alcanza un equilibrio; se escribe con ⇌.'],
  exotermica: ['reacción exotérmica', 'Reacción que libera calor al entorno; su variación de entalpía es negativa (ΔH < 0).'],
  endotermica: ['reacción endotérmica', 'Reacción que absorbe calor del entorno; su variación de entalpía es positiva (ΔH > 0).'],
  oxidacion: ['oxidación', 'Pérdida de electrones de una especie, que aumenta su número de oxidación.'],
  reduccion: ['reducción', 'Ganancia de electrones de una especie, que disminuye su número de oxidación.'],
  oxidante: ['agente oxidante', 'Especie que se reduce y, al hacerlo, oxida a otra; gana los electrones que la otra pierde.'],
  reductor: ['agente reductor', 'Especie que se oxida y, al hacerlo, reduce a otra; cede los electrones que la otra gana.'],
  serie: ['serie de actividad', 'Ordenación de los metales según su tendencia a ceder electrones y desplazar a otros de sus sales.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionRq = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S41 = '4.1 Writing and Balancing Chemical Equations'
export const RENG_S42R = '4.2 Classifying Chemical Reactions'
export const RENG_S43 = '4.3 Reaction Stoichiometry'
export const RENG_S53R = '5.3 Enthalpy'
export const RENG_S131 = '13.1 Chemical Equilibria'
export const RENG_S151 = '15.1 Precipitation and Dissolution'
export const RENG_S171 = '17.1 Review of Redox Chemistry'

export const RENG_PROCEDENCIA_AJUSTE = rengDeclarada('Coeficientes comprobados con el módulo de ajuste de la app (nucleo/ajuste.ts), que iguala átomos y carga y, en las redox, aplica el método del ion-electrón. No se reabrieron fuentes.')
export const RENG_PROCEDENCIA_DH_RQ = rengSinVerificar('Las entalpías de reacción de esta lección son valores redondeados de uso común (combustión del metano −890 kJ/mol, formación del agua líquida −286 kJ/mol, descomposición del CaCO₃ +178 kJ/mol, fotosíntesis +2803 kJ/mol de glucosa); no se contrastaron en esta entrega.')

export const rengEscenaComb = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'combustion', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena solo modela la combustión completa de compuestos de C, H y O; no decide si la fórmula elegida existe ni calcula la energía.' })
export const rengEscenaLim = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'reactivo-limitante', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena trabaja con cuatro reacciones fijas y supone que la reacción es completa.' })
export const rengEscenaAbRq = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'acido-base', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena trata un ácido HA con una base fuerte en disolución ideal a 25 °C; no incluye ácidos polipróticos.' })
export const rengMesaReacciones = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'reacciones', nombre: 'Mesa · Reacciones', instruccion: rengInstruccion, limite: 'La herramienta ajusta y calcula cantidades, pero no decide si la reacción ocurre de verdad ni en qué condiciones.' })
export const rengEquilibrioExplorar = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'equilibrio', nombre: 'Escena de equilibrio químico', instruccion: rengInstruccion, limite: 'La escena usa K constantes de un conjunto de reacciones y comportamiento ideal.' })
export const rengTermoExplorarRq = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'termo', nombre: 'Escena de energía de reacción', instruccion: rengInstruccion, limite: 'La escena usa entalpías y entropías tabuladas de un conjunto fijo de reacciones.' })
export const rengSolubilidadExplorarRq = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'solubilidad', nombre: 'Escena de solubilidad (Q frente a Ksp)', instruccion: rengInstruccion, limite: 'Modelo ideal de sales poco solubles registradas; no incluye hidrólisis ni complejos.' })
export const rengElectroquimicaExplorarRq = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'electroquimica', nombre: 'Escena de celdas galvánicas', instruccion: rengInstruccion, limite: 'Celda ideal en circuito abierto; los potenciales son los de la tabla de la escena.' })

export const rengCoefs = (rengE: string): number[] => { const rengA = rengAjustarEcuacion(rengE); return [...rengA.reactivos, ...rengA.productos].map((rengT) => rengT.coef) }
export const rengTextoAjustado = (rengE: string): string => rengAjustarEcuacion(rengE).texto
export const rengElectronesRedox = (rengE: string, rengMedio: 'acido' | 'basico'): number => rengAjustarIonElectron(rengE, rengMedio).electronesTransferidos
export const rengMmRq = (rengF: string): number => rengMasaMolarDe(rengF)
export const rengTxtRq = (rengF: string): string => rengSubindice(rengF)
export const rengOxRq = (rengF: string, rengEl: string): number => rengEstadosOxidacion(rengAnalizarFormula(rengF))!.get(rengEl)!
export const rengCoefDe = (rengE: string, rengEntrada: string): number => { const rengA = rengAjustarEcuacion(rengE); return [...rengA.reactivos, ...rengA.productos].find((rengT) => rengT.entrada === rengEntrada)!.coef }
export const rengCoefRedoxDe = (rengE: string, rengMedio: 'acido' | 'basico', rengEntrada: string): number => { const rengA = rengAjustarIonElectron(rengE, rengMedio); return [...rengA.reactivos, ...rengA.productos].find((rengT) => rengT.entrada === rengEntrada)!.coef }
