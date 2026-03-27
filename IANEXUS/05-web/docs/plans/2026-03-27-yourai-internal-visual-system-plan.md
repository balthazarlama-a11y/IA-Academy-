# YourAI Internal Visual System Plan

Fecha: 2026-03-27
Rama: `mvpv2-diseño`
Base: `mvpv2`

## Objetivo

Refinar el sistema visual de las páginas internas de `YourAI` para que dejen de sentirse:

- demasiado blandas
- demasiado redondeadas
- demasiado pastel
- demasiado uniformes en jerarquía
- visualmente "de cartón"

La home no es el foco principal de esta pasada. El foco son las superficies internas:

- `/areas`
- `/buscar`
- `/dia-a-dia`
- `/blog`
- componentes compartidos asociados

## Evidencia observada

### Revisión visual con Playwright

Se inspeccionaron páginas reales del sitio en local:

- `/areas`
- `/blog`
- `/buscar`
- `/dia-a-dia`

Hallazgos repetidos:

1. Hay demasiadas `cards` blancas grandes con el mismo peso visual.
2. El radio de borde está demasiado alto en casi todos los niveles.
3. La diferencia entre contenedor principal, contenedor secundario y chip es insuficiente.
4. La tipografía actual funciona en la home, pero pierde precisión en páginas de filtros y utilidad.
5. Hay demasiada suavidad simultánea:
   - fondo crema
   - azul claro
   - lilac
   - mint
   - sombras suaves
   - bordes muy livianos
6. La jerarquía se resuelve con cajas en vez de con tipografía, spacing y divisores.

### Hallazgos de `ui-ux-pro-max`

Se consultaron:

- `--design-system`
- `--domain typography`
- `--domain color`
- `--domain ux`
- `--stack nextjs`

Resultados útiles:

1. El sistema actual necesita una jerarquía tipográfica más consistente.
2. La escala tipográfica debe ser más modular y menos arbitraria.
3. Las fuentes deben aplicarse desde el `layout` raíz.
4. El uso de colores debe reducirse a un sistema más controlado.

Resultados descartados:

- `Rubik / Nunito Sans`
- `Liquid Glass`
- `accent pink`

Esos resultados no encajan bien con el producto actual. Harían que `YourAI` se vea más:

- e-commerce
- branding experimental
- landing premium genérica

y menos:

- editorial
- confiable
- útil
- académicamente seria

## Diagnóstico

El problema no es solo la tipografía.

El problema es una mezcla de:

1. tipografía demasiado ornamental para vistas utilitarias
2. demasiadas superficies con la misma forma
3. demasiados radios altos
4. demasiadas sombras suaves
5. demasiada pastelización distribuida
6. poca diferencia entre:
   - hero
   - panel
   - filtro
   - resultado
   - estado vacío

## Dirección visual propuesta

## Principio rector

`YourAI` debe sentirse como un producto editorial serio con precisión de herramienta, no como una revista suave ni una landing pastel.

La dirección objetivo es:

- editorial sobria
- product UI clara
- lectura limpia
- contraste alto
- menos cajas
- más estructura

## Sistema tipográfico propuesto

### Recomendación principal

- Display/editorial: `Newsreader`
- UI/body: `Public Sans`

### Por qué

`Fraunces` funciona bien en:

- la home
- portadas
- ciertos titulares editoriales

pero en páginas internas genera exceso de ornamento en:

- filtros
- listados
- paneles
- resultados
- barras de navegación

`Newsreader` mantiene tono editorial, pero es:

- más serio
- más limpio
- más legible en títulos internos
- menos "fashion editorial"

`Public Sans` mejora:

- formularios
- filtros
- labels
- badges
- resultados
- densidad visual

sin perder claridad.

### Regla de uso

- `Newsreader`:
  - h1
  - h2 destacados
  - titulares editoriales
  - piezas de archivo/blog

- `Public Sans`:
  - navegación
  - filtros
  - botones
  - labels
  - copy utilitario
  - metadata
  - cards de resultados

## Paleta propuesta

### Problema actual

La paleta actual mezcla demasiados acentos suaves al mismo tiempo:

- azul claro
- lilac
- mint
- crema
- blanco

Eso funciona en la home, pero en interiores genera falta de definición.

### Paleta objetivo

Base:

- `--page-bg`: `#F5F2EC`
- `--page-bg-soft`: `#F2EEE7`
- `--surface`: `#FFFFFF`
- `--text-main`: `#111827`
- `--text-muted`: `#5B6474`
- `--line-muted`: `rgba(17, 24, 39, 0.14)`

Acentos:

- `--accent-main`: `#2D4BCF`
- `--accent-soft`: `#EAF0FF`

Semánticos:

- mint, lilac y similares solo para:
  - status
  - categorías especiales
  - highlights puntuales

No deben seguir siendo parte dominante del sistema general.

## Forma y superficies

### Problema actual

Todo tiene casi el mismo lenguaje:

- mismo radio alto
- mismo fondo
- misma sombra
- mismo borde tenue

### Regla nueva

#### Radios

- superficies principales: `20px` a `24px`
- superficies secundarias: `14px` a `16px`
- inputs y pills grandes: `12px` a `14px`
- chips: `9999px`

#### Sombras

Reducir blur difuso.

Usar:

- sombras cortas y más secas
- más apoyo en borde y contraste
- menos niebla visual

#### Bordes

Los bordes deben ser un poco más presentes.

No oscuros, pero sí más legibles.

## Jerarquía

### Problema actual

La jerarquía depende demasiado de:

- caja blanca
- padding
- sombra

### Solución

Resolver más con:

- tipografía
- tamaño
- peso
- reglas horizontales
- spacing vertical
- agrupación lógica

Regla:

no más `card dentro de card dentro de card` salvo cuando haya una razón clara.

## Lineamientos por página

## `/areas`

### Problema

La página está bien encaminada, pero la mezcla de bloques y filtros genera demasiada segmentación.

### Objetivo

Hacerla sentir más como una taxonomía utilitaria y menos como un collage de paneles.

### Cambios

1. Mantener un hero claro.
2. Reducir el número de subcards simultáneas.
3. Hacer el rail derecho más sobrio.
4. Dar más protagonismo a la lista de áreas y menos a cajas secundarias.
5. Usar más divisores y menos contenedores internos.

## `/buscar`

### Problema

La herramienta de búsqueda sigue sintiéndose envuelta en demasiada UI decorativa.

### Objetivo

Que se vea como una herramienta precisa.

### Cambios

1. Barra de búsqueda más protagonista.
2. Filtros más compactos.
3. Resultados con estructura más firme.
4. Menos redondez.
5. Menos aire vacío entre contenedores.

## `/dia-a-dia`

### Problema

Todo pesa parecido:

- hero
- filtros
- estados vacíos
- feed

### Objetivo

Diferenciar claramente:

- entrada editorial
- herramienta de filtrado
- contenido resultante

### Cambios

1. Hero menos boxy.
2. Filtros más tool-like.
3. Estados vacíos menos decorativos y más informativos.
4. Mayor contraste entre bloques de lectura y bloques de herramientas.

## `/blog`

### Problema

Sostiene mejor lo editorial, pero:

- el vacío se ve demasiado envuelto
- el archivo se siente más como panel que como archivo real

### Objetivo

Que el blog se vea más publicación y menos dashboard.

### Cambios

1. Mejor ritmo de headlines.
2. Menos cajas grandes.
3. Más separación por reglas y columnas.
4. Mayor jerarquía de portada vs archivo.

## Componentes transversales

## Header

Mantener estructura, pero:

- bajar un poco el aire innecesario
- reducir blandura de pills secundarias
- asegurar que tipografía y peso correspondan al nuevo sistema

## Inputs y selects

Cambiar de:

- soft rounded big

a:

- más firmes
- más nítidos
- ligeramente más compactos

## Cards de resultados

Deben pasar de:

- caja acolchada

a:

- ficha nítida
- mejor alineación
- mejor contraste tipográfico

## Estados vacíos

Deben dejar de depender de:

- icono grande + caja blanca + mucho aire

Y pasar a:

- mensaje claro
- una sola acción
- menos contenedor ornamental

## Fases de implementación

## Fase 1: Tokens y tipografía

Objetivo:

Definir la base visual correcta antes de tocar layouts.

Trabajo:

1. Cambiar fuentes base en `layout.tsx`.
2. Redefinir variables de color en `globals.css`.
3. Ajustar radios globales.
4. Ajustar sombras globales.
5. Crear reglas de superficie principal/secundaria.

Entregable:

- el sitio cambia de tono sin rehacer todavía cada página

## Fase 2: Componentes compartidos

Objetivo:

Que el sistema no dependa de page-level overrides desordenados.

Trabajo:

1. header
2. pills/chips
3. buttons
4. inputs
5. selects
6. empty states
7. cards base

Entregable:

- componentes reutilizables más consistentes

## Fase 3: `/buscar`

Objetivo:

Volverla la página más precisa del sistema.

Trabajo:

1. compactar filtros
2. reforzar barra de búsqueda
3. rediseñar layout de resultados
4. limpiar estado vacío

Entregable:

- página con sensación de herramienta real

## Fase 4: `/areas`

Objetivo:

Ordenar la taxonomía y reducir la sensación de collage.

Trabajo:

1. limpiar hero
2. simplificar rail lateral
3. bajar nesting de cards
4. reforzar jerarquía de áreas

Entregable:

- página más clara y menos acolchada

## Fase 5: `/dia-a-dia`

Objetivo:

Diferenciar el feed editorial del filtro y del contenido utilitario.

Trabajo:

1. hero
2. filtros
3. feed cards
4. estados vacíos

Entregable:

- mejor ritmo editorial

## Fase 6: `/blog`

Objetivo:

Llevar el archivo editorial a un lenguaje más serio.

Trabajo:

1. portada del archivo
2. listados
3. estado vacío
4. mejores proporciones

Entregable:

- publicación más creíble

## Criterios de aceptación

El rediseño estará bien encaminado si:

1. las páginas internas se sienten más precisas que suaves
2. la tipografía mejora la jerarquía sin recargarla
3. se reduce visualmente la sensación de "cartón"
4. disminuye el número de cajas anidadas
5. cada página tiene un bloque protagonista claro
6. los filtros y formularios se sienten más producto que revista

## Decisiones explícitas

### Sí

- usar una serif editorial más sobria
- usar una sans más institucional para UI
- reducir el exceso pastel
- reducir radios globales
- reducir shadow blur
- usar más reglas y spacing para organizar

### No

- no usar liquid glass
- no usar accent pink como color dominante
- no usar una estética e-commerce
- no seguir aumentando cajas blancas como solución universal
- no dejar `Fraunces` dominando todas las vistas internas

## Recomendación final

La dirección correcta para `YourAI` es:

- editorial sobria
- moderna
- confiable
- product-first en interiores
- menos decorativa
- más estructurada

La combinación recomendada para la siguiente implementación es:

- `Newsreader + Public Sans`
- base marfil clara
- acento azul único
- semánticos restringidos
- radios reducidos
- sombras más secas
- layouts internos menos encajonados
