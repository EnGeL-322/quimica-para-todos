import type { RengNivelEvidencia } from '@shared/cuaderno'
import { RENG_SUSTANCIAS, type RengSustanciaCatalogo } from '../../tabla-periodica/catalogoSustancias'
import type { RengFormaPeligro, RengNivelPeligro, RengTipoPeligro } from '../../tabla-periodica/peligros'
import { rengSalRegistrada } from '../datos/solubilidad'
import { RENG_LIMITES_DILUCION, RENG_SOLUCIONES_DILUCION, rengDiluir, rengLeerMagnitudDilucion } from '../nucleo/dilucion'
import { rengAnalizarFormula, rengMasaMolarDe } from '../nucleo/formula'
import { RENG_LIMITES_SOLUBILIDAD, rengAnalizarSolubilidad } from '../nucleo/solubilidad'
import { RENG_MODELOS_ESCENA, type RengEscena } from './modelosSimulacion'
import { rengSepararNumeroUnidad } from './numeros'

export const RENG_MENSAJE_SIN_MODELO = 'No hay datos o modelo para predecir esta mezcla'
export const RENG_MAX_SUSTANCIAS_MESA = 4
export const RENG_VOLUMEN_AGUA_ML = { min: RENG_LIMITES_DILUCION.VfMin, max: RENG_LIMITES_DILUCION.VfMax } as const

export type RengMotivoFicha = 'peligro' | 'atencion' | 'documentado' | 'indicaciones' | 'sin-ficha'

export type RengPoliticaMesa = { puedePonerse: true; alcances: readonly string[] } | { puedePonerse: false; motivo: RengMotivoFicha; explicacion: string }

const RENG_TIPOS_TOLERADOS_SIN_CLASIFICAR: readonly RengTipoPeligro[] = ['irritacion']

export function rengPoliticaMesa(rengFormas: readonly RengFormaPeligro[]): RengPoliticaMesa {
  const rengRegistros = rengFormas.flatMap((rengF) => rengF.registros.map((rengR) => ({ forma: rengF, registro: rengR })))
  if (rengRegistros.length === 0) return { puedePonerse: false, motivo: 'sin-ficha', explicacion: 'El catálogo de peligros no tiene ninguna ficha contrastada de esta sustancia. Sin ese dato no se puede poner en la mesa: solo se ofrece su ficha de consulta.' }
  const rengCon = (rengNivel: string): { forma: RengFormaPeligro; registro: (typeof rengRegistros)[number]['registro'] } | undefined => rengRegistros.find((rengX) => rengX.registro.nivel === rengNivel)
  const rengPeligro = rengCon('peligro')
  if (rengPeligro) return { puedePonerse: false, motivo: 'peligro', explicacion: `Clasificada como «Peligro» por ${rengPeligro.registro.fuente.organismo} (${rengPeligro.registro.fuente.alcance}). Las sustancias peligrosas solo se consultan: no se ponen en la mesa, no se mezclan ni se predicen.` }
  const rengAtencion = rengCon('atencion')
  if (rengAtencion) return { puedePonerse: false, motivo: 'atencion', explicacion: `Clasificada como «Atención» por ${rengAtencion.registro.fuente.organismo} (${rengAtencion.registro.fuente.alcance}). Las sustancias con clasificación de peligro solo se consultan.` }
  const rengDocumentado = rengCon('documentado')
  if (rengDocumentado) return { puedePonerse: false, motivo: 'documentado', explicacion: `Tiene peligros documentados en ${rengDocumentado.registro.fuente.organismo} (${rengDocumentado.registro.fuente.alcance}). Solo se ofrece su ficha de consulta.` }
  const rengOtra = rengRegistros.flatMap((rengX) => rengX.registro.indicaciones.map((rengI) => ({ rengI, rengX }))).find(({ rengI }) => !RENG_TIPOS_TOLERADOS_SIN_CLASIFICAR.includes(rengI.tipo))
  if (rengOtra) return { puedePonerse: false, motivo: 'indicaciones', explicacion: `Aunque la fuente no la clasifica, su ficha recoge una indicación de ${rengOtra.rengI.tipo} (${rengOtra.rengX.registro.fuente.alcance}). Solo se ofrece su ficha de consulta.` }
  return { puedePonerse: true, alcances: rengRegistros.map((rengX) => rengX.registro.fuente.alcance) }
}

const RENG_GRAVEDAD_NIVEL: Readonly<Record<string, number>> = { 'no-clasificado': 1, documentado: 2, atencion: 3, peligro: 4 }

export function rengNivelMasAltoMesa(rengFormas: readonly RengFormaPeligro[]): RengNivelPeligro {
  let rengMejor: RengNivelPeligro = 'insuficiente'
  for (const rengR of rengFormas.flatMap((rengF) => rengF.registros)) if ((RENG_GRAVEDAD_NIVEL[rengR.nivel] ?? 0) > (RENG_GRAVEDAD_NIVEL[rengMejor] ?? 0)) rengMejor = rengR.nivel
  return rengMejor
}

export type RengRolMesa = { rol: 'disolvente' } | { rol: 'solucion'; solucionId: string } | { rol: 'sal'; salId: string }

export const RENG_ROLES_MESA: Readonly<Record<string, RengRolMesa>> = {
  agua: { rol: 'disolvente' },
  'cloruro-de-sodio': { rol: 'solucion', solucionId: 'nacl' },
  glucosa: { rol: 'solucion', solucionId: 'glucosa' },
  'carbonato-de-calcio': { rol: 'sal', salId: 'caco3' }
}

const RENG_SUBINDICES: Readonly<Record<string, string>> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' }
const rengSinSubindices = (rengS: string): string => [...rengS].map((rengC) => RENG_SUBINDICES[rengC] ?? rengC).join('')

const rengClaveFormulaMesa = (rengF: string): string => {
  const rengA = rengAnalizarFormula(rengSinSubindices(rengF))
  return [...rengA.atomos.entries()].sort(([rengX], [rengY]) => rengX.localeCompare(rengY)).map(([rengE, rengN]) => `${rengE}${rengN}`).join('')
}

export function rengVerificarRolesMesa(rengRoles: Readonly<Record<string, RengRolMesa>> = RENG_ROLES_MESA, rengCatalogo: readonly RengSustanciaCatalogo[] = RENG_SUSTANCIAS): void {
  for (const [rengId, rengRol] of Object.entries(rengRoles)) {
    const rengS = rengCatalogo.find((rengX) => rengX.id === rengId)
    if (!rengS) throw new RangeError(`El rol de «${rengId}» apunta a una sustancia que no está en el catálogo.`)
    if (rengRol.rol === 'disolvente' && rengClaveFormulaMesa(rengS.formula) !== rengClaveFormulaMesa('H2O')) throw new RangeError(`«${rengId}» no es agua, pero se declara como disolvente.`)
    if (rengRol.rol === 'solucion') {
      const rengSol = RENG_SOLUCIONES_DILUCION.find((rengX) => rengX.id === rengRol.solucionId)
      if (!rengSol) throw new RangeError(`«${rengId}» cita la disolución «${rengRol.solucionId}», que Dilución no tiene.`)
      if (rengClaveFormulaMesa(rengSol.soluto) !== rengClaveFormulaMesa(rengS.formula)) throw new RangeError(`«${rengId}» (${rengS.formula}) no coincide con el soluto de la disolución «${rengSol.id}» (${rengSol.soluto}).`)
    }
    if (rengRol.rol === 'sal') {
      const rengSal = rengSalRegistrada(rengRol.salId)
      if (rengClaveFormulaMesa(rengSal.formula) !== rengClaveFormulaMesa(rengS.formula)) throw new RangeError(`«${rengId}» (${rengS.formula}) no coincide con la sal «${rengSal.id}» (${rengSal.formula}).`)
    }
  }
}

rengVerificarRolesMesa()

export interface RengItemMesa {
  sustanciaId: string
  cantidad: string
  concentracion?: string
}

export interface RengDiagnosticoMesa {
  codigo: string
  severidad: 'error' | 'aviso' | 'info'
  texto: string
  sustanciaId?: string
}

export type RengVerificacionDato = 'consultada' | 'libro' | 'calculo' | 'ejemplo' | 'usuario'

export interface RengDatoRespaldo {
  nombre: string
  valor: string
  fuente: string
  verificacion: RengVerificacionDato
  sinVerificar: boolean
}

export interface RengRespaldoMesa {
  escena: RengEscena
  nombreEscena: string
  evidencia: RengNivelEvidencia
  verificacionModelo: string
  datos: RengDatoRespaldo[]
  limites: readonly string[]
}

export interface RengLineaResultado {
  clave: string
  etiqueta: string
  valor: number
  unidad: string
}

export type RengResultadoMesa =
  | { tipo: 'incompleta'; diagnosticos: RengDiagnosticoMesa[] }
  | { tipo: 'rechazada'; diagnosticos: RengDiagnosticoMesa[] }
  | { tipo: 'sin-modelo'; mensaje: typeof RENG_MENSAJE_SIN_MODELO; porQue: string }
  | { tipo: 'entrada-invalida'; diagnosticos: RengDiagnosticoMesa[] }
  | { tipo: 'prediccion'; escena: RengEscena; titulo: string; descripcion: string; estado: 'diluida' | 'todo-disuelto' | 'saturada'; resultados: RengLineaResultado[]; diagnosticos: RengDiagnosticoMesa[]; respaldo: RengRespaldoMesa }

const rengDato = (rengNombre: string, rengValor: string, rengFuente: string, rengVerificacion: RengVerificacionDato): RengDatoRespaldo => ({ nombre: rengNombre, valor: rengValor, fuente: rengFuente, verificacion: rengVerificacion, sinVerificar: rengVerificacion !== 'consultada' && rengVerificacion !== 'calculo' && rengVerificacion !== 'usuario' })

const rengRespaldo = (rengEscena: RengEscena, rengDatos: RengDatoRespaldo[]): RengRespaldoMesa => {
  const rengM = RENG_MODELOS_ESCENA[rengEscena]
  return { escena: rengEscena, nombreEscena: rengM.nombre, evidencia: rengM.evidencia, verificacionModelo: rengM.verificacion, datos: rengDatos, limites: rengM.limites }
}

export type RengMagnitudMesa = 'volumen' | 'concentracion' | 'masa-o-moles'

type RengLecturaMesa = { ok: true; valor: number; unidad: string } | { ok: false; diagnostico: RengDiagnosticoMesa }

const RENG_UNIDADES_MASA: Readonly<Record<string, number>> = { g: 1, mg: 1e-3, kg: 1e3, 'µg': 1e-6, ug: 1e-6, 'μg': 1e-6 }
const RENG_UNIDADES_MOLES: Readonly<Record<string, number>> = { mol: 1, mmol: 1e-3, 'µmol': 1e-6, umol: 1e-6, 'μmol': 1e-6 }

export function rengLeerCantidadMesa(rengTexto: string, rengMagnitud: RengMagnitudMesa, rengSustanciaId?: string): RengLecturaMesa {
  const rengError = (rengCodigo: string, rengTextoError: string): RengLecturaMesa => ({ ok: false, diagnostico: { codigo: rengCodigo, severidad: 'error', texto: rengTextoError, ...(rengSustanciaId ? { sustanciaId: rengSustanciaId } : {}) } })
  const rengL = rengSepararNumeroUnidad(rengTexto)
  if (!rengL.ok) return rengL.motivo === 'vacio' ? rengError('mesa-sin-valor', 'Escribe un valor con su unidad.') : rengError('mesa-ilegible', `No se entiende «${rengTexto.trim()}» como número con unidad.`)
  if (rengL.unidad === '') return rengError('mesa-sin-unidad', `«${rengTexto.trim()}» no tiene unidad: escríbela, por ejemplo ${rengMagnitud === 'volumen' ? '25 mL' : rengMagnitud === 'concentracion' ? '0,2 mol/L' : '0,10 g o 1 mmol'}.`)
  if (rengMagnitud === 'masa-o-moles') {
    const rengFm = RENG_UNIDADES_MASA[rengL.unidad]
    const rengFn = RENG_UNIDADES_MOLES[rengL.unidad]
    if (rengFm === undefined && rengFn === undefined) return rengError('mesa-unidad-incompatible', `«${rengTexto.trim()}» no es una masa ni una cantidad de sustancia: usa g, mg, kg, mol o mmol.`)
    return { ok: true, valor: rengL.valor * (rengFm ?? rengFn!), unidad: rengFm !== undefined ? 'g' : 'mol' }
  }
  const rengR = rengLeerMagnitudDilucion(rengTexto, rengMagnitud)
  if (!rengR.ok) return rengError(rengR.motivo === 'unidad-incompatible' ? 'mesa-unidad-incompatible' : rengR.motivo === 'vacio' ? 'mesa-sin-valor' : 'mesa-ilegible', rengR.mensaje)
  return { ok: true, valor: rengR.valor, unidad: rengMagnitud === 'volumen' ? 'mL' : 'mol/L' }
}

const rengFmt = (rengX: number): string => String(Number(rengX.toPrecision(4))).replace('.', ',')

function rengFueraDeDominio(rengNombre: string, rengValor: number, rengMin: number, rengMax: number, rengUnidad: string, rengSustanciaId: string): RengDiagnosticoMesa | null {
  if (Number.isFinite(rengValor) && rengValor >= rengMin && rengValor <= rengMax) return null
  return { codigo: 'mesa-fuera-de-dominio', severidad: 'error', texto: `${rengNombre} debe estar entre ${rengFmt(rengMin)} y ${rengFmt(rengMax)} ${rengUnidad} (el rango de la escena que respalda esta mezcla); has puesto ${Number.isFinite(rengValor) ? rengFmt(rengValor) : 'un valor no finito'} ${rengUnidad}.`, sustanciaId: rengSustanciaId }
}

export const rengNombreSustancia = (rengId: string, rengCatalogo: readonly RengSustanciaCatalogo[] = RENG_SUSTANCIAS): string => rengCatalogo.find((rengS) => rengS.id === rengId)?.nombre ?? rengId

export const rengConcentracionPorDefecto = (rengId: string, rengRoles: Readonly<Record<string, RengRolMesa>> = RENG_ROLES_MESA): number | null => {
  const rengRol = rengRoles[rengId]
  return rengRol?.rol === 'solucion' ? (RENG_SOLUCIONES_DILUCION.find((rengS) => rengS.id === rengRol.solucionId)?.concentracion ?? null) : null
}

const rengTextoMol = (rengX: number): string => String(rengX).replace('.', ',')

export function rengTextoConcentracionPorDefecto(rengId: string): string {
  const rengC = rengConcentracionPorDefecto(rengId)
  return rengC === null ? '' : `${rengTextoMol(rengC)} mol/L`
}

function rengPredecirDilucion(rengSolucion: RengItemMesa, rengAgua: RengItemMesa, rengRoles: Readonly<Record<string, RengRolMesa>>): RengResultadoMesa {
  const rengRol = rengRoles[rengSolucion.sustanciaId] as { rol: 'solucion'; solucionId: string }
  const rengCatalogoSol = RENG_SOLUCIONES_DILUCION.find((rengS) => rengS.id === rengRol.solucionId)!
  const rengDiag: RengDiagnosticoMesa[] = []
  const rengVs = rengLeerCantidadMesa(rengSolucion.cantidad, 'volumen', rengSolucion.sustanciaId)
  const rengCt = rengLeerCantidadMesa(rengSolucion.concentracion ?? '', 'concentracion', rengSolucion.sustanciaId)
  const rengVa = rengLeerCantidadMesa(rengAgua.cantidad, 'volumen', rengAgua.sustanciaId)
  for (const rengLect of [rengVs, rengCt, rengVa]) if (!rengLect.ok) rengDiag.push(rengLect.diagnostico)
  if (!rengVs.ok || !rengCt.ok || !rengVa.ok) return { tipo: 'entrada-invalida', diagnosticos: rengDiag }
  const rengLim = RENG_LIMITES_DILUCION
  for (const rengD of [
    rengFueraDeDominio('El volumen de la disolución', rengVs.valor, rengLim.VaMin, rengLim.VaMax, 'mL', rengSolucion.sustanciaId),
    rengFueraDeDominio('La concentración de la disolución', rengCt.valor, rengLim.c1Min, rengLim.c1Max, 'mol/L', rengSolucion.sustanciaId),
    rengFueraDeDominio('El volumen de agua', rengVa.valor, RENG_VOLUMEN_AGUA_ML.min, RENG_VOLUMEN_AGUA_ML.max, 'mL', rengAgua.sustanciaId)
  ]) if (rengD) rengDiag.push(rengD)
  if (rengDiag.length) return { tipo: 'entrada-invalida', diagnosticos: rengDiag }
  const rengR = rengDiluir({ c1: rengCt.valor, Va: rengVs.valor, Vf: rengVa.valor, modo: 1, Vdisp: rengVs.valor })
  const rengEsEjemplo = Math.abs(rengCt.valor - rengCatalogoSol.concentracion) <= 1e-12 * rengCatalogoSol.concentracion
  const rengDatos = [
    rengEsEjemplo
      ? rengDato(`Concentración de ${rengCatalogoSol.nombre}`, `${rengTextoMol(rengCatalogoSol.concentracion)} mol/L`, 'Valor didáctico de ejemplo elegido para el montaje de Dilución; no es un dato publicado ni se contrastó con ninguna fuente', 'ejemplo')
      : rengDato(`Concentración de ${rengCatalogoSol.nombre}`, `${rengFmt(rengCt.valor)} mol/L`, 'Valor que escribiste tú', 'usuario'),
    rengDato('Conservación del soluto y c₂ = n / V_total', 'n = c₁·V; c₂ = n / (V_disolución + V_agua)', 'Ecuación estándar de dilución; la escena la contrasta con un cálculo independiente (no se comparó con mediciones)', 'calculo'),
    rengDato('Volúmenes aditivos', 'V_total = V_disolución + V_agua', 'Suposición declarada en la ficha de Dilución (modo «volumen de disolvente igual al final»); no se midió', 'libro')
  ]
  return {
    tipo: 'prediccion',
    escena: 'dilucion',
    titulo: 'Dilución de una disolución con agua',
    descripcion: `${rengFmt(rengVs.valor)} mL de ${rengCatalogoSol.nombre} + ${rengFmt(rengVa.valor)} mL de agua`,
    estado: 'diluida',
    resultados: [
      { clave: 'n', etiqueta: 'Soluto presente (se conserva)', valor: rengR.molesFinales, unidad: 'mol' },
      { clave: 'Vtotal', etiqueta: 'Volumen total (aditivo)', valor: rengR.volumenTotalMl, unidad: 'mL' },
      { clave: 'c2', etiqueta: 'Concentración final', valor: rengR.concentracionFinal, unidad: 'mol/L' },
      { clave: 'F', etiqueta: 'Factor de dilución', valor: rengR.factor, unidad: '' }
    ],
    diagnosticos: [{ codigo: 'mesa-volumenes-aditivos', severidad: 'info', texto: 'Se suponen volúmenes aditivos y que el soluto no reacciona ni se pierde.' }],
    respaldo: rengRespaldo('dilucion', rengDatos)
  }
}

function rengPredecirSolubilidad(rengSalItem: RengItemMesa, rengAgua: RengItemMesa, rengRoles: Readonly<Record<string, RengRolMesa>>): RengResultadoMesa {
  const rengRol = rengRoles[rengSalItem.sustanciaId] as { rol: 'sal'; salId: string }
  const rengSal = rengSalRegistrada(rengRol.salId)
  const rengDiag: RengDiagnosticoMesa[] = []
  const rengQ = rengLeerCantidadMesa(rengSalItem.cantidad, 'masa-o-moles', rengSalItem.sustanciaId)
  const rengVa = rengLeerCantidadMesa(rengAgua.cantidad, 'volumen', rengAgua.sustanciaId)
  if (!rengQ.ok) rengDiag.push(rengQ.diagnostico)
  if (!rengVa.ok) rengDiag.push(rengVa.diagnostico)
  if (!rengQ.ok || !rengVa.ok) return { tipo: 'entrada-invalida', diagnosticos: rengDiag }
  const rengMasaMolar = rengMasaMolarDe(rengSinSubindices(rengSal.formula))
  const rengMoles = rengQ.unidad === 'g' ? rengQ.valor / rengMasaMolar : rengQ.valor
  const rengLitros = rengVa.valor / 1000
  const rengSolido = rengMoles / rengLitros
  const rengD = rengFueraDeDominio('El volumen de agua', rengVa.valor, RENG_VOLUMEN_AGUA_ML.min, RENG_VOLUMEN_AGUA_ML.max, 'mL', rengAgua.sustanciaId)
  if (rengD) rengDiag.push(rengD)
  if (!(rengMoles > 0) || !Number.isFinite(rengMoles)) rengDiag.push({ codigo: 'mesa-fuera-de-dominio', severidad: 'error', texto: `La cantidad de ${rengSal.nombre} debe ser mayor que 0.`, sustanciaId: rengSalItem.sustanciaId })
  else if (!rengD && rengSolido > RENG_LIMITES_SOLUBILIDAD.solidoMax) rengDiag.push({ codigo: 'mesa-fuera-de-dominio', severidad: 'error', texto: `Eso son ${rengFmt(rengSolido)} mol de sólido por litro de agua: la escena de Solubilidad admite como máximo ${rengFmt(RENG_LIMITES_SOLUBILIDAD.solidoMax)} mol/L.`, sustanciaId: rengSalItem.sustanciaId })
  if (rengDiag.length) return { tipo: 'entrada-invalida', diagnosticos: rengDiag }
  const rengA = rengAnalizarSolubilidad({ ksp: rengSal.ksp, nuM: rengSal.cation.nu, nuA: rengSal.anion.nu, zM: rengSal.cation.carga, zA: rengSal.anion.carga, cM: 0, cA: 0, solido: rengSolido, nombreM: rengSal.cation.formula, nombreA: rengSal.anion.formula })
  const rengDiagEscena: RengDiagnosticoMesa[] = rengA.diagnosticos.map((rengX) => ({ codigo: rengX.codigo, severidad: rengX.severidad === 'info' ? 'info' : 'aviso', texto: rengX.texto }))
  if (rengSal.hidrolisis === 'aviso') rengDiagEscena.push({ codigo: 'mesa-hidrolisis', severidad: 'aviso', texto: rengSal.notaModelo })
  const rengOtros = rengSal.otrasConValor.map((rengO) => rengO.ksp)
  const rengMax = Math.max(rengSal.ksp, ...rengOtros)
  const rengMin = Math.min(rengSal.ksp, ...rengOtros)
  if (rengOtros.length && rengMax / rengMin > 1.5) rengDiagEscena.push({ codigo: 'mesa-ksp-discrepa', severidad: 'aviso', texto: `Otras tablas abiertas dan Ksp distintos (${rengSal.otrasConValor.map((rengO) => `${rengO.fuente.titulo}: ${String(rengO.ksp).replace('e-', ' × 10^-').replace('.', ',')}`).join('; ')}): hasta un factor ${String(Number((rengMax / rengMin).toPrecision(2))).replace('.', ',')} entre tablas. Esa incertidumbre no se propaga.` })
  const rengDisuelto = rengA.disuelto
  const rengDatos = [
    rengDato(`Ksp de ${rengSal.formula} (${rengSal.solido}) a ${rengSal.fuente.temperaturaC} °C`, rengSal.kspTexto, `${rengSal.fuente.titulo}, ${rengSal.fuente.url} · consultada ${rengSal.fuente.consultada} · fragmento citado por una herramienta de lectura, no la página entera · fuerza iónica: ${rengSal.fuente.fuerzaIonica} · licencia: ${rengSal.fuente.licencia}`, 'consultada'),
    rengDato(`Masa molar de ${rengSal.formula}`, `${rengFmt(rengMasaMolar)} g/mol`, 'Suma de las masas atómicas de la tabla periódica de la app; no se contrastó aquí con IUPAC', 'libro'),
    rengDato('Fórmulas del equilibrio de solubilidad', 's₀ = √Ksp (1:1); Q = [M][A]', 'Álgebra estándar de química analítica; no se consultó una obra concreta', 'libro'),
    rengDato('Agua pura sin otros iones', '[Ca²⁺] = [CO₃²⁻] = 0 al empezar', 'Lo que pusiste en la mesa: solo CaCO₃ y agua', 'usuario')
  ]
  return {
    tipo: 'prediccion',
    escena: 'solubilidad',
    titulo: `Solubilidad de ${rengSal.nombre.charAt(0).toLowerCase()}${rengSal.nombre.slice(1)} en agua`,
    descripcion: `${rengFmt(rengQ.valor)} ${rengQ.unidad} de ${rengSal.formula} en ${rengFmt(rengVa.valor)} mL de agua`,
    estado: rengSolido <= rengA.s0 * (1 + 1e-12) ? 'todo-disuelto' : 'saturada',
    resultados: [
      { clave: 'solido0', etiqueta: 'Sólido puesto', valor: rengSolido, unidad: 'mol/L' },
      { clave: 's0', etiqueta: 'Solubilidad en agua pura', valor: rengA.s0, unidad: 'mol/L' },
      { clave: 'disuelto', etiqueta: 'Se disuelve', valor: rengDisuelto, unidad: 'mol/L' },
      { clave: 'masaDisuelta', etiqueta: 'Masa que se disuelve', valor: rengDisuelto * rengLitros * rengMasaMolar * 1000, unidad: 'mg' },
      { clave: 'solidoFinal', etiqueta: 'Sólido que queda', valor: rengA.solidoFinal, unidad: 'mol/L' },
      { clave: 'I', etiqueta: 'Fuerza iónica estimada', valor: rengA.fuerzaIonica, unidad: 'mol/L' }
    ],
    diagnosticos: rengDiagEscena,
    respaldo: rengRespaldo('solubilidad', rengDatos)
  }
}

export function rengPredecirMesa(rengItems: readonly RengItemMesa[], rengCatalogo: readonly RengSustanciaCatalogo[] = RENG_SUSTANCIAS, rengRoles: Readonly<Record<string, RengRolMesa>> = RENG_ROLES_MESA): RengResultadoMesa {
  if (rengItems.length === 0) return { tipo: 'incompleta', diagnosticos: [{ codigo: 'mesa-vacia', severidad: 'info', texto: 'La mesa está vacía: pon al menos dos sustancias.' }] }
  const rengRechazos: RengDiagnosticoMesa[] = []
  const rengVistos = new Set<string>()
  const rengRepetidos = new Set<string>()
  for (const rengItem of rengItems) {
    if (rengVistos.has(rengItem.sustanciaId)) rengRepetidos.add(rengItem.sustanciaId)
    rengVistos.add(rengItem.sustanciaId)
  }
  for (const rengId of rengRepetidos) rengRechazos.push({ codigo: 'mesa-repetida', severidad: 'error', texto: `«${rengNombreSustancia(rengId, rengCatalogo)}» está más de una vez en la mesa. Cada sustancia va una sola vez, con su cantidad.`, sustanciaId: rengId })
  if (rengItems.length > RENG_MAX_SUSTANCIAS_MESA) rengRechazos.push({ codigo: 'mesa-demasiadas', severidad: 'error', texto: `La mesa admite como máximo ${RENG_MAX_SUSTANCIAS_MESA} sustancias.` })
  for (const rengId of rengVistos) {
    const rengS = rengCatalogo.find((rengX) => rengX.id === rengId)
    if (!rengS) {
      rengRechazos.push({ codigo: 'mesa-desconocida', severidad: 'error', texto: `«${rengId}» no es una sustancia del catálogo.`, sustanciaId: rengId })
      continue
    }
    const rengP = rengPoliticaMesa(rengS.formas)
    if (!rengP.puedePonerse) rengRechazos.push({ codigo: 'mesa-peligrosa', severidad: 'error', texto: `«${rengS.nombre}» no puede estar en la mesa. ${rengP.explicacion}`, sustanciaId: rengId })
  }
  if (rengRechazos.length) return { tipo: 'rechazada', diagnosticos: rengRechazos }
  if (rengItems.length === 1) return { tipo: 'incompleta', diagnosticos: [{ codigo: 'mesa-una-sola', severidad: 'info', texto: 'Una sola sustancia no es una mezcla: pon al menos dos.' }] }
  const rengConRol = rengItems.map((rengI) => ({ item: rengI, rol: rengRoles[rengI.sustanciaId] }))
  const rengSolucion = rengConRol.filter((rengX) => rengX.rol?.rol === 'solucion')
  const rengSal = rengConRol.filter((rengX) => rengX.rol?.rol === 'sal')
  const rengAgua = rengConRol.filter((rengX) => rengX.rol?.rol === 'disolvente')
  if (rengItems.length === 2 && rengAgua.length === 1 && rengSolucion.length === 1) return rengPredecirDilucion(rengSolucion[0]!.item, rengAgua[0]!.item, rengRoles)
  if (rengItems.length === 2 && rengAgua.length === 1 && rengSal.length === 1) return rengPredecirSolubilidad(rengSal[0]!.item, rengAgua[0]!.item, rengRoles)
  const rengSinEscena = rengConRol.filter((rengX) => !rengX.rol).map((rengX) => rengNombreSustancia(rengX.item.sustanciaId, rengCatalogo))
  const rengPorQue = rengSinEscena.length
    ? `Ninguna escena validada incluye ${rengSinEscena.join(', ')}.`
    : 'Ninguna escena validada combina estas sustancias de esta forma: Dilución admite una disolución más agua y Solubilidad una sal poco soluble más agua.'
  return { tipo: 'sin-modelo', mensaje: RENG_MENSAJE_SIN_MODELO, porQue: rengPorQue }
}

export function rengPonerEnMesa(rengItems: readonly RengItemMesa[], rengId: string, rengCatalogo: readonly RengSustanciaCatalogo[] = RENG_SUSTANCIAS): { ok: true; items: RengItemMesa[] } | { ok: false; diagnostico: RengDiagnosticoMesa } {
  const rengS = rengCatalogo.find((rengX) => rengX.id === rengId)
  if (!rengS) return { ok: false, diagnostico: { codigo: 'mesa-desconocida', severidad: 'error', texto: `«${rengId}» no es una sustancia del catálogo.`, sustanciaId: rengId } }
  const rengP = rengPoliticaMesa(rengS.formas)
  if (!rengP.puedePonerse) return { ok: false, diagnostico: { codigo: 'mesa-peligrosa', severidad: 'error', texto: `«${rengS.nombre}» no puede estar en la mesa. ${rengP.explicacion}`, sustanciaId: rengId } }
  if (rengItems.some((rengI) => rengI.sustanciaId === rengId)) return { ok: false, diagnostico: { codigo: 'mesa-repetida', severidad: 'error', texto: `«${rengS.nombre}» ya está en la mesa. Cada sustancia va una sola vez, con su cantidad.`, sustanciaId: rengId } }
  if (rengItems.length >= RENG_MAX_SUSTANCIAS_MESA) return { ok: false, diagnostico: { codigo: 'mesa-demasiadas', severidad: 'error', texto: `La mesa admite como máximo ${RENG_MAX_SUSTANCIAS_MESA} sustancias.` } }
  const rengConc = rengTextoConcentracionPorDefecto(rengId)
  return { ok: true, items: [...rengItems, { sustanciaId: rengId, cantidad: '', ...(rengConc ? { concentracion: rengConc } : {}) }] }
}
