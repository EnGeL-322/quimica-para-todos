import { randomUUID } from 'node:crypto'
import { rengAsObject, rengAsString } from '@shared/validate'
import { rengDefineMainModule } from '../../module-api'
import { rengCarpetaCuaderno, rengGuardarProyecto, rengImportarProyecto, rengLeerProyecto, rengListarProyectos, RENG_MAX_BYTES_PROYECTO } from './almacen'

export default rengDefineMainModule({
  id: 'laboratorio',
  handlers: {
    proyectos: (_rengP, rengCtx) => rengListarProyectos(rengCarpetaCuaderno(rengCtx.userData)),
    abrir: (rengPayload, rengCtx) => rengLeerProyecto(rengCarpetaCuaderno(rengCtx.userData), rengAsString(rengAsObject(rengPayload)['id'], 'id', { min: 8, max: 64 })),
    guardar: (rengPayload, rengCtx) => rengGuardarProyecto(rengCarpetaCuaderno(rengCtx.userData), rengAsObject(rengPayload)['proyecto']),
    importar: (rengPayload, rengCtx) => rengImportarProyecto(rengCarpetaCuaderno(rengCtx.userData), rengAsString(rengAsObject(rengPayload)['contenido'], 'contenido', { max: RENG_MAX_BYTES_PROYECTO }), randomUUID())
  }
})
