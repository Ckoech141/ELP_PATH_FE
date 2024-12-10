import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsReadMoreComponent } from './news-read-more.component';

describe('NewsReadMoreComponent', () => {
  let component: NewsReadMoreComponent;
  let fixture: ComponentFixture<NewsReadMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsReadMoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsReadMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

