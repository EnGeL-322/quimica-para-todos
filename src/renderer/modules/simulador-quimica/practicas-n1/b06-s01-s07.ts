import { rengCoeficientesCombustion } from '../escenas-n1/modelos/combustion'
import {
  RENG_AJUSTE_RQ, RENG_COMBUSTIBLES_RQ, RENG_DOS_REACTIVOS_RQ, RENG_GAS_ABIERTO_RQ, RENG_REDOX_RQ, RENG_SAL_OXIDANTE_RQ, RENG_SINTESIS_RQ, RENG_TOL_RQ_ENT,
  rengAtomosLado, rengDatoRx, rengETotalRq, rengFCombRq, rengMasaDesde, rengMRq, rengPracticaRq, rengSinAjustarRx, rengSumaNu, rengTxRq, rengTxtRx, type RengRxRq
} from './b06-comun'
import { rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTxRq
const T = rengTxtNo
const M = rengMRq
const ult = (rengR: RengRxRq): number => rengR.esp.length - 1
export const RENG_SINTESIS_SIMPLE_RQ = RENG_SINTESIS_RQ.filter((rengR) => rengR.nr === 2 && rengR.esp.length === 3)
export const RENG_OXIDACION_METAL = RENG_SINTESIS_RQ.filter((rengR) => rengR.esp[1] === 'O2' && /^(Mg|Al|Fe|Ca|Cu|Li)$/.test(rengR.esp[0]!))
export const RENG_AJUSTE_DOS = RENG_AJUSTE_RQ.filter((rengR) => rengR.nr >= 2)
const comb = (rengI: number) => { const rengC = RENG_COMBUSTIBLES_RQ[rengI]!; return rengCoeficientesCombustion(rengC.x, rengC.y, rengC.z) }

export const RENG_PRACTICAS_B06_S01: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s1-p1', titulo: 'Átomos de los reactivos', unidad: '', tolerancia: RENG_TOL_RQ_ENT,
    objetivo: 'Contar los átomos de los reactivos de una ecuación ajustada multiplicando coeficientes por subíndices.', seccion: '4.1', para: 'el concepto de reacción',
    idealizado: 'Ecuación ajustada.', metodo: 'átomos de los productos con los coeficientes del módulo de ajuste del núcleo', lista: RENG_AJUSTE_RQ,
    respuesta: (r) => rengAtomosLado(r, 0, r.nr),
    errores: (r) => [
      ['sin-coef', 'Sin los coeficientes', rengAtomosLado(r, 0, r.nr, false), 'Cada coeficiente multiplica todos los átomos de su fórmula: no lo olvides.'],
      ['coeficientes', 'Solo los coeficientes', r.nu.slice(0, r.nr).reduce((rengA, rengB) => rengA + rengB, 0), 'Sumaste los coeficientes; la pregunta pide átomos, no moléculas.']
    ],
    enunciado: (r) => `Considera la ecuación ajustada ${rengTxtRx(r)}.`, pregunta: '¿Cuántos átomos hay en total en el lado de los reactivos?',
    datos: (r) => [rengDatoRx(r), ['Reactivos', String(r.nr)]],
    pasos: (_r, _x, _y, rengR) => ['Multiplica cada coeficiente por los átomos de su fórmula.', `Total: ${tx(rengR)} átomos, los mismos que en los productos.`],
    pistas: ['Cuenta los átomos de cada fórmula.', 'Multiplica por el coeficiente.', 'Suma todos los reactivos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s1-p2', titulo: 'Producto de una reacción', unidad: 'g',
    objetivo: 'Calcular la masa de producto que forma una masa de reactivo usando la ecuación ajustada.', seccion: '4.3', para: 'las proporciones de la ecuación',
    idealizado: 'Reacción completa con el otro reactivo en exceso.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_SINTESIS_RQ, x: [1, 100, 0.5],
    respuesta: (r, x) => rengMasaDesde(r, 0, x, ult(r)),
    errores: (r, x) => [
      ['sin-coef', 'Sin los coeficientes', (x / M(r.esp[0]!)) * M(r.esp[ult(r)]!), 'Usaste una proporción 1:1; la proporción en moles la dan los coeficientes.'],
      ['masa-igual', 'Misma masa', x, 'El producto incorpora también los demás reactivos: su masa no es la del primero.']
    ],
    enunciado: (r, x) => `Según ${rengTxtRx(r)}, reaccionan ${tx(x)} g de ${T(r.esp[0]!)} con exceso de los demás reactivos.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[ult(r)]!)} se forma, en g?`,
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} g`]],
    pasos: (r, x, _y, rengR) => [`n = ${tx(x)}/${tx(M(r.esp[0]!), 5)} mol; proporción ${r.nu[0]} : ${r.nu[ult(r)]}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa el reactivo a moles.', 'Usa la proporción de coeficientes.', 'Pasa el producto a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s1-p3', titulo: 'Reactivo consumido por diferencia', unidad: 'g',
    objetivo: 'Calcular la masa de un reactivo consumido a partir de las masas medidas y la conservación de la masa.', seccion: '4.3', para: 'la conservación de la masa',
    idealizado: 'Reacción completa en sistema cerrado.', metodo: 'proporción de coeficientes del núcleo', lista: RENG_SINTESIS_SIMPLE_RQ, x: [1, 100, 0.5],
    respuesta: (r, x) => rengMasaDesde(r, 0, x, 2) - x,
    errores: (r, x) => [
      ['suma', 'Suma de masas', rengMasaDesde(r, 0, x, 2) + x, 'Sumaste; la masa del producto ya incluye la del primer reactivo, hay que restar.'],
      ['producto', 'Masa del producto', rengMasaDesde(r, 0, x, 2), 'Esa es la masa del producto; falta restar la del reactivo conocido.']
    ],
    enunciado: (r, x) => `En ${rengTxtRx(r)}, ${tx(x)} g de ${T(r.esp[0]!)} reaccionan por completo y se forman ${tx(rengMasaDesde(r, 0, x, 2), 5)} g de ${T(r.esp[2]!)}.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[1]!)} se ha consumido, en g?`,
    datos: (r, x) => [[T(r.esp[0]!), `${tx(x)} g`], [T(r.esp[2]!), `${tx(rengMasaDesde(r, 0, x, 2), 5)} g`]],
    pasos: (_r, _x, _y, rengR) => ['m(reactivos) = m(productos).', `m = producto − reactivo conocido = ${tx(rengR)} g.`],
    pistas: ['La masa se conserva.', 'Resta la masa conocida.', 'No hace falta pasar a moles.']
  })
]

export const RENG_PRACTICAS_B06_S02: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s2-p1', titulo: 'Segundo reactivo necesario', unidad: 'mol',
    objetivo: 'Calcular los moles de un reactivo que reaccionan con una cantidad dada del otro.', seccion: '4.3', para: 'reactivos y productos',
    idealizado: 'Reacción completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DOS_REACTIVOS_RQ, x: [0.1, 10, 0.05],
    valida: (r) => r.nu[0] !== r.nu[1],
    respuesta: (r, x) => (x * r.nu[1]!) / r.nu[0]!,
    errores: (r, x) => [
      ['sin-coef', 'Proporción 1:1', x, 'Los reactivos no reaccionan mol a mol: usa los coeficientes.'],
      ['invertida', 'Proporción invertida', (x * r.nu[0]!) / r.nu[1]!, 'Invertiste la proporción: multiplica por el coeficiente del reactivo que buscas.']
    ],
    enunciado: (r, x) => `En ${rengTxtRx(r)} reaccionan ${tx(x)} mol de ${T(r.esp[0]!)}.`, pregunta: (r) => `¿Cuántos moles de ${T(r.esp[1]!)} se necesitan?`,
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} mol`]],
    pasos: (r, x, _y, rengR) => [`Proporción ${r.nu[0]} : ${r.nu[1]}.`, `n = ${tx(x)} × ${r.nu[1]}/${r.nu[0]} = ${tx(rengR)} mol.`],
    pistas: ['Lee los dos coeficientes.', 'Plantea la proporción.', 'Multiplica por los moles dados.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s2-p2', titulo: 'Producto en moles', unidad: 'mol',
    objetivo: 'Calcular los moles de producto que se forman a partir de los moles de un reactivo.', seccion: '4.3', para: 'reactivos y productos',
    idealizado: 'Reacción completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DOS_REACTIVOS_RQ, x: [0.1, 10, 0.05],
    valida: (r) => r.nu[0] !== r.nu[r.nr],
    respuesta: (r, x) => (x * r.nu[r.nr]!) / r.nu[0]!,
    errores: (r, x) => [
      ['sin-coef', 'Proporción 1:1', x, 'Reactivo y producto no están en proporción 1:1: usa los coeficientes.'],
      ['invertida', 'Proporción invertida', (x * r.nu[0]!) / r.nu[r.nr]!, 'Invertiste la proporción entre el reactivo y el producto.']
    ],
    enunciado: (r, x) => `En ${rengTxtRx(r)} reaccionan ${tx(x)} mol de ${T(r.esp[0]!)} con exceso del otro reactivo.`, pregunta: (r) => `¿Cuántos moles de ${T(r.esp[r.nr]!)} se forman?`,
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} mol`]],
    pasos: (r, x, _y, rengR) => [`Proporción ${r.nu[0]} : ${r.nu[r.nr]}.`, `n = ${tx(rengR)} mol.`],
    pistas: ['Lee los coeficientes.', 'Plantea la proporción.', 'Multiplica.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s2-p3', titulo: 'El reactivo que se agota', unidad: 'mol',
    objetivo: 'Identificar el reactivo limitante y calcular los moles de producto.', seccion: '4.3', para: 'el reactivo limitante',
    idealizado: 'Reacción completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_DOS_REACTIVOS_RQ, x: [0.5, 10, 0.05], y: [0.5, 10, 0.05],
    valida: (r, x, y) => Math.abs(x / r.nu[0]! - y / r.nu[1]!) > 0.1 * Math.max(x / r.nu[0]!, y / r.nu[1]!),
    respuesta: (r, x, y) => Math.min(x / r.nu[0]!, y / r.nu[1]!) * r.nu[r.nr]!,
    errores: (r, x, y) => [
      ['con-exceso', 'Con el reactivo en exceso', Math.max(x / r.nu[0]!, y / r.nu[1]!) * r.nu[r.nr]!, 'Calculaste con el reactivo en exceso; el producto lo limita el que se agota antes.'],
      ['sin-coef', 'Menor cantidad sin coeficientes', Math.min(x, y) * r.nu[r.nr]!, 'Comparaste moles sin dividir entre los coeficientes: el limitante se decide con n/ν.']
    ],
    enunciado: (r, x, y) => `En ${rengTxtRx(r)} se mezclan ${tx(x)} mol de ${T(r.esp[0]!)} y ${tx(y)} mol de ${T(r.esp[1]!)}.`, pregunta: (r) => `¿Cuántos moles de ${T(r.esp[r.nr]!)} se forman como máximo?`,
    datos: (r, x, y) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} mol`], [T(r.esp[1]!), `${tx(y)} mol`]],
    pasos: (r, x, y, rengR) => [`n/ν: ${tx(x / r.nu[0]!)} y ${tx(y / r.nu[1]!)}; el menor limita.`, `n(producto) = ${tx(rengR)} mol.`],
    pistas: ['Divide moles entre coeficientes.', 'El menor cociente limita.', 'Multiplica por el coeficiente del producto.']
  })
]

export const RENG_PRACTICAS_B06_S03: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s3-p1', titulo: 'Suma de coeficientes', unidad: '', tolerancia: RENG_TOL_RQ_ENT,
    objetivo: 'Ajustar una ecuación y sumar sus coeficientes enteros mínimos.', seccion: '4.1', para: 'las ecuaciones químicas',
    idealizado: 'Ecuación con coeficientes enteros mínimos.', metodo: 'módulo de ajuste del núcleo', lista: RENG_AJUSTE_RQ,
    respuesta: (r) => rengSumaNu(r),
    errores: (r) => [
      ['sin-ajustar', 'Sin ajustar', r.esp.length, 'Contaste las fórmulas como si todos los coeficientes fueran 1: hay que ajustar primero.'],
      ['reactivos', 'Solo los reactivos', r.nu.slice(0, r.nr).reduce((rengA, rengB) => rengA + rengB, 0), 'Sumaste solo los coeficientes de los reactivos; incluye también los productos.']
    ],
    enunciado: (r) => `Ajusta la ecuación ${rengSinAjustarRx(r)}.`, pregunta: '¿Cuánto suman los coeficientes enteros mínimos?',
    datos: (r) => [['Esquema', rengSinAjustarRx(r)], ['Fórmulas', String(r.esp.length)]],
    pasos: (r, _x, _y, rengR) => [`Ajustada: ${rengTxtRx(r)}.`, `Suma: ${tx(rengR)}.`],
    pistas: ['Ajusta elemento a elemento.', 'Usa enteros mínimos.', 'Suma todos los coeficientes.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s3-p2', titulo: 'Masa total de reactivos', unidad: 'g',
    objetivo: 'Leer una ecuación en masas: calcular la masa de todos los reactivos que reaccionan.', seccion: '4.3', para: 'las ecuaciones químicas',
    idealizado: 'Reactivos en proporción estequiométrica.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_AJUSTE_DOS, x: [0.1, 5, 0.05],
    valida: (r) => r.nu.slice(0, r.nr).some((rengN) => rengN !== 1),
    respuesta: (r, x) => r.esp.slice(0, r.nr).reduce((rengS, rengF, rengI) => rengS + ((x * r.nu[rengI]!) / r.nu[0]!) * M(rengF), 0),
    errores: (r, x) => [
      ['sin-coef', 'Sin los coeficientes', r.esp.slice(0, r.nr).reduce((rengS, rengF) => rengS + x * M(rengF), 0), 'Tomaste x mol de cada reactivo; cada uno reacciona en la proporción de su coeficiente.'],
      ['solo-primero', 'Solo el primer reactivo', x * M(r.esp[0]!), 'Calculaste solo la masa del primer reactivo; la pregunta pide todos.']
    ],
    enunciado: (r, x) => `En ${rengTxtRx(r)} reaccionan ${tx(x)} mol de ${T(r.esp[0]!)} con la cantidad justa de los demás reactivos.`, pregunta: '¿Qué masa total de reactivos se consume, en g?',
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} mol`]],
    pasos: (_r, _x, _y, rengR) => ['Moles de cada reactivo = x·ν/ν₁; multiplica por su masa molar.', `Total: ${tx(rengR)} g.`],
    pistas: ['Calcula los moles de cada reactivo.', 'Pasa cada uno a gramos.', 'Suma todas las masas.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s3-p3', titulo: 'Último producto en masa', unidad: 'g',
    objetivo: 'Ajustar una ecuación y usarla para calcular la masa de un producto.', seccion: '4.3', para: 'las ecuaciones químicas',
    idealizado: 'Reacción completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_AJUSTE_RQ, x: [1, 100, 0.5],
    valida: (r) => r.nu[0] !== r.nu[ult(r)],
    respuesta: (r, x) => rengMasaDesde(r, 0, x, ult(r)),
    errores: (r, x) => [
      ['sin-coef', 'Proporción 1:1', (x / M(r.esp[0]!)) * M(r.esp[ult(r)]!), 'Usaste una proporción 1:1; ajusta primero la ecuación.'],
      ['masa-igual', 'Misma masa', x, 'La masa de un producto no tiene por qué ser la del reactivo.']
    ],
    enunciado: (r, x) => `Según el esquema ${rengSinAjustarRx(r)}, reaccionan ${tx(x)} g de ${T(r.esp[0]!)} con exceso del resto.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[ult(r)]!)} se forma, en g?`,
    datos: (r, x) => [['Esquema', rengSinAjustarRx(r)], [T(r.esp[0]!), `${tx(x)} g`]],
    pasos: (r, _x, _y, rengR) => [`Ajustada: ${rengTxtRx(r)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Ajusta la ecuación.', 'Usa la proporción de moles.', 'Pasa a gramos.']
  })
]

export const RENG_PRACTICAS_B06_S04: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s4-p1', titulo: 'Producto por suma de masas', unidad: 'g',
    objetivo: 'Aplicar la conservación de la masa para calcular la masa de producto a partir de las de los reactivos.', seccion: '4.3', para: 'la conservación de la masa',
    idealizado: 'Reactivos en proporción exacta en sistema cerrado.', metodo: 'proporción de coeficientes del núcleo', lista: RENG_SINTESIS_SIMPLE_RQ, x: [1, 100, 0.5],
    respuesta: (r, x) => x + rengMasaDesde(r, 0, x, 1),
    errores: (r, x) => [
      ['resta', 'Diferencia de masas', Math.abs(x - rengMasaDesde(r, 0, x, 1)), 'Restaste; en una síntesis la masa del producto es la suma de las de los reactivos.'],
      ['solo-a', 'Solo un reactivo', x, 'Falta la masa del segundo reactivo, que también forma parte del producto.']
    ],
    enunciado: (r, x) => `En ${rengTxtRx(r)} reaccionan por completo ${tx(x)} g de ${T(r.esp[0]!)} y ${tx(rengMasaDesde(r, 0, x, 1), 5)} g de ${T(r.esp[1]!)}.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[2]!)} se forma, en g?`,
    datos: (r, x) => [[T(r.esp[0]!), `${tx(x)} g`], [T(r.esp[1]!), `${tx(rengMasaDesde(r, 0, x, 1), 5)} g`]],
    pasos: (_r, _x, _y, rengR) => ['Sistema cerrado: m(productos) = m(reactivos).', `m = ${tx(rengR)} g.`],
    pistas: ['La masa se conserva.', 'Suma las masas de los reactivos.', 'Un solo producto.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s4-p2', titulo: 'Oxígeno que gana un metal', unidad: 'g',
    objetivo: 'Calcular cuánto aumenta la masa de un metal al oxidarse, por la conservación de la masa.', seccion: '4.3', para: 'la conservación de la masa',
    idealizado: 'Oxidación completa.', metodo: 'masa del óxido menos masa del metal con el núcleo', lista: RENG_OXIDACION_METAL, x: [1, 100, 0.5],
    respuesta: (r, x) => rengMasaDesde(r, 0, x, 1),
    errores: (r, x) => [
      ['masa-oxido', 'Masa del óxido', rengMasaDesde(r, 0, x, 2), 'Esa es la masa del óxido; el aumento es solo el oxígeno incorporado.'],
      ['sin-coef', 'Proporción 1:1', (x / M(r.esp[0]!)) * M('O2'), 'Supusiste un O₂ por átomo de metal; usa los coeficientes.']
    ],
    enunciado: (r, x) => `Se oxidan por completo ${tx(x)} g de ${T(r.esp[0]!)} al aire: ${rengTxtRx(r)}.`, pregunta: '¿Cuánto aumenta la masa del sólido, en g?',
    datos: (r, x) => [rengDatoRx(r), [T(r.esp[0]!), `${tx(x)} g`]],
    pasos: (_r, _x, _y, rengR) => ['El aumento es la masa de O₂ incorporada.', `Δm = ${tx(rengR)} g.`],
    pistas: ['¿De dónde sale la masa extra?', 'Calcula el O₂ consumido.', 'Usa los coeficientes.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s4-p3', titulo: 'Masa que escapa de un vaso abierto', unidad: 'g',
    objetivo: 'Calcular la pérdida de masa de un recipiente abierto cuando se desprende un gas.', seccion: '4.3', para: 'la conservación de la masa',
    idealizado: 'Todo el gas escapa y la reacción es completa.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_GAS_ABIERTO_RQ, x: [1, 50, 0.5],
    respuesta: (g, x) => rengMasaDesde(g.rx, 0, x, g.gas),
    errores: (g, x) => [
      ['masa-igual', 'Toda la masa', x, 'No escapa todo el reactivo: solo el gas que se forma.'],
      ['otro-producto', 'Otro producto', rengMasaDesde(g.rx, 0, x, g.rx.nr), 'Calculaste la masa de un producto que no es gas; ese queda en el vaso.']
    ],
    enunciado: (g, x) => `En un vaso abierto reaccionan ${tx(x)} g de ${T(g.rx.esp[0]!)}: ${rengTxtRx(g.rx)}.`, pregunta: '¿Cuánto disminuye la masa del vaso, en g?',
    datos: (g, x) => [rengDatoRx(g.rx), [T(g.rx.esp[0]!), `${tx(x)} g`], ['Gas', T(g.rx.esp[g.gas]!)]],
    pasos: (g, _x, _y, rengR) => [`El ${T(g.rx.esp[g.gas]!)} escapa del vaso.`, `Pérdida = ${tx(rengR)} g.`],
    pistas: ['Identifica el gas.', 'Calcula su masa.', 'Esa masa sale del vaso.']
  })
]

export const RENG_PRACTICAS_B06_S05: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s5-p1', titulo: 'Mayor coeficiente', unidad: '', tolerancia: RENG_TOL_RQ_ENT,
    objetivo: 'Ajustar por tanteo e identificar el mayor coeficiente de la ecuación.', seccion: '4.1', para: 'el ajuste por tanteo',
    idealizado: 'Coeficientes enteros mínimos.', metodo: 'módulo de ajuste del núcleo', lista: RENG_AJUSTE_RQ,
    respuesta: (r) => Math.max(...r.nu),
    errores: (r) => [
      ['suma', 'Suma de coeficientes', rengSumaNu(r), 'Sumaste los coeficientes; la pregunta pide el mayor de ellos.'],
      ['especies', 'Número de fórmulas', r.esp.length, 'Contaste las fórmulas; hay que ajustar y mirar los coeficientes.']
    ],
    enunciado: (r) => `Ajusta por tanteo ${rengSinAjustarRx(r)}.`, pregunta: '¿Cuál es el mayor coeficiente de la ecuación ajustada mínima?',
    datos: (r) => [['Esquema', rengSinAjustarRx(r)], ['Fórmulas', String(r.esp.length)]],
    pasos: (r, _x, _y, rengR) => [`Ajustada: ${rengTxtRx(r)}.`, `Mayor coeficiente: ${tx(rengR)}.`],
    pistas: ['Empieza por el elemento menos repetido.', 'Deja H y O para el final.', 'Elimina fracciones.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s5-p2', titulo: 'Coeficiente del primer producto', unidad: '', tolerancia: RENG_TOL_RQ_ENT,
    objetivo: 'Ajustar por tanteo y leer el coeficiente de un producto concreto.', seccion: '4.1', para: 'el ajuste por tanteo',
    idealizado: 'Coeficientes enteros mínimos.', metodo: 'módulo de ajuste del núcleo', lista: RENG_AJUSTE_RQ,
    valida: (r) => r.nu[r.nr]! > 1,
    respuesta: (r) => r.nu[r.nr]!,
    errores: (r) => [
      ['sin-ajustar', 'Sin ajustar', 1, 'Dejaste el coeficiente en 1: la ecuación no estaría ajustada.'],
      ['suma', 'Suma de coeficientes', rengSumaNu(r), 'Esa es la suma de todos los coeficientes, no el del producto.']
    ],
    enunciado: (r) => `Ajusta por tanteo ${rengSinAjustarRx(r)}.`, pregunta: (r) => `¿Qué coeficiente lleva el ${T(r.esp[r.nr]!)}?`,
    datos: (r) => [['Esquema', rengSinAjustarRx(r)], ['Producto', T(r.esp[r.nr]!)]],
    pasos: (r, _x, _y, rengR) => [`Ajustada: ${rengTxtRx(r)}.`, `Coeficiente: ${tx(rengR)}.`],
    pistas: ['Cuenta los átomos a cada lado.', 'Ajusta elemento a elemento.', 'Comprueba al final.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s5-p3', titulo: 'Segundo reactivo en masa', unidad: 'g',
    objetivo: 'Ajustar por tanteo y calcular la masa del segundo reactivo que se necesita.', seccion: '4.3', para: 'el ajuste por tanteo',
    idealizado: 'Reactivos en proporción exacta.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_AJUSTE_DOS, x: [1, 100, 0.5],
    valida: (r) => r.nu[0] !== r.nu[1],
    respuesta: (r, x) => rengMasaDesde(r, 0, x, 1),
    errores: (r, x) => [
      ['sin-coef', 'Proporción 1:1', (x / M(r.esp[0]!)) * M(r.esp[1]!), 'Usaste una proporción 1:1; ajusta la ecuación primero.'],
      ['invertida', 'Coeficientes invertidos', (x / M(r.esp[0]!)) * (r.nu[0]! / r.nu[1]!) * M(r.esp[1]!), 'Invertiste la proporción entre los reactivos.']
    ],
    enunciado: (r, x) => `Según el esquema ${rengSinAjustarRx(r)}, reaccionan ${tx(x)} g de ${T(r.esp[0]!)}.`, pregunta: (r) => `¿Qué masa de ${T(r.esp[1]!)} se necesita, en g?`,
    datos: (r, x) => [['Esquema', rengSinAjustarRx(r)], [T(r.esp[0]!), `${tx(x)} g`]],
    pasos: (r, _x, _y, rengR) => [`Ajustada: ${rengTxtRx(r)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Ajusta la ecuación.', 'Relaciona los dos reactivos.', 'Pasa a gramos.']
  })
]

export const RENG_PRACTICAS_B06_S06: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s6-p1', titulo: 'Coeficiente del oxígeno', unidad: '', tolerancia: RENG_TOL_RQ_ENT,
    objetivo: 'Plantear el sistema de ecuaciones de una combustión y obtener el coeficiente entero mínimo del O₂.', seccion: '4.1', para: 'el ajuste algebraico',
    idealizado: 'Combustión completa.', metodo: 'módulo de ajuste del núcleo', lista: RENG_COMBUSTIBLES_RQ.map((_rengC, rengI) => rengI),
    respuesta: (i) => comb(i).b,
    errores: (i) => [
      ['atomos-o', 'Átomos de oxígeno', 2 * comb(i).b, 'Contaste átomos de O; el coeficiente es de moléculas de O₂.'],
      ['solo-co2', 'Coeficiente del CO₂', comb(i).c, 'Ese es el coeficiente del CO₂; el del O₂ sale de la ecuación del oxígeno.']
    ],
    enunciado: (i) => `Ajusta algebraicamente la combustión completa del ${RENG_COMBUSTIBLES_RQ[i]!.n}: a ${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))} + b O₂ → c CO₂ + d H₂O.`, pregunta: '¿Cuánto vale b en la ecuación ajustada mínima?',
    datos: (i) => [['Combustible', T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))], ['Productos', 'CO₂ y H₂O']],
    pasos: (i, _x, _y, rengR) => { const c = comb(i); return [`C: c = x·a; H: 2d = y·a; O: z·a + 2b = 2c + d.`, `Enteros mínimos: a = ${c.a}, b = ${tx(rengR)}, c = ${c.c}, d = ${c.d}.`] },
    pistas: ['Una ecuación por elemento.', 'Fija a y resuelve.', 'Pasa a enteros mínimos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s6-p2', titulo: 'Suma de coeficientes de una combustión', unidad: '', tolerancia: RENG_TOL_RQ_ENT,
    objetivo: 'Resolver el sistema de una combustión y sumar los coeficientes enteros mínimos.', seccion: '4.1', para: 'el ajuste algebraico',
    idealizado: 'Combustión completa.', metodo: 'módulo de ajuste del núcleo', lista: RENG_COMBUSTIBLES_RQ.map((_rengC, rengI) => rengI),
    respuesta: (i) => { const c = comb(i); return c.a + c.b + c.c + c.d },
    errores: (i) => { const c = comb(i); return [
      ['sin-o2', 'Sin el oxígeno', c.a + c.c + c.d, 'Olvidaste sumar el coeficiente del O₂.'],
      ['sin-agua', 'Sin el agua', c.a + c.b + c.c, 'Olvidaste sumar el coeficiente del agua.']
    ] },
    enunciado: (i) => `Ajusta la combustión completa del ${RENG_COMBUSTIBLES_RQ[i]!.n} (${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))}) por el método algebraico.`, pregunta: '¿Cuánto suman los cuatro coeficientes enteros mínimos?',
    datos: (i) => [['Combustible', T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))], ['Productos', 'CO₂ y H₂O']],
    pasos: (i, _x, _y, rengR) => { const c = comb(i); return [`a = ${c.a}, b = ${c.b}, c = ${c.c}, d = ${c.d}.`, `Suma = ${tx(rengR)}.`] },
    pistas: ['Plantea C, H y O.', 'Resuelve y elimina fracciones.', 'Suma los cuatro.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s6-p3', titulo: 'Oxígeno por mol de combustible', unidad: 'mol',
    objetivo: 'Usar la solución del sistema para dar los moles de O₂ por mol de combustible, aunque no sean enteros.', seccion: '4.1', para: 'el ajuste algebraico',
    idealizado: 'Combustión completa.', metodo: 'módulo de ajuste del núcleo', lista: RENG_COMBUSTIBLES_RQ.map((_rengC, rengI) => rengI),
    respuesta: (i) => comb(i).b / comb(i).a,
    errores: (i) => { const f = RENG_COMBUSTIBLES_RQ[i]!; return [
      ['atomos', 'Átomos de O', (2 * comb(i).b) / comb(i).a, 'Diste átomos de oxígeno; cada O₂ tiene dos.'],
      ['h-sin-dividir', 'Hidrógeno sin dividir', f.x + f.y / 2 - f.z / 2, 'Cada H₂O lleva un solo oxígeno por dos hidrógenos: el H aporta y/4 moles de O₂, no y/2.']
    ] },
    enunciado: (i) => `Se quema por completo 1 mol de ${RENG_COMBUSTIBLES_RQ[i]!.n} (${T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))}).`, pregunta: '¿Cuántos moles de O₂ consume?',
    datos: (i) => [['Combustible', T(rengFCombRq(RENG_COMBUSTIBLES_RQ[i]!))], ['Cantidad', '1 mol']],
    pasos: (i, _x, _y, rengR) => { const f = RENG_COMBUSTIBLES_RQ[i]!; return [`b/a = x + y/4 − z/2 = ${f.x} + ${f.y}/4 − ${f.z}/2.`, `= ${tx(rengR)} mol de O₂.`] },
    pistas: ['Cuenta el O que piden CO₂ y H₂O.', 'Resta el O del combustible.', 'Divide entre 2 para pasar a O₂.']
  })
]

export const RENG_PRACTICAS_B06_S07: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s7-p1', titulo: 'Proporción reductor/oxidante', unidad: 'mol',
    objetivo: 'Ajustar una redox por ion-electrón y obtener los moles de reductor por mol de oxidante.', seccion: '17.1', para: 'el ajuste redox',
    idealizado: 'Medio indicado ideal.', metodo: 'método del ion-electrón del núcleo', lista: RENG_REDOX_RQ,
    respuesta: (r) => r.nRed / r.nOx,
    errores: (r) => [
      ['invertida', 'Proporción invertida', r.nOx / r.nRed, 'Invertiste la proporción: el reductor cede menos electrones por fórmula y hacen falta más.'],
      ['uno', 'Uno a uno', 1, 'No reaccionan mol a mol: hay que igualar los electrones ganados y perdidos.']
    ],
    enunciado: (r) => `Ajusta por ion-electrón, en medio ${r.medio === 'acido' ? 'ácido' : 'básico'}: ${r.texto}.`, pregunta: '¿Cuántos moles de reductor reaccionan por cada mol de oxidante?',
    datos: (r) => [['Reacción', r.texto], ['Medio', r.medio === 'acido' ? 'ácido' : 'básico']],
    pasos: (r, _x, _y, rengR) => [`El oxidante gana ${r.eOx} e⁻ por fórmula y el reductor cede ${r.eRed}.`, `Reductor/oxidante = ${tx(rengR)}.`],
    pistas: ['Calcula los electrones de cada semirreacción.', 'Iguala electrones.', 'Divide los coeficientes.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s7-p2', titulo: 'Electrones transferidos', unidad: '', tolerancia: RENG_TOL_RQ_ENT,
    objetivo: 'Calcular los electrones transferidos en una ecuación redox ajustada con coeficientes mínimos.', seccion: '17.1', para: 'el ajuste redox',
    idealizado: 'Medio indicado ideal.', metodo: 'método del ion-electrón del núcleo', lista: RENG_REDOX_RQ,
    respuesta: (r) => rengETotalRq(r),
    errores: (r) => [
      ['suma', 'Suma de electrones', r.eOx + r.eRed, 'Sumaste los electrones de las dos semirreacciones; hay que igualarlos con el mínimo común múltiplo.'],
      ['reductor', 'Electrones de un reductor', r.eRed, 'Ese es el número de electrones de una sola fórmula de reductor.']
    ],
    enunciado: (r) => `En medio ${r.medio === 'acido' ? 'ácido' : 'básico'}: ${r.texto}.`, pregunta: '¿Cuántos electrones se transfieren en la ecuación ajustada mínima?',
    datos: (r) => [['Reacción', r.texto], ['Medio', r.medio === 'acido' ? 'ácido' : 'básico']],
    pasos: (r, _x, _y, rengR) => [`${r.nOx} oxidante × ${r.eOx} e⁻ = ${r.nRed} reductor × ${r.eRed} e⁻.`, `Electrones: ${tx(rengR)}.`],
    pistas: ['Electrones por semirreacción.', 'Mínimo común múltiplo.', 'Multiplica.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s7-p3', titulo: 'Sal oxidante necesaria', unidad: 'g',
    objetivo: 'Calcular la masa de la sal que aporta el oxidante para reaccionar con una cantidad de reductor.', seccion: '17.1', para: 'el ajuste redox',
    idealizado: 'Reacción completa; la sal aporta un ion oxidante por fórmula.', metodo: 'coeficientes del ion-electrón y masas del núcleo', lista: RENG_REDOX_RQ, x: [0.001, 0.2, 0.001],
    respuesta: (r, x) => ((x * r.nOx) / r.nRed) * M(RENG_SAL_OXIDANTE_RQ[r.ox]!),
    errores: (r, x) => [
      ['invertida', 'Proporción invertida', ((x * r.nRed) / r.nOx) * M(RENG_SAL_OXIDANTE_RQ[r.ox]!), 'Invertiste la proporción entre oxidante y reductor.'],
      ['sin-coef', 'Uno a uno', x * M(RENG_SAL_OXIDANTE_RQ[r.ox]!), 'No reaccionan mol a mol: iguala los electrones.']
    ],
    enunciado: (r, x) => `${r.texto} (medio ${r.medio === 'acido' ? 'ácido' : 'básico'}). El oxidante se añade como ${T(RENG_SAL_OXIDANTE_RQ[r.ox]!)} y hay ${tx(x)} mol de reductor.`, pregunta: (r) => `¿Qué masa de ${T(RENG_SAL_OXIDANTE_RQ[r.ox]!)} se necesita, en g?`,
    datos: (r, x) => [['Reductor', `${tx(x)} mol`], ['Sal', T(RENG_SAL_OXIDANTE_RQ[r.ox]!)]],
    pasos: (r, x, _y, rengR) => [`n(oxidante) = ${tx(x)} × ${r.nOx}/${r.nRed}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Ajusta la redox.', 'Relaciona oxidante y reductor.', 'Usa la masa de la sal.']
  })
]
