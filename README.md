# 🍯 HoneyMetrics v2 — Frontend Universitario

> **Cátedra de Ingeniería de Software — Universidad de Cundinamarca (UDEC Facatativá)**  
> **Integrantes:** Johan Sebastián Posada Beltrán & Juan Pablo Fonseca Celis  
> **Tecnología:** React 18 + Vite (SWC) + Tailwind CSS / Vanilla CSS Dark CTI Theme  

---

## 🎨 Arquitectura Desacoplada (API-First & SPA)

El Frontend opera como una **Single Page Application (SPA)** completamente independiente del Backend:
- **Comunicación Asíncrona:** Consumo de la API REST mediante `fetch` / `axios` con contratos DTO tipados.
- **Patrón de Mocks Contingente:** Capacidad de alternar entre datos en vivo del backend (`/api/v1/`) y fixtures offline para demos y pruebas de interfaz en clase.
- **Tema Cyber Threat Intelligence (CTI):** Interfaz oscura de alta fidelidad optimizada para analistas SOC y directivos de ciberseguridad.

---

## 🌿 Flujo de Trabajo en Git (GitFlow)

- **`main`**: Rama de producción y entregas de sustentación final.
- **`QA`**: Rama de pruebas de integración con el backend previo a la entrega semanal.
- **`develop`**: Rama de integración activa del equipo.
- **`feat/*`**: Ramas de características (ej. `feat/auth-ui`, `feat/dashboard-widgets`).

---

## 🚀 Inicio Rápido en Desarrollo Local

```bash
# 1. Posicionarse en rama de desarrollo
git checkout develop

# 2. Instalar dependencias de Node.js
npm install

# 3. Iniciar servidor de desarrollo con Live-Reload (Vite)
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173/`
