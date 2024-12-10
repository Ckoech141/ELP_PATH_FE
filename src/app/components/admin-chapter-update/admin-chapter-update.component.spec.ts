import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChapterUpdateComponent } from './admin-chapter-update.component';

describe('AdminChapterUpdateComponent', () => {
  let component: AdminChapterUpdateComponent;
  let fixture: ComponentFixture<AdminChapterUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChapterUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminChapterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
