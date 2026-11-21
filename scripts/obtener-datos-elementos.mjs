#!/usr/bin/env node
import { writeFileSync } from 'node:fs'

const RENG_SPARQL = 'https://query.wikidata.org/sparql'
const RENG_UA = 'QuimicaParaTodos/0.1 (app educativa offline; datos CC0)'

async function rengConsulta(rengQ) {
  const rengUrl = `${RENG_SPARQL}?format=json&query=${encodeURIComponent(rengQ)}`
  for (let rengI = 0; rengI < 3; rengI++) {
    const rengR = await fetch(rengUrl, { headers: { 'User-Agent': RENG_UA, Accept: 'application/sparql-results+json' } })
    if (rengR.ok) return (await rengR.json()).results.bindings
    await new Promise((rengX) => setTimeout(rengX, 2000 * (rengI + 1)))
  }
  throw new Error('Wikidata no responde')
}

const RENG_BASE = '?e wdt:P31 wd:Q11344; wdt:P1086 ?z .'
const rengCantidad = (rengProp) => `
SELECT ?z ?v ?u (COUNT(?ref) AS ?refs) WHERE {
  ${RENG_BASE}
  ?e p:${rengProp} ?st . ?st psv:${rengProp} ?nodo . ?nodo wikibase:quantityAmount ?v ; wikibase:quantityUnit ?u .
  OPTIONAL { ?st prov:wasDerivedFrom ?ref }
} GROUP BY ?z ?v ?u ORDER BY ?z`

const RENG_A_SI = {
  Q11579: { K: (rengX) => rengX },
  Q25267: { K: (rengX) => rengX + 273.15 },
  Q42289: { K: (rengX) => ((rengX - 32) * 5) / 9 + 273.15 },
  Q844211: { D: (rengX) => rengX },
  Q13147228: { D: (rengX) => rengX * 1000 }
}

const rengDatos = {}
const rengPoner = (rengZ, rengK, rengValor) => {
  const rengE = (rengDatos[rengZ] ??= { z: rengZ })
  const rengLista = (rengE[rengK] ??= [])
  const rengIgual = rengLista.find((rengX) => Math.abs(rengX.v - rengValor.v) <= Math.abs(rengValor.v) * 5e-4)
  if (rengIgual) rengIgual.conReferencia ||= rengValor.conReferencia
  else rengLista.push(rengValor)
}

for (const [rengProp, rengClave, rengTipo] of [['P2101', 'fusionK', 'K'], ['P2102', 'ebullicionK', 'K'], ['P2054', 'densidadKgM3', 'D']]) {
  const rengFilas = await rengConsulta(rengCantidad(rengProp))
  for (const rengF of rengFilas) {
    const rengConv = RENG_A_SI[rengF.u.value.split('/').pop()]?.[rengTipo]
    if (!rengConv) continue
    const rengV = Number(rengConv(Number(rengF.v.value)).toPrecision(6))
    rengPoner(Number(rengF.z.value), rengClave, { v: rengV, conReferencia: Number(rengF.refs.value) > 0 })
  }
}

const rengDesc = await rengConsulta(`
SELECT ?z (MIN(YEAR(?t)) AS ?anio) WHERE {
  ${RENG_BASE}
  OPTIONAL { ?e wdt:P575 ?t }
} GROUP BY ?z ORDER BY ?z`)
for (const rengF of rengDesc) {
  const rengZ = Number(rengF.z.value)
  const rengE = (rengDatos[rengZ] ??= { z: rengZ })
  if (rengF.anio) rengE.anioDescubrimiento = Number(rengF.anio.value)
}

const rengQuienes = await rengConsulta(`
SELECT ?z ?d ?dl (LANG(?dl) AS ?l) WHERE {
  ${RENG_BASE}
  ?e wdt:P61 ?d . ?d rdfs:label ?dl FILTER(LANG(?dl)="es" || LANG(?dl)="en")
} ORDER BY ?z`)
const rengPorPersona = new Map()
for (const rengF of rengQuienes) {
  const rengK = `${rengF.z.value}|${rengF.d.value}`
  const rengPrevio = rengPorPersona.get(rengK)
  if (!rengPrevio || (rengF.l.value === 'es' && rengPrevio.l !== 'es')) rengPorPersona.set(rengK, { z: Number(rengF.z.value), l: rengF.l.value, nombre: rengF.dl.value })
}
for (const { z: rengZ, nombre: rengNombre } of rengPorPersona.values()) {
  const rengE = (rengDatos[rengZ] ??= { z: rengZ })
  rengE.descubridores = rengE.descubridores ? `${rengE.descubridores} · ${rengNombre}` : rengNombre
}

const rengSalida = {
  fuente: 'Wikidata (https://www.wikidata.org), consulta SPARQL pública',
  licencia: 'CC0 1.0 (dominio público)',
  obtenido: new Date().toISOString().slice(0, 10),
  nota: 'Cada magnitud puede tener varios valores (varias declaraciones); conReferencia indica si la declaración cita una fuente. Sin referencia = valor de Wikidata sin fuente verificable.',
  elementos: Object.values(rengDatos).filter((rengE) => rengE.z >= 1 && rengE.z <= 118).sort((rengA, rengB) => rengA.z - rengB.z)
}
writeFileSync(new URL('../src/renderer/modules/tabla-periodica/datos-wikidata.json', import.meta.url), JSON.stringify(rengSalida, null, 1))
console.log(`Elementos: ${rengSalida.elementos.length}`)
for (const rengK of ['fusionK', 'ebullicionK', 'densidadKgM3', 'anioDescubrimiento', 'descubridores']) console.log(rengK.padEnd(20), rengSalida.elementos.filter((rengE) => rengE[rengK] !== undefined).length)
