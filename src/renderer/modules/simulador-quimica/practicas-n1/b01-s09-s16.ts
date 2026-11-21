import { rengTx } from '../aprender/n1/gases/constantes'
import {
  RENG_BINARIOS_FU, RENG_C_AGUA_FU, RENG_CARBONATOS_FU, RENG_FLOTANTES_FU, RENG_LIQUIDOS_FU, RENG_LV_FU, RENG_NA_FU, RENG_OXIDOS_FU, RENG_R_FU, RENG_SUSTANCIAS_FU,
  rengPracticaFu
} from './b01-comun'
import { RENG_HIDRATOS_NO, rengAnNo, rengDeNo, rengFHidratoNo, rengMNo, rengTotalNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const M = rengMNo
const A = rengAnNo
const r2 = (rengX: number): number => Math.round(rengX * 100) / 100
const mOxido = (rengI: number, rengX: number): number => { const o = RENG_OXIDOS_FU[rengI]!; return (rengX / A(o.metal) / o.nm) * M(o.oxido) }
export const RENG_PUROS_FU = RENG_SUSTANCIAS_FU.filter(([, f]) => !['H2O', 'H2O2'].includes(f))

export const RENG_PRACTICAS_B01_S09: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s9-p1', titulo: 'Calentar y hervir agua', unidad: 'kJ',
    objetivo: 'Calcular la energía de un proceso físico con dos etapas: calentar el agua hasta 100 °C y evaporarla.', seccion: '1.3', para: 'los cambios físicos',
    idealizado: 'Sin pérdidas de calor.', metodo: 'suma de etapas con el catálogo de unidades', lista: [0], x: [10, 500, 5], y: [5, 90, 1],
    respuesta: (_e, x, y) => (x * RENG_C_AGUA_FU * (100 - y) + x * RENG_LV_FU) / 1000,
    errores: (_e, x, y) => [
      ['sin-calentar', 'Solo la evaporación', (x * RENG_LV_FU) / 1000, 'Falta el calor para llevar el agua hasta 100 °C.'],
      ['sin-evaporar', 'Solo el calentamiento', (x * RENG_C_AGUA_FU * (100 - y)) / 1000, 'Falta el calor de vaporización a 100 °C.']
    ],
    enunciado: (_e, x, y) => `Se calientan ${tx(x)} g de agua desde ${tx(y)} °C hasta 100 °C y se evaporan por completo (c = 4,184 J/(g·K); L_v = 2260 J/g).`, pregunta: '¿Cuánta energía hace falta en total, en kJ?',
    datos: (_e, x, y) => [['Agua', `${tx(x)} g a ${tx(y)} °C`], ['Datos', 'c = 4,184 J/(g·K); L_v = 2260 J/g']],
    pasos: (_e, x, y, rengR) => [`Calentar: ${tx((x * RENG_C_AGUA_FU * (100 - y)) / 1000)} kJ; evaporar: ${tx((x * RENG_LV_FU) / 1000)} kJ.`, `Total: ${tx(rengR)} kJ.`],
    pistas: ['Calcula cada etapa.', 'Pasa cada una a kJ.', 'Suma las dos etapas.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s9-p2', titulo: 'Gas de una descomposición', unidad: 'g',
    objetivo: 'Cuantificar un cambio químico: masa de CO₂ que desprende la descomposición de un carbonato.', seccion: '1.3', para: 'los cambios químicos', masas: true,
    idealizado: 'Descomposición completa.', metodo: 'conservación de la masa con masas del núcleo', sinVerificar: [], lista: RENG_CARBONATOS_FU, x: [1, 100, 0.5],
    respuesta: (c, x) => (x / M(c.f)) * M('CO2'),
    errores: (c, x) => [
      ['masa-igual', 'Toda la masa', x, 'No todo el carbonato se convierte en gas: queda un óxido sólido.'],
      ['residuo', 'Masa del óxido', (x / M(c.f)) * M(c.oxido), 'Esa es la masa del óxido que queda, no la del CO₂.']
    ],
    enunciado: (c, x) => `Se calientan ${tx(x)} g de ${c.n} hasta descomponerlo: ${T(c.f)} → ${T(c.oxido)} + CO₂.`, pregunta: '¿Qué masa de CO₂ se desprende, en g?',
    datos: (c, x) => [['Carbonato', `${tx(x)} g de ${T(c.f)}`], [`M(${T(c.f)})`, `${tx(M(c.f), 5)} g/mol`]],
    pasos: (_c, _x, _y, rengR) => ['Se forman sustancias nuevas: es un cambio químico. Un CO₂ por fórmula.', `m(CO₂) = ${tx(rengR)} g.`],
    pistas: ['Pasa el carbonato a moles.', 'Un CO₂ por fórmula.', 'Pasa a gramos.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s9-p3', titulo: 'Deshidratar un hidrato', unidad: 'g',
    objetivo: 'Calcular la masa que queda al deshidratar por calentamiento una sal hidratada.', seccion: '1.3', para: 'los cambios químicos', masas: true,
    idealizado: 'Pérdida completa del agua.', metodo: 'masa molar del hidrato del núcleo', sinVerificar: [], lista: RENG_HIDRATOS_NO, x: [1, 100, 0.5],
    respuesta: (h, x) => (x * M(h.sal)) / M(rengFHidratoNo(h)),
    errores: (h, x) => [
      ['agua', 'Masa de agua', (x * h.agua * M('H2O')) / M(rengFHidratoNo(h)), 'Esa es la masa del agua que se pierde, no la de lo que queda.'],
      ['sin-cambio', 'Misma masa', x, 'Al calentar se pierde el agua: la masa disminuye.']
    ],
    enunciado: (h, x) => `Se calientan ${tx(x)} g de ${h.n} hasta eliminar toda el agua.`, pregunta: '¿Qué masa de sal anhidra queda, en g?',
    datos: (h, x) => [['Hidrato', `${tx(x)} g de ${T(rengFHidratoNo(h))}`], [`M(${T(rengFHidratoNo(h))})`, `${tx(M(rengFHidratoNo(h)), 5)} g/mol`]],
    pasos: (h, _x, _y, rengR) => [`Fracción de sal anhidra: ${tx(M(h.sal) / M(rengFHidratoNo(h)), 4)}.`, `Queda ${tx(rengR)} g.`],
    pistas: ['Calcula la masa del hidrato.', 'Calcula la fracción de sal.', 'Multiplica.']
  })
]

export const RENG_PRACTICAS_B01_S10: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s10-p1', titulo: 'Pureza de una muestra', unidad: '%',
    objetivo: 'Calcular la pureza de una muestra a partir de la masa de sustancia pura que contiene.', seccion: '1.2', para: 'las sustancias puras',
    idealizado: 'Análisis exacto.', metodo: '100 % menos el porcentaje de impurezas', lista: [0], x: [10, 200, 0.5], y: [70, 99.5, 0.1],
    respuesta: (_e, x, y) => (100 * r2((x * y) / 100)) / x,
    errores: (_e, x, y) => [
      ['impureza', 'Porcentaje de impurezas', 100 - (100 * r2((x * y) / 100)) / x, 'Ese es el porcentaje de impurezas, no la pureza.'],
      ['invertida', 'Cociente invertido', (100 * x) / r2((x * y) / 100), 'Dividiste al revés: la masa pura va en el numerador.']
    ],
    valida: (_e, _x, y) => Math.abs(y - 50) > 5,
    enunciado: (_e, x, y) => `Una muestra de ${tx(x)} g contiene ${tx(r2((x * y) / 100), 5)} g de sustancia pura.`, pregunta: '¿Cuál es su pureza, en %?',
    datos: (_e, x, y) => [['Muestra', `${tx(x)} g`], ['Sustancia pura', `${tx(r2((x * y) / 100), 5)} g`]],
    pasos: (_e, _x, _y, rengR) => ['Pureza = m(pura)/m(muestra) × 100.', `= ${tx(rengR)} %.`],
    pistas: ['Divide la masa pura.', 'Entre la masa total.', 'Multiplica por 100.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s10-p2', titulo: 'Impurezas de una muestra', unidad: 'g',
    objetivo: 'Calcular la masa de impurezas de una muestra de pureza conocida.', seccion: '1.2', para: 'las sustancias puras',
    idealizado: 'Pureza exacta.', metodo: 'masa total menos masa pura', lista: [0], x: [10, 500, 0.5], y: [70, 99.5, 0.1],
    valida: (_e, _x, y) => Math.abs(y - 50) > 5,
    respuesta: (_e, x, y) => x * (1 - y / 100),
    errores: (_e, x, y) => [
      ['pura', 'Masa pura', (x * y) / 100, 'Esa es la masa de sustancia pura; la pregunta pide las impurezas.'],
      ['porcentaje', 'Porcentaje', 100 - y, 'Diste un porcentaje; hay que pasarlo a gramos con la masa de la muestra.']
    ],
    enunciado: (_e, x, y) => `Una muestra de ${tx(x)} g tiene una pureza del ${tx(y)} %.`, pregunta: '¿Qué masa de impurezas contiene, en g?',
    datos: (_e, x, y) => [['Muestra', `${tx(x)} g`], ['Pureza', `${tx(y)} %`]],
    pasos: (_e, _x, y, rengR) => [`Impurezas: ${tx(100 - y)} %.`, `m = ${tx(rengR)} g.`],
    pistas: ['Calcula el porcentaje de impurezas.', 'Aplícalo a la muestra.', 'Comprueba sumando.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s10-p3', titulo: 'Moles en una muestra impura', unidad: 'mol',
    objetivo: 'Calcular los moles de sustancia pura en una muestra de pureza conocida.', seccion: '1.2', para: 'las sustancias puras', masas: true,
    idealizado: 'Impurezas inertes.', metodo: 'masa molar del núcleo', sinVerificar: [], lista: RENG_PUROS_FU, x: [5, 300, 0.5], y: [70, 99.5, 0.1],
    valida: (_s, _x, y) => y < 98.5,
    respuesta: ([, f], x, y) => (x * y) / 100 / M(f),
    errores: ([, f], x, y) => [
      ['sin-pureza', 'Sin la pureza', x / M(f), 'Usaste la masa total; solo la parte pura cuenta.'],
      ['impureza', 'Con las impurezas', (x * (1 - y / 100)) / M(f), 'Calculaste con la masa de impurezas, no con la de sustancia pura.']
    ],
    enunciado: ([n, f], x, y) => `Una muestra de ${tx(x)} g de ${n} (${T(f)}) tiene una pureza del ${tx(y)} %.`, pregunta: '¿Cuántos moles de sustancia pura contiene?',
    datos: ([, f], x, y) => [['Muestra', `${tx(x)} g`], ['Pureza', `${tx(y)} %`], [`M(${T(f)})`, `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f], x, y, rengR) => [`Masa pura = ${tx((x * y) / 100)} g.`, `n = ${tx(rengR)} mol (M = ${tx(M(f), 5)}).`],
    pistas: ['Calcula la masa pura.', 'Divide entre la masa molar.', 'Ignora las impurezas.']
  })
]

export const RENG_PRACTICAS_B01_S11: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s11-p1', titulo: 'Proporción fija de un compuesto', unidad: 'g',
    objetivo: 'Usar la proporción fija de un compuesto binario para calcular la masa de un elemento a partir de la del otro.', seccion: '1.2', para: 'los elementos y los compuestos', masas: true,
    idealizado: 'Compuesto puro.', metodo: 'masas del núcleo', sinVerificar: [], lista: RENG_BINARIOS_FU, x: [0.5, 50, 0.5],
    respuesta: (b, x) => (x * rengDeNo(b.f, b.b) * A(b.b)) / (rengDeNo(b.f, b.a) * A(b.a)),
    errores: (b, x) => [
      ['invertida', 'Proporción invertida', (x * rengDeNo(b.f, b.a) * A(b.a)) / (rengDeNo(b.f, b.b) * A(b.b)), 'Invertiste la proporción entre los dos elementos.'],
      ['sin-subindices', 'Sin los subíndices', (x * A(b.b)) / A(b.a), 'Olvidaste los subíndices de la fórmula: indican cuántos átomos hay de cada elemento.']
    ],
    enunciado: (b, x) => `Una muestra de ${b.n} (${T(b.f)}) contiene ${tx(x)} g de ${b.a}.`, pregunta: (b) => `¿Qué masa de ${b.b} contiene, en g?`,
    datos: (b, x) => [['Compuesto', T(b.f)], [b.a, `${tx(x)} g`]],
    pasos: (b, _x, _y, rengR) => [`Proporción ${b.b}/${b.a} = ${tx((rengDeNo(b.f, b.b) * A(b.b)) / (rengDeNo(b.f, b.a) * A(b.a)), 4)}.`, `m(${b.b}) = ${tx(rengR)} g.`],
    pistas: ['Calcula la proporción en masa.', 'Usa los subíndices.', 'Multiplica.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s11-p2', titulo: 'Átomos en una cantidad de compuesto', unidad: '',
    objetivo: 'Contar los átomos totales de una cantidad de compuesto con la constante de Avogadro.', seccion: '1.2', para: 'los elementos y los compuestos',
    idealizado: 'Compuesto puro.', metodo: 'recuento de átomos con el núcleo', lista: RENG_SUSTANCIAS_FU, x: [0.05, 5, 0.05],
    respuesta: ([, f], x) => (x * RENG_NA_FU * rengTotalNo(f)) / 1e23,
    errores: ([, f], x) => [
      ['moleculas', 'Moléculas, no átomos', (x * RENG_NA_FU) / 1e23, 'Contaste moléculas; cada una tiene varios átomos.'],
      ['sin-NA', 'Sin la constante de Avogadro', x * rengTotalNo(f), 'Falta multiplicar por la constante de Avogadro.']
    ],
    enunciado: ([n, f], x) => `Se tienen ${tx(x)} mol de ${n} (${T(f)}); N_A = 6,022·10²³ mol⁻¹.`, pregunta: '¿Cuántos átomos hay en total, en múltiplos de 10²³?',
    datos: ([, f], x) => [['Cantidad', `${tx(x)} mol`], ['Átomos por fórmula', String(rengTotalNo(f))]],
    pasos: ([, f], x, _y, rengR) => [`N = ${tx(x)} × 6,022·10²³ × ${rengTotalNo(f)}.`, `N = ${tx(rengR)}·10²³ átomos.`],
    pistas: ['Cuenta los átomos de la fórmula.', 'Multiplica por N_A.', 'Expresa en múltiplos de 10²³.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s11-p3', titulo: 'Moles de átomos de un elemento', unidad: 'mol',
    objetivo: 'Calcular los moles de átomos de un elemento contenidos en una masa de compuesto.', seccion: '1.2', para: 'los elementos y los compuestos', masas: true,
    idealizado: 'Compuesto puro.', metodo: 'masa molar del núcleo', sinVerificar: [], lista: RENG_SUSTANCIAS_FU, x: [1, 200, 0.5],
    valida: ([, f, el]) => rengDeNo(f, el) > 1,
    respuesta: ([, f, el], x) => (x / M(f)) * rengDeNo(f, el),
    errores: ([, f, el], x) => [
      ['sin-subindice', 'Moles de compuesto', x / M(f), `Esos son los moles de compuesto; cada fórmula tiene ${rengDeNo(f, el)} átomos de ${el}.`],
      ['masa-atomica', 'Con la masa atómica', x / A(el), 'Dividiste la masa del compuesto entre la masa atómica del elemento.']
    ],
    enunciado: ([n, f], x) => `Se tienen ${tx(x)} g de ${n} (${T(f)}).`, pregunta: ([, , el]) => `¿Cuántos moles de átomos de ${el} contienen?`,
    datos: ([, f], x) => [['Masa', `${tx(x)} g`], [`M(${T(f)})`, `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f, el], x, _y, rengR) => [`n(compuesto) = ${tx(x / M(f))} mol.`, `n(${el}) = × ${rengDeNo(f, el)} = ${tx(rengR)} mol.`],
    pistas: ['Pasa a moles de compuesto.', 'Multiplica por el subíndice.', 'Comprueba las unidades.']
  })
]

export const RENG_PRACTICAS_B01_S12: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s12-p1', titulo: 'Porcentaje en masa de una mezcla', unidad: '%',
    objetivo: 'Calcular el porcentaje en masa de un componente de una mezcla.', seccion: '1.2', para: 'las mezclas',
    idealizado: 'Componentes que no reaccionan.', metodo: '100 % menos el porcentaje del disolvente', lista: [0], x: [1, 100, 0.5], y: [50, 1000, 5],
    respuesta: (_e, x, y) => (100 * x) / (x + y),
    errores: (_e, x, y) => [
      ['sobre-disolvente', 'Dividido entre el disolvente', (100 * x) / y, 'El porcentaje se calcula sobre la masa total de la mezcla.'],
      ['disolvente', 'Porcentaje del otro componente', (100 * y) / (x + y), 'Ese es el porcentaje del agua, no el del soluto.']
    ],
    enunciado: (_e, x, y) => `Se disuelven ${tx(x)} g de azúcar en ${tx(y)} g de agua.`, pregunta: '¿Qué porcentaje en masa de azúcar tiene la mezcla?',
    datos: (_e, x, y) => [['Azúcar', `${tx(x)} g`], ['Agua', `${tx(y)} g`]],
    pasos: (_e, x, y, rengR) => [`Masa total = ${tx(x + y)} g.`, `% = ${tx(rengR)} %.`],
    pistas: ['Suma las masas.', 'Divide la del azúcar.', 'Multiplica por 100.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s12-p2', titulo: 'Preparar una mezcla', unidad: 'g',
    objetivo: 'Calcular la masa de componente necesaria para preparar una mezcla de composición dada.', seccion: '1.2', para: 'las mezclas',
    idealizado: 'Pesadas exactas.', metodo: 'búsqueda por bisección de la masa que da el porcentaje', lista: [0], x: [50, 2000, 10], y: [1, 40, 0.5],
    respuesta: (_e, x, y) => (x * y) / 100,
    errores: (_e, x, y) => [
      ['disolvente', 'Masa del otro componente', x * (1 - y / 100), 'Esa es la masa de agua; la pregunta pide la de sal.'],
      ['sobre-disolvente', 'Porcentaje aplicado al agua', (y * x) / (100 + y), 'El porcentaje se aplica a la masa total de la mezcla.']
    ],
    enunciado: (_e, x, y) => `Se quieren preparar ${tx(x)} g de disolución de sal al ${tx(y)} % en masa.`, pregunta: '¿Qué masa de sal hay que pesar, en g?',
    datos: (_e, x, y) => [['Disolución', `${tx(x)} g`], ['%', `${tx(y)} %`]],
    pasos: (_e, x, y, rengR) => [`m(sal) = ${tx(x)} × ${tx(y)}/100.`, `= ${tx(rengR)} g.`],
    pistas: ['Aplica el porcentaje.', 'A la masa total.', 'El resto es agua.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s12-p3', titulo: 'Concentración en g/L', unidad: 'g/L',
    objetivo: 'Expresar la composición de una mezcla homogénea en gramos por litro.', seccion: '1.2', para: 'las mezclas',
    idealizado: 'Volumen final medido.', metodo: 'catálogo de unidades', lista: [0], x: [0.5, 100, 0.5], y: [50, 2000, 10],
    respuesta: (_e, x, y) => x / (y / 1000),
    errores: (_e, x, y) => [
      ['ml', 'Volumen en mL', x / y, 'El volumen está en mL: pásalo a litros.'],
      ['porcentaje', 'Como porcentaje', (100 * x) / y, 'Calculaste un porcentaje; la pregunta pide gramos por litro.']
    ],
    enunciado: (_e, x, y) => `Se disuelven ${tx(x)} g de sal en agua hasta ${tx(y)} mL de disolución.`, pregunta: '¿Cuál es la concentración, en g/L?',
    datos: (_e, x, y) => [['Sal', `${tx(x)} g`], ['Volumen', `${tx(y)} mL`]],
    pasos: (_e, _x, y, rengR) => [`V = ${tx(y / 1000)} L.`, `c = ${tx(rengR)} g/L.`],
    pistas: ['Pasa los mL a L.', 'Divide la masa entre el volumen.', 'Comprueba las unidades.']
  })
]

export const RENG_PRACTICAS_B01_S13: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s13-p1', titulo: 'Sal recuperada por evaporación', unidad: 'g',
    objetivo: 'Calcular la masa de soluto que se recupera al evaporar el disolvente de una disolución.', seccion: '1.2', para: 'la separación de mezclas',
    idealizado: 'Evaporación completa sin pérdidas.', metodo: 'catálogo de unidades', lista: [0], x: [5, 300, 0.5], y: [50, 2000, 10],
    respuesta: (_e, x, y) => (x * y) / 1000,
    errores: (_e, x, y) => [
      ['ml', 'Volumen en mL', x * y, 'La concentración está en g/L: pasa los mL a litros.'],
      ['invertida', 'Volumen entre concentración', y / 1000 / x, 'Dividiste en lugar de multiplicar.']
    ],
    enunciado: (_e, x, y) => `Se evaporan ${tx(y)} mL de una disolución con ${tx(x)} g/L de sales.`, pregunta: '¿Qué masa de sal queda, en g?',
    datos: (_e, x, y) => [['Volumen', `${tx(y)} mL`], ['Concentración', `${tx(x)} g/L`]],
    pasos: (_e, _x, y, rengR) => [`V = ${tx(y / 1000)} L.`, `m = c·V = ${tx(rengR)} g.`],
    pistas: ['Pasa a litros.', 'Multiplica por la concentración.', 'El agua se va como vapor.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s13-p2', titulo: 'Composición por filtración', unidad: '%',
    objetivo: 'Calcular la composición de una mezcla a partir del residuo que queda tras filtrar.', seccion: '1.2', para: 'la separación de mezclas',
    idealizado: 'Separación completa.', metodo: '100 % menos el porcentaje del residuo', lista: [0], x: [10, 200, 0.5], y: [10, 90, 0.5],
    valida: (_e, _x, y) => Math.abs(y - 50) > 5,
    respuesta: (_e, x, y) => (100 * (x - r2((x * y) / 100))) / x,
    errores: (_e, x, y) => [
      ['residuo', 'Porcentaje de arena', (100 * r2((x * y) / 100)) / x, 'Ese es el porcentaje del residuo (arena); la sal pasó disuelta.'],
      ['sobre-residuo', 'Dividido entre el residuo', (100 * (x - r2((x * y) / 100))) / r2((x * y) / 100), 'El porcentaje se calcula sobre la masa total de la mezcla.']
    ],
    enunciado: (_e, x, y) => `Una mezcla de ${tx(x)} g de arena y sal se disuelve en agua y se filtra; la arena seca pesa ${tx(r2((x * y) / 100), 5)} g.`, pregunta: '¿Qué porcentaje de sal tenía la mezcla?',
    datos: (_e, x, y) => [['Mezcla', `${tx(x)} g`], ['Arena', `${tx(r2((x * y) / 100), 5)} g`]],
    pasos: (_e, _x, _y, rengR) => ['Sal = mezcla − arena.', `% sal = ${tx(rengR)} %.`],
    pistas: ['Resta la arena.', 'Divide entre la mezcla.', 'Multiplica por 100.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s13-p3', titulo: 'Rendimiento de una separación', unidad: '%',
    objetivo: 'Calcular el rendimiento de una separación comparando lo recuperado con lo esperado.', seccion: '1.2', para: 'la separación de mezclas',
    idealizado: 'Contenido inicial conocido.', metodo: 'cociente recuperado/esperado', lista: [0], x: [10, 300, 0.5], y: [60, 98, 0.5],
    valida: (_e, _x, y) => Math.abs(y - 50) > 5,
    respuesta: (_e, x, y) => (100 * r2((x * 0.5 * y) / 100)) / (x * 0.5),
    errores: (_e, x, y) => [
      ['perdida', 'Porcentaje perdido', 100 - (100 * r2((x * 0.5 * y) / 100)) / (x * 0.5), 'Ese es el porcentaje que se pierde, no el rendimiento.'],
      ['invertida', 'Cociente invertido', (100 * x * 0.5) / r2((x * 0.5 * y) / 100), 'Dividiste al revés: lo recuperado va en el numerador.']
    ],
    enunciado: (_e, x, y) => `Se evaporan ${tx(x)} mL de una disolución con 500 g/L de azúcar y se recuperan ${tx(r2((x * 0.5 * y) / 100), 5)} g.`, pregunta: '¿Cuál es el rendimiento de la recuperación, en %?',
    datos: (_e, x, y) => [['Esperado', `${tx(x)} mL × 500 g/L`], ['Recuperado', `${tx(r2((x * 0.5 * y) / 100), 5)} g`]],
    pasos: (_e, x, _y, rengR) => [`Esperado = ${tx(x * 0.5)} g.`, `Rendimiento = ${tx(rengR)} %.`],
    pistas: ['Calcula lo esperado.', 'Divide lo recuperado.', 'Multiplica por 100.']
  })
]

export const RENG_PRACTICAS_B01_S14: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s14-p1', titulo: 'Densidad media de dos fases', unidad: 'kg/m³',
    objetivo: 'Calcular la densidad media de un sistema heterogéneo de dos líquidos que no se mezclan.', seccion: '1.2', para: 'los sistemas materiales',
    idealizado: 'Fases que no se mezclan.', metodo: 'escena «densidad» con los totales', lista: RENG_LIQUIDOS_FU.filter((rengL) => ['aceite de oliva', 'hexano', 'cloroformo', 'gasolina'].includes(rengL.n)), x: [20, 500, 5], y: [20, 500, 5],
    valida: (_l, x, y) => Math.abs(x - y) > 0.2 * Math.max(x, y),
    respuesta: (l, x, y) => (1000 * (x + y * l.rho)) / (x + y),
    errores: (l) => [
      ['media-simple', 'Media simple', (1000 * (1 + l.rho)) / 2, 'Promediaste las densidades sin tener en cuenta los volúmenes.'],
      ['suma', 'Suma de densidades', 1000 * (1 + l.rho), 'Las densidades no se suman: usa la masa total y el volumen total.']
    ],
    enunciado: (l, x, y) => `Un recipiente contiene ${tx(x)} mL de agua (1,00 g/mL) y ${tx(y)} mL de ${l.n} (${tx(l.rho, 4)} g/mL), que no se mezclan.`, pregunta: '¿Cuál es la densidad media del sistema, en kg/m³?',
    datos: (l, x, y) => [['Agua', `${tx(x)} mL`], [l.n, `${tx(y)} mL; ${tx(l.rho, 4)} g/mL`]],
    pasos: (l, x, y, rengR) => [`m total = ${tx(x + y * l.rho)} g en ${tx(x + y)} mL.`, `ρ media = ${tx(rengR, 4)} kg/m³.`],
    pistas: ['Calcula cada masa.', 'Suma masas y volúmenes.', 'Divide los dos valores.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s14-p2', titulo: 'Volumen sumergido', unidad: '%',
    objetivo: 'Calcular la fracción sumergida de un sólido que flota en un líquido.', seccion: '1.2', para: 'los sistemas materiales',
    idealizado: 'Sólido macizo en líquido en reposo.', metodo: 'escena «densidad» (volumen sumergido)', lista: RENG_FLOTANTES_FU,
    respuesta: (f) => (100 * f.rho) / f.rhoL,
    errores: (f) => [
      ['invertida', 'Cociente invertido', (100 * f.rhoL) / f.rho, 'Invertiste el cociente: lo sumergido es la densidad del sólido entre la del líquido.'],
      ['emergido', 'Parte que sobresale', 100 - (100 * f.rho) / f.rhoL, 'Esa es la parte que queda fuera del líquido.']
    ],
    valida: (f) => Math.abs((100 * f.rho) / f.rhoL - 50) > 3,
    enunciado: (f) => `Un trozo de ${f.n} (${tx(f.rho, 4)} g/mL) flota en ${f.liq} (${tx(f.rhoL, 4)} g/mL).`, pregunta: '¿Qué porcentaje de su volumen queda sumergido?',
    datos: (f) => [['Sólido', `${tx(f.rho, 4)} g/mL`], ['Líquido', `${tx(f.rhoL, 4)} g/mL`]],
    pasos: (_f, _x, _y, rengR) => ['V_s/V = ρ/ρ_líquido.', `${tx(rengR)} % sumergido.`],
    pistas: ['Compara las densidades.', 'Divide la del sólido entre la del líquido.', 'Multiplica por 100.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s14-p3', titulo: 'Masa de una fase por diferencia', unidad: 'g',
    objetivo: 'Calcular la masa de una fase de un sistema a partir de la masa total y del volumen de la otra fase.', seccion: '1.2', para: 'los sistemas materiales',
    idealizado: 'Fases separadas.', metodo: 'balance de masa', lista: RENG_LIQUIDOS_FU.filter((rengL) => ['aceite de oliva', 'hexano', 'cloroformo', 'gasolina', 'mercurio'].includes(rengL.n)), x: [20, 300, 5], y: [50, 500, 5],
    respuesta: (_l, _x, y) => y,
    errores: (l, x, y) => [
      ['suma', 'Suma de masas', y + 2 * x * l.rho, 'Sumaste la masa de la otra fase; hay que restarla del total.'],
      ['sin-densidad', 'Restando el volumen', y + x * l.rho - x, 'Restaste un volumen a una masa: pasa el volumen a masa con la densidad.']
    ],
    valida: (l) => Math.abs(l.rho - 1) > 0.05,
    enunciado: (l, x, y) => `Un sistema de agua y ${l.n} (${tx(l.rho, 4)} g/mL) pesa ${tx(y + x * l.rho, 5)} g en total; la capa de ${l.n} ocupa ${tx(x)} mL.`, pregunta: '¿Qué masa de agua contiene, en g?',
    datos: (l, x, y) => [['Masa total', `${tx(y + x * l.rho, 5)} g`], [l.n, `${tx(x)} mL; ${tx(l.rho, 4)} g/mL`]],
    pasos: (l, x, _y, rengR) => [`m(${l.n}) = ${tx(x * l.rho)} g.`, `m(agua) = total − ${tx(x * l.rho)} = ${tx(rengR)} g.`],
    pistas: ['Calcula la masa de la otra fase.', 'Réstala del total.', 'Comprueba las unidades.']
  })
]

export const RENG_PRACTICAS_B01_S15: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s15-p1', titulo: 'Óxido que se forma', unidad: 'g',
    objetivo: 'Cuantificar un fenómeno químico: masa de óxido que forma un metal al oxidarse.', seccion: '1.3', para: 'los fenómenos químicos', masas: true,
    idealizado: 'Oxidación completa.', metodo: 'masas del núcleo', sinVerificar: [], lista: RENG_OXIDOS_FU, x: [1, 100, 0.5],
    respuesta: (o, x) => mOxido(RENG_OXIDOS_FU.indexOf(o), x),
    errores: (o, x) => [
      ['masa-igual', 'Misma masa', x, 'El óxido incorpora oxígeno del aire: pesa más que el metal.'],
      ['oxigeno', 'Solo el oxígeno', mOxido(RENG_OXIDOS_FU.indexOf(o), x) - x, 'Esa es la masa de oxígeno combinada; falta sumar la del metal.']
    ],
    enunciado: (o, x) => `Se oxidan por completo ${tx(x)} g de ${o.metal} al aire y se forma ${T(o.oxido)}.`, pregunta: '¿Qué masa de óxido se forma, en g?',
    datos: (o, x) => [['Metal', `${tx(x)} g de ${o.metal}`], ['Óxido', T(o.oxido)]],
    pasos: (o, _x, _y, rengR) => [`${o.nm} átomo(s) de ${o.metal} por fórmula de ${T(o.oxido)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Pasa el metal a moles.', 'Relaciona con el óxido.', 'Pasa a gramos.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s15-p2', titulo: 'El agua se expande al congelarse', unidad: 'mL',
    objetivo: 'Cuantificar un fenómeno físico: el aumento de volumen del agua al congelarse.', seccion: '1.3', para: 'los fenómenos físicos',
    idealizado: 'Densidades 1,00 g/mL (líquido) y 0,917 g/mL (hielo).', metodo: 'escena «densidad»', lista: [0], x: [10, 2000, 5],
    respuesta: (_e, x) => x / 0.917 - x,
    errores: (_e, x) => [
      ['volumen-hielo', 'Volumen del hielo', x / 0.917, 'Ese es el volumen total del hielo; la pregunta pide el aumento.'],
      ['multiplicar', 'Multiplicando por la densidad', x - x * 0.917, 'Multiplicaste por la densidad del hielo; el volumen es masa entre densidad.']
    ],
    enunciado: (_e, x) => `${tx(x)} g de agua líquida (1,00 g/mL) se congelan y forman hielo (0,917 g/mL).`, pregunta: '¿Cuánto aumenta el volumen, en mL?',
    datos: (_e, x) => [['Agua', `${tx(x)} g`], ['ρ hielo', '0,917 g/mL']],
    pasos: (_e, x, _y, rengR) => [`V(líquido) = ${tx(x)} mL; V(hielo) = ${tx(x / 0.917)} mL.`, `ΔV = ${tx(rengR)} mL.`],
    pistas: ['Calcula los dos volúmenes.', 'Usa V = m/ρ.', 'Resta los dos valores.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s15-p3', titulo: 'Volumen de gas de una combustión', unidad: 'L',
    objetivo: 'Calcular el volumen de CO₂ que produce la combustión de una masa de carbono.', seccion: '1.3', para: 'los fenómenos químicos', masas: true,
    idealizado: 'Combustión completa; CO₂ como gas ideal a 298,15 K y 101,325 kPa.', metodo: 'escena «gas-ideal»', sinVerificar: [], lista: [0], x: [0.5, 50, 0.5],
    respuesta: (_e, x) => ((x / A('C')) * RENG_R_FU * 298.15) / 101.325,
    errores: (_e, x) => [
      ['masa', 'Masa de CO₂', (x / A('C')) * M('CO2'), 'Calculaste la masa de CO₂ en gramos; la pregunta pide el volumen.'],
      ['volumen-0', 'Con 0 °C', ((x / A('C')) * RENG_R_FU * 273.15) / 101.325, 'Usaste 0 °C; el enunciado da 25 °C (298,15 K).']
    ],
    enunciado: (_e, x) => `Se queman ${tx(x)} g de carbono: C + O₂ → CO₂. El gas se mide a 25 °C y 101,325 kPa.`, pregunta: '¿Qué volumen de CO₂ se forma, en L?',
    datos: (_e, x) => [['Carbono', `${tx(x)} g`], ['Condiciones', '298,15 K; 101,325 kPa']],
    pasos: (_e, x, _y, rengR) => [`n(CO₂) = n(C) = ${tx(x / A('C'))} mol.`, `V = nRT/P = ${tx(rengR)} L.`],
    pistas: ['Un CO₂ por C.', 'Usa PV = nRT.', 'T en kelvin.']
  })
]

export const RENG_PRACTICAS_B01_S16: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s16-p1', titulo: 'De km/h a m/s', unidad: 'm/s',
    objetivo: 'Convertir una velocidad de km/h a m/s con factores de conversión.', seccion: '1.4', para: 'las magnitudes y unidades',
    idealizado: 'Factores exactos.', metodo: 'catálogo de unidades de la app', lista: [0], x: [5, 300, 1],
    respuesta: (_e, x) => x / 3.6,
    errores: (_e, x) => [
      ['multiplicar', 'Multiplicar por 3,6', x * 3.6, 'Para pasar de km/h a m/s se divide entre 3,6.'],
      ['minutos', 'Horas como minutos', (x * 1000) / 60, 'Una hora tiene 3600 s, no 60.']
    ],
    enunciado: (_e, x) => `Un vehículo circula a ${tx(x)} km/h.`, pregunta: '¿Cuál es su velocidad en m/s?',
    datos: (_e, x) => [['Velocidad', `${tx(x)} km/h`], ['Factores', '1 km = 1000 m; 1 h = 3600 s']],
    pasos: (_e, x, _y, rengR) => [`${tx(x)} × 1000/3600.`, `= ${tx(rengR)} m/s.`],
    pistas: ['Pasa km a m.', 'Pasa h a s.', 'Divide los dos valores.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s16-p2', titulo: 'Caudal en mililitros por segundo', unidad: 'mL',
    objetivo: 'Convertir un caudal de L/min a mL/s encadenando dos factores.', seccion: '1.4', para: 'las magnitudes y unidades',
    idealizado: 'Factores exactos.', metodo: 'catálogo de unidades de la app', lista: [0], x: [0.5, 60, 0.5],
    respuesta: (_e, x) => (x * 1000) / 60,
    errores: (_e, x) => [
      ['sin-ml', 'Sin pasar a mL', x / 60, 'Falta pasar los litros a mililitros.'],
      ['invertido', 'Factores invertidos', (x * 60) / 1000, 'Pusiste los factores al revés.']
    ],
    enunciado: (_e, x) => `Un grifo deja salir ${tx(x)} L/min.`, pregunta: '¿Cuántos mililitros salen cada segundo?',
    datos: (_e, x) => [['Caudal', `${tx(x)} L/min`], ['Factores', '1 L = 1000 mL; 1 min = 60 s']],
    pasos: (_e, x, _y, rengR) => [`${tx(x)} × 1000/60.`, `= ${tx(rengR)} mL cada segundo.`],
    pistas: ['Pasa L a mL.', 'Pasa min a s.', 'Comprueba que se simplifican.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s16-p3', titulo: 'Volumen de un depósito en litros', unidad: 'L',
    objetivo: 'Convertir un volumen de m³ a litros, teniendo en cuenta que el factor de longitud se eleva al cubo.', seccion: '1.4', para: 'las magnitudes derivadas',
    idealizado: 'Factores exactos.', metodo: 'catálogo de unidades de la app', lista: [0], x: [0.01, 5, 0.01],
    respuesta: (_e, x) => x * 1000,
    errores: (_e, x) => [
      ['lineal', 'Factor lineal', x * 10, 'En volúmenes el factor 10 (de m a dm) se eleva al cubo: 1 m³ = 1000 L.'],
      ['millon', 'Factor de un millón', x * 1e6, 'Ese factor pasa de m³ a mL (cm³), no a litros.']
    ],
    enunciado: (_e, x) => `Un depósito tiene ${tx(x)} m³ de capacidad (1 L = 1 dm³).`, pregunta: '¿Cuántos litros caben?',
    datos: (_e, x) => [['Volumen', `${tx(x)} m³`], ['Factor', '1 m = 10 dm']],
    pasos: (_e, x, _y, rengR) => ['1 m³ = (10 dm)³ = 1000 dm³ = 1000 L.', `${tx(x)} m³ = ${tx(rengR)} L.`],
    pistas: ['Eleva el factor al cubo.', 'Un dm³ es un litro.', 'Multiplica.']
  })
]
