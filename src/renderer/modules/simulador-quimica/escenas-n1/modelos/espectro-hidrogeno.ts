import { rengCalculado, rengDeclarada, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

export const RENG_H_PLANCK = 6.62607015e-34
export const RENG_C_LUZ = 299792458
export const RENG_EV_J = 1.602176634e-19
export const RENG_RYD_EV = 13.6

const rengNum = (rengV: number, rengC = 3): string => String(Number(rengV.toPrecision(rengC))).replace('.', ',')

export const rengEnergiaNivel = (rengN: number): number => -RENG_RYD_EV / (rengN * rengN)

export function rengLecturasEspectro(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengAlto = Math.round(rengV.nAlto!)
  const rengBajo = Math.min(Math.round(rengV.nBajo!), rengAlto - 1)
  const rengDe = rengEnergiaNivel(rengAlto) - rengEnergiaNivel(rengBajo)
  const rengLambda = ((RENG_H_PLANCK * RENG_C_LUZ) / (rengDe * RENG_EV_J)) * 1e9
  return { bajo: rengBajo, Ealto: rengEnergiaNivel(rengAlto), Ebajo: rengEnergiaNivel(rengBajo), dE: rengDe, lambda: rengLambda, nu: (rengDe * RENG_EV_J) / RENG_H_PLANCK / 1e14, visible: rengLambda >= 380 && rengLambda <= 750 ? 1 : 0 }
}

export const RENG_ESCENA_ESPECTRO: RengModeloEscenaN1 = {
  id: 'espectro-hidrogeno',
  nombre: 'Espectro del hidrógeno (modelo de Bohr)',
  subtemas: ['n1-b2-s5', 'n1-b2-s6', 'n1-b2-s17', 'n1-b2-s18'],
  pregunta: '¿Qué luz emite un electrón del hidrógeno al saltar de un nivel a otro?',
  parametros: [
    { clave: 'nAlto', etiqueta: 'Nivel de partida (superior)', unidad: 'sin unidad', min: 2, max: 8, paso: 1, inicial: 3 },
    { clave: 'nBajo', etiqueta: 'Nivel de llegada (inferior)', unidad: 'sin unidad', min: 1, max: 7, paso: 1, inicial: 2 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'bajo', etiqueta: 'Nivel de llegada usado', unidad: 'sin unidad', cifras: 2 },
    { clave: 'Ealto', etiqueta: 'Energía del nivel de partida', unidad: 'eV', cifras: 4 },
    { clave: 'Ebajo', etiqueta: 'Energía del nivel de llegada', unidad: 'eV', cifras: 4 },
    { clave: 'dE', etiqueta: 'Energía del fotón emitido', unidad: 'eV', cifras: 4 },
    { clave: 'lambda', etiqueta: 'Longitud de onda', unidad: 'nm', cifras: 4 },
    { clave: 'nu', etiqueta: 'Frecuencia', unidad: '10¹⁴ Hz', cifras: 4 },
    { clave: 'visible', etiqueta: '¿Visible? (1 sí, 0 no)', unidad: 'sin unidad', cifras: 1 }
  ],
  lecturas: (rengV) => rengLecturasEspectro(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `Al bajar del nivel ${rengNum(rengV.nAlto!)} al ${rengNum(rengL.bajo!)}, el electrón emite un fotón de ${rengNum(rengL.dE!, 4)} eV, con una longitud de onda de ${rengNum(rengL.lambda!, 4)} nm. ${rengL.visible === 1 ? 'Esa luz es visible.' : 'Esa luz no es visible (ultravioleta o infrarroja).'} Cuanto mayor es el salto de energía, menor es la longitud de onda.`,
  grafica: {
    tituloX: 'nivel de partida',
    tituloY: 'longitud de onda (nm)',
    ejeX: () => [2, 8],
    ejeY: (rengV) => [0, Math.max(...Array.from({ length: 7 }, (_rengX, rengI) => rengLecturasEspectro({ ...rengV, nAlto: rengI + 2 }).lambda!)) * 1.1],
    curvas: (rengV) => [{ nombre: 'λ', puntos: Array.from({ length: 7 }, (_rengX, rengI) => [rengI + 2, rengLecturasEspectro({ ...rengV, nAlto: rengI + 2, nBajo: Math.min(rengV.nBajo!, rengI + 1) }).lambda!] as const) }],
    cursor: (rengV, _rengT, rengL) => [rengV.nAlto!, rengL.lambda!]
  },
  ficha: {
    descripcion: 'En el modelo de Bohr, el electrón del hidrógeno solo puede estar en niveles de energía E_n = −13,6 eV/n². Al pasar de un nivel superior a otro inferior emite un fotón cuya energía es la diferencia, ΔE = h·ν = h·c/λ. Las líneas que terminan en n = 2 forman la serie de Balmer, visible.',
    ecuaciones: [
      { tex: String.raw`E_n = -\frac{13{,}6\ \mathrm{eV}}{n^2}`, texto: 'E_n = −13,6 eV / n²' },
      { tex: String.raw`\lambda = \frac{h\,c}{\Delta E}`, texto: 'λ = h·c / ΔE' }
    ],
    supuestos: ['Átomo de hidrógeno con un solo electrón.', '13,6 eV es un valor redondeado de la energía de ionización del hidrógeno.'],
    limites: [
      'El modelo de Bohr solo es cuantitativo para el hidrógeno y los iones de un electrón.',
      'No explica la intensidad de las líneas ni su desdoblamiento fino.',
      'Si eliges un nivel de llegada igual o superior al de partida, la escena usa el inmediato inferior.'
    ],
    condicionesIniciales: 'Salto de n = 3 a n = 2: la línea roja de Balmer, cerca de 656 nm.',
    procedencia: [rengDeclarada('h = 6,62607015·10⁻³⁴ J·s, c = 299 792 458 m/s y e = 1,602176634·10⁻¹⁹ C son valores exactos del SI (2019), recordados; 13,6 eV es un valor redondeado de uso común sin verificar.'), rengDidactico('Los niveles los eliges tú.'), rengIdealizado('Modelo de Bohr del hidrógeno.'), rengCalculado('Las pruebas comprueban ΔE = E_alto − E_bajo, λ = hc/ΔE y ν = ΔE/h en cada combinación.')]
  },
  casos: [
    { nombre: 'Primera línea de Lyman (ultravioleta)', valores: { nAlto: 2, nBajo: 1 } },
    { nombre: 'Línea azul de Balmer (4 → 2)', valores: { nAlto: 4, nBajo: 2 } },
    { nombre: 'Primera línea de Paschen (infrarroja)', valores: { nAlto: 4, nBajo: 3 } }
  ]
}
