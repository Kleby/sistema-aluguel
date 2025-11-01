import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizaRoupaComponent } from './atualiza-roupa.component';

describe('AtualizaRoupaComponent', () => {
  let component: AtualizaRoupaComponent;
  let fixture: ComponentFixture<AtualizaRoupaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtualizaRoupaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtualizaRoupaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
