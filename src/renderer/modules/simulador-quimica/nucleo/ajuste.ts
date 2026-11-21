import { rengAnalizarFormula, rengBonita, type RengFormula } from './formula'
import { rengAnalizarNotacion } from './notacion'
import { rengEstadosOxidacion, rengTextoEstado } from './oxidacion'
import { rengAEnteros, rengEspacioNulo, rengMcm, rengQ, type RengRacional } from './racional'

export interface RengEcuacionLeida {
  reactivos: string[]
  productos: string[]
}

export function rengLeerEcuacion(rengTexto: string): RengEcuacionLeida {
  if (!rengTexto.trim()) throw new Error('Escribe una ecuación, por ejemplo: H2 + O2 -> H2O')
  const rengN = rengAnalizarNotacion(rengTexto)
  if (!rengN.flecha) throw new Error('La ecuación debe tener exactamente una flecha (->, → o =).')
  return { reactivos: rengN.izquierda.map((rengE) => rengE.formula), productos: rengN.derecha.map((rengE) => rengE.formula) }
}

export interface RengTerminoAjustado {
  entrada: string
  formula: RengFormula
  coef: number
}

export interface RengAjuste {
  reactivos: RengTerminoAjustado[]
  productos: RengTerminoAjustado[]
  texto: string
  comprobacion: Array<{ que: string; izquierda: number; derecha: number }>
}

const rengTermino = (rengT: RengTerminoAjustado): string => `${rengT.coef === 1 ? '' : rengT.coef}${rengT.formula.electron ? 'e⁻' : rengBonita(rengT.entrada)}`

export function rengTextoEcuacion(rengR: RengTerminoAjustado[], rengP: RengTerminoAjustado[], rengFlecha = '→'): string {
  return `${rengR.map(rengTermino).join(' + ')} ${rengFlecha} ${rengP.map(rengTermino).join(' + ')}`
}

export function rengComprobar(rengR: RengTerminoAjustado[], rengP: RengTerminoAjustado[]): RengAjuste['comprobacion'] {
  const rengEls: string[] = []
  for (const rengT of [...rengR, ...rengP]) for (const rengEl of rengT.formula.atomos.keys()) if (!rengEls.includes(rengEl)) rengEls.push(rengEl)
  const rengCuenta = (rengLado: RengTerminoAjustado[], rengEl: string): number => rengLado.reduce((rengA, rengT) => rengA + rengT.coef * (rengT.formula.atomos.get(rengEl) ?? 0), 0)
  const rengFilas = rengEls.map((rengEl) => ({ que: rengEl, izquierda: rengCuenta(rengR, rengEl), derecha: rengCuenta(rengP, rengEl) }))
  const rengCarga = (rengLado: RengTerminoAjustado[]): number => rengLado.reduce((rengA, rengT) => rengA + rengT.coef * rengT.formula.carga, 0)
  if ([...rengR, ...rengP].some((rengT) => rengT.formula.carga !== 0)) rengFilas.push({ que: 'carga', izquierda: rengCarga(rengR), derecha: rengCarga(rengP) })
  return rengFilas
}

function rengBaseConservacion(rengFormulas: RengFormula[], rengSignos: number[], rengExtra: number[][] = []): RengRacional[][] {
  const rengFilas: string[] = []
  for (const rengF of rengFormulas) for (const rengEl of rengF.atomos.keys()) if (!rengFilas.includes(rengEl)) rengFilas.push(rengEl)
  const rengHayCarga = rengFormulas.some((rengF) => rengF.carga !== 0)
  const RENG_M: RengRacional[][] = rengFilas.map((rengEl) => rengFormulas.map((rengF, rengJ) => rengQ((rengF.atomos.get(rengEl) ?? 0) * (rengSignos[rengJ] as number))))
  if (rengHayCarga) RENG_M.push(rengFormulas.map((rengF, rengJ) => rengQ(rengF.carga * (rengSignos[rengJ] as number))))
  for (const rengFila of rengExtra) RENG_M.push(rengFila.map((rengX) => rengQ(rengX)))
  return rengEspacioNulo(RENG_M, rengFormulas.length)
}

function rengLeerEspecies(rengLista: string[]): RengFormula[] {
  return rengLista.map((rengS) => rengAnalizarFormula(rengS))
}

export function rengAjustarEcuacion(rengEntrada: string | RengEcuacionLeida): RengAjuste {
  const rengEc = typeof rengEntrada === 'string' ? rengLeerEcuacion(rengEntrada) : rengEntrada
  const rengFr = rengLeerEspecies(rengEc.reactivos)
  const rengFp = rengLeerEspecies(rengEc.productos)
  const rengTodas = [...rengFr, ...rengFp]
  const rengNombres = [...rengEc.reactivos, ...rengEc.productos]

  const rengEnLado = (rengFs: RengFormula[]): Set<string> => new Set(rengFs.flatMap((rengF) => [...rengF.atomos.keys()]))
  const rengIzq = rengEnLado(rengFr)
  const rengDer = rengEnLado(rengFp)
  for (const rengEl of rengIzq) if (!rengDer.has(rengEl)) throw new Error(`El elemento ${rengEl} aparece en los reactivos pero no en los productos: falta alguna especie.`)
  for (const rengEl of rengDer) if (!rengIzq.has(rengEl)) throw new Error(`El elemento ${rengEl} aparece en los productos pero no en los reactivos: falta alguna especie.`)

  const rengBase = rengBaseConservacion(rengTodas, [...rengFr.map(() => 1), ...rengFp.map(() => -1)])
  if (rengBase.length === 0) throw new Error('No existe ningún ajuste que conserve a la vez todos los elementos y la carga. Revisa las fórmulas.')
  if (rengBase.length > 1) {
    throw new Error(
      `La ecuación no tiene un ajuste único: es la suma de ${rengBase.length} reacciones independientes (hay infinitas combinaciones válidas). ` +
        'Separa las reacciones o, si es redox, usa el método ion-electrón.'
    )
  }
  let rengV = rengAEnteros(rengBase[0] as RengRacional[])
  if (rengV.every((rengX) => rengX <= 0n)) rengV = rengV.map((rengX) => -rengX)
  rengV.forEach((rengX, rengI) => {
    if (rengX === 0n) throw new Error(`«${rengNombres[rengI]}» no participa en la reacción (su coeficiente sale 0). Quítala o revisa las fórmulas.`)
    if (rengX < 0n) throw new Error(`«${rengNombres[rengI]}» debería estar al otro lado de la flecha para que la ecuación se ajuste.`)
  })
  const rengReactivos = rengFr.map((rengF, rengI) => ({ entrada: rengEc.reactivos[rengI] as string, formula: rengF, coef: Number(rengV[rengI]) }))
  const rengProductos = rengFp.map((rengF, rengI) => ({ entrada: rengEc.productos[rengI] as string, formula: rengF, coef: Number(rengV[rengFr.length + rengI]) }))
  return { reactivos: rengReactivos, productos: rengProductos, texto: rengTextoEcuacion(rengReactivos, rengProductos), comprobacion: rengComprobar(rengReactivos, rengProductos) }
}

export type RengMedio = 'acido' | 'basico'

export interface RengSemirreaccion {
  tipo: 'oxidación' | 'reducción'
  texto: string
  esqueleto: string
  electrones: number
  factor: number
  cambios: string[]
}

export interface RengAjusteRedox extends RengAjuste {
  medio: RengMedio
  semirreacciones: RengSemirreaccion[]
  electronesTransferidos: number
  pasos: string[]
}

interface RengEsp {
  entrada: string
  f: RengFormula
}

const RENG_AUX = new Set(['H^+', 'H3O^+', 'OH^-', 'H2O', 'e-'])

function rengClave(rengF: RengFormula): string[] {
  const rengK = [...rengF.atomos.keys()].filter((rengE) => rengE !== 'H' && rengE !== 'O')
  if (rengK.length) return rengK
  return rengF.atomos.has('O') ? ['O'] : ['H']
}

interface RengMitad {
  reactivos: RengEsp[]
  productos: RengEsp[]
}

const rengSoloHO = (rengF: RengFormula): boolean => [...rengF.atomos.keys()].every((rengE) => rengE === 'H' || rengE === 'O')

function rengPareja(rengG: RengMitad, rengMedio: RengMedio): RengEsp | null {
  const rengSola = [...rengG.reactivos, ...rengG.productos]
  if (!rengSola.every((rengE) => rengSoloHO(rengE.f))) return null
  const rengConO = rengSola.some((rengE) => rengE.f.atomos.has('O'))
  const rengTexto = rengConO ? (rengMedio === 'acido' ? 'H2O' : 'OH^-') : rengMedio === 'acido' ? 'H^+' : 'H2O'
  return { entrada: rengTexto, f: rengAnalizarFormula(rengTexto) }
}

function rengSepararSemirreacciones(rengR: RengEsp[], rengP: RengEsp[], rengMedio: RengMedio): RengMitad[] {
  const rengTodas = [...rengR.map((rengE) => ({ e: rengE, lado: 0 })), ...rengP.map((rengE) => ({ e: rengE, lado: 1 }))]
  const rengPadre = rengTodas.map((_, rengI) => rengI)
  const rengRaiz = (rengI: number): number => (rengPadre[rengI] === rengI ? rengI : (rengPadre[rengI] = rengRaiz(rengPadre[rengI] as number)))
  for (let rengI = 0; rengI < rengTodas.length; rengI++)
    for (let rengJ = rengI + 1; rengJ < rengTodas.length; rengJ++) {
      const rengA = rengClave(rengTodas[rengI]!.e.f)
      const rengB = rengClave(rengTodas[rengJ]!.e.f)
      if (rengA.some((rengX) => rengB.includes(rengX))) rengPadre[rengRaiz(rengI)] = rengRaiz(rengJ)
    }
  const rengGrupos = new Map<number, RengMitad>()
  rengTodas.forEach((rengT, rengI) => {
    const rengG = rengGrupos.get(rengRaiz(rengI)) ?? { reactivos: [], productos: [] }
    ;(rengT.lado === 0 ? rengG.reactivos : rengG.productos).push(rengT.e)
    rengGrupos.set(rengRaiz(rengI), rengG)
  })
  const rengLista = [...rengGrupos.values()]
  if (rengLista.length === 2) {
    for (const rengG of rengLista) {
      if (!rengG.reactivos.length || !rengG.productos.length) {
        const rengExtra = rengPareja(rengG, rengMedio)
        if (rengExtra) {
          ;(rengG.reactivos.length ? rengG.productos : rengG.reactivos).push(rengExtra)
          continue
        }
        const rengSola = (rengG.reactivos[0] ?? rengG.productos[0]) as RengEsp
        throw new Error(`«${rengSola.entrada}» no tiene pareja al otro lado de la flecha: no se puede formar su semirreacción.`)
      }
    }
    return rengLista
  }
  if (rengLista.length === 1) {
    const rengG = rengLista[0] as RengMitad
    if (rengG.reactivos.length === 1 && rengG.productos.length === 2) return rengG.productos.map((rengPp) => ({ reactivos: rengG.reactivos, productos: [rengPp] }))
    if (rengG.reactivos.length === 2 && rengG.productos.length === 1) return rengG.reactivos.map((rengRr) => ({ reactivos: [rengRr], productos: rengG.productos }))
    throw new Error('No se pudieron separar dos semirreacciones. Escribe la ecuación iónica con solo las especies que cambian de estado de oxidación.')
  }
  throw new Error(`Se encontraron ${rengLista.length} grupos de especies sin elementos en común; el método ion-electrón necesita exactamente dos semirreacciones.`)
}

function rengCambiosOxidacion(rengM: RengMitad): string[] {
  const rengOut: string[] = []
  const rengR = rengM.reactivos[0] as RengEsp
  const rengP = rengM.productos[0] as RengEsp
  const rengEr = rengEstadosOxidacion(rengR.f)
  const rengEp = rengEstadosOxidacion(rengP.f)
  if (!rengEr || !rengEp) return rengOut
  for (const rengEl of rengClave(rengR.f)) if (rengEr.has(rengEl) && rengEp.has(rengEl)) rengOut.push(`${rengEl}: ${rengTextoEstado(rengEr.get(rengEl) as number)} → ${rengTextoEstado(rengEp.get(rengEl) as number)}`)
  return rengOut
}

interface RengMitadAjustada {
  coef: Map<string, bigint>
  electrones: number
  tipo: RengSemirreaccion['tipo']
  texto: string
  esqueleto: string
  cambios: string[]
}

const RENG_H2O: RengEsp = { entrada: 'H2O', f: rengAnalizarFormula('H2O') }
const RENG_HMAS: RengEsp = { entrada: 'H^+', f: rengAnalizarFormula('H^+') }
const RENG_OHMENOS: RengEsp = { entrada: 'OH^-', f: rengAnalizarFormula('OH^-') }
const RENG_ELECTRON: RengEsp = { entrada: 'e-', f: rengAnalizarFormula('e-') }

function rengTextoDesdeCoefs(rengCoef: Map<string, bigint>, rengEspecies: Map<string, RengEsp>): string {
  const rengIzq: RengTerminoAjustado[] = []
  const rengDer: RengTerminoAjustado[] = []
  for (const [rengK, rengC] of rengCoef) {
    if (rengC === 0n) continue
    const rengE = rengEspecies.get(rengK) as RengEsp
    const rengT = { entrada: rengE.entrada, formula: rengE.f, coef: Number(rengC < 0n ? -rengC : rengC) }
    ;(rengC > 0n ? rengIzq : rengDer).push(rengT)
  }
  return rengTextoEcuacion(rengIzq, rengDer)
}

function rengAjustarMitad(rengM: RengMitad, rengMedio: RengMedio, rengEspecies: Map<string, RengEsp>): RengMitadAjustada {
  const rengPrincipales = [...rengM.reactivos, ...rengM.productos]
  const rengTextos = new Set(rengPrincipales.map((rengE) => rengE.f.texto))
  const rengAux = [RENG_H2O, rengMedio === 'acido' ? RENG_HMAS : RENG_OHMENOS, RENG_ELECTRON].filter((rengE) => !rengTextos.has(rengE.f.texto))
  const rengLista = [...rengPrincipales, ...rengAux]
  const rengSignos = [...rengM.reactivos.map(() => 1), ...rengM.productos.map(() => -1), ...rengAux.map(() => 1)]
  const rengFormulas = rengLista.map((rengE) => rengE.f)
  let rengBase = rengBaseConservacion(rengFormulas, rengSignos)
  if (rengBase.length > 1) {
    const rengClaves = [...new Set(rengPrincipales.flatMap((rengE) => rengClave(rengE.f)))]
    const rengExtra = rengClaves.map((rengEl) => rengLista.map((rengE, rengJ) => (rengJ < rengPrincipales.length ? (rengE.f.atomos.get(rengEl) ?? 0) * (rengSignos[rengJ] as number) : 0)))
    rengBase = rengBaseConservacion(rengFormulas, rengSignos, rengExtra)
  }
  const rengEsqueleto = `${rengM.reactivos.map((rengE) => rengBonita(rengE.entrada)).join(' + ')} → ${rengM.productos.map((rengE) => rengBonita(rengE.entrada)).join(' + ')}`
  if (rengBase.length !== 1) throw new Error(`No se pudo ajustar la semirreacción ${rengEsqueleto} de forma única.`)
  let rengV = rengAEnteros(rengBase[0] as RengRacional[])
  if ((rengV[0] as bigint) < 0n) rengV = rengV.map((rengX) => -rengX)
  rengPrincipales.forEach((rengE, rengI) => {
    if ((rengV[rengI] as bigint) <= 0n) throw new Error(`En la semirreacción ${rengEsqueleto}, «${rengE.entrada}» quedaría al otro lado: revisa las especies.`)
  })
  const rengCoef = new Map<string, bigint>()
  rengLista.forEach((rengE, rengI) => {
    const rengS = BigInt(rengSignos[rengI] as number) * (rengV[rengI] as bigint)
    rengCoef.set(rengE.f.texto, (rengCoef.get(rengE.f.texto) ?? 0n) + rengS)
    if (!rengEspecies.has(rengE.f.texto)) rengEspecies.set(rengE.f.texto, rengE)
  })
  const rengNe = rengCoef.get('e-') ?? 0n
  if (rengNe === 0n) throw new Error(`La semirreacción ${rengEsqueleto} no intercambia electrones: no hay cambio de estado de oxidación.`)
  return {
    coef: rengCoef,
    electrones: Number(rengNe < 0n ? -rengNe : rengNe),
    tipo: rengNe > 0n ? 'reducción' : 'oxidación',
    texto: rengTextoDesdeCoefs(rengCoef, rengEspecies),
    esqueleto: rengEsqueleto,
    cambios: rengCambiosOxidacion(rengM)
  }
}

export function rengAjustarIonElectron(rengEntrada: string | RengEcuacionLeida, rengMedio: RengMedio): RengAjusteRedox {
  const rengEc = typeof rengEntrada === 'string' ? rengLeerEcuacion(rengEntrada) : rengEntrada
  const rengLeer = (rengL: string[]): RengEsp[] => rengL.map((rengS) => ({ entrada: rengS, f: rengAnalizarFormula(rengS) }))
  const rengQuitados: string[] = []
  const rengFiltrar = (rengL: RengEsp[]): RengEsp[] =>
    rengL.filter((rengE) => {
      if (RENG_AUX.has(rengE.f.texto)) {
        rengQuitados.push(rengBonita(rengE.entrada))
        return false
      }
      return true
    })
  const rengR = rengFiltrar(rengLeer(rengEc.reactivos))
  const rengP = rengFiltrar(rengLeer(rengEc.productos))
  const rengPasos: string[] = []
  if (rengQuitados.length) rengPasos.push(`Se retiran ${[...new Set(rengQuitados)].join(', ')}: el método los añade donde hagan falta.`)

  const rengMitades = rengSepararSemirreacciones(rengR, rengP, rengMedio)
  const rengEspecies = new Map<string, RengEsp>()
  for (const rengE of [...rengR, ...rengP]) if (!rengEspecies.has(rengE.f.texto)) rengEspecies.set(rengE.f.texto, rengE)
  const rengAj = rengMitades.map((rengM) => rengAjustarMitad(rengM, rengMedio, rengEspecies))
  const rengOx = rengAj.find((rengA) => rengA.tipo === 'oxidación')
  const rengRed = rengAj.find((rengA) => rengA.tipo === 'reducción')
  if (!rengOx || !rengRed) throw new Error('Las dos semirreacciones van en el mismo sentido (ambas oxidaciones o ambas reducciones): la ecuación no es redox tal como está escrita.')

  const RENG_L = Number(rengMcm(BigInt(rengOx.electrones), BigInt(rengRed.electrones)))
  const rengTotal = new Map<string, bigint>()
  const rengOrden: string[] = [...new Set([...[...rengR, ...rengP].map((rengE) => rengE.f.texto), 'H2O', 'H^+', 'OH^-', 'e-'])]
  for (const rengA of [rengOx, rengRed]) {
    const rengFactor = BigInt(RENG_L / rengA.electrones)
    for (const [rengK, rengC] of rengA.coef) rengTotal.set(rengK, (rengTotal.get(rengK) ?? 0n) + rengC * rengFactor)
  }
  const rengG = [...rengTotal.values()].reduce((rengAcc, rengX) => {
    let rengA = rengAcc
    let rengB = rengX < 0n ? -rengX : rengX
    while (rengB !== 0n) [rengA, rengB] = [rengB, rengA % rengB]
    return rengA
  }, 0n)
  const rengReactivos: RengTerminoAjustado[] = []
  const rengProductos: RengTerminoAjustado[] = []
  for (const rengK of rengOrden) {
    const rengC = (rengTotal.get(rengK) ?? 0n) / (rengG || 1n)
    if (rengC === 0n) continue
    const rengE = rengEspecies.get(rengK) as RengEsp
    const rengT = { entrada: rengE.entrada, formula: rengE.f, coef: Number(rengC < 0n ? -rengC : rengC) }
    ;(rengC > 0n ? rengReactivos : rengProductos).push(rengT)
  }
  const rengComprobacion = rengComprobar(rengReactivos, rengProductos)
  if (rengComprobacion.some((rengC) => rengC.izquierda !== rengC.derecha)) throw new Error('Error interno: la suma de semirreacciones no quedó ajustada.')

  const rengSemirreacciones: RengSemirreaccion[] = [rengOx, rengRed].map((rengA) => ({
    tipo: rengA.tipo,
    texto: rengA.texto,
    esqueleto: rengA.esqueleto,
    electrones: rengA.electrones,
    factor: RENG_L / rengA.electrones,
    cambios: rengA.cambios
  }))
  for (const rengS of rengSemirreacciones) {
    rengPasos.push(`${rengS.tipo === 'oxidación' ? 'Oxidación' : 'Reducción'}${rengS.cambios.length ? ` (${rengS.cambios.join('; ')})` : ''}: ${rengS.esqueleto}`)
  }
  rengPasos.push(
    rengMedio === 'acido'
      ? 'Ajustar cada semirreacción: primero el elemento principal, el O con H₂O, el H con H⁺ y la carga con e⁻.'
      : 'Ajustar cada semirreacción en medio básico: masa con H₂O y OH⁻, carga con e⁻ (equivale a ajustar en ácido y neutralizar cada H⁺ con un OH⁻).'
  )
  for (const rengS of rengSemirreacciones) rengPasos.push(`  ${rengS.texto}   (${rengS.electrones} e⁻)`)
  rengPasos.push(`Igualar electrones (mcm = ${RENG_L}): oxidación × ${rengSemirreacciones[0]!.factor}, reducción × ${rengSemirreacciones[1]!.factor}.`)
  const rengTexto = rengTextoEcuacion(rengReactivos, rengProductos)
  rengPasos.push(`Sumar y simplificar: ${rengTexto}`)
  const rengGn = Number(rengG || 1n)
  return { reactivos: rengReactivos, productos: rengProductos, texto: rengTexto, comprobacion: rengComprobacion, medio: rengMedio, semirreacciones: rengSemirreacciones, electronesTransferidos: RENG_L % rengGn === 0 ? RENG_L / rengGn : RENG_L, pasos: rengPasos }
}
