import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterEventsComponent } from './chapter-events.component';

describe('ChapterEventsComponent', () => {
  let component: ChapterEventsComponent;
  let fixture: ComponentFixture<ChapterEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterEventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChapterEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
