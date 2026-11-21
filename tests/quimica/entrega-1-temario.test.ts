import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_ESQUEMA_CUADERNO, RENG_NIVELES_EVIDENCIA, RENG_VERSION_CUADERNO } from '../../src/shared/cuaderno'
import { RENG_SUSTANCIAS } from '../../src/renderer/modules/tabla-periodica/catalogoSustancias'
import { RENG_CLAVE_PRACTICA, RENG_VERSION_PRACTICA } from '../../src/renderer/modules/simulador-quimica/practica/persistencia'
import { RENG_CLAVE_PROGRESO_LECCIONES } from '../../src/renderer/modules/simulador-quimica/aprender/progreso'
import { RENG_CLAVE_NIVEL_PRACTICA, RENG_NIVELES_PRACTICA } from '../../src/renderer/modules/simulador-quimica/practica/niveles'
import { RENG_MODELOS_ESCENA } from '../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'
import { RENG_FAMILIAS_ORIGINALES_BANCO } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { rengGenerarModuloDesdeTexto } from '../../scripts/temario-lib.mjs'
import { RENG_CORRESPONDENCIAS } from '../../src/renderer/modules/simulador-quimica/temario/correspondencias'
import { RENG_NIVELES_PLEGADOS_POR_DEFECTO, RENG_TEMARIO, rengBuscarEnCatalogo, rengCatalogoReal, rengConstruirCatalogo, rengTituloLegible } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { RENG_CONTEXTO_REAL, RENG_CRITERIOS_COBERTURA, RENG_ESTADOS_COBERTURA, RENG_REGISTRO_COBERTURA, rengEstadoAgregado, rengEvaluarSubtema, type RengContextoCobertura, type RengRegistroCobertura } from '../../src/renderer/modules/simulador-quimica/temario/estado'
import { RENG_CLAVE_PLEGADO_TEMARIO, RENG_PLEGADO_VACIO, rengAlternarBloque, rengAlternarNivel, rengBloqueAbierto, rengElegirRuta, rengGuardarPlegado, rengLeerPlegado, rengNivelAbierto } from '../../src/renderer/modules/simulador-quimica/temario/plegado'
import { rengAccionesDeRecurso, rengCapasDeRecurso, rengClaveRecurso, rengRecursoExiste } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import type { RengGrupoCorrespondencia, RengRecurso, RengTemario } from '../../src/renderer/modules/simulador-quimica/temario/tipos'
import { RENG_EQUIVALENCIA_CUADERNO, RENG_EQUIVALENCIA_EJERCICIO, RENG_NIVELES_VERIFICACION, rengEquivalenciaDatosMd, rengMasDebil, rengVerificacionDeRecurso } from '../../src/renderer/modules/simulador-quimica/temario/verificacion'

const RENG_RAIZ = join(import.meta.dirname, '../..')
const RENG_MD = readFileSync(join(RENG_RAIZ, 'docs/TEMARIO-MAESTRO.md'), 'utf8')
const RENG_DATOS_TS = readFileSync(join(RENG_RAIZ, 'src/renderer/modules/simulador-quimica/temario/datos.generado.ts'), 'utf8')

interface RengEsperadoSubtema {
  nivel: number
  bloque: number
  posicion: number
  titulo: string
}

function rengLeerTemarioIndependiente(rengTexto: string): { niveles: Array<{ numero: number; titulo: string }>; bloques: Array<{ nivel: number; numero: number; titulo: string }>; subtemas: RengEsperadoSubtema[] } {
  const rengNiveles: Array<{ numero: number; titulo: string }> = []
  const rengBloques: Array<{ nivel: number; numero: number; titulo: string }> = []
  const rengSubtemas: RengEsperadoSubtema[] = []
  let rengNivel = 0
  let rengBloque = 0
  for (const rengLinea of rengTexto.split(/\r?\n/)) {
    if (rengLinea.startsWith('## RUTA DE APRENDIZAJE')) break
    const rengN = /^## NIVEL (\d+)\. (.*)$/.exec(rengLinea)
    if (rengN) {
      rengNivel = Number(rengN[1])
      rengNiveles.push({ numero: rengNivel, titulo: rengN[2]!.trim() })
      continue
    }
    const rengB = /^### (\d+)\. (.*)$/.exec(rengLinea)
    if (rengB) {
      rengBloque = Number(rengB[1])
      rengBloques.push({ nivel: rengNivel, numero: rengBloque, titulo: rengB[2]!.trim() })
      continue
    }
    const rengS = /^(\d+)\. (.*)$/.exec(rengLinea)
    if (rengS && rengBloque > 0) rengSubtemas.push({ nivel: rengNivel, bloque: rengBloque, posicion: Number(rengS[1]), titulo: rengS[2]!.trim() })
  }
  return { niveles: rengNiveles, bloques: rengBloques, subtemas: rengSubtemas }
}

function rengProblemasIntegridad(rengDatos: RengTemario, rengTexto: string): string[] {
  const rengE = rengLeerTemarioIndependiente(rengTexto)
  const rengProblemas: string[] = []
  const rengVistos = new Set<string>()
  const rengReales: RengEsperadoSubtema[] = []
  if (rengDatos.niveles.length !== rengE.niveles.length) rengProblemas.push(`niveles: ${rengDatos.niveles.length} frente a ${rengE.niveles.length}`)
  let rengNumeroBloque = 0
  for (const rengN of rengDatos.niveles) {
    const rengEN = rengE.niveles.find((rengX) => rengX.numero === rengN.numero)
    if (!rengEN || rengEN.titulo !== rengN.titulo) rengProblemas.push(`título del nivel ${rengN.numero}`)
    for (const rengB of rengN.bloques) {
      rengNumeroBloque++
      if (rengB.numero !== rengNumeroBloque) rengProblemas.push(`bloque ${rengB.numero}: se esperaba ${rengNumeroBloque}`)
      if (rengB.id !== `n${rengN.numero}-b${rengB.numero}`) rengProblemas.push(`id de bloque ${rengB.id}`)
      const rengEB = rengE.bloques.find((rengX) => rengX.numero === rengB.numero)
      if (!rengEB || rengEB.titulo !== rengB.titulo || rengEB.nivel !== rengN.numero) rengProblemas.push(`título o nivel del bloque ${rengB.numero}`)
      rengB.subtemas.forEach((rengS, rengI) => {
        if (rengS.id !== `n${rengN.numero}-b${rengB.numero}-s${rengI + 1}`) rengProblemas.push(`id ${rengS.id}: se esperaba n${rengN.numero}-b${rengB.numero}-s${rengI + 1}`)
        if (rengVistos.has(rengS.id)) rengProblemas.push(`id repetido ${rengS.id}`)
        rengVistos.add(rengS.id)
        rengReales.push({ nivel: rengN.numero, bloque: rengB.numero, posicion: rengI + 1, titulo: rengS.titulo })
      })
    }
  }
  if (rengReales.length !== rengE.subtemas.length) rengProblemas.push(`subtemas: ${rengReales.length} frente a ${rengE.subtemas.length}`)
  rengE.subtemas.forEach((rengX) => {
    const rengR = rengReales.find((rengY) => rengY.bloque === rengX.bloque && rengY.posicion === rengX.posicion)
    if (!rengR) rengProblemas.push(`falta el subtema n${rengX.nivel}-b${rengX.bloque}-s${rengX.posicion}`)
    else if (rengR.titulo !== rengX.titulo) rengProblemas.push(`título distinto en n${rengX.nivel}-b${rengX.bloque}-s${rengX.posicion}: «${rengR.titulo}» frente a «${rengX.titulo}»`)
  })
  return rengProblemas
}

const rengClonar = (rengT: RengTemario): RengTemario => JSON.parse(JSON.stringify(rengT)) as RengTemario

describe('Temario · datos generados (Entrega 1, paso 1)', () => {
  it('fija los recuentos: 8 niveles, 64 bloques, 1504 subtemas y 1468 sin el bloque 64', () => {
    const rengBloques = RENG_TEMARIO.niveles.flatMap((rengN) => rengN.bloques)
    const rengSubtemas = rengBloques.flatMap((rengB) => rengB.subtemas)
    expect(RENG_TEMARIO.version).toBe(1)
    expect(RENG_TEMARIO.niveles).toHaveLength(8)
    expect(rengBloques).toHaveLength(64)
    expect(rengSubtemas).toHaveLength(1504)
    expect(rengBloques.filter((rengB) => rengB.tipo === 'curso').flatMap((rengB) => rengB.subtemas)).toHaveLength(1468)
    expect(RENG_TEMARIO.niveles.map((rengN) => rengN.bloques.length)).toEqual([12, 8, 14, 10, 8, 6, 5, 1])
    expect(RENG_TEMARIO.niveles.map((rengN) => rengN.bloques.reduce((rengA, rengB) => rengA + rengB.subtemas.length, 0))).toEqual([258, 183, 315, 227, 196, 166, 123, 36])
  })

  it('el bloque 64 es de tipo «problemas» y es el único', () => {
    const rengBloques = RENG_TEMARIO.niveles.flatMap((rengN) => rengN.bloques)
    expect(rengBloques.filter((rengB) => rengB.tipo === 'problemas').map((rengB) => rengB.id)).toEqual(['n8-b64'])
    expect(rengBloques.find((rengB) => rengB.numero === 64)!.subtemas).toHaveLength(36)
  })

  it('los ids tienen la forma n{nivel}-b{bloque}-s{posición}, son correlativos y únicos', () => {
    const rengIds = RENG_TEMARIO.niveles.flatMap((rengN) => rengN.bloques.flatMap((rengB) => rengB.subtemas.map((rengS) => rengS.id)))
    expect(new Set(rengIds).size).toBe(1504)
    expect(rengIds.every((rengId) => /^n[1-8]-b\d{1,2}-s\d{1,2}$/.test(rengId))).toBe(true)
    expect(rengIds[0]).toBe('n1-b1-s1')
    expect(rengIds.at(-1)).toBe('n8-b64-s36')
  })

  it('los títulos coinciden con docs/TEMARIO-MAESTRO.md leído por otro analizador', () => {
    expect(rengProblemasIntegridad(RENG_TEMARIO, RENG_MD)).toEqual([])
  })

  it('el archivo generado está al día respecto del temario (npm run temario no cambiaría nada)', () => {
    expect(rengGenerarModuloDesdeTexto(RENG_MD).replace(/\r\n/g, '\n')).toBe(RENG_DATOS_TS.replace(/\r\n/g, '\n'))
  })

  it('SABOTAJE: cambiar un título se detecta', () => {
    const rengT = rengClonar(RENG_TEMARIO)
    rengT.niveles[0]!.bloques[4]!.subtemas[3]!.titulo = 'Nomenclatura de Stock (editada).'
    const rengP = rengProblemasIntegridad(rengT, RENG_MD)
    expect(rengP.length).toBeGreaterThan(0)
    expect(rengP.join('|')).toContain('n1-b5-s4')
  })

  it('SABOTAJE: saltar un id se detecta', () => {
    const rengT = rengClonar(RENG_TEMARIO)
    rengT.niveles[2]!.bloques[0]!.subtemas[5]!.id = 'n3-b21-s7'
    expect(rengProblemasIntegridad(rengT, RENG_MD).join('|')).toContain('n3-b21-s6')
  })

  it('SABOTAJE: repetir un id, quitar un subtema, mover un bloque de nivel o cambiar el título de un nivel se detecta', () => {
    const rengRepetido = rengClonar(RENG_TEMARIO)
    rengRepetido.niveles[0]!.bloques[0]!.subtemas[1]!.id = 'n1-b1-s1'
    expect(rengProblemasIntegridad(rengRepetido, RENG_MD).join('|')).toContain('repetido')
    const rengQuitado = rengClonar(RENG_TEMARIO)
    rengQuitado.niveles[3]!.bloques[2]!.subtemas.pop()
    expect(rengProblemasIntegridad(rengQuitado, RENG_MD).length).toBeGreaterThan(0)
    const rengMovido = rengClonar(RENG_TEMARIO)
    rengMovido.niveles[1]!.bloques.push(rengMovido.niveles[0]!.bloques.pop()!)
    expect(rengProblemasIntegridad(rengMovido, RENG_MD).length).toBeGreaterThan(0)
    const rengNivel = rengClonar(RENG_TEMARIO)
    rengNivel.niveles[4]!.titulo = 'OTRO TÍTULO'
    expect(rengProblemasIntegridad(rengNivel, RENG_MD).join('|')).toContain('nivel 5')
  })

  it('SABOTAJE: un temario con un título distinto en el texto fuente se detecta (el analizador independiente no es el del script)', () => {
    const rengTexto = RENG_MD.replace('10. Estados de agregación.', '10. Estados de agregacion.').replace('8. Estados de agregación.', '8. Estados de agregacion.')
    expect(rengProblemasIntegridad(RENG_TEMARIO, rengTexto).join('|')).toContain('Estados de agregación')
  })

  it('el generador rechaza un temario con la numeración rota', () => {
    expect(() => rengGenerarModuloDesdeTexto(RENG_MD.replace('### 5. Nomenclatura inorgánica', '### 6. Nomenclatura inorgánica'))).toThrow(/inconsistente/)
    expect(() => rengGenerarModuloDesdeTexto(RENG_MD.replace('3. Nomenclatura sistemática.', '4. Nomenclatura sistemática.'))).toThrow(/inconsistente/)
  })

  it('no se conservan restos de la web en los datos', () => {
    expect(RENG_DATOS_TS).not.toContain('American Chemical Society')
  })
})

function rengProblemasCorrespondencias(rengCorr: Readonly<Record<number, readonly RengGrupoCorrespondencia[]>>, rengTemario: RengTemario): string[] {
  const rengProblemas: string[] = []
  const rengBloques = new Map(rengTemario.niveles.flatMap((rengN) => rengN.bloques.map((rengB) => [rengB.numero, rengB] as const)))
  for (const [rengClave, rengGrupos] of Object.entries(rengCorr)) {
    const rengB = rengBloques.get(Number(rengClave))
    if (!rengB) {
      rengProblemas.push(`bloque ${rengClave} no existe`)
      continue
    }
    if (rengB.tipo !== 'curso') rengProblemas.push(`el bloque ${rengClave} es un mapa de problemas y no admite correspondencias`)
    const rengUsadas = new Set<number>()
    for (const rengG of rengGrupos) {
      if (rengG.recursos.length === 0) rengProblemas.push(`bloque ${rengClave}: grupo ${rengG.posiciones.join(',')} sin recursos`)
      for (const rengP of rengG.posiciones) {
        if (!Number.isInteger(rengP) || rengP < 1 || rengP > rengB.subtemas.length) rengProblemas.push(`bloque ${rengClave}: posición ${rengP} fuera de rango`)
        if (rengUsadas.has(rengP)) rengProblemas.push(`bloque ${rengClave}: posición ${rengP} repetida`)
        rengUsadas.add(rengP)
      }
      for (const rengR of rengG.recursos) if (!rengRecursoExiste(rengR)) rengProblemas.push(`bloque ${rengClave}: el recurso ${rengClaveRecurso(rengR)} no existe`)
    }
  }
  return rengProblemas
}

const rengTodosLosGrupos = (): RengGrupoCorrespondencia[] => Object.values(RENG_CORRESPONDENCIAS).flatMap((rengG) => [...rengG])
const rengContar = (rengEstado: 'confirmado' | 'revisar', rengBloquesFiltro?: (rengN: number) => boolean): number =>
  Object.entries(RENG_CORRESPONDENCIAS)
    .filter(([rengN]) => !rengBloquesFiltro || rengBloquesFiltro(Number(rengN)))
    .flatMap(([, rengG]) => [...rengG])
    .filter((rengG) => rengG.estado === rengEstado)
    .reduce((rengA, rengG) => rengA + rengG.posiciones.length, 0)

describe('Temario · mapa de correspondencias (Entrega 1, paso 2)', () => {
  it('todo recurso referenciado existe de verdad, las posiciones son válidas y no se solapan', () => {
    expect(rengProblemasCorrespondencias(RENG_CORRESPONDENCIAS, RENG_TEMARIO)).toEqual([])
  })

  it('el catálogo de peligros y la biblioteca respaldan las referencias que los usan', () => {
    expect(RENG_SUSTANCIAS).toHaveLength(114)
    const rengTipos = new Set(rengTodosLosGrupos().flatMap((rengG) => rengG.recursos.map((rengR) => rengR.tipo)))
    const rengPermitidos = ['caso', 'cristal', 'escena', 'glosario', 'laboratorio', 'leccion-n1', 'mesa', 'peligros', 'practica', 'practica-n1', 'escena-n1', 'sustancia', 'tabla', 'tema']
    expect([...rengTipos].every((rengT) => rengPermitidos.includes(rengT)), [...rengTipos].join(',')).toBe(true)
    expect([...rengTipos]).toEqual(expect.arrayContaining(['caso', 'cristal', 'escena', 'glosario', 'laboratorio', 'mesa', 'peligros', 'practica', 'sustancia', 'tabla', 'tema']))
  })

  it('los recuentos del mapa coinciden con un recuento independiente y solo se mueven en el sentido del cierre por bloques (Fase 0: 163 confirmados, 150 por revisar)', () => {
    const rengConf = rengContar('confirmado')
    const rengRev = rengContar('revisar')
    expect(rengConf).toBeGreaterThanOrEqual(163)
    expect(rengRev).toBeLessThanOrEqual(150)
    const rengCat = rengCatalogoReal()
    expect(rengCat.subtemasTotales).toBe(1504)
    expect(rengCat.niveles.reduce((rengA, rengN) => rengA + rengN.conteo.sinRecurso, 0)).toBe(1504 - rengConf - rengRev)
    expect(rengCat.cobertura).toMatchObject({ total: 1468, confirmados: rengConf, porRevisar: rengRev, sinRecurso: 1468 - rengConf - rengRev })
  })

  it('distribuye los recursos por nivel como la Fase 0 (salvo la corrección del ATP); el Nivel 1 cambia solo con el cierre por bloques', () => {
    const rengPorNivel = rengCatalogoReal().niveles.map((rengN) => [rengN.conteo.confirmados, rengN.conteo.porRevisar, rengN.conteo.sinRecurso])
    const rengN1 = rengPorNivel[0]!
    expect(rengN1[0]! + rengN1[1]! + rengN1[2]!).toBe(258)
    expect(rengN1[0]).toBeGreaterThanOrEqual(110)
    expect(rengN1[1]).toBeLessThanOrEqual(70)
    expect(rengPorNivel.slice(1)).toEqual([
      [23, 31, 129],
      [30, 42, 243],
      [0, 5, 222],
      [0, 0, 196],
      [0, 0, 166],
      [0, 2, 121],
      [0, 0, 36]
    ])
  })

  it('el subtema n3-b34-s2 «ATP» no tiene recurso (la Fase 0 lo contaba por error)', () => {
    const rengS = rengCatalogoReal().niveles[2]!.bloques.find((rengB) => rengB.numero === 34)!.subtemas[1]!
    expect(rengS.titulo).toBe('ATP.')
    expect(rengS.correspondencia).toBeNull()
  })

  it('bloques: 8 con al menos el 40 % confirmado y 28 de curso sin ningún recurso', () => {
    const rengBloques = rengCatalogoReal().niveles.flatMap((rengN) => rengN.bloques.filter((rengB) => rengB.tipo === 'curso'))
    const rengConfirmados = rengBloques.filter((rengB) => rengB.conteo.confirmados / rengB.conteo.total >= 0.4).map((rengB) => rengB.numero)
    expect(rengConfirmados).toEqual(expect.arrayContaining([3, 4, 5, 7, 10, 11, 12, 24]))
    expect(rengConfirmados.filter((rengN) => rengN > 12)).toEqual([24])
    expect(rengBloques.filter((rengB) => rengB.conteo.confirmados + rengB.conteo.porRevisar === 0).length).toBeLessThanOrEqual(28)
  })

  it('SABOTAJE: un recurso inexistente, una posición fuera de rango o repetida y un bloque 64 se detectan', () => {
    const rengMalo = (rengG: RengGrupoCorrespondencia[], rengBloque = 5): Record<number, readonly RengGrupoCorrespondencia[]> => ({ [rengBloque]: rengG })
    expect(rengProblemasCorrespondencias(rengMalo([{ estado: 'confirmado', posiciones: [1], recursos: [{ tipo: 'tema', id: 'no-existe' }] }]), RENG_TEMARIO).join('|')).toContain('tema:no-existe')
    expect(rengProblemasCorrespondencias(rengMalo([{ estado: 'confirmado', posiciones: [1], recursos: [{ tipo: 'escena', id: 'ninguna' as never }] }]), RENG_TEMARIO).join('|')).toContain('escena:ninguna')
    expect(rengProblemasCorrespondencias(rengMalo([{ estado: 'confirmado', posiciones: [1], recursos: [{ tipo: 'sustancia', id: 'sustancia inventada' }] }]), RENG_TEMARIO).join('|')).toContain('sustancia:sustancia inventada')
    expect(rengProblemasCorrespondencias(rengMalo([{ estado: 'confirmado', posiciones: [1], recursos: [{ tipo: 'practica', id: 'general.no-existe' }] }]), RENG_TEMARIO).join('|')).toContain('practica:general.no-existe')
    expect(rengProblemasCorrespondencias(rengMalo([{ estado: 'confirmado', posiciones: [21], recursos: [{ tipo: 'tabla' }] }]), RENG_TEMARIO).join('|')).toContain('fuera de rango')
    expect(rengProblemasCorrespondencias(rengMalo([{ estado: 'confirmado', posiciones: [2], recursos: [{ tipo: 'tabla' }] }, { estado: 'revisar', posiciones: [2], recursos: [{ tipo: 'tabla' }] }]), RENG_TEMARIO).join('|')).toContain('repetida')
    expect(rengProblemasCorrespondencias(rengMalo([{ estado: 'confirmado', posiciones: [1], recursos: [] }]), RENG_TEMARIO).join('|')).toContain('sin recursos')
    expect(rengProblemasCorrespondencias(rengMalo([{ estado: 'confirmado', posiciones: [1], recursos: [{ tipo: 'tabla' }] }], 64), RENG_TEMARIO).join('|')).toContain('mapa de problemas')
    expect(rengProblemasCorrespondencias(rengMalo([{ estado: 'confirmado', posiciones: [1], recursos: [{ tipo: 'tabla' }] }], 99), RENG_TEMARIO).join('|')).toContain('no existe')
  })

  it('ningún confirmado depende de un único recurso que no sea de consulta o de un tema sin lección y práctica', () => {
    const rengCat = rengCatalogoReal()
    for (const rengN of rengCat.niveles) for (const rengB of rengN.bloques) for (const rengS of rengB.subtemas) {
      if (rengS.correspondencia !== 'confirmado') continue
      expect(rengS.confirmados.length, rengS.id).toBeGreaterThan(0)
      expect(rengS.confirmados.every((rengR) => rengRecursoExiste(rengR)), rengS.id).toBe(true)
    }
  })
})

describe('Temario · piloto técnico del bloque 5 (Entrega 1, paso 5)', () => {
  const rengBloque5 = (): ReturnType<typeof rengCatalogoReal>['niveles'][number]['bloques'][number] => rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === 5)!

  it('tiene 20 subtemas confirmados: «Sales básicas», antes sin recurso, tiene ya lección y prácticas de Nivel 1', () => {
    const rengB = rengBloque5()
    expect(rengB.subtemas).toHaveLength(20)
    expect(rengB.conteo).toMatchObject({ confirmados: 20, porRevisar: 0, sinRecurso: 0 })
    expect(rengB.subtemas.find((rengS) => rengS.titulo === 'Sales básicas.')!.confirmados.map((rengR) => rengR.tipo)).toEqual(['leccion-n1', 'practica-n1'])
  })

  it('cada subtema confirmado tiene acciones que el navegador del módulo sabe abrir', () => {
    for (const rengS of rengBloque5().subtemas.filter((rengX) => rengX.correspondencia === 'confirmado')) {
      const rengAcciones = rengS.confirmados.flatMap((rengR) => rengAccionesDeRecurso(rengR))
      expect(rengAcciones.length, rengS.id).toBeGreaterThan(0)
      for (const rengA of rengAcciones) {
        if (rengA.modulo !== 'simulador-quimica') continue
        const rengNav = rengNavDeSubruta(RENG_NAV_INICIAL, rengA.sub)
        expect(rengNav, `${rengS.id} ${rengA.sub}`).not.toEqual(RENG_NAV_INICIAL)
      }
    }
  })

  it('Aprender y Practicar de un tema se resuelven a los destinos y temas correctos', () => {
    const rengAcc = rengAccionesDeRecurso({ tipo: 'tema', id: 'formular-nombrar' })
    expect(rengAcc.map((rengA) => rengA.etiqueta)).toEqual(['Aprender', 'Practicar'])
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, rengAcc[0]!.sub)).toMatchObject({ destino: 'aprender', tema: 'formular-nombrar' })
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, rengAcc[1]!.sub)).toMatchObject({ destino: 'practicas', tema: 'formular-nombrar' })
    expect(rengAccionesDeRecurso({ tipo: 'tema', id: 'cinetica' }).map((rengA) => rengA.sub)).toContain('cinetica')
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, 'formulacion')).toMatchObject({ destino: 'mesa', herramienta: 'formulacion' })
  })
})

const rengContextoFalso = (rengEscena: string | null = null, rengComprobable = true): RengContextoCobertura => ({
  existe: () => true,
  temaCompleto: (rengT) => rengT === 'tema-x',
  familiasDeTema: (rengT) => (rengT === 'tema-x' ? ['fam-x'] : []),
  escenaDeTema: (rengT) => (rengT === 'tema-x' ? rengEscena : null),
  verificacionDeRecurso: () => ({ nivel: rengComprobable ? 'fuente-verificada' : 'parametro-didactico', comprobable: rengComprobable })
})

const rengRegistro = (rengAtest = true, rengVerif = true, rengComprobable = true): RengRegistroCobertura => ({
  enDesarrollo: new Set<string>(),
  atestaciones: new Map(rengAtest ? [['s1', { tema: 'tema-x', familia: 'fam-x', revisor: 'Revisora', fecha: '2026-11-16' }]] : []),
  verificaciones: new Map(rengVerif ? [['s1', { datos: [{ descripcion: 'masa molar', nivel: 'fuente-verificada' as const, comprobable: rengComprobable }], revisor: 'Revisora', fecha: '2026-11-16' }]] : [])
})

const rengTemaX: RengRecurso = { tipo: 'tema', id: 'tema-x' }

describe('Temario · estados calculados (Entrega 1, paso 3)', () => {
  it('con los datos reales: ningún subtema sale Completado, Verificado ni En desarrollo (sin atestaciones registradas)', () => {
    const rengCat = rengCatalogoReal()
    const rengTodos = rengCat.niveles.flatMap((rengN) => rengN.bloques.flatMap((rengB) => rengB.subtemas))
    const rengContar2 = (rengE: string): number => rengTodos.filter((rengS) => rengS.evaluacion.estado === rengE).length
    const rengConf = rengContar('confirmado')
    expect(rengContar2('completado')).toBe(0)
    expect(rengContar2('verificado')).toBe(0)
    expect(rengContar2('en-desarrollo')).toBe(0)
    expect(rengContar2('parcial')).toBe(rengConf)
    expect(rengContar2('sin-contenido')).toBe(1504 - rengConf)
    expect(rengCat.cobertura.porEstado).toEqual({ 'sin-contenido': 1468 - rengConf, 'en-desarrollo': 0, parcial: rengConf, completado: 0, verificado: 0 })
  })

  it('los «por revisar» NO cuentan: salen Sin contenido', () => {
    const rengRevisar = rengCatalogoReal().niveles.flatMap((rengN) => rengN.bloques.flatMap((rengB) => rengB.subtemas)).filter((rengS) => rengS.correspondencia === 'revisar')
    expect(rengRevisar).toHaveLength(rengContar('revisar'))
    expect(rengRevisar.length).toBeGreaterThan(0)
    expect(rengRevisar.every((rengS) => rengS.evaluacion.estado === 'sin-contenido' && rengS.evaluacion.capas.length === 0)).toBe(true)
  })

  it('el bloque 64 es sin contenido y queda fuera del denominador', () => {
    const rengN8 = rengCatalogoReal().niveles[7]!
    expect(rengN8.estado).toBe('sin-contenido')
    expect(rengN8.bloques[0]!.tipo).toBe('problemas')
    expect(rengN8.bloques[0]!.subtemas.every((rengS) => rengS.correspondencia === null)).toBe(true)
  })

  it('el estado de bloque y de nivel es el agregado de sus subtemas', () => {
    expect(rengEstadoAgregado([])).toBe('sin-contenido')
    expect(rengEstadoAgregado(['sin-contenido', 'sin-contenido'])).toBe('sin-contenido')
    expect(rengEstadoAgregado(['sin-contenido', 'en-desarrollo'])).toBe('en-desarrollo')
    expect(rengEstadoAgregado(['sin-contenido', 'parcial'])).toBe('parcial')
    expect(rengEstadoAgregado(['completado', 'parcial'])).toBe('parcial')
    expect(rengEstadoAgregado(['completado', 'verificado'])).toBe('completado')
    expect(rengEstadoAgregado(['verificado', 'verificado'])).toBe('verificado')
    expect(rengEstadoAgregado(['completado', 'sin-contenido'])).toBe('parcial')
    expect(RENG_ESTADOS_COBERTURA).toEqual(['sin-contenido', 'en-desarrollo', 'parcial', 'completado', 'verificado'])
  })

  it('En desarrollo es el único manual: solo si no hay recursos confirmados', () => {
    const rengReg: RengRegistroCobertura = { ...RENG_REGISTRO_COBERTURA, enDesarrollo: new Set(['n3-b25-s1', 'n1-b5-s2']) }
    const rengCat = rengConstruirCatalogo(undefined, undefined, rengReg)
    const rengCuantica = rengCat.niveles[2]!.bloques.find((rengB) => rengB.numero === 25)!
    expect(rengCuantica.subtemas[0]!.evaluacion.estado).toBe('en-desarrollo')
    expect(rengCuantica.estado).toBe('en-desarrollo')
    expect(rengCat.niveles[0]!.bloques.find((rengB) => rengB.numero === 5)!.subtemas[1]!.evaluacion.estado).toBe('parcial')
  })

  it('Completado exige tema con lección y práctica, atestación válida y la escena del tema', () => {
    const rengBase = rengEvaluarSubtema('s1', [rengTemaX], rengRegistro(true, false), RENG_CRITERIOS_COBERTURA, rengContextoFalso())
    expect(rengBase.estado).toBe('completado')
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengRegistro(false, false), RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('parcial')
    expect(rengEvaluarSubtema('s1', [{ tipo: 'tabla' }], rengRegistro(true, false), RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('parcial')
    expect(rengEvaluarSubtema('s1', [{ tipo: 'tema', id: 'otro' }], rengRegistro(true, false), RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('parcial')
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengRegistro(true, false), RENG_CRITERIOS_COBERTURA, rengContextoFalso('cinetica')).estado).toBe('parcial')
    expect(rengEvaluarSubtema('s1', [rengTemaX, { tipo: 'escena', id: 'cinetica' }], rengRegistro(true, false), RENG_CRITERIOS_COBERTURA, rengContextoFalso('cinetica')).estado).toBe('completado')
    const rengMalaFecha: RengRegistroCobertura = { ...rengRegistro(true, false), atestaciones: new Map([['s1', { tema: 'tema-x', familia: 'fam-x', revisor: 'R', fecha: '16/11/2026' }]]) }
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengMalaFecha, RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('parcial')
    const rengSinRevisor: RengRegistroCobertura = { ...rengRegistro(true, false), atestaciones: new Map([['s1', { tema: 'tema-x', familia: 'fam-x', revisor: ' ', fecha: '2026-11-16' }]]) }
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengSinRevisor, RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('parcial')
    const rengOtraFamilia: RengRegistroCobertura = { ...rengRegistro(true, false), atestaciones: new Map([['s1', { tema: 'tema-x', familia: 'fam-y', revisor: 'R', fecha: '2026-11-16' }]]) }
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengOtraFamilia, RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('parcial')
  })

  it('Verificado exige además verificación registrada con datos comprobables y recursos comprobables', () => {
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengRegistro(), RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('verificado')
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengRegistro(true, false), RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('completado')
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengRegistro(true, true, false), RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('completado')
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengRegistro(), RENG_CRITERIOS_COBERTURA, rengContextoFalso(null, false)).estado).toBe('completado')
    const rengDidactico: RengRegistroCobertura = { ...rengRegistro(), verificaciones: new Map([['s1', { datos: [{ descripcion: 'x', nivel: 'parametro-didactico' as const, comprobable: true }], revisor: 'R', fecha: '2026-11-16' }]]) }
    expect(rengEvaluarSubtema('s1', [rengTemaX], rengDidactico, RENG_CRITERIOS_COBERTURA, rengContextoFalso()).estado).toBe('completado')
  })

  it('SABOTAJE: los criterios por defecto están todos activos y congelados; relajarlos haría aparecer Completado o Verificado y la prueba lo vería', () => {
    expect(RENG_CRITERIOS_COBERTURA).toEqual({ exigirTemaConLeccionYPractica: true, exigirAtestacion: true, exigirEscenaDelTema: true, exigirVerificacionRegistrada: true, exigirDatosComprobables: true, exigirRecursosComprobables: true })
    expect(Object.isFrozen(RENG_CRITERIOS_COBERTURA)).toBe(true)
    const rengPorDefecto = rengCatalogoReal().cobertura.porEstado
    expect(rengPorDefecto.completado + rengPorDefecto.verificado).toBe(0)
    const rengSinAtestacion = rengConstruirCatalogo(undefined, undefined, RENG_REGISTRO_COBERTURA, { ...RENG_CRITERIOS_COBERTURA, exigirAtestacion: false }).cobertura.porEstado
    expect(rengSinAtestacion.completado + rengSinAtestacion.verificado).toBeGreaterThan(0)
    const rengTodoRelajado = rengConstruirCatalogo(undefined, undefined, RENG_REGISTRO_COBERTURA, { exigirTemaConLeccionYPractica: false, exigirAtestacion: false, exigirEscenaDelTema: false, exigirVerificacionRegistrada: false, exigirDatosComprobables: false, exigirRecursosComprobables: false }).cobertura.porEstado
    expect(rengTodoRelajado.verificado).toBe(rengContar('confirmado'))
    const rengSinComprobables = rengConstruirCatalogo(undefined, undefined, RENG_REGISTRO_COBERTURA, { ...RENG_CRITERIOS_COBERTURA, exigirTemaConLeccionYPractica: false, exigirAtestacion: false, exigirEscenaDelTema: false }).cobertura.porEstado
    expect(rengSinComprobables.completado).toBeGreaterThan(0)
    expect(rengSinComprobables.verificado).toBe(0)
  })

  it('un registro vacío y el contexto real son los valores por defecto del catálogo', () => {
    expect(RENG_REGISTRO_COBERTURA.enDesarrollo.size + RENG_REGISTRO_COBERTURA.atestaciones.size + RENG_REGISTRO_COBERTURA.verificaciones.size).toBe(0)
    expect(JSON.stringify(rengConstruirCatalogo(undefined, undefined, RENG_REGISTRO_COBERTURA, RENG_CRITERIOS_COBERTURA, RENG_CONTEXTO_REAL).cobertura)).toBe(JSON.stringify(rengCatalogoReal().cobertura))
  })

  it('las capas salen de los recursos confirmados', () => {
    expect(rengCapasDeRecurso({ tipo: 'tema', id: 'ph' })).toEqual(['aprender', 'practica'])
    expect(rengCapasDeRecurso({ tipo: 'escena', id: 'termo' })).toEqual(['simulacion'])
    expect(rengCapasDeRecurso({ tipo: 'tabla' })).toEqual(['consulta'])
    const rengS = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === 5)!.subtemas[1]!
    expect(rengS.evaluacion.capas).toEqual(['aprender', 'practica', 'simulacion'])
    expect(rengS.evaluacion.faltanParaCompletado.join(' ')).toContain('atestación')
  })
})

describe('Temario · vocabularios de verificación (Entrega 1, paso 6, D9)', () => {
  it('los seis niveles del proyecto, sin repetir', () => {
    expect([...RENG_NIVELES_VERIFICACION]).toEqual(['fuente-verificada', 'bibliografica-declarada', 'dato-calculado', 'parametro-didactico', 'ejemplo-idealizado', 'sin-verificar'])
  })

  it('cubre exactamente los valores de los vocabularios existentes', () => {
    expect(Object.keys(RENG_EQUIVALENCIA_CUADERNO).sort()).toEqual([...RENG_NIVELES_EVIDENCIA].sort())
    expect(Object.keys(RENG_EQUIVALENCIA_EJERCICIO).sort()).toEqual(['didactico', 'publicado', 'referencia'])
    expect(RENG_EQUIVALENCIA_EJERCICIO.didactico).toEqual({ nivel: 'parametro-didactico', comprobable: false })
    expect(RENG_EQUIVALENCIA_EJERCICIO.referencia).toEqual({ nivel: 'bibliografica-declarada', comprobable: false })
    expect(RENG_EQUIVALENCIA_EJERCICIO.publicado).toEqual({ nivel: 'fuente-verificada', comprobable: true })
    expect(RENG_EQUIVALENCIA_CUADERNO['modelo-calculado']).toEqual({ nivel: 'dato-calculado', comprobable: false })
    expect(RENG_EQUIVALENCIA_CUADERNO['calculo-verificado']).toEqual({ nivel: 'dato-calculado', comprobable: true })
  })

  it('«Fuente consultada» solo es verificada si se abrió la página; lo visto en un resumen no lo es', () => {
    expect(rengEquivalenciaDatosMd('fuente-consultada', true)).toEqual({ nivel: 'fuente-verificada', comprobable: true })
    expect(rengEquivalenciaDatosMd('fuente-consultada', false)).toEqual({ nivel: 'bibliografica-declarada', comprobable: false })
    expect(rengEquivalenciaDatosMd('calculada-sin-contrastar', true)).toEqual({ nivel: 'dato-calculado', comprobable: false })
    expect(rengEquivalenciaDatosMd('conocimiento-general', true).nivel).toBe('sin-verificar')
    expect(rengEquivalenciaDatosMd('wikidata-sin-referencia', true).nivel).toBe('sin-verificar')
    expect(rengEquivalenciaDatosMd('wikidata-con-referencia', true).nivel).toBe('bibliografica-declarada')
  })

  it('el más débil de una lista, y que un recurso real nunca resulte comprobable hoy', () => {
    expect(rengMasDebil([])).toBeNull()
    expect(rengMasDebil([{ nivel: 'fuente-verificada', comprobable: true }, { nivel: 'sin-verificar', comprobable: false }, { nivel: 'dato-calculado', comprobable: true }])!.nivel).toBe('sin-verificar')
    expect(rengMasDebil([{ nivel: 'dato-calculado', comprobable: true }, { nivel: 'dato-calculado', comprobable: false }])!.comprobable).toBe(false)
    const rengEscenas = Object.keys(RENG_MODELOS_ESCENA)
    expect(rengEscenas).toHaveLength(10)
    for (const rengE of rengEscenas) expect(rengVerificacionDeRecurso({ tipo: 'escena', id: rengE as never }).motivo).toContain(RENG_MODELOS_ESCENA[rengE as keyof typeof RENG_MODELOS_ESCENA].evidencia)
    expect(rengVerificacionDeRecurso({ tipo: 'escena', id: 'mesalibre' }).nivel).toBe('sin-verificar')
    expect(rengVerificacionDeRecurso({ tipo: 'tema', id: 'ph' }).nivel).toBe('parametro-didactico')
  })

  it('no cambia ningún esquema guardado: el Cuaderno, las prácticas, el nivel y el progreso conservan claves y versiones', () => {
    expect(RENG_ESQUEMA_CUADERNO).toBe('ciencia-sin-limites/cuaderno')
    expect(RENG_VERSION_CUADERNO).toBe(1)
    expect([...RENG_NIVELES_EVIDENCIA]).toEqual(['modelo-calculado', 'calculo-verificado', 'comparado-con-mediciones'])
    expect(RENG_CLAVE_PRACTICA).toBe('ciencia.practica.simulador-quimica')
    expect(RENG_VERSION_PRACTICA).toBe(2)
    expect(RENG_CLAVE_PROGRESO_LECCIONES).toBe('ciencia.aprender.simulador-quimica')
    expect(RENG_CLAVE_NIVEL_PRACTICA).toBe('ciencia.nivel.simulador-quimica')
    expect([...RENG_NIVELES_PRACTICA]).toEqual(['preuniversitario', 'universitario', 'quimico', 'cientifico'])
    expect(RENG_FAMILIAS_ORIGINALES_BANCO).toHaveLength(22)
  })
})

describe('Temario · plegado, búsqueda y nivel del temario (Entrega 1, paso 4)', () => {
  const rengAlmacen = (): { datos: Map<string, string>; getItem: (rengK: string) => string | null; setItem: (rengK: string, rengV: string) => void } => {
    const rengDatos = new Map<string, string>()
    return { datos: rengDatos, getItem: (rengK) => rengDatos.get(rengK) ?? null, setItem: (rengK, rengV) => void rengDatos.set(rengK, rengV) }
  }

  it('por defecto los Niveles 4–8 están plegados y los 1–3 abiertos; los bloques, plegados', () => {
    expect([...RENG_NIVELES_PLEGADOS_POR_DEFECTO]).toEqual([4, 5, 6, 7, 8])
    for (const rengN of [1, 2, 3]) expect(rengNivelAbierto(RENG_PLEGADO_VACIO, rengN)).toBe(true)
    for (const rengN of [4, 5, 6, 7, 8]) expect(rengNivelAbierto(RENG_PLEGADO_VACIO, rengN)).toBe(false)
    expect(rengBloqueAbierto(RENG_PLEGADO_VACIO, 'n1-b5')).toBe(false)
  })

  it('guarda y recupera el plegado en el almacén; ida y vuelta', () => {
    const rengA = rengAlmacen()
    let rengP = rengAlternarNivel(RENG_PLEGADO_VACIO, 5)
    rengP = rengAlternarBloque(rengP, 'n1-b5')
    rengP = rengAlternarNivel(rengP, 1)
    rengP = rengElegirRuta(rengP, 3)
    expect(rengGuardarPlegado(rengA, rengP)).toBe(true)
    const rengL = rengLeerPlegado(rengA)
    expect(rengNivelAbierto(rengL, 5)).toBe(true)
    expect(rengNivelAbierto(rengL, 1)).toBe(false)
    expect(rengBloqueAbierto(rengL, 'n1-b5')).toBe(true)
    expect(rengL.ruta).toBe(3)
    expect(rengA.datos.has(RENG_CLAVE_PLEGADO_TEMARIO)).toBe(true)
  })

  it('valida al leer: JSON roto, versión desconocida, ids inventados, tipos erróneos y tamaño excesivo', () => {
    const rengLeer = (rengTexto: string | null): ReturnType<typeof rengLeerPlegado> => rengLeerPlegado({ getItem: () => rengTexto, setItem: () => undefined })
    expect(rengLeer(null)).toEqual(RENG_PLEGADO_VACIO)
    expect(rengLeer('{no es json')).toEqual(RENG_PLEGADO_VACIO)
    expect(rengLeer(JSON.stringify({ v: 2, niveles: { 1: false } }))).toEqual(RENG_PLEGADO_VACIO)
    expect(rengLeer(JSON.stringify({ v: 1, niveles: { 1: false, 99: true, 2: 'sí' }, bloques: { 'n1-b5': true, 'x-y': true, 'n1-b6': 1 }, ruta: 12 }))).toEqual({ niveles: { '1': false }, bloques: { 'n1-b5': true }, ruta: null })
    expect(rengLeer(JSON.stringify([1, 2]))).toEqual(RENG_PLEGADO_VACIO)
    expect(rengLeer('x'.repeat(9000))).toEqual(RENG_PLEGADO_VACIO)
    expect(rengLeerPlegado(null)).toEqual(RENG_PLEGADO_VACIO)
    expect(rengLeerPlegado({ getItem: () => { throw new Error('bloqueado') }, setItem: () => undefined })).toEqual(RENG_PLEGADO_VACIO)
    expect(rengGuardarPlegado({ getItem: () => null, setItem: () => { throw new Error('lleno') } }, RENG_PLEGADO_VACIO)).toBe(false)
    expect(rengGuardarPlegado(null, RENG_PLEGADO_VACIO)).toBe(false)
  })

  it('el plegado no usa ninguna clave de las existentes', () => {
    expect(RENG_CLAVE_PLEGADO_TEMARIO).toBe('ciencia.temario.simulador-quimica')
    expect([RENG_CLAVE_PRACTICA, RENG_CLAVE_PROGRESO_LECCIONES, RENG_CLAVE_NIVEL_PRACTICA, 'quimica.nivel', 'quimica.historial']).not.toContain(RENG_CLAVE_PLEGADO_TEMARIO)
  })

  it('la búsqueda ignora tildes y mayúsculas, encuentra por título de subtema, de bloque y por id', () => {
    const rengCat = rengCatalogoReal()
    const rengStock = rengBuscarEnCatalogo(rengCat, 'STOCK')
    expect(rengStock.subtemas.has('n1-b5-s4')).toBe(true)
    expect(rengStock.bloques.has('n1-b5')).toBe(true)
    expect(rengBuscarEnCatalogo(rengCat, 'quimica organica').bloques.has('n3-b28')).toBe(true)
    const rengNomenclatura = rengBuscarEnCatalogo(rengCat, 'nomenclatura inorganica')
    expect(rengCat.niveles[0]!.bloques.find((rengB) => rengB.numero === 5)!.subtemas.every((rengS) => rengNomenclatura.subtemas.has(rengS.id))).toBe(true)
    expect(rengNomenclatura.subtemas.has('n3-b27-s6')).toBe(true)
    expect(rengBuscarEnCatalogo(rengCat, 'n1-b5-s4').subtemas.has('n1-b5-s4')).toBe(true)
    expect(rengBuscarEnCatalogo(rengCat, '').subtemas.size).toBe(0)
    expect(rengBuscarEnCatalogo(rengCat, 'zzzz inexistente').subtemas.size).toBe(0)
  })

  it('el título legible pasa de mayúsculas a minúsculas con inicial', () => {
    expect(rengTituloLegible('QUÍMICA PREUNIVERSITARIA')).toBe('Química preuniversitaria')
  })
})
