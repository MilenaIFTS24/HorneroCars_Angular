import { Documentacion } from "./documentacion";

export interface User {
    userId:          string;
    rol:             string;
    nombreCompleto:  string;
    email:           string;
    password:        string;
    telefono:        string;
    fechaNacimiento: Date;
    documentacion:   Documentacion;
    fechaRegistro:   Date;

}
