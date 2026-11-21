# CLAUDE.md — Química para Todos

Reglas permanentes del proyecto. Todo el código, los textos y la documentación van en **español**. Firma visible del trabajo propio: **ramiroengelbert**.

## Qué es

Laboratorio de química de escritorio, 100 % sin conexión: mesa molecular en 3D, visor 2D y 3D, formulación, reacciones, experimentos, ejercicios y tabla periódica, con un cuaderno para guardar y analizar corridas. Electron + React + TypeScript. Proyecto independiente: se instala, prueba, compila y empaqueta desde esta carpeta.

## Comandos

- `npm ci` · `npm run dev` · `npm run typecheck` · `npm test` (deben pasar antes de cada commit) · `npm run build` · `npm run dist` · `npm run avisos`.

## Convenciones

1. Lógica pura aparte de la vista: cálculo, parseo y reglas sin React, Three.js ni Electron, probados contra soluciones analíticas o fuentes.
2. Un módulo = una carpeta en `src/renderer/modules/<id>/` (y opcionalmente `src/main/modules/<id>/`); se descubren con `import.meta.glob`.
3. Todo dato del renderer es no confiable: cada handler de main valida con `@shared/validate`.
4. Archivos solo por permiso explícito (selector del sistema o arrastrar y soltar); nunca se sobrescribe un original.
5. Errores con código estable y mensaje para el usuario; sin trazas hacia el renderer.
6. Colores y espaciado desde variables CSS (`styles/app.css`).
7. Cada afirmación científica o médica es verificable: dato con fuente y nivel de verificación.
8. Nada de red desde el renderer: la app funciona 100 % sin conexión.
9. Identificadores propios con el prefijo `reng`: `rengMasa`, `rengCalcularEnergia`, `RengSimulador`, `useRengMedicamentos`, `RENG_GRAVEDAD`. Se conservan las claves que exigen Electron, React, el navegador, las librerías, los formatos de archivo y los datos guardados.
10. Sin comentarios explicativos ni código comentado; solo directivas técnicas y avisos de licencia.

## No hacer

- No usar `eval`, `new Function`, `innerHTML` con datos externos ni `shell: true`.
- No activar `nodeIntegration` ni desactivar `contextIsolation`/`sandbox`.
- No añadir logotipos o marcas de terceros ni recursos sin licencia compatible; registrar cualquier recurso nuevo en `licencias/`.
- No afirmar precisión que no se pueda comprobar.
