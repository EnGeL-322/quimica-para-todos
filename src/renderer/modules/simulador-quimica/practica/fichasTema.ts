import { RENG_TEMAS } from './banco'
import type { RengRama, RengTema } from './tipos'

export interface RengFichaTema {
  pregunta: string
  claves: readonly string[]
  miniatura: string
}

export const RENG_FICHAS_TEMA: Readonly<Record<string, RengFichaTema>> = {
  mol: { pregunta: '¿Cuántos moles y cuántas partículas hay en una muestra?', claves: ['mol', 'masa molar', 'avogadro', 'gramos', 'pesada', 'composicion', 'incertidumbre'], miniatura: 'mol' },
  concentracion: { pregunta: '¿Qué concentración queda al diluir una disolución?', claves: ['molaridad', 'disolucion', 'diluir', 'diluciones', 'concentracion', 'reactivo comercial', 'porcentaje'], miniatura: 'concentracion' },
  ajuste: { pregunta: '¿Qué coeficientes igualan los átomos y la carga?', claves: ['balancear', 'igualar', 'ecuacion', 'coeficientes', 'conservacion', 'masa', 'carga'], miniatura: 'ajuste' },
  estequiometria: { pregunta: '¿Cuánto producto se obtiene y qué reactivo se agota?', claves: ['reactivo limitante', 'rendimiento', 'producto', 'proporcion', 'moles', 'masa'], miniatura: 'estequiometria' },
  'formular-nombrar': { pregunta: '¿Cómo se escribe y cómo se llama este compuesto?', claves: ['formulacion', 'nomenclatura', 'oxidos', 'hidroxidos', 'acidos', 'sales', 'iones', 'iupac', 'stock'], miniatura: 'formular-nombrar' },
  oxidacion: { pregunta: '¿Qué número de oxidación tiene cada elemento?', claves: ['estado de oxidacion', 'redox', 'iones', 'electrones', 'reglas'], miniatura: 'oxidacion' },
  enlace: { pregunta: '¿El enlace es iónico o covalente, y por qué?', claves: ['electronegatividad', 'ionico', 'covalente', 'polaridad', 'cristal', 'molecula', 'caracter ionico'], miniatura: 'enlace' },
  redox: { pregunta: '¿Quién se oxida, quién se reduce y cómo se ajusta?', claves: ['oxidacion', 'reduccion', 'semirreaccion', 'ion-electron', 'electrones', 'medio acido', 'medio basico', 'oxidante', 'reductor'], miniatura: 'redox' },
  grupos: { pregunta: '¿Qué grupo funcional tiene esta molécula?', claves: ['funcional', 'alcohol', 'aldehido', 'cetona', 'acido carboxilico', 'ester', 'amina', 'amida', 'eter', 'organica'], miniatura: 'grupos' },
  nomenclatura: { pregunta: '¿Cómo se nombra según la IUPAC?', claves: ['iupac', 'nombrar', 'cadena', 'ramificaciones', 'localizadores', 'semidesarrollada'], miniatura: 'nomenclatura' },
  estructura: { pregunta: '¿Cómo se escribe esta estructura en forma condensada o SMILES?', claves: ['smiles', 'condensada', 'formula', 'dibujar', 'esqueleto', 'molecula'], miniatura: 'estructura' },
  isomeria: { pregunta: '¿Cuántos isómeros existen y cuál es uno de función?', claves: ['isomeros', 'isomero', 'constitucional', 'formula molecular', 'cadena', 'posicion', 'funcion'], miniatura: 'isomeria' },
  estereo: { pregunta: '¿Qué configuración R/S o E/Z tiene?', claves: ['quiral', 'enantiomero', 'cip', 'prioridades', 'doble enlace', 'centro estereogenico', 'cis', 'trans', 'cuna'], miniatura: 'estereo' },
  'reacciones-organicas': { pregunta: '¿Qué producto se forma con estas condiciones?', claves: ['adicion', 'sustitucion', 'eliminacion', 'oxidacion de alcoholes', 'esterificacion', 'hidrolisis', 'markovnikov', 'producto'], miniatura: 'reacciones-organicas' },
  ph: { pregunta: '¿Qué pH tiene la disolución?', claves: ['acidos', 'bases', 'acido', 'base', 'ph', 'poh', 'fuerte', 'debil', 'amortiguador', 'buffer', 'ka', 'kb'], miniatura: 'ph' },
  valoracion: { pregunta: '¿Dónde está el punto de equivalencia y cuál es el pH?', claves: ['titulacion', 'neutralizacion', 'equivalencia', 'curva', 'bureta', 'indicador', 'acido', 'base'], miniatura: 'valoracion' },
  dilucion: { pregunta: '¿Qué alícuota y qué factor preparan este patrón?', claves: ['alicuota', 'dilucion en serie', 'patrones', 'mezcla', 'pipeta', 'factor de dilucion', 'disolucion'], miniatura: 'dilucion' },
  calibracion: { pregunta: '¿Qué concentración da la recta y con qué incertidumbre?', claves: ['calibrado', 'recta', 'regresion', 'pendiente', 'interpolacion', 'incertidumbre', 'absorbancia', 'patrones'], miniatura: 'calibracion' },
  cinetica: { pregunta: '¿Qué tan rápido reacciona y cómo cambia con la temperatura?', claves: ['velocidad', 'semivida', 'orden de reaccion', 'constante cinetica', 'arrhenius', 'energia de activacion', 'ley integrada'], miniatura: 'cinetica' },
  equilibrio: { pregunta: '¿Hacia dónde se desplaza el equilibrio y cuánto?', claves: ['constante de equilibrio', 'le chatelier', 'tabla ice', 'cociente de reaccion', 'q frente a k', 'desplazamiento', 'sensibilidad'], miniatura: 'equilibrio' },
  termo: { pregunta: '¿Libera o absorbe calor y ocurre por sí sola?', claves: ['entalpia', 'entropia', 'gibbs', 'espontaneidad', 'hess', 'energia libre', 'calor', 'exotermica', 'endotermica'], miniatura: 'termo' },
  'ajuste-cinetico': { pregunta: '¿Qué orden de reacción describe mejor los datos?', claves: ['datos', 'ajuste', 'modelos', 'orden', 'regresion', 'residuos', 'linealizacion'], miniatura: 'ajuste-cinetico' }
}

export const RENG_MINIATURAS_RAMA: Readonly<Record<RengRama, string>> = {
  general: 'rama-general',
  inorganica: 'rama-inorganica',
  organica: 'rama-organica',
  analitica: 'rama-analitica',
  fisicoquimica: 'rama-fisicoquimica'
}

export const RENG_MINIATURA_ESCENA: Readonly<Record<'acidobase' | 'mezcla' | 'cinetica' | 'equilibrio' | 'termo' | 'dilucion' | 'colorimetria' | 'solubilidad' | 'electroquimica' | 'isomeros', { miniatura: string; rama: RengRama }>> = {
  acidobase: { miniatura: 'ph', rama: 'analitica' },
  mezcla: { miniatura: 'valoracion', rama: 'analitica' },
  cinetica: { miniatura: 'cinetica', rama: 'fisicoquimica' },
  equilibrio: { miniatura: 'equilibrio', rama: 'fisicoquimica' },
  termo: { miniatura: 'termo', rama: 'fisicoquimica' },
  dilucion: { miniatura: 'dilucion', rama: 'analitica' },
  colorimetria: { miniatura: 'calibracion', rama: 'analitica' },
  solubilidad: { miniatura: 'equilibrio', rama: 'fisicoquimica' },
  electroquimica: { miniatura: 'redox', rama: 'inorganica' },
  isomeros: { miniatura: 'isomeria', rama: 'organica' }
}

export const rengNormalizarBusqueda = (rengT: string): string => rengT.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export const rengFichaDeTema = (rengId: string): RengFichaTema | undefined => RENG_FICHAS_TEMA[rengId]

export const rengPreguntaDeTema = (rengTema: RengTema): string => RENG_FICHAS_TEMA[rengTema.id]?.pregunta ?? rengTema.resumen

export function rengTemaCoincide(rengTema: RengTema, rengConsulta: string): boolean {
  const rengFichaT = RENG_FICHAS_TEMA[rengTema.id]
  const rengPajar = rengNormalizarBusqueda(`${rengTema.nombre} ${rengTema.resumen} ${rengFichaT?.pregunta ?? ''} ${rengFichaT?.claves.join(' ') ?? ''}`)
  return rengNormalizarBusqueda(rengConsulta)
    .split(/\s+/)
    .filter((rengP) => rengP !== '')
    .every((rengP) => rengPajar.includes(rengP) || (rengP.length > 3 && rengP.endsWith('s') && rengPajar.includes(rengP.slice(0, -1))))
}

export function rengFiltrarTemas(rengConsulta: string, rengRama: RengRama | null, rengTemas: readonly RengTema[] = RENG_TEMAS): RengTema[] {
  return rengTemas.filter((rengT) => (rengRama === null || rengT.rama === rengRama) && rengTemaCoincide(rengT, rengConsulta))
}
