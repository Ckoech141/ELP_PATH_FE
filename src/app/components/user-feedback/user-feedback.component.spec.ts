import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeedbackComponent } from './user-feedback.component';

describe('UserFeedbackComponent', () => {
  let component: UserFeedbackComponent;
  let fixture: ComponentFixture<UserFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserFeedbackComponent]
    });
    fixture = TestBed.createComponent(UserFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
