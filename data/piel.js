/*
 * PIEL — datos maestros
 * ---------------------
 * Fuente de verdad: "NEVOS.pdf" entregado por el anatomopatólogo (2026-09-29).
 * Textos generados automáticamente desde el PDF: LITERALES (tildes, "atipías", "pagetodie",
 * "fusion", dobles espacios internos y puntuación se conservan a propósito).
 * Únicos ajustes: se quita la numeración "N- " del inicio de cada diagnóstico y los espacios
 * al final de cada párrafo (artefacto del PDF). En la plantilla 2, las líneas
 * "BORDES QUIRURGICOS SIN LESION." y "DISTA MENOS DE 1 MM A LOS BORDES QUIRURGICOS."
 * son opciones activables (decisión de la usuaria).
 * Estructura en árbol (ver LEEME.md). `lines` = ayudas visuales: no se copian.
 */
(function () {
  var templates = {
    // Plantilla 1 del PDF
    nevo_1: {
      titulo: "Nevos — Compuesto — Tipo congénito",
      micro: "Muestra constituida por piel con ortoqueratosis, espongiosis leve y elongación de papilas intraepidérmicas con nidos de melanocitos en la unión dermoepidérmica, en dermis superficial, profunda y de distribución perianexial, dispuestos en nidos y cordones con signos de maduración hacia la profundidad. No se observan mitosis ni atipias.",
      diagnostico: ["NEVO MELANOCITICO COMPUESTO DE TIPO CONGENITO."],
      modifiers: [],
    },
    // Plantilla 3 del PDF
    nevo_3: {
      titulo: "Nevos — Compuesto — Compuesto",
      micro: "Muestra constituida por piel con ortoqueratosis, espongiosis leve y elongación de papilas intraepidérmicas  con nidos de melanocitos sin atipías en la unión dermoepidérmica y en dermis superficial dispuestos en nidos y cordones. No se observan mitosis.",
      diagnostico: ["NEVO MELANOCITICO COMPUESTO."],
      modifiers: [],
    },
    // Plantilla 2 del PDF
    nevo_2: {
      titulo: "Nevos — Dérmico — Dermis superficial y profunda",
      micro: "Muestra constituida por piel con ortoqueratosis y espongiosis leve; se identifica proliferación de células névicas dispuestas en grupos, formando trabéculas y cordones en dermis superficial y profunda, también presentan distribución perianexial con fibrosis colágena perifocal. Anexos de estructura conservada. No se observan mitosis ni atipias.",
      diagnostico: ["NEVO MELANOCITICO DERMICO."],
      optionsTitle: "Opciones para el diagnóstico",
      // Opciones activables (desactivadas por defecto). Agregan al DIAGNÓSTICO el texto exacto del PDF,
      // siempre en este orden; nunca modifican la micro.
      modifiers: [
        { id: "bordes_sin_lesion", label: "Bordes quirúrgicos sin lesión.", dxAppend: ["BORDES QUIRURGICOS SIN LESION."] },
        { id: "dista_menos_1mm", label: "Dista menos de 1 mm a los bordes quirúrgicos.", dxAppend: ["DISTA MENOS DE 1 MM A LOS BORDES QUIRURGICOS."] },
      ],
    },
    // Plantilla 6 del PDF
    nevo_6: {
      titulo: "Nevos — Dérmico — Dermis superficial",
      micro: "Muestra constituida por piel con espongiosis  y nidos de melanocitos sin atipías en dermis superficial dispuestos en nidos y cordones. Grupos de melanofagos dispersos.  No se observan mitosis. Anexos de estructura conservada.",
      diagnostico: ["NEVO MELANOCITICO DERMICO."],
      modifiers: [],
    },
    // Plantilla 4 del PDF
    nevo_4: {
      titulo: "Nevos — De unión",
      micro: "Muestra constituida por piel con ortoqueratosis y proliferación de células névicas dispuestas en nidos y en forma aislada predominantemente en zona de unión. Algunas presentan pigmentación irregular. No se observa extensión suprabasal, mitosis ni atipias. No se observa lesión en los márgenes quirúrgicos.",
      diagnostico: ["NEVO MELANOCITICO DE UNION."],
      modifiers: [],
    },
    // Plantilla 5 del PDF
    nevo_5: {
      titulo: "Nevos — Atípico compuesto",
      micro: "Muestra constituida  por Piel con ortoqueratosis y espongiosis leve. Hiperplasia lentiginosa de melanocitos con atipia leve a moderada, nidos en zona de unión y abundantes en dermis superficial, profunda y perianexial con pigmentación irregular y signos de maduración. No se observan mitosis ni extensión pagetodie suprabasal. Dermis con leve fibrosis e infiltrado linfocitario perivascular superficial. Anexos de estructura conservada. Bordes quirúrgicos sin lesión.",
      diagnostico: ["NEVO MELANOCITICO ATIPICO COMPUESTO."],
      modifiers: [],
    },
    // Plantilla 8 del PDF
    nevo_8: {
      titulo: "Nevos — Atípico de unión — De unión",
      micro: "Piel con ortoqueratosis, espongiosis focal y fusion de crestas interpapilares. Se identifica hiperplasia lentiginosa de melanocitos con atipia leve y nidos en zona de unión con pigmentación irregular. No se observa mitosis ni extensión pagetodie suprabasal. Dermis con leve fibrosis e infiltrado linfocitario perivascular superficial. Anexos de estructura conservada. Bordes sin lesión",
      diagnostico: ["HALLAZGOS MORFOLOGICOS COMPATIBLES CON NEVO MELANOCITICO ATIPICO DE UNION."],
      modifiers: [],
    },
    // Plantilla 7 del PDF
    nevo_7: {
      titulo: "Nevos — Atípico de unión — Sobre nevo congénito",
      micro: "Piel con ortoqueratosis, espongiosis focal y fusion de crestas interpapilares. Se identifica hiperplasia lentiginosa de melanocitos con atipia leve y nidos en zona de unión y algunos en dermis superficial  con pigmentación irregular que se extienden hasta la dermis profunda con distribución perianexial y signos de maduración. No se observa mitosis ni extensión pagetodie suprabasal.  Dermis  con leve fibrosis e infiltrado linfocitario perivascular superficial. Anexos de estructura conservada. La lesión dista 1 mm de los bordes laterales y 3 mm del borde profundo de la muestra.",
      diagnostico: ["HALLAZGOS MORFOLOGICOS COMPATIBLES CON NEVO MELANOCÍTICO ATÍPICO DE UNION DESARROLLADO SOBRE NEVO DE TIPO CONGENITO."],
      modifiers: [],
    },
  };

  var nevos = {
    id: "nevos",
    label: "Nevos",
    hint: "5 categorías ▾",
    children: [
      {
        id: "compuesto",
        label: "Compuesto",
        hint: "2 variantes ▾",
        children: [
          { id: "nevo_1", label: "Tipo congénito", lines: ["Dermis superficial, profunda y perianexial"], template: "nevo_1" },
          { id: "nevo_3", label: "Compuesto", template: "nevo_3" },
        ],
      },
      {
        id: "dermico",
        label: "Dérmico",
        hint: "2 variantes ▾",
        children: [
          { id: "nevo_2", label: "Dermis superficial y profunda", lines: ["Distribución perianexial · fibrosis colágena perifocal"], template: "nevo_2" },
          { id: "nevo_6", label: "Dermis superficial", lines: ["Melanófagos dispersos"], template: "nevo_6" },
        ],
      },
      // Una sola plantilla: abren el resultado directamente.
      { id: "de_union", label: "De unión", template: "nevo_4" },
      { id: "atipico_compuesto", label: "Atípico compuesto", template: "nevo_5" },
      {
        id: "atipico_de_union",
        label: "Atípico de unión",
        hint: "2 variantes ▾",
        children: [
          { id: "nevo_8", label: "De unión", template: "nevo_8" },
          { id: "nevo_7", label: "Sobre nevo congénito", lines: ["Atípico de unión · desarrollado sobre nevo de tipo congénito"], template: "nevo_7" },
        ],
      },
    ],
  };

  PLANTILLAS.registerOrgan({
    id: "piel",
    nombre: "Piel",
    // Celeste pastel: distinto de los demás órganos, mismo estilo.
    theme: {
      accent: "#2c5f8a",
      accentSoft: "#d3e5f3",
      ink: "#15324a",
      chipLine: "#9fbfd9",
      optionsLine: "#8fb4d4",
      tones: ["#dbeaf6"],
      levelTones: [null, "#e3eff8", "#eff6fb"],
    },
    // Nuevas categorías de Piel se agregan a este arreglo.
    categorias: [nevos],
    templates: templates,
  });
})();
