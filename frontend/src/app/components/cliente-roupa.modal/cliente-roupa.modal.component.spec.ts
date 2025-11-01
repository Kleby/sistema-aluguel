import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteRoupaModalComponent } from './cliente-roupa.modal.component';

describe('ClienteRoupaModalComponent', () => {
  let component: ClienteRoupaModalComponent;
  let fixture: ComponentFixture<ClienteRoupaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteRoupaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteRoupaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
