import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobOpportunitiesReportComponent } from './admin-job-opportunities-report.component';

describe('AdminJobOpportunitiesReportComponent', () => {
  let component: AdminJobOpportunitiesReportComponent;
  let fixture: ComponentFixture<AdminJobOpportunitiesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminJobOpportunitiesReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminJobOpportunitiesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
