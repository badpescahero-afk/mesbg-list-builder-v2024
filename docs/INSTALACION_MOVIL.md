# MESBG ES en la pantalla de inicio

La versión web está preparada como PWA: tiene icono, nombre MESBG ES y una ventana
propia. La instalación móvil necesita una URL pública HTTPS. No es un archivo APK
ni requiere publicar en Google Play. Un APK Android firmado sería otra forma de
empaquetar la aplicación, y no funcionaría en iPhone.

## Instalar

- Android: abrir la URL en Chrome y pulsar **Instalar en este dispositivo**, si el
  navegador ofrece el botón. También se puede usar el menú de Chrome → Añadir a
  pantalla de inicio → Instalar.
- iPhone/iPad: abrir la URL en Safari → Compartir → Añadir a pantalla de inicio.
- Si el enlace está dentro de otra app, abrirlo primero en Chrome o Safari.

El apartado **Instalar app** explica los pasos y muestra cuándo está preparada
para trabajar sin conexión. El icono es el árbol de Gondor que ya incluía el proyecto.

## Sin conexión

Se guardan los archivos de la app, los datos de perfiles y los textos traducidos.
Las listas mantienen el almacenamiento local original. Las imágenes se guardan
conforme se consultan, con un presupuesto de 32 MiB para sus respuestas; las más
antiguas se eliminan cuando hace falta espacio. Las imágenes aún no guardadas
necesitan conexión y pueden mostrar el retrato de sustitución sin ella.

No se descargan de golpe todos los recursos originales. Las respuestas de API,
cuenta/sincronización y servicios externos no se almacenan en la caché. Los recursos
remotos que no permitan una respuesta legible mediante CORS no se guardan; la
compilación autónoma con recursos en el mismo origen permite la caché de imágenes.

Los cambios de versión esperan a que se cierren las ventanas antiguas. La app
no fuerza una recarga mientras se edita una lista. Borrar los datos del sitio o
del navegador puede eliminar las listas locales: se recomienda conservar una copia
JSON, también antes de cambiar de dirección o navegador.

## Comprobación

```sh
npm run build:standalone
node scripts/test-pwa.mjs
```

La prueba revisa manifiesto/iconos y los requisitos de instalación de Chromium,
el flujo del botón, la creación de una lista a 390 × 844, y una recarga con la red
desconectada. Comprueba el retrato guardado, la explicación de una habilidad, la
exportación de una carta a PNG/ZIP y la generación de PDF, sin alterar el JSON de
la lista. La prueba del diálogo de instalación utiliza un evento controlado; no
se afirma haber instalado en un teléfono físico. La instalación en Safari/iOS
necesita su comprobación posterior en un dispositivo real.

## Estado del acceso

La preparación y las pruebas se realizan en la rama `feature/traduccion-es`.
Sigue pendiente un alojamiento HTTPS accesible desde el móvil. La vista previa
local del entorno no sustituye esa publicación y no hay una URL pública verificada.
