import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_ANGULO_VSEPR } from '../escenas-n1/modelos/geometria-vsepr'
import { rengEntreN1, rengIndice } from './aleatorio'
import { rengCargaAt } from './b02-comun'
import {
  RENG_CENTRALES_HASTA_4_EN, RENG_ENLACES_EN, RENG_ESPECIES_LEWIS_EN, RENG_TOL_EN, RENG_TOL_EN_ENT, RENG_VSEPR_CON_PARES_EN, rengChiEn, rengDeltaChiEn, rengFuentesEn, rengNombreEn, rengParesCentralEn, rengParesOctetoEn, rengValEn,
  rengValenciaTotalEn
} from './b04-comun'
import { RENG_HIBRIDOS_C_EN } from './b04-s09-s16'
import { rengTxtNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(4)
const tx = rengTx
const T = rengTxtNo
const rad = (rengG: number): number => (rengG * Math.PI) / 180
const suma = (rengL: readonly number[]): number => rengL.reduce((rengA, rengB) => rengA + rengB, 0)
export const RENG_CARGAS_MEDIAS_EN: ReadonlyArray<readonly [string, number, number]> = [
  ['los oxígenos del ion nitrato, NO₃⁻', -2, 3], ['los oxígenos del ion carbonato, CO₃²⁻', -2, 3], ['los oxígenos terminales del ozono, O₃', -1, 2], ['los oxígenos del ion nitrito, NO₂⁻', -1, 2], ['los oxígenos del ion formiato, HCOO⁻', -1, 2],
  ['los oxígenos del ion acetato, CH₃COO⁻', -1, 2], ['los oxígenos del ion perclorato, ClO₄⁻, con tres enlaces dobles', -1, 4], ['los oxígenos del ion fosfato, PO₄³⁻, con un enlace doble', -3, 4],
  ['los oxígenos del ion sulfato, SO₄²⁻, con dos enlaces dobles', -2, 4], ['los oxígenos del ion clorato, ClO₃⁻, con dos enlaces dobles', -1, 3], ['los oxígenos del ion oxalato, C₂O₄²⁻', -2, 4],
  ['los oxígenos sin hidrógeno del ion hidrogenocarbonato, HCO₃⁻', -1, 2], ['los oxígenos sin hidrógeno del ion hidrogenosulfato, HSO₄⁻, con dos enlaces dobles', -1, 3], ['los oxígenos sin hidrógeno del ion hidrogenofosfato, HPO₄²⁻, con un enlace doble', -2, 3],
  ['los oxígenos del ion sulfito, SO₃²⁻, con un enlace doble', -2, 3], ['los oxígenos del ion permanganato, MnO₄⁻, con tres enlaces dobles', -1, 4]
]
export const RENG_ANGULARES_VSEPR_EN = RENG_VSEPR_CON_PARES_EN.filter(([, rengX]) => rengX === 2)

export const RENG_INTEGRADORES_B04: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b4-i1', subtema: RENG_GRUPO, subtemas: ['n1-b4-s1', 'n1-b4-s3'],
    titulo: 'Pares libres a partir de la fórmula', dificultad: 'basica',
    objetivo: 'Encadenar el recuento de electrones de valencia y la regla del octeto para obtener los pares libres de una especie.', unidad: '', tolerancia: RENG_TOL_EN_ENT,
    fuentes: rengFuentesEn('7.3', 'las estructuras de Lewis', { lewis: true }), idealizado: 'Especies que cumplen el octeto.', metodo: 'estructura de Lewis conocida de la especie',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_ESPECIES_LEWIS_EN.length) }),
    respuesta: (rengD) => { const [f, c] = RENG_ESPECIES_LEWIS_EN[rengD.i]!; return (rengValenciaTotalEn(f, c) - 2 * rengParesOctetoEn(f, c)) / 2 },
    errores: (rengD) => { const [f, c] = RENG_ESPECIES_LEWIS_EN[rengD.i]!; return [
      ['enlazantes', 'Los pares enlazantes', rengParesOctetoEn(f, c), 'Esos son los pares enlazantes; los libres son los que quedan tras colocar los enlaces.'],
      ['todos', 'Todos los pares', rengValenciaTotalEn(f, c) / 2, 'Contaste todos los pares de valencia; resta los enlazantes.']
    ] },
    enunciado: (rengD) => { const [f, c] = RENG_ESPECIES_LEWIS_EN[rengD.i]!; return `Dibuja la estructura de Lewis de ${T(f)}${rengCargaAt(c)}, en la que todos los átomos completan su capa.` },
    pregunta: () => '¿Cuántos pares libres tiene la estructura en total?',
    datos: (rengD) => { const [f, c] = RENG_ESPECIES_LEWIS_EN[rengD.i]!; return [['Especie', `${T(f)}${rengCargaAt(c)}`], ['Regla', '8 electrones por átomo (2 para el hidrógeno)']] },
    pasos: (rengD, rengR) => { const [f, c] = RENG_ESPECIES_LEWIS_EN[rengD.i]!; return [`Electrones de valencia: ${rengValenciaTotalEn(f, c)} (subtema 1); pares enlazantes que exige el octeto: ${rengParesOctetoEn(f, c)}.`, `Pares libres: (${rengValenciaTotalEn(f, c)} − 2 × ${rengParesOctetoEn(f, c)})/2 = ${tx(rengR)} (subtema 3).`] },
    pistas: ['Cuenta los electrones de valencia.', 'Halla los pares enlazantes necesarios.', 'Reparte el resto en pares libres.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b4-i2', subtema: RENG_GRUPO, subtemas: ['n1-b4-s6', 'n1-b4-s10'],
    titulo: 'Carácter iónico de un enlace', dificultad: 'basica',
    objetivo: 'Pasar de la diferencia de electronegatividad al porcentaje de carácter iónico para situar un enlace entre covalente e iónico.', unidad: '%', tolerancia: RENG_TOL_EN,
    fuentes: rengFuentesEn('7.2', 'la polaridad de los enlaces', { en: true }), idealizado: 'Relación empírica de Pauling.', metodo: 'escena «polaridad-enlace»', sinVerificar: ['La relación de Pauling % iónico = 100·(1 − e^(−Δχ²/4)) es una fórmula empírica recordada.'],
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_ENLACES_EN.length) }),
    respuesta: (rengD) => 100 * (1 - Math.exp(-(rengDeltaChiEn(RENG_ENLACES_EN[rengD.i]!) ** 2) / 4)),
    errores: (rengD) => { const d = rengDeltaChiEn(RENG_ENLACES_EN[rengD.i]!); return [
      ['sin-cuadrado', 'Sin elevar al cuadrado', 100 * (1 - Math.exp(-d / 4)), 'Falta elevar la diferencia al cuadrado dentro de la exponencial.'],
      ['covalente', 'El carácter covalente', 100 * Math.exp(-(d * d) / 4), 'Ese es el porcentaje de carácter covalente; el iónico es lo que falta hasta cien.']
    ] },
    enunciado: (rengD) => { const [a, b] = RENG_ENLACES_EN[rengD.i]!; return `En el enlace ${a}–${b}, las electronegatividades de Pauling son ${tx(rengChiEn(a))} y ${tx(rengChiEn(b))}. El carácter iónico se estima con % = 100·(1 − e^(−Δχ²/4)).` },
    pregunta: () => '¿Qué porcentaje de carácter iónico tiene el enlace?',
    datos: (rengD) => { const [a, b] = RENG_ENLACES_EN[rengD.i]!; return [[a, tx(rengChiEn(a))], [b, tx(rengChiEn(b))]] },
    pasos: (rengD, rengR) => { const d = rengDeltaChiEn(RENG_ENLACES_EN[rengD.i]!); return [`Δχ = ${tx(d)} (subtema 10).`, `% iónico = ${tx(rengR)} %: ${d > 1.7 ? 'enlace predominantemente iónico' : 'enlace covalente'} (subtema 6).`] },
    pistas: ['Calcula la diferencia Δχ.', 'Elévala al cuadrado y divide entre 4.', 'Aplica la exponencial y resta de uno.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b4-i3', subtema: RENG_GRUPO, subtemas: ['n1-b4-s4', 'n1-b4-s5'],
    titulo: 'Carga formal media por resonancia', dificultad: 'intermedia',
    objetivo: 'Repartir por resonancia la carga formal entre átomos equivalentes de una especie.', unidad: '', tolerancia: RENG_TOL_EN,
    fuentes: rengFuentesEn('7.4', 'las cargas formales y la resonancia', { lewis: true }), idealizado: 'Estructuras resonantes equivalentes.', metodo: 'suma de las cargas de una estructura repartida entre las posiciones',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_CARGAS_MEDIAS_EN.length) }),
    respuesta: (rengD) => { const [, q, n] = RENG_CARGAS_MEDIAS_EN[rengD.i]!; return q / n },
    errores: (rengD) => { const [, q, n] = RENG_CARGAS_MEDIAS_EN[rengD.i]!; return [
      ['sin-repartir', 'Sin repartir', q, 'Esa es la carga formal total de esos átomos; la resonancia la reparte entre todos.'],
      ['inverso', 'Cociente invertido', n / q, 'Dividiste al revés: es la carga total entre el número de átomos.']
    ] },
    enunciado: (rengD) => { const [t, q, n] = RENG_CARGAS_MEDIAS_EN[rengD.i]!; return `En cada estructura resonante, ${t} suman una carga formal de ${q}; hay ${n} átomos equivalentes.` },
    pregunta: () => '¿Qué carga formal media corresponde a cada uno de esos átomos (con signo)?',
    datos: (rengD) => { const [, q, n] = RENG_CARGAS_MEDIAS_EN[rengD.i]!; return [['Carga formal total', String(q)], ['Átomos equivalentes', String(n)]] },
    pasos: (rengD, rengR) => { const [, q, n] = RENG_CARGAS_MEDIAS_EN[rengD.i]!; return [`En una estructura, las cargas formales (subtema 4) suman ${q}.`, `Por resonancia (subtema 5) se reparten: ${q}/${n} = ${tx(rengR)}.`] },
    pistas: ['Suma las cargas de una estructura.', 'Cuenta los átomos equivalentes.', 'Reparte la carga entre ellos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b4-i4', subtema: RENG_GRUPO, subtemas: ['n1-b4-s11', 'n1-b4-s13'],
    titulo: 'Momento dipolar de una molécula angular', dificultad: 'intermedia',
    objetivo: 'Predecir con la teoría VSEPR el ángulo de una molécula angular y sumar como vectores sus dipolos de enlace.', unidad: 'D', tolerancia: RENG_TOL_EN,
    fuentes: rengFuentesEn('7.6', 'la estructura molecular y la polaridad', { lewis: true }), idealizado: 'Ángulo ideal y dipolos de enlace iguales, sin contribución de los pares libres.', metodo: 'escena «geometria-vsepr» y suma de componentes',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_ANGULARES_VSEPR_EN.length), x: rengEntreN1(rengRng, 0.5, 2, 0.05) }),
    respuesta: (rengD) => { const [, x, e] = RENG_ANGULARES_VSEPR_EN[rengD.i]!; return 2 * rengD.x * Math.cos(rad(RENG_ANGULO_VSEPR[x + e]! / 2)) },
    errores: (rengD) => { const [, x, e] = RENG_ANGULARES_VSEPR_EN[rengD.i]!; return [
      ['suma-escalar', 'Suma sin dirección', 2 * rengD.x, 'Sumaste los dos momentos como números; forman un ángulo y se suman como vectores.'],
      ['seno', 'Con el seno', 2 * rengD.x * Math.sin(rad(RENG_ANGULO_VSEPR[x + e]! / 2)), 'Usaste el seno; la componente sobre la bisectriz va con el coseno de la mitad del ángulo.']
    ] },
    enunciado: (rengD) => { const [f, x, e] = RENG_ANGULARES_VSEPR_EN[rengD.i]!; return `En ${T(f)}, el átomo central tiene ${x} átomos unidos y ${e} ${e === 1 ? 'par libre' : 'pares libres'}. Cada enlace tiene un momento dipolar de ${tx(rengD.x)} D.` },
    pregunta: () => '¿Qué momento dipolar resultante se predice con el ángulo ideal, en D?',
    datos: (rengD) => { const [, x, e] = RENG_ANGULARES_VSEPR_EN[rengD.i]!; return [['Dominios', String(x + e)], ['Momento de cada enlace', `${tx(rengD.x)} D`]] },
    pasos: (rengD, rengR) => { const [, x, e] = RENG_ANGULARES_VSEPR_EN[rengD.i]!; const t = RENG_ANGULO_VSEPR[x + e]!; return [`${x + e} dominios: ángulo ideal de ${tx(t, 4)}° (subtema 13).`, `μ = 2 × ${tx(rengD.x)} × cos(${tx(t / 2, 4)}°) = ${tx(rengR)} D (subtema 11).`] },
    pistas: ['Cuenta los dominios y halla el ángulo.', 'Proyecta cada dipolo sobre la bisectriz.', 'Suma las dos componentes.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b4-i5', subtema: RENG_GRUPO, subtemas: ['n1-b4-s3', 'n1-b4-s12', 'n1-b4-s13'],
    titulo: 'Ángulo de enlace a partir de la fórmula', dificultad: 'avanzada',
    objetivo: 'Deducir desde la fórmula los pares libres del átomo central, sus dominios y el ángulo ideal de enlace.', unidad: '', tolerancia: RENG_TOL_EN,
    fuentes: rengFuentesEn('7.6', 'la teoría VSEPR', { lewis: true }), idealizado: 'Enlaces sencillos y ángulos ideales.', metodo: 'escena «geometria-vsepr»',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_CENTRALES_HASTA_4_EN.length) }),
    respuesta: (rengD) => { const c = RENG_CENTRALES_HASTA_4_EN[rengD.i]!; return RENG_ANGULO_VSEPR[c[2] + rengParesCentralEn(c)]! },
    errores: (rengD) => { const c = RENG_CENTRALES_HASTA_4_EN[rengD.i]!; return [
      ['sin-pares', 'Sin los pares libres', RENG_ANGULO_VSEPR[c[2]]!, 'Olvidaste los pares libres del átomo central: también son dominios.'],
      ['siguiente', 'Un dominio de más', RENG_ANGULO_VSEPR[c[2] + rengParesCentralEn(c) + 1]!, 'Contaste un dominio de más; revisa los pares libres.']
    ] },
    enunciado: (rengD) => { const [f, s, x, q] = RENG_CENTRALES_HASTA_4_EN[rengD.i]!; return `En ${T(f)}${rengCargaAt(q)}, el ${rengNombreEn(s)} central (${rengValEn(s)} electrones de valencia) forma ${x} enlaces sencillos.` },
    pregunta: () => '¿Cuál es el ángulo ideal entre sus dominios electrónicos, en grados?',
    datos: (rengD) => { const [, s, x, q] = RENG_CENTRALES_HASTA_4_EN[rengD.i]!; return [['Electrones de valencia', String(rengValEn(s))], ['Enlaces sencillos', String(x)], ['Carga', q === 0 ? '0' : `${q > 0 ? '+' : '−'}${Math.abs(q)}`]] },
    pasos: (rengD, rengR) => { const c = RENG_CENTRALES_HASTA_4_EN[rengD.i]!; return [`Pares libres: ${rengParesCentralEn(c)} (subtema 3); dominios: ${c[2] + rengParesCentralEn(c)} (subtema 13).`, `Ángulo ideal: ${tx(rengR, 4)}° (subtema 12).`] },
    pistas: ['Calcula los pares libres del central.', 'Suma átomos unidos y pares libres.', 'Asocia los dominios con su ángulo.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b4-i6', subtema: RENG_GRUPO, subtemas: ['n1-b4-s14', 'n1-b4-s15', 'n1-b4-s16'],
    titulo: 'Enlaces π a partir de la hibridación', dificultad: 'avanzada',
    objetivo: 'Deducir los enlaces π de un hidrocarburo a partir de la hibridación de sus carbonos.', unidad: '', tolerancia: RENG_TOL_EN_ENT,
    fuentes: rengFuentesEn('8.3', 'los enlaces múltiples y la hibridación', { lewis: true }), idealizado: 'Cada carbono usa sus orbitales p sin hibridar en enlaces π con otro carbono.', metodo: 'grado de insaturación menos anillos, con el analizador del núcleo',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_HIBRIDOS_C_EN.length) }),
    respuesta: (rengD) => suma(RENG_HIBRIDOS_C_EN[rengD.i]![2].map((n) => 4 - n)) / 2,
    errores: (rengD) => { const d = RENG_HIBRIDOS_C_EN[rengD.i]![2]; return [
      ['sin-dividir', 'Sin dividir entre dos', suma(d.map((n) => 4 - n)), 'Esos son los orbitales p sin hibridar; cada enlace π usa dos, uno de cada carbono.'],
      ['hibridos', 'Los orbitales híbridos', suma(d), 'Contaste los orbitales híbridos, que forman enlaces σ; los π salen de los orbitales p sin hibridar.']
    ] },
    enunciado: (rengD) => { const [n, f, d] = RENG_HIBRIDOS_C_EN[rengD.i]!; return `El ${n}, ${T(f)}, tiene ${d.filter((x) => x === 4).length} carbonos sp³, ${d.filter((x) => x === 3).length} carbonos sp² y ${d.filter((x) => x === 2).length} carbonos sp.` },
    pregunta: () => '¿Cuántos enlaces π tiene la molécula?',
    datos: (rengD) => { const d = RENG_HIBRIDOS_C_EN[rengD.i]![2]; return [['Carbonos sp²', `${d.filter((x) => x === 3).length} (un orbital p libre cada uno)`], ['Carbonos sp', `${d.filter((x) => x === 2).length} (dos orbitales p libres cada uno)`]] },
    pasos: (rengD, rengR) => { const d = RENG_HIBRIDOS_C_EN[rengD.i]![2]; return [`Orbitales p sin hibridar (subtema 14): ${suma(d.map((n) => 4 - n))}.`, `Cada enlace π usa dos (subtema 16): π = ${tx(rengR)}; los híbridos forman los enlaces σ (subtema 15).`] },
    pistas: ['Cuenta los orbitales p libres.', 'sp² deja uno y sp deja dos.', 'Cada enlace π usa dos orbitales p.']
  })
]
