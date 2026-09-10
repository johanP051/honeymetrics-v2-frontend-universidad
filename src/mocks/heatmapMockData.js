/**
 * Mock data para el Heatmap de Riesgo Predictivo (PB-HM-70 / PB-HM-70.1).
 * Matriz 7x24: 7 días de la semana (Lunes a Domingo) por 24 horas del día (00:00 a 23:00 UTC).
 * Incorpora los patrones reales del Honeypot:
 * - Pico crítico: Lunes 11:00 - 12:00 UTC (850 - 920 eventos).
 * - Actividad media: Martes y Miércoles 11:00 - 13:00 UTC (~300 - 450 eventos).
 * - Actividad base baja: 10 - 50 eventos en horarios laborales/nocturnos.
 * - Fines de semana: valores mínimos / residuales (0 - 25 eventos).
 */

const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const generateMatrix = () => {
  return days.map((day) => {
    return hours.map((_, hourIdx) => {
      // Fines de semana (Sábado, Domingo)
      if (day === 'Sáb' || day === 'Dom') {
        return Math.floor(Math.random() * 20);
      }

      // Lunes: Pico crítico detectado en Honeypot (11:00 y 12:00 UTC)
      if (day === 'Lun') {
        if (hourIdx === 11) return 850;
        if (hourIdx === 12) return 920;
        if (hourIdx === 10 || hourIdx === 13) return 420;
        if (hourIdx >= 8 && hourIdx <= 17) return Math.floor(100 + Math.random() * 120);
        return Math.floor(15 + Math.random() * 35);
      }

      // Martes y Miércoles: Actividad media coordinada
      if (day === 'Mar' || day === 'Mié') {
        if (hourIdx === 11 || hourIdx === 12) return Math.floor(280 + Math.random() * 80);
        if (hourIdx >= 9 && hourIdx <= 16) return Math.floor(70 + Math.random() * 60);
        return Math.floor(15 + Math.random() * 30);
      }

      // Jueves y Viernes: Patrón disperso de scanners y botnets
      if (day === 'Jue' || day === 'Vie') {
        if (hourIdx >= 10 && hourIdx <= 15) return Math.floor(90 + Math.random() * 70);
        return Math.floor(10 + Math.random() * 40);
      }

      return Math.floor(10 + Math.random() * 30);
    });
  });
};

export const predictiveHeatmapMockData = {
  days,
  hours,
  matrix: generateMatrix(),
};
