export interface Vehiculo {
    id:          number;
    matricula:   string;
    grupo:       string;
    categoria:   string;
    marca:       string;
    modelo:      string;
    puertas:     number;
    plazas:      number;
    maletero:    string;
    edad_minima: number;
    precio_dia:  number;
    disponible:  boolean;
    imagen:      string;
}
