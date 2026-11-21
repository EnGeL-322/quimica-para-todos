import { type RengDatosCorrida, type RengEstadoResultado, type RengMagnitud, type RengModeloCorrida, type RengSerie, type RengValorConUnidad } from '@shared/cuaderno'
import { RENG_ACIDOS, rengCurvaValoracion } from '../nucleo/acidoBase'
import { RENG_CODIGOS_PARES, RENG_FARADAY, RENG_PARES_ELECTRO, RENG_R_GASES, rengParRegistrado } from '../datos/electroquimica'
import { RENG_CODIGOS_SALES, rengSalRegistrada } from '../datos/solubilidad'
import { rengSerieNernst } from '../nucleo/electroquimica'
import { rengCalibrarColorimetria, rengLeerEntradaColorimetria } from '../nucleo/colorimetria'
import { rengSerieIonComun } from '../nucleo/solubilidad'
import { RENG_LIMITES_DILUCION, rengDiluir, type RengModoDilucion } from '../nucleo/dilucion'
import { rengConcentracion, rengVidaMedia, type RengOrden } from '../nucleo/cinetica'
import { rengEnergiaLibre, rengEntalpiaReaccion, rengEntropiaReaccion } from '../nucleo/termoquimica'
import { rengCorridaValoracion } from '../corrida'
import { RENG_CODIGOS_PAREJAS } from '../datos/isomeros'
import { rengAnalizarCeldaEntradas, rengAnalizarSolubilidadEntradas, rengBaseEntradas, rengCompararIsomerosEntradas, rengSemiceldaCore, RENG_MODELOS_ESCENA, RENG_PRESETS_EQ, RENG_REACCIONES_TERMO, rengCalcularEscena, rengDesplazamientoEquilibrio, rengEntradasPorDefecto, rengValidarEntradasSim, type RengEntradasSim, type RengEscena } from './modelosSimulacion'
import { rengBalancesAcidoBase, rengDiagnosticosDominio, rengResumenEscena, type RengDiagnosticoDominio } from './reglasEscena'

export const RENG_MODULO_CORRIDAS = 'simulador-quimica'

export const RENG_ID_MODELO_CORRIDA: Record<RengEscena, string> = {
  acidobase: 'sim-acidobase',
  mezcla: 'mezcla-acido-base',
  cinetica: 'sim-cinetica',
  equilibrio: 'sim-equilibrio',
  termo: 'sim-termo',
  dilucion: 'sim-dilucion',
  colorimetria: 'sim-colorimetria',
  solubilidad: 'sim-solubilidad',
  electroquimica: 'sim-electroquimica',
  isomeros: 'sim-isomeros'
}

export const RENG_CODIGOS_V1 = {
  acido: ['hcl', 'acetico', 'fosforico1', 'fluorhidrico', 'formico', 'amonio'],
  acidoMezcla: ['hcl', 'acetico'],
  sal: RENG_CODIGOS_SALES,
  par: RENG_CODIGOS_PARES,
  pareja: RENG_CODIGOS_PAREJAS,
  reaccionEquilibrio: ['hi', 'n2o4', 'haber'],
  reaccionTermo: ['metano', 'agua', 'amoniaco', 'etanol', 'glucosa', 'vaporiza']
} as const

const rengListaDe = (rengEscena: RengEscena, rengClave: string): readonly string[] | null => {
  if (rengClave === 'acido' && rengEscena === 'acidobase') return RENG_CODIGOS_V1.acido
  if (rengClave === 'acido' && rengEscena === 'mezcla') return RENG_CODIGOS_V1.acidoMezcla
  if (rengClave === 'sal' && rengEscena === 'solubilidad') return RENG_CODIGOS_V1.sal
  if ((rengClave === 'ano' || rengClave === 'cat') && rengEscena === 'electroquimica') return RENG_CODIGOS_V1.par
  if (rengClave === 'pareja' && rengEscena === 'isomeros') return RENG_CODIGOS_V1.pareja
  if (rengClave === 'reaccion' && rengEscena === 'equilibrio') return RENG_CODIGOS_V1.reaccionEquilibrio
  if (rengClave === 'reaccion' && rengEscena === 'termo') return RENG_CODIGOS_V1.reaccionTermo
  return null
}

export function rengCodificarEntradas(rengEscena: RengEscena, rengEntradas: RengEntradasSim): Record<string, number> {
  const rengSal: Record<string, number> = {}
  for (const rengC of RENG_MODELOS_ESCENA[rengEscena].campos) {
    const rengV = rengEntradas[rengC.clave]
    if (rengV === undefined) continue
    const rengLista = rengListaDe(rengEscena, rengC.clave)
    if (rengLista) {
      const rengI = rengLista.indexOf(String(rengV))
      if (rengI < 0) throw new RangeError(`«${String(rengV)}» no está en la lista de ${rengC.etiqueta.toLowerCase()} del modelo`)
      rengSal[rengC.clave] = rengI
    } else if (typeof rengV === 'number' && Number.isFinite(rengV)) rengSal[rengC.clave] = rengV
  }
  return rengSal
}

export function rengDecodificarEntradas(rengEscena: RengEscena, rengNumeros: Readonly<Record<string, number>>): RengEntradasSim {
  const rengSal: Record<string, number | string> = {}
  for (const rengC of RENG_MODELOS_ESCENA[rengEscena].campos) {
    const rengV = rengNumeros[rengC.clave]
    if (rengV === undefined) continue
    const rengLista = rengListaDe(rengEscena, rengC.clave)
    if (rengLista) {
      const rengId = Number.isInteger(rengV) ? rengLista[rengV] : undefined
      if (rengId !== undefined) rengSal[rengC.clave] = rengId
    } else rengSal[rengC.clave] = rengV
  }
  return rengSal
}

export function rengModeloCorridaEscena(rengEscena: RengEscena): RengModeloCorrida {
  const rengM = RENG_MODELOS_ESCENA[rengEscena]
  return {
    id: RENG_ID_MODELO_CORRIDA[rengEscena],
    version: rengM.version,
    nombre: `${rengM.nombre}: ${rengM.fenomeno}`.slice(0, 160),
    metodo: [`Ecuaciones: ${rengM.ecuaciones.join('; ')}.`, `Condiciones: ${rengM.condiciones.join(' ')}`, `Especies y fases: ${rengM.especiesFases.join(' ')}`, `Supuestos: ${rengM.supuestos.join(' ')}`, `Dominio: ${rengM.dominio.join(' ')}`].join('\n').slice(0, 19000),
    evidencia: rengM.evidencia,
    verificacion: rengM.verificacion
  }
}

const RENG_MAGNITUDES_CORRIDA: Record<string, string> = {
  acido: 'Ácido (índice en la lista v1: 0 HCl, 1 acético, 2 fosfórico, 3 fluorhídrico, 4 fórmico, 5 amonio)',
  reaccion: 'Reacción (índice en la lista v1 del modelo)',
  quien: 'Especie perturbada (índice)',
  modo: 'Cómo se completa (0 = hasta el aforo, 1 = volumen de disolvente igual al final)',
  sal: 'Sal (índice en la lista v1: 0 CaF₂, 1 Mg(OH)₂, 2 CaCO₃ calcita)',
  ano: 'Semicelda del ánodo propuesta (índice en la lista v1: 0 Zn, 1 Cu, 2 Fe, 3 Mg, 4 Al, 5 H₂)',
  cat: 'Semicelda del cátodo propuesta (índice en la lista v1: 0 Zn, 1 Cu, 2 Fe, 3 Mg, 4 Al, 5 H₂)',
  pareja: 'Pareja de isómeros (índice en la lista v1: 0 but-2-eno Z/E, 1 etanol y éter dimetílico, 2 butano y 2-metilpropano, 3 propan-1-ol y propan-2-ol)',
  atA1: 'Isómero A, átomo 1 (índice en el modelo)',
  atA2: 'Isómero A, átomo 2 (índice en el modelo)',
  atA3: 'Isómero A, átomo 3 (índice en el modelo)',
  atA4: 'Isómero A, átomo 4 (índice en el modelo)',
  atB1: 'Isómero B, átomo 1 (índice en el modelo)',
  atB2: 'Isómero B, átomo 2 (índice en el modelo)',
  atB3: 'Isómero B, átomo 3 (índice en el modelo)',
  atB4: 'Isómero B, átomo 4 (índice en el modelo)'
}

export function rengParametrosCorrida(rengEscena: RengEscena, rengEntradas: RengEntradasSim): RengValorConUnidad[] {
  const rengCod = rengCodificarEntradas(rengEscena, rengEntradas)
  const rengPar: RengValorConUnidad[] = []
  for (const rengC of RENG_MODELOS_ESCENA[rengEscena].campos) {
    const rengV = rengCod[rengC.clave]
    if (rengV === undefined) continue
    rengPar.push({ clave: rengC.clave, nombre: (RENG_MAGNITUDES_CORRIDA[rengC.clave] ?? rengC.etiqueta).slice(0, 160), valor: rengV, unidad: rengC.unidad === 'según el orden' ? '' : rengC.unidad })
  }
  return rengPar
}

export function rengEstadoDeDiagnosticos(rengD: readonly RengDiagnosticoDominio[]): RengEstadoResultado {
  const rengCodigos = new Set(rengD.map((rengX) => rengX.codigo))
  if (rengCodigos.has('entrada')) return 'entrada-invalida'
  if (rengCodigos.has('poliprotico') || rengCodigos.has('balance') || rengCodigos.has('extrapolacion-curva') || rengCodigos.has('iso-formula-distinta')) return 'fuera-de-dominio'
  if (rengCodigos.has('sin-convergencia')) return 'sin-convergencia'
  if (rengCodigos.has('sin-entropia') || rengCodigos.has('ele-falta-ion') || rengCodigos.has('iso-seleccion-insuficiente')) return 'datos-insuficientes'
  return rengD.some((rengX) => rengX.severidad === 'aviso' || rengX.severidad === 'fuera') ? 'aproximacion' : 'calculado'
}

const RENG_MOTIVO_FUERA_COMPARADOR: Partial<Record<RengEstadoResultado, string>> = {
  'entrada-invalida': 'las entradas no son válidas: no hay serie que comparar',
  'fuera-de-dominio': 'parte del resultado cae fuera del dominio del modelo',
  'datos-insuficientes': 'faltan datos del modelo para completar el cálculo',
  'sin-convergencia': 'el cálculo no convergió'
}

const rengFuentes = (rengEscena: RengEscena): string[] => RENG_MODELOS_ESCENA[rengEscena].parametros.map((rengP) => `${rengP.nombre}: ${rengP.valor} — ${rengP.fuente} (${rengP.verificacion === 'consultada' ? 'fuente consultada' : rengP.verificacion === 'libro' ? 'libro de texto, sin consultar' : 'cálculo'})`)

const rengCondiciones = (rengEscena: RengEscena): RengValorConUnidad[] => {
  if (rengEscena === 'dilucion') return []
  if (rengEscena === 'acidobase' || rengEscena === 'mezcla') return [{ clave: 'Tmodelo', nombre: 'Temperatura del modelo (fija)', valor: 25, unidad: '°C' }]
  if (rengEscena === 'electroquimica') return [{ clave: 'Tcelda', nombre: 'Temperatura del modelo (fija)', valor: 298.15, unidad: 'K' }]
  if (rengEscena === 'solubilidad') return [{ clave: 'Ttabla', nombre: 'Temperatura de la tabla de Ksp (fija)', valor: 25, unidad: '°C' }]
  if (rengEscena === 'termo') return [{ clave: 'Tref', nombre: 'Temperatura de referencia de ΔH° y ΔS°', valor: 298.15, unidad: 'K' }]
  return []
}

const rengSerieVacia = (rengColumnas: RengMagnitud[]): RengSerie => ({ columnas: rengColumnas, filas: [] })

export function rengCorridaEscena(rengEscena: RengEscena, rengEntradas: RengEntradasSim): RengDatosCorrida {
  const rengV = rengValidarEntradasSim(rengEscena, rengEntradas)
  const rengModelo = rengModeloCorridaEscena(rengEscena)
  const rengBase = {
    disciplina: 'quimica' as const,
    modelo: rengModelo,
    fuentes: rengFuentes(rengEscena),
    origen: { modulo: RENG_MODULO_CORRIDAS, sub: rengEscena, entradas: {} as Record<string, number> }
  }
  if (!rengV.ok) {
    const rengDiag = [rengV.diagnostico]
    return { ...rengBase, parametros: [], muestreo: 'No se calculó: hay entradas fuera del dominio del modelo o faltan datos.', serie: rengSerieVacia([]), resultados: [], diagnosticos: rengDiag, estado: 'entrada-invalida' }
  }
  const rengEn = rengV.entradas
  if (rengEscena === 'mezcla') {
    const rengDatos = rengCorridaValoracion({ acido: rengEn['acido'] === 'hcl' ? 'hcl' : 'acetico', concentracionAcido: Number(rengEn['cAcido']), volumenAcidoMl: Number(rengEn['VAcido']), concentracionBase: Number(rengEn['cBase']), volumenBaseMl: Number(rengEn['VBase']) })
    const rengExtra = rengDiagnosticosDominio('mezcla', rengEn).map((rengD) => rengD.texto.slice(0, 1900)).filter((rengT) => !rengDatos.diagnosticos.includes(rengT))
    return { ...rengDatos, diagnosticos: [...rengDatos.diagnosticos, ...rengExtra], origen: { ...rengDatos.origen, entradas: { ...rengDatos.origen.entradas } } }
  }
  const rengDiagnosticos = rengDiagnosticosDominio(rengEscena, rengEn)
  const rengResumen = rengResumenEscena(rengEscena, rengEn)
  const rengResultados: RengValorConUnidad[] = [...rengResumen.resultados]
  let rengSerie: RengSerie = rengSerieVacia([])
  let rengMuestreo = ''

  if (rengEscena === 'acidobase') {
    const rengId = String(rengEn['acido'])
    const rengAc = RENG_ACIDOS.find((rengA) => rengA.id === rengId)!
    const rengCa = Number(rengEn['C'])
    const rengVa = Number(rengEn['Va'])
    const rengCb = Number(rengEn['Cb'])
    const rengVb = Number(rengEn['Vb'] ?? 0)
    const rengBal = rengBalancesAcidoBase(rengId, rengCa, rengVa, rengCb, rengVb)
    const rengVeq = (rengCa * rengVa) / rengCb
    const rengVmax = rengId === 'fosforico1' ? rengVeq : Math.max(2 * rengVeq, 2 * rengVb, 1)
    const rengCurva = rengCurvaValoracion(rengCa, rengVa, rengAc.pKa, rengCb, rengVmax, 160)
    rengSerie = { columnas: [{ clave: 'V_NaOH', nombre: 'volumen de NaOH añadido', unidad: 'mL' }, { clave: 'pH', nombre: 'pH', unidad: '' }], filas: rengCurva.map((rengP) => [rengP.V, rengP.pH]) }
    rengResultados.push({ clave: 'resCarga', nombre: 'Residuo relativo del balance de carga (punto de la curva)', valor: rengBal.relativoCarga, unidad: '' }, { clave: 'resMateria', nombre: 'Residuo relativo del balance de materia del ácido (punto de la curva)', valor: rengBal.relativoMateria, unidad: '' }, { clave: 'I', nombre: 'Fuerza iónica estimada (punto de la curva)', valor: rengBal.fuerzaIonica, unidad: 'mol/L' })
    rengMuestreo = `161 volúmenes de NaOH iguales entre 0 y ${Number(rengVmax.toPrecision(5))} mL${rengId === 'fosforico1' ? ' (solo hasta la primera equivalencia)' : ''}. Cada pH es un equilibrio independiente (no hay paso de tiempo).`
  } else if (rengEscena === 'cinetica') {
    const rengO = Number(rengEn['orden']) as RengOrden
    const rengA0 = Number(rengEn['A0'])
    const rengK = Number(rengEn['k'])
    const rengTh = rengVidaMedia(rengO, rengA0, rengK)
    const rengTmax = rengO === 0 ? (1.1 * rengA0) / rengK : 5 * rengTh
    const rengTfin = Math.max(rengTmax, Number(rengEn['t'] ?? 0))
    rengSerie = { columnas: [{ clave: 't', nombre: 'tiempo', unidad: 's' }, { clave: 'A', nombre: 'concentración de A', unidad: 'mol/L' }], filas: Array.from({ length: 121 }, (_, rengI) => { const rengT = (rengTfin * rengI) / 120; return [rengT, rengConcentracion(rengO, rengA0, rengK, rengT)] }) }
    rengMuestreo = `121 instantes iguales entre 0 y ${Number(rengTfin.toPrecision(5))} s${rengO === 0 ? ' (hasta el agotamiento más un 10 %)' : ' (5 semividas)'}. Solución analítica; el reloj de la escena se reabre en pausa.`
  } else if (rengEscena === 'equilibrio') {
    const rengP = RENG_PRESETS_EQ.find((rengX) => rengX.id === rengEn['reaccion'])!
    const rengSal = rengCalcularEscena('equilibrio', rengEn)
    const rengC0 = rengP.esp.map((rengS, rengI) => Number(rengEn[`c0_${rengI}`] ?? rengS.c0))
    let rengPert: number[] | null = null
    if (rengEn['quien'] !== undefined && rengEn['delta'] !== undefined) {
      try {
        rengPert = rengDesplazamientoEquilibrio(rengEn, Number(rengEn['quien']), Number(rengEn['delta'])).despues
      } catch {
        rengPert = null
        rengDiagnosticos.push({ codigo: 'perturbacion', severidad: 'aviso', texto: 'La perturbación pedida no se pudo calcular (se intentó quitar más sustancia de la que hay): se guarda solo el equilibrio inicial.' })
      }
    }
    rengSerie = { columnas: [{ clave: 'especie', nombre: 'índice de especie', unidad: '' }, { clave: 'c0', nombre: 'concentración inicial', unidad: 'mol/L' }, { clave: 'c_eq', nombre: 'concentración en el equilibrio', unidad: 'mol/L' }, ...(rengPert ? [{ clave: 'c_pert', nombre: 'concentración tras la perturbación', unidad: 'mol/L' }] : [])], filas: rengP.esp.map((_rengS, rengI) => [rengI, rengC0[rengI]!, rengSal[`c_${rengI}`]!, ...(rengPert ? [rengPert[rengI]!] : [])]) }
    if (rengPert) rengP.esp.forEach((rengS, rengI) => rengResultados.push({ clave: `cp_${rengI}`, nombre: `[${rengS.nombre}] tras la perturbación`, valor: rengPert![rengI]!, unidad: 'mol/L' }))
    rengMuestreo = 'Una fila por especie (índice en el orden de la reacción). No hay paso de tiempo: son estados de equilibrio.'
  } else if (rengEscena === 'electroquimica') {
    const rengAnalisis = rengAnalizarCeldaEntradas(rengEn)
    const rengSerieN = rengSerieNernst({ anodo: rengSemiceldaCore(rengParRegistrado(String(rengEn['ano']))), catodo: rengSemiceldaCore(rengParRegistrado(String(rengEn['cat']))), cA: Number(rengEn['cA']), cC: Number(rengEn['cC']), F: RENG_FARADAY.valor, R: RENG_R_GASES.valor })
    rengSerie = { columnas: [{ clave: 'log10_cC', nombre: 'log10 de la concentración del ion en el cátodo (mol/L)', unidad: '' }, { clave: 'E', nombre: 'potencial de la celda (Nernst)', unidad: 'V' }], filas: rengSerieN.filas.map((rengF) => [rengF[0], rengF[1]]) }
    rengResultados.push({ clave: 'esp', nombre: 'Espontánea tal como se plantea (1 sí, 0 equilibrio, −1 no)', valor: rengAnalisis.enEquilibrio ? 0 : rengAnalisis.espontanea ? 1 : -1, unidad: '' })
    rengMuestreo = rengSerieN.filas.length > 0 ? `41 concentraciones del ion del cátodo entre 10⁻⁶ y 1 mol/L (escala logarítmica), con la del ánodo fija; cada punto es el potencial de Nernst de la celda. Cálculo directo (sin paso de tiempo). E° de ${RENG_PARES_ELECTRO.length} pares de la tabla que declara 298,15 K y referencia SHE.` : 'Sin serie: falta la concentración del ion del ánodo, así que no hay ecuación de Nernst.'
  } else if (rengEscena === 'solubilidad') {
    const rengSalDef = rengSalRegistrada(String(rengEn['sal']))
    const rengCM = Number(rengEn['cM'])
    const rengCA = Number(rengEn['cA'])
    const rengCurva = rengSerieIonComun(rengSalDef.ksp, rengSalDef.cation.nu, rengSalDef.anion.nu, rengCM, rengCA)
    const rengVariaAnion = rengCurva.ion === 'anion'
    const rengMax = rengCurva.max
    const rengFilas = rengCurva.filas.map((rengF) => [rengF[0], rengF[1]])
    rengSerie = { columnas: [{ clave: 'c_comun', nombre: `concentración del ion común (${rengVariaAnion ? 'anión' : 'catión'})`, unidad: 'mol/L' }, { clave: 's', nombre: 'solubilidad molar', unidad: 'mol/L' }], filas: rengFilas }
    const rengVer = rengSolubilidadVeredictoNumero(rengEn)
    rengResultados.push({ clave: 'ver', nombre: 'Veredicto (1 disuelve, 0 equilibrio, −1 precipita)', valor: rengVer, unidad: '' })
    rengMuestreo = `41 concentraciones del ${rengVariaAnion ? 'anión' : 'catión'} entre 0 y ${Number(rengMax.toPrecision(5))} mol/L, con la otra concentración fija; cada punto es la solubilidad molar de ${rengSalDef.formula} con ese ion común. Cálculo directo (sin paso de tiempo). Ksp de ${rengSalDef.fuente.titulo} (25 °C, fuerza iónica cero).`
  } else if (rengEscena === 'colorimetria') {
    const rengCal = rengCalibrarColorimetria(rengLeerEntradaColorimetria(rengEn))
    rengSerie = { columnas: [{ clave: 'c', nombre: 'concentración del patrón', unidad: 'mg/L' }, { clave: 'a_corr', nombre: 'absorbancia sin el blanco', unidad: '' }, { clave: 'a_ajustada', nombre: 'absorbancia de la recta', unidad: '' }, { clave: 'residuo', nombre: 'residuo', unidad: '' }], filas: rengCal.filas.map((rengF) => [rengF.c, rengF.aCorr, rengF.ajustada, rengF.residuo]) }
    rengMuestreo = `Una fila por patrón (${rengCal.n}), con la absorbancia ya sin el blanco medio (${Number(rengCal.blancoMedio.toPrecision(6))}), la que da la recta y el residuo. ${rengCal.estado === 'interpolada' ? 'La muestra se interpoló dentro del intervalo de los patrones.' : 'La muestra quedó fuera de la curva: no se calculó su concentración.'} Datos didácticos si proceden del ejemplo de la escena.`
  } else if (rengEscena === 'dilucion') {
    const rengVa = Number(rengEn['Va'])
    const rengVf = Number(rengEn['Vf'])
    const rengModo = Number(rengEn['modo']) as RengModoDilucion
    const rengC1 = Number(rengEn['c1'])
    const rengVdisp = Number(rengEn['Vdisp'])
    const rengIni = Math.max(rengVa, RENG_LIMITES_DILUCION.VfMin)
    const rengMax = Math.min(2 * Math.max(rengVf, rengVa), RENG_LIMITES_DILUCION.VfMax)
    const rengFilas: number[][] = []
    for (let rengI = 0; rengI <= 40; rengI++) {
      const rengV = rengIni + ((rengMax - rengIni) * rengI) / 40
      rengFilas.push([rengV, rengDiluir({ c1: rengC1, Va: rengVa, Vf: rengV, modo: rengModo, Vdisp: rengVdisp }).concentracionFinal])
    }
    rengSerie = { columnas: [{ clave: 'Vf', nombre: 'volumen final del matraz', unidad: 'mL' }, { clave: 'c2', nombre: 'concentración final', unidad: 'mol/L' }], filas: rengFilas }
    rengMuestreo = `41 volúmenes finales entre ${Number(rengIni.toPrecision(5))} y ${Number(rengMax.toPrecision(5))} mL con la misma alícuota y concentración inicial. Cálculo directo (sin paso de tiempo).`
  } else if (rengEscena === 'isomeros') {
    const rengCmp = rengCompararIsomerosEntradas(rengEn)
    const rengEt = (rengG: { atomos: ReadonlyArray<{ etiqueta: string }> }, rengSel: readonly number[]): string => (rengSel.length === 0 ? 'ninguno' : rengSel.map((rengI) => `${rengI} = ${rengG.atomos[rengI]!.etiqueta}`).join(', '))
    rengMuestreo = `Sin serie: son medidas puntuales sobre geometrías calculadas, así que esta corrida no entra en el comparador del cuaderno. Átomos medidos (índice = etiqueta del modelo v1): A, ${rengCmp.a.nombre}: ${rengEt(rengCmp.a, rengCmp.seleccion.a)}; B, ${rengCmp.b.nombre}: ${rengEt(rengCmp.b, rengCmp.seleccion.b)}. Procedencia de A: ${rengCmp.a.procedencia.origen}, ${rengCmp.a.procedencia.metodo}; de B: ${rengCmp.b.procedencia.origen}, ${rengCmp.b.procedencia.metodo}. Las coordenadas no se guardan: se recalculan al reabrir.`
  } else if (rengEscena === 'termo') {
    const rengR = RENG_REACCIONES_TERMO.find((rengX) => rengX.id === rengEn['reaccion'])!.r
    const rengDH = rengEntalpiaReaccion(rengR)
    const rengDS = rengEntropiaReaccion(rengR)
    if (rengDS === null) {
      rengMuestreo = 'Sin serie: falta S° de alguna sustancia, no se calcula ΔG(T).'
    } else {
      rengSerie = { columnas: [{ clave: 'T', nombre: 'temperatura', unidad: 'K' }, { clave: 'dG', nombre: 'ΔG de la reacción', unidad: 'kJ' }], filas: Array.from({ length: 61 }, (_, rengI) => { const rengT = 200 + rengI * 20; return [rengT, rengEnergiaLibre(rengDH, rengDS, rengT)] }) }
      rengMuestreo = '61 temperaturas entre 200 y 1400 K con ΔH° y ΔS° de 298,15 K constantes (extrapolación fuera de 298 K).'
    }
  }
  const rengEstado = rengEstadoDeDiagnosticos(rengDiagnosticos)
  const rengDiagTextos = rengDiagnosticos.map((rengD) => rengD.texto.slice(0, 1900))
  const rengMotivo = RENG_MOTIVO_FUERA_COMPARADOR[rengEstado]
  if (rengMotivo) rengDiagTextos.push(`No entra en el comparador del cuaderno: ${rengMotivo}.`)
  return {
    ...rengBase,
    parametros: [...rengParametrosCorrida(rengEscena, rengEn), ...rengCondiciones(rengEscena)],
    muestreo: rengMuestreo,
    serie: rengSerie,
    resultados: rengResultados,
    diagnosticos: rengDiagTextos,
    estado: rengEstado,
    origen: { ...rengBase.origen, entradas: rengCodificarEntradas(rengEscena, rengEn) }
  }
}

export function rengEntradasDeCorrida(rengEscena: RengEscena, rengNumeros: Readonly<Record<string, number>>): { entradas: RengEntradasSim; avisos: string[] } {
  const rengAvisos: string[] = []
  const rengDec = rengDecodificarEntradas(rengEscena, rengNumeros)
  const rengCompleto: Record<string, number | string> = { ...rengBaseEntradas(rengEscena), ...rengDec }
  const rengPorDefecto = rengEntradasPorDefecto(rengEscena)
  for (const rengC of RENG_MODELOS_ESCENA[rengEscena].campos) {
    if (!rengC.requerido || rengDec[rengC.clave] !== undefined) continue
    rengCompleto[rengC.clave] = rengPorDefecto[rengC.clave]!
    rengAvisos.push(`La corrida no traía «${rengC.etiqueta}»: se usó el valor por defecto (${String(rengPorDefecto[rengC.clave])}).`)
  }
  return { entradas: rengCompleto, avisos: rengAvisos }
}

export const rengTextoVersionModelo = (rengEscena: RengEscena, rengVersionGuardada: string): string | null => {
  const rengActual = RENG_MODELOS_ESCENA[rengEscena].version
  return rengVersionGuardada === rengActual ? null : `La corrida se guardó con la versión ${rengVersionGuardada} del modelo y esta app usa la ${rengActual}: sus resultados guardados no cambian, pero al repetirla se calculará con la versión ${rengActual}.`
}


const rengSolubilidadVeredictoNumero = (rengE: RengEntradasSim): number => {
  const rengV = rengAnalizarSolubilidadEntradas(rengE).veredicto
  return rengV === 'disuelve' ? 1 : rengV === 'equilibrio' ? 0 : -1
}
