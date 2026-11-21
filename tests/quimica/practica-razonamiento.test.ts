import { describe, expect, it } from 'vitest'
import { RENG_FAMILIAS, RENG_FAMILIAS_RAZONAMIENTO, rengCorregirEjercicio, rengCorregirMetodo, rengCorreccionCompleta, rengGenerarDeFamilia, rengRespuestaTexto } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_VARIANTES_UNIDADES } from '../../src/renderer/modules/simulador-quimica/practica/familias/razonamientoGeneral'
import { RENG_VARIANTES_FORMULA_CARGA, RENG_VARIANTES_SEMIRREACCION_BALANCE } from '../../src/renderer/modules/simulador-quimica/practica/familias/razonamientoInorganica'
import { RENG_VARIANTES_COMPARAR, RENG_VARIANTES_ESTEREO_SUFICIENCIA } from '../../src/renderer/modules/simulador-quimica/practica/familias/razonamientoOrganica'
import { RENG_VARIANTES_CURVA, RENG_VARIANTES_INTERPOLAR } from '../../src/renderer/modules/simulador-quimica/practica/familias/razonamientoAnalitica'
import { RENG_VARIANTES_EQUILIBRIO_SUFICIENCIA, RENG_VARIANTES_MODELO_CINETICO } from '../../src/renderer/modules/simulador-quimica/practica/familias/razonamientoFisicoquimica'
import { RENG_VARIANTES_LIMITANTE } from '../../src/renderer/modules/simulador-quimica/practica/familias/razonamientoGeneral'
import type { RengEjercicio, RengFamilia } from '../../src/renderer/modules/simulador-quimica/practica/tipos'

const RENG_TODAS_VARIANTES = [
  ...RENG_VARIANTES_UNIDADES.map((rengV) => ({ ...rengV, familia: 'general.unidades-preparacion' })),
  ...RENG_VARIANTES_LIMITANTE.map((rengV) => ({ ...rengV, familia: 'general.limitante-tabla' })),
  ...RENG_VARIANTES_FORMULA_CARGA.map((rengV) => ({ ...rengV, familia: 'inorganica.formula-carga' })),
  ...RENG_VARIANTES_SEMIRREACCION_BALANCE.map((rengV) => ({ ...rengV, familia: 'inorganica.semirreaccion-balance' })),
  ...RENG_VARIANTES_COMPARAR.map((rengV) => ({ id: rengV.id, nivel: rengV.nivel, familia: 'organica.comparar-estructuras' })),
  ...RENG_VARIANTES_ESTEREO_SUFICIENCIA.map((rengV) => ({ id: rengV.id, nivel: rengV.nivel, familia: 'organica.estereo-suficiencia' })),
  ...RENG_VARIANTES_CURVA.map((rengV) => ({ ...rengV, familia: 'analitica.curva-equivalencia' })),
  ...RENG_VARIANTES_INTERPOLAR.map((rengV) => ({ ...rengV, familia: 'analitica.interpolar-calibracion' })),
  ...RENG_VARIANTES_MODELO_CINETICO.map((rengV) => ({ ...rengV, familia: 'fisicoquimica.modelo-cinetico' })),
  ...RENG_VARIANTES_EQUILIBRIO_SUFICIENCIA.map((rengV) => ({ ...rengV, familia: 'fisicoquimica.equilibrio-suficiencia' }))
]

const rengFamilia = (rengId: string): RengFamilia => RENG_FAMILIAS.find((rengF) => rengF.id === rengId)!

const rengEjemplos = (rengVariante: { id: string; nivel: 'preuniversitario' | 'universitario' | 'quimico' | 'cientifico'; familia: string }, rengMax = 6): RengEjercicio[] => {
  const rengLista: RengEjercicio[] = []
  for (let rengS = 1; rengS <= 400 && rengLista.length < rengMax; rengS++) {
    const rengE = rengGenerarDeFamilia(rengFamilia(rengVariante.familia), rengVariante.nivel, rengS)
    if (rengE?.variante === rengVariante.id) rengLista.push(rengE)
  }
  return rengLista
}

const rengNum = (rengT: string | number): number => (typeof rengT === 'number' ? rengT : Number(rengT.replace(/\s/g, '').replace(',', '.')))
const rengDato = (rengE: RengEjercicio, rengClave: string): number => rengE.datos.find((rengD) => rengD.clave === rengClave)!.valor as number
const rengTextoOpcionCorrecta = (rengE: RengEjercicio): string => {
  if (rengE.respuesta.tipo !== 'opcion') throw new Error('no es opción')
  return rengE.respuesta.opciones.find((rengO) => rengO.id === (rengE.respuesta as { correcta: string }).correcta)!.texto
}
const rengTextoMetodoCorrecto = (rengE: RengEjercicio): string => rengE.metodo!.opciones.find((rengO) => rengO.id === rengE.metodo!.correcta)!.texto
const rengSub = (rengT: string): string => rengT.replace(/[₀-₉]/g, (rengC) => String(rengC.charCodeAt(0) - 0x2080))

describe('Entrega C: inventario de los tipos nuevos', () => {
  it('hay 10 tipos nuevos, dos por rama, con al menos tres variantes comprobadas cada uno (30 o más en total)', () => {
    expect(RENG_FAMILIAS_RAZONAMIENTO).toHaveLength(10)
    for (const rengRama of ['general', 'inorganica', 'organica', 'analitica', 'fisicoquimica']) expect(RENG_FAMILIAS_RAZONAMIENTO.filter((rengF) => rengF.rama === rengRama), rengRama).toHaveLength(2)
    for (const rengF of RENG_FAMILIAS_RAZONAMIENTO) expect(RENG_TODAS_VARIANTES.filter((rengV) => rengV.familia === rengF.id).length, rengF.id).toBeGreaterThanOrEqual(3)
    expect(RENG_TODAS_VARIANTES.length).toBeGreaterThanOrEqual(30)
    expect(new Set(RENG_TODAS_VARIANTES.map((rengV) => rengV.id)).size).toBe(RENG_TODAS_VARIANTES.length)
  })
  it('cada variante se genera de forma reproducible y se alcanza con una semilla', () => {
    for (const rengV of RENG_TODAS_VARIANTES) {
      const rengLista = rengEjemplos(rengV, 3)
      expect(rengLista.length, rengV.id).toBeGreaterThanOrEqual(1)
      for (const rengE of rengLista) {
        const rengOtra = rengGenerarDeFamilia(rengFamilia(rengV.familia), rengV.nivel, rengE.semilla)
        expect(JSON.stringify(rengOtra), rengV.id).toBe(JSON.stringify(rengE))
      }
    }
  })
  it('los cuatro niveles reciben contenido nuevo y Científico incluye interpretación de datos y justificación del modelo', () => {
    expect(new Set(RENG_TODAS_VARIANTES.map((rengV) => rengV.nivel))).toEqual(new Set(['preuniversitario', 'universitario', 'quimico', 'cientifico']))
    const rengCientificas = RENG_TODAS_VARIANTES.filter((rengV) => rengV.nivel === 'cientifico').map((rengV) => rengV.id)
    expect(rengCientificas.some((rengId) => rengId.startsWith('modelo.residuos'))).toBe(true)
    expect(rengCientificas.some((rengId) => rengId.startsWith('interpolar.'))).toBe(true)
    expect(rengCientificas.some((rengId) => rengId.startsWith('equilibrio-suficiencia.aproximacion'))).toBe(true)
  })
})

describe('Entrega C: formato de cada actividad', () => {
  for (const rengV of RENG_TODAS_VARIANTES) {
    it(`${rengV.id}: enunciado, datos, tres pistas progresivas, resolución, error frecuente y criterio de respuesta completa`, () => {
      for (const rengE of rengEjemplos(rengV)) {
        expect(rengE.enunciado.length, rengE.id).toBeGreaterThan(40)
        expect(rengE.pistas, rengE.id).toHaveLength(3)
        expect(new Set(rengE.pistas).size, `${rengE.id}: pistas repetidas`).toBe(3)
        expect(rengE.pasos.length, rengE.id).toBeGreaterThanOrEqual(2)
        expect(rengE.errorFrecuente!.length, rengE.id).toBeGreaterThan(15)
        expect(rengE.fuente!.verificacion, rengE.id).toBe('didactico')
        expect(rengE.datos.length > 0 || !!rengE.tabla || !!rengE.grafica || !!rengE.estructuras, `${rengE.id}: sin datos`).toBe(true)
        if (rengE.metodo) expect(rengE.criterioCompleto, `${rengE.id}: método sin criterio de respuesta completa`).toMatch(/respuesta completa/)
        if (rengE.grafica) {
          const rengG = rengE.grafica
          expect(rengG.tituloX, rengE.id).toMatch(/\(.+\)|adimensional/)
          expect(rengG.tituloY, rengE.id).toMatch(/pH|Absorbancia|\(.+\)|adimensional/)
          expect(rengG.descripcion.length, rengE.id).toBeGreaterThan(40)
          expect(rengG.tabla.filas.length, `${rengE.id}: la tabla equivalente debe tener tantas filas como puntos`).toBe(Math.max(...rengG.series.map((rengS) => rengS.puntos.length)))
          if (rengG.series.length > 1) expect(new Set(rengG.series.map((rengS) => rengS.marcador)).size, `${rengE.id}: series distinguibles sin color`).toBe(rengG.series.length)
        }
        const rengCompleta = rengCorreccionCompleta(rengE, rengRespuestaTexto(rengE), rengE.metodo?.correcta ?? null)
        expect(rengCompleta.completa, `${rengE.id}: la respuesta de referencia no se acepta`).toBe(true)
        if (rengE.metodo) {
          const rengSoloRespuesta = rengCorreccionCompleta(rengE, rengRespuestaTexto(rengE), rengE.metodo.opciones.find((rengO) => rengO.id !== rengE.metodo!.correcta)!.id)
          expect(rengSoloRespuesta.completa, `${rengE.id}: acepta un método incorrecto`).toBe(false)
          expect(rengCorreccionCompleta(rengE, rengRespuestaTexto(rengE), null).completa).toBe(false)
          expect(rengCorregirMetodo(rengE, null)!.tipo).toBe('entrada-invalida')
        }
      }
    })
  }
})

describe('Entrega C · General: reproducción independiente', () => {
  it('error de unidades: la concentración correcta sale del análisis dimensional con los datos del enunciado', () => {
    for (const rengV of RENG_VARIANTES_UNIDADES) {
      for (const rengE of rengEjemplos({ ...rengV, familia: 'general.unidades-preparacion' })) {
        if (rengE.respuesta.tipo !== 'numero') throw new Error('debe ser numérica')
        let rengEsperado: number
        if (rengV.id === 'unidades.masa-mg-como-g') rengEsperado = rengDato(rengE, 'm') * 1e-3 / rengDato(rengE, 'M') / (rengDato(rengE, 'V') * 1e-3)
        else if (rengV.id === 'unidades.volumen-ml-como-l') rengEsperado = rengDato(rengE, 'm') / rengDato(rengE, 'M') / (rengDato(rengE, 'V') * 1e-3)
        else if (rengV.id === 'unidades.conc-mmol-como-mol') rengEsperado = (rengDato(rengE, 'C1') * 1e-3 * rengDato(rengE, 'V1')) / rengDato(rengE, 'V2')
        else rengEsperado = (rengDato(rengE, 'C1') * (rengDato(rengE, 'V1') * 1e-3)) / rengDato(rengE, 'V2')
        expect(rengE.respuesta.valor, rengE.id).toBeCloseTo(rengEsperado, 9)
        expect(rengE.respuesta.unidad).toBe('mol/L')
        expect(rengE.respuesta.erroresComunes[0]!.valor / rengE.respuesta.valor, `${rengE.id}: el error de unidades debe ser un factor 1000`).toBeCloseTo(rengV.id === 'unidades.volumen-ml-como-l' ? 1e-3 : 1e3, 6)
        expect(rengCorregirEjercicio(rengE, `${rengE.respuesta.erroresComunes[0]!.valor}`).tipo, rengE.id).not.toBe('correcto')
        expect(rengCorregirEjercicio(rengE, `${(rengEsperado * 1000).toExponential(5)} mmol/L`).tipo, 'otra unidad compatible').toBe('correcto')
        expect(rengCorregirEjercicio(rengE, '3 g').tipo).toBe('unidad-incompatible')
        expect(rengCorregirEjercicio(rengE, 'no sé').tipo).toBe('entrada-invalida')
      }
    }
    const rengE = rengEjemplos({ id: 'unidades.masa-mg-como-g', nivel: 'preuniversitario', familia: 'general.unidades-preparacion' }, 1)[0]!
    expect(rengTextoMetodoCorrecto(rengE)).toMatch(/mg/)
  })
  it('reactivo limitante en tabla: argmin de cantidad/coeficiente por otro camino y masa o moles sobrantes', () => {
    for (const rengV of RENG_VARIANTES_LIMITANTE) {
      for (const rengE of rengEjemplos({ ...rengV, familia: 'general.limitante-tabla' })) {
        const rengFilas = rengE.tabla!.filas
        if (rengV.id === 'limitante.disoluciones-sobrante') {
          const [rengNaOH, rengAcido] = rengFilas
          const rengN1 = rengNum(rengNaOH![2]!) * (rengNum(rengNaOH![3]!) / 1000)
          const rengN2 = rengNum(rengAcido![2]!) * (rengNum(rengAcido![3]!) / 1000)
          const rengSobra = rengN1 / 2 < rengN2 ? rengN2 - rengN1 / 2 : rengN1 - 2 * rengN2
          expect(rengE.respuesta.tipo === 'numero' && rengE.respuesta.valor, rengE.id).toBeCloseTo(rengSobra, 9)
          continue
        }
        const rengCoef = rengFilas.map((rengF) => rengNum(rengF[rengV.id === 'limitante.diagrama-particulas' ? 2 : 1]!))
        const rengCantidad = rengFilas.map((rengF) => (rengV.id === 'limitante.tabla-masas-sobrante' ? rengNum(rengF[2]!) / rengNum(rengF[3]!) : rengNum(rengF[rengV.id === 'limitante.diagrama-particulas' ? 1 : 2]!)))
        const rengAvance = rengCantidad.map((rengC, rengI) => rengC / rengCoef[rengI]!)
        const rengLim = rengAvance[0]! < rengAvance[1]! ? 0 : 1
        if (rengV.id === 'limitante.tabla-masas-sobrante') {
          const rengExc = 1 - rengLim
          const rengMasaExc = rengNum(rengFilas[rengExc]![2]!)
          const rengSobra = rengMasaExc - Math.min(...rengAvance) * rengCoef[rengExc]! * rengNum(rengFilas[rengExc]![3]!)
          expect(rengE.respuesta.tipo === 'numero' && rengE.respuesta.valor, rengE.id).toBeCloseTo(rengSobra, 6)
          const rengNombre = rengFilas[rengExc]![0] as string
          expect(rengE.pregunta, rengE.id).toContain(rengNombre)
        } else {
          expect(rengTextoOpcionCorrecta(rengE), rengE.id).toBe(rengFilas[rengLim]![0])
          expect(rengAvance[0], 'el reactivo con menos cantidad no siempre es el limitante').not.toBe(rengAvance[1])
        }
      }
    }
  })
  it('al menos una variante de la tabla tiene como limitante el reactivo con MÁS moles (se prueba que no basta comparar cantidades)', () => {
    let rengContraintuitivo = 0
    for (let rengS = 1; rengS <= 120; rengS++) {
      const rengE = rengGenerarDeFamilia(rengFamilia('general.limitante-tabla'), 'universitario', rengS)
      if (!rengE || rengE.variante !== 'limitante.tabla-moles') continue
      const [rengA, rengB] = rengE.tabla!.filas
      const rengLim = rengNum(rengA![2]!) / rengNum(rengA![1]!) < rengNum(rengB![2]!) / rengNum(rengB![1]!) ? 0 : 1
      const rengMenos = rengNum(rengA![2]!) < rengNum(rengB![2]!) ? 0 : 1
      if (rengLim !== rengMenos) rengContraintuitivo++
    }
    expect(rengContraintuitivo).toBeGreaterThan(0)
  })
})

const RENG_CARGAS: Record<string, number> = { Na: 1, K: 1, Mg: 2, Ca: 2, Zn: 2, Al: 3, Fe: 3, Cl: -1, O: -2, S: -2, N: -3, NO3: -1, SO4: -2, PO4: -3, OH: -1 }

function rengCargaNetaFormula(rengFormula: string): number {
  const rengCat = ['Na', 'K', 'Mg', 'Ca', 'Zn', 'Al', 'Fe'].find((rengC) => rengFormula.startsWith(rengC))!
  const rengResto = rengFormula.slice(rengCat.length)
  const rengCuentaCat = /^(\d*)(.*)$/.exec(rengResto)!
  const rengNCat = rengCuentaCat[1] === '' ? 1 : Number(rengCuentaCat[1])
  const rengAnionTexto = rengCuentaCat[2]!
  const rengConParentesis = /^\((.+)\)(\d*)$/.exec(rengAnionTexto)
  let rengAn: string
  let rengNAn: number
  if (rengConParentesis) {
    rengAn = rengConParentesis[1]!
    rengNAn = rengConParentesis[2] === '' ? 1 : Number(rengConParentesis[2])
  } else {
    rengAn = ['NO3', 'SO4', 'PO4', 'OH', 'Cl', 'O', 'S', 'N'].find((rengA) => rengAnionTexto.startsWith(rengA))!
    const rengDig = rengAnionTexto.slice(rengAn.length)
    rengNAn = rengDig === '' ? 1 : Number(rengDig)
  }
  return rengNCat * RENG_CARGAS[rengCat]! + rengNAn * RENG_CARGAS[rengAn]!
}

describe('Entrega C · Inorgánica: reproducción independiente', () => {
  it('fórmula y carga: la fórmula correcta es neutra y mínima, la propuesta en el enunciado no lo es', () => {
    for (const rengV of RENG_VARIANTES_FORMULA_CARGA.filter((rengX) => rengX.id !== 'carga.cual-es-incoherente')) {
      for (const rengE of rengEjemplos({ ...rengV, familia: 'inorganica.formula-carga' })) {
        if (rengE.respuesta.tipo !== 'formula') throw new Error('formula')
        expect(rengCargaNetaFormula(rengE.respuesta.formula), `${rengE.id}: ${rengE.respuesta.formula}`).toBe(0)
        const rengPropuesta = /fórmula ([^ ]+) para/.exec(rengSub(rengE.enunciado))![1]!
        expect(rengCargaNetaFormula(rengPropuesta), `${rengE.id}: propuesta ${rengPropuesta}`).not.toBe(0)
        expect(rengCorregirEjercicio(rengE, rengPropuesta).tipo, 'la propuesta incoherente no puede aceptarse').not.toBe('correcto')
        expect(rengCorregirEjercicio(rengE, rengE.respuesta.formula.replace(/(\d)/g, '₍$1₎')).tipo).not.toBe('correcto')
        expect(rengTextoMetodoCorrecto(rengE)).toMatch(/suma de cargas no es cero/)
      }
    }
  })
  it('entre cuatro fórmulas, solo la marcada como respuesta tiene carga neta distinta de cero', () => {
    for (const rengE of rengEjemplos({ ...RENG_VARIANTES_FORMULA_CARGA.find((rengV) => rengV.id === 'carga.cual-es-incoherente')!, familia: 'inorganica.formula-carga' }, 8)) {
      const rengTextos = [...rengSub(rengE.enunciado).matchAll(/([A-Za-z0-9()]+) \(([^)]+) y ([^)]+)\)/g)].map((rengM) => rengM[1]!)
      expect(rengTextos).toHaveLength(4)
      const rengIncoherentes = rengTextos.filter((rengF) => rengCargaNetaFormula(rengF) !== 0)
      expect(rengIncoherentes, rengE.id).toHaveLength(1)
      expect(rengSub(rengTextoOpcionCorrecta(rengE)).startsWith(rengIncoherentes[0]!)).toBe(true)
    }
  })
  it('semirreacción: se recuentan átomos y carga con una tabla propia, un solo coeficiente es erróneo y el término marcado es el que lo corrige', () => {
    const rengE: Record<string, { a: Record<string, number>; q: number }> = {
      'MnO₄⁻': { a: { Mn: 1, O: 4 }, q: -1 }, 'Mn²⁺': { a: { Mn: 1 }, q: 2 }, 'Cr₂O₇²⁻': { a: { Cr: 2, O: 7 }, q: -2 }, 'Cr³⁺': { a: { Cr: 1 }, q: 3 }, 'NO₃⁻': { a: { N: 1, O: 3 }, q: -1 }, NO: { a: { N: 1, O: 1 }, q: 0 },
      'MnO₂': { a: { Mn: 1, O: 2 }, q: 0 }, 'H⁺': { a: { H: 1 }, q: 1 }, 'OH⁻': { a: { O: 1, H: 1 }, q: -1 }, 'H₂O': { a: { H: 2, O: 1 }, q: 0 }, 'e⁻': { a: {}, q: -1 }
    }
    const rengLado = (rengT: string): Array<{ coef: number; esp: string }> => rengT.split(' + ').map((rengX) => { const rengM = /^(\d+ )?(.+)$/.exec(rengX.trim())!; return { coef: rengM[1] ? Number(rengM[1]) : 1, esp: rengM[2]! } })
    const rengBalance = (rengL: Array<{ coef: number; esp: string }>): { a: Record<string, number>; q: number } => {
      const rengA: Record<string, number> = {}
      let rengQ = 0
      for (const { coef, esp } of rengL) { for (const [rengEl, rengN] of Object.entries(rengE[esp]!.a)) rengA[rengEl] = (rengA[rengEl] ?? 0) + coef * rengN; rengQ += coef * rengE[esp]!.q }
      return { a: rengA, q: rengQ }
    }
    for (const rengV of RENG_VARIANTES_SEMIRREACCION_BALANCE) {
      for (const rengEj of rengEjemplos({ ...rengV, familia: 'inorganica.semirreaccion-balance' })) {
        const rengEcuacion = /: ([^.]+→[^.]+)\. Un solo/.exec(rengEj.enunciado)![1]!
        const [rengIzq, rengDer] = rengEcuacion.split(' → ').map(rengLado) as [ReturnType<typeof rengLado>, ReturnType<typeof rengLado>]
        const rengBI = rengBalance(rengIzq)
        const rengBD = rengBalance(rengDer)
        const rengFallos: string[] = []
        for (const rengEl of ['H', 'O']) if ((rengBI.a[rengEl] ?? 0) !== (rengBD.a[rengEl] ?? 0)) rengFallos.push(`los átomos de ${rengEl}`)
        if (rengBI.q !== rengBD.q) rengFallos.push('la carga')
        expect(rengFallos.length, `${rengEj.id}: debe estar desequilibrada`).toBeGreaterThan(0)
        const rengTextoFallo = rengFallos.length === 1 ? `Solo falla ${rengFallos[0]}` : `Fallan ${rengFallos.slice(0, -1).join(', ')} y ${rengFallos.at(-1)}`
        expect(rengTextoMetodoCorrecto(rengEj), rengEj.id).toBe(rengTextoFallo.replace('Solo falla los átomos', 'Solo fallan los átomos').replace('Fallan los átomos de H y de O', 'Fallan los átomos de H y de O'))
        const rengTodos = [...rengIzq.map((rengT) => ({ ...rengT, lado: 'izq' })), ...rengDer.map((rengT) => ({ ...rengT, lado: 'der' }))]
        const rengArreglos = rengTodos.filter((_, rengI) => {
          for (let rengC = 1; rengC <= 20; rengC++) {
            const rengP = rengTodos.map((rengT, rengJ) => (rengJ === rengI ? { ...rengT, coef: rengC } : rengT))
            const rengX = rengBalance(rengP.filter((rengT) => rengT.lado === 'izq'))
            const rengY = rengBalance(rengP.filter((rengT) => rengT.lado === 'der'))
            if (JSON.stringify(Object.entries(rengX.a).sort()) === JSON.stringify(Object.entries(rengY.a).sort()) && rengX.q === rengY.q) return true
          }
          return false
        })
        expect(rengArreglos, rengEj.id).toHaveLength(1)
        expect(rengTextoOpcionCorrecta(rengEj)).toContain(`${rengArreglos[0]!.esp} (coeficiente ${rengArreglos[0]!.coef}`)
      }
    }
  })
})

describe('Entrega C · Orgánica: reproducción independiente', () => {
  const rengRelaciones: Array<[string, string, string]> = [
    ['CCO', 'OCC', 'Son la misma sustancia'], ['CC(C)O', 'OC(C)C', 'Son la misma sustancia'], ['CC(=O)O', 'OC(C)=O', 'Son la misma sustancia'],
    ['CCO', 'COC', 'Son isómeros constitucionales'], ['CC(C)O', 'CCCO', 'Son isómeros constitucionales'], ['CCC=O', 'CC(C)=O', 'Son isómeros constitucionales'],
    ['CCO', 'CCCO', 'Son sustancias con distinta fórmula'], ['CC(=O)O', 'CC=O', 'Son sustancias con distinta fórmula'], ['CCC', 'CC=C', 'Son sustancias con distinta fórmula'],
    ['C/C=C/C', 'C/C=C\\C', 'Son diastereoisómeros'], ['C/C=C/CC', 'C/C=C\\CC', 'Son diastereoisómeros'], ['O=C(O)/C=C/C(=O)O', 'O=C(O)/C=C\\C(=O)O', 'Son diastereoisómeros'],
    ['C[C@H](O)C(=O)O', 'C[C@@H](O)C(=O)O', 'Son enantiómeros'], ['C[C@H](N)C(=O)O', 'C[C@@H](N)C(=O)O', 'Son enantiómeros'], ['CC[C@H](C)O', 'CC[C@@H](C)O', 'Son enantiómeros']
  ]
  it('comparar estructuras: la relación marcada coincide con la etiquetada a mano para cada par posible', () => {
    let rengVistos = 0
    for (const rengV of RENG_VARIANTES_COMPARAR) {
      for (const rengE of rengEjemplos({ id: rengV.id, nivel: rengV.nivel, familia: 'organica.comparar-estructuras' }, 12)) {
        const rengA = rengE.estructuras![0]!.smiles
        const rengB = rengE.estructuras![1]!.smiles
        const rengPar = rengRelaciones.find(([rengX, rengY]) => (rengX === rengA && rengY === rengB) || (rengX === rengB && rengY === rengA))
        expect(rengPar, `${rengE.id}: par sin etiqueta manual ${rengA} / ${rengB}`).toBeDefined()
        expect(rengTextoOpcionCorrecta(rengE).startsWith(rengPar![2]), rengE.id).toBe(true)
        expect(rengE.enunciado).toContain(rengA)
        expect(rengE.enunciado).toContain(rengB)
        rengVistos++
      }
    }
    expect(rengVistos).toBeGreaterThan(15)
  })
  it('suficiencia de la información estereoquímica: asignaciones conocidas (L-láctico y L-alanina son S; el doble enlace trans es E)', () => {
    const rengEsperado: Record<string, string> = {
      'CCC(C)O': 'No basta: el SMILES no define la configuración', 'CC(O)C(=O)O': 'No basta: el SMILES no define la configuración', 'CC(N)C(=O)O': 'No basta: el SMILES no define la configuración',
      'C[C@H](O)C(=O)O': 'Sí: el centro es (S)', 'C[C@@H](O)C(=O)O': 'Sí: el centro es (R)', 'C[C@H](N)C(=O)O': 'Sí: el centro es (S)', 'C[C@@H](N)C(=O)O': 'Sí: el centro es (R)',
      'CC(C)O': 'No hay ningún elemento estereogénico: no hay nada que asignar', 'CCC(C)(C)O': 'No hay ningún elemento estereogénico: no hay nada que asignar', 'CC(=O)O': 'No hay ningún elemento estereogénico: no hay nada que asignar',
      'CC=CC': 'No basta: el SMILES no define la configuración', 'CC=CCC': 'No basta: el SMILES no define la configuración', 'C/C=C/C': 'Sí: el doble enlace es E', 'C/C=C\\C': 'Sí: el doble enlace es Z',
      'C[C@H](Br)C(Br)C': 'No basta: solo está definida una parte de los elementos estereogénicos', 'C[C@H](O)C(O)CC': 'No basta: solo está definida una parte de los elementos estereogénicos', 'CC(Br)[C@H](Br)C': 'No basta: solo está definida una parte de los elementos estereogénicos'
    }
    let rengVistos = 0
    for (const rengV of RENG_VARIANTES_ESTEREO_SUFICIENCIA) {
      for (const rengE of rengEjemplos({ id: rengV.id, nivel: rengV.nivel, familia: 'organica.estereo-suficiencia' }, 12)) {
        const rengSmiles = rengE.estructuras![0]!.smiles
        expect(rengEsperado[rengSmiles], `${rengE.id}: ${rengSmiles} sin etiqueta manual`).toBeDefined()
        expect(rengTextoOpcionCorrecta(rengE), rengE.id).toBe(rengEsperado[rengSmiles])
        rengVistos++
      }
    }
    expect(rengVistos).toBeGreaterThan(10)
  })
  it('un par con estereoquímica parcial no se confunde con uno definido en la corrección de estructuras', () => {
    const rengE = rengEjemplos({ id: 'suficiencia.parcial', nivel: 'quimico', familia: 'organica.estereo-suficiencia' }, 1)[0]!
    expect(rengCorregirEjercicio(rengE, rengE.respuesta.tipo === 'opcion' ? rengE.respuesta.opciones.find((rengO) => rengO.id !== (rengE.respuesta as { correcta: string }).correcta)!.id : '').tipo).toBe('incorrecto')
  })
})

describe('Entrega C · Analítica: reproducción independiente', () => {
  it('curva de valoración: el equivalente sale de n(ácido) = n(base) y del mayor salto de la tabla, ambos coinciden', () => {
    for (const rengV of RENG_VARIANTES_CURVA) {
      for (const rengE of rengEjemplos({ ...rengV, familia: 'analitica.curva-equivalencia' })) {
        const rengFilas = rengE.grafica!.tabla.filas.map((rengF) => [rengNum(rengF[0]!), rengNum(rengF[1]!)] as [number, number])
        let rengSaltoMax = 0
        let rengVeq = 0
        for (let rengI = 1; rengI < rengFilas.length; rengI++) {
          const rengPend = (rengFilas[rengI]![1] - rengFilas[rengI - 1]![1]) / (rengFilas[rengI]![0] - rengFilas[rengI - 1]![0])
          if (rengPend > rengSaltoMax) { rengSaltoMax = rengPend; rengVeq = (rengFilas[rengI]![0] + rengFilas[rengI - 1]![0]) / 2 }
        }
        const rengVa = rengDato(rengE, 'Va')
        const rengCb = rengDato(rengE, 'Cb')
        expect(rengFilas.every(([, rengPh], rengI) => rengI === 0 || rengPh >= rengFilas[rengI - 1]![1] - 1e-9), `${rengE.id}: el pH debe ser creciente`).toBe(true)
        if (rengV.id === 'curva.lectura-fuerte' || rengV.id === 'curva.lectura-fuerte-2') expect(rengE.respuesta.tipo === 'numero' && rengE.respuesta.valor).toBeCloseTo(rengVeq, 6)
        if (rengV.id === 'curva.concentracion-desde-curva') expect(rengE.respuesta.tipo === 'numero' && rengE.respuesta.valor).toBeCloseTo((rengCb * rengVeq) / rengVa, 6)
        if (rengV.id === 'curva.pka-debil') {
          const rengMitad = rengFilas.find(([rengVol]) => Math.abs(rengVol - rengVeq / 2) < 1e-9)!
          expect(rengMitad, `${rengE.id}: falta el punto de semiequivalencia`).toBeDefined()
          expect(Math.abs(rengMitad[1] - (rengE.respuesta.tipo === 'numero' ? rengE.respuesta.valor : NaN)), rengE.id).toBeLessThan(0.08)
          const rengDespues = rengFilas.find(([rengVol]) => rengVol > rengVeq)![1]
          expect(rengDespues).toBeGreaterThan(7)
        }
        if (rengV.id !== 'curva.pka-debil') expect(rengFilas.find(([rengVol]) => rengVol === rengVeq - 0.5)![1]).toBeLessThan(5)
        expect(rengE.grafica!.series[0]!.puntos).toHaveLength(rengFilas.length)
      }
    }
  })
  it('curva de valoración de ácido fuerte: el pH de la tabla coincide con el cálculo por exceso de reactivo', () => {
    for (const rengE of rengEjemplos({ id: 'curva.lectura-fuerte', nivel: 'preuniversitario', familia: 'analitica.curva-equivalencia' }, 4)) {
      const rengVeq = (rengE.respuesta.tipo === 'numero' ? rengE.respuesta.valor : 0)
      const rengCb = rengDato(rengE, 'Cb')
      const rengVa = rengDato(rengE, 'Va')
      const rengCa = (rengCb * rengVeq) / rengVa
      for (const [rengVol, rengPh] of rengE.grafica!.tabla.filas.map((rengF) => [rengNum(rengF[0]!), rengNum(rengF[1]!)] as [number, number])) {
        if (Math.abs(rengVol - rengVeq) < 0.6) continue
        const rengExceso = (rengCa * rengVa - rengCb * rengVol) / (rengVa + rengVol)
        const rengEsperado = rengExceso > 0 ? -Math.log10(rengExceso) : 14 + Math.log10(-rengExceso)
        expect(rengPh, `${rengE.id} V=${rengVol}`).toBeCloseTo(rengEsperado, 1)
      }
    }
  })
  it('interpolar o no: la decisión sigue el intervalo de los patrones y la saturación se detecta en los residuos', () => {
    for (const rengV of RENG_VARIANTES_INTERPOLAR) {
      for (const rengE of rengEjemplos({ ...rengV, familia: 'analitica.interpolar-calibracion' })) {
        const rengFilas = rengE.grafica!.tabla.filas
        const rengC = rengFilas.map((rengF) => rengNum(rengF[0]!))
        const rengA = rengFilas.map((rengF) => rengNum(rengF[1]!))
        if (rengV.id === 'interpolar.saturacion') {
          const rengDeTrazo = (rengX: number[], rengY: number[]): { m: number; b: number; res: number[] } => {
            const rengN = rengX.length
            const rengSx = rengX.reduce((a, b) => a + b)
            const rengSy = rengY.reduce((a, b) => a + b)
            const rengSxy = rengX.reduce((a, x, i) => a + x * rengY[i]!, 0)
            const rengSxx = rengX.reduce((a, x) => a + x * x, 0)
            const rengM = (rengN * rengSxy - rengSx * rengSy) / (rengN * rengSxx - rengSx * rengSx)
            const rengB = (rengSy - rengM * rengSx) / rengN
            return { m: rengM, b: rengB, res: rengX.map((x, i) => rengY[i]! - (rengB + rengM * x)) }
          }
          const rengTodos = rengDeTrazo(rengC, rengA)
          const rengSin = rengDeTrazo(rengC.slice(0, -1), rengA.slice(0, -1))
          const rengResUltimo = rengA.at(-1)! - (rengSin.b + rengSin.m * rengC.at(-1)!)
          expect(rengResUltimo, `${rengE.id}: el último patrón debe quedar por debajo de la recta`).toBeLessThan(-0.02)
          expect(Math.max(...rengSin.res.map(Math.abs)), `${rengE.id}: sin el último punto los residuos son pequeños`).toBeLessThan(0.005)
          expect(rengTodos.res.at(-1)!, `${rengE.id}: residuo del ajuste completo`).toBeLessThan(0)
          expect(rengE.respuesta.tipo === 'numero' && rengE.respuesta.valor).toBe(rengC.at(-2))
        } else {
          const rengMuestra = rengDato(rengE, 'A')
          const rengEsperada = rengMuestra > Math.max(...rengA) ? 'supera' : rengMuestra < Math.min(...rengA) ? 'por debajo' : 'dentro del intervalo'
          const rengTexto = rengTextoOpcionCorrecta(rengE)
          expect(rengTexto, rengE.id).toContain(rengEsperada === 'supera' ? 'supera' : rengEsperada === 'por debajo' ? 'por debajo' : 'dentro del intervalo')
        }
      }
    }
  })
})

describe('Entrega C · Fisicoquímica: reproducción independiente', () => {
  it('semividas sucesivas: orden 0 decrecen, orden 1 constantes, orden 2 crecen (con ±2 % de dispersión)', () => {
    for (const rengO of [0, 1, 2] as const) {
      for (const rengE of rengEjemplos({ id: `modelo.semividas-orden${rengO}`, nivel: 'quimico', familia: 'fisicoquimica.modelo-cinetico' })) {
        const rengT = rengE.grafica!.tabla.filas.map((rengF) => rengNum(rengF[2]!))
        const rengRazon = [rengT[1]! / rengT[0]!, rengT[2]! / rengT[1]!]
        for (const rengR of rengRazon) {
          if (rengO === 1) expect(rengR, rengE.id).toBeGreaterThan(0.94)
          if (rengO === 1) expect(rengR, rengE.id).toBeLessThan(1.06)
          if (rengO === 0) expect(rengR, rengE.id).toBeLessThan(0.56)
          if (rengO === 2) expect(rengR, rengE.id).toBeGreaterThan(1.8)
        }
        expect(rengE.respuesta.tipo === 'opcion' && rengE.respuesta.opciones.find((rengX) => rengX.id === (rengE.respuesta as { correcta: string }).correcta)!.texto).toBe(`Orden ${rengO}`)
      }
    }
  })
  it('residuos: se recalculan las tres regresiones con sumas y el orden verdadero es el único cuyos residuos alternan de signo', () => {
    for (const rengO of [0, 1, 2] as const) {
      const rengLista = rengEjemplos({ id: `modelo.residuos-orden${rengO}`, nivel: 'cientifico', familia: 'fisicoquimica.modelo-cinetico' }, 5)
      expect(rengLista.length, `orden ${rengO}`).toBeGreaterThanOrEqual(2)
      for (const rengE of rengLista) {
        const rengFilas = rengE.grafica!.tabla.filas
        const rengT = rengFilas.map((rengF) => rengNum(rengF[0]!))
        const rengA = rengFilas.map((rengF) => rengNum(rengF[1]!))
        const rengCambios = [0, 1, 2].map((rengOrden) => {
          const rengY = rengA.map((rengX) => (rengOrden === 0 ? rengX : rengOrden === 1 ? Math.log(rengX) : 1 / rengX))
          const rengN = rengT.length
          const rengSx = rengT.reduce((a, b) => a + b)
          const rengSy = rengY.reduce((a, b) => a + b)
          const rengSxy = rengT.reduce((a, x, i) => a + x * rengY[i]!, 0)
          const rengSxx = rengT.reduce((a, x) => a + x * x, 0)
          const rengM = (rengN * rengSxy - rengSx * rengSy) / (rengN * rengSxx - rengSx * rengSx)
          const rengB = (rengSy - rengM * rengSx) / rengN
          const rengRes = rengT.map((x, i) => rengY[i]! - (rengB + rengM * x))
          let rengC = 0
          for (let rengI = 1; rengI < rengRes.length; rengI++) if (Math.sign(rengRes[rengI]!) !== Math.sign(rengRes[rengI - 1]!)) rengC++
          const rengS = Math.sqrt(rengRes.reduce((a, r) => a + r * r, 0) / (rengN - 2))
          const rengNorm = rengRes.map((r) => r / rengS)
          rengFilas.forEach((rengF, rengI) => expect(rengNum(rengF[2 + rengOrden]!), `${rengE.id} residuo orden ${rengOrden} fila ${rengI}`).toBeCloseTo(rengNorm[rengI]!, 1))
          return rengC
        })
        expect(rengCambios[rengO], `${rengE.id}: el modelo verdadero alterna de signo`).toBeGreaterThanOrEqual(3)
        for (const rengOtro of [0, 1, 2].filter((rengX) => rengX !== rengO)) expect(rengCambios[rengOtro], `${rengE.id}: el modelo ${rengOtro} deja una curva`).toBeLessThanOrEqual(2)
      }
    }
  })
  it('equilibrio: Q y K se recalculan a mano y la conclusión sigue a Q/K, a la temperatura y a los datos que faltan', () => {
    const rengConPeso = (rengE: RengEjercicio): Record<string, number> => Object.fromEntries(rengE.datos.map((rengD) => [rengD.clave.slice(1), rengD.valor as number]))
    let rengVistos = 0
    for (const rengV of RENG_VARIANTES_EQUILIBRIO_SUFICIENCIA.filter((rengX) => ['equilibrio-suficiencia.datos-suficientes', 'equilibrio-suficiencia.datos-suficientes-2'].includes(rengX.id))) {
      for (const rengE of rengEjemplos({ ...rengV, familia: 'fisicoquimica.equilibrio-suficiencia' }, 12)) {
        const rengC = rengConPeso(rengE)
        const rengQ = rengE.enunciado.includes('H₂ + I₂') ? rengC['HI']! ** 2 / (rengC['H₂']! * rengC['I₂']!) : rengE.enunciado.includes('N₂O₄ ⇌') ? rengC['NO₂']! ** 2 / rengC['N₂O₄']! : rengC['SO₃']! ** 2 / (rengC['SO₂']! ** 2 * rengC['O₂']!)
        const rengK = rengNum(/K = ([0-9.,e+-]+) \(dato/.exec(rengE.enunciado)![1]!)
        const rengRel = rengQ / rengK
        const rengTexto = rengTextoOpcionCorrecta(rengE)
        if (rengRel < 0.9) expect(rengTexto, rengE.id).toMatch(/Q < K/)
        else if (rengRel > 1.1) expect(rengTexto, rengE.id).toMatch(/Q > K/)
        else expect(rengTexto, rengE.id).toMatch(/Q ≈ K/)
        rengVistos++
      }
    }
    expect(rengVistos).toBeGreaterThan(8)
    for (const rengId of ['equilibrio-suficiencia.falta-k', 'equilibrio-suficiencia.k-otra-temperatura', 'equilibrio-suficiencia.falta-concentracion']) {
      const rengE = rengEjemplos({ id: rengId, nivel: rengId === 'equilibrio-suficiencia.falta-k' ? 'universitario' : 'quimico', familia: 'fisicoquimica.equilibrio-suficiencia' }, 1)[0]!
      expect(rengTextoOpcionCorrecta(rengE), rengId).toMatch(/^No:/)
    }
  })
  it('aproximación √(Ka·C): el criterio del 5 % se recalcula y la solución exacta cumple Ka = x²/(C − x)', () => {
    let rengValidas = 0
    let rengRevisar = 0
    for (const rengE of rengEjemplos({ id: 'equilibrio-suficiencia.aproximacion', nivel: 'cientifico', familia: 'fisicoquimica.equilibrio-suficiencia' }, 24)) {
      const rengC = rengDato(rengE, 'C')
      const rengKa = rengDato(rengE, 'Ka')
      const rengRaz = Math.sqrt(rengKa * rengC) / rengC
      const rengTexto = rengTextoOpcionCorrecta(rengE)
      expect(rengTexto.startsWith(rengRaz < 0.05 ? 'Válida' : 'Debe revisarse'), `${rengE.id}: x/C = ${rengRaz}`).toBe(true)
      const rengX = (-rengKa + Math.sqrt(rengKa ** 2 + 4 * rengKa * rengC)) / 2
      expect((rengX * rengX) / (rengC - rengX) / rengKa).toBeCloseTo(1, 9)
      if (rengRaz < 0.05) rengValidas++
      else rengRevisar++
    }
    expect(rengValidas).toBeGreaterThan(0)
    expect(rengRevisar).toBeGreaterThan(0)
  })
})

describe('Entrega C · las opciones de método no revelan la respuesta', () => {
  it('el criterio del limitante no nombra reactivos y las observaciones de semividas no nombran el orden', () => {
    for (const rengV of RENG_VARIANTES_LIMITANTE) {
      for (const rengE of rengEjemplos({ ...rengV, familia: 'general.limitante-tabla' })) {
        const rengNombres = rengE.tabla!.filas.map((rengF) => String(rengF[0]))
        for (const rengO of rengE.metodo!.opciones) for (const rengN of rengNombres) expect(rengO.texto.includes(rengN), `${rengE.id}: «${rengO.texto}» nombra ${rengN}`).toBe(false)
      }
    }
    for (const rengO of [0, 1, 2] as const) {
      for (const rengE of rengEjemplos({ id: `modelo.semividas-orden${rengO}`, nivel: 'quimico', familia: 'fisicoquimica.modelo-cinetico' })) for (const rengX of rengE.metodo!.opciones) expect(rengX.texto, rengE.id).not.toMatch(/orden/i)
    }
  })
  it('al interpolar, las cuatro justificaciones son afirmaciones comparables con números; solo una es cierta', () => {
    for (const rengId of ['interpolar.dentro-intervalo', 'interpolar.sobre-intervalo']) {
      for (const rengE of rengEjemplos({ id: rengId, nivel: 'quimico', familia: 'analitica.interpolar-calibracion' })) {
        const rengComparativas = rengE.metodo!.opciones.filter((rengO) => rengO.texto.startsWith('La absorbancia de la muestra'))
        expect(rengComparativas.length, rengE.id).toBeGreaterThanOrEqual(3)
        const rengA = rengDato(rengE, 'A')
        const rengAs = rengE.grafica!.tabla.filas.map((rengF) => rengNum(rengF[1]!))
        const rengCiertas = rengComparativas.filter((rengO) => (rengO.texto.includes('está entre') ? rengA >= Math.min(...rengAs) && rengA <= Math.max(...rengAs) : rengO.texto.includes('supera') ? rengA > Math.max(...rengAs) : rengA < Math.min(...rengAs)))
        expect(rengCiertas, rengE.id).toHaveLength(1)
        expect(rengCiertas[0]!.id).toBe(rengE.metodo!.correcta)
      }
    }
  })
})

describe('Entrega C · el dibujo de un ejercicio no revela la respuesta', () => {
  it('con las etiquetas CIP suprimidas el SVG no contiene los descriptores R, S, E ni Z de la figura', async () => {
    const { rengDibujo2D } = await import('../../src/renderer/modules/simulador-quimica/nucleo/molecula')
    const rengConEtiqueta = rengDibujo2D('C[C@H](O)C(=O)O', 300, 180)
    const rengSin = rengDibujo2D('C[C@H](O)C(=O)O', 300, 180, true)
    const rengTextos = (rengSvg: string): string[] => [...rengSvg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((rengM) => rengM[1]!.trim())
    expect(rengTextos(rengConEtiqueta)).toContain('S')
    expect(rengTextos(rengSin)).not.toContain('S')
    const rengDoble = rengTextos(rengDibujo2D('C/C=C/C', 300, 180, true))
    expect(rengDoble).not.toContain('E')
    expect(rengTextos(rengDibujo2D('C/C=C\C', 300, 180, true))).not.toContain('Z')
  })
})
