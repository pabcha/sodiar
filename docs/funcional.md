# Documentación funcional

## Alcance
Describe el comportamiento actual de la aplicación móvil Sodiar: pantallas, flujos de usuario, mensajes, transiciones y criterios de aceptación/QA manual.

## Pantallas y componentes
- **Lista de estaciones** (pantalla inicial) en [index.html](../index.html): título y contenedor de tarjetas; muestra skeleton mientras carga datos.
- **Reproductor:** panel fijo anclado en la parte inferior de la pantalla con dos vistas intercambiables:
  - *Minimizado:* barra de 70px con nombre de estación, estado y botón circular play/pause.
  - *Maximizado:* panel a pantalla completa con nombre, bloque de ondas animadas, estado y botón principal.
- **Toasts:** avisos temporales superpuestos en la parte inferior; colores verde para éxito, rojo para error.

## Flujos de usuario
1) **Carga inicial**
- Se muestra skeleton de 5 ítems mientras llega la respuesta del endpoint.
- Con datos válidos, se reemplaza por la lista de estaciones; en error se limpia la lista y se muestra toast de error.

2) **Selección de estación**
- Al tocar una tarjeta, el panel reproductor se vuelve visible en modo minimizado.
- Se actualiza el nombre de la estación en ambas vistas (minimizada y maximizada).
- Si la URL difiere de la cargada previamente, se reinicia el estado de reproducción y se carga la nueva fuente.
- Se dispara autoplay al seleccionar; si falla, se muestra toast de error y la UI queda en estado detenido.

3) **Reproducción**
- **Sintonizando:** al iniciar la carga; icono muestra play, ondas muestran shimmer verde, estado muestra "Sintonizando"; botones deshabilitados.
- **Al aire:** al confirmar reproducción activa; icono cambia a pausa, ondas se animan, estado muestra "Al aire"; botones habilitados.
- **Detenido:** al pausar; icono regresa a play, ondas se detienen, estado muestra "Detenido"; botones habilitados.
- Cambio de estación: si la URL es distinta, se reinicia el estado antes de cargar la nueva fuente.

4) **Navegación del reproductor**
- Botón chevron en el borde superior del panel alterna entre vista minimizada y maximizada.
- El reproductor permanece visible mientras la lista sigue accesible; no hay pantalla separada ni botón "back".

5) **Navegación por teclado**
- La tecla Tab recorre los ítems de la lista en orden; cada ítem recibe foco visible con un ring verde de 3px.
- Presionar Enter o Space sobre un ítem con foco ejecuta la misma acción que tocarlo: abre el reproductor en modo minimizado y dispara autoplay.
- Los botones del reproductor (play/pause, chevron) también son alcanzables por Tab y activables con Enter/Space.

## Mensajes y estados de error
- **Fallo al traer datos:** toast rojo con "No pudimos cargar la lista de radios." y lista vacía.
- **Fallo al reproducir:** toast rojo con "No se pudo sintonizar la emisora." y estado vuelve a detenido.

## Criterios de aceptación
- La lista muestra skeleton al cargar y se reemplaza por tarjetas al llegar datos válidos.
- Al tocar una tarjeta, el panel reproductor aparece en modo minimizado y dispara autoplay; el nombre coincide con la estación seleccionada.
- El estado "Sintonizando" desactiva los botones de reproducción mientras el audio carga.
- Al reproducir, el icono principal cambia a pausa y las ondas pasan al estado animado; al pausar, ocurre lo inverso.
- El botón chevron alterna correctamente entre modo minimizado y maximizado.
- Errores de red o de reproducción generan toast rojo y no dejan la UI en estado inconsistente (iconos/ondas en detenido).
- Al navegar con Tab, cada ítem de la lista y cada botón del reproductor muestran un ring verde visible al recibir foco.
- Presionar Enter o Space sobre un ítem de la lista con foco abre el reproductor y dispara autoplay, idéntico al tap táctil.

## Guía de QA manual
- **Precondiciones:** endpoint accesible con respuesta JSON válida, navegador con audio habilitado, conexión estable.
- **Pruebas básicas:**
  - Abrir app: verificar skeleton y posterior lista de estaciones.
  - Tocar estación: confirmar que el panel aparece minimizado y arranca autoplay; en caso de error, ver toast adecuado.
  - Play/Pause: alternar y validar iconos, texto de estado ("Al aire" / "Detenido") y ondas.
  - Estado "Sintonizando": verificar que los botones quedan deshabilitados durante la carga y se habilitan al recibir audio.
  - Cambiar de estación: verificar que nombre y stream cambian y que el estado se reinicia coherentemente.
  - Chevron: alternar entre vista minimizada y maximizada; confirmar que ambas reflejan el estado correcto.
  - Conectar teclado físico (o activar navegación por teclado en el emulador): verificar que Tab recorra todos los ítems de la lista con ring verde visible, y que Enter/Space sobre un ítem abra el reproductor correctamente.
- **Pruebas de error:**
  - Simular caída de endpoint (URL inválida): debe mostrarse "No pudimos cargar la lista de radios." y la lista quedar vacía.
  - Simular error de audio (URL rota): al intentar reproducir, se muestra "No se pudo sintonizar la emisora." y la UI queda en estado detenido.

## Notas de usabilidad
- Interfaz móvil-first; el reproductor es un panel fijo inferior no intrusivo que convive con la lista.
- La vista minimizada permite controlar la reproducción sin perder acceso a la lista de estaciones.
- Controles táctiles con áreas grandes y feedback de color en botones.
- Toasts no bloquean la interacción y desaparecen automáticamente.
