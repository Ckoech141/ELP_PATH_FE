import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOurNewsComponent } from './all-our-news.component';

describe('AllOurNewsComponent', () => {
  let component: AllOurNewsComponent;
  let fixture: ComponentFixture<AllOurNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllOurNewsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllOurNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
