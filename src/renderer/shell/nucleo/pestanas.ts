export function rengPestanaPorTecla<RengT>(rengIds: readonly RengT[], rengActual: RengT, rengTecla: string): RengT | null {
  const rengN = rengIds.length
  if (rengN === 0) return null
  const rengI = rengIds.indexOf(rengActual)
  switch (rengTecla) {
    case 'ArrowRight':
      return rengIds[rengI < 0 ? 0 : (rengI + 1) % rengN] ?? null
    case 'ArrowLeft':
      return rengIds[rengI < 0 ? rengN - 1 : (rengI - 1 + rengN) % rengN] ?? null
    case 'Home':
      return rengIds[0] ?? null
    case 'End':
      return rengIds[rengN - 1] ?? null
    default:
      return null
  }
}
