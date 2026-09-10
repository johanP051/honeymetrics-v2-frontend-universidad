import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import AiOrbAnimation from '../components/common/AiOrbAnimation';
import { ShieldAlert } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hm-bg flex flex-col relative overflow-hidden">
      <header className="w-full p-6 absolute top-0 left-0 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="HoneyMetrics Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
          <h1 className="text-2xl font-display font-bold text-hm-gold tracking-wide">HoneyMetrics</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 pt-20 pb-10">
        <div className="text-center max-w-2xl px-4 animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-hm-text mb-6 leading-tight">
            Advanced <span className="text-hm-gold">Cyber Threat</span> Intelligence
          </h1>
          <p className="text-lg md:text-xl text-hm-muted mb-12">
            Plataforma de monitoreo y correlación de amenazas impulsada por Inteligencia Artificial y arquitecturas orientadas a eventos.
          </p>
          
          <button 
            onClick={() => navigate('/login')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-hm-gold text-hm-bg font-bold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            <ShieldAlert size={24} className="group-hover:animate-pulse" />
            <span className="text-lg">Ingresar a Plataforma</span>
          </button>
        </div>

        <div className="mt-16 w-full max-w-lg opacity-80 pointer-events-none">
          <AiOrbAnimation />
        </div>
      </main>

      <Footer />
    </div>
  );
}
