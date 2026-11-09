# Traducción español/inglés

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
- `content/*.es.json`, `GameText` y `translateGameText`: reglas comunes, hechizos,
  acciones heroicas, reglas de ejército, descripciones de perfiles, equipo y opciones.
  Son catálogos separados de los datos originales; las claves son el texto fuente.
- `warnings.es.ts`, `warnings.ts` y `WarningText`: avisos del constructor.
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

Las reglas y descripciones se traducen al mostrarlas: las 101 reglas comunes,
hechizos y acciones heroicas, los textos de los 109 ejércitos, las habilidades y
notas de todos los perfiles, el equipo, las opciones y los avisos del constructor.
La búsqueda de reglas acepta el nombre español o inglés en ambos idiomas.
La base de datos, los resúmenes de texto e imagen y la vista PDF usan esta capa.
Las cartas originales siguen disponibles. La exportación adicional de cartas
configuradas en español se describe en [CARTAS_CONFIGURADAS_ES.md](CARTAS_CONFIGURADAS_ES.md).

Los nombres canónicos se conservan como claves y referencias visibles. El catálogo
`names.es.json` añade 550 nombres de presentación, incluidos perfiles anidados y
alias; las cartas y las descripciones españolas utilizan estas traducciones.
Los selectores y la base de datos admiten también búsquedas por el nombre español. También se conservan los ejemplos con
sintaxis de consulta, el registro histórico de cambios y los diagnósticos técnicos
externos. No se modifican los archivos originales de datos, las estadísticas,
puntos, restricciones, cálculos, identificadores JSON ni los algoritmos de
importación/exportación. Las traducciones nunca se usan como claves de selección.

Los JPG originales y su diseño permanecen intactos. La descarga original comprueba
las respuestas HTTP, incluye las páginas de continuación y admite nombres con comas
y caracteres reservados. La alternativa española genera cartas con coste y equipo
de la lista. La biblioteca permite consultar todos los perfiles y los nombres
subrayados de reglas y magias abren su explicación. Los textos del PDF y del resumen
para compartir también se traducen, conservando sus tablas de atributos originales.

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
los mensajes estáticos marcados para traducción. También recorren todos los datos
de reglas, ejércitos, perfiles y equipo para comprobar cobertura y conservación
de los números, modificadores de dados y etiquetas HTML.

La prueba de navegador usa Playwright y `/usr/bin/chromium` (configurable con
`CHROMIUM_PATH`). Arranca su propio Vite en el puerto 5197 con un registro temporal
y lo detiene al finalizar, incluso ante errores. Comprueba:

- Creación de listas y grupos, y nombres del usuario que coinciden con claves.
- Cambio de idioma, persistencia tras recargar y conservación literal del JSON.
- Pantallas principales, base de datos y validación de acceso sin credenciales.
- Reglas en español e inglés y búsquedas por ambos nombres, sin cambios en listas.
- Exportación e importación de una lista, conservando puntos, número de miniaturas
  e identificadores de perfiles.
- Traducción del aviso de borrado y cancelación sin pérdida de datos.
- Registro de una partida: «Victoria» en pantalla y `Won` en almacenamiento,
  conservando los datos al alternar idiomas.

El navegador de pruebas es independiente del navegador personal. No mantiene
servicios ejecutándose después de terminar. La autenticación real, la sincronización
remota requieren sus servicios y no se simulan como verificados por estas pruebas.
Las descargas reales de cartas están cubiertas por las pruebas adicionales descritas
en `CARTAS_CONFIGURADAS_ES.md`.

## Excepciones y último cierre de interfaz

Por instrucción del usuario, las etiquetas de atributos (`Mv`, `Fv`, `Sv`, `S`,
`D`, `A`, `W`, `C`, `I`, `Might`, `Will`, `Fate`, `Range`) y sus valores se mantienen
en el idioma original. El selector de idioma no modifica las tablas originales
ni los archivos de cartas.

Los títulos del menú de tablas, sus diálogos, las categorías de palabras clave,
los tipos de elementos de sincronización y el resumen de texto se traducen en
la presentación. Las claves de tablas y las rutas de sus imágenes no cambian.

Los 110 avisos distintos de `warning_rules.json`, y los avisos calculados del
constructor, tienen una capa de traducción independiente (`warnings.es.ts` y
`warnings.ts`). La validación sigue produciendo sus mensajes y resultados
originales: solo `WarningText` localiza el texto al mostrarlo. Los nombres de
ejércitos y miniaturas mencionados mantienen los nombres utilizados en la lista.

Las pruebas adicionales comprueban cobertura de los avisos, conservación de
los porcentajes y límites en mensajes calculados, y permanencia de las etiquetas
y valores de atributos al alternar español/inglés.
