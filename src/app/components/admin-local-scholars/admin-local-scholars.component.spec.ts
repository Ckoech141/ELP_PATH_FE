import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLocalScholarsComponent } from './admin-local-scholars.component';

describe('AdminLocalScholarsComponent', () => {
  let component: AdminLocalScholarsComponent;
  let fixture: ComponentFixture<AdminLocalScholarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLocalScholarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLocalScholarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
