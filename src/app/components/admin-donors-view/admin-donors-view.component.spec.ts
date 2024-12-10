import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDonorsViewComponent } from './admin-donors-view.component';

describe('AdminDonorsViewComponent', () => {
  let component: AdminDonorsViewComponent;
  let fixture: ComponentFixture<AdminDonorsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDonorsViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDonorsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
