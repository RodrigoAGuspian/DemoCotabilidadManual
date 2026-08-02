import { Routes } from '@angular/router';
import { ManualEntryFormComponent } from './Accounting/manual-entry-form/manual-entry-form.component';
import { TransactionsComponent } from './Accounting/transactions/transactions.component';

export const routes: Routes = [
  { path: '', redirectTo: 'notas-contables', pathMatch: 'full' },
  { path: 'notas-contables', component: ManualEntryFormComponent },
  { path: 'movimientos-acumulados', component: TransactionsComponent },
  { path: '**', redirectTo: 'notas-contables' }
];

