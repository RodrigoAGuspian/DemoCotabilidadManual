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
import { ManualEntryListComponent } from '../manual-entry-list/manual-entry-list.component';

export interface AccountOption {
  id: string;
  name: string;
  codigo: string;
  manejaCentroCosto: boolean;
}

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
    InputTextModule,
    ManualEntryListComponent
  ],
  templateUrl: './manual-entry-form.component.html',
  styleUrls: ['./manual-entry-form.component.css']
})
export class ManualEntryFormComponent {
  form: FormGroup;

  // 🔹 Listas mockeadas (simulan catálogos auxiliares)
  listaTiposDocumento = [
    { label: 'NC - Nota Contable', value: 'NC' },
    { label: 'FV - Factura de Venta', value: 'FV' },
    { label: 'CE - Comprobante de Egreso', value: 'CE' },
    { label: 'RC - Recibo de Caja', value: 'RC' }
  ];

  listaTerceros = [
    { name: 'Empresa A S.A.S.', id: 'T001', identificacion: '900.123.456-1' },
    { name: 'Empresa B Ltda.', id: 'T002', identificacion: '800.987.654-2' },
    { name: 'Proveedor C (Juan Pérez)', id: 'T003', identificacion: '1061.456.789' },
    { name: 'Cliente D (María Gómez)', id: 'T004', identificacion: '34.567.890' },
  ];

  listaCuentas: AccountOption[] = [
    { id: 'C001', name: '110505 - Caja General (Auxiliar)', codigo: '110505', manejaCentroCosto: false },
    { id: 'C002', name: '111005 - Bancos Nacionales (Auxiliar)', codigo: '111005', manejaCentroCosto: false },
    { id: 'C003', name: '130505 - Clientes Nacionales (Auxiliar)', codigo: '130505', manejaCentroCosto: false },
    { id: 'C004', name: '220505 - Proveedores Nacionales (Auxiliar)', codigo: '220505', manejaCentroCosto: false },
    { id: 'C005', name: '510506 - Sueldos y Salarios (Auxiliar)', codigo: '510506', manejaCentroCosto: true },
    { id: 'C006', name: '513505 - Servicios Públicos (Auxiliar)', codigo: '513505', manejaCentroCosto: true },
    { id: 'C007', name: '240805 - IVA Generado 19% (Auxiliar)', codigo: '240805', manejaCentroCosto: false }
  ];

  listaCentrosCosto = [
    { name: 'CC-01 Administración', id: 'CC01' },
    { name: 'CC-02 Ventas y Comercial', id: 'CC02' },
    { name: 'CC-03 Operaciones y Producción', id: 'CC03' },
  ];

  constructor(
    private fb: FormBuilder,
    private manualEntryService: ManualEntryService
  ) {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      tipoDocumento: ['NC', Validators.required],
      numero: ['0001', Validators.required],
      terceroPrincipal: ['', Validators.required],
      lineas: this.fb.array([this.crearLinea(), this.crearLinea()])
    });

    // Copiar tercero principal a líneas por defecto si el usuario cambia el tercero principal
    this.form.get('terceroPrincipal')?.valueChanges.subscribe(tercero => {
      this.lineas.controls.forEach(control => {
        if (!control.get('tercero')?.value) {
          control.get('tercero')?.setValue(tercero);
        }
      });
    });
  }

  // 🔹 Getter para el FormArray
  get lineas(): FormArray {
    return this.form.get('lineas') as FormArray;
  }

  // 🔹 Crear nueva línea
  crearLinea(): FormGroup {
    const linea = this.fb.group({
      id: crypto.randomUUID(),
      cuenta: ['', Validators.required],
      tercero: [''],
      centroCosto: [''],
      debito: [0],
      credito: [0],
      descripcion: ['']
    });

    // Suscribir al cambio de cuenta para validar Centro de Costo obligatorio condicional
    linea.get('cuenta')?.valueChanges.subscribe((cuenta: any) => {
      const centroCostoControl = linea.get('centroCosto');
      if (cuenta && cuenta.manejaCentroCosto) {
        centroCostoControl?.setValidators([Validators.required]);
      } else {
        centroCostoControl?.clearValidators();
      }
      centroCostoControl?.updateValueAndValidity();
    });

    return linea;
  }

  // 🔹 Agregar / eliminar líneas
  agregarLinea(): void {
    const nuevaLinea = this.crearLinea();
    const terceroPrincipal = this.form.get('terceroPrincipal')?.value;
    if (terceroPrincipal) {
      nuevaLinea.get('tercero')?.setValue(terceroPrincipal);
    }
    this.lineas.push(nuevaLinea);
  }

  eliminarLinea(index: number): void {
    if (this.lineas.length > 2) {
      this.lineas.removeAt(index);
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Un asiento contable requiere al menos 2 líneas',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  // 🔹 Cálculos de Totales y Partida Doble en Tiempo Real
  get totalDebito(): number {
    return this.lineas.controls.reduce((acc, curr) => acc + (Number(curr.get('debito')?.value) || 0), 0);
  }

  get totalCredito(): number {
    return this.lineas.controls.reduce((acc, curr) => acc + (Number(curr.get('credito')?.value) || 0), 0);
  }

  get diferencia(): number {
    return Math.abs(this.totalDebito - this.totalCredito);
  }

  get estaCuadrado(): boolean {
    return this.diferencia < 0.01 && this.totalDebito > 0;
  }

  // 🔹 Guardar registro con validación contable estricta
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Por favor completa los campos requeridos en el encabezado y líneas',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (this.totalDebito === 0 && this.totalCredito === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Asiento sin valores',
        text: 'Debes registrar montos en Débito o Crédito en las líneas del comprobante.',
        confirmButtonColor: '#000066'
      });
      return;
    }

    if (!this.estaCuadrado) {
      Swal.fire({
        icon: 'error',
        title: 'Partida Doble Descuadrada',
        html: `El asiento no cumple con el principio de Partida Doble.<br>
               <strong>Total Débito:</strong> $${this.totalDebito.toLocaleString()}<br>
               <strong>Total Crédito:</strong> $${this.totalCredito.toLocaleString()}<br>
               <span style="color: #db3a35; font-weight: bold;">Diferencia: $${this.diferencia.toLocaleString()}</span>`,
        confirmButtonColor: '#9d0311'
      });
      return;
    }

    // Preparar objeto para el servicio
    const formVal = this.form.value;
    const nuevoRegistro: ManualEntry = {
      fecha: formVal.fecha,
      tipoDocumento: typeof formVal.tipoDocumento === 'object' ? formVal.tipoDocumento.value : formVal.tipoDocumento,
      numero: formVal.numero,
      terceroPrincipal: {
        id: formVal.terceroPrincipal.id,
        nombre: formVal.terceroPrincipal.name,
        tipo: 'Persona Jurídica',
        identificacion: formVal.terceroPrincipal.identificacion || ''
      },
      lineas: formVal.lineas.map((l: any) => ({
        id: l.id,
        cuenta: l.cuenta.name || l.cuenta,
        tercero: l.tercero?.name || formVal.terceroPrincipal.name,
        centroCosto: l.centroCosto?.name || '-',
        debito: Number(l.debito) || 0,
        credito: Number(l.credito) || 0,
        descripcion: l.descripcion || 'Registro contable'
      }))
    };

    this.manualEntryService.add(nuevoRegistro);

    // Reiniciar formulario
    this.form.reset({
      fecha: new Date(),
      tipoDocumento: 'NC',
      terceroPrincipal: '',
      numero: '0002',
      lineas: [this.crearLinea(), this.crearLinea()]
    });

    Swal.fire({
      icon: 'success',
      title: '¡Asiento Contable Registrado!',
      text: 'El comprobante ha sido guardado y verificado con éxito en el sistema.',
      timer: 2500,
      showConfirmButton: false
    });
  }
}

