import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.css'
})
export class InformacionComponent implements OnInit {  // 👈 Acá implementás OnInit
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.router.url === '/informacion') {
      this.router.navigate(['tarifas'], { relativeTo: this.route });
    }
  }
}