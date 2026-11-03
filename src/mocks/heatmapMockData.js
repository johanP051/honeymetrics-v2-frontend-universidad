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

const boundedVariation = (min, max, dayIdx, hourIdx) => (
  min + ((dayIdx * 37 + hourIdx * 17 + dayIdx * hourIdx * 13) % (max - min + 1))
);

const generateMatrix = () => {
  return days.map((day, dayIdx) => {
    return hours.map((_, hourIdx) => {
      // Fines de semana (Sábado, Domingo)
      if (day === 'Sáb' || day === 'Dom') {
        return boundedVariation(0, 19, dayIdx, hourIdx);
      }

      // Lunes: Pico crítico detectado en Honeypot (11:00 y 12:00 UTC)
      if (day === 'Lun') {
        if (hourIdx === 11) return 850;
        if (hourIdx === 12) return 920;
        if (hourIdx === 10 || hourIdx === 13) return 420;
        if (hourIdx >= 8 && hourIdx <= 17) return boundedVariation(100, 219, dayIdx, hourIdx);
        return boundedVariation(15, 49, dayIdx, hourIdx);
      }

      // Martes y Miércoles: Actividad media coordinada
      if (day === 'Mar' || day === 'Mié') {
        if (hourIdx === 11 || hourIdx === 12) return boundedVariation(280, 359, dayIdx, hourIdx);
        if (hourIdx >= 9 && hourIdx <= 16) return boundedVariation(70, 129, dayIdx, hourIdx);
        return boundedVariation(15, 44, dayIdx, hourIdx);
      }

      // Jueves y Viernes: Patrón disperso de scanners y botnets
      if (day === 'Jue' || day === 'Vie') {
        if (hourIdx >= 10 && hourIdx <= 15) return boundedVariation(90, 159, dayIdx, hourIdx);
        return boundedVariation(10, 49, dayIdx, hourIdx);
      }

      return boundedVariation(10, 39, dayIdx, hourIdx);
    });
  });
};

export const predictiveHeatmapMockData = {
  days,
  hours,
  matrix: generateMatrix(),
};
