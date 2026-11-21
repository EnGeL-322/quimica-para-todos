const RENG_FORMULA_PERMITIDA = /^[A-Za-z0-9()[\]+\-^_.,·:;=<>~*/\s'"|]*$/

export function rengTexDeFormulaQuimica(rengFormula: string): string | null {
  const rengLimpia = rengFormula.trim()
  if (rengLimpia === '' || !RENG_FORMULA_PERMITIDA.test(rengLimpia)) return null
  return String.raw`\ce{${rengLimpia}}`
}
