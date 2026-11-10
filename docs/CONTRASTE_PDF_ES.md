# Contraste de los once PDF con el TXT y el builder

Fecha: 10 de noviembre de 2026. Continúa la revisión del commit `5a00c3f`.

## Integridad comprobada

Los once archivos se abren y sus textos pueden extraerse. Sus **825 páginas**
coinciden con las 825 entradas del TXT anterior, en el mismo orden, al eliminar
únicamente espacios y saltos de línea. No se normalizaron acentos, cifras ni
signos de puntuación para obtener esta coincidencia. No se detectan páginas de
texto perdidas o distintas entre ambas entregas. Esto no demuestra que todas las
ilustraciones estén presentes o que todos los párrafos sean correctos.

- Partes 01–09: perfiles, páginas 1–617, sin huecos entre los intervalos.
- Parte 10: reglamento, páginas 1–92.
- Parte 11, páginas 1–91: reglamento, páginas originales 93–183.
- Parte 11, páginas 92–106: las cinco FAQ identificadas como oficiales de julio de
  2026, con 4, 2, 3, 4 y 2 páginas respectivamente.
- Parte 11, páginas 107–111 y 112–116: FAQ comunitaria y su duplicado.

El [manifiesto](contraste-pdf-manifest.json) registra nombres, páginas y SHA-256 de
los once archivos. Las copias completas permanecen fuera de Git en
`/workspace/mesbg-reference/pdfs/`. La extracción, el índice y las muestras
renderizadas están en `/workspace/mesbg-reference/pdf-review/`. Ningún PDF ni
imagen del manual se incorpora a la aplicación o al repositorio público.

## Comprobación visual y correcciones

Se renderizaron y revisaron las páginas de magia 117–121 y las de reglas 125,
126, 129–132 del reglamento. La distribución por columnas permite confirmar la
asociación de encabezados y efectos: Llamar a los vientos desplaza D3+3 pulgadas;
Aura de consternación afecta al Coraje; Sanar recupera una Herida; Aura aterradora
concede Terror; Inmovilizar impide actuar hasta la fase final. Las explicaciones
del builder ya conservaban estas asociaciones. Una prueba específica protege
estos casos frente a una futura importación que mezcle las columnas.

De los 72 nombres del glosario anterior, 69 coinciden con el texto normalizado de
la página citada. Los otros tres son formas desarrolladas de encabezados:
«EXTERMINADORA»/Armas exterminadoras, «HABIT.CAVERNAS»/Habitante de las cavernas y
«MOV. RÁPIDO»/Movimiento rápido. Las imágenes de las páginas 125, 126 y 130
confirman esas correspondencias; no se consideran reglas diferentes.

Se añaden **17 nombres de presentación** al glosario, con el PDF concreto y su
página local además de la página original. Afectan a **36 entradas** de nombres,
equipo y descripciones. El glosario acumula ahora **89 entradas**.

| Clave original conservada               | Presentación revisada                      | Página original de perfiles |
| --------------------------------------- | ------------------------------------------ | --------------------------: |
| Armoured horse                          | Caballo con barda                          |                          64 |
| Feralof                                 | Felaróf                                    |                          78 |
| Helm Hammerhand                         | Helm Manomartillo                          |                          64 |
| Helm Hammerhand, King of Rohan          | Helm Manomartillo, rey de Rohan            |                          64 |
| Helm Hammerhand, Wraith of the Hornburg | Helm Manomartillo, espectro de Cuernavilla |                          70 |
| Grim Hammer Captain                     | Capitán Martillo Siniestro                 |                         181 |
| Grim Hammer Warrior                     | Guerrero Martillo Siniestro                |                         269 |
| Vault Warden Team                       | Equipo de Guardia de la Cámara             |                         205 |
| Foe Spear Wielder                       | Lancero de Cámara                          |                         205 |
| Iron Shield Bearer                      | Escudero de Cámara                         |                         205 |
| Foe Spear                               | Lanza de Cámara                            |                         205 |
| Iron Shield                             | Escudo torreón                             |                         205 |
| Thrain the Broken                       | Thráin el Atormentado                      |                          54 |
| Samwise the Brave                       | Samsagaz el Bravo                          |                          23 |

También se armonizan las opciones **Pies de Fuego con barda** (p. 59),
**Crinblanca con barda** (p. 57) y la variante plural **Guerreros Martillo
Siniestro** (composición, p. 269). Sus claves originales también se conservan.

La página 78 contiene «Felaróf» en el equipo y «FÉLAROF» en el encabezado de la
montura: se adopta la primera grafía sin modificar la clave `Feralof`. El perfil
de Martillo Siniestro de la p. 181 usa un título abreviado; la composición de la
p. 269 identifica explícitamente al Guerrero. La página 205 distingue visualmente
los dos integrantes del equipo y sus armas. Los nombres se aplican también a las
opciones de equipo, evitando que otro catálogo sobrescriba la traducción.

## Discrepancias que siguen requiriendo una fuente normativa

1. **Protector jurado**, reglamento p. 131: la imagen también omite «Coraje» y dice
   todas las pruebas. No es un fallo de extracción. El builder mantiene las
   pruebas de Coraje que especifica el original inglés.
2. **Petrificar**, reglamento p. 119: el PDF impide efectuar golpes o levantarse si
   la miniatura **gana** el duelo. El texto inglés de `keywords.json` dice
   **loses**, y su traducción actual dice **pierde**. Se registra la contradicción;
   no se cambia una condición de juego apoyándose únicamente en una traducción
   no oficial. Las FAQ aportadas hablan de pasar un estandarte, pero no resuelven
   esta diferencia concreta. Para cerrarla se necesita la regla inglesa vigente
   o una errata explícita que determine la condición.
3. **Control**, reglamento p. 118: la versión española enumera «tumbarlo» entre
   las prohibiciones; el inglés del repositorio enumera permitir u obligar a
   desmontar. El builder conserva la formulación inglesa. No se ha inferido una
   condición nueva del párrafo traducido.
4. **Protección de los Valar**, reglamento p. 120: el PDF explicita que el −1 para
   impactar se aplica al disparo. La descripción inglesa del repositorio omite
   esa precisión, y la traducción sigue su alcance. Se documenta sin modificar el
   original ni extender por cuenta propia la aplicación de la regla.
5. **Diagramas de la FAQ comunitaria**: las páginas 108–111 de la parte 11 fueron
   renderizadas. Son tablas, enlaces y páginas vacías o casi vacías; los casos que
   remiten a fotos externas no contienen esas fotos incrustadas. Recibir el PDF
   no resuelve esta ausencia. Sus criterios siguen siendo comunitarios, no erratas
   oficiales. No se han seguido enlaces ni enviado consultas a terceros.

MuPDF emitió avisos sobre algunos recursos gráficos de la parte 11. La extracción
completa y el renderizado de las muestras utilizadas terminaron, pero no se
certifica la integridad gráfica de todos sus recursos. Las cifras y reglas de los
perfiles españoles no se han importado al motor ni a las cartas originales.

## Validación y alcance

- 69 pruebas unitarias, incluidas las 89 entradas del glosario, los hechos de las
  FAQ y los límites entre efectos mágicos de columnas distintas.
- Compilación de producción mediante `npm run build:standalone`, que ejecuta
  `npm run build`, más formato y ESLint.
- Pruebas de navegador ES/EN, persistencia, importación/exportación JSON y PDF;
  cartas configuradas, ZIP y acceso a los JPG originales.
- Recorrido completo de 535 perfiles y 1.276 configuraciones base; ZIP de 23
  cartas exportado correctamente, sin mutar los datos ni dejar nodos temporales.
- Comparación de claves y secuencias numéricas de los seis catálogos contra el
  commit anterior; datos originales, estadísticas y motor sin modificaciones.

El contraste textual abarca las 825 páginas; la inspección visual es selectiva y
está descrita arriba. No equivale a una revisión normativa de cada frase del
manual ni demuestra que Netlify haya desplegado estos cambios.
