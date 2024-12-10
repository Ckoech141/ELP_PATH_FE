import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecentEventsCardComponent } from './admin-recent-events-card.component';

describe('AdminRecentEventsCardComponent', () => {
  let component: AdminRecentEventsCardComponent;
  let fixture: ComponentFixture<AdminRecentEventsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecentEventsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminRecentEventsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
