# MESBG List Builder ES

## Invariantes

- Conservar las estadísticas, puntos, reglas, restricciones, identificadores JSON y funcionalidades originales de MESBG.
- La traducción afecta únicamente a la presentación. No traducir claves de datos, valores persistidos, rutas ni condiciones del motor. La petición vigente incluye traducir reglas y descripciones en la presentación, con los nombres canónicos de miniaturas y ejércitos como referencia, sin cambiar sus claves originales.
- Mantener intacto el sistema de cartas: archivos, selección, rutas, diseño y exportación. Las cartas españolas aprobadas se integrarán en una etapa posterior explícita.
- No cambiar la lógica del constructor de ejércitos como parte de una traducción.

## Flujo de trabajo

- Usar el checkout existente y la rama de trabajo; no modificar main ni crear worktrees salvo petición expresa.
- Para esta primera etapa usar feature/traduccion-es y guardar avances mediante commits.
- La interfaz ofrece español e inglés. Centralizar textos en src/i18n y consumirlos con useTranslation; el texto inglés original es la clave y el fallback de mensajes todavía no traducidos.
- Guardar el idioma en una clave independiente de las listas y preferencias originales. Nunca migrar ni sobrescribir datos de usuario para cambiar el idioma.
- Validar con npm run build, npm run lint y pruebas relevantes de traducción y flujos originales antes de hacer commit. No ejecutar formateos masivos sobre archivos ajenos al cambio.
- No mantener Vite indefinidamente en un comando de comprobación. Para pruebas usar un proceso en segundo plano con registro y comprobaciones acotadas, y detener solo el proceso propio al terminar.
- No intentar guardar configuración del entorno mediante las herramientas de onboarding: fallan con INVALID_ARGUMENT. Ante desconexiones, comprobar conectividad y Git, preservar avances e informar del bloqueo exacto.

## Traducciones de interfaz

- Para texto fijo puede usarse `TranslatedText`; no añade nodos HTML. Para atributos de texto y etiquetas calculadas, usar `useTranslation`.
- Interpolar con marcadores `{{nombre}}` y el segundo argumento de `t`. Nunca traducir valores antes de guardarlos ni usar HTML para insertar datos del usuario.
- Traducir los títulos de objetos de configuración en su renderizador; conservar las claves y etiquetas originales que generan identificadores o controlan selecciones.
- Aplicar la traducción a etiquetas de resultados en pantalla, manteniendo `Won`, `Draw` y `Lost` en los datos. Lo mismo se aplica a `Good` y `Evil`.
- Ejecutar `npx vitest run src/i18n --environment node` y `node scripts/test-i18n.mjs` para validar catálogo, interpolación y conservación de datos en flujos reales. El script de navegador detiene su servidor al terminar.

## Atributos y cartas: excepción permanente

- Por instrucción del usuario, las estadísticas/atributos conservan su idioma original, incluidos `Mv`, `Fv`, `Sv`, `S`, `D`, `A`, `W`, `C`, `I`, `Might`, `Will` y `Fate`. No traducir sus valores ni abreviaturas.
- Mantener las cartas y sus recursos originales. La interfaz puede traducirse alrededor de ellas sin alterar cartas, rutas, descarga o diseño.
- Los avisos del constructor se traducen solo en los renderizadores mediante `WarningText`; no modificar ni reemplazar las reglas de validación originales para traducir sus mensajes.

## Reglas, descripciones y equipo

- El alcance vigente incluye las reglas y descripciones en español. Usar `GameText` o `translateGameText` solo en el renderizado de texto; conservar comparaciones, filtros del motor, claves React, valores de formularios y serialización originales.
- Centralizar estas traducciones en `src/i18n/content/*.es.json`. Mantener números, modificadores, límites, condiciones y etiquetas HTML del texto fuente. Las estadísticas siguen en inglés.
- Para una regla o perfil nuevo, añadir su traducción al catálogo y comprobar `game-text.test.ts`, que recorre todos los textos de los datos actuales. Mantener el fallback inglés para futuras entradas desconocidas.
- Los nombres canónicos de miniaturas y ejércitos permanecen como referencia. Los recursos y el sistema de cartas siguen excluidos de esta traducción.
