# Interfaz español/inglés

La aplicación inicia en español. El selector superior permite cambiar al inglés
sin recargar. El idioma se guarda en `mesbg-ui-language`, separado de las listas,
partidas y preferencias originales. Actualiza `html.lang` y se sincroniza entre
pestañas. Si el almacenamiento está bloqueado, funciona en memoria.

## Organización

- `src/i18n/spanish.ts`: catálogo central. Las claves son los textos ingleses
  originales; los mensajes desconocidos conservan su contenido original.
- `LanguageProvider` y `useTranslation`: idioma y traducción reactiva.
- `TranslatedText`: traduce texto de interfaz sin añadir elementos HTML.
- `LanguageSelector`: selector español/inglés.
- `ThemeContextProvider`: aplica también el idioma de los controles de Material UI.
- Los textos con valores variables usan marcadores como `{{count}}` o `{{section}}`.
  Sus valores se insertan literalmente: no se interpretan como HTML ni se traducen
  los nombres proporcionados por el usuario.

## Cobertura

Menús y botones, inicio y páginas informativas, ajustes y ayudas, creación y
edición de listas y grupos, formularios y pasos de resultados, confirmaciones de
borrado, importación y exportación, colección, base de datos, modo de juego y
contadores, historial y gráficas, cuenta y validación de formularios,
sincronización, notificaciones y pantallas de error. Storybook utiliza también el
proveedor de idioma.

Los nombres de listas y grupos del usuario conservan su texto, incluso si
coinciden con una clave de traducción. Los valores internos `Good`, `Evil`, `Won`,
`Draw`, `Lost`, nombres de campos, rutas y parámetros de consulta se conservan.
Por ejemplo, el historial muestra «Victoria», pero sigue guardando `Won`.

Se conservan en su idioma original los nombres y contenidos de los datos de
juego, las reglas y avisos derivados de esos datos, los ejemplos con sintaxis de
consulta, el registro histórico de cambios y los diagnósticos técnicos externos.
No se modifican las estadísticas, puntos, restricciones, cálculos, identificadores
JSON ni los algoritmos de importación/exportación. Los nombres y perfiles de las
miniaturas tampoco se traducen automáticamente.

El sistema de cartas, sus archivos, diseño, rutas y lógica de descarga, y la vista
PDF permanecen intactos. Las cartas españolas aprobadas se integrarán en una etapa
posterior explícita.

## Validación

Desde la raíz del repositorio:

```sh
npm run build
npm run check
npx vitest run src/i18n --environment node
node scripts/test-i18n.mjs
```

Las pruebas unitarias verifican el fallback, las preferencias guardadas, la
interpolación literal, la coherencia de los marcadores y la cobertura de todos
los mensajes estáticos marcados para traducción.

La prueba de navegador usa Playwright y `/usr/bin/chromium` (configurable con
`CHROMIUM_PATH`). Arranca su propio Vite en el puerto 5197 con un registro temporal
y lo detiene al finalizar, incluso ante errores. Comprueba:

- Creación de listas y grupos, y nombres del usuario que coinciden con claves.
- Cambio de idioma, persistencia tras recargar y conservación literal del JSON.
- Pantallas principales, base de datos y validación de acceso sin credenciales.
- Exportación e importación de una lista, conservando puntos, número de miniaturas
  e identificadores de perfiles.
- Traducción del aviso de borrado y cancelación sin pérdida de datos.
- Registro de una partida: «Victoria» en pantalla y `Won` en almacenamiento,
  conservando los datos al alternar idiomas.

El navegador de pruebas es independiente del navegador personal. No mantiene
servicios ejecutándose después de terminar. La autenticación real, la sincronización
remota y las descargas de cartas requieren sus servicios y no se simulan como
verificados por estas pruebas.
