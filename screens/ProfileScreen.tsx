
import React, { useState, useEffect } from 'react';
import { AppConfig, DEFAULT_CONFIG, WALLPAPERS, THEME_STYLES } from '../types';

export const ProfileScreen: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('sanctuary_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [showModPanel, setShowModPanel] = useState(false);

  useEffect(() => {
    localStorage.setItem('sanctuary_config', JSON.stringify(config));
    window.dispatchEvent(new Event('storage'));
  }, [config]);

  const updateConfig = (key: keyof AppConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const themeVariants: { id: AppConfig['themeVariant']; name: string; color: string }[] = [
    { id: 'nature', name: 'Nature Glow', color: '#4A6741' },
    { id: 'midnight', name: 'Midnight Moss', color: '#1B2616' },
    { id: 'mist', name: 'Ethereal Mist', color: '#A5A58D' },
    { id: 'earth', name: 'Desert Earth', color: '#BC6C25' },
    { id: 'ocean', name: 'Oceanic Calm', color: '#2B5876' },
    { id: 'golden', name: 'Golden Hour', color: '#D4A373' },
  ];

  return (
    <div className="px-6 animate-fadeIn pb-32">
      <header className="pt-14 pb-6 flex items-center justify-between max-w-md mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-nature-moss/90">Your Sanctuary</h1>
        <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-nature-moss">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        <section className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full p-1 bg-white/40 profile-glow backdrop-blur-md transition-all">
              <img 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-white" 
                src="https://picsum.photos/id/64/400/400" 
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-nature-moss mb-1 font-serif">Willow Gardener</h2>
          <p className="text-nature-green font-bold text-sm flex items-center gap-1 opacity-70">
            <span className="material-symbols-outlined text-sm">location_on</span>
            Forest Glade
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-nature-moss/50 ml-4">Advanced Controls</h3>
          <button 
            onClick={() => setShowModPanel(true)}
            className="w-full glass-card rounded-[2.5rem] p-6 flex items-center justify-between hover:bg-white/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-nature-moss/10 rounded-2xl flex items-center justify-center group-hover:rotate-45 transition-transform">
                <span className="material-symbols-outlined text-nature-moss">settings_suggest</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-nature-moss/60">Privileged Access</p>
                <p className="text-lg font-bold text-nature-moss">Moderator Control Tower</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-nature-moss/40">arrow_forward_ios</span>
          </button>
        </section>
      </main>

      {/* Moderator Control Center Modal */}
      {showModPanel && (
        <div className="fixed inset-0 z-[200] bg-nature-moss/40 backdrop-blur-2xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="w-full max-w-md bg-white/95 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            <header className="p-8 border-b border-nature-moss/10 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-serif font-bold italic text-nature-moss leading-tight">Control Tower</h2>
                <p className="text-[9px] font-bold text-nature-moss/40 uppercase tracking-widest mt-1">Granular Sanctuary Parameters</p>
              </div>
              <button 
                onClick={() => setShowModPanel(false)}
                className="w-10 h-10 rounded-full bg-nature-moss/5 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <main className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-hide pb-24">
              {/* Wallpaper & Theme */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-nature-green uppercase tracking-[0.2em]">Atmosphere & Wallpaper</h4>
                <div className="grid grid-cols-2 gap-3">
                  {themeVariants.map(variant => (
                    <button 
                      key={variant.id}
                      onClick={() => {
                        updateConfig('themeVariant', variant.id);
                        updateConfig('theme', variant.name);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                        config.themeVariant === variant.id 
                          ? 'bg-nature-green text-white border-nature-green shadow-md' 
                          : 'bg-white text-nature-moss/70 border-nature-moss/10'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border border-white/40" style={{ background: variant.color }} />
                      <span className="text-[10px] font-bold">{variant.name}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {WALLPAPERS.map(wp => (
                    <button 
                      key={wp.id}
                      onClick={() => updateConfig('wallpaper', wp.url)}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                        config.wallpaper === wp.url ? 'border-nature-green scale-105 z-10' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={`${wp.url}?auto=format&fit=crop&q=40&w=200`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/10" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Studio */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-nature-green uppercase tracking-[0.2em]">Typography Studio</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Jakarta', name: 'Jakarta Sans', class: 'font-sans' },
                    { id: 'Playfair', name: 'Playfair Serif', class: 'font-serif' },
                    { id: 'Mono', name: 'JetBrains Mono', class: 'font-mono' },
                    { id: 'Script', name: 'Dancing Script', class: 'font-script' },
                  ].map(font => (
                    <button 
                      key={font.id}
                      onClick={() => updateConfig('fontFamily', font.id)}
                      className={`p-4 rounded-2xl border text-sm text-center transition-all ${
                        config.fontFamily === font.id 
                          ? 'bg-nature-moss text-white border-nature-moss' 
                          : 'bg-white text-nature-moss/60 border-nature-moss/10'
                      } ${font.class}`}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-nature-moss/40 uppercase">
                    <span>Text Scaling</span>
                    <span>{Math.round(config.textScale * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0.8" max="1.2" step="0.05"
                    value={config.textScale}
                    onChange={(e) => updateConfig('textScale', parseFloat(e.target.value))}
                    className="w-full accent-nature-green h-1.5 bg-nature-moss/10 rounded-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Geometry Lab */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-nature-green uppercase tracking-[0.2em]">Geometry Lab</h4>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-nature-moss/40 uppercase">
                      <span>Border Radius</span>
                      <span>{config.borderRadius}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="60" step="4"
                      value={config.borderRadius}
                      onChange={(e) => updateConfig('borderRadius', parseInt(e.target.value))}
                      className="w-full accent-nature-green h-1.5 bg-nature-moss/10 rounded-full cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-nature-moss/40 uppercase">
                      <span>Glass Blur Intensity</span>
                      <span>{config.glassBlur}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="40" step="2"
                      value={config.glassBlur}
                      onChange={(e) => updateConfig('glassBlur', parseInt(e.target.value))}
                      className="w-full accent-nature-green h-1.5 bg-nature-moss/10 rounded-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              {/* Intelligence Config */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-nature-green uppercase tracking-[0.2em]">Core Intelligence</h4>
                <div>
                  <label className="block text-[9px] font-bold text-nature-moss/40 uppercase mb-2">Primary AI Engine</label>
                  <select 
                    value={config.sageModel} 
                    onChange={(e) => updateConfig('sageModel', e.target.value)}
                    className="w-full bg-white/50 border border-nature-moss/10 rounded-2xl p-4 text-xs font-bold"
                  >
                    <option value="gemini-3-pro-preview">Gemini 3 Pro (Deep)</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                  </select>
                </div>
              </div>
            </main>

            <footer className="p-8 bg-nature-moss/5 border-t border-nature-moss/10 shrink-0">
              <button 
                onClick={() => setShowModPanel(false)}
                className="w-full bg-nature-moss text-white py-5 rounded-[2rem] font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Seal Configuration
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
