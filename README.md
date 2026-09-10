# 🍯 HoneyMetrics v2 — Frontend Universitario

> **Cátedra de Ingeniería de Software — Universidad de Cundinamarca (UDEC Facatativá)**  
> **Integrantes:** Johan Sebastián Posada Beltrán & Juan Pablo Fonseca Celis  
> **Tecnología:** React 18 + Vite (SWC) + Tailwind CSS + Mocks Offline + Nginx Multi-Etapa  

---

## 📑 Tabla de Contenido
1. [Visión General del Frontend](#-visión-general-del-frontend)
2. [Arquitectura de Carpetas y Componentes](#-arquitectura-de-carpetas-y-componentes)
3. [Guía de Puesta en Marcha con Docker Compose](#-guía-de-puesta-en-marcha-con-docker-compose)
   - [Modo Desarrollo (Vite Live Reload)](#modo-desarrollo-vite-live-reload)
   - [Modo Producción Endurecida (Nginx Runner)](#modo-producción-endurecida-nginx-runner)
4. [Ejecución en Host con Node.js & Vite](#-ejecución-en-host-con-nodejs--vite)
5. [Configuración de Entorno y Variables (.env)](#-configuración-de-entorno-y-variables-env)
6. [Sistema de Mocks Offline y Fallback Automático](#-sistema-de-mocks-offline-y-fallback-automático)
7. [Integración con el Backend (Contratos API)](#-integración-con-el-backend-contratos-api)
8. [Biblioteca de Documentación Técnica Avanzada (docs/)](#-biblioteca-de-documentación-técnica-avanzada-docs)

---

## 📖 Visión General del Frontend

HoneyMetrics Frontend v2 es la Single Page Application (SPA) para la consola visual de **Cyber Threat Intelligence (CTI)**. Desarrollada con **React 18** y compilada a ultra-alta velocidad con **Vite + SWC (Rust)**, ofrece una estética profesional *Dark Cybersecurity* inspirada en plataformas como CrowdStrike y SentinelOne.

### Capacidades Destacadas
- **Renderizado Ultrarrápido:** Arranques locales en <300 ms y HMR instantáneo con SWC.
- **Desacoplamiento Absoluto (Contract-First):** Consume estrictamente los contratos DTO en JSON del backend.
- **Resiliencia con Mocks Offline:** Si el backend no está disponible o la red Wi-Fi universitaria presenta aislamiento, conmuta de forma transparente al catálogo de datos de prueba, mostrando un banner dorado informativo.
- **Offloading al Navegador:** Exportación de reportes PDF forenses generados client-side mediante `jsPDF`.

---

## 🗺️ Arquitectura de Carpetas y Componentes

```text
honeymetrics-v2-frontend-universidad/
├── src/
│   ├── api/             # Cliente Axios con interceptores JWT y baseUrl dinámica
│   ├── components/      # Componentes atómicos organizados por dominio
│   │   ├── auth/        # Modales de autenticación, cambio de contraseña y 2FA
│   │   ├── layout/      # Topbar, Sidebar corporativo, StatusBanner
│   │   ├── settings/    # Formularios y tablas del panel de administración RBAC
│   │   └── threats/     # Métricas CTI, Threat Score y gráficos reactivos
│   ├── context/         # Contexto global de sesión y perfil de usuario
│   ├── hooks/           # Custom Hooks con fallback automático a Mocks (useThreats, useAuth)
│   ├── mocks/           # Datasets sintéticos offline para desarrollo desacoplado
│   ├── pages/           # Vistas enrutadas (Overview, Threats, Logs, Settings)
│   ├── utils/           # Generador jsPDF de evidencias y formateadores de fecha
│   ├── App.jsx          # Enrutador principal de la SPA
│   ├── main.jsx         # Punto de entrada de React 18
│   └── index.css        # Estilos globales y utilidades Tailwind CSS
├── public/              # Favicon y assets estáticos públicos
├── docs/                # Documentación técnica modular (wiki navegable)
├── Dockerfile           # Multi-etapa: Base -> Dev (Vite) -> Builder -> Runner (Nginx)
├── docker-compose.yml   # Servicio hm_v2_frontend en red compartida hm_v2_network
├── docker-compose.override.yml # Dev: puerto host 5174:5173 con Live Reload
├── docker-compose.prod.yml     # Prod: servidor Nginx optimizado en puerto host 8081
├── nginx.conf           # Configuración Nginx (Gzip, caché inmutable, proxy /api/)
├── .env.example         # Plantilla documentada de variables de entorno
└── package.json         # Dependencias React, Lucide, Tailwind, Vite SWC
```

---

## 🐳 Guía de Puesta en Marcha con Docker Compose

### Modo Desarrollo (Vite Live Reload)
Ideal para desarrollo cotidiano con recarga instantánea:

```bash
# 1. Asegurar archivo de variables
cp .env.example .env

# 2. Levantar el contenedor frontend (puerto 5174 en host para no colisionar)
docker compose up -d

# 3. Ver logs en tiempo real
docker compose logs -f frontend
```
- **Frontend disponible en:** [http://localhost:5174](http://localhost:5174)

---

### Modo Producción Endurecida (Nginx Runner)
Compila la aplicación con el builder multi-etapa y levanta un servidor Nginx con compresión Gzip:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```
- **Frontend Nginx en:** [http://localhost:8081](http://localhost:8081)

---

## 💻 Ejecución en Host con Node.js & Vite

Si no deseas utilizar Docker:

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example .env.local

# 3. Iniciar servidor Vite
npm run dev
```
- **Frontend en host:** [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Configuración de Entorno y Variables (.env)

| Variable | Propósito | Valor por Defecto |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base de la API Backend universitaria | `http://localhost:8001/api/v1` |
| `VITE_DATA_MODE` | Modo de datos: `live` (consulta backend) o `mock` (datos simulados) | `live` |

---

## 🛡️ Sistema de Mocks Offline y Fallback Automático

Para garantizar que **nunca aparezca una pantalla rota de "Network Error"** en clase:
1. Si el backend en `http://localhost:8001` no responde, los Custom Hooks (`useThreats`, `useAuth`) conmutan automáticamente a `src/mocks/`.
2. Se despliega un **StatusBanner dorado** en la cabecera informando que la plataforma está operando en contingencia de datos forenses.
3. Permite a Juan Pablo programar interfaces completas antes de que Johan despliegue el endpoint real.

---

## 🤝 Integración con el Backend (Contratos API)

- Consulta la guía de coordinación de variables JSON: [Contratos API y Formato JSON](docs/arquitectura/contratos-api-y-json.md).
- El backend expone su documentación interactiva Swagger en: `http://localhost:8001/docs`.

---

## 📚 Biblioteca de Documentación Técnica Avanzada (docs/)

- 📖 [Índice Central de Documentación](docs/README.md)
- 🤝 [Coordinación de Contratos API y JSON](docs/arquitectura/contratos-api-y-json.md)
- 📋 [Guía de Trello y Dailies de Slack](docs/guias/puesta-en-marcha-trello-slack.md)
- 🎓 [Protocolo Socrático con IA](docs/metodologia/aprendizaje-guiado-ia.md)
