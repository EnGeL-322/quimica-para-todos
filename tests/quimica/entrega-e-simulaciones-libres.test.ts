import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { rengCatalogoReal, rengTextoCapas } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import type { RengRecurso } from '../../src/renderer/modules/simulador-quimica/temario/tipos'

const RENG_MODULO = join(import.meta.dirname, '../../src/renderer/modules/simulador-quimica')
const rengLeer = (rengRuta: string): string => readFileSync(join(RENG_MODULO, rengRuta), 'utf8').replace(/\r\n/g, '\n')
const RENG_ESCENAS_CON_PREDICCION = ['EscenaColorimetria', 'EscenaSolubilidad', 'EscenaElectroquimica', 'EscenaIsomeros', 'EscenaDilucion']

describe('Entrega E · la predicción previa es opcional y está apagada por defecto', () => {
  it('las cinco escenas con predicción empiezan sin predecir y su «Calcular» solo exige la predicción si se activa', () => {
    for (const rengE of RENG_ESCENAS_CON_PREDICCION) {
      const rengT = rengLeer(`modos/simulacion/${rengE}.tsx`)
      expect(rengT, rengE).toMatch(/const \[rengQuierePredecir, rengSetQuierePredecir\] = useState\(false\)/)
      expect(rengT, rengE).toMatch(/\{rengQuierePredecir && \(/)
      expect(rengT, rengE).toMatch(/Quiero predecir antes de (calcular|ver el resultado) \(opcional\)/)
      expect(rengT, rengE).not.toMatch(/Prefiero ver el resultado sin predecir|Ver el resultado sin predecir|rengSinPredecir/)
    }
    for (const rengE of ['EscenaColorimetria', 'EscenaSolubilidad', 'EscenaElectroquimica', 'EscenaIsomeros']) expect(rengLeer(`modos/simulacion/${rengE}.tsx`), rengE).toMatch(/const rengFaltaPrediccion = rengA === null && (rengPuedePredecir && )?rengQuierePredecir && /)
    expect(rengLeer('modos/simulacion/EscenaDilucion.tsx')).toMatch(/disabled=\{!rengValido \|\| \(rengQuierePredecir && \(!rengPred\.moles \|\| !rengPred\.conc\)\)\}/)
  })

  it('las guías y los avisos de las escenas ya no piden predecir como paso previo obligatorio', () => {
    const rengGuias = rengLeer('modos/Simulaciones.tsx')
    expect(rengGuias).not.toMatch(/Predice (dónde|si|qué)/)
    for (const rengE of RENG_ESCENAS_CON_PREDICCION) expect(rengLeer(`modos/simulacion/${rengE}.tsx`), rengE).not.toMatch(/, predice y pulsa|Elige (las dos predicciones|una predicción) \(o marca/)
  })

  it('sabotaje: el patrón de «predicción obligatoria» sí se detecta en el código antiguo', () => {
    const rengAntiguo = 'const rengFaltaPrediccion = rengA === null && !rengSinPredecir && (rengPred.zona === \'\')'
    expect(/rengSinPredecir/.test(rengAntiguo)).toBe(true)
    expect(/const rengFaltaPrediccion = rengA === null && (rengPuedePredecir && )?rengQuierePredecir && /.test(rengAntiguo)).toBe(false)
  })
})

describe('Entrega E · el temario cuenta aprender, prácticas y simulaciones por separado sin cambiar la cobertura', () => {
  const rengCat = rengCatalogoReal()
  const rengIndependiente = (rengRecursos: readonly RengRecurso[]): { aprender: boolean; practica: boolean; simulacion: boolean } => ({
    aprender: rengRecursos.some((rengR) => rengR.tipo === 'tema' || rengR.tipo === 'leccion-n1'),
    practica: rengRecursos.some((rengR) => rengR.tipo === 'tema' || rengR.tipo === 'practica' || rengR.tipo === 'practica-n1'),
    simulacion: rengRecursos.some((rengR) => rengR.tipo === 'escena' || rengR.tipo === 'escena-n1')
  })

  it('en cada bloque y nivel, los contadores por tipo coinciden con un recuento independiente sobre los recursos confirmados', () => {
    let rengSimulacionesTotal = 0
    for (const rengN of rengCat.niveles) {
      for (const rengB of rengN.bloques) {
        const rengE = { aprender: 0, practica: 0, simulacion: 0 }
        for (const rengS of rengB.subtemas) {
          const rengI = rengIndependiente(rengS.confirmados)
          if (rengI.aprender) rengE.aprender++
          if (rengI.practica) rengE.practica++
          if (rengI.simulacion) rengE.simulacion++
        }
        expect(rengB.conteo.porCapa.aprender, `bloque ${rengB.numero} aprender`).toBe(rengE.aprender)
        expect(rengB.conteo.porCapa.practica, `bloque ${rengB.numero} prácticas`).toBe(rengE.practica)
        expect(rengB.conteo.porCapa.simulacion, `bloque ${rengB.numero} simulaciones`).toBe(rengE.simulacion)
        rengSimulacionesTotal += rengE.simulacion
      }
      expect(rengN.conteo.porCapa.simulacion).toBe(rengN.bloques.reduce((rengA, rengB) => rengA + rengB.conteo.porCapa.simulacion, 0))
    }
    expect(rengCat.cobertura.porCapa.simulacion).toBe(rengSimulacionesTotal)
    expect(rengSimulacionesTotal).toBeGreaterThan(0)
  })

  it('un tema con simulación no cuenta como práctica por tener escena, ni una escena suelta como práctica', () => {
    const rengSoloEscena = rengCat.niveles.flatMap((rengN) => rengN.bloques.flatMap((rengB) => rengB.subtemas)).filter((rengS) => rengS.confirmados.length > 0 && rengS.confirmados.every((rengR) => rengR.tipo === 'escena' || rengR.tipo === 'escena-n1'))
    for (const rengS of rengSoloEscena) expect(rengS.evaluacion.capas).toEqual(['simulacion'])
  })

  it('el texto mostrado nombra los tres tipos por separado y no mezcla prácticas con simulaciones', () => {
    expect(rengTextoCapas({ aprender: 4, practica: 3, simulacion: 2, consulta: 9 })).toBe('Aprender 4 · Prácticas 3 · Simulaciones 2')
    expect(rengLeer('modos/Temario.tsx')).toMatch(/rengTextoCapas\(rengB\.conteo\.porCapa\)/)
    expect(rengLeer('modos/Temario.tsx')).toMatch(/rengTextoCapas\(rengN\.conteo\.porCapa\)/)
    expect(rengLeer('modos/Temario.tsx')).toMatch(/data-cobertura="capas"/)
  })

  it('sabotaje: un recuento que mezcla simulaciones con prácticas se distingue del real', () => {
    const rengMezclado = rengCat.niveles.flatMap((rengN) => rengN.bloques.flatMap((rengB) => rengB.subtemas)).filter((rengS) => rengS.confirmados.some((rengR) => rengR.tipo === 'tema' || rengR.tipo === 'practica' || rengR.tipo === 'practica-n1' || rengR.tipo === 'escena' || rengR.tipo === 'escena-n1')).length
    expect(rengMezclado).toBeGreaterThan(rengCat.cobertura.porCapa.practica)
  })

  it('las reglas de cobertura no cambian: las definiciones de Completado y Verificado siguen exigiendo lo mismo', () => {
    const rengEstado = rengLeer('temario/estado.ts')
    expect(rengEstado).toContain("completado: 'Un tema confirmado con lección y práctica con corrección, atestación registrada de que tratan este subtema y, si el tema tiene escena, esa simulación confirmada.'")
    expect(rengEstado).toContain('Falta la simulación asociada al tema')
    expect(rengEstado).toContain('Falta un tema confirmado con lección y práctica con corrección')
  })
})
