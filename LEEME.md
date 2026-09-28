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
| `data/estomago_gastritis.js` | Estómago → Gastritis (OLGA/OLGIM); se agrega a Estómago sin modificar `estomago.js` |
| `data/apendice.js` | Textos maestros de Apéndice |
| `js/assembler.js` | Ensamblador determinista (sustituye, agrega y rellena campos; no redacta) |
| `data/tiroides.js` | Textos maestros de Tiroides (PAAF / Bethesda) |
| `js/tree.js` | Árbol de navegación (categorías, variantes, secciones, combinaciones) |
| `js/search.js` | Buscador global: órganos, categorías, botones y texto de micros/diagnósticos (ignora tildes y mayúsculas) |
| `js/icons.js` | Ilustraciones de los órganos (barra lateral y cabecera); reemplazables sin tocar los datos |
| `js/app.js` | Interfaz y navegación |
| `css/styles.css` | Diseño |

## Agregar un órgano
1. Crear `data/<organo>.js` siguiendo el patrón de los existentes (datos + paleta `theme`).
2. Agregar `<script src="data/<organo>.js?v=..."></script>` en `index.html` después de `data/organs.js`.
3. (Opcional) Agregar su ilustración en `js/icons.js` con el mismo `id`; si no, se usa una genérica.
   Aparece solo en la barra lateral, la pantalla de inicio y el buscador.

## Publicar una versión nueva
Cambiar el `?v=AAAA-MM-DD` de todas las líneas de `index.html` antes de subir los archivos,
para que los navegadores descarguen los archivos nuevos y no usen copias en caché.

La interfaz no necesita cambios.

## Agregar una plantilla a un órgano existente
- Agregar la plantilla en `templates` del archivo del órgano.
- Agregar su id a la categoría correspondiente (`categorias[].templates`).
  Con 1 plantilla la categoría abre el resultado directo; con 2 o más despliega variantes.
  `showVariants: true` fuerza el paso de variante aunque haya una sola (p. ej. Adenocarcinoma).
- `micro: ""` = plantilla sin micro (el cuadro MICRO se muestra vacío).
  `sinMicro: true` además oculta el cuadro MICRO (plantillas solo con diagnóstico, p. ej. Gastritis).
- Una línea `""` en `diagnostico` = línea en blanco.
- `tone: "#..."` en un nodo del árbol fija el color de su tarjeta.
- Ayudas visuales opcionales de un nodo (no se copian ni forman parte del diagnóstico):
  `lines: [...]` líneas pequeñas bajo el nombre · `summary` hallazgos comunes de un grupo · `crumb` nombre en la ruta.

## Estructura en árbol (ver `data/tiroides.js`)
Además del formato anterior, una categoría puede ser un árbol de profundidad libre:
- `children: [...]` → despliega tarjetas hijas (cada hija puede tener sus propios hijos).
- `sections: [{ label, hint, children }]` → varios grupos de tarjetas con subtítulo.
- `template: "id"` → muestra MICRO + DIAGNÓSTICO.
- `combine: [ejes]` → una opción por eje (p. ej. Diagnóstico × Micro en Bethesda II).
