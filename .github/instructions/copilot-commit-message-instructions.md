
# Instrucciones para generar mensajes de commit (Copilot)

Usa **Conventional Commits** con estas reglas.

## Formato obligatorio

`type(scope): subject`

- `type`: obligatorio, en minúsculas.
- `scope`: **obligatorio**, en minúsculas.
- `subject`: obligatorio, **en inglés**, modo imperativo ("add", "fix", "update"), sin punto final.

## Tipos permitidos

- `feat`: nueva funcionalidad visible o capacidad nueva.
- `fix`: corrección de bug.
- `docs`: documentación únicamente.
- `style`: cambios de formato/estilo (sin cambiar lógica).
- `refactor`: refactor (cambia implementación sin cambiar comportamiento).
- `perf`: mejora de performance.
- `test`: agrega/ajusta tests.
- `build`: build system, Gradle/Cordova, empaquetado.
- `ci`: CI/CD.
- `chore`: tareas varias (tools, mantenimiento).
- `revert`: revertir un commit.

## Scope (obligatorio)

En `scope` indica los **nombres de los archivos modificados**, incluyendo la extensión.

- Si se modificó **1 archivo**: usa ese nombre. Ej: `main.js`
- Si se modificaron **2 archivos**: lista ambos separados por `,`. Ej: `index.html,main.js`
- Si se modificaron **más de 2 archivos**: usa `*`

Notas:
- No incluyas rutas (solo el nombre del archivo).
- Respeta el nombre real del archivo (incluida la extensión).

## Reglas del subject (en inglés)

- Modo imperativo y presente: "add", "fix", "remove", "use", "prevent".
- 50–72 caracteres ideal.
- Si superar ese límite es necesario para que el subject sea claro, permítelo y marca el commit agregando `*` al final del subject.
- No uses comillas salvo para términos exactos de la UI.
- Evita mencionar rutas de archivos.
- Describe el resultado, no el proceso.

## Body (opcional, recomendado si no es obvio)

Sin body.

## Ejemplos (buenos)

- `feat(main.js): add station search input`
- `fix(index.html,main.js): use "Al aire" label for play state`
- `fix(*): prevent crash on missing network permission`
- `docs(writing.md): clarify terminology for "En vivo" and "Sintonizar"`
- `style(styles.css,helpers.css): normalize spacing in station list`
- `build(config.xml): bump android targetSdkVersion`
- `feat(main.js): add clearer station filtering for offline mode *`

## Ejemplos (malos)

- `Update stuff`
- `fix: bug` (falta scope)
- `feat(UI): Added new feature.` (scope en mayúsculas, subject en pasado y con punto)

