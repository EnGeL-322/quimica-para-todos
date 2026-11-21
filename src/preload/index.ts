import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { rengAssertChannelParts, rengChannelOf, rengEventChannelOf, type RengCienciaApi, type RengIpcResult } from '../shared/ipc'

const rengApi: RengCienciaApi = {
  async invoke<RengT>(rengModuleId: string, rengAction: string, rengPayload?: unknown): Promise<RengT> {
    rengAssertChannelParts(rengModuleId, rengAction)
    const rengRes = (await ipcRenderer.invoke(rengChannelOf(rengModuleId, rengAction), rengPayload)) as RengIpcResult<RengT>
    if (!rengRes.ok) {
      const rengErr = new Error(rengRes.error.message) as Error & { code: string }
      rengErr.code = rengRes.error.code
      throw rengErr
    }
    return rengRes.data
  },

  on<RengT>(rengModuleId: string, rengEvent: string, rengListener: (rengData: RengT) => void): () => void {
    rengAssertChannelParts(rengModuleId, rengEvent)
    const rengChannel = rengEventChannelOf(rengModuleId, rengEvent)
    const rengWrapped = (_rengE: unknown, rengData: unknown): void => rengListener(rengData as RengT)
    ipcRenderer.on(rengChannel, rengWrapped)
    return () => ipcRenderer.removeListener(rengChannel, rengWrapped)
  },

  pathForFile: (rengFile: File): string => webUtils.getPathForFile(rengFile),

  platform: process.platform
}

contextBridge.exposeInMainWorld('ciencia', rengApi)
