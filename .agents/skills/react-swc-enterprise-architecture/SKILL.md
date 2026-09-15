---
name: react-swc-enterprise-architecture
description: >-
  Skill Maestra y Estricta de Desarrollo Frontend en React 18 + Vite (SWC) para HoneyMetrics v2.0. 
  Obliga el uso de Contract-First (Mocks), UI/UX Premium (Dark CTI Theme), offloading al cliente (jsPDF) y protección RBAC.
---

# 🛡️ HoneyMetrics v2.0: Frontend Enterprise Standards

Este documento define las reglas inquebrantables de arquitectura, UI/UX y rendimiento para este repositorio. **Todo agente de IA o desarrollador debe acatar estas directrices estrictamente antes de modificar el código.**

## 1. 🧩 Arquitectura Desacoplada (Thin Components & Fat Hooks)
- **Prohibición de Fat Components:** Los archivos `.jsx` solo renderizan UI. Ningún componente debe exceder las 200 líneas.
- **Lógica en Custom Hooks:** Toda llamada a APIs (`axios`), promesas, `setTimeout` y manejo de estado (`isLoading`, `error`) DEBE vivir en `src/hooks/`.
- **Estructura por Dominios:** 
  - `/layout`: Cascarones, Sidebar único, Navbars, `RoleGuard`.
  - `/common`: Componentes visuales genéricos (Botones, Animaciones de Canvas, Iconos SVG).
  - `/threats`, `/dashboard`, `/logs`: Componentes específicos de negocio.

## 2. 🔌 Patrón "Contract-First" (Mocks Offline Obligatorios)
- **Regla de Desarrollo:** El Frontend NO espera al Backend.
- Todo módulo nuevo debe iniciar con un dataset JSON estático en `src/mocks/`.
- Los Custom Hooks deben simular asincronía (`setTimeout` de 800ms) para diseñar los estados de carga (*Spinners/Skeletons*) y manejo de errores desde el día 1.

## 3. 🎨 Identidad Visual "CTI Premium" (Tailwind CSS)
- **Cero CSS Inline o Vanilla Bootstrap:** Usar estrictamente las variables corporativas de Tailwind (`hm-bg: #0d1117`, `hm-card: #161b22`, `hm-gold: #d4af37`).
- **Glassmorfismo:** Tarjetas y Modales deben usar la clase `.glass-card` de `index.css` (transparencias, sombras pesadas y bordes sutiles).
- **Micro-interacciones Fluidas:** Prohibidos los cambios de texto o iconos bruscos. Obligatorio el uso de `transition-all duration-500 ease-in-out` (ej. fade-in/fade-out de estados, pestañas de iconos SVG).
- **Iconografía:** Uso por defecto de `lucide-react`. Para elementos Core (Logo, Ojo de Contraseña Premium), crear componentes `<svg>` puros y estilizados con `stroke="currentColor"` y Tailwind.

## 4. 📦 Offloading y Librerías Pesadas (Prevención de OOM)
- **Reportes PDF (jsPDF + AutoTable):** Debido a restricciones de RAM en el servidor (1GB en Orange Pi), la generación de Diccionarios de ML o reportes masivos **SE HARÁ 100% EN EL CLIENTE**. Queda prohibido delegar renderizado de PDF al Backend. Toda la lógica irá en `src/utils/PdfGenerator.js`.
- **Gráficos Plotly (`react-plotly.js`):** Para mantener la identidad Dark Theme, es obligatorio inyectar: `layout={{ paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#e6edf3' } }}`. Usar siempre `useResizeHandler={true}`.

## 5. 🔐 Seguridad, RBAC y Manipulación del DOM
- **Guards RBAC:** Toda ruta privada debe estar envuelta por `<RoleGuard allowedRoles={[...]}>`. Los componentes internos deben adaptar su UI (ej. botones `disabled`) leyendo el `role` desde `AuthContext`.
- **Cero jQuery y Cero Vanilla DOM:** Prohibido usar `document.getElementById()`. El único uso permitido de `useRef` es para controlar APIs gráficas (`<canvas>`) como el Globo 3D, garantizando limpiar el *animation frame* en el `useEffect` cleanup para evitar fugas de memoria.
