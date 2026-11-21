import { rengCalculado, rengDeclarada, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import { RENG_DISTANCIAS_INTER, RENG_ENERGIAS_INTERACCION } from '../../nucleo/datosEnlace'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number, rengC = 3): string => String(Number(rengV.toPrecision(rengC))).replace('.', ',').replace('-', '−')
export const rengLennardJones = (rengEps: number, rengRmin: number, rengR: number): number => { const rengQ = (rengRmin / rengR) ** 6; return rengEps * (rengQ * rengQ - 2 * rengQ) }

export function rengLecturasInteraccion(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengE = rengLennardJones(rengV.eps!, rengV.rmin!, rengV.r!)
  return { E: rengE, fraccion: (-rengE / rengV.eps!) * 100, sigma: rengV.rmin! / 2 ** (1 / 6), atractiva: rengV.r! > rengV.rmin! ? 1 : 0 }
}

export const RENG_ESCENA_INTERACCION: RengModeloEscenaN1 = {
  id: 'interaccion-molecular',
  nombre: 'Interacción entre dos moléculas',
  subtemas: ['n1-b4-s17', 'n1-b4-s18', 'n1-b4-s19', 'n1-b4-s20'],
  pregunta: '¿Cómo cambia la energía de dos moléculas al acercarse y cuánto cuesta separarlas?',
  parametros: [
    { clave: 'eps', etiqueta: 'Profundidad del pozo (energía de la interacción)', unidad: 'kJ/mol', min: 0.1, max: 25, paso: 0.01, inicial: 1.19 },
    { clave: 'rmin', etiqueta: 'Distancia de equilibrio', unidad: 'Å', min: 2.5, max: 5, paso: 0.001, inicial: 3.757 },
    { clave: 'r', etiqueta: 'Distancia entre las dos partículas', unidad: 'Å', min: 2.5, max: 10, paso: 0.01, inicial: 3.76 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'E', etiqueta: 'Energía de interacción', unidad: 'kJ/mol', cifras: 3 },
    { clave: 'fraccion', etiqueta: 'Parte del pozo alcanzada', unidad: '%', cifras: 3 },
    { clave: 'sigma', etiqueta: 'Distancia a la que la energía es cero', unidad: 'Å', cifras: 4 },
    { clave: 'atractiva', etiqueta: 'Fuerza atractiva (1 sí, 0 no)', unidad: 'sin unidad', cifras: 1 }
  ],
  lecturas: (rengV) => rengLecturasInteraccion(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `A ${rengNum(rengV.r!)} Å la energía de interacción es ${rengNum(rengL.E!)} kJ/mol, el ${rengNum(rengL.fraccion!)} % de la profundidad del pozo (${rengNum(rengV.eps!)} kJ/mol). ${rengL.atractiva === 1 ? 'Las partículas se atraen: están más lejos que la distancia de equilibrio.' : 'Las partículas se repelen: están más cerca que la distancia de equilibrio.'} Para separarlas del todo desde el equilibrio hay que aportar la profundidad del pozo, mucho menos que para romper un enlace covalente (cientos de kJ/mol).`,
  grafica: {
    tituloX: 'distancia (Å)',
    tituloY: 'energía (kJ/mol)',
    ejeX: () => [2.5, 10],
    ejeY: (rengV) => [-1.2 * rengV.eps!, 1.2 * rengV.eps!],
    curvas: (rengV) => [{ nombre: 'energía', puntos: Array.from({ length: 76 }, (_rengX, rengI) => { const rengR = 2.5 + rengI * 0.1; return [rengR, Math.min(1.2 * rengV.eps!, rengLennardJones(rengV.eps!, rengV.rmin!, rengR))] as const }) }],
    cursor: (rengV, _rengT, rengL) => [rengV.r!, Math.min(1.2 * rengV.eps!, rengL.E!)]
  },
  ficha: {
    descripcion: 'Dos moléculas o átomos neutros se atraen débilmente a distancias medias y se repelen con fuerza cuando sus nubes electrónicas se solapan. El potencial de Lennard-Jones resume ese comportamiento con dos números: la profundidad del pozo (lo que cuesta separarlas) y la distancia de equilibrio.',
    ecuaciones: [
      { tex: String.raw`E(r) = \varepsilon\left[\left(\frac{r_m}{r}\right)^{12} - 2\left(\frac{r_m}{r}\right)^{6}\right]`, texto: 'E(r) = ε·[(r_m/r)¹² − 2·(r_m/r)⁶]' },
      { tex: String.raw`E(r_m) = -\varepsilon`, texto: 'E(r_m) = −ε' }
    ],
    supuestos: ['Partículas esféricas sin orientación.', 'La misma forma de curva para cualquier interacción; solo cambian la profundidad y la distancia.'],
    limites: [
      'El puente de hidrógeno y las interacciones dipolo-dipolo dependen de la orientación: la curva solo reproduce su profundidad y su distancia.',
      'No describe enlaces covalentes ni iónicos.',
      'Es un modelo de dos partículas aisladas; en un líquido cada molécula interacciona con muchas vecinas.'
    ],
    condicionesIniciales: 'Dos átomos de argón: pozo de 1,19 kJ/mol a 3,757 Å.',
    procedencia: [
      rengDeclarada(`Argón: ${RENG_ENERGIAS_INTERACCION.londonAr!.fuente}; distancia ${RENG_DISTANCIAS_INTER['Ar···Ar (mínimo)']!.fuente}. Dímero de agua: ${RENG_ENERGIAS_INTERACCION.puenteH!.fuente}; ${RENG_DISTANCIAS_INTER['O···O (dímero de agua)']!.fuente}. Datos del núcleo de la app, no abiertos de nuevo en esta entrega.`),
      rengDidactico('La profundidad, la distancia de equilibrio y la distancia las eliges tú.'),
      rengIdealizado('Potencial de Lennard-Jones entre dos partículas esféricas.'),
      rengCalculado('Las pruebas comprueban el mínimo en la distancia de equilibrio, el cero de la curva y el límite a gran distancia.')
    ]
  },
  casos: [
    { nombre: 'Dispersión de London: Ar···Ar', valores: { eps: RENG_ENERGIAS_INTERACCION.londonAr!.valor!, rmin: RENG_DISTANCIAS_INTER['Ar···Ar (mínimo)']!.valor, r: 3.76 } },
    { nombre: 'Pozo como el del puente de hidrógeno del agua', valores: { eps: RENG_ENERGIAS_INTERACCION.puenteH!.valor!, rmin: RENG_DISTANCIAS_INTER['O···O (dímero de agua)']!.valor, r: 2.98 } },
    { nombre: 'Demasiado cerca: repulsión', valores: { eps: 1.19, rmin: 3.757, r: 3.2 } }
  ]
}
