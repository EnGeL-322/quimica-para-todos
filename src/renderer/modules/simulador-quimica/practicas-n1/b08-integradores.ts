import { RENG_KPA_ATM, RENG_MMHG_ATM, RENG_R_LKPA, RENG_R_SI, rengGasPorFormula, rengK, rengTx } from '../aprender/n1/gases/constantes'
import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengMasaMolarDe } from '../nucleo/formula'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_TOL_GAS, rengFuentesGas } from './b08-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(8)
const RENG_M_NAHCO3 = rengMasaMolarDe('NaHCO3')
const RENG_HE = rengGasPorFormula('He')
const RENG_AR = rengGasPorFormula('Ar')
const RENG_REFERENCIAS = [rengGasPorFormula('O2'), rengGasPorFormula('N2'), rengGasPorFormula('CH4'), rengGasPorFormula('Ne')] as const

export const RENG_INTEGRADORES_B08: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-i1',
    subtema: RENG_GRUPO,
    subtemas: ['n1-b8-s2', 'n1-b8-s4'],
    titulo: 'Comprimir una jeringa y dar la presión en kPa',
    dificultad: 'basica',
    objetivo: 'Combinar la ley de Boyle con la conversión de mmHg a kPa en un mismo problema.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley de Boyle y unidades de presión', 'atm'),
    idealizado: 'Jeringa sellada comprimida despacio, a temperatura constante.',
    metodo: 'integración RK4 de dP/dV = −P/V desde el volumen inicial con la presión ya convertida a kPa',
    parametros: (rengRng) => ({ P1: rengEntreN1(rengRng, 700, 800, 5), V1: rengEntreN1(rengRng, 20, 60, 1), V2: rengEntreN1(rengRng, 6, 50, 1) }),
    valida: (rengD) => rengD.V2 >= 0.25 * rengD.V1 && rengD.V2 <= 0.85 * rengD.V1,
    respuesta: (rengD) => ((rengD.P1 * rengD.V1) / rengD.V2) * (RENG_KPA_ATM / RENG_MMHG_ATM),
    errores: (rengD) => [
      ['sin-convertir', 'Resultado en mmHg', (rengD.P1 * rengD.V1) / rengD.V2, 'Aplicaste bien Boyle, pero diste el resultado en mmHg. Conviértelo a kPa con 760 mmHg = 101,325 kPa.'],
      ['invertida', 'Razón de volúmenes invertida', ((rengD.P1 * rengD.V2) / rengD.V1) * (RENG_KPA_ATM / RENG_MMHG_ATM), 'Multiplicaste por V₂/V₁: al comprimir, la presión debe subir, así que el factor es V₁/V₂.']
    ],
    enunciado: (rengD) => `Una jeringa sellada contiene aire a ${rengTx(rengD.P1)} mmHg en ${rengTx(rengD.V1)} mL. Se comprime despacio, sin cambiar la temperatura, hasta ${rengTx(rengD.V2)} mL.`,
    pregunta: () => '¿Cuál es la presión final, en kPa?',
    datos: (rengD) => [['Presión inicial', `${rengTx(rengD.P1)} mmHg`], ['Volumen inicial', `${rengTx(rengD.V1)} mL`], ['Volumen final', `${rengTx(rengD.V2)} mL`], ['Equivalencia', '760 mmHg = 101,325 kPa']],
    pasos: (rengD, rengR) => [
      `Boyle: P₂ = P₁ · V₁/V₂ = ${rengTx(rengD.P1)} mmHg × ${rengTx(rengD.V1)}/${rengTx(rengD.V2)} = ${rengTx((rengD.P1 * rengD.V1) / rengD.V2)} mmHg.`,
      `Conversión: ${rengTx((rengD.P1 * rengD.V1) / rengD.V2)} mmHg × 101,325/760 = ${rengTx(rengR)} kPa.`
    ],
    pistas: ['Temperatura y cantidad constantes: usa Boyle.', 'Los volúmenes pueden quedar en mL, pero en la misma unidad.', 'Convierte al final con 760 mmHg = 101,325 kPa.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-i2',
    subtema: RENG_GRUPO,
    subtemas: ['n1-b8-s5', 'n1-b8-s7'],
    titulo: 'Inflar y calentar un globo a la vez',
    dificultad: 'basica',
    objetivo: 'Combinar las leyes de Charles y de Avogadro cuando cambian la cantidad y la temperatura a presión constante.',
    unidad: 'L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'leyes de Charles y de Avogadro', 'K'),
    idealizado: 'Globo flexible que mantiene la presión del gas igual a la exterior.',
    metodo: 'moles y volumen molar: V_m a cada temperatura con R·T/P (P = 101,325 kPa) y V = n·V_m',
    parametros: (rengRng) => ({ V1: rengEntreN1(rengRng, 1, 4, 0.1), n1: rengEntreN1(rengRng, 0.04, 0.16, 0.005), n2: rengEntreN1(rengRng, 0.06, 0.4, 0.005), t1: rengEntreN1(rengRng, 5, 25, 1), t2: rengEntreN1(rengRng, 40, 90, 1) }),
    valida: (rengD) => rengD.n2 / rengD.n1 >= 1.3 && rengD.n2 / rengD.n1 <= 2.5,
    respuesta: (rengD) => ((rengD.V1 * rengD.n2) / rengD.n1) * (rengK(rengD.t2) / rengK(rengD.t1)),
    errores: (rengD) => [
      ['celsius', 'Temperaturas en °C', ((rengD.V1 * rengD.n2) / rengD.n1) * (rengD.t2 / rengD.t1), 'Usaste grados Celsius en el cociente de temperaturas. La proporción de Charles es con temperaturas absolutas (K).'],
      ['solo-charles', 'Olvidar el gas añadido', rengD.V1 * (rengK(rengD.t2) / rengK(rengD.t1)), 'Solo aplicaste el cambio de temperatura. También cambió la cantidad: el volumen crece además en proporción a n₂/n₁.']
    ],
    enunciado: (rengD) => `Un globo flexible contiene ${rengTx(rengD.n1)} mol de gas y ocupa ${rengTx(rengD.V1)} L a ${rengTx(rengD.t1)} °C. Se añade gas hasta tener ${rengTx(rengD.n2)} mol y se calienta a ${rengTx(rengD.t2)} °C, a la misma presión.`,
    pregunta: () => '¿Qué volumen ocupa el globo al final, en L?',
    datos: (rengD) => [['Estado inicial', `${rengTx(rengD.n1)} mol, ${rengTx(rengD.V1)} L, ${rengTx(rengD.t1)} °C`], ['Estado final', `${rengTx(rengD.n2)} mol, ${rengTx(rengD.t2)} °C`], ['Presión', 'constante']],
    pasos: (rengD, rengR) => [
      `Factor de cantidad (Avogadro): n₂/n₁ = ${rengTx(rengD.n2)}/${rengTx(rengD.n1)} = ${rengTx(rengD.n2 / rengD.n1, 4)}.`,
      `Factor de temperatura (Charles): T₂/T₁ = ${rengTx(rengK(rengD.t2), 5)}/${rengTx(rengK(rengD.t1), 5)} = ${rengTx(rengK(rengD.t2) / rengK(rengD.t1), 4)}.`,
      `V₂ = ${rengTx(rengD.V1)} L × ${rengTx(rengD.n2 / rengD.n1, 4)} × ${rengTx(rengK(rengD.t2) / rengK(rengD.t1), 4)} = ${rengTx(rengR)} L.`
    ],
    pistas: ['Cambian dos cosas: la cantidad y la temperatura.', 'Cada cambio aporta su propio factor.', 'Las temperaturas, en kelvin.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-i3',
    subtema: RENG_GRUPO,
    subtemas: ['n1-b8-s9', 'n1-b8-s11'],
    titulo: 'Masa molar de un vapor con datos de laboratorio',
    dificultad: 'intermedia',
    objetivo: 'Usar la ecuación de estado para obtener la masa molar con datos en kPa, mL y °C.',
    unidad: 'g/mol',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'masa molar a partir de la ecuación de estado', 'R', 'K'),
    idealizado: 'El gas del matraz se comporta como gas ideal y está en equilibrio térmico.',
    metodo: 'número de moléculas N = P·V/(k_B·T) en unidades del SI y M = m·N_A/N',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.2, 1.2, 0.01), V: rengEntreN1(rengRng, 150, 500, 10), P: rengEntreN1(rengRng, 90, 105, 0.5), t: rengEntreN1(rengRng, 15, 95, 1) }),
    valida: (rengD) => {
      const rengM = (rengD.m * RENG_R_LKPA * rengK(rengD.t)) / (rengD.P * (rengD.V / 1000))
      return rengM > 15 && rengM < 200
    },
    respuesta: (rengD) => (rengD.m * RENG_R_LKPA * rengK(rengD.t)) / (rengD.P * (rengD.V / 1000)),
    errores: (rengD) => [
      ['mililitros', 'Volumen en mL', (rengD.m * RENG_R_LKPA * rengK(rengD.t)) / (rengD.P * rengD.V), 'Dejaste el volumen en mililitros. Con R = 8,314 L·kPa/(mol·K) el volumen va en litros; el resultado sale mil veces menor.'],
      ['celsius', 'Temperatura en °C', (rengD.m * RENG_R_LKPA * rengD.t) / (rengD.P * (rengD.V / 1000)), 'Usaste la temperatura en grados Celsius. En P·V = n·R·T la temperatura va en kelvin: suma 273,15.']
    ],
    enunciado: (rengD) => `Un matraz de ${rengTx(rengD.V)} mL contiene ${rengTx(rengD.m)} g de un vapor a ${rengTx(rengD.P)} kPa y ${rengTx(rengD.t)} °C (datos didácticos).`,
    pregunta: () => '¿Cuál es la masa molar del vapor, en g/mol?',
    datos: (rengD) => [['Masa', `${rengTx(rengD.m)} g`], ['Volumen', `${rengTx(rengD.V)} mL`], ['Presión', `${rengTx(rengD.P)} kPa`], ['Temperatura', `${rengTx(rengD.t)} °C`]],
    pasos: (rengD, rengR) => [
      `Moles: n = P·V/(R·T) = ${rengTx(rengD.P)} × ${rengTx(rengD.V / 1000)} / (8,314 × ${rengTx(rengK(rengD.t), 5)}) = ${rengTx(rengD.m / rengR, 4)} mol.`,
      `Masa molar: M = m/n = ${rengTx(rengD.m)} g / ${rengTx(rengD.m / rengR, 4)} mol = ${rengTx(rengR)} g/mol.`
    ],
    pistas: ['Primero calcula los moles con P·V = n·R·T.', 'Volumen en litros y temperatura en kelvin.', 'Después, masa molar = masa / moles.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-i4',
    subtema: RENG_GRUPO,
    subtemas: ['n1-b8-s10', 'n1-b8-s12'],
    titulo: 'Densidad de una mezcla de helio y argón',
    dificultad: 'intermedia',
    objetivo: 'Calcular la densidad de una mezcla de gases a partir de su composición en fracción molar.',
    unidad: 'g/L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'densidad de los gases y mezclas', 'R', 'K', 'M'),
    idealizado: 'Mezcla de gases ideales homogénea.',
    metodo: 'suma de las densidades parciales de cada gas calculadas con su presión parcial, ρ_i = p_i·M_i/(R·T)',
    parametros: (rengRng) => ({ x: rengEntreN1(rengRng, 0.2, 0.8, 0.05), P: rengEntreN1(rengRng, 80, 200, 5), t: rengEntreN1(rengRng, 0, 60, 1) }),
    respuesta: (rengD) => (rengD.P * (rengD.x * RENG_HE.M + (1 - rengD.x) * RENG_AR.M)) / (RENG_R_LKPA * rengK(rengD.t)),
    errores: (rengD) => [
      ['solo-argon', 'Solo el gas mayoritario', (rengD.P * RENG_AR.M) / (RENG_R_LKPA * rengK(rengD.t)), 'Usaste solo la masa molar del argón. La mezcla tiene una masa molar media que pondera los dos gases por su fracción molar.'],
      ['media-simple', 'Media simple de masas molares', (rengD.P * ((RENG_HE.M + RENG_AR.M) / 2)) / (RENG_R_LKPA * rengK(rengD.t)), 'Hiciste la media simple de las masas molares. Hay que ponderarlas con las fracciones molares de cada gas.']
    ],
    enunciado: (rengD) => `Una mezcla de helio y argón tiene una fracción molar de helio de ${rengTx(rengD.x)} y está a ${rengTx(rengD.P)} kPa y ${rengTx(rengD.t)} °C. Masas molares de la tabla de la app: He ${rengTx(RENG_HE.M, 4)} g/mol, Ar ${rengTx(RENG_AR.M, 4)} g/mol.`,
    pregunta: () => '¿Cuál es la densidad de la mezcla, en g/L?',
    datos: (rengD) => [['x(He)', rengTx(rengD.x)], ['Presión total', `${rengTx(rengD.P)} kPa`], ['Temperatura', `${rengTx(rengD.t)} °C`], ['M(He) y M(Ar)', `${rengTx(RENG_HE.M, 4)} y ${rengTx(RENG_AR.M, 4)} g/mol`]],
    pasos: (rengD, rengR) => [
      `Masa molar media: M = ${rengTx(rengD.x)} × ${rengTx(RENG_HE.M, 4)} + ${rengTx(1 - rengD.x)} × ${rengTx(RENG_AR.M, 4)} = ${rengTx(rengD.x * RENG_HE.M + (1 - rengD.x) * RENG_AR.M, 4)} g/mol.`,
      `ρ = P·M/(R·T) = ${rengTx(rengD.P)} × ${rengTx(rengD.x * RENG_HE.M + (1 - rengD.x) * RENG_AR.M, 4)} / (8,314 × ${rengTx(rengK(rengD.t), 5)}) = ${rengTx(rengR)} g/L.`
    ],
    pistas: ['Una mezcla se comporta como un gas de masa molar media.', 'Pondera cada masa molar con su fracción molar.', 'Después usa ρ = P·M/(R·T).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-i5',
    subtema: RENG_GRUPO,
    subtemas: ['n1-b8-s7', 'n1-b8-s9', 'n1-b8-s14'],
    titulo: 'Volumen de CO₂ al calentar bicarbonato',
    dificultad: 'avanzada',
    objetivo: 'Encadenar estequiometría, volumen molar y ecuación de estado en una reacción que produce un gas.',
    unidad: 'L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'estequiometría de reacciones con gases', 'R', 'K', 'M'),
    idealizado: 'Descomposición completa; el CO₂ se mide seco, como gas ideal.',
    metodo: 'moles de CO₂ con la estequiometría y volumen con P·V = n·R·T en el SI (m³ y Pa), pasado a litros',
    sinVerificar: ['Masa molar del NaHCO₃ calculada con las masas atómicas de la tabla de la app.'],
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 2, 20, 0.5), t: rengEntreN1(rengRng, 15, 40, 1), P: rengEntreN1(rengRng, 95, 103, 0.5) }),
    respuesta: (rengD) => ((rengD.m / RENG_M_NAHCO3 / 2) * RENG_R_LKPA * rengK(rengD.t)) / rengD.P,
    errores: (rengD) => [
      ['sin-coeficiente', 'Sin el coeficiente 2', ((rengD.m / RENG_M_NAHCO3) * RENG_R_LKPA * rengK(rengD.t)) / rengD.P, 'Olvidaste el coeficiente: por cada 2 mol de NaHCO₃ se forma 1 mol de CO₂, así que los moles de gas son la mitad.'],
      ['volumen-224', 'Usar 22,4 L/mol', (rengD.m / RENG_M_NAHCO3 / 2) * 22.414, 'Usaste 22,4 L/mol, que solo vale a 0 °C y 1 atm. Calcula el volumen con R·T/P en las condiciones del enunciado.']
    ],
    enunciado: (rengD) => `Al calentar ${rengTx(rengD.m)} g de bicarbonato de sodio se descompone por completo: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂. El CO₂ se mide seco a ${rengTx(rengD.t)} °C y ${rengTx(rengD.P)} kPa. Masa molar del NaHCO₃: ${rengTx(RENG_M_NAHCO3, 4)} g/mol (tabla de la app).`,
    pregunta: () => '¿Qué volumen de CO₂ se obtiene, en L?',
    datos: (rengD) => [['Masa de NaHCO₃', `${rengTx(rengD.m)} g`], ['Ecuación', '2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂'], ['Condiciones', `${rengTx(rengD.t)} °C y ${rengTx(rengD.P)} kPa`]],
    pasos: (rengD, rengR) => [
      `Moles de NaHCO₃: ${rengTx(rengD.m)} / ${rengTx(RENG_M_NAHCO3, 4)} = ${rengTx(rengD.m / RENG_M_NAHCO3, 4)} mol; de CO₂, la mitad: ${rengTx(rengD.m / RENG_M_NAHCO3 / 2, 4)} mol.`,
      `V = n·R·T/P = ${rengTx(rengD.m / RENG_M_NAHCO3 / 2, 4)} × 8,314 × ${rengTx(rengK(rengD.t), 5)} / ${rengTx(rengD.P)} = ${rengTx(rengR)} L.`
    ],
    pistas: ['Pasa la masa de bicarbonato a moles.', 'Mira el coeficiente del CO₂ frente al del NaHCO₃.', 'Volumen con V = n·R·T/P en las condiciones dadas.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-i6',
    subtema: RENG_GRUPO,
    subtemas: ['n1-b8-s16', 'n1-b8-s19'],
    titulo: 'Velocidad molecular de un gas identificado por efusión',
    dificultad: 'avanzada',
    objetivo: 'Obtener la masa molar con la ley de Graham y usarla para calcular la velocidad cuadrática media.',
    unidad: 'm/s',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g94', 'ley de Graham y velocidad molecular', 'R', 'M'),
    idealizado: 'Efusión ideal por un orificio diminuto y gas ideal a la temperatura indicada.',
    metodo: 'u_rms del gas de referencia y razón de Graham u_X = u_ref·t_ref/t_X, sin calcular M_X',
    parametros: (rengRng) => ({ g: rengIndice(rengRng, RENG_REFERENCIAS.length), tr: rengEntreN1(rengRng, 30, 80, 1), tx: rengEntreN1(rengRng, 40, 190, 1), T: rengEntreN1(rengRng, 250, 450, 5) }),
    valida: (rengD) => rengD.tx / rengD.tr >= 1.2 && rengD.tx / rengD.tr <= 2.4,
    respuesta: (rengD) => {
      const rengMx = RENG_REFERENCIAS[rengD.g]!.M * (rengD.tx / rengD.tr) ** 2
      return Math.sqrt((3 * RENG_R_SI * rengD.T) / (rengMx / 1000))
    },
    errores: (rengD) => {
      const rengMx = RENG_REFERENCIAS[rengD.g]!.M * (rengD.tx / rengD.tr) ** 2
      return [
        ['sin-cuadrado', 'Masa molar sin elevar al cuadrado', Math.sqrt((3 * RENG_R_SI * rengD.T) / ((RENG_REFERENCIAS[rengD.g]!.M * (rengD.tx / rengD.tr)) / 1000)), 'Al despejar la masa molar con Graham no elevaste al cuadrado la razón de tiempos: M_X = M_ref·(t_X/t_ref)².'],
        ['gramos', 'Masa molar en g/mol', Math.sqrt((3 * RENG_R_SI * rengD.T) / rengMx), 'Dejaste la masa molar en g/mol dentro de la raíz. Con R en J/(mol·K) va en kg/mol; la velocidad sale unas 32 veces menor.']
      ]
    },
    enunciado: (rengD) => `La misma cantidad de un gas X tarda ${rengTx(rengD.tx)} s en efundir por un orificio, y la de ${RENG_REFERENCIAS[rengD.g]!.nombre} (${RENG_REFERENCIAS[rengD.g]!.texto}, ${rengTx(RENG_REFERENCIAS[rengD.g]!.M, 4)} g/mol, tabla de la app) tarda ${rengTx(rengD.tr)} s en las mismas condiciones. Después, el gas X se estudia a ${rengTx(rengD.T)} K.`,
    pregunta: () => '¿Cuál es la velocidad cuadrática media de las moléculas de X a esa temperatura, en m/s?',
    datos: (rengD) => [['Tiempo de X', `${rengTx(rengD.tx)} s`], ['Tiempo de referencia', `${rengTx(rengD.tr)} s`], ['M de referencia', `${rengTx(RENG_REFERENCIAS[rengD.g]!.M, 4)} g/mol`], ['Temperatura', `${rengTx(rengD.T)} K`]],
    pasos: (rengD, rengR) => [
      `Graham con tiempos: M_X = ${rengTx(RENG_REFERENCIAS[rengD.g]!.M, 4)} × (${rengTx(rengD.tx)}/${rengTx(rengD.tr)})² = ${rengTx(RENG_REFERENCIAS[rengD.g]!.M * (rengD.tx / rengD.tr) ** 2, 4)} g/mol.`,
      `u_rms = √(3·R·T/M) = √(3 × 8,314 × ${rengTx(rengD.T)} / ${rengTx((RENG_REFERENCIAS[rengD.g]!.M * (rengD.tx / rengD.tr) ** 2) / 1000, 4)}) = ${rengTx(rengR)} m/s.`
    ],
    pistas: ['Primero la masa molar de X con la ley de Graham.', 'Eleva al cuadrado la razón de tiempos.', 'En u_rms la masa molar va en kg/mol.']
  })
]

