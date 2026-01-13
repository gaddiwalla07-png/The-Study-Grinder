
export type Screen = 'flow' | 'vault' | 'growth' | 'timer' | 'me' | 'oracle' | 'spirit';

export interface Task {
  id: string;
  title: string;
  time?: string;
  location?: string;
  priority?: string;
  type: 'session' | 'task' | 'recharge';
  completed: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  modified: string;
  type: 'pdf' | 'image' | 'video' | 'folder';
  resources?: number;
  url?: string;
}

export interface AppConfig {
  sageModel: string;
  scoutModel: string;
  spiritVoice: string;
  focusDuration: number;
  theme: string;
  wallpaper: string;
  themeVariant: 'nature' | 'midnight' | 'mist' | 'earth' | 'ocean' | 'golden';
  fontFamily: 'Jakarta' | 'Playfair' | 'Mono' | 'Script';
  borderRadius: number;
  glassBlur: number;
  textScale: number;
  advancedMode: boolean;
}

export const WALLPAPERS = [
  { id: 'misty-forest', name: 'Misty Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e' },
  { id: 'emerald-lake', name: 'Emerald Lake', url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0' },
  { id: 'autumn-woods', name: 'Autumn Woods', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  { id: 'sakura', name: 'Sakura Blossom', url: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02' },
  { id: 'midnight-peaks', name: 'Midnight Peaks', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e' },
  { id: 'tropical-oasis', name: 'Tropical Oasis', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' },
  { id: 'lone-tree', name: 'Lone Tree', url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff' },
  { id: 'lavender', name: 'Lavender Fields', url: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec' },
  { id: 'desert-night', name: 'Starry Desert', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0' },
];

export const THEME_STYLES = {
  nature: { primary: '#4A6741', sage: '#A3B18A', moss: '#344E41' },
  midnight: { primary: '#1B2616', sage: '#4A6741', moss: '#0D130B' },
  mist: { primary: '#6B705C', sage: '#A5A58D', moss: '#2F3E46' },
  earth: { primary: '#BC6C25', sage: '#DDA15E', moss: '#606C38' },
  ocean: { primary: '#2B5876', sage: '#4E4376', moss: '#1A2A6C' },
  golden: { primary: '#D4A373', sage: '#E9EDC9', moss: '#FAEDCD' },
};

export const DEFAULT_CONFIG: AppConfig = {
  sageModel: 'gemini-3-pro-preview',
  scoutModel: 'gemini-3-flash-preview',
  spiritVoice: 'Kore',
  focusDuration: 25,
  theme: 'Nature Glow',
  wallpaper: WALLPAPERS[0].url,
  themeVariant: 'nature',
  fontFamily: 'Jakarta',
  borderRadius: 40,
  glassBlur: 20,
  textScale: 1,
  advancedMode: false,
};
