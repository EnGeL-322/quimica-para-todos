import { rengAjustarIonElectron, type RengMedio } from '../../nucleo/ajuste'
import { rengCaracterIonico, RENG_FUENTE_EN, rengElectronegatividad, rengTipoPorDiferencia } from '../../nucleo/electronegatividad'
import { rengBonita } from '../../nucleo/formula'
import { rengElegir, rengTextoNumero } from '../numeros'
import type { RengDatoEjercicio, RengFamilia, RengFuenteEjercicio, RengBaseEjercicio } from '../tipos'
import { rengDatoD, rengDatoT, rengNumero, RENG_FUENTE_DIDACTICA, rengOpciones } from './util'
import { RENG_BANCO_OXIDACION, RENG_BANCO_REDOX, RENG_NOMBRE_ENLACE, RENG_PARES_ENLACE, RENG_SEMIRREACCIONES } from '../bancos'

const RENG_FUENTE_OXIDACION: RengFuenteEjercicio = {
  texto: 'Reglas habituales de asignación del número de oxidación de un curso (concepto definido en el IUPAC Gold Book, entrada «oxidation state», no consultada en esta sesión). Valores revisados a mano.',
  verificacion: 'didactico'
}

export const RENG_FAMILIA_OXIDACION: RengFamilia = {
  id: 'inorganica.oxidacion',
  rama: 'inorganica',
  tema: 'oxidacion',
  nombre: 'Números de oxidación',
  descripcion: 'Estado de oxidación de un elemento en compuestos, iones, peróxidos y óxidos mixtos.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'cientifico') return null
    const rengC = rengElegir(azar, RENG_BANCO_OXIDACION[nivel])
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('especie', 'Especie', rengBonita(rengC.f))]
    const rengTexto = nivel === 'quimico' ? 'promedio ' : ''
    const rengMetodoOpc = rengOpciones(azar, 'La suma de los números de oxidación es la carga de la especie; el oxígeno suele ser −2 y el hidrógeno +1', ['Cada elemento tiene siempre la misma valencia en todos los compuestos', 'El número de oxidación es el número de electrones de valencia del átomo', 'La suma de los números de oxidación es siempre cero, también en los iones'])
    return {
      titulo: `Número de oxidación de ${rengC.el}`,
      enunciado: `Considera la especie ${rengDatos[0]!.texto}.`,
      pregunta: `¿Cuál es el número de oxidación ${rengTexto}del ${rengC.el}? Escribe un número (con signo) o una fracción, por ejemplo +4 o 8/3.`,
      datos: rengDatos,
      respuesta: rengNumero(rengC.ox, '', { tolRel: 0.006, tolAbs: 0.004, errores: [{ valor: -rengC.ox, mensaje: 'Tienes el signo cambiado: revisa qué elemento es más electronegativo.' }] }),
      metodo: nivel === 'preuniversitario' ? undefined : { pregunta: 'Elige la regla en la que se apoya el cálculo.', opciones: rengMetodoOpc.opciones, correcta: rengMetodoOpc.correcta, explicacion: 'La suma algebraica de los números de oxidación de todos los átomos es la carga de la especie.' },
      pistas: ['Asigna primero los elementos con valor casi fijo (O = −2, H = +1, grupos 1 y 2).', `La suma de todos los números de oxidación debe ser ${rengC.f.includes('^') || /[+-]$/.test(rengC.f) ? 'la carga del ion' : 'cero'}.`, `Aquí: ${rengC.regla}.`],
      pasos: [`Regla aplicada: ${rengC.regla}.`, `Despejando: ${rengC.el} = ${rengTextoNumero(rengC.ox, 4)}`],
      comprobacion: 'Vuelve a sumar todos los números de oxidación multiplicados por los subíndices: debes obtener la carga.',
      errorFrecuente: 'Confundir el número de oxidación con la carga del ion o ignorar los subíndices.',
      hipotesis: nivel === 'quimico' ? ['Se aplican las reglas habituales: F = −1; H = +1 salvo en hidruros metálicos; O = −2 salvo en peróxidos, superóxidos y OF₂.', 'En óxidos mixtos y superóxidos el resultado es un valor promedio por átomo.'] : undefined,
      fuente: RENG_FUENTE_OXIDACION
    }
  }
}

export const RENG_FUENTE_ENLACE: RengFuenteEjercicio = {
  texto: `Electronegatividades de Pauling (${RENG_FUENTE_EN}). Frontera didáctica: Δχ < 0,4 apolar, 0,4–1,7 polar, > 1,7 iónico; es un criterio aproximado, no una ley. La relación del porcentaje iónico se atribuye a Pauling y no se consultó en esta sesión.`,
  verificacion: 'didactico'
}

export const RENG_FAMILIA_ENLACE: RengFamilia = {
  id: 'inorganica.enlace',
  rama: 'inorganica',
  tema: 'enlace',
  nombre: 'Enlace iónico y covalente',
  descripcion: 'Clasificar un enlace por la diferencia de electronegatividad y estimar su carácter iónico.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    const rengPar = rengElegir(azar, RENG_PARES_ENLACE)
    const rengA = rengElectronegatividad(rengPar[0])
    const rengB = rengElectronegatividad(rengPar[1])
    if (rengA === null || rengB === null) return null
    const rengDelta = Math.abs(rengA - rengB)
    if (Math.abs(rengDelta - 0.4) < 0.12 || Math.abs(rengDelta - 1.7) < 0.12) return null
    const rengTipo = rengTipoPorDiferencia(rengDelta)
    const rengOpc = rengOpciones(azar, RENG_NOMBRE_ENLACE[rengTipo], Object.values(RENG_NOMBRE_ENLACE), 3)
    const rengCrit = 'Criterio: Δχ < 0,4 apolar; entre 0,4 y 1,7 polar; mayor que 1,7 iónico.'
    if (nivel === 'quimico') {
      const rengPct = rengCaracterIonico(rengDelta)
      const rengDatos: RengDatoEjercicio[] = [rengDatoT('enlace', 'Enlace', `${rengPar[0]}–${rengPar[1]} (en ${rengPar[2]})`), rengDatoD('xA', `χ(${rengPar[0]})`, rengA, '', 2), rengDatoD('xB', `χ(${rengPar[1]})`, rengB, '', 2)]
      if (rengDelta < 0.1) return null
      return {
        titulo: 'Carácter iónico parcial de un enlace',
        enunciado: `Para el enlace ${rengDatos[0]!.texto} las electronegatividades de Pauling son ${rengDatos[1]!.texto} y ${rengDatos[2]!.texto}. Usa la relación empírica de Pauling: carácter iónico (%) = 100·[1 − exp(−Δχ²/4)].`,
        pregunta: '¿Qué porcentaje de carácter iónico estima el modelo?',
        datos: rengDatos,
        respuesta: rengNumero(rengPct, '%', { tolRel: 0.03, tolAbs: 0.3 }),
        hipotesis: ['La relación es una estimación empírica, no una medida experimental.', 'Solo depende de la diferencia de electronegatividad.'],
        pistas: ['Calcula Δχ = |χA − χB|.', 'Sustituye en 100·[1 − exp(−Δχ²/4)].'],
        pasos: [`Δχ = |${rengA} − ${rengB}| = ${rengTextoNumero(rengDelta, 3)}`, `% iónico = 100·[1 − exp(−${rengTextoNumero(rengDelta * rengDelta, 3)}/4)] = ${rengTextoNumero(rengPct, 3)} %`],
        comprobacion: 'Un Δχ pequeño debe dar un porcentaje bajo y uno grande, cercano a 100 %.',
        errorFrecuente: 'Olvidar elevar Δχ al cuadrado o dividir entre 4.',
        fuente: RENG_FUENTE_ENLACE
      }
    }
    const rengGuiado = nivel === 'preuniversitario'
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('enlace', 'Enlace', `${rengPar[0]}–${rengPar[1]} (en ${rengPar[2]})`)]
    if (rengGuiado) rengDatos.push(rengDatoD('xA', `χ(${rengPar[0]})`, rengA, '', 2), rengDatoD('xB', `χ(${rengPar[1]})`, rengB, '', 2))
    return {
      titulo: 'Clasificar un enlace',
      enunciado: rengGuiado ? `Para el enlace ${rengDatos[0]!.texto} las electronegatividades de Pauling son ${rengDatos[1]!.texto} y ${rengDatos[2]!.texto}. ${rengCrit}` : `Clasifica el enlace ${rengDatos[0]!.texto}. Busca las electronegatividades en la tabla periódica de la app. ${rengCrit}`,
      pregunta: '¿Qué tipo de enlace es?',
      datos: rengDatos,
      respuesta: { tipo: 'opcion', opciones: rengOpc.opciones, correcta: rengOpc.correcta },
      pistas: ['Resta las electronegatividades en valor absoluto: Δχ = |χA − χB|.', rengCrit, `Aquí Δχ = ${rengTextoNumero(rengDelta, 3)}.`],
      pasos: [`Δχ = |${rengA} − ${rengB}| = ${rengTextoNumero(rengDelta, 3)}`, `${rengCrit} → ${RENG_NOMBRE_ENLACE[rengTipo]}`],
      errorFrecuente: 'Llamar iónico a todo enlace con un metal o polar a todo enlace entre dos no metales.',
      fuente: RENG_FUENTE_ENLACE
    }
  }
}

const RENG_FUENTE_REDOX: RengFuenteEjercicio = {
  texto: 'Método ion-electrón (semirreacciones) con conservación de elementos y carga; ecuaciones de libro de texto resueltas por el motor de ajuste de la app. No predice si la reacción ocurre.',
  verificacion: 'didactico'
}

export const RENG_FAMILIA_REDOX: RengFamilia = {
  id: 'inorganica.redox',
  rama: 'inorganica',
  tema: 'redox',
  nombre: 'Ajuste redox ion-electrón',
  descripcion: 'Ajustar una reacción redox en medio ácido o básico con H⁺/OH⁻ y H₂O.',
  niveles: ['universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    const rengMedio: RengMedio = nivel === 'universitario' ? 'acido' : 'basico'
    const rengBase = rengElegir(azar, RENG_BANCO_REDOX[rengMedio])
    let rengR
    try {
      rengR = rengAjustarIonElectron({ reactivos: rengBase.reactivos, productos: rengBase.productos }, rengMedio)
    } catch {
      return null
    }
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('esquema', 'Esquema redox', `${rengBase.reactivos.map((rengF) => rengBonita(rengF)).join(' + ')} → ${rengBase.productos.map((rengF) => rengBonita(rengF)).join(' + ')}`), rengDatoT('medio', 'Medio', rengMedio === 'acido' ? 'ácido' : 'básico')]
    return {
      titulo: `Redox en medio ${rengMedio === 'acido' ? 'ácido' : 'básico'}`,
      enunciado: `Ajusta por el método ion-electrón, en medio ${rengDatos[1]!.texto}, el esquema ${rengDatos[0]!.texto}.`,
      pregunta: `Escribe la ecuación iónica ajustada (añade ${rengMedio === 'acido' ? 'H+ y H2O' : 'OH- y H2O'} donde haga falta, sin electrones).`,
      datos: rengDatos,
      respuesta: {
        tipo: 'ecuacion',
        reactivos: rengR.reactivos.map((rengT) => ({ formula: rengT.entrada, coef: rengT.coef })),
        productos: rengR.productos.map((rengT) => ({ formula: rengT.entrada, coef: rengT.coef })),
        coeficientesMinimos: true
      },
      pistas: ['Identifica qué especie se oxida y cuál se reduce con los números de oxidación.', `Ajusta cada semirreacción: primero el elemento que cambia, luego el O con H₂O, luego el H con ${rengMedio === 'acido' ? 'H⁺' : 'H₂O y OH⁻'} y por último la carga con electrones.`, 'Multiplica las semirreacciones para igualar los electrones y súmalas.'],
      pasos: rengR.pasos,
      hipotesis: ['Se conoce de antemano qué especies reaccionan y qué se forma; el método solo ajusta, no predice.'],
      comprobacion: 'Comprueba que cada elemento y la carga neta coinciden a ambos lados y que no queda ningún electrón.',
      errorFrecuente: 'Igualar la carga con H⁺ en medio básico o dejar electrones en la ecuación final.',
      fuente: RENG_FUENTE_REDOX
    }
  }
}

export const RENG_FAMILIA_SEMIRREACCION: RengFamilia = {
  id: 'inorganica.semirreaccion',
  rama: 'inorganica',
  tema: 'redox',
  nombre: 'Semirreacciones',
  descripcion: 'Escribir una semirreacción con los electrones en el lado correcto y la carga conservada.',
  niveles: ['preuniversitario'],
  generar: ({ azar }): RengBaseEjercicio | null => {
    const rengS = rengElegir(azar, RENG_SEMIRREACCIONES)
    const rengReactivos = rengS.tipo === 'oxidación' ? [{ formula: rengS.de, coef: rengS.de === 'Cl2' ? 1 : 1 }] : [{ formula: rengS.de, coef: 1 }, { formula: 'e-', coef: rengS.e }]
    const rengProductos = rengS.tipo === 'oxidación' ? [{ formula: rengS.a, coef: 1 }, { formula: 'e-', coef: rengS.e }] : [{ formula: rengS.a, coef: 1 }]
    if (rengS.de === 'Cl2') {
      rengReactivos[0] = { formula: 'Cl2', coef: 1 }
      rengProductos[0] = { formula: 'Cl-', coef: 2 }
    }
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('cambio', 'Cambio', `${rengBonita(rengS.de)} → ${rengBonita(rengS.a)}`), rengDatoT('proceso', 'Proceso', rengS.tipo)]
    return {
      titulo: `Semirreacción de ${rengS.tipo}`,
      enunciado: `Se produce una ${rengS.tipo}: ${rengDatos[0]!.texto}.`,
      pregunta: 'Escribe la semirreacción ajustada con los electrones, por ejemplo Fe2+ -> Fe3+ + e-.',
      datos: rengDatos,
      respuesta: { tipo: 'ecuacion', reactivos: rengReactivos, productos: rengProductos, coeficientesMinimos: true },
      pistas: ['Una oxidación pierde electrones (aparecen a la derecha); una reducción los gana (a la izquierda).', 'Los electrones se añaden hasta que la carga total sea igual a ambos lados.'],
      pasos: [`Carga a la izquierda y a la derecha: se igualan con ${rengS.e} e⁻.`, `${rengS.tipo === 'oxidación' ? 'Pierde' : 'Gana'} ${rengS.e} electrón${rengS.e === 1 ? '' : 'es'}.`],
      comprobacion: 'La suma de cargas debe ser igual a ambos lados, contando los electrones como −1.',
      errorFrecuente: 'Poner los electrones del lado equivocado.',
      fuente: RENG_FUENTE_DIDACTICA
    }
  }
}

export const RENG_FAMILIAS_INORGANICA: readonly RengFamilia[] = [RENG_FAMILIA_OXIDACION, RENG_FAMILIA_ENLACE, RENG_FAMILIA_REDOX, RENG_FAMILIA_SEMIRREACCION]
