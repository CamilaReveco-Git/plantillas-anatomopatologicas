/*
 * BUSCADOR SECUNDARIO
 * Ignora mayúsculas y tildes; acepta palabras parciales (todas deben aparecer).
 * Busca en etiquetas de categoría, títulos/variantes de plantilla y líneas de diagnóstico.
 */
(function (root) {
  function normalize(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  // Devuelve [{categoria, templateId, titulo, score}] ordenado por relevancia.
  function search(organ, query) {
    var terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var results = [];
    organ.categorias.forEach(function (cat) {
      cat.templates.forEach(function (tid) {
        var t = organ.templates[tid];
        var names = normalize([cat.label, t.titulo, t.variantLabel || ""].join(" "));
        var body = normalize(t.diagnostico.join(" "));
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          if (names.indexOf(terms[i]) !== -1) score += 2;
          else if (body.indexOf(terms[i]) !== -1) score += 1;
          else return;
        }
        results.push({ categoria: cat, templateId: tid, titulo: t.titulo, score: score });
      });
    });
    return results.sort(function (a, b) { return b.score - a.score; });
  }

  root.Search = { search: search, normalize: normalize };
})(this);
