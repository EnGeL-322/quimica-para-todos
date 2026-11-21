import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import {
  RENG_DIDACTICO_AT, RENG_HC_EVNM_AT, RENG_IONES_AT, RENG_NUCLIDOS_AT, RENG_PARES_ISO_AT, RENG_TOL_AT, RENG_TOL_AT_ENT, RENG_U_G_AT, rengConfigAt, rengEnCapaAt, rengFuentesAt, rengIonAt, rengMediaIsoAt,
  rengNombreAt, rengNuclidoAt, rengSimboloDeZAt, rengSupAt, rengZAt
} from './b02-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(2)
const tx = rengTx
const dE = (rengA: number, rengB: number): number => 13.6 * (1 / (rengB * rengB) - 1 / (rengA * rengA))
const RENG_GASES: Readonly<Record<number, string>> = { 2: 'helio', 10: 'neón', 18: 'argón', 36: 'kriptón', 54: 'xenón' }
export const RENG_IONES_GAS_NOBLE_AT = RENG_IONES_AT.filter(([rengS, , rengQ]) => RENG_GASES[rengZAt(rengS) - rengQ] !== undefined)
export const RENG_Z_CAPA3_AT: readonly number[] = [11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 25, 26, 27, 28]

export const RENG_INTEGRADORES_B02: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b2-i1', subtema: RENG_GRUPO, subtemas: ['n1-b2-s8', 'n1-b2-s14'],
    titulo: 'Neutrones y electrones de un ion', dificultad: 'basica',
    objetivo: 'Combinar el cálculo de neutrones de un núclido con el de electrones de un ion para sumar ambas partículas.', unidad: '', tolerancia: RENG_TOL_AT_ENT,
    fuentes: rengFuentesAt('2.3', 'el símbolo nuclear y los iones'), idealizado: 'Iones monoatómicos.', metodo: 'escena «atomo»',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_IONES_AT.length) }),
    respuesta: (rengD) => { const [, a, q] = RENG_IONES_AT[rengD.i]!; return a - q },
    errores: (rengD) => { const [, a, q] = RENG_IONES_AT[rengD.i]!; return [
      ['sin-carga', 'Sin la carga', a, 'Olvidaste la carga: el ion no tiene Z electrones.'],
      ['signo', 'Signo al revés', a + q, 'Un catión tiene menos electrones que protones y un anión, más.']
    ] },
    enunciado: (rengD) => { const [s, a, q] = RENG_IONES_AT[rengD.i]!; return `Considera el ion ${rengSupAt(a)}${rengIonAt(s, q)} (Z = ${rengZAt(s)}).` },
    pregunta: () => '¿Cuántos neutrones y electrones tiene en total?',
    datos: (rengD) => { const [s, a, q] = RENG_IONES_AT[rengD.i]!; return [['A', String(a)], ['Z', String(rengZAt(s))], ['Carga', q > 0 ? `+${q}` : String(q)]] },
    pasos: (rengD, rengR) => { const [s, a, q] = RENG_IONES_AT[rengD.i]!; const z = rengZAt(s); return [`Neutrones: ${a} − ${z} = ${a - z} (subtema 8).`, `Electrones: ${z} − (${q}) = ${z - q} (subtema 14); total ${tx(rengR)}.`] },
    pistas: ['Calcula N = A − Z.', 'Calcula los electrones con la carga.', 'Suma las dos cantidades.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b2-i2', subtema: RENG_GRUPO, subtemas: ['n1-b2-s15', 'n1-b2-s16'],
    titulo: 'Masa de un átomo medio', dificultad: 'basica',
    objetivo: 'Calcular la masa atómica media a partir de los isótopos y pasarla a gramos con la unidad de masa atómica.', unidad: '', tolerancia: RENG_TOL_AT,
    fuentes: rengFuentesAt('2.3', 'las masas atómicas', { isotopos: true, particulas: true }), idealizado: 'Abundancias naturales típicas.', metodo: 'masa media por otra vía y conversión de u', sinVerificar: [RENG_DIDACTICO_AT],
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_PARES_ISO_AT.length) }),
    respuesta: (rengD) => rengMediaIsoAt(RENG_PARES_ISO_AT[rengD.i]!) * 0.166054,
    errores: (rengD) => { const p = RENG_PARES_ISO_AT[rengD.i]!; return [
      ['suma', 'Suma de masas', (p.m1 + p.m2) * 0.166054, 'Sumaste las masas de los isótopos sin ponderar por su abundancia.'],
      ['sin-convertir', 'En u', rengMediaIsoAt(p), 'Ese valor es la masa en u; multiplícala por 1,66054·10⁻²⁴ g.']
    ] },
    enunciado: (rengD) => { const p = RENG_PARES_ISO_AT[rengD.i]!; return `El ${rengNombreAt(p.s)} natural tiene un ${tx(p.x1 * 100, 5)} % de ${rengNuclidoAt(p.s, p.a1)} (${tx(p.m1, 7)} u) y el resto de ${rengNuclidoAt(p.s, p.a2)} (${tx(p.m2, 7)} u).` },
    pregunta: () => '¿Cuánto pesa en promedio uno de sus átomos, en múltiplos de 10⁻²³ g?',
    datos: (rengD) => { const p = RENG_PARES_ISO_AT[rengD.i]!; return [['Isótopos', `${tx(p.m1, 7)} u y ${tx(p.m2, 7)} u`], ['Abundancia del ligero', `${tx(p.x1 * 100, 5)} %`], ['1 u', '1,66054·10⁻²⁴ g']] },
    pasos: (rengD, rengR) => { const p = RENG_PARES_ISO_AT[rengD.i]!; return [`M = ${tx(rengMediaIsoAt(p), 6)} u (subtema 15).`, `m = M × 1,66054·10⁻²⁴ g = ${tx(rengR)}·10⁻²³ g (subtema 16).`] },
    pistas: ['Calcula la media ponderada.', 'Pasa las u a gramos.', 'Expresa en 10⁻²³ g.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b2-i3', subtema: RENG_GRUPO, subtemas: ['n1-b2-s5', 'n1-b2-s17'],
    titulo: 'Frecuencia de una línea del hidrógeno', dificultad: 'intermedia',
    objetivo: 'Calcular la energía de un salto de Bohr y convertirla en la frecuencia del fotón emitido.', unidad: 'THz', tolerancia: RENG_TOL_AT,
    fuentes: rengFuentesAt('6.2', 'el modelo de Bohr', { particulas: true }), idealizado: 'Hidrógeno de Bohr.', metodo: 'escena «espectro-hidrogeno»', sinVerificar: [RENG_DIDACTICO_AT],
    parametros: (rengRng) => ({ a: rengEntreN1(rengRng, 2, 8, 1), b: rengEntreN1(rengRng, 1, 3, 1) }),
    valida: (rengD) => rengD.b < rengD.a,
    respuesta: (rengD) => (dE(rengD.a, rengD.b) * 1.602176634e-19) / 6.62607015e-34 / 1e12,
    errores: (rengD) => [
      ['lambda', 'La longitud de onda', RENG_HC_EVNM_AT / dE(rengD.a, rengD.b), 'Ese valor es la longitud de onda en nm; la pregunta pide la frecuencia ν = E/h.'],
      ['energia', 'La energía', dE(rengD.a, rengD.b), 'Ese valor es la energía en eV; divídela entre h para obtener la frecuencia.']
    ],
    enunciado: (rengD) => `El electrón de un átomo de hidrógeno baja del nivel ${rengD.a} al nivel ${rengD.b}.`,
    pregunta: () => '¿Qué frecuencia tiene el fotón emitido, en THz?',
    datos: (rengD) => [['Salto', `${rengD.a} → ${rengD.b}`], ['Constantes', 'Eₙ = −13,6/n² eV; 1 eV = 1,602·10⁻¹⁹ J; h = 6,626·10⁻³⁴ J·s']],
    pasos: (rengD, rengR) => [`ΔE = ${tx(dE(rengD.a, rengD.b), 4)} eV (subtema 5).`, `ν = ΔE/h = ${tx(rengR)} THz (subtema 17).`],
    pistas: ['Calcula ΔE con Bohr.', 'Pasa la energía a julios.', 'Divide entre h.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b2-i4', subtema: RENG_GRUPO, subtemas: ['n1-b2-s22', 'n1-b2-s24'],
    titulo: 'Huecos de la tercera capa', dificultad: 'intermedia',
    objetivo: 'Combinar la configuración electrónica con la capacidad 2n² de una capa para contar los huecos que quedan.', unidad: '', tolerancia: RENG_TOL_AT_ENT,
    fuentes: rengFuentesAt('6.4', 'la configuración electrónica'), idealizado: 'Estado fundamental según Aufbau.', metodo: 'ocupación de la tabla de la app',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_Z_CAPA3_AT.length) }),
    respuesta: (rengD) => 18 - rengEnCapaAt(RENG_Z_CAPA3_AT[rengD.i]!, 3),
    errores: (rengD) => { const z = RENG_Z_CAPA3_AT[rengD.i]!; return [
      ['electrones', 'Los electrones', rengEnCapaAt(z, 3), 'Esos son los electrones de la capa; se piden los huecos que faltan hasta 2n².'],
      ['sin-d', 'Capacidad sin el 3d', 8 - rengEnCapaAt(z, 3), 'Tomaste como capacidad 8; la capa n = 3 admite 2·3² = 18 electrones (incluye el 3d).']
    ] },
    enunciado: (rengD) => { const z = RENG_Z_CAPA3_AT[rengD.i]!; return `Escribe la configuración del ${rengNombreAt(rengSimboloDeZAt(z))} (Z = ${z}).` },
    pregunta: () => '¿Cuántos electrones más cabrían en su capa n = 3?',
    datos: (rengD) => [['Z', String(RENG_Z_CAPA3_AT[rengD.i]!)], ['Capa', 'n = 3']],
    pasos: (rengD, rengR) => { const z = RENG_Z_CAPA3_AT[rengD.i]!; return [`Configuración: ${rengConfigAt(z)} (subtema 24).`, `Capacidad 2·3² = 18 (subtema 22); faltan ${tx(rengR)}.`] },
    pistas: ['Escribe la configuración.', 'Suma los electrones de la capa 3.', 'Resta de 2n² = 18.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b2-i5', subtema: RENG_GRUPO, subtemas: ['n1-b2-s7', 'n1-b2-s10', 'n1-b2-s16'],
    titulo: 'Neutrones en una masa de núclido', dificultad: 'avanzada',
    objetivo: 'Encadenar la masa de un átomo en gramos, el número de átomos y sus neutrones para contar neutrones en una muestra.', unidad: '', tolerancia: RENG_TOL_AT,
    fuentes: rengFuentesAt('2.3', 'las partículas del átomo', { particulas: true }), idealizado: 'Masa del átomo ≈ A u; muestra de un solo núclido.', metodo: 'conversión con la unidad «u» del catálogo', sinVerificar: [RENG_DIDACTICO_AT],
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_NUCLIDOS_AT.length), x: rengEntreN1(rengRng, 1, 50, 1) }),
    respuesta: (rengD) => { const [s, a] = RENG_NUCLIDOS_AT[rengD.i]!; return ((rengD.x * 1e-3) / (a * RENG_U_G_AT)) * (a - rengZAt(s)) / 1e20 },
    errores: (rengD) => { const [s, a] = RENG_NUCLIDOS_AT[rengD.i]!; const n = (rengD.x * 1e-3) / (a * RENG_U_G_AT) / 1e20; return [
      ['protones', 'Los protones', n * rengZAt(s), 'Multiplicaste por Z; los neutrones de cada átomo son A − Z.'],
      ['nucleones', 'Los nucleones', n * a, 'Multiplicaste por A, que cuenta protones y neutrones juntos.']
    ] },
    enunciado: (rengD) => { const [s, a] = RENG_NUCLIDOS_AT[rengD.i]!; return `Una muestra contiene ${rengD.x} mg de ${rengNombreAt(s)}-${a} puro. Toma la masa de cada átomo como ${a} u (1 u = 1,66054·10⁻²⁴ g).` },
    pregunta: () => '¿Cuántos neutrones contiene, en múltiplos de 10²⁰?',
    datos: (rengD) => { const [s, a] = RENG_NUCLIDOS_AT[rengD.i]!; return [['Masa', `${rengD.x} mg`], ['Núclido', `${rengNuclidoAt(s, a)}, Z = ${rengZAt(s)}`]] },
    pasos: (rengD, rengR) => { const [s, a] = RENG_NUCLIDOS_AT[rengD.i]!; return [`Átomos = ${rengD.x}·10⁻³ g / (${a} × 1,66054·10⁻²⁴ g) (subtema 16).`, `Cada átomo tiene ${a - rengZAt(s)} neutrones (subtemas 7 y 10): ${tx(rengR)}·10²⁰.`] },
    pistas: ['Calcula la masa de un átomo.', 'Divide para obtener los átomos.', 'Multiplica por los neutrones.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b2-i6', subtema: RENG_GRUPO, subtemas: ['n1-b2-s9', 'n1-b2-s14', 'n1-b2-s25'],
    titulo: 'Ion isoelectrónico con un gas noble', dificultad: 'avanzada',
    objetivo: 'Deducir el elemento de un ion a partir del gas noble con el que comparte electrones y calcular sus neutrones.', unidad: '', tolerancia: RENG_TOL_AT_ENT,
    fuentes: rengFuentesAt('2.3', 'los iones'), idealizado: 'Iones monoatómicos con octeto.', metodo: 'escena «atomo» (búsqueda de Z)',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_IONES_GAS_NOBLE_AT.length) }),
    respuesta: (rengD) => { const [s, a] = RENG_IONES_GAS_NOBLE_AT[rengD.i]!; return a - rengZAt(s) },
    errores: (rengD) => { const [s, a, q] = RENG_IONES_GAS_NOBLE_AT[rengD.i]!; const g = rengZAt(s) - q; return [
      ['signo', 'Signo al revés', a - (g - q), 'Signo al revés: un catión tiene más protones que electrones, así que Z = electrones + carga.'],
      ['gas', 'Z del gas noble', a - g, 'Usaste el Z del gas noble; el ion tiene otro número de protones.']
    ] },
    enunciado: (rengD) => { const [s, a, q] = RENG_IONES_GAS_NOBLE_AT[rengD.i]!; return `Un ion de carga ${q > 0 ? `+${q}` : q} tiene los mismos electrones que el ${RENG_GASES[rengZAt(s) - q]} y ${a} nucleones.` },
    pregunta: () => '¿Cuántos neutrones tiene?',
    datos: (rengD) => { const [s, a, q] = RENG_IONES_GAS_NOBLE_AT[rengD.i]!; return [['Electrones', `${rengZAt(s) - q} (como el ${RENG_GASES[rengZAt(s) - q]})`], ['Carga', q > 0 ? `+${q}` : String(q)], ['A', String(a)]] },
    pasos: (rengD, rengR) => { const [s, a, q] = RENG_IONES_GAS_NOBLE_AT[rengD.i]!; const z = rengZAt(s); return [`Z = ${z - q} + (${q}) = ${z}: es el ${rengNombreAt(s)} (subtemas 9, 14 y 25).`, `N = ${a} − ${z} = ${tx(rengR)}.`] },
    pistas: ['Cuenta los electrones del gas noble.', 'Suma la carga para obtener Z.', 'Resta Z del número másico.']
  })
]
