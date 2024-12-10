import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventsApproveRequestsComponent } from './admin-events-approve-requests.component';

describe('AdminEventsApproveRequestsComponent', () => {
  let component: AdminEventsApproveRequestsComponent;
  let fixture: ComponentFixture<AdminEventsApproveRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventsApproveRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEventsApproveRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
