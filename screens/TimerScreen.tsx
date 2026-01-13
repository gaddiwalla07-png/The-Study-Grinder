
import React, { useState, useEffect } from 'react';
import { AppConfig, DEFAULT_CONFIG } from '../types';

export const TimerScreen: React.FC = () => {
  const [config] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('sanctuary_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [timeLeft, setTimeLeft] = useState(config.focusDuration * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (config.focusDuration * 60)) * 880;

  return (
    <div className="fixed inset-0 z-[100] animate-fadeIn">
      {/* Uses the user-selected wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${config.wallpaper}?auto=format&fit=crop&q=80&w=2560')` }}
      />
      <div className="absolute inset-0 backdrop-blur-md bg-black/10" />

      <div className="relative z-10 h-full flex flex-col text-white">
        <header className="p-6 flex justify-between items-center">
          <button className="material-symbols-outlined opacity-70">arrow_back_ios</button>
          <div className="flex items-center gap-2 opacity-80">
            <span className="material-symbols-outlined text-sm">nature</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Deep Focus</span>
          </div>
          <button className="material-symbols-outlined opacity-70">volume_up</button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative flex items-center justify-center w-80 h-80 mb-16">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 300 300">
              <circle cx="150" cy="150" fill="none" r="140" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <circle 
                cx="150" cy="150" fill="none" r="140" stroke="white" strokeWidth="2" 
                strokeDasharray="880" strokeDashoffset={880 - progress} 
                className="transition-all duration-1000"
              />
            </svg>
            <div className="text-center">
              <div className="text-7xl font-light tracking-tighter mb-2">{formatTime(timeLeft)}</div>
              <div className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">Session Flow</div>
            </div>
          </div>

          <div className="flex gap-6 items-center w-full max-w-[280px]">
            <button 
              onClick={() => setIsActive(!isActive)}
              className="flex-1 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all"
            >
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button 
              onClick={() => { setTimeLeft(config.focusDuration * 60); setIsActive(false); }}
              className="flex-1 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/20 text-white/60 hover:bg-white/20 active:scale-95 transition-all"
            >
              End
            </button>
          </div>
        </main>

        <footer className="pb-20 text-center px-6">
          <p className="font-serif italic text-white/80 text-xl tracking-wide leading-relaxed">
            "Your journey lasts {config.focusDuration} minutes."
          </p>
        </footer>
      </div>
    </div>
  );
};
