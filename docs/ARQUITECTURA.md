# Arquitectura

```
Renderer (React, sin permisos)
  shell/          menú, buscador Ctrl+K, portada, Acerca de
  modules/<id>/   index.ts (manifiesto, accesos, menú, carga diferida) + vista
        │  window.ciencia.invoke(módulo, acción, datos) / .on(módulo, evento)
        ▼  contextBridge (el preload solo valida la forma del canal)
Main (Node, con permisos)
  registry.ts     descubre modules/*/index.ts, valida el remitente y captura errores
  security/       concesiones de archivos elegidos por el usuario
  modules/<id>/   `core` y `laboratorio`
```

## Flujo de una petición

1. La interfaz llama a `call(módulo, acción, datos)` (`src/renderer/lib/api.ts`).
2. El preload comprueba el identificador del módulo y de la acción y envía por el canal `mod:<módulo>:<acción>`.
3. El registro verifica que el marco emisor sea la propia página, ejecuta el handler y devuelve `{ ok, data }` o `{ ok: false, error: { code, message } }`.
4. El handler valida el contenido (`@shared/validate`) y exige permiso sobre cualquier ruta.

## Producto

`src/shared/producto.ts` reúne el nombre visible, el appId y la firma. El proceso principal fija con él el nombre de la app, la carpeta de datos (`%APPDATA%\Química para Todos`) y el AppUserModelID de Windows; la interfaz lo usa en la marca, la portada y «Acerca de». `src/renderer/inicio.ts` define las tarjetas de la portada.

## Módulos y navegación

- Autodescubrimiento con `import.meta.glob('./modules/*/index.ts')` en main y en renderer.
- Rutas `#/<módulo>` o `#/<módulo>/<subruta>`; lo desconocido o mal formado vuelve a Inicio.
- Cada vista se carga al abrirla; un fallo de módulo queda contenido sin tumbar la app.

## Química: motor de práctica

`modules/simulador-quimica/practica/` es TypeScript puro (sin React ni Electron): `bancos.ts` (listas escritas a mano), `familias/` (generadores con semilla), `solucionadores.ts` y `modelosSimulacion.ts` (modelos de las diez simulaciones, con su ficha versionada; los núcleos puros nuevos están en `nucleo/dilucion.ts`, `nucleo/colorimetria.ts`, `nucleo/solubilidad.ts`, `nucleo/electroquimica.ts` y `nucleo/isomeros.ts`, y los datos con su registro de fuentes en `datos/solubilidad.ts`, `datos/electroquimica.ts` y `datos/isomeros.ts`; el visor de la escena de isómeros es `vista/VisorIsomero.tsx`), `reglasEscena.ts` (unidades, balances, región de la valoración, comparación Q/K, diagnósticos de dominio, sensibilidad e incertidumbre propagada), `corridaEscena.ts` (corridas reproducibles para el Cuaderno) y `transferenciaGuardada.ts` (la simulación copiada de un ejercicio sobrevive a ir al Cuaderno y volver), `numeros.ts` y `correccion.ts` (entradas y veredictos), `niveles.ts` (cuatro niveles y migración) y `estado.ts` (intentos recuperables) y `fichasTema.ts` (pregunta, palabras clave y miniatura de cada tema). Las miniaturas son SVG locales en `miniaturas/`, generados por `scripts/generar-miniaturas.mjs`. Detalle en `QUIMICA-NIVELES-Y-EJERCICIOS.md`.

`practica/identidad` vive en `banco.ts` (`rengEjercicioLegado`, `rengReferenciaNueva`, `rengHuellaEjercicio`), `practica/persistencia.ts` (formato v2 validado), `practica/arranque.ts` (leer y guardar) y `practica/estado.ts` (borrador, logro y repeticiones); las familias de razonamiento están en `practica/familias/razonamiento*.ts`.

`modules/simulador-quimica/aprender/` también es TypeScript puro: `tipos.ts`, `lecciones.ts` (índice, ruta de iniciación y prerrequisitos), `lecciones/<rama>.ts` (contenido) y `progreso.ts` (progreso guardado y validado). La vista es `modos/Aprender.tsx`.

## Pruebas en Electron con perfil desechable

`RENG_PERFIL_PRUEBA=<ruta absoluta>` redirige `userData` (localStorage, Cuaderno y preferencias) a esa carpeta. Solo se admite con la app sin empaquetar (`electron .`), nunca en el instalador, y el proceso principal escribe `RENG_USERDATA <ruta>` en la salida estándar al arrancar para comprobar el destino antes de guardar nada. Cambiar `APPDATA` no aísla los datos en Windows.

## Añadir un módulo

```bash
npm run new:module -- mi-modulo "Mi módulo" --main
```
