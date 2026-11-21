import { rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengTx } from '../aprender/n1/gases/constantes'
import { rengEntreN1, rengIndice } from './aleatorio'
import { rengAnNo, rengMNo, rengTxtNo } from './b05-comun'
import { RENG_AMIDAS_OR, RENG_ESTERES_OR, RENG_MONOMEROS_OR, RENG_SEMI_OR, RENG_TOL_OR, RENG_TOL_OR_ENT, rengCOr, rengFuentesOr, rengHOr, rengMAguaOr, rengMCo2Or, rengSemiTextoOr, rengTotalOr } from './b12-comun'
import { rengMAcidoEsterOr, rengMAlcoholEsterOr } from './b12-s17-s22'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_GRUPO = rengIdIntegradoresN1(12)
const tx = rengTx
const T = rengTxtNo
const M = rengMNo
const A = rengAnNo
const mAlcano = (rengN: number): number => rengN * A('C') + (2 * rengN + 2) * A('H')
export const RENG_AMIDAS_DE_AMINA_OR = RENG_AMIDAS_OR.filter((rengA) => rengA.c > 0)

export const RENG_INTEGRADORES_B12: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b12-i1', subtema: RENG_GRUPO, subtemas: ['n1-b12-s3', 'n1-b12-s7'],
    titulo: 'Masa molar de un alcano ramificado', dificultad: 'basica',
    objetivo: 'Encadenar el recuento de carbonos de una cadena ramificada con la fórmula general de los alcanos para hallar su masa molar.', unidad: 'g/mol', tolerancia: RENG_TOL_OR,
    fuentes: rengFuentesOr('20.1', 'las cadenas ramificadas de los alcanos', { estructuras: true, masas: true }), idealizado: 'Alcano de cadena abierta con ramas metilo.', metodo: 'masa molar del alcano ramificado construido con el motor de estructuras',
    parametros: (rengRng) => ({ x: rengEntreN1(rengRng, 4, 10, 1), y: rengEntreN1(rengRng, 1, 3, 1) }),
    valida: (rengD) => rengD.y! <= rengD.x! - 2,
    respuesta: (rengD) => mAlcano(rengD.x! + rengD.y!),
    errores: (rengD) => [
      ['sin-ramas', 'Sin las ramas', mAlcano(rengD.x!), 'Calculaste la masa del alcano de la cadena principal: faltan los carbonos de las ramas.'],
      ['hidrogenos', 'Los hidrógenos', 2 * (rengD.x! + rengD.y!) + 2, 'Ese es el número de hidrógenos de la molécula; se pide su masa molar.']
    ],
    enunciado: (rengD) => `Un alcano tiene una cadena principal de ${rengD.x} carbonos y ${rengD.y} ${rengD.y === 1 ? 'rama metilo' : 'ramas metilo'}. Masas atómicas: C ${tx(A('C'), 5)} y H ${tx(A('H'), 4)}.`,
    pregunta: () => '¿Cuál es su masa molar, en g/mol?',
    datos: (rengD) => [['Cadena principal', `${rengD.x} carbonos`], ['Ramas metilo', String(rengD.y)], ['Fórmula general', 'CₙH₂ₙ₊₂']],
    pasos: (rengD, rengR) => [`Carbonos en total: ${rengD.x} + ${rengD.y} = ${rengD.x! + rengD.y!} (subtema 3); las ramas no cambian la fórmula general.`, `C${rengD.x! + rengD.y!}H${2 * (rengD.x! + rengD.y!) + 2}: M = ${tx(rengR, 5)} g/mol (subtema 7).`],
    pistas: ['Suma cadena principal y ramas.', 'Un alcano ramificado sigue siendo CₙH₂ₙ₊₂.', 'Calcula la masa con la fórmula.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b12-i2', subtema: RENG_GRUPO, subtemas: ['n1-b12-s1', 'n1-b12-s4'],
    titulo: 'Hidrógeno en un compuesto a partir de su fórmula semidesarrollada', dificultad: 'basica',
    objetivo: 'Pasar de una fórmula semidesarrollada a la molecular y calcular el porcentaje en masa de hidrógeno.', unidad: '%', tolerancia: RENG_TOL_OR,
    fuentes: rengFuentesOr('20.1', 'las fórmulas estructurales y la composición', { estructuras: true, masas: true }), idealizado: 'Compuesto puro.', metodo: 'lectura de la fórmula semidesarrollada con el analizador del núcleo y masas de la molécula',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_SEMI_OR.length) }),
    respuesta: (rengD) => { const [, f] = RENG_SEMI_OR[rengD.i!]!; return (100 * rengHOr(f) * A('H')) / M(f) },
    errores: (rengD) => { const [, f] = RENG_SEMI_OR[rengD.i!]!; return [
      ['atomos', 'Porcentaje en átomos', (100 * rengHOr(f)) / rengTotalOr(f), 'Calculaste el porcentaje de átomos que son hidrógeno; se pide el porcentaje en masa.'],
      ['carbono', 'El carbono', (100 * rengCOr(f) * A('C')) / M(f), 'Ese es el porcentaje de carbono; se pide el de hidrógeno.']
    ] },
    enunciado: (rengD) => `La fórmula semidesarrollada de un compuesto es ${rengSemiTextoOr(RENG_SEMI_OR[rengD.i!]![0])}. Masas atómicas: C ${tx(A('C'), 5)}; H ${tx(A('H'), 4)}; N ${tx(A('N'), 5)}; O ${tx(A('O'), 5)}; Cl ${tx(A('Cl'), 4)}.`,
    pregunta: () => '¿Qué porcentaje de su masa es hidrógeno?',
    datos: (rengD) => [['Fórmula semidesarrollada', rengSemiTextoOr(RENG_SEMI_OR[rengD.i!]![0])], ['Pasos', 'fórmula molecular → masa molar → porcentaje']],
    pasos: (rengD, rengR) => { const [, f] = RENG_SEMI_OR[rengD.i!]!; return [`Fórmula molecular: ${T(f)} (subtema 4), de masa molar ${tx(M(f), 5)} g/mol.`, `% H = 100 × ${rengHOr(f)} × ${tx(A('H'), 4)}/${tx(M(f), 5)} = ${tx(rengR)} % (subtema 1).`] },
    pistas: ['Cuenta los átomos de cada elemento.', 'Calcula la masa molar.', 'Divide la masa de H entre la total.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b12-i3', subtema: RENG_GRUPO, subtemas: ['n1-b12-s12', 'n1-b12-s16', 'n1-b12-s17'],
    titulo: 'Éster a partir del alcohol, con rendimiento', dificultad: 'intermedia',
    objetivo: 'Combinar la esterificación de un alcohol con un ácido carboxílico y el rendimiento de la reacción.', unidad: 'g', tolerancia: RENG_TOL_OR,
    fuentes: rengFuentesOr('20.3', 'la esterificación', { estructuras: true, nombres: true, masas: true }), idealizado: 'Ácido en exceso; el alcohol es el reactivo limitante.', metodo: 'masa molar del éster construido con el motor de estructuras y rendimiento',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_ESTERES_OR.length), x: rengEntreN1(rengRng, 5, 200, 5), y: rengEntreN1(rengRng, 40, 95, 5) }),
    respuesta: (rengD) => { const e = RENG_ESTERES_OR[rengD.i!]!; return ((rengD.x! / rengMAlcoholEsterOr(e)) * M(e.formula) * rengD.y!) / 100 },
    errores: (rengD) => { const e = RENG_ESTERES_OR[rengD.i!]!; return [
      ['sin-rendimiento', 'La masa teórica', (rengD.x! / rengMAlcoholEsterOr(e)) * M(e.formula), 'Esa es la masa teórica: falta aplicar el rendimiento.'],
      ['desde-acido', 'Con la masa molar del ácido', ((rengD.x! / rengMAcidoEsterOr(e)) * M(e.formula) * rengD.y!) / 100, 'Pasaste a moles con la masa molar del ácido; el dato es la masa de alcohol.']
    ] },
    enunciado: (rengD) => { const e = RENG_ESTERES_OR[rengD.i!]!; return `Se hacen reaccionar ${tx(rengD.x!)} g de ${e.alcohol} (${tx(rengMAlcoholEsterOr(e), 5)} g/mol) con ${e.acido} (${tx(rengMAcidoEsterOr(e), 5)} g/mol) en exceso. Se forma ${e.nombre} y agua (${tx(rengMAguaOr(), 5)} g/mol), con un rendimiento del ${rengD.y} %.` },
    pregunta: () => '¿Qué masa de éster se obtiene, en gramos?',
    datos: (rengD) => { const e = RENG_ESTERES_OR[rengD.i!]!; return [['Masa de alcohol', `${tx(rengD.x!)} g`], ['Masa molar del alcohol', `${tx(rengMAlcoholEsterOr(e), 5)} g/mol`], ['Masa molar del ácido', `${tx(rengMAcidoEsterOr(e), 5)} g/mol`], ['Rendimiento', `${rengD.y} %`]] },
    pasos: (rengD, rengR) => { const e = RENG_ESTERES_OR[rengD.i!]!; return [`M(éster) = ${tx(rengMAcidoEsterOr(e), 5)} + ${tx(rengMAlcoholEsterOr(e), 5)} − ${tx(rengMAguaOr(), 5)} = ${tx(M(e.formula), 5)} g/mol (subtemas 16 y 17).`, `n(alcohol) = ${tx(rengD.x! / rengMAlcoholEsterOr(e))} mol (subtema 12); masa real = ${tx(rengD.x! / rengMAlcoholEsterOr(e))} × ${tx(M(e.formula), 5)} × ${rengD.y}/100 = ${tx(rengR)} g.`] },
    pistas: ['Halla la masa molar del éster.', 'El alcohol es el reactivo limitante.', 'Aplica el rendimiento al final.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b12-i4', subtema: RENG_GRUPO, subtemas: ['n1-b12-s16', 'n1-b12-s18', 'n1-b12-s19'],
    titulo: 'Amida a partir de la amina', dificultad: 'intermedia',
    objetivo: 'Combinar un ácido carboxílico y una amina para calcular la masa de amida que se forma.', unidad: 'g', tolerancia: RENG_TOL_OR,
    fuentes: rengFuentesOr('20.4', 'la formación de amidas', { estructuras: true, nombres: true, masas: true }), idealizado: 'Ácido en exceso y condensación completa.', metodo: 'masa molar de la amida construida con el motor de estructuras',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_AMIDAS_DE_AMINA_OR.length), x: rengEntreN1(rengRng, 5, 200, 5) }),
    respuesta: (rengD) => { const a = RENG_AMIDAS_DE_AMINA_OR[rengD.i!]!; return (rengD.x! / M(a.formulaAmina)) * M(a.formula) },
    errores: (rengD) => { const a = RENG_AMIDAS_DE_AMINA_OR[rengD.i!]!; return [
      ['sin-agua', 'Sin restar el agua', (rengD.x! / M(a.formulaAmina)) * (rengMAcidoEsterOr(a) + M(a.formulaAmina)), 'Usaste la suma de ácido y amina como masa de la amida: falta restar el agua.'],
      ['inverso', 'Cociente invertido', (rengD.x! * M(a.formulaAmina)) / M(a.formula), 'Invertiste las masas molares: divide entre la de la amina y multiplica por la de la amida.']
    ] },
    enunciado: (rengD) => { const a = RENG_AMIDAS_DE_AMINA_OR[rengD.i!]!; return `Se hacen reaccionar ${tx(rengD.x!)} g de ${a.amina}, ${T(a.formulaAmina)} (${tx(M(a.formulaAmina), 5)} g/mol), con ${a.acido} (${tx(rengMAcidoEsterOr(a), 5)} g/mol) en exceso. Se forma ${a.nombre} y agua (${tx(rengMAguaOr(), 5)} g/mol); la reacción es completa.` },
    pregunta: () => '¿Qué masa de amida se forma, en gramos?',
    datos: (rengD) => { const a = RENG_AMIDAS_DE_AMINA_OR[rengD.i!]!; return [['Masa de amina', `${tx(rengD.x!)} g`], ['Masa molar de la amina', `${tx(M(a.formulaAmina), 5)} g/mol`], ['Masa molar del ácido', `${tx(rengMAcidoEsterOr(a), 5)} g/mol`]] },
    pasos: (rengD, rengR) => { const a = RENG_AMIDAS_DE_AMINA_OR[rengD.i!]!; return [`M(amida) = ${tx(rengMAcidoEsterOr(a), 5)} + ${tx(M(a.formulaAmina), 5)} − ${tx(rengMAguaOr(), 5)} = ${tx(M(a.formula), 5)} g/mol (subtemas 16 y 19).`, `n(amina) = ${tx(rengD.x! / M(a.formulaAmina))} mol (subtema 18); m = ${tx(rengD.x! / M(a.formulaAmina))} × ${tx(M(a.formula), 5)} = ${tx(rengR)} g.`] },
    pistas: ['Halla la masa molar de la amida.', 'La amina es el reactivo limitante.', 'Multiplica moles por masa molar.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b12-i5', subtema: RENG_GRUPO, subtemas: ['n1-b12-s6', 'n1-b12-s7', 'n1-b12-s21'],
    titulo: 'Identificar un alcano por su combustión', dificultad: 'avanzada',
    objetivo: 'Deducir la fórmula de un alcano a partir de las masas de CO₂ y H₂O que produce su combustión.', unidad: '', tolerancia: RENG_TOL_OR_ENT,
    fuentes: rengFuentesOr('20.1', 'la combustión de los alcanos', { estructuras: true, masas: true }), idealizado: 'Combustión completa de un alcano puro.', metodo: 'búsqueda del alcano, construido con el motor de estructuras, cuya combustión da esas masas',
    parametros: (rengRng) => ({ x: rengEntreN1(rengRng, 1, 10, 1), y: rengEntreN1(rengRng, 0.5, 2, 0.1) }),
    respuesta: (rengD) => rengD.x!,
    errores: (rengD) => [
      ['sin-restar', 'El cociente de moles', rengD.x! / (rengD.x! + 1), 'Dividiste los moles de CO₂ entre los de agua; hay que dividir entre su diferencia.'],
      ['hidrogenos', 'Los hidrógenos', 2 * rengD.x! + 2, 'Ese es el número de hidrógenos del alcano; se piden los carbonos.']
    ],
    enunciado: (rengD) => `Al quemar por completo una muestra de un alcano, CₙH₂ₙ₊₂, se obtienen ${tx(rengD.y! * rengD.x! * rengMCo2Or(), 5)} g de CO₂ (${tx(rengMCo2Or(), 5)} g/mol) y ${tx(rengD.y! * (rengD.x! + 1) * rengMAguaOr(), 5)} g de H₂O (${tx(rengMAguaOr(), 5)} g/mol). Cada mol de alcano da n moles de CO₂ y n + 1 moles de H₂O.`,
    pregunta: () => '¿Cuántos carbonos tiene el alcano?',
    datos: (rengD) => [['CO₂', `${tx(rengD.y! * rengD.x! * rengMCo2Or(), 5)} g`], ['H₂O', `${tx(rengD.y! * (rengD.x! + 1) * rengMAguaOr(), 5)} g`], ['Relación', 'n(alcano) = n(H₂O) − n(CO₂)']],
    pasos: (rengD, rengR) => [`n(CO₂) = ${tx(rengD.y! * rengD.x!)} mol y n(H₂O) = ${tx(rengD.y! * (rengD.x! + 1))} mol (subtemas 6 y 21).`, `n(alcano) = ${tx(rengD.y! * (rengD.x! + 1))} − ${tx(rengD.y! * rengD.x!)} = ${tx(rengD.y!)} mol; carbonos = ${tx(rengD.y! * rengD.x!)}/${tx(rengD.y!)} = ${tx(rengR)} (subtema 7).`],
    pistas: ['Pasa las dos masas a moles.', 'La diferencia son los moles de alcano.', 'Divide los moles de CO₂ entre ellos.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b12-i6', subtema: RENG_GRUPO, subtemas: ['n1-b12-s8', 'n1-b12-s21', 'n1-b12-s22'],
    titulo: 'Cadenas de polímero a partir del monómero', dificultad: 'avanzada',
    objetivo: 'Relacionar la masa de un monómero con enlace doble con el número de cadenas de polímero que forma por adición.', unidad: 'mmol', tolerancia: RENG_TOL_OR,
    fuentes: rengFuentesOr('20.1', 'la polimerización por adición', { estructuras: true, masas: true }), idealizado: 'Polimerización completa en cadenas de igual longitud.', metodo: 'masa molar de la cadena leída en la escena «polimero»',
    parametros: (rengRng) => ({ i: rengIndice(rengRng, RENG_MONOMEROS_OR.length), x: rengEntreN1(rengRng, 1, 50, 1), y: rengEntreN1(rengRng, 500, 5000, 500) }),
    respuesta: (rengD) => (rengD.x! * 1e6) / (rengD.y! * M(RENG_MONOMEROS_OR[rengD.i!]![1])),
    errores: (rengD) => { const f = RENG_MONOMEROS_OR[rengD.i!]![1]; return [
      ['monomero', 'Los milimoles de monómero', (rengD.x! * 1e6) / M(f), 'Esos son los milimoles de monómero; cada cadena reúne muchas unidades.'],
      ['moles', 'En moles', (rengD.x! * 1000) / (rengD.y! * M(f)), 'Ese resultado está en moles; se pide en milimoles.']
    ] },
    enunciado: (rengD) => { const [n, f, p] = RENG_MONOMEROS_OR[rengD.i!]!; return `Se polimerizan por adición ${rengD.x} kg de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), y se obtiene ${p} en cadenas de ${rengD.y} unidades cada una. En la adición, el enlace doble del monómero se abre y no se pierde ningún átomo.` },
    pregunta: () => '¿Cuántos milimoles de cadenas se forman?',
    datos: (rengD) => { const f = RENG_MONOMEROS_OR[rengD.i!]![1]; return [['Masa de monómero', `${rengD.x} kg`], ['Masa del monómero', `${tx(M(f), 5)} g/mol`], ['Unidades por cadena', String(rengD.y)]] },
    pasos: (rengD, rengR) => { const f = RENG_MONOMEROS_OR[rengD.i!]![1]; return [`Masa molar de la cadena: ${rengD.y} × ${tx(M(f), 5)} = ${tx(rengD.y! * M(f), 5)} g/mol (subtemas 8 y 22).`, `n = ${rengD.x! * 1000} g/${tx(rengD.y! * M(f), 5)} g/mol = ${tx((rengD.x! * 1000) / (rengD.y! * M(f)))} mol = ${tx(rengR)} mmol (subtema 21).`] },
    pistas: ['Halla la masa molar de una cadena.', 'Pasa los kilogramos a gramos.', 'Divide y pasa a milimoles.']
  })
]
