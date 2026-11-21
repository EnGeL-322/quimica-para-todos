import type { RengIconName } from '@shared/manifest'

export interface RengAtajoInicio {
  modulo: string
  sub: string | null
  nombre: string
}

export interface RengTarjetaInicio {
  modulo: string
  sub: string | null
  titulo: string
  texto: string
  disciplina: string
  icono: RengIconName
  contarExperimentos?: boolean
  atajos: RengAtajoInicio[]
}

export const RENG_INICIO: {
  titulo: string
  intro: string
  tarjetas: RengTarjetaInicio[]
  cuaderno: RengAtajoInicio | null
  contexto: Partial<Record<string, string>>
  vacioReanudar: string
} = {
  titulo: 'Empezar',
  intro: 'Aprende, practica y simula química desde el bachillerato hasta el nivel profesional: elige un tema del catálogo, aprende con una lección, practica con corrección, abre la simulación o construye una molécula. Todo ocurre en tu propio equipo.',
  tarjetas: [
    {
      modulo: 'simulador-quimica',
      sub: 'catalogo',
      titulo: 'Catálogo de química',
      texto: 'Elige una rama y un tema: practica con ejercicios de cuatro niveles o simula el fenómeno, de preuniversitario a científico.',
      disciplina: 'quimica',
      icono: 'table',
      atajos: [
        { modulo: 'simulador-quimica', sub: 'aprender', nombre: 'Aprender' },
        { modulo: 'simulador-quimica', sub: 'practicas', nombre: 'Prácticas por nivel' },
        { modulo: 'simulador-quimica', sub: 'simulacion', nombre: 'Simulación' },
        { modulo: 'tabla-periodica', sub: null, nombre: 'Tabla periódica' }
      ]
    },
    {
      modulo: 'simulador-quimica',
      sub: 'mesa',
      titulo: 'Mesa molecular',
      texto: 'Arrastra elementos o escribe una sustancia: la mesa la identifica, la mide y la muestra en 3D.',
      disciplina: 'quimica',
      icono: 'flask',
      atajos: [
        { modulo: 'simulador-quimica', sub: 'mesa', nombre: 'Construir' },
        { modulo: 'simulador-quimica', sub: 'formulacion', nombre: 'Formulación' },
        { modulo: 'simulador-quimica', sub: 'reacciones', nombre: 'Reacciones' }
      ]
    }
  ],
  cuaderno: { modulo: 'laboratorio', sub: 'cuaderno', nombre: 'Abrir mi cuaderno' },
  contexto: {
    quimica: 'Catálogo, aprender, prácticas por nivel, simulación, casos reales y mesa molecular',
    laboratorio: 'Cuaderno y análisis de datos'
  },
  vacioReanudar: 'Todavía no hay trabajo reciente. Cuando abras una vista de Química o una herramienta, aparecerá aquí para retomarla con un clic.'
}
