import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Necesario para formularios reactivos
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Importa NgbModule para ng-bootstrap

@Component({
  selector: 'app-registro-form',
  standalone: true, // ¡Declarado como standalone!
  imports: [
    CommonModule,
    ReactiveFormsModule, // Importa ReactiveFormsModule aquí
    NgbModule // Importa NgbModule aquí
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup; // Usamos '!' para indicar que se inicializará en ngOnInit

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(5)]],//idcliente
      nombre: ['', [Validators.required, Validators.minLength(5)]], 
      apellido: ['', [Validators.required, Validators.minLength(5)]], 
      fechaNacimiento: ['', [Validators.required, Validators.minLength(5)]], //date
      telefono: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]*$')]], //date
      dni: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(8),Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // Validador personalizado para que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      console.log('Formulario válido, datos:', this.registroForm.value);
      // Aquí es donde normalmente enviarías los datos a un servicio o API
      alert('¡Registro exitoso! Revisa la consola para ver los datos.'); // Solo para demostración
    } else {
      console.log('Formulario inválido');
      // Marca todos los controles como "touched" para que se muestren los mensajes de error
      this.registroForm.markAllAsTouched();
      alert('Por favor, completa el formulario correctamente.'); // Solo para demostración
    }
  }
}