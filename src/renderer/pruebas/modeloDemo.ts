import { rengCalculado, rengIdealizado } from '../modules/simulador-quimica/aprender/n1/procedencia'
import type { RengModeloEscenaN1 } from '../modules/simulador-quimica/escenas-n1/tipos'

const rengA = (rengA0: number, rengK: number, rengT: number): number => rengA0 * Math.exp(-rengK * rengT)

export const RENG_MODELO_DEMO_KIT: RengModeloEscenaN1 = {
  id: 'demo-kit-primer-orden',
  nombre: 'Demostración del kit: A → B de primer orden',
  subtemas: ['n1-b8-s1'],
  pregunta: 'Escena de demostración del kit, fuera del temario: ¿cómo cae [A] con el tiempo?',
  parametros: [
    { clave: 'a0', etiqueta: 'Concentración inicial de A', unidad: 'mol/L', min: 0.1, max: 2, paso: 0.1, inicial: 1 },
    { clave: 'k', etiqueta: 'Constante de velocidad k', unidad: '1/s', min: 0.01, max: 1, paso: 0.01, inicial: 0.1 }
  ],
  tiempo: { final: 60, porSegundo: 10, unidad: 's' },
  magnitudes: [
    { clave: 't', etiqueta: 'Tiempo', unidad: 's', cifras: 3 },
    { clave: 'a', etiqueta: 'Concentración de A', unidad: 'mol/L', cifras: 3 },
    { clave: 'b', etiqueta: 'Concentración de B', unidad: 'mol/L', cifras: 3 },
    { clave: 'mediaVida', etiqueta: 'Tiempo de vida media', unidad: 's', cifras: 3 }
  ],
  lecturas: (rengV, rengT) => {
    const rengAhora = rengA(rengV.a0!, rengV.k!, rengT)
    return { t: rengT, a: rengAhora, b: rengV.a0! - rengAhora, mediaVida: Math.LN2 / rengV.k! }
  },
  enPalabras: (rengV, rengT, rengL) =>
    `A los ${rengT.toFixed(1).replace('.', ',')} s queda ${rengL.a!.toPrecision(3).replace('.', ',')} mol/L de A y se han formado ${rengL.b!.toPrecision(3).replace('.', ',')} mol/L de B; cada ${rengL.mediaVida!.toPrecision(3).replace('.', ',')} s la concentración de A se reduce a la mitad.`,
  grafica: {
    tituloX: 't (s)',
    tituloY: 'concentración (mol/L)',
    ejeX: () => [0, 60],
    ejeY: (rengV) => [0, rengV.a0!],
    curvas: (rengV) => {
      const rengPts = Array.from({ length: 61 }, (_rengX, rengI) => rengI)
      return [
        { nombre: '[A]', puntos: rengPts.map((rengT) => [rengT, rengA(rengV.a0!, rengV.k!, rengT)] as const) },
        { nombre: '[B]', puntos: rengPts.map((rengT) => [rengT, rengV.a0! - rengA(rengV.a0!, rengV.k!, rengT)] as const) }
      ]
    },
    cursor: (_rengV, rengT, rengL) => [rengT, rengL.a!]
  },
  ficha: {
    descripcion: 'Modelo de demostración del kit de escenas: reacción irreversible de primer orden en un recipiente bien mezclado. No es contenido del temario.',
    ecuaciones: [
      { tex: String.raw`[\mathrm{A}] = [\mathrm{A}]_0\, e^{-k t}`, texto: '[A] = [A]₀ · e^(−k·t)' },
      { tex: String.raw`t_{1/2} = \frac{\ln 2}{k}`, texto: 't½ = ln 2 / k' }
    ],
    supuestos: ['Temperatura y volumen constantes.', 'Mezcla perfecta: la concentración es la misma en todo el recipiente.'],
    limites: ['Solo vale para una cinética de primer orden; no describe reacciones reversibles ni de otro orden.'],
    condicionesIniciales: 'En t = 0 solo hay A, con la concentración elegida; [B] = 0.',
    procedencia: [rengIdealizado('Reacción de primer orden genérica, sin sustancia real.'), rengCalculado('Solución analítica de d[A]/dt = −k[A].')]
  },
  casos: [
    { nombre: 'k la mitad', valores: { k: 0.05 } },
    { nombre: 'k el doble', valores: { k: 0.2 } }
  ]
}

export const RENG_MODELO_DEMO_ROTO: RengModeloEscenaN1 = {
  ...RENG_MODELO_DEMO_KIT,
  id: 'demo-kit-roto',
  nombre: 'Demostración del kit: modelo deliberadamente roto',
  lecturas: (rengV, rengT) => ({ t: rengT, a: Number.NaN, b: rengV.a0! })
}
