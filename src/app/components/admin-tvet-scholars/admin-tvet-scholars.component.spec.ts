import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTvetScholarsComponent } from './admin-tvet-scholars.component';

describe('AdminTvetScholarsComponent', () => {
  let component: AdminTvetScholarsComponent;
  let fixture: ComponentFixture<AdminTvetScholarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTvetScholarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminTvetScholarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
