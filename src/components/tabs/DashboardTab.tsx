import { useState, useEffect } from 'react';
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
import { generarInsights, type Insight } from '../../utils/insightsUtils';

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
  const [insights, setInsights] = useState<Insight[]>([]);
  
  // Obtener gastos del mes actual
  const gastos = useLiveQuery(async () => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return await db.gastos
      .where('fecha')
      .between(start, end, true, true)
      .toArray();
  }, []);
  
  // Obtener todos los gastos para insights
  const todosGastos = useLiveQuery(async () => {
    return await db.gastos.toArray();
  }, []);
  
  // Generar insights cuando cambien los gastos
  useEffect(() => {
    if (todosGastos && todosGastos.length > 0) {
      generarInsights(todosGastos).then(setInsights);
    }
  }, [todosGastos]);
  
  const totalGastos = gastos?.reduce((sum, g) => sum + g.monto, 0) || 0;
  const presupuesto = config?.presupuestoMaximo || 0;
  const ingresos = config?.ingresoEstimado || 0;
  const simbolo = config?.simboloMoneda || '$';
  const porcentajeGastado = presupuesto > 0 ? (totalGastos / presupuesto) * 100 : 0;
  const excedido = totalGastos > presupuesto;
  
  // Análisis por método de pago
  const gastosPorMetodo = gastos?.reduce((acc, g) => {
    acc[g.metodoPago] = (acc[g.metodoPago] || 0) + g.monto;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const dataMetodoPago = Object.entries(gastosPorMetodo).map(([metodo, monto]) => ({
    name: metodo,
    value: monto,
    porcentaje: totalGastos > 0 ? ((monto / totalGastos) * 100).toFixed(1) : '0'
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
      name: tarjeta.length > 20 ? tarjeta.substring(0, 18) + '...' : tarjeta,
      monto
    }))
    .sort((a, b) => b.monto - a.monto);
  
  // Función para formatear números grandes
  const formatMonto = (monto: number) => {
    if (monto >= 1000000) {
      return `${(monto / 1000000).toFixed(1)}M`;
    } else if (monto >= 10000) {
      return `${(monto / 1000).toFixed(0)}K`;
    }
    return monto.toLocaleString();
  };
  
  return (
    <div className="pb-24 px-4 pt-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 shadow-lg text-white">
          <TrendingUp className="w-7 h-7 mb-2 opacity-80" />
          <p className="text-xs opacity-90 mb-1">Ingresos del Mes</p>
          <p className="text-2xl font-bold break-words leading-tight">
            {simbolo}{formatMonto(ingresos)}
          </p>
        </div>
        
        <div className={`bg-gradient-to-br ${
          excedido 
            ? 'from-red-500 to-red-600' 
            : 'from-blue-500 to-blue-600'
        } rounded-2xl p-4 shadow-lg text-white`}>
          <TrendingDown className="w-7 h-7 mb-2 opacity-80" />
          <p className="text-xs opacity-90 mb-1">Total Gastos</p>
          <p className="text-2xl font-bold break-words leading-tight">
            {simbolo}{formatMonto(totalGastos)}
          </p>
        </div>
      </div>
      
      {/* Motor de Insights con IA */}
      {insights.length > 0 && (
        <div className="mb-6 space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 flex items-start gap-3 ${
                insight.tipo === 'warning' 
                  ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                  : insight.tipo === 'danger'
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : insight.tipo === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              }`}
            >
              <span className="text-2xl flex-shrink-0">{insight.icono}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold mb-1 ${
                  insight.tipo === 'warning' ? 'text-amber-800 dark:text-amber-300'
                  : insight.tipo === 'danger' ? 'text-red-800 dark:text-red-300'
                  : insight.tipo === 'success' ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-blue-800 dark:text-blue-300'
                }`}>
                  {insight.titulo}
                </h4>
                <p className={`text-sm ${
                  insight.tipo === 'warning' ? 'text-amber-700 dark:text-amber-400'
                  : insight.tipo === 'danger' ? 'text-red-700 dark:text-red-400'
                  : insight.tipo === 'success' ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-blue-700 dark:text-blue-400'
                }`}>
                  {insight.mensaje}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
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
        
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3 flex-wrap gap-2">
          <span className="break-words">Presupuesto: {simbolo}{formatMonto(presupuesto)}</span>
          <span className="break-words">Gastado: {simbolo}{formatMonto(totalGastos)}</span>
        </div>
        
        {excedido && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800 dark:text-red-300 mb-1">
                ¡Ups! Tus gastos superaron tu presupuesto
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                Excediste en {simbolo}{formatMonto(totalGastos - presupuesto)}
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
          
          {/* Tabla de métodos de pago */}
          <div className="space-y-3 mb-6">
            {Object.entries(gastosPorMetodo).map(([metodo, monto]) => {
              const porcentaje = totalGastos > 0 ? ((monto / totalGastos) * 100).toFixed(1) : '0';
              return (
                <div key={metodo} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {metodo === 'Transferencia' && <ArrowRightLeft className="w-5 h-5 text-blue-500" />}
                    {metodo === 'Tarjeta' && <CreditCard className="w-5 h-5 text-amber-500" />}
                    {metodo === 'Efectivo' && <Banknote className="w-5 h-5 text-emerald-500" />}
                    <span className="font-medium text-gray-700 dark:text-gray-300">{metodo}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 dark:text-white block">
                      {simbolo}{formatMonto(monto)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {porcentaje}% del total
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Gráfico de dona */}
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={dataMetodoPago}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={(entry: any) => `${entry.name} ${entry.porcentaje}%`}
              >
                {dataMetodoPago.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={METODO_PAGO_COLORES[entry.name] || '#64748b'} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${simbolo}${Number(value).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Distribución de Gastos por Categoría */}
      {dataCategorias.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Distribución de Gastos del Mes
          </h3>
          
          {/* Gráfico de dona centralizado */}
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dataCategorias}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name} ${entry.porcentaje}%`}
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
              >
                {dataCategorias.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORIAS_COLORES[entry.name] || '#64748b'} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${simbolo}${Number(value).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Leyenda detallada */}
          <div className="mt-6 space-y-2">
            {dataCategorias.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{ backgroundColor: CATEGORIAS_COLORES[cat.name] }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap ml-2">
                  {simbolo}{formatMonto(cat.value)} ({cat.porcentaje}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Uso de Tarjetas de Crédito/Débito */}
      {dataTarjetas.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Uso de Tarjetas de Crédito/Débito
          </h3>
          
          <ResponsiveContainer width="100%" height={Math.max(dataTarjetas.length * 60, 200)}>
            <BarChart data={dataTarjetas} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value: any) => `${simbolo}${Number(value).toLocaleString()}`} />
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
