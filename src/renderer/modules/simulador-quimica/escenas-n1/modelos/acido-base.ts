import { rengCalculado, rengDidactico, rengIdealizado, rengSinVerificar } from '../../aprender/n1/procedencia'
import { RENG_KW_25C, RENG_PKW_25C, rengConcentracionH, rengPH } from '../../nucleo/acidoBase'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number, rengC = 3): string => {
  const rengA = Math.abs(rengV)
  return (rengA !== 0 && (rengA >= 1e5 || rengA < 1e-3) ? rengV.toExponential(rengC - 1).replace('e', '·10^') : String(Number(rengV.toPrecision(rengC)))).replace('.', ',')
}

export function rengLecturasAcidoBase(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengKa = 10 ** -rengV.pKa!
  const rengH = rengConcentracionH(rengV.Ca! + rengV.Cs!, rengKa, rengV.Cs! + rengV.Cb!, RENG_KW_25C)
  const rengOH = RENG_KW_25C / rengH
  const rengPh = rengPH(rengH)
  return {
    H: rengH,
    OH: rengOH,
    pH: rengPh,
    pOH: -Math.log10(rengOH),
    kw: rengH * rengOH,
    alfa: (100 * rengKa) / (rengKa + rengH),
    pKb: RENG_PKW_25C - rengV.pKa!,
    ind: 100 / (1 + 10 ** (rengV.pKin! - rengPh))
  }
}

export const RENG_ESCENA_ACIDO_BASE: RengModeloEscenaN1 = {
  id: 'acido-base',
  nombre: 'Ácidos, bases y pH en disolución',
  subtemas: ['n1-b6-s13', 'n1-b10-s1', 'n1-b10-s2', 'n1-b10-s4', 'n1-b10-s5', 'n1-b10-s6', 'n1-b10-s7', 'n1-b10-s8', 'n1-b10-s9', 'n1-b10-s10', 'n1-b10-s11', 'n1-b10-s12', 'n1-b10-s13', 'n1-b10-s14', 'n1-b10-s15', 'n1-b10-s16', 'n1-b10-s17', 'n1-b10-s18'],
  pregunta: '¿Qué pH tiene una disolución acuosa con un ácido HA, su base conjugada A⁻ y una base fuerte?',
  parametros: [
    { clave: 'pKa', etiqueta: 'pKa del par HA/A⁻', unidad: 'sin unidad', min: -6, max: 14, paso: 0.01, inicial: 4.76 },
    { clave: 'Ca', etiqueta: 'Ácido HA añadido', unidad: 'mol/L', min: 0, max: 1, paso: 0.001, inicial: 0.1 },
    { clave: 'Cs', etiqueta: 'Sal NaA añadida (base conjugada)', unidad: 'mol/L', min: 0, max: 1, paso: 0.001, inicial: 0 },
    { clave: 'Cb', etiqueta: 'Base fuerte NaOH añadida', unidad: 'mol/L', min: 0, max: 1, paso: 0.001, inicial: 0 },
    { clave: 'pKin', etiqueta: 'pK del indicador', unidad: 'sin unidad', min: 1, max: 13, paso: 0.1, inicial: 9.4 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'pH', etiqueta: 'pH', unidad: 'sin unidad', cifras: 4 },
    { clave: 'pOH', etiqueta: 'pOH', unidad: 'sin unidad', cifras: 4 },
    { clave: 'H', etiqueta: 'Concentración de H₃O⁺', unidad: 'mol/L', cifras: 4 },
    { clave: 'OH', etiqueta: 'Concentración de OH⁻', unidad: 'mol/L', cifras: 4 },
    { clave: 'kw', etiqueta: 'Producto [H₃O⁺]·[OH⁻]', unidad: 'sin unidad', cifras: 4 },
    { clave: 'alfa', etiqueta: 'Fracción del par en forma A⁻', unidad: '%', cifras: 4 },
    { clave: 'pKb', etiqueta: 'pKb de la base conjugada A⁻', unidad: 'sin unidad', cifras: 4 },
    { clave: 'ind', etiqueta: 'Indicador en su forma básica', unidad: '%', cifras: 3 }
  ],
  lecturas: (rengV) => rengLecturasAcidoBase(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `Con ${rengNum(rengV.Ca!)} mol/L de HA (pKa ${rengNum(rengV.pKa!, 4)}), ${rengNum(rengV.Cs!)} mol/L de NaA y ${rengNum(rengV.Cb!)} mol/L de NaOH, el pH es ${rengNum(rengL.pH!, 4)} y el pOH ${rengNum(rengL.pOH!, 4)}: [H₃O⁺] = ${rengNum(rengL.H!)} mol/L y [OH⁻] = ${rengNum(rengL.OH!)} mol/L, cuyo producto es Kw. El ${rengNum(rengL.alfa!)} % del par está como A⁻ y el indicador está un ${rengNum(rengL.ind!)} % en su forma básica.`,
  grafica: {
    tituloX: 'NaOH añadida (mol/L)',
    tituloY: 'pH',
    ejeX: () => [0, 1],
    ejeY: () => [0, 14],
    curvas: (rengV) => [{ nombre: 'pH al añadir NaOH', puntos: Array.from({ length: 101 }, (_rengX, rengI) => [rengI / 100, rengLecturasAcidoBase({ ...rengV, Cb: rengI / 100 }).pH!] as const) }],
    cursor: (rengV, _rengT, rengL) => [rengV.Cb!, rengL.pH!]
  },
  ficha: {
    descripcion: 'Disolución acuosa a 25 °C con un par ácido-base HA/A⁻, su sal sódica y NaOH. El pH se obtiene resolviendo el balance de carga con Kw y Ka, sin aproximaciones; con pKa muy bajo, HA se comporta como un ácido fuerte. El indicador es un segundo par con su propio pK.',
    ecuaciones: [
      { tex: String.raw`[\mathrm{H_3O^+}] + [\mathrm{Na^+}] = [\mathrm{OH^-}] + [\mathrm{A^-}]`, texto: '[H₃O⁺] + [Na⁺] = [OH⁻] + [A⁻]' },
      { tex: String.raw`K_w = [\mathrm{H_3O^+}]\,[\mathrm{OH^-}], \quad \mathrm{pH} + \mathrm{pOH} = \mathrm{p}K_w`, texto: 'Kw = [H₃O⁺]·[OH⁻];  pH + pOH = pKw' },
      { tex: String.raw`[\mathrm{A^-}] = C_{\mathrm{total}} \frac{K_a}{K_a + [\mathrm{H_3O^+}]}`, texto: '[A⁻] = C_total · Ka / (Ka + [H₃O⁺])' }
    ],
    supuestos: ['25 °C y pKw = 13,9965 (valor del núcleo de la app).', 'Concentraciones en lugar de actividades (disoluciones diluidas).', 'Las concentraciones son las finales: añadir NaOH no cambia el volumen.'],
    limites: [
      'A concentraciones altas, las actividades difieren de las concentraciones y el pH real se aparta del calculado.',
      'Solo hay un par HA/A⁻ monoprótico; los ácidos polipróticos necesitan más equilibrios.',
      'El pK del indicador es un dato que eliges; el color real depende del indicador concreto.',
      'No modela la temperatura: Kw cambia con ella.'
    ],
    condicionesIniciales: 'HA 0,1 mol/L con pKa 4,76 (como el ácido acético), sin sal ni NaOH, e indicador de pK 9,4.',
    procedencia: [rengSinVerificar('pKw = 13,9965 a 25 °C es el valor que usa el núcleo de la app; no se contrastó con una fuente en esta entrega.'), rengDidactico('pKa, concentraciones y pK del indicador son parámetros que tú eliges.'), rengIdealizado('Disolución ideal: concentraciones en lugar de actividades.'), rengCalculado('El pH se calcula con la función de equilibrio ácido-base del núcleo; las pruebas comprueban el balance de carga y pH + pOH = pKw en cada combinación.')]
  },
  casos: [
    { nombre: 'Agua pura', valores: { Ca: 0, Cs: 0, Cb: 0 } },
    { nombre: 'Ácido fuerte', valores: { pKa: -6, Ca: 0.01 } },
    { nombre: 'Amortiguador', valores: { Ca: 0.1, Cs: 0.1 } },
    { nombre: 'Base débil (solo NaA)', valores: { Ca: 0, Cs: 0.1 } }
  ]
}
