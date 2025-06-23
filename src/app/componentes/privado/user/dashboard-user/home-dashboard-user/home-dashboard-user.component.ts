// home-dashboard-user.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-dashboard-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home-dashboard-user.component.html',
  styleUrls: ['./home-dashboard-user.component.css']
})
export class HomeDashboardUserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  // --- NUEVA FUNCIÓN PARA EL BOT DE CHAT ---
  openChatBot(): void {
    console.log('Abriendo el chat con el bot...');
    // Aquí es donde iría la lógica real para abrir el bot.
    // Podría ser:
    // 1. Mostrar un componente de chat modal:
    //    this.dialog.open(ChatBotComponent);
    // 2. Navegar a una página de chat si la tienes:
    //    this.router.navigate(['/chat']);
    // 3. Inicializar un widget de chat externo:
    //    window.someChatBotAPI.init();
  }
}