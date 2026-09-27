/*
 * BUSCADOR SECUNDARIO
 * Ignora mayúsculas y tildes; acepta palabras parciales (todas deben aparecer).
 * Busca en etiquetas de la ruta, títulos/variantes de plantilla y líneas de diagnóstico.
 */
(function (root) {
  function normalize(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  // entries: Tree.searchEntries(...). Devuelve [{path, catLabel, titulo, score}] por relevancia.
  function search(entries, query) {
    var terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var results = [];
    entries.forEach(function (e) {
      var names = normalize(e.names);
      var body = normalize(e.body);
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        if (names.indexOf(terms[i]) !== -1) score += 2;
        else if (body.indexOf(terms[i]) !== -1) score += 1;
        else return;
      }
      results.push({ path: e.path, catLabel: e.catLabel, titulo: e.titulo, score: score });
    });
    return results.sort(function (a, b) { return b.score - a.score; });
  }

  root.Search = { search: search, normalize: normalize };
})(this);
