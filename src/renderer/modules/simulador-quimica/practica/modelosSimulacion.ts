import type { RengNivelEvidencia } from '@shared/cuaderno'
import type { RengEjercicio, RengTransferenciaSimulacion } from './tipos'
import { RENG_ACIDOS, rengConcentracionH, rengPH, rengVolumenEquivalencia } from '../nucleo/acidoBase'
import { rengConcentracion, rengVidaMedia, type RengOrden } from '../nucleo/cinetica'
import { rengCalibrarColorimetria, rengLeerEntradaColorimetria, RENG_LIMITES_COLORIMETRIA, RENG_DATOS_COLOR_EJEMPLO } from '../nucleo/colorimetria'
import { RENG_CODIGOS_PARES, RENG_FARADAY, RENG_PARES_ELECTRO, RENG_R_GASES, rengParRegistrado, type RengParElectroquimico } from '../datos/electroquimica'
import { RENG_CODIGOS_SALES, RENG_SALES_SOLUBILIDAD, rengSalRegistrada } from '../datos/solubilidad'
import { rengAnalizarCelda, RENG_C_MAX_ELECTRO, type RengSemiceldaCore } from '../nucleo/electroquimica'
import { RENG_LIMITES_DILUCION, rengDiluir, type RengModoDilucion } from '../nucleo/dilucion'
import { RENG_CODIGOS_PAREJAS, RENG_PAREJAS_ISO, RENG_POR_DEFECTO_PAREJA, rengCargarPareja, type RengParIsomeros } from '../datos/isomeros'
import { RENG_MAX_SELECCION_ISO, rengCompararIsomeros, type RengComparacionIso, type RengGeometriaIsomero } from '../nucleo/isomeros'
import { rengAnalizarSolubilidad, RENG_LIMITES_SOLUBILIDAD } from '../nucleo/solubilidad'
import { rengAnalizarEquilibrio, rengPerturbar, type RengEspecieEq } from '../nucleo/equilibrio'
import { RENG_KA_ACETICO_MEZCLA, RENG_LIMITES_MEZCLA_ACIDO_BASE, RENG_PKW_MEZCLA, rengResolverMezclaAcidoBase } from '../nucleo/mezclaAcidoBase'
import { rengAumentoTemperaturaAgua, rengCalorLiberado, rengConstanteDeG, rengDatoTermo, rengEnergiaLibre, rengEntalpiaReaccion, rengEntropiaReaccion, type RengReaccion } from '../nucleo/termoquimica'

export type RengEscena = 'acidobase' | 'mezcla' | 'cinetica' | 'equilibrio' | 'termo' | 'dilucion' | 'colorimetria' | 'solubilidad' | 'electroquimica' | 'isomeros'
export const RENG_ESCENAS: readonly RengEscena[] = ['acidobase', 'mezcla', 'cinetica', 'equilibrio', 'termo', 'dilucion', 'colorimetria', 'solubilidad', 'electroquimica', 'isomeros']
export type RengEntradasSim = Readonly<Record<string, number | string>>

export interface RengPresetEquilibrio {
  id: string
  nombre: string
  esp: RengEspecieEq[]
  K: number
  nota: string
}

export const RENG_PRESETS_EQ: readonly RengPresetEquilibrio[] = [
  { id: 'hi', nombre: 'H₂ + I₂ ⇌ 2 HI', esp: [{ nombre: 'H₂', nu: -1, c0: 1 }, { nombre: 'I₂', nu: -1, c0: 1 }, { nombre: 'HI', nu: 2, c0: 0 }], K: 50, nota: 'K de ejemplo (del orden de la medida a ~700 K); no es un dato verificado aquí.' },
  { id: 'n2o4', nombre: 'N₂O₄ ⇌ 2 NO₂', esp: [{ nombre: 'N₂O₄', nu: -1, c0: 0.1 }, { nombre: 'NO₂', nu: 2, c0: 0 }], K: 0.15, nota: 'K de ejemplo (orden de magnitud a ~300 K); no es un dato verificado aquí.' },
  { id: 'haber', nombre: 'N₂ + 3 H₂ ⇌ 2 NH₃', esp: [{ nombre: 'N₂', nu: -1, c0: 1 }, { nombre: 'H₂', nu: -3, c0: 3 }, { nombre: 'NH₃', nu: 2, c0: 0 }], K: 0.5, nota: 'K inventada para ilustrar; cámbiala: lo que se simula es la regla Q = K, no un dato experimental.' }
]

export const RENG_REACCIONES_TERMO: ReadonlyArray<{ id: string; nombre: string; r: RengReaccion }> = [
  { id: 'metano', nombre: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O(l)  (combustión del metano)', r: { reactivos: [{ id: 'CH4', nu: 1 }, { id: 'O2', nu: 2 }], productos: [{ id: 'CO2', nu: 1 }, { id: 'H2O_l', nu: 2 }] } },
  { id: 'agua', nombre: 'H₂ + ½ O₂ → H₂O(l)  (formación del agua)', r: { reactivos: [{ id: 'H2', nu: 1 }, { id: 'O2', nu: 0.5 }], productos: [{ id: 'H2O_l', nu: 1 }] } },
  { id: 'amoniaco', nombre: 'N₂ + 3 H₂ → 2 NH₃  (síntesis de Haber)', r: { reactivos: [{ id: 'N2', nu: 1 }, { id: 'H2', nu: 3 }], productos: [{ id: 'NH3', nu: 2 }] } },
  { id: 'etanol', nombre: 'C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O(l)  (combustión del etanol)', r: { reactivos: [{ id: 'C2H5OH', nu: 1 }, { id: 'O2', nu: 3 }], productos: [{ id: 'CO2', nu: 2 }, { id: 'H2O_l', nu: 3 }] } },
  { id: 'glucosa', nombre: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O(l)  (respiración celular)', r: { reactivos: [{ id: 'glucosa', nu: 1 }, { id: 'O2', nu: 6 }], productos: [{ id: 'CO2', nu: 6 }, { id: 'H2O_l', nu: 6 }] } },
  { id: 'vaporiza', nombre: 'H₂O(l) → H₂O(g)  (evaporación)', r: { reactivos: [{ id: 'H2O_l', nu: 1 }], productos: [{ id: 'H2O_g', nu: 1 }] } }
]

export const RENG_MAX_INDICE_ATOMO_ISO = 63

export interface RengCampoEscena {
  clave: string
  etiqueta: string
  unidad: string
  min?: number
  max?: number
  requerido: boolean
  sensible?: boolean
}

export interface RengModeloEscena {
  id: RengEscena
  nombre: string
  fenomeno: string
  pregunta: string
  tipo: 'estado-final' | 'evolucion-temporal'
  calculo: string
  campos: readonly RengCampoEscena[]
  ecuaciones: readonly string[]
  dominio: readonly string[]
  supuestos: readonly string[]
  parametros: ReadonlyArray<{ nombre: string; valor: string; fuente: string; verificacion: 'consultada' | 'libro' | 'calculo' }>
  limites: readonly string[]
  version: string
  evidencia: RengNivelEvidencia
  verificacion: string
  condiciones: readonly string[]
  especiesFases: readonly string[]
  salidas: ReadonlyArray<{ clave: string; nombre: string; unidad: string }>
}

export const RENG_MODELOS_ESCENA: Record<RengEscena, RengModeloEscena> = {
  acidobase: {
    id: 'acidobase',
    nombre: 'Ácidos y bases',
    fenomeno: 'pH y valoración',
    pregunta: '¿Qué pH tiene una disolución de ácido y cómo cambia al añadir base?',
    tipo: 'estado-final',
    calculo: 'Cálculo de equilibrio (estado final): dice dónde termina el sistema, no cuánto tarda. La velocidad se estudia en «Velocidad de reacción» y la geometría molecular en la Mesa molecular.',
    campos: [
      { clave: 'acido', etiqueta: 'Ácido', unidad: '', requerido: true },
      { clave: 'C', etiqueta: 'Concentración del ácido', unidad: 'mol/L', min: 1e-6, max: 1, requerido: true },
      { clave: 'Va', etiqueta: 'Volumen de ácido', unidad: 'mL', min: 1, max: 1000, requerido: false },
      { clave: 'Cb', etiqueta: 'Concentración de NaOH', unidad: 'mol/L', min: 0.001, max: 10, requerido: false },
      { clave: 'Vb', etiqueta: 'NaOH añadido (punto de la curva)', unidad: 'mL', min: 0, max: 2000, requerido: false }
    ],
    ecuaciones: ['Balance de carga: [H⁺] + [Na⁺] = Kw/[H⁺] + C·Ka/(Ka + [H⁺])', 'pH = −log₁₀[H⁺]', 'Equivalencia: Ca·Va = Cb·Vb'],
    dominio: ['Concentraciones de 10⁻⁶ a 1 mol/L; agua a 25 °C.', 'Ácidos de la lista (HCl y cinco ácidos débiles con un solo protón disociable en el rango).'],
    supuestos: ['Actividades ≈ concentraciones (sin corrección de fuerza iónica).', 'Volúmenes aditivos; sin CO₂ disuelto.', 'Solo se considera la primera disociación de los ácidos polipróticos.'],
    parametros: [{ nombre: 'pKw (25 °C)', valor: '13,9965', fuente: 'IAPWS R11-24, tabla 3', verificacion: 'consultada' }],
    limites: ['Fuera de 10⁻⁶–1 mol/L el modelo ideal deja de ser fiable (actividades, autoprotólisis del agua).'],
    version: '1',
    evidencia: 'calculo-verificado',
    verificacion: 'Contrastado con expresiones analíticas (HCl, ácido débil y mitad de la valoración) y con los balances de carga y materia (tests/quimica/entrega-d1-escenas.test.ts). No comparado con mediciones.',
    condiciones: ['Agua como disolvente a 25 °C; pKw = 13,9965 (IAPWS R11-24); presión de 0,1 MPa.', 'Volúmenes aditivos y sin CO₂ disuelto.'],
    especiesFases: ['Fase acuosa: H₃O⁺, OH⁻, Na⁺, HA y A⁻ (el ácido fuerte se trata con pKa = −6,3 y queda prácticamente como A⁻).'],
    salidas: [{ clave: 'pH', nombre: 'pH de la disolución', unidad: '' }, { clave: 'Veq', nombre: 'Volumen de equivalencia', unidad: 'mL' }, { clave: 'pHVb', nombre: 'pH en el punto de la curva', unidad: '' }]
  },
  mezcla: {
    id: 'mezcla',
    nombre: 'Mezcla ácido–base',
    fenomeno: 'pH y especies al mezclar',
    pregunta: '¿Qué pH y qué especies hay al mezclar un ácido con NaOH?',
    tipo: 'estado-final',
    calculo: 'Cálculo de equilibrio (estado final): dice dónde termina el sistema, no cuánto tarda. La velocidad se estudia en «Velocidad de reacción» y la geometría molecular en la Mesa molecular.',
    campos: [
      { clave: 'acido', etiqueta: 'Ácido', unidad: '', requerido: true },
      { clave: 'cAcido', etiqueta: 'Concentración inicial del ácido', unidad: 'mol/L', min: 0, max: RENG_LIMITES_MEZCLA_ACIDO_BASE.concentracionMax, requerido: true },
      { clave: 'VAcido', etiqueta: 'Volumen de disolución ácida', unidad: 'mL', min: RENG_LIMITES_MEZCLA_ACIDO_BASE.volumenAcidoMinMl, max: RENG_LIMITES_MEZCLA_ACIDO_BASE.volumenMaxMl, requerido: true },
      { clave: 'cBase', etiqueta: 'Concentración inicial de NaOH', unidad: 'mol/L', min: 0, max: RENG_LIMITES_MEZCLA_ACIDO_BASE.concentracionMax, requerido: true },
      { clave: 'VBase', etiqueta: 'Volumen de NaOH añadido', unidad: 'mL', min: 0, max: RENG_LIMITES_MEZCLA_ACIDO_BASE.volumenMaxMl, requerido: true }
    ],
    ecuaciones: ['[H₃O⁺] + [Na⁺] = [OH⁻] + [A⁻]', '[HA] + [A⁻] = n(ácido) / V total', 'Ka = [H₃O⁺][A⁻]/[HA]; Kw = [H₃O⁺][OH⁻]'],
    dominio: ['HCl o ácido acético con NaOH.', 'Concentraciones de 0 a 0,01 mol/L; de 0,1 a 1000 mL de ácido y de 0 a 1000 mL de base.'],
    supuestos: ['Disolución diluida ideal a 25 °C; HCl y NaOH totalmente disociados.', 'Volúmenes aditivos; actividades ≈ concentraciones; sin CO₂.'],
    parametros: [
      { nombre: 'pKw', valor: String(RENG_PKW_MEZCLA).replace('.', ','), fuente: 'IAPWS R11-24, tabla 3', verificacion: 'consultada' },
      { nombre: 'Ka (ácido acético)', valor: String(RENG_KA_ACETICO_MEZCLA).replace('.', ','), fuente: 'Harned y Ehlers (1933), tabla II, DOI 10.1021/ja01329a027', verificacion: 'consultada' }
    ],
    limites: ['No admite concentraciones superiores a 0,01 mol/L: ahí las actividades ya no se aproximan por concentraciones.', 'No predice otras bases ni ácidos polipróticos.'],
    version: '1',
    evidencia: 'calculo-verificado',
    verificacion: 'Contrastado con expresiones analíticas (HCl antes y después de la equivalencia, ácido acético inicial, en semiequivalencia y en equivalencia) y con la conservación de materia y carga (tests/quimica/mezcla-acido-base.test.ts). No comparado con mediciones.',
    condiciones: ['Agua a 25 °C; pKw = 13,99 (IAPWS R11-24, tabla 3, a dos decimales) y Ka del acético a 25 °C.', 'Concentraciones de 0 a 0,01 mol/L; volúmenes aditivos.'],
    especiesFases: ['Fase acuosa: H₃O⁺, OH⁻, Na⁺, Cl⁻ o CH₃COO⁻ y CH₃COOH.'],
    salidas: [{ clave: 'pH', nombre: 'pH de la mezcla', unidad: '' }, { clave: 'Veq', nombre: 'Volumen de equivalencia', unidad: 'mL' }, { clave: 'Vtotal', nombre: 'Volumen total', unidad: 'mL' }]
  },
  cinetica: {
    id: 'cinetica',
    nombre: 'Velocidad de reacción',
    fenomeno: 'Cinética y temperatura',
    pregunta: '¿Cómo cae la concentración con el tiempo y cuánto tarda en reducirse a la mitad?',
    tipo: 'evolucion-temporal',
    calculo: 'Cálculo de velocidad (evolución en el tiempo): dice cuánto tarda, no dónde acaba el equilibrio. La geometría molecular (3D, VSEPR) se consulta en la Mesa molecular.',
    campos: [
      { clave: 'orden', etiqueta: 'Orden de reacción (0, 1 o 2)', unidad: '', min: 0, max: 2, requerido: true },
      { clave: 'A0', etiqueta: 'Concentración inicial [A]₀', unidad: 'mol/L', min: 0.001, requerido: true },
      { clave: 'k', etiqueta: 'Constante de velocidad k', unidad: 'según el orden', min: 1e-6, requerido: true },
      { clave: 't', etiqueta: 'Tiempo', unidad: 's', min: 0, requerido: false }
    ],
    ecuaciones: ['Orden 0: [A] = [A]₀ − kt; t½ = [A]₀/2k', 'Orden 1: [A] = [A]₀·e^(−kt); t½ = ln 2/k', 'Orden 2: 1/[A] = 1/[A]₀ + kt; t½ = 1/(k[A]₀)'],
    dominio: ['k > 0 y [A]₀ > 0; orden entero 0, 1 o 2.', 'Una sola especie reactiva A → productos.'],
    supuestos: ['Temperatura constante; la ley de velocidad se supone conocida.', 'Reacción irreversible y sin reacciones laterales.'],
    parametros: [{ nombre: 'R', valor: '8,314462618 J/(mol·K)', fuente: 'CODATA 2018', verificacion: 'libro' }],
    limites: ['Los parámetros k y el orden son datos de entrada: el modelo no los predice.'],
    version: '1',
    evidencia: 'modelo-calculado',
    verificacion: 'Ecuaciones integradas de libro de texto; se comprueban contra su solución analítica y, para A → B → C, contra una integración numérica (tests/quimica/fisicoquimica.test.ts). La ley de velocidad es un dato de entrada: no está comparada con mediciones.',
    condiciones: ['Temperatura constante (la dependencia con T solo se explora en el panel de Arrhenius).', 'Volumen constante, una sola fase homogénea.'],
    especiesFases: ['Una especie reactiva A que se transforma en productos; en el panel de dos pasos, A, B (intermedio) y C.'],
    salidas: [{ clave: 't12', nombre: 'Semivida t½', unidad: 's' }, { clave: 'At', nombre: '[A] en el instante t', unidad: 'mol/L' }]
  },
  equilibrio: {
    id: 'equilibrio',
    nombre: 'Equilibrio químico',
    fenomeno: 'Le Chatelier',
    pregunta: '¿Hacia dónde se desplaza un equilibrio cuando se añade o se quita una sustancia?',
    tipo: 'estado-final',
    calculo: 'Cálculo de equilibrio (estado final): dice dónde termina el sistema, no cuánto tarda. La velocidad se estudia en «Velocidad de reacción» y la geometría molecular en la Mesa molecular.',
    campos: [
      { clave: 'reaccion', etiqueta: 'Reacción', unidad: '', requerido: true },
      { clave: 'K', etiqueta: 'Constante de equilibrio K (en concentraciones)', unidad: '', min: 1e-9, requerido: true },
      { clave: 'c0_0', etiqueta: 'Concentración inicial de la 1.ª especie', unidad: 'mol/L', min: 0, requerido: true },
      { clave: 'c0_1', etiqueta: 'Concentración inicial de la 2.ª especie', unidad: 'mol/L', min: 0, requerido: true },
      { clave: 'c0_2', etiqueta: 'Concentración inicial de la 3.ª especie', unidad: 'mol/L', min: 0, requerido: false },
      { clave: 'quien', etiqueta: 'Especie perturbada (índice)', unidad: '', min: 0, max: 2, requerido: false },
      { clave: 'delta', etiqueta: 'Cantidad añadida (negativa = quitada)', unidad: 'mol/L', requerido: false }
    ],
    ecuaciones: ['Q = Πcᵢ^νᵢ; en el equilibrio Q = K', 'cᵢ = cᵢ⁰ + νᵢ·ξ; se resuelve ξ con Q(ξ) = K'],
    dominio: ['Una sola fase y volumen constante; K > 0 y concentraciones ≥ 0.', 'Hace falta cantidad de al menos un reactivo o un producto.'],
    supuestos: ['Disolución o gas ideal; actividades ≈ concentraciones.', 'K no cambia con las concentraciones, solo con la temperatura.'],
    parametros: [{ nombre: 'K de los ejemplos', valor: 'ver reacción', fuente: 'Valores de ejemplo sin verificar: se simula la regla Q = K, no un dato experimental', verificacion: 'libro' }],
    limites: ['Las K de los ejemplos no son mediciones publicadas.'],
    version: '1',
    evidencia: 'modelo-calculado',
    verificacion: 'Resuelto por bisección sobre ξ y comprobado con Q = K recalculada y, en los casos de segundo grado, con la solución analítica (tests/quimica/fisicoquimica.test.ts). Las K de los ejemplos no son mediciones.',
    condiciones: ['Una sola fase y volumen constante.', 'Temperatura fija implícita en K: cambiar la temperatura cambiaría K y no se modela aquí.'],
    especiesFases: ['Cada reacción lista sus especies, todas en la misma fase (gas o disolución ideal).'],
    salidas: [{ clave: 'Q0', nombre: 'Q inicial', unidad: '' }, { clave: 'xi', nombre: 'Avance ξ', unidad: 'mol/L' }, { clave: 'c_0', nombre: 'Concentración de equilibrio de cada especie', unidad: 'mol/L' }]
  },
  isomeros: {
    id: 'isomeros',
    nombre: 'Isómeros: comparación geométrica',
    fenomeno: 'Mismos átomos, distinta estructura: distancias, ángulos y diedros',
    pregunta: '¿En qué se distinguen, en tres dimensiones, dos moléculas con la misma fórmula?',
    tipo: 'estado-final',
    calculo: 'Compara dos isómeros del catálogo: carga la geometría 3D de cada uno (calculada con MMFF94s sobre una conformación de openchemlib, con su procedencia a la vista) y mide, sobre los átomos que elijas, la distancia entre el primero y el último, los ángulos y el diedro. No calcula energías ni dice cuál isómero es más estable.',
    campos: [
      { clave: 'pareja', etiqueta: 'Pareja de isómeros', unidad: '', requerido: true },
      ...(['a', 'b'] as const).flatMap((rengLado) => [1, 2, 3, 4].map((rengK) => ({ clave: `at${rengLado.toUpperCase()}${rengK}`, etiqueta: `Átomo ${rengK} del isómero ${rengLado.toUpperCase()} (índice)`, unidad: '', min: 0, max: RENG_MAX_INDICE_ATOMO_ISO, requerido: false })))
    ],
    ecuaciones: [
      'Distancia: d = |r₁ − rₙ| entre el primero y el último átomo elegido',
      'Ángulo en el átomo central: θ = arccos[(r₁ − r₂)·(r₃ − r₂) / (|r₁ − r₂|·|r₃ − r₂|)]',
      'Diedro: φ = atan2(|b₂|·b₁·(b₂×b₃), (b₁×b₂)·(b₂×b₃)), con b₁ = r₂ − r₁, b₂ = r₃ − r₂, b₃ = r₄ − r₃; positivo si, mirando de r₂ a r₃, el enlace r₃→r₄ queda a la derecha del r₂→r₁ (sentido horario)'
    ],
    dominio: [
      'Pares del catálogo: (Z)- y (E)-but-2-eno, etanol y éter dimetílico, butano y 2-metilpropano, propan-1-ol y propan-2-ol.',
      'De 0 a 4 átomos por isómero, sin repetir (índices 0 a 63 del modelo); hacen falta al menos 2 en cada uno para medir.',
      'Distancia: 2 a 4 átomos; ángulo: 3 o 4; segundo ángulo y diedro: 4.'
    ],
    supuestos: [
      'Cada geometría es una conformación de energía baja calculada con MMFF94s, no una medida ni un promedio de conformaciones.',
      'Molécula aislada: sin disolvente, sin vecinas y sin temperatura (un mínimo de energía, no un promedio térmico).',
      'Las medidas que atraviesan enlaces simples que giran (diedros y distancias entre átomos lejanos) dependen de la conformación elegida y no distinguen al isómero.',
      'Un diedro o ángulo entre átomos no enlazados se mide igualmente, pero no es un ángulo ni un diedro de enlace.'
    ],
    parametros: [
      { nombre: 'Geometría 3D de cada isómero', valor: 'MMFF94s (mínimo local con gradiente < 0,0001), conformación inicial con semilla fija 42', fuente: 'Biblioteca openchemlib 9.25.2 (licencia BSD-3-Clause, licencias/AVISOS-TERCEROS.txt); la convergencia se comprueba y, si falla, el isómero no se carga. Ninguna geometría de este catálogo es experimental: la app solo trae geometrías experimentales de 10 moléculas pequeñas, ninguna isómera de otra.', verificacion: 'calculo' },
      { nombre: 'Pares de isómeros', valor: '4 pares', fuente: 'Bancos propios de la app (RENG_NUMERO_ISOMEROS y RENG_BANCO_ESTEREO, practica/bancos.ts); un candado comprueba fórmula igual, identidad distinta y, en el par cis/trans, los descriptores E/Z', verificacion: 'libro' },
      { nombre: 'Definiciones de distancia, ángulo y diedro', valor: 'geometría analítica', fuente: 'Álgebra vectorial estándar; contrastada con coordenadas resueltas a mano (tolerancia 10⁻⁹) en las pruebas', verificacion: 'calculo' },
      { nombre: 'Umbral para llamar «iguales» a dos distancias', valor: '0,05 Å', fuente: 'Criterio convencional de este proyecto para la predicción previa; no procede de ninguna fuente ni es una incertidumbre', verificacion: 'libro' }
    ],
    limites: [
      'Un catálogo pequeño a propósito: 4 pares inocuos de enseñanza cuyos miembros salen de los bancos de la app.',
      'Una sola conformación por isómero: las medidas que dependen de giros de enlaces simples no son propiedades del isómero.',
      'Sin energías: no dice cuál isómero es más estable ni cuánto.',
      'MMFF94s es un campo de fuerzas clásico y aquí no se validó contra datos experimentales: las diferencias entre isómeros de unas décimas de ångström o unos pocos grados no deben leerse como medidas.',
      'No hay incertidumbre medida: la sensibilidad a perturbar una concentración no tiene sentido aquí y no se ofrece.'
    ],
    version: '1',
    evidencia: 'modelo-calculado',
    verificacion: 'Distancia, ángulo y diedro contrastados con coordenadas resueltas a mano (tolerancia 10⁻⁹) y con un cálculo independiente sobre las coordenadas del modelo; la geometría no se comparó con datos experimentales (tests/quimica/entrega-d4d-isomeros.test.ts).',
    condiciones: ['Molécula aislada, sin temperatura: cada geometría es un mínimo local de energía del campo de fuerzas MMFF94s.'],
    especiesFases: ['Cada isómero: una molécula neutra de una sola especie, sin fase asignada (molécula aislada).'],
    salidas: [
      { clave: 'dA', nombre: 'Distancia primero–último en A', unidad: 'Å' },
      { clave: 'dB', nombre: 'Distancia primero–último en B', unidad: 'Å' },
      { clave: 'angA', nombre: 'Ángulo en el segundo átomo de A', unidad: '°' },
      { clave: 'angB', nombre: 'Ángulo en el segundo átomo de B', unidad: '°' },
      { clave: 'dieA', nombre: 'Diedro en A', unidad: '°' },
      { clave: 'dieB', nombre: 'Diedro en B', unidad: '°' }
    ]
  },
  electroquimica: {
    id: 'electroquimica',
    nombre: 'Electroquímica: celda galvánica',
    fenomeno: 'Ánodo, cátodo, potencial, ΔG° y K de una celda ideal',
    pregunta: '¿Qué electrodo es el ánodo y cuál el cátodo, qué potencial da la celda y es espontánea la reacción?',
    tipo: 'estado-final',
    calculo: 'Celda galvánica ideal (estado final): combina dos semiceldas del catálogo, calcula E° = E°(cátodo) − E°(ánodo), ΔG° = −nFE°, K = exp(nFE°/RT) y, con las concentraciones, el potencial por la ecuación de Nernst. No modela corriente, resistencia, sobrepotencial ni el puente salino.',
    campos: [
      { clave: 'ano', etiqueta: 'Semicelda del ánodo (propuesta)', unidad: '', requerido: true },
      { clave: 'cat', etiqueta: 'Semicelda del cátodo (propuesta)', unidad: '', requerido: true },
      { clave: 'cA', etiqueta: 'Concentración del ion en el ánodo', unidad: 'mol/L', min: 0, max: RENG_C_MAX_ELECTRO, requerido: true },
      { clave: 'cC', etiqueta: 'Concentración del ion en el cátodo', unidad: 'mol/L', min: 0, max: RENG_C_MAX_ELECTRO, requerido: true }
    ],
    ecuaciones: ['Reducción en el cátodo: Ox + n e⁻ → Red; oxidación en el ánodo: Red → Ox + n e⁻', 'E°celda = E°cátodo − E°ánodo (potenciales estándar de reducción frente al SHE)', 'n = m.c.m. de los electrones de las dos semirreacciones; ΔG° = −n·F·E°celda', 'K = exp(n·F·E°celda/(R·T)) con T = 298,15 K', 'Nernst: E = E°celda − (R·T/(n·F))·ln Q, con Q = [Ox ánodo]^(ν·n/nₐ) / [Ox cátodo]^(ν·n/n_c) (sólidos y gases a actividad 1)', 'Espontánea si E > 0 (con concentraciones) o E° > 0 (estándar); ΔG = −n·F·E'],
    dominio: ['Pares del catálogo registrado (con fuente de potencial abierta): Zn²⁺/Zn, Cu²⁺/Cu, Fe²⁺/Fe, Mg²⁺/Mg, Al³⁺/Al y H⁺/H₂.', 'Concentraciones del ion de 0 a 1 mol/L (0 = falta la especie: no hay Nernst, sí E°).', 'T = 298,15 K; modelo ideal: actividades ≈ concentraciones por debajo de 0,01 mol/L.'],
    supuestos: ['Condiciones de referencia de la fuente: 298,15 K, referencia SHE, actividad 1 mol/dm³ de las especies acuosas, sólidos puros a actividad 1 y gases a 101,325 kPa.', 'Actividades ≈ concentraciones; sin potencial de unión líquida (el puente salino se supone ideal).', 'Celda en circuito abierto: se calcula el máximo teórico, sin corriente.', 'Pérdidas omitidas: resistencia interna, sobrepotencial, polarización, potencial de unión líquida; tampoco la reacción del metal con el agua ni su pasivación.', 'Se supone un solo ion por semicelda (el metal o el gas son la otra especie).'],
    parametros: [
      ...RENG_PARES_ELECTRO.map((rengP) => ({
        nombre: `E° de ${rengP.oxidante.formula}/${rengP.reductor.formula}`,
        valor: `${rengP.E0 < 0 ? '−' : ''}${String(Math.abs(rengP.E0)).replace('.', ',')} V (${rengP.n} e⁻)`,
        fuente: `${rengP.fuente.titulo}, ${rengP.fuente.url} · consultada ${rengP.fuente.consultada} · ${rengP.fuente.alcanceLectura} · fila literal: «${rengP.registro.filaLiteral}» · referencia de la fila: ${rengP.registro.referenciaFila} · condiciones de la página: ${rengP.fuente.temperatura}; ${rengP.fuente.convenio}; ${rengP.fuente.actividad}; gases: ${rengP.fuente.presion}; fuerza iónica: ${rengP.fuente.fuerzaIonica} · licencia: ${rengP.fuente.licencia}. ${rengP.nota} Otra tabla abierta (no se usa; sin condiciones declaradas): ${rengP.otrasConValor.map((rengO) => `${rengO.fuente.titulo.split(',')[0]} ${rengO.E0 < 0 ? '−' : ''}${String(Math.abs(rengO.E0)).replace('.', ',')} V`).join('; ')}.`,
        verificacion: 'consultada' as const
      })),
      { nombre: 'Constante de Faraday F', valor: `${String(RENG_FARADAY.valor).replace('.', ',')} C/mol (exacta)`, fuente: `${RENG_FARADAY.fuente.titulo}, ${RENG_FARADAY.fuente.url} · consultada ${RENG_FARADAY.fuente.consultada} · fila literal: «${RENG_FARADAY.filaLiteral.replace(/\s+/g, ' ')}» (el listado trunca los dígitos con puntos suspensivos: se usan los mostrados) · se contrastó con ${RENG_FARADAY.contraste.fuente.titulo} (mismo valor) · ${RENG_FARADAY.fuente.alcanceLectura} · ${RENG_FARADAY.fuente.licencia}`, verificacion: 'consultada' },
      { nombre: 'Constante molar de los gases R', valor: `${String(RENG_R_GASES.valor).replace('.', ',')} J/(mol·K) (exacta)`, fuente: `${RENG_R_GASES.fuente.titulo}, ${RENG_R_GASES.fuente.url} · consultada ${RENG_R_GASES.fuente.consultada} · fila literal: «${RENG_R_GASES.filaLiteral.replace(/\s+/g, ' ')}» · se contrastó con ${RENG_R_GASES.contraste.fuente.titulo} (mismo valor) y coincide con la R que ya usa el proyecto · ${RENG_R_GASES.fuente.alcanceLectura} · ${RENG_R_GASES.fuente.licencia}`, verificacion: 'consultada' },
      { nombre: 'Umbrales de concentración (1 mol/L, 0,01 mol/L, 10⁻⁶ mol/L)', valor: 'ideal de 10⁻⁶ a 0,01 mol/L', fuente: 'Criterios convencionales de este proyecto (los mismos 0,01 mol/L de Mezcla y Solubilidad): no proceden de ninguna fuente', verificacion: 'libro' },
      { nombre: 'Ecuación de Nernst y relaciones ΔG° = −nFE°, K = exp(nFE°/RT)', valor: 'termodinámica estándar', fuente: 'Álgebra estándar de electroquímica; no se consultó una obra concreta', verificacion: 'libro' }
    ],
    limites: ['Un catálogo pequeño a propósito: solo entran los pares cuyo potencial se pudo respaldar con una fuente abierta que declare las condiciones.', 'Las tablas abiertas discrepan entre sí (hasta 16 mV en Mg²⁺/Mg y 5 mV en Cu²⁺/Cu): se muestra pero no se propaga como incertidumbre.', 'Sin resistencia interna, sobrepotencial, polarización ni potencial de unión líquida: el potencial es el máximo teórico.', 'No cubre pares con dos iones en disolución (Fe³⁺/Fe²⁺), ni la dependencia con la presión del gas ni con la temperatura.'],
    version: '1',
    evidencia: 'calculo-verificado',
    verificacion: 'E°celda, ΔG°, K y Nernst contrastados con cifras resueltas a mano y con una segunda vía independiente (cadena a través del SHE y aditividad de ΔG de las semirreacciones) (tests/quimica/entrega-d4c-electroquimica.test.ts); cada E° se parsea de la fila literal de su fuente y se contrasta con la otra tabla abierta. No comparado con mediciones.',
    condiciones: ['Temperatura de 298,15 K (25 °C), la de la tabla de potenciales (el modelo no varía E° con la temperatura).', 'Referencia SHE, actividad 1 mol/dm³ y gases a 101,325 kPa, según la fuente.'],
    especiesFases: ['Cada semicelda: un ion metálico (o H⁺) en fase acuosa y su forma reducida (metal sólido o H₂ gas).'],
    salidas: [{ clave: 'E0', nombre: 'E° de la celda', unidad: 'V' }, { clave: 'E', nombre: 'Potencial con concentraciones (Nernst)', unidad: 'V' }, { clave: 'dG0', nombre: 'ΔG° de la reacción', unidad: 'kJ' }, { clave: 'K', nombre: 'Constante de equilibrio', unidad: '' }, { clave: 'n', nombre: 'Electrones intercambiados', unidad: '' }]
  },
  solubilidad: {
    id: 'solubilidad',
    nombre: 'Solubilidad: Q frente a Ksp',
    fenomeno: 'Disuelve, equilibrio o precipita; efecto de ion común',
    pregunta: '¿Se disuelve, está en equilibrio o precipita una sal poco soluble con estas concentraciones de iones, y cuánto cambia su solubilidad por un ion común?',
    tipo: 'estado-final',
    calculo: 'Equilibrio de solubilidad (estado final): compara Q con el Ksp de la sal, resuelve cuánto precipita o se disuelve y calcula la solubilidad molar con los iones presentes. Solo vale para el equilibrio de disolución en el modelo ideal: no incluye hidrólisis, complejación, pares iónicos ni pH.',
    campos: [
      { clave: 'sal', etiqueta: 'Sal', unidad: '', requerido: true },
      { clave: 'cM', etiqueta: 'Concentración del catión en disolución', unidad: 'mol/L', min: RENG_LIMITES_SOLUBILIDAD.cMin, max: RENG_LIMITES_SOLUBILIDAD.cMax, requerido: true },
      { clave: 'cA', etiqueta: 'Concentración del anión en disolución', unidad: 'mol/L', min: RENG_LIMITES_SOLUBILIDAD.cMin, max: RENG_LIMITES_SOLUBILIDAD.cMax, requerido: true },
      { clave: 'sol0', etiqueta: 'Sólido presente (por litro de disolución)', unidad: 'mol/L', min: 0, max: RENG_LIMITES_SOLUBILIDAD.solidoMax, requerido: false }
    ],
    ecuaciones: ['MₚAᵩ(s) ⇌ p M^(z+) + q A^(z−);  Ksp = [M]^p·[A]^q', 'Q = [M]^p·[A]^q con las concentraciones iniciales; Q < Ksp disuelve, Q = Ksp equilibrio, Q > Ksp precipita', 'Agua pura: s₀ = (Ksp/(pᵖ·qᵠ))^(1/(p+q));  1:1 → s₀ = √Ksp', 'Con iones presentes: ([M] + p·s)^p·([A] + q·s)^q = Ksp (1:1: s² + ([M] + [A])·s + ([M]·[A] − Ksp) = 0)', 'Precipitación: ([M] − p·x)^p·([A] − q·x)^q = Ksp', 'Fuerza iónica estimada: I = ½·Σ cᵢ·zᵢ² (solo los iones del equilibrio)'],
    dominio: ['Sales del conjunto registrado (con fuente de Ksp abierta); estequiometrías 1:1, 1:2 y 2:1.', 'Concentraciones de los iones de 0 a 1 mol/L y sólido de 0 a 1 mol por litro de disolución.', 'Modelo ideal: por encima de una fuerza iónica estimada de 0,01 mol/L el resultado es orientativo.'],
    supuestos: ['Actividades ≈ concentraciones: el Ksp tabulado corresponde a fuerza iónica cero y aquí se usa con concentraciones.', 'No se modelan la hidrólisis de los aniones, la formación de complejos ni de pares iónicos, el pH ni el CO₂ disuelto: ninguna fuente consultada los cuantifica.', 'La disolución y la precipitación son rápidas y reversibles (solo se calcula el estado final) y el volumen no cambia.', 'Los iones espectadores no cuentan en la fuerza iónica (la cifra es un mínimo).'],
    parametros: [
      ...RENG_SALES_SOLUBILIDAD.map((rengS) => ({
        nombre: `Ksp de ${rengS.formula} (${rengS.solido})`,
        valor: `${rengS.kspTexto}${rengS.pKspFuente === null ? '' : ` (pKsp ${String(rengS.pKspFuente).replace('.', ',')})`}`,
        fuente: `${rengS.fuente.titulo}, ${rengS.fuente.url} · consultada ${rengS.fuente.consultada} · ${rengS.fuente.alcanceLectura} · ${rengS.fuente.temperaturaC} °C; fuerza iónica: ${rengS.fuente.fuerzaIonica}; disolvente: ${rengS.fuente.disolvente} · dato de: ${rengS.fuente.origenDato} · licencia: ${rengS.fuente.licencia}. ${rengS.registro.nota} Otras tablas abiertas dan valores distintos (no se usan): ${rengS.otrasConValor.map((rengO) => `${rengO.fuente.titulo.split(',')[0]} ${String(rengO.ksp).replace('e-', ' × 10^-').replace('.', ',')}`).join('; ')}.`,
        verificacion: 'consultada' as const
      })),
      { nombre: 'Umbral de fuerza iónica (0,01 mol/L)', valor: '0,01 mol/L', fuente: 'Criterio convencional de este proyecto (el mismo que usa Mezcla ácido–base): no procede de ninguna fuente', verificacion: 'libro' },
      { nombre: 'Fórmulas del equilibrio de solubilidad', valor: 'Ksp, Q, solubilidad molar e ion común', fuente: 'Álgebra estándar de química analítica; no se consultó una obra concreta', verificacion: 'libro' }
    ],
    limites: ['Un conjunto pequeño a propósito: solo entran las sales cuyo Ksp se pudo respaldar con una fuente abierta (CaSO₄ quedó fuera porque las tablas discrepan y no aclaran el sólido).', 'Las tablas abiertas discrepan entre sí para las tres sales (hasta un factor 2,6 en CaCO₃): el Ksp tiene una incertidumbre entre fuentes que la escena no propaga.', 'Sin hidrólisis, complejación, pares iónicos ni pH: para CaF₂ y CaCO₃ el resultado en agua pura es solo orientativo.', 'No sirve para sales con estequiometría distinta de 1:1, 1:2 o 2:1 (un fosfato, por ejemplo).'],
    version: '1',
    evidencia: 'calculo-verificado',
    verificacion: 'Q/Ksp, solubilidad molar, ion común (cuadrática en 1:1) y precipitación contrastados con cifras resueltas a mano y con la sustitución en la ecuación de Ksp (tests/quimica/entrega-d4b-solubilidad.test.ts); cada Ksp se lee de la fila literal de su fuente y se comprueba contra el pKsp de la misma fila. No comparado con mediciones.',
    condiciones: ['Temperatura de 25 °C, la de la tabla de Ksp (el modelo no varía el Ksp con la temperatura).', 'Fuerza iónica cero en la tabla; aquí se usan concentraciones (modelo ideal).'],
    especiesFases: ['Sólido poco soluble (CaF₂, Mg(OH)₂ o CaCO₃ calcita) en equilibrio con su catión y su anión en fase acuosa.'],
    salidas: [{ clave: 'q', nombre: 'Q', unidad: '' }, { clave: 'ver', nombre: 'Veredicto (1 disuelve, 0 equilibrio, −1 precipita)', unidad: '' }, { clave: 's0', nombre: 'Solubilidad molar en agua pura', unidad: 'mol/L' }, { clave: 's', nombre: 'Solubilidad molar con los iones presentes', unidad: 'mol/L' }, { clave: 'x', nombre: 'Cantidad que precipita', unidad: 'mol/L' }, { clave: 'd', nombre: 'Cantidad de sólido que se disuelve', unidad: 'mol/L' }]
  },
  colorimetria: {
    id: 'colorimetria',
    nombre: 'Colorimetría: curva de calibración',
    fenomeno: 'Absorbancia, patrones y concentración de la muestra',
    pregunta: '¿Qué concentración tiene la muestra según su absorbancia y la curva de los patrones?',
    tipo: 'estado-final',
    calculo: 'Calibración lineal (estado final): ajusta A = m·c + b a los patrones, ya sin el blanco, y obtiene la concentración de la muestra por interpolación con su incertidumbre. No predice la absorbancia de ninguna sustancia y no sirve fuera del intervalo de los patrones.',
    campos: [
      { clave: 'b0', etiqueta: 'Blanco 1: absorbancia', unidad: '', min: RENG_LIMITES_COLORIMETRIA.aMin, max: RENG_LIMITES_COLORIMETRIA.aMax, requerido: true, sensible: true },
      { clave: 'b1', etiqueta: 'Blanco 2: absorbancia', unidad: '', min: RENG_LIMITES_COLORIMETRIA.aMin, max: RENG_LIMITES_COLORIMETRIA.aMax, requerido: false, sensible: true },
      { clave: 'b2', etiqueta: 'Blanco 3: absorbancia', unidad: '', min: RENG_LIMITES_COLORIMETRIA.aMin, max: RENG_LIMITES_COLORIMETRIA.aMax, requerido: false, sensible: true },
      ...[0, 1, 2, 3, 4, 5].flatMap((rengI) => [
        { clave: `c${rengI}`, etiqueta: `Patrón ${rengI + 1}: concentración`, unidad: 'mg/L', min: RENG_LIMITES_COLORIMETRIA.cMin, max: RENG_LIMITES_COLORIMETRIA.cMax, requerido: false },
        { clave: `a${rengI}`, etiqueta: `Patrón ${rengI + 1}: absorbancia`, unidad: '', min: RENG_LIMITES_COLORIMETRIA.aMin, max: RENG_LIMITES_COLORIMETRIA.aMax, requerido: false, sensible: true }
      ]),
      { clave: 'As', etiqueta: 'Muestra: absorbancia', unidad: '', min: RENG_LIMITES_COLORIMETRIA.aMin, max: RENG_LIMITES_COLORIMETRIA.aMax, requerido: true, sensible: true },
      { clave: 'rep', etiqueta: 'Réplicas de la muestra', unidad: '', min: 1, max: RENG_LIMITES_COLORIMETRIA.replicasMax, requerido: false }
    ],
    ecuaciones: ['A_corr = A − Ā_blanco (media de las lecturas del blanco)', 'Beer–Lambert en su régimen lineal: A = ε·l·c', 'Mínimos cuadrados: m = Sxy/Sxx; b = ȳ − m·x̄; residuo = A_corr − (b + m·c)', 's_r = √(Σ residuo²/(n − 2)); R² = 1 − Σ residuo²/Σ(y − ȳ)²', 'c₀ = (A₀,corr − b)/m, solo si A₀,corr y c₀ caen dentro del intervalo de los patrones', 'u(c₀) = (s_r/|m|)·√(1/N + 1/n + (A₀,corr − ȳ)²/(m²·Sxx)), con N réplicas de la muestra'],
    dominio: ['De 1 a 3 lecturas del blanco, de 3 a 6 patrones y de 1 a 10 réplicas; concentraciones de 0 a 10 000 mg/L; absorbancias de −0,5 a 5.', 'La absorbancia de la muestra sin el blanco debe caer entre las de los patrones y la concentración obtenida dentro de su intervalo: no se extrapola.'],
    supuestos: ['Se supone el régimen lineal de Beer–Lambert en todo el intervalo de los patrones; solo se comprueba mirando los residuos.', 'Misma cubeta y longitud de onda para blancos, patrones y muestra, a temperatura constante.', 'La incertidumbre u(c₀) es típica (k = 1) y solo recoge la regresión y las réplicas: no incluye la incertidumbre de preparar los patrones.', 'Los errores están en la absorbancia (no en la concentración de los patrones), son independientes y de varianza constante.'],
    parametros: [
      { nombre: 'Datos de ejemplo (blancos, patrones y muestra)', valor: 'colorante alimentario de ejemplo; 5 patrones de 2 a 10 mg/L', fuente: 'Valores DIDÁCTICOS inventados para ilustrar el método: no son mediciones de ningún colorante', verificacion: 'calculo' },
      { nombre: 'Intervalo de absorbancia recomendado', valor: '0,1–0,8; evitar registrar por encima de 1', fuente: 'Wenzel, LibreTexts «1.2 Beers Law»; consultada con una herramienta de lectura de página que devuelve citas (no el texto íntegro). Es una recomendación de trabajo, no un límite medido', verificacion: 'consultada' },
      { nombre: 'Fórmulas de regresión y de incertidumbre interpolada', valor: 'mínimos cuadrados ordinarios', fuente: 'Fórmulas estándar de química analítica; no se consultó una obra concreta', verificacion: 'libro' }
    ],
    limites: ['No hay criterio fuente para aceptar o rechazar la linealidad con R²: se muestran R² y residuos, pero la decisión es de quien interpreta.', 'Una sola especie absorbente en un disolvente que no absorbe: sin interferencias, dispersión ni efecto de matriz.', 'Los patrones y la muestra son datos introducidos: el modelo no sabe de qué sustancia se trata.'],
    version: '1',
    evidencia: 'calculo-verificado',
    verificacion: 'Regresión, interpolación, rechazo de la extrapolación y u(c₀) contrastados con cifras calculadas a mano y con un segundo cálculo por sumas (tests/quimica/entrega-d4a-colorimetria.test.ts). No comparado con mediciones.',
    condiciones: ['Misma cubeta, longitud de onda y temperatura constante para el blanco, los patrones y la muestra (no se modelan).', 'La recta se ajusta con las absorbancias ya sin el blanco.'],
    especiesFases: ['Fase acuosa: una sola especie absorbente (colorante alimentario de ejemplo, sin identificar) en un disolvente que no absorbe.'],
    salidas: [{ clave: 'x0', nombre: 'Concentración de la muestra', unidad: 'mg/L' }, { clave: 'u', nombre: 'Incertidumbre típica de la concentración', unidad: 'mg/L' }, { clave: 'm', nombre: 'Pendiente de la recta', unidad: 'L/mg' }, { clave: 'b', nombre: 'Ordenada de la recta', unidad: '' }, { clave: 'r2', nombre: 'R²', unidad: '' }, { clave: 'sr', nombre: 'Desviación típica de la regresión', unidad: '' }]
  },
  dilucion: {
    id: 'dilucion',
    nombre: 'Dilución con material de vidrio',
    fenomeno: 'Alícuota, matraz aforado y concentración final',
    pregunta: '¿Qué concentración queda al transferir una alícuota y completar con disolvente?',
    tipo: 'estado-final',
    calculo: 'Conservación del soluto (estado final): al diluir se conservan los moles de soluto y cambia el volumen total, y con él la concentración. No modela reacciones ni pérdidas de soluto.',
    campos: [
      { clave: 'c1', etiqueta: 'Concentración de la disolución inicial', unidad: 'mol/L', min: RENG_LIMITES_DILUCION.c1Min, max: RENG_LIMITES_DILUCION.c1Max, requerido: true },
      { clave: 'Va', etiqueta: 'Alícuota transferida con la pipeta', unidad: 'mL', min: RENG_LIMITES_DILUCION.VaMin, max: RENG_LIMITES_DILUCION.VaMax, requerido: false },
      { clave: 'Vf', etiqueta: 'Volumen final (matraz aforado)', unidad: 'mL', min: RENG_LIMITES_DILUCION.VfMin, max: RENG_LIMITES_DILUCION.VfMax, requerido: true },
      { clave: 'modo', etiqueta: 'Cómo se completa (0 = hasta el aforo, 1 = volumen de disolvente igual al final)', unidad: '', min: 0, max: 1, requerido: false },
      { clave: 'Vdisp', etiqueta: 'Volumen disponible en el recipiente inicial', unidad: 'mL', min: RENG_LIMITES_DILUCION.VdispMin, max: RENG_LIMITES_DILUCION.VdispMax, requerido: false },
      { clave: 'c2obj', etiqueta: 'Concentración que quieres preparar (objetivo)', unidad: 'mol/L', min: 1e-9, requerido: false }
    ],
    ecuaciones: ['n = c₁·V_alícuota (soluto transferido; se conserva)', 'Aforo: V_total = V_matraz y c₂ = n / V_matraz', 'Volumen de disolvente igual al final: V_total = V_alícuota + V_disolvente y c₂ = n / V_total', 'Factor de dilución F = V_total / V_alícuota = c₁ / c₂'],
    dominio: ['c₁ de 10⁻⁶ a 20 mol/L; alícuota de 0,01 a 1000 mL; volumen final de 1 a 5000 mL.', 'La alícuota no puede superar el volumen disponible y, con aforo, el volumen final no puede ser menor que la alícuota.'],
    supuestos: ['Sin reacción química ni pérdida de soluto: toda la alícuota queda en el matraz.', 'Con aforo el volumen final es el marcado en el matraz (no se suman volúmenes); con «volumen de disolvente igual al final» se suponen volúmenes aditivos.', 'No se incluye la incertidumbre del material volumétrico.'],
    parametros: [{ nombre: 'Concentraciones de las disoluciones de ejemplo', valor: 'NaCl 0,2 · glucosa 0,5 · sacarosa 0,1 mol/L', fuente: 'Valores didácticos elegidos para el montaje; se pueden cambiar', verificacion: 'calculo' }],
    limites: ['No incluye la incertidumbre de la pipeta ni del matraz.', 'No sirve para mezclar dos disoluciones de distinto soluto ni para disoluciones en serie (cada paso es una dilución).'],
    version: '1',
    evidencia: 'calculo-verificado',
    verificacion: 'Conservación de moles y c₁V₁ = c₂V₂ contrastadas con un cálculo independiente y con el caso 25,0 mL de 0,200 mol/L aforados a 100,0 mL (tests/quimica/entrega-d3-dilucion.test.ts). No comparado con mediciones.',
    condiciones: ['Todos los volúmenes se miden a la misma temperatura; en este modelo la concentración no depende de ella.'],
    especiesFases: ['Fase acuosa: un soluto no reactivo disuelto en agua (NaCl, glucosa o sacarosa de ejemplo).'],
    salidas: [{ clave: 'n', nombre: 'Moles de soluto en el matraz', unidad: 'mol' }, { clave: 'c2', nombre: 'Concentración final', unidad: 'mol/L' }, { clave: 'F', nombre: 'Factor de dilución', unidad: '' }, { clave: 'Vdis', nombre: 'Disolvente añadido', unidad: 'mL' }, { clave: 'Vtotal', nombre: 'Volumen total', unidad: 'mL' }]
  },
  termo: {
    id: 'termo',
    nombre: 'Energía de reacción',
    fenomeno: 'Calor y espontaneidad',
    pregunta: '¿Cuánto calor libera o absorbe una reacción y ocurre sola a esta temperatura?',
    tipo: 'estado-final',
    calculo: 'Cálculo termodinámico (energía y espontaneidad): ΔG < 0 indica que ocurre sola, no lo rápido que sea. La velocidad se estudia en «Velocidad de reacción» y la geometría molecular en la Mesa molecular.',
    campos: [
      { clave: 'reaccion', etiqueta: 'Reacción', unidad: '', requerido: true },
      { clave: 'T', etiqueta: 'Temperatura', unidad: 'K', min: 1, max: 5000, requerido: true },
      { clave: 'mol', etiqueta: 'Moles del primer reactivo que reaccionan', unidad: 'mol', min: 0, requerido: false },
      { clave: 'masaAgua', etiqueta: 'Masa de agua que absorbe el calor', unidad: 'g', min: 1, requerido: false }
    ],
    ecuaciones: ['ΔH° = Σν·ΔfH°(productos) − Σν·ΔfH°(reactivos)', 'ΔG = ΔH − T·ΔS', 'K = exp(−ΔG/RT)', 'q = ΔT·m·c con c = 4,184 J/(g·K)'],
    dominio: ['Reacciones de la lista, con datos a 298,15 K.', 'Temperatura de 1 a 5000 K (extrapolación fuera de 298 K).'],
    supuestos: ['ΔH° y ΔS° no cambian con la temperatura.', 'Estados estándar; si hay agua líquida, solo vale entre 273 y 373 K.'],
    parametros: [
      { nombre: 'ΔfH° (entalpía de formación estándar)', valor: 'tabla de 12 sustancias', fuente: 'Wikipedia «Standard enthalpy of formation»', verificacion: 'consultada' },
      { nombre: 'S° (entropía molar estándar)', valor: 'tabla de 9 sustancias; faltan etanol, HCl y glucosa', fuente: 'Valores de libro de texto; no consultados en esta sesión', verificacion: 'libro' },
      { nombre: 'R', valor: '8,314462618 J/(mol·K)', fuente: 'CODATA 2018', verificacion: 'libro' }
    ],
    limites: ['Falta S° para algunas sustancias: entonces no se calcula ΔG.', 'ΔG < 0 indica espontaneidad termodinámica, no velocidad.'],
    version: '1',
    evidencia: 'modelo-calculado',
    verificacion: 'ΔH° por la ley de Hess con datos tabulados; comprobada con la combustión del metano a mano (tests/quimica/fisicoquimica.test.ts). No comparada con calorimetría.',
    condiciones: ['ΔH° y ΔS° referidos a 298,15 K y 1 bar; se toman constantes al variar T (solo ΔG y K dependen de T en el cálculo).', 'El calor liberado usa ΔH° a 298,15 K aunque la temperatura sea otra.'],
    especiesFases: ['Cada sustancia con su fase estándar: O₂, H₂, N₂, CO₂, CH₄, NH₃, HCl (g); H₂O (l o g); C₂H₅OH (l); NaCl y glucosa (s).'],
    salidas: [{ clave: 'dH', nombre: 'ΔH° de la reacción', unidad: 'kJ' }, { clave: 'dG', nombre: 'ΔG a la temperatura indicada', unidad: 'kJ' }, { clave: 'K', nombre: 'Constante de equilibrio', unidad: '' }, { clave: 'q', nombre: 'Calor liberado', unidad: 'kJ' }]
  }
}

export type RengValidacionSim = { ok: true; entradas: Record<string, number | string>; avisos: string[] } | { ok: false; diagnostico: string; campos: string[] }

const rengFmt = (rengX: number): string => String(Number(rengX.toPrecision(4))).replace('.', ',')

export function rengEntradasPorDefecto(rengEscena: RengEscena): Record<string, number | string> {
  switch (rengEscena) {
    case 'acidobase':
      return { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1 }
    case 'mezcla':
      return { acido: 'acetico', cAcido: 0.01, VAcido: 25, cBase: 0.01, VBase: 12.5 }
    case 'cinetica':
      return { orden: 1, A0: 1, k: 0.2 }
    case 'equilibrio':
      return { reaccion: 'hi', K: 50, c0_0: 1, c0_1: 1, c0_2: 0 }
    case 'termo':
      return { reaccion: 'metano', T: 298.15, mol: 1, masaAgua: 1000 }
    case 'dilucion':
      return { c1: 0.2, Va: 25, Vf: 100, modo: 0, Vdisp: 250 }
    case 'colorimetria':
      return rengEntradasColorimetriaEjemplo()
    case 'solubilidad':
      return { sal: 'mgoh2', cM: 1e-4, cA: 1e-3, sol0: 0 }
    case 'electroquimica':
      return { ano: 'zn', cat: 'cu', cA: 1, cC: 1 }
    case 'isomeros':
      return rengEntradasIsoPorDefecto(RENG_POR_DEFECTO_PAREJA)
  }
}

export function rengEntradasColorimetriaEjemplo(): Record<string, number> {
  const rengE: Record<string, number> = { As: RENG_DATOS_COLOR_EJEMPLO.muestra, rep: 1 }
  RENG_DATOS_COLOR_EJEMPLO.blancos.forEach((rengB, rengI) => (rengE[`b${rengI}`] = rengB))
  RENG_DATOS_COLOR_EJEMPLO.patrones.forEach((rengP, rengI) => {
    rengE[`c${rengI}`] = rengP.c
    rengE[`a${rengI}`] = rengP.a
  })
  return rengE
}

export const rengSemiceldaCore = (rengP: RengParElectroquimico): RengSemiceldaCore => ({ id: rengP.id, oxidante: rengP.oxidante.formula, reductor: rengP.reductor.formula, nu: rengP.oxidante.nu, carga: rengP.oxidante.carga, n: rengP.n, E0: rengP.E0, gas: rengP.reductor.estado === 'g' })

export function rengAnalizarCeldaEntradas(rengE: RengEntradasSim): ReturnType<typeof rengAnalizarCelda> {
  return rengAnalizarCelda({ anodo: rengSemiceldaCore(rengParRegistrado(String(rengE['ano']))), catodo: rengSemiceldaCore(rengParRegistrado(String(rengE['cat']))), cA: Number(rengE['cA']), cC: Number(rengE['cC']), F: RENG_FARADAY.valor, R: RENG_R_GASES.valor })
}

export { RENG_CODIGOS_PARES }

export function rengAnalizarSolubilidadEntradas(rengE: RengEntradasSim): ReturnType<typeof rengAnalizarSolubilidad> {
  const rengSal = rengSalRegistrada(String(rengE['sal']))
  return rengAnalizarSolubilidad({ ksp: rengSal.ksp, nuM: rengSal.cation.nu, nuA: rengSal.anion.nu, zM: rengSal.cation.carga, zA: rengSal.anion.carga, cM: Number(rengE['cM']), cA: Number(rengE['cA']), solido: Number(rengE['sol0'] ?? 0), nombreM: rengSal.cation.formula, nombreA: rengSal.anion.formula })
}

export { RENG_CODIGOS_SALES }

export { RENG_CODIGOS_PAREJAS }

export function rengLeerSeleccionIso(rengE: RengEntradasSim): { a: number[]; b: number[] } {
  const rengLado = (rengLetra: 'a' | 'b'): number[] => {
    const rengSel: number[] = []
    let rengHueco = false
    for (let rengK = 1; rengK <= RENG_MAX_SELECCION_ISO; rengK++) {
      const rengV = rengE[`at${rengLetra.toUpperCase()}${rengK}`]
      if (rengV === undefined) {
        rengHueco = true
        continue
      }
      if (rengHueco) throw new RangeError(`Elige los átomos del isómero ${rengLetra.toUpperCase()} en orden, sin saltarte ninguno (falta el átomo ${rengSel.length + 1}).`)
      if (typeof rengV !== 'number' || !Number.isInteger(rengV)) throw new RangeError(`El átomo ${rengK} del isómero ${rengLetra.toUpperCase()} debe ser un número entero (el índice del átomo).`)
      rengSel.push(rengV)
    }
    return rengSel
  }
  return { a: rengLado('a'), b: rengLado('b') }
}

export function rengCompararIsomerosEntradas(rengE: RengEntradasSim): { par: RengParIsomeros; a: RengGeometriaIsomero; b: RengGeometriaIsomero; seleccion: { a: number[]; b: number[] }; comparacion: RengComparacionIso } {
  const rengC = rengCargarPareja(String(rengE['pareja']))
  if (!rengC.ok) throw new RangeError(`${rengC.codigo}: ${rengC.motivo}`)
  const rengSel = rengLeerSeleccionIso(rengE)
  return { par: rengC.par, a: rengC.a, b: rengC.b, seleccion: rengSel, comparacion: rengCompararIsomeros(rengC.a, rengC.b, rengSel.a, rengSel.b) }
}

export function rengSalidasIso(rengC: RengComparacionIso): Record<string, number> {
  const rengSal: Record<string, number> = { nA: rengC.a.n, nB: rengC.b.n }
  if (rengC.a.n < 2 || rengC.b.n < 2) return rengSal
  const rengPon = (rengClave: string, rengV: number | null): void => {
    if (rengV !== null && Number.isFinite(rengV)) rengSal[rengClave] = rengV
  }
  rengPon('dA', rengC.a.distancia)
  rengPon('dB', rengC.b.distancia)
  rengPon('angA', rengC.a.angulo1)
  rengPon('angB', rengC.b.angulo1)
  rengPon('ang2A', rengC.a.angulo2)
  rengPon('ang2B', rengC.b.angulo2)
  rengPon('dieA', rengC.a.diedro)
  rengPon('dieB', rengC.b.diedro)
  rengPon('ddist', rengC.diferencias.distancia)
  rengPon('dang', rengC.diferencias.angulo1)
  rengPon('dang2', rengC.diferencias.angulo2)
  rengPon('ddie', rengC.diferencias.diedro)
  if (rengC.mayorDistancia !== null) rengSal['mayor'] = rengC.mayorDistancia === 'igual' ? 0 : rengC.mayorDistancia === 'b' ? 1 : -1
  return rengSal
}


export function rengEntradasIsoPorDefecto(rengIdPareja: string): Record<string, number | string> {
  const rengP = RENG_PAREJAS_ISO.find((rengX) => rengX.id === rengIdPareja)!
  const rengSal: Record<string, number | string> = { pareja: rengP.id }
  rengP.seleccionInicial.a.forEach((rengI, rengK) => (rengSal[`atA${rengK + 1}`] = rengI))
  rengP.seleccionInicial.b.forEach((rengI, rengK) => (rengSal[`atB${rengK + 1}`] = rengI))
  return rengSal
}

export const rengBaseEntradas = (rengEscena: RengEscena): Record<string, number | string> => (rengEscena === 'colorimetria' ? {} : rengEscena === 'isomeros' ? { pareja: RENG_POR_DEFECTO_PAREJA } : rengEntradasPorDefecto(rengEscena))

export function rengEspeciesDe(rengE: RengEntradasSim): RengEspecieEq[] | null {
  const rengP = RENG_PRESETS_EQ.find((rengX) => rengX.id === rengE['reaccion'])
  if (!rengP) return null
  return rengP.esp.map((rengS, rengI) => ({ ...rengS, c0: Number(rengE[`c0_${rengI}`] ?? rengS.c0) }))
}

export function rengValidarEntradasSim(rengEscena: RengEscena, rengCrudas: RengEntradasSim): RengValidacionSim {
  const rengModelo = RENG_MODELOS_ESCENA[rengEscena]
  const rengFaltan = rengModelo.campos.filter((rengC) => rengC.requerido && rengCrudas[rengC.clave] === undefined)
  const rengEsEq = rengEscena === 'equilibrio'
  const rengPresetEq = rengEsEq ? RENG_PRESETS_EQ.find((rengP) => rengP.id === rengCrudas['reaccion']) : undefined
  const rengFaltanReales = rengFaltan.filter((rengC) => !(rengEsEq && rengC.clave === 'c0_2' && rengPresetEq && rengPresetEq.esp.length < 3))
  if (rengFaltanReales.length > 0) return { ok: false, diagnostico: `Faltan datos para esta simulación: ${rengFaltanReales.map((rengC) => rengC.etiqueta.toLowerCase()).join(', ')}.`, campos: rengFaltanReales.map((rengC) => rengC.clave) }
  const rengBase = rengBaseEntradas(rengEscena)
  const rengEntradas: Record<string, number | string> = { ...rengBase }
  for (const rengC of rengModelo.campos) if (rengCrudas[rengC.clave] !== undefined) rengEntradas[rengC.clave] = rengCrudas[rengC.clave]!
  for (const rengC of rengModelo.campos) {
    if (rengC.unidad === '' && (rengC.clave === 'acido' || rengC.clave === 'reaccion' || rengC.clave === 'sal' || rengC.clave === 'ano' || rengC.clave === 'cat' || rengC.clave === 'pareja')) continue
    const rengV = rengEntradas[rengC.clave]
    if (!rengC.requerido && rengCrudas[rengC.clave] === undefined) continue
    if (typeof rengV !== 'number' || !Number.isFinite(rengV)) return { ok: false, diagnostico: `«${rengC.etiqueta}» debe ser un número finito.`, campos: [rengC.clave] }
    if (rengC.min !== undefined && rengV < rengC.min) return { ok: false, diagnostico: `«${rengC.etiqueta}» (${rengFmt(rengV)}${rengC.unidad ? ` ${rengC.unidad}` : ''}) está por debajo del dominio del modelo (mínimo ${rengFmt(rengC.min)}${rengC.unidad ? ` ${rengC.unidad}` : ''}).`, campos: [rengC.clave] }
    if (rengC.max !== undefined && rengV > rengC.max) return { ok: false, diagnostico: `«${rengC.etiqueta}» (${rengFmt(rengV)}${rengC.unidad ? ` ${rengC.unidad}` : ''}) supera el dominio del modelo (máximo ${rengFmt(rengC.max)}${rengC.unidad ? ` ${rengC.unidad}` : ''}).`, campos: [rengC.clave] }
  }
  const rengAvisos: string[] = []
  if (rengEscena === 'acidobase' && !RENG_ACIDOS.some((rengA) => rengA.id === rengEntradas['acido'])) return { ok: false, diagnostico: `El ácido «${String(rengEntradas['acido'])}» no está en el modelo. Ácidos disponibles: ${RENG_ACIDOS.map((rengA) => rengA.nombre).join('; ')}.`, campos: ['acido'] }
  if (rengEscena === 'mezcla') {
    if (rengEntradas['acido'] !== 'hcl' && rengEntradas['acido'] !== 'acetico') return { ok: false, diagnostico: 'El modelo de mezcla admite solo ácido clorhídrico o ácido acético.', campos: ['acido'] }
    try {
      rengResolverMezclaAcidoBase({ acido: rengEntradas['acido'], concentracionAcido: Number(rengEntradas['cAcido']), volumenAcidoMl: Number(rengEntradas['VAcido']), concentracionBase: Number(rengEntradas['cBase']), volumenBaseMl: Number(rengEntradas['VBase']) })
    } catch (rengE) {
      if (rengE instanceof RangeError) return { ok: false, diagnostico: rengE.message, campos: [] }
      throw rengE
    }
  }
  if (rengEscena === 'cinetica' && ![0, 1, 2].includes(Number(rengEntradas['orden']))) return { ok: false, diagnostico: 'El orden de reacción debe ser 0, 1 o 2.', campos: ['orden'] }
  if (rengEscena === 'equilibrio') {
    const rengEsp = rengEspeciesDe(rengEntradas)
    if (!rengEsp) return { ok: false, diagnostico: `La reacción «${String(rengEntradas['reaccion'])}» no está en el modelo (disponibles: ${RENG_PRESETS_EQ.map((rengP) => rengP.id).join(', ')}).`, campos: ['reaccion'] }
    const rengQuien = rengEntradas['quien']
    if (rengQuien !== undefined && (!Number.isInteger(rengQuien) || Number(rengQuien) >= rengEsp.length)) return { ok: false, diagnostico: `La especie perturbada debe ser un índice entre 0 y ${rengEsp.length - 1} para esta reacción.`, campos: ['quien'] }
    const rengA = rengAnalizarEquilibrio(rengEsp, Number(rengEntradas['K']))
    if (rengA.tipo === 'indeterminado') return { ok: false, diagnostico: rengA.motivo, campos: [] }
  }
  if (rengEscena === 'isomeros') {
    try {
      rengCompararIsomerosEntradas(rengEntradas)
    } catch (rengE) {
      if (rengE instanceof RangeError) return { ok: false, diagnostico: rengE.message.replace(/^iso-[a-z-]+: /, ''), campos: [] }
      throw rengE
    }
  }
  if (rengEscena === 'electroquimica') {
    try {
      rengAnalizarCeldaEntradas(rengEntradas)
    } catch (rengE) {
      if (rengE instanceof RangeError) return { ok: false, diagnostico: rengE.message, campos: [] }
      throw rengE
    }
  }
  if (rengEscena === 'solubilidad') {
    try {
      rengAnalizarSolubilidadEntradas(rengEntradas)
    } catch (rengE) {
      if (rengE instanceof RangeError) return { ok: false, diagnostico: rengE.message, campos: [] }
      throw rengE
    }
  }
  if (rengEscena === 'colorimetria') {
    try {
      rengCalibrarColorimetria(rengLeerEntradaColorimetria(rengEntradas))
    } catch (rengE) {
      if (rengE instanceof RangeError) return { ok: false, diagnostico: rengE.message, campos: [] }
      throw rengE
    }
  }
  if (rengEscena === 'dilucion') {
    try {
      rengDiluir({ c1: Number(rengEntradas['c1']), Va: Number(rengEntradas['Va']), Vf: Number(rengEntradas['Vf']), modo: Number(rengEntradas['modo']) as RengModoDilucion, Vdisp: Number(rengEntradas['Vdisp']) })
    } catch (rengE) {
      if (rengE instanceof RangeError) return { ok: false, diagnostico: rengE.message, campos: [] }
      throw rengE
    }
  }
  if (rengEscena === 'termo') {
    const rengR = RENG_REACCIONES_TERMO.find((rengX) => rengX.id === rengEntradas['reaccion'])
    if (!rengR) return { ok: false, diagnostico: `La reacción «${String(rengEntradas['reaccion'])}» no está en el modelo (disponibles: ${RENG_REACCIONES_TERMO.map((rengX) => rengX.id).join(', ')}).`, campos: ['reaccion'] }
    const rengT = Number(rengEntradas['T'])
    if ([...rengR.r.reactivos, ...rengR.r.productos].some((rengX) => rengDatoTermo(rengX.id).fase === 'l') && (rengT < 273.15 || rengT > 373.15)) {
      rengAvisos.push(`A ${rengFmt(rengT)} K el agua o el etanol líquidos no existen tal cual: el resultado es una extrapolación de los datos a 298 K.`)
    }
  }
  return { ok: true, entradas: rengEntradas, avisos: rengAvisos }
}

export function rengPHAcidoSim(rengIdAcido: string, rengC: number): number {
  const rengAcido = RENG_ACIDOS.find((rengA) => rengA.id === rengIdAcido)
  if (!rengAcido) throw new RangeError(`ácido desconocido: ${rengIdAcido}`)
  return rengPH(rengConcentracionH(rengC, 10 ** -rengAcido.pKa))
}

export function rengPHValoracionSim(rengIdAcido: string, rengCa: number, rengVaMl: number, rengCb: number, rengVbMl: number): number {
  const rengAcido = RENG_ACIDOS.find((rengA) => rengA.id === rengIdAcido)
  if (!rengAcido) throw new RangeError(`ácido desconocido: ${rengIdAcido}`)
  const rengVt = rengVaMl + rengVbMl
  return rengPH(rengConcentracionH((rengCa * rengVaMl) / rengVt, 10 ** -rengAcido.pKa, (rengCb * rengVbMl) / rengVt))
}

export function rengCalcularEscena(rengEscena: RengEscena, rengCrudas: RengEntradasSim): Record<string, number> {
  const rengV = rengValidarEntradasSim(rengEscena, rengCrudas)
  if (!rengV.ok) throw new RangeError(rengV.diagnostico)
  const rengE = rengV.entradas
  switch (rengEscena) {
    case 'acidobase': {
      const rengSal: Record<string, number> = { pH: rengPHAcidoSim(String(rengE['acido']), Number(rengE['C'])), Veq: rengVolumenEquivalencia(Number(rengE['C']), Number(rengE['Va']), Number(rengE['Cb'])) }
      if (rengE['Vb'] !== undefined) rengSal['pHVb'] = rengPHValoracionSim(String(rengE['acido']), Number(rengE['C']), Number(rengE['Va']), Number(rengE['Cb']), Number(rengE['Vb']))
      return rengSal
    }
    case 'mezcla': {
      const rengR = rengResolverMezclaAcidoBase({ acido: rengE['acido'] as 'hcl' | 'acetico', concentracionAcido: Number(rengE['cAcido']), volumenAcidoMl: Number(rengE['VAcido']), concentracionBase: Number(rengE['cBase']), volumenBaseMl: Number(rengE['VBase']) })
      return { pH: rengR.pH, Veq: rengR.volumenEquivalenciaMl ?? NaN, Vtotal: rengR.volumenTotalMl }
    }
    case 'cinetica': {
      const rengO = Number(rengE['orden']) as RengOrden
      const rengSal: Record<string, number> = { t12: rengVidaMedia(rengO, Number(rengE['A0']), Number(rengE['k'])) }
      if (rengE['t'] !== undefined) rengSal['At'] = rengConcentracion(rengO, Number(rengE['A0']), Number(rengE['k']), Number(rengE['t']))
      return rengSal
    }
    case 'equilibrio': {
      const rengEsp = rengEspeciesDe(rengE)!
      const rengK = Number(rengE['K'])
      const rengA = rengAnalizarEquilibrio(rengEsp, rengK)
      if (rengA.tipo !== 'equilibrio') throw new RangeError(rengA.motivo)
      const rengSal: Record<string, number> = { xi: rengA.xi, Q0: rengA.Q0, sentido: rengA.sentido }
      rengA.c.forEach((rengC, rengI) => (rengSal[`c_${rengI}`] = rengC))
      return rengSal
    }
    case 'termo': {
      const rengR = RENG_REACCIONES_TERMO.find((rengX) => rengX.id === rengE['reaccion'])!
      const rengDH = rengEntalpiaReaccion(rengR.r)
      const rengDS = rengEntropiaReaccion(rengR.r)
      const rengT = Number(rengE['T'])
      const rengSal: Record<string, number> = { dH: rengDH, q: rengCalorLiberado(rengDH, rengR.r.reactivos[0]!.nu, Number(rengE['mol'] ?? 1)) }
      if (rengDS !== null) {
        const rengDG = rengEnergiaLibre(rengDH, rengDS, rengT)
        rengSal['dS'] = rengDS
        rengSal['dG'] = rengDG
        rengSal['K'] = rengConstanteDeG(rengDG, rengT)
      }
      if (rengSal['q']! > 0) rengSal['dT'] = rengAumentoTemperaturaAgua(rengSal['q']!, Number(rengE['masaAgua'] ?? 1000))
      return rengSal
    }
    case 'isomeros':
      return rengSalidasIso(rengCompararIsomerosEntradas(rengE).comparacion)
    case 'electroquimica': {
      const rengR = rengAnalizarCeldaEntradas(rengE)
      const rengSal: Record<string, number> = { E0: rengR.E0Celda, n: rengR.nCelda, dG0: rengR.deltaG0 / 1000, lnK: rengR.lnK, esp: rengR.enEquilibrio ? 0 : rengR.espontanea ? 1 : -1, inv: rengR.catodoReal === 'invertido' ? 1 : 0, coef: rengR.coeficienteNernst }
      if (rengR.K !== null) rengSal['K'] = rengR.K
      if (rengR.E !== null && rengR.Q !== null && rengR.deltaG !== null) {
        rengSal['E'] = rengR.E
        rengSal['Q'] = rengR.Q
        rengSal['dG'] = rengR.deltaG / 1000
      }
      return rengSal
    }
    case 'solubilidad': {
      const rengR = rengAnalizarSolubilidadEntradas(rengE)
      return { q: rengR.q, ksp: rengR.ksp, ver: rengR.veredicto === 'disuelve' ? 1 : rengR.veredicto === 'equilibrio' ? 0 : -1, s0: rengR.s0, s: rengR.s, razon: rengR.razon, x: rengR.precipitado, d: rengR.disuelto, sol: rengR.solidoFinal, cMf: rengR.cMFinal, cAf: rengR.cAFinal, qf: rengR.qFinal, I: rengR.fuerzaIonica }
    }
    case 'colorimetria': {
      const rengC = rengCalibrarColorimetria(rengLeerEntradaColorimetria(rengE))
      const rengSal: Record<string, number> = { Ablanco: rengC.blancoMedio, m: rengC.m, b: rengC.b, r2: rengC.r2, sr: rengC.sr, n: rengC.n, Cmin: rengC.cMin, Cmax: rengC.cMax, Amin: rengC.aMin, Amax: rengC.aMax, Acorr: rengC.muestraCorr, interp: rengC.estado === 'interpolada' ? 1 : 0 }
      if (rengC.x0 !== null && rengC.u !== null && rengC.x0SinBlanco !== null) {
        rengSal['x0'] = rengC.x0
        rengSal['u'] = rengC.u
        rengSal['x0raw'] = rengC.x0SinBlanco
      }
      return rengSal
    }
    case 'dilucion': {
      const rengD = rengDiluir({ c1: Number(rengE['c1']), Va: Number(rengE['Va']), Vf: Number(rengE['Vf']), modo: Number(rengE['modo']) as RengModoDilucion, Vdisp: Number(rengE['Vdisp']) })
      const rengSal: Record<string, number> = { n: rengD.molesFinales, c2: rengD.concentracionFinal, F: rengD.factor, Vdis: rengD.volumenDisolventeMl, Vtotal: rengD.volumenTotalMl }
      if (rengE['c2obj'] !== undefined) rengSal['desv'] = (100 * (rengD.concentracionFinal - Number(rengE['c2obj']))) / Number(rengE['c2obj'])
      return rengSal
    }
  }
}

export function rengSimulacionDeEjercicio(rengE: RengEjercicio): RengTransferenciaSimulacion | undefined {
  if (rengE.simulacion) return rengE.simulacion
  if (rengE.familia === 'analitica.calibracion' && rengE.tabla) {
    const rengY0 = rengE.datos.find((rengD) => rengD.clave === 'y0')?.valor
    if (typeof rengY0 !== 'number' || rengE.tabla.filas.length > RENG_LIMITES_COLORIMETRIA.patronesMax) return undefined
    const rengEntradas: Record<string, number> = { b0: 0, As: rengY0, rep: 1 }
    for (const [rengI, rengF] of rengE.tabla.filas.entries()) {
      if (typeof rengF[0] !== 'number' || typeof rengF[1] !== 'number') return undefined
      rengEntradas[`c${rengI}`] = rengF[0]
      rengEntradas[`a${rengI}`] = rengF[1]
    }
    return { escena: 'colorimetria', entradas: rengEntradas }
  }
  if (rengE.familia === 'analitica.dilucion' && rengE.nivel === 'preuniversitario') {
    const rengDato = (rengClave: string): number | undefined => {
      const rengV = rengE.datos.find((rengD) => rengD.clave === rengClave)?.valor
      return typeof rengV === 'number' ? rengV : undefined
    }
    const rengC1 = rengDato('C1')
    const rengVf = rengDato('V2')
    const rengC2 = rengDato('C2')
    if (rengC1 === undefined || rengVf === undefined) return undefined
    return { escena: 'dilucion', entradas: { c1: rengC1, Vf: rengVf, modo: 0, ...(rengC2 === undefined ? {} : { c2obj: rengC2 }) } }
  }
  return undefined
}

export type RengTransferencia = { ok: true; escena: RengEscena; entradas: Record<string, number | string>; avisos: string[] } | { ok: false; escena: RengEscena; diagnostico: string }

export function rengTransferirEjercicio(rengT: { escena: RengEscena; entradas: RengEntradasSim }): RengTransferencia {
  const rengV = rengValidarEntradasSim(rengT.escena, rengT.entradas)
  if (!rengV.ok) return { ok: false, escena: rengT.escena, diagnostico: rengV.diagnostico }
  return { ok: true, escena: rengT.escena, entradas: { ...rengV.entradas }, avisos: [...rengV.avisos] }
}

export function rengDesplazamientoEquilibrio(rengE: RengEntradasSim, rengQuien: number, rengDelta: number): { antes: number[]; despues: number[]; completo: ReturnType<typeof rengPerturbar> } {
  const rengV = rengValidarEntradasSim('equilibrio', rengE)
  if (!rengV.ok) throw new RangeError(rengV.diagnostico)
  const rengR = rengPerturbar(rengEspeciesDe(rengV.entradas)!, Number(rengV.entradas['K']), rengQuien, rengDelta)
  return { antes: rengR.antes.c, despues: rengR.despues.c, completo: rengR }
}
