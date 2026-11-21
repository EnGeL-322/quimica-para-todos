import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Molecule } from 'openchemlib'

const rengRaiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const rengSalida = join(rengRaiz, 'src/renderer/modules/simulador-quimica/miniaturas')
mkdirSync(rengSalida, { recursive: true })

const RENG_ANCHO = 320
const RENG_ALTO = 180
const RENG_C = {
  texto: '#dbe7ff',
  suave: '#a9b8dd',
  linea: '#7f8db8',
  cian: '#38d0ff',
  violeta: '#8b7bff',
  verde: '#3be8b0',
  ambar: '#ffb547',
  rojo: '#ff5d73',
  blanco: '#f4f8ff',
  fondoA: '#1b2747',
  fondoB: '#080c1a'
}
const RENG_ACENTO = { general: RENG_C.cian, inorganica: RENG_C.violeta, organica: RENG_C.verde, analitica: RENG_C.ambar, fisicoquimica: RENG_C.rojo }

const rengN = (rengV) => String(Math.round(rengV * 10) / 10)
const rengFuente = "font-family=\"'Segoe UI',system-ui,sans-serif\""

const rengTexto = (rengX, rengY, rengS, { tam = 13, color = RENG_C.texto, ancla = 'middle', peso = 600, mono = false } = {}) =>
  `<text x="${rengN(rengX)}" y="${rengN(rengY)}" font-size="${tam}" fill="${color}" text-anchor="${ancla}" font-weight="${peso}" ${mono ? `font-family="Consolas,'Cascadia Code',monospace"` : rengFuente}>${rengS}</text>`
const rengLinea = (rengX1, rengY1, rengX2, rengY2, { color = RENG_C.linea, ancho = 1.6, trazo = '', op = 1 } = {}) =>
  `<line x1="${rengN(rengX1)}" y1="${rengN(rengY1)}" x2="${rengN(rengX2)}" y2="${rengN(rengY2)}" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round"${trazo ? ` stroke-dasharray="${trazo}"` : ''}${op < 1 ? ` opacity="${op}"` : ''}/>`
const rengCirculo = (rengX, rengY, rengR, { relleno = 'none', borde = 'none', ancho = 1.6, op = 1 } = {}) =>
  `<circle cx="${rengN(rengX)}" cy="${rengN(rengY)}" r="${rengN(rengR)}" fill="${relleno}" stroke="${borde}" stroke-width="${ancho}"${op < 1 ? ` opacity="${op}"` : ''}/>`
const rengRect = (rengX, rengY, rengW, rengH, { relleno = 'none', borde = 'none', ancho = 1.6, r = 0, op = 1 } = {}) =>
  `<rect x="${rengN(rengX)}" y="${rengN(rengY)}" width="${rengN(rengW)}" height="${rengN(rengH)}" rx="${r}" fill="${relleno}" stroke="${borde}" stroke-width="${ancho}"${op < 1 ? ` opacity="${op}"` : ''}/>`
const rengRuta = (rengD, { relleno = 'none', borde = 'none', ancho = 1.6, trazo = '', op = 1, cierre = 'round' } = {}) =>
  `<path d="${rengD}" fill="${relleno}" stroke="${borde}" stroke-width="${ancho}" stroke-linejoin="${cierre}" stroke-linecap="round"${trazo ? ` stroke-dasharray="${trazo}"` : ''}${op < 1 ? ` opacity="${op}"` : ''}/>`
const rengFlecha = (rengX1, rengY1, rengX2, rengY2, color = RENG_C.texto, ancho = 2) => {
  const rengA = Math.atan2(rengY2 - rengY1, rengX2 - rengX1)
  const rengL = 8
  const rengP = (rengD) => `${rengN(rengX2 - rengL * Math.cos(rengA + rengD))} ${rengN(rengY2 - rengL * Math.sin(rengA + rengD))}`
  return `${rengLinea(rengX1, rengY1, rengX2 - 3 * Math.cos(rengA), rengY2 - 3 * Math.sin(rengA), { color, ancho })}${rengRuta(`M${rengP(0.45)} L${rengN(rengX2)} ${rengN(rengY2)} L${rengP(-0.45)}`, { borde: color, ancho })}`
}
const rengGrupo = (rengTransf, rengInterior) => `<g transform="${rengTransf}">${rengInterior}</g>`

const rengMarco = (rengRama, rengId, rengCuerpo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${RENG_ANCHO} ${RENG_ALTO}" width="${RENG_ANCHO}" height="${RENG_ALTO}"><desc>© 2026 ramiroengelbert. Dibujo propio generado con scripts/generar-miniaturas.mjs.</desc><defs><radialGradient id="f" cx=".5" cy=".3" r=".9"><stop offset="0" stop-color="${RENG_C.fondoA}"/><stop offset="1" stop-color="${RENG_C.fondoB}"/></radialGradient></defs><rect width="${RENG_ANCHO}" height="${RENG_ALTO}" fill="url(#f)"/><rect y="${RENG_ALTO - 4}" width="${RENG_ANCHO}" height="4" fill="${RENG_ACENTO[rengRama]}"/>${rengCuerpo}</svg>\n`

function rengEjes(rengX0, rengY0, rengX1, rengY1, rengEtqX = '', rengEtqY = '') {
  return `${rengLinea(rengX0, rengY0, rengX0, rengY1, { ancho: 1.8 })}${rengLinea(rengX0, rengY0, rengX1, rengY0, { ancho: 1.8 })}${rengEtqX ? rengTexto(rengX1, rengY0 + 14, rengEtqX, { tam: 11, ancla: 'end', color: RENG_C.suave, peso: 500 }) : ''}${rengEtqY ? rengTexto(rengX0 + 6, rengY1 + 2, rengEtqY, { tam: 11, ancla: 'start', color: RENG_C.suave, peso: 500 }) : ''}`
}

function rengCurva(rengF, rengX0, rengX1, rengMapaX, rengMapaY, rengPasos = 60) {
  const rengPuntos = []
  for (let rengI = 0; rengI <= rengPasos; rengI++) {
    const rengX = rengX0 + ((rengX1 - rengX0) * rengI) / rengPasos
    rengPuntos.push(`${rengI === 0 ? 'M' : 'L'}${rengN(rengMapaX(rengX))} ${rengN(rengMapaY(rengF(rengX)))}`)
  }
  return rengPuntos.join(' ')
}

const RENG_RGB = {
  'rgb(255,0,0)': RENG_C.rojo,
  'rgb(32,96,255)': RENG_C.cian,
  'rgb(255,160,0)': RENG_C.ambar,
  'rgb(192,0,255)': RENG_C.violeta,
  'rgb(0,128,0)': RENG_C.verde,
  'rgb(0,255,0)': RENG_C.verde,
  'rgb(160,0,0)': RENG_C.rojo,
  'rgb(166,41,41)': RENG_C.rojo,
  'rgb(0,0,0)': RENG_C.texto
}

function rengEstructura(rengSmiles, { x, y, w, h, formula, colorear, rotular } = {}) {
  const rengMol = Molecule.fromSmiles(rengSmiles)
  if (formula && rengMol.getMolecularFormula().formula !== formula) throw new Error(`${rengSmiles}: fórmula ${rengMol.getMolecularFormula().formula}, esperada ${formula}`)
  colorear?.(rengMol)
  rotular?.(rengMol)
  const rengSvg = rengMol.toSVG(w, h, 'm', { autoCrop: true, autoCropMargin: 3, suppressChiralText: true, suppressCIPParity: true, suppressESR: true, noStereoProblem: true, strokeWidth: 1.6 })
  const rengVista = /viewBox="([^"]+)"/.exec(rengSvg)?.[1]
  if (!rengVista) throw new Error(`Sin viewBox: ${rengSmiles}`)
  let rengInterior = rengSvg.slice(rengSvg.indexOf('</style>') + 8, rengSvg.lastIndexOf('</svg>'))
  rengInterior = rengInterior
    .replace(/<(line|circle)[^>]*class="event"[^>]*\/>/g, '')
    .replace(/ id="[^"]*"/g, '')
    .replace(/rgb\(\d+,\d+,\d+\)/g, (rengC) => {
      if (!RENG_RGB[rengC]) console.warn(`Color sin asignar en ${rengSmiles}: ${rengC}`)
      return RENG_RGB[rengC] ?? rengC
    })
    .replace(/font-size="(\d+)"/g, 'font-size="$1" font-weight="600" font-family="Segoe UI,system-ui,sans-serif"')
    .replace(/\s*\n\s*/g, '')
  return `<svg x="${rengN(x)}" y="${rengN(y)}" width="${rengN(w)}" height="${rengN(h)}" viewBox="${rengVista}" preserveAspectRatio="xMidYMid meet">${rengInterior}</svg>`
}

function rengMatraz(rengCx, rengBase, rengEsc, rengNivel, rengColor, rengOp, rengId) {
  const rengVidrio = 'M-6 -72 V-47.2 A24 24 0 1 0 6 -47.2 V-72'
  return rengGrupo(
    `translate(${rengN(rengCx)} ${rengN(rengBase)}) scale(${rengEsc})`,
    `<clipPath id="${rengId}"><path d="${rengVidrio}Z"/></clipPath>${rengRect(-30, rengNivel, 60, 60, { relleno: rengColor, op: rengOp }).replace('<rect', `<rect clip-path="url(#${rengId})"`)}${rengRuta(rengVidrio, { borde: RENG_C.texto, ancho: 2 / rengEsc })}${rengLinea(-9, -72, 9, -72, { color: RENG_C.texto, ancho: 2 / rengEsc })}${rengLinea(-6, -58, 6, -58, { color: RENG_C.suave, ancho: 1.5 / rengEsc })}`
  )
}

function rengTubo(rengCx, rengY, rengAlto, rengAncho, rengColor, rengOp, rengId) {
  const rengR = rengAncho / 2
  const rengVidrio = `M${rengN(-rengR)} 0 V${rengN(rengAlto - rengR)} A${rengN(rengR)} ${rengN(rengR)} 0 0 0 ${rengN(rengR)} ${rengN(rengAlto - rengR)} V0`
  return rengGrupo(
    `translate(${rengN(rengCx)} ${rengN(rengY)})`,
    `<clipPath id="${rengId}"><path d="${rengVidrio}Z"/></clipPath>${rengRect(-rengR, rengAlto * 0.38, rengAncho, rengAlto, { relleno: rengColor, op: rengOp }).replace('<rect', `<rect clip-path="url(#${rengId})"`)}${rengRuta(rengVidrio, { borde: RENG_C.texto, ancho: 1.8 })}${rengLinea(-rengR - 2, 0, rengR + 2, 0, { color: RENG_C.texto, ancho: 1.8 })}`
  )
}

const rengMiniaturas = {}

rengMiniaturas.mol = () => {
  const rengBalanza =
    rengRect(78, 138, 164, 18, { relleno: '#26335f', borde: RENG_C.linea, r: 6 }) +
    rengRect(96, 94, 128, 44, { relleno: '#1f2b4d', borde: RENG_C.linea, r: 8 }) +
    rengRect(112, 102, 56, 26, { relleno: '#0b1530', borde: RENG_C.cian, ancho: 1.4, r: 4 }) +
    rengTexto(140, 120, '– – –', { tam: 15, color: RENG_C.cian, mono: true, peso: 700 }) +
    rengTexto(180, 120, 'g', { tam: 13, color: RENG_C.suave, ancla: 'start' }) +
    rengCirculo(204, 116, 6, { borde: RENG_C.linea, ancho: 1.4 }) +
    rengRuta('M96 94 H224', { borde: RENG_C.linea }) +
    rengLinea(160, 94, 160, 78, { color: RENG_C.linea, ancho: 3 }) +
    rengRuta('M104 76 Q160 86 216 76 Q208 66 160 66 Q112 66 104 76Z', { relleno: '#33427a', borde: RENG_C.texto, ancho: 1.8 }) +
    rengRuta('M126 66 Q160 24 194 66Z', { relleno: RENG_C.blanco, op: 0.9 }) +
    [0, 1, 2, 3, 4, 5].map((rengI) => rengCirculo(138 + rengI * 8.5, 63 - (rengI % 2) * 3, 2.2, { relleno: RENG_C.cian })).join('')
  return rengMarco('general', 'mol', rengBalanza + rengTexto(40, 40, 'n = m / M', { tam: 15, mono: true, peso: 700, color: RENG_C.suave, ancla: 'start' }))
}

rengMiniaturas.concentracion = () => {
  const rengCuerpo =
    rengMatraz(86, 150, 1.05, -33, RENG_C.cian, 0.92, 'c1') +
    rengMatraz(234, 150, 1.45, -27, RENG_C.cian, 0.3, 'c2') +
    rengFlecha(128, 96, 182, 96, RENG_C.texto) +
    rengTexto(155, 84, '+ agua', { tam: 13, color: RENG_C.suave }) +
    rengRuta('M155 108 q6 10 0 16 q-6 -6 0 -16Z', { relleno: RENG_C.cian, op: 0.9 })
  return rengMarco('general', 'concentracion', rengCuerpo)
}

rengMiniaturas.ajuste = () => {
  const rengA = (rengX, rengY) => rengCirculo(rengX, rengY, 8, { relleno: RENG_C.cian })
  const rengB = (rengX, rengY) => rengCirculo(rengX, rengY, 11, { relleno: RENG_C.violeta })
  const rengEnlace = (rengX1, rengY1, rengX2, rengY2) => rengLinea(rengX1, rengY1, rengX2, rengY2, { color: RENG_C.blanco, ancho: 3 })
  const rengAntes =
    rengEnlace(40, 62, 60, 62) + rengA(40, 62) + rengA(60, 62) +
    rengEnlace(40, 112, 60, 112) + rengA(40, 112) + rengA(60, 112) +
    rengEnlace(96, 88, 120, 88) + rengB(96, 88) + rengB(120, 88)
  const rengMolDespues = (rengX, rengY) => rengEnlace(rengX - 17, rengY + 4, rengX, rengY - 8) + rengEnlace(rengX + 17, rengY + 4, rengX, rengY - 8) + rengB(rengX, rengY - 8) + rengA(rengX - 17, rengY + 4) + rengA(rengX + 17, rengY + 4)
  return rengMarco('general', 'ajuste', rengAntes + rengFlecha(142, 88, 186, 88, RENG_C.texto) + rengMolDespues(236, 66) + rengMolDespues(236, 116) + rengTexto(80, 150, 'antes', { tam: 12, color: RENG_C.suave, peso: 500 }) + rengTexto(236, 150, 'después', { tam: 12, color: RENG_C.suave, peso: 500 }))
}

rengMiniaturas.estequiometria = () => {
  const rengBarra = (rengX, rengAlturaTotal, rengAlturaUsada, rengColor, rengEtq) =>
    rengRect(rengX, 140 - rengAlturaTotal, 34, rengAlturaTotal, { borde: RENG_C.linea, ancho: 1.6, r: 4 }) +
    rengRect(rengX, 140 - rengAlturaUsada, 34, rengAlturaUsada, { relleno: rengColor, r: 4, op: 0.9 }) +
    rengTexto(rengX + 17, 160, rengEtq, { tam: 12, color: RENG_C.suave, peso: 500 })
  return rengMarco(
    'general',
    'estequiometria',
    rengBarra(46, 96, 96, RENG_C.cian, 'A') +
      rengBarra(96, 96, 54, RENG_C.violeta, 'B') +
      rengRect(46, 44, 34, 42, { relleno: RENG_C.cian, op: 0.25, r: 4 }) +
      rengTexto(63, 36, 'sobra', { tam: 11, color: RENG_C.cian, peso: 500 }) +
      rengTexto(113, 36, 'limita', { tam: 11, color: RENG_C.violeta, peso: 600 }) +
      rengFlecha(146, 100, 186, 100, RENG_C.texto) +
      rengBarra(196, 96, 54, RENG_C.verde, 'P') +
      rengCirculo(274, 84, 24, { borde: RENG_C.linea, ancho: 6 }) +
      `<circle cx="274" cy="84" r="24" fill="none" stroke="${RENG_C.verde}" stroke-width="6" stroke-dasharray="120 151" transform="rotate(-90 274 84)"/>` +
      rengTexto(274, 90, '%', { tam: 16, peso: 700 })
  )
}

rengMiniaturas['formular-nombrar'] = () => {
  const rengIon = (rengX, rengR, rengColor, rengSigno) => rengCirculo(rengX, 70, rengR, { relleno: rengColor, op: 0.9 }) + rengTexto(rengX, 76, rengSigno, { tam: 20, color: '#080c1a', peso: 800 })
  return rengMarco(
    'inorganica',
    'formular-nombrar',
    rengIon(60, 22, RENG_C.cian, '+') +
      rengTexto(60, 112, 'M<tspan dy="-6" font-size="11">n+</tspan>', { tam: 17, color: RENG_C.cian, peso: 700 }) +
      rengTexto(110, 76, '+', { tam: 20, peso: 500 }) +
      rengIon(160, 30, RENG_C.violeta, '−') +
      rengTexto(160, 112, 'A<tspan dy="-6" font-size="11">m−</tspan>', { tam: 17, color: RENG_C.violeta, peso: 700 }) +
      rengFlecha(204, 70, 232, 70, RENG_C.texto) +
      rengTexto(276, 76, 'M<tspan dy="5" font-size="11">m</tspan><tspan dy="-5">A</tspan><tspan dy="5" font-size="11">n</tspan>', { tam: 20, peso: 700, color: RENG_C.blanco }) +
      rengRuta('M60 128 Q110 156 160 128', { borde: RENG_C.suave, ancho: 1.4, trazo: '4 4' }) +
      rengTexto(110, 160, 'se cruzan las cargas', { tam: 11, color: RENG_C.suave, peso: 500 })
  )
}

rengMiniaturas.oxidacion = () => {
  let rengEscala = rengLinea(36, 100, 284, 100, { ancho: 2 })
  const rengMapa = (rengV) => 160 + rengV * 22
  for (let rengV = -4; rengV <= 5; rengV++) {
    rengEscala += rengLinea(rengMapa(rengV), 94, rengMapa(rengV), 106, { ancho: 1.6 }) + rengTexto(rengMapa(rengV), 124, rengV === 0 ? '0' : rengV > 0 ? `+${rengV}` : `−${-rengV}`, { tam: 12, color: rengV === 0 ? RENG_C.texto : RENG_C.suave, peso: rengV === 0 ? 700 : 500 })
  }
  return rengMarco(
    'inorganica',
    'oxidacion',
    rengEscala +
      rengCirculo(160, 58, 22, { relleno: RENG_C.violeta, op: 0.95 }) +
      rengTexto(160, 65, 'X', { tam: 20, color: '#080c1a', peso: 800 }) +
      rengFlecha(130, 58, 70, 58, RENG_C.ambar) +
      rengFlecha(190, 58, 250, 58, RENG_C.cian) +
      rengTexto(70, 40, 'gana e⁻', { tam: 11, color: RENG_C.ambar, peso: 600 }) +
      rengTexto(250, 40, 'pierde e⁻', { tam: 11, color: RENG_C.cian, peso: 600 }) +
      rengTexto(160, 154, 'número de oxidación', { tam: 12, color: RENG_C.suave, peso: 500 })
  )
}

rengMiniaturas.enlace = () => {
  let rengRed = ''
  for (let rengF = 0; rengF < 4; rengF++) {
    for (let rengC = 0; rengC < 5; rengC++) {
      const rengCat = (rengF + rengC) % 2 === 0
      rengRed += rengCirculo(32 + rengC * 24, 46 + rengF * 24, rengCat ? 7 : 11, { relleno: rengCat ? RENG_C.cian : RENG_C.violeta, op: 0.92 })
    }
  }
  const rengCaja = rengLinea(32, 46, 128, 46, { color: RENG_C.linea, ancho: 1, op: 0.5 })
  const rengO = [226, 74]
  const rengH1 = [196, 108]
  const rengH2 = [256, 108]
  return rengMarco(
    'inorganica',
    'enlace',
    rengRed + rengCaja +
      rengLinea(158, 22, 158, 150, { color: RENG_C.linea, ancho: 1, trazo: '3 5', op: 0.7 }) +
      rengLinea(...rengO, ...rengH1, { color: RENG_C.blanco, ancho: 4 }) +
      rengLinea(...rengO, ...rengH2, { color: RENG_C.blanco, ancho: 4 }) +
      rengCirculo(...rengO, 17, { relleno: RENG_C.rojo }) +
      rengCirculo(...rengH1, 10, { relleno: RENG_C.blanco }) +
      rengCirculo(...rengH2, 10, { relleno: RENG_C.blanco }) +
      rengTexto(80, 160, 'red cristalina', { tam: 11, color: RENG_C.suave, peso: 500 }) +
      rengTexto(236, 160, 'molécula', { tam: 11, color: RENG_C.suave, peso: 500 })
  )
}

rengMiniaturas.redox = () =>
  rengMarco(
    'inorganica',
    'redox',
    rengCirculo(70, 96, 24, { relleno: RENG_C.ambar, op: 0.95 }) +
      rengTexto(70, 104, 'A', { tam: 22, color: '#080c1a', peso: 800 }) +
      rengCirculo(250, 96, 24, { relleno: RENG_C.cian, op: 0.95 }) +
      rengTexto(250, 104, 'B', { tam: 22, color: '#080c1a', peso: 800 }) +
      rengRuta('M92 80 Q160 20 228 80', { borde: RENG_C.texto, ancho: 2.2 }) +
      rengRuta('M219 71 L228 80 L216 82', { borde: RENG_C.texto, ancho: 2.2 }) +
      [0, 1].map((rengI) => rengCirculo(136 + rengI * 48, 40 + rengI * 0 + (rengI === 0 ? 4 : 4), 7, { relleno: RENG_C.blanco }) + rengTexto(136 + rengI * 48, 44 + 4, 'e⁻', { tam: 9, color: '#080c1a', peso: 800 })).join('') +
      rengTexto(70, 150, 'se oxida', { tam: 13, color: RENG_C.ambar, peso: 700 }) +
      rengTexto(250, 150, 'se reduce', { tam: 13, color: RENG_C.cian, peso: 700 }) +
      rengTexto(160, 126, 'A → A<tspan dy="-5" font-size="9">+</tspan><tspan dy="5">  +  e⁻</tspan>', { tam: 12, color: RENG_C.suave, peso: 500 })
  )

rengMiniaturas.grupos = () => {
  const rengDibujo = rengEstructura('CC(=O)Oc1ccccc1C(=O)O', {
    x: 70,
    y: 14,
    w: 180,
    h: 150,
    formula: 'C9H8O4',
    colorear: (rengM) => {
      for (const rengI of [1, 2, 3]) rengM.setAtomColor(rengI, Molecule.cAtomColorOrange)
      for (const rengI of [10, 11, 12]) rengM.setAtomColor(rengI, Molecule.cAtomColorBlue)
    }
  })
  return rengMarco('organica', 'grupos', rengDibujo + rengCirculo(24, 142, 5, { relleno: RENG_C.ambar }) + rengTexto(34, 146, 'éster', { tam: 11, color: RENG_C.suave, ancla: 'start', peso: 500 }) + rengCirculo(24, 160, 5, { relleno: RENG_C.cian }) + rengTexto(34, 164, 'ácido carboxílico', { tam: 11, color: RENG_C.suave, ancla: 'start', peso: 500 }))
}

rengMiniaturas.nomenclatura = () => {
  const rengCadena = [0, 1, 2, 4, 6, 7]
  const rengDibujo = rengEstructura('CCC(C)C(C)CC', {
    x: 40,
    y: 22,
    w: 240,
    h: 130,
    formula: 'C8H18',
    rotular: (rengM) => rengCadena.forEach((rengI, rengK) => rengM.setAtomCustomLabel(rengI, String(rengK + 1)))
  })
  return rengMarco('organica', 'nomenclatura', rengDibujo + rengTexto(160, 166, 'cadena principal numerada', { tam: 11, color: RENG_C.suave, peso: 500 }))
}

rengMiniaturas.estructura = () => {
  const rengDibujo = rengEstructura('OC1CCCCC1', { x: 160, y: 24, w: 140, h: 120, formula: 'C6H12O', colorear: (rengM) => rengM.setAtomColor(0, Molecule.cAtomColorRed) })
  return rengMarco(
    'organica',
    'estructura',
    rengRect(22, 62, 108, 40, { relleno: '#0b1530', borde: RENG_C.linea, r: 8 }) +
      rengTexto(76, 88, 'OC1CCCCC1', { tam: 15, color: RENG_C.verde, peso: 700 }) +
      rengTexto(76, 120, 'SMILES', { tam: 11, color: RENG_C.suave, peso: 500 }) +
      rengTexto(145, 90, '⇄', { tam: 20, color: RENG_C.texto, peso: 500 }) +
      rengDibujo +
      rengTexto(230, 162, 'estructura', { tam: 11, color: RENG_C.suave, peso: 500 })
  )
}

rengMiniaturas.isomeria = () => {
  const rengA = rengEstructura('CCCCC=O', { x: 6, y: 34, w: 112, h: 100, formula: 'C5H10O', colorear: (rengM) => rengM.setAtomColor(5, Molecule.cAtomColorRed) })
  const rengB = rengEstructura('CC(C)CC=O', { x: 204, y: 34, w: 110, h: 100, formula: 'C5H10O', colorear: (rengM) => rengM.setAtomColor(5, Molecule.cAtomColorRed) })
  return rengMarco('organica', 'isomeria', rengA + rengB + rengTexto(160, 76, 'C<tspan dy="4" font-size="9">5</tspan><tspan dy="-4">H</tspan><tspan dy="4" font-size="9">10</tspan><tspan dy="-4">O</tspan>', { tam: 15, color: RENG_C.verde, peso: 700 }) + rengTexto(160, 96, '=', { tam: 16, peso: 500 }) + rengTexto(160, 158, 'misma fórmula, distinta estructura', { tam: 11, color: RENG_C.suave, peso: 500 }))
}

rengMiniaturas.estereo = () => {
  const rengQuiral = rengEstructura('CC[C@H](C)Cl', { x: 16, y: 22, w: 140, h: 108, formula: 'C4H9Cl', colorear: (rengM) => rengM.setAtomColor(4, Molecule.cAtomColorDarkGreen) })
  const rengDoble = rengEstructura('Br/C=C/C', { x: 176, y: 22, w: 130, h: 108, formula: 'C3H5Br' })
  return rengMarco('organica', 'estereo', rengQuiral + rengDoble + rengLinea(160, 28, 160, 140, { color: RENG_C.linea, ancho: 1, trazo: '3 5', op: 0.7 }) + rengTexto(86, 158, 'R / S', { tam: 14, color: RENG_C.verde, peso: 700 }) + rengTexto(240, 158, 'E / Z', { tam: 14, color: RENG_C.verde, peso: 700 }))
}

rengMiniaturas['reacciones-organicas'] = () => {
  const rengReactivo = rengEstructura('C1=CCCCC1', { x: 10, y: 38, w: 96, h: 90, formula: 'C6H10' })
  const rengProducto = rengEstructura('C1CCCCC1', { x: 214, y: 38, w: 96, h: 90, formula: 'C6H12' })
  return rengMarco('organica', 'reacciones-organicas', rengReactivo + rengProducto + rengFlecha(116, 84, 204, 84, RENG_C.texto) + rengTexto(160, 68, 'reactivo', { tam: 11, color: RENG_C.suave, peso: 500 }) + rengTexto(160, 106, 'condiciones', { tam: 11, color: RENG_C.suave, peso: 500 }) + rengTexto(160, 156, 'qué se forma y cómo', { tam: 11, color: RENG_C.suave, peso: 500 }))
}

rengMiniaturas.ph = () => {
  const rengColores = ['#ff3d57', '#ff6a3d', '#ff9a3d', '#ffc83d', '#e8e83d', '#9fe84a', '#3be88a', '#3be8b0', '#38c8d0', '#38a0ff', '#4d78ff', '#6a5cff', '#8b4dff', '#a63dd8', '#b832b0']
  const rengBarras = rengColores.map((rengC, rengI) => rengRect(30 + rengI * 18, 74, 18.2, 34, { relleno: rengC })).join('')
  const rengMarcas = [0, 7, 14].map((rengV) => rengTexto(39 + rengV * 18, 128, String(rengV), { tam: 13, peso: 700 })).join('')
  return rengMarco(
    'analitica',
    'ph',
    rengRect(30, 74, 270, 34, { borde: RENG_C.texto, ancho: 2, r: 4 }) + rengBarras +
      rengMarcas +
      rengTexto(66, 60, 'ácido', { tam: 12, color: RENG_C.suave, peso: 600 }) +
      rengTexto(165, 60, 'neutro', { tam: 12, color: RENG_C.suave, peso: 600 }) +
      rengTexto(264, 60, 'básico', { tam: 12, color: RENG_C.suave, peso: 600 }) +
      rengTexto(60, 36, 'H<tspan dy="-4" font-size="9">+</tspan>', { tam: 16, color: RENG_C.ambar, peso: 700 }) +
      rengTexto(270, 36, 'OH<tspan dy="-4" font-size="9">−</tspan>', { tam: 16, color: RENG_C.cian, peso: 700 }) +
      rengTexto(165, 160, 'pH = −log [H⁺]', { tam: 14, color: RENG_C.texto, mono: true, peso: 700 })
  )
}

rengMiniaturas.valoracion = () => {
  const rengBureta =
    rengRect(60, 14, 16, 92, { borde: RENG_C.texto, ancho: 2, r: 3 }) +
    rengRect(61, 14, 14, 44, { relleno: RENG_C.cian, op: 0.55 }) +
    [0, 1, 2, 3, 4, 5].map((rengI) => rengLinea(60, 22 + rengI * 14, 67, 22 + rengI * 14, { color: RENG_C.texto, ancho: 1.2 })).join('') +
    rengLinea(60, 108, 76, 108, { color: RENG_C.ambar, ancho: 3 }) +
    rengRuta('M66 108 V120 L68 126 L70 120 V108', { borde: RENG_C.texto, ancho: 1.8 }) +
    rengRuta('M68 134 q4 7 0 11 q-4 -4 0 -11Z', { relleno: RENG_C.cian })
  const rengMatrazFondo = rengGrupo('translate(68 168) scale(0.95)', `<clipPath id="e"><path d="M-8 -66 V-44 L-40 0 H40 L8 -44 V-66Z"/></clipPath>${rengRect(-50, -26, 100, 40, { relleno: RENG_C.rojo, op: 0.7 }).replace('<rect', '<rect clip-path="url(#e)"')}${rengRuta('M-8 -66 V-44 L-40 0 H40 L8 -44 V-66', { borde: RENG_C.texto, ancho: 2.1 })}`)
  const rengMapaX = (rengV) => 150 + rengV * 150
  const rengMapaY = (rengV) => 150 - rengV * 112
  const rengSigmoide = (rengV) => 1 / (1 + Math.exp(-(rengV - 0.5) * 16))
  return rengMarco(
    'analitica',
    'valoracion',
    rengBureta + rengMatrazFondo +
      rengEjes(150, 150, 300, 28, 'V', 'pH') +
      rengRuta(rengCurva(rengSigmoide, 0, 1, rengMapaX, rengMapaY, 80), { borde: RENG_C.ambar, ancho: 3 }) +
      rengLinea(rengMapaX(0.5), rengMapaY(0.5), rengMapaX(0.5), 150, { color: RENG_C.suave, ancho: 1.2, trazo: '3 4' }) +
      rengLinea(150, rengMapaY(0.5), rengMapaX(0.5), rengMapaY(0.5), { color: RENG_C.suave, ancho: 1.2, trazo: '3 4' }) +
      rengCirculo(rengMapaX(0.5), rengMapaY(0.5), 5.5, { relleno: RENG_C.blanco, borde: RENG_C.ambar, ancho: 2 })
  )
}

rengMiniaturas.dilucion = () => {
  const rengOps = [0.95, 0.62, 0.38, 0.22, 0.1]
  let rengCuerpo = ''
  rengOps.forEach((rengOp, rengI) => {
    const rengX = 38 + rengI * 62
    rengCuerpo += rengTubo(rengX, 56, 82, 24, RENG_C.violeta, rengOp, `t${rengI}`)
    if (rengI < rengOps.length - 1) rengCuerpo += rengFlecha(rengX + 18, 36, rengX + 44, 36, RENG_C.suave, 1.6) + rengTexto(rengX + 31, 28, '1:10', { tam: 9, color: RENG_C.suave, peso: 500 })
  })
  return rengMarco('analitica', 'dilucion', rengCuerpo + rengTexto(160, 160, 'patrones de concentración decreciente', { tam: 11, color: RENG_C.suave, peso: 500 }))
}

rengMiniaturas.calibracion = () => {
  const rengMapaX = (rengV) => 50 + rengV * 42
  const rengMapaY = (rengV) => 142 - rengV * 100
  const rengRecta = (rengV) => 0.05 + 0.18 * rengV
  const rengRuido = [0.012, -0.015, 0.01, -0.008, 0.014, -0.012]
  const rengPuntos = rengRuido.map((rengE, rengI) => rengCirculo(rengMapaX(rengI), rengMapaY(rengRecta(rengI) + rengE), 4.5, { relleno: RENG_C.ambar }) + rengLinea(rengMapaX(rengI), rengMapaY(rengRecta(rengI) + rengE) - 8, rengMapaX(rengI), rengMapaY(rengRecta(rengI) + rengE) + 8, { color: RENG_C.ambar, ancho: 1.2, op: 0.7 })).join('')
  const rengYm = 0.5
  const rengXm = (rengYm - 0.05) / 0.18
  return rengMarco(
    'analitica',
    'calibracion',
    rengEjes(40, 142, 290, 22, 'c', 'señal') +
      rengRuta(`M${rengN(rengMapaX(-0.2))} ${rengN(rengMapaY(rengRecta(-0.2)))} L${rengN(rengMapaX(5.4))} ${rengN(rengMapaY(rengRecta(5.4)))}`, { borde: RENG_C.texto, ancho: 2.4 }) +
      rengPuntos +
      rengLinea(40, rengMapaY(rengYm), rengMapaX(rengXm), rengMapaY(rengYm), { color: RENG_C.verde, ancho: 1.5, trazo: '4 4' }) +
      rengLinea(rengMapaX(rengXm), rengMapaY(rengYm), rengMapaX(rengXm), 142, { color: RENG_C.verde, ancho: 1.5, trazo: '4 4' }) +
      rengCirculo(rengMapaX(rengXm), rengMapaY(rengYm), 5.5, { relleno: RENG_C.blanco, borde: RENG_C.verde, ancho: 2.2 }) +
      rengTexto(rengMapaX(rengXm), 160, '¿c?', { tam: 13, color: RENG_C.verde, peso: 700 })
  )
}

rengMiniaturas.cinetica = () => {
  const rengMapaX = (rengV) => 46 + rengV * 230
  const rengMapaY = (rengV) => 148 - rengV * 112
  return rengMarco(
    'fisicoquimica',
    'cinetica',
    rengEjes(40, 148, 296, 20, 't', '[A]') +
      rengRuta(rengCurva((rengT) => Math.exp(-3 * rengT), 0, 1, rengMapaX, rengMapaY), { borde: RENG_C.rojo, ancho: 3 }) +
      rengRuta(rengCurva((rengT) => Math.exp(-1.2 * rengT), 0, 1, rengMapaX, rengMapaY), { borde: RENG_C.ambar, ancho: 3 }) +
      rengLinea(40, rengMapaY(0.5), rengMapaX(Math.log(2) / 3), rengMapaY(0.5), { color: RENG_C.suave, ancho: 1.2, trazo: '3 4' }) +
      rengLinea(rengMapaX(Math.log(2) / 3), rengMapaY(0.5), rengMapaX(Math.log(2) / 3), 148, { color: RENG_C.suave, ancho: 1.2, trazo: '3 4' }) +
      rengCirculo(rengMapaX(Math.log(2) / 3), rengMapaY(0.5), 4.5, { relleno: RENG_C.blanco }) +
      rengTexto(rengMapaX(Math.log(2) / 3) + 6, 164, 't½', { tam: 12, color: RENG_C.suave, peso: 600, ancla: 'start' })
  )
}

rengMiniaturas.equilibrio = () => {
  const rengMapaX = (rengV) => 46 + rengV * 230
  const rengMapaY = (rengV) => 148 - rengV * 112
  const rengEq = 0.38
  return rengMarco(
    'fisicoquimica',
    'equilibrio',
    rengEjes(40, 148, 296, 20, 't', 'c') +
      rengLinea(rengMapaX(0.45), 20, rengMapaX(0.45), 148, { color: RENG_C.suave, ancho: 1.2, trazo: '3 4' }) +
      rengRuta(rengCurva((rengT) => rengEq + (1 - rengEq) * Math.exp(-6 * rengT), 0, 1, rengMapaX, rengMapaY), { borde: RENG_C.cian, ancho: 3 }) +
      rengRuta(rengCurva((rengT) => 1 - rengEq - (1 - rengEq) * Math.exp(-6 * rengT) + 0.0, 0, 1, rengMapaX, (rengV) => rengMapaY(rengV)), { borde: RENG_C.rojo, ancho: 3 }) +
      rengTexto(226, 52, 'A ⇌ B', { tam: 18, peso: 700, color: RENG_C.blanco }) +
      rengTexto(rengMapaX(0.45) + 6, 164, 'equilibrio', { tam: 11, color: RENG_C.suave, peso: 500, ancla: 'start' })
  )
}

rengMiniaturas.termo = () => {
  const rengMapaX = (rengV) => 40 + rengV * 250
  const rengMapaY = (rengV) => 150 - rengV * 118
  const rengPerfil = (rengX) => 0.72 - 0.36 / (1 + Math.exp(-(rengX - 0.62) * 14)) + 0.34 * Math.exp(-Math.pow((rengX - 0.4) / 0.11, 2))
  return rengMarco(
    'fisicoquimica',
    'termo',
    rengEjes(34, 152, 296, 18, 'avance', 'E') +
      rengRuta(rengCurva(rengPerfil, 0.02, 0.98, rengMapaX, rengMapaY, 90), { borde: RENG_C.texto, ancho: 3 }) +
      rengLinea(rengMapaX(0.02), rengMapaY(0.72), rengMapaX(0.98), rengMapaY(0.72), { color: RENG_C.suave, ancho: 1.2, trazo: '3 4' }) +
      rengLinea(rengMapaX(0.02), rengMapaY(0.36), rengMapaX(0.98), rengMapaY(0.36), { color: RENG_C.suave, ancho: 1.2, trazo: '3 4' }) +
      rengFlecha(rengMapaX(0.4), rengMapaY(0.72) - 1, rengMapaX(0.4), rengMapaY(1.06) + 2, RENG_C.ambar, 2) +
      rengTexto(rengMapaX(0.4) - 8, rengMapaY(0.9) + 2, 'Ea', { tam: 14, color: RENG_C.ambar, peso: 700, ancla: 'end' }) +
      rengFlecha(rengMapaX(0.88), rengMapaY(0.72) + 2, rengMapaX(0.88), rengMapaY(0.36) - 2, RENG_C.rojo, 2) +
      rengTexto(rengMapaX(0.88) - 8, rengMapaY(0.55) + 4, 'ΔH', { tam: 14, color: RENG_C.rojo, peso: 700, ancla: 'end' })
  )
}

rengMiniaturas['ajuste-cinetico'] = () => {
  const rengMapaX = (rengV) => 46 + rengV * 230
  const rengMapaY = (rengV) => 148 - rengV * 112
  const rengRuido = [0.012, -0.02, 0.016, -0.01, 0.014, -0.015, 0.009]
  const rengPuntos = rengRuido.map((rengE, rengI) => rengCirculo(rengMapaX(rengI / 6), rengMapaY(Math.exp(-1.6 * (rengI / 6)) + rengE), 4.2, { relleno: RENG_C.blanco })).join('')
  return rengMarco(
    'fisicoquimica',
    'ajuste-cinetico',
    rengEjes(40, 148, 296, 20, 't', '[A]') +
      rengRuta(rengCurva((rengT) => 1 / (1 + 2.2 * rengT), 0, 1, rengMapaX, rengMapaY), { borde: RENG_C.suave, ancho: 2.2, trazo: '6 5' }) +
      rengRuta(rengCurva((rengT) => Math.exp(-1.6 * rengT), 0, 1, rengMapaX, rengMapaY), { borde: RENG_C.rojo, ancho: 3 }) +
      rengPuntos +
      rengRect(206, 30, 14, 5, { relleno: RENG_C.rojo }) +
      rengTexto(226, 36, 'modelo 1', { tam: 11, color: RENG_C.suave, peso: 500, ancla: 'start' }) +
      rengLinea(206, 51, 220, 51, { color: RENG_C.suave, ancho: 2.2, trazo: '4 3' }) +
      rengTexto(226, 54, 'modelo 2', { tam: 11, color: RENG_C.suave, peso: 500, ancla: 'start' })
  )
}

const rengEmblemas = {
  general: () => rengMatraz(160, 138, 1.5, -30, RENG_C.cian, 0.6, 'r1'),
  inorganica: () => {
    let rengRed = ''
    for (let rengF = 0; rengF < 4; rengF++) for (let rengC = 0; rengC < 5; rengC++) rengRed += rengCirculo(112 + rengC * 24, 46 + rengF * 24, (rengF + rengC) % 2 === 0 ? 7 : 11, { relleno: (rengF + rengC) % 2 === 0 ? RENG_C.cian : RENG_C.violeta, op: 0.92 })
    return rengRed
  },
  organica: () => rengEstructura('c1ccccc1', { x: 100, y: 20, w: 120, h: 120, formula: 'C6H6' }),
  analitica: () => rengRect(150, 18, 20, 100, { borde: RENG_C.texto, ancho: 2, r: 3 }) + rengRect(151, 18, 18, 46, { relleno: RENG_C.ambar, op: 0.6 }) + rengRuta('M160 120 V132 L162 138 L158 138Z', { borde: RENG_C.texto, ancho: 1.8 }),
  fisicoquimica: () => {
    const rengMapaX = (rengV) => 80 + rengV * 160
    const rengMapaY = (rengV) => 140 - rengV * 104
    return rengRuta(rengCurva((rengT) => Math.exp(-2.4 * rengT), 0, 1, rengMapaX, rengMapaY), { borde: RENG_C.rojo, ancho: 3.5 }) + rengLinea(70, 140, 250, 140, { ancho: 2 }) + rengLinea(70, 140, 70, 24, { ancho: 2 })
  }
}

const rengNombresRama = { general: 'Química general', inorganica: 'Química inorgánica', organica: 'Química orgánica', analitica: 'Química analítica', fisicoquimica: 'Fisicoquímica' }

const rengSalidas = []
for (const [rengId, rengFn] of Object.entries(rengMiniaturas)) rengSalidas.push([rengId, rengFn()])
for (const rengRama of Object.keys(rengEmblemas)) rengSalidas.push([`rama-${rengRama}`, rengMarco(rengRama, `rama-${rengRama}`, rengEmblemas[rengRama]() + rengTexto(160, 166, rengNombresRama[rengRama], { tam: 12, color: RENG_C.suave, peso: 600 }))])

for (const [rengId, rengContenido] of rengSalidas) {
  if (!rengContenido.startsWith('<svg')) throw new Error(`Miniatura inválida: ${rengId}`)
  writeFileSync(join(rengSalida, `${rengId}.svg`), rengContenido, 'utf8')
}
console.log(`${rengSalidas.length} miniaturas escritas en ${rengSalida}`)
