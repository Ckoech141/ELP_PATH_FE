import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAchievementFormComponent } from './user-achievement-form.component';

describe('UserAchievementFormComponent', () => {
  let component: UserAchievementFormComponent;
  let fixture: ComponentFixture<UserAchievementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAchievementFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAchievementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
