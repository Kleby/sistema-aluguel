import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarCategoriaComponent } from './adicionar-categoria.component';

describe('AdicionarCategoriaComponent', () => {
  let component: AdicionarCategoriaComponent;
  let fixture: ComponentFixture<AdicionarCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
