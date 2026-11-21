import type { RengCaso } from './tipos'

export const RENG_CASOS_ESPACIO: RengCaso[] = [
  {
    id: 'cohete',
    categoria: 'espacio',
    titulo: 'El combustible de un cohete',
    gancho: 'Hidrógeno y oxígeno: lo único que sale por la tobera es vapor de agua.',
    portada: 'H2 + O2',
    ideas: [
      { texto: 'Algunos cohetes queman hidrógeno con oxígeno: 2 H₂ + O₂ → 2 H₂O.', fuente: null },
      { texto: 'El producto es agua: sale como vapor muy caliente.', fuente: null },
      { texto: 'La reacción necesita una chispa para empezar y es muy exotérmica.', fuente: null }
    ],
    componentes: [
      { nombre: 'Hidrógeno', formula: 'H2', entrada: 'H2', rol: 'Combustible.' },
      { nombre: 'Oxígeno', formula: 'O2', entrada: 'O2', rol: 'Comburente.' },
      { nombre: 'Agua', formula: 'H2O', entrada: 'H2O', rol: 'Producto.' }
    ],
    ecuaciones: [{ nombre: 'Formación del agua', reactivos: [{ coef: 2, formula: 'H2' }, { coef: 1, formula: 'O2' }], productos: [{ coef: 2, formula: 'H2O' }], fuente: null }],
    simulaciones: [{ id: 'cohete', nombre: 'Cohete', porque: 'Empuje, masa que disminuye y aceleración: la física de lo que la reacción impulsa.' }],
    detalles: [{ texto: 'La química da el empuje; la simulación muestra el movimiento que resulta.', fuente: null }],
    limites: ['No se dan datos de empuje ni de temperatura: no se consultó una fuente.']
  },
  {
    id: 'venus',
    categoria: 'espacio',
    titulo: 'Venus: nubes de ácido sulfúrico',
    gancho: 'El planeta vecino tiene una atmósfera de CO₂ y nubes de H₂SO₄.',
    portada: 'H2SO4',
    ideas: [
      { texto: 'La atmósfera de Venus es mayormente dióxido de carbono.', fuente: 'nasa-venus' },
      { texto: 'Sus nubes densas están compuestas de ácido sulfúrico, H₂SO₄.', fuente: 'nasa-venus' },
      { texto: 'Puedes armar el H₂SO₄ en la mesa: un azufre central con dos enlaces dobles S=O y dos grupos O–H.', fuente: null }
    ],
    componentes: [
      { nombre: 'Dióxido de carbono', formula: 'CO2', entrada: 'CO2', rol: 'Gas principal de la atmósfera.' },
      { nombre: 'Ácido sulfúrico', formula: 'H2SO4', entrada: 'H2SO4', rol: 'Gotas de las nubes.' }
    ],
    ecuaciones: [],
    detalles: [{ texto: 'La fuente no da porcentajes de la atmósfera; la app no los incluye.', fuente: 'nasa-venus' }],
    limites: ['No hay datos de temperatura ni presión de Venus: no se consultaron.']
  },
  {
    id: 'marte',
    categoria: 'espacio',
    titulo: 'Marte: aire de CO₂ y suelo oxidado',
    gancho: 'El planeta rojo es rojo por la herrumbre.',
    portada: 'Fe2O3',
    ideas: [
      { texto: 'Marte tiene una atmósfera delgada hecha sobre todo de dióxido de carbono, nitrógeno y argón.', fuente: 'nasa-marte' },
      { texto: 'Se ve rojizo porque el hierro de sus rocas se oxidó, como el óxido de una reja.', fuente: 'nasa-marte' },
      { texto: 'Ese óxido es, en general, óxido de hierro(III), Fe₂O₃.', fuente: null }
    ],
    componentes: [
      { nombre: 'Dióxido de carbono', formula: 'CO2', entrada: 'CO2', rol: 'Gas principal.' },
      { nombre: 'Nitrógeno', formula: 'N2', entrada: 'N2', rol: 'Segundo gas.' },
      { nombre: 'Argón', formula: 'Ar', entrada: 'Ar', rol: 'Gas noble de la atmósfera.' },
      { nombre: 'Óxido de hierro(III)', formula: 'Fe2O3', entrada: 'Fe2O3', rol: 'Da el color rojizo.' }
    ],
    ecuaciones: [{ nombre: 'Oxidación del hierro', reactivos: [{ coef: 4, formula: 'Fe' }, { coef: 3, formula: 'O2' }], productos: [{ coef: 2, formula: 'Fe2O3' }], nota: 'Ecuación de libro de texto; en Marte intervienen otros oxidantes.', fuente: null }],
    detalles: [{ texto: 'La fuente no da porcentajes de los gases; no se incluyen.', fuente: 'nasa-marte' }],
    limites: ['La NASA habla de «oxidación del hierro»; que el compuesto sea Fe₂O₃ en concreto no se contrastó con la fuente.']
  },
  {
    id: 'titan',
    categoria: 'espacio',
    titulo: 'Titán: lagos de metano',
    gancho: 'Una luna de Saturno con lluvia, ríos y mares… de hidrocarburos.',
    portada: 'CH4',
    ideas: [
      { texto: 'Titán es la luna más grande de Saturno y la única con una atmósfera densa.', fuente: 'nasa-titan' },
      { texto: 'Tiene nubes, lluvia, ríos, lagos y mares de hidrocarburos líquidos como el metano y el etano.', fuente: 'nasa-titan' },
      { texto: 'El metano, CH₄, es la molécula orgánica más sencilla: un carbono con cuatro hidrógenos, tetraédrica (109,5°).', fuente: null }
    ],
    componentes: [
      { nombre: 'Metano', formula: 'CH4', entrada: 'CH4', rol: 'Líquido en sus lagos.' },
      { nombre: 'Etano', formula: 'C2H6', entrada: 'etano', rol: 'También líquido en sus mares.' },
      { nombre: 'Nitrógeno', formula: 'N2', entrada: 'N2', rol: 'Gas principal de la atmósfera (conocimiento general).' }
    ],
    ecuaciones: [],
    detalles: [{ texto: 'La composición de la atmósfera de Titán no figura en la página consultada; el nitrógeno se da como conocimiento general.', fuente: null }],
    limites: ['Sin datos de temperatura ni de proporciones.']
  },
  {
    id: 'moleculas-espacio',
    categoria: 'espacio',
    titulo: 'Moléculas entre las estrellas',
    gancho: 'Se han detectado unas 350 moléculas diferentes en el espacio.',
    portada: 'H2CO',
    ideas: [
      { texto: 'La base de datos de espectroscopia de Colonia lista 349 moléculas detectadas en el medio interestelar o alrededor de estrellas (oct. 2026).', fuente: 'cdms' },
      { texto: 'Entre ellas: H₂, CO, H₂O, NH₃, CH₃OH (metanol), HCN y H₂CO (formaldehído).', fuente: 'cdms' },
      { texto: 'Casi todas son sencillas: pocos átomos de H, C, N y O.', fuente: null }
    ],
    componentes: [
      { nombre: 'Hidrógeno molecular', formula: 'H2', entrada: 'H2', rol: 'La más abundante.' },
      { nombre: 'Monóxido de carbono', formula: 'CO', entrada: 'monóxido de carbono', rol: 'Trazador de las nubes de gas.' },
      { nombre: 'Agua', formula: 'H2O', entrada: 'H2O', rol: 'En nubes y cometas.' },
      { nombre: 'Amoniaco', formula: 'NH3', entrada: 'NH3', rol: 'Detectado en nubes.' },
      { nombre: 'Metanol', formula: 'CH3OH', entrada: 'metanol', rol: 'Alcohol interestelar.' },
      { nombre: 'Cianuro de hidrógeno', formula: 'HCN', entrada: 'C#N', rol: 'Molécula prebiótica.' },
      { nombre: 'Formaldehído', formula: 'H2CO', entrada: 'C=O', rol: 'Orgánica sencilla.' }
    ],
    ecuaciones: [],
    detalles: [{ texto: 'El recuento crece cada año: el número exacto de hoy puede ser mayor.', fuente: 'cdms' }],
    limites: ['«H₂ es la más abundante» es conocimiento general: la fuente solo la lista.']
  }
]
