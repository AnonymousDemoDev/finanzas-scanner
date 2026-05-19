import Dexie, { Table } from 'dexie';

export interface Gasto {
  id?: number;
  monto: number;
  comercio: string;
  fecha: Date;
  categoria: string;
  metodoPago: 'Transferencia' | 'Tarjeta' | 'Efectivo';
  tarjetaNombre: string | null;
  ticketPathLocal: string | null;
}

export interface ConfiguracionUsuario {
  id: number;
  ingresoEstimado: number;
  presupuestoMaximo: number;
  modoOscuro: boolean;
  notificacionesActivas: boolean;
  moneda: string;
  simboloMoneda: string;
}

export class FinanzasDatabase extends Dexie {
  gastos!: Table<Gasto, number>;
  configuracion!: Table<ConfiguracionUsuario, number>;

  constructor() {
    super('FinanzasScanner');
    
    this.version(1).stores({
      gastos: '++id, monto, comercio, fecha, categoria, metodoPago, tarjetaNombre',
      configuracion: 'id'
    });
  }
}

export const db = new FinanzasDatabase();

// Inicializar configuración por defecto
export async function initializeDefaultConfig() {
  const config = await db.configuracion.get(1);
  if (!config) {
    await db.configuracion.add({
      id: 1,
      ingresoEstimado: 15000,
      presupuestoMaximo: 11250,
      modoOscuro: false,
      notificacionesActivas: true,
      moneda: 'ARS',
      simboloMoneda: '$'
    });
  }
}
