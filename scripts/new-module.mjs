#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rengRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const rengArgs = process.argv.slice(2)
const rengWithMain = rengArgs.includes('--main')
const [rengId, rengNombre] = rengArgs.filter((rengA) => !rengA.startsWith('--'))

if (!rengId || !rengNombre || !/^[a-z][a-z0-9-]{1,30}$/.test(rengId)) {
  console.error('Uso: npm run new:module -- <id-kebab-case> "<Nombre>" [--main]')
  process.exit(1)
}

const rengWrite = (rengRel, rengText) => {
  const rengAbs = join(rengRoot, rengRel)
  if (existsSync(rengAbs)) throw new Error(`Ya existe: ${rengRel}`)
  mkdirSync(dirname(rengAbs), { recursive: true })
  writeFileSync(rengAbs, rengText, 'utf8')
  console.log('✓', rengRel)
}

rengWrite(
  `src/renderer/modules/${rengId}/index.ts`,
  `import { rengDefineModule } from '@/module-api'

export default rengDefineModule({
  manifest: {
    id: '${rengId}',
    nombre: ${JSON.stringify(rengNombre)},
    descripcion: 'Describe en una línea qué hace este módulo.',
    icono: 'atom',
    categoria: 'laboratorio',
    nivel: 'todos',
    etiquetas: [],
    orden: 90
  },
  load: () => import('./View')
})
`
)

const rengImportsVista = rengWithMain ? "import { useState } from 'react'\nimport { rengCall } from '@/lib/api'\nimport { RengPageTitle, useRengAsync } from '@/shell/ui'\n" : "import { RengPageTitle } from '@/shell/ui'\n"
const rengEstadoVista = rengWithMain
  ? `  const [rengMensaje, rengSetMensaje] = useState('')
  const { busy: rengOcupado, run: rengEjecutar } = useRengAsync()
  const rengProbar = async (): Promise<void> => {
    const rengR = await rengEjecutar(() => rengCall<{ mensaje: string }>('${rengId}', 'hola', { nombre: 'ciencia' }))
    if (rengR) rengSetMensaje(rengR.mensaje)
  }
`
  : ''
const rengBotonVista = rengWithMain
  ? `      <button className="btn primary" disabled={rengOcupado} onClick={() => void rengProbar()}>Probar backend</button>
      {rengMensaje && <div className="notice ok">{rengMensaje}</div>}
`
  : ''

rengWrite(
  `src/renderer/modules/${rengId}/View.tsx`,
  `${rengImportsVista}
export default function RengVista(): React.JSX.Element {
${rengEstadoVista}  return (
    <div className="stack">
      <RengPageTitle title=${JSON.stringify(rengNombre)} sub="Módulo nuevo: edita este archivo." />
${rengBotonVista}    </div>
  )
}
`
)

if (rengWithMain) {
  rengWrite(
    `src/main/modules/${rengId}/index.ts`,
    `import { rengDefineMainModule } from '../../module-api'
import { rengAsObject, rengAsString } from '@shared/validate'

export default rengDefineMainModule({
  id: '${rengId}',
  handlers: {
    hola(rengPayload) {
      const rengP = rengAsObject(rengPayload)
      const rengNombreSaludo = rengAsString(rengP['nombre'], 'nombre', { min: 1, max: 60 })
      return { mensaje: 'Hola, ' + rengNombreSaludo + ', desde el proceso principal.' }
    }
  }
})
`
  )
}

console.log(`\nListo. Reinicia "npm run dev": «${rengNombre}» aparecerá en el menú.`)
