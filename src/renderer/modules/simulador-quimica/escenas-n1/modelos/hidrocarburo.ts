import { rengCalculado, rengDidactico, rengIdealizado, RENG_PROCEDENCIA_MASAS } from '../../aprender/n1/procedencia'
import { rengPorSimbolo } from '../../../tabla-periodica/data'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const RENG_MC = rengPorSimbolo.get('C')!.masa
const RENG_MH = rengPorSimbolo.get('H')!.masa
const rengNum = (rengV: number, rengCifras = 4): string => String(Number(rengV.toPrecision(rengCifras))).replace('.', ',')
const rengSub = (rengN: number): string => (rengN === 1 ? '' : String(rengN).replace(/[0-9]/g, (rengD) => '₀₁₂₃₄₅₆₇₈₉'[Number(rengD)]!))
export const RENG_PREFIJOS_CADENA: readonly string[] = ['met', 'et', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec', 'undec', 'dodec']

export interface RengEsqueletoHc { C: number; d: number; t: number; r: number }
export const rengEsqueletoHc = (rengV: RengValoresEscenaN1): RengEsqueletoHc => ({ C: Math.round(rengV.C!), d: Math.round(rengV.dobles!), t: Math.round(rengV.triples!), r: Math.round(rengV.anillos!) })
export const rengHidrogenosHc = (rengE: RengEsqueletoHc): number => 2 * rengE.C + 2 - 2 * (rengE.d + rengE.r) - 4 * rengE.t
export const rengPosibleHc = (rengE: RengEsqueletoHc): boolean => rengHidrogenosHc(rengE) >= 0 && rengE.C >= 2 * rengE.t && (rengE.d === 0 || rengE.C >= rengE.d + 1) && (rengE.r === 0 || rengE.C >= rengE.r + 2)

export function rengLecturasHidrocarburo(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengE = rengEsqueletoHc(rengV)
  const rengH = Math.max(0, rengHidrogenosHc(rengE))
  const rengMasa = rengE.C * RENG_MC + rengH * RENG_MH
  return {
    H: rengH,
    masa: rengMasa,
    gi: rengE.d + 2 * rengE.t + rengE.r,
    sigma: rengE.C + rengH - 1 + rengE.r,
    pi: rengE.d + 2 * rengE.t,
    o2: rengE.C + rengH / 4,
    h2: rengE.d + 2 * rengE.t,
    pctC: (100 * rengE.C * RENG_MC) / rengMasa,
    posible: rengPosibleHc(rengE) ? 1 : 0
  }
}

export function rengFamiliaHc(rengE: RengEsqueletoHc): string {
  if (rengE.C === 6 && rengE.d === 3 && rengE.t === 0 && rengE.r === 1) return 'la fórmula del benceno, el hidrocarburo aromático más sencillo'
  if (rengE.d === 0 && rengE.t === 0) return rengE.r === 0 ? `un alcano (${RENG_PREFIJOS_CADENA[rengE.C - 1]}ano si la cadena es lineal)` : 'un cicloalcano'
  if (rengE.t === 0) return rengE.r === 0 ? (rengE.d === 1 ? 'un alqueno' : 'un polieno, con varios enlaces dobles') : 'un cicloalqueno'
  if (rengE.d === 0 && rengE.r === 0) return rengE.t === 1 ? 'un alquino' : 'un hidrocarburo con dos enlaces triples'
  return 'un hidrocarburo con varios tipos de insaturación'
}

export const RENG_ESCENA_HIDROCARBURO: RengModeloEscenaN1 = {
  id: 'hidrocarburo',
  nombre: 'Fórmula de un hidrocarburo',
  subtemas: ['n1-b12-s1', 'n1-b12-s2', 'n1-b12-s3', 'n1-b12-s4', 'n1-b12-s6', 'n1-b12-s7', 'n1-b12-s8', 'n1-b12-s9', 'n1-b12-s10', 'n1-b12-s11', 'n1-b12-s20', 'n1-b12-s21'],
  pregunta: '¿Cuántos hidrógenos tiene un hidrocarburo según sus carbonos, enlaces múltiples y anillos?',
  parametros: [
    { clave: 'C', etiqueta: 'Átomos de carbono', unidad: 'sin unidad', min: 1, max: 12, paso: 1, inicial: 6 },
    { clave: 'dobles', etiqueta: 'Enlaces dobles C=C', unidad: 'sin unidad', min: 0, max: 3, paso: 1, inicial: 0 },
    { clave: 'triples', etiqueta: 'Enlaces triples C≡C', unidad: 'sin unidad', min: 0, max: 2, paso: 1, inicial: 0 },
    { clave: 'anillos', etiqueta: 'Anillos', unidad: 'sin unidad', min: 0, max: 2, paso: 1, inicial: 0 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'H', etiqueta: 'Átomos de hidrógeno', unidad: 'sin unidad', cifras: 3 },
    { clave: 'masa', etiqueta: 'Masa molar', unidad: 'g/mol', cifras: 5 },
    { clave: 'gi', etiqueta: 'Grado de insaturación', unidad: 'sin unidad', cifras: 2 },
    { clave: 'sigma', etiqueta: 'Enlaces σ', unidad: 'sin unidad', cifras: 3 },
    { clave: 'pi', etiqueta: 'Enlaces π', unidad: 'sin unidad', cifras: 2 },
    { clave: 'o2', etiqueta: 'O₂ para quemar un mol', unidad: 'mol', cifras: 4 },
    { clave: 'h2', etiqueta: 'H₂ para saturar un mol', unidad: 'mol', cifras: 2 },
    { clave: 'pctC', etiqueta: 'Carbono en masa', unidad: '%', cifras: 4 },
    { clave: 'posible', etiqueta: 'Esqueleto posible (1 sí, 0 no)', unidad: 'sin unidad', cifras: 1 }
  ],
  lecturas: (rengV) => rengLecturasHidrocarburo(rengV),
  enPalabras: (rengV, _rengT, rengL) => {
    const rengE = rengEsqueletoHc(rengV)
    if (rengL.posible !== 1) return `Con ${rengE.C} carbono(s) no caben ${rengE.d} enlace(s) doble(s), ${rengE.t} triple(s) y ${rengE.r} anillo(s): cada carbono solo puede formar cuatro enlaces. Añade carbonos o quita insaturaciones.`
    return `Fórmula C${rengSub(rengE.C)}H${rengSub(rengL.H!)}: ${rengFamiliaHc(rengE)}. Un alcano de ${rengE.C} carbono(s) tendría ${2 * rengE.C + 2} hidrógenos; cada enlace doble o anillo quita dos y cada enlace triple, cuatro. Masa molar ${rengNum(rengL.masa!, 5)} g/mol, con un ${rengNum(rengL.pctC!)} % de carbono. Quemar un mol consume ${rengNum(rengL.o2!)} mol de O₂${rengL.h2! > 0 ? ` y saturar sus enlaces múltiples, ${rengNum(rengL.h2!)} mol de H₂` : ''}.`
  },
  grafica: {
    tituloX: 'átomos de carbono',
    tituloY: 'átomos de hidrógeno',
    ejeX: () => [1, 12],
    ejeY: () => [0, 26],
    curvas: (rengV) => [
      { nombre: 'alcano', puntos: Array.from({ length: 12 }, (_rengX, rengI) => [rengI + 1, 2 * (rengI + 1) + 2] as const) },
      { nombre: 'este esqueleto', puntos: Array.from({ length: 12 }, (_rengX, rengI) => [rengI + 1, rengLecturasHidrocarburo({ ...rengV, C: rengI + 1 }).H!] as const) }
    ],
    cursor: (rengV, _rengT, rengL) => [Math.round(rengV.C!), rengL.H!]
  },
  ficha: {
    descripcion: 'Cada carbono forma cuatro enlaces. En una cadena abierta y saturada de n carbonos caben 2n + 2 hidrógenos. Cada enlace doble y cada anillo usan dos de esos huecos, y cada enlace triple, cuatro. El número de enlaces dobles más anillos más el doble de los triples es el grado de insaturación.',
    ecuaciones: [
      { tex: String.raw`H = 2C + 2 - 2(d + r) - 4t`, texto: 'H = 2C + 2 − 2(dobles + anillos) − 4·triples' },
      { tex: String.raw`GI = \frac{2C + 2 - H}{2}`, texto: 'grado de insaturación = (2C + 2 − H)/2' },
      { tex: String.raw`C_xH_y + \left(x + \tfrac{y}{4}\right) O_2 \rightarrow x\,CO_2 + \tfrac{y}{2}\,H_2O`, texto: 'CxHy + (x + y/4) O₂ → x CO₂ + y/2 H₂O' }
    ],
    supuestos: ['Solo hay carbono e hidrógeno.', 'Todos los carbonos cumplen la tetravalencia.'],
    limites: [
      'Da la fórmula molecular, no la estructura: una misma fórmula corresponde a varios isómeros.',
      'El aviso de esqueleto imposible usa una regla sencilla y no analiza la tensión de los anillos.',
      'No distingue un anillo aromático de un anillo con enlaces dobles alternos.'
    ],
    condicionesIniciales: 'Seis carbonos sin enlaces múltiples ni anillos: hexano, C₆H₁₄.',
    procedencia: [RENG_PROCEDENCIA_MASAS, rengDidactico('Los carbonos, enlaces múltiples y anillos los eliges tú.'), rengIdealizado('Recuento de valencias; no se calcula la geometría ni la estabilidad.'), rengCalculado('Las pruebas comparan la fórmula y la masa molar con las de moléculas reales construidas con el motor de estructuras de la app.')]
  },
  casos: [
    { nombre: 'Eteno, C₂H₄: un enlace doble', valores: { C: 2, dobles: 1, triples: 0, anillos: 0 } },
    { nombre: 'Etino, C₂H₂: un enlace triple', valores: { C: 2, dobles: 0, triples: 1, anillos: 0 } },
    { nombre: 'Ciclohexano, C₆H₁₂: un anillo', valores: { C: 6, dobles: 0, triples: 0, anillos: 1 } },
    { nombre: 'Benceno, C₆H₆: un anillo y tres dobles', valores: { C: 6, dobles: 3, triples: 0, anillos: 1 } }
  ]
}
