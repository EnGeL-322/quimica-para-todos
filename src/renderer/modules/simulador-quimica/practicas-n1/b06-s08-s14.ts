import { rengLecturasCombustion } from '../escenas-n1/modelos/combustion'
import {
  RENG_COMBUSTIBLES_RQ, RENG_DESCOMPOSICION_RQ, RENG_DESPLAZAMIENTO_RQ, RENG_DOBLE_RQ, RENG_NEUTRALIZACION_RQ, RENG_SINTESIS_RQ,
  rengDatoRx, rengFCombRq, rengMasaDesde, rengMRq, rengPracticaRq, rengTxRq, rengTxtRx, type RengRxRq
} from './b06-comun'
import { rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTxRq
const T = rengTxtNo
const M = rengMRq
const ult = (rengR: RengRxRq): number => rengR.esp.length - 1
export const RENG_SINTESIS_DOS_RQ = RENG_SINTESIS_RQ.filter((rengR) => rengR.nr === 2)
export const RENG_DESC_GAS: ReadonlyArray<{ r: RengRxRq; gas: number }> = RENG_DESCOMPOSICION_RQ.map((rengR) => ({ r: rengR, gas: rengR.esp.findIndex((rengF, rengI) => rengI >= rengR.nr && /^(CO2|O2|H2|NH3)$/.test(rengF)) })).filter((rengX) => rengX.gas >= 0)
export const RENG_METAL_ACIDO = RENG_DESPLAZAMIENTO_RQ.filter((rengR) => rengR.esp[1] === 'HCl')
export const RENG_DOBLE_PPT: ReadonlyArray<{ r: RengRxRq; ppt: number }> = RENG_DOBLE_RQ.map((rengR) => ({ r: rengR, ppt: rengR.nr }))
const lec = (rengI: number, rengN: number) => { const rengC = RENG_COMBUSTIBLES_RQ[rengI]!; return rengLecturasCombustion({ x: rengC.x, y: rengC.y, z: rengC.z, n: rengN }) }
const mFuel = (rengI: number): number => M(rengFCombRq(RENG_COMBUSTIBLES_RQ[rengI]!))

export const RENG_PRACTICAS_B06_S08: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s8-p1', titulo: 'Producto de una síntesis', unidad: 'g',
    objetivo: 'Calcular la masa del producto de una síntesis a partir de la masa de un reactivo.', seccion: '4.2', para: 'las reacciones de síntesis',
    idealizado: 'Reacción completa con el otro reactivo en exceso.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_SINTESIS_DOS_RQ, x: [1, 100, 0.5],
    respuesta: (r, x) => rengMasaDesde(r, 1, x, ult(r)),
    errores: (r, x) => [
      ['sin-coef', 'Proporción 1:1', (x / M(r.esp[1]!)) * M(r.esp[ult(r)]!), 'Usaste una proporción 1:1; aplica los coeficientes de la ecuación.'],
      ['masa-igual', 'Misma masa', x, 'El producto incorpora también el otro reactivo: su masa es mayor.']
    ],
    enunciado: (r, x) => `Síntesis: ${rengTxtRx(r)}. Reaccionan ${tx(x)} g de ${T(r.esp[1]!)} con exceso de ${T(r.esp[0]!)}.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[ult(r)]!)} se forma, en g?`,
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[1]!), `${tx(x)} g`]],
    pasos: (r, _x, _y, rengR) => [`Proporción ${r.nu[1]} : ${r.nu[ult(r)]}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa a moles.', 'Usa los coeficientes.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s8-p2', titulo: 'Reactivo para una síntesis', unidad: 'g',
    objetivo: 'Calcular la masa de un reactivo necesaria para obtener una masa dada de producto en una síntesis.', seccion: '4.2', para: 'las reacciones de síntesis',
    idealizado: 'Reacción completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_SINTESIS_DOS_RQ, x: [1, 100, 0.5],
    respuesta: (r, x) => rengMasaDesde(r, ult(r), x, 0),
    errores: (r, x) => [
      ['sin-coef', 'Proporción 1:1', (x / M(r.esp[ult(r)]!)) * M(r.esp[0]!), 'Usaste una proporción 1:1; aplica los coeficientes.'],
      ['masa-igual', 'Misma masa', x, 'El reactivo pesa menos que el producto, que incorpora otros átomos.']
    ],
    enunciado: (r, x) => `Se quieren obtener ${tx(x)} g de ${T(r.esp[ult(r)]!)} por la síntesis ${rengTxtRx(r)}.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[0]!)} hace falta, en g?`,
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[ult(r)]!), `${tx(x)} g`]],
    pasos: (r, _x, _y, rengR) => [`Proporción ${r.nu[ult(r)]} : ${r.nu[0]}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa el producto a moles.', 'Usa los coeficientes.', 'Pasa el reactivo a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s8-p3', titulo: 'Síntesis con reactivo limitante', unidad: 'g',
    objetivo: 'Calcular la masa de producto de una síntesis cuando se dan las masas de los dos reactivos.', seccion: '4.3', para: 'el reactivo limitante',
    idealizado: 'Reacción completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_SINTESIS_DOS_RQ, x: [1, 50, 0.5], y: [1, 50, 0.5],
    valida: (r, x, y) => { const a = x / M(r.esp[0]!) / r.nu[0]!; const b = y / M(r.esp[1]!) / r.nu[1]!; return Math.abs(a - b) > 0.1 * Math.max(a, b) },
    respuesta: (r, x, y) => Math.min(rengMasaDesde(r, 0, x, ult(r)), rengMasaDesde(r, 1, y, ult(r))),
    errores: (r, x, y) => [
      ['exceso', 'Con el reactivo en exceso', Math.max(rengMasaDesde(r, 0, x, ult(r)), rengMasaDesde(r, 1, y, ult(r))), 'Calculaste con el reactivo en exceso; manda el que se agota antes.'],
      ['suma', 'Suma de masas', x + y, 'No reacciona todo: sobra parte del reactivo en exceso.']
    ],
    enunciado: (r, x, y) => `Se mezclan ${tx(x)} g de ${T(r.esp[0]!)} y ${tx(y)} g de ${T(r.esp[1]!)}: ${rengTxtRx(r)}.`, pregunta: (r) => `¿Qué masa máxima de ${T(r.esp[ult(r)]!)} se forma, en g?`,
    datos: (r, x, y) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} g`], [T(r.esp[1]!), `${tx(y)} g`]],
    pasos: (_r, _x, _y, rengR) => ['Calcula el producto con cada reactivo; el menor resultado indica el limitante.', `m = ${tx(rengR)} g.`],
    pistas: ['Pasa los dos a moles.', 'Compara n/ν.', 'Usa el limitante.']
  })
]

export const RENG_PRACTICAS_B06_S09: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s9-p1', titulo: 'Gas de una descomposición', unidad: 'g',
    objetivo: 'Calcular la masa de gas que desprende la descomposición de una masa de sustancia.', seccion: '4.2', para: 'las reacciones de descomposición',
    idealizado: 'Descomposición completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DESC_GAS, x: [1, 100, 0.5],
    respuesta: (d, x) => rengMasaDesde(d.r, 0, x, d.gas),
    errores: (d, x) => [
      ['masa-igual', 'Toda la masa', x, 'No todo el reactivo se convierte en gas; parte queda como otro producto.'],
      ['otro-producto', 'Otro producto', rengMasaDesde(d.r, 0, x, d.gas === d.r.nr ? d.r.nr + 1 : d.r.nr), 'Calculaste la masa de otro producto, no la del gas.']
    ],
    enunciado: (d, x) => `Se descomponen por completo ${tx(x)} g de ${T(d.r.esp[0]!)}: ${rengTxtRx(d.r)}.`, pregunta: (d) => `¿Qué masa de ${T(d.r.esp[d.gas]!)} se desprende, en g?`,
    datos: (d, x) => [rengDatoRx(d.r), [T(d.r.esp[0]!), `${tx(x)} g`]],
    pasos: (d, _x, _y, rengR) => [`Proporción ${d.r.nu[0]} : ${d.r.nu[d.gas]}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa a moles.', 'Usa los coeficientes.', 'Pasa el gas a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s9-p2', titulo: 'Residuo de una descomposición', unidad: 'g',
    objetivo: 'Calcular, por conservación de la masa, lo que queda tras desprenderse el gas de una descomposición.', seccion: '4.2', para: 'las reacciones de descomposición',
    idealizado: 'Descomposición completa; todo el gas escapa.', metodo: 'proporción de coeficientes del núcleo', lista: RENG_DESC_GAS, x: [1, 100, 0.5],
    respuesta: (d, x) => x - rengMasaDesde(d.r, 0, x, d.gas),
    errores: (d, x) => [
      ['gas', 'Masa del gas', rengMasaDesde(d.r, 0, x, d.gas), 'Esa es la masa del gas que escapa; la pregunta pide lo que queda.'],
      ['sin-coef', 'Gas con proporción 1:1', x - (x / M(d.r.esp[0]!)) * M(d.r.esp[d.gas]!), 'Calculaste el gas con proporción 1:1; usa los coeficientes.']
    ],
    enunciado: (d, x) => `Se calientan ${tx(x)} g de ${T(d.r.esp[0]!)} hasta descomponerlos: ${rengTxtRx(d.r)}. El ${T(d.r.esp[d.gas]!)} escapa.`, pregunta: '¿Qué masa queda en el recipiente, en g?',
    datos: (d, x) => [rengDatoRx(d.r), [T(d.r.esp[0]!), `${tx(x)} g`]],
    pasos: (d, x, _y, rengR) => [`Gas: ${tx(rengMasaDesde(d.r, 0, x, d.gas))} g.`, `Queda: ${tx(x)} − gas = ${tx(rengR)} g.`],
    pistas: ['Calcula la masa del gas.', 'La masa se conserva.', 'Resta para obtener lo que queda.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s9-p3', titulo: 'Sustancia para obtener un gas', unidad: 'g',
    objetivo: 'Calcular la masa de sustancia que hay que descomponer para obtener una masa dada de gas.', seccion: '4.2', para: 'las reacciones de descomposición',
    idealizado: 'Descomposición completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DESC_GAS, x: [0.5, 50, 0.5],
    respuesta: (d, x) => rengMasaDesde(d.r, d.gas, x, 0),
    errores: (d, x) => [
      ['invertida', 'Masas invertidas', (x * M(d.r.esp[d.gas]!)) / M(d.r.esp[0]!) * (d.r.nu[d.gas]! / d.r.nu[0]!), 'Invertiste las masas molares; pasa el gas a moles y luego la sustancia a gramos.'],
      ['masa-igual', 'Misma masa', x, 'La sustancia pesa más que el gas que desprende.']
    ],
    enunciado: (d, x) => `Se quieren obtener ${tx(x)} g de ${T(d.r.esp[d.gas]!)} por ${rengTxtRx(d.r)}.`, pregunta: (d) => `¿Qué masa de ${T(d.r.esp[0]!)} hay que descomponer, en g?`,
    datos: (d, x) => [rengDatoRx(d.r), [T(d.r.esp[d.gas]!), `${tx(x)} g`]],
    pasos: (_d, _x, _y, rengR) => ['Pasa el gas a moles y usa la proporción.', `m = ${tx(rengR)} g.`],
    pistas: ['Moles del gas.', 'Proporción de coeficientes.', 'Masa de la sustancia.']
  })
]

export const RENG_PRACTICAS_B06_S10: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s10-p1', titulo: 'Elemento desplazado', unidad: 'g',
    objetivo: 'Calcular la masa del elemento desplazado a partir de la masa del elemento más activo.', seccion: '4.2', para: 'el desplazamiento simple',
    idealizado: 'Reacción completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DESPLAZAMIENTO_RQ, x: [1, 50, 0.5],
    respuesta: (r, x) => rengMasaDesde(r, 0, x, ult(r)),
    errores: (r, x) => [
      ['sin-coef', 'Proporción 1:1', (x / M(r.esp[0]!)) * M(r.esp[ult(r)]!), 'Usaste una proporción 1:1 entre los dos elementos; mira los coeficientes.'],
      ['masa-igual', 'Misma masa', x, 'Los dos elementos tienen masas molares distintas: no se obtiene la misma masa.']
    ],
    valida: (r) => r.nu[0] !== r.nu[ult(r)] || Math.abs(M(r.esp[0]!) - M(r.esp[ult(r)]!)) > 0.05 * M(r.esp[0]!),
    enunciado: (r, x) => `${rengTxtRx(r)}. Reaccionan ${tx(x)} g de ${T(r.esp[0]!)} con exceso de ${T(r.esp[1]!)}.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[ult(r)]!)} se obtiene, en g?`,
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} g`]],
    pasos: (r, _x, _y, rengR) => [`El ${T(r.esp[0]!)} desplaza al ${T(r.esp[ult(r)]!)}: proporción ${r.nu[0]} : ${r.nu[ult(r)]}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa a moles.', 'Usa los coeficientes.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s10-p2', titulo: 'Metal necesario para desplazar', unidad: 'g',
    objetivo: 'Calcular la masa del elemento activo que se necesita para obtener una masa dada del desplazado.', seccion: '4.2', para: 'el desplazamiento simple',
    idealizado: 'Reacción completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DESPLAZAMIENTO_RQ, x: [0.1, 20, 0.1],
    valida: (r) => r.nu[0] !== r.nu[ult(r)] || Math.abs(M(r.esp[0]!) - M(r.esp[ult(r)]!)) > 0.05 * M(r.esp[0]!),
    respuesta: (r, x) => rengMasaDesde(r, ult(r), x, 0),
    errores: (r, x) => [
      ['sin-coef', 'Proporción 1:1', (x / M(r.esp[ult(r)]!)) * M(r.esp[0]!), 'Usaste una proporción 1:1; aplica los coeficientes.'],
      ['invertida', 'Masas invertidas', ((x * M(r.esp[ult(r)]!)) / M(r.esp[0]!)) * (r.nu[0]! / r.nu[ult(r)]!), 'Invertiste las masas molares de los dos elementos.']
    ],
    enunciado: (r, x) => `${rengTxtRx(r)}. Se quieren obtener ${tx(x)} g de ${T(r.esp[ult(r)]!)}.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[0]!)} se necesita, en g?`,
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[ult(r)]!), `${tx(x)} g`]],
    pasos: (_r, _x, _y, rengR) => ['Pasa el producto a moles y usa la proporción.', `m = ${tx(rengR)} g.`],
    pistas: ['Moles del producto.', 'Proporción de coeficientes.', 'Masa del reactivo.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s10-p3', titulo: 'Hidrógeno de un metal en ácido', unidad: 'mol',
    objetivo: 'Calcular los moles de H₂ que desprende un metal activo al reaccionar con ácido clorhídrico.', seccion: '4.2', para: 'el desplazamiento del hidrógeno',
    idealizado: 'Ácido en exceso.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_METAL_ACIDO, x: [0.5, 30, 0.5],
    respuesta: (r, x) => (x / M(r.esp[0]!) / r.nu[0]!) * r.nu[ult(r)]!,
    errores: (r, x) => [
      ['masa', 'Masa en lugar de moles', rengMasaDesde(r, 0, x, ult(r)), 'Calculaste la masa de H₂; la pregunta pide moles.'],
      ['sin-coef', 'Un H₂ por átomo', x / M(r.esp[0]!), 'Con algunos metales no sale un H₂ por átomo: mira los coeficientes.']
    ],
    valida: (r, x) => Math.abs(rengMasaDesde(r, 0, x, ult(r)) - (x / M(r.esp[0]!) / r.nu[0]!) * r.nu[ult(r)]!) > 0.15,
    enunciado: (r, x) => `Se echan ${tx(x)} g de ${T(r.esp[0]!)} en ácido clorhídrico en exceso: ${rengTxtRx(r)}.`, pregunta: '¿Cuántos moles de H₂ se desprenden?',
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} g`]],
    pasos: (r, _x, _y, rengR) => [`Proporción ${r.nu[0]} : ${r.nu[ult(r)]}.`, `n(H₂) = ${tx(rengR)} mol.`],
    pistas: ['Pasa el metal a moles.', 'Usa los coeficientes.', 'Deja el resultado en moles.']
  })
]

export const RENG_PRACTICAS_B06_S11: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s11-p1', titulo: 'Producto insoluble de un intercambio', unidad: 'g',
    objetivo: 'Calcular la masa del producto sólido de un doble desplazamiento a partir de la masa de un reactivo.', seccion: '4.2', para: 'el doble desplazamiento',
    idealizado: 'Reacción completa con el otro reactivo en exceso.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DOBLE_PPT, x: [0.5, 50, 0.5],
    respuesta: (d, x) => rengMasaDesde(d.r, 0, x, d.ppt),
    errores: (d, x) => [
      ['masa-igual', 'Misma masa', x, 'El sólido no pesa lo mismo que el reactivo: pasa por los moles y las masas molares.'],
      ['soluble', 'Producto soluble', rengMasaDesde(d.r, 0, x, d.ppt + 1), 'Calculaste el otro producto, que queda disuelto.']
    ],
    valida: (d) => Math.abs(M(d.r.esp[0]!) * d.r.nu[d.ppt]! - M(d.r.esp[d.ppt]!) * d.r.nu[0]!) > 0.03 * M(d.r.esp[0]!),
    enunciado: (d, x) => `${rengTxtRx(d.r)}. Reaccionan ${tx(x)} g de ${T(d.r.esp[0]!)} con exceso del otro reactivo.`, pregunta: (d) => `¿Qué masa de ${T(d.r.esp[d.ppt]!)} se forma, en g?`,
    datos: (d, x) => [rengDatoRx(d.r), [T(d.r.esp[0]!), `${tx(x)} g`]],
    pasos: (d, _x, _y, rengR) => [`Proporción ${d.r.nu[0]} : ${d.r.nu[d.ppt]}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa a moles.', 'Usa los coeficientes.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s11-p2', titulo: 'Segundo reactivo del intercambio', unidad: 'g',
    objetivo: 'Calcular la masa del segundo reactivo que reacciona exactamente con una masa del primero.', seccion: '4.2', para: 'el doble desplazamiento',
    idealizado: 'Proporción estequiométrica.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DOBLE_PPT, x: [0.5, 50, 0.5],
    valida: (d) => d.r.nu[0] !== d.r.nu[1],
    respuesta: (d, x) => rengMasaDesde(d.r, 0, x, 1),
    errores: (d, x) => [
      ['sin-coef', 'Proporción 1:1', (x / M(d.r.esp[0]!)) * M(d.r.esp[1]!), 'Usaste una proporción 1:1; mira los coeficientes de los reactivos.'],
      ['invertida', 'Proporción invertida', (x / M(d.r.esp[0]!)) * (d.r.nu[0]! / d.r.nu[1]!) * M(d.r.esp[1]!), 'Invertiste la proporción entre los reactivos.']
    ],
    enunciado: (d, x) => `${rengTxtRx(d.r)}. Hay ${tx(x)} g de ${T(d.r.esp[0]!)}.`, pregunta: (d) => `¿Qué masa de ${T(d.r.esp[1]!)} reacciona exactamente con ellos, en g?`,
    datos: (d, x) => [rengDatoRx(d.r), [T(d.r.esp[0]!), `${tx(x)} g`]],
    pasos: (d, _x, _y, rengR) => [`Proporción ${d.r.nu[0]} : ${d.r.nu[1]}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa a moles.', 'Usa los coeficientes.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s11-p3', titulo: 'Sal que queda disuelta', unidad: 'g',
    objetivo: 'Calcular la masa de la sal soluble que se forma en un doble desplazamiento.', seccion: '4.2', para: 'el doble desplazamiento',
    idealizado: 'Reacción completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DOBLE_PPT, x: [0.5, 50, 0.5],
    respuesta: (d, x) => rengMasaDesde(d.r, 0, x, d.ppt + 1),
    errores: (d, x) => [
      ['precipitado', 'Masa del sólido', rengMasaDesde(d.r, 0, x, d.ppt), 'Esa es la masa del precipitado; la pregunta pide la sal disuelta.'],
      ['sin-coef', 'Proporción 1:1', (x / M(d.r.esp[0]!)) * M(d.r.esp[d.ppt + 1]!), 'Usaste una proporción 1:1; aplica los coeficientes.']
    ],
    valida: (d) => d.r.nu[0] !== d.r.nu[d.ppt + 1],
    enunciado: (d, x) => `${rengTxtRx(d.r)}. Reaccionan ${tx(x)} g de ${T(d.r.esp[0]!)}.`, pregunta: (d) => `¿Qué masa de ${T(d.r.esp[d.ppt + 1]!)} queda en disolución, en g?`,
    datos: (d, x) => [rengDatoRx(d.r), [T(d.r.esp[0]!), `${tx(x)} g`]],
    pasos: (d, _x, _y, rengR) => [`Proporción ${d.r.nu[0]} : ${d.r.nu[d.ppt + 1]}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Identifica el producto soluble.', 'Usa los coeficientes.', 'Pasa a gramos.']
  })
]

export const RENG_PRACTICAS_B06_S12: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s12-p1', titulo: 'Precipitado desde una disolución', unidad: 'g',
    objetivo: 'Calcular la masa de precipitado que forma un volumen de disolución de concentración conocida.', seccion: '15.1', para: 'la precipitación',
    idealizado: 'Precipitación completa con el otro reactivo en exceso.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DOBLE_PPT, x: [10, 200, 5], y: [0.02, 0.5, 0.01],
    respuesta: (d, x, y) => ((x / 1000) * y * d.r.nu[d.ppt]!) / d.r.nu[0]! * M(d.r.esp[d.ppt]!),
    errores: (d, x, y) => [
      ['ml', 'Volumen en mL', x * y * (d.r.nu[d.ppt]! / d.r.nu[0]!) * M(d.r.esp[d.ppt]!), 'La concentración está en mol/L: pasa los mL a litros.'],
      ['masa-reactivo', 'Masa del reactivo', (x / 1000) * y * M(d.r.esp[0]!), 'Calculaste la masa del reactivo disuelto, no la del precipitado.']
    ],
    enunciado: (d, x, y) => `A ${tx(x)} mL de ${T(d.r.esp[0]!)} ${tx(y)} mol/L se añade exceso de ${T(d.r.esp[1]!)}: ${rengTxtRx(d.r)}.`, pregunta: (d) => `¿Qué masa de ${T(d.r.esp[d.ppt]!)} precipita, en g?`,
    datos: (d, x, y) => [rengDatoRx(d.r), ['Volumen', `${tx(x)} mL`], ['Concentración', `${tx(y)} mol/L`]],
    pasos: (d, x, y, rengR) => [`n = ${tx((x / 1000) * y)} mol de ${T(d.r.esp[0]!)}.`, `m(precipitado) = ${tx(rengR)} g.`],
    pistas: ['n = c·V en litros.', 'Usa los coeficientes.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s12-p2', titulo: 'Volumen de precipitante', unidad: 'mL',
    objetivo: 'Calcular el volumen de disolución precipitante necesario para precipitar todo un ion.', seccion: '15.1', para: 'la precipitación',
    idealizado: 'Precipitación completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DOBLE_PPT, x: [10, 100, 5], y: [0.05, 0.5, 0.01],
    valida: (d) => d.r.nu[0] !== d.r.nu[1],
    respuesta: (d, x, y) => (x * y * d.r.nu[1]!) / d.r.nu[0]! / y,
    errores: (d, x) => [
      ['sin-coef', 'Proporción 1:1', x, 'Supusiste que reaccionan mol a mol; usa los coeficientes.'],
      ['invertida', 'Proporción invertida', (x * d.r.nu[0]!) / d.r.nu[1]!, 'Invertiste la proporción entre los dos reactivos.']
    ],
    enunciado: (d, x, y) => `Se tienen ${tx(x)} mL de ${T(d.r.esp[0]!)} ${tx(y)} mol/L y se precipita con ${T(d.r.esp[1]!)} de la misma concentración: ${rengTxtRx(d.r)}.`, pregunta: (d) => `¿Qué volumen de ${T(d.r.esp[1]!)} se necesita, en mL?`,
    datos: (d, x, y) => [rengDatoRx(d.r), [T(d.r.esp[0]!), `${tx(x)} mL, ${tx(y)} mol/L`], [T(d.r.esp[1]!), `${tx(y)} mol/L`]],
    pasos: (d, _x, _y, rengR) => [`n(${T(d.r.esp[1]!)}) = n(${T(d.r.esp[0]!)}) × ${d.r.nu[1]}/${d.r.nu[0]}.`, `V = ${tx(rengR)} mL.`],
    pistas: ['Calcula los moles del primero.', 'Usa los coeficientes.', 'Divide entre la concentración.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s12-p3', titulo: 'Precipitado con limitante', unidad: 'g',
    objetivo: 'Calcular la masa de precipitado cuando se mezclan volúmenes dados de las dos disoluciones.', seccion: '15.1', para: 'la precipitación',
    idealizado: 'Precipitación completa; concentraciones 0,100 mol/L.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DOBLE_PPT, x: [10, 100, 5], y: [10, 100, 5],
    valida: (d, x, y) => { const a = x / d.r.nu[0]!; const b = y / d.r.nu[1]!; return Math.abs(a - b) > 0.1 * Math.max(a, b) },
    respuesta: (d, x, y) => Math.min((x / 1000) * 0.1 / d.r.nu[0]!, (y / 1000) * 0.1 / d.r.nu[1]!) * d.r.nu[d.ppt]! * M(d.r.esp[d.ppt]!),
    errores: (d, x, y) => [
      ['exceso', 'Con el reactivo en exceso', Math.max((x / 1000) * 0.1 / d.r.nu[0]!, (y / 1000) * 0.1 / d.r.nu[1]!) * d.r.nu[d.ppt]! * M(d.r.esp[d.ppt]!), 'Calculaste con el reactivo en exceso; el precipitado lo limita el que se agota.'],
      ['ml', 'Volumen en mL', Math.min(x * 0.1 / d.r.nu[0]!, y * 0.1 / d.r.nu[1]!) * d.r.nu[d.ppt]! * M(d.r.esp[d.ppt]!), 'Pasa los mL a litros antes de calcular los moles.']
    ],
    enunciado: (d, x, y) => `Se mezclan ${tx(x)} mL de ${T(d.r.esp[0]!)} y ${tx(y)} mL de ${T(d.r.esp[1]!)}, ambos 0,100 mol/L: ${rengTxtRx(d.r)}.`, pregunta: (d) => `¿Qué masa de ${T(d.r.esp[d.ppt]!)} precipita, en g?`,
    datos: (d, x, y) => [rengDatoRx(d.r), [T(d.r.esp[0]!), `${tx(x)} mL`], [T(d.r.esp[1]!), `${tx(y)} mL`]],
    pasos: (_d, _x, _y, rengR) => ['Calcula n/ν de cada reactivo; el menor limita.', `m = ${tx(rengR)} g.`],
    pistas: ['Moles de cada reactivo.', 'Compara n/ν.', 'Usa el limitante.']
  })
]

export const RENG_PRACTICAS_B06_S13: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s13-p1', titulo: 'Volumen de base para neutralizar', unidad: 'mL',
    objetivo: 'Calcular el volumen de base que neutraliza un volumen de ácido, teniendo en cuenta los H⁺ y OH⁻ de cada uno.', seccion: '4.2', para: 'la neutralización',
    idealizado: 'Neutralización completa.', metodo: 'bisección con los coeficientes del núcleo', lista: RENG_NEUTRALIZACION_RQ, x: [10, 50, 1], y: [0.05, 0.5, 0.01],
    valida: (r) => r.nu[0] !== r.nu[1],
    respuesta: (r, x, y) => ((x * y * r.nu[1]!) / r.nu[0]!) / 0.1,
    errores: (r, x, y) => [
      ['sin-coef', 'Proporción 1:1', (x * y) / 0.1, 'No reaccionan mol a mol: el ácido o la base aportan más de un H⁺ u OH⁻.'],
      ['invertida', 'Proporción invertida', ((x * y * r.nu[0]!) / r.nu[1]!) / 0.1, 'Invertiste la proporción entre ácido y base.']
    ],
    enunciado: (r, x, y) => `Se neutralizan ${tx(x)} mL de ${T(r.esp[0]!)} ${tx(y)} mol/L con ${T(r.esp[1]!)} 0,100 mol/L: ${rengTxtRx(r)}.`, pregunta: '¿Qué volumen de base se necesita, en mL?',
    datos: (r, x, y) => [rengDatoRx(r), ['Ácido', `${tx(x)} mL, ${tx(y)} mol/L`], ['Base', '0,100 mol/L']],
    pasos: (r, x, y, rengR) => [`n(base) = ${tx(x * y)} mmol × ${r.nu[1]}/${r.nu[0]}.`, `V = ${tx(rengR)} mL.`],
    pistas: ['Calcula los mmol de ácido.', 'Aplica la proporción.', 'Divide entre 0,100 mol/L.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s13-p2', titulo: 'Concentración de un ácido por valoración', unidad: 'mmol/L',
    objetivo: 'Calcular la concentración de un ácido a partir del volumen de base gastado en su neutralización.', seccion: '4.2', para: 'la neutralización',
    idealizado: 'Punto de equivalencia exacto.', metodo: 'bisección con los coeficientes del núcleo', lista: RENG_NEUTRALIZACION_RQ, x: [5, 40, 0.1],
    valida: (r) => r.nu[0] !== r.nu[1],
    respuesta: (r, x) => ((x * 0.1 * r.nu[0]!) / r.nu[1]! / 25) * 1000,
    errores: (r, x) => [
      ['sin-coef', 'Proporción 1:1', ((x * 0.1) / 25) * 1000, 'No reaccionan mol a mol: usa los coeficientes.'],
      ['invertida', 'Proporción invertida', ((x * 0.1 * r.nu[1]!) / r.nu[0]! / 25) * 1000, 'Invertiste la proporción entre ácido y base.']
    ],
    enunciado: (r, x) => `Para neutralizar 25,0 mL de ${T(r.esp[0]!)} se gastan ${tx(x)} mL de ${T(r.esp[1]!)} 0,100 mol/L: ${rengTxtRx(r)}.`, pregunta: '¿Cuál es la concentración del ácido, en mmol/L?',
    datos: (r, x) => [rengDatoRx(r), ['Ácido', '25,0 mL'], ['Base', `${tx(x)} mL, 0,100 mol/L`]],
    pasos: (r, x, _y, rengR) => [`n(base) = ${tx(x * 0.1)} mmol; n(ácido) = n(base) × ${r.nu[0]}/${r.nu[1]}.`, `c = ${tx(rengR)} mmol/L.`],
    pistas: ['Calcula los mmol de base.', 'Aplica la proporción.', 'Divide entre 25,0 mL.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s13-p3', titulo: 'Sal de una neutralización', unidad: 'g',
    objetivo: 'Calcular la masa de sal que se forma al neutralizar una cantidad de ácido.', seccion: '4.2', para: 'la neutralización',
    idealizado: 'Neutralización completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_NEUTRALIZACION_RQ, x: [0.005, 0.5, 0.005],
    respuesta: (r, x) => ((x * r.nu[r.nr]!) / r.nu[0]!) * M(r.esp[r.nr]!),
    errores: (r, x) => [
      ['agua', 'Masa de agua', ((x * r.nu[r.nr + 1]!) / r.nu[0]!) * M('H2O'), 'Calculaste el agua formada; la pregunta pide la sal.'],
      ['acido', 'Masa del ácido', x * M(r.esp[0]!), 'Esa es la masa del ácido de partida, no la de la sal.']
    ],
    enunciado: (r, x) => `Se neutralizan ${tx(x)} mol de ${T(r.esp[0]!)} por completo: ${rengTxtRx(r)}.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[r.nr]!)} se forma, en g?`,
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} mol`]],
    pasos: (r, _x, _y, rengR) => [`Proporción ${r.nu[0]} : ${r.nu[r.nr]}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Usa la proporción ácido : sal.', 'Calcula la masa molar de la sal.', 'Multiplica.']
  })
]

export const RENG_PRACTICAS_B06_S14: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s14-p1', titulo: 'CO₂ de una combustión', unidad: 'g',
    objetivo: 'Calcular la masa de CO₂ que produce la combustión completa de una masa de combustible.', seccion: '4.2', para: 'la combustión',
    idealizado: 'Combustión completa.', metodo: 'escena «combustion» con los mismos moles', lista: RENG_COMBUSTIBLES_RQ.map((_rengC, rengI) => rengI), x: [1, 200, 0.5],
    respuesta: (i, x) => lec(i, x / mFuel(i)).mco2!,
    errores: (i, x) => [
      ['masa-igual', 'Misma masa', x, 'El CO₂ incorpora oxígeno del aire: su masa no es la del combustible.'],
      ['un-co2', 'Un CO₂ por molécula', (x / mFuel(i)) * M('CO2'), 'Cada molécula de combustible da tantos CO₂ como átomos de carbono tiene.']
    ],
    valida: (i) => RENG_COMBUSTIBLES_RQ[i]!.x > 1,
    enunciado: (i, x) => `Se queman por completo ${tx(x)} g de ${RENG_COMBUSTIBLES_RQ[i]!.n} (${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))}).`, pregunta: '¿Qué masa de CO₂ se forma, en g?',
    datos: (i, x) => [['Combustible', `${tx(x)} g de ${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))}`], [`M(${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))})`, `${tx(mFuel(i), 5)} g/mol`]],
    pasos: (i, x, _y, rengR) => [`Cada mol da ${RENG_COMBUSTIBLES_RQ[i]!.x} mol de CO₂.`, `m(CO₂) = ${tx(rengR)} g.`],
    pistas: ['Pasa el combustible a moles.', 'Un CO₂ por cada carbono.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s14-p2', titulo: 'Oxígeno de una combustión', unidad: 'g',
    objetivo: 'Calcular la masa de O₂ que consume la combustión completa de una masa de combustible.', seccion: '4.2', para: 'la combustión',
    idealizado: 'Combustión completa.', metodo: 'escena «combustion» con los mismos moles', lista: RENG_COMBUSTIBLES_RQ.map((_rengC, rengI) => rengI), x: [1, 200, 0.5],
    respuesta: (i, x) => lec(i, x / mFuel(i)).mo2!,
    errores: (i, x) => { const f = RENG_COMBUSTIBLES_RQ[i]!; return [
      ['sin-o-propio', 'Sin restar el O del combustible', (x / mFuel(i)) * (f.x + f.y / 4) * M('O2'), 'Olvidaste que el combustible ya aporta oxígeno.'],
      ['atomos', 'Átomos de O como moléculas', (x / mFuel(i)) * (f.x + f.y / 4 - f.z / 2) * 2 * M('O2'), 'Contaste átomos de oxígeno como si fueran moléculas de O₂.']
    ] },
    valida: (i) => RENG_COMBUSTIBLES_RQ[i]!.z > 0,
    enunciado: (i, x) => `Se queman por completo ${tx(x)} g de ${RENG_COMBUSTIBLES_RQ[i]!.n} (${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))}).`, pregunta: '¿Qué masa de O₂ se consume, en g?',
    datos: (i, x) => [['Combustible', `${tx(x)} g de ${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))}`], [`M(${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))})`, `${tx(mFuel(i), 5)} g/mol`]],
    pasos: (i, _x, _y, rengR) => { const f = RENG_COMBUSTIBLES_RQ[i]!; return [`O₂ por mol: x + y/4 − z/2 = ${tx(f.x + f.y / 4 - f.z / 2)}.`, `m(O₂) = ${tx(rengR)} g.`] },
    pistas: ['Ajusta la combustión.', 'Resta el O del combustible.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s14-p3', titulo: 'Agua de una combustión', unidad: 'g',
    objetivo: 'Calcular la masa de agua que se forma en la combustión completa de un combustible.', seccion: '4.2', para: 'la combustión',
    idealizado: 'Combustión completa.', metodo: 'escena «combustion» con los mismos moles', lista: RENG_COMBUSTIBLES_RQ.map((_rengC, rengI) => rengI), x: [1, 200, 0.5],
    respuesta: (i, x) => lec(i, x / mFuel(i)).mh2o!,
    errores: (i, x) => { const f = RENG_COMBUSTIBLES_RQ[i]!; return [
      ['sin-dividir', 'Un H₂O por H', (x / mFuel(i)) * f.y * M('H2O'), 'Cada H₂O lleva dos hidrógenos: divide los H entre 2.'],
      ['hidrogeno', 'Masa del hidrógeno', (x / mFuel(i)) * f.y * M('H'), 'Calculaste la masa del hidrógeno del combustible, no la del agua.']
    ] },
    enunciado: (i, x) => `Se queman por completo ${tx(x)} g de ${RENG_COMBUSTIBLES_RQ[i]!.n} (${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))}).`, pregunta: '¿Qué masa de agua se forma, en g?',
    datos: (i, x) => [['Combustible', `${tx(x)} g de ${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))}`], [`M(${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))})`, `${tx(mFuel(i), 5)} g/mol`]],
    pasos: (i, _x, _y, rengR) => [`Cada mol da ${RENG_COMBUSTIBLES_RQ[i]!.y / 2} mol de H₂O.`, `m(H₂O) = ${tx(rengR)} g.`],
    pistas: ['Pasa el combustible a moles.', 'Un H₂O por cada dos H.', 'Pasa a gramos.']
  })
]
