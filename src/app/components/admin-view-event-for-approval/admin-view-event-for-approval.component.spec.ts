import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewEventForApprovalComponent } from './admin-view-event-for-approval.component';

describe('AdminViewEventForApprovalComponent', () => {
  let component: AdminViewEventForApprovalComponent;
  let fixture: ComponentFixture<AdminViewEventForApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewEventForApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminViewEventForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
