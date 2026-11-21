const RENG_EXTRA = [47, 50, 53, 54, 56, 74, 78, 79, 80, 82, 92]

export const rengEsElementoBasico = (rengZ: number): boolean => rengZ <= 36 || RENG_EXTRA.includes(rengZ)
