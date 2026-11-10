# Revisión de la referencia española y FAQ

Fecha: 10 de noviembre de 2026. Rama: `feature/traduccion-es`.

Este informe describe la revisión inicial del TXT. La entrega posterior de los
once PDF se contrasta en [CONTRASTE_PDF_ES.md](CONTRASTE_PDF_ES.md), con 17 términos
adicionales y discrepancias confirmadas visualmente. El glosario compartido
contiene ahora 89 entradas.

## Fuente y alcance verificable

Referencia recibida: `MESBG_Codex_TEXTO_SIN_IMAGENES.txt`, 2.100.958 bytes.
SHA-256: `840f537397a4068da4e466b4042ad9b69cdf10e80d360e73e5d153957a38ebff`.
El texto completo queda fuera del repositorio público, en
`/workspace/mesbg-reference/referencia.txt`; el índice local de páginas está en
`/workspace/mesbg-reference/pages.json`.

| Documento identificado en el TXT              | Páginas | Tratamiento                                                         |
| --------------------------------------------- | ------: | ------------------------------------------------------------------- |
| MESBG perfiles unidos.pdf                     |     617 | Referencia de nombres y vocabulario; traducción no oficial          |
| Reglamento Traducido Pucela.pdf               |     183 | Referencia terminológica; extracción con columnas desordenadas      |
| faq 1.pdf                                     |       4 | Rules Manual, identificado como comentario oficial de julio de 2026 |
| faq2.pdf                                      |       2 | Matched Play Guide, misma fecha declarada                           |
| faq3.pdf                                      |       3 | Armies of The Hobbit, misma fecha declarada                         |
| faq4.pdf                                      |       4 | Armies of The Lord of the Rings, misma fecha declarada              |
| faq5.pdf                                      |       2 | Armies of Middle-earth, misma fecha declarada                       |
| FAQs & Errata MESBG España - Edición 2024.pdf |       5 | Aclaraciones comunitarias, expresamente no oficiales                |
| Copia 1 de la FAQ comunitaria                 |       5 | Duplicada; no cuenta como segunda fuente                            |

Son 825 páginas marcadas, 820 sin el duplicado. Las fechas y atribuciones se
obtienen del documento aportado: no se ha comprobado en Internet que sean la
última publicación disponible.

El prólogo de perfiles (p. 5) declara que no es una traducción literal y que
algunas páginas fueron modificadas por su autor. Por ello, no se han importado
estadísticas desde el TXT ni sustituido reglas inglesas por párrafos extraídos.
En particular, el manual mezcla encabezados y párrafos de distintas columnas en
las páginas de magia. Protector jurado omite «Coraje» en su explicación española:
se conserva la condición correcta del original, que afecta a pruebas de Coraje,
no a todas las pruebas.

## Correcciones aplicadas

El [glosario revisado](glosario-revisado-es.json) recoge 72 nombres con su clave
canónica, traducción anterior, resultado y página: 42 reglas/magias, 8 ejércitos y
22 perfiles. Se han corregido 177 entradas de los seis catálogos, incluidas las
referencias de esas reglas dentro de otras descripciones y varias duplicaciones
de redacción. No se han añadido ni cambiado claves de los catálogos.

Ejemplos relevantes:

- Expert Shot → **Tirador experto**; Sharpshooter → **Tirador de primera**.
  Antes ambas reglas aparecían como «Tirador certero» pese a tener efectos distintos.
- Bladewrath → **Filos encantados**; Enchant Blades sigue siendo **Encantar espadas**.
- Compel → **Control**; Paralyse → **Petrificar**; Renew → **Sanar**;
  Foil Magic → **Dispersar magia**; Flameburst → **Llamarada**.
- Woodland Creature → **Criatura de la naturaleza**;
  Sworn Protector → **Protector jurado**; Expert Shot no se confunde con Sharpshooter.
- **Exploradores del Bosque Negro**, **Las fuerzas de Isengard**,
  **La Compañía del Anillo**, **Los pozos de Dol Guldur**.
- **Thrydan Matalobos** corrige «Matabobos»; **Frida Lanzalarga**,
  **Olwyn, escudera de Rohan**, **Brórgîr el Hechicero** y **Huargo feroz**.

Criterios de coherencia:

- Se prioriza el manual para los nombres de reglas generales, aunque el libro de
  perfiles use otra variante: por ejemplo, Criatura de la naturaleza/Criatura de los bosques.
  Por indicación posterior del usuario, Burly se presenta como **Corpulento**
  en lugar de «Cachas», de forma coherente con las descripciones de perfiles. Las abreviaturas de los encabezados se
  desarrollan para su lectura, como Habitante de las cavernas y Movimiento rápido.
- Se mantienen «de los Valar» y Coraje en la prosa; el TXT alterna formas y no
  justifica introducir una inconsistencia nueva. Las tablas y abreviaturas
  originales de atributos permanecen intactas.
- «En llamas» sigue describiendo el estado; el nombre de la regla es Incendiar.
  No se sustituyen indiscriminadamente verbos comunes o condiciones.
- El índice de perfiles dice «Sitiadores de Edoras», pero la sección p. 552 dice
  «Sitiadores de Cuernavilla» y corresponde a Hornburg: no se copia el error del índice.

La búsqueda normalizada encontró 430 de los 550 nombres del catálogo anterior en
el TXT. Es una comprobación de coincidencia, no una certificación de significado:
los otros 120 incluyen variantes, subtítulos, dotaciones y monturas. Las
correcciones confirmadas están en el glosario; el resto conserva su traducción.
No se declara revisada palabra por palabra la totalidad de los párrafos del manual.

## Contraste de las erratas

Los datos de juego ya incorporan numerosas correcciones. Se añaden 24 pruebas
contra hechos concretos de las FAQ, además de las pruebas de traducción y cartas.

| Referencia                                 | Resultado comprobado                                                                                                                                                             |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| faq3 p. 2; faq4 p. 3: Gwaihir              | 200 puntos en Águilas, Hombres del Oeste, Compañía de Thorin, Batalla de los Cinco Ejércitos y Alianza de Radagast                                                               |
| faq3 p. 3: Elrond                          | 170 puntos en el Concilio Blanco                                                                                                                                                 |
| faq5 p. 2: Imrahil                         | 140 puntos en Feudos y Dolor de Éomer                                                                                                                                            |
| faq4 p. 3: Jinetes Negros                  | 105 puntos calculados por el motor: 85 de perfil seleccionado + 20 del caballo obligatorio; no se añaden otros 105 a la base                                                     |
| faq3 p. 2; faq4 p. 3; faq5 p. 2: atributos | Guerrero elfo del Bosque Negro S3; Crebain D2/W3; Gûlavhar Mv12                                                                                                                  |
| faq3 p. 2; faq5 p. 2: magia                | Radagast: La ira de la naturaleza 3 pulgadas; Drûzhag: Enfurecer bestias 6 pulgadas y Furia (Bestia) sobre sí mismo                                                              |
| faq4 p. 3: equipo de Rohan                 | Haleth: lanzas arrojadizas 5; Fréaláf sin arco; Guardia Real: caballo y lanzas 7                                                                                                 |
| faq3 p. 2; faq5 p. 2: límites              | Ejército de Thror y Vados del Isen admiten 50 % de armas arrojadizas; Théodred incluye escudo en Vados                                                                           |
| faq4 p. 4: opciones                        | Estandarte/corno 25; con escudo ligero 26 en los perfiles y ejércitos afectados                                                                                                  |
| faq4 p. 3–4: incorporaciones               | Capitán orco de Mordor 45 y Guerrero orco 5 en Gothmog, Legiones de Mordor y Puerta Negra; tamborilero uruk-hai 35 en Fuerzas de Isengard; mûmak 250 y haradrim 6 en Usurpadores |
| faq5 p. 2: chamán de Angmar                | Huargo 20 en las tres listas indicadas                                                                                                                                           |
| faq3 p. 1–2; faq4 p. 1, 3: Legolas         | Ambas descripciones conservan la excepción para disparar trabado sin aliados en el combate; Infantería limita la exención del −1 por mover y disparar                            |

También se comprobaron en los datos las descripciones actualizadas de Gríma,
Merry y Pippin sobre Bárbol, aliento de fuego del Dragón y Tambores en las
profundidades; las restricciones declaradas de Cirith Ungol, Usurpadores de
Edoras y Moria; y la opción de cambiar escudo por tambor en los catafractos (25).
La presencia del texto de una restricción no certifica por sí sola su aplicación
en todas las combinaciones del motor: no se ha reescrito el motor en esta revisión.

**Omisión corregida en la consulta:** faq 1 p. 4 añade que seis reglas pueden
utilizarse por miniaturas que todavía no se encuentran en el campo de batalla.
Ahora sus ventanas de explicación muestran un apartado de errata con fecha, en
ES/EN: Habitante de las cavernas, Volar, Montañero, Marcha espectral, Movimiento
rápido y Criatura de la naturaleza. El texto original permanece separado. Esta
nota se consulta en pantalla; no modifica los JPG ni añade texto a las imágenes
exportadas, cuyos nombres de reglas sí utilizan el glosario revisado.

## Límites y discrepancias que no deben resolverse por suposición

- Las peanas de Ella-Laraña (80 mm, faq4 p. 3) y Huargo feroz (40 mm, faq3 p. 3)
  no tienen un campo equivalente en los perfiles estructurados actuales. No se
  afirma haber actualizado las peanas de los JPG originales.
- Las erratas de escenarios de faq2 p. 2 (Escoltar a los heridos y Lugares de poder)
  y las reglas generales de Monturas, Abrirse paso, Lanzar, Bestias de guerra,
  lanzas y transporte de objetos de faq 1 p. 3–4 no constituyen cálculos del
  constructor. No se ha añadido un simulador de partida ni una biblioteca completa
  de preguntas y respuestas como parte de una revisión terminológica.
- La FAQ comunitaria se distingue de las oficiales. Sus criterios voluntarios no
  reemplazan restricciones originales. Algunas respuestas dependen de diagramas
  ausentes del TXT y no pueden verificarse solo con este archivo.
- Las cartas originales, estadísticas, costes, identificadores, listas guardadas,
  autenticación desactivada y motor permanecen intactos. El documento completo
  no se publica en Git ni se incorpora a la descarga de la aplicación.

## Validación

- Compilación de producción y generación autónoma/PWA.
- 68 pruebas unitarias de traducción, referencias, FAQ, reglas y cartas.
- Recorrido en navegador de 535 perfiles y 1.276 configuraciones base; exportación
  de un ZIP con 23 cartas y comprobación de que los datos fuente no cambian.
- Comprobación móvil de la nota de errata, del nombre Explorador del Bosque Negro
  y de que la ventana cabe en 390 px.
- Pruebas de exportación configurada y de alternancia ES/EN, importación y PDF.
- Formato y ESLint; comparación de claves y cifras de los catálogos antes/después.

La validación local no demuestra que Netlify haya desplegado esta revisión.
