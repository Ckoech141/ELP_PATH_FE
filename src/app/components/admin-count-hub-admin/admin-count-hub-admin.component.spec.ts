import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCountHubAdminComponent } from './admin-count-hub-admin.component';

describe('AdminCountHubAdminComponent', () => {
  let component: AdminCountHubAdminComponent;
  let fixture: ComponentFixture<AdminCountHubAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCountHubAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCountHubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
