/**
 * Mock data para el módulo de Logs & Reportes (PB-HM-37 a PB-HM-41).
 * Representa el historial de solicitudes de extracción de logs crudos procesadas por Celery
 * y las que requieren aprobación humana vía webhook de Telegram (> 50,000 logs).
 */

export const initialLogsHistory = [
  {
    id: 'EXP-1045',
    date_range: '2026-08-19 / 2026-08-20',
    count: 21660,
    status: 'Listo',
    created_at: 'Agosto 20, 2026, 11:34 a.m.',
    file_format: 'JSONL',
  },
  {
    id: 'EXP-1044',
    date_range: '2026-08-01 / 2026-08-25',
    count: 112450,
    status: 'Pendiente de Aprobación',
    created_at: 'Agosto 25, 2026, 09:15 a.m.',
    file_format: 'JSONL',
  },
  {
    id: 'EXP-1043',
    date_range: '2026-08-16 / 2026-08-16',
    count: 840,
    status: 'Procesando',
    created_at: 'Agosto 16, 2026, 04:21 p.m.',
    file_format: 'JSONL',
  },
  {
    id: 'EXP-1042',
    date_range: '2026-07-01 / 2026-07-31',
    count: 145200,
    status: 'Rechazada',
    created_at: 'Julio 31, 2026, 02:00 p.m.',
    file_format: 'JSONL',
  },
];
