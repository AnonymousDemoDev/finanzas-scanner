import { create } from 'zustand';
import { db, initializeDefaultConfig, ConfiguracionUsuario } from '../lib/database';

interface AppState {
  config: ConfiguracionUsuario | null;
  currentTab: number;
  isLoading: boolean;
  
  loadConfig: () => Promise<void>;
  updateConfig: (updates: Partial<ConfiguracionUsuario>) => Promise<void>;
  setCurrentTab: (tab: number) => void;
  toggleTheme: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  config: null,
  currentTab: 0,
  isLoading: true,
  
  loadConfig: async () => {
    await initializeDefaultConfig();
    const config = await db.configuracion.get(1);
    set({ config, isLoading: false });
    
    // Aplicar tema
    if (config?.modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  
  updateConfig: async (updates) => {
    await db.configuracion.update(1, updates);
    const config = await db.configuracion.get(1);
    set({ config });
    
    // Aplicar tema si cambió
    if (updates.modoOscuro !== undefined) {
      if (updates.modoOscuro) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  
  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  toggleTheme: async () => {
    const { config } = get();
    if (config) {
      await get().updateConfig({ modoOscuro: !config.modoOscuro });
    }
  }
}));
