import { describe, expect, it } from 'vitest'
import { rengDesdeSmiles, rengIdCanonico } from '../../src/renderer/modules/simulador-quimica/nucleo/molecula'
import { rengGruposFuncionales, rengNombrarOrganico, rengSmilesDesdeNombre, type RengTipoGrupo } from '../../src/renderer/modules/simulador-quimica/nucleo/organica'

const RENG_PARES: Array<[string, string]> = [
  ['metano', 'C'], ['etano', 'CC'], ['propano', 'CCC'], ['butano', 'CCCC'], ['pentano', 'CCCCC'], ['hexano', 'CCCCCC'],
  ['heptano', 'CCCCCCC'], ['octano', 'CCCCCCCC'], ['nonano', 'CCCCCCCCC'], ['decano', 'CCCCCCCCCC'],
  ['2-metilpropano', 'CC(C)C'], ['2-metilbutano', 'CCC(C)C'], ['2,2-dimetilpropano', 'CC(C)(C)C'], ['3-etilpentano', 'CCC(CC)CC'], ['2,3-dimetilbutano', 'CC(C)C(C)C'],
  ['eteno', 'C=C'], ['propeno', 'C=CC'], ['but-1-eno', 'C=CCC'], ['but-2-eno', 'CC=CC'], ['buta-1,3-dieno', 'C=CC=C'],
  ['etino', 'C#C'], ['propino', 'C#CC'], ['but-2-ino', 'CC#CC'], ['2-metilbut-2-eno', 'CC=C(C)C'], ['pent-1-en-4-ino', 'C=CCC#C'],
  ['metanol', 'CO'], ['etanol', 'CCO'], ['propan-1-ol', 'CCCO'], ['propan-2-ol', 'CC(C)O'], ['butan-2-ol', 'CCC(C)O'], ['2-metilpropan-2-ol', 'CC(C)(C)O'],
  ['etano-1,2-diol', 'OCCO'], ['propano-1,2,3-triol', 'OCC(O)CO'], ['prop-2-en-1-ol', 'C=CCO'],
  ['metanal', 'C=O'], ['etanal', 'CC=O'], ['propanal', 'CCC=O'], ['butanal', 'CCCC=O'], ['prop-2-enal', 'C=CC=O'],
  ['propanona', 'CC(C)=O'], ['butanona', 'CCC(C)=O'], ['pentan-2-ona', 'CCCC(C)=O'], ['pentan-3-ona', 'CCC(=O)CC'], ['but-3-en-2-ona', 'CC(=O)C=C'], ['pentano-2,4-diona', 'CC(=O)CC(C)=O'],
  ['ácido metanoico', 'OC=O'], ['ácido etanoico', 'CC(=O)O'], ['ácido propanoico', 'CCC(=O)O'], ['ácido butanoico', 'CCCC(=O)O'], ['ácido 2-metilpropanoico', 'CC(C)C(=O)O'],
  ['ácido 2-hidroxipropanoico', 'CC(O)C(=O)O'], ['ácido but-2-enoico', 'CC=CC(=O)O'], ['ácido butanodioico', 'OC(=O)CCC(=O)O'],
  ['etanoato de metilo', 'COC(C)=O'], ['etanoato de etilo', 'CCOC(C)=O'], ['metanoato de metilo', 'COC=O'], ['propanoato de etilo', 'CCOC(=O)CC'],
  ['metanamina', 'CN'], ['etanamina', 'CCN'], ['propan-1-amina', 'CCCN'], ['propan-2-amina', 'CC(C)N'],
  ['etanamida', 'CC(N)=O'], ['propanamida', 'CCC(N)=O'], ['etanonitrilo', 'CC#N'], ['propanonitrilo', 'CCC#N'],
  ['clorometano', 'CCl'], ['cloroetano', 'CCCl'], ['2-cloropropano', 'CC(C)Cl'], ['diclorometano', 'ClCCl'], ['1,2-dicloroetano', 'ClCCCl'], ['triclorometano', 'ClC(Cl)Cl'],
  ['2-bromo-2-metilpropano', 'CC(C)(C)Br'], ['2-cloro-3-metilbutano', 'CC(C)C(C)Cl'],
  ['metoxietano', 'COCC'], ['etoxietano', 'CCOCC'], ['metoximetano', 'COC'],
  ['benceno', 'c1ccccc1'], ['metilbenceno', 'Cc1ccccc1'], ['clorobenceno', 'Clc1ccccc1'], ['1,2-diclorobenceno', 'Clc1ccccc1Cl'], ['1,4-dimetilbenceno', 'Cc1ccc(C)cc1'],
  ['fenol', 'Oc1ccccc1'], ['4-metilfenol', 'Cc1ccc(O)cc1'], ['ácido benzoico', 'OC(=O)c1ccccc1'], ['anilina', 'Nc1ccccc1'], ['benzaldehído', 'O=Cc1ccccc1'],
  ['ciclohexano', 'C1CCCCC1'], ['ciclopropano', 'C1CC1']
]

describe('nomenclatura orgánica: nombre ↔ estructura', () => {
  it('hay al menos 60 pares', () => expect(RENG_PARES.length).toBeGreaterThanOrEqual(60))
  for (const [rengNombre, rengSmiles] of RENG_PARES) {
    it(rengNombre, () => {
      expect(rengIdCanonico(rengSmilesDesdeNombre(rengNombre).smiles)).toBe(rengIdCanonico(rengSmiles))
      expect(rengNombrarOrganico(rengDesdeSmiles(rengSmiles)).nombre).toBe(rengNombre)
    })
  }
  it('nombres comunes aceptados', () => {
    for (const [rengComun, rengSmiles] of [
      ['ácido acético', 'CC(=O)O'],
      ['acetona', 'CC(C)=O'],
      ['tolueno', 'Cc1ccccc1'],
      ['glicerina', 'OCC(O)CO'],
      ['acetato de etilo', 'CCOC(C)=O']
    ] as const) {
      expect(rengIdCanonico(rengSmilesDesdeNombre(rengComun).smiles)).toBe(rengIdCanonico(rengSmiles))
    }
    expect(rengNombrarOrganico(rengDesdeSmiles('CC(=O)O')).comunes).toContain('ácido acético')
    expect(rengNombrarOrganico(rengDesdeSmiles('Cc1ccccc1')).comunes).toContain('tolueno')
  })
  it('un nombre no estándar se acepta y se corrige', () => {
    const rengR = rengSmilesDesdeNombre('3-metilbutano')
    expect(rengIdCanonico(rengR.smiles)).toBe(rengIdCanonico('CCC(C)C'))
    expect(rengR.nota).toMatch(/2-metilbutano/)
  })
  it('errores con motivo: estructura imposible, localizador que falta, fuera de alcance', () => {
    expect(() => rengSmilesDesdeNombre('2,2,2-trimetilpropano')).toThrow(/imposible|Valencia/)
    expect(() => rengSmilesDesdeNombre('buteno')).toThrow(/localizador/)
    expect(() => rengSmilesDesdeNombre('5-metilbutano')).toThrow(/imposible/)
    expect(() => rengSmilesDesdeNombre('ácido fantástico')).toThrow()
    expect(() => rengNombrarOrganico(rengDesdeSmiles('CC(C)CC(C)(C)C1CCCCC1'))).toThrow(/aún no sabe nombrar/)
  })
})

describe('grupos funcionales', () => {
  const rengTipos = (rengSmiles: string): RengTipoGrupo[] => [...new Set(rengGruposFuncionales(rengDesdeSmiles(rengSmiles)).map((rengG) => rengG.tipo))].sort()
  it.each([
    ['CCCC', ['alcano']],
    ['C=C', ['alqueno']],
    ['C#C', ['alquino']],
    ['c1ccccc1', ['aromatico']],
    ['CCCl', ['haluro']],
    ['CCO', ['alcohol']],
    ['Oc1ccccc1', ['aromatico', 'fenol']],
    ['CCOCC', ['eter']],
    ['CC=O', ['aldehido']],
    ['CC(C)=O', ['cetona']],
    ['CC(=O)O', ['acido-carboxilico']],
    ['CCOC(C)=O', ['ester']],
    ['CCN', ['amina']],
    ['CC(N)=O', ['amida']],
    ['CC#N', ['nitrilo']],
    ['CC(=O)[O-]', ['carboxilato']]
  ] as Array<[string, RengTipoGrupo[]]>)('%s → %s', (rengS, rengEsperado) => expect(rengTipos(rengS)).toEqual([...rengEsperado].sort()))
  it('aspirina: éster, ácido carboxílico y anillo aromático', () => {
    expect(rengTipos('CC(=O)Oc1ccccc1C(=O)O')).toEqual(['acido-carboxilico', 'aromatico', 'ester'])
  })
})
