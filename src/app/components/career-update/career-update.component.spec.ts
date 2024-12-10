import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerUpdateComponent } from './career-update.component';

describe('CareerUpdateComponent', () => {
  let component: CareerUpdateComponent;
  let fixture: ComponentFixture<CareerUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CareerUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
