import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOngoingEventsCardComponent } from './admin-ongoing-events-card.component';

describe('AdminOngoingEventsCardComponent', () => {
  let component: AdminOngoingEventsCardComponent;
  let fixture: ComponentFixture<AdminOngoingEventsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOngoingEventsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminOngoingEventsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
