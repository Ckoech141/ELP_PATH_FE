import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersReportComponent } from './admin-users-report.component';

describe('AdminUsersReportComponent', () => {
  let component: AdminUsersReportComponent;
  let fixture: ComponentFixture<AdminUsersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsersReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminUsersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
