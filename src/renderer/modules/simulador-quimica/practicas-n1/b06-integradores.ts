import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengLecturasCombustion } from '../escenas-n1/modelos/combustion'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_COMBUSTIBLES_RQ, RENG_DH_SIN_VERIFICAR_RQ, RENG_TOL_RQ, rengFCombRq, rengFuentesRq, rengMRq, rengTxRq, rengTxtRx } from './b06-comun'
import { RENG_REVERSIBLES_RQ } from './b06-s15-s20'
import { rengTxtNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(6)
const tx = rengTxRq
const T = rengTxtNo
const M = rengMRq
const comb = (rengI: number) => RENG_COMBUSTIBLES_RQ[rengI]!
export const RENG_REV_DOS_RQ = RENG_REVERSIBLES_RQ.filter((rengR) => rengR.nr === 2)

export const RENG_INTEGRADORES_B06: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b6-i1', subtema: RENG_GRUPO, subtemas: ['n1-b6-s4', 'n1-b6-s14'],
    titulo: 'Masa de los productos de una combustión', dificultad: 'basica',
    objetivo: 'Combinar la combustión ajustada con la conservación de la masa para calcular la masa total de productos.', unidad: 'g', tolerancia: RENG_TOL_RQ,
    fuentes: rengFuentesRq('4.2', 'la combustión y la conservación de la masa'), idealizado: 'Combustión completa.', metodo: 'escena «combustion» (masas de CO₂ y H₂O)',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_COMBUSTIBLES_RQ.length), m: rengEntreN1(rengRng, 1, 100, 0.5) }),
    respuesta: (rengD) => { const c = comb(rengD.i); const l = rengLecturasCombustion({ x: c.x, y: c.y, z: c.z, n: rengD.m / M(rengFCombRq(c)) }); return rengD.m + l.mo2! },
    errores: (rengD) => {
      const c = comb(rengD.i)
      const l = rengLecturasCombustion({ x: c.x, y: c.y, z: c.z, n: rengD.m / M(rengFCombRq(c)) })
      return [
        ['sin-o2', 'Solo el combustible', rengD.m, 'Los productos incluyen también el oxígeno del aire que se ha consumido.'],
        ['solo-co2', 'Solo el CO₂', l.mco2!, 'Falta sumar la masa del agua formada.']
      ]
    },
    enunciado: (rengD) => `Se queman por completo ${tx(rengD.m)} g de ${comb(rengD.i).n} (${T(rengFCombRq(comb(rengD.i)))}).`,
    pregunta: () => '¿Qué masa total de CO₂ y H₂O se forma, en g?',
    datos: (rengD) => [['Combustible', `${tx(rengD.m)} g de ${T(rengFCombRq(comb(rengD.i)))}`], [`M(${T(rengFCombRq(comb(rengD.i)))})`, `${tx(M(rengFCombRq(comb(rengD.i))), 5)} g/mol`]],
    pasos: (rengD, rengR) => ['m(productos) = m(combustible) + m(O₂) (subtema 4).', `Con el O₂ de la combustión ajustada (subtema 14): ${tx(rengR)} g.`],
    pistas: ['Ajusta la combustión.', 'Calcula el O₂ consumido.', 'Suma las masas de los reactivos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b6-i2', subtema: RENG_GRUPO, subtemas: ['n1-b6-s12', 'n1-b6-s13'],
    titulo: 'Neutralización que precipita', dificultad: 'intermedia',
    objetivo: 'Calcular la masa del sólido que se forma al neutralizar ácido sulfúrico con hidróxido de bario.', unidad: 'g', tolerancia: RENG_TOL_RQ,
    fuentes: rengFuentesRq('15.1', 'la neutralización con precipitado'), idealizado: 'Neutralización completa; base en exceso.', metodo: 'coeficientes del módulo de ajuste del núcleo',
    parametros: (rengRng) => ({ v: rengEntreN1(rengRng, 10, 200, 5), c: rengEntreN1(rengRng, 0.02, 0.5, 0.01) }),
    respuesta: (rengD) => (rengD.v / 1000) * rengD.c * M('BaSO4'),
    errores: (rengD) => [
      ['ml', 'Volumen en mL', rengD.v * rengD.c * M('BaSO4'), 'La concentración está en mol/L: pasa los mL a litros.'],
      ['agua', 'Masa de agua', (rengD.v / 1000) * rengD.c * 2 * M('H2O'), 'Calculaste el agua formada; la pregunta pide el sólido.']
    ],
    enunciado: (rengD) => `Se añaden ${tx(rengD.v)} mL de H₂SO₄ ${tx(rengD.c)} mol/L a exceso de Ba(OH)₂: H₂SO₄ + Ba(OH)₂ → BaSO₄ + 2 H₂O.`,
    pregunta: () => '¿Qué masa de BaSO₄ precipita, en g?',
    datos: (rengD) => [['H₂SO₄', `${tx(rengD.v)} mL, ${tx(rengD.c)} mol/L`], ['M(BaSO₄)', `${tx(M('BaSO4'), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Neutralización con precipitado (subtemas 12 y 13): n(BaSO₄) = n(H₂SO₄) = ${tx((rengD.v / 1000) * rengD.c)} mol.`, `m = ${tx(rengR)} g.`],
    pistas: ['Calcula los moles de ácido.', 'Proporción 1:1 con el sólido.', 'Pasa a gramos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b6-i3', subtema: RENG_GRUPO, subtemas: ['n1-b6-s10', 'n1-b6-s18'],
    titulo: 'Electrones en un desplazamiento', dificultad: 'basica',
    objetivo: 'Relacionar la masa de cobre depositada por el cinc con los electrones transferidos.', unidad: 'mol', tolerancia: RENG_TOL_RQ,
    fuentes: rengFuentesRq('17.1', 'el desplazamiento como redox'), idealizado: 'Reacción completa.', metodo: 'números de oxidación del núcleo',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.5, 50, 0.5) }),
    respuesta: (rengD) => (rengD.m / M('Cu')) * 2,
    errores: (rengD) => [
      ['sin-2', 'Un electrón por átomo', rengD.m / M('Cu'), 'Cada Cu²⁺ gana dos electrones al pasar a Cu.'],
      ['masa', 'Sin pasar a moles', rengD.m * 2, 'Multiplicaste la masa por 2 sin pasarla antes a moles.']
    ],
    enunciado: (rengD) => `Al echar cinc en CuSO₄ se depositan ${tx(rengD.m)} g de cobre: Zn + CuSO₄ → ZnSO₄ + Cu.`,
    pregunta: () => '¿Cuántos moles de electrones ha transferido el cinc al cobre?',
    datos: (rengD) => [['Cu depositado', `${tx(rengD.m)} g`], ['M(Cu)', `${tx(M('Cu'), 5)} g/mol`]],
    pasos: (rengD, rengR) => [`Desplazamiento (subtema 10): Zn 0 → +2 y Cu +2 → 0 (subtema 18).`, `n(e⁻) = 2 × ${tx(rengD.m / M('Cu'))} = ${tx(rengR)} mol.`],
    pistas: ['Pasa el cobre a moles.', 'Cada Cu gana dos electrones.', 'Multiplica.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b6-i4', subtema: RENG_GRUPO, subtemas: ['n1-b6-s8', 'n1-b6-s16'],
    titulo: 'Calor de la síntesis del agua', dificultad: 'intermedia',
    objetivo: 'Usar la ecuación de síntesis del agua y su ΔH para calcular el calor liberado por una masa de hidrógeno.', unidad: 'kJ', tolerancia: RENG_TOL_RQ,
    fuentes: rengFuentesRq('5.3', 'la síntesis exotérmica del agua'), idealizado: 'Agua líquida; ΔH = −286 kJ por mol de agua.', metodo: 'coeficientes y masa molar del núcleo', sinVerificar: [RENG_DH_SIN_VERIFICAR_RQ],
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.5, 50, 0.5) }),
    respuesta: (rengD) => (rengD.m / M('H2')) * 286,
    errores: (rengD) => [
      ['por-ecuacion', 'ΔH por ecuación de 2 mol', (rengD.m / M('H2')) * 286 * 2, 'ΔH = −286 kJ es por mol de agua; con 2 H₂ → 2 H₂O no se duplica por mol de H₂.'],
      ['mitad', 'Dividido entre dos', ((rengD.m / M('H2')) * 286) / 2, 'No hay que dividir entre el coeficiente 2: cada mol de H₂ forma un mol de H₂O.']
    ],
    enunciado: (rengD) => `Se forman agua líquida a partir de ${tx(rengD.m)} g de H₂ con O₂ en exceso: 2 H₂ + O₂ → 2 H₂O, ΔH = −286 kJ por mol de H₂O.`,
    pregunta: () => '¿Cuánto calor se libera, en kJ?',
    datos: (rengD) => [['H₂', `${tx(rengD.m)} g`], ['ΔH', '−286 kJ/mol de H₂O']],
    pasos: (rengD, rengR) => [`Síntesis (subtema 8): n(H₂O) = n(H₂) = ${tx(rengD.m / M('H2'))} mol.`, `q = n·286 = ${tx(rengR)} kJ (subtema 16).`],
    pistas: ['Pasa el H₂ a moles.', 'Un H₂O por cada H₂.', 'Multiplica por 286 kJ.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b6-i5', subtema: RENG_GRUPO, subtemas: ['n1-b6-s7', 'n1-b6-s19'],
    titulo: 'Valoración con permanganato', dificultad: 'avanzada',
    objetivo: 'Usar la ecuación redox ajustada para calcular la concentración de Fe²⁺ valorada con permanganato.', unidad: 'mmol/L', tolerancia: RENG_TOL_RQ,
    fuentes: rengFuentesRq('17.1', 'las valoraciones redox'), idealizado: 'Punto final exacto en medio ácido.', metodo: 'coeficientes del ion-electrón del núcleo',
    parametros: (rengRng) => ({ v: rengEntreN1(rengRng, 5, 40, 0.1), c: rengEntreN1(rengRng, 0.005, 0.05, 0.001) }),
    respuesta: (rengD) => ((5 * rengD.c * rengD.v) / 25) * 1000,
    errores: (rengD) => [
      ['uno', 'Uno a uno', ((rengD.c * rengD.v) / 25) * 1000, 'Un MnO₄⁻ oxida a cinco Fe²⁺, no a uno.'],
      ['invertida', 'Proporción invertida', ((rengD.c * rengD.v) / 5 / 25) * 1000, 'Invertiste la proporción: por cada MnO₄⁻ hay cinco Fe²⁺.']
    ],
    enunciado: (rengD) => `Para oxidar el Fe²⁺ de 25,0 mL de muestra se gastan ${tx(rengD.v)} mL de KMnO₄ ${tx(rengD.c)} mol/L en medio ácido (MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺, sin ajustar).`,
    pregunta: () => '¿Cuál es la concentración de Fe²⁺, en mmol/L?',
    datos: (rengD) => [['KMnO₄', `${tx(rengD.v)} mL, ${tx(rengD.c)} mol/L`], ['Muestra', '25,0 mL']],
    pasos: (rengD, rengR) => ['Ajuste ion-electrón (subtema 7): MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O; el MnO₄⁻ es el oxidante (subtema 19).', `c(Fe²⁺) = 5·${tx(rengD.c * rengD.v)} mmol / 25,0 mL = ${tx(rengR)} mmol/L.`],
    pistas: ['Ajusta la redox.', 'Cinco Fe²⁺ por MnO₄⁻.', 'Divide entre el volumen de muestra.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b6-i6', subtema: RENG_GRUPO, subtemas: ['n1-b6-s2', 'n1-b6-s15'],
    titulo: 'Limitante en una reacción reversible', dificultad: 'avanzada',
    objetivo: 'Combinar el reactivo limitante con la conversión parcial de una reacción reversible.', unidad: 'mol', tolerancia: RENG_TOL_RQ,
    fuentes: rengFuentesRq('13.1', 'el limitante y la conversión'), idealizado: 'La conversión se refiere al reactivo limitante.', metodo: 'coeficientes del módulo de ajuste del núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_REV_DOS_RQ.length), a: rengEntreN1(rengRng, 0.5, 10, 0.05), b: rengEntreN1(rengRng, 0.5, 10, 0.05), p: rengEntreN1(rengRng, 10, 90, 1) }),
    valida: (rengD) => { const r = RENG_REV_DOS_RQ[rengD.i]!; const u = rengD.a / r.nu[0]!; const w = rengD.b / r.nu[1]!; return Math.abs(u - w) > 0.15 * Math.max(u, w) },
    respuesta: (rengD) => { const r = RENG_REV_DOS_RQ[rengD.i]!; return Math.min(rengD.a / r.nu[0]!, rengD.b / r.nu[1]!) * (rengD.p / 100) * r.nu[r.nr]! },
    errores: (rengD) => {
      const r = RENG_REV_DOS_RQ[rengD.i]!
      return [
        ['completa', 'Como si fuera completa', Math.min(rengD.a / r.nu[0]!, rengD.b / r.nu[1]!) * r.nu[r.nr]!, 'La reacción es reversible: solo se transforma el porcentaje indicado.'],
        ['exceso', 'Con el reactivo en exceso', Math.max(rengD.a / r.nu[0]!, rengD.b / r.nu[1]!) * (rengD.p / 100) * r.nu[r.nr]!, 'La conversión se refiere al reactivo limitante, no al que está en exceso.']
      ]
    },
    enunciado: (rengD) => { const r = RENG_REV_DOS_RQ[rengD.i]!; return `En ${rengTxtRx(r).replace('→', '⇌')} se mezclan ${tx(rengD.a)} mol de ${T(r.esp[0]!)} y ${tx(rengD.b)} mol de ${T(r.esp[1]!)}; se transforma el ${tx(rengD.p)} % del reactivo limitante.` },
    pregunta: () => '¿Cuántos moles del primer producto hay en el equilibrio?',
    datos: (rengD) => { const r = RENG_REV_DOS_RQ[rengD.i]!; return [[T(r.esp[0]!), `${tx(rengD.a)} mol`], [T(r.esp[1]!), `${tx(rengD.b)} mol`], ['Conversión', `${tx(rengD.p)} %`]] },
    pasos: (rengD, rengR) => { const r = RENG_REV_DOS_RQ[rengD.i]!; return [`Limitante por n/ν (subtema 2): ${tx(rengD.a / r.nu[0]!)} frente a ${tx(rengD.b / r.nu[1]!)}.`, `n(producto) = ${tx(rengR)} mol (subtema 15).`] },
    pistas: ['Busca el limitante.', 'Aplica la conversión.', 'Usa el coeficiente del producto.']
  })
]
