import { RENG_DH_SIN_VERIFICAR_RQ, rengMRq, rengPracticaRq, rengRx, rengTxRq, rengTxtRx, type RengRxRq } from './b06-comun'
import { rengDeNo, rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTxRq
const T = rengTxtNo
const M = rengMRq
const C_AGUA = 4.184
const rev = (rengR: RengRxRq): string => rengTxtRx(rengR).replace('→', '⇌')

export const RENG_REVERSIBLES_RQ: readonly RengRxRq[] = ['N2 + 3H2 -> 2NH3', 'H2 + I2 -> 2HI', '2SO2 + O2 -> 2SO3', 'N2O4 -> 2NO2', 'CO + 2H2 -> CH3OH', 'PCl5 -> PCl3 + Cl2', '2NO + O2 -> 2NO2', 'CO + H2O -> CO2 + H2', '2HI -> H2 + I2', 'N2 + O2 -> 2NO', '2NO2 -> N2O4', 'H2 + Br2 -> 2HBr', 'CO + Cl2 -> COCl2', '2H2S -> 2H2 + S2'].map(rengRx)

export interface RengDhRq {
  n: string
  f: string
  dh: number
}

export const RENG_EXOTERMICAS_RQ: readonly RengDhRq[] = [
  { n: 'metano', f: 'CH4', dh: -890 }, { n: 'propano', f: 'C3H8', dh: -2220 }, { n: 'etano', f: 'C2H6', dh: -1560 }, { n: 'butano', f: 'C4H10', dh: -2878 }, { n: 'octano', f: 'C8H18', dh: -5470 },
  { n: 'etanol', f: 'C2H6O', dh: -1367 }, { n: 'metanol', f: 'CH4O', dh: -726 }, { n: 'hidrógeno', f: 'H2', dh: -286 }, { n: 'carbono (grafito)', f: 'C', dh: -394 }, { n: 'glucosa', f: 'C6H12O6', dh: -2803 },
  { n: 'etino', f: 'C2H2', dh: -1300 }, { n: 'monóxido de carbono', f: 'CO', dh: -283 }
]

export const RENG_ENDOTERMICAS_RQ: readonly (RengDhRq & { texto: string })[] = [
  { n: 'carbonato de calcio', f: 'CaCO3', dh: 178, texto: 'CaCO₃ → CaO + CO₂' }, { n: 'carbonato de magnesio', f: 'MgCO3', dh: 117, texto: 'MgCO₃ → MgO + CO₂' },
  { n: 'hidrogenocarbonato de sodio', f: 'NaHCO3', dh: 64.5, texto: '2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂ (por mol de NaHCO₃)' }, { n: 'agua líquida', f: 'H2O', dh: 286, texto: 'H₂O → H₂ + ½ O₂' },
  { n: 'cloruro de amonio', f: 'NH4Cl', dh: 176, texto: 'NH₄Cl → NH₃ + HCl' }, { n: 'nitrógeno', f: 'N2', dh: 180, texto: 'N₂ + O₂ → 2 NO (por mol de N₂)' },
  { n: 'carbono (grafito)', f: 'C', dh: 131, texto: 'C + H₂O → CO + H₂' }, { n: 'hidróxido de calcio', f: 'Ca(OH)2', dh: 109, texto: 'Ca(OH)₂ → CaO + H₂O' },
  { n: 'carbonato de cobre(II)', f: 'CuCO3', dh: 47, texto: 'CuCO₃ → CuO + CO₂' }, { n: 'carbonato de bario', f: 'BaCO3', dh: 269, texto: 'BaCO₃ → BaO + CO₂' },
  { n: 'carbonato de cinc', f: 'ZnCO3', dh: 71, texto: 'ZnCO₃ → ZnO + CO₂' }, { n: 'óxido de mercurio(II)', f: 'HgO', dh: 91, texto: 'HgO → Hg + ½ O₂' }
]

export interface RengCambioOxRq {
  de: string
  a: string
  el: string
  oxDe: number
  oxA: number
}

export const RENG_CAMBIOS_OX_RQ: readonly RengCambioOxRq[] = [
  { de: 'Fe', a: 'FeCl3', el: 'Fe', oxDe: 0, oxA: 3 }, { de: 'Cu', a: 'CuO', el: 'Cu', oxDe: 0, oxA: 2 }, { de: 'Na', a: 'NaCl', el: 'Na', oxDe: 0, oxA: 1 }, { de: 'Mg', a: 'MgO', el: 'Mg', oxDe: 0, oxA: 2 },
  { de: 'Al', a: 'Al2O3', el: 'Al', oxDe: 0, oxA: 3 }, { de: 'S', a: 'SO2', el: 'S', oxDe: 0, oxA: 4 }, { de: 'H2S', a: 'S', el: 'S', oxDe: -2, oxA: 0 }, { de: 'SO2', a: 'SO3', el: 'S', oxDe: 4, oxA: 6 },
  { de: 'NO', a: 'NO2', el: 'N', oxDe: 2, oxA: 4 }, { de: 'NH3', a: 'NO', el: 'N', oxDe: -3, oxA: 2 }, { de: 'MnO2', a: 'MnCl2', el: 'Mn', oxDe: 4, oxA: 2 }, { de: 'KMnO4', a: 'MnO2', el: 'Mn', oxDe: 7, oxA: 4 },
  { de: 'Cl2', a: 'NaCl', el: 'Cl', oxDe: 0, oxA: -1 }, { de: 'O2', a: 'H2O', el: 'O', oxDe: 0, oxA: -2 }, { de: 'FeCl3', a: 'FeCl2', el: 'Fe', oxDe: 3, oxA: 2 }, { de: 'CuO', a: 'Cu', el: 'Cu', oxDe: 2, oxA: 0 },
  { de: 'HNO3', a: 'NO', el: 'N', oxDe: 5, oxA: 2 }, { de: 'H2O2', a: 'H2O', el: 'O', oxDe: -1, oxA: -2 }, { de: 'H2O2', a: 'O2', el: 'O', oxDe: -1, oxA: 0 }, { de: 'C', a: 'CO2', el: 'C', oxDe: 0, oxA: 4 },
  { de: 'CO', a: 'CO2', el: 'C', oxDe: 2, oxA: 4 }, { de: 'H2S', a: 'SO2', el: 'S', oxDe: -2, oxA: 4 }, { de: 'H2S', a: 'H2SO4', el: 'S', oxDe: -2, oxA: 6 },
  { de: 'NH3', a: 'HNO3', el: 'N', oxDe: -3, oxA: 5 }, { de: 'KMnO4', a: 'MnCl2', el: 'Mn', oxDe: 7, oxA: 2 }, { de: 'SO2', a: 'H2S', el: 'S', oxDe: 4, oxA: -2 }, { de: 'HNO3', a: 'N2O', el: 'N', oxDe: 5, oxA: 1 },
  { de: 'KClO3', a: 'KCl', el: 'Cl', oxDe: 5, oxA: -1 }, { de: 'FeO', a: 'Fe2O3', el: 'Fe', oxDe: 2, oxA: 3 }, { de: 'NO2', a: 'HNO3', el: 'N', oxDe: 4, oxA: 5 }
]

export const rengDeltaOx = (rengC: RengCambioOxRq): number => Math.abs(rengC.oxA - rengC.oxDe)
export const rengEFormula = (rengC: RengCambioOxRq): number => rengDeltaOx(rengC) * rengDeNo(rengC.de, rengC.el)

export interface RengAgenteRq {
  n: string
  f: string
  el: string
  prod: string
  oxF: number
  oxP: number
}

export const RENG_OXIDANTES_RQ: readonly RengAgenteRq[] = [
  { n: 'permanganato de potasio (a Mn²⁺)', f: 'KMnO4', el: 'Mn', prod: 'MnCl2', oxF: 7, oxP: 2 }, { n: 'permanganato de potasio (a MnO₂)', f: 'KMnO4', el: 'Mn', prod: 'MnO2', oxF: 7, oxP: 4 },
  { n: 'dicromato de potasio (a Cr³⁺)', f: 'K2Cr2O7', el: 'Cr', prod: 'CrCl3', oxF: 6, oxP: 3 }, { n: 'peróxido de hidrógeno (a H₂O)', f: 'H2O2', el: 'O', prod: 'H2O', oxF: -1, oxP: -2 },
  { n: 'cloro (a Cl⁻)', f: 'Cl2', el: 'Cl', prod: 'NaCl', oxF: 0, oxP: -1 }, { n: 'oxígeno (a H₂O)', f: 'O2', el: 'O', prod: 'H2O', oxF: 0, oxP: -2 },
  { n: 'ácido nítrico (a NO)', f: 'HNO3', el: 'N', prod: 'NO', oxF: 5, oxP: 2 }, { n: 'hipoclorito de sodio (a Cl⁻)', f: 'NaClO', el: 'Cl', prod: 'NaCl', oxF: 1, oxP: -1 },
  { n: 'yodato de potasio (a I₂)', f: 'KIO3', el: 'I', prod: 'I2', oxF: 5, oxP: 0 }, { n: 'cloruro de hierro(III) (a Fe²⁺)', f: 'FeCl3', el: 'Fe', prod: 'FeCl2', oxF: 3, oxP: 2 },
  { n: 'bromato de potasio (a Br⁻)', f: 'KBrO3', el: 'Br', prod: 'KBr', oxF: 5, oxP: -1 }, { n: 'cloruro de cobre(II) (a Cu)', f: 'CuCl2', el: 'Cu', prod: 'Cu', oxF: 2, oxP: 0 },
  { n: 'bromo (a Br⁻)', f: 'Br2', el: 'Br', prod: 'KBr', oxF: 0, oxP: -1 }, { n: 'yodo (a I⁻)', f: 'I2', el: 'I', prod: 'KI', oxF: 0, oxP: -1 },
  { n: 'ácido nítrico concentrado (a NO₂)', f: 'HNO3', el: 'N', prod: 'NO2', oxF: 5, oxP: 4 }, { n: 'ácido sulfúrico concentrado (a SO₂)', f: 'H2SO4', el: 'S', prod: 'SO2', oxF: 6, oxP: 4 },
  { n: 'clorato de potasio (a Cl⁻)', f: 'KClO3', el: 'Cl', prod: 'KCl', oxF: 5, oxP: -1 }, { n: 'ácido nítrico diluido (a NH₄⁺)', f: 'HNO3', el: 'N', prod: 'NH4Cl', oxF: 5, oxP: -3 },
  { n: 'óxido de hierro(III) (a Fe)', f: 'Fe2O3', el: 'Fe', prod: 'Fe', oxF: 3, oxP: 0 }, { n: 'óxido de plata (a Ag)', f: 'Ag2O', el: 'Ag', prod: 'Ag', oxF: 1, oxP: 0 }
]

export const RENG_REDUCTORES_RQ: readonly RengAgenteRq[] = [
  { n: 'cinc', f: 'Zn', el: 'Zn', prod: 'ZnCl2', oxF: 0, oxP: 2 }, { n: 'aluminio', f: 'Al', el: 'Al', prod: 'AlCl3', oxF: 0, oxP: 3 }, { n: 'hierro (a Fe²⁺)', f: 'Fe', el: 'Fe', prod: 'FeCl2', oxF: 0, oxP: 2 },
  { n: 'magnesio', f: 'Mg', el: 'Mg', prod: 'MgCl2', oxF: 0, oxP: 2 }, { n: 'sodio', f: 'Na', el: 'Na', prod: 'NaCl', oxF: 0, oxP: 1 }, { n: 'calcio', f: 'Ca', el: 'Ca', prod: 'CaCl2', oxF: 0, oxP: 2 },
  { n: 'litio', f: 'Li', el: 'Li', prod: 'LiCl', oxF: 0, oxP: 1 }, { n: 'potasio', f: 'K', el: 'K', prod: 'KCl', oxF: 0, oxP: 1 }, { n: 'hidrógeno (a H⁺)', f: 'H2', el: 'H', prod: 'HCl', oxF: 0, oxP: 1 },
  { n: 'carbono (a CO₂)', f: 'C', el: 'C', prod: 'CO2', oxF: 0, oxP: 4 }, { n: 'monóxido de carbono (a CO₂)', f: 'CO', el: 'C', prod: 'CO2', oxF: 2, oxP: 4 }, { n: 'cloruro de hierro(II) (a Fe³⁺)', f: 'FeCl2', el: 'Fe', prod: 'FeCl3', oxF: 2, oxP: 3 },
  { n: 'cloruro de estaño(II) (a Sn⁴⁺)', f: 'SnCl2', el: 'Sn', prod: 'SnCl4', oxF: 2, oxP: 4 }, { n: 'sulfuro de hidrógeno (a S)', f: 'H2S', el: 'S', prod: 'S', oxF: -2, oxP: 0 },
  { n: 'sulfito de sodio (a sulfato)', f: 'Na2SO3', el: 'S', prod: 'Na2SO4', oxF: 4, oxP: 6 }, { n: 'yoduro de potasio (a I₂)', f: 'KI', el: 'I', prod: 'I2', oxF: -1, oxP: 0 }, { n: 'cobre (a Cu²⁺)', f: 'Cu', el: 'Cu', prod: 'CuCl2', oxF: 0, oxP: 2 }
]

export const rengEAgente = (rengA: RengAgenteRq): number => Math.abs(rengA.oxF - rengA.oxP) * rengDeNo(rengA.f, rengA.el)
export const RENG_METALES_ACIDO_RQ: readonly RengAgenteRq[] = RENG_REDUCTORES_RQ.filter((rengA) => /^(Zn|Al|Fe|Mg|Na|Ca|Li|K)$/.test(rengA.f))

export const RENG_PRACTICAS_B06_S15: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s15-p1', titulo: 'Producto con conversión parcial', unidad: 'mol',
    objetivo: 'Calcular los moles de producto de una reacción reversible a partir de la conversión del reactivo.', seccion: '13.1', para: 'las reacciones reversibles',
    idealizado: 'Conversión dada hasta el equilibrio.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_REVERSIBLES_RQ, x: [0.5, 10, 0.05], y: [10, 90, 1],
    valida: (r) => r.nu[0] !== r.nu[r.nr],
    respuesta: (r, x, y) => ((x * y) / 100) * (r.nu[r.nr]! / r.nu[0]!),
    errores: (r, x, y) => [
      ['completa', 'Como si fuera completa', x * (r.nu[r.nr]! / r.nu[0]!), 'La reacción es reversible: solo reacciona el porcentaje indicado.'],
      ['sin-coef', 'Sin los coeficientes', (x * y) / 100, 'Falta aplicar la proporción entre reactivo y producto.']
    ],
    enunciado: (r, x, y) => `En ${rev(r)}, de ${tx(x)} mol de ${T(r.esp[0]!)} reacciona el ${tx(y)} % antes de llegar al equilibrio.`, pregunta: (r) => `¿Cuántos moles de ${T(r.esp[r.nr]!)} hay en el equilibrio?`,
    datos: (r, x, y) => [['Reacción', rev(r)], [T(r.esp[0]!), `${tx(x)} mol`], ['Conversión', `${tx(y)} %`]],
    pasos: (r, x, y, rengR) => [`Reaccionan ${tx((x * y) / 100)} mol de ${T(r.esp[0]!)}.`, `n = ${tx(rengR)} mol.`],
    pistas: ['Calcula lo que reacciona.', 'Aplica la proporción.', 'No todo se transforma.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s15-p2', titulo: 'Reactivo que queda', unidad: 'mol',
    objetivo: 'Calcular los moles de reactivo que quedan sin transformar en una reacción reversible.', seccion: '13.1', para: 'las reacciones reversibles',
    idealizado: 'Conversión dada hasta el equilibrio.', metodo: 'balance de moles', lista: RENG_REVERSIBLES_RQ, x: [0.5, 10, 0.05], y: [10, 90, 1],
    valida: (_r, _x, y) => Math.abs(y - 50) > 3,
    respuesta: (_r, x, y) => x * (1 - y / 100),
    errores: (_r, x, y) => [
      ['reaccionado', 'Lo que reacciona', (x * y) / 100, 'Esa es la cantidad que reacciona; la pregunta pide la que queda.'],
      ['todo', 'Todo el reactivo', x, 'Parte del reactivo sí reacciona: resta lo transformado.']
    ],
    enunciado: (r, x, y) => `En ${rev(r)} se parte de ${tx(x)} mol de ${T(r.esp[0]!)} y se transforma el ${tx(y)} %.`, pregunta: (r) => `¿Cuántos moles de ${T(r.esp[0]!)} quedan en el equilibrio?`,
    datos: (r, x, y) => [['Reacción', rev(r)], [T(r.esp[0]!), `${tx(x)} mol`], ['Conversión', `${tx(y)} %`]],
    pasos: (_r, x, y, rengR) => [`Reaccionan ${tx((x * y) / 100)} mol.`, `Quedan ${tx(rengR)} mol.`],
    pistas: ['Calcula lo que reacciona.', 'Réstalo de lo inicial.', 'El equilibrio no agota el reactivo.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s15-p3', titulo: 'Conversión a partir del producto', unidad: '%',
    objetivo: 'Calcular la conversión de una reacción reversible a partir de los moles de producto medidos.', seccion: '13.1', para: 'las reacciones reversibles',
    idealizado: 'Sistema cerrado en equilibrio.', metodo: 'coeficientes del módulo de ajuste del núcleo', lista: RENG_REVERSIBLES_RQ, x: [0.5, 10, 0.05], y: [10, 90, 1],
    valida: (r) => r.nu[0] !== r.nu[r.nr],
    respuesta: (_r, _x, y) => y,
    errores: (r, _x, y) => [
      ['sin-coef', 'Sin los coeficientes', y * (r.nu[r.nr]! / r.nu[0]!), 'Dividiste los moles de producto entre los de reactivo sin la proporción de coeficientes.'],
      ['invertida', 'Proporción invertida', y * (r.nu[0]! / r.nu[r.nr]!) * (r.nu[0]! / r.nu[r.nr]!), 'Aplicaste la proporción al revés.']
    ],
    enunciado: (r, x, y) => `En ${rev(r)} se parte de ${tx(x)} mol de ${T(r.esp[0]!)} y en el equilibrio hay ${tx(((x * y) / 100) * (r.nu[r.nr]! / r.nu[0]!), 4)} mol de ${T(r.esp[r.nr]!)}.`, pregunta: '¿Qué porcentaje del reactivo se ha transformado?',
    datos: (r, x, y) => [['Reacción', rev(r)], [T(r.esp[0]!), `${tx(x)} mol`], [T(r.esp[r.nr]!), `${tx(((x * y) / 100) * (r.nu[r.nr]! / r.nu[0]!), 4)} mol`]],
    pasos: (r, _x, _y, rengR) => [`Reactivo transformado = producto × ${r.nu[0]}/${r.nu[r.nr]}.`, `Conversión = ${tx(rengR)} %.`],
    pistas: ['Pasa el producto a reactivo transformado.', 'Divide entre lo inicial.', 'Multiplica por 100.']
  })
]

export const RENG_PRACTICAS_B06_S16: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s16-p1', titulo: 'Calor de una combustión', unidad: 'kJ',
    objetivo: 'Calcular el calor liberado por una masa de combustible a partir de su ΔH de combustión.', seccion: '5.3', para: 'las reacciones exotérmicas',
    idealizado: 'Combustión completa a presión constante.', metodo: 'masa molar del núcleo', sinVerificar: [RENG_DH_SIN_VERIFICAR_RQ], lista: RENG_EXOTERMICAS_RQ, x: [1, 200, 0.5],
    respuesta: (e, x) => (x / M(e.f)) * -e.dh,
    errores: (e, x) => [
      ['sin-moles', 'Sin pasar a moles', x * -e.dh, 'ΔH está en kJ por mol: hay que pasar la masa a moles.'],
      ['por-mol', 'Calor de un mol', -e.dh, 'Ese es el calor de un solo mol; multiplica por los moles quemados.']
    ],
    enunciado: (e, x) => `Se queman ${tx(x)} g de ${e.n} (${T(e.f)}); ΔH de combustión = ${tx(e.dh, 4)} kJ/mol.`, pregunta: '¿Cuánto calor se libera, en kJ?',
    datos: (e, x) => [['Combustible', `${tx(x)} g de ${T(e.f)}`], ['ΔH', `${tx(e.dh, 4)} kJ/mol`]],
    pasos: (e, x, _y, rengR) => [`n = ${tx(x / M(e.f))} mol.`, `q = n·|ΔH| = ${tx(rengR)} kJ.`],
    pistas: ['Pasa la masa a moles.', 'Multiplica por |ΔH|.', 'El calor liberado es positivo.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s16-p2', titulo: 'Combustible para un calor dado', unidad: 'g',
    objetivo: 'Calcular la masa de combustible que hay que quemar para liberar una cantidad de calor.', seccion: '5.3', para: 'las reacciones exotérmicas',
    idealizado: 'Combustión completa a presión constante.', metodo: 'masa molar del núcleo', sinVerificar: [RENG_DH_SIN_VERIFICAR_RQ], lista: RENG_EXOTERMICAS_RQ, x: [100, 10000, 50],
    respuesta: (e, x) => (x / -e.dh) * M(e.f),
    errores: (e, x) => [
      ['moles', 'Moles en lugar de gramos', x / -e.dh, 'Ese resultado está en moles; multiplica por la masa molar.'],
      ['invertida', 'División invertida', (-e.dh / x) * M(e.f), 'Invertiste el cociente: los moles son calor entre |ΔH|.']
    ],
    enunciado: (e, x) => `Se necesitan ${tx(x)} kJ de calor quemando ${e.n} (${T(e.f)}, ΔH = ${tx(e.dh, 4)} kJ/mol).`, pregunta: '¿Qué masa de combustible hay que quemar, en g?',
    datos: (e, x) => [['Calor', `${tx(x)} kJ`], ['ΔH', `${tx(e.dh, 4)} kJ/mol`]],
    pasos: (e, x, _y, rengR) => [`n = ${tx(x)}/${tx(-e.dh, 4)} mol.`, `m = n·M = ${tx(rengR)} g.`],
    pistas: ['Divide el calor entre |ΔH|.', 'Obtienes moles.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s16-p3', titulo: 'Agua calentada por una combustión', unidad: 'K',
    objetivo: 'Combinar el calor liberado por una combustión con q = m·c·ΔT para calcular el calentamiento del agua.', seccion: '5.3', para: 'las reacciones exotérmicas',
    idealizado: 'Todo el calor pasa al agua; c = 4,184 J/(g·K).', metodo: 'bisección del balance de calor', sinVerificar: [RENG_DH_SIN_VERIFICAR_RQ], lista: RENG_EXOTERMICAS_RQ, x: [0.1, 5, 0.05], y: [500, 5000, 50],
    valida: (e, x, y) => { const rengDt = ((x / M(e.f)) * -e.dh * 1000) / (y * C_AGUA); return rengDt > 1 && rengDt < 80 },
    respuesta: (e, x, y) => ((x / M(e.f)) * -e.dh * 1000) / (y * C_AGUA),
    errores: (e, x, y) => [
      ['kj', 'Calor en kJ', ((x / M(e.f)) * -e.dh) / (y * C_AGUA), 'Dejaste el calor en kJ con c en J/(g·K): pásalo a julios.'],
      ['sin-c', 'Sin el calor específico', ((x / M(e.f)) * -e.dh * 1000) / y, 'Falta dividir entre el calor específico del agua.']
    ],
    enunciado: (e, x, y) => `Se queman ${tx(x)} g de ${e.n} (ΔH = ${tx(e.dh, 4)} kJ/mol) y todo el calor calienta ${tx(y)} g de agua.`, pregunta: '¿Cuánto sube la temperatura del agua, en K?',
    datos: (e, x, y) => [['Combustible', `${tx(x)} g de ${T(e.f)}`], ['Agua', `${tx(y)} g`], ['c(agua)', '4,184 J/(g·K)']],
    pasos: (e, x, _y, rengR) => [`q = ${tx((x / M(e.f)) * -e.dh)} kJ.`, `ΔT = q/(m·c) = ${tx(rengR)} K.`],
    pistas: ['Calcula el calor liberado.', 'Pásalo a julios.', 'ΔT = q/(m·c).']
  })
]

export const RENG_PRACTICAS_B06_S17: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s17-p1', titulo: 'Calor que absorbe una reacción', unidad: 'kJ',
    objetivo: 'Calcular el calor que absorbe una reacción endotérmica para una masa de reactivo.', seccion: '5.3', para: 'las reacciones endotérmicas',
    idealizado: 'Presión constante.', metodo: 'masa molar del núcleo', sinVerificar: [RENG_DH_SIN_VERIFICAR_RQ], lista: RENG_ENDOTERMICAS_RQ, x: [1, 200, 0.5],
    respuesta: (e, x) => (x / M(e.f)) * e.dh,
    errores: (e, x) => [
      ['sin-moles', 'Sin pasar a moles', x * e.dh, 'ΔH está en kJ por mol: pasa la masa a moles.'],
      ['por-mol', 'Calor de un mol', e.dh, 'Ese es el calor de un solo mol; multiplica por los moles.']
    ],
    enunciado: (e, x) => `${e.texto}, ΔH = +${tx(e.dh, 4)} kJ por mol de ${e.n}. Reaccionan ${tx(x)} g de ${T(e.f)}.`, pregunta: '¿Cuánto calor hay que aportar, en kJ?',
    datos: (e, x) => [['Reactivo', `${tx(x)} g de ${T(e.f)}`], ['ΔH', `+${tx(e.dh, 4)} kJ/mol`]],
    pasos: (e, x, _y, rengR) => [`n = ${tx(x / M(e.f))} mol.`, `q = n·ΔH = ${tx(rengR)} kJ.`],
    pistas: ['Pasa a moles.', 'Multiplica por ΔH.', 'Endotérmica: calor absorbido.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s17-p2', titulo: 'Masa transformada con un calor dado', unidad: 'g',
    objetivo: 'Calcular la masa de reactivo que se transforma al aportar una cantidad de calor a una reacción endotérmica.', seccion: '5.3', para: 'las reacciones endotérmicas',
    idealizado: 'Todo el calor se usa en la reacción.', metodo: 'masa molar del núcleo', sinVerificar: [RENG_DH_SIN_VERIFICAR_RQ], lista: RENG_ENDOTERMICAS_RQ, x: [10, 2000, 10],
    respuesta: (e, x) => (x / e.dh) * M(e.f),
    errores: (e, x) => [
      ['moles', 'Moles en lugar de gramos', x / e.dh, 'Ese resultado está en moles; multiplica por la masa molar.'],
      ['invertida', 'División invertida', (e.dh / x) * M(e.f), 'Invertiste el cociente: los moles son calor entre ΔH.']
    ],
    enunciado: (e, x) => `${e.texto}, ΔH = +${tx(e.dh, 4)} kJ por mol de ${e.n}. Se aportan ${tx(x)} kJ.`, pregunta: (e) => `¿Qué masa de ${T(e.f)} se transforma, en g?`,
    datos: (e, x) => [['Calor', `${tx(x)} kJ`], ['ΔH', `+${tx(e.dh, 4)} kJ/mol`]],
    pasos: (e, x, _y, rengR) => [`n = ${tx(x)}/${tx(e.dh, 4)} mol.`, `m = ${tx(rengR)} g.`],
    pistas: ['Divide el calor entre ΔH.', 'Obtienes moles.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s17-p3', titulo: 'Entalpía a partir de una medida', unidad: 'kJ/mol',
    objetivo: 'Calcular la entalpía de una reacción endotérmica a partir del calor absorbido por una masa conocida.', seccion: '5.3', para: 'las reacciones endotérmicas',
    idealizado: 'Medida a presión constante sin pérdidas.', metodo: 'masa molar del núcleo', sinVerificar: [RENG_DH_SIN_VERIFICAR_RQ], lista: RENG_ENDOTERMICAS_RQ, x: [1, 100, 0.5],
    respuesta: (e) => e.dh,
    errores: (e, x) => [
      ['por-gramo', 'Por gramo', ((x / M(e.f)) * e.dh) / x, 'Dividiste entre la masa: ΔH se da por mol, no por gramo.'],
      ['total', 'Calor total', (x / M(e.f)) * e.dh, 'Ese es el calor total; divídelo entre los moles.']
    ],
    enunciado: (e, x) => `Para transformar ${tx(x)} g de ${T(e.f)} (${e.texto}) se absorben ${tx((x / M(e.f)) * e.dh, 4)} kJ.`, pregunta: (e) => `¿Cuánto vale ΔH por mol de ${T(e.f)}, en kJ/mol?`,
    datos: (e, x) => [['Masa', `${tx(x)} g`], ['Calor absorbido', `${tx((x / M(e.f)) * e.dh, 4)} kJ`]],
    pasos: (e, x, _y, rengR) => [`n = ${tx(x / M(e.f))} mol.`, `ΔH = q/n = +${tx(rengR, 4)} kJ/mol.`],
    pistas: ['Pasa la masa a moles.', 'Divide el calor entre los moles.', 'El signo es positivo.']
  })
]

export const RENG_PRACTICAS_B06_S18: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s18-p1', titulo: 'Cambio del número de oxidación', unidad: '', tolerancia: { rel: 0.001, abs: 0.02 },
    objetivo: 'Calcular cuántos electrones gana o pierde cada átomo comparando sus números de oxidación.', seccion: '17.1', para: 'la oxidación y la reducción',
    idealizado: 'Reglas habituales de números de oxidación.', metodo: 'números de oxidación del núcleo', lista: RENG_CAMBIOS_OX_RQ,
    valida: (c) => Math.abs(c.oxA) !== rengDeltaOx(c) && Math.abs(c.oxDe) !== rengDeltaOx(c),
    respuesta: (c) => rengDeltaOx(c),
    errores: (c) => [
      ['final', 'Número de oxidación final', Math.abs(c.oxA), 'Diste el número de oxidación final; los electrones salen de la diferencia con el inicial.'],
      ['inicial', 'Número de oxidación inicial', Math.abs(c.oxDe), 'Diste el número de oxidación inicial; resta el final.']
    ],
    enunciado: (c) => `El ${c.el} pasa de ${T(c.de)} a ${T(c.a)}.`, pregunta: (c) => `¿Cuántos electrones gana o pierde cada átomo de ${c.el}?`,
    datos: (c) => [['Especie inicial', T(c.de)], ['Especie final', T(c.a)]],
    pasos: (c, _x, _y, rengR) => [`${c.el}: ${c.oxDe} → ${c.oxA}.`, `Cambio: ${tx(rengR)} electrones por átomo (${c.oxA > c.oxDe ? 'se oxida' : 'se reduce'}).`],
    pistas: ['Calcula el número inicial.', 'Calcula el final.', 'Resta los dos números.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s18-p2', titulo: 'Moles de electrones transferidos', unidad: 'mol',
    objetivo: 'Calcular los moles de electrones que intercambia una cantidad de sustancia al oxidarse o reducirse.', seccion: '17.1', para: 'la oxidación y la reducción',
    idealizado: 'Transformación completa.', metodo: 'números de oxidación y recuento del núcleo', lista: RENG_CAMBIOS_OX_RQ, x: [0.05, 5, 0.05],
    valida: (c) => Math.abs(c.oxA) * rengDeNo(c.de, c.el) !== rengEFormula(c),
    respuesta: (c, x) => x * rengEFormula(c),
    errores: (c, x) => [
      ['sin-x', 'Sin los moles', rengEFormula(c), 'Esos son los electrones por fórmula; multiplica por los moles.'],
      ['final', 'Con el número final', x * Math.abs(c.oxA) * rengDeNo(c.de, c.el), 'Usaste el número de oxidación final en lugar del cambio.']
    ],
    enunciado: (c, x) => `${tx(x)} mol de ${T(c.de)} se transforman en ${T(c.a)}.`, pregunta: '¿Cuántos moles de electrones se intercambian?',
    datos: (c, x) => [['Cantidad', `${tx(x)} mol de ${T(c.de)}`], ['Producto', T(c.a)]],
    pasos: (c, _x, _y, rengR) => [`Cada fórmula intercambia ${rengEFormula(c)} e⁻ (${rengDeNo(c.de, c.el)} átomo(s) × ${tx(Math.abs(c.oxA - c.oxDe))}).`, `n(e⁻) = ${tx(rengR)} mol.`],
    pistas: ['Cambio por átomo.', 'Átomos por fórmula.', 'Multiplica por los moles.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s18-p3', titulo: 'Sustancia que intercambia unos electrones', unidad: 'g',
    objetivo: 'Calcular la masa de sustancia que se transforma cuando se intercambia una cantidad de electrones.', seccion: '17.1', para: 'la oxidación y la reducción',
    idealizado: 'Transformación completa.', metodo: 'números de oxidación y masas del núcleo', lista: RENG_CAMBIOS_OX_RQ, x: [0.05, 5, 0.05],
    valida: (c) => rengEFormula(c) > 1,
    respuesta: (c, x) => (x / rengEFormula(c)) * M(c.de),
    errores: (c, x) => [
      ['sin-dividir', 'Un electrón por fórmula', x * M(c.de), 'Cada fórmula intercambia varios electrones: divide entre ellos.'],
      ['multiplicada', 'Multiplicando', x * rengEFormula(c) * M(c.de), 'Multiplicaste por los electrones; hay que dividir.']
    ],
    enunciado: (c, x) => `En la transformación de ${T(c.de)} en ${T(c.a)} se intercambian ${tx(x)} mol de electrones.`, pregunta: (c) => `¿Qué masa de ${T(c.de)} se ha transformado, en g?`,
    datos: (c, x) => [['Electrones', `${tx(x)} mol`], ['Especie', `${T(c.de)} → ${T(c.a)}`]],
    pasos: (c, x, _y, rengR) => [`n = ${tx(x)}/${rengEFormula(c)} mol de ${T(c.de)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Electrones por fórmula.', 'Divide para obtener moles.', 'Pasa a gramos.']
  })
]

export const RENG_PRACTICAS_B06_S19: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s19-p1', titulo: 'Electrones que gana un oxidante', unidad: '', tolerancia: { rel: 0.001, abs: 0.02 },
    objetivo: 'Calcular los electrones que gana cada fórmula de un agente oxidante al reducirse.', seccion: '17.1', para: 'los agentes oxidantes',
    idealizado: 'Producto de reducción indicado.', metodo: 'números de oxidación del núcleo', lista: RENG_OXIDANTES_RQ,
    valida: (a) => Math.abs(a.oxP) !== rengEAgente(a) && Math.abs(a.oxF) !== rengEAgente(a),
    respuesta: (a) => rengEAgente(a),
    errores: (a) => [
      ['inicial', 'Número de oxidación inicial', Math.abs(a.oxF), 'Diste el número de oxidación inicial; los electrones salen del cambio.'],
      ['final', 'Número de oxidación final', Math.abs(a.oxP), 'Diste el número de oxidación final; resta el inicial.']
    ],
    enunciado: (a) => `El oxidante ${a.n} se reduce: el ${a.el} pasa de ${T(a.f)} a ${T(a.prod)}.`, pregunta: '¿Cuántos electrones gana cada fórmula del oxidante?',
    datos: (a) => [['Oxidante', T(a.f)], ['Producto', T(a.prod)]],
    pasos: (a, _x, _y, rengR) => [`${a.el}: ${a.oxF} → ${a.oxP}, con ${rengDeNo(a.f, a.el)} átomo(s) por fórmula.`, `Gana ${tx(rengR)} electrones.`],
    pistas: ['Números de oxidación inicial y final.', 'Multiplica por los átomos.', 'El oxidante gana electrones.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s19-p2', titulo: 'Hierro(II) oxidado por un oxidante', unidad: 'mol',
    objetivo: 'Calcular cuántos moles de Fe²⁺ oxida una cantidad de oxidante igualando electrones.', seccion: '17.1', para: 'los agentes oxidantes',
    idealizado: 'Reacción completa; cada Fe²⁺ cede un electrón.', metodo: 'números de oxidación del núcleo', lista: RENG_OXIDANTES_RQ.filter((rengA) => rengA.f !== 'FeCl3'), x: [0.01, 2, 0.01],
    respuesta: (a, x) => x * rengEAgente(a),
    errores: (a, x) => [
      ['uno', 'Uno a uno', x, 'El oxidante gana varios electrones: oxida a varios Fe²⁺.'],
      ['invertida', 'Dividiendo', x / rengEAgente(a), 'Dividiste; cada fórmula de oxidante oxida tantos Fe²⁺ como electrones gana.']
    ],
    enunciado: (a, x) => `Se usan ${tx(x)} mol de ${a.n} para oxidar Fe²⁺ a Fe³⁺.`, pregunta: '¿Cuántos moles de Fe²⁺ oxida?',
    datos: (a, x) => [['Oxidante', `${tx(x)} mol de ${T(a.f)}`], ['Reductor', 'Fe²⁺ → Fe³⁺ (1 e⁻)']],
    pasos: (a, _x, _y, rengR) => [`Cada ${T(a.f)} gana ${rengEAgente(a)} e⁻; cada Fe²⁺ cede 1.`, `n(Fe²⁺) = ${tx(rengR)} mol.`],
    pistas: ['Electrones que gana el oxidante.', 'Uno por cada Fe²⁺.', 'Multiplica.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s19-p3', titulo: 'Oxidante necesario', unidad: 'g',
    objetivo: 'Calcular la masa de oxidante necesaria para oxidar una cantidad de Fe²⁺.', seccion: '17.1', para: 'los agentes oxidantes',
    idealizado: 'Reacción completa.', metodo: 'números de oxidación y masas del núcleo', lista: RENG_OXIDANTES_RQ.filter((rengA) => rengA.f !== 'FeCl3'), x: [0.01, 2, 0.01],
    respuesta: (a, x) => (x / rengEAgente(a)) * M(a.f),
    errores: (a, x) => [
      ['uno', 'Uno a uno', x * M(a.f), 'Cada fórmula de oxidante oxida varios Fe²⁺: divide entre sus electrones.'],
      ['multiplicada', 'Multiplicando', x * rengEAgente(a) * M(a.f), 'Multiplicaste por los electrones en lugar de dividir.']
    ],
    enunciado: (a, x) => `Hay que oxidar ${tx(x)} mol de Fe²⁺ con ${a.n}.`, pregunta: (a) => `¿Qué masa de ${T(a.f)} se necesita, en g?`,
    datos: (a, x) => [['Fe²⁺', `${tx(x)} mol`], ['Oxidante', T(a.f)]],
    pasos: (a, x, _y, rengR) => [`n(oxidante) = ${tx(x)}/${rengEAgente(a)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Electrones que gana el oxidante.', 'Divide los moles de Fe²⁺.', 'Pasa a gramos.']
  })
]

export const RENG_PRACTICAS_B06_S20: readonly RengPracticaN1[] = [
  rengPracticaRq({
    id: 'n1-b6-s20-p1', titulo: 'Electrones que cede un reductor', unidad: 'mol',
    objetivo: 'Calcular los moles de electrones que cede una masa de agente reductor.', seccion: '17.1', para: 'los agentes reductores',
    idealizado: 'Oxidación completa al producto indicado.', metodo: 'números de oxidación y masas del núcleo', lista: RENG_REDUCTORES_RQ, x: [0.5, 50, 0.5],
    valida: (a) => rengEAgente(a) > 1,
    respuesta: (a, x) => (x / M(a.f)) * rengEAgente(a),
    errores: (a, x) => [
      ['sin-e', 'Moles de reductor', x / M(a.f), 'Esos son los moles de reductor; multiplica por los electrones que cede cada uno.'],
      ['sin-moles', 'Sin pasar a moles', x * rengEAgente(a), 'Multiplicaste la masa por los electrones sin pasarla antes a moles.']
    ],
    enunciado: (a, x) => `Se oxidan ${tx(x)} g de ${a.n}: ${T(a.f)} → ${T(a.prod)}.`, pregunta: '¿Cuántos moles de electrones cede?',
    datos: (a, x) => [['Reductor', `${tx(x)} g de ${T(a.f)}`], ['Producto', T(a.prod)]],
    pasos: (a, x, _y, rengR) => [`n = ${tx(x / M(a.f))} mol; cada fórmula cede ${rengEAgente(a)} e⁻.`, `n(e⁻) = ${tx(rengR)} mol.`],
    pistas: ['Pasa a moles.', 'Electrones por fórmula.', 'Multiplica.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s20-p2', titulo: 'Reductor para reducir plata', unidad: 'g',
    objetivo: 'Calcular la masa de reductor necesaria para reducir una cantidad de iones Ag⁺.', seccion: '17.1', para: 'los agentes reductores',
    idealizado: 'Reacción completa; cada Ag⁺ gana un electrón.', metodo: 'números de oxidación y masas del núcleo', lista: RENG_REDUCTORES_RQ, x: [0.01, 2, 0.01],
    valida: (a) => rengEAgente(a) > 1,
    respuesta: (a, x) => (x / rengEAgente(a)) * M(a.f),
    errores: (a, x) => [
      ['uno', 'Uno a uno', x * M(a.f), 'Cada fórmula de reductor cede varios electrones: reduce a varios Ag⁺.'],
      ['multiplicada', 'Multiplicando', x * rengEAgente(a) * M(a.f), 'Multiplicaste por los electrones en lugar de dividir.']
    ],
    enunciado: (a, x) => `Hay que reducir ${tx(x)} mol de Ag⁺ a Ag con ${a.n} (${T(a.f)} → ${T(a.prod)}).`, pregunta: (a) => `¿Qué masa de ${T(a.f)} se necesita, en g?`,
    datos: (a, x) => [['Ag⁺', `${tx(x)} mol`], ['Reductor', T(a.f)]],
    pasos: (a, x, _y, rengR) => [`n(reductor) = ${tx(x)}/${rengEAgente(a)}.`, `m = ${tx(rengR)} g.`],
    pistas: ['Electrones que cede el reductor.', 'Uno por cada Ag⁺.', 'Pasa a gramos.']
  }),
  rengPracticaRq({
    id: 'n1-b6-s20-p3', titulo: 'Hidrógeno liberado por un metal', unidad: 'mol',
    objetivo: 'Relacionar los electrones que cede un metal con el H₂ que libera de un ácido.', seccion: '17.1', para: 'los agentes reductores',
    idealizado: 'Ácido en exceso; cada H₂ requiere 2 electrones.', metodo: 'números de oxidación y masas del núcleo', lista: RENG_METALES_ACIDO_RQ, x: [0.5, 30, 0.5],
    valida: (a) => rengEAgente(a) !== 2,
    respuesta: (a, x) => ((x / M(a.f)) * rengEAgente(a)) / 2,
    errores: (a, x) => [
      ['sin-dividir', 'Moles de electrones', (x / M(a.f)) * rengEAgente(a), 'Esos son moles de electrones; cada H₂ necesita dos.'],
      ['un-h2', 'Un H₂ por átomo', x / M(a.f), 'No siempre sale un H₂ por átomo de metal: depende de los electrones que cede.']
    ],
    enunciado: (a, x) => `Se disuelven ${tx(x)} g de ${a.n} en ácido clorhídrico en exceso (${T(a.f)} → ${T(a.prod)}).`, pregunta: '¿Cuántos moles de H₂ se desprenden?',
    datos: (a, x) => [['Metal', `${tx(x)} g de ${T(a.f)}`], ['Electrones por átomo', String(rengEAgente(a))]],
    pasos: (a, x, _y, rengR) => [`n(e⁻) = ${tx((x / M(a.f)) * rengEAgente(a))} mol.`, `n(H₂) = n(e⁻)/2 = ${tx(rengR)} mol.`],
    pistas: ['Calcula los electrones cedidos.', 'Cada H₂ toma dos.', 'Divide entre 2.']
  })
]
