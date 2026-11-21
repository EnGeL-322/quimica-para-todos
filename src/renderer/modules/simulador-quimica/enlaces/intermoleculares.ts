import { RENG_DISTANCIAS_INTER, RENG_EBULLICION_C, RENG_ENERGIAS_INTERACCION } from '../nucleo/datosEnlace'
import { rengMasaMolarDe } from '../nucleo/formula'
import { rengComa, type RengSecuenciaIntermolecular } from './tipos'

export function rengIntermoleculares(): RengSecuenciaIntermolecular[] {
  const rengPh = RENG_ENERGIAS_INTERACCION.puenteH!
  const rengOh = RENG_ENERGIAS_INTERACCION.covalenteOH!
  const rengAr = RENG_ENERGIAS_INTERACCION.londonAr!
  const rengOo = RENG_DISTANCIAS_INTER['O···O (dímero de agua)']!
  const rengArar = RENG_DISTANCIAS_INTER['Ar···Ar (mínimo)']!
  const rengEb = (rengF: string): string => `${rengComa(RENG_EBULLICION_C[rengF]!.valor, 0)} °C`
  return [
    {
      tipo: 'intermolecular',
      id: 'inter',
      nombre: 'Puente de H, dipolos y London',
      formula: 'H2O',
      pasos: [
        {
          titulo: 'Puente de hidrógeno',
          texto:
            'El H de una molécula de agua (δ+) es atraído por un par libre del O de otra (δ−). La línea de puntos es el puente de hidrógeno; las líneas continuas son enlaces covalentes de verdad.',
          notaciones: ['H2O + H2O'],
          nota: `Distancia O···O = ${rengComa(rengOo.valor, 3)} Å`,
          avanzado: [['Energía del puente (dímero, D₀)', `${rengComa(rengPh.valor!, 1)} kJ/mol`]],
          duracion: 3.5
        },
        {
          titulo: 'Una red de puentes',
          texto: 'En el agua líquida y en el hielo, cada molécula puede formar hasta cuatro puentes de hidrógeno con sus vecinas. Se rompen y se vuelven a formar continuamente.',
          notaciones: ['H2O'],
          nota: 'Disposición esquemática (no es una medida)',
          duracion: 3.5
        },
        {
          titulo: 'Dipolo-dipolo',
          texto: 'Las moléculas polares, como el HCl, se orientan: el extremo δ+ de una mira hacia el δ− de la otra. Es una atracción más débil que el puente de hidrógeno.',
          notaciones: ['HCl + HCl'],
          nota: 'Sin valor de energía verificado en la app: solo el orden cualitativo',
          duracion: 3.5
        },
        {
          titulo: 'Dispersión de London',
          texto:
            'Incluso átomos sin carga, como el argón, se atraen un poco: al moverse sus electrones aparecen dipolos instantáneos que se sincronizan. Son las fuerzas de London, presentes entre todas las moléculas.',
          notaciones: ['Ar + Ar'],
          nota: `Distancia Ar···Ar en el mínimo = ${rengComa(rengArar.valor, 2)} Å`,
          avanzado: [['Energía (profundidad del pozo)', `${rengComa(rengAr.valor!, 2)} kJ/mol`]],
          duracion: 4
        },
        {
          titulo: 'Débiles, pero deciden',
          texto: `Todas son mucho más débiles que un enlace covalente. Aun así deciden propiedades: el agua (${rengComa(rengMasaMolarDe('H2O'), 0)} g/mol) hierve a ${rengEb('H2O')}, mientras que el H₂S, más pesado (${rengComa(rengMasaMolarDe('H2S'), 0)} g/mol), hierve a ${rengEb('H2S')}. La diferencia son los puentes de hidrógeno.`,
          notaciones: [],
          nota: `Ebullición: H₂O ${rengEb('H2O')} · H₂S ${rengEb('H2S')} · HCl ${rengEb('HCl')} · Ar ${rengEb('Ar')}`,
          avanzado: [
            [rengOh.nombre, `${rengComa(rengOh.valor!, 1)} kJ/mol`],
            [rengPh.nombre, `${rengComa(rengPh.valor!, 1)} kJ/mol`],
            [rengAr.nombre, `${rengComa(rengAr.valor!, 2)} kJ/mol`]
          ],
          duracion: 3
        }
      ],
      saberMas: [
        RENG_ENERGIAS_INTERACCION.dipoloHCl!.nota!,
        'Los puntos de ebullición dependen de todas las fuerzas a la vez; la comparación H₂O / H₂S es la clásica porque son moléculas de la misma forma.',
        'En el dímero de agua, la energía D₀ es la que hay que dar para separar las dos moléculas desde su estado de menor energía.'
      ],
      fuentes: [rengPh.fuente, rengOh.fuente, rengAr.fuente, rengOo.fuente, RENG_EBULLICION_C.H2O!.fuente]
    }
  ]
}
