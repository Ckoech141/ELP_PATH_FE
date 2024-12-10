import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDialogInfoComponent } from './user-dialog-info.component';

describe('UserDialogInfoComponent', () => {
  let component: UserDialogInfoComponent;
  let fixture: ComponentFixture<UserDialogInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDialogInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserDialogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
