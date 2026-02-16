# Documentación funcional

## Alcance
Describe el comportamiento actual de la aplicación móvil Sodiar: pantallas, flujos de usuario, mensajes, transiciones y criterios de aceptación/QA manual.

## Pantallas y componentes
- Lista de estaciones (pantalla inicial) en [index.html](../index.html): título y contenedor de tarjetas; muestra skeleton mientras carga datos.
- Reproductor: muestra nombre de estación, estado (Reproduciendo/En pausa), ondas animadas y botón principal Play/Pause.
- Toasts: avisos temporales superpuestos en la parte inferior; colores verde para éxito, rojo para error.

## Flujos de usuario
1) **Carga inicial**
- Se muestra skeleton de 5 ítems mientras llega la respuesta del endpoint.
- Con datos válidos, se reemplaza por la lista de estaciones; en error se limpia la lista y se muestra toast de error.

2) **Selección de estación**
- Al tocar una tarjeta, se abre el reproductor con transición desde la lista.
- Se setea el nombre de la estación en cabecera y se carga la URL si difiere de la previa.
- Se dispara autoplay al entrar al reproductor; si falla, se muestra toast de error y se mantiene en pausa.

3) **Reproducción**
- Play: inicia carga y reproducción; icono cambia a pausa, ondas se animan, estado muestra "Reproduciendo".
- Pausa: detiene audio; icono regresa a play, ondas se detienen, estado muestra "En pausa".
- Cambio de estación: si la URL es distinta, se reinicia el estado de reproducción antes de cargar.

4) **Navegación**
- Botón back en el reproductor regresa a la lista (sin detener el audio explícitamente; depende del estado previo).

## Mensajes y estados de error
- **Fallo al traer datos:** toast rojo con "Error al traer los datos." y lista vacía.
- **Fallo al reproducir:** toast rojo con "Error al conectar con la radio." y estado vuelve a pausa.

## Criterios de aceptación
- La lista muestra skeleton al cargar y se reemplaza por tarjetas al llegar datos válidos.
- Cada tarjeta abre el reproductor con transición; el nombre mostrado coincide con la estación seleccionada.
- Al reproducir, el icono principal cambia a pausa y las ondas pasan a estado animado; al pausar, ocurre lo inverso.
- Errores de red o de reproducción generan toast rojo y no dejan la UI en estado inconsistente (iconos/ondas en pausa).
- El botón back siempre vuelve a la lista y oculta el reproductor.

## Guía de QA manual
- **Precondiciones:** endpoint accesible con respuesta JSON válida, navegador con audio habilitado, conexión estable.
- **Pruebas básicas:**
  - Abrir app: verificar skeleton y posterior lista de estaciones.
  - Tocar estación: confirmar transición y autoplay; en caso de error, ver toast adecuado.
  - Play/Pause: alternar y validar iconos, texto de estado y ondas.
  - Cambiar de estación: verificar que el nombre y el stream cambian y que el estado se reinicia coherentemente.
  - Back: regresar a la lista y confirmar que la pantalla de reproductor se oculta.
- **Pruebas de error:**
  - Simular caída de endpoint (URL inválida): debe mostrarse toast de error y la lista quedar vacía.
  - Simular error de audio (URL rota): al intentar reproducir, se muestra toast de error y la UI queda en pausa.

## Notas de usabilidad
- Interfaz móvil-first (pantalla a 100% alto, transiciones verticales entre pantallas).
- Controles táctiles con áreas grandes y feedback de color en botones.
- Toasts no bloquean la interacción y desaparecen automáticamente.
