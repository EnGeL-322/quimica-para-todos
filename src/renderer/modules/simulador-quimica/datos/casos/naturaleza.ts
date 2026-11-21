import type { RengCaso } from './tipos'

export const RENG_CASOS_NATURALEZA: RengCaso[] = [
  {
    id: 'aire',
    categoria: 'naturaleza',
    titulo: 'El aire que respiras',
    gancho: 'Casi todo es nitrógeno: el oxígeno que usas es solo la quinta parte.',
    portada: 'N2',
    ideas: [
      { texto: 'Cerca de la superficie, el aire es 78 % nitrógeno, 21 % oxígeno y 1 % otros gases como argón, CO₂ y neón.', fuente: 'nasa-tierra' },
      { texto: 'El nitrógeno, N₂, tiene un enlace triple muy fuerte: por eso casi no reacciona con lo que respiras.', fuente: null },
      { texto: 'Los océanos cubren cerca del 71 % de la superficie de la Tierra.', fuente: 'nasa-tierra' }
    ],
    componentes: [
      { nombre: 'Nitrógeno', formula: 'N2', entrada: 'N2', rol: 'El gas principal (78 %).' },
      { nombre: 'Oxígeno', formula: 'O2', entrada: 'O2', rol: 'El que respiras (21 %).' },
      { nombre: 'Argón', formula: 'Ar', entrada: 'Ar', rol: 'Gas noble, casi el 1 %.' },
      { nombre: 'Dióxido de carbono', formula: 'CO2', entrada: 'CO2', rol: 'Poco, pero clave para las plantas y el clima.' }
    ],
    ecuaciones: [],
    simulaciones: [{ id: 'gas', nombre: 'Gas ideal', porque: 'Presión, volumen y temperatura de una mezcla de gases como el aire.' }],
    datos: [
      { magnitud: 'Nitrógeno (N₂)', valor: '78 %', fuente: 'nasa-tierra' },
      { magnitud: 'Oxígeno (O₂)', valor: '21 %', fuente: 'nasa-tierra' },
      { magnitud: 'Otros gases (argón, CO₂, neón…)', valor: '1 %', fuente: 'nasa-tierra' },
      { magnitud: 'Aire seco por volumen', valor: '78,09 % N₂ · 20,95 % O₂ · 0,93 % Ar · 0,04 % CO₂', fuente: 'aire-seco' }
    ],
    detalles: [{ texto: 'El N₂ tiene un enlace triple: en la mesa de Explorar, arrastra dos N y súbele el orden al enlace para verlo.', fuente: null }],
    limites: [
      'Los porcentajes son del aire cerca de la superficie y seco; el vapor de agua varía según el lugar.',
      'Los decimales vienen de páginas secundarias vistas en un resumen de búsqueda, no de la NASA.'
    ]
  },
  {
    id: 'mar',
    categoria: 'naturaleza',
    titulo: 'El mar salado',
    gancho: 'En cada kilo de agua de mar hay unos 35 gramos de sal.',
    portada: 'NaCl',
    ideas: [
      { texto: 'El agua del océano contiene unas 35 000 ppm de sal. Como 1 ppm = 1 mg/kg, son unos 35 g de sal por kilo (conversión de la app).', fuente: 'usgs-salinidad' },
      { texto: 'La sal disuelta más común es el cloruro de sodio, NaCl.', fuente: 'usgs-salinidad' },
      { texto: 'Los océanos cubren cerca del 71 % de la superficie terrestre.', fuente: 'nasa-tierra' }
    ],
    componentes: [
      { nombre: 'Cloruro de sodio', formula: 'NaCl', entrada: 'NaCl', rol: 'La sal principal del mar.' },
      { nombre: 'Agua', formula: 'H2O', entrada: 'H2O', rol: 'El disolvente.' }
    ],
    ecuaciones: [
      {
        nombre: 'La sal se disuelve en iones',
        reactivos: [{ coef: 1, formula: 'NaCl' }],
        productos: [{ coef: 1, formula: 'Na^+' }, { coef: 1, formula: 'Cl^-' }],
        nota: 'En agua, los iones se separan y quedan rodeados de moléculas de agua.',
        fuente: null
      }
    ],
    simulaciones: [{ id: 'arquimedes', nombre: 'Arquímedes', porque: 'La flotabilidad depende de la densidad del líquido; el agua salada es más densa que la dulce (conocimiento general).' }],
    datos: [
      { magnitud: 'Sal disuelta en el océano', valor: '≈ 35 000 ppm (≈ 3,5 %)', fuente: 'usgs-salinidad' },
      { magnitud: 'Sal por kilo de agua de mar', valor: '≈ 35 g/kg (calculado: 1 ppm = 1 mg/kg)', fuente: null }
    ],
    detalles: [{ texto: 'La fuente nombra al cloruro de sodio como la sal más común, pero no dice cuál ion (sodio o cloruro) es más abundante.', fuente: 'usgs-salinidad' }],
    limites: ['La app no afirma qué ion es más abundante porque la fuente no lo dice.', 'La salinidad varía según el lugar: 35 000 ppm es un valor típico, no uno para cada mar.']
  },
  {
    id: 'capa-ozono',
    categoria: 'naturaleza',
    titulo: 'La capa de ozono',
    gancho: 'Una capa de gas O₃, a 10–50 km de altura, absorbe casi toda la luz ultravioleta del Sol.',
    portada: 'O3',
    ideas: [
      { texto: 'El ozono es un gas hecho de tres átomos de oxígeno, O₃.', fuente: 'nasa-ozono' },
      { texto: 'El 90 % del ozono de la atmósfera está en la estratosfera, entre unos 10 y 50 km de altura.', fuente: 'nasa-ozono' },
      { texto: 'El ozono de la estratosfera absorbe la mayor parte de la radiación ultravioleta del Sol.', fuente: 'nasa-ozono' }
    ],
    componentes: [
      { nombre: 'Oxígeno', formula: 'O2', entrada: 'O2', rol: 'De donde se forma el ozono.' },
      { nombre: 'Ozono', formula: 'O3', entrada: 'O3', rol: 'El gas que protege del ultravioleta.' }
    ],
    ecuaciones: [
      { nombre: 'Del oxígeno al ozono (balance neto)', reactivos: [{ coef: 3, formula: 'O2' }], productos: [{ coef: 2, formula: 'O3' }], nota: 'En la estratosfera pasa por átomos de oxígeno que libera la luz ultravioleta; aquí solo el balance neto.', fuente: null }
    ],
    simulaciones: [{ id: 'fotoelectrico', nombre: 'Efecto fotoeléctrico', porque: 'La luz ultravioleta está hecha de fotones de alta energía, capaces de arrancar electrones de un metal.' }],
    datos: [
      { magnitud: 'Masa molar del ozono', valor: '47,998 g/mol (CID 24823)', fuente: 'pubchem' },
      { magnitud: 'Altura de la capa', valor: '≈ 10–50 km (estratosfera)', fuente: 'nasa-ozono' },
      { magnitud: 'Ozono atmosférico en la estratosfera', valor: '90 %', fuente: 'nasa-ozono' }
    ],
    detalles: [{ texto: 'Mira «El aparato de ozono de 1896»: Tesla patentó una máquina para producir este gas con descargas eléctricas.', fuente: null }],
    limites: ['La fuente consultada no explica cómo se forma o se destruye el ozono: la ecuación es el balance neto de libro de texto.', 'La app no simula la capa de ozono.']
  },
  {
    id: 'rayos',
    categoria: 'naturaleza',
    titulo: 'Rayos: el aire que se rompe',
    gancho: 'Un rayo parte N₂ y O₂ y los recombina en óxidos de nitrógeno.',
    portada: 'NO',
    ideas: [
      { texto: 'En el canal de un rayo se superan los 20 000 K.', fuente: 'nasa-ntrs-rayos' },
      { texto: 'Esa temperatura rompe las moléculas de O₂ y N₂, y los átomos se recombinan en óxidos de nitrógeno (NOₓ).', fuente: 'nasa-ntrs-rayos' },
      { texto: 'El balance neto del primer paso es N₂ + O₂ → 2 NO.', fuente: null }
    ],
    componentes: [
      { nombre: 'Nitrógeno', formula: 'N2', entrada: 'N2', rol: 'Se rompe en el rayo.' },
      { nombre: 'Oxígeno', formula: 'O2', entrada: 'O2', rol: 'Se rompe en el rayo.' },
      { nombre: 'Monóxido de nitrógeno', formula: 'NO', entrada: 'monóxido de nitrógeno', rol: 'Lo que se forma.' }
    ],
    ecuaciones: [{ nombre: 'Aire + rayo', reactivos: [{ coef: 1, formula: 'N2' }, { coef: 1, formula: 'O2' }], productos: [{ coef: 2, formula: 'NO' }], fuente: null }],
    simulaciones: [{ id: 'lorentz', nombre: 'Fuerza de Lorentz', porque: 'Un rayo es una corriente de partículas cargadas; en un campo magnético se curvan.' }],
    detalles: [{ texto: 'Una descarga de alto voltaje en aire, como la de una bobina de Tesla, también produce ozono y óxidos de nitrógeno a pequeña escala (conocimiento general).', fuente: null }],
    limites: ['La fuente es un informe técnico visto solo en un resumen de búsqueda.', 'La app no calcula cuánto NO produce un rayo.']
  }
]
