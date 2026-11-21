import { rengCapas } from '../../tabla-periodica/data'
import { rengCoordinacion, RENG_ESTRUCTURAS, rengUnidadesFormula } from '../nucleo/cristales'
import { RENG_AFINIDAD_EV, RENG_DIATOMICAS, rengEnergiaCoulombPar, RENG_IONIZACION_EV, RENG_KJMOL_POR_EV, rengParametrosMorse, RENG_RADIO_IONICO } from '../nucleo/datosEnlace'
import { rengDatos3D, RENG_FUENTES_3D } from '../nucleo/elementos3d'
import { rengCaracterIonico, rengElectronegatividad, RENG_FUENTE_EN } from '../nucleo/electronegatividad'
import { rengBonita } from '../nucleo/formula'
import { rengDativas } from './dativos'
import { rengIntermoleculares } from './intermoleculares'
import { rengMetalicas } from './metalicos'
import { rengMultiples } from './multiples'
import { rengCapaExterna, rengComa, rengConfig, rengElectrones, rengIon, RENG_NOBLES, rengNombreEl, rengZ, type RengPasoEnlace, type RengSecuencia, type RengSecuenciaCovalente, type RengSecuenciaIonica } from './tipos'

export * from './tipos'

function rengIonica(rengId: string, rengMetal: string, rengQM: number, rengNoMetal: string, rengQX: number, rengNX: number, rengEstructura: string): RengSecuenciaIonica {
  const rengE = RENG_ESTRUCTURAS[rengEstructura]!
  const rengXM = rengElectronegatividad(rengMetal)!
  const rengXX = rengElectronegatividad(rengNoMetal)!
  const rengDx = rengXX - rengXM
  const rengIM = rengIon(rengMetal, rengQM)
  const rengIX = rengIon(rengNoMetal, -rengQX)
  const rengRM = RENG_RADIO_IONICO[rengIM]!.valor
  const rengRX = RENG_RADIO_IONICO[rengIX]!.valor
  const rengFormula = rengE.formula
  const rengNomM = rengNombreEl(rengMetal)
  const rengNomX = rengNombreEl(rengNoMetal)
  const RENG_EI = RENG_IONIZACION_EV[rengMetal]!.valor.slice(0, rengQM).map((rengV) => rengV * RENG_KJMOL_POR_EV)
  const RENG_AE = RENG_AFINIDAD_EV[rengNoMetal]!.valor * RENG_KJMOL_POR_EV
  const rengNcM = rengCoordinacion(rengE, rengIM)
  const rengNcX = rengCoordinacion(rengE, rengIX)
  const rengIsoM = RENG_NOBLES[rengZ(rengMetal) - rengQM]
  const rengIsoX = RENG_NOBLES[rengZ(rengNoMetal) + rengQX]
  const rengCoefX = rengNX === 1 ? '' : String(rengNX)
  const rengEcuacionTransfer = `${rengMetal} + ${rengCoefX}${rengNoMetal} -> ${rengBonitaIon(rengIM)} + ${rengCoefX}${rengBonitaIon(rengIX)}`
  const rengPasos: RengPasoEnlace[] = [
    {
      titulo: 'Dos átomos neutros',
      texto: `El ${rengNomM} tiene ${rengElectrones(rengCapaExterna(rengMetal))} en su capa externa; el ${rengNomX}, ${rengCapaExterna(rengNoMetal)}. Los dos son neutros: tienen tantos electrones como protones.`,
      notaciones: [rengNX === 1 ? `${rengMetal} + ${rengNoMetal}` : `${rengMetal} + ${rengNX}${rengNoMetal}`],
      nota: `${rengMetal}: ${rengConfig(rengMetal)}   ·   ${rengNoMetal}: ${rengConfig(rengNoMetal)}`,
      avanzado: [
        [`Capas de ${rengMetal} (Bohr)`, rengCapas(rengZ(rengMetal)).join(', ')],
        [`Capas de ${rengNoMetal} (Bohr)`, rengCapas(rengZ(rengNoMetal)).join(', ')]
      ],
      duracion: 3
    },
    {
      titulo: '¿Quién atrae más los electrones?',
      texto: `El ${rengNomX} es mucho más electronegativo (${rengComa(rengXX)}) que el ${rengNomM} (${rengComa(rengXM)}). La diferencia, ${rengComa(rengDx)}, es mayor que 1,7: el ${rengNomX} no comparte electrones, se los queda. Por eso el enlace será iónico.`,
      notaciones: [],
      nota: `Δχ = ${rengComa(rengXX)} − ${rengComa(rengXM)} = ${rengComa(rengDx)} > 1,7  →  enlace iónico`,
      avanzado: [['Carácter iónico (Pauling)', `≈ ${Math.round(rengCaracterIonico(rengDx))} %`]],
      duracion: 3
    },
    {
      titulo: rengQM === 1 ? 'El electrón cambia de átomo' : 'Los electrones cambian de átomo',
      texto:
        rengNX === 1
          ? `El ${rengNomM} cede ${rengQM === 1 ? 'su electrón externo' : `sus ${rengQM} electrones externos`} al ${rengNomX}.`
          : `El ${rengNomM} cede sus ${rengQM} electrones externos: uno a cada átomo de ${rengNomX}.`,
      notaciones: [rengEcuacionTransfer],
      avanzado: [
        [`Energía de ionización de ${rengMetal}`, RENG_EI.map((rengV) => `${rengComa(rengV, 1)}`).join(' + ') + ' kJ/mol (cuesta energía)'],
        [`Afinidad electrónica de ${rengNoMetal}`, `${rengComa(RENG_AE, 1)} kJ/mol (se libera)`]
      ],
      duracion: 3.5
    },
    {
      titulo: 'Se forman los iones',
      texto: `El ${rengBonita(rengIM)} es más pequeño que el átomo de ${rengNomM}: ha perdido toda su capa externa. El ${rengBonita(rengIX)} es más grande que el átomo de ${rengNomX}: los electrones de más se repelen. ${rengIsoM && rengIsoX ? `Los dos quedan con la configuración de un gas noble (${rengIsoM} y ${rengIsoX}).` : ''}`,
      notaciones: [`${rengMetal} -> ${rengBonitaIon(rengIM)} + ${rengQM === 1 ? '' : rengQM}e-`, `${rengCoefX}${rengNoMetal} + ${rengQX * rengNX === 1 ? '' : rengQX * rengNX}e- -> ${rengCoefX}${rengBonitaIon(rengIX)}`],
      avanzado: [
        [`Radio de ${rengBonita(rengIM)} (Shannon, NC ${rengRM.nc})`, `${rengComa(rengRM.r)} Å`],
        [`Radio de ${rengBonita(rengIX)} (Shannon, NC ${rengRX.nc})`, `${rengComa(rengRX.r)} Å`],
        ['Radio covalente de los átomos (Cordero)', `${rengMetal} ${rengComa(rengDatos3D.get(rengMetal)!.rc!)} Å · ${rengNoMetal} ${rengComa(rengDatos3D.get(rengNoMetal)!.rc!)} Å`]
      ],
      duracion: 3.5
    },
    {
      titulo: 'Cargas opuestas se atraen',
      texto: `El ${rengBonita(rengIM)} y el ${rengBonita(rengIX)} se atraen por la fuerza eléctrica (ley de Coulomb): cuanto mayores son las cargas y más cerca están, más fuerte es la atracción. Esa atracción libera mucha más energía de la que costó mover los electrones.`,
      notaciones: [],
      nota: `Distancia de contacto ≈ r(${rengBonita(rengIM)}) + r(${rengBonita(rengIX)}) = ${rengComa(rengRM.r + rengRX.r)} Å`,
      avanzado: [['Energía de Coulomb de un par aislado', `${rengComa(rengEnergiaCoulombPar(rengQM, -rengQX, rengRM.r + rengRX.r), 0)} kJ/mol (1389,35·q₁q₂/r)`]],
      duracion: 3
    },
    {
      titulo: 'Una red, no una molécula',
      texto: `En el sólido, cada ${rengBonita(rengIM)} queda rodeado de ${rengNcM.nc} ${rengBonita(rengIX)} y cada ${rengBonita(rengIX)} de ${rengNcX.nc} ${rengBonita(rengIM)}, en una red cristalina que se repite. La fórmula ${rengBonita(rengFormula)} solo indica la proporción entre iones: un compuesto iónico NO está formado por moléculas.`,
      notaciones: [`${rengFormula}(s)`],
      nota: `Coordinación ${rengNcM.nc}:${rengNcX.nc} · ${rengUnidadesFormula(rengE)} ${rengUnidadesFormula(rengE) === 1 ? 'unidad' : 'unidades'} ${rengBonita(rengFormula)} por celda unidad`,
      avanzado: [
        ['Estructura', rengE.nombre],
        ['Parámetro de red a', `${rengComa(rengE.a, 3)} Å`],
        [`Distancia ${rengMetal}–${rengNoMetal} en la red`, `${rengComa(rengNcM.distancia, 3)} Å`]
      ],
      duracion: 5
    }
  ]
  return {
    tipo: 'ionico',
    id: rengId,
    nombre: `${rengBonita(rengFormula)} (iónico)`,
    formula: rengFormula,
    metal: { el: rengMetal, carga: rengQM },
    noMetal: { el: rengNoMetal, carga: rengQX, n: rengNX },
    estructura: rengEstructura,
    pasos: rengPasos,
    saberMas: [
      `Mover ${rengQM === 1 ? 'el electrón' : 'los electrones'} entre átomos aislados cuesta energía (ionización ${RENG_EI.map((rengV) => rengComa(rengV, 0)).join(' + ')} kJ/mol frente a ${rengComa(RENG_AE, 0)} kJ/mol de afinidad${rengQX > 1 ? ' para el primer electrón; el segundo cuesta energía' : ''}). Lo que hace estable al sólido es la atracción entre los iones en la red (energía de red).`,
      'La regla Δχ > 1,7 es orientativa: describe una tendencia, no una frontera exacta.',
      'Los dibujos de capas (modelo de Bohr) son un esquema y no están a escala; las esferas de los iones sí usan los radios de Shannon. En la red, los iones se dibujan más pequeños para ver su disposición.'
    ],
    fuentes: [RENG_FUENTE_EN, RENG_IONIZACION_EV[rengMetal]!.fuente, RENG_AFINIDAD_EV[rengNoMetal]!.fuente, RENG_RADIO_IONICO[rengIM]!.fuente, rengE.fuente, RENG_FUENTES_3D.rc]
  }
}

function rengBonitaIon(rengI: string): string {
  const rengM = /^([A-Z][a-z]?)(\d*)([+-])$/.exec(rengI)
  return rengM ? `${rengM[1]}^${rengM[2]}${rengM[3]}` : rengI
}

const RENG_DIPOLO_D: Record<string, { valor: number; fuente: string }> = {
  HCl: { valor: 1.1086, fuente: 'CRC Handbook of Chemistry and Physics, «Dipole Moments»' },
  H2O: { valor: 1.8546, fuente: 'CRC Handbook of Chemistry and Physics, «Dipole Moments»' }
}

export function rengCovalente(
  rengId: string,
  rengFormula: string,
  rengCentro: string,
  rengVecinos: RengSecuenciaCovalente['vecinos'],
  rengDiatomica: string | null,
  rengExtra: { anguloTexto?: string; fuenteGeometria?: string }
): RengSecuenciaCovalente {
  const rengEls = [rengCentro, ...rengVecinos.map((rengV) => rengV.el)]
  const rengUnicos = [...new Set(rengEls)]
  const rengXs = rengUnicos.map((rengE) => rengElectronegatividad(rengE)!)
  const rengDx = Math.max(...rengXs) - Math.min(...rengXs)
  const rengPolar = rengDx >= 0.4
  const rengMasEN = rengUnicos[rengXs.indexOf(Math.max(...rengXs))]!
  const rengMenosEN = rengUnicos[rengXs.indexOf(Math.min(...rengXs))]!
  const rengP = rengDiatomica ? rengParametrosMorse(RENG_DIATOMICAS[rengDiatomica]!) : null
  const RENG_L = rengVecinos[0]!.longitud
  const rengReactivos = rengUnicos
    .map((rengE) => {
      const rengN = rengEls.filter((rengX) => rengX === rengE).length
      return `${rengN === 1 ? '' : rengN}${rengE}`
    })
    .join(' + ')
  const rengValencia = rengUnicos.map((rengE) => `${rengE}: ${rengElectrones(rengCapaExterna(rengE))} de valencia`).join(' · ')
  const rengDip = RENG_DIPOLO_D[rengFormula]
  const rengPasos: RengPasoEnlace[] = [
    {
      titulo: 'Electrones de valencia',
      texto: `Solo cuentan los electrones de la capa externa: ${rengUnicos.map((rengE) => `el ${rengNombreEl(rengE)} tiene ${rengCapaExterna(rengE)}`).join(' y ')}. Los puntos alrededor de cada átomo son esos electrones (estructura de Lewis).`,
      notaciones: [rengReactivos],
      nota: rengValencia,
      duracion: 3
    },
    {
      titulo: 'Se acercan y comparten',
      texto: `Al acercarse, sus nubes de electrones se solapan. Cada átomo pone un electrón y los dos forman un par compartido: eso es un enlace covalente. Ningún átomo se queda los electrones; los comparten.`,
      notaciones: [`${rengReactivos} -> ${rengFormula}`],
      duracion: 4
    },
    {
      titulo: 'La distancia justa',
      texto: rengP
        ? `Si los átomos se acercan más, sus núcleos se repelen; si se alejan, el enlace se debilita. El punto más bajo de la curva marca la longitud de enlace (${rengComa(rengP.re, 3)} Å) y su profundidad, la energía necesaria para romperlo (${rengComa(rengP.D0, 0)} kJ/mol).`
        : `Cada enlace tiene una longitud de equilibrio: más cerca, los núcleos se repelen; más lejos, el enlace se debilita. Aquí cada enlace mide ${rengComa(RENG_L, 3)} Å${rengExtra.anguloTexto ? ` y forman un ángulo de ${rengExtra.anguloTexto}` : ''}.`,
      notaciones: [rengFormula],
      nota: rengP ? `r_e = ${rengComa(rengP.re, 3)} Å · energía de enlace D₀ = ${rengComa(rengP.D0, 0)} kJ/mol` : `Longitud de enlace = ${rengComa(RENG_L, 3)} Å`,
      avanzado: rengP
        ? [
            ['Profundidad del pozo Dₑ', `${rengComa(rengP.De, 0)} kJ/mol (D₀ + energía de punto cero)`],
            ['Parámetro de Morse a', `${rengComa(rengP.a, 3)} Å⁻¹`],
            ['Vibración ωₑ', `${rengComa(RENG_DIATOMICAS[rengDiatomica!]!.we, 1)} cm⁻¹`]
          ]
        : undefined,
      duracion: 4
    },
    {
      titulo: rengPolar ? 'Enlace polar: el par se desplaza' : 'Enlace apolar: reparto justo',
      texto: rengPolar
        ? `El ${rengNombreEl(rengMasEN)} (${rengComa(rengElectronegatividad(rengMasEN)!)}) atrae el par compartido más que el ${rengNombreEl(rengMenosEN)} (${rengComa(rengElectronegatividad(rengMenosEN)!)}). La nube se desplaza hacia el ${rengNombreEl(rengMasEN)}: aparece una carga parcial δ− en el ${rengNombreEl(rengMasEN)} y δ+ en el ${rengNombreEl(rengMenosEN)}. La molécula es polar y tiene un momento dipolar.`
        : `Los dos átomos son iguales, así que atraen el par con la misma fuerza. La nube queda simétrica y no hay cargas parciales: es un enlace covalente apolar.`,
      notaciones: [rengFormula],
      nota: `Δχ = ${rengComa(rengDx)} ${rengPolar ? '≥ 0,4 → polar' : '< 0,4 → apolar'}`,
      avanzado: rengDip ? [['Momento dipolar medido', `${rengComa(rengDip.valor, 3)} D`]] : undefined,
      duracion: 3.5
    }
  ]
  return {
    tipo: 'covalente',
    id: rengId,
    nombre: `${rengBonita(rengFormula)} (covalente${rengPolar ? ' polar' : ' apolar'})`,
    formula: rengFormula,
    centro: rengCentro,
    vecinos: rengVecinos,
    diatomica: rengDiatomica,
    polar: rengPolar,
    pasos: rengPasos,
    saberMas: [
      rengP
        ? 'La curva es un potencial de Morse construido con datos espectroscópicos: su mínimo está en rₑ, su curvatura reproduce la vibración medida y su profundidad es Dₑ. La energía de enlace que se mide (D₀) es algo menor que Dₑ porque la molécula nunca está quieta en el fondo del pozo.'
        : 'La curva de energía solo se muestra para moléculas de dos átomos, donde está medida con precisión. En moléculas mayores la energía depende de todas las distancias y ángulos a la vez.',
      'La flecha del momento dipolar se dibuja como en química: apunta hacia el extremo δ−. (En física se usa el sentido contrario, de − a +.)'
    ],
    fuentes: [RENG_FUENTE_EN, RENG_FUENTES_3D.rc, ...(rengDiatomica ? [RENG_DIATOMICAS[rengDiatomica]!.fuente] : []), ...(rengExtra.fuenteGeometria ? [rengExtra.fuenteGeometria] : []), ...(rengDip ? [rengDip.fuente] : [])]
  }
}

const rengRad = (rengG: number): number => (rengG * Math.PI) / 180

export const RENG_SECUENCIAS: RengSecuencia[] = [
  rengIonica('nacl', 'Na', 1, 'Cl', 1, 1, 'NaCl'),
  rengIonica('mgo', 'Mg', 2, 'O', 2, 1, 'MgO'),
  rengIonica('caf2', 'Ca', 2, 'F', 1, 2, 'CaF2'),
  rengCovalente('h2', 'H2', 'H', [{ el: 'H', dir: [1, 0, 0], longitud: RENG_DIATOMICAS.H2!.re }], 'H2', {}),
  rengCovalente('cl2', 'Cl2', 'Cl', [{ el: 'Cl', dir: [1, 0, 0], longitud: RENG_DIATOMICAS.Cl2!.re }], 'Cl2', {}),
  rengCovalente('hcl', 'HCl', 'Cl', [{ el: 'H', dir: [-1, 0, 0], longitud: RENG_DIATOMICAS.HCl!.re }], 'HCl', {}),
  rengCovalente(
    'h2o',
    'H2O',
    'O',
    [-1, 1].map((rengS) => ({ el: 'H', dir: [rengS * Math.sin(rengRad(104.52 / 2)), -Math.cos(rengRad(104.52 / 2)), 0] as [number, number, number], longitud: 0.9572 })),
    null,
    { anguloTexto: '104,5°', fuenteGeometria: 'Geometría experimental del H₂O: r(O–H) = 0,9572 Å, ángulo 104,52° (NIST CCCBDB)' }
  ),
  ...rengMultiples(),
  ...rengDativas(),
  ...rengMetalicas(),
  ...rengIntermoleculares()
]
