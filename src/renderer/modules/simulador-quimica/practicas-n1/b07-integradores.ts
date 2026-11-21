import { RENG_R_LKPA, rengK, rengTx } from '../aprender/n1/gases/constantes'
import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_COMBUSTIONES, RENG_EMPIRICAS, RENG_OXIDOS_METAL, RENG_REACCIONES_DOS_REACTIVOS, RENG_TOL_EST, RENG_TOL_PCT, rengAtomosDe, rengDatoMasa, rengFuentesEst, rengMasaAt, rengMmEst, rengTexto, rengTextoMasasAt } from './b07-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(7)
const rengMetalEn = (rengO: (typeof RENG_OXIDOS_METAL)[number]): number => rengAtomosDe(rengO.oxido).get(rengO.metal)!
const RENG_M_ZN = rengMmEst('Zn')

export const RENG_INTEGRADORES_B07: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b7-i1', subtema: RENG_GRUPO, subtemas: ['n1-b7-s3', 'n1-b7-s10'],
    titulo: 'CO₂ de un combustible calculando las masas molares', dificultad: 'basica',
    objetivo: 'Calcular las masas molares a partir de las masas atómicas y usarlas en un cálculo masa-masa.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.3', 'masas molares y estequiometría', 'masas'), idealizado: 'Combustión completa.', metodo: 'conservación del carbono: masa de C del combustible convertida en masa de CO₂',
    parametros: (rengRng) => ({ c: rengIndice(rengRng, RENG_COMBUSTIONES.length), m: rengEntreN1(rengRng, 1, 200, 1) }),
    respuesta: (rengD) => {
      const rengC = RENG_COMBUSTIONES[rengD.c]!
      const rengCO2 = rengC.productos.find((rengE) => rengE.formula === 'CO2')!
      return (rengD.m / rengMmEst(rengC.reactivos[0]!.formula)) * (rengCO2.coef / rengC.reactivos[0]!.coef) * rengMmEst('CO2')
    },
    errores: (rengD) => {
      const rengC = RENG_COMBUSTIONES[rengD.c]!
      const rengCO2 = rengC.productos.find((rengE) => rengE.formula === 'CO2')!
      return [
        ['sin-coef', 'Sin la razón molar', (rengD.m / rengMmEst(rengC.reactivos[0]!.formula)) * rengMmEst('CO2'), 'Olvidaste la razón molar: cada molécula de combustible da varias de CO₂.'],
        ['gramos-coef', 'Coeficientes sobre gramos', (rengD.m * rengCO2.coef) / rengC.reactivos[0]!.coef, 'Aplicaste los coeficientes a los gramos sin pasar por moles.']
      ]
    },
    enunciado: (rengD) => `Se queman ${rengTx(rengD.m)} g de ${RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.texto}: ${RENG_COMBUSTIONES[rengD.c]!.texto}. Masas atómicas de la tabla de la app: ${rengTextoMasasAt(RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.formula)} y O ${rengTx(rengMasaAt('O'), 5)} g/mol.`,
    pregunta: () => '¿Qué masa de CO₂ se forma, en g?',
    datos: (rengD) => [['Ecuación', RENG_COMBUSTIONES[rengD.c]!.texto], ['Combustible', `${rengTx(rengD.m)} g`], ['Masas atómicas', `${rengTextoMasasAt(RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.formula)} · O ${rengTx(rengMasaAt('O'), 5)}`]],
    pasos: (rengD, rengR) => [`Masas molares (subtema 3): combustible ${rengTx(rengMmEst(RENG_COMBUSTIONES[rengD.c]!.reactivos[0]!.formula), 5)}, CO₂ ${rengTx(rengMmEst('CO2'), 5)} g/mol.`, `Camino masa → mol → razón → mol → masa (subtema 10): ${rengTx(rengR)} g.`],
    pistas: ['Calcula las dos masas molares.', 'Pasa el combustible a moles.', 'Razón CO₂ : combustible y vuelta a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-i2', subtema: RENG_GRUPO, subtemas: ['n1-b7-s6', 'n1-b7-s18'],
    titulo: 'Metal contenido en un mineral impuro', dificultad: 'basica',
    objetivo: 'Combinar la pureza de un mineral con la composición porcentual de su óxido.', unidad: 'kg', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.5', 'pureza y composición', 'masas'), idealizado: 'Ganga sin metal; óxido puro en la parte útil.', metodo: 'moles de óxido puro y átomos de metal por fórmula',
    parametros: (rengRng) => ({ o: rengIndice(rengRng, RENG_OXIDOS_METAL.length), m: rengEntreN1(rengRng, 10, 1000, 10), p: rengEntreN1(rengRng, 40, 95, 1) }),
    respuesta: (rengD) => {
      const rengO = RENG_OXIDOS_METAL[rengD.o]!
      return (rengD.m * (rengD.p / 100) * rengMetalEn(rengO) * rengMmEst(rengO.metal)) / rengMmEst(rengO.oxido)
    },
    errores: (rengD) => {
      const rengO = RENG_OXIDOS_METAL[rengD.o]!
      return [
        ['sin-pureza', 'Sin aplicar la pureza', (rengD.m * rengMetalEn(rengO) * rengMmEst(rengO.metal)) / rengMmEst(rengO.oxido), 'Supusiste que todo el mineral es óxido. Aplica antes la pureza.'],
        ['solo-pureza', 'Solo la pureza', rengD.m * (rengD.p / 100), 'Diste la masa de óxido puro. Parte de esa masa es oxígeno: aplica la fracción en masa del metal.']
      ]
    },
    enunciado: (rengD) => `Un mineral de ${rengTx(rengD.m)} kg contiene un ${rengTx(rengD.p)} % en masa de ${rengTexto(RENG_OXIDOS_METAL[rengD.o]!.oxido)}; el resto es ganga sin metal.`,
    pregunta: (rengD) => `¿Cuántos kilogramos de ${RENG_OXIDOS_METAL[rengD.o]!.metal} contiene?`,
    datos: (rengD) => [['Mineral', `${rengTx(rengD.m)} kg`], ['Pureza en óxido', `${rengTx(rengD.p)} %`], rengDatoMasa(RENG_OXIDOS_METAL[rengD.o]!.oxido), rengDatoMasa(RENG_OXIDOS_METAL[rengD.o]!.metal)],
    pasos: (rengD, rengR) => [`Óxido puro (subtema 18): ${rengTx((rengD.m * rengD.p) / 100)} kg.`, `Fracción de metal en el óxido (subtema 6) y masa de metal: ${rengTx(rengR)} kg.`],
    pistas: ['Primero la masa de óxido puro.', 'Después la fracción en masa del metal en el óxido.', 'Multiplica las dos fracciones por la masa de mineral.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-i3', subtema: RENG_GRUPO, subtemas: ['n1-b7-s13', 'n1-b7-s16'],
    titulo: 'Producto real con un reactivo limitante', dificultad: 'intermedia',
    objetivo: 'Identificar el limitante y aplicar el rendimiento porcentual para obtener la masa real de producto.', unidad: 'g', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'limitante y rendimiento', 'masas'), idealizado: 'Reacción hasta agotar el limitante con un rendimiento dado.', metodo: 'función del núcleo para el reactivo limitante y rendimiento aplicado después',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_DOS_REACTIVOS.length), a: rengEntreN1(rengRng, 2, 80, 0.5), b: rengEntreN1(rengRng, 2, 80, 0.5), y: rengEntreN1(rengRng, 50, 95, 1) }),
    valida: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      return Math.abs(rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef / (rengD.b / rengMmEst(rengR0.reactivos[1]!.formula) / rengR0.reactivos[1]!.coef) - 1) > 0.2
    },
    respuesta: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      const rengXi = Math.min(rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef, rengD.b / rengMmEst(rengR0.reactivos[1]!.formula) / rengR0.reactivos[1]!.coef)
      return rengXi * rengR0.productos[0]!.coef * rengMmEst(rengR0.productos[0]!.formula) * (rengD.y / 100)
    },
    errores: (rengD) => {
      const rengR0 = RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!
      const rengXa = rengD.a / rengMmEst(rengR0.reactivos[0]!.formula) / rengR0.reactivos[0]!.coef
      const rengXb = rengD.b / rengMmEst(rengR0.reactivos[1]!.formula) / rengR0.reactivos[1]!.coef
      const rengMp = rengR0.productos[0]!.coef * rengMmEst(rengR0.productos[0]!.formula)
      return [
        ['sin-rendimiento', 'Dar el teórico', Math.min(rengXa, rengXb) * rengMp, 'Diste el rendimiento teórico; aplica el rendimiento porcentual.'],
        ['exceso', 'Calcular con el reactivo en exceso', Math.max(rengXa, rengXb) * rengMp * (rengD.y / 100), 'Calculaste con el reactivo que sobra; el producto lo fija el limitante.']
      ]
    },
    enunciado: (rengD) => `Según ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto}, se mezclan ${rengTx(rengD.a)} g de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.texto} y ${rengTx(rengD.b)} g de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.texto}; el rendimiento es del ${rengTx(rengD.y)} %.`,
    pregunta: (rengD) => `¿Qué masa de ${RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.productos[0]!.texto} se obtiene realmente, en g?`,
    datos: (rengD) => [['Ecuación', RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.texto], rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[0]!.formula), rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.reactivos[1]!.formula), rengDatoMasa(RENG_REACCIONES_DOS_REACTIVOS[rengD.r]!.productos[0]!.formula), ['Rendimiento', `${rengTx(rengD.y)} %`]],
    pasos: (_rengD, rengR) => ['Limitante (subtema 13): menor cociente moles/coeficiente.', `Real (subtema 16) = teórico × R/100 = ${rengTx(rengR)} g.`],
    pistas: ['Busca primero el limitante.', 'Calcula el rendimiento teórico con él.', 'Aplica el rendimiento porcentual.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-i4', subtema: RENG_GRUPO, subtemas: ['n1-b7-s7', 'n1-b7-s8'],
    titulo: 'Átomos de C por molécula desde la combustión', dificultad: 'intermedia',
    objetivo: 'Combinar el análisis por combustión con la masa molar para contar átomos de carbono por molécula.', unidad: '', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('3.2', 'combustión y fórmula molecular', 'masas'), idealizado: 'Combustión completa y masa molar exacta.', metodo: 'masa de C en el CO₂ (fracción en masa) y número de moles de compuesto',
    parametros: (rengRng) => ({ e: rengIndice(rengRng, RENG_EMPIRICAS.length), n: rengEntreN1(rengRng, 1, 3, 1), m: rengEntreN1(rengRng, 0.1, 0.9, 0.01) }),
    respuesta: (rengD) => {
      const rengE = RENG_EMPIRICAS[rengD.e]!
      const rengM = Math.round(rengD.n * rengMmEst(rengE[0]) * 10) / 10
      const rengCO2 = Math.round((rengD.m / (rengD.n * rengMmEst(rengE[0]))) * rengD.n * rengE[1] * rengMmEst('CO2') * 1000) / 1000
      return rengCO2 / rengMmEst('CO2') / (rengD.m / rengM)
    },
    errores: (rengD) => {
      const rengE = RENG_EMPIRICAS[rengD.e]!
      const rengM = Math.round(rengD.n * rengMmEst(rengE[0]) * 10) / 10
      const rengCO2 = Math.round((rengD.m / (rengD.n * rengMmEst(rengE[0]))) * rengD.n * rengE[1] * rengMmEst('CO2') * 1000) / 1000
      return [
        ['masa-co2', 'Masa de CO₂ entre masa de muestra', rengCO2 / rengD.m, 'Dividiste masas. Hay que dividir moles de C (del CO₂) entre moles de compuesto (masa / masa molar).'],
        ['sin-masa-molar', 'Moles de C sin moles de compuesto', rengCO2 / rengMmEst('CO2'), 'Diste los moles de carbono. Divídelos entre los moles de compuesto quemado.']
      ]
    },
    enunciado: (rengD) => {
      const rengE = RENG_EMPIRICAS[rengD.e]!
      return `Al quemar ${rengTx(rengD.m)} g de un compuesto de C, H y O se obtienen ${rengTx(Math.round((rengD.m / (rengD.n * rengMmEst(rengE[0]))) * rengD.n * rengE[1] * rengMmEst('CO2') * 1000) / 1000, 4)} g de CO₂. Su masa molar es ${rengTx(Math.round(rengD.n * rengMmEst(rengE[0]) * 10) / 10, 4)} g/mol.`
    },
    pregunta: () => '¿Cuántos átomos de carbono tiene cada molécula?',
    datos: (rengD) => [['Muestra', `${rengTx(rengD.m)} g`], rengDatoMasa('CO2'), ['Masa molar del compuesto', `${rengTx(Math.round(rengD.n * rengMmEst(RENG_EMPIRICAS[rengD.e]![0]) * 10) / 10, 4)} g/mol`]],
    pasos: (_rengD, rengR) => ['Moles de C = masa de CO₂ / M(CO₂) (subtema 7).', `Moles de compuesto = masa / M (subtema 8); átomos de C por molécula = ${rengTx(rengR)}.`],
    pistas: ['Todo el C acaba en el CO₂.', 'Calcula los moles de compuesto con su masa molar.', 'Divide moles de C entre moles de compuesto.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-i5', subtema: RENG_GRUPO, subtemas: ['n1-b7-s18', 'n1-b7-s20'],
    titulo: 'Pureza de un cinc por el volumen de hidrógeno', dificultad: 'avanzada',
    objetivo: 'Usar el volumen de gas medido y la ecuación del gas ideal para calcular la pureza de una muestra.', unidad: '%', tolerancia: RENG_TOL_PCT,
    fuentes: rengFuentesEst('4.5', 'pureza medida con un gas', 'masas', 'r'), idealizado: 'Impurezas inertes; gas ideal seco.', metodo: 'número de moléculas de H₂ con P·V = N·k_B·T en el SI',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 1, 20, 0.5), p: rengEntreN1(rengRng, 55, 98, 1), t: rengEntreN1(rengRng, 10, 35, 1), q: rengEntreN1(rengRng, 96, 104, 0.5) }),
    respuesta: (rengD) => {
      const rengV = Number(((((rengD.m * rengD.p) / 100 / RENG_M_ZN) * RENG_R_LKPA * rengK(rengD.t)) / rengD.q).toPrecision(4))
      return (((rengD.q * rengV) / (RENG_R_LKPA * rengK(rengD.t))) * RENG_M_ZN * 100) / rengD.m
    },
    errores: (rengD) => {
      const rengV = Number(((((rengD.m * rengD.p) / 100 / RENG_M_ZN) * RENG_R_LKPA * rengK(rengD.t)) / rengD.q).toPrecision(4))
      return [
        ['celsius', 'Temperatura en °C', (((rengD.q * rengV) / (RENG_R_LKPA * rengD.t)) * RENG_M_ZN * 100) / rengD.m, 'Usaste la temperatura en °C; pásala a kelvin.'],
        ['volumen-224', 'Usar 22,4 L/mol', ((rengV / 22.414) * RENG_M_ZN * 100) / rengD.m, 'Usaste 22,4 L/mol fuera de 0 °C y 1 atm.']
      ]
    },
    enunciado: (rengD) => `Una muestra de ${rengTx(rengD.m)} g de cinc impuro se disuelve en HCl en exceso (Zn + 2 HCl → ZnCl₂ + H₂) y desprende ${rengTx(Number(((((rengD.m * rengD.p) / 100 / RENG_M_ZN) * RENG_R_LKPA * rengK(rengD.t)) / rengD.q).toPrecision(4)), 4)} L de H₂ seco a ${rengTx(rengD.t)} °C y ${rengTx(rengD.q)} kPa. Las impurezas no desprenden gas.`,
    pregunta: () => '¿Qué pureza tiene la muestra, en %?',
    datos: (rengD) => [['Muestra', `${rengTx(rengD.m)} g`], rengDatoMasa('Zn'), ['Condiciones del gas', `${rengTx(rengD.t)} °C y ${rengTx(rengD.q)} kPa`]],
    pasos: (_rengD, rengR) => ['Moles de H₂ con P·V = n·R·T (subtema 20); los mismos moles de Zn puro.', `Pureza (subtema 18) = ${rengTx(rengR)} %.`],
    pistas: ['Calcula los moles de hidrógeno con el volumen.', 'Razón 1 : 1 con el cinc.', 'Divide la masa de cinc puro entre la de la muestra.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b7-i6', subtema: RENG_GRUPO, subtemas: ['n1-b7-s13', 'n1-b7-s16', 'n1-b7-s20'],
    titulo: 'Volumen de hidrógeno con limitante y rendimiento', dificultad: 'avanzada',
    objetivo: 'Encadenar reactivo limitante, rendimiento y ecuación del gas ideal.', unidad: 'L', tolerancia: RENG_TOL_EST,
    fuentes: rengFuentesEst('4.4', 'limitante, rendimiento y gases', 'masas', 'r'), idealizado: 'Gas ideal seco; rendimiento constante.', metodo: 'función del núcleo para el reactivo limitante y número de moléculas con N·k_B·T',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.5, 15, 0.5), h: rengEntreN1(rengRng, 0.02, 0.5, 0.01), y: rengEntreN1(rengRng, 60, 98, 1), t: rengEntreN1(rengRng, 10, 35, 1) }),
    valida: (rengD) => Math.abs(rengD.m / RENG_M_ZN / (rengD.h / 2) - 1) > 0.2,
    respuesta: (rengD) => (Math.min(rengD.m / RENG_M_ZN, rengD.h / 2) * (rengD.y / 100) * RENG_R_LKPA * rengK(rengD.t)) / 101.3,
    errores: (rengD) => [
      ['sin-coef-hcl', 'HCl sin su coeficiente 2', (Math.min(rengD.m / RENG_M_ZN, rengD.h) * (rengD.y / 100) * RENG_R_LKPA * rengK(rengD.t)) / 101.3, 'Olvidaste dividir los moles de HCl entre 2 al buscar el limitante.'],
      ['sin-rendimiento', 'Sin el rendimiento', (Math.min(rengD.m / RENG_M_ZN, rengD.h / 2) * RENG_R_LKPA * rengK(rengD.t)) / 101.3, 'Calculaste el volumen teórico; aplica el rendimiento.']
    ],
    enunciado: (rengD) => `Se hacen reaccionar ${rengTx(rengD.m)} g de cinc con ${rengTx(rengD.h)} mol de HCl (Zn + 2 HCl → ZnCl₂ + H₂) con un rendimiento del ${rengTx(rengD.y)} %. El H₂ se mide seco a ${rengTx(rengD.t)} °C y 101,3 kPa.`,
    pregunta: () => '¿Qué volumen de H₂ se recoge, en L?',
    datos: (rengD) => [['Cinc', `${rengTx(rengD.m)} g`], ['HCl', `${rengTx(rengD.h)} mol`], rengDatoMasa('Zn'), ['Rendimiento', `${rengTx(rengD.y)} %`], ['Condiciones', `${rengTx(rengD.t)} °C y 101,3 kPa`]],
    pasos: (_rengD, rengR) => ['Limitante (subtema 13): mín(n(Zn)/1, n(HCl)/2).', `Moles reales de H₂ (subtema 16) y volumen (subtema 20): ${rengTx(rengR)} L.`],
    pistas: ['Busca el limitante con los coeficientes 1 y 2.', 'Aplica el rendimiento a los moles de H₂.', 'Volumen con P·V = n·R·T.']
  })
]
