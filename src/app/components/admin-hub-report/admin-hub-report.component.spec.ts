import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHubReportComponent } from './admin-hub-report.component';

describe('AdminHubReportComponent', () => {
  let component: AdminHubReportComponent;
  let fixture: ComponentFixture<AdminHubReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHubReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminHubReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
