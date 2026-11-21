import type { RengRecurso } from './tipos'

export interface RengDecisionCorrespondencia {
  subtema: string
  recurso: RengRecurso
  decision: 'retirada' | 'confirmada'
  motivo: string
  fecha: string
}

export const RENG_DECISIONES_PASO0_N1: readonly RengDecisionCorrespondencia[] = [
  {
    subtema: 'n1-b8-s1',
    recurso: { tipo: 'sustancia', id: 'oxígeno' },
    decision: 'retirada',
    motivo: 'Es una entrada de la biblioteca para colocar la molécula en la Mesa; no muestra ni enseña las propiedades generales de los gases (compresibilidad, densidad baja, difusión).',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b8-s1',
    recurso: { tipo: 'caso', id: 'aire' },
    decision: 'retirada',
    motivo: 'El caso muestra la composición del aire, no las propiedades generales de los gases. Se reubica como consulta en el subtema 12 (presiones parciales), que sí usa esa composición.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b8-s12',
    recurso: { tipo: 'caso', id: 'aire' },
    decision: 'confirmada',
    motivo: 'El caso muestra la composición del aire seco (78 % N₂, 21 % O₂), que la lección usa como fracciones molares para calcular presiones parciales. Solo es consulta: no calcula ni simula.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b7-s5',
    recurso: { tipo: 'tema', id: 'mol' },
    decision: 'confirmada',
    motivo: 'La lección del tema «mol» define el mol para «moléculas, átomos, iones o fórmulas unidad» y calcula masas molares sumando las masas atómicas de la fórmula, que es exactamente la masa fórmula de un compuesto iónico.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b7-s9',
    recurso: { tipo: 'tema', id: 'estequiometria' },
    decision: 'confirmada',
    motivo: 'La lección del tema «estequiometria» enseña que los coeficientes de una ecuación ajustada son proporciones de moles y las usa en su ejemplo resuelto: es la relación mol-mol del subtema.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b7-s11',
    recurso: { tipo: 'tema', id: 'estequiometria' },
    decision: 'confirmada',
    motivo: 'La lección del tema «estequiometria» enseña el camino masa → mol → (razón molar) → mol, que incluye la relación masa-mol del subtema.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b7-s14',
    recurso: { tipo: 'tema', id: 'estequiometria' },
    decision: 'confirmada',
    motivo: 'El ejemplo resuelto del tema «estequiometria» calcula cuánto sobra del reactivo en exceso (0,417 mol de H₂), que es el contenido del subtema.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b7-s16',
    recurso: { tipo: 'tema', id: 'estequiometria' },
    decision: 'confirmada',
    motivo: 'La lección del tema «estequiometria» define el rendimiento a partir de la masa real obtenida frente a la teórica y lo calcula en su ejemplo: cubre el rendimiento real del subtema.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b7-s18',
    recurso: { tipo: 'tema', id: 'concentracion' },
    decision: 'retirada',
    motivo: 'El tema «concentracion» trata la molaridad y la dilución; solo menciona el porcentaje en masa de los reactivos comerciales para calcular molaridades. No enseña la pureza de un reactivo sólido en un cálculo estequiométrico, que es el subtema.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b9-s1',
    recurso: { tipo: 'tema', id: 'concentracion' },
    decision: 'retirada',
    motivo: 'El tema «concentracion» calcula molaridades y diluciones; solo dice de pasada que el volumen es el de disolución y no el de disolvente. No enseña qué son el soluto y el disolvente ni la conservación de la masa al disolver, que es el subtema.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b9-s3',
    recurso: { tipo: 'escena', id: 'solubilidad' },
    decision: 'confirmada',
    motivo: 'La escena de solubilidad calcula la solubilidad molar de sales poco solubles a partir de su Ksp y la muestra como la cantidad máxima que se disuelve: es la idea de solubilidad del subtema (en mol/L).',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b9-s5',
    recurso: { tipo: 'escena', id: 'solubilidad' },
    decision: 'confirmada',
    motivo: 'Con sólido presente, la escena lleva el sistema a Q = Ksp y su diagnóstico dice que la disolución «queda saturada»: muestra la disolución saturada en equilibrio con el sólido.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b9-s6',
    recurso: { tipo: 'escena', id: 'solubilidad' },
    decision: 'confirmada',
    motivo: 'Con concentraciones de iones bajas la escena indica Q < Ksp y no precipita: es una disolución que aún admite soluto, la insaturada del subtema (la lección explica la palabra, que la escena no usa).',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b9-s7',
    recurso: { tipo: 'escena', id: 'solubilidad' },
    decision: 'confirmada',
    motivo: 'La guía de la escena dice que si Q supera a Ksp la disolución está sobresaturada y la sal precipita hasta Q = Ksp. La lección aclara que la escena predice la precipitación inmediata y no modela la metaestabilidad.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b9-s8',
    recurso: { tipo: 'tema', id: 'concentracion' },
    decision: 'retirada',
    motivo: 'El tema «concentracion» usa el porcentaje en masa de un reactivo comercial solo como dato para calcular su molaridad; no enseña a calcular ni a interpretar el porcentaje en masa de una disolución, que es el subtema.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b9-s9',
    recurso: { tipo: 'tema', id: 'concentracion' },
    decision: 'retirada',
    motivo: 'El tema «concentracion» no trata el porcentaje en volumen en ningún concepto ni ejemplo.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b9-s10',
    recurso: { tipo: 'tema', id: 'concentracion' },
    decision: 'retirada',
    motivo: 'El tema «concentracion» no trata el porcentaje masa-volumen; sus cálculos van de gramos a moles y de moles a molaridad.',
    fecha: '2026-11-18'
  },
  {
    subtema: 'n1-b10-s3',
    recurso: { tipo: 'mesa', id: 'enlaces' },
    decision: 'confirmada',
    motivo: 'La herramienta «Enlaces» de la Mesa explica paso a paso los enlaces dativos NH₃ + H⁺, H₂O + H⁺ y H₃N·BF₃ con un dador del par libre y un aceptor con hueco vacío: es la definición de ácido y base de Lewis.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b10-s8',
    recurso: { tipo: 'escena', id: 'acidobase' },
    decision: 'retirada',
    motivo: 'La escena ácido-base usa Kw dentro de su balance de carga, pero no muestra el equilibrio de autoionización, ni [OH⁻], ni el agua pura: no enseña el subtema. La lección enlaza la escena N1 «acido-base», que sí muestra [H₃O⁺], [OH⁻] y su producto.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b10-s13',
    recurso: { tipo: 'tema', id: 'ph' },
    decision: 'retirada',
    motivo: 'El tema «ph» trata ácidos fuertes y débiles con Ka y la aproximación del 5 %; no define Kb ni calcula bases débiles, que es el subtema de constantes de basicidad.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b10-s15',
    recurso: { tipo: 'tema', id: 'valoracion' },
    decision: 'retirada',
    motivo: 'El tema «valoracion» solo dice que el punto final se ve por el cambio de color de un indicador; no explica qué es un indicador, su pK ni su intervalo de viraje, que es el subtema.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b10-s20',
    recurso: { tipo: 'tema', id: 'equilibrio' },
    decision: 'retirada',
    motivo: 'El tema «equilibrio» trata K, Q y la tabla ICE con concentraciones; no trata Kp ni la conversión Kp = Kc·(RT)^Δn, que es el subtema.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b11-s9',
    recurso: { tipo: 'mesa', id: 'enlaces' },
    decision: 'confirmada',
    motivo: 'La herramienta «Enlaces» de la Mesa muestra, para las moléculas con enlaces múltiples, la energía de disociación D₀ del enlace en kJ/mol: es la energía de enlace del subtema (la lección aclara que las tablas usan valores medios).',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b11-s18',
    recurso: { tipo: 'escena', id: 'electroquimica' },
    decision: 'retirada',
    motivo: 'La escena de electroquímica es una celda galvánica ideal en circuito abierto: calcula potenciales con Nernst, pero no hace pasar corriente ni relaciona carga con masa. No trata las leyes de Faraday; la lección enlaza la escena N1 «electrolisis».',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b11-s20',
    recurso: { tipo: 'escena', id: 'electroquimica' },
    decision: 'confirmada',
    motivo: 'Cada combinación de electrodos de la escena de electroquímica es una pila galvánica con su potencial y su reacción: muestra lo que es una pila; la lección añade capacidad, energía y consumo de reactivo, que la escena no modela.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s1',
    recurso: { tipo: 'mesa', id: 'reacciones' },
    decision: 'confirmada',
    motivo: 'La herramienta «Reacciones» de la Mesa escribe una reacción con sus reactivos y productos y muestra el recuento de átomos por elemento a cada lado: es la idea de reacción como reorganización de átomos.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s2',
    recurso: { tipo: 'mesa', id: 'reacciones' },
    decision: 'confirmada',
    motivo: 'La herramienta «Reacciones» de la Mesa separa reactivos y productos, ajusta la ecuación y calcula cantidades y el reactivo limitante: trata exactamente reactivos, productos y sus proporciones.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s8',
    recurso: { tipo: 'mesa', id: 'reacciones' },
    decision: 'confirmada',
    motivo: 'La herramienta «Reacciones» de la Mesa ajusta y calcula cualquier ecuación que se escriba, incluidas las síntesis (2 Mg + O₂ → 2 MgO, N₂ + 3 H₂ → 2 NH₃); la lección indica qué escribir.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s10',
    recurso: { tipo: 'mesa', id: 'reacciones' },
    decision: 'confirmada',
    motivo: 'La herramienta «Reacciones» de la Mesa ajusta y calcula los desplazamientos simples (Zn + CuSO₄ → ZnSO₄ + Cu); no decide si ocurren, y la lección lo explica con la serie de actividad.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s14',
    recurso: { tipo: 'mesa', id: 'reacciones' },
    decision: 'confirmada',
    motivo: 'La herramienta «Reacciones» de la Mesa ajusta las combustiones y calcula el O₂ consumido y el CO₂ formado; la escena N1 «combustion» lo complementa.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s6',
    recurso: { tipo: 'tema', id: 'ajuste' },
    decision: 'confirmada',
    motivo: 'El tema «ajuste» pide coeficientes enteros mínimos y, en el nivel «químico», ajustar con álgebra (sistema de ecuaciones); sus prácticas valen para cualquier método de ajuste.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s12',
    recurso: { tipo: 'escena', id: 'solubilidad' },
    decision: 'confirmada',
    motivo: 'La escena de solubilidad compara Q con Ksp y dice si una sal poco soluble precipita y cuánto: es la condición de precipitación del subtema.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s15',
    recurso: { tipo: 'escena', id: 'equilibrio' },
    decision: 'confirmada',
    motivo: 'La escena de equilibrio muestra cómo una reacción reversible llega a un estado en el que coexisten reactivos y productos: es el comportamiento de las reacciones reversibles.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s16',
    recurso: { tipo: 'escena', id: 'termo' },
    decision: 'confirmada',
    motivo: 'La escena de energía de reacción calcula ΔH y el calor liberado por las reacciones de su lista, entre ellas combustiones con ΔH < 0: muestra reacciones exotérmicas.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s17',
    recurso: { tipo: 'escena', id: 'termo' },
    decision: 'confirmada',
    motivo: 'La escena de energía de reacción incluye reacciones con ΔH > 0 y calcula el calor absorbido: muestra reacciones endotérmicas.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s19',
    recurso: { tipo: 'tema', id: 'redox' },
    decision: 'confirmada',
    motivo: 'El tema «redox» (semirreacciones e ion-electrón) identifica quién se oxida y quién se reduce; sus claves incluyen «oxidante» y «reductor».',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b6-s20',
    recurso: { tipo: 'tema', id: 'redox' },
    decision: 'confirmada',
    motivo: 'El tema «redox» identifica la especie que se oxida (el reductor) y los electrones que cede en cada semirreacción.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s8',
    recurso: { tipo: 'tabla' },
    decision: 'confirmada',
    motivo: 'La tabla periódica indica el estado de agregación de cada elemento a temperatura ambiente (sólido, líquido o gas): sirve para ver ejemplos de los tres estados.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s10',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'confirmada',
    motivo: 'La pestaña «Explorar» de la Mesa muestra sustancias puras de una en una, cada una con su fórmula fija: ilustra lo que es una sustancia pura.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s11',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'confirmada',
    motivo: 'La pestaña «Explorar» de la Mesa permite comparar elementos (un solo tipo de átomo, como O₂) con compuestos (varios elementos, como H₂O).',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s12',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'retirada',
    motivo: 'La Mesa muestra sustancias puras de una en una y no representa mezclas ni su composición variable; la lección enlaza la escena N1 «concentraciones», que sí trata una mezcla homogénea.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s16',
    recurso: { tipo: 'practica', id: 'general.unidades-preparacion' },
    decision: 'confirmada',
    motivo: 'La familia de práctica «Error de unidades en una preparación» pide detectar y corregir unidades mezcladas (mg y g, mL y L): es el uso de magnitudes y unidades del subtema.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s17',
    recurso: { tipo: 'practica', id: 'general.unidades-preparacion' },
    decision: 'confirmada',
    motivo: 'La práctica de errores de unidades trabaja con prefijos del SI (mili, kilo) en masas y volúmenes: aplica el Sistema Internacional.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s20',
    recurso: { tipo: 'practica', id: 'general.unidades-preparacion' },
    decision: 'confirmada',
    motivo: 'La práctica de errores de unidades obliga a pasar cada dato a la unidad que pide la fórmula: es análisis dimensional aplicado a una preparación.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s18',
    recurso: { tipo: 'tema', id: 'mol' },
    decision: 'retirada',
    motivo: 'El tema «mol» usa números grandes, pero no enseña ni practica la notación científica (escritura, producto y cociente de potencias de diez), que es el subtema.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s19',
    recurso: { tipo: 'tema', id: 'mol' },
    decision: 'retirada',
    motivo: 'El tema «mol» no trata las cifras significativas ni las reglas de redondeo de sumas y productos.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s21',
    recurso: { tipo: 'tabla' },
    decision: 'confirmada',
    motivo: 'La ficha de cada elemento en la tabla periódica muestra su densidad en kg/m³ con su procedencia: es un dato de densidad real que la lección usa.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s22',
    recurso: { tipo: 'escena', id: 'termo' },
    decision: 'retirada',
    motivo: 'La escena de energía de reacción usa la temperatura para calcular ΔG, pero no trata las escalas de temperatura ni las unidades de presión; la lección enlaza la escena N1 «gas-ideal».',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b1-s23',
    recurso: { tipo: 'peligros' },
    decision: 'confirmada',
    motivo: 'El catálogo de formas de peligro de la app recoge los pictogramas del sistema SGA: es el contenido de seguridad química elemental del subtema.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b2-s8',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'retirada',
    motivo: 'La Mesa «Explorar» muestra moléculas y sus átomos, pero no las partículas subatómicas ni el recuento de protones, neutrones y electrones; la lección enlaza la escena N1 «atomo», que sí los cuenta.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b2-s10',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'retirada',
    motivo: 'La Mesa «Explorar» no muestra el número másico ni los neutrones de cada átomo; la lección enlaza la escena N1 «atomo», donde se cambia N y se lee A.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b2-s11',
    recurso: { tipo: 'tabla' },
    decision: 'retirada',
    motivo: 'La tabla periódica de la app muestra la masa atómica media de cada elemento, pero no sus isótopos ni sus abundancias; la lección enlaza la escena N1 «atomo», donde se cambian los neutrones.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b2-s16',
    recurso: { tipo: 'tabla' },
    decision: 'confirmada',
    motivo: 'La ficha de cada elemento en la tabla periódica da su masa atómica en unidades de masa atómica (u): es el dato que la lección convierte a gramos.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b2-s21',
    recurso: { tipo: 'tabla' },
    decision: 'confirmada',
    motivo: 'La ficha de cada elemento en la tabla periódica muestra su configuración electrónica, incluidas las excepciones al orden de llenado: permite comprobar el principio de Aufbau.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b3-s2',
    recurso: { tipo: 'tabla' },
    decision: 'confirmada',
    motivo: 'La tabla periódica de la app ordena los elementos por número atómico y colorea las familias: muestra directamente la periodicidad que enuncia la ley periódica.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b3-s4',
    recurso: { tipo: 'tabla' },
    decision: 'confirmada',
    motivo: 'La tabla periódica dibuja los bloques s, p, d y f en su posición y la ficha de cada elemento da su configuración electrónica: permite relacionar el bloque con el subnivel que se llena.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b3-s5',
    recurso: { tipo: 'tabla' },
    decision: 'confirmada',
    motivo: 'El color por categoría de la tabla periódica distingue los metales alcalinos, alcalinotérreos, de transición y postransición: muestra qué zona ocupan los metales.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b3-s17',
    recurso: { tipo: 'tabla' },
    decision: 'retirada',
    motivo: 'La tabla periódica de la app no muestra energías de ionización; la lección enlaza la escena N1 «tendencias-periodicas», que sí da la primera energía de ionización de los elementos representativos.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b3-s20',
    recurso: { tipo: 'tabla' },
    decision: 'confirmada',
    motivo: 'El color por categoría de la tabla periódica muestra el paso de metales a metaloides y no metales en cada periodo y grupo: es el carácter metálico del subtema.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b3-s22',
    recurso: { tipo: 'tabla' },
    decision: 'confirmada',
    motivo: 'La ficha de cada elemento da su electronegatividad de Pauling y sus estados de oxidación: permite comparar esas tendencias entre elementos de un periodo o de un grupo.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s2',
    recurso: { tipo: 'mesa', id: 'enlaces' },
    decision: 'confirmada',
    motivo: 'Las secuencias de «Enlaces» de la Mesa muestran cómo cada átomo completa su capa externa al enlazarse y aplican las valencias típicas: ilustran la regla del octeto.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s3',
    recurso: { tipo: 'mesa', id: 'enlaces' },
    decision: 'confirmada',
    motivo: 'Las secuencias de «Enlaces» de la Mesa representan los electrones de valencia como puntos de Lewis antes y después de formar el enlace: son estructuras de Lewis paso a paso.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s4',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'confirmada',
    motivo: 'El visor de la Mesa muestra, en la ficha de cada átomo de la molécula, su carga formal: permite comprobar el cálculo de la lección sobre moléculas reales.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s11',
    recurso: { tipo: 'glosario', id: 'dipolo' },
    decision: 'confirmada',
    motivo: 'La entrada «momento dipolar» del glosario define la magnitud y su representación con una flecha: es la definición que usa la lección.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s12',
    recurso: { tipo: 'glosario', id: 'vsepr' },
    decision: 'confirmada',
    motivo: 'La entrada «VSEPR» del glosario explica que los pares de electrones se separan al máximo, que es lo que determina la geometría molecular.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s12',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'confirmada',
    motivo: 'El visor de la Mesa muestra las moléculas en tres dimensiones con su geometría: permite ver las formas lineal, angular, piramidal y tetraédrica.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s13',
    recurso: { tipo: 'glosario', id: 'vsepr' },
    decision: 'confirmada',
    motivo: 'La entrada «VSEPR» del glosario define la teoría de repulsión de los pares de electrones de la capa de valencia, que es el subtema.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s13',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'confirmada',
    motivo: 'El visor de la Mesa muestra la forma tridimensional de las moléculas, con la que se contrastan las predicciones de la teoría VSEPR.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s14',
    recurso: { tipo: 'glosario', id: 'hibridacion' },
    decision: 'confirmada',
    motivo: 'La entrada «hibridación» del glosario define el modelo de combinación de orbitales que trata el subtema.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b4-s21',
    recurso: { tipo: 'tema', id: 'enlace' },
    decision: 'retirada',
    motivo: 'El tema «Enlace iónico y covalente» clasifica enlaces por su diferencia de electronegatividad, pero no relaciona el tipo de enlace con propiedades como el punto de fusión o la conductividad; la lección enlaza la escena N1 «polaridad-enlace».',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b12-s1',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'confirmada',
    motivo: 'El visor de la Mesa muestra moléculas orgánicas reales en tres dimensiones, con sus cadenas de carbono y sus enlaces sencillos, dobles y triples: ilustra las propiedades del carbono que explica la lección.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b12-s2',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'confirmada',
    motivo: 'En el visor de la Mesa cada átomo de carbono aparece con sus cuatro enlaces y con la geometría que les corresponde: permite comprobar la tetravalencia sobre moléculas reales.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b12-s3',
    recurso: { tipo: 'mesa', id: 'explorar' },
    decision: 'confirmada',
    motivo: 'El visor de la Mesa permite ver cadenas lineales, ramificadas y cíclicas en tres dimensiones y girarlas: muestra que una cadena «lineal» es en realidad un zigzag.',
    fecha: '2026-11-19'
  },
  {
    subtema: 'n1-b12-s22',
    recurso: { tipo: 'sustancia', id: 'glucosa' },
    decision: 'confirmada',
    motivo: 'La ficha de la glucosa muestra la estructura cíclica del monómero del que están hechos el almidón y la celulosa, que la lección usa como ejemplo de polímero natural por condensación.',
    fecha: '2026-11-19'
  }
]
