# Entrega B · Aprender química

Encargo «Química para Todos · Aprender, Prácticas y Laboratorio virtual», fecha 2026-11-15. Sin commit. Continúa la Entrega A (`docs/ENTREGA-A-NAVEGACION.md`).

## Qué se implementó

- **22 lecciones**, una por tema del banco, agrupadas por rama (General, Inorgánica, Orgánica, Analítica, Fisicoquímica) en `aprender/lecciones/<rama>.ts`. Cada una tiene objetivo, explicación (2–3 párrafos), ejemplo resuelto con 3–5 pasos, comprobación conceptual, descripción del razonamiento por nivel (exactamente los niveles que tienen práctica), prerrequisitos, una sugerencia para simular u observar y fuentes.
- **Secuencia de seis pasos** (Entender el concepto → Ver un ejemplo → Resolverlo paso a paso → Comprobar qué entendí → Practicar → Simular u observar), con indicador de paso actual (`aria-current="step"`) y botones Anterior / Siguiente que nombran el destino.
- **Cada paso de la resolución** indica el dato que se usa, por qué se elige esa ecuación o regla y cómo interpretar el resultado; la lección cierra con el resultado, un error típico y una forma de revisar. La resolución se revela paso a paso (o «Mostrar todos»).
- **Cinco recorridos completos**, uno por rama: estequiometría y reactivo limitante (General), formular y nombrar con carga, composición y estructura (Inorgánica), isomería constitucional con tres estructuras 2D (Orgánica), dilución y preparación de un patrón (Analítica) y cinética de orden 1 (Fisicoquímica). El resto de lecciones tiene el mismo esqueleto con un ejemplo más corto.
- **Ruta de iniciación** de 10 lecciones (mol → concentración → ajuste → estequiometría → formular y nombrar → grupos → estructuras → isomería → dilución → cinética) en orden compatible con los prerrequisitos, con contador, barra de progreso y botón «Empezar / Continuar la ruta». Los prerrequisitos pendientes se muestran dentro de cada lección con un botón para abrirlos.
- **Progreso guardado** (`ciencia.aprender.simulador-quimica`, versión 1, validado al leer): paso alcanzado, resultado de la comprobación e intentos. Una comprobación acertada no se pierde por un fallo posterior. Estado visible: Sin empezar / En curso / Comprobada (en tarjetas y en la cabecera). Entrar a Aprender muestra la lista; reabrir una lección continúa en el paso guardado. Enlace profundo: `#/simulador-quimica/aprender-<tema>`.
- **Estructuras 2D** (openchemlib) en ácido láctico, 3-metilbutan-1-ol, ácido propanoico, los tres isómeros de C₃H₈O, el estereocentro del ácido láctico y la adición de HBr; cada una con una línea «Numeración» en texto (el significado no depende del color).
- **Puentes**: «Practicar este tema» abre la práctica; «Simular» abre la escena asociada; «Abrir en Mesa molecular» carga el SMILES (con estereoquímica) y, si la Mesa tiene algo, pregunta Añadir / Reemplazar / Cancelar.

## Decisiones

- Todo el texto de las lecciones es propio. OpenStax Chemistry 2e es CC BY-NC-SA 4.0: solo se citan títulos de sección. Se consultaron el 2026-11-15 los índices de los capítulos 1–5, 7, 12–17 y 20; **no se leyó el contenido de las secciones**, por eso cada fuente declara su alcance («se consultó el índice… la lección y sus datos son propios»).
- Las masas atómicas usadas se comprobaron contra CIAAW 2024 (H, C, N, O, Mg, S y Cl son intervalos: se usan los valores abreviados dentro de ellos; Na, Al, K, Ca, Fe son valores convencionales).
- Los descriptores R/S citan las entradas C01082 y R05423 del IUPAC Gold Book, leídas en los resultados del buscador de su web (una lectura directa devolvió 403); no se leyeron las reglas de secuencia completas, y la lección aplica solo la regla del número atómico y el empate por sustituyentes.
- Datos como Ka = 4,0 × 10⁻⁵, Kc = 50, ΔH = −40 kJ, ΔS = −100 J/K y las absorbancias son **didácticos**: las lecciones lo dicen y el panel «Fuentes y supuestos de la lección» lo repite.
- La parte de «diagramas de partículas» reutiliza las miniaturas esquemáticas de cada tema (con aviso de que son ilustrativas); no se dibujaron diagramas nuevos. Las estructuras 3D no se usan en esta entrega.

## Verificación

- `npm run typecheck`: sin errores. `npm test`: 52 archivos, 1360 pruebas (33 nuevas en `tests/quimica/aprender-lecciones.test.ts`). `npm run test:exhaustivo`: 1/1. `npm run build`: correcto.
- Las pruebas comprueban: 22 lecciones sin repetir; todos los campos obligatorios; `porNivel` = niveles del banco; cinco recorridos, uno por rama; prerrequisitos existentes y sin ciclos; la ruta respeta prerrequisitos; **el ejemplo no coincide con ningún enunciado ni título de las variantes del banco** (40 semillas × niveles × familias); **cada resultado numérico se recalcula por otro camino** (sumas en lugar de desviaciones para la recta, bisección para Ka y Kc, semividas frente a exponencial, masas máximas de producto para el limitante, balance de átomos y carga); los SMILES se leen, los tres de C₃H₈O son distintos y de fórmula C₃H₈O, los nombres coinciden con el analizador de nombres del proyecto, el ácido láctico dado es (S) y coincide con el SMILES de L-láctico escrito en otro orden de vecinos; **toda sección de OpenStax citada existe en los índices consultados, con su título**; progreso: validación de formato y de estados, y continuidad de la ruta.
- Electron compilado con perfil desechable (el proceso principal imprimió `RENG_USERDATA` con la carpeta temporal y se comprobó antes de guardar; el Cuaderno real no se tocó):
  - **Flujo (27 comprobaciones)**: «Empezar la ruta» abre Mol y masa molar con el foco en el título; los seis pasos; resolución progresiva con 4 pasos × (dato, por qué, interpretación); resultado, error típico y revisión; comprobación incorrecta no marca «Comprobada» y la correcta sí; «Practicar este tema» abre el ejercicio; la ruta cuenta 1 de 10 y continúa en Concentración; **tras cerrar y reabrir Electron el progreso se conserva**; enlace `aprender-isomeria`; aviso y botón de prerrequisito; 3 estructuras 2D con numeración; Abrir en Mesa con Mesa vacía (directo) y ocupada (confirmación, Cancelar la deja igual); «Simular» abre Velocidad de reacción en pausa en t = 0.
  - **Barrido visual: 620 vistas** (lista, 22 lecciones × 6 pasos con la resolución completa y la comprobación contestada, y el panel de fuentes abierto, en 1360 × 860 Día, 1024 × 680 Noche con menú plegado, 1024 × 680 Día y 1360 × 860 Noche): 0 desbordes, 0 controles fuera de la ventana, 0 fallos de contraste con la sonda propia, consola sin errores.
  - Capturas en `docs/capturas-entrega-b/`.
- Rendimiento: no se tocaron rutas de carga ni cálculos pesados; las lecciones son datos estáticos importados con la vista (el módulo ya se carga de forma diferida). No se repitió la medición antes/después.

## Pendiente o con reservas

- Las lecciones no están revisadas por un docente de química: las cifras se comprobaron por código y las afirmaciones conceptuales son de libro, no contrastadas con una obra concreta (salvo la ubicación por índice).
- Faltan diagramas de partículas propios por tema, estructuras 3D donde ayudan (estereoquímica) y una lección explícita «con el Cuaderno» (solo se menciona en Calibración como siguiente paso; la integración real es de la Entrega D).
- El nivel Científico solo tiene texto de razonamiento en los temas que lo tienen en el banco (mol, concentración, pH, valoración, equilibrio, termo, calibración y ajuste cinético): sigue siendo breve y sin ejemplo propio de incertidumbre salvo en Calibración.
- No se probó con lector de pantalla. La sonda de contraste es aproximada.
- La persistencia se comprobó con un cierre ordenado de la ventana; con un cierre forzado del proceso Chromium puede perder los últimos cambios de `localStorage`, como el resto de preferencias de la app.

## Punto exacto para continuar

**Entrega C hecha** (ver `docs/ENTREGA-C-PRACTICAS.md`; el siguiente paso es la Entrega D). Texto original de este punto:

Entrega C. Archivos: `practica/familias/*.ts` (generadores) y `practica/bancos.ts`. Añadir dos tipos de razonamiento nuevos por rama con tres variantes comprobadas cada uno (interpretar una gráfica, detectar una unidad errónea, elegir un modelo, decidir qué dato falta, justificar una aproximación), conservando identificadores y persistencia existentes; luego el progreso por variante (intento, respuesta, unidad, pistas, estado, repeticiones; «Revisada» / «Resuelta»), «Continuar práctica» y el nivel temporal. Antes de empezar leer `practica/estado.ts` (intentos abiertos actuales) y `tests/quimica/practica-estado.test.ts`.
