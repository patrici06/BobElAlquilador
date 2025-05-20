import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ReservaService, Alquiler } from './reserva.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  reservaForm!: FormGroup;
  mensajeExito = '';
  mensajeError = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.reservaForm = this.fb.group({
      maquina: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.reservaForm.invalid) {
      this.mensajeError = 'Por favor completa todos los campos.';
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';
    this.cargando = true;

    const { maquina, fechaInicio, fechaFin } = this.reservaForm.value;
    this.reservaService.reservar(maquina, fechaInicio, fechaFin)
      .subscribe({
        next: (alquiler: Alquiler) => {
          this.cargando = false;
          this.mensajeExito = 'Alquiler realizado con éxito.';
          this.reservaForm.reset();
        },
        error: (err) => {
          this.cargando = false;
          this.mensajeError = err.error?.message || 'Error inesperado.';
        }
      });
  }
}
