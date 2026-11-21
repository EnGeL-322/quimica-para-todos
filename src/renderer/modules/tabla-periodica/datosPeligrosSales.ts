import type { RengFormaPeligro, RengRegistroPeligro } from './peligros'

function rengFicha(
  rengTarjeta: string, rengNombre: string, rengFormula: string, rengCas: string, rengRevision: string, rengNivel: RengRegistroPeligro['nivel'],
  rengIndicaciones: RengRegistroPeligro['indicaciones'], rengPictogramas: RengRegistroPeligro['pictogramas'] = [], rengBiblioteca?: string
): RengFormaPeligro {
  return {
    id: `icsc-${rengTarjeta}`, nombre: rengNombre, formula: rengFormula, cas: rengCas, biblioteca: rengBiblioteca,
    registros: [{
      nivel: rengNivel, indicaciones: rengIndicaciones, pictogramas: rengPictogramas,
      fuente: {
        tipo: 'icsc', organismo: 'OIT y OMS · ICSC',
        url: `https://chemicalsafety.ilo.org/dyn/icsc/showcard.display?p_card_id=${rengTarjeta}&p_lang=en&p_version=2`,
        revision: rengRevision, consulta: '2026-11-09', alcance: rengNombre
      }
    }]
  }
}

export const RENG_FORMAS_SALES: readonly RengFormaPeligro[] = [
  rengFicha('0184', 'Nitrato de potasio sólido', 'KNO3', '7757-79-1', '2001-10', 'documentado', [
    { tipo: 'oxidante', descripcion: 'Favorece la combustión de otros materiales.' },
    { tipo: 'irritacion', descripcion: 'El contacto o el polvo pueden irritar ojos, piel y vías respiratorias.' },
    { tipo: 'toxicidad-aguda', descripcion: 'La ingestión puede alterar el transporte de oxígeno en la sangre.' }
  ], [], 'nitrato de potasio'),
  rengFicha('0338', 'Dióxido de titanio sólido · exposición a partículas suspendidas', 'TiO2', '13463-67-7', '2019-11', 'peligro', [
    { tipo: 'efectos-cronicos', descripcion: 'La inhalación repetida puede dañar el aparato respiratorio. La ficha recoge sospecha de carcinogenicidad por inhalación.' }
  ], ['GHS08'], 'dióxido de titanio'),
  rengFicha('0408', 'Hidróxido de calcio sólido', 'Ca(OH)2', '1305-62-0', '1997-09', 'documentado', [
    { tipo: 'corrosion', descripcion: 'Puede producir lesiones corrosivas en la piel y los ojos.' },
    { tipo: 'irritacion', descripcion: 'El polvo irrita las vías respiratorias.' }
  ], [], 'hidróxido de calcio'),
  rengFicha('0504', 'Óxido de magnesio sólido', 'MgO', '1309-48-4', '2010-05', 'no-clasificado', [
    { tipo: 'irritacion', descripcion: 'La ficha describe posible irritación mecánica por partículas, aunque no asigna una clasificación GHS.' }
  ], [], 'óxido de magnesio'),
  rengFicha('0672', 'Permanganato de potasio sólido', 'KMnO4', '7722-64-7', '2016-11', 'peligro', [
    { tipo: 'oxidante', descripcion: 'Puede intensificar un incendio por su acción oxidante.' },
    { tipo: 'corrosion', descripcion: 'Puede causar quemaduras cutáneas y lesiones oculares graves.' },
    { tipo: 'toxicidad-aguda', descripcion: 'Es nocivo por ingestión.' },
    { tipo: 'efectos-cronicos', descripcion: 'Se sospechan efectos adversos sobre la fertilidad o el desarrollo fetal.' },
    { tipo: 'ambiental', descripcion: 'Tiene toxicidad muy alta para los organismos acuáticos.' }
  ], ['GHS03', 'GHS05', 'GHS07', 'GHS08', 'GHS09'], 'permanganato de potasio'),
  rengFicha('0827', 'Sulfato de bario sólido', 'BaSO4', '7727-43-7', '1999-10', 'documentado', [
    { tipo: 'efectos-cronicos', descripcion: 'La exposición prolongada a su polvo puede producir depósitos en los pulmones.' }
  ], [], 'sulfato de bario'),
  rengFicha('1044', 'Bicarbonato de sodio sólido', 'NaHCO3', '144-55-8', '2024-04', 'no-clasificado', [
    { tipo: 'irritacion', descripcion: 'La ficha menciona irritación ocular leve por contacto con el polvo.' }
  ], [], 'hidrogenocarbonato de sodio'),
  rengFicha('1051', 'Cloruro de amonio sólido', 'NH4Cl', '12125-02-9', '2000-12', 'documentado', [
    { tipo: 'irritacion', descripcion: 'Irrita ojos, piel y vías respiratorias.' },
    { tipo: 'ambiental', descripcion: 'La ficha describe toxicidad para organismos acuáticos.' }
  ], [], 'cloruro de amonio'),
  rengFicha('1116', 'Nitrato de plata sólido', 'AgNO3', '7761-88-8', '2024-04', 'peligro', [
    { tipo: 'oxidante', descripcion: 'Es un oxidante fuerte y puede favorecer incendios o explosiones.' },
    { tipo: 'corrosion', descripcion: 'Puede quemar la piel y causar lesiones oculares graves.' },
    { tipo: 'toxicidad-aguda', descripcion: 'Es nocivo por ingestión.' },
    { tipo: 'ambiental', descripcion: 'Puede provocar efectos tóxicos persistentes en el medio acuático.' }
  ], ['GHS03', 'GHS05', 'GHS09'], 'nitrato de plata'),
  rengFicha('1135', 'Carbonato de sodio anhidro', 'Na2CO3', '497-19-8', '2024-04', 'atencion', [
    { tipo: 'irritacion', descripcion: 'El contacto ocular puede causar irritación intensa.' }
  ], ['GHS07'], 'carbonato de sodio'),
  rengFicha('1184', 'Cloruro de calcio anhidro', 'CaCl2', '10043-52-4', '2012-06', 'peligro', [
    { tipo: 'corrosion', descripcion: 'Esta ficha clasifica la forma anhidra por quemaduras cutáneas y lesiones oculares graves.' },
    { tipo: 'irritacion', descripcion: 'El polvo puede irritar las vías respiratorias.' },
    { tipo: 'toxicidad-aguda', descripcion: 'La ingestión puede resultar nociva según esta ficha.' }
  ], ['GHS05', 'GHS07'], 'cloruro de calcio'),
  rengFicha('1193', 'Carbonato de calcio sólido', 'CaCO3', '471-34-1', '2012-06', 'no-clasificado', [
    { tipo: 'irritacion', descripcion: 'El polvo puede irritar mecánicamente los ojos y las vías respiratorias.' }
  ], [], 'carbonato de calcio'),
  rengFicha('1197', 'Sulfato de magnesio anhidro', 'MgSO4', '7487-88-9', '2010-11', 'documentado', [
    { tipo: 'irritacion', descripcion: 'El polvo puede irritar de forma leve los ojos y las vías respiratorias.' }
  ]),
  rengFicha('1323', 'Fluoruro de calcio sólido', 'CaF2', '7789-75-5', '1999-03', 'documentado', [
    { tipo: 'reactividad', descripcion: 'La ficha describe la liberación de vapores corrosivos al reaccionar con ácidos minerales.' }
  ], [], 'fluoruro de calcio'),
  rengFicha('1371', 'Dicromato de potasio sólido', 'K2Cr2O7', '7778-50-9', '2013-04', 'peligro', [
    { tipo: 'oxidante', descripcion: 'Favorece la propagación de un incendio.' },
    { tipo: 'toxicidad-aguda', descripcion: 'El polvo puede ser mortal al inhalarlo. También es tóxico por ingestión.' },
    { tipo: 'corrosion', descripcion: 'Puede producir quemaduras y lesiones oculares graves.' },
    { tipo: 'sensibilizacion', descripcion: 'Puede causar alergia cutánea y sensibilización respiratoria.' },
    { tipo: 'efectos-cronicos', descripcion: 'La ficha describe efectos cancerígenos, genéticos, reproductivos y daño a órganos.' },
    { tipo: 'ambiental', descripcion: 'Puede producir toxicidad acuática persistente.' }
  ], ['GHS03', 'GHS05', 'GHS06', 'GHS08', 'GHS09'], 'dicromato de potasio'),
  rengFicha('1416', 'Sulfato de cobre(II) pentahidratado', 'CuSO4·5H2O', '7758-99-8', '2023-11', 'peligro', [
    { tipo: 'toxicidad-aguda', descripcion: 'Es nocivo si se ingiere.' },
    { tipo: 'corrosion', descripcion: 'Puede ocasionar lesiones oculares graves.' },
    { tipo: 'ambiental', descripcion: 'Es muy tóxico para organismos acuáticos y sus efectos pueden perdurar.' }
  ], ['GHS05', 'GHS07', 'GHS09'], 'sulfato de cobre(II) pentahidratado'),
  rengFicha('1450', 'Cloruro de potasio sólido', 'KCl', '7447-40-7', '2003-06', 'documentado', [
    { tipo: 'irritacion', descripcion: 'El polvo puede irritar los ojos y las vías respiratorias.' },
    { tipo: 'toxicidad-aguda', descripcion: 'La ingestión en grandes cantidades puede afectar el ritmo cardíaco.' }
  ], [], 'cloruro de potasio'),
  rengFicha('1499', 'Cloruro de hierro(III) anhidro', 'FeCl3', '7705-08-0', '2004-04', 'documentado', [
    { tipo: 'irritacion', descripcion: 'La exposición puede irritar piel, ojos y vías respiratorias.' },
    { tipo: 'corrosion', descripcion: 'Tiene efectos corrosivos por ingestión.' },
    { tipo: 'ambiental', descripcion: 'La ficha describe efectos nocivos para los organismos acuáticos.' }
  ], [], 'cloruro de hierro(III)'),
  rengFicha('1782', 'Dióxido de titanio · nanoforma P25', 'TiO2', '13463-67-7', '2019-11', 'documentado', [
    { tipo: 'efectos-cronicos', descripcion: 'La ficha de esta nanoforma recoge daño pulmonar por exposición repetida y sospecha de carcinogenicidad por inhalación.' }
  ], ['GHS08'], 'dióxido de titanio')
]
