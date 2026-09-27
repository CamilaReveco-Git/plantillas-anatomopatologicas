/*
 * ESTÓMAGO — datos maestros
 * -------------------------
 * Fuente de verdad: textos entregados por el anatomopatólogo (mensaje del 2026-09-27).
 * LOS TEXTOS SE CONSERVAN LITERALMENTE. Diagnósticos en mayúsculas sin tildes, a propósito.
 * Misma estructura que data/vesicula.js (ver comentario allí).
 * Una línea "" dentro de `diagnostico` representa una línea en blanco.
 */
(function () {
  var templates = {
    manga_gastrica: {
      titulo: "Manga gástrica",
      micro: "Pared gástrica de tipo corporal de arquitectura histológica general conservada. Mucosa con glándulas rectas revestidas por células cúbicas y cilíndricas normotípicas. En la lámina propia se observa infiltración hemorrágica reciente y focos aislados de infiltración linfoplasmocitaria. No se encontraron elementos bacterianos de tipo Helicobacter-pylori. Túnica muscular subserosa de estructura general conservada.",
      diagnostico: [
        "GASTRECTOMIA EN MANGA",
        "PARED GASTRICA DE TIPO CORPORAL DE ESTRUCTURA GENERAL CONSERVADA CON INFILTRACION HEMORRAGICA RECIENTE.",
        "NO SE OBSERVA ATROFIA, DISPLASIA EPITELIAL NI METAPLASIA INTESTINAL.",
        "NO SE RECONOCEN BACILOS DE TIPO HELICOBACTER PYLORI.",
      ],
      modifiers: [],
    },

    polipo_glandulas_fundicas: {
      titulo: "Pólipo — Glándulas fúndicas",
      variantLabel: "Glándulas fúndicas",
      micro: "Muestra constituida por fragmento de mucosa gástrica de tipo corporal que presentan dilatación de estructuras glandulares revestidas por células mucosas principales y parietales, sin atipias. No se observa metaplasia intestinal ni estructuras bacterianas de tipo Helicobacter Pylori.",
      diagnostico: [
        "POLIPO DE TIPO GLANDULAS FUNDICAS.",
        "",
        "NO SE OBSERVA METAPLASIA INTESTINAL NI BACILOS DE TIPO HELICOBACTER PYLORI.",
      ],
      modifiers: [],
    },

    polipo_hiperplastico: {
      titulo: "Pólipo — Hiperplástico",
      variantLabel: "Hiperplástico",
      micro: "Muestra constituida por fragmentos de mucosa gástrica de arquitectura histológica alterada por proliferación glandular hiperplásica, la cual posee elementos de tamaño variable, predominantemente grandes, algunos de lúmen dilatado, con brotes y ramificaciones. El epitelio de revestimiento de tipo cilíndrico, mucosecretor, con núcleos de disposición basal, uniformes y homogéneos. En la lámina propia, se observa infiltrado inflamatorio linfoplasmocitario. No se observa metaplasia intestinal ni Bacilos Helicobacter.",
      diagnostico: [
        "POLIPO HIPERPLASTICO EN MUCOSA GASTRICA.",
        "NO SE OBSERVA METAPLASIA INTESTINAL NI BACILOS DE TIPO HELICOBACTER PYLORI.",
      ],
      modifiers: [],
    },

    adenocarcinoma_tubular_poco_diferenciado: {
      titulo: "Adenocarcinoma — Tubular poco diferenciado",
      variantLabel: "Tubular poco diferenciado",
      micro: "Muestra constituida por fragmentos de mucosa gástrica de tipo antral, en los que se reconoce infiltración por proliferación epitelial glandular poco diferenciada; en partes esboza formación de estructuras tubulares que infiltran la lámina propia de la mucosa gástrica. La proliferación presenta células con núcleos aumentados de tamaño irregulares hipercromáticos y mitosis.",
      diagnostico: [
        "ADENOCARCINOMA TUBULAR POCO DIFERENCIADO INFILTRANTE EN MUCOSA GASTRICA.",
      ],
      modifiers: [],
    },
  };

  var categorias = [
    { id: "manga_gastrica", label: "Manga gástrica", templates: ["manga_gastrica"] },
    { id: "polipo", label: "Pólipo", templates: ["polipo_glandulas_fundicas", "polipo_hiperplastico"] },
    // showVariants: muestra el paso de variante aunque hoy exista un solo tipo.
    { id: "adenocarcinoma", label: "Adenocarcinoma", showVariants: true, templates: ["adenocarcinoma_tubular_poco_diferenciado"] },
  ];

  PLANTILLAS.registerOrgan({
    id: "estomago",
    nombre: "Estómago",
    // Familia basada en #FFDFC4 (durazno claro).
    theme: {
      accent: "#9a5b2e",
      accentSoft: "#fbe3cf",
      ink: "#3b2616",
      chipLine: "#d9b598",
      optionsLine: "#e0b48f",
      tones: ["#ffdfc4", "#ffe8d6", "#fbd5b6"],
    },
    categorias: categorias,
    templates: templates,
  });
})();
