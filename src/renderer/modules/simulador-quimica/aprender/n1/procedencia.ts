import type { RengProcedenciaN1 } from './tipos'

export const rengDeclarada = (rengDetalle: string): RengProcedenciaN1 => ({ nivel: 'bibliografica-declarada', detalle: rengDetalle })
export const rengSinVerificar = (rengDetalle: string): RengProcedenciaN1 => ({ nivel: 'sin-verificar', detalle: rengDetalle })
export const rengIdealizado = (rengDetalle: string): RengProcedenciaN1 => ({ nivel: 'ejemplo-idealizado', detalle: rengDetalle })
export const rengDidactico = (rengDetalle: string): RengProcedenciaN1 => ({ nivel: 'parametro-didactico', detalle: rengDetalle })
export const rengCalculado = (rengDetalle: string): RengProcedenciaN1 => ({ nivel: 'dato-calculado', detalle: rengDetalle })

export const RENG_SECCIONES_OPENSTAX_GASES = {
  g91: '9.1 Gas Pressure',
  g92: '9.2 Relating Pressure, Volume, Amount, and Temperature: The Ideal Gas Law',
  g93: '9.3 Stoichiometry of Gaseous Substances, Mixtures, and Reactions',
  g94: '9.4 Effusion and Diffusion of Gases',
  g95: '9.5 The Kinetic-Molecular Theory',
  g96: '9.6 Non-Ideal Gas Behavior'
} as const

export type RengClaveSeccionGases = keyof typeof RENG_SECCIONES_OPENSTAX_GASES

export const rengSeccionGases = (rengClave: RengClaveSeccionGases, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(
    `OpenStax, Chemistry 2e, capítulo 9 «Gases», sección ${RENG_SECCIONES_OPENSTAX_GASES[rengClave]} (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio, no una traducción.`
  )

export const RENG_PROCEDENCIA_R = rengDeclarada(
  'R = 8,314462618 J/(mol·K): constante registrada en el proyecto (datos/electroquimica.ts, fila CODATA marcada como exacta). Se usa tal como está registrada; no se reabrió la fuente en esta entrega.'
)

export const RENG_PROCEDENCIA_ATM = rengDeclarada(
  '1 atm = 101 325 Pa y 1 atm = 760 Torr, del catálogo de unidades del proyecto (NIST SP 811, declarado). Se toma 1 mmHg ≈ 1 Torr; la diferencia relativa es menor que 2·10⁻⁷ y no afecta a ningún resultado.'
)

export const RENG_PROCEDENCIA_KELVIN = rengDeclarada('T(K) = t(°C) + 273,15, del catálogo de unidades del proyecto (Folleto SI del BIPM, declarado).')

export const RENG_PROCEDENCIA_NA_KB = rengDeclarada(
  'N_A = 6,02214076·10²³ mol⁻¹ y k_B = 1,380649·10⁻²³ J/K, valores exactos por definición del SI de 2019 tal como están escritos en el proyecto (nucleo/estequiometria.ts). No se reabrió la fuente.'
)

export const RENG_PROCEDENCIA_MASAS = rengSinVerificar(
  'Las masas molares salen de las masas atómicas de la tabla periódica de la app, cuya fuente no está registrada. Se redondean a 0,01 g/mol y se muestran en el enunciado.'
)

export const RENG_PROCEDENCIA_TEXTO = rengDidactico(
  'Texto, ejemplo y números de la lección escritos para esta app. Los valores del ejemplo son didácticos: no son mediciones de un laboratorio concreto. Ninguna persona docente ha revisado todavía la lección.'
)

export const rengProcedenciaCalculo = (rengMetodo: string): RengProcedenciaN1 =>
  rengCalculado(`El resultado del ejemplo sale de las ecuaciones de la lección y las pruebas lo recalculan con un segundo método independiente (${rengMetodo}).`)
