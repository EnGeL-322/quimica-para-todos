import { rengCapituloN1 } from '../capitulo'
import { RENG_LECCIONES_GASES } from './lecciones'

export const RENG_CAPITULO_GASES = rengCapituloN1(
  {
    bloque: 8,
    introduccion: 'Este capítulo estudia los gases con un único modelo, el del gas ideal, y lo usa para explicar las leyes clásicas (Boyle, Charles, Gay-Lussac, Avogadro), la ecuación P·V = n·R·T, las mezclas, el movimiento de las moléculas y, al final, cuándo deja de servir. Cada subtema tiene una lección con ejemplos resueltos, figuras, preguntas para comprobar y prácticas; varios incluyen una escena del gas ideal para explorar.',
    objetivos: [
      'Describir el estado de un gas con presión, volumen, temperatura y cantidad, y convertir sus unidades.',
      'Aplicar las leyes de Boyle, Charles, Gay-Lussac, Avogadro y la ley combinada con temperaturas absolutas.',
      'Usar P·V = n·R·T para calcular cantidades, masas molares, densidades y volúmenes de gases.',
      'Resolver problemas de mezclas de gases con presiones parciales y la ley de Dalton.',
      'Explicar las leyes de los gases con la teoría cinético-molecular y calcular velocidades moleculares.',
      'Reconocer cuándo un gas real se aparta del modelo ideal y estimar la desviación con van der Waals.'
    ],
    ruta: Array.from({ length: 20 }, (_rengX, rengI) => `n1-b8-s${rengI + 1}`),
    resumen: [
      'Un gas ocupa todo su recipiente; su estado se describe con P, V, T y n, y su presión se debe a los choques moleculares.',
      'Las leyes de Boyle (P·V constante), Charles (V/T constante), Gay-Lussac (P/T constante) y Avogadro (V/n constante) son casos de P·V = n·R·T.',
      'Las temperaturas van siempre en kelvin y las unidades de P y V deben concordar con las de R.',
      'La ecuación de estado permite calcular densidades (ρ = P·M/(R·T)), masas molares y volúmenes molares.',
      'En una mezcla, cada gas aporta su presión parcial, p_i = x_i·P_total, y la presión total es la suma.',
      'La teoría cinética relaciona la temperatura con la energía media de las moléculas; su velocidad depende de √(T/M), y de ahí la ley de Graham.',
      'A presión alta o temperatura baja los gases reales se apartan del modelo; Z y van der Waals miden y corrigen esa desviación.'
    ]
  },
  RENG_LECCIONES_GASES
)
