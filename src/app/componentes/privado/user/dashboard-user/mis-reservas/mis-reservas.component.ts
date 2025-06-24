import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservasService } from '../../../../../servicios/reservas.service';
import { User } from '../../../../../modelos/user';
import { Reserva } from '../../../../../modelos/reserva';



@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {
  
  public misReservas: Reserva[] = [];
  public usuarioLogueado: User | null = null;
  public isLoading: boolean = true;

  constructor(private reservasService: ReservasService) { }

  ngOnInit(): void {
    this.getUsuarioActivo();
    this.cargarReservas();
  }

  getUsuarioActivo(): void {
    const usuarioStr = sessionStorage.getItem('usuarioActivo'); // O la clave que estén usando, ej: 'usuario'
    if (usuarioStr) {
      this.usuarioLogueado = JSON.parse(usuarioStr);
    }
  }

  cargarReservas(): void {
    if (!this.usuarioLogueado) {
      console.log("No hay usuario logueado para buscar reservas.");
      this.isLoading = false;
      return;
    }

    this.reservasService.getReservas().subscribe(todasLasReservas => {
      // Filtramos para obtener solo las reservas del usuario actual.
      this.misReservas = todasLasReservas
        .filter(reserva => reserva.userId === this.usuarioLogueado?.userId)
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()); // Ordenamos por fecha
      
      this.isLoading = false;
      console.log(`Se encontraron ${this.misReservas.length} reservas para este usuario.`);
    });
  }

  cancelarReserva(reservaId: string): void {
    if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      this.reservasService.cancelarReserva(reservaId);
      // Después de cancelar, volvemos a cargar la lista para que se refleje el cambio.
      this.cargarReservas();
    }
  }
}