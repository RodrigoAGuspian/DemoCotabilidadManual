export interface ThirdParty {
  id: string;
  nombre: string;
  tipo: 'Persona Natural' | 'Persona Jurídica';
  identificacion: string;
}