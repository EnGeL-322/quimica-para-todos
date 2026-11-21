import { rengCalculado, rengDeclarada, rengDidactico, rengIdealizado, rengSinVerificar } from '../../aprender/n1/procedencia'
import { RENG_ELEMENTOS, type RengElemento } from '../../../tabla-periodica/data'
import { rengPropiedadesAdicionales } from '../../../tabla-periodica/propiedadesReferencia'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

export const RENG_GRUPOS_REPRESENTATIVOS: readonly number[] = [1, 2, 13, 14, 15, 16, 17, 18]

export const RENG_RADIO_PM: Readonly<Record<string, number>> = {
  H: 37, He: 31,
  Li: 152, Be: 112, B: 85, C: 77, N: 75, O: 73, F: 72, Ne: 70,
  Na: 186, Mg: 160, Al: 143, Si: 118, P: 110, S: 103, Cl: 99, Ar: 98,
  K: 227, Ca: 197, Ga: 135, Ge: 123, As: 120, Se: 117, Br: 114, Kr: 112,
  Rb: 248, Sr: 215, In: 166, Sn: 140, Sb: 141, Te: 143, I: 133, Xe: 131
}

export const RENG_EI_KJ: Readonly<Record<string, number>> = {
  H: 1312, He: 2372,
  Li: 520, Be: 899, B: 801, C: 1086, N: 1402, O: 1314, F: 1681, Ne: 2081,
  Na: 496, Mg: 738, Al: 578, Si: 786, P: 1012, S: 1000, Cl: 1251, Ar: 1521,
  K: 419, Ca: 590, Ga: 579, Ge: 762, As: 947, Se: 941, Br: 1140, Kr: 1351,
  Rb: 403, Sr: 549, In: 558, Sn: 709, Sb: 834, Te: 869, I: 1008, Xe: 1170
}

export const RENG_AE_KJ: Readonly<Record<string, number>> = {
  H: 73, Li: 60, Na: 53, K: 48, Rb: 47, B: 27, Al: 42, C: 122, Si: 134, Ge: 119, Sn: 107, P: 72, As: 78, Sb: 101, O: 141, S: 200, Se: 195, Te: 190, F: 328, Cl: 349, Br: 325, I: 295
}

export const RENG_RADIO_ION_PM: Readonly<Record<string, readonly [carga: number, radio: number]>> = {
  Li: [1, 76], Na: [1, 102], K: [1, 138], Rb: [1, 152], Be: [2, 45], Mg: [2, 72], Ca: [2, 100], Sr: [2, 118], Al: [3, 54],
  F: [-1, 133], Cl: [-1, 181], Br: [-1, 196], I: [-1, 220], O: [-2, 140], S: [-2, 184], Se: [-2, 198], N: [-3, 146]
}

export const RENG_SIN_VERIFICAR_TENDENCIAS = 'Radios atómicos e iónicos (pm), primeras energías de ionización y afinidades electrónicas (kJ/mol): valores de tablas de libros de texto recordados, no contrastados en esta entrega; los radios dependen de la definición usada (covalente, metálico o iónico).'

const RENG_METALES = new Set(['alcalino', 'alcalinoterreo', 'transicion', 'postransicion', 'lantanido', 'actinido'])
export const rengCaracterDe = (rengE: RengElemento): number => (RENG_METALES.has(rengE.categoria) ? 1 : rengE.categoria === 'metaloide' ? 0.5 : 0)
export const rengElementoDe = (rengPeriodo: number, rengGrupo: number): RengElemento => RENG_ELEMENTOS.find((rengE) => rengE.periodo === rengPeriodo && rengE.grupo === rengGrupo && rengE.categoria !== 'lantanido' && rengE.categoria !== 'actinido')!
export const rengElectronegatividadDe = (rengZ: number): number => rengPropiedadesAdicionales(rengZ).electronegatividad ?? 0

const rengNum = (rengV: number, rengC = 3): string => String(Number(rengV.toPrecision(rengC))).replace('.', ',')
const rengElegido = (rengV: RengValoresEscenaN1): RengElemento => rengElementoDe(Math.min(5, Math.max(2, Math.round(rengV.periodo!))), RENG_GRUPOS_REPRESENTATIVOS[Math.min(8, Math.max(1, Math.round(rengV.columna!))) - 1]!)

export function rengLecturasTendencias(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengE = rengElegido(rengV)
  return {
    Z: rengE.z,
    grupo: rengE.grupo!,
    valencia: Math.min(8, Math.max(1, Math.round(rengV.columna!))),
    radio: RENG_RADIO_PM[rengE.simbolo]!,
    ei: RENG_EI_KJ[rengE.simbolo]!,
    en: rengElectronegatividadDe(rengE.z),
    metal: rengCaracterDe(rengE)
  }
}

export const RENG_ESCENA_TENDENCIAS: RengModeloEscenaN1 = {
  id: 'tendencias-periodicas',
  nombre: 'Tendencias periódicas',
  subtemas: ['n1-b3-s2', 'n1-b3-s3', 'n1-b3-s5', 'n1-b3-s6', 'n1-b3-s7', 'n1-b3-s8', 'n1-b3-s9', 'n1-b3-s10', 'n1-b3-s11', 'n1-b3-s15', 'n1-b3-s17', 'n1-b3-s19', 'n1-b3-s20', 'n1-b3-s22', 'n1-b3-s23'],
  pregunta: '¿Cómo cambian el tamaño, la energía de ionización y la electronegatividad al moverse por la tabla periódica?',
  parametros: [
    { clave: 'periodo', etiqueta: 'Periodo', unidad: 'sin unidad', min: 2, max: 5, paso: 1, inicial: 3 },
    { clave: 'columna', etiqueta: 'Electrones de valencia (grupos 1, 2 y 13 a 18)', unidad: 'sin unidad', min: 1, max: 8, paso: 1, inicial: 1 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'Z', etiqueta: 'Número atómico', unidad: 'sin unidad', cifras: 3 },
    { clave: 'grupo', etiqueta: 'Grupo', unidad: 'sin unidad', cifras: 3 },
    { clave: 'valencia', etiqueta: 'Electrones de valencia', unidad: 'sin unidad', cifras: 3 },
    { clave: 'radio', etiqueta: 'Radio atómico', unidad: 'pm', cifras: 3 },
    { clave: 'ei', etiqueta: 'Primera energía de ionización', unidad: 'kJ/mol', cifras: 4 },
    { clave: 'en', etiqueta: 'Electronegatividad de Pauling (0 = sin valor)', unidad: 'sin unidad', cifras: 3 },
    { clave: 'metal', etiqueta: 'Carácter (1 metal; 0,5 metaloide; 0 no metal)', unidad: 'sin unidad', cifras: 2 }
  ],
  lecturas: (rengV) => rengLecturasTendencias(rengV),
  enPalabras: (rengV, _rengT, rengL) => {
    const rengE = rengElegido(rengV)
    const rengTipo = rengL.metal === 1 ? 'un metal' : rengL.metal === 0.5 ? 'un metaloide' : 'un no metal'
    const rengEn = rengL.en! > 0 ? `su electronegatividad es ${rengNum(rengL.en!)}` : 'no tiene un valor de electronegatividad de Pauling asignado'
    return `El ${rengE.nombre.toLowerCase()} (${rengE.simbolo}, Z = ${rengNum(rengL.Z!)}) está en el periodo ${rengE.periodo} y el grupo ${rengNum(rengL.grupo!)}: es ${rengTipo} con ${rengNum(rengL.valencia!)} electrones de valencia. Su radio atómico es de ${rengNum(rengL.radio!)} pm, su primera energía de ionización de ${rengNum(rengL.ei!, 4)} kJ/mol y ${rengEn}. Al avanzar por el periodo el radio tiende a disminuir y la energía de ionización a aumentar; al bajar por el grupo ocurre lo contrario.`
  },
  grafica: {
    tituloX: 'electrones de valencia',
    tituloY: 'radio atómico (pm)',
    ejeX: () => [1, 8],
    ejeY: () => [0, 260],
    curvas: (rengV) => [{ nombre: `periodo ${Math.min(5, Math.max(2, Math.round(rengV.periodo!)))}`, puntos: Array.from({ length: 8 }, (_rengX, rengI) => [rengI + 1, rengLecturasTendencias({ ...rengV, columna: rengI + 1 }).radio!] as const) }],
    cursor: (rengV, _rengT, rengL) => [Math.min(8, Math.max(1, Math.round(rengV.columna!))), rengL.radio!]
  },
  ficha: {
    descripcion: 'La escena recorre los elementos representativos de los periodos 2 a 5 y muestra tres propiedades periódicas. En un periodo, la carga nuclear efectiva crece y el átomo se encoge; en un grupo, cada elemento tiene una capa más y el átomo crece. La energía de ionización y la electronegatividad siguen, en general, la tendencia contraria al radio.',
    ecuaciones: [
      { tex: String.raw`Z_{ef} \approx Z - S`, texto: 'carga nuclear efectiva ≈ Z − electrones internos' },
      { tex: String.raw`\mathrm{X(g)} \rightarrow \mathrm{X^+(g)} + e^-`, texto: 'primera ionización: X(g) → X⁺(g) + e⁻' }
    ],
    supuestos: ['Átomos aislados en fase gas.', 'Los radios combinan radios covalentes y metálicos, como en las tablas habituales de los libros de texto.'],
    limites: [
      'Solo incluye los grupos 1, 2 y 13 a 18 de los periodos 2 a 5: no muestra los metales de transición.',
      'Las tendencias tienen excepciones (por ejemplo, la energía de ionización baja del grupo 2 al 13 y del 15 al 16).',
      'Los gases nobles ligeros no tienen electronegatividad de Pauling: la escena muestra 0.'
    ],
    condicionesIniciales: 'Sodio (periodo 3, grupo 1): 186 pm, 496 kJ/mol y electronegatividad 0,93.',
    procedencia: [
      rengSinVerificar(RENG_SIN_VERIFICAR_TENDENCIAS),
      rengDeclarada('Electronegatividades de Pauling: datos de PubChem guardados en la app (tabla periódica), no abiertos de nuevo en esta entrega.'),
      rengDidactico('El periodo y el número de electrones de valencia los eliges tú.'),
      rengIdealizado('Átomos aislados; tendencias generales con excepciones.'),
      rengCalculado('Las pruebas comprueban que cada lectura coincide con la tabla de datos y con la posición del elemento en la tabla periódica de la app, y las tendencias generales entre los extremos de cada periodo y grupo.')
    ]
  },
  casos: [
    { nombre: 'Flúor: pequeño y muy electronegativo', valores: { periodo: 2, columna: 7 } },
    { nombre: 'Rubidio: grande y fácil de ionizar', valores: { periodo: 5, columna: 1 } },
    { nombre: 'Silicio: un metaloide', valores: { periodo: 3, columna: 4 } }
  ]
}
