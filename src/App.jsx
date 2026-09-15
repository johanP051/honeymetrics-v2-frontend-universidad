export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-hm-bg text-hm-text">
      <div className="glass-card max-w-xl w-full p-8 text-center space-y-6 animate-fade-up border border-hm-border">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-hm-gold/10 border border-hm-gold/30 flex items-center justify-center shadow-lg shadow-hm-gold/5">
            <span className="text-3xl">🍯</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-hm-gold tracking-wide">
            HoneyMetrics v2.0
          </h1>
          <p className="text-sm text-gray-400 font-mono">
            Plataforma CTI & Telemetría Honeypots — UDEC Facatativá
          </p>
        </div>

        <div className="p-4 rounded-lg bg-black/30 border border-hm-border/50 text-left space-y-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Entorno Frontend Listo (Vite SWC + Tailwind)
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Estructura de carpetas limpia y preparada. El código de este proyecto se construirá paso a paso mediante aprendizaje guiado por Sprints (Scrum).
          </p>
        </div>

        <div className="text-xs text-gray-500 font-mono border-t border-hm-border/30 pt-4">
          Próximo hito: Sprint 1 — Autenticación & Control de Acceso (RBAC)
        </div>
      </div>
    </main>
  );
}
