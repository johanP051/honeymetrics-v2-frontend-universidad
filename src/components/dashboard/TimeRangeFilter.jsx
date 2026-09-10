import React, { useState } from 'react';
import { Calendar, ChevronDown, Check, X } from 'lucide-react';

export default function TimeRangeFilter({ filters, onChange, disabled }) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [startDate, setStartDate] = useState(filters.start_date || '');
  const [endDate, setEndDate] = useState(filters.end_date || '');
  const [errorMsg, setErrorMsg] = useState('');

  const presets = [
    { key: '24h', label: 'Últimas 24h' },
    { key: '7d', label: 'Últimos 7 días' },
    { key: '30d', label: 'Últimos 30 días' },
    { key: '90d', label: 'Último trimestre' },
  ];

  const handleSelectPreset = (key) => {
    setIsCustomOpen(false);
    setErrorMsg('');
    onChange({ range: key, start_date: undefined, end_date: undefined });
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setErrorMsg('Seleccione ambas fechas.');
      return;
    }
    if (startDate > endDate) {
      setErrorMsg('La fecha inicial debe ser anterior a la final.');
      return;
    }
    setErrorMsg('');
    setIsCustomOpen(false);
    onChange({
      range: 'custom',
      start_date: startDate,
      end_date: endDate,
    });
  };

  const isCustomActive = filters.range === 'custom' || (filters.start_date && filters.end_date);

  return (
    <div className="relative inline-flex items-center gap-1.5 bg-hm-card/90 border border-hm-border/80 p-1 rounded-xl shadow-inner backdrop-blur-md">
      {/* Botones de Presets Rápidos */}
      <div className="flex items-center gap-1">
        {presets.map((preset) => {
          const isActive = filters.range === preset.key && !isCustomActive;
          return (
            <button
              key={preset.key}
              type="button"
              disabled={disabled}
              onClick={() => handleSelectPreset(preset.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-hm-gold/20 text-hm-gold border border-hm-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                  : 'text-hm-muted hover:text-hm-text hover:bg-hm-elevated/60'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="w-[1px] h-5 bg-hm-border/80 mx-1" />

      {/* Botón de Rango Personalizado */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsCustomOpen(!isCustomOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
            isCustomActive
              ? 'bg-hm-gold text-hm-bg font-semibold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
              : 'text-hm-muted hover:text-hm-text hover:bg-hm-elevated/60'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Seleccionar rango de fechas específico"
        >
          <Calendar size={14} />
          <span>
            {isCustomActive && filters.start_date && filters.end_date
              ? `${filters.start_date} → ${filters.end_date}`
              : 'Personalizado'}
          </span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${isCustomOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Modal / Dropdown Flotante para Selección de Fechas */}
        {isCustomOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-hm-card/95 border border-hm-gold/30 rounded-xl p-4 shadow-2xl backdrop-blur-xl z-50 animate-fade-up">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-hm-border">
              <span className="text-xs font-semibold text-hm-gold flex items-center gap-1.5">
                <Calendar size={14} />
                Filtrar por Fechas
              </span>
              <button
                type="button"
                onClick={() => setIsCustomOpen(false)}
                className="text-hm-muted hover:text-hm-danger p-1 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleApplyCustom} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-hm-muted mb-1">Desde</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-hm-bg/90 border border-hm-border rounded-lg px-2.5 py-1.5 text-xs text-hm-text focus:outline-none focus:border-hm-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-hm-muted mb-1">Hasta</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-hm-bg/90 border border-hm-border rounded-lg px-2.5 py-1.5 text-xs text-hm-text focus:outline-none focus:border-hm-gold"
                />
              </div>

              {errorMsg && (
                <p className="text-[11px] text-hm-danger bg-hm-danger/10 border border-hm-danger/20 rounded p-1.5 text-center">
                  {errorMsg}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    handleSelectPreset('7d');
                  }}
                  className="px-2.5 py-1.5 text-xs text-hm-muted hover:text-hm-text transition-colors"
                >
                  Restablecer
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 bg-hm-gold text-hm-bg px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-yellow-400 transition-colors shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                >
                  <Check size={13} />
                  Aplicar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
