import { RENG_MMHG_ATM, RENG_R_LATM, RENG_R_LKPA, rengK, rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_TOL_CELSIUS, RENG_TOL_GAS, RENG_TOL_KELVIN, rengDatoMasaMolar, rengFuentesGas, rengGas, rengIndiceGas, rengNombreGas } from './b08-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

export interface RengReaccionGaseosa {
  ecuacion: string
  de: string
  a: string
  nuDe: number
  nuA: number
  verbo: string
}

export const RENG_REACCIONES_GASEOSAS: readonly RengReaccionGaseosa[] = [
  { ecuacion: 'N₂ + 3 H₂ → 2 NH₃', de: 'H₂', a: 'NH₃', nuDe: 3, nuA: 2, verbo: 'se forma' },
  { ecuacion: 'N₂ + 3 H₂ → 2 NH₃', de: 'N₂', a: 'NH₃', nuDe: 1, nuA: 2, verbo: 'se forma' },
  { ecuacion: '2 CO + O₂ → 2 CO₂', de: 'O₂', a: 'CO₂', nuDe: 1, nuA: 2, verbo: 'se forma' },
  { ecuacion: '2 CO + O₂ → 2 CO₂', de: 'CO', a: 'O₂', nuDe: 2, nuA: 1, verbo: 'se necesita' },
  { ecuacion: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O(g)', de: 'CH₄', a: 'H₂O(g)', nuDe: 1, nuA: 2, verbo: 'se forma' },
  { ecuacion: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O(g)', de: 'O₂', a: 'CO₂', nuDe: 2, nuA: 1, verbo: 'se forma' }
]

export const RENG_PRACTICAS_B08_S06: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s6-p1',
    subtema: 'n1-b8-s6',
    titulo: 'Presión al calentar un recipiente rígido',
    dificultad: 'basica',
    objetivo: 'Aplicar P₁/T₁ = P₂/T₂ con temperaturas en °C.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley de Gay-Lussac', 'K'),
    idealizado: 'Gas ideal en un recipiente rígido y cerrado.',
    metodo: 'integración numérica (Runge–Kutta 4) de dP/dT = P/T',
    parametros: (rengRng) => ({ P1: rengEntreN1(rengRng, 100, 300, 1), t1: rengEntreN1(rengRng, 5, 35, 1), t2: rengEntreN1(rengRng, 50, 200, 1) }),
    respuesta: (rengD) => (rengD.P1 * rengK(rengD.t2)) / rengK(rengD.t1),
    errores: (rengD) => [
      ['celsius', 'Temperaturas en °C', (rengD.P1 * rengD.t2) / rengD.t1, 'Usaste grados Celsius: la presión es proporcional a la temperatura absoluta. Suma 273,15.'],
      ['invertida', 'Razón de temperaturas al revés', (rengD.P1 * rengK(rengD.t1)) / rengK(rengD.t2), 'Razón al revés: al calentar un recipiente rígido la presión sube.']
    ],
    enunciado: (rengD) => `Un recipiente rígido y cerrado contiene gas a ${rengTx(rengD.P1)} kPa y ${rengTx(rengD.t1)} °C. Se calienta hasta ${rengTx(rengD.t2)} °C.`,
    pregunta: () => '¿Cuál es la nueva presión, en kPa?',
    datos: (rengD) => [['P₁', `${rengTx(rengD.P1)} kPa`], ['t₁', `${rengTx(rengD.t1)} °C`], ['t₂', `${rengTx(rengD.t2)} °C`]],
    pasos: (rengD, rengR) => [`T₁ = ${rengTx(rengK(rengD.t1), 5)} K; T₂ = ${rengTx(rengK(rengD.t2), 5)} K.`, `P₂ = P₁ · T₂ / T₁ = ${rengTx(rengR)} kPa.`],
    pistas: ['El volumen no cambia: ¿qué ley se aplica?', 'Temperaturas en kelvin.', 'P₂ = P₁ · T₂ / T₁.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s6-p2',
    subtema: 'n1-b8-s6',
    titulo: 'Enfriar un recipiente y leer en mmHg',
    dificultad: 'intermedia',
    objetivo: 'Aplicar la ley de Gay-Lussac al enfriar y expresar el resultado en otra unidad de presión.',
    unidad: 'mmHg',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley de Gay-Lussac', 'atm'),
    idealizado: 'Gas ideal en un recipiente rígido.',
    metodo: 'P₁ convertida a mmHg con el catálogo e integración numérica de dP/dT = P/T',
    parametros: (rengRng) => ({ P1: rengEntreN1(rengRng, 1, 3, 0.05), T1: rengEntreN1(rengRng, 320, 420, 1), T2: rengEntreN1(rengRng, 250, 300, 1) }),
    respuesta: (rengD) => ((rengD.P1 * rengD.T2) / rengD.T1) * RENG_MMHG_ATM,
    errores: (rengD) => [
      ['en-atm', 'Resultado en atmósferas', (rengD.P1 * rengD.T2) / rengD.T1, 'Ese valor está en atmósferas; la pregunta lo pide en mmHg (1 atm = 760 mmHg).'],
      ['invertida', 'Razón de temperaturas al revés', ((rengD.P1 * rengD.T1) / rengD.T2) * RENG_MMHG_ATM, 'Razón al revés: al enfriar un recipiente rígido la presión baja.']
    ],
    enunciado: (rengD) => `Un recipiente rígido contiene gas a ${rengTx(rengD.P1)} atm y ${rengTx(rengD.T1)} K. Se enfría hasta ${rengTx(rengD.T2)} K.`,
    pregunta: () => '¿Qué presión marca al final, en mmHg?',
    datos: (rengD) => [['P₁', `${rengTx(rengD.P1)} atm`], ['T₁', `${rengTx(rengD.T1)} K`], ['T₂', `${rengTx(rengD.T2)} K`]],
    pasos: (rengD, rengR) => [`P₂ = P₁ · T₂ / T₁ = ${rengTx((rengD.P1 * rengD.T2) / rengD.T1)} atm.`, `En mmHg: × 760 = ${rengTx(rengR)} mmHg.`],
    pistas: ['Las temperaturas ya están en kelvin.', 'P₂ = P₁ · T₂ / T₁.', 'Convierte al final: 1 atm = 760 mmHg.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s6-p3',
    subtema: 'n1-b8-s6',
    titulo: 'Temperatura a la que se alcanza una presión',
    dificultad: 'avanzada',
    objetivo: 'Despejar la temperatura de la ley de Gay-Lussac para una presión límite y expresarla en °C.',
    unidad: '°C',
    tolerancia: RENG_TOL_CELSIUS,
    fuentes: rengFuentesGas('g92', 'ley de Gay-Lussac', 'K'),
    idealizado: 'Gas ideal en un recipiente rígido.',
    metodo: 'búsqueda por bisección de la temperatura en la que P(T) = P₁·T/T₁ alcanza la presión límite',
    parametros: (rengRng) => {
      const rengP1 = rengEntreN1(rengRng, 100, 250, 1)
      return { P1: rengP1, t1: rengEntreN1(rengRng, 10, 30, 1), Pmax: Math.round(rengP1 * rengEntreN1(rengRng, 1.15, 1.6, 0.01)) }
    },
    valida: (rengD) => rengD.Pmax > rengD.P1 * 1.1,
    respuesta: (rengD) => (rengK(rengD.t1) * rengD.Pmax) / rengD.P1 - 273.15,
    errores: (rengD, rengR) => [
      ['en-kelvin', 'Resultado en kelvin', rengR + 273.15, 'Ese valor está en kelvin; la pregunta pide °C: resta 273,15.'],
      ['celsius', 'Proporción con °C', (rengD.t1 * rengD.Pmax) / rengD.P1, 'Aplicaste la proporción a los grados Celsius. Hazlo en kelvin y convierte al final.']
    ],
    enunciado: (rengD) => `Un recipiente rígido contiene gas a ${rengTx(rengD.P1)} kPa y ${rengTx(rengD.t1)} °C. Su presión no debe superar ${rengTx(rengD.Pmax)} kPa.`,
    pregunta: () => '¿A qué temperatura se alcanza esa presión, en °C?',
    datos: (rengD) => [['P₁', `${rengTx(rengD.P1)} kPa`], ['t₁', `${rengTx(rengD.t1)} °C`], ['Presión límite', `${rengTx(rengD.Pmax)} kPa`]],
    pasos: (rengD, rengR) => [`T₁ = ${rengTx(rengK(rengD.t1), 5)} K.`, `T₂ = T₁ · P₂ / P₁ = ${rengTx(rengR + 273.15, 5)} K.`, `t₂ = ${rengTx(rengR)} °C.`],
    pistas: ['A volumen constante, P/T no cambia.', 'Despeja T₂ = T₁ · P₂ / P₁ en kelvin.', 'Convierte el resultado a °C.']
  })
]

export const RENG_PRACTICAS_B08_S07: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s7-p1',
    subtema: 'n1-b8-s7',
    titulo: 'Volumen al añadir gas',
    dificultad: 'basica',
    objetivo: 'Aplicar V₁/n₁ = V₂/n₂ a presión y temperatura constantes.',
    unidad: 'L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley de Avogadro'),
    idealizado: 'Gas ideal a presión y temperatura constantes.',
    metodo: 'integración numérica (Runge–Kutta 4) de dV/dn = V/n',
    parametros: (rengRng) => {
      const rengN1 = rengEntreN1(rengRng, 0.05, 0.3, 0.005)
      return { V1: rengEntreN1(rengRng, 1, 6, 0.05), n1: rengN1, n2: Math.round((rengN1 * rengEntreN1(rengRng, 1.3, 3, 0.05)) / 0.005) * 0.005 }
    },
    valida: (rengD) => rengD.n2 > rengD.n1 * 1.2,
    respuesta: (rengD) => (rengD.V1 * rengD.n2) / rengD.n1,
    errores: (rengD) => [
      ['invertida', 'Razón de cantidades al revés', (rengD.V1 * rengD.n1) / rengD.n2, 'Razón al revés: con más gas a la misma P y T, el volumen aumenta.'],
      ['solo-anadido', 'Solo el volumen añadido', (rengD.V1 * (rengD.n2 - rengD.n1)) / rengD.n1, 'Calculaste solo el volumen que aporta el gas añadido; la pregunta pide el volumen final total.']
    ],
    enunciado: (rengD) => `Un globo contiene ${rengTx(rengD.n1)} mol de gas y ocupa ${rengTx(rengD.V1)} L. Se añade gas, a la misma presión y temperatura, hasta tener ${rengTx(rengD.n2)} mol.`,
    pregunta: () => '¿Qué volumen ocupa ahora, en L?',
    datos: (rengD) => [['V₁', `${rengTx(rengD.V1)} L`], ['n₁', `${rengTx(rengD.n1)} mol`], ['n₂', `${rengTx(rengD.n2)} mol`]],
    pasos: (rengD, rengR) => ['A P y T constantes: V₁/n₁ = V₂/n₂.', `V₂ = ${rengTx(rengD.V1)} × ${rengTx(rengD.n2)} / ${rengTx(rengD.n1)} = ${rengTx(rengR)} L.`],
    pistas: ['¿Qué pasa con el volumen si hay más moléculas a la misma P y T?', 'V/n se mantiene constante.', 'V₂ = V₁ · n₂ / n₁.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s7-p2',
    subtema: 'n1-b8-s7',
    titulo: 'Volumen al añadir una masa de gas',
    dificultad: 'intermedia',
    objetivo: 'Usar la ley de Avogadro cuando la cantidad de gas se da en gramos.',
    unidad: 'L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley de Avogadro', 'M'),
    idealizado: 'Gas ideal puro a presión y temperatura constantes.',
    metodo: 'moles calculados con la masa molar e integración numérica de dV/dn = V/n',
    parametros: (rengRng) => ({ g: rengIndiceGas(rengRng), m1: rengEntreN1(rengRng, 1, 5, 0.05), madd: rengEntreN1(rengRng, 0.5, 5, 0.05), V1: rengEntreN1(rengRng, 1, 5, 0.05) }),
    respuesta: (rengD) => (rengD.V1 * (rengD.m1 + rengD.madd)) / rengD.m1,
    errores: (rengD) => [
      ['solo-anadido', 'Solo el volumen añadido', (rengD.V1 * rengD.madd) / rengD.m1, 'Calculaste solo el volumen que aporta el gas añadido; suma la masa inicial.'],
      ['invertida', 'Razón al revés', (rengD.V1 * rengD.m1) / (rengD.m1 + rengD.madd), 'Razón al revés: al añadir gas a la misma P y T el volumen debe crecer.']
    ],
    enunciado: (rengD) => `Un recipiente de paredes flexibles contiene ${rengTx(rengD.m1)} g de ${rengNombreGas(rengGas(rengD.g))} y ocupa ${rengTx(rengD.V1)} L. Se añaden ${rengTx(rengD.madd)} g más del mismo gas, a la misma presión y temperatura.`,
    pregunta: () => '¿Qué volumen ocupa al final, en L?',
    datos: (rengD) => [['Masa inicial', `${rengTx(rengD.m1)} g`], ['Masa añadida', `${rengTx(rengD.madd)} g`], ['V₁', `${rengTx(rengD.V1)} L`], rengDatoMasaMolar(rengGas(rengD.g))],
    pasos: (rengD, rengR) => [`n₁ = ${rengTx(rengD.m1)} / ${rengTx(rengGas(rengD.g).M, 4)} mol; n₂ = ${rengTx(rengD.m1 + rengD.madd)} / ${rengTx(rengGas(rengD.g).M, 4)} mol.`, 'Al dividir n₂/n₁ la masa molar se cancela: n₂/n₁ = m₂/m₁.', `V₂ = ${rengTx(rengD.V1)} × ${rengTx(rengD.m1 + rengD.madd)} / ${rengTx(rengD.m1)} = ${rengTx(rengR)} L.`],
    pistas: ['Para el mismo gas, los moles son proporcionales a la masa.', 'La masa final es la inicial más la añadida.', 'V₂ = V₁ · m₂ / m₁.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s7-p3',
    subtema: 'n1-b8-s7',
    titulo: 'Volúmenes de gases que reaccionan',
    dificultad: 'avanzada',
    objetivo: 'Relacionar volúmenes de gases en una reacción a la misma presión y temperatura mediante los coeficientes.',
    unidad: 'L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'volúmenes de gases en reacciones'),
    idealizado: 'Reacción completa entre gases ideales medidos a la misma presión y temperatura.',
    metodo: 'camino por moles: n = PV/(RT) a una P y T auxiliares, estequiometría y vuelta a volumen',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_GASEOSAS.length), V: rengEntreN1(rengRng, 1, 20, 0.1) }),
    respuesta: (rengD) => {
      const rengX = RENG_REACCIONES_GASEOSAS[rengD.r]!
      return (rengD.V * rengX.nuA) / rengX.nuDe
    },
    errores: (rengD) => {
      const rengX = RENG_REACCIONES_GASEOSAS[rengD.r]!
      return [
        ['invertida', 'Coeficientes al revés', (rengD.V * rengX.nuDe) / rengX.nuA, `Pusiste los coeficientes al revés: multiplica por ν(${rengX.a}) / ν(${rengX.de}).`],
        ['igual', 'Mismo volumen', rengD.V, 'Los volúmenes no son iguales: siguen la proporción de los coeficientes de la ecuación ajustada.']
      ]
    },
    enunciado: (rengD) => {
      const rengX = RENG_REACCIONES_GASEOSAS[rengD.r]!
      return `Para la reacción ${rengX.ecuacion}, con todas las especies medidas como gases a la misma presión y temperatura (suficientemente alta para que el agua esté en estado gaseoso), reaccionan por completo ${rengTx(rengD.V)} L de ${rengX.de}.`
    },
    pregunta: (rengD) => {
      const rengX = RENG_REACCIONES_GASEOSAS[rengD.r]!
      return `¿Qué volumen de ${rengX.a} ${rengX.verbo}, en L?`
    },
    datos: (rengD) => {
      const rengX = RENG_REACCIONES_GASEOSAS[rengD.r]!
      return [['Ecuación', rengX.ecuacion], [`V(${rengX.de})`, `${rengTx(rengD.V)} L`]]
    },
    pasos: (rengD, rengR) => {
      const rengX = RENG_REACCIONES_GASEOSAS[rengD.r]!
      return [`A la misma P y T, los volúmenes siguen a los coeficientes: ${rengX.nuDe} de ${rengX.de} por ${rengX.nuA} de ${rengX.a}.`, `V(${rengX.a}) = ${rengTx(rengD.V)} L × ${rengX.nuA}/${rengX.nuDe} = ${rengTx(rengR)} L.`]
    },
    pistas: ['A igual P y T, volumen y moles son proporcionales.', 'Mira los coeficientes de las dos especies.', 'V(buscado) = V(dato) × ν(buscado) / ν(dato).']
  })
]

export const RENG_PRACTICAS_B08_S08: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s8-p1',
    subtema: 'n1-b8-s8',
    titulo: 'Volumen en otras condiciones',
    dificultad: 'basica',
    objetivo: 'Aplicar P₁V₁/T₁ = P₂V₂/T₂ para hallar un volumen.',
    unidad: 'L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley combinada', 'K'),
    idealizado: 'Gas ideal con cantidad fija.',
    metodo: 'dos tramos integrados numéricamente: isotérmico (dV/dP = −V/P) e isobárico (dV/dT = V/T)',
    parametros: (rengRng) => ({ V1: rengEntreN1(rengRng, 1, 5, 0.05), P1: rengEntreN1(rengRng, 90, 110, 1), t1: rengEntreN1(rengRng, 10, 35, 1), P2: rengEntreN1(rengRng, 50, 200, 5), t2: rengEntreN1(rengRng, 5, 90, 1) }),
    valida: (rengD) => Math.abs(rengD.t2 - rengD.t1) >= 10 && Math.abs(rengD.P2 / rengD.P1 - 1) >= 0.15,
    respuesta: (rengD) => (rengD.V1 * rengD.P1 * rengK(rengD.t2)) / (rengD.P2 * rengK(rengD.t1)),
    errores: (rengD) => [
      ['celsius', 'Temperaturas en °C', (rengD.V1 * rengD.P1 * rengD.t2) / (rengD.P2 * rengD.t1), 'Usaste grados Celsius: las temperaturas de la ley combinada van en kelvin.'],
      ['solo-boyle', 'Sin la corrección de temperatura', (rengD.V1 * rengD.P1) / rengD.P2, 'Aplicaste solo la ley de Boyle: también cambió la temperatura, multiplica por T₂/T₁.']
    ],
    enunciado: (rengD) => `Un gas ocupa ${rengTx(rengD.V1)} L a ${rengTx(rengD.P1)} kPa y ${rengTx(rengD.t1)} °C. Se lleva, sin pérdidas, a ${rengTx(rengD.P2)} kPa y ${rengTx(rengD.t2)} °C.`,
    pregunta: () => '¿Qué volumen ocupa al final, en L?',
    datos: (rengD) => [['V₁', `${rengTx(rengD.V1)} L`], ['P₁', `${rengTx(rengD.P1)} kPa`], ['t₁', `${rengTx(rengD.t1)} °C`], ['P₂', `${rengTx(rengD.P2)} kPa`], ['t₂', `${rengTx(rengD.t2)} °C`]],
    pasos: (rengD, rengR) => [`T₁ = ${rengTx(rengK(rengD.t1), 5)} K; T₂ = ${rengTx(rengK(rengD.t2), 5)} K.`, `V₂ = V₁ · (P₁/P₂) · (T₂/T₁) = ${rengTx(rengR)} L.`],
    pistas: ['Cambian a la vez la presión y la temperatura.', 'Usa P₁V₁/T₁ = P₂V₂/T₂ con T en kelvin.', 'V₂ = V₁ · P₁ · T₂ / (P₂ · T₁).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s8-p2',
    subtema: 'n1-b8-s8',
    titulo: 'Presión tras comprimir y calentar',
    dificultad: 'intermedia',
    objetivo: 'Despejar la presión final de la ley combinada cuando cambian volumen y temperatura.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley combinada', 'K'),
    idealizado: 'Gas ideal con cantidad fija.',
    metodo: 'dos tramos integrados numéricamente: isotérmico (dP/dV = −P/V) e isocórico (dP/dT = P/T)',
    parametros: (rengRng) => ({ P1: rengEntreN1(rengRng, 95, 105, 1), V1: rengEntreN1(rengRng, 300, 900, 10), V2: rengEntreN1(rengRng, 100, 600, 10), t1: rengEntreN1(rengRng, 10, 30, 1), t2: rengEntreN1(rengRng, 40, 120, 1) }),
    valida: (rengD) => Math.abs(rengD.V2 / rengD.V1 - 1) >= 0.15,
    respuesta: (rengD) => rengD.P1 * (rengD.V1 / rengD.V2) * (rengK(rengD.t2) / rengK(rengD.t1)),
    errores: (rengD) => [
      ['celsius', 'Temperaturas en °C', rengD.P1 * (rengD.V1 / rengD.V2) * (rengD.t2 / rengD.t1), 'Usaste grados Celsius: pásalos a kelvin antes de dividir.'],
      ['volumenes-invertidos', 'Razón de volúmenes al revés', rengD.P1 * (rengD.V2 / rengD.V1) * (rengK(rengD.t2) / rengK(rengD.t1)), 'Razón de volúmenes al revés: si el volumen baja, la presión sube.']
    ],
    enunciado: (rengD) => `Un gas está a ${rengTx(rengD.P1)} kPa en ${rengTx(rengD.V1)} mL y ${rengTx(rengD.t1)} °C. Se lleva a ${rengTx(rengD.V2)} mL y ${rengTx(rengD.t2)} °C sin pérdidas.`,
    pregunta: () => '¿Cuál es la presión final, en kPa?',
    datos: (rengD) => [['P₁', `${rengTx(rengD.P1)} kPa`], ['V₁', `${rengTx(rengD.V1)} mL`], ['t₁', `${rengTx(rengD.t1)} °C`], ['V₂', `${rengTx(rengD.V2)} mL`], ['t₂', `${rengTx(rengD.t2)} °C`]],
    pasos: (rengD, rengR) => [`T₁ = ${rengTx(rengK(rengD.t1), 5)} K; T₂ = ${rengTx(rengK(rengD.t2), 5)} K.`, `P₂ = P₁ · (V₁/V₂) · (T₂/T₁) = ${rengTx(rengR)} kPa.`],
    pistas: ['Los volúmenes pueden quedar en mL: solo importa su cociente.', 'Temperaturas en kelvin.', 'P₂ = P₁ · V₁ · T₂ / (V₂ · T₁).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s8-p3',
    subtema: 'n1-b8-s8',
    titulo: 'Temperatura final con la ley combinada',
    dificultad: 'avanzada',
    objetivo: 'Despejar la temperatura de la ley combinada y expresarla en °C.',
    unidad: '°C',
    tolerancia: RENG_TOL_CELSIUS,
    fuentes: rengFuentesGas('g92', 'ley combinada', 'K'),
    idealizado: 'Gas ideal con cantidad fija.',
    metodo: 'búsqueda por bisección de la T en la que P₂V₂/T iguala a P₁V₁/T₁',
    parametros: (rengRng) => ({ V1: rengEntreN1(rengRng, 1, 4, 0.05), P1: rengEntreN1(rengRng, 95, 105, 1), t1: rengEntreN1(rengRng, 10, 30, 1), V2: rengEntreN1(rengRng, 1, 4, 0.05), P2: rengEntreN1(rengRng, 100, 250, 5) }),
    valida: (rengD) => {
      const rengT = (rengK(rengD.t1) * rengD.P2 * rengD.V2) / (rengD.P1 * rengD.V1) - 273.15
      return rengT >= 30 && rengT <= 400
    },
    respuesta: (rengD) => (rengK(rengD.t1) * rengD.P2 * rengD.V2) / (rengD.P1 * rengD.V1) - 273.15,
    errores: (rengD, rengR) => [
      ['en-kelvin', 'Resultado en kelvin', rengR + 273.15, 'Ese valor está en kelvin; la pregunta pide °C.'],
      ['celsius', 'Proporción con °C', (rengD.t1 * rengD.P2 * rengD.V2) / (rengD.P1 * rengD.V1), 'Aplicaste la proporción a los grados Celsius. Trabaja en kelvin y convierte al final.']
    ],
    enunciado: (rengD) => `Un gas ocupa ${rengTx(rengD.V1)} L a ${rengTx(rengD.P1)} kPa y ${rengTx(rengD.t1)} °C. Se quiere que ocupe ${rengTx(rengD.V2)} L a ${rengTx(rengD.P2)} kPa, sin cambiar la cantidad.`,
    pregunta: () => '¿A qué temperatura hay que llevarlo, en °C?',
    datos: (rengD) => [['V₁', `${rengTx(rengD.V1)} L`], ['P₁', `${rengTx(rengD.P1)} kPa`], ['t₁', `${rengTx(rengD.t1)} °C`], ['V₂', `${rengTx(rengD.V2)} L`], ['P₂', `${rengTx(rengD.P2)} kPa`]],
    pasos: (rengD, rengR) => [`T₁ = ${rengTx(rengK(rengD.t1), 5)} K.`, `T₂ = T₁ · P₂V₂ / (P₁V₁) = ${rengTx(rengR + 273.15, 5)} K.`, `t₂ = ${rengTx(rengR)} °C.`],
    pistas: ['Despeja T₂ de P₁V₁/T₁ = P₂V₂/T₂.', 'T₁ en kelvin.', 'Convierte T₂ a °C al final.']
  })
]

export const RENG_PRACTICAS_B08_S09: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s9-p1',
    subtema: 'n1-b8-s9',
    titulo: 'Presión de un gas ideal',
    dificultad: 'basica',
    objetivo: 'Calcular la presión con PV = nRT eligiendo R en L·kPa/(mol·K).',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ecuación del gas ideal', 'R', 'K'),
    idealizado: 'Gas ideal.',
    metodo: 'P = N·k_B·T/V en unidades SI con N = n·N_A',
    parametros: (rengRng) => ({ n: rengEntreN1(rengRng, 0.1, 2, 0.01), V: rengEntreN1(rengRng, 1, 20, 0.1), t: rengEntreN1(rengRng, 5, 80, 1) }),
    respuesta: (rengD) => (rengD.n * RENG_R_LKPA * rengK(rengD.t)) / rengD.V,
    errores: (rengD) => [
      ['celsius', 'Temperatura en °C', (rengD.n * RENG_R_LKPA * rengD.t) / rengD.V, 'Usaste la temperatura en °C: la ecuación del gas ideal exige kelvin.'],
      ['r-atm', 'R en L·atm', (rengD.n * RENG_R_LATM * rengK(rengD.t)) / rengD.V, 'Usaste R = 0,08206 L·atm/(mol·K): así la presión sale en atm, no en kPa.']
    ],
    enunciado: (rengD) => `Un recipiente de ${rengTx(rengD.V)} L contiene ${rengTx(rengD.n)} mol de gas a ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Qué presión ejerce, en kPa?',
    datos: (rengD) => [['n', `${rengTx(rengD.n)} mol`], ['V', `${rengTx(rengD.V)} L`], ['t', `${rengTx(rengD.t)} °C`], ['R', '8,314 L·kPa/(mol·K)']],
    pasos: (rengD, rengR) => [`T = ${rengTx(rengK(rengD.t), 5)} K.`, `P = nRT/V = ${rengTx(rengD.n)} × 8,314 × ${rengTx(rengK(rengD.t), 5)} / ${rengTx(rengD.V)} = ${rengTx(rengR)} kPa.`],
    pistas: ['Elige el valor de R que encaja con L y kPa.', 'Temperatura en kelvin.', 'P = nRT / V.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s9-p2',
    subtema: 'n1-b8-s9',
    titulo: 'Cantidad de gas en una muestra',
    dificultad: 'intermedia',
    objetivo: 'Calcular la cantidad de gas con PV = nRT a partir de datos en mmHg, mL y °C.',
    unidad: 'mmol',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ecuación del gas ideal', 'R', 'atm', 'K'),
    idealizado: 'Gas ideal.',
    metodo: 'n = P·V/(N_A·k_B·T) con P en Pa (catálogo de unidades) y V en m³',
    parametros: (rengRng) => ({ P: rengEntreN1(rengRng, 600, 800, 5), V: rengEntreN1(rengRng, 100, 900, 10), t: rengEntreN1(rengRng, 10, 40, 1) }),
    respuesta: (rengD) => (((rengD.P / RENG_MMHG_ATM) * (rengD.V / 1000)) / (RENG_R_LATM * rengK(rengD.t))) * 1000,
    errores: (rengD, rengR) => [
      ['volumen-ml', 'Volumen en mL', rengR * 1000, 'Usaste el volumen en mL con R en L·atm/(mol·K): pásalo a litros.'],
      ['presion-mmhg', 'Presión en mmHg', rengR * RENG_MMHG_ATM, 'Usaste la presión en mmHg con R en L·atm/(mol·K): pásala a atm (÷ 760).'],
      ['celsius', 'Temperatura en °C', (rengR * rengK(rengD.t)) / rengD.t, 'Usaste la temperatura en °C: la ecuación exige kelvin.']
    ],
    enunciado: (rengD) => `Un matraz de ${rengTx(rengD.V)} mL contiene gas a ${rengTx(rengD.P)} mmHg y ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuántos milimoles de gas contiene?',
    datos: (rengD) => [['P', `${rengTx(rengD.P)} mmHg`], ['V', `${rengTx(rengD.V)} mL`], ['t', `${rengTx(rengD.t)} °C`], ['R', '0,08206 L·atm/(mol·K)']],
    pasos: (rengD, rengR) => [`P = ${rengTx(rengD.P / RENG_MMHG_ATM)} atm; V = ${rengTx(rengD.V / 1000)} L; T = ${rengTx(rengK(rengD.t), 5)} K.`, `n = PV/(RT) = ${rengTx(rengR / 1000)} mol = ${rengTx(rengR)} mmol.`],
    pistas: ['Pon todas las magnitudes en las unidades de R.', 'mmHg → atm (÷ 760), mL → L (÷ 1000), °C → K.', 'n = PV/(RT); multiplica por 1000 para tener mmol.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s9-p3',
    subtema: 'n1-b8-s9',
    titulo: 'Temperatura de un gas',
    dificultad: 'avanzada',
    objetivo: 'Despejar la temperatura de PV = nRT y comprobar su orden de magnitud.',
    unidad: 'K',
    tolerancia: RENG_TOL_KELVIN,
    fuentes: rengFuentesGas('g92', 'ecuación del gas ideal', 'R'),
    idealizado: 'Gas ideal.',
    metodo: 'simulación directa: búsqueda por bisección de la T con la que nRT/V reproduce la presión dada',
    parametros: (rengRng) => ({ n: rengEntreN1(rengRng, 0.2, 2, 0.01), V: rengEntreN1(rengRng, 2, 20, 0.1), P: rengEntreN1(rengRng, 1, 10, 0.05) }),
    valida: (rengD) => {
      const rengT = (rengD.P * rengD.V) / (rengD.n * RENG_R_LATM)
      return rengT >= 200 && rengT <= 900
    },
    respuesta: (rengD) => (rengD.P * rengD.V) / (rengD.n * RENG_R_LATM),
    errores: (rengD, rengR) => [
      ['en-celsius', 'Resultado en °C', rengR - 273.15, 'Ese valor está en °C; la pregunta pide kelvin.'],
      ['r-julios', 'R en J/(mol·K) con atm', (rengD.P * rengD.V) / (rengD.n * 8.314), 'Usaste R = 8,314 con atm y L: ese valor de R pide kPa y L (o Pa y m³).']
    ],
    enunciado: (rengD) => `${rengTx(rengD.n)} mol de gas ocupan ${rengTx(rengD.V)} L y ejercen ${rengTx(rengD.P)} atm.`,
    pregunta: () => '¿A qué temperatura está el gas, en K?',
    datos: (rengD) => [['n', `${rengTx(rengD.n)} mol`], ['V', `${rengTx(rengD.V)} L`], ['P', `${rengTx(rengD.P)} atm`], ['R', '0,08206 L·atm/(mol·K)']],
    pasos: (rengD, rengR) => ['De PV = nRT: T = PV/(nR).', `T = ${rengTx(rengD.P)} × ${rengTx(rengD.V)} / (${rengTx(rengD.n)} × 0,08206) = ${rengTx(rengR)} K.`],
    pistas: ['Despeja T de PV = nRT.', 'Las unidades de R deben ser L·atm/(mol·K).', 'T = PV / (nR).']
  })
]

export const RENG_PRACTICAS_B08_S10: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s10-p1',
    subtema: 'n1-b8-s10',
    titulo: 'Densidad de un gas',
    dificultad: 'basica',
    objetivo: 'Calcular la densidad de un gas ideal con ρ = PM/(RT).',
    unidad: 'g/L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'densidad de los gases', 'R', 'K', 'M'),
    idealizado: 'Gas ideal puro.',
    metodo: 'ρ = P·m/(k_B·T) con la masa de una molécula m = M/N_A, en unidades SI',
    parametros: (rengRng) => ({ g: rengIndiceGas(rengRng), P: rengEntreN1(rengRng, 0.5, 3, 0.05), t: rengEntreN1(rengRng, 5, 100, 1) }),
    respuesta: (rengD) => (rengD.P * rengGas(rengD.g).M) / (RENG_R_LATM * rengK(rengD.t)),
    errores: (rengD) => [
      ['celsius', 'Temperatura en °C', (rengD.P * rengGas(rengD.g).M) / (RENG_R_LATM * rengD.t), 'Usaste la temperatura en °C: pásala a kelvin.'],
      ['sin-masa-molar', 'Sin la masa molar', rengD.P / (RENG_R_LATM * rengK(rengD.t)), 'P/(RT) es la concentración en mol/L; multiplica por la masa molar para tener g/L.']
    ],
    enunciado: (rengD) => `Se considera ${rengNombreGas(rengGas(rengD.g))} como gas ideal a ${rengTx(rengD.P)} atm y ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuál es su densidad, en g/L?',
    datos: (rengD) => [['P', `${rengTx(rengD.P)} atm`], ['t', `${rengTx(rengD.t)} °C`], rengDatoMasaMolar(rengGas(rengD.g)), ['R', '0,08206 L·atm/(mol·K)']],
    pasos: (rengD, rengR) => [`T = ${rengTx(rengK(rengD.t), 5)} K.`, `ρ = PM/(RT) = ${rengTx(rengD.P)} × ${rengTx(rengGas(rengD.g).M, 4)} / (0,08206 × ${rengTx(rengK(rengD.t), 5)}) = ${rengTx(rengR)} g/L.`],
    pistas: ['Escribe n = m/M en PV = nRT.', 'ρ = m/V = PM/(RT).', 'T en kelvin y R en L·atm/(mol·K).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s10-p2',
    subtema: 'n1-b8-s10',
    titulo: 'Cuántas veces más denso',
    dificultad: 'intermedia',
    objetivo: 'Comparar densidades de dos gases a la misma presión y temperatura mediante sus masas molares.',
    unidad: '',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'densidad de los gases', 'M'),
    idealizado: 'Dos gases ideales a la misma P y T.',
    metodo: 'densidades absolutas de los dos gases calculadas en SI a una P y T auxiliares y divididas',
    parametros: (rengRng) => ({ a: rengIndiceGas(rengRng), b: rengIndiceGas(rengRng) }),
    valida: (rengD) => rengGas(rengD.a).M / rengGas(rengD.b).M >= 1.3,
    respuesta: (rengD) => rengGas(rengD.a).M / rengGas(rengD.b).M,
    errores: (rengD) => [
      ['invertida', 'Cociente al revés', rengGas(rengD.b).M / rengGas(rengD.a).M, 'Cociente al revés: el gas de mayor masa molar es el más denso.'],
      ['raiz', 'Con raíz cuadrada', Math.sqrt(rengGas(rengD.a).M / rengGas(rengD.b).M), 'Usaste la raíz cuadrada, como en la ley de Graham. La densidad es directamente proporcional a la masa molar.']
    ],
    enunciado: (rengD) => `Se comparan ${rengNombreGas(rengGas(rengD.a))} y ${rengNombreGas(rengGas(rengD.b))}, ambos como gases ideales a la misma presión y temperatura.`,
    pregunta: (rengD) => `¿Cuántas veces más denso es el ${rengGas(rengD.a).nombre} que el ${rengGas(rengD.b).nombre}?`,
    datos: (rengD) => [rengDatoMasaMolar(rengGas(rengD.a)), rengDatoMasaMolar(rengGas(rengD.b))],
    pasos: (rengD, rengR) => ['A la misma P y T: ρ_A/ρ_B = M_A/M_B.', `${rengTx(rengGas(rengD.a).M, 4)} / ${rengTx(rengGas(rengD.b).M, 4)} = ${rengTx(rengR)}.`],
    pistas: ['¿Qué cambia en ρ = PM/(RT) si P y T son iguales?', 'Solo cambia la masa molar.', 'Divide las masas molares.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s10-p3',
    subtema: 'n1-b8-s10',
    titulo: 'Densidad en otras condiciones',
    dificultad: 'avanzada',
    objetivo: 'Recalcular la densidad de un gas al cambiar presión y temperatura.',
    unidad: 'g/L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'densidad de los gases', 'K'),
    idealizado: 'Gas ideal puro.',
    metodo: 'masa molar deducida de la medida inicial y densidad recalculada con ρ = PM/(RT)',
    parametros: (rengRng) => ({ rho1: rengEntreN1(rengRng, 0.5, 3, 0.01), P1: rengEntreN1(rengRng, 95, 105, 1), t1: rengEntreN1(rengRng, 10, 30, 1), P2: rengEntreN1(rengRng, 150, 500, 5), t2: rengEntreN1(rengRng, 40, 150, 1) }),
    respuesta: (rengD) => rengD.rho1 * (rengD.P2 / rengD.P1) * (rengK(rengD.t1) / rengK(rengD.t2)),
    errores: (rengD) => [
      ['celsius', 'Temperaturas en °C', rengD.rho1 * (rengD.P2 / rengD.P1) * (rengD.t1 / rengD.t2), 'Usaste grados Celsius: la densidad es inversamente proporcional a la temperatura absoluta.'],
      ['t-invertida', 'Razón de temperaturas al revés', rengD.rho1 * (rengD.P2 / rengD.P1) * (rengK(rengD.t2) / rengK(rengD.t1)), 'Razón de temperaturas al revés: al calentar, la densidad baja.']
    ],
    enunciado: (rengD) => `Un gas tiene una densidad de ${rengTx(rengD.rho1)} g/L a ${rengTx(rengD.P1)} kPa y ${rengTx(rengD.t1)} °C. Se lleva a ${rengTx(rengD.P2)} kPa y ${rengTx(rengD.t2)} °C.`,
    pregunta: () => '¿Cuál es su nueva densidad, en g/L?',
    datos: (rengD) => [['ρ₁', `${rengTx(rengD.rho1)} g/L`], ['P₁', `${rengTx(rengD.P1)} kPa`], ['t₁', `${rengTx(rengD.t1)} °C`], ['P₂', `${rengTx(rengD.P2)} kPa`], ['t₂', `${rengTx(rengD.t2)} °C`]],
    pasos: (rengD, rengR) => ['ρ = PM/(RT) con M constante: ρ₂ = ρ₁ · (P₂/P₁) · (T₁/T₂).', `T₁ = ${rengTx(rengK(rengD.t1), 5)} K; T₂ = ${rengTx(rengK(rengD.t2), 5)} K.`, `ρ₂ = ${rengTx(rengR)} g/L.`],
    pistas: ['La densidad es proporcional a P e inversamente proporcional a T.', 'Temperaturas en kelvin.', 'ρ₂ = ρ₁ · P₂ · T₁ / (P₁ · T₂).']
  })
]
