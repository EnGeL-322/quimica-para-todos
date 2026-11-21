import { rengElegir, rengEntre, rengTextoDecimales, rengTextoNumero } from '../numeros'
import { rengRegresionLineal } from '../solucionadores'
import type { RengBaseEjercicio, RengDatoEjercicio, RengFamilia, RengGraficaEjercicio, RengMetodo } from '../tipos'
import { rengDatoC, rengMezclar, RENG_FUENTE_DIDACTICA, rengVarianteDeSemilla, type RengVariante } from './util'

export type RengOrdenCinetico = 0 | 1 | 2

const RENG_TEXTO_ORDEN: Record<RengOrdenCinetico, string> = { 0: 'Orden 0', 1: 'Orden 1', 2: 'Orden 2' }

export const rengLinealizado = (rengOrden: RengOrdenCinetico, rengA: number): number => (rengOrden === 0 ? rengA : rengOrden === 1 ? Math.log(rengA) : 1 / rengA)

export function rengConcentracionOrden(rengOrden: RengOrdenCinetico, rengA0: number, rengK: number, rengT: number): number {
  if (rengOrden === 0) return Math.max(rengA0 - rengK * rengT, 1e-12)
  if (rengOrden === 1) return rengA0 * Math.exp(-rengK * rengT)
  return 1 / (1 / rengA0 + rengK * rengT)
}

const rengParametroK = (rengOrden: RengOrdenCinetico, rengA0: number, rengTfin: number): number => (rengOrden === 0 ? (0.8 * rengA0) / rengTfin : rengOrden === 1 ? Math.log(5) / rengTfin : 4 / (rengA0 * rengTfin))

const rengGauss = (rengAzar: () => number): number => Math.sqrt(-2 * Math.log(Math.max(rengAzar(), 1e-12))) * Math.cos(2 * Math.PI * rengAzar())

export interface RengResiduosModelo {
  orden: RengOrdenCinetico
  normalizados: number[]
  cambiosSigno: number
  s: number
}

export function rengResiduosPorOrden(rengT: number[], rengA: number[]): RengResiduosModelo[] {
  return ([0, 1, 2] as RengOrdenCinetico[]).map((rengOrden) => {
    const rengY = rengA.map((rengX) => rengLinealizado(rengOrden, rengX))
    const rengR = rengRegresionLineal(rengT, rengY)
    const rengRes = rengT.map((rengX, rengI) => rengY[rengI]! - (rengR.b + rengR.m * rengX))
    const rengNorm = rengRes.map((rengE) => rengE / rengR.sr)
    let rengCambios = 0
    for (let rengI = 1; rengI < rengRes.length; rengI++) if (Math.sign(rengRes[rengI]!) !== Math.sign(rengRes[rengI - 1]!)) rengCambios++
    return { orden: rengOrden, normalizados: rengNorm, cambiosSigno: rengCambios, s: rengR.sr }
  })
}

const rengMetodoModelo = (rengPregunta: string, rengCorrecta: string, rengOtras: string[], rengExplicacion: string, rengAzar: () => number): RengMetodo => {
  const rengTodas = rengMezclar(rengAzar, [rengCorrecta, ...rengOtras])
  const rengOpc = rengTodas.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
  return { pregunta: rengPregunta, opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrecta)!.id, explicacion: rengExplicacion }
}

const rengOpcionesOrden = (rengOrden: RengOrdenCinetico): { opciones: Array<{ id: string; texto: string }>; correcta: string } => ({ opciones: [0, 1, 2].map((rengO) => ({ id: String.fromCharCode(97 + rengO), texto: RENG_TEXTO_ORDEN[rengO as RengOrdenCinetico] })), correcta: String.fromCharCode(97 + rengOrden) })

export const RENG_VARIANTES_MODELO_CINETICO: readonly RengVariante[] = [
  { id: 'modelo.semividas-orden0', nivel: 'quimico' },
  { id: 'modelo.semividas-orden1', nivel: 'quimico' },
  { id: 'modelo.semividas-orden2', nivel: 'quimico' },
  { id: 'modelo.residuos-orden0', nivel: 'cientifico' },
  { id: 'modelo.residuos-orden1', nivel: 'cientifico' },
  { id: 'modelo.residuos-orden2', nivel: 'cientifico' }
]

export const RENG_FAMILIA_MODELO_CINETICO: RengFamilia = {
  id: 'fisicoquimica.modelo-cinetico',
  rama: 'fisicoquimica',
  tema: 'ajuste-cinetico',
  nombre: 'Elegir un modelo cinético con observaciones',
  descripcion: 'Deducir el orden de reacción a partir de semividas sucesivas o de los residuos de cada linealización.',
  niveles: ['quimico', 'cientifico'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = rengVarianteDeSemilla(RENG_VARIANTES_MODELO_CINETICO, nivel, semilla)
    if (!rengVar) return null
    const rengOrden = Number(rengVar.id.slice(-1)) as RengOrdenCinetico
    const rengComun = { variante: rengVar.id, fuente: RENG_FUENTE_DIDACTICA }
    const rengTextoMetodo: Record<RengOrdenCinetico, string> = {
      0: 'Observo que cada semivida es aproximadamente la mitad de la anterior',
      1: 'Observo que las semividas son aproximadamente iguales entre sí',
      2: 'Observo que cada semivida es aproximadamente el doble de la anterior'
    }
    if (nivel === 'quimico') {
      const rengBase = rengElegir(azar, [8, 10, 12, 15, 20])
      const rengA0 = rengElegir(azar, [0.8, 1.0, 1.6, 2.0])
      const rengIntervalos = [0, 1, 2].map((rengI) => {
        const rengCon = rengA0 / 2 ** rengI
        const rengDur = rengOrden === 0 ? rengBase * 2 ** -rengI : rengOrden === 1 ? rengBase : rengBase * 2 ** rengI
        return { c: rengCon, t: Number((rengDur * (1 + (azar() - 0.5) * 0.04)).toFixed(1)) }
      })
      return {
        ...rengComun,
        titulo: 'Orden de reacción a partir de semividas',
        enunciado: 'Se sigue la descomposición de una sustancia A a temperatura constante. En cada intervalo se mide cuánto tarda la concentración en caer a la mitad de la que tenía al empezar ese intervalo (datos didácticos; hay ±2 % de dispersión).',
        pregunta: '¿Qué orden de reacción respeta estas observaciones?',
        datos: [],
        grafica: {
          titulo: 'Semividas sucesivas',
          tituloX: 'Concentración al inicio del intervalo (mol/L)',
          tituloY: 'Tiempo para caer a la mitad (min)',
          descripcion: 'Tiempo que tarda la concentración en caer a la mitad en tres intervalos sucesivos, frente a la concentración con que empieza cada uno.',
          series: [{ nombre: 'Semividas observadas', puntos: rengIntervalos.map((rengX) => [rengX.c, rengX.t] as [number, number]), marcador: 'circulo', linea: true }],
          tabla: { columnas: ['Intervalo', 'Concentración al inicio (mol/L)', 'Tiempo para caer a la mitad (min)'], filas: rengIntervalos.map((rengX, rengI) => [rengI + 1, rengTextoDecimales(rengX.c, 3), rengTextoDecimales(rengX.t, 1)]) }
        },
        respuesta: { tipo: 'opcion', ...rengOpcionesOrden(rengOrden) },
        metodo: rengMetodoModelo('¿Qué observas en las semividas de la tabla?', rengTextoMetodo[rengOrden], ([0, 1, 2] as RengOrdenCinetico[]).filter((rengO) => rengO !== rengOrden).map((rengO) => rengTextoMetodo[rengO]), 'Cómo cambia la semivida al bajar la concentración identifica el orden: constante (orden 1), decreciente (orden 0) o creciente (orden 2).', azar),
        criterioCompleto: 'Cuenta como respuesta completa: el orden correcto y la observación de las semividas que lo respalda.',
        hipotesis: ['Temperatura constante y una sola reacción elemental aparente.', 'La dispersión de ±2 % no cambia la tendencia de las semividas.'],
        pistas: ['Compara los tiempos de cada intervalo: ¿son iguales, crecen o decrecen?', 'La concentración se reduce a la mitad en cada intervalo; mira cómo cambia el tiempo que cuesta esa reducción.', 'Orden 0: la semivida disminuye; orden 1: constante; orden 2: aumenta.'],
        pasos: [`Semividas observadas: ${rengIntervalos.map((rengX) => `${rengTextoDecimales(rengX.t, 1)} min`).join(', ')}.`, `Tendencia: ${rengOrden === 0 ? 'disminuyen' : rengOrden === 1 ? 'se mantienen' : 'aumentan'}.`, `Conclusión: ${RENG_TEXTO_ORDEN[rengOrden].toLowerCase()}.`],
        comprobacion: 'Comprueba con la relación entre semivida y concentración inicial del orden elegido.',
        errorFrecuente: 'Suponer orden 1 siempre, sin mirar cómo cambia la semivida.'
      }
    }
    const rengDelta = rengElegir(azar, [5, 10, 15])
    const rengA0 = rengElegir(azar, [0.5, 1.0, 2.0])
    const rengT = Array.from({ length: 7 }, (_, rengI) => rengI * rengDelta)
    const rengK = rengParametroK(rengOrden, rengA0, rengT.at(-1)!)
    const rengA = rengT.map((rengX) => Number((rengConcentracionOrden(rengOrden, rengA0, rengK, rengX) * (1 + 0.012 * rengGauss(azar))).toPrecision(3)))
    const rengRes = rengResiduosPorOrden(rengT, rengA)
    const rengVerdadero = rengRes.find((rengR) => rengR.orden === rengOrden)!
    const rengOtros = rengRes.filter((rengR) => rengR.orden !== rengOrden)
    if (rengVerdadero.cambiosSigno < 3 || rengOtros.some((rengR) => rengR.cambiosSigno > 2)) return null
    const rengSeries = rengRes.map((rengR, rengI) => ({ nombre: RENG_TEXTO_ORDEN[rengR.orden], puntos: rengT.map((rengX, rengJ) => [rengX, rengR.normalizados[rengJ]!] as [number, number]), marcador: (['circulo', 'cuadrado', 'triangulo'] as const)[rengI]!, linea: true }))
    const rengGrafica: RengGraficaEjercicio = {
      titulo: 'Residuos normalizados de cada linealización',
      tituloX: 'Tiempo (min)',
      tituloY: 'Residuo / s del ajuste (adimensional)',
      descripcion: 'Residuos de la recta ajustada para cada orden, divididos entre la desviación típica de ese ajuste, frente al tiempo. Un modelo adecuado deja residuos dispersos sin forma; uno inadecuado deja una curva.',
      series: rengSeries,
      tabla: { columnas: ['Tiempo (min)', '[A] (mol/L)', 'Residuo orden 0', 'Residuo orden 1', 'Residuo orden 2'], filas: rengT.map((rengX, rengI) => [rengX, rengTextoNumero(rengA[rengI]!, 3), ...rengRes.map((rengR) => rengTextoDecimales(rengR.normalizados[rengI]!, 2))]) }
    }
    const rengDatos: RengDatoEjercicio[] = [rengDatoC('A0', 'Concentración en t = 0', rengA[0]!, 'mol/L', 3)]
    return {
      ...rengComun,
      titulo: 'Elegir el modelo con los residuos',
      enunciado: `Se mide la concentración de A a intervalos de ${rengDelta} min, a temperatura constante, empezando en ${rengDatos[0]!.texto} (datos didácticos, con ruido de aproximadamente 1 %). Para cada orden se ajustó la recta de su linealización ([A], ln[A] o 1/[A] frente a t) y se calcularon sus residuos, divididos entre la desviación típica de ese ajuste.`,
      pregunta: '¿Qué orden describe mejor los datos?',
      datos: rengDatos,
      grafica: rengGrafica,
      respuesta: { tipo: 'opcion', ...rengOpcionesOrden(rengOrden) },
      metodo: rengMetodoModelo('¿Qué criterio usas para elegir?', 'Elijo el orden cuyos residuos son pequeños y se reparten sin una forma sistemática; los demás dejan una curva', ['Elijo el orden con la pendiente más grande', 'Elijo siempre el orden 1, que es el más habitual', 'Elijo el orden con el primer residuo más pequeño'], 'Un modelo adecuado deja residuos aleatorios (signos que se alternan, sin curvatura); los modelos inadecuados dejan una forma en U o en arco.', azar),
      criterioCompleto: 'Cuenta como respuesta completa: el orden correcto y el criterio basado en la forma de los residuos.',
      hipotesis: ['El ruido es aleatorio y de tamaño similar en todas las medidas.', 'Con siete puntos la forma de los residuos es una pista, no una prueba definitiva.'],
      pistas: ['Mira la forma de cada serie de residuos, no su tamaño: ¿se reparten al azar o describen una curva?', 'Una curva en U o en arco indica que la linealización no es la adecuada.', 'Un solo orden tiene residuos que alternan de signo sin patrón.'],
      pasos: [`Cambios de signo de los residuos: orden 0 → ${rengRes[0]!.cambiosSigno}; orden 1 → ${rengRes[1]!.cambiosSigno}; orden 2 → ${rengRes[2]!.cambiosSigno}.`, `Los órdenes ${rengOtros.map((rengR) => rengR.orden).join(' y ')} dejan residuos con forma de curva.`, `Se elige ${RENG_TEXTO_ORDEN[rengOrden].toLowerCase()}.`],
      comprobacion: 'Comprueba que el orden elegido da una recta con residuos sin curvatura y que k tiene las unidades de ese orden.',
      errorFrecuente: 'Quedarse con el ajuste de mayor R² sin mirar la forma de los residuos.'
    }
  }
}

interface RengReaccionEq {
  texto: string
  reactivos: Array<{ f: string; nu: number }>
  productos: Array<{ f: string; nu: number }>
}

const RENG_REACCIONES_EQ: readonly RengReaccionEq[] = [
  { texto: 'H₂ + I₂ ⇌ 2 HI', reactivos: [{ f: 'H₂', nu: 1 }, { f: 'I₂', nu: 1 }], productos: [{ f: 'HI', nu: 2 }] },
  { texto: 'N₂O₄ ⇌ 2 NO₂', reactivos: [{ f: 'N₂O₄', nu: 1 }], productos: [{ f: 'NO₂', nu: 2 }] },
  { texto: '2 SO₂ + O₂ ⇌ 2 SO₃', reactivos: [{ f: 'SO₂', nu: 2 }, { f: 'O₂', nu: 1 }], productos: [{ f: 'SO₃', nu: 2 }] }
]

export const rengCocienteReaccion = (rengR: RengReaccionEq, rengC: Record<string, number>): number => {
  const rengNum = rengR.productos.reduce((rengA, rengX) => rengA * rengC[rengX.f]! ** rengX.nu, 1)
  const rengDen = rengR.reactivos.reduce((rengA, rengX) => rengA * rengC[rengX.f]! ** rengX.nu, 1)
  return rengNum / rengDen
}

const RENG_OPCIONES_EQ = {
  productos: 'Sí: Q < K, la reacción avanza hacia los productos',
  reactivos: 'Sí: Q > K, la reacción avanza hacia los reactivos',
  equilibrio: 'Sí: Q ≈ K, el sistema está en equilibrio',
  faltaK: 'No: falta el valor de K a esa temperatura para compararlo con Q',
  otraT: 'No: K se dio a otra temperatura y K cambia con la temperatura',
  faltaConc: 'No: falta la concentración de una especie para calcular Q'
}

export const RENG_VARIANTES_EQUILIBRIO_SUFICIENCIA: readonly RengVariante[] = [
  { id: 'equilibrio-suficiencia.falta-k', nivel: 'universitario' },
  { id: 'equilibrio-suficiencia.datos-suficientes', nivel: 'universitario' },
  { id: 'equilibrio-suficiencia.k-otra-temperatura', nivel: 'quimico' },
  { id: 'equilibrio-suficiencia.falta-concentracion', nivel: 'quimico' },
  { id: 'equilibrio-suficiencia.aproximacion', nivel: 'cientifico' },
  { id: 'equilibrio-suficiencia.datos-suficientes-2', nivel: 'quimico' }
]

const rengTextoConc = (rengF: string, rengV: number): string => `[${rengF}] = ${rengTextoNumero(rengV, 3)} mol/L`

export const RENG_FAMILIA_EQUILIBRIO_SUFICIENCIA: RengFamilia = {
  id: 'fisicoquimica.equilibrio-suficiencia',
  rama: 'fisicoquimica',
  tema: 'equilibrio',
  nombre: 'Datos suficientes para predecir el equilibrio',
  descripcion: 'Decidir si los datos permiten comparar Q con K o si una aproximación debe revisarse.',
  niveles: ['universitario', 'quimico', 'cientifico'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = rengVarianteDeSemilla(RENG_VARIANTES_EQUILIBRIO_SUFICIENCIA, nivel, semilla)
    if (!rengVar) return null
    const rengComun = { variante: rengVar.id, fuente: RENG_FUENTE_DIDACTICA }
    const rengOpciones = (rengCorrecta: string, rengOtras: string[]): { opciones: Array<{ id: string; texto: string }>; correcta: string } => {
      const rengOpc = rengMezclar(azar, [rengCorrecta, ...rengOtras]).map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
      return { opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrecta)!.id }
    }
    if (rengVar.id === 'equilibrio-suficiencia.aproximacion') {
      const rengC = rengElegir(azar, [0.001, 0.005, 0.01, 0.05, 0.1, 0.5])
      const rengKa = rengElegir(azar, [1.8e-5, 4.0e-5, 1.0e-4, 6.8e-4, 1.0e-3])
      const rengRaz = Math.sqrt(rengKa / rengC)
      if (rengRaz > 0.035 && rengRaz < 0.07) return null
      const rengXExacto = (-rengKa + Math.sqrt(rengKa * rengKa + 4 * rengKa * rengC)) / 2
      const rengValida = rengRaz < 0.05
      const rengDatos: RengDatoEjercicio[] = [rengDatoC('C', 'Concentración inicial del ácido HA', rengC, 'mol/L', 3), rengDatoC('Ka', 'Constante de acidez (dato didáctico)', rengKa, '', 3)]
      const rengCorrecta = rengValida ? 'Válida: x/C es menor que el 5 %, se puede usar x ≈ √(Ka·C)' : 'Debe revisarse: x/C es mayor que el 5 %, hay que resolver la ecuación de segundo grado'
      const rengOp = rengOpciones(rengCorrecta, [rengValida ? 'Debe revisarse: x/C es mayor que el 5 %, hay que resolver la ecuación de segundo grado' : 'Válida: x/C es menor que el 5 %, se puede usar x ≈ √(Ka·C)', 'Válida siempre que Ka sea menor que 1', 'No se puede decidir sin medir el pH'])
      return {
        ...rengComun,
        titulo: 'Revisar una aproximación',
        enunciado: `Un ácido débil monoprótico HA tiene una concentración inicial de ${rengDatos[0]!.texto} y una Ka = ${rengDatos[1]!.texto} a 25 °C. Se propone calcular [H₃O⁺] con la aproximación x ≈ √(Ka·C), que supone que C − x ≈ C.`,
        pregunta: '¿Es aceptable la aproximación o necesita revisión? Usa el criterio del 5 %.',
        datos: rengDatos,
        respuesta: { tipo: 'opcion', ...rengOp },
        metodo: rengMetodoModelo('¿Qué cantidad comparas con el 5 %?', 'El cociente x/C, con x calculada con la propia aproximación', ['La constante Ka, sin más', 'El pH obtenido con la aproximación', 'La concentración inicial C'], 'La aproximación C − x ≈ C solo es razonable si x es una fracción pequeña de C; se comprueba con x/C = √(Ka/C).', azar),
        criterioCompleto: 'Cuenta como respuesta completa: la conclusión sobre la aproximación y la cantidad (x/C) con que la justificas.',
        hipotesis: ['El único equilibrio relevante es la disociación de HA.', 'Se desprecia la autoionización del agua.', 'El 5 % es un criterio convencional, no un límite exacto.'],
        pistas: ['Calcula primero x con la aproximación: x ≈ √(Ka·C).', 'Después calcula x/C y compáralo con 0,05.', `Con x/C = ${rengTextoDecimales(rengRaz * 100, 1)} % la aproximación ${rengValida ? 'se acepta' : 'no se acepta'}.`],
        pasos: [`x ≈ √(${rengTextoNumero(rengKa, 3)} · ${rengTextoNumero(rengC, 3)}) = ${rengTextoNumero(Math.sqrt(rengKa * rengC), 3)} mol/L`, `x/C = ${rengTextoDecimales(rengRaz * 100, 2)} %`, rengValida ? 'Menor que el 5 %: la aproximación es válida.' : 'Mayor que el 5 %: hay que resolver x² + Ka·x − Ka·C = 0.', `Solución exacta: x = ${rengTextoNumero(rengXExacto, 3)} mol/L.`],
        comprobacion: 'Sustituye x en Ka = x² / (C − x) y comprueba que recuperas el valor dado.',
        errorFrecuente: 'Aplicar √(Ka·C) sin comprobar nunca que x sea pequeña frente a C.'
      }
    }
    const rengReaccion = rengElegir(azar, RENG_REACCIONES_EQ)
    const rengEspecies = [...rengReaccion.reactivos, ...rengReaccion.productos]
    const rengConc: Record<string, number> = Object.fromEntries(rengEspecies.map((rengE) => [rengE.f, rengEntre(azar, 0.02, 0.6, 0.02)]))
    const rengQ = rengCocienteReaccion(rengReaccion, rengConc)
    const rengLineasConc = rengEspecies.map((rengE) => rengTextoConc(rengE.f, rengConc[rengE.f]!))
    const rengDatosConc: RengDatoEjercicio[] = rengEspecies.map((rengE) => rengDatoC(`c${rengE.f}`, `Concentración de ${rengE.f}`, rengConc[rengE.f]!, 'mol/L', 3))
    const rengBase = { ...rengComun, datos: rengDatosConc }
    if (rengVar.id === 'equilibrio-suficiencia.falta-k') {
      const rengOp = rengOpciones(RENG_OPCIONES_EQ.faltaK, [RENG_OPCIONES_EQ.productos, RENG_OPCIONES_EQ.reactivos, RENG_OPCIONES_EQ.faltaConc])
      return {
        ...rengBase,
        titulo: '¿Se puede predecir el sentido?',
        enunciado: `Para ${rengReaccion.texto} a una temperatura fija se mide una mezcla con ${rengDatosConc.map((rengD) => `${rengD.etiqueta.replace('Concentración de ', '')} ${rengD.texto}`).join(', ')}. No se da la constante de equilibrio.`,
        pregunta: '¿Se puede predecir hacia dónde evoluciona la mezcla con estos datos?',
        respuesta: { tipo: 'opcion', ...rengOp },
        pistas: ['Para saber el sentido hay que comparar Q con K.', 'Q se calcula con las concentraciones dadas, pero K es una propiedad de la reacción a esa temperatura.', 'Sin K no se puede decir si Q es menor, mayor o igual.'],
        pasos: [`Q = ${rengTextoNumero(rengQ, 3)} (calculable con las concentraciones).`, 'El enunciado no da K: no hay con qué comparar Q.', RENG_OPCIONES_EQ.faltaK + '.'],
        errorFrecuente: 'Suponer que un Q «pequeño» o «grande» basta para decidir el sentido sin conocer K.'
      }
    }
    if (rengVar.id === 'equilibrio-suficiencia.datos-suficientes' || rengVar.id === 'equilibrio-suficiencia.datos-suficientes-2') {
      const rengCaso = rengElegir(azar, ['productos', 'reactivos', 'equilibrio'] as const)
      const rengFactor = rengCaso === 'productos' ? 3 : rengCaso === 'reactivos' ? 1 / 3 : 1.02
      const rengK = Number((rengQ * rengFactor).toPrecision(3))
      const rengCorrecta = RENG_OPCIONES_EQ[rengCaso]
      const rengOp = rengOpciones(rengCorrecta, [RENG_OPCIONES_EQ.productos, RENG_OPCIONES_EQ.reactivos, RENG_OPCIONES_EQ.equilibrio, RENG_OPCIONES_EQ.faltaK].filter((rengT) => rengT !== rengCorrecta))
      const rengNivelQ = rengVar.nivel === 'quimico'
      return {
        ...rengBase,
        titulo: 'Comparar Q con K',
        enunciado: `Para ${rengReaccion.texto} a 400 K, K = ${rengTextoNumero(rengK, 3)} (dato didáctico). Se prepara una mezcla con ${rengDatosConc.map((rengD) => `${rengD.etiqueta.replace('Concentración de ', '')} ${rengD.texto}`).join(', ')}.`,
        pregunta: '¿Hacia dónde evoluciona la mezcla? Elige la conclusión que justifican los datos.',
        respuesta: { tipo: 'opcion', ...rengOp },
        hipotesis: rengNivelQ ? ['Los datos están a la misma temperatura que K.', 'Se considera equilibrio cuando Q difiere de K en menos del 5 %.'] : undefined,
        pistas: ['Escribe Q con la misma forma que K, pero con las concentraciones de la mezcla.', 'Compara Q con K: menor → hacia los productos; mayor → hacia los reactivos.', 'Si Q es casi igual a K (dentro de la tolerancia), el sistema ya está en equilibrio.'],
        pasos: [`Q = ${rengTextoNumero(rengQ, 3)}; K = ${rengTextoNumero(rengK, 3)}.`, `Q/K = ${rengTextoNumero(rengQ / rengK, 3)}.`, rengCorrecta + '.'],
        comprobacion: 'Comprueba que Q se calculó con los mismos exponentes que K (coeficientes estequiométricos).',
        errorFrecuente: 'Olvidar los coeficientes como exponentes al escribir Q.'
      }
    }
    if (rengVar.id === 'equilibrio-suficiencia.k-otra-temperatura') {
      const rengK = Number((rengQ * 3).toPrecision(3))
      const rengOp = rengOpciones(RENG_OPCIONES_EQ.otraT, [RENG_OPCIONES_EQ.productos, RENG_OPCIONES_EQ.reactivos, RENG_OPCIONES_EQ.faltaConc])
      return {
        ...rengBase,
        titulo: 'La K es de otra temperatura',
        enunciado: `Para ${rengReaccion.texto}, K = ${rengTextoNumero(rengK, 3)} a 298 K (dato didáctico). Se prepara a 350 K una mezcla con ${rengDatosConc.map((rengD) => `${rengD.etiqueta.replace('Concentración de ', '')} ${rengD.texto}`).join(', ')}.`,
        pregunta: '¿Se puede predecir el sentido de la reacción a 350 K con estos datos?',
        respuesta: { tipo: 'opcion', ...rengOp },
        hipotesis: ['K depende de la temperatura; Q no es un valor de equilibrio.', 'No se da ΔH, por lo que K(350 K) no se puede estimar.'],
        pistas: ['Q y K deben compararse a la misma temperatura.', 'K se dio a 298 K y la mezcla está a 350 K.', 'Sin K(350 K) o ΔH para estimarla, no hay forma de comparar.'],
        pasos: [`Q = ${rengTextoNumero(rengQ, 3)} a 350 K.`, 'K dada: a 298 K, otra temperatura.', RENG_OPCIONES_EQ.otraT + '.'],
        comprobacion: 'Si te dieran K a 350 K o ΔH para estimarla (van’t Hoff), podrías comparar con Q.',
        errorFrecuente: 'Comparar Q con una K medida a otra temperatura como si fuera la misma.'
      }
    }
    const rengOcultar = rengElegir(azar, rengEspecies)
    const rengQuedan = rengEspecies.filter((rengE) => rengE.f !== rengOcultar.f)
    const rengK = Number((rengQ * 3).toPrecision(3))
    const rengOp = rengOpciones(RENG_OPCIONES_EQ.faltaConc, [RENG_OPCIONES_EQ.productos, RENG_OPCIONES_EQ.reactivos, RENG_OPCIONES_EQ.faltaK])
    return {
      ...rengComun,
      titulo: 'Falta una concentración',
      enunciado: `Para ${rengReaccion.texto} a 400 K, K = ${rengTextoNumero(rengK, 3)} (dato didáctico). Se prepara una mezcla de la que solo se conocen ${rengQuedan.map((rengE) => rengTextoConc(rengE.f, rengConc[rengE.f]!)).join(', ')}; no se conoce [${rengOcultar.f}].`,
      pregunta: '¿Se puede predecir el sentido de la reacción con estos datos?',
      datos: rengQuedan.map((rengE) => rengDatoC(`c${rengE.f}`, `Concentración de ${rengE.f}`, rengConc[rengE.f]!, 'mol/L', 3)),
      respuesta: { tipo: 'opcion', ...rengOp },
      hipotesis: ['Q requiere las concentraciones de todas las especies que aparecen en K.', 'Los datos están a la misma temperatura que K.'],
      pistas: ['Escribe Q con todas las especies de la reacción.', `Q necesita [${rengOcultar.f}] y ese dato no se da.`, 'Sin Q no se puede compararlo con K.'],
      pasos: [`Q incluye [${rengOcultar.f}] (${rengOcultar.nu} como exponente).`, `Falta ese valor: no se puede calcular Q.`, RENG_OPCIONES_EQ.faltaConc + '.'],
      comprobacion: 'Con [' + rengOcultar.f + '] se podría calcular Q y compararlo con K.',
      errorFrecuente: 'Ignorar la especie que falta y calcular un Q «parcial».'
    }
  }
}

export const RENG_FAMILIAS_RAZONAMIENTO_FISICOQUIMICA: readonly RengFamilia[] = [RENG_FAMILIA_MODELO_CINETICO, RENG_FAMILIA_EQUILIBRIO_SUFICIENCIA]
