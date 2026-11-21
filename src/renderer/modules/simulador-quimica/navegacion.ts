export type RengDestinoQuimica = 'catalogo' | 'temario' | 'aprender' | 'practicas' | 'simulacion' | 'casos' | 'mesa'
export type RengHerramientaMesa = 'explorar' | 'enlaces' | 'formulacion' | 'reacciones'
export type RengSubExperimento = 'acidobase' | 'mezcla' | 'cinetica' | 'equilibrio' | 'termo' | 'dilucion' | 'colorimetria' | 'solubilidad' | 'electroquimica' | 'isomeros' | 'mesalibre'

export interface RengNavQuimica {
  destino: RengDestinoQuimica
  herramienta: RengHerramientaMesa
  experimento: RengSubExperimento | null
  tema: string | null
}

export const RENG_DESTINOS_QUIMICA: ReadonlyArray<{ id: RengDestinoQuimica; nombre: string; sub: string }> = [
  { id: 'catalogo', nombre: 'Catálogo', sub: 'Temas por ramas' },
  { id: 'temario', nombre: 'Temario', sub: 'Niveles, bloques y subtemas' },
  { id: 'aprender', nombre: 'Aprender', sub: 'Lecciones paso a paso' },
  { id: 'practicas', nombre: 'Prácticas por nivel', sub: 'Ejercicios con corrección' },
  { id: 'simulacion', nombre: 'Simulación', sub: 'Fenómenos para simular' },
  { id: 'casos', nombre: 'Casos reales', sub: 'Hogar, naturaleza, espacio y Tesla' },
  { id: 'mesa', nombre: 'Mesa molecular', sub: 'Construir e identificar' }
]

export const RENG_HERRAMIENTAS_MESA: ReadonlyArray<{ id: RengHerramientaMesa; nombre: string; ayuda: string }> = [
  { id: 'explorar', nombre: 'Construir', ayuda: 'Arrastra elementos o escribe una sustancia; la mesa la identifica y la mide' },
  { id: 'enlaces', nombre: 'Enlaces', ayuda: 'Cómo se forma, paso a paso, el enlace de lo que hay en la mesa' },
  { id: 'formulacion', nombre: 'Formulación', ayuda: 'Fórmula, nombres y estructura de lo construido' },
  { id: 'reacciones', nombre: 'Reacciones', ayuda: 'Ajustar la ecuación y calcular cantidades' }
]

export const RENG_EXPERIMENTOS_QUIMICA: readonly RengSubExperimento[] = ['acidobase', 'mezcla', 'cinetica', 'equilibrio', 'termo', 'dilucion', 'colorimetria', 'solubilidad', 'electroquimica', 'isomeros', 'mesalibre']

export const RENG_NAV_INICIAL: RengNavQuimica = { destino: 'catalogo', herramienta: 'explorar', experimento: null, tema: null }

const RENG_PREFIJOS_TEMA: ReadonlyArray<{ prefijo: string; destino: 'aprender' | 'practicas' }> = [
  { prefijo: 'aprender-', destino: 'aprender' },
  { prefijo: 'practicas-', destino: 'practicas' },
  { prefijo: 'ejercicios-', destino: 'practicas' }
]

const rengEsHerramienta = (rengS: string): rengS is RengHerramientaMesa => RENG_HERRAMIENTAS_MESA.some((rengH) => rengH.id === rengS)
const rengEsExperimento = (rengS: string): rengS is RengSubExperimento => (RENG_EXPERIMENTOS_QUIMICA as readonly string[]).includes(rengS)

export function rengNavDeSubruta(rengNav: RengNavQuimica, rengSub: string | null): RengNavQuimica {
  if (!rengSub) return rengNav
  if (rengSub === 'catalogo') return { ...rengNav, destino: 'catalogo' }
  if (rengSub === 'temario') return { ...rengNav, destino: 'temario', tema: null }
  if (rengSub === 'aprender') return { ...rengNav, destino: 'aprender', tema: null }
  if (rengSub === 'practicas' || rengSub === 'ejercicios') return { ...rengNav, destino: 'practicas', tema: null }
  const rengConTema = RENG_PREFIJOS_TEMA.find((rengP) => rengSub.startsWith(rengP.prefijo) && rengSub.length > rengP.prefijo.length)
  if (rengConTema) return { ...rengNav, destino: rengConTema.destino, tema: rengSub.slice(rengConTema.prefijo.length) }
  if (rengSub === 'simulacion') return { ...rengNav, destino: 'simulacion', experimento: null }
  if (rengSub === 'experimentos') return { ...rengNav, destino: 'simulacion' }
  if (rengEsExperimento(rengSub)) return { ...rengNav, destino: 'simulacion', experimento: rengSub }
  if (rengSub === 'casos') return { ...rengNav, destino: 'casos' }
  if (rengSub === 'mesa') return { ...rengNav, destino: 'mesa', herramienta: 'explorar' }
  if (rengEsHerramienta(rengSub)) return { ...rengNav, destino: 'mesa', herramienta: rengSub }
  return rengNav
}

export function rengSubrutaDeNav(rengNav: RengNavQuimica): string {
  switch (rengNav.destino) {
    case 'catalogo':
      return 'catalogo'
    case 'temario':
      return 'temario'
    case 'simulacion':
      return rengNav.experimento ?? 'simulacion'
    case 'aprender':
      return 'aprender'
    case 'practicas':
      return 'practicas'
    case 'casos':
      return 'casos'
    case 'mesa':
      return rengNav.herramienta === 'explorar' ? 'mesa' : rengNav.herramienta
  }
}

export const RENG_NOMBRE_EXPERIMENTO: Record<RengSubExperimento, string> = {
  acidobase: 'Ácidos y bases',
  mezcla: 'Mezcla ácido–base',
  cinetica: 'Velocidad de reacción',
  equilibrio: 'Equilibrio químico',
  termo: 'Energía de reacción',
  dilucion: 'Dilución con material de vidrio',
  colorimetria: 'Colorimetría: curva de calibración',
  solubilidad: 'Solubilidad: Q frente a Ksp',
  electroquimica: 'Electroquímica: celda galvánica',
  isomeros: 'Isómeros: comparación geométrica',
  mesalibre: 'Mesa libre: combinar sustancias'
}

export function rengDescripcionNav(rengNav: RengNavQuimica): { titulo: string; contexto: string } {
  switch (rengNav.destino) {
    case 'catalogo':
      return { titulo: 'Catálogo', contexto: 'Química · Catálogo' }
    case 'temario':
      return { titulo: 'Temario', contexto: 'Química · Temario' }
    case 'simulacion':
      return rengNav.experimento ? { titulo: RENG_NOMBRE_EXPERIMENTO[rengNav.experimento], contexto: 'Química · Simulación' } : { titulo: 'Simulación', contexto: 'Química · Simulación' }
    case 'aprender':
      return { titulo: 'Aprender', contexto: 'Química · Aprender' }
    case 'practicas':
      return { titulo: 'Prácticas por nivel', contexto: 'Química · Prácticas por nivel' }
    case 'casos':
      return { titulo: 'Casos reales', contexto: 'Química · Casos reales' }
    case 'mesa': {
      const rengH = RENG_HERRAMIENTAS_MESA.find((rengX) => rengX.id === rengNav.herramienta)!
      return { titulo: rengNav.herramienta === 'explorar' ? 'Mesa molecular' : rengH.nombre, contexto: 'Química · Mesa molecular' }
    }
  }
}
