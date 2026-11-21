# Entrega A · Navegación e interfaz

Encargo «Química para Todos · Aprender, Prácticas y Laboratorio virtual», fecha 2026-11-15. Sin commit; el trabajo local previo se conserva.

## Qué se implementó

- Orden Catálogo → Aprender → Prácticas por nivel → Simulación → Casos reales → Mesa molecular en el menú lateral, la fila de pestañas y el buscador Ctrl+K (`navegacion.ts`, `menu.ts`, `accesos.ts`, `View.tsx`, `inicio.ts`).
- «Ejercicios de química» pasa a «Prácticas por nivel» (id interno `practicas`). La ruta `ejercicios` sigue abriéndola y se resuelve a la misma entrada del menú. Nuevos enlaces profundos `practicas-<tema>`, `ejercicios-<tema>` y `aprender-<tema>`.
- Destino **Aprender** (`modos/Aprender.tsx`): lista con el explorador común y detalle por tema con una acción principal («Practicar este tema») y «Simular» cuando existe.
- Explorador común con **filtro por nivel** (Catálogo y Aprender). Prácticas no lo repite porque ya tiene «Nivel preferido». La fila global de nivel solo queda en Simulación y Casos reales.
- «Formular y nombrar» se conserva desde la Mesa (Formulación). El aviso de la Mesa vacía ahora agrupa la acción secundaria con el mensaje en lugar de dejarla pegada al borde inferior.
- Corrección encontrada durante la verificación: en Velocidad de reacción el primer fotograma de la animación podía llegar antes que `performance.now()`, dando un paso de tiempo negativo y un `RangeError` («A0, k y t deben ser ≥ 0») que dejaba el módulo en blanco. Ahora el paso se acota a ≥ 0 (también en `useSecuencia`). Se reprodujo en 3 de 8 combinaciones y desaparece en las 8.
- Soporte de pruebas: `RENG_PERFIL_PRUEBA` en `src/main/index.ts` (solo sin empaquetar y con ruta absoluta; imprime `RENG_USERDATA <ruta>`).

## Decisiones

- El detalle de Aprender es deliberadamente mínimo: no inventa contenido de lección. El ejemplo resuelto, la comprobación conceptual y la fuente consultada son de la Entrega B.
- Los enlaces con tema no se conservan en la dirección: se consumen una vez y la ruta queda en `practicas` o `aprender`, para que «atrás» y «actualizar» no reabran un tema ya cerrado.
- No se tocaron los datos de ejercicios, la persistencia (`ciencia.nivel.simulador-quimica`, `quimica.nivel`, intentos) ni el Cuaderno.

## Verificación

- `npm run typecheck`: sin errores.
- `npm test`: 51 archivos, 1327 pruebas (1314 de partida + nuevas en `tests/quimica/entrega-a-navegacion.test.ts` y actualizaciones de las pruebas de navegación).
- `npm run test:exhaustivo`: 1/1.
- `npm run build`: correcto.
- Electron compilado (`electron .`) con perfil desechable: el proceso principal imprimió `RENG_USERDATA` apuntando a la carpeta temporal antes de cualquier guardado; el Cuaderno real no se tocó. Guiones CDP en el directorio temporal de la sesión.
  - 152 vistas (2 tamaños × Día/Noche × menú abierto/plegado × Mesa [Construir, Enlaces, 5 pasos de «¿Cómo se formula?», Estructura 3D, Reacciones], práctica abierta con paneles, práctica incorrecta y con pista, cinco simulaciones calculadas con «Modelo y supuestos» abierto, Casos y Catálogo): 0 desbordes horizontales, 0 controles fuera de la ventana, 0 fallos de contraste (sonda propia ≥ 4,5:1 texto normal y 3:1 grande; se descarta el falso positivo conocido del botón con degradado de la Mesa vacía), consola sin errores.
  - Ventanas nativas: 1360 × 860 y 1025 × 680 exteriores (interior 1011 × 643 con la pantalla al 125 %).
  - Teclado y foco (23 comprobaciones): Tab llega a la tarjeta con foco visible; Intro y Espacio abren el detalle; el foco pasa al título; Escape vuelve al selector con el foco en la tarjeta de origen; «Practicar este tema» abre la práctica; «← Volver a temas» devuelve el foco a la tarjeta; rutas antiguas y enlaces profundos abren el tema correcto; tema desconocido cae en el selector; Mesa → Formulación → «practica formular y nombrar» abre «Formular y nombrar»; el filtro por nivel reduce a 8 de 22 con «Científico» y expone `aria-pressed`; Ctrl+K encuentra «ejercicios» y «aprender» y Intro abre el destino.
- Rendimiento: no se modificaron rutas de carga ni cálculos pesados (el filtro por nivel reutiliza `rengNivelesDeTema`, ya en caché por las tarjetas), por lo que no se repitió la medición antes/después.
- Capturas en `docs/capturas-entrega-a/` (lista y detalle de Aprender, Catálogo con filtro, Prácticas, Mesa, pasos de formulación, visor 3D, práctica incorrecta y Simulación; ambos temas y ambos tamaños).

## Pendiente o con reservas

- El visor 3D de «Estructura 3D» (Formulación) a 1025 × 680 queda en un área desplazable de ~250 px: se ve y se puede ampliar, pero conviene darle más altura cuando se revise la Mesa (Entrega E).
- El detalle de Aprender de esta entrega era provisional: lo sustituyó la Entrega B (`docs/ENTREGA-B-APRENDER.md`).
- La sonda de contraste es propia y aproximada (no calcula degradados ni imágenes); no sustituye una revisión con herramienta de accesibilidad.
- Lectores de pantalla no probados.

## Punto exacto para continuar

Entrega B hecha (ver su nota). Siguiente: Entrega C, desde `practica/familias/*.ts` y `practica/bancos.ts`.
