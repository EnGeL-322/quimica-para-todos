import { rengDefineModule } from '@/module-api'
import { RENG_ACCESOS_QUIMICA } from './accesos'
import { RENG_MENU_QUIMICA } from './menu'

export default rengDefineModule({
  manifest: {
    id: 'simulador-quimica',
    nombre: 'Química',
    nombreCorto: 'Química',
    descripcion: 'Mesa molecular 3D para construir e identificar compuestos, visor 2D y 3D, formulación, reacciones, experimentos de pH, valoración, cinética, equilibrio y energía, casos reales, lecciones y prácticas por nivel.',
    icono: 'flask',
    categoria: 'quimica',
    principal: true,
    nivel: 'todos',
    etiquetas: ['quimica', '3d', 'molecula', 'mesa', 'enlace', 'geometria', 'vsepr', 'formula', 'ecuacion', 'ajuste', 'estequiometria', 'formulacion', 'ionico', 'covalente', 'experimento'],
    orden: 15
  },
  flush: true,
  accesos: RENG_ACCESOS_QUIMICA,
  menu: RENG_MENU_QUIMICA,
  load: () => import('./View')
})
