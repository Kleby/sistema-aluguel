import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AluguelCardComponent } from './aluguel-card.component';

describe('AluguelCardComponent', () => {
  let component: AluguelCardComponent;
  let fixture: ComponentFixture<AluguelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AluguelCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AluguelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
