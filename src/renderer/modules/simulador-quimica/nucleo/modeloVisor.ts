import { rengPorSimbolo } from '../../tabla-periodica/data'
import { RENG_MOLECULAS } from '../chemistry'
import { rengAnalizarFragmento, rengFormulaConvencional, type RengAnalisisFragmento } from './analisisMesa'
import { rengEmparejar, rengObjetivoConDiagnostico, type RengObjetivo } from './geometriaFinal'
import { rengAtomo, type RengMesa } from './mesa'
import { rengDescribirOptimizacion, rengDesdeSmiles, rengGeometria3D, RENG_OPCIONES_MMFF, type RengMoleculaGrafo } from './molecula'
import type { RengResultadoEntrada } from './sustancia'

export type RengV3 = [number, number, number]

export interface RengAtomoVisor {
  el: string
  z: number | null
  nombreElemento: string
  carga: number
  p: RengV3
  etiqueta: string
  componente: number
  aromatico: boolean
}

export interface RengEnlaceVisor {
  a: number
  b: number
  orden: number
  aromatico: boolean
}

export interface RengComponenteVisor {
  formula: string
  nombre: string | null
  carga: number
  atomos: number[]
  tipo: 'molecula' | 'ion' | 'atomo'
}

export type RengOrigenVisor = 'experimental' | 'calculada' | 'esquematica' | 'atomo'

export interface RengProcedenciaVisor {
  origen: RengOrigenVisor
  texto: string
  detalle: string
}

export type RengModeloVisor =
  | {
      estado: 'modelo'
      titulo: string
      formula: string
      tipo: 'molecula' | 'ionico' | 'mezcla' | 'atomo'
      atomos: RengAtomoVisor[]
      enlaces: RengEnlaceVisor[]
      componentes: RengComponenteVisor[]
      procedencia: RengProcedenciaVisor
      radio: number
      smiles: string | null
      avisos: string[]
    }
  | { estado: 'sin-geometria'; titulo: string; formula: string; diagnostico: string; smiles: string | null }
  | { estado: 'ambigua'; formula: string; opciones: Array<{ nombre: string; entrada: string }>; motivo: string }
  | { estado: 'incompleta'; titulo: string; formula: string; motivo: string }
  | { estado: 'vacio'; motivo: string }

const RENG_NIST = 'Longitudes y ángulos de enlace medidos (NIST CCCBDB), incluidos en la app.'
const RENG_PROC_EXPERIMENTAL: RengProcedenciaVisor = { origen: 'experimental', texto: 'Geometría experimental (NIST CCCBDB)', detalle: RENG_NIST }
const rengProcCalculada = (rengG: Pick<RengMoleculaGrafo, 'optimizacion'>): RengProcedenciaVisor => ({
  origen: 'calculada',
  texto: 'Geometría calculada (MMFF94s)',
  detalle: `${rengDescribirOptimizacion(rengG.optimizacion)} Conformación inicial de openchemlib (semilla fija) minimizada con el campo de fuerzas MMFF94s: una conformación de energía baja, no la única posible ni una medida.`
})
const RENG_CONVERGIDA = { optimizacion: { metodo: 'MMFF94s' as const, codigo: 0, convergio: true, ...RENG_OPCIONES_MMFF } }

const rengCacheObjetivo = new Map<string, { objetivo: RengObjetivo | null; motivo: string | null }>()
function rengObjetivoCacheado(rengIdExperimental: string | null, rengSmiles: string | null): { objetivo: RengObjetivo | null; motivo: string | null } {
  const rengK = `${rengIdExperimental ?? ''}|${rengSmiles ?? ''}`
  const rengG = rengCacheObjetivo.get(rengK)
  if (rengG) return rengG
  const rengR = rengObjetivoConDiagnostico(rengIdExperimental, rengSmiles)
  rengCacheObjetivo.set(rengK, rengR)
  if (rengCacheObjetivo.size > 32) rengCacheObjetivo.delete(rengCacheObjetivo.keys().next().value!)
  return rengR
}

function rengEnOrden(rengEls: readonly string[], rengEnlaces: ReadonlyArray<readonly [number, number]>, rengObjetivo: RengObjetivo): RengV3[] | null {
  const rengMapa = rengEmparejar({ el: rengEls, enlaces: rengEnlaces }, rengObjetivo)
  return rengMapa ? rengMapa.map((rengJ) => [...rengObjetivo.pos[rengJ]!] as RengV3) : null
}

export function rengEtiquetasAtomos(rengEls: readonly string[]): string[] {
  const rengN = new Map<string, number>()
  return rengEls.map((rengEl) => {
    const rengK = (rengN.get(rengEl) ?? 0) + 1
    rengN.set(rengEl, rengK)
    return `${rengEl}${rengK}`
  })
}

const rengDatosElemento = (rengEl: string): { z: number | null; nombre: string } => {
  const rengE = rengPorSimbolo.get(rengEl)
  return { z: rengE?.z ?? null, nombre: rengE?.nombre ?? rengEl }
}

function rengCentrar(rengPs: RengV3[]): { ps: RengV3[]; radio: number } {
  if (rengPs.length === 0) return { ps: rengPs, radio: 1 }
  const rengC: RengV3 = [0, 0, 0]
  for (const rengP of rengPs) for (let rengK = 0; rengK < 3; rengK++) rengC[rengK]! += rengP[rengK]! / rengPs.length
  const rengOut = rengPs.map((rengP) => [rengP[0] - rengC[0], rengP[1] - rengC[1], rengP[2] - rengC[2]] as RengV3)
  const rengRadio = Math.max(0.8, ...rengOut.map((rengP) => Math.hypot(rengP[0], rengP[1], rengP[2])))
  return { ps: rengOut, radio: rengRadio }
}

export function rengVecinosVisor(rengN: number, rengEnlaces: readonly RengEnlaceVisor[]): Array<Array<{ i: number; orden: number; aromatico: boolean }>> {
  const rengV = Array.from({ length: rengN }, () => [] as Array<{ i: number; orden: number; aromatico: boolean }>)
  for (const rengE of rengEnlaces) {
    rengV[rengE.a]!.push({ i: rengE.b, orden: rengE.orden, aromatico: rengE.aromatico })
    rengV[rengE.b]!.push({ i: rengE.a, orden: rengE.orden, aromatico: rengE.aromatico })
  }
  return rengV
}

function rengConexos(rengN: number, rengEnlaces: readonly { a: number; b: number }[]): number[][] {
  const rengPadre = Array.from({ length: rengN }, (_, rengI) => rengI)
  const rengRaiz = (rengI: number): number => (rengPadre[rengI] === rengI ? rengI : (rengPadre[rengI] = rengRaiz(rengPadre[rengI]!)))
  for (const rengE of rengEnlaces) rengPadre[rengRaiz(rengE.a)] = rengRaiz(rengE.b)
  const rengGrupos = new Map<number, number[]>()
  for (let rengI = 0; rengI < rengN; rengI++) rengGrupos.set(rengRaiz(rengI), [...(rengGrupos.get(rengRaiz(rengI)) ?? []), rengI])
  return [...rengGrupos.values()].sort((rengA, rengB) => rengA[0]! - rengB[0]!)
}

const RENG_SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
export function rengSimboloConCarga(rengEl: string, rengCarga: number): string {
  if (rengCarga === 0) return rengEl
  const rengN = Math.abs(rengCarga)
  return `${rengEl}${rengN > 1 ? [...String(rengN)].map((rengD) => RENG_SUP[Number(rengD)]).join('') : ''}${rengCarga > 0 ? '⁺' : '⁻'}`
}

function rengComponenteDe(rengAtomos: readonly RengAtomoVisor[], rengIds: number[], rengNombre: string | null): RengComponenteVisor {
  const rengCarga = rengIds.reduce((rengS, rengI) => rengS + rengAtomos[rengI]!.carga, 0)
  const rengFormula = rengFormulaConvencional(rengIds.map((rengI) => rengAtomos[rengI]!.el))
  return { formula: rengFormula, nombre: rengNombre, carga: rengCarga, atomos: rengIds, tipo: rengIds.length === 1 ? (rengCarga === 0 ? 'atomo' : 'ion') : rengCarga === 0 ? 'molecula' : 'ion' }
}

export function rengModeloDeFragmento(rengM: RengMesa, rengIds: readonly number[], rengAnalisisPrevio?: RengAnalisisFragmento): RengModeloVisor {
  if (rengIds.length === 0) return { estado: 'vacio', motivo: 'La mesa está vacía: construye o añade una sustancia y selecciónala.' }
  const rengA = rengAnalisisPrevio ?? rengAnalizarFragmento(rengM, [...rengIds])
  const rengAts = rengIds.map((rengId) => rengAtomo(rengM, rengId)!)
  const rengTitulo = rengA.nombre ?? rengA.formula
  const rengIdx = new Map(rengIds.map((rengId, rengI) => [rengId, rengI]))
  const rengEnlMesa = rengM.enlaces.filter((rengE) => rengIdx.has(rengE.a) && rengIdx.has(rengE.b))
  const rengEtiquetas = rengEtiquetasAtomos(rengAts.map((rengX) => rengX.el))
  const rengCrear = (rengPs: RengV3[], rengComponenteDeAtomo: (rengI: number) => number): RengAtomoVisor[] =>
    rengAts.map((rengX, rengI) => {
      const rengD = rengDatosElemento(rengX.el)
      return { el: rengX.el, z: rengD.z, nombreElemento: rengD.nombre, carga: rengX.carga, p: rengPs[rengI]!, etiqueta: rengEtiquetas[rengI]!, componente: rengComponenteDeAtomo(rengI), aromatico: false }
    })

  if (rengIds.length === 1) {
    const { ps: rengPs, radio: rengRadio } = rengCentrar([[0, 0, 0]])
    const rengAtomos = rengCrear(rengPs, () => 0)
    return {
      estado: 'modelo',
      titulo: rengTitulo,
      formula: rengA.formula,
      tipo: 'atomo',
      atomos: rengAtomos,
      enlaces: [],
      componentes: [rengComponenteDe(rengAtomos, [0], rengA.nombre)],
      procedencia: { origen: 'atomo', texto: 'Átomo aislado', detalle: 'Un solo átomo: no hay enlaces ni geometría que calcular. Su tamaño en el modelo es ilustrativo.' },
      radio: rengRadio,
      smiles: null,
      avisos: []
    }
  }
  if (rengA.metalico) return { estado: 'sin-geometria', titulo: rengTitulo, formula: rengA.formula, diagnostico: 'Enlace metálico: en la realidad es una red o una aleación, no una molécula. No hay una geometría molecular que mostrar.', smiles: null }
  if (!rengA.completa) return { estado: 'incompleta', titulo: rengTitulo, formula: rengA.formula, motivo: `${rengA.estado} Sin valencias completas no hay forma real que calcular.` }

  if (rengA.ionico) {
    const rengCov = rengEnlMesa.filter((rengE) => rengE.tipo !== 'ionico').map((rengE) => ({ a: rengIdx.get(rengE.a)!, b: rengIdx.get(rengE.b)! }))
    const rengGrupos = rengConexos(rengIds.length, rengCov)
    const rengComp = new Map<number, number>()
    rengGrupos.forEach((rengG, rengK) => rengG.forEach((rengI) => rengComp.set(rengI, rengK)))
    const { ps: rengPs, radio: rengRadio } = rengCentrar(rengAts.map((rengX) => [...rengX.p] as RengV3))
    const rengAtomos = rengCrear(rengPs, (rengI) => rengComp.get(rengI)!)
    const rengEnlaces: RengEnlaceVisor[] = rengEnlMesa.filter((rengE) => rengE.tipo !== 'ionico').map((rengE) => ({ a: rengIdx.get(rengE.a)!, b: rengIdx.get(rengE.b)!, orden: rengE.orden, aromatico: false }))
    const rengComponentes = rengGrupos.map((rengG) => rengComponenteDe(rengAtomos, rengG, null))
    return {
      estado: 'modelo',
      titulo: rengTitulo,
      formula: rengA.formula,
      tipo: 'ionico',
      atomos: rengAtomos,
      enlaces: rengEnlaces,
      componentes: rengComponentes,
      procedencia: {
        origen: 'esquematica',
        texto: 'Posiciones esquemáticas (compuesto iónico)',
        detalle: 'Los iones se muestran donde están en la mesa, separados y sin enlace entre ellos: en el sólido no hay moléculas, sino una red de iones que se atraen. Las distancias no son las de la red cristalina.'
      },
      radio: rengRadio,
      smiles: null,
      avisos: rengA.sustancia?.idRed ? ['Puedes ver su red cristalina desde la tarjeta del fragmento.'] : []
    }
  }

  const rengSmiles = rengA.smiles
  const { objetivo: rengObjetivo, motivo: rengMotivo } = rengObjetivoCacheado(rengA.sustancia?.idExperimental ?? null, rengSmiles)
  if (!rengObjetivo) {
    const rengDiag = rengMotivo ?? 'No hay parámetros del campo de fuerzas MMFF94s para algún átomo (pasa con metales y gases nobles), así que no se calcula una geometría 3D.'
    return { estado: 'sin-geometria', titulo: rengTitulo, formula: rengA.formula, diagnostico: rengDiag, smiles: rengSmiles }
  }
  const rengFin = rengEnOrden(rengAts.map((rengX) => rengX.el), rengEnlMesa.map((rengE) => [rengIdx.get(rengE.a)!, rengIdx.get(rengE.b)!] as const), rengObjetivo)
  if (!rengFin) return { estado: 'sin-geometria', titulo: rengTitulo, formula: rengA.formula, diagnostico: 'No se pudo emparejar cada átomo de la mesa con la geometría calculada.', smiles: rengSmiles }
  const { ps: rengPs, radio: rengRadio } = rengCentrar(rengFin)
  const rengAtomos = rengCrear(rengPs, () => 0)
  const rengEnlaces: RengEnlaceVisor[] = rengEnlMesa.map((rengE) => ({ a: rengIdx.get(rengE.a)!, b: rengIdx.get(rengE.b)!, orden: rengE.orden, aromatico: false }))
  const rengProc = rengObjetivo.origen === 'experimental' ? RENG_PROC_EXPERIMENTAL : rengProcCalculada(RENG_CONVERGIDA)
  return {
    estado: 'modelo',
    titulo: rengTitulo,
    formula: rengA.formula,
    tipo: 'molecula',
    atomos: rengAtomos,
    enlaces: rengEnlaces,
    componentes: [rengComponenteDe(rengAtomos, rengAtomos.map((_, rengI) => rengI), rengA.nombre)],
    procedencia: rengProc,
    radio: rengRadio,
    smiles: rengSmiles,
    avisos: rengA.estereo === 'perdida' ? ['La estereoquímica anotada al añadir la sustancia se perdió con una edición: el modelo muestra una conformación sin configuración garantizada.'] : []
  }
}

const rengCacheSmiles = new Map<string, RengModeloVisor>()
const RENG_MAX_CACHE = 48

export function rengModeloDeSmiles(rengSmiles: string, rengTitulo: string, rengIdExperimental: string | null = null, rengOpciones: { maxIts: number; gradTol: number } = RENG_OPCIONES_MMFF): RengModeloVisor {
  const rengClave = `${rengSmiles}|${rengIdExperimental ?? ''}|${rengTitulo}|${rengOpciones.maxIts}|${rengOpciones.gradTol}`
  const rengGuardado = rengCacheSmiles.get(rengClave)
  if (rengGuardado) return rengGuardado
  const rengR = rengCalcularDeSmiles(rengSmiles, rengTitulo, rengIdExperimental, rengOpciones)
  rengCacheSmiles.set(rengClave, rengR)
  if (rengCacheSmiles.size > RENG_MAX_CACHE) rengCacheSmiles.delete(rengCacheSmiles.keys().next().value!)
  return rengR
}

function rengCalcularDeSmiles(rengSmiles: string, rengTitulo: string, rengIdExperimental: string | null, rengOpciones: { maxIts: number; gradTol: number }): RengModeloVisor {
  let rengG: RengMoleculaGrafo
  try {
    rengG = rengDesdeSmiles(rengSmiles)
  } catch (rengE) {
    return { estado: 'sin-geometria', titulo: rengTitulo, formula: '', diagnostico: rengE instanceof Error ? rengE.message : String(rengE), smiles: null }
  }
  const rengPartes = rengSmiles.split('.').map((rengS) => rengS.trim()).filter(Boolean)
  const rengAtomos: RengAtomoVisor[] = []
  const rengEnlaces: RengEnlaceVisor[] = []
  const rengComponentes: RengComponenteVisor[] = []
  const rengPosiciones: RengV3[] = []
  let rengDesplazamiento = 0
  let rengProcedencia: RengProcedenciaVisor | null = null
  for (const rengParte of rengPartes) {
    let rengPg: RengMoleculaGrafo
    let rengPos: RengV3[]
    let rengProc: RengProcedenciaVisor
    const rengExp = rengPartes.length === 1 && rengIdExperimental ? RENG_MOLECULAS.find((rengX) => rengX.id === rengIdExperimental) : undefined
    const rengBase = rengDesdeSmiles(rengParte)
    if (rengBase.atomos.length === 1) {
      rengPg = rengBase
      rengPos = [[0, 0, 0]]
      rengProc = { origen: 'atomo', texto: 'Ion o átomo aislado', detalle: 'Un solo átomo: no hay geometría que calcular.' }
    } else if (rengExp) {
      const { objetivo: rengObjetivo } = rengObjetivoCacheado(rengExp.id, null)
      const rengFin = rengObjetivo ? rengEnOrden(rengBase.atomos.map((rengX) => rengX.el), rengBase.enlaces.map((rengE) => [rengE.a, rengE.b] as const), rengObjetivo) : null
      if (!rengFin) return { estado: 'sin-geometria', titulo: rengTitulo, formula: rengG.formula, diagnostico: 'No se pudo emparejar la estructura con su geometría experimental.', smiles: rengSmiles }
      rengPg = rengBase
      rengPos = rengFin
      rengProc = RENG_PROC_EXPERIMENTAL
    } else {
      let rengG3: RengMoleculaGrafo
      try {
        rengG3 = rengGeometria3D(rengParte, 42, rengOpciones)
      } catch (rengE) {
        return { estado: 'sin-geometria', titulo: rengTitulo, formula: rengG.formula, diagnostico: rengE instanceof Error ? rengE.message : String(rengE), smiles: rengSmiles }
      }
      if (!rengG3.optimizacion?.convergio)
        return { estado: 'sin-geometria', titulo: rengTitulo, formula: rengG.formula, diagnostico: `No se muestra un modelo 3D: ${rengDescribirOptimizacion(rengG3.optimizacion)}`, smiles: rengSmiles }
      rengPg = rengG3
      rengPos = rengG3.atomos.map((rengX) => [rengX.x, rengX.y, rengX.z] as RengV3)
      rengProc = rengProcCalculada(rengG3)
    }
    const { ps: rengPs, radio: rengRadio } = rengCentrar(rengPos)
    const rengDx = rengPartes.length > 1 ? rengDesplazamiento + rengRadio : 0
    rengDesplazamiento += 2 * rengRadio + 2.2
    const rengInicio = rengAtomos.length
    const rengEtiquetas = rengEtiquetasAtomos([...rengAtomos.map((rengX) => rengX.el), ...rengPg.atomos.map((rengX) => rengX.el)]).slice(rengInicio)
    rengPg.atomos.forEach((rengX, rengI) => {
      const rengD = rengDatosElemento(rengX.el)
      rengAtomos.push({ el: rengX.el, z: rengD.z, nombreElemento: rengD.nombre, carga: rengX.carga, p: [rengPs[rengI]![0] + rengDx, rengPs[rengI]![1], rengPs[rengI]![2]], etiqueta: rengEtiquetas[rengI]!, componente: rengComponentes.length, aromatico: rengX.aromatico })
      rengPosiciones.push(rengAtomos[rengAtomos.length - 1]!.p)
    })
    for (const rengE of rengPg.enlaces) rengEnlaces.push({ a: rengE.a + rengInicio, b: rengE.b + rengInicio, orden: rengE.orden, aromatico: rengE.aromatico })
    rengComponentes.push(rengComponenteDe(rengAtomos, rengPg.atomos.map((_, rengI) => rengI + rengInicio), null))
    if (!rengProcedencia || rengProcedencia.origen === 'atomo') rengProcedencia = rengProc
  }
  const { ps: rengPs, radio: rengRadio } = rengCentrar(rengPosiciones)
  rengAtomos.forEach((rengX, rengI) => (rengX.p = rengPs[rengI]!))
  const rengIonico = rengComponentes.length > 1 && rengComponentes.some((rengC) => rengC.carga !== 0)
  const rengTipo = rengComponentes.length > 1 ? (rengIonico ? 'ionico' : 'mezcla') : rengAtomos.length === 1 ? 'atomo' : 'molecula'
  const rengAvisos: string[] = []
  if (rengTipo === 'ionico') rengAvisos.push('Compuesto iónico: los iones se dibujan separados y sin enlace entre ellos; en el sólido forman una red.')
  if (rengTipo === 'mezcla') rengAvisos.push('Mezcla: cada componente se dibuja aparte; entre ellos no hay enlaces.')
  if (rengG.estereo === 'indefinida' || rengG.estereo === 'parcial') rengAvisos.push('La estructura no define la configuración de todos sus estereocentros: el modelo muestra una de las formas posibles.')
  return { estado: 'modelo', titulo: rengTitulo, formula: rengG.formula, tipo: rengTipo, atomos: rengAtomos, enlaces: rengEnlaces, componentes: rengComponentes, procedencia: rengProcedencia!, radio: rengRadio, smiles: rengSmiles, avisos: rengAvisos }
}

export function rengModeloDeEntrada(rengR: RengResultadoEntrada): RengModeloVisor {
  if (rengR.tipo === 'isomeros')
    return {
      estado: 'ambigua',
      formula: rengR.formula,
      opciones: rengR.opciones.map((rengO) => ({ nombre: rengO.nombre, entrada: rengO.entrada })),
      motivo: `${rengR.formula} es una fórmula molecular: dice qué átomos hay, no cómo están unidos. Elige una estructura (o escribe un nombre, una fórmula semidesarrollada o un SMILES) antes de ver un modelo 3D.`
    }
  if (rengR.tipo === 'error') return { estado: 'vacio', motivo: rengR.motivo }
  const rengS = rengR.sustancia
  if (!rengS.smiles) return { estado: 'sin-geometria', titulo: rengS.nombre, formula: rengS.formula, diagnostico: rengS.idRed ? 'Se representa como una red cristalina, no como una molécula.' : 'Esta sustancia no tiene una estructura molecular con la que dibujar un modelo 3D.', smiles: null }
  return rengModeloDeSmiles(rengS.smiles, rengS.nombre, rengS.idExperimental)
}

export function rengDescribirAtomo(rengM: Extract<RengModeloVisor, { estado: 'modelo' }>, rengI: number): { titulo: string; z: string; carga: string; enlaces: Array<{ i: number; texto: string }> } {
  const rengX = rengM.atomos[rengI]!
  const rengVec = rengVecinosVisor(rengM.atomos.length, rengM.enlaces)[rengI]!
  const RENG_ORDEN = ['', 'simple', 'doble', 'triple']
  return {
    titulo: `${rengX.etiqueta} · ${rengX.nombreElemento} (${rengSimboloConCarga(rengX.el, rengX.carga)})`,
    z: rengX.z === null ? 'desconocido' : String(rengX.z),
    carga: rengX.carga === 0 ? '0' : rengX.carga > 0 ? `+${rengX.carga}` : `−${Math.abs(rengX.carga)}`,
    enlaces: rengVec.map((rengV) => ({ i: rengV.i, texto: `${rengM.atomos[rengV.i]!.etiqueta} (${rengV.aromatico ? 'aromático' : (RENG_ORDEN[rengV.orden] ?? String(rengV.orden))})` }))
  }
}
