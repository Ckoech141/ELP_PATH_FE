import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddHubAdminComponent } from './admin-add-hub-admin.component';

describe('AdminAddHubAdminComponent', () => {
  let component: AdminAddHubAdminComponent;
  let fixture: ComponentFixture<AdminAddHubAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddHubAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAddHubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
