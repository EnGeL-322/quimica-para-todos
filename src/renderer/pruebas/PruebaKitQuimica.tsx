import '../modules/simulador-quimica/aprender/n1/n1.css'
import { RengDiagramaNiveles, RengEjesFigura, RengFlechaReaccion } from '../modules/simulador-quimica/vista/figuras/Figuras'
import { RengEscenaN1 } from '../modules/simulador-quimica/vista/EscenaN1'
import { RengEcuacionTex, RengFormulaQuimica } from '../modules/simulador-quimica/vista/tex/EcuacionTex'
import { RENG_MODELO_DEMO_KIT, RENG_MODELO_DEMO_ROTO } from './modeloDemo'

const RENG_LARGA = String.raw`P = \frac{n \cdot R \cdot T}{V - n \cdot b} - \frac{a \cdot n^{2}}{V^{2}} + \frac{n \cdot R \cdot T}{V - n \cdot b} - \frac{a \cdot n^{2}}{V^{2}} + \frac{n \cdot R \cdot T}{V - n \cdot b} - \frac{a \cdot n^{2}}{V^{2}} + \frac{n \cdot R \cdot T}{V - n \cdot b} - \frac{a \cdot n^{2}}{V^{2}} + \frac{n \cdot R \cdot T}{V - n \cdot b}`

export function RengPruebaKitQuimica({ sabotaje: rengSabotaje }: { sabotaje: boolean }): React.JSX.Element {
  return (
    <main id="prueba-kit" className="q-n1" style={{ padding: 'var(--s-4)', overflowY: 'auto', height: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <h1>Prueba interna del kit de Química (solo compilación de pruebas)</h1>
      <section data-prueba-seccion="ecuaciones">
        <h2>Ecuaciones y fórmulas</h2>
        <div data-prueba="gas-ideal">
          <RengEcuacionTex tex={String.raw`P \cdot V = n \cdot R \cdot T`} texto="P · V = n · R · T" bloque numero="0.1" />
        </div>
        <div data-prueba="urms">
          <RengEcuacionTex tex={String.raw`u_{\mathrm{rms}} = \sqrt{\frac{3 \cdot R \cdot T}{M}}`} texto="u_rms = √(3 · R · T / M)" bloque numero="0.2" />
        </div>
        <div data-prueba="reaccion">
          <RengFormulaQuimica formula="N2(g) + 3H2(g) <=> 2NH3(g)" texto="N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)" bloque numero="0.3" />
        </div>
        <p data-prueba="en-linea">
          El ion sulfato, <RengFormulaQuimica formula="SO4^2-" texto="SO₄²⁻" />, y la constante <RengEcuacionTex tex={String.raw`R = 8{,}314\ \mathrm{J/(mol \cdot K)}`} texto="R = 8,314 J/(mol·K)" /> en una línea de texto.
        </p>
        <div data-prueba="rota">
          <RengEcuacionTex tex={String.raw`\frac{a}{`} texto="a / (falta el denominador)" bloque />
        </div>
        <div data-prueba="formula-rechazada">
          <RengFormulaQuimica formula={String.raw`H2O}\href{x}{y`} texto="H₂O" bloque />
        </div>
        <div data-prueba="larga" style={{ maxWidth: '420px' }}>
          <RengEcuacionTex tex={RENG_LARGA} texto="ecuación larga de prueba" bloque />
        </div>
        <div data-prueba="modo-texto">
          <RengEcuacionTex tex={String.raw`\rho = \frac{m}{V}`} texto="ρ = m / V" bloque modoTexto />
        </div>
      </section>
      <section data-prueba-seccion="figuras">
        <h2>Figuras</h2>
        <RengEjesFigura
          numero="0.1"
          titulo="Isotermas de Boyle"
          pie="Presión frente a volumen para dos temperaturas (modelo de gas ideal, valores de ejemplo)."
          alternativo="Dos curvas decrecientes: a mayor volumen, menor presión; la curva de 400 K queda por encima de la de 300 K."
          x={{ min: 0, max: 10, titulo: 'V (L)' }}
          y={{ min: 0, max: 30, titulo: 'P (kPa)' }}
          series={[
            { nombre: '300 K', puntos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rengV) => [rengV, 24.94 / rengV] as const) },
            { nombre: '400 K', puntos: [2, 3, 4, 5, 6, 7, 8, 9, 10].map((rengV) => [rengV, 33.26 / rengV] as const) }
          ]}
        />
        <RengDiagramaNiveles
          numero="0.2"
          titulo="Diagrama de niveles de ejemplo"
          pie="Tres niveles de energía de un sistema genérico y dos transiciones."
          alternativo="Tres niveles horizontales; flechas hacia arriba desde el fundamental hasta el primer y el segundo excitado."
          tituloEje="Energía"
          niveles={[
            { id: 'e0', valor: 0, etiqueta: 'Fundamental' },
            { id: 'e1', valor: 3, etiqueta: 'Primer excitado' },
            { id: 'e2', valor: 3.2, etiqueta: 'Segundo excitado' }
          ]}
          transiciones={[
            { desde: 'e0', hasta: 'e1', etiqueta: 'absorbe' },
            { desde: 'e0', hasta: 'e2', etiqueta: 'absorbe' }
          ]}
        />
        <p data-prueba="flechas">
          A <RengFlechaReaccion tipo="directa" arriba="calor" /> B · C <RengFlechaReaccion tipo="equilibrio" abajo="25 °C" /> D · E <RengFlechaReaccion tipo="resonancia" /> E′
        </p>
      </section>
      <section data-prueba-seccion="escena">
        <h2>Escena</h2>
        <RengEscenaN1 modelo={rengSabotaje ? RENG_MODELO_DEMO_ROTO : RENG_MODELO_DEMO_KIT} numeroFigura="0.3" />
      </section>
    </main>
  )
}
