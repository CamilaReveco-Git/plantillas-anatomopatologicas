/*
 * APÉNDICE — datos maestros
 * -------------------------
 * Fuente de verdad: textos entregados por el anatomopatólogo (mensaje del 2026-09-27).
 * LOS TEXTOS SE CONSERVAN LITERALMENTE. Diagnósticos en mayúsculas sin tildes, a propósito.
 * Misma estructura que data/vesicula.js (ver comentario allí).
 * micro: "" = la plantilla no tiene micro (no inventar texto).
 */
(function () {
  var templates = {
    profilactica: {
      titulo: "Apendicitis — Profiláctica",
      variantLabel: "Profiláctica",
      micro: "",
      diagnostico: [
        "PROFILACTICA",
        "APENDICE CECAL DENTRO DE LIMITES HISTOLOGICOS NORMALES.",
        "HIPEREMIA PASIVA AGUDA.",
      ],
      modifiers: [],
    },

    fibrino: {
      titulo: "Apendicitis — Fibrino",
      variantLabel: "Fibrino",
      micro: "Apéndice cecal de arquitectura histológica distorsionada. En la mucosa se observan abundantes úlceras las cuales están revestidas por exudado leucocitario. A nivel transmural se observa infiltrado polimorfonuclear flegmonoso, que alcanza hasta la serosa, donde se observa depósito de material fibrinoídeo y pus.",
      diagnostico: [
        "APENDICITIS AGUDA ULCERO FLEGMONOSA.",
        "PERIAPENDICITIS FIBRINO PURULENTA.",
      ],
      modifiers: [],
    },

    gangreno: {
      titulo: "Apendicitis — Gangreno",
      variantLabel: "Gangreno",
      micro: "Apéndice cecal de arquitectura extensamente distorsionada por proceso inflamatorio agudo supurado, flegmonoso, necrotizante que compromete en forma difusa el espesor de la pared con múltiples focos de denudación epitelial en la mucosa y zonas de hemorragia. En la serosa abundante pus y focos de necrosis.",
      diagnostico: [
        "APENDICITIS AGUDA GANGRENO FLEGMONOSA.",
        "PERIAPENDICITIS PURULENTA.",
      ],
      modifiers: [],
    },
  };

  var categorias = [
    { id: "apendicitis", label: "Apendicitis", templates: ["profilactica", "fibrino", "gangreno"] },
  ];

  PLANTILLAS.registerOrgan({
    id: "apendice",
    nombre: "Apéndice",
    // Identidad #99644D (acento); tarjetas en tintes claros derivados para legibilidad.
    theme: {
      accent: "#99644d",
      accentSoft: "#ecdcd4",
      ink: "#3a2219",
      chipLine: "#c4a08f",
      optionsLine: "#b98a75",
      tones: ["#eadbd3", "#f1e6e0", "#e3cfc5"],
    },
    categorias: categorias,
    templates: templates,
  });
})();
