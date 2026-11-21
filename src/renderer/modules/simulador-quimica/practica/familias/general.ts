import { rengAjustarEcuacion } from '../../nucleo/ajuste'
import { RENG_NA, rengDilucion, rengMolaridadDesdePorcentaje, rengReactivoLimitante } from '../../nucleo/estequiometria'
import { rengAnalizarFormula, rengBonita, rengComposicionCentesimal, rengMasaMolarDe } from '../../nucleo/formula'
import { rengElegir, rengEntre, rengTextoDecimales, rengTextoNumero } from '../numeros'
import type { RengDatoEjercicio, RengFamilia, RengMetodo, RengRespuestaEsperada, RengBaseEjercicio } from '../tipos'
import { rengDatoD, rengDatoT, rengMapaDatos, rengMezclar, rengNumero, RENG_FUENTE_DIDACTICA, RENG_FUENTE_MASAS, rengTexto } from './util'
import { RENG_BANCO_AJUSTE_BASICO, RENG_BANCO_AJUSTE_UNIVERSITARIO, RENG_COMPUESTOS, RENG_REACCIONES_ESTEQ, type RengEcuacionBanco } from '../bancos'

const rengMetodo = (rengPregunta: string, rengCorrecta: string, rengOtras: string[], rengExplicacion: string, rengAzar: () => number): RengMetodo => {
  const rengTodas = rengMezclar(rengAzar, [rengCorrecta, ...rengOtras])
  const rengOpc = rengTodas.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
  return { pregunta: rengPregunta, opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrecta)!.id, explicacion: rengExplicacion }
}

export const RENG_FAMILIA_MOL: RengFamilia = {
  id: 'general.mol-masa',
  rama: 'general',
  tema: 'mol',
  nombre: 'Mol y masa molar',
  descripcion: 'Moles, partículas y composición a partir de la masa de una muestra.',
  niveles: ['preuniversitario', 'universitario', 'quimico', 'cientifico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    const rengC = rengElegir(azar, RENG_COMPUESTOS)
    const rengM = rengMasaMolarDe(rengC.f)
    const rengFormula = rengBonita(rengC.f)
    const rengFuente = RENG_FUENTE_MASAS
    if (nivel === 'preuniversitario') {
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('m', 'Masa de la muestra', rengEntre(azar, 5, 100, 0.5), 'g', 1), rengDatoD('M', `Masa molar de ${rengFormula}`, Number(rengM.toFixed(2)), 'g/mol', 2)]
      const rengD = rengMapaDatos(rengDatos)
      const rengN = rengD['m']! / rengD['M']!
      return {
        titulo: `Moles en una muestra de ${rengC.n}`,
        enunciado: `Una muestra de ${rengC.n} (${rengFormula}) tiene una masa de ${rengTexto(rengDatos, 'm')}. La masa molar del ${rengFormula} es ${rengTexto(rengDatos, 'M')}.`,
        pregunta: '¿Cuántos moles de sustancia hay en la muestra?',
        datos: rengDatos,
        respuesta: rengNumero(rengN, 'mol', { decimales: 3, errores: [{ valor: rengD['m']! * rengD['M']!, mensaje: 'Multiplicaste la masa por la masa molar. La cantidad de sustancia es n = m / M: los gramos se dividen entre los gramos por mol.' }, { valor: rengD['M']! / rengD['m']!, mensaje: 'Invertiste el cociente: n = m / M, no M / m.' }] }),
        pistas: ['Los moles relacionan la masa con la masa molar: n = m / M.', `Divide ${rengTexto(rengDatos, 'm')} entre ${rengTexto(rengDatos, 'M')}; los gramos se cancelan y quedan moles.`],
        pasos: [`n = m / M = ${rengTexto(rengDatos, 'm')} / ${rengTexto(rengDatos, 'M')}`, `n = ${rengTextoNumero(rengN, 4)} mol`],
        errorFrecuente: 'Multiplicar en vez de dividir.',
        fuente: rengFuente
      }
    }
    if (nivel === 'universitario') {
      const rengMiligramos = azar() < 0.5
      const rengMasa = rengMiligramos ? rengEntre(azar, 100, 900, 5) : rengEntre(azar, 0.5, 4.5, 0.05)
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('m', 'Masa de la muestra', rengMasa, rengMiligramos ? 'mg' : 'kg', rengMiligramos ? 0 : 2)]
      const rengD = rengMapaDatos(rengDatos)
      const rengGramos = rengMiligramos ? rengD['m']! / 1000 : rengD['m']! * 1000
      const rengN = rengGramos / rengM
      const rengParticulas = rengN * RENG_NA
      const rengPartic = azar() < 0.5
      const rengOtros = ['n = m · M', 'n = M / m', rengPartic ? 'N = n / N_A' : 'N = n · N_A']
      return {
        titulo: rengPartic ? `Unidades fórmula en ${rengC.n}` : `Moles en una muestra de ${rengC.n}`,
        enunciado: `Se pesa una muestra de ${rengC.n} (${rengFormula}) y la balanza marca ${rengTexto(rengDatos, 'm')}. Usa las masas atómicas de la tabla periódica.`,
        pregunta: rengPartic ? '¿Cuántas unidades fórmula contiene la muestra? (N_A = 6,022·10²³ mol⁻¹)' : '¿Cuántos moles contiene la muestra?',
        datos: rengDatos,
        respuesta: rengPartic ? rengNumero(rengParticulas, '', { tolRel: 0.015 }) : rengNumero(rengN, 'mol', { decimales: null, errores: [{ valor: rengD['m']! * rengM, mensaje: 'Multiplicaste por la masa molar en vez de dividir.' }] }),
        metodo: rengMetodo('¿Qué relación usas?', rengPartic ? 'N = n · N_A, con n = m / M' : 'n = m / M', rengPartic ? ['N = n / N_A', 'N = m · N_A', 'N = M · N_A / m'] : rengOtros.slice(0, 2).concat('n = m / M²'), rengPartic ? 'Primero los moles, n = m / M; después las partículas, N = n · N_A.' : 'La cantidad de sustancia es la masa dividida entre la masa molar.', azar),
        pistas: ['Convierte la masa a gramos antes de usar la masa molar en g/mol.', `Calcula la masa molar de ${rengFormula} sumando las masas atómicas multiplicadas por sus subíndices.`, rengPartic ? 'Cada mol contiene N_A unidades fórmula.' : 'Divide los gramos entre la masa molar.'],
        pasos: [`m = ${rengTextoNumero(rengGramos, 4)} g (conversión de ${rengTexto(rengDatos, 'm')})`, `M(${rengFormula}) = ${rengTextoNumero(rengM, 4)} g/mol`, `n = m / M = ${rengTextoNumero(rengN, 4)} mol`, ...(rengPartic ? [`N = n · N_A = ${rengTextoNumero(rengParticulas, 4)}`] : [])],
        errorFrecuente: 'No convertir mg o kg a g antes de dividir.',
        fuente: rengFuente
      }
    }
    if (nivel === 'quimico') {
      const rengFo = rengAnalizarFormula(rengC.f)
      if (rengFo.atomos.size < 2) return null
      const rengElementos = rengComposicionCentesimal(rengC.f)
      const rengEl = rengElegir(azar, rengElementos)
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('m', 'Masa de la muestra', rengEntre(azar, 10, 80, 0.5), 'g', 1)]
      const rengD = rengMapaDatos(rengDatos)
      const rengMasaEl = (rengD['m']! * rengEl.porcentaje) / 100
      return {
        titulo: `Masa de ${rengEl.simbolo} en ${rengC.n}`,
        enunciado: `Una muestra pura de ${rengC.n} (${rengFormula}) pesa ${rengTexto(rengDatos, 'm')}.`,
        pregunta: `¿Qué masa del elemento ${rengEl.simbolo} contiene la muestra?`,
        datos: rengDatos,
        respuesta: rengNumero(rengMasaEl, 'g', { tolRel: 0.012 }),
        metodo: rengMetodo('¿Qué modelo aplicas?', 'Fracción másica del elemento en la fórmula, por la masa de la muestra', ['Fracción molar del elemento por la masa de la muestra', 'Masa atómica del elemento dividida entre la masa de la muestra sin multiplicar por el subíndice', 'Masa de la muestra dividida entre el subíndice'], 'La composición centesimal sale de la fórmula: w = (subíndice · Ar) / M.', azar),
        hipotesis: ['La muestra es la sustancia pura, sin humedad ni impurezas.', 'Se usan las masas atómicas de la tabla periódica.'],
        pistas: [`Calcula la masa molar de ${rengFormula}.`, `En un mol de ${rengFormula} hay ${rengFo.atomos.get(rengEl.simbolo)} mol de átomos de ${rengEl.simbolo}.`, 'La fracción másica es (subíndice · Ar) / M; multiplícala por la masa de la muestra.'],
        pasos: [`M(${rengFormula}) = ${rengTextoNumero(rengM, 4)} g/mol`, `w(${rengEl.simbolo}) = ${rengEl.cantidad} · Ar / M = ${rengTextoNumero(rengEl.porcentaje, 4)} %`, `m(${rengEl.simbolo}) = ${rengTexto(rengDatos, 'm')} · ${rengTextoNumero(rengEl.porcentaje / 100, 4)} = ${rengTextoNumero(rengMasaEl, 4)} g`],
        comprobacion: `La masa de ${rengEl.simbolo} debe ser menor que la masa de la muestra y la suma de todos los elementos debe dar la masa de la muestra.`,
        errorFrecuente: 'Olvidar el subíndice del elemento en la fórmula.',
        fuente: rengFuente
      }
    }
    const rengDatos: RengDatoEjercicio[] = [
      rengDatoD('m', 'Masa leída en la balanza', rengEntre(azar, 2, 20, 0.001), 'g', 3),
      rengDatoD('um', 'Resolución de la balanza (incertidumbre estándar de m)', 0.001, 'g', 3),
      rengDatoD('M', `Masa molar de ${rengFormula}`, Number(rengM.toFixed(2)), 'g/mol', 2),
      rengDatoD('uM', 'Incertidumbre estándar de M', 0.02, 'g/mol', 2)
    ]
    const rengD = rengMapaDatos(rengDatos)
    const rengN = rengD['m']! / rengD['M']!
    const rengU = rengN * Math.hypot(rengD['um']! / rengD['m']!, rengD['uM']! / rengD['M']!)
    return {
      titulo: 'Incertidumbre de una cantidad de sustancia',
      enunciado: `La masa de una muestra de ${rengC.n} (${rengFormula}) es ${rengTexto(rengDatos, 'm')}, con una incertidumbre estándar de ${rengTexto(rengDatos, 'um')}. La masa molar es ${rengTexto(rengDatos, 'M')}, con una incertidumbre estándar de ${rengTexto(rengDatos, 'uM')}.`,
      pregunta: 'Calcula la incertidumbre estándar combinada de n = m / M, en mol (m y M independientes).',
      datos: rengDatos,
      respuesta: rengNumero(rengU, 'mol', { tolRel: 0.03 }),
      hipotesis: ['m y M son independientes (sin correlación).', 'Las incertidumbres relativas son pequeñas: vale la propagación de primer orden.'],
      pistas: ['Para un cociente, las incertidumbres relativas se combinan en cuadratura.', 'u(n)/n = √[(u(m)/m)² + (u(M)/M)²]; después multiplica por n.'],
      pasos: [`n = m / M = ${rengTextoNumero(rengN, 5)} mol`, `u(n)/n = √[(${rengTextoNumero(rengD['um']! / rengD['m']!, 3)})² + (${rengTextoNumero(rengD['uM']! / rengD['M']!, 3)})²] = ${rengTextoNumero(rengU / rengN, 3)}`, `u(n) = ${rengTextoNumero(rengU, 3)} mol`],
      comprobacion: 'La incertidumbre relativa de n no puede ser menor que la mayor de las dos relativas de entrada.',
      errorFrecuente: 'Sumar las incertidumbres relativas en vez de combinarlas en cuadratura.',
      fuente: { texto: 'Propagación de incertidumbres de primer orden (JCGM 100:2008, GUM, ley de propagación). Datos del enunciado: didácticos.', verificacion: 'referencia', enlace: 'https://www.bipm.org/documents/20126/2071204/JCGM_100_2008_E.pdf' }
    }
  }
}

export const RENG_FAMILIA_DILUCION: RengFamilia = {
  id: 'general.concentracion',
  rama: 'general',
  tema: 'concentracion',
  nombre: 'Concentración y dilución',
  descripcion: 'Molaridad, dilución, reactivos comerciales e incertidumbre del material.',
  niveles: ['preuniversitario', 'universitario', 'quimico', 'cientifico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'preuniversitario') {
      const rengDatos: RengDatoEjercicio[] = [
        rengDatoD('C1', 'Concentración inicial', rengElegir(azar, [0.1, 0.2, 0.25, 0.5, 1, 2]), 'mol/L', 3),
        rengDatoD('V1', 'Volumen que se toma', rengElegir(azar, [10, 20, 25, 50]), 'mL', 1),
        rengDatoD('V2', 'Volumen final', rengElegir(azar, [100, 250, 500]), 'mL', 1)
      ]
      const rengD = rengMapaDatos(rengDatos)
      const rengR = rengDilucion({ C1: rengD['C1']!, V1: rengD['V1']!, V2: rengD['V2']! })
      return {
        titulo: 'Dilución de una disolución',
        enunciado: `Se toman ${rengTexto(rengDatos, 'V1')} de una disolución ${rengTexto(rengDatos, 'C1')} y se diluyen con agua hasta ${rengTexto(rengDatos, 'V2')}.`,
        pregunta: '¿Cuál es la concentración de la disolución diluida?',
        datos: rengDatos,
        respuesta: rengNumero(rengR.C2, 'mol/L', { decimales: 4, errores: [{ valor: rengD['C1']! * rengD['V1']!, mensaje: 'Multiplicaste C₁·V₁ y no dividiste entre el volumen final: eso es la cantidad de sustancia (en mmol), no la concentración.' }, { valor: (rengD['C1']! * rengD['V2']!) / rengD['V1']!, mensaje: 'Invertiste los volúmenes: al diluir la concentración baja, así que C₂ < C₁.' }] }),
        pistas: ['Al diluir se conserva la cantidad de soluto: C₁·V₁ = C₂·V₂.', 'Despeja C₂ = C₁·V₁ / V₂ (los dos volúmenes están en mL, no hace falta convertir).'],
        pasos: [`C₂ = C₁·V₁ / V₂ = ${rengTexto(rengDatos, 'C1')} · ${rengTexto(rengDatos, 'V1')} / ${rengTexto(rengDatos, 'V2')}`, `C₂ = ${rengTextoNumero(rengR.C2, 4)} mol/L`],
        errorFrecuente: 'Invertir el cociente de volúmenes.',
        fuente: RENG_FUENTE_DIDACTICA
      }
    }
    if (nivel === 'universitario') {
      const rengC = rengElegir(azar, RENG_COMPUESTOS.filter((rengX) => ['NaCl', 'NaOH', 'C6H12O6', 'KMnO4'].includes(rengX.f)))
      const rengM = rengMasaMolarDe(rengC.f)
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('m', 'Masa de soluto', rengEntre(azar, 0.5, 8, 0.05), 'g', 2), rengDatoD('V', 'Volumen final', rengElegir(azar, [100, 250, 500]), 'mL', 1)]
      const rengD = rengMapaDatos(rengDatos)
      const rengCon = rengD['m']! / rengM / (rengD['V']! / 1000)
      return {
        titulo: 'Molaridad a partir de una pesada',
        enunciado: `Se disuelven ${rengTexto(rengDatos, 'm')} de ${rengC.n} (${rengBonita(rengC.f)}) en agua y se enrasa en un matraz aforado hasta ${rengTexto(rengDatos, 'V')}.`,
        pregunta: '¿Cuál es la concentración molar de la disolución?',
        datos: rengDatos,
        respuesta: rengNumero(rengCon, 'mol/L', { tolRel: 0.012, errores: [{ valor: rengD['m']! / rengM / rengD['V']!, mensaje: 'No convertiste mL a L: la molaridad se expresa en mol/L.' }] }),
        metodo: rengMetodo('¿Qué cadena de cálculo aplicas?', 'Masa → moles con la masa molar y moles → concentración con el volumen en litros', ['Masa → concentración dividiendo entre el volumen en mL', 'Moles = masa · masa molar; concentración = moles · volumen', 'Concentración = masa / masa molar, sin usar el volumen'], 'Primero n = m / M; después C = n / V con V en litros.', azar),
        pistas: [`Calcula la masa molar de ${rengBencerrado(rengC.f)}.`, 'Pasa el volumen de mL a L antes de dividir.', 'C = (m / M) / V.'],
        pasos: [`M = ${rengTextoNumero(rengM, 4)} g/mol`, `n = m / M = ${rengTextoNumero(rengD['m']! / rengM, 4)} mol`, `V = ${rengTextoNumero(rengD['V']! / 1000, 4)} L`, `C = n / V = ${rengTextoNumero(rengCon, 4)} mol/L`],
        errorFrecuente: 'Usar el volumen en mL sin convertirlo a litros.',
        fuente: RENG_FUENTE_MASAS
      }
    }
    if (nivel === 'quimico') {
      const rengR = rengElegir(azar, [
        { n: 'ácido clorhídrico', f: 'HCl', p: 37, rho: 1.19 },
        { n: 'ácido sulfúrico', f: 'H2SO4', p: 98, rho: 1.84 },
        { n: 'ácido nítrico', f: 'HNO3', p: 65, rho: 1.39 }
      ])
      const rengM = rengMasaMolarDe(rengR.f)
      const rengDatos: RengDatoEjercicio[] = [
        rengDatoD('p', 'Riqueza del reactivo comercial', rengR.p, '% en masa', 0),
        rengDatoD('rho', 'Densidad del reactivo', rengR.rho, 'g/mL', 2),
        rengDatoD('C2', 'Concentración que se quiere preparar', rengElegir(azar, [0.1, 0.2, 0.5, 1]), 'mol/L', 2),
        rengDatoD('V2', 'Volumen que se quiere preparar', rengElegir(azar, [250, 500, 1000]), 'mL', 0)
      ]
      const rengD = rengMapaDatos(rengDatos)
      const rengC1 = rengMolaridadDesdePorcentaje(rengD['p']!, rengD['rho']!, rengM)
      const rengV1 = (rengD['C2']! * rengD['V2']!) / rengC1
      return {
        titulo: 'Preparar una disolución desde un reactivo comercial',
        enunciado: `Un frasco de ${rengR.n} (${rengBonita(rengR.f)}) indica ${rengTexto(rengDatos, 'p')} y densidad ${rengTexto(rengDatos, 'rho')}. Se quiere preparar ${rengTexto(rengDatos, 'V2')} de disolución ${rengTexto(rengDatos, 'C2')}.`,
        pregunta: '¿Qué volumen de reactivo comercial hay que medir?',
        datos: rengDatos,
        respuesta: rengNumero(rengV1, 'mL', { tolRel: 0.015, errores: [{ valor: (rengD['C2']! * rengD['V2']!) / ((rengD['p']! / 100) * rengD['rho']! * 1000), mensaje: 'Olvidaste dividir entre la masa molar al convertir la riqueza en molaridad.' }] }),
        metodo: rengMetodo('¿Qué modelo identifica el problema?', 'Primero la molaridad del reactivo (riqueza, densidad y masa molar) y después una dilución C₁V₁ = C₂V₂', ['Solo una dilución C₁V₁ = C₂V₂ con la riqueza como concentración', 'Solo la densidad multiplicada por el volumen final', 'Una neutralización ácido–base'], 'Hay dos pasos: convertir % y densidad en mol/L y después conservar los moles en la dilución.', azar),
        hipotesis: ['La riqueza es exacta y homogénea.', 'El volumen final se enrasa con agua (los volúmenes no se suman).'],
        pistas: ['Calcula la molaridad del reactivo: C₁ = 10·%·ρ / M.', 'Aplica C₁·V₁ = C₂·V₂ y despeja V₁.', 'Comprueba que V₁ es mucho menor que V₂.'],
        pasos: [`M = ${rengTextoNumero(rengM, 4)} g/mol`, `C₁ = 10 · ${rengD['p']} · ${rengD['rho']} / M = ${rengTextoNumero(rengC1, 4)} mol/L`, `V₁ = C₂·V₂ / C₁ = ${rengTextoNumero(rengV1, 4)} mL`],
        comprobacion: 'V₁ debe ser menor que V₂ y C₁ mayor que C₂.',
        errorFrecuente: 'Tratar el porcentaje como concentración molar.',
        fuente: { texto: 'Riqueza y densidad: valores típicos de etiqueta comercial, usados con fines didácticos (no son una medición publicada).', verificacion: 'didactico' }
      }
    }
    const rengDatos: RengDatoEjercicio[] = [
      rengDatoD('C1', 'Concentración de la disolución patrón', rengElegir(azar, [0.1, 0.2, 0.5]), 'mol/L', 3),
      rengDatoD('uC1', 'Incertidumbre estándar de C₁', 0.0005, 'mol/L', 4),
      rengDatoD('V1', 'Volumen de la pipeta aforada', rengElegir(azar, [10, 25]), 'mL', 2),
      rengDatoD('uV1', 'Incertidumbre estándar de V₁', 0.03, 'mL', 2),
      rengDatoD('V2', 'Volumen del matraz aforado', 100, 'mL', 2),
      rengDatoD('uV2', 'Incertidumbre estándar de V₂', 0.06, 'mL', 2)
    ]
    const rengD = rengMapaDatos(rengDatos)
    const rengC2 = (rengD['C1']! * rengD['V1']!) / rengD['V2']!
    const rengU = rengC2 * Math.hypot(rengD['uC1']! / rengD['C1']!, rengD['uV1']! / rengD['V1']!, rengD['uV2']! / rengD['V2']!)
    return {
      titulo: 'Incertidumbre de una dilución',
      enunciado: `Se prepara una dilución con una pipeta de ${rengTexto(rengDatos, 'V1')} (u = ${rengTexto(rengDatos, 'uV1')}) y un matraz de ${rengTexto(rengDatos, 'V2')} (u = ${rengTexto(rengDatos, 'uV2')}). La disolución patrón es ${rengTexto(rengDatos, 'C1')} (u = ${rengTexto(rengDatos, 'uC1')}).`,
      pregunta: 'Calcula la concentración final C₂ y su incertidumbre estándar combinada u(C₂), en mol/L.',
      datos: rengDatos,
      respuesta: rengNumero(rengU, 'mol/L', { tolRel: 0.03 }),
      hipotesis: ['Las tres magnitudes son independientes.', 'Se desprecian la temperatura y la calibración del material.'],
      pistas: ['C₂ = C₁·V₁ / V₂: es un producto y un cociente.', 'Las incertidumbres relativas se combinan en cuadratura: u(C₂)/C₂ = √Σ(u/valor)².', 'Multiplica la incertidumbre relativa por C₂ para obtener u(C₂).'],
      pasos: [`C₂ = ${rengTextoNumero(rengC2, 5)} mol/L`, `u(C₂)/C₂ = √[(${rengTextoNumero(rengD['uC1']! / rengD['C1']!, 3)})² + (${rengTextoNumero(rengD['uV1']! / rengD['V1']!, 3)})² + (${rengTextoNumero(rengD['uV2']! / rengD['V2']!, 3)})²]`, `u(C₂) = ${rengTextoNumero(rengU, 3)} mol/L`],
      comprobacion: 'La incertidumbre relativa de C₂ debe ser mayor que la mayor de las tres incertidumbres relativas de entrada.',
      errorFrecuente: 'Sumar las incertidumbres en vez de combinarlas en cuadratura.',
      fuente: { texto: 'Propagación de incertidumbres (JCGM 100:2008, GUM). Las incertidumbres del enunciado son didácticas; no se atribuyen a una clase de material concreta.', verificacion: 'referencia', enlace: 'https://www.bipm.org/documents/20126/2071204/JCGM_100_2008_E.pdf' }
    }
  }
}

const rengBencerrado = (rengF: string): string => rengBonita(rengF)

const rengTextoLado = (rengL: string[]): string => rengL.map((rengF) => rengBonita(rengF)).join(' + ')

function rengEcuacionAjustada(rengE: RengEcuacionBanco, rengAzar: () => number): { esperada: Extract<RengRespuestaEsperada, { tipo: 'ecuacion' }>; reactivos: string[]; productos: string[]; texto: string } {
  const rengReactivos = rengMezclar(rengAzar, rengE.reactivos)
  const rengProductos = rengMezclar(rengAzar, rengE.productos)
  const rengA = rengAjustarEcuacion({ reactivos: rengReactivos, productos: rengProductos })
  return {
    esperada: { tipo: 'ecuacion', reactivos: rengA.reactivos.map((rengT) => ({ formula: rengT.entrada, coef: rengT.coef })), productos: rengA.productos.map((rengT) => ({ formula: rengT.entrada, coef: rengT.coef })), coeficientesMinimos: true },
    reactivos: rengReactivos,
    productos: rengProductos,
    texto: rengA.texto
  }
}

function rengTablaAtomos(rengReactivos: string[], rengProductos: string[]): string {
  const rengEls: string[] = []
  const rengCuenta = (rengL: string[], rengEl: string): number => rengL.reduce((rengA, rengF) => rengA + (rengAnalizarFormula(rengF).atomos.get(rengEl) ?? 0), 0)
  for (const rengF of [...rengReactivos, ...rengProductos]) for (const rengEl of rengAnalizarFormula(rengF).atomos.keys()) if (!rengEls.includes(rengEl)) rengEls.push(rengEl)
  return rengEls.map((rengEl) => `${rengEl}: ${rengCuenta(rengReactivos, rengEl)} → ${rengCuenta(rengProductos, rengEl)}`).join(' · ')
}

export const RENG_FAMILIA_AJUSTE: RengFamilia = {
  id: 'general.ajuste',
  rama: 'general',
  tema: 'ajuste',
  nombre: 'Ajuste de ecuaciones',
  descripcion: 'Coeficientes enteros mínimos que conservan elementos y carga.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    let rengBase: RengEcuacionBanco
    if (nivel === 'preuniversitario') rengBase = rengElegir(azar, RENG_BANCO_AJUSTE_BASICO)
    else if (nivel === 'universitario') rengBase = rengElegir(azar, RENG_BANCO_AJUSTE_UNIVERSITARIO)
    else {
      const rengC = rengEntre(azar, 2, 9, 1)
      const rengAlqueno = azar() < 0.4
      rengBase = { reactivos: [rengAlqueno ? `C${rengC}H${2 * rengC}` : `C${rengC}H${2 * rengC + 2}`, 'O2'], productos: ['CO2', 'H2O'] }
    }
    const rengE = rengEcuacionAjustada(rengBase, azar)
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('ecuacion', 'Ecuación sin ajustar', `${rengTextoLado(rengE.reactivos)} → ${rengTextoLado(rengE.productos)}`)]
    const rengIonica = [...rengBase.reactivos, ...rengBase.productos].some((rengF) => /[+-]$|\^/.test(rengF) && !/\)$/.test(rengF.slice(-1)))
    return {
      titulo: nivel === 'quimico' ? 'Combustión completa de un hidrocarburo' : 'Ajustar una ecuación',
      enunciado: `Ajusta la ecuación ${rengTexto(rengDatos, 'ecuacion')} con los coeficientes enteros más pequeños${rengIonica ? ' (conserva también la carga)' : ''}.`,
      pregunta: 'Escribe la ecuación ajustada completa, por ejemplo 2 H2 + O2 -> 2 H2O.',
      datos: rengDatos,
      respuesta: rengE.esperada,
      pistas: [`Cuenta los átomos de cada elemento a cada lado: ${rengTablaAtomos(rengE.reactivos, rengE.productos)}.`, 'Empieza por el elemento que aparece en una sola especie de cada lado y deja para el final el que está en más especies (suele ser el O o el H).', `Los coeficientes finales son ${[...rengE.esperada.reactivos, ...rengE.esperada.productos].map((rengT) => rengT.coef).join(', ')} (en el orden del enunciado).`],
      pasos: [`Conteo inicial (izquierda → derecha): ${rengTablaAtomos(rengE.reactivos, rengE.productos)}`, `Ecuación ajustada: ${rengE.texto}`, 'Comprobación: cada elemento y la carga neta coinciden a ambos lados.'],
      comprobacion: 'Suma los átomos de cada elemento (y la carga) en los dos lados; deben ser iguales y los coeficientes no deben tener divisor común.',
      errorFrecuente: 'Ajustar cambiando subíndices en lugar de coeficientes, o dejar coeficientes con divisor común.',
      hipotesis: nivel === 'quimico' ? ['La combustión es completa: solo se forman CO₂ y H₂O.', 'Se piden los coeficientes enteros más pequeños que conservan cada elemento.'] : undefined,
      fuente: RENG_FUENTE_DIDACTICA
    }
  }
}

export const RENG_FAMILIA_ESTEQUIOMETRIA: RengFamilia = {
  id: 'general.estequiometria',
  rama: 'general',
  tema: 'estequiometria',
  nombre: 'Estequiometría, reactivo limitante y rendimiento',
  descripcion: 'Masa de producto, reactivo limitante y rendimiento porcentual.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    const rengR = rengElegir(azar, RENG_REACCIONES_ESTEQ)
    const rengA = rengAjustarEcuacion({ reactivos: rengR.reactivos, productos: rengR.productos })
    const rengProd = rengA.productos.findIndex((rengT) => !['H2O', 'CO2'].includes(rengT.entrada))
    const rengIdxP = rengProd >= 0 ? rengProd : 0
    const rengProducto = rengA.productos[rengIdxP]!
    const rengMasaP = rengMasaMolarDe(rengProducto.formula)
    const rengTexEc = rengA.texto
    const rengFormulaDe = (rengI: number): string => rengBonita(rengA.reactivos[rengI]!.entrada)
    if (nivel === 'preuniversitario') {
      const rengDatos: RengDatoEjercicio[] = [
        rengDatoD('m', `Masa de ${rengFormulaDe(0)}`, rengEntre(azar, 4, 60, 0.5), 'g', 1),
        rengDatoD('M1', `Masa molar de ${rengFormulaDe(0)}`, Number(rengMasaMolarDe(rengA.reactivos[0]!.formula).toFixed(2)), 'g/mol', 2),
        rengDatoD('M2', `Masa molar de ${rengBonita(rengProducto.entrada)}`, Number(rengMasaP.toFixed(2)), 'g/mol', 2)
      ]
      const rengD = rengMapaDatos(rengDatos)
      const rengMasa = ((rengD['m']! / rengD['M1']!) * (rengProducto.coef / rengA.reactivos[0]!.coef)) * rengD['M2']!
      return {
        titulo: 'Masa de producto',
        enunciado: `En la reacción ${rengTexEc}, reaccionan ${rengTexto(rengDatos, 'm')} de ${rengFormulaDe(0)} con un exceso de los demás reactivos. Masas molares: ${rengFormulaDe(0)} = ${rengTexto(rengDatos, 'M1')}; ${rengBonita(rengProducto.entrada)} = ${rengTexto(rengDatos, 'M2')}.`,
        pregunta: `¿Qué masa de ${rengBonita(rengProducto.entrada)} se obtiene (rendimiento 100 %)?`,
        datos: rengDatos,
        respuesta: rengNumero(rengMasa, 'g', { tolRel: 0.012 }),
        pistas: [`Convierte la masa de ${rengFormulaDe(0)} en moles.`, `Usa la razón de coeficientes ${rengProducto.coef}/${rengA.reactivos[0]!.coef} de la ecuación.`, 'Convierte los moles de producto en gramos con su masa molar.'],
        pasos: [`n(${rengFormulaDe(0)}) = ${rengTextoNumero(rengD['m']! / rengD['M1']!, 4)} mol`, `n(producto) = n · ${rengProducto.coef}/${rengA.reactivos[0]!.coef} = ${rengTextoNumero((rengD['m']! / rengD['M1']!) * (rengProducto.coef / rengA.reactivos[0]!.coef), 4)} mol`, `m = n · M = ${rengTextoNumero(rengMasa, 4)} g`],
        errorFrecuente: 'Olvidar la razón de coeficientes entre reactivo y producto.',
        fuente: RENG_FUENTE_MASAS
      }
    }
    const rengMolesA = rengEntre(azar, 0.5, 4, 0.1)
    const rengMolesB = rengEntre(azar, 0.5, 6, 0.1)
    const rengM1 = rengMasaMolarDe(rengA.reactivos[0]!.formula)
    const rengM2 = rengMasaMolarDe(rengA.reactivos[1]!.formula)
    const rengDatos: RengDatoEjercicio[] = [rengDatoD('m1', `Masa de ${rengFormulaDe(0)}`, Number((rengMolesA * rengM1).toFixed(1)), 'g', 1), rengDatoD('m2', `Masa de ${rengFormulaDe(1)}`, Number((rengMolesB * rengM2).toFixed(1)), 'g', 1)]
    const rengD = rengMapaDatos(rengDatos)
    const rengLim = rengReactivoLimitante(rengA, [{ indice: 0, moles: rengD['m1']! / rengM1 }, { indice: 1, moles: rengD['m2']! / rengM2 }])
    const rengTeorica = rengLim.productos[rengIdxP]!.masa
    const rengNombreLim = rengFormulaDe(rengLim.limitante)
    if (nivel === 'universitario') {
      const rengPreguntaLim = azar() < 0.5
      if (rengPreguntaLim) {
        const rengOpc = [rengFormulaDe(0), rengFormulaDe(1)]
        return {
          titulo: 'Reactivo limitante',
          enunciado: `La reacción ${rengTexEc} se hace con ${rengTexto(rengDatos, 'm1')} de ${rengFormulaDe(0)} y ${rengTexto(rengDatos, 'm2')} de ${rengFormulaDe(1)}.`,
          pregunta: '¿Cuál es el reactivo limitante?',
          datos: rengDatos,
          respuesta: { tipo: 'opcion', opciones: rengOpc.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT })), correcta: String.fromCharCode(97 + rengLim.limitante) },
          pistas: ['Convierte ambas masas en moles.', 'Divide los moles de cada reactivo entre su coeficiente: el menor cociente es el limitante.'],
          pasos: rengLim.pasos,
          errorFrecuente: 'Comparar masas o moles sin dividir entre los coeficientes.',
          fuente: RENG_FUENTE_MASAS
        }
      }
      return {
        titulo: 'Masa de producto con reactivo limitante',
        enunciado: `La reacción ${rengTexEc} se hace con ${rengTexto(rengDatos, 'm1')} de ${rengFormulaDe(0)} y ${rengTexto(rengDatos, 'm2')} de ${rengFormulaDe(1)}.`,
        pregunta: `¿Qué masa máxima de ${rengBonita(rengProducto.entrada)} puede formarse?`,
        datos: rengDatos,
        respuesta: rengNumero(rengTeorica, 'g', { tolRel: 0.012 }),
        metodo: rengMetodo('¿Cómo eliges la cantidad que manda?', 'Divido los moles de cada reactivo entre su coeficiente; el menor cociente manda', ['Uso siempre la sustancia de menor masa', 'Uso siempre la primera sustancia de la ecuación', 'Sumo los moles de los dos reactivos'], 'El reactivo limitante es el que se agota primero: el de menor cociente moles/coeficiente.', azar),
        pistas: ['Convierte ambas masas en moles y encuentra el limitante.', 'Con los moles de avance, calcula los moles del producto y su masa.'],
        pasos: rengLim.pasos,
        comprobacion: 'La masa de producto más la masa del reactivo sobrante debe ser coherente con la conservación de la masa.',
        errorFrecuente: 'Calcular con el reactivo en exceso.',
        fuente: RENG_FUENTE_MASAS
      }
    }
    const rengRend = rengEntre(azar, 62, 94, 1)
    const rengReal = Number(((rengTeorica * rengRend) / 100).toFixed(2))
    const rengDatosQ: RengDatoEjercicio[] = [...rengDatos, rengDatoD('real', `Masa obtenida de ${rengBonita(rengProducto.entrada)}`, rengReal, 'g', 2)]
    return {
      titulo: 'Rendimiento porcentual',
      enunciado: `La reacción ${rengTexEc} se hace con ${rengTexto(rengDatosQ, 'm1')} de ${rengFormulaDe(0)} y ${rengTexto(rengDatosQ, 'm2')} de ${rengFormulaDe(1)}. En el laboratorio se obtienen ${rengTexto(rengDatosQ, 'real')} de ${rengBonita(rengProducto.entrada)}.`,
      pregunta: '¿Cuál es el rendimiento porcentual de la reacción?',
      datos: rengDatosQ,
      respuesta: rengNumero((rengReal / rengTeorica) * 100, '%', { tolRel: 0.012 }),
      metodo: rengMetodo('¿Qué masa tomas como rendimiento teórico?', `La que produce el reactivo limitante (${rengNombreLim})`, ['La que produciría el reactivo en exceso', 'La suma de las masas de los reactivos', 'La masa obtenida en el laboratorio'], 'El rendimiento teórico es lo máximo que permite el reactivo limitante.', azar),
      hipotesis: ['Los reactivos son puros.', 'No hay reacciones secundarias salvo las que expliquen el rendimiento menor.'],
      pistas: ['Encuentra el reactivo limitante con los moles divididos entre los coeficientes.', 'Calcula la masa teórica del producto con el limitante.', 'Rendimiento = masa real / masa teórica · 100.'],
      pasos: [...rengLim.pasos, `Rendimiento = ${rengTextoDecimales(rengReal, 2)} / ${rengTextoNumero(rengTeorica, 4)} · 100 = ${rengTextoNumero((rengReal / rengTeorica) * 100, 4)} %`],
      comprobacion: 'El rendimiento porcentual debe estar entre 0 y 100 %.',
      errorFrecuente: 'Usar el reactivo en exceso para calcular el rendimiento teórico.',
      fuente: RENG_FUENTE_MASAS
    }
  }
}

export const RENG_FAMILIAS_GENERAL: readonly RengFamilia[] = [RENG_FAMILIA_MOL, RENG_FAMILIA_DILUCION, RENG_FAMILIA_AJUSTE, RENG_FAMILIA_ESTEQUIOMETRIA]
