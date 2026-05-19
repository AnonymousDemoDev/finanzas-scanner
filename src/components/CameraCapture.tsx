import { useState, useRef } from 'react';
import { X, Camera, Check, Loader } from 'lucide-react';
import { db } from '../lib/database';
import { compressImage } from '../utils/imageUtils';
import { extractTextFromImage, parseTicketText } from '../utils/ocrUtils';

interface CameraCaptureProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIAS = ['Casa', 'Comida', 'Familia', 'Transporte', 'Viajes', 'Salud', 'Monotributo', 'Otros'];
const METODOS_PAGO = ['Transferencia', 'Tarjeta', 'Efectivo'];

export function CameraCapture({ onClose, onSuccess }: CameraCaptureProps) {
  const [paso, setPaso] = useState<'captura' | 'procesando' | 'formulario'>('captura');
  const [imagenCapturada, setImagenCapturada] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    monto: '',
    comercio: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: 'Otros',
    metodoPago: 'Transferencia' as 'Transferencia' | 'Tarjeta' | 'Efectivo',
    tarjetaNombre: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPaso('procesando');
    
    try {
      // Comprimir imagen
      const imagenComprimida = await compressImage(file);
      setImagenCapturada(imagenComprimida);
      
      // Extraer texto con OCR
      const texto = await extractTextFromImage(imagenComprimida);
      const datosExtraidos = parseTicketText(texto);
      
      // Prellenar formulario
      setFormData({
        monto: datosExtraidos.monto?.toFixed(2) || '',
        comercio: datosExtraidos.comercio || '',
        fecha: datosExtraidos.fecha 
          ? datosExtraidos.fecha.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        categoria: 'Otros',
        metodoPago: 'Transferencia',
        tarjetaNombre: ''
      });
      
      setPaso('formulario');
    } catch (error) {
      console.error('Error procesando imagen:', error);
      // Si falla OCR, mostrar formulario vacío
      setPaso('formulario');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const monto = parseFloat(formData.monto);
    if (isNaN(monto) || monto <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    
    if (!formData.comercio.trim()) {
      alert('Por favor ingresa el nombre del comercio');
      return;
    }
    
    // Guardar en la base de datos
    await db.gastos.add({
      monto,
      comercio: formData.comercio,
      fecha: new Date(formData.fecha),
      categoria: formData.categoria,
      metodoPago: formData.metodoPago,
      tarjetaNombre: formData.metodoPago === 'Tarjeta' && formData.tarjetaNombre 
        ? formData.tarjetaNombre 
        : null,
      ticketPathLocal: imagenCapturada
    });
    
    onSuccess();
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-500" />
            Escanear Ticket
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Captura */}
          {paso === 'captura' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Captura tu ticket
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  La app extraerá automáticamente el monto, comercio y fecha
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                Tomar Foto
              </button>
            </div>
          )}
          
          {/* Procesando */}
          {paso === 'procesando' && (
            <div className="text-center py-12">
              <Loader className="w-16 h-16 mx-auto text-emerald-500 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Procesando imagen...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Extrayendo datos del ticket con OCR
              </p>
            </div>
          )}
          
          {/* Formulario */}
          {paso === 'formulario' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Vista previa de imagen */}
              {imagenCapturada && (
                <div className="mb-4">
                  <img 
                    src={imagenCapturada} 
                    alt="Ticket capturado" 
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              )}
              
              {/* Monto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monto *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-lg"
                    required
                  />
                </div>
              </div>
              
              {/* Comercio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comercio *
                </label>
                <input
                  type="text"
                  value={formData.comercio}
                  onChange={(e) => setFormData({ ...formData, comercio: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              
              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Método de Pago
                </label>
                <select
                  value={formData.metodoPago}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    metodoPago: e.target.value as any 
                  })}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {METODOS_PAGO.map(metodo => (
                    <option key={metodo} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>
              
              {/* Tarjeta (solo si es Tarjeta) */}
              {formData.metodoPago === 'Tarjeta' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={formData.tarjetaNombre}
                    onChange={(e) => setFormData({ ...formData, tarjetaNombre: e.target.value })}
                    placeholder="Ej: Visa Gold, MasterCard, etc."
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
              
              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
