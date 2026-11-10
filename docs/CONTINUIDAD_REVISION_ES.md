# Continuidad: revisión terminológica y FAQ de MESBG ES

Actualizado: 10 de noviembre de 2026.

## Petición vigente

Revisar la traducción del builder con el documento aportado por el usuario:
`MESBG_Codex_TEXTO_SIN_IMAGENES.pdf`. Es el único documento de esta entrega y
sustituye la expectativa anterior de recibir 11 archivos. Debe servir para
contrastar nombres de perfiles y ejércitos, habilidades, magias, términos del
manual, redacción de reglas y las FAQ incluidas.

El usuario también solicita continuar en otro hilo fijado de Codex con el mismo
entorno. No hay herramientas disponibles para crear, fijar o trasladar hilos;
esas acciones deben realizarse desde la interfaz. No asumir que los adjuntos de
este hilo aparecen automáticamente en el siguiente.

## Estado recuperado

- Repositorio: `/workspace/mesbg-list-builder-v2024`.
- Rama: `feature/traduccion-es`; no modificar `main`.
- Última versión funcional antes de esta revisión: `9189aee38bad929c87aa58fa9f6b805d63e2ba7c`.
- Tras una restauración del entorno, la copia local estaba en `work`, commit
  `06f1056`. Se recuperó `feature/traduccion-es` desde GitHub sin descartar cambios.
- La versión funciona con guardado automático local y cuentas/sincronización
  desactivadas. Mantener `CLOUD_ACCOUNTS_ENABLED = false`.
- Conservar datos guardados, claves JSON, estadísticas, cartas originales,
  restricciones, costes y motor. Una traducción no debe cambiar cálculos ni claves.
- Mantener las cartas españolas configuradas, los originales, exportaciones,
  explicaciones de reglas, PWA, créditos y ajustes móviles ya implementados.
- Leer `AGENTS.md` antes de editar.
- Corrección explícita del usuario: personaje **Helm Mano de Martillo**, habilidad
  **Manomartillo**; magia **Compel → Control**. No unificar el nombre propio y la
  habilidad por compartir la palabra inglesa Hammerhand.

## Referencia accesible y revisión realizada

El PDF superaba el límite de transferencia, pero el usuario aportó después
`MESBG_Codex_TEXTO_SIN_IMAGENES.txt`. El bloqueo está resuelto.

- Texto completo local: `/workspace/mesbg-reference/referencia.txt`.
- Índice de páginas: `/workspace/mesbg-reference/pages.json`.
- Los 11 PDF posteriores están preservados en `/workspace/mesbg-reference/pdfs/`.
- Contraste completo de texto y revisión visual selectiva: `docs/CONTRASTE_PDF_ES.md`.
  Las 825 páginas coinciden con el TXT. Se añaden 17 términos (36 entradas de
  catálogo) y se documentan las aclaraciones posteriores del usuario para Petrificar,
  Control y Protección de los Valar. Sus explicaciones españolas precisan ese
  criterio, sin atribuirlo a una FAQ oficial ni modificar los datos ingleses.
- Informe, alcance y discrepancias: `docs/REVISION_REFERENCIA_ES.md`.
- Glosario contrastado de 89 términos: `docs/glosario-revisado-es.json`.
- 177 entradas de traducción corregidas. Datos originales y motor intactos.
- 24 pruebas de hechos de las FAQ; notas bilingües fechadas para seis reglas de
  movimiento en sus ventanas de explicación.
- No confundir las cinco FAQ identificadas como oficiales de julio de 2026 con
  la FAQ comunitaria española, que aparece duplicada y se declara no oficial.
- El manual extraído tiene columnas desordenadas y el prólogo de perfiles declara
  cambios del traductor. No copiar estadísticas o párrafos sin contrastarlos.

El informe distingue lo comprobado de lo no verificable; no se ha certificado
cada frase del manual ni reescrito todo el sistema de reglas. No incorporar el
TXT completo al repositorio ni al paquete descargable de la aplicación.

La red del entorno limita el acceso a Drive, MEGA y Dropbox. No reintentar el
guardado de configuración rechazado con `INVALID_ARGUMENT`.

## Archivos y pruebas relevantes

- `src/i18n/game-text.ts`, `content/terms.es.json`, `names.es.json`,
  `keywords.es.json`, `armies.es.json`, `profiles.es.json`, `equipment.es.json`.
- Datos fuente: `src/assets/data/army_list_data.json`, `mesbg_data.json`,
  `profile_data.json`, `keywords.json`.
- Cartas: `src/components/common/configured-cards/`.
- `npm run build:standalone`, `npm run check`.
- `npx vitest run src/i18n src/components/common/configured-cards/card-model.test.ts src/components/common/rules --environment node`.
- Pruebas de navegador: `scripts/test-i18n.mjs`, `test-configured-cards.mjs`,
  `test-complete-es.mjs`, `test-mobile-layout.mjs`, `test-pwa.mjs`,
  `test-local-mode.mjs`. Ejecutar según los cambios; sus servidores son acotados.

## Texto de inicio para el nuevo hilo

> Continúa MESBG ES en este mismo entorno. Lee AGENTS.md,
> docs/CONTINUIDAD_REVISION_ES.md y docs/REVISION_REFERENCIA_ES.md en
> /workspace/mesbg-list-builder-v2024. Usa feature/traduccion-es. El TXT ya se leyó
> y está en /workspace/mesbg-reference/referencia.txt. Conserva los avances,
> estadísticas, datos y motor. Revisa los límites documentados antes de afirmar
> que una FAQ o un párrafo están verificados. No repitas la configuración del entorno.
