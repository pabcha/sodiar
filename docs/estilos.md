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
- **Reproductor:** panel fijo inferior (`.player-fixed`) con dos variantes:
  - *Minimizado* (`.minimized`): barra de 70px con nombre de estación (`.player-station-name-mini`), estado (`.player-status-mini`) y botón circular verde de 44px (`.mini-play-btn`).
  - *Maximizado* (`.maximized`): panel a pantalla completa con nombre, bloque central con gradiente, ondas animadas y botón principal circular verde.
  - Botón chevron (`.toggle-player-btn` / `.toggle-player-btn-max`) alterna entre ambas vistas.
- **Ondas animadas:** barras verticales con animación `wave`; tres estados:
  - `.playing`: animación activa en verde.
  - `.paused`: altura mínima y animación detenida.
  - `.loading`: efecto shimmer verde (gradiente animado) mientras el audio carga.
- **Botones de reproducción:** clase `.disabled` los deshabilita visualmente (opacidad reducida, cursor no interactivo) durante el estado "Sintonizando".
- **Skeleton loader:** bloques con gradiente animado `shimmer` que ocupa el lugar de las tarjetas mientras cargan datos.
- **Toast:** contenedor fijo inferior; colores rojo/verde según tipo, con animación `fadeIn`.

## Animaciones y transiciones
- La lista permanece estática; el panel reproductor se superpone como capa fija inferior (no hay transición de pantalla separada).
- Botón play/pause: escala ligera al hacer click.
- `fadeIn`: entrada suave horizontal (`translateX(20px) → translateX(0)`) usada en toasts.
- `wave`: ciclo de altura para barras animadas con delays escalonados.
- `shimmer`: gradiente deslizante verde usado en ondas durante el estado "Sintonizando".

## Layout y helpers
- Utilidades tipo Tailwind en [styles/helpers.css](../styles/helpers.css): espaciados (`mb-*`, `mt-*`, `p-*`), flex y alineaciones, colores de texto y fondos, radios, trackings y tamaños.
- Contenedor principal ocupa 100% de alto y centra la app para móviles.

## Accesibilidad y rendimiento
- Preferir fuentes y assets remotos cacheables.
- Mantener contraste alto (texto blanco sobre fondos oscuros, acento verde en acciones).
- Minimizar cambios forzados de layout usando transiciones y animaciones cortas.
