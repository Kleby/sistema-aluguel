import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AluguelFormComponent } from './aluguel-form.component';

describe('AluguelFormComponent', () => {
  let component: AluguelFormComponent;
  let fixture: ComponentFixture<AluguelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AluguelFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AluguelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
