/*
 * REGISTRO DE ÓRGANOS
 * -------------------
 * Cada órgano vive en su propio archivo dentro de /data y se registra
 * llamando a PLANTILLAS.registerOrgan({...}).
 *
 * Para agregar un órgano nuevo:
 *   1. Crear data/<organo>.js con la misma estructura que data/vesicula.js
 *      (id, nombre, theme, categorias, templates).
 *   2. Agregar <script src="data/<organo>.js"></script> en index.html,
 *      después de este archivo.
 * No es necesario tocar la interfaz ni el ensamblador.
 */
window.PLANTILLAS = {
  organs: [],
  registerOrgan: function (organ) {
    this.organs.push(organ);
  },
};
