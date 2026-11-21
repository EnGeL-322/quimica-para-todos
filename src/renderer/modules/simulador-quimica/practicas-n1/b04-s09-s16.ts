import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_ANGULO_VSEPR } from '../escenas-n1/modelos/geometria-vsepr'
import { RENG_PARAMETRO_RED } from '../nucleo/datosEnlace'
import {
  RENG_ANILLOS_EN, RENG_CENTRALES_EN, RENG_D_E_PM_EN, RENG_ENLACES_EN, RENG_FORMULAS_INSATURACION_EN, RENG_METALES_RED_EN, RENG_NA_EN, RENG_SIGMA_PI_EN, RENG_TOL_EN_ENT, RENG_VSEPR_CON_PARES_EN, RENG_VSEPR_EN, rengAEn, rengAtomosTotalesEn,
  rengChiEn, rengDeltaChiEn, rengInsaturacionEn, rengNombreEn, rengParesCentralEn, rengPracticaEn, rengValEn, rengZEn
} from './b04-comun'
import type { RengMetalEn } from './b04-comun'
import { rengCargaAt } from './b02-comun'
import { rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const E = RENG_TOL_EN_ENT
const UNO: readonly number[] = [0]
const rad = (rengG: number): number => (rengG * Math.PI) / 180
const a = (rengS: string): number => RENG_PARAMETRO_RED[rengS]!.valor
export const rengRadioMetalEn = ([rengS, rengN]: RengMetalEn): number => (rengN === 4 ? (a(rengS) * Math.SQRT2) / 4 : (a(rengS) * Math.sqrt(3)) / 4)
export const rengDensidadMetalEn = (rengS: string, rengN: number): number => (rengN * rengAEn(rengS)) / (RENG_NA_EN * (a(rengS) * 1e-8) ** 3)
export const RENG_UMBRALES_EN: ReadonlyArray<readonly [string, number]> = ['F', 'O', 'Cl', 'N', 'Br', 'S', 'I', 'C', 'Se', 'H', 'P'].flatMap((s) => [[s, 1.7] as const, [s, 0.4] as const])
export const RENG_DIPOLOS_EN: ReadonlyArray<readonly [string, number, number]> = [
  ['HF', 1.82, 92], ['HCl', 1.08, 127], ['HBr', 0.82, 141], ['HI', 0.44, 161], ['CO', 0.11, 113], ['NO', 0.16, 115], ['LiF', 6.33, 156], ['NaCl', 9.0, 236], ['KBr', 10.41, 282], ['LiH', 5.88, 160], ['KCl', 10.27, 267], ['CsCl', 10.42, 291],
  ['ClF', 0.89, 163], ['BrF', 1.42, 176], ['ICl', 1.24, 232]
]
export const RENG_DIPOLOS_NOTA_EN = 'Momentos dipolares (D) y longitudes de enlace (pm) de moléculas diatómicas en fase gas: valores de tablas recordados, no contrastados en esta entrega.'
export const RENG_ANGULARES_EN: ReadonlyArray<readonly [string, number]> = [['el agua', 104.5], ['el sulfuro de hidrógeno', 92.1], ['el dióxido de azufre', 119], ['el difluoruro de oxígeno', 103], ['el ozono', 117], ['el dióxido de nitrógeno', 134], ['una molécula angular de 120°', 120], ['una molécula angular de 109,5°', 109.5], ['el dicloruro de azufre', 103]]
export const RENG_GEOMETRIAS_EN: ReadonlyArray<readonly [string, number, number]> = [
  ['H2O', 0.9572, 104.52], ['NH3', 1.012, 106.7], ['BF3', 1.307, 120], ['CH4', 1.087, 109.5], ['SO2', 1.43, 119], ['H2S', 1.34, 92.1], ['CCl4', 1.77, 109.5], ['PCl3', 2.04, 100], ['NF3', 1.37, 102], ['OF2', 1.41, 103], ['SO3', 1.42, 120], ['SiH4', 1.48, 109.5],
  ['NO2', 1.2, 134], ['O3', 1.28, 117], ['SiCl4', 2.02, 109.5], ['PH3', 1.42, 93.5]
]
export const RENG_GEOMETRIAS_NOTA_EN = 'Longitudes y ángulos de enlace: H₂O, NH₃ y BF₃ proceden del núcleo de la app (NIST CCCBDB); los demás son valores de tablas recordados, no contrastados en esta entrega.'
export const RENG_DESVIACIONES_EN: ReadonlyArray<readonly [string, number, number]> = [
  ['el agua, H₂O', 109.5, 104.52], ['el amoníaco, NH₃', 109.5, 106.7], ['el sulfuro de hidrógeno, H₂S', 109.5, 92.1], ['la fosfina, PH₃', 109.5, 93.5], ['el dióxido de azufre, SO₂', 120, 119], ['el trifluoruro de nitrógeno, NF₃', 109.5, 102],
  ['el difluoruro de oxígeno, OF₂', 109.5, 103], ['el tricloruro de fósforo, PCl₃', 109.5, 100], ['el eteno (ángulo H–C–H)', 120, 117.4], ['el seleniuro de hidrógeno, H₂Se', 109.5, 91], ['el ozono, O₃', 120, 117], ['el trifluoruro de cloro, ClF₃', 90, 87.5],
  ['la arsina, AsH₃', 109.5, 92], ['el telururo de hidrógeno, H₂Te', 109.5, 90], ['el tricloruro de nitrógeno, NCl₃', 109.5, 107], ['el dicloruro de azufre, SCl₂', 109.5, 103]
]
export const RENG_HIBRIDOS_C_EN: ReadonlyArray<readonly [string, string, readonly number[], number]> = [
  ['eteno', 'C2H4', [3, 3], 0], ['etino', 'C2H2', [2, 2], 0], ['propeno', 'C3H6', [3, 3, 4], 0], ['propino', 'C3H4', [2, 2, 4], 0], ['benceno', 'C6H6', [3, 3, 3, 3, 3, 3], 1], ['1,3-butadieno', 'C4H6', [3, 3, 3, 3], 0], ['tolueno', 'C7H8', [3, 3, 3, 3, 3, 3, 4], 1],
  ['estireno', 'C8H8', [3, 3, 3, 3, 3, 3, 3, 3], 1], ['aleno', 'C3H4', [3, 2, 3], 0], ['vinilacetileno', 'C4H4', [3, 3, 2, 2], 0], ['1-buteno', 'C4H8', [3, 3, 4, 4], 0], ['2-butino', 'C4H6', [4, 2, 2, 4], 0], ['ciclohexeno', 'C6H10', [3, 3, 4, 4, 4, 4], 1],
  ['naftaleno', 'C10H8', [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], 2], ['1,3,5-hexatrieno', 'C6H8', [3, 3, 3, 3, 3, 3], 0], ['fenilacetileno', 'C8H6', [3, 3, 3, 3, 3, 3, 2, 2], 1]
]
export const RENG_ATOMOS_HIBRIDOS_EN: ReadonlyArray<readonly [string, number]> = [
  ['el carbono del metano', 4], ['cada carbono del eteno', 3], ['el carbono del metanal', 3], ['el boro del BF₃', 3], ['el nitrógeno del amoníaco (ángulo ideal)', 4], ['el oxígeno del agua (ángulo ideal)', 4], ['cada carbono del benceno', 3],
  ['el carbono del CCl₄', 4], ['el silicio del SiH₄', 4], ['el azufre del SO₃', 3], ['el carbono central de la acetona', 3], ['cada carbono del etano', 4], ['el nitrógeno del ion nitrato', 3], ['el carbono del ion carbonato', 3], ['el nitrógeno del ion amonio', 4],
  ['cada carbono del grafito', 3], ['cada carbono del diamante', 4], ['el fósforo del PCl₃ (ángulo ideal)', 4]
]
export const RENG_VSEPR_3_4_EN = RENG_VSEPR_EN.filter(([, x, e]) => x + e === 3 || x + e === 4)
export const RENG_FAMILIAS_EN: ReadonlyArray<readonly [string, number, number]> = [['alcano', 2, 0], ['cicloalcano (un anillo)', 0, 1], ['alqueno con un doble enlace', 0, 0], ['alquino con un triple enlace', -2, 0]]
const suma = (rengL: readonly number[]): number => rengL.reduce((rengA, rengB) => rengA + rengB, 0)

export const RENG_PRACTICAS_B04_S09: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s9-p1', titulo: 'Masa de un trozo de metal', unidad: 'g',
    objetivo: 'Calcular la masa de un volumen de metal a partir de su celda unidad.', seccion: '10.5', para: 'los sólidos metálicos', nucleo: true, masas: true,
    idealizado: 'Cristal perfecto, sin huecos ni defectos.', metodo: 'masa de los átomos de la celda con la unidad de masa atómica', lista: RENG_METALES_RED_EN, x: [1, 50, 0.5],
    respuesta: ([s, n], x) => x * rengDensidadMetalEn(s, n),
    errores: ([s, n], x) => [
      ['otra-red', 'Átomos de la otra red', x * rengDensidadMetalEn(s, n === 4 ? 2 : 4), 'Usaste los átomos por celda de la otra red: la centrada en las caras tiene 4 y la centrada en el cuerpo, 2.'],
      ['un-atomo', 'Un átomo por celda', x * rengDensidadMetalEn(s, 1), 'Supusiste un solo átomo por celda; cuenta los que le corresponden a esta red.']
    ],
    enunciado: ([s, n, red]) => `El ${rengNombreEn(s)} cristaliza en una red ${red} (${n} átomos por celda) de arista ${tx(a(s), 5)} Å. Su masa atómica es ${tx(rengAEn(s), 5)} u.`,
    pregunta: (_e, x) => `¿Qué masa tienen ${tx(x)} cm³ de metal, en g?`,
    datos: ([s, n], x) => [['Celda', `${n} átomos; a = ${tx(a(s), 5)} Å = ${tx(a(s), 5)}·10⁻⁸ cm`], ['Masa atómica', `${tx(rengAEn(s), 5)} g/mol`], ['Volumen', `${tx(x)} cm³`]],
    pasos: ([s, n], x, _y, rengR) => [`ρ = n·M/(N_A·a³) = ${tx(rengDensidadMetalEn(s, n), 4)} g/cm³.`, `m = ρ × ${tx(x)} = ${tx(rengR)} g.`],
    pistas: ['Calcula la masa de una celda.', 'Divide entre el volumen de la celda.', 'Multiplica la densidad por el volumen.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s9-p2', titulo: 'Fila de átomos de un metal', unidad: 'µm',
    objetivo: 'Calcular el radio metálico a partir de la celda unidad y usarlo para medir una fila de átomos en contacto.', seccion: '10.5', para: 'los sólidos metálicos', nucleo: true,
    idealizado: 'Átomos esféricos en contacto.', metodo: 'radio obtenido de a² por el teorema de Pitágoras', lista: RENG_METALES_RED_EN, x: [1, 20, 0.5],
    respuesta: (m, x) => 200 * rengRadioMetalEn(m) * x,
    errores: (m, x) => [
      ['radio', 'Con el radio', 100 * rengRadioMetalEn(m) * x, 'Cada átomo ocupa un diámetro, no un radio, en la fila.'],
      ['arista', 'Con la arista', 100 * a(m[0]) * x, 'Usaste la arista de la celda como tamaño del átomo; los átomos se tocan en la diagonal.']
    ],
    enunciado: ([s, n, red]) => `El ${rengNombreEn(s)} tiene una red ${red} de arista ${tx(a(s), 5)} Å. Los átomos se tocan a lo largo de la diagonal ${n === 4 ? 'de una cara (4r = a·√2)' : 'del cubo (4r = a·√3)'}.`,
    pregunta: (_e, x) => `¿Cuánto mide una fila de ${tx(x)} millones de átomos en contacto, en µm?`,
    datos: ([s, n], x) => [['Arista', `${tx(a(s), 5)} Å`], ['Contacto', n === 4 ? '4r = a·√2' : '4r = a·√3'], ['Átomos', `${tx(x)}·10⁶`]],
    pasos: (m, x, _y, rengR) => [`r = ${tx(rengRadioMetalEn(m), 4)} Å; cada átomo ocupa 2r.`, `L = ${tx(x)}·10⁶ × 2r = ${tx(rengR)} µm (1 µm = 10⁴ Å).`],
    pistas: ['Despeja el radio de la diagonal.', 'Cada átomo ocupa un diámetro.', 'Pasa los ángstroms a micrómetros.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s9-p3', titulo: 'Electrones del mar metálico', unidad: '',
    objetivo: 'Calcular los electrones de valencia deslocalizados en una masa de metal.', seccion: '10.5', para: 'el enlace metálico', masas: true,
    idealizado: 'Cada átomo cede todos sus electrones de valencia al mar.', metodo: 'masa molar del núcleo y recuento por otra vía', lista: RENG_METALES_RED_EN, x: [1, 100, 0.5],
    respuesta: ([s, , , v], x) => ((x / rengAEn(s)) * v * RENG_NA_EN) / 1e22,
    errores: ([s, , , v], x) => [
      ['todos', 'Todos los electrones', ((x / rengAEn(s)) * rengZEn(s) * RENG_NA_EN) / 1e22, 'Contaste todos los electrones del átomo; al mar solo van los de valencia.'],
      ['sin-avogadro', 'En moles', (x / rengAEn(s)) * v, 'Ese resultado está en moles de electrones; multiplícalo por N_A.']
    ],
    enunciado: ([s, , , v], x) => `En el ${rengNombreEn(s)} metálico, cada átomo aporta ${v} ${v === 1 ? 'electrón' : 'electrones'} de valencia al mar de electrones. Se tiene una pieza de ${tx(x)} g.`,
    pregunta: '¿Cuántos electrones deslocalizados contiene, en múltiplos de 10²²?',
    datos: ([s, , , v], x) => [['Masa', `${tx(x)} g`], ['Masa atómica', `${tx(rengAEn(s), 5)} g/mol`], ['Electrones por átomo', String(v)]],
    pasos: ([s, , , v], x, _y, rengR) => [`n = ${tx(x)}/${tx(rengAEn(s), 5)} = ${tx(x / rengAEn(s))} mol de átomos.`, `Electrones = n × ${v} × N_A = ${tx(rengR)}·10²².`],
    pistas: ['Pasa la masa a moles de átomos.', 'Multiplica por los electrones de valencia.', 'Multiplica por N_A.']
  })
]

export const RENG_PRACTICAS_B04_S10: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s10-p1', titulo: 'Diferencia de electronegatividad de un enlace', unidad: '',
    objetivo: 'Calcular la diferencia de electronegatividad de un enlace y clasificarlo.', seccion: '7.2', para: 'la polaridad de los enlaces', en: true,
    idealizado: 'Escala de Pauling.', metodo: 'escena «polaridad-enlace»', lista: RENG_ENLACES_EN,
    respuesta: (e) => rengDeltaChiEn(e),
    errores: ([p, s]) => [
      ['suma', 'Sumando', rengChiEn(p) + rengChiEn(s), 'Sumaste las electronegatividades; la polaridad depende de su diferencia.'],
      ['media', 'La media', (rengChiEn(p) + rengChiEn(s)) / 2, 'Calculaste la media; se pide la diferencia.']
    ],
    enunciado: ([p, s]) => `En la escala de Pauling, el ${rengNombreEn(p)} vale ${tx(rengChiEn(p))} y el ${rengNombreEn(s)}, ${tx(rengChiEn(s))}.`,
    pregunta: ([p, s]) => `¿Cuál es la diferencia de electronegatividad del enlace ${p}–${s}?`,
    datos: ([p, s]) => [[p, tx(rengChiEn(p))], [s, tx(rengChiEn(s))]],
    pasos: (e, _x, _y, rengR) => [`Δχ = |${tx(rengChiEn(e[0]))} − ${tx(rengChiEn(e[1]))}|.`, `Δχ = ${tx(rengR)}: enlace ${rengR > 1.7 ? 'predominantemente iónico' : rengR >= 0.4 ? 'covalente polar' : 'covalente apolar'}.`],
    pistas: ['Identifica el valor mayor.', 'Resta el menor del mayor.', 'Compara con 0,4 y 1,7.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s10-p2', titulo: 'Diferencia necesaria para un carácter iónico', unidad: '',
    objetivo: 'Despejar la diferencia de electronegatividad que corresponde a un porcentaje de carácter iónico.', seccion: '7.2', para: 'el carácter iónico de los enlaces',
    idealizado: 'Relación empírica de Pauling.', metodo: 'búsqueda por bisección con la función del núcleo de la app', sinVerificar: ['La relación de Pauling % iónico = 100·(1 − e^(−Δχ²/4)) es una fórmula empírica recordada.'], lista: UNO, x: [5, 90, 1],
    respuesta: (_e, x) => Math.sqrt(-4 * Math.log(1 - x / 100)),
    errores: (_e, x) => [
      ['sin-raiz', 'Sin la raíz', -4 * Math.log(1 - x / 100), 'Falta la raíz cuadrada: ese valor es Δχ², no Δχ.'],
      ['sin-cuatro', 'Sin el factor 4', Math.sqrt(-Math.log(1 - x / 100)), 'Olvidaste el 4 que divide a Δχ² en el exponente.']
    ],
    enunciado: (_e, x) => `Según la relación de Pauling, el carácter iónico de un enlace es % = 100·(1 − e^(−Δχ²/4)). Un enlace tiene un ${x} % de carácter iónico.`,
    pregunta: '¿Qué diferencia de electronegatividad le corresponde?',
    datos: (_e, x) => [['Carácter iónico', `${x} %`], ['Fórmula', '% = 100·(1 − e^(−Δχ²/4))']],
    pasos: (_e, x, _y, rengR) => [`e^(−Δχ²/4) = 1 − ${tx(x / 100)} → Δχ² = −4·ln(${tx(1 - x / 100)}).`, `Δχ = ${tx(rengR)}.`],
    pistas: ['Despeja la exponencial.', 'Toma el logaritmo natural.', 'Multiplica por 4 y haz la raíz.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s10-p3', titulo: 'Electronegatividad límite', unidad: '',
    objetivo: 'Calcular la electronegatividad máxima de un átomo para que su enlace con otro supere un umbral de polaridad.', seccion: '7.2', para: 'la clasificación de los enlaces', en: true,
    idealizado: 'Umbrales orientativos de 0,4 y 1,7.', metodo: 'escena «polaridad-enlace» (búsqueda del valor límite)', lista: RENG_UMBRALES_EN,
    respuesta: ([s, u]) => rengChiEn(s) - u,
    errores: ([s, u]) => [
      ['suma', 'Sumando el umbral', rengChiEn(s) + u, 'Sumaste el umbral; el otro átomo es menos electronegativo, así que hay que restarlo.'],
      ['umbral', 'El umbral', u, 'Ese valor es el umbral de la diferencia, no la electronegatividad del átomo.']
    ],
    enunciado: ([s, u]) => `El ${rengNombreEn(s)} tiene una electronegatividad de ${tx(rengChiEn(s))}. Un enlace se considera ${u === 1.7 ? 'predominantemente iónico' : 'polar'} cuando la diferencia es de ${tx(u)} o más.`,
    pregunta: ([s, u]) => `¿Qué electronegatividad debe tener, como máximo, un átomo menos electronegativo para que su enlace con el ${rengNombreEn(s)} sea ${u === 1.7 ? 'iónico' : 'polar'}?`,
    datos: ([s, u]) => [[s, tx(rengChiEn(s))], ['Umbral', tx(u)]],
    pasos: ([s, u], _x, _y, rengR) => [`χ = ${tx(rengChiEn(s))} − ${tx(u)}.`, `χ ≤ ${tx(rengR)}.`],
    pistas: ['El otro átomo es menos electronegativo.', 'La diferencia debe alcanzar el umbral.', 'Resta el umbral del valor dado.']
  })
]

export const RENG_PRACTICAS_B04_S11: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s11-p1', titulo: 'Momento dipolar de dos cargas', unidad: 'D',
    objetivo: 'Calcular el momento dipolar de dos cargas parciales opuestas separadas una distancia.', seccion: '7.6', para: 'el momento dipolar',
    idealizado: 'Dos cargas puntuales.', metodo: 'producto en culombios por metro convertido a debyes', sinVerificar: ['El factor 1 e·pm = 0,048032 D (1 D = 3,33564·10⁻³⁰ C·m) es un valor recordado.'], lista: UNO, x: [5, 100, 5], y: [80, 250, 5],
    respuesta: (_e, x, y) => (x / 100) * y * RENG_D_E_PM_EN,
    errores: (_e, x, y) => [
      ['sin-factor', 'Sin pasar a debyes', (x / 100) * y, 'Ese valor está en e·pm; multiplícalo por 0,048032 para pasarlo a debyes.'],
      ['carga-completa', 'Con la carga completa', y * RENG_D_E_PM_EN, 'Usaste una carga elemental completa; la carga parcial es solo una fracción.']
    ],
    enunciado: (_e, x, y) => `En un enlace, los átomos llevan cargas parciales de +${tx(x / 100)} e y −${tx(x / 100)} e separadas ${y} pm. Dato: 1 e·pm = 0,048032 D.`,
    pregunta: '¿Cuál es el momento dipolar del enlace, en D?',
    datos: (_e, x, y) => [['Carga parcial', `${tx(x / 100)} e`], ['Distancia', `${y} pm`], ['Factor', '1 e·pm = 0,048032 D']],
    pasos: (_e, x, y, rengR) => [`μ = δ·d = ${tx(x / 100)} × ${y} = ${tx((x / 100) * y)} e·pm.`, `μ = ${tx(rengR)} D.`],
    pistas: ['Multiplica carga por distancia.', 'Usa la carga parcial, no la completa.', 'Convierte e·pm a debyes.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s11-p2', titulo: 'Carga parcial a partir del momento dipolar', unidad: '%',
    objetivo: 'Estimar la carga parcial de los átomos de una molécula diatómica a partir de su momento dipolar medido.', seccion: '7.6', para: 'el momento dipolar', tablas: true,
    idealizado: 'Dos cargas puntuales situadas en los núcleos.', metodo: 'momento con cargas completas calculado en culombios por metro', sinVerificar: [RENG_DIPOLOS_NOTA_EN], lista: RENG_DIPOLOS_EN,
    respuesta: ([, m, d]) => (m / (d * RENG_D_E_PM_EN)) * 100,
    errores: ([, m, d]) => [
      ['sin-factor', 'Sin el factor de conversión', (m / d) * 100, 'Dividiste debyes entre picómetros sin convertir: 1 e·pm = 0,048032 D.'],
      ['fraccion', 'En tanto por uno', m / (d * RENG_D_E_PM_EN), 'Ese valor es la fracción de carga; multiplícala por cien.']
    ],
    enunciado: ([f, m, d]) => `La molécula ${T(f)} tiene un momento dipolar de ${tx(m)} D y una longitud de enlace de ${d} pm. Dato: 1 e·pm = 0,048032 D.`,
    pregunta: '¿Qué porcentaje de la carga elemental representa la carga parcial de cada átomo?',
    datos: ([, m, d]) => [['μ medido', `${tx(m)} D`], ['Longitud', `${d} pm`], ['μ con cargas completas', `${tx(d * RENG_D_E_PM_EN, 4)} D`]],
    pasos: ([, m, d], _x, _y, rengR) => [`Con cargas completas: ${d} × 0,048032 = ${tx(d * RENG_D_E_PM_EN, 4)} D.`, `δ = ${tx(m)}/${tx(d * RENG_D_E_PM_EN, 4)} = ${tx(rengR)} %.`],
    pistas: ['Calcula el momento con cargas completas.', 'Divide el medido entre ese valor.', 'Pasa el resultado a porcentaje.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s11-p3', titulo: 'Momento dipolar de una molécula angular', unidad: 'D',
    objetivo: 'Sumar como vectores los momentos de dos enlaces iguales para obtener el momento de una molécula angular.', seccion: '7.6', para: 'la polaridad de las moléculas', tablas: true,
    idealizado: 'Dos dipolos de enlace iguales; sin contribución de los pares libres.', metodo: 'suma de componentes de los dos vectores', sinVerificar: ['Ángulos de enlace de tablas recordados (el del agua procede del núcleo de la app).'], lista: RENG_ANGULARES_EN, x: [0.5, 2, 0.05],
    respuesta: ([, t], x) => 2 * x * Math.cos(rad(t / 2)),
    errores: ([, t], x) => [
      ['suma-escalar', 'Suma sin dirección', 2 * x, 'Sumaste los dos momentos como números; son vectores y forman un ángulo.'],
      ['seno', 'Con el seno', 2 * x * Math.sin(rad(t / 2)), 'Usaste el seno; la componente a lo largo de la bisectriz va con el coseno de la mitad del ángulo.']
    ],
    enunciado: ([n, t], x) => `En ${n}, los dos enlaces forman un ángulo de ${tx(t, 4)}° y cada uno tiene un momento dipolar de ${tx(x)} D.`,
    pregunta: '¿Cuál es el momento dipolar resultante de la molécula, en D?',
    datos: ([, t], x) => [['Momento de cada enlace', `${tx(x)} D`], ['Ángulo', `${tx(t, 4)}°`]],
    pasos: ([, t], x, _y, rengR) => [`μ = 2·μ(enlace)·cos(θ/2) = 2 × ${tx(x)} × cos(${tx(t / 2, 4)}°).`, `μ = ${tx(rengR)} D.`],
    pistas: ['Los dipolos se suman como vectores.', 'Proyecta cada uno sobre la bisectriz.', 'Usa el coseno de la mitad del ángulo.']
  })
]

export const RENG_PRACTICAS_B04_S12: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s12-p1', titulo: 'Distancia entre átomos no enlazados', unidad: 'Å',
    objetivo: 'Calcular la distancia entre dos átomos unidos al mismo átomo central con la longitud y el ángulo de enlace.', seccion: '7.6', para: 'la geometría molecular', nucleo: true, tablas: true,
    idealizado: 'Molécula rígida en su geometría de equilibrio.', metodo: 'teorema del coseno', sinVerificar: [RENG_GEOMETRIAS_NOTA_EN], lista: RENG_GEOMETRIAS_EN,
    respuesta: ([, d, t]) => 2 * d * Math.sin(rad(t / 2)),
    errores: ([, d, t]) => [
      ['coseno', 'Con el coseno', 2 * d * Math.cos(rad(t / 2)), 'Usaste el coseno; la mitad de la distancia buscada es d·sen(θ/2).'],
      ['suma', 'Sumando las longitudes', 2 * d, 'Sumaste las dos longitudes de enlace, como si la molécula fuera lineal.']
    ],
    enunciado: ([f, d, t]) => `En la molécula ${T(f)}, los enlaces con el átomo central miden ${tx(d, 4)} Å y dos de ellos forman un ángulo de ${tx(t, 5)}°.`,
    pregunta: '¿Qué distancia separa los dos átomos unidos al central, en Å?',
    datos: ([, d, t]) => [['Longitud de enlace', `${tx(d, 4)} Å`], ['Ángulo', `${tx(t, 5)}°`]],
    pasos: ([, d, t], _x, _y, rengR) => [`x = 2·d·sen(θ/2) = 2 × ${tx(d, 4)} × sen(${tx(t / 2, 4)}°).`, `x = ${tx(rengR, 4)} Å.`],
    pistas: ['Dibuja el triángulo isósceles.', 'Divide el ángulo en dos.', 'Usa el seno de la mitad.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s12-p2', titulo: 'Ángulo real frente al ideal', unidad: '',
    objetivo: 'Comparar el ángulo de enlace medido de una molécula con el ángulo ideal de su disposición.', seccion: '7.6', para: 'la geometría molecular', nucleo: true, tablas: true,
    idealizado: 'Ángulos ideales de la teoría VSEPR.', metodo: 'resta en el orden inverso cambiada de signo', sinVerificar: [RENG_GEOMETRIAS_NOTA_EN], lista: RENG_DESVIACIONES_EN,
    respuesta: ([, i, r]) => i - r,
    errores: ([, i, r]) => [
      ['suma', 'Sumando', i + r, 'Sumaste los dos ángulos; se pide cuánto se desvía uno del otro.'],
      ['media', 'La media', (i + r) / 2, 'Calculaste la media de los ángulos; se pide la diferencia.']
    ],
    enunciado: ([t, i, r]) => `En ${t}, el ángulo de enlace medido es ${tx(r, 5)}° y el ideal de su disposición electrónica, ${tx(i, 4)}°.`,
    pregunta: '¿Cuántos grados se cierra el ángulo real respecto al ideal?',
    datos: ([, i, r]) => [['Ángulo ideal', `${tx(i, 4)}°`], ['Ángulo medido', `${tx(r, 5)}°`]],
    pasos: ([, i, r], _x, _y, rengR) => [`${tx(i, 4)} − ${tx(r, 5)}.`, `= ${tx(rengR)}°: los pares libres repelen más que los enlaces.`],
    pistas: ['Resta el medido del ideal.', 'Los pares libres cierran el ángulo.', 'El resultado es positivo.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s12-p3', titulo: 'Ángulo a partir de las distancias', unidad: '',
    objetivo: 'Deducir el ángulo de enlace de una molécula a partir de la longitud de enlace y la distancia entre átomos terminales.', seccion: '7.6', para: 'la geometría molecular', nucleo: true, tablas: true,
    idealizado: 'Molécula rígida en su geometría de equilibrio.', metodo: 'teorema del coseno despejando el ángulo', sinVerificar: [RENG_GEOMETRIAS_NOTA_EN], lista: RENG_GEOMETRIAS_EN,
    respuesta: ([, , t]) => t,
    errores: ([, , t]) => [
      ['mitad', 'La mitad del ángulo', t / 2, 'Ese es el ángulo de medio triángulo; el ángulo de enlace es el doble.'],
      ['coseno', 'Con el arco coseno', 180 - t, 'Usaste el arco coseno; la relación es sen(θ/2) = x/(2d).']
    ],
    enunciado: ([f, d, t]) => `En la molécula ${T(f)}, los enlaces con el átomo central miden ${tx(d, 4)} Å y dos átomos unidos a él están separados ${tx(2 * d * Math.sin(rad(t / 2)), 6)} Å.`,
    pregunta: '¿Qué ángulo forman esos dos enlaces, en grados?',
    datos: ([, d, t]) => [['Longitud de enlace', `${tx(d, 4)} Å`], ['Distancia entre átomos', `${tx(2 * d * Math.sin(rad(t / 2)), 6)} Å`]],
    pasos: ([, d, t], _x, _y, rengR) => [`sen(θ/2) = x/(2d) = ${tx(Math.sin(rad(t / 2)), 4)}.`, `θ = ${tx(rengR, 4)}°.`],
    pistas: ['Usa medio triángulo isósceles.', 'Calcula el arco seno.', 'Multiplica el resultado por dos.']
  })
]

export const RENG_PRACTICAS_B04_S13: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s13-p1', titulo: 'Dominios electrónicos', unidad: '', tolerancia: E,
    objetivo: 'Contar los dominios electrónicos del átomo central de una molécula.', seccion: '7.6', para: 'la teoría VSEPR', lewis: true,
    idealizado: 'Un enlace múltiple cuenta como un dominio.', metodo: 'escena «geometria-vsepr»', lista: RENG_VSEPR_EN,
    respuesta: ([, x, e]) => x + e,
    errores: ([, x, e]) => [
      ['electrones', 'Contando electrones', 2 * (x + e), 'Contaste electrones; cada dominio (enlace o par libre) cuenta una sola vez.'],
      ['con-central', 'Contando el átomo central', x + 1, 'Contaste el átomo central en lugar de sus pares libres.']
    ],
    enunciado: ([f, x, e]) => `En ${T(f)}, el átomo central está unido a ${x} ${x === 1 ? 'átomo' : 'átomos'} y tiene ${e} ${e === 1 ? 'par libre' : 'pares libres'}.`,
    pregunta: '¿Cuántos dominios electrónicos rodean al átomo central?',
    datos: ([, x, e]) => [['Átomos unidos', String(x)], ['Pares libres', String(e)]],
    pasos: ([, x, e], _x, _y, rengR) => [`Dominios = ${x} + ${e}.`, `= ${tx(rengR)}.`],
    pistas: ['Cuenta los átomos unidos.', 'Suma los pares libres.', 'Un enlace doble es un dominio.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s13-p2', titulo: 'Pares libres del átomo central', unidad: '', tolerancia: E,
    objetivo: 'Calcular los pares libres del átomo central a partir de sus electrones de valencia y sus enlaces sencillos.', seccion: '7.6', para: 'la teoría VSEPR', lewis: true,
    idealizado: 'Todos los enlaces con los átomos unidos son sencillos.', metodo: 'escena «geometria-vsepr» y recuento de electrones', lista: RENG_CENTRALES_EN,
    respuesta: (c) => rengParesCentralEn(c),
    errores: ([, s, x, q]) => [
      ['sin-dividir', 'Electrones, no pares', rengValEn(s) - x - q, 'Esos son los electrones no enlazantes; divídelos entre dos.'],
      ['sin-enlaces', 'Sin restar los enlaces', (rengValEn(s) - q) / 2, 'Olvidaste restar un electrón por cada enlace que forma el átomo central.']
    ],
    enunciado: ([f, s, x, q]) => `En ${T(f)}${rengCargaAt(q)}, el ${rengNombreEn(s)} central (${rengValEn(s)} electrones de valencia) forma ${x} enlaces sencillos${q !== 0 ? ` y la especie tiene carga ${q > 0 ? '+' : '−'}${Math.abs(q)}` : ''}.`,
    pregunta: '¿Cuántos pares libres tiene el átomo central?',
    datos: ([, s, x, q]) => [['Electrones de valencia', String(rengValEn(s))], ['Enlaces sencillos', String(x)], ['Carga', q === 0 ? '0' : `${q > 0 ? '+' : '−'}${Math.abs(q)}`]],
    pasos: ([, s, x, q], _x, _y, rengR) => [`Electrones no enlazantes: ${rengValEn(s)} − ${x} − (${q}) = ${rengValEn(s) - x - q}.`, `Pares libres: ${tx(rengR)}.`],
    pistas: ['Parte de los electrones de valencia.', 'Resta uno por cada enlace y la carga.', 'Divide el resto entre dos.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s13-p3', titulo: 'Ángulo ideal de una molécula', unidad: '',
    objetivo: 'Predecir el ángulo ideal de enlace de una molécula con pares libres en el átomo central.', seccion: '7.6', para: 'la teoría VSEPR', lewis: true,
    idealizado: 'Ángulos ideales; los pares libres los cierran algo.', metodo: 'escena «geometria-vsepr»', lista: RENG_VSEPR_CON_PARES_EN,
    respuesta: ([, x, e]) => RENG_ANGULO_VSEPR[x + e]!,
    errores: ([, x, e]) => [
      ['sin-pares', 'Sin los pares libres', RENG_ANGULO_VSEPR[x]!, 'Olvidaste los pares libres: también son dominios y ocupan sitio.'],
      ['siguiente', 'Un dominio de más', RENG_ANGULO_VSEPR[x + e + 1]!, 'Contaste un dominio de más; revisa átomos unidos y pares libres.']
    ],
    enunciado: ([f, x, e]) => `En ${T(f)}, el átomo central tiene ${x} átomos unidos y ${e} ${e === 1 ? 'par libre' : 'pares libres'}.`,
    pregunta: '¿Cuál es el ángulo ideal entre sus dominios electrónicos, en grados?',
    datos: ([, x, e]) => [['Átomos unidos', String(x)], ['Pares libres', String(e)], ['Ángulos ideales', '2 → 180°; 3 → 120°; 4 → 109,5°']],
    pasos: ([, x, e], _x, _y, rengR) => [`Dominios: ${x} + ${e} = ${x + e}.`, `Ángulo ideal: ${tx(rengR, 4)}°.`],
    pistas: ['Cuenta los dominios.', 'Incluye los pares libres.', 'Asocia el número con su ángulo.']
  })
]

export const RENG_PRACTICAS_B04_S14: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s14-p1', titulo: 'Carácter s de un orbital híbrido', unidad: '%',
    objetivo: 'Relacionar la hibridación del átomo central con el porcentaje de carácter s de sus orbitales híbridos.', seccion: '8.2', para: 'los orbitales híbridos', lewis: true,
    idealizado: 'Híbridos equivalentes formados por un orbital s y varios p.', metodo: 'escena «geometria-vsepr» (número de híbridos)', lista: RENG_VSEPR_3_4_EN,
    respuesta: ([, x, e]) => 100 / (x + e),
    errores: ([, x, e]) => [
      ['caracter-p', 'El carácter p', (100 * (x + e - 1)) / (x + e), 'Ese es el porcentaje de carácter p; el s es el resto.'],
      ['siguiente', 'Un orbital de más', 100 / (x + e + 1), 'Contaste un orbital de más en la mezcla: hay tantos híbridos como dominios.']
    ],
    enunciado: ([f, x, e]) => `En ${T(f)}, el átomo central tiene ${x} átomos unidos y ${e} ${e === 1 ? 'par libre' : 'pares libres'}; sus orbitales híbridos mezclan un orbital s con orbitales p.`,
    pregunta: '¿Qué porcentaje de carácter s tiene cada orbital híbrido?',
    datos: ([, x, e]) => [['Dominios', String(x + e)], ['Mezcla', `1 orbital s y ${x + e - 1} orbitales p`]],
    pasos: ([, x, e], _x, _y, rengR) => [`Hibridación sp${x + e === 4 ? '³' : '²'}: ${x + e} orbitales mezclados, uno de ellos s.`, `Carácter s = 100/${x + e} = ${tx(rengR)} %.`],
    pistas: ['Cuenta los dominios.', 'Hay un solo orbital s en la mezcla.', 'Divide cien entre el número de híbridos.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s14-p2', titulo: 'Orbitales híbridos de un hidrocarburo', unidad: '', tolerancia: E,
    objetivo: 'Asignar la hibridación de cada carbono de un hidrocarburo y contar sus orbitales híbridos.', seccion: '8.2', para: 'la hibridación del carbono', lewis: true,
    idealizado: 'Carbonos sp³, sp² o sp según sus dominios.', metodo: 'cuatro orbitales por carbono menos los p que forman enlaces π', lista: RENG_HIBRIDOS_C_EN,
    respuesta: ([, , d]) => suma(d),
    errores: ([, , d]) => [
      ['todos-sp3', 'Todos sp³', 4 * d.length, 'Supusiste que todos los carbonos son sp³; los de enlaces dobles son sp² y los de triples, sp.'],
      ['p-libres', 'Los orbitales p libres', suma(d.map((n) => 4 - n)), 'Contaste los orbitales p sin hibridar; se piden los híbridos.']
    ],
    enunciado: ([n, f, d]) => `El ${n}, ${T(f)}, tiene ${d.length} carbonos: ${d.filter((x) => x === 4).length} con cuatro dominios, ${d.filter((x) => x === 3).length} con tres y ${d.filter((x) => x === 2).length} con dos.`,
    pregunta: '¿Cuántos orbitales híbridos suman todos sus carbonos?',
    datos: ([, , d]) => [['Carbonos sp³ (4 dominios)', String(d.filter((x) => x === 4).length)], ['Carbonos sp² (3 dominios)', String(d.filter((x) => x === 3).length)], ['Carbonos sp (2 dominios)', String(d.filter((x) => x === 2).length)]],
    pasos: ([, , d], _x, _y, rengR) => [`4 × ${d.filter((x) => x === 4).length} + 3 × ${d.filter((x) => x === 3).length} + 2 × ${d.filter((x) => x === 2).length}.`, `Total: ${tx(rengR)} orbitales híbridos.`],
    pistas: ['Cada carbono tiene tantos híbridos como dominios.', 'sp³ 4, sp² 3 y sp 2.', 'Suma los de todos los carbonos.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s14-p3', titulo: 'Ángulo según la hibridación', unidad: '',
    objetivo: 'Asociar la hibridación de un átomo con el ángulo ideal entre sus orbitales híbridos.', seccion: '8.2', para: 'los orbitales híbridos', lewis: true,
    idealizado: 'Ángulos ideales entre orbitales híbridos.', metodo: 'escena «geometria-vsepr»', lista: RENG_ATOMOS_HIBRIDOS_EN,
    respuesta: ([, n]) => RENG_ANGULO_VSEPR[n]!,
    errores: ([, n]) => [
      ['sp', 'Como si fuera sp', 180, 'Ese ángulo corresponde a la hibridación sp, con solo dos dominios.'],
      ['otra', 'Otra hibridación', n === 3 ? 109.5 : 120, n === 3 ? 'Ese ángulo corresponde a la hibridación sp³, con cuatro dominios.' : 'Ese ángulo corresponde a la hibridación sp², con tres dominios.']
    ],
    enunciado: ([t, n]) => `Considera ${t}, que tiene ${n} dominios electrónicos.`,
    pregunta: '¿Qué ángulo ideal forman sus orbitales híbridos, en grados?',
    datos: ([, n]) => [['Dominios', String(n)], ['Hibridación', n === 3 ? 'sp²' : 'sp³']],
    pasos: ([, n], _x, _y, rengR) => [`${n} dominios corresponden a la hibridación ${n === 3 ? 'sp²' : 'sp³'}.`, `Ángulo ideal: ${tx(rengR, 4)}°.`],
    pistas: ['Cuenta los dominios.', 'Deduce la hibridación.', 'Asocia la hibridación con su ángulo.']
  })
]

export const RENG_PRACTICAS_B04_S15: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s15-p1', titulo: 'Enlaces σ de una molécula', unidad: '', tolerancia: E,
    objetivo: 'Contar los enlaces σ de una molécula a partir de su estructura.', seccion: '8.1', para: 'los enlaces sigma', lewis: true,
    idealizado: 'Enlaces localizados.', metodo: 'átomos menos uno más anillos, con el analizador de fórmulas del núcleo', lista: RENG_SIGMA_PI_EN,
    respuesta: ([, , , s]) => s,
    errores: ([, f, , s, p]) => [
      ['atomos', 'Los átomos', rengAtomosTotalesEn(f), 'Contaste los átomos; los enlaces σ unen parejas de átomos.'],
      ['pi', 'Los enlaces π', p, 'Esos son los enlaces π; los σ son las uniones entre parejas de átomos.']
    ],
    enunciado: ([n, f, r, , p]) => `La molécula de ${n}, ${T(f)}, tiene ${rengAtomosTotalesEn(f)} átomos${r > 0 ? `, ${r} ${r === 1 ? 'anillo' : 'anillos'}` : ''} y ${p} ${p === 1 ? 'enlace π' : 'enlaces π'}.`,
    pregunta: '¿Cuántos enlaces σ tiene?',
    datos: ([, f, r]) => [['Átomos', String(rengAtomosTotalesEn(f))], ['Anillos', String(r)]],
    pasos: ([, f, r], _x, _y, rengR) => [`σ = átomos − 1 + anillos = ${rengAtomosTotalesEn(f)} − 1 + ${r}.`, `σ = ${tx(rengR)}.`],
    pistas: ['Cada unión entre átomos tiene un σ.', 'Sin anillos, σ = átomos − 1.', 'Cada anillo añade un enlace.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s15-p2', titulo: 'Enlaces σ de un alcano', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número de enlaces σ de un alcano a partir de su número de carbonos.', seccion: '8.1', para: 'los enlaces sigma',
    idealizado: 'Alcano de cadena abierta, CₙH₂ₙ₊₂.', metodo: 'átomos menos uno', lista: UNO, x: [2, 15, 1],
    respuesta: (_e, x) => 3 * x + 1,
    errores: (_e, x) => [
      ['c-c', 'Solo los C–C', x - 1, 'Contaste solo los enlaces entre carbonos; faltan los C–H.'],
      ['c-h', 'Solo los C–H', 2 * x + 2, 'Contaste solo los enlaces C–H; faltan los C–C.']
    ],
    enunciado: (_e, x) => `Un alcano de cadena abierta tiene ${x} carbonos: su fórmula es C${x}H${2 * x + 2}, sin enlaces múltiples.`,
    pregunta: '¿Cuántos enlaces σ tiene la molécula?',
    datos: (_e, x) => [['Carbonos', String(x)], ['Hidrógenos', String(2 * x + 2)]],
    pasos: (_e, x, _y, rengR) => [`Enlaces C–C: ${x - 1}; enlaces C–H: ${2 * x + 2}.`, `σ = ${tx(rengR)}.`],
    pistas: ['Cuenta los enlaces C–C.', 'Cuenta los enlaces C–H.', 'Suma los dos tipos.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s15-p3', titulo: 'Enlaces σ de un hidrocarburo', unidad: '', tolerancia: E,
    objetivo: 'Calcular los enlaces σ de un hidrocarburo de una familia dada a partir de su número de carbonos.', seccion: '8.1', para: 'los enlaces sigma',
    idealizado: 'Hidrocarburos de fórmula general conocida.', metodo: 'recuento separado de enlaces C–C y C–H', lista: RENG_FAMILIAS_EN, x: [3, 12, 1],
    respuesta: ([, h, r], x) => 3 * x + h - 1 + r,
    errores: ([, h, r], x) => [
      ['atomos', 'Los átomos', 3 * x + h, 'Contaste los átomos; los enlaces σ son uno menos (más uno por anillo).'],
      ['esqueleto', 'Solo entre carbonos', x - 1 + r, 'Contaste solo los enlaces σ entre carbonos; faltan los C–H.']
    ],
    enunciado: ([t, h], x) => `Un ${t} tiene ${x} carbonos: su fórmula es C${x}H${2 * x + h}.`,
    pregunta: '¿Cuántos enlaces σ tiene la molécula?',
    datos: ([, h, r], x) => [['Fórmula', `C${x}H${2 * x + h}`], ['Anillos', String(r)]],
    pasos: ([, h, r], x, _y, rengR) => [`Átomos: ${3 * x + h}; σ = átomos − 1 + anillos.`, `σ = ${tx(rengR)}.`],
    pistas: ['Cuenta los átomos de la fórmula.', 'Resta uno al total de átomos.', 'Suma uno por cada anillo.']
  })
]

export const RENG_PRACTICAS_B04_S16: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s16-p1', titulo: 'Enlaces π de una molécula', unidad: '', tolerancia: E,
    objetivo: 'Contar los enlaces π de una molécula a partir de su fórmula y su estructura.', seccion: '8.3', para: 'los enlaces múltiples', lewis: true,
    idealizado: 'Enlaces localizados.', metodo: 'grado de insaturación menos anillos, con el analizador del núcleo', lista: RENG_SIGMA_PI_EN,
    respuesta: ([, , , , p]) => p,
    errores: ([, , , s, p]) => [
      ['sigma', 'Los enlaces σ', s, 'Esos son los enlaces σ; los π son los enlaces adicionales de los dobles y triples.'],
      ['total', 'Todos los enlaces', s + p, 'Contaste todos los pares enlazantes; resta los enlaces σ.']
    ],
    enunciado: ([n, f, r, s, p]) => `La molécula de ${n}, ${T(f)}, tiene ${s} enlaces σ${r > 0 ? `, ${r} ${r === 1 ? 'anillo' : 'anillos'}` : ''} y ${s + p} pares enlazantes en total.`,
    pregunta: '¿Cuántos enlaces π tiene?',
    datos: ([, , , s, p]) => [['Enlaces σ', String(s)], ['Pares enlazantes', String(s + p)]],
    pasos: ([, , , s, p], _x, _y, rengR) => [`π = pares enlazantes − σ = ${s + p} − ${s}.`, `π = ${tx(rengR)}.`],
    pistas: ['Un enlace doble tiene un π.', 'Un enlace triple tiene dos π.', 'Resta los σ del total de pares.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s16-p2', titulo: 'Grado de insaturación', unidad: '', tolerancia: E,
    objetivo: 'Calcular el grado de insaturación (enlaces π más anillos) de una fórmula molecular.', seccion: '8.3', para: 'los enlaces múltiples',
    idealizado: 'Fórmulas con C, H, N, O y halógenos.', metodo: 'comparación con el alcano saturado de igual esqueleto', lista: RENG_FORMULAS_INSATURACION_EN,
    respuesta: (f) => rengInsaturacionEn(f),
    errores: (f) => [
      ['sin-dividir', 'Sin dividir entre dos', 2 * rengInsaturacionEn(f), 'Falta dividir entre dos: cada insaturación equivale a dos hidrógenos menos.'],
      ['sin-dos', 'Sin el +2', rengInsaturacionEn(f) - 1, 'Olvidaste el +2 de la fórmula: un alcano saturado tiene 2C + 2 hidrógenos.']
    ],
    enunciado: (f) => `Un compuesto tiene la fórmula molecular ${T(f)}. El grado de insaturación es GI = (2C + 2 + N − H − X)/2.`,
    pregunta: '¿Cuál es su grado de insaturación?',
    datos: (f) => [['Fórmula', T(f)], ['GI', '(2C + 2 + N − H − X)/2; el oxígeno no cuenta']],
    pasos: (f, _x, _y, rengR) => [`Hidrógenos que faltan respecto al compuesto saturado: ${2 * rengInsaturacionEn(f)}.`, `GI = ${tx(rengR)}: enlaces π más anillos.`],
    pistas: ['Cuenta C, H, N y halógenos.', 'Aplica la fórmula del GI.', 'El oxígeno no interviene.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s16-p3', titulo: 'Enlaces π de un compuesto cíclico', unidad: '', tolerancia: E,
    objetivo: 'Calcular los enlaces π de un compuesto con anillos restando los anillos del grado de insaturación.', seccion: '8.3', para: 'los enlaces múltiples', lewis: true,
    idealizado: 'Enlaces π contados en una estructura de Lewis.', metodo: 'pares enlazantes que exige el octeto menos enlaces σ', lista: RENG_ANILLOS_EN,
    respuesta: ([, f, r]) => rengInsaturacionEn(f) - r,
    errores: ([, f, r]) => [
      ['sin-anillos', 'Sin restar los anillos', rengInsaturacionEn(f), 'Ese es el grado de insaturación; cada anillo cuenta como una insaturación sin ser un enlace π.'],
      ['anillos', 'Los anillos', r, 'Ese es el número de anillos; se piden los enlaces π.']
    ],
    enunciado: ([n, f, r]) => `El compuesto ${n}, ${T(f)}, tiene ${r} ${r === 1 ? 'anillo' : 'anillos'} y un grado de insaturación de ${rengInsaturacionEn(f)}.`,
    pregunta: '¿Cuántos enlaces π tiene en una estructura de Lewis?',
    datos: ([, f, r]) => [['Grado de insaturación', String(rengInsaturacionEn(f))], ['Anillos', String(r)]],
    pasos: ([, f, r], _x, _y, rengR) => [`π = GI − anillos = ${rengInsaturacionEn(f)} − ${r}.`, `π = ${tx(rengR)}.`],
    pistas: ['El GI suma enlaces π y anillos.', 'Resta los anillos.', 'Lo que queda son enlaces π.']
  })
]
