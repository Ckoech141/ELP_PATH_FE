import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsEditFormComponent } from './skills-edit-form.component';

describe('SkillsEditFormComponent', () => {
  let component: SkillsEditFormComponent;
  let fixture: ComponentFixture<SkillsEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsEditFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkillsEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
