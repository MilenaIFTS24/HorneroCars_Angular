export interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    categoria: string;
    descripcion_corta: string;
    precio_dia: number;
    imagen: string;
    disponible: boolean;
    caracteristicas: {
        puertas: number;
        plazas: number;
        transmision: string;
        maletero: string;
        grupo: string;
        matricula: string;
    };
    tags: string[];
    requisitos: {
        edad_minima: number;
    };
}
