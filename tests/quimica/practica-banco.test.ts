import { describe, expect, it } from 'vitest'
import { RENG_FAMILIAS, RENG_TEMAS, rengCorregirEjercicio, rengCorregirMetodo, rengEjercicioDeTema, rengEjercicioPorId, rengGenerarDeFamilia, rengNivelesDeTema, rengNivelParaTema, rengRespuestaTexto } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_NIVELES_PRACTICA } from '../../src/renderer/modules/simulador-quimica/practica/niveles'
import { RENG_RAMAS } from '../../src/renderer/modules/simulador-quimica/practica/tipos'

const RENG_SEMILLAS = Array.from({ length: 24 }, (_, rengI) => rengI + 1)

describe('banco de ejercicios: invariantes de cada familia', () => {
  for (const rengFamilia of RENG_FAMILIAS) {
    for (const rengNivel of rengFamilia.niveles) {
      it(`${rengFamilia.id} · ${rengNivel}: genera, es reproducible y se corrige a sí mismo`, () => {
        const rengGenerados = RENG_SEMILLAS.map((rengS) => rengGenerarDeFamilia(rengFamilia, rengNivel, rengS))
        expect(rengGenerados.filter(Boolean).length, 'ninguna semilla genera').toBeGreaterThan(RENG_SEMILLAS.length * 0.6)
        for (const rengE of rengGenerados) {
          if (!rengE) continue
          const rengOtra = rengGenerarDeFamilia(rengFamilia, rengNivel, rengE.semilla)
          expect(JSON.stringify(rengOtra), 'no reproducible').toBe(JSON.stringify(rengE))
          expect(rengE.id).toBe(`${rengFamilia.id}~${rengNivel}~${rengE.semilla}`)
          expect(rengEjercicioPorId(rengE.id)?.enunciado).toBe(rengE.enunciado)
          for (const rengD of rengE.datos) expect(rengE.enunciado.includes(rengD.texto) || rengE.pregunta.includes(rengD.texto), `${rengE.id}: el dato «${rengD.texto}» no aparece en el enunciado`).toBe(true)
          expect(rengE.pistas.length, rengE.id).toBeGreaterThanOrEqual(1)
          expect(rengE.pasos.length, rengE.id).toBeGreaterThanOrEqual(1)
          expect(rengE.enunciado.length, rengE.id).toBeGreaterThan(15)
          expect(rengE.fuente?.texto.length ?? 0, `${rengE.id}: sin fuente`).toBeGreaterThan(10)
          if (rengE.respuesta.tipo === 'numero') expect(Number.isFinite(rengE.respuesta.valor), rengE.id).toBe(true)
          if (rengNivel === 'quimico' || rengNivel === 'cientifico') expect(rengE.hipotesis?.length ?? 0, `${rengE.id}: nivel avanzado sin hipótesis a la vista`).toBeGreaterThan(0)
          if (rengNivel === 'quimico' || rengNivel === 'cientifico') expect(rengE.comprobacion?.length ?? 0, `${rengE.id}: nivel avanzado sin comprobación`).toBeGreaterThan(0)
          expect(rengE.errorFrecuente?.length ?? 0, `${rengE.id}: sin error frecuente`).toBeGreaterThan(5)
          const rengTexto = rengRespuestaTexto(rengE)
          expect(rengTexto, `${rengE.id}: sin texto de respuesta`).not.toBe('')
          const rengV = rengCorregirEjercicio(rengE, rengTexto)
          expect(rengV.tipo, `${rengE.id}: ${rengTexto} → ${rengV.mensaje}`).toBe('correcto')
          if (rengE.metodo) {
            expect(rengE.metodo.opciones.some((rengO) => rengO.id === rengE.metodo!.correcta), rengE.id).toBe(true)
            expect(rengCorregirMetodo(rengE, rengE.metodo.correcta)?.tipo).toBe('correcto')
          }
        }
      })
    }
  }
})

describe('catálogo de temas y niveles', () => {
  it('hay cinco ramas con al menos dos familias distintas cada una', () => {
    expect(RENG_RAMAS.map((rengR) => rengR.id)).toEqual(['general', 'inorganica', 'organica', 'analitica', 'fisicoquimica'])
    for (const rengR of RENG_RAMAS) expect(new Set(RENG_FAMILIAS.filter((rengF) => rengF.rama === rengR.id).map((rengF) => rengF.id)).size, rengR.id).toBeGreaterThanOrEqual(2)
  })
  it('los cuatro niveles están cubiertos en el conjunto y cada tema muestra solo niveles con ejercicios válidos', () => {
    const rengUsados = new Set<string>()
    for (const rengT of RENG_TEMAS) {
      const rengNiveles = rengNivelesDeTema(rengT.id)
      expect(rengNiveles.length, rengT.id).toBeGreaterThan(0)
      for (const rengN of rengNiveles) {
        rengUsados.add(rengN)
        if (rengT.legado) continue
        expect(rengEjercicioDeTema(rengT.id, rengN, 1), `${rengT.id}/${rengN}`).not.toBeNull()
      }
      for (const rengN of RENG_NIVELES_PRACTICA.filter((rengX) => !rengNiveles.includes(rengX))) expect(rengEjercicioDeTema(rengT.id, rengN, 1), `${rengT.id}/${rengN} no debería ofrecerse`).toBeNull()
    }
    expect([...rengUsados].sort()).toEqual([...RENG_NIVELES_PRACTICA].sort())
  })
  it('si el nivel elegido no existe en un tema, se usa el más cercano', () => {
    expect(rengNivelParaTema('ajuste-cinetico', 'preuniversitario')).toBe('quimico')
    expect(rengNivelParaTema('ajuste-cinetico', 'cientifico')).toBe('cientifico')
    expect(rengNivelParaTema('mol', 'quimico')).toBe('quimico')
  })
  it('cada variante de un tema alterna familias y distintas semillas dan enunciados distintos', () => {
    const rengFamilias = new Set(RENG_SEMILLAS.map((rengS) => rengEjercicioDeTema('estequiometria', 'universitario', rengS)?.familia))
    expect(rengFamilias.size).toBeGreaterThanOrEqual(1)
    const rengEnunciados = new Set(RENG_SEMILLAS.map((rengS) => rengEjercicioDeTema('mol', 'preuniversitario', rengS)?.enunciado))
    expect(rengEnunciados.size).toBeGreaterThan(8)
  })
})
