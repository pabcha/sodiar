# Documentación técnica

## Propósito
Aplicación móvil con tecnología web (Cordova) que lista estaciones de radio y permite reproducirlas vía streaming desde un endpoint de Google Apps Script.

## Arquitectura y flujo de datos
- Cliente 100% estático: HTML en [index.html](../index.html), CSS en [styles/styles.css](../styles/styles.css) y [styles/helpers.css](../styles/helpers.css), lógica en [main.js](../main.js).
- Origen de datos: constante `URL_RESOURCES` definida en [index.html](../index.html) (construida con `SPREADSHEET_ID`, que corresponde al **deployment ID** del Apps Script desplegado, no al ID de la hoja de cálculo) apunta a un endpoint de Google Apps Script que retorna JSON.
- Carga inicial: `init()` en [main.js](../main.js) pinta un esqueleto, hace `fetch(URL_RESOURCES)` y guarda el arreglo en `stations`; luego renderiza la lista.
- Renderizado: `renderList()` construye cada ítem como `<button class="radio-item">` con `aria-label="Sintonizar {nombre}"` y `onclick` que invoca `openPlayer()`; al ser un `<button>` nativo, es focusable por Tab y activable con Enter/Space sin código adicional.
- Reproducción: `openPlayer()` fija la estación actual, carga la URL si cambia y muestra el panel en modo minimizado; `togglePlayback()` usa `audioPlayer.load()` / `audioPlayer.play()` y actualiza la UI con `updateUI()`.
- Control de tamaño del reproductor: `togglePlayerSize()` alterna la clase del panel entre `.minimized` y `.maximized` según el estado de la variable `isMinimized`.
- Variables de estado globales: `isPlaying`, `isLoading`, `isMinimized`, `currentStation`, `stations`.
- Eventos de audio: seis listeners sobre `audioPlayer` gestionan transiciones de estado:
  - `loadstart` → `isLoading = true`
  - `waiting` → `isLoading = true`
  - `canplay` → `isLoading = false`
  - `playing` → `isPlaying = true`, `isLoading = false`
  - `pause` → `isPlaying = false`
  - `error` → `isPlaying = false`, `isLoading = false` + toast de error
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
- **Sintonizando (isLoading):** mientras el elemento `<audio>` carga; botones de reproducción deshabilitados, ondas muestran shimmer verde.
- **Sin datos / fallo de fetch:** limpia la lista y muestra toast de error.
- **Fallo de audio (play):** el listener `error` y la promesa rechazada de `play()` desactivan el estado de reproducción y muestran toast.
- **Cambio de estación:** si la URL cambia, se reinicia `isPlaying` e `isLoading` antes de cargar la nueva fuente.

## Accesibilidad

- **Elementos interactivos como `<button>`:** todos los controles accionables usan el elemento `<button>` nativo (ítems de la lista, play/pause, chevron), lo que garantiza focusabilidad por Tab, activación con Enter/Space y semántica correcta para lectores de pantalla sin código adicional.
- **`aria-label` en controles sin texto visible:** los botones de iconos y los ítems de la lista declaran `aria-label` descriptivo (ej. `"Sintonizar [nombre]"`, `"Reproducir o pausar"`, `"Expandir reproductor"`).
- **Foco visible:** `:focus-visible` con `box-shadow: 0 0 0 3px var(--spotify-green)` en `.radio-item` y botones del reproductor; se usa `box-shadow` en lugar de `outline` para compatibilidad con `border-radius` en Android WebView.
- **Pendiente:** `aria-disabled="true"` en los botones de reproducción durante el estado "Sintonizando" (actualmente solo se aplica opacidad visual con `.disabled`).

## Extensiones recomendadas
- Servidor local estático para pruebas manuales.
- Inspector de red para validar respuesta JSON y CORS.
