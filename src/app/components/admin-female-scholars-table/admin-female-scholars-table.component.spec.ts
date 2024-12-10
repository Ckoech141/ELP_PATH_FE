import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFemaleScholarsTableComponent } from './admin-female-scholars-table.component';

describe('AdminFemaleScholarsTableComponent', () => {
  let component: AdminFemaleScholarsTableComponent;
  let fixture: ComponentFixture<AdminFemaleScholarsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFemaleScholarsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminFemaleScholarsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
