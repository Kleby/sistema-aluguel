import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteRoupaMoodalComponent } from './cliente-roupa.moodal.component';

describe('ClienteRoupaMoodalComponent', () => {
  let component: ClienteRoupaMoodalComponent;
  let fixture: ComponentFixture<ClienteRoupaMoodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteRoupaMoodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteRoupaMoodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
