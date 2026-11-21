import { rengDefineModule } from '@/module-api'

export default rengDefineModule({
  manifest: {
    id: 'tabla-periodica',
    nombre: 'Tabla periódica interactiva',
    descripcion: 'Explora los 118 elementos, consulta peligros por forma química, busca compuestos y calcula masas molares.',
    icono: 'table',
    categoria: 'herramientas',
    nivel: 'todos',
    etiquetas: ['elementos', 'quimica', 'masa molar', 'configuracion electronica', 'bohr', 'periodica', 'compuestos', 'peligros', 'seguridad quimica'],
    orden: 41
  },
  load: () => import('./View')
})
