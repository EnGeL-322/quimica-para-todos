import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_SOLUCIONES } from './lecciones'

export const RENG_CAPITULO_SOLUCIONES = rengCapituloN1(
  {
    bloque: 9,
    introduccion: 'Este capítulo estudia las disoluciones: mezclas homogéneas que están en el agua que bebemos, en los sueros, en los reactivos del laboratorio y en el aire. Empieza por qué es un soluto y un disolvente y cuánto soluto admite un disolvente; sigue con todas las formas de medir la concentración, y termina con cómo se diluyen, se mezclan y se preparan las disoluciones y con un primer efecto de las partículas disueltas: el descenso del punto de congelación.',
    objetivos: [
      'Distinguir soluto, disolvente, electrolitos y no electrolitos, y calcular los iones que libera una sal.',
      'Usar la solubilidad para decidir si una disolución está insaturada, saturada o sobresaturada y cuánto cristaliza.',
      'Calcular concentraciones en % m/m, % v/v, % m/v, molaridad, molalidad, fracción molar, normalidad, ppm y ppb.',
      'Convertir entre medidas de concentración usando la masa molar y la densidad.',
      'Resolver diluciones, mezclas y la preparación de disoluciones, también con hidratos.',
      'Calcular el descenso del punto de congelación y una masa molar a partir de él.'
    ],
    ruta: Array.from({ length: 20 }, (_rengX, rengI) => `n1-b9-s${rengI + 1}`),
    resumen: [
      'Una disolución es una mezcla homogénea; la masa se conserva al disolver, pero el volumen no siempre se suma.',
      'Los electrolitos fuertes liberan tantos iones como indica su fórmula y conducen la corriente.',
      'La solubilidad marca el límite: por debajo, insaturada; en ella, saturada; por encima, sobresaturada e inestable.',
      'Los porcentajes, las ppm y las ppb comparan masas o volúmenes; la molaridad usa litros de disolución y la molalidad, kilogramos de disolvente.',
      'La fracción molar cuenta partículas; la normalidad cuenta equivalentes y depende de la reacción.',
      'Al diluir o mezclar, los moles de soluto se conservan o se suman: c₁·V₁ = c₂·V₂.',
      'Las partículas disueltas bajan el punto de congelación: ΔT_f = K_f·b·i.'
    ]
  },
  RENG_LECCIONES_SOLUCIONES
)
