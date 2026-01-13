
import React from 'react';
import { Screen } from '../types';

interface NavbarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  const items: { screen: Screen; icon: string; label: string }[] = [
    { screen: 'flow', icon: 'calendar_month', label: 'Flow' },
    { screen: 'vault', icon: 'local_library', label: 'Vault' },
    { screen: 'timer', icon: 'timer', label: 'Focus' },
    { screen: 'oracle', icon: 'auto_awesome', label: 'Oracle' },
    { screen: 'spirit', icon: 'settings_voice', label: 'Spirit' },
    { screen: 'me', icon: 'person', label: 'Me' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-white/20 px-4 pt-4 pb-8 flex justify-between items-center z-[110] rounded-t-[32px] shadow-2xl">
      {items.map((item) => (
        <button
          key={item.screen}
          onClick={() => onNavigate(item.screen)}
          className={`flex flex-col items-center gap-1 transition-all flex-1 ${
            currentScreen === item.screen ? 'text-nature-moss scale-110' : 'text-nature-moss/30'
          }`}
        >
          <div className="relative">
            <span 
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: currentScreen === item.screen ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
