# Sodiar

**Sodiar** es una aplicación híbrida desarrollada con Apache Cordova que permite listar y reproducir estaciones de radio locales vía streaming. La aplicación consume un listado de radios desde una hoja de cálculo de Google (a través de Google Apps Script) y ofrece una interfaz sencilla para la reproducción de audio.

## Características

- 📻 **Listado de Radios:** Carga dinámica de estaciones desde una fuente remota.
- ▶️ **Reproductor de Audio:** Reproducción en streaming con controles de Play/Pause.
- 📱 **Diseño Responsivo:** Interfaz adaptada para dispositivos móviles.
- 🔔 **Notificaciones (Toasts):** Feedback visual para el usuario en caso de errores o acciones.
- 💀 **Skeleton Loading:** Indicador de carga visual mientras se obtienen los datos.

## Requisitos Previos

Para desarrollar y construir este proyecto, necesitas tener instalado:

- [Node.js](https://nodejs.org/) y npm.
- [Apache Cordova](https://cordova.apache.org/) (`npm install -g cordova`).
- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) (para Android).
- [Android Studio](https://developer.android.com/studio) y Android SDK (para construir y ejecutar en Android).

## Instalación

1.  Clona este repositorio o descarga el código fuente.
2.  Navega al directorio del proyecto en tu terminal:
    ```bash
    cd sodiar-app
    ```
3.  Instala las dependencias del proyecto (si las hubiera en `package.json`, aunque Cordova gestiona sus plugins):
    ```bash
    npm install
    ```
4.  Asegúrate de tener la plataforma Android añadida:
    ```bash
    cordova platform add android
    ```

## Configuración

La aplicación utiliza un Google Apps Script como backend para obtener el listado de radios. Es necesario configurar el ID de la hoja de cálculo.

1.  Abre el archivo `www/index.html`.
2.  Busca la constante `SPREADSHEET_ID` al final del archivo:
    ```javascript
    const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
    ```
3.  Reemplaza `"YOUR_SPREADSHEET_ID_HERE"` con el ID de tu script desplegado o tu hoja de cálculo configurada.

> **Nota:** El endpoint debe responder un JSON con la estructura esperada (ver documentación técnica) y tener habilitado CORS.

## Ejecución y Pruebas

### En el navegador
Para probar la interfaz durante el desarrollo, tienes varias opciones rápidas:

1.  **Abrir el archivo directamente:** Puedes hacer doble clic en `www/index.html` para abrirlo en tu navegador predeterminado.
2.  **VS Code Live Server:** Si usas Visual Studio Code, se recomienda instalar la extensión **Live Server**. Una vez instalada, haz clic derecho en `www/index.html` y selecciona "Open with Live Server" para tener recarga automática ante cambios.
3.  **Cordova Browser:**
    ```bash
    cordova run browser
    ```

### En Android (USB / Emulador)
Para ejecutar la aplicación directamente en un dispositivo Android conectado por USB (con depuración activada) o en un emulador:

```bash
cordova run android
```

## Instalar en Dispositivo

1.  **IMPORTANTE: Configurar ID**
    Asegúrate de haber configurado correctamente el `SPREADSHEET_ID` en `www/index.html` antes de construir, de lo contrario la app no cargará los datos.

2.  **Construir el APK**
    Ejecuta el siguiente comando en la terminal:
    ```bash
    cordova build android
    ```

3.  **Localizar el archivo**
    Una vez finalizado el proceso, encontrarás el archivo `app-debug.apk` generalmente en la ruta:
    `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

4.  **Instalar en el teléfono**
    - Conecta tu teléfono a la PC y copia el archivo `.apk` a la memoria interna.
    - Alternativamente, envía el archivo por correo, Telegram, Drive, etc., y descárgalo en el móvil.
    - Abre el archivo desde el gestor de archivos de tu teléfono e instálalo (es posible que debas permitir la instalación desde "Orígenes desconocidos" o confiar en la fuente).

## Estructura del Proyecto

- **`www/`**: Contiene el código fuente de la aplicación (HTML, CSS, JS).
    - `index.html`: Punto de entrada y estructura HTML.
    - `main.js`: Lógica de la aplicación.
    - `styles/`: Archivos CSS.
- **`platforms/`**: Código nativo generado para cada plataforma (Android, etc.).
- **`docs/`**: Documentación detallada del proyecto.
- **`config.xml`**: Archivo de configuración global de Cordova.

## Documentación Adicional

Puedes encontrar más detalles sobre el funcionamiento y diseño en la carpeta `docs/`:

- [Documentación Funcional](docs/funcional.md): Alcance, flujos de usuario y pantallas.
- [Documentación Técnica](docs/tecnica.md): Arquitectura, datos y manejo de errores.
- [Guía de Estilos](docs/estilos.md): Detalles de diseño y CSS.
- [Writing y Voz](docs/writing.md): Guía de tono y escritura.

## Licencia

Este proyecto está bajo la licencia [Apache-2.0](LICENSE).
