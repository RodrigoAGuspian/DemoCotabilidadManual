import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ManualEntry } from '../models/manual-entry.model';

@Injectable({
  providedIn: 'root'
})
export class ManualEntryService {

  private registros: ManualEntry[] = [];
  private registros$ = new BehaviorSubject<ManualEntry[]>([]);

  constructor() {
    // Carga inicial (mock)
    this.registros = [
      {
        id: '1',
        fecha: new Date('2025-11-01'),
        tipoDocumento: 'NC',
        numero: '0001',
        terceroPrincipal: {
          id : "T001",
          nombre : "Empresa A",
          tipo: 'Persona Natural',
          identificacion: '1002'
        },

        lineas: [
          {
            cuenta: '110505',
            tercero: '1',
            centroCosto: 'ADM',
            debito: 100000,
            credito: 0,
            descripcion: 'Ingreso inicial'
          },
          {
            cuenta: '220505',
            tercero: '2',
            centroCosto: 'VEN',
            debito: 0,
            credito: 100000,
            descripcion: 'Provisión'
          }
        ]
      }
    ];
    this.registros$.next(this.registros);
  }

  /** 🔹 Retorna todos los registros contables */
  getAll(): Observable<ManualEntry[]> {
    return this.registros$.asObservable();
  }

  /** 🔹 Busca un registro por ID */
  getById(id: string): ManualEntry | undefined {
    return this.registros.find(r => r.id === id);
  }

  /** 🔹 Guarda un nuevo registro contable */
  add(registro: ManualEntry): void {
    const nuevo: ManualEntry = {
      ...registro,
      id: (this.registros.length + 1).toString(),
      numero: this.generarNumero(registro.tipoDocumento)
    };
    this.registros.push(nuevo);
    this.registros$.next(this.registros);
  }

  /** 🔹 Genera número consecutivo según tipo de documento */
  private generarNumero(tipoDocumento: string): string {
    const count = this.registros.filter(r => r.tipoDocumento === tipoDocumento).length + 1;
    return count.toString().padStart(4, '0');
  }

  /** 🔹 Elimina un registro (por ID) */
  delete(id: string): void {
    this.registros = this.registros.filter(r => r.id !== id);
    this.registros$.next(this.registros);
  }

  /** 🔹 Limpia todos los registros (solo mock) */
  clear(): void {
    this.registros = [];
    this.registros$.next([]);
  }
}