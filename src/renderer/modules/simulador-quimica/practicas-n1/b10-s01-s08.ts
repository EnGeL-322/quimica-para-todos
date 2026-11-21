import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_ADUCTOS_AB, RENG_COMPLEJOS_AB, RENG_HIDROXIDOS_1, RENG_HIDROXIDOS_2, RENG_KW_AB, RENG_KW_SIN_VERIFICAR, RENG_TOL_AB, RENG_TOL_AB_PCT, RENG_TOL_PH, rengCientifico, rengDatoMasaAb, rengFuentesAb, rengLog, rengMmAb, rengRaizCuadratica, rengTextoAb, rengValorCient } from './b10-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const KW = RENG_KW_AB
const KW_SV = [RENG_KW_SIN_VERIFICAR]
const ka = (rengD: Readonly<Record<string, number>>): number => rengValorCient(rengD.km!, rengD.ke!)

export const RENG_PRACTICAS_B10_S01: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s1-p1', subtema: 'n1-b10-s1', titulo: 'OH⁻ de un hidróxido alcalino', dificultad: 'basica',
    objetivo: 'Calcular la concentración de OH⁻ que aporta una base de Arrhenius a partir de su masa.', unidad: 'mmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('4.2', 'las bases de Arrhenius', 'masas'), idealizado: 'Disociación completa.', metodo: 'molaridad del núcleo con litros del catálogo y conversión a mmol/L',
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDROXIDOS_1.length), m: rengEntreN1(rengRng, 0.1, 5, 0.01), v: rengEntreN1(rengRng, 100, 2000, 50) }),
    respuesta: (rengD) => (rengD.m / rengMmAb(RENG_HIDROXIDOS_1[rengD.h]!) / (rengD.v / 1000)) * 1000,
    errores: (rengD, rengR) => [
      ['sin-masa-molar', 'Gramos por litro', (rengD.m / (rengD.v / 1000)) * 1000, 'Dividiste los gramos entre el volumen sin pasarlos antes a moles.'],
      ['dos-oh', 'Dos OH⁻ por fórmula', 2 * rengR, 'Contaste dos OH⁻ por fórmula; este hidróxido libera uno solo.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.m)} g de ${rengTextoAb(RENG_HIDROXIDOS_1[rengD.h]!)}, base fuerte de Arrhenius, en agua hasta ${rengTx(rengD.v)} mL.`,
    pregunta: () => '¿Cuál es la concentración de OH⁻, en mmol/L?',
    datos: (rengD) => [['Base', `${rengTx(rengD.m)} g`], ['Volumen', `${rengTx(rengD.v)} mL`], rengDatoMasaAb(RENG_HIDROXIDOS_1[rengD.h]!)],
    pasos: (rengD, rengR) => [`n = ${rengTx(rengD.m / rengMmAb(RENG_HIDROXIDOS_1[rengD.h]!), 4)} mol; cada fórmula libera un OH⁻.`, `[OH⁻] = n / V = ${rengTx(rengR)} mmol/L.`],
    pistas: ['¿Cuántos OH⁻ libera cada fórmula?', 'Pasa la masa a moles.', 'Divide entre el volumen en litros.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s1-p2', subtema: 'n1-b10-s1', titulo: 'OH⁻ de un hidróxido con dos OH', dificultad: 'intermedia',
    objetivo: 'Calcular [OH⁻] de una base de Arrhenius con dos grupos OH por fórmula a partir de su masa.', unidad: 'mmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('4.2', 'las bases de Arrhenius', 'masas'), idealizado: 'Disociación completa; toda la masa se disuelve.', metodo: 'molaridad del núcleo multiplicada por los OH⁻ de la fórmula',
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDROXIDOS_2.length), m: rengEntreN1(rengRng, 0.05, 2, 0.01), v: rengEntreN1(rengRng, 250, 2000, 50) }),
    respuesta: (rengD) => ((2 * rengD.m) / rengMmAb(RENG_HIDROXIDOS_2[rengD.h]!) / (rengD.v / 1000)) * 1000,
    errores: (rengD, rengR) => [
      ['sin-2', 'Sin los dos OH⁻', rengR / 2, 'Diste la concentración de la base; cada fórmula libera dos OH⁻.'],
      ['sin-masa-molar', 'Sin la masa molar', ((2 * rengD.m) / (rengD.v / 1000)) * 1000, 'Usaste los gramos como si fueran moles; divide antes entre la masa molar.']
    ],
    enunciado: (rengD) => `Se disuelven por completo ${rengTx(rengD.m)} g de ${rengTextoAb(RENG_HIDROXIDOS_2[rengD.h]!)} en agua hasta ${rengTx(rengD.v)} mL.`,
    pregunta: () => '¿Cuál es la concentración de OH⁻, en mmol/L?',
    datos: (rengD) => [['Base', `${rengTx(rengD.m)} g`], ['Volumen', `${rengTx(rengD.v)} mL`], rengDatoMasaAb(RENG_HIDROXIDOS_2[rengD.h]!)],
    pasos: (rengD, rengR) => [`Concentración de la base: ${rengTx(rengR / 2)} mmol/L.`, `Dos OH⁻ por fórmula: [OH⁻] = ${rengTx(rengR)} mmol/L.`],
    pistas: ['Escribe la disociación del hidróxido.', 'Cada fórmula da dos OH⁻.', 'Pasa a mmol/L al final.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s1-p3', subtema: 'n1-b10-s1', titulo: 'pH de una base de Arrhenius pesada', dificultad: 'avanzada',
    objetivo: 'Calcular el pH de una disolución de un hidróxido con dos OH a partir de su masa y del volumen.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('4.2', 'las bases de Arrhenius', 'masas'), idealizado: 'Disociación completa a 25 °C; toda la masa se disuelve.', metodo: '[H₃O⁺] = Kw/[OH⁻] con la molaridad del núcleo', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDROXIDOS_2.length), m: rengEntreN1(rengRng, 0.01, 2, 0.01), v: rengEntreN1(rengRng, 250, 5000, 250) }),
    valida: (rengD) => { const rengOh = (2 * rengD.m) / rengMmAb(RENG_HIDROXIDOS_2[rengD.h]!) / (rengD.v / 1000); return rengOh > 1e-4 && rengOh < 0.2 },
    respuesta: (rengD) => 14 + rengLog((2 * rengD.m) / rengMmAb(RENG_HIDROXIDOS_2[rengD.h]!) / (rengD.v / 1000)),
    errores: (rengD) => {
      const rengOh = (2 * rengD.m) / rengMmAb(RENG_HIDROXIDOS_2[rengD.h]!) / (rengD.v / 1000)
      return [
        ['sin-2', 'Sin los dos OH⁻', 14 + rengLog(rengOh / 2), 'Olvidaste que cada fórmula libera dos OH⁻.'],
        ['poh', 'pOH en lugar de pH', -rengLog(rengOh), 'Diste el pOH; el pH es 14 menos el pOH.']
      ]
    },
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.m)} g de ${rengTextoAb(RENG_HIDROXIDOS_2[rengD.h]!)} en agua hasta ${rengTx(rengD.v)} mL a 25 °C (pKw = 14,00).`,
    pregunta: () => '¿Cuál es el pH de la disolución?',
    datos: (rengD) => [['Base', `${rengTx(rengD.m)} g`], ['Volumen', `${rengTx(rengD.v)} mL`], rengDatoMasaAb(RENG_HIDROXIDOS_2[rengD.h]!)],
    pasos: (rengD, rengR) => [`[OH⁻] = 2 × n / V = ${rengTx((2 * rengD.m) / rengMmAb(RENG_HIDROXIDOS_2[rengD.h]!) / (rengD.v / 1000), 4)} mol/L.`, `pOH = ${rengTx(14 - rengR, 4)}; pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Calcula [OH⁻] con los dos OH.', 'Toma −log para el pOH.', 'pH = 14 − pOH.']
  })
]

export const RENG_PRACTICAS_B10_S02: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s2-p1', subtema: 'n1-b10-s2', titulo: 'pKb de la base conjugada', dificultad: 'basica',
    objetivo: 'Calcular el pKb de una base conjugada a partir del pKa de su ácido con pKa + pKb = pKw.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.1', 'los pares conjugados'), idealizado: '25 °C con pKw = 14,00.', metodo: 'Kb = Kw/Ka con potencias de 10', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ p: rengEntreN1(rengRng, 2, 12, 0.01) }),
    valida: (rengD) => Math.abs(rengD.p - 7) > 0.3,
    respuesta: (rengD) => 14 - rengD.p,
    errores: (rengD) => [
      ['igual', 'Igual que el pKa', rengD.p, 'Diste el pKa; el pKb del conjugado es pKw − pKa.'],
      ['suma', 'Suma', 14 + rengD.p, 'Sumaste pKw y pKa; la relación es pKa + pKb = pKw, así que se resta.']
    ],
    enunciado: (rengD) => `Un ácido débil HA tiene pKa = ${rengTx(rengD.p, 3)} a 25 °C (pKw = 14,00; dato didáctico).`,
    pregunta: () => '¿Cuál es el pKb de su base conjugada A⁻?',
    datos: (rengD) => [['pKa(HA)', rengTx(rengD.p, 3)], ['pKw', '14,00']],
    pasos: (rengD, rengR) => ['En un par conjugado, Ka·Kb = Kw, es decir, pKa + pKb = pKw.', `pKb = 14,00 − ${rengTx(rengD.p, 3)} = ${rengTx(rengR, 3)}.`],
    pistas: ['HA y A⁻ forman un par conjugado.', 'Ka · Kb = Kw.', 'Resta el pKa de 14,00.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s2-p2', subtema: 'n1-b10-s2', titulo: 'pKb a partir de Ka', dificultad: 'intermedia',
    objetivo: 'Calcular el pKb de la base conjugada cuando el dato es la Ka del ácido.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.1', 'los pares conjugados'), idealizado: '25 °C con Kw = 1,0·10⁻¹⁴.', metodo: 'Kb = Kw/Ka y logaritmo directo', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 2, 11, 1) }),
    respuesta: (rengD) => 14 + rengLog(ka(rengD)),
    errores: (rengD) => [
      ['pka', 'El pKa', -rengLog(ka(rengD)), 'Diste el pKa del ácido; el pKb del conjugado es 14 − pKa.'],
      ['multiplica', 'Ka por Kw', -rengLog(KW * ka(rengD)), 'Multiplicaste Ka por Kw; Kb es Kw dividido entre Ka.']
    ],
    enunciado: (rengD) => `Un ácido débil tiene Ka = ${rengCientifico(rengD.km, rengD.ke)} a 25 °C (dato didáctico). Kw = 1,0·10⁻¹⁴.`,
    pregunta: () => '¿Cuál es el pKb de su base conjugada?',
    datos: (rengD) => [['Ka', rengCientifico(rengD.km, rengD.ke)], ['Kw', '1,0·10⁻¹⁴']],
    pasos: (rengD, rengR) => [`pKa = −log Ka = ${rengTx(-rengLog(ka(rengD)), 4)}.`, `pKb = 14 − pKa = ${rengTx(rengR, 4)}.`],
    pistas: ['Pasa Ka a pKa.', 'Ka · Kb = Kw.', 'pKb = 14 − pKa.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s2-p3', subtema: 'n1-b10-s2', titulo: 'Forma básica de un par conjugado', dificultad: 'avanzada',
    objetivo: 'Calcular qué porcentaje de un par ácido-base conjugado está en su forma básica a un pH dado.', unidad: '%', tolerancia: RENG_TOL_AB_PCT,
    fuentes: rengFuentesAb('14.1', 'los pares conjugados'), idealizado: 'Disolución ideal a 25 °C.', metodo: 'razón [A⁻]/[HA] = 10^(pH − pKa) convertida a fracción',
    parametros: (rengRng) => ({ p: rengEntreN1(rengRng, 3, 10, 0.01), h: rengEntreN1(rengRng, 1, 13, 0.01) }),
    valida: (rengD) => Math.abs(rengD.h - rengD.p) > 0.3 && Math.abs(rengD.h - rengD.p) < 1.8,
    respuesta: (rengD) => 100 / (1 + 10 ** (rengD.p - rengD.h)),
    errores: (rengD) => [
      ['acida', 'Forma ácida', 100 / (1 + 10 ** (rengD.h - rengD.p)), 'Calculaste el porcentaje en forma ácida; la pregunta pide la forma básica A⁻.'],
      ['mitad', 'La mitad', 50, 'Diste un 50 %; eso solo ocurre cuando el pH es igual al pKa.']
    ],
    enunciado: (rengD) => `Un par ácido-base HA/A⁻ tiene pKa = ${rengTx(rengD.p, 3)} (dato didáctico). La disolución tiene pH ${rengTx(rengD.h, 3)}.`,
    pregunta: () => '¿Qué porcentaje del par está en forma básica A⁻?',
    datos: (rengD) => [['pKa', rengTx(rengD.p, 3)], ['pH', rengTx(rengD.h, 3)]],
    pasos: (rengD, rengR) => [`[A⁻]/[HA] = 10^(pH − pKa) = ${rengTx(10 ** (rengD.h - rengD.p), 3)}.`, `Fracción básica = razón/(1 + razón) = ${rengTx(rengR)} %.`],
    pistas: ['Usa pH = pKa + log([A⁻]/[HA]).', 'Calcula la razón entre formas.', 'Pásala a porcentaje del total.']
  })
]

export const RENG_PRACTICAS_B10_S03: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s3-p1', subtema: 'n1-b10-s3', titulo: 'Masa de un aducto de Lewis', dificultad: 'basica',
    objetivo: 'Calcular la masa de aducto que forman una base y un ácido de Lewis con la base como limitante.', unidad: 'g', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('15.2', 'los aductos de Lewis', 'masas'), idealizado: 'Reacción completa 1 : 1 con el ácido en exceso.', metodo: 'conservación de la masa: base más el ácido que reacciona',
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_ADUCTOS_AB.length), m: rengEntreN1(rengRng, 0.5, 30, 0.1) }),
    respuesta: (rengD) => { const rengA = RENG_ADUCTOS_AB[rengD.a]!; return (rengD.m / rengMmAb(rengA.base)) * (rengMmAb(rengA.base) + rengMmAb(rengA.acido)) },
    errores: (rengD) => {
      const rengA = RENG_ADUCTOS_AB[rengD.a]!
      return [
        ['solo-base', 'Solo la base', rengD.m, 'Diste la masa de la base; el aducto incluye también el ácido de Lewis unido.'],
        ['solo-acido', 'Solo el ácido', (rengD.m / rengMmAb(rengA.base)) * rengMmAb(rengA.acido), 'Diste la masa del ácido que reacciona; el aducto contiene base y ácido.']
      ]
    },
    enunciado: (rengD) => `La base de Lewis ${rengTextoAb(RENG_ADUCTOS_AB[rengD.a]!.base)} cede su par de electrones al ácido de Lewis ${rengTextoAb(RENG_ADUCTOS_AB[rengD.a]!.acido)} y forman un aducto 1 : 1. Reaccionan ${rengTx(rengD.m)} g de base con ácido en exceso.`,
    pregunta: () => '¿Qué masa de aducto se forma, en g?',
    datos: (rengD) => [['Base', `${rengTx(rengD.m)} g`], rengDatoMasaAb(RENG_ADUCTOS_AB[rengD.a]!.base), rengDatoMasaAb(RENG_ADUCTOS_AB[rengD.a]!.acido)],
    pasos: (rengD, rengR) => [`n(base) = ${rengTx(rengD.m / rengMmAb(RENG_ADUCTOS_AB[rengD.a]!.base), 4)} mol = n(aducto).`, `m = n × (M_base + M_ácido) = ${rengTx(rengR)} g.`],
    pistas: ['¿Quién cede el par y quién lo acepta?', 'La razón es 1 : 1.', 'Suma las dos masas molares.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s3-p2', subtema: 'n1-b10-s3', titulo: 'Ligandos para un complejo', dificultad: 'intermedia',
    objetivo: 'Calcular la masa de NH₃ (base de Lewis) que necesita un catión metálico (ácido de Lewis) para formar su complejo.', unidad: 'g', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('15.2', 'los complejos metálicos', 'masas'), idealizado: 'Formación completa del complejo con el número de coordinación indicado.', metodo: 'búsqueda por bisección de la masa que da k pares por catión',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_COMPLEJOS_AB.length), n: rengEntreN1(rengRng, 0.01, 0.5, 0.005) }),
    respuesta: (rengD) => rengD.n * RENG_COMPLEJOS_AB[rengD.c]!.k * rengMmAb('NH3'),
    errores: (rengD) => [
      ['sin-k', 'Un NH₃ por catión', rengD.n * rengMmAb('NH3'), 'Pusiste un solo NH₃ por catión; cada uno acepta tantos pares como su número de coordinación.'],
      ['divide', 'Dividir entre k', (rengD.n / RENG_COMPLEJOS_AB[rengD.c]!.k) * rengMmAb('NH3'), 'Dividiste entre el número de ligandos; hay que multiplicar.']
    ],
    enunciado: (rengD) => `Cada ion ${RENG_COMPLEJOS_AB[rengD.c]!.ion} acepta ${RENG_COMPLEJOS_AB[rengD.c]!.k} pares de electrones de ${RENG_COMPLEJOS_AB[rengD.c]!.k} moléculas de NH₃. Hay ${rengTx(rengD.n)} mol de ${RENG_COMPLEJOS_AB[rengD.c]!.ion}.`,
    pregunta: () => '¿Qué masa mínima de NH₃ se necesita para formar el complejo, en g?',
    datos: (rengD) => [['Catión', `${rengTx(rengD.n)} mol`], ['NH₃ por catión', String(RENG_COMPLEJOS_AB[rengD.c]!.k)], rengDatoMasaAb('NH3')],
    pasos: (rengD, rengR) => [`n(NH₃) = ${rengTx(rengD.n)} × ${RENG_COMPLEJOS_AB[rengD.c]!.k} = ${rengTx(rengD.n * RENG_COMPLEJOS_AB[rengD.c]!.k)} mol.`, `m = ${rengTx(rengR)} g.`],
    pistas: ['¿Cuántos pares acepta cada catión?', 'Multiplica los moles de catión.', 'Pasa los moles de NH₃ a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s3-p3', subtema: 'n1-b10-s3', titulo: 'Volumen de amoníaco para complejar', dificultad: 'avanzada',
    objetivo: 'Calcular el volumen de una disolución de NH₃ que aporta los pares de electrones para complejar un catión.', unidad: 'mL', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('15.2', 'los complejos metálicos'), idealizado: 'Formación completa; el NH₃ libre sobrante no se considera.', metodo: 'milimoles de pares necesarios divididos entre la concentración, con litros del catálogo',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_COMPLEJOS_AB.length), n: rengEntreN1(rengRng, 0.5, 20, 0.1), cn: rengEntreN1(rengRng, 0.1, 6, 0.05) }),
    respuesta: (rengD) => (rengD.n * RENG_COMPLEJOS_AB[rengD.c]!.k) / rengD.cn,
    errores: (rengD) => [
      ['sin-k', 'Sin el número de coordinación', rengD.n / rengD.cn, 'Calculaste un NH₃ por catión; hacen falta tantos como el número de coordinación.'],
      ['divide', 'Dividir entre k', rengD.n / RENG_COMPLEJOS_AB[rengD.c]!.k / rengD.cn, 'Dividiste entre el número de ligandos; cada catión necesita k moléculas de NH₃.']
    ],
    enunciado: (rengD) => `Se quieren complejar ${rengTx(rengD.n)} mmol de ${RENG_COMPLEJOS_AB[rengD.c]!.ion} (número de coordinación ${RENG_COMPLEJOS_AB[rengD.c]!.k} con NH₃) usando una disolución de NH₃ ${rengTx(rengD.cn)} mol/L.`,
    pregunta: () => '¿Qué volumen mínimo de disolución de NH₃ se necesita, en mL?',
    datos: (rengD) => [['Catión', `${rengTx(rengD.n)} mmol`], ['Coordinación', String(RENG_COMPLEJOS_AB[rengD.c]!.k)], ['c(NH₃)', `${rengTx(rengD.cn)} mol/L`]],
    pasos: (rengD, rengR) => [`NH₃ necesario: ${rengTx(rengD.n * RENG_COMPLEJOS_AB[rengD.c]!.k)} mmol.`, `V = n / c = ${rengTx(rengR)} mL.`],
    pistas: ['Cuenta los pares que necesita cada catión.', 'Calcula los mmol de NH₃.', 'mmol entre mol/L da mL.']
  })
]

export const RENG_PRACTICAS_B10_S04: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s4-p1', subtema: 'n1-b10-s4', titulo: 'pH de un ácido fuerte', dificultad: 'basica',
    objetivo: 'Calcular el pH de un ácido fuerte monoprótico a partir de su concentración.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'los ácidos fuertes'), idealizado: 'Ionización completa; concentraciones como actividades.', metodo: 'balance de carga del núcleo con Ka muy grande y Kw = 1,0·10⁻¹⁴',
    parametros: (rengRng) => ({ cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 1, 4, 1) }),
    respuesta: (rengD) => -rengLog(rengValorCient(rengD.cm, rengD.ce)),
    errores: (rengD) => [
      ['ln', 'Logaritmo natural', -Math.log(rengValorCient(rengD.cm, rengD.ce)), 'Usaste el logaritmo natural; el pH se define con log₁₀.'],
      ['base', 'Como si fuera una base', 14 + rengLog(rengValorCient(rengD.cm, rengD.ce)), 'Calculaste el pH como si fuera una base; un ácido da [H₃O⁺] = c.']
    ],
    enunciado: (rengD) => `Una disolución de HCl, ácido fuerte, tiene una concentración de ${rengCientifico(rengD.cm, rengD.ce)} mol/L.`,
    pregunta: () => '¿Cuál es su pH?',
    datos: (rengD) => [['c(HCl)', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`], ['Tipo', 'ácido fuerte']],
    pasos: (rengD, rengR) => ['Ionización completa: [H₃O⁺] = c.', `pH = −log c = ${rengTx(rengR, 4)}.`],
    pistas: ['¿Se ioniza por completo?', '[H₃O⁺] es la concentración del ácido.', 'pH = −log₁₀ [H₃O⁺].']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s4-p2', subtema: 'n1-b10-s4', titulo: 'pH de un ácido fuerte diluido', dificultad: 'intermedia',
    objetivo: 'Calcular el pH de un ácido fuerte después de diluirlo.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'los ácidos fuertes'), idealizado: 'Enrase exacto; ionización completa.', metodo: 'función de dilución del núcleo y logaritmo',
    parametros: (rengRng) => ({ c1: rengEntreN1(rengRng, 0.01, 1, 0.01), v1: rengEntreN1(rengRng, 1, 50, 0.5), f: rengIndice(rengRng, 6) }),
    respuesta: (rengD) => -rengLog(rengD.c1 / [2, 5, 10, 20, 50, 100][rengD.f]!),
    errores: (rengD) => {
      const rengF = [2, 5, 10, 20, 50, 100][rengD.f]!
      return [
        ['sin-diluir', 'Sin diluir', -rengLog(rengD.c1), 'Usaste la concentración inicial; al diluir, la concentración baja.'],
        ['suma-factor', 'Sumar el factor al pH', -rengLog(rengD.c1) + rengF, 'Sumaste el factor de dilución al pH; el pH solo sube log₁₀ del factor.']
      ]
    },
    enunciado: (rengD) => `Se toman ${rengTx(rengD.v1)} mL de HNO₃ ${rengTx(rengD.c1)} mol/L y se diluyen con agua hasta ${rengTx(rengD.v1 * [2, 5, 10, 20, 50, 100][rengD.f]!)} mL.`,
    pregunta: () => '¿Cuál es el pH de la disolución diluida?',
    datos: (rengD) => [['HNO₃', `${rengTx(rengD.v1)} mL, ${rengTx(rengD.c1)} mol/L`], ['Volumen final', `${rengTx(rengD.v1 * [2, 5, 10, 20, 50, 100][rengD.f]!)} mL`]],
    pasos: (rengD, rengR) => [`c₂ = c₁·V₁/V₂ = ${rengTx(10 ** -rengR, 4)} mol/L.`, `pH = −log c₂ = ${rengTx(rengR, 4)}.`],
    pistas: ['Calcula la concentración tras diluir.', 'V₂ es el volumen final.', 'Toma −log₁₀ del resultado.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s4-p3', subtema: 'n1-b10-s4', titulo: 'pH de una mezcla de dos ácidos fuertes', dificultad: 'avanzada',
    objetivo: 'Calcular el pH al mezclar dos disoluciones de ácidos fuertes con volúmenes aditivos.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'los ácidos fuertes'), idealizado: 'Volúmenes aditivos; ionización completa.', metodo: 'cada ácido diluido al volumen total con la función del núcleo y suma de [H₃O⁺]',
    parametros: (rengRng) => ({ c1: rengEntreN1(rengRng, 0.001, 0.5, 0.001), v1: rengEntreN1(rengRng, 10, 500, 10), c2: rengEntreN1(rengRng, 0.001, 0.5, 0.001), v2: rengEntreN1(rengRng, 10, 500, 10) }),
    respuesta: (rengD) => -rengLog((rengD.c1 * rengD.v1 + rengD.c2 * rengD.v2) / (rengD.v1 + rengD.v2)),
    errores: (rengD) => [
      ['media', 'Media simple', -rengLog((rengD.c1 + rengD.c2) / 2), 'Hiciste la media simple de las concentraciones; cada disolución pesa según su volumen.'],
      ['suma', 'Suma de concentraciones', -rengLog(rengD.c1 + rengD.c2), 'Sumaste las concentraciones; hay que sumar los moles y dividir entre el volumen total.']
    ],
    enunciado: (rengD) => `Se mezclan ${rengTx(rengD.v1)} mL de HCl ${rengTx(rengD.c1)} mol/L con ${rengTx(rengD.v2)} mL de HNO₃ ${rengTx(rengD.c2)} mol/L (volúmenes aditivos).`,
    pregunta: () => '¿Cuál es el pH de la mezcla?',
    datos: (rengD) => [['HCl', `${rengTx(rengD.v1)} mL, ${rengTx(rengD.c1)} mol/L`], ['HNO₃', `${rengTx(rengD.v2)} mL, ${rengTx(rengD.c2)} mol/L`]],
    pasos: (rengD, rengR) => [`Moles de H₃O⁺: ${rengTx((rengD.c1 * rengD.v1 + rengD.c2 * rengD.v2) / 1000, 4)} mol en ${rengTx(rengD.v1 + rengD.v2)} mL.`, `pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Los dos ácidos aportan H₃O⁺.', 'Suma los moles y los volúmenes.', 'Toma −log de la concentración total.']
  })
]

export const RENG_PRACTICAS_B10_S05: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s5-p1', subtema: 'n1-b10-s5', titulo: 'pH de un ácido débil', dificultad: 'basica',
    objetivo: 'Calcular el pH de un ácido débil con su Ka y la tabla ICE.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'los ácidos débiles'), idealizado: 'Ácido monoprótico; se desprecian los H₃O⁺ del agua.', metodo: 'balance de carga del núcleo con Kw = 1,0·10⁻¹⁴',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.01, 1, 0.01), km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 4, 7, 1) }),
    respuesta: (rengD) => -rengLog(rengRaizCuadratica(ka(rengD), rengD.c)),
    errores: (rengD) => [
      ['fuerte', 'Como ácido fuerte', -rengLog(rengD.c), 'Lo trataste como ácido fuerte; un ácido débil solo se ioniza en parte.'],
      ['sin-raiz', 'Sin la raíz', -rengLog(ka(rengD) * rengD.c), 'Olvidaste la raíz cuadrada: x² ≈ Ka·C.']
    ],
    enunciado: (rengD) => `Un ácido débil HA tiene Ka = ${rengCientifico(rengD.km, rengD.ke)} (dato didáctico) y concentración ${rengTx(rengD.c)} mol/L.`,
    pregunta: () => '¿Cuál es su pH?',
    datos: (rengD) => [['c(HA)', `${rengTx(rengD.c)} mol/L`], ['Ka', rengCientifico(rengD.km, rengD.ke)]],
    pasos: (rengD, rengR) => ['Ka = x²/(C − x) con x = [H₃O⁺].', `x = ${rengTx(10 ** -rengR)} mol/L; pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Escribe la tabla ICE.', 'Ka = x²/(C − x).', 'Resuelve x y toma −log.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s5-p2', subtema: 'n1-b10-s5', titulo: 'Porcentaje ionizado de un ácido débil', dificultad: 'intermedia',
    objetivo: 'Calcular el porcentaje de ionización de un ácido débil.', unidad: '%', tolerancia: RENG_TOL_AB_PCT,
    fuentes: rengFuentesAb('14.3', 'la ionización de los ácidos débiles'), idealizado: 'Ácido monoprótico; agua despreciable.', metodo: 'fracción Ka/(Ka + [H₃O⁺]) con el balance de carga del núcleo',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.001, 0.5, 0.001), km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 3, 6, 1) }),
    valida: (rengD) => rengRaizCuadratica(ka(rengD), rengD.c) / rengD.c > 0.004,
    respuesta: (rengD) => (rengRaizCuadratica(ka(rengD), rengD.c) / rengD.c) * 100,
    errores: (rengD) => [
      ['h-por-100', '[H₃O⁺] por 100', rengRaizCuadratica(ka(rengD), rengD.c) * 100, 'Multiplicaste [H₃O⁺] por 100 sin dividir entre la concentración inicial.'],
      ['ka-entre-c', 'Ka entre C', (ka(rengD) / rengD.c) * 100, 'Dividiste Ka entre C; la fracción ionizada es x/C, con x de la tabla ICE.']
    ],
    enunciado: (rengD) => `Un ácido débil HA con Ka = ${rengCientifico(rengD.km, rengD.ke)} (didáctico) está a ${rengTx(rengD.c)} mol/L.`,
    pregunta: () => '¿Qué porcentaje del ácido está ionizado?',
    datos: (rengD) => [['c(HA)', `${rengTx(rengD.c)} mol/L`], ['Ka', rengCientifico(rengD.km, rengD.ke)]],
    pasos: (rengD, rengR) => [`x = ${rengTx(rengRaizCuadratica(ka(rengD), rengD.c))} mol/L (cuadrática).`, `Ionizado: x/C × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Calcula x con la tabla ICE.', 'Divide x entre la concentración inicial.', 'Multiplica por 100.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s5-p3', subtema: 'n1-b10-s5', titulo: 'Ácido débil sin aproximación', dificultad: 'avanzada',
    objetivo: 'Calcular el pH de un ácido débil cuando la aproximación del 5 % no es válida.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'los ácidos débiles'), idealizado: 'Ácido monoprótico; agua despreciable.', metodo: 'balance de carga del núcleo con Kw = 1,0·10⁻¹⁴',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.001, 0.05, 0.0005), km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 2, 3, 1) }),
    valida: (rengD) => rengRaizCuadratica(ka(rengD), rengD.c) / rengD.c > 0.55,
    respuesta: (rengD) => -rengLog(rengRaizCuadratica(ka(rengD), rengD.c)),
    errores: (rengD) => [
      ['aproximacion', 'Aproximación √(Ka·C)', -rengLog(Math.sqrt(ka(rengD) * rengD.c)), 'Usaste x ≈ √(Ka·C), pero x supera el 5 % de C: hay que resolver la cuadrática.'],
      ['sin-raiz', 'Sin la raíz', -rengLog(ka(rengD) * rengD.c), 'Olvidaste la raíz cuadrada y además la cuadrática: x no es Ka·C.']
    ],
    enunciado: (rengD) => `Un ácido HA relativamente fuerte para ser débil tiene Ka = ${rengCientifico(rengD.km, rengD.ke)} (didáctico) y está a ${rengTx(rengD.c, 3)} mol/L.`,
    pregunta: () => '¿Cuál es su pH?',
    datos: (rengD) => [['c(HA)', `${rengTx(rengD.c, 3)} mol/L`], ['Ka', rengCientifico(rengD.km, rengD.ke)]],
    pasos: (rengD, rengR) => [`x/C con √(Ka·C) daría más del 5 %: se resuelve x² + Ka·x − Ka·C = 0.`, `x = ${rengTx(10 ** -rengR)} mol/L; pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Comprueba la regla del 5 %.', 'Si no se cumple, resuelve la cuadrática.', 'Toma −log de x.']
  })
]

export const RENG_PRACTICAS_B10_S06: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s6-p1', subtema: 'n1-b10-s6', titulo: 'pH de una base fuerte', dificultad: 'basica',
    objetivo: 'Calcular el pH de una base fuerte con un OH por fórmula a partir de su concentración.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las bases fuertes'), idealizado: 'Disociación completa a 25 °C.', metodo: '[H₃O⁺] = Kw/[OH⁻] y logaritmo', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 1, 4, 1) }),
    respuesta: (rengD) => 14 + rengLog(rengValorCient(rengD.cm, rengD.ce)),
    errores: (rengD) => [
      ['poh', 'pOH en lugar de pH', -rengLog(rengValorCient(rengD.cm, rengD.ce)), 'Diste el pOH; el pH es 14 menos el pOH.'],
      ['suma', 'Suma en lugar de resta', 14 - rengLog(rengValorCient(rengD.cm, rengD.ce)), 'Sumaste el pOH a 14; hay que restarlo.']
    ],
    enunciado: (rengD) => `Una disolución de NaOH, base fuerte, es ${rengCientifico(rengD.cm, rengD.ce)} mol/L a 25 °C (pKw = 14,00).`,
    pregunta: () => '¿Cuál es su pH?',
    datos: (rengD) => [['c(NaOH)', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`], ['pKw', '14,00']],
    pasos: (rengD, rengR) => [`pOH = −log c = ${rengTx(14 - rengR, 4)}.`, `pH = 14,00 − pOH = ${rengTx(rengR, 4)}.`],
    pistas: ['Calcula primero el pOH.', 'pH + pOH = 14,00.', 'Despeja el pH.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s6-p2', subtema: 'n1-b10-s6', titulo: 'pH de un hidróxido del grupo 2', dificultad: 'intermedia',
    objetivo: 'Calcular el pH de un hidróxido con dos OH por fórmula.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las bases fuertes'), idealizado: 'Disociación completa a 25 °C.', metodo: '[H₃O⁺] = Kw/(2c) y logaritmo', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDROXIDOS_2.length), cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 2, 4, 1) }),
    respuesta: (rengD) => 14 + rengLog(2 * rengValorCient(rengD.cm, rengD.ce)),
    errores: (rengD) => [
      ['sin-2', 'Sin los dos OH⁻', 14 + rengLog(rengValorCient(rengD.cm, rengD.ce)), 'Olvidaste que cada fórmula libera dos OH⁻.'],
      ['poh', 'pOH', -rengLog(2 * rengValorCient(rengD.cm, rengD.ce)), 'Diste el pOH; el pH es 14 menos el pOH.']
    ],
    enunciado: (rengD) => `Una disolución de ${rengTextoAb(RENG_HIDROXIDOS_2[rengD.h]!)}, base fuerte, es ${rengCientifico(rengD.cm, rengD.ce)} mol/L a 25 °C (pKw = 14,00).`,
    pregunta: () => '¿Cuál es su pH?',
    datos: (rengD) => [['Base', rengTextoAb(RENG_HIDROXIDOS_2[rengD.h]!)], ['c', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`]],
    pasos: (rengD, rengR) => [`[OH⁻] = 2c = ${rengTx(2 * rengValorCient(rengD.cm, rengD.ce))} mol/L.`, `pH = 14 + log[OH⁻] = ${rengTx(rengR, 4)}.`],
    pistas: ['¿Cuántos OH⁻ da cada fórmula?', 'Calcula el pOH.', 'Resta de 14.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s6-p3', subtema: 'n1-b10-s6', titulo: 'pH a partir de la masa de base', dificultad: 'avanzada',
    objetivo: 'Calcular el pH de una disolución de hidróxido alcalino a partir de la masa pesada y del volumen.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las bases fuertes', 'masas'), idealizado: 'Disociación completa a 25 °C.', metodo: 'molaridad del núcleo y [H₃O⁺] = Kw/[OH⁻]', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ h: rengIndice(rengRng, RENG_HIDROXIDOS_1.length), m: rengEntreN1(rengRng, 0.01, 4, 0.01), v: rengEntreN1(rengRng, 100, 5000, 100) }),
    valida: (rengD) => { const rengC = rengD.m / rengMmAb(RENG_HIDROXIDOS_1[rengD.h]!) / (rengD.v / 1000); return rengC > 1e-4 && rengC < 0.5 },
    respuesta: (rengD) => 14 + rengLog(rengD.m / rengMmAb(RENG_HIDROXIDOS_1[rengD.h]!) / (rengD.v / 1000)),
    errores: (rengD) => [
      ['ml', 'Volumen en mL', 14 + rengLog(rengD.m / rengMmAb(RENG_HIDROXIDOS_1[rengD.h]!) / rengD.v), 'Dividiste entre los mililitros; la concentración se calcula con litros.'],
      ['poh', 'pOH', -rengLog(rengD.m / rengMmAb(RENG_HIDROXIDOS_1[rengD.h]!) / (rengD.v / 1000)), 'Diste el pOH; el pH es 14 menos el pOH.']
    ],
    enunciado: (rengD) => `Se disuelven ${rengTx(rengD.m)} g de ${rengTextoAb(RENG_HIDROXIDOS_1[rengD.h]!)} en agua hasta ${rengTx(rengD.v)} mL a 25 °C (pKw = 14,00).`,
    pregunta: () => '¿Cuál es el pH?',
    datos: (rengD) => [['Base', `${rengTx(rengD.m)} g`], ['Volumen', `${rengTx(rengD.v)} mL`], rengDatoMasaAb(RENG_HIDROXIDOS_1[rengD.h]!)],
    pasos: (rengD, rengR) => [`[OH⁻] = ${rengTx(10 ** (rengR - 14), 4)} mol/L.`, `pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Pasa la masa a moles.', 'Divide entre el volumen en litros.', 'pH = 14 + log[OH⁻].']
  })
]

export const RENG_PRACTICAS_B10_S07: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s7-p1', subtema: 'n1-b10-s7', titulo: 'pH de una base débil', dificultad: 'basica',
    objetivo: 'Calcular el pH de una base débil con su Kb y la tabla ICE.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las bases débiles'), idealizado: 'Base monoprótica a 25 °C; agua despreciable.', metodo: 'búsqueda por bisección de [OH⁻] en Kb = x²/(C − x)', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.01, 1, 0.01), km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 4, 7, 1) }),
    respuesta: (rengD) => 14 + rengLog(rengRaizCuadratica(ka(rengD), rengD.c)),
    errores: (rengD) => [
      ['fuerte', 'Como base fuerte', 14 + rengLog(rengD.c), 'La trataste como base fuerte; una base débil reacciona solo en parte con el agua.'],
      ['poh', 'pOH', -rengLog(rengRaizCuadratica(ka(rengD), rengD.c)), 'Diste el pOH; el pH es 14 menos el pOH.']
    ],
    enunciado: (rengD) => `Una base débil B tiene Kb = ${rengCientifico(rengD.km, rengD.ke)} (dato didáctico) y concentración ${rengTx(rengD.c)} mol/L. pKw = 14,00.`,
    pregunta: () => '¿Cuál es su pH?',
    datos: (rengD) => [['c(B)', `${rengTx(rengD.c)} mol/L`], ['Kb', rengCientifico(rengD.km, rengD.ke)]],
    pasos: (rengD, rengR) => [`x = [OH⁻] = ${rengTx(10 ** (rengR - 14))} mol/L.`, `pOH = ${rengTx(14 - rengR, 4)}; pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Plantea Kb con la tabla ICE.', 'x es [OH⁻].', 'Pasa del pOH al pH.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s7-p2', subtema: 'n1-b10-s7', titulo: 'Base débil con el pKa de su ácido conjugado', dificultad: 'intermedia',
    objetivo: 'Calcular el pH de una base débil cuando solo se conoce el pKa de su ácido conjugado.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.3', 'las bases débiles y sus ácidos conjugados'), idealizado: 'Base monoprótica a 25 °C; agua despreciable.', metodo: 'Kb = Kw/Ka y bisección de [OH⁻]', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.01, 1, 0.01), p: rengEntreN1(rengRng, 8.5, 11, 0.01) }),
    respuesta: (rengD) => 14 + rengLog(rengRaizCuadratica(10 ** (rengD.p - 14), rengD.c)),
    errores: (rengD) => [
      ['usa-ka', 'Ka como si fuera Kb', 14 + rengLog(rengRaizCuadratica(10 ** -rengD.p, rengD.c)), 'Usaste la Ka del ácido conjugado como si fuera Kb; Kb = Kw/Ka.'],
      ['poh', 'pOH', -rengLog(rengRaizCuadratica(10 ** (rengD.p - 14), rengD.c)), 'Diste el pOH; el pH es 14 menos el pOH.']
    ],
    enunciado: (rengD) => `Una base débil B está a ${rengTx(rengD.c)} mol/L. Su ácido conjugado BH⁺ tiene pKa = ${rengTx(rengD.p, 4)} (dato didáctico). pKw = 14,00.`,
    pregunta: () => '¿Cuál es el pH de la disolución?',
    datos: (rengD) => [['c(B)', `${rengTx(rengD.c)} mol/L`], ['pKa(BH⁺)', rengTx(rengD.p, 4)]],
    pasos: (rengD, rengR) => [`pKb = 14 − ${rengTx(rengD.p, 4)} = ${rengTx(14 - rengD.p, 4)}.`, `[OH⁻] de la tabla ICE; pH = ${rengTx(rengR, 4)}.`],
    pistas: ['Pasa el pKa del conjugado a pKb.', 'Resuelve la tabla ICE de la base.', 'Pasa del pOH al pH.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s7-p3', subtema: 'n1-b10-s7', titulo: 'Porcentaje protonado de una base débil', dificultad: 'avanzada',
    objetivo: 'Calcular qué porcentaje de una base débil ha tomado un protón del agua.', unidad: '%', tolerancia: RENG_TOL_AB_PCT,
    fuentes: rengFuentesAb('14.3', 'las bases débiles'), idealizado: 'Base monoprótica; agua despreciable.', metodo: 'bisección de x en Kb = x²/(C − x) y fracción x/C',
    parametros: (rengRng) => ({ c: rengEntreN1(rengRng, 0.001, 0.5, 0.001), km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, 3, 6, 1) }),
    valida: (rengD) => rengRaizCuadratica(ka(rengD), rengD.c) / rengD.c > 0.004,
    respuesta: (rengD) => (rengRaizCuadratica(ka(rengD), rengD.c) / rengD.c) * 100,
    errores: (rengD) => [
      ['oh-por-100', '[OH⁻] por 100', rengRaizCuadratica(ka(rengD), rengD.c) * 100, 'Multiplicaste [OH⁻] por 100 sin dividir entre la concentración de la base.'],
      ['aproximacion', 'Aproximación √(Kb/C)', Math.sqrt(ka(rengD) / rengD.c) * 100, 'Usaste √(Kb/C) sin comprobar la regla del 5 %; aquí hay que resolver la cuadrática.']
    ],
    enunciado: (rengD) => `Una base débil B con Kb = ${rengCientifico(rengD.km, rengD.ke)} (didáctico) está a ${rengTx(rengD.c)} mol/L.`,
    pregunta: () => '¿Qué porcentaje de la base está como BH⁺?',
    datos: (rengD) => [['c(B)', `${rengTx(rengD.c)} mol/L`], ['Kb', rengCientifico(rengD.km, rengD.ke)]],
    pasos: (rengD, rengR) => [`x = [BH⁺] = ${rengTx(rengRaizCuadratica(ka(rengD), rengD.c))} mol/L (cuadrática).`, `Porcentaje: x/C × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Resuelve la tabla ICE.', 'x es la base que tomó un protón.', 'Divide entre C y multiplica por 100.']
  })
]

export const RENG_PRACTICAS_B10_S08: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b10-s8-p1', subtema: 'n1-b10-s8', titulo: 'pH del agua pura a otra temperatura', dificultad: 'basica',
    objetivo: 'Calcular el pH del agua pura a partir de su producto iónico a una temperatura dada.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.2', 'la autoionización del agua'), idealizado: 'Agua pura; Kw didáctico.', metodo: 'bisección de [H₃O⁺] con [H₃O⁺] = [OH⁻]',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.1, 9.9, 0.01) }),
    valida: (rengD) => Math.abs(rengD.m - 1) > 0.6,
    respuesta: (rengD) => -0.5 * rengLog(rengD.m * 1e-14),
    errores: (rengD) => [
      ['siete', 'Siempre 7', 7, 'Diste pH 7, que solo es el neutro a 25 °C; aquí Kw es otro.'],
      ['sin-mitad', 'Sin la mitad', -rengLog(rengD.m * 1e-14), 'Diste pKw; en agua pura pH = pKw/2.']
    ],
    enunciado: (rengD) => `A cierta temperatura, el producto iónico del agua vale Kw = ${rengCientifico(rengD.m, 14)} (dato didáctico).`,
    pregunta: () => '¿Cuál es el pH del agua pura a esa temperatura?',
    datos: (rengD) => [['Kw', rengCientifico(rengD.m, 14)], ['Agua', 'pura']],
    pasos: (rengD, rengR) => ['En agua pura [H₃O⁺] = [OH⁻] = √Kw.', `pH = −log √Kw = ${rengTx(rengR, 4)}.`],
    pistas: ['En agua pura hay tantos H₃O⁺ como OH⁻.', '[H₃O⁺]² = Kw.', 'pH = pKw / 2.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s8-p2', subtema: 'n1-b10-s8', titulo: 'OH⁻ del agua pura', dificultad: 'intermedia',
    objetivo: 'Calcular la concentración de OH⁻ del agua pura a partir de Kw.', unidad: 'nmol/L', tolerancia: RENG_TOL_AB,
    fuentes: rengFuentesAb('14.2', 'la autoionización del agua'), idealizado: 'Agua pura; Kw didáctico.', metodo: 'raíz cuadrada de Kw convertida de mol/L a nmol/L con el catálogo',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.1, 9.9, 0.01) }),
    valida: (rengD) => Math.abs(rengD.m - 1) > 0.3,
    respuesta: (rengD) => Math.sqrt(rengD.m * 1e-14) * 1e9,
    errores: (rengD) => [
      ['kw', 'Kw en lugar de √Kw', rengD.m * 1e-14 * 1e9 * 1e7, 'Usaste Kw dividido entre 10⁻⁷; en agua pura cada ion vale √Kw.'],
      ['25-c', 'El valor de 25 °C', 100, 'Usaste 10⁻⁷ mol/L, que solo vale con Kw = 1,0·10⁻¹⁴.']
    ],
    enunciado: (rengD) => `A cierta temperatura, Kw = ${rengCientifico(rengD.m, 14)} (dato didáctico).`,
    pregunta: () => '¿Cuál es [OH⁻] del agua pura, en nmol/L?',
    datos: (rengD) => [['Kw', rengCientifico(rengD.m, 14)], ['1 nmol/L', '10⁻⁹ mol/L']],
    pasos: (rengD, rengR) => ['[OH⁻] = [H₃O⁺] = √Kw.', `[OH⁻] = ${rengTx(rengR / 1e9)} mol/L = ${rengTx(rengR)} nmol/L.`],
    pistas: ['En agua pura los dos iones son iguales.', 'Calcula √Kw.', 'Pasa de mol/L a nmol/L.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b10-s8-p3', subtema: 'n1-b10-s8', titulo: 'Ácido muy diluido y agua', dificultad: 'avanzada',
    objetivo: 'Calcular el pH de un ácido fuerte muy diluido teniendo en cuenta la autoionización del agua.', unidad: '', tolerancia: RENG_TOL_PH,
    fuentes: rengFuentesAb('14.2', 'la autoionización del agua'), idealizado: 'Ionización completa del ácido; 25 °C.', metodo: 'balance de carga del núcleo con Kw = 1,0·10⁻¹⁴', sinVerificar: KW_SV,
    parametros: (rengRng) => ({ cm: rengEntreN1(rengRng, 1, 9.9, 0.1), ce: rengEntreN1(rengRng, 7, 8, 1) }),
    valida: (rengD) => -rengLog(rengValorCient(rengD.cm, rengD.ce)) - -rengLog((rengValorCient(rengD.cm, rengD.ce) + Math.sqrt(rengValorCient(rengD.cm, rengD.ce) ** 2 + 4 * KW)) / 2) > 0.15,
    respuesta: (rengD) => { const rengC = rengValorCient(rengD.cm, rengD.ce); return -rengLog((rengC + Math.sqrt(rengC * rengC + 4 * KW)) / 2) },
    errores: (rengD) => [
      ['sin-agua', 'Sin el agua', -rengLog(rengValorCient(rengD.cm, rengD.ce)), 'Sin el agua, un ácido podría dar pH mayor que 7; a estas concentraciones el agua aporta H₃O⁺.'],
      ['ln', 'Logaritmo natural', -Math.log((rengValorCient(rengD.cm, rengD.ce) + Math.sqrt(rengValorCient(rengD.cm, rengD.ce) ** 2 + 4 * KW)) / 2), 'Usaste el logaritmo natural; el pH se define con log₁₀.']
    ],
    enunciado: (rengD) => `Una disolución de HCl es solo ${rengCientifico(rengD.cm, rengD.ce)} mol/L a 25 °C (Kw = 1,0·10⁻¹⁴).`,
    pregunta: () => '¿Cuál es su pH, contando los H₃O⁺ del agua?',
    datos: (rengD) => [['c(HCl)', `${rengCientifico(rengD.cm, rengD.ce)} mol/L`], ['Kw', '1,0·10⁻¹⁴']],
    pasos: (rengD, rengR) => ['Balance de carga: [H₃O⁺] = c + [OH⁻] = c + Kw/[H₃O⁺].', `[H₃O⁺] = (c + √(c² + 4Kw))/2 = ${rengTx(10 ** -rengR)} mol/L; pH = ${rengTx(rengR, 4)}.`],
    pistas: ['¿Puedes despreciar el agua aquí?', '[H₃O⁺] = c + Kw/[H₃O⁺].', 'Resuelve la ecuación de segundo grado.']
  })
]
