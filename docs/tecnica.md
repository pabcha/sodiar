# Documentación técnica

## Propósito
Aplicación web estática que lista estaciones de radio y permite reproducirlas vía streaming desde un endpoint de Google Apps Script.

## Arquitectura y flujo de datos
- Cliente 100% estático: HTML en [index.html](../index.html), CSS en [styles/styles.css](../styles/styles.css) y [styles/helpers.css](../styles/helpers.css), lógica en [main.js](../main.js).
- Origen de datos: constante `URL_RESOURCES` definida en [index.html](../index.html) (se construye con `SPREADSHEET_ID`) apunta a un endpoint de Google Apps Script que retorna JSON.
- Carga inicial: `init()` en [main.js](../main.js) pinta un esqueleto, hace `fetch(URL_RESOURCES)` y guarda el arreglo en `stations`; luego renderiza la lista.
- Renderizado: `renderList()` construye cada tarjeta con `station.id` y `station.name`; el click abre el reproductor con `openPlayer()`.
- Reproducción: `openPlayer()` fija la estación actual, carga la URL si cambia y activa transición de pantalla; `togglePlayback()` usa `audioPlayer.load()` / `audioPlayer.play()` y actualiza la UI con `updateUI()`.
- Estados y errores: `showToast()` muestra mensajes (error/éxito) en contenedor fijo; errores de red y de audio disparan toasts y limpian UI mínima.

## Formato de datos esperado
El endpoint debe responder JSON con un arreglo de estaciones. Cada estación requiere al menos:

```json
[
  {
    "id": 1,
    "name": "Radio Ejemplo",
    "url": "https://dominio.com/stream.mp3"
  }
]
```

Consideraciones:
- `id`: numérico o string único; se usa para asociar clicks con la estación correcta.
- `name`: texto mostrado en la lista y en el reproductor.
- `url`: fuente de audio reproducible por el elemento `<audio>` (ideal HTTPS y CORS habilitado).

## Estructura de carpetas
- `index.html`: maquetado principal, define pantallas y constantes de endpoint.
- `main.js`: lógica de datos, render de lista, reproducción de audio y toasts.
- `styles/`: hoja base y utilidades tipo helper (espaciados, tipografías, colores, helpers flex/posiciones y colores de toast).
- `docs/`: este directorio de documentación.

## Dependencias y ejecución
- Sin build ni bundler; basta servir los archivos estáticos (p.ej. `npx serve` o hosting estático).
- Fuente remota: Google Fonts Inter cargada en [index.html](../index.html).
- Requiere que `SPREADSHEET_ID` apunte a un Apps Script desplegado que permita CORS para el dominio donde se sirva la app.

## Estados y manejo de errores
- **Sin datos / fallo de fetch:** limpia la lista y muestra toast de error.
- **Fallo de audio (play):** `play()` captura la promesa rechazada, desactiva estado de reproducción y muestra toast.
- **Cambio de estación:** si la URL cambia, se reinicia `isPlaying` antes de cargar la nueva fuente.

## Extensiones recomendadas
- Servidor local estático para pruebas manuales.
- Inspector de red para validar respuesta JSON y CORS.
