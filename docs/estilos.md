# Guía de estilos

## Paleta y tema
- Basado en esquema tipo Spotify: negros/grises profundos con verde de acento.
- Variables en `:root` en [styles/styles.css](../styles/styles.css):
  - `--spotify-black`: fondo principal.
  - `--spotify-dark-grey` y `--spotify-light-grey`: contenedores y estados activos.
  - `--spotify-green`: acento para iconos, botones y ondas.
  - `--spotify-white`: texto principal.

## Tipografía
- Fuente principal Inter cargada desde Google Fonts en [index.html](../index.html).
- Pesos usados: 300, 400, 600, 700.
- Escalas utilitarias definidas en [styles/helpers.css](../styles/helpers.css) (`text-3xl`, `text-2xl`, `text-lg`, etc.).

## Componentes clave
- **Tarjeta de radio:** fondo gris oscuro, borde redondeado y highlight al presionar; icono con acento verde.
- **Reproductor:** cabecera con botón back, estado en mayúsculas y bloque central con gradiente; botón principal circular verde.
- **Ondas animadas:** barras verticales con animación `wave`; estados `playing` (animación activa) y `paused` (altura mínima y pausa).
- **Skeleton loader:** bloques con gradiente animado `shimmer` que ocupa el lugar de las tarjetas mientras cargan datos.
- **Toast:** contenedor fijo inferior; colores rojo/verde según tipo, con animación `fadeIn`.

## Animaciones y transiciones
- Transición de pantalla: `screen-player` entra desde abajo y la lista se escala/desvanece al abrir el reproductor.
- Botón play/pause: escala ligera al hacer click.
- `fadeIn`: entrada suave usada en toasts y skeletons.
- `wave`: ciclo de altura para barras animadas con delays escalonados.

## Layout y helpers
- Utilidades tipo Tailwind en [styles/helpers.css](../styles/helpers.css): espaciados (`mb-*`, `mt-*`, `p-*`), flex y alineaciones, colores de texto y fondos, radios, trackings y tamaños.
- Contenedor principal ocupa 100% de alto y centra la app para móviles.

## Accesibilidad y rendimiento
- Preferir fuentes y assets remotos cacheables.
- Mantener contraste alto (texto blanco sobre fondos oscuros, acento verde en acciones).
- Minimizar cambios forzados de layout usando transiciones y animaciones cortas.
