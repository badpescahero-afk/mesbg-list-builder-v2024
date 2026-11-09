# Cartas españolas con equipo elegido

La descarga de cartas ofrece dos alternativas: **Cartas ES con equipo elegido**
y **Cartas originales**. La primera usa una maquetación de texto basada en las
cinco referencias suministradas: pergamino claro, títulos granates, retrato
circular, tabla de atributos y perfiles adicionales separados. Los JPG y la
ruta de descarga originales se conservan.

Al abrir la carta de una miniatura ya seleccionada en una lista, la vista española
muestra su configuración. El botón «Ver carta original» permite consultar el JPG.
Las consultas sin una selección de lista muestran una carta española de referencia,
sin un coste configurado. La biblioteca `/cards` permite consultar los 535 perfiles
del catálogo. Los perfiles anidados aparecen dentro de su carta principal.
La opción de ver el JPG original sigue disponible.

## Datos de la lista

- Coste por miniatura desde `pointsPerUnit`, conservando el número de miniaturas
  como dato separado. No se usa el coste total de un grupo como precio individual.
- Opciones efectivamente elegidas, incluidas las gratuitas y obligatorias.
- Atributos derivados con el transformador de perfiles existente. Los
  modificadores de guerreros se muestran en la fila principal de su configuración.
- Equipo base y opciones aplicadas aparecen separados, para expresar también los
  cambios de armadura, arma o escudo sin afirmar que el equipo sustituido siga activo.
- Monturas y pasajeros disponibles en los datos se muestran como perfiles
  separados. Los tipos combinados de opción resuelven la referencia explícita
  `mount_name`; no se calculan bonificaciones nuevas.
- Los efectos condicionales de combate se consultan en las reglas. No se suman
  automáticamente efectos como cargar, combatir contra un enemigo concreto o
  formar un muro de escudos.

Las cifras de las referencias visuales no sustituyen los datos actuales. Por
ejemplo, Minas Tirith incluye a Faramir por 100 puntos con la sustitución de
armadura incluida. Con caballo y escudo, la carta muestra 125 puntos y D 7,
según los datos del constructor. Boromir con caballo y escudo muestra 185 puntos
y D 7. El Guerrero con escudo muestra 9 puntos y D 6; con escudo y lanza,
10 puntos y D 6. El Caballero con cambio a estandarte muestra 40 puntos y D 5.

Los nombres de presentación de todos los perfiles actuales y sus perfiles anidados
están recogidos en `src/i18n/content/names.es.json`. Se conservan las cinco referencias
aprobadas y los nombres propios que no necesitan traducción. Las nuevas traducciones
son editoriales, sin atribuirles carácter oficial. La búsqueda admite el nombre
español y el canónico. Las reglas, habilidades y equipo utilizan los catálogos españoles ya
existentes. Las abreviaturas y valores de atributos se conservan.

## Exportación e integridad

Una carta por configuración distinta. Las configuraciones idénticas se agrupan
sumando su cantidad; dos configuraciones con distinto equipo no se sobrescriben.
El ZIP contiene PNG de 2560 píxeles de ancho, con nombres numerados. Para los
perfiles largos, la altura crece para conservar el texto completo.

La exportación trabaja sobre copias de los datos. El transformador recibe una
copia de perfil, aislando también la asignación histórica de Attacks en los
Nazgûl. Su uso predeterminado para el PDF mantiene el comportamiento existente.
No se reescriben listas, identificadores, reglas ni datos originales.

Si falta un perfil, la interfaz identifica las entradas que faltan y permite
consultar las cartas originales. Si falla la generación, conserva el diálogo y
la lista para poder reintentar. Los nodos temporales de captura se eliminan al
terminar, también ante errores.

## Comprobaciones

```sh
npm run build
npm run check
npx vitest run src/i18n src/components/common/configured-cards/card-model.test.ts --environment node
node scripts/test-i18n.mjs
node scripts/test-configured-cards.mjs
```

La prueba nueva de navegador crea una lista de Minas Tirith mediante la interfaz,
elige equipo para Boromir y dos Guerreros, comprueba coste, D, montura y retrato,
verifica el acceso a la carta original y descarga el ZIP real. Lee los tres PNG
para comprobar formato y resolución, y compara el almacenamiento de la lista
antes y después. Cada script arranca su propio Vite acotado, registra sus errores
y lo detiene en `finally`; utilizan los puertos 5197 y 5198 respectivamente.

## Consulta interactiva y móvil

Los nombres subrayados con ⓘ abren la explicación traducida de reglas especiales,
magias y acciones heroicas. Se incluyen las reglas propias del perfil, sin buscar
una descripción homónima en otro perfil. Funcionan mediante clic, toque, Enter y
Espacio; Escape cierra el diálogo y devuelve el foco. La base de datos, las cartas,
el modo partida y la vista previa del PDF utilizan esta consulta.

Las capturas PNG desactivan estos controles y la impresión oculta el marcado.
En móvil las cartas de consulta usan texto legible y una columna. Las exportaciones
mantienen el diseño de referencia a 2560 píxeles de ancho; su altura crece según
el texto y los perfiles adicionales.

El resolver reconoce variantes presentes en los datos (`Dominant(4)`, `Hated (Orc)`,
`Throw Stones (...).`) solo para consultar la explicación correspondiente. No
reescribe sus claves ni añade reglas. Las referencias sin configuración muestran
`*` cuando los recursos heroicos tienen diferentes valores en distintas entradas.

La descarga muestra el progreso y permite cancelar. Una captura ya iniciada termina
antes de abandonar el lote; no se entrega un ZIP parcial. La memoria crece con las
imágenes del ZIP, no con todas las combinaciones posibles de equipo.

## Validación ampliada

- 535 cartas de referencia y 1.276 selecciones base renderizadas en navegador.
- Todas las opciones individuales preparadas con el calculador original y comprobación
  de que listas, IDs y catálogos no cambian. Esto no sustituye las restricciones del
  constructor ni implica probar cada combinación de opciones posible.
- Reglas generales y poderes de todo el catálogo resueltos, incluidos perfiles anidados.
- Consultas reales de Gandalf, Boromir, Smaug, Shank y Wrot, familia de Bardo,
  Rey Brujo, mûmak, carro, guardianes de las cámaras y equipo de demolición.
- Escritorio, pantalla de 390 × 844 y teclado. Una descarga de 23 cartas variadas
  produjo 79.514.691 bytes en 33,1 segundos en este entorno; no es una garantía de
  rendimiento para todos los dispositivos. Los nodos temporales quedaron eliminados.
- ZIP español con PNG válidos y ZIP original con JPG válidos también comprobados
  contra la compilación autónoma servida en el puerto 4173.

```sh
npx vitest run src/i18n src/components/common/configured-cards/card-model.test.ts src/components/common/rules --environment node
node scripts/test-complete-es.mjs
# Contra una vista previa ya iniciada, sin arrancar otro Vite:
MESBG_TEST_URL=http://127.0.0.1:4173 node scripts/test-configured-cards.mjs
```
