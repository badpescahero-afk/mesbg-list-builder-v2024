# Tablas de consulta en español

11 de noviembre de 2026. Estas tablas son distintas de las tablas de atributos
traducidas en la entrega anterior.

Se han cotejado visualmente las diez imágenes originales de
`static-resources/images/charts/`. Sus traducciones de presentación están en
`src/i18n/content/charts.es.json`. Se conservan los PNG originales para el modo
inglés. La tabla para herir mantiene su matriz original de 100 resultados y
traduce sus ejes Fuerza y Defensa.

Las tablas españolas conservan la estructura de columnas, títulos granates,
fondo de papel claro y filas alternas de las originales. Se representan como
texto seleccionable que se adapta al ancho de pantalla; no dependen de imágenes
nuevas ni de servicios externos.

La referencia aportada orienta el vocabulario (reglamento traducido: obstáculos
p. 33, huecos p. 34, escalada p. 35, proyectiles p. 108, natación p. 134,
centinelas p. 137, dispersión p. 142 y puertas p. 146). Se conserva el contenido
mecánico de las imágenes inglesas: rangos de dados, distancias, heridas,
condiciones de carga, control del centinela y restricciones tras una caída.

Se distingue saltar obstáculos (`jump-table`) de saltar huecos (`leap-table`),
antes etiquetados de forma confusa. La referencia de página 33 en el resultado
fallido de salto de huecos corresponde al reglamento original, como se indica
expresamente. La fila de 8 pulgadas y Fuerza 3 es «Lanza arrojadiza», como en
la imagen inglesa, no «Arrojar Piedras», errata del texto de referencia.

Validación: `reference-charts.test.ts` contrasta cobertura, intervalos de dados y
los valores de las 15 armas y 7 puertas. `scripts/test-reference-charts.mjs`
abre las 11 tablas, comprueba móvil/escritorio, alternancia de filas, acceso a
la última fila, cambio de idioma y conservación de la matriz para herir y del
almacenamiento local. El servidor de comprobación se detiene al terminar.
