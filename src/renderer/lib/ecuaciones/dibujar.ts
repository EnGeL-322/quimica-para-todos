import temml from 'temml'
import './temml-local.css'
import { RENG_OPCIONES_TEMML, rengValidarTex } from './validarTex'

export type RengResultadoDibujo = 'mathml' | 'reserva'

export function rengDibujarTex(rengTex: string, rengNodo: HTMLElement, rengBloque: boolean): RengResultadoDibujo {
  if (!rengValidarTex(rengTex).ok) return 'reserva'
  try {
    temml.render(rengTex, rengNodo, { ...RENG_OPCIONES_TEMML, displayMode: rengBloque })
  } catch {
    rengNodo.replaceChildren()
    return 'reserva'
  }
  const rengMath = rengNodo.querySelector('math')
  if (!rengMath || rengNodo.querySelector('merror, .temml-error')) {
    rengNodo.replaceChildren()
    return 'reserva'
  }
  rengMath.setAttribute('aria-hidden', 'true')
  return 'mathml'
}
