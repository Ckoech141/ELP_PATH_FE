import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarHomeComponent } from './scholar-home.component';

describe('ScholarHomeComponent', () => {
  let component: ScholarHomeComponent;
  let fixture: ComponentFixture<ScholarHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScholarHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScholarHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
