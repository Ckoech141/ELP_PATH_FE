import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCurrentScholarsComponent } from './admin-current-scholars.component';

describe('AdminCurrentScholarsComponent', () => {
  let component: AdminCurrentScholarsComponent;
  let fixture: ComponentFixture<AdminCurrentScholarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCurrentScholarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCurrentScholarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
