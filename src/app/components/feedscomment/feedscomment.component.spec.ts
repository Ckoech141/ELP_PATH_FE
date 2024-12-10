import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedscommentComponent } from './feedscomment.component';

describe('FeedscommentComponent', () => {
  let component: FeedscommentComponent;
  let fixture: ComponentFixture<FeedscommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedscommentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedscommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
