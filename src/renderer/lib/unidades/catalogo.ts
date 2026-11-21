import { rengDim, type RengDimension } from './dimension'

export interface RengUnidad {
  simbolo: string
  nombre: string
  plural: string
  alias: readonly string[]
  factor: number
  desplazamiento: number
  comun: boolean
  exacto: boolean
  fuente: string
  magnitud: string
}

export interface RengMagnitud {
  id: string
  nombre: string
  simbolo: string
  dimension: RengDimension
  unidades: readonly RengUnidad[]
  aislada?: boolean
  sinonimos?: readonly string[]
}

const RENG_SI = 'BIPM, Folleto SI 9.ª ed. (2019)'
const RENG_SI_PREF = 'BIPM, Folleto SI 9.ª ed., prefijos SI (múltiplo decimal exacto)'
const RENG_ACEPTADA = 'BIPM, Folleto SI 9.ª ed., tabla 8 (unidad no SI aceptada)'
const RENG_NIST = 'NIST SP 811 (2008), apéndice B'

type RengOpc = Partial<Pick<RengUnidad, 'plural' | 'alias' | 'comun' | 'exacto' | 'fuente' | 'desplazamiento'>>
type RengDef = Omit<RengUnidad, 'magnitud'>

const RENG_INVARIABLES = new Set(['newton', 'kelvin', 'gauss', 'watt', 'pársec', 'weber', 'joule'])
export function rengPluralizar(rengNombre: string): string {
  const [rengP, ...rengResto] = rengNombre.split(' ')
  if (!rengP) return rengNombre
  let rengW = rengP
  if (RENG_INVARIABLES.has(rengP)) rengW = rengP === 'gauss' ? rengP : `${rengP}s`
  else if (/[aeiouáéó]$/.test(rengP)) rengW = `${rengP}s`
  else if (/ón$/.test(rengP)) rengW = `${rengP.slice(0, -2)}ones`
  else if (/án$/.test(rengP)) rengW = `${rengP.slice(0, -2)}anes`
  else if (/z$/.test(rengP)) rengW = `${rengP.slice(0, -1)}ces`
  else rengW = `${rengP}es`
  return [rengW, ...rengResto].join(' ')
}

const rengU = (rengSimbolo: string, rengNombre: string, rengFactor: number, rengO: RengOpc = {}): RengDef => ({
  simbolo: rengSimbolo,
  nombre: rengNombre,
  plural: rengO.plural ?? rengPluralizar(rengNombre),
  alias: rengO.alias ?? [],
  factor: rengFactor,
  desplazamiento: rengO.desplazamiento ?? 0,
  comun: rengO.comun ?? false,
  exacto: rengO.exacto ?? true,
  fuente: rengO.fuente ?? RENG_SI_PREF
})

export const RENG_PREFIJOS: Readonly<Record<string, { nombre: string; factor: number }>> = {
  Q: { nombre: 'quetta', factor: 1e30 }, R: { nombre: 'ronna', factor: 1e27 }, Y: { nombre: 'yotta', factor: 1e24 }, Z: { nombre: 'zetta', factor: 1e21 },
  E: { nombre: 'exa', factor: 1e18 }, P: { nombre: 'peta', factor: 1e15 }, T: { nombre: 'tera', factor: 1e12 }, G: { nombre: 'giga', factor: 1e9 },
  M: { nombre: 'mega', factor: 1e6 }, k: { nombre: 'kilo', factor: 1e3 }, h: { nombre: 'hecto', factor: 1e2 }, da: { nombre: 'deca', factor: 1e1 },
  d: { nombre: 'deci', factor: 1e-1 }, c: { nombre: 'centi', factor: 1e-2 }, m: { nombre: 'mili', factor: 1e-3 }, µ: { nombre: 'micro', factor: 1e-6 },
  n: { nombre: 'nano', factor: 1e-9 }, p: { nombre: 'pico', factor: 1e-12 }, f: { nombre: 'femto', factor: 1e-15 }, a: { nombre: 'atto', factor: 1e-18 },
  z: { nombre: 'zepto', factor: 1e-21 }, y: { nombre: 'yocto', factor: 1e-24 }, r: { nombre: 'ronto', factor: 1e-27 }, q: { nombre: 'quecto', factor: 1e-30 }
}

const RENG_AU = 149_597_870_700
const RENG_ANIO = 31_557_600
const RENG_LBF = 4.4482216152605
const RENG_LB = 0.45359237

const RENG_M = (rengId: string, rengNombre: string, rengSimbolo: string, rengDimension: RengDimension, rengDefs: RengDef[], rengExtra: Partial<Pick<RengMagnitud, 'aislada' | 'sinonimos'>> = {}): RengMagnitud => ({
  id: rengId,
  nombre: rengNombre,
  simbolo: rengSimbolo,
  dimension: rengDimension,
  unidades: rengDefs.map((rengD) => ({ ...rengD, magnitud: rengId })),
  ...rengExtra
})

export const RENG_MAGNITUDES: readonly RengMagnitud[] = [
  RENG_M('longitud', 'longitud', 'l', rengDim({ L: 1 }), [
    rengU('m', 'metro', 1, { comun: true, fuente: RENG_SI, alias: ['metros'] }),
    rengU('km', 'kilómetro', 1e3, { comun: true }),
    rengU('cm', 'centímetro', 1e-2, { comun: true }),
    rengU('mm', 'milímetro', 1e-3, { comun: true }),
    rengU('µm', 'micrómetro', 1e-6, { alias: ['um', 'micra'] }),
    rengU('nm', 'nanómetro', 1e-9),
    rengU('Å', 'ångström', 1e-10, { alias: ['angstrom'], fuente: RENG_NIST }),
    rengU('in', 'pulgada', 0.0254, { fuente: RENG_NIST, alias: ['pulg', '"'] }),
    rengU('ft', 'pie', 0.3048, { fuente: RENG_NIST }),
    rengU('mi', 'milla terrestre internacional', 1609.344, { fuente: RENG_NIST, plural: 'millas terrestres internacionales', alias: ['milla'] }),
    rengU('UA', 'unidad astronómica', RENG_AU, { plural: 'unidades astronómicas', alias: ['au', 'ua'], fuente: 'IAU 2012, resolución B2 (exacta); BIPM tabla 8' }),
    rengU('a·l', 'año luz', 299_792_458 * RENG_ANIO, { plural: 'años luz', alias: ['ly', 'al', 'año-luz'], fuente: 'IAU: c × año juliano (exacto)' }),
    rengU('pc', 'pársec', (648_000 / Math.PI) * RENG_AU, { exacto: false, fuente: 'IAU 2015, resolución B2: 648000/π UA (exacto por definición; π no es representable exactamente)' })
  ], { sinonimos: ['distancia', 'altura', 'largo', 'posición'] }),
  RENG_M('masa', 'masa', 'm', rengDim({ M: 1 }), [
    rengU('kg', 'kilogramo', 1, { comun: true, fuente: RENG_SI, alias: ['kilo', 'kilos'] }),
    rengU('g', 'gramo', 1e-3, { comun: true }),
    rengU('mg', 'miligramo', 1e-6),
    rengU('t', 'tonelada', 1e3, { comun: true, fuente: RENG_ACEPTADA, alias: ['tonelada métrica'] }),
    rengU('lb', 'libra', RENG_LB, { fuente: RENG_NIST, alias: ['lbs'] }),
    rengU('oz', 'onza', 0.028349523125, { fuente: RENG_NIST }),
    rengU('u', 'unidad de masa atómica', 1.66053906892e-27, { plural: 'unidades de masa atómica', alias: ['Da', 'dalton', 'uma'], exacto: false, fuente: 'CODATA 2022: 1,66053906892(52)·10⁻²⁷ kg' })
  ], { sinonimos: ['peso'] }),
  RENG_M('tiempo', 'tiempo', 't', rengDim({ T: 1 }), [
    rengU('s', 'segundo', 1, { comun: true, fuente: RENG_SI, alias: ['seg', 'sec'] }),
    rengU('ms', 'milisegundo', 1e-3, { comun: true }),
    rengU('µs', 'microsegundo', 1e-6, { alias: ['us'] }),
    rengU('min', 'minuto', 60, { comun: true, fuente: RENG_ACEPTADA }),
    rengU('h', 'hora', 3600, { comun: true, fuente: RENG_ACEPTADA, alias: ['hr'] }),
    rengU('d', 'día', 86_400, { fuente: RENG_ACEPTADA, alias: ['dias'] }),
    rengU('años', 'año juliano', RENG_ANIO, { plural: 'años julianos', alias: ['año', 'a', 'yr'], fuente: 'IAU: año juliano = 365,25 d (exacto)' })
  ], { sinonimos: ['duración', 'periodo', 'período'] }),
  RENG_M('velocidad', 'velocidad', 'v', rengDim({ L: 1, T: -1 }), [
    rengU('m/s', 'metro por segundo', 1, { comun: true, fuente: RENG_SI, alias: ['mps'] }),
    rengU('km/h', 'kilómetro por hora', 1 / 3.6, { comun: true, alias: ['kph', 'kmh', 'km/hr'], fuente: 'Definición: 1000 m / 3600 s (exacta)' }),
    rengU('km/s', 'kilómetro por segundo', 1e3),
    rengU('cm/s', 'centímetro por segundo', 1e-2),
    rengU('mph', 'milla por hora', 0.44704, { fuente: RENG_NIST, alias: ['mi/h'] }),
    rengU('kn', 'nudo', 1852 / 3600, { fuente: `${RENG_NIST} (milla náutica 1852 m / h)`, alias: ['nudos', 'kt'] }),
    rengU('ft/s', 'pie por segundo', 0.3048, { fuente: RENG_NIST }),
    rengU('UA/año', 'unidad astronómica por año', RENG_AU / RENG_ANIO, { plural: 'unidades astronómicas por año', exacto: false, fuente: 'UA (IAU 2012) / año juliano', alias: ['au/yr', 'UA/años'] }),
    rengU('c', 'velocidad de la luz', 299_792_458, { plural: 'veces la velocidad de la luz', fuente: 'BIPM: c = 299 792 458 m/s (exacta)' })
  ], { sinonimos: ['rapidez', 'celeridad'] }),
  RENG_M('aceleracion', 'aceleración', 'a', rengDim({ L: 1, T: -2 }), [
    rengU('m/s²', 'metro por segundo al cuadrado', 1, { comun: true, fuente: RENG_SI, plural: 'metros por segundo al cuadrado' }),
    rengU('cm/s²', 'centímetro por segundo al cuadrado', 1e-2, { plural: 'centímetros por segundo al cuadrado', alias: ['Gal', 'gal'] }),
    rengU('ft/s²', 'pie por segundo al cuadrado', 0.3048, { plural: 'pies por segundo al cuadrado', fuente: RENG_NIST }),
    rengU('g₀', 'gravedad estándar', 9.80665, { plural: 'veces la gravedad estándar', comun: true, alias: ['g0', 'gn', 'ge'], fuente: 'BIPM / CGPM 1901: gn = 9,80665 m/s² (exacta)' })
  ], { sinonimos: ['gravedad'] }),
  RENG_M('fuerza', 'fuerza', 'F', rengDim({ L: 1, M: 1, T: -2 }), [
    rengU('N', 'newton', 1, { comun: true, fuente: RENG_SI, alias: ['newtons'] }),
    rengU('kN', 'kilonewton', 1e3, { comun: true }),
    rengU('mN', 'milinewton', 1e-3),
    rengU('MN', 'meganewton', 1e6),
    rengU('dyn', 'dina', 1e-5, { fuente: RENG_NIST }),
    rengU('kgf', 'kilogramo-fuerza', 9.80665, { plural: 'kilogramos-fuerza', fuente: RENG_NIST, alias: ['kp'] }),
    rengU('lbf', 'libra-fuerza', RENG_LBF, { plural: 'libras-fuerza', fuente: RENG_NIST })
  ], { sinonimos: ['empuje', 'peso', 'tensión'] }),
  RENG_M('energia', 'energía', 'E', rengDim({ L: 2, M: 1, T: -2 }), [
    rengU('J', 'julio', 1, { comun: true, fuente: RENG_SI, alias: ['joule', 'joules', 'jul'] }),
    rengU('kJ', 'kilojulio', 1e3, { comun: true, alias: ['kilojoule'] }),
    rengU('MJ', 'megajulio', 1e6),
    rengU('Wh', 'vatio hora', 3600, { plural: 'vatios hora', alias: ['vatio-hora'] }),
    rengU('kWh', 'kilovatio hora', 3.6e6, { plural: 'kilovatios hora', comun: true, alias: ['kilovatio-hora', 'kw·h'] }),
    rengU('eV', 'electronvoltio', 1.602176634e-19, { fuente: 'BIPM tabla 8; e exacta desde 2019', alias: ['electronvolt'] }),
    rengU('keV', 'kiloelectronvoltio', 1.602176634e-16),
    rengU('MeV', 'megaelectronvoltio', 1.602176634e-13),
    rengU('cal_th', 'caloría termoquímica', 4.184, { plural: 'calorías termoquímicas', fuente: RENG_NIST, alias: ['caloria termoquimica'] }),
    rengU('kcal_th', 'kilocaloría termoquímica', 4184, { plural: 'kilocalorías termoquímicas', fuente: RENG_NIST, alias: ['caloria alimentaria', 'Cal'] }),
    rengU('cal_IT', 'caloría internacional (IT)', 4.1868, { plural: 'calorías internacionales (IT)', fuente: RENG_NIST, alias: ['caloria IT', 'caloria internacional'] }),
    rengU('BTU_IT', 'unidad térmica británica (IT)', 1055.05585262, { plural: 'unidades térmicas británicas (IT)', fuente: RENG_NIST, alias: ['btu'] }),
    rengU('erg', 'ergio', 1e-7, { fuente: RENG_NIST })
  ], { sinonimos: ['trabajo', 'calor'] }),
  RENG_M('potencia', 'potencia', 'P', rengDim({ L: 2, M: 1, T: -3 }), [
    rengU('W', 'vatio', 1, { comun: true, fuente: RENG_SI, alias: ['watt', 'watts'] }),
    rengU('kW', 'kilovatio', 1e3, { comun: true }),
    rengU('mW', 'milivatio', 1e-3),
    rengU('MW', 'megavatio', 1e6),
    rengU('hp', 'caballo de potencia mecánico (hp)', 745.6998715822702, { plural: 'caballos de potencia mecánicos (hp)', fuente: `${RENG_NIST}: 550 ft·lbf/s (exacto)`, alias: ['horsepower', 'caballo de fuerza'] }),
    rengU('CV', 'caballo de vapor métrico', 735.49875, { plural: 'caballos de vapor métricos', fuente: `${RENG_NIST}: 75 kgf·m/s (exacto)`, alias: ['caballo de vapor', 'PS'] })
  ]),
  RENG_M('presion', 'presión', 'p', rengDim({ L: -1, M: 1, T: -2 }), [
    rengU('Pa', 'pascal', 1, { comun: true, fuente: RENG_SI, plural: 'pascales' }),
    rengU('kPa', 'kilopascal', 1e3, { comun: true, plural: 'kilopascales' }),
    rengU('MPa', 'megapascal', 1e6, { plural: 'megapascales' }),
    rengU('hPa', 'hectopascal', 1e2, { plural: 'hectopascales' }),
    rengU('bar', 'bar', 1e5, { plural: 'bares', fuente: RENG_NIST }),
    rengU('mbar', 'milibar', 1e2, { plural: 'milibares' }),
    rengU('atm', 'atmósfera estándar', 101_325, { plural: 'atmósferas estándar', comun: true, fuente: RENG_NIST, alias: ['atmosfera'] }),
    rengU('mmHg', 'milímetro de mercurio (convencional)', 133.322387415, { plural: 'milímetros de mercurio (convencional)', fuente: `${RENG_NIST}: 13,5951 g/cm³ · 1 mm · gn` }),
    rengU('Torr', 'torr', 101_325 / 760, { fuente: `${RENG_NIST}: atm/760 (exacto)` }),
    rengU('psi', 'libra por pulgada cuadrada', RENG_LBF / 0.0254 ** 2, { plural: 'libras por pulgada cuadrada', fuente: RENG_NIST })
  ]),
  RENG_M('temperatura', 'temperatura', 'T', rengDim({ Θ: 1 }), [
    rengU('K', 'kelvin', 1, { comun: true, fuente: RENG_SI }),
    rengU('°C', 'grado Celsius', 1, { comun: true, desplazamiento: 273.15, fuente: RENG_SI, alias: ['ºC', 'C', 'celsius', 'centigrados'] }),
    rengU('°F', 'grado Fahrenheit', 5 / 9, { desplazamiento: 273.15 - (32 * 5) / 9, fuente: RENG_NIST, alias: ['ºF', 'F', 'fahrenheit'] })
  ], { aislada: true }),
  RENG_M('dif_temperatura', 'diferencia de temperatura', 'ΔT', rengDim({ Θ: 1 }), [
    rengU('ΔK', 'kelvin (diferencia)', 1, { plural: 'kelvins (diferencia)', comun: true, fuente: RENG_SI }),
    rengU('Δ°C', 'grado Celsius (diferencia)', 1, { plural: 'grados Celsius (diferencia)', comun: true, fuente: RENG_SI }),
    rengU('Δ°F', 'grado Fahrenheit (diferencia)', 5 / 9, { plural: 'grados Fahrenheit (diferencia)', fuente: RENG_NIST })
  ], { aislada: true, sinonimos: ['incremento de temperatura', 'salto térmico'] }),
  RENG_M('cantidad', 'cantidad de sustancia', 'n', rengDim({ N: 1 }), [
    rengU('mol', 'mol', 1, { comun: true, fuente: RENG_SI, plural: 'moles' }),
    rengU('mmol', 'milimol', 1e-3, { plural: 'milimoles' }),
    rengU('kmol', 'kilomol', 1e3, { plural: 'kilomoles' })
  ], { sinonimos: ['moles'] }),
  RENG_M('angulo', 'ángulo', 'θ', rengDim({ A: 1 }), [
    rengU('rad', 'radián', 1, { comun: true, fuente: RENG_SI }),
    rengU('°', 'grado', Math.PI / 180, { comun: true, fuente: RENG_ACEPTADA, exacto: false, alias: ['º', 'deg', 'grado sexagesimal'] }),
    rengU('vueltas', 'vuelta', 2 * Math.PI, { exacto: false, fuente: '1 vuelta = 2π rad (exacto por definición)', alias: ['rev', 'revolucion', 'revoluciones'] }),
    rengU('′', 'minuto de arco', Math.PI / 10_800, { exacto: false, fuente: RENG_ACEPTADA, alias: ["'", 'arcmin'] }),
    rengU('″', 'segundo de arco', Math.PI / 648_000, { exacto: false, fuente: RENG_ACEPTADA, alias: ['"', 'arcsec'] })
  ]),
  RENG_M('vangular', 'velocidad angular', 'ω', rengDim({ T: -1, A: 1 }), [
    rengU('rad/s', 'radián por segundo', 1, { comun: true, fuente: RENG_SI, plural: 'radianes por segundo' }),
    rengU('°/s', 'grado por segundo', Math.PI / 180, { comun: true, exacto: false, fuente: RENG_ACEPTADA }),
    rengU('rpm', 'revolución por minuto', (2 * Math.PI) / 60, { plural: 'revoluciones por minuto', comun: true, exacto: false, fuente: '2π rad / 60 s', alias: ['rev/min', 'r/min'] }),
    rengU('rev/s', 'revolución por segundo', 2 * Math.PI, { plural: 'revoluciones por segundo', exacto: false, fuente: '2π rad / s' })
  ], { sinonimos: ['frecuencia angular', 'giro'] }),
  RENG_M('aangular', 'aceleración angular', 'α', rengDim({ T: -2, A: 1 }), [
    rengU('rad/s²', 'radián por segundo al cuadrado', 1, { comun: true, fuente: RENG_SI, plural: 'radianes por segundo al cuadrado' }),
    rengU('°/s²', 'grado por segundo al cuadrado', Math.PI / 180, { plural: 'grados por segundo al cuadrado', exacto: false, fuente: RENG_ACEPTADA })
  ]),
  RENG_M('frecuencia', 'frecuencia', 'f', rengDim({ T: -1 }), [
    rengU('Hz', 'hercio', 1, { comun: true, fuente: RENG_SI, alias: ['hertz', 'hercios', 'ciclos por segundo'] }),
    rengU('kHz', 'kilohercio', 1e3, { comun: true }),
    rengU('MHz', 'megahercio', 1e6),
    rengU('GHz', 'gigahercio', 1e9),
    rengU('THz', 'terahercio', 1e12),
    rengU('×10¹⁴ Hz', 'cien billones de hercios (10¹⁴ Hz)', 1e14, { plural: 'cien billones de hercios (10¹⁴ Hz)', alias: ['1e14 Hz', '10^14 Hz'] }),
    rengU('rpm', 'revolución por minuto (ciclos)', 1 / 60, { plural: 'revoluciones por minuto (ciclos)', fuente: '1 ciclo / 60 s (exacto)', alias: ['rev/min'] })
  ]),
  RENG_M('tasa', 'tasa (constante de amortiguamiento)', 'γ', rengDim({ T: -1 }), [
    rengU('1/s', 'por segundo', 1, { plural: 'por segundo', comun: true, fuente: RENG_SI, alias: ['s^-1', 's-1'] }),
    rengU('1/min', 'por minuto', 1 / 60, { plural: 'por minuto' }),
    rengU('1/h', 'por hora', 1 / 3600, { plural: 'por hora' })
  ], { sinonimos: ['amortiguamiento', 'ritmo', 'tasa de decaimiento'] }),
  RENG_M('area', 'área', 'A', rengDim({ L: 2 }), [
    rengU('m²', 'metro cuadrado', 1, { comun: true, fuente: RENG_SI, plural: 'metros cuadrados' }),
    rengU('cm²', 'centímetro cuadrado', 1e-4, { comun: true, plural: 'centímetros cuadrados' }),
    rengU('mm²', 'milímetro cuadrado', 1e-6, { plural: 'milímetros cuadrados' }),
    rengU('km²', 'kilómetro cuadrado', 1e6, { plural: 'kilómetros cuadrados' }),
    rengU('ha', 'hectárea', 1e4, { fuente: RENG_ACEPTADA }),
    rengU('ft²', 'pie cuadrado', 0.09290304, { plural: 'pies cuadrados', fuente: RENG_NIST })
  ], { sinonimos: ['superficie', 'sección'] }),
  RENG_M('volumen', 'volumen', 'V', rengDim({ L: 3 }), [
    rengU('m³', 'metro cúbico', 1, { comun: true, fuente: RENG_SI, plural: 'metros cúbicos' }),
    rengU('L', 'litro', 1e-3, { comun: true, fuente: RENG_ACEPTADA, alias: ['l', 'litros', 'dm³'] }),
    rengU('mL', 'mililitro', 1e-6, { comun: true, alias: ['ml'] }),
    rengU('cm³', 'centímetro cúbico', 1e-6, { plural: 'centímetros cúbicos', alias: ['cc'] }),
    rengU('gal', 'galón estadounidense', 3.785411784e-3, { plural: 'galones estadounidenses', fuente: RENG_NIST })
  ]),
  RENG_M('densidad', 'densidad', 'ρ', rengDim({ L: -3, M: 1 }), [
    rengU('kg/m³', 'kilogramo por metro cúbico', 1, { comun: true, fuente: RENG_SI }),
    rengU('g/cm³', 'gramo por centímetro cúbico', 1e3, { comun: true, alias: ['g/cc', 'g/mL'] }),
    rengU('g/L', 'gramo por litro', 1),
    rengU('kg/L', 'kilogramo por litro', 1e3)
  ], { sinonimos: ['masa volúmica'] }),
  RENG_M('caudal', 'caudal', 'Q', rengDim({ L: 3, T: -1 }), [
    rengU('m³/s', 'metro cúbico por segundo', 1, { comun: true, fuente: RENG_SI, plural: 'metros cúbicos por segundo' }),
    rengU('L/s', 'litro por segundo', 1e-3, { comun: true }),
    rengU('L/min', 'litro por minuto', 1e-3 / 60),
    rengU('m³/h', 'metro cúbico por hora', 1 / 3600, { plural: 'metros cúbicos por hora' })
  ], { sinonimos: ['flujo volumétrico', 'gasto'] }),
  RENG_M('gasto_masico', 'gasto másico', 'ṁ', rengDim({ M: 1, T: -1 }), [
    rengU('kg/s', 'kilogramo por segundo', 1, { comun: true, fuente: RENG_SI }),
    rengU('g/s', 'gramo por segundo', 1e-3),
    rengU('t/h', 'tonelada por hora', 1000 / 3600)
  ], { sinonimos: ['flujo másico', 'consumo'] }),
  RENG_M('carga', 'carga eléctrica', 'q', rengDim({ T: 1, I: 1 }), [
    rengU('C', 'culombio', 1, { comun: true, fuente: RENG_SI, alias: ['coulomb'] }),
    rengU('mC', 'miliculombio', 1e-3, { comun: true }),
    rengU('µC', 'microculombio', 1e-6, { alias: ['uC'] }),
    rengU('nC', 'nanoculombio', 1e-9),
    rengU('e', 'carga elemental', 1.602176634e-19, { plural: 'cargas elementales', fuente: 'BIPM: e exacta desde 2019' }),
    rengU('A·h', 'amperio hora', 3600, { plural: 'amperios hora', alias: ['Ah'] })
  ]),
  RENG_M('corriente', 'corriente eléctrica', 'I', rengDim({ I: 1 }), [
    rengU('A', 'amperio', 1, { comun: true, fuente: RENG_SI, alias: ['ampere', 'amperios'] }),
    rengU('mA', 'miliamperio', 1e-3, { comun: true }),
    rengU('µA', 'microamperio', 1e-6, { alias: ['uA'] })
  ], { sinonimos: ['intensidad'] }),
  RENG_M('potencial', 'potencial eléctrico', 'V', rengDim({ L: 2, M: 1, T: -3, I: -1 }), [
    rengU('V', 'voltio', 1, { comun: true, fuente: RENG_SI, alias: ['volt', 'volts'] }),
    rengU('mV', 'milivoltio', 1e-3),
    rengU('kV', 'kilovoltio', 1e3)
  ], { sinonimos: ['tensión', 'voltaje', 'diferencia de potencial'] }),
  RENG_M('campo_e', 'campo eléctrico', 'E', rengDim({ L: 1, M: 1, T: -3, I: -1 }), [
    rengU('V/m', 'voltio por metro', 1, { comun: true, fuente: RENG_SI }),
    rengU('kV/m', 'kilovoltio por metro', 1e3),
    rengU('N/C', 'newton por culombio', 1, { plural: 'newtons por culombio', fuente: RENG_SI })
  ]),
  RENG_M('campo_b', 'campo magnético (densidad de flujo)', 'B', rengDim({ M: 1, T: -2, I: -1 }), [
    rengU('T', 'tesla', 1, { comun: true, fuente: RENG_SI }),
    rengU('mT', 'militesla', 1e-3),
    rengU('µT', 'microtesla', 1e-6, { alias: ['uT'] }),
    rengU('G', 'gauss', 1e-4, { fuente: `${RENG_NIST} (unidad CGS; 1 G ≙ 10⁻⁴ T)` })
  ], { sinonimos: ['inducción magnética'] }),
  RENG_M('flujo_b', 'flujo magnético', 'Φ', rengDim({ L: 2, M: 1, T: -2, I: -1 }), [
    rengU('Wb', 'weber', 1, { comun: true, fuente: RENG_SI }),
    rengU('V·s', 'voltio segundo', 1, { plural: 'voltios segundo', fuente: RENG_SI }),
    rengU('mWb', 'miliweber', 1e-3)
  ]),
  RENG_M('resistencia', 'resistencia eléctrica', 'R', rengDim({ L: 2, M: 1, T: -3, I: -2 }), [
    rengU('Ω', 'ohmio', 1, { comun: true, fuente: RENG_SI, alias: ['ohm', 'ohms', 'ohmios'] }),
    rengU('kΩ', 'kiloohmio', 1e3, { comun: true, alias: ['kohm'] }),
    rengU('MΩ', 'megaohmio', 1e6, { alias: ['Mohm'] })
  ], { sinonimos: ['impedancia'] }),
  RENG_M('capacidad', 'capacidad eléctrica', 'C', rengDim({ L: -2, M: -1, T: 4, I: 2 }), [
    rengU('F', 'faradio', 1, { comun: true, fuente: RENG_SI, alias: ['farad'] }),
    rengU('mF', 'milifaradio', 1e-3),
    rengU('µF', 'microfaradio', 1e-6, { comun: true, alias: ['uF'] }),
    rengU('nF', 'nanofaradio', 1e-9),
    rengU('pF', 'picofaradio', 1e-12)
  ], { sinonimos: ['capacitancia'] }),
  RENG_M('inductancia', 'inductancia', 'L', rengDim({ L: 2, M: 1, T: -2, I: -2 }), [
    rengU('H', 'henrio', 1, { comun: true, fuente: RENG_SI, alias: ['henry'] }),
    rengU('mH', 'milihenrio', 1e-3, { comun: true }),
    rengU('µH', 'microhenrio', 1e-6, { alias: ['uH'] })
  ]),
  RENG_M('rigidez', 'constante elástica', 'k', rengDim({ M: 1, T: -2 }), [
    rengU('N/m', 'newton por metro', 1, { plural: 'newtons por metro', comun: true, fuente: RENG_SI }),
    rengU('kN/m', 'kilonewton por metro', 1e3, { plural: 'kilonewtons por metro' }),
    rengU('N/cm', 'newton por centímetro', 100, { plural: 'newtons por centímetro' }),
    rengU('lbf/in', 'libra-fuerza por pulgada', RENG_LBF / 0.0254, { plural: 'libras-fuerza por pulgada', fuente: RENG_NIST })
  ], { sinonimos: ['rigidez', 'constante del muelle', 'constante del resorte'] }),
  RENG_M('amortiguamiento', 'coeficiente de amortiguamiento', 'c', rengDim({ M: 1, T: -1 }), [
    rengU('N·s/m', 'newton segundo por metro', 1, { plural: 'newtons segundo por metro', comun: true, fuente: RENG_SI }),
    rengU('kg/s', 'kilogramo por segundo', 1, { fuente: RENG_SI })
  ], { sinonimos: ['rozamiento viscoso'] }),
  RENG_M('momento_fuerza', 'momento de fuerza (torque)', 'τ', rengDim({ L: 2, M: 1, T: -2 }), [
    rengU('N·m', 'newton metro', 1, { plural: 'newtons metro', comun: true, fuente: RENG_SI, alias: ['Nm'] }),
    rengU('kN·m', 'kilonewton metro', 1e3, { plural: 'kilonewtons metro' }),
    rengU('lbf·ft', 'libra-fuerza pie', RENG_LBF * 0.3048, { plural: 'libras-fuerza pie', fuente: RENG_NIST })
  ], { sinonimos: ['par', 'torque', 'momento'] }),
  RENG_M('amort_angular', 'rozamiento angular', 'b', rengDim({ L: 2, M: 1, T: -1 }), [
    rengU('N·m·s', 'newton metro segundo', 1, { plural: 'newtons metro segundo', comun: true, fuente: `${RENG_SI} (por radián)` })
  ]),
  RENG_M('inercia', 'momento de inercia', 'I', rengDim({ L: 2, M: 1 }), [
    rengU('kg·m²', 'kilogramo metro cuadrado', 1, { plural: 'kilogramos metro cuadrado', comun: true, fuente: RENG_SI }),
    rengU('g·cm²', 'gramo centímetro cuadrado', 1e-7, { plural: 'gramos centímetro cuadrado' })
  ]),
  RENG_M('momento_angular', 'momento angular', 'L', rengDim({ L: 2, M: 1, T: -1 }), [
    rengU('kg·m²/s', 'kilogramo metro cuadrado por segundo', 1, { plural: 'kilogramos metro cuadrado por segundo', comun: true, fuente: RENG_SI }),
    rengU('J·s', 'julio segundo', 1, { plural: 'julios segundo', fuente: RENG_SI })
  ]),
  RENG_M('momento_lineal', 'momento lineal (cantidad de movimiento)', 'p', rengDim({ L: 1, M: 1, T: -1 }), [
    rengU('kg·m/s', 'kilogramo metro por segundo', 1, { plural: 'kilogramos metro por segundo', comun: true, fuente: RENG_SI }),
    rengU('N·s', 'newton segundo', 1, { plural: 'newtons segundo', fuente: RENG_SI })
  ], { sinonimos: ['impulso', 'cantidad de movimiento'] }),
  RENG_M('grav_param', 'parámetro gravitacional (GM)', 'GM', rengDim({ L: 3, T: -2 }), [
    rengU('m³/s²', 'metro cúbico por segundo al cuadrado', 1, { plural: 'metros cúbicos por segundo al cuadrado', comun: true, fuente: RENG_SI }),
    rengU('km³/s²', 'kilómetro cúbico por segundo al cuadrado', 1e9, { plural: 'kilómetros cúbicos por segundo al cuadrado' }),
    rengU('UA³/año²', 'unidad astronómica cúbica por año al cuadrado', RENG_AU ** 3 / RENG_ANIO ** 2, { plural: 'unidades astronómicas cúbicas por año al cuadrado', fuente: 'UA (IAU 2012) y año juliano', exacto: false, alias: ['UA³/años²', 'au3/yr2'] })
  ]),
  RENG_M('energia_especifica', 'energía por unidad de masa', 'e', rengDim({ L: 2, T: -2 }), [
    rengU('J/kg', 'julio por kilogramo', 1, { comun: true, fuente: RENG_SI }),
    rengU('kJ/kg', 'kilojulio por kilogramo', 1e3)
  ]),
  RENG_M('calor_especifico', 'calor específico', 'c', rengDim({ L: 2, T: -2, Θ: -1 }), [
    rengU('J/(kg·K)', 'julio por kilogramo y kelvin', 1, { plural: 'julios por kilogramo y kelvin', comun: true, fuente: RENG_SI }),
    rengU('kJ/(kg·K)', 'kilojulio por kilogramo y kelvin', 1e3, { plural: 'kilojulios por kilogramo y kelvin' })
  ]),
  RENG_M('capacidad_molar', 'capacidad calorífica molar', 'C_m', rengDim({ L: 2, M: 1, T: -2, Θ: -1, N: -1 }), [
    rengU('J/(mol·K)', 'julio por mol y kelvin', 1, { plural: 'julios por mol y kelvin', comun: true, fuente: RENG_SI })
  ]),
  RENG_M('entropia', 'entropía', 'S', rengDim({ L: 2, M: 1, T: -2, Θ: -1 }), [rengU('J/K', 'julio por kelvin', 1, { plural: 'julios por kelvin', comun: true, fuente: RENG_SI })]),
  RENG_M('viscosidad', 'viscosidad dinámica', 'μ', rengDim({ L: -1, M: 1, T: -1 }), [
    rengU('Pa·s', 'pascal segundo', 1, { plural: 'pascales segundo', comun: true, fuente: RENG_SI }),
    rengU('mPa·s', 'milipascal segundo', 1e-3, { plural: 'milipascales segundo', comun: true, fuente: RENG_SI }),
    rengU('cP', 'centipoise', 1e-3, { fuente: RENG_NIST })
  ]),
  RENG_M('intensidad', 'intensidad (potencia por área)', 'I', rengDim({ M: 1, T: -3 }), [
    rengU('W/m²', 'vatio por metro cuadrado', 1, { plural: 'vatios por metro cuadrado', comun: true, fuente: RENG_SI })
  ], { sinonimos: ['irradiancia'] }),
  RENG_M('inv_longitud', 'inverso de longitud', '1/l', rengDim({ L: -1 }), [
    rengU('1/m', 'por metro', 1, { plural: 'por metro', comun: true, fuente: RENG_SI, alias: ['m^-1', 'm-1'] }),
    rengU('1/km', 'por kilómetro', 1e-3, { plural: 'por kilómetro' }),
    rengU('1/cm', 'por centímetro', 100, { plural: 'por centímetro' })
  ]),
  RENG_M('potencia_optica', 'potencia óptica (vergencia)', 'P', rengDim({ L: -1 }), [
    rengU('dpt', 'dioptría', 1, { comun: true, fuente: 'Dioptría = 1/m (ISO 80000-3)', alias: ['dioptrías', 'dioptrias', 'D'] })
  ]),
  RENG_M('inv_angulo', 'por unidad de ángulo', '1/θ', rengDim({ A: -1 }), [
    rengU('1/rad', 'por radián', 1, { plural: 'por radián', comun: true, fuente: RENG_SI }),
    rengU('1/°', 'por grado', 180 / Math.PI, { plural: 'por grado', comun: true, exacto: false, fuente: RENG_ACEPTADA })
  ]),
  RENG_M('tsfc', 'consumo específico de empuje', 'TSFC', rengDim({ L: -1, T: 1 }), [
    rengU('kg/(N·s)', 'kilogramo por newton y segundo', 1, { plural: 'kilogramos por newton y segundo', fuente: RENG_SI }),
    rengU('g/(kN·s)', 'gramo por kilonewton y segundo', 1e-6, { plural: 'gramos por kilonewton y segundo', comun: true }),
    rengU('mg/(N·s)', 'miligramo por newton y segundo', 1e-6, { plural: 'miligramos por newton y segundo' }),
    rengU('lb/(lbf·h)', 'libra por libra-fuerza y hora', RENG_LB / (RENG_LBF * 3600), { plural: 'libras por libra-fuerza y hora', fuente: RENG_NIST, exacto: false })
  ], { sinonimos: ['consumo de combustible', 'TSFC'] }),
  RENG_M('adimensional', 'número adimensional', '—', rengDim({}), [
    rengU('', 'sin unidad', 1, { plural: 'sin unidad', comun: true, fuente: RENG_SI, alias: ['1', 'adimensional'] }),
    rengU('×', 'veces', 1, { plural: 'veces', comun: true, fuente: 'Factor (adimensional)', alias: ['x', 'veces'] }),
    rengU('%', 'por ciento', 0.01, { plural: 'por ciento', comun: true, fuente: 'ISO 80000-1: % = 0,01', alias: ['porcentaje', 'pct'] }),
    rengU('‰', 'por mil', 0.001, { plural: 'por mil' })
  ], { aislada: true, sinonimos: ['cociente', 'razón', 'factor'] }),
  RENG_M('rendimiento_cuantico', 'rendimiento cuántico', 'η', rengDim({}), [
    rengU('e⁻/fotón', 'electrón por fotón', 1, { plural: 'electrones por fotón', comun: true, fuente: 'Cociente de cuentas (adimensional)', alias: ['e-/foton', 'electrones por foton'] }),
    rengU('%', 'por ciento', 0.01, { plural: 'por ciento', comun: true, fuente: 'ISO 80000-1: % = 0,01' })
  ], { aislada: true, sinonimos: ['eficiencia cuántica'] }),
  RENG_M('ritmo', 'ritmo de la animación', 'r', rengDim({}), [
    rengU('×', 'segundo simulado por segundo real', 1, { plural: 'segundos simulados por segundo real', comun: true, fuente: 'Cociente de tiempos (adimensional)', alias: ['s/s'] }),
    rengU('min/s', 'minuto simulado por segundo real', 60, { plural: 'minutos simulados por segundo real' }),
    rengU('h/s', 'hora simulada por segundo real', 3600, { plural: 'horas simuladas por segundo real' }),
    rengU('días/s', 'día simulado por segundo real', 86_400, { plural: 'días simulados por segundo real', alias: ['d/s'] }),
    rengU('años/s', 'año simulado por segundo real', RENG_ANIO, { plural: 'años simulados por segundo real', alias: ['año/s'] })
  ], { aislada: true, sinonimos: ['velocidad de la animación', 'escala de tiempo', 'cámara lenta'] }),
  RENG_M('velocidad_visual', 'velocidad en pantalla', 'v_vis', rengDim({}), [
    rengU('u/s', 'unidad de escena por segundo', 1, { plural: 'unidades de escena por segundo', comun: true, fuente: 'Unidad gráfica de la escena 3D (sin equivalencia física)' })
  ], { aislada: true })
]

const RENG_POR_ID = new Map(RENG_MAGNITUDES.map((rengM) => [rengM.id, rengM]))

export function rengMagnitud(rengId: string): RengMagnitud | null {
  return RENG_POR_ID.get(rengId) ?? null
}

export function rengUnidad(rengMagnitudId: string, rengSimbolo: string): RengUnidad | null {
  const rengM = RENG_POR_ID.get(rengMagnitudId)
  if (!rengM) return null
  return rengM.unidades.find((rengX) => rengX.simbolo === rengSimbolo) ?? rengM.unidades.find((rengX) => rengX.alias.includes(rengSimbolo)) ?? null
}

const RENG_PRINCIPAL: Readonly<Record<string, string>> = {
  rpm: 'vangular',
  '×': 'adimensional',
  '%': 'adimensional',
  'kg/s': 'gasto_masico',
  'N·m': 'momento_fuerza',
  'J·s': 'momento_angular',
  'V·s': 'flujo_b'
}

export function rengMagnitudesDeSimbolo(rengSimbolo: string): RengMagnitud[] {
  return RENG_MAGNITUDES.filter((rengM) => rengM.unidades.some((rengX) => rengX.simbolo === rengSimbolo || rengX.alias.includes(rengSimbolo)))
}

export function rengMagnitudDeSimbolo(rengSimbolo: string, rengPista?: string): RengMagnitud | null {
  if (rengPista && rengUnidad(rengPista, rengSimbolo)) return RENG_POR_ID.get(rengPista) ?? null
  const rengP = RENG_PRINCIPAL[rengSimbolo]
  if (rengP) return RENG_POR_ID.get(rengP) ?? null
  const rengMs = rengMagnitudesDeSimbolo(rengSimbolo)
  const rengExacta = rengMs.find((rengM) => rengM.unidades.some((rengX) => rengX.simbolo === rengSimbolo))
  return rengExacta ?? rengMs[0] ?? null
}

export const rengUnidadSI = (rengM: RengMagnitud): RengUnidad => rengM.unidades[0] as RengUnidad
