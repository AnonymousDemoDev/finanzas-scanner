import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SuccessAnimation } from './components/SuccessAnimation';
import { DashboardTab } from './components/tabs/DashboardTab';
import { HistorialTab } from './components/tabs/HistorialTab';
import { AjustesTab } from './components/tabs/AjustesTab';
import { CameraCapture } from './components/CameraCapture';
import { LayoutDashboard, History, Settings } from 'lucide-react';

const TABS = [
  { id: 0, name: 'Dashboard', icon: LayoutDashboard },
  { id: 1, name: 'Historial', icon: History },
  { id: 2, name: 'Ajustes', icon: Settings }
];

export default function App() {
  const { isLoading, loadConfig, currentTab, setCurrentTab, config } = useAppStore();
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);
  
  // Aplicar tema cuando cambie la configuración
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (config?.modoOscuro) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [config?.modoOscuro]);
  
  const handleCameraSuccess = () => {
    setMostrarCamara(false);
    setMostrarExito(true);
  };
  
  const handleSuccessComplete = () => {
    setMostrarExito(false);
    setCurrentTab(0); // Volver al dashboard
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Contenido principal */}
      <main className="pb-20">
        {currentTab === 0 && <DashboardTab onOpenCamera={() => setMostrarCamara(true)} />}
        {currentTab === 1 && <HistorialTab />}
        {currentTab === 2 && <AjustesTab />}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-around px-4 py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Cámara Modal */}
      {mostrarCamara && (
        <CameraCapture 
          onClose={() => setMostrarCamara(false)}
          onSuccess={handleCameraSuccess}
        />
      )}
      
      {/* Animación de éxito */}
      {mostrarExito && (
        <SuccessAnimation 
          message="¡Gasto guardado con éxito!"
          onComplete={handleSuccessComplete}
        />
      )}
    </div>
  );
}
