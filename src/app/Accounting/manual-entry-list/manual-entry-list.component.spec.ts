import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEntryListComponent } from './manual-entry-list.component';

describe('ManualEntryListComponent', () => {
  let component: ManualEntryListComponent;
  let fixture: ComponentFixture<ManualEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualEntryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
