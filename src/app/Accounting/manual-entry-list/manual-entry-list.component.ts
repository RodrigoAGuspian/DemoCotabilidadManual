import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { ManualEntryService } from '../services/manual-entry.service';
import { Observable } from 'rxjs';
import { ManualEntry } from '../models/manual-entry.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manual-entry-list',
  standalone: true,
  imports: [NgFor, AsyncPipe, DatePipe],
  templateUrl: './manual-entry-list.component.html',
  styleUrls: ['./manual-entry-list.component.css']
})
export class ManualEntryListComponent {
  registros$: Observable<ManualEntry[]> = inject(ManualEntryService).getAll();

  constructor(private manualEntryService: ManualEntryService) {}

  eliminar(id: string): void {
    Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.manualEntryService.delete(id);
        Swal.fire({
          title: 'Eliminado',
          text: 'El registro contable ha sido eliminado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}
