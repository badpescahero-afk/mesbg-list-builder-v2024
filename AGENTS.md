# MESBG List Builder ES

## Invariantes

- Conservar las estadísticas, puntos, reglas, restricciones, identificadores JSON y funcionalidades originales de MESBG.
- La traducción afecta únicamente a la presentación. No traducir claves de datos, valores persistidos, rutas ni condiciones del motor. La petición vigente incluye traducir reglas y descripciones en la presentación, con los nombres canónicos de miniaturas y ejércitos como referencia, sin cambiar sus claves originales.
- Conservar los recursos y la descarga de cartas originales. La etapa vigente autoriza una exportación adicional de cartas españolas configuradas según las cinco referencias visuales aportadas por el usuario.
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
- Mantener las cartas originales y sus recursos. Las cartas españolas configuradas son una alternativa adicional; no sobrescribir los JPG originales.
- Los avisos del constructor se traducen solo en los renderizadores mediante `WarningText`; no modificar ni reemplazar las reglas de validación originales para traducir sus mensajes.

## Reglas, descripciones y equipo

- La revisión terminológica vigente traduce también los atributos dentro de las
  frases: Defensa, Fuerza, Coraje, Inteligencia, Poder, Voluntad y Destino. La
  excepción de atributos originales se aplica a las tablas/abreviaturas y los
  datos, no a la prosa. Usar Prioridad, pruebas, Guerrero, Caballería e Infantería
  de forma coherente. Centralizar palabras clave en `content/terms.es.json` y
  traducir parámetros visibles como `Fury (Orc)` sin cambiar el nombre fuente.
- Mostrar los nombres españoles del catálogo también en las tarjetas del
  constructor. Mantener los nombres canónicos en búsquedas, referencias,
  rutas de imágenes, identificadores, comparaciones y almacenamiento.

- El alcance vigente incluye las reglas y descripciones en español. Usar `GameText` o `translateGameText` solo en el renderizado de texto; conservar comparaciones, filtros del motor, claves React, valores de formularios y serialización originales.
- Centralizar estas traducciones en `src/i18n/content/*.es.json`. Mantener números, modificadores, límites, condiciones y etiquetas HTML del texto fuente. Las estadísticas siguen en inglés.
- Para una regla o perfil nuevo, añadir su traducción al catálogo y comprobar `game-text.test.ts`, que recorre todos los textos de los datos actuales. Mantener el fallback inglés para futuras entradas desconocidas.
- Los nombres canónicos de miniaturas y ejércitos permanecen como referencia e identificadores internos. En las cartas configuradas se permiten nombres españoles de presentación; conservar el fallback canónico para nombres aún no traducidos.

## Cartas configuradas: etapa autorizada

- Usar el diseño de referencia (fondo pergamino claro, títulos granates, retrato circular, atributos originales y monturas separadas) con datos reales de la lista. Las cifras de las imágenes no sustituyen los datos del repositorio.
- Coste por miniatura desde `pointsPerUnit`, no el coste total del grupo. Incluir las opciones seleccionadas y aplicar solo los modificadores declarados mediante el transformador existente. No inventar efectos condicionales de combate ni reglas de equipo.
- Mantener una carta por configuración distinta; agrupar únicamente configuraciones idénticas. Exportar PNG dentro de un ZIP sin modificar la lista.
- Entregar una copia del perfil al transformador de consulta, para que los casos históricos que asignan atributos (Nazgûl) no escriban en los datos compartidos. El comportamiento predeterminado del constructor no cambia.

- Validar las cartas con `npx vitest run src/i18n src/components/common/configured-cards/card-model.test.ts --environment node` y `node scripts/test-configured-cards.mjs`, además de las comprobaciones generales. El script nuevo usa Vite en el puerto 5198 y lo detiene al terminar.

## Biblioteca, explicaciones y entrega

- La etapa actual autoriza completar nombres de presentación, consulta de todas las
  cartas y explicaciones al pulsar reglas y magias. Mantener `names.es.json` separado
  de las claves originales; los nombres canónicos siguen disponibles para referencia.
- `RuleReference` resuelve una regla general o recibe la descripción del propio perfil.
  Nunca utilizar la descripción de otro perfil solo porque comparta el nombre.
  Mantener teclado, restauración de foco y el modo no interactivo para PNG/impresión.
- Las cartas de referencia no tienen una selección de ejército/equipo: no inventar
  un coste ni recursos heroicos cuando los datos son ambiguos. Las configuradas siguen
  usando el coste y las opciones de la lista; incluir también equipo de asedio.
- La biblioteca y modo partida deben mantener el acceso a los JPG originales.
- `npm run build:standalone` genera `build/` con los recursos originales locales.
  `npm run preview:standalone` sirve esa compilación en 4173. Para dejar una vista
  previa disponible, iniciar este servidor aparte con PID y registro; no mantener
  una comprobación bloqueada ni Vite en primer plano.
- Validar además `node scripts/test-complete-es.mjs` y las pruebas de
  `src/components/common/rules`. La exportación y cancelación nunca escriben datos
  de la lista. No publicar sobre main ni usar etiquetas `v*`: los workflows originales
  despliegan a producción y envían una notificación externa con esas etiquetas.

## Instalación en móvil

- En móvil, la navegación se abre como un panel superpuesto. Las compañías,
  nombres, opciones y acciones deben caber desde 320 px sin desplazamiento
  horizontal ni ocultación de controles. Las barras de puntos/avisos reservan su
  altura real al envolver texto. Validar `node scripts/test-mobile-layout.mjs`
  al cambiar el diseño: mide el contenido visible, también si un contenedor
  oculta el desbordamiento, y comprueba que la lista guardada no cambie.

- La app instalable usa el icono de la adaptación española, sin año y con una
  bandera española, y un manifiesto PWA. Conservar los recursos originales. La instalación móvil
  requiere HTTPS; un enlace localhost del entorno no es una URL accesible al usuario.
- El service worker solo se registra en producción y almacena el shell de la app.
  Las imágenes se guardan al consultarlas, con un máximo de 32 MiB. No precachear
  los cientos de MB de recursos ni respuestas de API, autenticación o datos privados.
- Versionar la caché del shell por contenido y dejar que las ventanas abiertas
  terminen antes de activar una actualización. No usar skipWaiting ni recargar una
  lista que se está editando. No borrar localStorage ni cachés de otras aplicaciones.
- Ejecutar `npm run build:standalone` y `node scripts/test-pwa.mjs`. La prueba utiliza
  un perfil persistente de Chromium aislado en un directorio temporal, comprueba
  los requisitos de instalación y desconecta la red antes de abrir/exportar una lista.
  Detiene únicamente su propio servidor en el puerto 5200 al terminar.

## Identidad, créditos y nombres de ejércitos

- Mostrar nombres de ejércitos y facciones en español mediante el catálogo, con
  búsqueda por el nombre español o canónico. Conservar los valores de selectores,
  claves, rutas de recursos y datos exportados/importados. Los nombres que el
  usuario da a sus listas o grupos se mantienen literalmente.
- Identificar esta versión como adaptación no oficial, conservar LICENSE y
  NOTICE.md, y mantener enlaces visibles al código correspondiente y la licencia.
  Discord, Patreon y correo originales deben identificarse como canales originales;
  las incidencias de esta adaptación van a su propio repositorio.
- La atribución y la licencia del software no otorgan permisos sobre contenido de
  terceros. No presentar los avisos como una autorización de dichos titulares.

## Modo local temporal

- Por petición del usuario, las cuentas, registro, recuperación y cierre de sesión
  están desactivados. `CLOUD_ACCOUNTS_ENABLED` permanece en false aunque existan
  variables de Firebase o una sesión anterior. No conectar con cuentas originales.
- Mantener el guardado automático existente de Zustand/localStorage y sus claves,
  formatos y versiones. No limpiar, migrar ni sobrescribir listas para desactivar
  cuentas. Los enlaces antiguos de acceso deben llevar a Mis listas.
- Antes de reactivar cuentas, configurar y validar servicios propios de acceso y
  sincronización. No basta con habilitar el código o copiar claves del original.
- Validar `node scripts/test-local-mode.mjs` (perfil de navegador aislado, cierre y
  reapertura, conservación de datos y ausencia de peticiones de autenticación).

## Referencia española y FAQ contrastadas

- Consultar `docs/REVISION_REFERENCIA_ES.md` y el glosario con referencias de página
  `docs/glosario-revisado-es.json` antes de cambiar los términos revisados.
- La referencia completa está fuera de Git en `/workspace/mesbg-reference/`.
  No incorporarla al repositorio público ni al paquete de la aplicación.
- Distinguir las FAQ identificadas como oficiales de julio de 2026 de la FAQ
  comunitaria no oficial. El manual extraído tiene columnas desordenadas y el
  prólogo de perfiles declara modificaciones del traductor: no importar sus
  estadísticas ni reglas sin contraste.
- Las notas fechadas de erratas de consulta se mantienen separadas en
  `rule-errata.ts`, sin modificar los datos ni el motor. No usar coincidencias de
  nombres para atribuir a un perfil una regla exclusiva de otro.
- Al revisar vocabulario/FAQ, ejecutar también `reference-glossary.test.ts`,
  `faq-reference.test.ts` y las pruebas de `components/common/rules`.

## Nombres confirmados por el usuario

- El nombre confirmado del personaje es **Helm Manomartillo**, también en sus
  perfiles de rey de Rohan y espectro de Cuernavilla. Su habilidad
  `The Hammerhand` se llama **Manomartillo**. Conservar esta grafía unida.
- `Compel` se presenta como **Control**, nunca como «Obligar» en el nombre del
  poder. El verbo obligar en la prosa no es por sí mismo un nombre de magia.
- Conservar las claves inglesas y registrar las denominaciones confirmadas en el
  glosario de referencia.

- Por petición del usuario, `Burly` se presenta como **Corpulento**, también en
  las referencias dentro de otras reglas; no usar «Cachas».
