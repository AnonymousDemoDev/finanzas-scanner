import { Gasto } from '../lib/database';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export interface Insight {
  tipo: 'info' | 'warning' | 'success' | 'danger';
  icono: string;
  titulo: string;
  mensaje: string;
}

export async function generarInsights(gastos: Gasto[]): Promise<Insight[]> {
  const insights: Insight[] = [];
  
  // Obtener gastos del mes actual y anterior
  const mesActualInicio = startOfMonth(new Date());
  const mesActualFin = endOfMonth(new Date());
  const mesAnteriorInicio = startOfMonth(subMonths(new Date(), 1));
  const mesAnteriorFin = endOfMonth(subMonths(new Date(), 1));
  
  const gastosEsteMes = gastos.filter(g => 
    g.fecha >= mesActualInicio && g.fecha <= mesActualFin
  );
  
  const gastosMesAnterior = gastos.filter(g => 
    g.fecha >= mesAnteriorInicio && g.fecha <= mesAnteriorFin
  );
  
  // Análisis 1: Comparación total mes a mes
  const totalEsteMes = gastosEsteMes.reduce((sum, g) => sum + g.monto, 0);
  const totalMesAnterior = gastosMesAnterior.reduce((sum, g) => sum + g.monto, 0);
  
  if (gastosMesAnterior.length > 0) {
    const cambioTotal = ((totalEsteMes - totalMesAnterior) / totalMesAnterior) * 100;
    
    if (cambioTotal > 15) {
      insights.push({
        tipo: 'warning',
        icono: '📈',
        titulo: 'Incremento en Gastos Totales',
        mensaje: `Tus gastos aumentaron un ${cambioTotal.toFixed(1)}% respecto al mes pasado. Total actual: $${totalEsteMes.toLocaleString()}`
      });
    } else if (cambioTotal < -15) {
      insights.push({
        tipo: 'success',
        icono: '📉',
        titulo: '¡Excelente Ahorro!',
        mensaje: `Redujiste tus gastos un ${Math.abs(cambioTotal).toFixed(1)}% respecto al mes pasado. ¡Sigue así!`
      });
    }
  }
  
  // Análisis 2: Comparación por categoría
  const categoriasPorMes = (gastos: Gasto[]) => {
    return gastos.reduce((acc, g) => {
      acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
      return acc;
    }, {} as Record<string, number>);
  };
  
  const categoriasActual = categoriasPorMes(gastosEsteMes);
  const categoriasAnterior = categoriasPorMes(gastosMesAnterior);
  
  Object.keys(categoriasActual).forEach(categoria => {
    const actual = categoriasActual[categoria];
    const anterior = categoriasAnterior[categoria] || 0;
    
    if (anterior > 0) {
      const cambio = ((actual - anterior) / anterior) * 100;
      
      if (cambio > 30) {
        insights.push({
          tipo: 'warning',
          icono: '⚠️',
          titulo: `Incremento en ${categoria}`,
          mensaje: `Detectamos un incremento del ${cambio.toFixed(1)}% en la categoría "${categoria}" respecto al mes pasado. Considerá ajustar tus consumos.`
        });
      }
    }
  });
  
  // Análisis 3: Categoría dominante
  const categoriaMax = Object.entries(categoriasActual)
    .sort((a, b) => b[1] - a[1])[0];
  
  if (categoriaMax && totalEsteMes > 0) {
    const porcentaje = (categoriaMax[1] / totalEsteMes) * 100;
    
    if (porcentaje > 40) {
      insights.push({
        tipo: 'info',
        icono: '📊',
        titulo: 'Categoría Dominante',
        mensaje: `La categoría "${categoriaMax[0]}" representa el ${porcentaje.toFixed(1)}% de tus gastos totales ($${categoriaMax[1].toLocaleString()}).`
      });
    }
  }
  
  // Análisis 4: Frecuencia de gastos
  if (gastosEsteMes.length > 0) {
    const diasTranscurridos = Math.max(1, Math.ceil((new Date().getTime() - mesActualInicio.getTime()) / (1000 * 60 * 60 * 24)));
    const promedioDiario = totalEsteMes / diasTranscurridos;
    const proyeccionMes = promedioDiario * 30;
    
    insights.push({
      tipo: 'info',
      icono: '💡',
      titulo: 'Proyección del Mes',
      mensaje: `A tu ritmo actual de gasto ($${promedioDiario.toFixed(0)}/día), proyectamos un total mensual de $${proyeccionMes.toLocaleString()}.`
    });
  }
  
  // Análisis 5: Método de pago más usado
  const metodosPago = gastosEsteMes.reduce((acc, g) => {
    acc[g.metodoPago] = (acc[g.metodoPago] || 0) + g.monto;
    return acc;
  }, {} as Record<string, number>);
  
  const metodoMax = Object.entries(metodosPago)
    .sort((a, b) => b[1] - a[1])[0];
  
  if (metodoMax && totalEsteMes > 0) {
    const porcentaje = (metodoMax[1] / totalEsteMes) * 100;
    
    if (metodoMax[0] === 'Tarjeta' && porcentaje > 60) {
      insights.push({
        tipo: 'warning',
        icono: '💳',
        titulo: 'Alto Uso de Tarjeta',
        mensaje: `El ${porcentaje.toFixed(1)}% de tus gastos son con tarjeta. Considera diversificar métodos de pago para mejor control.`
      });
    }
  }
  
  // Análisis 6: Recomendaciones de ahorro
  const categoriasSugeridas = ['Viajes', 'Familia', 'Otros'];
  categoriasSugeridas.forEach(cat => {
    const actual = categoriasActual[cat] || 0;
    if (actual > 0 && totalEsteMes > 0) {
      const porcentaje = (actual / totalEsteMes) * 100;
      if (porcentaje > 25) {
        insights.push({
          tipo: 'info',
          icono: '💰',
          titulo: `Oportunidad de Ahorro en ${cat}`,
          mensaje: `La categoría "${cat}" consume el ${porcentaje.toFixed(1)}% de tu presupuesto. Reducir un 20% aquí te ahorraría $${(actual * 0.2).toLocaleString()}.`
        });
      }
    }
  });
  
  // Si no hay insights, dar uno motivacional
  if (insights.length === 0) {
    insights.push({
      tipo: 'success',
      icono: '✨',
      titulo: '¡Todo bajo control!',
      mensaje: 'Tus finanzas están equilibradas. Continúa registrando tus gastos para obtener más insights personalizados.'
    });
  }
  
  return insights.slice(0, 3); // Máximo 3 insights
}
