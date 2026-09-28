/*
 * BUSCADOR GLOBAL
 * Busca en todos los órganos: nombre del órgano, categorías, subcategorías,
 * nombres de botón y el texto de las plantillas (micro, diagnóstico y fragmentos
 * de sus opciones). Ignora mayúsculas y tildes; acepta palabras parciales
 * (todas deben aparecer). Solo lee los datos: no modifica nada.
 */
(function (root) {
  // Quita tildes carácter por carácter (mantiene el largo → sirve para recortar fragmentos).
  function normalize(s) {
    var out = "";
    for (var i = 0; i < s.length; i++) {
      out += s[i].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().charAt(0) || s[i];
    }
    return out;
  }

  function templateText(t) {
    var parts = [t.micro].concat(t.diagnostico);
    (t.modifiers || []).forEach(function (m) {
      if (m.microAppend) parts.push(m.microAppend);
      if (m.dxAppend) parts = parts.concat(m.dxAppend);
      if (m.dxReplace) parts.push(m.dxReplace.replace);
    });
    return parts.filter(Boolean).join(" · ");
  }

  // Un índice con una entrada por órgano y por cada nodo del árbol (categoría,
  // subcategoría, botón) y por cada opción de los nodos combinables.
  function buildIndex(organs, Tree) {
    var index = [];
    organs.forEach(function (organ) {
      index.push({ organ: organ, path: [], axes: null, labels: [], names: organ.nombre, body: "" });
      function add(trail, extra) {
        var labels = trail.map(function (n) { return n.crumb || n.label; });
        var helpers = trail.reduce(function (a, n) { return a.concat(n.lines || [], n.summary ? [n.summary] : []); }, []);
        index.push({
          organ: organ,
          path: trail.map(function (n) { return n.id; }),
          axes: extra.axes || null,
          labels: labels.concat(extra.labels || []),
          names: [organ.nombre].concat(labels, helpers, extra.labels || [], extra.names || []).join(" "),
          body: extra.body || "",
        });
      }
      function walk(node, trail) {
        if (node.kind === "leaf") {
          var t = organ.templates[node.template];
          add(trail, { names: [t.titulo, t.variantLabel || ""], body: templateText(t) });
        } else if (node.kind === "combine") {
          add(trail, {});
          node.axes.forEach(function (ax) {
            ax.options.forEach(function (o) {
              var sel = {};
              sel[ax.id] = o.id;
              add(trail, { axes: sel, labels: [o.label], body: [o.micro || ""].concat(o.diagnostico || []).filter(Boolean).join(" · ") });
            });
          });
        } else {
          add(trail, {});
          Tree.childrenOf(node).forEach(function (c) { walk(c, trail.concat(c)); });
        }
      }
      Tree.build(organ).forEach(function (r) { walk(r, [r]); });
    });
    index.forEach(function (e) {
      e.nNames = normalize(e.names);
      e.nBody = normalize(e.body);
      e.nLast = normalize(e.labels.length ? e.labels[e.labels.length - 1] : e.organ.nombre);
    });
    return index;
  }

  function snippet(entry, term) {
    var i = entry.nBody.indexOf(term);
    if (i === -1) return null;
    var a = Math.max(0, i - 40), b = Math.min(entry.body.length, i + term.length + 50);
    return (a ? "…" : "") + entry.body.slice(a, b).trim() + (b < entry.body.length ? "…" : "");
  }

  // Devuelve [{entry, score, snippet}] por relevancia (el orden de los datos desempata).
  function search(index, query) {
    var q = normalize(query).trim();
    var terms = q.split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var results = [];
    index.forEach(function (e, pos) {
      var score = 0, bodyTerm = null;
      for (var i = 0; i < terms.length; i++) {
        if (e.nNames.indexOf(terms[i]) !== -1) score += 2;
        else if (e.nBody.indexOf(terms[i]) !== -1) { score += 1; bodyTerm = bodyTerm || terms[i]; }
        else return;
      }
      if (e.nLast === q) score += 3; // coincidencia exacta con el nombre del botón/categoría
      results.push({ entry: e, score: score, pos: pos, snippet: bodyTerm ? snippet(e, bodyTerm) : null });
    });
    return results.sort(function (a, b) { return b.score - a.score || a.pos - b.pos; });
  }

  root.Search = { buildIndex: buildIndex, search: search, normalize: normalize };
})(this);
