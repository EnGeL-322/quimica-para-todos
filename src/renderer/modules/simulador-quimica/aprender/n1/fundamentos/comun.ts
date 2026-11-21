import type { RengTerminoEspec } from '../gases/libro-comun'
import { rengSinVerificar } from '../procedencia'
import type { RengEscenaLeccionN1, RengExplorarN1, RengProcedenciaN1 } from '../tipos'
import { rengMasaMolarDe, rengSubindice } from '../../../nucleo/formula'

export const RENG_G1 = {
  quimica: ['química', 'Ciencia que estudia la composición, la estructura y las propiedades de la materia y sus transformaciones.'],
  materia: ['materia', 'Todo lo que tiene masa y ocupa un lugar en el espacio, desde el aire hasta una roca.'],
  energia: ['energía', 'Capacidad de un sistema para producir cambios, por ejemplo calentar, mover o transformar la materia.'],
  metodo: ['método científico', 'Procedimiento de observación, hipótesis, experimentación y análisis con el que la ciencia contrasta sus ideas.'],
  hipotesis: ['hipótesis', 'Explicación provisional de un fenómeno que se puede poner a prueba con experimentos.'],
  propiedadGeneral: ['propiedad general', 'Propiedad que tienen todos los cuerpos y no sirve para distinguirlos, como la masa o el volumen.'],
  propiedadEspecifica: ['propiedad específica', 'Propiedad característica de cada sustancia que permite identificarla, como la densidad o el punto de fusión.'],
  propiedadFisica: ['propiedad física', 'Propiedad que se observa o mide sin cambiar la identidad de la sustancia, como el color o el punto de ebullición.'],
  propiedadQuimica: ['propiedad química', 'Capacidad de una sustancia para transformarse en otras, como la combustibilidad o la oxidación.'],
  intensiva: ['propiedad intensiva', 'Propiedad que no depende de la cantidad de materia, como la temperatura o la densidad.'],
  extensiva: ['propiedad extensiva', 'Propiedad que depende de la cantidad de materia, como la masa o el volumen.'],
  estado: ['estado de agregación', 'Forma en que se presenta la materia (sólido, líquido o gas) según la libertad de movimiento de sus partículas.'],
  cambioFisico: ['cambio físico', 'Transformación en la que la sustancia sigue siendo la misma, como fundir hielo o romper un vidrio.'],
  cambioQuimico: ['cambio químico', 'Transformación en la que se forman sustancias nuevas, como quemar madera u oxidar hierro.'],
  sustanciaPura: ['sustancia pura', 'Materia de composición fija y propiedades definidas, que puede ser un elemento o un compuesto.'],
  elemento: ['elemento', 'Sustancia pura formada por átomos de un solo tipo, que no se descompone en otras más sencillas.'],
  compuesto: ['compuesto', 'Sustancia pura formada por dos o más elementos combinados en proporción fija.'],
  mezcla: ['mezcla', 'Combinación de dos o más sustancias que conservan sus propiedades y se pueden separar por métodos físicos.'],
  homogenea: ['mezcla homogénea', 'Mezcla de composición uniforme en la que no se distinguen sus componentes, como una disolución.'],
  heterogenea: ['mezcla heterogénea', 'Mezcla en la que se distinguen sus componentes o fases, como el agua con arena.'],
  separacion: ['método de separación', 'Procedimiento físico para separar los componentes de una mezcla, como filtrar, decantar o destilar.'],
  sistema: ['sistema material', 'Porción de materia que se aísla para estudiarla; puede ser homogéneo (una fase) o heterogéneo (varias).'],
  fase: ['fase', 'Porción de un sistema con propiedades uniformes, separada de las demás por una superficie definida.'],
  magnitud: ['magnitud', 'Propiedad que se puede medir y expresar con un número y una unidad, como la masa o el tiempo.'],
  unidad: ['unidad', 'Cantidad de referencia con la que se compara una magnitud al medirla, como el metro o el kilogramo.'],
  si: ['Sistema Internacional', 'Sistema de unidades acordado internacionalmente, con siete unidades básicas como el metro, el kilogramo y el mol.'],
  prefijo: ['prefijo del SI', 'Partícula que multiplica una unidad por una potencia de diez, como kilo (10³) o mili (10⁻³).'],
  notacion: ['notación científica', 'Forma de escribir un número como a × 10ⁿ con 1 ≤ a < 10, útil para valores muy grandes o pequeños.'],
  cifras: ['cifras significativas', 'Dígitos de una medida que se conocen con seguridad más el primero incierto; indican su precisión.'],
  factor: ['factor de conversión', 'Fracción igual a uno (como 1000 mL / 1 L) que permite cambiar de unidad sin cambiar la magnitud.'],
  densidad: ['densidad', 'Masa por unidad de volumen de una sustancia, ρ = m/V; es una propiedad intensiva.'],
  temperatura: ['temperatura', 'Magnitud que indica lo caliente que está un cuerpo y se relaciona con la energía de sus partículas.'],
  presion: ['presión', 'Fuerza por unidad de superficie; en los gases se debe a los choques de las partículas contra las paredes.'],
  pictograma: ['pictograma de peligro', 'Símbolo del sistema SGA (GHS) en un rombo rojo que indica el tipo de peligro de un producto.'],
  exactitud: ['exactitud', 'Cercanía de una medida al valor verdadero; se cuantifica con el error.'],
  precision: ['precisión', 'Cercanía entre sí de medidas repetidas; indica la reproducibilidad.']
} as const satisfies Record<string, RengTerminoEspec>

export const rengSeccionFu = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

export const RENG_S11 = '1.1 Chemistry in Context'
export const RENG_S12 = '1.2 Phases and Classification of Matter'
export const RENG_S13 = '1.3 Physical and Chemical Properties'
export const RENG_S14 = '1.4 Measurements'
export const RENG_S15 = '1.5 Measurement Uncertainty, Accuracy, and Precision'
export const RENG_S16 = '1.6 Mathematical Treatment of Measurement Results'
export const RENG_S21 = '2.1 Early Ideas in Atomic Theory'

export const RENG_PROCEDENCIA_DIDACTICA_FU = rengSinVerificar('Los valores de referencia de esta lección (densidades de materiales comunes, calores latentes del agua 334 J/g y 2260 J/g, c del agua 4,184 J/(g·K), 1 atm = 101,325 kPa = 760 mmHg) son valores redondeados de uso común; no se contrastaron en esta entrega.')

export const rengEscenaDens = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'densidad', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena trata objetos macizos y homogéneos en un líquido en reposo; no incluye objetos huecos ni la variación con la temperatura.' })
export const rengEscenaGasFu = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'gas-ideal', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena usa el modelo de gas ideal; a presiones altas o temperaturas bajas los gases reales se desvían.' })
export const rengEscenaCalFu = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'calorimetria', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena supone que no se pierde calor y que no hay cambios de estado.' })
export const rengEscenaCombFu = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'combustion', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena modela solo la combustión completa de compuestos de C, H y O.' })
export const rengEscenaConcFu = (rengValores: Readonly<Record<string, number>>, rengInstruccion: string): RengEscenaLeccionN1 => ({ id: 'concentraciones', valores: rengValores, instruccion: rengInstruccion, limite: 'La escena trata disoluciones acuosas ideales de un soluto; no simula la separación física en sí.' })
export const rengMesaExplorarFu = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'simulador-quimica', sub: 'explorar', nombre: 'Mesa · Explorar', instruccion: rengInstruccion, limite: 'La Mesa muestra sustancias puras (elementos y compuestos) de una en una; no representa mezclas.' })
export const rengTablaFu = (rengInstruccion: string): RengExplorarN1 => ({ modulo: 'tabla-periodica', sub: '', nombre: 'Tabla periódica', instruccion: rengInstruccion, limite: 'La tabla muestra datos de los elementos con su procedencia; no incluye compuestos ni mezclas.' })

export const rengMmFu = (rengF: string): number => rengMasaMolarDe(rengF)
export const rengTxtFu = (rengF: string): string => rengSubindice(rengF)
