import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarJobComponent } from './scholar-job.component';

describe('ScholarJobComponent', () => {
  let component: ScholarJobComponent;
  let fixture: ComponentFixture<ScholarJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScholarJobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScholarJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
