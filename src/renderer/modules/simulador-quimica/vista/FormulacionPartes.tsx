import { useMemo, useState } from 'react'
import { RengField, RengNotice, useRengToast } from '../../../shell/ui'
import { RENG_MOLECULAS } from '../chemistry'
import { rengCrearRed } from '../escena/red'
import { rengBuildMolecule } from '../molecule'
import { rengCoordinacion, RENG_ESTRUCTURAS, rengUnidadesFormula } from '../nucleo/cristales'
import { rengTextoEstado } from '../nucleo/oxidacion'
import { rengAnalizarFormula, rengFormulaEmpirica, rengFormulaHill, rengFormulaMolecular, rengMasaMolarDe } from '../nucleo/formula'
import { RENG_NOMBRE_NOMENCLATURA, type RengCompuesto, type RengFuncion, type RengNomenclatura } from '../nucleo/nomenclatura'
import { RengFormulaSimple } from './Formula'
import { RengLienzo3D } from './Lienzo3D'
import { rengColorTema, useRengMuestra } from './nivel'
import { RengVerMas } from './PanelExplicacion'
import { RengIcon } from '@/shell/Icon'

export const rengComa = (rengX: number, rengD: number): string => rengX.toFixed(rengD).replace('.', ',')
export const rengSigno = (rengN: number): string => rengTextoEstado(rengN) || '0'

export const RENG_EXPLICACION: Record<RengFuncion, string> = {
  'oxido-basico': 'Un óxido básico se forma con un metal y oxígeno (ion óxido O²⁻). Con agua da un hidróxido.',
  'oxido-acido': 'Un óxido ácido se forma con un no metal (o un metal con número de oxidación alto) y oxígeno. Con agua da un oxoácido.',
  'oxido-neutro': 'Un óxido neutro: con agua no forma ni ácido ni base (CO, NO, N₂O). Por eso no se llama «anhídrido».',
  'oxido-mixto': 'Contiene el mismo metal en dos estados de oxidación a la vez, así que no se puede formular cruzando las cargas de un solo catión.',
  peroxido: 'Los peróxidos contienen el ion O₂²⁻: dos oxígenos unidos, cada uno con número de oxidación −1. Ese par nunca se separa ni se simplifica.',
  'hidruro-metalico': 'Un metal y el hidrógeno, que aquí actúa con −1 (ion hidruro H⁻).',
  'hidruro-no-metalico': 'Un no metal y el hidrógeno. Muchos tienen un nombre común aceptado por la IUPAC (agua, amoniaco, metano).',
  hidracido: 'Hidrógeno y un halógeno (o S, Se, Te). Disueltos en agua forman disoluciones ácidas.',
  'sal-binaria': 'Un catión metálico y un anión no metálico, sin oxígeno.',
  'binario-no-metalico': 'Dos no metales. Se escribe primero el menos electronegativo.',
  hidroxido: 'Un catión metálico y iones hidróxido OH⁻. Son bases.',
  oxoacido: 'Hidrógeno, un no metal y oxígeno. Al perder sus H⁺ dejan un oxoanión.',
  oxisal: 'Un catión y un oxoanión: es lo que queda al cambiar los H⁺ de un oxoácido por un catión.',
  'sal-acida': 'Una sal que conserva algún H del ácido dentro del anión (HCO₃⁻, HSO₄⁻…).',
  'sal-hidratada': 'Una sal con moléculas de agua dentro de su cristal; se escriben detrás de un punto.',
  cation: 'Un ion positivo: el átomo o grupo ha perdido electrones.',
  anion: 'Un ion negativo: el átomo ha ganado electrones.',
  oxoanion: 'Un ion negativo formado por oxígeno y otro elemento.'
}

export const RENG_RED_DE: Record<string, string> = { NaCl: 'NaCl', MgO: 'MgO', CaF2: 'CaF2', CsCl: 'CsCl', TiO2: 'TiO2' }

export function RengEmpirica(): React.JSX.Element {
  const [rengFilas, rengSetFilas] = useState([
    { simbolo: 'C', pct: '40,00' },
    { simbolo: 'H', pct: '6,71' },
    { simbolo: 'O', pct: '53,29' }
  ])
  const [RENG_M, rengSetM] = useState('180,16')
  const rengNum = (rengS: string): number => Number(rengS.replace(',', '.'))
  let rengRes: { formula: string; molecular?: string; pasos: string[] } | { error: string }
  try {
    const rengE = rengFormulaEmpirica(rengFilas.filter((rengF) => rengF.simbolo.trim()).map((rengF) => ({ simbolo: rengF.simbolo.trim(), porcentaje: rengNum(rengF.pct) })))
    const rengM = RENG_M.trim() ? rengFormulaMolecular(rengE.atomos, rengNum(RENG_M)) : null
    rengRes = { formula: rengE.formula, molecular: rengM?.formula, pasos: [...rengE.pasos, ...(rengM?.pasos ?? [])] }
  } catch (rengErr) {
    rengRes = { error: rengErr instanceof Error ? rengErr.message : String(rengErr) }
  }
  const rengCambiar = (rengI: number, rengCampo: 'simbolo' | 'pct', rengV: string): void => rengSetFilas(rengFilas.map((rengF, rengK) => (rengK === rengI ? { ...rengF, [rengCampo]: rengV } : rengF)))
  return (
    <RengVerMas titulo="Fórmula a partir de porcentajes">
      {rengFilas.map((rengF, rengI) => (
        <div className="param-fila" key={rengI}>
          <input className="input param-campo mono" style={{ maxWidth: 64 }} value={rengF.simbolo} aria-label={`Elemento ${rengI + 1}`} onChange={(rengE) => rengCambiar(rengI, 'simbolo', rengE.target.value)} />
          <input className="input param-campo" inputMode="decimal" value={rengF.pct} aria-label={`Porcentaje del elemento ${rengI + 1}`} onChange={(rengE) => rengCambiar(rengI, 'pct', rengE.target.value)} />
          <span className="param-u">%</span>
          <button className="btn sm" aria-label={`Quitar elemento ${rengI + 1}`} onClick={() => rengSetFilas(rengFilas.filter((_, rengK) => rengK !== rengI))} disabled={rengFilas.length <= 1}>
            ×
          </button>
        </div>
      ))}
      <button className="btn sm" onClick={() => rengSetFilas([...rengFilas, { simbolo: '', pct: '' }])}>
        Añadir elemento
      </button>
      <RengField label="Masa molar medida (g/mol, opcional)">
        <input className="input" inputMode="decimal" value={RENG_M} onChange={(rengE) => rengSetM(rengE.target.value)} />
      </RengField>
      {'error' in rengRes ? (
        <RengNotice tipo="err">{rengRes.error}</RengNotice>
      ) : (
        <>
          <RengNotice tipo="ok">
            Empírica: <b>{rengRes.formula}</b>
            {rengRes.molecular && (
              <>
                {' '}
                · Molecular: <b>{rengRes.molecular}</b>
              </>
            )}
          </RengNotice>
          <ol style={{ paddingLeft: 18 }}>
            {rengRes.pasos.map((rengP, rengI) => (
              <li key={rengI}>{rengP}</li>
            ))}
          </ol>
        </>
      )}
    </RengVerMas>
  )
}


export function RengNombres({ k: rengK }: { k: RengCompuesto }): React.JSX.Element {
  const rengMuestra = useRengMuestra()
  const rengToast = useRengToast()
  const rengCopiar = (rengT: string): void => {
    void navigator.clipboard
      ?.writeText(rengT)
      .then(() => rengToast('Nombre copiado.', 'ok'))
      .catch(() => rengToast('No se pudo copiar al portapapeles.', 'err'))
  }
  const RengTarjeta = ({ titulo: rengTitulo, nombre: rengNombre, rec: rengRec }: { titulo: string; nombre: string | null; rec: boolean }): React.JSX.Element => (
    <div className={`nombre-tarjeta ${rengRec ? 'recomendado' : ''}`}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 6 }}>
        <span className="sm muted">{rengTitulo}</span>
        {rengRec && (
          <span className="sm nombre-rec" title="Recomendado por la IUPAC (2005)">
            <RengIcon name="check" size={12} /> recomendado
          </span>
        )}
      </div>
      <div className={`nombre-texto ${rengNombre ? '' : 'sin-nombre'}`}>{rengNombre ?? 'No hay un nombre de este tipo para este compuesto'}</div>
      {rengNombre && (
        <button className="btn ghost sm" onClick={() => rengCopiar(rengNombre)} aria-label={`Copiar «${rengNombre}»`}>
          Copiar
        </button>
      )}
    </div>
  )
  if (rengMuestra('formulacion.nombresSimples')) {
    return (
      <div className="nombres">
        <RengTarjeta titulo="Nombre recomendado" nombre={rengK.nombres.principal} rec />
      </div>
    )
  }
  return (
    <div className="stack" style={{ gap: 6 }}>
      <div className="nombres">
        {(['sistematica', 'stock', 'tradicional'] as RengNomenclatura[]).map((rengN) => (
          <RengTarjeta key={rengN} titulo={RENG_NOMBRE_NOMENCLATURA[rengN]} nombre={rengK.nombres[rengN]} rec={rengK.nombres.recomendadas.includes(rengN)} />
        ))}
      </div>
      {rengK.nombres.comunes.length > 0 && <span className="sm muted">Nombres comunes aceptados: {rengK.nombres.comunes.join(', ')}</span>}
    </div>
  )
}

export function RengEstructura({ k: rengK }: { k: RengCompuesto }): React.JSX.Element {
  const rengAcento = rengColorTema('--accent', 0x38d0ff)
  const rengBase = rengK.formula.split('·')[0]!
  const rengIdRed = RENG_RED_DE[rengBase]
  const rengMolecula = useMemo(() => {
    try {
      const rengClave = rengFormulaHill(rengAnalizarFormula(rengBase).atomos)
      return RENG_MOLECULAS.find((rengM) => rengFormulaHill(rengAnalizarFormula(rengM.formula).atomos) === rengClave) ?? null
    } catch {
      return null
    }
  }, [rengBase])
  const rengModelo = useMemo(() => {
    if (rengIdRed) return rengCrearRed(RENG_ESTRUCTURAS[rengIdRed]!, rengAcento, { n: 2, tamano: 6 }).grupo
    if (rengMolecula) return rengBuildMolecule(rengMolecula, 'bolas')
    return null
  }, [rengIdRed, rengMolecula, rengAcento])
  if (!rengModelo) {
    return (
      <div className="lienzo-vacio">
        <div className="stack" style={{ maxWidth: 460 }}>
          <b>Sin estructura 3D verificada</b>
          <span className="sm">
            {rengK.funcion === 'cation' || rengK.funcion === 'anion' || rengK.funcion === 'oxoanion'
              ? 'Los iones sueltos no se muestran en 3D.'
              : 'La app solo dibuja moléculas con geometría experimental y redes con parámetros del CRC. Para este compuesto aún no tiene esos datos, así que solo muestra la fórmula.'}
          </span>
        </div>
      </div>
    )
  }
  const rengEst = rengIdRed ? RENG_ESTRUCTURAS[rengIdRed]! : null
  const rengIones = rengEst ? [...new Set(rengEst.base.map((rengS) => rengS.ion))] : []
  return (
    <RengLienzo3D modelo={rengModelo} distancia={rengIdRed ? 12 : 7} etiqueta={rengIdRed ? `Red cristalina de ${rengBase}` : `Molécula de ${rengBase}`}>
      <div className="hud">
        {rengEst ? (
          <>
            <div>
              <b>{rengEst.nombre}</b>
            </div>
            <div>
              Coordinación {rengIones.map((rengI) => rengCoordinacion(rengEst, rengI).nc).join(':')} · {rengUnidadesFormula(rengEst)} unidades por celda
            </div>
            <div>
              a = {rengComa(rengEst.a, 3)} Å{rengEst.c ? ` · c = ${rengComa(rengEst.c, 3)} Å` : ''}
            </div>
          </>
        ) : (
          <div>
            <b>{rengMolecula!.nombre}</b> · {rengMolecula!.geometria}
          </div>
        )}
      </div>
    </RengLienzo3D>
  )
}

