import { RENG_DIATOMICAS, RENG_GEOMETRIAS, rengParametrosMorse } from '../nucleo/datosEnlace'
import { RENG_FUENTES_3D } from '../nucleo/elementos3d'
import { rengCapaExterna, rengComa, rengNombreEl, type RengPasoEnlace, type RengSecuenciaMultiple } from './tipos'

const RENG_FUENTE_HIBRIDACION = 'L. Pauling, The Nature of the Chemical Bond, 3.ª ed. (1960), cap. 4 (hibridación); IUPAC Gold Book («sigma, pi»)'

interface RengConfig {
  id: string
  formula: string
  centro: string
  orden: 2 | 3
  hibridacion: 'sp' | 'sp2'
  hidrogenos: number
  longitud: number
  longitudH: number
  anguloHCH: number | null
  diatomica: string | null
  fuenteGeo: string
}

function rengMultiple(rengC: RengConfig): RengSecuenciaMultiple {
  const rengV = rengCapaExterna(rengC.centro)
  const rengNom = rengNombreEl(rengC.centro)
  const rengNPi = rengC.orden - 1
  const rengNSigma = 1 + 2 * rengC.hidrogenos
  const rengHib = rengC.hibridacion === 'sp2' ? 'sp²' : 'sp'
  const rengEnlace = rengC.orden === 2 ? 'doble' : 'triple'
  const rengSimbolo = rengC.orden === 2 ? '=' : '≡'
  const rengMorse = rengC.diatomica ? rengParametrosMorse(RENG_DIATOMICAS[rengC.diatomica]!) : null
  const rengReactivos = rengC.hidrogenos ? `2${rengC.centro} + ${2 * rengC.hidrogenos}H` : `2${rengC.centro}`
  const rengRigidez = rengC.orden === 2 && rengC.hidrogenos === 2
  const rengComparte = rengC.hidrogenos
    ? `Cada carbono tiene ${rengV} electrones de valencia: usa ${rengC.hidrogenos} para unirse a ${rengC.hidrogenos === 1 ? 'un hidrógeno' : 'dos hidrógenos'} y le quedan ${rengV - rengC.hidrogenos} para el otro carbono.`
    : `Cada átomo de ${rengNom} tiene ${rengV} electrones de valencia y le faltan ${8 - rengV} para completar 8: los dos átomos comparten ${rengC.orden} pares.`
  const rengPasos: RengPasoEnlace[] = [
    {
      titulo: 'Electrones de valencia',
      texto: `${rengComparte} Por eso entre los dos ${rengC.hidrogenos ? 'carbonos' : 'átomos'} hay un enlace ${rengEnlace}.`,
      notaciones: [rengReactivos],
      nota: `${rengC.centro}${rengSimbolo}${rengC.centro}: orden de enlace ${rengC.orden}`,
      duracion: 3
    },
    {
      titulo: `Hibridación ${rengHib}`,
      texto:
        rengC.hibridacion === 'sp2'
          ? `El ${rengNom} mezcla su orbital 2s con dos orbitales 2p: salen tres orbitales híbridos sp² en un plano, a 120°. Le queda un orbital p sin mezclar, perpendicular a ese plano.`
          : `El ${rengNom} mezcla su orbital 2s con un orbital 2p: salen dos híbridos sp en línea, a 180°. Le quedan dos orbitales p sin mezclar, perpendiculares entre sí.`,
      notaciones: [],
      nota: rengC.hibridacion === 'sp2' ? 'Lóbulos sp² en el plano · un orbital p arriba y abajo' : 'Lóbulos sp en línea · dos orbitales p perpendiculares',
      avanzado: [
        [`Hibridación de cada ${rengNom}`, rengHib],
        ['Orbitales p sin hibridar por átomo', String(rengC.hibridacion === 'sp2' ? 1 : 2)],
        ...(rengC.hidrogenos ? [] : [['Nota', 'Para O₂ y N₂ la hibridación es un modelo simplificado; la descripción precisa es la de orbitales moleculares.'] as [string, string]])
      ],
      duracion: 3.5
    },
    {
      titulo: 'Enlace σ: solapamiento frontal',
      texto: `Los dos átomos se acercan y sus híbridos se solapan de frente, sobre la línea que une los núcleos: es el enlace σ, el primero que se forma.`,
      notaciones: [rengC.formula],
      nota: rengMorse ? `rₑ = ${rengComa(rengMorse.re, 3)} Å · energía de enlace D₀ = ${rengComa(rengMorse.D0, 0)} kJ/mol` : `${rengC.centro}${rengSimbolo}${rengC.centro} = ${rengComa(rengC.longitud, 3)} Å`,
      duracion: 3.5
    },
    {
      titulo: 'Enlace π: solapamiento lateral',
      texto: `Los orbitales p que sobraron se solapan de lado, por encima y por debajo del eje: ${rengNPi === 1 ? 'un enlace π' : 'dos enlaces π, en dos planos perpendiculares'}. Un enlace ${rengEnlace} es 1 σ + ${rengNPi} π.`,
      notaciones: [rengC.formula],
      nota: `${rengNSigma} ${rengNSigma === 1 ? 'enlace σ' : 'enlaces σ'} + ${rengNPi} ${rengNPi === 1 ? 'enlace π' : 'enlaces π'} en la molécula`,
      avanzado: [
        ['Enlaces σ', String(rengNSigma)],
        ['Enlaces π', String(rengNPi)],
        [`Longitud ${rengC.centro}${rengSimbolo}${rengC.centro}`, `${rengComa(rengC.longitud, 3)} Å`],
        ...(rengC.hidrogenos ? [[`Longitud C–H`, `${rengComa(rengC.longitudH, 3)} Å`] as [string, string]] : []),
        ...(rengC.anguloHCH ? [['Ángulo H–C–H', `${rengComa(rengC.anguloHCH, 1)}°`] as [string, string]] : [])
      ],
      duracion: 3.5
    }
  ]
  if (rengRigidez) {
    rengPasos.push({
      titulo: 'El doble enlace no gira',
      texto:
        'Si intentas girar un extremo, los orbitales p dejan de estar paralelos y el enlace π se rompería. Por eso el doble enlace queda bloqueado: no gira libremente (y por eso existen isómeros cis y trans).',
      notaciones: [rengC.formula],
      nota: 'Al girar, el solapamiento π disminuye y la molécula vuelve a su sitio',
      duracion: 4
    })
  }
  const rengSaberMas = [
    'Un enlace σ permite girar a los dos átomos sin romperse; un enlace π, no, porque necesita que los orbitales p estén paralelos.',
    `Más enlaces entre dos átomos significa un enlace más corto y más fuerte.`
  ]
  if (rengC.centro === 'O') {
    rengSaberMas.unshift(
      'El O₂ es paramagnético: tiene dos electrones desapareados y un imán lo atrae. La estructura de Lewis (O=O, todos los electrones en pares) no lo predice. Lo explica la teoría de orbitales moleculares: los dos últimos electrones ocupan, uno en cada uno, dos orbitales π* de la misma energía. El orden de enlace sigue siendo 2.'
    )
  }
  if (rengC.centro === 'N') rengSaberMas.unshift('El N₂ tiene orden de enlace 3, uno de los enlaces más fuertes que se conocen: por eso el nitrógeno del aire es tan poco reactivo.')
  return {
    tipo: 'multiple',
    id: rengC.id,
    nombre: `${rengC.formula.replace(/(\d)/g, (rengD) => '₀₁₂₃₄₅₆₇₈₉'[Number(rengD)] ?? rengD)} (${rengEnlace})`,
    formula: rengC.formula,
    centro: rengC.centro,
    orden: rengC.orden,
    hibridacion: rengC.hibridacion,
    hidrogenos: rengC.hidrogenos,
    longitud: rengC.longitud,
    longitudH: rengC.longitudH,
    anguloHCH: rengC.anguloHCH,
    diatomica: rengC.diatomica,
    rigidez: rengRigidez,
    pasos: rengPasos,
    saberMas: rengSaberMas,
    fuentes: [rengC.fuenteGeo, RENG_FUENTE_HIBRIDACION, RENG_FUENTES_3D.rc]
  }
}

export function rengMultiples(): RengSecuenciaMultiple[] {
  const rengEti = RENG_GEOMETRIAS.C2H4!
  const rengAce = RENG_GEOMETRIAS.C2H2!
  return [
    rengMultiple({ id: 'o2', formula: 'O2', centro: 'O', orden: 2, hibridacion: 'sp2', hidrogenos: 0, longitud: RENG_DIATOMICAS.O2!.re, longitudH: 0, anguloHCH: null, diatomica: 'O2', fuenteGeo: RENG_DIATOMICAS.O2!.fuente }),
    rengMultiple({ id: 'n2', formula: 'N2', centro: 'N', orden: 3, hibridacion: 'sp', hidrogenos: 0, longitud: RENG_DIATOMICAS.N2!.re, longitudH: 0, anguloHCH: null, diatomica: 'N2', fuenteGeo: RENG_DIATOMICAS.N2!.fuente }),
    rengMultiple({
      id: 'c2h4',
      formula: 'C2H4',
      centro: 'C',
      orden: 2,
      hibridacion: 'sp2',
      hidrogenos: 2,
      longitud: rengEti.valor.enlaces['C=C']!,
      longitudH: rengEti.valor.enlaces['C–H']!,
      anguloHCH: rengEti.valor.angulos!['H–C–H']!,
      diatomica: null,
      fuenteGeo: rengEti.fuente
    }),
    rengMultiple({
      id: 'c2h2',
      formula: 'C2H2',
      centro: 'C',
      orden: 3,
      hibridacion: 'sp',
      hidrogenos: 1,
      longitud: rengAce.valor.enlaces['C≡C']!,
      longitudH: rengAce.valor.enlaces['C–H']!,
      anguloHCH: null,
      diatomica: null,
      fuenteGeo: rengAce.fuente
    })
  ]
}
