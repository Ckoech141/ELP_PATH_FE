import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreVideosComponent } from './more-videos.component';

describe('MoreVideosComponent', () => {
  let component: MoreVideosComponent;
  let fixture: ComponentFixture<MoreVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreVideosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoreVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
