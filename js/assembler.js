/*
 * ENSAMBLADOR DETERMINISTA
 * ------------------------
 * No genera lenguaje. Solo toma los textos de la plantilla y:
 *   1. sustituye líneas del diagnóstico (dxReplace de cada opción activa);
 *   2. agrega fragmentos de micro al final del mismo párrafo (punto seguido);
 *   3. agrega líneas de diagnóstico al final;
 *   4. reemplaza marcadores {campo} por lo que escribió el usuario, literal,
 *      o por "___" si el campo está vacío.
 * Función pura: sin acceso al DOM (se puede probar aislada).
 */
(function (root) {
  var EMPTY = "___";

  function fill(text, values) {
    return text.replace(/\{(\w+)\}/g, function (_, id) {
      var v = values[id];
      return v == null || v.trim() === "" ? EMPTY : v;
    });
  }

  // activeIds: array de ids de opciones activas. values: {campoId: texto}.
  function assemble(template, activeIds, values) {
    values = values || {};
    var active = (template.modifiers || []).filter(function (m) {
      return activeIds.indexOf(m.id) !== -1;
    });

    var micro = template.micro;
    var dx = template.diagnostico.slice();

    active.forEach(function (m) {
      if (m.dxReplace) {
        dx = dx.map(function (line) {
          return line === m.dxReplace.find ? m.dxReplace.replace : line;
        });
      }
    });
    active.forEach(function (m) {
      if (m.microAppend) micro = micro + " " + m.microAppend;
      if (m.dxAppend) dx = dx.concat(m.dxAppend);
    });

    return {
      micro: fill(micro, values),
      diagnostico: dx.map(function (l) { return fill(l, values); }).join("\n"),
    };
  }

  // Texto que copia "COPIAR TODO": micro, línea en blanco, diagnóstico. Sin títulos.
  // Si un cuadro está vacío (p. ej. plantilla sin micro) se copia solo el otro.
  function joinForCopy(micro, diagnostico) {
    return [micro, diagnostico]
      .map(function (s) { return s.replace(/\s+$/, ""); })
      .filter(function (s) { return s.trim() !== ""; })
      .join("\n\n");
  }

  var api = { assemble: assemble, joinForCopy: joinForCopy, EMPTY: EMPTY };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Assembler = api;
})(this);
