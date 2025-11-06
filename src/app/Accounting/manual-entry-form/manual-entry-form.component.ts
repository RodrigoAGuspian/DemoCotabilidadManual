import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import Swal from 'sweetalert2';

import { ManualEntryService } from '../services/manual-entry.service';
import { ManualEntry } from '../models/manual-entry.model';

@Component({
  selector: 'app-manual-entry-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    InputNumberModule,
    CalendarModule,
    TableModule,
    InputTextModule
  ],
  templateUrl: './manual-entry-form.component.html',
  styleUrls: ['./manual-entry-form.component.css']
})
export class ManualEntryFormComponent {
  form: FormGroup;

  // 🔹 Listas mockeadas
  listaTiposDocumento = ['Factura', 'Recibo', 'Nota de crédito', 'Otro'];

  listaTerceros = [
    { name: 'Empresa A', id: 'T001' },
    { name: 'Empresa B', id: 'T002' },
    { name: 'Proveedor C', id: 'T003' },
    { name: 'Cliente D', id: 'T004' },
  ];

  listaCuentas = [
    { name: '110505 - Caja general', id: 'C001' },
    { name: '130505 - Clientes nacionales', id: 'C002' },
    { name: '220505 - Proveedores', id: 'C003' },
    { name: '240805 - IVA generado', id: 'C004' },
  ];

  listaCentrosCosto = [
    { name: 'Administración', id: 'CC01' },
    { name: 'Ventas', id: 'CC02' },
    { name: 'Producción', id: 'CC03' },
  ];

  listNature = [
    { name: 'Débito' },
    { name: 'Crédito' },
  ];

  listFinancialState = [
    { name: 'Balance general' },
    { name: 'Estado de resultados' },
    { name: 'Flujo de efectivo' },
  ];

  listClasification = [
    { name: 'Activo' },
    { name: 'Pasivo' },
    { name: 'Patrimonio' },
    { name: 'Ingreso' },
    { name: 'Gasto' },
  ];

  // 🔹 Placeholders
  placeNatureType = 'Seleccione naturaleza';
  placeFinancialStateType = 'Seleccione estado financiero';
  placeClassificationType = 'Seleccione clasificación';
  placeTercero = 'Seleccione un tercero';
  placeTipoDocumento = 'Seleccione tipo de documento';
  placeCuenta = 'Seleccione una cuenta contable';
  placeCentroCosto = 'Seleccione centro de costos';

  constructor(
    private fb: FormBuilder,
    private manualEntryService: ManualEntryService
  ) {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      tipoDocumento: ['', Validators.required],
      numero: ['', Validators.required],
      terceroPrincipal: ['', Validators.required],
      lineas: this.fb.array([this.crearLinea()])
    });
  }

  // 🔹 Getter para el FormArray
  get lineas(): FormArray {
    return this.form.get('lineas') as FormArray;
  }

  // 🔹 Crear nueva línea
  crearLinea(): FormGroup {
    return this.fb.group({
      id: crypto.randomUUID(),
      cuenta: ['', Validators.required],
      tercero: [''],
      centroCosto: [''],
      debito: [0],
      credito: [0],
      descripcion: ['']
    });
  }

  // 🔹 Agregar / eliminar líneas
  agregarLinea(): void {
    this.lineas.push(this.crearLinea());
  }

  eliminarLinea(index: number): void {
    this.lineas.removeAt(index);
  }

  // 🔹 Guardar registro
  guardar(): void {
    if (this.form.valid) {
      const nuevoRegistro: ManualEntry = this.form.value;
      nuevoRegistro.terceroPrincipal.nombre = this.form.value.terceroPrincipal.name
      this.manualEntryService.add(nuevoRegistro);
      console.log(this.form.value)

      // Reiniciar formulario
      this.form.reset({
        fecha: new Date(),
        tipoDocumento: '',
        terceroPrincipal: '',
        numero: 0,
        lineas: [this.crearLinea()]
      });

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Registro guardado exitosamente',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      });
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Completa los campos requeridos',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      });
    }
  }
}
