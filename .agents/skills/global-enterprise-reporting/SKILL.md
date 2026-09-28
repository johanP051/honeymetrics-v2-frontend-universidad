---
name: global-enterprise-reporting
description: >-
  Estándar global para generación de Reportes Empresariales en PDF (jsPDF client-side)
  y Excel (xlsxwriter server-side), patrón de 5 zonas, paletas corporativas y trazabilidad con SHA-256.
---

# 📊 Global Enterprise Reporting Standard

Esta Skill define los lineamientos de diseño visual, trazabilidad y arquitectura para exportación de datos y reportes ejecutivos.

## 1. El Patrón de las 5 Zonas de Diseño
Todo reporte empresarial (PDF o Excel) debe estructurarse obligatoriamente en 5 zonas visuales:
1. **Zona 1 (Encabezado Corporativo):** Logo institucional, nombre de la organización, título del reporte y metadatos (fecha UTC, usuario generador).
2. **Zona 2 (Tarjetas KPI / Resumen Ejecutivo):** 3 a 5 métricas clave destacadas en cajas con tipografía legible.
3. **Zona 3 (Visualización Gráfica):** Gráficos de tendencias o distribuciones relevantes.
4. **Zona 4 (Tabla de Datos Detallada):** Filas alternadas (zebra striping), encabezados con contraste y formateo numérico.
5. **Zona 5 (Pie de Página con Trazabilidad):** Texto *"Documento autogenerado"*, timestamp ISO-8601, número de página `X de Y` y **Hash de Integridad SHA-256** para auditoría forense.

## 2. Generación Client-Side vs Server-Side
- **PDFs interactivos y rápidos:** `jsPDF` + `jspdf-autotable` en el navegador del cliente.
- **Excels masivos (>10k filas):** `pandas` + `xlsxwriter` en workers asíncronos (Celery / Background Tasks).
