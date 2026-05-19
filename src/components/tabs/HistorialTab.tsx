import { useState } from 'react';
import { db } from '../../lib/database';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Search, Filter, X, Home, ShoppingBag, Users, 
  Car, Plane, Heart, FileText, MoreHorizontal,
  CreditCard, Banknote, ArrowRightLeft, Receipt 
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const CATEGORIA_ICONOS: Record<string, any> = {
  'Casa': Home,
  'Comida': ShoppingBag,
  'Familia': Users,
  'Transporte': Car,
  'Viajes': Plane,
  'Salud': Heart,
  'Monotributo': FileText,
  'Otros': MoreHorizontal
};

interface Filtros {
  fechaRango: 'mes_actual' | 'mes_pasado' | 'personalizado';
  metodoPago: string | null;
  categoria: string | null;
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

export function HistorialTab() {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [imagenModal, setImagenModal] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({
    fechaRango: 'mes_actual',
    metodoPago: null,
    categoria: null,
    fechaInicio: null,
    fechaFin: null
  });
  
  // Obtener todos los gastos
  const todosGastos = useLiveQuery(async () => {
    return await db.gastos.orderBy('fecha').reverse().toArray();
  }, []);
  
  // Aplicar filtros
  const gastosFiltrados = todosGastos?.filter(gasto => {
    // Filtro de búsqueda
    if (busqueda) {
      const searchLower = busqueda.toLowerCase();
      if (
        !gasto.comercio.toLowerCase().includes(searchLower) &&
        !gasto.categoria.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    // Filtro de fecha
    let fechaInicio = filtros.fechaInicio;
    let fechaFin = filtros.fechaFin;
    
    if (filtros.fechaRango === 'mes_actual') {
      fechaInicio = startOfMonth(new Date());
      fechaFin = endOfMonth(new Date());
    } else if (filtros.fechaRango === 'mes_pasado') {
      fechaInicio = startOfMonth(subMonths(new Date(), 1));
      fechaFin = endOfMonth(subMonths(new Date(), 1));
    }
    
    if (fechaInicio && gasto.fecha < fechaInicio) return false;
    if (fechaFin && gasto.fecha > fechaFin) return false;
    
    // Filtro de método de pago
    if (filtros.metodoPago && gasto.metodoPago !== filtros.metodoPago) {
      return false;
    }
    
    // Filtro de categoría
    if (filtros.categoria && gasto.categoria !== filtros.categoria) {
      return false;
    }
    
    return true;
  });
  
  const totalFiltrado = gastosFiltrados?.reduce((sum, g) => sum + g.monto, 0) || 0;
  
  const categorias = Array.from(new Set(todosGastos?.map(g => g.categoria) || []));
  const metodosPago = ['Transferencia', 'Tarjeta', 'Efectivo'];
  
  const limpiarFiltros = () => {
    setFiltros({
      fechaRango: 'mes_actual',
      metodoPago: null,
      categoria: null,
      fechaInicio: null,
      fechaFin: null
    });
  };
  
  const hayFiltrosActivos = 
    filtros.metodoPago !== null || 
    filtros.categoria !== null || 
    filtros.fechaRango !== 'mes_actual';
  
  return (
    <div className="pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header con búsqueda */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por comercio o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                hayFiltrosActivos || mostrarFiltros
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {hayFiltrosActivos && (
                <span className="bg-white text-emerald-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  ●
                </span>
              )}
            </button>
            
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
            
            <div className="ml-auto text-sm font-bold text-gray-700 dark:text-gray-300">
              Total: ${totalFiltrado.toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* Panel de filtros */}
        {mostrarFiltros && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
            {/* Rango de fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'mes_actual', label: 'Este Mes' },
                  { value: 'mes_pasado', label: 'Mes Pasado' },
                  { value: 'personalizado', label: 'Personalizado' }
                ].map(opcion => (
                  <button
                    key={opcion.value}
                    onClick={() => setFiltros({ ...filtros, fechaRango: opcion.value as any })}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filtros.fechaRango === opcion.value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {opcion.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Método de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Método de Pago
              </label>
              <div className="flex gap-2 flex-wrap">
                {metodosPago.map(metodo => (
                  <button
                    key={metodo}
                    onClick={() => setFiltros({ 
                      ...filtros, 
                      metodoPago: filtros.metodoPago === metodo ? null : metodo 
                    })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filtros.metodoPago === metodo
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {metodo}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <div className="flex gap-2 flex-wrap">
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => setFiltros({ 
                      ...filtros, 
                      categoria: filtros.categoria === categoria ? null : categoria 
                    })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filtros.categoria === categoria
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de gastos */}
      <div className="p-4 space-y-3">
        {gastosFiltrados && gastosFiltrados.length > 0 ? (
          gastosFiltrados.map((gasto) => {
            const IconoCategoria = CATEGORIA_ICONOS[gasto.categoria] || MoreHorizontal;
            
            return (
              <div
                key={gasto.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <IconoCategoria className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {gasto.comercio}
                      </h3>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        ${gasto.monto.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>{format(gasto.fecha, "d 'de' MMMM, yyyy", { locale: es })}</span>
                      <span>•</span>
                      <span className="font-medium">{gasto.categoria}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                        {gasto.metodoPago === 'Transferencia' && <ArrowRightLeft className="w-3 h-3" />}
                        {gasto.metodoPago === 'Tarjeta' && <CreditCard className="w-3 h-3" />}
                        {gasto.metodoPago === 'Efectivo' && <Banknote className="w-3 h-3" />}
                        {gasto.metodoPago}
                      </div>
                      
                      {gasto.tarjetaNombre && (
                        <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-400">
                          {gasto.tarjetaNombre}
                        </div>
                      )}
                      
                      {gasto.ticketPathLocal && (
                        <button
                          onClick={() => setImagenModal(gasto.ticketPathLocal)}
                          className="ml-auto flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Receipt className="w-3 h-3" />
                          Ver ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No se encontraron gastos
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
      
      {/* Modal de imagen */}
      {imagenModal && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setImagenModal(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setImagenModal(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            <img 
              src={imagenModal} 
              alt="Ticket" 
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
