import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoupaCardComponent } from './roupa-card.component';

describe('RoupaCardComponent', () => {
  let component: RoupaCardComponent;
  let fixture: ComponentFixture<RoupaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoupaCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoupaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
