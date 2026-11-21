import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { RENG_NOMBRE_EVIDENCIA } from '@shared/cuaderno'
import { rengTomarReapertura } from '@/lib/cuaderno/api'
import { RengGuardarEnCuaderno } from '@/lib/cuaderno/GuardarEnCuaderno'
import { rengLeerMagnitudDilucion, type RengMagnitudDilucion } from '../../nucleo/dilucion'
import { rengCorridaEscena, rengEntradasDeCorrida, rengTextoVersionModelo, RENG_MODULO_CORRIDAS } from '../../practica/corridaEscena'
import { RENG_MODELOS_ESCENA, type RengEntradasSim, type RengEscena } from '../../practica/modelosSimulacion'
import { rengNivelPermite } from '../../practica/niveles'
import { RENG_UNIDADES_SIM, rengConvertirUnidad, rengDiagnosticosDominio, rengEntradasLegibles, rengResumenEscena, rengSensibilidadEscena, rengTipoUnidadDe, type RengTipoUnidad } from '../../practica/reglasEscena'
import { useRengNivelPractica } from '../../vista/nivel'
import { RengAviso, RengEtiqueta } from '../../vista/ui'

export interface RengInicialEscena {
  n: number
  entradas: RengEntradasSim
}

interface RengCtxFormulario {
  invalidos: Readonly<Record<string, string>>
  marcar: (rengEtiqueta: string, rengMensaje: string | null) => void
  enfocarPrimero: () => void
}

const RengFormularioCtx = createContext<RengCtxFormulario | null>(null)

export function RengFormulario({ children: rengChildren }: { children: React.ReactNode }): React.JSX.Element {
  const rengRef = useRef<HTMLDivElement>(null)
  const [rengInvalidos, rengSetInvalidos] = useState<Record<string, string>>({})
  const rengMarcar = useCallback((rengEtiqueta: string, rengMensaje: string | null): void => {
    rengSetInvalidos((rengPrevios) => {
      if (rengMensaje === null) {
        if (!(rengEtiqueta in rengPrevios)) return rengPrevios
        const { [rengEtiqueta]: _rengQuitado, ...rengResto } = rengPrevios
        return rengResto
      }
      return rengPrevios[rengEtiqueta] === rengMensaje ? rengPrevios : { ...rengPrevios, [rengEtiqueta]: rengMensaje }
    })
  }, [])
  const rengEnfocar = useCallback((): void => {
    rengRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [])
  const rengCtx = useMemo(() => ({ invalidos: rengInvalidos, marcar: rengMarcar, enfocarPrimero: rengEnfocar }), [rengInvalidos, rengMarcar, rengEnfocar])
  return (
    <RengFormularioCtx.Provider value={rengCtx}>
      <div className="q-entrada" ref={rengRef}>
        {rengChildren}
      </div>
    </RengFormularioCtx.Provider>
  )
}

const rengDecimalesEs = (rengX: number): string => String(Number(rengX.toPrecision(12))).replace('.', ',')

type RengLecturaCampo = { ok: true; base: number } | { ok: false; mensaje: string }

export function RengNum({ etiqueta: rengEtiqueta, valor: rengValor, onChange: rengOnChange, min: rengMin, max: rengMax, paso: rengPaso = 'any', unidad: rengUnidad }: { etiqueta: string; valor: number; onChange: (rengV: number) => void; min?: number; max?: number; paso?: number | 'any'; unidad?: string }): React.JSX.Element {
  const rengNivel = useRengNivelPractica()
  const rengCtx = useContext(RengFormularioCtx)
  const rengIdMsg = useId()
  const rengTipo: RengTipoUnidad | null = rengUnidad ? rengTipoUnidadDe(rengUnidad) : null
  const rengAlternas = rengTipo !== null && rengNivelPermite(rengNivel, 'universitario') ? RENG_UNIDADES_SIM[rengTipo].alternas : null
  const [rengUni, rengSetUni] = useState(rengUnidad ?? '')
  const rengConUnidad = rengTipo !== null && rengUnidad !== undefined && rengUni !== rengUnidad
  const rengEnUni = (rengBase: number): number => (rengConUnidad ? rengConvertirUnidad(rengBase, rengTipo!, rengUnidad!, rengUni) : rengBase)
  const rengABase = (rengX: number): number => (rengConUnidad ? rengConvertirUnidad(rengX, rengTipo!, rengUni, rengUnidad!) : rengX)
  const [rengTxt, rengSetTxt] = useState<string | null>(null)
  const rengPrevio = useRef(rengValor)

  const rengLeer = (rengT: string): RengLecturaCampo => {
    const rengLimpio = rengT.trim().replace(',', '.')
    if (rengLimpio === '') return { ok: false, mensaje: 'Escribe un número.' }
    const rengN = Number(rengLimpio)
    if (!Number.isFinite(rengN)) return { ok: false, mensaje: 'No es un número válido.' }
    const rengBase = rengABase(rengN)
    const rengU = rengUni ? ` ${rengUni}` : ''
    if (rengMin !== undefined && rengBase < rengMin) return { ok: false, mensaje: `Fuera del dominio del modelo: mínimo ${rengDecimalesEs(rengEnUni(rengMin))}${rengU}.` }
    if (rengMax !== undefined && rengBase > rengMax) return { ok: false, mensaje: `Fuera del dominio del modelo: máximo ${rengDecimalesEs(rengEnUni(rengMax))}${rengU}.` }
    return { ok: true, base: rengBase }
  }

  const rengLectura = rengTxt === null ? null : rengLeer(rengTxt)
  const rengMensaje = rengLectura !== null && !rengLectura.ok ? rengLectura.mensaje : null

  useEffect(() => {
    if (rengPrevio.current === rengValor) return
    rengPrevio.current = rengValor
    if (rengTxt === null) return
    const rengL = rengLeer(rengTxt)
    if (!rengL.ok || rengL.base !== rengValor) rengSetTxt(null)
  }, [rengValor])

  useEffect(() => {
    rengCtx?.marcar(rengEtiqueta, rengMensaje)
    return () => rengCtx?.marcar(rengEtiqueta, null)
  }, [rengMensaje, rengEtiqueta, rengCtx?.marcar])

  const rengMostrado = rengTxt ?? rengDecimalesEs(rengEnUni(rengValor)).replace(',', '.')
  return (
    <label className="sim-campo">
      <span>{rengEtiqueta}</span>
      <span className="sim-campo-fila">
        <input
          className="input"
          type="number"
          inputMode="decimal"
          step={rengPaso}
          value={rengMostrado}
          aria-invalid={rengMensaje !== null || undefined}
          aria-describedby={rengMensaje !== null ? rengIdMsg : undefined}
          onChange={(rengE) => {
            const rengT = rengE.target.value
            rengSetTxt(rengT)
            const rengL = rengLeer(rengT)
            if (rengL.ok) rengOnChange(rengL.base)
          }}
          onBlur={() => {
            if (rengTxt !== null && rengLeer(rengTxt).ok) rengSetTxt(null)
          }}
        />
        {rengAlternas && rengAlternas.length > 0 ? (
          <select
            className="input q-unidad"
            aria-label={`Unidad de ${rengEtiqueta}`}
            value={rengUni}
            onChange={(rengE) => {
              rengSetUni(rengE.target.value)
              rengSetTxt(null)
            }}
          >
            {[rengUnidad!, ...rengAlternas.map((rengA) => rengA.simbolo)].map((rengS) => (
              <option key={rengS} value={rengS}>
                {rengS}
              </option>
            ))}
          </select>
        ) : (
          rengUnidad && <small>{rengUnidad}</small>
        )}
      </span>
      {rengMensaje !== null && (
        <small className="q-fuera-dominio" id={rengIdMsg}>
          {rengMensaje} Se conserva lo que escribiste; los cálculos siguen usando {rengDecimalesEs(rengEnUni(rengValor))}
          {rengUni ? ` ${rengUni}` : ''} hasta que lo corrijas.
        </small>
      )}
    </label>
  )
}

export function RengNumModelo({ escena: rengEscena, clave: rengClave, etiqueta: rengEtiqueta, valor: rengValor, onChange: rengOnChange, unidad: rengUnidad }: { escena: RengEscena; clave: string; etiqueta?: string; valor: number; onChange: (rengV: number) => void; unidad?: string }): React.JSX.Element {
  const rengC = RENG_MODELOS_ESCENA[rengEscena].campos.find((rengX) => rengX.clave === rengClave)
  if (!rengC) throw new RangeError(`el modelo «${rengEscena}» no tiene el campo «${rengClave}»`)
  return <RengNum etiqueta={rengEtiqueta ?? rengC.etiqueta} valor={rengValor} min={rengC.min} max={rengC.max} unidad={rengUnidad ?? (rengC.unidad || undefined)} onChange={rengOnChange} />
}

export function RengNumMagnitud({ escena: rengEscena, clave: rengClave, etiqueta: rengEtiqueta, magnitud: rengMagnitud, valor: rengValor, onChange: rengOnChange }: { escena: RengEscena; clave: string; etiqueta?: string; magnitud: RengMagnitudDilucion; valor: number; onChange: (rengV: number) => void }): React.JSX.Element {
  const rengCtx = useContext(RengFormularioCtx)
  const rengIdMsg = useId()
  const rengCampo = RENG_MODELOS_ESCENA[rengEscena].campos.find((rengX) => rengX.clave === rengClave)
  if (!rengCampo) throw new RangeError(`el modelo «${rengEscena}» no tiene el campo «${rengClave}»`)
  const rengEtq = rengEtiqueta ?? rengCampo.etiqueta
  const [rengTxt, rengSetTxt] = useState<string | null>(null)
  const rengPrevio = useRef(rengValor)
  const rengLeer = (rengT: string): RengLecturaCampo => {
    const rengL = rengLeerMagnitudDilucion(rengT, rengMagnitud)
    if (!rengL.ok) return { ok: false, mensaje: rengL.mensaje }
    if (rengCampo.min !== undefined && rengL.valor < rengCampo.min) return { ok: false, mensaje: `Fuera del dominio del modelo: mínimo ${rengDecimalesEs(rengCampo.min)} ${rengCampo.unidad}.` }
    if (rengCampo.max !== undefined && rengL.valor > rengCampo.max) return { ok: false, mensaje: `Fuera del dominio del modelo: máximo ${rengDecimalesEs(rengCampo.max)} ${rengCampo.unidad}.` }
    return { ok: true, base: rengL.valor }
  }
  const rengLectura = rengTxt === null ? null : rengLeer(rengTxt)
  const rengMensaje = rengLectura !== null && !rengLectura.ok ? rengLectura.mensaje : null
  useEffect(() => {
    if (rengPrevio.current === rengValor) return
    rengPrevio.current = rengValor
    if (rengTxt === null) return
    const rengL = rengLeer(rengTxt)
    if (!rengL.ok || rengL.base !== rengValor) rengSetTxt(null)
  }, [rengValor])
  useEffect(() => {
    rengCtx?.marcar(rengEtq, rengMensaje)
    return () => rengCtx?.marcar(rengEtq, null)
  }, [rengMensaje, rengEtq, rengCtx?.marcar])
  return (
    <label className="sim-campo">
      <span>{rengEtq}</span>
      <input
        className="input"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={rengTxt ?? `${rengDecimalesEs(rengValor)} ${rengCampo.unidad}`}
        aria-invalid={rengMensaje !== null || undefined}
        aria-describedby={rengMensaje !== null ? rengIdMsg : undefined}
        onFocus={(rengE) => rengE.target.select()}
        onChange={(rengE) => {
          const rengT = rengE.target.value
          rengSetTxt(rengT)
          const rengL = rengLeer(rengT)
          if (rengL.ok) rengOnChange(rengL.base)
        }}
        onBlur={() => {
          if (rengTxt !== null && rengLeer(rengTxt).ok) rengSetTxt(null)
        }}
      />
      {rengMensaje !== null && (
        <small className="q-fuera-dominio" id={rengIdMsg}>
          {rengMensaje} Se conserva lo que escribiste; los cálculos siguen usando {rengDecimalesEs(rengValor)} {rengCampo.unidad} hasta que lo corrijas.
        </small>
      )}
    </label>
  )
}

export const rengFmt = (rengV: number, rengD = 3): string => (Number.isFinite(rengV) ? (Math.abs(rengV) >= 1e4 || (Math.abs(rengV) < 1e-3 && rengV !== 0) ? rengV.toExponential(2) : Number(rengV.toPrecision(rengD)).toString()).replace('.', ',') : '∞')

export function rengFmtDistinguible(rengA: number, rengB: number): [string, string] {
  const rengX = rengFmt(rengA)
  const rengY = rengFmt(rengB)
  if (rengX !== rengY || rengA === rengB || !Number.isFinite(rengA) || !Number.isFinite(rengB)) return [rengX, rengY]
  for (let rengD = 4; rengD <= 12; rengD++) if (rengFmt(rengA, rengD) !== rengFmt(rengB, rengD)) return [rengFmt(rengA, rengD), rengFmt(rengB, rengD)]
  return [rengFmt(rengA, 12), rengFmt(rengB, 12)]
}

export function RengResultado({ etiqueta: rengEtiqueta, valor: rengValor }: { etiqueta: string; valor: string }): React.JSX.Element {
  return (
    <div className="sim-res">
      <small>{rengEtiqueta}</small>
      <b>{rengValor}</b>
    </div>
  )
}

const RENG_NATURALEZA = {
  calculo: { texto: 'Resultado calculado', tono: 'neutro', ayuda: 'Sale del modelo con los datos que aplicaste; no es una medición.' },
  publicado: { texto: 'Dato publicado', tono: 'ok', ayuda: 'Valor tomado de una fuente consultada.' },
  libro: { texto: 'Dato de libro, sin consultar', tono: 'aviso', ayuda: 'Valor de libro de texto que no se contrastó con la fuente en esta versión.' },
  ejemplo: { texto: 'Valor de ejemplo', tono: 'aviso', ayuda: 'Valor inventado o didáctico: ilustra la regla, no describe una sustancia real.' }
} as const

export function RengNaturaleza({ tipo: rengTipo }: { tipo: keyof typeof RENG_NATURALEZA }): React.JSX.Element {
  const rengN = RENG_NATURALEZA[rengTipo]
  return (
    <RengEtiqueta tono={rengN.tono} title={rengN.ayuda}>
      {rengN.texto}
    </RengEtiqueta>
  )
}

export function RengPanelModelo({ escena: rengEscena }: { escena: RengEscena }): React.JSX.Element {
  const rengM = RENG_MODELOS_ESCENA[rengEscena]
  const rengNivel = useRengNivelPractica()
  const rengUniversitario = rengNivelPermite(rengNivel, 'universitario')
  const rengQuimico = rengNivelPermite(rengNivel, 'quimico')
  const rengCientifico = rengNivelPermite(rengNivel, 'cientifico')
  return (
    <details className="panel-seccion q-modelo">
      <summary>Modelo, dominio y supuestos</summary>
      <div className="stack tight">
        <h4>Tipo de cálculo</h4>
        <p className="sm">{rengM.calculo}</p>
        <h4>Supuestos</h4>
        <ul className="sm">
          {rengM.supuestos.map((rengX) => (
            <li key={rengX}>{rengX}</li>
          ))}
        </ul>
        {rengUniversitario && (
          <>
            <h4>Ecuaciones</h4>
            <ul className="sim-formulas">
              {rengM.ecuaciones.map((rengX) => (
                <li key={rengX}>{rengX}</li>
              ))}
            </ul>
            <h4>Entradas del modelo</h4>
            <ul className="sm">
              {rengM.campos.map((rengC) => (
                <li key={rengC.clave}>
                  {rengC.etiqueta}
                  {rengC.unidad ? ` (${rengC.unidad})` : ''}
                  {rengC.min !== undefined || rengC.max !== undefined ? ` · de ${rengC.min ?? '−∞'} a ${rengC.max ?? '+∞'}` : ''}
                  {rengC.requerido ? '' : ' · opcional'}
                </li>
              ))}
            </ul>
            <h4>Dominio de validez</h4>
            <ul className="sm">
              {rengM.dominio.map((rengX) => (
                <li key={rengX}>{rengX}</li>
              ))}
            </ul>
          </>
        )}
        {rengQuimico && (
          <>
            <h4>Condiciones</h4>
            <ul className="sm" data-ficha="condiciones">
              {rengM.condiciones.map((rengX) => (
                <li key={rengX}>{rengX}</li>
              ))}
            </ul>
            <h4>Especies y fases</h4>
            <ul className="sm" data-ficha="especies">
              {rengM.especiesFases.map((rengX) => (
                <li key={rengX}>{rengX}</li>
              ))}
            </ul>
            <h4>Procedencia de los parámetros</h4>
            <ul className="sm">
              {rengM.parametros.map((rengP) => (
                <li key={rengP.nombre}>
                  <b>{rengP.nombre}</b>: {rengP.valor} · {rengP.fuente} <RengNaturaleza tipo={rengP.verificacion === 'consultada' ? 'publicado' : 'libro'} />
                </li>
              ))}
            </ul>
          </>
        )}
        <h4>Límites</h4>
        <ul className="sm">
          {rengM.limites.map((rengX) => (
            <li key={rengX}>{rengX}</li>
          ))}
        </ul>
        {rengCientifico && (
          <>
            <h4>Ficha del modelo</h4>
            <ul className="sm" data-ficha="version">
              <li>
                Versión del modelo: <b>{rengM.version}</b> · evidencia: <b>{RENG_NOMBRE_EVIDENCIA[rengM.evidencia]}</b>
              </li>
              <li>Verificación: {rengM.verificacion}</li>
              <li>Salidas: {rengM.salidas.map((rengS) => `${rengS.nombre}${rengS.unidad ? ` (${rengS.unidad})` : ''}`).join('; ')}.</li>
            </ul>
          </>
        )}
        <h4>Cómo leer las etiquetas</h4>
        <p className="sm">
          <RengNaturaleza tipo="calculo" /> sale del modelo con tus datos. <RengNaturaleza tipo="publicado" /> viene de una fuente consultada; <RengNaturaleza tipo="libro" /> y <RengNaturaleza tipo="ejemplo" /> son orientativos. Estas escenas no muestran mediciones ni esquemas de partículas: toda gráfica es un cálculo del modelo.
        </p>
      </div>
    </details>
  )
}

export function useRengCalculo<RengT>(rengPorDefecto: RengT, rengInicial: RengInicialEscena | null | undefined, rengDesde: (rengE: RengEntradasSim) => RengT): { borrador: RengT; aplicado: RengT | null; sucio: boolean; cambiar: (rengP: Partial<RengT>) => void; calcular: () => void; reemplazar: (rengT: RengT, rengAplicar: boolean) => void } {
  const [rengBorrador, rengSetBorrador] = useState<RengT>(rengPorDefecto)
  const [rengAplicado, rengSetAplicado] = useState<RengT | null>(null)
  const rengN = rengInicial?.n ?? 0
  useEffect(() => {
    if (!rengInicial) return
    const rengT = rengDesde(rengInicial.entradas)
    rengSetBorrador(rengT)
    rengSetAplicado(rengT)
  }, [rengN])
  return {
    borrador: rengBorrador,
    aplicado: rengAplicado,
    sucio: rengAplicado !== null && JSON.stringify(rengAplicado) !== JSON.stringify(rengBorrador),
    cambiar: (rengP) => rengSetBorrador((rengB) => ({ ...rengB, ...rengP })),
    calcular: () => rengSetAplicado(rengBorrador),
    reemplazar: (rengT, rengAplicar) => {
      rengSetBorrador(rengT)
      if (rengAplicar) rengSetAplicado(rengT)
    }
  }
}

export function RengBotonCalcular({ aplicado: rengAplicado, sucio: rengSucio, onCalcular: rengOnCalcular, deshabilitado: rengDeshabilitado = false, motivo: rengMotivo }: { aplicado: boolean; sucio: boolean; onCalcular: () => void; deshabilitado?: boolean; motivo?: string }): React.JSX.Element {
  const rengCtx = useContext(RengFormularioCtx)
  const [rengBloqueo, rengSetBloqueo] = useState<string | null>(null)
  const rengInvalidos = rengCtx ? Object.entries(rengCtx.invalidos) : []
  useEffect(() => {
    if (rengInvalidos.length === 0) rengSetBloqueo(null)
  }, [rengInvalidos.length])
  return (
    <div className="q-calcular">
      <button
        type="button"
        className="btn primary"
        disabled={rengDeshabilitado}
        onClick={() => {
          if (rengInvalidos.length > 0) {
            rengSetBloqueo(`No se calculó: corrige ${rengInvalidos.map(([rengE, rengM]) => `«${rengE}» (${rengM.replace(/\.$/, '')})`).join('; ')}. Tus entradas se conservan.`)
            rengCtx?.enfocarPrimero()
            return
          }
          rengSetBloqueo(null)
          rengOnCalcular()
        }}
      >
        {rengAplicado ? 'Actualizar' : 'Calcular'}
      </button>
      <span className="faint sm" role="status">
        {rengDeshabilitado && rengMotivo ? rengMotivo : !rengAplicado ? 'Configura los datos y pulsa «Calcular».' : rengSucio ? 'Hay cambios sin calcular: pulsa «Actualizar». El resultado de la derecha es del cálculo anterior.' : 'Resultado al día.'}
      </span>
      {rengBloqueo && (
        <p className="q-fuera-dominio sm" role="alert">
          {rengBloqueo}
        </p>
      )}
    </div>
  )
}

export function RengSalida({ sucio: rengSucio, resumen: rengResumen, children: rengChildren }: { sucio: boolean; resumen: readonly string[] | null; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="q-salida" data-desactualizado={rengSucio || undefined}>
      {rengSucio && rengResumen && (
        <RengAviso tipo="aviso">
          <b>Resultado del cálculo anterior.</b> Cambiaste datos y todavía no pulsaste «Actualizar». Lo que ves corresponde a: {rengResumen.join(' · ')}.
        </RengAviso>
      )}
      {!rengSucio && rengResumen && (
        <p className="faint sm" data-datos-aplicados="">
          Datos aplicados: {rengResumen.join(' · ')}.
        </p>
      )}
      {rengChildren}
    </div>
  )
}

export function RengDiagnosticos({ escena: rengEscena, entradas: rengEntradas }: { escena: RengEscena; entradas: RengEntradasSim | null }): React.JSX.Element | null {
  const rengNivel = useRengNivelPractica()
  const rengQuimico = rengNivelPermite(rengNivel, 'quimico')
  const rengClave = JSON.stringify(rengEntradas)
  const rengLista = useMemo(() => (rengEntradas ? rengDiagnosticosDominio(rengEscena, rengEntradas) : []), [rengEscena, rengClave])
  const rengVisibles = rengLista.filter((rengD) => rengD.codigo !== 'objetivo' && (rengQuimico || rengD.severidad !== 'info'))
  if (!rengEntradas) return null
  if (rengVisibles.length === 0) return rengQuimico ? <RengAviso tipo="ok">Diagnóstico del modelo: el caso está dentro del dominio declarado y los balances se cumplen.</RengAviso> : null
  return (
    <div className="stack tight" data-diagnosticos={rengEscena}>
      {rengVisibles.map((rengD) => (
        <RengAviso key={`${rengD.codigo}-${rengD.texto}`} tipo={rengD.severidad === 'info' ? 'info' : 'aviso'}>
          <b>{rengD.severidad === 'fuera' ? 'Fuera del dominio del modelo.' : rengD.severidad === 'aviso' ? 'Atención.' : 'Nota.'}</b> {rengD.texto}
        </RengAviso>
      ))}
    </div>
  )
}

export function RengComparaCasos({ escena: rengEscena, entradas: rengEntradas }: { escena: RengEscena; entradas: RengEntradasSim | null }): React.JSX.Element | null {
  const rengNivel = useRengNivelPractica()
  const [rengFijado, rengSetFijado] = useState<RengEntradasSim | null>(null)
  if (!rengNivelPermite(rengNivel, 'universitario') || !rengEntradas) return null
  const rengActual = rengResumenEscena(rengEscena, rengEntradas)
  const rengA = rengFijado ? rengResumenEscena(rengEscena, rengFijado) : null
  const rengClaves = [...new Set([...(rengA?.resultados ?? []), ...rengActual.resultados].map((rengR) => rengR.clave))]
  return (
    <details className="panel-seccion" data-comparacion={rengEscena}>
      <summary>Comparar dos casos</summary>
      <div className="stack tight">
        <div className="row">
          <button type="button" className="btn sm" disabled={!rengActual.ok} onClick={() => rengSetFijado({ ...rengEntradas })}>
            {rengFijado ? 'Cambiar el caso A por el cálculo actual' : 'Fijar el cálculo actual como caso A'}
          </button>
          {rengFijado && (
            <button type="button" className="btn ghost sm" onClick={() => rengSetFijado(null)}>
              Quitar el caso A
            </button>
          )}
        </div>
        {!rengFijado ? (
          <p className="faint sm">Fija el cálculo actual, cambia datos, pulsa «Actualizar» y compara ambos resultados.</p>
        ) : (
          <>
            <p className="sm">
              <b>Caso A:</b> {rengEntradasLegibles(rengEscena, rengFijado).join(' · ')}
            </p>
            <p className="sm">
              <b>Caso B (actual):</b> {rengEntradasLegibles(rengEscena, rengEntradas).join(' · ')}
            </p>
            <table className="table tabla-datos">
              <caption className="sr-only">Resultados del caso A y del caso B</caption>
              <thead>
                <tr>
                  <th scope="col">Resultado</th>
                  <th scope="col">Caso A</th>
                  <th scope="col">Caso B</th>
                  <th scope="col">B − A</th>
                </tr>
              </thead>
              <tbody>
                {rengClaves.map((rengC) => {
                  const rengX = rengA?.resultados.find((rengR) => rengR.clave === rengC)
                  const rengY = rengActual.resultados.find((rengR) => rengR.clave === rengC)
                  const rengU = (rengY ?? rengX)!.unidad
                  return (
                    <tr key={rengC}>
                      <th scope="row">{(rengY ?? rengX)!.nombre}</th>
                      <td>{rengX ? `${rengFmt(rengX.valor, 4)}${rengU ? ` ${rengU}` : ''}` : '—'}</td>
                      <td>{rengY ? `${rengFmt(rengY.valor, 4)}${rengU ? ` ${rengU}` : ''}` : '—'}</td>
                      <td>{rengX && rengY ? `${rengY.valor - rengX.valor > 0 ? '+' : ''}${rengFmt(rengY.valor - rengX.valor, 3)}${rengU ? ` ${rengU}` : ''}` : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!rengActual.ok && <RengAviso tipo="aviso">El caso B no se pudo calcular: {rengActual.diagnosticos[0]?.texto}</RengAviso>}
            {rengA && !rengA.ok && <RengAviso tipo="aviso">El caso A no se pudo calcular: {rengA.diagnosticos[0]?.texto}</RengAviso>}
          </>
        )}
      </div>
    </details>
  )
}

const RENG_INC_OPCIONES = [0.005, 0.01, 0.02, 0.05]

export function RengSensibilidadPanel({ escena: rengEscena, entradas: rengEntradas }: { escena: RengEscena; entradas: RengEntradasSim | null }): React.JSX.Element | null {
  const rengNivel = useRengNivelPractica()
  const [rengInc, rengSetInc] = useState(0.01)
  const rengClave = JSON.stringify(rengEntradas)
  const rengS = useMemo(() => {
    if (!rengEntradas) return null
    try {
      return rengSensibilidadEscena(rengEscena, rengEntradas, rengInc)
    } catch {
      return null
    }
  }, [rengEscena, rengClave, rengInc])
  if (!rengNivelPermite(rengNivel, 'cientifico') || !rengEntradas || !rengS) return null
  const rengU = rengS.salida.unidad ? ` ${rengS.salida.unidad}` : ''
  return (
    <details className="panel-seccion" data-sensibilidad={rengEscena} open>
      <summary>Sensibilidad e incertidumbre propagada</summary>
      <div className="stack tight">
        <label className="sim-campo">
          <span>Incertidumbre relativa supuesta en cada entrada</span>
          <select className="input" value={rengInc} onChange={(rengE) => rengSetInc(Number(rengE.target.value))}>
            {RENG_INC_OPCIONES.map((rengO) => (
              <option key={rengO} value={rengO}>
                ± {rengFmt(rengO * 100)} %
              </option>
            ))}
          </select>
        </label>
        <table className="table tabla-datos">
          <caption className="sr-only">Sensibilidad de {rengS.salida.nombre} a cada entrada</caption>
          <thead>
            <tr>
              <th scope="col">Entrada</th>
              <th scope="col">Cambio de {rengS.salida.nombre} por +1 %</th>
              <th scope="col">Aporte a la incertidumbre</th>
            </tr>
          </thead>
          <tbody>
            {rengS.filas.map((rengF) => (
              <tr key={rengF.clave}>
                <th scope="row">{rengF.etiqueta}</th>
                <td>
                  {rengF.cambioPorCiento > 0 ? '+' : ''}
                  {rengFmt(rengF.cambioPorCiento, 3)}
                  {rengU}
                </td>
                <td>
                  ± {rengFmt(rengF.contribucion, 3)}
                  {rengU}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="sim-formulas">
          {rengS.salida.nombre} = {rengFmt(rengS.valor, 4)}
          {rengU} ± {rengFmt(rengS.incertidumbre, 2)}
          {rengU}
        </p>
        <p className="faint sm">Propagación lineal (derivadas centradas a ±1 %), entradas independientes. La incertidumbre relativa es una suposición para explorar la sensibilidad: no es una incertidumbre medida ni incluye el error del modelo.{rengS.omitidas.length > 0 ? ` No se pudo evaluar: ${rengS.omitidas.join(', ')}.` : ''}</p>
      </div>
    </details>
  )
}

export interface RengReabierta {
  id: string
  nombre: string
  avisos: string[]
}

export function useRengReapertura(rengEscena: RengEscena, rengAplicar: (rengEntradas: RengEntradasSim) => void): [RengReabierta | null, () => void] {
  const [rengReabierta, rengSetReabierta] = useState<RengReabierta | null>(null)
  const rengRef = useRef(rengAplicar)
  rengRef.current = rengAplicar
  useEffect(() => {
    const rengTomar = (): void => {
      const rengP = rengTomarReapertura(RENG_MODULO_CORRIDAS, rengEscena)
      if (!rengP) return
      const { entradas: rengEntradas, avisos: rengAvisos } = rengEntradasDeCorrida(rengEscena, rengP.entradas)
      const rengVersion = rengTextoVersionModelo(rengEscena, rengP.version)
      rengRef.current(rengEntradas)
      rengSetReabierta({ id: rengP.corrida, nombre: rengP.nombre, avisos: [...rengAvisos, ...(rengVersion ? [rengVersion] : [])] })
    }
    rengTomar()
    window.addEventListener('hashchange', rengTomar)
    return () => window.removeEventListener('hashchange', rengTomar)
  }, [rengEscena])
  return [rengReabierta, () => rengSetReabierta(null)]
}

export function RengAvisoReabierta({ reabierta: rengReabierta }: { reabierta: RengReabierta | null }): React.JSX.Element | null {
  if (!rengReabierta) return null
  return (
    <div className="stack tight" data-reabierta="">
      <RengAviso tipo="info">Reabierta desde el cuaderno: «{rengReabierta.nombre}». Los procesos en el tiempo vuelven en pausa en el instante guardado. Si la guardas de nuevo quedará enlazada a la original.</RengAviso>
      {rengReabierta.avisos.map((rengA) => (
        <RengAviso key={rengA} tipo="aviso">
          {rengA}
        </RengAviso>
      ))}
    </div>
  )
}

export const rengAdvertenciaPendiente = (rengSucio: boolean, rengResumen: readonly string[] | null): string | null => (rengSucio && rengResumen ? `Hay cambios sin calcular: se guardará el cálculo aplicado (${rengResumen.join(' · ')}), no los valores que ves ahora en el formulario. Pulsa «Actualizar» antes de guardar si quieres guardar los nuevos.` : null)

export function RengGuardarEscena({ escena: rengEscena, entradas: rengEntradas, nombre: rengNombre, anterior: rengAnterior, advertencia: rengAdvertencia }: { escena: RengEscena; entradas: RengEntradasSim | null; nombre: string; anterior: string | null; advertencia: string | null }): React.JSX.Element | null {
  if (!rengEntradas) return null
  return <RengGuardarEnCuaderno calcular={() => rengCorridaEscena(rengEscena, rengEntradas)} nombreSugerido={rengNombre} anterior={rengAnterior} advertencia={rengAdvertencia} />
}
