import { User } from "./user";
import { Vehiculo } from "./vehiculo";

export interface Reserva {

    reservaId: number;
    cliente: User;
    vehiculo: Vehiculo;
    señaPagada: boolean;
    precioTotal: number;

}
