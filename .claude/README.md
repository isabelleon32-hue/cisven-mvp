# Estructura de Configuración — Cisven

Basado en **Clase C1: Global vs Local installs** de IA Masters Academy.

## Propósito

Este directorio `.claude/` contiene la configuración específica de Cisven para Claude Code.

## Estructura

```
.claude/
├── settings.json           ✅ Permisos y config (SÍ se commitea)
├── settings.local.json     ❌ Secretos locales (NUNCA se commitea)
├── README.md               📖 Este archivo
└── skills/                 (Skills específicas de Cisven, si las hay)
```

## La regla (C1)

| Tipo | Ubicación | Comentario |
|------|-----------|-----------|
| **Tuyo + reutilizable** | `~/.claude/` (global) | Skills personales, hooks generales |
| **Del proyecto** | `./.claude/` (proyecto) | Config de Cisven, skills específicas |
| **Secreto (API keys, tokens)** | `.env.local` + `.claude/settings.local.json` | NUNCA en git |

## Archivos críticos (NUNCA commitear)

- `.env.local` — variables de entorno reales (Supabase URL + ANON_KEY)
- `.claude/settings.local.json` — credenciales específicas

Ambos están en `.gitignore`.

## Flujo de trabajo

1. **Nuevo dev en el proyecto:**
   ```bash
   git clone ...
   cp .env.example .env.local
   # Rellena .env.local con valores reales
   npm install
   npm run dev
   ```

2. **Cambios en permisos o config:**
   - Edita `.claude/settings.json`
   - Commitea (está público, es seguro)
   - NO toques `settings.local.json`

3. **Nuevas credenciales:**
   - Actualiza `.env.local` localmente
   - NO subas nada a git
   - Si necesitas compartir con el equipo: usa variables de entorno de Vercel/CI

## Más info

- CLAUDE.md en raíz: contexto del proyecto, stack, seguridad
- .env.example: plantilla de variables de entorno
- Clase C1: https://iamasters.academy/ (Global vs Local installs)
