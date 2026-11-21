import { rengTx } from '../aprender/n1/gases/constantes'
import {
  RENG_ANALITOS_FU, RENG_COCIENTES_FU, RENG_GASES_FU, RENG_LIQUIDOS_FU, RENG_LIQUIDOS_MOL_FU, RENG_MEDIDAS_FU, RENG_METALES_FU, RENG_NA_FU, RENG_PRODUCTOS_FU, RENG_TOL_FU_ENT,
  rengCientificoFu, rengPracticaFu, type RengMedidaFu
} from './b01-comun'
import { rengMNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const M = rengMNo

export const RENG_MEDIDAS_CERO_FU: readonly RengMedidaFu[] = [
  { t: '0,00450', c: 3, d: 5 }, { t: '0,0350', c: 3, d: 4 }, { t: '0,10', c: 2, d: 2 }, { t: '0,5060', c: 4, d: 4 }, { t: '0,03040', c: 4, d: 5 }, { t: '0,200', c: 3, d: 3 },
  { t: '0,060', c: 2, d: 3 }, { t: '0,0102', c: 3, d: 4 }, { t: '0,7000', c: 4, d: 4 }, { t: '0,00080', c: 2, d: 5 }, { t: '0,4050', c: 4, d: 4 }, { t: '0,0905', c: 3, d: 4 },
  { t: '0,1200', c: 4, d: 4 }, { t: '0,030', c: 2, d: 3 }
]
const rengDigitos = (rengT: string): number => rengT.replace(/[^0-9]/g, '').length
const rengNoNulos = (rengT: string): number => rengT.replace(/[^1-9]/g, '').length
export const RENG_PARES_CIFRAS_FU: ReadonlyArray<readonly [RengMedidaFu, RengMedidaFu]> = RENG_MEDIDAS_FU.flatMap((rengA, rengI) => RENG_MEDIDAS_FU.slice(rengI + 1).filter((rengB) => rengB.c !== rengA.c).map((rengB) => [rengA, rengB] as const))
export const RENG_PARES_DECIMALES_FU: ReadonlyArray<readonly [RengMedidaFu, RengMedidaFu]> = RENG_MEDIDAS_FU.flatMap((rengA, rengI) => RENG_MEDIDAS_FU.slice(rengI + 1).filter((rengB) => rengB.d !== rengA.d && Math.min(rengA.c, rengB.c) !== Math.min(rengA.d, rengB.d)).map((rengB) => [rengA, rengB] as const))
export const RENG_ACIDOS_FU: ReadonlyArray<{ n: string; f: string; c: number; h: number }> = [
  { n: 'ácido clorhídrico', f: 'HCl', c: 12, h: 1 }, { n: 'ácido sulfúrico', f: 'H2SO4', c: 18, h: 2 }, { n: 'ácido nítrico', f: 'HNO3', c: 15.8, h: 1 }, { n: 'ácido acético', f: 'C2H4O2', c: 17.4, h: 1 }, { n: 'ácido fosfórico', f: 'H3PO4', c: 14.8, h: 3 }
]

export const RENG_PRACTICAS_B01_S17: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s17-p1', titulo: 'De miligramos a gramos', unidad: 'g',
    objetivo: 'Usar el prefijo mili (10⁻³) para pasar de miligramos a gramos.', seccion: '1.4', para: 'los prefijos del SI',
    idealizado: 'Factores exactos.', metodo: 'catálogo de unidades de la app', lista: [0], x: [200, 9000, 5],
    respuesta: (_e, x) => x / 1000,
    errores: (_e, x) => [
      ['multiplicar', 'Multiplicar por mil', x * 1000, 'Al pasar a una unidad mayor el número debe disminuir: divide entre 1000.'],
      ['centi', 'Como centi', x / 100, 'Mili es 10⁻³, no 10⁻²: hay que dividir entre 1000.']
    ],
    enunciado: (_e, x) => `Un comprimido contiene ${tx(x)} mg de principio activo.`, pregunta: '¿Cuántos gramos son?',
    datos: (_e, x) => [['Masa', `${tx(x)} mg`], ['Prefijo', 'mili = 10⁻³']],
    pasos: (_e, x, _y, rengR) => [`${tx(x)} mg × 10⁻³ g/mg.`, `= ${tx(rengR)} g.`],
    pistas: ['Mili es 10⁻³.', 'El número disminuye.', 'Divide entre 1000.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s17-p2', titulo: 'Densidad en el SI', unidad: 'kg/m³',
    objetivo: 'Expresar una densidad en kg/m³, convirtiendo masa y volumen a la vez.', seccion: '1.4', para: 'las unidades del SI',
    idealizado: 'Factores exactos.', metodo: 'catálogo de unidades de la app', lista: RENG_METALES_FU,
    respuesta: (m) => m.rho * 1000,
    errores: (m) => [
      ['millon', 'Factor de un millón', m.rho * 1e6, 'Convertiste solo el volumen (cm³ a m³): falta pasar los gramos a kilogramos.'],
      ['dividir', 'Dividir entre mil', m.rho / 1000, 'El factor va al revés: 1 g/cm³ = 1000 kg/m³.']
    ],
    enunciado: (m) => `El ${m.n} tiene una densidad de ${tx(m.rho, 4)} g/cm³.`, pregunta: '¿Cuál es su densidad en kg/m³?',
    datos: (m) => [['Densidad', `${tx(m.rho, 4)} g/cm³`], ['Factores', '1 g = 10⁻³ kg; 1 cm³ = 10⁻⁶ m³']],
    pasos: (_m, _x, _y, rengR) => ['10⁻³/10⁻⁶ = 10³.', `ρ = ${tx(rengR, 4)} kg/m³.`],
    pistas: ['Convierte la masa.', 'Convierte el volumen.', 'Divide los factores.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s17-p3', titulo: 'De microgramos a miligramos', unidad: 'mg',
    objetivo: 'Pasar entre submúltiplos del gramo usando los prefijos micro y mili.', seccion: '1.4', para: 'los prefijos del SI',
    idealizado: 'Factores exactos.', metodo: 'catálogo de unidades de la app', lista: [0], x: [1000, 500000, 100],
    respuesta: (_e, x) => x / 1000,
    errores: (_e, x) => [
      ['a-gramos', 'Hasta gramos', x / 1e6, 'Pasaste hasta gramos; la pregunta pide miligramos.'],
      ['multiplicar', 'Multiplicar por mil', x * 1000, 'De µg a mg el número disminuye: 1 mg = 1000 µg.']
    ],
    enunciado: (_e, x) => `Una muestra de agua contiene ${tx(x)} µg de calcio.`, pregunta: '¿Cuántos miligramos son?',
    datos: (_e, x) => [['Masa', `${tx(x)} µg`], ['Prefijos', 'micro = 10⁻⁶; mili = 10⁻³']],
    pasos: (_e, x, _y, rengR) => [`${tx(x)} µg × (1 mg / 1000 µg).`, `= ${tx(rengR)} mg.`],
    pistas: ['Compara los prefijos.', 'Hay un factor 1000.', 'El número disminuye.']
  })
]

export const RENG_PRACTICAS_B01_S18: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s18-p1', titulo: 'Exponente de un producto', unidad: '', tolerancia: RENG_TOL_FU_ENT,
    objetivo: 'Multiplicar números en notación científica y ajustar la mantisa para dar el exponente correcto.', seccion: '1.6', para: 'la notación científica',
    idealizado: 'Operaciones exactas.', metodo: 'logaritmo decimal del producto', lista: RENG_PRODUCTOS_FU,
    respuesta: (p) => p.m + p.n + (p.a * p.b >= 10 ? 1 : 0),
    errores: (p) => [
      ['sin-ajustar', 'Sin ajustar la mantisa', p.m + p.n, 'La mantisa del producto es mayor que 10: hay que dividirla entre 10 y sumar 1 al exponente.'],
      ['producto', 'Exponentes multiplicados', p.m * p.n, 'Al multiplicar potencias de diez los exponentes se suman, no se multiplican.']
    ],
    enunciado: (p) => `Calcula (${rengCientificoFu(p.a, p.m)}) × (${rengCientificoFu(p.b, p.n)}) y escríbelo en notación científica.`, pregunta: '¿Cuál es el exponente de 10 del resultado?',
    datos: (p) => [['Factor 1', rengCientificoFu(p.a, p.m)], ['Factor 2', rengCientificoFu(p.b, p.n)]],
    pasos: (p, _x, _y, rengR) => [`Mantisas: ${tx(p.a * p.b, 4)}; exponentes: ${p.m} + ${p.n}.`, `Ajustando la mantisa: exponente ${tx(rengR)}.`],
    pistas: ['Multiplica las mantisas.', 'Suma los exponentes.', 'Ajusta si la mantisa pasa de 10.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s18-p2', titulo: 'Exponente de un cociente', unidad: '', tolerancia: RENG_TOL_FU_ENT,
    objetivo: 'Dividir números en notación científica y ajustar la mantisa cuando es menor que 1.', seccion: '1.6', para: 'la notación científica',
    idealizado: 'Operaciones exactas.', metodo: 'logaritmo decimal del cociente', lista: RENG_COCIENTES_FU,
    respuesta: (p) => p.m - p.n - 1,
    errores: (p) => [
      ['sin-ajustar', 'Sin ajustar la mantisa', p.m - p.n, 'La mantisa del cociente es menor que 1: multiplícala por 10 y resta 1 al exponente.'],
      ['suma', 'Exponentes sumados', p.m + p.n, 'Al dividir potencias de diez los exponentes se restan.']
    ],
    enunciado: (p) => `Calcula (${rengCientificoFu(p.a, p.m)}) / (${rengCientificoFu(p.b, p.n)}) y escríbelo en notación científica.`, pregunta: '¿Cuál es el exponente de 10 del resultado?',
    datos: (p) => [['Dividendo', rengCientificoFu(p.a, p.m)], ['Divisor', rengCientificoFu(p.b, p.n)]],
    pasos: (p, _x, _y, rengR) => [`Mantisas: ${tx(p.a / p.b, 4)} (menor que 1); exponentes: ${p.m} − ${p.n}.`, `Ajustando: exponente ${tx(rengR)}.`],
    pistas: ['Divide las mantisas.', 'Resta los exponentes.', 'Ajusta si la mantisa es menor que 1.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s18-p3', titulo: 'Moléculas de un gas', unidad: '',
    objetivo: 'Calcular un número muy grande de partículas y expresarlo en múltiplos de una potencia de diez.', seccion: '1.6', para: 'la notación científica', masas: true,
    idealizado: 'Sustancia pura.', metodo: 'masa molar del núcleo', sinVerificar: [], lista: RENG_GASES_FU, x: [0.1, 50, 0.1],
    respuesta: (g, x) => ((x / M(g.f)) * RENG_NA_FU) / 1e22,
    errores: (g, x) => [
      ['sin-M', 'Sin dividir entre M', (x * RENG_NA_FU) / 1e22, 'Multiplicaste la masa por N_A sin pasarla antes a moles.'],
      ['moles', 'Solo los moles', x / M(g.f), 'Esos son los moles; multiplica por la constante de Avogadro.']
    ],
    enunciado: (g, x) => `Se tienen ${tx(x)} g de ${g.n} (${T(g.f)}); N_A = 6,022·10²³ mol⁻¹.`, pregunta: '¿Cuántas moléculas (o átomos, si es un gas noble) hay, en múltiplos de 10²²?',
    datos: (g, x) => [['Masa', `${tx(x)} g`], [`M(${T(g.f)})`, `${tx(M(g.f), 5)} g/mol`]],
    pasos: (g, x, _y, rengR) => [`n = ${tx(x / M(g.f))} mol.`, `N = n·N_A = ${tx(rengR)}·10²².`],
    pistas: ['Pasa a moles.', 'Multiplica por N_A.', 'Expresa en múltiplos de 10²².']
  })
]

export const RENG_PRACTICAS_B01_S19: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s19-p1', titulo: 'Contar cifras significativas', unidad: '', tolerancia: RENG_TOL_FU_ENT,
    objetivo: 'Contar las cifras significativas de una medida con ceros iniciales y finales.', seccion: '1.5', para: 'las cifras significativas',
    idealizado: 'Medidas escritas con su precisión.', metodo: 'recuento con otro procedimiento', lista: RENG_MEDIDAS_CERO_FU,
    respuesta: (m) => m.c,
    errores: (m) => [
      ['todos', 'Todos los dígitos', rengDigitos(m.t), 'Contaste también los ceros iniciales, que solo sitúan la coma.'],
      ['no-nulos', 'Solo dígitos no nulos', rengNoNulos(m.t), 'Los ceros entre cifras y los ceros finales tras la coma sí son significativos.']
    ],
    enunciado: (m) => `Una balanza da la medida ${m.t} g.`, pregunta: '¿Cuántas cifras significativas tiene?',
    datos: (m) => [['Medida', `${m.t} g`], ['Dígitos escritos', String(rengDigitos(m.t))]],
    pasos: (m, _x, _y, rengR) => ['Los ceros iniciales no cuentan; los intermedios y los finales tras la coma, sí.', `${m.t} tiene ${tx(rengR)} cifras significativas.`],
    pistas: ['Ignora los ceros iniciales.', 'Cuenta los intermedios.', 'Cuenta los finales tras la coma.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s19-p2', titulo: 'Cifras de un producto', unidad: '', tolerancia: RENG_TOL_FU_ENT,
    objetivo: 'Decidir con cuántas cifras significativas se da el resultado de un producto.', seccion: '1.5', para: 'las cifras significativas',
    idealizado: 'Datos con su precisión.', metodo: 'mínimo por comparación sucesiva', lista: RENG_PARES_CIFRAS_FU,
    respuesta: ([a, b]) => Math.min(a.c, b.c),
    errores: ([a, b]) => [
      ['maximo', 'El mayor número de cifras', Math.max(a.c, b.c), 'En productos manda el dato menos preciso: el de menos cifras.'],
      ['suma', 'Suma de cifras', a.c + b.c, 'Las cifras significativas no se suman.']
    ],
    enunciado: ([a, b]) => `Se multiplican dos medidas: ${a.t} y ${b.t}.`, pregunta: '¿Con cuántas cifras significativas debe darse el resultado?',
    datos: ([a, b]) => [['Medida 1', a.t], ['Medida 2', b.t]],
    pasos: ([a, b], _x, _y, rengR) => [`Cifras: ${a.c} y ${b.c}.`, `Resultado con ${tx(rengR)} cifras.`],
    pistas: ['Cuenta las cifras de cada dato.', 'Elige el menor.', 'Redondea el resultado.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s19-p3', titulo: 'Decimales de una suma', unidad: '', tolerancia: RENG_TOL_FU_ENT,
    objetivo: 'Decidir con cuántos decimales se da el resultado de una suma de medidas.', seccion: '1.5', para: 'las cifras significativas',
    idealizado: 'Datos con su precisión.', metodo: 'mínimo por comparación sucesiva', lista: RENG_PARES_DECIMALES_FU,
    respuesta: ([a, b]) => Math.min(a.d, b.d),
    errores: ([a, b]) => [
      ['maximo', 'El mayor número de decimales', Math.max(a.d, b.d), 'En sumas manda el dato con menos decimales.'],
      ['cifras', 'Regla de los productos', Math.min(a.c, b.c), 'Aplicaste la regla de las cifras significativas; en sumas se cuentan decimales.']
    ],
    enunciado: ([a, b]) => `Se suman dos medidas: ${a.t} g + ${b.t} g.`, pregunta: '¿Con cuántos decimales debe darse el resultado?',
    datos: ([a, b]) => [['Medida 1', `${a.t} g`], ['Medida 2', `${b.t} g`]],
    pasos: ([a, b], _x, _y, rengR) => [`Decimales: ${a.d} y ${b.d}.`, `Resultado con ${tx(rengR)} decimales.`],
    pistas: ['Cuenta los decimales de cada dato.', 'Elige el menor.', 'Redondea la suma.']
  })
]

export const RENG_PRACTICAS_B01_S20: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s20-p1', titulo: 'Análisis clínico en mmol/L', unidad: 'mmol/L',
    objetivo: 'Encadenar factores para pasar una concentración clínica de mg/dL a mmol/L.', seccion: '1.6', para: 'el análisis dimensional', masas: true,
    idealizado: 'Sustancia pura disuelta.', metodo: 'catálogo de unidades y masa molar del núcleo', sinVerificar: [], lista: RENG_ANALITOS_FU, x: [10, 500, 1],
    respuesta: (a, x) => (x * 10) / M(a.f),
    errores: (a, x) => [
      ['sin-10', 'Sin pasar dL a L', x / M(a.f), 'Falta el factor 10 dL/L para pasar a litros.'],
      ['mol', 'En mol/L', (x * 10) / M(a.f) / 1000, 'Ese resultado está en mol/L; la pregunta pide mmol/L.']
    ],
    enunciado: (a, x) => `Un análisis da ${tx(x)} mg/dL de ${a.n} (${T(a.f)}).`, pregunta: '¿Cuánto es en mmol/L?',
    datos: (a, x) => [['Concentración', `${tx(x)} mg/dL`], [`M(${T(a.f)})`, `${tx(M(a.f), 5)} g/mol`]],
    pasos: (a, x, _y, rengR) => [`${tx(x)} mg/dL × 10 dL/L = ${tx(x * 10)} mg/L.`, `÷ ${tx(M(a.f), 5)} mg/mmol = ${tx(rengR)} mmol/L.`],
    pistas: ['Pasa dL a L.', 'Divide entre la masa molar.', 'mg/mmol equivale a g/mol.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s20-p2', titulo: 'De g/L a mmol/L', unidad: 'mmol/L',
    objetivo: 'Convertir una concentración en masa a concentración molar con un factor de masa molar.', seccion: '1.6', para: 'el análisis dimensional', masas: true,
    idealizado: 'Sustancia pura disuelta.', metodo: 'masa molar del núcleo', sinVerificar: [], lista: RENG_ANALITOS_FU, x: [0.1, 50, 0.1],
    respuesta: (a, x) => (x / M(a.f)) * 1000,
    errores: (a, x) => [
      ['sin-mil', 'En mol/L', x / M(a.f), 'Ese resultado está en mol/L; multiplica por 1000 para mmol/L.'],
      ['sin-M', 'Sin la masa molar', x * 1000, 'Pasaste g a mg en lugar de dividir entre la masa molar.']
    ],
    enunciado: (a, x) => `Una disolución contiene ${tx(x)} g/L de ${a.n} (${T(a.f)}).`, pregunta: '¿Cuál es su concentración en mmol/L?',
    datos: (a, x) => [['Concentración', `${tx(x)} g/L`], [`M(${T(a.f)})`, `${tx(M(a.f), 5)} g/mol`]],
    pasos: (a, x, _y, rengR) => [`${tx(x)} g/L ÷ ${tx(M(a.f), 5)} g/mol = ${tx(x / M(a.f))} mol/L.`, `= ${tx(rengR)} mmol/L.`],
    pistas: ['Divide entre la masa molar.', 'Obtienes mol/L.', 'Pasa a mmol/L.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s20-p3', titulo: 'Moles a partir de un volumen de líquido', unidad: 'mol',
    objetivo: 'Encadenar volumen, densidad y masa molar para obtener los moles de un líquido.', seccion: '1.6', para: 'el análisis dimensional', masas: true,
    idealizado: 'Líquido puro a 20 °C.', metodo: 'escena «densidad» y masa molar del núcleo', sinVerificar: [], lista: RENG_LIQUIDOS_MOL_FU, x: [1, 500, 1],
    respuesta: (l, x) => (x * l.rho) / M(l.f),
    errores: (l, x) => [
      ['sin-densidad', 'Sin la densidad', x / M(l.f), 'Dividiste el volumen entre la masa molar: pasa antes el volumen a masa con la densidad.'],
      ['dividida', 'Dividiendo por la densidad', x / l.rho / M(l.f), 'La masa es volumen por densidad, no volumen entre densidad.']
    ],
    valida: (l) => Math.abs(l.rho - 1) > 0.05,
    enunciado: (l, x) => `Se miden ${tx(x)} mL de ${l.n} (${T(l.f)}, ${tx(l.rho, 4)} g/mL).`, pregunta: '¿Cuántos moles son?',
    datos: (l, x) => [['Volumen', `${tx(x)} mL`], ['Densidad', `${tx(l.rho, 4)} g/mL`], [`M(${T(l.f)})`, `${tx(M(l.f), 5)} g/mol`]],
    pasos: (l, x, _y, rengR) => [`m = ${tx(x * l.rho)} g.`, `n = m/M = ${tx(rengR)} mol.`],
    pistas: ['Pasa el volumen a masa.', 'Divide entre la masa molar.', 'Comprueba que se simplifican las unidades.']
  })
]

export const RENG_PRACTICAS_B01_S21: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s21-p1', titulo: 'Calcular una densidad', unidad: 'g/mL',
    objetivo: 'Calcular la densidad de un objeto con ρ = m/V.', seccion: '1.4', para: 'la densidad',
    idealizado: 'Objeto homogéneo.', metodo: 'escena «densidad»', lista: [0], x: [1, 1000, 0.5], y: [1, 500, 0.5],
    valida: (_e, x, y) => Math.abs(x / y - y / x) > 0.3,
    respuesta: (_e, x, y) => x / y,
    errores: (_e, x, y) => [
      ['invertida', 'Volumen entre masa', y / x, 'Dividiste el volumen entre la masa; la densidad es masa entre volumen.'],
      ['producto', 'Masa por volumen', x * y, 'Multiplicaste; la densidad es un cociente.']
    ],
    enunciado: (_e, x, y) => `Un objeto tiene una masa de ${tx(x)} g y un volumen de ${tx(y)} mL.`, pregunta: '¿Cuál es su densidad, en g/mL?',
    datos: (_e, x, y) => [['Masa', `${tx(x)} g`], ['Volumen', `${tx(y)} mL`]],
    pasos: (_e, x, y, rengR) => [`ρ = ${tx(x)}/${tx(y)}.`, `ρ = ${tx(rengR)} g/mL.`],
    pistas: ['Divide masa entre volumen.', 'Comprueba las unidades.', 'Compara con el agua.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s21-p2', titulo: 'Volumen a partir de la densidad', unidad: 'mL',
    objetivo: 'Calcular el volumen que ocupa una masa de sustancia de densidad conocida.', seccion: '1.4', para: 'la densidad',
    idealizado: 'Sustancia homogénea.', metodo: 'escena «densidad»', lista: [...RENG_METALES_FU, ...RENG_LIQUIDOS_FU], x: [5, 1000, 0.5],
    valida: (m) => Math.abs(m.rho - 1) > 0.05,
    respuesta: (m, x) => x / m.rho,
    errores: (m, x) => [
      ['producto', 'Masa por densidad', x * m.rho, 'Multiplicaste; el volumen es masa entre densidad.'],
      ['invertida', 'Densidad entre masa', m.rho / x, 'Dividiste al revés: V = m/ρ.']
    ],
    enunciado: (m, x) => `Se tienen ${tx(x)} g de ${m.n} (${tx(m.rho, 4)} g/mL).`, pregunta: '¿Qué volumen ocupan, en mL?',
    datos: (m, x) => [['Masa', `${tx(x)} g`], ['Densidad', `${tx(m.rho, 4)} g/mL`]],
    pasos: (m, x, _y, rengR) => [`V = m/ρ = ${tx(x)}/${tx(m.rho, 4)}.`, `V = ${tx(rengR)} mL.`],
    pistas: ['Despeja V de ρ = m/V.', 'Divide masa entre densidad.', 'Comprueba las unidades.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s21-p3', titulo: 'Masa a partir del volumen', unidad: 'g',
    objetivo: 'Calcular la masa de un volumen de líquido de densidad conocida.', seccion: '1.4', para: 'la densidad',
    idealizado: 'Líquido homogéneo.', metodo: 'escena «densidad»', lista: RENG_LIQUIDOS_FU, x: [5, 2000, 5],
    valida: (l) => Math.abs(l.rho - 1) > 0.05,
    respuesta: (l, x) => l.rho * x,
    errores: (l, x) => [
      ['cociente', 'Volumen entre densidad', x / l.rho, 'Dividiste; la masa es densidad por volumen.'],
      ['kg', 'En kilogramos', (l.rho * x) / 1000, 'Ese resultado está en kilogramos; la pregunta pide gramos.']
    ],
    enunciado: (l, x) => `Se miden ${tx(x)} mL de ${l.n} (${tx(l.rho, 4)} g/mL).`, pregunta: '¿Qué masa tienen, en g?',
    datos: (l, x) => [['Volumen', `${tx(x)} mL`], ['Densidad', `${tx(l.rho, 4)} g/mL`]],
    pasos: (l, x, _y, rengR) => [`m = ρ·V = ${tx(l.rho, 4)} × ${tx(x)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Usa m = ρ·V.', 'Multiplica.', 'Comprueba las unidades.']
  })
]

export const RENG_PRACTICAS_B01_S22: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s22-p1', titulo: 'De grados Celsius a kelvin', unidad: 'K', tolerancia: { rel: 0.0005, abs: 0.02 },
    objetivo: 'Pasar una temperatura de la escala Celsius a la escala absoluta.', seccion: '1.4', para: 'la temperatura',
    idealizado: 'Escalas exactas.', metodo: 'catálogo de unidades de la app', lista: [0], x: [-50, 150, 0.5],
    respuesta: (_e, x) => x + 273.15,
    errores: (_e, x) => [
      ['restar', 'Restar 273,15', x - 273.15, 'Para pasar a kelvin se suma 273,15.'],
      ['fahrenheit', 'Escala Fahrenheit', 1.8 * x + 32, 'Pasaste a grados Fahrenheit, no a kelvin.']
    ],
    enunciado: (_e, x) => `Un termómetro marca ${tx(x)} °C.`, pregunta: '¿Cuál es la temperatura en K?',
    datos: (_e, x) => [['t', `${tx(x)} °C`], ['Relación', 'T = t + 273,15']],
    pasos: (_e, x, _y, rengR) => [`T = ${tx(x)} + 273,15.`, `T = ${tx(rengR, 5)} K.`],
    pistas: ['Suma 273,15.', 'Los kelvin no llevan grado.', 'Debe salir positiva.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s22-p2', titulo: 'De Fahrenheit a Celsius', unidad: '°C', tolerancia: { rel: 0.002, abs: 0.05 },
    objetivo: 'Convertir una temperatura de grados Fahrenheit a grados Celsius.', seccion: '1.4', para: 'la temperatura',
    idealizado: 'Escalas exactas.', metodo: 'catálogo de unidades de la app', lista: [0], x: [50, 400, 1],
    respuesta: (_e, x) => (x - 32) / 1.8,
    errores: (_e, x) => [
      ['sin-restar', 'Sin restar 32', x / 1.8, 'Primero hay que restar 32 y después dividir entre 1,8.'],
      ['multiplicar', 'Multiplicar por 1,8', (x - 32) * 1.8, 'Para pasar de °F a °C se divide entre 1,8.']
    ],
    enunciado: (_e, x) => `Un horno marca ${tx(x)} °F.`, pregunta: '¿Cuál es la temperatura en °C?',
    datos: (_e, x) => [['t', `${tx(x)} °F`], ['Relación', '°F = 1,8·°C + 32']],
    pasos: (_e, x, _y, rengR) => [`t(°C) = (${tx(x)} − 32)/1,8.`, `= ${tx(rengR, 4)} °C.`],
    pistas: ['Primero resta 32.', 'Divide entre 1,8.', 'Comprueba con 212 °F = 100 °C.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s22-p3', titulo: 'Presión de un gas que se calienta', unidad: 'kPa',
    objetivo: 'Calcular la nueva presión de un gas calentado a volumen constante, usando temperaturas absolutas.', seccion: '1.4', para: 'la temperatura y la presión',
    idealizado: 'Gas ideal a volumen constante.', metodo: 'escena «gas-ideal»', lista: [0], x: [30, 200, 1], y: [100, 300, 1],
    respuesta: (_e, x, y) => (y * (x + 273.15)) / 293.15,
    errores: (_e, x, y) => [
      ['celsius', 'Con grados Celsius', (y * x) / 20, 'Hay que usar temperaturas absolutas: con °C la proporción no vale.'],
      ['invertida', 'Proporción invertida', (y * 293.15) / (x + 273.15), 'Al calentar a volumen constante la presión aumenta: invertiste el cociente.']
    ],
    enunciado: (_e, x, y) => `Un recipiente rígido con gas está a 20,0 °C y ${tx(y)} kPa; se calienta hasta ${tx(x)} °C.`, pregunta: '¿Qué presión alcanza, en kPa?',
    datos: (_e, x, y) => [['Inicial', `${tx(y)} kPa; 20,0 °C`], ['Final', `${tx(x)} °C`]],
    pasos: (_e, x, _y, rengR) => [`T₁ = 293,15 K; T₂ = ${tx(x + 273.15, 5)} K.`, `P₂ = P₁·T₂/T₁ = ${tx(rengR)} kPa.`],
    pistas: ['Pasa a kelvin.', 'P/T es constante.', 'Despeja P₂.']
  })
]

export const RENG_PRACTICAS_B01_S23: readonly RengPracticaN1[] = [
  rengPracticaFu({
    id: 'n1-b1-s23-p1', titulo: 'Diluir un ácido concentrado', unidad: 'mL',
    objetivo: 'Calcular el volumen de ácido concentrado necesario para una dilución, añadiéndolo siempre sobre el agua.', seccion: '1.6', para: 'la seguridad en las diluciones',
    idealizado: 'Concentraciones de etiqueta.', metodo: 'búsqueda por bisección del volumen', lista: RENG_ACIDOS_FU, x: [100, 2000, 50], y: [0.1, 3, 0.05],
    respuesta: (a, x, y) => (y * x) / a.c,
    errores: (a, x, y) => [
      ['invertida', 'Concentraciones invertidas', (a.c * x) / y, 'Invertiste las concentraciones: el volumen de ácido concentrado es menor que el final.'],
      ['agua', 'Agua que se añade', x - (y * x) / a.c, 'Ese es el volumen de agua; la pregunta pide el de ácido concentrado.']
    ],
    enunciado: (a, x, y) => `Se quieren preparar ${tx(x)} mL de ${a.n} ${tx(y)} mol/L a partir del concentrado (${tx(a.c)} mol/L), vertiendo el ácido sobre el agua.`, pregunta: '¿Qué volumen de ácido concentrado hay que medir, en mL?',
    datos: (a, x, y) => [['Concentrado', `${tx(a.c)} mol/L`], ['Final', `${tx(x)} mL; ${tx(y)} mol/L`]],
    pasos: (a, x, y, rengR) => [`c₁V₁ = c₂V₂ → V₁ = ${tx(y)} × ${tx(x)}/${tx(a.c)}.`, `V₁ = ${tx(rengR)} mL; se añade sobre el agua, nunca al revés.`],
    pistas: ['Los moles se conservan.', 'Despeja V₁.', 'Ácido sobre agua.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s23-p2', titulo: 'Bicarbonato para un derrame', unidad: 'g',
    objetivo: 'Calcular la masa de bicarbonato necesaria para neutralizar un derrame de ácido.', seccion: '1.6', para: 'la seguridad ante derrames', masas: true,
    idealizado: 'Neutralización completa; un NaHCO₃ por cada H⁺.', metodo: 'masa molar del núcleo', sinVerificar: [], lista: RENG_ACIDOS_FU.filter((rengA) => rengA.f !== 'C2H4O2'), x: [10, 500, 5], y: [0.1, 6, 0.1],
    respuesta: (a, x, y) => (x / 1000) * y * a.h * M('NaHCO3'),
    errores: (a, x, y) => [
      ['ml', 'Volumen en mL', x * y * a.h * M('NaHCO3'), 'La concentración está en mol/L: pasa los mL a litros.'],
      ['acido', 'Masa del ácido', (x / 1000) * y * M(a.f), 'Calculaste la masa del ácido derramado, no la del bicarbonato.']
    ],
    enunciado: (a, x, y) => `Se derraman ${tx(x)} mL de ${a.n} ${tx(y)} mol/L y se neutralizan con NaHCO₃ (un NaHCO₃ por cada H⁺).`, pregunta: '¿Qué masa mínima de bicarbonato hace falta, en g?',
    datos: (a, x, y) => [['Ácido', `${tx(x)} mL; ${tx(y)} mol/L; ${a.h} H⁺ por fórmula`], ['M(NaHCO₃)', `${tx(M('NaHCO3'), 5)} g/mol`]],
    pasos: (a, x, y, rengR) => [`n(H⁺) = ${tx((x / 1000) * y * a.h)} mol.`, `m = ${tx(rengR)} g.`],
    pistas: ['Calcula los moles de H⁺.', 'Un NaHCO₃ por H⁺.', 'Pasa a gramos.']
  }),
  rengPracticaFu({
    id: 'n1-b1-s23-p3', titulo: 'Factor de dilución', unidad: '',
    objetivo: 'Calcular cuántas veces se diluye un producto para pasar de una concentración a otra.', seccion: '1.6', para: 'la seguridad en las diluciones',
    idealizado: 'Dilución con agua.', metodo: 'cociente de volúmenes con la conservación de los moles', lista: [0], x: [2, 18, 0.1], y: [0.05, 6, 0.05],
    valida: (_e, x, y) => x / y > 1.5,
    respuesta: (_e, x, y) => x / y,
    errores: (_e, x, y) => [
      ['invertido', 'Cociente invertido', y / x, 'Invertiste el cociente: el factor de dilución es mayor que 1.'],
      ['resta', 'Diferencia de concentraciones', x - y, 'El factor de dilución es un cociente, no una diferencia.']
    ],
    enunciado: (_e, x, y) => `Un producto de limpieza de ${tx(x)} mol/L se diluye hasta ${tx(y)} mol/L.`, pregunta: '¿Cuántas veces se ha diluido?',
    datos: (_e, x, y) => [['Concentrado', `${tx(x)} mol/L`], ['Diluido', `${tx(y)} mol/L`]],
    pasos: (_e, _x, _y, rengR) => ['Factor = c₁/c₂ = V₂/V₁.', `Se ha diluido ${tx(rengR)} veces.`],
    pistas: ['Divide las concentraciones.', 'El resultado es mayor que 1.', 'Coincide con V₂/V₁.']
  })
]
