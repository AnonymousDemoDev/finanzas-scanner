import { createWorker } from 'tesseract.js';

export interface OCRResult {
  monto: number | null;
  comercio: string | null;
  fecha: Date | null;
}

export async function extractTextFromImage(imageData: string): Promise<string> {
  const worker = await createWorker('spa', 1, {
    logger: () => {} // Silenciar logs
  });
  
  const { data: { text } } = await worker.recognize(imageData);
  await worker.terminate();
  
  return text;
}

export function parseTicketText(text: string): OCRResult {
  const result: OCRResult = {
    monto: null,
    comercio: null,
    fecha: null
  };
  
  // Extraer monto (buscar patrones como $1234.56 o 1234,56)
  const montoPatterns = [
    /(?:total|importe|suma|pago)[:\s]*\$?\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2})?)/i,
    /\$\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2})?)/,
    /([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2})?)\s*(?:pesos|usd|ars)/i
  ];
  
  for (const pattern of montoPatterns) {
    const match = text.match(pattern);
    if (match) {
      const montoStr = match[1].replace(/\./g, '').replace(',', '.');
      const monto = parseFloat(montoStr);
      if (!isNaN(monto) && monto > 0 && monto < 1000000) {
        result.monto = monto;
        break;
      }
    }
  }
  
  // Extraer comercio (primera línea significativa o nombre después de ciertos patrones)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  if (lines.length > 0) {
    // Buscar línea que parezca nombre de comercio
    for (const line of lines.slice(0, 5)) {
      if (line.length > 3 && line.length < 50 && /[a-zA-Z]/.test(line)) {
        result.comercio = line;
        break;
      }
    }
  }
  
  // Extraer fecha (DD/MM/YYYY, DD-MM-YYYY, etc)
  const fechaPatterns = [
    /(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/,
    /(\d{2,4})[/-](\d{1,2})[/-](\d{1,2})/
  ];
  
  for (const pattern of fechaPatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const [_, p1, p2, p3] = match;
        let day: number, month: number, year: number;
        
        // Intentar diferentes formatos
        if (p3.length === 4) {
          // YYYY-MM-DD
          year = parseInt(p3);
          month = parseInt(p2) - 1;
          day = parseInt(p1);
        } else {
          // DD-MM-YY
          day = parseInt(p1);
          month = parseInt(p2) - 1;
          year = parseInt(p3) + (p3.length === 2 ? 2000 : 0);
        }
        
        const fecha = new Date(year, month, day);
        if (!isNaN(fecha.getTime()) && year >= 2020 && year <= 2030) {
          result.fecha = fecha;
          break;
        }
      } catch (e) {
        // Ignorar errores de parsing
      }
    }
  }
  
  return result;
}
