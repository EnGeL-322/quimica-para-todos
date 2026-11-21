# Entrega 1 · Temario y catálogo plegable

Fecha: 2026-11-16. Sin commits, sin dependencias nuevas, sin red, sin fuentes nuevas abiertas (D8). Continúa `docs/AUDITORIA-QUIMICA-FASE-0.md` (decisiones D1–D11 aprobadas). No se tocaron: Cuaderno, huella y persistencia de Prácticas, `rengPoliticaMesa`, niveles actuales, progreso de Aprender, licencias ni el catálogo de peligros (una prueba fija sus claves, versiones y valores).

## Qué se añadió

**Datos (`src/renderer/modules/simulador-quimica/temario/`)**
- `datos.generado.ts`: temario v1 (8 niveles, 64 bloques, 1 504 subtemas, ids `n{nivel}-b{bloque}-s{posición}`). Lo genera `npm run temario` (`scripts/generar-temario.mjs` + `scripts/temario-lib.mjs`) desde `docs/TEMARIO-MAESTRO.md`; el script rechaza numeración rota. El bloque 64 es de tipo `problemas`.
- `correspondencias.ts`: mapa de la Fase 0 como datos tipados (163 confirmados, 150 «por revisar»). Cada recurso es un tipo + id (tema, práctica/familia, escena, herramienta de la Mesa, tabla, sustancia, caso, cristal, glosario, laboratorio, peligros).
- `recursos.ts`: comprueba que cada recurso **existe de verdad** contra los módulos reales y da etiqueta, capas y acciones de navegación.
- `estado.ts`: estados de cobertura calculados (D4). `verificacion.ts`: equivalencia de vocabularios (D9). `catalogo.ts`: construcción del catálogo derivado, búsqueda y denominador. `plegado.ts`: plegado en `sessionStorage` (clave nueva `ciencia.temario.simulador-quimica`, v1, validada al leer).
- `temario.css` (solo variables CSS) y `tipos.ts`.

**Interfaz**
- Nuevo destino **Temario** entre Catálogo y Aprender (`navegacion.ts`, `menu.ts`, `accesos.ts`, `View.tsx`, vista `modos/Temario.tsx`). Ruta `#/simulador-quimica/temario`. No se reemplazó nada: el Catálogo, Aprender y Prácticas siguen igual.
- Nivel → bloque → subtema, con estado, recursos confirmados con botones («Aprender», «Practicar», «Simular», «Abrir en la Mesa»…), recursos «por revisar» en cursiva y rotulados «no cuenta como cobertura», y «Datos: …» (verificación) aparte del estado. Buscador sin tildes (por título, bloque o id). Selector «Nivel del temario» (chips Nivel 1–8) **separado** de los 4 niveles de práctica (D1): no lee ni escribe `ciencia.nivel.simulador-quimica`.
- Niveles 4–8 plegados por defecto con aviso «Nivel sin contenido»; el 8 y el bloque 64 como «Mapa informativo» sin acciones.
- Reutiliza `RengTarjetaTema` (miniatura, niveles de práctica) para los temas de cada bloque.
- **Piloto técnico, bloque 5**: 20 subtemas, 19 confirmados enlazados a Formulación, «Formular y nombrar», «Números de oxidación» y la tabla; «Sales básicas» sin recurso.

## Cobertura (valores reales)

| | Subtemas |
|---|---|
| Total / sin el bloque 64 (denominador) | 1 504 / 1 468 |
| Confirmados (estado **Parcial**) | 163 |
| Por revisar (NO cuentan → Sin contenido) | 150 |
| Sin recurso (denominador) | 1 155 |
| Completado / Verificado / En desarrollo | **0 / 0 / 0** |

Por nivel (confirmados / por revisar / sin recurso): N1 110/70/78 · N2 23/31/129 · N3 30/42/243 · N4 0/5/222 · N5 0/0/196 · N6 0/0/166 · N7 0/2/121 · N8 0/0/36. Bloques: 8 con ≥ 40 % confirmado (3, 4, 5, 7, 10, 11, 12, 24) y 28 de curso sin ningún recurso.

**Diferencia con la Fase 0 (declarada):** la Fase 0 contaba 151 «por revisar». Ahora son **150**: n3-b34-s2 «ATP» deja de tener recurso. La Fase 0 lo apoyaba en un «caso real de ATP», pero la búsqueda en el código solo halló ATP como cita de PubChem en `fuentes.ts`, no un caso ni una sustancia. Es la **única** diferencia, por bloque, con el mapa de la Fase 0 (comprobado comparando las posiciones de los 64 bloques). Una prueba lo fija.

## Estados (D4) y criterios

`sin-contenido` · `en-desarrollo` (único manual: `RENG_REGISTRO_COBERTURA.enDesarrollo`, hoy vacío; solo aplica si no hay recursos confirmados) · `parcial` · `completado` · `verificado`. El estado de bloque y de nivel es el agregado de sus subtemas (completado/verificado solo si **todos** lo son).

- **Completado** exige todo esto: (1) un tema confirmado con lección y práctica con corrección; (2) una **atestación registrada** (tema, familia del banco, revisor no vacío, fecha ISO) de que la lección y la práctica tratan **ese subtema**, porque un tema entero no basta para decir que cada subtema está cubierto; (3) si el tema tiene escena, esa simulación confirmada.
- **Verificado** exige Completado y además: verificación registrada (datos, revisor, fecha) cuyos datos sean `fuente-verificada` o `dato-calculado` **comprobables**, y que **todos** los recursos confirmados tengan nivel comprobable.
- Hoy no existe ninguna atestación ni verificación registrada, y ningún recurso real es comprobable (los temas y prácticas son didácticos; la tabla periódica no tiene fuente de masas), de modo que Completado y Verificado salen 0 con criterios estrictos.

## Verificación de datos (D9, `temario/verificacion.ts`)

Un solo módulo, sin cambiar ningún esquema guardado: los seis niveles del proyecto (fuente verificada, bibliográfica declarada, dato calculado, parámetro didáctico, ejemplo idealizado, sin verificar) y las equivalencias desde los tres vocabularios existentes. Ejercicio: `didactico`→parámetro didáctico, `referencia`→bibliográfica declarada, `publicado`→fuente verificada. Cuaderno: `modelo-calculado`→dato calculado (no comprobable), `calculo-verificado`→dato calculado (comprobable), `comparado-con-mediciones`→fuente verificada. `DATOS.md`: «Fuente consultada» solo es verificada si se **abrió** la página. Elección mía: `calculo-verificado` sigue siendo «dato calculado» (no «fuente verificada») porque el proyecto lo define como cálculo comprobado por otra vía, no como fuente.

## Pruebas (resultados literales)

| Comando | Resultado |
|---|---|
| `npm run typecheck` | sin errores |
| `npm test` | `Test Files 65 passed (65)` · `Tests 1860 passed (1860)` (antes 1817: +43 nuevas) |
| `npm run test:exhaustivo` | `Test Files 1 passed (1)` · `Tests 1 passed (1)` |
| `npm run build` | `✓ built in 440ms` |
| `npm run temario` | regenera el mismo archivo (una prueba lo exige) |

`tests/quimica/entrega-1-temario.test.ts` (43): recuentos fijos (8/64/1 504/1 468, por nivel); ids; títulos contra `TEMARIO-MAESTRO.md` leído por **otro analizador** independiente del script; archivo generado al día; **sabotajes** (cambiar un título, saltar un id, repetir un id, quitar un subtema, mover un bloque de nivel, cambiar un título de nivel, un título distinto en el texto fuente, numeración rota en el generador); existencia de cada recurso (tema, escena, sustancia, práctica, caso, cristal, glosario…) con sabotajes (recurso inexistente, posición fuera de rango o repetida, grupo sin recursos, correspondencia en el bloque 64 o en un bloque inexistente); recuentos de la cobertura; «por revisar» = Sin contenido; bloque 64 fuera del denominador; reglas de Completado y Verificado con casos a favor y en contra (atestación ausente, fecha mala, revisor vacío, otra familia, escena faltante, datos no comprobables, dato didáctico); **sabotaje de criterios**: relajar `exigirAtestacion` hace aparecer Completado/Verificado, relajar todos hace que los 163 salgan Verificados y la prueba lo detecta, y los criterios por defecto están congelados; plegado (valores por defecto, ida y vuelta, JSON roto, versión desconocida, ids inventados, tipos erróneos, tamaño, almacén que lanza); búsqueda; equivalencias de verificación; claves y versiones guardadas sin cambios; piloto del bloque 5 y que cada acción apunta a un destino que el navegador del módulo resuelve.

Se actualizaron cuatro pruebas existentes que fijaban «seis destinos» (`catalogo-navegacion`, `menu-lateral`, `entrega-a-navegacion`, `practica-estado`): ahora siete, con Temario en segundo lugar. No se relajó ninguna otra expectativa.

## Verificación en Electron (`scripts/verificacion-d/e1.mjs`)

Arnés existente (`cdp.mjs`) con perfil temporal: el proceso imprimió `RENG_USERDATA` y el guion comprobó que coincide con la carpeta temporal antes de operar. **El perfil real (`%APPDATA%\Química para Todos`, 980 archivos) no cambió** (listado con tamaños y mtimes idéntico antes y después). Cambio mínimo en el arnés: se exportó `BASE_SONDA` de `sonda.mjs`; **no se tocó `src/main`**. Se ejecutó con y sin WebGL (`E1_SIN_WEBGL=1`, que desactiva GPU y WebGL) y ambos terminaron con `TODO OK`.

- Flujo: 8 niveles; 1–3 abiertos y 4–8 plegados; solo se montan los 34 bloques de los niveles abiertos; resumen 163 / 0 completados / 0 verificados / 150 por revisar; abrir y recargar conserva el plegado (en `sessionStorage`, nada en `localStorage`); bloque 35 con 20 subtemas «Sin contenido»; bloque 5 con 20 filas y 19 confirmadas, 2 tarjetas de tema; «Aprender» abre Aprender, «Practicar» abre «Formular y nombrar» y «Abrir en la Mesa» abre Formulación; búsqueda «STOCK» y búsqueda sin resultados; chip Nivel 8 y bloque 64 con 36 problemas y ningún botón de acción; elegir un nivel del temario no cambia el nivel de práctica guardado.
- Teclado y foco: Intro abre, Espacio pliega, el foco permanece en el botón, tiene contorno visible (`:focus-visible`, 1,6 px) y Tab avanza.
- Matriz: plegado, bloque abierto, bloque 5 y bloque 64 × 1280×720 y 1024×640 × Día y Noche = 16 vistas: 0 textos bajo contraste (sonda propia, 4,5:1 texto normal y 3:1 grande), 0 desbordes horizontales (documento y panel), 0 controles fuera de la ventana. Mesa molecular: sin aviso 3D con WebGL y con el aviso sin WebGL; consola vacía.
- Capturas revisadas en pantalla en `docs/capturas-entrega-1/`: nivel plegado (`e1-plegado-…`), bloque abierto (`e1-bloque-abierto-nivel4.png`, `e1-bloque-abierto…`), bloque 5 (`e1-bloque5-…`) y bloque 64. Se vieron sin solapes ni recortes.

## Límites y lo que NO verifiqué

- **Lector de pantalla**: no se probó (se cuidó `aria-expanded`, `aria-controls`, `role=note`, `aria-label` en recursos, símbolo y texto del estado, no solo color).
- **Lectura humana de los títulos**: la transcripción del temario sigue siendo manual y no la he comparado con el original; las pruebas solo garantizan que los datos coinciden con `TEMARIO-MAESTRO.md`. Los títulos de subtema conservan su punto final del original.
- **Ventana 1024×640**: la ventana del arnés no baja de 1026×680 exteriores (interior 1012×643), así que ese tamaño es «lo más cercano posible» y no 640 de alto exactos; 1280×720 sí es exacto (interior 1266×683).
- El mapa de correspondencias sigue siendo mi lectura de código y documentos (no revisión docente); «confirmado» no significa «completado» ni «verificado».
- Las vistas con tema Día/Noche se fijaron con `dataset.theme` (como en entregas anteriores), no con el interruptor de la aplicación; en las capturas el interruptor puede mostrar el otro modo.
- No se midió el rendimiento. El fragmento principal pasó de 3,23 MB a 3,42 MB (≈ +0,19 MB: datos del temario + vista), mayormente texto.

## Riesgos y decisiones para ti

1. **Un tema no basta para «Completado»** (atestación por subtema). Si prefieres que un tema completo cubra automáticamente sus subtemas confirmados, hay que relajar `exigirAtestacion`; la prueba de sabotaje te lo mostrará (los 163 pasarían a «Completado»), y yo no lo recomiendo.
2. **Existe un registro vacío de atestaciones/verificaciones** (`RENG_REGISTRO_COBERTURA`) pensado para escribirse en una entrega con revisión humana; hoy es código, no un archivo editable por la persona usuaria.
3. **150 «por revisar»**: se ven en cursiva pero no cuentan. Revisarlos es tuyo; cada confirmación nueva se hace en `correspondencias.ts`.
4. El plegado vive en `sessionStorage`, como pediste: se pierde al cerrar la aplicación.
5. Las pruebas fijan conjuntos exactos (163/150, 28 bloques sin contenido, ATP sin recurso): ampliar el mapa obliga a actualizarlas a propósito.

## Siguiente entrega propuesta

Piloto de contenido del bloque 8 «Gases» (D7): primero decidir qué subtemas llevan lección, práctica y escena con fuente ya conocida (R de CODATA, leyes de gases como matemáticas cerradas) y cuáles se dejan para después (desviaciones del gas ideal exigen parámetros de van der Waals con fuente). Antes, tus decisiones sobre los 150 «por revisar» y sobre el mecanismo de atestación.
