import type { RengCaso } from './tipos'

export const RENG_CASOS_HOGAR: RengCaso[] = [
  {
    id: 'pasta-dental',
    categoria: 'hogar',
    titulo: 'Pasta dental con flúor',
    gancho: 'Cómo un poco de flúor convierte el mineral de tu esmalte en uno más resistente al ácido.',
    portada: 'Ca5(PO4)3F',
    ideas: [
      { texto: 'El esmalte es casi todo hidroxiapatita, Ca₅(PO₄)₃OH (el artículo dice 96 %). Si el pH baja de unos 5,5, se disuelve un poco: es el inicio de una caries.', fuente: 'fiorillo2020' },
      { texto: 'El flúor de la pasta ayuda a formar fluorapatita, Ca₅(PO₄)₃F, que resiste mejor el ataque del ácido.', fuente: 'fiorillo2020' },
      { texto: 'Las pastas usan tres compuestos de flúor aceptados por la FDA de EE. UU.: fluoruro de sodio, fluoruro estannoso y monofluorofosfato de sodio.', fuente: 'fiorillo2020' }
    ],
    componentes: [
      { nombre: 'Fluoruro de sodio', formula: 'NaF', entrada: 'NaF', rol: 'Fuente de flúor iónica; libera F⁻ al disolverse.' },
      { nombre: 'Fluoruro estannoso', formula: 'SnF2', entrada: 'SnF2', rol: 'Fuente de flúor con estaño(II).' },
      { nombre: 'Monofluorofosfato de sodio (MFP)', formula: 'Na2PO3F', entrada: null, rol: 'El flúor está unido por enlace covalente; una enzima de la saliva lo libera.' },
      { nombre: 'Hidroxiapatita (esmalte)', formula: 'Ca5(PO4)3OH', entrada: null, rol: 'El mineral del esmalte.' },
      { nombre: 'Fluorapatita', formula: 'Ca5(PO4)3F', entrada: null, rol: 'El mineral que se forma con el flúor.' }
    ],
    ecuaciones: [
      {
        nombre: 'Del esmalte a la fluorapatita (ecuación simplificada)',
        reactivos: [{ coef: 1, formula: 'Ca5(PO4)3OH' }, { coef: 1, formula: 'F^-' }],
        productos: [{ coef: 1, formula: 'Ca5(PO4)3F' }, { coef: 1, formula: 'OH^-' }],
        nota: 'Resume el intercambio OH⁻ → F⁻ en la red del mineral; en la boca ocurre junto con la disolución y la recristalización.',
        fuente: null
      }
    ],
    detalles: [
      { texto: 'El MFP no es una sal de fluoruro: es un compuesto covalente que necesita la fosfatasa alcalina de la saliva para liberar flúor aprovechable.', fuente: 'fiorillo2020' },
      { texto: 'La revisión recomienda pastas de 1350–1500 ppm de flúor; en los estudios aparecen sobre todo 1000–1450 ppm.', fuente: 'fiorillo2020' },
      { texto: 'El fluoruro estannoso tiene además efecto antimicrobiano; puede dejar manchas oscuras superficiales, sobre todo cerca de restauraciones.', fuente: null },
      { texto: 'Masas molares: NaF 41,988 g/mol, SnF₂ 156,71 g/mol y Na₂PO₃F 143,950 g/mol (PubChem). Con ellas la app calcula el % de cada compuesto que da 1000 ppm de F (ver «Calculadora»).', fuente: 'pubchem' }
    ],
    limites: [
      'Las tres pastas son igual de eficaces contra la caries según algunas fuentes y otras no ven una ventaja clara de una sobre otra; la app no elige un «mejor».',
      'El % de fluoruro por compuesto lo calcula la app suponiendo que todo el flúor está disponible; en la pasta real parte del flúor puede no estarlo.',
      'No hay modelo 3D de las apatitas (son cristales con muchos átomos) ni del MFP; sí del NaF y del SnF₂.'
    ]
  },
  {
    id: 'vinagre-bicarbonato',
    categoria: 'hogar',
    titulo: 'Vinagre y bicarbonato: el volcán de la cocina',
    gancho: 'Un ácido débil y una sal básica: burbujas de CO₂ en segundos.',
    portada: 'CO2',
    ideas: [
      { texto: 'El vinagre contiene ácido acético, CH₃COOH. El bicarbonato de sodio es NaHCO₃.', fuente: null },
      { texto: 'Al juntarlos se forma acetato de sodio, agua y dióxido de carbono: las burbujas.', fuente: null },
      { texto: 'El CO₂ es un gas: por eso hay efervescencia.', fuente: null }
    ],
    componentes: [
      { nombre: 'Ácido acético', formula: 'CH3COOH', entrada: 'ácido acético', rol: 'El ácido del vinagre.' },
      { nombre: 'Bicarbonato de sodio', formula: 'NaHCO3', entrada: 'bicarbonato de sodio', rol: 'Sal básica.' },
      { nombre: 'Dióxido de carbono', formula: 'CO2', entrada: 'CO2', rol: 'Las burbujas.' },
      { nombre: 'Agua', formula: 'H2O', entrada: 'H2O', rol: 'Producto.' }
    ],
    ecuaciones: [
      {
        nombre: 'Ácido acético + bicarbonato',
        reactivos: [{ coef: 1, formula: 'CH3COOH' }, { coef: 1, formula: 'NaHCO3' }],
        productos: [{ coef: 1, formula: 'CH3COONa' }, { coef: 1, formula: 'H2O' }, { coef: 1, formula: 'CO2' }],
        fuente: null
      }
    ],
    detalles: [{ texto: 'Es una reacción ácido–base seguida de la descomposición del ácido carbónico en agua y CO₂.', fuente: null }],
    limites: ['Sin fuente consultada: química de libro de texto.']
  }
]
