import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewSholarsTableComponent } from './admin-view-sholars-table.component';

describe('AdminViewSholarsTableComponent', () => {
  let component: AdminViewSholarsTableComponent;
  let fixture: ComponentFixture<AdminViewSholarsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewSholarsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminViewSholarsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
