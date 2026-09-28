/*
 * ÁRBOL DE NAVEGACIÓN
 * -------------------
 * Convierte las categorías de un órgano en un árbol de nodos de profundidad libre:
 *   leaf    → { template }                 muestra MICRO + DIAGNÓSTICO
 *   menu    → { children | sections }      despliega tarjetas (con o sin subtítulos)
 *   combine → { combine: [ejes] }          elige una opción por eje (p. ej. diagnóstico + micro)
 *
 * Formato antiguo (Vesícula, Estómago, Apéndice): categoría con `templates: [ids]`.
 * Se adapta automáticamente: 1 plantilla → hoja; varias (o showVariants) → menú de variantes.
 * Sin acceso al DOM (se puede probar aislado).
 */
(function (root) {
  function plural(n, one, many) {
    return n + " " + (n === 1 ? one : many);
  }

  function excerpt(text) {
    return text.length > 90 ? text.slice(0, 90).replace(/\s+\S*$/, "") + "…" : text;
  }

  // ---- adaptación del formato antiguo ----
  function fromLegacy(cat, organ) {
    var multi = !!cat.showVariants || cat.templates.length > 1;
    if (!multi) {
      return { id: cat.id, label: cat.label, kind: "leaf", template: cat.templates[0], hint: null, legacy: true };
    }
    return {
      id: cat.id,
      label: cat.label,
      kind: "menu",
      legacy: true,
      hint: plural(cat.templates.length, "variante", "variantes") + " ▾",
      sections: [{
        label: null,
        children: cat.templates.map(function (tid) {
          var t = organ.templates[tid];
          return { id: tid, label: t.variantLabel || t.titulo, kind: "leaf", template: tid, hint: excerpt(t.micro) };
        }),
      }],
    };
  }

  // ---- formato de árbol ----
  function fromNode(n) {
    var node = { id: n.id, label: n.label, tone: n.tone || null };
    // Ayudas visuales opcionales (no forman parte de ninguna plantilla):
    // lines = líneas pequeñas bajo el nombre · summary = hallazgos comunes del grupo · crumb = nombre en la ruta
    if (n.lines) node.lines = n.lines;
    if (n.summary) node.summary = n.summary;
    if (n.crumb) node.crumb = n.crumb;
    if (n.template) {
      node.kind = "leaf";
      node.template = n.template;
      node.hint = n.hint || null;
    } else if (n.combine) {
      node.kind = "combine";
      node.axes = n.combine;
      node.hint = n.hint || null;
    } else {
      node.kind = "menu";
      var sections = n.sections || [{ label: null, children: n.children || [] }];
      node.sections = sections.map(function (s) {
        return { label: s.label || null, hint: s.hint ? excerpt(s.hint) : null, children: s.children.map(fromNode) };
      });
      var count = node.sections.reduce(function (a, s) { return a + s.children.length; }, 0);
      node.hint = n.hint || plural(count, "opción", "opciones") + " ▾";
    }
    return node;
  }

  function build(organ) {
    return organ.categorias.map(function (c) {
      return c.templates ? fromLegacy(c, organ) : fromNode(c);
    });
  }

  function childrenOf(node) {
    if (node.kind !== "menu") return [];
    return node.sections.reduce(function (a, s) { return a.concat(s.children); }, []);
  }

  // Nodos a lo largo de una ruta de ids (se detiene en el primer id inválido).
  function resolve(roots, path) {
    var out = [];
    var level = roots;
    for (var i = 0; i < path.length; i++) {
      var n = level.filter(function (x) { return x.id === path[i]; })[0];
      if (!n) break;
      out.push(n);
      level = childrenOf(n);
    }
    return out;
  }

  // Plantilla del último nodo de la ruta (o null si falta elegir algo).
  function templateFor(organ, node, axisSel) {
    if (!node) return null;
    if (node.kind === "leaf") return organ.templates[node.template];
    if (node.kind !== "combine") return null;
    var picked = node.axes.map(function (ax) {
      return ax.options.filter(function (o) { return o.id === (axisSel || {})[ax.id]; })[0];
    });
    if (picked.some(function (o) { return !o; })) return null;
    return {
      titulo: node.label + " — " + picked.map(function (o) { return o.label; }).join(" + "),
      micro: picked.map(function (o) { return o.micro || ""; }).filter(Boolean).join(" "),
      diagnostico: picked.reduce(function (a, o) { return a.concat(o.diagnostico || []); }, []),
      modifiers: [],
    };
  }

  // Entradas buscables: una por hoja y una por nodo combinable, en orden de aparición.
  function searchEntries(organ, roots) {
    var out = [];
    function walk(node, trail) {
      var labels = trail.map(function (n) { return n.label; });
      var path = trail.map(function (n) { return n.id; });
      if (node.kind === "leaf") {
        var t = organ.templates[node.template];
        out.push({
          path: path, catLabel: trail[0].label, titulo: t.titulo,
          names: labels.concat([t.titulo, t.variantLabel || ""]).join(" "),
          body: t.diagnostico.join(" "),
        });
      } else if (node.kind === "combine") {
        var opts = node.axes.reduce(function (a, ax) { return a.concat(ax.options); }, []);
        out.push({
          path: path, catLabel: trail[0].label, titulo: node.label,
          names: labels.concat(opts.map(function (o) { return o.label; })).join(" "),
          body: opts.reduce(function (a, o) { return a.concat(o.diagnostico || []); }, []).join(" "),
        });
      } else {
        childrenOf(node).forEach(function (c) { walk(c, trail.concat(c)); });
      }
    }
    roots.forEach(function (r) { walk(r, [r]); });
    return out;
  }

  var api = { build: build, resolve: resolve, childrenOf: childrenOf, templateFor: templateFor, searchEntries: searchEntries, excerpt: excerpt, plural: plural };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Tree = api;
})(this);
