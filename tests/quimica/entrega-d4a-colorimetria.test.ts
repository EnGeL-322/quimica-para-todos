import { describe, expect, it } from 'vitest'
import { RENG_ABSORBANCIA_RECOMENDADA, RENG_DATOS_COLOR_EJEMPLO, rengCalibrarColorimetria, rengLeerEntradaColorimetria, type RengEntradaColorimetria } from '../../src/renderer/modules/simulador-quimica/nucleo/colorimetria'

const rengBase = (): RengEntradaColorimetria => ({ blancos: [...RENG_DATOS_COLOR_EJEMPLO.blancos], patrones: RENG_DATOS_COLOR_EJEMPLO.patrones.map((rengP) => ({ ...rengP })), muestra: RENG_DATOS_COLOR_EJEMPLO.muestra, replicas: 1 })

describe('D4.1 · núcleo de la curva de calibración contra cifras hechas a mano', () => {
  it('blanco, recta, residuos y R² (c = 2…10 mg/L; A − blanco = 0,100 · 0,205 · 0,300 · 0,395 · 0,500)', () => {
    const rengR = rengCalibrarColorimetria(rengBase())
    expect(rengR.blancoMedio).toBeCloseTo(0.01, 15)
    expect(rengR.filas.map((rengF) => rengF.aCorr)).toEqual([0.1, 0.205, 0.3, 0.395, 0.5].map((rengX) => expect.closeTo(rengX, 12)))
    expect(rengR.m).toBeCloseTo(0.0495, 12)
    expect(rengR.b).toBeCloseTo(0.003, 12)
    expect(rengR.filas.map((rengF) => rengF.residuo)).toEqual([-0.002, 0.004, 0, -0.004, 0.002].map((rengX) => expect.closeTo(rengX, 12)))
    expect(rengR.sr).toBeCloseTo(Math.sqrt(40e-6 / 3), 12)
    expect(rengR.sr).toBeCloseTo(0.0036515, 6)
    expect(rengR.r2).toBeCloseTo(1 - 40e-6 / 0.09805, 12)
    expect(rengR.n).toBe(5)
    expect([rengR.cMin, rengR.cMax]).toEqual([2, 10])
    expect(rengR.aMin).toBeCloseTo(0.1, 12)
    expect(rengR.aMax).toBeCloseTo(0.5, 12)
  })

  it('interpolación de la muestra: A = 0,260 − 0,010 = 0,250 → c = (0,250 − 0,003)/0,0495 = 4,98990 mg/L; u = 0,08166 mg/L', () => {
    const rengR = rengCalibrarColorimetria(rengBase())
    expect(rengR.estado).toBe('interpolada')
    expect(rengR.muestraCorr).toBeCloseTo(0.25, 12)
    expect(rengR.x0).toBeCloseTo(0.247 / 0.0495, 12)
    expect(rengR.x0).toBeCloseTo(4.98990, 5)
    expect(rengR.u).toBeCloseTo(0.08166, 4)
  })

  it('segundo cálculo independiente con sumas (sin reutilizar la función de regresión) y réplicas de la muestra', () => {
    const rengX = [2, 4, 6, 8, 10]
    const rengY = [0.1, 0.205, 0.3, 0.395, 0.5]
    const rengXm = rengX.reduce((rengS, rengV) => rengS + rengV, 0) / 5
    const rengYm = rengY.reduce((rengS, rengV) => rengS + rengV, 0) / 5
    const rengSxx = rengX.reduce((rengS, rengV) => rengS + rengV * rengV, 0) - 5 * rengXm * rengXm
    const rengSxy = rengX.reduce((rengS, rengV, rengI) => rengS + rengV * rengY[rengI]!, 0) - 5 * rengXm * rengYm
    const rengM = rengSxy / rengSxx
    const rengB = rengYm - rengM * rengXm
    const rengSsr = rengY.reduce((rengS, rengV, rengI) => rengS + (rengV - rengB - rengM * rengX[rengI]!) ** 2, 0)
    const rengSr = Math.sqrt(rengSsr / 3)
    for (const rengRep of [1, 2, 3]) {
      const rengU = (rengSr / rengM) * Math.sqrt(1 / rengRep + 1 / 5 + (0.25 - rengYm) ** 2 / (rengM * rengM * rengSxx))
      const rengR = rengCalibrarColorimetria({ ...rengBase(), replicas: rengRep })
      expect(rengR.m).toBeCloseTo(rengM, 12)
      expect(rengR.b).toBeCloseTo(rengB, 12)
      expect(rengR.u).toBeCloseTo(rengU, 12)
    }
    expect(rengCalibrarColorimetria({ ...rengBase(), replicas: 3 }).u!).toBeLessThan(rengCalibrarColorimetria(rengBase()).u!)
  })

  it('restar o no el blanco da la misma concentración (el blanco solo desplaza la ordenada)', () => {
    const rengR = rengCalibrarColorimetria(rengBase())
    expect(rengR.x0SinBlanco).toBeCloseTo(rengR.x0!, 12)
  })
})

describe('D4.1 · interpolar sí, extrapolar no', () => {
  const rengCon = (rengMuestra: number): ReturnType<typeof rengCalibrarColorimetria> => rengCalibrarColorimetria({ ...rengBase(), muestra: rengMuestra })

  it('por encima del patrón más concentrado: no calcula y lo explica', () => {
    const rengR = rengCon(0.55)
    expect(rengR.estado).toBe('fuera-por-encima')
    expect(rengR.x0).toBeNull()
    expect(rengR.u).toBeNull()
    expect(rengR.x0SinBlanco).toBeNull()
    const rengD = rengR.diagnosticos.find((rengX) => rengX.codigo === 'extrapolacion-curva')!
    expect(rengD.severidad).toBe('fuera')
    expect(rengD.texto).toMatch(/mayor que la del patrón más concentrado/)
    expect(rengD.texto).toMatch(/NO se calcula/)
  })

  it('por debajo del patrón más diluido: no calcula', () => {
    const rengR = rengCon(0.08)
    expect(rengR.estado).toBe('fuera-por-debajo')
    expect(rengR.x0).toBeNull()
    expect(rengR.diagnosticos.find((rengX) => rengX.codigo === 'extrapolacion-curva')!.texto).toMatch(/menor que la del patrón más diluido/)
  })

  it('en el límite del intervalo de absorbancias la recta puede situar la muestra fuera del intervalo de concentraciones: tampoco calcula', () => {
    const rengR = rengCon(0.51)
    expect(rengR.muestraCorr).toBeCloseTo(0.5, 12)
    expect((0.5 - 0.003) / 0.0495).toBeGreaterThan(10)
    expect(rengR.estado).toBe('fuera-de-intervalo-c')
    expect(rengR.x0).toBeNull()
    expect(rengR.diagnosticos.find((rengX) => rengX.codigo === 'extrapolacion-curva')!.texto).toMatch(/intervalo de concentraciones/)
  })

  it('justo dentro de los dos intervalos sí interpola (A = 0,505 → 9,9394 mg/L)', () => {
    const rengR = rengCon(0.505)
    expect(rengR.estado).toBe('interpolada')
    expect(rengR.x0).toBeCloseTo(0.492 / 0.0495, 10)
    expect(rengR.x0!).toBeLessThanOrEqual(rengR.cMax)
  })

  it('barrido: nunca devuelve una concentración fuera del intervalo de los patrones', () => {
    for (let rengI = -20; rengI <= 90; rengI++) {
      const rengR = rengCon(rengI / 100)
      if (rengR.x0 !== null) {
        expect(rengR.x0).toBeGreaterThanOrEqual(rengR.cMin - 1e-9)
        expect(rengR.x0).toBeLessThanOrEqual(rengR.cMax + 1e-9)
        expect(rengR.estado).toBe('interpolada')
      } else expect(rengR.u).toBeNull()
    }
  })
})

describe('D4.1 · diagnósticos', () => {
  it('menos de 3 patrones: no calcula', () => {
    const rengE = { ...rengBase(), patrones: rengBase().patrones.slice(0, 2) }
    expect(() => rengCalibrarColorimetria(rengE)).toThrow(/al menos 3 patrones/)
    expect(() => rengCalibrarColorimetria({ ...rengBase(), patrones: [] })).toThrow(RangeError)
  })

  it('con exactamente 3 patrones calcula y avisa del único grado de libertad', () => {
    const rengR = rengCalibrarColorimetria({ ...rengBase(), patrones: rengBase().patrones.slice(1, 4) })
    expect(rengR.n).toBe(3)
    expect(rengR.diagnosticos.some((rengD) => rengD.codigo === 'tres-patrones' && /1 grado de libertad/.test(rengD.texto))).toBe(true)
  })

  it('todas las concentraciones iguales y pendiente nula: error con explicación', () => {
    expect(() => rengCalibrarColorimetria({ ...rengBase(), patrones: [3, 3, 3].map((rengC, rengI) => ({ c: rengC, a: 0.1 * (rengI + 1) })) })).toThrow(/misma concentración/)
    expect(() => rengCalibrarColorimetria({ ...rengBase(), patrones: [2, 4, 6].map((rengC) => ({ c: rengC, a: 0.2 })) })).toThrow(/pendiente de la recta es nula/)
  })

  it('patrones repetidos: idénticos → aviso (fila copiada); misma concentración con otra absorbancia → réplica (info)', () => {
    const rengIdentico = rengCalibrarColorimetria({ ...rengBase(), patrones: [...rengBase().patrones, { c: 6, a: 0.31 }] })
    const rengD = rengIdentico.diagnosticos.find((rengX) => rengX.codigo === 'repetidos')!
    expect(rengD.severidad).toBe('aviso')
    expect(rengD.texto).toMatch(/6 mg\/L/)
    const rengReplica = rengCalibrarColorimetria({ ...rengBase(), patrones: [...rengBase().patrones, { c: 6, a: 0.315 }] })
    expect(rengReplica.diagnosticos.find((rengX) => rengX.codigo === 'repetidos')!.severidad).toBe('info')
    expect(rengReplica.n).toBe(6)
  })

  it('absorbancia negativa tras restar el blanco, en patrones y en la muestra', () => {
    const rengNegativos = [{ c: 0, a: 0.004 }, { c: 1, a: 0.006 }, ...rengBase().patrones]
    const rengConPatron = rengCalibrarColorimetria({ ...rengBase(), patrones: rengNegativos })
    expect(rengConPatron.diagnosticos.find((rengD) => rengD.codigo === 'negativa-patron')!.texto).toMatch(/patrones 1, 2 quedan/)
    const rengMuestra = rengCalibrarColorimetria({ ...rengBase(), patrones: rengNegativos, muestra: 0.0055 })
    expect(rengMuestra.muestraCorr).toBeCloseTo(-0.0045, 12)
    expect(rengMuestra.estado).toBe('interpolada')
    expect(rengMuestra.diagnosticos.find((rengD) => rengD.codigo === 'negativa-muestra')!.severidad).toBe('aviso')
    const rengFuera = rengCalibrarColorimetria({ ...rengBase(), muestra: 0.005 })
    expect(rengFuera.estado).toBe('fuera-por-debajo')
    expect(rengFuera.diagnosticos.find((rengD) => rengD.codigo === 'negativa-muestra')!.severidad).toBe('fuera')
  })

  it('pendiente negativa: aviso', () => {
    const rengR = rengCalibrarColorimetria({ ...rengBase(), patrones: rengBase().patrones.map((rengP) => ({ c: rengP.c, a: 0.6 - rengP.a })), muestra: 0.4 })
    expect(rengR.m).toBeLessThan(0)
    expect(rengR.diagnosticos.some((rengD) => rengD.codigo === 'pendiente-negativa')).toBe(true)
  })

  it('saturación y rango recomendado: solo con el criterio de la fuente (A > 1; 0,1–0,8), y con su alcance real', () => {
    expect(RENG_ABSORBANCIA_RECOMENDADA).toEqual({ min: 0.1, max: 0.8, noSuperar: 1 })
    expect(rengCalibrarColorimetria(rengBase()).diagnosticos.some((rengD) => rengD.codigo === 'saturacion')).toBe(false)
    const rengAlta = rengCalibrarColorimetria({ ...rengBase(), patrones: [...rengBase().patrones, { c: 20, a: 1.02 }], muestra: 0.7 })
    const rengD = rengAlta.diagnosticos.find((rengX) => rengX.codigo === 'saturacion')!
    expect(rengD.severidad).toBe('aviso')
    expect(rengD.texto).toMatch(/el patrón 6 \(A = 1,02\)/)
    expect(rengD.texto).toMatch(/Wenzel \(LibreTexts/)
    expect(rengD.texto).toMatch(/no un límite medido|no es un límite medido|recomendación de trabajo/)
    expect(rengCalibrarColorimetria({ ...rengBase(), muestra: 0.09 }).diagnosticos.some((rengX) => rengX.codigo === 'rango-recomendado')).toBe(true)
    expect(rengCalibrarColorimetria({ ...rengBase(), muestra: 0.3 }).diagnosticos.some((rengX) => rengX.codigo === 'rango-recomendado')).toBe(false)
  })
})

describe('D4.1 · lectura de las entradas planas', () => {
  const rengPlano = { b0: 0.008, b1: 0.012, c0: 2, a0: 0.11, c1: 4, a1: 0.215, c2: 6, a2: 0.31, c3: 8, a3: 0.405, c4: 10, a4: 0.51, As: 0.26 }

  it('reconstruye el mismo cálculo', () => {
    expect(rengCalibrarColorimetria(rengLeerEntradaColorimetria(rengPlano))).toEqual(rengCalibrarColorimetria(rengBase()))
  })

  it('un patrón incompleto, una muestra ausente o réplicas no enteras son errores explicados', () => {
    const { a4: _a, ...sinA4 } = rengPlano
    expect(() => rengLeerEntradaColorimetria(sinA4)).toThrow(/patrón 5 está incompleto: falta su absorbancia/)
    const { As: _s, ...sinMuestra } = rengPlano
    expect(() => rengLeerEntradaColorimetria(sinMuestra)).toThrow(/Falta la absorbancia de la muestra/)
    expect(() => rengLeerEntradaColorimetria({ ...rengPlano, rep: 1.5 })).toThrow(/entero de 1 a 10/)
    expect(() => rengLeerEntradaColorimetria({ ...rengPlano, rep: 11 })).toThrow(RangeError)
    expect(() => rengLeerEntradaColorimetria({ ...rengPlano, c0: Number.NaN })).toThrow(/número finito/)
    expect(() => rengLeerEntradaColorimetria({ ...rengPlano, c0: 'x' })).toThrow(RangeError)
  })

  it('sin blanco no calcula', () => {
    const { b0: _b0, b1: _b1, ...sinBlanco } = rengPlano
    expect(() => rengCalibrarColorimetria(rengLeerEntradaColorimetria(sinBlanco))).toThrow(/al menos una lectura del blanco/)
  })
})

describe('D4.1 · integración en el marco de escenas', async () => {
  const { rengProyectoNuevo, rengValidarProyecto } = await import('../../src/shared/cuaderno')
  const { rengAnadirCorrida, rengCrearCorrida } = await import('../../src/renderer/lib/cuaderno/proyecto')
  const { rengCompatibilidad } = await import('../../src/renderer/lib/cuaderno/modelos')
  const { rengAptitudComparacion } = await import('../../src/renderer/lib/cuaderno/comparar')
  const { rengCorridaEscena, rengEntradasDeCorrida } = await import('../../src/renderer/modules/simulador-quimica/practica/corridaEscena')
  const { rengCalcularEscena, rengEntradasColorimetriaEjemplo, rengEntradasPorDefecto, rengSimulacionDeEjercicio, rengTransferirEjercicio, rengValidarEntradasSim, RENG_MODELOS_ESCENA } = await import('../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion')
  const { rengConvertirUnidad, rengDiagnosticosDominio, rengEntradasLegibles, rengResumenEscena, rengSensibilidadEscena, rengTipoUnidadDe } = await import('../../src/renderer/modules/simulador-quimica/practica/reglasEscena')
  const { rengEjercicioPorId, rengHuellaEjercicio } = await import('../../src/renderer/modules/simulador-quimica/practica/banco')
  const rengEj = rengEntradasColorimetriaEjemplo()
  const rengSin = (rengE: Record<string, number>, ...rengClaves: string[]): Record<string, number> => Object.fromEntries(Object.entries(rengE).filter(([rengK]) => !rengClaves.includes(rengK)))

  it('el caso por defecto es el ejemplo didáctico y su resultado coincide con el cálculo a mano', () => {
    expect(rengEntradasPorDefecto('colorimetria')).toEqual(rengEj)
    const rengS = rengCalcularEscena('colorimetria', rengEj)
    expect(rengS['x0']).toBeCloseTo(4.9899, 4)
    expect(rengS['u']).toBeCloseTo(0.08166, 4)
    expect(rengS['interp']).toBe(1)
    expect(rengS['x0raw']).toBeCloseTo(rengS['x0']!, 12)
  })

  it('la ficha rotula como didácticos los datos de ejemplo y declara la fuente consultada con su alcance', () => {
    const rengF = RENG_MODELOS_ESCENA.colorimetria
    expect(rengF.parametros.find((rengP) => /ejemplo/.test(rengP.nombre))!.fuente).toMatch(/DIDÁCTICOS inventados/)
    const rengFuente = rengF.parametros.find((rengP) => /absorbancia recomendado/.test(rengP.nombre))!
    expect(rengFuente.verificacion).toBe('consultada')
    expect(rengFuente.fuente).toMatch(/Wenzel/)
    expect(rengFuente.fuente).toMatch(/no el texto íntegro/)
    expect(rengFuente.fuente).toMatch(/recomendación de trabajo/)
    expect(rengF.parametros.find((rengP) => /regresión/.test(rengP.nombre))!.verificacion).toBe('libro')
    expect(rengF.limites.join(' ')).toMatch(/No hay criterio fuente/)
  })

  it('una extrapolación es entrada válida pero no produce concentración ni incertidumbre; la corrida queda fuera de dominio y fuera del comparador', () => {
    const rengFuera = { ...rengEj, As: 0.55 }
    expect(rengValidarEntradasSim('colorimetria', rengFuera).ok).toBe(true)
    const rengS = rengCalcularEscena('colorimetria', rengFuera)
    expect(rengS['x0']).toBeUndefined()
    expect(rengS['u']).toBeUndefined()
    expect(rengS['interp']).toBe(0)
    expect(rengResumenEscena('colorimetria', rengFuera).resultados.some((rengR) => rengR.clave === 'x0')).toBe(false)
    const rengC = rengCorridaEscena('colorimetria', rengFuera)
    expect(rengC.estado).toBe('fuera-de-dominio')
    expect(rengC.resultados.some((rengR) => rengR.clave === 'x0')).toBe(false)
    expect(rengC.serie.filas).toHaveLength(5)
    expect(rengC.diagnosticos.join(' ')).toMatch(/NO se calcula la concentración/)
    expect(rengC.diagnosticos.join(' ')).toMatch(/No entra en el comparador/)
    expect(rengAptitudComparacion(rengCrearCorrida('corrida-0001', rengC, { nombre: 'x' })).apta).toBe(false)
  })

  it('las entradas inválidas (menos de 3 patrones, patrón incompleto, pendiente nula) se rechazan con su explicación y no inventan resultados', () => {
    const rengDos = rengValidarEntradasSim('colorimetria', rengSin(rengEj, 'c2', 'a2', 'c3', 'a3', 'c4', 'a4'))
    expect(rengDos.ok).toBe(false)
    expect(!rengDos.ok && rengDos.diagnostico).toMatch(/al menos 3 patrones/)
    const rengIncompleto = rengValidarEntradasSim('colorimetria', rengSin(rengEj, 'a1'))
    expect(rengIncompleto.ok).toBe(false)
    expect(!rengIncompleto.ok && rengIncompleto.diagnostico).toMatch(/patrón 2 está incompleto/)
    const rengPlana = { ...rengEj, a0: 0.2, a1: 0.2, a2: 0.2, a3: 0.2, a4: 0.2 }
    expect(rengResumenEscena('colorimetria', rengPlana).ok).toBe(false)
    expect(rengCorridaEscena('colorimetria', rengPlana).estado).toBe('entrada-invalida')
    expect(rengCorridaEscena('colorimetria', rengPlana).resultados).toEqual([])
    expect(rengValidarEntradasSim('colorimetria', { ...rengEj, c0: -1 }).ok).toBe(false)
    expect(rengValidarEntradasSim('colorimetria', { ...rengEj, As: 9 }).ok).toBe(false)
    expect(rengValidarEntradasSim('colorimetria', { ...rengEj, rep: 2.5 }).ok).toBe(false)
    expect(rengValidarEntradasSim('colorimetria', rengSin(rengEj, 'As')).ok).toBe(false)
  })

  it('los patrones que el usuario quita no reaparecen con valores por defecto (ni al validar ni al reabrir)', () => {
    const rengCuatro = rengSin(rengEj, 'c4', 'a4')
    const rengV = rengValidarEntradasSim('colorimetria', rengCuatro)
    expect(rengV.ok).toBe(true)
    expect(rengV.ok && rengV.entradas['c4']).toBeUndefined()
    const rengC = rengCorridaEscena('colorimetria', rengCuatro)
    expect(rengC.serie.filas).toHaveLength(4)
    const { entradas, avisos } = rengEntradasDeCorrida('colorimetria', rengC.origen.entradas)
    expect(avisos).toEqual([])
    expect(entradas['c4']).toBeUndefined()
    expect(rengCorridaEscena('colorimetria', entradas)).toEqual(rengC)
  })

  it('la corrida pasa la validación del cuaderno, se reabre idéntica y su versión está registrada', () => {
    const rengC = rengCrearCorrida('corrida-0001', rengCorridaEscena('colorimetria', rengEj), { nombre: 'calibración' }, new Date('2026-11-15T12:00:00Z'))
    const rengP = rengAnadirCorrida(rengProyectoNuevo('proyecto-prueba-1', 'P', new Date('2026-11-15T12:00:00Z')), rengC)
    expect(rengValidarProyecto(JSON.parse(JSON.stringify(rengP)))).toEqual(rengP)
    expect(rengC.modelo.id).toBe('sim-colorimetria')
    expect(rengC.estado).toBe('calculado')
    expect(rengC.fuentes.join(' ')).toMatch(/Wenzel/)
    expect(rengC.fuentes.join(' ')).toMatch(/DIDÁCTICOS/)
    expect(rengCompatibilidad('sim-colorimetria', '1').tipo).toBe('actual')
    const { entradas, avisos } = rengEntradasDeCorrida('colorimetria', rengC.origen.entradas)
    expect(avisos).toEqual([])
    expect(rengCorridaEscena('colorimetria', entradas)).toEqual(rengCorridaEscena('colorimetria', rengEj))
    expect(rengC.serie.columnas.map((rengX) => rengX.clave)).toEqual(['c', 'a_corr', 'a_ajustada', 'residuo'])
    expect(rengAptitudComparacion(rengC).apta).toBe(true)
  })

  it('la saturación pasa por el diagnóstico del marco y deja la corrida en aproximación', () => {
    const rengAlta = { ...rengEj, c5: 20, a5: 1.02, As: 0.7 }
    expect(rengDiagnosticosDominio('colorimetria', rengAlta).some((rengX) => rengX.codigo === 'saturacion' && rengX.severidad === 'aviso')).toBe(true)
    expect(rengCorridaEscena('colorimetria', rengAlta).estado).toBe('aproximacion')
    expect(rengCorridaEscena('colorimetria', rengEj).estado).toBe('calculado')
  })

  it('datos aplicados legibles y unidades de concentración másica', () => {
    expect(rengEntradasLegibles('colorimetria', rengEj)).toEqual(['blancos: 0,008; 0,012', 'patrones (mg/L → A): 2 → 0,11; 4 → 0,215; 6 → 0,31; 8 → 0,405; 10 → 0,51', 'muestra: A = 0,26', 'réplicas de la muestra: 1'])
    expect(rengTipoUnidadDe('mg/L')).toBe('concentracionMasica')
    expect(rengConvertirUnidad(2, 'concentracionMasica', 'g/L', 'mg/L')).toBe(2000)
    expect(rengConvertirUnidad(500, 'concentracionMasica', 'mg/L', 'g/L')).toBe(0.5)
    expect(rengConvertirUnidad(2000, 'concentracionMasica', 'µg/L', 'mg/L')).toBeCloseTo(2, 12)
    expect(() => rengConvertirUnidad(1, 'concentracionMasica', 'mg/L', 'mol/L')).toThrow(RangeError)
  })

  it('sensibilidad: la salida principal es la concentración y el cambio por +1 % de la absorbancia de la muestra es 0,01·A/m y el blanco no influye (se resta de todo)', () => {
    const rengS = rengSensibilidadEscena('colorimetria', rengEj)
    expect(rengS.salida.clave).toBe('x0')
    expect(rengS.valor).toBeCloseTo(4.9899, 3)
    expect(rengS.filas.find((rengF) => rengF.clave === 'As')!.cambioPorCiento).toBeCloseTo((0.26 * 0.01) / 0.0495, 3)
    expect(rengS.filas.some((rengF) => rengF.clave === 'b0')).toBe(false)
    expect(rengS.filas.some((rengF) => rengF.clave === 'a2')).toBe(true)
    expect(rengS.filas.some((rengF) => rengF.clave === 'rep')).toBe(false)
    expect(rengS.incertidumbre).toBeGreaterThan(0)
  })

  it('sensibilidad sobre una extrapolación: se rechaza con explicación en vez de inventar un número', () => {
    expect(() => rengSensibilidadEscena('colorimetria', { ...rengEj, As: 0.55 })).toThrow(/No hay concentración de la muestra que analizar/)
  })

  it('«Simular este ejercicio» de la práctica de calibración: se deriva de la tabla y NO cambia la identidad del ejercicio', () => {
    let rengCasos = 0
    for (const rengNivel of ['quimico', 'cientifico']) {
      for (let rengSemilla = 1; rengSemilla <= 20; rengSemilla++) {
        const rengE = rengEjercicioPorId(`analitica.calibracion~${rengNivel}~${rengSemilla}`)!
        expect(rengE.simulacion).toBeUndefined()
        const rengHuella = rengHuellaEjercicio(rengE)
        const rengSim = rengSimulacionDeEjercicio(rengE)!
        expect(rengHuellaEjercicio(rengE)).toBe(rengHuella)
        expect(rengSim.escena).toBe('colorimetria')
        const rengT = rengTransferirEjercicio(rengSim)
        expect(rengT.ok).toBe(true)
        const rengY0 = Number(rengE.datos.find((rengD) => rengD.clave === 'y0')!.valor)
        const rengCal = rengCalibrarColorimetria({ blancos: [0], patrones: rengE.tabla!.filas.map((rengF) => ({ c: Number(rengF[0]), a: Number(rengF[1]) })), muestra: rengY0, replicas: 1 })
        expect(rengCal.estado).toBe('interpolada')
        if (rengT.ok) {
          const rengS = rengCalcularEscena('colorimetria', rengT.entradas)
          expect(rengS['x0']).toBeCloseTo(rengCal.x0!, 12)
          expect(rengS['x0']).toBeCloseTo((rengY0 - rengCal.b) / rengCal.m, 12)
          if (rengNivel === 'cientifico') expect(rengS['u']).toBeCloseTo(rengCal.u!, 12)
        }
        rengCasos++
      }
    }
    expect(rengCasos).toBe(40)
  })

  it('las demás familias y niveles de analítica no ganan simulación nueva', () => {
    expect(rengSimulacionDeEjercicio(rengEjercicioPorId('analitica.dilucion~universitario~1')!)).toBeUndefined()
  })
})
