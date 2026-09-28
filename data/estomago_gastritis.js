/*
 * ESTÓMAGO → GASTRITIS — datos maestros
 * -------------------------------------
 * Fuente de verdad: "Gastritis.pdf" entregado por el anatomopatólogo (2026-09-28).
 * Textos generados automáticamente desde el PDF: LITERALES.
 * Únicos ajustes (decisiones de la usuaria / artefactos del PDF):
 *   - se quitan los espacios al final de cada línea (artefacto del PDF);
 *   - diagnóstico 8: se quita el espacio inicial de las líneas 2 a 4;
 *   - diagnóstico 2.2: los 4 espacios entre las dos oraciones de la línea 1 pasan a 1.
 * Diagnósticos EXCLUIDOS deliberadamente (duplicados): 4,7 · 9 · 12. No agregarlos.
 * Gastritis no tiene micro: `sinMicro: true` oculta el cuadro MICRO.
 *
 * Se agrega como categoría nueva de Estómago sin modificar data/estomago.js.
 * Para agregar una combinación OLGA/OLGIM: nuevo nodo en `gastritis.children`.
 * Para agregar una variante: nueva hoja en el `children` de su OLGA/OLGIM.
 * Ayudas visuales (no forman parte del diagnóstico ni se copian), derivadas del texto de cada diagnóstico:
 *   `summary` = hallazgos comunes del grupo · `lines` = líneas pequeñas de la tarjeta · `crumb` = nombre en la ruta.
 */
(function () {
  var OLGA = "#fccaa3"; // botones OLGA/OLGIM: tono más intenso
  var VARIANTE = "#fff0e3"; // variantes: tono más suave

  var templates = {
    // Diagnóstico 1 del PDF
    gastritis_1: {
      titulo: "Gastritis — OLGA 0 / OLGIM 0 — Superficial leve · Actividad leve · H. pylori NEGATIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA SUPERFICIAL LEVE CON SIGNOS LEVES DE ACTIVIDAD INFLAMATORIA.",
        "NO SE OBSERVAN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA METAPLASIA INTESTINAL NI DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 2 del PDF
    gastritis_2: {
      titulo: "Gastritis — SIN OLGA / OLGIM — Actividad intensa · H. pylori POSITIVO · Hiperplasia foveolar · Sin metaplasia intestinal",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON HIPERPLASIA FOVEOLAR, INTENSOS SIGNOS DE ACTIVIDAD INFLAMATORIA Y BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL NI METAPLASIA INTESTINAL.",
      ],
      modifiers: [],
    },
    // Diagnóstico 2.2 del PDF
    gastritis_2_2: {
      titulo: "Gastritis — SIN OLGA / OLGIM — Actividad intensa · H. pylori NEGATIVO · Erosionada · Hiperplasia foveolar · Metaplasia intestinal",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA EROSIONADA CON HIPERPLASIA FOVEOLAR E INTENSOS SIGNOS DE ACTIVIDAD INFLAMATORIA. SE OBSERVA METAPLASIA INTESTINAL.",
        "NO SE OBSERVAN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL.",
      ],
      modifiers: [],
    },
    // Diagnóstico 3 del PDF
    gastritis_3: {
      titulo: "Gastritis — OLGA 0 / OLGIM 0 — Hiperplasia foveolar · Actividad moderada · H. pylori NEGATIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON HIPERPLASIA FOVEOLAR Y SIGNOS MODERADOS DE ACTIVIDAD INFLAMATORIA.",
        "NO SE OBSERVAN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA METAPLASIA INTESTINAL NI DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 4 del PDF
    gastritis_4: {
      titulo: "Gastritis — OLGA I / OLGIM 0 — Actividad intensa · H. pylori POSITIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA LEVE, INTENSOS SIGNOS DE ACTIVIDAD INFLAMATORIA Y BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL NI METAPLASIA INTESTINAL.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 4.5 del PDF
    gastritis_4_5: {
      titulo: "Gastritis — OLGA I / OLGIM 0 — Actividad intensa · H. pylori NEGATIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA LEVE E INTENSOS SIGNOS DE ACTIVIDAD INFLAMATORIA.",
        "NO SE OBSERVAN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL NI METAPLASIA INTESTINAL.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 4.6 del PDF
    gastritis_4_6: {
      titulo: "Gastritis — OLGA I / OLGIM 0 — Actividad moderada · H. pylori POSITIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA LEVE, SIGNOS MODERADOS DE ACTIVIDAD INFLAMATORIA Y BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL NI METAPLASIA INTESTINAL.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 5 del PDF
    gastritis_5: {
      titulo: "Gastritis — OLGA I / OLGIM I — Actividad intensa · H. pylori NEGATIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA LEVE, INTENSOS SIGNOS DE ACTIVIDAD INFLAMATORIA Y FOCOS DE METAPLASIA INTESTINAL.",
        "NO SE OBSERVAN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 5.5 del PDF
    gastritis_5_5: {
      titulo: "Gastritis — OLGA I / OLGIM I — Actividad moderada · H. pylori NEGATIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA LEVE, MODERADOS SIGNOS DE ACTIVIDAD INFLAMATORIA Y FOCOS DE METAPLASIA INTESTINAL.",
        "NO SE OBSERVAN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 6 del PDF
    gastritis_6: {
      titulo: "Gastritis — OLGA I / OLGIM I — Actividad intensa · H. pylori POSITIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA LEVE, INTENSOS SIGNOS DE ACTIVIDAD INFLAMATORIA Y FOCOS DE METAPLASIA INTESTINAL.",
        "SE OBSERVAN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 6.5 del PDF
    gastritis_6_5: {
      titulo: "Gastritis — OLGA II / OLGIM I",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA MODERADA, INTENSOS SIGNOS DE ACTIVIDAD INFLAMATORIA Y FOCOS DE METAPLASIA INTESTINAL.",
        "SE OBSERVAN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA II DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 7 del PDF
    gastritis_7: {
      titulo: "Gastritis — OLGA 0 / OLGIM 0 — Superficial leve + hiperplasia foveolar · Actividad leve · H. pylori NEGATIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA SUPERFICIAL LEVE CON ZONAS DE HIPERPLASIA FOVEOLAR Y SIGNOS LEVES DE ACTIVIDAD INFLAMATORIA.",
        "NO SE RECONOCEN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA ATROFIA, METAPLASIA INTESTINAL NI DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 8 del PDF
    gastritis_8: {
      titulo: "Gastritis — OLGA 0 / OLGIM 0 — Superficial · Actividad intensa · H. pylori POSITIVO · abundantes",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA SUPERFICIAL, INTENSOS SIGNOS DE ACTIVIDAD INFLAMATORIA Y ABUNDANTES BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA METAPLASIA INTESTINAL NI DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 10 del PDF
    gastritis_10: {
      titulo: "Gastritis — OLGA I / OLGIM 0 — Actividad moderada · H. pylori NEGATIVO · Erosión",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA LEVE, SIGNOS MODERADOS DE ACTIVIDAD INFLAMATORIA Y ZONAS DE EROSION.",
        "NO SE RECONOCEN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA METAPLASIA INTESTINAL NI DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 11 del PDF
    gastritis_11: {
      titulo: "Gastritis — OLGA I / OLGIM 0 — Actividad leve · H. pylori NEGATIVO",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA LEVE Y SIGNOS LEVES DE ACTIVIDAD INFLAMATORIA.",
        "NO SE RECONOCEN BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA METAPLASIA INTESTINAL NI DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA 0 DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
    // Diagnóstico 13 del PDF
    gastritis_13: {
      titulo: "Gastritis — OLGA I / OLGIM I — Actividad intensa · H. pylori POSITIVO · escasos",
      sinMicro: true,
      micro: "",
      diagnostico: [
        "GASTRITIS CRONICA CON ATROFIA LEVE, INTENSOS SIGNOS DE ACTIVIDAD INFLAMATORIA, METAPLASIA INTESTINAL Y ESCASOS BACILOS DE TIPO HELICOBACTER PYLORI.",
        "NO SE OBSERVA DISPLASIA EPITELIAL.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGA.",
        "CORRESPONDE A ETAPA I DE LA CLASIFICACION DE OLGIM.",
      ],
      modifiers: [],
    },
  };

  var gastritis = {
    id: "gastritis",
    label: "Gastritis",
    hint: "OLGA / OLGIM ▾",
    children: [
      {
        id: "olga0_olgim0",
        label: "OLGA 0 / OLGIM 0",
        summary: "Sin metaplasia intestinal", // hallazgos comunes a todas sus variantes
        tone: OLGA,
        children: [
          { id: "gastritis_1", label: "Superficial leve", lines: ["Actividad leve", "H. pylori NEGATIVO"], crumb: "Superficial leve · Actividad leve · H. pylori NEGATIVO", template: "gastritis_1", tone: VARIANTE },
          { id: "gastritis_3", label: "Hiperplasia foveolar", lines: ["Actividad moderada", "H. pylori NEGATIVO"], crumb: "Hiperplasia foveolar · Actividad moderada · H. pylori NEGATIVO", template: "gastritis_3", tone: VARIANTE },
          { id: "gastritis_7", label: "Superficial leve + hiperplasia foveolar", lines: ["Actividad leve", "H. pylori NEGATIVO"], crumb: "Superficial leve + hiperplasia foveolar · Actividad leve · H. pylori NEGATIVO", template: "gastritis_7", tone: VARIANTE },
          { id: "gastritis_8", label: "Superficial", lines: ["Actividad intensa", "H. pylori POSITIVO · abundantes"], crumb: "Superficial · Actividad intensa · H. pylori POSITIVO · abundantes", template: "gastritis_8", tone: VARIANTE },
        ],
      },
      {
        id: "olga1_olgim0",
        label: "OLGA I / OLGIM 0",
        summary: "Atrofia leve · Sin metaplasia intestinal", // hallazgos comunes a todas sus variantes
        tone: OLGA,
        children: [
          { id: "gastritis_4", label: "Actividad intensa", lines: ["H. pylori POSITIVO"], crumb: "Actividad intensa · H. pylori POSITIVO", template: "gastritis_4", tone: VARIANTE },
          { id: "gastritis_4_5", label: "Actividad intensa", lines: ["H. pylori NEGATIVO"], crumb: "Actividad intensa · H. pylori NEGATIVO", template: "gastritis_4_5", tone: VARIANTE },
          { id: "gastritis_4_6", label: "Actividad moderada", lines: ["H. pylori POSITIVO"], crumb: "Actividad moderada · H. pylori POSITIVO", template: "gastritis_4_6", tone: VARIANTE },
          { id: "gastritis_10", label: "Actividad moderada", lines: ["H. pylori NEGATIVO", "Erosión"], crumb: "Actividad moderada · H. pylori NEGATIVO · Erosión", template: "gastritis_10", tone: VARIANTE },
          { id: "gastritis_11", label: "Actividad leve", lines: ["H. pylori NEGATIVO"], crumb: "Actividad leve · H. pylori NEGATIVO", template: "gastritis_11", tone: VARIANTE },
        ],
      },
      {
        id: "olga1_olgim1",
        label: "OLGA I / OLGIM I",
        summary: "Atrofia leve · Metaplasia intestinal", // hallazgos comunes a todas sus variantes
        tone: OLGA,
        children: [
          { id: "gastritis_5", label: "Actividad intensa", lines: ["H. pylori NEGATIVO"], crumb: "Actividad intensa · H. pylori NEGATIVO", template: "gastritis_5", tone: VARIANTE },
          { id: "gastritis_5_5", label: "Actividad moderada", lines: ["H. pylori NEGATIVO"], crumb: "Actividad moderada · H. pylori NEGATIVO", template: "gastritis_5_5", tone: VARIANTE },
          { id: "gastritis_6", label: "Actividad intensa", lines: ["H. pylori POSITIVO"], crumb: "Actividad intensa · H. pylori POSITIVO", template: "gastritis_6", tone: VARIANTE },
          { id: "gastritis_13", label: "Actividad intensa", lines: ["H. pylori POSITIVO · escasos"], crumb: "Actividad intensa · H. pylori POSITIVO · escasos", template: "gastritis_13", tone: VARIANTE },
        ],
      },
      // Una sola plantilla: muestra el diagnóstico directamente.
      { id: "olga2_olgim1", label: "OLGA II / OLGIM I", lines: ["Atrofia moderada · Metaplasia intestinal", "Actividad intensa · H. pylori POSITIVO"], template: "gastritis_6_5", tone: OLGA },
      {
        id: "sin_olga_olgim",
        label: "SIN OLGA / OLGIM",
        summary: "Sin clasificación OLGA/OLGIM", // hallazgos comunes a todas sus variantes
        tone: OLGA,
        children: [
          { id: "gastritis_2", label: "Actividad intensa", lines: ["H. pylori POSITIVO", "Hiperplasia foveolar · Sin metaplasia intestinal"], crumb: "Actividad intensa · H. pylori POSITIVO · Hiperplasia foveolar · Sin metaplasia intestinal", template: "gastritis_2", tone: VARIANTE },
          { id: "gastritis_2_2", label: "Actividad intensa", lines: ["H. pylori NEGATIVO", "Erosionada · Hiperplasia foveolar · Metaplasia intestinal"], crumb: "Actividad intensa · H. pylori NEGATIVO · Erosionada · Hiperplasia foveolar · Metaplasia intestinal", template: "gastritis_2_2", tone: VARIANTE },
        ],
      },
    ],
  };

  var estomago = PLANTILLAS.organs.filter(function (o) { return o.id === "estomago"; })[0];
  Object.keys(templates).forEach(function (k) { estomago.templates[k] = templates[k]; });
  estomago.categorias.push(gastritis);
})();
