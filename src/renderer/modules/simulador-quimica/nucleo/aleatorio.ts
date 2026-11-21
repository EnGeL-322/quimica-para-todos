export function rengAleatorio(rengSemilla: number): () => number {
  let rengA = rengSemilla >>> 0
  return () => {
    rengA = (rengA + 0x6d2b79f5) >>> 0
    let rengT = rengA
    rengT = Math.imul(rengT ^ (rengT >>> 15), rengT | 1)
    rengT ^= rengT + Math.imul(rengT ^ (rengT >>> 7), rengT | 61)
    return ((rengT ^ (rengT >>> 14)) >>> 0) / 4294967296
  }
}
