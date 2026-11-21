import { rengDefineModule } from '@/module-api'
import { RENG_ACCESOS_LABORATORIO } from './accesos'
import { RENG_MENU_LABORATORIO } from './menu'

export default rengDefineModule({
  manifest: {
    id: 'laboratorio',
    nombre: 'Laboratorio',
    nombreCorto: 'Laboratorio',
    descripcion: 'Tu cuaderno de corridas y mediciones de química, con estadística y regresión para analizar tus resultados.',
    icono: 'calculator',
    categoria: 'laboratorio',
    principal: true,
    nivel: 'todos',
    etiquetas: ['laboratorio', 'cuaderno', 'corridas', 'mediciones', 'estadistica', 'regresion'],
    orden: 40
  },
  accesos: RENG_ACCESOS_LABORATORIO,
  menu: RENG_MENU_LABORATORIO,
  load: () => import('./View')
})
