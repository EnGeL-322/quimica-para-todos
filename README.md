# Química para Todos

> Laboratorio de química de escritorio, 100 % sin conexión: mesa molecular en 3D, visor 2D y 3D, formulación, reacciones, experimentos, ejercicios y tabla periódica, con un cuaderno para guardar y analizar corridas.

Hecho por **ramiroengelbert**.

## Funciones

| Destino | Qué hace |
|---|---|
| **Química · Catálogo** | Tarjetas con miniatura por tema y rama (general, inorgánica, orgánica, analítica y fisicoquímica), con búsqueda; cada tarjeta abre la práctica y, si hay un fenómeno asociado, se puede simular. |
| **Química · Mesa molecular** | Construir arrastrando elementos o escribiendo una sustancia; la mesa identifica y mide lo construido. Herramientas de la misma mesa: Enlaces paso a paso, Formulación y nombres, y Reacciones (ajuste y estequiometría). Visor molecular 2D y 3D. |
| **Química · Simulación** | Ácidos y bases, mezcla ácido–base (pH y composición, exportable y guardable en el cuaderno), velocidad de reacción (se abre en pausa), equilibrio químico, energía de reacción **dilución con material de vidrio** (recipiente, pipeta y matraz aforado dibujados, con predicción previa) **colorimetría / curva de calibración** (blancos, patrones, interpolación con su incertidumbre; nunca extrapola) **solubilidad** (Q frente a Ksp, ion común; solo sales con fuente de Ksp abierta) **electroquímica** (celda galvánica ideal: ánodo y cátodo, E°, ΔG°, K y Nernst; solo pares con fuente de potencial abierta) e **isómeros** (dos isómeros en 2D y 3D con distancias, ángulos y diedros y la procedencia de cada geometría; todas calculadas), cada uno con su ficha de modelo (versión, dominio, supuestos, evidencia). Se pueden guardar en el cuaderno y reabrir y repetir; los procesos temporales vuelven en pausa. Ver `docs/ENTREGA-D-LABORATORIO.md`. |
| **Química · Casos reales** | 15 casos del hogar, la naturaleza, el espacio y la obra de Nikola Tesla, cada dato con su fuente. Los casos que se relacionan con un experimento de física lo nombran (está en Física para Todos). |
| **Química · Aprender y Prácticas por nivel** | Aprender: los 22 temas con detalle y paso a la práctica o la simulación. Prácticas por nivel: selector visual de 22 temas (miniaturas, filtros y búsqueda) y pantalla de resolución compacta, con corrección, pistas y resolución en cuatro niveles (preuniversitario, universitario, químico y científico); variantes reproducibles y «Simular este ejercicio». «Formular y nombrar» está en Inorgánica. |
| **Tabla periódica** | 118 elementos, peligros por forma química con pictogramas SGA, búsqueda de compuestos y masa molar. |
| **Laboratorio** | Cuaderno local (corridas de valoración, mediciones CSV y comparación) y Datos y estadística. |

El nivel (1–4) se guarda entre sesiones; Básico y Avanzado de la Mesa se migran al nuevo selector (ver `docs/QUIMICA-NIVELES-Y-EJERCICIOS.md`).

`Ctrl+K` busca cualquier destino o herramienta y lo abre directamente. **Acerca de** (al pie del menú) muestra la versión, la firma y la pestaña **Licencias y créditos**.

## Empezar

```bash
npm ci            # instala las dependencias exactas de package-lock.json
npm run dev       # abre la app con recarga en caliente
npm run typecheck # TypeScript estricto
npm test          # pruebas (Vitest)
npm run build     # compila a out/
npm run dist      # instalador de Windows en dist/
```

`npm run test:exhaustivo` abre todas las entradas del índice de sustancias (lento, va aparte de `npm test`).

Requisitos: Node 22.12 o posterior. Electron descarga su binario la primera vez que se usa y lo guarda en la caché local.

## Identidad del producto

| | |
|---|---|
| Nombre visible | Química para Todos |
| appId | `pe.ramiroengelbert.quimicaparatodos` |
| Ejecutable | `QuimicaParaTodos.exe` |
| Instalador | `dist/QuimicaParaTodos-Setup-<versión>.exe` (NSIS, por usuario, carpeta elegible) |
| Datos del usuario | `%APPDATA%\Química para Todos` |

Cada producto usa su propio appId, su carpeta de datos y su instalador, así que puede convivir con las otras apps de la serie y abrirse a la vez que ellas.

## Estructura

```
src/shared/     contratos puros (IPC, manifiestos, validadores, producto)
src/main/       proceso principal: ventana segura, registro de módulos (`core` (selectores de archivo, guardado e información de la app) y `laboratorio` (cuaderno en la carpeta de datos del usuario))
src/preload/    único puente: window.ciencia.invoke/on/pathForFile
src/renderer/   interfaz React (shell/ y modules/<id>/)
tests/          pruebas de la lógica pura
licencias/      avisos de terceros y créditos (se instalan junto a la app)
build/          iconos del ejecutable y del instalador
docs/           arquitectura, seguridad y datos
```

## Seguridad y funcionamiento sin conexión

`contextIsolation`, `sandbox` y CSP estricta; el renderer no puede salir a Internet (la sesión cancela todo salvo `file://`, `data:` y `blob:`); cada handler del proceso principal valida forma, tipo y rango de lo que recibe; los archivos solo se leen o escriben con permiso explícito del usuario. Detalle en `docs/SEGURIDAD.md`.

## Licencias y créditos

El código propio es © 2026 ramiroengelbert (`"license": "UNLICENSED"` en package.json: no se concede ninguna licencia de uso sobre él mientras su autor no elija una).
Los componentes de terceros conservan a sus autores, titulares y licencias:

- Software: `licencias/AVISOS-TERCEROS.txt` (se regenera con `npm run avisos`).
- Datos, modelos, imágenes y referencias: `licencias/CREDITOS-DATOS.txt`, `docs/DATOS.md` y `docs/TABLA-PERIODICA-PELIGROS.md`.

El instalador no está firmado digitalmente: no hay un certificado de firma de código disponible para el titular. Para firmarlo, configura en electron-builder un certificado válido emitido a nombre de ramiroengelbert (`CSC_LINK` y `CSC_KEY_PASSWORD`).
"# quimica-para-todos" 
