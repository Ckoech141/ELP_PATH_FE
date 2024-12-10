import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChapterReportComponent } from './admin-chapter-report.component';

describe('AdminChapterReportComponent', () => {
  let component: AdminChapterReportComponent;
  let fixture: ComponentFixture<AdminChapterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChapterReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminChapterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
