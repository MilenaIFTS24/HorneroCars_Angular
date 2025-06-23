// Este archivo define la "forma" o el "contrato" que debe tener cada objeto de tipo Reserva.
export interface Reserva {
  reservaId: string;
  userId: string;
  userNombre: string;
  vehiculoId: number;
  vehiculoNombre: string;
  fechaInicio: string; // Formato YYYY-MM-DD
  fechaFin: string;    // Formato YYYY-MM-DD
  dias: number;
  costoTotal: number;
  costoVehiculo: number;
  costoSeguro: number;
  seguros: string[];
  estado: 'Confirmada - Pendiente de Pago' | 'Pagada' | 'En Curso' | 'Finalizada' | 'Cancelada';
  fechaCreacion: string; // Formato ISO de fecha y hora
}