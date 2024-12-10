import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventsReportComponent } from './admin-events-report.component';

describe('AdminEventsReportComponent', () => {
  let component: AdminEventsReportComponent;
  let fixture: ComponentFixture<AdminEventsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventsReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEventsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
