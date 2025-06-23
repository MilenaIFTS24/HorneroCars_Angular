import { User } from "./user";
import { Vehiculo } from "./vehiculo";

export interface Reserva {
  reservaId: number;
  clienteId: string;
  vehiculoId: number;
  seniaPagada: boolean;
  precioTotal: number;
  fechaRecogida: string;
  horaRecogida: string;
  fechaDevolucion: string;
  horaDevolucion: string;
}