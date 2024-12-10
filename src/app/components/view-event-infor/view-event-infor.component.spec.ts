import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventInforComponent } from './view-event-infor.component';

describe('ViewEventInforComponent', () => {
  let component: ViewEventInforComponent;
  let fixture: ComponentFixture<ViewEventInforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEventInforComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewEventInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
