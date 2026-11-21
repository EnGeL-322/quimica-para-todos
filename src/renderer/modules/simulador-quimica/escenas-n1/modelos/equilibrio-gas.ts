import { RENG_PROCEDENCIA_R, rengCalculado, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import { RENG_R_L_BAR, rengGradoDisociacionDimero, rengKcDeKp } from '../../nucleo/equilibrio'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number, rengC = 3): string => {
  const rengA = Math.abs(rengV)
  return (rengA !== 0 && (rengA >= 1e5 || rengA < 1e-3) ? rengV.toExponential(rengC - 1).replace('e', '·10^') : String(Number(rengV.toPrecision(rengC)))).replace('.', ',')
}

export function rengLecturasEquilibrioGas(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengKc = rengKcDeKp(rengV.Kp!, rengV.T!, 1)
  const rengC0 = rengV.n0! / rengV.V!
  const rengAlfa = rengGradoDisociacionDimero(rengC0, rengKc)
  const rengCA = rengC0 * (1 - rengAlfa)
  const rengCB = 2 * rengC0 * rengAlfa
  const rengRT = RENG_R_L_BAR * rengV.T!
  const rengPA = rengCA * rengRT
  const rengPB = rengCB * rengRT
  return { Kc: rengKc, alfa: 100 * rengAlfa, cA: rengCA, cB: rengCB, PA: rengPA, PB: rengPB, Ptot: rengPA + rengPB, Qp: (rengPB * rengPB) / rengPA, Qc: (rengCB * rengCB) / rengCA }
}

export const RENG_ESCENA_EQUILIBRIO_GAS: RengModeloEscenaN1 = {
  id: 'equilibrio-gas',
  nombre: 'Equilibrio en fase gaseosa A ⇌ 2B',
  subtemas: ['n1-b10-s19', 'n1-b10-s20', 'n1-b10-s21'],
  pregunta: '¿Qué composición alcanza la disociación A(g) ⇌ 2 B(g) y cómo responde al cambiar el volumen o la constante?',
  parametros: [
    { clave: 'Kp', etiqueta: 'Constante Kp (presiones en bar)', unidad: 'bar', min: 0.01, max: 100, paso: 0.01, inicial: 0.15 },
    { clave: 'T', etiqueta: 'Temperatura', unidad: 'K', min: 250, max: 600, paso: 1, inicial: 298 },
    { clave: 'n0', etiqueta: 'Cantidad inicial de A', unidad: 'mol', min: 0.1, max: 5, paso: 0.01, inicial: 1 },
    { clave: 'V', etiqueta: 'Volumen del recipiente', unidad: 'L', min: 1, max: 50, paso: 0.1, inicial: 10 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'alfa', etiqueta: 'Grado de disociación de A', unidad: '%', cifras: 4 },
    { clave: 'cA', etiqueta: '[A] en el equilibrio', unidad: 'mol/L', cifras: 4 },
    { clave: 'cB', etiqueta: '[B] en el equilibrio', unidad: 'mol/L', cifras: 4 },
    { clave: 'PA', etiqueta: 'Presión parcial de A', unidad: 'bar', cifras: 4 },
    { clave: 'PB', etiqueta: 'Presión parcial de B', unidad: 'bar', cifras: 4 },
    { clave: 'Ptot', etiqueta: 'Presión total', unidad: 'bar', cifras: 4 },
    { clave: 'Kc', etiqueta: 'Constante Kc = Kp·(RT)^−Δn', unidad: 'mol/L', cifras: 4 },
    { clave: 'Qp', etiqueta: 'Qp = P_B²/P_A en el equilibrio', unidad: 'bar', cifras: 4 },
    { clave: 'Qc', etiqueta: 'Qc = [B]²/[A] en el equilibrio', unidad: 'mol/L', cifras: 4 }
  ],
  lecturas: (rengV) => rengLecturasEquilibrioGas(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `Con ${rengNum(rengV.n0!)} mol de A en ${rengNum(rengV.V!)} L a ${rengNum(rengV.T!)} K y Kp = ${rengNum(rengV.Kp!)} bar, se disocia el ${rengNum(rengL.alfa!)} % de A. En el equilibrio, P(A) = ${rengNum(rengL.PA!)} bar y P(B) = ${rengNum(rengL.PB!)} bar; Qp vuelve a ser ${rengNum(rengL.Qp!)} bar, igual a Kp. Como Δn = 1, Kc = ${rengNum(rengL.Kc!)} mol/L.`,
  grafica: {
    tituloX: 'volumen del recipiente (L)',
    tituloY: 'grado de disociación (%)',
    ejeX: () => [1, 50],
    ejeY: () => [0, 100],
    curvas: (rengV) => [{ nombre: 'α según el volumen', puntos: Array.from({ length: 50 }, (_rengX, rengI) => [rengI + 1, rengLecturasEquilibrioGas({ ...rengV, V: rengI + 1 }).alfa!] as const) }],
    cursor: (rengV, _rengT, rengL) => [rengV.V!, rengL.alfa!]
  },
  ficha: {
    descripcion: 'Recipiente rígido con un gas A que se disocia según A(g) ⇌ 2 B(g), como el N₂O₄ en NO₂. Se fija Kp, se pasa a Kc con la relación del núcleo y se resuelve la tabla ICE de forma exacta. Al aumentar el volumen, la presión baja y el equilibrio se desplaza hacia donde hay más moles de gas.',
    ecuaciones: [
      { tex: String.raw`K_p = \frac{P_B^2}{P_A}, \quad K_c = \frac{[B]^2}{[A]}`, texto: 'Kp = P_B² / P_A;  Kc = [B]² / [A]' },
      { tex: String.raw`K_c = K_p\,(RT)^{-\Delta n}, \quad \Delta n = 1`, texto: 'Kc = Kp·(RT)^(−Δn), con Δn = 1' },
      { tex: String.raw`K_c = \frac{4 c_0 \alpha^2}{1 - \alpha}`, texto: 'Kc = 4·c₀·α² / (1 − α)' }
    ],
    supuestos: ['Gases ideales: P = c·R·T.', 'Recipiente de volumen fijo y temperatura constante.', 'R = 0,08314462618 L·bar/(mol·K), valor del núcleo de la app.'],
    limites: [
      'Kp es un dato que eliges: en una reacción real depende de la temperatura según su entalpía, que la escena no modela (cambiar T solo cambia la conversión a Kc).',
      'A presiones altas los gases dejan de ser ideales.',
      'Muestra el estado de equilibrio, no lo que tarda en alcanzarse.'
    ],
    condicionesIniciales: '1 mol de A en 10 L a 298 K con Kp = 0,15 bar.',
    procedencia: [RENG_PROCEDENCIA_R, rengDidactico('Kp, T, la cantidad inicial y el volumen son parámetros que tú eliges; Kp no es el de una reacción concreta.'), rengIdealizado('Gases ideales en un recipiente rígido.'), rengCalculado('Kc se obtiene con la conversión del núcleo y α con su solución exacta de la tabla ICE; las pruebas comprueban Qp = Kp y la conservación de A en cada combinación.')]
  },
  casos: [
    { nombre: 'Volumen a la mitad', valores: { V: 5 } },
    { nombre: 'Kp diez veces mayor', valores: { Kp: 1.5 } },
    { nombre: 'Más cantidad de A', valores: { n0: 3 } }
  ]
}
