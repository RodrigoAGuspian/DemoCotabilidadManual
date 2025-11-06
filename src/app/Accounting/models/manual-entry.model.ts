import { ThirdParty } from './third-party.model';
import { TransactionLine } from './transaction-line.model';

export interface ManualEntry {
  id?: string;
  fecha: Date;
  tipoDocumento: string;
  numero: string;
  terceroPrincipal: ThirdParty;
  lineas: TransactionLine[];
}