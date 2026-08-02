import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common';
import { ManualEntryService } from '../services/manual-entry.service';
import { Observable } from 'rxjs';
import { ManualEntry } from '../models/manual-entry.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manual-entry-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DatePipe, TableModule, ButtonModule, TagModule],
  templateUrl: './manual-entry-list.component.html',
  styleUrls: ['./manual-entry-list.component.css']
})
export class ManualEntryListComponent {
  registros$: Observable<ManualEntry[]> = inject(ManualEntryService).getAll();

  constructor(private manualEntryService: ManualEntryService) {}

  obtenerTotalDebito(registro: ManualEntry): number {
    return registro.lineas?.reduce((acc, l) => acc + (l.debito || 0), 0) || 0;
  }

  obtenerSeverity(tipo: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (tipo) {
      case 'NC': return 'info';
      case 'FV': return 'success';
      case 'CE': return 'warn';
      case 'RC': return 'secondary';
      default: return 'info';
    }
  }

  eliminar(id: string): void {
    Swal.fire({
      title: '¿Eliminar comprobante contable?',
      text: 'Esta acción revertirá las líneas de registro seleccionadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9d0311',
      cancelButtonColor: '#000066'
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

