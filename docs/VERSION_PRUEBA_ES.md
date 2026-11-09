# Versión de prueba MESBG ES

## Incluido

Constructor original con sus 109 listas de ejército, datos, restricciones y
1.276 entradas de selección. Interfaz ES/EN, reglas y descripciones traducidas,
biblioteca de 535 perfiles, cartas españolas con equipo, consulta interactiva de
habilidades/magia, importación/exportación JSON, vista imprimible/PDF y descargas
PNG/JPG en ZIP. Los perfiles anidados, monturas y pasajeros se muestran en las
cartas correspondientes. Las estadísticas conservan el idioma y valores originales.

El almacenamiento de listas es local al navegador y al origen de la web. Antes de
cambiar de dirección, exportar las listas a JSON e importarlas en la nueva dirección.
Las funciones originales de cuenta/sincronización y enlaces compartidos dependen de
Firebase y del servidor de la aplicación; no se ha creado ni configurado ese backend.

## Ejecutar desde el repositorio

```sh
npm ci
npm run build:standalone
npm run preview:standalone
```

Abrir `http://localhost:4173/rosters` en la misma máquina. Esta dirección es local;
no es un enlace público. En un entorno en la nube hay que usar su navegador remoto
o la función de previsualización/redirección de puertos, si está disponible.

La compilación autónoma incluye las imágenes originales para no depender del CDN.
Sus aproximadamente 350 MB de recursos se sirven según se necesitan; el navegador
no los descarga todos al abrir la página. Las combinaciones de equipo se generan al
exportar y no se almacenan como copias de imágenes dentro de la aplicación.

## Paquete autónomo

El archivo `mesbg-list-builder-es-preview.zip` preparado en el workspace contiene
la compilación, los recursos y un servidor sin dependencias npm. Descomprimir,
instalar Node.js si no está disponible y ejecutar `INICIAR.cmd` en Windows o
`sh INICIAR.sh` en Linux/macOS. Mantener esa ventana abierta mientras se utiliza
la aplicación y abrir `http://localhost:4173/rosters` en ese ordenador.

## Publicación

El directorio `build/` está listo para un alojamiento estático con fallback de rutas
a `index.html`. El despliegue autónomo actual espera estar en la raíz del dominio.
No se debe subir el repositorio completo ni credenciales como archivos públicos.

En esta sesión el transporte Git permite acceder al repositorio, pero las peticiones
a `https://api.github.com` fallan en el proxy con HTTP 403. No se ha podido configurar
ni verificar un despliegue público. Los workflows originales requieren credenciales
FTP y no se han ejecutado. No se ha modificado main ni la configuración del entorno.

## Validación

`npm run build`, `npm run build:standalone`, `npm run check`, 30 pruebas unitarias,
regresión ES/EN/importación/exportación, exportación real de PNG y JPG, catálogo
completo y consulta mediante ratón, teclado y móvil. Los datos de `src/assets`,
`static-resources`, `data`, `src/state` y `src/types` se conservan.

Los controles y cifras de alcance corresponden al catálogo actual del repositorio,
no a futuras publicaciones. Las pruebas no garantizan cada combinación de lista
posible; el motor original mantiene la validación de esas combinaciones.

## Instalación en móvil

La rama incorpora ahora instalación PWA, icono en la pantalla de inicio y uso sin
conexión del constructor y los perfiles. Las imágenes se guardan al consultarlas
con un máximo de 32 MiB. Véase [INSTALACION_MOVIL.md](INSTALACION_MOVIL.md).
La instalación desde un teléfono sigue pendiente de publicar una URL HTTPS;
el paquete ZIP de escritorio no es un APK.
