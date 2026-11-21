import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RENG_RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const RENG_COMPROBAR = process.argv.includes('--comprobar')
const RENG_VITEST = join(RENG_RAIZ, 'node_modules', 'vitest', 'vitest.mjs')

const rengR = spawnSync(process.execPath, [RENG_VITEST, 'run', 'tests/quimica/nivel1-informe.test.ts'], {
  cwd: RENG_RAIZ,
  stdio: 'inherit',
  env: { ...process.env, RENG_INFORME_ESCRIBIR: RENG_COMPROBAR ? '0' : '1' }
})

if (rengR.status !== 0) {
  console.error(RENG_COMPROBAR ? 'NIVEL-1-ESTADO: la cobertura NO coincide con los recursos reales. Ejecuta: node scripts/informe-nivel1.mjs' : 'NIVEL-1-ESTADO: no se pudo regenerar la cobertura.')
  process.exit(rengR.status ?? 1)
}
console.log(RENG_COMPROBAR ? 'NIVEL-1-ESTADO: la cobertura coincide con los recursos reales' : 'NIVEL-1-ESTADO: cobertura regenerada desde los recursos reales')
