export const BASE_SONDA = `
  const rengEstiloQuieto = document.createElement('style'); rengEstiloQuieto.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; document.head.appendChild(rengEstiloQuieto); void document.body.offsetHeight; await new Promise((r) => setTimeout(r, 60))
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]) }
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true })
  const parse = (s) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255] }
  const mezcla = (f, b) => [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3]))
  const fondos = (el) => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); const g = cs.backgroundImage; if (g && g.includes('gradient')) { const st = g.match(/rgba?\([^)]+\)/g) ?? []; if (st.length) return st.map((x) => parse(x).slice(0, 3)) } const opaco = parse(cs.backgroundColor); if (opaco && opaco[3] >= 1) break } let capas = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { capas.push(c); if (c[3] >= 1) break } } let base = [255, 255, 255]; for (let i = capas.length - 1; i >= 0; i--) base = mezcla(capas[i], base).concat([1]); return [base.slice(0, 3)] }
`

export const SONDA = BASE_SONDA + `
  const raiz = document.querySelector('.sim-fq')
  const malos = []
  let n = 0
  const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT)
  while (w.nextNode()) {
    const t = w.currentNode; const el = t.parentElement
    if (!t.textContent.trim() || !el || el.offsetParent === null || getComputedStyle(el).visibility === 'hidden') continue
    if (el.closest('svg')) continue
    const cs = getComputedStyle(el); const fg = parse(cs.color); if (!fg) continue
    let r = Infinity
    for (const bg of fondos(el)) { const f = mezcla(fg, bg); const L1 = lum(f); const L2 = lum(bg); r = Math.min(r, (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) }
    const grande = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700)
    n++
    if (r < (grande ? 3 : 4.5)) malos.push(el.tagName + ':' + t.textContent.trim().slice(0, 30) + ' ' + r.toFixed(2))
  }
  const W = innerWidth
  const fuera = [...raiz.querySelectorAll('input,select,button,.ui-tarjeta')].filter((e) => e.offsetParent !== null).filter((e) => { const r = e.getBoundingClientRect(); return r.right > W + 1 || r.left < -1 }).map((e) => e.tagName + ':' + (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 25))
  const recortados = [...raiz.querySelectorAll('input.input')].filter((e) => e.offsetParent !== null).filter((e) => e.clientWidth < 56 || e.scrollWidth > e.clientWidth + 1).map((e) => (e.closest('label')?.querySelector('span')?.textContent ?? '?') + ':' + e.clientWidth)
  const selFuera = [...raiz.querySelectorAll('.sim-campo select')].filter((e) => e.offsetParent !== null).filter((e) => { const t = e.closest('.ui-tarjeta')?.getBoundingClientRect(); const r = e.getBoundingClientRect(); return t && r.right > t.right + 1 }).map((e) => e.getAttribute('aria-label') ?? 'select')
  rengEstiloQuieto.remove()
  return { recortados, selFuera, textos: n, bajoContraste: malos.slice(0, 6), nBajo: malos.length, desborde: document.documentElement.scrollWidth - W, fuera }
`

export const SONDA_LIMITE3D = BASE_SONDA + `
  const avisos = [...document.querySelectorAll('.limite-3d')].filter((e) => e.offsetParent !== null)
  const lecturas = avisos.map((caja) => {
    let peor = Infinity
    let textos = 0
    const w = document.createTreeWalker(caja, NodeFilter.SHOW_TEXT)
    while (w.nextNode()) {
      const t = w.currentNode; const el = t.parentElement
      if (!t.textContent.trim() || !el || el.offsetParent === null) continue
      const cs = getComputedStyle(el); const fg = parse(cs.color); if (!fg) continue
      let r = Infinity
      for (const bg of fondos(el)) { const f = mezcla(fg, bg); const L1 = lum(f); const L2 = lum(bg); r = Math.min(r, (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) }
      textos++
      peor = Math.min(peor, r)
    }
    const cs = getComputedStyle(caja)
    return { contraste: Number(peor.toFixed(2)), textos, fondo: cs.backgroundImage.startsWith('none') ? cs.backgroundColor : cs.backgroundImage.slice(0, 60), color: getComputedStyle(caja.querySelector('.notice') ?? caja).color }
  })
  rengEstiloQuieto.remove()
  return lecturas
`
