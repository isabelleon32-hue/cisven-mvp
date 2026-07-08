# Cisven Seguridad y Alarmas — CLAUDE.md (Project Instructions)

> Aplicación web para ordenar flujo de comunicación cliente-instalación.  
> **Estado**: MVP en desarrollo (Sprint 1 de 4) | **Deadline**: 2026-07-21  
> **Modelo**: Demo ahora → Datos reales cuando Cisven apruebe y pague

---

## 📋 ANTES DE CUALQUIER SESIÓN, LEE ESTO

Este archivo es la "constitución" del proyecto. Define qué hacemos, cómo lo hacemos, y qué NUNCA tocamos.

**Actualizado**: 2026-07-08 (inicio Sprint 1)

---

## 🎤 Cómo Trabajar Conmigo (Isabel)

### Mi Voz
- **Directa, sin rodeos**: Di lo que pasa, no lo dores
- **Humor si aplica**: Si hay espacio, suéltalo
- **Profesional pero conversacional**: Formal cuando toca, cercana siempre

### Dinámmica de Roles
- **Yo dirijo**: Defino qué hacemos, cuándo, cómo. Decisiones finales mías.
- **Tú ejecutas**: Bajo mi criterio. Si ves alternativa mejor, propónla (pero no decidas por mí).
- **Claridad primero**: Si no está claro, pregunta. No adivines.

### Prohibiciones Generales (TODAS MIS SESIONES)
- ❌ Groserías (ni en código, ni en mensajes)
- ❌ Palabras repetidas/insistentes (si dije no, es no)
- ❌ Cambiar decisiones sin consultarme (siempre me pregunta primero)
- ❌ Commitear `.env` o credenciales (NUNCA, bajo ninguna circunstancia)

---

## 🎯 Contexto Real (NO ADIVINANZA)

### La Empresa
- **Nombre**: Cisven Seguridad y Alarmas
- **Ubicación**: Santiago, Chile
- **Tamaño**: Empresa mediana en **crecimiento rápido**
- **Problema crítico**: Caos operativo + pérdida de clientes por falta de comunicación

### El Proyecto
- **Origen**: Conversación real con Gerente/Dueño (Q2 2026)
- **Status anterior**: PAUSADO por presupuesto
- **Status ahora**: REARRANCADO — Isabel presenta MVP funcional → Cisven aprueba → Cisven paga
- **Modelo de pago**: ¿MVP funcional? → aprobación → inversión real
- **Riesgo**: Si no es excelente, no hay venta. Si lo es, hay más proyectos.

### Stakeholders
| Rol | Nombre | Responsabilidad |
|-----|--------|-----------------|
| **Dueño/Gerente** | (TBD) | Decision maker, validación sprint, aprobación final |
| **Operadora** | Isabel | Entrega, calidad, roadmap |
| **Técnico** | Claude | Ejecución, arquitectura, seguridad |

---

## 📊 Matriz de Trabajo

### Base de Datos
- **Cisven TIENE**: BD actual con clientes reales (loro, instalaciones, facturas, etc.)
- **Nosotros USAMOS**: Demo data (ficticia) durante desarrollo
- **Flujo final**: Cuando Cisven apruebe → migración de datos reales → go-live

### Validación
- **Cada sprint**: Gerente/Dueño valida avances
- **Criterio**: "¿Esto resuelve el problema de comunicación y flujo?"
- **Go/No-Go**: Decisión del stakeholder (no es técnico, es negocio)

---

## 🏗️ Stack Técnico (BLOQUEADO)

**NO CAMBIAR SIN CONVERSACIÓN CON ISABEL:**

| Capa | Tech | Motivo |
|------|------|--------|
| **Frontend** | React 19 + Vite + Tailwind CSS 4 | Performance, familiarity |
| **Backend/Auth** | Supabase (PostgreSQL, Auth, RLS) | Costo bajo, velocidad, seguridad |
| **Deploy** | Vercel | Auto-deploy, CI/CD, speed |
| **Base de datos** | PostgreSQL (Supabase) | ACID, RLS nativo, estable |
| **Validación** | bcrypt (passwords), RLS (datos) | Seguridad crítica |

---

## 🔐 SEGURIDAD (CRÍTICA — NUNCA SALTAR)

### Regla de Oro
**Cisven maneja datos de clientes reales. Una fuga = pérdida de confianza + riesgo legal.**

### P0 (NUNCA SALTEAR)
- ✅ RLS en TODAS las tablas (cliente solo ve suyo, técnico solo sus trabajos, admin ve todo)
- ✅ Hash bcrypt para ALL passwords (admin, técnico, cliente)
- ✅ Validación de roles en CADA función del Context
- ✅ `.env.local` protegido (credenciales NUNCA en código)
- ✅ 2FA en admin (versión final, después de MVP)

### P1 (ALTA)
- ✅ Logs de auditoría (quién hizo qué, cuándo)
- ✅ Rate limiting en login (anti-brute force)
- ✅ Encriptación de datos sensibles (RUT, teléfono en tránsito)

### P2 (MEDIA — BACKLOG)
- ⏳ Backup automático Supabase
- ⏳ GDPR compliance (si cliente reales lo requieren)

---

## 💻 Flujos Core (EL MVP)

### FLUJO 1: Cliente solicita Cotización
```
Cliente entra → Cotizador inteligente
  → Elige servicios (canalizado, metros, etc.)
  → Envía solicitud
→ Admin recibe → Completa precio → Responde por WhatsApp
→ Cliente recibe → Acepta o rechaza
  → Si acepta → pasa a Flujo 2
```

### FLUJO 2: Cliente agenda Instalación
```
Cliente → Elige servicio + día disponible
→ Admin recibe → Asigna técnico → Confirma fecha/hora
→ WhatsApp al cliente (confirmación)
→ WhatsApp al técnico (nueva orden de trabajo)
```

### FLUJO 3: Técnico finaliza Trabajo
```
Técnico ve trabajos asignados
  → Selecciona → Marca "en curso"
  → Registra observaciones (fotos, notas, tiempo)
  → Marca "finalizado"
→ Admin ve → Archiva automáticamente
→ Cliente ve en historial
```

### FLUJO 4: Emergencia (SOS)
```
Cliente dispara SOS
→ Alerta en admin (marquesina roja, sonido)
→ Admin contacta directo
→ Admin desactiva alerta
```

---

## 📅 Sprints (BLOQUEADO)

| Sprint | Fechas | Qué | Validación |
|--------|--------|-----|-----------|
| **1** | 2026-07-08 → 09 | Seguridad P0 + Role validation | Técnico |
| **2** | 2026-07-10 → 13 | Flujos Cliente (cotización, agenda) | Stakeholder |
| **3** | 2026-07-14 → 17 | Flujos Técnico + SOS + Reports | Stakeholder |
| **4** | 2026-07-18 → 21 | Polish + Go-live | Stakeholder (final) |

**Cada sprint termina con validación del gerente/dueño, NO con deploy automático.**

---

## 🗂️ Estructura del Repo

```
projects/cisven/
├── CLAUDE.md                    (este archivo)
├── .env.local                   (credenciales, gitignored)
├── src/
│   ├── context/
│   │   └── CisvenContext.jsx    (state + CRUD + role validation)
│   ├── lib/
│   │   └── supabase.js          (client, sin hardcodes)
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── ClienteDashboard.jsx
│   │   ├── TecnicoDashboard.jsx
│   │   ├── Login.jsx
│   │   └── CisvenLogo.jsx
│   ├── App.jsx                  (CisvenProvider wrapper)
│   └── index.css
├── package.json                 (React, Supabase, bcryptjs)
├── vite.config.js
└── .gitignore                   (.env.local, node_modules, dist)

IA Masters OS/
└── projects/briefs/cisven-seguridad/
    ├── brief.md                 (documento oficial)
    ├── PROGRESS.md              (tracker semanal)
    └── acceptance-criteria.md   (validación por sprint)
```

---

## 🚫 PROHIBICIONES

**NUNCA (sin conversación explícita con Isabel):**

- ❌ Cambiar de framework (React → Vue, Vite → Webpack, etc.)
- ❌ Agregar dependencias pesadas sin justificar
- ❌ Quitarle seguridad para ir más rápido ("saltamos RLS por ahora")
- ❌ Commitear `.env` o credenciales
- ❌ Hacer deploy a producción sin validación stakeholder
- ❌ Cambiar modelo de datos sin documentar migraciones
- ❌ Trabajar en ramas sin comunicar (siempre `main` o explícitamente acordado)

---

## ✅ CHECKLISTS

### Antes de CADA Sesión
- [ ] Leo este CLAUDE.md (CRÍTICO)
- [ ] Verifica que `.env.local` existe y tiene credenciales
- [ ] Verifica que `git status` está limpio (o cambios deliberados)
- [ ] Reviso PROGRESS.md para ver qué quedó pendiente

### Antes de CADA Commit
- [ ] ¿Cambios en `.env` o credenciales? → NO COMMITEAR
- [ ] ¿Nuevas dependencias? → Documentar en CLAUDE.md
- [ ] ¿Cambio de seguridad? → Revisar RLS + bcrypt
- [ ] ¿Commit message claro? (Convencional: `feat:`, `fix:`, `chore:`)

### Antes de CADA Sprint Release
- [ ] Todos los flujos core funcionan (sin errores)
- [ ] Validación de roles: técnico NO ve admin, cliente NO ve otros clientes
- [ ] Gerente/Dueño aprobó los cambios
- [ ] PROGRESS.md actualizado (qué hicimos, qué falta, qué aprendimos)

---

## 🤝 Comunicación

### Daily Standup (Sesiones)
- ¿Qué hicimos?
- ¿Qué falta?
- ¿Bloqueadores?
- ¿Riesgos identificados?

### Sprint Validation (Cada 4-5 días)
- Gerente/Dueño revisa
- Aprueba o pide cambios
- Documentamos feedback en PROGRESS.md

---

## 🎓 Aprendizajes (Actualizar después de cada sprint)

(Vacío — se llena con lecciones de sprints anteriores)

**Sprint 1**:
- (TBD)

---

## 📞 Escalación

**Si algo no encaja:**
1. Documentar problema en PROGRESS.md
2. Comunicar a Isabel
3. Isabel valida con Gerente/Dueño
4. Decisión conjunta → ajustar CLAUDE.md si es necesario

---

**Última actualización**: 2026-07-08 09:00 AM  
**Próxima revisión**: 2026-07-09 (fin Sprint 1)

