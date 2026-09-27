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
| `js/search.js` | Buscador secundario (ignora tildes y mayúsculas) |
| `js/app.js` | Interfaz y navegación |
| `css/styles.css` | Diseño |

## Agregar un órgano
1. Copiar `data/vesicula.js` como `data/<organo>.js` y reemplazar sus datos y su paleta (`theme`).
2. Agregar `<script src="data/<organo>.js"></script>` en `index.html` después de `data/organs.js`.

La interfaz no necesita cambios.

## Agregar una plantilla a un órgano existente
- Agregar la plantilla en `templates` del archivo del órgano.
- Agregar su id a la categoría correspondiente (`categorias[].templates`).
  Con 1 plantilla la categoría abre el resultado directo; con 2 o más despliega variantes.
  `showVariants: true` fuerza el paso de variante aunque haya una sola (p. ej. Adenocarcinoma).
- `micro: ""` = plantilla sin micro. Una línea `""` en `diagnostico` = línea en blanco.
