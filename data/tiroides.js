/*
 * TIROIDES — datos maestros
 * -------------------------
 * Fuente de verdad: "Bethesda.pdf" entregado por el anatomopatólogo (2026-09-27).
 * Textos generados automáticamente desde el PDF: LITERALES (tildes, puntuación,
 * espacios dobles internos y aparentes errores se conservan a propósito).
 * Únicos ajustes: se quitan los espacios al final de cada párrafo (artefacto del PDF)
 * y, por decisión de la usuaria, el prefijo "A- " / "B- " de los diagnósticos de Bethesda III.
 *
 * Estructura en árbol (ver LEEME.md):
 *   nodo con `children`  → despliega sus hijos como tarjetas
 *   nodo con `sections`  → despliega varios grupos de tarjetas con subtítulo
 *   nodo con `template`  → muestra MICRO + DIAGNÓSTICO de esa plantilla
 *   nodo con `combine`   → el usuario elige una opción de cada eje (p. ej. 1 diagnóstico + 1 micro)
 * Para agregar micros a Hürthle: reemplazar su `template` por `children: [...]`.
 */
(function () {
  // Diagnósticos compartidos por varias micros
  var DX_B3_A = ["LOS HALLAZGOS MORFOLOGICOS CORRESPONDEN A ATIPIAS DE SIGNIFICADO INDETERMINADO (CATEGORIA III DE LA CLASIFICACION DE BETHESDA)."];
  var DX_B3_B = ["LOS HALLAZGOS MORFOLOGICOS CORRESPONDEN A LESION FOLICULAR DE SIGNIFICADO INDETERMINADO CON METAPLASIA DE HURTHLE (CATEGORIA III DE LA CLASIFICACION DE BETHESDA)."];
  var DX_B5 = ["HALLAZGOS MORFOLOGICOS SOSPECHOSOS DE CARCINOMA PAPILAR  (CATEGORIA V DE  LA CLASIFICACION DE BETHESDA)."];

  var templates = {
    b1_no_diagnostica: {
      titulo: "Bethesda I — NO DIAGNOSTICA",
      micro: "Muestra constituida predominantemente por material hemático. Se reconocen algunas células linfocitarias y material coloídeotanto en el bloque celular como en el extendido citológico.",
      diagnostico: ["MUESTRA NO DIAGNOSTICA (TIPO I DE LA CLASIFICACION DE BETHESDA)"],
      modifiers: [],
    },

    b1_celulas_foliculares: {
      titulo: "Bethesda I — CELULAS FOLICULARES",
      micro: "Muestra constituida predominantemente por material hemático. Se reconocen algunos linfocitos pequeños normotípicos, granulocitos neutrófilos y escasas células aisladas de tipo folicular de núcleos redondeados y uniformes; moldes libres de coloide acuoso y algunas células espumosas.",
      diagnostico: ["MATERIAL HEMATICO, CELULAS INFLAMATORIAS Y ESCASAS CELULAS FOLICULARES NORMOTIPICAS (CORRESPONDE A TIPO I DE LA CLASIFICACION DE BETHESDA)."],
      modifiers: [],
    },

    b1_escaso_coloide: {
      titulo: "Bethesda I — ESCASO COLOIDE ACUOSO",
      micro: "Muestra constituida predominantemente por material hemático. Se reconocen algunas células linfocitarias normotípicas y escasas células aisladas de tipo folicular de núcleos redondeados y uniformes; algunos moldes libres de coloide acuoso.",
      diagnostico: ["ESCASO COLOIDE ACUOSO Y ALGUNAS CELULAS INFLAMATORIAS (CORRESPONDE A TIPO I DE LA CLASIFICACION DE BETHESDA)."],
      modifiers: [],
    },

    b3_grupos: {
      titulo: "Bethesda III — GRUPOS",
      micro: "Muestra constituida por material hemático en cuyo espesor se reconocen grupos de células de núcleos aumentados de tamaño, irregulares, angulosos con presencia de pliegues ocasionales y algunas pseudoinclusiones. Se observan además múltiples grupos dispersos de linfocitos pequeños y granulocitos neutrófilos; se reconocen abundantes moldes libres de coloide acuoso y algunas células espumosas.",
      diagnostico: DX_B3_A,
      modifiers: [],
    },

    b3_fragmentos_foliculos: {
      titulo: "Bethesda III — FRAGMENTOS FOLICULOS",
      micro: "Muestra constituida por material hemático en cuyo espesor se identifican fragmentos de tejido tiroideo conformados por folículos de tamaño variable, algunos abiertos; se observa escaso estroma entre las estructuras foliculares; estas están revestidas por células de núcleos levemente pleomórficos con citoplasma eosinófilo granular abundante (metaplasia de células de Hurthle). Se observa moderada cantidad de coloide denso, grupos de células espumosas y linfocitos pequeños normotípicos.",
      diagnostico: DX_B3_A,
      modifiers: [],
    },

    b3_fragmentos_pseudopapilar: {
      titulo: "Bethesda III — FRAGMENTOS PSEUDOPAPILAR",
      micro: "Muestra constituida por material hemático en cuyo espesor se identifican fragmentos de tejido tiroideo conformados predominantemente por estructuras de tipo pseudopapilar; el estroma es colágeno denso, en partes hialinizado. Las estructuras descritas están revestidas por células de núcleos levemente pleomórficos hipercromáticos, con algunas pseudoinclusiones aisladas y focos con citoplasma eosinófilo granular abundante (Metaplasia de Hurthle); escaso coloide acuoso dispuesto en forma de moldes libres.",
      diagnostico: DX_B3_A,
      modifiers: [],
    },

    b3_hurthle: {
      titulo: "Bethesda III — Hürthle",
      micro: "Muestra constituida por material hemático en cuyo espesor se identifican fragmentos de tejido tiroideo conformados predominantemente por folículos pequeños y medianos con leve variabilidad y escaso estroma entre las estructuras foliculares; estas están revestidas por células de núcleos levemente pleomórficos aumentados de tamaño con citoplasma eosinófilo granular abundante (metaplasia de células de Hurthle). Se observa moderada cantidad de coloide denso.",
      diagnostico: DX_B3_B,
      modifiers: [],
    },

    b4_hurthle: {
      titulo: "Bethesda IV — NEOPLASIA FOLICULAR DE CELULAS DE HURTHLE",
      micro: "Muestra constituida por material hemático en cuyo espesor se identifican fragmentos de tejido tiroideo conformados predominantemente por microfolículos con muy escaso estroma entre las estructuras foliculares; estas están revestidas por células de núcleos angulosos, levemente pleomórficos con escasas pseudoinclusiones; algunas células presentan citoplasma eosinófilo granular abundante (metaplasia de células de Hurthle).",
      diagnostico: ["HALLAZGOS MORFOLOGICOS COMPATIBLE CON NEOPLASIA FOLICULAR DE CELULAS DE HURTHLE (CATEGORIA IV DE LA CLASIFICACION DE BETHESDA)."],
      modifiers: [],
    },

    b4_compatible: {
      titulo: "Bethesda IV — NEOPLASIA FOLICULAR → COMPATIBLE",
      micro: "Muestra constituida por material hemático en cuyo espesor se identifican fragmentos de tejido tiroideo con muy escaso estroma entre las estructuras foliculares; estas están revestidas por células de núcleos levemente pleomórficos con citoplasma eosinófilo abundante y presentan muy escaso coloide.",
      diagnostico: ["HALLAZGOS MORFOLOGICOS COMPATIBLES CON NEOPLASIA FOLICULAR (CATEGORIA IV DE LA CLASIFICACION DE BETHESDA)."],
      modifiers: [],
    },

    b4_sospechosa: {
      titulo: "Bethesda IV — NEOPLASIA FOLICULAR → SOSPECHOSA",
      micro: "Muestra constituida por material hemático en cuyo espesor se identifican fragmentos de tejido tiroideo con muy escaso estroma entre las estructuras foliculares; estas están revestidas por células de núcleos levemente pleomórficos algunos con pseudoinclusiones, con citoplasma eosinófilo granular abundante y presentan muy escaso coloide.",
      diagnostico: ["HALLAZGOS MORFOLOGICOS SOSPECHOSOS DE NEOPLASIA FOLICULAR (CATEGORIA IV DE LA CLASIFICACION DE BETHESDA)."],
      modifiers: [],
    },

    b5_grupos: {
      titulo: "Bethesda V — GRUPOS",
      micro: "Muestra constituida por material hemático en cuyo espesor se reconocen grupos de células que esbozan estructuras de tipo pseudopapilar y folicular revestidos por células de citoplasma amplio, eosinófilo y núcleos claros aumentados de tamaño, irregulares, con pliegues, pseudoinclusiones y sobreposición. Se reconocen muy escasos moldes libres de coloide acuoso.",
      diagnostico: DX_B5,
      modifiers: [],
    },

    b5_escasos_grupos: {
      titulo: "Bethesda V — ESCASOS GRUPOS",
      micro: "Muestra constituida por material hemático en cuyo espesor se reconocen escasos grupos de células que esbozan estructuras de tipo pseudopapilar y folicular revestidos por células de citoplasma amplio, eosinófilo y núcleos claros aumentados de tamaño, irregulares, con pliegues, pseudoinclusiones y sobreposición. Se reconocen muy escasos moldes libres de coloide acuoso.",
      diagnostico: DX_B5,
      modifiers: [],
    },

    b5_fragmentos: {
      titulo: "Bethesda V — FRAGMENTOS",
      micro: "Muestra constituida por material hemático en cuyo espesor se  reconocen fragmentos de tejido de arquitectura pseudopapilar y folicular revestidos por células de núcleos irregulares, aumentados de tamaño, con algunos pliegues y escasas pseudoinclusiones; presentan citoplasma amplio, eosinófilo y focos de sobreposición. Se reconocen moldes libres de coloide acuoso, linfocitos pequeños y escasas células espumosas.",
      diagnostico: DX_B5,
      modifiers: [],
    },

    b6: {
      titulo: "Bethesda VI",
      micro: "Muestra constituida por material hemático en cuyo espesor se reconocen fragmentos de tejido de arquitectura papilar y folicular revestidos por células de citoplasma amplio, eosinófilo y núcleos claros aumentados de tamaño, irregulares, con pliegues, pseudoinclusiones y sobreposición. Se reconocen muy escasos moldes libres de coloide acuoso.",
      diagnostico: ["HALLAZGOS MORFOLOGICOS COMPATIBLES CON CARCINOMA PAPILAR  (CATEGORIA VI DE  LA CLASIFICACION DE BETHESDA)."],
      modifiers: [],
    },
  };

  var paaf = {
    id: "paaf",
    label: "PAAF",
    hint: "Bethesda I – VI ▾",
    children: [
      {
        id: "bethesda_1",
        label: "Bethesda I",
        children: [
          { id: "b1_no_diagnostica", label: "NO DIAGNOSTICA", template: "b1_no_diagnostica" },
          { id: "b1_celulas_foliculares", label: "CELULAS FOLICULARES", template: "b1_celulas_foliculares" },
          { id: "b1_escaso_coloide", label: "ESCASO COLOIDE ACUOSO", template: "b1_escaso_coloide" },
        ],
      },
      {
        id: "bethesda_2",
        label: "Bethesda II",
        hint: "2 diagnósticos × 3 micros ▾",
        // Cualquier diagnóstico se combina con cualquier micro.
        combine: [
          {
            id: "dx",
            label: "Diagnóstico",
            tone: "strong",
            options: [
              { id: "compatibles", label: "COMPATIBLES", diagnostico: ["HALLAZGOS MORFOLOGICOS COMPATIBLES CON NODULO HIPERPLASTICO-COLOIDEO (CATEGORIA II DE LA CLASIFICACION DE BETHESDA)."] },
              { id: "sugerentes", label: "SUGERENTES", diagnostico: ["HALLAZGOS MORFOLOGICOS SUGERENTES DE NODULO HIPERPLASTICO-COLOIDEO (CATEGORIA II DE LA CLASIFICACION DE BETHESDA)."] },
            ],
          },
          {
            id: "micro",
            label: "Micro",
            tone: "soft",
            options: [
              { id: "sugerente_poca_muestra", label: "SUGERENTE POCA MUESTRA", micro: "Muestra constituida por grupos de células foliculares de núcleos redondeados y uniformes, sin atipias. Moderada cantidad de moldes libres de coloide denso, linfocitos y leucocitos polimorfonucleares dispersos; algunas células espumosas. Fondo conformado por material hemático." },
              { id: "compatible", label: "COMPATIBLE", micro: "Muestra constituida por material hemático en cuyo espesor se reconocen fragmentos de tejido tiroídeo que presentan estructuras foliculares de tamaño variable, algunas dilatadas con abundante material coloideo y revestidas por células cúbicas bajas de núcleos redondeados y uniformes. Se reconocen algunas células espumosas, linfocitos pequeños normotípicos y granulocitos neutrófilos aislados." },
              { id: "fibrihialina", label: "FIBRIHIALINA", micro: "Muestra constituida por fragmentos de tejido tiroídeo que presentan estructuras foliculares de tamaño variable, algunas dilatadas, contienen material coloideo y están revestidas por células cúbicas bajas de núcleos redondeados y uniformes; el estroma en partes presenta signos de involución fibrohialina y hialinización. Se reconocen algunas células espumosas y linfocitos pequeños normotípicos aislados. Abundantes moldes libres de coloide acuoso; fondo conformado por material hemático." },
            ],
          },
        ],
      },
      {
        id: "bethesda_3",
        label: "Bethesda III",
        hint: "2 diagnósticos ▾",
        sections: [
          {
            label: "Diagnóstico A",
            hint: DX_B3_A[0],
            children: [
              { id: "b3_grupos", label: "GRUPOS", template: "b3_grupos" },
              { id: "b3_fragmentos_foliculos", label: "FRAGMENTOS FOLICULOS", template: "b3_fragmentos_foliculos" },
              { id: "b3_fragmentos_pseudopapilar", label: "FRAGMENTOS PSEUDOPAPILAR", template: "b3_fragmentos_pseudopapilar" },
            ],
          },
          {
            label: "Diagnóstico B",
            hint: DX_B3_B[0],
            children: [
              // Hoy una sola micro. Para agregar más: children: [{ id, label, template }, ...]
              { id: "b3_hurthle", label: "Hürthle", template: "b3_hurthle" },
            ],
          },
        ],
      },
      {
        id: "bethesda_4",
        label: "Bethesda IV",
        children: [
          { id: "b4_hurthle", label: "NEOPLASIA FOLICULAR DE CELULAS DE HURTHLE", template: "b4_hurthle" },
          { id: "b4_compatible", label: "NEOPLASIA FOLICULAR → COMPATIBLE", template: "b4_compatible" },
          { id: "b4_sospechosa", label: "NEOPLASIA FOLICULAR → SOSPECHOSA", template: "b4_sospechosa" },
        ],
      },
      {
        id: "bethesda_5",
        label: "Bethesda V",
        children: [
          { id: "b5_grupos", label: "GRUPOS", template: "b5_grupos" },
          { id: "b5_escasos_grupos", label: "ESCASOS GRUPOS", template: "b5_escasos_grupos" },
          { id: "b5_fragmentos", label: "FRAGMENTOS", template: "b5_fragmentos" },
        ],
      },
      { id: "bethesda_6", label: "Bethesda VI", template: "b6" },
    ],
  };

  PLANTILLAS.registerOrgan({
    id: "tiroides",
    nombre: "Tiroides",
    // Identidad #FF3D9E. `accent` es un tono más oscuro de la misma familia para
    // que textos y botones sobre fondo claro sean legibles.
    theme: {
      accent: "#c2136f",
      accentSoft: "#ffd3e9",
      ink: "#3a0820",
      chipLine: "#ff8fc6",
      optionsLine: "#ff3d9e",
      trayLine: "#ff3d9e",
      tones: ["#ffc2e0"],
      levelTones: [null, "#ffd9ec", "#ffebf5", "#fff3f9"],
      axisTones: { strong: "#ff3d9e", soft: "#ffe0ef" },
    },
    // Nuevas categorías de Tiroides (p. ej. CARCINOMAS) se agregan a este arreglo.
    categorias: [paaf],
    templates: templates,
  });
})();
