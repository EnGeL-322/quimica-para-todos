import { rengPorSimbolo, type RengCategoria } from '../../tabla-periodica/data'
import { RENG_COMPUESTOS_BINARIOS, RENG_ESTADOS_COMUNES, RENG_FUENTE_ESTADOS, type RengCompuestoConocido } from './compuestosBinarios'
import { rengElectronegatividad, rengTipoPorDiferencia } from './electronegatividad'
import { rengAnalizarFormula } from './formula'

export type RengTipoConstructor = 'ionico' | 'covalente-polar' | 'covalente-apolar' | 'metalico' | 'ninguno'

export interface RengPropuesta {
  formula: string
  estados: Array<{ el: string; ox: number }>
  conocido: boolean
  nombre?: string
  nota?: string
  fuente?: string
}

export interface RengResultadoConstructor {
  a: string
  b: string
  tipo: RengTipoConstructor
  titulo: string
  razonamiento: string[]
  propuestas: RengPropuesta[]
  otrosConocidos: RengCompuestoConocido[]
  avisos: string[]
  secuencia: string | null
}

type RengClase = 'metal' | 'no-metal' | 'metaloide' | 'gas-noble'
const RENG_METALES: RengCategoria[] = ['alcalino', 'alcalinoterreo', 'transicion', 'postransicion', 'lantanido', 'actinido']

export function rengClase(rengSimbolo: string): RengClase {
  const rengC = rengPorSimbolo.get(rengSimbolo)?.categoria
  if (!rengC) throw new Error(`Elemento desconocido: «${rengSimbolo}».`)
  if (RENG_METALES.includes(rengC)) return 'metal'
  if (rengC === 'metaloide') return 'metaloide'
  if (rengC === 'gas-noble') return 'gas-noble'
  return 'no-metal'
}

const RENG_NOMBRE_CLASE: Record<RengClase, string> = { metal: 'metal', 'no-metal': 'no metal', metaloide: 'metaloide', 'gas-noble': 'gas noble' }
const rengNombre = (rengS: string): string => rengPorSimbolo.get(rengS)?.nombre ?? rengS
const rengComa = (rengX: number): string => rengX.toFixed(2).replace('.', ',')
const rengMcd = (rengA: number, rengB: number): number => (rengB === 0 ? Math.abs(rengA) : rengMcd(rengB, rengA % rengB))
const rengSigno = (rengN: number): string => (rengN > 0 ? `+${rengN}` : `−${Math.abs(rengN)}`)

function rengProporcion(rengFormula: string, rengA: string, rengB: string): string | null {
  const rengAt = rengAnalizarFormula(rengFormula).atomos
  if (rengAt.size !== 2 || !rengAt.has(rengA) || !rengAt.has(rengB)) return null
  const rengNa = rengAt.get(rengA)!
  const rengNb = rengAt.get(rengB)!
  const rengG = rengMcd(rengNa, rengNb)
  return `${rengNa / rengG}:${rengNb / rengG}`
}

const rengConocidosDe = (rengA: string, rengB: string): RengCompuestoConocido[] => RENG_COMPUESTOS_BINARIOS.filter((rengC) => rengProporcion(rengC.formula, rengA, rengB) !== null)

const RENG_SECUENCIA_DE: Record<string, string> = {
  NaCl: 'nacl', MgO: 'mgo', CaF2: 'caf2', HCl: 'hcl', H2O: 'h2o', H2: 'h2', Cl2: 'cl2', O2: 'o2', N2: 'n2', Na: 'na', Cu: 'cu', Fe: 'fe'
}

const RENG_DIATOMICOS = new Set(['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'])

export function rengCombinar(rengA: string, rengB: string): RengResultadoConstructor {
  const rengCa = rengClase(rengA)
  const rengCb = rengClase(rengB)
  const rengRazonamiento: string[] = [`${rengNombre(rengA)} (${rengA}) es un ${RENG_NOMBRE_CLASE[rengCa]}; ${rengNombre(rengB)} (${rengB}) es un ${RENG_NOMBRE_CLASE[rengCb]}.`]
  const rengAvisos: string[] = []
  const rengBase = { a: rengA, b: rengB, propuestas: [] as RengPropuesta[], otrosConocidos: [] as RengCompuestoConocido[], avisos: rengAvisos }

  if (rengCa === 'gas-noble' || rengCb === 'gas-noble') {
    const rengConocidos = rengA === rengB ? [] : rengConocidosDe(rengA, rengB)
    if (rengConocidos.length) {
      rengRazonamiento.push(
        'Los gases nobles tienen la capa de valencia completa y casi no reaccionan. Los más pesados (Kr y Xe) tienen sus electrones externos lejos del núcleo y pueden compartirlos con los elementos más electronegativos (F y O).'
      )
      const rengG = rengCa === 'gas-noble' ? rengA : rengB
      const rengOtro = rengG === rengA ? rengB : rengA
      const rengDx = Math.abs((rengElectronegatividad(rengG) ?? 0) - (rengElectronegatividad(rengOtro) ?? 0))
      rengRazonamiento.push(`Δχ = ${rengComa(rengDx)}: enlaces covalentes polares.`)
      return {
        ...rengBase,
        tipo: 'covalente-polar',
        titulo: `${rengNombre(rengG)} y ${rengNombre(rengOtro)} sí forman compuestos`,
        razonamiento: rengRazonamiento,
        propuestas: rengConocidos.map((rengK) => ({ formula: rengK.formula, estados: [], conocido: true, nombre: rengK.nombre, nota: rengK.nota, fuente: rengK.fuente })),
        secuencia: null
      }
    }
    const rengG = rengCa === 'gas-noble' ? rengA : rengB
    if (rengG === 'He' || rengG === 'Ne' || (rengA === rengB && rengCa === 'gas-noble')) {
      rengRazonamiento.push(
        rengA === rengB
          ? `${rengNombre(rengG)} es un gas monoatómico: sus átomos no se unen entre sí (solo hay fuerzas de London muy débiles).`
          : 'El helio y el neón tienen la capa de valencia completa y sus electrones muy sujetos al núcleo: no se conoce ningún compuesto neutro estable de ninguno de los dos.'
      )
    } else {
      rengRazonamiento.push(`${rengNombre(rengG)} tiene la capa de valencia completa. No hay ningún compuesto estable conocido de ${rengNombre(rengG)} con ${rengNombre(rengG === rengA ? rengB : rengA)} en la lista verificada de la app.`)
    }
    return { ...rengBase, tipo: 'ninguno', titulo: 'No forman compuestos', razonamiento: rengRazonamiento, secuencia: null }
  }

  if (rengCa === 'metal' && rengCb === 'metal') {
    if (rengA === rengB) {
      rengRazonamiento.push(`Los átomos de ${rengNombre(rengA)} ceden sus electrones externos a un «mar» común: enlace metálico. Es un elemento, no un compuesto.`)
      return { ...rengBase, tipo: 'metalico', titulo: `${rengNombre(rengA)}: enlace metálico`, razonamiento: rengRazonamiento, secuencia: RENG_SECUENCIA_DE[rengA] ?? null }
    }
    rengRazonamiento.push(
      'Dos metales se mezclan compartiendo un mar de electrones común: forman una aleación (enlace metálico), que puede tener cualquier proporción. No es un compuesto con fórmula fija.'
    )
    rengAvisos.push('Algunas parejas de metales forman también compuestos intermetálicos de proporción fija; la app no los predice.')
    return { ...rengBase, tipo: 'metalico', titulo: 'Metálico: aleación, no un compuesto con fórmula fija', razonamiento: rengRazonamiento, secuencia: null }
  }

  if (rengA === rengB) {
    rengRazonamiento.push(`Dos átomos iguales atraen los electrones con la misma fuerza (Δχ = 0): enlace covalente apolar.`)
    const rengMolecula = RENG_DIATOMICOS.has(rengA) ? `${rengA}2` : null
    rengRazonamiento.push(rengMolecula ? `La sustancia elemental está formada por moléculas ${rengMolecula}.` : `Forma una sustancia elemental (p. ej. redes o moléculas de varios átomos), no un compuesto.`)
    return {
      ...rengBase,
      tipo: 'covalente-apolar',
      titulo: 'Covalente apolar (sustancia elemental)',
      razonamiento: rengRazonamiento,
      propuestas: rengMolecula ? [{ formula: rengMolecula, estados: [{ el: rengA, ox: 0 }], conocido: true, nota: 'Sustancia elemental' }] : [],
      secuencia: rengMolecula ? (RENG_SECUENCIA_DE[rengMolecula] ?? null) : null
    }
  }

  const rengXa = rengElectronegatividad(rengA)
  const rengXb = rengElectronegatividad(rengB)
  if (rengXa === null || rengXb === null) {
    rengRazonamiento.push('Falta la electronegatividad de alguno de los dos elementos: la app no puede razonar el tipo de enlace.')
    return { ...rengBase, tipo: 'ninguno', titulo: 'Sin datos suficientes', razonamiento: rengRazonamiento, secuencia: null }
  }
  const rengDx = Math.abs(rengXa - rengXb)
  rengRazonamiento.push(`Electronegatividades (Pauling): χ(${rengA}) = ${rengComa(rengXa)}, χ(${rengB}) = ${rengComa(rengXb)}. Δχ = ${rengComa(rengDx)}.`)
  const rengHayMetal = rengCa === 'metal' || rengCb === 'metal'
  let rengTipo: RengTipoConstructor
  const rengT = rengTipoPorDiferencia(rengDx)
  const rengMuyPolarSinMetal = rengT === 'ionico' && !rengHayMetal
  if (rengT === 'ionico' && rengHayMetal) {
    rengTipo = 'ionico'
    rengRazonamiento.push('Δχ > 1,7 y hay un metal: el más electronegativo se queda los electrones → enlace iónico.')
  } else if (rengMuyPolarSinMetal) {
    rengTipo = 'covalente-polar'
    rengRazonamiento.push(
      'Δχ > 1,7, pero no hay ningún metal: aquí la regla de Δχ falla. Sin un metal que ceda electrones no se forman iones; el enlace es covalente muy polar. El ejemplo clásico es el HF (Δχ = 1,78), una molécula covalente.'
    )
  } else if (rengT === 'polar') {
    rengTipo = 'covalente-polar'
    rengRazonamiento.push(
      rengHayMetal
        ? `Hay un metal, pero Δχ ≤ 1,7: es un caso intermedio. Los libros suelen llamar iónicos a los compuestos de metal y no metal, pero aquí el enlace tiene también un carácter covalente importante.`
        : `0,4 ≤ Δχ ≤ 1,7: comparten electrones, pero no por igual → covalente polar.`
    )
  } else {
    rengTipo = 'covalente-apolar'
    rengRazonamiento.push('Δχ < 0,4: comparten los electrones casi por igual → covalente (casi) apolar.')
  }
  rengAvisos.push('La regla de Δχ es orientativa: marca una tendencia, no una frontera exacta.')

  const [rengPos, rengNeg] = rengXa <= rengXb ? [rengA, rengB] : [rengB, rengA]
  const rengEstPos = (RENG_ESTADOS_COMUNES[rengPos] ?? []).filter((rengX) => rengX > 0)
  const rengEstNeg = (RENG_ESTADOS_COMUNES[rengNeg] ?? []).filter((rengX) => rengX < 0)
  const rengConocidos = rengConocidosDe(rengA, rengB)
  if (!RENG_ESTADOS_COMUNES[rengPos] || !RENG_ESTADOS_COMUNES[rengNeg]) {
    rengRazonamiento.push(`La app no tiene los estados de oxidación comunes de ${!RENG_ESTADOS_COMUNES[rengPos] ? rengPos : rengNeg}; no predice una fórmula.`)
    return { ...rengBase, tipo: rengTipo, titulo: rengTitulo(rengTipo), razonamiento: rengRazonamiento, otrosConocidos: rengConocidos, secuencia: null }
  }
  if (!rengEstPos.length || !rengEstNeg.length) {
    rengRazonamiento.push(
      !rengEstNeg.length
        ? `${rengNombre(rengNeg)} no tiene un estado de oxidación negativo común: la regla de cruzar cargas no da un compuesto.`
        : `${rengNombre(rengPos)} no tiene un estado de oxidación positivo común: la regla de cruzar cargas no da un compuesto.`
    )
    return { ...rengBase, tipo: rengTipo, titulo: rengTitulo(rengTipo), razonamiento: rengRazonamiento, otrosConocidos: rengConocidos, secuencia: null }
  }
  const rengN = Math.min(...rengEstNeg)
  rengRazonamiento.push(
    `${rengNeg} es el más electronegativo: toma su estado negativo común (${rengSigno(rengN)}). ${rengPos} usa sus estados positivos comunes (${rengEstPos.map(rengSigno).join(', ')}). Se cruzan las cargas y se simplifica.`
  )
  const rengPropuestas: RengPropuesta[] = rengEstPos.map((rengP) => {
    const rengG = rengMcd(rengP, -rengN)
    const rengNPos = -rengN / rengG
    const rengNNeg = rengP / rengG
    const rengProp = `${rengNPos}:${rengNNeg}`
    const rengK = rengConocidos.find((rengC) => rengProporcion(rengC.formula, rengPos, rengNeg) === rengProp)
    const rengFormula = rengK?.formula ?? `${rengPos}${rengNPos === 1 ? '' : rengNPos}${rengNeg}${rengNNeg === 1 ? '' : rengNNeg}`
    return { formula: rengFormula, estados: [{ el: rengPos, ox: rengP }, { el: rengNeg, ox: rengN }], conocido: Boolean(rengK), nombre: rengK?.nombre, nota: rengK?.nota, fuente: rengK?.fuente }
  })
  const rengUsados = new Set(rengPropuestas.map((rengP) => rengP.formula))
  const rengOtros = rengConocidos.filter((rengC) => !rengUsados.has(rengC.formula))
  if (rengPropuestas.some((rengP) => !rengP.conocido)) rengRazonamiento.push('Las fórmulas marcadas «predicha, no verificada» salen de la regla pero no están en la lista de compuestos conocidos.')
  const rengPrimera = rengPropuestas.find((rengP) => rengP.conocido)
  const rengIntermedio = rengTipo === 'covalente-polar' && rengHayMetal
  return {
    ...rengBase,
    tipo: rengTipo,
    titulo: rengIntermedio ? 'Intermedio: iónico con carácter covalente' : rengMuyPolarSinMetal ? 'Covalente muy polar' : rengTitulo(rengTipo),
    razonamiento: rengRazonamiento,
    propuestas: rengPropuestas,
    otrosConocidos: rengOtros,
    secuencia: rengPrimera ? (RENG_SECUENCIA_DE[rengPrimera.formula] ?? null) : null
  }
}

function rengTitulo(rengT: RengTipoConstructor): string {
  return { ionico: 'Enlace iónico', 'covalente-polar': 'Enlace covalente polar', 'covalente-apolar': 'Enlace covalente apolar', metalico: 'Enlace metálico', ninguno: 'No forman compuestos' }[rengT]
}

export const RENG_FUENTES_CONSTRUCTOR = [RENG_FUENTE_ESTADOS]
