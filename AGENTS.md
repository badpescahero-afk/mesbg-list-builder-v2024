# MESBG List Builder ES

## Invariantes

- Conservar las estadísticas, puntos, reglas, restricciones, identificadores JSON y funcionalidades originales de MESBG.
- La traducción afecta únicamente a la presentación. No traducir claves de datos, valores persistidos, rutas, nombres de ejércitos/perfiles ni condiciones del motor para cambiar su visualización.
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
