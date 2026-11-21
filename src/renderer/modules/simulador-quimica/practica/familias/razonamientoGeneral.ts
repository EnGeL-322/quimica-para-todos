import { rengBonita, rengMasaMolarDe } from '../../nucleo/formula'
import { rengElegir, rengEntre, rengTextoDecimales, rengTextoNumero } from '../numeros'
import type { RengBaseEjercicio, RengDatoEjercicio, RengFamilia, RengMetodo } from '../tipos'
import { RENG_COMPUESTOS } from '../bancos'
import { rengDatoD, rengMapaDatos, rengMezclar, rengNumero, RENG_FUENTE_DIDACTICA, RENG_FUENTE_MASAS, rengTexto, rengVarianteDeSemilla, type RengVariante } from './util'

const rengMetodoUnidades = (rengCorrecta: string, rengOtras: string[], rengExplicacion: string, rengAzar: () => number): RengMetodo => {
  const rengTodas = rengMezclar(rengAzar, [rengCorrecta, ...rengOtras])
  const rengOpc = rengTodas.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
  return { pregunta: '¿Qué error de unidades hay en el cálculo?', opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrecta)!.id, explicacion: rengExplicacion }
}

export const RENG_VARIANTES_UNIDADES: readonly RengVariante[] = [
  { id: 'unidades.masa-mg-como-g', nivel: 'preuniversitario' },
  { id: 'unidades.volumen-ml-como-l', nivel: 'preuniversitario' },
  { id: 'unidades.conc-mmol-como-mol', nivel: 'universitario' },
  { id: 'unidades.alicuota-ul-como-ml', nivel: 'universitario' }
]

const RENG_ERRORES_UNIDADES = {
  masa: 'La masa está en mg y se usó el número como si fueran gramos',
  volumen: 'El volumen está en mL y se usó el número como si fueran litros',
  concentracion: 'La concentración está en mmol/L y se escribió el resultado como mol/L',
  alicuota: 'La alícuota está en µL y se usó el número como si fueran mL',
  masaMolar: 'La masa molar está en kg/mol en vez de g/mol',
  tiempo: 'El tiempo está en minutos y se usó como si fueran segundos'
}

export const RENG_FAMILIA_UNIDADES: RengFamilia = {
  id: 'general.unidades-preparacion',
  rama: 'general',
  tema: 'concentracion',
  nombre: 'Error de unidades en una preparación',
  descripcion: 'Diagnosticar en qué paso de una preparación o dilución se mezclaron unidades y corregir la concentración.',
  niveles: ['preuniversitario', 'universitario'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = rengVarianteDeSemilla(RENG_VARIANTES_UNIDADES, nivel, semilla)
    if (!rengVar) return null
    const rengC = rengElegir(azar, RENG_COMPUESTOS.filter((rengX) => ['NaCl', 'C6H12O6', 'NaOH', 'CaCO3'].includes(rengX.f)))
    const rengM = Number(rengMasaMolarDe(rengC.f).toFixed(2))
    const rengFormula = rengBonita(rengC.f)
    const rengCorregir = 'Pasa cada dato a la unidad que pide la fórmula (g, L, mol/L) antes de operar y escribe la unidad en cada línea.'
    if (rengVar.id === 'unidades.masa-mg-como-g') {
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('m', 'Masa pesada', rengEntre(azar, 200, 900, 10), 'mg', 0), rengDatoD('V', 'Volumen del matraz aforado', rengEntre(azar, 100, 500, 50), 'mL', 0), rengDatoD('M', `Masa molar de ${rengFormula}`, rengM, 'g/mol', 2)]
      const rengD = rengMapaDatos(rengDatos)
      const rengCorrecta = rengD['m']! / 1000 / rengD['M']! / (rengD['V']! / 1000)
      const rengMala = rengD['m']! / rengD['M']! / (rengD['V']! / 1000)
      return {
        variante: rengVar.id,
        titulo: 'Revisar la unidad de la masa',
        enunciado: `En un cuaderno de laboratorio se lee: «Se pesaron ${rengTexto(rengDatos, 'm')} de ${rengC.n} (${rengFormula}) y se enrasó a ${rengTexto(rengDatos, 'V')}. Masa molar: ${rengTexto(rengDatos, 'M')}. Cálculo: n = ${rengTextoDecimales(rengD['m']!, 0)} / ${rengTextoDecimales(rengD['M']!, 2)} = ${rengTextoNumero(rengD['m']! / rengD['M']!, 3)} mol; C = ${rengTextoNumero(rengD['m']! / rengD['M']!, 3)} mol / ${rengTextoDecimales(rengD['V']! / 1000, 3)} L = ${rengTextoNumero(rengMala, 3)} mol/L». El resultado parece demasiado alto para esa cantidad de sólido.`,
        pregunta: '¿Qué concentración tiene realmente la disolución, en mol/L?',
        datos: rengDatos,
        respuesta: rengNumero(rengCorrecta, 'mol/L', { tolRel: 0.015, errores: [{ valor: rengMala, mensaje: 'Es el valor del cuaderno: los miligramos se dividieron entre la masa molar como si fueran gramos (error de un factor 1000).' }] }),
        metodo: rengMetodoUnidades(RENG_ERRORES_UNIDADES.masa, [RENG_ERRORES_UNIDADES.volumen, RENG_ERRORES_UNIDADES.masaMolar, RENG_ERRORES_UNIDADES.concentracion], 'La masa se pesó en mg: hay que pasarla a g (÷ 1000) antes de dividir entre g/mol.', azar),
        criterioCompleto: 'Cuenta como respuesta completa: la concentración correcta en mol/L y la identificación del error de unidades.',
        pistas: ['Escribe cada dato con su unidad y busca cuál no coincide con la unidad que pide la fórmula n = m / M.', 'La masa se midió en miligramos, pero la masa molar está en gramos por mol.', `Pasa ${rengTexto(rengDatos, 'm')} a gramos (÷ 1000), calcula n = m / M y divide entre el volumen en litros.`],
        pasos: [`m = ${rengTextoDecimales(rengD['m']! / 1000, 3)} g (de ${rengTexto(rengDatos, 'm')})`, `n = m / M = ${rengTextoNumero(rengD['m']! / 1000 / rengD['M']!, 4)} mol`, `V = ${rengTextoDecimales(rengD['V']! / 1000, 3)} L; C = n / V = ${rengTextoNumero(rengCorrecta, 4)} mol/L`],
        errorFrecuente: 'Dividir los miligramos entre la masa molar en g/mol sin convertir: el resultado sale mil veces mayor.',
        fuente: RENG_FUENTE_MASAS
      }
    }
    if (rengVar.id === 'unidades.volumen-ml-como-l') {
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('m', 'Masa pesada', rengEntre(azar, 2, 20, 0.5), 'g', 1), rengDatoD('V', 'Volumen final de la disolución', rengEntre(azar, 100, 500, 50), 'mL', 0), rengDatoD('M', `Masa molar de ${rengFormula}`, rengM, 'g/mol', 2)]
      const rengD = rengMapaDatos(rengDatos)
      const rengCorrecta = rengD['m']! / rengD['M']! / (rengD['V']! / 1000)
      const rengMala = rengD['m']! / rengD['M']! / rengD['V']!
      return {
        variante: rengVar.id,
        titulo: 'Revisar la unidad del volumen',
        enunciado: `Un compañero prepara una disolución con ${rengTexto(rengDatos, 'm')} de ${rengC.n} (${rengFormula}) y ${rengTexto(rengDatos, 'V')} de volumen final. Masa molar: ${rengTexto(rengDatos, 'M')}. Anota: «C = (${rengTextoDecimales(rengD['m']!, 1)} / ${rengTextoDecimales(rengD['M']!, 2)}) / ${rengTextoDecimales(rengD['V']!, 0)} = ${rengTextoNumero(rengMala, 3)} mol/L». Esa concentración es muy baja para esa cantidad de sólido.`,
        pregunta: '¿Qué concentración tiene la disolución, en mol/L?',
        datos: rengDatos,
        respuesta: rengNumero(rengCorrecta, 'mol/L', { tolRel: 0.015, errores: [{ valor: rengMala, mensaje: 'Es el valor anotado: el volumen en mL se usó como si fueran litros (error de un factor 1000).' }] }),
        metodo: rengMetodoUnidades(RENG_ERRORES_UNIDADES.volumen, [RENG_ERRORES_UNIDADES.masa, RENG_ERRORES_UNIDADES.masaMolar, RENG_ERRORES_UNIDADES.concentracion], 'La molaridad usa litros de disolución: 1 L = 1000 mL.', azar),
        criterioCompleto: 'Cuenta como respuesta completa: la concentración correcta en mol/L y la identificación del error de unidades.',
        pistas: ['La molaridad es mol por litro: comprueba la unidad del volumen que se usó al dividir.', `El volumen está en mL; en la fórmula C = n / V el volumen va en litros.`, `Calcula n = ${rengTexto(rengDatos, 'm')} / ${rengTexto(rengDatos, 'M')} y divide entre ${rengTextoDecimales(rengD['V']! / 1000, 3)} L.`],
        pasos: [`n = m / M = ${rengTextoNumero(rengD['m']! / rengD['M']!, 4)} mol`, `V = ${rengTextoDecimales(rengD['V']! / 1000, 3)} L (de ${rengTexto(rengDatos, 'V')})`, `C = n / V = ${rengTextoNumero(rengCorrecta, 4)} mol/L`],
        errorFrecuente: 'Usar el número de mL como si fueran litros: la concentración sale mil veces menor.',
        fuente: RENG_FUENTE_MASAS
      }
    }
    if (rengVar.id === 'unidades.conc-mmol-como-mol') {
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('C1', 'Concentración de la disolución madre', rengEntre(azar, 20, 90, 5), 'mmol/L', 0), rengDatoD('V1', 'Alícuota', rengEntre(azar, 5, 25, 5), 'mL', 0), rengDatoD('V2', 'Volumen final', rengEntre(azar, 50, 250, 50), 'mL', 0)]
      const rengD = rengMapaDatos(rengDatos)
      if (rengD['V2']! <= rengD['V1']!) return null
      const rengCorrecta = ((rengD['C1']! / 1000) * rengD['V1']!) / rengD['V2']!
      const rengMala = (rengD['C1']! * rengD['V1']!) / rengD['V2']!
      return {
        variante: rengVar.id,
        titulo: 'Revisar la unidad de la concentración',
        enunciado: `Se diluye una disolución madre de ${rengTexto(rengDatos, 'C1')} tomando una alícuota de ${rengTexto(rengDatos, 'V1')} y completando hasta ${rengTexto(rengDatos, 'V2')}. El cuaderno dice: «C₂ = C₁·V₁ / V₂ = ${rengTextoDecimales(rengD['C1']!, 0)} · ${rengTextoDecimales(rengD['V1']!, 0)} / ${rengTextoDecimales(rengD['V2']!, 0)} = ${rengTextoNumero(rengMala, 3)} mol/L». Tal concentración sería mayor que la de la madre convertida.`,
        pregunta: '¿Cuál es la concentración de la disolución diluida, en mol/L?',
        datos: rengDatos,
        respuesta: rengNumero(rengCorrecta, 'mol/L', { tolRel: 0.012, errores: [{ valor: rengMala, mensaje: 'Es el valor del cuaderno: se trató la concentración en mmol/L como si estuviera en mol/L.' }] }),
        metodo: rengMetodoUnidades(RENG_ERRORES_UNIDADES.concentracion, [RENG_ERRORES_UNIDADES.volumen, RENG_ERRORES_UNIDADES.masa, RENG_ERRORES_UNIDADES.alicuota], 'La unidad de salida es la de C₁: si C₁ está en mmol/L, el resultado de C₁V₁/V₂ está en mmol/L; para mol/L hay que dividir entre 1000.', azar),
        criterioCompleto: 'Cuenta como respuesta completa: la concentración correcta en mol/L y la identificación del error de unidades.',
        pistas: ['Al diluir, la unidad de C₂ es la de C₁ (los volúmenes se cancelan).', 'C₁ está en mmol/L, no en mol/L: el resultado también saldrá en mmol/L.', `Calcula C₂ en mmol/L y divide entre 1000 para pasar a mol/L.`],
        pasos: [`C₂ = C₁·V₁ / V₂ = ${rengTextoNumero(rengMala, 4)} mmol/L`, `C₂ = ${rengTextoNumero(rengMala, 4)} mmol/L ÷ 1000 = ${rengTextoNumero(rengCorrecta, 4)} mol/L`],
        errorFrecuente: 'Escribir mol/L donde la unidad real es mmol/L: el valor se multiplica por mil.',
        fuente: RENG_FUENTE_DIDACTICA
      }
    }
    const rengDatos: RengDatoEjercicio[] = [rengDatoD('C1', 'Concentración de la disolución madre', rengEntre(azar, 0.2, 0.8, 0.05), 'mol/L', 2), rengDatoD('V1', 'Alícuota tomada con micropipeta', rengEntre(azar, 100, 500, 50), 'µL', 0), rengDatoD('V2', 'Volumen final', rengEntre(azar, 5, 25, 5), 'mL', 0)]
    const rengD = rengMapaDatos(rengDatos)
    const rengCorrecta = (rengD['C1']! * (rengD['V1']! / 1000)) / rengD['V2']!
    const rengMala = (rengD['C1']! * rengD['V1']!) / rengD['V2']!
    return {
      variante: rengVar.id,
      titulo: 'Revisar la unidad de la alícuota',
      enunciado: `Con una micropipeta se toman ${rengTexto(rengDatos, 'V1')} de una disolución ${rengTexto(rengDatos, 'C1')} y se llevan a ${rengTexto(rengDatos, 'V2')}. Un compañero calcula: «C₂ = ${rengTextoDecimales(rengD['C1']!, 2)} · ${rengTextoDecimales(rengD['V1']!, 0)} / ${rengTextoDecimales(rengD['V2']!, 0)} = ${rengTextoNumero(rengMala, 3)} mol/L». El resultado es mayor que la disolución madre, lo que no puede ocurrir al diluir.`,
      pregunta: '¿Cuál es la concentración de la disolución diluida, en mol/L?',
      datos: rengDatos,
      respuesta: rengNumero(rengCorrecta, 'mol/L', { tolRel: 0.012, errores: [{ valor: rengMala, mensaje: 'Es el valor del compañero: la alícuota en µL se usó como si fueran mL.' }] }),
      metodo: rengMetodoUnidades(RENG_ERRORES_UNIDADES.alicuota, [RENG_ERRORES_UNIDADES.concentracion, RENG_ERRORES_UNIDADES.masa, RENG_ERRORES_UNIDADES.volumen], 'V₁ y V₂ deben estar en la misma unidad: 1 mL = 1000 µL.', azar),
      criterioCompleto: 'Cuenta como respuesta completa: la concentración correcta en mol/L y la identificación del error de unidades.',
      pistas: ['Al diluir, la concentración final siempre es menor que la inicial: el resultado del compañero no lo cumple.', 'V₁ está en microlitros y V₂ en mililitros: no están en la misma unidad.', `Pasa V₁ a mL (÷ 1000) antes de aplicar C₂ = C₁·V₁ / V₂.`],
      pasos: [`V₁ = ${rengTextoDecimales(rengD['V1']! / 1000, 3)} mL (de ${rengTexto(rengDatos, 'V1')})`, `C₂ = C₁·V₁ / V₂ = ${rengTextoDecimales(rengD['C1']!, 2)} · ${rengTextoDecimales(rengD['V1']! / 1000, 3)} / ${rengTextoDecimales(rengD['V2']!, 0)} = ${rengTextoNumero(rengCorrecta, 4)} mol/L`],
      errorFrecuente: 'Mezclar µL con mL en C₁V₁ = C₂V₂: basta pasar una de las dos para que ambas coincidan.',
      fuente: RENG_FUENTE_DIDACTICA
    }
  }
}

interface RengReaccionTabla {
  reactivos: Array<{ f: string; coef: number }>
  producto: string
}

const RENG_REACCIONES_TABLA: readonly RengReaccionTabla[] = [
  { reactivos: [{ f: 'N2', coef: 1 }, { f: 'H2', coef: 3 }], producto: '2 NH3' },
  { reactivos: [{ f: 'H2', coef: 2 }, { f: 'O2', coef: 1 }], producto: '2 H2O' },
  { reactivos: [{ f: 'Mg', coef: 2 }, { f: 'O2', coef: 1 }], producto: '2 MgO' },
  { reactivos: [{ f: 'Na', coef: 2 }, { f: 'Cl2', coef: 1 }], producto: '2 NaCl' }
]

const rengEcuacionTabla = (rengR: RengReaccionTabla): string => `${rengR.reactivos.map((rengX) => `${rengX.coef === 1 ? '' : `${rengX.coef} `}${rengBonita(rengX.f)}`).join(' + ')} → ${rengBonita(rengR.producto)}`

const rengOpcionesLimitante = (rengFormulas: string[], rengLim: number): { opciones: Array<{ id: string; texto: string }>; correcta: string } => {
  const rengOpc = rengFormulas.map((rengF, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengBonita(rengF) }))
  return { opciones: rengOpc, correcta: rengOpc[rengLim]!.id }
}

export const RENG_VARIANTES_LIMITANTE: readonly RengVariante[] = [
  { id: 'limitante.tabla-moles', nivel: 'universitario' },
  { id: 'limitante.diagrama-particulas', nivel: 'universitario' },
  { id: 'limitante.tabla-masas-sobrante', nivel: 'quimico' },
  { id: 'limitante.disoluciones-sobrante', nivel: 'quimico' }
]

const rengMetodoSobra = (rengVariante: string, rengExplicacionEspecifica: string, rengAzar: () => number): RengMetodo => {
  const rengCorrecta = rengVariante === 'limitante.tabla-masas-sobrante' ? 'Paso las masas a moles, divido cada cantidad entre su coeficiente y comparo: el menor cociente es el limitante, consume una parte del otro reactivo y el resto sobra' : 'Divido la cantidad de cada reactivo entre su coeficiente y comparo: el menor cociente es el limitante y del otro reactivo sobra lo que no se consume'
  const rengTodas = rengMezclar(rengAzar, [rengCorrecta, 'El reactivo con menos cantidad en la tabla, sin dividir entre el coeficiente, es el limitante', 'El reactivo con mayor coeficiente en la ecuación es siempre el limitante', 'El reactivo con mayor masa molar es siempre el limitante'])
  const rengOpc = rengTodas.map((rengT, rengI) => ({ id: String.fromCharCode(97 + rengI), texto: rengT }))
  return { pregunta: '¿Con qué criterio decides cuál es el limitante y por qué sobra el otro?', opciones: rengOpc, correcta: rengOpc.find((rengO) => rengO.texto === rengCorrecta)!.id, explicacion: `${rengExplicacionEspecifica} El reactivo limitante es el que se agota primero: se compara lo que hay con lo que exige la ecuación (cantidad ÷ coeficiente), no la cantidad bruta.` }
}

export const RENG_FAMILIA_LIMITANTE_TABLA: RengFamilia = {
  id: 'general.limitante-tabla',
  rama: 'general',
  tema: 'estequiometria',
  nombre: 'Reactivo limitante a partir de una tabla',
  descripcion: 'Leer una tabla de cantidades, decidir el reactivo limitante y justificar por qué sobra el otro.',
  niveles: ['universitario', 'quimico'],
  generar: ({ azar, nivel, semilla }): RengBaseEjercicio | null => {
    const rengVar = rengVarianteDeSemilla(RENG_VARIANTES_LIMITANTE, nivel, semilla)
    if (!rengVar) return null
    const rengReaccion = rengElegir(azar, RENG_REACCIONES_TABLA)
    const [rengA, rengB] = rengReaccion.reactivos as [{ f: string; coef: number }, { f: string; coef: number }]
    const rengExtensionA = rengEntre(azar, 0.5, 3, 0.1)
    const rengFactor = [0.55, 0.65, 0.75, 1.3, 1.5, 1.7][Math.floor(azar() * 6)]!
    const rengExtensionB = Number((rengExtensionA * rengFactor).toFixed(2))
    const rengEc = rengEcuacionTabla(rengReaccion)
    const rengComun: Pick<RengBaseEjercicio, 'fuente' | 'variante'> = { fuente: RENG_FUENTE_DIDACTICA, variante: rengVar.id }
    if (rengVar.id === 'limitante.diagrama-particulas') {
      const rengCuentaA = Math.max(2, Math.round(rengExtensionA * 4) * rengA.coef)
      const rengCuentaB = Math.max(2, Math.round(rengExtensionB * 4) * rengB.coef)
      const rengExtA = rengCuentaA / rengA.coef
      const rengExtB = rengCuentaB / rengB.coef
      if (rengExtA === rengExtB) return null
      const rengLim = rengExtA < rengExtB ? 0 : 1
      const rengExc = 1 - rengLim
      const rengLimR = rengReaccion.reactivos[rengLim]!
      const rengExcR = rengReaccion.reactivos[rengExc]!
      const rengCuentas = [rengCuentaA, rengCuentaB]
      const rengExt = Math.min(rengExtA, rengExtB)
      const rengConsumido = rengExt * rengExcR.coef
      const rengSobra = rengCuentas[rengExc]! - rengConsumido
      const rengOp = rengOpcionesLimitante([rengA.f, rengB.f], rengLim)
      return {
        ...rengComun,
        titulo: 'Limitante en un diagrama de partículas',
        enunciado: `Un diagrama de partículas representa la mezcla inicial para la reacción ${rengEc}: se dibujan ${rengCuentaA} partículas de ${rengBonita(rengA.f)} y ${rengCuentaB} partículas de ${rengBonita(rengB.f)}. La tabla recoge el recuento equivalente del diagrama.`,
        pregunta: '¿Cuál es el reactivo limitante?',
        datos: [],
        tabla: { columnas: ['Reactivo', 'Partículas dibujadas', 'Coeficiente en la ecuación'], filas: [[rengBonita(rengA.f), rengCuentaA, rengA.coef], [rengBonita(rengB.f), rengCuentaB, rengB.coef]] },
        respuesta: { tipo: 'opcion', ...rengOp },
        metodo: rengMetodoSobra(rengVar.id, `Con las ${rengCuentas[rengLim]} partículas de ${rengBonita(rengLimR.f)} solo reaccionan ${rengConsumido} de ${rengBonita(rengExcR.f)}; hay ${rengCuentas[rengExc]}, así que sobran ${rengSobra}.`, azar),
        criterioCompleto: 'Cuenta como respuesta completa: el reactivo limitante correcto y la justificación de por qué sobra el otro.',
        pistas: ['Compara cuántas veces cabe la proporción de la ecuación en cada reactivo.', `Divide el recuento de cada reactivo entre su coeficiente (${rengA.coef} y ${rengB.coef}).`, 'El reactivo con el cociente menor es el que se agota primero.'],
        pasos: [`${rengBonita(rengA.f)}: ${rengCuentaA} / ${rengA.coef} = ${rengTextoNumero(rengExtA, 3)}`, `${rengBonita(rengB.f)}: ${rengCuentaB} / ${rengB.coef} = ${rengTextoNumero(rengExtB, 3)}`, `El menor cociente es el de ${rengBonita(rengLimR.f)}: es el limitante y sobran ${rengSobra} partículas de ${rengBonita(rengExcR.f)}.`],
        errorFrecuente: 'Elegir como limitante el reactivo con menos partículas sin dividir entre el coeficiente.'
      }
    }
    if (rengVar.id === 'limitante.tabla-moles') {
      const rengNA = Number((rengExtensionA * rengA.coef).toFixed(2))
      const rengNB = Number((rengExtensionB * rengB.coef).toFixed(2))
      const rengExtA = rengNA / rengA.coef
      const rengExtB = rengNB / rengB.coef
      if (Math.abs(rengExtA - rengExtB) / Math.max(rengExtA, rengExtB) < 0.1) return null
      const rengLim = rengExtA < rengExtB ? 0 : 1
      const rengExc = 1 - rengLim
      const rengMoles = [rengNA, rengNB]
      const rengLimR = rengReaccion.reactivos[rengLim]!
      const rengExcR = rengReaccion.reactivos[rengExc]!
      const rengExt = Math.min(rengExtA, rengExtB)
      const rengConsumido = rengExt * rengExcR.coef
      const rengOp = rengOpcionesLimitante([rengA.f, rengB.f], rengLim)
      return {
        ...rengComun,
        titulo: 'Limitante a partir de una tabla de moles',
        enunciado: `Se mezclan los reactivos de la tabla para la reacción ${rengEc}. Las cantidades ya están en moles.`,
        pregunta: '¿Cuál es el reactivo limitante?',
        datos: [],
        tabla: { columnas: ['Reactivo', 'Coeficiente en la ecuación', 'Cantidad disponible (mol)'], filas: [[rengBonita(rengA.f), rengA.coef, rengTextoDecimales(rengNA, 2)], [rengBonita(rengB.f), rengB.coef, rengTextoDecimales(rengNB, 2)]] },
        respuesta: { tipo: 'opcion', ...rengOp },
        metodo: rengMetodoSobra(rengVar.id, `Con ${rengTextoDecimales(rengMoles[rengLim]!, 2)} mol de ${rengBonita(rengLimR.f)} solo se consumen ${rengTextoNumero(rengConsumido, 3)} mol de ${rengBonita(rengExcR.f)}; hay ${rengTextoDecimales(rengMoles[rengExc]!, 2)} mol, así que sobran ${rengTextoNumero(rengMoles[rengExc]! - rengConsumido, 3)} mol.`, azar),
        criterioCompleto: 'Cuenta como respuesta completa: el reactivo limitante correcto y la justificación de por qué sobra el otro.',
        pistas: ['Los coeficientes de la ecuación son proporciones de moles: compara con ellos, no con la cantidad bruta.', `Divide los moles de cada reactivo entre su coeficiente (${rengA.coef} y ${rengB.coef}).`, 'El menor cociente corresponde al reactivo que se agota primero.'],
        pasos: [`${rengBonita(rengA.f)}: ${rengTextoDecimales(rengNA, 2)} / ${rengA.coef} = ${rengTextoNumero(rengExtA, 3)} mol de avance posible`, `${rengBonita(rengB.f)}: ${rengTextoDecimales(rengNB, 2)} / ${rengB.coef} = ${rengTextoNumero(rengExtB, 3)} mol de avance posible`, `Limitante: ${rengBonita(rengLimR.f)} (menor avance posible).`],
        errorFrecuente: 'Declarar limitante al reactivo con menos moles sin tener en cuenta los coeficientes.'
      }
    }
    if (rengVar.id === 'limitante.tabla-masas-sobrante') {
      const rengMA = Number(rengMasaMolarDe(rengA.f).toFixed(2))
      const rengMB = Number(rengMasaMolarDe(rengB.f).toFixed(2))
      const rengNA = Number((rengExtensionA * rengA.coef).toFixed(2))
      const rengNB = Number((rengExtensionB * rengB.coef).toFixed(2))
      const rengMasaA = Number((rengNA * rengMA).toFixed(1))
      const rengMasaB = Number((rengNB * rengMB).toFixed(1))
      const rengExtA = rengMasaA / rengMA / rengA.coef
      const rengExtB = rengMasaB / rengMB / rengB.coef
      if (Math.abs(rengExtA - rengExtB) / Math.max(rengExtA, rengExtB) < 0.1) return null
      const rengLim = rengExtA < rengExtB ? 0 : 1
      const rengExc = 1 - rengLim
      const rengLimR = rengReaccion.reactivos[rengLim]!
      const rengExcR = rengReaccion.reactivos[rengExc]!
      const rengMasas = [rengMasaA, rengMasaB]
      const rengMolares = [rengMA, rengMB]
      const rengExt = Math.min(rengExtA, rengExtB)
      const rengSobrante = rengMasas[rengExc]! - rengExt * rengExcR.coef * rengMolares[rengExc]!
      return {
        ...rengComun,
        fuente: RENG_FUENTE_MASAS,
        titulo: 'Masa que sobra del reactivo en exceso',
        enunciado: `Se mezclan las masas de la tabla para la reacción ${rengEc}. Las masas molares son las de la tabla periódica de la app.`,
        pregunta: `¿Qué masa de ${rengBonita(rengExcR.f)} queda sin reaccionar al agotarse el limitante?`,
        datos: [],
        tabla: { columnas: ['Reactivo', 'Coeficiente', 'Masa (g)', 'Masa molar (g/mol)'], filas: [[rengBonita(rengA.f), rengA.coef, rengTextoDecimales(rengMasaA, 1), rengTextoDecimales(rengMA, 2)], [rengBonita(rengB.f), rengB.coef, rengTextoDecimales(rengMasaB, 1), rengTextoDecimales(rengMB, 2)]] },
        respuesta: rengNumero(rengSobrante, 'g', { tolRel: 0.02, tolAbs: 0.06 }),
        metodo: rengMetodoSobra(rengVar.id, `Con toda la masa de ${rengBonita(rengLimR.f)} solo se consume una parte de ${rengBonita(rengExcR.f)}; la diferencia es lo que sobra.`, azar),
        criterioCompleto: 'Cuenta como respuesta completa: la masa sobrante correcta y la justificación de por qué sobra ese reactivo.',
        hipotesis: ['La reacción es completa y las sustancias son puras.', 'Se usan las masas molares de la tabla periódica de la app.'],
        pistas: ['Pasa las dos masas a moles y divide entre los coeficientes para hallar el limitante.', 'Con el avance del limitante, calcula cuántos moles del otro reactivo se consumen.', 'Resta lo consumido de lo disponible y pasa los moles que sobran a gramos.'],
        pasos: [`${rengBonita(rengA.f)}: ${rengTextoDecimales(rengMasaA, 1)} g / ${rengTextoDecimales(rengMA, 2)} g/mol = ${rengTextoNumero(rengMasaA / rengMA, 4)} mol`, `${rengBonita(rengB.f)}: ${rengTextoDecimales(rengMasaB, 1)} g / ${rengTextoDecimales(rengMB, 2)} g/mol = ${rengTextoNumero(rengMasaB / rengMB, 4)} mol`, `Limitante: ${rengBonita(rengLimR.f)}; avance = ${rengTextoNumero(rengExt, 4)} mol`, `Sobrante de ${rengBonita(rengExcR.f)} = ${rengTextoDecimales(rengMasas[rengExc]!, 1)} − ${rengTextoNumero(rengExt * rengExcR.coef * rengMolares[rengExc]!, 4)} = ${rengTextoNumero(rengSobrante, 4)} g`],
        comprobacion: 'La masa sobrante debe ser positiva y menor que la masa inicial de ese reactivo.',
        errorFrecuente: 'Restar masas de reactivos distintos en lugar de pasar a moles y usar los coeficientes.'
      }
    }
    const rengDatosSol = (rengConc: number, rengVol: number): number => rengConc * (rengVol / 1000)
    const rengCNaOH = rengEntre(azar, 0.2, 1, 0.05)
    const rengVNaOH = rengEntre(azar, 20, 80, 5)
    const rengCAc = rengEntre(azar, 0.1, 0.6, 0.05)
    const rengVAc = rengEntre(azar, 20, 80, 5)
    const rengNNaOH = rengDatosSol(rengCNaOH, rengVNaOH)
    const rengNAc = rengDatosSol(rengCAc, rengVAc)
    const rengExtNaOH = rengNNaOH / 2
    const rengExtAc = rengNAc
    if (Math.abs(rengExtNaOH - rengExtAc) / Math.max(rengExtNaOH, rengExtAc) < 0.1) return null
    const rengNaOHLim = rengExtNaOH < rengExtAc
    const rengSobraMol = rengNaOHLim ? rengNAc - rengExtNaOH : rengNNaOH - 2 * rengExtAc
    const rengLimTxt = rengNaOHLim ? 'NaOH' : rengBonita('H2SO4')
    const rengExcTxt = rengNaOHLim ? rengBonita('H2SO4') : 'NaOH'
    return {
      ...rengComun,
      titulo: 'Moles que sobran en una neutralización',
      enunciado: `Se mezclan las disoluciones de la tabla para la reacción 2 NaOH + ${rengBonita('H2SO4')} → ${rengBonita('Na2SO4')} + 2 ${rengBonita('H2O')}.`,
      pregunta: `¿Cuántos moles de ${rengExcTxt} quedan sin reaccionar?`,
      datos: [],
      tabla: { columnas: ['Disolución', 'Coeficiente', 'Concentración (mol/L)', 'Volumen (mL)'], filas: [['NaOH', 2, rengTextoDecimales(rengCNaOH, 2), rengTextoDecimales(rengVNaOH, 0)], [rengBonita('H2SO4'), 1, rengTextoDecimales(rengCAc, 2), rengTextoDecimales(rengVAc, 0)]] },
      respuesta: rengNumero(rengSobraMol, 'mol', { tolRel: 0.02, tolAbs: 0.00006 }),
      metodo: rengMetodoSobra(rengVar.id, `Con todo el ${rengLimTxt} solo se consume una parte del ${rengExcTxt}; el resto es lo que sobra.`, azar),
      criterioCompleto: 'Cuenta como respuesta completa: los moles sobrantes correctos y la justificación de por qué sobra ese reactivo.',
      hipotesis: ['La neutralización es completa hasta agotar el limitante.', 'Los volúmenes se suman pero no se pide la concentración final: solo moles.'],
      pistas: ['En una disolución, los moles son concentración por volumen en litros.', 'Divide los moles de cada reactivo entre su coeficiente para hallar el limitante.', 'Resta de los moles disponibles del exceso los que se consumen con el avance del limitante.'],
      pasos: [`n(NaOH) = ${rengTextoDecimales(rengCNaOH, 2)} · ${rengTextoDecimales(rengVNaOH / 1000, 3)} = ${rengTextoNumero(rengNNaOH, 4)} mol`, `n(${rengBonita('H2SO4')}) = ${rengTextoDecimales(rengCAc, 2)} · ${rengTextoDecimales(rengVAc / 1000, 3)} = ${rengTextoNumero(rengNAc, 4)} mol`, `Avances posibles: NaOH ${rengTextoNumero(rengExtNaOH, 4)} mol; ${rengBonita('H2SO4')} ${rengTextoNumero(rengExtAc, 4)} mol → limitante ${rengLimTxt}`, `Sobran ${rengTextoNumero(rengSobraMol, 4)} mol de ${rengExcTxt}`],
      comprobacion: 'Los moles sobrantes deben ser positivos y menores que los iniciales de ese reactivo.',
      errorFrecuente: 'Olvidar que 1 mol de H₂SO₄ neutraliza 2 mol de NaOH.'
    }
  }
}

export const RENG_FAMILIAS_RAZONAMIENTO_GENERAL: readonly RengFamilia[] = [RENG_FAMILIA_UNIDADES, RENG_FAMILIA_LIMITANTE_TABLA]
