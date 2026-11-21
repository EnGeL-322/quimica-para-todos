import { rengAtomosPorCelda, rengCoordinacion, RENG_ESTRUCTURAS } from '../nucleo/cristales'
import { RENG_IONIZACION_EV, RENG_KJMOL_POR_EV } from '../nucleo/datosEnlace'
import { rengComa, rengConfig, rengElectrones, rengNombreEl, type RengSecuenciaMetalica } from './tipos'

const RENG_MODELO = 'Modelo del «mar de electrones» (Drude, 1900); P. Atkins y J. de Paula, Physical Chemistry (enlace metálico)'

function rengMetal(rengId: string, rengEl: string, rengEPorAtomo: number, rengNotaTransicion: boolean): RengSecuenciaMetalica {
  const rengE = RENG_ESTRUCTURAS[rengEl]!
  const rengNc = rengCoordinacion(rengE, rengEl).nc
  const rengPorCelda = rengAtomosPorCelda(rengE)
  const rengNom = rengNombreEl(rengEl)
  const RENG_EI = RENG_IONIZACION_EV[rengEl]?.valor[0]
  const rengRed = rengE.nombre.includes('bcc') ? 'bcc' : 'fcc'
  return {
    tipo: 'metalico',
    id: rengId,
    nombre: `${rengNom.charAt(0).toUpperCase()}${rengNom.slice(1)} (${rengRed})`,
    formula: rengEl,
    elemento: rengEl,
    estructura: rengEl,
    electronesPorAtomo: rengEPorAtomo,
    pasos: [
      {
        titulo: 'Átomos con su capa externa',
        texto: `Cada átomo de ${rengNom} tiene ${rengElectrones(rengEPorAtomo)} en su capa externa, poco sujeto${rengEPorAtomo === 1 ? '' : 's'} al núcleo.`,
        notaciones: [rengEl],
        nota: `${rengEl}: ${rengConfig(rengEl)}`,
        avanzado: RENG_EI ? [['Primera energía de ionización', `${rengComa(RENG_EI * RENG_KJMOL_POR_EV, 1)} kJ/mol`]] : undefined,
        duracion: 3
      },
      {
        titulo: 'Los electrones externos se liberan',
        texto: `En el sólido, esos electrones dejan de pertenecer a un átomo concreto. Quedan cationes ordenados y un «mar» de electrones compartido por todos.`,
        notaciones: [`${rengEl} -> ${rengEl}^${rengEPorAtomo === 1 ? '' : rengEPorAtomo}+ + ${rengEPorAtomo === 1 ? '' : rengEPorAtomo}e-`],
        duracion: 3.5
      },
      {
        titulo: 'Un mar de electrones',
        texto: 'Los electrones se mueven libremente entre los cationes y los mantienen unidos. Este pegamento común es el enlace metálico: no tiene una dirección fija.',
        notaciones: [rengEl],
        nota: `Red ${rengRed}: cada átomo tiene ${rengNc} vecinos · ${rengPorCelda} átomos por celda unidad`,
        avanzado: [
          ['Estructura', rengE.nombre],
          ['Parámetro de red a', `${rengComa(rengE.a, 4)} Å`],
          ['Número de coordinación', String(rengNc)],
          ['Átomos por celda', String(rengPorCelda)]
        ],
        duracion: 4
      },
      {
        titulo: 'Conducen la electricidad',
        texto:
          'Al conectar una pila, los electrones libres se desplazan hacia el polo positivo: eso es la corriente eléctrica. Los electrones libres también reflejan la luz: por eso los metales brillan.',
        notaciones: [],
        nota: 'Los electrones (negativos) se mueven hacia el polo +',
        duracion: 4
      },
      {
        titulo: 'Se deforman sin romperse',
        texto:
          'Un plano de cationes puede deslizarse sobre otro y el mar de electrones sigue uniéndolos. Por eso los metales son dúctiles y maleables (se estiran en hilos y láminas), mientras que un cristal iónico se rompe al golpearlo.',
        notaciones: [],
        nota: 'La red queda igual tras deslizarse un plano',
        duracion: 4
      }
    ],
    saberMas: [
      `El número de electrones que cede cada átomo (${rengEPorAtomo}) es el del modelo sencillo.${rengNotaTransicion ? ' En los metales de transición como el hierro y el cobre también participan en parte los electrones d.' : ''}`,
      'La animación de los electrones es un esquema: en un metal real se mueven a velocidades enormes y en todas direcciones.'
    ],
    fuentes: [rengE.fuente, RENG_MODELO, ...(RENG_IONIZACION_EV[rengEl] ? [RENG_IONIZACION_EV[rengEl]!.fuente] : [])]
  }
}

export function rengMetalicas(): RengSecuenciaMetalica[] {
  return [rengMetal('na', 'Na', 1, false), rengMetal('cu', 'Cu', 1, true), rengMetal('fe', 'Fe', 2, true)]
}
