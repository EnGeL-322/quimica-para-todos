import { RENG_ACIDOS, rengConcentracionH, rengPH, rengVolumenEquivalencia, type RengParAcidoBase } from '../../nucleo/acidoBase'
import { rengResolverMezclaAcidoBase } from '../../nucleo/mezclaAcidoBase'
import { rengDilucion } from '../../nucleo/estequiometria'
import { rengElegir, rengEntre, rengTextoDecimales, rengTextoNumero } from '../numeros'
import { rengPHAcidoSim, rengPHValoracionSim } from '../modelosSimulacion'
import type { RengDatoEjercicio, RengFamilia, RengFuenteEjercicio, RengBaseEjercicio } from '../tipos'
import { rengDatoC, rengDatoD, rengMapaDatos, rengNumero, RENG_FUENTE_DIDACTICA } from './util'
import { rengIncertidumbreInterpolada, rengRegresionLineal } from '../solucionadores'

const rengFuenteAcido = (rengA: RengParAcidoBase): RengFuenteEjercicio => ({
  texto: `pKa de ${rengA.nombre}: ${rengA.fuente} (${rengA.verificacion === 'consultada' ? 'fuente secundaria consultada' : 'valor de libro de texto sin consultar'}). Agua a 25 °C, actividades ≈ concentraciones.`,
  verificacion: rengA.verificacion === 'consultada' ? 'referencia' : 'didactico'
})

const RENG_ACIDOS_DEBILES = RENG_ACIDOS.filter((rengA) => !rengA.fuerte)

const rengLogaritmo = (rengX: number): number => Math.log10(rengX)

export const RENG_FAMILIA_PH: RengFamilia = {
  id: 'analitica.ph',
  rama: 'analitica',
  tema: 'ph',
  nombre: 'pH de ácidos y bases',
  descripcion: 'Ácidos y bases fuertes y débiles, disoluciones amortiguadoras y límites de las aproximaciones.',
  niveles: ['preuniversitario', 'universitario', 'quimico', 'cientifico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'preuniversitario') {
      const rengBase = azar() < 0.5
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('C', rengBase ? 'Concentración de NaOH' : 'Concentración de HCl', rengElegir(azar, [0.001, 0.005, 0.01, 0.05, 0.1]), 'mol/L', 3)]
      const rengC = rengMapaDatos(rengDatos)['C']!
      const rengPh = rengBase ? 14 + rengLogaritmo(rengC) : -rengLogaritmo(rengC)
      return {
        titulo: rengBase ? 'pH de una base fuerte' : 'pH de un ácido fuerte',
        enunciado: `Se tiene una disolución acuosa de ${rengBase ? 'hidróxido de sodio (NaOH)' : 'ácido clorhídrico (HCl)'} de concentración ${rengDatos[0]!.texto} a 25 °C. ${rengBase ? 'Toma pKw = 14,00.' : ''}`,
        pregunta: '¿Cuál es el pH? (sin unidad, con dos decimales)',
        datos: rengDatos,
        respuesta: rengNumero(rengPh, '', { tolRel: 0, tolAbs: 0.02, decimales: 2, errores: [{ valor: rengBase ? -rengLogaritmo(rengC) : 14 + rengLogaritmo(rengC), mensaje: rengBase ? 'Calculaste el pOH, no el pH: pH = 14 − pOH.' : 'Tomaste el pOH: en un ácido, pH = −log[H⁺].' }, { valor: rengC, mensaje: 'Diste la concentración en lugar de su logaritmo: pH = −log[H⁺].' }] }),
        pistas: rengBase ? ['Una base fuerte está totalmente disociada: [OH⁻] = C.', 'pOH = −log[OH⁻] y pH = 14 − pOH.'] : ['Un ácido fuerte está totalmente disociado: [H⁺] = C.', 'pH = −log[H⁺].'],
        pasos: rengBase ? [`[OH⁻] = ${rengDatos[0]!.texto}`, `pOH = ${rengTextoNumero(-rengLogaritmo(rengC), 4)}`, `pH = 14 − pOH = ${rengTextoDecimales(rengPh, 2)}`] : [`[H⁺] = ${rengDatos[0]!.texto}`, `pH = −log(${rengTextoNumero(rengC, 3)}) = ${rengTextoDecimales(rengPh, 2)}`],
        errorFrecuente: 'Olvidar el signo menos del logaritmo o confundir pH y pOH.',
        fuente: RENG_FUENTE_DIDACTICA,
        simulacion: rengBase ? undefined : { escena: 'acidobase', entradas: { acido: 'hcl', C: rengC }, comparar: { clave: 'pH' } }
      }
    }
    if (nivel === 'universitario') {
      const rengA = rengElegir(azar, RENG_ACIDOS_DEBILES.filter((rengX) => rengX.pKa > 3))
      const rengC = rengElegir(azar, [0.01, 0.05, 0.1, 0.2])
      const rengKa = 10 ** -rengA.pKa
      const rengAprox = -rengLogaritmo(Math.sqrt(rengKa * rengC))
      const rengExacto = rengPHAcidoSim(rengA.id, rengC)
      if (Math.abs(rengAprox - rengExacto) > 0.02 || rengA.id === 'amonio') return null
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('C', `Concentración de ${rengA.acido}`, rengC, 'mol/L', 3), rengDatoD('pKa', `pKa de ${rengA.acido}`, rengA.pKa, '', 3)]
      return {
        titulo: 'pH de un ácido débil',
        enunciado: `Una disolución de ${rengA.nombre.toLowerCase()} (${rengA.acido}) tiene concentración ${rengDatos[0]!.texto}. Dato: pKa = ${rengDatos[1]!.texto}. Considera 25 °C.`,
        pregunta: '¿Cuál es el pH de la disolución? (dos decimales)',
        datos: rengDatos,
        respuesta: rengNumero(rengExacto, '', { tolRel: 0, tolAbs: 0.03, decimales: 2, errores: [{ valor: -rengLogaritmo(rengC), mensaje: 'Trataste el ácido como fuerte ([H⁺] = C). Un ácido débil solo se ioniza en parte: usa Ka.' }] }),
        metodo: { pregunta: '¿Qué relación usas?', opciones: [{ id: 'a', texto: '[H⁺] = √(Ka·C), si el ácido se ioniza poco' }, { id: 'b', texto: '[H⁺] = C, porque todo ácido se disocia por completo' }, { id: 'c', texto: '[H⁺] = Ka·C' }], correcta: 'a', explicacion: 'En un ácido débil, Ka = x²/(C − x) ≈ x²/C, de donde x = √(Ka·C).' },
        pistas: ['Escribe el equilibrio HA ⇌ H⁺ + A⁻ y la expresión de Ka.', 'Si se ioniza menos del 5 %, [H⁺] ≈ √(Ka·C).', 'Convierte pKa en Ka con Ka = 10^(−pKa).'],
        pasos: [`Ka = 10^(−${rengA.pKa}) = ${rengTextoNumero(rengKa, 4)}`, `[H⁺] ≈ √(Ka·C) = ${rengTextoNumero(Math.sqrt(rengKa * rengC), 4)} mol/L`, `pH = ${rengTextoDecimales(rengExacto, 2)}`],
        comprobacion: 'Comprueba que [H⁺] es menor que el 5 % de C: así la aproximación es válida.',
        errorFrecuente: 'Tratar un ácido débil como si estuviera totalmente disociado.',
        fuente: rengFuenteAcido(rengA),
        simulacion: { escena: 'acidobase', entradas: { acido: rengA.id, C: rengC }, comparar: { clave: 'pH' } }
      }
    }
    if (nivel === 'quimico') {
      const rengHcl = azar() < 0.4
      const rengCa = rengElegir(azar, [0.005, 0.01])
      const rengVa = rengElegir(azar, [25, 50])
      const rengVeq = rengVolumenEquivalencia(rengCa, rengVa, rengCa)
      const rengVb = Number((rengVeq * (rengHcl ? rengElegir(azar, [0.4, 0.8, 1.2]) : rengElegir(azar, [0.25, 0.5, 0.75]))).toFixed(1))
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('Ca', rengHcl ? 'Concentración de HCl' : 'Concentración de ácido acético', rengCa, 'mol/L', 3), rengDatoD('Va', 'Volumen de ácido', rengVa, 'mL', 1), rengDatoD('Cb', 'Concentración de NaOH', rengCa, 'mol/L', 3), rengDatoD('Vb', 'Volumen de NaOH añadido', rengVb, 'mL', 1)]
      const rengR = rengResolverMezclaAcidoBase({ acido: rengHcl ? 'hcl' : 'acetico', concentracionAcido: rengCa, volumenAcidoMl: rengVa, concentracionBase: rengCa, volumenBaseMl: rengVb })
      if (!rengHcl) {
        const rengHH = 4.756 + rengLogaritmo(rengVb / (rengVa - rengVb))
        if (rengVb >= rengVeq || Math.abs(rengHH - rengR.pH) > 0.05) return null
      }
      const rengTextosEspecie = { amortiguador: 'Ácido acético y acetato a la vez (amortiguador)', acido: 'Ácido clorhídrico sin neutralizar (H₃O⁺ en exceso)', base: 'NaOH en exceso (OH⁻ en exceso)', sal: 'Solo la sal (acetato o cloruro) sin ácido ni base sobrantes' }
      const rengEspecie = rengVb < rengVeq ? (rengHcl ? rengTextosEspecie.acido : rengTextosEspecie.amortiguador) : rengTextosEspecie.base
      const rengOtrasEspecies = Object.values(rengTextosEspecie).filter((rengT) => rengT !== rengEspecie && !(rengHcl && rengT === rengTextosEspecie.amortiguador) && !(!rengHcl && rengT === rengTextosEspecie.acido)).slice(0, 3)
      return {
        titulo: rengHcl ? 'pH al valorar un ácido fuerte' : 'pH de una disolución amortiguadora',
        enunciado: `A ${rengDatos[1]!.texto} de ${rengHcl ? 'ácido clorhídrico' : 'ácido acético'} ${rengDatos[0]!.texto} se añaden ${rengDatos[3]!.texto} de NaOH ${rengDatos[2]!.texto}. Considera 25 °C, volúmenes aditivos y actividades ≈ concentraciones.${rengHcl ? '' : ' pKa del ácido acético = 4,756.'}`,
        pregunta: '¿Cuál es el pH de la mezcla? (dos decimales)',
        datos: rengDatos,
        respuesta: rengNumero(rengR.pH, '', { tolRel: 0, tolAbs: 0.05, decimales: 2 }),
        metodo: { pregunta: '¿Qué hay en la disolución cuando termina la neutralización?', opciones: [{ id: 'a', texto: rengEspecie }, ...rengOtrasEspecies.map((rengT, rengI) => ({ id: String.fromCharCode(98 + rengI), texto: rengT }))], correcta: 'a', explicacion: 'Primero se hace el balance de moles (reacción cuantitativa) y después se calcula con la especie que domina.' },
        hipotesis: ['La reacción ácido–base es cuantitativa; luego se aplica el equilibrio de lo que queda.', 'Volúmenes aditivos; sin CO₂ disuelto.'],
        pistas: ['Calcula los moles de ácido y de base y resta.', rengHcl ? 'Si sobra ácido fuerte, [H⁺] = exceso / volumen total; si sobra base, usa pOH.' : 'Con ácido y su base conjugada presentes, aplica Henderson–Hasselbalch: pH = pKa + log(n(A⁻)/n(HA)).', 'Comprueba el resultado con la zona de la curva de valoración.'],
        pasos: [`n(ácido) = ${rengTextoNumero(rengR.molesAcido, 4)} mol; n(NaOH) = ${rengTextoNumero(rengR.molesBase, 4)} mol`, `Volumen total = ${rengTextoNumero(rengR.volumenTotalMl, 4)} mL`, `pH exacto del modelo = ${rengTextoDecimales(rengR.pH, 2)}`],
        comprobacion: 'El pH debe quedar entre el pH inicial del ácido y el del exceso de base, y crecer al añadir NaOH.',
        errorFrecuente: 'Aplicar Henderson–Hasselbalch fuera de la zona amortiguadora o ignorar la dilución.',
        fuente: { texto: 'Modelo interno de mezcla ácido–base: pKw (IAPWS R11-24) y Ka del acético (Harned y Ehlers, 1933, DOI 10.1021/ja01329a027), fuentes consultadas.', verificacion: 'referencia' },
        simulacion: { escena: 'mezcla', entradas: { acido: rengHcl ? 'hcl' : 'acetico', cAcido: rengCa, VAcido: rengVa, cBase: rengCa, VBase: rengVb }, comparar: { clave: 'pH' } }
      }
    }
    const rengA = rengElegir(azar, RENG_ACIDOS_DEBILES.filter((rengX) => rengX.id !== 'amonio'))
    const rengC = rengElegir(azar, [0.0001, 0.0003, 0.001, 0.003])
    const rengKa = 10 ** -rengA.pKa
    const rengAprox = -rengLogaritmo(Math.sqrt(rengKa * rengC))
    const rengExacto = rengPH(rengConcentracionH(rengC, rengKa))
    const rengDif = rengAprox - rengExacto
    if (Math.abs(rengDif) < 0.03 || Math.abs(rengDif) > 0.6) return null
    const rengDatos: RengDatoEjercicio[] = [rengDatoD('C', `Concentración de ${rengA.acido}`, rengC, 'mol/L', 5), rengDatoD('pKa', `pKa de ${rengA.acido}`, rengA.pKa, '', 3)]
    return {
      titulo: 'Error de la aproximación √(Ka·C)',
      enunciado: `Se prepara ${rengA.nombre.toLowerCase()} (${rengA.acido}) ${rengDatos[0]!.texto}; pKa = ${rengDatos[1]!.texto} a 25 °C. Compara la aproximación [H⁺] ≈ √(Ka·C) con la solución exacta del equilibrio (balance de carga con Kw).`,
      pregunta: '¿Cuántas unidades de pH vale la diferencia |pH aproximado − pH exacto|? (tres decimales)',
      datos: rengDatos,
      respuesta: rengNumero(Math.abs(rengDif), '', { tolRel: 0.08, tolAbs: 0.006 }),
      hipotesis: ['Actividades ≈ concentraciones.', 'La solución exacta incluye la autoprotólisis del agua y la ionización parcial del ácido (sin aproximar C − x ≈ C).'],
      pistas: ['Calcula el pH con la aproximación: pH = −log√(Ka·C).', 'La solución exacta resuelve [H⁺] + 0 = Kw/[H⁺] + C·Ka/(Ka + [H⁺]) (puedes usar la simulación «Ácidos y bases»).', 'Resta ambos y toma el valor absoluto.'],
      pasos: [`pH aproximado = ${rengTextoDecimales(rengAprox, 3)}`, `pH exacto = ${rengTextoDecimales(rengExacto, 3)}`, `Diferencia = ${rengTextoDecimales(Math.abs(rengDif), 3)}`],
      comprobacion: 'La aproximación sobreestima el pH cuando la ionización no es pequeña frente a C: la diferencia crece al diluir.',
      errorFrecuente: 'Dar por válida la aproximación sin comprobar el grado de ionización.',
      fuente: rengFuenteAcido(rengA),
      simulacion: { escena: 'acidobase', entradas: { acido: rengA.id, C: rengC } }
    }
  }
}

export const RENG_FAMILIA_VALORACION: RengFamilia = {
  id: 'analitica.valoracion',
  rama: 'analitica',
  tema: 'valoracion',
  nombre: 'Valoración ácido–base',
  descripcion: 'Volumen de equivalencia, pH en distintos puntos de la curva e interpretación de datos de una valoración.',
  niveles: ['preuniversitario', 'universitario', 'quimico', 'cientifico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'preuniversitario') {
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('Ca', 'Concentración de HCl', rengElegir(azar, [0.05, 0.1, 0.2]), 'mol/L', 3), rengDatoD('Va', 'Volumen de HCl', rengElegir(azar, [10, 20, 25, 50]), 'mL', 1), rengDatoD('Cb', 'Concentración de NaOH', rengElegir(azar, [0.05, 0.1, 0.25]), 'mol/L', 3)]
      const rengD = rengMapaDatos(rengDatos)
      const rengVeq = rengVolumenEquivalencia(rengD['Ca']!, rengD['Va']!, rengD['Cb']!)
      if (rengVeq > 100) return null
      return {
        titulo: 'Volumen de equivalencia',
        enunciado: `Se valoran ${rengTexto2(rengDatos, 'Va')} de HCl ${rengTexto2(rengDatos, 'Ca')} con NaOH ${rengTexto2(rengDatos, 'Cb')}.`,
        pregunta: '¿Qué volumen de NaOH se necesita para llegar al punto de equivalencia?',
        datos: rengDatos,
        respuesta: rengNumero(rengVeq, 'mL', { tolRel: 0.01, decimales: 1, errores: [{ valor: rengD['Va']!, mensaje: 'Diste el volumen de ácido. En el punto de equivalencia solo coinciden los volúmenes si las concentraciones son iguales.' }, { valor: (rengD['Cb']! * rengD['Va']!) / rengD['Ca']!, mensaje: 'Invertiste las concentraciones: V(NaOH) = Ca·Va / Cb.' }] }),
        pistas: ['En la equivalencia, moles de H⁺ = moles de OH⁻ (la reacción es 1:1).', 'Ca·Va = Cb·Vb: despeja Vb.'],
        pasos: [`Ca·Va = ${rengTextoNumero(rengD['Ca']! * rengD['Va']!, 4)} mmol de HCl`, `Vb = Ca·Va / Cb = ${rengTextoNumero(rengVeq, 4)} mL`],
        errorFrecuente: 'Invertir el cociente de concentraciones.',
        fuente: RENG_FUENTE_DIDACTICA,
        simulacion: { escena: 'acidobase', entradas: { acido: 'hcl', C: rengD['Ca']!, Va: rengD['Va']!, Cb: rengD['Cb']! }, comparar: { clave: 'Veq' } }
      }
    }
    if (nivel === 'universitario') {
      const rengAc = RENG_ACIDOS.find((rengX) => rengX.id === 'acetico')!
      const rengCa = rengElegir(azar, [0.05, 0.1, 0.2])
      const rengVa = rengElegir(azar, [20, 25, 50])
      const rengCb = rengCa
      const rengVeq = rengVolumenEquivalencia(rengCa, rengVa, rengCb)
      const rengFraccion = rengElegir(azar, [0.25, 0.5, 0.75])
      const rengVb = Number((rengVeq * rengFraccion).toFixed(2))
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('Ca', 'Concentración de ácido acético', rengCa, 'mol/L', 3), rengDatoD('Va', 'Volumen de ácido', rengVa, 'mL', 1), rengDatoD('Cb', 'Concentración de NaOH', rengCb, 'mol/L', 3), rengDatoD('Vb', 'Volumen de NaOH añadido', rengVb, 'mL', 2), rengDatoD('pKa', 'pKa del ácido acético', rengAc.pKa, '', 3)]
      const rengPh = rengPHValoracionSim('acetico', rengCa, rengVa, rengCb, rengVb)
      const rengHH = rengAc.pKa + rengLogaritmo(rengVb / (rengVeq - rengVb))
      if (Math.abs(rengHH - rengPh) > 0.04) return null
      return {
        titulo: 'pH en la zona amortiguadora de una valoración',
        enunciado: `Se valoran ${rengDatos[1]!.texto} de ácido acético ${rengDatos[0]!.texto} con NaOH ${rengDatos[2]!.texto}. Se han añadido ${rengDatos[3]!.texto} de NaOH. pKa = ${rengDatos[4]!.texto}.`,
        pregunta: '¿Qué pH tiene la disolución en ese punto? (dos decimales)',
        datos: rengDatos,
        respuesta: rengNumero(rengPh, '', { tolRel: 0, tolAbs: 0.05, decimales: 2 }),
        metodo: { pregunta: '¿Qué zona de la curva es?', opciones: [{ id: 'a', texto: 'Antes de la equivalencia: ácido y su base conjugada coexisten (amortiguador)' }, { id: 'b', texto: 'La equivalencia: solo hay agua y NaCl' }, { id: 'c', texto: 'Después de la equivalencia: exceso de NaOH' }], correcta: 'a', explicacion: 'Con base insuficiente quedan HA y A⁻ a la vez: pH = pKa + log(n(A⁻)/n(HA)).' },
        pistas: ['Calcula el volumen de equivalencia y compáralo con el añadido.', 'Antes de la equivalencia hay HA y A⁻: moles de A⁻ = moles de OH⁻ añadidos; moles de HA = iniciales − añadidos.', 'pH = pKa + log(n(A⁻)/n(HA)).'],
        pasos: [`V(eq) = ${rengTextoNumero(rengVeq, 4)} mL`, `n(A⁻)/n(HA) = ${rengTextoNumero(rengVb, 4)}/${rengTextoNumero(rengVeq - rengVb, 4)}`, `pH = ${rengTextoDecimales(rengPh, 2)}`],
        comprobacion: 'En la semiequivalencia el pH debe valer el pKa.',
        errorFrecuente: 'Usar la fórmula de ácido débil solo con la concentración inicial sin tener en cuenta la base añadida.',
        fuente: rengFuenteAcido(rengAc),
        simulacion: { escena: 'acidobase', entradas: { acido: 'acetico', C: rengCa, Va: rengVa, Cb: rengCb, Vb: rengVb }, comparar: { clave: 'pHVb' } }
      }
    }
    if (nivel === 'quimico') {
      const rengCa = rengElegir(azar, [0.005, 0.01])
      const rengVa = rengElegir(azar, [25, 50])
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('Ca', 'Concentración de ácido acético', rengCa, 'mol/L', 3), rengDatoD('Va', 'Volumen de ácido', rengVa, 'mL', 1), rengDatoD('Cb', 'Concentración de NaOH', rengCa, 'mol/L', 3), rengDatoD('pKa', 'pKa del ácido acético', 4.756, '', 3)]
      const rengR = rengResolverMezclaAcidoBase({ acido: 'acetico', concentracionAcido: rengCa, volumenAcidoMl: rengVa, concentracionBase: rengCa, volumenBaseMl: rengVa })
      const rengCs = (rengCa * rengVa) / (2 * rengVa)
      const rengAprox = 7 + 0.5 * (4.756 + rengLogaritmo(rengCs))
      if (Math.abs(rengAprox - rengR.pH) > 0.05) return null
      return {
        titulo: 'pH en el punto de equivalencia',
        enunciado: `Se valoran ${rengDatos[1]!.texto} de ácido acético ${rengDatos[0]!.texto} con NaOH ${rengDatos[2]!.texto} hasta el punto de equivalencia. pKa = ${rengDatos[3]!.texto}; pKw = 14,00 (aproximación).`,
        pregunta: '¿Qué pH tiene la disolución en la equivalencia? (dos decimales)',
        datos: rengDatos,
        respuesta: rengNumero(rengR.pH, '', { tolRel: 0, tolAbs: 0.06, decimales: 2, errores: [{ valor: 7, mensaje: 'Supones que toda neutralización da pH 7: eso solo vale para ácido y base fuertes. Aquí queda acetato, una base débil.' }] }),
        metodo: { pregunta: '¿Qué especie domina en la equivalencia y qué equilibrio gobierna el pH?', opciones: [{ id: 'a', texto: 'El acetato (base débil) se hidroliza: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻' }, { id: 'b', texto: 'Solo hay agua y Na⁺; pH = 7' }, { id: 'c', texto: 'Queda ácido acético sin reaccionar' }], correcta: 'a', explicacion: 'La sal de ácido débil y base fuerte es básica: pH = 7 + ½(pKa + log C_sal).' },
        hipotesis: ['Volúmenes aditivos.', 'La hidrólisis del acetato es pequeña frente a su concentración.', 'Actividades ≈ concentraciones.'],
        pistas: ['En la equivalencia todo el ácido se ha convertido en acetato.', 'C del acetato = moles de ácido / volumen total.', 'pH = 7 + ½·(pKa + log C_acetato).'],
        pasos: [`C(acetato) = ${rengTextoNumero(rengCs, 4)} mol/L`, `pH ≈ 7 + ½·(4,756 + log ${rengTextoNumero(rengCs, 3)}) = ${rengTextoDecimales(rengAprox, 2)}`, `pH exacto del modelo = ${rengTextoDecimales(rengR.pH, 2)}`],
        comprobacion: 'El pH de la equivalencia de un ácido débil con base fuerte debe ser mayor que 7.',
        errorFrecuente: 'Suponer que el pH es 7 en la equivalencia de un ácido débil.',
        fuente: { texto: 'Modelo interno de mezcla ácido–base (IAPWS R11-24 para pKw; Harned y Ehlers, 1933, para Ka del acético).', verificacion: 'referencia' },
        simulacion: { escena: 'mezcla', entradas: { acido: 'acetico', cAcido: rengCa, VAcido: rengVa, cBase: rengCa, VBase: rengVa }, comparar: { clave: 'pH' } }
      }
    }
    const rengCa = 0.1
    const rengVa = rengElegir(azar, [20, 25, 30])
    const rengVeq = rengVolumenEquivalencia(rengCa, rengVa, rengCa)
    const rengPaso = 0.5
    const rengInicio = Math.floor((rengVeq - 2) / rengPaso) * rengPaso
    const rengFilas: Array<[number, number]> = []
    for (let rengV = rengInicio; rengV <= rengVeq + 2.001; rengV += rengPaso) {
      const rengRuido = (azar() - 0.5) * 0.04
      rengFilas.push([Number(rengV.toFixed(2)), Number((rengPHValoracionSim('hcl', rengCa, rengVa, rengCa, rengV) + rengRuido).toFixed(2))])
    }
    const rengDeriv = rengFilas.slice(1).map((rengF, rengI) => ({ v: (rengF[0] + rengFilas[rengI]![0]) / 2, d: (rengF[1] - rengFilas[rengI]![1]) / (rengF[0] - rengFilas[rengI]![0]) }))
    const rengMax = rengDeriv.reduce((rengA, rengB) => (rengB.d > rengA.d ? rengB : rengA))
    if (Math.abs(rengMax.v - rengVeq) > 0.3) return null
    const rengDatos: RengDatoEjercicio[] = [rengDatoD('Ca', 'Concentración de HCl', rengCa, 'mol/L', 3), rengDatoD('Va', 'Volumen de HCl', rengVa, 'mL', 1), rengDatoD('Cb', 'Concentración de NaOH', rengCa, 'mol/L', 3)]
    return {
      titulo: 'Punto de equivalencia a partir de datos',
      enunciado: `Se valoran ${rengDatos[1]!.texto} de HCl con NaOH ${rengDatos[2]!.texto}. Se midió el pH con un pH-metro (resolución 0,01 y ruido de ±0,02) en torno a la equivalencia; la tabla recoge los datos.`,
      pregunta: '¿En qué volumen de NaOH (mL) está el punto de equivalencia, según el máximo de ΔpH/ΔV?',
      datos: rengDatos,
      tabla: { columnas: ['V NaOH (mL)', 'pH'], filas: rengFilas },
      respuesta: rengNumero(rengVeq, 'mL', { tolRel: 0, tolAbs: 0.3, decimales: null }),
      hipotesis: ['Se acepta como equivalencia el punto de máxima pendiente (válido en una curva ácido fuerte–base fuerte, simétrica).', 'El ruido del pH-metro desplaza el máximo menos que el paso entre medidas.'],
      pistas: ['Calcula ΔpH/ΔV entre cada par de puntos consecutivos y asígnalo al volumen medio.', 'El máximo de la derivada marca el salto de la curva.', 'Comprueba con Ca·Va = Cb·Vb si conoces las concentraciones.'],
      pasos: [`Máxima pendiente: ΔpH/ΔV = ${rengTextoNumero(rengMax.d, 3)} en V ≈ ${rengTextoNumero(rengMax.v, 4)} mL`, `Con Ca·Va = Cb·Vb: V(eq) = ${rengTextoNumero(rengVeq, 4)} mL`],
      comprobacion: 'Los dos métodos (derivada y estequiometría) deben coincidir dentro del paso entre medidas.',
      errorFrecuente: 'Tomar el volumen en que el pH vale 7 sin comprobar que coincide con el máximo de la pendiente.',
      fuente: { texto: 'Datos generados por la app con el modelo de ácido fuerte y ruido aleatorio reproducible; no son mediciones publicadas.', verificacion: 'didactico' },
      simulacion: { escena: 'acidobase', entradas: { acido: 'hcl', C: rengCa, Va: rengVa, Cb: rengCa }, comparar: { clave: 'Veq' } }
    }
  }
}

const rengTexto2 = (rengDatos: RengDatoEjercicio[], rengClave: string): string => rengDatos.find((rengD) => rengD.clave === rengClave)!.texto

export const RENG_FAMILIA_DILUCION_ANALITICA: RengFamilia = {
  id: 'analitica.dilucion',
  rama: 'analitica',
  tema: 'dilucion',
  nombre: 'Dilución y preparación de patrones',
  descripcion: 'Alícuotas, diluciones en serie y mezcla de disoluciones.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'cientifico') return null
    if (nivel === 'preuniversitario') {
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('C1', 'Concentración de la disolución madre', rengElegir(azar, [0.5, 1, 2]), 'mol/L', 2), rengDatoD('C2', 'Concentración del patrón', rengElegir(azar, [0.01, 0.02, 0.05, 0.1]), 'mol/L', 3), rengDatoD('V2', 'Volumen del matraz', rengElegir(azar, [100, 250, 500]), 'mL', 0)]
      const rengD = rengMapaDatos(rengDatos)
      const rengR = rengDilucion({ C1: rengD['C1']!, C2: rengD['C2']!, V2: rengD['V2']! })
      return {
        titulo: 'Alícuota para un patrón',
        enunciado: `Para preparar un patrón se toma una alícuota de una disolución madre ${rengDatos[0]!.texto} y se enrasa en un matraz de ${rengDatos[2]!.texto} para obtener ${rengDatos[1]!.texto}.`,
        pregunta: '¿Qué volumen de disolución madre hay que medir con la pipeta?',
        datos: rengDatos,
        respuesta: rengNumero(rengR.V1, 'mL', { tolRel: 0.01, decimales: 2, errores: [{ valor: rengD['V2']!, mensaje: 'Diste el volumen del matraz: la alícuota es solo una parte.' }] }),
        pistas: ['La cantidad de soluto no cambia al diluir: C₁V₁ = C₂V₂.', 'Despeja V₁ = C₂·V₂ / C₁.'],
        pasos: [`V₁ = C₂·V₂ / C₁ = ${rengTextoNumero(rengD['C2']! * rengD['V2']!, 4)} / ${rengTextoNumero(rengD['C1']!, 4)} = ${rengTextoNumero(rengR.V1, 4)} mL`],
        errorFrecuente: 'Confundir el volumen de la alícuota con el volumen final.',
        fuente: RENG_FUENTE_DIDACTICA
      }
    }
    if (nivel === 'universitario') {
      const rengDatos: RengDatoEjercicio[] = [rengDatoD('c0', 'Concentración de la disolución madre', rengElegir(azar, [1.0, 2.5, 5.0]), 'g/L', 1), rengDatoD('f1', 'Primera dilución 1:', rengElegir(azar, [10, 20, 50]), '', 0), rengDatoD('f2', 'Segunda dilución 1:', rengElegir(azar, [5, 10]), '', 0)]
      const rengD = rengMapaDatos(rengDatos)
      const rengFinal = (rengD['c0']! * 1000) / (rengD['f1']! * rengD['f2']!)
      return {
        titulo: 'Dilución en serie',
        enunciado: `Una disolución madre contiene ${rengDatos[0]!.texto}. Se hace una primera dilución 1:${rengDatos[1]!.texto} (una parte de disolución en ${rengDatos[1]!.texto} partes totales) y de ella una segunda dilución 1:${rengDatos[2]!.texto}.`,
        pregunta: '¿Qué concentración final tiene, en mg/L?',
        datos: rengDatos,
        respuesta: rengNumero(rengFinal, 'mg/L', { tolRel: 0.01, errores: [{ valor: rengD['c0']! / (rengD['f1']! * rengD['f2']!), mensaje: 'Dejaste el resultado en g/L: la respuesta pedida es en mg/L (1 g/L = 1000 mg/L).' }, { valor: rengD['c0']! * 1000 * rengD['f1']! * rengD['f2']!, mensaje: 'Multiplicaste por los factores: al diluir, la concentración baja.' }] }),
        metodo: { pregunta: '¿Cómo combinas las dos diluciones?', opciones: [{ id: 'a', texto: 'Multiplico los factores de dilución: factor total = f₁·f₂' }, { id: 'b', texto: 'Sumo los factores de dilución' }, { id: 'c', texto: 'Divido un factor entre el otro' }], correcta: 'a', explicacion: 'Cada dilución divide la concentración por su factor; el efecto total es el producto de los factores.' },
        pistas: ['Cada dilución 1:n divide la concentración entre n.', 'El factor total es el producto de ambos.', 'Convierte g/L a mg/L multiplicando por 1000.'],
        pasos: [`Factor total = ${rengD['f1']} · ${rengD['f2']} = ${rengD['f1']! * rengD['f2']!}`, `C final = ${rengTextoNumero(rengD['c0']! * 1000, 4)} mg/L / ${rengD['f1']! * rengD['f2']!} = ${rengTextoNumero(rengFinal, 4)} mg/L`],
        errorFrecuente: 'Sumar los factores en vez de multiplicarlos.',
        fuente: RENG_FUENTE_DIDACTICA
      }
    }
    const rengDatos: RengDatoEjercicio[] = [rengDatoD('C1', 'Concentración de la primera disolución', rengElegir(azar, [0.2, 0.5]), 'mol/L', 2), rengDatoD('V1', 'Volumen de la primera', rengEntre(azar, 10, 50, 5), 'mL', 0), rengDatoD('C2', 'Concentración de la segunda', rengElegir(azar, [0.05, 0.1]), 'mol/L', 2), rengDatoD('V2', 'Volumen de la segunda', rengEntre(azar, 20, 80, 5), 'mL', 0)]
    const rengD = rengMapaDatos(rengDatos)
    const rengCf = (rengD['C1']! * rengD['V1']! + rengD['C2']! * rengD['V2']!) / (rengD['V1']! + rengD['V2']!)
    return {
      titulo: 'Mezcla de dos disoluciones del mismo soluto',
      enunciado: `Se mezclan ${rengDatos[1]!.texto} de una disolución ${rengDatos[0]!.texto} con ${rengDatos[3]!.texto} de otra ${rengDatos[2]!.texto} del mismo soluto.`,
      pregunta: '¿Cuál es la concentración final? (suponer volúmenes aditivos)',
      datos: rengDatos,
      respuesta: rengNumero(rengCf, 'mol/L', { tolRel: 0.012, errores: [{ valor: (rengD['C1']! + rengD['C2']!) / 2, mensaje: 'Hiciste el promedio simple de las concentraciones: hay que ponderar por los moles de cada disolución.' }] }),
      metodo: { pregunta: '¿Qué modelo usas?', opciones: [{ id: 'a', texto: 'Suma de moles dividida entre el volumen total (volúmenes aditivos)' }, { id: 'b', texto: 'Promedio aritmético de las dos concentraciones' }, { id: 'c', texto: 'Producto de las concentraciones' }], correcta: 'a', explicacion: 'La cantidad de soluto se conserva: C = (C₁V₁ + C₂V₂)/(V₁ + V₂).' },
      hipotesis: ['Volúmenes aditivos.', 'No hay reacción entre las dos disoluciones.'],
      pistas: ['Calcula los moles que aporta cada disolución.', 'Suma los moles y divide entre el volumen total.'],
      pasos: [`n₁ = ${rengTextoNumero(rengD['C1']! * rengD['V1']! / 1000, 4)} mol; n₂ = ${rengTextoNumero(rengD['C2']! * rengD['V2']! / 1000, 4)} mol`, `C = (n₁ + n₂) / (V₁ + V₂) = ${rengTextoNumero(rengCf, 4)} mol/L`],
      comprobacion: 'La concentración final debe quedar entre las dos concentraciones iniciales.',
      errorFrecuente: 'Promediar concentraciones sin ponderar por los volúmenes.',
      fuente: RENG_FUENTE_DIDACTICA
    }
  }
}

export const RENG_FAMILIA_CALIBRACION: RengFamilia = {
  id: 'analitica.calibracion',
  rama: 'analitica',
  tema: 'calibracion',
  nombre: 'Calibración lineal e incertidumbre',
  descripcion: 'Recta de calibrado por mínimos cuadrados, concentración interpolada y su incertidumbre.',
  niveles: ['quimico', 'cientifico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel !== 'quimico' && nivel !== 'cientifico') return null
    const rengPend = rengEntre(azar, 0.05, 0.2, 0.005)
    const rengOrd = rengEntre(azar, 0.002, 0.02, 0.001)
    const rengC = [0, 2, 4, 6, 8, 10]
    const rengY = rengC.map((rengX) => Number((rengOrd + rengPend * rengX + (azar() - 0.5) * 0.008).toFixed(3)))
    const rengCal = rengRegresionLineal(rengC, rengY)
    const rengY0 = Number((rengCal.b + rengCal.m * rengEntre(azar, 3, 7, 0.1)).toFixed(3))
    const rengX0 = (rengY0 - rengCal.b) / rengCal.m
    const rengDatos: RengDatoEjercicio[] = [rengDatoC('y0', 'Absorbancia de la muestra', rengY0, '', 3)]
    const rengTabla = { columnas: ['c (mg/L)', 'Absorbancia'], filas: rengC.map((rengX, rengI) => [rengX, rengY[rengI]!] as Array<string | number>) }
    const rengFuenteCal: RengFuenteEjercicio = { texto: 'Mínimos cuadrados de y sobre x y propagación de la incertidumbre de una concentración interpolada (fórmulas estándar de química analítica; no se consultó una obra concreta). Datos generados por la app, no son mediciones.', verificacion: 'didactico' }
    if (nivel === 'quimico') {
      return {
        titulo: 'Concentración por calibración lineal',
        enunciado: `Se midió la absorbancia de seis patrones a 520 nm (tabla). Una muestra problema dio una absorbancia de ${rengDatos[0]!.texto}.`,
        pregunta: '¿Qué concentración (mg/L) tiene la muestra, usando la recta de mínimos cuadrados absorbancia–concentración?',
        datos: rengDatos,
        tabla: rengTabla,
        respuesta: rengNumero(rengX0, 'mg/L', { tolRel: 0.015 }),
        metodo: { pregunta: '¿Qué ajuste aplicas?', opciones: [{ id: 'a', texto: 'Regresión lineal de la señal (y) sobre la concentración (x) y despeje de x₀ = (y₀ − b)/m' }, { id: 'b', texto: 'Dividir la absorbancia entre la concentración del primer patrón' }, { id: 'c', texto: 'Promediar las absorbancias de los patrones' }], correcta: 'a', explicacion: 'La señal es la variable medida con error; la concentración interpolada es x₀ = (y₀ − b)/m.' },
        hipotesis: ['Respuesta lineal en todo el intervalo.', 'Varianza de la señal aproximadamente constante (homocedasticidad).'],
        pistas: ['Calcula las medias de x e y y las sumas Sxx = Σ(x − x̄)², Sxy = Σ(x − x̄)(y − ȳ).', 'Pendiente m = Sxy/Sxx; ordenada b = ȳ − m·x̄.', 'Despeja x₀ = (y₀ − b)/m.'],
        pasos: [`m = ${rengTextoNumero(rengCal.m, 5)} (mg/L)⁻¹; b = ${rengTextoNumero(rengCal.b, 4)}`, `x₀ = (${rengDatos[0]!.texto} − b)/m = ${rengTextoNumero(rengX0, 4)} mg/L`],
        comprobacion: 'La concentración interpolada debe quedar dentro del intervalo de los patrones (0–10 mg/L).',
        errorFrecuente: 'Despejar con la pendiente de x sobre y o ignorar la ordenada en el origen.',
        fuente: rengFuenteCal
      }
    }
    const rengU = rengIncertidumbreInterpolada(rengCal, rengY0)
    return {
      titulo: 'Incertidumbre de una concentración interpolada',
      enunciado: `Se midió la absorbancia de seis patrones a 520 nm (tabla). Una muestra problema, medida una vez, dio una absorbancia de ${rengDatos[0]!.texto}.`,
      pregunta: 'Calcula la desviación estándar de la concentración interpolada s(x₀), en mg/L, con s(x₀) = (s_r/|m|)·√[1/M + 1/n + (y₀ − ȳ)²/(m²·Sxx)], con M = 1 réplica.',
      datos: rengDatos,
      tabla: rengTabla,
      respuesta: rengNumero(rengU, 'mg/L', { tolRel: 0.04 }),
      hipotesis: ['Respuesta lineal; errores aleatorios independientes y con varianza constante.', 'Los patrones no tienen incertidumbre propia (solo se considera la de la señal).'],
      pistas: ['Ajusta la recta y calcula los residuos eᵢ = yᵢ − (b + m·xᵢ).', 's_r = √[Σeᵢ²/(n − 2)].', 'Sustituye en la fórmula de s(x₀) con n = 6 y M = 1.'],
      pasos: [`m = ${rengTextoNumero(rengCal.m, 5)}; b = ${rengTextoNumero(rengCal.b, 4)}; s_r = ${rengTextoNumero(rengCal.sr, 3)}`, `ȳ = ${rengTextoNumero(rengCal.ym, 4)}; Sxx = ${rengTextoNumero(rengCal.sxx, 4)}`, `s(x₀) = ${rengTextoNumero(rengU, 3)} mg/L (x₀ = ${rengTextoNumero(rengX0, 4)} mg/L)`],
      comprobacion: 'La incertidumbre es mínima cuando y₀ coincide con ȳ y crece hacia los extremos de la recta.',
      errorFrecuente: 'Usar n en vez de n − 2 grados de libertad al calcular s_r.',
      fuente: rengFuenteCal
    }
  }
}

export const RENG_FAMILIAS_ANALITICA: readonly RengFamilia[] = [RENG_FAMILIA_PH, RENG_FAMILIA_VALORACION, RENG_FAMILIA_DILUCION_ANALITICA, RENG_FAMILIA_CALIBRACION]
