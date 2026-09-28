---
name: react-swc-patterns
description: >-
  Skill maestra de desarrollo en React 18 + Vite (SWC) para HoneyMetrics Frontend. Gobierna la arquitectura
  de Custom Hooks, componentes atómicos por dominio, sistema de Mocks Offline y diseño Dark Cybersecurity.
---

# ⚛️ React 18 + Vite (SWC) Standards (HoneyMetrics Frontend)

Esta Skill define los estándares de interfaz y desarrollo para el frontend de **HoneyMetrics 2.0**. Todo desarrollador o agente de IA que trabaje en este repositorio debe cumplir estas normas.

---

## 1. 🧩 Arquitectura de Componentes por Dominio
Los componentes no se guardan planos en `src/components/`, sino organizados por su responsabilidad:
- `src/components/layout/`: Navbar, Sidebar, StatusBanner, Footer.
- `src/components/threats/`: ThreatScoreCard, BotnetAlertBadge, AttackTimeline.
- `src/components/common/`: Botones, Modales, Spinners, Badges genéricos.
- `src/components/index.js`: Barrel export para importar componentes limpiamente.

---

## 2. 🎣 Lógica en Custom Hooks (Thin Components)
- Los componentes visuales **NO** deben realizar llamadas directas con `fetch` o `axios` dentro del JSX.
- Toda lógica de consumo de datos, estados de carga y manejo de errores se encapsula en un **Custom Hook** (ej. `src/hooks/useThreats.js`).

---

## 3. 🔌 Desarrollo Desacoplado con Mocks Offline
- Todo nuevo módulo debe contar con su dataset simulado en `src/mocks/` (ej. `threatsMockData.js`).
- Los hooks deben incorporar el mecanismo de fallback automático: si el backend está desconectado, la interfaz conmuta a modo Mock sin romperse.

---

## 4. 🎨 Sistema de Diseño (CSS Variables & Dark Theme)
- Usar las variables de color globales definidas en `src/index.css` (`var(--bg-primary)`, `var(--accent-amber)`, `var(--text-main)`).
- Tipografía estricta: `Plus Jakarta Sans` para textos y `JetBrains Mono` para IPs, hashes, subredes CIDR y código.
