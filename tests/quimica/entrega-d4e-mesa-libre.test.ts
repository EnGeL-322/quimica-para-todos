import { describe, expect, it } from 'vitest'
import { RENG_SUSTANCIAS } from '../../src/renderer/modules/tabla-periodica/catalogoSustancias'
import { RENG_FORMAS_PELIGRO, type RengFormaPeligro } from '../../src/renderer/modules/tabla-periodica/peligros'
import { RENG_MODELOS_ESCENA, rengCalcularEscena } from '../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'
import { RENG_MAX_SUSTANCIAS_MESA, RENG_MENSAJE_SIN_MODELO, RENG_ROLES_MESA, rengLeerCantidadMesa, rengPoliticaMesa, rengPonerEnMesa, rengPredecirMesa, rengTextoConcentracionPorDefecto, rengVerificarRolesMesa, type RengItemMesa, type RengResultadoMesa } from '../../src/renderer/modules/simulador-quimica/practica/mesaLibre'
import { rengCrearAzar } from '../../src/renderer/modules/simulador-quimica/practica/numeros'

const rengRel = (rengA: number, rengB: number): number => Math.abs(rengA - rengB) / Math.abs(rengB)
const rengSol = (rengId: string, rengV: string, rengC?: string): RengItemMesa => ({ sustanciaId: rengId, cantidad: rengV, concentracion: rengC ?? rengTextoConcentracionPorDefecto(rengId) })
const rengAgua = (rengV: string): RengItemMesa => ({ sustanciaId: 'agua', cantidad: rengV })
const rengSalCaCO3 = (rengQ: string): RengItemMesa => ({ sustanciaId: 'carbonato-de-calcio', cantidad: rengQ })
const rengPred = (rengR: RengResultadoMesa): Extract<RengResultadoMesa, { tipo: 'prediccion' }> => {
  if (rengR.tipo !== 'prediccion') throw new Error(`se esperaba una predicción y salió «${rengR.tipo}»: ${JSON.stringify(rengR)}`)
  return rengR
}
const rengValor = (rengR: Extract<RengResultadoMesa, { tipo: 'prediccion' }>, rengClave: string): number => rengR.resultados.find((rengX) => rengX.clave === rengClave)!.valor
const rengCodigos = (rengR: RengResultadoMesa): string[] => ('diagnosticos' in rengR ? rengR.diagnosticos.map((rengD) => rengD.codigo) : [])

const rengForma = (rengNivel: 'peligro' | 'atencion' | 'documentado' | 'no-clasificado', rengIndicaciones: RengFormaPeligro['registros'][number]['indicaciones'] = []): RengFormaPeligro => ({
  id: 'x', nombre: 'X', formula: 'X', registros: [{ nivel: rengNivel, indicaciones: rengIndicaciones, fuente: { tipo: 'icsc', organismo: 'Fuente de prueba', url: 'https://example.test/x', consulta: '2026-11-15', alcance: 'Forma de prueba' } }]
})

describe('D4.5 · política de la mesa: qué sustancias se pueden poner', () => {
  it('solo se pueden poner las que tienen ficha contrastada y todas «sin clasificación»: el conjunto exacto con el catálogo de hoy', () => {
    const rengPermitidas = RENG_SUSTANCIAS.filter((rengS) => rengPoliticaMesa(rengS.formas).puedePonerse).map((rengS) => rengS.id)
    expect(rengPermitidas.sort()).toEqual(['agua', 'carbonato-de-calcio', 'cloruro-de-sodio', 'glicerina', 'glucosa', 'hidrogenocarbonato-de-sodio', 'oxido-de-magnesio', 'sulfato-de-magnesio-heptahidratado'])
  })

  it('cada sustancia con palabra de advertencia, peligros documentados o sin ficha queda solo como ficha, con su motivo', () => {
    const rengMotivos: Record<string, string> = { peligro: 'peligro', atencion: 'atencion', documentado: 'documentado' }
    for (const rengS of RENG_SUSTANCIAS) {
      const rengNiveles = rengS.formas.flatMap((rengF) => rengF.registros.map((rengR) => rengR.nivel))
      const rengP = rengPoliticaMesa(rengS.formas)
      if (rengNiveles.length === 0) expect(rengP, rengS.id).toMatchObject({ puedePonerse: false, motivo: 'sin-ficha' })
      else if (rengNiveles.includes('peligro')) expect(rengP, rengS.id).toMatchObject({ puedePonerse: false, motivo: rengMotivos['peligro'] })
      else if (rengNiveles.includes('atencion')) expect(rengP, rengS.id).toMatchObject({ puedePonerse: false, motivo: rengMotivos['atencion'] })
      else if (rengNiveles.includes('documentado')) expect(rengP, rengS.id).toMatchObject({ puedePonerse: false, motivo: rengMotivos['documentado'] })
    }
    expect(RENG_SUSTANCIAS.find((rengS) => rengS.id === 'cobre')!.formas.some((rengF) => rengF.registros[0]?.nivel === 'peligro')).toBe(true)
  })

  it('sabotajes de la política con formas inventadas: una forma peligrosa entre otras sin clasificar, sin registros o con indicaciones que no sean irritación', () => {
    expect(rengPoliticaMesa([rengForma('no-clasificado')])).toMatchObject({ puedePonerse: true })
    expect(rengPoliticaMesa([rengForma('no-clasificado'), rengForma('peligro')])).toMatchObject({ puedePonerse: false, motivo: 'peligro' })
    expect(rengPoliticaMesa([rengForma('no-clasificado'), rengForma('atencion')])).toMatchObject({ puedePonerse: false, motivo: 'atencion' })
    expect(rengPoliticaMesa([rengForma('no-clasificado'), rengForma('documentado')])).toMatchObject({ puedePonerse: false, motivo: 'documentado' })
    expect(rengPoliticaMesa([])).toMatchObject({ puedePonerse: false, motivo: 'sin-ficha' })
    expect(rengPoliticaMesa([{ id: 'p', nombre: 'P', formula: 'P', registros: [] }])).toMatchObject({ puedePonerse: false, motivo: 'sin-ficha' })
    expect(rengPoliticaMesa([rengForma('no-clasificado', [{ tipo: 'inflamabilidad', descripcion: 'Arde.' }])])).toMatchObject({ puedePonerse: false, motivo: 'indicaciones' })
    expect(rengPoliticaMesa([rengForma('no-clasificado', [{ tipo: 'irritacion', descripcion: 'Polvo.' }])])).toMatchObject({ puedePonerse: true })
  })

  it('una forma sin ficha junto a una sin clasificar no impide ponerla, y el alcance de la clasificación queda registrado', () => {
    const rengNaCl = RENG_SUSTANCIAS.find((rengS) => rengS.id === 'cloruro-de-sodio')!
    expect(rengNaCl.formas.some((rengF) => rengF.registros.length === 0)).toBe(true)
    const rengP = rengPoliticaMesa(rengNaCl.formas)
    expect(rengP).toMatchObject({ puedePonerse: true })
    expect(rengP.puedePonerse && rengP.alcances.length).toBeGreaterThan(0)
  })

  it('el catálogo de formas de peligro no se tocó: 103 formas con ficha', () => {
    expect(RENG_FORMAS_PELIGRO.filter((rengF) => rengF.registros.length > 0)).toHaveLength(103)
  })
})

describe('D4.5 · roles: cada sustancia de un modelo es la que dice ser', () => {
  it('los roles de hoy cubren agua, NaCl, glucosa y CaCO₃, y todas se pueden poner en la mesa', () => {
    expect(Object.keys(RENG_ROLES_MESA).sort()).toEqual(['agua', 'carbonato-de-calcio', 'cloruro-de-sodio', 'glucosa'])
    for (const rengId of Object.keys(RENG_ROLES_MESA)) expect(rengPoliticaMesa(RENG_SUSTANCIAS.find((rengS) => rengS.id === rengId)!.formas).puedePonerse, rengId).toBe(true)
    expect(() => rengVerificarRolesMesa()).not.toThrow()
  })

  it('sabotajes del candado: una sustancia con el modelo de otra, un id ausente o una sal que no coincide impiden cargar', () => {
    expect(() => rengVerificarRolesMesa({ glucosa: { rol: 'solucion', solucionId: 'nacl' } })).toThrow(/no coincide con el soluto/)
    expect(() => rengVerificarRolesMesa({ 'cloruro-de-sodio': { rol: 'sal', salId: 'caco3' } })).toThrow(/no coincide con la sal/)
    expect(() => rengVerificarRolesMesa({ glucosa: { rol: 'disolvente' } })).toThrow(/no es agua/)
    expect(() => rengVerificarRolesMesa({ 'no-existe': { rol: 'disolvente' } })).toThrow(/no está en el catálogo/)
    expect(() => rengVerificarRolesMesa({ glucosa: { rol: 'solucion', solucionId: 'sacarosa2' } })).toThrow(/que Dilución no tiene/)
    expect(() => rengVerificarRolesMesa({ 'carbonato-de-calcio': { rol: 'sal', salId: 'baso4' } })).toThrow(/no tiene fuente de Ksp registrada/)
  })
})

describe('D4.5 · mezclas con modelo: Dilución', () => {
  it('25 mL de NaCl 0,2 mol/L + 75 mL de agua → 0,005 mol en 100 mL = 0,05 mol/L, factor 4 (a mano: 0,2 × 25 / 100)', () => {
    const rengR = rengPred(rengPredecirMesa([rengSol('cloruro-de-sodio', '25 mL'), rengAgua('75 mL')]))
    expect(rengR.escena).toBe('dilucion')
    expect(rengValor(rengR, 'n')).toBeCloseTo(0.005, 12)
    expect(rengValor(rengR, 'Vtotal')).toBeCloseTo(100, 10)
    expect(rengValor(rengR, 'c2')).toBeCloseTo(0.05, 12)
    expect(rengValor(rengR, 'F')).toBeCloseTo(4, 12)
  })

  it('el orden de las sustancias en la mesa no cambia la predicción', () => {
    const rengA = rengPred(rengPredecirMesa([rengSol('glucosa', '10 mL'), rengAgua('90 mL')]))
    const rengB = rengPred(rengPredecirMesa([rengAgua('90 mL'), rengSol('glucosa', '10 mL')]))
    expect(rengValor(rengA, 'c2')).toBe(rengValor(rengB, 'c2'))
    expect(rengValor(rengA, 'c2')).toBeCloseTo(0.05, 12)
  })

  it('las unidades compatibles dan lo mismo: 0,025 L, 25000 µL, 25 cm³ y 200 mmol/L frente a 25 mL y 0,2 mol/L', () => {
    const rengBase = rengValor(rengPred(rengPredecirMesa([rengSol('cloruro-de-sodio', '25 mL', '0,2 mol/L'), rengAgua('75 mL')])), 'c2')
    for (const [rengV, rengC, rengW] of [['0,025 L', '0,2 mol/L', '0,075 L'], ['25000 µL', '200 mmol/L', '75000 µL'], ['25 cm³', '0,2 M', '75 mL']] as const) expect(rengValor(rengPred(rengPredecirMesa([rengSol('cloruro-de-sodio', rengV, rengC), rengAgua(rengW)])), 'c2'), `${rengV} ${rengC} ${rengW}`).toBeCloseTo(rengBase, 12)
  })

  it('coincide con la escena Dilución (modo «volumen de disolvente igual al final») y con la conservación del soluto en 300 casos aleatorios', () => {
    const rengAzar = rengCrearAzar(45)
    for (let rengI = 0; rengI < 300; rengI++) {
      const rengVs = 0.5 + rengAzar() * 500
      const rengVa = 1 + rengAzar() * 2000
      const rengC = 0.01 + rengAzar() * 5
      const rengR = rengPred(rengPredecirMesa([rengSol('cloruro-de-sodio', `${rengVs} mL`, `${rengC} mol/L`), rengAgua(`${rengVa} mL`)]))
      const rengEscena = rengCalcularEscena('dilucion', { c1: rengC, Va: rengVs, Vf: rengVa, modo: 1, Vdisp: rengVs })
      expect(rengRel(rengValor(rengR, 'c2'), rengEscena['c2']!)).toBeLessThan(1e-12)
      expect(rengRel(rengValor(rengR, 'c2') * rengValor(rengR, 'Vtotal') / 1000, (rengC * rengVs) / 1000)).toBeLessThan(1e-12)
      expect(rengRel(rengValor(rengR, 'Vtotal'), rengVs + rengVa)).toBeLessThan(1e-12)
    }
  })

  it('dice qué escena y qué dato respaldan la predicción: el nivel del modelo, la concentración «de ejemplo» sin verificar y la suposición de volúmenes', () => {
    const rengR = rengPred(rengPredecirMesa([rengSol('cloruro-de-sodio', '25 mL'), rengAgua('75 mL')]))
    expect(rengR.respaldo.escena).toBe('dilucion')
    expect(rengR.respaldo.nombreEscena).toBe(RENG_MODELOS_ESCENA.dilucion.nombre)
    expect(rengR.respaldo.evidencia).toBe(RENG_MODELOS_ESCENA.dilucion.evidencia)
    expect(rengR.respaldo.verificacionModelo).toBe(RENG_MODELOS_ESCENA.dilucion.verificacion)
    const rengConc = rengR.respaldo.datos.find((rengD) => /Concentración/.test(rengD.nombre))!
    expect(rengConc).toMatchObject({ verificacion: 'ejemplo', sinVerificar: true })
    expect(rengConc.fuente).toMatch(/no es un dato publicado/)
    expect(rengR.respaldo.datos.find((rengD) => /Volúmenes aditivos/.test(rengD.nombre))).toMatchObject({ verificacion: 'libro', sinVerificar: true })
    const rengPropia = rengPred(rengPredecirMesa([rengSol('cloruro-de-sodio', '25 mL', '0,35 mol/L'), rengAgua('75 mL')]))
    expect(rengPropia.respaldo.datos.find((rengD) => /Concentración/.test(rengD.nombre))).toMatchObject({ verificacion: 'usuario', sinVerificar: false })
  })
})

describe('D4.5 · mezclas con modelo: Solubilidad (CaCO₃ en agua)', () => {
  const rengMasaMolar = 12.011 + 40.078 + 3 * 15.999

  it('0,10 g de CaCO₃ en 1 L de agua: se disuelve s₀ = √(4,5·10⁻⁹) = 6,7082·10⁻⁵ mol/L (6,714 mg) y el resto queda como sólido', () => {
    const rengR = rengPred(rengPredecirMesa([rengSalCaCO3('0,10 g'), rengAgua('1000 mL')]))
    expect(rengR.escena).toBe('solubilidad')
    expect(rengR.estado).toBe('saturada')
    expect(rengRel(rengValor(rengR, 's0'), Math.sqrt(4.5e-9))).toBeLessThan(1e-12)
    expect(rengRel(rengValor(rengR, 'disuelto'), Math.sqrt(4.5e-9))).toBeLessThan(1e-12)
    expect(rengRel(rengValor(rengR, 'masaDisuelta'), Math.sqrt(4.5e-9) * rengMasaMolar * 1000)).toBeLessThan(2e-3)
    expect(rengValor(rengR, 'masaDisuelta')).toBeCloseTo(6.714, 2)
    expect(rengRel(rengValor(rengR, 'solido0'), 0.1 / rengMasaMolar)).toBeLessThan(2e-3)
    expect(rengRel(rengValor(rengR, 'solidoFinal'), 0.1 / rengMasaMolar - Math.sqrt(4.5e-9))).toBeLessThan(2e-3)
  })

  it('1 mg en 1 L es menos que la solubilidad: se disuelve todo (a mano: 1·10⁻³ g / 100,09 g/mol = 9,99·10⁻⁶ mol/L < 6,7·10⁻⁵)', () => {
    const rengR = rengPred(rengPredecirMesa([rengSalCaCO3('1 mg'), rengAgua('1 L')]))
    expect(rengR.estado).toBe('todo-disuelto')
    expect(rengRel(rengValor(rengR, 'disuelto'), 1e-3 / rengMasaMolar)).toBeLessThan(2e-3)
    expect(rengValor(rengR, 'solidoFinal')).toBeCloseTo(0, 12)
  })

  it('en moles: 1 mmol en 100 mL = 0,01 mol/L de sólido, saturada', () => {
    const rengR = rengPred(rengPredecirMesa([rengSalCaCO3('1 mmol'), rengAgua('100 mL')]))
    expect(rengValor(rengR, 'solido0')).toBeCloseTo(0.01, 12)
    expect(rengR.estado).toBe('saturada')
  })

  it('coincide con la escena Solubilidad con cM = cA = 0 y el mismo sólido', () => {
    const rengAzar = rengCrearAzar(46)
    for (let rengI = 0; rengI < 120; rengI++) {
      const rengMol = 1e-6 + rengAzar() * 5e-3
      const rengVa = 5 + rengAzar() * 3000
      const rengSolido = rengMol / (rengVa / 1000)
      if (rengSolido > 1) continue
      const rengR = rengPred(rengPredecirMesa([rengSalCaCO3(`${rengMol} mol`), rengAgua(`${rengVa} mL`)]))
      const rengEscena = rengCalcularEscena('solubilidad', { sal: 'caco3', cM: 0, cA: 0, sol0: rengSolido })
      expect(rengRel(rengValor(rengR, 's0'), rengEscena['s0']!)).toBeLessThan(1e-12)
      expect(rengRel(rengValor(rengR, 'disuelto') + 1e-30, rengEscena['d']! + 1e-30)).toBeLessThan(1e-12)
      expect(rengValor(rengR, 'disuelto') + rengValor(rengR, 'solidoFinal')).toBeCloseTo(rengSolido, 12)
    }
  })

  it('el respaldo cita la fuente del Ksp con su enlace y fecha (consultada), la masa molar como «sin verificar» y avisa de la hidrólisis y de las tablas que discrepan', () => {
    const rengR = rengPred(rengPredecirMesa([rengSalCaCO3('0,10 g'), rengAgua('1000 mL')]))
    expect(rengR.respaldo.escena).toBe('solubilidad')
    expect(rengR.respaldo.evidencia).toBe(RENG_MODELOS_ESCENA.solubilidad.evidencia)
    const rengKsp = rengR.respaldo.datos.find((rengD) => /^Ksp/.test(rengD.nombre))!
    expect(rengKsp).toMatchObject({ verificacion: 'consultada', sinVerificar: false })
    expect(rengKsp.fuente).toMatch(/https:\/\/chem\.libretexts\.org/)
    expect(rengKsp.fuente).toMatch(/consultada 2026-11-15/)
    expect(rengKsp.fuente).toMatch(/CC BY-NC-SA 4\.0/)
    expect(rengR.respaldo.datos.find((rengD) => /Masa molar/.test(rengD.nombre))).toMatchObject({ verificacion: 'libro', sinVerificar: true })
    expect(rengCodigos(rengR)).toEqual(expect.arrayContaining(['mesa-hidrolisis', 'mesa-ksp-discrepa']))
    expect(rengR.diagnosticos.find((rengD) => rengD.codigo === 'mesa-ksp-discrepa')!.texto).toMatch(/factor 2,6/)
    expect(rengR.respaldo.limites.length).toBeGreaterThan(0)
  })
})

describe('D4.5 · sabotajes: lo que NO se predice', () => {
  const rengSinCifras = (rengR: RengResultadoMesa): void => {
    expect(rengR.tipo).toBe('sin-modelo')
    expect(Object.keys(rengR).sort()).toEqual(['mensaje', 'porQue', 'tipo'])
    expect(JSON.stringify(rengR)).not.toMatch(/\d/)
  }

  it('el texto literal es el pedido', () => {
    expect(RENG_MENSAJE_SIN_MODELO).toBe('No hay datos o modelo para predecir esta mezcla')
  })

  it('una mezcla sin modelo responde con el texto literal y ninguna cifra: dos solutos, una sal con una disolución, sustancias sin escena, sin agua, con tres sustancias', () => {
    const rengMezclas: RengItemMesa[][] = [
      [rengSol('cloruro-de-sodio', '25 mL'), rengSol('glucosa', '25 mL')],
      [rengSol('cloruro-de-sodio', '25 mL'), rengSalCaCO3('0,1 g')],
      [rengSol('cloruro-de-sodio', '25 mL'), { sustanciaId: 'hidrogenocarbonato-de-sodio', cantidad: '1 g' }],
      [{ sustanciaId: 'oxido-de-magnesio', cantidad: '1 g' }, rengAgua('100 mL')],
      [{ sustanciaId: 'glicerina', cantidad: '10 mL' }, { sustanciaId: 'sulfato-de-magnesio-heptahidratado', cantidad: '1 g' }],
      [rengSol('cloruro-de-sodio', '25 mL'), rengAgua('75 mL'), rengSalCaCO3('0,1 g')],
      [rengSol('glucosa', '25 mL'), rengAgua('75 mL'), { sustanciaId: 'glicerina', cantidad: '1 mL' }]
    ]
    for (const rengM of rengMezclas) {
      const rengR = rengPredecirMesa(rengM)
      rengSinCifras(rengR)
      expect(rengR.tipo === 'sin-modelo' && rengR.mensaje).toBe(RENG_MENSAJE_SIN_MODELO)
    }
    expect((rengPredecirMesa([{ sustanciaId: 'oxido-de-magnesio', cantidad: '1 g' }, rengAgua('100 mL')]) as { porQue: string }).porQue).toMatch(/óxido de magnesio/)
  })

  it('una sustancia peligrosa se rechaza (con su motivo) aunque exista un modelo para ella: nunca se mezcla ni se predice', () => {
    const rengRolesTramposos = { ...RENG_ROLES_MESA, cobre: { rol: 'solucion', solucionId: 'nacl' } as const, 'cloruro-de-calcio': { rol: 'sal', salId: 'caco3' } as const }
    for (const [rengId, rengMotivo] of [['cobre', 'Peligro'], ['cloruro-de-calcio', 'Peligro'], ['carbonato-de-sodio', 'Atención'], ['butano', 'documentados'], ['hidroxido-de-magnesio', 'ninguna ficha contrastada'], ['hierro', 'ninguna ficha contrastada']] as const) {
      const rengR = rengPredecirMesa([{ sustanciaId: rengId, cantidad: '10 mL', concentracion: '0,2 mol/L' }, rengAgua('90 mL')], RENG_SUSTANCIAS, rengRolesTramposos)
      expect(rengR.tipo, rengId).toBe('rechazada')
      expect(rengCodigos(rengR), rengId).toEqual(['mesa-peligrosa'])
      expect('diagnosticos' in rengR && rengR.diagnosticos[0]!.texto, rengId).toMatch(new RegExp(rengMotivo))
      expect(rengR).not.toHaveProperty('resultados')
      expect(rengR).not.toHaveProperty('respaldo')
    }
  })

  it('una peligrosa junto a una mezcla que sí tendría modelo anula toda la predicción', () => {
    const rengR = rengPredecirMesa([rengSol('cloruro-de-sodio', '25 mL'), rengAgua('75 mL'), { sustanciaId: 'cobre', cantidad: '1 g' }])
    expect(rengR.tipo).toBe('rechazada')
    expect(rengR).not.toHaveProperty('resultados')
  })

  it('rengPonerEnMesa no deja poner una peligrosa, una desconocida, una repetida ni pasar de cuatro', () => {
    expect(rengPonerEnMesa([], 'cobre')).toMatchObject({ ok: false, diagnostico: { codigo: 'mesa-peligrosa' } })
    expect(rengPonerEnMesa([], 'no-existe')).toMatchObject({ ok: false, diagnostico: { codigo: 'mesa-desconocida' } })
    const rengUno = rengPonerEnMesa([], 'agua')
    expect(rengUno.ok).toBe(true)
    if (!rengUno.ok) return
    expect(rengPonerEnMesa(rengUno.items, 'agua')).toMatchObject({ ok: false, diagnostico: { codigo: 'mesa-repetida' } })
    let rengItems = rengUno.items
    for (const rengId of ['glucosa', 'cloruro-de-sodio', 'glicerina']) {
      const rengR = rengPonerEnMesa(rengItems, rengId)
      expect(rengR.ok).toBe(true)
      if (rengR.ok) rengItems = rengR.items
    }
    expect(rengItems).toHaveLength(RENG_MAX_SUSTANCIAS_MESA)
    expect(rengPonerEnMesa(rengItems, 'carbonato-de-calcio')).toMatchObject({ ok: false, diagnostico: { codigo: 'mesa-demasiadas' } })
  })

  it('una disolución nueva en la mesa trae su concentración de ejemplo; el agua y la sal no', () => {
    const rengR = rengPonerEnMesa([], 'cloruro-de-sodio')
    expect(rengR.ok && rengR.items[0]!.concentracion).toBe('0,2 mol/L')
    const rengS = rengPonerEnMesa([], 'carbonato-de-calcio')
    expect(rengS.ok && rengS.items[0]!.concentracion).toBeUndefined()
  })

  it('una sustancia repetida se rechaza sin predecir, también con dos entradas distintas del mismo soluto', () => {
    const rengR = rengPredecirMesa([rengSol('cloruro-de-sodio', '25 mL', '0,2 mol/L'), rengSol('cloruro-de-sodio', '25 mL', '0,5 mol/L'), rengAgua('50 mL')])
    expect(rengR.tipo).toBe('rechazada')
    expect(rengCodigos(rengR)).toEqual(['mesa-repetida'])
    expect(rengPredecirMesa([rengAgua('50 mL'), rengAgua('50 mL')]).tipo).toBe('rechazada')
  })

  it('más de cuatro sustancias o una desconocida se rechazan', () => {
    const rengMuchas = ['agua', 'glucosa', 'cloruro-de-sodio', 'glicerina', 'carbonato-de-calcio'].map((rengId) => ({ sustanciaId: rengId, cantidad: '1 mL' }))
    expect(rengCodigos(rengPredecirMesa(rengMuchas))).toContain('mesa-demasiadas')
    expect(rengCodigos(rengPredecirMesa([{ sustanciaId: 'unobtanio', cantidad: '1 mL' }, rengAgua('1 mL')]))).toEqual(['mesa-desconocida'])
  })

  it('la mesa vacía o con una sola sustancia no es una mezcla: pide más, sin cifras', () => {
    expect(rengPredecirMesa([]).tipo).toBe('incompleta')
    const rengUna = rengPredecirMesa([rengAgua('10 mL')])
    expect(rengUna.tipo).toBe('incompleta')
    expect(rengCodigos(rengUna)).toEqual(['mesa-una-sola'])
  })

  it('unidades incompatibles: gramos como volumen, mililitros como concentración, mL como masa, sin unidad o ilegible; no se calcula nada', () => {
    const rengCasos: Array<[RengItemMesa[], string]> = [
      [[rengSol('cloruro-de-sodio', '20 g'), rengAgua('75 mL')], 'mesa-unidad-incompatible'],
      [[rengSol('cloruro-de-sodio', '25 mL', '25 mL'), rengAgua('75 mL')], 'mesa-unidad-incompatible'],
      [[rengSol('cloruro-de-sodio', '25 mL'), rengAgua('3 g')], 'mesa-unidad-incompatible'],
      [[rengSalCaCO3('5 mL'), rengAgua('1000 mL')], 'mesa-unidad-incompatible'],
      [[rengSalCaCO3('0,1 g'), rengAgua('2 mol')], 'mesa-unidad-incompatible'],
      [[rengSol('cloruro-de-sodio', '25'), rengAgua('75 mL')], 'mesa-sin-unidad'],
      [[rengSalCaCO3('0,1'), rengAgua('1000 mL')], 'mesa-sin-unidad'],
      [[rengSol('cloruro-de-sodio', ''), rengAgua('75 mL')], 'mesa-sin-valor'],
      [[rengSol('cloruro-de-sodio', 'mucho mL'), rengAgua('75 mL')], 'mesa-ilegible']
    ]
    for (const [rengItems, rengCodigo] of rengCasos) {
      const rengR = rengPredecirMesa(rengItems)
      expect(rengR.tipo, JSON.stringify(rengItems)).toBe('entrada-invalida')
      expect(rengCodigos(rengR), JSON.stringify(rengItems)).toContain(rengCodigo)
      expect(rengR).not.toHaveProperty('resultados')
    }
    const rengTexto = rengPredecirMesa([rengSol('cloruro-de-sodio', '20 g'), rengAgua('75 mL')])
    expect('diagnosticos' in rengTexto && rengTexto.diagnosticos[0]!.texto).toMatch(/«20 g» no es un volumen/)
  })

  it('valores fuera del dominio de la escena: volumen de disolución, concentración, agua, sólido; todos se explican con el rango', () => {
    const rengCasos: Array<[RengItemMesa[], RegExp]> = [
      [[rengSol('cloruro-de-sodio', '2000 mL'), rengAgua('75 mL')], /volumen de la disolución debe estar entre 0,01 y 1000 mL/],
      [[rengSol('cloruro-de-sodio', '25 mL', '50 mol/L'), rengAgua('75 mL')], /concentración de la disolución debe estar entre/],
      [[rengSol('cloruro-de-sodio', '25 mL'), rengAgua('0,5 mL')], /volumen de agua debe estar entre 1 y 5000 mL/],
      [[rengSol('cloruro-de-sodio', '-5 mL'), rengAgua('75 mL')], /volumen de la disolución debe estar entre/],
      [[rengSalCaCO3('200 g'), rengAgua('1000 mL')], /máximo 1 mol\/L/],
      [[rengSalCaCO3('0 g'), rengAgua('1000 mL')], /mayor que 0/],
      [[rengSalCaCO3('1 g'), rengAgua('0,1 mL')], /volumen de agua debe estar entre/]
    ]
    for (const [rengItems, rengRe] of rengCasos) {
      const rengR = rengPredecirMesa(rengItems)
      expect(rengR.tipo, JSON.stringify(rengItems)).toBe('entrada-invalida')
      expect(rengCodigos(rengR)[0]).toBe('mesa-fuera-de-dominio')
      expect('diagnosticos' in rengR && rengR.diagnosticos.map((rengD) => rengD.texto).join(' '), JSON.stringify(rengItems)).toMatch(rengRe)
    }
  })
})

describe('D4.5 · lectura de cantidades con unidad', () => {
  it('lee volúmenes, concentraciones, masas y moles con coma o punto y las lleva a la unidad base', () => {
    expect(rengLeerCantidadMesa('25 mL', 'volumen')).toMatchObject({ ok: true, valor: 25, unidad: 'mL' })
    expect(rengLeerCantidadMesa('0,025 L', 'volumen')).toMatchObject({ ok: true, valor: 25 })
    expect(rengLeerCantidadMesa('200 mmol/L', 'concentracion')).toMatchObject({ ok: true, valor: 0.2, unidad: 'mol/L' })
    expect(rengLeerCantidadMesa('500 mg', 'masa-o-moles')).toMatchObject({ ok: true, valor: 0.5, unidad: 'g' })
    expect(rengLeerCantidadMesa('2 kg', 'masa-o-moles')).toMatchObject({ ok: true, valor: 2000, unidad: 'g' })
    expect(rengLeerCantidadMesa('3 mmol', 'masa-o-moles')).toMatchObject({ ok: true, valor: 0.003, unidad: 'mol' })
  })

  it('no confunde magnitudes: un volumen no es una masa ni una concentración', () => {
    for (const [rengT, rengM] of [['25 mL', 'masa-o-moles'], ['25 mL', 'concentracion'], ['0,2 mol/L', 'volumen'], ['0,2 mol/L', 'masa-o-moles'], ['5 g', 'volumen'], ['5 g', 'concentracion']] as const) expect(rengLeerCantidadMesa(rengT, rengM), `${rengT} como ${rengM}`).toMatchObject({ ok: false, diagnostico: { codigo: 'mesa-unidad-incompatible' } })
  })
})
