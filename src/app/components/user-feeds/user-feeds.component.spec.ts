import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeedsComponent } from './user-feeds.component';

describe('UserFeedsComponent', () => {
  let component: UserFeedsComponent;
  let fixture: ComponentFixture<UserFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFeedsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
