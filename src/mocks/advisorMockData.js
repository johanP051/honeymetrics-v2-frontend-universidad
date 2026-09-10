/**
 * Mock data para Honeypot Advisor (PB-HM-65 / PB-HM-65.1).
 * Diccionarios de usuarios SSH más atacados extraídos del análisis de telemetría del Honeypot.
 */

export const topTargetedUsers = [
  {
    username: 'root',
    attempts: 98450,
    category: 'System',
    riskLevel: 'critical',
    percentage: 59.6,
  },
  {
    username: 'admin',
    attempts: 28410,
    category: 'System',
    riskLevel: 'critical',
    percentage: 17.2,
  },
  {
    username: 'postgres',
    attempts: 14220,
    category: 'Database',
    riskLevel: 'high',
    percentage: 8.6,
  },
  {
    username: 'odoo',
    attempts: 9840,
    category: 'ERP',
    riskLevel: 'high',
    percentage: 6.0,
  },
  {
    username: 'jenkins',
    attempts: 5310,
    category: 'DevOps',
    riskLevel: 'medium',
    percentage: 3.2,
  },
  {
    username: 'ubuntu',
    attempts: 3820,
    category: 'System',
    riskLevel: 'medium',
    percentage: 2.3,
  },
];
