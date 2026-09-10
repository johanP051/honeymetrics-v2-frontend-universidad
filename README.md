# 🍯 HoneyMetrics v2 — Frontend Universitario

> **Cátedra de Ingeniería de Software — Universidad de Cundinamarca (UDEC Facatativá)**  
> **Integrantes:** Johan Sebastián Posada Beltrán & Juan Pablo Fonseca Celis  
> **Tecnología:** React 18 + Vite (SWC) + Dark CTI Theme + Mocks Offline  

---

## 📑 Tabla de Contenido (Índice de Navegación)
1. [Visión General del Frontend](#-visión-general-del-frontend)
2. [Puesta en Marcha Rápida (Node.js & Vite)](#-puesta-en-marcha-rápida-nodejs--vite)
3. [Variables de Entorno y Conexión con el Backend](#-variables-de-entorno-y-conexión-con-el-backend)
4. [Sistema de Mocks y Modo de Contingencia Offline](#-sistema-de-mocks-y-modo-de-contingencia-offline)
5. [Ejecución en Docker (Nginx SPA Proxy)](#-ejecución-en-docker-nginx-spa-proxy)
6. [Enlaces a Documentación de Contratos y Scrum](#-enlaces-a-documentación-de-contratos-y-scrum)

---

## 📖 Visión General del Frontend

HoneyMetrics Frontend es una **Single Page Application (SPA)** desacoplada, diseñada para la visualización en tiempo real de eventos de seguridad y métricas de Honeypots.

### Principios de Diseño
- **Dark Cybersecurity UI:** Paleta de colores oscuros inspirada en centros de operaciones de seguridad (SOC).
- **Contratos Fuertes (API-First):** Consume estrictamente los contratos JSON tipados expuestos por los DTOs de FastAPI.
- **Client-Side Offloading:** Tareas pesadas de renderizado y exportación de reportes se procesan directamente en el navegador.

---

## 🚀 Puesta en Marcha Rápida (Node.js & Vite)

### Requisitos Previos
- Node.js 18+ o 20+
- Gestor de paquetes `npm` (o `pnpm`)

### Comandos de Ejecución
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local

# 3. Iniciar servidor de desarrollo con Live-Reload (SWC)
npm run dev
```
La aplicación abrirá por defecto en: [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Variables de Entorno y Conexión con el Backend

Crea un archivo `.env.local` en la raíz del frontend para definir hacia dónde apunta la API:

```bash
# Archivo: .env.local

# URL Base de la API de Backend (en desarrollo apunta al puerto 8001 de HoneyMetrics v2)
VITE_API_BASE_URL="http://localhost:8001/api/v1"

# Modo de datos ("live" para consultar backend, "mock" para datos simulados offline)
VITE_DATA_MODE="live"
```

---

## 🛡️ Sistema de Mocks y Modo de Contingencia Offline

Para evitar el temido error de *"Network Error"* durante una sustentación universitaria o cuando la red Wi-Fi de la universidad aísla los puertos locales:
1. **Fallback Automático:** Si una petición `fetch` hacia el backend falla por timeout o error de red, el hook de datos conmuta automáticamente al catálogo de **Mocks JSON**.
2. **Banner Dorado Informativo:** La interfaz no se congela ni muestra contadores en cero; muestra un banner superior informando que los datos mostrados son de contingencia CTI.
3. **Desarrollo Paralelo:** Permite que Juan Pablo avance en la construcción de componentes visuales en React antes de que Johan termine de exponer el endpoint real en FastAPI.

---

## 🐳 Ejecución en Docker (Nginx SPA Proxy)

Para simular un entorno de producción idéntico al de despliegue en la nube:

```bash
# Construir y levantar con Docker Compose
docker compose up -d
```
Nginx compilará los estáticos de React con el builder multi-etapa y los servirá en el puerto `80` (o `3000`), haciendo proxy reverso seguro hacia las rutas `/api/` del backend.

---

## 🔗 Enlaces a Documentación de Contratos y Scrum

- 🤝 [Coordinación de Contratos API y Formato JSON (docs/arquitectura/contratos-api-y-json.md)](../honeymetrics-v2-backend-universidad/docs/arquitectura/contratos-api-y-json.md)
- 📋 [Backlog del Sprint 1 para Trello](../honeymetrics-v2-documentacion-universidad/docs/sprints/sprint_1_backlog.md)
- 🎓 [Guía de Aprendizaje Guiado con IA](../honeymetrics-v2-backend-universidad/docs/metodologia/aprendizaje-guiado-ia.md)
