import { describe, expect, it } from 'vitest'
import { rengAnadirSustancia } from '../../src/renderer/modules/simulador-quimica/estado/acciones'
import { rengDerivarTodos } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengEstadoInicial, type RengEstadoTrabajo } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengClaveIdentidad, rengIdentidadDeSustancia, rengIdentificada, rengIdentificar } from '../../src/renderer/modules/simulador-quimica/nucleo/identidad'
import { rengEcuacionTexto, rengMezclar } from '../../src/renderer/modules/simulador-quimica/nucleo/mezclador'
import { rengBuscarReaccion, rengIdentidadDeEspecie, RENG_REACCIONES } from '../../src/renderer/modules/simulador-quimica/nucleo/reaccionesConocidas'
import { rengInterpretarSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'

const RENG_FORMIATO = 'COC=O'
const RENG_ACETICO = 'CC(=O)O'

describe('el defecto reproducido', () => {
  it('formiato de metilo y ácido acético comparten fórmula molecular y son sustancias distintas', () => {
    const rengF = rengInterpretarSustancia(RENG_FORMIATO)
    const rengA = rengInterpretarSustancia(RENG_ACETICO)
    expect(rengF.tipo === 'ok' && rengF.sustancia.formula).toBe('C2H4O2')
    expect(rengA.tipo === 'ok' && rengA.sustancia.formula).toBe('C2H4O2')
    expect(rengClaveIdentidad(RENG_FORMIATO)).not.toBe(rengClaveIdentidad(RENG_ACETICO))
  })
  it('formiato + NaOH NO anuncia acetato ni agua: no hay datos para predecirla', () => {
    const rengR = rengMezclar(RENG_FORMIATO, 'NaOH')
    expect(rengR.tipo).toBe('ninguna')
    if (rengR.tipo !== 'ninguna') return
    expect(rengR.causa).toBe('sin-datos')
    expect(rengR.motivo).toMatch(/Sin datos o modelo para predecirla/)
    expect(rengR.motivo).toMatch(/no significa que no pueda ocurrir/)
    expect(rengR.motivo).not.toMatch(/acetato|acético/i)
  })
  it('ácido acético + NaOH sigue dando acetato de sodio, escrito de cualquier forma equivalente', () => {
    for (const rengA of [RENG_ACETICO, 'OC(C)=O', 'CH3COOH', 'ácido acético']) {
      const rengR = rengMezclar(rengA, 'NaOH')
      expect(rengR.tipo, rengA).toBe('reaccion')
      if (rengR.tipo !== 'reaccion') continue
      expect(rengR.r.nombre, rengA).toMatch(/ácido acético/)
      expect(rengR.r.origen).toBe('catalogo')
      expect(rengR.r.productos.map((rengP) => rengP.formula)).toContain('C2H3NaO2')
    }
  })
  it('con NaOH a la izquierda da lo mismo (el orden no importa)', () => {
    const [rengX, rengY] = [rengMezclar('NaOH', RENG_ACETICO), rengMezclar(RENG_ACETICO, 'NaOH')]
    if (rengX.tipo !== 'reaccion' || rengY.tipo !== 'reaccion') throw new Error('se esperaba reacción en ambos órdenes')
    expect(rengEcuacionTexto(rengX.r)).toBe(rengEcuacionTexto(rengY.r))
  })
})

describe('fórmula ambigua: se pide la estructura, no se elige un isómero', () => {
  it('«C2H4O2» sola no identifica nada', () => {
    const rengI = rengIdentificar('C2H4O2')
    expect(rengI.tipo).toBe('ambigua')
    const rengR = rengMezclar('C2H4O2', 'NaOH')
    expect(rengR.tipo).toBe('ninguna')
    expect(rengR.tipo === 'ninguna' && rengR.causa).toBe('estructura-ambigua')
    expect(rengR.tipo === 'ninguna' && rengR.motivo).toMatch(/Falta identificar la estructura/)
  })
  it('el catálogo tampoco empareja por composición: una identidad nula impide decidir', () => {
    const rengC = rengBuscarReaccion([rengClaveIdentidad('C2H4O2'), rengClaveIdentidad('NaOH')], '')
    expect(rengC.tipo === 'ninguna' && rengC.causa).toBe('falta-identidad')
  })
  it('un texto que no es una sustancia se explica', () => {
    const rengR = rengMezclar('xyz123', 'NaOH')
    expect(rengR.tipo === 'ninguna' && rengR.causa).toBe('no-valida')
  })
})

describe('la identidad conserva conectividad, carga y estereoquímica', () => {
  const rengDistintas = (rengA: string, rengB: string): void => {
    const [rengKa, rengKb] = [rengClaveIdentidad(rengA), rengClaveIdentidad(rengB)]
    expect(rengKa, rengA).not.toBeNull()
    expect(rengKb, rengB).not.toBeNull()
    expect(rengKa, `${rengA} ≠ ${rengB}`).not.toBe(rengKb)
  }
  it('isómeros constitucionales (etanol / éter dimetílico)', () => rengDistintas('CCO', 'COC'))
  it('carga: ácido acético / acetato', () => rengDistintas(RENG_ACETICO, 'CC(=O)[O-]'))
  it('enantiómeros: L- y D-alanina', () => {
    rengDistintas('C[C@H](N)C(=O)O', 'C[C@@H](N)C(=O)O')
    rengDistintas('C[C@H](N)C(=O)O', 'CC(N)C(=O)O')
  })
  it('isómeros geométricos: (E)- y (Z)-2-buteno', () => rengDistintas('C/C=C/C', 'C/C=C\\C'))
  it('la misma molécula escrita de otro modo tiene la misma identidad', () => {
    expect(rengClaveIdentidad('CCO')).toBe(rengClaveIdentidad('OCC'))
    expect(rengClaveIdentidad('CCO')).toBe(rengClaveIdentidad('etanol'))
    expect(rengClaveIdentidad('C[C@H](N)C(=O)O')).toBe(rengClaveIdentidad('N[C@@H](C)C(=O)O'))
  })
  it('la identidad es independiente de la fórmula visible y de las condiciones', () => {
    const rengS = rengIdentificar(RENG_ACETICO)
    expect(rengS.tipo === 'ok' && rengS.s.formula).toBe('C2H4O2')
    expect(rengS.tipo === 'ok' && rengS.s.identidad.base).toBe('estructura')
  })
})

describe('reactivos conocidos e inequívocos siguen funcionando', () => {
  const rengCasos: Array<[string, string, string]> = [
    ['HCl', 'NaOH', 'hcl-naoh'],
    ['Na', 'H2O', 'na-agua'],
    ['H2', 'O2', 'h2-o2'],
    ['metano', 'O2', 'ch4-o2'],
    ['CH4', 'O2', 'ch4-o2'],
    ['N2', 'H2', 'n2-h2'],
    ['C=C', 'H2', 'eteno-h2'],
    ['Mg', 'O2', 'mg-o2'],
    ['Na', 'Cl2', 'na-cloro'],
    ['H2', 'Cl2', 'h2-cl2']
  ]
  for (const [rengA, rengB, rengId] of rengCasos) {
    it(`${rengA} + ${rengB} → ${rengId}`, () => {
      const rengR = rengMezclar(rengA, rengB)
      expect(rengR.tipo, `${rengA}+${rengB}`).toBe('reaccion')
      const rengEsperada = RENG_REACCIONES.find((rengX) => rengX.id === rengId)!
      expect(rengR.tipo === 'reaccion' && rengR.r.nombre).toBe(rengEsperada.nombre)
    })
  }
  it('todos los reactivos del catálogo tienen identidad', () => {
    for (const rengR of RENG_REACCIONES) for (const rengSp of rengR.reactivos) expect(rengIdentidadDeEspecie(rengSp), `${rengR.id}: ${rengSp.formula}`).not.toBeNull()
  })
  it('el catálogo no tiene dos reacciones con los mismos reactivos', () => {
    const rengFirmas = RENG_REACCIONES.map((rengR) => rengR.reactivos.map((rengX) => rengIdentidadDeEspecie(rengX)).sort().join('|'))
    expect(new Set(rengFirmas).size).toBe(rengFirmas.length)
  })
})

describe('sustancias tomadas de la mesa conservan la identidad', () => {
  const rengCon = (rengE: RengEstadoTrabajo, rengTexto: string): RengEstadoTrabajo => {
    const rengR = rengAnadirSustancia(rengE, rengTexto)
    if (!rengR.ok) throw new Error(`${rengTexto}: ${JSON.stringify(rengR)}`)
    return rengR.estado
  }
  const rengSustanciasDeLaMesa = (rengE: RengEstadoTrabajo) => rengDerivarTodos(rengE).map((rengF) => rengF.sustancia).filter((rengS): rengS is NonNullable<typeof rengS> => rengS !== null)

  it('formiato de metilo en la mesa + NaOH: sin datos (no acetato)', () => {
    const [rengF, rengN] = rengSustanciasDeLaMesa(rengCon(rengCon(rengEstadoInicial(), RENG_FORMIATO), 'NaOH')).map(rengIdentificada)
    expect(rengF!.formula).toBe('C2H4O2')
    const rengR = rengMezclar(rengF!, rengN!)
    expect(rengR.tipo === 'ninguna' && rengR.causa).toBe('sin-datos')
  })
  it('ácido acético en la mesa + NaOH: acetato de sodio', () => {
    const [rengA, rengN] = rengSustanciasDeLaMesa(rengCon(rengCon(rengEstadoInicial(), RENG_ACETICO), 'NaOH')).map(rengIdentificada)
    const rengR = rengMezclar(rengA!, rengN!)
    expect(rengR.tipo === 'reaccion' && rengR.r.productos.map((rengP) => rengP.formula)).toContain('C2H3NaO2')
  })
  it('la identidad de la mesa coincide con la del texto y la del catálogo', () => {
    for (const [rengTexto, rengId] of [[RENG_ACETICO, 'acetico-naoh'], ['H2O', 'na-agua'], ['NaOH', 'hcl-naoh'], ['HCl', 'hcl-naoh']] as const) {
      const [rengS] = rengSustanciasDeLaMesa(rengCon(rengEstadoInicial(), rengTexto))
      const rengReaccion = RENG_REACCIONES.find((rengR) => rengR.id === rengId)!
      expect(rengReaccion.reactivos.map(rengIdentidadDeEspecie), `${rengTexto} en ${rengId}`).toContain(rengIdentidadDeSustancia(rengS!).clave)
      expect(rengIdentidadDeSustancia(rengS!).clave).toBe(rengClaveIdentidad(rengTexto))
    }
  })
  it('buscarReaccion con fragmentos de la mesa: formiato + NaOH no coincide, acético + NaOH sí', () => {
    const rengClaves = (rengT: string) => rengSustanciasDeLaMesa(rengCon(rengCon(rengEstadoInicial(), rengT), 'NaOH')).map((rengS) => rengIdentidadDeSustancia(rengS).clave)
    expect(rengBuscarReaccion(rengClaves(RENG_FORMIATO), '').tipo).toBe('ninguna')
    expect(rengBuscarReaccion(rengClaves(RENG_ACETICO), '').tipo).toBe('conocida')
  })
})

describe('el mezclador distingue sus respaldos y no concluye imposibilidad', () => {
  it('neutralización inorgánica: regla educativa, no catálogo, y sin verificar', () => {
    const rengR = rengMezclar('HNO3', 'Ca(OH)2')
    expect(rengR.tipo === 'reaccion' && rengR.r.origen).toBe('regla-educativa')
  })
  it('la regla de neutralización no se aplica a un compuesto orgánico por coincidir en fórmula', () => {
    const rengR = rengMezclar(RENG_FORMIATO, 'Ca(OH)2')
    expect(rengR.tipo).toBe('ninguna')
  })
  it('una pareja sin datos nunca dice «imposible» ni «no reacciona»', () => {
    const rengR = rengMezclar('Au', 'H2')
    expect(rengR.tipo === 'ninguna' && rengR.motivo).not.toMatch(/no reacciona|imposible|no ocurre/i)
  })
})
