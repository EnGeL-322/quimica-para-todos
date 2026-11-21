import type { RengFiguraN1, RengSerieFiguraN1 } from './tipos'

export function rengProblemasFiguraN1(rengF: RengFiguraN1): string[] {
  const rengP: string[] = []
  if (!/^fig-[a-z0-9-]{2,40}$/.test(rengF.id)) rengP.push(`id de figura fuera de patrón: ${rengF.id}`)
  if (rengF.titulo.trim().length < 8) rengP.push(`${rengF.id}: falta el título`)
  if (rengF.pie.trim().length < 30) rengP.push(`${rengF.id}: falta el pie de figura`)
  if (rengF.alternativo.trim().length < 40) rengP.push(`${rengF.id}: falta el texto alternativo`)
  for (const rengE of [rengF.x, rengF.y]) {
    if (!Number.isFinite(rengE.min) || !Number.isFinite(rengE.max) || !(rengE.max > rengE.min)) rengP.push(`${rengF.id}: eje «${rengE.titulo}» con extremos no válidos`)
    if (rengE.titulo.trim() === '') rengP.push(`${rengF.id}: eje sin título`)
  }
  if (rengF.series.length === 0 || rengF.series.length > 4) rengP.push(`${rengF.id}: debe tener de 1 a 4 series`)
  if (new Set(rengF.series.map((rengS) => rengS.nombre)).size !== rengF.series.length) rengP.push(`${rengF.id}: series con el mismo nombre`)
  for (const rengS of rengF.series) {
    if (rengS.puntos.length < 2) rengP.push(`${rengF.id}: la serie «${rengS.nombre}» tiene menos de 2 puntos`)
    if (rengS.puntos.some(([rengA, rengB]) => !Number.isFinite(rengA) || !Number.isFinite(rengB))) rengP.push(`${rengF.id}: la serie «${rengS.nombre}» tiene puntos no finitos`)
    const rengFuera = rengS.puntos.filter(([rengA, rengB]) => rengA < rengF.x.min - 1e-9 || rengA > rengF.x.max + 1e-9 || rengB < rengF.y.min - 1e-9 || rengB > rengF.y.max + 1e-9)
    if (rengFuera.length > 0) rengP.push(`${rengF.id}: la serie «${rengS.nombre}» tiene ${rengFuera.length} puntos fuera de los ejes`)
  }
  return rengP
}

export function rengFiguraN1(rengF: RengFiguraN1): RengFiguraN1 {
  const rengP = rengProblemasFiguraN1(rengF)
  if (rengP.length > 0) throw new Error(`Figura no válida: ${rengP.join('; ')}`)
  return rengF
}

export function rengMuestrearN1(rengNombre: string, rengF: (rengX: number) => number, rengA: number, rengB: number, rengN = 40): RengSerieFiguraN1 {
  return { nombre: rengNombre, puntos: Array.from({ length: rengN + 1 }, (_rengV, rengI) => { const rengX = rengA + ((rengB - rengA) * rengI) / rengN; return [rengX, rengF(rengX)] as const }) }
}
