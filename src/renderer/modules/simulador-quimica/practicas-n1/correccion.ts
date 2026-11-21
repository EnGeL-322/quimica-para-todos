import { rengCorregirNumero } from '../practica/correccion'
import { rengSepararNumeroUnidad } from '../practica/numeros'
import type { RengInstanciaN1, RengPracticaN1 } from './tipos'

export type RengTipoVeredictoN1 = 'correcto' | 'error-tipico' | 'unidades' | 'cerca' | 'alto' | 'bajo' | 'unidad-incompatible' | 'ilegible'

export interface RengVeredictoN1 {
  tipo: RengTipoVeredictoN1
  mensaje: string
  errorId?: string
  equivale?: string
}

const RENG_NO_FINITO = 'Escribe un número finito (por ejemplo 2,45 o 2,45e3). «Infinito» o valores desmesurados no son una respuesta.'

export function rengCorregirN1(rengTexto: string, rengPractica: Pick<RengPracticaN1, 'unidad' | 'tolerancia'>, rengInstancia: Pick<RengInstanciaN1, 'respuesta' | 'errores'>): RengVeredictoN1 {
  const rengLectura = rengSepararNumeroUnidad(rengTexto)
  if (rengLectura.ok && !Number.isFinite(rengLectura.valor)) return { tipo: 'ilegible', mensaje: RENG_NO_FINITO }
  if (!Number.isFinite(rengInstancia.respuesta)) return { tipo: 'ilegible', mensaje: 'Esta variante no tiene una respuesta válida; pide otra.' }
  const rengV = rengCorregirNumero(rengTexto, {
    tipo: 'numero',
    valor: rengInstancia.respuesta,
    unidad: rengPractica.unidad,
    tolRel: rengPractica.tolerancia.rel,
    tolAbs: rengPractica.tolerancia.abs,
    decimales: null,
    erroresComunes: rengInstancia.errores.map((rengE) => ({ valor: rengE.valor, mensaje: rengE.mensaje }))
  })
  const rengExtra = rengV.equivale ? { equivale: rengV.equivale } : {}
  if (rengV.tipo === 'correcto') return { tipo: 'correcto', mensaje: rengV.mensaje, ...rengExtra }
  if (rengV.tipo === 'entrada-invalida' || rengV.tipo === 'ambigua') return { tipo: 'ilegible', mensaje: rengV.mensaje }
  if (rengV.tipo === 'unidad-incompatible') return { tipo: 'unidad-incompatible', mensaje: rengV.mensaje }
  if (rengV.motivo === 'error-frecuente') {
    const rengE = rengInstancia.errores.find((rengX) => rengX.mensaje === rengV.errorFrecuente)
    return { tipo: 'error-tipico', mensaje: rengV.errorFrecuente ?? rengV.mensaje, ...(rengE ? { errorId: rengE.id } : {}), ...rengExtra }
  }
  if (rengV.motivo === 'factor-potencia-10') return { tipo: 'unidades', mensaje: rengV.mensaje, ...rengExtra }
  if (rengV.motivo === 'cerca') return { tipo: 'cerca', mensaje: rengV.mensaje, ...rengExtra }
  return { tipo: rengV.motivo === 'alto' ? 'alto' : 'bajo', mensaje: rengV.mensaje, ...rengExtra }
}

export const rengTextoRespuestaN1 = (rengX: number, rengCifras = 5): string => {
  const rengA = Math.abs(rengX)
  if (rengA !== 0 && (rengA < 1e-3 || rengA >= 1e6)) return rengX.toExponential(rengCifras - 1).replace('.', ',')
  return String(Number(rengX.toPrecision(rengCifras))).replace('.', ',')
}
