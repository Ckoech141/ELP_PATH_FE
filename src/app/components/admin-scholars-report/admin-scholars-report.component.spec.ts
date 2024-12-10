import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScholarsReportComponent } from './admin-scholars-report.component';

describe('AdminScholarsReportComponent', () => {
  let component: AdminScholarsReportComponent;
  let fixture: ComponentFixture<AdminScholarsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminScholarsReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminScholarsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
