export interface TransactionLine {
  id?: string; // opcional, para futuras referencias
  cuenta: string;
  tercero?: string; // id del tercero, opcional
  centroCosto?: string; // id del centro de costos
  debito: number;
  credito: number;
  descripcion?: string;
}