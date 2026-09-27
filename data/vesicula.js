/*
 * VESÍCULA BILIAR — datos maestros
 * ---------------------------------
 * Fuente de verdad: "Matriz_Maestra_Vesicula_Biliar_FINAL_micro5.docx"
 * + correcciones expresas del anatomopatólogo (plantillas 7, 10 y 14).
 *
 * LOS TEXTOS SE CONSERVAN LITERALMENTE. No corregir, no reformular.
 *
 * Estructura:
 *   categorias[]  → tarjetas principales (label = etiqueta visual breve).
 *                   templates: 1 id  → abre la plantilla directamente.
 *                   templates: >1 id → despliega variantes.
 *   templates{}   → plantilla maestra:
 *       micro        texto base (un párrafo)
 *       diagnostico  líneas del diagnóstico, en orden
 *       fields       campos variables siempre visibles
 *       modifiers    opciones permitidas SOLO para esta plantilla
 *          microAppend  se agrega al final del mismo párrafo (punto seguido)
 *          dxAppend     líneas que se agregan al final del diagnóstico
 *          dxReplace    {find, replace}: sustituye una línea del diagnóstico
 *          fields       campos que aparecen al activar la opción
 *   Marcadores {id} dentro de los textos se reemplazan por el valor del campo
 *   (o por "___" si está vacío).
 */
(function () {
  // Fragmentos de ganglio cístico — cada formulación se conserva tal cual.
  // Se asignan explícitamente a cada plantilla; NO existe un texto universal.
  var GANGLIO_1_MICRO = "A nivel del conducto Cístico se encontró ganglio linfático con prominencia de folículos linfoides e histiocitosis sinusal.";
  var GANGLIO_2_MICRO = "A nivel del conducto Cístico, ganglio linfático con signos de hiperplasia folicular, sin evidencia de neoplasia.";
  var GANGLIO_3_MICRO = "A nivel del conducto cístico se encontró ganglio linfático con prominencia de folículos linfoides e histiocitosis sinusal.";
  var GANGLIO_DX_GENERICO = "GANGLIO CISTICO SIN EVIDENCIA DE NEOPLASIA.";
  var GANGLIO_DX_FOLICULAR = "GANGLIO CISTICO: LINFOADENITIS CRONICA INESPECIFICA.";

  function ganglio(microAppend, dxLine) {
    return {
      id: "ganglio",
      label: "Ganglio cístico",
      microAppend: microAppend,
      dxAppend: [dxLine],
    };
  }

  var NODULO_FONDO = {
    id: "nodulo",
    label: "Nódulo del fondo",
    dxReplace: {
      find: "HIPERPLASIA ADENOMIOMATOSA.",
      replace: "HIPERPLASIA ADENOMIOMATOSA (NODULO DEL FONDO {medida1} x {medida2} CM).",
    },
    fields: [
      { id: "medida1", label: "Medida 1" },
      { id: "medida2", label: "Medida 2" },
    ],
  };

  var templates = {
    // 1
    inespecifica: {
      titulo: "Colecistitis crónica inespecífica",
      micro: "Vesícula biliar con hiperplasia del epitelio de revestimiento. Lámina propia con focos de hiperemia, edema e infiltrado linfoplasmocitario disperso, zonas de fibrosis, engrosamiento de paredes vasculares y acúmulos de histiocitos espumosos. Hipertrofia de la túnica muscular propia y fibrosis de la subserosa.",
      diagnostico: [
        "COLELITIASIS.",
        "COLECISTITIS CRONICA INESPECIFICA.",
        "COLESTEROLOSIS.",
      ],
      modifiers: [ganglio(GANGLIO_1_MICRO, GANGLIO_DX_GENERICO)],
    },

    // 2
    hemorragica_leucocitaria: {
      titulo: "Colecistitis crónica con reagudización hemorrágica y leucocitaria",
      micro: "Vesícula biliar de arquitectura distorsionada. La mucosa presenta áreas de erosión con infiltración hemorrágica, histiocitos espumosos y focos supurados. Hipertrofia de la túnica muscular con fibrosis de tipo cicatrizal de la subserosa.",
      diagnostico: [
        "COLECISTITIS CRONICA CON REAGUDIZACION HEMORRAGICA Y LEUCOCITARIA.",
        "COLELITIASIS.",
      ],
      modifiers: [ganglio(GANGLIO_1_MICRO, GANGLIO_DX_GENERICO)],
    },

    // 3
    hiperplasia_a: {
      titulo: "Hiperplasia adenomiomatosa — Variante A",
      variantLabel: "Variante A",
      micro: "Vesícula Biliar con pared arquitectura general distorsionada. Epitelio sin atipias. Se identifican senos de Rokitansky- Aschoff que en partes conforman áreas de aspecto nodular; infiltrado inflamatorio crónico linfoplasmocitario en la lámina propia e histiocitos espumosos dispersos. Hipertrofia de la Túnica muscular, engrosamiento de paredes vasculares y zonas de hialinización en la subserosa.",
      diagnostico: [
        "COLELITIASIS.",
        "COLECISTITIS CRONICA INESPECIFICA.",
        "COLESTEROLOSIS.",
        "HIPERPLASIA ADENOMIOMATOSA.",
      ],
      // Ganglio: decisión expresa del anatomopatólogo — usa el mismo fragmento
      // que la Variante B (la matriz original no lo documentaba para la A).
      modifiers: [ganglio(GANGLIO_2_MICRO, GANGLIO_DX_GENERICO), NODULO_FONDO],
    },

    // 4
    hiperplasia_b: {
      titulo: "Hiperplasia adenomiomatosa — Variante B",
      variantLabel: "Variante B",
      micro: "Vesícula biliar de arquitectura histológica distorsionada. El epitelio de revestimiento de tipo cilíndrico mucosecretor. En el corion focos de infiltrado inflamatorio linfoplasmocitario, algunos histiocitos espumosos, fibrosis y zonas de hiperemia. La pared presenta abundantes senos de Rokitansky-Aschoff que constituyen áreas nodulares con dilatación luminal glandular, delimitación fibrosa y muscular lisa. Túnica muscular con hipertrofia moderada y fibrosis discreta de la subserosa.",
      diagnostico: [
        "COLELITIASIS.",
        "COLECISTITIS CRONICA INESPECIFICA.",
        "COLESTEROLOSIS.",
        "HIPERPLASIA ADENOMIOMATOSA.",
      ],
      modifiers: [ganglio(GANGLIO_2_MICRO, GANGLIO_DX_GENERICO), NODULO_FONDO],
    },

    // 5
    polipos: {
      titulo: "Pólipos colesterínicos de la vesícula biliar",
      micro: "Vesícula biliar con hiperplasia del epitelio de revestimiento. Lámina propia con focos de hiperemia, edema e infiltrado linfoplasmocitario disperso, zonas de fibrosis, engrosamiento de paredes vasculares y acúmulos de histiocitos espumosos que se disponen formando pólipos. Áreas de hipertrofia en la túnica muscular y fibrosis de la subserosa.",
      diagnostico: [
        "POLIPOS COLESTERINICOS DE LA VESICULA BILIAR ({cantidad}).",
        "COLECISTITIS CRONICA INESPECIFICA.",
        "COLESTEROLOSIS.",
        "COLELITIASIS.",
      ],
      fields: [{ id: "cantidad", label: "Cantidad de pólipos" }],
      modifiers: [],
    },

    // 6
    gangrena_empiema: {
      titulo: "Reagudización necrótica y hemorrágica — Gangrena/Empiema",
      variantLabel: "Gangrena / Empiema",
      micro: "Vesícula biliar de arquitectura histológica distorsionada. El epitelio de revestimiento de tipo cilíndrico mucosecretor, extensamente desprendido. A nivel transmural se observa infiltrado inflamatorio linfoplasmocitario difuso, con componente hemorrágico abundante y necrosis transmural. En la serosa pus y fibrina.",
      diagnostico: [
        "GANGRENA VESICULAR.",
        "EMPIEMA VESICULAR.",
        "COLECISTITIS CRONICA CON REAGUDIZACION NECROTICA Y HEMORRAGICA.",
        "COLELITIASIS.",
      ],
      modifiers: [ganglio(GANGLIO_2_MICRO, GANGLIO_DX_GENERICO)],
    },

    // 7 — corrección expresa: "ADENOMIOMATOSIS." con punto final
    reagudizacion_adenomiomatosis: {
      titulo: "Reagudización necrótica y hemorrágica — Adenomiomatosis",
      variantLabel: "Adenomiomatosis",
      micro: "Vesícula biliar de arquitectura histológica distorsionada. El epitelio de revestimiento de tipo cilíndrico mucosecretor, en partes desprendido. A nivel transmural se observa infiltrado inflamatorio linfoplasmocitario difuso, con componente hemorrágico abundante y focos de necrosis. Focos de adenomiosis; túnica muscular con hipertrofia moderada y fibrosis de la subserosa.",
      diagnostico: [
        "COLECISTITIS CRONICA CON REAGUDIZACION NECROTICA Y HEMORRAGICA.",
        "COLELITIASIS.",
        "ADENOMIOMATOSIS.",
      ],
      modifiers: [],
    },

    // 8
    pericolecistitis: {
      titulo: "Pericolecistitis leucocitaria",
      micro: "Vesícula biliar, cuya mucosa esta revestida por epitelio cilíndrico monoestratificado con núcleos basales, normotípicos; en el corion se aprecian vasos sanguíneos dilatados, congestivos, discreto infiltrado inflamatorio mononuclear inespecifico y acúmulos de histiocitos con citoplasma amplio, claro, de aspecto espumoso; en el resto de la pared se encuentra hipertrofia de la capa muscular, edema intersticial, congestión vascular y focos de hemorragia. A nivel del conducto cístico se encontró ganglio linfático con prominencia de folículos linfoides e histiocitosis sinusal.",
      diagnostico: [
        "COLECISTITIS CRONICA INESPECIFICA CON REAGUDIZACION HEMORRAGICA Y LEUCOCITARIA.",
        "COLELITIASIS.",
        "COLESTEROLOSIS.",
        "PERICOLECISTITIS LEUCOCITARIA.",
        "LINFOADENITIS CRONICA INESPECIFICA (GANGLIO CISTICO).",
      ],
      modifiers: [],
    },

    // 9
    escleroatrofica: {
      titulo: "Colecistitis crónica escleroatrófica",
      variantLabel: "Escleroatrófica",
      micro: "Vesícula biliar de arquitectura histológica distorsionada. El epitelio de revestimiento se encuentra extensamente desprendido y la pared reemplazada por abundantes áreas fibroescleróticas hialinas, homogéneas. Hacia el borde profundo, se observan áreas de esclerosis vascular.",
      diagnostico: [
        "COLECISTITIS CRONICA ESCLEROATROFICA.",
        "COLELITIASIS.",
      ],
      modifiers: [ganglio(GANGLIO_3_MICRO, GANGLIO_DX_GENERICO)],
    },

    // 10 — micro y diagnóstico corregidos expresamente
    escleroatrofica_reagudizacion: {
      titulo: "Colecistitis crónica escleroatrófica con reagudización hemorrágica y leucocitaria",
      variantLabel: "Con reagudización hemorrágica y leucocitaria",
      micro: "Vesícula biliar de arquitectura histológica distorsionada. El epitelio de revestimiento se encuentra extensamente desprendido y la pared reemplazada por abundantes áreas fibroescleróticas hialinas, homogéneas. Hacia el borde profundo, se observan áreas de esclerosis vascular. Intensa fibrosis de la subserosa. Hipertrofia de filetes nerviosos y zonas de calcificación distrófica.",
      diagnostico: [
        "COLECISTITIS CRONICA ESCLEROATROFICA CON REAGUDIZACION HEMORRAGICA Y LEUCOCITARIA.",
        "COLELITIASIS.",
      ],
      modifiers: [ganglio(GANGLIO_3_MICRO, GANGLIO_DX_GENERICO)],
    },

    // 11
    inespecifica_reagudizacion_necrotica: {
      titulo: "Colecistitis crónica inespecífica con reagudización necrótica y hemorrágica",
      micro: "Vesícula biliar de arquitectura histológica distorsionada. El epitelio de revestimiento de tipo cilíndrico mucosecretor, en partes desprendido; en la lámina propia abundantes histiocitos espumosos. A nivel transmural se observa infiltrado inflamatorio linfoplasmocitario difuso, con granulocitos neutrófilos y componente hemorrágico abundante en relación a focos de necrosis. Túnica muscular con hipertrofia moderada y fibrosis de la subserosa.",
      diagnostico: [
        "COLECISTITIS CRONICA INESPECIFICA, CON REAGUDIZACION NECROTICA Y HEMORRAGICA.",
        "COLELITIASIS.",
        "COLESTEROLOSIS.",
      ],
      modifiers: [],
    },

    // 12 — usa su diagnóstico específico de ganglio
    folicular: {
      titulo: "Colecistitis crónica folicular",
      micro: "Vesícula biliar de arquitectura histológica distorsionada; la mucosa está revestida por epitelio cilíndrico monoestratificado con núcleos basales, normotípicos; en el corion focos de hemorragia y moderado infiltrado inflamatorio linfoplasmocitario; se identifican abundantes folículos linfoides con formación de centros germinales. El resto de la pared presenta hipertrofia de la capa muscular, engrosamiento de paredes vasculares y zonas de fibrosis leve a moderada en la subserosa.",
      diagnostico: [
        "COLECISTITIS CRONICA FOLICULAR.",
        "COLELITIASIS.",
      ],
      modifiers: [ganglio(GANGLIO_3_MICRO, GANGLIO_DX_FOLICULAR)],
    },

    // 13
    hidrops: {
      titulo: "Hidrops vesicular",
      micro: "Vesícula biliar de arquitectura distorsionada. La mucosa presenta áreas de erosión con infiltración hemorrágica, histiocitos espumosos y focos supurados. Hipertrofia de la túnica muscular con fibrosis de tipo cicatrizal de la subserosa.",
      diagnostico: [
        "HIDROPS VESICULAR.",
        "COLECISTITIS CRONICA CON REAGUDIZACION HEMORRAGICA Y LEUCOCITARIA.",
        "COLELITIASIS.",
        "ADENOMIOSIS.",
      ],
      modifiers: [],
    },

    // 14 — micro corregida expresamente (un solo párrafo)
    ganglio_reactivo: {
      titulo: "Ganglio cístico con cambios de tipo reactivo",
      micro: "Vesícula biliar de arquitectura distorsionada. La mucosa presenta áreas de erosión con infiltración hemorrágica, histiocitos espumosos y focos supurados. Hipertrofia de la túnica muscular con fibrosis de tipo cicatrizal de la subserosa. A nivel del conducto Cístico se encontró ganglio Cístico de arquitectura parcialmente distorsionada con expansión de la zona interfolicular y focos de foliculosis.",
      diagnostico: [
        "COLECISTITIS CRONICA LITIASICA CON INTENSOS SIGNOS DE REAGUDIZACION.",
        "COLESTEROLOSIS.",
        "GANGLIO CISTICO CON CAMBIOS DE TIPO REACTIVO.",
      ],
      modifiers: [],
    },
  };

  var categorias = [
    { id: "inespecifica", label: "Inespecífica", templates: ["inespecifica"] },
    { id: "hemorragica_leucocitaria", label: "Hemorrágica / Leucocitaria", templates: ["hemorragica_leucocitaria"] },
    { id: "pericolecistitis", label: "Pericolecistitis leucocitaria", templates: ["pericolecistitis"] },
    { id: "ganglio_reactivo", label: "Ganglio reactivo", templates: ["ganglio_reactivo"] },
    { id: "hiperplasia", label: "Hiperplasia adenomiomatosa", templates: ["hiperplasia_a", "hiperplasia_b"] },
    { id: "polipos", label: "Pólipos colesterínicos", templates: ["polipos"] },
    { id: "reagudizacion_necrotica", label: "Reagudización necrótica / hemorrágica", templates: ["gangrena_empiema", "reagudizacion_adenomiomatosis"] },
    { id: "inespecifica_reagudizacion_necrotica", label: "Inespecífica + reagudización necrótica / hemorrágica", templates: ["inespecifica_reagudizacion_necrotica"] },
    { id: "escleroatrofica", label: "Escleroatrófica", templates: ["escleroatrofica", "escleroatrofica_reagudizacion"] },
    { id: "folicular", label: "Folicular", templates: ["folicular"] },
    { id: "hidrops", label: "Hidrops", templates: ["hidrops"] },
  ];

  PLANTILLAS.registerOrgan({
    id: "vesicula",
    nombre: "Vesícula biliar",
    // Familia de verdes claros. `tones` se asignan en orden a las tarjetas.
    theme: {
      accent: "#2f6b4f",
      accentSoft: "#cfe3d6",
      ink: "#1c3328",
      tones: ["#e6efe7", "#dff1e8", "#e9eedc", "#ddefec", "#e4eae6", "#e1ecde"],
    },
    categorias: categorias,
    templates: templates,
  });
})();
