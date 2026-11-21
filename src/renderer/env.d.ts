/// <reference types="vite/client" />
import type { RengCienciaApi } from '@shared/ipc'

declare global {
  interface Window {
    ciencia: RengCienciaApi
  }
}

export {}
