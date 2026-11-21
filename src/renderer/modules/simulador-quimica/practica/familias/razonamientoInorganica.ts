import { rengBonita } from '../../nucleo/formula'
import { rengElegir } from '../numeros'
import type { RengBaseEjercicio, RengFamilia, RengMetodo } from '../tipos'
import { rengDatoT, rengMezclar, rengOpciones, RENG_FUENTE_DIDACTICA, rengVarianteDeSemilla, type RengVariante } from './util'

interface RengIon {
  f: string
  etiqueta: string
  carga: number
  poli: boolean
  nombre: string
}

const RENG_CATIONES: readonly RengIon[] = [
  { f: 'Na', etiqueta: 'Na⁺', carga: 1, poli: false, nombre: 'sodio' },
  { f: 'K', etiqueta: 'K⁺', carga: 1, poli: false, nombre: 'potasio' },
  { f: 'Mg', etiqueta: 'Mg²⁺', carga: 2, poli: false, nombre: 'magnesio' },
  { f: 'Ca', etiqueta: 'Ca²⁺', carga: 2, poli: false, nombre: 'calcio' },
  { f: 'Zn', etiqueta: 'Zn²⁺', carga: 2, poli: false, nombre: 'cinc' },
  { f: 'Al', etiqueta: 'Al³⁺', carga: 3, poli: false, nombre: 'aluminio' },
  { f: 'Fe', etiqueta: 'Fe³⁺', carga: 3, poli: false, nombre: 'hierro(III)' }
]

const RENG_ANIONES: readonly RengIon[] = [
  { f: 'Cl', etiqueta: 'Cl⁻', carga: 1, poli: false, nombre: 'cloruro' },
  { f: 'O', etiqueta: 'O²⁻', carga: 2, poli: false, nombre: 'óxido' },
  { f: 'S', etiqueta: 'S²⁻', carga: 2, poli: false, nombre: 'sulfuro' },
  { f: 'N', etiqueta: 'N³⁻', carga: 3, poli: false, nombre: 'nitruro' },
  { f: 'NO3', etiqueta: 'NO₃⁻', carga: 1, poli: true, nombre: 'nitrato' },
  { f: 'SO4', etiqueta: 'SO₄²⁻', carga: 2, poli: true, nombre: 'sulfato' },
  { f: 'PO4', etiqueta: 'PO₄³⁻', carga: 3, poli: true, nombre: 'fosfato' },
  { f: 'OH', etiqueta: 'OH⁻', carga: 1, poli: true, nombre: 'hidróxido' }
]

const rengMcd = (rengA: number, rengB: number): number => (rengB === 0 ? rengA : rengMcd(rengB, rengA % rengB))

export interface RengFormulaIonica {
  texto: string
  nCat: number
  nAn: number
  cargaNeta: number
}

const rengEscribirIones = (rengCat: RengIon, rengAn: RengIon, rengNCat: number, rengNAn: number): RengFormulaIonica => {
  const rengParte = (rengI: RengIon, rengN: number): string => (rengN === 1 ? rengI.f : rengI.poli ? `(${rengI.f})${rengN}` : `${rengI.f}${rengN}`)
  return { texto: `${rengParte(rengCat, rengNCat)}${rengParte(rengAn, rengNAn)}`, nCat: rengNCat, nAn: rengNAn, cargaNeta: rengNCat * rengCat.carga - rengNAn * rengAn.carga }
}

export const rengFormulaIonicaCorrecta = (rengCat: RengIon, rengAn: RengIon): RengFormulaIonica => {
  const rengD = rengMcd(rengCat.carga, rengAn.carga)
  return rengEscribirIones(rengCat, rengAn, rengAn.carga / rengD, rengCat.carga / rengD)
}

const rengPareja = (rengAzar: () => number, rengPoli: 'cualquiera' | 'poli' | 'simple'): { cat: RengIon; an: RengIon } | null => {
  for (let rengI = 0; rengI < 40; rengI++) {
    const rengCat = rengElegir(rengAzar, RENG_CATIONES)
    const rengAn = rengElegir(rengAzar, RENG_ANIONES.filter((rengX) => (rengPoli === 'poli' ? rengX.poli : rengPoli === 'simple' ? !rengX.poli : true)))
    if (rengCat.carga !== rengAn.carga) return { cat: rengCat, an: rengAn }
  }
  return null
}

const rengFormulaIncoherente = (rengAzar: () => number, rengCat: RengIon, rengAn: RengIon): RengFormulaIonica | null => {
  const rengBuena = rengFormulaIonicaCorrecta(rengCat, rengAn)
  const rengCandidatas = [rengEscribirIones(rengCat, rengAn, 1, 1), rengEscribirIones(rengCat, rengAn, rengBuena.nAn, rengBuena.nCat)].filter((rengX) => rengX.cargaNeta !== 0 && rengX.texto !== rengBuena.texto)
  return rengCandidatas.length === 0 ? null : rengElegir(rengAzar, rengCandidatas)
}

const rengTextoCargaNeta = (rengF: RengFormulaIonica, rengCat: RengIon, rengAn: RengIon): string => `${rengF.nCat} · (${rengCat.carga > 0 ? '+' : ''}${rengCat.carga}) + ${rengF.nAn} · (−${rengAn.carga}) = ${rengF.cargaNeta > 0 ? '+' : ''}${rengF.cargaNeta === 0 ? '0' : rengF.cargaNeta < 0 ? `−${Math.abs(rengF.cargaNeta)}` : rengF.cargaNeta}`

const rengMetodoCarga = (rengCorrecta: string, rengOtras: string[], rengExplicacion: string, rengAzar: () => number): RengMetodo => {
  const rengTodas = rengMezclar(rengAzar, [rengCorrecta, ...rengOtras])
  const rengOpc = rengTodas.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
  return { pregunta: '¿Qué incoherencia hay en la fórmula?', opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrecta)!.id, explicacion: rengExplicacion }
}

export const RENG_VARIANTES_FORMULA_CARGA: readonly RengVariante[] = [
  { id: 'carga.subindices-omitidos', nivel: 'preuniversitario' },
  { id: 'carga.poliatomico-cruzado', nivel: 'universitario' },
  { id: 'carga.cual-es-incoherente', nivel: 'quimico' },
  { id: 'carga.subindices-omitidos-2', nivel: 'universitario' }
]

export const RENG_FAMILIA_FORMULA_CARGA: RengFamilia = {
  id: 'inorganica.formula-carga',
  rama: 'inorganica',
  tema: 'oxidacion',
  nombre: 'Coherencia entre fórmula y carga',
  descripcion: 'Comprobar que la suma de cargas de una fórmula iónica es cero, localizar la incoherencia y corregirla.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = rengVarianteDeSemilla(RENG_VARIANTES_FORMULA_CARGA, nivel, semilla)
    if (!rengVar) return null
    const rengComun = { variante: rengVar.id, fuente: RENG_FUENTE_DIDACTICA }
    if (rengVar.id === 'carga.cual-es-incoherente') {
      const rengCandidatas: Array<{ cat: RengIon; an: RengIon; f: RengFormulaIonica }> = []
      for (let rengI = 0; rengI < 60 && rengCandidatas.length < 3; rengI++) {
        const rengP = rengPareja(azar, 'cualquiera')
        if (!rengP) continue
        const rengBuena = rengFormulaIonicaCorrecta(rengP.cat, rengP.an)
        if (!rengCandidatas.some((rengX) => rengX.f.texto === rengBuena.texto)) rengCandidatas.push({ ...rengP, f: rengBuena })
      }
      if (rengCandidatas.length < 3) return null
      let rengMala: { cat: RengIon; an: RengIon; f: RengFormulaIonica } | null = null
      for (let rengI = 0; rengI < 60 && !rengMala; rengI++) {
        const rengP = rengPareja(azar, 'cualquiera')
        if (!rengP) continue
        const rengF = rengFormulaIncoherente(azar, rengP.cat, rengP.an)
        if (rengF && ![...rengCandidatas].some((rengX) => rengX.f.texto === rengF.texto || rengX.f.texto === rengFormulaIonicaCorrecta(rengP.cat, rengP.an).texto)) rengMala = { ...rengP, f: rengF }
      }
      if (!rengMala) return null
      const rengTodos = rengMezclar(azar, [...rengCandidatas, rengMala])
      const rengTextos = rengTodos.map((rengX) => `${rengBonita(rengX.f.texto)} (${rengX.cat.etiqueta} y ${rengX.an.etiqueta})`)
      const rengCorrectaTexto = `${rengBonita(rengMala.f.texto)} (${rengMala.cat.etiqueta} y ${rengMala.an.etiqueta})`
      const rengOp = rengOpciones(azar, rengCorrectaTexto, rengTextos, 4)
      const rengBuenaMala = rengFormulaIonicaCorrecta(rengMala.cat, rengMala.an)
      return {
        ...rengComun,
        titulo: 'Localizar la fórmula incoherente',
        enunciado: `Un listado de compuestos iónicos propone las fórmulas siguientes, cada una con los iones que la forman: ${rengTextos.join('; ')}. Solo una de ellas no tiene carga neta cero.`,
        pregunta: '¿Qué fórmula es incoherente con la carga de sus iones?',
        datos: rengTextos.map((rengT, rengI) => rengDatoT(`f${rengI + 1}`, `Fórmula ${rengI + 1}`, rengT)),
        respuesta: { tipo: 'opcion', ...rengOp },
        metodo: rengMetodoCarga(`Su suma de cargas no es cero: ${rengTextoCargaNeta(rengMala.f, rengMala.cat, rengMala.an)}`, ['Tiene paréntesis innecesarios en un ion poliatómico', 'El anión debería escribirse antes que el catión', 'El subíndice 1 debe escribirse siempre'], 'Un compuesto iónico es neutro: carga del catión × su subíndice + carga del anión × su subíndice = 0.', azar),
        criterioCompleto: 'Cuenta como respuesta completa: la fórmula incoherente y la comprobación de la carga neta que lo demuestra.',
        hipotesis: ['Todos los iones tienen la carga indicada entre paréntesis.', 'Una fórmula iónica expresa la proporción mínima de iones.'],
        pistas: ['Calcula la carga neta de cada fórmula: subíndice del catión por su carga más subíndice del anión por su carga.', 'Una fórmula coherente da carga neta 0.', `La incoherente es la que da una carga distinta de cero; la correcta para esos iones sería ${rengBonita(rengBuenaMala.texto)}.`],
        pasos: rengTodos.map((rengX) => `${rengBonita(rengX.f.texto)}: ${rengTextoCargaNeta(rengX.f, rengX.cat, rengX.an)}`),
        comprobacion: `La fórmula elegida, corregida a ${rengBonita(rengBuenaMala.texto)}, debe dar carga neta cero.`,
        errorFrecuente: 'Dar por buena una fórmula solo porque «parece» razonable, sin sumar las cargas.'
      }
    }
    const rengP = rengPareja(azar, rengVar.id === 'carga.poliatomico-cruzado' ? 'poli' : rengVar.nivel === 'preuniversitario' ? 'simple' : 'cualquiera')
    if (!rengP) return null
    const rengBuena = rengFormulaIonicaCorrecta(rengP.cat, rengP.an)
    const rengMala = rengVar.id === 'carga.poliatomico-cruzado' ? (rengEscribirIones(rengP.cat, rengP.an, rengBuena.nAn, rengBuena.nCat).cargaNeta !== 0 ? rengEscribirIones(rengP.cat, rengP.an, rengBuena.nAn, rengBuena.nCat) : rengFormulaIncoherente(azar, rengP.cat, rengP.an)) : rengFormulaIncoherente(azar, rengP.cat, rengP.an)
    if (!rengMala || rengMala.texto === rengBuena.texto) return null
    const rengNeta = rengTextoCargaNeta(rengMala, rengP.cat, rengP.an)
    return {
      ...rengComun,
      titulo: 'Corregir una fórmula con la carga',
      enunciado: `Un estudiante propone la fórmula ${rengBonita(rengMala.texto)} para el compuesto iónico que forman el ion ${rengP.cat.etiqueta} (${rengP.cat.nombre}) y el ion ${rengP.an.etiqueta} (${rengP.an.nombre}).`,
      pregunta: 'Escribe la fórmula correcta del compuesto.',
      datos: [rengDatoT('cat', 'Catión', `${rengP.cat.etiqueta} (${rengP.cat.nombre})`), rengDatoT('an', 'Anión', `${rengP.an.etiqueta} (${rengP.an.nombre})`)],
      respuesta: { tipo: 'formula', formula: rengBuena.texto },
      metodo: rengMetodoCarga(`La suma de cargas no es cero: ${rengNeta}`, ['Los iones están en orden inverso', 'Falta un subíndice en el ion que tiene menos carga', 'La fórmula no incluye ningún paréntesis'], 'Para que el compuesto sea neutro, los subíndices deben compensar las cargas: el catión y el anión se combinan en la proporción mínima que suma cero.', azar),
      criterioCompleto: 'Cuenta como respuesta completa: la fórmula corregida y la identificación de la incoherencia de carga.',
      hipotesis: nivel === 'quimico' ? ['Los iones tienen las cargas indicadas.'] : undefined,
      pistas: ['Escribe la carga de cada ion y calcula la carga neta de la fórmula propuesta.', 'La carga neta debe ser cero: busca la proporción más pequeña de iones que lo consigue.', `Con ${rengBuena.nCat} ion(es) del catión y ${rengBuena.nAn} del anión la suma de cargas es cero.`],
      pasos: [`Fórmula propuesta ${rengBonita(rengMala.texto)}: ${rengNeta}`, `Proporción mínima que anula la carga: ${rengBuena.nCat} catión : ${rengBuena.nAn} anión`, `Fórmula correcta: ${rengBonita(rengBuena.texto)}`],
      errorFrecuente: 'Escribir 1 : 1 siempre, o cruzar mal las cargas (el subíndice de uno es la carga del otro, simplificada).'
    }
  }
}

interface RengEspecie {
  atomos: Record<string, number>
  carga: number
  etiqueta: string
}

const RENG_ESPECIES: Readonly<Record<string, RengEspecie>> = {
  MnO4: { atomos: { Mn: 1, O: 4 }, carga: -1, etiqueta: 'MnO₄⁻' },
  Mn2: { atomos: { Mn: 1 }, carga: 2, etiqueta: 'Mn²⁺' },
  Cr2O7: { atomos: { Cr: 2, O: 7 }, carga: -2, etiqueta: 'Cr₂O₇²⁻' },
  Cr3: { atomos: { Cr: 1 }, carga: 3, etiqueta: 'Cr³⁺' },
  NO3: { atomos: { N: 1, O: 3 }, carga: -1, etiqueta: 'NO₃⁻' },
  NO: { atomos: { N: 1, O: 1 }, carga: 0, etiqueta: 'NO' },
  MnO2: { atomos: { Mn: 1, O: 2 }, carga: 0, etiqueta: 'MnO₂' },
  H: { atomos: { H: 1 }, carga: 1, etiqueta: 'H⁺' },
  OH: { atomos: { O: 1, H: 1 }, carga: -1, etiqueta: 'OH⁻' },
  H2O: { atomos: { H: 2, O: 1 }, carga: 0, etiqueta: 'H₂O' },
  e: { atomos: {}, carga: -1, etiqueta: 'e⁻' }
}

interface RengTerminoSemi {
  id: string
  coef: number
  lado: 'izq' | 'der'
}

interface RengSemi {
  nombre: string
  medio: 'ácido' | 'básico'
  terminos: RengTerminoSemi[]
}

const RENG_SEMIRREACCIONES_BALANCE: readonly RengSemi[] = [
  { nombre: 'permanganato a manganeso(II)', medio: 'ácido', terminos: [{ id: 'MnO4', coef: 1, lado: 'izq' }, { id: 'H', coef: 8, lado: 'izq' }, { id: 'e', coef: 5, lado: 'izq' }, { id: 'Mn2', coef: 1, lado: 'der' }, { id: 'H2O', coef: 4, lado: 'der' }] },
  { nombre: 'dicromato a cromo(III)', medio: 'ácido', terminos: [{ id: 'Cr2O7', coef: 1, lado: 'izq' }, { id: 'H', coef: 14, lado: 'izq' }, { id: 'e', coef: 6, lado: 'izq' }, { id: 'Cr3', coef: 2, lado: 'der' }, { id: 'H2O', coef: 7, lado: 'der' }] },
  { nombre: 'nitrato a monóxido de nitrógeno', medio: 'ácido', terminos: [{ id: 'NO3', coef: 1, lado: 'izq' }, { id: 'H', coef: 4, lado: 'izq' }, { id: 'e', coef: 3, lado: 'izq' }, { id: 'NO', coef: 1, lado: 'der' }, { id: 'H2O', coef: 2, lado: 'der' }] },
  { nombre: 'permanganato a dióxido de manganeso', medio: 'básico', terminos: [{ id: 'MnO4', coef: 1, lado: 'izq' }, { id: 'H2O', coef: 2, lado: 'izq' }, { id: 'e', coef: 3, lado: 'izq' }, { id: 'MnO2', coef: 1, lado: 'der' }, { id: 'OH', coef: 4, lado: 'der' }] }
]

export interface RengBalanceSemi {
  atomos: Record<string, number>
  carga: number
}

export function rengBalanceSemirreaccion(rengT: readonly RengTerminoSemi[]): { izq: RengBalanceSemi; der: RengBalanceSemi; equilibrada: boolean; fallos: string[] } {
  const rengSuma = (rengLado: 'izq' | 'der'): RengBalanceSemi => {
    const rengAtomos: Record<string, number> = {}
    let rengCarga = 0
    for (const rengX of rengT.filter((rengY) => rengY.lado === rengLado)) {
      const rengE = RENG_ESPECIES[rengX.id]!
      for (const [rengEl, rengN] of Object.entries(rengE.atomos)) rengAtomos[rengEl] = (rengAtomos[rengEl] ?? 0) + rengX.coef * rengN
      rengCarga += rengX.coef * rengE.carga
    }
    return { atomos: rengAtomos, carga: rengCarga }
  }
  const rengIzq = rengSuma('izq')
  const rengDer = rengSuma('der')
  const rengFallos: string[] = []
  for (const rengEl of ['H', 'O', 'Mn', 'Cr', 'N']) if ((rengIzq.atomos[rengEl] ?? 0) !== (rengDer.atomos[rengEl] ?? 0)) rengFallos.push(rengEl === 'H' ? 'los átomos de H' : rengEl === 'O' ? 'los átomos de O' : `los átomos de ${rengEl}`)
  if (rengIzq.carga !== rengDer.carga) rengFallos.push('la carga')
  return { izq: rengIzq, der: rengDer, equilibrada: rengFallos.length === 0, fallos: rengFallos }
}

const rengTextoFallos = (rengF: string[]): string => (rengF.length === 1 ? `Solo falla ${rengF[0]!}` : `Fallan ${rengF.slice(0, -1).join(', ')} y ${rengF.at(-1)!}`)

const RENG_TEXTOS_FALLO = ['Solo falla la carga', 'Solo fallan los átomos de O', 'Solo fallan los átomos de H', 'Fallan los átomos de H y la carga', 'Fallan los átomos de H y de O', 'Fallan los átomos de O y la carga']

const rengTextoSemi = (rengT: readonly RengTerminoSemi[]): string => {
  const rengLado = (rengL: 'izq' | 'der'): string => rengT.filter((rengX) => rengX.lado === rengL).map((rengX) => `${rengX.coef === 1 ? '' : `${rengX.coef} `}${RENG_ESPECIES[rengX.id]!.etiqueta}`).join(' + ')
  return `${rengLado('izq')} → ${rengLado('der')}`
}

export const RENG_VARIANTES_SEMIRREACCION_BALANCE: readonly RengVariante[] = [
  { id: 'semibalance.electrones', nivel: 'universitario' },
  { id: 'semibalance.agua', nivel: 'universitario' },
  { id: 'semibalance.protones', nivel: 'quimico' },
  { id: 'semibalance.medio-basico', nivel: 'quimico' }
]

const RENG_OBJETIVO_SEMI: Record<string, { sustancias: string[]; medio?: 'ácido' | 'básico' }> = {
  'semibalance.electrones': { sustancias: ['e'] },
  'semibalance.agua': { sustancias: ['H2O'], medio: 'ácido' },
  'semibalance.protones': { sustancias: ['H'], medio: 'ácido' },
  'semibalance.medio-basico': { sustancias: ['OH', 'H2O'], medio: 'básico' }
}

export const RENG_FAMILIA_SEMIRREACCION_BALANCE: RengFamilia = {
  id: 'inorganica.semirreaccion-balance',
  rama: 'inorganica',
  tema: 'redox',
  nombre: 'Localizar el error de balance en una semirreacción',
  descripcion: 'Encontrar qué término de una semirreacción incumple el balance de átomos o de carga.',
  niveles: ['universitario', 'quimico'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = rengVarianteDeSemilla(RENG_VARIANTES_SEMIRREACCION_BALANCE, nivel, semilla)
    if (!rengVar) return null
    const rengObj = RENG_OBJETIVO_SEMI[rengVar.id]!
    const rengBase = rengElegir(azar, RENG_SEMIRREACCIONES_BALANCE.filter((rengS) => (!rengObj.medio || rengS.medio === rengObj.medio) && rengS.terminos.some((rengT) => rengObj.sustancias.includes(rengT.id))))
    if (rengBalanceSemirreaccion(rengBase.terminos).equilibrada === false) return null
    const rengObjetivos = rengBase.terminos.filter((rengT) => rengObj.sustancias.includes(rengT.id))
    const rengElegido = rengElegir(azar, rengObjetivos)
    const rengNuevoCoef = rengElegido.coef + (azar() < 0.5 ? -1 : 1) * (1 + Math.floor(azar() * 2))
    if (rengNuevoCoef < 1 || rengNuevoCoef === rengElegido.coef) return null
    const rengErroneos = rengBase.terminos.map((rengT) => (rengT === rengElegido ? { ...rengT, coef: rengNuevoCoef } : rengT))
    const rengBal = rengBalanceSemirreaccion(rengErroneos)
    if (rengBal.equilibrada) return null
    const rengArreglos = rengErroneos.filter((rengT, rengI) => {
      for (let rengC = 1; rengC <= 20; rengC++) {
        const rengPrueba = rengErroneos.map((rengX, rengJ) => (rengJ === rengI ? { ...rengX, coef: rengC } : rengX))
        if (rengBalanceSemirreaccion(rengPrueba).equilibrada) return true
      }
      return false
    })
    if (rengArreglos.length !== 1 || rengArreglos[0] !== rengErroneos[rengBase.terminos.indexOf(rengElegido)]) return null
    const rengEtiquetaTermino = (rengT: RengTerminoSemi): string => `${RENG_ESPECIES[rengT.id]!.etiqueta} (coeficiente ${rengT.coef}, ${rengT.lado === 'izq' ? 'reactivos' : 'productos'})`
    const rengOp = rengOpciones(azar, rengEtiquetaTermino(rengErroneos[rengBase.terminos.indexOf(rengElegido)]!), rengErroneos.map(rengEtiquetaTermino), Math.min(4, rengErroneos.length))
    const rengTextoFalloCorrecto = rengTextoFallos(rengBal.fallos)
    const rengMetodo: RengMetodo = (() => {
      const rengTodas = rengMezclar(azar, [rengTextoFalloCorrecto, ...rengMezclar(azar, RENG_TEXTOS_FALLO.filter((rengT) => rengT !== rengTextoFalloCorrecto)).slice(0, 3)])
      const rengOpc = rengTodas.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
      return { pregunta: '¿Qué balances incumple la semirreacción tal como está escrita?', opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengTextoFalloCorrecto)!.id, explicacion: 'Se cuentan los átomos de cada elemento y la carga neta a cada lado: los que no coinciden delatan el término equivocado.' }
    })()
    const rengCorrectoTexto = rengTextoSemi(rengBase.terminos)
    return {
      variante: rengVar.id,
      titulo: 'Término que rompe el balance',
      enunciado: `Un estudiante escribe, en medio ${rengBase.medio}, la semirreacción de reducción de ${rengBase.nombre}: ${rengTextoSemi(rengErroneos)}. Un solo coeficiente es incorrecto.`,
      pregunta: '¿Qué término tiene el coeficiente equivocado?',
      datos: [rengDatoT('semi', 'Semirreacción propuesta', rengTextoSemi(rengErroneos)), rengDatoT('medio', 'Medio', rengBase.medio)],
      respuesta: { tipo: 'opcion', ...rengOp },
      metodo: rengMetodo,
      criterioCompleto: 'Cuenta como respuesta completa: el término equivocado y los balances (átomos o carga) que incumple.',
      hipotesis: nivel === 'quimico' ? [`Medio ${rengBase.medio}: se dispone de ${rengBase.medio === 'ácido' ? 'H⁺ y H₂O' : 'OH⁻ y H₂O'}.`, 'Solo se ha modificado un coeficiente.'] : undefined,
      pistas: ['Cuenta los átomos de cada elemento a ambos lados y suma las cargas.', `A la izquierda la carga es ${rengBal.izq.carga} y a la derecha ${rengBal.der.carga}; compara también los átomos de H y de O.`, `Los balances que fallan son: ${rengBal.fallos.join(', ')}. Solo un término los arregla.`],
      pasos: [`Átomos a la izquierda: ${Object.entries(rengBal.izq.atomos).map(([rengE, rengN]) => `${rengE} ${rengN}`).join(', ')}; carga ${rengBal.izq.carga}.`, `Átomos a la derecha: ${Object.entries(rengBal.der.atomos).map(([rengE, rengN]) => `${rengE} ${rengN}`).join(', ')}; carga ${rengBal.der.carga}.`, `${rengTextoFalloCorrecto}: el término que lo corrige es ${RENG_ESPECIES[rengElegido.id]!.etiqueta} con coeficiente ${rengElegido.coef}.`, `Semirreacción correcta: ${rengCorrectoTexto}`],
      comprobacion: 'Con el coeficiente corregido, cada elemento y la carga deben coincidir a ambos lados.',
      errorFrecuente: 'Ajustar solo los átomos y olvidar la carga (o al revés).',
      fuente: RENG_FUENTE_DIDACTICA
    }
  }
}

export const RENG_FAMILIAS_RAZONAMIENTO_INORGANICA: readonly RengFamilia[] = [RENG_FAMILIA_FORMULA_CARGA, RENG_FAMILIA_SEMIRREACCION_BALANCE]
