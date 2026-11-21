import { rengConvertir } from '../../../../../lib/unidades'
import { rengPorSimbolo } from '../../../../tabla-periodica/data'
import { rengLecturasCombustion } from '../../../escenas-n1/modelos/combustion'
import { rengLecturasDensidad } from '../../../escenas-n1/modelos/densidad'
import { rengLecturasGasIdeal } from '../../../escenas-n1/modelos/gas-ideal'
import { rengBiseccion } from '../numericos'
import type { RengEjemploN1 } from '../tipos'
import { rengTx } from '../estequiometria/datos'
import { rengMmFu } from './comun'

const T = { rel: 0.005, abs: 1e-12 }
const ej = (rengE: Omit<RengEjemploN1, 'tolerancia' | 'cifras'> & { cifras?: number }): RengEjemploN1 => ({ cifras: 3, tolerancia: T, ...rengE })
const A = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
const M = rengMmFu
const media = (rengL: readonly number[]): number => rengL.reduce((rengA, rengB) => rengA + rengB, 0) / rengL.length

export const RENG_EJEMPLOS_FUNDAMENTOS: readonly RengEjemploN1[] = [
  ej({ id: 'ej-fu-quimica', titulo: 'Composición del agua', enunciado: `La química estudia la composición de la materia. El agua es H₂O; masas de la tabla de la app: H ${rengTx(A('H'), 5)}, O ${rengTx(A('O'), 5)} g/mol.`, pregunta: '¿Qué porcentaje de la masa del agua es oxígeno?', datos: [['Fórmula', 'H₂O']], unidad: '%',
    analitico: () => (100 * A('O')) / (2 * A('H') + A('O')), segundo: () => (100 * A('O')) / M('H2O'), metodoSegundo: 'masa molar del núcleo',
    pasos: (rengR) => ['M(H₂O) = 2·M(H) + M(O).', `% O = ${rengTx(rengR)} %.`], pistas: ['Calcula la masa molar del agua.', 'Divide la del oxígeno.', 'Multiplica por 100.'] }),
  ej({ id: 'ej-fu-historia', titulo: 'La balanza de Lavoisier', enunciado: 'Se queman 12,0 g de carbón (C) en un recipiente cerrado y se forman 44,0 g de CO₂.', pregunta: '¿Qué masa de oxígeno se ha consumido, en g?', datos: [['C', '12,0 g'], ['CO₂', '44,0 g']], unidad: 'g',
    analitico: () => 44 - 12, segundo: () => rengBiseccion((rengM) => 12 + rengM - 44, 0, 100), metodoSegundo: 'búsqueda por bisección de la masa que conserva la total',
    pasos: (rengR) => ['En recipiente cerrado la masa se conserva (Lavoisier).', `m(O₂) = 44,0 − 12,0 = ${rengTx(rengR)} g.`], pistas: ['La masa total no cambia.', 'Resta la del carbón.', 'Es la masa del oxígeno.'] }),
  ej({ id: 'ej-fu-metodo', titulo: 'Media de varias medidas', enunciado: 'Cuatro medidas de la masa de una moneda dan 7,48 g, 7,52 g, 7,50 g y 7,46 g.', pregunta: '¿Cuál es el valor medio, en g?', datos: [['Medidas', '7,48; 7,52; 7,50; 7,46 g']], unidad: 'g',
    analitico: () => (7.48 + 7.52 + 7.5 + 7.46) / 4, segundo: () => media([7.46, 7.48, 7.5, 7.52]), metodoSegundo: 'media calculada con las medidas ordenadas',
    pasos: (rengR) => ['Se suman las cuatro medidas y se divide entre 4.', `Media = ${rengTx(rengR, 4)} g.`], pistas: ['Suma las cuatro medidas.', 'Divide entre cuatro.', 'Da el resultado con dos decimales.'] }),
  ej({ id: 'ej-fu-energia', titulo: 'Energía para calentar agua', enunciado: 'Se calientan 500 g de agua de 20,0 °C a 80,0 °C; c = 4,184 J/(g·K).', pregunta: '¿Cuánta energía absorbe el agua, en kJ?', datos: [['Agua', '500 g'], ['ΔT', '60,0 K']], unidad: 'kJ',
    analitico: () => (500 * 4.184 * 60) / 1000, segundo: () => rengConvertir(500 * 4.184 * (rengConvertir(80, '°C', 'K') - rengConvertir(20, '°C', 'K')), 'J', 'kJ'), metodoSegundo: 'conversión de temperaturas y energía con el catálogo de unidades',
    pasos: (rengR) => ['q = m·c·ΔT.', `q = 500 × 4,184 × 60,0 = ${rengTx(rengR)} kJ.`], pistas: ['Usa q = m·c·ΔT.', 'ΔT en K y en °C es igual.', 'Pasa los J a kJ.'] }),
  ej({ id: 'ej-fu-propiedades', titulo: 'Identificar un metal por su densidad', enunciado: 'Un objeto metálico de 81,0 g desplaza 30,0 mL de agua.', pregunta: '¿Cuál es su densidad, en g/mL?', datos: [['Masa', '81,0 g'], ['Volumen', '30,0 mL']], unidad: 'g/mL',
    analitico: () => 81 / 30, segundo: () => rengLecturasDensidad({ m: 81, V: 30, rhoL: 1 }).rho!, metodoSegundo: 'escena «densidad» con los mismos datos',
    pasos: (rengR) => ['ρ = m/V es una propiedad específica.', `ρ = 81,0/30,0 = ${rengTx(rengR)} g/mL (coincide con el aluminio).`], pistas: ['Divide masa entre volumen.', 'Compara con tablas.', 'La densidad identifica la sustancia.'] }),
  ej({ id: 'ej-fu-fisicas', titulo: 'Calor para fundir hielo', enunciado: 'Se funden 50,0 g de hielo a 0 °C; calor de fusión 334 J/g (valor redondeado).', pregunta: '¿Cuánto calor hace falta, en kJ?', datos: [['Hielo', '50,0 g'], ['L_f', '334 J/g']], unidad: 'kJ',
    analitico: () => (50 * 334) / 1000, segundo: () => rengConvertir(50 * 334, 'J', 'kJ'), metodoSegundo: 'conversión de energía con el catálogo de unidades',
    pasos: (rengR) => ['Fundir es un cambio físico: q = m·L_f.', `q = ${rengTx(rengR)} kJ.`], pistas: ['Multiplica masa por calor latente.', 'Pasa el resultado a kJ.', 'La temperatura no cambia al fundir.'] }),
  ej({ id: 'ej-fu-intensivas', titulo: 'Densidad de dos trozos', enunciado: 'Dos trozos del mismo hierro tienen 39,4 g en 5,0 mL y 78,8 g en 10,0 mL.', pregunta: '¿Cuál es la densidad del trozo grande, en g/mL?', datos: [['Trozo pequeño', '39,4 g; 5,0 mL'], ['Trozo grande', '78,8 g; 10,0 mL']], unidad: 'g/mL',
    analitico: () => 78.8 / 10, segundo: () => 39.4 / 5, metodoSegundo: 'densidad del trozo pequeño (intensiva: debe ser igual)',
    pasos: (rengR) => ['La masa y el volumen se duplican (extensivas).', `La densidad no cambia (intensiva): ${rengTx(rengR)} g/mL.`], pistas: ['Calcula m/V del grande.', 'Compara con el pequeño.', 'La densidad no depende del tamaño.'] }),
  ej({ id: 'ej-fu-estados', titulo: 'Volumen de un gas', enunciado: 'Se tiene 1,00 mol de gas ideal a 273 K y 101,325 kPa.', pregunta: '¿Qué volumen ocupa, en L?', datos: [['n', '1,00 mol'], ['T', '273 K'], ['P', '101,325 kPa']], unidad: 'L',
    analitico: () => (1 * 8.314462618 * 273) / 101.325, segundo: () => rengBiseccion((rengV) => rengLecturasGasIdeal({ n: 1, T: 273, V: rengV, M: 28 }).P! - 101.325, 1, 100), metodoSegundo: 'escena «gas-ideal»: volumen que da 101,325 kPa',
    pasos: (rengR) => ['En estado gaseoso las partículas ocupan todo el recipiente: V = nRT/P.', `V = ${rengTx(rengR)} L.`], pistas: ['Usa PV = nRT.', 'R = 8,314 J/(mol·K).', 'Con P en kPa sale V en L.'] }),
  ej({ id: 'ej-fu-cambios', titulo: 'Calor para hervir agua', enunciado: 'Se evaporan 20,0 g de agua a 100 °C; calor de vaporización 2260 J/g (valor redondeado).', pregunta: '¿Cuánto calor hace falta, en kJ?', datos: [['Agua', '20,0 g'], ['L_v', '2260 J/g']], unidad: 'kJ',
    analitico: () => (20 * 2260) / 1000, segundo: () => rengConvertir(20 * 2260, 'J', 'kJ'), metodoSegundo: 'conversión de energía con el catálogo de unidades',
    pasos: (rengR) => ['Hervir es un cambio físico: el vapor sigue siendo agua.', `q = 20,0 × 2260 J = ${rengTx(rengR)} kJ.`], pistas: ['Multiplica masa por calor latente.', 'Pasa el resultado a kJ.', 'No se forma ninguna sustancia nueva.'] }),
  ej({ id: 'ej-fu-puras', titulo: 'Pureza de una muestra', enunciado: 'Una muestra de 25,0 g de sal contiene 24,2 g de NaCl puro.', pregunta: '¿Cuál es su pureza, en %?', datos: [['Muestra', '25,0 g'], ['NaCl', '24,2 g']], unidad: '%',
    analitico: () => (100 * 24.2) / 25, segundo: () => 100 - (100 * (25 - 24.2)) / 25, metodoSegundo: '100 % menos el porcentaje de impurezas',
    pasos: (rengR) => ['Una sustancia pura tendría el 100 %.', `Pureza = 24,2/25,0 × 100 = ${rengTx(rengR)} %.`], pistas: ['Divide la masa pura entre la total.', 'Multiplica por 100.', 'Comprueba con las impurezas.'] }),
  ej({ id: 'ej-fu-elementos', titulo: 'Proporción fija de un compuesto', enunciado: `Una muestra de agua contiene 2,00 g de hidrógeno. Masas: H ${rengTx(A('H'), 5)}, O ${rengTx(A('O'), 5)} g/mol.`, pregunta: '¿Cuánto oxígeno contiene, en g?', datos: [['H', '2,00 g'], ['Compuesto', 'H₂O']], unidad: 'g',
    analitico: () => (2 / (2 * A('H'))) * A('O'), segundo: () => (2 * (M('H2O') - 2 * A('H'))) / (2 * A('H')), metodoSegundo: 'proporción en masa O/H con la masa molar del núcleo',
    pasos: (rengR) => ['En un compuesto la proporción en masa es fija.', `m(O) = ${rengTx(rengR)} g.`], pistas: ['Pasa el H a moles de H₂O.', 'Un O por cada dos H.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-fu-mezclas', titulo: 'Composición de una mezcla', enunciado: 'Se disuelven 15,0 g de azúcar en 185 g de agua.', pregunta: '¿Qué porcentaje en masa de azúcar tiene la mezcla?', datos: [['Azúcar', '15,0 g'], ['Agua', '185 g']], unidad: '%',
    analitico: () => (100 * 15) / (15 + 185), segundo: () => 100 - (100 * 185) / 200, metodoSegundo: '100 % menos el porcentaje de agua',
    pasos: (rengR) => ['Masa total = 200 g; la mezcla homogénea tiene composición variable.', `% = ${rengTx(rengR)} %.`], pistas: ['Suma las masas.', 'Divide la del azúcar.', 'Multiplica por 100.'] }),
  ej({ id: 'ej-fu-separacion', titulo: 'Sal recuperada por evaporación', enunciado: 'Se evaporan 250 mL de agua de mar con 35,0 g/L de sales disueltas.', pregunta: '¿Qué masa de sal se recupera, en g?', datos: [['Volumen', '250 mL'], ['Concentración', '35,0 g/L']], unidad: 'g',
    analitico: () => 0.25 * 35, segundo: () => rengConvertir(250, 'mL', 'L') * 35, metodoSegundo: 'conversión de volumen con el catálogo de unidades',
    pasos: (rengR) => ['La evaporación separa el disolvente del soluto.', `m = 0,250 L × 35,0 g/L = ${rengTx(rengR)} g.`], pistas: ['Pasa los mL a L.', 'Multiplica por la concentración.', 'El agua se va como vapor.'] }),
  ej({ id: 'ej-fu-sistemas', titulo: 'Densidad media de un sistema', enunciado: 'Un recipiente contiene 100 mL de agua (100 g) y 50,0 mL de aceite (46,0 g) que no se mezclan.', pregunta: '¿Cuál es la densidad media del sistema, en g/mL?', datos: [['Agua', '100 mL, 100 g'], ['Aceite', '50,0 mL, 46,0 g']], unidad: 'g/mL',
    analitico: () => (100 + 46) / (100 + 50), segundo: () => rengLecturasDensidad({ m: 146, V: 150, rhoL: 1 }).rho!, metodoSegundo: 'escena «densidad» con la masa y el volumen totales',
    pasos: (rengR) => ['Sistema heterogéneo de dos fases.', `ρ media = 146/150 = ${rengTx(rengR)} g/mL.`], pistas: ['Suma las masas.', 'Suma los volúmenes.', 'Divide para obtener el resultado.'] }),
  ej({ id: 'ej-fu-fenomenos', titulo: 'Un fenómeno químico: quemar metano', enunciado: 'Se queman 8,00 g de metano, CH₄.', pregunta: '¿Qué masa de CO₂ se forma, en g?', datos: [['CH₄', '8,00 g']], unidad: 'g',
    analitico: () => (8 / M('CH4')) * M('CO2'), segundo: () => rengLecturasCombustion({ x: 1, y: 4, z: 0, n: 8 / (A('C') + 4 * A('H')) }).mco2!, metodoSegundo: 'escena «combustion» con los mismos moles',
    pasos: (rengR) => ['Se forman sustancias nuevas: es un fenómeno químico.', `m(CO₂) = ${rengTx(rengR)} g.`], pistas: ['Pasa el metano a moles.', 'Un CO₂ por CH₄.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-fu-magnitudes', titulo: 'De km/h a m/s', enunciado: 'Un coche circula a 90,0 km/h.', pregunta: '¿Cuál es su velocidad en m/s?', datos: [['Velocidad', '90,0 km/h']], unidad: 'm/s',
    analitico: () => (90 * 1000) / 3600, segundo: () => rengConvertir(90, 'km/h', 'm/s'), metodoSegundo: 'catálogo de unidades de la app',
    pasos: (rengR) => ['1 km = 1000 m y 1 h = 3600 s.', `90,0 × 1000/3600 = ${rengTx(rengR)} m/s.`], pistas: ['Pasa los km a m.', 'Pasa las h a s.', 'Divide para obtener el resultado.'] }),
  ej({ id: 'ej-fu-si', titulo: 'Densidad en unidades del SI', enunciado: 'El aluminio tiene una densidad de 2,70 g/cm³.', pregunta: '¿Cuál es su densidad en kg/m³?', datos: [['Densidad', '2,70 g/cm³']], unidad: 'kg/m³',
    analitico: () => (2.7 / 1000) * 1e6, segundo: () => rengLecturasDensidad({ m: 2.7, V: 1, rhoL: 1 }).rhoSI!, metodoSegundo: 'escena «densidad» (lectura en kg/m³)',
    pasos: (rengR) => ['1 g = 10⁻³ kg y 1 cm³ = 10⁻⁶ m³.', `2,70 × 10⁻³/10⁻⁶ = ${rengTx(rengR)} kg/m³.`], pistas: ['Pasa los g a kg.', 'Pasa los cm³ a m³.', 'Divide para obtener el resultado.'] }),
  ej({ id: 'ej-fu-notacion', titulo: 'Átomos en un gramo de carbono', enunciado: 'N_A = 6,022·10²³ mol⁻¹; M(C) = 12,011 g/mol (valores de la app redondeados).', pregunta: '¿Cuántos átomos hay en 1,00 g de carbono, en múltiplos de 10²² (el número que multiplica a 10²²)?', datos: [['Masa', '1,00 g'], ['N_A', '6,022·10²³']], unidad: '',
    analitico: () => ((1 / 12.011) * 6.022e23) / 1e22, segundo: () => (6.022 / 12.011) * 10, metodoSegundo: 'operación separando mantisas y potencias de diez',
    pasos: (rengR) => ['N = (1,00/12,011) × 6,022·10²³ = 5,01·10²².', `Número que multiplica a 10²²: ${rengTx(rengR)}.`], pistas: ['Pasa a moles.', 'Multiplica por N_A.', 'Escribe el resultado en notación científica.'] }),
  ej({ id: 'ej-fu-cifras', titulo: 'Cifras de un producto', enunciado: 'Se calcula el área de un rectángulo de 12,3 cm × 4,5 cm.', pregunta: '¿Con cuántas cifras significativas debe darse el resultado?', datos: [['Lados', '12,3 cm (3 cifras) y 4,5 cm (2 cifras)']], unidad: '',
    analitico: () => Math.min(3, 2), segundo: () => [3, 2].sort((rengA, rengB) => rengA - rengB)[0]!, metodoSegundo: 'menor número de cifras de los factores, ordenados',
    pasos: (rengR) => ['En productos y cocientes manda el dato con menos cifras significativas.', `Área = 55 cm² (${rengTx(rengR)} cifras).`], pistas: ['Cuenta las cifras de cada dato.', 'Toma el menor.', 'Redondea el resultado.'] }),
  ej({ id: 'ej-fu-dimensional', titulo: 'Glucosa en sangre', enunciado: 'Un análisis da 90,0 mg/dL de glucosa (C₆H₁₂O₆).', pregunta: '¿Cuánto es en mmol/L?', datos: [['Glucosa', '90,0 mg/dL'], ['M', `${rengTx(M('C6H12O6'), 5)} g/mol`]], unidad: 'mmol/L',
    analitico: () => (90 * 10) / M('C6H12O6'), segundo: () => (rengConvertir(90, 'mg', 'g') / rengConvertir(100, 'mL', 'L') / M('C6H12O6')) * 1000, metodoSegundo: 'catálogo de unidades (mg a g y mL a L) y masa molar del núcleo',
    pasos: (rengR) => ['90,0 mg/dL × 10 dL/L = 900 mg/L; ÷ 180,16 mg/mmol.', `= ${rengTx(rengR)} mmol/L.`], pistas: ['Pasa los dL a L.', 'Divide entre la masa molar.', 'mg/mmol = g/mol.'] }),
  ej({ id: 'ej-fu-densidad', titulo: 'Masa de un volumen de etanol', enunciado: 'El etanol tiene una densidad de 0,789 g/mL (valor redondeado).', pregunta: '¿Qué masa tienen 250 mL de etanol, en g?', datos: [['V', '250 mL'], ['ρ', '0,789 g/mL']], unidad: 'g',
    analitico: () => 0.789 * 250, segundo: () => rengBiseccion((rengM) => rengLecturasDensidad({ m: rengM, V: 250, rhoL: 1 }).rho! - 0.789, 1, 1000), metodoSegundo: 'escena «densidad»: masa que da 0,789 g/mL',
    pasos: (rengR) => ['m = ρ·V.', `m = 0,789 × 250 = ${rengTx(rengR)} g.`], pistas: ['Multiplica densidad por volumen.', 'Comprueba las unidades.', 'El resultado sale en gramos.'] }),
  ej({ id: 'ej-fu-temperatura', titulo: 'Fiebre en kelvin', enunciado: 'Una persona tiene 38,5 °C de temperatura corporal.', pregunta: '¿Cuál es su temperatura en K?', datos: [['t', '38,5 °C']], unidad: 'K',
    analitico: () => 38.5 + 273.15, segundo: () => rengConvertir(38.5, '°C', 'K'), metodoSegundo: 'catálogo de unidades de la app',
    pasos: (rengR) => ['T(K) = t(°C) + 273,15.', `T = ${rengTx(rengR, 5)} K.`], pistas: ['Suma 273,15.', 'Los kelvin no llevan grado.', 'Comprueba que sea positivo.'] }),
  ej({ id: 'ej-fu-seguridad', titulo: 'Diluir un ácido con seguridad', enunciado: 'Se quieren preparar 500 mL de HCl 1,00 mol/L a partir de HCl 6,00 mol/L, añadiendo siempre el ácido sobre el agua.', pregunta: '¿Qué volumen de ácido concentrado hay que tomar, en mL?', datos: [['c₁', '6,00 mol/L'], ['c₂', '1,00 mol/L'], ['V₂', '500 mL']], unidad: 'mL',
    analitico: () => (1 * 500) / 6, segundo: () => rengBiseccion((rengV) => 6 * rengV - 1 * 500, 0, 1000), metodoSegundo: 'búsqueda por bisección del volumen que conserva los moles',
    pasos: (rengR) => ['c₁·V₁ = c₂·V₂ (los moles de soluto no cambian).', `V₁ = ${rengTx(rengR)} mL; se vierte sobre el agua, nunca al revés.`], pistas: ['Los moles se conservan.', 'Despeja V₁.', 'Ácido sobre agua.'] })
]

