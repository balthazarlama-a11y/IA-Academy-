# Plan De Implementación Basado En Benchmark De herramientasia.ai

## Objetivo
Usar lo mejor de `herramientasia.ai` para fortalecer `IA NEXUS` sin convertirla en un clon de directorio genérico.

La dirección correcta es:
- mantener la identidad editorial de IA NEXUS
- mantener el foco en estudiantes, carreras y criterio
- incorporar capas de producto que mejoren descubrimiento, retención y profundidad de uso

## Tesis Del Plan
`herramientasia.ai` gana por sistema de producto.

`IA NEXUS` gana por identidad editorial.

La implementación debe combinar ambas cosas:
- `IA NEXUS` sigue siendo una plataforma editorial curada
- pero añade capas de descubrimiento reales:
  - búsqueda
  - guardados
  - tendencias
  - páginas por caso de uso
  - fichas de herramienta más profundas

## Lo Que Sí Vamos A Copiar
1. búsqueda global visible y útil
2. página de tendencias
3. sistema de guardados por usuario
4. tool detail más rico
5. interlinking fuerte entre tools y blog
6. screenshots y media real en herramientas
7. taxonomía por caso de uso o tarea
8. señales suaves de engagement

## Lo Que No Vamos A Copiar
1. descripciones SEO infladas y mecánicas
2. navegación demasiado cargada
3. catálogo sobredenso sin criterio editorial
4. cards excesivamente saturadas de métricas
5. promesa de valor basada solo en cantidad

## Estado Actual De IA NEXUS

### Fortalezas actuales
- identidad editorial clara
- framing por carreras
- home, blog y hubs más sobrios que un directorio clásico
- tools y posts ya conviven en el producto
- admin operativo
- careers-only ya integrado

### Debilidades actuales
- no hay búsqueda global pública útil
- no hay sistema de guardados
- no hay superficie de tendencias
- tool detail todavía es demasiado liviano
- no existe una taxonomía clara por caso de uso
- discovery todavía depende mucho de carreras y navegación manual

## Principios De Implementación
1. no romper el framing editorial
2. no sobrecargar las cards
3. no construir features de producto sin utilidad visible
4. toda nueva capa debe mejorar al menos una de estas tres cosas:
   - descubrimiento
   - retención
   - profundidad de decisión
5. cada fase debe poder validarse sola antes de abrir la siguiente

## Roadmap General

### Fase 1: Discovery Foundations
Objetivo:
Agregar las capas mínimas de descubrimiento que hoy faltan.

#### Entregables
1. búsqueda global pública
2. entrada visible a tendencias
3. señales de guardado preparadas en UI
4. tool detail con screenshot principal
5. mayor interlinking entre tool y guía

#### Alcance funcional
##### 1. Búsqueda global
- agregar acceso a búsqueda en header
- crear página pública de búsqueda
- permitir buscar por:
  - nombre
  - descripción
  - carrera
  - plan
  - tipo de IA
  - guías relacionadas
- mostrar resultados con cards compactas y claras

##### 2. Tendencias
- crear página `/tendencias` o equivalente
- mostrar herramientas con mayor señal reciente
- fase 1 puede usar una mezcla simple de:
  - featured
  - últimas guías publicadas
  - mayor interacción interna disponible
- dejar abierta la evolución posterior del ranking

##### 3. Guardado visible aunque sea sin loop completo
- incorporar botón de guardar en tool detail
- preparar CTA de login si el usuario no está autenticado
- no forzar todavía toda la experiencia social

##### 4. Screenshot en tool detail
- agregar campo opcional de screenshot o media principal para tools
- mostrarlo bajo el resumen inicial
- mantener logo como identidad principal y screenshot como contexto de uso

##### 5. Tool-guide linking
- aumentar visibilidad de guías relacionadas
- permitir que una tool destaque mejor su guía principal
- mejorar el bloque actual de posts relacionados

#### Dependencias
- backend de búsqueda o consulta compuesta
- soporte de media adicional en tools
- decisión de naming final de la ruta de tendencias

#### Criterio de éxito
- un usuario puede descubrir una herramienta sin pasar por carrera
- una tool detail se siente más útil antes de salir al sitio externo
- el header deja de depender solo de navegación estática

Nota:
Parte de esta base ya existe en el producto. La Fase 1 deja el suelo levantado; la Fase 1.5 cierra la capa de discovery para que las fases siguientes no hereden una busqueda inmadura.

## Fase 1.5: Search Cleanup / Relevance Pass
Objetivo:
Cerrar la capa de busqueda y filtros antes de seguir abriendo fases mas profundas.

IA NEXUS gana por criterio editorial, pero ese criterio solo sirve si la busqueda responde a la intencion del usuario de forma limpia y confiable. Esta fase no agrega una capa nueva de producto; termina de madurar una capa que ya existe.

#### Entregables
1. search UX mas clara y consistente
2. filtros visibles, utiles y faciles de resetear
3. relevancia mejor alineada con intencion
4. estados vacios y sin resultados mas utiles
5. cards de resultado mas legibles y menos ruidosas

#### Alcance funcional
##### 1. Search UX cleanup
- simplificar el recorrido entre buscar, filtrar y abrir resultados
- hacer visibles los filtros activos y su estado de limpieza
- reducir friccion en mobile
- aclarar query state, placeholders y mensajes de ayuda
- evitar una interfaz que se sienta como lista generica sin contexto

##### 2. Search relevance cleanup
- ajustar el orden de resultados para que responda mejor a la intencion
- priorizar coincidencia en nombre, luego descripcion, luego guia, carrera y tipo segun señales existentes
- resolver empates con señales editoriales ya disponibles
- evitar grupos de resultados poco utiles al inicio de la lista
- mantener la formula sencilla y explicable, no un ranking opaco

##### 3. Filtros y claridad
- revisar filtros existentes para eliminar ruido
- mantener solo filtros que ayuden a decidir
- reforzar etiquetas, chips y copy para que el usuario entienda por que algo aparecio
- preparar base para filtros mas serios luego sin introducir taxonomia nueva innecesaria

##### 4. Empty states / no-result states
- cuando la busqueda no devuelve nada, mostrar alternativas utiles
- sugerir ajustes de query o filtros
- evitar pantallas vacias que parezcan fallo del sistema

#### Dependencias
- busqueda publica ya existente
- filtros y taxonomia actuales de tools
- señales editoriales ya disponibles en tools, guide links y featured
- criterios de contenido editorial ya existentes

#### Criterio de exito
- un usuario entiende por que obtuvo esos resultados
- la busqueda se siente confiable y no accidental
- los filtros ayudan a reducir el set sin confundir
- la capa de discovery queda lista para fases posteriores sin deuda conceptual

## Fase 2: Tool Detail As Product Surface
Objetivo:
Convertir la ficha de herramienta en una unidad de decisión real, no solo una ficha editorial bonita.

#### Entregables
1. bloque estructurado de overview
2. bloque “para quién es”
3. bloque “qué problema resuelve”
4. bloque de pricing más claro
5. alternativas relacionadas visibles
6. task/use-case links dentro de la ficha
7. video demo opcional

#### Alcance funcional
##### 1. Overview estructurado
Agregar secciones fijas o semi-fijas:
- descripción general
- para quién sirve
- qué problema resuelve
- por qué conviene usarla

##### 2. Pricing mejor resuelto
- dejar de depender solo del badge del plan
- mostrar:
  - modelo de acceso
  - precio desde
  - beneficio académico si existe

##### 3. Alternativas
- mostrar alternativas relacionadas en la misma categoría o caso de uso
- priorizar alternativas realmente relevantes, no una lista arbitraria

##### 4. Casos de uso visibles
- mostrar para qué tareas concretas sirve la herramienta
- enlazar a páginas de uso o colecciones futuras

##### 5. Media
- logo
- screenshot del producto
- video embed opcional
- preferir carga progresiva si hay video

#### Dependencias
- modelo de datos enriquecido para tools
- definición de casos de uso canónicos
- soporte de video opcional para tools

#### Criterio de éxito
- una tool detail permite decidir mejor sin salir inmediatamente del sitio
- aumenta la profundidad de lectura y el valor editorial de la ficha

## Fase 3: Saved / Retention Loop
Objetivo:
Crear un loop real de retorno al producto.

#### Entregables
1. guardar/quitar de guardados
2. página de guardados por usuario
3. login con redirect de vuelta
4. señales de cuenta más útiles en header

#### Alcance funcional
##### 1. Guardado de tools
- botón guardar en cards seleccionadas y detalle
- estado persistente por usuario autenticado

##### 2. Página de guardados
- listar tools guardadas
- permitir quitar y abrir detalle
- preparar espacio para futuras colecciones

##### 3. Auth flow
- si el usuario intenta guardar sin sesión:
  - ir a login
  - volver al contexto original

##### 4. UX de retorno
- destacar “guardados” en navegación
- usarlo como ancla de producto, no como CTA vacía

#### Dependencias
- tabla o relación de saved tools
- flujo auth consistente
- UI state hidratado en cliente para guardados

#### Criterio de éxito
- el usuario tiene una razón clara para volver
- `IA NEXUS` deja de ser solo lectura y pasa a ser herramienta de trabajo personal

## Fase 4: Trends / Ranking Layer
Objetivo:
Dar visibilidad editorial a lo que vale la pena mirar ahora.

#### Entregables
1. ranking de tendencias
2. criterios visibles o internamente coherentes
3. cards con señal de ranking
4. integración con home y feed

#### Alcance funcional
##### 1. Página de tendencias
- top tools recientes o relevantes
- ranking visible
- criterio de orden claro

##### 2. Señales posibles
- clicks salientes
- herramientas con guía nueva
- herramientas destacadas por staff
- herramientas más guardadas
- herramientas más consultadas

##### 3. Integración editorial
- no convertirlo en leaderboard vacío
- usar tendencias como mezcla entre señal de uso y criterio editorial

#### Dependencias
- eventos o indicadores mínimos de interacción
- decisión de fórmula de ranking

#### Criterio de éxito
- existe una superficie clara de “qué revisar hoy”
- la página agrega valor y no solo ruido

## Fase 5: Use Case Taxonomy
Objetivo:
Construir una segunda capa de descubrimiento por intención, no solo por carrera.

#### Entregables
1. taxonomía de casos de uso
2. páginas de caso de uso
3. enlaces desde tools y blog
4. relación carrera + caso de uso

#### Alcance funcional
##### 1. Casos de uso iniciales
No replicar cientos de tareas.
Empezar con un set curado y útil:
- resumir PDFs
- estudiar mejor
- preparar presentaciones
- investigar papers
- escribir trabajos
- organizar apuntes
- crear imágenes para entregas
- hacer videos explicativos
- aprender idiomas
- automatizar estudio o investigación

##### 2. Landing por caso de uso
Cada caso de uso debe tener:
- título claro
- breve contexto
- tools recomendadas
- guías relacionadas
- filtros suaves si hace falta

##### 3. Cruce con carreras
- una tool puede servir a varias carreras
- pero cada caso de uso ayuda al usuario que no sabe aún por dónde entrar

#### Dependencias
- modelo de datos para use cases
- decisión editorial de cuáles son canónicos
- linking desde admin o relación derivada

#### Criterio de éxito
- un usuario puede entrar por problema real en vez de entrar por taxonomía abstracta
- mejora SEO sin inflar copy

## Fase 6: Search And Discovery System Maturity
Objetivo:
Unificar búsqueda, tendencias, guardados, carreras y casos de uso en una experiencia coherente.

#### Entregables
1. búsqueda con filtros compuestos
2. surfaces “para ti” o equivalentes editoriales
3. cards con señales justas
4. mejor distribución de home

#### Alcance funcional
##### 1. Búsqueda avanzada
- combinar:
  - carrera
  - plan
  - nivel
  - tipo
  - caso de uso
  - con guía / sin guía

##### 2. Home conectada al sistema
- la portada debe abrir a:
  - tendencias
  - últimas herramientas
  - casos de uso destacados
  - carreras destacadas
  - lecturas clave

##### 3. Personalización ligera
- no hace falta algoritmo complejo al inicio
- basta una capa útil de:
  - guardados
  - últimas consultadas
  - recomendado editorialmente

#### Dependencias
- consolidación de fases 1 a 5

#### Criterio de éxito
- el producto ya no depende de una sola puerta de entrada
- discovery y editorial trabajan juntas

## Priorización Recomendada

### Prioridad inmediata
1. Fase 1.5: search UX cleanup
2. Fase 1.5: search relevance cleanup
3. filtros y estados vacios de discovery
4. detalle de herramienta solo en lo que refuerza la decision

### Prioridad siguiente
1. guardados
2. tool detail enriquecido
3. tendencias con ranking mas serio

### Prioridad posterior
1. casos de uso
2. experiencia “para ti”

## Orden De Trabajo Recomendado Para Agentes

### Workstream 1
`search-ux-cleanup`
- query state
- filter chips
- empty states
- result cards

### Workstream 2
`search-relevance-cleanup`
- ranking de resultados
- weighting de campos
- intent matching

### Workstream 3
`tool-detail-enrichment`
- screenshot
- overview
- pricing
- related alternatives
- task links

### Workstream 4
`trending-surface`
- trends page
- ranking cards
- home integration

### Workstream 5
`saved-tools-loop`
- save action
- saved page
- auth redirect flow

### Workstream 6
`use-cases-taxonomy`
- data model
- initial curated pages
- linking from tools and blog

## Reglas Para No Perder El Foco
1. no copiar diseño por copiar diseño
2. no meter métricas irrelevantes
3. no abrir taxonomías gigantes sin curación
4. no inflar textos por SEO
5. no perder la identidad editorial de IA NEXUS
6. cada feature nueva debe responder:
   - ¿mejora discovery?
   - ¿mejora retención?
   - ¿mejora decisión?

## Definición De Éxito Del Benchmark
Este benchmark estará bien implementado cuando:
- IA NEXUS siga sintiéndose editorial
- pero tenga mejores loops de producto
- y un usuario pueda:
  - descubrir
  - guardar
  - comparar
  - volver
  - decidir mejor

## Próximo Paso
Usar este documento como fuente única para lanzar agentes por fases, empezando por:
1. search UX cleanup
2. search relevance cleanup
3. enriquecimiento de tool detail

