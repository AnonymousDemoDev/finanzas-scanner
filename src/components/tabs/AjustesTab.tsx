import { useState } from 'react';
import { db } from '../../lib/database';
import { useAppStore } from '../../store/useAppStore';
import { 
  DollarSign, Percent, Moon, Sun, Bell, BellOff, 
  Download, Trash2, AlertTriangle 
} from 'lucide-react';
import { ConfirmDialog } from '../ConfirmDialog';
import { exportToCSV, shareCSV } from '../../utils/exportUtils';
import { startOfMonth, subMonths } from 'date-fns';

export function AjustesTab() {
  const { config, updateConfig } = useAppStore();
  const [ingresoTemp, setIngresoTemp] = useState(config?.ingresoEstimado?.toString() || '15000');
  const [dialogoConfirmacion, setDialogoConfirmacion] = useState<{
    tipo: 'mes' | 'todos' | null;
    paso: number;
  }>({ tipo: null, paso: 0 });
  
  const presupuestoMin = Math.round((config?.ingresoEstimado || 15000) * 0.1);
  const presupuestoMax = config?.ingresoEstimado || 15000;
  const porcentajePresupuesto = config 
    ? Math.round((config.presupuestoMaximo / config.ingresoEstimado) * 100) 
    : 75;
  
  const handleIngresoChange = (value: string) => {
    setIngresoTemp(value);
    const ingreso = parseFloat(value) || 15000;
    const nuevoPresupuesto = Math.round(ingreso * 0.75); // 75% por defecto
    updateConfig({ 
      ingresoEstimado: ingreso,
      presupuestoMaximo: nuevoPresupuesto 
    });
  };
  
  const handlePresupuestoChange = (value: number) => {
    updateConfig({ presupuestoMaximo: value });
  };
  
  const handleExportarCSV = async () => {
    const gastos = await db.gastos.toArray();
    const csv = exportToCSV(gastos);
    await shareCSV(csv, `gastos_${new Date().toISOString().split('T')[0]}.csv`);
  };
  
  const handleBorrarMes = async () => {
    if (dialogoConfirmacion.tipo === 'mes' && dialogoConfirmacion.paso === 1) {
      const inicio = startOfMonth(subMonths(new Date(), 1));
      const fin = new Date();
      
      const gastosABorrar = await db.gastos
        .where('fecha')
        .between(inicio, fin)
        .toArray();
      
      await db.gastos.bulkDelete(gastosABorrar.map(g => g.id!));
      setDialogoConfirmacion({ tipo: null, paso: 0 });
    }
  };
  
  const handleBorrarTodos = async () => {
    if (dialogoConfirmacion.tipo === 'todos' && dialogoConfirmacion.paso === 3) {
      // Borrar todos los gastos
      await db.gastos.clear();
      
      // Resetear configuración
      await updateConfig({
        ingresoEstimado: 15000,
        presupuestoMaximo: 11250,
        modoOscuro: false,
        notificacionesActivas: true
      });
      
      setIngresoTemp('15000');
      setDialogoConfirmacion({ tipo: null, paso: 0 });
    }
  };
  
  return (
    <div className="pb-24 px-4 pt-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
      {/* Parámetros Financieros */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-500" />
          Parámetros Financieros
        </h3>
        
        {/* Ingreso Mensual */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ingreso Estimado Mensual
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
              {config?.simboloMoneda || '$'}
            </span>
            <input
              type="number"
              value={ingresoTemp}
              onChange={(e) => handleIngresoChange(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-lg"
              min="0"
              step="1000"
            />
          </div>
        </div>
        
        {/* Presupuesto Máximo */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Presupuesto Máximo Mensual
            </label>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {config?.simboloMoneda || '$'}{config?.presupuestoMaximo.toLocaleString() || 0}
            </span>
          </div>
          
          <div className="mb-2">
            <input
              type="range"
              value={config?.presupuestoMaximo || 11250}
              onChange={(e) => handlePresupuestoChange(parseInt(e.target.value))}
              min={presupuestoMin}
              max={presupuestoMax}
              step="100"
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-500"
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span>10% ({config?.simboloMoneda || '$'}{presupuestoMin.toLocaleString()})</span>
            <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <Percent className="w-4 h-4" />
              {porcentajePresupuesto}%
            </div>
            <span>100% ({config?.simboloMoneda || '$'}{presupuestoMax.toLocaleString()})</span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            💡 Tip: El presupuesto recomendado es el 75% de tus ingresos
          </p>
        </div>
        
        {/* Configuración de Moneda */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Moneda Local
          </label>
          <select
            value={`${config?.moneda || 'ARS'}|${config?.simboloMoneda || '$'}`}
            onChange={(e) => {
              const [moneda, simbolo] = e.target.value.split('|');
              updateConfig({ moneda, simboloMoneda: simbolo });
            }}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ARS|$">🇦🇷 Peso Argentino ($)</option>
            <option value="USD|US$">🇺🇸 Dólar Estadounidense (US$)</option>
            <option value="EUR|€">🇪🇺 Euro (€)</option>
            <option value="MXN|$">🇲🇽 Peso Mexicano ($)</option>
            <option value="COP|$">🇨🇴 Peso Colombiano ($)</option>
            <option value="CLP|$">🇨🇱 Peso Chileno ($)</option>
            <option value="UYU|$">🇺🇾 Peso Uruguayo ($)</option>
            <option value="BRL|R$">🇧🇷 Real Brasileño (R$)</option>
          </select>
        </div>
      </div>
      
      {/* Preferencias de Interfaz */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
          Preferencias de Interfaz
        </h3>
        
        {/* Modo Oscuro */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {config?.modoOscuro ? (
              <Moon className="w-6 h-6 text-purple-500" />
            ) : (
              <Sun className="w-6 h-6 text-amber-500" />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Modo Oscuro</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {config?.modoOscuro ? 'Activado' : 'Desactivado'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => updateConfig({ modoOscuro: !config?.modoOscuro })}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              config?.modoOscuro ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                config?.modoOscuro ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {/* Notificaciones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config?.notificacionesActivas ? (
              <Bell className="w-6 h-6 text-blue-500" />
            ) : (
              <BellOff className="w-6 h-6 text-gray-400" />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Notificaciones</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {config?.notificacionesActivas ? 'Activadas' : 'Desactivadas'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => updateConfig({ notificacionesActivas: !config?.notificacionesActivas })}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              config?.notificacionesActivas ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                config?.notificacionesActivas ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      {/* Mantenimiento y Datos */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
          Mantenimiento y Datos
        </h3>
        
        {/* Exportar CSV */}
        <button
          onClick={handleExportarCSV}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md mb-3"
        >
          <Download className="w-5 h-5" />
          Exportar Datos a CSV
        </button>
        
        {/* Borrar último mes */}
        <button
          onClick={() => setDialogoConfirmacion({ tipo: 'mes', paso: 1 })}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl font-semibold hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all mb-3"
        >
          <Trash2 className="w-5 h-5" />
          Borrar Datos del Último Mes
        </button>
        
        {/* Borrar todo */}
        <button
          onClick={() => setDialogoConfirmacion({ tipo: 'todos', paso: 1 })}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
        >
          <AlertTriangle className="w-5 h-5" />
          Borrar Todos los Datos
        </button>
      </div>
      
      {/* Diálogos de confirmación */}
      {dialogoConfirmacion.tipo === 'mes' && dialogoConfirmacion.paso === 1 && (
        <ConfirmDialog
          title="¿Borrar datos del último mes?"
          message="Esta acción eliminará permanentemente todos los gastos registrados en los últimos 30 días. No se puede deshacer."
          confirmText="Borrar"
          cancelText="Cancelar"
          danger={true}
          onConfirm={handleBorrarMes}
          onCancel={() => setDialogoConfirmacion({ tipo: null, paso: 0 })}
        />
      )}
      
      {dialogoConfirmacion.tipo === 'todos' && dialogoConfirmacion.paso === 1 && (
        <ConfirmDialog
          title="⚠️ Primera Confirmación"
          message="Estás a punto de borrar TODOS tus datos. Esto incluye todos los gastos y restablecerá la configuración a valores por defecto. ¿Estás seguro?"
          confirmText="Continuar"
          cancelText="Cancelar"
          danger={true}
          onConfirm={() => setDialogoConfirmacion({ tipo: 'todos', paso: 2 })}
          onCancel={() => setDialogoConfirmacion({ tipo: null, paso: 0 })}
        />
      )}
      
      {dialogoConfirmacion.tipo === 'todos' && dialogoConfirmacion.paso === 2 && (
        <ConfirmDialog
          title="⚠️⚠️ Segunda Confirmación"
          message="ÚLTIMA ADVERTENCIA: Todos tus datos serán eliminados permanentemente y no podrán ser recuperados. Esta acción es irreversible."
          confirmText="Continuar"
          cancelText="Cancelar"
          danger={true}
          onConfirm={() => setDialogoConfirmacion({ tipo: 'todos', paso: 3 })}
          onCancel={() => setDialogoConfirmacion({ tipo: null, paso: 0 })}
        />
      )}
      
      {dialogoConfirmacion.tipo === 'todos' && dialogoConfirmacion.paso === 3 && (
        <ConfirmDialog
          title="🚨 CONFIRMACIÓN FINAL"
          message="Escribe tu confirmación final. Presiona 'BORRAR TODO' para eliminar definitivamente todos tus datos."
          confirmText="BORRAR TODO"
          cancelText="Cancelar"
          danger={true}
          onConfirm={handleBorrarTodos}
          onCancel={() => setDialogoConfirmacion({ tipo: null, paso: 0 })}
        />
      )}
    </div>
  );
}
