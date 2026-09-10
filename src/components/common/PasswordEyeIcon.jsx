import React from 'react';

export default function PasswordEyeIcon({ isVisible, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300 focus:outline-none ${
        isVisible ? 'text-hm-gold' : 'text-hm-muted hover:text-hm-gold'
      }`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 hover:scale-110"
      >
        {/* Pestañas (desaparecen al ocultar) */}
        <g className={`transition-all duration-300 origin-center ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-y-1'}`}>
          <path d="M12 5v-2" />
          <path d="M16 6.5l1.5-1.5" />
          <path d="M8 6.5L6.5 5" />
        </g>
        
        {/* Contorno del ojo */}
        <path d="M3 12c4-6 14-6 18 0-4 6-14 6-18 0z" />
        
        {/* Pupila (desaparece al ocultar) */}
        <circle 
          cx="12" 
          cy="12" 
          r="3" 
          className={`transition-all duration-300 origin-center ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
        />

        {/* Línea diagonal tachando (aparece al ocultar) */}
        <path 
          d="M4 4l16 16" 
          className={`transition-all duration-300 ${!isVisible ? 'opacity-100 stroke-[1.5px]' : 'opacity-0 stroke-[0px]'}`}
        />
      </svg>
    </button>
  );
}
