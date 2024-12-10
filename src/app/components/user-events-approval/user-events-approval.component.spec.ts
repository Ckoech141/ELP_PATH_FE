import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventsApprovalComponent } from './user-events-approval.component';

describe('UserEventsApprovalComponent', () => {
  let component: UserEventsApprovalComponent;
  let fixture: ComponentFixture<UserEventsApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEventsApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserEventsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
