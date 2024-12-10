import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCountChapterAdminComponent } from './admin-count-chapter-admin.component';

describe('AdminCountChapterAdminComponent', () => {
  let component: AdminCountChapterAdminComponent;
  let fixture: ComponentFixture<AdminCountChapterAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCountChapterAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCountChapterAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
