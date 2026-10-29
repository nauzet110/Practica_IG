# 🌌 Sistema Planetario Interactivo 3D (WebGL & Three.js)

Practica universitaria que implementa un sistema planetario interactivo con iluminacion dinámica, texturizado avanzado y un sistema de renderizado multi-camara, incluye ademas caracteristicas apliadas como la nave pilotable gracias a un panel de control interactivo con gui.

## 🚀 Características Principales

* **Escena Base:**
  * 1 Estrella central emisora de luz (`PointLight` con sombras dinámicas).
  * 5 Planetas orbitando a distintas velocidades relativas.
  * 2 Lunas ancladas para independizar las rotaciones de traslación, giro propio y órbita lunar.
 **Materiales y Iluminación Avanzada:**
  * Uso de `MeshPhongMaterial` para respuesta realista a la luz y habilitación de sombras.
  * **Texturizado múltiple en la Tierra:**
    * `map` (Textura difusa / color base).
    * `bumpMap` y `bumpScale` (Relieve/topografía para montañas).
    * `specularMap` (Brillo diferenciado en océanos).
    * `alphaMap` (Capa independiente de nubes con transparencia y blending aditivo).

---

## ✨ Características Extra

* **Renderizado Multi-Vista (Split-Screen Dinámico):**
  * División de pantalla usando `setViewport` y `setScissor`.
  * **Mitad Izquierda:** Vista general libre controlada mediante `OrbitControls`.
  * **Mitad Derecha:** Vista inmersiva con **selector dinámico**, permitiendo alternar en tiempo real entre:
    * La vista de una **Nave Espacial** viajando por el sistema.
    * La vista subjetiva anclada a la **Tierra** (u otros planetas).
* **Creación y Edición Interactiva (`TransformControls`):**
  * Capacidad de instanciar nuevos planetas o astros en tiempo real mediante la interfaz.
  * Integración del gizmo de transformación (`TransformControls`) para mover, rotar o reubicar cualquier astro seleccionado en el espacio con el ratón.
* **Interfaz Gráfica Autocompleta (`lil-gui`):**
  * Panel de control visual flotante que permite gestionar cámaras, velocidades y la creación/eliminación de objetos sin necesidad de usar la consola o la documentación.


## 🕹️ Cómo Ejecutar el Proyecto

1. Clona este repositorio o descarga los archivos en tu equipo.
2. Abre el archivo `index.html` en tu navegador web.
3. En la vista de la nave debe utilizas WASD para moverse por el sistema planetario 
---

## 👨‍💻 Autoría

* **Autor:** Nauzet Martel Rodríguez
* **Fuentes utilizadas:** https://share.gemini.google/S49L9nQcUEUo
* **Enlace Video:** https://drive.google.com/drive/folders/1cG_CH0ga__Iw68k-fFRgAGTXPvGjp23f?usp=drive_link
