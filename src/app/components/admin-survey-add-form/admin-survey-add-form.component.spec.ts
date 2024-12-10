import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSurveyAddFormComponent } from './admin-survey-add-form.component';

describe('AdminSurveyAddFormComponent', () => {
  let component: AdminSurveyAddFormComponent;
  let fixture: ComponentFixture<AdminSurveyAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSurveyAddFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSurveyAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
