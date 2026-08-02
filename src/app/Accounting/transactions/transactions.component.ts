import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common';
import { ManualEntryService } from '../services/manual-entry.service';
import { Observable, map } from 'rxjs';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

export interface MovementRow {
  fecha: Date;
  tipoDocumento: string;
  numero: string;
  terceroPrincipal: string;
  cuenta: string;
  terceroLinea: string;
  centroCosto: string;
  debito: number;
  credito: number;
  descripcion: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DatePipe, TableModule, InputTextModule, TagModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  manualEntryService = inject(ManualEntryService);

  movimientos$: Observable<MovementRow[]> = this.manualEntryService.getAll().pipe(
    map(registros => {
      const lineas: MovementRow[] = [];
      registros.forEach(r => {
        r.lineas.forEach(l => {
          lineas.push({
            fecha: r.fecha,
            tipoDocumento: r.tipoDocumento,
            numero: r.numero,
            terceroPrincipal: r.terceroPrincipal?.nombre || '',
            cuenta: l.cuenta,
            terceroLinea: l.tercero || r.terceroPrincipal?.nombre || '-',
            centroCosto: l.centroCosto || '-',
            debito: l.debito || 0,
            credito: l.credito || 0,
            descripcion: l.descripcion || '-'
          });
        });
      });
      return lineas;
    })
  );

  obtenerTotalDebito(movimientos: MovementRow[]): number {
    return movimientos.reduce((acc, m) => acc + m.debito, 0);
  }

  obtenerTotalCredito(movimientos: MovementRow[]): number {
    return movimientos.reduce((acc, m) => acc + m.credito, 0);
  }
}

