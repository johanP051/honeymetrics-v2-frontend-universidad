# ♿ Regla de Accesibilidad Web (WCAG 2.2 Nivel AA)

Para el desarrollo del proyecto HoneyMetrics v2 (Frontend), el Agente debe hacer cumplir estrictamente las normas de accesibilidad web, basándose en las directrices WCAG 2.2 Nivel AA y los apuntes de clase de Ingeniería de Software II.

## 1. Principios POUR (Perceptible, Operable, Comprensible, Robusto)
- **Cero Infracciones (Zero Violations):** El código generado debe pasar satisfactoriamente las pruebas automáticas (ej. axe DevTools) reportando 0 errores de Nivel A y Nivel AA.
- **HTML Semántico Obligatorio:** Uso de etiquetas correctas (`<button>`, `<nav>`, `<main>`, `<label>`, `<dialog>`) en lugar de `<div>` con roles simulados.

## 2. Criterios de Aceptación Nivel AA Clave
- **Contraste Mínimo (1.4.3):** Todo texto e iconos deben tener una relación de contraste mínima de 4.5:1 respecto al fondo (especialmente crítico en el Dark CTI Theme).
- **Operabilidad por Teclado (2.1.1 y 2.4.7):** Toda la interfaz debe ser operable usando exclusivamente el teclado (Tab, Shift+Tab, Enter, Espacio, Flechas). El foco (`:focus`, `:focus-visible`) debe ser claramente visible; está prohibido usar `outline: none;` sin un reemplazo visual evidente.
- **Nombres Accesibles y Textos Alternativos (1.1.1):** Toda imagen no decorativa debe tener `alt`. Todo botón con ícono (sin texto visible) debe tener `aria-label` o texto oculto visualmente (`sr-only`).
- **Manejo de Errores (3.3.1):** Formularios con validación deben identificar errores con claridad (mensajes explícitos y `aria-invalid="true"`).

## 3. Pruebas Manuales
Las automatizaciones no garantizan 100% de accesibilidad. El agente, al planificar flujos de interfaz, debe indicar cómo se probará manualmente el recorrido con teclado y/o lector de pantalla (ej. NVDA/VoiceOver) para asegurar que no hay trampas de teclado y que los cambios dinámicos en React (ARIA live regions) se anuncian correctamente.
