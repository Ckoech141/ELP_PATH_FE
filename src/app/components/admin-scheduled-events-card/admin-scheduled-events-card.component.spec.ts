import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScheduledEventsCardComponent } from './admin-scheduled-events-card.component';

describe('AdminScheduledEventsCardComponent', () => {
  let component: AdminScheduledEventsCardComponent;
  let fixture: ComponentFixture<AdminScheduledEventsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminScheduledEventsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminScheduledEventsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
