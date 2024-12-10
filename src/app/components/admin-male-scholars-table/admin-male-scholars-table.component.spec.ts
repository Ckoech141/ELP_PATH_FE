import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMaleScholarsTableComponent } from './admin-male-scholars-table.component';

describe('AdminMaleScholarsTableComponent', () => {
  let component: AdminMaleScholarsTableComponent;
  let fixture: ComponentFixture<AdminMaleScholarsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMaleScholarsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMaleScholarsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
