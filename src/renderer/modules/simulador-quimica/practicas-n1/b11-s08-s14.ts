import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_DHF_CO2, RENG_DHF_H2O, RENG_F_TE, RENG_HIDROCARBUROS_TE, RENG_PARES_TE, RENG_REACCIONES_S_TE, RENG_R_TE, RENG_TOL_TE, rengDhSTe, rengDsSTe, rengFuentesTe } from './b11-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const R = RENG_R_TE
const F = RENG_F_TE
const hc = (rengI: number) => RENG_HIDROCARBUROS_TE[rengI]!
const rengDhComb = (rengI: number, rengHf: number): number => hc(rengI).x * RENG_DHF_CO2 + (hc(rengI).y / 2) * RENG_DHF_H2O - rengHf
const rengMcm = (rengA: number, rengB: number): number => { let rengX = rengA; while (rengX % rengB !== 0) rengX += rengA; return rengX }
export const rengParCelda = (rengA: number, rengB: number) => { const rengP = RENG_PARES_TE[rengA]!; const rengQ = RENG_PARES_TE[rengB]!; return rengP.E > rengQ.E ? { cat: rengP, an: rengQ } : { cat: rengQ, an: rengP } }

export const RENG_PRACTICAS_B11_S08: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s8-p1', subtema: 'n1-b11-s8', titulo: 'ΔH de combustión con entalpías de formación', dificultad: 'basica',
    objetivo: 'Calcular la entalpía de combustión de un hidrocarburo a partir de las entalpías de formación.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'las entalpías de formación', 'dhf'), idealizado: 'Combustión completa con agua líquida; ΔHf del hidrocarburo didáctico.', metodo: 'suma término a término de productos y reactivos',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_HIDROCARBUROS_TE.length), hf: rengEntreN1(rengRng, -150, 60, 0.5) }),
    respuesta: (rengD) => rengDhComb(rengD.i, rengD.hf),
    errores: (rengD) => [
      ['sin-restar', 'Sin el combustible', rengDhComb(rengD.i, 0), 'Olvidaste restar la entalpía de formación del combustible (reactivo).'],
      ['signo', 'Signo del combustible', rengDhComb(rengD.i, -rengD.hf), 'Sumaste el ΔHf del combustible; los reactivos se restan.']
    ],
    valida: (rengD) => Math.abs(rengD.hf) > 8,
    enunciado: (rengD) => `Se quema ${hc(rengD.i).formula} hasta CO₂ y H₂O(l). ΔHf(${hc(rengD.i).formula}) = ${rengTx(rengD.hf, 4)} kJ/mol (didáctico); ΔHf(CO₂) = −393,509 y ΔHf(H₂O, l) = −285,8 kJ/mol (tabla de la app).`,
    pregunta: () => '¿Cuál es ΔH de combustión por mol de combustible, en kJ/mol?',
    datos: (rengD) => [['Combustible', hc(rengD.i).formula], ['ΔHf(combustible)', `${rengTx(rengD.hf, 4)} kJ/mol`], ['ΔHf(CO₂)', '−393,509'], ['ΔHf(H₂O)', '−285,8']],
    pasos: (rengD, rengR) => [`Productos: ${hc(rengD.i).x} CO₂ + ${hc(rengD.i).y / 2} H₂O.`, `ΔH = ${rengTx(rengR, 5)} kJ/mol.`],
    pistas: ['Ajusta la combustión.', 'El O₂ vale 0.', 'Productos menos reactivos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s8-p2', subtema: 'n1-b11-s8', titulo: 'ΔHf a partir del calor de combustión', dificultad: 'intermedia',
    objetivo: 'Deducir la entalpía de formación de un hidrocarburo a partir de su entalpía de combustión.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'las entalpías de formación', 'dhf'), idealizado: 'Combustión completa con agua líquida; ΔHc didáctico.', metodo: 'búsqueda por bisección del ΔHf que reproduce ΔHc',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_HIDROCARBUROS_TE.length), hf: rengEntreN1(rengRng, -150, 60, 0.5) }),
    valida: (rengD) => Math.abs(rengD.hf) > 8,
    respuesta: (rengD) => rengD.hf,
    errores: (rengD) => [
      ['signo', 'Signo cambiado', -rengD.hf, 'Te equivocaste de signo al despejar: ΔHf = Σ productos − ΔHc.'],
      ['sin-productos', 'Solo con ΔHc', -rengDhComb(rengD.i, rengD.hf), 'Usaste solo ΔHc; hay que restarlo de la suma de los productos.']
    ],
    enunciado: (rengD) => `La combustión de ${hc(rengD.i).formula} hasta CO₂ y H₂O(l) tiene ΔHc = ${rengTx(rengDhComb(rengD.i, rengD.hf), 6)} kJ/mol (didáctico). ΔHf(CO₂) = −393,509 y ΔHf(H₂O, l) = −285,8 kJ/mol.`,
    pregunta: (rengD) => `¿Cuál es ΔHf(${hc(rengD.i).formula}), en kJ/mol?`,
    datos: (rengD) => [['ΔHc', `${rengTx(rengDhComb(rengD.i, rengD.hf), 6)} kJ/mol`], ['Productos', `${hc(rengD.i).x} CO₂ + ${hc(rengD.i).y / 2} H₂O`]],
    pasos: (rengD, rengR) => ['ΔHc = Σ ΔHf(productos) − ΔHf(combustible).', `ΔHf = Σ productos − ΔHc = ${rengTx(rengR, 4)} kJ/mol.`],
    pistas: ['Escribe ΔHc con entalpías de formación.', 'Despeja la del combustible.', 'Cuida el signo.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s8-p3', subtema: 'n1-b11-s8', titulo: 'ΔHf de un reactivo', dificultad: 'avanzada',
    objetivo: 'Despejar la entalpía de formación de un reactivo con coeficiente a partir de ΔH de la reacción.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('5.3', 'las entalpías de formación'), idealizado: 'Datos didácticos.', metodo: 'búsqueda por bisección del ΔHf',
    parametros: (rengRng) => ({ nx: rengEntreN1(rengRng, 2, 4, 1), nz: rengEntreN1(rengRng, 1, 3, 1), hz: rengEntreN1(rengRng, -600, -50, 0.5), dh: rengEntreN1(rengRng, -500, 200, 0.5) }),
    valida: (rengD) => Math.abs((rengD.nz * rengD.hz - rengD.dh) / rengD.nx) > 10,
    respuesta: (rengD) => (rengD.nz * rengD.hz - rengD.dh) / rengD.nx,
    errores: (rengD) => [
      ['sin-dividir', 'Sin dividir entre el coeficiente', rengD.nz * rengD.hz - rengD.dh, 'Olvidaste dividir entre el coeficiente del reactivo.'],
      ['signo', 'Signo de ΔH', (rengD.nz * rengD.hz + rengD.dh) / rengD.nx, 'Sumaste ΔH al despejar; ΔH = ν_Z·ΔHf(Z) − ν_X·ΔHf(X).']
    ],
    enunciado: (rengD) => `Para ${rengD.nx} X + Y₂ → ${rengD.nz} Z, ΔH = ${rengTx(rengD.dh, 4)} kJ y ΔHf(Z) = ${rengTx(rengD.hz, 4)} kJ/mol; Y₂ es un elemento (datos didácticos).`,
    pregunta: () => '¿Cuál es ΔHf(X), en kJ/mol?',
    datos: (rengD) => [['ΔH', `${rengTx(rengD.dh, 4)} kJ`], ['ΔHf(Z)', `${rengTx(rengD.hz, 4)} kJ/mol`], ['Coeficientes', `X: ${rengD.nx}, Z: ${rengD.nz}`]],
    pasos: (rengD, rengR) => [`ΔH = ${rengD.nz}·ΔHf(Z) − ${rengD.nx}·ΔHf(X).`, `ΔHf(X) = ${rengTx(rengR, 4)} kJ/mol.`],
    pistas: ['Plantea ΔH con las entalpías de formación.', 'El elemento Y₂ vale 0.', 'Despeja y divide entre el coeficiente de X.']
  })
]

export const RENG_PRACTICAS_B11_S09: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s9-p1', subtema: 'n1-b11-s9', titulo: 'ΔH de A₂ + B₂ → 2 AB', dificultad: 'basica',
    objetivo: 'Estimar ΔH de una reacción entre moléculas diatómicas con energías de enlace medias.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('7.5', 'las energías de enlace'), idealizado: 'Fase gaseosa; energías de enlace didácticas.', metodo: 'suma de listas de enlaces rotos y formados',
    parametros: (rengRng) => ({ eaa: rengEntreN1(rengRng, 150, 500, 1), ebb: rengEntreN1(rengRng, 150, 500, 1), eab: rengEntreN1(rengRng, 150, 600, 1) }),
    valida: (rengD) => Math.abs(rengD.eaa + rengD.ebb - 2 * rengD.eab) > 10,
    respuesta: (rengD) => rengD.eaa + rengD.ebb - 2 * rengD.eab,
    errores: (rengD) => [
      ['invertido', 'Formados menos rotos', 2 * rengD.eab - rengD.eaa - rengD.ebb, 'Restaste al revés: ΔH ≈ rotos − formados.'],
      ['sin-2', 'Un solo enlace formado', rengD.eaa + rengD.ebb - rengD.eab, 'Se forman dos moléculas AB, es decir, dos enlaces A–B.']
    ],
    enunciado: (rengD) => `A₂(g) + B₂(g) → 2 AB(g). Energías de enlace (didácticas): A–A ${rengTx(rengD.eaa)}, B–B ${rengTx(rengD.ebb)}, A–B ${rengTx(rengD.eab)} kJ/mol.`,
    pregunta: () => '¿ΔH estimada, en kJ/mol?',
    datos: (rengD) => [['A–A', `${rengTx(rengD.eaa)} kJ/mol`], ['B–B', `${rengTx(rengD.ebb)} kJ/mol`], ['A–B', `${rengTx(rengD.eab)} kJ/mol`]],
    pasos: (rengD, rengR) => ['Rotos: A–A y B–B. Formados: 2 A–B.', `ΔH ≈ ${rengTx(rengR)} kJ/mol.`],
    pistas: ['Cuenta los enlaces rotos.', 'Cuenta los formados.', 'Rotos menos formados.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s9-p2', subtema: 'n1-b11-s9', titulo: 'Hidrogenación del eteno', dificultad: 'intermedia',
    objetivo: 'Estimar ΔH de la hidrogenación del eteno contando los enlaces que cambian.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('7.5', 'las energías de enlace'), idealizado: 'Fase gaseosa; energías de enlace didácticas.', metodo: 'lista explícita de enlaces rotos y formados',
    parametros: (rengRng) => ({ cc2: rengEntreN1(rengRng, 590, 640, 1), hh: rengEntreN1(rengRng, 425, 445, 1), cc: rengEntreN1(rengRng, 330, 370, 1), ch: rengEntreN1(rengRng, 400, 420, 1) }),
    respuesta: (rengD) => rengD.cc2 + rengD.hh - rengD.cc - 2 * rengD.ch,
    errores: (rengD) => [
      ['sin-2', 'Un solo C–H formado', rengD.cc2 + rengD.hh - rengD.cc - rengD.ch, 'Se forman dos enlaces C–H nuevos, uno en cada carbono.'],
      ['invertido', 'Formados menos rotos', -(rengD.cc2 + rengD.hh - rengD.cc - 2 * rengD.ch), 'Restaste al revés: ΔH ≈ rotos − formados.']
    ],
    enunciado: (rengD) => `C₂H₄(g) + H₂(g) → C₂H₆(g). Energías medias (didácticas): C=C ${rengTx(rengD.cc2)}, H–H ${rengTx(rengD.hh)}, C–C ${rengTx(rengD.cc)}, C–H ${rengTx(rengD.ch)} kJ/mol. Los cuatro C–H del eteno no cambian.`,
    pregunta: () => '¿ΔH estimada, en kJ/mol?',
    datos: (rengD) => [['C=C', `${rengTx(rengD.cc2)}`], ['H–H', `${rengTx(rengD.hh)}`], ['C–C', `${rengTx(rengD.cc)}`], ['C–H', `${rengTx(rengD.ch)}`]],
    pasos: (rengD, rengR) => ['Rotos: C=C y H–H. Formados: C–C y 2 C–H.', `ΔH ≈ ${rengTx(rengR)} kJ/mol.`],
    pistas: ['¿Qué enlaces cambian?', 'El doble enlace pasa a simple.', 'Se forman dos C–H.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s9-p3', subtema: 'n1-b11-s9', titulo: 'Energía de un enlace desconocido', dificultad: 'avanzada',
    objetivo: 'Calcular una energía de enlace desconocida a partir de ΔH de la reacción y de otras energías de enlace.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('7.5', 'las energías de enlace'), idealizado: 'Fase gaseosa; datos didácticos.', metodo: 'búsqueda por bisección de la energía de enlace',
    parametros: (rengRng) => ({ hh: rengEntreN1(rengRng, 425, 445, 1), xx: rengEntreN1(rengRng, 150, 250, 1), dh: rengEntreN1(rengRng, -550, -10, 1) }),
    respuesta: (rengD) => (rengD.hh + rengD.xx - rengD.dh) / 2,
    errores: (rengD) => [
      ['sin-dividir', 'Sin dividir entre 2', rengD.hh + rengD.xx - rengD.dh, 'Se forman dos enlaces H–X: divide entre 2.'],
      ['signo', 'Signo de ΔH', (rengD.hh + rengD.xx + rengD.dh) / 2, 'Sumaste ΔH al despejar: 2·E(H–X) = E(H–H) + E(X–X) − ΔH.']
    ],
    enunciado: (rengD) => `H₂(g) + X₂(g) → 2 HX(g) tiene ΔH = ${rengTx(rengD.dh)} kJ. E(H–H) = ${rengTx(rengD.hh)} y E(X–X) = ${rengTx(rengD.xx)} kJ/mol (datos didácticos).`,
    pregunta: () => '¿Cuál es la energía del enlace H–X, en kJ/mol?',
    datos: (rengD) => [['ΔH', `${rengTx(rengD.dh)} kJ`], ['E(H–H)', `${rengTx(rengD.hh)} kJ/mol`], ['E(X–X)', `${rengTx(rengD.xx)} kJ/mol`]],
    pasos: (rengD, rengR) => ['ΔH = E(H–H) + E(X–X) − 2·E(H–X).', `E(H–X) = ${rengTx(rengR)} kJ/mol.`],
    pistas: ['Plantea ΔH con los enlaces.', 'Se forman dos H–X.', 'Despeja E(H–X).']
  })
]

export const RENG_PRACTICAS_B11_S10: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s10-p1', subtema: 'n1-b11-s10', titulo: 'Aumento de la velocidad al calentar', dificultad: 'basica',
    objetivo: 'Calcular cuánto se multiplica la constante de velocidad al subir la temperatura con la ecuación de Arrhenius.', unidad: '', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('12.5', 'la ecuación de Arrhenius', 'r'), idealizado: 'Ea constante; datos didácticos.', metodo: 'función exponencial del núcleo',
    parametros: (rengRng) => ({ ea: rengEntreN1(rengRng, 20, 120, 1), t1: rengEntreN1(rengRng, 280, 330, 1), d: rengEntreN1(rengRng, 5, 30, 1) }),
    valida: (rengD) => Math.exp(((rengD.ea * 1000) / R) * (1 / rengD.t1 - 1 / (rengD.t1 + rengD.d))) > 1.2,
    respuesta: (rengD) => Math.exp(((rengD.ea * 1000) / R) * (1 / rengD.t1 - 1 / (rengD.t1 + rengD.d))),
    errores: (rengD) => [
      ['lineal', 'Proporcional a T', (rengD.t1 + rengD.d) / rengD.t1, 'Supusiste que k es proporcional a T; según Arrhenius depende de forma exponencial.'],
      ['invertida', 'Cociente invertido', 1 / Math.exp(((rengD.ea * 1000) / R) * (1 / rengD.t1 - 1 / (rengD.t1 + rengD.d))), 'Invertiste el cociente: al calentar, la constante de velocidad aumenta.']
    ],
    enunciado: (rengD) => `Una reacción tiene Ea = ${rengTx(rengD.ea)} kJ/mol (didáctico). Se calienta de ${rengTx(rengD.t1)} K a ${rengTx(rengD.t1 + rengD.d)} K. R = 8,314 J/(mol·K).`,
    pregunta: () => '¿Por cuánto se multiplica la constante de velocidad? (escribe solo el número)',
    datos: (rengD) => [['Ea', `${rengTx(rengD.ea)} kJ/mol`], ['T₁', `${rengTx(rengD.t1)} K`], ['T₂', `${rengTx(rengD.t1 + rengD.d)} K`]],
    pasos: (rengD, rengR) => ['k₂/k₁ = exp[(Ea/R)·(1/T₁ − 1/T₂)].', `k₂/k₁ = ${rengTx(rengR)}.`],
    pistas: ['Usa Arrhenius con dos temperaturas.', 'Ea en J/mol.', 'Temperaturas en K.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s10-p2', subtema: 'n1-b11-s10', titulo: 'Energía de activación desde dos medidas', dificultad: 'intermedia',
    objetivo: 'Calcular la energía de activación a partir de las constantes de velocidad a dos temperaturas.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('12.5', 'la ecuación de Arrhenius', 'r'), idealizado: 'Ea constante; datos didácticos.', metodo: 'búsqueda por bisección de Ea con la función exponencial del núcleo',
    parametros: (rengRng) => ({ r: rengEntreN1(rengRng, 1.5, 10, 0.1), t1: rengEntreN1(rengRng, 280, 330, 1), d: rengEntreN1(rengRng, 5, 30, 1) }),
    respuesta: (rengD) => (R * Math.log(rengD.r)) / (1 / rengD.t1 - 1 / (rengD.t1 + rengD.d)) / 1000,
    errores: (rengD) => [
      ['log10', 'Logaritmo decimal', (R * Math.log10(rengD.r)) / (1 / rengD.t1 - 1 / (rengD.t1 + rengD.d)) / 1000, 'Usaste log₁₀; la ecuación de Arrhenius usa el logaritmo natural.'],
      ['julios', 'En J/mol', (R * Math.log(rengD.r)) / (1 / rengD.t1 - 1 / (rengD.t1 + rengD.d)), 'Ese valor está en J/mol; la pregunta pide kJ/mol.']
    ],
    enunciado: (rengD) => `La constante de velocidad de una reacción se multiplica por ${rengTx(rengD.r)} al pasar de ${rengTx(rengD.t1)} K a ${rengTx(rengD.t1 + rengD.d)} K (datos didácticos). R = 8,314 J/(mol·K).`,
    pregunta: () => '¿Cuál es su energía de activación, en kJ/mol?',
    datos: (rengD) => [['k₂/k₁', rengTx(rengD.r)], ['T₁', `${rengTx(rengD.t1)} K`], ['T₂', `${rengTx(rengD.t1 + rengD.d)} K`]],
    pasos: (rengD, rengR) => ['Ea = R·ln(k₂/k₁)/(1/T₁ − 1/T₂).', `Ea = ${rengTx(rengR)} kJ/mol.`],
    pistas: ['Despeja Ea de la forma de dos temperaturas.', 'Usa el logaritmo natural.', 'Pasa J a kJ.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s10-p3', subtema: 'n1-b11-s10', titulo: 'Temperatura para acelerar una reacción', dificultad: 'avanzada',
    objetivo: 'Calcular la temperatura a la que hay que llevar una reacción para multiplicar su velocidad por un factor dado.', unidad: 'K', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('12.5', 'la ecuación de Arrhenius', 'r'), idealizado: 'Ea constante; datos didácticos.', metodo: 'búsqueda por bisección de T₂ con la función exponencial del núcleo',
    parametros: (rengRng) => ({ ea: rengEntreN1(rengRng, 30, 120, 1), t1: rengEntreN1(rengRng, 280, 330, 1), r: rengEntreN1(rengRng, 2, 20, 0.5) }),
    respuesta: (rengD) => 1 / (1 / rengD.t1 - (R * Math.log(rengD.r)) / (rengD.ea * 1000)),
    errores: (rengD) => [
      ['lineal', 'Proporcional', rengD.t1 * rengD.r, 'Multiplicaste la temperatura por el factor; la velocidad crece de forma exponencial con T.'],
      ['regla-10', 'Regla de los 10 K', rengD.t1 + 10 * Math.log2(rengD.r), 'Aplicaste la regla aproximada de «cada 10 K se duplica»; con Ea conocida hay que usar Arrhenius.']
    ],
    valida: (rengD) => { const rengT = 1 / (1 / rengD.t1 - (R * Math.log(rengD.r)) / (rengD.ea * 1000)); return rengT > rengD.t1 && rengT < 800 },
    enunciado: (rengD) => `Una reacción con Ea = ${rengTx(rengD.ea)} kJ/mol (didáctico) ocurre a ${rengTx(rengD.t1)} K. Se quiere multiplicar su constante de velocidad por ${rengTx(rengD.r)}. R = 8,314 J/(mol·K).`,
    pregunta: () => '¿A qué temperatura hay que llevarla, en K?',
    datos: (rengD) => [['Ea', `${rengTx(rengD.ea)} kJ/mol`], ['T₁', `${rengTx(rengD.t1)} K`], ['Factor', rengTx(rengD.r)]],
    pasos: (rengD, rengR) => ['1/T₂ = 1/T₁ − R·ln(factor)/Ea.', `T₂ = ${rengTx(rengR, 4)} K.`],
    pistas: ['Despeja 1/T₂ de Arrhenius.', 'Ea en J/mol.', 'Invierte para obtener T₂.']
  })
]

export const RENG_PRACTICAS_B11_S11: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s11-p1', subtema: 'n1-b11-s11', titulo: 'ΔG de una reacción', dificultad: 'basica',
    objetivo: 'Calcular ΔG con ΔG = ΔH − T·ΔS cuidando las unidades.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.1', 'la espontaneidad'), idealizado: 'ΔH y ΔS didácticos y constantes.', metodo: 'ΔS pasado a kJ/K con el catálogo',
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, -300, 300, 0.5), s: rengEntreN1(rengRng, -300, 300, 0.5), t: rengEntreN1(rengRng, 250, 1000, 5) }),
    valida: (rengD) => Math.abs(rengD.h - (rengD.t * rengD.s) / 1000) > 2 && Math.abs(rengD.s) > 10,
    respuesta: (rengD) => rengD.h - (rengD.t * rengD.s) / 1000,
    errores: (rengD) => [
      ['sin-kj', 'ΔS en J/K', rengD.h - rengD.t * rengD.s, 'Mezclaste kJ y J: pasa ΔS a kJ/K antes de multiplicar por T.'],
      ['signo', 'Signo del término entrópico', rengD.h + (rengD.t * rengD.s) / 1000, 'El término entrópico se resta: ΔG = ΔH − T·ΔS.']
    ],
    enunciado: (rengD) => `Una reacción tiene ΔH = ${rengTx(rengD.h, 4)} kJ y ΔS = ${rengTx(rengD.s, 4)} J/K (didácticos). T = ${rengTx(rengD.t)} K.`,
    pregunta: () => '¿Cuál es ΔG, en kJ?',
    datos: (rengD) => [['ΔH', `${rengTx(rengD.h, 4)} kJ`], ['ΔS', `${rengTx(rengD.s, 4)} J/K`], ['T', `${rengTx(rengD.t)} K`]],
    pasos: (rengD, rengR) => ['ΔG = ΔH − T·ΔS, con ΔS en kJ/K.', `ΔG = ${rengTx(rengR, 4)} kJ: ${rengR < 0 ? 'espontánea' : 'no espontánea'}.`],
    pistas: ['Pasa ΔS a kJ/K.', 'ΔG = ΔH − T·ΔS.', 'Mira el signo del resultado.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s11-p2', subtema: 'n1-b11-s11', titulo: 'Temperatura de cambio de espontaneidad', dificultad: 'intermedia',
    objetivo: 'Calcular la temperatura a la que ΔG cambia de signo cuando ΔH y ΔS tienen el mismo signo.', unidad: 'K', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.1', 'la espontaneidad'), idealizado: 'ΔH y ΔS constantes; datos didácticos.', metodo: 'búsqueda por bisección de T con ΔG = 0',
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, 10, 300, 0.5), s: rengEntreN1(rengRng, 20, 400, 0.5), sg: rengIndice(rengRng, 2) }),
    valida: (rengD) => { const rengT = (rengD.h * 1000) / rengD.s; return rengT > 100 && rengT < 3000 },
    respuesta: (rengD) => (rengD.h * 1000) / rengD.s,
    errores: (rengD) => [
      ['sin-kj', 'Unidades mezcladas', rengD.h / rengD.s, 'Mezclaste kJ y J/K: pasa ΔH a J o ΔS a kJ/K.'],
      ['invertido', 'Cociente invertido', rengD.s / rengD.h, 'Invertiste el cociente: T = ΔH/ΔS.']
    ],
    enunciado: (rengD) => `Una reacción tiene ΔH = ${rengD.sg === 1 ? '−' : '+'}${rengTx(rengD.h, 4)} kJ y ΔS = ${rengD.sg === 1 ? '−' : '+'}${rengTx(rengD.s, 4)} J/K (didácticos), constantes.`,
    pregunta: (rengD) => `¿${rengD.sg === 1 ? 'Por encima' : 'Por debajo'} de qué temperatura deja de ser espontánea, en K?`,
    datos: (rengD) => [['ΔH', `${rengD.sg === 1 ? '−' : '+'}${rengTx(rengD.h, 4)} kJ`], ['ΔS', `${rengD.sg === 1 ? '−' : '+'}${rengTx(rengD.s, 4)} J/K`]],
    pasos: (rengD, rengR) => ['ΔG = 0 cuando T = ΔH/ΔS.', `T = ${rengTx(rengR, 4)} K.`],
    pistas: ['Plantea ΔG = 0.', 'Usa unidades coherentes.', 'Despeja T = ΔH/ΔS.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s11-p3', subtema: 'n1-b11-s11', titulo: 'ΔG con datos tabulados a otra temperatura', dificultad: 'avanzada',
    objetivo: 'Calcular ΔG de una reacción a una temperatura dada con ΔH y ΔS tabulados.', unidad: 'kJ', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.4', 'la energía libre', 'dhf'), idealizado: 'ΔH y ΔS constantes con T.', metodo: 'funciones del núcleo para ΔH, ΔS y ΔG',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_S_TE.length), t: rengEntreN1(rengRng, 200, 900, 5) }),
    valida: (rengD) => Math.abs(rengDhSTe(rengD.r) - (rengD.t * rengDsSTe(rengD.r)) / 1000) > 2,
    respuesta: (rengD) => rengDhSTe(rengD.r) - (rengD.t * rengDsSTe(rengD.r)) / 1000,
    errores: (rengD) => [
      ['298', 'A 298 K', rengDhSTe(rengD.r) - (298 * rengDsSTe(rengD.r)) / 1000, 'Usaste 298 K; la pregunta pide ΔG a otra temperatura.'],
      ['signo', 'Signo del término entrópico', rengDhSTe(rengD.r) + (rengD.t * rengDsSTe(rengD.r)) / 1000, 'El término entrópico se resta: ΔG = ΔH − T·ΔS.']
    ],
    enunciado: (rengD) => `Para ${RENG_REACCIONES_S_TE[rengD.r]!.texto}, la tabla de la app da ΔH = ${rengTx(rengDhSTe(rengD.r), 5)} kJ y ΔS = ${rengTx(rengDsSTe(rengD.r), 5)} J/K. Se suponen constantes.`,
    pregunta: (rengD) => `¿Cuál es ΔG a ${rengTx(rengD.t)} K, en kJ?`,
    datos: (rengD) => [['ΔH', `${rengTx(rengDhSTe(rengD.r), 5)} kJ`], ['ΔS', `${rengTx(rengDsSTe(rengD.r), 5)} J/K`], ['T', `${rengTx(rengD.t)} K`]],
    pasos: (rengD, rengR) => ['ΔG = ΔH − T·ΔS con ΔS en kJ/K.', `ΔG = ${rengTx(rengR, 4)} kJ.`],
    pistas: ['Usa la temperatura del enunciado.', 'Pasa ΔS a kJ/K.', 'ΔG = ΔH − T·ΔS.']
  })
]

export const RENG_PRACTICAS_B11_S12: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s12-p1', subtema: 'n1-b11-s12', titulo: 'ΔS de una reacción', dificultad: 'basica',
    objetivo: 'Calcular ΔS de una reacción con entropías absolutas y coeficientes.', unidad: 'J/K', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.2', 'la entropía'), idealizado: 'Entropías didácticas.', metodo: 'suma término a término',
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 1, 3, 1), b: rengEntreN1(rengRng, 1, 3, 1), c: rengEntreN1(rengRng, 1, 3, 1), sa: rengEntreN1(rengRng, 30, 250, 0.5), sb: rengEntreN1(rengRng, 100, 250, 0.5), sc: rengEntreN1(rengRng, 30, 300, 0.5) }),
    valida: (rengD) => Math.abs(rengD.c * rengD.sc - rengD.a * rengD.sa - rengD.b * rengD.sb) > 10 && !(rengD.a === 1 && rengD.b === 1 && rengD.c === 1),
    respuesta: (rengD) => rengD.c * rengD.sc - rengD.a * rengD.sa - rengD.b * rengD.sb,
    errores: (rengD) => [
      ['sin-coef', 'Sin coeficientes', rengD.sc - rengD.sa - rengD.sb, 'Olvidaste multiplicar cada entropía por su coeficiente.'],
      ['invertido', 'Reactivos menos productos', rengD.a * rengD.sa + rengD.b * rengD.sb - rengD.c * rengD.sc, 'Restaste al revés: ΔS = productos − reactivos.']
    ],
    enunciado: (rengD) => `Para ${rengD.a} A + ${rengD.b} B → ${rengD.c} C, las entropías molares son S(A) = ${rengTx(rengD.sa, 4)}, S(B) = ${rengTx(rengD.sb, 4)} y S(C) = ${rengTx(rengD.sc, 4)} J/(mol·K) (didácticas).`,
    pregunta: () => '¿Cuál es ΔS de la reacción, en J/K?',
    datos: (rengD) => [['S(A)', rengTx(rengD.sa, 4)], ['S(B)', rengTx(rengD.sb, 4)], ['S(C)', rengTx(rengD.sc, 4)]],
    pasos: (rengD, rengR) => ['ΔS = Σν·S(productos) − Σν·S(reactivos).', `ΔS = ${rengTx(rengR, 4)} J/K.`],
    pistas: ['Las entropías no son 0 para los elementos.', 'Multiplica por los coeficientes.', 'Productos menos reactivos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s12-p2', subtema: 'n1-b11-s12', titulo: 'Entropía de vaporización', dificultad: 'intermedia',
    objetivo: 'Calcular la entropía de vaporización con ΔS = ΔH/T en el punto de ebullición.', unidad: 'J/(mol·K)', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.2', 'la entropía de los cambios de fase'), idealizado: 'Cambio de fase en equilibrio; datos didácticos.', metodo: 'kJ a J y °C a K con el catálogo',
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, 20, 50, 0.1), tb: rengEntreN1(rengRng, 250, 450, 0.5) }),
    respuesta: (rengD) => (rengD.h * 1000) / rengD.tb,
    errores: (rengD) => [
      ['sin-1000', 'ΔH en kJ', rengD.h / rengD.tb, 'Dejaste ΔH en kJ; la entropía se da en J/(mol·K).'],
      ['celsius', 'Temperatura en °C', (rengD.h * 1000) / (rengD.tb - 273.15), 'Usaste la temperatura en °C; hay que usar kelvin.']
    ],
    valida: (rengD) => rengD.tb - 273.15 > 20,
    enunciado: (rengD) => `Un líquido hierve a ${rengTx(rengD.tb, 4)} K con ΔH(vap) = ${rengTx(rengD.h)} kJ/mol (datos didácticos).`,
    pregunta: () => '¿Cuál es su entropía de vaporización, en J/(mol·K)?',
    datos: (rengD) => [['ΔH(vap)', `${rengTx(rengD.h)} kJ/mol`], ['T(eb)', `${rengTx(rengD.tb, 4)} K`]],
    pasos: (rengD, rengR) => ['En el equilibrio de fases ΔG = 0: ΔS = ΔH/T.', `ΔS = ${rengTx(rengR)} J/(mol·K).`],
    pistas: ['En la ebullición, ΔG = 0.', 'Despeja ΔS = ΔH/T.', 'Pasa kJ a J.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s12-p3', subtema: 'n1-b11-s12', titulo: 'ΔS para una cantidad dada', dificultad: 'avanzada',
    objetivo: 'Escalar ΔS de una reacción tabulada a la cantidad de producto formada.', unidad: 'J/K', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.2', 'la entropía', 'dhf'), idealizado: 'Entropías tabuladas a 25 °C.', metodo: 'función del núcleo escalada a los moles',
    parametros: (rengRng) => ({ r: rengIndice(rengRng, RENG_REACCIONES_S_TE.length), n: rengEntreN1(rengRng, 0.1, 10, 0.05) }),
    valida: (rengD) => Math.abs(rengD.n - 1) > 0.1 && Math.abs(rengD.n - 2) > 0.1,
    respuesta: (rengD) => (rengD.n / RENG_REACCIONES_S_TE[rengD.r]!.reaccion.productos[0]!.nu) * rengDsSTe(rengD.r),
    errores: (rengD) => [
      ['sin-coef', 'Sin el coeficiente', rengD.n * rengDsSTe(rengD.r), 'ΔS es para los moles de la ecuación: divide entre el coeficiente del producto.'],
      ['por-reaccion', 'Por mol de reacción', rengDsSTe(rengD.r), 'Diste ΔS de la ecuación tal cual; hay que escalarlo a los moles formados.']
    ],
    enunciado: (rengD) => `Para ${RENG_REACCIONES_S_TE[rengD.r]!.texto}, la tabla de la app da ΔS = ${rengTx(rengDsSTe(rengD.r), 5)} J/K. Se forman ${rengTx(rengD.n)} mol del primer producto.`,
    pregunta: () => '¿Cuál es ΔS del proceso, en J/K?',
    datos: (rengD) => [['ΔS (ecuación)', `${rengTx(rengDsSTe(rengD.r), 5)} J/K`], ['Producto formado', `${rengTx(rengD.n)} mol`]],
    pasos: (rengD, rengR) => [`La ecuación forma ${RENG_REACCIONES_S_TE[rengD.r]!.reaccion.productos[0]!.nu} mol de ese producto.`, `ΔS = ${rengTx(rengR, 4)} J/K.`],
    pistas: ['Mira el coeficiente del producto.', 'Escala ΔS a los moles formados.', 'Mantén el signo.']
  })
]

export const RENG_PRACTICAS_B11_S13: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s13-p1', subtema: 'n1-b11-s13', titulo: 'Constante de equilibrio desde ΔG°', dificultad: 'basica',
    objetivo: 'Calcular log₁₀ K a partir de ΔG° con ΔG° = −RT·ln K.', unidad: '', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.4', 'la energía libre y el equilibrio', 'r'), idealizado: 'Datos didácticos.', metodo: 'función del núcleo K = exp(−ΔG/RT)',
    parametros: (rengRng) => ({ g: rengEntreN1(rengRng, -80, 40, 0.5), t: rengEntreN1(rengRng, 280, 400, 1) }),
    valida: (rengD) => Math.abs(rengD.g) > 3,
    respuesta: (rengD) => (-rengD.g * 1000) / (R * rengD.t * Math.LN10),
    errores: (rengD) => [
      ['ln', 'ln K en lugar de log K', (-rengD.g * 1000) / (R * rengD.t), 'Diste ln K; para log₁₀ K divide entre ln 10.'],
      ['signo', 'Signo cambiado', (rengD.g * 1000) / (R * rengD.t * Math.LN10), 'Olvidaste el signo menos: ln K = −ΔG°/(RT).']
    ],
    enunciado: (rengD) => `Una reacción tiene ΔG° = ${rengTx(rengD.g, 4)} kJ/mol a ${rengTx(rengD.t)} K (didáctico). R = 8,314 J/(mol·K).`,
    pregunta: () => '¿Cuánto vale log₁₀ K?',
    datos: (rengD) => [['ΔG°', `${rengTx(rengD.g, 4)} kJ/mol`], ['T', `${rengTx(rengD.t)} K`]],
    pasos: (rengD, rengR) => ['ln K = −ΔG°/(RT), con ΔG° en J/mol.', `log₁₀ K = ${rengTx(rengR, 4)}.`],
    pistas: ['Pasa ΔG° a J/mol.', 'ln K = −ΔG°/(RT).', 'Divide entre ln 10.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s13-p2', subtema: 'n1-b11-s13', titulo: 'ΔG° desde la constante de equilibrio', dificultad: 'intermedia',
    objetivo: 'Calcular ΔG° de una reacción a partir de su constante de equilibrio.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.4', 'la energía libre y el equilibrio', 'r'), idealizado: 'Datos didácticos.', metodo: 'búsqueda por bisección de ΔG° con la función del núcleo',
    parametros: (rengRng) => ({ km: rengEntreN1(rengRng, 1, 9.9, 0.1), ke: rengEntreN1(rengRng, -12, 12, 1), t: rengEntreN1(rengRng, 280, 400, 1) }),
    valida: (rengD) => Math.abs(rengD.ke) >= 1,
    respuesta: (rengD) => (-R * rengD.t * Math.log(rengD.km * 10 ** rengD.ke)) / 1000,
    errores: (rengD) => [
      ['log10', 'Logaritmo decimal', (-R * rengD.t * Math.log10(rengD.km * 10 ** rengD.ke)) / 1000, 'Usaste log₁₀; la relación es con el logaritmo natural.'],
      ['signo', 'Signo cambiado', (R * rengD.t * Math.log(rengD.km * 10 ** rengD.ke)) / 1000, 'Olvidaste el signo menos: ΔG° = −RT·ln K.']
    ],
    enunciado: (rengD) => `Una reacción tiene K = ${rengTx(rengD.km, 2)}·10^${rengD.ke} a ${rengTx(rengD.t)} K (didáctico). R = 8,314 J/(mol·K).`,
    pregunta: () => '¿Cuál es ΔG°, en kJ/mol?',
    datos: (rengD) => [['K', `${rengTx(rengD.km, 2)}·10^${rengD.ke}`], ['T', `${rengTx(rengD.t)} K`]],
    pasos: (rengD, rengR) => ['ΔG° = −RT·ln K.', `ΔG° = ${rengTx(rengR, 4)} kJ/mol.`],
    pistas: ['Usa ΔG° = −RT·ln K.', 'Logaritmo natural.', 'Pasa J a kJ.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s13-p3', subtema: 'n1-b11-s13', titulo: 'K a otra temperatura con ΔH y ΔS', dificultad: 'avanzada',
    objetivo: 'Calcular log₁₀ K a una temperatura dada combinando ΔG = ΔH − T·ΔS y ΔG° = −RT·ln K.', unidad: '', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('16.4', 'la energía libre y el equilibrio', 'r'), idealizado: 'ΔH y ΔS constantes; datos didácticos.', metodo: 'funciones del núcleo para ΔG y K',
    parametros: (rengRng) => ({ h: rengEntreN1(rengRng, -150, 100, 0.5), s: rengEntreN1(rengRng, -250, 250, 0.5), t: rengEntreN1(rengRng, 300, 900, 5) }),
    valida: (rengD) => Math.abs(rengD.h - (rengD.t * rengD.s) / 1000) > 3 && Math.abs((rengD.t - 298) * rengD.s) > 3000,
    respuesta: (rengD) => (-(rengD.h - (rengD.t * rengD.s) / 1000) * 1000) / (R * rengD.t * Math.LN10),
    errores: (rengD) => [
      ['298', 'ΔG a 298 K', (-(rengD.h - (298 * rengD.s) / 1000) * 1000) / (R * rengD.t * Math.LN10), 'Calculaste ΔG a 298 K; hay que usar la temperatura pedida en los dos sitios.'],
      ['ln', 'ln K', (-(rengD.h - (rengD.t * rengD.s) / 1000) * 1000) / (R * rengD.t), 'Diste ln K; para log₁₀ K divide entre ln 10.']
    ],
    enunciado: (rengD) => `Una reacción tiene ΔH = ${rengTx(rengD.h, 4)} kJ y ΔS = ${rengTx(rengD.s, 4)} J/K (didácticos, constantes). R = 8,314 J/(mol·K).`,
    pregunta: (rengD) => `¿Cuánto vale log₁₀ K a ${rengTx(rengD.t)} K?`,
    datos: (rengD) => [['ΔH', `${rengTx(rengD.h, 4)} kJ`], ['ΔS', `${rengTx(rengD.s, 4)} J/K`], ['T', `${rengTx(rengD.t)} K`]],
    pasos: (rengD, rengR) => [`ΔG = ${rengTx(rengD.h - (rengD.t * rengD.s) / 1000, 4)} kJ a esa temperatura.`, `log₁₀ K = −ΔG/(RT·ln 10) = ${rengTx(rengR, 4)}.`],
    pistas: ['Calcula ΔG a la temperatura pedida.', 'Usa ΔG° = −RT·ln K.', 'Pasa a log₁₀.']
  })
]

export const RENG_PRACTICAS_B11_S14: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b11-s14-p1', subtema: 'n1-b11-s14', titulo: 'Potencial estándar de una pila', dificultad: 'basica',
    objetivo: 'Calcular E° de una celda galvánica con E°cátodo − E°ánodo a partir de una tabla de potenciales.', unidad: 'V', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.3', 'los potenciales de celda'), idealizado: 'Condiciones estándar.', metodo: 'ΔG° = −nFE° calculado y deshecho', sinVerificar: ['Los potenciales estándar de reducción son valores de uso común no contrastados con una fuente en esta entrega.'],
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_PARES_TE.length), b: rengIndice(rengRng, RENG_PARES_TE.length) }),
    valida: (rengD) => Math.abs(RENG_PARES_TE[rengD.a]!.E - RENG_PARES_TE[rengD.b]!.E) > 0.3 && Math.abs(RENG_PARES_TE[rengD.a]!.E + RENG_PARES_TE[rengD.b]!.E) > 0.15,
    respuesta: (rengD) => rengParCelda(rengD.a, rengD.b).cat.E - rengParCelda(rengD.a, rengD.b).an.E,
    errores: (rengD) => [
      ['suma', 'Suma de potenciales', rengParCelda(rengD.a, rengD.b).cat.E + rengParCelda(rengD.a, rengD.b).an.E, 'Sumaste los potenciales; E° = E°cátodo − E°ánodo.'],
      ['invertida', 'Resta al revés', rengParCelda(rengD.a, rengD.b).an.E - rengParCelda(rengD.a, rengD.b).cat.E, 'Restaste al revés: el cátodo es el de mayor potencial de reducción.']
    ],
    enunciado: (rengD) => `Se monta una pila con los pares ${RENG_PARES_TE[rengD.a]!.ion}/${RENG_PARES_TE[rengD.a]!.metal} (E° = ${rengTx(RENG_PARES_TE[rengD.a]!.E)} V) y ${RENG_PARES_TE[rengD.b]!.ion}/${RENG_PARES_TE[rengD.b]!.metal} (E° = ${rengTx(RENG_PARES_TE[rengD.b]!.E)} V).`,
    pregunta: () => '¿Cuál es el potencial estándar de la pila, en V?',
    datos: (rengD) => [[`E°(${RENG_PARES_TE[rengD.a]!.ion}/${RENG_PARES_TE[rengD.a]!.metal})`, `${rengTx(RENG_PARES_TE[rengD.a]!.E)} V`], [`E°(${RENG_PARES_TE[rengD.b]!.ion}/${RENG_PARES_TE[rengD.b]!.metal})`, `${rengTx(RENG_PARES_TE[rengD.b]!.E)} V`]],
    pasos: (rengD, rengR) => [`Cátodo: ${rengParCelda(rengD.a, rengD.b).cat.metal}; ánodo: ${rengParCelda(rengD.a, rengD.b).an.metal}.`, `E° = ${rengTx(rengR)} V.`],
    pistas: ['El de mayor E° se reduce.', 'E° = cátodo − ánodo.', 'El resultado debe ser positivo.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s14-p2', subtema: 'n1-b11-s14', titulo: 'ΔG° de una pila', dificultad: 'intermedia',
    objetivo: 'Calcular ΔG° de la reacción de una pila con ΔG° = −n·F·E°.', unidad: 'kJ/mol', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.3', 'los potenciales y la energía libre', 'f'), idealizado: 'Condiciones estándar.', metodo: 'carga de n mol de electrones por la diferencia de potencial', sinVerificar: ['Los potenciales estándar de reducción son valores de uso común no contrastados con una fuente en esta entrega.'],
    parametros: (rengRng) => ({ a: rengIndice(rengRng, RENG_PARES_TE.length), b: rengIndice(rengRng, RENG_PARES_TE.length) }),
    valida: (rengD) => Math.abs(RENG_PARES_TE[rengD.a]!.E - RENG_PARES_TE[rengD.b]!.E) > 0.3 && rengMcm(RENG_PARES_TE[rengD.a]!.z, RENG_PARES_TE[rengD.b]!.z) > 1,
    respuesta: (rengD) => { const rengP = rengParCelda(rengD.a, rengD.b); return (-rengMcm(rengP.cat.z, rengP.an.z) * F * (rengP.cat.E - rengP.an.E)) / 1000 },
    errores: (rengD) => {
      const rengP = rengParCelda(rengD.a, rengD.b)
      return [
        ['n1', 'Con n = 1', (-F * (rengP.cat.E - rengP.an.E)) / 1000, 'Usaste n = 1; n son los electrones transferidos en la reacción ajustada.'],
        ['julios', 'En J/mol', -rengMcm(rengP.cat.z, rengP.an.z) * F * (rengP.cat.E - rengP.an.E), 'Ese valor está en J/mol; la pregunta pide kJ/mol.']
      ]
    },
    enunciado: (rengD) => `Una pila usa los pares ${RENG_PARES_TE[rengD.a]!.ion}/${RENG_PARES_TE[rengD.a]!.metal} (${rengTx(RENG_PARES_TE[rengD.a]!.E)} V) y ${RENG_PARES_TE[rengD.b]!.ion}/${RENG_PARES_TE[rengD.b]!.metal} (${rengTx(RENG_PARES_TE[rengD.b]!.E)} V). F = ${rengTx(F, 6)} C/mol.`,
    pregunta: () => '¿Cuál es ΔG° de la reacción ajustada con el mínimo número de electrones, en kJ/mol?',
    datos: (rengD) => [['Pares', `${RENG_PARES_TE[rengD.a]!.ion}/${RENG_PARES_TE[rengD.a]!.metal} y ${RENG_PARES_TE[rengD.b]!.ion}/${RENG_PARES_TE[rengD.b]!.metal}`], ['F', `${rengTx(F, 6)} C/mol`]],
    pasos: (rengD, rengR) => { const rengP = rengParCelda(rengD.a, rengD.b); return [`E° = ${rengTx(rengP.cat.E - rengP.an.E)} V; n = ${rengMcm(rengP.cat.z, rengP.an.z)} electrones.`, `ΔG° = −nFE° = ${rengTx(rengR)} kJ/mol.`] },
    pistas: ['Calcula E° de la pila.', 'Ajusta los electrones de las dos semirreacciones.', 'ΔG° = −nFE°.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b11-s14-p3', subtema: 'n1-b11-s14', titulo: 'Constante de equilibrio de una pila', dificultad: 'avanzada',
    objetivo: 'Calcular log₁₀ K de la reacción de una pila a partir de E° y n.', unidad: '', tolerancia: RENG_TOL_TE,
    fuentes: rengFuentesTe('17.3', 'los potenciales y el equilibrio', 'f', 'r'), idealizado: 'Condiciones estándar a 298,15 K.', metodo: 'ΔG° = −nFE° y K = exp(−ΔG°/RT) del núcleo', sinVerificar: ['Los potenciales estándar de reducción son valores de uso común no contrastados con una fuente en esta entrega.'],
    parametros: (rengRng) => ({ e: rengEntreN1(rengRng, 0.1, 1.5, 0.01), n: rengEntreN1(rengRng, 1, 3, 1) }),
    valida: (rengD) => rengD.n > 1 || rengD.e > 0.2,
    respuesta: (rengD) => (rengD.n * F * rengD.e) / (R * 298.15 * Math.LN10),
    errores: (rengD) => [
      ['n1', 'Con n = 1', (F * rengD.e) / (R * 298.15 * Math.LN10), 'Olvidaste multiplicar por n, los electrones transferidos.'],
      ['ln', 'ln K', (rengD.n * F * rengD.e) / (R * 298.15), 'Diste ln K; para log₁₀ K divide entre ln 10.']
    ],
    enunciado: (rengD) => `Una pila tiene E° = ${rengTx(rengD.e)} V y transfiere n = ${rengD.n} electrones por reacción (didáctico), a 298,15 K. F = ${rengTx(F, 6)} C/mol, R = 8,314 J/(mol·K).`,
    pregunta: () => '¿Cuánto vale log₁₀ K de su reacción?',
    datos: (rengD) => [['E°', `${rengTx(rengD.e)} V`], ['n', String(rengD.n)], ['T', '298,15 K']],
    pasos: (rengD, rengR) => ['ln K = nFE°/(RT).', `log₁₀ K = ${rengTx(rengR, 4)}.`],
    pistas: ['Combina ΔG° = −nFE° con ΔG° = −RT ln K.', 'Despeja ln K.', 'Divide entre ln 10.']
  })
]
