# Modelo de datos MVP (propuesto)

## Tabla: categories
- id
- slug
- name
- description

## Tabla: tools
- id
- name
- slug
- category_id
- summary
- use_case
- plan_type (free/freemium/paid/student)
- student_plan_notes
- level
- official_url
- whatsapp_group_url
- last_verified_at
- created_at

## Tabla: prompts
- id
- tool_id (nullable)
- category_id
- title
- prompt_text
- expected_output
- level
- tested_at

## Tabla: updates
- id
- title
- body
- category_id
- source_url
- published_at
- highlight (boolean)

## Tabla: profiles
- id
- email
- display_name
- role (user/admin)
- created_at

## Tabla: user_preferences
- id
- profile_id
- category_id
- wants_weekly_digest (boolean)
