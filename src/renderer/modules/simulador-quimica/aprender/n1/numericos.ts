export function rengRK4(rengDerivada: (rengX: number, rengY: number) => number, rengX0: number, rengY0: number, rengX1: number, rengPasos = 2000): number {
  if (!Number.isFinite(rengX0) || !Number.isFinite(rengX1) || !Number.isFinite(rengY0)) return NaN
  const rengH = (rengX1 - rengX0) / rengPasos
  let rengX = rengX0
  let rengY = rengY0
  for (let rengI = 0; rengI < rengPasos; rengI++) {
    const rengK1 = rengDerivada(rengX, rengY)
    const rengK2 = rengDerivada(rengX + rengH / 2, rengY + (rengH * rengK1) / 2)
    const rengK3 = rengDerivada(rengX + rengH / 2, rengY + (rengH * rengK2) / 2)
    const rengK4 = rengDerivada(rengX + rengH, rengY + rengH * rengK3)
    rengY += (rengH / 6) * (rengK1 + 2 * rengK2 + 2 * rengK3 + rengK4)
    rengX += rengH
  }
  return rengY
}

export function rengBiseccion(rengF: (rengX: number) => number, rengA: number, rengB: number, rengIteraciones = 200): number {
  let rengIzq = rengA
  let rengDer = rengB
  let rengFI = rengF(rengIzq)
  if (!(rengFI * rengF(rengDer) <= 0)) return NaN
  for (let rengI = 0; rengI < rengIteraciones; rengI++) {
    const rengM = (rengIzq + rengDer) / 2
    const rengFM = rengF(rengM)
    if (rengFM === 0) return rengM
    if (rengFI * rengFM < 0) rengDer = rengM
    else {
      rengIzq = rengM
      rengFI = rengFM
    }
  }
  return (rengIzq + rengDer) / 2
}
