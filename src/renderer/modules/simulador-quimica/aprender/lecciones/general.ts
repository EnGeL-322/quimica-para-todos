import type { RengLeccion } from '../tipos'
import { rengFuenteMasasAtomicas, rengFuenteOpenStax } from './comun'

export const RENG_LECCIONES_GENERAL: readonly RengLeccion[] = [
  {
    tema: 'mol',
    objetivo: 'Convertir entre masa, cantidad de sustancia (mol) y número de partículas usando la masa molar y la constante de Avogadro.',
    conceptos: [
      'El mol es la unidad de cantidad de sustancia: un mol contiene exactamente 6,02214076 × 10²³ entidades elementales (la constante de Avogadro, fijada por definición en el SI). Las entidades pueden ser moléculas, átomos, iones o fórmulas unidad.',
      'La masa molar M (g/mol) es la masa de un mol de la sustancia: se obtiene sumando las masas atómicas de todos los átomos de su fórmula. Es el puente entre lo que se pesa (gramos) y lo que se cuenta (mol): n = m / M.',
      'Cada conversión es una regla de tres con unidades: gramos → mol (dividir entre M) → partículas (multiplicar por la constante de Avogadro). Si las unidades no se cancelan, el planteamiento está mal.'
    ],
    ejemplo: {
      titulo: 'Moles y moléculas en una muestra de glucosa',
      enunciado: 'Se pesan 4,50 g de glucosa, C₆H₁₂O₆. ¿Cuántos moles hay, cuántas moléculas y cuántos átomos de carbono?',
      datos: [
        { etiqueta: 'Masa de la muestra', valor: '4,50 g' },
        { etiqueta: 'Fórmula', valor: 'C₆H₁₂O₆' },
        { etiqueta: 'Masas atómicas', valor: 'C 12,011 · H 1,008 · O 15,999 g/mol' },
        { etiqueta: 'Constante de Avogadro', valor: '6,02214076 × 10²³ mol⁻¹' }
      ],
      pasos: [
        { accion: 'Calcular la masa molar: M = 6·12,011 + 12·1,008 + 6·15,999 = 180,16 g/mol.', dato: 'La fórmula y las masas atómicas.', porQue: 'La masa molar convierte gramos en mol; hay que contar cada átomo de la fórmula, no solo los elementos distintos.', interpretar: 'Un mol de glucosa pesa 180,16 g.' },
        { accion: 'Pasar la masa a moles: n = m / M = 4,50 g / 180,16 g/mol = 0,0250 mol.', dato: 'La masa de la muestra (4,50 g).', porQue: 'Se dividen gramos entre g/mol para que quede mol: las unidades guían la operación.', interpretar: 'La muestra es unas 40 veces menor que un mol (4,50 g frente a 180 g).' },
        { accion: 'Pasar los moles a moléculas: N = n · N_A = 0,0250 mol · 6,022 × 10²³ mol⁻¹ = 1,50 × 10²² moléculas.', dato: 'La constante de Avogadro.', porQue: 'Un mol equivale a N_A entidades, así que se multiplica.', interpretar: 'Es un número enorme aunque la masa sea pequeña: las moléculas son diminutas.' },
        { accion: 'Contar átomos de carbono: 6 por molécula → 6 · 1,50 × 10²² = 9,03 × 10²² átomos.', dato: 'La fórmula: el subíndice 6 del carbono.', porQue: 'La pregunta cambia de entidad (de molécula a átomo): se multiplica por el subíndice.', interpretar: 'Hay seis veces más átomos de C que moléculas.' }
      ],
      resultado: { texto: '0,0250 mol; 1,50 × 10²² moléculas; 9,03 × 10²² átomos de C', valor: 0.0250, unidad: 'mol', tolRel: 0.01 },
      errorTipico: 'Usar 12 g/mol (la masa de un solo carbono) como masa molar de toda la glucosa, o olvidar el subíndice al contar átomos.',
      revision: 'Redondea mentalmente: 4,5 / 180 ≈ 0,025. Si el resultado no está cerca de esa cifra, revisa la masa molar.'
    },
    comprobacion: {
      pregunta: '¿Cuál de estas muestras tiene más moléculas: 10 g de agua (H₂O, 18,02 g/mol) o 10 g de dióxido de carbono (CO₂, 44,01 g/mol)?',
      opciones: [
        { id: 'a', texto: 'El agua, porque su masa molar es menor y en 10 g caben más moles.' },
        { id: 'b', texto: 'El dióxido de carbono, porque sus moléculas pesan más.' },
        { id: 'c', texto: 'Tienen las mismas, porque ambas muestras pesan 10 g.' }
      ],
      correcta: 'a',
      explicacion: 'n = m / M: con la misma masa, la sustancia de menor masa molar tiene más moles y por tanto más moléculas (0,555 mol frente a 0,227 mol).'
    },
    porNivel: {
      preuniversitario: 'Convierte gramos en moles con una sola masa molar y escribe la unidad en cada paso.',
      universitario: 'Encadena masa → mol → partículas y calcula composiciones porcentuales en varios pasos.',
      quimico: 'Distingue la entidad que cuentas (molécula, átomo, ion, fórmula unidad) y justifica las cifras significativas de la masa molar.',
      cientifico: 'Propaga la incertidumbre de la pesada y de las masas atómicas (intervalos de CIAAW) hasta la cantidad de sustancia.'
    },
    prerrequisitos: [],
    observar: { texto: 'Construye una molécula en la Mesa y mira su fórmula y su masa molar.', mesaSmiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O' },
    fuentes: [rengFuenteOpenStax('sección 3.1 «Formula Mass and the Mole Concept»'), rengFuenteMasasAtomicas],
    recorrido: false
  },
  {
    tema: 'concentracion',
    objetivo: 'Calcular la molaridad de una disolución y la concentración que resulta al diluirla.',
    conceptos: [
      'La molaridad M = n / V se mide en mol por litro de disolución (no por litro de disolvente). Para calcularla se convierte la masa de soluto en mol y se divide entre el volumen total en litros.',
      'Al diluir se añade disolvente: cambia el volumen, pero la cantidad de soluto no. Por eso n = C₁V₁ = C₂V₂ y la concentración baja en el mismo factor en que sube el volumen.',
      'Los reactivos comerciales suelen venir en porcentaje en masa y densidad: la molaridad sale de multiplicar ambas y dividir entre la masa molar.'
    ],
    ejemplo: {
      titulo: 'Molaridad de una disolución de sal y su dilución',
      enunciado: 'Se disuelven 5,85 g de NaCl en agua hasta completar 250,0 mL de disolución. Después se toman 20,0 mL y se diluyen hasta 100,0 mL. ¿Qué concentración tiene la disolución diluida?',
      datos: [
        { etiqueta: 'Masa de NaCl', valor: '5,85 g' },
        { etiqueta: 'Volumen de la disolución', valor: '250,0 mL' },
        { etiqueta: 'Alícuota y volumen final', valor: '20,0 mL → 100,0 mL' },
        { etiqueta: 'Masa molar de NaCl', valor: '22,990 + 35,45 = 58,44 g/mol' }
      ],
      pasos: [
        { accion: 'Calcular los moles de soluto: n = 5,85 g / 58,44 g/mol = 0,1001 mol.', dato: 'La masa y la masa molar de la sal.', porQue: 'La molaridad se define con moles, no con gramos.', interpretar: 'Es casi exactamente una décima de mol.' },
        { accion: 'Calcular la molaridad inicial: C₁ = 0,1001 mol / 0,2500 L = 0,400 mol/L.', dato: 'El volumen total de la disolución, pasado a litros.', porQue: 'Se divide entre el volumen de la disolución completa, no entre el de agua añadida.', interpretar: 'Cada litro contiene 0,400 mol de NaCl.' },
        { accion: 'Aplicar la dilución: C₂ = C₁V₁ / V₂ = 0,4004 mol/L · 20,0 mL / 100,0 mL = 0,0801 mol/L.', dato: 'La alícuota (V₁) y el volumen final (V₂); los mL se pueden dejar en mL si ambos lo están.', porQue: 'La cantidad de soluto de la alícuota no cambia al añadir disolvente.', interpretar: 'El factor de dilución es 5: la concentración baja a la quinta parte.' }
      ],
      resultado: { texto: '0,0801 mol/L', valor: 0.0801, unidad: 'mol/L', tolRel: 0.01 },
      errorTipico: 'Dividir los moles entre el volumen de agua añadida (en lugar del volumen final de disolución) o mezclar mL con L.',
      revision: 'La concentración tiene que bajar al diluir, y el cociente C₁/C₂ debe coincidir con V₂/V₁ (aquí 5 y 5).'
    },
    comprobacion: {
      pregunta: 'Se toman 25,0 mL de una disolución 0,200 mol/L y se llevan a 100,0 mL con agua. ¿Qué concentración queda?',
      opciones: [
        { id: 'a', texto: '0,0500 mol/L' },
        { id: 'b', texto: '0,800 mol/L' },
        { id: 'c', texto: '0,200 mol/L, porque el soluto es el mismo' }
      ],
      correcta: 'a',
      explicacion: 'El soluto es el mismo, pero el volumen se multiplica por 4: C₂ = 0,200 · 25,0 / 100,0 = 0,0500 mol/L. La opción c confunde cantidad con concentración.'
    },
    porNivel: {
      preuniversitario: 'Calcula una molaridad y una dilución con datos en unidades coherentes.',
      universitario: 'Convierte unidades (mL, g, %) y encadena preparación y dilución.',
      quimico: 'Elige el volumen correcto (disolución, no disolvente) y justifica la aditividad de volúmenes.',
      cientifico: 'Propaga la tolerancia del material volumétrico a la concentración final.'
    },
    prerrequisitos: ['mol'],
    observar: { texto: 'En «Ácidos y bases» cambia la concentración y observa cómo se mueve el pH al diluir.' },
    fuentes: [rengFuenteOpenStax('secciones 3.3 «Molarity» y 3.4 «Other Units for Solution Concentrations»'), rengFuenteMasasAtomicas],
    recorrido: false
  },
  {
    tema: 'ajuste',
    objetivo: 'Encontrar los coeficientes enteros mínimos que conservan cada elemento y la carga.',
    conceptos: [
      'En una reacción química se reordenan los átomos, pero no se crean ni se destruyen: cada elemento debe aparecer en igual número a ambos lados. Si hay iones, la carga total también se conserva.',
      'Los subíndices de una fórmula no se tocan (cambiarlos sería hablar de otra sustancia): solo se multiplican las fórmulas completas con coeficientes.',
      'Se empieza por el elemento que aparece en menos fórmulas, se deja para el final el que aparece en más (a menudo H u O) y se simplifican los coeficientes hasta que no tengan divisor común.'
    ],
    ejemplo: {
      titulo: 'Aluminio con ácido clorhídrico',
      enunciado: 'Ajusta: Al + HCl → AlCl₃ + H₂',
      datos: [{ etiqueta: 'Esquema sin ajustar', valor: 'Al + HCl → AlCl₃ + H₂' }],
      pasos: [
        { accion: 'Contar átomos: izquierda Al 1, H 1, Cl 1; derecha Al 1, Cl 3, H 2.', dato: 'La ecuación sin ajustar.', porQue: 'Sin un recuento previo no se sabe qué elemento falla.', interpretar: 'Fallan el cloro y el hidrógeno.' },
        { accion: 'Igualar el cloro: 3 HCl a la izquierda. Ahora H: 3 a la izquierda y 2 a la derecha.', dato: 'El Cl del AlCl₃ (3 átomos).', porQue: 'El cloro aparece en una sola fórmula por lado: es el más fácil de fijar.', interpretar: 'Los 3 H necesitan una cantidad par a la derecha.' },
        { accion: 'Duplicar todo lo necesario para obtener un número par de H: 2 Al + 6 HCl → 2 AlCl₃ + 3 H₂.', dato: 'El hidrógeno: 6 a la izquierda, 6 a la derecha (3 H₂).', porQue: 'Para que 3 HCl produzcan H₂ completo hacen falta 6 H; esto obliga a 2 Al y 2 AlCl₃.', interpretar: 'Ahora Al: 2 = 2; Cl: 6 = 6; H: 6 = 6.' },
        { accion: 'Comprobar que los coeficientes (2, 6, 2, 3) no tienen divisor común.', dato: 'Los cuatro coeficientes.', porQue: 'Una ecuación ajustada puede estar escrita en múltiplos innecesarios.', interpretar: 'No se puede simplificar: es la forma mínima.' }
      ],
      resultado: { texto: '2 Al + 6 HCl → 2 AlCl₃ + 3 H₂' },
      errorTipico: 'Cambiar el subíndice (escribir AlCl en lugar de AlCl₃) para que cuadren los átomos: eso cambia la sustancia.',
      revision: 'Cuenta de nuevo cada elemento a ambos lados y comprueba que el máximo común divisor de los coeficientes es 1.'
    },
    comprobacion: {
      pregunta: 'La ecuación 4 H₂ + 2 O₂ → 4 H₂O, ¿está bien escrita como ecuación ajustada mínima?',
      opciones: [
        { id: 'a', texto: 'Sí, conserva H y O y no se puede mejorar.' },
        { id: 'b', texto: 'Conserva H y O, pero se puede simplificar dividiendo entre 2: 2 H₂ + O₂ → 2 H₂O.' },
        { id: 'c', texto: 'No conserva el oxígeno.' }
      ],
      correcta: 'b',
      explicacion: 'H: 8 = 8 y O: 4 = 4, así que está equilibrada, pero los coeficientes tienen divisor común (2). La ecuación mínima es 2 H₂ + O₂ → 2 H₂O.'
    },
    porNivel: {
      preuniversitario: 'Ajusta por tanteo ecuaciones sencillas con 3 o 4 sustancias.',
      universitario: 'Ajusta ecuaciones con iones poliatómicos y comprueba la carga.',
      quimico: 'Ajusta con álgebra (sistema de ecuaciones) y detecta ecuaciones que pueden simplificarse.'
    },
    prerrequisitos: [],
    observar: { texto: 'En la Mesa, pestaña «Reacciones», escribe una ecuación y comprueba el recuento por elemento.' },
    fuentes: [rengFuenteOpenStax('sección 4.1 «Writing and Balancing Chemical Equations»')],
    recorrido: false
  },
  {
    tema: 'estequiometria',
    objetivo: 'Calcular qué reactivo limita una reacción, cuánto producto se obtiene y qué rendimiento real se logra.',
    conceptos: [
      'Los coeficientes de una ecuación ajustada son proporciones de moles, no de gramos. Por eso todo cálculo estequiométrico pasa por moles: masa → mol → (razón molar) → mol → masa.',
      'El reactivo limitante es el que se agota primero y fija la cantidad máxima de producto (el rendimiento teórico). Se identifica comparando cuántos moles de otro reactivo exigiría cada uno con los que realmente hay.',
      'El rendimiento porcentual compara lo obtenido con lo teórico: % = masa real / masa teórica · 100. Un valor superior a 100 % indica un error (producto húmedo, impurezas, cuentas).'
    ],
    ejemplo: {
      titulo: 'Síntesis de amoníaco con reactivo limitante y rendimiento',
      enunciado: 'N₂ + 3 H₂ → 2 NH₃. Se mezclan 10,0 g de N₂ con 3,00 g de H₂ y se obtienen 9,50 g de NH₃. Halla el reactivo limitante, el rendimiento teórico y el rendimiento porcentual.',
      datos: [
        { etiqueta: 'Masa de N₂', valor: '10,0 g' },
        { etiqueta: 'Masa de H₂', valor: '3,00 g' },
        { etiqueta: 'Masa real de NH₃', valor: '9,50 g' },
        { etiqueta: 'Masas molares', valor: 'N₂ 28,014 · H₂ 2,016 · NH₃ 17,031 g/mol' }
      ],
      pasos: [
        { accion: 'Pasar a moles: n(N₂) = 10,0 / 28,014 = 0,357 mol; n(H₂) = 3,00 / 2,016 = 1,488 mol.', dato: 'Las dos masas y las masas molares.', porQue: 'Las razones de la ecuación son molares: los gramos no se pueden comparar directamente.', interpretar: 'Hay más H₂ que N₂ en moles, pero la ecuación pide el triple de H₂.' },
        { accion: 'Hallar el limitante: 0,357 mol de N₂ exigen 3 · 0,357 = 1,071 mol de H₂; hay 1,488 mol, así que sobra H₂.', dato: 'La razón molar 1 N₂ : 3 H₂.', porQue: 'Se comprueba cuánto de un reactivo hace falta para consumir todo el otro: si lo que hay alcanza, el otro es el limitante.', interpretar: 'El N₂ se agota primero: es el limitante; sobran 1,488 − 1,071 = 0,417 mol de H₂.' },
        { accion: 'Rendimiento teórico: n(NH₃) = 2 · 0,357 = 0,714 mol; m = 0,714 · 17,031 = 12,16 g.', dato: 'La razón 1 N₂ : 2 NH₃ y la masa molar del amoníaco.', porQue: 'El limitante fija el máximo de producto.', interpretar: 'No se pueden obtener más de 12,16 g.' },
        { accion: 'Rendimiento porcentual: 9,50 g / 12,16 g · 100 = 78,1 %.', dato: 'La masa real obtenida.', porQue: 'Compara lo logrado con el máximo teórico.', interpretar: 'Se perdió o no reaccionó aproximadamente un 22 %; un valor así es plausible.' }
      ],
      resultado: { texto: 'Limitante: N₂; teórico 12,16 g de NH₃; rendimiento 78,1 %', valor: 78.1, unidad: '%', tolRel: 0.01 },
      errorTipico: 'Declarar limitante al reactivo de menor masa (aquí el H₂ pesa menos, pero no limita) en lugar de comparar moles con la razón de la ecuación.',
      revision: 'Comprueba que el rendimiento teórico no supera la masa total de reactivos (13,0 g) y que el porcentaje queda entre 0 y 100.'
    },
    comprobacion: {
      pregunta: 'En 2 H₂ + O₂ → 2 H₂O se mezclan 3,0 mol de H₂ con 1,0 mol de O₂. ¿Cuál es el limitante?',
      opciones: [
        { id: 'a', texto: 'El H₂: hay más moles de H₂ que de O₂, así que el O₂ sobra.' },
        { id: 'b', texto: 'El O₂: 1,0 mol de O₂ consume 2,0 mol de H₂, y hay 3,0 mol de H₂.' },
        { id: 'c', texto: 'Ninguno, porque 3,0 y 1,0 están en proporción 3 : 1.' }
      ],
      correcta: 'b',
      explicacion: 'La razón es 2 H₂ : 1 O₂. El 1,0 mol de O₂ solo puede consumir 2,0 mol de H₂; sobra 1,0 mol de H₂ y el O₂ es el limitante.'
    },
    porNivel: {
      preuniversitario: 'Un reactivo limitante con moles ya calculados y una sola razón molar.',
      universitario: 'Masa → mol → razón molar → masa, con limitante y rendimiento porcentual.',
      quimico: 'Reactivos con impurezas o en disolución, rendimiento por etapas y elección razonada del cálculo.'
    },
    prerrequisitos: ['mol', 'ajuste'],
    observar: { texto: 'En la Mesa, pestaña «Reacciones», introduce la ecuación y las masas y compara el limitante que calcula.' },
    fuentes: [rengFuenteOpenStax('secciones 4.3 «Reaction Stoichiometry» y 4.4 «Reaction Yields»'), rengFuenteMasasAtomicas],
    recorrido: true
  }
]
