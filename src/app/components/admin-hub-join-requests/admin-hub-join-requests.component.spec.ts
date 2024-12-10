import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHubJoinRequestsComponent } from './admin-hub-join-requests.component';

describe('AdminHubJoinRequestsComponent', () => {
  let component: AdminHubJoinRequestsComponent;
  let fixture: ComponentFixture<AdminHubJoinRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHubJoinRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminHubJoinRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
