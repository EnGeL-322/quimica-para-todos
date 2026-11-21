import { rengTx } from '../aprender/n1/gases/constantes'
import { rengAnNo, rengMNo, rengTxtNo } from './b05-comun'
import {
  RENG_ADICIONES_OR, RENG_AMIDAS_OR, RENG_AMINAS_OR, RENG_CONDENSABLES_OR, RENG_ESTERES_OR, RENG_MONOAMINAS_OR, RENG_MONOMEROS_OR, RENG_NOMBRES_OR, RENG_OXIGENADOS_OR, RENG_REACCIONES_OR, RENG_TOL_OR_ENT, rengCOr, rengFAcidoOr, rengFAlcoholOr,
  rengGiOr, rengHOr, rengMAguaOr, rengMasaTerminosOr, rengO2Or, rengOOr, rengPracticaOr, rengTotalOr
} from './b12-comun'
import type { RengAmidaOr, RengEsterOr } from './b12-comun'
import type { RengPracticaN1 } from './tipos'

const tx = rengTx
const T = rengTxtNo
const M = rengMNo
const A = rengAnNo
const E = RENG_TOL_OR_ENT
const C = rengCOr
const H = rengHOr
export const rengMAcidoEsterOr = (rengE: RengEsterOr | RengAmidaOr): number => M(rengFAcidoOr(rengE.a))
export const rengMAlcoholEsterOr = (rengE: RengEsterOr): number => M(rengFAlcoholOr(rengE.b))
const Mac = rengMAcidoEsterOr
const Mol = rengMAlcoholEsterOr
export const RENG_NOMBRES_GI_OR = RENG_NOMBRES_OR.filter(([, rengF]) => rengGiOr(rengF) >= 1)
const ea = (rengI: number): number => { const [, rengR, rengP] = RENG_REACCIONES_OR[rengI]!; return (100 * rengP[1] * M(rengP[0])) / rengMasaTerminosOr(rengR) }
const INDICES_REACCION: readonly number[] = RENG_REACCIONES_OR.map((_rengX, rengI) => rengI)
const condensada = (rengF: string, rengN: number): number => rengN * M(rengF) - (rengN - 1) * rengMAguaOr()

export const RENG_PRACTICAS_B12_S17: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s17-p1', titulo: 'Masa molar de un éster', unidad: 'g/mol',
    objetivo: 'Calcular la masa molar de un éster a partir del ácido y el alcohol que lo forman.', seccion: '20.3', para: 'la esterificación', estructuras: true, nombres: true, masas: true,
    idealizado: 'Esterificación: ácido + alcohol → éster + agua.', metodo: 'masa molar del éster construido con el motor de estructuras', lista: RENG_ESTERES_OR,
    respuesta: (e) => Mac(e) + Mol(e) - rengMAguaOr(),
    errores: (e) => [
      ['sin-agua', 'Sin restar el agua', Mac(e) + Mol(e), 'Sumaste el ácido y el alcohol sin restar la molécula de agua que se libera.'],
      ['dos-aguas', 'Restando dos aguas', Mac(e) + Mol(e) - 2 * rengMAguaOr(), 'Se libera una sola molécula de agua por cada enlace éster formado.']
    ],
    enunciado: (e) => `El ${e.nombre} se forma por esterificación del ${e.acido} (${tx(Mac(e), 5)} g/mol) con ${e.alcohol} (${tx(Mol(e), 5)} g/mol). En la reacción se libera agua (${tx(rengMAguaOr(), 5)} g/mol).`,
    pregunta: '¿Cuál es la masa molar del éster, en g/mol?',
    datos: (e) => [['Ácido', `${tx(Mac(e), 5)} g/mol`], ['Alcohol', `${tx(Mol(e), 5)} g/mol`], ['Agua', `${tx(rengMAguaOr(), 5)} g/mol`]],
    pasos: (e, _x, _y, rengR) => ['ácido + alcohol → éster + agua.', `M = ${tx(Mac(e), 5)} + ${tx(Mol(e), 5)} − ${tx(rengMAguaOr(), 5)} = ${tx(rengR, 5)} g/mol (${T(e.formula)}).`],
    pistas: ['Escribe la reacción de esterificación.', 'Suma las masas de ácido y alcohol.', 'Resta la masa del agua liberada.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s17-p2', titulo: 'Éster obtenido a partir del ácido', unidad: 'g',
    objetivo: 'Calcular la masa de éster que se obtiene a partir de una masa de ácido carboxílico con alcohol en exceso.', seccion: '20.3', para: 'la esterificación', estructuras: true, nombres: true, masas: true,
    idealizado: 'Reacción completa con el alcohol en exceso.', metodo: 'masas molares del ácido y del éster construidos con el motor de estructuras', lista: RENG_ESTERES_OR, x: [5, 200, 5],
    respuesta: (e, x) => (x / Mac(e)) * M(e.formula),
    errores: (e, x) => [
      ['sin-agua', 'Sin restar el agua', (x / Mac(e)) * (Mac(e) + Mol(e)), 'Usaste la suma de ácido y alcohol como masa del éster: falta restar el agua.'],
      ['inverso', 'Cociente invertido', (x * Mac(e)) / M(e.formula), 'Invertiste las masas molares: divide entre la del ácido y multiplica por la del éster.']
    ],
    enunciado: (e, x) => `Se hacen reaccionar ${tx(x)} g de ${e.acido} (${tx(Mac(e), 5)} g/mol) con ${e.alcohol} en exceso para obtener ${e.nombre}, ${T(e.formula)} (${tx(M(e.formula), 5)} g/mol). Se supone que la reacción es completa.`,
    pregunta: '¿Qué masa de éster se forma, en gramos?',
    datos: (e, x) => [['Masa de ácido', `${tx(x)} g`], ['Masa molar del ácido', `${tx(Mac(e), 5)} g/mol`], ['Masa molar del éster', `${tx(M(e.formula), 5)} g/mol`]],
    pasos: (e, x, _y, rengR) => [`n = ${tx(x)}/${tx(Mac(e), 5)} = ${tx(x / Mac(e))} mol de ácido y de éster.`, `m = ${tx(x / Mac(e))} × ${tx(M(e.formula), 5)} = ${tx(rengR)} g.`],
    pistas: ['El ácido es el reactivo limitante.', 'Pasa sus gramos a moles.', 'Multiplica por la masa molar del éster.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s17-p3', titulo: 'Esterificación con rendimiento', unidad: 'g',
    objetivo: 'Calcular la masa real de éster obtenida en una esterificación con un rendimiento dado.', seccion: '20.3', para: 'la esterificación', estructuras: true, nombres: true, masas: true,
    idealizado: 'Alcohol en exceso; el rendimiento recoge que la reacción es un equilibrio.', metodo: 'rendimiento aplicado a la masa teórica calculada con las masas del motor de estructuras', lista: RENG_ESTERES_OR, x: [5, 200, 5], y: [40, 95, 5],
    respuesta: (e, x, y) => ((x / Mac(e)) * M(e.formula) * y) / 100,
    errores: (e, x, y) => [
      ['sin-rendimiento', 'La masa teórica', (x / Mac(e)) * M(e.formula), 'Esa es la masa teórica: falta aplicar el rendimiento.'],
      ['dividir', 'Dividiendo entre el rendimiento', ((x / Mac(e)) * M(e.formula) * 100) / y, 'Dividiste entre el rendimiento; la masa real es menor que la teórica.']
    ],
    enunciado: (e, x, y) => `Se hacen reaccionar ${tx(x)} g de ${e.acido} (${tx(Mac(e), 5)} g/mol) con ${e.alcohol} en exceso. Se obtiene ${e.nombre} (${tx(M(e.formula), 5)} g/mol) con un rendimiento del ${y} %.`,
    pregunta: '¿Qué masa de éster se obtiene realmente, en gramos?',
    datos: (e, x, y) => [['Masa de ácido', `${tx(x)} g`], ['Masa molar del ácido', `${tx(Mac(e), 5)} g/mol`], ['Masa molar del éster', `${tx(M(e.formula), 5)} g/mol`], ['Rendimiento', `${y} %`]],
    pasos: (e, x, y, rengR) => [`Masa teórica: ${tx(x)}/${tx(Mac(e), 5)} × ${tx(M(e.formula), 5)} = ${tx((x / Mac(e)) * M(e.formula))} g.`, `Masa real: ${tx((x / Mac(e)) * M(e.formula))} × ${y}/100 = ${tx(rengR)} g.`],
    pistas: ['Calcula primero la masa teórica.', 'El ácido es el reactivo limitante.', 'Multiplica por el rendimiento.']
  })
]

export const RENG_PRACTICAS_B12_S18: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s18-p1', titulo: 'Clasificar una amina', unidad: '', tolerancia: E,
    objetivo: 'Clasificar una amina como primaria, secundaria o terciaria contando los carbonos unidos al nitrógeno.', seccion: '20.4', para: 'las aminas', estructuras: true, nombres: true,
    idealizado: 'Amina con un solo nitrógeno.', metodo: 'recuento de carbonos vecinos del nitrógeno en la molécula construida con el motor de estructuras', lista: RENG_MONOAMINAS_OR,
    respuesta: ([, , , c]) => c,
    errores: ([, f, , c]) => [
      ['h-n', 'Los hidrógenos del nitrógeno', 3 - c, 'Esos son los hidrógenos unidos al nitrógeno; la clase de la amina la dan los carbonos unidos a él.'],
      ['h-totales', 'Todos los hidrógenos', H(f), 'Contaste todos los hidrógenos de la molécula; se piden los carbonos unidos al nitrógeno.']
    ],
    enunciado: ([n, f]) => `La amina ${n} tiene fórmula ${T(f)}. Una amina es primaria, secundaria o terciaria según su nitrógeno esté unido a uno, dos o tres carbonos.`,
    pregunta: '¿A cuántos carbonos está unido directamente su nitrógeno?',
    datos: ([n, f]) => [['Nombre', n], ['Fórmula', T(f)]],
    pasos: ([n, , , c], _x, _y, rengR) => [`Se dibuja la estructura de ${n} y se miran los vecinos del nitrógeno.`, `El nitrógeno está unido a ${tx(rengR)} ${c === 1 ? 'carbono: es primaria' : c === 2 ? 'carbonos: es secundaria' : 'carbonos: es terciaria'}.`],
    pistas: ['Dibuja la estructura de la amina.', 'El prefijo N- indica grupos en el N.', 'Cuenta los carbonos unidos al N.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s18-p2', titulo: 'Nitrógeno en una muestra de amina', unidad: 'g',
    objetivo: 'Calcular la masa de nitrógeno contenida en una muestra de una amina.', seccion: '20.4', para: 'las aminas', estructuras: true, nombres: true, masas: true,
    idealizado: 'Amina pura.', metodo: 'átomos de nitrógeno y masa molar de la molécula construida con el motor de estructuras', lista: RENG_AMINAS_OR, x: [10, 300, 10],
    respuesta: ([, f, , , k], x) => (x * k * A('N')) / M(f),
    errores: ([, f, , , k], x) => [
      ['porcentaje', 'El porcentaje', (100 * k * A('N')) / M(f), 'Ese es el porcentaje de nitrógeno; falta aplicarlo a la masa de la muestra.'],
      ['carbono', 'La masa de carbono', (x * C(f) * A('C')) / M(f), 'Calculaste la masa de carbono; se pide la de nitrógeno.']
    ],
    enunciado: ([n, f, , , k], x) => `Una muestra contiene ${tx(x)} g de la amina ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), con ${k} ${k === 1 ? 'átomo' : 'átomos'} de nitrógeno por molécula. La masa atómica del nitrógeno es ${tx(A('N'), 5)}.`,
    pregunta: '¿Qué masa de nitrógeno contiene, en gramos?',
    datos: ([, f, , , k], x) => [['Masa de la muestra', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['Nitrógenos por molécula', String(k)]],
    pasos: ([, f, , , k], x, _y, rengR) => [`Fracción de nitrógeno: ${k} × ${tx(A('N'), 5)}/${tx(M(f), 5)} = ${tx((k * A('N')) / M(f))}.`, `m(N) = ${tx(x)} × ${tx((k * A('N')) / M(f))} = ${tx(rengR)} g.`],
    pistas: ['Cuenta los nitrógenos de la fórmula.', 'Calcula su fracción en masa.', 'Multiplica por la masa de la muestra.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s18-p3', titulo: 'Ácido para neutralizar una amina', unidad: 'g',
    objetivo: 'Calcular la masa de cloruro de hidrógeno que neutraliza una masa de amina.', seccion: '20.4', para: 'la basicidad de las aminas', estructuras: true, nombres: true, masas: true,
    idealizado: 'Neutralización completa: un HCl por cada nitrógeno básico.', metodo: 'recuento de grupos amino con el detector de grupos funcionales del núcleo', lista: RENG_AMINAS_OR, x: [10, 300, 10],
    respuesta: ([, f, , , k], x) => (x / M(f)) * k * M('HCl'),
    errores: ([, f, , , k], x) => [
      ['moles', 'Los moles de HCl', (x / M(f)) * k, 'Esos son los moles de HCl; se pide la masa: multiplica por su masa molar.'],
      ['sal', 'La masa de la sal', x + (x / M(f)) * k * M('HCl'), 'Diste la masa de la sal de amonio formada; se pide solo la del HCl.']
    ],
    enunciado: ([n, f, , , k], x) => `Se neutralizan ${tx(x)} g de la amina ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), con HCl (${tx(M('HCl'), 5)} g/mol). Cada uno de sus ${k === 1 ? 'un nitrógeno' : `${k} nitrógenos`} capta un H⁺.`,
    pregunta: '¿Qué masa de HCl hace falta, en gramos?',
    datos: ([, f, , , k], x) => [['Masa de amina', `${tx(x)} g`], ['Masa molar', `${tx(M(f), 5)} g/mol`], ['HCl por molécula', String(k)]],
    pasos: ([, f, , , k], x, _y, rengR) => [`n(amina) = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol; n(HCl) = ${tx((x / M(f)) * k)} mol.`, `m(HCl) = ${tx((x / M(f)) * k)} × ${tx(M('HCl'), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de amina a moles.', 'Cada nitrógeno capta un H⁺.', 'Pasa los moles de HCl a gramos.']
  })
]

export const RENG_PRACTICAS_B12_S19: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s19-p1', titulo: 'Masa molar de una amida', unidad: 'g/mol',
    objetivo: 'Calcular la masa molar de una amida a partir del ácido y la amina que la forman.', seccion: '20.4', para: 'la formación de amidas', estructuras: true, nombres: true, masas: true,
    idealizado: 'Condensación: ácido + amina → amida + agua.', metodo: 'masa molar de la amida construida con el motor de estructuras', lista: RENG_AMIDAS_OR,
    respuesta: (a) => Mac(a) + M(a.formulaAmina) - rengMAguaOr(),
    errores: (a) => [
      ['sin-agua', 'Sin restar el agua', Mac(a) + M(a.formulaAmina), 'Sumaste el ácido y la amina sin restar la molécula de agua que se libera.'],
      ['dos-aguas', 'Restando dos aguas', Mac(a) + M(a.formulaAmina) - 2 * rengMAguaOr(), 'Se libera una sola molécula de agua por cada enlace amida formado.']
    ],
    enunciado: (a) => `La ${a.nombre} se forma por condensación del ${a.acido} (${tx(Mac(a), 5)} g/mol) con ${a.amina}, ${T(a.formulaAmina)} (${tx(M(a.formulaAmina), 5)} g/mol). En la reacción se libera agua (${tx(rengMAguaOr(), 5)} g/mol).`,
    pregunta: '¿Cuál es la masa molar de la amida, en g/mol?',
    datos: (a) => [['Ácido', `${tx(Mac(a), 5)} g/mol`], ['Amina o amoníaco', `${tx(M(a.formulaAmina), 5)} g/mol`], ['Agua', `${tx(rengMAguaOr(), 5)} g/mol`]],
    pasos: (a, _x, _y, rengR) => ['ácido + amina → amida + agua.', `M = ${tx(Mac(a), 5)} + ${tx(M(a.formulaAmina), 5)} − ${tx(rengMAguaOr(), 5)} = ${tx(rengR, 5)} g/mol (${T(a.formula)}).`],
    pistas: ['Escribe la reacción de condensación.', 'Suma las masas de ácido y amina.', 'Resta la masa del agua liberada.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s19-p2', titulo: 'Agua liberada al formar una amida', unidad: 'g',
    objetivo: 'Calcular el agua que se libera al formar una masa dada de amida.', seccion: '20.4', para: 'la formación de amidas', estructuras: true, nombres: true, masas: true,
    idealizado: 'Una molécula de agua por cada enlace amida.', metodo: 'conservación de la masa entre reactivos y amida', lista: RENG_AMIDAS_OR, x: [10, 300, 10],
    respuesta: (a, x) => (x / M(a.formula)) * rengMAguaOr(),
    errores: (a, x) => [
      ['dos-aguas', 'Dos aguas por amida', (2 * x * rengMAguaOr()) / M(a.formula), 'Se libera una sola molécula de agua por cada molécula de amida formada.'],
      ['masa-acido', 'La masa de ácido', (x / M(a.formula)) * Mac(a), 'Esa es la masa de ácido consumida; se pide la del agua liberada.']
    ],
    enunciado: (a, x) => `Se obtienen ${tx(x)} g de ${a.nombre}, ${T(a.formula)} (${tx(M(a.formula), 5)} g/mol), por condensación del ${a.acido} con ${a.amina}. Cada enlace amida libera una molécula de agua (${tx(rengMAguaOr(), 5)} g/mol).`,
    pregunta: '¿Qué masa de agua se ha liberado, en gramos?',
    datos: (a, x) => [['Masa de amida', `${tx(x)} g`], ['Masa molar de la amida', `${tx(M(a.formula), 5)} g/mol`], ['Agua por amida', '1']],
    pasos: (a, x, _y, rengR) => [`n(amida) = ${tx(x)}/${tx(M(a.formula), 5)} = ${tx(x / M(a.formula))} mol, y los mismos moles de agua.`, `m(H₂O) = ${tx(x / M(a.formula))} × ${tx(rengMAguaOr(), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de amida a moles.', 'Se libera un agua por cada amida.', 'Pasa los moles de agua a gramos.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s19-p3', titulo: 'Hidrólisis de una amida', unidad: 'g',
    objetivo: 'Calcular la masa de ácido carboxílico que se recupera al hidrolizar una amida.', seccion: '20.4', para: 'la hidrólisis de las amidas', estructuras: true, nombres: true, masas: true,
    idealizado: 'Hidrólisis completa: amida + agua → ácido + amina.', metodo: 'masas molares del ácido y de la amida construidos con el motor de estructuras', lista: RENG_AMIDAS_OR, x: [10, 300, 10],
    respuesta: (a, x) => (x / M(a.formula)) * Mac(a),
    errores: (a, x) => [
      ['amina', 'La masa de amina', (x / M(a.formula)) * M(a.formulaAmina), 'Esa es la masa de amina o de amoníaco que se libera; se pide la de ácido.'],
      ['suma', 'Ácido más amina', (x / M(a.formula)) * (Mac(a) + M(a.formulaAmina)), 'Sumaste el ácido y la amina; se pide solo la masa del ácido.']
    ],
    enunciado: (a, x) => `Se hidrolizan por completo ${tx(x)} g de ${a.nombre}, ${T(a.formula)} (${tx(M(a.formula), 5)} g/mol). Se recuperan ${a.acido} (${tx(Mac(a), 5)} g/mol) y ${a.amina} (${tx(M(a.formulaAmina), 5)} g/mol).`,
    pregunta: '¿Qué masa de ácido se obtiene, en gramos?',
    datos: (a, x) => [['Masa de amida', `${tx(x)} g`], ['Masa molar de la amida', `${tx(M(a.formula), 5)} g/mol`], ['Masa molar del ácido', `${tx(Mac(a), 5)} g/mol`]],
    pasos: (a, x, _y, rengR) => [`n = ${tx(x)}/${tx(M(a.formula), 5)} = ${tx(x / M(a.formula))} mol de amida y de ácido.`, `m = ${tx(x / M(a.formula))} × ${tx(Mac(a), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de amida a moles.', 'Cada amida da un ácido.', 'Multiplica por la masa del ácido.']
  })
]

export const RENG_PRACTICAS_B12_S20: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s20-p1', titulo: 'Carbonos a partir del nombre', unidad: '', tolerancia: E,
    objetivo: 'Deducir el número total de carbonos de un compuesto orgánico a partir de su nombre sistemático.', seccion: '20.1', para: 'la nomenclatura orgánica', estructuras: true, nombres: true,
    idealizado: 'Nombres sistemáticos sencillos.', metodo: 'lectura del nombre con el analizador de nomenclatura del núcleo y recuento sobre la molécula', lista: RENG_NOMBRES_OR,
    respuesta: ([, f]) => C(f),
    errores: ([, f]) => [
      ['hidrogenos', 'Los hidrógenos', H(f), 'Ese es el número de hidrógenos; se piden los carbonos.'],
      ['atomos', 'Todos los átomos', rengTotalOr(f), 'Contaste todos los átomos de la molécula; se piden solo los carbonos.']
    ],
    enunciado: ([n]) => `Un compuesto se llama ${n}. La raíz indica los carbonos de la cadena principal (met- 1, et- 2, prop- 3, but- 4, pent- 5, hex- 6, hept- 7, oct- 8, non- 9, dec- 10) y cada sustituyente añade los suyos (metil 1, etil 2, propil 3, butil 4; un anillo de benceno, 6).`,
    pregunta: '¿Cuántos carbonos tiene la molécula en total?',
    datos: ([n]) => [['Nombre', n], ['Regla', 'cadena principal + sustituyentes']],
    pasos: ([n, f], _x, _y, rengR) => [`Se separa el nombre «${n}» en sustituyentes, raíz y terminación.`, `Carbonos en total: ${tx(rengR)}; la fórmula es ${T(f)}.`],
    pistas: ['Localiza la raíz del nombre.', 'Suma los carbonos de las ramas.', 'En un éster, suma ácido y alcohol.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s20-p2', titulo: 'Insaturaciones a partir del nombre', unidad: '',
    objetivo: 'Deducir de la terminación de un nombre cuántos enlaces π y anillos tiene la molécula.', seccion: '20.1', para: 'la nomenclatura orgánica', estructuras: true, nombres: true,
    idealizado: 'Nombres sistemáticos sencillos.', metodo: 'lectura del nombre con el analizador de nomenclatura del núcleo y recuento de enlaces π y anillos', lista: RENG_NOMBRES_GI_OR,
    respuesta: ([, f]) => rengGiOr(f),
    errores: ([, f]) => [
      ['sin-dividir', 'Los hidrógenos que faltan', 2 * rengGiOr(f), 'Esos son los hidrógenos que faltan para saturar; cada grado de insaturación equivale a dos.'],
      ['uno-menos', 'Uno menos', rengGiOr(f) - 1, 'Te falta una insaturación: revisa los C=O, los enlaces múltiples y los anillos del nombre.']
    ],
    enunciado: ([n]) => `Un compuesto se llama ${n}. Las terminaciones -eno, -al, -ona, -oico, -oato y -amida indican un enlace doble cada una; -ino, un enlace triple (dos enlaces π); di- y tri- los multiplican, y un anillo de benceno suma cuatro insaturaciones.`,
    pregunta: '¿Cuál es su grado de insaturación (enlaces π más anillos)?',
    datos: ([n, f]) => [['Nombre', n], ['Fórmula molecular', T(f)]],
    pasos: ([, f], _x, _y, rengR) => [`La fórmula es ${T(f)}.`, `GI = ${tx(rengR)}, que coincide con los enlaces π y anillos que indica el nombre.`],
    pistas: ['Busca -eno, -ino y los grupos C=O.', 'Un triple cuenta como dos.', 'Un anillo de benceno suma cuatro.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s20-p3', titulo: 'Masa molar a partir del nombre', unidad: 'g/mol',
    objetivo: 'Formular un compuesto orgánico a partir de su nombre y calcular su masa molar.', seccion: '20.1', para: 'la nomenclatura orgánica', estructuras: true, nombres: true, masas: true,
    idealizado: 'Nombres sistemáticos sencillos.', metodo: 'lectura del nombre con el analizador de nomenclatura del núcleo y masa molar de la molécula', lista: RENG_NOMBRES_OR,
    respuesta: ([, f]) => M(f),
    errores: ([, f]) => [
      ['sin-h', 'Sin los hidrógenos', M(f) - H(f) * A('H'), 'Olvidaste sumar la masa de los hidrógenos.'],
      ['h-doble', 'Hidrógenos dos veces', M(f) + H(f) * A('H'), 'Contaste los hidrógenos dos veces: completa cada carbono solo hasta cuatro enlaces.']
    ],
    enunciado: ([n]) => `Un compuesto se llama ${n}. Masas atómicas: C ${tx(A('C'), 5)}; H ${tx(A('H'), 4)}; N ${tx(A('N'), 5)}; O ${tx(A('O'), 5)}; Cl ${tx(A('Cl'), 4)}; Br ${tx(A('Br'), 5)}.`,
    pregunta: '¿Cuál es su masa molar, en g/mol?',
    datos: ([n]) => [['Nombre', n], ['Pasos', 'estructura → fórmula molecular → masa molar']],
    pasos: ([, f], _x, _y, rengR) => [`Al dibujar la estructura y contar los átomos se obtiene ${T(f)}.`, `M = ${tx(rengR, 5)} g/mol.`],
    pistas: ['Dibuja la estructura del nombre.', 'Completa los hidrógenos de cada C.', 'Suma las masas atómicas.']
  })
]

export const RENG_PRACTICAS_B12_S21: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s21-p1', titulo: 'Oxígeno de una combustión', unidad: 'mol',
    objetivo: 'Ajustar la combustión completa de un compuesto con oxígeno y hallar el O₂ que consume un mol.', seccion: '20.3', para: 'la combustión de compuestos oxigenados', estructuras: true, nombres: true,
    idealizado: 'Combustión completa a CO₂ y H₂O.', metodo: 'ajuste de la ecuación de combustión con el ajustador del núcleo', lista: RENG_OXIGENADOS_OR,
    respuesta: ([, f]) => rengO2Or(f),
    errores: ([, f]) => [
      ['sin-oxigeno-propio', 'Sin el oxígeno propio', C(f) + H(f) / 4, 'No descontaste el oxígeno que ya trae el compuesto: resta z/2.'],
      ['sin-agua', 'Solo para el CO₂', C(f) - rengOOr(f) / 2, 'Contaste solo el oxígeno del CO₂; el agua también lo necesita: y/4.']
    ],
    enunciado: ([n, f]) => `Se quema por completo un mol de ${n}, ${T(f)}, y se forman CO₂ y H₂O.`,
    pregunta: '¿Cuántos moles de O₂ consume?',
    datos: ([, f]) => [['x, y, z', `${C(f)}, ${H(f)}, ${rengOOr(f)}`], ['Regla', 'x + y/4 − z/2']],
    pasos: ([, f], _x, _y, rengR) => [`Se forman ${C(f)} CO₂ y ${tx(H(f) / 2)} H₂O: hacen falta ${tx(2 * C(f) + H(f) / 2)} átomos de O, y el compuesto aporta ${rengOOr(f)}.`, `n(O₂) = (${tx(2 * C(f) + H(f) / 2)} − ${rengOOr(f)})/2 = ${tx(rengR)} mol.`],
    pistas: ['Cada carbono da un CO₂.', 'Cada dos hidrógenos dan un H₂O.', 'Resta el oxígeno que trae el compuesto.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s21-p2', titulo: 'Producto de una adición', unidad: 'g',
    objetivo: 'Calcular la masa de producto de una reacción de adición a un alqueno.', seccion: '20.1', para: 'las reacciones de adición', estructuras: true, nombres: true, masas: true,
    idealizado: 'Adición completa, mol a mol, con un único producto.', metodo: 'masa molar del producto construido con el motor de estructuras', lista: RENG_ADICIONES_OR, x: [10, 200, 10],
    respuesta: ([, f, , fr], x) => (x / M(f)) * (M(f) + M(fr)),
    errores: ([, f, , fr], x) => [
      ['solo-reactivo', 'Solo el reactivo', (x / M(f)) * M(fr), 'Esa es la masa del reactivo adicionado; el producto incluye también el alqueno.'],
      ['sin-moles', 'Sumando masas molares', x + M(fr), 'Sumaste la masa molar del reactivo a los gramos: antes hay que pasar a moles.']
    ],
    enunciado: ([n, f, r, fr, p], x) => `Al ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), se le adiciona ${r} (${tx(M(fr), 5)} g/mol) y se forma ${p}. Reaccionan por completo ${tx(x)} g del alqueno.`,
    pregunta: '¿Qué masa de producto se forma, en gramos?',
    datos: ([, f, , fr], x) => [['Masa de alqueno', `${tx(x)} g`], ['Masa molar del alqueno', `${tx(M(f), 5)} g/mol`], ['Masa molar del producto', `${tx(M(f) + M(fr), 5)} g/mol`]],
    pasos: ([, f, , fr], x, _y, rengR) => [`n = ${tx(x)}/${tx(M(f), 5)} = ${tx(x / M(f))} mol de alqueno y de producto.`, `m = ${tx(x / M(f))} × ${tx(M(f) + M(fr), 5)} = ${tx(rengR)} g.`],
    pistas: ['Pasa los gramos de alqueno a moles.', 'En una adición no se pierden átomos.', 'El producto pesa alqueno más reactivo.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s21-p3', titulo: 'Economía atómica de una reacción', unidad: '%',
    objetivo: 'Calcular la economía atómica de una reacción orgánica de sustitución, eliminación o condensación.', seccion: '20.1', para: 'los tipos de reacciones orgánicas', estructuras: true, masas: true,
    idealizado: 'Ecuación ajustada; el producto deseado es el compuesto orgánico principal.', metodo: 'cien menos el porcentaje de masa que sale como subproducto, con el analizador de fórmulas del núcleo', lista: INDICES_REACCION,
    respuesta: (i) => ea(i),
    errores: (i) => [
      ['residuo', 'El subproducto', 100 - ea(i), 'Ese es el porcentaje de masa que acaba en el subproducto; se pide el del producto deseado.'],
      ['inverso', 'Cociente invertido', 10000 / ea(i), 'Dividiste al revés: la masa del producto deseado va en el numerador.']
    ],
    enunciado: (i) => { const [texto, r, p, , tipo] = RENG_REACCIONES_OR[i]!; return `En la reacción de ${tipo} ${texto}, el producto deseado es ${T(p[0])} (${tx(M(p[0]), 5)} g/mol${p[1] > 1 ? `, ${p[1]} moles` : ''}). La suma de las masas de los reactivos de la ecuación es ${tx(rengMasaTerminosOr(r), 5)} g.` },
    pregunta: '¿Cuál es la economía atómica de la reacción, en %?',
    datos: (i) => { const [, r, p] = RENG_REACCIONES_OR[i]!; return [['Masa del producto deseado', `${tx(p[1] * M(p[0]), 5)} g`], ['Masa de los reactivos', `${tx(rengMasaTerminosOr(r), 5)} g`]] },
    pasos: (i, _x, _y, rengR) => { const [, r, p] = RENG_REACCIONES_OR[i]!; return [`EA = 100 × masa del producto deseado/masa de los reactivos.`, `EA = 100 × ${tx(p[1] * M(p[0]), 5)}/${tx(rengMasaTerminosOr(r), 5)} = ${tx(rengR)} %.`] },
    pistas: ['Identifica el producto deseado.', 'Suma las masas de los reactivos.', 'Divide y multiplica por cien.']
  })
]

export const RENG_PRACTICAS_B12_S22: readonly RengPracticaN1[] = [
  rengPracticaOr({
    id: 'n1-b12-s22-p1', titulo: 'Masa molar de un polímero de adición', unidad: 'g/mol',
    objetivo: 'Calcular la masa molar de una cadena de polímero de adición a partir de su monómero.', seccion: '20.1', para: 'los polímeros de adición', estructuras: true, masas: true,
    idealizado: 'Cadena lineal de un solo monómero; se ignoran los extremos.', metodo: 'lectura de la escena «polimero» en modo adición', lista: RENG_MONOMEROS_OR, x: [500, 5000, 500],
    respuesta: ([, f], x) => x * M(f),
    errores: ([, f], x) => [
      ['condensacion', 'Como una condensación', x * M(f) - (x - 1) * rengMAguaOr(), 'Restaste agua como en una condensación; en la adición no se pierde ningún átomo.'],
      ['sin-n', 'Un solo monómero', M(f), 'Esa es la masa de un monómero: multiplica por el número de unidades.']
    ],
    enunciado: ([n, f, p], x) => `Una cadena de ${p} está formada por ${x} unidades de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), unidas por adición.`,
    pregunta: '¿Cuál es la masa molar de la cadena, en g/mol?',
    datos: ([, f], x) => [['Unidades', String(x)], ['Masa del monómero', `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f], x, _y, rengR) => ['En la adición no se pierden átomos: M = n × M₀.', `M = ${x} × ${tx(M(f), 5)} = ${tx(rengR, 5)} g/mol.`],
    pistas: ['En la adición no se pierde masa.', 'Cada unidad pesa lo que el monómero.', 'Multiplica unidades por masa.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s22-p2', titulo: 'Unidades de una cadena de polímero', unidad: '', tolerancia: { rel: 0.005, abs: 0.02 },
    objetivo: 'Calcular cuántas unidades de monómero forman una cadena de polímero de adición de masa molar conocida.', seccion: '20.1', para: 'los polímeros de adición', estructuras: true, masas: true,
    idealizado: 'Cadena lineal de un solo monómero.', metodo: 'búsqueda con la escena «polimero» del número de unidades que da esa masa', lista: RENG_MONOMEROS_OR, x: [500, 5000, 500],
    respuesta: (_m, x) => x,
    errores: ([, f], x) => [
      ['con-agua', 'Restando agua', (x * M(f)) / (M(f) - rengMAguaOr()), 'Restaste agua al monómero; en la adición la unidad pesa lo mismo que el monómero.'],
      ['carbonos', 'Los carbonos de la cadena', x * C(f), 'Contaste carbonos de la cadena, no unidades de monómero.']
    ],
    enunciado: ([n, f, p], x) => `Una cadena de ${p} tiene una masa molar de ${tx(x * M(f), 5)} g/mol. Su monómero es ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), y las unidades se unen por adición.`,
    pregunta: '¿Cuántas unidades de monómero forman la cadena?',
    datos: ([, f], x) => [['Masa molar de la cadena', `${tx(x * M(f), 5)} g/mol`], ['Masa del monómero', `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f], x, _y, rengR) => ['n = M/M₀.', `n = ${tx(x * M(f), 5)}/${tx(M(f), 5)} = ${tx(rengR, 4)} unidades.`],
    pistas: ['En la adición, M = n × M₀.', 'Despeja el número de unidades.', 'Divide la masa de la cadena.']
  }),
  rengPracticaOr({
    id: 'n1-b12-s22-p3', titulo: 'Masa molar de una cadena por condensación', unidad: 'g/mol',
    objetivo: 'Calcular la masa molar de una cadena formada por condensación, descontando el agua liberada.', seccion: '20.4', para: 'los polímeros de condensación y las biomoléculas', estructuras: true, masas: true,
    idealizado: 'Cadena lineal: n unidades forman n − 1 uniones y liberan n − 1 moléculas de agua.', metodo: 'lectura de la escena «polimero» en modo condensación', lista: RENG_CONDENSABLES_OR, x: [2, 50, 1],
    respuesta: ([, f], x) => condensada(f, x),
    errores: ([, f], x) => [
      ['sin-agua', 'Sin restar el agua', x * M(f), 'Sumaste los monómeros sin restar el agua que libera cada unión.'],
      ['doble-agua', 'Dos aguas por unión', x * M(f) - 2 * (x - 1) * rengMAguaOr(), 'Cada unión libera una sola molécula de agua, no dos.']
    ],
    enunciado: ([n, f, c], x) => `${x} moléculas de ${n}, ${T(f)} (${tx(M(f), 5)} g/mol), se unen en cadena por condensación y forman ${c}. Cada unión libera una molécula de agua (${tx(rengMAguaOr(), 5)} g/mol).`,
    pregunta: '¿Cuál es la masa molar de la cadena, en g/mol?',
    datos: ([, f], x) => [['Unidades', String(x)], ['Uniones', String(x - 1)], ['Masa del monómero', `${tx(M(f), 5)} g/mol`]],
    pasos: ([, f], x, _y, rengR) => [`${x} unidades forman ${x - 1} uniones y liberan ${x - 1} moléculas de agua.`, `M = ${x} × ${tx(M(f), 5)} − ${x - 1} × ${tx(rengMAguaOr(), 5)} = ${tx(rengR, 5)} g/mol.`],
    pistas: ['n unidades forman n − 1 uniones.', 'Cada unión libera un agua.', 'Resta el agua a la suma de monómeros.']
  })
]
