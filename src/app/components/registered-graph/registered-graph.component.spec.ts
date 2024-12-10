import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredGraphComponent } from './registered-graph.component';

describe('RegisteredGraphComponent', () => {
  let component: RegisteredGraphComponent;
  let fixture: ComponentFixture<RegisteredGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisteredGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
