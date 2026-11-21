import type { RengFormaPeligro } from './peligros'

type RengIdentidad = Omit<RengFormaPeligro, 'registros'> & { condicion: string }
type RengRegistro = RengFormaPeligro['registros'][number]
type RengIndicacion = RengRegistro['indicaciones'][number]

const RENG_CONSULTA = '2026-11-09'

function rengIcsc(rengIdentidad: RengIdentidad, rengFicha: string, rengRevision: string, rengNivel: RengRegistro['nivel'], rengIndicaciones: readonly RengIndicacion[], rengPictogramas?: readonly string[]): RengFormaPeligro {
  return {
    ...rengIdentidad,
    registros: [{
      nivel: rengNivel,
      fuente: {
        tipo: 'icsc', organismo: `OIT/OMS · ICSC ${rengFicha}`, revision: rengRevision, consulta: RENG_CONSULTA,
        url: `https://chemicalsafety.ilo.org/dyn/icsc/showcard.display?p_card_id=${rengFicha}&p_lang=en&p_version=2`,
        alcance: rengIdentidad.condicion
      },
      indicaciones: rengIndicaciones,
      pictogramas: rengPictogramas
    }]
  }
}

const rengDato = (rengTipo: RengIndicacion['tipo'], rengDescripcion: string, rengCodigo?: string): RengIndicacion => ({ tipo: rengTipo, descripcion: rengDescripcion, codigo: rengCodigo })

function rengProductoSinClasificacion(rengIdentidad: RengIdentidad, rengRevision: string, rengUrl: string): RengFormaPeligro {
  return {
    ...rengIdentidad,
    registros: [{
      nivel: 'no-clasificado', indicaciones: [],
      fuente: {
        tipo: 'fds', organismo: 'Fisher Scientific Company', revision: rengRevision, consulta: RENG_CONSULTA, url: rengUrl,
        alcance: `${rengIdentidad.condicion} Clasificación según OSHA 2024 (EE. UU.), sección 2 de la ficha del producto.`
      }
    }]
  }
}

const RENG_SAL_ACS: RengFormaPeligro = {
  id: 'nacl-acs', nombre: 'Cloruro de sodio · grado ACS', formula: 'NaCl', cas: '7647-14-5', biblioteca: 'cloruro de sodio',
  condicion: 'Sólido de laboratorio, grado ACS, producto 12314',
  registros: [{
    nivel: 'no-clasificado', indicaciones: [],
    fuente: {
      tipo: 'fds', organismo: 'Thermo Fisher Scientific Chemicals', revision: '2025-12-27', consulta: RENG_CONSULTA,
      alcance: 'Producto 12314, sólido con más del 95 % de NaCl. Sin clasificación de peligro según la norma estadounidense OSHA 2024, sección 2 de su FDS.',
      url: 'https://www.fishersci.com/store/msds?countryCode=US&language=en&partNumber=AA1231436&productDescription=SODIUM+CHLORIDE+ACS+500G&vendorId=VN00024248'
    }
  }]
}

const RENG_HCL_ACUOSO: RengFormaPeligro = {
  id: 'hcl-01n', nombre: 'Ácido clorhídrico · disolución certificada 0,1 N', formula: 'HCl', cas: '7647-01-0', biblioteca: 'cloruro de hidrógeno',
  condicion: 'Disolución acuosa 0,1 N, producto Fisher SA54. El CAS corresponde al soluto.',
  registros: [{
    nivel: 'atencion', pictogramas: ['GHS05'],
    fuente: {
      tipo: 'fds', organismo: 'Fisher Scientific Company', revision: '2025-12-18', consulta: RENG_CONSULTA,
      alcance: 'Solo la disolución certificada SA54 a 0,1 N. Clasificación según OSHA 2024, sección 2 de su FDS.',
      url: 'https://www.fishersci.com/store/msds?countryCode=US&language=en&partNumber=SA541&productDescription=HYDROCHL+ACID+SOL+N%2F10+CR+1L&vendorId=VN00033897'
    },
    indicaciones: [rengDato('corrosion-metales', 'Puede corroer metales.'), rengDato('irritacion', 'Irrita la piel y causa irritación ocular intensa.')]
  }]
}

const RENG_ACETONA_FDS: RengFormaPeligro = {
  id: 'acetona-fds-15693670', nombre: 'Acetona · producto 15693670', formula: 'C3H6O', cas: '67-64-1', biblioteca: 'acetona',
  condicion: 'Acetona. Producto con FDS europea 15693670.',
  registros: [{
    nivel: 'peligro', pictogramas: ['GHS02', 'GHS07'],
    fuente: {
      tipo: 'fds', organismo: 'Fisher Scientific · FDS europea 15693670', revision: '2018-09-07', consulta: RENG_CONSULTA,
      alcance: 'Clasificación CLP del producto documentado por el proveedor, sección 2 de la FDS.',
      url: 'https://assets.fishersci.com/TFS-Assets/CCG/EU/SDS/SDS_15693670_EN.pdf'
    },
    indicaciones: [
      rengDato('inflamabilidad', 'El líquido y el vapor son muy inflamables.', 'H225'),
      rengDato('irritacion', 'Causa irritación ocular intensa.', 'H319'),
      rengDato('toxicidad-aguda', 'La exposición puede causar somnolencia o mareos.', 'H336')
    ]
  }]
}

export const RENG_FORMAS_ICSC: readonly RengFormaPeligro[] = [
  rengProductoSinClasificacion({ id: 'agua-hplc-w54', nombre: 'Agua de laboratorio · grado HPLC', formula: 'H2O', cas: '7732-18-5', biblioteca: 'agua', condicion: 'Agua líquida, producto Fisher W5-4.' }, '2025-12-18', 'https://www.fishersci.com/store/msds?countryCode=US&language=en&partNumber=W54&productDescription=WATER+HPLC+GRADE+4L&vendorId=VN00033897'),
  rengProductoSinClasificacion({ id: 'glucosa-d16500', nombre: 'Dextrosa anhidra · grado ACS', formula: 'C6H12O6', cas: '50-99-7', biblioteca: 'glucosa', condicion: 'D-glucosa sólida, producto Fisher D16-500.' }, '2025-12-18', 'https://www.fishersci.com/store/msds?countryCode=US&language=en&partNumber=D16500&productDescription=DEXTROSE+ANHYD+CERT+ACS+500G&vendorId=VN00033897'),
  rengProductoSinClasificacion({ id: 'glicerol-ac33203', nombre: 'Glicerol · producto AC33203', formula: 'C3H8O3', cas: '56-81-5', biblioteca: 'glicerina', condicion: 'Glicerol líquido, producto Acros AC33203.' }, '2025-12-19', 'https://www.fishersci.com/store/msds?countryCode=US&language=en&partNumber=AC332030025'),
  rengProductoSinClasificacion({ id: 'glicerol-ac29560', nombre: 'Glicerol · presentación al 83–89 %', formula: 'C3H8O3', cas: '56-81-5', biblioteca: 'glicerina', condicion: 'Presentación al 83–89 %, producto Acros AC29560. El CAS corresponde al glicerol.' }, '2025-12-19', 'https://www.fishersci.com/store/msds?countryCode=US&language=en&partNumber=AC295600100'),
  rengProductoSinClasificacion({ id: 'mgso4-hepta-m63', nombre: 'Sulfato de magnesio heptahidratado · grado ACS', formula: 'MgSO4·7H2O', cas: '10034-99-8', biblioteca: 'sulfato de magnesio heptahidratado', condicion: 'Heptahidrato sólido de laboratorio, serie Fisher M63.' }, '2025-12-18', 'https://www.fishersci.com/store/msds?countryCode=US&language=en&partNumber=M633'),
  rengIcsc({ id: 'lactico-dl', nombre: 'Ácido DL-láctico', formula: 'C3H6O3', cas: '50-21-5', biblioteca: 'ácido láctico', condicion: 'Forma DL, líquida o cristalina según la temperatura. El alcance corresponde a la sustancia y no a productos diluidos.' }, '0501', '1997-09', 'documentado', [
    rengDato('inflamabilidad', 'La ficha describe la sustancia como combustible.'),
    rengDato('corrosion', 'Puede producir lesiones corrosivas en los ojos y por ingestión.'),
    rengDato('irritacion', 'Puede irritar la piel y las vías respiratorias.')
  ]),
  rengIcsc({ id: 'hidrogeno-comprimido', nombre: 'Hidrógeno molecular', formula: 'H2', cas: '1333-74-0', z: 1, referencia: true, biblioteca: 'hidrógeno', condicion: 'Gas comprimido.' }, '0001', '2014-04', 'peligro', [
    rengDato('inflamabilidad', 'Prende con extrema facilidad y puede formar una mezcla explosiva con el aire.'),
    rengDato('presion', 'El gas está a presión y el calentamiento del recipiente puede provocar su rotura.'),
    rengDato('asfixia', 'En un recinto cerrado puede desplazar el oxígeno del aire.')
  ], ['GHS02', 'GHS04']),
  rengIcsc({ id: 'cloro-gas', nombre: 'Cloro molecular', formula: 'Cl2', cas: '7782-50-5', z: 17, referencia: true, biblioteca: 'cloro', condicion: 'Gas licuado a presión.' }, '0126', '2009-03', 'peligro', [
    rengDato('oxidante', 'Favorece la combustión de otros materiales.'), rengDato('presion', 'El envase presurizado puede romperse al calentarse.'),
    rengDato('toxicidad-aguda', 'La inhalación puede ser mortal.'), rengDato('corrosion', 'El contacto puede causar quemaduras graves y lesionar los ojos.'),
    rengDato('irritacion', 'Puede irritar las vías respiratorias.'), rengDato('efectos-cronicos', 'La inhalación repetida puede lesionar los pulmones.'),
    rengDato('ambiental', 'Presenta toxicidad muy alta para la vida acuática.')
  ], ['GHS03', 'GHS04', 'GHS05', 'GHS06', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'fluor-gas', nombre: 'Flúor molecular', formula: 'F2', cas: '7782-41-4', z: 9, referencia: true, biblioteca: 'flúor', condicion: 'Gas comprimido.' }, '0046', '2001-10', 'documentado', [
    rengDato('oxidante', 'Oxidante enérgico que reacciona con combustibles.'), rengDato('reactividad', 'Reacciona violentamente en contacto con agua.'),
    rengDato('corrosion', 'Puede dañar gravemente los ojos, la piel y las vías respiratorias.')
  ]),
  rengIcsc({ id: 'oxigeno-comprimido', nombre: 'Oxígeno molecular', formula: 'O2', cas: '7782-44-7', z: 8, referencia: true, biblioteca: 'oxígeno', condicion: 'Gas comprimido.' }, '0138', '1999-10', 'documentado', [
    rengDato('oxidante', 'Enriquece la combustión y aumenta el peligro de incendio en presencia de combustibles.'),
    rengDato('irritacion', 'La ficha describe irritación respiratoria a concentraciones muy altas.')
  ]),
  rengIcsc({ id: 'ozono-gas', nombre: 'Ozono', formula: 'O3', cas: '10028-15-6', z: 8, biblioteca: 'ozono', condicion: 'Gas. Alótropo del oxígeno.' }, '0068', '2009-04', 'peligro', [
    rengDato('oxidante', 'Puede intensificar un incendio por su poder oxidante.'), rengDato('toxicidad-aguda', 'La inhalación puede ser mortal.'),
    rengDato('irritacion', 'Irrita los ojos y las vías respiratorias.'), rengDato('efectos-cronicos', 'La exposición respiratoria repetida puede lesionar los pulmones.')
  ], ['GHS03', 'GHS06', 'GHS08']),
  rengIcsc({ id: 'sodio-metal', nombre: 'Sodio metálico', formula: 'Na', cas: '7440-23-5', z: 11, referencia: true, biblioteca: 'sodio', condicion: 'Metal sólido.' }, '0717', '2006-04', 'peligro', [
    rengDato('reactividad', 'Con agua libera hidrógeno inflamable que puede prender por sí solo.'), rengDato('corrosion', 'El contacto puede provocar quemaduras graves y lesiones oculares.')
  ], ['GHS02', 'GHS05']),
  rengIcsc({ id: 'yodo-solido', nombre: 'Yodo molecular', formula: 'I2', cas: '7553-56-2', z: 53, referencia: true, biblioteca: 'yodo', condicion: 'Sólido molecular.' }, '0167', '2004-04', 'documentado', [
    rengDato('reactividad', 'Puede reaccionar violentamente con determinados materiales.'),
    rengDato('irritacion', 'El vapor irrita las vías respiratorias, la piel y los ojos.')
  ]),
  rengIcsc({ id: 'bromo-liquido', nombre: 'Bromo molecular', formula: 'Br2', cas: '7726-95-6', z: 35, referencia: true, biblioteca: 'bromo', condicion: 'Líquido volátil.' }, '0107', '2009-03', 'peligro', [
    rengDato('corrosion-metales', 'Puede atacar metales.'), rengDato('toxicidad-aguda', 'La inhalación puede ser mortal.'), rengDato('corrosion', 'Puede producir quemaduras cutáneas graves y dañar los ojos.'),
    rengDato('irritacion', 'Puede irritar las vías respiratorias.'), rengDato('efectos-cronicos', 'La inhalación repetida puede lesionar los pulmones.'),
    rengDato('ambiental', 'Presenta toxicidad muy alta para organismos acuáticos.')
  ], ['GHS05', 'GHS06', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'co-gas', nombre: 'Monóxido de carbono', formula: 'CO', cas: '630-08-0', biblioteca: 'monóxido de carbono', condicion: 'Gas comprimido.' }, '0023', '2024-04', 'peligro', [
    rengDato('inflamabilidad', 'Gas que prende con extrema facilidad.'), rengDato('presion', 'El recipiente de gas puede romperse si se calienta.'),
    rengDato('toxicidad-aguda', 'Tóxico al respirarlo. Afecta a la capacidad de la sangre para transportar oxígeno.'),
    rengDato('efectos-cronicos', 'La inhalación repetida puede dañar la sangre y el sistema nervioso central.')
  ], ['GHS02', 'GHS04', 'GHS06', 'GHS08']),
  rengIcsc({ id: 'h2s-gas', nombre: 'Sulfuro de hidrógeno', formula: 'H2S', cas: '7783-06-4', biblioteca: 'sulfuro de hidrógeno', condicion: 'Gas licuado a presión.' }, '0165', '2017-04', 'peligro', [
    rengDato('inflamabilidad', 'Gas extremadamente inflamable.'), rengDato('presion', 'El recipiente presurizado puede romperse al calentarse.'),
    rengDato('toxicidad-aguda', 'La inhalación puede ser mortal.'), rengDato('irritacion', 'Irrita los ojos y puede irritar las vías respiratorias.'),
    rengDato('ambiental', 'Muy tóxico para organismos acuáticos.')
  ], ['GHS02', 'GHS04', 'GHS06', 'GHS09']),
  rengIcsc({ id: 'so2-gas', nombre: 'Dióxido de azufre', formula: 'SO2', cas: '7446-09-5', biblioteca: 'dióxido de azufre', condicion: 'Gas licuado. La indicación criogénica de la ficha corresponde al gas refrigerado.' }, '0074', '2006-10', 'atencion', [
    rengDato('presion', 'El gas refrigerado puede producir lesiones por frío.'), rengDato('toxicidad-aguda', 'La ficha señala toxicidad por inhalación.'),
    rengDato('irritacion', 'Irrita los ojos.'), rengDato('efectos-cronicos', 'Respirarlo repetidamente puede dañar las vías respiratorias.'), rengDato('ambiental', 'Perjudicial para la vida acuática.')
  ], ['GHS04', 'GHS06', 'GHS07', 'GHS09']),
  rengIcsc({ id: 'n2o-gas', nombre: 'Monóxido de dinitrógeno', formula: 'N2O', cas: '10024-97-2', biblioteca: 'monóxido de dinitrógeno', condicion: 'Gas licuado a presión.' }, '0067', '2015-06', 'peligro', [
    rengDato('oxidante', 'Puede intensificar un incendio.'), rengDato('presion', 'El gas presurizado puede romper su recipiente si se calienta.'),
    rengDato('toxicidad-aguda', 'La exposición puede causar somnolencia o mareo.'), rengDato('efectos-cronicos', 'La inhalación repetida puede dañar la sangre y el sistema nervioso.')
  ], ['GHS03', 'GHS04', 'GHS07', 'GHS08']),
  rengIcsc({ id: 'etanol-anhidro', nombre: 'Etanol anhidro', formula: 'C2H6O', cas: '64-17-5', biblioteca: 'etanol', condicion: 'Etanol anhidro. La ficha se refiere al líquido sin agua.' }, '0044', '2018-05', 'peligro', [
    rengDato('inflamabilidad', 'Tanto el líquido como sus vapores prenden con facilidad.'), rengDato('toxicidad-aguda', 'Perjudicial si se ingiere.'),
    rengDato('irritacion', 'Causa irritación intensa de los ojos.'), rengDato('efectos-cronicos', 'La exposición repetida puede dañar órganos.')
  ], ['GHS02', 'GHS07', 'GHS08']),
  rengIcsc({ id: 'acetona-pura', nombre: 'Acetona', formula: 'C3H6O', cas: '67-64-1', biblioteca: 'acetona', condicion: 'Líquido, sustancia sin diluir.' }, '0087', '2024-04', 'peligro', [
    rengDato('inflamabilidad', 'El líquido y su vapor son muy inflamables.'), rengDato('irritacion', 'Irrita los ojos y puede irritar las vías respiratorias.')
  ], ['GHS02', 'GHS07']),
  RENG_ACETONA_FDS,
  rengIcsc({ id: 'metanol-puro', nombre: 'Metanol', formula: 'CH4O', cas: '67-56-1', biblioteca: 'metanol', condicion: 'Líquido, sustancia sin diluir.' }, '0057', '2018-05', 'peligro', [
    rengDato('inflamabilidad', 'El líquido y sus vapores se encienden con facilidad.'),
    rengDato('toxicidad-aguda', 'Tóxico al ingerirlo, nocivo al inhalarlo y capaz de lesionar el sistema nervioso central.')
  ], ['GHS02', 'GHS06', 'GHS08']),
  rengIcsc({ id: 'hcl-anhidro', nombre: 'Cloruro de hidrógeno anhidro', formula: 'HCl', cas: '7647-01-0', biblioteca: 'cloruro de hidrógeno', condicion: 'Gas anhidro, licuado a presión. Las disoluciones tienen su propia ficha.' }, '0163', '2016-11', 'peligro', [
    rengDato('presion', 'El gas a presión puede romper el recipiente al calentarse.'), rengDato('toxicidad-aguda', 'Respirarlo es tóxico.'),
    rengDato('corrosion', 'El contacto puede causar quemaduras graves y daño ocular.'), rengDato('irritacion', 'Puede irritar las vías respiratorias.')
  ], ['GHS04', 'GHS05', 'GHS06']),
  RENG_HCL_ACUOSO,
  RENG_SAL_ACS,
  rengIcsc({ id: 'h2o2-mayor-60', nombre: 'Peróxido de hidrógeno · disolución superior al 60 %', formula: 'H2O2', cas: '7722-84-1', condicion: 'Solo disolución acuosa superior al 60 %. El CAS corresponde al soluto.' }, '0164', '2018-05', 'peligro', [
    rengDato('oxidante', 'Oxidante intenso que puede causar incendios o explosiones.'), rengDato('toxicidad-aguda', 'Tóxico al respirarlo y nocivo al ingerirlo.'),
    rengDato('corrosion', 'Puede quemar gravemente la piel y dañar los ojos.'), rengDato('irritacion', 'Puede irritar las vías respiratorias.'),
    rengDato('efectos-cronicos', 'La exposición repetida puede dañar el tracto respiratorio.'), rengDato('ambiental', 'Tóxico para la vida acuática.')
  ], ['GHS03', 'GHS05', 'GHS06', 'GHS08']),
  rengIcsc({ id: 'naoh-solido', nombre: 'Hidróxido de sodio', formula: 'NaOH', cas: '1310-73-2', biblioteca: 'hidróxido de sodio', condicion: 'Sólido. La ficha no asigna automáticamente este peligro a una disolución.' }, '0360', '2010-05', 'peligro', [
    rengDato('toxicidad-aguda', 'Nocivo en caso de ingestión.'), rengDato('corrosion', 'Puede provocar quemaduras graves y lesiones oculares.'), rengDato('irritacion', 'El polvo puede irritar las vías respiratorias.')
  ], ['GHS05', 'GHS07']),
  rengIcsc({ id: 'koh-solido', nombre: 'Hidróxido de potasio', formula: 'KOH', cas: '1310-58-3', biblioteca: 'hidróxido de potasio', condicion: 'Sólido.' }, '0357', '2010-05', 'peligro', [
    rengDato('toxicidad-aguda', 'Nocivo al ingerirlo.'), rengDato('corrosion', 'Provoca quemaduras cutáneas graves y daño ocular.'), rengDato('irritacion', 'El polvo puede irritar las vías respiratorias.')
  ], ['GHS05', 'GHS07']),
  rengIcsc({ id: 'sulfurico-concentrado', nombre: 'Ácido sulfúrico concentrado', formula: 'H2SO4', cas: '7664-93-9', biblioteca: 'ácido sulfúrico', condicion: 'Disolución con más del 51 % y menos del 100 %.' }, '0362', '2016-11', 'peligro', [
    rengDato('toxicidad-aguda', 'Respirar el aerosol puede ser mortal.'), rengDato('corrosion', 'Puede causar quemaduras graves en la piel y los ojos.'),
    rengDato('irritacion', 'Puede irritar el sistema respiratorio.'), rengDato('corrosion-metales', 'Puede corroer metales.')
  ], ['GHS05', 'GHS06']),
  rengIcsc({ id: 'acetico-glacial', nombre: 'Ácido acético glacial', formula: 'C2H4O2', cas: '64-19-7', biblioteca: 'ácido acético', condicion: 'Ácido acético glacial. La ficha se refiere a la sustancia sin diluir.' }, '0363', '2010-05', 'peligro', [
    rengDato('inflamabilidad', 'El líquido y el vapor pueden arder.'), rengDato('toxicidad-aguda', 'Nocivo por contacto cutáneo o al inhalarlo.'),
    rengDato('corrosion', 'Puede quemar la piel y dañar los ojos.'), rengDato('irritacion', 'Puede irritar las vías respiratorias.'),
    rengDato('efectos-cronicos', 'La inhalación repetida daña las vías respiratorias.'), rengDato('ambiental', 'Nocivo para organismos acuáticos.')
  ], ['GHS02', 'GHS05', 'GHS07', 'GHS08']),
  rengIcsc({ id: 'benceno-puro', nombre: 'Benceno', formula: 'C6H6', cas: '71-43-2', biblioteca: 'benceno', condicion: 'Líquido, sustancia sin diluir.' }, '0015', '2016-11', 'peligro', [
    rengDato('inflamabilidad', 'El líquido y sus vapores son muy inflamables.'), rengDato('toxicidad-aguda', 'Puede ser mortal si, tras la ingestión, entra en las vías respiratorias.'),
    rengDato('irritacion', 'Irrita la piel y los ojos.'), rengDato('efectos-cronicos', 'Puede causar cáncer y alteraciones genéticas, y dañar la médula ósea con exposiciones repetidas.'),
    rengDato('ambiental', 'Nocivo para la vida acuática con efectos duraderos.')
  ], ['GHS02', 'GHS07', 'GHS08']),
  rengIcsc({ id: 'cloroformo-puro', nombre: 'Cloroformo', formula: 'CHCl3', cas: '67-66-3', biblioteca: 'cloroformo', condicion: 'Líquido, sustancia sin diluir.' }, '0027', '2024-04', 'peligro', [
    rengDato('toxicidad-aguda', 'Nocivo al ingerirlo o inhalarlo. Puede producir mareo o somnolencia.'), rengDato('irritacion', 'Irrita la piel y los ojos.'),
    rengDato('efectos-cronicos', 'Se sospecha un efecto cancerígeno y reproductivo. Una exposición repetida puede lesionar el hígado, los riñones y las vías respiratorias.'),
    rengDato('ambiental', 'Nocivo para la vida acuática.')
  ], ['GHS07', 'GHS08']),
  rengIcsc({ id: 'anilina-pura', nombre: 'Anilina', formula: 'C6H7N', cas: '62-53-3', biblioteca: 'anilina', condicion: 'Líquido, sustancia sin diluir.' }, '0011', '2014-04', 'peligro', [
    rengDato('toxicidad-aguda', 'Tóxica por ingestión, inhalación o contacto cutáneo. Puede lesionar los glóbulos rojos.'),
    rengDato('irritacion', 'Irrita intensamente los ojos.'), rengDato('sensibilizacion', 'Puede causar alergia cutánea.'),
    rengDato('efectos-cronicos', 'La exposición repetida daña la sangre.'), rengDato('ambiental', 'Muy tóxica para la vida acuática.')
  ], ['GHS06', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'fenol-puro', nombre: 'Fenol', formula: 'C6H6O', cas: '108-95-2', biblioteca: 'fenol', condicion: 'Sustancia sin diluir. La ficha describe sus cristales.' }, '0070', '2017-04', 'peligro', [
    rengDato('toxicidad-aguda', 'Tóxico al ingerirlo o en contacto con la piel.'), rengDato('corrosion', 'Puede producir quemaduras graves y dañar los ojos.'),
    rengDato('efectos-cronicos', 'Se sospechan efectos genéticos. La exposición repetida puede dañar órganos.'), rengDato('ambiental', 'Tóxico para la vida acuática.')
  ], ['GHS05', 'GHS06', 'GHS08']),
  rengIcsc({ id: 'estireno-puro', nombre: 'Estireno', formula: 'C8H8', cas: '100-42-5', biblioteca: 'estireno', condicion: 'Líquido, sustancia sin diluir.' }, '0073', '2006-04', 'peligro', [
    rengDato('inflamabilidad', 'El líquido y el vapor son inflamables.'), rengDato('toxicidad-aguda', 'Nocivo por inhalación.'), rengDato('irritacion', 'Irrita los ojos y la piel.'),
    rengDato('efectos-cronicos', 'Se sospecha un efecto cancerígeno. La exposición repetida puede afectar al hígado y al sistema nervioso.'),
    rengDato('ambiental', 'Tóxico para organismos acuáticos.')
  ], ['GHS02', 'GHS07', 'GHS08']),
  rengIcsc({ id: 'ni-metal', nombre: 'Níquel metálico', formula: 'Ni', cas: '7440-02-0', z: 28, referencia: true, condicion: 'Metal sólido. La ficha distingue los efectos de inhalar polvo o humo.' }, '0062', '2017-04', 'peligro', [
    rengDato('sensibilizacion', 'Puede provocar alergia cutánea.'), rengDato('efectos-cronicos', 'Inhalarlo repetidamente puede dañar los pulmones.'),
    rengDato('ambiental', 'Nocivo para los organismos acuáticos, con efectos duraderos.')
  ], ['GHS08']),
  rengIcsc({ id: 'as-gris', nombre: 'Arsénico gris', formula: 'As', cas: '7440-38-2', z: 33, referencia: true, condicion: 'Forma elemental gris, sólida.' }, '0013', '2011-06', 'peligro', [
    rengDato('toxicidad-aguda', 'Tóxico al ingerirlo. Puede dañar el aparato digestivo.'),
    rengDato('efectos-cronicos', 'La exposición repetida puede dañar órganos. Se sospechan efectos sobre la reproducción.'),
    rengDato('ambiental', 'Tóxico para la vida acuática con efectos duraderos.')
  ], ['GHS06', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'eter-dietilico-puro', nombre: 'Éter dietílico', formula: 'C4H10O', cas: '60-29-7', biblioteca: 'éter dietílico', condicion: 'Líquido, sustancia sin diluir.' }, '0355', '2024-04', 'peligro', [
    rengDato('inflamabilidad', 'Líquido y vapor extremadamente inflamables.'), rengDato('explosion', 'Puede formar peróxidos explosivos bajo la influencia del aire y la luz.'),
    rengDato('toxicidad-aguda', 'Nocivo por ingestión. La exposición puede causar mareos o somnolencia.')
  ], ['GHS02', 'GHS07']),
  rengIcsc({ id: 'co2-gas', nombre: 'Dióxido de carbono', formula: 'CO2', cas: '124-38-9', biblioteca: 'dióxido de carbono', condicion: 'Gas licuado a presión. La advertencia de presión corresponde al recipiente.' }, '0021', '2024-04', 'atencion', [
    rengDato('presion', 'El recipiente presurizado puede romperse si se calienta.'), rengDato('asfixia', 'Concentraciones elevadas en el aire pueden provocar asfixia.')
  ], ['GHS04']),
  rengIcsc({ id: 'nitrogeno-comprimido', nombre: 'Nitrógeno molecular', formula: 'N2', cas: '7727-37-9', z: 7, referencia: true, biblioteca: 'nitrógeno', condicion: 'Gas comprimido.' }, '1198', '1999-03', 'documentado', [
    rengDato('presion', 'Al calentarse el gas aumenta la presión del recipiente.'), rengDato('asfixia', 'En espacios cerrados puede reducir el oxígeno disponible.')
  ]),
  rengIcsc({ id: 'nitrogeno-liquido', nombre: 'Nitrógeno líquido', formula: 'N2', cas: '7727-37-9', z: 7, biblioteca: 'nitrógeno', condicion: 'Gas licuado refrigerado.' }, '1199', '1999-03', 'documentado', [
    rengDato('presion', 'El calentamiento puede romper el recipiente. El líquido provoca lesiones por frío.'), rengDato('asfixia', 'Al evaporarse puede desplazar el oxígeno del aire.')
  ]),
  rengIcsc({ id: 'amoniaco-anhidro', nombre: 'Amoniaco anhidro', formula: 'NH3', cas: '7664-41-7', biblioteca: 'amoniaco', condicion: 'Gas licuado a presión, sin agua.' }, '0414', '2013-10', 'peligro', [
    rengDato('inflamabilidad', 'Puede arder como gas.'), rengDato('presion', 'El recipiente a presión puede romperse al calentarse.'),
    rengDato('toxicidad-aguda', 'Tóxico por inhalación.'), rengDato('corrosion', 'Puede producir quemaduras graves y lesiones oculares.'), rengDato('ambiental', 'Muy tóxico para organismos acuáticos.')
  ], ['GHS04', 'GHS05', 'GHS06', 'GHS09']),
  rengIcsc({ id: 'metano-gas', nombre: 'Metano', formula: 'CH4', cas: '74-82-8', biblioteca: 'metano', condicion: 'Gas comprimido o licuado.' }, '0291', '2000-02', 'documentado', [
    rengDato('inflamabilidad', 'Arde con facilidad y el gas mezclado con el aire puede explotar.'), rengDato('asfixia', 'Puede desplazar el oxígeno en recintos cerrados.')
  ]),
  rengIcsc({ id: 'etino-gas', nombre: 'Etino', formula: 'C2H2', cas: '74-86-2', biblioteca: 'etino', condicion: 'Gas. La ficha incluye la presentación disuelta bajo presión.' }, '0089', '2003-08', 'documentado', [
    rengDato('inflamabilidad', 'Se inflama con extrema facilidad.'), rengDato('explosion', 'Forma mezclas explosivas con el aire y puede descomponerse violentamente.'), rengDato('asfixia', 'En espacios confinados puede desplazar el oxígeno del aire.')
  ]),
  rengIcsc({ id: 'eteno-gas', nombre: 'Eteno', formula: 'C2H4', cas: '74-85-1', biblioteca: 'eteno', condicion: 'Gas comprimido.' }, '0475', '2022-12', 'peligro', [
    rengDato('inflamabilidad', 'Gas extremadamente inflamable.'), rengDato('presion', 'El recipiente a presión puede romperse al calentarse.'), rengDato('toxicidad-aguda', 'Puede causar mareos o somnolencia.')
  ], ['GHS02', 'GHS04', 'GHS07']),
  rengIcsc({ id: 'propano-gas', nombre: 'Propano', formula: 'C3H8', cas: '74-98-6', biblioteca: 'propano', condicion: 'Gas licuado a presión.' }, '0319', '2003-11', 'documentado', [
    rengDato('inflamabilidad', 'Se inflama con extrema facilidad y sus mezclas con el aire pueden explotar.'), rengDato('presion', 'El recipiente puede romperse al calentarse.')
  ]),
  rengIcsc({ id: 'butano-gas', nombre: 'Butano lineal', formula: 'C4H10', cas: '106-97-8', biblioteca: 'butano', condicion: 'Gas licuado a presión. Solo n-butano.' }, '0232', '2003-11', 'documentado', [
    rengDato('inflamabilidad', 'Gas extremadamente inflamable. Puede formar mezclas explosivas con el aire.'), rengDato('presion', 'El calentamiento puede romper el recipiente.')
  ]),
  rengIcsc({ id: 'helio-gas', nombre: 'Helio comprimido', formula: 'He', cas: '7440-59-7', z: 2, referencia: true, biblioteca: 'helio', condicion: 'Gas comprimido. El helio licuado tiene condiciones distintas.' }, '0603', '2003-08', 'documentado', [
    rengDato('asfixia', 'Si se acumula en un espacio cerrado puede desplazar el oxígeno del aire.')
  ]),
  rengIcsc({ id: 'neon-gas', nombre: 'Neón comprimido', formula: 'Ne', cas: '7440-01-9', z: 10, referencia: true, biblioteca: 'neón', condicion: 'Gas comprimido.' }, '0627', '2007-11', 'atencion', [
    rengDato('presion', 'El recipiente presurizado puede romperse al calentarse.'), rengDato('asfixia', 'Puede desplazar el oxígeno en espacios cerrados.')
  ], ['GHS04']),
  rengIcsc({ id: 'argon-gas', nombre: 'Argón comprimido', formula: 'Ar', cas: '7440-37-1', z: 18, referencia: true, biblioteca: 'argón', condicion: 'Gas comprimido. La ficha también describe el argón refrigerado por separado.' }, '0154', '2003-08', 'documentado', [
    rengDato('asfixia', 'En espacios cerrados puede reducir el oxígeno disponible.')
  ]),
  rengIcsc({ id: 'etano-gas', nombre: 'Etano', formula: 'C2H6', cas: '74-84-0', biblioteca: 'etano', condicion: 'Gas comprimido.' }, '0266', '2006-04', 'peligro', [
    rengDato('inflamabilidad', 'Gas extremadamente inflamable.'), rengDato('presion', 'El recipiente presurizado puede romperse al calentarse.')
  ], ['GHS02', 'GHS04']),
  rengIcsc({ id: 'fosforico-concentrado', nombre: 'Ácido fosfórico', formula: 'H3PO4', cas: '7664-38-2', biblioteca: 'ácido fosfórico', condicion: 'Sustancia concentrada. La concentración cambia la clasificación de sus disoluciones.' }, '1008', '2016-11', 'peligro', [
    rengDato('corrosion-metales', 'Puede corroer metales.'), rengDato('corrosion', 'Causa quemaduras graves y daño ocular.'), rengDato('irritacion', 'Puede irritar las vías respiratorias.'), rengDato('ambiental', 'Nocivo para la vida acuática.')
  ], ['GHS05', 'GHS07']),
  rengIcsc({ id: 'nitrico-mayor-70', nombre: 'Ácido nítrico · disolución superior al 70 %', formula: 'HNO3', cas: '7697-37-2', biblioteca: 'ácido nítrico', condicion: 'Solo disolución acuosa de más del 70 %. El CAS corresponde al soluto.' }, '0183', '2016-11', 'peligro', [
    rengDato('oxidante', 'Puede intensificar un incendio.'), rengDato('corrosion-metales', 'Puede atacar metales.'), rengDato('corrosion', 'Puede quemar gravemente la piel y dañar los ojos.'), rengDato('irritacion', 'Puede irritar las vías respiratorias.')
  ], ['GHS03', 'GHS05']),
  rengIcsc({ id: 'hf-anhidro', nombre: 'Fluoruro de hidrógeno anhidro', formula: 'HF', cas: '7664-39-3', biblioteca: 'fluoruro de hidrógeno', condicion: 'Sustancia anhidra. La ficha separa las disoluciones acuosas.' }, '0283', '2017-04', 'peligro', [
    rengDato('toxicidad-aguda', 'La ingestión o la inhalación pueden ser mortales.'), rengDato('corrosion', 'Puede causar quemaduras graves y lesiones oculares.'),
    rengDato('irritacion', 'Puede irritar las vías respiratorias.'), rengDato('efectos-cronicos', 'La exposición repetida puede dañar los huesos.'), rengDato('ambiental', 'Nocivo para organismos acuáticos.')
  ], ['GHS05', 'GHS06', 'GHS08']),
  rengIcsc({ id: 'formico-puro', nombre: 'Ácido fórmico', formula: 'CH2O2', cas: '64-18-6', biblioteca: 'ácido fórmico', condicion: 'Líquido, sustancia sin diluir.' }, '0485', '2024-04', 'peligro', [
    rengDato('inflamabilidad', 'Líquido y vapor inflamables.'), rengDato('toxicidad-aguda', 'Tóxico al inhalarlo y nocivo al ingerirlo.'), rengDato('corrosion', 'Puede quemar gravemente la piel y lesionar los ojos.'), rengDato('ambiental', 'Nocivo para la vida acuática.')
  ], ['GHS02', 'GHS05', 'GHS06']),
  rengIcsc({ id: 'citrico-solido', nombre: 'Ácido cítrico', formula: 'C6H8O7', cas: '77-92-9', biblioteca: 'ácido cítrico', condicion: 'Sólido anhidro.' }, '0855', '1998-03', 'documentado', [
    rengDato('irritacion', 'La ficha describe irritación de los ojos, la piel y las vías respiratorias.')
  ]),
  rengIcsc({ id: 'benzoico-solido', nombre: 'Ácido benzoico', formula: 'C7H6O2', cas: '65-85-0', biblioteca: 'ácido benzoico', condicion: 'Sólido cristalino.' }, '0103', '2023-11', 'atencion', [
    rengDato('irritacion', 'Puede provocar daño grave en los ojos.'), rengDato('toxicidad-aguda', 'La inhalación puede dañar los pulmones.'), rengDato('ambiental', 'Nocivo para organismos acuáticos.')
  ], ['GHS07', 'GHS08']),
  rengIcsc({ id: 'oxalico-anhidro', nombre: 'Ácido oxálico anhidro', formula: 'C2H2O4', cas: '144-62-7', biblioteca: 'ácido oxálico', condicion: 'Sólido anhidro, distinto del dihidrato.' }, '0529', '2009-11', 'peligro', [
    rengDato('toxicidad-aguda', 'Nocivo por ingestión.'), rengDato('corrosion', 'Puede producir quemaduras graves y lesiones oculares.'), rengDato('irritacion', 'Puede irritar las vías respiratorias.')
  ], ['GHS05', 'GHS07']),
  rengIcsc({ id: 'hcn-licuado', nombre: 'Cianuro de hidrógeno licuado', formula: 'HCN', cas: '74-90-8', biblioteca: 'cianuro de hidrógeno', condicion: 'Sustancia licuada. No se extiende la clasificación a sales de cianuro.' }, '0492', '2018-05', 'peligro', [
    rengDato('inflamabilidad', 'El líquido y sus vapores son extremadamente inflamables.'), rengDato('toxicidad-aguda', 'Puede ser mortal al inhalarlo, ingerirlo o por contacto cutáneo.'), rengDato('irritacion', 'Irrita los ojos.'), rengDato('ambiental', 'Muy tóxico para la vida acuática con efectos duraderos.')
  ], ['GHS02', 'GHS06', 'GHS09']),
  rengIcsc({ id: 'hexano-puro', nombre: 'Hexano lineal', formula: 'C6H14', cas: '110-54-3', biblioteca: 'hexano', condicion: 'Líquido. Solo n-hexano.' }, '0279', '2024-04', 'peligro', [
    rengDato('inflamabilidad', 'El líquido y los vapores son inflamables.'), rengDato('irritacion', 'Irrita la piel.'), rengDato('toxicidad-aguda', 'Puede causar mareo. Tras ingestión, la aspiración puede ser mortal.'),
    rengDato('efectos-cronicos', 'La exposición repetida daña el sistema nervioso.'), rengDato('ambiental', 'Tóxico para la vida acuática con efectos duraderos.')
  ], ['GHS02', 'GHS07', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'octano-puro', nombre: 'Octano lineal', formula: 'C8H18', cas: '111-65-9', biblioteca: 'octano', condicion: 'Líquido. Solo n-octano.' }, '0933', '1997-08', 'documentado', [
    rengDato('inflamabilidad', 'El líquido prende con facilidad y los vapores pueden formar mezclas explosivas.')
  ]),
  rengIcsc({ id: 'isopropanol-puro', nombre: 'Propan-2-ol', formula: 'C3H8O', cas: '67-63-0', biblioteca: 'propan-2-ol', condicion: 'Líquido, sustancia sin diluir.' }, '0554', '2020-07', 'peligro', [
    rengDato('inflamabilidad', 'Líquido y vapor muy inflamables.'), rengDato('irritacion', 'Irrita intensamente los ojos.'), rengDato('toxicidad-aguda', 'Puede causar somnolencia o mareos.')
  ], ['GHS02', 'GHS07']),
  rengIcsc({ id: 'acetato-etilo-puro', nombre: 'Acetato de etilo', formula: 'C4H8O2', cas: '141-78-6', biblioteca: 'acetato de etilo', condicion: 'Líquido, sustancia sin diluir.' }, '0367', '2014-04', 'peligro', [
    rengDato('inflamabilidad', 'Líquido y vapor muy inflamables.'), rengDato('toxicidad-aguda', 'La exposición puede causar somnolencia o mareo.')
  ], ['GHS02', 'GHS07']),
  rengIcsc({ id: 'dimetileter-gas', nombre: 'Metoximetano', formula: 'C2H6O', cas: '115-10-6', biblioteca: 'metoximetano', condicion: 'Gas licuado a presión.' }, '0454', '2002-08', 'documentado', [
    rengDato('inflamabilidad', 'Gas extremadamente inflamable.'), rengDato('explosion', 'Puede formar peróxidos explosivos en presencia de aire y luz.'), rengDato('irritacion', 'Irrita los ojos y las vías respiratorias.')
  ]),
  rengIcsc({ id: 'formaldehido-gas', nombre: 'Formaldehído gaseoso', formula: 'CH2O', cas: '50-00-0', biblioteca: 'formaldehído', condicion: 'Gas. La clasificación no se aplica a formalina ni al polímero.' }, '0275', '2012-06', 'peligro', [
    rengDato('inflamabilidad', 'Gas extremadamente inflamable.'), rengDato('toxicidad-aguda', 'La inhalación puede ser mortal.'), rengDato('irritacion', 'Irrita intensamente los ojos y puede irritar las vías respiratorias.'), rengDato('efectos-cronicos', 'Puede causar cáncer por inhalación.'), rengDato('sensibilizacion', 'Puede provocar alergia cutánea.')
  ], ['GHS02', 'GHS06', 'GHS08']),
  rengIcsc({ id: 'tolueno-puro', nombre: 'Tolueno', formula: 'C7H8', cas: '108-88-3', biblioteca: 'tolueno', condicion: 'Líquido, sustancia sin diluir.' }, '0078', '2023-11', 'peligro', [
    rengDato('inflamabilidad', 'Líquido y vapor muy inflamables.'), rengDato('toxicidad-aguda', 'Puede ser mortal por aspiración tras ingerirlo.'), rengDato('irritacion', 'Irrita la piel.'), rengDato('efectos-cronicos', 'Se sospechan efectos reproductivos. La exposición repetida puede dañar el sistema nervioso.'), rengDato('ambiental', 'Tóxico para organismos acuáticos con efectos duraderos.')
  ], ['GHS02', 'GHS07', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'naftaleno-solido', nombre: 'Naftaleno', formula: 'C10H8', cas: '91-20-3', biblioteca: 'naftaleno', condicion: 'Sólido cristalino.' }, '0667', '2015-06', 'atencion', [
    rengDato('inflamabilidad', 'Sólido inflamable.'), rengDato('toxicidad-aguda', 'Nocivo si se ingiere. Puede ser nocivo por contacto con la piel.'), rengDato('efectos-cronicos', 'Se sospecha un efecto cancerígeno.'), rengDato('ambiental', 'Muy tóxico para organismos acuáticos con efectos duraderos.')
  ], ['GHS02', 'GHS07', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'ciclohexano-puro', nombre: 'Ciclohexano', formula: 'C6H12', cas: '110-82-7', biblioteca: 'ciclohexano', condicion: 'Líquido, sustancia sin diluir.' }, '0242', '2011-06', 'peligro', [
    rengDato('inflamabilidad', 'Líquido y vapor muy inflamables.'), rengDato('irritacion', 'Irrita los ojos y, de forma leve, la piel.'), rengDato('toxicidad-aguda', 'Puede ser mortal por aspiración tras ingerirlo.'), rengDato('ambiental', 'Muy tóxico para organismos acuáticos con efectos duraderos.')
  ], ['GHS02', 'GHS07', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'etilenglicol-puro', nombre: 'Etilenglicol', formula: 'C2H6O2', cas: '107-21-1', biblioteca: 'etilenglicol', condicion: 'Líquido, sustancia sin diluir.' }, '0270', '2018-05', 'atencion', [
    rengDato('toxicidad-aguda', 'Nocivo al ingerirlo. Puede dañar los riñones y el sistema nervioso central.')
  ], ['GHS07', 'GHS08']),
  rengIcsc({ id: 'cafeina-solida', nombre: 'Cafeína anhidra', formula: 'C8H10N4O2', cas: '58-08-2', biblioteca: 'cafeína', condicion: 'Sustancia sólida. La ficha describe la cafeína aislada.' }, '0405', '1998-03', 'documentado', [
    rengDato('toxicidad-aguda', 'Puede afectar el sistema nervioso y el cardiovascular. La ficha describe, entre otros efectos, excitación y taquicardia.')
  ]),
  rengIcsc({ id: 'nicotina-base', nombre: 'Nicotina', formula: 'C10H14N2', cas: '54-11-5', biblioteca: 'nicotina', condicion: 'Nicotina aislada en forma de base libre.' }, '0519', '2023-11', 'peligro', [
    rengDato('toxicidad-aguda', 'Puede ser mortal por ingestión, contacto con la piel o inhalación. Puede dañar el sistema nervioso y el cardiovascular.'), rengDato('ambiental', 'Tóxica para organismos acuáticos, con efectos duraderos.')
  ], ['GHS06', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'salicilico-solido', nombre: 'Ácido salicílico', formula: 'C7H6O3', cas: '69-72-7', biblioteca: 'ácido salicílico', condicion: 'Sólido, sustancia aislada.' }, '0563', '2023-11', 'peligro', [
    rengDato('toxicidad-aguda', 'Nocivo si se ingiere.'), rengDato('irritacion', 'Puede causar lesiones graves en los ojos.'), rengDato('efectos-cronicos', 'Se sospechan efectos adversos sobre la reproducción.')
  ], ['GHS05', 'GHS07', 'GHS08']),
  rengIcsc({ id: 'acetilsalicilico-solido', nombre: 'Ácido acetilsalicílico', formula: 'C9H8O4', cas: '50-78-2', biblioteca: 'ácido acetilsalicílico', condicion: 'Sustancia sólida aislada. Una tableta terminada tiene su propia composición.' }, '0822', '1998-03', 'documentado', [
    rengDato('irritacion', 'El contacto con el polvo irrita los ojos, la piel y las vías respiratorias.')
  ]),
  rengIcsc({ id: 'urea-solida', nombre: 'Urea', formula: 'CH4N2O', cas: '57-13-6', biblioteca: 'urea', condicion: 'Sólido, sustancia aislada.' }, '0595', '1997-07', 'documentado', [
    rengDato('irritacion', 'El polvo irrita los ojos, la piel y las vías respiratorias.')
  ]),
  rengIcsc({ id: 'potasio-metal', nombre: 'Potasio metálico', formula: 'K', cas: '7440-09-7', z: 19, referencia: true, condicion: 'Metal sólido.' }, '0716', '2006-04', 'peligro', [
    rengDato('reactividad', 'Con agua libera un gas inflamable que puede prender por sí solo.'), rengDato('corrosion', 'Causa quemaduras graves y lesiones oculares.')
  ], ['GHS02', 'GHS05']),
  rengIcsc({ id: 'hg-liquido', nombre: 'Mercurio metálico', formula: 'Hg', cas: '7439-97-6', z: 80, referencia: true, condicion: 'Metal líquido y exposición a su vapor.' }, '0056', '2019-11', 'peligro', [
    rengDato('corrosion-metales', 'Puede atacar algunos metales.'), rengDato('toxicidad-aguda', 'La inhalación puede ser mortal.'), rengDato('efectos-cronicos', 'Puede afectar a la reproducción. La exposición repetida puede dañar los riñones y el sistema nervioso central.'), rengDato('ambiental', 'Muy tóxico para organismos acuáticos con efectos duraderos.')
  ], ['GHS05', 'GHS06', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'pb-polvo', nombre: 'Plomo metálico en polvo', formula: 'Pb', cas: '7439-92-1', z: 82, condicion: 'Polvo metálico, presentación descrita en la ficha.' }, '0052', '2019-11', 'peligro', [
    rengDato('efectos-cronicos', 'Puede dañar la reproducción y órganos. Se sospecha un efecto cancerígeno.'), rengDato('ambiental', 'Tóxico para organismos acuáticos, con efectos duraderos.')
  ], ['GHS07', 'GHS08', 'GHS09']),
  rengIcsc({ id: 'p-blanco', nombre: 'Fósforo blanco o amarillo', formula: 'P4', cas: '12185-10-3', z: 15, biblioteca: 'fósforo blanco (P₄)', condicion: 'Alótropo blanco o amarillo, sólido.' }, '0628', '2004-04', 'documentado', [
    rengDato('inflamabilidad', 'Puede prender espontáneamente en contacto con el aire.'), rengDato('corrosion', 'Puede producir quemaduras graves.'), rengDato('toxicidad-aguda', 'La ficha describe efectos sistémicos graves tras la exposición.')
  ]),
  rengIcsc({ id: 'azufre-solido', nombre: 'Azufre elemental sólido', formula: 'S8', cas: '7704-34-9', z: 16, referencia: true, biblioteca: 'azufre (S₈)', condicion: 'Sólido. La explosión de polvo corresponde a partículas finas suspendidas en el aire.' }, '1166', '2000-11', 'documentado', [
    rengDato('inflamabilidad', 'Es combustible y al arder forma gases irritantes o tóxicos.'), rengDato('explosion', 'El polvo fino disperso en aire puede explotar.')
  ]),
  rengIcsc({ id: 'zn-polvo-piroforico', nombre: 'Zinc en polvo pirofórico', formula: 'Zn', cas: '7440-66-6', z: 30, condicion: 'Polvo pirofórico, presentación específica.' }, '1205', '2019-11', 'peligro', [
    rengDato('inflamabilidad', 'Puede arder espontáneamente al contacto con el aire.'), rengDato('reactividad', 'Con agua libera gas inflamable que puede prender por sí solo.'), rengDato('ambiental', 'Muy tóxico para organismos acuáticos con efectos duraderos.')
  ], ['GHS02', 'GHS09']),
  rengIcsc({ id: 'cr-metal', nombre: 'Cromo metálico', formula: 'Cr', cas: '7440-47-3', z: 24, referencia: true, condicion: 'Cromo elemental sólido. La ficha distingue el polvo del metal.' }, '0029', '2004-10', 'documentado', [
    rengDato('reactividad', 'Puede catalizar reacciones peligrosas en contacto con otras sustancias.'), rengDato('irritacion', 'Las partículas pueden irritar mecánicamente los ojos y las vías respiratorias.')
  ]),
  rengIcsc({ id: 'cd-metal', nombre: 'Cadmio metálico', formula: 'Cd', cas: '7440-43-9', z: 48, referencia: true, condicion: 'Metal sólido. Los efectos por inhalación indicados corresponden a sus humos.' }, '0020', '2005-04', 'documentado', [
    rengDato('reactividad', 'Con ácidos desprende hidrógeno inflamable.'), rengDato('toxicidad-aguda', 'Inhalar los humos puede causar lesión pulmonar y fiebre por humos metálicos.')
  ]),
  rengIcsc({ id: 'cu-metal', nombre: 'Cobre metálico', formula: 'Cu', cas: '7440-50-8', z: 29, referencia: true, biblioteca: 'cobre', condicion: 'Metal sólido. La ficha indica que la inflamabilidad depende de la forma, especialmente del polvo.' }, '0240', '2016-11', 'peligro', [
    rengDato('inflamabilidad', 'La clasificación de la ficha incluye inflamabilidad. El polvo puede arder.'), rengDato('toxicidad-aguda', 'Nocivo al ingerirlo.'), rengDato('ambiental', 'Muy tóxico para organismos acuáticos con efectos duraderos.')
  ], ['GHS02', 'GHS07', 'GHS09']),
  rengIcsc({ id: 'ag-metal', nombre: 'Plata metálica', formula: 'Ag', cas: '7440-22-4', z: 47, referencia: true, biblioteca: 'plata', condicion: 'Metal sólido. Consultar la ficha para las diferencias entre formas macizas y polvo.' }, '0810', '2019-11', 'atencion', [
    rengDato('ambiental', 'Muy tóxica para la vida acuática, con efectos duraderos.')
  ], ['GHS09'])
]
