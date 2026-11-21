import type { BrowserWindow } from 'electron'

export interface RengModuleContext {
  window: BrowserWindow | null
  emit: (rengEvent: string, rengData: unknown) => void
  userData: string
}

export type RengHandler = (rengPayload: unknown, rengCtx: RengModuleContext) => unknown | Promise<unknown>

export interface RengMainModule {
  id: string
  handlers: Record<string, RengHandler>
  dispose?: () => void
}

export const rengDefineMainModule = (rengM: RengMainModule): RengMainModule => rengM
