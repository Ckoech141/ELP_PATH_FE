import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChapterFeedsComponent } from './admin-chapter-feeds.component';

describe('AdminChapterFeedsComponent', () => {
  let component: AdminChapterFeedsComponent;
  let fixture: ComponentFixture<AdminChapterFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChapterFeedsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminChapterFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
