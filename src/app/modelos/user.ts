import { Documentacion } from "./documentacion";

export interface User {
    userId:           string;
    rol:              string;
    nombreCompleto:   string;
    email:            string;
    password:         string;
    telefono:         string;
    fechaNacimiento:  Date;
    documentacion?:   Documentacion | null; // Lo hace opcional y permite null
    fechaRegistro?:   string | null;          // Lo hace opcional y permite null
}
