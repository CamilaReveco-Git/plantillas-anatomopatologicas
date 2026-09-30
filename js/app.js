/*
 * INTERFAZ
 * Navegación: Órganos → Categoría → Variante (si hay) → Opciones → Resultado.
 * Profundidad libre: los niveles salen del árbol de Tree (js/tree.js).
 * Barra lateral de órganos, cabecera con ilustración (js/icons.js) y buscador global.
 * No contiene textos médicos: todo sale de data/*.js y de Assembler.
 */
(function () {
  var organs = PLANTILLAS.organs;
  var app = document.getElementById("app");
  var backBtn = document.getElementById("back-organs");
  var sidebarList = document.getElementById("sidebar-list");
  var menuBtn = document.getElementById("menu-btn");
  var backdrop = document.getElementById("backdrop");
  var searchInput = document.getElementById("search");
  var searchResults = document.getElementById("search-results");

  var state = null; // estado del caso actual (null en pantalla de órganos)
  var ui = {}; // referencias a contenedores de la pantalla de órgano
  var pendingNav = null; // destino elegido en el buscador, se aplica al abrir el órgano
  var searchIndex = Search.buildIndex(organs, Tree);

  function newState(organ) {
    return {
      organ: organ,
      roots: Tree.build(organ),
      path: [], // ids de los nodos elegidos, desde la categoría hacia abajo
      axes: {}, // en nodos combinables: {ejeId: opciónId}
      mods: [],
      values: {},
      generated: null, // último texto ensamblado {micro, diagnostico}
    };
  }

  // ---------- utilidades DOM ----------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "style") node.style.cssText = v;
        else if (k.slice(0, 2) === "on") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function card(opts) {
    var classes = "card" + (opts.small ? " card--small" : "") + (opts.selected ? " is-selected" : "");
    return el("button", {
      type: "button",
      class: classes,
      style: opts.tone ? "--tone:" + opts.tone : null,
      "aria-pressed": opts.selected ? "true" : "false",
      onclick: opts.onClick,
    }, [
      el("span", { class: "card-check", "aria-hidden": "true", text: "✓" }),
      el("span", { class: "card-label", text: opts.label }),
    ].concat((opts.lines || []).map(function (l) {
      return el("span", { class: "card-line", text: l });
    })).concat([
      opts.hint ? el("span", { class: "card-hint", text: opts.hint }) : null,
    ]));
  }

  function applyTheme(theme) {
    var s = document.documentElement.style;
    if (!theme) {
      ["--accent", "--accent-soft", "--ink", "--chip-line", "--options-line", "--tray-line"].forEach(function (p) { s.removeProperty(p); });
      return;
    }
    s.setProperty("--accent", theme.accent);
    s.setProperty("--accent-soft", theme.accentSoft);
    s.setProperty("--ink", theme.ink);
    // Opcionales: si el órgano no los define, se usan los valores por defecto del CSS.
    if (theme.chipLine) s.setProperty("--chip-line", theme.chipLine); else s.removeProperty("--chip-line");
    if (theme.optionsLine) s.setProperty("--options-line", theme.optionsLine); else s.removeProperty("--options-line");
    if (theme.trayLine) s.setProperty("--tray-line", theme.trayLine); else s.removeProperty("--tray-line");
  }

  function plural(n, one, many) {
    return n + " " + (n === 1 ? one : many);
  }

  // ---------- routing ----------
  function route() {
    var id = location.hash.replace(/^#\/?/, "");
    var organ = organs.filter(function (o) { return o.id === id; })[0];
    if (organ) showOrgan(organ);
    else showOrgans();
  }

  // ---------- pantalla 1: órganos ----------
  function showOrgans() {
    state = null;
    applyTheme(null);
    backBtn.hidden = true;
    searchInput.value = "";
    closeSearch();
    renderSidebar(null);
    app.innerHTML = "";
    app.appendChild(el("h1", { class: "screen-title", text: "Seleccione un órgano" }));
    var grid = el("div", { class: "grid" });
    organs.forEach(function (o) {
      grid.appendChild(card({
        label: o.nombre,
        hint: plural(o.categorias.length, "categoría", "categorías"),
        tone: o.theme.tones[0],
        onClick: function () { location.hash = "#/" + o.id; },
      }));
    });
    app.appendChild(grid);
  }

  // ---------- pantalla 2: órgano ----------
  function showOrgan(organ) {
    state = newState(organ);
    applyTheme(organ.theme);
    backBtn.hidden = false;
    searchInput.value = "";
    closeSearch();
    renderSidebar(organ.id);

    var nav = pendingNav && pendingNav.organId === organ.id ? pendingNav : null;
    pendingNav = null;
    if (nav) {
      state.path = nav.path.slice();
      state.axes = Object.assign({}, nav.axes);
    }

    app.innerHTML = "";
    app.appendChild(organHeader(organ));
    ui.crumbs = el("nav", { class: "crumbs", "aria-label": "Ruta" });
    ui.grid = el("div", { class: "grid" });
    ui.levels = el("div", { class: "levels" });
    ui.options = el("section", { class: "tray tray--options", hidden: true });
    ui.result = el("section", { class: "result", hidden: true });
    [ui.crumbs, ui.grid, ui.levels, ui.options, ui.result].forEach(function (n) { app.appendChild(n); });
    buildResult();
    renderAll();
    if (nav) revealTarget();
  }

  // Cabecera: ilustración grande + nombre del órgano.
  function organHeader(organ) {
    var art = el("span", { class: "organ-art", style: "--tone:" + organ.theme.tones[0] });
    art.innerHTML = organIcon(organ.id);
    return el("header", { class: "organ-header" }, [art, el("h1", { class: "organ-name", text: organ.nombre })]);
  }

  // ---------- barra lateral ----------
  function renderSidebar(activeId) {
    sidebarList.innerHTML = "";
    organs.forEach(function (o) {
      var icon = el("span", { class: "sidebar-icon" });
      icon.innerHTML = organIcon(o.id);
      var active = o.id === activeId;
      sidebarList.appendChild(el("li", null, [el("button", {
        type: "button",
        class: "sidebar-item" + (active ? " is-active" : ""),
        style: "--tone:" + o.theme.tones[0] + ";--item-accent:" + o.theme.accent,
        "aria-current": active ? "page" : null,
        onclick: function () { closeDrawer(); location.hash = "#/" + o.id; },
      }, [icon, el("span", { class: "sidebar-name", text: o.nombre })])]));
    });
  }

  function openDrawer() {
    document.body.classList.add("drawer-open");
    backdrop.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    document.body.classList.remove("drawer-open");
    backdrop.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
  }
  menuBtn.addEventListener("click", function () {
    if (document.body.classList.contains("drawer-open")) closeDrawer(); else openDrawer();
  });
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  function pathNodes() {
    return Tree.resolve(state.roots, state.path);
  }
  function currentTemplate() {
    var nodes = pathNodes();
    return Tree.templateFor(state.organ, nodes[nodes.length - 1], state.axes);
  }

  // Tono de las tarjetas: el del nodo, el del nivel (theme.levelTones) o el heredado.
  function toneAt(depth, fallback) {
    var lt = state.organ.theme.levelTones;
    return (lt && lt[depth]) || fallback;
  }

  function renderAll() {
    renderCrumbs();
    renderGrid();
    renderLevels();
    renderOptions();
    refreshResult(true);
  }

  function renderCrumbs() {
    var parts = [state.organ.nombre];
    var nodes = pathNodes();
    nodes.forEach(function (n) { parts.push(n.crumb || n.label); });
    var last = nodes[nodes.length - 1];
    if (last && last.kind === "combine") {
      last.axes.forEach(function (ax) {
        ax.options.forEach(function (o) { if (state.axes[ax.id] === o.id) parts.push(o.label); });
      });
    }
    var t = currentTemplate();
    if (t) {
      (t.modifiers || []).forEach(function (m) {
        if (state.mods.indexOf(m.id) !== -1) parts.push("+ " + m.label);
      });
    }
    ui.crumbs.innerHTML = "";
    parts.forEach(function (p, i) {
      if (i) ui.crumbs.appendChild(el("span", { class: "crumb-sep", "aria-hidden": "true", text: "›" }));
      ui.crumbs.appendChild(el("span", { class: "crumb" + (i === parts.length - 1 ? " is-current" : ""), text: p }));
    });
  }

  function renderGrid() {
    var tones = state.organ.theme.tones;
    ui.grid.innerHTML = "";
    state.roots.forEach(function (node, i) {
      ui.grid.appendChild(card({
        label: node.label,
        lines: cardLines(node),
        hint: node.hint,
        tone: node.tone || tones[i % tones.length],
        selected: node.id === state.path[0],
        onClick: function () { selectAt(0, node.id); },
      }));
    });
  }

  // Una bandeja por cada nodo elegido que tenga hijos (menú) u opciones (combinable).
  function renderLevels() {
    ui.levels.innerHTML = "";
    var nodes = pathNodes();
    var tones = state.organ.theme.tones;
    var inherited = tones[Math.max(0, state.roots.indexOf(nodes[0])) % tones.length];
    nodes.forEach(function (node, d) {
      if (node.tone) inherited = node.tone;
      if (node.kind === "menu") ui.levels.appendChild(menuTray(node, d + 1, toneAt(d + 1, inherited)));
      else if (node.kind === "combine") ui.levels.appendChild(combineTray(node));
      inherited = toneAt(d + 1, inherited);
    });
  }

  // Líneas pequeñas de una tarjeta: las propias o, en un grupo, sus hallazgos comunes.
  function cardLines(node) {
    return node.lines || (node.summary ? [node.summary] : null);
  }

  function trayTitle(label, sub) {
    return el("h2", { class: "tray-title" }, [
      el("span", { text: label }),
      sub ? el("span", { class: "tray-sub", text: sub }) : null,
    ]);
  }

  function menuTray(node, depth, tone) {
    var picked = state.path[depth];
    var sub = node.legacy ? (picked ? "variante" : "seleccione variante") : (picked ? null : "seleccione");
    var tray = el("section", { class: "tray" }, [trayTitle(node.label, sub)]);
    if (node.summary) tray.appendChild(el("p", { class: "tray-summary", text: node.summary }));
    node.sections.forEach(function (sec) {
      var box = sec.label ? el("div", { class: "tray-section" }, [
        el("h3", { class: "section-title", text: sec.label }),
        sec.hint ? el("p", { class: "section-hint", text: sec.hint }) : null,
      ]) : tray;
      var row = el("div", { class: "grid grid--variants" });
      sec.children.forEach(function (c) {
        row.appendChild(card({
          small: true,
          label: c.label,
          lines: cardLines(c),
          hint: c.hint,
          tone: c.tone || tone,
          selected: c.id === picked,
          onClick: function () { selectAt(depth, c.id); },
        }));
      });
      box.appendChild(row);
      if (box !== tray) tray.appendChild(box);
    });
    return tray;
  }

  // Nodo combinable: todos los ejes visibles a la vez; una opción por eje.
  function combineTray(node) {
    var done = node.axes.every(function (ax) { return state.axes[ax.id]; });
    var tray = el("section", { class: "tray tray--combine" }, [
      trayTitle(node.label, done ? null : "seleccione " + node.axes.map(function (ax) { return ax.label.toLowerCase(); }).join(" y ")),
    ]);
    var axisTones = state.organ.theme.axisTones || {};
    node.axes.forEach(function (ax) {
      var row = el("div", { class: "grid grid--variants" });
      ax.options.forEach(function (o) {
        row.appendChild(card({
          small: true,
          label: o.label,
          tone: axisTones[ax.tone] || null,
          selected: state.axes[ax.id] === o.id,
          onClick: function () { selectAxis(ax.id, o.id); },
        }));
      });
      tray.appendChild(el("div", { class: "tray-section" }, [el("h3", { class: "section-title", text: ax.label }), row]));
    });
    return tray;
  }

  function renderOptions() {
    var t = currentTemplate();
    ui.options.innerHTML = "";
    var mods = t ? t.modifiers || [] : [];
    var fields = t ? (t.fields || []).slice() : [];
    if (!t || (!mods.length && !fields.length)) { ui.options.hidden = true; return; }
    ui.options.hidden = false;

    if (mods.length) {
      ui.options.appendChild(el("h2", { class: "tray-title", text: t.optionsTitle || "Opciones" }));
      var chips = el("div", { class: "chips" });
      mods.forEach(function (m) {
        var on = state.mods.indexOf(m.id) !== -1;
        chips.appendChild(el("button", {
          type: "button",
          class: "chip" + (on ? " is-on" : ""),
          "aria-pressed": on ? "true" : "false",
          onclick: function () { toggleModifier(m.id); },
        }, [
          el("span", { class: "chip-box", "aria-hidden": "true", text: on ? "✓" : "+" }),
          el("span", { text: m.label }),
        ]));
        if (on && m.fields) fields = fields.concat(m.fields);
      });
      ui.options.appendChild(chips);
    }

    if (fields.length) {
      var box = el("div", { class: "fields" });
      fields.forEach(function (f) {
        var input = el("input", {
          type: "text",
          id: "f-" + f.id,
          autocomplete: "off",
          spellcheck: "false",
          oninput: function (e) {
            state.values[f.id] = e.target.value;
            refreshResult(false);
          },
        });
        input.value = state.values[f.id] || "";
        box.appendChild(el("label", { class: "field", for: "f-" + f.id }, [
          el("span", { class: "field-label", text: f.label }),
          input,
        ]));
      });
      ui.options.appendChild(box);
    }
  }

  // ---------- resultado ----------
  function buildResult() {
    ui.resultTitle = el("h2", { class: "result-title" });
    ui.micro = el("textarea", { id: "out-micro", class: "out", spellcheck: "false", rows: "3" });
    ui.dx = el("textarea", { id: "out-dx", class: "out out--dx", spellcheck: "false", rows: "3" });
    ui.notice = el("p", { class: "notice", role: "status", "aria-live": "polite" });
    ui.copyBtn = el("button", { type: "button", class: "btn btn--primary", onclick: copyAll, text: "Copiar todo" });
    var resetBtn = el("button", { type: "button", class: "btn", onclick: newCase, text: "Nuevo caso" });
    [ui.micro, ui.dx].forEach(function (ta) { ta.addEventListener("input", function () { autosize(ta); }); });

    ui.result.appendChild(ui.resultTitle);
    ui.microLabel = el("label", { class: "out-label", for: "out-micro", text: "Micro" });
    ui.result.appendChild(ui.microLabel);
    ui.result.appendChild(ui.micro);
    ui.result.appendChild(el("label", { class: "out-label", for: "out-dx", text: "Diagnóstico" }));
    ui.result.appendChild(ui.dx);
    ui.result.appendChild(el("div", { class: "actions" }, [ui.copyBtn, resetBtn, ui.notice]));
  }

  // Reconstruye el resultado desde los datos maestros.
  // force=true: nueva plantilla/caso → descarta ediciones manuales.
  // force=false: solo reemplaza el cuadro cuyo texto ensamblado cambió
  //              (así escribir una medida no borra ediciones hechas en la micro).
  function refreshResult(force) {
    var t = currentTemplate();
    if (!t) {
      ui.result.hidden = true;
      ui.micro.value = ui.dx.value = "";
      state.generated = null;
      return;
    }
    var wasHidden = ui.result.hidden;
    ui.result.hidden = false;
    ui.resultTitle.textContent = t.titulo;
    // Plantillas solo con diagnóstico (p. ej. Gastritis): `sinMicro: true` oculta el cuadro MICRO.
    ui.microLabel.hidden = ui.micro.hidden = !!t.sinMicro;

    var out = Assembler.assemble(t, state.mods, state.values);
    var prev = state.generated;
    var lost = [];
    [["micro", ui.micro, "Micro"], ["diagnostico", ui.dx, "Diagnóstico"]].forEach(function (x) {
      var key = x[0], ta = x[1];
      if (force || !prev || prev[key] !== out[key]) {
        if (!force && prev && ta.value !== prev[key]) lost.push(x[2]);
        ta.value = out[key];
      }
      ta.classList.toggle("has-blank", ta.value.indexOf(Assembler.EMPTY) !== -1);
    });
    state.generated = out;
    autosize(ui.micro);
    autosize(ui.dx);
    showNotice(lost.length ? lost.join(" y ") + " reconstruido desde la plantilla (se descartó la edición manual)." : "");

    if (wasHidden) ui.result.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function autosize(ta) {
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + 2 + "px";
  }

  var noticeTimer;
  function showNotice(msg) {
    clearTimeout(noticeTimer);
    ui.notice.textContent = msg;
    if (msg) noticeTimer = setTimeout(function () { ui.notice.textContent = ""; }, 5000);
  }

  // ---------- acciones ----------
  // Elegir un nodo en el nivel `depth` descarta todo lo elegido por debajo.
  function selectAt(depth, id) {
    state.path = state.path.slice(0, depth).concat(id);
    state.axes = {};
    state.mods = [];
    state.values = {};
    renderAll();
  }

  function selectAxis(axisId, optionId) {
    state.axes[axisId] = optionId;
    renderAll();
  }

  function toggleModifier(id) {
    var i = state.mods.indexOf(id);
    if (i === -1) state.mods.push(id);
    else state.mods.splice(i, 1);
    renderCrumbs();
    renderOptions();
    refreshResult(false);
    // Al activar una opción con campos, dejar el cursor en el primero.
    var t = currentTemplate();
    var m = (t.modifiers || []).filter(function (x) { return x.id === id; })[0];
    if (i === -1 && m && m.fields) document.getElementById("f-" + m.fields[0].id).focus();
  }

  function newCase() {
    state = newState(state.organ);
    searchInput.value = "";
    closeSearch();
    renderAll();
    window.scrollTo({ top: 0 });
  }

  function copyAll() {
    var text = Assembler.joinForCopy(ui.micro.value, ui.dx.value);
    var done = function () {
      ui.copyBtn.textContent = "Copiado ✓";
      ui.copyBtn.classList.add("is-done");
      setTimeout(function () {
        ui.copyBtn.textContent = "Copiar todo";
        ui.copyBtn.classList.remove("is-done");
      }, 1500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text) && done(); });
    } else if (fallbackCopy(text)) {
      done();
    }
  }

  function fallbackCopy(text) {
    var ta = el("textarea", { style: "position:fixed;left:-9999px;top:0" });
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (!ok) showNotice("No se pudo copiar automáticamente. Seleccione el texto y use Ctrl/Cmd + C.");
    return ok;
  }

  // ---------- buscador ----------
  var hits = [];
  var active = -1;

  function closeSearch() {
    searchResults.hidden = true;
    searchResults.innerHTML = "";
    hits = [];
    active = -1;
  }

  function renderSearch() {
    hits = Search.search(searchIndex, searchInput.value).slice(0, 12);
    active = hits.length ? 0 : -1;
    searchResults.innerHTML = "";
    if (!searchInput.value.trim()) { searchResults.hidden = true; return; }
    searchResults.hidden = false;
    if (!hits.length) {
      searchResults.appendChild(el("li", { class: "search-empty", text: "Sin resultados" }));
      return;
    }
    hits.forEach(function (h, i) {
      var e = h.entry;
      searchResults.appendChild(el("li", {
        role: "option",
        class: i === active ? "is-active" : null,
        onmousedown: function (ev) { ev.preventDefault(); pickHit(i); },
      }, [
        el("span", { class: "search-cat", style: "--tone:" + e.organ.theme.tones[0] + ";--item-accent:" + e.organ.theme.accent, text: e.organ.nombre }),
        el("span", { class: "search-path", text: e.labels.length ? e.labels.join(" › ") : "Órgano" }),
        h.snippet ? el("span", { class: "search-snippet", text: h.snippet }) : null,
      ]));
    });
  }

  // Abre el órgano del resultado y selecciona su ubicación en el árbol (caso nuevo).
  function pickHit(i) {
    var h = hits[i];
    if (!h) return;
    var e = h.entry;
    pendingNav = { organId: e.organ.id, path: e.path, axes: e.axes || {} };
    searchInput.value = "";
    closeSearch();
    searchInput.blur();
    closeDrawer();
    if (location.hash === "#/" + e.organ.id) route();
    else location.hash = "#/" + e.organ.id;
  }

  // Tras navegar desde el buscador, mostrar la bandeja o el resultado de destino.
  function revealTarget() {
    var target = !ui.result.hidden ? ui.result : ui.levels.lastElementChild;
    if (target) target.scrollIntoView({ block: "nearest" });
  }

  searchInput.addEventListener("input", renderSearch);
  searchInput.addEventListener("blur", function () { setTimeout(closeSearch, 100); });
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { searchInput.value = ""; closeSearch(); searchInput.blur(); return; }
    if (!hits.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      active = (active + (e.key === "ArrowDown" ? 1 : hits.length - 1)) % hits.length;
      Array.prototype.forEach.call(searchResults.children, function (li, i) {
        li.classList.toggle("is-active", i === active);
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      pickHit(active);
    }
  });

  backBtn.addEventListener("click", function () { location.hash = "#/"; });
  window.addEventListener("hashchange", route);
  route();
})();
