import { rengCalculado, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number, rengC = 3): string => {
  const rengA = Math.abs(rengV)
  return (rengA !== 0 && (rengA >= 1e5 || rengA < 1e-3) ? rengV.toExponential(rengC - 1).replace('e', '·10^') : String(Number(rengV.toPrecision(rengC)))).replace('.', ',')
}

export function rengLecturasDensidad(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengRho = rengV.m! / rengV.V!
  const rengRhoL = rengV.rhoL!
  return { rho: rengRho, rhoSI: rengRho * 1000, flota: rengRho < rengRhoL ? 1 : 0, sumergido: Math.min(1, rengRho / rengRhoL) * 100, desplazado: rengRhoL * rengV.V! * Math.min(1, rengRho / rengRhoL) }
}

export const RENG_ESCENA_DENSIDAD: RengModeloEscenaN1 = {
  id: 'densidad',
  nombre: 'Densidad y flotación',
  subtemas: ['n1-b1-s3', 'n1-b1-s5', 'n1-b1-s7', 'n1-b1-s14', 'n1-b1-s16', 'n1-b1-s17', 'n1-b1-s20', 'n1-b1-s21'],
  pregunta: '¿Cuál es la densidad de un objeto y flota en un líquido dado?',
  parametros: [
    { clave: 'm', etiqueta: 'Masa del objeto', unidad: 'g', min: 1, max: 1000, paso: 0.1, inicial: 54 },
    { clave: 'V', etiqueta: 'Volumen del objeto', unidad: 'mL', min: 1, max: 1000, paso: 0.1, inicial: 20 },
    { clave: 'rhoL', etiqueta: 'Densidad del líquido', unidad: 'g/mL', min: 0.6, max: 2, paso: 0.01, inicial: 1 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'rho', etiqueta: 'Densidad del objeto', unidad: 'g/mL', cifras: 4 },
    { clave: 'rhoSI', etiqueta: 'Densidad en unidades del SI', unidad: 'kg/m³', cifras: 4 },
    { clave: 'flota', etiqueta: '¿Flota? (1 sí, 0 no)', unidad: 'sin unidad', cifras: 1 },
    { clave: 'sumergido', etiqueta: 'Volumen sumergido', unidad: '%', cifras: 3 },
    { clave: 'desplazado', etiqueta: 'Masa de líquido desplazada', unidad: 'g', cifras: 4 }
  ],
  lecturas: (rengV) => rengLecturasDensidad(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `El objeto tiene ${rengNum(rengV.m!, 4)} g en ${rengNum(rengV.V!, 4)} mL: su densidad es ${rengNum(rengL.rho!, 4)} g/mL (${rengNum(rengL.rhoSI!, 4)} kg/m³). ${rengL.flota === 1 ? `Es menos denso que el líquido y flota con el ${rengNum(rengL.sumergido!)} % de su volumen sumergido.` : 'Es más denso que el líquido (o igual) y no flota: se hunde por completo.'} Si duplicas la masa y el volumen, la densidad no cambia.`,
  grafica: {
    tituloX: 'volumen (mL)',
    tituloY: 'masa (g)',
    ejeX: () => [0, 1000],
    ejeY: (rengV) => [0, Math.max(10, (rengV.m! / rengV.V!) * 1000 * 1.05)],
    curvas: (rengV) => [
      { nombre: 'objeto (misma densidad)', puntos: Array.from({ length: 11 }, (_rengX, rengI) => [rengI * 100, (rengV.m! / rengV.V!) * rengI * 100] as const) },
      { nombre: 'líquido', puntos: Array.from({ length: 11 }, (_rengX, rengI) => [rengI * 100, rengV.rhoL! * rengI * 100] as const) }
    ],
    cursor: (rengV) => [rengV.V!, rengV.m!]
  },
  ficha: {
    descripcion: 'La densidad es la masa por unidad de volumen. Es una propiedad intensiva: no depende del tamaño de la muestra. Un objeto flota en un líquido si su densidad es menor que la del líquido; entonces se sumerge la fracción ρ/ρ_líquido de su volumen (principio de Arquímedes).',
    ecuaciones: [
      { tex: String.raw`\rho = \frac{m}{V}`, texto: 'ρ = m/V' },
      { tex: String.raw`\frac{V_{sumergido}}{V} = \frac{\rho}{\rho_{líquido}}`, texto: 'V sumergido / V = ρ/ρ líquido' }
    ],
    supuestos: ['Objeto macizo y homogéneo.', 'Líquido en reposo y temperatura constante.'],
    limites: ['No incluye la tensión superficial ni objetos huecos con aire.', 'La densidad real cambia con la temperatura; la escena la toma constante.'],
    condicionesIniciales: 'Un objeto de 54 g y 20 mL (densidad 2,7 g/mL, como el aluminio) en agua (1,00 g/mL): se hunde.',
    procedencia: [rengDidactico('Masas, volúmenes y densidades son parámetros que tú eliges; 1,00 g/mL para el agua es un valor redondeado.'), rengIdealizado('Objeto macizo y homogéneo.'), rengCalculado('Las pruebas comprueban ρ = m/V, la conversión a kg/m³, la condición de flotación y la fracción sumergida en cada combinación.')]
  },
  casos: [
    { nombre: 'Madera en agua (flota)', valores: { m: 60, V: 100, rhoL: 1 } },
    { nombre: 'Hielo en agua', valores: { m: 91.7, V: 100, rhoL: 1 } },
    { nombre: 'Objeto de 1,5 g/mL en un líquido de 2,0 g/mL (flota)', valores: { m: 30, V: 20, rhoL: 2 } }
  ]
}
