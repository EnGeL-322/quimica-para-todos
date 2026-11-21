import { resolve } from 'node:path'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@shared': resolve(import.meta.dirname, 'src/shared'),
      '@': resolve(import.meta.dirname, 'src/renderer'),
      'openchemlib-recursos': resolve(import.meta.dirname, 'node_modules/openchemlib/dist/resources.json')
    }
  },
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: [...configDefaults.exclude],
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000
  }
})
