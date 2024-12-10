import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSpotlightViewComponent } from './admin-spotlight-view.component';

describe('AdminSpotlightViewComponent', () => {
  let component: AdminSpotlightViewComponent;
  let fixture: ComponentFixture<AdminSpotlightViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSpotlightViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSpotlightViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
