import { rengAjustarEcuacion } from './ajuste'
import { RENG_COMPUESTOS_BINARIOS } from './compuestosBinarios'
import { rengAnalizarFormula, rengBonita, rengFormulaHill } from './formula'
import { rengEscribirFormula, rengEstadosDe, type RengCompuesto } from './nomenclatura'

export interface RengCruce {
  cation: string
  anion: string
  cargaCat: number
  cargaAn: number
  cruzadoCat: number
  cruzadoAn: number
  finalCat: number
  finalAn: number
}

export interface RengPasoFormulacion {
  id: 'identificar' | 'iones' | 'cruzar' | 'simplificar' | 'comprobar' | 'oxido-agua' | 'oxoanion' | 'hidrato' | 'unico'
  titulo: string
  texto: string
  notacion: string
  cruce?: RengCruce
  duracion: number
}

const rengSigno = (rengN: number): string => (rengN > 0 ? `+${rengN}` : `−${Math.abs(rengN)}`)
const rengIon = (rengUnidad: string, rengCarga: number): string => `${rengUnidad}^${Math.abs(rengCarga) === 1 ? '' : Math.abs(rengCarga)}${rengCarga > 0 ? '+' : '-'}`
const rengMcd = (rengA: number, rengB: number): number => (rengB === 0 ? Math.abs(rengA) : rengMcd(rengB, rengA % rengB))
const rengNombreDe = (rengK: RengCompuesto): string => rengK.nombres.principal

function rengPasoComprobar(rengK: RengCompuesto, rengFormula: string): RengPasoFormulacion {
  const rengC = rengK.cation!
  const rengA = rengK.anion!
  const rengSuma = `${rengK.nCat}·(${rengSigno(rengC.carga)}) + ${rengK.nAn}·(${rengSigno(rengA.carga)}) = ${rengK.nCat * rengC.carga + rengK.nAn * rengA.carga}`
  return {
    id: 'comprobar',
    titulo: 'Comprobar: carga total 0',
    texto: `Las cargas positivas y negativas se compensan: ${rengSuma}. La fórmula es neutra.`,
    notacion: rengFormula,
    duracion: 2.5
  }
}

const rengOxidoConocido = (rengF: string): boolean => {
  const rengClave = rengFormulaHill(rengAnalizarFormula(rengF).atomos)
  return RENG_COMPUESTOS_BINARIOS.some((rengC) => {
    const rengAt = rengAnalizarFormula(rengC.formula).atomos
    const rengG = [...rengAt.values()].reduce(rengMcd)
    const rengRed = new Map([...rengAt].map(([rengE, rengN]) => [rengE, rengN / rengG]))
    return rengFormulaHill(rengRed) === rengClave || rengFormulaHill(rengAt) === rengClave
  })
}

function rengPasosOxoacido(rengK: RengCompuesto): RengPasoFormulacion[] {
  const rengA = rengK.anion!
  const RENG_E = rengA.central
  const rengEst = rengEstadosDe(rengK)
  const rengPasos: RengPasoFormulacion[] = [
    {
      id: 'identificar',
      titulo: 'Identificar el no metal y su estado',
      texto: `El elemento central es ${RENG_E} con número de oxidación ${rengSigno(rengA.ox)}; el oxígeno, −2, y el hidrógeno, +1 (${rengEst.map((rengE) => `${rengE.el} ${rengSigno(rengE.ox)}`).join(', ')}).`,
      notacion: `${RENG_E} + O + H`,
      duracion: 3
    }
  ]
  const rengG = rengMcd(rengA.ox, 2)
  const rengOxido = `${RENG_E}${2 / rengG === 1 ? '' : 2 / rengG}O${rengA.ox / rengG === 1 ? '' : rengA.ox / rengG}`
  let rengEcuacion: string | null = null
  try {
    rengEcuacion = rengAjustarEcuacion(`${rengOxido} + H2O -> ${rengK.formula}`).texto
  } catch {
    rengEcuacion = null
  }
  if (rengEcuacion && rengA.unidad !== 'S2O3') {
    const rengConocido = rengOxidoConocido(rengOxido)
    rengPasos.push({
      id: 'oxido-agua',
      titulo: 'Óxido ácido + agua → oxoácido',
      texto: `El óxido de ${RENG_E} con el mismo número de oxidación (${rengBonita(rengOxido)}) reacciona con agua y da el oxoácido.${rengConocido ? '' : ` Ojo: ${rengBonita(rengOxido)} no está en la lista de compuestos verificados de la app; aquí es solo un paso formal para deducir la fórmula.`}`,
      notacion: rengEcuacion.replace('→', '->'),
      duracion: 4
    })
  } else {
    rengPasos.push({
      id: 'oxido-agua',
      titulo: 'Fórmula del oxoácido',
      texto: `Este oxoácido no se deduce de forma sencilla de un óxido + agua; su fórmula se aprende con su anión (${rengBonita(rengIon(rengA.unidad, rengA.carga))}): ${Math.abs(rengA.carga)} H⁺ por cada anión.`,
      notacion: `${Math.abs(rengA.carga)}H^+ + ${rengIon(rengA.unidad, rengA.carga)} -> ${rengK.formula}`,
      duracion: 4
    })
  }
  const rengSuma = `${rengK.nCat}·(+1) + 1·(${rengSigno(rengA.carga)}) = 0`
  rengPasos.push({ id: 'comprobar', titulo: 'Comprobar: carga total 0', texto: `${rengSuma}. Nombre: ${rengNombreDe(rengK)}.`, notacion: rengK.formula, duracion: 2.5 })
  return rengPasos
}

export function rengPasosFormulacion(rengK: RengCompuesto): RengPasoFormulacion[] {
  if (rengK.funcion === 'cation' || rengK.funcion === 'anion' || rengK.funcion === 'oxoanion') {
    const rengEst = rengEstadosDe(rengK)
    return [
      {
        id: 'unico',
        titulo: 'Un ion',
        texto: `Es un ion: una especie con carga ${rengK.carga > 0 ? 'positiva' : 'negativa'} (${rengSigno(rengK.carga)}). Números de oxidación: ${rengEst.map((rengE) => `${rengE.el} ${rengSigno(rengE.ox)}`).join(', ')}.`,
        notacion: rengK.formula,
        duracion: 3
      }
    ]
  }
  if (!rengK.cation || !rengK.anion) {
    return [
      {
        id: 'unico',
        titulo: rengK.funcion === 'oxido-mixto' ? 'Un óxido mixto' : 'Un hidruro de no metal',
        texto:
          rengK.funcion === 'oxido-mixto'
            ? 'No se formula cruzando las cargas de un solo catión: contiene el metal en dos estados de oxidación a la vez.'
            : 'Los hidruros de los no metales del grupo 14 y 15 se formulan escribiendo el no metal y tantos H como su valencia (NH₃, CH₄…).',
        notacion: rengK.formula,
        duracion: 3
      }
    ]
  }
  if (rengK.funcion === 'oxoacido') return rengPasosOxoacido(rengK)
  const rengC = rengK.cation
  const rengA = rengK.anion
  const rengFormulaBase = rengK.formula.split('·')[0]!
  const rengPasos: RengPasoFormulacion[] = []
  if (rengK.funcion === 'oxisal' && rengA.acido) {
    const rengNH = Math.abs(rengA.carga)
    const rengAcido = `H${rengNH === 1 ? '' : rengNH}${rengA.unidad}`
    rengPasos.push({
      id: 'oxoanion',
      titulo: 'Del oxoácido al oxoanión',
      texto: `El ${rengA.acido} (${rengBonita(rengAcido)}) pierde sus ${rengNH === 1 ? 'H⁺' : `${rengNH} H⁺`} y queda el anión ${rengA.sal} con carga ${rengSigno(rengA.carga)}.`,
      notacion: `${rengAcido} -> ${rengIon(rengA.unidad, rengA.carga)} + ${rengNH === 1 ? '' : rengNH}H^+`,
      duracion: 3.5
    })
  }
  const rengEst = rengEstadosDe(rengK)
  rengPasos.push({
    id: 'identificar',
    titulo: 'Identificar los elementos y sus estados',
    texto: `${rengC.tipo === 'hidrogeno' ? 'El hidrógeno' : `El catión ${rengC.stock}`} aporta carga ${rengSigno(rengC.carga)}; el anión ${rengA.sal}, carga ${rengSigno(rengA.carga)}. Números de oxidación: ${rengEst.map((rengE) => `${rengE.el} ${rengSigno(rengE.ox)}`).join(', ')}.`,
    notacion: `${rengC.unidad} + ${rengA.unidad}`,
    duracion: 3
  })
  rengPasos.push({
    id: 'iones',
    titulo: 'Escribir los iones',
    texto: `Se escribe primero el catión y después el anión, cada uno con su carga.${rengA.tipo === 'peroxido' ? ' El peróxido O₂²⁻ es una unidad de dos oxígenos: nunca se separa.' : ''}${rengC.unidad === 'Hg2' ? ' El mercurio(I) existe como Hg₂²⁺, dos átomos unidos: es una unidad.' : ''}`,
    notacion: `${rengIon(rengC.unidad, rengC.carga)} + ${rengIon(rengA.unidad, rengA.carga)}`,
    duracion: 3
  })
  const rengCruzadoCat = Math.abs(rengA.carga)
  const rengCruzadoAn = rengC.carga
  const rengSinSimplificar = rengEscribirFormula(rengC, rengA, rengCruzadoCat, rengCruzadoAn)
  const rengCruce: RengCruce = { cation: rengC.unidad, anion: rengA.unidad, cargaCat: rengC.carga, cargaAn: rengA.carga, cruzadoCat: rengCruzadoCat, cruzadoAn: rengCruzadoAn, finalCat: rengK.nCat, finalAn: rengK.nAn }
  rengPasos.push({
    id: 'cruzar',
    titulo: 'Cruzar las cargas',
    texto: `La carga de cada ion «salta» como subíndice del otro (sin el signo): ${rengCruzadoCat} para ${rengBonita(rengC.unidad)} y ${rengCruzadoAn} para ${rengBonita(rengA.unidad)}.${rengA.tipo !== 'monoatomico' && rengA.tipo !== 'peroxido' && rengCruzadoAn > 1 ? ' Como el anión tiene varios átomos, va entre paréntesis.' : ''}`,
    notacion: rengSinSimplificar,
    cruce: rengCruce,
    duracion: 4
  })
  const rengG = rengMcd(rengCruzadoCat, rengCruzadoAn)
  rengPasos.push({
    id: 'simplificar',
    titulo: rengG > 1 ? 'Simplificar' : 'Simplificar (no hace falta)',
    texto:
      rengG > 1
        ? `Los dos subíndices se dividen entre ${rengG}: ${rengBonita(rengSinSimplificar)} → ${rengBonita(rengFormulaBase)}.${rengA.tipo === 'peroxido' ? ' Se simplifica la proporción de iones, pero el O₂²⁻ sigue siendo una unidad.' : ''}`
        : `Los subíndices ${rengCruzadoCat} y ${rengCruzadoAn} no tienen divisor común: la fórmula ya es la más sencilla.${rengA.tipo === 'peroxido' ? ' Recuerda: en un peróxido no se simplifica el O₂ (H₂O₂, no HO).' : ''}${rengC.unidad === 'Hg2' ? ' Y el Hg₂ no se simplifica: Hg₂Cl₂, no HgCl.' : ''}`,
    notacion: rengFormulaBase,
    duracion: 3
  })
  rengPasos.push(rengPasoComprobar(rengK, rengFormulaBase))
  if (rengK.agua > 0) {
    rengPasos.push({
      id: 'hidrato',
      titulo: 'Agua de cristalización',
      texto: `En el cristal hay ${rengK.agua} moléculas de agua por cada unidad de sal. Se escriben detrás de un punto.`,
      notacion: rengK.formula,
      duracion: 3
    })
  }
  return rengPasos
}
