import { BrowserWindow, ipcMain, type IpcMainInvokeEvent } from 'electron'
import { RengAppError, rengAssertChannelParts, rengChannelOf, rengEventChannelOf, type RengIpcResult } from '@shared/ipc'
import type { RengMainModule, RengModuleContext } from './module-api'

const rengFound = import.meta.glob<{ default: RengMainModule }>('./modules/*/index.ts', { eager: true })

const rengModules: RengMainModule[] = Object.values(rengFound)
  .map((rengM) => rengM.default)
  .filter((rengM): rengM is RengMainModule => !!rengM && typeof rengM.id === 'string' && !!rengM.handlers)

let rengGetWindow: () => BrowserWindow | null = () => null
let rengTrustedOrigin: (rengUrl: string) => boolean = () => false

function rengMakeContext(rengId: string, rengUserData: string): RengModuleContext {
  return {
    get window() {
      return rengGetWindow()
    },
    emit(rengEvent, rengData) {
      const rengW = rengGetWindow()
      if (rengW && !rengW.isDestroyed()) rengW.webContents.send(rengEventChannelOf(rengId, rengEvent), rengData)
    },
    userData: rengUserData
  }
}

function rengToError(rengE: unknown): RengIpcResult<never> {
  if (rengE instanceof RengAppError) return { ok: false, error: { code: rengE.code, message: rengE.message } }
  console.error('[ipc]', rengE)
  return { ok: false, error: { code: 'INTERNAL', message: 'Ocurrió un error interno. Revisa los registros de la aplicación.' } }
}

export function rengRegisterModules(rengOpts: { window: () => BrowserWindow | null; trusted: (rengUrl: string) => boolean; userData: string }): RengMainModule[] {
  rengGetWindow = rengOpts.window
  rengTrustedOrigin = rengOpts.trusted
  const rengSeen = new Set<string>()

  for (const rengMod of rengModules) {
    if (rengSeen.has(rengMod.id)) throw new Error(`Módulo duplicado: ${rengMod.id}`)
    rengSeen.add(rengMod.id)
    const rengCtx = rengMakeContext(rengMod.id, rengOpts.userData)
    for (const [rengAction, rengHandler] of Object.entries(rengMod.handlers)) {
      rengAssertChannelParts(rengMod.id, rengAction)
      ipcMain.handle(rengChannelOf(rengMod.id, rengAction), async (rengEvent: IpcMainInvokeEvent, rengPayload: unknown) => {
        const rengUrl = rengEvent.senderFrame?.url ?? ''
        if (!rengTrustedOrigin(rengUrl)) return rengToError(new RengAppError('UNTRUSTED', 'Origen no autorizado.'))
        try {
          return { ok: true, data: await rengHandler(rengPayload, rengCtx) } satisfies RengIpcResult<unknown>
        } catch (rengE) {
          return rengToError(rengE)
        }
      })
    }
  }
  return rengModules
}

export function rengDisposeModules(): void {
  for (const rengM of rengModules) {
    try {
      rengM.dispose?.()
    } catch (rengE) {
      console.error('[dispose]', rengM.id, rengE)
    }
  }
}
