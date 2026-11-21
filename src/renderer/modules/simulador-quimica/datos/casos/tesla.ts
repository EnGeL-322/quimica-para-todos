import type { RengCaso } from './tipos'

export const RENG_CASOS_TESLA: RengCaso[] = [
  {
    id: 'tesla-motor',
    categoria: 'tesla',
    titulo: 'El motor de inducción y el campo giratorio',
    gancho: 'Dos corrientes alternas desfasadas hacen girar un campo magnético… y con él, un motor.',
    portada: 'T',
    ideas: [
      { texto: 'La patente de EE. UU. 381 968 de Nikola Tesla (pedida el 12-oct-1887, concedida el 1-may-1888) describe un motor electromagnético alimentado por dos o más circuitos de corriente alterna.', fuente: 'patente-motor' },
      { texto: 'Como las corrientes de esos circuitos están desfasadas, los polos magnéticos del motor se desplazan por el anillo: nace un campo magnético giratorio que arrastra el rotor.', fuente: 'patente-motor' },
      { texto: 'George Westinghouse compró las patentes de Tesla en 1888 y juntos impulsaron la corriente alterna.', fuente: 'tesla-center' }
    ],
    componentes: [
      { nombre: 'Cobre', formula: 'Cu', entrada: 'Cu', rol: 'Metal de los bobinados de un motor (conocimiento general; la patente trata de circuitos y polos).' },
      { nombre: 'Hierro', formula: 'Fe', entrada: 'Fe', rol: 'Material típico de los núcleos magnéticos (conocimiento general).' }
    ],
    ecuaciones: [],
    simulaciones: [
      { id: 'lorentz', nombre: 'Fuerza de Lorentz', porque: 'Una carga en movimiento dentro de un campo magnético (medido en teslas) se desvía: la fuerza que hace girar un motor.' },
      { id: 'rlc', nombre: 'Circuito RLC', porque: 'Corriente alterna: tensión, corriente y desfase en un circuito.' }
    ],
    cronologia: [
      { cuando: '10-jul-1856', hecho: 'Nace Nikola Tesla en Smiljan (entonces Imperio austríaco).', fuente: 'tesla-center' },
      { cuando: '1882', hecho: 'Concibe en Budapest el campo magnético giratorio en que se basa el motor.', fuente: 'tesla-center' },
      { cuando: '12-oct-1887', hecho: 'Pide la patente 381 968 del motor electromagnético.', fuente: 'patente-motor' },
      { cuando: '1-may-1888', hecho: 'Se le concede la patente.', fuente: 'patente-motor' },
      { cuando: '1888', hecho: 'Westinghouse compra sus patentes y lo contrata como consultor.', fuente: 'tesla-center' },
      { cuando: '18-oct-1960', hecho: 'La 11.ª Conferencia General de Pesas y Medidas nombra «tesla» (T) a la unidad SI de densidad de flujo magnético.', fuente: 'tesla-unidad' }
    ],
    datos: [{ magnitud: 'Unidad «tesla» (T)', valor: '1 T = 1 Wb/m² (densidad de flujo magnético)', fuente: 'tesla-unidad' }],
    detalles: [{ texto: 'El Tesla Science Center dice que concibió el campo giratorio en Budapest en 1882: cinco años antes de pedir la patente.', fuente: 'tesla-center' }],
    limites: [
      'De la patente se vio un resumen (título, fechas y descripción), no el texto completo de las reivindicaciones.',
      'Britannica devolvió acceso denegado: no se usó.',
      'Los materiales (cobre, hierro) son conocimiento general, no de la patente.',
      'El origen exacto del nombre «tesla» (quién lo propuso) no se verificó.'
    ]
  },
  {
    id: 'tesla-bobina',
    categoria: 'tesla',
    titulo: 'La bobina de Tesla y la resonancia',
    gancho: 'Un transformador resonante que da chispas de alto voltaje y alta frecuencia.',
    portada: 'RLC',
    ideas: [
      { texto: 'La bobina de Tesla se inventó en 1891 (según Wikipedia).', fuente: 'wiki-bobina' },
      { texto: 'Es un transformador resonante eléctrico: entrega corriente alterna de alto voltaje, baja corriente y alta frecuencia.', fuente: 'wiki-bobina' },
      { texto: 'Hoy se usa sobre todo en demostraciones; las pequeñas sirven como detectores de fugas en sistemas de alto vacío.', fuente: 'wiki-bobina' }
    ],
    componentes: [
      { nombre: 'Nitrógeno', formula: 'N2', entrada: 'N2', rol: 'El aire entre los electrodos se ioniza y salta en chispa (conocimiento general).' },
      { nombre: 'Oxígeno', formula: 'O2', entrada: 'O2', rol: 'Con la chispa puede formar ozono (conocimiento general).' }
    ],
    ecuaciones: [],
    simulaciones: [
      { id: 'rlc', nombre: 'Circuito RLC', porque: 'La resonancia: un circuito responde al máximo cerca de su frecuencia natural. Es el principio de la bobina.' },
      { id: 'ondas', nombre: 'Ondas', porque: 'Frecuencia, longitud de onda y amplitud.' }
    ],
    cronologia: [{ cuando: '1891', hecho: 'Tesla inventa la bobina que lleva su nombre (fuente secundaria).', fuente: 'wiki-bobina' }],
    detalles: [{ texto: 'Para ver la resonancia, abre la simulación del circuito RLC y busca la frecuencia en que la corriente es máxima.', fuente: null }],
    limites: [
      'Wikipedia es una fuente secundaria: el año 1891 conviene contrastarlo con una biografía o una fuente primaria.',
      'La página del Tesla Science Center consultada no da el año de la bobina.',
      'La app no simula la bobina completa (dos circuitos acoplados y chispa).'
    ]
  },
  {
    id: 'tesla-ozono',
    categoria: 'tesla',
    titulo: 'El aparato de ozono de 1896',
    gancho: 'Tesla patentó una máquina que hacía ozono con descargas eléctricas en el aire.',
    portada: 'O3',
    ideas: [
      { texto: 'La patente de EE. UU. 568 177, «Apparatus for Producing Ozone», se pidió el 17-jun-1896 y se concedió el 22-sep-1896.', fuente: 'patente-ozono' },
      { texto: 'El aparato descarga un condensador por el primario de un transformador, con una corriente de aire entre superficies de descarga.', fuente: 'patente-ozono' },
      { texto: 'El ozono es una forma del oxígeno, O₃ (masa molar 47,998 g/mol según PubChem): 3 O₂ → 2 O₃.', fuente: 'pubchem' }
    ],
    componentes: [
      { nombre: 'Oxígeno', formula: 'O2', entrada: 'O2', rol: 'Lo que entra al aparato (en el aire).' },
      { nombre: 'Ozono', formula: 'O3', entrada: 'O3', rol: 'Lo que produce la descarga.' }
    ],
    ecuaciones: [{ nombre: 'Del oxígeno al ozono (balance neto)', reactivos: [{ coef: 3, formula: 'O2' }], productos: [{ coef: 2, formula: 'O3' }], nota: 'La descarga rompe O₂ en átomos que se unen a otras moléculas de O₂.', fuente: null }],
    simulaciones: [{ id: 'rlc', nombre: 'Circuito RLC', porque: 'Un condensador que se carga y descarga por una bobina: el circuito oscilante del aparato.' }],
    cronologia: [
      { cuando: '17-jun-1896', hecho: 'Tesla pide la patente 568 177.', fuente: 'patente-ozono' },
      { cuando: '22-sep-1896', hecho: 'Se le concede.', fuente: 'patente-ozono' }
    ],
    datos: [{ magnitud: 'Masa molar del ozono', valor: '47,998 g/mol (PubChem, CID 24823)', fuente: 'pubchem' }],
    detalles: [{ texto: 'Mira «La capa de ozono» para ver dónde está el ozono en la naturaleza y qué hace.', fuente: null }],
    limites: [
      'No se abrió el texto completo de la patente: solo el resumen del buscador.',
      'Una fuente secundaria dice que en 1900 Tesla fundó la «Tesla Ozone Company»; no se encontró una fuente primaria, así que NO se afirma.',
      'La app no simula la producción de ozono ni da rendimientos.'
    ]
  },
  {
    id: 'tesla-wardenclyffe',
    categoria: 'tesla',
    titulo: 'Wardenclyffe: la torre inalámbrica',
    gancho: 'El sueño de transmitir información y energía sin cables.',
    portada: 'λ',
    ideas: [
      { texto: 'En 1901 Tesla empezó a construir la torre de Wardenclyffe, en Long Island: el centro de su «Sistema Mundial Inalámbrico».', fuente: 'tesla-center' },
      { texto: 'La financió J. P. Morgan; los costos subieron, Morgan retiró su apoyo y la torre se desmanteló como chatarra en 1917.', fuente: 'tesla-center' },
      { texto: 'Tesla murió en Nueva York el 7 de enero de 1943, a los 86 años.', fuente: 'tesla-center' }
    ],
    componentes: [],
    ecuaciones: [],
    simulaciones: [{ id: 'ondas', nombre: 'Ondas', porque: 'La transmisión inalámbrica usa ondas: frecuencia, longitud de onda y propagación.' }],
    cronologia: [
      { cuando: '1901', hecho: 'Empieza la construcción de la torre de Wardenclyffe.', fuente: 'tesla-center' },
      { cuando: '1917', hecho: 'La torre se desmantela como chatarra.', fuente: 'tesla-center' },
      { cuando: '7-ene-1943', hecho: 'Muere Nikola Tesla en Nueva York.', fuente: 'tesla-center' }
    ],
    detalles: [{ texto: 'Las fechas de 1901 a 1917 son las que da el Tesla Science Center (c. 1901–1917).', fuente: 'tesla-center' }],
    limites: [
      'La app no verifica si el sistema habría funcionado: es historia, no física demostrada.',
      'No se consultó una fuente sobre sus experimentos de radio ni sobre la corriente inalámbrica.'
    ]
  }
]
