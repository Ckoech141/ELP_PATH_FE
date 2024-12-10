import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHubFeedsComponent } from './admin-hub-feeds.component';

describe('AdminHubFeedsComponent', () => {
  let component: AdminHubFeedsComponent;
  let fixture: ComponentFixture<AdminHubFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHubFeedsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminHubFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
