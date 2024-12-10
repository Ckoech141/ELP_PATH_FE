import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGlobalScholarsComponent } from './admin-global-scholars.component';

describe('AdminGlobalScholarsComponent', () => {
  let component: AdminGlobalScholarsComponent;
  let fixture: ComponentFixture<AdminGlobalScholarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGlobalScholarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminGlobalScholarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
