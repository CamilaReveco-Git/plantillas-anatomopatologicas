# Plantillas Anatomopatológicas

Aplicación local para ensamblar MICRO + DIAGNÓSTICO a partir de plantillas maestras.
No usa internet, IA, servidor ni dependencias.

## Cómo abrirla
Doble clic en `index.html` (Chrome, Edge, Safari o Firefox).

## Estructura
| Archivo | Contenido |
|---|---|
| `data/organs.js` | Registro de órganos |
| `data/vesicula.js` | Textos maestros de Vesícula Biliar: categorías, plantillas, opciones y campos |
| `data/estomago.js` | Textos maestros de Estómago |
| `data/apendice.js` | Textos maestros de Apéndice |
| `js/assembler.js` | Ensamblador determinista (sustituye, agrega y rellena campos; no redacta) |
| `data/tiroides.js` | Textos maestros de Tiroides (PAAF / Bethesda) |
| `js/tree.js` | Árbol de navegación (categorías, variantes, secciones, combinaciones) |
| `js/search.js` | Buscador secundario (ignora tildes y mayúsculas) |
| `js/app.js` | Interfaz y navegación |
| `css/styles.css` | Diseño |

## Agregar un órgano
1. Crear `data/<organo>.js` siguiendo el patrón de los existentes (datos + paleta `theme`).
2. Agregar `<script src="data/<organo>.js?v=..."></script>` en `index.html` después de `data/organs.js`.

## Publicar una versión nueva
Cambiar el `?v=AAAA-MM-DD` de todas las líneas de `index.html` antes de subir los archivos,
para que los navegadores descarguen los archivos nuevos y no usen copias en caché.

La interfaz no necesita cambios.

## Agregar una plantilla a un órgano existente
- Agregar la plantilla en `templates` del archivo del órgano.
- Agregar su id a la categoría correspondiente (`categorias[].templates`).
  Con 1 plantilla la categoría abre el resultado directo; con 2 o más despliega variantes.
  `showVariants: true` fuerza el paso de variante aunque haya una sola (p. ej. Adenocarcinoma).
- `micro: ""` = plantilla sin micro. Una línea `""` en `diagnostico` = línea en blanco.

## Estructura en árbol (ver `data/tiroides.js`)
Además del formato anterior, una categoría puede ser un árbol de profundidad libre:
- `children: [...]` → despliega tarjetas hijas (cada hija puede tener sus propios hijos).
- `sections: [{ label, hint, children }]` → varios grupos de tarjetas con subtítulo.
- `template: "id"` → muestra MICRO + DIAGNÓSTICO.
- `combine: [ejes]` → una opción por eje (p. ej. Diagnóstico × Micro en Bethesda II).
