export const RENG_ARCHIVO_TEMARIO = 'docs/TEMARIO-MAESTRO.md'
export const RENG_ARCHIVO_DATOS = 'src/renderer/modules/simulador-quimica/temario/datos.generado.ts'
export const RENG_VERSION_TEMARIO = 1

export function rengAnalizarTemario(rengTexto) {
  const rengLineas = rengTexto.split(/\r?\n/)
  const rengNiveles = []
  let rengNivel = null
  let rengBloque = null
  let rengAcumulaDescripcion = false
  for (const rengLinea of rengLineas) {
    if (/^## RUTA DE APRENDIZAJE/.test(rengLinea) || /^## Recuentos y observaciones/.test(rengLinea)) break
    let rengM = rengLinea.match(/^## NIVEL (\d+)\. (.+)$/)
    if (rengM) {
      rengNivel = { numero: Number(rengM[1]), titulo: rengM[2].trim(), descripcion: '', bloques: [] }
      rengNiveles.push(rengNivel)
      rengBloque = null
      rengAcumulaDescripcion = true
      continue
    }
    rengM = rengLinea.match(/^### (\d+)\. (.+)$/)
    if (rengM) {
      if (!rengNivel) throw new Error(`Bloque ${rengM[1]} fuera de un nivel`)
      rengBloque = { numero: Number(rengM[1]), titulo: rengM[2].trim(), nota: '', subtemas: [] }
      rengNivel.bloques.push(rengBloque)
      rengAcumulaDescripcion = false
      continue
    }
    rengM = rengLinea.match(/^(\d+)\. (.+)$/)
    if (rengM && rengBloque) {
      rengBloque.subtemas.push({ posicion: Number(rengM[1]), titulo: rengM[2].trim() })
      continue
    }
    const rengTextoLinea = rengLinea.trim()
    if (rengTextoLinea === '') continue
    if (rengAcumulaDescripcion && rengNivel) rengNivel.descripcion = rengNivel.descripcion ? `${rengNivel.descripcion} ${rengTextoLinea}` : rengTextoLinea
    else if (rengBloque && /^Nota:/.test(rengTextoLinea)) rengBloque.nota = rengTextoLinea
  }
  return rengNiveles
}

export function rengValidarAnalisis(rengNiveles) {
  const rengProblemas = []
  let rengEsperado = 1
  for (const rengN of rengNiveles) {
    for (const rengB of rengN.bloques) {
      if (rengB.numero !== rengEsperado) rengProblemas.push(`bloque ${rengB.numero}: se esperaba ${rengEsperado}`)
      rengEsperado = rengB.numero + 1
      rengB.subtemas.forEach((rengS, rengI) => {
        if (rengS.posicion !== rengI + 1) rengProblemas.push(`n${rengN.numero}-b${rengB.numero}: subtema ${rengS.posicion} en la posición ${rengI + 1}`)
      })
    }
  }
  return rengProblemas
}

export function rengConstruirDatos(rengNiveles) {
  return {
    version: RENG_VERSION_TEMARIO,
    niveles: rengNiveles.map((rengN) => ({
      numero: rengN.numero,
      titulo: rengN.titulo,
      descripcion: rengN.descripcion,
      bloques: rengN.bloques.map((rengB) => ({
        id: `n${rengN.numero}-b${rengB.numero}`,
        numero: rengB.numero,
        titulo: rengB.titulo,
        tipo: rengN.numero === 8 ? 'problemas' : 'curso',
        nota: rengB.nota,
        subtemas: rengB.subtemas.map((rengS) => ({ id: `n${rengN.numero}-b${rengB.numero}-s${rengS.posicion}`, titulo: rengS.titulo }))
      }))
    }))
  }
}

const rengCadena = (rengS) => `'${rengS.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

export function rengEscribirModulo(rengDatos) {
  const rengSalida = []
  rengSalida.push("import type { RengTemario } from './tipos'")
  rengSalida.push('')
  rengSalida.push('export const RENG_TEMARIO_GENERADO: RengTemario = {')
  rengSalida.push(`  version: ${rengDatos.version},`)
  rengSalida.push('  niveles: [')
  rengDatos.niveles.forEach((rengN, rengIN) => {
    rengSalida.push('    {')
    rengSalida.push(`      numero: ${rengN.numero},`)
    rengSalida.push(`      titulo: ${rengCadena(rengN.titulo)},`)
    rengSalida.push(`      descripcion: ${rengCadena(rengN.descripcion)},`)
    rengSalida.push('      bloques: [')
    rengN.bloques.forEach((rengB, rengIB) => {
      rengSalida.push('        {')
      rengSalida.push(`          id: ${rengCadena(rengB.id)},`)
      rengSalida.push(`          numero: ${rengB.numero},`)
      rengSalida.push(`          titulo: ${rengCadena(rengB.titulo)},`)
      rengSalida.push(`          tipo: ${rengCadena(rengB.tipo)},`)
      rengSalida.push(`          nota: ${rengCadena(rengB.nota)},`)
      rengSalida.push('          subtemas: [')
      rengB.subtemas.forEach((rengS, rengIS) => rengSalida.push(`            { id: ${rengCadena(rengS.id)}, titulo: ${rengCadena(rengS.titulo)} }${rengIS < rengB.subtemas.length - 1 ? ',' : ''}`))
      rengSalida.push('          ]')
      rengSalida.push(`        }${rengIB < rengN.bloques.length - 1 ? ',' : ''}`)
    })
    rengSalida.push('      ]')
    rengSalida.push(`    }${rengIN < rengDatos.niveles.length - 1 ? ',' : ''}`)
  })
  rengSalida.push('  ]')
  rengSalida.push('}')
  rengSalida.push('')
  return rengSalida.join('\n')
}

export function rengGenerarModuloDesdeTexto(rengTexto) {
  const rengNiveles = rengAnalizarTemario(rengTexto)
  const rengProblemas = rengValidarAnalisis(rengNiveles)
  if (rengProblemas.length > 0) throw new Error(`Temario inconsistente: ${rengProblemas.join('; ')}`)
  return rengEscribirModulo(rengConstruirDatos(rengNiveles))
}
