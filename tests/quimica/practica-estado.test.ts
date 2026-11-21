import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_ACCESOS_QUIMICA } from '../../src/renderer/modules/simulador-quimica/accesos'
import { RENG_MENU_QUIMICA } from '../../src/renderer/modules/simulador-quimica/menu'
import { RENG_DESTINOS_QUIMICA, RENG_EXPERIMENTOS_QUIMICA, RENG_NAV_INICIAL, rengDescripcionNav, rengNavDeSubruta, rengSubrutaDeNav, type RengNavQuimica } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { RENG_FAMILIAS, rengCorregirEjercicio, rengEjercicioDeTema, rengGenerarDeFamilia, rengRespuestaTexto } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_MAX_PENDIENTES, rengClaveIntento, rengEstadoPracticaInicial, rengIntentoAbierto, rengPractica, type RengEstadoPractica } from '../../src/renderer/modules/simulador-quimica/practica/estado'
import { rengTransferirEjercicio } from '../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'

const rengFuente = (rengP: string): string => readFileSync(join(import.meta.dirname, '../../src/renderer/modules/simulador-quimica', rengP), 'utf8')
const rengVeredictoOk = { tipo: 'correcto', motivo: 'correcta', mensaje: 'ok' } as const

describe('intento abierto: se conserva y se puede recuperar', () => {
  const rengBase = (): RengEstadoPractica => rengEstadoPracticaInicial('general', 'mol', 'preuniversitario')
  it('un intento sin tocar no se guarda; uno con respuesta, método, pistas o resolución sí', () => {
    const rengE = rengBase()
    expect(rengIntentoAbierto(rengE.actual)).toBe(false)
    expect(rengPractica(rengE, { tipo: 'elegir', tema: 'ajuste', nivel: 'preuniversitario', semilla: 1 }).pendientes).toHaveLength(0)
    for (const rengA of [{ tipo: 'escribir', texto: '2,5' }, { tipo: 'metodo', id: 'a' }, { tipo: 'pista', maximo: 3 }, { tipo: 'resolucion' }] as const) {
      const rengS = rengPractica(rengPractica(rengE, rengA), { tipo: 'elegir', tema: 'ajuste', nivel: 'preuniversitario', semilla: 1 })
      expect(rengS.pendientes.map(rengClaveIntento), rengA.tipo).toEqual(['mol~preuniversitario~1'])
    }
  })
  it('cambiar de tema, de nivel o de variante guarda el intento; recuperarlo intercambia los dos', () => {
    let rengE = rengPractica(rengBase(), { tipo: 'escribir', texto: '0,5' })
    rengE = rengPractica(rengE, { tipo: 'elegir', tema: 'mol', nivel: 'universitario', semilla: 1 })
    expect(rengE.actual.respuesta).toBe('')
    expect(rengE.pendientes[0]!.respuesta).toBe('0,5')
    rengE = rengPractica(rengE, { tipo: 'escribir', texto: '1,5e22' })
    rengE = rengPractica(rengE, { tipo: 'recuperar', clave: 'mol~preuniversitario~1' })
    expect(rengE.actual).toMatchObject({ nivel: 'preuniversitario', respuesta: '0,5' })
    expect(rengE.pendientes.map((rengP) => rengP.respuesta)).toEqual(['1,5e22'])
    rengE = rengPractica(rengE, { tipo: 'elegir', tema: 'mol', nivel: 'preuniversitario', semilla: 2 })
    expect(rengE.pendientes.map(rengClaveIntento)).toEqual(['mol~preuniversitario~1', 'mol~universitario~1'])
    rengE = rengPractica(rengE, { tipo: 'descartar', clave: 'mol~universitario~1' })
    expect(rengE.pendientes).toHaveLength(1)
  })
  it('volver a elegir el mismo ejercicio no pierde nada; uno resuelto no se guarda; hay un máximo', () => {
    const rengE = rengPractica(rengBase(), { tipo: 'escribir', texto: 'x' })
    expect(rengPractica(rengE, { tipo: 'elegir', tema: 'mol', nivel: 'preuniversitario', semilla: 1 }).actual.respuesta).toBe('x')
    const rengResuelto = rengPractica(rengPractica(rengE, { tipo: 'escribir', texto: '1' }), { tipo: 'veredicto', veredicto: rengVeredictoOk, metodo: null })
    expect(rengResuelto.actual.resuelto).toBe(true)
    expect(rengPractica(rengResuelto, { tipo: 'elegir', tema: 'ajuste', nivel: 'preuniversitario', semilla: 1 }).pendientes).toHaveLength(0)
    expect(rengPractica(rengResuelto, { tipo: 'escribir', texto: '2' }).actual.resuelto).toBe(false)
    let rengMuchos = rengBase()
    for (let rengI = 1; rengI <= RENG_MAX_PENDIENTES + 3; rengI++) {
      rengMuchos = rengPractica(rengMuchos, { tipo: 'escribir', texto: `r${rengI}` })
      rengMuchos = rengPractica(rengMuchos, { tipo: 'elegir', tema: 'mol', nivel: 'preuniversitario', semilla: rengI + 1 })
    }
    expect(rengMuchos.pendientes).toHaveLength(RENG_MAX_PENDIENTES)
  })
  it('las pistas no superan el máximo y el veredicto cuenta las comprobaciones', () => {
    let rengE = rengBase()
    for (let rengI = 0; rengI < 6; rengI++) rengE = rengPractica(rengE, { tipo: 'pista', maximo: 3 })
    expect(rengE.actual.pistas).toBe(3)
    rengE = rengPractica(rengE, { tipo: 'veredicto', veredicto: { tipo: 'incorrecto', motivo: 'bajo', mensaje: 'x' }, metodo: null })
    expect(rengE.actual).toMatchObject({ comprobaciones: 1, resuelto: false })
  })
})

describe('transferir a la simulación no cambia la práctica', () => {
  it('copia las entradas validadas sin tocar el ejercicio ni el estado de la práctica', () => {
    let rengCasos = 0
    for (const rengF of RENG_FAMILIAS) {
      for (const rengN of rengF.niveles) {
        const rengE = rengGenerarDeFamilia(rengF, rengN, 2)
        if (!rengE?.simulacion) continue
        const rengCopia = JSON.stringify(rengE)
        const rengEstado = rengPractica(rengEstadoPracticaInicial(rengE.rama, rengE.tema, rengE.nivel), { tipo: 'escribir', texto: '42' })
        const rengAntes = JSON.stringify(rengEstado)
        const rengCongelado = Object.freeze({ escena: rengE.simulacion.escena, entradas: Object.freeze({ ...rengE.simulacion.entradas }) })
        const rengT = rengTransferirEjercicio(rengCongelado)
        expect(rengT.ok, rengE.id).toBe(true)
        if (rengT.ok) {
          rengT.entradas['__alterada'] = 1
          expect(rengCongelado.entradas).not.toHaveProperty('__alterada')
        }
        expect(JSON.stringify(rengE)).toBe(rengCopia)
        expect(JSON.stringify(rengEstado)).toBe(rengAntes)
        expect(rengCorregirEjercicio(rengE, rengRespuestaTexto(rengE)).tipo).toBe('correcto')
        rengCasos++
      }
    }
    expect(rengCasos).toBeGreaterThan(8)
  })
  it('una transferencia fuera de dominio da un diagnóstico y no se ofrece', () => {
    expect(rengTransferirEjercicio({ escena: 'mezcla', entradas: { acido: 'hcl', cAcido: 0.5, VAcido: 25, cBase: 0.01, VBase: 10 } })).toMatchObject({ ok: false })
    expect(rengTransferirEjercicio({ escena: 'termo', entradas: { reaccion: 'inventada', T: 300 } })).toMatchObject({ ok: false, diagnostico: expect.stringContaining('no está en el modelo') })
  })
  it('la simulación de estado final se calcula con «Calcular» o «Actualizar»; la temporal se abre en pausa', () => {
    expect(rengFuente('modos/simulacion/comunes.tsx')).toMatch(/rengAplicado \? 'Actualizar' : 'Calcular'/)
    for (const rengF of ['AcidoBase', 'Equilibrio', 'Energia']) expect(rengFuente(`modos/simulacion/Escena${rengF}.tsx`)).toMatch(/RengBotonCalcular/)
    expect(rengFuente('modos/MezclaAcidoBase.tsx')).toMatch(/RengBotonCalcular/)
    const rengCinetica = rengFuente('modos/simulacion/EscenaCinetica.tsx')
    expect(rengCinetica).toMatch(/useState\(false\)/)
    expect(rengCinetica).toMatch(/En pausa en t = 0/)
    expect(rengCinetica).toMatch(/'Iniciar'/)
  })
})

describe('rutas y orden de la navegación', () => {
  it('las siete secciones van en este orden y la Mesa queda al final', () => {
    expect(RENG_DESTINOS_QUIMICA.map((rengD) => rengD.id)).toEqual(['catalogo', 'temario', 'aprender', 'practicas', 'simulacion', 'casos', 'mesa'])
    expect(RENG_MENU_QUIMICA.filter((rengE) => !rengE.modulo).map((rengE) => rengE.sub)).toEqual(['catalogo', 'temario', 'aprender', 'practicas', 'simulacion', 'casos', 'mesa'])
    const rengView = rengFuente('View.tsx')
    const rengPos = ['quimica-panel-catalogo', 'quimica-panel-temario', 'quimica-panel-aprender', 'quimica-panel-practicas', 'quimica-panel-simulacion', 'quimica-panel-casos', 'quimica-panel-mesa'].map((rengId) => rengView.indexOf(`id="${rengId}"`))
    expect(rengPos.every((rengP) => rengP > 0)).toBe(true)
    expect([...rengPos].sort((rengA, rengB) => rengA - rengB)).toEqual(rengPos)
  })
  it('abre por defecto en el Catálogo y la ruta sin subruta no cambia lo que hay', () => {
    expect(RENG_NAV_INICIAL.destino).toBe('catalogo')
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, null)).toBe(RENG_NAV_INICIAL)
    expect(rengDescripcionNav(RENG_NAV_INICIAL).titulo).toBe('Catálogo')
  })
  it('los enlaces antiguos siguen abriendo su destino', () => {
    const rengAntiguos: Array<[string, Partial<RengNavQuimica>]> = [
      ['mesa', { destino: 'mesa', herramienta: 'explorar' }],
      ['enlaces', { destino: 'mesa', herramienta: 'enlaces' }],
      ['formulacion', { destino: 'mesa', herramienta: 'formulacion' }],
      ['reacciones', { destino: 'mesa', herramienta: 'reacciones' }],
      ['experimentos', { destino: 'simulacion' }],
      ['acidobase', { destino: 'simulacion', experimento: 'acidobase' }],
      ['mezcla', { destino: 'simulacion', experimento: 'mezcla' }],
      ['cinetica', { destino: 'simulacion', experimento: 'cinetica' }],
      ['equilibrio', { destino: 'simulacion', experimento: 'equilibrio' }],
      ['termo', { destino: 'simulacion', experimento: 'termo' }],
      ['casos', { destino: 'casos' }],
      ['ejercicios', { destino: 'practicas' }],
      ['practicas', { destino: 'practicas' }],
      ['aprender', { destino: 'aprender' }]
    ]
    const rengExiste = (rengId: string): boolean => rengId === 'simulador-quimica'
    for (const [rengSub, rengEsperado] of rengAntiguos) {
      const rengRuta = rengResolverRuta(`#/simulador-quimica/${rengSub}`, rengExiste)
      expect(rengRuta.ruta, rengSub).toEqual({ id: 'simulador-quimica', sub: rengSub })
      expect(rengNavDeSubruta(RENG_NAV_INICIAL, rengSub), rengSub).toMatchObject(rengEsperado)
    }
    expect(rengResolverRuta('#/simulador-quimica', rengExiste).ruta).toEqual({ id: 'simulador-quimica', sub: null })
  })
  it('cambiar de sección conserva la molécula y la práctica: los paneles siguen montados, solo se ocultan', () => {
    const rengView = rengFuente('View.tsx')
    expect(rengView).toMatch(/hidden=\{rengDestino !== 'mesa'\}/)
    expect(rengView).toMatch(/hidden=\{rengDestino !== 'practicas'\}/)
    expect(rengView).toMatch(/useReducer\(rengPractica/)
    expect(rengView).toMatch(/rengCrearTrabajo\(\)/)
    const rengDesde: RengNavQuimica = { destino: 'mesa', herramienta: 'formulacion', experimento: 'termo', tema: null }
    for (const rengSub of ['catalogo', 'aprender', 'simulacion', 'practicas', 'ejercicios', 'casos']) expect(rengNavDeSubruta(rengDesde, rengSub).herramienta, rengSub).toBe('formulacion')
    expect(rengNavDeSubruta({ ...rengDesde, destino: 'practicas' }, 'mesa')).toMatchObject({ herramienta: 'explorar' })
  })
  it('el buscador abre la Mesa molecular y cada acceso del buscador se resuelve', () => {
    expect(RENG_ACCESOS_QUIMICA.map((rengA) => rengA.sub)).toContain('mesa')
    expect(RENG_ACCESOS_QUIMICA.find((rengA) => rengA.sub === 'mesa')!.nombre).toBe('Mesa molecular')
    for (const rengA of RENG_ACCESOS_QUIMICA) expect(rengSubrutaDeNav(rengNavDeSubruta(RENG_NAV_INICIAL, rengA.sub)), rengA.sub).toBe(rengA.sub)
    for (const rengE of RENG_EXPERIMENTOS_QUIMICA) expect(RENG_ACCESOS_QUIMICA.some((rengA) => rengA.sub === rengE)).toBe(true)
  })
  it('Inicio apunta al Catálogo y a la Mesa', () => {
    const rengInicio = readFileSync(join(import.meta.dirname, '../../src/renderer/inicio.ts'), 'utf8')
    expect(rengInicio).toMatch(/sub: 'catalogo'/)
    expect(rengInicio).toMatch(/sub: 'mesa'/)
    expect(rengInicio).not.toMatch(/sub: 'experimentos'/)
  })
})

describe('interfaz de ejercicios', () => {
  const rengVista = rengFuente('modos/VistaEjercicios.tsx')
  const rengSelector = rengFuente('modos/SelectorEjercicios.tsx')
  it('sigue el flujo elegir tema → comprobar → pista → otra variante, con simulación y Mesa', () => {
    for (const rengTexto of ['← Volver a temas', 'Comprobar', 'Pista (', 'Resolución paso a paso', 'Hipótesis y supuestos', 'Otra variante', 'Probarlo en el laboratorio', 'Abrir en Mesa molecular']) expect(rengVista, rengTexto).toContain(rengTexto)
    for (const rengTexto of ['Continuar práctica', 'Elegir tema', 'Recuperar', 'Descartar', 'Nivel preferido']) expect(rengSelector, rengTexto).toContain(rengTexto)
    expect(rengVista).toMatch(/Añadir junto a lo que hay/)
    expect(rengVista).toMatch(/Reemplazar la construcción/)
  })
  it('el selector ya no usa el desplegable de temas y la resolución no repite rótulos de paso', () => {
    expect(rengSelector).not.toMatch(/<select/)
    expect(rengVista).not.toMatch(/RengEtapa|Resolver otra variante|Ver resolución paso a paso/)
  })
  it('«Formular y nombrar» sigue siendo un tema de Inorgánica con su práctica actual', () => {
    expect(rengVista).toMatch(/<RengPracticaFormulacion /)
    const rengBanco = readFileSync(join(import.meta.dirname, '../../src/renderer/modules/simulador-quimica/practica/banco.ts'), 'utf8')
    expect(rengBanco).toMatch(/id: 'formular-nombrar', rama: 'inorganica'/)
    expect(rengEjercicioDeTema('formular-nombrar', 'preuniversitario', 1)).toBeNull()
  })
  it('el nivel se persiste con la clave nueva y la antigua se conserva', () => {
    const rengView = rengFuente('View.tsx')
    expect(rengView).toMatch(/rengGuardarNivelPractica\(rengAlmacenLocal\(\), rengN\)/)
    expect(rengView).toMatch(/rengLeerNivelPractica\(rengAlmacenLocal\(\)\)/)
    expect(rengView).toMatch(/aria-label="Detalle de la mesa \(atajos B y A\)"/)
  })
})
