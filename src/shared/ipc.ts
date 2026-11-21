export const RENG_ID_RE = /^[a-z][a-z0-9-]{1,30}$/
export const RENG_ACTION_RE = /^[a-zA-Z][a-zA-Z0-9]{1,30}$/

export const rengChannelOf = (rengId: string, rengAction: string): string => `mod:${rengId}:${rengAction}`
export const rengEventChannelOf = (rengId: string, rengEvent: string): string => `evt:${rengId}:${rengEvent}`

export function rengAssertChannelParts(rengId: string, rengAction: string): void {
  if (!RENG_ID_RE.test(rengId)) throw new Error(`Id de módulo inválido: ${rengId}`)
  if (!RENG_ACTION_RE.test(rengAction)) throw new Error(`Acción inválida: ${rengAction}`)
}

export interface RengIpcError {
  code: string
  message: string
}

export type RengIpcResult<RengT> = { ok: true; data: RengT } | { ok: false; error: RengIpcError }

export class RengAppError extends Error {
  readonly code: string
  constructor(rengCode: string, rengMessage: string) {
    super(rengMessage)
    this.name = 'AppError'
    this.code = rengCode
  }
}

export interface RengCienciaApi {
  invoke<RengT = unknown>(rengModuleId: string, rengAction: string, rengPayload?: unknown): Promise<RengT>
  on<RengT = unknown>(rengModuleId: string, rengEvent: string, rengListener: (rengData: RengT) => void): () => void
  pathForFile(rengFile: File): string
  readonly platform: string
}
