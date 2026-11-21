import { rengConvertir } from '../../../../../lib/unidades'
import { rengPorSimbolo } from '../../../../tabla-periodica/data'
import { rengLecturasCalorimetria } from '../../../escenas-n1/modelos/calorimetria'
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

export const RENG_EJEMPLOS_FUNDAMENTOS_INTEGRADORES: readonly RengEjemploN1[] = [
  ej({ id: 'ej-fu-quimica-2', titulo: 'Hierro en un mineral', enunciado: 'La hematita es Fe₂O₃. Se tienen 200 g de mineral puro.', pregunta: '¿Qué masa de hierro contiene, en g?', datos: [['Mineral', '200 g de Fe₂O₃']], unidad: 'g',
    analitico: () => (200 * 2 * A('Fe')) / (2 * A('Fe') + 3 * A('O')), segundo: () => 200 - (200 * 3 * A('O')) / M('Fe2O3'), metodoSegundo: 'masa total menos la del oxígeno, con la masa molar del núcleo',
    pasos: (rengR) => ['La química estudia la composición (subtema 1); la fórmula da la proporción de cada elemento (subtema 11).', `m(Fe) = ${rengTx(rengR)} g.`], pistas: ['Calcula la fracción de Fe.', 'Multiplica por la masa.', 'Comprueba con el oxígeno.'] }),
  ej({ id: 'ej-fu-historia-2', titulo: 'Proporciones múltiples de Dalton', enunciado: 'El carbono forma CO y CO₂.', pregunta: 'Para la misma masa de carbono, ¿cuántas veces más oxígeno tiene el CO₂ que el CO?', datos: [['Óxidos', 'CO y CO₂']], unidad: '',
    analitico: () => 2 / 1, segundo: () => ((M('CO2') - A('C')) / A('C')) / ((M('CO') - A('C')) / A('C')), metodoSegundo: 'cociente de las masas de oxígeno por gramo de carbono con el núcleo',
    pasos: (rengR) => ['Por cada 12 g de C: 16 g de O en el CO y 32 g en el CO₂ (subtema 2).', `Relación de números enteros sencillos: ${rengTx(rengR)}.`], pistas: ['Fija la masa de carbono.', 'Calcula el oxígeno en cada óxido.', 'Divide para obtener el resultado.'] }),
  ej({ id: 'ej-fu-metodo-2', titulo: 'Error relativo de una medida', enunciado: 'Un alumno mide la densidad del cobre y obtiene 8,73 g/cm³; el valor de referencia es 8,96 g/cm³ (redondeado).', pregunta: '¿Cuál es el error relativo, en %?', datos: [['Medida', '8,73 g/cm³'], ['Referencia', '8,96 g/cm³']], unidad: '%',
    analitico: () => (100 * Math.abs(8.73 - 8.96)) / 8.96, segundo: () => 100 * (1 - 8.73 / 8.96), metodoSegundo: 'complemento del cociente medida/referencia',
    pasos: (rengR) => ['Error relativo = |medida − referencia|/referencia (subtemas 3 y 21).', `= ${rengTx(rengR)} %.`], pistas: ['Resta medida y referencia.', 'Divide entre la referencia.', 'Multiplica por 100.'] }),
  ej({ id: 'ej-fu-energia-2', titulo: 'Temperatura de una mezcla', enunciado: 'Se mezclan 200 g de agua a 80,0 °C con 300 g de agua a 20,0 °C sin pérdidas.', pregunta: '¿Cuál es la temperatura final, en °C?', datos: [['Agua caliente', '200 g a 80,0 °C'], ['Agua fría', '300 g a 20,0 °C']], unidad: '°C',
    analitico: () => (200 * 80 + 300 * 20) / 500, segundo: () => rengLecturasCalorimetria({ m1: 200, c1: 4.184, T1: 80, m2: 300, T2: 20, Ccal: 0 }).Tf!, metodoSegundo: 'escena «calorimetria» con los mismos datos',
    pasos: (rengR) => ['La energía pasa del agua caliente a la fría (subtema 4).', `T_f = ${rengTx(rengR)} °C: la temperatura es intensiva y no se suma (subtema 7).`], pistas: ['Calor cedido = calor ganado.', 'Es una media ponderada.', 'Las masas son los pesos.'] }),
  ej({ id: 'ej-fu-propiedades-2', titulo: 'Volumen de un cubo metálico', enunciado: 'Un cubo de cobre tiene 2,00 cm de arista y una densidad de 8,96 g/cm³ (redondeada).', pregunta: '¿Qué masa tiene, en g?', datos: [['Arista', '2,00 cm'], ['ρ', '8,96 g/cm³']], unidad: 'g',
    analitico: () => 2 ** 3 * 8.96, segundo: () => rengBiseccion((rengM) => rengLecturasDensidad({ m: rengM, V: 8, rhoL: 1 }).rho! - 8.96, 1, 1000), metodoSegundo: 'escena «densidad»: masa que da 8,96 g/mL con 8 mL',
    pasos: (rengR) => ['V = a³ = 8,00 cm³ (propiedad general, subtema 5).', `m = ρ·V = ${rengTx(rengR)} g (subtema 21).`], pistas: ['Calcula el volumen.', 'Multiplica por la densidad.', '1 cm³ = 1 mL.'] }),
  ej({ id: 'ej-fu-fisicas-2', titulo: 'Hielo hasta agua templada', enunciado: 'Se pasa 100 g de hielo a 0 °C a agua a 25,0 °C. L_f = 334 J/g; c(agua) = 4,184 J/(g·K).', pregunta: '¿Cuánta energía hace falta, en kJ?', datos: [['Hielo', '100 g a 0 °C'], ['Final', 'agua a 25,0 °C']], unidad: 'kJ',
    analitico: () => (100 * 334 + 100 * 4.184 * 25) / 1000, segundo: () => rengConvertir(100 * 334, 'J', 'kJ') + rengConvertir(100 * 4.184 * 25, 'J', 'kJ'), metodoSegundo: 'suma de las dos etapas con el catálogo de unidades',
    pasos: (rengR) => ['Fundir (cambio de estado, subtema 8) y luego calentar (subtema 6).', `q = 33,4 + 10,46 = ${rengTx(rengR)} kJ.`], pistas: ['Calor de fusión.', 'Calor para calentar.', 'Suma las dos etapas.'] }),
  ej({ id: 'ej-fu-intensivas-2', titulo: 'Juntar dos muestras', enunciado: 'Se juntan dos muestras de agua de 150 g y 250 g, ambas a 20,0 °C.', pregunta: '¿Cuál es la masa total, en g?', datos: [['Muestra 1', '150 g, 20,0 °C'], ['Muestra 2', '250 g, 20,0 °C']], unidad: 'g',
    analitico: () => 150 + 250, segundo: () => rengBiseccion((rengM) => rengM - 150 - 250, 0, 1000), metodoSegundo: 'búsqueda por bisección de la masa total que conserva las dos muestras',
    pasos: (rengR) => ['La masa es extensiva: se suma (subtema 7).', `m = ${rengTx(rengR)} g, y la temperatura sigue siendo 20,0 °C (intensiva).`], pistas: ['¿Qué propiedades se suman?', 'Suma las masas.', 'La temperatura no se suma.'] }),
  ej({ id: 'ej-fu-estados-2', titulo: 'Densidad del vapor de agua', enunciado: 'Vapor de agua (M = 18,02 g/mol) a 373 K y 101,325 kPa, como gas ideal.', pregunta: '¿Cuál es su densidad, en g/L?', datos: [['T', '373 K'], ['P', '101,325 kPa']], unidad: 'g/L',
    analitico: () => (101.325 * M('H2O')) / (8.314462618 * 373), segundo: () => rengLecturasGasIdeal({ n: 1, T: 373, V: (8.314462618 * 373) / 101.325, M: M('H2O') }).rho!, metodoSegundo: 'escena «gas-ideal» (lectura de densidad)',
    pasos: (rengR) => ['ρ = P·M/(R·T) para un gas (subtemas 8 y 22).', `ρ = ${rengTx(rengR)} g/L, unas 1700 veces menos que el agua líquida.`], pistas: ['Usa PV = nRT.', 'Sustituye n = m/M.', 'Despeja m/V.'] }),
  ej({ id: 'ej-fu-cambios-2', titulo: 'Masa de un hidrato al calentarlo', enunciado: 'Se calientan 2,50 g de CuSO₄·5H₂O hasta perder toda el agua.', pregunta: '¿Qué masa queda, en g?', datos: [['Hidrato', '2,50 g']], unidad: 'g',
    analitico: () => (2.5 * M('CuSO4')) / (M('CuSO4') + 5 * M('H2O')), segundo: () => 2.5 - (2.5 * 5 * M('H2O')) / M('CuSO4·5H2O'), metodoSegundo: 'masa inicial menos el agua, con la masa molar del hidrato del núcleo',
    pasos: (rengR) => ['La deshidratación es un cambio químico (subtema 9): cambia el color y la sustancia.', `Queda ${rengTx(rengR)} g de CuSO₄.`], pistas: ['Calcula la fracción de sal anhidra.', 'Multiplica por la masa.', 'El agua se va como vapor.'] }),
  ej({ id: 'ej-fu-puras-2', titulo: 'Moles en una muestra impura', enunciado: 'Una muestra de 50,0 g de CaCO₃ tiene una pureza del 92,0 %.', pregunta: '¿Cuántos moles de CaCO₃ contiene?', datos: [['Muestra', '50,0 g'], ['Pureza', '92,0 %']], unidad: 'mol',
    analitico: () => (50 * 0.92) / (A('Ca') + A('C') + 3 * A('O')), segundo: () => (50 * 0.92) / M('CaCO3'), metodoSegundo: 'masa molar del núcleo',
    pasos: (rengR) => ['Solo el 92,0 % es sustancia pura (subtema 10).', `n = 46,0 g / M = ${rengTx(rengR)} mol.`], pistas: ['Calcula la masa pura.', 'Pasa a moles.', 'Ignora las impurezas.'] }),
  ej({ id: 'ej-fu-elementos-2', titulo: 'Átomos en un mol de compuesto', enunciado: 'Se tienen 0,500 mol de glucosa, C₆H₁₂O₆; N_A = 6,022·10²³ mol⁻¹.', pregunta: '¿Cuántos átomos hay en total, en múltiplos de 10²⁴?', datos: [['Glucosa', '0,500 mol']], unidad: '',
    analitico: () => (0.5 * 24 * 6.022e23) / 1e24, segundo: () => 0.5 * (6 + 12 + 6) * 0.6022, metodoSegundo: 'operación separando la potencia de diez',
    pasos: (rengR) => ['Cada molécula tiene 24 átomos de tres elementos (subtema 11).', `N = 0,500 × 24 × 6,022·10²³ = ${rengTx(rengR)}·10²⁴ (subtema 18).`], pistas: ['Cuenta los átomos de la fórmula.', 'Multiplica por los moles y N_A.', 'Ajusta la potencia de diez.'] }),
  ej({ id: 'ej-fu-mezclas-2', titulo: 'Preparar una mezcla', enunciado: 'Se quieren 400 g de disolución de sal al 5,00 % en masa.', pregunta: '¿Qué masa de sal hay que pesar, en g?', datos: [['Disolución', '400 g'], ['%', '5,00 %']], unidad: 'g',
    analitico: () => 400 * 0.05, segundo: () => rengBiseccion((rengM) => (100 * rengM) / 400 - 5, 0, 400), metodoSegundo: 'búsqueda por bisección de la masa que da el 5,00 %',
    pasos: (rengR) => ['En una mezcla la composición se elige (subtema 12).', `m(sal) = ${rengTx(rengR)} g y 380 g de agua.`], pistas: ['Aplica el porcentaje.', 'El resto es agua.', 'Comprueba sumando.'] }),
  ej({ id: 'ej-fu-separacion-2', titulo: 'Arena y sal', enunciado: 'Una mezcla de 30,0 g de arena y sal se disuelve en agua y se filtra; la arena seca pesa 18,5 g.', pregunta: '¿Qué porcentaje de sal tenía la mezcla?', datos: [['Mezcla', '30,0 g'], ['Arena', '18,5 g']], unidad: '%',
    analitico: () => (100 * (30 - 18.5)) / 30, segundo: () => 100 - (100 * 18.5) / 30, metodoSegundo: '100 % menos el porcentaje de arena',
    pasos: (rengR) => ['La filtración separa la arena; la sal pasa disuelta (subtema 13).', `% sal = ${rengTx(rengR)} %.`], pistas: ['Resta la arena.', 'Divide entre la mezcla.', 'Multiplica por 100.'] }),
  ej({ id: 'ej-fu-sistemas-2', titulo: 'Fracción sumergida del hielo', enunciado: 'Un cubo de hielo (0,917 g/mL) flota en agua (1,00 g/mL).', pregunta: '¿Qué porcentaje de su volumen queda sumergido?', datos: [['ρ hielo', '0,917 g/mL'], ['ρ agua', '1,00 g/mL']], unidad: '%',
    analitico: () => (100 * 0.917) / 1, segundo: () => rengLecturasDensidad({ m: 91.7, V: 100, rhoL: 1 }).sumergido!, metodoSegundo: 'escena «densidad» (volumen sumergido)',
    pasos: (rengR) => ['Sistema heterogéneo de dos fases (subtema 14); flota porque es menos denso (subtema 21).', `Sumergido: ${rengTx(rengR)} %.`], pistas: ['Compara las densidades.', 'Divide ρ hielo entre ρ agua.', 'Multiplica por 100.'] }),
  ej({ id: 'ej-fu-fenomenos-2', titulo: 'El agua se expande al congelarse', enunciado: '500 g de agua líquida (1,00 g/mL) se congelan en hielo (0,917 g/mL).', pregunta: '¿Cuánto aumenta el volumen, en mL?', datos: [['Agua', '500 g'], ['ρ hielo', '0,917 g/mL']], unidad: 'mL',
    analitico: () => 500 / 0.917 - 500 / 1, segundo: () => rengBiseccion((rengV) => rengLecturasDensidad({ m: 500, V: rengV, rhoL: 1 }).rho! - 0.917, 100, 1000) - 500, metodoSegundo: 'escena «densidad»: volumen del hielo menos el del agua',
    pasos: (rengR) => ['Congelar es un fenómeno físico (subtema 15): la masa no cambia, la densidad sí.', `ΔV = ${rengTx(rengR)} mL.`], pistas: ['Volumen del líquido.', 'Volumen del hielo.', 'Resta los dos volúmenes.'] }),
  ej({ id: 'ej-fu-magnitudes-2', titulo: 'Caudal en unidades del SI', enunciado: 'Un grifo deja salir 12,0 L/min.', pregunta: '¿Cuánto es en mL/s?', datos: [['Caudal', '12,0 L/min']], unidad: 'mL/s',
    analitico: () => (12 * 1000) / 60, segundo: () => rengConvertir(12, 'L', 'mL') / rengConvertir(1, 'min', 's'), metodoSegundo: 'catálogo de unidades de la app',
    pasos: (rengR) => ['Factores de conversión: 1000 mL/L y 1 min/60 s (subtemas 16 y 20).', `= ${rengTx(rengR)} mL/s.`], pistas: ['Pasa los L a mL.', 'Pasa los min a s.', 'Divide para obtener el resultado.'] }),
  ej({ id: 'ej-fu-si-2', titulo: 'Presión atmosférica en el SI', enunciado: 'Un barómetro marca 755 mmHg.', pregunta: '¿Cuánto es en kPa?', datos: [['P', '755 mmHg']], unidad: 'kPa',
    analitico: () => (755 / 760) * 101.325, segundo: () => rengConvertir(755, 'mmHg', 'kPa'), metodoSegundo: 'catálogo de unidades de la app',
    pasos: (rengR) => ['760 mmHg = 101,325 kPa (subtemas 17 y 22).', `P = ${rengTx(rengR)} kPa.`], pistas: ['Plantea el factor.', 'Multiplica.', 'Comprueba que sea cercano a 101 kPa.'] }),
  ej({ id: 'ej-fu-notacion-2', titulo: 'Masa de un átomo', enunciado: 'M(Fe) de la tabla de la app y N_A = 6,022·10²³ mol⁻¹.', pregunta: '¿Cuánto pesa un átomo de hierro, en múltiplos de 10⁻²³ g?', datos: [['M(Fe)', `${rengTx(A('Fe'), 5)} g/mol`]], unidad: '',
    analitico: () => (A('Fe') / 6.022e23) / 1e-23, segundo: () => A('Fe') / 6.022, metodoSegundo: 'cociente de mantisas con la potencia de diez aparte',
    pasos: (rengR) => ['m = M/N_A (subtema 18).', `m = ${rengTx(rengR)}·10⁻²³ g.`], pistas: ['Divide M entre N_A.', 'Separa mantisas y potencias.', 'Escribe en notación científica.'] }),
  ej({ id: 'ej-fu-cifras-2', titulo: 'Decimales de una suma', enunciado: 'Se suman tres masas: 12,1 g + 0,456 g + 3,02 g.', pregunta: '¿Con cuántos decimales debe darse el resultado?', datos: [['Masas', '12,1 g; 0,456 g; 3,02 g']], unidad: '',
    analitico: () => Math.min(1, 3, 2), segundo: () => [1, 3, 2].reduce((rengA, rengB) => (rengB < rengA ? rengB : rengA)), metodoSegundo: 'mínimo de decimales por comparación sucesiva',
    pasos: (rengR) => ['En sumas manda el dato con menos decimales (subtema 19).', `Resultado: 15,6 g (${rengTx(rengR)} decimal).`], pistas: ['Cuenta los decimales de cada dato.', 'Toma el menor.', 'Redondea la suma.'] }),
  ej({ id: 'ej-fu-dimensional-2', titulo: 'Moles a partir de un volumen de líquido', enunciado: 'Se miden 100 mL de agua líquida (1,00 g/mL).', pregunta: '¿Cuántos moles de agua son?', datos: [['V', '100 mL'], ['ρ', '1,00 g/mL']], unidad: 'mol',
    analitico: () => (100 * 1) / M('H2O'), segundo: () => rengLecturasDensidad({ m: 100, V: 100, rhoL: 1 }).rho! * 100 / (2 * A('H') + A('O')), metodoSegundo: 'escena «densidad» y suma de masas atómicas',
    pasos: (rengR) => ['Cadena de factores: mL → g → mol (subtemas 20 y 21).', `n = ${rengTx(rengR)} mol.`], pistas: ['Pasa el volumen a masa.', 'Divide entre la masa molar.', 'Comprueba las unidades.'] }),
  ej({ id: 'ej-fu-densidad-2', titulo: 'Flota o se hunde', enunciado: 'Un bloque de 300 g ocupa 400 mL y se pone en agua (1,00 g/mL).', pregunta: '¿Qué volumen del bloque queda sumergido, en mL?', datos: [['Masa', '300 g'], ['Volumen', '400 mL']], unidad: 'mL',
    analitico: () => 300 / 1, segundo: () => (rengLecturasDensidad({ m: 300, V: 400, rhoL: 1 }).sumergido! / 100) * 400, metodoSegundo: 'escena «densidad» (porcentaje sumergido)',
    pasos: (rengR) => ['ρ = 0,750 g/mL < 1,00: flota (subtema 21).', `Desplaza su propio peso de agua: ${rengTx(rengR)} mL sumergidos (subtema 14).`], pistas: ['Calcula la densidad.', 'Compara con el agua.', 'Agua desplazada = masa del bloque.'] }),
  ej({ id: 'ej-fu-temperatura-2', titulo: 'Presión de un neumático al calentarse', enunciado: 'Un neumático a 280 K tiene 220 kPa; sin cambiar el volumen se calienta a 320 K.', pregunta: '¿Qué presión alcanza, en kPa?', datos: [['P₁', '220 kPa'], ['T₁', '280 K'], ['T₂', '320 K']], unidad: 'kPa',
    analitico: () => (220 * 320) / 280, segundo: () => { const rengV = (1 * 8.314462618 * 280) / 220; return rengLecturasGasIdeal({ n: 1, T: 320, V: rengV, M: 29 }).P! }, metodoSegundo: 'escena «gas-ideal» con el mismo volumen',
    pasos: (rengR) => ['A volumen constante, P/T es constante (subtema 22).', `P₂ = ${rengTx(rengR)} kPa.`], pistas: ['Usa temperaturas absolutas.', 'P₁/T₁ = P₂/T₂.', 'Despeja P₂.'] }),
  ej({ id: 'ej-fu-seguridad-2', titulo: 'Neutralizar un derrame', enunciado: 'Se derraman 50,0 mL de HCl 2,00 mol/L y se neutralizan con bicarbonato: NaHCO₃ + HCl → NaCl + H₂O + CO₂.', pregunta: '¿Qué masa mínima de NaHCO₃ hace falta, en g?', datos: [['HCl', '50,0 mL, 2,00 mol/L']], unidad: 'g',
    analitico: () => 0.05 * 2 * M('NaHCO3'), segundo: () => rengConvertir(50, 'mL', 'L') * 2 * (A('Na') + A('H') + A('C') + 3 * A('O')), metodoSegundo: 'catálogo de unidades y suma de masas atómicas',
    pasos: (rengR) => ['Un derrame ácido se neutraliza con una base débil (subtema 23).', `n = 0,100 mol; m = ${rengTx(rengR)} g.`], pistas: ['Calcula los moles de ácido.', 'Proporción 1:1.', 'Pasa a gramos.'] })
]
