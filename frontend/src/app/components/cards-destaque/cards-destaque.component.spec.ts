import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsDestaqueComponent } from './cards-destaque.component';

describe('CardsDestaqueComponent', () => {
  let component: CardsDestaqueComponent;
  let fixture: ComponentFixture<CardsDestaqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsDestaqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsDestaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
