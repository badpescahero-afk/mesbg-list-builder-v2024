# Cartas españolas con equipo elegido

La descarga de cartas ofrece dos alternativas: **Cartas ES con equipo elegido**
y **Cartas originales**. La primera usa una maquetación de texto basada en las
cinco referencias suministradas: pergamino claro, títulos granates, retrato
circular, tabla de atributos y perfiles adicionales separados. Los JPG y la
ruta de descarga originales se conservan.

Al abrir la carta de una miniatura ya seleccionada en una lista, la vista española
muestra su configuración. El botón «Ver carta original» permite consultar el JPG.
Las consultas de perfiles sin una selección de lista siguen mostrando la carta
original: no se inventa una configuración de equipo para una consulta genérica.

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

Se han incorporado los nombres españoles de las cinco referencias. Otros nombres
mantienen la denominación canónica cuando no tienen una traducción de nombre
aprobada. Las reglas, habilidades y equipo utilizan los catálogos españoles ya
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
