export interface RengEntradaGlosario {
  id: string
  termino: string
  variantes: string[]
  definicion: string
  fuente: string
}

const RENG_GOLD = 'IUPAC Gold Book (goldbook.iupac.org)'
const RENG_ROJO = 'IUPAC, Nomenclatura de Química Inorgánica, Recomendaciones 2005 («Libro Rojo»)'

export const RENG_GLOSARIO: RengEntradaGlosario[] = [
  { id: 'atomo', termino: 'átomo', variantes: ['átomos'], definicion: 'La partícula más pequeña de un elemento que conserva su identidad química: un núcleo con protones y neutrones rodeado de electrones.', fuente: RENG_GOLD },
  { id: 'molecula', termino: 'molécula', variantes: ['moléculas'], definicion: 'Grupo eléctricamente neutro de dos o más átomos unidos por enlaces covalentes.', fuente: RENG_GOLD },
  { id: 'ion', termino: 'ion', variantes: ['iones', 'ión'], definicion: 'Átomo o grupo de átomos con carga eléctrica porque ha ganado o perdido electrones.', fuente: RENG_GOLD },
  { id: 'cation', termino: 'catión', variantes: ['cationes'], definicion: 'Ion con carga positiva (ha perdido electrones). Ejemplo: Na⁺.', fuente: RENG_GOLD },
  { id: 'anion', termino: 'anión', variantes: ['aniones'], definicion: 'Ion con carga negativa (ha ganado electrones). Ejemplo: Cl⁻.', fuente: RENG_GOLD },
  { id: 'covalente', termino: 'enlace covalente', variantes: ['enlaces covalentes', 'covalente'], definicion: 'Unión entre dos átomos que comparten uno o más pares de electrones.', fuente: RENG_GOLD },
  { id: 'ionico', termino: 'enlace iónico', variantes: ['enlaces iónicos', 'iónico', 'iónica'], definicion: 'Unión por atracción eléctrica entre iones de carga opuesta, normalmente un metal y un no metal.', fuente: RENG_GOLD },
  { id: 'metalico', termino: 'enlace metálico', variantes: ['metálico'], definicion: 'Unión de los metales: cationes ordenados en una red y electrones de valencia que se mueven libremente entre ellos.', fuente: RENG_GOLD },
  { id: 'electronegatividad', termino: 'electronegatividad', variantes: [], definicion: 'Tendencia de un átomo a atraer hacia sí los electrones de un enlace. Escala habitual: la de Pauling (F = 3,98, el más alto).', fuente: RENG_GOLD },
  { id: 'valencia', termino: 'electrones de valencia', variantes: ['electrón de valencia', 'valencia'], definicion: 'Electrones de la capa más externa de un átomo; son los que participan en los enlaces.', fuente: RENG_GOLD },
  { id: 'par-libre', termino: 'par libre', variantes: ['pares libres', 'par solitario', 'pares solitarios'], definicion: 'Par de electrones de valencia que pertenece a un solo átomo y no forma enlace.', fuente: RENG_GOLD },
  { id: 'hibridacion', termino: 'hibridación', variantes: [], definicion: 'Modelo en el que los orbitales de un átomo se combinan para formar orbitales nuevos y equivalentes (sp, sp², sp³) que explican la forma de las moléculas.', fuente: RENG_GOLD },
  { id: 'dipolo', termino: 'momento dipolar', variantes: ['dipolo'], definicion: 'Medida de la separación de cargas en una molécula. Se representa con una flecha del polo positivo al negativo y se mide en debyes (D).', fuente: RENG_GOLD },
  { id: 'polar', termino: 'polar', variantes: ['apolar'], definicion: 'Una molécula es polar si sus cargas están repartidas de forma desigual (tiene un polo δ+ y otro δ−); si no, es apolar.', fuente: RENG_GOLD },
  { id: 'vsepr', termino: 'VSEPR', variantes: ['RPECV'], definicion: 'Teoría de repulsión de los pares de electrones de la capa de valencia: los pares se separan lo máximo posible y eso fija la forma de la molécula.', fuente: RENG_GOLD },
  { id: 'angulo', termino: 'ángulo de enlace', variantes: ['ángulos de enlace'], definicion: 'Ángulo formado por dos enlaces que salen del mismo átomo.', fuente: RENG_GOLD },
  { id: 'longitud', termino: 'longitud de enlace', variantes: ['longitudes de enlace'], definicion: 'Distancia media entre los núcleos de dos átomos enlazados. Se suele dar en ángstroms (1 Å = 10⁻¹⁰ m).', fuente: RENG_GOLD },
  { id: 'oxidacion', termino: 'número de oxidación', variantes: ['números de oxidación', 'estado de oxidación', 'estados de oxidación'], definicion: 'Carga que tendría un átomo si todos sus enlaces fueran iónicos. Sirve para formular y para seguir los electrones en las reacciones redox.', fuente: RENG_ROJO },
  { id: 'masa-molar', termino: 'masa molar', variantes: [], definicion: 'Masa de un mol de una sustancia, en g/mol. Se calcula sumando las masas atómicas de los átomos de la fórmula.', fuente: RENG_GOLD },
  { id: 'mol', termino: 'mol', variantes: ['moles'], definicion: 'Unidad de cantidad de sustancia: exactamente 6,022 140 76 × 10²³ partículas (constante de Avogadro, SI 2019).', fuente: RENG_GOLD },
  { id: 'coeficiente', termino: 'coeficiente estequiométrico', variantes: ['coeficientes', 'coeficiente'], definicion: 'Número delante de cada fórmula en una ecuación química: indica en qué proporción reaccionan o se forman las sustancias.', fuente: RENG_GOLD },
  { id: 'ajustada', termino: 'ecuación ajustada', variantes: ['ajustada', 'ajuste'], definicion: 'Ecuación con el mismo número de átomos de cada elemento (y la misma carga total) a ambos lados de la flecha.', fuente: RENG_GOLD },
  { id: 'catalizador', termino: 'catalizador', variantes: ['catalizadores'], definicion: 'Sustancia que acelera una reacción sin consumirse en ella. Se escribe sobre la flecha.', fuente: RENG_GOLD },
  { id: 'red', termino: 'red cristalina', variantes: ['red'], definicion: 'Disposición ordenada y repetida en el espacio de los átomos o iones de un sólido.', fuente: RENG_GOLD },
  { id: 'celda', termino: 'celda unidad', variantes: ['celda unitaria'], definicion: 'La porción más pequeña de una red cristalina que, repetida en las tres direcciones, reproduce todo el cristal.', fuente: RENG_GOLD },
  { id: 'hidrato', termino: 'hidrato', variantes: ['hidratos', 'hidratada'], definicion: 'Compuesto que incluye moléculas de agua en su estructura; se escriben con un punto: CuSO₄·5H₂O.', fuente: RENG_ROJO },
  { id: 'estado', termino: 'estado de agregación', variantes: ['estados de agregación'], definicion: 'Forma física de una sustancia en la ecuación: (s) sólido, (l) líquido, (g) gas, (aq) disuelto en agua.', fuente: RENG_ROJO },
  { id: 'sigma', termino: 'enlace σ', variantes: ['enlace sigma', 'enlaces σ', 'enlaces sigma', 'σ'], definicion: 'Enlace covalente en el que los orbitales se solapan de frente, sobre la línea que une los dos núcleos. Todo enlace sencillo es σ.', fuente: RENG_GOLD },
  { id: 'pi', termino: 'enlace π', variantes: ['enlace pi', 'enlaces π', 'enlaces pi', 'π'], definicion: 'Enlace covalente en el que dos orbitales p se solapan de lado, por encima y por debajo de la línea entre los núcleos. Aparece en los enlaces dobles (1 σ + 1 π) y triples (1 σ + 2 π).', fuente: RENG_GOLD },
  { id: 'ligando', termino: 'ligando', variantes: ['ligandos'], definicion: 'Molécula o ion que se une a un átomo central (normalmente un metal) cediéndole un par de electrones. Ejemplo: el NH₃ en [Cu(NH₃)₄]²⁺.', fuente: RENG_ROJO },
  { id: 'coordinacion', termino: 'número de coordinación', variantes: ['números de coordinación', 'coordinación'], definicion: 'Número de átomos vecinos unidos directamente a un átomo central (en un complejo) o en contacto con él (en un cristal).', fuente: RENG_ROJO },
  { id: 'dativo', termino: 'enlace dativo', variantes: ['enlace coordinado', 'dativo'], definicion: 'Enlace covalente en el que los dos electrones compartidos los aporta el mismo átomo (el dador). Una vez formado, es igual que cualquier otro enlace covalente.', fuente: RENG_GOLD },
  { id: 'paramagnetismo', termino: 'paramagnetismo', variantes: ['paramagnético', 'paramagnética'], definicion: 'Propiedad de las sustancias con electrones desapareados: son atraídas por un imán. El O₂ líquido, por ejemplo, queda pegado entre los polos de un imán.', fuente: RENG_GOLD },
  { id: 'puente-h', termino: 'puente de hidrógeno', variantes: ['puentes de hidrógeno', 'enlace de hidrógeno'], definicion: 'Atracción entre un H unido a un átomo muy electronegativo (F, O, N) y un par libre de otro átomo electronegativo. Es mucho más débil que un enlace covalente.', fuente: RENG_GOLD },
  { id: 'london', termino: 'fuerzas de London', variantes: ['fuerza de London', 'dispersión de London', 'London'], definicion: 'Atracción débil entre todas las moléculas y átomos, debida a dipolos instantáneos que aparecen al moverse los electrones. Es la única entre moléculas apolares.', fuente: RENG_GOLD },
  { id: 'aleacion', termino: 'aleación', variantes: ['aleaciones'], definicion: 'Mezcla de un metal con otros elementos (normalmente metales) unidos por enlace metálico. Puede tener composiciones variables, sin fórmula fija.', fuente: RENG_GOLD },
  { id: 'subindice', termino: 'subíndice', variantes: ['subíndices'], definicion: 'Número pequeño abajo a la derecha de un símbolo: cuántos átomos de ese elemento hay en la fórmula.', fuente: RENG_ROJO }
]

export const rengGlosarioPorId = new Map(RENG_GLOSARIO.map((rengG) => [rengG.id, rengG]))

export interface RengSegmento {
  texto: string
  termino?: string
}

const RENG_LETRA = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ'
const rengEscapar = (rengS: string): string => rengS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const RENG_FORMAS: Array<{ forma: string; id: string }> = RENG_GLOSARIO.flatMap((rengG) => [rengG.termino, ...rengG.variantes].map((rengForma) => ({ forma: rengForma, id: rengG.id }))).sort(
  (rengA, rengB) => rengB.forma.length - rengA.forma.length
)
const RENG_PATRON = new RegExp(`(?<![${RENG_LETRA}/])(${RENG_FORMAS.map((rengF) => rengEscapar(rengF.forma)).join('|')})(?![${RENG_LETRA}])`, 'gi')
const RENG_ID_DE_FORMA = new Map(RENG_FORMAS.map((rengF) => [rengF.forma.toLowerCase(), rengF.id]))

export function rengMarcarTerminos(rengTexto: string, rengYaMarcados: Set<string> = new Set()): RengSegmento[] {
  const rengOut: RengSegmento[] = []
  let rengUltimo = 0
  for (const rengM of rengTexto.matchAll(RENG_PATRON)) {
    const rengId = RENG_ID_DE_FORMA.get((rengM[0] as string).toLowerCase())
    if (!rengId || rengYaMarcados.has(rengId)) continue
    rengYaMarcados.add(rengId)
    if (rengM.index > rengUltimo) rengOut.push({ texto: rengTexto.slice(rengUltimo, rengM.index) })
    rengOut.push({ texto: rengM[0], termino: rengId })
    rengUltimo = rengM.index + rengM[0].length
  }
  if (rengUltimo < rengTexto.length) rengOut.push({ texto: rengTexto.slice(rengUltimo) })
  return rengOut
}
