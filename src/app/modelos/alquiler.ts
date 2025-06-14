import { Reserva } from "./reserva";

export interface Alquiler {

    alquilerId: number;
    reserva: Reserva;
    duracion: number;
    tipoSeguro: string;
    precioTotal: number;

}
