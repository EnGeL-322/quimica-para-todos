import { rengConcentracion, rengEnergiaActivacion, rengVidaMedia, type RengOrden } from '../../nucleo/cinetica'
import { rengCociente, rengResolverEquilibrio, type RengEspecieEq } from '../../nucleo/equilibrio'
import { RENG_R, rengDatoTermo, rengEnergiaLibre, rengEntalpiaReaccion, rengEntropiaReaccion } from '../../nucleo/termoquimica'
import { RENG_PRESETS_EQ, RENG_REACCIONES_TERMO, rengDesplazamientoEquilibrio } from '../modelosSimulacion'
import { rengElegir, rengTextoDecimales, rengTextoNumero } from '../numeros'
import type { RengDatoEjercicio, RengFamilia, RengFuenteEjercicio, RengMetodo, RengBaseEjercicio } from '../tipos'
import { rengDatoC, rengDatoD, rengDatoT, rengMapaDatos, rengNumero, rengMezclar, rengOpciones } from './util'
import { rengAjustarOrdenes } from '../solucionadores'

const RENG_UNIDAD_K: Record<RengOrden, string> = { 0: 'mol/(L·s)', 1: '1/s', 2: 'L/(mol·s)' }
const RENG_NOMBRE_ORDEN: Record<RengOrden, string> = { 0: 'orden 0', 1: 'orden 1', 2: 'orden 2' }

const rengMetodoOrden = (rengOrden: RengOrden, rengAzar: () => number): RengMetodo => {
  const rengOpc = rengMezclar(rengAzar, [0, 1, 2] as RengOrden[]).map((rengO, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: `La ley integrada de ${RENG_NOMBRE_ORDEN[rengO]}: ${rengO === 0 ? '[A] = [A]₀ − kt' : rengO === 1 ? '[A] = [A]₀·e^(−kt)' : '1/[A] = 1/[A]₀ + kt'}`, orden: rengO }))
  return { pregunta: 'La unidad de k indica el orden. ¿Qué ley integrada aplicas?', opciones: rengOpc.map(({ id, texto }) => ({ id, texto })), correcta: rengOpc.find((rengX) => rengX.orden === rengOrden)!.id, explicacion: `La unidad de k es ${RENG_UNIDAD_K[rengOrden]}: corresponde a ${RENG_NOMBRE_ORDEN[rengOrden]}.` }
}

const RENG_FUENTE_CINETICA: RengFuenteEjercicio = {
  texto: 'Leyes de velocidad integradas de orden 0, 1 y 2 (libro de texto, p. ej. Atkins); contrastadas en las pruebas con soluciones analíticas. Datos del enunciado: didácticos.',
  verificacion: 'didactico'
}

export const RENG_FAMILIA_CINETICA: RengFamilia = {
  id: 'fisicoquimica.cinetica',
  rama: 'fisicoquimica',
  tema: 'cinetica',
  nombre: 'Cinética y ley de velocidad',
  descripcion: 'Semivida, concentración en el tiempo, orden y constante de velocidad, energía de activación.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'cientifico') return null
    if (nivel === 'preuniversitario') {
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('k', 'Constante de velocidad k', rengElegir(azar, [0.02, 0.05, 0.1, 0.2, 0.5]), '1/s', 2), rengDatoD('A0', 'Concentración inicial [A]₀', rengElegir(azar, [0.5, 1, 2]), 'mol/L', 2)]
      const rengD = rengMapaDatos(rengDatos)
      const rengT12 = rengVidaMedia(1, rengD['A0']!, rengD['k']!)
      const rengPorSemividas = azar() < 0.5
      if (!rengPorSemividas) {
        return {
          titulo: 'Semivida de una reacción de primer orden',
          enunciado: `La reacción A → productos es de primer orden, con k = ${rengDatos[0]!.texto} y [A]₀ = ${rengDatos[1]!.texto}.`,
          pregunta: '¿Cuánto tarda la concentración de A en reducirse a la mitad?',
          datos: rengDatos,
          respuesta: rengNumero(rengT12, 's', { tolRel: 0.012, errores: [{ valor: 1 / rengD['k']!, mensaje: 'Calculaste 1/k (el tiempo característico τ), no la semivida: t½ = ln 2 / k.' }, { valor: rengD['A0']! / (2 * rengD['k']!), mensaje: 'Esa es la semivida de orden cero. En primer orden es t½ = ln 2 / k y no depende de [A]₀.' }] }),
          pistas: ['En primer orden, [A] = [A]₀·e^(−kt).', 'La mitad se alcanza cuando e^(−kt½) = 1/2.', 't½ = ln 2 / k.'],
          pasos: [`t½ = ln 2 / k = 0,6931 / ${rengDatos[0]!.texto}`, `t½ = ${rengTextoNumero(rengT12, 4)} s`],
          comprobacion: 'Tras t½ la concentración debe valer [A]₀/2.',
          errorFrecuente: 'Confundir la semivida con 1/k.',
          fuente: RENG_FUENTE_CINETICA,
          simulacion: { escena: 'cinetica', entradas: { orden: 1, A0: rengD['A0']!, k: rengD['k']! }, comparar: { clave: 't12' } }
        }
      }
      const rengN = rengElegir(azar, [2, 3, 4])
      const rengAt = rengD['A0']! / 2 ** rengN
      const rengTiempo = rengN * rengT12
      return {
        titulo: 'Concentración tras varias semividas',
        enunciado: `La reacción A → productos es de primer orden, con k = ${rengDatos[0]!.texto} y [A]₀ = ${rengDatos[1]!.texto}. Se deja evolucionar durante ${rengN} semividas.`,
        pregunta: '¿Qué concentración de A queda?',
        datos: rengDatos,
        respuesta: rengNumero(rengAt, 'mol/L', { tolRel: 0.012, errores: [{ valor: rengD['A0']! / 2 ** (rengN - 1), mensaje: 'Contaste una semivida menos.' }] }),
        pistas: ['En cada semivida la concentración se reduce a la mitad.', `Tras ${rengN} semividas, [A] = [A]₀ / 2^${rengN}.`],
        pasos: [`[A] = [A]₀ / 2^${rengN} = ${rengDatos[1]!.texto} / ${2 ** rengN} = ${rengTextoNumero(rengAt, 4)} mol/L`, `(t = ${rengN}·t½ = ${rengTextoNumero(rengTiempo, 4)} s)`],
        errorFrecuente: 'Dividir entre n en vez de entre 2^n.',
        fuente: RENG_FUENTE_CINETICA,
        simulacion: { escena: 'cinetica', entradas: { orden: 1, A0: rengD['A0']!, k: rengD['k']!, t: rengTiempo }, comparar: { clave: 'At' } }
      }
    }
    if (nivel === 'universitario') {
      const rengOrden = rengElegir(azar, [0, 1, 2] as RengOrden[])
      const rengA0 = rengElegir(azar, [0.5, 1, 2])
      const rengK = rengOrden === 0 ? rengElegir(azar, [0.002, 0.005, 0.01]) : rengOrden === 1 ? rengElegir(azar, [0.005, 0.01, 0.02]) : rengElegir(azar, [0.002, 0.005, 0.01])
      const rengMinutos = rengElegir(azar, [5, 10, 20, 30])
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('k', 'Constante de velocidad k', rengK, RENG_UNIDAD_K[rengOrden], 3), rengDatoD('A0', 'Concentración inicial [A]₀', rengA0, 'mol/L', 2), rengDatoD('t', 'Tiempo transcurrido', rengMinutos, 'min', 0)]
      const rengTs = rengMinutos * 60
      if (rengOrden === 0 && rengK * rengTs >= rengA0) return null
      const rengAt = rengConcentracion(rengOrden, rengA0, rengK, rengTs)
      return {
        titulo: 'Concentración en el tiempo',
        enunciado: `Una reacción A → productos tiene k = ${rengDatos[0]!.texto} y [A]₀ = ${rengDatos[1]!.texto}. Han pasado ${rengDatos[2]!.texto}.`,
        pregunta: '¿Qué concentración de A queda? (el orden se deduce de la unidad de k)',
        datos: rengDatos,
        respuesta: rengNumero(rengAt, 'mol/L', { tolRel: 0.012, errores: [{ valor: rengConcentracion(rengOrden, rengA0, rengK, rengMinutos), mensaje: 'Usaste el tiempo en minutos con una k expresada en segundos: convierte 1 min = 60 s.' }] }),
        metodo: rengMetodoOrden(rengOrden, azar),
        pistas: ['La unidad de k fija el orden: mol/(L·s) → 0; 1/s → 1; L/(mol·s) → 2.', 'Convierte el tiempo a segundos antes de sustituir.', 'Aplica la ley integrada correspondiente.'],
        pasos: [`Orden ${rengOrden} (unidad de k: ${RENG_UNIDAD_K[rengOrden]})`, `t = ${rengTextoNumero(rengTs, 4)} s`, `[A] = ${rengTextoNumero(rengAt, 4)} mol/L`],
        comprobacion: '[A] debe ser menor que [A]₀ y no negativa.',
        errorFrecuente: 'No convertir los minutos a segundos o aplicar la ley de otro orden.',
        fuente: RENG_FUENTE_CINETICA,
        simulacion: { escena: 'cinetica', entradas: { orden: rengOrden, A0: rengA0, k: rengK, t: rengTs }, comparar: { clave: 'At' } }
      }
    }
    if (azar() < 0.5) {
      const rengOrden = rengElegir(azar, [1, 2] as RengOrden[])
      const rengA1 = rengElegir(azar, [0.1, 0.2])
      const rengFactor = rengElegir(azar, [2, 3])
      const rengKReal = rengElegir(azar, [0.2, 0.5, 1.5])
      const rengV1 = rengKReal * rengA1 ** rengOrden
      const rengV2 = rengKReal * (rengA1 * rengFactor) ** rengOrden
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('A1', 'Experimento 1: [A]₀', rengA1, 'mol/L', 3), rengDatoC('v1', 'Experimento 1: velocidad inicial', rengV1, 'mol/(L·s)', 3), rengDatoD('A2', 'Experimento 2: [A]₀', rengA1 * rengFactor, 'mol/L', 3), rengDatoC('v2', 'Experimento 2: velocidad inicial', rengV2, 'mol/(L·s)', 3)]
      const rengD = rengMapaDatos(rengDatos)
      const rengOrdenCalc = Math.round(Math.log(rengD['v2']! / rengD['v1']!) / Math.log(rengD['A2']! / rengD['A1']!))
      const rengKCalc = rengD['v1']! / rengD['A1']! ** rengOrdenCalc
      return {
        titulo: 'Constante de velocidad por el método de las velocidades iniciales',
        enunciado: `Para A → productos se midieron dos velocidades iniciales: ${rengDatos[1]!.texto} con [A]₀ = ${rengDatos[0]!.texto} y ${rengDatos[3]!.texto} con [A]₀ = ${rengDatos[2]!.texto}. Se supone v = k·[A]ⁿ.`,
        pregunta: `¿Cuál es el valor de k? (con sus unidades, que dependen del orden n)`,
        datos: rengDatos,
        respuesta: rengNumero(rengKCalc, RENG_UNIDAD_K[rengOrdenCalc as RengOrden], { tolRel: 0.015 }),
        metodo: { pregunta: '¿Cómo obtienes el orden n?', opciones: [{ id: 'a', texto: 'n = ln(v₂/v₁) / ln([A]₂/[A]₁)' }, { id: 'b', texto: 'n = (v₂ − v₁) / ([A]₂ − [A]₁)' }, { id: 'c', texto: 'n = [A]₂ / [A]₁' }], correcta: 'a', explicacion: 'Al dividir v₂/v₁ = ([A]₂/[A]₁)ⁿ y tomar logaritmos se obtiene n.' },
        hipotesis: ['La ley de velocidad es de la forma v = k[A]ⁿ con n entero.', 'Las velocidades son iniciales: [A] casi no ha cambiado.'],
        pistas: ['Divide las dos velocidades: v₂/v₁ = ([A]₂/[A]₁)ⁿ.', 'Aísla n con logaritmos y redondea al entero más próximo.', 'Con n conocido, k = v / [A]ⁿ.'],
        pasos: [`n = ln(${rengTextoNumero(rengD['v2']! / rengD['v1']!, 4)}) / ln(${rengFactor}) = ${rengOrdenCalc}`, `k = v₁ / [A]₁^${rengOrdenCalc} = ${rengTextoNumero(rengKCalc, 4)} ${RENG_UNIDAD_K[rengOrdenCalc as RengOrden]}`],
        comprobacion: 'Con ese k y n, la velocidad del experimento 2 debe salir igual a la medida.',
        errorFrecuente: 'Dar k sin unidades o usar la diferencia de velocidades en vez del cociente.',
        fuente: { texto: 'Método de las velocidades iniciales (libro de texto). Datos generados por la app; no son mediciones publicadas.', verificacion: 'didactico' },
        simulacion: { escena: 'cinetica', entradas: { orden: rengOrdenCalc, A0: rengD['A1']!, k: rengKCalc } }
      }
    }
    const rengEa = rengElegir(azar, [40, 55, 70, 85])
    const rengT1 = rengElegir(azar, [298.15, 300, 310])
    const rengT2 = rengT1 + rengElegir(azar, [10, 20, 30])
    const rengK1 = rengElegir(azar, [0.002, 0.01, 0.05])
    const rengK2 = rengK1 * Math.exp(((rengEa * 1000) / RENG_R) * (1 / rengT1 - 1 / rengT2))
    const rengK2Texto = Number(rengK2.toPrecision(3))
    const rengDatos: RengDatoEjercicio[] = [rengDatoD('T1', 'Temperatura 1', rengT1, 'K', 2), rengDatoC('k1', 'k a la temperatura 1', rengK1, '1/s', 3), rengDatoD('T2', 'Temperatura 2', rengT2, 'K', 2), rengDatoC('k2', 'k a la temperatura 2', rengK2Texto, '1/s', 3)]
    const rengD = rengMapaDatos(rengDatos)
    const rengEaCalc = rengEnergiaActivacion(rengD['k1']!, rengD['T1']!, rengD['k2']!, rengD['T2']!)
    return {
      titulo: 'Energía de activación con dos temperaturas',
      enunciado: `Una reacción tiene k = ${rengDatos[1]!.texto} a ${rengDatos[0]!.texto} y k = ${rengDatos[3]!.texto} a ${rengDatos[2]!.texto}. Se supone que cumple la ecuación de Arrhenius. R = 8,314 J/(mol·K).`,
      pregunta: '¿Cuál es la energía de activación en kJ/mol?',
      datos: rengDatos,
      respuesta: rengNumero(rengEaCalc, 'kJ/mol', { tolRel: 0.02, errores: [{ valor: rengEaCalc * 1000, mensaje: 'Diste el resultado en J/mol; la respuesta pedida es en kJ/mol.' }] }),
      metodo: { pregunta: '¿Qué ecuación usas?', opciones: [{ id: 'a', texto: 'ln(k₂/k₁) = (Ea/R)·(1/T₁ − 1/T₂)' }, { id: 'b', texto: 'ln(k₂/k₁) = Ea·(T₂ − T₁)' }, { id: 'c', texto: 'k₂/k₁ = T₂/T₁' }], correcta: 'a', explicacion: 'Restando ln k = ln A − Ea/RT a dos temperaturas se elimina el factor A.' },
      hipotesis: ['Ea y el factor preexponencial no dependen de la temperatura en este intervalo.', 'Las temperaturas están en kelvin.'],
      pistas: ['Toma logaritmos de la ecuación de Arrhenius a cada temperatura y réstalas.', 'Despeja Ea = R·ln(k₂/k₁) / (1/T₁ − 1/T₂).', 'Divide entre 1000 para pasar a kJ/mol.'],
      pasos: [`ln(k₂/k₁) = ${rengTextoNumero(Math.log(rengD['k2']! / rengD['k1']!), 4)}`, `1/T₁ − 1/T₂ = ${rengTextoNumero(1 / rengD['T1']! - 1 / rengD['T2']!, 4)} K⁻¹`, `Ea = ${rengTextoNumero(rengEaCalc, 4)} kJ/mol`],
      comprobacion: 'Si k crece con la temperatura, Ea debe ser positiva; valores típicos de 20 a 150 kJ/mol.',
      errorFrecuente: 'Usar grados Celsius en lugar de kelvin o mezclar J y kJ.',
      fuente: { texto: 'Ecuación de Arrhenius (libro de texto). R = 8,314462618 J/(mol·K) (CODATA 2018, valor exacto de R). Datos del enunciado: didácticos.', verificacion: 'referencia' }
    }
  }
}

const RENG_FUENTE_EQ: RengFuenteEjercicio = {
  texto: 'Condición de equilibrio Q = K (libro de texto); contrastada en las pruebas con soluciones analíticas. Las K del enunciado son valores de ejemplo, no mediciones publicadas.',
  verificacion: 'didactico'
}

const rengConcentraciones = (rengEsp: RengEspecieEq[], rengC: number[]): string => rengEsp.map((rengS, rengI) => `[${rengS.nombre}] = ${rengTextoNumero(rengC[rengI]!, 3)} mol/L`).join('; ')

export const RENG_FAMILIA_EQUILIBRIO: RengFamilia = {
  id: 'fisicoquimica.equilibrio',
  rama: 'fisicoquimica',
  tema: 'equilibrio',
  nombre: 'Equilibrio químico',
  descripcion: 'Cociente de reacción, concentraciones de equilibrio, perturbaciones y sensibilidad a K.',
  niveles: ['preuniversitario', 'universitario', 'quimico', 'cientifico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    const rengReaccion = nivel === 'preuniversitario' ? rengElegir(azar, RENG_PRESETS_EQ) : rengElegir(azar, RENG_PRESETS_EQ.filter((rengP) => rengP.id !== 'haber'))
    const rengSimbolos = rengReaccion.esp.map((rengE) => rengE.nombre)
    const rengEcuacion = rengReaccion.nombre
    const rengEntradasBase = (rengC0: number[]): Record<string, number | string> => ({ reaccion: rengReaccion.id, K: rengReaccion.K, ...Object.fromEntries(rengC0.map((rengC, rengI) => [`c0_${rengI}`, rengC])) })
    if (nivel === 'preuniversitario') {
      const rengC0 = rengReaccion.esp.map(() => rengElegir(azar, [0.05, 0.1, 0.2, 0.5, 1, 2]))
      const rengEsp = rengReaccion.esp.map((rengE, rengI) => ({ ...rengE, c0: rengC0[rengI]! }))
      const rengQ = rengCociente(rengEsp, rengC0)
      const rengRazon = rengQ / rengReaccion.K
      if (rengRazon > 0.8 && rengRazon < 1.25) return null
      const rengDatos: RengDatoEjercicio[] = [rengDatoT('reaccion', 'Reacción', rengEcuacion), rengDatoC('K', 'Constante de equilibrio K', rengReaccion.K, '', 3), ...rengReaccion.esp.map((rengE, rengI) => rengDatoC(`c${rengI}`, `[${rengE.nombre}]`, rengC0[rengI]!, 'mol/L', 3))]
      const rengOpc = rengOpciones(azar, rengQ < rengReaccion.K ? 'Hacia los productos (→)' : 'Hacia los reactivos (←)', ['Hacia los productos (→)', 'Hacia los reactivos (←)', 'Ya está en equilibrio'], 3)
      return {
        titulo: 'Sentido de la evolución: Q frente a K',
        enunciado: `Para ${rengEcuacion} se tiene K = ${rengDatos[1]!.texto}. En un instante las concentraciones son ${rengConcentraciones(rengReaccion.esp, rengC0)}.`,
        pregunta: '¿Hacia dónde evoluciona el sistema?',
        datos: rengDatos,
        respuesta: { tipo: 'opcion', opciones: rengOpc.opciones, correcta: rengOpc.correcta },
        pistas: ['Calcula Q con las mismas potencias que K, usando las concentraciones actuales.', 'Si Q < K sobra reactivo y la reacción avanza hacia los productos; si Q > K, al revés.'],
        pasos: [`Q = ${rengTextoNumero(rengQ, 4)}`, `Q ${rengQ < rengReaccion.K ? '<' : '>'} K = ${rengTextoNumero(rengReaccion.K, 4)} ⇒ evoluciona ${rengQ < rengReaccion.K ? 'hacia los productos' : 'hacia los reactivos'}`],
        errorFrecuente: 'Invertir la desigualdad (Q < K lleva hacia los productos).',
        fuente: RENG_FUENTE_EQ,
        simulacion: { escena: 'equilibrio', entradas: rengEntradasBase(rengC0) }
      }
    }
    if (nivel === 'universitario') {
      const rengVolumen = rengElegir(azar, [1, 2, 5])
      const rengMolesIni = rengReaccion.esp.map((rengE) => (rengE.c0 === 0 ? 0 : Number((rengE.c0 * rengVolumen * rengElegir(azar, [0.5, 1, 2])).toFixed(3))))
      const rengC0 = rengMolesIni.map((rengN) => rengN / rengVolumen)
      const rengEsp = rengReaccion.esp.map((rengE, rengI) => ({ ...rengE, c0: rengC0[rengI]! }))
      if (rengEsp.every((rengE) => rengE.c0 === 0)) return null
      let rengRes
      try {
        rengRes = rengResolverEquilibrio(rengEsp, rengReaccion.K)
      } catch {
        return null
      }
      if (!rengRes.convergio) return null
      const rengQuien = rengReaccion.esp.findIndex((rengE) => rengE.nu > 0)
      const rengDatos: RengDatoEjercicio[] = [rengDatoT('reaccion', 'Reacción', rengEcuacion), rengDatoC('K', 'Constante de equilibrio K (en concentraciones)', rengReaccion.K, '', 3), rengDatoD('V', 'Volumen del recipiente', rengVolumen, 'L', 1), ...rengReaccion.esp.map((rengE, rengI) => rengDatoD(`n${rengI}`, `Cantidad inicial de ${rengE.nombre}`, rengMolesIni[rengI]!, 'mol', 3))]
      return {
        titulo: 'Concentraciones de equilibrio (tabla ICE)',
        enunciado: `En un recipiente de ${rengDatos[2]!.texto} se introduce ${rengReaccion.esp.map((rengE, rengI) => `${rengDatos[3 + rengI]!.texto} de ${rengE.nombre}`).join(', ')}. La reacción ${rengEcuacion} tiene K = ${rengDatos[1]!.texto} a esa temperatura.`,
        pregunta: `¿Cuál es la concentración de ${rengSimbolos[rengQuien]} en el equilibrio?`,
        datos: rengDatos,
        respuesta: rengNumero(rengRes.c[rengQuien]!, 'mol/L', { tolRel: 0.015, errores: [{ valor: rengMolesIni[rengQuien]! + rengReaccion.esp[rengQuien]!.nu * rengRes.xi * rengVolumen, mensaje: 'Diste moles, no concentración: divide entre el volumen del recipiente.' }] }),
        pistas: ['Pasa los moles iniciales a concentraciones dividiendo entre el volumen.', 'Plantea cᵢ = cᵢ⁰ + νᵢ·x para cada especie y sustituye en K = Πcᵢ^νᵢ.', 'Resuelve la ecuación en x (cuadrática) y descarta la raíz que da concentraciones negativas.'],
        pasos: [`c⁰ = ${rengConcentraciones(rengReaccion.esp, rengC0)}`, `ξ = ${rengTextoNumero(rengRes.xi, 4)} mol/L`, `[${rengSimbolos[rengQuien]}] = ${rengTextoNumero(rengRes.c[rengQuien]!, 4)} mol/L`],
        comprobacion: 'Con las concentraciones finales, Q debe valer K.',
        hipotesis: ['Volumen y temperatura constantes; gases o disolución ideal.'],
        errorFrecuente: 'Usar los moles en lugar de las concentraciones o quedarse con la raíz negativa.',
        fuente: RENG_FUENTE_EQ,
        simulacion: { escena: 'equilibrio', entradas: rengEntradasBase(rengC0), comparar: { clave: `c_${rengQuien}` } }
      }
    }
    if (nivel === 'quimico') {
      const rengC0 = rengReaccion.esp.map((rengE) => (rengE.c0 === 0 ? 0 : rengE.c0))
      const rengQuien = rengElegir(azar, rengReaccion.esp.map((rengE, rengI) => rengI).filter((rengI) => rengReaccion.esp[rengI]!.nu < 0))
      const rengDelta = rengElegir(azar, [0.2, 0.5, 1])
      let rengPerturbacion
      try {
        rengPerturbacion = rengDesplazamientoEquilibrio(rengEntradasBase(rengC0), rengQuien, rengDelta)
      } catch {
        return null
      }
      const rengProd = rengReaccion.esp.findIndex((rengE) => rengE.nu > 0)
      const rengEspIni = rengReaccion.esp.map((rengE, rengI) => ({ ...rengE, c0: rengC0[rengI]! }))
      const rengAntes = rengResolverEquilibrio(rengEspIni, rengReaccion.K)
      if (!rengAntes.convergio) return null
      const rengDatos: RengDatoEjercicio[] = [rengDatoT('reaccion', 'Reacción', rengEcuacion), rengDatoC('K', 'Constante de equilibrio K (en concentraciones)', rengReaccion.K, '', 3), ...rengReaccion.esp.map((rengE, rengI) => rengDatoC(`c${rengI}`, `[${rengE.nombre}] inicial`, rengC0[rengI]!, 'mol/L', 3)), rengDatoD('delta', `Se añade ${rengSimbolos[rengQuien]} (una vez alcanzado el equilibrio)`, rengDelta, 'mol/L', 2)]
      return {
        titulo: 'Principio de Le Chatelier cuantitativo',
        enunciado: `El sistema ${rengEcuacion} (K = ${rengDatos[1]!.texto}) se prepara con ${rengConcentraciones(rengReaccion.esp, rengC0)} y se deja llegar al equilibrio. Después se añade ${rengDatos[rengDatos.length - 1]!.texto} de ${rengSimbolos[rengQuien]} sin cambiar el volumen ni la temperatura.`,
        pregunta: `¿Cuál es la nueva concentración de equilibrio de ${rengSimbolos[rengProd]}?`,
        datos: rengDatos,
        respuesta: rengNumero(rengPerturbacion.despues[rengProd]!, 'mol/L', { tolRel: 0.015, errores: [{ valor: rengPerturbacion.antes[rengProd]!, mensaje: 'Esa es la concentración antes de perturbar: al añadir reactivo el equilibrio se desplaza hacia los productos.' }] }),
        metodo: { pregunta: '¿Cómo modelas la perturbación?', opciones: [{ id: 'a', texto: 'Nuevo estado inicial = equilibrio anterior + lo añadido; después se resuelve Q = K otra vez' }, { id: 'b', texto: 'K cambia para compensar lo añadido' }, { id: 'c', texto: 'Las concentraciones vuelven exactamente a las anteriores' }], correcta: 'a', explicacion: 'K solo depende de la temperatura: al añadir sustancia, Q deja de ser K y el sistema reajusta ξ hasta Q = K.' },
        hipotesis: ['K no cambia (temperatura constante).', 'Volumen constante: añadir sustancia no cambia el volumen.'],
        pistas: ['Calcula primero el equilibrio inicial con Q = K.', 'Suma lo añadido a la concentración de equilibrio: ése es el nuevo punto de partida.', 'Resuelve de nuevo Q = K y toma la concentración del producto.'],
        pasos: [`Equilibrio inicial: ${rengConcentraciones(rengReaccion.esp, rengPerturbacion.antes)}`, `Nuevo equilibrio: ${rengConcentraciones(rengReaccion.esp, rengPerturbacion.despues)}`],
        comprobacion: 'El nuevo [producto] debe ser mayor que el anterior (el equilibrio se desplaza para consumir lo añadido) y Q = K.',
        errorFrecuente: 'Pensar que K cambia o que el sistema vuelve a las concentraciones previas.',
        fuente: RENG_FUENTE_EQ,
        simulacion: { escena: 'equilibrio', entradas: rengEntradasBase(rengC0) }
      }
    }
    const rengC0 = rengReaccion.esp.map((rengE) => rengE.c0)
    const rengProd = rengReaccion.esp.findIndex((rengE) => rengE.nu > 0)
    const rengEsp = (rengC: number[]): RengEspecieEq[] => rengReaccion.esp.map((rengE, rengI) => ({ ...rengE, c0: rengC[rengI]! }))
    const rengBase = rengResolverEquilibrio(rengEsp(rengC0), rengReaccion.K)
    const rengAlta = rengResolverEquilibrio(rengEsp(rengC0), rengReaccion.K * 1.1)
    if (!rengBase.convergio || !rengAlta.convergio) return null
    const rengCambio = ((rengAlta.c[rengProd]! - rengBase.c[rengProd]!) / rengBase.c[rengProd]!) * 100
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('reaccion', 'Reacción', rengEcuacion), rengDatoC('K', 'Constante de equilibrio K (en concentraciones)', rengReaccion.K, '', 3), ...rengReaccion.esp.map((rengE, rengI) => rengDatoC(`c${rengI}`, `[${rengE.nombre}] inicial`, rengC0[rengI]!, 'mol/L', 3))]
    return {
      titulo: 'Sensibilidad del equilibrio a K',
      enunciado: `El sistema ${rengEcuacion} se prepara con ${rengConcentraciones(rengReaccion.esp, rengC0)}. Se estudia cómo cambia el equilibrio si el valor de K tuviera una incertidumbre relativa del +10 % (K = ${rengDatos[1]!.texto} frente a 1,1·K).`,
      pregunta: `¿Qué variación relativa (%) experimenta la concentración de equilibrio de ${rengSimbolos[rengProd]}?`,
      datos: rengDatos,
      respuesta: rengNumero(rengCambio, '%', { tolRel: 0.06, tolAbs: 0.2 }),
      hipotesis: ['Las concentraciones iniciales no cambian; solo se varía K.', 'Volumen y temperatura constantes.'],
      pistas: ['Resuelve el equilibrio dos veces: con K y con 1,1·K.', 'Compara las concentraciones del producto: (nuevo − antiguo)/antiguo · 100.'],
      pasos: [`[${rengSimbolos[rengProd]}] con K: ${rengTextoNumero(rengBase.c[rengProd]!, 5)} mol/L`, `[${rengSimbolos[rengProd]}] con 1,1·K: ${rengTextoNumero(rengAlta.c[rengProd]!, 5)} mol/L`, `Variación: ${rengTextoDecimales(rengCambio, 2)} %`],
      comprobacion: 'Una K mayor favorece los productos: la variación debe ser positiva y, en general, menor que 10 % cuando hay un equilibrio de dos especies de concentración fija.',
      errorFrecuente: 'Suponer que la concentración varía exactamente un 10 % con K.',
      fuente: RENG_FUENTE_EQ,
      simulacion: { escena: 'equilibrio', entradas: rengEntradasBase(rengC0) }
    }
  }
}

const RENG_FUENTE_TERMO = (rengIds: string[]): RengFuenteEjercicio => {
  const rengUnicos = [...new Set(rengIds)]
  const rengDatos = rengUnicos.map((rengId) => rengDatoTermo(rengId))
  const rengSinConsultar = rengDatos.some((rengD) => rengD.S !== undefined)
  return {
    texto: `ΔfH°: ${rengDatos[0]!.fuenteH} (fuente secundaria consultada).${rengSinConsultar ? ' S°: valores de libro de texto sin consultar (la app lo indica así en sus simulaciones).' : ''} Datos a 298,15 K.`,
    verificacion: 'didactico'
  }
}

const rengTextoEspecieTermo = (rengId: string): string => {
  const rengD = rengDatoTermo(rengId)
  return `${rengD.formula}(${rengD.fase})`
}

const rengEcuacionTermo = (rengR: (typeof RENG_REACCIONES_TERMO)[number]): string => rengR.nombre.split('  (')[0]!

export const RENG_FAMILIA_TERMO: RengFamilia = {
  id: 'fisicoquimica.termo',
  rama: 'fisicoquimica',
  tema: 'termo',
  nombre: 'Termoquímica y energía libre',
  descripcion: 'Entalpía de reacción, energía libre de Gibbs, espontaneidad y constante de equilibrio.',
  niveles: ['preuniversitario', 'universitario', 'quimico', 'cientifico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    const rengConS = RENG_REACCIONES_TERMO.filter((rengR) => rengEntropiaReaccion(rengR.r) !== null)
    if (nivel === 'preuniversitario') {
      const rengR = rengElegir(azar, RENG_REACCIONES_TERMO.filter((rengX) => ['metano', 'agua', 'amoniaco', 'etanol'].includes(rengX.id)))
      const rengIds = [...rengR.r.reactivos, ...rengR.r.productos].map((rengT) => rengT.id)
      const rengDatos: RengDatoEjercicio[] = [rengDatoT('reaccion', 'Reacción', rengEcuacionTermo(rengR)), ...[...new Set(rengIds)].map((rengId) => rengDatoC(`H_${rengId}`, `ΔfH°(${rengTextoEspecieTermo(rengId)})`, rengDatoTermo(rengId).dHf, 'kJ/mol', 5))]
      const rengDH = rengEntalpiaReaccion(rengR.r)
      return {
        titulo: 'Entalpía de reacción por la ley de Hess',
        enunciado: `Para la reacción ${rengEcuacionTermo(rengR)} se conocen las entalpías de formación estándar: ${rengDatos.slice(1).map((rengD) => `${rengD.etiqueta} = ${rengD.texto}`).join('; ')}.`,
        pregunta: '¿Cuál es la entalpía de reacción estándar ΔH° (kJ por mol de reacción tal como está escrita)?',
        datos: rengDatos,
        respuesta: rengNumero(rengDH, 'kJ', { tolRel: 0.01, errores: [{ valor: -rengDH, mensaje: 'Tienes el signo cambiado: ΔH° = Σν·ΔfH°(productos) − Σν·ΔfH°(reactivos).' }] }),
        pistas: ['ΔH° = Σ ν·ΔfH°(productos) − Σ ν·ΔfH°(reactivos).', 'Multiplica cada ΔfH° por su coeficiente estequiométrico; los elementos en su estado estándar valen 0.'],
        pasos: [`Productos − reactivos con los coeficientes de la ecuación`, `ΔH° = ${rengTextoNumero(rengDH, 5)} kJ`],
        comprobacion: 'Una combustión debe dar ΔH° negativa (exotérmica).',
        errorFrecuente: 'Restar al revés (reactivos − productos) o no multiplicar por los coeficientes.',
        fuente: RENG_FUENTE_TERMO(rengIds),
        simulacion: { escena: 'termo', entradas: { reaccion: rengR.id, T: 298.15 }, comparar: { clave: 'dH' } }
      }
    }
    if (nivel === 'universitario') {
      const rengR = rengElegir(azar, rengConS.filter((rengX) => rengX.id !== 'glucosa'))
      const rengIds = [...rengR.r.reactivos, ...rengR.r.productos].map((rengT) => rengT.id)
      const rengCelsius = rengElegir(azar, [15, 25, 37, 50, 75])
      const rengDH = rengEntalpiaReaccion(rengR.r)
      const rengDS = rengEntropiaReaccion(rengR.r)!
      const rengT = rengCelsius + 273.15
      const rengDG = rengEnergiaLibre(rengDH, rengDS, rengT)
      const rengDatos: RengDatoEjercicio[] = [rengDatoT('reaccion', 'Reacción', rengEcuacionTermo(rengR)), rengDatoC('dH', 'ΔH° de la reacción', rengDH, 'kJ', 5), rengDatoC('dS', 'ΔS° de la reacción', rengDS, 'J/K', 5), rengDatoD('T', 'Temperatura', rengCelsius, '°C', 0)]
      return {
        titulo: 'Energía libre y espontaneidad',
        enunciado: `Para ${rengEcuacionTermo(rengR)}: ΔH° = ${rengDatos[1]!.texto} y ΔS° = ${rengDatos[2]!.texto} (suponerlos constantes). La temperatura es ${rengDatos[3]!.texto}.`,
        pregunta: '¿Cuánto vale ΔG° (en kJ) a esa temperatura? ¿Es espontánea? (responde con el valor numérico)',
        datos: rengDatos,
        respuesta: rengNumero(rengDG, 'kJ', { tolRel: 0.01, tolAbs: 0.1, errores: [{ valor: rengDH - rengT * rengDS, mensaje: 'Mezclaste kJ con J: ΔS° está en J/K y hay que dividir entre 1000 para tener kJ.' }, { valor: rengDH - rengCelsius * (rengDS / 1000), mensaje: 'Usaste la temperatura en °C. En ΔG = ΔH − T·ΔS la T va en kelvin.' }] }),
        metodo: { pregunta: '¿Qué precauciones tomas?', opciones: [{ id: 'a', texto: 'T en kelvin y ΔS en kJ/K (o ΔH en J) para que las unidades coincidan' }, { id: 'b', texto: 'T en °C, porque la energía libre no depende de la escala' }, { id: 'c', texto: 'Sumar ΔH y T·ΔS' }], correcta: 'a', explicacion: 'ΔG = ΔH − T·ΔS exige kelvin y unidades de energía coherentes.' },
        pistas: ['Convierte la temperatura a kelvin: T = t + 273,15.', 'Pasa ΔS° a kJ/K dividiendo entre 1000.', 'ΔG = ΔH − T·ΔS; si es negativa, es espontánea.'],
        pasos: [`T = ${rengTextoNumero(rengT, 5)} K`, `ΔG = ${rengTextoNumero(rengDH, 5)} − ${rengTextoNumero(rengT, 5)}·(${rengTextoNumero(rengDS / 1000, 5)}) = ${rengTextoNumero(rengDG, 5)} kJ`, rengDG < 0 ? 'ΔG < 0: espontánea a esta temperatura.' : 'ΔG > 0: no espontánea a esta temperatura.'],
        hipotesis: ['ΔH° y ΔS° no varían con la temperatura (extrapolación desde 298 K).'],
        errorFrecuente: 'No convertir la temperatura a kelvin o mezclar J con kJ.',
        fuente: RENG_FUENTE_TERMO(rengIds),
        simulacion: { escena: 'termo', entradas: { reaccion: rengR.id, T: rengT }, comparar: { clave: 'dG' } }
      }
    }
    if (nivel === 'quimico') {
      const rengR = rengElegir(azar, rengConS.filter((rengX) => ['amoniaco', 'vaporiza'].includes(rengX.id)))
      const rengIds = [...rengR.r.reactivos, ...rengR.r.productos].map((rengT) => rengT.id)
      const rengTk = rengElegir(azar, rengR.id === 'vaporiza' ? [298.15, 320, 350] : [298.15, 350, 400, 450])
      const rengDH = rengEntalpiaReaccion(rengR.r)
      const rengDS = rengEntropiaReaccion(rengR.r)!
      const rengDG = rengEnergiaLibre(rengDH, rengDS, rengTk)
      const rengLogK = Math.log10(Math.exp((-rengDG * 1000) / (RENG_R * rengTk)))
      const rengDatos: RengDatoEjercicio[] = [rengDatoT('reaccion', 'Reacción', rengEcuacionTermo(rengR)), rengDatoC('dH', 'ΔH° de la reacción', rengDH, 'kJ', 5), rengDatoC('dS', 'ΔS° de la reacción', rengDS, 'J/K', 5), rengDatoD('T', 'Temperatura', rengTk, 'K', 2)]
      return {
        titulo: 'Constante de equilibrio desde ΔG°',
        enunciado: `Para ${rengEcuacionTermo(rengR)}: ΔH° = ${rengDatos[1]!.texto} y ΔS° = ${rengDatos[2]!.texto}, constantes en el intervalo de trabajo. T = ${rengDatos[3]!.texto}. R = 8,314 J/(mol·K).`,
        pregunta: 'Calcula log₁₀ K a esa temperatura.',
        datos: rengDatos,
        respuesta: rengNumero(rengLogK, '', { tolRel: 0.02, tolAbs: 0.05, errores: [{ valor: Math.log10(Math.exp(-rengDG / (RENG_R * rengTk))), mensaje: 'No convertiste ΔG de kJ a J antes de dividir entre R·T.' }] }),
        metodo: { pregunta: '¿Qué relación conecta ΔG° con K?', opciones: [{ id: 'a', texto: 'ΔG° = −R·T·ln K' }, { id: 'b', texto: 'ΔG° = R·T·K' }, { id: 'c', texto: 'ΔG° = ln K / (R·T)' }], correcta: 'a', explicacion: 'Con ΔG° en J/mol, ln K = −ΔG°/(RT).' },
        hipotesis: ['ΔH° y ΔS° constantes con T.', 'K es la constante termodinámica (actividades unidad).'],
        pistas: ['Calcula ΔG° = ΔH° − T·ΔS° con ΔS° pasado a kJ/K.', 'ln K = −ΔG°/(R·T), con ΔG° en J/mol.', 'Convierte a log₁₀ dividiendo entre ln 10.'],
        pasos: [`ΔG° = ${rengTextoNumero(rengDG, 5)} kJ`, `ln K = ${rengTextoNumero((-rengDG * 1000) / (RENG_R * rengTk), 5)}`, `log₁₀ K = ${rengTextoNumero(rengLogK, 4)}`],
        comprobacion: 'ΔG° negativa debe dar K > 1 (log K > 0) y ΔG° positiva, K < 1.',
        errorFrecuente: 'Olvidar pasar kJ a J en R·T.',
        fuente: RENG_FUENTE_TERMO(rengIds),
        simulacion: { escena: 'termo', entradas: { reaccion: rengR.id, T: rengTk }, comparar: { clave: 'K', transformacion: 'log10' } }
      }
    }
    const rengR = rengElegir(azar, rengConS.filter((rengX) => ['amoniaco', 'vaporiza'].includes(rengX.id)))
    const rengIds = [...rengR.r.reactivos, ...rengR.r.productos].map((rengT) => rengT.id)
    const rengDH = rengEntalpiaReaccion(rengR.r)
    const rengDS = rengEntropiaReaccion(rengR.r)!
    const rengUH = rengElegir(azar, [0.4, 0.6, 1.0])
    const rengUS = rengElegir(azar, [1, 2, 3])
    const rengTc = (rengDH * 1000) / rengDS
    const rengU = Math.abs(rengTc) * Math.hypot(rengUH / Math.abs(rengDH), rengUS / Math.abs(rengDS))
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('reaccion', 'Reacción', rengEcuacionTermo(rengR)), rengDatoC('dH', 'ΔH° de la reacción', rengDH, 'kJ', 5), rengDatoD('uH', 'Incertidumbre estándar de ΔH°', rengUH, 'kJ', 1), rengDatoC('dS', 'ΔS° de la reacción', rengDS, 'J/K', 5), rengDatoD('uS', 'Incertidumbre estándar de ΔS°', rengUS, 'J/K', 1)]
    return {
      titulo: 'Temperatura de cambio de signo de ΔG con su incertidumbre',
      enunciado: `Para ${rengEcuacionTermo(rengR)}: ΔH° = ${rengDatos[1]!.texto} (u = ${rengDatos[2]!.texto}) y ΔS° = ${rengDatos[3]!.texto} (u = ${rengDatos[4]!.texto}), constantes y no correlacionadas. La temperatura T* en que ΔG° = 0 es T* = ΔH°/ΔS°.`,
      pregunta: 'Calcula la incertidumbre estándar u(T*) en kelvin por propagación de incertidumbres.',
      datos: rengDatos,
      respuesta: rengNumero(rengU, 'K', { tolRel: 0.04 }),
      hipotesis: ['ΔH° y ΔS° son independientes y constantes con la temperatura.', 'T* es una extrapolación: a esa temperatura las fases y los valores reales pueden diferir de los de 298 K.'],
      pistas: ['T* es un cociente: las incertidumbres relativas se combinan en cuadratura.', 'u(T*)/T* = √[(u(ΔH)/ΔH)² + (u(ΔS)/ΔS)²].', `Pasa ΔH° a J antes de dividir: T* = ΔH°·1000/ΔS°.`],
      pasos: [`T* = ΔH°/ΔS° = ${rengTextoNumero(rengTc, 5)} K`, `u(T*)/T* = ${rengTextoNumero(rengU / Math.abs(rengTc), 3)}`, `u(T*) = ${rengTextoNumero(rengU, 3)} K`],
      comprobacion: 'La incertidumbre relativa de T* no puede ser menor que la mayor de las dos relativas de entrada.',
      errorFrecuente: 'Sumar las incertidumbres relativas o no convertir kJ a J.',
      fuente: { texto: `${RENG_FUENTE_TERMO(rengIds).texto} Las incertidumbres del enunciado son didácticas (no son las de la fuente). Propagación de primer orden (JCGM 100:2008).`, verificacion: 'didactico' },
      simulacion: { escena: 'termo', entradas: { reaccion: rengR.id, T: Math.max(1, Math.min(5000, rengTc)) } }
    }
  }
}

export const RENG_FAMILIA_AJUSTE_CINETICO: RengFamilia = {
  id: 'fisicoquimica.ajuste-cinetico',
  rama: 'fisicoquimica',
  tema: 'ajuste-cinetico',
  nombre: 'Ajuste de datos cinéticos',
  descripcion: 'Comparar modelos de orden 0, 1 y 2 con una serie de concentraciones y estimar k con el criterio de ajuste.',
  niveles: ['cientifico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel !== 'cientifico') return null
    const rengOrdenReal = rengElegir(azar, [0, 1, 2] as RengOrden[])
    const rengA0 = rengElegir(azar, [0.8, 1, 1.2])
    const rengK = rengOrdenReal === 0 ? rengElegir(azar, [0.01, 0.015]) : rengOrdenReal === 1 ? rengElegir(azar, [0.02, 0.03, 0.05]) : rengElegir(azar, [0.02, 0.04, 0.06])
    const rengT = [0, 10, 20, 30, 40, 50, 60]
    const rengA = rengT.map((rengTi, rengI) => (rengI === 0 ? rengA0 : Number((rengConcentracion(rengOrdenReal, rengA0, rengK, rengTi) * (1 + (azar() - 0.5) * 0.02)).toFixed(4))))
    if (rengA.some((rengX) => !(rengX > 0.02))) return null
    const rengAj = rengAjustarOrdenes(rengT, rengA)
    const rengOrdenado = [...rengAj].sort((rengX, rengY) => rengY.r2 - rengX.r2)
    if (rengOrdenado[0]!.orden !== rengOrdenReal || rengOrdenado[0]!.r2 - rengOrdenado[1]!.r2 < 0.002) return null
    const rengPreguntaK = azar() < 0.5
    const rengTabla = { columnas: ['t (s)', '[A] (mol/L)'], filas: rengT.map((rengTi, rengI) => [rengTi, rengA[rengI]!] as Array<string | number>) }
    const rengResumen = rengAj.map((rengF) => `orden ${rengF.orden}: R² = ${rengTextoNumero(rengF.r2, 5)}`).join('; ')
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('serie', 'Serie [A](t)', `7 medidas entre 0 y 60 s`)]
    const rengBase = {
      datos: rengDatos,
      tabla: rengTabla,
      hipotesis: ['Una sola reacción irreversible con una especie reactiva.', 'Errores aleatorios pequeños (≈1 %) e independientes; el criterio de ajuste es R² de la linealización (comparación válida entre modelos con el mismo número de parámetros).'],
      comprobacion: 'Los residuos del mejor modelo no deben mostrar tendencia (signos alternados), y los de los otros modelos sí.',
      errorFrecuente: 'Elegir el modelo por el R² sin mirar los residuos o linealizar con la variable equivocada (ln[A] para orden 1, 1/[A] para orden 2).',
      fuente: { texto: 'Linealización de las leyes integradas y comparación de R² (libro de texto). Datos generados por la app con ruido aleatorio reproducible; no son mediciones publicadas.', verificacion: 'didactico' as const }
    }
    if (!rengPreguntaK) {
      const rengOpc = rengOpciones(azar, `Orden ${rengOrdenReal}`, ['Orden 0', 'Orden 1', 'Orden 2'], 3)
      return {
        ...rengBase,
        titulo: 'Qué orden ajusta mejor',
        enunciado: `Se midió la concentración de A en función del tiempo para A → productos (tabla: ${rengDatos[0]!.texto}). Se linealizan los tres modelos: [A] frente a t (orden 0), ln[A] frente a t (orden 1) y 1/[A] frente a t (orden 2).`,
        pregunta: '¿Qué orden de reacción describe mejor los datos, según el mayor coeficiente de determinación R²?',
        respuesta: { tipo: 'opcion', opciones: rengOpc.opciones, correcta: rengOpc.correcta },
        pistas: ['Para cada modelo calcula la regresión lineal de la variable linealizada frente a t.', 'Compara los R²: el modelo cuya gráfica es más recta es el que mejor ajusta.'],
        pasos: [rengResumen, `El mayor R² corresponde al orden ${rengOrdenReal}.`]
      }
    }
    const rengMejor = rengAj.find((rengF) => rengF.orden === rengOrdenReal)!
    return {
      ...rengBase,
      titulo: 'Constante de velocidad por regresión',
      enunciado: `Se midió la concentración de A en función del tiempo para A → productos (tabla: ${rengDatos[0]!.texto}). Se sabe que la reacción es de orden ${rengOrdenReal}.`,
      pregunta: `Calcula k (${RENG_UNIDAD_K[rengOrdenReal]}) con la regresión lineal de la forma linealizada adecuada (${rengOrdenReal === 0 ? '[A] frente a t' : rengOrdenReal === 1 ? 'ln[A] frente a t' : '1/[A] frente a t'}).`,
      respuesta: rengNumero(rengMejor.k, RENG_UNIDAD_K[rengOrdenReal], { tolRel: 0.05 }),
      pistas: ['Orden 0: [A] = [A]₀ − kt → k = −pendiente. Orden 1: ln[A] = ln[A]₀ − kt → k = −pendiente. Orden 2: 1/[A] = 1/[A]₀ + kt → k = pendiente.', 'Calcula la pendiente con mínimos cuadrados con los siete puntos.'],
      pasos: [rengResumen, `Pendiente del modelo correcto: ${rengTextoNumero(rengMejor.pendiente, 5)}`, `k = ${rengTextoNumero(rengMejor.k, 4)} ${RENG_UNIDAD_K[rengOrdenReal]}`],
      simulacion: { escena: 'cinetica', entradas: { orden: rengOrdenReal, A0: rengA0, k: Number(rengMejor.k.toPrecision(4)) } }
    }
  }
}

export const RENG_FAMILIAS_FISICOQUIMICA: readonly RengFamilia[] = [RENG_FAMILIA_CINETICA, RENG_FAMILIA_EQUILIBRIO, RENG_FAMILIA_TERMO, RENG_FAMILIA_AJUSTE_CINETICO]
