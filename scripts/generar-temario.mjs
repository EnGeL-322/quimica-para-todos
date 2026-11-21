import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RENG_ARCHIVO_DATOS, RENG_ARCHIVO_TEMARIO, rengGenerarModuloDesdeTexto } from './temario-lib.mjs'

const rengRaiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const rengTexto = readFileSync(resolve(rengRaiz, RENG_ARCHIVO_TEMARIO), 'utf8')
const rengModulo = rengGenerarModuloDesdeTexto(rengTexto)
const rengDestino = resolve(rengRaiz, RENG_ARCHIVO_DATOS)
mkdirSync(dirname(rengDestino), { recursive: true })
writeFileSync(rengDestino, rengModulo, 'utf8')
console.log(`Temario generado: ${RENG_ARCHIVO_DATOS} (${rengModulo.split('\n').length} líneas)`)
