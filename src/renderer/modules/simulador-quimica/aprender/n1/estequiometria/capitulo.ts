import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_ESTEQUIOMETRIA } from './lecciones'

export const RENG_CAPITULO_ESTEQUIOMETRIA = rengCapituloN1(
  {
    bloque: 7,
    introduccion: 'Este capítulo enseña a contar átomos y moléculas pesándolos, y a usar ese recuento para predecir cuánto reacciona y cuánto se forma en una reacción química. Empieza por el mol, la masa molar y las fórmulas; sigue con las relaciones entre cantidades de una ecuación ajustada, y termina con los casos reales: reactivo limitante, rendimientos, purezas, mezclas, gases y secuencias de reacciones.',
    objetivos: [
      'Pasar entre masa, moles y número de entidades con la masa molar y la constante de Avogadro.',
      'Calcular masas molares, composiciones porcentuales y fórmulas empíricas y moleculares.',
      'Usar los coeficientes de una ecuación ajustada como razones molares en cálculos de moles, masas y volúmenes.',
      'Identificar el reactivo limitante y calcular el producto máximo y el exceso que sobra.',
      'Calcular rendimientos teóricos, reales y porcentuales, también en secuencias de reacciones.',
      'Resolver problemas con reactivos impuros, mezclas y gases.'
    ],
    ruta: Array.from({ length: 21 }, (_rengX, rengI) => `n1-b7-s${rengI + 1}`),
    resumen: [
      'El mol cuenta entidades: un mol son 6,02214076·10²³, y la masa molar convierte gramos en moles.',
      'La masa molar, la masa molecular y la masa fórmula se calculan sumando masas atómicas; la composición porcentual reparte la masa entre los elementos.',
      'La fórmula empírica sale de la proporción de moles de átomos; la molecular, de la masa molar.',
      'Los coeficientes de una ecuación ajustada son razones molares; todo cálculo de masas pasa por moles.',
      'El reactivo limitante fija el producto máximo (rendimiento teórico); el exceso sobra.',
      'El rendimiento real es menor que el teórico; el porcentual los compara, y en secuencias los rendimientos se multiplican.',
      'Con reactivos impuros solo cuenta la masa pura; con gases, la estequiometría se une a P·V = n·R·T.'
    ]
  },
  RENG_LECCIONES_ESTEQUIOMETRIA
)
