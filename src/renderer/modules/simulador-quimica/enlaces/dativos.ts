import { RENG_GEOMETRIAS } from '../nucleo/datosEnlace'
import { rengComa, type RengPasoEnlace, type RengSecuenciaDativa } from './tipos'

const RENG_GREENWOOD = 'N. N. Greenwood y A. Earnshaw, Chemistry of the Elements, 2.ª ed. (1997): geometría de NH₄⁺ (tetraédrica), H₃O⁺ (piramidal) y [Cu(NH₃)₄]²⁺ (plano-cuadrada)'
const RENG_AVISO_DISTANCIAS = 'Las distancias del producto (N–H en NH₄⁺, O–H en H₃O⁺, B–N en H₃N·BF₃ y Cu–N) no tienen en la app un valor con fuente verificada: se dibujan aproximadas y no se muestran como dato.'

const rengNh3 = RENG_GEOMETRIAS.NH3!
const rengH2o = RENG_GEOMETRIAS.H2O!
const rengBf3 = RENG_GEOMETRIAS.BF3!

function rengPaso(rengTitulo: string, rengTexto: string, rengNotaciones: string[], rengExtra: Partial<RengPasoEnlace> = {}): RengPasoEnlace {
  return { titulo: rengTitulo, texto: rengTexto, notaciones: rengNotaciones, duracion: 3.5, ...rengExtra }
}

const rengDatosNH3: Array<[string, string]> = [
  ['Longitud N–H en NH₃', `${rengComa(rengNh3.valor.enlaces['N–H']!, 3)} Å`],
  ['Ángulo H–N–H en NH₃', `${rengComa(rengNh3.valor.angulos!['H–N–H']!, 1)}°`]
]

export function rengDativas(): RengSecuenciaDativa[] {
  return [
    {
      tipo: 'dativo',
      id: 'nh4',
      nombre: 'NH₄⁺ (amonio)',
      formula: 'NH4^+',
      dador: 'NH3',
      aceptor: 'H+',
      nDadores: 1,
      pasos: [
        rengPaso('El dador y su par libre', 'En el NH₃, el nitrógeno tiene un par de electrones que no usa en ningún enlace: un par libre.', ['NH3'], { avanzado: rengDatosNH3 }),
        rengPaso('El aceptor: un hueco vacío', 'El ion H⁺ es un protón solo: no tiene ningún electrón, solo un orbital vacío.', ['H^+']),
        rengPaso(
          'El par forma el enlace',
          'El nitrógeno pone los dos electrones de su par libre y se forma un nuevo enlace N–H. La flecha N→H indica que los dos electrones vienen del nitrógeno: es un enlace dativo.',
          ['NH3 + H^+ -> NH4^+'],
          { duracion: 4 }
        ),
        rengPaso(
          'Cuatro enlaces idénticos',
          'Una vez formado, el enlace dativo es igual que los otros: los cuatro N–H del NH₄⁺ son idénticos y apuntan a los vértices de un tetraedro (109,5°). Ya no se puede saber cuál fue el dativo. La carga + pertenece a todo el ion.',
          ['NH4^+'],
          { nota: 'Tetraedro regular: ángulo H–N–H = 109,5°', avanzado: [['Ángulo H–N–H', '109,47° (tetraedro regular, por simetría)']] }
        )
      ],
      saberMas: [
        'La flecha del enlace dativo solo cuenta la historia de cómo se formó. En la molécula final no hay ninguna diferencia medible entre ese enlace y los demás.',
        RENG_AVISO_DISTANCIAS
      ],
      fuentes: [rengNh3.fuente, RENG_GREENWOOD]
    },
    {
      tipo: 'dativo',
      id: 'h3o',
      nombre: 'H₃O⁺ (oxonio)',
      formula: 'H3O^+',
      dador: 'H2O',
      aceptor: 'H+',
      nDadores: 1,
      pasos: [
        rengPaso('El dador y sus pares libres', 'El oxígeno del agua tiene dos pares libres. Usará uno de ellos.', ['H2O'], {
          avanzado: [
            ['Longitud O–H en H₂O', `${rengComa(rengH2o.valor.enlaces['O–H']!, 4)} Å`],
            ['Ángulo H–O–H en H₂O', `${rengComa(rengH2o.valor.angulos!['H–O–H']!, 1)}°`]
          ]
        }),
        rengPaso('El aceptor: un protón', 'El H⁺ no tiene electrones: ofrece un orbital vacío.', ['H^+']),
        rengPaso('El par forma el enlace', 'El oxígeno aporta los dos electrones de uno de sus pares libres: se forma un tercer enlace O–H, dativo.', ['H2O + H^+ -> H3O^+'], { duracion: 4 }),
        rengPaso(
          'Resultado: una pirámide',
          'Los tres O–H son iguales y forman una pirámide trigonal, como el NH₃; al oxígeno le queda un par libre. Este ion es el que hace ácidas las disoluciones en agua.',
          ['H3O^+'],
          { nota: 'Geometría piramidal (dibujo aproximado)' }
        )
      ],
      saberMas: ['En el agua, el H⁺ nunca está solo: siempre está unido a moléculas de agua, como H₃O⁺ o agregados mayores.', RENG_AVISO_DISTANCIAS],
      fuentes: [rengH2o.fuente, RENG_GREENWOOD]
    },
    {
      tipo: 'dativo',
      id: 'nh3bf3',
      nombre: 'NH₃→BF₃ (aducto)',
      formula: 'H3NBF3',
      dador: 'NH3',
      aceptor: 'BF3',
      nDadores: 1,
      pasos: [
        rengPaso('El dador: NH₃', 'El nitrógeno del amoniaco tiene un par libre disponible.', ['NH3'], { avanzado: rengDatosNH3 }),
        rengPaso(
          'El aceptor: BF₃',
          'El boro del BF₃ solo tiene 6 electrones a su alrededor y un orbital p vacío, perpendicular al plano de la molécula.',
          ['BF3'],
          { avanzado: [['Longitud B–F en BF₃', `${rengComa(rengBf3.valor.enlaces['B–F']!, 3)} Å`], ['Ángulo F–B–F', '120° (plana)']] }
        ),
        rengPaso('El par forma el enlace', 'El par libre del N entra en el orbital vacío del B: se forma el enlace dativo N→B.', ['NH3 + BF3 -> H3NBF3'], { duracion: 4 }),
        rengPaso(
          'Resultado: el boro deja de ser plano',
          'Con cuatro enlaces, los F del boro se doblan hacia atrás y el B pasa de plano a casi tetraédrico. Así el boro completa sus 8 electrones.',
          ['H3NBF3'],
          { nota: 'Distancia B–N: sin valor verificado en la app' }
        )
      ],
      saberMas: ['Este tipo de reacción (dador de par + aceptor de par) es una reacción ácido-base de Lewis: el NH₃ es la base y el BF₃, el ácido.', RENG_AVISO_DISTANCIAS],
      fuentes: [rengNh3.fuente, rengBf3.fuente, RENG_GREENWOOD]
    },
    {
      tipo: 'dativo',
      id: 'cunh3',
      nombre: '[Cu(NH₃)₄]²⁺ (complejo)',
      formula: '[Cu(NH3)4]^2+',
      dador: 'NH3',
      aceptor: 'Cu2+',
      nDadores: 4,
      pasos: [
        rengPaso('Cuatro dadores', 'Cuatro moléculas de NH₃ se acercan, cada una con su par libre apuntando hacia el centro.', ['4NH3'], { avanzado: rengDatosNH3 }),
        rengPaso('El aceptor: Cu²⁺', 'El ion cobre(II) ha perdido dos electrones y tiene orbitales vacíos que pueden aceptar pares de electrones.', ['Cu^2+']),
        rengPaso('Cuatro enlaces dativos', 'Cada nitrógeno cede su par libre al cobre: se forman cuatro enlaces dativos N→Cu a la vez.', ['Cu^2+ + 4NH3 -> [Cu(NH3)4]^2+'], { duracion: 4.5 }),
        rengPaso(
          'Ligandos y número de coordinación',
          'Las moléculas que ceden un par al metal se llaman ligandos. Aquí el cobre tiene 4 ligandos: su número de coordinación es 4, en un cuadrado plano. El ion tiene un color azul intenso.',
          ['[Cu(NH3)4]^2+'],
          { nota: 'Número de coordinación 4 · geometría plano-cuadrada', avanzado: [['Ligandos', '4 NH₃'], ['Número de coordinación', '4'], ['Geometría', 'plano-cuadrada']] }
        )
      ],
      saberMas: [
        'En disolución acuosa el ion lleva además dos moléculas de agua más alejadas, encima y debajo del plano: [Cu(NH₃)₄(H₂O)₂]²⁺ (un octaedro alargado por el efecto Jahn-Teller).',
        'Las fórmulas de los complejos se escriben entre corchetes, con la carga total fuera.',
        RENG_AVISO_DISTANCIAS
      ],
      fuentes: [rengNh3.fuente, RENG_GREENWOOD]
    }
  ]
}
