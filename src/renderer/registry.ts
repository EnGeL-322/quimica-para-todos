import type { RengModuleDefinition } from './module-api'

const rengFound = import.meta.glob<{ default: RengModuleDefinition }>('./modules/*/index.ts', { eager: true })

export const RENG_MODULES: RengModuleDefinition[] = Object.values(rengFound)
  .map((rengM) => rengM.default)
  .filter((rengM): rengM is RengModuleDefinition => !!rengM?.manifest?.id)
  .sort((rengA, rengB) => rengA.manifest.orden - rengB.manifest.orden)

export const rengFindModule = (rengId: string): RengModuleDefinition | undefined => RENG_MODULES.find((rengM) => rengM.manifest.id === rengId)
