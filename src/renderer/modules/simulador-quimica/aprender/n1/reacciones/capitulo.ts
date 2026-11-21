import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_REACCIONES } from './lecciones'

export const RENG_CAPITULO_REACCIONES = rengCapituloN1(
  {
    bloque: 6,
    introduccion: 'Este capítulo trata las reacciones químicas: qué son, cómo se escriben y ajustan (por tanteo, algebraicamente y por el método del ion-electrón) y por qué se conserva la masa. Recorre los tipos de reacción (síntesis, descomposición, desplazamiento simple y doble, precipitación, neutralización y combustión), distingue las reversibles, las exotérmicas y las endotérmicas, y termina con la oxidación, la reducción y los agentes oxidantes y reductores.',
    objetivos: [
      'Escribir e interpretar ecuaciones químicas con coeficientes enteros mínimos.',
      'Ajustar ecuaciones por tanteo, algebraicamente y por el método del ion-electrón.',
      'Aplicar la conservación de la masa y las proporciones de la ecuación.',
      'Clasificar reacciones y predecir sus productos.',
      'Calcular el calor liberado o absorbido a partir de ΔH.',
      'Identificar oxidante y reductor y contar los electrones transferidos.'
    ],
    ruta: Array.from({ length: 20 }, (_rengX, rengI) => `n1-b6-s${rengI + 1}`),
    resumen: [
      'En una reacción los átomos se reorganizan: se conservan los elementos, la carga y la masa.',
      'Los coeficientes son proporciones en moles; se ajustan sin tocar los subíndices.',
      'El tanteo sirve para ecuaciones sencillas; el método algebraico funciona siempre.',
      'Síntesis, descomposición, desplazamientos, precipitación, neutralización y combustión son los tipos básicos.',
      'Las reacciones reversibles llegan a un equilibrio sin agotar los reactivos.',
      'Exotérmicas: ΔH < 0 y liberan calor; endotérmicas: ΔH > 0 y lo absorben.',
      'El oxidante gana electrones y se reduce; el reductor los cede y se oxida.'
    ]
  },
  RENG_LECCIONES_REACCIONES
)
