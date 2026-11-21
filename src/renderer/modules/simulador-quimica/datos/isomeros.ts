import { RENG_BANCO_ESTEREO, RENG_NUMERO_ISOMEROS } from '../practica/bancos'
import { rengModeloDeSmiles, type RengModeloVisor } from '../nucleo/modeloVisor'
import { rengDescriptoresCIP, rengDesdeSmiles, rengIdCanonico } from '../nucleo/molecula'
import type { RengGeometriaIsomero, RengProcedenciaIso } from '../nucleo/isomeros'

export type RengTipoIsomeria = 'geométrica (cis/trans)' | 'de función' | 'de esqueleto' | 'de posición'

export interface RengMiembroIsomero {
  smiles: string
  nombre: string
}

export interface RengParIsomeros {
  id: string
  titulo: string
  tipo: RengTipoIsomeria
  formula: string
  a: RengMiembroIsomero
  b: RengMiembroIsomero
  seleccionInicial: { a: readonly number[]; b: readonly number[] }
  pista: string
  banco: string
}

export const RENG_PAREJAS_ISO: readonly RengParIsomeros[] = [
  {
    id: 'buteno',
    titulo: '(Z)- y (E)-but-2-eno',
    tipo: 'geométrica (cis/trans)',
    formula: 'C4H8',
    a: { smiles: 'C/C=C\\C', nombre: '(Z)-but-2-eno (cis)' },
    b: { smiles: 'C/C=C/C', nombre: '(E)-but-2-eno (trans)' },
    seleccionInicial: { a: [0, 1, 2, 3], b: [0, 1, 2, 3] },
    pista: 'Mismos átomos y mismos enlaces, pero el doble enlace no gira: los dos metilos quedan del mismo lado (cis) o de lados opuestos (trans).',
    banco: 'RENG_BANCO_ESTEREO.ez (practica/bancos.ts)'
  },
  {
    id: 'etanol-eter',
    titulo: 'Etanol y éter dimetílico',
    tipo: 'de función',
    formula: 'C2H6O',
    a: { smiles: 'CCO', nombre: 'etanol' },
    b: { smiles: 'COC', nombre: 'éter dimetílico (metoximetano)' },
    seleccionInicial: { a: [0, 1, 2], b: [0, 1, 2] },
    pista: 'Misma fórmula C₂H₆O con el oxígeno en un alcohol (C–C–O–H) o en un éter (C–O–C).',
    banco: 'RENG_NUMERO_ISOMEROS, C2H6O (practica/bancos.ts)'
  },
  {
    id: 'butano',
    titulo: 'Butano y 2-metilpropano',
    tipo: 'de esqueleto',
    formula: 'C4H10',
    a: { smiles: 'CCCC', nombre: 'butano' },
    b: { smiles: 'CC(C)C', nombre: '2-metilpropano (isobutano)' },
    seleccionInicial: { a: [0, 1, 2], b: [0, 1, 2] },
    pista: 'Cuatro carbonos en cadena lineal o con una ramificación: mismo C₄H₁₀, distinto esqueleto.',
    banco: 'RENG_NUMERO_ISOMEROS, C4H10 (practica/bancos.ts)'
  },
  {
    id: 'propanol',
    titulo: 'Propan-1-ol y propan-2-ol',
    tipo: 'de posición',
    formula: 'C3H8O',
    a: { smiles: 'CCCO', nombre: 'propan-1-ol' },
    b: { smiles: 'CC(C)O', nombre: 'propan-2-ol' },
    seleccionInicial: { a: [1, 2, 3], b: [0, 1, 3] },
    pista: 'El grupo –OH va en el carbono del extremo o en el carbono central: misma fórmula C₃H₈O, distinta posición.',
    banco: 'RENG_NUMERO_ISOMEROS, C3H8O (practica/bancos.ts)'
  }
]

export const RENG_CODIGOS_PAREJAS: readonly string[] = RENG_PAREJAS_ISO.map((rengP) => rengP.id)

export const RENG_POR_DEFECTO_PAREJA = 'buteno'

export function rengVerificarRegistroPares(rengPares: readonly RengParIsomeros[] = RENG_PAREJAS_ISO): void {
  const rengIds = new Set<string>()
  for (const rengP of rengPares) {
    if (rengIds.has(rengP.id)) throw new Error(`Par de isómeros repetido: ${rengP.id}`)
    rengIds.add(rengP.id)
    const rengGa = rengDesdeSmiles(rengP.a.smiles)
    const rengGb = rengDesdeSmiles(rengP.b.smiles)
    if (rengGa.formula !== rengP.formula || rengGb.formula !== rengP.formula) throw new Error(`El par «${rengP.id}» declara ${rengP.formula} pero sus miembros son ${rengGa.formula} y ${rengGb.formula}: no son isómeros.`)
    if (rengIdCanonico(rengP.a.smiles) === rengIdCanonico(rengP.b.smiles)) throw new Error(`El par «${rengP.id}» repite la misma sustancia: sus miembros no son isómeros distintos.`)
    if (rengP.tipo === 'geométrica (cis/trans)') {
      const rengCasos = RENG_BANCO_ESTEREO.ez.filter((rengC) => rengC.smiles === rengP.a.smiles || rengC.smiles === rengP.b.smiles)
      const rengDa = rengDescriptoresCIP(rengP.a.smiles).dobles.map((rengD) => rengD.descriptor)
      const rengDb = rengDescriptoresCIP(rengP.b.smiles).dobles.map((rengD) => rengD.descriptor)
      const rengBancoA = RENG_BANCO_ESTEREO.ez.find((rengC) => rengC.smiles === rengP.a.smiles)
      const rengBancoB = RENG_BANCO_ESTEREO.ez.find((rengC) => rengC.smiles === rengP.b.smiles)
      if (rengCasos.length !== 2 || !rengBancoA || !rengBancoB) throw new Error(`El par «${rengP.id}» no está en el banco de estereoquímica de la app.`)
      if (rengGa.estereo !== 'definida' || rengGb.estereo !== 'definida') throw new Error(`El par «${rengP.id}» no define su estereoquímica: no se puede asegurar cuál es cis y cuál trans.`)
      if (rengDa.join() !== rengBancoA.esperado || rengDb.join() !== rengBancoB.esperado) throw new Error(`El par «${rengP.id}»: los descriptores E/Z calculados (${rengDa.join()} y ${rengDb.join()}) no coinciden con el banco (${rengBancoA.esperado} y ${rengBancoB.esperado}).`)
    } else {
      const rengBanco = RENG_NUMERO_ISOMEROS.find((rengB) => rengB.formula === rengP.formula)
      if (!rengBanco || !rengBanco.lista.includes(rengP.a.smiles) || !rengBanco.lista.includes(rengP.b.smiles)) throw new Error(`El par «${rengP.id}» no sale del banco de isómeros de la app (${rengP.formula}).`)
    }
    for (const [rengLado, rengSel] of [['A', rengP.seleccionInicial.a], ['B', rengP.seleccionInicial.b]] as const) {
      if (rengSel.length < 2 || rengSel.length > 4 || new Set(rengSel).size !== rengSel.length || rengSel.some((rengI) => !Number.isInteger(rengI) || rengI < 0)) throw new Error(`La selección inicial ${rengLado} del par «${rengP.id}» no es válida.`)
    }
  }
}

rengVerificarRegistroPares()

export const rengParejaRegistrada = (rengId: string): RengParIsomeros => {
  const rengP = RENG_PAREJAS_ISO.find((rengX) => rengX.id === rengId)
  if (!rengP) throw new RangeError(`El par de isómeros «${rengId}» no está en el catálogo (${RENG_CODIGOS_PAREJAS.join(', ')}).`)
  return rengP
}

export const RENG_METODO_CALCULADA = 'MMFF94s sobre una conformación inicial de openchemlib (semilla fija 42)'
export const RENG_METODO_EXPERIMENTAL = 'NIST CCCBDB (geometría experimental incluida en la app)'

export type RengCargaGeometriaIso = { ok: true; geometria: RengGeometriaIsomero } | { ok: false; codigo: string; motivo: string }

export function rengGeometriaDeModelo(rengModelo: RengModeloVisor, rengNombre: string): RengCargaGeometriaIso {
  if (rengModelo.estado !== 'modelo') return { ok: false, codigo: 'iso-sin-geometria', motivo: rengModelo.estado === 'sin-geometria' ? rengModelo.diagnostico : `No hay un modelo 3D de «${rengNombre}» (${rengModelo.estado}).` }
  if (rengModelo.tipo !== 'molecula' || rengModelo.componentes.length !== 1 || rengModelo.smiles === null) return { ok: false, codigo: 'iso-sin-procedencia', motivo: `«${rengNombre}» no es una sola molécula con geometría propia: no entra en la comparación.` }
  const rengO = rengModelo.procedencia.origen
  if (rengO !== 'experimental' && rengO !== 'calculada') return { ok: false, codigo: 'iso-sin-procedencia', motivo: `La geometría de «${rengNombre}» es «${rengO}», no experimental ni calculada: sin procedencia verificable no se carga.` }
  const rengProc: RengProcedenciaIso = { origen: rengO, metodo: rengO === 'calculada' ? RENG_METODO_CALCULADA : RENG_METODO_EXPERIMENTAL, texto: rengModelo.procedencia.texto, detalle: rengModelo.procedencia.detalle }
  return {
    ok: true,
    geometria: {
      nombre: rengNombre,
      smiles: rengModelo.smiles,
      formula: rengModelo.formula,
      atomos: rengModelo.atomos.map((rengA) => ({ el: rengA.el, etiqueta: rengA.etiqueta, p: [rengA.p[0], rengA.p[1], rengA.p[2]] as const })),
      enlaces: rengModelo.enlaces.map((rengE) => ({ a: rengE.a, b: rengE.b, orden: rengE.orden, aromatico: rengE.aromatico })),
      procedencia: rengProc
    }
  }
}

const rengCacheGeometrias = new Map<string, RengCargaGeometriaIso>()

export function rengCargarGeometriaIsomero(rengMiembro: RengMiembroIsomero): RengCargaGeometriaIso {
  const rengClave = `${rengMiembro.smiles}|${rengMiembro.nombre}`
  const rengGuardada = rengCacheGeometrias.get(rengClave)
  if (rengGuardada) return rengGuardada
  const rengR = rengGeometriaDeModelo(rengModeloDeSmiles(rengMiembro.smiles, rengMiembro.nombre), rengMiembro.nombre)
  rengCacheGeometrias.set(rengClave, rengR)
  return rengR
}

export function rengCargarPareja(rengId: string): { ok: true; par: RengParIsomeros; a: RengGeometriaIsomero; b: RengGeometriaIsomero } | { ok: false; codigo: string; motivo: string } {
  const rengPar = rengParejaRegistrada(rengId)
  const rengA = rengCargarGeometriaIsomero(rengPar.a)
  if (!rengA.ok) return rengA
  const rengB = rengCargarGeometriaIsomero(rengPar.b)
  if (!rengB.ok) return rengB
  return { ok: true, par: rengPar, a: rengA.geometria, b: rengB.geometria }
}
