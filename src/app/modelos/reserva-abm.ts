export interface ReservaAbm {
    
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
