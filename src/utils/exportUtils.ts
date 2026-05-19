import { Gasto } from '../lib/database';
import { format } from 'date-fns';

export function exportToCSV(gastos: Gasto[]): string {
  const headers = ['ID', 'Fecha', 'Comercio', 'Categoría', 'Monto', 'Método de Pago', 'Tarjeta'];
  
  const rows = gastos.map(gasto => [
    gasto.id?.toString() || '',
    format(gasto.fecha, 'dd/MM/yyyy'),
    `"${gasto.comercio}"`,
    `"${gasto.categoria}"`,
    gasto.monto.toFixed(2),
    `"${gasto.metodoPago}"`,
    `"${gasto.tarjetaNombre || ''}"`
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string = 'gastos.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function shareCSV(csvContent: string, filename: string = 'gastos.csv') {
  if (navigator.share) {
    try {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], filename, { type: 'text/csv' });
      
      await navigator.share({
        files: [file],
        title: 'Exportar Gastos',
        text: 'Archivo CSV con historial de gastos'
      });
    } catch (error) {
      // Si falla compartir, descargar
      downloadCSV(csvContent, filename);
    }
  } else {
    downloadCSV(csvContent, filename);
  }
}
