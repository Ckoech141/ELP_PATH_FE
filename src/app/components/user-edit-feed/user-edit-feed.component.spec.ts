import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditFeedComponent } from './user-edit-feed.component';

describe('UserEditFeedComponent', () => {
  let component: UserEditFeedComponent;
  let fixture: ComponentFixture<UserEditFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditFeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserEditFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
