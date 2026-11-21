import { readFile, writeFile } from 'node:fs/promises'

const rengFuente = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON'
const rengDestino = new URL('../src/renderer/modules/tabla-periodica/propiedades-pubchem.json', import.meta.url)
const [, , rengFecha, rengRuta] = process.argv
if (!rengFecha || !/^\d{4}-\d{2}-\d{2}$/.test(rengFecha)) throw new Error('Indica la fecha de consulta AAAA-MM-DD y, si existe, el archivo JSON descargado.')

async function rengDescargar() {
  const rengR = await fetch(rengFuente, { signal: AbortSignal.timeout(30000) })
  if (!rengR.ok) throw new Error(`PubChem respondió ${rengR.status}.`)
  return rengR.json()
}

const { Table: rengTabla } = rengRuta ? JSON.parse(await readFile(rengRuta, 'utf8')) : await rengDescargar()
const rengColumnas = rengTabla.Columns.Column
const rengZ = rengColumnas.indexOf('AtomicNumber')
const rengSimbolo = rengColumnas.indexOf('Symbol')
const rengE = rengColumnas.indexOf('Electronegativity')
const rengO = rengColumnas.indexOf('OxidationStates')
if ([rengZ, rengSimbolo, rengE, rengO].some((rengI) => rengI < 0) || rengTabla.Row.length !== 118) throw new Error('La estructura de la tabla de PubChem cambió.')

const rengElementos = rengTabla.Row.map(({ Cell: rengC }, rengI) => {
  if (Number(rengC[rengZ]) !== rengI + 1 || !/^[A-Z][a-z]?$/.test(rengC[rengSimbolo])) throw new Error(`Identidad inesperada en la fila ${rengI + 1}.`)
  const rengElectronegatividad = rengC[rengE] ? Number(rengC[rengE]) : null
  const rengOxidacion = rengC[rengO] || null
  if ((rengElectronegatividad !== null && !Number.isFinite(rengElectronegatividad)) || (rengOxidacion && !/^[\d+,\s-]+$/.test(rengOxidacion))) {
    throw new Error(`Propiedad inesperada en ${rengC[rengSimbolo]}.`)
  }
  return [rengC[rengSimbolo], rengElectronegatividad, rengOxidacion]
})

await writeFile(rengDestino, `{"fuente":${JSON.stringify(rengFuente)},"consulta":${JSON.stringify(rengFecha)},"elementos":[\n${rengElementos.map((rengFila) => JSON.stringify(rengFila)).join(',\n')}\n]}\n`)
