import type { RengFuente } from './tipos'

const RENG_HOY = '2026-11-04'
const RENG_CORTAS: Record<string, string> = {
  fiorillo2020: 'Fiorillo et al. 2020',
  pubchem: 'PubChem',
  'usgs-salinidad': 'USGS (salinidad)',
  'nasa-tierra': 'NASA (Tierra)',
  'aire-seco': 'Wikiversity / NAU',
  'nasa-ozono': 'NASA Ozone Watch',
  'nasa-ntrs-rayos': 'NASA NTRS (rayos)',
  'nasa-venus': 'NASA (Venus)',
  'nasa-marte': 'NASA (Marte)',
  'nasa-titan': 'NASA (Titán)',
  cdms: 'Cologne CDMS',
  'patente-motor': 'Patente US 381 968',
  'patente-ozono': 'Patente US 568 177',
  'tesla-center': 'Tesla Science Center',
  'wiki-bobina': 'Wikipedia (bobina de Tesla)',
  'tesla-unidad': 'CGPM 1960 / Wikipedia'
}
const rengF = (rengId: string, rengTexto: string, rengUrl: string, rengAcceso: RengFuente['acceso'] = 'abierta'): RengFuente => ({ id: rengId, corta: RENG_CORTAS[rengId] ?? rengTexto.split(',')[0]!, texto: rengTexto, url: rengUrl, consultada: RENG_HOY, acceso: rengAcceso })

export const RENG_FUENTES: RengFuente[] = [
  rengF('fiorillo2020', 'Fiorillo L. et al., «Stannous Fluoride Effects on Enamel: A Systematic Review», Biomimetics (2020)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7559150'),
  rengF('pubchem', 'PubChem (NCBI/NLM): NaF (CID 5235), SnF₂ (CID 24550), Na₂PO₃F (CID 24266), ATP (CID 5957), ozono (CID 24823)', 'https://pubchem.ncbi.nlm.nih.gov'),
  rengF('usgs-salinidad', 'USGS, «Saline Water and Salinity»', 'https://www.usgs.gov/special-topics/water-science-school/science/saline-water-and-salinity'),
  rengF('nasa-tierra', 'NASA, «Earth Facts»', 'https://science.nasa.gov/earth/facts/'),
  rengF('aire-seco', 'Composición del aire seco con decimales: páginas secundarias (Wikiversity, Northern Arizona University) vistas en un resumen de búsqueda', 'https://en.wikiversity.org/wiki/Air', 'resumen'),
  rengF('nasa-ozono', 'NASA Ozone Watch, «Ozone Facts»', 'https://ozonewatch.gsfc.nasa.gov/facts/ozone_SH.html'),
  rengF('nasa-ntrs-rayos', 'NASA Technical Reports Server, informe sobre NO producido por rayos (1987), visto en un resumen de búsqueda', 'https://ntrs.nasa.gov/citations/19870046166', 'resumen'),
  rengF('nasa-venus', 'NASA, «Venus Facts»', 'https://science.nasa.gov/venus/venus-facts/'),
  rengF('nasa-marte', 'NASA, «Mars Facts»', 'https://science.nasa.gov/mars/facts/'),
  rengF('nasa-titan', 'NASA, «Titan»', 'https://science.nasa.gov/saturn/moons/titan/'),
  rengF('cdms', 'Cologne Database for Molecular Spectroscopy, lista «Molecules in Space» (349 moléculas, oct. 2026)', 'https://cdms.astro.uni-koeln.de/classic/molecules'),
  rengF('patente-motor', 'Patente de EE. UU. 381 968, «Electro-Magnetic Motor», N. Tesla (Google Patents)', 'https://patents.google.com/patent/US381968A/en'),
  rengF('patente-ozono', 'Patente de EE. UU. 568 177, «Apparatus for Producing Ozone», N. Tesla (Google Patents), vista en un resumen de búsqueda', 'https://patents.google.com/patent/US568177', 'resumen'),
  rengF('tesla-center', 'Tesla Science Center at Wardenclyffe, «About Nikola Tesla»', 'https://teslasciencecenter.org/about-nikola-tesla/'),
  rengF('wiki-bobina', 'Wikipedia, «Tesla coil» (fuente secundaria)', 'https://en.wikipedia.org/wiki/Tesla_coil'),
  rengF('tesla-unidad', 'Resolución 12 de la 11.ª CGPM (18-oct-1960) que nombra el «tesla»: artículo de Serbian Journal of Electrical Engineering y Wikipedia «Tesla (unit)», vistos en un resumen de búsqueda', 'https://en.wikipedia.org/wiki/Tesla_(unit)', 'resumen')
]

export const rengFuentePorId = (rengId: string): RengFuente | undefined => RENG_FUENTES.find((rengX) => rengX.id === rengId)
