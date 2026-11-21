import { rengElegir, rengEntre, rengTextoDecimales, rengTextoNumero } from '../numeros'
import { rengRegresionLineal } from '../solucionadores'
import type { RengBaseEjercicio, RengDatoEjercicio, RengFamilia, RengGraficaEjercicio, RengMetodo } from '../tipos'
import { rengDatoD, rengMezclar, rengNumero, RENG_FUENTE_DIDACTICA, rengVarianteDeSemilla, type RengVariante } from './util'

const RENG_KW = 1e-14

export function rengPhFuerteFuerte(rengCa: number, rengVa: number, rengCb: number, rengVb: number): number {
  const rengTotal = (rengVa + rengVb) / 1000
  const rengDelta = (rengCa * rengVa - rengCb * rengVb) / 1000 / rengTotal
  const rengH = (rengDelta + Math.sqrt(rengDelta * rengDelta + 4 * RENG_KW)) / 2
  return -Math.log10(rengH)
}

export function rengPhDebilFuerte(rengCa: number, rengVa: number, rengKa: number, rengCb: number, rengVb: number): number {
  const rengTotal = (rengVa + rengVb) / 1000
  const rengCt = (rengCa * rengVa) / 1000 / rengTotal
  const rengNa = (rengCb * rengVb) / 1000 / rengTotal
  const rengF = (rengLogH: number): number => {
    const rengH = 10 ** rengLogH
    return rengNa + rengH - (rengCt * rengKa) / (rengH + rengKa) - RENG_KW / rengH
  }
  let rengLo = -14
  let rengHi = 0
  for (let rengI = 0; rengI < 200; rengI++) {
    const rengMed = (rengLo + rengHi) / 2
    if (rengF(rengMed) > 0) rengHi = rengMed
    else rengLo = rengMed
  }
  return -((rengLo + rengHi) / 2)
}

export interface RengPuntoValoracion {
  v: number
  ph: number
}

const rengTablaPh = (rengPuntos: RengPuntoValoracion[]): RengGraficaEjercicio['tabla'] => ({ columnas: ['Volumen de NaOH añadido (mL)', 'pH medido'], filas: rengPuntos.map((rengP) => [rengTextoDecimales(rengP.v, 1), rengTextoDecimales(rengP.ph, 2)]) })

const rengGraficaPh = (rengPuntos: RengPuntoValoracion[]): RengGraficaEjercicio => ({
  titulo: 'Curva de valoración',
  tituloX: 'Volumen de NaOH añadido (mL)',
  tituloY: 'pH',
  descripcion: 'Gráfica del pH frente al volumen de NaOH añadido, con puntos medidos unidos por una línea; el pH sube bruscamente en un intervalo estrecho de volumen.',
  series: [{ nombre: 'pH medido', puntos: rengPuntos.map((rengP) => [rengP.v, rengP.ph] as [number, number]), marcador: 'circulo', linea: true }],
  tabla: rengTablaPh(rengPuntos)
})

const rengVolumenes = (rengVeq: number, rengMitad: boolean): number[] => {
  const rengBase = [0, 0.25 * rengVeq, 0.5 * rengVeq, 0.75 * rengVeq, rengVeq - 1, rengVeq - 0.5, rengVeq + 0.5, rengVeq + 1, 1.25 * rengVeq, 1.5 * rengVeq].map((rengV) => Math.round(rengV * 2) / 2)
  return [...new Set(rengMitad ? [...rengBase, rengVeq / 2] : rengBase)].sort((rengA, rengB) => rengA - rengB)
}

const rengMetodoValoracion = (rengCorrecta: string, rengOtras: string[], rengExplicacion: string, rengAzar: () => number): RengMetodo => {
  const rengTodas = rengMezclar(rengAzar, [rengCorrecta, ...rengOtras])
  const rengOpc = rengTodas.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
  return { pregunta: '¿Cómo localizas el punto de equivalencia en la curva?', opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrecta)!.id, explicacion: rengExplicacion }
}

export const RENG_VARIANTES_CURVA: readonly RengVariante[] = [
  { id: 'curva.lectura-fuerte', nivel: 'preuniversitario' },
  { id: 'curva.concentracion-desde-curva', nivel: 'universitario' },
  { id: 'curva.pka-debil', nivel: 'quimico' },
  { id: 'curva.lectura-fuerte-2', nivel: 'universitario' }
]

export const RENG_FAMILIA_CURVA_EQUIVALENCIA: RengFamilia = {
  id: 'analitica.curva-equivalencia',
  rama: 'analitica',
  tema: 'valoracion',
  nombre: 'Interpretar la equivalencia en una curva',
  descripcion: 'Leer una curva de valoración (gráfica y tabla), localizar el punto de equivalencia y usarlo.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = rengVarianteDeSemilla(RENG_VARIANTES_CURVA, nivel, semilla)
    if (!rengVar) return null
    const rengVeq = rengElegir(azar, [15, 20, 25])
    const rengVa = 25
    const rengCb = 0.1
    const rengCa = (rengCb * rengVeq) / rengVa
    const rengDatosBase = (): RengDatoEjercicio[] => [rengDatoD('Va', 'Volumen de ácido valorado', rengVa, 'mL', 2), rengDatoD('Cb', 'Concentración del NaOH', rengCb, 'mol/L', 3)]
    const rengComun = { variante: rengVar.id, fuente: RENG_FUENTE_DIDACTICA }
    if (rengVar.id === 'curva.pka-debil') {
      const rengPka = rengElegir(azar, [4.0, 4.5, 4.75, 5.0, 5.5])
      const rengKa = 10 ** -rengPka
      const rengPuntos = rengVolumenes(rengVeq, true).map((rengV) => ({ v: rengV, ph: rengPhDebilFuerte(rengCa, rengVa, rengKa, rengCb, rengV) }))
      const rengDatos = rengDatosBase()
      return {
        ...rengComun,
        titulo: 'pKa de un ácido débil a partir de su curva',
        enunciado: `Se valoran ${rengDatos[0]!.texto} de un ácido débil monoprótico HA con NaOH de ${rengDatos[1]!.texto}. La gráfica y la tabla recogen el pH medido (datos didácticos, 25 °C).`,
        pregunta: '¿Cuál es el pKa del ácido? Localiza primero el punto de equivalencia.',
        datos: rengDatos,
        grafica: rengGraficaPh(rengPuntos),
        respuesta: rengNumero(rengPka, '', { tolAbs: 0.1, tolRel: 0 }),
        metodo: rengMetodoValoracion('Donde la pendiente de la curva es máxima (salto brusco de pH); el pKa es el pH a la mitad de ese volumen', ['En el volumen donde el pH vale 7, que es siempre el equivalente', 'En el primer punto medido, a volumen cero', 'En el último punto de la tabla'], 'El equivalente está donde dpH/dV es máxima; para un ácido débil el pH está por encima de 7 allí. A la mitad de ese volumen [HA] = [A⁻] y pH = pKa.', azar),
        criterioCompleto: 'Cuenta como respuesta completa: el pKa correcto y el método para localizar el equivalente.',
        hipotesis: ['Ácido débil monoprótico y base fuerte.', 'A la mitad del volumen de equivalencia, [HA] ≈ [A⁻] y pH ≈ pKa (se desprecia la disociación del propio ácido).'],
        pistas: ['El punto de equivalencia es donde la curva sube más rápido: busca el mayor salto de pH entre dos volúmenes consecutivos.', 'Tras hallar el volumen de equivalencia, divide entre 2 para obtener el volumen de semiequivalencia.', 'El pH de la tabla en el volumen de semiequivalencia es el pKa.'],
        pasos: [`Mayor salto de pH: entre ${rengTextoDecimales(rengVeq - 0.5, 1)} y ${rengTextoDecimales(rengVeq + 0.5, 1)} mL → equivalente ≈ ${rengTextoDecimales(rengVeq, 1)} mL.`, `Semiequivalencia: ${rengTextoDecimales(rengVeq, 1)} / 2 = ${rengTextoDecimales(rengVeq / 2, 2)} mL.`, `pH a ${rengTextoDecimales(rengVeq / 2, 1)} mL ≈ ${rengTextoDecimales(rengPuntos.find((rengP) => rengP.v === rengVeq / 2)?.ph ?? rengPka, 2)} ≈ pKa.`],
        comprobacion: 'En el equivalente el pH debe quedar por encima de 7 para un ácido débil valorado con base fuerte.',
        errorFrecuente: 'Tomar como pKa el pH del equivalente en lugar del de la semiequivalencia.'
      }
    }
    const rengPuntos = rengVolumenes(rengVeq, false).map((rengV) => ({ v: rengV, ph: rengPhFuerteFuerte(rengCa, rengVa, rengCb, rengV) }))
    const rengDatos = rengDatosBase()
    if (rengVar.id === 'curva.concentracion-desde-curva') {
      return {
        ...rengComun,
        titulo: 'Concentración del ácido a partir de la curva',
        enunciado: `Se valoran ${rengDatos[0]!.texto} de HCl de concentración desconocida con NaOH de ${rengDatos[1]!.texto}. La gráfica y la tabla recogen el pH medido (datos didácticos, 25 °C).`,
        pregunta: '¿Qué concentración tiene el HCl? Localiza antes el punto de equivalencia.',
        datos: rengDatos,
        grafica: rengGraficaPh(rengPuntos),
        respuesta: rengNumero(rengCa, 'mol/L', { tolRel: 0.03 }),
        metodo: rengMetodoValoracion('En el mayor salto de pH; ahí n(HCl) = n(NaOH), con 1 : 1', ['Donde el pH es mínimo, que es el punto final', 'En el punto medio de la tabla, siempre', 'Donde el pH vale exactamente 7,00 en la tabla'], 'En el equivalente la pendiente de la curva es máxima y se igualan los moles de ácido y de base. Con datos discretos, es el punto medio del intervalo de mayor salto.', azar),
        criterioCompleto: 'Cuenta como respuesta completa: la concentración correcta y el criterio con el que localizas el equivalente.',
        pistas: ['El equivalente está en el intervalo con mayor cambio de pH entre dos filas consecutivas.', 'Toma el punto medio de ese intervalo como volumen de equivalencia.', 'En 1 : 1, C(HCl) · V(HCl) = C(NaOH) · V(equivalente).'],
        pasos: [`Mayor salto: entre ${rengTextoDecimales(rengVeq - 0.5, 1)} y ${rengTextoDecimales(rengVeq + 0.5, 1)} mL → V(eq) = ${rengTextoDecimales(rengVeq, 1)} mL.`, `n(NaOH) = ${rengTextoDecimales(rengCb, 3)} · ${rengTextoDecimales(rengVeq / 1000, 4)} = ${rengTextoNumero((rengCb * rengVeq) / 1000, 4)} mol`, `C(HCl) = ${rengTextoNumero((rengCb * rengVeq) / 1000, 4)} mol / ${rengTextoDecimales(rengVa / 1000, 4)} L = ${rengTextoNumero(rengCa, 4)} mol/L`],
        errorFrecuente: 'Usar como volumen de equivalencia el último volumen de la tabla en lugar del punto de mayor pendiente.'
      }
    }
    return {
      ...rengComun,
      titulo: 'Volumen en el punto de equivalencia',
      enunciado: `Se valoran ${rengDatos[0]!.texto} de HCl de concentración desconocida con NaOH de ${rengDatos[1]!.texto}. La gráfica y la tabla recogen el pH medido (datos didácticos, 25 °C).`,
      pregunta: '¿Qué volumen de NaOH hay en el punto de equivalencia, en mL?',
      datos: rengDatos,
      grafica: rengGraficaPh(rengPuntos),
      respuesta: rengNumero(rengVeq, 'mL', { tolAbs: 0.3, tolRel: 0 }),
      pistas: ['En el punto de equivalencia el pH cambia de forma brusca con muy poco volumen.', 'Busca, entre filas consecutivas, el intervalo donde el pH sube más.', 'El volumen de equivalencia es el punto medio de ese intervalo.'],
      pasos: [`Mayor salto de pH: entre ${rengTextoDecimales(rengVeq - 0.5, 1)} mL (pH ${rengTextoDecimales(rengPuntos.find((rengP) => rengP.v === rengVeq - 0.5)!.ph, 2)}) y ${rengTextoDecimales(rengVeq + 0.5, 1)} mL (pH ${rengTextoDecimales(rengPuntos.find((rengP) => rengP.v === rengVeq + 0.5)!.ph, 2)}).`, `Punto medio: ${rengTextoDecimales(rengVeq, 1)} mL.`],
      errorFrecuente: 'Confundir el equivalente con el último punto medido o con el volumen donde el pH es 7 en la tabla (puede no haber una fila exacta).'
    }
  }
}

const rengRecta = (rengC: number[], rengA: number[]): { m: number; b: number; res: number[]; s: number } => {
  const rengR = rengRegresionLineal(rengC, rengA)
  return { m: rengR.m, b: rengR.b, res: rengC.map((rengX, rengI) => rengA[rengI]! - (rengR.b + rengR.m * rengX)), s: rengR.sr }
}

export const RENG_VARIANTES_INTERPOLAR: readonly RengVariante[] = [
  { id: 'interpolar.dentro-intervalo', nivel: 'quimico' },
  { id: 'interpolar.sobre-intervalo', nivel: 'quimico' },
  { id: 'interpolar.saturacion', nivel: 'cientifico' },
  { id: 'interpolar.bajo-patron-minimo', nivel: 'cientifico' }
]

const RENG_OPCIONES_INTERPOLAR = {
  dentro: 'Sí: la señal está dentro del intervalo de los patrones y se puede interpolar',
  sobre: 'No: la señal supera la del patrón más alto; hay que diluir la muestra y repetir',
  bajo: 'No: la señal queda por debajo del patrón más bajo; no hay datos que respalden la recta ahí',
  extrapolar: 'Sí, extrapolando: la recta es válida en cualquier punto'
}

const rengMetodoInterpolar = (rengCorrecta: string, rengOtras: string[], rengExplicacion: string, rengAzar: () => number): RengMetodo => {
  const rengTodas = rengMezclar(rengAzar, [rengCorrecta, ...rengOtras])
  const rengOpc = rengTodas.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
  return { pregunta: '¿Qué evidencia usas para decidir?', opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrecta)!.id, explicacion: rengExplicacion }
}

export const RENG_FAMILIA_INTERPOLAR_CALIBRACION: RengFamilia = {
  id: 'analitica.interpolar-calibracion',
  rama: 'analitica',
  tema: 'calibracion',
  nombre: 'Decidir si una lectura se puede interpolar',
  descripcion: 'Comparar la señal de una muestra con el intervalo de la calibración y justificar la decisión con los datos.',
  niveles: ['quimico', 'cientifico'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = rengVarianteDeSemilla(RENG_VARIANTES_INTERPOLAR, nivel, semilla)
    if (!rengVar) return null
    const rengPendiente = rengEntre(azar, 0.06, 0.12, 0.005)
    const rengOrdenada = rengEntre(azar, 0.001, 0.004, 0.001)
    const rengRuido = (): number => (azar() - 0.5) * 0.006
    const rengFila = (rengC: number[], rengA: number[], rengRes?: number[]): RengGraficaEjercicio['tabla'] => ({ columnas: rengRes ? ['Concentración (mg/L)', 'Absorbancia', 'Residuo de la recta (absorbancia)'] : ['Concentración (mg/L)', 'Absorbancia'], filas: rengC.map((rengX, rengI) => (rengRes ? [rengTextoDecimales(rengX, 1), rengTextoDecimales(rengA[rengI]!, 3), rengTextoDecimales(rengRes[rengI]!, 3)] : [rengTextoDecimales(rengX, 1), rengTextoDecimales(rengA[rengI]!, 3)])) })
    const rengComun = { variante: rengVar.id, fuente: RENG_FUENTE_DIDACTICA }
    if (rengVar.id === 'interpolar.saturacion') {
      const rengC = [0, 2, 4, 6, 8, 10]
      const rengA = rengC.map((rengX, rengI) => {
        const rengLinea = rengPendiente * rengX + rengOrdenada
        return rengI === rengC.length - 1 ? rengLinea * rengElegir(azar, [0.88, 0.9, 0.92]) : rengLinea + rengRuido()
      })
      const rengTodos = rengRecta(rengC, rengA)
      const rengSin = rengRecta(rengC.slice(0, -1), rengA.slice(0, -1))
      const rengDesvio = rengA.at(-1)! - (rengSin.b + rengSin.m * rengC.at(-1)!)
      if (Math.abs(rengDesvio) < 6 * Math.max(rengSin.s, 0.0005)) return null
      const rengGrafica: RengGraficaEjercicio = {
        titulo: 'Calibración y recta con todos los patrones',
        tituloX: 'Concentración (mg/L)',
        tituloY: 'Absorbancia',
        descripcion: 'Puntos de calibración de absorbancia frente a concentración y recta ajustada con todos los patrones; el punto de mayor concentración queda por debajo de la recta.',
        series: [{ nombre: 'Patrones', puntos: rengC.map((rengX, rengI) => [rengX, rengA[rengI]!] as [number, number]), marcador: 'circulo', linea: false }, { nombre: 'Recta con los 6 patrones', puntos: [[0, rengTodos.b], [10, rengTodos.b + rengTodos.m * 10]], marcador: 'rombo', linea: true, discontinua: true }],
        tabla: rengFila(rengC, rengA, rengTodos.res)
      }
      return {
        ...rengComun,
        titulo: 'Hasta dónde es lineal la calibración',
        enunciado: 'Se prepara una calibración de absorbancia con seis patrones (datos didácticos, no medidos). Se ajustó una recta con todos los puntos; la tabla da los residuos de ese ajuste y la gráfica muestra los puntos y la recta.',
        pregunta: '¿Cuál es la mayor concentración de patrón (en mg/L) hasta la que la respuesta es razonablemente lineal?',
        datos: [],
        grafica: rengGrafica,
        respuesta: rengNumero(8, 'mg/L', { tolAbs: 0.01, tolRel: 0 }),
        metodo: rengMetodoInterpolar('El residuo del último patrón es grande y negativo, mientras que sin él los residuos son pequeños y sin patrón', ['El R² de la recta con todos los puntos es mayor que 0,99', 'La pendiente es positiva', 'El blanco da absorbancia casi nula'], 'Un R² alto no demuestra linealidad: hay que mirar los residuos. Un punto que se aparta de forma sistemática en un extremo indica pérdida de linealidad (saturación).', azar),
        criterioCompleto: 'Cuenta como respuesta completa: la concentración límite del intervalo lineal y la evidencia en los residuos.',
        hipotesis: ['Los patrones se prepararon sin errores de dilución.', 'La pérdida de linealidad es una propiedad del método a alta concentración, no un error de un solo punto.'],
        pistas: ['Mira la columna de residuos: ¿hay algún punto con un residuo claramente mayor que los demás?', 'Los residuos de un buen ajuste son pequeños y de signo variable, sin patrón.', 'Repite mentalmente el ajuste sin el punto que se aparta: el resto quedará alineado.'],
        pasos: [`Residuos con 6 patrones: ${rengTodos.res.map((rengX) => rengTextoDecimales(rengX, 3)).join('; ')}.`, `El residuo del patrón de ${rengTextoDecimales(10, 1)} mg/L destaca; sin él los 5 restantes tienen s = ${rengTextoDecimales(rengSin.s, 4)}.`, 'El último patrón válido es el de 8,0 mg/L.'],
        comprobacion: 'Con los cinco primeros patrones el residuo del sexto debe seguir siendo grande: eso confirma que se sale de la recta.',
        errorFrecuente: 'Aceptar toda la tabla porque el R² es alto, sin revisar los residuos.'
      }
    }
    const rengC = rengVar.id === 'interpolar.bajo-patron-minimo' ? [1, 2, 4, 6, 8] : [0, 2, 4, 6, 8]
    const rengA = rengC.map((rengX) => rengPendiente * rengX + rengOrdenada + rengRuido())
    const rengCal = rengRecta(rengC, rengA)
    const rengCmin = rengC[0]!
    const rengAmin = rengA[0]!
    const rengAmax = rengA.at(-1)!
    let rengMuestra: number
    let rengDecision: keyof typeof RENG_OPCIONES_INTERPOLAR
    let rengExplicacionMetodo: string
    let rengMetodoCorrecto: string
    if (rengVar.id === 'interpolar.dentro-intervalo') {
      rengMuestra = rengPendiente * rengEntre(azar, 1.2, 6.8, 0.1) + rengOrdenada
      rengDecision = 'dentro'
      rengMetodoCorrecto = `La absorbancia de la muestra (${rengTextoDecimales(rengMuestra, 3)}) está entre las de los patrones (${rengTextoDecimales(rengAmin, 3)} y ${rengTextoDecimales(rengAmax, 3)})`
      rengExplicacionMetodo = 'Se puede interpolar cuando la señal queda entre las del patrón más bajo y más alto: los datos respaldan la recta en ese tramo.'
    } else if (rengVar.id === 'interpolar.sobre-intervalo') {
      rengMuestra = rengAmax * rengElegir(azar, [1.25, 1.35, 1.5])
      rengDecision = 'sobre'
      rengMetodoCorrecto = `La absorbancia de la muestra (${rengTextoDecimales(rengMuestra, 3)}) supera la del patrón más alto (${rengTextoDecimales(rengAmax, 3)})`
      rengExplicacionMetodo = 'Por encima del patrón más alto no hay datos que demuestren que la respuesta siga siendo lineal: se diluye la muestra para que caiga dentro del intervalo.'
    } else {
      rengMuestra = rengAmin * 0.4
      rengDecision = 'bajo'
      rengMetodoCorrecto = `La absorbancia de la muestra (${rengTextoDecimales(rengMuestra, 3)}) es menor que la del patrón más bajo (${rengTextoDecimales(rengAmin, 3)})`
      rengExplicacionMetodo = 'Por debajo del patrón más bajo no hay datos de calibración: la recta no está respaldada ahí y la señal puede confundirse con el ruido.'
    }
    const rengConcentracionVerdadera = (rengMuestra - rengCal.b) / rengCal.m
    const rengTextosOpc = [RENG_OPCIONES_INTERPOLAR.dentro, RENG_OPCIONES_INTERPOLAR.sobre, RENG_OPCIONES_INTERPOLAR.bajo, RENG_OPCIONES_INTERPOLAR.extrapolar]
    const rengOpc = rengMezclar(azar, rengTextosOpc).map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
    return {
      ...rengComun,
      titulo: 'Interpolar o no interpolar',
      enunciado: `Una calibración de absorbancia usa los patrones de la tabla (datos didácticos, no medidos). Una muestra da una absorbancia de ${rengTextoDecimales(rengMuestra, 3)}.`,
      pregunta: '¿Se puede calcular la concentración de la muestra interpolando en esta calibración?',
      datos: [rengDatoD('A', 'Absorbancia de la muestra', rengMuestra, '', 3)],
      grafica: {
        titulo: 'Curva de calibración',
        tituloX: 'Concentración (mg/L)',
        tituloY: 'Absorbancia',
        descripcion: 'Puntos de calibración de absorbancia frente a concentración, con la recta de ajuste y la absorbancia de la muestra marcada.',
        series: [{ nombre: 'Patrones', puntos: rengC.map((rengX, rengI) => [rengX, rengA[rengI]!] as [number, number]), marcador: 'circulo', linea: false }, { nombre: 'Recta de calibración', puntos: [[rengCmin, rengCal.b + rengCal.m * rengCmin], [rengC.at(-1)!, rengCal.b + rengCal.m * rengC.at(-1)!]], marcador: 'rombo', linea: true, discontinua: true }],
        marcas: [],
        tabla: rengFila(rengC, rengA)
      },
      respuesta: { tipo: 'opcion', opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === RENG_OPCIONES_INTERPOLAR[rengDecision])!.id },
      metodo: rengMetodoInterpolar(rengMetodoCorrecto, [`La absorbancia de la muestra (${rengTextoDecimales(rengMuestra, 3)}) está entre las de los patrones (${rengTextoDecimales(rengAmin, 3)} y ${rengTextoDecimales(rengAmax, 3)})`, `La absorbancia de la muestra (${rengTextoDecimales(rengMuestra, 3)}) supera la del patrón más alto (${rengTextoDecimales(rengAmax, 3)})`, `La absorbancia de la muestra (${rengTextoDecimales(rengMuestra, 3)}) es menor que la del patrón más bajo (${rengTextoDecimales(rengAmin, 3)})`, 'El R² de la recta es mayor que 0,99'].filter((rengT) => rengT !== rengMetodoCorrecto).slice(0, 3), rengExplicacionMetodo, azar),
      criterioCompleto: 'Cuenta como respuesta completa: la decisión correcta y la evidencia (comparación con el intervalo de los patrones).',
      hipotesis: ['La respuesta del método es lineal en el intervalo de los patrones.', 'La recta de calibración es la misma para patrones y muestra.'],
      pistas: ['Compara la absorbancia de la muestra con la menor y la mayor de los patrones.', 'Interpolar solo está respaldado dentro de ese intervalo.', `La recta daría ${rengTextoNumero(rengConcentracionVerdadera, 3)} mg/L, pero eso solo vale si la señal está dentro de la calibración.`],
      pasos: [`Intervalo de patrones: ${rengTextoDecimales(rengAmin, 3)} a ${rengTextoDecimales(rengAmax, 3)} (absorbancia).`, `Muestra: ${rengTextoDecimales(rengMuestra, 3)}.`, RENG_OPCIONES_INTERPOLAR[rengDecision] + '.'],
      comprobacion: 'Si la señal cae fuera del intervalo, el valor que da la recta es una extrapolación y no un resultado respaldado.',
      errorFrecuente: 'Dar la concentración que sale de la ecuación de la recta aunque la señal esté fuera de los patrones.'
    }
  }
}

export const RENG_FAMILIAS_RAZONAMIENTO_ANALITICA: readonly RengFamilia[] = [RENG_FAMILIA_CURVA_EQUIVALENCIA, RENG_FAMILIA_INTERPOLAR_CALIBRACION]
