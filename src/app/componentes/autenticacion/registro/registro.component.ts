import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AbmUserService } from '../../../servicios/abm-user.service';
import { User } from '../../../modelos/user';

@Component({
  selector: 'app-registro-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private abmuser: AbmUserService
             ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(5)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]*$')]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const userData = this.registroForm.value;

      // Crea el objeto newUser conforme al modelo, incluyendo los campos del formulario
      const newUser: User = {
        userId: userData.userId,
        rol: 'Cliente', // Establece el rol fijo
        nombreCompleto: `${userData.nombre} ${userData.apellido}`, // Combina nombre y apellido
        email: userData.email,
        password: userData.password,
        telefono: userData.telefono,
        fechaNacimiento: userData.fechaNacimiento, // Ya es string del input 'date' o similar
        documentacion: null, // Asignar explícitamente null o undefined si no se carga aquí
        fechaRegistro: new Date().toISOString() // Asignar la fecha actual como string ISO
      };

      this.abmuser.addUser(newUser).subscribe({
        next: (response) => {
          console.log('Usuario registrado exitosamente:', response);
          alert('¡Registro exitoso! El usuario ha sido añadido.');
          this.registroForm.reset();
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          alert(`Hubo un error al intentar registrar el usuario: ${error.message || 'Error desconocido'}.`);
        }
      });

    } else {
      console.log('Formulario inválido');
      this.registroForm.markAllAsTouched();
      alert('Por favor, completa el formulario correctamente.');
    }
  }
}