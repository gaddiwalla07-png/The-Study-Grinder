
import React, { useState, useEffect } from 'react';
import { FlowScreen } from './screens/FlowScreen';
import { VaultScreen } from './screens/VaultScreen';
import { GrowthScreen } from './screens/GrowthScreen';
import { TimerScreen } from './screens/TimerScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AiOracleScreen } from './screens/AiOracleScreen';
import { LiveSpiritScreen } from './screens/LiveSpiritScreen';
import { Navbar } from './components/Navbar';
import { Screen, DEFAULT_CONFIG, THEME_STYLES } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('flow');
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('sanctuary_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sanctuary_config');
      if (saved) setConfig(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const style = THEME_STYLES[config.themeVariant] || THEME_STYLES.nature;
    
    // Inject Theme Colors
    root.style.setProperty('--primary-color', style.primary);
    root.style.setProperty('--sage-color', style.sage);
    root.style.setProperty('--moss-color', style.moss);

    // Inject Typography
    const fonts = {
      Jakarta: "'Plus Jakarta Sans'",
      Playfair: "'Playfair Display'",
      Mono: "'JetBrains Mono'",
      Script: "'Dancing Script'"
    };
    root.style.setProperty('--font-main', fonts[config.fontFamily as keyof typeof fonts] || fonts.Jakarta);
    root.style.setProperty('--text-scale', config.textScale.toString());

    // Inject Geometry
    root.style.setProperty('--app-radius', `${config.borderRadius}px`);
    root.style.setProperty('--glass-blur', `${config.glassBlur}px`);
    
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('${config.wallpaper}?auto=format&fit=crop&q=80&w=2560')`;
  }, [config]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'flow': return <FlowScreen />;
      case 'vault': return <VaultScreen />;
      case 'growth': return <GrowthScreen />;
      case 'timer': return <TimerScreen />;
      case 'oracle': return <AiOracleScreen />;
      case 'spirit': return <LiveSpiritScreen />;
      case 'me': return <ProfileScreen />;
      default: return <FlowScreen />;
    }
  };

  return (
    <div className="relative min-h-screen pb-32">
      <div className="fixed inset-0 bg-white/5 pointer-events-none -z-10" />
      {renderScreen()}
      <Navbar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}

export default App;
