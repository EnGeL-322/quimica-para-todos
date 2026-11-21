import { rengCalculado, rengDidactico, rengIdealizado, RENG_PROCEDENCIA_MASAS } from '../../aprender/n1/procedencia'
import { rengPorSimbolo } from '../../../tabla-periodica/data'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const RENG_M = (rengS: string): number => rengPorSimbolo.get(rengS)!.masa
const rengNum = (rengV: number, rengCifras = 4): string => String(Number(rengV.toPrecision(rengCifras))).replace('.', ',')
const rengSub = (rengN: number): string => (rengN === 1 ? '' : String(rengN).replace(/[0-9]/g, (rengD) => '₀₁₂₃₄₅₆₇₈₉'[Number(rengD)]!))

export interface RengFamiliaOrganica {
  clave: string
  nombre: string
  grupo: string
  hExtra: number
  O: number
  N: number
  minC: number
  gi: number
  dadores: number
}

export const RENG_FAMILIAS_ORGANICAS: readonly RengFamiliaOrganica[] = [
  { clave: 'alcohol', nombre: 'alcohol', grupo: 'hidroxilo, –OH', hExtra: 2, O: 1, N: 0, minC: 1, gi: 0, dadores: 1 },
  { clave: 'eter', nombre: 'éter', grupo: 'éter, C–O–C', hExtra: 2, O: 1, N: 0, minC: 2, gi: 0, dadores: 0 },
  { clave: 'aldehido', nombre: 'aldehído', grupo: 'carbonilo en un extremo, –CHO', hExtra: 0, O: 1, N: 0, minC: 1, gi: 1, dadores: 0 },
  { clave: 'cetona', nombre: 'cetona', grupo: 'carbonilo entre dos carbonos, C–CO–C', hExtra: 0, O: 1, N: 0, minC: 3, gi: 1, dadores: 0 },
  { clave: 'acido', nombre: 'ácido carboxílico', grupo: 'carboxilo, –COOH', hExtra: 0, O: 2, N: 0, minC: 1, gi: 1, dadores: 1 },
  { clave: 'ester', nombre: 'éster', grupo: 'éster, –COO–', hExtra: 0, O: 2, N: 0, minC: 2, gi: 1, dadores: 0 },
  { clave: 'amina', nombre: 'amina primaria', grupo: 'amino, –NH₂', hExtra: 3, O: 0, N: 1, minC: 1, gi: 0, dadores: 2 },
  { clave: 'amida', nombre: 'amida primaria', grupo: 'amida, –CO–NH₂', hExtra: 1, O: 1, N: 1, minC: 1, gi: 1, dadores: 2 }
]

export const rengFamiliaDe = (rengV: RengValoresEscenaN1): RengFamiliaOrganica => RENG_FAMILIAS_ORGANICAS[Math.min(RENG_FAMILIAS_ORGANICAS.length, Math.max(1, Math.round(rengV.familia!))) - 1]!

export function rengLecturasFamilia(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengF = rengFamiliaDe(rengV)
  const rengC = Math.max(rengF.minC, Math.round(rengV.C!))
  const rengH = 2 * rengC + rengF.hExtra
  return { carbonos: rengC, H: rengH, O: rengF.O, N: rengF.N, masa: rengC * RENG_M('C') + rengH * RENG_M('H') + rengF.O * RENG_M('O') + rengF.N * RENG_M('N'), gi: rengF.gi, dadores: rengF.dadores }
}

export const rengFormulaFamilia = (rengL: RengValoresEscenaN1): string => `C${rengSub(rengL.carbonos!)}H${rengSub(rengL.H!)}${rengL.N! > 0 ? `N${rengSub(rengL.N!)}` : ''}${rengL.O! > 0 ? `O${rengSub(rengL.O!)}` : ''}`

export const RENG_ESCENA_FAMILIA_ORGANICA: RengModeloEscenaN1 = {
  id: 'familia-organica',
  nombre: 'Familias de compuestos orgánicos',
  subtemas: ['n1-b12-s5', 'n1-b12-s12', 'n1-b12-s13', 'n1-b12-s14', 'n1-b12-s15', 'n1-b12-s16', 'n1-b12-s17', 'n1-b12-s18', 'n1-b12-s19'],
  pregunta: '¿Cómo cambia la fórmula de un compuesto al cambiar su grupo funcional?',
  parametros: [
    { clave: 'C', etiqueta: 'Átomos de carbono', unidad: 'sin unidad', min: 1, max: 10, paso: 1, inicial: 2 },
    { clave: 'familia', etiqueta: 'Familia (1 alcohol, 2 éter, 3 aldehído, 4 cetona, 5 ácido, 6 éster, 7 amina, 8 amida)', unidad: 'sin unidad', min: 1, max: 8, paso: 1, inicial: 1 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'carbonos', etiqueta: 'Carbonos de la molécula', unidad: 'sin unidad', cifras: 2 },
    { clave: 'H', etiqueta: 'Átomos de hidrógeno', unidad: 'sin unidad', cifras: 3 },
    { clave: 'O', etiqueta: 'Átomos de oxígeno', unidad: 'sin unidad', cifras: 1 },
    { clave: 'N', etiqueta: 'Átomos de nitrógeno', unidad: 'sin unidad', cifras: 1 },
    { clave: 'masa', etiqueta: 'Masa molar', unidad: 'g/mol', cifras: 5 },
    { clave: 'gi', etiqueta: 'Grado de insaturación', unidad: 'sin unidad', cifras: 1 },
    { clave: 'dadores', etiqueta: 'Hidrógenos unidos a O o N', unidad: 'sin unidad', cifras: 1 }
  ],
  lecturas: (rengV) => rengLecturasFamilia(rengV),
  enPalabras: (rengV, _rengT, rengL) => {
    const rengF = rengFamiliaDe(rengV)
    const rengAviso = rengL.carbonos! > Math.round(rengV.C!) ? ` Esta familia necesita al menos ${rengF.minC} carbono(s); se muestra el compuesto más pequeño.` : ''
    return `Un ${rengF.nombre} saturado de cadena abierta con ${rengL.carbonos} carbono(s) tiene fórmula ${rengFormulaFamilia(rengL)} y masa molar ${rengNum(rengL.masa!, 5)} g/mol. Su grupo funcional es el ${rengF.grupo}. ${rengF.gi === 1 ? 'El enlace doble C=O le da un grado de insaturación.' : 'No tiene enlaces múltiples ni anillos.'} ${rengF.dadores > 0 ? 'Tiene hidrógeno unido a oxígeno o nitrógeno: sus moléculas forman enlaces de hidrógeno entre sí y hierve a temperatura alta para su tamaño.' : 'No tiene hidrógeno unido a oxígeno o nitrógeno: sus moléculas no forman enlaces de hidrógeno entre sí.'}${rengAviso}`
  },
  grafica: {
    tituloX: 'átomos de carbono',
    tituloY: 'masa molar (g/mol)',
    ejeX: () => [1, 10],
    ejeY: () => [0, 200],
    curvas: (rengV) => [{ nombre: rengFamiliaDe(rengV).nombre, puntos: Array.from({ length: 10 }, (_rengX, rengI) => [rengI + 1, rengLecturasFamilia({ ...rengV, C: rengI + 1 }).masa!] as const) }],
    cursor: (_rengV, _rengT, rengL) => [rengL.carbonos!, rengL.masa!]
  },
  ficha: {
    descripcion: 'Un grupo funcional es un átomo o grupo de átomos que da a la molécula sus propiedades características. Los compuestos con el mismo grupo forman una familia, y dentro de ella una serie homóloga: cada miembro se diferencia del anterior en un –CH₂–, 14,03 g/mol. La escena da la fórmula general de ocho familias saturadas de cadena abierta.',
    ecuaciones: [
      { tex: String.raw`C_nH_{2n+2}O`, texto: 'alcoholes y éteres: CnH2n+2O' },
      { tex: String.raw`C_nH_{2n}O`, texto: 'aldehídos y cetonas: CnH2nO' },
      { tex: String.raw`C_nH_{2n}O_2`, texto: 'ácidos carboxílicos y ésteres: CnH2nO₂' },
      { tex: String.raw`C_nH_{2n+3}N \quad C_nH_{2n+1}NO`, texto: 'aminas: CnH2n+3N; amidas primarias: CnH2n+1NO' }
    ],
    supuestos: ['Cadena abierta y saturada, con un solo grupo funcional.', 'Aminas y amidas primarias.'],
    limites: [
      'Da la fórmula molecular, no la estructura: alcoholes y éteres, o aldehídos y cetonas, comparten fórmula y son isómeros de función.',
      'No calcula puntos de ebullición; solo indica si la molécula puede dar enlaces de hidrógeno.',
      'No incluye compuestos con varios grupos funcionales, anillos ni enlaces múltiples entre carbonos.'
    ],
    condicionesIniciales: 'Alcohol de dos carbonos: etanol, C₂H₆O.',
    procedencia: [RENG_PROCEDENCIA_MASAS, rengDidactico('El número de carbonos y la familia los eliges tú.'), rengIdealizado('Fórmulas generales de series homólogas saturadas.'), rengCalculado('Las pruebas comparan la fórmula y la masa molar de cada familia con las de moléculas reales construidas con el motor de estructuras de la app.')]
  },
  casos: [
    { nombre: 'Etanol, C₂H₆O', valores: { C: 2, familia: 1 } },
    { nombre: 'Propanona (acetona), C₃H₆O', valores: { C: 3, familia: 4 } },
    { nombre: 'Ácido etanoico (acético), C₂H₄O₂', valores: { C: 2, familia: 5 } },
    { nombre: 'Metanamina, CH₅N', valores: { C: 1, familia: 7 } }
  ]
}
