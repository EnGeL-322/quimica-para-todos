# Datos y fuentes

Regla del proyecto: **cada dato dice de dónde sale** y la app no inventa lo que falta. Este documento resume qué se usa y con qué nivel de verificación.

## Niveles de verificación

| Etiqueta | Qué significa |
|---|---|
| **Fuente consultada** | Se abrió la fuente el día indicado y dice eso (casos reales; PubChem; NASA; USGS). |
| **Wikidata · con referencia** | Valor de Wikidata (CC0) cuya declaración cita una fuente. |
| **Wikidata · sin referencia** | Valor de Wikidata sin fuente verificable. Se muestra, pero se marca. |
| **Calculada · sin contrastar** | La app lo calcula por una regla (p. ej. la configuración electrónica por Aufbau); no se comparó con una tabla de referencia. |
| **Conocimiento general** | Química de libro de texto sin una fuente concreta consultada. |
| **Sin verificar** | Atribuido a una obra que nadie abrió (p. ej. la masa atómica y varios datos antiguos del proyecto). |

## Tabla periódica

- `src/renderer/modules/tabla-periodica/data.ts`: 118 elementos con símbolo, nombre, masa, categoría y posición. **La fuente de las masas no está registrada: sin verificar.**
- `datos-wikidata.json`: fusión, ebullición, densidad, año y descubridores. Obtenidos de **Wikidata (licencia CC0, dominio público)** con `node scripts/obtener-datos-elementos.mjs` (solo en desarrollo; la app no usa Internet). El script convierte las unidades mezcladas (K, °C, °F; g/cm³, kg/m³) y anota si cada valor cita una referencia.
- Cobertura de la última descarga (4-11-2026): fusión 104/118, ebullición 98/118, densidad 93/118, año 112/118. Lo que falta se muestra «sin dato».
- Filtros de coherencia (`datosElementos.ts`): una densidad que no corresponde al estado a 25 °C (gas de más de 50 kg/m³) y un par fusión/ebullición incoherente (astato) no se muestran, y el nivel Científico lo explica.
- Niveles de la ficha: **Básico** (una frase), **Avanzado** (temperaturas, densidad, descubrimiento, configuración) y **Científico** (todos los valores y su verificación).

## Casos reales (`datos/casos/`)

15 casos en cuatro temas (los cinco del cuerpo están en MediCuerpo): **naturaleza** (por fuera: el aire, el mar salado, la capa de ozono, los rayos), **espacio** (cohete, Venus, Marte, Titán, moléculas interestelares), **hogar** (pasta dental con flúor, vinagre y bicarbonato) y **Nikola Tesla** (motor de inducción, bobina, aparato de ozono, Wardenclyffe). Los datos viven en `datos/casos/` (un archivo por tema y `fuentes.ts`).

Cada afirmación es «consultada» (con la fuente y la fecha) o «conocimiento general». Cada fuente dice si se **abrió la página** o solo se vio un **resumen de búsqueda** (menos fiable; la etiqueta lo muestra en ámbar). Abiertas el 4-11-2026: PubChem (NaF, SnF₂, Na₂PO₃F, ATP, ozono), Fiorillo et al. 2020, USGS (agua del cuerpo y salinidad), NASA (Tierra, ozono, Venus, Marte, Titán), Cologne CDMS, la patente US 381 968 (motor) y el Tesla Science Center. Solo en resumen: patente US 568 177 (ozono), NIH ODS (calcio), un artículo PMC (hierro), un informe NASA NTRS (rayos), JoVE (pH gástrico), Wikipedia (bobina de Tesla, unidad «tesla») y los decimales del aire seco. Britannica y las fichas de NIH devolvieron acceso denegado.

Sobre Tesla solo se afirma lo que consta en patentes y en el Tesla Science Center. Se menciona, pero **no se afirma**, una «Tesla Ozone Company» de 1900 (solo una fuente secundaria).

Los casos nombran el experimento relacionado de Física para Todos (Lorentz, RLC, ondas, gas, Arquímedes, fotoeléctrico, cohete); esa app es independiente y no se abre desde aquí. Los porcentajes de flúor por compuesto **los calcula la app** con las masas molares. Las pruebas comprueban que cada sustancia se entiende y cabe en la mesa, que cada ecuación está balanceada, que cada experimento relacionado tiene nombre y motivo, y que las fechas de las patentes coinciden con las consultadas.

## Pendiente de verificar

- Las masas atómicas y las reacciones de `reaccionesConocidas.ts` citan capítulos de Greenwood–Earnshaw y Petrucci que nadie abrió.
- Configuración electrónica: contrastar con una tabla de referencia.
- Más datos de elementos (electronegatividad, radios, energías de ionización) con una fuente abierta y licencia clara.

## Simulaciones fisicoquímicas (pestaña «Simulaciones»)

Lógica pura en `nucleo/acidoBase.ts`, `cinetica.ts`, `equilibrio.ts` y `termoquimica.ts`; pruebas en `tests/quimica/fisicoquimica.test.ts` contra soluciones cerradas (cuadrática del ácido débil, ξ analítico del equilibrio, A→B→C analítica = RK4, ley de Hess del metano ≈ −890 kJ/mol).

| Dato | Valor | Fuente | Nivel |
|---|---|---|---|
| ΔfH° (12 sustancias, 298,15 K) | ver `termoquimica.ts` | Wikipedia «Standard enthalpy of formation» (sin fuente primaria por fila) | consultada, secundaria |
| pKa acético 4,756; fosfórico 2,14; pKw 13,9965 | | Wikipedia «Acid dissociation constant» (pKw: CRC) | consultada, secundaria |
| pKa HF, fórmico, NH₄⁺; S° de las sustancias | | libro de texto | **sin consultar** (marcado en la interfaz) |
| R = 8,314462618 J/(mol·K) | | CODATA 2018 (exacta) | consultada |
| K de los equilibrios de ejemplo | | ilustrativas | **no son datos medidos** (marcado en la interfaz) |

Límites: actividades = concentraciones (sin fuerza iónica), ΔH° y ΔS° constantes con T, una sola fase. Fuera de 273–373 K con agua líquida la interfaz avisa de que es extrapolación.

## Nivel 1 del temario · bloque 8 «Gases» (lecciones por capas y prácticas N1)

Escrito el 2026-11-18 **sin ejecutar** (ver `docs/ENTREGA-N1-B08-GASES.md`). Vocabulario de seis niveles del proyecto (`temario/verificacion.ts`).

| Dato | Valor | Origen | Nivel |
|---|---|---|---|
| R | 8,314462618 J/(mol·K); 0,082057 L·atm/(mol·K) = R·1000/101 325 | `datos/electroquimica.ts` (fila CODATA exacta) | bibliográfica declarada (no reabierta) |
| 1 atm | 101 325 Pa = 760 Torr; se toma 1 mmHg ≈ 1 Torr | catálogo de unidades (NIST SP 811) | bibliográfica declarada |
| ρ(Hg) y g | 13,5951 g/cm³ (convencional) y 9,80665 m/s² | catálogo de unidades (definición del mmHg; CGPM) | bibliográfica declarada |
| N_A, k_B | 6,02214076·10²³ mol⁻¹; 1,380649·10⁻²³ J/K | `nucleo/estequiometria.ts` (SI 2019) | bibliográfica declarada |
| 0 °C | 273,15 K | catálogo de unidades | bibliográfica declarada |
| Masas molares de 12 gases | redondeadas a 0,01 g/mol | tabla periódica de la app | **sin verificar** |
| Aire seco: 21 % O₂ | fracción molar 0,21 | caso real «El aire que respiras» (atribuido a la NASA) | bibliográfica declarada |
| Presión de vapor del agua (2,6 kPa; 15–35 mmHg) | en el enunciado | propio | **parámetro didáctico** (no es dato de tabla) |
| Densidades de líquidos de barómetros y de la «sustancia hipotética» | 0,6–1,6 g/mL | propio | parámetro didáctico |
| Parámetros de van der Waals a y b | 1–6 L²·atm/mol²; 0,020–0,060 L/mol | propio, gas hipotético | parámetro didáctico |
| Presiones «medidas» del factor Z | — | propio | parámetro didáctico |
| Volúmenes molares 22,41 y 24,47 L/mol | R·T/P | cálculo | dato calculado |
| OpenStax *Chemistry 2e*, cap. 9 (secciones 9.1–9.6) | títulos citados | no abierto | **sin verificar** |

Ningún dato del bloque es «fuente verificada». Los resultados de ejemplos y prácticas son «dato calculado» con un segundo método en las pruebas.

## Ecuaciones, figuras y escenas N1 (Entrega 0, 2026-11-18)

La Entrega 0 no añade ni cambia ningún dato científico. Las ecuaciones del bloque 8 solo cambian de presentación (TeX dibujado como MathML); sus textos son byte a byte los anteriores (prueba con huella SHA-256) y ningún resultado cambia. La escena de demostración del kit (A → B de primer orden) usa parámetros genéricos sin sustancia real («ejemplo idealizado») y vive solo en la compilación de pruebas. Temml 0.14.0 (MIT) y su parte mhchem (Apache 2.0) están registrados en `licencias/AVISOS-TERCEROS.txt`, `licencias/LICENCIA-APACHE-2.0.txt` y `licencias/PENDIENTES-ANTES-DE-DISTRIBUIR.md` (fila 12).

## Nivel 1 · bloque 7 «Estequiometría» y actualización «libro» del bloque 8 (2026-11-18)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| Masas atómicas y molares | tabla de la app | `tabla-periodica/data.ts` | **sin verificar** |
| N_A, R | valores registrados en el proyecto | `nucleo/estequiometria.ts`, `datos/electroquimica.ts` | bibliográfica declarada |
| Fracción de O₂ en el aire | 21 % en volumen | caso real «El aire que respiras» | bibliográfica declarada |
| Porcentajes de composición, masas de muestras, rendimientos y purezas de los enunciados | intervalos de las prácticas | propios | parámetro didáctico |
| Densidades del bloque 8 versión «libro» (1,15 g/L y 0,808 g/mL de una sustancia hipotética; agua 1000 kg/m³; masa molar media del aire 28,96 g/mol) | en los enunciados | propios | parámetro didáctico |
| Parámetros de van der Waals de la figura Z (3,59 L²·atm/mol², 0,0427 L/mol, gas hipotético) | — | propios | parámetro didáctico |
| OpenStax *Chemistry 2e*, secciones 3.1, 3.2, 4.3–4.5 | títulos citados | no abiertos | **sin verificar** |

Las figuras se calculan con el propio modelo de la app (dato calculado). Ningún dato de estos bloques es «fuente verificada».

## Nivel 1 · bloque 9 «Soluciones y concentraciones» (2026-11-18)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| Masas atómicas y molares | tabla de la app | `tabla-periodica/data.ts` | **sin verificar** |
| Constante crioscópica del agua K_f | 1,86 K·kg/mol | valor de uso común, no contrastado en esta entrega | parámetro didáctico (**sin verificar**) |
| Densidad del etanol | 0,789 g/mL | valor de uso común, no contrastado en esta entrega | parámetro didáctico (**sin verificar**) |
| Curvas de solubilidad de las sales A y B (S = 30 + 0,4·t; S = 12 + 0,9·t + 0,006·t²) y rectas de las prácticas | g/100 g de agua | propias, sales hipotéticas | parámetro didáctico |
| Solubilidades en g/L de CaSO₄, SrSO₄, BaF₂, CaF₂, MgF₂, Li₂CO₃, Ag₂SO₄, SrF₂ en las prácticas | 0,05–20 g/L | propias, no son valores de tabla | parámetro didáctico |
| Porcentajes de saturación de sales comunes en las prácticas | 10–40 % | propios, no son valores de tabla | parámetro didáctico |
| Constantes de Henry de la figura y prácticas | 0,035 y 0,018 mol/(L·atm); concentraciones en mmol/L | propias | parámetro didáctico |
| Porcentajes y densidades de reactivos de laboratorio (HCl, HNO₃, H₂SO₄, …) | 5–70 %; 1,02–1,85 g/mL | propios, combinaciones no reales | parámetro didáctico |
| ppm y ppb de contaminantes, cloro libre | intervalos de los enunciados | propios; no son límites normativos | parámetro didáctico |
| Densidades de disolución de las escenas y prácticas | 0,95–1,5 g/mL | propias | parámetro didáctico |
| OpenStax *Chemistry 2e*, secciones 3.3, 3.4, 11.1–11.4 | títulos citados | no abiertos | **sin verificar** |

Las figuras y la escena «concentraciones» se calculan con las funciones del núcleo (dato calculado).

## Nivel 1 · bloque 10 «Ácidos, bases y equilibrio elemental» (2026-11-19)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| pKw del núcleo (escenas) | 13,9965 a 25 °C | `nucleo/acidoBase.ts` | **sin verificar** en esta entrega |
| Kw de ejercicios y prácticas | 1,0·10⁻¹⁴ (pKw 14,00) | valor redondeado de uso común | parámetro didáctico (**sin verificar**) |
| R | 0,08314462618 L·bar/(mol·K) | `nucleo/equilibrio.ts` | bibliográfica declarada |
| Ka, Kb, pKa, Ksp de lecciones y prácticas (también 1,8·10⁻⁵, 9,25, 6,8·10⁻⁴, 3,9·10⁻¹¹, 5,6·10⁻¹⁰) | intervalos de los enunciados | propios, «del orden de» sustancias conocidas | parámetro didáctico |
| pKa de las sales del amortiguador (acetato 4,76, formiato 3,75, fluoruro 3,17) | — | valores de uso común, no contrastados | parámetro didáctico (**sin verificar**) |
| Kw a otras temperaturas (9,6·10⁻¹⁴ a 60 °C, 5,5·10⁻¹⁴ a 50 °C) | — | propios | parámetro didáctico |
| Kp, Kc, pK de indicadores, solubilidades en g/L | intervalos de los enunciados | propios | parámetro didáctico |
| OpenStax *Chemistry 2e*, secciones 4.2, 13.1–13.4, 14.1–14.4, 14.6, 14.7, 15.1, 15.2 | títulos citados | no abiertos | **sin verificar** |

Figuras y escenas calculadas con las funciones del núcleo (dato calculado).

## Nivel 1 · bloque 11 «Termoquímica y electroquímica introductoria» (2026-11-19)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| c(agua) | 4,184 J/(g·K) | `nucleo/termoquimica.ts` | **sin verificar** en esta entrega |
| Entalpías de formación y entropías (CH₄, CO₂, H₂O, NH₃, etanol, glucosa, O₂, H₂, N₂) | tabla del núcleo | `nucleo/termoquimica.ts` (cita una página consultada antes) | bibliográfica declarada |
| R | 8,314462618 J/(mol·K) | `datos/electroquimica.ts` (CODATA) | bibliográfica declarada |
| F | 96 485,33212 C/mol | `datos/electroquimica.ts` (CODATA 2018 y 2022 contrastadas) | bibliográfica declarada |
| Potenciales estándar de reducción de las prácticas (Li −3,04 … Ag +0,80 V) | — | valores de uso común | parámetro didáctico (**sin verificar**) |
| Calores específicos de metales, energías de enlace, Ea, ΔH y ΔS de reacciones genéricas, ΔHf de hidrocarburos, ΔH de vaporización, corrientes de corrosión | intervalos de los enunciados | propios | parámetro didáctico |
| Masas atómicas C = 12,011 y H = 1,008 dadas en el integrador 3 | en el enunciado | valores de uso común | parámetro didáctico |
| OpenStax *Chemistry 2e*, secciones 5.1–5.3, 7.5, 12.5, 16.1, 16.2, 16.4, 17.2, 17.3, 17.5–17.7 | títulos citados | no abiertos | **sin verificar** |

## Nivel 1 · bloque 5 «Nomenclatura inorgánica» (2026-11-19)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| Masas atómicas | tabla de la app | `tabla-periodica/data` | **sin verificar** (como en los bloques anteriores) |
| Nombres y fórmulas de óxidos, peróxidos, hidruros, hidróxidos, ácidos, sales e hidratos | nomenclatura IUPAC 2005 y tradicional | `nucleo/nomenclatura.ts` (el catálogo de la app cita la fuente de existencia de cada compuesto) | bibliográfica declarada |
| Sales básicas (Mg(OH)Cl, Al(OH)Cl₂, Cu₂(OH)₂CO₃, Cu₂(OH)₃Cl, Bi(OH)₂NO₃, …) | 16 fórmulas | propias, elegidas por electroneutralidad; el catálogo de la app no las incluye | parámetro didáctico (**sin verificar** su existencia) |
| Pares catión–anión de las prácticas 18 y 19 | 14 cationes × 12 aniones, con filtros | propios | parámetro didáctico (no se comprobó que cada compuesto exista) |
| Estados de oxidación habituales (tabla RENG_ESTADOS_COMUNES) | — | `nucleo/compuestosBinarios.ts` | bibliográfica declarada |
| OpenStax *Chemistry 2e*, secciones 2.4, 2.6, 2.7 y 4.2 | títulos citados | no abiertos | **sin verificar** |

## Nivel 1 · bloque 6 «Reacciones químicas» (2026-11-19)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| Masas atómicas | tabla de la app | `tabla-periodica/data` | **sin verificar** (como en los bloques anteriores) |
| Coeficientes de las ecuaciones | escritos a mano | contrastados con `nucleo/ajuste.ts` (ajuste algebraico e ion-electrón) | dato calculado |
| ΔH de combustión (CH₄ −890, C₃H₈ −2220, C₂H₆ −1560, C₄H₁₀ −2878, C₈H₁₈ −5470, etanol −1367, metanol −726, H₂ −286, C −394, glucosa −2803, C₂H₂ −1300, CO −283 kJ/mol) | — | valores redondeados de uso común | **sin verificar** |
| ΔH de reacciones endotérmicas (CaCO₃ +178, MgCO₃ +117, NaHCO₃ +64,5 por mol, H₂O +286, NH₄Cl +176, N₂ + O₂ +180, C + H₂O +131, Ca(OH)₂ +109, CuCO₃ +47, BaCO₃ +269, ZnCO₃ +71, HgO +91 kJ/mol) | — | valores redondeados de uso común o didácticos | **sin verificar** |
| Constantes de velocidad de la figura 6.15.1 (k₁ = 0,3 s⁻¹, k₂ = 0,1 s⁻¹) | — | propias | parámetro didáctico |
| Kw = 10⁻¹⁴ (figura de la neutralización) | — | valor de uso común | **sin verificar** |
| OpenStax *Chemistry 2e*, secciones 4.1–4.3, 5.3, 13.1, 15.1 y 17.1 | títulos citados | no abiertos | **sin verificar** |

## Nivel 1 · bloque 1 «Fundamentos de la química» (2026-11-19)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| Masas atómicas | tabla de la app | `tabla-periodica/data` | **sin verificar** (como en los bloques anteriores) |
| Densidades de materiales (Al 2,70; Fe 7,87; Cu 8,96; Pb 11,34; Ag 10,49; Au 19,3; Zn 7,14; Sn 7,31; Ni 8,91; Ti 4,51; Mg 1,74; Pt 21,45 g/mL) y de líquidos (etanol 0,789; glicerina 1,26; acetona 0,785; aceite 0,92; agua de mar 1,025; ácido acético 1,049; hexano 0,655; leche 1,03; cloroformo 1,49; mercurio 13,53; gasolina 0,74…) | — | valores redondeados de uso común | **sin verificar** |
| Hielo 0,917 g/mL; agua 1,00 g/mL | — | redondeados | **sin verificar** |
| Calores latentes del agua (334 y 2260 J/g); c del hielo 2,09 y del vapor 2,01 J/(g·K) | — | redondeados de uso común | **sin verificar** |
| c(agua) = 4,184 J/(g·K) | — | núcleo de la app | **sin verificar** |
| R = 8,314462618 J/(mol·K); N_A = 6,02214076·10²³ mol⁻¹ | — | valores exactos del SI (2019) recordados | bibliográfica declarada |
| Factores de conversión de unidades (km/h, mmHg, atm, °F…) | — | catálogo de unidades de la app (`lib/unidades`, con fuentes NIST) | bibliográfica declarada |
| Concentraciones de ácidos concentrados (HCl 12, H₂SO₄ 18, HNO₃ 15,8, ácido acético 17,4, H₃PO₄ 14,8 mol/L) | — | valores de etiqueta de uso común | **sin verificar** |
| Medidas didácticas de la figura 1.3.1 | seis puntos | propias | parámetro didáctico |
| OpenStax *Chemistry 2e*, secciones 1.1–1.6 y 2.1 | títulos citados | no abiertos | **sin verificar** |

## Nivel 1 · bloque 2 «Estructura atómica» (2026-11-19)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| Masas atómicas | tabla de la app | `tabla-periodica/data` | **sin verificar** (como en los bloques anteriores) |
| Configuraciones electrónicas (con las excepciones de Cr y Cu) | Z = 1–38 | `tabla-periodica/data` (`rengOcupacion`) | **sin verificar** |
| Masas del protón 1,007276 u, del neutrón 1,008665 u y del electrón 0,00054858 u; masa del electrón 9,1093837·10⁻³¹ kg y del protón 1,67262192·10⁻²⁷ kg | — | valores de uso común recordados | **sin verificar** |
| 1 u = 1,66054·10⁻²⁴ g; 1 u = 931,494 MeV; 13,6 eV (hidrógeno); r₀ ≈ 1,2 fm; diámetro del átomo de oro 0,288 nm | — | valores de uso común recordados | **sin verificar** |
| h = 6,62607015·10⁻³⁴ J·s; c = 299 792 458 m/s; e = 1,602176634·10⁻¹⁹ C; N_A = 6,02214076·10²³ mol⁻¹ | — | valores exactos del SI (2019) recordados | bibliográfica declarada |
| Masas y abundancias de isótopos (Li, B, N, Cl, Cu, Ga, Br, Rb, Ag, Sb, In, Eu, Tl, Re) | 14 pares | tablas IUPAC recordadas | **sin verificar** |
| Masas atómicas de núclidos para la energía de enlace (⁴He 4,002602 u … ⁵⁸Ni 57,935343 u) | 19 núclidos | tablas de masas atómicas recordadas | **sin verificar** |
| Núclidos emisores beta negativa (¹⁴C, ³H, ³²P, ⁶⁰Co, ⁹⁰Sr, ¹³¹I, ¹³⁷Cs, ⁴⁰K, ²⁴Na, ⁹⁹Mo, ²¹⁰Pb, ⁸⁷Rb, ⁵⁹Fe, ³⁵S, ⁴⁵Ca, ¹⁹⁸Au, ¹⁰Be, ²⁷Mg, ²⁸Al, ³¹Si, ³³P, ³⁶Cl, ³⁹Ar, ⁴²K) y pares de isóbaros | 24 y 16 | recordados | **sin verificar** |
| Tamaños de átomos y núcleos, espesores de lámina, velocidades y longitudes de onda de las prácticas | intervalos de cada práctica | propios | parámetro didáctico |
| Conversiones (u a g y kg, eV a J, nm a m) usadas como segundo método | — | catálogo de unidades de la app (`lib/unidades`, CODATA 2022 y BIPM) | bibliográfica declarada |
| OpenStax *Chemistry 2e*, secciones 2.1–2.3 y 6.1–6.4 | títulos citados | no abiertos | **sin verificar** |

## Nivel 1 · bloque 3 «Tabla periódica» (2026-11-19)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| Masas atómicas, categorías, grupos, periodos y configuraciones | tabla de la app | `tabla-periodica/data` | **sin verificar** (como en los bloques anteriores) |
| Radios atómicos (pm): H 37, He 31; Li 152 … Ne 70; Na 186 … Ar 98; K 227 … Kr 112; Rb 248 … Xe 131 | 34 elementos | tablas de libros de texto recordadas (`escenas-n1/modelos/tendencias-periodicas.ts`) | **sin verificar** |
| Primeras energías de ionización (kJ/mol): H 1312, He 2372; Li 520 … Ne 2081; Na 496 … Ar 1521; K 419 … Kr 1351; Rb 403 … Xe 1170 | 34 elementos | tablas de libros de texto recordadas | **sin verificar** |
| Afinidades electrónicas, energía liberada (kJ/mol): F 328, Cl 349, Br 325, I 295, O 141, S 200… | 22 elementos | tablas de libros de texto recordadas | **sin verificar** |
| Radios iónicos (pm): Li⁺ 76, Na⁺ 102, K⁺ 138, Rb⁺ 152, Be²⁺ 45, Mg²⁺ 72, Ca²⁺ 100, Sr²⁺ 118, Al³⁺ 54, F⁻ 133, Cl⁻ 181, Br⁻ 196, I⁻ 220, O²⁻ 140, S²⁻ 184, Se²⁻ 198, N³⁻ 146 | 17 iones | tablas de libros de texto recordadas | **sin verificar** |
| Electronegatividades de Pauling y estados de oxidación tabulados | tabla de la app | PubChem, guardado en `propiedades-pubchem.json` (consulta 2026-11-09), no abierto de nuevo | bibliográfica declarada |
| Años de descubrimiento (Ga, Sc, Ge, Ar, Ne, Kr, Xe, Po, Ra, Rn, Lu, Hf, Re, Tc, Fr, At, Np, Pu) | 18 elementos | Wikidata (CC0), guardado en `datos-wikidata.json`, no abierto de nuevo | bibliográfica declarada |
| Datos históricos (Döbereiner 1829, Newlands 1864, Mendeléiev 1869, Moseley 1913; densidad predicha y medida del germanio 5,5 y 5,35 g/cm³) | — | recordados | **sin verificar** |
| Volumen molar 22,414 L/mol; 96,485 kJ/mol por eV; h·c = 1239,84 eV·nm; Faraday 96 485,33 C/mol; R = 0,082057 atm·L/(mol·K) | — | valores de uso común recordados | **sin verificar** |
| Relación de Pauling para el carácter iónico, 100·(1 − e^(−Δχ²/4)) | — | fórmula empírica recordada | **sin verificar** |
| Minerales y sus fórmulas (hematita Fe₂O₃, magnetita Fe₃O₄, rutilo TiO₂, pirolusita MnO₂, cuprita Cu₂O, calcosina Cu₂S, esfalerita ZnS, pirita FeS₂, argentita Ag₂S, cinabrio HgS, siderita FeCO₃, rodocrosita MnCO₃…) | 16 | recordados | **sin verificar** |
| Núclidos de actínidos (²³²Th, ²³⁵U, ²³⁸U, ²³⁹Pu, ²⁴¹Am…) | 15 | recordados | **sin verificar** |
| Cantidades de las prácticas (masas, moles, volúmenes, proporciones de dopado, rendimientos) | intervalos de cada práctica | propios | parámetro didáctico |
| Contraste de los valores recordados con los datos con fuente del núcleo (`nucleo/datosEnlace.ts`: NIST ASD, CRC y Shannon; `nucleo/electronegatividad.ts`) | Ei de Na, Mg y Ca y afinidad de Cl, F y O dentro de 1 kJ/mol; radios de Na⁺, Mg²⁺, Cl⁻ y O²⁻ idénticos; electronegatividad de PubChem y del núcleo iguales hasta 0,01 para Z ≤ 54 | prueba `nivel1-b03-tabla` (añadida tras el cierre del lote) | dato calculado |
| OpenStax *Chemistry 2e*, secciones 2.5, 6.4, 6.5, 18.1 y 19.1 | títulos citados | no abiertos | **sin verificar** |

## Nivel 1 · bloque 4 «Enlace químico» (2026-11-19)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| Electronegatividades de Pauling; umbrales 0,4 y 1,7; relación de Pauling para el carácter iónico | núcleo de la app | `nucleo/electronegatividad.ts` (Pauling revisada por Allred; CRC Handbook), no abierto de nuevo | bibliográfica declarada |
| Moléculas diatómicas (H₂, HCl, Cl₂, O₂, N₂): distancia de equilibrio y energía de disociación | núcleo de la app | `nucleo/datosEnlace.ts` (Huber y Herzberg, vía NIST), no abierto de nuevo | bibliográfica declarada |
| Geometrías de H₂O, NH₃, BF₃, C₂H₄ y C₂H₂; energías de interacción (O–H 497,1; puente de hidrógeno 13,2; Ar···Ar 1,19 kJ/mol); distancias; puntos de ebullición de H₂O, H₂S, HCl y Ar; parámetros de red de Na, Fe, Cu, Au, Ag y Al | núcleo de la app | `nucleo/datosEnlace.ts` (NIST CCCBDB, CRC Handbook y artículos citados allí), no abierto de nuevo | bibliográfica declarada |
| Constante de Coulomb molar, 1389,35 kJ·Å/mol | núcleo de la app | calculada en `nucleo/datosEnlace.ts` con constantes exactas del SI | dato calculado |
| Radios iónicos de los pares de iones | los de la escena «tendencias-periodicas» | tablas de texto recordadas | **sin verificar** |
| Energías medias de enlace (C–H 413, O=O 498, C=O 799, O–H 463, H–H 436, Cl–Cl 242, H–Cl 431, N≡N 945, N–H 391, C–C 347, C=C 614, C≡C 839, C–Cl 339, Br–Br 193, H–Br 366, F–F 155, H–F 567, C–O 358, I–I 151, H–I 299, C≡O 1072 kJ/mol) | 21 enlaces | tablas de texto recordadas | **sin verificar** |
| Momentos dipolares y longitudes de 15 moléculas diatómicas (HF 1,82 D; HCl 1,08 D; NaCl 9,00 D…); factor 1 e·pm = 0,048032 D | — | tablas recordadas | **sin verificar** |
| Longitudes y ángulos de enlace que no proceden del núcleo (CH₄, SO₂, H₂S, CCl₄, PCl₃, NF₃…); longitudes típicas de enlaces sencillos y dobles | — | tablas recordadas | **sin verificar** |
| Puntos de ebullición y de fusión, entalpías de vaporización y pozos de Ne, Kr, Xe, N₂, O₂ y CH₄ | series de halógenos, gases nobles, alcanos y sustancias polares | tablas recordadas | **sin verificar** |
| Estructuras de Lewis, cargas formales, formas VSEPR, recuentos σ y π y ocupaciones de orbitales moleculares | listas de `practicas-n1/b04-comun.ts` | resultados de libro recordados; cruzados por prueba con la fórmula del octeto y el grado de insaturación | **sin verificar** |
| Parámetros de las prácticas (cantidades, cargas parciales, distancias, órdenes de enlace) | intervalos de cada práctica | propios | parámetro didáctico |
| OpenStax *Chemistry 2e*, secciones 7.1–7.6, 8.1–8.4, 10.1 y 10.5 | títulos citados | no abiertos | **sin verificar** |

## Nivel 1 · bloque 12 «Química orgánica introductoria» (2026-11-19)

| Dato | Valor o intervalo | Procedencia | Categoría |
|---|---|---|---|
| Nombres sistemáticos de los compuestos | reglas IUPAC de 2013 | Favre y Powell, *Nomenclature of Organic Chemistry* (RSC 2014), referencia registrada en `nucleo/organica.ts`; no abierta de nuevo | bibliográfica declarada |
| Fórmulas y estructuras (SMILES) de unos 190 compuestos: alcanos, alquenos, alquinos, aromáticos, alcoholes, éteres, aldehídos, cetonas, ácidos, ésteres, aminas y amidas | listas de `practicas-n1/b12-comun.ts` | recordadas; las pruebas comprueban que cada fórmula es la de su estructura y, donde el núcleo lo admite, que el nombre lleva a esa estructura | **sin verificar** (coherencia interna calculada) |
| Número de isómeros estructurales de los alcanos C₁–C₁₃ | 1, 1, 1, 2, 3, 5, 9, 18, 35, 75, 159, 355, 802 | recalculado en las pruebas contando esqueletos | dato calculado |
| Isómeros de posición de 17 cloroalcanos | 1 a 5 | recalculado en las pruebas con el identificador canónico del motor de estructuras | dato calculado |
| Fórmulas generales de las series homólogas y grado de insaturación | CₙH₂ₙ₊₂, CₙH₂ₙ, CₙH₂ₙ₋₂, CₙH₂ₙ₊₂O, CₙH₂ₙO, CₙH₂ₙO₂, CₙH₂ₙ₊₃N, CₙH₂ₙ₊₁NO | reglas de valencia; contrastadas en las pruebas con moléculas reales de cada familia | dato calculado |
| Puntos de ebullición de los alcanos lineales C₁–C₁₀ y de propano, éter dimetílico, etanal, etanol y ácido metanoico | −161,5 a 174,1 °C; −42,1 a 100,8 °C | tablas de texto recordadas (solo en dos figuras) | **sin verificar** |
| Fórmulas de monómeros y de unidades de condensación (cloroeteno, estireno, tetrafluoroeteno, acrilonitrilo, metacrilato de metilo, glucosa, glicina, alanina, serina, valina, ácido láctico, ácido glicólico, ácido 6-aminohexanoico) | fórmulas moleculares | recordadas; sin estructura contrastada | **sin verificar** |
| Electronegatividad del carbono, ángulos 109,5°, 120° y 180°, usos y toxicidad citados en las lecciones | texto | conocimiento general de libro de texto, recordado | **sin verificar** |
| Masas atómicas | tabla periódica de la app | sin fuente registrada | **sin verificar** |
| Parámetros de las prácticas (masas, moles, rendimientos, número de unidades) | intervalos de cada práctica | propios | parámetro didáctico |
| OpenStax *Chemistry 2e*, secciones 20.1–20.4 | títulos citados | no abiertos | **sin verificar** |

## Ejercicios de química

Los datos de los enunciados se generan con semillas reproducibles (`practica/familias/`) y son **didácticos**: ninguno es una medición publicada. Cada ejercicio muestra su fuente y una etiqueta (*dato didáctico*, *referencia consultada*, *medición publicada*); las pruebas contrastan los resultados con cálculos independientes (cuadráticas y regresiones calculadas aparte, masas atómicas estándar escritas a mano, listas de nombres, grupos, isómeros y descriptores R/S y E/Z). Las incertidumbres de los enunciados avanzados (balanza, pipeta, ΔH°, ΔS°) son didácticas, no las de una fuente. Detalle en `QUIMICA-NIVELES-Y-EJERCICIOS.md`.
