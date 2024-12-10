import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAchieventEditFormComponent } from './user-achievent-edit-form.component';

describe('UserAchieventEditFormComponent', () => {
  let component: UserAchieventEditFormComponent;
  let fixture: ComponentFixture<UserAchieventEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAchieventEditFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAchieventEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
