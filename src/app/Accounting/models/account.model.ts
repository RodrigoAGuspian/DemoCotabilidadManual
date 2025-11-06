export interface Account {
  id: string;
  codigo: string;
  nombre: string;
  nivel: number;
  manejaCentroCosto: boolean;
  naturaleza: 'Débito' | 'Crédito';
}
