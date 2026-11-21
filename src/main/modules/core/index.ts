import { app, dialog, shell } from 'electron'
import { promises as fs } from 'node:fs'
import { dirname } from 'node:path'
import { rengDefineMainModule } from '../../module-api'
import { rengAssertGranted, rengGrantFile, rengGrantOutput, type RengFileInfo } from '../../security/fs-guard'
import { rengAsEnum, rengAsObject, rengAsString, rengAsStringArray } from '@shared/validate'
import { RengAppError } from '@shared/ipc'
import { RENG_PRODUCTO } from '@shared/producto'

const RENG_FILTERS = {
  imagenes: [{ name: 'Imágenes', extensions: ['jpg', 'jpeg', 'png', 'webp'] }],
  json: [{ name: 'Archivos JSON', extensions: ['json'] }],
  csv: [{ name: 'Datos CSV o texto', extensions: ['csv', 'tsv', 'txt'] }],
  cualquiera: [{ name: 'Todos los archivos', extensions: ['*'] }]
} as const

type RengFilterKey = keyof typeof RENG_FILTERS
const RENG_FILTER_KEYS = Object.keys(RENG_FILTERS) as RengFilterKey[]

const rengExtsOf = (rengK: RengFilterKey): readonly string[] | undefined =>
  rengK === 'cualquiera' ? undefined : RENG_FILTERS[rengK].flatMap((rengF) => rengF.extensions.map((rengE) => `.${rengE}`))

export default rengDefineMainModule({
  id: 'core',
  handlers: {
    appInfo: () => ({
      nombre: RENG_PRODUCTO.nombre,
      autor: RENG_PRODUCTO.autor,
      version: app.getVersion(),
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      plataforma: process.platform
    }),

    async pickFiles(rengPayload): Promise<RengFileInfo[]> {
      const rengP = rengAsObject(rengPayload)
      const rengFiltro = rengAsEnum(rengP['filtro'] ?? 'cualquiera', 'filtro', RENG_FILTER_KEYS)
      const rengMulti = rengP['multiple'] === true
      const rengRes = await dialog.showOpenDialog({
        properties: rengMulti ? ['openFile', 'multiSelections'] : ['openFile'],
        filters: RENG_FILTERS[rengFiltro].map((rengF) => ({ name: rengF.name, extensions: [...rengF.extensions] }))
      })
      if (rengRes.canceled) return []
      return Promise.all(rengRes.filePaths.map((rengF) => rengGrantFile(rengF, { exts: rengExtsOf(rengFiltro) })))
    },

    async grantDropped(rengPayload): Promise<RengFileInfo[]> {
      const rengP = rengAsObject(rengPayload)
      const rengRutas = rengAsStringArray(rengP['rutas'], 'rutas', { maxItems: 200 })
      const rengFiltro = rengAsEnum(rengP['filtro'] ?? 'cualquiera', 'filtro', RENG_FILTER_KEYS)
      const rengOut: RengFileInfo[] = []
      for (const rengR of rengRutas) rengOut.push(await rengGrantFile(rengR, { exts: rengExtsOf(rengFiltro) }))
      return rengOut
    },

    async pickFolder(): Promise<string | null> {
      const rengRes = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })
      if (rengRes.canceled || !rengRes.filePaths[0]) return null
      return rengGrantOutput(rengRes.filePaths[0])
    },

    async saveText(rengPayload): Promise<string | null> {
      const rengP = rengAsObject(rengPayload)
      const rengNombre = rengAsString(rengP['nombreSugerido'], 'nombreSugerido', { max: 200, min: 1 })
      const rengContenido = rengAsString(rengP['contenido'], 'contenido', { max: 50_000_000 })
      const rengExt = rengAsString(rengP['extension'] ?? 'txt', 'extension', { max: 8 })
      const rengRes = await dialog.showSaveDialog({
        defaultPath: rengNombre,
        filters: [{ name: rengExt.toUpperCase(), extensions: [rengExt] }]
      })
      if (rengRes.canceled || !rengRes.filePath) return null
      const rengRuta = rengGrantOutput(rengRes.filePath)
      await fs.writeFile(rengRuta, rengContenido, 'utf8')
      return rengRuta
    },

    async readText(rengPayload): Promise<string> {
      const rengRuta = rengAssertGranted(rengAsString(rengAsObject(rengPayload)['ruta'], 'ruta', { max: 4096 }))
      const rengSt = await fs.stat(rengRuta)
      if (rengSt.size > 20 * 1024 * 1024) throw new RengAppError('TOO_BIG', 'El archivo de texto supera 20 MB.')
      return fs.readFile(rengRuta, 'utf8')
    },

    showInFolder(rengPayload) {
      const rengRuta = rengAssertGranted(rengAsString(rengAsObject(rengPayload)['ruta'], 'ruta', { max: 4096 }))
      shell.showItemInFolder(rengRuta)
      return true
    },

    async ensureDir(rengPayload) {
      const rengRuta = rengAssertGranted(rengAsString(rengAsObject(rengPayload)['ruta'], 'ruta', { max: 4096 }))
      const rengSt = await fs.stat(rengRuta).catch(() => null)
      if (!rengSt) throw new RengAppError('NOT_FOUND', 'La carpeta no existe.')
      return dirname(rengRuta)
    }
  }
})
