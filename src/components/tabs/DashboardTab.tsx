import { db } from '../../lib/database';
import { useAppStore } from '../../store/useAppStore';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, CreditCard, Banknote, 
  ArrowRightLeft, AlertCircle, Camera 
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { startOfMonth, endOfMonth } from 'date-fns';

const CATEGORIAS_COLORES: Record<string, string> = {
  'Casa': '#3b82f6',
  'Comida': '#10b981',
  'Familia': '#f59e0b',
  'Transporte': '#8b5cf6',
  'Viajes': '#ec4899',
  'Salud': '#ef4444',
  'Monotributo': '#6366f1',
  'Otros': '#64748b'
};

const METODO_PAGO_COLORES: Record<string, string> = {
  'Transferencia': '#3b82f6',
  'Tarjeta': '#f59e0b',
  'Efectivo': '#10b981'
};

interface DashboardTabProps {
  onOpenCamera: () => void;
}

export function DashboardTab({ onOpenCamera }: DashboardTabProps) {
  const { config } = useAppStore();
  
  // Obtener gastos del mes actual
  const gastos = useLiveQuery(async () => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return await db.gastos
      .where('fecha')
      .between(start, end, true, true)
      .toArray();
  }, []);
  
  const totalGastos = gastos?.reduce((sum, g) => sum + g.monto, 0) || 0;
  const presupuesto = config?.presupuestoMaximo || 0;
  const ingresos = config?.ingresoEstimado || 0;
  const porcentajeGastado = presupuesto > 0 ? (totalGastos / presupuesto) * 100 : 0;
  const excedido = totalGastos > presupuesto;
  
  // Análisis por método de pago
  const gastosPorMetodo = gastos?.reduce((acc, g) => {
    acc[g.metodoPago] = (acc[g.metodoPago] || 0) + g.monto;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const dataMetodoPago = Object.entries(gastosPorMetodo).map(([metodo, monto]) => ({
    name: metodo,
    value: monto
  }));
  
  // Distribución por categoría
  const gastosPorCategoria = gastos?.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const dataCategorias = Object.entries(gastosPorCategoria)
    .map(([categoria, monto]) => ({
      name: categoria,
      value: monto,
      porcentaje: ((monto / totalGastos) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);
  
  // Uso de tarjetas
  const gastosPorTarjeta = gastos
    ?.filter(g => g.tarjetaNombre)
    .reduce((acc, g) => {
      const tarjeta = g.tarjetaNombre!;
      acc[tarjeta] = (acc[tarjeta] || 0) + g.monto;
      return acc;
    }, {} as Record<string, number>) || {};
  
  const dataTarjetas = Object.entries(gastosPorTarjeta)
    .map(([tarjeta, monto]) => ({
      name: tarjeta,
      monto
    }))
    .sort((a, b) => b.monto - a.monto);
  
  return (
    <div className="pb-24 px-4 pt-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 shadow-lg text-white">
          <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Ingresos del Mes</p>
          <p className="text-3xl font-bold">${ingresos.toLocaleString()}</p>
        </div>
        
        <div className={`bg-gradient-to-br ${
          excedido 
            ? 'from-red-500 to-red-600' 
            : 'from-blue-500 to-blue-600'
        } rounded-2xl p-5 shadow-lg text-white`}>
          <TrendingDown className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Total Gastos</p>
          <p className="text-3xl font-bold">${totalGastos.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Termómetro del Mes */}
      <div className={`${
        excedido ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-800'
      } rounded-2xl p-6 shadow-lg mb-6`}>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Termómetro del Mes
        </h3>
        
        <div className="relative mb-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                excedido 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
              }`}
              style={{ width: `${Math.min(porcentajeGastado, 100)}%` }}
            />
          </div>
          <p className="text-center mt-2 font-bold text-2xl">
            <span className={excedido ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>
              {porcentajeGastado.toFixed(0)}%
            </span>
          </p>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span>Presupuesto: ${presupuesto.toLocaleString()}</span>
          <span>Gastado: ${totalGastos.toLocaleString()}</span>
        </div>
        
        {excedido && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800 dark:text-red-300 mb-1">
                ¡Ups! Tus gastos superaron tu presupuesto
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                Excediste en ${(totalGastos - presupuesto).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Análisis por Método de Pago */}
      {dataMetodoPago.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Análisis por Método de Pago
          </h3>
          
          <div className="space-y-3 mb-6">
            {Object.entries(gastosPorMetodo).map(([metodo, monto]) => (
              <div key={metodo} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {metodo === 'Transferencia' && <ArrowRightLeft className="w-5 h-5 text-blue-500" />}
                  {metodo === 'Tarjeta' && <CreditCard className="w-5 h-5 text-amber-500" />}
                  {metodo === 'Efectivo' && <Banknote className="w-5 h-5 text-emerald-500" />}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{metodo}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${monto.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dataMetodoPago}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataMetodoPago.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={METODO_PAGO_COLORES[entry.name] || '#64748b'} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Distribución de Gastos por Categoría */}
      {dataCategorias.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Distribución de Gastos
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataCategorias}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name} ${entry.porcentaje}%`}
                outerRadius={80}
                dataKey="value"
              >
                {dataCategorias.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORIAS_COLORES[entry.name] || '#64748b'} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-6 space-y-2">
            {dataCategorias.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: CATEGORIAS_COLORES[cat.name] }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  ${cat.value.toLocaleString()} ({cat.porcentaje}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Uso de Tarjetas */}
      {dataTarjetas.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Uso de Tarjetas de Crédito
          </h3>
          
          <ResponsiveContainer width="100%" height={Math.max(dataTarjetas.length * 50, 150)}>
            <BarChart data={dataTarjetas} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
              <Bar dataKey="monto" fill="#f59e0b" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* FAB - Botón flotante de cámara */}
      <button
        onClick={onOpenCamera}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-40"
        aria-label="Escanear ticket"
      >
        <Camera className="w-8 h-8 text-white" />
      </button>
    </div>
  );
}
