import { resolve } from 'node:path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

const rengShared = resolve(__dirname, 'src/shared')

export default defineConfig({
  main: {
    resolve: { alias: { '@shared': rengShared } },
    build: { rollupOptions: { external: ['electron'] } }
  },
  preload: {
    resolve: { alias: { '@shared': rengShared } }
  },
  renderer: {
    resolve: {
      alias: { '@shared': rengShared, '@': resolve(__dirname, 'src/renderer'), 'openchemlib-recursos': resolve(__dirname, 'node_modules/openchemlib/dist/resources.json') }
    },
    plugins: [react()],
    build: { chunkSizeWarningLimit: 1200 }
  }
})
