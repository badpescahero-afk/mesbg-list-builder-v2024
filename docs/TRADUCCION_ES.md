# Primera etapa: interfaz español/inglés

La aplicación inicia en español. El selector de la barra superior permite volver
al inglés sin recargar. El idioma se guarda en `mesbg-ui-language`, separado de
las listas y preferencias originales. También actualiza `html.lang` y sincroniza
el cambio entre pestañas. Si el almacenamiento está bloqueado, funciona en memoria.

## Organización

- `src/i18n/spanish.ts`: catálogo de textos de interfaz. La clave es el texto inglés
  original; los textos pendientes conservan ese inglés como fallback.
- `LanguageProvider` y `useTranslation`: estado de idioma y traducción reactiva.
- `LanguageSelector`: selector accesible español/inglés.
- Los menús marcan explícitamente sus etiquetas traducibles. Los nombres de listas
  y grupos del usuario y los identificadores de navegación no se traducen.

Esta primera entrega incluye el menú principal, selector, títulos y controles de
listas, inicio, historial, colección, base de datos y ajustes, además del diálogo
principal de creación de listas. La traducción es incremental: siguen pendientes
textos de ayuda, opciones secundarias, diálogos especializados y otras pantallas.
Los nombres y textos de los datos de juego permanecen en su idioma original.

No se modifican el motor, las estadísticas, puntos, reglas, restricciones, archivos
JSON, almacenamiento de listas, rutas ni el sistema de cartas. La integración de
las cartas españolas aprobadas queda para una etapa posterior.

## Validación

Desde la raíz del repositorio:

```sh
npm run build
npm run lint
npx vitest run src/i18n/locale.test.ts --environment node
node scripts/test-i18n.mjs
```

La prueba de navegador usa Playwright y `/usr/bin/chromium` (configurable mediante
`CHROMIUM_PATH`). Arranca su propio Vite en el puerto 5197 con un registro temporal
y lo detiene al finalizar, incluso ante errores. Comprueba creación de listas,
cambio de idioma, persistencia tras recargar, conservación literal del JSON de
listas al cambiar de idioma, pantallas principales y base de datos. No utiliza el
almacenamiento de un navegador personal ni mantiene servicios en ejecución.
