import { Component } from '@angular/core';
import { ManualEntryFormComponent } from './Accounting/manual-entry-form/manual-entry-form.component';
import { ManualEntryListComponent } from './Accounting/manual-entry-list/manual-entry-list.component';

@Component({
  selector: 'app-root',
  imports: [ManualEntryFormComponent, ManualEntryListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'contabilidad-demo';
}
