import { rengDesdeSmiles, rengDescriptoresCIP } from '../../nucleo/molecula'
import { RENG_FUENTE_IUPAC_ORGANICA, RENG_NOMBRE_GRUPO, rengNombrarOrganico, type RengTipoGrupo } from '../../nucleo/organica'
import { rengElegir } from '../numeros'
import type { RengDatoEjercicio, RengFamilia, RengFuenteEjercicio, RengRespuestaEsperada, RengBaseEjercicio } from '../tipos'
import { rengDatoT, rengMezclar, rengNumero, rengOpciones } from './util'
import { RENG_BANCO_ESTEREO, RENG_BANCO_ORGANICO, RENG_GRUPOS_PRINCIPALES, RENG_ISOMERIA, RENG_NUMERO_ISOMEROS, RENG_REACCIONES_ORGANICAS, RENG_TIPOS_REACCION } from '../bancos'

const RENG_FUENTE_ORGANICA: RengFuenteEjercicio = {
  texto: `${RENG_FUENTE_IUPAC_ORGANICA}. Nombres y grupos revisados con el motor de nomenclatura de la app y con una lista independiente escrita a mano.`,
  verificacion: 'referencia'
}

export const RENG_FAMILIA_GRUPOS: RengFamilia = {
  id: 'organica.grupos',
  rama: 'organica',
  tema: 'grupos',
  nombre: 'Grupos funcionales',
  descripcion: 'Reconocer el grupo funcional y, en moléculas polifuncionales, el grupo principal.',
  niveles: ['preuniversitario', 'universitario'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel !== 'preuniversitario' && nivel !== 'universitario') return null
    const rengMolec = rengElegir(azar, nivel === 'preuniversitario' ? RENG_BANCO_ORGANICO.preuniversitario : RENG_BANCO_ORGANICO.universitario.filter((rengX) => rengX.principal))
    const rengCorrecto = rengMolec.principal ?? rengMolec.grupo
    const rengOpc = rengOpciones(azar, RENG_NOMBRE_GRUPO[rengCorrecto], nivel === 'preuniversitario' ? (Object.keys(RENG_NOMBRE_GRUPO) as RengTipoGrupo[]).filter((rengG) => !['carboxilato', 'aromatico', 'fenol'].includes(rengG)).map((rengG) => RENG_NOMBRE_GRUPO[rengG]) : RENG_GRUPOS_PRINCIPALES.map((rengG) => RENG_NOMBRE_GRUPO[rengG]).concat(RENG_NOMBRE_GRUPO[rengMolec.grupo]))
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('cond', 'Fórmula semidesarrollada', rengMolec.cond)]
    return {
      titulo: nivel === 'preuniversitario' ? 'Reconocer un grupo funcional' : 'Grupo principal de una molécula polifuncional',
      enunciado: `Observa la fórmula semidesarrollada ${rengMolec.cond}.`,
      pregunta: nivel === 'preuniversitario' ? '¿Qué grupo funcional contiene?' : 'La molécula tiene más de un grupo funcional. ¿Cuál es el principal, el que determina el sufijo del nombre?',
      datos: rengDatos,
      respuesta: { tipo: 'opcion', opciones: rengOpc.opciones, correcta: rengOpc.correcta },
      estructura: rengMolec.smiles,
      pistas: nivel === 'preuniversitario' ? ['Busca el átomo que no es C ni H y mira a qué se une.', 'C=O con un H terminal es aldehído; con dos C, cetona; con –OH, ácido; con –O–C, éster.'] : ['Identifica todos los grupos de la molécula.', 'La prioridad como grupo principal es: ácido > éster > amida > nitrilo > aldehído > cetona > alcohol > amina.'],
      pasos: [`Grupos presentes: ${[rengMolec.grupo, rengMolec.principal].filter(Boolean).map((rengG) => RENG_NOMBRE_GRUPO[rengG as RengTipoGrupo]).join(' y ')}.`, `Grupo ${nivel === 'preuniversitario' ? 'funcional' : 'principal'}: ${RENG_NOMBRE_GRUPO[rengCorrecto]}.`],
      errorFrecuente: nivel === 'preuniversitario' ? 'Confundir cetona con aldehído o éster con ácido.' : 'Nombrar como principal el grupo más a la izquierda en vez del de mayor prioridad.',
      fuente: RENG_FUENTE_ORGANICA
    }
  }
}

export const RENG_FAMILIA_NOMENCLATURA: RengFamilia = {
  id: 'organica.nomenclatura',
  rama: 'organica',
  tema: 'nomenclatura',
  nombre: 'Nomenclatura orgánica',
  descripcion: 'Nombrar un compuesto a partir de su fórmula semidesarrollada (IUPAC).',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'cientifico') return null
    const rengM = rengElegir(azar, RENG_BANCO_ORGANICO[nivel])
    const rengN = rengNombrarOrganico(rengDesdeSmiles(rengM.smiles))
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('cond', 'Fórmula semidesarrollada', rengM.cond)]
    return {
      titulo: 'Nombrar un compuesto orgánico',
      enunciado: `Un compuesto tiene la fórmula semidesarrollada ${rengM.cond}.`,
      pregunta: 'Escribe su nombre IUPAC (por ejemplo, propan-2-ol).',
      datos: rengDatos,
      respuesta: { tipo: 'nombre', smiles: rengM.smiles, aceptados: [rengM.nombre, ...rengN.comunes] },
      estructura: rengM.smiles,
      pistas: ['Busca la cadena de carbono continua más larga que contenga el grupo principal.', 'Numera la cadena para dar el localizador más bajo al grupo principal; después a los sustituyentes.', `El sufijo depende del grupo principal (${RENG_NOMBRE_GRUPO[rengM.principal ?? rengM.grupo]}).`],
      pasos: [`Grupo principal: ${RENG_NOMBRE_GRUPO[rengM.principal ?? rengM.grupo]}.`, `Nombre: ${rengM.nombre}.`],
      errorFrecuente: 'Numerar la cadena desde el extremo equivocado o elegir una cadena que no es la más larga.',
      hipotesis: nivel === 'quimico' ? ['Se usa la nomenclatura IUPAC de sustitución: cadena principal más larga que contiene el grupo principal.', 'Se aceptan nombres distintos que describan la misma estructura.'] : undefined,
      comprobacion: 'Dibuja la estructura a partir de tu nombre: debe coincidir con la fórmula del enunciado.',
      fuente: RENG_FUENTE_ORGANICA
    }
  }
}

export const RENG_FAMILIA_ESTRUCTURA: RengFamilia = {
  id: 'organica.estructura',
  rama: 'organica',
  tema: 'estructura',
  nombre: 'Escribir la estructura',
  descripcion: 'Escribir la fórmula semidesarrollada o el SMILES de un compuesto; se aceptan estructuras equivalentes.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'cientifico') return null
    const rengM = rengElegir(azar, RENG_BANCO_ORGANICO[nivel])
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('nombre', 'Nombre', rengM.nombre)]
    return {
      titulo: 'Escribir una estructura',
      enunciado: `Escribe la estructura del compuesto ${rengM.nombre}.`,
      pregunta: 'Usa una fórmula semidesarrollada (CH3CH2OH) o un SMILES (CCO). Se acepta cualquier escritura de la misma estructura.',
      datos: rengDatos,
      respuesta: { tipo: 'estructura', modo: 'igual', smiles: rengM.smiles, estereo: 'ignorar' },
      estructura: undefined,
      pistas: ['Dibuja primero la cadena principal con el número de carbonos que indica la raíz.', 'Coloca el grupo y los sustituyentes en los carbonos que indican los localizadores.', 'Completa con hidrógenos hasta cuatro enlaces por carbono.'],
      pasos: [`Estructura: ${rengM.cond}`, `SMILES equivalente: ${rengM.smiles}`],
      errorFrecuente: 'Colocar el grupo funcional en un carbono distinto al del localizador.',
      hipotesis: nivel === 'quimico' ? ['Se acepta cualquier escritura de la misma estructura (condensada o SMILES); no se evalúa la estereoquímica.'] : undefined,
      comprobacion: 'Cuenta los carbonos, localiza el grupo y comprueba que cada carbono tiene cuatro enlaces.',
      fuente: RENG_FUENTE_ORGANICA
    }
  }
}

export const RENG_FAMILIA_ISOMERIA: RengFamilia = {
  id: 'organica.isomeria',
  rama: 'organica',
  tema: 'isomeria',
  nombre: 'Isomería constitucional',
  descripcion: 'Contar isómeros y escribir un isómero con otro grupo funcional (etanol y dimetil éter son C₂H₆O).',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'cientifico') return null
    if (nivel === 'quimico' || azar() < 0.5) {
      const rengCaso = rengElegir(azar, RENG_ISOMERIA)
      const rengDatos: RengDatoEjercicio[] = [rengDatoT('formula', 'Fórmula molecular', rengCaso.formula), rengDatoT('referencia', 'Compuesto de partida', rengCaso.refNombre)]
      return {
        titulo: 'Escribir un isómero de otra función',
        enunciado: `Compuesto de partida: ${rengCaso.refNombre}, de fórmula molecular ${rengCaso.formula}. Hay otros compuestos con la misma fórmula pero distinta conectividad (isómeros constitucionales).`,
        pregunta: `Escribe la estructura de un isómero de ${rengCaso.formula} distinto del compuesto de partida que contenga el grupo: ${RENG_NOMBRE_GRUPO[rengCaso.pide]}.`,
        datos: rengDatos,
        respuesta: { tipo: 'estructura', modo: 'isomero', smiles: rengCaso.ref, formula: rengCaso.formula, grupo: rengCaso.pide, estereo: 'ignorar' },
        pistas: ['Los isómeros constitucionales tienen los mismos átomos pero enlazados de otra manera.', `Reorganiza los átomos de ${rengCaso.formula} para formar el grupo pedido.`],
        pasos: [`Un ejemplo válido: ${rengCaso.respuestaNombre} (${rengCaso.respuesta}).`],
        errorFrecuente: 'Escribir otra vez el mismo compuesto con otro orden de átomos, o cambiar la fórmula molecular.',
        hipotesis: ['Isómeros constitucionales: misma fórmula molecular y distinta conectividad; no se evalúa la estereoquímica.'],
        comprobacion: 'Cuenta los átomos de cada elemento de tu estructura: deben dar la fórmula molecular del enunciado.',
        fuente: RENG_FUENTE_ORGANICA
      }
    }
    const rengCaso = rengElegir(azar, RENG_NUMERO_ISOMEROS.filter((rengX) => rengX.nivel === nivel))
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('formula', 'Fórmula molecular', rengCaso.formula)]
    return {
      titulo: 'Contar isómeros constitucionales',
      enunciado: `Considera la fórmula molecular ${rengCaso.formula} (compuestos acíclicos, sin estereoisómeros).`,
      pregunta: '¿Cuántos isómeros constitucionales tiene?',
      datos: rengDatos,
      respuesta: rengNumero(rengCaso.n, '', { tolRel: 0, tolAbs: 0.01 }),
      pistas: ['Agrupa primero por función (alcohol, éter, ...) y después por el esqueleto de carbono.', 'Dentro de cada esqueleto, mueve la posición del grupo.'],
      pasos: [`Lista completa: ${rengCaso.lista.join(', ')}.`, `Total: ${rengCaso.n}.`],
      errorFrecuente: 'Olvidar los isómeros de función (por ejemplo, los éteres frente a los alcoholes) o repetir un mismo compuesto.',
      fuente: { texto: 'Recuento clásico de isómeros constitucionales acíclicos; cada isómero listado se verifica en las pruebas de la app (fórmula igual, estructura distinta). La exhaustividad del recuento es el valor de libro de texto, no se enumera por programa.', verificacion: 'didactico' }
    }
  }
}

export const RENG_FAMILIA_ESTEREO: RengFamilia = {
  id: 'organica.estereo',
  rama: 'organica',
  tema: 'estereo',
  nombre: 'Estereoquímica R/S y E/Z',
  descripcion: 'Asignar E o Z a un doble enlace y R o S a un centro estereogénico con las reglas CIP.',
  niveles: ['universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel !== 'universitario' && nivel !== 'quimico') return null
    const rengEz = nivel === 'universitario'
    const rengCaso = rengElegir(azar, rengEz ? RENG_BANCO_ESTEREO.ez : RENG_BANCO_ESTEREO.rs)
    const rengCip = rengDescriptoresCIP(rengCaso.smiles)
    const rengDescriptor = rengEz ? rengCip.dobles[0]?.descriptor : rengCip.centros[0]?.descriptor
    if (!rengDescriptor || rengDescriptor !== rengCaso.esperado || (rengEz ? rengCip.dobles.length !== 1 : rengCip.centros.length !== 1)) return null
    const rengOpc = rengEz ? ['E', 'Z'] : ['R', 'S']
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('smiles', 'Estructura (SMILES)', rengCaso.smiles.replace('\\', '\\'))]
    const rengO = rengOpciones(azar, rengCaso.esperado, rengOpc, 2)
    return {
      titulo: rengEz ? 'Asignar E o Z' : 'Asignar R o S',
      enunciado: `El compuesto ${rengCaso.nombre} tiene la estructura de la figura (SMILES ${rengCaso.smiles}).`,
      pregunta: rengEz ? '¿Qué configuración tiene el doble enlace según las reglas CIP?' : '¿Qué configuración tiene el centro estereogénico según las reglas CIP?',
      datos: rengDatos,
      respuesta: { tipo: 'opcion', opciones: rengO.opciones, correcta: rengO.correcta } satisfies RengRespuestaEsperada,
      estructura: rengCaso.smiles,
      hipotesis: ['Se aplican las reglas de prioridad CIP (número atómico, primer punto de diferencia).'],
      pistas: rengEz ? ['En cada carbono del doble enlace, decide cuál de los dos sustituyentes tiene mayor prioridad (mayor número atómico).', 'Si los dos de mayor prioridad están del mismo lado es Z (zusammen); de lados opuestos, E (entgegen).'] : ['Ordena los cuatro sustituyentes del centro por prioridad CIP (mayor número atómico primero).', 'Mira desde el lado opuesto al de menor prioridad: 1→2→3 en sentido horario es R; antihorario, S.'],
      pasos: [`Resultado: ${rengCaso.esperado}.`],
      comprobacion: 'Comprueba que el descriptor cambia si intercambias dos sustituyentes en el centro (o en un extremo del doble enlace).',
      errorFrecuente: rengEz ? 'Usar los átomos más grandes o los sustituyentes más largos en vez de la prioridad CIP.' : 'Olvidar que el sustituyente de menor prioridad debe quedar alejado del observador.',
      fuente: { texto: 'Reglas CIP según IUPAC 2013 (P-9); descriptores calculados con openchemlib y contrastados con una lista escrita a mano.', verificacion: 'referencia' }
    }
  }
}

const RENG_FUENTE_REACCIONES: RengFuenteEjercicio = {
  texto: 'Reacciones clásicas de química orgánica, redactadas y revisadas a mano a partir de las definiciones de la IUPAC (Gold Book) y de libros de texto; no se consultó una obra concreta. La app no predice reacciones: solo presenta casos documentados.',
  verificacion: 'didactico'
}

export const RENG_FAMILIA_REACCIONES_ORGANICAS: RengFamilia = {
  id: 'organica.reacciones',
  rama: 'organica',
  tema: 'reacciones-organicas',
  nombre: 'Reacciones orgánicas',
  descripcion: 'Interpretar reacciones de familias orgánicas con sus condiciones: producto y tipo de reacción.',
  niveles: ['preuniversitario', 'universitario', 'quimico'],
  generar: ({ azar, nivel }): RengBaseEjercicio | null => {
    if (nivel === 'cientifico') return null
    const rengPermitidas = RENG_REACCIONES_ORGANICAS.filter((rengR) => (nivel === 'preuniversitario' ? rengR.nivel === 'preuniversitario' : nivel === 'universitario' ? rengR.nivel !== 'quimico' : true))
    const rengR = rengElegir(azar, rengPermitidas)
    const rengDatos: RengDatoEjercicio[] = [rengDatoT('reactivos', 'Reactivos', rengR.reactivos), rengDatoT('condiciones', 'Condiciones', rengR.condiciones)]
    const rengTipoPregunta = nivel === 'universitario' && azar() < 0.4
    const rengBase = {
      datos: rengDatos,
      comprobacion: 'Comprueba que el producto conserva los átomos que no intervienen y que el grupo funcional cambia como describe la familia de la reacción.',
      fuente: RENG_FUENTE_REACCIONES,
      errorFrecuente: 'Ignorar las condiciones: el mismo reactivo puede dar productos distintos con otras condiciones.'
    }
    if (rengTipoPregunta) {
      const rengO = rengOpciones(azar, rengR.tipo, RENG_TIPOS_REACCION, 4)
      return {
        ...rengBase,
        titulo: `Tipo de reacción: ${rengR.familia}`,
        enunciado: `Se hace reaccionar ${rengR.reactivos} con estas condiciones: ${rengR.condiciones}.`,
        pregunta: '¿Qué tipo de reacción es?',
        respuesta: { tipo: 'opcion', opciones: rengO.opciones, correcta: rengO.correcta },
        pistas: ['Fíjate en qué cambia en el grupo funcional del reactivo orgánico.', 'Una adición rompe un enlace múltiple; una sustitución cambia un átomo o grupo por otro; una eliminación forma un enlace múltiple.'],
        pasos: [`Familia: ${rengR.familia}.`, rengR.nota]
      }
    }
    if (nivel === 'preuniversitario' || nivel === 'universitario') {
      const rengOtros = rengMezclarProductos(azar, rengR.producto)
      const rengO = rengOpciones(azar, rengR.productoNombre, rengOtros, 4)
      return {
        ...rengBase,
        titulo: `Producto: ${rengR.familia}`,
        enunciado: `Se hace reaccionar ${rengR.reactivos}. Condiciones: ${rengR.condiciones}.`,
        pregunta: rengR.pregunta,
        respuesta: { tipo: 'opcion', opciones: rengO.opciones, correcta: rengO.correcta },
        pistas: [`Es una reacción de la familia «${rengR.familia}».`, 'Identifica el grupo funcional que reacciona y cómo lo transforma el reactivo.'],
        pasos: [`Familia: ${rengR.familia} (${rengR.tipo}).`, `Producto: ${rengR.productoNombre} (${rengR.producto}).`, rengR.nota]
      }
    }
    return {
      ...rengBase,
      titulo: `Producto: ${rengR.familia}`,
      enunciado: `Se hace reaccionar ${rengR.reactivos}. Condiciones: ${rengR.condiciones}.`,
      pregunta: `${rengR.pregunta} Escribe su estructura (fórmula semidesarrollada o SMILES).`,
      respuesta: { tipo: 'estructura', modo: 'igual', smiles: rengR.producto, estereo: 'ignorar' },
      hipotesis: ['Se considera el producto principal en las condiciones indicadas.'],
      pistas: [`Es una reacción de la familia «${rengR.familia}».`, 'Las condiciones deciden qué producto domina (regioquímica y grado de oxidación).'],
      pasos: [`Familia: ${rengR.familia} (${rengR.tipo}).`, `Producto: ${rengR.productoNombre} (${rengR.producto}).`, rengR.nota]
    }
  }
}

function rengMezclarProductos(rengAzar: () => number, rengExcluir: string): string[] {
  const rengNombres = RENG_REACCIONES_ORGANICAS.filter((rengR) => rengR.producto !== rengExcluir).map((rengR) => rengR.productoNombre)
  return rengMezclar(rengAzar, [...new Set(rengNombres)])
}

export const RENG_FAMILIAS_ORGANICA: readonly RengFamilia[] = [RENG_FAMILIA_GRUPOS, RENG_FAMILIA_NOMENCLATURA, RENG_FAMILIA_ESTRUCTURA, RENG_FAMILIA_ISOMERIA, RENG_FAMILIA_ESTEREO, RENG_FAMILIA_REACCIONES_ORGANICAS]
