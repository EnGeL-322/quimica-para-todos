import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_RADIO_ION_PM } from '../escenas-n1/modelos/tendencias-periodicas'
import { RENG_DIATOMICAS } from '../nucleo/datosEnlace'
import { rengCargaAt } from './b02-comun'
import { RENG_IONES_POLI_TP } from './b03-s17-s23'
import { RENG_REPRESENTATIVOS_TP } from './b03-comun'
import {
  RENG_ATOMOS_CF_EN, RENG_ATOMOS_OCTETO_EN, RENG_ENERGIA_MEDIA_EN, RENG_ESPECIES_LEWIS_EN, RENG_EV_EN, RENG_K_EN, RENG_NA_EN, RENG_REACCIONES_EN, RENG_TOL_EN_ENT, rengAtomosTotalesEn, rengElectronesEn, rengNombreEn, rengParesOctetoEn, rengPracticaEn,
  rengSumaEnlacesEn, rengTextoBalanceEn, rengValEn, rengValenciaTotalEn, rengZEn
} from './b04-comun'
import { rengTxtNo } from './b05-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const E = RENG_TOL_EN_ENT
const UNO: readonly number[] = [0]
const sg = (rengN: number): string => `${rengN > 0 ? '+' : rengN < 0 ? '−' : ''}${Math.abs(rengN)}`
export const RENG_IONES_REPRESENTATIVOS_EN = RENG_IONES_POLI_TP.filter(([, rengX]) => rengX !== 'Mn' && rengX !== 'Cr')
export const RENG_MOLECULAS_NEUTRAS_EN: readonly string[] = ['H2S', 'PH3', 'SiH4', 'OF2', 'NF3', 'CS2', 'SO2', 'C2H6', 'CH3Cl', 'H2O2', 'N2H4', 'C2H4', 'HCN', 'COCl2', 'CH2Cl2', 'PCl3', 'SCl2', 'HNO3', 'C3H8', 'CH4O', 'BF3', 'SO3']
export const rengDesapareadosLewisEn = (rengS: string): number => Math.min(rengValEn(rengS), 8 - rengValEn(rengS))
export const RENG_EXPANDIDOS_EN: ReadonlyArray<readonly [string, number, number]> = [
  ['BF3', 3, 0], ['BeCl2', 2, 0], ['PCl5', 5, 0], ['SF6', 6, 0], ['AlCl3', 3, 0], ['XeF4', 4, 2], ['ClF3', 3, 2], ['SF4', 4, 1], ['XeF2', 2, 3], ['BH3', 3, 0], ['PF5', 5, 0], ['IF5', 5, 1], ['BrF3', 3, 2], ['BrF5', 5, 1], ['SeF6', 6, 0], ['BCl3', 3, 0]
]
export const RENG_ESTRUCTURAS_CF_EN: ReadonlyArray<readonly [string, readonly number[]]> = [
  ['el CO₂ dibujado con un enlace triple y uno sencillo', [1, 0, -1]], ['el N₂O dibujado como N=N=O', [-1, 1, 0]], ['el N₂O dibujado como N≡N–O', [0, 1, -1]], ['el SO₂ con octeto en el azufre', [1, 0, -1]], ['el ozono, O₃', [0, 1, -1]],
  ['el monóxido de carbono, CO', [-1, 1]], ['el ion nitrato, NO₃⁻', [1, 0, -1, -1]], ['el ion sulfato, SO₄²⁻, con cuatro enlaces sencillos', [2, -1, -1, -1, -1]], ['el ion perclorato, ClO₄⁻, con cuatro enlaces sencillos', [3, -1, -1, -1, -1]],
  ['el ion fosfato, PO₄³⁻, con cuatro enlaces sencillos', [1, -1, -1, -1, -1]], ['el ácido nítrico, HNO₃', [1, -1, 0, 0, 0]], ['el ion fulminato, C≡N–O⁻', [-1, 1, -1]], ['el ion azida, N=N=N⁻', [-1, 1, -1]], ['el ion carbonato, CO₃²⁻', [0, 0, -1, -1]],
  ['el nitrometano, CH₃NO₂ (átomos de N y O)', [1, -1, 0]], ['el ion clorato, ClO₃⁻, con tres enlaces sencillos', [2, -1, -1, -1]]
]
export const RENG_RESONANTES_EN: ReadonlyArray<readonly [string, number, number]> = [
  ['el ozono, O₃', 3, 2], ['el dióxido de azufre, SO₂', 3, 2], ['el ion nitrito, NO₂⁻', 3, 2], ['el ion nitrato, NO₃⁻', 4, 3], ['el ion carbonato, CO₃²⁻', 4, 3], ['el trióxido de azufre, SO₃', 4, 3], ['el benceno, C₆H₆ (enlaces C–C)', 9, 6],
  ['el ion formiato, HCOO⁻ (enlaces C–O)', 3, 2], ['el ion acetato, CH₃COO⁻ (enlaces C–O)', 3, 2], ['el catión alilo, C₃H₅⁺ (enlaces C–C)', 3, 2], ['el ion sulfato, SO₄²⁻, con dos enlaces dobles', 6, 4], ['el ion fosfato, PO₄³⁻, con un enlace doble', 5, 4],
  ['el ion perclorato, ClO₄⁻, con tres enlaces dobles', 7, 4], ['el ion clorato, ClO₃⁻, con dos enlaces dobles', 5, 3], ['el grafito (enlaces C–C)', 4, 3]
]
export const RENG_LONGITUDES_EN: ReadonlyArray<readonly [string, number, number]> = [['C–C / C=C', 154, 134], ['C–O / C=O', 143, 122], ['N–O / N=O', 140, 121], ['O–O / O=O', 148, 121], ['C–N / C=N', 147, 128], ['N–N / N=N', 145, 125]]
export const RENG_LONGITUDES_NOTA_EN = 'Longitudes típicas de enlaces sencillos y dobles (C–C 154 y 134 pm; C–O 143 y 122 pm; N–O 140 y 121 pm; O–O 148 y 121 pm; C–N 147 y 128 pm; N–N 145 y 125 pm): valores de tablas de texto recordados, no contrastados en esta entrega.'
const CAT = ['Li', 'Na', 'K', 'Rb', 'Be', 'Mg', 'Ca', 'Sr', 'Al']
const ANI = ['F', 'Cl', 'Br', 'I', 'O', 'S', 'Se', 'N']
export const RENG_PARES_IONICOS_EN: ReadonlyArray<readonly [string, string]> = CAT.flatMap((c) => ANI.map((a) => [c, a] as const))
const q = (rengS: string): number => RENG_RADIO_ION_PM[rengS]![0]
const r = (rengS: string): number => RENG_RADIO_ION_PM[rengS]![1]
export const rengDistanciaIonicaEn = (rengC: string, rengA: string): number => (r(rengC) + r(rengA)) / 100
export const rengCoulombEn = (rengC: string, rengA: string): number => (RENG_K_EN * Math.abs(q(rengC) * q(rengA))) / rengDistanciaIonicaEn(rengC, rengA)
const ion = (rengS: string): string => `${rengS}${rengCargaAt(q(rengS))}`
export const RENG_COMPARACIONES_IONICAS_EN: ReadonlyArray<readonly [string, string, string, string]> = [
  ['Na', 'Cl', 'Mg', 'O'], ['Na', 'Cl', 'K', 'Br'], ['Li', 'F', 'Na', 'Cl'], ['Mg', 'O', 'Ca', 'O'], ['Na', 'F', 'Na', 'I'], ['Ca', 'O', 'Sr', 'O'], ['K', 'Cl', 'Rb', 'Cl'], ['Li', 'F', 'Mg', 'O'], ['Na', 'Cl', 'Ca', 'S'], ['K', 'Br', 'Sr', 'S'],
  ['Li', 'Cl', 'Li', 'I'], ['Mg', 'S', 'Mg', 'O'], ['Na', 'Br', 'Mg', 'Br'], ['K', 'F', 'Ca', 'F'], ['Rb', 'I', 'Li', 'F'], ['Na', 'Cl', 'Al', 'N'], ['Na', 'Cl', 'Mg', 'S'], ['K', 'Br', 'Ca', 'O'], ['Rb', 'I', 'Mg', 'O'], ['Na', 'I', 'Sr', 'O'],
  ['K', 'Cl', 'Al', 'N'], ['Li', 'F', 'Ca', 'O'], ['Na', 'Br', 'Be', 'O'], ['Rb', 'Cl', 'Mg', 'S']
]
export const RENG_CARGAS_EN: ReadonlyArray<readonly [number, number]> = [[1, 1], [2, 1], [2, 2], [3, 1], [3, 2], [1, 2], [1, 3]]
export const RENG_DIATOMICAS_EN: readonly string[] = ['H2', 'HCl', 'Cl2', 'O2', 'N2']
const D = (rengF: string): number => RENG_DIATOMICAS[rengF]!.D0 * RENG_EV_EN
export const RENG_DADORES_EN: ReadonlyArray<readonly [string, number, number, number]> = [
  ['el nitrógeno del amoníaco, NH₃', 5, 2, 3], ['el oxígeno del agua, H₂O', 6, 4, 2], ['el fósforo de la fosfina, PH₃', 5, 2, 3], ['el azufre del sulfuro de hidrógeno, H₂S', 6, 4, 2], ['el oxígeno del metanol, CH₃OH', 6, 4, 2],
  ['el oxígeno del éter dimetílico, (CH₃)₂O', 6, 4, 2], ['el oxígeno del ion hidróxido, OH⁻', 6, 6, 1], ['el ion fluoruro, F⁻', 7, 8, 0], ['el ion cloruro, Cl⁻', 7, 8, 0], ['el nitrógeno del ion amiduro, NH₂⁻', 5, 4, 2],
  ['el nitrógeno de la metilamina, CH₃NH₂', 5, 2, 3], ['el nitrógeno del trifluoruro de nitrógeno, NF₃', 5, 2, 3], ['el selenio del seleniuro de hidrógeno, H₂Se', 6, 4, 2], ['el nitrógeno de la piridina, C₅H₅N', 5, 2, 3]
]
export const RENG_ACEPTORES_EN: ReadonlyArray<readonly [string, number, number, number]> = [
  ['el boro del trifluoruro de boro, BF₃', 0, 1, 3], ['el aluminio del tricloruro de aluminio, AlCl₃', 0, 1, 3], ['el berilio del dicloruro de berilio, BeCl₂', 0, 2, 2], ['el boro del borano, BH₃', 0, 1, 3], ['el ion plata, Ag⁺', 1, 2, 0],
  ['el ion cobre(II), Cu²⁺', 2, 4, 0], ['el ion cinc, Zn²⁺', 2, 4, 0], ['el ion hierro(III), Fe³⁺', 3, 6, 0], ['el ion aluminio, Al³⁺', 3, 6, 0], ['el ion cobalto(III), Co³⁺', 3, 6, 0], ['el ion níquel(II), Ni²⁺', 2, 6, 0], ['el ion hierro(II), Fe²⁺', 2, 6, 0]
]

export const RENG_PRACTICAS_B04_S01: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s1-p1', titulo: 'Electrones de valencia de una molécula', unidad: '', tolerancia: E,
    objetivo: 'Sumar los electrones de valencia de todos los átomos de una molécula neutra.', seccion: '7.3', para: 'los electrones de valencia',
    idealizado: 'Moléculas neutras de elementos representativos.', metodo: 'analizador de fórmulas del núcleo y escena «atomo»', lista: RENG_MOLECULAS_NEUTRAS_EN,
    respuesta: (f) => rengValenciaTotalEn(f),
    errores: (f) => [
      ['todos', 'Todos los electrones', rengElectronesEn(f), 'Sumaste todos los electrones de los átomos; solo cuentan los de la capa externa.'],
      ['atomos', 'Uno por átomo', rengAtomosTotalesEn(f), 'Contaste los átomos; cada uno aporta tantos electrones como indica su grupo.']
    ],
    enunciado: (f) => `Se quiere dibujar la estructura de Lewis de la molécula ${T(f)}.`,
    pregunta: '¿Cuántos electrones de valencia tiene en total?',
    datos: (f) => [['Fórmula', T(f)], ['Valencias', 'H 1; C y Si 4; N y P 5; O y S 6; halógenos 7; B 3']],
    pasos: (f, _x, _y, rengR) => ['Se multiplica la valencia de cada elemento por su subíndice y se suma.', `Total: ${tx(rengR)} electrones (${tx(rengR / 2)} pares).`],
    pistas: ['Busca la valencia de cada elemento.', 'Multiplica por los subíndices.', 'Suma todas las contribuciones.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s1-p2', titulo: 'Electrones de valencia de un ion', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones de valencia de un ion poliatómico corrigiendo con su carga.', seccion: '7.3', para: 'los electrones de valencia',
    idealizado: 'Iones poliatómicos habituales.', metodo: 'analizador de fórmulas del núcleo, escena «atomo» y carga del ion', lista: RENG_IONES_REPRESENTATIVOS_EN,
    respuesta: ([f, , c]) => rengValenciaTotalEn(f, c),
    errores: ([f, , c]) => [
      ['sin-carga', 'Sin la carga', rengValenciaTotalEn(f), 'Olvidaste la carga: un anión tiene electrones de más y un catión, de menos.'],
      ['carga-al-reves', 'Carga al revés', rengValenciaTotalEn(f, -c), 'Corregiste con el signo contrario: una carga negativa añade electrones.']
    ],
    enunciado: ([f, , c]) => `Se quiere dibujar la estructura de Lewis del ion ${T(f)}${rengCargaAt(c)}.`,
    pregunta: '¿Cuántos electrones de valencia hay que repartir?',
    datos: ([f, , c]) => [['Ion', `${T(f)}${rengCargaAt(c)}`], ['Carga', sg(c)]],
    pasos: ([f, , c], _x, _y, rengR) => [`Valencias de los átomos: ${rengValenciaTotalEn(f)}; la carga ${sg(c)} ${c < 0 ? 'añade' : 'quita'} ${Math.abs(c)}.`, `Total: ${tx(rengR)} electrones.`],
    pistas: ['Suma las valencias de los átomos.', 'Una carga negativa añade electrones.', 'Una carga positiva los quita.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s1-p3', titulo: 'Puntos desapareados de un símbolo de Lewis', unidad: '', tolerancia: E,
    objetivo: 'Deducir cuántos electrones desapareados muestra el símbolo de Lewis de un átomo.', seccion: '7.3', para: 'los símbolos de Lewis',
    idealizado: 'Símbolos de Lewis con cuatro posiciones alrededor del átomo.', metodo: 'reparto explícito de puntos en cuatro posiciones', lista: RENG_REPRESENTATIVOS_TP,
    respuesta: (s) => rengDesapareadosLewisEn(s),
    errores: (s) => [
      ['pares', 'Los pares', (rengValEn(s) - rengDesapareadosLewisEn(s)) / 2, 'Contaste los pares de puntos; se piden los puntos que quedan solos.'],
      ['total', 'Todos los electrones', rengZEn(s), 'Contaste todos los electrones del átomo; el símbolo de Lewis solo muestra los de valencia.']
    ],
    enunciado: (s) => `En el símbolo de Lewis del ${rengNombreEn(s)} se colocan sus ${rengValEn(s)} electrones de valencia en cuatro posiciones, de uno en uno antes de formar pares.`,
    pregunta: '¿Cuántos puntos quedan desapareados?',
    datos: (s) => [['Electrones de valencia', String(rengValEn(s))], ['Posiciones', '4, con dos electrones como máximo']],
    pasos: (s, _x, _y, rengR) => [rengValEn(s) <= 4 ? 'Con cuatro o menos, cada electrón ocupa una posición.' : `Los ${rengValEn(s) - 4} electrones que pasan de cuatro forman pares.`, `Quedan ${tx(rengR)} desapareados: son los enlaces que suele formar.`],
    pistas: ['Coloca un punto en cada posición.', 'Empareja los que sobren de cuatro.', 'Cuenta los que quedan solos.']
  })
]

export const RENG_PRACTICAS_B04_S02: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s2-p1', titulo: 'Electrones alrededor de un átomo', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones que rodean a un átomo en una estructura de Lewis para comprobar su octeto.', seccion: '7.3', para: 'la regla del octeto', lewis: true,
    idealizado: 'Estructura de Lewis indicada.', metodo: 'escena «carga-formal»', lista: RENG_ATOMOS_OCTETO_EN,
    respuesta: ([, , l, b]) => l + 2 * b,
    errores: ([, v, l, b]) => [
      ['sin-doblar', 'Un electrón por enlace', l + b, 'Para el octeto cada enlace cuenta con sus dos electrones, no con uno.'],
      ['valencia', 'Los de valencia', v, 'Ese es el número de electrones de valencia del átomo libre, no los que le rodean en la estructura.']
    ],
    enunciado: ([t, , l, b]) => `Considera ${t}: tiene ${l} electrones no enlazantes y ${b} ${b === 1 ? 'enlace' : 'enlaces'}.`,
    pregunta: '¿Cuántos electrones le rodean?',
    datos: ([, , l, b]) => [['No enlazantes', String(l)], ['Enlaces', String(b)]],
    pasos: ([, , l, b], _x, _y, rengR) => [`N = no enlazantes + 2 × enlaces = ${l} + 2 × ${b}.`, `N = ${tx(rengR)}: ${rengR === 8 ? 'cumple el octeto' : 'no cumple el octeto'}.`],
    pistas: ['Cuenta los electrones no enlazantes.', 'Cada enlace aporta dos electrones.', 'Compara el total con ocho.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s2-p2', titulo: 'Enlaces que exige el octeto', unidad: '', tolerancia: E,
    objetivo: 'Calcular cuántos pares enlazantes necesita una especie para que todos sus átomos completen su capa.', seccion: '7.3', para: 'la regla del octeto', lewis: true,
    idealizado: 'Todos los átomos cumplen el octeto (el hidrógeno, el dueto).', metodo: 'estructura de Lewis conocida de la especie', lista: RENG_ESPECIES_LEWIS_EN,
    respuesta: ([f, c]) => rengParesOctetoEn(f, c),
    errores: ([f, c]) => [
      ['sin-dividir', 'Sin dividir entre dos', 2 * rengParesOctetoEn(f, c), 'Esos son los electrones compartidos; cada enlace es un par, así que hay que dividir entre dos.'],
      ['valencia', 'Los pares de valencia', rengValenciaTotalEn(f, c) / 2, 'Esos son todos los pares de valencia; los enlazantes son solo una parte.']
    ],
    enunciado: ([f, c]) => `La especie ${T(f)}${rengCargaAt(c)} tiene ${rengValenciaTotalEn(f, c)} electrones de valencia. Para que cada átomo complete su capa harían falta ${2 * rengParesOctetoEn(f, c) + rengValenciaTotalEn(f, c)} electrones (8 por átomo, 2 por hidrógeno).`,
    pregunta: '¿Cuántos pares de electrones deben compartirse (enlaces)?',
    datos: ([f, c]) => [['Electrones necesarios', String(2 * rengParesOctetoEn(f, c) + rengValenciaTotalEn(f, c))], ['Electrones disponibles', String(rengValenciaTotalEn(f, c))]],
    pasos: ([f, c], _x, _y, rengR) => [`Electrones que faltan: ${2 * rengParesOctetoEn(f, c)}; cada par compartido cuenta para dos átomos.`, `Enlaces = ${tx(rengR)}.`],
    pistas: ['Resta disponibles de necesarios.', 'Cada enlace cubre dos electrones.', 'Divide la diferencia entre dos.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s2-p3', titulo: 'Excepciones al octeto', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones que rodean al átomo central en moléculas con octeto incompleto o expandido.', seccion: '7.3', para: 'las excepciones a la regla del octeto', lewis: true,
    idealizado: 'Enlaces sencillos con los átomos unidos.', metodo: 'escena «carga-formal»', lista: RENG_EXPANDIDOS_EN,
    respuesta: ([, x, e]) => 2 * x + 2 * e,
    errores: ([, x, e]) => [
      ['ocho', 'Suponiendo el octeto', 8, 'Supusiste que cumple el octeto; esta molécula es una excepción.'],
      ['pares', 'Contando pares', x + e, 'Contaste pares; cada par son dos electrones.']
    ],
    enunciado: ([f, x, e]) => `En ${T(f)}, el átomo central forma ${x} enlaces sencillos y tiene ${e} ${e === 1 ? 'par libre' : 'pares libres'}.`,
    pregunta: '¿Cuántos electrones rodean al átomo central?',
    datos: ([, x, e]) => [['Enlaces', String(x)], ['Pares libres', String(e)]],
    pasos: ([, x, e], _x, _y, rengR) => [`N = 2 × ${x} + 2 × ${e}.`, `N = ${tx(rengR)}: octeto ${rengR < 8 ? 'incompleto' : 'expandido'}.`],
    pistas: ['Cada enlace son dos electrones.', 'Cada par libre son dos electrones.', 'Compara el total con ocho.']
  })
]

export const RENG_PRACTICAS_B04_S03: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s3-p1', titulo: 'Pares libres de una estructura', unidad: '', tolerancia: E,
    objetivo: 'Calcular los pares libres de una estructura de Lewis a partir de los electrones de valencia y los enlaces.', seccion: '7.3', para: 'las estructuras de Lewis', lewis: true,
    idealizado: 'Estructura de Lewis con octetos completos.', metodo: 'fórmula del octeto calculada aparte', lista: RENG_ESPECIES_LEWIS_EN,
    respuesta: ([f, c, b]) => (rengValenciaTotalEn(f, c) - 2 * b) / 2,
    errores: ([f, c, b]) => [
      ['sin-dividir', 'Electrones, no pares', rengValenciaTotalEn(f, c) - 2 * b, 'Esos son los electrones no enlazantes; divídelos entre dos para obtener pares.'],
      ['todos', 'Todos los pares', rengValenciaTotalEn(f, c) / 2, 'Contaste todos los pares de valencia; hay que restar los pares enlazantes.']
    ],
    enunciado: ([f, c, b]) => `La estructura de Lewis de ${T(f)}${rengCargaAt(c)} tiene ${rengValenciaTotalEn(f, c)} electrones de valencia y ${b} ${b === 1 ? 'par enlazante' : 'pares enlazantes'}.`,
    pregunta: '¿Cuántos pares libres tiene en total?',
    datos: ([f, c, b]) => [['Electrones de valencia', String(rengValenciaTotalEn(f, c))], ['Pares enlazantes', String(b)]],
    pasos: ([f, c, b], _x, _y, rengR) => [`Electrones no enlazantes: ${rengValenciaTotalEn(f, c)} − 2 × ${b} = ${rengValenciaTotalEn(f, c) - 2 * b}.`, `Pares libres: ${tx(rengR)}.`],
    pistas: ['Resta los electrones de los enlaces.', 'Agrupa el resto en pares.', 'Divide entre dos.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s3-p2', titulo: 'Pares de electrones de un ion', unidad: '', tolerancia: E,
    objetivo: 'Calcular el número total de pares de electrones que hay que colocar en la estructura de Lewis de un ion.', seccion: '7.3', para: 'las estructuras de Lewis',
    idealizado: 'Iones poliatómicos habituales.', metodo: 'analizador de fórmulas del núcleo y escena «atomo»', lista: RENG_IONES_REPRESENTATIVOS_EN,
    respuesta: ([f, , c]) => rengValenciaTotalEn(f, c) / 2,
    errores: ([f, , c]) => [
      ['sin-carga', 'Sin la carga', rengValenciaTotalEn(f) / 2, 'Olvidaste la carga del ion al contar los electrones.'],
      ['electrones', 'Electrones, no pares', rengValenciaTotalEn(f, c), 'Esos son los electrones; los pares son la mitad.']
    ],
    enunciado: ([f, , c]) => `El ion ${T(f)}${rengCargaAt(c)} se representa con una estructura de Lewis en la que todos los electrones de valencia están en pares.`,
    pregunta: '¿Cuántos pares de electrones (enlazantes y libres) hay que dibujar?',
    datos: ([f, , c]) => [['Ion', `${T(f)}${rengCargaAt(c)}`], ['Carga', sg(c)]],
    pasos: ([f, , c], _x, _y, rengR) => [`Electrones de valencia: ${rengValenciaTotalEn(f, c)}.`, `Pares: ${tx(rengR)}.`],
    pistas: ['Cuenta los electrones de valencia.', 'Corrige con la carga del ion.', 'Divide entre dos.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s3-p3', titulo: 'Enlaces múltiples necesarios', unidad: '', tolerancia: E,
    objetivo: 'Deducir cuántos enlaces adicionales (dobles o triples) hacen falta para completar los octetos de una especie.', seccion: '7.3', para: 'las estructuras de Lewis', lewis: true,
    idealizado: 'Especies sin anillos que cumplen el octeto.', metodo: 'estructura de Lewis conocida de la especie', lista: RENG_ESPECIES_LEWIS_EN,
    respuesta: ([f, c]) => rengParesOctetoEn(f, c) - (rengAtomosTotalesEn(f) - 1),
    errores: ([f, c]) => [
      ['enlaces', 'Todos los enlaces', rengParesOctetoEn(f, c), 'Esos son todos los pares enlazantes; resta los enlaces sencillos del esqueleto.'],
      ['esqueleto', 'Los enlaces sencillos', rengAtomosTotalesEn(f) - 1, 'Esos son los enlaces sencillos del esqueleto; se piden los adicionales.']
    ],
    enunciado: ([f, c]) => `La especie ${T(f)}${rengCargaAt(c)} necesita ${rengParesOctetoEn(f, c)} pares enlazantes para completar sus octetos, y su esqueleto de ${rengAtomosTotalesEn(f)} átomos sin anillos tiene ${rengAtomosTotalesEn(f) - 1} enlaces sencillos.`,
    pregunta: '¿Cuántos pares enlazantes adicionales (en enlaces dobles o triples) hacen falta?',
    datos: ([f, c]) => [['Pares enlazantes necesarios', String(rengParesOctetoEn(f, c))], ['Enlaces del esqueleto', String(rengAtomosTotalesEn(f) - 1)]],
    pasos: ([f, c], _x, _y, rengR) => [`${rengParesOctetoEn(f, c)} − ${rengAtomosTotalesEn(f) - 1}.`, `Hacen falta ${tx(rengR)}: cada uno convierte un enlace sencillo en doble, o uno doble en triple.`],
    pistas: ['Cuenta los enlaces del esqueleto.', 'Resta de los pares necesarios.', 'El resto son enlaces múltiples.']
  })
]

export const RENG_PRACTICAS_B04_S04: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s4-p1', titulo: 'Carga formal de un átomo', unidad: '', tolerancia: E,
    objetivo: 'Calcular la carga formal de un átomo en una estructura de Lewis.', seccion: '7.4', para: 'las cargas formales', lewis: true,
    idealizado: 'Estructura de Lewis indicada.', metodo: 'escena «carga-formal»', lista: RENG_ATOMOS_CF_EN,
    respuesta: ([, v, l, b]) => v - l - b,
    errores: ([, v, l, b]) => [
      ['doble', 'Dos electrones por enlace', v - l - 2 * b, 'Contaste los dos electrones de cada enlace; en la carga formal se cuenta uno por enlace.'],
      ['signo', 'Signo al revés', -(v - l - b), 'Restaste al revés: la carga formal es valencia menos electrones asignados.']
    ],
    enunciado: ([t, v, l, b]) => `Considera ${t}. Ese átomo tiene ${v} electrones de valencia como átomo libre y, en la estructura, ${l} electrones no enlazantes y ${b} ${b === 1 ? 'enlace' : 'enlaces'}.`,
    pregunta: '¿Cuál es su carga formal (con signo)?',
    datos: ([, v, l, b]) => [['Valencia', String(v)], ['No enlazantes', String(l)], ['Enlaces', String(b)]],
    pasos: ([, v, l, b], _x, _y, rengR) => [`CF = V − L − B = ${v} − ${l} − ${b}.`, `CF = ${sg(rengR)}.`],
    pistas: ['Parte de la valencia del átomo.', 'Resta los no enlazantes.', 'Resta un electrón por enlace.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s4-p2', titulo: 'Carga formal del átomo central', unidad: '', tolerancia: E,
    objetivo: 'Usar que las cargas formales suman la carga total para deducir la del átomo central.', seccion: '7.4', para: 'las cargas formales',
    idealizado: 'Estructura de Lewis de una especie con un átomo central.', metodo: 'suma de comprobación de las cargas', lista: UNO, x: [-3, 2, 1], y: [-4, 2, 1], valida: (_e, x, y) => x !== y,
    respuesta: (_e, x, y) => x - y,
    errores: (_e, x, y) => [
      ['suma', 'Sumando', x + y, 'Sumaste las cargas de los demás átomos; hay que restarlas de la carga total.'],
      ['al-reves', 'Resta al revés', y - x, 'Restaste al revés: la del átomo central es la carga total menos las demás.']
    ],
    enunciado: (_e, x, y) => `Una especie tiene carga total ${sg(x) || '0'}. En su estructura de Lewis, las cargas formales de todos los átomos excepto el central suman ${sg(y) || '0'}.`,
    pregunta: '¿Cuál es la carga formal del átomo central (con signo)?',
    datos: (_e, x, y) => [['Carga total', sg(x) || '0'], ['Suma de las demás', sg(y) || '0']],
    pasos: (_e, x, y, rengR) => [`CF(central) = ${x} − (${y}).`, `CF(central) = ${sg(rengR)}.`],
    pistas: ['Las cargas formales suman la carga total.', 'Despeja la del átomo central.', 'Cuida los signos al restar.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s4-p3', titulo: 'Separación de carga de una estructura', unidad: '', tolerancia: E,
    objetivo: 'Valorar una estructura de Lewis sumando los valores absolutos de sus cargas formales.', seccion: '7.4', para: 'la elección de estructuras de Lewis', lewis: true,
    idealizado: 'Estructura de Lewis indicada.', metodo: 'suma de positivas y negativas por separado', lista: RENG_ESTRUCTURAS_CF_EN,
    respuesta: ([, c]) => c.reduce((a, v) => a + Math.abs(v), 0),
    errores: ([, c]) => [
      ['con-signo', 'Suma con signo', c.reduce((a, v) => a + v, 0), 'Sumaste con signo y obtuviste la carga total; se pide la suma de valores absolutos.'],
      ['maximo', 'La mayor carga', Math.max(...c.map((v) => Math.abs(v))), 'Tomaste solo la carga formal mayor; hay que sumar las de todos los átomos.']
    ],
    enunciado: ([t, c]) => `En ${t}, las cargas formales de los átomos son ${c.map((v) => (v === 0 ? '0' : sg(v))).join(', ')}.`,
    pregunta: '¿Cuánto suman los valores absolutos de las cargas formales?',
    datos: ([, c]) => [['Cargas formales', c.map((v) => (v === 0 ? '0' : sg(v))).join(', ')], ['Criterio', 'cuanto menor es la suma, mejor es la estructura']],
    pasos: ([, c], _x, _y, rengR) => [`Valores absolutos: ${c.map((v) => Math.abs(v)).join(' + ')}.`, `Suma = ${tx(rengR)}.`],
    pistas: ['Quita el signo a cada carga.', 'Suma todos los valores.', 'Una suma baja indica mejor estructura.']
  })
]

export const RENG_PRACTICAS_B04_S05: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s5-p1', titulo: 'Orden de enlace medio', unidad: '',
    objetivo: 'Calcular el orden de enlace medio de una especie con estructuras resonantes equivalentes.', seccion: '7.4', para: 'la resonancia', lewis: true,
    idealizado: 'Estructuras resonantes equivalentes.', metodo: 'un enlace sencillo más los pares adicionales repartidos', lista: RENG_RESONANTES_EN,
    respuesta: ([, p, n]) => p / n,
    errores: ([, p, n]) => [
      ['inverso', 'Cociente invertido', n / p, 'Dividiste al revés: son los pares enlazantes entre las posiciones.'],
      ['sin-repartir', 'Sin repartir', p, 'Ese es el número total de pares enlazantes; hay que repartirlo entre las posiciones.']
    ],
    enunciado: ([t, p, n]) => `En ${t} hay ${p} pares enlazantes repartidos por resonancia entre ${n} posiciones equivalentes.`,
    pregunta: '¿Cuál es el orden de enlace medio?',
    datos: ([, p, n]) => [['Pares enlazantes', String(p)], ['Posiciones equivalentes', String(n)]],
    pasos: ([, p, n], _x, _y, rengR) => [`Orden = ${p}/${n}.`, `Orden = ${tx(rengR)}: todos esos enlaces miden lo mismo.`],
    pistas: ['Cuenta los pares enlazantes.', 'Cuenta las posiciones equivalentes.', 'Divide pares entre posiciones.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s5-p2', titulo: 'Enlaces dobles repartidos', unidad: '',
    objetivo: 'Calcular el orden de enlace cuando varios enlaces dobles se reparten entre posiciones equivalentes.', seccion: '7.4', para: 'la resonancia',
    idealizado: 'Estructuras resonantes equivalentes.', metodo: 'recuento de pares enlazantes totales', lista: UNO, x: [2, 8, 1], y: [1, 3, 1], valida: (_e, x, y) => y < x,
    respuesta: (_e, x, y) => (x + y) / x,
    errores: (_e, x, y) => [
      ['inverso', 'Cociente invertido', x / (x + y), 'Dividiste al revés: los pares enlazantes van en el numerador.'],
      ['solo-dobles', 'Solo los dobles', y / x, 'Repartiste solo los enlaces adicionales; falta el enlace sencillo de cada posición.']
    ],
    enunciado: (_e, x, y) => `Una especie tiene ${x} posiciones de enlace equivalentes. En cada estructura resonante, ${y} de ellas ${y === 1 ? 'es un enlace doble' : 'son enlaces dobles'} y las demás son sencillos.`,
    pregunta: '¿Cuál es el orden de enlace medio de cada posición?',
    datos: (_e, x, y) => [['Posiciones', String(x)], ['Enlaces dobles', String(y)]],
    pasos: (_e, x, y, rengR) => [`Pares enlazantes: ${x} + ${y} = ${x + y}.`, `Orden = ${x + y}/${x} = ${tx(rengR)}.`],
    pistas: ['Cada posición tiene un enlace sencillo.', 'Suma los pares de los dobles.', 'Reparte entre las posiciones.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s5-p3', titulo: 'Longitud de un enlace resonante', unidad: 'pm',
    objetivo: 'Estimar la longitud de un enlace de orden fraccionario interpolando entre el sencillo y el doble.', seccion: '7.4', para: 'la resonancia y la longitud de enlace', tablas: true,
    idealizado: 'Interpolación lineal de la longitud con el orden de enlace.', metodo: 'interpolación desde el enlace doble', sinVerificar: [RENG_LONGITUDES_NOTA_EN], lista: RENG_LONGITUDES_EN, x: [1.2, 1.8, 0.05], valida: (_e, x) => Math.abs(x - 1.5) > 0.01,
    respuesta: ([, s, d], x) => s - (x - 1) * (s - d),
    errores: ([, s, d], x) => [
      ['media', 'Media simple', (s + d) / 2, 'Tomaste la media de las dos longitudes; el orden no es exactamente 1,5.'],
      ['al-reves', 'Interpolación al revés', d + (x - 1) * (s - d), 'Interpolaste al revés: a mayor orden, enlace más corto.']
    ],
    enunciado: ([t, s, d], x) => `Para los enlaces ${t}, la longitud típica es ${s} pm (sencillo) y ${d} pm (doble). Una especie resonante tiene ese enlace con orden ${tx(x)}.`,
    pregunta: '¿Qué longitud se estima por interpolación lineal, en pm?',
    datos: ([, s, d], x) => [['Sencillo (orden 1)', `${s} pm`], ['Doble (orden 2)', `${d} pm`], ['Orden', tx(x)]],
    pasos: ([, s, d], x, _y, rengR) => [`d = ${s} − (${tx(x)} − 1) × (${s} − ${d}).`, `d ≈ ${tx(rengR, 4)} pm.`],
    pistas: ['A mayor orden, enlace más corto.', 'Calcula la fracción entre 1 y 2.', 'Resta esa parte de la diferencia.']
  })
]

export const RENG_PRACTICAS_B04_S06: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s6-p1', titulo: 'Energía de un par de iones', unidad: 'kJ/mol',
    objetivo: 'Calcular la energía de atracción electrostática de un par de iones en contacto.', seccion: '7.1', para: 'el enlace iónico', nucleo: true,
    idealizado: 'Iones como cargas puntuales separadas la suma de sus radios.', metodo: 'función de Coulomb del núcleo de la app', sinVerificar: ['Radios iónicos de tablas de texto recordados (los mismos de la escena «tendencias-periodicas»).'], lista: RENG_PARES_IONICOS_EN,
    respuesta: ([c, a]) => rengCoulombEn(c, a),
    errores: ([c, a]) => [
      ['sin-cargas', 'Sin las cargas', RENG_K_EN / rengDistanciaIonicaEn(c, a), 'Olvidaste multiplicar por las cargas de los iones.'],
      ['cuadrado', 'Distancia al cuadrado', (RENG_K_EN * Math.abs(q(c) * q(a))) / rengDistanciaIonicaEn(c, a) ** 2, 'Dividiste entre la distancia al cuadrado (eso da la fuerza); la energía va con 1/r.']
    ],
    enunciado: ([c, a]) => `Los iones ${ion(c)} (radio ${r(c)} pm) y ${ion(a)} (radio ${r(a)} pm) están en contacto. La energía de un mol de pares es E = 1389,35·|q₁·q₂|/r kJ/mol, con r en Å.`,
    pregunta: '¿Cuánto vale la energía de atracción, en kJ/mol (valor absoluto)?',
    datos: ([c, a]) => [['Cargas', `${sg(q(c))} y ${sg(q(a))}`], ['Distancia', `${r(c)} + ${r(a)} pm = ${tx(rengDistanciaIonicaEn(c, a), 4)} Å`]],
    pasos: ([c, a], _x, _y, rengR) => [`E = 1389,35 × ${Math.abs(q(c) * q(a))} / ${tx(rengDistanciaIonicaEn(c, a), 4)}.`, `E = ${tx(rengR, 4)} kJ/mol.`],
    pistas: ['Suma los radios y pásalos a Å.', 'Multiplica las cargas.', 'Divide entre la distancia.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s6-p2', titulo: 'Comparar dos compuestos iónicos', unidad: '',
    objetivo: 'Comparar la atracción entre iones de dos compuestos según sus cargas y sus tamaños.', seccion: '7.1', para: 'el enlace iónico', nucleo: true,
    idealizado: 'Pares de iones en contacto.', metodo: 'función de Coulomb del núcleo de la app', sinVerificar: ['Radios iónicos de tablas de texto recordados (los mismos de la escena «tendencias-periodicas»).'], lista: RENG_COMPARACIONES_IONICAS_EN,
    respuesta: ([c1, a1, c2, a2]) => rengCoulombEn(c2, a2) / rengCoulombEn(c1, a1),
    errores: ([c1, a1, c2, a2]) => [
      ['solo-cargas', 'Solo las cargas', Math.abs(q(c2) * q(a2)) / Math.abs(q(c1) * q(a1)), 'Comparaste solo las cargas; también influye la distancia entre los iones.'],
      ['inverso', 'Cociente invertido', rengCoulombEn(c1, a1) / rengCoulombEn(c2, a2), 'Dividiste al revés: se pide la del segundo compuesto entre la del primero.']
    ],
    enunciado: ([c1, a1, c2, a2]) => `En un primer compuesto, los iones ${ion(c1)} y ${ion(a1)} están a ${tx(rengDistanciaIonicaEn(c1, a1), 4)} Å; en un segundo compuesto, los iones ${ion(c2)} y ${ion(a2)} están a ${tx(rengDistanciaIonicaEn(c2, a2), 4)} Å. La energía de un par es proporcional a |q₁·q₂|/r.`,
    pregunta: '¿Cuántas veces mayor es la atracción del par del segundo compuesto respecto al primero?',
    datos: ([c1, a1, c2, a2]) => [[`${c1}–${a1}`, `|q₁q₂| = ${Math.abs(q(c1) * q(a1))}; r = ${tx(rengDistanciaIonicaEn(c1, a1), 4)} Å`], [`${c2}–${a2}`, `|q₁q₂| = ${Math.abs(q(c2) * q(a2))}; r = ${tx(rengDistanciaIonicaEn(c2, a2), 4)} Å`]],
    pasos: ([c1, a1, c2, a2], _x, _y, rengR) => [`Se comparan ${Math.abs(q(c2) * q(a2))}/${tx(rengDistanciaIonicaEn(c2, a2), 4)} y ${Math.abs(q(c1) * q(a1))}/${tx(rengDistanciaIonicaEn(c1, a1), 4)}.`, `Cociente = ${tx(rengR)}.`],
    pistas: ['Calcula |q₁q₂|/r en cada compuesto.', 'Divide el segundo entre el primero.', 'Más carga y menos distancia atraen más.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s6-p3', titulo: 'Distancia para una energía dada', unidad: 'Å',
    objetivo: 'Despejar la distancia entre dos iones a la que su energía de atracción tiene un valor dado.', seccion: '7.1', para: 'el enlace iónico', nucleo: true,
    idealizado: 'Iones como cargas puntuales.', metodo: 'búsqueda por bisección con la función de Coulomb del núcleo', lista: RENG_CARGAS_EN, x: [200, 1500, 10],
    respuesta: ([a, b], x) => (RENG_K_EN * a * b) / x,
    errores: ([a, b], x) => [
      ['sin-cargas', 'Sin las cargas', RENG_K_EN / x, 'Olvidaste las cargas: la energía es proporcional a su producto.'],
      ['invertida', 'Cociente invertido', x / (RENG_K_EN * a * b), 'Despejaste al revés: r = 1389,35·|q₁q₂|/E.']
    ],
    enunciado: ([a, b], x) => `Un catión de carga +${a} y un anión de carga −${b} se atraen con una energía de ${tx(x, 4)} kJ/mol (valor absoluto). Dato: E = 1389,35·|q₁·q₂|/r, con r en Å.`,
    pregunta: '¿A qué distancia están, en Å?',
    datos: ([a, b], x) => [['Cargas', `+${a} y −${b}`], ['Energía', `${tx(x, 4)} kJ/mol`]],
    pasos: ([a, b], x, _y, rengR) => [`r = 1389,35 × ${a * b} / ${tx(x, 4)}.`, `r = ${tx(rengR)} Å.`],
    pistas: ['Despeja r de la fórmula.', 'Multiplica las cargas.', 'Divide entre la energía.']
  })
]

export const RENG_PRACTICAS_B04_S07: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s7-p1', titulo: 'Energía para romper enlaces', unidad: 'kJ',
    objetivo: 'Calcular la energía necesaria para romper los enlaces de una cantidad de moléculas diatómicas.', seccion: '7.5', para: 'la energía de enlace', nucleo: true,
    idealizado: 'Moléculas en fase gas.', metodo: 'datos de moléculas diatómicas del núcleo de la app', lista: RENG_DIATOMICAS_EN, x: [0.1, 5, 0.1],
    respuesta: (f, x) => x * D(f),
    errores: (f, x) => [
      ['dividir', 'Dividiendo', D(f) / x, 'Dividiste la energía entre los moles; hay que multiplicar.'],
      ['ev', 'En eV', x * RENG_DIATOMICAS[f]!.D0, 'Usaste el valor en eV por molécula; pásalo antes a kJ/mol.']
    ],
    enunciado: (f, x) => `La energía de disociación del ${T(f)} es ${tx(D(f), 4)} kJ/mol (${tx(RENG_DIATOMICAS[f]!.D0, 5)} eV por molécula). Se disocian ${tx(x)} mol.`,
    pregunta: '¿Qué energía hace falta, en kJ?',
    datos: (f, x) => [['Energía de enlace', `${tx(D(f), 4)} kJ/mol`], ['Cantidad', `${tx(x)} mol`]],
    pasos: (f, x, _y, rengR) => [`E = n × energía de enlace = ${tx(x)} × ${tx(D(f), 4)}.`, `E = ${tx(rengR)} kJ.`],
    pistas: ['La energía de enlace es por mol.', 'Multiplica por los moles.', 'Romper enlaces absorbe energía.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s7-p2', titulo: 'Energía para un número de moléculas', unidad: 'kJ',
    objetivo: 'Calcular la energía necesaria para disociar un número dado de moléculas.', seccion: '7.5', para: 'la energía de enlace', nucleo: true,
    idealizado: 'Moléculas en fase gas.', metodo: 'energía por molécula en eV convertida con el catálogo de unidades', lista: RENG_DIATOMICAS_EN, x: [1, 60, 1],
    respuesta: (f, x) => ((x * 1e22) / RENG_NA_EN) * D(f),
    errores: (f, x) => [
      ['por-mol', 'Energía de un mol', D(f), 'Esa es la energía para un mol de moléculas; aquí hay otra cantidad.'],
      ['sin-avogadro', 'Moléculas como moles', x * D(f), 'Trataste el número de moléculas (en 10²²) como si fueran moles.']
    ],
    enunciado: (f, x) => `La energía de disociación del ${T(f)} es ${tx(D(f), 4)} kJ/mol. Se disocian ${x}·10²² moléculas.`,
    pregunta: '¿Qué energía hace falta, en kJ?',
    datos: (f, x) => [['Energía de enlace', `${tx(D(f), 4)} kJ/mol`], ['Moléculas', `${x}·10²²`], ['N_A', '6,022·10²³ mol⁻¹']],
    pasos: (f, x, _y, rengR) => [`n = ${x}·10²² / 6,022·10²³ = ${tx((x * 1e22) / RENG_NA_EN)} mol.`, `E = n × ${tx(D(f), 4)} = ${tx(rengR)} kJ.`],
    pistas: ['Pasa las moléculas a moles.', 'Divide entre N_A.', 'Multiplica por la energía molar.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s7-p3', titulo: 'Balance con energías de enlace', unidad: 'kJ',
    objetivo: 'Estimar el balance de energía de una reacción con energías medias de enlace.', seccion: '7.5', para: 'las energías de enlace', tablas: true,
    idealizado: 'Energías medias de enlace en fase gas.', metodo: 'suma enlace a enlace con la tabla de energías', sinVerificar: ['Energías medias de enlace (kJ/mol) de tablas de texto recordadas: son promedios y dan solo una estimación.'], lista: RENG_REACCIONES_EN,
    respuesta: ([, a, b]) => rengSumaEnlacesEn(a) - rengSumaEnlacesEn(b),
    errores: ([, a, b]) => [
      ['al-reves', 'Formados menos rotos', rengSumaEnlacesEn(b) - rengSumaEnlacesEn(a), 'Restaste al revés: el balance es enlaces rotos menos enlaces formados.'],
      ['sin-coeficientes', 'Un enlace de cada tipo', rengSumaEnlacesEn(a, false) - rengSumaEnlacesEn(b, false), 'Contaste un solo enlace de cada tipo; multiplica por cuántos se rompen y se forman.']
    ],
    enunciado: ([t, a, b]) => `En la reacción ${t} se rompen ${rengTextoBalanceEn(a)} y se forman ${rengTextoBalanceEn(b)}.`,
    pregunta: '¿Cuál es el balance de energía estimado (enlaces rotos menos formados), en kJ?',
    datos: ([, a, b]) => [...new Set([...a, ...b].map(([e]) => e))].map((e) => [e, `${RENG_ENERGIA_MEDIA_EN[e]} kJ/mol`] as const),
    pasos: ([, a, b], _x, _y, rengR) => [`Rotos: ${tx(rengSumaEnlacesEn(a), 5)} kJ; formados: ${tx(rengSumaEnlacesEn(b), 5)} kJ.`, `Balance = ${tx(rengR, 4)} kJ: ${rengR < 0 ? 'la reacción libera energía' : 'la reacción absorbe energía'}.`],
    pistas: ['Suma la energía de los enlaces rotos.', 'Suma la de los enlaces formados.', 'Resta formados de rotos.']
  })
]

export const RENG_PRACTICAS_B04_S08: readonly RengPracticaN1[] = [
  rengPracticaEn({
    id: 'n1-b4-s8-p1', titulo: 'Carga formal del átomo dador', unidad: '', tolerancia: E,
    objetivo: 'Calcular la carga formal de un átomo después de ceder pares libres para formar enlaces coordinados.', seccion: '7.2', para: 'el enlace covalente coordinado', lewis: true,
    idealizado: 'Estructuras de Lewis con pares localizados.', metodo: 'escena «carga-formal»', lista: RENG_DADORES_EN, x: [1, 2, 1], valida: ([, , l], x) => l >= 2 * x,
    respuesta: ([, v, l, b], x) => v - (l - 2 * x) - (b + x),
    errores: ([, v, l, b], x) => [
      ['sin-cambio', 'Sin cambio', v - l - b, 'Esa es la carga formal antes de ceder el par; al compartirlo, el átomo pasa a contar solo la mitad.'],
      ['resta', 'Restando', v - l - b - x, 'Al ceder un par la carga formal aumenta en una unidad, no disminuye.']
    ],
    enunciado: ([t, v, l, b], x) => `Considera ${t}, con ${v} electrones de valencia, ${l} electrones no enlazantes y ${b} ${b === 1 ? 'enlace' : 'enlaces'}. Cede ${x === 1 ? 'un par libre' : 'dos pares libres'} para formar ${x === 1 ? 'un enlace coordinado' : 'dos enlaces coordinados'}.`,
    pregunta: '¿Qué carga formal tiene después (con signo)?',
    datos: ([, v, l, b], x) => [['Antes', `V ${v}; L ${l}; B ${b}`], ['Después', `L ${l - 2 * x}; B ${b + x}`]],
    pasos: ([, v, l, b], x, _y, rengR) => [`CF = ${v} − ${l - 2 * x} − ${b + x}.`, `CF = ${sg(rengR)}: una unidad más por cada par cedido.`],
    pistas: ['Cada par cedido resta dos no enlazantes.', 'Cada par cedido suma un enlace.', 'Aplica la fórmula de la carga formal.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s8-p2', titulo: 'Carga formal del átomo aceptor', unidad: '', tolerancia: E,
    objetivo: 'Calcular la carga formal de un átomo o ion después de aceptar pares de electrones.', seccion: '7.2', para: 'el enlace covalente coordinado', lewis: true,
    idealizado: 'Contabilidad de Lewis: cada par aceptado cuenta como un enlace.', metodo: 'escena «carga-formal»', lista: RENG_ACEPTORES_EN, x: [1, 6, 1], valida: ([, , m], x) => x <= m,
    respuesta: ([, c], x) => c - x,
    errores: ([, c], x) => [
      ['sin-cambio', 'Sin cambio', c, 'Esa es la carga formal antes de aceptar los pares.'],
      ['suma', 'Sumando', c + x, 'Al aceptar un par la carga formal disminuye en una unidad, no aumenta.']
    ],
    enunciado: ([t, c], x) => `Considera ${t}, con carga formal ${c === 0 ? '0' : sg(c)}. Acepta ${x} ${x === 1 ? 'par de electrones' : 'pares de electrones'} de átomos dadores.`,
    pregunta: '¿Qué carga formal tiene después (con signo)?',
    datos: ([, c], x) => [['Carga formal inicial', c === 0 ? '0' : sg(c)], ['Pares aceptados', String(x)]],
    pasos: ([, c], x, _y, rengR) => [`Cada par aceptado añade un enlace y resta una unidad: ${c} − ${x}.`, `CF = ${sg(rengR)}.`],
    pistas: ['Cada par aceptado es un enlace nuevo.', 'Un enlace resta una unidad.', 'Resta los pares de la carga inicial.']
  }),
  rengPracticaEn({
    id: 'n1-b4-s8-p3', titulo: 'Electrones alrededor del aceptor', unidad: '', tolerancia: E,
    objetivo: 'Contar los electrones que rodean a un átomo aceptor después de formar enlaces coordinados.', seccion: '7.2', para: 'el enlace covalente coordinado', lewis: true,
    idealizado: 'Sin pares libres en el átomo aceptor.', metodo: 'escena «carga-formal»', lista: RENG_ACEPTORES_EN, x: [1, 6, 1], valida: ([, , m], x) => x <= m,
    respuesta: ([, , , b], x) => 2 * (b + x),
    errores: ([, , , b], x) => [
      ['sin-doblar', 'Un electrón por enlace', b + x, 'Para contar los electrones alrededor, cada enlace cuenta con sus dos electrones.'],
      ['antes', 'Antes de aceptar', 2 * b, 'Esos son los electrones que tenía antes de aceptar los pares.']
    ],
    enunciado: ([t, , , b], x) => `Considera ${t}, que tiene ${b} ${b === 1 ? 'enlace' : 'enlaces'} y ningún par libre. Acepta ${x} ${x === 1 ? 'par de electrones' : 'pares de electrones'}.`,
    pregunta: '¿Cuántos electrones le rodean después?',
    datos: ([, , , b], x) => [['Enlaces iniciales', String(b)], ['Pares aceptados', String(x)]],
    pasos: ([, , , b], x, _y, rengR) => [`Enlaces: ${b} + ${x} = ${b + x}.`, `Electrones: 2 × ${b + x} = ${tx(rengR)}.`],
    pistas: ['Cuenta todos los enlaces.', 'Incluye los enlaces coordinados.', 'Cada enlace son dos electrones.']
  })
]
