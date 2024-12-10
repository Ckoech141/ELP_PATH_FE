import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobInfoComponent } from './add-job-info.component';

describe('AddJobInfoComponent', () => {
  let component: AddJobInfoComponent;
  let fixture: ComponentFixture<AddJobInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddJobInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddJobInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
