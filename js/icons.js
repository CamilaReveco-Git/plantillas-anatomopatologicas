/*
 * ILUSTRACIONES DE ÓRGANOS
 * ------------------------
 * Dibujos esquemáticos en SVG (trazo = currentColor, relleno suave), separados
 * de los datos para poder reemplazarlos sin tocar ninguna plantilla.
 *
 * Para cambiar una ilustración: reemplazar el contenido <svg> de su órgano.
 * Para un órgano nuevo: agregar una entrada con el mismo `id` que su archivo de datos.
 * Si un órgano no tiene ilustración se usa `_generico`.
 */
(function (root) {
  var open = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" ' +
    'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">';
  var soft = 'fill="currentColor" fill-opacity=".14"';

  root.ORGAN_ICONS = {
    // Vesícula biliar: saco piriforme con conducto cístico
    vesicula: open +
      '<path ' + soft + ' d="M31 58c-9 0-14-6-13-15 1-8 6-14 9-20 1.6-3.2 2.6-6 3-9h6c.2 3.4 1.2 6.4 3 9.6 3.4 6 8 11.6 8 19.4 0 9-6 15-16 15z"/>' +
      '<path d="M30 14c0-4 2-7 6-8.4 3-1 6.4-.8 9 .4"/>' +
      '<path d="M45 6c3 1.6 5 4.4 5.6 8"/>' +
      '<path d="M25 44c3 2.4 9 2.8 13 .4" stroke-opacity=".55"/>' +
      '</svg>',

    // Estómago: forma de "J" con esófago y píloro
    estomago: open +
      '<path ' + soft + ' d="M22 5v11c0 5-6 8-7.6 16C12.6 44 20 56 33 56c11 0 19-7 19-16 0-5 3-7 6.6-7.6V26c-5 .4-9 2.6-11 6.4-1.8-2.4-4.8-3.6-8-3.2-4.8.6-6.6 4.6-9.6 3.4C27 31.4 28 25 28 19V5"/>' +
      '<path d="M24 40c4 5 12 6 18 2" stroke-opacity=".55"/>' +
      '</svg>',

    // Apéndice: ciego con íleon y apéndice vermiforme
    apendice: open +
      '<path ' + soft + ' d="M30 8c10 0 17 7 17 16 0 7-4 12-10 14-4 1.4-8 1-11-1-5-3-8-8-7.6-14C19 15 23 8 30 8z"/>' +
      '<path d="M4 22c6-2 11-1 15 1.6"/>' +
      '<path d="M4 28c6-1.4 10-.6 14 1.6"/>' +
      '<path d="M33 38.6c.4 5-1.4 9-5 12-3 2.6-3.8 6.6-1.4 9"/>' +
      '<path d="M38 38c.6 5.6-1.2 10-5 13.6-2 2-2.4 4.6-.8 6.6"/>' +
      '</svg>',

    // Tiroides: dos lóbulos unidos por el istmo, delante de la tráquea
    tiroides: open +
      '<path d="M27 4v56M37 4v56" stroke-opacity=".45"/>' +
      '<path d="M27 12h10M27 20h10M27 44h10M27 52h10" stroke-opacity=".3"/>' +
      '<path ' + soft + ' d="M26 32c-1-9-4-18-9-20-5-1.6-8 4-8 13 0 11 3.6 19 9 21 4 1.4 7-2 8-6 2 1.4 4 2 6 2s4-.6 6-2c1 4 4 7.4 8 6 5.4-2 9-10 9-21 0-9-3-14.6-8-13-5 2-8 11-9 20-2 1.6-4 2.2-6 2.2s-4-.6-6-2.2z"/>' +
      '</svg>',

    // Genérico (órganos sin ilustración propia)
    _generico: open +
      '<path ' + soft + ' d="M32 8c13 0 22 9 22 22 0 15-10 26-22 26S10 45 10 30C10 17 19 8 32 8z"/>' +
      '<path d="M22 30c4-6 16-6 20 0" stroke-opacity=".55"/>' +
      '</svg>',
  };

  root.organIcon = function (organId) {
    return root.ORGAN_ICONS[organId] || root.ORGAN_ICONS._generico;
  };
})(this);
