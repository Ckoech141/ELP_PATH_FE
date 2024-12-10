import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJoinedEventsComponent } from './user-joined-events.component';

describe('UserJoinedEventsComponent', () => {
  let component: UserJoinedEventsComponent;
  let fixture: ComponentFixture<UserJoinedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserJoinedEventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserJoinedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
